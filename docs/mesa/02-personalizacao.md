# Mesa · 02 · Personalização e coleção

Especialista: personalização e coleção. Data: 24/10/2026. Branch lida: `reforma-fase-2`. Só leitura de código; nenhuma imagem gerada, nenhum crédito gasto, nenhum arquivo além deste foi gravado.

Crítica que esta mesa responde: **"entra no personagem pra editar, tá um pouco limitado"** (Filipe). Restrições que valem: arte 3D semirrealista gerada no Google Flow (Nano Banana 2.1, referência de imagem funciona, 0 créditos medidos, 1 geração por vez), direção "Cosmos futurista limpo", a filha de 8 anos rejeitou "colagem", nada de dinheiro real, nada de sorteio, ECA Digital.

---

## 0. Resumo em dez linhas

1. Hoje o editor tem 7 looks (um por vez, só a pose de frente é "inteira"), 6 companheiros comprados que só mudam o retrato e 4 poses, e um estado de coleção (`colecao`: adesivos, ornamentos, medalhas, poses, molduras, trilhas, constelação) que **já existe no `estado.js` mas nenhuma tela mostra**. O baú do dia da especificação promete adesivo, ornamento, peça de roupa, pose nova e moldura que **ainda não têm arte nem tela**. A sensação de "limitado" vem daí: pouca coisa para escolher e nada para colecionar.
2. A pesquisa diz que criança de 8 a 13 personaliza por quatro motivos: parecer consigo, experimentar um alter ego, pertencer ao grupo e "ficar mais forte"; e que ela junta muito item e usa um favorito (efeito guarda-roupa, CHI 2025). Para o Bobby isso significa: **poucas categorias bem visíveis, um look favorito sempre vestido, e coleção com história**, não um shopping.
3. O caminho de arte que não vira colagem é **híbrido**: cor do colete e da mochila por máscara no app (zero arte nova), itens pequenos e rígidos (cabeça, rosto, mão, adesivo) como **recorte ancorado** em 2 vistas, e itens que deformam o corpo (capa, mochila-foguete, traje) como **look inteiro em 4 poses-chave**.
4. Catálogo inicial de **52 itens** em 9 categorias, com raridade e origem conhecidas antes de ganhar (moeda, conquista, baú em dia marcado, marco de 30 dias, planeta completo). Nada aleatório.
5. Companheiro que cresce em **3 estágios por XP de companhia**, com reações e uma pose nova por estágio; "cuidar" é um gesto diário opcional que só soma, **nunca desconta** por ausência.
6. **Base do Bobby** (uma cena com 8 pontos de decoração) e **placa com o nome da criança** no topo do mapa, renderizada em HTML sobre arte sem texto.
7. **Álbum** com páginas por tipo, silhueta do que falta e a origem escrita embaixo ("vem no baú do dia 14").
8. UI: preview grande que troca de pose com um toque, trilho de categorias, 1 toque veste, 2 toques compram, botão "Vestir e ver no mapa", 3 looks salvos.
9. Ética: sem vitrine pública, sem ranking de itens, sem contador de tempo, sem "só hoje", sem dinheiro; "mostrar para os amigos" é um cartão que o responsável compartilha, e só isso.
10. Arte em 3 ondas: a onda 1 (cerca de 40 imagens mais um script de recolor) já tira o "limitado".

As 6 decisões que mais importam estão na seção 13.

---

## 1. O que existe hoje (lido no código)

| Onde | O que | Observação |
|---|---|---|
| `index.html:3750-3764` (`PECAS`, `LOOKS_ORDEM`, `SLOTS_LOOK`) | 3 slots (chapéu, rosto, pescoço), 7 peças com arte, 14 peças antigas sem arte ("guardadas para a arte nova"), 6 cores de pelo e 4 personagens antigos sem arte | `vestir()` zera os três slots: **um item por vez** |
| `index.html:3746-3749` (`FRONTAIS`) e `3771` (`OVERLAYS`) | âncora (x, y) por pose frontal e 3 sobreposições recortadas (boné, coroa, óculos) com escala e deslocamento | é o embrião do sistema de camadas; só vale nas 5 poses de frente e nos 8 retratos |
| `arte/RELATORIO-PRODUCAO.md`, seção 11 | ITEM-BASE mais 6 looks inteiros gerados sobre a mesma pose frontal; "a IA redesenha o urso a cada geração", não coincide pixel a pixel | é por isso que o look inteiro só existe na pose Oi e vira "colagem" se sobreposto |
| `src/interface/estado.js:54` | `colecaoVazia()`: adesivos, ornamentos, medalhas, poses, molduras, trilhas, constelacao | **nenhuma tela lê isso hoje** (busquei por `colecao` fora de estado e migração) |
| `docs/FASE-2-especificacao.md:484-500` | baú do dia promete adesivo (dias 1, 3, 8, 12...), ornamento, peça pequena (5, 19), peça maior (14), pose nova (7, 28), moldura (7, 30), peça exclusiva (30) | nada disso tem id de arte nem catálogo |
| `src/interface/economia.js` | cerca de 180 moedas por dia; companheiros 500 a 2500; looks 150 a 900 | a economia já cabe num catálogo de 50 itens se metade vier de conquista e baú, não de moeda |
| `arte/PEDIDOS-DE-ARTE.md` | pede "Comemora, Caminha e Pensa de cada look" | mesma direção desta mesa (seção 4) |
| `BIBLIA-DE-PERSONAGENS.md`, 4.5 (D1) | proposta de sobreposição restrita às poses de frente; alternativa cara de 168 imagens | esta mesa fecha a D1 com o híbrido da seção 4 |

---

## 2. Pesquisa: o que os jogos fazem

Páginas abertas nesta sessão (24/10/2026). Onde só consegui fonte secundária, está marcado.

