# Auditoria de segurança e LGPD: O Universo de Bobby (PWA local)

Data: 24/10/2026. Branch `reforma-fase-2`, commit `21946bb`. Auditoria só de leitura: nada em `src/`, `index.html`, `sw.js`, `audio/`, `arte/` ou `assets/` foi alterado. Nada foi enviado a terceiros, publicado ou gasto.

Skills aplicadas: `seguranca-minima` (7 itens) e `lgpd-gate` (7 perguntas). Leitura de base: `docs/FASE-2-especificacao.md` (seções 7.4, 8.4 e 9), `pesquisa/03-etica-e-lgpd-infantil.md`, `README-FASE-3-LOGICA.md`.

**Aviso:** isto é auditoria técnica, não parecer jurídico. Tudo que toca base legal, consentimento, termos e política precisa de advogado de proteção de dados antes de venda. Os artigos de lei citados vêm da pesquisa `03-etica-e-lgpd-infantil.md` (que marca como aberta no planalto.gov.br); não reabri o texto oficial nesta rodada porque nenhum artigo precisou de confirmação nova.

---

## 1. Veredito

| Pergunta | Resposta |
|---|---|
| Publicável como PWA local (link público, sem conta, tudo no aparelho)? | **Sim, depois de 3 correções pequenas** (P0 abaixo: XSS por backup, meta CSP, pasta de deploy só com o público). Sem elas: **não**. O risco real hoje é baixo porque o app não tem rede, conta, banco nem pagamento, mas a falha de XSS por arquivo de backup é um defeito de verdade e a correção é de poucas horas. |
| Vendável (cobrança, conta na nuvem, loja de apps)? | **Não.** Falta a camada inteira de conformidade (termos, política, consentimento parental verificável, aferição de idade, encarregado, RIPD, parecer sobre ofensiva e baú), e o PIN precisa ser refeito. Lista na seção 6. |

### As 5 maiores falhas

1. **XSS armazenado por backup `.json` importado.** Campos de pergunta (`prompt`, `options`, `answer`) e `espera.presente` do arquivo entram em `innerHTML` sem escapar. Um arquivo trocado entre famílias executa script no app. `licao.js:150,154,410`, `ciclo-ui.js:90`, `estado.js:110,151,158`.
2. **Sem Content-Security-Policy e sem cabeçalhos de segurança.** `shell.html:3-22` não tem meta CSP e o repositório não tem `_headers`. Qualquer XSS (falha 1) poderia mandar o conteúdo do `localStorage` para fora. Testei uma meta CSP compatível (seção 4.5): funciona, o teste de fumaça completo passou.
3. **Deploy pela raiz expõe pastas que não são públicas.** A raiz tem `arte/` (460 MB), `docs/`, `pesquisa/`, `build/`, `testes/`. A regra 7 da skill proíbe publicar a raiz. Falta uma pasta `dist/` só com os arquivos do app.
4. **PIN do responsável é hash de 32 bits sem limite de tentativas.** `voz-e-seguranca.js:68-83`. Quebra em milissegundos e se contorna apagando `STORE.senha` no DevTools. É aceitável como trava de interface contra criança, desde que seja dito assim; para venda precisa de PBKDF2 e de limite de tentativas.
5. **Apagar perfil deixa dados da criança para trás.** `apagarPerfil` (`estado.js:309-318`) remove o perfil e os eventos, mas não toca em `mundo-numeros-v2` (original v3), `mundo-numeros-v2.bak-v3` nem `universo-bobby-v4.corrompido`, que guardam apelido e progresso. Também não existe "apagar tudo". Fere a promessa de exclusão (LGPD art. 15 e 16; ECA Digital art. 18).

---

## 2. Varredura local (sem enviar nada a terceiros)

| Ferramenta | Comando | Resultado |
|---|---|---|
| gitleaks (arquivos) | `gitleaks dir . --redact` | 105 MB varridos, **0 vazamentos** |
| gitleaks (histórico) | `gitleaks git . --redact` | 31 commits, **0 vazamentos** |
| semgrep | `semgrep --metrics=off --config auto` | **Não rodou:** `--config auto` exige métricas ligadas ("Cannot create auto config when metrics are off"). Substituí por regras do registro, com métricas desligadas: `--config p/javascript --config p/secrets --config p/xss` em `src sw.js testes build` |
| semgrep (substituto) | idem | 104 regras, 62 arquivos, **0 achados**. Atenção: as regras de XSS do semgrep não pegaram o `innerHTML` com dado do backup (seção 3.1). Zero achado do semgrep não prova ausência de XSS neste código |
| grep de padrões de chave | `AIza`, `sk-`, `Bearer`, `api_key`, `secret`, `service_role`, `eyJhbGci` em `src`, `sw.js`, `build`, `testes`, `index.html`, manifestos, READMEs | 2 ocorrências, ambas falso positivo: a palavra "secreta" numa frase de teste em `testes/audio.js:191,194`. Nenhuma chave |
| npm audit | não aplicável | `package.json` não tem `dependencies` nem `devDependencies` e não há `package-lock.json`. Nada a auditar |
| `.env` | `.gitignore:2-3` cobre `.env` e `.env.*` | ok. Nenhum arquivo `.env`, `.key` ou `.pem` rastreado |

