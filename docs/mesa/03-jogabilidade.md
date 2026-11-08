# MESA 03 · Jogabilidade e game feel · O Universo de Bobby

Versão 1 · 24/10/2026 · branch `reforma-fase-2` · só leitura em `src/`; este é o único arquivo gravado. Nenhum crédito gasto, nenhuma imagem ou áudio gerado.

**Pedido.** O Filipe disse que o app "ainda é genérico" e mandou pesquisar outros jogos em vez de "fazer como você acha". A filha (8 anos) pediu "mais realista, como RPG moderno". Este documento (1) pesquisa de verdade o que as crianças brasileiras jogam e o que esses jogos têm de sensação, (2) lê avaliações reais de apps de estudo, (3) resume o que a literatura de game feel diz e o que vale para toque em celular, (4) diagnostica o Bobby tela a tela a partir das capturas e (5) propõe 15 mudanças de jogabilidade com impacto x esforço, referência de jogo real, critério de pronto mensurável e risco ético. Critica e completa o `PLANO-DE-IDENTIDADE.md` (não repete as 15 mudanças dele).

**Marcas de confiança.** **DADO (fonte, data)** é coisa que li na página nesta sessão. **RESUMO** é o que a busca devolveu sem eu abrir a página inteira. **OPINIÃO** é inferência minha. Capturas: 20 arquivos de `revisao-final-3/` abertos como imagem (lista na seção 4).

---

## 0. Resumo em 10 linhas

1. O que a criança brasileira de 7 a 12 mais joga no celular é Roblox (28% dos pais, 2025), depois Minecraft e Free Fire. Todos são classificados 16+ ou 18+ na Play Store brasileira; Toca Boca World é 14+. O Bobby é "Livre". O espaço de um jogo com cara de RPG e classificação livre está vazio. **DADO + OPINIÃO.**
2. O que essas crianças escrevem nas avaliações quando elogiam: variedade (mapas, "mais de 100 personagens"), skins, "cada vez quer evoluir mais", explorar e decorar, gráficos. O que reclamam: repetição ("só caem os mesmos mapas"), tudo pago, bugs. Nenhuma fala em "aprender". **DADO (Play Store BR, 24/10/2026).**
3. Nos apps de estudo, os pais elogiam voz dublada, cor "na medida certa", gratuidade e sem anúncio (Khan Kids); reclamam de inglês sem português, cobrança e travamento (Duolingo ABC, Lingokids). Crianças elogiam Prodigy por "parecer Pokémon", batalhas e gráfico. **DADO.**
4. Game feel na literatura: resposta em menos de 100 ms, espaço simulado e acabamento (Swink); "juice" é feedback abundante com cor, easing, squash, som, partículas (Jonasson e Purho 2012, Nijman 2013), e tem contra-argumento (polimento fora do mundo quebra imersão). **DADO.**
5. O Bobby hoje: tela de pergunta é lista numerada com bolinhas genéricas (a fase chama "Contar as sementes" e mostra círculos azuis); o Bobby é um círculo de 56 px; o mapa tem círculos sobre o cenário e o Bobby não anda; o feedback é um painel de base igual em todas as matérias; o baú abre modal sobre modal; o computador usa 37% da largura. **DADO (capturas).**
6. A diferença entre "colagem" e "de verdade" está em três coisas que o plano de identidade trata pouco: o verbo (o que a criança faz com o dedo), a cena que reage ao verbo, e um só lugar (o mundo) em vez de muitos modais. **OPINIÃO.**
7. A lei mudou: o ECA Digital (Lei 15.211/2025) está em vigor desde 17/03/2026 e exige configuração que evite uso compulsivo por padrão, limita "recompensas pelo tempo de uso" e proíbe caixa de recompensa. Ofensiva, congelador e a missão "acerte 4 seguidas" precisam sair da frente da criança. **DADO.**
8. Proposta: 15 mudanças em 3 ondas; as 6 de maior impacto são: verbo na cena (1), gramática de 5 toques (2), reação em 100 ms com estado pressionado e hit-stop (3), Bobby anda no mapa e os nós viram objetos (4 e 5), feedback dentro da cena (7) e computador como tela de jogo (10).
9. Nada aqui usa tempo limite visível, vidas, sorteio, compra ou pedido para voltar. O minijogo de fluência tem 30 s por desenho de quantidade, sem cronômetro na tela.
10. Meta de aceite: a filha joga 15 minutos sem ler nenhum texto e consegue dizer o que fez no mundo ("plantei a horta, arrumei a cerca"), e o Filipe sobe de 5 para 8.

---

## 1. O que as crianças brasileiras de 7 a 12 jogam (2025 e 2026)

### 1.1 Os números

| Fato | Fonte | Confiança |
|---|---|---|
| Roblox é "o game que seus filhos mais jogam no celular" para 28% dos responsáveis em 2025 (25% em 2024, 18% em 2023). Pesquisa com 2.005 pais de crianças e adolescentes de 0 a 16 anos, 3 a 28 de julho de 2025, margem de 2,2 pontos | Mobile Time, "33% dos adolescentes brasileiros com smartphone usam ChatGPT", 05/09/2025, Panorama Mobile Time/Opinion Box | **DADO (ABERTO)** |
| "Roblox mantém a liderança, seguido por Minecraft e Free Fire" | Propmark, 10/09/2025, sobre a mesma pesquisa | **DADO (ABERTO)**; sem percentual de Minecraft e Free Fire na matéria |
| YouTube é o app mais usado em todas as idades (54% de 0 a 3 anos; 78% de 13 a 16); ChatGPT é usado por 18% na faixa de 10 a 12 | Mobile Time, 05/09/2025 | **DADO** |
| Tempo médio de tela: 1h28 (0 a 3 anos) a 3h44 (13 a 16) | Propmark, 10/09/2025 | **DADO** |
| TIC Kids Online Brasil 2024: 2.424 crianças de 9 a 17 entrevistadas; o dado de jogos mais recente que a busca devolveu é de 2021 (66% jogam online conectados a outros jogadores, 64% não conectados) | Cetic.br, via Mobile Time 23/10/2024 e tabelas do Cetic | **RESUMO**, não abri o relatório |
| Roblox criou contas por faixa etária (Roblox Kids 5 a 8, Select 9 a 15) e passou a exigir verificação facial para menores de 16 no Brasil | Olhar Digital, 13/04/2026 e 16/06/2026 | **RESUMO** |
| Classificação na Play Store brasileira: Roblox 16 anos (1 bi+ downloads), Stumble Guys 16 anos (100 mi+), Brawl Stars 18 anos (500 mi+), Toca Boca World 14 anos (100 mi+) | Play Store BR, páginas abertas em 24/10/2026 | **DADO (ABERTO)** |
| Comscore e Newzoo com recorte de crianças por idade no Brasil: **não encontrei** nenhum relatório aberto | buscas de 24/10/2026 | lacuna |

**OPINIÃO.** O dado que mais pesa para o Bobby é o da classificação: os jogos que a criança de 8 anos joga são todos "para 16 ou mais". Ela não procura "jogo infantil"; procura o que os amigos jogam. Um app "Livre" que pareça com o que os amigos jogam (mundo 3D, personagem que anda, coisas para colecionar e personalizar) tem o campo vazio.

### 1.2 O que essas crianças dizem que gostam (avaliações reais, Play Store BR, lidas em 24/10/2026)

Paráfrases fiéis das avaliações mais marcadas como úteis na página brasileira de cada jogo, sem nome de pessoa. Idade só quando a própria pessoa escreveu.