| Jogo | O que faz que importa para o Bobby | Fonte, data |
|---|---|---|
| **Toca Boca World** (Spin Master; melhor jogo alternativo infantil, Kidscreen 2025) | Character Creator por camadas (pele, cabelo, rosto, roupa, próteses); **Outfit Designer** separado do personagem e **Wardrobe** que guarda os looks montados; Home Designer com móveis que persistem; emoções aplicadas ao personagem; grátis cria **3 personagens**, pago 30 | tocaboca.com/for-parents/toca-boca-world (lido); licenseglobal.com, Kidscreen 2025 (11/02/2025) |
| **Animal Crossing: New Horizons** | móveis recoloridos em bancada com kit; app de desenho próprio; **Nook Miles** por tarefas simples, trocados por roupa e móvel; o diretor de arte fez móvel customizável "para as ilhas ficarem diferentes e motivar visita"; 50,29 milhões vendidos (30/06/2026) | en.wikipedia.org/wiki/Animal_Crossing:_New_Horizons (lido); nintendolife.com (kits a 600 bells) |
| **Pokémon GO (Buddy Adventure)** | 4 níveis de amizade por corações (1, 70, 150, 300); corações por andar, alimentar, brincar, foto, batalha, com teto diário; humor "animado" dobra; sem punição por ausência, só o humor cai | dexerto.com, mein-mmo.de, gamepress (secundárias; a página da Niantic devolveu 404) |
| **Pokémon Let's Go** | roupa e acessório do **parceiro** (Pikachu/Eevee), combinando com o treinador; penteado por gesto; o parceiro customizado aparece em todo lugar do jogo | gamesradar.com, rpgsite.net, bulbapedia (secundárias) |
| **Club Penguin (puffles, 2005 a 2017)** | pet com energia, saúde e descanso; sem cuidado não brinca nem passeia; **fugia** se negligenciado; chapéus de puffle; iglu decorável; 200 milhões de contas (2013) | en.wikipedia.org/wiki/Club_Penguin (lido); espelho da Wikipédia 2007 para as regras do puffle (secundária) |
| **Tamagotchi** | fome, felicidade, disciplina; estágios de crescimento com dias fixos; **morre** sem cuidado; Tamagotchi ON (2019) tem loja de acessório e decoração de quarto com pontos ganhos em jogo | en.wikipedia.org/wiki/Tamagotchi (lido) |
| **Pou** (100 milhões de downloads) | cuidar, vestir, cômodos; mecânica de Tamagotchi mais leve | en.wikipedia.org/wiki/Pou_(video_game) (lido; sem detalhe de punição) |
| **Moshi Monsters** (80 milhões de contas, pico 2012) | **Moshlings** colecionáveis em conjuntos temáticos; grátis guarda 2, pago 6; quarto personalizável | en.wikipedia.org/wiki/Moshi_Monsters (lido; raridade e combinação de sementes não constam lá) |
| **Prodigy Math** | mais de 100 pets por elemento, ganham XP em batalha; **evoluir é só para assinante** (US$ 9,95/mês); roupa, móvel e "buddies" vêm de missão e festival; casa decorável; responsável escolhe recompensa no painel | prodigygame.com/blog/parents-guide-to-prodigy (26/07/2025, lido) |
| **Roblox (avatar)** | 15 partes de corpo; acessório em camadas precisa de **ponto de fixação** por parte (cabeça, tronco, cintura...) e malha de "gaiola" para deformar | create.roblox.com/docs/avatar/layered-accessories (lido via busca) |
| **Duolingo** | criador de avatar (19/07/2023) substitui a foto de perfil; "trajes de temporada" no avatar a partir de 2026; roupas do Duo na loja de gemas existiram, mas usuários relatam não achar mais | blog.duolingo.com/avatar-creator (lido); en.wikipedia.org/wiki/Duolingo (lido); relatos de fórum (fracos) |
| **Gacha Life 2** (só o editor) | slider de **qualquer cor** por peça, item girado e posicionado livremente, poses salvas, 300 slots de personagem | App Store e itch.io (descrição do fabricante) |
| **Avatar World** (Pazu) | roupa, cabelo, acessório e **casa por personagem** (quartos temáticos) | App Store (descrição do fabricante; sem crítica independente) |
| **Kahoot! Numbers by DragonBox** | números viram personagens (Nooms) que se empilham e cortam; sem guarda-roupa, a personalização é zero e o encanto vem do personagem reagir | commonsense.org, kahoot.com (vendedor) |

### 2.1 O que a pesquisa diz sobre crianças de 7 a 12

| Achado | Fonte |
|---|---|
| 48 crianças de 8 a 13 anos (mediana 10) fazem avatar para (1) se representar, (2) experimentar um alter ego, (3) se conectar socialmente e (4) "ficar mais forte"; itens pagos parecem melhorar desempenho mesmo quando não melhoram | Fu et al., *Understanding Children's Avatar Making in Social Online Games*, CHI 2025 (arXiv 2502.18705, PDF lido) |
| **Efeito guarda-roupa**: a criança acumula muitos avatares e itens e usa um favorito por meses ("I just wear this all the time", P71) | mesma fonte, seção 4.2.5 |
| Avatar padrão gratuito é lido como "novato" e vira motivo de zoação; itens grátis são "simples e sem graça" por desenho | mesma fonte, 4.2.1 |
| Recompensa por **completar coleção** ("junte todas as cores e ganha a arco-íris") é das táticas que mais fazem gastar | mesma fonte, 4.2.4 |
| Crianças preferem avatar **colorido, lúdico e fantástico**; designers devem oferecer opções "igualmente valorizadas" para não empurrar conformidade | mesma fonte, seções 5 e 6 |
| Tweens de 8 a 16 no Whyville: as peças de rosto são feitas e vendidas por outros jogadores; o estudo trata de recursos, agência e restrição na montagem do avatar | Kafai, Fields e Cook, DiGRA 2007 (só o resumo foi lido) |
| Avatar pode reforçar estereótipo de gênero, cultura e raça; evitar categoria "de menina" e "de menino" | Digital Wellness Lab, research brief sobre avatares (busca) |
| Coleção começa por volta dos 6 a 8 anos; de 7 a 11 a criança passa a olhar "vale a pena" e por volta dos 11 pesa o social | reportagem sobre pesquisa da Univ. Nebraska-Lincoln (secundária, não achei o artigo) |

