# Mesa 01 · Economia de jogo do Universo de Bobby

Especialista: economia de jogo. Data: 24/10/2026. Branch lida: `reforma-fase-2` (só leitura; nenhum código alterado).
Simulação: `docs/mesa/economia-sim.py` (rodar `python3 docs/mesa/economia-sim.py`; não depende do app).

Pergunta do Filipe: "não adianta a criança ganhar um monte de créditos e comprar tudo no início e depois não ter o que fazer com eles".
Resposta curta: hoje isso acontece de verdade. A criança média zera a loja no dia 75 e chega ao dia 180 com 16.450 moedas paradas; a forte zera no dia 32 e acumula 55.000. O conserto não é dar menos moeda (moeda é o feedback do acerto) e sim abrir sumidouros em camadas, com portão por conquista, um cofrinho de meta e dois ralos sem teto. Com isso a média chega ao dia 180 com 431 moedas sobrando e 44 itens ainda por conquistar.

Legenda usada em todo o documento: **[DADO]** saiu do código, do cofre ou de fonte aberta e citada; **[MEDIDO]** saiu da simulação deste documento; **[OPINIÃO]** é proposta minha, a calibrar com as primeiras famílias.

---

## 0. Estado atual (lido no código)

| O quê | Valor | Onde |
|---|---|---|
| Ganho por acerto | 10 moedas | `src/interface/economia.js:6` |
| Bônus de sequência | +5 a cada 3 acertos seguidos | idem |
| Fase perfeita (8 de 8) | +20 | idem |
| Meta diária padrão | 20 perguntas (5 min) em blocos de 8, 8 e 4 | idem; `testes/economia.js` |
| Baú do dia | 10 a 20 moedas em 7 dos 30 primeiros dias; resto é adesivo, peça, medalha | `docs/FASE-2-especificacao.md` §5.4 |
| Companheiros | Teo 500, Rufa 900, Otto 1.000, Capi 1.500, Brisa 2.000, Fagulha 2.500 (soma 8.400) | `economia.js:9` |
| Looks | explorador 150, boné 200, óculos 250, lenço 300, capacete 450, capa 600, coroa 900 (soma 2.850) | `economia.js:10` |
| Total comprável | **11.250 moedas, 13 itens** | |
| Ganho calibrado | ~180 por dia de jogo (criança média, 80% de acerto) | comentário em `economia.js:4`; o teste `testes/economia.js` confere prazos de 3, 5 e 10 a 14 dias para os companheiros |
| Outro gasto | "continuar por 50 moedas" após perder corações | FASE-2 §5.7, marcado para revisar com advogado |
| Arte pronta | 6 companheiros x 4 poses + sheet; 7 looks; 12 poses do Bobby; 10 ícones de recompensa (baú, medalha, moeda, estrela, troféu, pergaminho, presente, congelador, bilhete); 60 cenários (30 etapas x 2 estados); 30 desenhos; 3 overlays de item (boné, coroa, óculos) | `assets/`, `assets/manifesto.json` |

Leitura: a loja foi calibrada para os **14 primeiros dias** (comentário do próprio código) e nunca para 180. O teste de economia confirma só os prazos curtos. Ninguém mediu o que acontece depois do dia 14, e é exatamente aí que a crítica do Filipe acerta.

---

## 1. Pesquisa: como os outros estruturam economia de longo prazo

Método: abri cada página (curl ou WebFetch) em 24/10/2026. O que não abriu **não entrou**: central de ajuda da Duolingo (redireciona para página genérica), post "streak-freeze" do blog da Duolingo (404), artigo de moedas da Prodigy (404), documentação de Limiteds da Roblox (bloqueada), página oficial do Khan Kids (desafio de JavaScript), página de Obeliscos da Stardew (503). Para Roblox, portanto, não há linha abaixo: não consegui ler a fonte primária e não vou citar de memória.

### 1.1 Tabela DADO (fonte) x OPINIÃO (o que levo para o Bobby)

