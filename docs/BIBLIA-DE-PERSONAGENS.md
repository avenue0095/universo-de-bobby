# BIBLIA DE PERSONAGENS · O Universo de Bobby

Versão 1 · 24/10/2026 · Fase 3 · rascunho para aprovação do Filipe e da filha.
Nenhuma imagem foi gerada e nenhum crédito foi gasto. Este documento só descreve e escreve prompts.
Cores aparecem por nome de token (`--pers-*`, definidos no bloco de tokens de `DESIGN.md`) e por palavra. Hex não aparece aqui de propósito.

---

## 0. Para que serve e como usar

**Problema que resolve.** A filha de 8 anos disse que os personagens atuais "parecem uma imagem com colagens sem graça por cima" e que seria legal ser "mais realista como jogos modernos de RPG" (`RESPOSTAS.md`). Hoje são 5 personagens com o mesmo molde de cabeça, 4 expressões e 2 animações (`pesquisa/00-mapa-do-app-hoje.md`, seção 1.3). Esta bíblia define um elenco novo, com corpo, luz e material de verdade, e um jeito de gerar imagens que mantém cada personagem igual de uma imagem para a outra.

**Elenco (7 personagens).**

| Personagem | Papel | Planeta |
|---|---|---|
| **Bobby**, urso filhote | mascote e personagem do jogador | todos |
| **Teo**, robô explorador | guia de Matemática | Numeral |
| **Rufa**, raposa ruiva | guia de Português | Fábula |
| **Otto**, lontra viajante | guia de Inglês | Horizonte |
| **Brisa**, dragoa do ar | coringa dos desafios | todos |
| **Capi**, capivara | coringa do acolhimento | todos |
| **Fagulha**, vaga-lume | coringa da mensageira | todos |

**Como usar (ordem).**
1. Ler a seção 1 (blocos de texto que entram em todo prompt) e a seção 2 (regras de consistência).
2. Gerar a folha de referência do personagem, aprovar na ficha da seção 9, e só então gerar poses.
3. Recortar o fundo seguindo a seção 3 e conferir nos 4 fundos de teste.
4. Montar os prompts finais com o script `docs/anexos/montar-prompts.py` (ele lê este arquivo, cola os blocos na ordem certa e grava `docs/anexos/prompts-montados.txt`). Cada prompt abaixo aparece como `prompt ID` com a frase de pose; o script junta estilo, identidade, pose, fundo e negativos.

**Antes do lote.** Tudo que gera imagem passa pelo ok do Filipe, com estimativa de crédito (regra da casa). O lote piloto está em `LOTE-PILOTO.md`.

**Não verificado nesta sessão:** se o Google Flow aceita imagem de referência na geração de imagem (nos vídeos existem "ingredientes"), qual modelo de imagem ele usa hoje, e o limite de tamanho do prompt. Conferir na interface antes do piloto. Se não aceitar referência, o bloco de identidade em texto carrega a consistência sozinho (e a seção 2 diz como compensar).

---

## 1. Blocos que entram em todo prompt

O script monta cada prompt na ordem: **ESTILO + IDENTIDADE + POSE + FUNDO + NEGATIVOS**. Os blocos abaixo não são parafraseados nunca. Em inglês porque o Flow responde melhor.

```bloco ESTILO
Premium stylized 3D character render in the look of a modern story-driven fantasy RPG companion, semi-realistic materials with real volume: soft cinematic key light from the upper left, a subtle warm rim light on the right edge, physically based shading, believable fur, fabric weave and brushed metal. Slightly stylized proportions (large head, large expressive eyes) with realistic textures. Camera at the character's eye level, 50 mm equivalent lens, no wide-angle distortion, everything in sharp focus. Friendly, calm and family-friendly, suitable for children aged 7 to 12.
```

```bloco NEG
Not flat vector art, not clip art, not a sticker, not a cartoon with thick outlines, no collage of separate shapes, no text, no letters, no numbers, no logos, no watermark, no signature, no extra characters, no props that are not listed, no motion blur, no cast shadow on the ground, no floor, no gradient background, no vignette, no glow or transparent parts at the silhouette edge, no stray hair strands, no extra limbs, no extra or missing fingers, no frightening or sad expression.
```

```bloco FUNDO-A
Background: a perfectly flat, uniform, solid mid-gray (about 50 percent brightness), no gradient, no floor line, no shadow on the background. The whole character fits inside the frame with a generous margin on every side.
```

```bloco FUNDO-B
Background: a perfectly flat, uniform, solid dark charcoal (about 15 percent brightness), no gradient, no floor line, no shadow on the background. The whole character fits inside the frame with a generous margin on every side.
```

```bloco FUNDO-C
Background: a perfectly flat, uniform, solid light gray (about 80 percent brightness), no gradient, no floor line, no shadow on the background. The whole character fits inside the frame with a generous margin on every side.
```

**Qual fundo para qual personagem** (escolhido para a cor do fundo não existir no personagem e facilitar o recorte):

| Personagem | Fundo | Por quê |
|---|---|---|
| Bobby, Rufa, Otto, Brisa | FUNDO-A (cinza médio) | pelo marrom, laranja e escama turquesa se separam bem do cinza neutro |
| Teo, Capi | FUNDO-B (carvão escuro) | corpo claro e pelo bege médio perdem contraste no cinza médio |
| Fagulha | FUNDO-C (cinza claro) | corpo azul-noite escuro contra fundo claro |

**Armadilhas de material que arruínam o recorte** e já estão resolvidas nas fichas: pelo longo e solto (por isso pelo curto e denso, e cauda cheia com silhueta limpa), vidro e peças translúcidas (visor opaco e asas opacas), brilho que vaza do personagem (o brilho da Fagulha e do visor do Teo entra depois, pelo app).

---

## 2. Regras para manter o personagem igual entre imagens

