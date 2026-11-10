# Fase 4 · Arquitetura: conta do responsável, sincronização e pagamento

Data: 24/10/2026. Branch lida: `reforma-fase-2` (só leitura; `src/`, `index.html` e `sw.js` não foram tocados). Arquivos gravados nesta rodada: `docs/fase4/*` e `supabase/*`. Nada publicado, nada apagado, nenhuma chave em código, nenhum crédito gasto.

Skills aplicadas, nesta ordem: `architect-first` (desenho antes do código, opções A/B/C, nada de valor mutável em código), `seguranca-minima` (os 7 itens, no desenho), `lgpd-gate` (as 7 perguntas, com dado de criança), `supabase-postgres-best-practices` (RLS com `(select auth.uid())`, função de apoio `stable security definer`, índice em toda coluna de política, jsonb só onde o app lê o bloco inteiro).

Marcas: **DADO (fonte)** é o que abri e li; **OPINIÃO** é leitura minha; **[FILIPE]** precisa da mão ou da decisão dele; **[ADV]** e **[CONT]** precisam de advogado e contador. Isto não é parecer jurídico nem contábil.

**Decisões do Filipe que este documento obedece (24/10/2026):** Fase 4 começa agora; sem período de teste gratuito (tudo pago desde o primeiro dia); assinatura do responsável por família, até 4 perfis; R$ 47/mês ou R$ 297/ano (decisão do Filipe em 08/11/2026; substitui a sugestão R$ 19,90 e R$ 149 da mesa 05); web primeiro (PWA + cartão + Pix), lojas depois.

**Conflito com o que está registrado, para o Filipe confirmar (regra da casa: avisar antes, nunca sobrescrever em silêncio).** A mesa 05 (§3, §6 item 3 e §10.1) e a síntese 00 (C8 e Q3) recomendam **1 planeta grátis para sempre** (ou as 3 primeiras etapas de cada planeta) com muro que nunca se move, e a síntese Q4 recomenda abrir a Fase 4 **depois** do piloto local de 60 dias. A decisão de hoje ("sem teste grátis", "imediatamente") contraria as duas. Este documento segue a decisão de hoje e deixa o muro **parametrizado** (seção 6.5) para que trocar para "3 etapas grátis" seja uma constante, não uma reforma. Pergunta única no PLANO.md, seção 5.

---

## 1. Resumo em 10 linhas

1. **A conta é do adulto.** Supabase Auth por e-mail com magic link (senha opcional). A criança nunca vê login: escolhe o bonequinho, como hoje.
2. **O aparelho continua sendo a verdade imediata.** `localStorage['universo-bobby-v4']` segue sendo a escrita instantânea; a nuvem é sincronização em segundo plano, offline-first.
3. **Merge "maior progresso vence"**, por bloco e por item, com carimbo do aparelho. Conflito nunca reduz estrelas, moedas, XP ou itens comprados.
4. **11 tabelas, RLS em todas**, políticas só `to authenticated`; `assinatura` e `pagamento` são só leitura para o responsável e só o webhook (service_role) grava.
5. **Da criança só sobem apelido, cor, faixa e progresso.** Sem data de nascimento, foto, e-mail, voz, localização ou identificador de aparelho (mesma lista da auditoria `docs/AUDITORIA-SEGURANCA-LGPD.md`, 6.1).
6. **Pagamento:** recomendo **Asaas** para o primeiro ano (assinatura nativa com Pix e cartão, Pix recorrente, NFS-e integrada, sem mensalidade), com Stripe como plano B se o Filipe preferir cartão e o convite do Pix sair. Comparação na seção 7.
7. **Fluxo:** criar conta → aceitar termos e consentimento parental → escolher plano → pagar no checkout do provedor → webhook marca `assinatura.acesso_ate` → app libera. Sem assinatura ativa, o app mostra o muro; quem já jogava local não perde nada.
8. **Primeira conta migra o `localStorage`** existente (os perfis v4, pelo `id` local), com validação igual à da migração v3→v4: se algo não bate, não grava e avisa.
9. **LGPD por desenho:** exportar tudo em JSON (`exportar_meus_dados`), apagar conta de verdade (cancela no provedor, apaga `auth.users`, cascata), prova de consentimento por versão de texto, canal do encarregado.
10. **Os 7 itens da `seguranca-minima`** estão mapeados na seção 9 com o que já está pronto no SQL e o que trava a publicação até ser feito.

---

## 2. O que existe hoje e o que muda

| Hoje (DADO, código e `README-FASE-3-LOGICA.md`) | Fase 4 |
|---|---|
| Tudo em `localStorage['universo-bobby-v4']`; `mundo-numeros-v2` só lida como cópia | Continua. A nuvem recebe cópia sincronizada; nenhuma chave local muda de formato |
| PIN do responsável com PBKDF2 (`arrumarStore` aceita `senha.v === 2`) | Continua como **trava de interface** contra a criança. O portão de verdade é a sessão do Supabase Auth |
| Backup `.json` manual, importar e exportar | Continua (serve de backup offline e de portabilidade). Ganha o botão "Exportar tudo da conta" (LGPD) |
| Perfis ilimitados no aparelho | Até 4 por família (gatilho no banco + aviso no app) |
| Sem conta, sem rede, sem pagamento | Conta, sync, assinatura, webhook, e-mail transacional |
| Eventos de medição locais (`universo-bobby-eventos-v1`) | **Continuam locais.** Não sobem nesta fase (seria tratamento novo, com RIPD; auditoria 6.3) |
| Relatório do responsável dentro do app | Continua. O relatório semanal por e-mail é opt-in e entra na sessão S5 do PLANO |

---

## 3. Visão geral dos componentes

```
+--------------------------+        HTTPS         +----------------------------------+
|  PWA (Cloudflare Pages)  | <------------------> |  Supabase (sa-east-1)            |
|  index.html, sw.js       |   supabase-js        |   Auth (e-mail magic link)        |
|  localStorage v4 (verdade|   anon key + JWT     |   Postgres + RLS (11 tabelas)     |
|  imediata)               |                      |   RPC: sincronizar_perfil, ...    |
|  outbox de sync          |                      |   Edge Functions (Deno):          |
|  cache de acesso         |                      |     criar-checkout                |
+--------------------------+                      |     webhook-pagamento  <----------+---- Asaas (webhook assinado por token)
          |                                       |     cancelar-assinatura           |
          | abre em nova aba                      |     apagar-conta                  |
          v                                       |     relatorio-semanal (cron)      |
+--------------------------+                      +----------------------------------+
|  Checkout do provedor    |                                   |
|  (página do Asaas)       |                                   v
+--------------------------+                      +----------------------------------+
                                                  |  E-mail transacional (SMTP)       |
                                                  +----------------------------------+
```