| Jogo | DADO (com fonte e data de acesso 24/10/2026) | OPINIÃO: o que aproveitar ou evitar no Bobby |
|---|---|---|
| **Duolingo** | Blog oficial "How to keep your streak on vacation" (18/04/2023): a versão grátis guarda no máximo **2 Streak Freezes**; Timer Boost custa **450 gemas**; vende pacotes de 1.200, 3.000 e 6.500 gemas por dinheiro. Wiki Duolingo (fandom, página Shop): Streak Freeze **200 gemas**, recarga de corações **350** (450 dentro da lição), Streak Shield 7 dias **3.000**; roupas do Duo eram **400 (Formal), 600 (Tracksuit), 1.000 (Super Duo)** e hoje constam como **descontinuadas**; na conversão de lingots para gemas, acima de ~1.000 lingots o câmbio piorava "para evitar um problema tipo inflação" (afirmação da wiki, não oficial). Crítica em uxdesign.cc ("Duolingo's economy is broken"): lingots não tinham em que ser gastos além de power-ups. | A Duolingo resolveu o excesso de moeda vendendo **utilidade** (corações, tempo, proteção de ofensiva), não cosmético. Para o Bobby isso é o caminho **errado**: pagar para continuar depois do erro e pagar para proteger ofensiva ferem a regra "sem culpa" e o Decreto 12.880 art. 10 §ún. II (pressão emocional). Aproveitar só: teto de 2 congeladores (já na spec) e a lição de que **cosmético sem renovação morre** (as roupas do Duo sumiram). |
| **Prodigy Math** | Guia oficial para pais (26/07/2025): a criança sobe de nível, há "quests, tarefas e **festivais sazonais** o ano todo", com prêmios de "roupas, **móveis para a casa virtual** e buddies"; assinatura Core libera **evoluir pets** e itens só de membro; Ultra dá **1 pet e 1 item exclusivo por temporada**. Resenhas de crianças no Common Sense Media (via busca): "pay-to-win", pets e conteúdo básico atrás de assinatura; uma mãe relata que o filho "coletou quase todos os pets em 18 a 24 meses e o jogo não teve conteúdo novo desde então". | Prodigy prova que **pet que evolui + casa para decorar + temporada** segura 1 a 2 anos. Também prova o teto: quando a coleção acaba e não há temporada nova, a criança sai. Levar a evolução do companheiro e a casa; **nunca** travar isso atrás de pagamento (ECA Digital). |
| **Khan Academy Kids** | Common Sense Media (resenha): "depois de completar atividades, as crianças **escolhem um prêmio** para a coleção dos amigos animais"; App Store: "100% grátis, sem anúncios nem assinaturas". | Modelo sem moeda: a recompensa é **escolha** entre itens, não saldo. Para a faixa 7 a 12 do Bobby a moeda ainda faz sentido (é mais velha que o público do Khan Kids, de 2 a 8), mas o baú do Bobby pode copiar a **escolha entre 2 ou 3 itens** em vez de item fixo: elimina de vez qualquer cheiro de sorteio. |
| **Toca Boca World** | Site oficial: "mais de 90 locais, 500 personagens, Criador de Personagens, Home Designer e **presentes para coletar toda sexta-feira**". Listagens de loja (via busca): "Gift Bonanzas" anuais relançam presentes antigos; presentes incluem decoração, móveis e pets. | Ritmo semanal fixo (sexta) é previsível, não urgente: a criança sabe quando vem e nada some para sempre (bonanza relança). Levar o **dia fixo da semana** e a regra de que **tudo volta**. |
| **Animal Crossing: New Horizons** | Nookipedia, página Nook Stop: bônus diário de check-in **50, 80, 100, 150, 200, 250, 300** milhas (dia 1 a 7 seguidos, teto 300); itens especiais "só podem ser comprados **uma vez** e saem da lista" (exceto voucher de Bells, passagem e capinha); voucher: 500 milhas = 3.000 Bells. Página Nook Miles: mudança custa 5.000 milhas; conquistas em degraus (10 peixes = 300 milhas … 5.000 peixes = 3.000); Nook Miles+ é "um recurso **renovável** de milhas"; teto de 9.999.999. | O melhor modelo para o Bobby: **duas camadas de moeda de origem diferente** (conquista em degraus + tarefa diária renovável) e catálogo de **compra única** (o item some depois de comprado, o que mostra progresso de coleção). Teto de 300 no bônus diário evita que a ofensiva vire a maior fonte. |
| **Pokémon GO** | Wiki (fandom, página Shop): defender ginásio rende **1 moeda a cada 10 min, teto de 50 por dia**; teste de "Daily Research" dividia em 30 de ginásio + 20 de tarefas diárias. | **Teto diário de moeda grátis** é padrão de mercado. Para o Bobby não quero teto por relógio (Decreto art. 9º III), mas sim por **ações**: depois da meta cheia, "continuar explorando" rende XP e moeda normais, sem bônus (já na spec). |
| **Club Penguin (histórico)** | Wiki (fandom): 500 moedas ao criar o pinguim; minigames pagam ~10% da pontuação, **dobrado se o jogador tem todos os selos daquele jogo**; selos (26/07/2010) eram 352, em 4 dificuldades e 4 categorias, guardados num álbum no cartão do jogador; catálogo de móveis mensal desde 22/08/2005, a partir de 2009 só mês atual + 2 anteriores, só para membros; iglu mais barato 900 moedas. | Três ideias boas: **álbum de selos com dificuldade visível**, **catálogo mensal que cicla** (não some para sempre: volta em edições), e **coleção completa melhora o ganho** (selos dobram a moeda). A parte "só membro" é proibida para nós. |
| **Habbo** | Wiki (fandom, página Rare): raros ficam no catálogo "por tempo limitado"; "limitar a circulação cria demanda"; a Yellow Amber Lamp "perdeu o valor quando o hotel britânico a relançou por 2 semanas". Via busca (habborator): LTD numerados desde 2012, pixels ganhos por conquista desde 2008, e a crítica "uma vez os móveis significavam algo". | Lição de risco: escassez artificial é o motor do Habbo e é exatamente o que **não** quero para criança (urgência fabricada). Levar só a ideia de **item numerado por marco** ("Constelação de outubro, nº 1 de 1 para você"), onde a raridade vem do feito, não do estoque. |
| **Stardew Valley** | Wiki oficial: ouro começa em 500; conquistas por **ganho acumulado** (15 mil, 50 mil, 250 mil, 1 milhão, 10 milhões); o Gold Clock custa **10.000.000** e é "o prédio mais caro", exigido para a Perfeição. | Sumidouro de fim de jogo com preço absurdo e efeito só de conforto: é a resposta de Stardew a "tenho tudo". Para o Bobby, o equivalente é o **céu estrelado** (ralo sem teto, 100 moedas por estrela) e o troféu de Perfeição por planeta. |
| **Minecraft (aldeões)** | Wiki oficial (Trading): cada troca tem **número máximo de usos** e depois fica indisponível; o aldeão **repõe até 2 vezes por dia** ao trabalhar; a demanda sobe o preço quando a troca é muito usada. | É estoque de verdade, não falso, porque obedece a uma regra visível e reposta. Levar a regra "o petisco conta **1 por dia** para a amizade" (uso limitado honesto). Não levar preço dinâmico: criança de 7 não entende inflação por demanda. |
| **DragonBox Numbers** | eSchool News (01/02/2016): moedas são a recompensa principal e **desbloqueiam fases**; o material da DragonBox diz que a bolsa de moedas ensina o sistema decimal. App sem anúncio nem coleta (Yahoo Tech, via busca). | Moeda que desbloqueia **conteúdo** é pedagógico lá porque contar é o conteúdo. No Bobby, conteúdo nunca fica atrás de moeda (criança fraca ganha menos e precisa estudar mais, não menos). |
| **Pesquisa de motivação** | Lepper, Greene e Nisbett (1973, via fontes secundárias): crianças que esperavam prêmio por desenhar desenharam **menos** depois (efeito de superjustificação). Meta-análise Deci, Koestner e Ryan (1999), citada em fonte secundária e **não conferida no original**: prêmio tangível esperado reduz motivação intrínseca (d ≈ -0,40), elogio aumenta (d ≈ +0,31). Patente US4714275 (álbum de figurinhas): observação do inventor de que a criança média para em ~60 figurinhas de 200 a 240 e perde o interesse. | Dois cuidados de desenho: (1) moeda premia **ação feita**, nunca "tempo" nem "ficar"; o elogio do Bobby (voz) vale mais que a moeda e deve vir **antes** dela na tela; (2) coleções de 60 ou mais itens matam o interesse; cada álbum do Bobby tem **no máximo 12 por conjunto**, e o conjunto fecha. |

