# O Universo de Bobby

App PWA infantil (matemática, português e inglês, 8 a 13 anos). Sem framework e sem dependências:
HTML, CSS e JavaScript puros, publicados pelo GitHub Pages **a partir da raiz** do repositório.

## Como editar

O arquivo que o navegador abre, `index.html`, **é gerado**. A fonte está em `src/`:

```
src/interface/shell.html   o HTML da página, com marcadores no lugar do estilo e dos scripts
src/interface/style.css    todo o CSS
src/interface/*.js         o aplicativo (telas, lição, perfil, loja, voz, PWA...)
src/conteudo/*.js          currículo, aulas, histórias, desenhos, léxico (mat, pt, en)
build/build.py             junta tudo e grava /index.html
testes/                    verificações em Node
```

1. Edite o arquivo certo em `src/`.
2. `python3 build/build.py` (ou `npm run build`) regrava o `index.html`.
3. Rode os testes (abaixo) e **commite `src/` e `index.html` juntos**. O GitHub Pages serve o `index.html` pronto.

A **ordem importa**: o `shell.html` lista os blocos `<script>` na ordem em que o navegador executa,
e cada marcador `<!--@script a.js b.js-->` vira um único `<script>` com os arquivos na ordem escrita.
Um `const` de um bloco só aparece para os blocos seguintes. Arquivo novo = incluir no marcador certo.

## Testes

Precisa de Node 22+ e Python 3. Nada para instalar.

| Comando | O que faz |
|---|---|
| `npm test` | confere que o `index.html` está em dia com `src/`, a trava da URL, as 150 fases e os 8 defeitos antigos |
| `node testes/verifica.js [--rodadas=300 --semente=2 --estrito]` | gera cada fase várias vezes e checa 8 perguntas, gabarito nas opções, sem negativo/NaN/repetida |
| `node testes/regressao.js` | os 8 defeitos corrigidos em 02/09/2026 |
| `node testes/fumaca.js [--foto]` | abre o Chrome de verdade (sem pacote, via DevTools), joga uma fase de cada matéria em desktop e celular e falha se houver erro de console |
| `python3 build/build.py --check` | falha se `index.html` não for o que `src/` gera |

`testes/conhecidos.json` lista defeitos de conteúdo que já existiam antes da reorganização (ex.: distrator com
espaço no fim, `200 − 331`). Eles aparecem no relatório sem derrubar o teste. Corrigiu um? Apague a linha.
`--estrito` faz os conhecidos derrubarem o teste.

Prefere Playwright? `npm i -D playwright && npx playwright install chromium`, abra `index.html` por um
servidor local (`python3 -m http.server`) e repita os passos de `testes/fumaca.js`. O teste atual não exige isso.

## Trava da URL (não mexer sem combinar)

Quem já instalou o app depende destes endereços. `node testes/trava-url.js` falha se algum mudar:

- o arquivo de entrada é `/index.html`, **na raiz** (o Pages serve da raiz);
- `manifest.webmanifest`: `"start_url": "./index.html"` e `"scope": "./"`;
- `sw.js` guarda `./` e `./index.html`; HTML vai sempre à rede primeiro (versão nova chega sozinha).

Se mexer em `sw.js`, suba o número de `CACHE` (hoje `bobby-v3`).

## Pastas que não são do app

`pesquisa/` e `docs/` são material de apoio e não entram no build.
