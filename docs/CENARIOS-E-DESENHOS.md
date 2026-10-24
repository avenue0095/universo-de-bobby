# CENÁRIOS E DESENHOS · O Universo de Bobby

Versão 1 · 24/10/2026 · Fase 3 · rascunho para aprovação do Filipe.
Nenhuma imagem foi gerada e nenhum crédito foi gasto. Aqui estão os 3 planetas, as 30 etapas (lugares que se montam) e os 30 desenhos para colorir, com prompts em inglês.
Cores por nome de token (`DESIGN.md`) e por palavra. Hex não aparece fora do bloco de tokens.

Fontes do conteúdo: `UNITS_MAT`, `UNITS_PT` e `UNITS_EN` do `index.html` (títulos das unidades e das fases, lidos por script nesta sessão); `CAPITULOS`, `CAPITULOS_PT` e `CAPITULOS_EN` (nome do capítulo e item temático); decisões do cofre (`RESPOSTAS.md`): cenário próprio por matéria, um lugar por etapa que vai se montando, 30 desenhos no total.

---

## 1. Como o mapa funciona (e por que isso muda o que se gera)

Hoje as três matérias usam o mesmo traçado e a mesma paleta verde (`pesquisa/00-mapa-do-app-hoje.md`, seção 1.3). O novo mapa tem três telas e cada uma pede um tipo de imagem:

| Tela | O que a criança vê | Imagem necessária |
|---|---|---|
| Planetas | 3 cartões, um por matéria, com o guia | 3 imagens do planeta visto de cima (`PLANETA-*`) |
| Planeta (10 etapas) | 10 cartões de etapa (`DESIGN.md`, seção 10.4) | recorte 3:2 da cena de cada etapa |
| Etapa (trilha) | o lugar sendo montado, com 5 nós de fase e 1 nó de revisão sobre um caminho; o personagem do jogador caminha | 1 cena por etapa em 2 estados (`apagado` e `completo`) |

**Etapa = "mundo" do código** (`UNITS_*`, 10 por matéria, 5 fases mais uma revisão). Cada fase concluída acende uma parte do lugar. Concluídas as 5 fases, a revisão acende o conjunto (luz dourada) e a criança ganha o desenho para colorir daquela etapa. Isso encaixa no gancho que já existe no código (`mundoCompleto(u)` e `pintarFim`).

**Como a montagem funciona na prática (versão 1, sem máscara por peça):**
1. Gerar a cena `completo` (lugar inteiro, 5 peças bem separadas no espaço).
2. Gerar a mesma cena `apagado` **por edição da imagem completa** (mesma câmera, mesma composição), com as peças só em fundação, andaime e cobertas, cores frias e luzes apagadas.
3. No app, as duas imagens ficam empilhadas e uma máscara suave sobe de baixo para cima, em 5 passos (20%, 40%, 60%, 80%, 100%), um por fase. A revisão aplica brilho dourado e `--mov-celebra`.
4. Para a revelação parecer montagem de verdade e não um apagador, a cena **organiza as 5 peças em ordem de profundidade, da mais próxima do caminho (peça 1, embaixo) à mais distante (peça 5, no topo)**, na mesma ordem das fases. Por isso cada cena abaixo lista as peças na ordem das fases.
5. Evolução possível depois: máscara por peça (150 máscaras desenhadas à mão). Só se o Filipe quiser.

**Regras de composição de toda cena (a UI depende delas):**
- Formato retrato 3:4 (mestre 1080 por 1440 px).
- **O lugar ocupa os 60% de cima.** Os 40% de baixo são chão calmo, com caminho suave e textura simples, **sem nenhum objeto**: é a zona onde os nós de fase e o personagem ficam. Isso também permite recortar um 3:2 do topo para o cartão de etapa.
- 3 planos (frente, meio, fundo), perspectiva atmosférica (o fundo mais claro e frio), luz de fim de tarde vinda da esquerda e luz de recorte quente, a mesma regra da `BIBLIA-DE-PERSONAGENS.md` (seção 2, item 9). Personagens e cenários na mesma luz, senão volta a parecer colagem.
- **Sem texto legível em nada.** Placas, relógios, livros e cartazes aparecem em branco; números e letras que a aula pedir entram pelo app. Quando o tema é letra (planeta Fábula), as peças são **tabuletas e blocos lisos**.
- Sem personagens e sem pessoas na imagem: o Bobby e o guia entram por cima, como peças recortadas, com `--sombra-contato`.
- Mesma imagem serve nos dois modos de cor; o céu é gradiente de tokens atrás.

**Pesos (orçamento, não medido):** mestre em 1080 px; entrega em WebP de 720 px de largura, cerca de 100 a 150 KB cada. Por planeta são 20 imagens (10 etapas x 2 estados). Carregar o planeta da matéria atual sob demanda e guardar no cache depois; não colocar os 60 no pré-cache (cabem ~9 MB, estouram o orçamento da seção 9 do `DESIGN.md`).

---

## 2. Blocos de texto dos cenários

O script `docs/anexos/montar-prompts.py` monta: **ESTILO-CENARIO + PALETA-* + GABARITO + CENA + NEG-CENARIO** (e `ref=sim` quando é o estado `apagado`).

```bloco ESTILO-CENARIO
Premium stylized 3D environment render in the look of a modern story-driven fantasy RPG location: semi-realistic materials (wood grain, painted metal, stone, plants with real leaf detail), real depth with three clear planes (foreground, midground, background) and atmospheric perspective where the distance is lighter and cooler, soft golden-hour key light from the upper left with a warm rim light and gentle ambient fill, a calm, clean, readable composition, friendly and family-friendly for children aged 7 to 12, camera at a slightly raised eye level, 35 mm equivalent lens, no extreme perspective.
```