| Jogo | Data | O que a pessoa escreveu (paráfrase) | O que isso ensina ao Bobby |
|---|---|---|---|
| Stumble Guys | 10/09/2026 | Ama o jogo, é divertido e desafiante, "várias skins lindas" e fases incríveis; a queixa é que os mapas se repetem demais e alguns ela nunca conseguiu jogar | Variedade visível é a moeda principal; repetição é a queixa principal |
| Stumble Guys | 01/09/2026 | Gosta bastante; pede mais mapas, porque "sempre caem os mesmos" e isso "enjoa" | Idem; o Bobby hoje tem 1 tipo de pergunta dominante |
| Stumble Guys | 09/09/2026 | "O jogo é perfeito" mas o botão de trocar emote não responde e perdeu recompensas por erro; pede de volta as roletas clássicas (ressalva: roleta é sorteio, não serve ao Bobby) | Toque que não responde é a primeira queixa de quem gosta |
| Brawl Stars | 13/09/2026 | Joga desde os 8 anos, mais de 90 horas, "nunca cansou"; mais de 100 personagens e "quando você acha que acabou, eles colocam outro" | Elenco grande e crescente; o Bobby tem 7 companheiros que quase não aparecem |
| Brawl Stars | 07/09/2026 | "Quando você começa a jogar, você quer cada vez mais evoluir"; reclama de bugs (barra de HP sumindo, personagens bugados) | Progressão visível no personagem; a palavra que usa é "viciante" (sinal de alerta ético, seção 6) |
| Brawl Stars | 10/09/2026 | Joga desde 2018, "fez parte da minha infância"; acha que o balanceamento piorou | Memória afetiva vem de personagens e amigos, não de pontos |
| Roblox | 17/09/2026 (escreve que tem 12 anos) | Jogo muito bom, vários jogos para todo público, gráficos bons, dá para jogar com amigos; alerta que há experiências impróprias feitas por jogadores | Para a faixa de 12, "gráfico bom" e "com amigos" são critério |
| Roblox | 16/09/2026 | Foi o jogo favorito; hoje o mercado está saturado de experiências "pensadas para viciar" com "efeitos de tela exagerados e recompensas" (a própria avaliação chama isso de "dopamina barata") | A criança mais velha percebe e rejeita o excesso de juice. Confirma Folmer Kelly (seção 3) |
| Toca Boca World | 10/01/2025 (10.967 úteis) | Ama o jogo "para quem gosta de fazer RP"; sugere opções de clima: "chuva, pétalas caindo, folhas caindo"; pede mais casas grátis e 5 personagens em vez de 3 | Uma criança pediu clima no mundo. É a mudança 9 do plano de identidade, confirmada por quem joga |
| Toca Boca World | 11/08/2025 | O jogo é ótimo para "decorar e explorar lugares"; a única coisa ruim é que "basicamente tudo é pago" | Decorar e explorar são verbos; o Bobby não tem nenhum dos dois |
| Toca Boca World | 17/11/2025 | O jogo propõe criatividade, "mas isso fica difícil com poucos personagens, poucas casas, poucos lugares" | Pouca coisa para fazer no mundo mata a proposta |

**OPINIÃO.** Em 11 avaliações, zero menções a "ganhar pontos" como motivo de gostar. Os motivos são: coisas para ver (skins, mapas, personagens), coisas para fazer (explorar, decorar, evoluir o personagem) e gente (amigos). As queixas são repetição, toque que falha e tudo pago. Bobby: não tem pagamento (vantagem rara), mas tem repetição (lista 1, 2, 3) e tem pouca coisa para fazer no mundo.

### 1.3 O que esses jogos têm de sensação que o Bobby não tem (visto nas descrições e no que já conheço dos jogos, OPINIÃO marcada)

| Sensação | Como aparece nos jogos de referência | No Bobby hoje (capturas) |
|---|---|---|
| Toque com resposta imediata | Stumble Guys e Brawl Stars: o personagem reage no mesmo quadro ao joystick; o botão afunda ao toque (OPINIÃO, prática conhecida dos dois) | Botão só muda a cor da borda; nenhuma captura mostra estado pressionado |
| Personagem que anda no mundo | Roblox e Stumble Guys: o avatar anda, cai, pula; Prodigy: anda pelo mapa até o combate (Common Sense Media, RESUMO) | O Bobby fica parado ao lado do nó 1 em todas as capturas do mapa |
| Mundo que reage | Toca Boca: personagens mostram "prazer ou nojo" ao que a criança faz com os objetos (Killscreen, 20/02/2013, **DADO**) | A cena do mapa não reage a toque; a pergunta não tem cena |
| Variedade de verbo | Stumble Guys tem correr, pular, chutar, agarrar (descrição da loja, **DADO**); Duolingo ABC tem traçar e arrastar e soltar (descrição da loja, **DADO**) | Um verbo: tocar na alternativa. Mais o teclado numérico |
| Coleção que cresce | Brawl Stars: mais de 100 personagens; Toca: presentes na agência de correios toda sexta (descrição, **DADO**) | Looks na loja por moedas; adesivos no baú |
| Celebração curta e dentro do mundo | Brawl Stars: a vitória é a pose dos 3 personagens no mapa (OPINIÃO) | Confete sobre fundo escuro, 3 cartões de estatística e "Ofensiva: 1 dia" |

---

## 2. Apps de estudo que as crianças gostam de verdade

### 2.1 Avaliações reais (Play Store BR, lidas em 24/10/2026; paráfrase, sem nomes)

| App (nota e volume na BR) | Data | O que a avaliação diz (paráfrase) | Lição |
|---|---|---|---|
| Khan Academy Kids (4,1; 57,3 mil) | 30/05/2024 | 100% gratuito; atividades ótimas; "tudo colorido na medida certa"; dubladores que tornam a experiência mais divertida; atividades distintas para distrair | Voz dublada e cor comedida são o que o adulto nota primeiro |
| Khan Academy Kids | 19/11/2020 | Filha de 2 anos ama; livros interativos com opção de ler sozinha ou ouvir a narração "muito boa"; tudo em inglês mas as atividades são compatíveis com crianças; a mãe se diverte junto | Narração boa segura até sem o idioma. O Bobby já tem isso (voz Kokoro) |
| Khan Academy Kids | 21/09/2026 | "Simplesmente incrível, mas você tem que saber inglês" | Idioma é a barreira número 1 dos apps bons no Brasil |
| Duolingo ABC (3,7; 23,8 mil) | 18/09/2025 (1.082 úteis) | Explica que o app ensina a ler quem já fala inglês; sem anúncios; várias contas por aparelho; histórias curtas e engraçadas "para uma criança"; critica as avaliações injustas | Humor na medida da criança, não do adulto |
| Duolingo ABC | 31/03/2024 (4.302 úteis) | Adulto que baixou para ver; achou encantador; diz que para criança brasileira iniciante fica difícil sem a língua materna; pede opção em português | Idem |
| Duolingo ABC | 10/10/2026 | Uma estrela: o app abre e fecha sozinho ("ABC parou") | Travamento mata qualquer encanto |
| Lingokids (4,1; 223 mil) | 11/10/2026 | Cobrança de R$ 194 depois de cancelar o teste; atividades principais em inglês | Cobrança escondida é a maior fonte de 1 estrela |
| Lingokids | 09/08/2026 | Primeira e segunda atividades "legais"; na terceira apareceu "a conexão expirou" com internet boa | Primeiras 3 atividades decidem a avaliação; offline conta |
| Lingokids | 16/07/2026 (escrita por criança, pela gramática) | "Esse jogo é legal, tem aprendizado, um monte de atividades legais" | A criança chama de "jogo", nunca de "aula" |
| Prodigy Math (4,4; 68,9 mil) | 13/04/2023 (criança, pela gramática) | "Tem as batalhas e parece Pokémon", gráficos bons, em inglês mas joga no site da escola também; "eu sou muito bom em matemática" | Batalha com monstros e comparação com um jogo famoso são o elogio |
| Prodigy Math | 05/10/2021 (criança) | "O gráfico é bom", ensina matemática e "eu me diverti muito" | Gráfico primeiro, matemática depois |
| Prodigy Math | 10/04/2021 | "Que top, aprendo até termos de matemática em inglês" | Aprender vira efeito colateral de jogar |

Total: 12 avaliações de apps de estudo e 11 de jogos, 23 ao todo, todas datadas. Nenhuma avaliação de DragonBox: a página brasileira do DragonBox Numbers não existe mais na Play Store (404 em 24/10/2026).

### 2.2 Análises e textos dos próprios estúdios