### 1.2 Padrões que se repetem em quem segura 6 meses ou mais

1. **Duas fontes de moeda com ritmos diferentes**: uma que escala com esforço (acertos) e uma renovável e pequena (diário). Animal Crossing, Pokémon GO, Prodigy.
2. **Sumidouros em camadas de preço** (10x entre a camada mais barata e a mais cara) e **compra única** que some da lista. Animal Crossing, Club Penguin.
3. **Alguma coisa que evolui com o tempo jogado**, não só com moeda: pet (Prodigy), casa (Prodigy, Club Penguin, Toca), avatar que evolui por pontos (Khan Academy).
4. **Catálogo que gira num calendário conhecido** (mensal em Club Penguin, sexta em Toca) e **relança** o que passou (Toca Bonanza, Club Penguin edições).
5. **Um ralo sem teto para o fim de jogo** (Gold Clock, estrelas). Quem não tem (Duolingo, Prodigy sem temporada) vê moeda parada e evasão.
6. **Temporada** com 1 coleção pequena nova (Prodigy: 1 pet e 1 item por temporada).

---

## 2. (a) Modelo: fontes e sumidouros para 6 meses

### 2.1 Fontes (ficam como estão, com dois ajustes)

| Fonte | Hoje | Proposta | Motivo |
|---|---|---|---|
| Acerto | 10 | **10** (não mexer) | É o feedback imediato do estudo. Cortar aqui pune a criança fraca, que é quem menos ganha. |
| Sequência de 3 | +5 | +5 | ok |
| Fase perfeita | +20 | +20 | ok |
| Baú do dia | 10 a 20 em 7 dos 30 dias | igual, mas com **escolha entre 2 itens** nos dias de item (Khan Kids) | mata qualquer leitura de sorteio |
| Ofensiva | bônus `min(50, ofensiva*5)` removido na spec | mantido removido | bônus por dia seguido é o item mais próximo de "recompensa por tempo" |
| Depois da meta | XP e moeda normais, sem bônus | igual | spec §5.4 |
| **Nova** fonte: álbum completo | não existe | conjunto de 12 adesivos completo = **+10% de moeda nos acertos daquela matéria** por 30 dias **[OPINIÃO]** | copia os selos do Club Penguin: coleção vira vantagem pequena e temporária, não poder |

Ganho por dia de jogo **[MEDIDO na simulação, 200 rodadas por perfil]**: fraca (65% de acerto, 15 perguntas, 4 dias por semana) **~117**; média (80%, 20 perguntas, 5,5 dias) **~196**; forte (90%, 35 perguntas, 6,5 dias) **~400**. Em 180 dias corridos: **12.000, 27.600 e 66.700**.

### 2.2 Sumidouros (o que muda)

Quatro famílias, cada uma com um papel:

| Família | Papel | Teto | Exemplos |
|---|---|---|---|
| **Prateleira fixa** | metas grandes, o "cofrinho" | 8.400 companheiros + 6.650 looks + 14.400 amizade | sempre visível, sempre comprável quando o portão abre |
| **Prateleira da semana** | gasto pequeno e frequente, decidir "o que eu quero" | 20.330 (nave, planeta, molduras, trilhas, adesivos, pistas) | 4 itens por semana, ciclo de 12 semanas, lista de desejos |
| **Ralo recorrente** | gasto miúdo diário com efeito afetivo | 20 por dia de jogo | petisco do companheiro |
| **Ralo sem teto** | absorver a criança forte sem inflar preço | infinito | céu estrelado: 100 moedas = 1 estrela acesa no céu do planeta |

Soma dos itens com preço: **52.780 moedas em 139 itens** (contra 11.250 em 13 hoje). Regra de bolso que usei: catálogo total ≈ **2x o ganho de 6 meses da criança média**, para que ela compre uns 65% e ainda tenha o que querer no mês 6; a forte (2,4x a média) é absorvida por portões e pelo céu estrelado; a fraca (0,45x) ganha de graça, por marco, tudo que importa.

### 2.3 Cofrinho de meta (mecânica nova, custo baixo)

A criança escolhe "estou guardando para…" (companheiro, amizade, peça de planeta ou look caro). A tela mostra a barra. **Nada trava**: ela pode gastar tudo no que quiser; o cofrinho só muda a sugestão padrão ("metade do que você ganhou hoje foi para o cofrinho"). É o que torna o catálogo grande saudável: sem ele, a simulação mostra a criança gastando tudo em adesivos e comprando a Rufa só no dia 165 (rodada anterior do script, descartada). Com ele, a Rufa sai no dia 17.

### 2.4 Resultado da simulação (180 dias corridos, 200 rodadas por perfil) **[MEDIDO]**

Cenário **ATUAL** (só o que o código tem):

| Perfil | Ganhou | Gastou | Sobrou | Dias jogados | Zerou a loja |
|---|---|---|---|---|---|
| fraca | 11.993 | 10.775 | 1.218 | 103 | dia 166 (em 81% das rodadas) |
| média | 27.600 | 11.250 | **16.350** | 141 | **dia 75** (100%) |
| forte | 66.732 | 11.250 | **55.482** | 167 | **dia 32** (100%) |

Cenário **PROPOSTO** (catálogo da seção 3, portões da seção 4, cofrinho e loja da semana):

| Perfil | Ganhou | Gastou | Sobrou | Itens conquistados | Zerou a loja |
|---|---|---|---|---|---|
| fraca | 11.993 | 10.702 | 1.290 | 46 de 139 | não |
| média | 27.600 | 27.171 | **431** | 95 de 139 | não |
| forte | 66.732 | 64.258 | 2.473 | 129 de 139 (os 10 restantes são portões de amizade que exigem jogar com cada companheiro) | não; 20.177 foram para o céu estrelado (202 estrelas) |

Quando compra o quê (dia médio, cenário proposto):

| Compra | fraca | média | forte |
|---|---|---|---|
| Teo (500) | 13 | 6 | 2 |
| Rufa (900) | 40 | 17 | 6 |
| Otto (1.000) | 69 | 30 | 11 |
| Capi (1.500, portão 14 dias vivos) | 112 | 48 | 19 |
| Brisa (2.000, portão 10 fases perfeitas) | não alcança | 73 | 29 |
| Fagulha (2.500, portão 30 dias vivos) | 172 (42% das rodadas) | 105 | 43 |
| 1ª peça de decoração da nave | 165 | 66 | 13 |
| 1ª amizade nível 2 (800 + 20 fases com ele) | não | 120 | 47 |
| 1ª peça de planeta (400, 30% do planeta) | não | 138 | 54 |
| Amizade nível 3 (1.600 + 60 fases) | não | não | 78 |

Saldo parado em 30 / 90 / 180 dias: média **421 / 1.344 / 431** (antes: 432 / 2.467 / 16.450); forte **483 / 554 / 2.473** (antes: 1.417 / 21.926 / 55.531).

Dois avisos que a simulação deixa claros:
- **A criança forte esgota o conteúdo**, não a loja: no modelo ela fecha as 30 etapas por volta do dia 100 e a média por volta do dia 140 (hipótese de 60 a 70% dos blocos serem fase nova). A partir daí a economia de cosméticos não segura ninguém; segura a seção 5 (temporada e planeta novo). Esse é o maior risco do produto para 6 meses e não é de economia.
- **A criança fraca** compra pouco (46 itens), e isso é aceitável **só** porque metade do que tem valor (medalhas, molduras douradas, adesivos raros, decoração de planeta completo) vem **de graça por marco**. Se a onda seguinte esquecer os marcos, a fraca fica de fora da coleção, e é ela quem mais precisa de motivo para voltar.

---

## 3. (b) Catálogo de sumidouros

Preço em moedas. "Prazo" é o dia médio em que a criança média alcança **[MEDIDO]** ou estimativa **[OPINIÃO]** quando o item ainda não está na simulação. "Arte" diz o que já existe em `assets/` e o que falta.

### 3.1 Prateleira fixa