Rede e dependências externas (grep em `src/` e `sw.js` por `fetch`, `XMLHttpRequest`, `sendBeacon`, `WebSocket`, `EventSource`, `importScripts`, `<form`, `http(s)://`):

- `fetch` só em `audio.js:54,75,201` (manifesto e clipes de áudio, caminho relativo, mesma origem) e em `sw.js` (mesma origem). **Nenhum** `XMLHttpRequest`, `sendBeacon`, `WebSocket`, `EventSource`, `<form` ou URL absoluta `http(s)://`.
- Nenhum CDN, Google Fonts, analytics ou SDK. As fontes são locais (`assets/fontes/*.woff2`). **jsPDF não existe mais** (0 ocorrências em `index.html`, `src`, `sw.js`).
- Sem `Notification`, `PushManager`, `geolocation`, `getUserMedia` ou `mediaDevices` em `src/`.
- `index.html` tem 14 `<script>` inline e 1 `<style>` (a build inlina tudo). Há 2 `onerror=` em texto; o grep indica que são atributos montados em HTML dinâmico, não varridos um a um.

**Resultado:** o esperado (nenhum dado sai do aparelho) se confirma no código.

---

## 3. Revisão de código focada

### 3.1 XSS e `innerHTML`

`escapa()` existe (`utilidades.js:5`) e cobre `& < > " '`. O apelido do jogador é escapado em todos os pontos que encontrei (`perfil-e-responsavel.js:14,102`, `backup.js:57,60,70`, `ciclo-ui.js:66,117`). Há 59 usos de `innerHTML` e família em `src/interface/`; não revisei os 59 um a um, revisei todos os que recebem dado que pode vir de fora (backup, `localStorage` adulterado).

**Falha (alta para publicação).** O backup passa por `estadoDe()`, que limita tamanho e tipo de quase tudo, mas deixa passar texto livre em três lugares que depois viram HTML:

| Campo do arquivo | Onde é aceito | Onde vira HTML sem escapar |
|---|---|---|
| `errados[k][]` (objeto com `prompt`) | `estado.js:151` filtra só `q.prompt!==undefined`, mantém o objeto inteiro | `caderno-e-revisao.js:21` monta a "Revisão do Mundo" com essas perguntas; `licao.js:150` faz `'<h2 class="pergunta">'+q.prompt+'</h2>'`, `licao.js:154` faz `...<span>'+o+'</span>` para cada `options`, `licao.js:410` faz `'A resposta certa é <b>'+q.answer+'</b>.'` |
| `revisao.congelados[k]` (pergunta congelada) | `estado.js:110` aceita o objeto inteiro se `prompt` é string | mesma tela de pergunta, via revisão espaçada |
| `espera.presente` (até 40 caracteres) | `estado.js:158` | `ciclo-ui.js:90`: `'<li>No baú de amanhã: '+b.presente+'</li>'` |

Um payload curto como `<img src=x onerror=...>` cabe nos 40 caracteres de `presente`. O texto das perguntas geradas pelo app usa HTML de propósito (`<b>`), por isso `licao.js` não escapa; o erro está em aceitar, da fonte externa, objetos de pergunta no mesmo formato.

**Impacto:** quem importa um backup "recebido de outra família" ou adulterado executa JS na origem do app, com acesso a todos os perfis e ao `localStorage`. Sem CSP (3.5), esse script também consegue enviar tudo para fora. Probabilidade baixa (backup circula pouco), gravidade alta (dado de criança).

**Correção (esforço 2 a 3 h):** (a) em `estadoDe`, descartar de `errados` e `congelados` qualquer pergunta cujos campos de texto contenham `<`, ou reduzir `options`/`answer` a texto puro; (b) `escapa(b.presente)` em `ciclo-ui.js:90` e validar `presente` contra a lista de categorias do baú; (c) teste novo em `testes/estado.js` que importa um backup com `<img onerror>` em cada campo e falha se algum aparecer no DOM; (d) idealmente semgrep com regra própria para `innerHTML` com variável.

Dois pontos menores: `pedirSenha` insere `titulo` e `texto` sem escapar (`voz-e-seguranca.js:91`), mas os chamadores só passam texto fixo (ok hoje). `alertaResp(msg)` também não escapa; os chamadores escapam (`backup.js:50,57`).

### 3.2 Importação de backup `.json`