| Fonte | Data | O que diz | Uso aqui |
|---|---|---|---|
| Duolingo, blog "Building character" | 10/11/2020 (**DADO, ABERTO**) | 18 meses para criar o elenco; cada personagem tem animação própria quando o aluno acerta; há "animações de meio de lição" para sequências; os personagens "falam" a frase do exercício na maioria das telas; não há nenhum dado medido no post | A animação no acerto é por personagem, não por app. Mudança 13 |
| Duolingo, blog "World character visemes" | sem data lida (**RESUMO**) | Usam Rive com máquina de estados: um estado para a pose do corpo e estados separados só para a boca, que rodam em paralelo; um arquivo só para o engenheiro | Técnica: corpo e rosto em camadas separadas, troca por estado. O Bobby já tem 12 poses e 8 expressões recortadas; dá para compor |
| Duolingo, testes A/B (Econsultancy) | sem data lida (**RESUMO**, a página devolveu 403) | Mostrar a ofensiva depois de cada lição: +1% de usuários diários e +3% de retenção no dia 14; mostrar a ofensiva o tempo todo: +3% DAU | É exatamente o mecanismo que o ECA Digital limita (seção 6). Não copiar |
| Khan Academy, blog "Supporting English Language Acquisition" | 01/05/2025 (**DADO, ABERTO**) | A Kodi "celebra quando a criança acerta" (pula, levanta as mãos, "yay!") e "incentiva a tentar de novo" no erro (pata no queixo, aponta para a cabeça, dica gentil); cita Iverson e Goldin-Meadow sobre gesto e linguagem | Erro = gesto de pensar, não cara triste. Mudança 7 |
| Common Sense Media, Prodigy | sem data (**DADO, ABERTO**) | 499 avaliações de pais, 650 de crianças; crianças gostam de batalha e pets, reclamam de "pay-to-win", jogabilidade repetitiva e travamentos; pais acham comercial demais | O laço de RPG funciona com criança; a monetização destrói. Bobby: RPG sem loja |
| Toca Boca, Killscreen | 20/02/2013 (**DADO, ABERTO**) | Brinquedo em vez de jogo; em Toca Kitchen, a reação do personagem ("prazer ou nojo") é a recompensa | Mundo que reage é recompensa suficiente. Mudança 1 e 5 |
| Toca Boca, descrição na Play Store BR | 24/10/2026 (**DADO**) | "Nada de tempo limitado ou pontuações altas. Só brincadeiras e criatividade"; presentes grátis toda sexta na agência de correios | Presente fixo e previsível, em lugar do mundo, em vez de baú com modal |
| Habgood e Ainsworth, 2011 | (já no plano de identidade, **ABERTO** lá) | Responder como mecânica do jogo ensinou mais e foi jogado 7 vezes mais no tempo livre; amostras pequenas | Base da mudança 1 |

---

## 3. Game feel e "juice": o que a literatura diz e o que vale para toque

| Fonte | Data | O que diz | Vale para o Bobby |
|---|---|---|---|
| Steve Swink, *Game Feel* (2009), resenhado por Liz England | 26/08/2015 (**DADO, ABERTO**) | Game feel é a interseção de três coisas: **resposta em tempo real** (ciclo de correção abaixo de 100 ms), **espaço simulado** (coisas com peso, colisão, gravidade) e **polimento** | Os 100 ms já estão no plano; o que falta é "espaço simulado": o Bobby não tem nada que caia, encaixe ou bata |
| Swink, Gamasutra | 23/11/2007 (**DADO, ABERTO**) | Seis fatores: input, response, context, polish, metaphor, rules; "constraints define sensation": objetos muito juntos ficam opressivos, muito espaçados ficam triviais; recomenda um "jardim de teste" para afinar | Montar uma página de teste (`testes/jardim.html`) só para afinar toque, pressão, encaixe e som, sem o app inteiro |
| Jonasson e Purho, "Juice it or lose it" (2012), resumo em RPG Playground | 22/04/2018 (**DADO, ABERTO**) | Cor, tweening com easing, squash e stretch no evento, som e música, partículas sem exagero, screenshake, olhos e expressão nos objetos, mais ação na tela, ambiente que reage ao ritmo, flash | Para 7 a 12 anos e estudo: easing, squash leve no toque, som, olhos nos objetos (as sementes podem piscar), ambiente que reage. Sem screenshake forte e sem flash (fotossensibilidade e distração) |
| Nijman (Vlambeer), "The Art of Screenshake" (2013), 30 pontos resumidos na mesma página | 22/04/2018 (**DADO**) | Animação e som básicos; mostrar o que acontece com o alvo; **micro-pausa (sleep) para dar peso ao acerto**; permanência (não sumir sem mostrar como; deixar marca do progresso na cena); câmera com lerp; som com grave | Hit-stop de 60 a 80 ms no acerto; permanência: a semente plantada fica no canteiro; câmera do mapa com lerp |
| Folmer Kelly, "Don't juice it or lose it" (contra-argumento, na mesma página) | (**DADO**) | Polimento fora do mundo (poeira que não combina com o chão, gradiente em pixel art) quebra a crença no mundo; "juice pelo juice" distrai do objetivo | Confete sobre fundo escuro e moeda voando num cartão de quiz são juice fora do mundo. A regra: cada efeito nasce de um objeto da cena |
| Hicks, Dickinson, Holopainen e Gerling, "Good Game Feel", DiGRA 2018 | (**RESUMO**, só o abstract) | Pesquisa com 17 desenvolvedores; juice = "grandes quantidades de feedback audiovisual contribuem para uma experiência positiva"; framework para aplicar | Não li o PDF; não uso para decidir |
| Avaliação de 12 anos no Roblox | 16/09/2026 (**DADO**) | Rejeita "efeitos de tela exagerados e recompensas" pensados para viciar | O público de 11 a 12 percebe excesso. Juice com moderação e sempre ligado ao mundo |

**Regras de toque em celular que saem daqui (OPINIÃO apoiada nas fontes):**
1. **Pressionado em 1 quadro.** `pointerdown` muda a aparência no mesmo quadro (escala 0,96, sombra menor). Soltar é que decide. Hoje o app só reage no `click`, o que em celular chega 0 a 300 ms depois.
2. **Alvo mínimo de 48 px** e as áreas de toque no mapa maiores que o desenho do nó.
3. **Arrastar nunca é o único caminho** (já no DESIGN); além disso, o arrastar tem "ímã" de 24 px no destino e volta com easing quando solta fora.
4. **Hit-stop:** no acerto, tudo congela 60 a 80 ms antes da reação (Nijman). É barato e dá peso.
5. **Permanência:** o que a criança fez fica na cena (semente plantada continua lá na próxima pergunta).
6. **Sem flash, sem shake forte, sem loop infinito.** Com `prefers-reduced-motion`, tudo vira fade.

---

## 4. Diagnóstico do Bobby tela a tela (20 capturas abertas)

Capturas abertas: `390x844-12-mapa-primeira-tela`, `390x844-10-apos-escolher-mat` (bilhete), `390x844-90-mat-pergunta0`, `390x844-90-mat-pergunta1`, `390x844-91-mat-errou`, `390x844-90-pt-pergunta1`, `390x844-90-en-pergunta1`, `390x844-91-en-errou`, `390x844-92-mat-fim`, `390x844-102-bau-aberto`, `390x844-103-parada`, `390x844-31-looks-1`, `390x844-21-colorir`, `390x844-40-rotina-aberta`, `390x844-41-perfil`, `1280x800-12-mapa-primeira-tela`, `1280x800-100-fim-com-bau`, `360x640-52-rot-etapa9`.

