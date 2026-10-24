# Fase 3 (visual) · o que foi feito e o que ficou

Branch `reforma-fase-2`. Redesenho visual com a arte do Google Flow, sem publicar nada e sem mexer em `arte/`, `audio/` e `docs/`.
Nada foi apagado: o que saiu do código está em `~/_APAGAR DEPOIS (revisao)/2026-10-24/bobby-visual/` (com `LOG.tsv` e `desfazer.sh`).

## Feito, por etapa

1. **Pipeline de ativos.** `python3 build/ativos.py` converte `arte/aprovadas` e `arte/recortes` em WebP dentro de `assets/` (70 itens), grava `assets/manifesto.json` e o `build.py` embute o índice no `index.html` como `ATIVOS`. Poses e expressões até 768 px, cenários e planetas até 1024 px, qualidade 82, alfa nos recortes; o planeta ganha alfa (o fundo escuro sai); desenhos em WebP sem perda, com a linha limpa. Poses de Brisa e Fagulha que não tinham recorte foram recortadas no próprio script (mesmo método do `arte/recortar.py`). Service worker: `bobby-v5`, cache `bobby-arte-v1` protegido na ativação (como o `bobby-audio-`), camada inicial no pré-cache, o resto entra na primeira vez que a imagem aparece. `start_url` e `scope` não mudaram. `testes/ativos.js` confere peso, teto por imagem e a meta de 3 MB.
2. **Tokens e fontes.** `style.css` reescrito: hex e rgba só no `:root`, escala de fonte, grade de 8 e raio por token, sem sombra 3D. Fredoka e Nunito (variáveis, subconjunto latino) hospedadas em `assets/fontes/`, com as licenças OFL; Google Fonts e CDN de fonte saíram. Cor por matéria via `data-materia` no `body`. `testes/tokens.js` cobre o CSS inteiro e confere o contraste AA dos pares do DESIGN.md nos dois modos.
3. **Mapa.** Planeta da matéria no cabeçalho; cada etapa é um lugar que começa apagado e acende de baixo para cima conforme as fases (par `CEN-xx-APAGADO/COMPLETO`, revelação por máscara animada); 5 nós de fase e a revisão em serpentina no chão calmo; o Bobby fica ao lado do nó atual e anda até o próximo (pose Caminha em dois quadros; sem animação com movimento reduzido). Etapas sem arte usam o planeta como cenário, apagado por filtro, com o aviso "Lugar novo em breve". Assim que `python3 build/ativos.py` pegar `CEN-<MAT>NN-*` novos, o mapa usa sozinho.
4. **Desenhos.** Um por etapa (30), `S.desenhos` no estado. Quem já tinha fase concluída numa etapa mantém o direito ao desenho dela (`herdado`, calculado na primeira leitura do estado antigo). Galeria por planeta, abrir, colorir na tela (balde de tinta por inundação em canvas, jogadas guardadas em poucos bytes, desfazer e recomeçar), imprimir em A4 por CSS (`@page`), salvar PNG. Sem jsPDF e sem CDN. Desenho sem arte mostra o planeta em contorno com "Em breve" (o direito já vale). Ícone gigante do botão da galeria corrigido (agora é o botão de imprimir, com ícone de 24 px). `testes/desenhos.js`.
5. **Meu personagem.** Palco com o Bobby grande (8 expressões e 12 poses; tocar nele troca a expressão), companheiro (6), chapéu como sobreposição só em imagem de frente (âncora por imagem em `FRONTAIS`), catálogo em `PECAS` extensível com "Chega em breve" honesto. Um toque na barra inferior, de qualquer tela; a barra agora fica à vista fora das fases, com retrato vivo, item ativo e ponto de novidade.
6. **Feedback.** Painel que sobe da base com check ou seta circular, Bobby real (alegre, radiante, incentivando), opção certa e errada com ícone, sem sacudir. Fim de fase com a pose Comemora; "Por hoje chega" com a pose Tchau e o "Até amanhã" com a pose Descansa. Respeita `prefers-reduced-motion`.
7. **Casinha e barra** revisadas em 360, 390 e 1280, claro e escuro (capturas de `node testes/fumaca.js --foto` em `testes/saida/`, que o git ignora).

## Decisões pequenas que merecem o seu olho

- **Itens da versão antiga** (6 chapéus, 4 de rosto, 4 de pescoço, 6 cores de pelo, 4 personagens): não têm arte nova. Quem comprou continua dono e vê o nome em "Guardados para a arte nova"; ninguém compra o que não tem arte. O baú só entrega peça que tem arte (hoje: o chapéu de explorador, 100 moedas).
- **Cor do perfil** (a "cor do Bobby" de antes) virou o aro do retrato. O valor guardado é o mesmo; `estado.js` ainda lista as seis cores em hex (é dado do perfil, o teste deixa passar só esse arquivo).
- **Vocabulário:** a interface nova diz "planeta" e "etapa"; textos que têm áudio gravado ("Você terminou um mundo inteiro!", "Avance um passo no mundo") ficaram como estão para não perder o clipe. Quando o próximo lote de voz sair, trocar.
- Tokens extras além do DESIGN.md: `--cor-papel` (papel branco do desenho) e `--tinta-1..13` (paleta de colorir).