### 2.2 DADO x OPINIÃO

| DADO (com fonte) | OPINIÃO minha, a medir |
|---|---|
| Criança usa um avatar favorito por meses (CHI 2025) | então 3 looks salvos bastam; mais do que isso é estoque morto |
| Avatar padrão sinaliza "novato" (CHI 2025) | dar **um item de graça no primeiro dia** (adesivo ou cor) tira esse estigma sem custo |
| Completar coleção é gatilho forte de gasto (CHI 2025) | em app sem dinheiro é seguro usar, mas com página pequena (12 casas) e prêmio modesto |
| Prodigy prende evolução do pet no paywall (guia 2025) | no Bobby a evolução é só por uso; é diferencial de confiança para o responsável |
| Puffle fugia e Tamagotchi morre por negligência (Wikipédia) | no Bobby **nada se perde** por ausência; a Capi existe para a volta, não para a culpa |
| Toca Boca separa Outfit Designer de Character Creator e guarda looks num Wardrobe | copiar a separação: "Montar look" e "Looks salvos" são coisas diferentes |
| Roblox ancora acessório por parte do corpo (docs) | tabela de âncoras por pose é a versão 2D disso e já começou em `FRONTAIS`/`OVERLAYS` |
| Pokémon GO: corações com teto diário, sem punição | 1 gesto por dia, teto baixo, sem decaimento |
| Flow redesenha o urso a cada geração (relatório de produção) | logo item que toca o corpo não pode ser sobreposição; vira look inteiro por pose |

---

## 3. Princípios para o Bobby (antes de desenhar)

1. **Poucas categorias, cada uma visível no mapa.** Se a criança não vê o item no Bobby andando, o item não existe para ela.
2. **Um favorito bem vestido vale mais do que vinte guardados.** Looks salvos: 3.
3. **Coleção com história, não loja.** Cada item diz de onde veio ("Planeta Numeral completo", "dia 14 da sequência").
4. **Tudo conhecido antes.** Preço, dia do baú, condição da conquista. Nada aleatório, nada "só hoje".
5. **Nada se perde.** Nem por ausência, nem por erro, nem por troca de aparelho (backup já existe).
6. **Sem comparação pública.** Nem ranking, nem "70% das crianças têm". Mostrar para alguém é escolha do responsável.
7. **Arte que respeita a luz da bíblia** (principal em cima à esquerda, recorte quente à direita) ou volta a parecer colagem.

---

## 4. (a) Sistema de camadas realista para o pipeline do Flow

### 4.1 Três técnicas, cada item usa uma

| Técnica | Para que item | Imagens por item | Como garante consistência |
|---|---|---|---|
| **T1 Recolor por máscara** (no app ou em script, sem Flow) | cor do colete, cor da mochila, cor do lenço base | **0** novas; 1 máscara por pose (13 máscaras, feitas uma vez) | muda matiz e saturação e preserva luz e textura (como `arte/apagar.py` já faz com cor). Testar no piloto se o laranja vira azul sem "chapado" |
| **T2 Recorte ancorado** (objeto isolado gerado no Flow, fundo liso, sem personagem) | cabeça (boné, gorro, tiara), rosto (óculos, viseira), mão (lanterna, lupa, bandeira), adesivo de colete, moldura | **2** por item (vista de frente e 3/4 direita); moldura e adesivo 1 | mesmo bloco ESTILO_OBJ, mesma luz, mesmo fundo; a âncora por pose faz a escala e o giro |
| **T3 Look inteiro por pose** (edição da pose base no Flow com referência) | o que toca ou deforma o corpo: capa, capacete, mochila-foguete, traje de astronauta, colete de gala | **4** por item (poses-chave) | prompt de edição "keep everything identical, add only X", referência = pose base aprovada + o look na pose Oi já aprovada |

**Poses-chave do look (as 4 que a criança mais vê):** P01 Oi (editor, bilhete), P02 Comemora (fim de fase, baú), P03 Pensa (dica) e P05A Caminha (mapa). O retrato do botão fixo usa E01 com T2 ou o recorte de cabeça do look P01 (T3). Nas outras 8 poses o Bobby mostra **cor do colete (T1) e adesivo (T2 só se a pose tiver âncora de peito)**; o item grande some com aviso curto no editor ("A capa aparece em Oi, Festa, Pensa e Anda"). O app já faz esse aviso para o chapéu (`palcoHTML`, "O chapéu aparece nas imagens de frente").

### 4.2 Tabela de âncoras (o coração do T2)

Um arquivo `assets/ancoras.json` (proposta; hoje é `FRONTAIS` e `OVERLAYS` dentro do `index.html`), uma entrada por pose, coordenadas em fração da largura e da altura da imagem, mais escala relativa à largura da cabeça e giro em graus:

```
"bobby-p01": {
  "vista": "3/4d",                      // frente | 3/4d | 3/4e | lado | costas
  "cabeca":  {"x":0.45,"y":0.30,"w":0.52,"rot":-6},   // topo da cabeça: boné, gorro, tiara
  "olhos":   {"x":0.46,"y":0.40,"w":0.44,"rot":-6},   // óculos, viseira
  "pescoco": {"x":0.47,"y":0.56,"w":0.40,"rot":0},    // lenço curto, colar, concha
  "peito":   {"x":0.49,"y":0.64,"w":0.14,"rot":0},    // adesivo do colete
  "mao_d":   {"x":0.70,"y":0.52,"w":0.18,"rot":20},   // item de mão (a que acena)
  "costas":  null                                      // não visível nesta vista
}
```