| Ponto | Situação | Evidência |
|---|---|---|
| Validação de schema | **Parcial.** `app` e `versao` conferidos; `estadoDe` normaliza números (`intDe`/`numDe` com limites), listas (`listaDe` com teto), datas (`ehDia`) e strings (`slice`). Texto livre em perguntas passa (3.1) | `backup.js:22-34`, `estado.js:60-165` |
| Tamanho do arquivo | **Falha (baixa).** Nenhum teto de bytes antes de `JSON.parse`; `FileReader.readAsText` lê qualquer tamanho. Arquivo gigante trava a aba | `backup.js:46-56` |
| Soma de verificação | `fnv8` (FNV-1a de 32 bits), sem segredo. **Detecta arquivo cortado ou editado sem querer. Não é controle de segurança:** quem edita à mão recalcula a soma. O app avisa e deixa importar mesmo assim | `backup.js:5`, `backup.js:62-68` |
| Prototype pollution | **Sem caminho encontrado até `Object.prototype`.** O `clonar()` por `JSON.stringify/parse` cria `__proto__` como chave própria. Gravações dinâmicas `obj[k]=...` com `k` vindo do arquivo (`feitas`, `errados`, `porLicao`, `congelados`, `itens`) podem alterar o protótipo do sub-objeto local, não o global. Análise de leitura; não executei prova de conceito | `estado.js:60-165` |
| Sobrescrita | Se o `id` do backup coincide com um perfil existente, o app pergunta "substituir ou salvar como outro". Nunca silencioso | `backup.js:62-80` |
| O que o backup leva | Apelido (`nome`, 18 caracteres), `id`, `cor`, progresso, ofensiva, desenhos coloridos, erros guardados, config. **Não leva** `pid`, eventos de medição nem a senha | `backup.js:7-10`, comentário `backup.js:3-4` |
| Cifra do backup | Texto claro. É dado de criança em arquivo solto. O app não avisa isso na tela | `backup.js:41-46`, `perfil-e-responsavel.js:138-141` |

### 3.3 PIN do responsável

| Pergunta | Resposta | Evidência |
|---|---|---|
| Hash e sal | Sal aleatório de 8 caracteres (`Math.random`), hash **djb2 de 32 bits**, "alongado" com 5.000 voltas de uma soma trivial. Não é argon2, bcrypt nem PBKDF2 | `voz-e-seguranca.js:68-76` |
| Espaço de busca | PIN de 4 a 6 dígitos (10 mil a 1 milhão). Teste de todos os PINs leva milissegundos | `voz-e-seguranca.js:102` |
| Limite de tentativas | **Nenhum.** Erra e tenta de novo sem atraso nem bloqueio | `voz-e-seguranca.js:107` |
| Onde fica o hash | No mesmo `localStorage` (`STORE.senha`), legível por quem abre o DevTools | `estado.js:199-208` |
| Contorno | Apagar `STORE.senha` e recarregar, ou ler `liberadoAte`, abre a área. Não há segredo no servidor porque não há servidor | `voz-e-seguranca.js:67,85` |
| Sessão do responsável | Fica liberada por 15 minutos depois do PIN | `voz-e-seguranca.js:85,104` |
| O que ele protege | Relatórios, apagar perfil, restaurar backup, medidor, controles | `voz-e-seguranca.js:64` |
| Verdade sobre a força | O próprio código diz: "Não é criptografia de verdade, é uma tranca simples para a criança não entrar sozinha". **Isso está correto.** O README da fase 2 (item B22) já lista PBKDF2 como pendente. A tela do responsável chama de "senha" e não avisa que é só trava de interface | `voz-e-seguranca.js:64-66`, `README-FASE-3-LOGICA.md:29` |

**Leitura:** como trava contra criança de 7 a 12 anos, serve. Como "controle parental" no sentido do ECA Digital art. 17, não serve, porque a criança que mexer no navegador remove a trava. Para o PWA local: dizer isso na tela e registrar a exceção em nota de decisão no cofre (a skill `seguranca-minima` exige nota para PIN fora de argon2 ou bcrypt). Para venda: o controle parental real vive na conta do responsável na nuvem, não no aparelho da criança.

### 3.4 Service worker (`sw.js`)

| Ponto | Situação | Evidência |
|---|---|---|
| Escopo | `./` (manifesto `scope: "./"`, registro `./sw.js`). Adequado | `manifest.webmanifest`, `pwa.js:4` |
| Cache de outros domínios | Hoje não há requisição externa, então nada é cacheado de fora. Mas os testes `ehAudio`/`ehArte` olham só o **caminho** (`url.pathname`), sem conferir a origem. Uma resposta CORS 200 de outro domínio com caminho `/audio/x.m4a` seria cacheada | `sw.js:35-37,46-61` |
| Navegação | Qualquer navegação com resposta 200 grava a resposta em `./index.html` do cache. Se um dia o host devolver outra página 200 para uma rota do escopo, o cache offline do app é substituído por ela | `sw.js:72-82` |
| Atualização | Network-first para a página, `skipWaiting` e recarga única na troca de versão; checa a cada hora. Bom para correção rápida; o lado ruim é que o SW novo vem do mesmo servidor, sem assinatura. É o padrão da plataforma | `sw.js:19-21,100-103`, `pwa.js` |
| Limpeza | Só apaga `bobby-*` antigos; `bobby-audio-*` e `bobby-arte-*` ficam. Sem rotina de limpar tudo | `sw.js:23-29` |
| Divergência de documento | O README da fase 3 diz `bobby-v4` e `bobby-v3`; o código tem `bobby-v5` | `sw.js:6` |