| Item | Preço | Portão | Prazo (média) | Arte | Justificativa |
|---|---|---|---|---|---|
| 7 looks atuais | 150 a 900 | nenhum | dias 2 a 130 (coroa por último, porque o cofrinho prioriza companheiros) | **existe** (`assets/looks/`, 7 arquivos) | manter |
| 5 looks novos: traje espacial 500, mochila-foguete 600, capa estelar 800, escafandro 900, coroa da constelação 1.000 | 500 a 1.000 | 14, 21, 45, 60, 90 dias vivos | semanas 3 a 14 | **falta**: 5 overlays no padrão `ov-*.webp` (já existem 3) | dá meta de look no mês 2 e 3, quando os atuais acabaram |
| Teo, Rufa, Otto (guias) | 500 / 900 / 1.000 | nenhum | 6 / 17 / 30 | **existe** (4 poses + sheet cada) | guia de cada planeta chega cedo, como hoje |
| Capi | 1.500 | 14 dias vivos | 48 | existe | coringa do acolhimento chega quando já há rotina |
| Brisa | 2.000 | 10 fases perfeitas | 73 | existe | coringa dos desafios premia precisão, não volume |
| Fagulha | 2.500 | 30 dias vivos | 105 | existe | mensageira é o prêmio do primeiro mês |
| Amizade nível 2 (por companheiro) | 800 | companheiro comprado + **20 fases jogadas com ele equipado** | 120 | **falta**: 1 overlay por companheiro (bandana, mochila, insígnia), 6 no total | é o "pet que evolui" da Prodigy sem corpo novo: a arte é um acessório |
| Amizade nível 3 | 1.600 | nível 2 + 60 fases com ele + 21 petiscos | 180+ para a média, 78 para a forte | **falta**: 6 overlays "lendário" (brilho, estrela) | meta de 6 meses, de propósito fora do alcance da média |
| Pistas de história (diário do Bobby) | 100 cada, 30 páginas | 1 por etapa concluída | acompanha as etapas | **não precisa de arte**: texto curto + áudio (há `narrativa.js` e `historias-*.js`) | dá uso à moeda ligado ao conteúdo, sem travar conteúdo |

### 3.2 Prateleira da semana (4 itens visíveis, ciclo fixo de 12 semanas, lista de desejos)

| Item | Preço | Portão | Prazo (média) | Arte | Justificativa |
|---|---|---|---|---|---|
| Decoração da nave do Bobby (hub), 24 peças | 150 a 400 | 1ª etapa concluída | 1ª no dia 66; média termina com ~8 | **falta**: 24 objetos pequenos com alfa. Onda 1 pode usar 12 (6 por planeta de origem) | é a "casa" que todo jogo de longo prazo tem; vive no hub, onde a criança passa |
| Decoração do planeta (visto de cima), 3 por planeta | 400 / 700 / 1.000 | planeta 30% / 60% / 100% | 138 | **falta**: 9 overlays sobre `PLANETA-*` (lua, anel, satélite, aurora) | liga moeda a progresso real no conteúdo |
| Molduras de retrato, 5 compráveis | 250 a 600 | 7 dias vivos | 150 | **falta**: 8 molduras (5 à venda + 3 só por marco: 7, 30 e 90 dias) | barata de fazer, visível no perfil e na Liga da Família (Fase 4) |
| Trilhas de brilho no mapa, 5 | 300 a 700 | 14 dias vivos | 168 | **falta**: 5 texturas de caminho (CSS pode resolver 3) | muda o mapa, que é a tela mais vista |
| Adesivos comuns do álbum, 36 (3 conjuntos de 12) | 80 | nenhum | ao longo dos 6 meses | **existe parcialmente**: recortes de `arte/recortes` (65) e poses viram adesivo; faltam ~20 | gasto miúdo para quem não quer guardar |
| Adesivos raros (12) e lendários (12) | **sem preço** | raro: baú dos dias 3, 14, 21, 28, 30 e marcos de 10 em 10 dias; lendário: planeta completo, 90 dias, 180 dias, álbum fechado | por marco | **falta**: 24 adesivos com acabamento (borda metálica) | raridade por feito, nunca por estoque |

### 3.3 Ralos

| Item | Preço | Regra | Arte | Justificativa |
|---|---|---|---|---|
| Petisco do companheiro | 20 | conta 1 por dia para a amizade; os seguintes só animam; o companheiro **nunca** fica triste, com fome ou pede | **falta**: 1 animação curta por companheiro (pode ser a pose p03 com partícula) | gasto diário pequeno e afetivo; sem decaimento para não virar culpa (ver seção 6) |
| Céu estrelado | 100 por estrela | aparece só quando o saldo passa de 2.000 e não há item comprável; estrelas acendem no céu do hub, com nome dado pela criança | **não precisa de arte**: pontos de luz em canvas | ralo sem teto para a criança forte (20.000 moedas na simulação); nada compra vantagem |

### 3.4 O que fica de fora de propósito

- Comprar congelador, reparo de ofensiva, coração ou "continuar": a spec já proíbe venda por dinheiro; eu recomendo tirar também **por moeda** o "continuar por 50 moedas" (§5.7). É gasto no momento do fracasso, e a lei pune pressão emocional. Trocar por "continuar grátis depois de rever a explicação".
- Caixa com conteúdo escondido, mesmo grátis.
- Item que expira ou "última chance".

---

## 4. (c) Regras de progressão