1. **Bloco de identidade palavra por palavra.** Cada personagem tem um bloco `IDENT-*` (seção do personagem). Ele entra completo em toda geração, mesmo com imagem de referência. Nunca resumir, nunca trocar um adjetivo.
2. **A folha aprovada é a verdade.** Depois da folha aprovada, toda pose usa a folha como imagem de referência (e, quando houver, a melhor pose anterior). Se o Flow não aceitar referência, usar só o bloco e comparar com a folha na ficha.
3. **Rosto de frente primeiro.** A primeira imagem de cada personagem é uma vista frontal em pose neutra. Só depois vêm a folha de 3 vistas e as poses. Se a vista frontal já deriva, a folha deriva.
4. **Uma pose por imagem, 4 variações, escolher a mais fiel à folha**, não a mais bonita.
5. **Corrigir por edição, não por sorteio.** Se a pose está certa e um detalhe errou (cor do colete, mancha da orelha), editar a imagem com "keep everything identical, change only X" em vez de gerar de novo.
6. **Derivou? Voltar à folha**, nunca à última pose (a deriva se acumula).
7. **Mesmo modelo, mesma proporção, mesma sessão de trabalho.** Registrar em `arte/fonte/registro.tsv`: id do prompt, modelo e versão, data, proporção, seed se existir, arquivo e nota na ficha.
8. **Nunca espelhar a imagem no app.** Espelhar troca a marca da orelha de lado e inverte a luz principal. Se o personagem precisa olhar para o outro lado, gera-se a versão (as poses de caminhada já têm o lado definido).
9. **Mesma luz sempre:** luz principal em cima à esquerda, recorte quente à direita. Cenários seguem a mesma regra (`CENARIOS-E-DESENHOS.md`), senão volta a parecer colagem.
10. **Uma coisa muda por vez** na iteração do prompt, para saber o que causou a mudança.

**Lista de checagem de fidelidade (usada na ficha da seção 9):** número de dedos, proporção cabeça/corpo, cor do pelo ou do material, marca fixa visível, lado da marca, acessório fixo presente, olhos do mesmo desenho, nada de texto e nada de objeto extra.

---

## 3. Recorte de fundo transparente

**Por que fundo de cor sólida:** o app precisa dos personagens como peças separadas com transparência (mapa, aula, guarda-roupa). Fundo liso neutro, sem sombra e sem degradê é o que a ferramenta de recorte lê melhor.

**Passo a passo:**
1. Gerar com o bloco de fundo da tabela da seção 1. Nada de chão, nada de sombra no fundo.
2. Remover o fundo. Opções: a ferramenta de recorte do MCP de imagens (`images_remove_background`; pode gastar crédito, pedir ok antes) ou `rembg` rodando local (sem custo; precisa instalar, não instalado hoje). Escolher uma e usar a mesma em todo o elenco.
3. Descontaminar a borda: reduzir 1 px da máscara e aplicar suavização de 0,5 px; remover o tom de cinza que sobra nos pelos de borda.
4. **Teste de franja:** colar o recorte sobre 4 fundos: claro (`--cor-superficie` do modo claro), escuro (`--cor-superficie` do modo escuro), o céu do planeta e um xadrez. Ampliar para 200% nas orelhas, na cauda, nos dedos e nos contornos finos. Reprovar se houver halo cinza, serrilhado ou buraco.
5. Reprovou: trocar de bloco de fundo (A, B ou C) e regenerar a mesma pose, ou editar só o contorno. Dois fracassos seguidos: simplificar o contorno (pelo mais curto, sem peça fina).
6. Exportar: WebP com transparência, 512 px de altura (mapa, lista) e 1024 px (tela cheia), qualidade em torno de 85. Peso por pose: meta de cerca de 60 KB, **estimativa, medir no piloto**.
7. A sombra de contato é desenhada no app (`--sombra-contato`), nunca na imagem.
8. Fonte original (PNG grande, com fundo) fica guardada fora do pacote do app, em `arte/fonte/`. Nada se apaga.

---

## 4. BOBBY

### 4.1 Ficha

| Item | Definição |
|---|---|
| Quem é | Urso filhote explorador, guia e mascote do universo, o amigo que a criança "ajuda" em cada missão. Curioso, caloroso, paciente, nunca triste. Fala pouco e sempre incentiva (regra de ética da especificação, seção 5.6) |
| Idade aparente | cerca de 8 anos, para ser colega e não bebê |
| Proporção | 3 cabeças de altura, cabeça grande e redonda, corpo em pera, braços curtos |
| Silhueta | pera com duas orelhas redondas em cima e uma mochila redonda saindo nas costas. Reconhecível a 96 px só pelo contorno |
| Cores | pelo caramelo (`--pers-bobby-pelo`, sombra em `--pers-bobby-pelo-sombra`), focinho e parte de dentro das orelhas em creme (`--pers-bobby-focinho`), olhos marrom-escuro (`--pers-bobby-olho`), colete laranja-tangerina (a cor `--cor-acao` da interface), mochila marrom de tecido |
| Material | pelo curto, denso e macio, com subsurface suave; nariz brilhante e úmido; olhos com reflexo claro; colete de tecido técnico com costura e um botão de metal em forma de estrela; mochila de lona com duas alças |
| Marcas fixas | (1) pequena mancha creme em forma de estrela na orelha esquerda dele, a que fica à direita da imagem quando ele olha para a câmera; (2) colete tangerina com botão de estrela; (3) mochila redonda marrom; (4) mãos com polegar e três dedos curtos |
| O que nunca muda | cor do pelo e do focinho, mancha de estrela na orelha esquerda, colete tangerina com botão, mochila, olhos grandes e castanhos com reflexo, quatro dígitos por pata, 3 cabeças de altura. Sem chapéu e sem sapato na versão base |
| Relação com o guarda-roupa | a versão base é o "traje de explorador". Itens do guarda-roupa são camadas à parte, ver 4.5 |

```bloco IDENT-BOBBY
Bobby, a brown bear cub, about 8 years old in apparent age, three heads tall, pear-shaped body, a large round head with two round ears; short dense smooth caramel-brown fur with no long strands; cream muzzle and cream inner ears; a small glossy dark-brown nose; big warm dark-brown eyes with a clear bright highlight; a small star-shaped patch of cream fur on his left ear (the ear on the right side of the image when he faces the camera); paws with a thumb and three short fingers, soft dark pads; he wears a small tangerine-orange explorer vest with one tiny star-shaped metal button on the chest and a round brown canvas backpack with two straps; no hat and no shoes, bare soft foot pads.
```

### 4.2 Folha de referência (T-pose, 3 vistas)

```prompt BOBBY-SHEET ident=IDENT-BOBBY fundo=FUNDO-A ar=16:9
Character reference sheet of Bobby in a neutral T-pose: arms straight out to the sides with palms down, feet slightly apart, a calm friendly closed-mouth smile. Show three full-body views of exactly the same character on one image, same scale, standing on the same invisible baseline and evenly spaced: front view, side profile view facing left, and back view clearly showing the backpack straps. Identical soft even studio lighting in all three views.
```