**Correções (esforço 1 h):** guardar só se `url.origin===self.location.origin` nas três rotas; na rota de página, só regravar `./index.html` quando `url.pathname` for o início do app; ajustar a nota do README.

### 3.5 CSP

**Hoje:** não há meta CSP no `shell.html` (que gera o `index.html`) e não há `_headers` ou configuração de cabeçalho no repositório. Nenhum cabeçalho de segurança.

**Recomendação (testada, não aplicada):** como a build inlina 14 scripts e 1 estilo, uma CSP sem `'unsafe-inline'` exigiria hashes ou nonce. Para o PWA local, esta política compatível é o mínimo que já fecha a saída de dados:

```
default-src 'none'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';
img-src 'self' data: blob:; font-src 'self'; media-src 'self' blob:; connect-src 'self';
manifest-src 'self'; worker-src 'self'; base-uri 'none'; form-action 'none'; object-src 'none'
```

**Teste feito:** copiei o projeto para a pasta temporária da sessão (links para `audio/` e `assets/`), injetei essa política como `<meta http-equiv="Content-Security-Policy">` na cópia do `index.html` e rodei `node testes/fumaca.js` (Chrome headless, desktop e celular, três fases jogadas, ciclo completo, migração, áudio gravado, service worker, modo offline). Resultado: **"OK: nenhuma exceção nem console.error; 3 fases jogadas em desktop e celular"**. Os únicos avisos foram o 404 de `/favicon.ico` do servidor de teste, que já existiria sem a CSP. O projeto original não foi modificado.

**Limites da recomendação:**
- `'unsafe-inline'` em `script-src` não impede o XSS de executar. O ganho real é `connect-src 'self'` e `form-action 'none'`: um script injetado não consegue mandar o `localStorage` para fora. Por isso a correção 3.1 continua obrigatória.
- Meta CSP não aceita `frame-ancestors`. Esse e os demais cabeçalhos entram no `_headers` da hospedagem.
- Melhor depois: tirar os scripts inline da build (arquivos `.js` separados com hash, ou nonce na hospedagem) e remover `'unsafe-inline'`.