| # | Tela | O que vi (DADO) | Por que parece genérico ou colagem (OPINIÃO) | Mudanças |
|---|---|---|---|---|
| 1 | Mapa, 390 x 844 | Cabeçalho com moedas e chama; cartão "Rotina de hoje" (fechado ocupa 100 px; aberto, metade da tela); cartão "Etapa 1 / 0 de 5 fases"; diorama 3D da horta coberta por lonas; 5 círculos azuis translúcidos e 12 pontinhos de trilha sobre a arte; nó 1 azul claro com "1"; Bobby parado ao lado, 60 px; cadeado no nó 2; rótulos em caixas escuras ("Contar até 20" cortado embaixo) | O cenário é de RPG e os nós são de app de quiz. O Bobby não anda, a cena não reage, nada muda ao tocar fora do nó. A lista de missões no topo é interface de produtividade | 4, 5, 8, 14 |
| 2 | Mapa, 360 x 640, etapa 9 | O foguete coberto é lindo; 5 círculos e pontinhos cobrem a balança e a caixa; rótulo "O número desconh..." truncado | Rótulo truncado denuncia que o nó é de lista, não do mundo | 5 |
| 3 | Mapa, 1280 x 800 | Coluna de 480 px no centro; planetas desfocados dos lados; o Bobby e os nós do mesmo tamanho do celular | 37% da largura em uso; é o celular esticado | 10 |
| 4 | Bilhete do Bobby | Modal de 600 px sobre o mapa com Bobby segurando carta, dois cartões informativos, "Ouvir" e "Vamos jogar" | Bom conteúdo, mas é o primeiro de muitos modais. No RPG o personagem fala no mundo | 11 |
| 5 | Pergunta de contar (mat) | Barra de progresso, lâmpada e **5 corações**; cartão "Contar as sementes 0 de 8" com 8 ícones de semente de 20 px; retrato redondo do Bobby de 56 px + "Pergunta 1" + alto-falante; "Lembre da aula" aberto (3 linhas); "Quantas bolinhas tem aqui?" com **19 círculos azuis genéricos em 3 fileiras**; alternativas 1, 2, 3 em cartões; a 3ª alternativa cortada pelo rodapé em 390 x 844 (`pergunta0`); botão "Verificar" | A fase se chama "Contar as sementes" e a criança conta bolinhas. Isso é a colagem: a história num cartão, o exercício em outro. Contar é tocar um por um; aqui é olhar e escolher na lista | 1, 2, 12 |
| 6 | Pergunta de contar, acerto | Alternativa fica verde com check; painel inferior verde "Boa! +10 moedas" com retrato do Bobby de 48 px; "Continuar" | O acerto não acontece na pergunta (as bolinhas não viram sementes plantadas, nada se move); acontece num painel de formulário | 7 |
| 7 | Pergunta 3 (mat) | 7 bolinhas; alternativa 1 selecionada com borda azul; metade inferior da tela vazia | O vazio mostra que não há cena; a pergunta ocupa 40% da tela | 1, 12 |
| 8 | Pergunta (pt) "Qual é a primeira vogal de BOLA?" | Mesma estrutura, violeta; "BOLA" num cartão; "Certinho!" | Mesmo molde com outra cor; as letras não fazem nada (não dá para tocar na vogal dentro da palavra) | 2 |
| 9 | Pergunta (en) "O que significa hello?" e "toque em tchau em inglês" | Mesmo molde turquesa; a alternativa escolhida fica turquesa antes de verificar; texto de aula longo em negrito acima | Inglês sem ouvir nada na tela (há o alto-falante, mas a pergunta é texto para texto) | 2 |
| 10 | Fim de fase (390) | Bobby p02 grande, confete, 2 de 3 estrelas, "Fase concluída!", cartão verde com a frase da história, "Você acertou 8 de 8", "Faltam 4 fases para ganhar o desenho", 3 cartões (Acertos, Moedas, Melhor combo), "Ofensiva: 1 dia", "Voltar para o mapa" | A história está num cartão verde e o canteiro não aparece plantado. "Melhor combo" e "Ofensiva" são métricas de app, não de mundo | 9, 8 |
| 11 | Fim de fase (1280) | Mesmo conteúdo em coluna de 600 px; o texto "Olha o que está..." (amarelo) fica cortado atrás do rodapé fixo | Bug de sobreposição no computador | 9, 10 |
| 12 | Baú aberto | Modal "Você ganhou / Adesivo novo: Estrela de boas-vindas" com Bobby e baú 3D, **por cima** do cartão "Abrir o baú" que já era um painel, com "Voltar para o mapa" embaixo | Modal sobre modal. O baú 3D é bom; abrir por modal tira a graça | 11 |
| 13 | "Por hoje chega!" | Modal com Bobby de costas acenando, 3 frases, "Terminar por hoje" (laranja) e "Continuar explorando" (contorno) | Único ponto em que o botão de parar é o primário. Manter | nenhuma |
| 14 | Looks | "500 moedas" em destaque, abas Companheiro e Looks, cartões com Bobby de corpo inteiro e preço "100" em botão laranja | Loja. Funciona, mas o look não aparece em nenhum lugar do mundo depois (o mapa mostra o Bobby base) | 12 do plano de identidade; aqui só 14 |
| 15 | Colorir | Desenho de linha da horta com planeta e régua; 13 cores; Desfazer, Recomeçar, Imprimir, Salvar; balde por área | É um bom brinquedo. Desligado do mundo: o desenho pintado não volta para o mapa nem para a cena | 14 |
| 16 | Rotina aberta | "Ofensiva: 0 dias", barra 0 de 20 perguntas, "Jogue uma fase e o dia fica vivo", missões "Aprenda 3 coisas novas", "Avance um passo no mundo", **"Acerte 4 seguidas"**, "Congeladores: 0", "No baú de hoje: um adesivo" | "O dia fica vivo" e "acerte 4 seguidas" são pressão por tempo e por desempenho; conflita com o ECA Digital (seção 6) | 8 |
| 17 | Perfil | Retrato do Bobby, "Explorador nível 1 · 7 a 8 anos", 6 cartões de estatística, "Suas galáxias" | Painel. A conquista real (o que a criança construiu no mundo) não aparece | 14 |

**O que já é bom e não pode ser perdido (DADO):** os dioramas por etapa (horta coberta, foguete coberto), o Bobby em 12 poses e 8 expressões, os looks em corpo inteiro, o baú 3D, a voz gravada, a tela de parada honesta, o desenho para colorir ligado à etapa.

---

## 5. Crítica ao `PLANO-DE-IDENTIDADE.md` (o que completar, não repetir)

| Ponto do plano | O que falta ou o que eu mudaria (OPINIÃO, com a fonte que apoia) |
|---|---|
| Mudança 1 (pergunta na cena, guia com balão) | Põe cenário atrás e guia ao lado, mas **mantém a lista de alternativas**. A criança continua escolhendo numa lista. O que muda a sensação é o **verbo**: contar é tocar nas sementes; plantar é arrastar a semente para o canteiro (Habgood 2011; Toca Boca). O balão do guia entra como segundo passo |
| Mudança 4 (game feel) | Certa nos 100 ms, mas não define o **estado pressionado no `pointerdown`**, o **hit-stop** nem a **permanência** (Nijman). Sem esses três, 100 ms vira só um número |
| Mudança 8 e 15 (tipos de pergunta) | Boa lista; falta a regra de **proporção por fase** (quantos verbos diferentes em 8 perguntas) e o **minijogo de fluência** separado do quiz. A queixa mais frequente das crianças nos jogos é repetição |
| Mudança 9 (mapa vivo) | Clima e hora do dia são ótimos (uma criança do Toca Boca pediu exatamente chuva e pétalas). Falta o básico antes: **o Bobby andar** entre os nós e **os nós serem objetos do cenário** em vez de círculos |
| Mudança 3 (falas) | Mantém "congelador" e "ofensiva" no banco de falas. O ECA Digital pede, por padrão, limitar "recompensas pelo tempo de uso" (art. 17, § 4º, II). Tirar da frente da criança |
| Mudança 6 (cerimônias) e 7 (narrativa) | Grandes e caras para a onda 2. Antes delas, o custo-benefício maior está em **um modal por vez** e **fim de fase dentro da cena** |
| Mudança 2 (28 sons sintetizados) | Correta, mas dá para começar com 8 sons ligados aos 5 verbos e ao mapa; os 28 depois |
| Computador | O plano propõe duas colunas. Pouco: no computador o app deve virar **tela de jogo** com HUD, teclado e cena cheia (mudança 10 aqui) |
| Teste com criança | O plano mede com a filha no fim de cada onda. Falta **protocolo** (o que observar, como contar) e **mais duas crianças**, uma de 11 a 12 |

---

## 6. Ética e lei: o que o ECA Digital muda para a jogabilidade