Se o Flow não entregar as 3 vistas no mesmo quadro, gerar uma vista por imagem usando a frontal aprovada como referência (ids `BOBBY-SHEET-FRENTE`, `BOBBY-SHEET-LADO`, `BOBBY-SHEET-COSTAS`):

```prompt BOBBY-SHEET-FRENTE ident=IDENT-BOBBY fundo=FUNDO-A ar=3:4
Single full-body front view of Bobby in a neutral T-pose: arms straight out to the sides with palms down, feet slightly apart, a calm friendly closed-mouth smile, looking straight at the camera.
```

```prompt BOBBY-SHEET-LADO ident=IDENT-BOBBY fundo=FUNDO-A ar=3:4 ref=sim
Single full-body side profile view of Bobby facing left in a neutral T-pose: arms straight out to the sides, feet slightly apart, calm closed-mouth smile.
```

```prompt BOBBY-SHEET-COSTAS ident=IDENT-BOBBY fundo=FUNDO-A ar=3:4 ref=sim
Single full-body back view of Bobby in a neutral T-pose: arms straight out to the sides, feet slightly apart, backpack and its two straps clearly visible, head turned straight away from the camera.
```

### 4.3 As 12 poses (13 imagens, porque Caminha tem 2 quadros)

Todas: corpo inteiro, um personagem por imagem, proporção 3:4, com a folha como referência. Cada pose tem um uso no app.

| ID | Pose | Onde aparece no app |
|---|---|---|
| P01 | Oi | abertura do app, bilhete do Bobby, pré-visualização do guarda-roupa |
| P02 | Comemora | fim de fase, combo, baú aberto |
| P03 | Pensa | pergunta difícil, "Como fazer" (dica) |
| P04 | Aponta | aula passo a passo (aponta para o texto) |
| P05 | Caminha (2 quadros: A e B) | mapa, caminhando entre nós |
| P06 | Lê | aula de leitura, história do capítulo |
| P07 | Escuta | pergunta de ouvir em inglês, ditado |
| P08 | Conta | matemática, contagem nos dedos |
| P09 | Incentiva | depois de "ainda não" (nunca triste) |
| P10 | Presente | bilhete, congelador ganho, item novo |
| P11 | Tchau | "Por hoje chega! Até amanhã." |
| P12 | Descansa | ofensiva descansando, fim do dia |

A pose P05 vira duas imagens (contato e passagem do passo) porque andar no mapa precisa de pelo menos dois quadros; totalizam 13 imagens de pose.

```prompt BOBBY-P01 ident=IDENT-BOBBY fundo=FUNDO-A ar=3:4 ref=sim
Pose "hello": standing relaxed in a slight three-quarter turn, one paw raised in a friendly wave at shoulder height, the other paw resting at his side, weight on both feet, a warm open smile, eyes looking at the viewer. Full body, feet visible.
```

```prompt BOBBY-P02 ident=IDENT-BOBBY fundo=FUNDO-A ar=3:4 ref=sim
Pose "celebrate": jumping with joy, both feet clearly off the ground, both paws raised high above the head, mouth wide open in a happy laugh, eyes squeezed shut with joy, backpack lifted by the jump. Full body.
```

```prompt BOBBY-P03 ident=IDENT-BOBBY fundo=FUNDO-A ar=3:4 ref=sim
Pose "think": standing, one paw under the chin and the other arm across the belly, head tilted slightly, eyes looking up and to the side, a thoughtful curious look with a small closed-mouth smile. Full body.
```

```prompt BOBBY-P04 ident=IDENT-BOBBY fundo=FUNDO-A ar=3:4 ref=sim
Pose "point": standing in a three-quarter view turned toward the left of the image, one arm extended to the left pointing with an open paw and extended finger, the other paw on his hip, an encouraging explaining expression, eyes looking at the viewer. Full body.
```

```prompt BOBBY-P05A ident=IDENT-BOBBY fundo=FUNDO-A ar=3:4 ref=sim
Pose "walk, contact frame": walking seen from a three-quarter side view facing right, front foot forward with the heel down, back foot behind on its toes, arms swinging in opposite directions, backpack straps visible, a cheerful determined expression. Full body.
```

```prompt BOBBY-P05B ident=IDENT-BOBBY fundo=FUNDO-A ar=3:4 ref=sim
Pose "walk, passing frame": walking seen from a three-quarter side view facing right, one leg straight under the body and the other leg lifted and passing forward, arms swinging in opposite directions, the body slightly higher than in the contact frame, a cheerful determined expression. Full body.
```

```prompt BOBBY-P06 ident=IDENT-BOBBY fundo=FUNDO-A ar=3:4 ref=sim
Pose "read": standing, holding an open book with both paws at chest height, the book has plain blank cream pages and a sky-blue cover with no printed letters, head slightly lowered looking at the book with delighted interest. Full body.
```

```prompt BOBBY-P07 ident=IDENT-BOBBY fundo=FUNDO-A ar=3:4 ref=sim
Pose "listen": standing, one paw cupped behind one ear and leaning slightly toward that side, head tilted, eyes wide and attentive, the other paw relaxed, mouth slightly open as if listening. Full body.
```

```prompt BOBBY-P08 ident=IDENT-BOBBY fundo=FUNDO-A ar=3:4 ref=sim
Pose "count": standing facing the camera, one paw raised showing exactly three fingers extended (not counting the thumb) with the rest folded, the other paw on his belly, a concentrated happy expression, eyes on the raised paw. Full body.
```

```prompt BOBBY-P09 ident=IDENT-BOBBY fundo=FUNDO-A ar=3:4 ref=sim
Pose "encourage": standing facing the camera, one paw giving a thumbs up, body leaning slightly toward the viewer, a warm encouraging smile, eyebrows slightly raised in a kind way, the other paw on his hip. Full body.
```

```prompt BOBBY-P10 ident=IDENT-BOBBY fundo=FUNDO-A ar=3:4 ref=sim
Pose "gift": standing, holding out a small folded cream note sealed with a small gold star sticker in both paws toward the viewer, no text on the note, sparkling eyes, a happy generous smile. Full body.
```

```prompt BOBBY-P11 ident=IDENT-BOBBY fundo=FUNDO-A ar=3:4 ref=sim
Pose "goodbye": body turned three-quarters away with the head glancing back over the shoulder at the viewer, one paw waving goodbye, the backpack clearly visible, a soft calm smile. Full body.
```