- **O app nunca fala com o provedor de pagamento.** Pede à Edge Function `criar-checkout` um link e abre a página do provedor. Nenhum dado de cartão passa pelo Bobby.
- **O app nunca usa `service_role`.** Só `SUPABASE_URL` e `SUPABASE_ANON_KEY` entram no `index.html`; a RLS é o que protege.
- **Tudo que decide dinheiro acontece no servidor** (webhook → `assinatura.acesso_ate`). O app só lê.

### Opções consideradas (architect-first)

| Opção | Prós | Contras | Decisão |
|---|---|---|---|
| **A. Supabase (Auth + Postgres + Edge Functions)** | Um fornecedor; RLS no banco; já é o padrão da casa (Avenue, Jarvis); região São Paulo; plano gratuito cobre o beta | Edge Functions em Deno (mais uma runtime); limite de 2 e-mails/hora sem SMTP próprio | **Escolhida** |
| B. Cloudflare Workers + D1 + Auth próprio | Mesmo host do Pages; Workers já conhecidos | Sem RLS nativa; auth próprio é guardar senha (regra 2 da `seguranca-minima` proíbe); mais código de segurança para escrever | Descartada |
| C. Firebase | Maduro, SDK offline pronto | Regras de segurança em linguagem própria, difícil de provar por consulta; dado fora do Brasil por padrão; não é o padrão da casa | Descartada |

---

## 4. Autenticação (Supabase Auth)

- **Só o responsável loga.** E-mail + **magic link** (OTP por link) como caminho principal; **senha opcional** para quem quiser (com proteção de senha vazada ligada). Sem provedores sociais nesta fase (menos superfície, menos termos de terceiro).
- **Por que magic link:** o adulto abre o link no próprio e-mail; isso já é um primeiro "esforço razoável" de provar que é um adulto com e-mail próprio (OPINIÃO; o que conta como verificação parental é [ADV], seção 8 do CONSENTIMENTO-E-TERMOS.md).
- **Confirmação de e-mail obrigatória** antes de qualquer gravação no banco (o gatilho `criar_responsavel_ao_cadastrar` cria a linha de `responsavel`; a política de RLS exige `auth.uid()`, que só existe com sessão).
- **Sessão no aparelho:** o `supabase-js` guarda o refresh token no `localStorage` (chave própria, `sb-<ref>-auth-token`). O app trata a sessão como a sessão do **responsável**; a criança continua escolhendo perfil sem senha. A área do responsável continua atrás do PIN local (trava de interface) **e** só funciona com sessão válida para o que toca a nuvem (apagar conta, exportar, assinatura).
- **Limites de tentativa (item 3 da `seguranca-minima`, DADO supabase.com/docs/guides/auth/rate-limits, 24/10/2026):** 60 s entre dois magic links para o mesmo e-mail; 30 pedidos por 5 min por IP em cadastro, magic link e recuperação; 30 por 5 min em `/verify`; 150 por 5 min em `/token`. O envio de e-mail do provedor interno é **2 por hora**, o que inviabiliza o lançamento: **SMTP próprio é obrigatório** antes do primeiro usuário. Turnstile no cadastro.
- **Expiração:** magic link em 15 min (padrão 1 h; reduzir). Sessão com refresh; o app não força logout para não interromper a criança.
- **Várias pessoas da mesma família:** uma conta (um e-mail) por família nesta fase. Dois adultos no mesmo e-mail compartilhado é escolha deles. "Conta compartilhada entre dois adultos" fica para depois (precisa de convite e de nova linha no RIPD).

---

## 5. Modelo de dados e sincronização offline-first

### 5.1 Tabelas (SQL pronto em `supabase/migrations/0001_schema.sql`)

| Tabela | Chave | O que guarda | Quem grava |
|---|---|---|---|
| `responsavel` | `id = auth.users.id` | opt-in do relatório, pedido de exclusão, carimbos. **Sem nome, CPF, telefone, endereço.** O e-mail fica em `auth.users` | gatilho cria; responsável altera a própria |
| `perfil` | `id` uuid; `unique(responsavel_id, id_local)` | apelido (≤ 18), cor (hex), faixa (`f78`,`f910`,`f1112`), `id_local` (o `p...` do aparelho) | responsável |
| `perfil_estado` | `perfil_id` | `xp`, `moedas_ganhas`, `moedas_gastas` (o saldo `moedas` é coluna gerada `ganhas - gastas`), `acertos_total`, `melhor_combo`, `comprado` (só crescem); blocos `materia`, `look`, `config`, `ofensiva`, `colecao`, `desenhos`, `revisao_meta`, `prefs` com `blocos_em` (carimbo por bloco) | responsável, via RPC |
| `progresso_fase` | `(perfil_id, fase_id)` | estrelas 0..3, acertos, erros, tempo, concluída em | responsável, via RPC |
| `erro_pendente` | `(perfil_id, chave)` | item da revisão espaçada: caixa, próxima, vezes, acertos, lapsos, último, pergunta (só `er:*`, texto puro), removido, `carimbo` do aparelho | responsável, via RPC |
| `dia_atividade` | `(perfil_id, dia)` | blocos, perguntas, acertos, revisões, segundos (teto 86.400) | responsável, via RPC |
| `assinatura` | `id`; única vigente por família | provedor, ids do provedor, plano, valor, status, `acesso_ate`, `max_perfis`, cancelamento | **só servidor** |
| `pagamento` | `id`; `provedor_pagamento_id` único | valor, método, status, vencimento, pago em, número e link da NFS-e. **Nunca cartão, CPF ou nome** | **só servidor** |
| `consentimento` | `id` | tipo (`termos`, `privacidade`, `parental`, `relatorio_email`), versão do texto, aceito/revogado, hash do texto, user agent (≤ 200), hash do IP | responsável insere; ninguém edita |
| `webhook_evento` | `id` do evento | só id, tipo e carimbos, para idempotência. **Payload não é guardado** | só servidor |
| `limite_taxa` | `chave` | contador por janela (`limite_ok()`) | só servidor e funções |

