# O Universo de Bobby

App PWA infantil (matemática, português e inglês, 8 a 13 anos). Sem framework e sem dependências:
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
