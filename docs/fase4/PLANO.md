# Fase 4 · Plano de sessões de código

Data: 24/10/2026. Base: `docs/fase4/ARQUITETURA.md`, `docs/fase4/CONSENTIMENTO-E-TERMOS.md`, `supabase/`. Regra do pedido: **backend primeiro, sem tocar no app; depois a integração no app pelo agente de código.** Uma sessão de agente por linha; cada uma fecha sozinha (commit, testes, `revisor-de-entrega` com nota 8 ou mais, registro em `05-Stack/notas-de-entrega.tsv`). Nenhuma sessão abre enquanto outra estiver no projeto (regra 7 da casa). **Em 24/10/2026 havia outra sessão mexendo em `src/` durante esta escrita** (o `git status` mudou duas vezes entre o começo e o fim: primeiro `licao.js`, `shell.html`, `style.css`; depois `ciclo-ui.js`, `mapa-e-trilha.js`, `perfil-e-responsavel.js`, `utilidades.js`). Esta entrega não tocou em nada disso. **Toda sessão a partir da S2 começa com `git status` limpo ou com o trabalho da outra sessão commitado; lista fixa aqui não serve, confira na hora.**

Pisos que valem para toda sessão: nenhuma chave em código; `.env` antes da primeira chave; `gitleaks dir .` limpo; nada publicado sem o ok do Filipe; texto em português do Brasil sem travessão; o que sai do código vai para `~/_APAGAR DEPOIS (revisao)/<data>/` com `LOG.tsv` e `desfazer.sh`; `supabase-js` servido localmente (sem CDN); nenhum teste pulado ou apagado.

---

## 1. Ordem das sessões

### Bloco A · Backend (não toca em `src/`, `index.html`, `sw.js`)

| Sessão | O que entra | Critério de pronto (medido) | Depende de |
|---|---|---|---|
| **S0 · Portão de fornecedores (Filipe + agente, meio dia)** | Conta sandbox no Asaas; tabela de taxas da conta (cartão à vista e recorrente); teste manual no sandbox: criar assinatura mensal e anual, pagar com cartão de teste e Pix simulado, forçar atraso e estorno; capturar os 5 eventos de webhook num endpoint de teste (`webhook.site` ou função vazia); confirmar NFS-e automática para o município [CONT] | (a) tabela de taxas anexada em `docs/fase4/FORNECEDOR.md` com data; (b) os 5 eventos (`PAYMENT_CONFIRMED`, `PAYMENT_RECEIVED`, `PAYMENT_OVERDUE`, `PAYMENT_REFUNDED` e o de cancelamento) recebidos e salvos **sem dado pessoal** no doc; (c) decisão escrita: Asaas confirmado ou plano B Stripe (se cartão > 5% ou webhook falhar) | Lista do Filipe itens 2 e 3 |
| **S1 · Banco no ar e RLS provada** | Projeto Supabase criado (Filipe); `supabase link`; `db push` de 0001, 0002, 0003; `testes/rls.sql`; configuração do Auth (SMTP, limites, Turnstile, URLs, templates em português); `.env` local e `supabase secrets` | (a) `testes/rls.sql` com **23 OK e 0 FALHA** (`grep -c 'OK:'`), saída colada em `docs/fase4/EVIDENCIAS.md`; (b) `select tablename, rowsecurity from pg_tables where schemaname='public'` todas `true`; (c) `pg_policies` sem `{public}`; (d) magic link chega em menos de 60 s pelo SMTP próprio para 2 e-mails diferentes; (e) `gitleaks dir .` limpo; (f) nenhum arquivo com `service_role` fora de `.env` | S0 (decisão do provedor), Filipe itens 1 e 6 |
| **S2 · Edge Functions de assinatura** | `supabase/functions/_shared/{config,provedor-asaas,auth,limite}.ts`; `criar-checkout`; `webhook-pagamento` (pública, comentada, token em tempo constante, idempotente); `cancelar-assinatura`; `pedir-reembolso`; testes com `deno test` usando o sandbox gravado da S0 | (a) `deno test` passa: webhook sem token → 401; token certo + evento repetido → 200 e **uma** linha em `pagamento`; confirmado → `acesso_ate = fim do ciclo + 3 dias`; reembolso → `acesso_ate = now()`; (b) `criar-checkout` sem JWT → 401; sem os 3 consentimentos → 403 com mensagem; 11ª chamada no dia → 429; (c) ponta a ponta no sandbox: checkout → pagar → `acesso_liberado()` devolve `liberado:true` em até 30 s; (d) log das funções sem e-mail, apelido ou CPF (grep no log) | S1 |
| **S3 · Conta, exclusão e exportação** | `apagar-conta` (cancela no provedor, revoga consentimentos, `auth.admin.deleteUser`, e-mail final); e-mails transacionais (modelos da seção 6 do CONSENTIMENTO); job de retenção (conta inativa 24 m + 30 d; `webhook_evento` 90 d; `limite_taxa` 7 d) com `pg_cron` ou cron da função | (a) apagar conta de teste: 0 linhas em `responsavel`, `perfil` e filhas; `pagamento` e `consentimento` com `responsavel_id = null`; assinatura cancelada no sandbox; (b) `exportar_meus_dados()` devolve JSON válido com os 5 blocos e nenhum dado de outro usuário (já coberto no rls.sql, repetir contra o banco real); (c) job de retenção testado com data forçada | S2 |
| **S4 · Relatório semanal (opt-in)** | `relatorio-semanal` (cron segunda 8h): monta o cartão com `dia_atividade` e `progresso_fase`; link de descadastro assinado; só para `relatorio_email = true` | (a) e-mail de teste com os 5 números e 1 "vale ajudar em"; (b) descadastro grava `consentimento(aceito=false)` e `relatorio_email=false` e o próximo cron não envia; (c) nenhum e-mail para quem não optou (teste com 2 contas) | S3 |