- Cada item T2 declara `vistas: {"frente": "ov-bone-f", "3/4d": "ov-bone-q"}` e um `slot`. Se a pose tem a vista e o slot não é `null`, desenha; senão, não desenha. Sem exceção escondida no código.
- **Como medir as âncoras sem sofrer:** uma página de desenvolvimento (`docs/anexos/teste-piloto.html` já existe como modelo) com a pose ao fundo, o recorte arrastável e campos numéricos; "copiar JSON" ao final. Meia hora por pose. A regra 8 da bíblia (nunca espelhar) continua: por isso 2 vistas geradas, não 1 espelhada.
- **Ordem de desenho:** costas (atrás do corpo, só em vistas de costas), corpo, pescoço, peito, rosto, cabeça, mão. Mão vem por cima de tudo porque a pata acena na frente.
- **Teste de colagem** (aceite): o item T2 montado sobre a pose, a 2x, deve passar na ficha da bíblia item 4 ("sem cara de forma colada") julgada por quem não montou. Se falhar em 2 itens seguidos, o slot inteiro passa a T3.

### 4.3 Como gerar no Flow mantendo consistência

- **T2 (objeto):** bloco `ESTILO_OBJ` (o relatório criou na rodada 3: objetos sem rosto, sem olhos) + `FUNDO-OBJETO` + `NEG` + "no face, no eyes, no mouth". Referência de imagem: o **ITEM-CHAPEU aprovado** (para luz e material) e, para a vista 3/4, a própria vista frontal recém-aprovada. Pedir "seen straight from the front, floating alone, exactly centered" e depois "same object, rotated 30 degrees to the viewer's right, same lighting".
- **T3 (look por pose):** abrir a **pose base aprovada** (ex.: BOBBY-P02) como referência 1 e o **look na pose Oi** (ex.: ITEM-CAPA) como referência 2; prompt de edição curto: "Keep everything identical to reference 1 (pose, framing, fur, face, vest, backpack, lighting, background). Add only the blue royal cape with the star brooch exactly as in reference 2, following the body's motion." Aceitar com a ficha da seção 9 da bíblia e **medir correlação de bordas** contra a pose base com `arte/corr.py`: abaixo de 0,6 o enquadramento mudou, regenerar. O relatório mediu 0,33 a 0,53 em edições de cenário que mudaram enquadramento; é o alarme certo.
- **T1 (recolor):** a máscara do colete sai do recorte alfa mais segmentação por cor (o laranja `--cor-acao` só existe no colete); salvar `mascara-colete-p01.png` etc. Recolorir em HSL mantendo L e S do original. Zero Flow.

### 4.4 Alternativa, se o Filipe preferir só uma técnica

"Looks inteiros por pose para tudo" (T3 para 100%) custa 4 imagens por item: 52 itens x 4 = 208 gerações mínimas, e nada de combinar boné com capa. Não recomendo; mas se o teste de colagem do T2 falhar em massa, é o plano B e o catálogo cai para 25 itens.

---

## 5. (b) Catálogo inicial: 52 itens

Raridade em palavras que criança entende: **Comum**, **Raro**, **Muito raro**, **Único**. Origem sempre visível no álbum. Técnica de arte da seção 4. Preços seguem a escala atual (150 a 900 por look; cerca de 180 moedas por dia).

### 5.1 Cabeça (T2, 2 vistas cada; os 5 primeiros já existem)

| # | Item | Raridade | Origem |
|---|---|---|---|
| 1 | Chapéu de explorador | Comum | 150 moedas (existe) |
| 2 | Boné | Comum | 200 moedas (existe) |
| 3 | Capacete aberto | Raro | 450 moedas (existe; vira T3) |
| 4 | Coroa de papel | Raro | 900 moedas (existe) |
| 5 | Gorro de lã com pompom | Comum | baú dia 5 ("peça pequena") |
| 6 | Tiara de estrelas | Raro | conquista "Sem errar" (8 seguidos) |
| 7 | Fones de astronauta | Raro | planeta Horizonte 50% |
| 8 | Chapéu de mago do Numeral | Muito raro | **planeta Numeral completo** |

### 5.2 Rosto (T2)

| # | Item | Raridade | Origem |
|---|---|---|---|
| 9 | Óculos de astronauta | Comum | 250 moedas (existe) |
| 10 | Óculos redondos de leitura | Comum | baú dia 19 |
| 11 | Viseira azul de piloto | Raro | 400 moedas |
| 12 | Pintura de estrela na bochecha | Raro | conquista "Uma semana" |

### 5.3 Pescoço (T2 curto; capa é T3)

| # | Item | Raridade | Origem |
|---|---|---|---|
| 13 | Lenço verde-azulado | Comum | 300 moedas (existe; vira T1 recolorível) |
| 14 | Capa azul real | Raro | 600 moedas (existe; T3) |
| 15 | Colar de concha (presente do Otto) | Raro | Otto no estágio 2 |
| 16 | Cachecol de tricô vermelho | Comum | baú dia 14 ("peça maior") |

### 5.4 Costas (T3, 4 poses; a mochila é a marca fixa, então os itens trocam a mochila, não somam)

| # | Item | Raridade | Origem |
|---|---|---|---|
| 17 | Mochila-foguete | Muito raro | 900 moedas |
| 18 | Mochila de lona azul-noite | Comum | 350 moedas |
| 19 | Asinhas de dragão de pano (presente da Brisa) | Muito raro | Brisa no estágio 3 |
| 20 | Mochila-constelação | Único | **marco de 30 dias** ("peça exclusiva") |