```bloco PALETA-MAT
Palette: cobalt blue and deep ocean-blue crystals, polished brass and copper accents, teal-green plants, a warm golden light on the cool blue world.
```

```bloco PALETA-POR
Palette: violet and plum, warm cream paper tones, lantern amber light, soft rose accents, a cozy dusk mood.
```

```bloco PALETA-ING
Palette: turquoise sea, white-painted wood with blue roofs, coral accents, sandy beige, a sunny but soft late-afternoon light.
```

```bloco GABARITO
Portrait composition. The place is the hero and occupies the upper 60 percent of the frame. The lower 40 percent of the frame is calm open ground with a soft winding path and simple low-detail texture, with no props, no objects and no plants taller than a few centimeters there, reserved for interface buttons. The five elements below are arranged in order of depth: element 1 nearest to the empty ground, element 5 the farthest and highest, each one clearly separated from the others so each reads on its own.
```

```bloco NEG-CENARIO
Not flat vector art, not clip art, not a collage of separate pasted shapes, no characters, no people, no text, no letters, no numbers, no readable signs, no logos, no watermark, no strong vignette, no harsh dark shadows, no clutter in the lower 40 percent, nothing frightening.
```

```bloco EDITAR-APAGADO
Use the attached image as the exact reference. Keep the exact same composition, camera, terrain, path, framing and light direction. Change only this: show the place in its unbuilt dormant state, where the five elements appear only as bare stone foundations, wooden scaffolds and shapes covered with cloth, in cooler desaturated colors, under a soft dusk haze, with all lights switched off. Add nothing new and move nothing.
```

```bloco FUNDO-ESPACO
Background: a perfectly flat, uniform, solid dark charcoal (about 15 percent brightness), no stars, no gradient, no shadow on the background. The object fits inside the frame with a generous margin.
```

---

## 3. PLANETA NUMERAL (Matemática)

**Tema.** Planeta de engenhoqueiros e cristais. Vilarejo de oficinas, hortas e praias de maré baixa, com pontes de metal polido. Guia: **Teo**, o robô.
**Paleta.** Tokens `--mat-*` (cobalto), com latão e cobre de acento (casa com o visor âmbar do Teo). Céu `--mat-ceu-topo` até `--mat-ceu-horizonte`, chão `--mat-chao`.
**Clima de luz.** Fim de tarde dourado sobre um mundo azul frio. Luzes das oficinas acendem à medida que as etapas são montadas.
**Vista do planeta.** Esfera de cristal azul com um anel fino de engrenagens e pequenas luzes, vista de cima.

```prompt PLANETA-MAT estilo=ESTILO-CENARIO fundo=FUNDO-ESPACO ar=1:1
A stylized semi-realistic small planet seen from slightly above, floating alone: a cobalt-blue crystalline world with polished brass and copper details, tiny workshop rooftops, glowing round windows, a bay with a calm sea, a mountain with a small terrace, a desert patch and a castle on a hill, and a thin ring of brass gears around it. Warm golden light from the upper left and a cool rim light. No text, no characters.
```

| # | Fases no código (`UNITS_MAT`) | Lugar (`CAPITULOS`) | 5 peças que se montam (uma por fase, na ordem) | Item do capítulo |
|---|---|---|---|---|
| 1 | Contar até 20 · Maior, menor ou igual · A dezena: juntar de 10 em 10 · Unidade, dezena e centena · Reta numérica e arredondar | **A horta do Bobby** | canteiros com mudas em fileiras · balança de dois pratos com cestos · feixes de cenouras amarrados de dez em dez · prateleira de três degraus com caixotes pequeno, médio e grande · cerca-régua com espantalho-robô | semente |
| 2 | Somas até 20 · Somar com dezenas · Subtrair · Contas até 1000 · Problemas do dia a dia | **O tesouro da praia** | duas poças de maré com conchas · redes com conchas de dez em dez · onda levando conchas · vitrine de coleção com três prateleiras · barraca do colecionador | concha |
| 3 | A ideia de multiplicar · Tabuada do 2 ao 5 · Tabuada do 6 ao 9 · Multiplicar por 10, 100 e 1000 · Multiplicação com 2 algarismos | **A caravana do deserto** | camelo com caixas iguais · fileira de tendas pequenas em grupos iguais · tendas maiores e cisterna de jarros · torre de potes que cresce em degraus · oásis com palmeiras em grade | gota |
| 4 | Repartir em partes iguais · Divisões exatas · Divisão com resto · Dobro, metade, triplo e terça parte · Múltiplos, divisores e primos | **O piquenique da floresta** | manta quadriculada com pratos · mesa com cestas iguais de frutas · cesta com frutas que sobram · balança com uma, duas e três cestas · caminho de portinhas nos troncos | fruta |
| 5 | O que é uma fração · Frações equivalentes · Comparar frações · Somar e subtrair frações · Fração de uma quantidade | **A pizzaria da montanha** | forno de pedra com pizza inteira · duas pizzas de tamanhos diferentes fatiadas igual · balcão com pizzas de fatias diferentes · bandeja onde fatias se juntam · prateleira de potes em grupos iguais | fatia |
| 6 | Décimos e centésimos · Comparar decimais · Somar e subtrair decimais · Dinheiro e troco · Decimais por 10 e por 100 | **A feira da cidade** | barraca de frutas com caixas de dez e de cem · dois suportes de preço lado a lado (etiquetas em branco) · balança com bandeja de moedas · caixa registradora com moedas e notas sem números · porta de madeira com setas de dez e cem | moeda |
| 7 | O que é porcentagem · Calcular de cabeça · Descontos e aumentos · Razão e proporção · Regra de três | **A loja de descontos** | vitrine com etiquetas de oferta em branco · balcão com aparelho de latão · arara com setas de subida e descida · balcão de receita com xícaras na mesma proporção · três janelas altas na mesma proporção com mostrador grande | etiqueta |
| 8 | Formas e seus lados · Perímetro · Área · Ângulos · Unidades de medida | **O parquinho novo** | gangorra triangular e trepa-trepa quadrado · cerca baixa ao redor da caixa de areia · caixa de areia quadriculada em ladrilhos · escorregador e rampa em ângulos diferentes · fita métrica gigante estendida | peça |
| 9 | O número desconhecido · Ordem das operações · Equações do 1º grau · Potências · Raiz quadrada | **A oficina de foguetes** | caixa-surpresa amarrada com fita · painel de controle com botões em ordem · balança com pesos iguais dos dois lados · torre de caixas que cresce em degraus · campo quadrado de painéis solares | parafuso |
| 10 | Média · Ler gráficos · Probabilidade · Números negativos · Desafio final | **A festa no castelo** | mesa de banquete dividida igual entre convidados · quadro com barras coloridas de alturas diferentes · roleta com setores coloridos · escada descendo ao porão, abaixo do nível do chão · torre do rei com estrela dourada | estrela |