O que **não** vai para o banco (igual ao relatório de 02/09/2026, §5.5): as 150 fases, aulas, missões, perguntas, SVGs, clipes. É código. A `pergunta` congelada em `erro_pendente` é a exceção necessária (sem ela a revisão do erro não se refaz), e só entra texto puro: o app aplica `perguntaSegura()` antes de subir e o servidor limita a 4 KB.

### 5.2 Mapa do estado v4 para as tabelas

| Campo em `S` (`src/interface/estado.js`) | Destino | Regra de merge |
|---|---|---|
| `nome`, `cor`, `faixa`, `id` do perfil | `perfil.apelido`, `.cor`, `.faixa`, `.id_local` | aparelho manda; o servidor só valida |
| `xp`, `acertosTotal`, `melhorCombo` | `perfil_estado` colunas | `GREATEST` |
| `moedas` (saldo) | `moedas_aparelho` (contador de cada aparelho) somado em `perfil_estado.moedas_ganhas` e `.moedas_gastas` (o saldo é coluna gerada `ganhas - gastas`) | `GREATEST` no contador de cada aparelho, total = soma; ver 5.5. Perfil existente: `gastas = soma de PRECOS[item] para item em comprado`, `ganhas = moedas + gastas` |
| `comprado` | `perfil_estado.comprado` | união |
| `materia`, `look`, `config`, `ofensiva`, `colecao`, `desenhos`, `revisao.{ultimoAquecimento,ajustadoEm,aliviadoEm}`, `{som,voz,musica,vibra,velocidade}` | blocos de `perfil_estado` | carimbo do bloco mais novo vence |
| `feitas[fase] = estrelas`, `stats.porLicao[fase]` | `progresso_fase` | `GREATEST` por campo; `concluida_em` = o mais antigo |
| `revisao.itens[chave] = [caixa, due, n, acertos, lapsos, ultimo, ...]`, `revisao.congelados[chave]` | `erro_pendente` | carimbo do item mais novo vence (contadores `vezes`, `acertos`, `lapsos` por `GREATEST`) |
| `stats.dias[dia] = {b, q, ac, rev, seg}` | `dia_atividade` | `GREATEST` por campo |
| `diario`, `semana`, `espera`, `missHist`, `cer`, `stats.amostras`, `errados` (legado), `legado.*`, `matEsc` | **não sobem** | são do dia, derivados ou legado; reconstroem-se do resto |
| `pid` de medição e eventos | **não sobem** | medição fica local nesta fase |
| `STORE.senha` (PIN) | **não sobe** | trava local; o portão na nuvem é o Auth |

### 5.3 Fluxo de sincronização

1. **Escrita local continua igual.** `salvar()` grava no `localStorage` como hoje. Zero latência de rede na pergunta.
2. **Marcação de bloco sujo.** Cada ponto que altera um bloco (`look`, `config`, ...) marca `blocos_em[bloco] = agora` numa chave nova `universo-bobby-sync-v1` (outbox: perfil → blocos sujos, fases tocadas, itens tocados, dias tocados). Não muda o formato do v4.
3. **Empurrar (push):** com atraso de 5 s após a última gravação (debounce), ao esconder a aba (`visibilitychange`), ao fechar a fase e ao voltar a rede (`online`). Chama `sincronizar_perfil(perfil, estado, fases, itens, dias)` **só com o que está sujo** (estado inteiro é pequeno; fases e itens só os tocados). A RPC devolve o snapshot mesclado.
4. **Aplicar o merge no aparelho:** o app aplica o snapshot com as **mesmas regras** (`GREATEST`, união, carimbo) por cima do estado local, passa tudo por `estadoDe()` (que já valida tipo, tamanho e texto) e grava. Assim aparelho e nuvem convergem mesmo que o servidor tenha dado algo mais novo de outro aparelho.
5. **Puxar (pull):** ao abrir o app com sessão e rede, e ao trocar de perfil: `snapshot_perfil(perfil)` → merge local. Com cache de 60 s para não martelar.
6. **Offline:** nada muda para a criança. A outbox acumula; o teto é o próprio `localStorage`. Quando volta a rede, um push resolve tudo (o merge é idempotente).
7. **Vários aparelhos:** cada um empurra e puxa; o servidor é o ponto de encontro. Sem websocket, sem Realtime nesta fase (OPINIÃO: para 1 criança jogando num aparelho por vez, pull ao abrir basta; Realtime entra se aparecer a "Liga da família").
8. **Limite:** `limite_ok_usuario('sync')` dentro da RPC: 240 por hora **por conta** (4 perfis × 60/h). Para caber nisso, o push tem **intervalo mínimo de 60 s por perfil** depois do debounce de 5 s (gravações dentro do minuto se juntam num push só); só o fim de fase, o `visibilitychange` e o `online` furam o intervalo, e esses três são raros. Teto teórico com um perfil jogando sem parar: cerca de 70/h, bem abaixo dos 240. A chave do contador é derivada de `auth.uid()` no servidor; o usuário não escolhe a chave, então não consegue esgotar o limite de outra família. Se bater, o app guarda e tenta depois; nunca mostra erro para a criança.

### 5.4 Por que "maior progresso vence" e não "último grava"

Último grava (LWW) no estado inteiro é o que faz uma criança perder uma tarde de fases porque o tablet antigo sincronizou depois do celular novo. Com `GREATEST` em tudo que só cresce, a pior consequência de um conflito é **ganhar** um pouco a mais, nunca perder. Para o que não é monotônico (que roupa o Bobby veste, configuração do responsável), LWW por bloco é o certo: a última escolha vale.

### 5.5 Moedas: o caso difícil e a decisão

Moeda é gasta, então o **saldo** não é monotônico. `GREATEST` no saldo seria um erro grave, mesmo com um aparelho só: a criança tem 120, compra o Teo por 80, fica com 40; o push manda 40, o servidor mantém 120, o snapshot devolve 120 e o app volta para 120 com o Teo comprado. Todo gasto seria desfeito a cada sync.