1. **Portão duplo**: tudo que custa mais de 500 exige moeda **e** uma conquista (dias vivos, fases perfeitas, etapa, planeta, fases com o companheiro). Moeda sozinha compra só o miúdo. Isso impede a criança forte de zerar a loja no dia 32 e dá à fraca um caminho que não depende de volume.
2. **Raro só por marco**: medalhas, molduras douradas, adesivos raros e lendários e a decoração de "planeta completo" **não têm preço**. Vêm no baú do dia 7, 14, 21, 28, 30 e a cada 10 dias, e nos marcos de planeta. Quem joga 3 dias por semana leva mais tempo e chega do mesmo jeito.
3. **A loja cresce com a criança**: nave abre na 1ª etapa, molduras no dia 7, trilhas no dia 14, planeta em 30% do planeta, amizade no 1º companheiro. Semana 1 tem 2 prateleiras; mês 3 tem 6. Evita a tela cheia de cadeado no primeiro dia.
4. **Loja da semana honesta**: 4 itens por semana num ciclo **fixo e publicado** de 12 semanas ("volta em 5 semanas"). Sem contador regressivo, sem "resta 1", sem "última chance". **Lista de desejos**: a criança marca até 3 itens e eles ficam compráveis mesmo fora da semana. Com isso a rotação organiza a vitrine, mas não cria urgência: o item marcado nunca some.
5. **Compra única e saída da lista**: item comprado sai da prateleira (Animal Crossing). A coleção se vê pelo que falta.
6. **Nada pune ausência**: petisco sem decaimento, companheiro sem fome, decoração que não estraga, cofrinho que não perde. Voltar depois de 10 dias encontra tudo igual mais o "Kit de volta" da spec.
7. **Cofrinho é sugestão, não trava**: metade do ganho vai para a meta escolhida, e um toque desfaz.
8. **Conteúdo nunca atrás de moeda**: etapa, fase, revisão, aula e história abrem por estudo. Moeda compra só o que se vê.
9. **Preço nunca muda** depois de publicado (sem promoção, sem inflação por demanda). Criança de 7 anos precisa confiar no número.
10. **Teto de coleção**: cada conjunto de adesivos tem 12; cada vitrine tem no máximo 8 itens por categoria. Coleção de 60 sem fim mata o interesse (patente das figurinhas, Prodigy).

---

## 5. (d) Quando a criança "tem tudo"

Na simulação a forte fecha o catálogo comprável por volta do dia 85 (resta só o que exige jogar com cada companheiro) e fecha as 30 etapas por volta do dia 100. Três respostas, em ordem de custo:

1. **Céu estrelado** (custo zero de arte, onda 1): ralo infinito, visível, com nome. "Você acendeu 200 estrelas" é um número que a criança mostra para a família. Não substitui conteúdo, mas tira a sensação de moeda inútil.
2. **Temporada de 90 dias ("Constelação de …")** (custo médio, onda 2): a cada 90 dias entra 1 conjunto de 12 adesivos, 1 look, 1 peça de nave e 1 moldura, todos **relançados** na temporada do ano seguinte (Toca Bonanza), para que ninguém "perca". A temporada **não** zera nada: sem reset de moeda, sem reset de coleção. O "prestígio" é um selo de temporada no perfil ("Primavera 2027: completa").
3. **Planeta novo** (custo alto, onda 3): o único remédio real para a forte é conteúdo (Ciências ou Geografia como 4º planeta, com guia novo, 10 etapas, 10 desenhos e 3 peças de planeta). A economia já está dimensionada para absorver: a prateleira fixa ganha 1 companheiro (3.000, portão: 3 planetas completos) e a da semana ganha 10 itens.

O que **não** fazer: reset de prestígio ao estilo "recomeça do zero com borda dourada". Para criança, perder a coleção é punição, mesmo voluntária.

---

## 6. (e) Riscos éticos e o que a lei brasileira limita

Textos abertos em 24/10/2026 no Planalto: **Lei 15.211/2025 (ECA Digital, em vigor desde 17/03/2026)** e **Decreto 12.880, de 18/03/2026**.

| Trecho da lei (DADO, literal) | Onde encosta no Bobby | O que o desenho faz |
|---|---|---|
| Lei, art. 20: "São vedadas as caixas de recompensa (loot boxes) oferecidas em jogos eletrônicos direcionados a crianças e a adolescentes ou de acesso provável por eles" | baú do dia | baú **sem sorteio**, conteúdo mostrado antes, e agora com **escolha** entre 2 itens; nunca vendido |
| Decreto, art. 9º, § único: são mecanismos de incentivo ao uso excessivo "I - a ocultação de pontos naturais de parada; II - o acionamento de novos conteúdos sem solicitação; III - a oferta de recompensas pelo tempo de uso; e IV - o aparecimento de notificações excessivas" | ofensiva, meta, "continuar explorando", loja da semana | moeda por **ação**, nunca por minuto; "Por hoje chega" com dois botões iguais; sem bônus por dia seguido; sem notificação de loja |
| Decreto, art. 10, § único, II: prática manipulativa é "explorar vulnerabilidades cognitivas, ao utilizar pressões emocionais, urgências fabricadas, escolhas enviesadas, inferências emocionais ou estímulos inadequados à idade" | rotação semanal, petisco, companheiro | sem contador, sem "última chance", lista de desejos que trava o item; companheiro nunca pede nem fica triste; a FTC (caso Epic, citado no relatório 03 do cofre) chama isso de "parasocial relationship pressure" |
| Decreto, art. 12, § 2º: a classificação indicativa informará riscos de "II - caixas de recompensa", "III - estímulo ao uso problemático ou excessivo, especialmente por meio de funcionalidades que induzam ao engajamento compulsivo", "IV - microtransações" | ficha do app na loja | o Bobby pode declarar **zero microtransação, zero loot box**; isso é argumento de venda para o responsável e deve estar na página do produto |
| Lei, art. 17, IV: fornecedores devem "oferecer funcionalidades que permitam limitar e monitorar o tempo de uso"; art. 18, II: ferramentas parentais devem permitir "restringir compras e transações financeiras"; art. 18, § 2º: vedado projetar interfaces que enfraqueçam salvaguardas | painel do responsável | já há meta, limite de blocos e pausa. Acrescentar no painel: **desligar a loja da semana**, **desligar petisco**, e ver o total gasto em moedas (transparência, mesmo sem dinheiro) |