### Cenas em inglês (a variável do prompt, na ordem das peças)

```bloco CENA-MAT01
Scene: a cozy vegetable garden behind a small cottage on a crystal-blue planet. Elements: 1) four neat soil beds with rows of small seedlings, 2) a wooden two-pan balance with a basket in each pan, 3) bundles of carrots tied in tens on a wooden rack, 4) a three-step wooden shelf holding one small crate, one medium crate and one large crate, 5) a long wooden fence like a giant ruler ending with a friendly scarecrow robot.
```

```bloco CENA-MAT02
Scene: a calm beach cove at low tide with brass-and-wood details. Elements: 1) two tide pools with shells to count, 2) rows of ten shells strung in nets, 3) a gentle wave carrying a few shells away, 4) a glass display cabinet with three shelves of shell collections, 5) a seashell collector's wooden stall with a striped awning.
```

```bloco CENA-MAT03
Scene: a desert oasis camp at golden hour. Elements: 1) a camel carrying three identical crates on each side, 2) a row of small tents in equal groups, 3) a row of larger tents beside a stone cistern with water jars, 4) a tower of stacked clay pots growing taller in steps, 5) an oasis with palm trees planted in a neat grid around a clear pond.
```

```bloco CENA-MAT04
Scene: a sunny forest clearing prepared for a picnic. Elements: 1) a checkered blanket with plates ready to share equally, 2) a table with equal baskets of fruit, 3) one basket with a few leftover fruits, 4) a wooden scale holding one, then two, then three baskets, 5) a path of small round wooden doors set into tree trunks leading into the forest.
```

```bloco CENA-MAT05
Scene: a pizzeria on a mountain terrace with a view of peaks. Elements: 1) a stone wood-fired oven with a whole round pizza, 2) two pizzas of different sizes both cut into equal slices, 3) a counter with pizzas cut into different numbers of slices, 4) a tray where loose slices come together to form a whole pizza, 5) a wooden shelf of ingredient jars arranged in equal groups.
```

```bloco CENA-MAT06
Scene: a small town market fair with striped awnings. Elements: 1) a fruit stall with crates of ten and larger boxes of one hundred, 2) two price stands side by side with blank price tags, 3) a balance scale with a tray of coins, 4) a cash register with a stack of coins and banknotes with no printed numbers, 5) a wooden double door with arrows showing ten times and one hundred times.
```

```bloco CENA-MAT07
Scene: a bright shop on a town corner with big sale ribbons. Elements: 1) a shop window with blank sale tags, 2) a counter with a brass calculating device, 3) a clothes rack with tags carrying up and down arrows, 4) a recipe counter with measuring cups in matching proportions, 5) three tall shop windows of increasing size in the same proportion with a large brass dial above them.
```

```bloco CENA-MAT08
Scene: a new playground in a town square. Elements: 1) a triangular seesaw and a square climbing frame, 2) a low fence running around a sandbox, 3) a square sandbox divided into a grid of tiles, 4) a slide and a ramp set at different angles, 5) a giant measuring tape and ruler laid across the ground.
```

```bloco CENA-MAT09
Scene: a rocket workshop with an almost finished rocket. Elements: 1) a mystery crate wrapped in a ribbon, 2) a control panel with buttons arranged in order, 3) a balance with equal weights on both sides, 4) a tower of crates growing in steps, 5) a square field of solar panels beside the rocket.
```

```bloco CENA-MAT10
Scene: a castle ready for a party at dusk with lanterns. Elements: 1) a long banquet table split evenly among guest places, 2) a board with colored bars of different heights, 3) a game wheel with colored sections, 4) a staircase going down into the castle cellar below ground level, 5) the king's tower with a big golden star on top.
```

---

## 4. PLANETA FÁBULA (Português)

**Tema.** Planeta de histórias: biblioteca flutuante, trem, feira, teatro e correio, com papel quente e lanternas. Guia: **Rufa**, a raposa.
**Paleta.** Tokens `--por-*` (violeta), com creme de papel e âmbar de lanterna de acento. Céu `--por-ceu-topo` até `--por-ceu-horizonte`, chão `--por-chao`.
**Clima de luz.** Anoitecer aconchegante, luz de lanterna. Cada peça montada acende uma lanterna.
**Regra especial.** Como as peças falam de letras, tudo é **tabuleta, bloco ou gaveta lisa**, sem letra desenhada (a IA erra letras; o app põe as letras reais).