```prompt BOBBY-P12 ident=IDENT-BOBBY fundo=FUNDO-A ar=3:4 ref=sim
Pose "rest": sitting on the ground leaning back against his own backpack, legs stretched forward, paws folded on his belly, eyes closed in a peaceful sleep, a small calm smile, head tilted slightly. Full body, no ground shadow.
```

### 4.4 As 8 expressões (retrato de frente)

Retrato de peito para cima, cabeça de frente, mesmo tamanho de cabeça em todas, para trocar a expressão sem pular o enquadramento. Aparece no botão "Meu personagem" (40 px) e nos balões de fala.

| ID | Expressão | Uso |
|---|---|---|
| E01 | Alegre | acerto, abertura, retrato padrão do botão |
| E02 | Radiante | sequência de acertos, baú, fim de etapa |
| E03 | Curioso | nova pergunta, nova etapa |
| E04 | Pensativo | dica, pergunta difícil |
| E05 | Surpreso | item novo, mundo novo liberado |
| E06 | Incentivando | depois de "ainda não" (no lugar de tristeza) |
| E07 | Concentrado | durante a pergunta, revisão do dia |
| E08 | Tranquilo | fim do dia, ofensiva descansando |

Não existe expressão triste, brava ou assustada, de propósito.

Gerar primeiro a grade com as 8 (mais consistente), e as individuais só se a grade falhar:

```prompt BOBBY-EXPR-GRADE ident=IDENT-BOBBY fundo=FUNDO-A ref=sim ar=16:9
Expression sheet of Bobby: a grid of eight head-and-shoulders portraits in two rows of four, every portrait the same size and framing, front view, same lighting. Expressions in order, row one: happy with a wide open smile; radiant with eyes closed in happy arcs and lifted cheeks; curious with the head tilted, one eyebrow raised and a small open mouth; thoughtful with eyes looking up and to the left and lips pressed to one side. Row two: surprised with big eyes, a round open mouth and ears slightly up; encouraging with a soft smile and eyebrows slightly raised in the middle; concentrated with eyebrows slightly lowered, lips set, determined; calm with half-closed relaxed eyes and a soft smile.
```

```prompt BOBBY-E01 ident=IDENT-BOBBY fundo=FUNDO-A ar=1:1 ref=sim
Head-and-shoulders portrait, front view, expression: happy with a wide open smile and bright eyes.
```

```prompt BOBBY-E02 ident=IDENT-BOBBY fundo=FUNDO-A ar=1:1 ref=sim
Head-and-shoulders portrait, front view, expression: radiant, eyes closed in happy arcs, a big smile and lifted cheeks.
```

```prompt BOBBY-E03 ident=IDENT-BOBBY fundo=FUNDO-A ar=1:1 ref=sim
Head-and-shoulders portrait, front view, expression: curious, head tilted, one eyebrow raised, a small open mouth.
```

```prompt BOBBY-E04 ident=IDENT-BOBBY fundo=FUNDO-A ar=1:1 ref=sim
Head-and-shoulders portrait, front view, expression: thoughtful, eyes looking up and to the left, lips pressed gently to one side.
```

```prompt BOBBY-E05 ident=IDENT-BOBBY fundo=FUNDO-A ar=1:1 ref=sim
Head-and-shoulders portrait, front view, expression: surprised, big round eyes, a round open mouth, ears slightly up.
```

```prompt BOBBY-E06 ident=IDENT-BOBBY fundo=FUNDO-A ar=1:1 ref=sim
Head-and-shoulders portrait, front view, expression: encouraging, a soft kind smile with eyebrows slightly raised in the middle.
```

```prompt BOBBY-E07 ident=IDENT-BOBBY fundo=FUNDO-A ar=1:1 ref=sim
Head-and-shoulders portrait, front view, expression: concentrated, eyebrows slightly lowered, lips set, a determined and friendly look.
```

```prompt BOBBY-E08 ident=IDENT-BOBBY fundo=FUNDO-A ar=1:1 ref=sim
Head-and-shoulders portrait, front view, expression: calm and relaxed, half-closed eyes, a soft gentle smile.
```

### 4.5 Guarda-roupa: decisão aberta que muda o custo

O app hoje vende 6 chapéus, 4 itens de rosto, 4 de pescoço e 6 cores de pelo (`index.html:4566-4609`). Com arte semirrealista, o chapéu colado por cima de uma pose com a cabeça virada é exatamente a "colagem sem graça" que a filha criticou. Por isso:

**Proposta (a decidir pelo Filipe, recomendada):**
- Personagem base com traje de explorador, nas 12 poses.
- **Cor do pelo:** troca por recolor com máscara em cima das imagens base (6 variações, sem gerar de novo). Testar no piloto se o recolor mantém luz e material.
- **Chapéu, rosto e pescoço:** peças gerais em fundo sólido, sobrepostas **só nas poses de cabeça de frente** (P01, P02, P08, P09, P10, retratos E01 a E08), com âncora (posição, escala e giro pequeno) guardada por pose. Nas poses de lado ou de costas (P05, P11, P12), o item aparece só no retrato e na prévia do guarda-roupa; no corpo, mostra o traje base.
- Se o teste do piloto mostrar que a sobreposição parece colagem, **cortar o guarda-roupa para cor do pelo, cor do colete e adesivos**, e tirar chapéus por enquanto.

**Alternativa cara:** gerar cada chapéu em cada pose (14 itens x 12 poses = 168 imagens). Não recomendada.

**Decisão D1 para o Filipe:** seguir a proposta recomendada ou cortar o guarda-roupa desde já? O piloto abaixo testa a proposta com um chapéu como item opcional.

```bloco FUNDO-OBJETO
Background: a perfectly flat, uniform, solid mid-gray (about 50 percent brightness), no gradient, no floor line, no shadow on the background. The whole object fits inside the frame with a generous margin on every side.
```

```prompt BOBBY-ITEM-CHAPEU estilo=ESTILO fundo=FUNDO-OBJETO neg=NEG ar=1:1
A single explorer hat sized for a bear cub, soft canvas material in a warm cream tone with a tangerine-orange band and one tiny star-shaped metal button, seen straight from the front, floating alone with no head and no character, exactly centered, lit the same way as the character renders (key light from the upper left, warm rim light on the right).
```

---

## 5. Os seis companheiros

Regra de elenco: cada um tem **silhueta, proporção e personalidade diferentes de Bobby e entre si**, e uma função no jogo. Os três guias aparecem na matéria deles; os três coringas aparecem em momentos fixos, em qualquer matéria.

