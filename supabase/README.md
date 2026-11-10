# Supabase · O Universo de Bobby · Fase 4

Backend da conta do responsável, sincronização e assinatura. Esta pasta tem só SQL, testes e este guia. Nenhuma chave está aqui nem vai estar: tudo em variável de ambiente (`.env.example` lista os nomes).

Estado em 24/10/2026: **escrito, não executado.** A máquina onde isto foi escrito não tem Postgres, Docker nem a CLI do Supabase. O primeiro `supabase db push` e o primeiro `testes/rls.sql` são a sessão S1 do `docs/fase4/PLANO.md`.

## 1. Arquivos

| Arquivo | O que faz |
|---|---|
| `migrations/0001_schema.sql` | 11 tabelas, gatilhos (carimbo, limite de 4 perfis, criar `responsavel` ao cadastrar, `so_cresce` em `perfil_estado` e `progresso_fase`), `limite_ok()` (só servidor) e `limite_ok_usuario()` (chave derivada de `auth.uid()`), revogação de privilégios do `anon` |
| `migrations/0002_rls.sql` | RLS ligada em todas as tabelas (sem FORCE, para os gatilhos `security definer` passarem); políticas só `to authenticated`; `perfil_e_meu()` |
| `migrations/0003_rpc.sql` | `acesso_liberado()`, `snapshot_perfil()`, `sincronizar_perfil()`, `exportar_meus_dados()`, `pedir_exclusao()`; gatilho que cria `perfil_estado` |
| `migrations/0004_checkout.sql` | `assinatura.provedor_checkout_id`: liga a assinatura ao Checkout do Asaas (o Bobby não cria cliente na API porque ela exige nome e CPF) |
| `testes/rls.sql` | 23 provas de RLS, privilégios e merge, em `BEGIN ... ROLLBACK` (não deixa rastro) |
| `functions/_shared/*.ts` | configuração (preço, tolerância, limites), Asaas, sessão e token em tempo constante, limite por conta, banco via PostgREST, log sem dado pessoal |
| `functions/criar-checkout`, `webhook-pagamento`, `cancelar-assinatura`, `pedir-reembolso` | Edge Functions da assinatura (S2). Testes: `deno test --no-remote supabase/functions` (Asaas, Auth e banco falsos) |
| `.env.example` | nomes das variáveis, sem valor |

As Edge Functions da assinatura existem desde 09/11/2026 e passam nos testes sem conta (`docs/fase4/ANDAMENTO.md`). Publicar o webhook sem verificação de JWT (ele confere o token do Asaas): `supabase functions deploy webhook-pagamento --no-verify-jwt`; as outras três com o padrão (`verify_jwt` ligado). `apagar-conta` e `relatorio-semanal` ainda não existem (S3 e S4).

## 2. Criar o projeto (mão do Filipe)

1. Entrar em supabase.com com a conta da empresa (não a pessoal), **Novo projeto**, região **South America (São Paulo)**, senha do banco gerada pelo gerenciador de senhas (nunca digitada em chat).
2. **Authentication → Providers → Email:** ligar. Marcar **Confirm email**. Desligar cadastro por telefone e todos os provedores sociais (não usamos).
3. **Authentication → Rate Limits:** os padrões do Supabase (lidos em 24/10/2026 em supabase.com/docs/guides/auth/rate-limits) são 2 e-mails por hora com o provedor interno, 60 s entre dois magic links para o mesmo e-mail, 30 pedidos por 5 min por IP em `/signup`, `/magiclink`, `/otp`, `/recover`, e 30 por 5 min em `/verify`. **Os 2 e-mails por hora bloqueiam o lançamento:** é obrigatório configurar SMTP próprio (passo 4). Depois do SMTP, deixar o envio de e-mail em no máximo 30 por hora e manter os outros padrões.
4. **Authentication → SMTP Settings:** preencher com o e-mail transacional (passo 6). Remetente `bobby@<domínio>`.
5. **Authentication → Attack protection:** ligar **Leaked password protection** (vale para quem escolher senha em vez de magic link) e CAPTCHA (Turnstile) no cadastro.
6. **Authentication → URL Configuration:** Site URL = `APP_URL`; Redirect URLs = `APP_URL/**`. Nada de `localhost` em produção.
7. **Authentication → Email Templates:** trocar os textos para português (modelos em `docs/fase4/CONSENTIMENTO-E-TERMOS.md`, seção 6). O magic link expira em 1 hora por padrão; pode baixar para 15 min.
8. **Settings → API:** copiar `URL`, `anon key` e `service_role key` para o `.env` local e para os segredos das Edge Functions (`supabase secrets set`). O `service_role` nunca entra no app nem no Cloudflare Pages.
9. **Database → Settings:** ligar **Point in Time Recovery** se o plano permitir; se não, agendar backup diário (o plano gratuito faz backup diário por 7 dias).

