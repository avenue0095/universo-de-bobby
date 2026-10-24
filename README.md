# O Universo de Bobby

App PWA infantil (matemática, português e inglês, 7 a 12 anos). Sem framework e sem dependências:
HTML, CSS e JavaScript puros, publicados pelo GitHub Pages **a partir da raiz** do repositório.

## Como editar

O arquivo que o navegador abre, `index.html`, **é gerado**. A fonte está em `src/`:

```
src/interface/shell.html   o HTML da página, com marcadores no lugar do estilo e dos scripts
src/interface/style.css    todo o CSS
assets/                    arte em WebP, fontes (OFL) e manifesto.json: gerados por build/ativos.py a partir de arte/
audio/                     clipes gravados (.m4a e .opus), manifesto-min.json, ferramentas do gerador e LEIA-ME.md
src/interface/*.js         o aplicativo (telas, lição, perfil, loja, voz, PWA...). Núcleo sem DOM, testado em Node:
                           nucleo.js (dia local, hash), ofensiva.js, migracao.js, estado.js (v4), revisao-espacada.js,
                           ciclo.js (meta, baú, missões, bilhete), medicao.js, audio.js, backup.js. Telas do ciclo: ciclo-ui.js
src/conteudo/*.js          currículo, aulas, histórias, desenhos, léxico (mat, pt, en)
build/build.py             junta tudo e grava /index.html
build/ativos.py            converte arte/ em assets/*.webp (precisa de Pillow, NumPy e SciPy; so quando a arte muda)
testes/                    verificações em Node
```

1. Edite o arquivo certo em `src/`.
2. `python3 build/build.py` (ou `npm run build`) regrava o `index.html`.
3. Rode os testes (abaixo) e **commite `src/` e `index.html` juntos**. O GitHub Pages serve o `index.html` pronto.

A **ordem importa**: o `shell.html` lista os blocos `<script>` na ordem em que o navegador executa,
e cada marcador `<!--@script a.js b.js-->` vira um único `<script>` com os arquivos na ordem escrita.
Um `const` de um bloco só aparece para os blocos seguintes. Arquivo novo = incluir no marcador certo.

## Testes

Precisa de Node 22+ e Python 3. Nada para instalar. `npm test` roda tudo menos o Chrome; `npm run fumaca` abre o Chrome.

| Comando | O que faz |
|---|---|
| `npm test` | build em dia, trava da URL, 150 fases (estrito), regressão, áudio, ofensiva, estado v4, ciclo diário, revisão espaçada, medição e tokens |
| `node testes/verifica.js [--rodadas=300 --semente=2 --estrito]` | gera cada fase várias vezes e checa: gabarito nas opções, sem negativo/NaN/repetida/espaço no fim. `testes/conhecidos.json` está vazio: defeito novo se corrige, não se lista |
| `node testes/regressao.js` | os 8 defeitos corrigidos em 02/09/2026 |
| `node testes/audio.js` | voz gravada: sem voz do aparelho, hash do clipe igual ao do gerador, fila de quadros e números, `.m4a` por padrão, som desligado, fechar a fase cancela, pacotes no cache |
| `node testes/cobertura-audio.js` | cada texto falado nas 150 fases (aulas, missões, perguntas amostradas) existe no manifesto; lista o que ficou sem clipe |
| `node testes/ofensiva.js` | os 12 casos de `docs/anexos/referencia-ofensiva.js` contra o código real, mais dia local e relógio |
| `node testes/estado.js` | estado v4, migração do v3 (fixture em `testes/fixtures/`), backup, XP x moeda, dia local às 21h30 |
| `node testes/ciclo.js` | meta em perguntas, baú sem sorteio, missões, bilhete, ponto de parada, congelador no fluxo real, tom dos textos |
| `node testes/revisao.js` | caixas 1, 3, 7, 14, 30, teto de 10 por dia, aquecimento, freios |
| `node testes/medicao.js` | eventos sem dado pessoal, D1/D7/D30, teto de 4.000 eventos |
| `node testes/sw.js` | a ativação do service worker só apaga caches `bobby-v*` antigos e preserva `bobby-audio-*` |
| `node testes/tokens.js` | CSS inteiro: sem hex fora do :root, fonte e espaco por token, contraste AA |
| `node testes/ativos.js` | manifesto bate com os arquivos, teto por imagem, app inicial abaixo de 3 MB |
| `node testes/desenhos.js` | 30 desenhos, direito herdado, balde de tinta, ativos coerentes |
| `node testes/fumaca.js [--foto]` | Chrome de verdade (sem pacote, via DevTools): joga uma fase de cada matéria, o ciclo do dia inteiro (bilhete, rotina, Meu personagem, baú, parada) e a migração de um estado v3, em desktop e celular. Falha se houver erro de console |
| `python3 build/build.py --check` | falha se `index.html` não for o que `src/` gera |

