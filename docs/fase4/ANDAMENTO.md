# Fase 4 · Andamento

Branch `fase-4`, criada de `reforma-fase-2` no commit 3727ddf (onda 1 aprovada com nota 8). Rodada de 09/11/2026, sem conta em serviço nenhum: nada publicado, nenhum push, nenhum crédito gasto, nenhuma ferramenta instalada (só `deno`, `gitleaks` e `semgrep`, que já estavam na máquina). `git status` estava limpo no começo.

Skills aplicadas no desenho: `seguranca-minima` (os 7 itens, abaixo) e `lgpd-gate` (as 7 perguntas já respondidas na ARQUITETURA seção 8; esta rodada não criou tratamento novo de dado: nenhum log com e-mail, apelido ou CPF, nenhum payload do pagador guardado, nada de nome ou CPF no Bobby).

---

## 1. O que ficou pronto

### Parte 0 · Polimento do conteúdo (commit 5ede594)

| Item | Feito | Prova |
|---|---|---|
| `legivel` | Rejeita Q sem U (QATO, QOLA, QENTE) e consoante seguida de consoante, salvo encontro de `ENCONTROS`, RR, SS, o par que a palavra certa já tem (DENTE tem NT) ou consoante que fecha sílaba no português (R, S, L antes de qualquer uma; M antes de P e B; N antes das outras). Letra dobrada só RR e SS | `testes/geradores.js` caso 7: ACSA, AJNELA, DETNE, RATTO, BOLLO e FACCA reprovam; BOLA, PRATO, CARRO, MASSA, CHUVA, QUILO passam; 2.000 perguntas sem par proibido |
| Por que a regra das consoantes que fecham sílaba | Com a regra literal (só encontros, RR e SS), RATO ficava sem nenhum distrator e FACA, BOLO e OVO com um só, e o `testes/conteudo.js` caso 2 (no mínimo 2 erros por palavra) quebrava. ARTO, FESTA e CAMPO se leem; ACSA e DETNE não | `testes/conteudo.js` 10 de 10 |
| Distratores das palavras curtas | Dois erros novos, de verdade de quem aprende: o som do fim (O final soa U, E final soa I: RATU, DENTI) e C por G (GASA, FAGA) | idem |
| Pistas | `sapato` "calçado de couro para ir à festa"; `menino` "é o contrário de menina"; `dente` "é branco, fica na boca e a gente escova"; `banana` "fruta amarela e comprida que o macaco adora"; `bolo` "doce de aniversário onde vão as velinhas"; revistas também `panela`, `tapete` e `sapo` | caso 8 |
| 4 opções | `dinheiro`, `troco` e `historinhaReparte` sempre com 4 opções distintas, nenhuma menor que 1 | caso 9 (2.000 perguntas de cada) |
| Áudio | 12 trechos de enunciado novos (pistas) e 1 trecho antigo sem clipe que a amostra nova achou ("qual palavra rima com amor") em `audio/regerar-pendentes.json`. Nenhum áudio gerado | `testes/cobertura-audio.js` OK |

Os casos 7, 8 e 9 falham no código anterior (conferido).

### Parte 1 · S2 sem conta: Edge Functions de assinatura (commit 7e01a12)

Arquivos: `supabase/functions/_shared/{config,provedor-asaas,auth,limite,repositorio,http,rota}.ts`, `criar-checkout`, `webhook-pagamento`, `cancelar-assinatura`, `pedir-reembolso`, `supabase/functions/testes/` e `supabase/migrations/0004_checkout.sql`.

| Critério do PLANO (S2) | Situação | Teste |
|---|---|---|
| (a) webhook sem token → 401 | **pronto** | sem cabeçalho, token errado, token com um caractere a menos: 401 e banco intocado; token do servidor vazio ou curto (menos de 32): recusa tudo |
| (a) token certo + evento repetido → 200 e uma linha em `pagamento` | **pronto** | o mesmo evento duas vezes; e CONFIRMED depois RECEIVED da mesma cobrança: 1 linha |
| (a) confirmado → `acesso_ate` = fim do ciclo + 3 dias | **pronto** | mensal 10/11 → 13/12 03:00 UTC (meia-noite de Brasília); anual → 13/11/2027; 31/01 + 1 mês cai em 28/02, nunca em março; renovação empurra, evento atrasado nunca encolhe |
| (a) reembolso → `acesso_ate = now()` | **pronto** | pelo webhook (`PAYMENT_REFUNDED`) e pela função `pedir-reembolso` |
| (b) `criar-checkout` sem JWT → 401 | **pronto** | sem JWT, JWT inválido, e-mail não confirmado |
| (b) sem os 3 consentimentos → 403 com mensagem | **pronto** | "Antes de assinar, aceite: termos de uso, política de privacidade, consentimento do responsável." Retirar o parental volta a bloquear; aceite de outra família não vale |
| (b) 11ª chamada no dia → 429 | **pronto** | 10 × 200, 11ª 429; outra família segue com 200 |
| (c) ponta a ponta no sandbox | **PENDENTE-CONTA** | precisa da conta sandbox do Asaas e do banco no ar |
| (d) log sem e-mail, apelido ou CPF | **pronto** | fluxo inteiro com payload que traz nome, e-mail, CPF e telefone falsos: nada disso, nem token nem chave, aparece no log; chave fora da lista nunca entra |
| S0 (taxas, 5 eventos gravados, decisão) | **PENDENTE-CONTA** | |