### Bloco B · Integração no app (agente de código; toca `src/`, `shell.html`, `sw.js`, `build/`)

| Sessão | O que entra | Critério de pronto (medido) | Depende de |
|---|---|---|---|
| **S5 · `nuvem.js`, sessão e sync** | `src/interface/nuvem.js`: cliente Supabase (lib local), login por magic link, outbox `universo-bobby-sync-v1`, `marcarSujo`, push com debounce 5 s + `visibilitychange` + `online`, pull ao abrir e ao trocar perfil, merge local com as mesmas regras do servidor, migração da primeira conta (seção 5.6); `estado.js` chama `marcarSujo`; `sw.js` ignora `supabase.co`; `testes/nuvem.js` | (a) `testes/nuvem.js`: 7 casos de merge (estrela menor não reduz; `ganhas` e `gastas` maiores vencem e gastar não devolve moeda; comprado união; look mais novo vence; item de revisão mais novo vence; dia GREATEST; depois de 200 ações simuladas `ganhas - gastas == S.moedas`) iguais no cliente e no `rls.sql`; (b) migração: perfil v4 com 50 fases e 2 itens comprados sobe; o snapshot devolvido tem ≥ 50 fases, `xp` igual, `gastas` = soma dos `PRECOS` dos 2 itens e saldo igual ao local; falha simulada não marca migrado; (c) offline: 20 gravações sem rede, volta a rede, 1 push, banco igual ao local; (d) fumaça (`testes/fumaca.js`) em 360, 390 e 1280 com Supabase local (`supabase start`) e console limpo; (e) byte a byte: `universo-bobby-v4` não muda de formato (teste existente passa) | S1 (banco), S3 (apagar) |
| **S6 · Área do responsável: conta, consentimento, assinatura, muro** | Telas: Criar conta/entrar; aceites (3 + 1 opcional, com versão); Assinatura (plano, preço lido da função, abrir checkout, "Já paguei, conferir", cancelar em um toque, pedir reembolso); Conta e privacidade (retirar consentimento, exportar tudo, apagar conta com PIN + sessão + APAGAR); limite de 4 perfis; o muro com `MURO` configurável; texto "O que o Bobby guarda" com áudio | (a) varredura do DOM das 17 telas da criança: nenhuma ocorrência de "R$", "assine", "plano", "desconto", "oferta"; (b) muro: instalação nova mostra o muro; perfil local com progresso mostra mapa em leitura e nada some (contagem de estrelas antes e depois igual); assinatura ativa libera; expirada volta ao muro com progresso intacto; (c) cancelar: 1 toque + 1 confirmação, nenhum modal de retenção; (d) apagar conta: `apagarTudoDoAparelho()` + função; depois disso `localStorage` sem chave do app e banco sem a conta; (e) consentimento: as 3 caixas desmarcadas por padrão, botão desabilitado até marcar, 3 linhas gravadas com versão e hash; mudança de versão reabre só o item mudado; (f) `copy-check` PROIBIDOS 0 nos textos novos; áudio novo em `audio/regerar-pendentes.json` | S5, S2 |
| **S7 · Portão de publicação (seguranca-minima)** | `dist/` só com o público; `_headers` da ARQUITETURA seção 9; CSP (idealmente sem `'unsafe-inline'`, senão item aberto); `gitleaks`, `semgrep --config p/javascript --config p/secrets --config p/xss --metrics=off`; os 7 itens com evidência; fumaça completa; `revisor-de-entrega` | (a) tabela dos 7 itens preenchida com evidência em `docs/fase4/EVIDENCIAS.md`, nenhum "falta"; (b) `curl -I` no domínio de teste mostra os 6 cabeçalhos; (c) `dist/` sem `arte`, `docs`, `pesquisa`, `src`, `.git`, `supabase` (teste falha se tiver); (d) teste em iPhone e Android reais: login, pagar no sandbox, jogar offline, voltar online e ver o sync (anotado, com data); (e) nota do revisor ≥ 8 | S6, S4 |
| **S8 · Beta fechado com famílias (Filipe)** | 10 a 20 famílias conhecidas; termo de beta [ADV]; pré-venda real do anual a R$ 149 com reembolso garantido (mesa 05, etapa 1); medir D1/D7/D30 (local, exportado pelo responsável), "paguei e não entra" = 0, cancelamentos e motivo | Portão de saída da mesa 05: ≥ 30% das famílias pagam; nenhum chamado de "paguei e não entra"; nenhum dado de criança em log ou e-mail além do relatório opt-in | S7, advogado (termos) |