### 5.0 Comparação de silhuetas (o teste dos 96 px)

| Personagem | Forma | Largura sobre altura (aprox.) | Altura relativa ao Bobby | Pose-base |
|---|---|---|---|---|
| Bobby | pera com orelhas e mochila | 0,8 | 1,0 | em pé |
| Teo | retângulo alto com antena | 0,6 | 1,1 | em pé, rígido |
| Rufa | fina e alta, cauda enorme | 1,0 (pela cauda) | 1,3 | em pé, cauda curva |
| Otto | S baixo e comprido, cauda grossa | 0,9 | 1,0 | em pé nas patas de trás, inclinado |
| Brisa | serpentina em S, com asas | 1,5 | 1,2 (comprimento) | flutuando |
| Capi | bloco largo e baixo | 1,6 | 0,7 | sentada |
| Fagulha | gota com antenas e casca de asas | 1,0 | 0,25 | pairando |

**Aceite da silhueta:** os sete contornos, pintados de preto sobre branco e reduzidos a 96 px de altura, se distinguem sem legenda (feito na ficha da seção 9, linha "silhueta"). Os valores da tabela são alvos de projeto, não medição.

### 5.1 TEO, o robô explorador (guia de Matemática)

| Item | Definição |
|---|---|
| Papel | guia do planeta Numeral. Mostra padrões, conta junto, nunca dá a resposta |
| Personalidade | organizado, curioso, paciente, brinca com padrões. Fala em frases curtas e exatas. Quando erra um cálculo de brincadeira, ri de si mesmo |
| Idade aparente | "criança de uns 9 anos" feita de peças |
| Silhueta | retângulo alto com cabeça quadrada de cantos redondos, uma antena curva com esfera na ponta, braços finos telescópicos e pernas curtas de pistão |
| Cores | corpo pérola (`--pers-teo-corpo`), juntas azul-ardósia (`--pers-teo-junta`), visor âmbar (`--pers-teo-visor`) |
| Material | cerâmica fosca e metal escovado, parafusos pequenos, desgaste leve nos cantos. Visor **opaco** de laca escura com dois olhos de retângulo arredondado em âmbar, sem vidro transparente e sem brilho que vaze |
| Marcas fixas | antena com esfera âmbar que pende para a direita da imagem; painel no peito com 4 luzinhas redondas em grade de 2 por 2; olhos retangulares |
| O que nunca muda | cabeça quadrada, antena torta para a direita, painel de 4 luzes, visor âmbar, corpo pérola, juntas azul-ardósia |
| Fundo | FUNDO-B |

```bloco IDENT-TEO
Teo, a small friendly explorer robot about the size of a nine-year-old child, a tall rectangular body with a squared head with rounded corners, matte pearl-white ceramic and brushed metal panels with tiny screws and light wear on the corners, slate-blue joints, thin telescoping arms and short piston legs; an opaque dark glossy visor with two rounded-rectangle amber eyes (no transparent glass, no glow spill); one curved antenna with an amber sphere on the tip that leans toward the right side of the image; a chest panel with four small round lights in a two by two grid; hands with a thumb and two chunky fingers.
```

```prompt TEO-SHEET ident=IDENT-TEO fundo=FUNDO-B ar=16:9
Character reference sheet of Teo in a neutral T-pose with arms straight out and slightly telescoped, a friendly calm eye expression. Three full-body views of exactly the same robot on one image, same scale, standing on the same invisible baseline and evenly spaced: front view, side profile view facing left, back view. Identical soft even studio lighting in all three views.
```

```prompt TEO-P01 ident=IDENT-TEO fundo=FUNDO-B ar=3:4 ref=sim
Pose "hello": standing, one arm raised in a friendly wave, the other at his side, antenna tilted, eyes shaped as happy upward arcs. Full body.
```

```prompt TEO-P02 ident=IDENT-TEO fundo=FUNDO-B ar=3:4 ref=sim
Pose "celebrate": jumping slightly off the ground with both arms raised, antenna sphere bouncing, eyes as wide happy arcs. Full body.
```

```prompt TEO-P03 ident=IDENT-TEO fundo=FUNDO-B ar=3:4 ref=sim
Pose "explain": standing, holding an opaque solid crystal cube with a soft blue tint (not glowing, not transparent) in one hand at chest height and pointing at it with the other hand, eyes looking at the viewer. Full body.
```

```prompt TEO-P04 ident=IDENT-TEO fundo=FUNDO-B ar=3:4 ref=sim
Pose "encourage": standing facing the camera, one thumb up, torso leaning slightly toward the viewer, antenna tilted, warm encouraging eyes. Full body.
```

### 5.2 RUFA, a raposa ruiva (guia de Português)

| Item | Definição |
|---|---|
| Papel | guia do planeta Fábula. Lê em voz alta, conta histórias, brinca com as palavras |
| Personalidade | elegante, bem-humorada, um pouco dramática, fala como quem lê um conto. Adora um final feliz |
| Idade aparente | "irmã mais velha" de uns 12 anos |
| Silhueta | esbelta e alta, orelhas grandes e pontudas, cauda enorme que quase dobra a largura do corpo |
| Cores | pelo laranja-ruivo (`--pers-rufa-pelo`), peito e ponta da cauda em creme (`--pers-rufa-creme`), patas escuras (`--pers-rufa-meia`), pena violeta atrás da orelha, bolsa a tiracolo ameixa |
| Material | pelo curto e liso no corpo, cauda cheia e densa com contorno limpo e sem fios soltos, bolsa de couro macio |
| Marcas fixas | ponta da cauda creme; peito creme; pena violeta presa atrás da orelha direita dela (a da esquerda da imagem); bolsa a tiracolo cor de ameixa; patas escuras como meias |
| O que nunca muda | cor ruiva, cauda com ponta creme, pena atrás da orelha, bolsa ameixa, patas escuras, corpo esbelto de 4 cabeças |
| Fundo | FUNDO-A |

```bloco IDENT-RUFA
Rufa, a young red fox storyteller about twelve years old in apparent age, slender and tall (four heads high), large pointed ears, short smooth rust-orange fur on the body, cream chest bib, dark brown paws like socks, a very large dense fluffy tail with a cream tip and a clean smooth silhouette with no stray strands; a single violet feather tucked behind her right ear (the ear on the left side of the image when she faces the camera); a small plum-colored soft leather satchel across her body on a thin strap; warm amber eyes with a bright highlight; paws with a thumb and three short fingers.
```