**Decisão:** **razão de moedas por aparelho** (desde a `0006_moedas_por_aparelho.sql`, 09/11/2026). Cada aparelho tem o próprio contador em `moedas_aparelho` (`ganhas` e `gastas` daquele aparelho, só crescem, `GREATEST` por aparelho). `perfil_estado.moedas_ganhas` e `moedas_gastas` são a **soma** dos aparelhos, e o saldo é coluna gerada `greatest(ganhas - gastas, 0)`. Gastar **sobe** `gastas` do aparelho; ganhar **sobe** `ganhas` do aparelho. O `aparelho_id` é um texto aleatório sorteado uma vez por instalação (outbox), sem relação com pessoa nem aparelho físico. Desde a `0007_saldo_so_pela_rpc.sql`, só a RPC grava esses contadores, e cada chamada aceita no máximo 5000 `ganhas` a mais por aparelho (o excesso é limitado, registrado em `moedas_limitadas` e sobe nas chamadas seguintes, porque o aparelho não baixa o próprio contador). Abaixo do teto o saldo continua sendo confiança no cliente (ANDAMENTO 6). Assim:

- um aparelho atrasado nunca devolve moeda gasta nem apaga moeda ganha (teste 13 do `rls.sql` prova; mensagem velha do mesmo aparelho não ganha do contador dele);
- **ninguém perde moeda ganha**, nem com dois aparelhos offline: base 100, o tablet ganha 50, o celular ganha 30, o total fica 180 (teste 13e do `rls.sql` e caso a11 de `testes/nuvem.js`). Até a 0005 o merge era `GREATEST` no total e ficava 150: os 30 do celular sumiam;
- dois aparelhos offline comprando: as duas compras contam (`gastas` soma), e `comprado` = união. Se os dois compraram o MESMO item, a criança paga duas vezes por um item só. É o resíduo do modelo novo, raro (dois aparelhos offline comprando a mesma coisa entre dois syncs). PENDENTE: devolver o preço quando o mesmo item aparece pago em dois aparelhos (precisa de preço no servidor);
- repetir o mesmo envio (rede ruim) não soma de novo: é `GREATEST` no contador do aparelho;
- chamada sem `aparelho_id` (cliente antigo) cai no aparelho `legado`, com a regra antiga; o total que já existia vira a linha `legado`;
- teto de 50 aparelhos por perfil (cada reinstalação que limpa o armazenamento é um aparelho novo); passou disso, a RPC recusa e o app guarda e tenta depois.

**O que isso pede do app (S5):** hoje `S` tem só `xp` e `moedas` (saldo). O `xp` **não** serve como "total ganho" porque o baú credita moedas sem XP (`ciclo.js:77,81,86,288`, DADO). Então `nuvem.js` mantém dois contadores acumulados no estado (`moedasGanhas`, `moedasGastas`) alimentados nos pontos de crédito (`licao.js:481,568`, `ciclo.js:77,81,86,288`) e de débito (`personagem.js:135,158`). Para perfis que já existem, na primeira conta: `gastas = soma de PRECOS[item] para item em comprado` (catálogo único em `economia.js`; itens grátis, como o primeiro presente do baú e o companheiro herdado da v3, valem 0) e `ganhas = moedas + gastas`. É determinístico e confere com o saldo que a criança vê.

### 5.6 Migração do estado local na primeira conta

Roda **uma vez**, depois do primeiro login com e-mail confirmado e **antes** de qualquer sync:

| Passo | Ação |
|---|---|
| 1 | Lê `universo-bobby-v4` (já migrado do v3 pelo código atual; se não existir, instalação nova, nada a migrar) |
| 2 | Para cada perfil local (até 4; se houver mais, mostra a lista e o responsável escolhe quais sobem; os demais ficam só no aparelho e o app avisa) cria `perfil` com `id_local = id`, apelido, cor, faixa |
| 3 | Chama `sincronizar_perfil` com o estado completo, todas as fases, itens e dias (primeira vez sobe tudo) |
| 4 | **Valida** o snapshot devolvido: contagem de fases ≥ local, `xp` ≥ local, `moedas` ≥ local, `comprado` ⊇ local. Se falhar, **não marca como migrado**, registra `sync_migracao_falhou` (evento local) e mostra "Não consegui guardar na nuvem ainda. Seu progresso está todo aqui no aparelho." Tenta de novo depois |
| 5 | Grava em `universo-bobby-sync-v1` o mapa `id_local → perfil.id` e `migradoEm` |
| 6 | **Nunca apaga** nada local. O `localStorage` continua sendo a verdade imediata |

Segundo aparelho com a mesma conta: o app lista os perfis da nuvem e os locais; os que coincidem por `id_local` se juntam; os que só existem num lado aparecem para o responsável decidir "juntar com X" ou "manter separado". Nada silencioso (mesma regra do import de backup).

---

## 6. Assinatura, muro e liberação

### 6.1 Planos

| Plano | Preço (decisão do Filipe, mesa 05 §7) | Perfis | Renovação |
|---|---|---|---|
| Mensal | R$ 47,00 | até 4 | automática, aviso por e-mail antes de cada cobrança |
| Anual | R$ 297,00 | até 4 | automática, aviso 7 dias antes; direito de arrependimento em 7 dias (CDC art. 49, citado de memória na mesa 05; [ADV] confirma) |

Preço e `max_perfis` ficam na Edge Function como **configuração** (`PLANOS` em arquivo próprio, nunca no app). O app lê o preço da função para exibir (nada hardcoded no `index.html`). A tela de preço fica **na área do responsável, atrás do PIN e da sessão**; a criança nunca vê preço, nem contagem regressiva, nem desconto (Decreto 12.880 art. 10, pesquisa 03).

### 6.2 Estados da assinatura

```
pendente ──(pagamento confirmado)──> ativa ──(renovação paga)──> ativa
    │                                  │  └─(cobrança falhou)──> atrasada ──(paga em até N dias)──> ativa
    │                                  │                             └─(não paga)──> expirada
    │                                  └─(cancelou)──> cancelada (acesso até acesso_ate) ──> expirada
    └─(desistiu / 7 dias)──> expirada                 └─(reembolso em 7 dias)──> reembolsada
```

**Fonte única da verdade para liberar: `assinatura.acesso_ate > now()`.** Status é informação; a data é a regra. O webhook empurra `acesso_ate` a cada pagamento confirmado: fim do ciclo + **3 dias de tolerância** (OPINIÃO: cobre feriado e atraso do Pix sem punir a criança). Cancelar não derruba o acesso: vale até `acesso_ate`, como manda o bom senso e o CDC.