Riscos que a lei não resolve e que são decisão nossa:

- **Superjustificação**: moeda demais no acerto pode deslocar o motivo de estudar. Mitigação: elogio falado do Bobby antes da moeda, moeda discreta no placar, e **nenhuma** moeda por reler aula ou por revisão espaçada além do valor normal (a spec já limita M09).
- **Desigualdade entre irmãos**: a forte acumula 5x a fraca. Mitigação: o que tem status (medalha, moldura dourada, lendário) vem por marco de dias, que a fraca alcança no mesmo ritmo de calendário.
- **Petisco virar "cuidado" cobrado**: se algum texto disser "o Teo está com fome", virou culpa. Regra de redação: o companheiro **agradece**, nunca **pede**.
- **"Continuar por 50 moedas"**: gasto no instante do erro. Recomendo remover (seção 3.4) e deixar nota para o advogado da spec.
- **Loja como tela principal**: a loja fica atrás de um toque, nunca na tela de fim de fase, e nunca interrompe o estudo.

---

## 7. (f) Onda seguinte: o que entra e o que pede arte

### 7.1 Entra na onda seguinte (sem arte nova ou com arte mínima)

| # | Item | Custo de arte | Depende de |
|---|---|---|---|
| 1 | Tabela de preços e portões num lugar só (`PRECOS` ganha `portao` e `prateleira`) | nenhum | B03 da spec (separar XP de moeda) |
| 2 | Cofrinho de meta (barra + escolha) | ícone existe (`rec-moeda`, `rec-presente`) | #1 |
| 3 | Loja da semana com ciclo fixo de 12 semanas e lista de desejos (3 vagas) | nenhum (reusa cartões) | #1 |
| 4 | Portões de Capi (14 dias), Brisa (10 perfeitas) e Fagulha (30 dias) | nenhum | contadores já existem na spec §7 |
| 5 | Pistas de história: 30 páginas de texto + áudio | texto e voz, não imagem | `narrativa.js`; orçamento de áudio da spec §9 |
| 6 | Petisco (20 moedas, 1 por dia conta) com animação simples da pose p03 | mínima | companheiro equipado |
| 7 | Céu estrelado (canvas, 100 moedas por estrela) | nenhum | hub da Fase 3 |
| 8 | Adesivos comuns, 1º conjunto de 12, a partir dos recortes de `arte/recortes` | recorte e borda | álbum (tela nova simples) |
| 9 | Baú com escolha entre 2 itens | nenhum | ciclo diário B11 |
| 10 | Painel do responsável: desligar loja da semana e petisco; total gasto | nenhum | perfil-e-responsavel |
| 11 | Remover "continuar por 50 moedas" | nenhum | decisão do Filipe + advogado |
| 12 | Teste automatizado novo: `testes/economia.js` passa a rodar 180 dias e falha se a média sobrar mais de 15% do ganho ou se a forte zerar a loja antes do dia 60 **[OPINIÃO: limites]** | nenhum | #1 |

### 7.2 Pede arte (lista para o lote seguinte de geração, sem gerar nada agora)

| Peça | Quantidade | Formato | Observação |
|---|---|---|---|
| Looks novos do Bobby | 5 | overlay `ov-*.webp`, mesmo recorte dos 3 existentes | traje espacial, mochila-foguete, capa estelar, escafandro, coroa da constelação |
| Acessório de amizade nível 2 | 6 (um por companheiro) | overlay sobre a pose p01 | bandana, mochila, insígnia; cor do planeta |
| Acessório de amizade nível 3 | 6 | overlay com brilho | só depois de medir se alguém chega lá |
| Decoração da nave | 12 na onda 1 (24 no total) | objeto pequeno com alfa, 256 px | 4 por planeta de origem |
| Decoração de planeta | 9 | overlay sobre `PLANETA-MAT/POR/ING` | lua, anel, satélite por planeta |
| Molduras | 8 | quadro com alfa, 512 px | 3 delas só por marco (7, 30, 90 dias) |
| Trilhas de brilho | 2 em imagem (3 em CSS) | textura repetível | |
| Adesivos raros e lendários | 24 | 256 px, borda metálica | 12 ligados a marcos de dias, 12 a planeta e álbum |
| Animação do petisco | 6 | sequência curta ou partícula sobre p03 | pode ser CSS na onda 1 |
| Temporada (onda 2) | 12 adesivos + 1 look + 1 peça de nave + 1 moldura por temporada | | 4 temporadas por ano |
| Planeta novo (onda 3) | 1 planeta, 20 cenários, 10 desenhos, 1 companheiro (sheet + 4 poses), 3 peças de planeta | segue `CENARIOS-E-DESENHOS.md` | só depois de medir o dia em que a forte fecha o conteúdo |