**Cabeçalhos para a hospedagem (arquivo `_headers` do Cloudflare Pages, dentro de `dist/`):** `Content-Security-Policy` (a mesma, mais `frame-ancestors 'none'`), `Strict-Transport-Security: max-age=31536000`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: no-referrer`, `Permissions-Policy: camera=(), microphone=(), geolocation=()`, `Cross-Origin-Opener-Policy: same-origin`.

### 3.6 Eventos de medição (`medicao.js`)

| Pergunta | Resposta | Evidência |
|---|---|---|
| Local? | Sim. Fica em `universo-bobby-eventos-v1` no `localStorage`; sai do aparelho só se o responsável exportar | `medicao.js:5,127` |
| Texto livre? | **Não passa.** Só número, booleano ou código curto `^[a-z0-9_.:/-]{0,80}$`; nomes de evento em lista fechada (23); chaves com `nome`, `apelido`, `email`, `texto`, `senha`, `telefone`, `cpf` são descartadas | `medicao.js:12-14,38-46` |
| Apelido nos eventos? | Não. Os registros levam `pid` (sorteio de 12 caracteres, separado do `id` do perfil e do apelido), dia local, hora cheia, id da sessão e versão do app | `medicao.js:49-57` |
| Retenção | 4.000 eventos ou 120 dias, o que vier primeiro. Apagados junto com o perfil (`apagarEventosDe`) | `medicao.js:8,32-36`, `estado.js:315` |
| Exportação | `pacoteDeMetricas` troca o `pid` por outro sorteio e remove a sessão. Bom | `medicao.js:119-125` |
| Falha de rótulo | O pacote se chama `tipo:'metricas-anonimas'`. Ele é **pseudonimizado**, não anonimizado: guarda dia e hora de uso de uma criança, em sequência. Quem conhece a família reidentifica. Troque o rótulo para `metricas-pseudonimizadas` | `medicao.js:126` |
| Ponto de atenção | `audio_falha` grava um código do clipe (`clip`), o teste `testes/audio.js:191-194` confirma que vira `sem-<hash>` e nunca o texto | `audio.js:122` |
| Ponto de atenção | Dentro do app há painel D1/D7/D30 atrás do PIN. Decisão pendente do Filipe (README fase 2). Em termos de LGPD o painel local é neutro | `README-FASE-3-LOGICA.md:18` |

### 3.7 Outros achados de código

- **Gancho de ambiente alheio.** `entregar()` tenta `window.claude.use('downloads')` antes do download comum (`telas-auxiliares.js:121-123`). Resto de quando o app rodava como artefato do claude.ai. Em produção o objeto não existe e cai no caminho normal, mas é código que depende de objeto global de terceiro; remover.
- **Falha de gravação.** `salvarStore` avisa se a cota estoura (`estado.js:268,275`). Bom.
- **Migração.** A cópia bruta do v3 e a versão corrompida do v4 são guardadas em chaves próprias (`migracao.js:6-8`); ver falha 5.
- **Inconsistência de faixa etária.** `manifest.webmanifest` e a meta description dizem "8 a 13 anos"; a pesquisa e o app usam 7 a 12 (faixas `f78`, `f910`, `f1112`, `estado.js`). Quem tem 13 é adolescente pela lei; quem tem 7 está fora da descrição pública. Alinhar antes de publicar.

---

## 4. Tabela de itens (`seguranca-minima`)

| # | Item | Situação | Evidência |
|---|---|---|---|
| 1 | Toda rota verifica a sessão | **Não se aplica** | Não há servidor, rota, Worker ou API. Todo `fetch` é de arquivo estático da mesma origem (`audio.js:54,75,201`, `sw.js`). Reabre quando houver nuvem |
| 2 | Senha nunca em texto | **Falha** (baixa no PWA local, bloqueia venda) | PIN com djb2 de 32 bits, sal fraco (`voz-e-seguranca.js:68-83`). O app não guarda o PIN em texto, mas hash simples "não conta" pela skill. Resolver com PBKDF2 (`crypto.subtle`) ou com nota de decisão no cofre |
| 3 | Limite de tentativas | **Falha** (PIN local); servidor **não se aplica** | Sem contador nem atraso (`voz-e-seguranca.js:107`). Limite local não é segurança real (o DevTools zera), mas reduz o chute casual |
| 4 | RLS em toda tabela | **Não se aplica** | Sem banco. Reabre quando houver Supabase: RLS em toda tabela com dado de criança, política com `to authenticated`, teste esperando 401/403 |
| 5 | Dado sensível cifrado e mínimo | **Aprovado com ressalvas** | Mínimo: apelido (18 caracteres), faixa (não data de nascimento), sem e-mail, foto, voz, localização (grep 3.1). Ressalva: `localStorage` e backup em texto claro, sem aviso na tela; resíduos após apagar (falha 5) |
| 6 | Chaves | **Aprovado** | gitleaks arquivos e histórico: 0; semgrep 104 regras: 0; grep: 0 chaves; `.gitignore:2-3` cobre `.env*`. Nenhuma chave no app (não usa API) |
| 7 | Publicar só o que é público | **Falha** | Raiz com `arte/` 460 MB, `docs/`, `pesquisa/`, `build/`, `testes/`, `src/` e `.git` 138 MB; não existe `dist/` nem `_headers`; sem CSP (`shell.html:3-22`). `npm run build` gera o `index.html` na raiz |

## 5. Tabela de revisão focada

| Área | Situação | Evidência |
|---|---|---|
| XSS: apelido | **Aprovado** | `escapa()` em todos os pontos vistos (`utilidades.js:5`, `perfil-e-responsavel.js:14,102`, `backup.js:57,60,70`) |
| XSS: dados do backup | **Falha (alta)** | `licao.js:150,154,410`, `ciclo-ui.js:90`, `estado.js:110,151,158` |
| Backup: schema | **Aprovado com ressalva** | `estadoDe` limita tipos; texto livre em perguntas passa |
| Backup: tamanho | **Falha (baixa)** | `backup.js:46-56` |
| Backup: soma de verificação | **Aprovado como integridade; não é segurança** | `backup.js:5` (FNV sem segredo) |
| Backup: prototype pollution | **Aprovado** (análise de leitura) | `estado.js:60-165`; sem caminho até `Object.prototype` |
| PIN: força | **Falha**, mas é trava de interface declarada no código | `voz-e-seguranca.js:64-83` |
| PIN: limite de tentativas | **Falha** | `voz-e-seguranca.js:107` |
| Service worker: escopo e atualização | **Aprovado** | `sw.js`, `pwa.js` |
| Service worker: origem e navegação | **Falha (baixa)** | `sw.js:46-61,72-82` |
| CSP / cabeçalhos | **Falha**; recomendação testada | `shell.html:3-22`; teste na seção 3.5 |
| Dependências externas | **Aprovado** | 0 CDN, 0 fonte remota, 0 jsPDF, 0 analytics (grep seção 2) |
| Dados enviados para fora | **Aprovado** | 0 `XMLHttpRequest`, `sendBeacon`, `WebSocket`, `<form`, URL absoluta |
| Eventos de medição | **Aprovado com ressalva** | `medicao.js:12-57`; trocar rótulo "anônimas" por "pseudonimizadas" |
| Código de ambiente alheio | **Falha (baixa)** | `telas-auxiliares.js:121-123` |

---

## 6. LGPD e ECA Digital

### 6.1 Inventário de dados pessoais tratados

Tudo fica no navegador do aparelho. O Filipe (ou a empresa) **não recebe nada**. Hoje não há controlador que receba dado; a família é quem guarda. A LGPD ainda se aplica a quem desenvolve e distribui o app quando o dado é tratado por ele, e o ECA Digital (Lei 15.211/2025) vale para o produto "direcionado a criança" (pesquisa 03, seção 2.1). A leitura jurídica de quem é controlador num app 100% local é questão para o advogado.

| Dado | Onde | Origem | Finalidade | Necessário? |
|---|---|---|---|---|
| Apelido da criança (até 18 caracteres) | `universo-bobby-v4`, backup | digitado | identificar o perfil na tela "Quem vai jogar?" | sim, mínimo |
| Cor do avatar | idem | escolha | personalização | sim |
| Faixa etária (`f78`, `f910`, `f1112`) | idem | escolha do responsável | ajustar o conteúdo | sim; não guarda data de nascimento |
| Progresso: fases, XP, moedas, estrelas, erros, revisão espaçada, desenhos coloridos, coleção | idem | uso | funcionamento do jogo e da revisão | sim |
| Ofensiva, dias de uso, tempo por dia (`stats.dias`) | idem | uso | ofensiva e relatório ao responsável | sim |
| Config do responsável (meta, dias livres, limite de blocos, lembrete) | idem | responsável | controle do responsável | sim |
| Hash do PIN | idem | responsável | trava da área | sim |
| Eventos de medição (`pid`, evento, dia, hora, sessão, versão) | `universo-bobby-eventos-v1` | uso | medir retenção do produto | não é estritamente necessário para a criança jogar; ver 6.3 |
| Cópia do estado antigo (v3) | `mundo-numeros-v2`, `.bak-v3` | migração | segurança da migração | temporário; sem prazo de descarte (falha 5) |
| Clipes de áudio e arte em cache | Cache Storage | app | uso offline | sim; não é dado pessoal |

Não tratam: nome completo, e-mail, telefone, CPF, foto, voz, microfone, geolocalização, contatos, identificador de aparelho. Confirmado por grep (seção 2) e por `medicao.js:14,38`.

### 6.2 As sete perguntas da `lgpd-gate`

| # | Pergunta | Situação |
|---|---|---|
| 1 | De onde veio a base? | **Não se aplica.** Não há base de contatos |
| 2 | Qual a base legal? | **Falta definir.** Sugestão a validar com advogado: execução do serviço escolhido pela família para o dado necessário ao jogo; consentimento parental específico para o que sair do necessário (eventos de medição, se forem enviados um dia). Pesquisa 03, seção 2.3, recomenda consentimento parental para tudo que não for estritamente necessário |
| 3 | Opt-out em toda mensagem? | **Não se aplica.** O app não envia mensagem nem notificação. O lembrete é um arquivo `.ics` que o responsável baixa (config `lembrete.ics`) |
| 4 | Onde o dado fica e por quanto tempo? | **Falha.** Fica no aparelho, sem prazo de retenção escrito. Eventos têm teto (120 dias ou 4.000). Perfil e cópias v3 ficam até o responsável apagar, e a exclusão é incompleta |
| 5 | Quem acessa? | **Aprovado para o PWA local:** só quem usa o aparelho; área do responsável atrás de PIN fraco (3.3). Para nuvem: RLS e acesso mínimo |
| 6 | Credenciais fora do código? | **Aprovado.** gitleaks 0, nenhuma chave |
| 7 | É dado sensível? | **Sim, tratar como alto cuidado:** criança. Progresso escolar e tempo de uso de menor de 12 anos. Mantido local e mínimo, o risco é baixo |

### 6.3 Pontos do pedido

| Ponto | Situação | Evidência |
|---|---|---|
| Consentimento dos pais | **Falha para venda; aceitável no PWA local sem coleta.** Hoje não há conta, nem tela de consentimento, nem aviso de privacidade antes do primeiro uso. Quem usa é a família que instalou. Para venda: consentimento específico e em destaque de pelo menos um dos pais, separado dos termos (LGPD art. 14 §1º; pesquisa 03, seção 4.2) | `perfil-e-responsavel.js:143-148` só informa dentro da área do responsável |
| Minimização | **Aprovado** | inventário 6.1 |
| Retenção e exclusão | **Falha.** Apagar perfil exige PIN e remove perfil + eventos, mas deixa `mundo-numeros-v2`, `.bak-v3` e `.corrompido`. Não há "apagar tudo" nem "apagar meus dados". Backup baixado fica fora do controle do app. Cache de áudio/arte não é dado pessoal | `estado.js:309-318`, `migracao.js:6-8`, `estado.js:231,255` |
| O que o backup contém | Apelido, id, cor, progresso, ofensiva, desenhos, erros, config. Sem `pid`, eventos e senha. Texto claro. Sem aviso de que é dado de criança | `backup.js:7-10` |
| Publicidade comportamental e perfilamento | **Aprovado.** 0 SDK de anúncio, 0 analytics, 0 rede. O "perfil" de dificuldade (revisão espaçada) é pedagógico, local, e a pesquisa recomenda que seja desligável pelos pais (art. 17 §4º V) e descrito no RIPD. Hoje não há chave para desligar a personalização | `estado.js` (`revisao`), pesquisa 03 seção 4.3 |
| Eventos de medição | **Atenção.** O texto da seção "Dados e privacidade" diz "Nada é enviado para a internet" (verdade). Não menciona que o app registra eventos de uso locais. Dizer na mesma seção; se um dia forem enviados, é tratamento novo: base legal, consentimento parental e RIPD | `perfil-e-responsavel.js:143-148`, `medicao.js` |
| Linguagem dos textos para crianças | **Aprovado** no que li: bilhetes do Bobby sem culpa nem urgência, sem "triste", "perder" ou contagem regressiva (`ciclo.js:4`, `ciclo-ui.js:3`, `BILHETES` em `ciclo.js:297-309`). Ofensiva com congelador ganho, descanso e retorno pela metade. Nenhum texto dirigido a pais está redigido como aviso legal para criança. Revisão de pedagogo e de advogado pendente (README fase 2) |
| Pressões de mecânica (ofensiva, baú, "Por hoje chega") | **Aguarda advogado.** A pesquisa 03 (seção 2.5) classifica a ofensiva como risco médio; o baú gratuito e sem sorteio como baixo; o botão "continuar por 50 moedas" e o baú por meta cheia estão marcados no README como pendentes de advogado (ECA Digital) | `README-FASE-3-LOGICA.md:39` |
| Notificações | **Aprovado.** O app não pede permissão de notificação | grep seção 2 |
| Informação para a criança (LGPD art. 14 §6º) | **Falta.** Não há aviso de privacidade em linguagem de criança nem com recurso audiovisual | sem ocorrência em `src/` |
| Idade e classificação | **Atenção.** Faixa pública "8 a 13" no manifesto contra 7 a 12 no app; classificação indicativa e termos em português ainda não existem (Decreto 12.880/2026 art. 12 §4º, conforme pesquisa 03) | `manifest.webmanifest`, `shell.html:7` |

### 6.4 O que muda quando houver conta na nuvem e venda

Tudo abaixo hoje **não existe**. Itens marcados com **[ADV]** precisam de advogado de proteção de dados e direito digital.

| Item | Por que | Esforço |
|---|---|---|
| Termos de uso **[ADV]**, com classificação indicativa em português | Decreto 12.880 art. 12 §4º; CDC na venda | advogado, 1 a 2 semanas |
| Política de privacidade pública **[ADV]**: tipos de dado, uso, direitos do art. 18, canal em português | LGPD art. 14 §2º | texto 1 dia + advogado |
| Encarregado (DPO) e canal de contato | LGPD; pesquisa 03, seção 4.5 | 1 dia (definir pessoa e e-mail) |
| Consentimento parental específico e em destaque **[ADV]**, com esforço razoável de verificar o responsável | LGPD art. 14 §1º e §5º; a ANPD ainda não publicou o guia definitivo de aferição de idade | 1 a 2 semanas de produto + parecer |
| Aferição de idade e sinal de idade da loja | ECA Digital arts. 12 e 14; Decreto art. 25 | depende do guia da ANPD |
| Relatório de impacto (RIPD) e gestão de risco das funcionalidades **[ADV]** | ECA Digital art. 16 e art. 8º I | 3 a 5 dias com advogado |
| Parecer sobre ofensiva, baú, "Por hoje chega", moeda **[ADV]** | Decreto arts. 9º e 10; art. 17 §4º II | parecer |
| Controle parental real: conta do responsável, limite de tempo, ver e restringir, revogar | ECA Digital arts. 17 e 18; o PIN local não cumpre | médio (sprint) |
| Exclusão completa (conta, backups, prazo), acesso e correção | LGPD arts. 15, 16, 18 | 3 a 5 dias |
| Contratos com operadores (hospedagem, banco, e-mail, pagamento) **[ADV]** | LGPD | advogado |
| Representante legal no Brasil | ECA Digital art. 40 | já brasileiro; só documentar |
| Segurança do backend | `seguranca-minima` itens 1, 3, 4, 5, 6, 7: JWT validado no servidor, rate limit, RLS conferida no banco, dado cifrado, HTTPS e cabeçalhos | 1 a 2 semanas |
| Pagamento | Compra só por adulto autenticado, cancelamento fácil, CDC; nunca venda de baú, congelador ou moeda para criança | conforme gateway |
| Licença do Kokoro (voz) **[ADV]** | README fase 3, pendência de áudio | parecer |

---

## 7. Correções priorizadas

Esforço: P = pequeno (até 2 h), M = médio (meio dia a 1 dia), G = grande (mais de 1 dia).

### P0. Bloqueia publicação do PWA

| # | Correção | Esforço | Onde |
|---|---|---|---|
| 1 | Fechar XSS por backup: sanitizar `errados`, `congelados` e `espera.presente` em `estadoDe`; `escapa(b.presente)`; teste de regressão com `<img onerror>` em cada campo | M | `estado.js:110,151,158`, `ciclo-ui.js:90`, `testes/estado.js` |
| 2 | Aplicar a meta CSP testada (3.5) em `shell.html` e rodar `npm test` e `npm run fumaca` | P | `shell.html:3-22` |
| 3 | Publicar a partir de `dist/` com só os arquivos do app (`index.html`, `sw.js`, manifesto, ícones, `assets/`, `audio/`) e `_headers` com os cabeçalhos da seção 3.5; teste que reprova se `dist/` contiver `arte`, `docs`, `pesquisa`, `src`, `.git` | M | `build/build.py`, novo `_headers` |

### P1. Recomendado antes do link público

| # | Correção | Esforço |
|---|---|---|
| 4 | `apagarPerfil` limpar também `mundo-numeros-v2`, `.bak-v3` e `.corrompido` (com confirmação do responsável) e criar "Apagar tudo deste aparelho". Observação: o app só lê o v3 como cópia de segurança; apagar depois de a migração ser confirmada pelo responsável | M |
| 5 | Texto honesto na área do responsável: o PIN é uma tranca simples, quem sabe mexer no navegador remove; backup é arquivo em texto claro com dado de criança, guarde com cuidado; o app registra eventos de uso só neste aparelho | P |
| 6 | Limite de tentativas local no PIN (ex.: espera crescente após 5 erros) e nota de decisão no cofre registrando a exceção do djb2 até a nuvem | P |
| 7 | Teto de tamanho no import (ex.: 2 MB) antes do `JSON.parse` | P |
| 8 | Service worker: conferir origem nas rotas de áudio e arte; regravar `./index.html` só para o início do app | P |
| 9 | Política de privacidade curta e pública (uma página: o que fica no aparelho, nada vai à internet, como apagar), revisada por advogado quando possível | M |
| 10 | Alinhar a faixa etária pública ("8 a 13") com a do app (7 a 12) | P |
| 11 | Remover `window.claude.use('downloads')` de `entregar()` | P |
| 12 | Trocar o rótulo `metricas-anonimas` por `metricas-pseudonimizadas`; corrigir README (`bobby-v4` para `bobby-v5`) | P |

### P2. Bloqueia venda (não bloqueia o PWA local)

| # | Correção | Esforço |
|---|---|---|
| 13 | PIN com PBKDF2 (`crypto.subtle`, sal aleatório por `crypto.getRandomValues`, 200 mil voltas ou mais) e migração do hash; ou substituir pelo controle parental na conta | M |
| 14 | Toda a lista da seção 6.4: termos, política, encarregado, consentimento verificável, aferição de idade, RIPD, parecer de mecânicas, contratos | G, com advogado |
| 15 | Backend com os 7 itens da `seguranca-minima` (sessão no servidor, rate limit, RLS conferida no banco, dado cifrado, chaves em variável de ambiente, cabeçalhos, varredura antes de publicar) | G |
| 16 | CSP sem `'unsafe-inline'` (scripts externos com hash ou nonce) | M |
| 17 | Chave para desligar personalização pedagógica, ofensiva e missões pelo responsável, com padrão de proteção máxima (ECA Digital art. 17 §4º) | M |
| 18 | Aviso à criança em linguagem simples, com áudio, sobre o que o app guarda | P |

---

## 8. Registro

- Última conferência: 24/10/2026.
- Pendências que travam publicação: itens 1, 2 e 3.
- Pendências que travam venda: itens 13 a 18 e a lista da seção 6.4.
- Decisões que dependem do Filipe: manter ou tirar o painel D1/D7/D30 de dentro do app (README fase 2); aceitar a exceção do djb2 por escrito até a nuvem; contratar advogado antes de qualquer venda.
- Cópia de trabalho da CSP: pasta temporária da sessão, fora do repositório; nada foi aplicado no projeto.