### 6.3 Fluxo completo

```
1. Responsável abre "Para o responsável" → "Assinatura" (atrás do PIN)
2. Sem conta: cria conta (e-mail → magic link → volta ao app logado)
3. Aceita termos, política e consentimento parental (3 caixas separadas, texto visível; grava 3 linhas em consentimento)
4. Escolhe Mensal ou Anual
5. App chama Edge Function criar-checkout (JWT no cabeçalho):
     - valida sessão (supabase.auth.getUser)
     - limite_ok('checkout:'||uid, 10, '1 day')
     - cria/recupera cliente no provedor (só e-mail; CPF se o provedor exigir para NFS-e [CONT], pedido na própria página do provedor, nunca guardado no Bobby)
     - cria assinatura no provedor (plano, valor, ciclo) → devolve URL do checkout
     - grava assinatura(status='pendente', provedor_assinatura_id)
6. App abre a URL em nova aba. Responsável paga (cartão ou Pix) na página do provedor
7. Provedor chama webhook-pagamento:
     - confere o token do cabeçalho (ASAAS_WEBHOOK_TOKEN) → 401 se não bater
     - idempotência: insert em webhook_evento(id); se já existe, responde 200 e sai
     - PAYMENT_CONFIRMED / RECEIVED → upsert pagamento; assinatura.status='ativa'; acesso_ate = fim do ciclo + 3 dias
     - PAYMENT_OVERDUE → status='atrasada' (acesso_ate não muda)
     - PAYMENT_REFUNDED → status='reembolsada'; acesso_ate = now()
     - SUBSCRIPTION_DELETED / cancelamento → status='cancelada' (acesso até acesso_ate)
     - responde 200 rápido; trabalho pesado (e-mail de recibo) em segundo plano
8. App, ao voltar ao foco, chama acesso_liberado() → {liberado:true, acesso_ate} → grava cache local → muro sai
9. E-mail de confirmação para o responsável (recibo do provedor + nota fiscal quando emitida [CONT])
```

### 6.4 Cache de acesso e offline

O app guarda `{liberado, acesso_ate, conferidoEm}` em `universo-bobby-sync-v1`. Regra: **liberado offline enquanto `agora < acesso_ate`** (a data já tem os 3 dias de tolerância). Sem rede e sem cache (primeira abertura num aparelho novo), mostra o muro com "Conecte uma vez para confirmar a assinatura". Relógio do aparelho adiantado não libera nada a mais do que a data que o servidor deu; atrasado, no máximo prolonga 3 dias. Toda vez que há rede, reconfere.

### 6.5 O muro (sem assinatura ativa)

Constante de configuração `MURO = { modo: 'tudo-pago' | 'etapas-gratis', etapasGratis: 3 }`, lida pelo app (hoje `'tudo-pago'`, decisão do Filipe). Trocar o modo é trocar a constante. [FILIPE] confirma na pergunta única do PLANO.

Comportamento com `tudo-pago`:

| Situação | O que a criança vê | O que o responsável vê |
|---|---|---|
| Instalação nova, sem conta | Tela do Bobby: "Peça para um adulto preparar o foguete" + botão que abre a área do responsável (atrás do PIN). **Sem preço, sem urgência, sem contagem.** | Criar conta e assinar |
| **Já jogava local** (v4 com progresso), sem conta | Mesma tela, com o Bobby dizendo que o progresso está guardado. O mapa **fica visível** em modo leitura (estrelas, desenhos pintados, look), nada some; só não abre fase nova | Tudo da área do responsável continua funcionando: relatório, exportar backup, apagar dados. "Assinar" aparece como opção, não como bloqueio do que já é dele |
| Conta criada, consentimento dado, pagamento pendente | Idem | "Aguardando confirmação do pagamento" com botão de reabrir o checkout |
| Assinatura ativa | Jogo completo | Tudo |
| Cancelada, dentro de `acesso_ate` | Jogo completo | "Sua assinatura vale até <data>. Reativar." |
| Expirada ou reembolsada | Volta ao muro; progresso intocado local e na nuvem | Reassinar; exportar; apagar |

Regra dura: **ninguém perde progresso por deixar de pagar.** Nem local, nem na nuvem (os dados ficam até o responsável apagar a conta ou pelo prazo de retenção da política, seção 8). Isso é o oposto da queixa número 1 das avaliações de concorrentes ("paguei e não entra", "muro que se move"; mesa 05 §2.2).

### 6.6 Cancelar, reembolsar, trocar de plano

- **Cancelar em um toque**, na área do responsável, sem telefone, sem "tem certeza?" repetido, sem oferta de retenção que esconda o botão (Decreto art. 10 I, obstrução). A Edge Function `cancelar-assinatura` cancela no provedor e grava `cancelada_em`; o acesso segue até `acesso_ate`. E-mail de confirmação.
- **Arrependimento em 7 dias** (anual e mensal): botão "Pedir reembolso" ativo nos 7 primeiros dias; a função pede o estorno ao provedor; status `reembolsada`; acesso cai na hora. Prazo e texto [ADV].
- **Trocar mensal → anual:** cancela a mensal no fim do ciclo e cria a anual; nada de cálculo proporcional nesta fase (simples e explicável). Anual → mensal só no vencimento.

---

## 7. Pagamento: Stripe x Pagar.me/Stone x Asaas

Tudo abaixo é do que abri em 24/10/2026. Onde não consegui abrir, está marcado. Taxas mudam; conferir de novo antes de assinar o contrato.