Custo: nenhum crédito gasto neste documento; nenhuma imagem gerada.

---

## 8. As 6 decisões de economia que mais importam

1. **Não cortar a moeda do acerto. Abrir sumidouros.** O problema é de ralo, não de torneira: a média sobra 16.450 hoje e 431 no modelo proposto, com o mesmo ganho.
2. **Portão duplo acima de 500 moedas** (moeda + conquista). É o que impede a forte de zerar a loja no dia 32 e dá à fraca um caminho por calendário.
3. **Raridade só por marco, nunca por estoque.** Medalhas, molduras douradas, adesivos raros e lendários não têm preço nem prazo; chegam no dia 7, 14, 30, 90, planeta completo.
4. **Loja da semana com ciclo fixo publicado e lista de desejos.** Rotação organiza a vitrine; a lista de desejos elimina a urgência (o item marcado nunca some). Sem contador, sem "última chance", preço nunca muda.
5. **Cofrinho de meta + dois ralos (petisco de 20 sem decaimento e céu estrelado sem teto).** O cofrinho dá ritmo às compras grandes (Rufa no dia 17 em vez de 165); o céu absorve a forte sem inflar nada.
6. **Tirar o "continuar por 50 moedas" e preparar a temporada de 90 dias.** O primeiro é o único gasto no momento do erro (risco legal e de culpa); a segunda é o que segura depois do dia 100, quando a forte fecha o conteúdo e nenhuma loja resolve.

---

### Anexo A · Hipóteses da simulação (para calibrar com as primeiras famílias)

- Perfis: fraca 65% de acerto, 15 perguntas, 4 dias por semana; média 80%, 20, 5,5; forte 90%, 35, 6,5. Dias de jogo sorteados por semana.
- Baú depois do dia 30: 15 moedas em dia comum, item nos marcos de 10 em 10 (a spec deixa em aberto).
- Blocos que são fase nova: 50% / 60% / 70% por perfil; 30 etapas = 150 fases.
- Cofrinho: 50% do ganho do dia vai para a meta; itens pequenos saem só do bolso; a criança marca até 3 desejos por semana.
- Compra no máximo 1 item acima de 500 por dia.
- Céu estrelado só acende quando sobra mais de 2.000 e não há nada comprável.
- Ofensiva simplificada: o congelador cobre faltas curtas (o índice do baú sobe 1 por dia jogado).
- Nada aqui foi testado com criança. Os números servem para comparar cenários, não para prometer datas.

### Anexo B · Fontes abertas

- Lei nº 15.211/2025, Planalto: `planalto.gov.br/ccivil_03/_ato2023-2026/2025/lei/L15211.htm` (arts. 17, 18, 20, 21).
- Decreto nº 12.880/2026, Planalto: `planalto.gov.br/ccivil_03/_ato2023-2026/2026/decreto/D12880.htm` (arts. 9º, 10, 12).
- Duolingo, blog oficial, "How to keep your streak on vacation", 18/04/2023: `blog.duolingo.com/how-to-keep-your-streak-on-vacation/`.
- Duolingo Wiki (fandom), páginas Shop e Gem (não oficiais, marcadas como desatualizadas na própria wiki).
- Prodigy, "The Parents' Guide to Prodigy Math", 26/07/2025: `prodigygame.com/main-en/blog/parents-guide-to-prodigy/`.
- Common Sense Media, resenha de Khan Academy Kids: `commonsensemedia.org/app-reviews/khan-academy-kids`; resenhas de crianças sobre Prodigy (via busca).
- Toca Boca, página oficial de Toca Boca World: `tocaboca.com/toca-boca-world/`.
- Nookipedia, páginas Nook Miles e Nook Stop: `nookipedia.com/wiki/Nook_Miles`, `nookipedia.com/wiki/Nook_Stop`.
- Pokémon GO Wiki (fandom), página Shop, seção PokéCoins.
- Club Penguin Wiki (fandom), páginas Coin, Stamp, Furniture Catalog.
- Habbo Wiki (fandom), página Rare; habborator.org (via busca).
- Stardew Valley Wiki, páginas Gold e Gold Clock.
- Minecraft Wiki, página Trading.
- eSchool News, "App of the week: DragonBox Numbers", 01/02/2016.
- Lepper, Greene e Nisbett (1973) e Deci, Koestner e Ryan (1999): citados por fontes secundárias (psychologynoteshq.com, sk.sagepub.com); os originais não foram abertos.
- Patente US4714275 (álbum de figurinhas), Google Patents.
- Não abriram e ficaram de fora: central de ajuda Duolingo, blog Duolingo "streak-freeze", artigo de moedas da Prodigy, documentação Roblox Limiteds, página oficial Khan Kids, página de Obeliscos da Stardew.