Ordem e corte: se faltar tempo, **S0 → S1 → S2 → S5 → S6 → S7** é o caminho mínimo para cobrar o primeiro real com segurança. S3 (apagar/exportar) **não é cortável** antes do beta: é obrigação legal. S4 (relatório) pode ir depois do beta começar, desde que o opt-in já exista na tela (S6) e fique desligado.

---

## 2. O que cada sessão NÃO faz

- Nenhuma sessão sobe os eventos de medição para a nuvem (tratamento novo; precisa de RIPD).
- Nenhuma sessão vende moeda, baú, congelador ou vantagem (decisão fixa; ECA Digital art. 20).
- Nenhuma sessão coloca preço, contagem, desconto ou "assine" em tela da criança.
- Nenhuma sessão guarda cartão, CPF ou nome no Bobby.
- Nenhuma sessão publica em produção sem S7 fechada e sem o ok do Filipe.
- Nenhuma sessão apaga arquivo: move para `~/_APAGAR DEPOIS (revisao)/<data>/`.

---

## 3. Testes que provam a fase inteira (lista única)

| Teste | Onde | Prova |
|---|---|---|
| RLS, privilégios e merge por consulta (23 provas) | `supabase/testes/rls.sql` | ninguém lê, grava ou se dá assinatura fora da própria família; anon nada; `limite_ok` só servidor (13c); `responsavel` só `relatorio_email` (13d) |
| Merge no servidor | idem, casos 13 e 13b | nunca reduz estrelas nem moedas ganhas; gastar não devolve moeda; união de comprado; vale também em update direto |
| Merge no cliente | `testes/nuvem.js` | os mesmos 7 casos da S5 |
| Migração da primeira conta | `testes/nuvem.js` | validação antes de marcar migrado |
| Webhook | `deno test` em `supabase/functions` | 401 sem token; idempotente; `acesso_ate` correto |
| Muro e regressão de progresso | `testes/fumaca.js` | estrelas iguais antes e depois do muro |
| Tela da criança sem dinheiro | `testes/fumaca.js` (varredura de texto) | 0 ocorrências |
| Cabeçalhos e CSP | `curl -I` + fumaça | 6 cabeçalhos; console limpo |
| Segredos | `gitleaks`, `git grep` | 0 |
| Aparelho real | manual, anotado | iPhone e Android |