| Critério | Stripe (BR) | Pagar.me / Stone | Asaas |
|---|---|---|---|
| Cartão nacional | **3,99% + R$ 0,39** (DADO stripe.com/br/pricing) | **4,19%** à vista (DADO pagar.me/precos) | **Não confirmado**: a página de preços exige login; o blog (26/09/2025, atualizado 23/04/2026) diz só que a taxa é fixa independente das parcelas. **DADO FRACO: pedir a tabela no cadastro** |
| Pix | **1,19%, só por convite** (DADO pricing) | **0,99%** (DADO) | **R$ 0,99 por transação nos 3 primeiros meses, R$ 1,99 depois** (DADO blog taxas). Em R$ 47 isso é **4,2%**; em R$ 297 é 0,7% |
| Assinatura recorrente em BRL | Billing: **+0,7%** do volume. Cartão recorrente ok. **Pix: só pagamento avulso; "O Pix Automático não está disponível para empresas domiciliadas no Brasil"** (DADO docs.stripe.com/payments/pix, lido 24/10/2026) | Página cita "venda por assinatura" e "pagamento por recorrência" (DADO); a doc de assinaturas deu 404; detalhe de Pix recorrente **não confirmado** | **Assinatura nativa** com boleto, Pix e cartão: gera a cobrança a cada ciclo (40, 14 ou 7 dias antes), tenta o cartão no vencimento; **Pix Automático** com criação automática de cobranças (changelog 19/05/2026) (DADO docs.asaas.com) |
| Webhook | Maduro, assinado por `Stripe-Signature` (HMAC) | Existe (não abri o detalhe) | Existe; autentica por token no cabeçalho `asaas-access-token` (DADO docs) e eventos por cobrança (`PAYMENT_*`) |
| Nota fiscal (NFS-e) | Não emite; precisa de integração externa ou contador | Não achei menção | **NFS-e integrada**, cobrada por nota emitida, com emissão automática para as cobranças da assinatura (DADO blog e docs) |
| Cancelamento fácil (CDC) | Customer Portal pronto (cancelar, trocar cartão) | Via API (sem portal pronto confirmado) | Via API; portal do pagador existe mas não confirmei o cancelamento pelo próprio assinante. **No Bobby o botão é nosso, na área do responsável, qualquer que seja o provedor** |
| Mensalidade | 0 | 0 | 0 (DADO blog) |
| Suporte e documentação | Excelente, em inglês e português; SDKs | Em português | Em português; doc razoável |
| Conta de padaria, anual R$ 297 | 297 × 4,69% + 0,39 = R$ 14,32 → sobram **R$ 282,68** | Pix: R$ 2,94 → **R$ 294,06**; cartão 4,19%: R$ 12,44 → **R$ 284,56** | Pix: R$ 1,99 → **R$ 295,01** + NFS-e por nota; cartão: depende da taxa não confirmada |
| Conta de padaria, mensal R$ 47 | cartão: R$ 2,59 → R$ 44,41 | Pix: R$ 0,47; cartão: R$ 1,97 | **Pix: R$ 1,99 (4,2%)**; cartão: ? |

**Recomendação (OPINIÃO, com os dados acima): Asaas no primeiro ano**, por três motivos que pesam mais que taxa: (1) é o único dos três em que **assinatura com Pix** existe de fato para empresa brasileira, e Pix é metade do argumento "web primeiro, cartão e Pix" do Filipe; (2) **NFS-e integrada por cobrança**, que tira do contador a emissão manual de cada mensalidade (o contador decide se usa [CONT]); (3) tudo em português, para uma pessoa só cuidar.

**Condições para fechar o Asaas** (sessão S0 do PLANO, antes de qualquer código): confirmar a taxa de cartão à vista e recorrente na tabela da conta; testar o sandbox (criar assinatura, pagar com cartão de teste e com Pix simulado, receber os webhooks `PAYMENT_CONFIRMED`, `PAYMENT_OVERDUE`, `PAYMENT_REFUNDED`); confirmar que a NFS-e automática funciona para o município da empresa. Se a taxa de cartão vier acima de **5%** ou o sandbox falhar nos webhooks, **plano B: Stripe** para cartão (Billing + Customer Portal, melhor experiência de cancelamento) **e sem Pix mensal**; Pix só no anual, avulso, com lembrete de renovação por e-mail 15 dias antes.

**Com o mensal a R$ 47, o Pix do Asaas custa 4,2% (era 10% a R$ 19,90).** Sugestão [FILIPE]: aceitar Pix nos dois planos (anual a R$ 1,99 em R$ 297 é 0,7%) e medir quantos escolhem cada forma.

**O que fica igual qualquer que seja o provedor:** o app nunca vê cartão; o webhook é a única coisa que libera acesso; o botão de cancelar é nosso; preço e plano são configuração do servidor.

---

## 8. LGPD por desenho (resposta às 7 perguntas da `lgpd-gate`)

| # | Pergunta | Resposta na Fase 4 |
|---|---|---|
| 1 | De onde veio a base? | Só quem criou conta no app. Nenhuma lista, nenhuma importação, nenhum contato do beta sem conta própria |
| 2 | Base legal? | **[ADV]**. Desenho proposto: dado necessário ao serviço (e-mail do adulto, apelido, cor, faixa, progresso) por execução de contrato; **consentimento parental específico e em destaque** registrado em `consentimento(tipo='parental')` para o tratamento do dado da criança (LGPD art. 14 §1º, pesquisa 03 §2.2) e documentação do melhor interesse (Enunciado ANPD 1/2023); relatório por e-mail por consentimento separado e revogável. Nada de medição sobe |
| 3 | Opt-out em toda mensagem? | E-mails transacionais (magic link, recibo, aviso de cobrança) não têm opt-out porque são do serviço. Relatório semanal: link "não quero mais receber" em todo e-mail, que grava `consentimento(aceito=false)` e `responsavel.relatorio_email=false` |
| 4 | Onde fica e por quanto tempo? | Supabase, região São Paulo. Perfil e progresso: enquanto a conta existir. Conta sem assinatura ativa e sem login há **24 meses**: aviso por e-mail e, 30 dias depois, exclusão automática (OPINIÃO; prazo [ADV]). `pagamento`: prazo fiscal [CONT]. `consentimento`: enquanto durar o tratamento e pelo prazo que o advogado definir (pesquisa 03 §4.4). `webhook_evento`: 90 dias. `limite_taxa`: 7 dias |
| 5 | Quem acessa? | RLS em tudo (0002); `service_role` só nas Edge Functions; painel do Supabase com 2FA e só o Filipe; nenhum dado de criança em log (a função registra só ids) |
| 6 | Credenciais fora do código? | `.env` no `.gitignore` (confirmado); `.env.example` só nomes; `gitleaks` antes de publicar; `service_role` e chave do Asaas só em `supabase secrets` |
| 7 | É dado sensível? | **Criança: sim, cuidado máximo.** Mínimo absoluto sobe; sem foto, voz, localização, data de nascimento, nome completo, escola. Apelido é o único identificador e o próprio app recomenda apelido, não nome |