### 5.5 Mão (T2, 2 vistas; aparece em Oi, Aponta, Caminha)

| # | Item | Raridade | Origem |
|---|---|---|---|
| 21 | Lanterna de explorador | Comum | 200 moedas |
| 22 | Lupa de latão | Comum | baú dia 25 |
| 23 | Bandeirinha do planeta | Raro | primeira fase de cada planeta (3 cores) |
| 24 | Livro de capa violeta (presente da Rufa) | Raro | Rufa no estágio 2 |

### 5.6 Cor do colete e da mochila (T1, recolor; 0 imagens)

| # | Item | Raridade | Origem |
|---|---|---|---|
| 25 a 30 | Colete: tangerina (base), azul-cobalto, verde-floresta, violeta, amarelo-sol, vermelho-cereja | Comum | 1ª cor **de graça no primeiro dia**; demais 100 moedas |
| 31 a 33 | Mochila: marrom (base), cinza-grafite, azul-noite | Comum | 100 moedas |

Observação: cores por nome e por token, nunca hex no documento; a paleta de recolor entra como `--look-colete-*` no `:root` do `DESIGN.md` quando for implementado.

### 5.7 Adesivo no colete (T2, 1 imagem cada, redondo, 192 px)

| # | Item | Raridade | Origem |
|---|---|---|---|
| 34 | Estrela cadente | Comum | de graça no dia 1 ("Primeira visita") |
| 35 | Foguete | Comum | baú dia 8 |
| 36 | Número 10 dourado | Raro | conquista "Sem errar" |
| 37 | Pena da Rufa | Raro | planeta Fábula 50% |
| 38 | Engrenagem do Teo | Raro | planeta Numeral 50% |
| 39 | Concha do Otto | Raro | planeta Horizonte 50% |
| 40 | Constelação do mês | Único | marco de 30 dias (e 40, 50...) |

### 5.8 Moldura de retrato (T2, 1 imagem, anel transparente ao redor do E01)

| # | Item | Raridade | Origem |
|---|---|---|---|
| 41 | Anel de latão | Comum | baú dia 7 |
| 42 | Anel de Saturno | Raro | conquista "Explorador" (5 fases) |
| 43 | Anel de folhas (da Capi) | Raro | primeira volta depois de 3 dias (Kit de volta) |
| 44 | Anel dourado | Único | marco de 30 dias |

### 5.9 Pose favorita (arte já existe; o item é o direito de usar a pose no retrato e na abertura)

| # | Item | Raridade | Origem |
|---|---|---|---|
| 45 | Oi (padrão), Alegre | Comum | de início |
| 46 | Comemora | Comum | primeira fase com 3 estrelas |
| 47 | Pensa | Comum | primeira dica usada |
| 48 | Joinha | Raro | baú dia 7 ("pose nova") |
| 49 | Presente | Raro | baú dia 28 ("pose nova") |
| 50 | Descansa | Raro | primeiro congelador usado |
| 51 | Lê | Raro | planeta Fábula 50% |
| 52 | Conta | Raro | planeta Numeral 50% |

**Contagem de origem:** 19 por moeda, 15 por conquista ou planeta, 11 por baú em dia marcado, 4 por marco de 30 dias, 3 por companheiro em estágio, 2 de graça no dia 1 (mais a cor base). Mais da metade **não passa pela loja**, de propósito: coleção com história.

---

## 6. (c) Companheiro que cresce

### 6.1 Estágios por XP de companhia

`xpComp[id]` soma **só quando o companheiro está chamado**: +1 por pergunta respondida (certa ou errada), +5 por fase concluída, +10 quando a criança toca nele no editor ou no mapa (teto de 1 toque por dia que pontua). Nunca diminui.

| Estágio | XP (OPINIÃO, calibrar com `testes/economia.js`) | O que muda |
|---|---|---|
| 1 Recém-chegado | 0 | 4 poses atuais; reage a acerto e a fim de fase |
| 2 Amigo | 300 (cerca de 2 semanas de uso) | ganha **1 pose nova** (ex.: Otto "navega", Teo "mostra o cubo") e um **acessório fixo** (lenço, insígnia) desenhado como T2 sobre o companheiro; dá à criança o item "presente de amigo" (seções 5.3 e 5.5); fala nova no bilhete |
| 3 Parceiro de aventura | 1000 (cerca de 6 semanas) | **1 pose nova** (comemora junto com o Bobby na mesma imagem, T3) e aura de interface (`--cor-ouro`, efeito do app); aparece na tela "Por hoje chega" junto do Bobby |

Arte: 6 companheiros x (2 poses novas + 1 acessório T2) = **18 imagens**. Sem gerar "versão adulta" de cada um (seria 6 x 3 estágios x 4 poses = 72).

### 6.2 Reações (sem arte nova; mapeiam poses existentes)

| Momento | Reação |
|---|---|
| acerto em sequência de 3 | pose "comemora" curta, fala do companheiro |
| "ainda não" | pose "incentiva" (nunca triste) |
| volta depois de 3 dias | pose "oi" e frase de volta sem culpa ("Que bom te ver! Guardei um adesivo.") |
| ofensiva descansando | Capi aparece mesmo se não for a chamada |
| toque no companheiro (editor ou mapa) | pose "comemora" por 1 s, +10 XP de companhia (1 por dia) |

### 6.3 Cuidar, sem punição

- Um gesto diário opcional: **"Dar um oi"** (toque). Gera reação e XP. Não há fome, energia nem humor que caia.
- Ausência de 30 dias: o companheiro está **igual**; o bilhete da volta é dele.
- Nada de "seu amigo sentiu sua falta" como cobrança. A frase é sempre sobre o reencontro.
- O responsável pode desligar a animação de reação (acessibilidade e foco), como já desliga música.

---

## 7. (d) A casinha e o planeta decoráveis