Prefere Playwright? `npm i -D playwright && npx playwright install chromium`, abra `index.html` por um
servidor local (`python3 -m http.server`) e repita os passos de `testes/fumaca.js`. O teste atual não exige isso.

## Trava da URL (não mexer sem combinar)

Quem já instalou o app depende destes endereços. `node testes/trava-url.js` falha se algum mudar:

- o arquivo de entrada é `/index.html`, **na raiz** (o Pages serve da raiz);
- `manifest.webmanifest`: `"start_url": "./index.html"` e `"scope": "./"`;
- `sw.js` guarda `./` e `./index.html`; HTML vai sempre à rede primeiro (versão nova chega sozinha).

Se mexer em `sw.js`, suba o número de `CACHE` (hoje `bobby-v5`). O áudio gravado vive em `bobby-audio-v1` e a arte em `bobby-arte-v1`; a ativação nunca apaga nenhum dos dois.

## Pastas que não são do app

`pesquisa/` e `docs/` são material de apoio e não entram no build.

## Segurança e privacidade (auditoria de 24/10/2026)

- **Dados que entram** (backup `.json` e `localStorage`) passam por `src/interface/seguranca-dados.js`: chave `__proto__`/`constructor`/`prototype` nunca entra, texto de pergunta só mantém marcação simples, figura só se for SVG curto, campo fora da lista cai, arquivo acima de 2 MB é recusado. Defesa em profundidade: o ponto que escreve HTML também escapa. `node testes/seguranca.js` importa um backup malicioso e prova que nada executa.
- **CSP** por `<meta>` no `index.html` (sem `unsafe-eval`, sem origem externa, `connect-src 'self'`, `form-action 'none'`). Scripts e estilo continuam inline porque a build os inlina; o ganho real é que um script injetado não consegue mandar dados para fora. `frame-ancestors` e os demais cabeçalhos vão em `_headers` (gerado por `build/site.py`).
- **Limite aceito da CSP:** `script-src` e `style-src` mantêm `'unsafe-inline'` porque a build inlina os scripts e o estilo no `index.html`. Isso NÃO impede um script injetado de rodar; o que a política garante é que ele não consegue mandar dados para fora (`connect-src 'self'`, `form-action 'none'`). Por isso a validação de dados e o escape continuam obrigatórios. O passo seguinte é separar os scripts em arquivos com hash ou nonce e tirar o `'unsafe-inline'`.
- **Service worker** só guarda recurso da própria origem; só o início do app substitui o `index.html` guardado.
- **Senha da área do responsável**: PBKDF2-SHA256 (150 mil voltas, Web Crypto), sal aleatório de 16 bytes por senha (a senha é uma só por aparelho), espera crescente depois de 5 erros (30 s, 1 min, 2 min... até 15 min). Senha antiga (hash simples) vale e é trocada no primeiro acerto. **É uma trava local para a criança não entrar sozinha, não controle parental com valor legal**: quem sabe mexer no navegador consegue removê-la. Isso está escrito na tela do responsável.
- **Apagar**: "Apagar jogador" limpa também os rastros dele nas chaves antigas (`mundo-numeros-v2`, `.bak-v3`, `.corrompido`). "Apagar todos os dados deste aparelho" (área do responsável) pede dois passos e a senha (ou a palavra APAGAR se não houver senha) e, se marcado, também as imagens e vozes guardadas.
- Cópia do perfil (`.json`) é texto comum, sem cifra: tem dado de criança, guarde com cuidado. O pacote de métricas se chama `metricas-sem-nome` (é pseudonimizado, não anônimo).
- A faixa etária pública é **7 a 12 anos** (manifesto, descrição e README).

## Publicar (só com ordem do Filipe)

`python3 build/site.py` monta `dist/site/` (cerca de 51 MB) só com o que vai ao público: `index.html`, `sw.js`, manifesto, ícones, `assets/`, `audio/manifesto-min.json` e os `.m4a`, mais `_headers` e `.nojekyll`. Não entram `arte/`, `docs/`, `pesquisa/`, `src/`, `build/`, `testes/`, `.git`, o manifesto de áudio com os textos das falas nem os `.opus` (use `--com-opus` se quiser). `node testes/site.js` falha se aparecer pasta proibida, extensão fora da lista ou mais de 75 MB.

Dois caminhos, nenhum feito por este repositório:
1. **GitHub Pages por Actions** (recomendado): um workflow que roda `python3 build/build.py && python3 build/site.py` e publica `dist/site` com `actions/upload-pages-artifact` e `actions/deploy-pages`. Como o Pages não lê `_headers`, a CSP vai só pela `<meta>` (sem `frame-ancestors`).
2. **Branch `gh-pages`** com o conteúdo de `dist/site` na raiz (`git subtree` ou cópia manual).
Em Cloudflare Pages ou Netlify o `_headers` vale e traz todos os cabeçalhos. Antes de qualquer publicação: `npm test`, `npm run fumaca`, gitleaks e semgrep, e a ordem do Filipe.