```prompt PLANETA-POR estilo=ESTILO-CENARIO fundo=FUNDO-ESPACO ar=1:1
A stylized semi-realistic small planet seen from slightly above, floating alone: a violet world with warm cream paper-colored roofs, a library tower, a small steam train circling it on a track, a theater with open curtains, a village market, a garden and a post office, glowing lantern lights everywhere, and a few books floating gently around it. Warm lantern light and a cool rim light. No text, no letters, no characters.
```

| # | Fases no código (`UNITS_PT`) | Lugar (`CAPITULOS_PT`) | 5 peças que se montam | Item do capítulo |
|---|---|---|---|---|
| 1 | As vogais · O alfabeto · Maiúscula e minúscula · Com que letra começa · Ordem alfabética | **A caixa de letras** | cinco lanternas coloridas em fila · estante em arco com tabuletas lisas · um baú grande e um baú pequeno lado a lado · parede de gavetinhas com ilustrações · estante em degraus com tabuletas em ordem | letra |
| 2 | Bater as sílabas · Sílabas com B, C, D · Sílabas com F, G, L, M · Sílabas com N, P, R, T, V · Juntar sílabas e formar palavras | **O trem das sílabas** | locomotiva com chaminé redonda · plataforma com sino de latão · vagão de carga com caixotes coloridos · vagão-mercado com prateleiras abertas · estação com torre de relógio sem números | balão |
| 3 | Palavras de 2 sílabas · Palavras de 3 sílabas · A sílaba que falta · Letras embaralhadas · Palavras parecidas | **A feira das palavras** | barraca de duas faixas penduradas · barraca de três faixas · barraca com um vão na fileira de faixas · barraca de tabuletas embaralhadas em cordas · barraca de pares de objetos parecidos | balão |
| 4 | CA CO CU e CE CI · R e RR · S, SS e o S com som de Z · CH, LH e NH · M antes de P e B | **A oficina dos sons** | bancada com engrenagens de latão · bancada com roldana e corda · bancada com serra e serragem · bancada com três funis de tamanhos diferentes · bancada com prensa de madeira | pena |
| 5 | O que é uma frase · Maiúscula no começo, ponto no fim · A ordem das palavras · Interrogação e exclamação · Juntar duas frases | **O correio das frases** | caixa de correio · balcão com sino de latão · esteira transportando cartas lacradas · carimbo gigante em forma de ponto redondo e bandeira em curva · torre do pombo-correio com janela redonda | carta |
| 6 | Substantivo · O, A, OS, AS · Singular e plural · Masculino e feminino · Nomes próprios | **O mercado dos nomes** | barraca de etiquetas em branco penduradas · prateleiras com um item e com grupos do mesmo item · barraca de pares combinados (botas e sapatos) · dois manequins de estilos diferentes · quadro com crachás pendurados em ganchos | etiqueta |
| 7 | Adjetivo: como é · Verbo: o que faz · Combinar direitinho · Ontem, hoje e amanhã · Montar frases completas | **O teatro das ações** | fila de poltronas de veludo · arara de figurinos variados · roldanas e cordas dos bastidores · três portas em arco com sol nascente, sol a pino e lua · palco com cenário pintado completo | estrela |
| 8 | Palavras com Ç · G e J · X e CH · S e Z no fim · Palavras que confundem | **A gráfica** | prensa tipográfica de madeira · bandeja de tipos de metal com faces em branco · tinteiro com rolos · guilhotina de papel · prateleira de jornais enrolados | lápis |
| 9 | Para que serve o acento · O til e os sons nasais · Palavras com acento agudo · A vírgula na lista · Quando alguém fala | **O jardim dos acentos** | canteiros com folhinhas pequenas pousadas sobre as plantas · arco coberto de trepadeira ondulada · fonte · canteiro de plantas separadas por pedrinhas em forma de vírgula · árvore com folhas em forma de balão de fala | pena |
| 10 | Ler um bilhete · Ler uma instrução · Ler uma historinha · Achar a informação · Desafio final | **A biblioteca** | balcão de recepção com bilhetes dobrados · mesa com livro aberto de receita e utensílios · poltrona de leitura com livro de histórias · mapa de parede com barbantes e alfinetes · torre alta com troféu dourado | livro |

### Cenas em inglês

```bloco CENA-POR01
Scene: an attic library full of dusty golden light with a round window, on a violet planet. Elements: 1) five colored lanterns in a row, 2) a tall arched shelf holding many small blank wooden tiles, 3) one large chest and one small chest side by side, 4) a wall of small drawers each with a tiny painted picture, 5) a stepped bookshelf with blank wooden tiles ordered in a row.
```

```bloco CENA-POR02
Scene: a cozy railway station with a small steam train at dusk. Elements: 1) a small locomotive with a round chimney, 2) a platform with a big brass bell, 3) a freight wagon loaded with colorful crates, 4) a market wagon with open shelves, 5) a station building with a clock tower whose clock face has no numbers.
```

```bloco CENA-POR03
Scene: a lively market square of fabric stalls strung with lanterns. Elements: 1) a stall with two hanging blank banners, 2) a stall with three hanging blank banners, 3) a stall with a gap in a row of hanging blank banners, 4) a stall of scrambled blank tiles hanging on strings, 5) a stall where pairs of similar objects sit side by side.
```

```bloco CENA-POR04
Scene: a warm workshop of workbenches under hanging lamps. Elements: 1) a workbench with brass gears, 2) a workbench with a pulley and rolled rope, 3) a workbench with a saw and wood shavings, 4) a workbench with three funnels of different sizes, 5) a workbench with a small wooden press.
```

```bloco CENA-POR05
Scene: a post office with a conveyor belt of letters. Elements: 1) a mailbox, 2) a service counter with a brass bell, 3) a conveyor belt carrying sealed envelopes, 4) a giant rubber stamp in the shape of a round dot and a curled flag, 5) a carrier-pigeon tower with a round window.
```