**DADO (Lei 15.211/2025, texto no Planalto, aberto em 24/10/2026; vigência em 17/03/2026 segundo Poder360, 17/03/2026):**
- Art. 1º: aplica-se a todo produto "direcionado a crianças e adolescentes ou de acesso provável por eles", incluindo "jogos eletrônicos" (art. 2º, I).
- Art. 2º, IV: define **caixa de recompensa** como aquisição mediante pagamento de item ou vantagem aleatória sem conhecer o conteúdo. Art. 20: **vedadas** em jogos para crianças.
- Art. 7º: configuração **por padrão no modelo mais protetivo**.
- Art. 8º, IV: "desenvolver desde a concepção e adotar por padrão configurações que **evitem o uso compulsivo**".
- Art. 17, IV: oferecer "funcionalidades que permitam limitar e monitorar o tempo de uso". § 4º, II: limitar "recursos para aumentar, sustentar ou estender artificialmente o uso", como "reprodução automática de mídia, **recompensas pelo tempo de uso**, notificações".
- Art. 18, § 2º: vedado "projetar, modificar ou manipular interfaces com o objetivo ou efeito de comprometer a autonomia, a tomada de decisão ou a escolha do usuário".
- Art. 22: vedado perfilamento para publicidade. Art. 35: multa de até 10% do faturamento, limitada a R$ 50 milhões por infração.
- Decretos de regulamentação assinados em 18/03/2026 (**RESUMO**, não li o texto).

**O que isso faz com o Bobby (OPINIÃO jurídica leiga; confirmar com o advogado já previsto no README):**
1. O baú diário não é pago e o conteúdo é fixo: **não é** caixa de recompensa pela definição do art. 2º, IV. Manter assim e nunca "abrir para ver o que veio" com sorteio.
2. **Ofensiva (dias seguidos) e congelador** são "recompensa pelo tempo de uso" na leitura mais cautelosa do art. 17, § 4º, II. Tirar da tela da criança; se ficar, só no painel do responsável, desligado por padrão.
3. **"Jogue uma fase e o dia fica vivo"** e **"Acerte 4 seguidas"** são pressão por tempo e desempenho. Substituir por missões de fazer no mundo ("plante 3 canteiros").
4. **Vidas e "continuar por 50 moedas"**: manipulam a escolha depois do erro (art. 18, § 2º, na leitura cautelosa). Tirar, como o plano D1 já propõe.
5. **Limite de tempo visível ao responsável** (art. 17, IV): o "Por hoje chega" já existe; falta o responsável definir o limite e ver o total.
6. Tudo o que segue nesta mesa respeita: sem cronômetro na tela, sem derrota, sem sorteio, sem compra, sem notificação, sem comparação com outra criança.

---

## 7. As 15 mudanças de jogabilidade

Formato: impacto na sensação (1 a 5), esforço em dias de agente (P até 1, M 2 a 3, G 4 ou mais; OPINIÃO), referência de jogo real, critério de pronto mensurável, risco ético. Todas: só `transform` e `opacity`, `prefers-reduced-motion` respeitado, teclado e leitor de tela mantidos, peso inicial abaixo de 3,0 MB.

### Mudança 1 · O verbo na cena: contar é tocar, plantar é arrastar
- **O que muda.** A pergunta de quantidade deixa de ser "quantas bolinhas" com lista. A criança vê o canteiro da horta (recorte de `cen-numeral-01`) com as sementes espalhadas; **toca uma a uma** e cada semente mostra o número ao ser tocada (1, 2, 3...) e cai no canteiro; no fim, ela toca no número que acha que é (teclado de 3 botões grandes) ou o número já está marcado pela própria contagem (nas fases iniciais). "Reparta 12 maçãs em 3 cestas" vira arrastar maçãs (ou tocar maçã, tocar cesta). "Qual a primeira vogal de BOLA" vira tocar na letra dentro da palavra, que acende. "Toque em tchau em inglês" vira ouvir o Otto e tocar a placa certa na cena da cidade.
- **Tela.** Pergunta (contar, agrupar, letra na palavra, palavra na cena).
- **Referência.** Toca Boca (a reação do objeto é a recompensa, Killscreen 2013, DADO); Khan Kids (contar tocando objetos, descrição e blog, DADO); Habgood e Ainsworth 2011 (responder é a mecânica).
- **Pronto quando.** (a) Em uma fase de 8 perguntas de contagem, pelo menos 5 usam objetos tocáveis na cena, medido no gerador; (b) cada toque em objeto mostra o número em até 100 ms (teste CDP `pointerdown` → mudança de `textContent`); (c) o objeto tocado fica marcado até o fim da pergunta (permanência); (d) a 3ª alternativa nunca fica atrás do rodapé em 360 x 640 e 390 x 844 (`getBoundingClientRect` contra o rodapé); (e) zero "bolinhas" genéricas em pergunta que tem contexto de história.
- **Risco ético.** Baixo. Sem tempo, sem perda.
- **Esforço.** M. **Impacto.** 5.

### Mudança 2 · Gramática de 5 toques, com proporção por fase
- **O que muda.** Cinco verbos oficiais com regras iguais: **tocar** (seleção, contagem), **arrastar** (para cesta, para a ordem, para o lugar na cena), **ligar** (par com linha), **ordenar** (cartas em fila) e **traçar** (desenhar o número ou a letra com o dedo numa área grande, reconhecimento simples por grade 3 x 3 e direção, aceitando o traço "mais ou menos"). Cada fase de 8 perguntas usa **pelo menos 3 verbos diferentes** e nunca 3 perguntas seguidas do mesmo verbo. Arrastar sempre com caminho alternativo (tocar origem, tocar destino) e ímã de 24 px no destino.
- **Tela.** Pergunta. Tabela de exemplos por matéria na seção 8.
- **Referência.** Duolingo ABC (traçar letras e arrastar e soltar, descrição na Play Store, DADO); Stumble Guys e Brawl Stars (variedade é o elogio, repetição é a queixa, avaliações de setembro de 2026, DADO).
- **Pronto quando.** (a) 5 verbos no ar com toque real pelo CDP (mouse, toque, teclado); (b) script `testes/variedade.js` percorre 30 fases geradas e falha se alguma tiver menos de 3 verbos ou 3 iguais seguidos; (c) traçar aceita 10 números desenhados por uma criança de 8 anos com pelo menos 8 reconhecidos (teste com a filha, anotado); (d) nenhum verbo depende de arrastar.
- **Risco ético.** Nenhum específico. Traçar nunca "reprova" o desenho: se não reconhecer, pede "desenha de novo, maior".
- **Esforço.** G. **Impacto.** 5.

### Mudança 3 · Pressionado no mesmo quadro, hit-stop e permanência
- **O que muda.** Todo elemento tocável ganha a classe `.pressionado` no `pointerdown` (escala 0,96 e sombra menor, 1 quadro), solta no `pointerup`; se o dedo sair do alvo, cancela. No acerto, **hit-stop** de 70 ms (tudo para), depois o objeto certo faz squash de 1,08 para 1,0 em 180 ms e o som toca. No erro, o objeto balança 2 vezes (6 px) e volta; nada some. O que a criança fez permanece na cena até a pergunta acabar. Um "jardim de teste" (`testes/jardim.html`) com um botão, um objeto arrastável, um par para ligar e um número para traçar, só para afinar tempos e sons com a filha.
- **Tela.** Todas.
- **Referência.** Swink (resposta abaixo de 100 ms; "jardim" de teste, Gamasutra 23/11/2007, DADO); Nijman (micro-pausa e permanência, resumo de 22/04/2018, DADO); avaliação do Stumble Guys em 09/09/2026 (botão que não responde é a queixa de quem ama o jogo, DADO).
- **Pronto quando.** (a) `pointerdown` → classe no mesmo `requestAnimationFrame` em 20 de 20 toques medidos pelo CDP; (b) hit-stop medido entre 60 e 80 ms; (c) com `prefers-reduced-motion`, pressionado vira só mudança de cor e hit-stop vira 0; (d) o jardim existe e tem os 4 elementos.
- **Risco ético.** Nenhum. Sem flash e sem tremor de tela.
- **Esforço.** P. **Impacto.** 4.