### 7.1 Base do Bobby (onda 3)

Uma cena nova, "Base do Bobby" (cenário sem personagem, mesma direção dos 30 cenários), com **8 pontos de decoração** em JSON (`x, y, w, camada`): placa da porta, bandeira, telescópio, mural, estante, luminária, planta, cantinho do companheiro. Cada ornamento é um recorte T2 (1 imagem). Catálogo inicial de 10 ornamentos: 6 já prometidos pelo baú ("ornamento de colorir" vira "ornamento da base", ou mantém o carimbo de desenho, decisão D5), 3 de planeta completo (telescópio do Numeral, mural de contos da Fábula, barquinho do Horizonte), 1 do marco de 30 dias.

A **placa da porta** tem o apelido da criança **renderizado em HTML** sobre a arte da placa vazia (a IA não escreve texto; o apelido já existe em `S.nome`, fica local, sem dado pessoal novo). O mural mostra os adesivos do álbum.

A Base é tela de "Perfil" renovada: entrar nela é ver o Bobby (pose Descansa ou Oi, vestido) e o companheiro dentro da cena. Não exige nada; não gera meta.

### 7.2 Planeta

- **Placa com o nome no topo do mapa**: "Planeta Numeral de [apelido]", HTML, sem arte.
- **Marcador de etapa completa**: bandeirinha (item 23) fincada no nó concluído, recorte único por planeta.
- **Trilha de brilho** (já prometida no baú dia 21): efeito CSS no caminho, sem imagem.
- Fora de escopo por ora: mover prédios no planeta (não há benefício pedagógico e multiplica cenário).

---

## 8. (e) Álbum de coleção

Usa `S.colecao` como está (adesivos, ornamentos, medalhas, poses, molduras, trilhas, constelacao) e soma `looks` (que hoje vivem em `S.comprado`).

**Páginas:** Adesivos (12 casas por planeta, mais a Constelação do mês), Medalhas (marcos), Looks (por categoria), Poses, Molduras, Ornamentos, Companheiros (com estágio e XP).

**Regras de página:**
- Item que falta aparece em **silhueta** com a origem escrita embaixo: "Vem no baú do dia 14", "Complete o planeta Numeral", "Teo no estágio Amigo". Nunca "???".
- Raridade por borda (token: comum `--cor-linha`, raro `--cor-foco`, muito raro `--cor-acao`, único `--cor-ouro`) e palavra; nunca só cor (acessibilidade).
- **Página completa** dá um prêmio modesto e único (moldura ou adesivo), anunciado desde o começo da página. É o único uso da mecânica de "complete a coleção" (seção 2.2) e sem dinheiro no meio.
- Item novo ganho fora do editor entra com um selo "novo" que some quando visto. Sem contador vermelho persistente.
- **Mostrar para os amigos:** botão "Cartão do meu personagem" gera uma imagem local (Bobby vestido, companheiro, 3 adesivos favoritos, apelido) e abre a folha de compartilhar do aparelho **só na área do responsável** (PIN). Não existe feed, galeria pública nem contagem de curtidas no app. Na Liga da Família (só convidados) o cartão pode aparecer para os convidados, decisão D6.

---

## 9. (f) Fluxo de UI do editor

Entrada: botão fixo "Personagem" (retrato) e "Meu personagem" no Perfil, como hoje.

```
┌──────────────────────────────────────────────┐
│ ‹ Voltar        Meu personagem      Álbum ▢  │
├──────────────────────────────────────────────┤
│                                              │
│          [ PREVIEW GRANDE: Bobby vestido ]   │  toque no Bobby = próxima pose-chave
│          [ companheiro pequeno ao lado   ]   │  (Oi › Festa › Pensa › Anda)
│                                              │
│   ● ○ ○ ○   "Oi"          ♥ Teo · Amigo     │  pontos da pose · estágio do companheiro
├──────────────────────────────────────────────┤
│ Looks salvos:  [1 ★] [2] [3]   Guardar look  │  3 slots; ★ = em uso
├──────────────────────────────────────────────┤
│ ‹ Cabeça  Rosto  Pescoço  Costas  Mão  Cores │  trilho horizontal de categorias
│   Adesivo  Moldura  Pose  Companheiro ›      │  (rola; 1 toque troca)
├──────────────────────────────────────────────┤
│ ┌──────┐ ┌──────┐ ┌──────┐                   │
│ │ sem  │ │ boné │ │gorro │  ...              │  grade 3 colunas, 96 px de imagem
│ │ item │ │em uso│ │  ◔   │                   │  ◔ = 450 moedas · 🔒 = "Planeta Numeral"
│ └──────┘ └──────┘ └──────┘                   │
│                                              │
│ Saldo: ◔ 340                                 │
├──────────────────────────────────────────────┤
│        [ Vestir e ver no mapa ]              │  fecha o editor; Bobby entra no mapa
└──────────────────────────────────────────────┘
```