```prompt RUFA-SHEET ident=IDENT-RUFA fundo=FUNDO-A ar=16:9
Character reference sheet of Rufa in a neutral T-pose with arms out to the sides and the tail relaxed behind her, a calm friendly smile. Three full-body views of exactly the same fox on one image, same scale, standing on the same invisible baseline and evenly spaced: front view, side profile view facing left showing the full tail, back view showing the tail. Identical soft even studio lighting in all three views.
```

```prompt RUFA-P01 ident=IDENT-RUFA fundo=FUNDO-A ar=3:4 ref=sim
Pose "hello": standing with one paw raised in an elegant wave, the tail curving behind her in a graceful S, head slightly tilted, a warm playful smile. Full body.
```

```prompt RUFA-P02 ident=IDENT-RUFA fundo=FUNDO-A ar=3:4 ref=sim
Pose "celebrate": a little spinning jump with both paws up and the tail swirling, laughing with her eyes closed. Full body.
```

```prompt RUFA-P03 ident=IDENT-RUFA fundo=FUNDO-A ar=3:4 ref=sim
Pose "read aloud": standing, holding an open book with plain blank cream pages and a plum cover (no printed letters) in one paw at chest height, the other paw gesturing as if telling a story, a theatrical expressive face. Full body.
```

```prompt RUFA-P04 ident=IDENT-RUFA fundo=FUNDO-A ar=3:4 ref=sim
Pose "encourage": standing facing the camera, one paw giving a thumbs up, the tail wrapped slightly around her feet, a kind encouraging smile, one eyebrow lifted. Full body.
```

### 5.3 OTTO, a lontra viajante (guia de Inglês)

| Item | Definição |
|---|---|
| Papel | guia do planeta Horizonte. Apresenta as palavras novas, repete devagar, viaja de barco entre as ilhas |
| Personalidade | jovial, brincalhão, aventureiro, bom de papo. Repete uma palavra duas vezes, devagar, e sorri quando a criança acerta |
| Idade aparente | uns 9 anos |
| Silhueta | corpo longo e baixo em forma de S, em pé nas patas de trás apoiado na cauda grossa, cabeça redonda com bigodes |
| Cores | pelo marrom-médio (`--pers-otto-pelo`), barriga e queixo bege (`--pers-otto-barriga`), cachecol coral (`--pers-otto-cachecol`) |
| Material | pelo curto, liso e denso, com leve brilho de pelo úmido; cachecol de lã tricotada; concha branca de verdade no pescoço |
| Marcas fixas | cachecol coral sempre no pescoço; concha branca pendurada num cordão fino; bigodes claros; cauda grossa de lontra como terceiro apoio |
| O que nunca muda | cachecol coral, concha no cordão, pelo marrom com barriga bege, bigodes, cauda grossa, postura de S |
| Fundo | FUNDO-A |

```bloco IDENT-OTTO
Otto, a young sea otter traveler about nine years old in apparent age, a long low S-shaped body standing upright on his hind legs and balanced on a thick tapered tail, a round head with small round ears and pale whiskers; short sleek dense medium-brown fur with a slightly damp sheen, a beige belly and chin; a chunky knitted coral-colored wool scarf around his neck; a real white spiral seashell hanging from a thin cord; bright dark eyes with a clear highlight; paws with a thumb and three short fingers.
```

```prompt OTTO-SHEET ident=IDENT-OTTO fundo=FUNDO-A ar=16:9
Character reference sheet of Otto in a neutral T-pose standing upright with arms straight out to the sides and the tail as a third support, a calm friendly smile. Three full-body views of exactly the same otter on one image, same scale, standing on the same invisible baseline and evenly spaced: front view, side profile view facing left showing the full tail, back view. Identical soft even studio lighting in all three views.
```

```prompt OTTO-P01 ident=IDENT-OTTO fundo=FUNDO-A ar=3:4 ref=sim
Pose "hello": standing upright on hind legs, one paw raised in a friendly wave, the other paw holding the end of his scarf, a big open smile, head tilted. Full body.
```

```prompt OTTO-P02 ident=IDENT-OTTO fundo=FUNDO-A ar=3:4 ref=sim
Pose "celebrate": leaping with both paws up, body arched in a joyful S, the tail swinging, laughing with eyes closed. Full body.
```

```prompt OTTO-P03 ident=IDENT-OTTO fundo=FUNDO-A ar=3:4 ref=sim
Pose "listen and repeat": standing upright, a real white seashell held to one ear with one paw, the other paw cupped as if inviting the viewer to repeat a word, eyes wide and attentive. Full body.
```

```prompt OTTO-P04 ident=IDENT-OTTO fundo=FUNDO-A ar=3:4 ref=sim
Pose "encourage": standing upright facing the camera, one paw giving a thumbs up, the other paw on his hip, a warm cheerful grin. Full body.
```

### 5.4 BRISA, a dragoa do ar (coringa dos desafios)

| Item | Definição |
|---|---|
| Papel | aparece no desafio final de cada etapa e nas missões de "acerte seguidas". Convida, não ameaça |
| Personalidade | travessa, curiosa, competitiva de brincadeira ("duvido que você consiga") e que perde com graça |
| Idade aparente | jovem, do tamanho de uma criança se esticada |
| Silhueta | corpo serpentino em S, flutuando, com duas asas médias e duas pequenas pontas na cabeça, ponta da cauda em forma de nuvem |
| Cores | escamas turquesa (`--pers-brisa-escama`), asas lilás (`--pers-brisa-asa`), barriga creme-amarelada (`--pers-brisa-barriga`) |
| Material | escamas pequenas e foscas com brilho suave, asas de membrana **opaca** com nervuras visíveis, nada translúcido |
| Marcas fixas | duas pontas curtas e redondas na cabeça; ponta da cauda em nuvenzinha creme; asas lilás opacas |
| O que nunca muda | turquesa, asas lilás, ponta de cauda em nuvem, duas pontas curtas, barriga creme |
| Fundo | FUNDO-A |

```bloco IDENT-BRISA
Brisa, a young playful air dragon, a long serpentine S-shaped body floating in the air, about one and a half times the height of a child when stretched out, small matte teal scales with a soft sheen, a cream-yellow belly, two medium wings made of an opaque lilac membrane with visible veins (nothing transparent), two short rounded horns on the head, large bright amber eyes with a clear highlight, a small soft cream cloud-shaped puff at the tip of the tail; four small paws with a thumb and three short fingers.
```