**Direitos do titular (LGPD art. 18), onde cada um está:**

| Direito | Como |
|---|---|
| Acesso e portabilidade | `exportar_meus_dados()` → botão "Baixar tudo da minha conta" (JSON) na área do responsável; 5 por dia |
| Correção | Apelido, cor, faixa editáveis no app; e-mail pelo Auth (`updateUser`), com confirmação nos dois endereços |
| Exclusão | "Apagar conta e todos os dados": PIN + sessão + digitar APAGAR. `pedir_exclusao()` marca; Edge Function `apagar-conta` cancela a assinatura no provedor, grava `consentimento(aceito=false)` para os 4 tipos, apaga `auth.users` (cascata em `responsavel`, `perfil` e tudo abaixo). `pagamento` e `consentimento` ficam com `responsavel_id = null` (prova e fiscal). O app apaga o local com `apagarTudoDoAparelho()` (já existe). E-mail final de confirmação, sem dado dentro |
| Revogar consentimento | Mesma tela; revogar o parental = apagar os perfis da nuvem (o serviço não funciona sem) |
| Informação à criança | Tela "O que o Bobby guarda", em linguagem de criança, com áudio (CONSENTIMENTO-E-TERMOS.md, seção 5) |
| Encarregado | E-mail `privacidade@<domínio>` na política e no app [FILIPE] |

---

## 9. Os 7 itens da `seguranca-minima` nesta fase

| # | Item | Situação no desenho | Evidência / o que trava |
|---|---|---|---|
| 1 | Toda rota verifica a sessão | **Desenhado.** RPCs são `security invoker` sob RLS e exigem `auth.uid()`, menos `sincronizar_perfil`, que desde a 0007 é `security definer` (dono postgres, `search_path` vazio, `perfil_e_meu` conferido dentro) porque é o único caminho de escrita das moedas; Edge Functions chamam `supabase.auth.getUser(jwt)` antes de tudo; `webhook-pagamento` é pública **com comentário** e verifica o token do provedor, não a sessão | `0003_rpc.sql` (`42501` sem sessão). Trava: as funções ainda não existem (S3, S4) |
| 2 | Senha nunca em texto | **OK.** Login pelo Supabase Auth; o projeto não guarda senha. PIN local continua PBKDF2 (já feito) | `arrumarStore` aceita `senha.v === 2` |
| 3 | Limite de tentativas | **Desenhado.** Auth: limites do Supabase + Turnstile; RPC: `limite_ok_usuario()` com chave derivada de `auth.uid()` (sync 240/h por conta, export 5/dia); `limite_ok()` com chave livre só para `service_role` (funções: checkout 10/dia por conta); webhook por IP na Cloudflare; SMTP próprio obrigatório | `0001` `limite_ok`, `limite_ok_usuario`; teste 13c do `rls.sql`; README seção 2. Trava: configurar no painel (S1) |
| 4 | RLS em toda tabela | **Pronto em SQL, não provado.** 13 tabelas (`moedas_aparelho` da 0006 e `moedas_limitadas` da 0007), RLS ligada (sem FORCE, para os gatilhos `security definer` passarem), políticas só `to authenticated`, nenhuma `using (true)`, `anon` sem privilégio | `0002_rls.sql`; prova em `testes/rls.sql`. A garantia "nunca reduz" vale também fora da RPC: gatilhos `so_cresce` em `perfil_estado` e `progresso_fase` (teste 13b). Moedas: `authenticated` não grava `moedas_aparelho` nem as colunas de moeda, xp e comprado de `perfil_estado` (0007, testes 3b e 13g). **Trava até o teste rodar no banco e dar 29 OK** |
| 5 | Dado sensível cifrado e mínimo | **Mínimo: sim.** Cifra em campo: não há CPF, cartão nem documento no Bobby (ficam no provedor). `ip_hash` e `texto_hash` em vez de IP e texto. Disco e tráfego cifrados pelo Supabase e HTTPS | `0001` (sem coluna de documento); seção 8 |
| 6 | Chaves | **Desenhado.** `.env.example` sem valor; `service_role` e chave do provedor só em `supabase secrets`; `gitleaks` no portão | `supabase/.env.example`; `.gitignore` |
| 7 | Publicar só o que é público | **Pendente da auditoria anterior** (dist/, `_headers`, CSP). A Fase 4 acrescenta ao CSP: `connect-src 'self' https://<ref>.supabase.co wss://<ref>.supabase.co` e `form-action 'self'` (o checkout abre em nova aba, não em iframe: `frame-src 'none'` continua) | `docs/AUDITORIA-SEGURANCA-LGPD.md` P0 1 a 3. **Trava a publicação** |

**Cabeçalhos (`dist/_headers`, Cloudflare Pages):**

```
/*
  Content-Security-Policy: default-src 'none'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self'; media-src 'self' blob:; connect-src 'self' https://<ref>.supabase.co wss://<ref>.supabase.co; manifest-src 'self'; worker-src 'self'; base-uri 'none'; form-action 'self'; frame-ancestors 'none'; object-src 'none'; upgrade-insecure-requests
  Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
  X-Content-Type-Options: nosniff
  Referrer-Policy: no-referrer
  Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=()
  Cross-Origin-Opener-Policy: same-origin
```

`script-src 'self'` sem `'unsafe-inline'` exige que a build pare de inlinar os 14 scripts (auditoria P2 item 16); se isso não couber na Fase 4, fica `'unsafe-inline'` temporário com o item aberto. `<ref>` é o id do projeto, não é segredo.

---

## 10. Edge Functions (desenho; código nas sessões S3 a S5)

Todas em `supabase/functions/<nome>/index.ts`, Deno, com `verify_jwt = true` exceto o webhook. Nenhuma recebe dado de cartão. Logs só com ids.