```bloco CENA-POR06
Scene: a covered market with wooden shelves and lanterns. Elements: 1) a stall with blank hanging tags, 2) shelves with single items and groups of the same item side by side, 3) a stall with matched pairs of boots and shoes, 4) a pair of mannequins in different styles, 5) a board with blank name badges hanging on hooks.
```

```bloco CENA-POR07
Scene: a small theater with open plum curtains. Elements: 1) a front row of velvet seats, 2) a costume rack with different outfits, 3) a backstage rope-and-pulley system, 4) three arched doors with a rising sun, a high sun and a moon above them, 5) a stage with a finished painted backdrop.
```

```bloco CENA-POR08
Scene: an old-fashioned print shop with warm lamps. Elements: 1) a big wooden printing press, 2) a tray of metal type blocks with blank faces, 3) an ink pot with rollers, 4) a paper cutter, 5) a shelf of rolled newspapers.
```

```bloco CENA-POR09
Scene: a garden of tiny flowers at dusk. Elements: 1) flower beds where small leaf-shaped marks sit above the plants, 2) an arch covered in wavy vines, 3) a stone fountain, 4) a row of plants separated by small comma-shaped stones, 5) a tree whose leaves are shaped like round speech bubbles.
```

```bloco CENA-POR10
Scene: a grand village library with tall windows. Elements: 1) a reception desk with folded notes, 2) a table with an open recipe-style book and kitchen items, 3) a reading armchair with a storybook, 4) a wall map with strings and pins, 5) a tall tower with a golden trophy.
```

---

## 5. PLANETA HORIZONTE (Inglês)

**Tema.** Uma cidade costeira espalhada por ilhas ligadas por pontes e barcos: é para lá que o Bobby viaja (os capítulos são de uma cidade americana, e ele "desce do avião"). Identidade fixa do planeta: cidade litorânea com ilhas, nunca arquipélago selvagem; as 10 cenas são lugares de cidade (aeroporto, escola, casa, zoológico, restaurante, loja, rua, praça). Guia: **Otto**, a lontra.
**Paleta.** Tokens `--ing-*` (turquesa), com madeira branca de telhado azul e coral de acento (casa com o cachecol do Otto). Céu `--ing-ceu-topo` até `--ing-ceu-horizonte`, chão `--ing-chao`.
**Clima de luz.** Tarde ensolarada e suave, luz refletida do mar.
**Nota.** Sem texto nas imagens, as placas ficam em branco; as palavras em inglês aparecem pelo app, com o áudio gravado.

```prompt PLANETA-ING estilo=ESTILO-CENARIO fundo=FUNDO-ESPACO ar=1:1
A stylized semi-realistic small planet seen from slightly above, floating alone: a world of turquoise sea with a chain of small islands joined by wooden bridges, white-painted wooden houses with blue roofs, sailing boats, a lighthouse, a small airport with a runway on one island, and coral-colored accents. Warm late-afternoon light from the upper left and a cool rim light. No text, no characters.
```

| # | Fases no código (`mundoEN`, títulos literais) | Lugar (`CAPITULOS_EN`) | 5 peças que se montam | Item do capítulo |
|---|---|---|---|---|
| 1 | Hello and hi (oi e olá) · Good morning, good night (bom dia, boa noite) · Please and thank you (por favor e obrigado) · My name is... (meu nome é...) · One, two, three (um, dois, três) | **Chegando na cidade** (Landing in the city) | avião pequeno de hélice na pista · relógio grande com sol e lua · balcão de atendimento com sino de latão · mesa de crachás com fitas · três balões coloridos presos na entrada do terminal | mala |
| 2 | Red, blue, green (vermelho, azul, verde) · Yellow, black, white (amarelo, preto, branco) · Orange, purple, pink (laranja, roxo, rosa) · Book and pencil (livro e lápis) · School and teacher (escola e professora) | **A escola nova** (The new school) | três arcos em vermelho, azul e verde · três faixas de pano em amarelo, preto e branco · três arcos em laranja, roxo e rosa · pilha de livros com lápis · escola com torre do sino | lápis |
| 3 | Mother and father (mãe e pai) · Sister and brother (irmã e irmão) · Grandmother, grandfather (avó e avô) · Family and friends (família e amigos) · Boy, girl, baby (menino, menina, bebê) | **A família que recebe** (The host family) | varanda com duas poltronas de adulto e capacho · balanço de dois lugares · duas cadeiras de balanço · mesa de jardim com cadeiras · berço e triciclo no quintal | carta |
| 4 | Dog and cat (cachorro e gato) · Bird and fish (pássaro e peixe) · Farm animals (bichos da fazenda) · Wild animals (bichos selvagens) · Bear and rabbit (urso e coelho) | **Um dia no zoológico** (A day at the zoo) | cantinho dos bichos de casa com casinha de cachorro e cesta de gato · viveiro de pássaros e lago de peixes · cantinho de fazenda com celeiro pequeno · savana com pedras e capim alto · recinto do urso e abrigo do coelho | estrela |
| 5 | Water and milk (água e leite) · Bread and cheese (pão e queijo) · Fruits (frutas) · Cake and candy (bolo e doces) · Breakfast and dinner (café da manhã e jantar) | **No restaurante** (At the diner) | balcão com copo de água e garrafa de leite · cesta de pão e tábua de queijo · cesta de frutas · bolo em cúpula de vidro · mesa posta com refeição completa | fruta |
| 6 | Head and hands (cabeça e mãos) · Face (o rosto) · Shirt and shoes (camisa e sapatos) · Dress and hat (vestido e chapéu) · Getting dressed (se vestir) | **A loja de roupas** (The clothes store) | manequim com cabeça, mãos e pés · espelho redondo · prateleira de camisetas e sapatos · arara de vestidos e chapéus · provador com roupa completa no cabide | etiqueta |
| 7 | House and door (casa e porta) · Kitchen and bedroom (cozinha e quarto) · Table and chair (mesa e cadeira) · Garden and rooms (jardim e cômodos) · Key and light (chave e luz) | **Lar doce lar** (Home sweet home) | porta da frente com capacho · corte mostrando cozinha e quarto · conjunto de mesa e cadeiras · jardim com cômodos à vista · chave e lâmpada pendurados ao lado da porta | peça |
| 8 | Run, eat, drink (correr, comer, beber) · Sleep and play (dormir e brincar) · Read and write (ler e escrever) · Walk, sing, jump (andar, cantar, pular) · I can, I like (eu consigo, eu gosto) | **Um dia na cidade** (A day in the city) | pista de corrida e bebedouro · banco de parque e área de brincar · banca de jornal e livraria com livros abertos · palco pequeno de cantar e faixa de pedestres · cartaz com formas de coração e de joinha sem texto | passaporte |
| 9 | What and where (o quê e onde) · Who and when (quem e quando) · How many (quantos) · How are you? (como você está?) · How old are you? (quantos anos você tem?) | **Fazendo amigos** (Making friends) | balões de fala flutuando sobre bancos · torre do relógio da praça · mesa de exposição com grupos de objetos · roda de bancos para conversar · bolo de aniversário com velas na mesa | balão |
| 10 | Yesterday, today, tomorrow (ontem, hoje, amanhã) · Frases do dia a dia · Pedir e agradecer · Palavras iguais e falsas · Final challenge (desafio final) | **Falando como um local** (Talking like a local) | parede de calendário com três janelas · quadro de cartazes com figuras alegres · balcão com sino e caixa de presente · parede de espelhos mostrando objetos parecidos · pódio com bandeira grande | bandeira |