### Mudança 4 · O Bobby anda no mapa e a câmera vai junto
- **O que muda.** Ao terminar uma fase, o Bobby **caminha** do nó atual ao próximo (600 a 900 ms, `transform` ao longo da trilha, pose `caminha` alternando com a base a cada 150 ms, passos com som), a câmera do mapa rola com lerp para manter o Bobby no terço inferior, e ele chega com a pose `oi`. Tocar num nó à frente faz o Bobby andar até lá antes de abrir (a abertura da fase acontece no lugar). Em repouso, a cada 6 a 10 s ele troca de pose com fusão de 300 ms (já no plano 9; aqui vira pré-requisito).
- **Tela.** Mapa.
- **Referência.** Prodigy (o personagem anda pelo mundo até o encontro; Common Sense Media, DADO); Roblox e Stumble Guys (o avatar sempre se move; OPINIÃO de prática conhecida).
- **Pronto quando.** (a) O deslocamento acontece em 100% das transições de fase, medido por `getBoundingClientRect` do Bobby antes e depois; (b) nenhuma abertura de fase abre antes de o Bobby chegar; (c) a câmera nunca deixa o Bobby fora da tela (teste em 360 x 640); (d) com `prefers-reduced-motion`, o Bobby aparece no destino com fade.
- **Risco ético.** Nenhum.
- **Esforço.** M. **Impacto.** 5.

### Mudança 5 · Os nós são objetos do cenário, não círculos
- **O que muda.** Cada fase é um objeto do diorama: na horta, fase 1 é o canteiro, fase 2 é o espantalho, fase 3 a cerca, fase 4 o galpão, fase 5 a balança. O objeto coberto (lona) é "trancado"; o objeto com brilho suave é "disponível"; o objeto descoberto e com cor é "feito". Nada de círculo azul, cadeado e pontinhos. O rótulo aparece só ao tocar ou ao chegar (balão curto, nunca truncado: até 18 caracteres ou 2 linhas). A área de toque é um retângulo invisível de pelo menos 64 x 64 px sobre o objeto. Para isso não precisa de arte nova: as máscaras de "apagado" e "completo" já existem por etapa; falta só a máscara por peça (5 por etapa, recorte da arte atual).
- **Tela.** Mapa.
- **Referência.** Toca Boca World (lugares são os nós; "explorar lugares" é o que as crianças elogiam, avaliações de 2025, DADO); Hay Day e Clash (prédios como nós; OPINIÃO de prática conhecida).
- **Pronto quando.** (a) Zero elementos `.no-circulo` no DOM do mapa; (b) rótulo nunca truncado em 320, 360, 390 e 1280 (varredura de `scrollWidth > clientWidth`); (c) área de toque de cada fase ≥ 64 x 64 px; (d) o objeto "feito" muda de imagem em até 2 s depois do fim da fase (diferença de pixels na região acima de 2%, medida por captura antes e depois).
- **Risco ético.** Nenhum.
- **Esforço.** M. **Impacto.** 5.

### Mudança 6 · Minijogo de fluência de 30 segundos, sem relógio
- **O que muda.** Depois de cada fase, um convite opcional do guia: "Quer um treino rápido?". O minijogo tem **10 itens** desenhados para levar cerca de 30 s (medido com a filha), **sem cronômetro na tela** e **sem derrota**: as respostas aparecem como objetos da cena (frutas com números, placas com palavras, cartas com sons) e a criança toca na certa; errar só faz a fruta balançar e o item fica para o fim. No fim, "10 de 10, em tempo de explorador", sem recorde nem comparação com outra criança. Três formatos: *caça* (toque o certo entre 3 que surgem), *trilha* (ordene 4 que aparecem um a um), *eco* (ouça e toque, para inglês e português).
- **Tela.** Nova, entre o fim de fase e o mapa; pulável.
- **Referência.** Duolingo "Match Madness" e revisão rápida (OPINIÃO; o Duolingo usa cronômetro, aqui o cronômetro sai); Prodigy (batalha curta como laço de ritmo; Common Sense Media, DADO).
- **Pronto quando.** (a) 3 formatos no ar; (b) mediana de duração entre 25 e 40 s em 10 rodadas com uma criança; (c) nenhum elemento de relógio ou contagem regressiva no DOM; (d) sem caminho de derrota (100 rodadas simuladas terminam); (e) recusar o convite não muda recompensa nenhuma.
- **Risco ético.** Médio: fluência sob tempo pode virar pressão. Mitigação: duração por quantidade, não por relógio; sem recorde pessoal na tela; sem convite repetido na mesma sessão se a criança recusou.
- **Esforço.** M. **Impacto.** 4.

### Mudança 7 · Feedback dentro da cena, painel de base com 20% da altura
- **O que muda.** No acerto: hit-stop, o objeto certo encaixa ou acende, o guia faz a pose `comemora` (na cena, 96 px), a moeda voa do objeto até o contador do topo, e o Bobby (jogador) troca a expressão. O painel inferior encolhe para uma faixa de 64 px com a fala curta e o toque em qualquer lugar da tela continua. No erro: o objeto balança, o guia faz a pose `incentiva` (pata no queixo), a fala "Ainda não" e a resposta certa acende com contorno; o lembrete da aula abre sozinho só no segundo erro seguido. Som e fala por personagem já previstos no plano 2 e 3.
- **Tela.** Pergunta.
- **Referência.** Khan Kids (Kodi comemora pulando, no erro leva a pata ao queixo e aponta para a cabeça; blog 01/05/2025, DADO); Duolingo (animação própria por personagem no acerto; blog 10/11/2020, DADO).
- **Pronto quando.** (a) O painel de feedback mede no máximo 20% da altura da janela em 360 x 640 e 390 x 844; (b) a cena fica visível durante o feedback (a região da cena não é coberta, teste por `elementFromPoint` no centro da cena); (c) do toque em "Verificar" até a próxima pergunta pronta, com um toque de continuar, passam no máximo 1,8 s; (d) o guia troca de pose em até 100 ms; (e) no erro nenhum elemento fica vermelho e nenhum som grave toca.
- **Risco ético.** Baixo. O erro nunca mostra rosto triste.
- **Esforço.** M. **Impacto.** 5.

### Mudança 8 · Sem vidas, sem ofensiva na cara da criança, missões de fazer
- **O que muda.** Saem: 5 corações, "continuar por 50 moedas", "Ofensiva: N dias", "Congeladores", "Jogue uma fase e o dia fica vivo", "Acerte 4 seguidas", "Melhor combo". Entram: o **livro de missões do mundo**: "Plante 2 canteiros", "Arrume a cerca", "Ouça a Rufa contar uma história"; a recompensa de cada uma é uma peça da cena ou um adesivo, fixa e visível antes. A rotina de hoje vira uma linha no mapa ("Hoje: 2 missões", com o pergaminho) e abre só ao tocar. Os dados de ofensiva continuam guardados em `S.legado` e aparecem, se o responsável quiser, no painel dele (desligado por padrão).
- **Tela.** Pergunta, rotina, fim de fase, perfil.
- **Referência.** Toca Boca ("nada de tempo limitado ou pontuações altas", descrição da Play Store, DADO); Khan Kids (sem ofensiva, sem loja); ECA Digital art. 8º, IV e art. 17, § 4º, II (DADO).
- **Pronto quando.** (a) Nenhum elemento `.vida`, nem texto "ofensiva", "congelador", "seguidas", "combo" ou "continuar por" na interface da criança (varredura de texto do DOM nas 17 telas); (b) 3 missões de fazer por dia, geradas a partir do capítulo atual; (c) o painel do responsável mostra o total de minutos do dia e permite definir um limite (art. 17, IV); (d) `S.legado` guarda os valores antigos.
- **Risco ético.** Reduz. É a mudança que mais alinha o app à lei.
- **Esforço.** P. **Impacto.** 3 na sensação, 5 na segurança jurídica.