---

## 4. LISTA DO QUE PRECISA DA MÃO DO FILIPE (o agente não consegue criar nada disto)

| # | O quê | Por que o agente não faz | Quando precisa estar pronto |
|---|---|---|---|
| 1 | **Projeto Supabase** (conta da empresa, região São Paulo, senha do banco no gerenciador de senhas) e colar `URL`, `anon` e `service_role` no `.env` local e em `supabase secrets` | exige login, cartão e aceite de termos de terceiro | antes da S1 |
| 2 | **Conta no provedor de pagamento** (Asaas; sandbox primeiro, produção depois do CNPJ): cadastro, tabela de taxas da conta, chave de API e token de webhook em `.env`/`secrets` | exige CNPJ, documento, aceite de contrato | sandbox antes da S0; produção antes da S7 |
| 3 | **CNPJ: abrir ME no Simples** com o contador (MEI não cobre software); conta bancária PJ | ato jurídico e fiscal | antes de produção no provedor e do primeiro real |
| 4 | **Advogado** de proteção de dados e direito digital: a lista da seção 7 do CONSENTIMENTO-E-TERMOS.md (14 itens) | parecer jurídico | textos antes da S6; termo de beta antes da S8 |
| 5 | **Contador**: 5 itens da seção 7 do CONSENTIMENTO (ME, NFS-e, guarda, reembolso, loja) | decisão fiscal | antes da S0 (NFS-e) e do primeiro real |
| 6 | **Domínio** do app (e-mails `contato@`, `suporte@`, `privacidade@`), DNS no Cloudflare, SPF/DKIM/DMARC para o e-mail transacional | compra e DNS em conta dele | antes da S1 (SMTP precisa do domínio) |
| 7 | **E-mail transacional** (provedor SMTP: Resend, Postmark, Amazon SES ou similar; conta, domínio verificado, credenciais em `.env`/Auth SMTP) | conta de terceiro; sem isso o Auth manda 2 e-mails por hora | antes da S1 |
| 8 | **Cloudflare Pages**: projeto que publica a partir de `dist/`, domínio ligado, regras de rate limit no caminho do webhook | conta dele | antes da S7 |
| 9 | **Decisões**: (a) muro `tudo-pago` ou `3 etapas grátis`; (b) Pix só no anual ou também no mensal; (c) prazo de suporte nos termos; (d) quem é o encarregado; (e) aprovar os textos depois do advogado | só ele decide | (a) e (b) antes da S2; o resto antes da S6 |
| 10 | **Aparelhos reais** (iPhone e Android) para o teste da S7 e as 10 a 20 famílias do beta | gente e hardware | S7 e S8 |
| 11 | **Ouvir e aprovar** o áudio novo do Bobby ("O que o Bobby guarda") e os e-mails | gosto e voz da marca | S6 |

---

## 5. Pergunta única ao Filipe (conflito com o que está registrado)

A mesa 05 (§3, §6 item 3, §10.1) e a síntese 00 (C8, Q3, Q4) registram: **1 planeta grátis para sempre** (ou 3 primeiras etapas de cada planeta), muro que nunca se move, e Fase 4 **depois** do piloto local de 60 dias. A decisão de hoje é **sem teste grátis e começar agora**. O desenho obedece a decisão de hoje e deixa o muro numa constante (`MURO.modo`). Confirma `tudo-pago`, ou prefere `etapas-gratis: 3` (o pai prova as três matérias antes de pagar; é o que a mesa recomendou para evitar a queixa "não sabia que era pago")? Uma palavra basta; nada muda no banco, só a constante e o texto do muro.

---

## 6. Registro

- Nada executado contra banco nesta rodada (sem Postgres, Docker nem CLI na máquina). O SQL está escrito e revisado por leitura; a primeira execução é a S1.
- Nada publicado, nada apagado, nenhuma chave em código, nenhum crédito gasto.
- A nota do `revisor-de-entrega` desta entrega de arquitetura vai em `05-Stack/notas-de-entrega.tsv` pelo agente que a chamou.