```prompt BRISA-SHEET ident=IDENT-BRISA fundo=FUNDO-A ar=16:9
Character reference sheet of Brisa floating in a neutral relaxed pose with the body forming a gentle S and the wings half open, a calm friendly smile. Three full views of exactly the same dragon on one image, same scale and evenly spaced: front view, side profile view facing left showing the full S shape of the body and tail, back view. Identical soft even studio lighting in all three views.
```

```prompt BRISA-P01 ident=IDENT-BRISA fundo=FUNDO-A ar=3:4 ref=sim
Pose "hello": floating in a loose loop, one paw raised in a wave, wings open, a cheeky welcoming smile. Full body.
```

```prompt BRISA-P02 ident=IDENT-BRISA fundo=FUNDO-A ar=3:4 ref=sim
Pose "celebrate": a victorious barrel roll in the air with the wings wide open and the tail trailing, laughing. Full body.
```

```prompt BRISA-P03 ident=IDENT-BRISA fundo=FUNDO-A ar=3:4 ref=sim
Pose "challenge": floating with the body curled into a question-mark shape, one paw beckoning toward the viewer, one eyebrow raised in a playful dare. Full body.
```

```prompt BRISA-P04 ident=IDENT-BRISA fundo=FUNDO-A ar=3:4 ref=sim
Pose "encourage": floating close to the viewer with one paw giving a thumbs up, wings folded softly, a warm smile. Full body.
```

### 5.5 CAPI, a capivara (coringa do acolhimento)

| Item | Definição |
|---|---|
| Papel | aparece quando a criança vê um "ainda não", no ponto de parada ("Por hoje chega") e quando a ofensiva descansa. Traz calma, nunca cobrança |
| Personalidade | tranquila, acolhedora, lenta de propósito. Respira fundo junto com a criança. Fala baixo e fala pouco |
| Idade aparente | adulta calma, um "avô ou avó" gentil, sem ser velha |
| Silhueta | bloco largo e baixo, cabeça retangular arredondada com focinho grande e sem pescoço, corpo em barril; sempre sentada |
| Cores | pelo bege-dourado (`--pers-capi-pelo`), focinho mais escuro (`--pers-capi-focinho`), folha verde na cabeça (`--pers-capi-folha`) |
| Material | pelo curto, grosso e áspero; nariz úmido; folha de verdade, opaca, com nervura |
| Marcas fixas | folhinha verde pousada na cabeça; olhos pequenos e semicerrados; focinho grande e escuro; orelhas pequenas e redondas |
| O que nunca muda | folha na cabeça, focinho grande e escuro, olhos de pálpebra relaxada, corpo de barril, bege-dourado |
| Fundo | FUNDO-B |

```bloco IDENT-CAPI
Capi, a calm adult capybara, a wide low barrel-shaped body with no visible neck, a large rounded-rectangular head with a big dark brown muzzle and glossy nose, small round ears and small relaxed half-closed gentle eyes with a soft highlight, short coarse golden-tan fur, a single small green leaf resting on top of the head, always sitting down on the ground in a relaxed posture, about the same height as a seated child but twice as wide; stubby front feet with four short toes.
```

```prompt CAPI-SHEET ident=IDENT-CAPI fundo=FUNDO-B ar=16:9
Character reference sheet of Capi in a neutral seated pose with the front feet resting on the ground, a calm gentle expression. Three full-body views of exactly the same capybara on one image, same scale, sitting on the same invisible baseline and evenly spaced: front view, side profile view facing left, back view. Identical soft even studio lighting in all three views.
```

```prompt CAPI-P01 ident=IDENT-CAPI fundo=FUNDO-B ar=3:4 ref=sim
Pose "hello": sitting calmly, one front foot slowly raised in a small greeting, a soft sleepy smile. Full body.
```

```prompt CAPI-P02 ident=IDENT-CAPI fundo=FUNDO-B ar=3:4 ref=sim
Pose "celebrate": sitting, both front feet raised a little and the head tilted back in a quiet content smile with closed eyes. Full body.
```

```prompt CAPI-P03 ident=IDENT-CAPI fundo=FUNDO-B ar=3:4 ref=sim
Pose "calm down": sitting, eyes closed, taking a slow deep breath with the chest slightly lifted, one front foot resting over the chest. Full body.
```

```prompt CAPI-P04 ident=IDENT-CAPI fundo=FUNDO-B ar=3:4 ref=sim
Pose "encourage": sitting and leaning slightly toward the viewer, offering a single fresh green leaf with one front foot, a warm gentle look. Full body.
```

### 5.6 FAGULHA, a vaga-lume (coringa da mensageira)

| Item | Definição |
|---|---|
| Papel | entrega o bilhete do Bobby quando a criança volta, avisa que o baú de amanhã está guardado e que há item novo. Voa pequena pela tela |
| Personalidade | tímida, rápida, fala baixinho, sempre animada em entregar. Nunca cobra |
| Idade aparente | não se aplica (inseto pequeno) |
| Silhueta | gota minúscula com duas antenas curvas e duas cascas de asa arredondadas, pairando |
| Cores | corpo azul-noite (`--pers-fagulha-corpo`), cascas de asa com pintinhas cremes, lanterna creme-quente (`--pers-fagulha-lanterna`), asas internas pequenas e opacas (`--pers-fagulha-asa`) |
| Material | casca lisa e lustrosa como besouro, olhos grandes escuros com reflexo, lanterna do abdômen em creme leitoso **opaco** (o brilho entra depois, pelo app) |
| Marcas fixas | olhos muito grandes; duas antenas com bolinha na ponta; lanterna creme na ponta de trás; pintinhas cremes nas cascas |
| O que nunca muda | olhos grandes, antenas com bolinha, lanterna creme, corpo azul-noite com pintinhas |
| Fundo | FUNDO-C |
| Tamanho no app | 0,25 do Bobby; o brilho e o rastro de luz são efeito de interface (`--cor-ouro`), não parte da imagem |

```bloco IDENT-FAGULHA
Fagulha, a tiny shy firefly messenger, a small round body shaped like a drop with a small head, two very large dark glossy eyes with a clear highlight, two curved antennae with small round tips, two rounded dark midnight-blue wing shells with small cream spots and two small opaque pale blue-gray inner wings, six tiny legs, and a lantern at the tip of the abdomen in an opaque milky warm cream color (not glowing, no light spill); about one quarter of the height of a child.
```