## Ficou de fora

- Arte de MAT05..10 e POR01..10 (desenhos) e cenários das etapas 2 a 10: dependem do agente de arte. O app já lê tudo pelo `assets/manifesto.json`; basta rodar `python3 build/ativos.py && python3 build/build.py`.
- Companheiro andando no mapa (hoje ele aparece no cabeçalho do planeta e no palco). Arte do baú e do baú aberto (segue o ícone). Telas do responsável, perfil, voz e loja de peças antigas seguem com o visual transformado por token, sem redesenho próprio.
- Máscara por peça no cenário (hoje a revelação é de baixo para cima, como a v1 do `CENARIOS-E-DESENHOS.md`).
- Recorte do planeta Numeral deixou o miolo escuro do anel (aparece sobre fundo claro).
- Teo com as luzes do peito diferentes entre poses (ressalva da arte). Teste com a filha (L10) e em aparelho real.

## Riscos

- Nada foi testado em iPhone ou Android reais (máscara animada via `@property`, `:has()`, `mask-image` e canvas de 1 MP pedem Safari 16.4+, Chrome 105+).
- Colorir refaz o balde de todas as jogadas ao abrir (até 600); em aparelho fraco pode levar alguns décimos de segundo.
- `window.print()` e o PDF do iOS não foram conferidos em papel.
- Peso: o `index.html` caiu de 615 KB para cerca de 600 KB; arte total 4,5 MB em `assets/` (camada inicial 1,1 MB).

## Aprendizado: z-index sobre painel fixo e teste de pontaria (24/10/2026)

**O que quebrou.** Para a atmosfera do planeta ficar atrás do conteúdo da fase, dei `position:relative;z-index:1` ao `.lc-corpo`. O painel de feedback `.pe` é `position:fixed` com `z-index:auto`, então passou a ficar **embaixo** do corpo da fase: Verificar, Continuar, dica e "continuar por 50 moedas" deixaram de receber toque em todas as fases. A fumaça passou porque usava `.click()` por JavaScript, que dispara o evento no elemento mesmo que haja outra coisa por cima.

**Regra.** Elemento fixo que recebe toque (`.pe`, barra, folhas) tem `z-index` por token (`--z-painel`, `--z-barra`...) e fica acima de qualquer camada de conteúdo. Camada decorativa usa `pointer-events:none` e `z-index:0` ou negativo, nunca eleva o conteúdo.

**Teste.** `testes/fumaca.js` agora (1) confere com `document.elementFromPoint` que o botão é o elemento no centro dele antes de tocar, (2) toca de verdade pelo CDP (mouse no 1280, touch no 390) em dica, alternativa, Verificar, comprar vida e Continuar nas 3 matérias, e (3) varre todos os botões habilitados da tela visível (mapa, Meu personagem, galeria, perfil, aula e pergunta). Provado: sem a correção ele falha com "#acao coberto por lc-corpo" em 1280 e 390.

## Revisão 2 e integração da arte nova

- Painel de erro em duas linhas de ação no celular (texto, "continuar por 50 moedas" e o botão principal em largura cheia), espaço de 280 px abaixo da última alternativa, lembrete da aula recolhível (aberto só em tela alta).
- Aviso das vozes: um por vez, acima da barra, sem capturar toque, escondido durante a fase.
- Barra: Perfil e Responsável marcam "Perfil" (observador de `#perfil`, `#galeria`, `#desenho-tela`); ícones e retrato na mesma caixa de 40 px, rótulos alinhados.
- Baú: Bobby comemorando (pose P02) com o baú em SVG de gradiente, luz e sombra, até chegar a arte 3D.
- Mapa: rótulo de nó em até 3 linhas, cena em 5:8, Bobby menor ao lado do nó.
- Arte nova integrada: 30 desenhos e cenários 2 a 10 (147 itens, 9,8 MB; app inicial 1,73 MB). CEN-MAT06, CEN-MAT07 e CEN-POR09 acendem por cross-fade (`CENA_FADE` em `mapa-e-trilha.js`) até o agente de arte realinhar o apagado.
- **Armado, não verificado:** `ativos.py` já converte `BOBBY-ITEM-*` e `ICONE-*` novos e o catálogo do Meu personagem liga os itens `bobby-item-bone|capacete|coroa|oculos|capa|lenco` quando existirem em `ATIVOS`. A ancoragem de óculos, capa e lenço na pose frontal e o uso dos ícones de recompensa (baú, "Por hoje chega", missões, congelador, bilhete) dependem de ver a arte e ficam para a próxima passada.