**Regras de toque:**
- Item que já é seu: **1 toque veste** (preview atualiza com animação `entra` de 200 ms). Tocar de novo tira.
- Item à venda: 1 toque mostra no preview **em experimentação** (marca d'água "experimentando", igual Toca Boca deixa provar) e o botão "Levar por 450"; 2º toque confirma. Mesmo fluxo de confirmação que `pedirCompraCompanheiro` já usa.
- Item trancado por conquista: 1 toque mostra no preview e a frase da origem ("Complete o planeta Numeral"). Sem botão de comprar. **Nunca** "compre para destravar".
- Categoria "Cores": seletor de 6 bolinhas; a cor muda na hora (T1 no cliente).
- "Guardar look": salva os 10 slots atuais num dos 3; nomear com 1 de 8 nomes prontos (sem teclado livre).
- "Vestir e ver no mapa": fecha, rola o mapa até o Bobby e toca a animação de Caminha com o look. É a recompensa do editor: ver no lugar onde se joga.
- Avisos curtos e só quando vale: "A capa aparece em Oi, Festa, Pensa e Anda".
- Mobile em 390 px: preview ocupa 45% da altura; trilho e grade rolam; o botão final é fixo. Desktop: preview à esquerda, grade à direita.

Estado novo (proposta): `S.look` deixa de ter um item só e passa a `{cabeca, rosto, pescoco, costas, mao, corColete, corMochila, adesivo, moldura, pose, companheiro}`; `S.looksSalvos[3]`; `S.xpComp{}`; `S.colecao.looks[]`. Migração: `chapeu|rosto|pescoco` atuais caem no slot correspondente; `pelo` antigo vira `corColete` equivalente ou crédito em moedas (decisão D4). Tudo validado em `normaliza*` como já se faz.

---

## 10. (g) Ética

| Risco | Regra no Bobby |
|---|---|
| Comparação social e pressão de grupo (CHI 2025, Digital Wellness Lab) | sem feed, sem ranking de itens, sem "X crianças têm"; cartão só pelo responsável |
| Estereótipo de gênero | nenhuma categoria "menina/menino"; toda cor e item para qualquer perfil; nomes neutros |
| Urgência e escassez | sem "só hoje", sem cronômetro, sem edição limitada; "Único" é por marco, e o marco volta a cada 10 dias |
| Sorteio (ANPD, Decreto 12.880 art. 20) | baú sem sorteio, origem de todo item escrita antes |
| Dinheiro (ECA Digital) | moeda só do jogo; nenhuma tela do editor liga a pagamento; nada em `index.html` muda nisso |
| Recompensa por tempo de uso (art. 9º III) | XP de companhia conta **ações**, não minutos |
| Culpa por ausência | companheiro e coleção nunca regridem; frases de volta sem cobrança |
| Dado pessoal | apelido já local; o cartão compartilhado não leva nome completo nem data; sem foto |
| "Pay to look strong" (CHI 2025, 4.1.3) | nenhum item muda dificuldade, dica ou moeda; texto do item não insinua vantagem |

---

## 11. Prompts de exemplo para 5 itens no Flow

Blocos da bíblia (seção 1) e do relatório (A10: `ESTILO_OBJ`). Em inglês, prontos para colar. Nada foi gerado.

**P-ITEM-1 · Óculos de piloto (rosto, T2, vista de frente)** · fundo `FUNDO-OBJETO`, proporção 1:1, referência: ITEM-CHAPEU aprovado (luz e material)
```
ESTILO_OBJ + A single pair of aviator goggles sized for a bear cub's head, brushed brass frame, opaque sky-blue tinted lenses with a soft reflection (not transparent, no see-through), a short dark-brown leather strap, seen straight from the front, floating alone with no head and no character, exactly centered, lit the same way as the character renders (key light from the upper left, warm rim light on the right). + FUNDO-OBJETO + NEG + no face, no eyes, no mouth, no text.
```
Vista 3/4 (segunda imagem, referência = a frontal aprovada): `Same goggles as the reference, identical materials and colors, rotated about 30 degrees toward the viewer's right, same lighting and background.`

**P-ITEM-2 · Mochila-foguete (costas, T3, pose Comemora)** · proporção 3:4, referência 1: BOBBY-P02 aprovada; referência 2: ITEM-BASE
```
Keep everything identical to reference 1: the same bear cub, pose, framing, fur, face, tangerine vest, lighting and flat mid-gray background. Replace only the round brown canvas backpack with a small rounded rocket-shaped backpack in brushed pearl-white metal with two slate-blue fins and a tangerine nose cone, two brown straps, no flames, no smoke, no glow. Nothing else changes. + NEG
```
Aceite: ficha da bíblia e `arte/corr.py` acima de 0,6 contra BOBBY-P02.

**P-ITEM-3 · Adesivo "estrela cadente" (colete, T2, 1 imagem)** · 1:1
```
ESTILO_OBJ + A single round sticker, flat circular badge with a thin cream border, showing a small golden shooting star with a short cream trail on a deep night-blue field, matte vinyl material with a soft specular highlight, seen straight from the front, floating alone, exactly centered. + FUNDO-OBJETO + NEG + no face, no text, no letters, no numbers.
```

**P-ITEM-4 · Lanterna de explorador (mão, T2, 2 vistas)** · 1:1
```
ESTILO_OBJ + A small handheld explorer flashlight sized for a bear cub's paw, brushed brass body with a tangerine rubber grip ring, an opaque milky cream lens (switched off, no light beam, no glow), seen from the side with the lens pointing to the viewer's left, floating alone, exactly centered. + FUNDO-OBJETO + NEG + no hand, no character.
```

**P-ITEM-5 · Moldura "anel de Saturno" (retrato, T2, 1 imagem com furo)** · 1:1
```
ESTILO_OBJ + A circular portrait frame shaped like a planet ring: a thin tilted ring of pale sand-colored stone and brushed brass around a perfectly empty circular center, the center must be the flat background color with nothing inside, seen straight from the front, exactly centered, the ring occupying about 85 percent of the frame width. + FUNDO-OBJETO + NEG + no planet, no character, no text.
```
Recorte: remover fundo fora e dentro do anel; o E01 fica por baixo no app.

**Prompt extra, T1 (não é do Flow):** script Python com Pillow: máscara = alfa do recorte E pixels com matiz entre o laranja do colete ±12°; aplicar deslocamento de matiz para o alvo e manter luminosidade; salvar `bobby-p01-colete-azul.webp`? Não: **recolorir no cliente** com `canvas` e a máscara, para 6 cores não virarem 6 x 13 arquivos. Medir tempo de recolor no celular no piloto.

---

## 12. Lista de arte por onda

| Onda | O que | Imagens novas | Resultado para a criança |
|---|---|---|---|
| **1 · tira o "limitado"** | máscaras de colete e mochila (13, locais, sem Flow); 7 looks existentes em P02, P03 e P05A (T3: 7 x 3 = 21); 2ª vista (3/4) de boné, coroa e óculos (3); 6 adesivos (34 a 39); 4 molduras; gorro e óculos de leitura em 2 vistas (4); placa da porta vazia e bandeirinha (2) | **cerca de 40** no Flow mais 13 máscaras | cores na hora, look que anda no mapa, adesivo, moldura, baú entregando o que promete |
| **2 · coleção e companheiro** | itens de mão (21, 22) e cabeça (6, 7) em 2 vistas (8); viseira, cachecol, mochila azul-noite (T3, 4 cada = 12... cachecol curto é T2: 2) ; mochila-foguete e constelação (T3, 8); companheiros: 2 poses novas + 1 acessório x 6 (18); chapéu de mago e asinhas (T3, 8) | **cerca de 60** | álbum com páginas que fecham, companheiro que muda |
| **3 · base e planeta** | cenário Base do Bobby (1 completo); 10 ornamentos (10); capacete e capa em T3 (já estão na onda 1); extras por marco de 40, 50, 60 dias (3 adesivos) | **cerca de 15** | casa para visitar, planeta com nome |

Total: cerca de 115 gerações aprovadas, contra 1,0 a 1,1 geração por aprovada medida no relatório. Com o Flow a 0 crédito, o custo é tempo (uma geração por vez).

---

## 13. O que pede o Filipe (decisões)

| # | Decisão | Minha recomendação |
|---|---|---|
| **D1** | Técnica de arte: híbrido T1 + T2 + T3 (seção 4) ou só looks inteiros (4.4)? | híbrido; fechar depois do teste de colagem dos 3 overlays em 3/4 |
| **D2** | Poses-chave do look: Oi, Comemora, Pensa, Caminha (4) ou também Aponta e Tchau (6)? | 4; cada pose a mais custa 1 imagem por item T3 |
| **D3** | Tamanho do catálogo da onda 1: os 52 da seção 5 em 3 ondas, ou cortar para 30? | 52 em 3 ondas; a onda 1 sozinha já entrega 25 itens visíveis |
| **D4** | Peças antigas sem arte (14 looks, 6 pelos, 4 personagens, já pagas por quem jogou): converter em moedas de volta, em cor de colete equivalente, ou manter "guardadas"? | devolver em moedas (1:1 do preço) com bilhete do Bobby; cor de pelo não volta (a bíblia fixou o pelo caramelo) |
| **D5** | "Ornamento de colorir" do baú: carimbo para o desenho (como está na especificação) ou ornamento da Base do Bobby? | Base do Bobby; o desenho já tem a arte própria e a Base dá lugar para ver |
| **D6** | "Mostrar para os amigos": só cartão pelo responsável, ou cartão também visível aos convidados da Liga da Família? | só pelo responsável na onda 1; Liga depois de medir uso |

Também precisa da mão dele: (1) **teste com a filha** antes de qualquer arte nova: mostrar a tela atual e 3 esboços do editor novo (preview grande, trilho, "vestir e ver no mapa") e perguntar uma coisa só, "o que você vestiria primeiro?", anotar literal; (2) aprovar nomes dos itens; (3) confirmar com o advogado que o "prêmio por página completa do álbum" (seção 8) é recompensa por ação, não sorteio; (4) ok para a onda 1 de geração (0 crédito medido, mas é regra da casa pedir).

---

## 14. O que ficou de fora e o que não verifiquei

- Não abri a página oficial da Niantic (404) nem a wiki do Club Penguin e do Duolingo (402); nesses três, as regras citadas são de fontes secundárias e estão marcadas.
- Não achei estudo acadêmico específico sobre coleção em crianças de 7 a 12; o que há é secundário (seção 2.1).
- Não medi se o recolor por máscara mantém a textura do pelo e do tecido no celular; é o primeiro teste da onda 1.
- Não editei código, não gerei imagem, não gravei nada fora deste arquivo. Este documento **não passou por revisor independente** (regra 9 da casa); quem conduz a mesa decide quando rodar o `revisor-de-entrega`.
- Nada no cofre foi registrado por mim; sugiro à sessão principal gravar a decisão do híbrido T1/T2/T3 em `02-Decisoes/` e o padrão "tabela de âncoras por pose" em `01-Padroes/` quando o Filipe aprovar.

## 15. Fontes abertas nesta sessão

- Fu, Y. et al. *Understanding Children's Avatar Making in Social Online Games*. CHI 2025. arxiv.org/abs/2502.18705 (v2, 11/03/2025). PDF lido.
- Kafai, Fields, Cook. *Your Second Selves*. DiGRA 2007. digitalcommons.usu.edu/itls_facpub/213 (resumo).
- tocaboca.com/for-parents/toca-boca-world (guia para pais, lido em 24/10/2026).
- prodigygame.com/blog/parents-guide-to-prodigy (26/07/2025).
- en.wikipedia.org: Animal_Crossing:_New_Horizons, Club_Penguin, Tamagotchi, Pou_(video_game), Moshi_Monsters, Duolingo (lidos em 24/10/2026).
- blog.duolingo.com/avatar-creator (19/07/2023).
- create.roblox.com/docs/avatar/layered-accessories.
- licenseglobal.com, "Kidscreen Announces 2025 Awards Winners" (11/02/2025).
- Secundárias: dexerto.com e mein-mmo.de (Buddy Adventure); gamesradar.com e rpgsite.net (Let's Go); espelho Wikipédia 2007 (puffles); App Store (Gacha Life 2, Avatar World); commonsense.org (Kahoot! Numbers); reportagem sobre pesquisa de coleção da Univ. Nebraska-Lincoln.