```prompt FAGULHA-SHEET ident=IDENT-FAGULHA fundo=FUNDO-C ar=16:9
Character reference sheet of Fagulha hovering in a neutral pose with the wing shells slightly open, a calm shy expression. Three views of exactly the same firefly on one image, same scale and evenly spaced: front view, side profile view facing left, back view. Identical soft even studio lighting in all three views.
```

```prompt FAGULHA-P01 ident=IDENT-FAGULHA fundo=FUNDO-C ar=3:4 ref=sim
Pose "hello": hovering, waving one tiny front leg, wing shells slightly open, a shy smile. Full body.
```

```prompt FAGULHA-P02 ident=IDENT-FAGULHA fundo=FUNDO-C ar=3:4 ref=sim
Pose "celebrate": a happy loop in the air with the wing shells wide open and antennae up, eyes squeezed with joy. Full body.
```

```prompt FAGULHA-P03 ident=IDENT-FAGULHA fundo=FUNDO-C ar=3:4 ref=sim
Pose "deliver": hovering while holding a tiny rolled cream note tied with a small gold star sticker in its front legs, no text on the note, eyes looking at the viewer. Full body.
```

```prompt FAGULHA-P04 ident=IDENT-FAGULHA fundo=FUNDO-C ar=3:4 ref=sim
Pose "encourage": hovering close to the viewer with antennae tilted forward, one tiny leg giving a thumbs up, a warm shy smile. Full body.
```

---

## 6. Nomes e marca registrada

| Personagem | Nome | Observação | Alternativa se houver conflito |
|---|---|---|---|
| Urso | Bobby | já existe no produto e no domínio de uso | manter |
| Robô | Teo | nome próprio comum | Tobi |
| Raposa | Rufa | de "ruiva" | Fulva |
| Lontra | Otto | nome próprio comum | Lutra |
| Dragoa | Brisa | nome próprio comum e palavra do português | Aragem |
| Capivara | Capi | apelido de capivara | Capim |
| Vaga-lume | Fagulha | palavra do português | Pirilampa |

Todos são nomes comuns ou palavras do português, sem referência a personagem conhecido. **Não foi feita busca de marca no INPI nem na internet.** Fazer antes de vender o app, para todos, inclusive "Bobby" (nome muito usado). A busca de similaridade visual com personagens existentes também não foi feita.

Também ficam de fora, nos prompts, nomes de estúdios e de jogos como referência de estilo, para não puxar traço de obra protegida.

---

## 7. O que o personagem diz (nota para a fase de áudio)

Só uma nota: cada personagem precisa de uma voz reconhecível (Bobby caloroso e infantil-guia, Teo claro e calmo, Rufa expressiva, Otto alegre, Brisa travessa, Capi grave e lenta, Fagulha aguda e baixinha). Vozes e amostras seguem o fluxo aprovado (5 amostras, custo estimado, licença comercial conferida) e não fazem parte desta bíblia.

---

## 8. Nomes de arquivo e registro

- Fonte (grande, com fundo): `arte/fonte/<personagem>/<ID>-v<n>.png`, por exemplo `arte/fonte/bobby/BOBBY-P01-v2.png`.
- Exportado (recortado): `bobby-p01-oi.webp` em 512 e `bobby-p01-oi@2x.webp` em 1024. Expressões: `bobby-e01-alegre.webp`. Companheiros: `teo-p01-oi.webp`, e assim por diante.
- Registro: `arte/fonte/registro.tsv` com colunas id, modelo, data, proporção, seed, arquivo, nota, aprovado (sim ou não).
- Nada que sai de uso é apagado: vai para `~/_APAGAR DEPOIS (revisao)/<data>/` com log, regra da casa.

---

## 9. Ficha de aprovação (uma por imagem)

Pontue 0 (falha), 1 (aceitável), 2 (bom). Aprovada com nota total de 80% ou mais **e sem nenhum item eliminatório em 0**.

| # | Item | Eliminatório |
|---|---|---|
| 1 | Parece o personagem da folha (rosto, proporção, material) | sim |
| 2 | Marca fixa presente e do lado certo (mancha da orelha, cachecol, antena...) | sim |
| 3 | Dedos e dígitos corretos (4 por pata nos de pata, mãos descritas na ficha) | sim |
| 4 | Corpo, luz e material de verdade, sem cara de forma colada ou clipart | sim |
| 5 | Sem texto, letra, número, logo ou marca d'água | sim |
| 6 | Sem objeto que não está listado | não |
| 7 | Expressão amigável, nunca triste, brava ou assustadora | sim |
| 8 | Fundo liso conforme o bloco, sem chão e sem sombra no fundo | não |
| 9 | Contorno limpo para recorte (sem fios, sem partes translúcidas) | sim |
| 10 | Passou no teste de franja nos 4 fundos | sim |
| 11 | Silhueta legível a 96 px e distinta dos outros personagens | não |
| 12 | Luz coerente com a regra (principal em cima à esquerda, recorte à direita) | não |

**Teste da filha** (quando o personagem estiver aprovado nas notas): mostrar a folha e 3 poses e perguntar uma coisa só, sem induzir: "Isso parece de verdade? Você jogaria com ele?" Anotar a resposta literal em `RESPOSTAS.md`. Se ela disser que ainda parece colagem, voltar às seções 1 e 2 deste documento e à seção 9 do `DESIGN.md` antes de gerar mais.

---

## 10. Contagem e custo do lote completo (estimativa)

| Item | Imagens a aprovar |
|---|---|
| Bobby: folha (1, ou 3 se vier por vista), 12 poses em 13 imagens, grade de expressões (1) | 15 a 17 |
| 6 companheiros: folha mais 4 poses cada | 30 |
| **Subtotal de personagens** | **45 a 47** |

Com 4 variações por pose e tentativas de correção, espere de 3 a 4 gerações para cada imagem aprovada (**estimativa**, não medida). **O custo em crédito do Flow não foi consultado** (a interface mostra o saldo; confirmar no piloto antes de aprovar o lote). Nenhum crédito foi gasto.

## 11. Pendências para o Filipe

- **D1:** guarda-roupa por sobreposição restrita (recomendado) ou corte para cor de pelo, cor de colete e adesivos (seção 4.5).
- **D2:** aprovar os nomes e a lista de alternativas (seção 6). Busca no INPI antes de vender.
- **D3:** aprovar o elenco e as silhuetas (seção 5.0) antes do lote piloto.
- Conferir no Flow: referência de imagem, modelo, limite de prompt, proporções disponíveis (seção 0).