## 3. Rodar as migrações

Com a CLI (`brew install supabase/tap/supabase`):

```bash
cd /Users/filipealvesesilva/Projetos/universo-de-bobby
supabase login
supabase link --project-ref <ref-do-projeto>
supabase db push          # aplica 0001, 0002, 0003 e 0004 em ordem
```

Sem CLI: colar cada arquivo no **SQL Editor**, na ordem 0001 → 0002 → 0003. Cada um roda inteiro ou falha inteiro.

Para desenvolver sem tocar em produção: `supabase start` (precisa do Docker) sobe um Postgres local com o Auth; `supabase db reset` reaplica as migrações do zero.

## 4. Provar a RLS (obrigatório antes de qualquer dado real)

```bash
psql "$SUPABASE_DB_URL" -v ON_ERROR_STOP=1 -f supabase/testes/rls.sql
```

Ou colar `testes/rls.sql` no SQL Editor. O script:

- cria 2 adultos e 2 perfis de teste dentro de uma transação;
- confere pelo catálogo que **toda** tabela do `public` (11) tem `rowsecurity`, que **nenhuma** política vale para `public`/`anon` nem é `using (true)`, que `assinatura` e `pagamento` não têm política de escrita, e que `anon` não tem privilégio em tabela nenhuma;
- entra como o usuário A (`set local role authenticated` + `request.jwt.claims`) e prova que ele não lê, não insere (42501), não altera (0 linhas) nada do usuário B, não se dá assinatura, e que `sincronizar_perfil` nunca reduz estrelas nem moedas;
- entra como `anon` e prova 42501 nas 11 tabelas e nas RPCs;
- termina em `ROLLBACK`: nada fica no banco.

Resultado esperado: **23** linhas `NOTICE: OK: ...` e nenhuma `FALHA` (`psql ... 2>&1 | grep -c 'OK:'` tem de dar 23). Qualquer `FALHA` trava a fase (regra 4 da `seguranca-minima`).

Consulta de conferência rápida, para colar no SQL Editor quando quiser olhar:

```sql
select tablename, rowsecurity from pg_tables where schemaname = 'public';
select tablename, policyname, roles, cmd, qual, with_check
  from pg_policies where schemaname in ('public','storage') order by 1, 2;
```

Toda linha de `pg_policies` tem de mostrar `{authenticated}` em `roles`. Se aparecer `{public}`, é bug.

## 5. Segredos e varredura

- `.env` e `.env.*` já estão no `.gitignore` do projeto (confirmado em 24/10/2026). Criar o `.env` **antes** de colar a primeira chave.
- Antes de cada publicação: `gitleaks dir .` e `git grep -nE "service_role|sk_live|eyJhbGci|\\$aact_"` (prefixo da chave do Asaas) têm de voltar vazios.
- Nenhuma variável com `SERVICE`, `SECRET`, `KEY` ou `TOKEN` no nome vai para o `index.html`, para o `sw.js` nem para o Cloudflare Pages. O app só conhece `SUPABASE_URL` e `SUPABASE_ANON_KEY`.

## 6. O que o app grava e o que só o servidor grava

| Tabela | Responsável logado | Servidor (service_role) |
|---|---|---|
| `responsavel` | lê e altera a própria linha | cria (gatilho) e apaga (via `auth.users`) |
| `perfil`, `perfil_estado`, `progresso_fase`, `erro_pendente`, `dia_atividade` | tudo, só dos próprios perfis (de preferência via `sincronizar_perfil`) | |
| `assinatura`, `pagamento` | só lê as próprias | grava, pelo webhook |
| `consentimento` | lê e insere as próprias | insere a revogação ao apagar conta |
| `webhook_evento`, `limite_taxa` | nada | tudo |

## 7. Decisões abertas que este SQL já assume (mudar aqui se o Filipe decidir diferente)

- `max_perfis = 4` por família (decisão de 24/10/2026).
- Moedas são um razão (`moedas_ganhas`, `moedas_gastas`, saldo gerado). Gastar nunca é desfeito por sync; o único resíduo é dois aparelhos offline comprando no mesmo intervalo, que deixa a criança com dois itens pagando um (ARQUITETURA.md 5.5). Moeda não é dinheiro e nunca é vendida.
- Limites: sync 240/h por conta, exportação 5/dia, em `limite_ok_usuario()` (0001). Mudar lá, não no app.
- `pagamento` e `consentimento` ficam com `responsavel_id = null` quando a conta é apagada, em vez de sumirem. O prazo de guarda é decisão do contador e do advogado (CONSENTIMENTO-E-TERMOS.md, seção 7).