### Mudança 9 · Fim de fase como cena, não como painel
- **O que muda.** O fim de fase acontece **no mapa**: a câmera vai até o objeto da fase, a lona sai em 480 ms (máscara), o objeto ganha cor, o Bobby e o guia comemoram ao lado, as estrelas acendem sobre o objeto, uma linha de texto ("8 de 8. O canteiro está plantado.") e um botão. Confete só na fase perfeita e saindo do objeto, não da tela. Os 3 cartões de estatística saem. No computador, nada fica atrás do rodapé.
- **Tela.** Fim de fase.
- **Referência.** Nijman (permanência: deixar marca do progresso na cena, DADO); Folmer Kelly (juice que não nasce do mundo quebra a crença, DADO); avaliação de 12 anos no Roblox (rejeita "efeitos de tela exagerados", 16/09/2026, DADO).
- **Pronto quando.** (a) O fim de fase não cria modal (zero `.modal` no DOM nesse estado); (b) duração até o botão aparecer ≤ 3 s, pulável após 1 s; (c) em 1280 x 800 nenhum elemento de texto tem caixa cruzando a do rodapé fixo; (d) o objeto do mapa está diferente antes e depois (diferença de pixels acima de 2%).
- **Risco ético.** Baixo; sem contagem rolando, sem sorteio.
- **Esforço.** M. **Impacto.** 4.

### Mudança 10 · Computador como tela de jogo
- **O que muda.** A partir de 1024 px: a cena ocupa a tela inteira (mapa com arrasto do mouse e setas; pergunta com a cena à esquerda e o painel de interação à direita com 420 px), HUD nos cantos (moedas, som, sair), rodapé de abas vira barra lateral fina à esquerda. Teclado completo: 1 a 4 escolhe, Enter verifica, Espaço continua, setas movem o Bobby entre nós, Esc fecha. `:hover` em tudo que é tocável (o que não existe no celular). Cursor muda sobre objeto arrastável.
- **Tela.** Todas, em 1024 px ou mais.
- **Referência.** Prodigy e Khan Academy no navegador (cena cheia com painel lateral; OPINIÃO de uso conhecido); Duolingo web (1 a 4 e Enter; OPINIÃO de uso conhecido).
- **Pronto quando.** (a) Em 1280 x 800 o conteúdo útil ocupa pelo menos 85% da largura (soma das caixas visíveis); (b) todas as ações da pergunta e do mapa funcionam só pelo teclado (teste CDP com `keyboard.press`); (c) `:hover` presente em 100% dos elementos com `role="button"`; (d) nenhum texto cortado em 1280 x 800 e 1440 x 900; (e) o peso inicial não muda (só CSS e handlers).
- **Risco ético.** Nenhum.
- **Esforço.** M. **Impacto.** 4 (é onde o Filipe testa; é onde a nota dele nasce).

### Mudança 11 · Um modal por vez, e o baú abre no mundo
- **O que muda.** Regra dura: nunca dois modais; uma fila. O bilhete do Bobby vira o Bobby no mapa com um balão e um botão "Ouvir" (sem escurecer a tela). O baú fica **no mapa**, ao lado do Bobby, e abre no lugar: toque, rangido, tampa, o adesivo sobe e vai para o canto do perfil. "Por hoje chega" continua modal (é o único que merece parar tudo).
- **Tela.** Mapa, baú, bilhete, fim de fase.
- **Referência.** Toca Boca World (presentes na agência de correios, no lugar do mundo; descrição da Play Store, DADO); Hay Day e Clash Royale (baú abre onde está; OPINIÃO de prática conhecida).
- **Pronto quando.** (a) Teste automático: em nenhum estado o DOM tem 2 elementos `[role="dialog"]` visíveis; (b) o baú abre em até 1,5 s sem modal; (c) o conteúdo do baú é o mesmo de antes (sem sorteio, conferido em 20 simulações).
- **Risco ético.** Baixo. O baú segue fixo e gratuito (fora da definição de caixa de recompensa do art. 2º, IV).
- **Esforço.** P. **Impacto.** 3.

### Mudança 12 · Objetos de verdade nas perguntas de contar (lote mínimo agora)
- **O que muda.** Em vez de esperar as 360 imagens do plano 14, um **lote mínimo de 20 objetos** para os 5 capítulos da etapa 1 de cada planeta (sementes, conchas, caixas, lanches, fatias; letras de madeira, vagões; placas, arcos, bilhetes), em SVG desenhado no estilo do cenário ou recorte da arte que já existe nos dioramas (as caixas, a balança e as plantas já estão lá). Cada objeto tem 2 estados (normal, marcado) e 1 reação (balança). Medir peso real e tentativas antes de pedir mais.
- **Tela.** Pergunta.
- **Referência.** Khan Kids (contar objetos reais, DADO); DragonBox Numbers (os "Nooms" são objetos com personalidade; RESUMO, sem fonte aberta nesta sessão).
- **Pronto quando.** (a) 20 objetos no `assets/manifesto.json` com peso medido e total abaixo de 60 KB; (b) zero bolinhas genéricas em perguntas da etapa 1; (c) cada objeto passa pela ficha da `BIBLIA-DE-PERSONAGENS.md` (luz, recorte, sem texto); (d) carregados depois da primeira tela.
- **Risco ético.** Nenhum.
- **Esforço.** M. **Impacto.** 4.

### Mudança 13 · Personagens como atores: corpo e rosto em camadas, idle e piscar
- **O que muda.** O guia na pergunta e o Bobby no mapa deixam de ser imagem estática: corpo (pose) e rosto (expressão) em camadas separadas, trocadas por estado (`oi`, `explica`, `comemora`, `incentiva`, `caminha`, `pensa`). Idle: respiração de 2% em 3 s e piscar a cada 4 a 7 s (troca de expressão por 120 ms). Tocar no personagem gera reação (cócegas do plano 3). Companheiro escolhido aparece no mapa ao lado do Bobby (hoje só na aba Personagem).
- **Tela.** Mapa, pergunta, fim de fase.
- **Referência.** Duolingo (máquina de estados com corpo e boca separados; blog de visemas, RESUMO); Jonasson e Purho ("olhos e expressão nos objetos", DADO).
- **Pronto quando.** (a) 6 estados por personagem com troca em até 100 ms; (b) no máximo 2 animações simultâneas em repouso; (c) com `prefers-reduced-motion` o idle para; (d) o companheiro escolhido aparece no mapa em 100% dos casos; (e) peso: 0 KB novo (recorte e composição das 12 poses e 8 expressões existentes).
- **Risco ético.** Pressão parassocial: o personagem nunca pede nada nem sente falta (lista 7.4 do plano).
- **Esforço.** M. **Impacto.** 4.

### Mudança 14 · O que a criança faz fica no mundo (desenho, look, peça)
- **O que muda.** O desenho pintado aparece pendurado no galpão do diorama (miniatura de 48 px no objeto certo); o look escolhido aparece no Bobby do mapa e do fim de fase (hoje só na aba); a peça acesa pela fase fica acesa para sempre e tem um ponto de toque com a fala do capítulo. O perfil troca os 6 cartões de estatística por **uma visão do mundo** (os 3 planetas com as peças acesas) e uma linha de números embaixo.
- **Tela.** Mapa, perfil, colorir, looks.
- **Referência.** Toca Boca ("decorar e explorar lugares" é o elogio, avaliações 2025, DADO); Brawl Stars (o progresso está no personagem, avaliação de 07/09/2026, DADO); Nijman (permanência, DADO).
- **Pronto quando.** (a) Desenho salvo aparece no mapa em até 2 s; (b) look aparece em 3 lugares (mapa, pergunta, fim); (c) o perfil mostra os 3 planetas com peças acesas (contagem igual à do estado); (d) pontos de toque com fala em 100% das peças acesas.
- **Risco ético.** Nenhum. Nada de "faltam N".
- **Esforço.** M. **Impacto.** 4.