Unidades no código, em ordem: 1 Hello! · Olá!; 2 Colors and school · Cores e escola; 3 My family · Minha família; 4 Animals · Animais; 5 Food and drinks · Comida e bebida; 6 Body and clothes · Corpo e roupas; 7 My house · Minha casa; 8 What I do · O que eu faço; 9 Questions · Perguntas; 10 Everyday English · Inglês do dia a dia. (O nome do lugar vem do capítulo, não da unidade.)

### Cenas em inglês

```bloco CENA-ING01
Scene: a small island airport and harbor in the late afternoon. Elements: 1) a small propeller plane on the runway, 2) a big wall clock with a sun and a moon painted on it and no numbers, 3) a service counter with a brass bell, 4) a table of name badges with ribbons, 5) three colorful balloons tied at the terminal entrance.
```

```bloco CENA-ING02
Scene: a bright school building on a seaside hill. Elements: 1) three arches in red, blue and green, 2) three cloth banners in yellow, black and white, 3) three arches in orange, purple and pink, 4) a pile of books with pencils, 5) the school building with a bell tower.
```

```bloco CENA-ING03
Scene: a warm family house with a porch near the sea. Elements: 1) a front porch with two adult-sized armchairs and a doormat, 2) a two-seat swing, 3) two rocking chairs, 4) a garden table with chairs, 5) a baby crib and a tricycle in the yard.
```

```bloco CENA-ING04
Scene: a calm zoo with a small entrance gate in the background. Elements: 1) a pets corner with a doghouse and a cat basket, 2) a bird aviary and a fish pond, 3) a farm corner with a small barn, 4) a savanna corner with rocks and tall grass, 5) a pen with a bear and a shelter for a rabbit.
```

```bloco CENA-ING05
Scene: a retro seaside diner with a striped awning. Elements: 1) a counter with a glass of water and a bottle of milk, 2) a basket of bread and a cheese board, 3) a basket of fruit, 4) a glass cake stand with a cake, 5) a set table with a complete meal.
```

```bloco CENA-ING06
Scene: a clothes shop on a harbor street. Elements: 1) a mannequin with head, hands and feet visible, 2) a round mirror, 3) a shelf of T-shirts and shoes, 4) a rack of dresses and hats, 5) a fitting room with a complete outfit on a hanger.
```

```bloco CENA-ING07
Scene: a cozy house with a cutaway view, near the sea. Elements: 1) the front door with a doormat, 2) a cutaway of a kitchen and a bedroom, 3) a table and chairs set, 4) a garden with the rooms visible, 5) a key and a lamp hanging on a hook beside the door.
```

```bloco CENA-ING08
Scene: a seaside city street on a sunny afternoon. Elements: 1) a running track with a drinking fountain, 2) a park bench and a play area, 3) a newsstand and a bookstore with open books, 4) a small singing stage and a crosswalk, 5) a billboard showing a heart shape and a thumbs-up shape with no text.
```

```bloco CENA-ING09
Scene: a friendly plaza by the harbor. Elements: 1) speech balloons floating above benches, 2) a plaza clock tower with no numbers, 3) a display table with groups of objects, 4) a circle of benches for chatting, 5) a birthday cake with candles on a table.
```

```bloco CENA-ING10
Scene: a central station plaza with a tall flagpole. Elements: 1) a calendar wall with three windows, 2) a board of cheerful pictograms, 3) a counter with a bell and a gift box, 4) a wall of mirrors reflecting look-alike objects, 5) a podium with a big flag.
```

---

## 6. Prompts de cenário (como montar)

Cada etapa gera 2 imagens de cenário e 1 desenho. O script monta tudo a partir dos blocos. A fórmula de cada uma:

| Imagem | Fórmula | Proporção |
|---|---|---|
| Cena `completo` | ESTILO-CENARIO + PALETA da matéria + GABARITO + CENA-xxNN + NEG-CENARIO | 3:4 |
| Cena `apagado` | EDITAR-APAGADO, com a cena `completo` aprovada como imagem de referência | 3:4 |
| Desenho para colorir | BLOCO-COLORIR + CENA-xxNN (seção 7) | 3:4 |

Exemplo montado de uma cena `completo` (Inglês, etapa 1), que é o do lote piloto:

```prompt CEN-ING01-COMPLETO estilo=ESTILO-CENARIO paleta=PALETA-ING gabarito=GABARITO cena=CENA-ING01 neg=NEG-CENARIO ar=3:4
Output a single image of this scene.
```

Os demais 29 cenários e os 30 `apagado` são gerados pelo script com a mesma fórmula (id `CEN-xxNN-COMPLETO` e `CEN-xxNN-APAGADO`, e `DES-xxNN`). Os 3 `PLANETA-*` são gerados à parte (seção 3, 4 e 5) com FUNDO-ESPACO para recortar.

**Conferência de uma cena (ficha de aprovação):**

| # | Item | Eliminatório |
|---|---|---|
| 1 | As 5 peças estão visíveis, separadas e na ordem de profundidade | sim |
| 2 | Os 40% de baixo estão calmos e sem objetos (zona dos nós) | sim |
| 3 | Sem texto, letra, número ou placa legível | sim |
| 4 | Sem personagem nem pessoa | sim |
| 5 | Luz: principal à esquerda, recorte quente, perspectiva atmosférica | não |
| 6 | Parece lugar de verdade, com material e profundidade, sem cara de colagem | sim |
| 7 | A paleta é a do planeta (reconhece a matéria sem ler o título) | não |
| 8 | Corte 3:2 do topo funciona como cartão de etapa | não |
| 9 | Versão `apagado` mantém a composição idêntica (teste: sobrepor a 50% e conferir) | sim |
| 10 | Legível em celular de 360 px com os nós e o personagem por cima | sim |

---

## 7. Os 30 desenhos para colorir

**Regra.** Um desenho por etapa concluída, dando 30 no total (10 por matéria). O desenho é o **lugar da etapa já montado**, em traço limpo, com as mesmas 5 peças da cena. O tema vem do capítulo, que já está alinhado às unidades do código (`UNITS_MAT`, `UNITS_PT`, `UNITS_EN`), então ligar o desenho ao gancho `mundoCompleto(u)` não exige reescrever conteúdo.

**O que muda em relação ao hoje:** a galeria deixa de gerar 150 cartões de atividade com formas primitivas (`DESENHO(ui, li)`, `desenhos.js`) e passa a mostrar 30 ilustrações de verdade. O código de PDF e o bug do ícone gigante da galeria ficam para a implementação.

**Especificação do traço (7 a 12 anos):**
- Contorno preto uniforme, médio (3 a 4 px em 1500 px de largura), linhas fechadas, sem falhas.
- Sem sombreado, sem cinza, sem hachura, sem área preta cheia.
- Áreas grandes para pintar: a menor tem o tamanho de uma moeda quando impressa em A4. Entre 20 e 30 áreas pintáveis por desenho.
- Proporções realistas e amigáveis (não de bebê), um foco único no centro, margem branca ao redor.
- O Bobby aparece pequeno, em traço, perto do caminho, olhando para o lugar (marca da estrela na orelha, colete e mochila).
- Sem texto, letra ou número desenhado.
- Formato mestre 3:4 em 1500 por 2000 px; para imprimir em A4 (proporção 1 por 1,414), centralizar e completar a margem com branco (não esticar).

**Pós-processamento (executável):**
1. Conferir com a ficha da seção 8 antes de aceitar.
2. Converter para preto e branco puro com limiar (sem cinza) e salvar PNG de 1 bit. Meta de peso: até 120 KB por desenho (**não medido**).
3. Opcional: vetorizar (`images_to_svg` do MCP de imagens; gasta crédito, pedir ok) para impressão perfeita. Se não vetorizar, 1500 px de largura já imprime bem em A4.
4. Gerar o PDF A4 no aparelho, como hoje (a biblioteca `jspdf` hoje vem de CDN; levar para dentro do app).

```bloco BLOCO-COLORIR
Children's coloring book page, a clean black outline drawing on a pure white background, uniform medium-thick even black lines, every shape fully closed with no gaps so each area can be colored, no shading, no gray fills, no hatching, no solid black areas, no text, no letters, no numbers, large simple areas for easy coloring with about 20 to 30 colorable areas, a medium level of detail suitable for ages 7 to 12, charming realistic proportions that are not baby-like, one clear focal scene centered with a calm white margin around it. In the foreground near the path stands a small bear cub explorer in line art, with a tiny star shape on one ear, wearing a vest and carrying a round backpack, looking at the scene. Portrait 3:4.
```

```bloco NEG-COLORIR
Not a photo, not a painting, no color, no gray tones, no gradients, no shadows, no filled black shapes, no text, no letters, no numbers, no watermark, no signature, no tiny details smaller than a coin, no overlapping or open lines.
```

Cada desenho: `BLOCO-COLORIR + CENA-xxNN + NEG-COLORIR`. Os prompts de cada um, em inglês, são as 30 cenas das seções 3, 4 e 5 (já com as 5 peças, na ordem). Resumo da lista, com o nome do desenho em português (o que a criança vê na galeria):