| Função | Entrada | Faz | Sai |
|---|---|---|---|
| `criar-checkout` | JWT; `{plano}` | valida sessão; `limite_ok`; aceites dos 3 consentimentos existem?; cria cliente e assinatura no provedor; grava `assinatura(pendente)` | `{url}` |
| `webhook-pagamento` | POST do provedor; cabeçalho de token | **pública (comentário no código)**; confere token em tempo constante; idempotência em `webhook_evento`; atualiza `pagamento` e `assinatura.acesso_ate`; agenda e-mail | `200` sempre que autenticado (até em evento desconhecido, para o provedor não repetir) |
| `cancelar-assinatura` | JWT; `{motivo?}` | cancela no provedor; `cancelada_em`; e-mail | `{acesso_ate}` |
| `pedir-reembolso` | JWT | só se `inicio_em` < 7 dias; estorno no provedor | `{status}` |
| `apagar-conta` | JWT; `{confirmacao:'APAGAR'}` | cancela no provedor; `consentimento` revogados; `auth.admin.deleteUser(uid)`; e-mail final | `{apagado:true}` |
| `relatorio-semanal` | cron (segunda 8h) | para cada `responsavel.relatorio_email = true` com perfil ativo na semana: monta o cartão (dados de `dia_atividade` e `progresso_fase`) e envia; link de descadastro assinado | nada |

Configuração (não código): `PLANOS = { mensal: {centavos: 4700, ciclo: 'MONTHLY'}, anual: {centavos: 29700, ciclo: 'YEARLY'} }`, `TOLERANCIA_DIAS = 3`, `MAX_PERFIS = 4`, `MURO`, em `supabase/functions/_shared/config.ts`.

---

## 11. O que o agente de código vai mexer no app (resumo; detalhe no PLANO)

- `src/interface/nuvem.js` (novo): cliente Supabase, sessão, outbox, push/pull, merge local, cache de acesso, migração da primeira conta. Única porta de rede do app além de `audio.js`.
- `estado.js`: `salvar()` passa a chamar `nuvem.marcarSujo(bloco)`; ganha `moedasGanhas` e `moedasGastas` em `estadoVazio()`/`estadoDe()` (contadores acumulados, seção 5.5), com derivação única para perfis existentes. O formato das chaves antigas não muda.
- `licao.js:481,568`, `ciclo.js:77,81,86,288`, `personagem.js:135,158`: um `nuvem.creditar(v)` ou `nuvem.debitar(v)` ao lado de cada `S.moedas += / -=`.
- `perfil-e-responsavel.js`: telas Conta, Assinatura, Consentimentos, Exportar tudo, Apagar conta; limite de 4 perfis.
- `telas-auxiliares.js`: o muro.
- `shell.html` / build: `<script src>` do `supabase-js` **servido localmente** (sem CDN, regra da casa) e meta CSP.
- `sw.js`: nunca cachear `supabase.co` (`url.origin === self.location.origin` nas três rotas, correção já pedida na auditoria).
- `testes/nuvem.js` (novo): os 7 casos de merge listados na S5 do PLANO (seções 5.3 a 5.6) simulados; `testes/fumaca.js` com Supabase local (`supabase start`) ou mock.

---

## 12. Riscos

| Risco | Onde bate | Mitigação |
|---|---|---|
| Taxa de cartão do Asaas não confirmada | seção 7 | S0 confirma antes de qualquer código; plano B Stripe |
| Pix mensal a 10% de taxa | seção 7 | mensal só cartão, Pix só anual (decisão [FILIPE]) |
| 2 e-mails/hora do Auth sem SMTP próprio | seção 4 | SMTP antes do primeiro usuário; é item da lista do Filipe |
| Dois aparelhos offline comprando no mesmo intervalo: criança fica com dois itens pagando um | 5.5 | razão `ganhas/gastas` já no banco; resíduo raro e a favor da criança; medir no beta |
| Contadores `moedasGanhas`/`moedasGastas` esquecidos em algum ponto novo de crédito ou débito | 5.5, S5 | teste em `testes/nuvem.js`: depois de 200 ações simuladas, `ganhas - gastas == S.moedas` |
| `localStorage` lotado com outbox grande | 5.3 | push frequente; se `setItem` falhar, o app já avisa (`avisoArmazenamento`) |
| Relógio do aparelho errado | 5.3, 6.4 | carimbo só decide blocos LWW (roupa, config); progresso é `GREATEST`; acesso tem só 3 dias de folga |
| Webhook perdido | 6.3 | idempotência + botão "Já paguei, conferir" que chama `acesso_liberado()` e, se pendente, a função consulta o provedor |
| Guia de aferição de idade da ANPD ainda não publicado (pesquisa 03) | seção 8 | desenho pela versão mais rígida: consentimento separado, prova por versão, revogação fácil; [ADV] acompanha |
| Decisão "sem teste grátis" contra a mesa 05 | 6.5 | muro parametrizado; pergunta única ao Filipe |
| Apple exigir IAP quando for para a loja | fora da fase | mesmo item como IAP (mesa 05 §4.4); nada a fazer agora |

---

## Fontes abertas nesta rodada (24/10/2026)

- `docs/AUDITORIA-SEGURANCA-LGPD.md`, `docs/FASE-2-especificacao.md` §8, `README-FASE-3-LOGICA.md`, `src/interface/estado.js`, `src/interface/migracao.js`, `docs/mesa/05-negocio.md`, `docs/mesa/00-SINTESE.md`, `pesquisa/03-etica-e-lgpd-infantil.md`, `/Users/filipealvesesilva/Projetos/bobby-site/RELATORIO-revisao-2026-09-02.md` §5.
- Supabase Auth rate limits: https://supabase.com/docs/guides/auth/rate-limits
- Stripe preços BR: https://stripe.com/br/pricing · Stripe Pix e Pix Automático: https://docs.stripe.com/payments/pix
- Pagar.me preços: https://pagar.me/precos (a doc de assinaturas em docs.pagar.me/docs/assinaturas devolveu 404)
- Asaas taxas (blog, 26/09/2025, atualizado 23/04/2026): https://blog.asaas.com/taxas-asaas/ · Assinaturas: https://docs.asaas.com/docs/assinaturas-recorrência · Pix Automático e assinaturas: https://docs.asaas.com/docs/diferença-entre-pix-automático-e-assinaturas · changelog 19/05/2026: https://docs.asaas.com/changelog/pix-automático-cobranças-recorrentes-automatizadas · A página oficial de preços (asaas.com/precos-e-taxas) redirecionou para login e não foi lida.
- Banco Central (página do Pix Automático) não carregou conteúdo nesta sessão; a data de lançamento do Pix Automático não foi confirmada aqui.