### Mudança 15 · Protocolo de teste com 3 crianças antes e depois de cada onda
- **O que muda.** 20 minutos por criança (a filha, uma de 7 e uma de 11 a 12), celular dela, sem ajuda. Um adulto anota a cada minuto: toques (contados pelo app em `S.telemetriaLocal`, nunca enviados), perguntas em que ela pediu ajuda, risadas ou "uau" (contagem manual), tempo olhando para fora da tela, e, no fim, 3 perguntas: "O que você fez no mundo?", "De quem é essa voz?" (5 sons), "Quer jogar amanhã? Por quê?". Resultado numa tabela em `docs/mesa/testes-com-criancas.md`.
- **Tela.** Nenhuma.
- **Referência.** Toca Boca ("envolvemos as crianças em cada passo"; descrição da Toca Cars, RESUMO); Swink (jardim de teste, DADO).
- **Pronto quando.** (a) Tabela preenchida antes da onda 1 (linha de base) e depois de cada onda; (b) a filha responde "o que você fez no mundo" com pelo menos 2 verbos (plantei, arrumei); (c) a criança de 11 a 12 não diz "é de bebê" (anotar a frase dela).
- **Risco ético.** Dado de criança: só nomes de pele (A, B, C), nada gravado em vídeo, nada enviado.
- **Esforço.** P. **Impacto.** 5 (é o que impede "fazer como você acha").

### Tabela de prioridade

| # | Mudança | Impacto | Esforço | Arte nova | Onda |
|---|---|---|---|---|---|
| 3 | Pressionado, hit-stop, permanência, jardim | 4 | P | não | 1 |
| 8 | Sem vidas, sem ofensiva, missões de fazer | 3 (+lei) | P | não | 1 |
| 11 | Um modal por vez, baú no mundo | 3 | P | não | 1 |
| 1 | Verbo na cena (contar, plantar, letra, placa) | 5 | M | recorte | 1 |
| 7 | Feedback dentro da cena | 5 | M | não | 1 |
| 4 | Bobby anda, câmera segue | 5 | M | não (P05 Caminha, quadros A e B, já consta na `BIBLIA-DE-PERSONAGENS.md`) | 1 |
| 15 | Protocolo com 3 crianças (linha de base) | 5 | P | não | 1 (antes) |
| 5 | Nós viram objetos do cenário | 5 | M | máscaras por peça | 2 |
| 10 | Computador como tela de jogo | 4 | M | não | 2 |
| 12 | 20 objetos reais | 4 | M | 20 | 2 |
| 2 | Gramática de 5 toques com proporção | 5 | G | não | 2 |
| 9 | Fim de fase como cena | 4 | M | não | 2 |
| 6 | Minijogo de fluência de 30 s | 4 | M | não | 3 |
| 13 | Personagens como atores | 4 | M | não | 3 |
| 14 | O que a criança faz fica no mundo | 4 | M | não | 3 |

**Onda 1 (uma semana):** 3, 8, 11, 1, 7, 4, com 15 rodando antes e depois. Não depende de imagem nova além de recortes. **Onda 2:** 5, 10, 12, 2, 9. **Onda 3:** 6, 13, 14. As mudanças do plano de identidade (som, falas, Embaralho, cerimônias, clima) encaixam depois da onda 1 desta mesa, porque todas ganham quando existe um verbo e uma cena para reagir.

---

## 8. Tipos de interação por matéria (para a mudança 2)

| Verbo | Matemática | Português | Inglês | Caminho sem arrastar | Som (lista do plano 2) |
|---|---|---|---|---|---|
| **Tocar** | Contar sementes uma a uma; tocar o maior número entre dois objetos da cena | Tocar a vogal dentro da palavra; tocar a palavra com erro na frase | Ouvir o Otto e tocar a placa ou a figura certa na cena | Já é toque | 2, 4 |
| **Arrastar** | Repartir 12 maçãs em 3 cestas; levar a dezena para a coluna certa | Levar a sílaba para formar a palavra; levar o ponto final para o fim da frase | Levar a palavra ao objeto da cena (dog até o cachorro) | Toque origem, toque destino | 26, 4 |
| **Ligar** | 1/2 com 0,5; 3 + 4 com 7 | BA com BA-NA-NA; palavra com figura | cat com a figura; hello com olá | Toque, toque | 26, 4 |
| **Ordenar** | 0,25 · 0,5 · 0,75 do menor ao maior; passos de uma conta | Palavras de uma frase; cenas de uma história | Dias da semana; frases de um diálogo | Toque na carta, toque no lugar | 26 |
| **Traçar** | Desenhar o número da resposta; completar a reta numérica com o dedo | Traçar a letra inicial; escrever a palavra curta | Traçar a letra do som ouvido | Teclado numérico ou de letras | 3, 4 |

Regra de proporção por fase de 8 perguntas: pelo menos 3 verbos, nunca 3 iguais seguidos, pelo menos 1 com áudio obrigatório (ouvir e tocar) em todas as matérias.

---

## 9. O mapa como lugar vivo (complemento ao plano 9)

Ordem do que faz o mapa parecer lugar, do mais barato para o mais caro (OPINIÃO):
1. **O Bobby anda** (mudança 4) e **os nós são objetos** (mudança 5). Sem isso, clima e hora do dia são enfeite em cima de círculos.
2. **O que a criança fez fica lá** (mudança 14): canteiro plantado, desenho pendurado, companheiro ao lado.
3. **Três pontos de toque por cenário** que reagem (o espantalho acena, a balança oscila, o foguete solta fumaça), com uma fala cada, uma vez por dia. Partículas só saindo do objeto tocado.
4. **Clima e hora do dia** (plano 9), confirmados pela avaliação de 10/01/2025 do Toca Boca ("chuva, pétalas caindo, folhas caindo"). Por sobreposição de CSS, 0 KB.
5. **Companheiro andando atrás** (plano 9). Depois de tudo acima.

Regra que vale para tudo: nada some, nada vence, nada cobra volta. A noite no mapa é noite; não é "vá dormir".

---

## 10. Computador (resumo da mudança 10)

O Filipe testa no computador; a nota 5 nasceu lá. O computador hoje é um celular de 480 px no meio de um vazio escuro (capturas 1280 x 800). O que muda: cena cheia, HUD nos cantos, painel de interação à direita, teclado completo (1 a 4, Enter, Espaço, setas, Esc), `:hover` e cursor por tipo de objeto, e o rodapé de abas vira barra lateral. Critério: 85% da largura em uso, tudo funciona sem mouse, nenhum texto atrás do rodapé.

---

## 11. Como saber se melhorou (complementa a seção 15 do plano)

1. **Teste dos verbos:** a filha diz o que fez no mundo com 2 ou mais verbos.
2. **Teste da variedade:** em 15 minutos ela encontra pelo menos 4 verbos diferentes (contado pelo app, localmente).
3. **Teste do toque:** 20 toques medidos pelo CDP com reação no mesmo quadro.
4. **Teste do modal:** em 15 minutos de jogo, no máximo 2 modais aparecem (o bilhete sai, o baú sai, fim de fase sai; sobra o "Por hoje chega" e a parada).
5. **Teste da lei:** varredura de texto das 17 telas sem "ofensiva", "dias seguidos", "congelador", "acerte N seguidas", "continuar por".
6. **Nota do Filipe:** de 5 para 7 depois da onda 1 e para 8 depois da onda 2, no mesmo jogo de 15 minutos, no computador e no celular.

---

## 12. O que não rodou e o que fica em aberto

- **Não rodei** o app nem o Playwright; o diagnóstico vem das 20 capturas. Toques, tempos e sobreposições precisam ser medidos de verdade na onda 1.
- **Firecrawl** estava sem autenticação (erro 401); usei busca e navegador. **Mobile Time** só abriu pelo navegador; **App Store brasileira** não abriu por nenhum caminho (as avaliações vieram da Play Store BR). **DragonBox Numbers** não existe mais na Play Store BR (404).
- **Não li**: o relatório completo da TIC Kids Online 2024, os decretos de 18/03/2026 do ECA Digital, o PDF de Hicks e outros (DiGRA 2018), o texto do Econsultancy sobre os testes A/B da Duolingo (403), o post de visemas da Duolingo (só resumo). Nada disso decide uma mudança; cada uso está marcado RESUMO.
- **Comscore e Newzoo** com recorte de crianças no Brasil: não achei relatório aberto. O dado de "o que jogam" vem do Panorama Mobile Time/Opinion Box 2025 (pais respondendo, não crianças).
- **Jurídico**: a leitura do ECA Digital aqui é leiga e cautelosa. Confirmar com o advogado já previsto no README, em especial ofensiva, missão de desempenho e o baú diário.
- **Custo desta entrega:** R$ 0.