| # | Matéria | Etapa | Desenho (nome na galeria) | Cena (prompt em inglês) | Item do capítulo escondido para achar |
|---|---|---|---|---|---|
| 01 | Matemática | 1 | A horta do Bobby | CENA-MAT01 | uma semente grande |
| 02 | Matemática | 2 | O tesouro da praia | CENA-MAT02 | uma concha |
| 03 | Matemática | 3 | A caravana do deserto | CENA-MAT03 | uma gota |
| 04 | Matemática | 4 | O piquenique da floresta | CENA-MAT04 | uma fruta |
| 05 | Matemática | 5 | A pizzaria da montanha | CENA-MAT05 | uma fatia |
| 06 | Matemática | 6 | A feira da cidade | CENA-MAT06 | uma moeda |
| 07 | Matemática | 7 | A loja de descontos | CENA-MAT07 | uma etiqueta |
| 08 | Matemática | 8 | O parquinho novo | CENA-MAT08 | uma peça |
| 09 | Matemática | 9 | A oficina de foguetes | CENA-MAT09 | um parafuso |
| 10 | Matemática | 10 | A festa no castelo | CENA-MAT10 | uma estrela |
| 11 | Português | 1 | A caixa de letras | CENA-POR01 | uma tabuleta |
| 12 | Português | 2 | O trem das sílabas | CENA-POR02 | um balão |
| 13 | Português | 3 | A feira das palavras | CENA-POR03 | um balão |
| 14 | Português | 4 | A oficina dos sons | CENA-POR04 | uma pena |
| 15 | Português | 5 | O correio das frases | CENA-POR05 | uma carta |
| 16 | Português | 6 | O mercado dos nomes | CENA-POR06 | uma etiqueta |
| 17 | Português | 7 | O teatro das ações | CENA-POR07 | uma estrela |
| 18 | Português | 8 | A gráfica | CENA-POR08 | um lápis |
| 19 | Português | 9 | O jardim dos acentos | CENA-POR09 | uma pena |
| 20 | Português | 10 | A biblioteca | CENA-POR10 | um livro |
| 21 | Inglês | 1 | Chegando na cidade | CENA-ING01 | uma mala |
| 22 | Inglês | 2 | A escola nova | CENA-ING02 | um lápis |
| 23 | Inglês | 3 | A família que recebe | CENA-ING03 | uma carta |
| 24 | Inglês | 4 | Um dia no zoológico | CENA-ING04 | uma estrela |
| 25 | Inglês | 5 | No restaurante | CENA-ING05 | uma fruta |
| 26 | Inglês | 6 | A loja de roupas | CENA-ING06 | uma etiqueta |
| 27 | Inglês | 7 | Lar doce lar | CENA-ING07 | uma peça |
| 28 | Inglês | 8 | Um dia na cidade | CENA-ING08 | um passaporte |
| 29 | Inglês | 9 | Fazendo amigos | CENA-ING09 | um balão |
| 30 | Inglês | 10 | Falando como um local | CENA-ING10 | uma bandeira |

"Item escondido": o item do capítulo (do código) vira um desafio leve de achar dentro do desenho, no app (marcação de interface, não desenhada na imagem). É uma ideia opcional, sem custo de imagem; o Filipe decide se entra.

Os 30 prompts finais (id `DES-MAT01` até `DES-ING10`) são gerados pelo script na ordem acima:

```prompt DES-ING01 estilo=BLOCO-COLORIR cena=CENA-ING01 neg=NEG-COLORIR ar=3:4
Output a single coloring page of this scene.
```

(Os outros 29 seguem a mesma forma e são gerados pelo script: `DES-MAT01` a `DES-MAT10`, `DES-POR01` a `DES-POR10`, `DES-ING02` a `DES-ING10`.)

---

## 8. Ficha de aprovação do desenho

| # | Item | Eliminatório |
|---|---|---|
| 1 | Só preto e branco, sem cinza, sem sombreado, sem área preta cheia | sim |
| 2 | Todas as formas fechadas (testar no balde de tinta de qualquer editor: a cor não vaza) | sim |
| 3 | Entre 20 e 30 áreas pintáveis, nenhuma menor que uma moeda no A4 | sim |
| 4 | As 5 peças da etapa estão no desenho e se reconhecem | sim |
| 5 | Sem texto, letra ou número | sim |
| 6 | O Bobby está em traço, com estrela na orelha, colete e mochila | não |
| 7 | Proporção e estilo de 7 a 12 anos (nada de bebê, nada de adulto complexo) | não |
| 8 | Imprime bem em A4, centralizado, com margem | não |
| 9 | A criança de 8 anos diz que daria vontade de pintar (teste com a filha) | não |

---

## 9. Quantidade e custo do lote completo (estimativa)

| Item | Imagens |
|---|---|
| 3 planetas vistos do espaço | 3 |
| 30 cenas `completo` | 30 |
| 30 cenas `apagado` (edição) | 30 |
| 30 desenhos para colorir | 30 |
| **Total a aprovar** | **93** |

Com 3 a 4 gerações por imagem aprovada, são cerca de 280 a 370 gerações (**estimativa**). O custo em crédito do Flow não foi consultado. Nenhum crédito foi gasto. Somando os personagens da `BIBLIA-DE-PERSONAGENS.md` (45 a 47), o projeto inteiro pede de 138 a 140 imagens aprovadas.

## 10. Pendências para o Filipe

- **D4:** aprovar a mecânica de montagem da versão 1 (duas imagens e máscara em 5 passos) ou pedir máscara por peça (mais bonito, mais trabalho).
- **D5:** aprovar os nomes dos planetas (Numeral, Fábula, Horizonte) e dos lugares (os nomes vêm dos capítulos que já existem no código).
- **D6:** o "item escondido" no desenho entra ou fica de fora.
- Conferir no Flow se edição de imagem com referência mantém a composição (é o que a versão `apagado` exige). Se não mantiver, o plano B é gerar `apagado` e `completo` separados e alinhar com sobreposição manual, o que custa mais tentativas.