Regras pedidas, onde estão:
- Webhook público com o motivo escrito: cabeçalho de `webhook-pagamento/index.ts`. Publicar com `supabase functions deploy webhook-pagamento --no-verify-jwt`.
- Token em tempo constante: `_shared/auth.ts`, `tokensIguais` (SHA-256 dos dois lados e comparação sem saída antecipada).
- Idempotente: `webhook_evento` antes de qualquer gravação; evento que falhou no meio é reprocessado na repetição sem duplicar (teste "banco cai no meio").
- Chaves só por `Deno.env`: `_shared/config.ts`, `lerAmbiente`. Nenhum valor em código; os testes usam textos falsos.
- Preço vem do servidor: valor mandado pelo app é ignorado (teste).

Payloads dos testes: montados da documentação pública do Asaas, com a URL anotada em cada um (`supabase/functions/testes/payloads.ts`): https://docs.asaas.com/docs/webhook-para-cobrancas, https://docs.asaas.com/docs/eventos-para-assinaturas, https://docs.asaas.com/docs/eventos-para-checkout e https://docs.asaas.com/reference/criar-novo-checkout.

**Decisão de desenho que muda a ARQUITETURA 6.3 passo 5 (registrar):** o Asaas exige `name` e `cpfCnpj` para criar cliente pela API (https://docs.asaas.com/reference/criar-novo-cliente). Como o Bobby não guarda nome nem CPF, a assinatura nasce num **Checkout do Asaas** (`POST /v3/checkouts`, `chargeTypes: RECURRENT`), onde o responsável digita os dados na página do Asaas. O id do nosso registro de assinatura vai em `externalReference` (só um uuid). A coluna nova `assinatura.provedor_checkout_id` (migração 0004) liga o Checkout à família. Consequência: o Checkout recorrente é **só cartão** (https://docs.asaas.com/docs/checkout-com-assinatura-recorrente). Pix na assinatura volta a ser decisão do Filipe (item 9b do PLANO).

Pontos que só a conta confirma (marcados PENDENTE-CONTA no código):
1. Qual campo da assinatura criada pelo Checkout aponta de volta para o Checkout ou para o `externalReference`. O webhook procura nas três ordens: id da assinatura do Asaas, nosso uuid em `externalReference`, id do Checkout (campo `checkoutSession`, nome a confirmar).
2. Endereço do link do Checkout no sandbox (a resposta pode trazer `link`; se não trouxer, o código monta `sandbox.asaas.com/checkoutSession/show?id=`).
3. `imageBase64` do item é obrigatório na documentação; está um PNG de 1 × 1 até haver arte.
4. Pagamento de assinatura que o Bobby não reconhece responde 200 (15 falhas seguidas pausam a fila do Asaas) e fica com `erro = 'sem_assinatura'` e sem `processado_em`; o reprocessamento disso ainda não tem rotina (entra com o botão "Já paguei, conferir" na S6).
5. `RepositorioPostgrest` foi testado só na forma do pedido (URL, cabeçalhos, filtro), não contra um banco.

### Parte 2 · S5 sem conta: `src/interface/nuvem.js`

| Critério do PLANO (S5) | Situação | Teste (`testes/nuvem.js`, 15 casos) |
|---|---|---|
| (a) 7 casos de merge iguais no cliente e no `rls.sql` | **pronto** | a1 estrela menor não reduz; a2 ganhou 120, comprou o Teo por 80, aparelho atrasado manda menos (os números do caso 13 do `rls.sql`); a3 comprado união; a4 look mais novo vence nos dois sentidos; a5 item de revisão mais novo vence; a6 dia pelo maior campo a campo; a7 200 ações e `ganhas - gastas == S.moedas` a cada passo, no aparelho e no banco; a8 puxar sem empurrar não desfaz o que o aparelho tem de maior ou mais novo |
| (b) migração | **pronto** | perfil v4 com 50 fases, Teo e boné: banco com 50 fases, `xp` 1234, `gastas` 700 (500 + 200 de `PRECOS`), saldo 77 igual ao local; falha de rede no criar, falha no sincronizar e snapshot que não confere: nada marcado como migrado e local intacto; mais de 4 perfis: sobem 4 e a lista dos que ficaram volta |
| (c) offline | **pronto** com transporte falso | 20 gravações sem rede: 0 chamadas; volta a rede: 1 push; banco igual ao local; outro `online` não chama de novo |
| Debounce, `visibilitychange`, intervalo | **pronto** | 10 gravações seguidas: 1 push depois de 5 s; antes de 60 s o debounce espera; aba escondida fura o intervalo |
| Desligada sem configuração | **pronto** | `NUVEM.ligada()` falso; 10 gravações: nenhuma chave `universo-bobby-sync-v1`; v4 com as mesmas chaves de `estadoVazio()` |
| (d) fumaça com Supabase local | **PENDENTE-CONTA** | precisa de `supabase start` (Docker) ou do projeto |
| (e) `universo-bobby-v4` não muda | **pronto** | caso d acima, mais `testes/estado.js` e a bateria inteira |

Como funciona, em uma linha cada:
- O servidor do teste é falso e escrito à parte, seguindo o SQL do `0003_rpc.sql`; não usa nada do `nuvem.js`.
- `salvar()` (estado.js) chama `NUVEM.marcarSujo()` só se `NUVEM.ligada()`. Hoje a nuvem está desligada (sem `NUVEM_CONFIG` e sem transporte), então o app se comporta igual: não grava chave nova, não ouve evento, não chama rede.
- O razão de moedas mora na outbox (não no v4): cada gravação compara o saldo com o último visto (subiu = ganhou, desceu = gastou). Perfil que já existia ganha o razão pela regra da ARQUITETURA 5.5 na migração. Ganho e gasto entre duas gravações se anulam no razão; o saldo e a regra `ganhas - gastas == saldo` continuam certos.
- O merge trabalha numa cópia e só passa ao estado vivo o que sai de `estadoDe()` (mesma validação do backup); não mexe em programa em andamento nem no resto do estado.
- Cache do acesso (`guardarAcesso`, `acessoValido`) existe e está testado, mas **não liga o muro**: `MURO` continua `{modo:'aberto'}`.

Falta da S5 (precisa de conta ou fica para a sessão com conta):
1. `transporteSupabase()` com o `supabase-js` servido localmente. **A biblioteca não foi baixada.**
2. Login por magic link, pull ao abrir o app e ao trocar de perfil, `marcarSujo` forçado ao fechar a fase.
3. `sw.js` ignorar `supabase.co` (não mexi para o app não mudar).
4. Itens de revisão: `dificil` e `dom` (posições 6 e 7 do item) não têm coluna no banco; no merge ficam os do aparelho. Proposta para a S1: duas colunas em `erro_pendente` (migração 0005).
5. `tempo_seg` e `concluida_em` de cada fase não existem no estado local; sobem como 0 e vazio.

---

## 2. Portão final (09/11/2026)

| Conferência | Resultado |
|---|---|
| `gitleaks dir .` e `gitleaks git .` | **limpo** (no leaks found). Achado único, anterior à fase 4 (commit 7af80cd): `docs/licencas/pagina-opengameart-jrpg-pack-4-calm-2026-10-24.html:55`, regra generic-api-key, 43 caracteres, é o `theme_token` do Drupal da página pública da OpenGameArt guardada como prova de licença; não é chave do projeto. Registrado com o motivo em `.gitleaksignore`. Um achado meu no meio da rodada (token de cartão de exemplo da doc do Asaas em `payloads.ts`) foi trocado por texto fictício |
| `semgrep --config p/javascript --config p/secrets --metrics=off` em `supabase/functions` e `src/interface/nuvem.js` | **0 achados**, 15 arquivos lidos, 0 erros. `deno lint supabase/functions`: 0 problemas |
| `python3 build/build.py --check` | **OK**: index.html em dia com src/ |
| `git grep` de `sk_live`, `eyJhbGci`, `$aact_` | 0; `service_role` só aparece como nome de papel em comentário e em `grant` |
| Testes | todos verdes (seção 4) |

### Os 7 itens da `seguranca-minima` nesta rodada

| Item | Situação | Evidência |
|---|---|---|
| 1. Rotas com sessão | ok nas 3 funções do app; webhook público com motivo | `_shared/rota.ts` (JWT no Auth antes de tudo, uid nunca do corpo); cabeçalho de `webhook-pagamento/index.ts`; testes 401 |
| 2. Senhas | não se aplica (Supabase Auth; nada de senha nas funções) | |
| 3. Limite de tentativas | ok nas funções (checkout 10, cancelar 10, reembolso 5 por dia por conta, chave pelo uid); webhook por IP fica na Cloudflare (falta, item 8 do Filipe) | `_shared/config.ts` `LIMITES`; teste 429 |
| 4. RLS | sem mudança de política; 0004 só acrescenta coluna em tabela que o responsável só lê. Prova no banco: PENDENTE-CONTA (S1) | `0002_rls.sql` |
| 5. Dado sensível | ok: nada de nome, CPF ou cartão no Bobby; payload do webhook não é guardado; log só com ids | teste (d) |
| 6. Chaves | ok: só `Deno.env`; `.env` no `.gitignore`; gitleaks | `lerAmbiente` |
| 7. Só o público no ar | não se aplica nesta rodada (nada publicado) | |

---

## 3. O que o Filipe precisa criar para destravar a S1 (lista exata)

Nada disto o agente consegue fazer: exige login, aceite de termos ou cartão.

1. **Projeto no Supabase**, na conta da empresa, região **South America (São Paulo)**, senha do banco gerada pelo gerenciador de senhas. Depois, guardar no `.env` local (que já está no `.gitignore`) e, para as funções, em `supabase secrets`: `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` e `SUPABASE_DB_URL`. Nunca colar no chat.
2. **Domínio do app**, com DNS na Cloudflare, e os registros SPF, DKIM e DMARC do e-mail transacional.
3. **Conta no provedor de e-mail transacional** (Resend, Postmark, Amazon SES ou similar) com o domínio verificado; as credenciais SMTP (`SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `EMAIL_REMETENTE`) vão no `.env` e no painel do Auth (Authentication, SMTP Settings). Sem isso o Auth manda só 2 e-mails por hora.
4. **Ferramenta para rodar as migrações**: a CLI do Supabase (`brew install supabase/tap/supabase`, decisão e instalação dele) ou colar 0001 a 0004 no SQL Editor do projeto, em ordem, e depois `supabase/testes/rls.sql`. Para a fumaça com banco local (S5 d) é preciso Docker.
5. **`APP_URL`** (o endereço que o domínio vai ter) e **`IP_HASH_SAL`** (texto aleatório de 32 ou mais caracteres, do gerenciador de senhas) no `.env`.

Para a S0 e o ponto (c) da S2, além disso:

6. **Conta sandbox no Asaas**: chave de API (`ASAAS_API_KEY`), `ASAAS_AMBIENTE=sandbox` e um webhook apontando para a função `webhook-pagamento`, com `authToken` de 32 a 255 caracteres sem espaço (`ASAAS_WEBHOOK_TOKEN`), assinando os eventos de cobrança, assinatura e Checkout.
7. **Decisão 9b**: com o Checkout, a assinatura recorrente é só cartão. Pix fica fora da assinatura, ou entra como cobrança avulsa no anual com lembrete de renovação?

---

## 4. Resultado dos testes desta rodada

Rodados no fim, com a parte 2 dentro do build. Todo Chrome com `--mute-audio` (já é o padrão de `testes/lib/chrome.js`, `toque.js` e `fumaca.js`).

| Comando | Resultado |
|---|---|
| `npm test` (35 suítes, agora com `testes/nuvem.js`) | **OK**, 315 de 315 casos |
| `node testes/toque.js` | **OK** |
| `npm run fumaca` | **OK**: nenhuma exceção nem `console.error`; 3 fases jogadas em desktop e celular |
| `node testes/onda1.js` | **OK** |
| `deno test --no-remote supabase/functions` (também `npm run test:funcoes`) | **OK**, 27 de 27 |
| `node testes/nuvem.js` | **OK**, 15 de 15 |

A parte 0 sozinha (commit 5ede594) passou pela mesma bateria antes do commit.

Testes de mutação (conferência de que os testes pegam o erro): tolerância de 2 dias, token sempre aceito, idempotência desligada e consentimento ignorado derrubam os testes das funções; razão sem gasto, validação da migração desligada, envio sem checar a rede, intervalo de 60 s ignorado, estrela, bloco, moeda e item do merge sem a regra derrubam `testes/nuvem.js`.

Aviso que não é desta rodada: `testes/cobertura-audio.js` com `--semente=4` falha também no código de antes (pergunta de português 99,46%); com a semente padrão, a do `npm test`, passa.

---

## 5. Segunda passada (09/11/2026, depois da nota 6 do revisor independente)

Seis defeitos, um commit por grupo, sem push, sem conta, sem crédito gasto. `MURO={modo:'aberto'}`, `index.html`, `start_url "./index.html"` e `scope "./"` não mudaram.

| # | Defeito | Commit | Conserto | Prova |
|---|---|---|---|---|
| 1 | Webhook aceitava aviso fora de ordem (RECEIVED + UPDATED atrasado voltava a `pendente` e o reembolso dava 404; REFUNDED + CONFIRMED atrasado voltava a `confirmado`) | 0f81d27 | `_shared/pagamento.ts` `mesclarPagamento`: o estado só avança (pendente, vencido, falhou < confirmado < recebido; estornado terminal), `pago_em` mantido. O webhook lê a cobrança antes de gravar (`buscarPagamento`) e aviso vencido pela regra não mexe na assinatura (OVERDUE atrasado não marca `atrasada`). Mesma regra no banco: `0005_pagamento_so_avanca.sql` (gatilho, cobre dois avisos simultâneos) | `supabase/functions/testes/ordem.test.ts` (5 testes, inclusive reembolso 200 depois do UPDATED atrasado); `rls.sql` bloco 17 |
| 2 | `legivel` aceitava OFGUETE, FOGGUETE, GALINNHA, GALNIHA | c9285bf | Dígrafo conta como uma consoante mas entra no par: depois dele só vogal; antes de CH, QU, GU só R, S, L, N; antes de LH, NH nada; H solto só no começo. QU e GU só são dígrafo antes de vogal (ALGUMA, FIGURA seguem legíveis) | `testes/geradores.js` caso 7 com os 4 casos do revisor e mais 8; a implementação própria do teste tinha o mesmo ponto cego e foi corrigida |
| 3 | Palavras reais e inadequadas como resposta errada (PEDO, DODO, PETATE, PALO) | da9e182 | `src/conteudo/bloqueio.js` (cada palavra com motivo) + `candidatosDeGrafia` (todas as escritas possíveis, sem sorteio). `build/distratores.js` gera `docs/fase4/DISTRATORES-CONFERENCIA.md`: **268 escritas das 38 palavras, todas lidas**; 21 bloqueadas (palavra real, gíria, nome, conotação ruim, palavra estrangeira para a mesma coisa) + bloqueio preventivo de palavrões e xingamentos | `testes/distratores.js` (5 casos, no `npm test`): nada bloqueado nem real sai; escrita nova sem leitura reprova; conferência e bloqueio batem |
| 4 | `testes/nuvem.js` não pegava M5 e M6 | 9c1c976 | a9: servidor com `ganhas` menor que o aparelho; a10: fase, estrela e xp mudando durante o `sincronizarPerfil` continuam sujos e sobem no push seguinte | M5 e M6 feitas à mão: cada uma derruba o caso novo |
| 5 | Merge perdia moeda ganha offline em dois aparelhos (base 100, +50, +30 dava 150) | d5d0928 | Opção preferida: `0006_moedas_por_aparelho.sql`, tabela `moedas_aparelho` (contador por `aparelho_id`, só cresce, RLS ligada com política explícita, sem delete), total = soma. `nuvem.js`: `aparelho_id` aleatório por instalação na outbox, razão próprio + outros. ARQUITETURA 5.5 reescrita | a11 em `testes/nuvem.js` (180 nos dois aparelhos e no banco, envio repetido não soma); `rls.sql` 13e e 13f |
| 6 | Pagamento atrasado de assinatura `expirada` por novo checkout não liberava acesso | 537878e | A assinatura paga reabre (o checkout pendente novo expira antes). Não reabre se reembolsada, se já teve acesso, ou se a família já tem outra valendo (aí o evento fica com erro `pagamento_duplicado`) | `supabase/functions/testes/reabrir.test.ts` (4 testes) |

Decisões de desenho que valem registrar:
- **Critério do bloqueio para palavra estrangeira:** bloqueada se for gíria, palavrão, conotação ruim ou o nome da MESMA coisa em outra língua (ZAPATO, TOMATO); estrangeira neutra que a criança não conhece fica, com a observação na conferência (CAZA, MOPA, MALO). *Trocado na terceira passada (seção 6): palavra real do inglês é sempre bloqueada; GATE e MALE saíram.* Palavra que só é real com acento: bloqueada se, lida em voz alta, a criança reconhece (DODO = dodô); fica se não (FACO, SAPE). Quem decide diferente é o Filipe: basta trocar o veredito na conferência e a lista.
- **VELA ficou com uma escrita errada só** (FELA bloqueada, sobra VOLA). Nunca chega à criança por `errosDeGrafia` (a escrita certa pede 3; o juntar sílabas usa BOLA e MALA); exceção explícita em `testes/conteudo.js` caso 2, provada em `testes/distratores.js` caso 5. PATO e MALA saíram da escrita certa (ficaram com 2 erradas); continuam nas outras atividades.
- `errosDeGrafia` sorteia a lista crua e filtra depois, para gastar os mesmos números do sorteio de antes. Mesmo assim a amostra do `cobertura-audio.js` mudou (PATO e MALA saíram do sorteio) e achou **10 respostas de dica antigas sem clipe** (ex.: "A resposta é Na sexta."): entraram em `audio/regerar-pendentes.json`, como na parte 0. Nenhum áudio gerado.
- Numeração: a migração do defeito 1 ficou 0005 e a do defeito 5 ficou 0006 (o pedido citava 0005 para o 5; a ordem dos commits seguiu a prioridade).

### Mutações feitas à mão nesta passada (cada uma conferida e revertida)

| Regra | Mutação | Resultado |
|---|---|---|
| 1 | webhook grava o evento cru (sem `mesclarPagamento`) | 4 testes de `ordem.test.ts` caem |
| 1 | sem o filtro "aviso vencido não mexe na assinatura" | OVERDUE atrasado cai |
| 1 | estornado com nível 0 | 4 caem |
| 1 | `pago_em` não preservado | 2 caem |
| 1 | `antigo.status === 'estornado' ||` removido | não caiu: era redundante (estornado já tem o nível mais alto); a cláusula saiu do TS e do SQL |
| 2 | dígrafo aceito antes de qualquer consoante | caso 7 cai (OFGUETE) |
| 2 | sem a regra do H solto | caso 7 cai (GALNIHA) |
| 2 | sem "depois de dígrafo só vogal" | não caía; caso MALHRA acrescentado, agora cai |
| 2 | "nunca a mesma letra antes do dígrafo" removido | não caía: redundante (só R, S, L, N passam); cláusula removida |
| 3 | sem `!bloqueada(t)` | `distratores.js` caso 2 cai |
| 3 | operação nova de erro (troca das duas últimas sílabas) | caso 3 cai ("escrita nova sem leitura") |
| 3 | FELA tirada do bloqueio | casos 1, 3 e 4 caem |
| 4 | M5 (`razao.ganhas` por atribuição) | a9 cai (também depois do defeito 5) |
| 4 | M6 (`limparEnviado` apaga tudo) | a10 cai |
| 5 | servidor falso com GREATEST no total | a8 e a11 caem |
| 5 | cliente ignora os outros aparelhos | a8 e a11 caem |
| 5 | cliente conta o próprio aparelho como outro | 7 casos caem |
| 6 | expirada continua só registrando | testes de `reabrir.test.ts` caem |
| 6 | sem a checagem de outra assinatura valendo | "as duas pagas" cai |
| 6 | não expira o pendente novo | "reabre" cai |
| 6 | sem a checagem de `inicio_em` | "já teve acesso" cai |

### Portão (09/11/2026, depois do commit 537878e)

| Comando | Resultado |
|---|---|
| `npm test` (36 suítes, agora com `testes/distratores.js`) | **OK**, 323 de 323 |
| `node testes/toque.js` | **OK** |
| `npm run fumaca` | **OK**: nenhuma exceção nem `console.error`; 3 fases jogadas em desktop e celular |
| `node testes/onda1.js` | **OK** |
| `deno test --no-remote supabase/functions` | **OK**, 36 de 36 (eram 27) |
| `deno lint supabase/functions` | 0 problemas, 17 arquivos |
| `gitleaks dir .` e `gitleaks git .` | **limpo** (no leaks found) |
| `semgrep --config p/javascript --config p/secrets` em `supabase`, `nuvem.js`, `basicas.js`, `bloqueio.js`, `build/distratores.js` e testes novos | **0 achados**, 31 arquivos |
| `python3 build/build.py --check` | **OK** |

### PENDENTE desta passada

1. `rls.sql` (agora 26 OK esperados, blocos 13e, 13f e 17) e as migrações 0005 e 0006 **não rodaram em banco**: não há Postgres nesta máquina. PENDENTE-CONTA (S1).
2. Pagamento em dobro (`pagamento_duplicado`, defeito 6) e cobrança paga de assinatura já usada (`expirada_ja_usada`) ficam marcados no `webhook_evento`, mas **o estorno é manual**: não há rotina automática.
3. Mesmo item comprado em dois aparelhos offline é pago duas vezes (resíduo do modelo por aparelho, ARQUITETURA 5.5). Devolver exige preço no servidor.
4. O `aparelho_id` vai junto do snapshot na exportação LGPD (`exportar_meus_dados` usa `snapshot_perfil`); é texto aleatório, sem dado pessoal. Citar na política de privacidade quando ela for revisada.
5. 10 respostas de dica sem clipe somadas ao `audio/regerar-pendentes.json` (745 itens agora): esperam o lote de áudio.

## 6. Terceira passada (09/11/2026, depois da nota 7 do segundo revisor)

Cinco itens, um commit cada, sem push, sem conta, sem crédito gasto. `MURO={modo:'aberto'}`, `index.html` como nome, `start_url "./index.html"` e `scope "./"` não mudaram (o conteúdo do `index.html` foi reconstruído pelo `build.py` porque `nuvem.js` e `bloqueio.js` mudaram).

| # | Item | Commit | Conserto | Prova |
|---|---|---|---|---|
| 1 | Cliente inflava o próprio saldo: `moedas_aparelho` (0006) e `perfil_estado.moedas_ganhas` (0002) aceitavam insert/update direto pelo PostgREST com o JWT da família | 27cc6ec | `0007_saldo_so_pela_rpc.sql`: políticas de escrita de `moedas_aparelho` removidas e `revoke insert, update, delete, truncate` para `authenticated`; `perfil_estado` perde o update da tabela e recebe de volta só as colunas de bloco (`materia, look, config, ofensiva, colecao, desenhos, revisao_meta, prefs, blocos_em, versao_app`; nada de moedas, xp, acertos, combo, comprado) e o insert só de `perfil_id`. `sincronizar_perfil` vira `security definer`, dono `postgres`, `search_path = ''`, nomes qualificados, `perfil_e_meu` dentro, e **teto de 5000 `ganhas` a mais por chamada e por aparelho**; acima disso limita, grava em `moedas_limitadas` (tabela nova, RLS sem política) e não quebra. `nuvem.js` sobe o resto em parcelas (reagenda sozinho) e a migração aceita a primeira parcela | `rls.sql` blocos 3b (grants, definer, search_path, dono), 13b e 13f (update direto agora dá 42501), 13g (insert e update diretos negados; 2147483647 e 1e30 viram +5000; abaixo do teto entra inteiro), 14 (outra família com payload de moedas), 18 (registro do teto e B intocada). `testes/nuvem.js` a12 (perfil com 12.300 sobe em 3 parcelas, nada se perde) |
| 2 | Duas mutações sobreviviam | 9e6164d | `reabrir.test.ts`: família com assinatura `atrasada` paga o checkout velho, não reabre e fica `pagamento_duplicado`. `testes/nuvem.js` a9b: servidor devolve `gastas` menor que o do aparelho | as duas mutações do revisor agora derrubam 1 teste cada (tabela abaixo) |
| 3 | `reabrirPaga` gravava em duas etapas | 1a03805 | `0008_reabrir_assinatura_atomica.sql`: `public.reabrir_assinatura_paga`, `security definer`, dono `postgres`, `search_path = ''`, execute só para `service_role`. Trava as assinaturas da família em ordem de id, expira o pendente e ativa a paga na mesma transação. O webhook chama a RPC e, se ela responder `mudou` (outro aviso já tratou), relê e segue o caminho normal. O banco em memória dos testes imita a RPC e passa a cobrar `assinatura_vigente_unica` também no update | `reabrir.test.ts`: A e B pagos juntos (uma só valendo, o outro aviso marcado), CONFIRMED e RECEIVED juntos, e o caminho `mudou`. `rls.sql` bloco 19 |
| 4 | Linha `legado` contada em dobro | 1eb5727 | `nuvem.js` `nuvemDescontarLegado`: o razão montado por `nuvemRazaoInicial` já inclui o legado. Uma vez, antes do primeiro envio (e no primeiro puxar), o razão do aparelho desconta a linha `legado`, campo a campo e sem ficar negativo: total = o maior dos dois, como na regra antiga | `testes/nuvem.js` a13 (legado 100 + razão 100 = 100, ganho novo soma) e a13b (aparelho vazio herda o legado 100/30) |
| 5 | Distratores que são palavra real em inglês | 0ab4a24 | Regra conservadora: **palavra real do inglês corrente é sempre bloqueada** (o app ensina inglês). Bloqueadas GATE, MALE, PIPE, TADA, DENE, e GALINA a pedido. Releitura das liberadas: espanhol neutro fica com observação (CAZA, CESA, GASA, MALO, MOPA, PIDA, UVE e agora ARTO); PATU e RATU (empréstimos maori e fijiano em dicionário de inglês, não são inglês corrente) e FAPA, FAPETE (não são palavra) ficam, com observação. Conferência: 268 escritas, 27 bloqueadas, 241 liberadas | GATO, PIPA e FADA ficam com 2 erradas e saem da escrita certa sozinhas (`grafiaCerta` pede 3), como PATO. MALA fica com 1 (sobra MALO): mesma regra de VELA, exceção em `testes/conteudo.js` caso 2 e `testes/distratores.js` caso 5 prova que o juntar sílabas usa MAPA, BOLA e VELA |

### O saldo continua sendo, em parte, confiança no cliente

Abaixo do teto, o servidor não sabe se as moedas foram ganhas jogando: o jogo roda offline no aparelho e só o aparelho vê as respostas. O que a 0007 garante é o **tamanho** do estrago, não a ausência dele:
- ninguém grava moeda fora da RPC (nem `moedas_aparelho`, nem as colunas de `perfil_estado`);
- cada chamada sobe no máximo 5000 por aparelho. Pela economia do app (10 por acerto, +5 a cada 3 seguidos, +20 na fase perfeita e +5 na revisão no fim da fase, baú até 20, kit 15), isso é umas 300 respostas certas seguidas; online o app sincroniza a cada 60 s, e a criança média ganha ~180 por dia;
- um adulto com o JWT da própria família ainda consegue subir até 5000 por chamada, e o limite de 240 sincronizações por hora (`limite_ok_usuario`) segura isso em ~1,2 milhão por hora. O dano fica dentro da família: moeda só compra cosmético do jogo, não vale dinheiro, não é vendida e não há ranking entre famílias.

Fechar de vez exigiria o servidor reproduzir cada lição (pergunta, resposta, tempo), o que não cabe num app que funciona offline. O mesmo vale para `xp`, estrelas e contadores do dia (nunca descem, mas sobem pelo que o aparelho disser) e para `comprado` (a RPC une o que vier, sem preço no servidor; item 3 do PENDENTE da seção 5).

### Mutações feitas à mão nesta passada (cada uma conferida e revertida)

| Regra | Mutação | Resultado |
|---|---|---|
| 2 (revisor) | `atual.status === 'atrasada' ||` tirado de `vale` (feita no código de antes do item 3) | cai 1 teste (`reabrir.test.ts`, família atrasada) |
| 2 (revisor) | `Math.max` trocado por atribuição no `gastas` do próprio aparelho em `nuvemMesclar` | cai a9b |
| 1 | `nuvem.js` sem reagendar quando falta subir (sem `nuvemFaltaSubir` no `subir`) | cai a12 |
| 1 | migração sem aceitar a primeira parcela (`moedasOk` só com `e.moedas`) | cai a12 |
| 3 | webhook de volta ao `reabrirPaga` em duas etapas (código do commit 9e6164d) | cai "A e B pagos juntos" (B paga e expirada, sem marca) |
| 3 | RPC em memória sem expirar o pendente | caem 3 testes |
| 3 | `mudou` sem reler (retorna direto) | cai o teste do `mudou` |
| 4 | sem o desconto do legado antes do primeiro envio | cai a13 |
| 4 | desconto sem `legadoPendente=false` (repete a cada envio) | cai a13 |
| 4 | desconto sem o piso de 0 | **não caiu**: o merge seguinte já corrige (o servidor guarda `greatest(..., 0)` e o próprio contador volta pelo maior). O piso fica como defesa; não há estado observável que o separe |
| 5 | MALE tirada do bloqueio | `distratores.js` casos 3 e 4 caem |
| 5 | MALA tirada da exceção `POUCOS` | `conteudo.js` caso 2 cai |
| 1 (SQL) | as provas de `rls.sql` não rodam sem Postgres: mutação feita só no servidor falso (`testes/nuvem.js` sem o teto) | a12 cai |

### Portão (09/11/2026, depois do commit 0ab4a24)

| Comando | Resultado |
|---|---|
| `npm test` (36 suítes) | **OK**, 327 de 327 (eram 323: a9b, a12, a13, a13b) |
| `node testes/toque.js` | **OK** |
| `npm run fumaca` | **OK**: nenhuma exceção nem `console.error`; 3 fases jogadas em desktop e celular |
| `node testes/onda1.js` | **OK** |
| `deno test --no-remote supabase/functions` | **OK**, 40 de 40 (eram 36) |
| `deno lint supabase/functions` | 0 problemas, 17 arquivos |
| `deno lint` (repositório inteiro) | 626 avisos em 135 arquivos, **os mesmos 626 do commit c92aaa8** (variável sem uso e `window` no JS de navegador); nenhum novo |
| `gitleaks dir .` e `gitleaks git .` | **limpo** (no leaks found) |
| `semgrep --config p/javascript --config p/secrets` em `supabase`, `nuvem.js`, `bloqueio.js`, `build/distratores.js`, `testes/nuvem.js`, `testes/conteudo.js` | **0 achados**, 32 arquivos, 110 regras |
| `python3 build/build.py --check` | **OK** |

### PENDENTE desta passada

1. `rls.sql` (agora **30 OK** esperados: blocos 3b, 13g, 18 e 19 novos; 13b e 13f ajustados) e as migrações 0005 a 0008 **não rodaram em banco**: não há Postgres nesta máquina. O SQL foi revisado à mão (ordem dos grants, dono e `search_path` das duas `security definer`, nomes qualificados, gatilhos chamados de dentro só usam funções do `pg_catalog`). PENDENTE-CONTA (S1).
2. Com dois avisos juntos, o caminho normal (cobrança do checkout NOVO confirmada) ainda é um PATCH simples. Se a RPC reabrir a velha no meio, esse PATCH bate no índice e devolve 500; o Asaas repete, e na repetição o webhook vê a nova já `expirada`, chama a RPC e marca `pagamento_duplicado`. Estado final certo, com um 500 no caminho (provado no teste "A e B pagos juntos").
3. `moedas_limitadas` não entra na exportação LGPD (`exportar_meus_dados`): só tem `aparelho_id` aleatório e números. Avaliar na revisão da política de privacidade.
4. Os itens 2 a 5 do PENDENTE da seção 5 continuam valendo (estorno manual, item comprado em dois aparelhos offline, `aparelho_id` na exportação, clipes pendentes).


## 7. Revisão final da terceira passada: nota 7, NÃO APROVADA (10/11/2026)

O que falta para chegar a 8:
1. Os testes deno de reabertura exercitam uma imitação em TS da RPC, não o SQL da 0008. Trocar `in ('ativa','atrasada')` por `in ('ativa')` em `0008:63` mantém 40/40. Completar o bloco 19 de `rls.sql` com os casos `atrasada` e `cancelada`.
2. O teto de 5000 da 0007 e os grants só se provam no `rls.sql`, que nunca rodou. No `rls.sql`, criar o perfil como `authenticated`, não como superusuário. Na S1, rodar `rls.sql` antes de tudo e contar 30 "OK:".
3. Decidir com o Filipe FAPA e FAGA, que lembram gíria chula do inglês. GALINA, MALE e GATE foram bloqueadas pela regra conservadora, também a confirmar.
4. O teto vale por aparelho, não por chamada (até 51 linhas). O número "1,2 milhão por hora" desta seção está subestimado. `moedas_limitadas` não tem retenção.
5. Transitório: o saldo pode aparecer 0 em outro aparelho por alguns minutos, enquanto `ganhas` sobe em parcelas. Nada se perde.
