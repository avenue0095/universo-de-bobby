# O Universo de Bobby · Fase 2 · Especificação de produto e pedagogia

Data: 24/10/2026. Base: `index.html` no commit `c9b07e9` (6.484 linhas), pesquisa da Fase 1 em `pesquisa/` e decisões aprovadas no cofre (`bobby-site/RESPOSTAS.md` e `GOSTO.md`). Nada foi alterado no app. Nenhum áudio nem imagem foi gerado, nenhum crédito foi gasto.

## 0. Como ler

**Convenção de fonte.** Toda afirmação factual traz a fonte. O que não tem fonte é inferência e vem marcado **OPINIÃO**.

| Marca | Significa |
|---|---|
| `index.html:1606` ou `index.html:genQuestions()` | linha ou função no commit `c9b07e9` (conferido por `grep` nesta sessão) |
| `[F1]` a `[F27]` | fonte do relatório `pesquisa/02-pedagogia-por-materia.md`, seção 8 |
| `[01-A15]` | item A15 da tabela A de `pesquisa/01-duolingo-retencao.md` (`[01-D5]` = adendo D, linha 5; `[01-C]` = "não confirmado") |
| `[03-§2.1]` | seção de `pesquisa/03-etica-e-lgpd-infantil.md` |
| `[MEDIDO]` | número que saiu de contagem rodada nesta sessão sobre o código. Os scripts em `docs/anexos/` reproduzem só os números de áudio, ofensiva, retenção e Leitner; as contagens de tipos de pergunta (2,8% interativas, 342 de 400 de inglês dependentes de áudio, 22.476 enunciados distintos de matemática, 2.539 de português e 206 de inglês) foram medidas em sessão e NÃO têm script salvo, então precisam ser refeitas antes de virar meta |
| **OPINIÃO** | inferência, hipótese a medir ou escolha de produto |

**Anexos executáveis** (em `docs/anexos/`, nada fora de `docs/` foi tocado):
- `extrair-audio.js` gera `inventario-audio.tsv` (2.823 linhas) a partir do `index.html`. Reproduz os números da seção 9.
- `referencia-ofensiva.js` implementa a regra da seção 5.3, com 12 testes (`node referencia-ofensiva.js`).
- `simulacao-leitner.js` simula a carga de revisão da seção 2.5.

**Fases.** Fase 2 = motor e dados, sem tela nova obrigatória. Fase 3 = tudo que toca a interface, junto do visual novo. Fase 4 = nuvem, conta, e-mail, push. A classificação por item está na seção 10.

**Decisões já tomadas e não reabertas** (RESPOSTAS.md): `index.html` é a fonte; áudio todo gravado, sem voz do aparelho; visual "Cosmos futurista limpo", mais realista; elenco novo; botão fixo "Meu personagem"; cenário por matéria; um desenho por etapa (30); ordem de reforma Inglês, Português, Matemática; três faixas 7-8, 9-10, 11-12; ofensiva com congelador ganho, sem zerar, sem culpa; ciclo diário (meta de 5 min escolhida pelo responsável, baú, 3 missões, bilhete do Bobby); lembretes ao responsável; Liga da Família só com convidados; tudo local até a Fase 4; sem dado pessoal; ECA Digital em vigor desde 17/03/2026 [03-§2.1].

---

## Resumo: as 12 decisões de maior impacto

1. **Quem decide o que revisar é o sistema, não a criança**: caixas tipo Leitner (1, 3, 7, 14, 30 dias), 10 perguntas por dia no máximo, e só entram na fila os erros e 3 itens-chave por fase (seção 2). A simulação mostra que rastrear as 430 palavras de inglês uma a uma estoura qualquer limite razoável [MEDIDO, seção 2.5].
2. **Ofensiva viva**: congelador ganho a cada 7 dias de jogo (máx. 2), gasto sozinho; sem congelador a ofensiva "descansa", volta pela metade (teto 10) e se recupera com um bloco extra no mesmo dia (seção 5.3, código de referência testado).
3. **Dois degraus no dia**: "dia vivo" (1 bloco, mínimo baixo) mantém a ofensiva; "meta cheia" (5 min medidos em perguntas, não em relógio) abre o baú. Separar os dois segue o teste da Duolingo [01-A2, A3] e evita "recompensa por tempo de uso" [03-§2.1, Decreto art. 9º III].
4. **XP e moeda deixam de ser a mesma variável**: o app já guarda `ganhoTotal` (ganho bruto), então a migração é exata: XP = `ganhoTotal`, moedas = saldo atual `S.xp` (seção 5.7).
5. **Fuso corrigido**: o dia passa a ser o calendário local (`index.html:4869` usa UTC; no Brasil, depois das 21h o app já conta o dia seguinte) (seção 5.8). Quem migra ganha 1 congelador de cortesia.
6. **Lembrete vai ao responsável por arquivo de calendário (.ics)** gerado no próprio aparelho, sem servidor. Push de verdade exige servidor e VAPID e fica na Fase 4. Notification Triggers não é caminho (seção 6).
7. **Estado v4 em chave nova** (`universo-bobby-v4`), com a chave antiga intocada. O código v3 só guarda campos que conhece (`estadoDe`, `index.html:4762`), então escrever v4 na chave antiga seria apagado em silêncio por uma aba velha (seção 8).
8. **Áudio é composto**: 1.837 textos exatos (1.400 em pt-BR, 437 em inglês americano) mais cerca de 960 "quadros" de enunciado, números e nomes, ~180 minutos, 32 a 43 MB (seção 9). Enunciado com número aleatório não dá para gravar inteiro: há 22 mil variações só em matemática [MEDIDO].
9. **Inglês perde a dependência de ouvir-e-tocar** (342 de 400 perguntas) com tipo de pergunta que sobe de dificuldade conforme a caixa: reconhecer, ouvir, produzir, frase, ditado (seção 1.4).
10. **Matemática passa de 2,8% de perguntas interativas para meta de 25%** com 8 tipos novos (arrastar grupos, reta numérica, ordenar, ligar pares, barra-modelo, exemplo resolvido com lacuna, fatos em rodadas, "por quê?") (seção 1.5).
11. **Diagnóstico de entrada de 12 perguntas no máximo**, sem nota e sem coração, que só posiciona a trilha (seção 3.4).
12. **Medição local por evento, sem dado pessoal**; D1/D7/D30 por perfil no aparelho. Coorte semanal de verdade só com várias famílias, ou seja, exportando pacotes anônimos à mão agora e conta na Fase 4 (seção 7).

---

## 1. Trilha por matéria e faixa etária

### 1.1 Estrutura (vale para as três matérias)

O esqueleto atual não muda: 10 unidades ("mundos") × 5 fases por matéria, 150 fases (`index.html:UNITS_MAT` 943, `UNITS_PT` 2666, `UNITS_EN` 3864; `TOTAL_*`). A mudança é **como a criança percorre e o que cada fase pede**.

**Faixas.** O perfil guarda `faixa` em vez de `nivel`. Mapeamento da migração: `facil`→`f78`, `medio`→`f910`, `forte`→`f1112` (os valores reais do código são esses três, `index.html:4778` e `6369-6370`; o relatório 00 escreveu `dificil` por engano).

**O que a faixa controla** (os três botões):

| Alavanca | f78 | f910 | f1112 |
|---|---|---|---|
| Narração dos enunciados | automática | no toque | no toque |
| Opções em pergunta de escolha | 3 | 4 | 4 |
| Dica depois do erro | aparece sozinha | botão | botão |
| Material concreto / figura | sempre | some quando domina | só sob pedido |
| Ponto de partida (antes do diagnóstico) | unidade 1 | ver tabela | ver tabela |

Hoje só `facil` tem essas ajudas (`index.html:5213`, `5235`, `5324`, `5498`). A faixa passa a ser o valor inicial; a **camada** (1 apoiado, 2 padrão, 3 desafio) por habilidade ajusta em cima dela (seção 3).

**Ponto de partida e foco (antes do diagnóstico; OPINIÃO, o diagnóstico da seção 3.4 corrige):**

| Matéria | f78 | f910 | f1112 |
|---|---|---|---|
| Matemática | começa na U1; foco U1 a U4 | começa na U2; foco U2 a U7 | começa na U4; foco U4 a U10 |
| Português | começa na U1; foco U1 a U5 | começa na U3; foco U3 a U8 | começa na U5; foco U5 a U10 |
| Inglês | U1 para todos | U1 para todos | U1 para todos |

Inglês começa na U1 em todas as faixas porque a criança brasileira de 7 a 12 anos é, em regra, iniciante em segunda língua (**OPINIÃO**; não achei fonte aberta, [F18] a [F20] não tratam do caso). O que muda no inglês é a profundidade (ver 1.4). Nenhuma unidade é bloqueada por faixa: fases puladas ficam jogáveis.

**Níveis dentro da unidade.** Cada fase tem 6 geradores de pergunta (`makers`, `index.html:L()`/`LP()`/`LE()`). Cada gerador ganha uma etiqueta de dificuldade `dif` 1, 2 ou 3 (seção 3.3). A camada da habilidade escolhe quais geradores entram.

### 1.2 Princípios que viram regra de produto

| Regra | Evidência | Onde entra |
|---|---|---|
| Recuperação (produzir a resposta) antes de reler | utilidade alta [F1]; quiz com reexposição, evidência forte [F2] | toda fase abre com 3 a 5 itens de aquecimento (seção 2.4) |
| Resposta produzida vale mais que reconhecimento | [F2] (teste que exige lembrar rende mais) | tipo de pergunta sobe de reconhecer para produzir conforme a caixa |
| Feedback que explica o erro específico | alta informação d = 0,99 contra 0,46 corretivo e 0,24 reforço [F6] (heterogeneidade alta) | campo `porque` por distrator (seção 1.7) |
| Exemplo resolvido, depois parcial, depois sozinho | IES 2007 rec. 2 moderada [F2]; instrução explícita forte [F8] | aula nova (seções 1.4 e 1.5) |
| Repetição espaçada | utilidade alta [F1]; intervalo ótimo 10% a 20% do prazo de retenção [F1] | seção 2 |
| Intercalação | d = 0,83 em 7º ano [F4]; nada com 7 a 9 anos [F3 e F4] | só a partir da 2ª semana de cada tópico, e medir em f78 |
| Domínio antes de avançar, com saída pelo pré-requisito | meta-análises antigas citadas de segunda mão [F7]; critério de 80% em dois dias é palpite **OPINIÃO** [F7 e seção 2.6 do relatório 02] | seção 3 |

### 1.3 Português (reforma 2ª; vem antes da matemática)

**Método hoje.** Aula de 3 a 4 passos de texto estático (`AULAS['p*']`, 200 passos, 27.464 caracteres [MEDIDO]); geradores de escolha, "montar com letras" (`texto`) e "montar sílabas" (`silabas`). Há 56 palavras na lista `PAL` (`index.html:2629`) e apenas **3 textos para leitura** (`TEXTOS`, `index.html:3312`). Perguntas interativas: 37 `texto` + 15 `silabas` por 400 [MEDIDO].

**O que muda.**

1. **Consciência fonológica ligada à letra, com escrita.** Evidência forte para som-letra e para decodificar escrevendo [F10, rec. 2 e 3]. Hoje as sílabas aparecem só como texto na tela. Passa a existir áudio para cada sílaba e rima, tipo "contar sons" e "rima" (seção 1.6). A ordem dos grafemas do mais regular ao mais irregular precisa de **validação por especialista brasileiro**; não há fonte aberta para propor a ordem [F10, ressalva do relatório 02 §4.2]. Português é mais regular que o inglês dos guias [F10].
2. **Texto conectado todo dia.** Evidência moderada [F10, rec. 4]. Meta de conteúdo: **60 textos curtos graduados** (2 por unidade × 3 faixas × 10 unidades), com leitura ecoada: o narrador lê palavra por palavra com destaque e depois a criança lê sozinha. **OPINIÃO** para o número 60; hoje existem 3.
3. **Estratégias de compreensão uma por vez** (prever, questionar, resumir, estrutura da história), com modelar, guiar, soltar. Evidência forte [F11]. Cabe nas U9 e U10.
4. **Ortografia por ditado e recuperação espaçada**: a criança ouve, escreve, vê o erro específico [F10 rec. 3 inclui escrita; F1 cita listas de ortografia]. Intercalação de regras (s/ss/ç, g/j, x/ch) é extrapolação não testada nas fontes abertas [relatório 02 §2.7] (**OPINIÃO**).
5. **Corrigir o texto fixo no feminino do relatório dos pais** (`index.html:5863`, "Onde ela mais erra").

**Unidades de Português, objetivos por faixa.** Convenção: ● núcleo da faixa, ○ jogar se o diagnóstico mandar, n/a fora do foco (continua jogável).

| U | Título atual | Objetivo (a criança consegue...) | 7-8 | 9-10 | 11-12 |
|---|---|---|---|---|---|
| 1 | As letras | nomear e reconhecer as 26 letras, vogais e consoantes, maiúscula e minúscula, ordem alfabética | ● nomear e ordenar com áudio de cada letra | ○ revisão rápida (diagnóstico) | n/a |
| 2 | As sílabas | separar e juntar sílabas simples; ligar sílaba a som | ● bater palmas e contar sons (tipo novo), escrever sílabas | ○ | n/a |
| 3 | Primeiras palavras | ler e escrever palavras de 2 e 3 sílabas | ● ditado de palavras de 2 sílabas, depois 3 | ● leitura ecoada de palavras | ○ |
| 4 | Os sons difíceis | c/ç, r/rr, s/ss/z, ch/lh/nh, m antes de p/b | ● c e r primeiro | ● todos, com ditado | ○ revisão |
| 5 | As frases | frase completa, maiúscula, ponto, ordem das palavras | ● frase de 3 palavras montada | ● frases de 5 a 7 palavras e pontuação | ● |
| 6 | Os nomes das coisas | substantivo, artigo, número, gênero, nome próprio | ○ só plural e artigos | ● | ● |
| 7 | Como é e o que faz | adjetivo, verbo, concordância, tempos | n/a | ● | ● com texto curto |
| 8 | Escrever certo | ç, g/j, x/ch, s/z, parônimos | n/a | ● ditado de 6 palavras por rodada | ● com intercalação das regras |
| 9 | Acentos e pontuação | acento agudo, til, vírgula, travessão de fala | n/a | ○ | ● em texto lido |
| 10 | Ler e entender | bilhete, receita, historinha, achar a informação (Saeb: eixo leitura [F27]) | n/a | ○ | ● uma estratégia por fase, textos de 80 a 150 palavras |

Fonte dos eixos: apropriação do sistema de escrita, leitura e produção textual, na matriz de alfabetização do 2º ano [F27]. A BNCC não foi aberta e **não é citada**.

### 1.4 Inglês (reforma 1ª)

**Método hoje.** Cada fase tem 3 a 5 palavras (`LEX`, `index.html:4322`: 194 entradas, 186 palavras únicas [MEDIDO]) e 6 geradores em progressão apresentar, reconhecer, ouvir, produzir, frase, escrever (`enMakers()`, `index.html:4407`). **342 de 400 perguntas sorteadas dependem de ouvir (85,6%)** e 40 são de escrever [MEDIDO]. Falha de áudio derruba a galáxia (relatório 00 §1.2, B7). O primeiro gerador mostra a resposta no enunciado de propósito (é a apresentação), mas parece teste (B8).

**O que muda.**

1. **Pergunta sobe de tipo com a caixa** (seção 2.3): caixa 1 reconhecer com áudio; caixa 2 ouvir e escolher (agora com imagem, Fase 3); caixa 3 produzir (montar ou digitar); caixa 4 completar a frase; caixa 5 ditado. Casa com "recuperação que exige lembrar" [F2].
2. **Histórias curtas narradas, graduadas**, com o texto acompanhando o áudio e 2 a 3 perguntas de compreensão. A narração embutida ajuda compreensão e palavras novas, mas **não substitui o adulto lendo junto** [F18]. Evitar pontos tocáveis decorativos no texto: não tiveram benefício [F18]. Meta: **10 histórias por faixa de nível de leitura** (uma por unidade; 40 a 120 palavras) (**OPINIÃO** para o tamanho). Falta de evidência: nenhum estudo causal com app de inglês para 7 a 12 anos [relatório 02 §5.1].
3. **Vocabulário em ciclos de vários dias com atividades variadas** (ouvir, ver, escolher, escrever), seguindo a lógica forte do IES para alunos de inglês [F12], com a ressalva de que são alunos imersos (muito mais exposição que a criança brasileira) [F12].
4. **Módulo curto de sons** que o português não tem (th, vogais curtas), sempre ligado a palavras reais e a histórias: phonics em EFL dá efeito moderado em habilidades de base e pequeno em palavras reais [F19] (**OPINIÃO** na escolha dos sons). Entra na U6 (corpo: *three*, *mouth*) e U10.
5. **Sem promessa de fluência.** O app promete vocabulário, compreensão de histórias curtas e prática de sons [relatório 02 §5.4].
6. **Sem microfone.** A criança não grava a própria voz: voz de criança é dado de alto risco [03-§4.1]. "Fale em voz alta e toque *consegui*" é autocheque sem verificação (**OPINIÃO**: usar só como atividade de pausa, nunca como medida).

**Unidades de Inglês.**

| U | Título | Objetivo | 7-8 | 9-10 | 11-12 |
|---|---|---|---|---|---|
| 1 | Hello! | cumprimentar, dizer o nome, contar até 3 | ● áudio + imagem, sem escrita | ● + frase curta | ● + escrever |
| 2 | Colors and school | 9 cores, 5 objetos da escola | ● ouvir e apontar | ● produzir | ● frase "The ... is ..." |
| 3 | My family | 12 palavras de família | ● ouvir e apontar | ● + história de 40 palavras | ● |
| 4 | Animals | 15 animais | ● | ● + sons dos bichos | ● |
| 5 | Food and drinks | 15 itens de comida | ● | ● "I like ..." | ● pedir comida |
| 6 | Body and clothes | corpo e roupa, plural irregular (foot/feet) | ● | ● | ● + módulo de sons (th) |
| 7 | My house | casa, cômodos, preposições on/in | ● | ● | ● |
| 8 | What I do | 15 verbos, "I can / I like" | ● | ● | ● |
| 9 | Questions | what, where, who, when, how many, how old | ○ | ● | ● perguntar e responder |
| 10 | Everyday English | ontem/hoje/amanhã, frases prontas, pedidos, cognatos e falsos amigos | n/a | ○ | ● história de 120 palavras |

Observação: as fases `e10.1` a `e10.4` já têm geradores próprios (`custom`, 12 makers); `e10.5` é o desafio.

### 1.5 Matemática (reforma 3ª)

**Método hoje.** Aula de 3 a 4 passos em texto, com figura (`AULAS` mat, 154 passos, 25.769 caracteres [MEDIDO]); caminho concreto, desenho, número, via material dourado, barras e fatias (`dourado()`, `index.html:898`). Perguntas: **escolher 197 (184 + 13 com figura) e digitar 192 (180 + 12 com figura) de 400**; as quatro interativas (`blocos`, `fracao`, `grupinhos`, `dinheiro`) somam **11,2 por 400 = 2,8%** [MEDIDO]. A Fase 1 falava em "~12 de 400", confere.

**O que muda.**

1. **Concreto, pictórico, abstrato com retirada gradual.** Representações visuais e manipulativos têm evidência moderada, mas dentro de pacotes de intervenção [F8]; o guia manda ir tirando o concreto e ensinar a ligação explicitamente [F8]. O concreto aqui é virtual; não há fonte aberta sobre manipulativo digital (**OPINIÃO**: hipótese a medir) [relatório 02 §3.3]. Regra: cada habilidade tem 3 degraus de apoio (blocos visíveis, blocos esmaecidos, só números), e a camada da habilidade escolhe o degrau.
2. **Exemplo resolvido narrado, depois parcial, depois sozinha.** Instrução explícita sistemática tem evidência forte [F8]; alternar exemplos resolvidos e problemas, moderada [F2].
3. **Fatos básicos em rodadas curtas** (famílias de fatos 7×8, 8×7, 56÷7, 56÷8), 3 a 5 minutos, com estratégia ensinada antes (contar adiante, decompor, dobrar) [F8]. O guia do IES sugere 10 min por sessão; o Bobby usa 3 a 5 (**OPINIÃO**, coerente com a meta de 5 min total). Tempo de resposta é dado para o sistema, não contagem regressiva na tela (**OPINIÃO**; as fontes abertas não medem ansiedade) [relatório 02 §3.4].
4. **Problemas com texto por esquema** (juntar, tirar, comparar, repartir, razão), forte [F8]; o *bar model* aparece na avaliação de mastery da EEF [F7], mas o guia fala de esquemas, não do bar model [relatório 02 §3.2]. Não vender "método Singapura": o único ensaio aleatório lido deu efeito pequeno e frágil (0,10 DP, não significativo) [F7].
5. **Intercalação** na "Revisão do dia" e no desafio, começando na 2ª semana de cada tópico [F3, F4]. Para 7 a 9 anos é hipótese; medir (seção 2, relatório 02 §9).
6. **Mais perguntas de resposta produzida**, menos escolha entre números sorteados.

**Unidades de Matemática.**

| U | Título | Objetivo | 7-8 | 9-10 | 11-12 |
|---|---|---|---|---|---|
| 1 | Números e contagem | contar, comparar, valor posicional até 999, arredondar | ● até 100 com blocos | ● até 1.000 | ○ |
| 2 | Somar e subtrair | fatos até 20, contas até 1.000, problemas de juntar/tirar | ● fatos até 20; fatos em rodadas | ● | ○ |
| 3 | Multiplicação | ideia de grupos, tabuada, ×10/100/1000, 2 algarismos | ○ grupos e tabuada 2 a 5 | ● | ○ |
| 4 | Divisão | repartir, exata, com resto, dobro/metade, múltiplos e primos | n/a | ● | ● |
| 5 | Frações | partes do inteiro, equivalentes, comparar, somar, fração de quantidade | n/a | ○ metade, terço, quarto | ● |
| 6 | Decimais e dinheiro | décimos, centésimos, comparar, somar, troco, ×10/100 | n/a | ○ dinheiro | ● |
| 7 | Porcentagem e proporção | %, cálculo mental 10%/25%/50%, desconto, razão, regra de três | n/a | ○ 50%, 25% | ● |
| 8 | Geometria e medidas | formas, perímetro, área, ângulos, unidades | ○ formas | ● perímetro, unidades | ● área, ângulos |
| 9 | Álgebra inicial | incógnita, ordem das operações, equação, potência, raiz | n/a | n/a | ● |
| 10 | Dados, negativos e desafios | média, gráficos, probabilidade, negativos, desafio final | n/a | ○ gráficos | ● |

### 1.6 Tipos de pergunta novos

Hoje: matemática 8 variantes de tipo (2,8% interativas), português 8, inglês 3 [MEDIDO]. Nenhuma pergunta usa arrastar e soltar, ordenar, ligar pares, escolher a figura, ditado ou leitura em voz alta (relatório 00 §2.3).

| ID | Tipo | Interação | Matéria / onde | Áudio | Arte nova? | Esforço |
|---|---|---|---|---|---|---|
| T1 | `arrastar-grupos` | arrasta itens para N grupos, vê o total | MAT U3, U4 | enunciado | não | M |
| T2 | `reta-numerica` | arrasta um marcador numa reta | MAT U1, U5, U6, U10 | enunciado | não | M |
| T3 | `ordenar` | arrasta cartas para ordenar (números, frações, decimais, passos, palavras) | MAT, PT U5, EN U10 | enunciado | não | M |
| T4 | `ligar-pares` | liga equivalentes (1/2 = 0,5 = 50%; palavra a imagem; EN a PT) | MAT U5-U7, PT, EN | cada cartão | sim (imagens) | M |
| T5 | `barra-modelo` | preenche segmentos de uma barra para um problema de texto | MAT U2.5, U4, U5, U7 | enunciado | não | G |
| T6 | `exemplo-lacuna` | exemplo resolvido com 1 passo vazio, depois 2 | MAT todas | passos narrados | não | M |
| T7 | `fatos-rodada` | 10 fatos seguidos, sem relógio visível | MAT U2, U3, U4 | números | não | P |
| T8 | `por-que` | escolhe a explicação certa entre 3 | MAT, PT, 1 por fase | enunciado + opções | não | P |
| T9 | `contar-sons` | toca uma vez por sílaba ou som enquanto o áudio toca | PT U1-U3, EN U6 | palavra | não | M |
| T10 | `rima` | ouve 3 palavras, escolhe a que rima | PT U2-U3 | 4 palavras | não | P |
| T11 | `ditado-montar` | ouve a palavra e monta com letras; mostra o erro específico | PT U3-U8, EN | palavra | não | P (o tipo `texto` já existe) |
| T12 | `marcar-no-texto` | toca a frase que responde à pergunta | PT U10 | texto lido | não | M |
| T13 | `leitura-ecoada` | narrador lê com destaque, criança toca a próxima palavra | PT, EN histórias | texto inteiro | não | M |
| T14 | `ouvir-imagem` | ouve a palavra e toca a figura certa | EN U2-U7 | palavra | sim | M |
| T15 | `historia-pergunta` | história narrada + 2 a 3 perguntas | EN, PT U10 | história | sim (cenas) | G |
| T16 | `par-minimo` | ouve *ship/sheep*, *three/free* e escolhe | EN U6, U10 | pares | não | P |

**Meta de mistura por 400 perguntas (OPINIÃO, a medir):**

| Matéria | Hoje interativas | Meta |
|---|---|---|
| Matemática | 11 (2,8%) | 100 (25%) |
| Português | `texto` 40 + `silabas` 16 + `ouvir` 20 = 76 (19%) | 160 (40%) |
| Inglês | `texto` 40 (10%) | 200 (50%, fora ouvir-e-tocar) |

Cada tipo novo entra com: gerador, `dica` degrau 1 e 2 (`mostrarDica`, `ajudaForte`, `index.html:5410` e `5428` têm um `if` por tipo hoje), `porque` por erro comum, rótulo de acessibilidade, teclado (atalhos 1 a 4 e Enter já existem, `index.html:6412-6426`) e rodada de teste sem áudio.

### 1.7 Feedback que explica (vale para todas as matérias)

`conferir()` (`index.html:5462`) mostra "A resposta certa é X" e manda a pergunta para o fim da fila. Isso é feedback corretivo (d = 0,46); o ganho citado está no de alta informação (d = 0,99), que diz o que errou, por quê e o que fazer [F6]. Os números misturam delineamentos diferentes [F6]; tratar como direção, não promessa.

**Contrato.** Toda pergunta pode trazer `porque`, um mapa `valor errado → texto de uma frase`. Exemplos de regra automática por gerador:
- subtração em que a criança responde a soma: "Você juntou. Aqui o problema pede tirar."
- fração: resposta igual ao denominador: "Esse número diz em quantas partes o inteiro foi cortado. Falta contar as pintadas."
- ortografia: marca a letra que difere e mostra a regra da aula.
Sem `porque`, usa o passo "Pra não esquecer" da aula (já vem de `lembreteDaAula()`, `index.html:5384`). Cobrir primeiro os 20 geradores com mais erro (a taxa já sai de `S.stats.porLicao`, `telaResponsavel()`, `index.html:5831`).

**Hipercorreção** (pedir confiança antes de revelar): só existe evidência em adultos jovens [F16, F17]. Fica **desligada**; entra como experimento com subconjunto de itens.

---

## 2. Prática espaçada e revisão de erros

### 2.1 O que existe hoje

- `S.errados[materia+mundo]`: lista de até 30 perguntas congeladas `{type, prompt, answer, options, figure}` (`guardarErrado`, `index.html:5580`). Chave por **mundo**, sem id de fase nem de habilidade.
- Só reaparecem na "Revisão do mundo" (medalha) depois das 5 fases (`abrirRevisaoMundo`, `index.html:5596`): 10 erros sorteados + perguntas novas até 6. Acertar tira do caderno (`tirarErrado`).
- Não há revisão diária nem intervalo (relatório 00 §2.5).

### 2.2 Itens e habilidades

Dois níveis, porque pergunta paramétrica não se repete (há mais de 22 mil enunciados de matemática distintos [MEDIDO]):

| Nível | Chave | Exemplos | Como revisa |
|---|---|---|---|
| **Item estável** | `en:w:hello`, `en:f:nice-to-meet-you`, `pt:w:bola`, `pt:s:ba`, `pt:l:g`, `mat:f:x:7:8` (família de fatos), `mat:f:+:7:8` | vocabulário, letras, sílabas, fatos | pergunta nova do mesmo item, em tipo mais difícil conforme a caixa |
| **Habilidade** | `sk:<idDaFase>:<etiqueta>` | "arredondar à dezena", "frações equivalentes" | gera pergunta nova do mesmo gerador, sem repetir números |
| **Erro congelado** | `er:<hash6 de prompt+answer>` | herança de `S.errados`, perguntas sem gerador reproduzível | repete exatamente a pergunta |

Famílias de fatos contam como um item: 7×8, 8×7, 56÷7, 56÷8 [F8]. Estimativa de itens estáveis (**OPINIÃO** para a parte de matemática): inglês 430 (os textos de `en-alvo` do inventário, seção 9), português 142 (56 palavras + 60 sílabas + 26 letras), matemática cerca de 120 famílias (×: 36 pares de 2 a 9; +/−: cerca de 66).

### 2.3 Caixas e regras

Cinco caixas. Intervalos em dias: **1, 3, 7, 14, 30**. A regra de 10% a 20% do prazo [F1] dá 1 dia para lembrar uma semana e cerca de 3 a 6 dias para um mês; os valores finais para crianças de 7 a 12 são **hipótese a calibrar** [F1, F2, relatório 02 §2.2]. Fica em constante `LEITNER.intervalos`.

| Evento | Regra |
|---|---|
| Item aparece pela 1ª vez numa fase concluída | entra na caixa 1, vence no dia seguinte, qualquer que tenha sido o resultado |
| Acerto na 1ª tentativa, sem dica | sobe 1 caixa (máx. 5); próxima data = hoje + intervalo da nova caixa |
| Acerto com dica degrau 1 ou 2 | fica na caixa; próxima data = hoje + intervalo da mesma caixa |
| Erro | cai 2 caixas (mín. 1); vence amanhã; `lapsos++` |
| `lapsos` ≥ 3 e caixa ≤ 2 | marca `dificil`: a próxima exposição abre com o exemplo resolvido (T6) |
| Dois acertos em dias diferentes na caixa 5 | sai da fila ativa ("dominado"); volta a cada 60 dias numa amostra de 5% |
| Atraso > 2× o intervalo | cai 1 caixa e vence hoje (esquecimento provável) |

Tempo de resposta (`ms`) é guardado como informação, não decide caixa.

**Tipo de pergunta por caixa** (inglês e português; no meio de matemática serve o degrau de apoio):

| Caixa | Pergunta |
|---|---|
| 1 | reconhecer (escolher com áudio) |
| 2 | ouvir e escolher com distratores parecidos |
| 3 | produzir (montar ou digitar) |
| 4 | completar a frase |
| 5 | ditado |

### 2.4 Sessão mista, limite diário e onde aparece

- **Revisão do dia**: até **8 perguntas** por padrão (cerca de 3 minutos), o responsável escolhe 5, 8 ou 12. Teto do dia: **10 perguntas de revisão** no total (as 8 mais o aquecimento).
- **Seleção**: (1) mais atrasados em proporção ao intervalo; (2) caixas baixas primeiro; (3) mistura matérias: pelo menos 1 de cada matéria que tenha vencido, nunca 3 seguidas da mesma habilidade (intercalação [F4]).
- **Onde aparece**: (a) aquecimento de 3 a 5 itens no começo de cada fase nova [F1, F2: recuperação antes do novo]; (b) missão "Aquecimento" do dia (seção 5.4); (c) o fim da "Revisão do mundo", que passa a puxar os itens do mundo com caixa ≤ 3 e completa com novos.
- **Fila invisível**: a criança nunca vê "87 pendentes". Se vencidos > 3× o limite, o sistema adia os de caixa ≥ 3 (+metade do intervalo) para a fila nunca virar culpa (**OPINIÃO**; ligado a [03-§3] sobre pressão).

### 2.5 Simulação da carga [MEDIDO, modelo assumido]

`docs/anexos/simulacao-leitner.js`. Memória assumida `exp(-dias/estabilidade)` com estabilidade 3, 8, 20, 45, 100 dias por caixa. É **modelo, não dado com criança**; serve para comparar políticas.

Descoberta que muda o desenho: com limite de 8 a 12 revisões por dia de estudo, **entram em rastreio só 36 a 86 itens em 12 semanas**; sem freio de itens novos, a fila vencida passa de 250 itens e a ordem "mais atrasado primeiro" empaca com itens que já não se lembram. Consequência de produto:

1. **Não rastrear tudo.** Entram na caixa: (a) todo erro; (b) até **3 itens-chave por fase** (os que o gerador marca como `chave`, escolhidos entre os de menor acerto). As 430 palavras de inglês não viram 430 itens ativos.
2. **Freio**: item novo só entra se `vencidos hoje < limite`.
3. Item acertado de primeira em dois dias diferentes na própria fase não entra.
4. A calibração real (esquema 1/3/7/14/30 contra 1/7/21/45/90) só com dado de crianças: medir retenção em 30 dias por caixa (relatório 02 §9, item 1).

### 2.6 Onde guarda e como migra `S.errados`

Esquema em `S.revisao` (seção 8):

```js
revisao: {
  itens: { 'en:w:hello': [caixa, due, n, acertos, lapsos, ultimo, dificil?], ... },   // arrays compactos
  congelados: { 'er:a1b2c3': {type,prompt,answer,options,figure,sk} },               // só erro sem gerador
  ultimoAquecimento: 'AAAA-MM-DD'
}
```

**Migração v3 para v4 de `S.errados`** (executa uma vez):
1. Para cada erro em `S.errados['mat3']` etc., tenta descobrir a fase de origem: normaliza o `prompt` (números viram `#`, nomes viram `@`) e procura na tabela `TEMPLATE→idDaFase`, gerada em build por `docs/anexos/extrair-audio.js` ampliado (300 rodadas por gerador). Achou: cria `sk:<fase>:?` e guarda o erro em `congelados`.
2. Não achou: guarda em `congelados` com `sk` vazio e `mundo` preservado.
3. Todos entram na caixa 1; datas escalonadas `hoje + floor(i/5)` dias para não cair tudo no primeiro dia.
4. `S.errados` original fica em `legado.errados` por uma versão; some quando o responsável exportar o backup v4.
5. A "Revisão do mundo" continua funcionando enquanto `revisao.itens`/`congelados` do mundo existam.

**Peso.** 1.000 itens × cerca de 70 bytes = cerca de 70 KB por perfil; o `localStorage` dá cerca de 5 MB para tudo [conhecimento geral; **OPINIÃO**, conferir no aparelho]; passa de 2 MB total, migrar para IndexedDB.

---

## 3. Adaptação por habilidade e diagnóstico de entrada

### 3.1 Habilidade pequena

Uma habilidade = `idDaFase:etiqueta`, uma etiqueta por gerador (6 por fase, **900 no total**: `makers.length` somados). Etiquetas escritas à mão no arquivo de conteúdo (nunca pela posição, que muda). O relatório 02 pede adaptação em habilidades pequenas, não em "nível" genérico [F5, relatório 02 §2.5].

### 3.2 Estado e regra

Por habilidade: janela das últimas 6 respostas (bits), `camada` 1 a 3, `n`, `acertos`.

| Condição (≥ 6 respostas na janela) | Ação |
|---|---|
| acertos ≥ 5 de 6 e nenhuma dica degrau 2 | `camada = min(3, camada+1)` |
| acertos ≤ 3 de 6 | `camada = max(1, camada-1)` e a próxima exposição abre com o exemplo resolvido |
| 4 de 6 | mantém |
| `camada` 1 e acertos ≤ 2 de 6 em 2 sessões | oferece o pré-requisito (a fase anterior) como "volta rápida", nunca como castigo |

Alvo de acerto **70% a 85%** (a faixa vem do relatório 02 §2.5, escolha **OPINIÃO** a calibrar). A criança não vê nível subir nem descer. Evidência: sistemas de tutoria inteligente com mediana de 0,63 em estudos alinhados ao conteúdo, menor em testes padronizados [F5].

### 3.3 Como a camada muda a pergunta sem reescrever 900 geradores

1. **Seleção** (principal): cada gerador recebe `dif` 1 a 3. Camada 1 sorteia só `dif ≤ 1` mais apoio; camada 2 sorteia `dif ≤ 2`; camada 3 sorteia todos. O script de apoio `rotular-dificuldade` roda cada gerador 200 vezes e calcula: tipo da pergunta, maior número, nº de passos e comprimento; propõe `dif` para revisão humana (pedagogo). Trabalho de revisão: 900 linhas.
2. **Apoio**: nº de opções (3 ou 4), dica automática, figura visível, degrau do concreto.
3. **Reforço**: `reforco()` (`index.html:1646`) já completa com geradores de fases anteriores; passa a respeitar a camada.

### 3.4 Diagnóstico de entrada

**Objetivo.** Dizer em até 12 perguntas por matéria onde começar. Vira "missão de exploração" com o Bobby, sem nota, sem coração, sem tempo, com opção "pular" (começa pelo valor da faixa).

**Algoritmo (escada).**
1. Começa na unidade do quadro 1.1 da faixa.
2. Em cada unidade sorteia 2 perguntas, uma das fases `x.3` e outra de `x.5` (as de integração, já existem).
3. Duas certas: sobe 2 unidades. Uma certa: sorteia mais 1 na mesma unidade. Zero certas: desce 1.
4. Para quando já tem uma unidade com 2/2 imediatamente abaixo de outra com 0/2 ou 1/2 ou quando chega a 12 perguntas.
5. Resultado: `inicio[materia] = unidade`. Unidades abaixo viram "dominadas pelo diagnóstico": jogáveis, com estrela 1 simbólica `'d'`, **sem moedas nem XP** (não vira ganho de graça).
6. Itens respondidos certo no diagnóstico entram na caixa 3, os errados na caixa 1 (migra os erros para a fila).
7. Em inglês, o diagnóstico depende de áudio: só roda quando os clipes de `en-alvo` estiverem presentes (seção 9).

**Limites.** O diagnóstico posiciona, não promete nível escolar. Não há nota exibida. Pode ser refeito pelo responsável. Dado: só apelido e resultado local.

---

## 4. Relatório simples para os pais

### 4.1 O que existe

`telaResponsavel()` (`index.html:5831`): fases feitas, tempo total, acerto, barras de 7 dias, "Onde ela mais erra" (5 fases), 4 sugestões fixas, método, instalar, backup, senha. Datas em UTC (`index.html:5843`) e "ela" no texto.

### 4.2 Princípios

- Só o **apelido** e números locais. Nada sai do aparelho (relatório 03: dado mínimo, LGPD art. 14 §4º; [03-§4.1]).
- Linguagem sem nota nem comparação com outras crianças.
- Responde três perguntas: o que fez? onde brilhou? onde ajudar?
- Texto neutro em gênero ("a criança", apelido).
- Mostra **tempo consolidado** porque o responsável deve poder ver (ECA Digital art. 18, IV) [03-§2.1], mas sem recompensa por tempo.

### 4.3 Cartão da semana (sempre igual, 5 números)

| Número | Fonte |
|---|---|
| Dias com atividade (de 7) | `stats.dias` |
| Minutos de atividade | soma de `seg` |
| Habilidades novas dominadas | habilidades que subiram para camada 2 ou 3 |
| Revisões feitas e % de acerto | `revisao` |
| Perguntas feitas | `stats.dias[].q` |

Mais: **"Brilhou em"** (1 habilidade que mais subiu), **"Vale ajudar em"** (até 2 habilidades com `lapsos` ≥ 3 ou acerto ≤ 55%) com **uma frase "como ajudar em casa"** (30 frases fixas, uma por unidade, escritas na Fase 3) e **"Semana que vem"** (próxima fase).

### 4.4 Semana a semana

| Semana desde o início | O que o cartão mostra |
|---|---|
| 1 | "Conhecendo": diagnóstico feito (ponto de partida por matéria), dias jogados, 1 coisa que a criança já faz. **Sem comparações e sem "vale ajudar"** (pouco dado) |
| 2 | primeira comparação consigo mesma (acerto, revisões); primeira habilidade que subiu |
| 3 | tendência de 3 semanas; sugestão de ajuste de meta (5 para 10 min, ou o contrário) |
| 4 | resumo do mês: fases, habilidades dominadas, melhor sequência, estrelas; "o que fazer no mês 2" |
| 5 em diante | cartão da semana + a cada 4 semanas um resumo do mês |

### 4.5 Compartilhar

Botão "Copiar resumo" gera texto puro (apelido, 5 números, 1 frase) e usa `navigator.share` quando existir, senão copia para a área de transferência. O responsável escolhe o destino (WhatsApp, e-mail). O app não abre nada sozinho nem monta endereço com dado na URL (regra de privacidade do protocolo; [03-§4.3]).

### 4.6 Controles do responsável (ECA Digital arts. 17 e 18; [03-§3.3])

Ficam na mesma tela, atrás do PIN existente: meta (5, 10, 15 min), limite de blocos por dia (vazio = sem limite), dias livres, pausar ofensiva até 7 dias, liga/desliga de ofensiva, missões, lembretes e Liga da Família (desligada por padrão), revisão por dia (5, 8, 12), e botão "pausar o app" sem perder progresso. Padrões **protetivos** [03-§2.1, art. 7º].

**Aviso técnico.** O PIN é uma tranca simples (hash `djb2` com 5.000 voltas, `embaralha()`, `index.html:6016`); o próprio código diz não ser segurança. Subir para `crypto.subtle` PBKDF2 antes de qualquer dado de saúde ou contato entrar no app (relatório 00 §5).

---

## 5. Ciclo de retorno diário

**Tese.** O fator que mais move a Duolingo é a volta no dia seguinte de quem já usa (CURR 84% no 2º trim. de 2026, [01-A28]; efeito cerca de 5x o da segunda alavanca, **FALA** de um ex-executivo, [01-D5]). O Bobby copia o princípio, não os números. Nenhum dado de retenção de criança foi achado [01-C].

### 5.1 Hoje

- `marcarDia()` (`index.html:4870`): dia por `toISOString()` (UTC, `4869`); bônus de dia seguido `min(50, ofensiva*5)` somado a `S.xp`; sem congelador, meta, baú, missão, bilhete.
- `S.xp` é XP **e** moeda: acerto +10, combo +5, fase perfeita +20, e a loja e o "continuar por 50 moedas" **subtraem** dele (`comprar()`, `conferir()`, `index.html:5462`). Gastar "diminui" o progresso.
- Em telas de até 430 px a ofensiva e o botão de som ficam escondidos (relatório 00, B3).

### 5.2 Desenho do dia em uma página

```
abrir o app
  └─ bilhete do Bobby (1 frase, com áudio)           ← seção 5.6
  └─ "Rotina de hoje"
        Meta (barra de 5 min em perguntas)  ──►  Baú do dia   ← 5.4
        3 missões (cabem dentro da meta)    ──►  1 estrela do dia
  └─ jogar (fase, Revisão do dia, fatos, história)
  └─ meta cheia + baú aberto  ──►  "Por hoje chega!"  ← 5.4
```

**Definições (resolvem o conflito com "recompensa por tempo de uso"):**

| Termo | Definição |
|---|---|
| **Bloco** | uma fase concluída, ou a Revisão do dia, ou uma rodada de fatos, ou uma história, com **pelo menos 6 perguntas respondidas**. Acerto ou erro conta |
| **Dia vivo** | dia com 1 bloco concluído. É o único requisito da ofensiva |
| **Pergunta-meta** | `meta_min × 60 ÷ seg_por_pergunta`. Padrão 15 s por pergunta, então 5 min = 20, 10 min = 40, 15 min = 60. Depois de 50 perguntas, o app calibra com a **mediana do próprio perfil** (limites 8 a 40 s) |
| **Meta cheia** | perguntas feitas no dia ≥ pergunta-meta. Abre o baú |

Meta e ofensiva são separadas de propósito: a Duolingo mediu que separar "manter o dia" de "bater a meta" subiu a retenção do dia 14 em 3,3%, ao custo de menos gente batendo a meta [01-A2, A3]. **Medir as duas** (seção 7). A meta é contada em **ações**, não em relógio; o relógio vem só da calibração. Isso evita o vício apontado no Decreto 12.880 art. 9º, III (recompensa pelo tempo de uso) [03-§2.1]. **Validar com advogado**: um baú por dia de meta cheia é "recompensa por ação diária", leitura **OPINIÃO**. Se o advogado discordar, o baú passa a abrir por bloco concluído, e não por meta.

### 5.3 Ofensiva com congelador ganho

**Implementação de referência testada:** `docs/anexos/referencia-ofensiva.js` (12 testes, `node referencia-ofensiva.js`). O app copia a lógica, trocando a data por `diaLocal()`.

**Como se ganha.** A cada **7 dias vivos acumulados** (não precisam ser seguidos) o perfil ganha **1 congelador**. Máximo **2** guardados; com 2 guardados o contador fica parado em 6 de 7 e ganha quando um for usado. Nunca é vendido nem trocado por moeda. A cifra "7 dias, máximo 2" é exemplo de [03-§3.1] e é **OPINIÃO** a medir. A Duolingo também limitou a 2 congeladores equipados, mas o ganho de 0,38% atribuído a isso **não foi confirmado e não deve ser usado** [01-A7, relatório 03 §5 item 7].

**Como se usa.** Sozinho, sem a criança tocar em nada, na primeira abertura depois da falta. Só gasta se os congeladores **cobrem todos** os dias perdidos (não gasta parte).

**Regras exatas** (todas as datas são calendário local, seção 5.8):

| Situação | Resultado |
|---|---|
| Joga hoje, jogou ontem | ofensiva + 1 |
| Jogou, ontem não, e há congelador para todos os dias perdidos | gasta os congeladores, ofensiva intacta, hoje + 1 |
| Perdeu dias e não há congelador suficiente | a ofensiva **descansa** (não zera): guarda o valor `V` e `descansando = true`. O topo mostra "Ofensiva descansando", nunca "perdeu" |
| Volta e conclui o 1º bloco | ofensiva recomeça em `min(ceil(V/2), 10)`, no mínimo 1. A "melhor sequência" fica para sempre |
| Mesmo dia da volta: conclui **um bloco extra** | **recuperação**: ofensiva = `V + 1`. Valem: ausência de no máximo 3 dias e a última recuperação há 14 dias ou mais |
| Ausência maior que 3 dias | sem opção de recuperação; vale o retorno pela metade |
| Dia livre marcado pelo responsável (ex.: domingo) ou pausa até 7 dias | o dia não conta como falta |
| Marcos 3, 7, 14, 30, 60, 100 dias | medalha **permanente**; não se perde |

A recuperação existe porque a decisão aprovada assim pede. O estudo de Silverman e Barasch mostra efeito da ofensiva **mais fraco quando existe reparo** (só o resumo foi lido) [01-A40, 03-§1.6], logo a recuperação tem custo de motivação a medir. Por isso fica **atrás de limite** (carência de 14 dias e lacuna máxima de 3 dias) e com eventos `ofensiva_recuperada` e `ofensiva_descansa` (seção 7) para comparar. A Duolingo fez evento de restauração em 2026 e o chamou de campanha de sucesso (15,4 milhões reviveram) [01-A15], mas esse número não se transfere a crianças.

**Copy do topo (ver exemplos no 5.6):** "Ofensiva: 12 dias" · "Congeladores: 1" · "O Bobby está cuidando da sua sequência" quando um congelador cobriu o dia. **Proibido:** contagem regressiva, "últimas horas", "você vai perder", mascote triste [03-§3.4, §2.5; FTC "Parasocial Relationship Pressure"].

**Casos de teste que a implementação precisa passar** (todos estão no código de referência):

| # | Cenário | Esperado |
|---|---|---|
| 1 | joga 3 dias seguidos | 3 |
| 2 | dois blocos no mesmo dia | 1 |
| 3 | 7 dias vivos, falta 1 dia | congelador ganho e gasto; ofensiva 8 |
| 4 | ofensiva 10, falta 1 dia, sem congelador | descansa; volta em 5; melhor continua 10 |
| 5 | idem, mais 1 bloco extra no dia da volta | 11 |
| 6 | falta 9 dias | volta em 5, sem recuperação |
| 7 | 2ª recuperação 4 dias depois da 1ª | não recupera (carência) |
| 8 | domingo marcado como livre | dia livre, sem falta |
| 9 | pausa do responsável até 06/10 | dia livre, sem falta |
| 10 | já com 2 congeladores | contador fica em 6 |
| 11 | 1 congelador, 3 dias perdidos | não gasta; descansa |
| 12 | 21h30 em Brasília | mesmo dia local (teste ilustrativo; o app deve usar componentes locais da data) |

### 5.4 Meta, baú do dia e ponto de parada

**Baú do dia.** Abre quando a meta fica cheia. **Sem sorteio**: o conteúdo da tabela abaixo é conhecido antes de abrir (mostra "amanhã: ..." fechado com a categoria visível). Sorteio com recompensa imprevisível consta como proibido no material oficial da ANPD [03-§2.1]; baú grátis não é *loot box* pela letra da lei (art. 2º IV exige pagamento) [03-§2.1]. **Nunca vender baú nem sorteio** [03-§2.5].

O índice da tabela é o **valor atual da ofensiva** (inclui recuperação). Tudo é cosmético; nenhum pagamento; as peças reais saem do elenco da Fase 3 (aqui são categorias).

| Dia | Recompensa | Dia | Recompensa |
|---|---|---|---|
| 1 | Adesivo "Primeira visita" | 16 | Adesivo |
| 2 | +10 moedas | 17 | Ornamento de colorir |
| 3 | Adesivo + **medalha 3 dias** | 18 | +15 moedas |
| 4 | Ornamento de colorir (carimbo para o desenho) | 19 | Peça de roupa pequena |
| 5 | Peça de roupa pequena (acessório) | 20 | Adesivo |
| 6 | +10 moedas | 21 | **Medalha 3 semanas** + trilha de brilho no mapa |
| 7 | **Medalha 1 semana** + pose nova do Bobby + moldura de perfil | 22 | +20 moedas |
| 8 | Adesivo | 23 | Ornamento de colorir |
| 9 | Ornamento de colorir | 24 | Adesivo |
| 10 | Peça de roupa pequena | 25 | Peça de roupa pequena |
| 11 | +15 moedas | 26 | +20 moedas |
| 12 | Adesivo | 27 | Ornamento de colorir |
| 13 | Ornamento de colorir | 28 | **Medalha 4 semanas** + pose nova |
| 14 | **Medalha 2 semanas** + peça de roupa maior + adesivo raro | 29 | Adesivo |
| 15 | +15 moedas | 30 | **Medalha do mês** + peça exclusiva + moldura dourada + adesivo "Constelação" |

Ordem de grandeza: moedas no baú somam 10 a 20 por vez; a loja vende por 100 a 600 (`PECAS`, `PERS`); o baú não substitui o jogo. **Depois do dia 30:** vale a tabela de marcos a cada 10 dias (40, 50, 60...) com adesivos da "Constelação do mês N"; itens já possuídos viram +20 moedas. Um baú de boas-vindas ("Kit de volta") aparece fora da tabela na volta depois de 3 dias ou mais (seção 5.6).

**Ponto de parada.** Quando meta cheia + baú aberto: tela "Por hoje chega! Até amanhã." com o Bobby acenando (sem tristeza). Dois botões de peso visual igual: **"Terminar por hoje"** e **"Continuar explorando"** (opção neutra, sem texto de perda: ICO padrão 5, [03-§1.3]). Continuar é livre, mas **não gera novo baú, nova missão nem bônus de combo do dia**; XP e moedas normais seguem. Se o responsável configurou `limiteBlocosDia`, ao atingir só existe "Até amanhã" e o responsável libera com o PIN. O responsável pode pausar o app a qualquer hora (ECA Digital arts. 17 e 18 [03-§2.1]). A tela aparece uma vez por dia. Nenhum conteúdo novo começa sozinho (Decreto art. 9º, I e II [03-§2.1]).

**Frases do Bobby** (todas viram áudio; seção 9): "Por hoje chega! Você fez um ótimo trabalho." · "Amanhã tem mais. O baú de amanhã já está guardado." · "Quando voltar, seu bilhete estará aqui."

### 5.5 As 3 missões

Cabem **dentro** da meta: fazer a rotina completa as missões, sem tarefa a mais. Não se acumulam, não penalizam, somem à meia-noite sem aviso de falta ("amanhã tem novas"). Completar as 3 dá uma "estrela do dia"; 5 estrelas na semana acendem uma peça da "Constelação da semana" (cosmético).

**Catálogo** (cada missão liga a um contador de evento da seção 7; alvo por faixa f78 / f910 / f1112):

| ID | Texto | Conta | Alvo |
|---|---|---|---|
| M01 | Faça a Revisão do dia | bloco `revisao` | 1 |
| M02 | Complete uma fase | bloco `fase` | 1 |
| M03 | Acerte seguidas | combo | 4 / 5 / 6 |
| M04 | Ouça e acerte palavras em inglês | acertos EN com áudio | 4 / 5 / 6 |
| M05 | Faça uma rodada de fatos | bloco `fatos` (MAT) | 1 |
| M06 | Leia um texto com o Bobby | bloco `historia` ou `leitura` | 1 |
| M07 | Escreva palavras que você ouviu | acertos em ditado | 3 / 4 / 5 |
| M08 | Jogue em outra galáxia | blocos em 2 matérias no dia | 2 |
| M09 | Releia uma aula ("Rever a aula") | evento `aula_revista` | 1 |
| M10 | Acerte perguntas que já errou antes | acerto em item com lapso | 2 / 3 / 4 |
| M11 | Responda perguntas de matemática | perguntas MAT | 8 / 10 / 12 |
| M12 | Responda um "por quê?" | acerto em T8 | 1 |
| M13 | Aprenda palavras novas | itens novos introduzidos | 3 / 4 / 5 |
| M14 | Avance um passo no mundo | fase concluída no mundo atual | 1 |

M09 premia reler a explicação, que a pesquisa trata como prática de baixa utilidade [F1], então fica **no máximo uma vez por semana**. M12 só existe depois do tipo T8 (seção 1.6).

**Geração (determinística, sem sorteio novo ao recarregar):**

```js
semente = fnv1a(pid + '|' + diaLocal());           // mesmas 3 missões o dia inteiro
rnd = mulberry32(semente);
A = (venciveis >= 4) ? M01 : pick(rnd, [M13, M02]);                       // base de aprendizado
B = pick(rnd, [M02, M14, M13, M11].filter(naMateriaMenosJogadaNos3Dias));  // progresso
C = pick(rnd, [M03, M04, M07, M10, M12, M08, M06, M05]
            .filter(disponivel).filter(naoUsadaNosUltimos3Dias));          // desafio
// nunca duas missões que contam o mesmo evento
```

**Ajuste silencioso do alvo.** Se em 3 dos últimos 5 dias a criança fez menos de 2 das 3 missões, o alvo cai um degrau; se fez as 3 em 5 dias seguidos, sobe 1 (teto: coluna f1112). Meta de projeto: **completar 2 de 3 em 80% dos dias de jogo** (**OPINIÃO**; medir). Missão não concluída não é exibida como falha.

### 5.6 O que fica esperando quando volta (o bilhete do Bobby)

Ao fim de cada sessão o app grava `espera = {bilhete, presente, desde}` para a próxima abertura. Na abertura, mostra:
1. **Bilhete** de 1 frase com áudio.
2. **Presente fechado**, com a categoria visível ("um adesivo"), definido no dia anterior. É o baú de amanhã ou o "Kit de volta".
3. **Uma coisa pronta** concreta: "Sua Revisão do dia está pronta (6 perguntas)" ou "Um mundo novo foi liberado".

**Regras.** O conteúdo **não depende de quanto tempo a criança ficou fora**. Proibido: "senti sua falta", mascote triste, "faz X dias que...", cobrança, contagem, promessa de surpresa imprevisível. O Bobby incentiva e nunca pressiona: pressão por relação parassocial é padrão apontado pela FTC [03-§1.1]. Exemplos (cada um vira 1 clipe; ~40 no banco final, **OPINIÃO**):

| Contexto | Bilhete |
|---|---|
| Primeiro dia | "Oi! Eu sou o Bobby. Deixei uma missão pequena para a gente começar." |
| Voltou no dia seguinte | "Que bom ver você de novo! Hoje a missão é rápida." |
| Voltou depois de 2 a 3 dias | "Oi de novo! Guardei um adesivo para você. Vamos?" |
| Voltou depois de 4 dias ou mais | "Seja bem-vindo de volta! Seu Kit de volta está aberto. Quer começar devagar?" |
| Tem revisão pronta | "Preparei uma revisão curta com palavras que você já conhece." |
| Mundo concluído ontem | "Você terminou um mundo inteiro! Hoje tem um mundo novo para explorar." |
| Dia de marco | "Hoje é um dia especial na sua sequência. Vem ver!" |
| Fim de semana | "Sábado de aventura! Uma missão e depois é só brincar." |
| Congelador usado | "O Bobby cuidou da sua sequência. Ela continua firme!" |
| Ofensiva descansando | "Sua sequência estava descansando. Hoje ela volta com tudo!" |
| Depois de erro difícil | "Aquela pergunta era difícil mesmo. Hoje a gente tenta de outro jeito." |

### 5.7 Separar XP de moeda

| Variável nova | Sobe com | Desce com | Aparece |
|---|---|---|---|
| `xp` | acerto +10, combo +5, fase perfeita +20, revisão +5 | **nunca** | perfil (nível do explorador) |
| `moedas` | os mesmos eventos de `xp` (+ baú) | loja, "continuar por 50 moedas" | topo |

Nível do explorador: `n` quando `xp ≥ 60 × (n-1)²`, teto 30 (**OPINIÃO**; hoje é `floor(fases/5)+1`, teto 20, `index.html:telaPerfil`). 150 fases rendem cerca de 15.000 XP, nível 16.

**Migração exata (o campo já existe):** `xp_novo = max(ganhoTotal, xp_antigo)`; `moedas_novas = xp_antigo` (o saldo de hoje). Perfis antigos sem `ganhoTotal` usam `max(0, xp_antigo)`. O bônus `min(50, ofensiva*5)` é **removido**; passa a existir só pelo baú.

**Corrigir junto:** o placar de fim de fase mostra "Moedas 80" quando subiu 95 (a conta ignora o bônus de combo, relatório 00 §4.6); a fase passa a somar o `ganho` real acumulado em `LIC`.

**Risco que fica.** "Continuar por 50 moedas" (`PRECO_CORACAO`, `index.html:5630`) é gasto de moeda ganha para seguir jogando. Moeda só se ganha jogando, então fica fora do conceito de "moeda intermediária" no sentido da FTC [03-§1.1], mas o botão aparece no momento do fracasso; **revisar com advogado** antes da venda (**OPINIÃO**).

### 5.8 Fuso (UTC) e outras correções de base

- Causa: `hoje()` = `new Date().toISOString().slice(0,10)` (`index.html:4869`); `marcarDia()` usa `Date.now()-864e5` (`4872`); `regFim()`/`telaResponsavel()` repetem (`5843`). No Brasil (UTC−3), jogar depois das 21h conta como o dia seguinte.
- Correção: `diaLocal()` devolve `AAAA-MM-DD` dos componentes **locais** (`getFullYear`, `getMonth`, `getDate`); diferenças entre dias com `Date.UTC(a,m,d)/864e5` (sem somar milissegundos); a virada é a meia-noite local. Referência: `ymd()`, `idx()`, `diff()` em `referencia-ofensiva.js`.
- Migração: as datas antigas (UTC) ficam como estão; a diferença de um dia no instante da migração é absorvida pelo **congelador de cortesia** (todo perfil migrado ganha 1).
- Outras correções de base (não são do ciclo, mas dependem dele): anel de progresso do mapa "1/50" soma fases de todas as matérias (`feitas()`, relatório 00 §4.5); ícone de ofensiva escondido em 430 px.

---

## 6. Lembretes PWA: o que é possível sem servidor

**Veredito honesto.** Sem servidor **não existe** lembrete automático e confiável com o app fechado nos dois sistemas. O que dá para fazer sem servidor é entregar o lembrete pelo **aplicativo de calendário do responsável**. Push de verdade exige servidor e chaves VAPID e fica na Fase 4. Hoje o app não tem nenhuma notificação (relatório 00 §2.7: nenhum `Notification`, nenhum endpoint), nem botão de instalar; só texto explicando (`instrucaoInstalar()`, `index.html:5919`).

| Caminho | Sem servidor? | O que a fonte diz | Veredito |
|---|---|---|---|
| `Notification` a partir da página | sim | só dispara com o app aberto (conhecimento geral; não verificado nesta sessão) | não serve: quem não abre não recebe |
| Notification Triggers (`TimestampTrigger`) | sim | na documentação do Chrome o *origin trial* está "completo" e o lançamento "não iniciado"; só funciona com uma flag experimental (resultado de busca em `developer.chrome.com/docs/web-platform/notification-triggers`; **não confirmei** o status atual nem o suporte em Safari/Firefox) | **não depender** |
| Periodic Background Sync | sim | no Chrome só para app **instalado**, depende do índice de engajamento e **não garante horário**; suporte em Safari e Firefox não confirmado (MDN, `Web_Periodic_Background_Synchronization_API`) | não serve para lembrete com hora |
| Web Push com VAPID | **não** | exige servidor para disparar. No iPhone/iPad só para web app na Tela de Início, iOS/iPadOS 16.4 ou mais, e a permissão só pode ser pedida num toque do usuário (WebKit, "Web Push for Web Apps on iOS and iPadOS", `webkit.org/blog/13878`) | **Fase 4** |
| Arquivo de calendário `.ics` | **sim** | formato iCalendar com evento recorrente e alarme (RFC 5545: `RRULE` e `VALARM`; texto da RFC **não reaberto** nesta sessão, conhecimento geral) | **caminho mínimo** |
| E-mail ao responsável | não | precisa de servidor, e-mail do responsável, consentimento LGPD art. 14 [03-§2.2] | Fase 4 |
| Compartilhar resumo (menu de compartilhar) | sim | ação manual do responsável | já na seção 4.5 |

### 6.1 Caminho mínimo seguro: `.ics` gerado no aparelho (Fase 3, tela)

Botão em **Área do responsável → Lembrete**:

1. O responsável escolhe **dias** (padrão: segunda a sexta) e **horário** (padrão 17:00; janela permitida 07:00 a 19:30, **nunca à noite** [03-§3.4]).
2. O app gera um `.ics` com o `Blob` e entrega pelo mesmo `entregar()` que já baixa o backup (`baixarPerfil`, `index.html:6068`).
3. O responsável abre o arquivo e adiciona ao calendário. Quem dispara o lembrete é o calendário dele.

Exemplo do arquivo (horário flutuante, sem fuso fixo, segue o aparelho):

```
BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Universo de Bobby//lembrete//PT
BEGIN:VEVENT
UID:lembrete-bobby-<pid>@universo-de-bobby
DTSTAMP:20261024T120000Z
DTSTART:20261026T170000
DURATION:PT10M
RRULE:FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR
SUMMARY:Missão de 5 minutos do Bobby
DESCRIPTION:O Bobby deixou uma missão curta para hoje. Se der\, abram o app juntos.
URL:https://<endereço do app>/index.html
BEGIN:VALARM
ACTION:DISPLAY
DESCRIPTION:Missão de 5 minutos do Bobby
TRIGGER:PT0M
END:VALARM
END:VEVENT
END:VCALENDAR
```

**Cuidados.**
- **Privacidade:** calendários sincronizam com a nuvem do responsável (Google, iCloud). Por padrão o evento **não leva o apelido**; opção "incluir o apelido" com aviso de que ele passa a existir no calendário (**OPINIÃO**, mas decorre de [03-§4.1], dado mínimo).
- **UID estável** (`lembrete-bobby-<pid>`) para que importar de novo atualize em vez de duplicar (**OPINIÃO**; o comportamento varia por aplicativo, testar).
- O app **não consegue alterar nem apagar** o evento depois; a tela avisa e ensina a apagar no calendário.
- Como o `.ics` abre em iOS e Android muda por aparelho e navegador: **não testado**; testar nos dois antes de entregar (**OPINIÃO**).
- Sem notificação do app: nada de permissão de notificação para pedir à criança.

### 6.2 Lembrete dentro do app (Fase 3, sem permissão)

O bilhete do Bobby (seção 5.6) é o lembrete que vale quando o app é aberto. Nada de selo de contagem nem alerta sonoro.

### 6.3 Fase 4 (servidor)

Resumo semanal por e-mail e Web Push ao **aparelho do responsável** com VAPID, atrás da `lgpd-gate` e da `seguranca-minima`. Regras que valem desde já (Decreto art. 9º IV e 10 II, FTC, ICO, [03-§3.4]):
- no máximo **1 por dia**, janela diurna, nunca à noite;
- parar por uma semana depois de 2 lembretes não abertos;
- 1 toque para desligar, na própria mensagem e nos ajustes;
- sem contagem regressiva, sem "últimas horas", sem mascote triste, sem recompensa surpresa;
- a criança **não** recebe notificação por padrão (art. 17 §4º, II [03-§2.1]).

### 6.4 Frases de exemplo (ao responsável, voz do Bobby, tom de incentivo)

| Quando | Texto |
|---|---|
| Rotina | "Hoje o Bobby deixou uma missão de 5 minutos. Se der, abram o app juntos." |
| Revisão pronta | "A revisão de hoje tem 6 perguntas e leva uns 3 minutos." |
| Resumo | "Esta semana a criança jogou 4 dias. O resumo está pronto no app." |
| Conteúdo novo | "O Bobby preparou uma história nova de inglês. Quer ouvir junto?" |
| Volta | "Quando for um bom momento, o Bobby está por aqui. Sem pressa." |

**Evitar** (já no relatório 03): "Não deixe a ofensiva morrer", "o Bobby está triste", "últimas 2 horas".

---

## 7. Eventos e métricas locais

### 7.1 Onde fica e regras

- Chave própria `universo-bobby-eventos-v1`, lista circular por perfil: **máximo 4.000 eventos ou 120 dias**, o que vencer primeiro. Estimativa 60 bytes por evento, cerca de 240 KB (**OPINIÃO**).
- Pergunta a pergunta **não** vira evento (seriam 20 por bloco): agregada em `stats` e em `habil` (seção 8).
- **Sem dado pessoal:** nada de apelido, texto livre, identificador do aparelho. `pid` é um sorteio local de 12 caracteres, separado do apelido, e **não sai** do aparelho; na exportação é trocado por outro sorteio.
- Hora só em horas cheias, data local (seção 5.8).
- Nada é enviado hoje. Exportar é ação do responsável (arquivo `.json`).

### 7.2 Esquema

Campos comuns: `e` nome, `d` data local, `h` hora local (0 a 23), `s` id da abertura (sorteio), `v` versão do app, `pid`.

| Evento | Campos próprios | Para quê |
|---|---|---|
| `app_aberto` | `instalado` (modo `standalone`: sim/não), `origem` (`icone`/`link`) | retorno, instalação |
| `perfil_criado` | `faixa` | coortes |
| `diag_fim` | `mat`,`pt`,`en` (unidade de partida), `perguntas` | ponto de partida |
| `bloco_inicio` | `tipo` (`fase`/`revisao`/`fatos`/`historia`), `lic`, `materia` | funil |
| `bloco_fim` | `tipo`, `lic`, `materia`, `perguntas`, `acertos`, `estrelas`, `seg`, `abandonou` (0/1) | **dia ativo**, onde sai |
| `meta_cheia` | `perguntas`, `min` | meta |
| `bau_aberto` | `dia` (valor da ofensiva) | recompensa |
| `missao_ok` | `id` | missões |
| `parada_vista` | `acao` (`terminar`/`continuar`) | ponto de parada |
| `congelador_ganho` / `congelador_usado` | `saldo` | economia |
| `ofensiva_descansa` | `valor`, `lacuna` | quebra |
| `ofensiva_recuperada` | `valor` | custo do reparo |
| `ofensiva_retorno` | `valor_antes`, `valor_depois` | retorno pela metade |
| `revisao_item` | `caixa_antes`, `caixa_depois`, `ok` (agregado por sessão) | calibrar Leitner |
| `audio_falha` | `clip`, `motivo` | áudio gravado |
| `relatorio_visto` | `semana` | pais |
| `lembrete_ics` | n/a | lembrete |
| `config_mudou` | `chave` (nome, não valor livre) | uso dos controles |
| `sessao_fim` | `seg`, `blocos` | duração |

### 7.3 Cálculo de D1, D7, D30 e retorno no dia seguinte

**Dia ativo** = data local com ao menos 1 `bloco_fim`. Abrir o app sem terminar bloco **não** conta.

| Métrica | Definição | Cuidado |
|---|---|---|
| D1, D7, D30 (estrita) | o perfil teve dia ativo exatamente no dia 1, 7, 30 depois do primeiro dia ativo | quem ainda não chegou ao dia N **sai do denominador** |
| D1, D7, D30 (janela) | dia ativo em 1 a 2, 6 a 8, 28 a 32 | criança de 7 a 12 anos raramente joga todo dia; reportar as duas |
| **Retorno no dia seguinte** (estilo CURR [01-A25]) | entre os dias ativos que tiveram outro dia ativo nos 7 dias anteriores, a fração em que também há dia ativo no dia seguinte | só dias com amanhã já passado |
| Meta cheia por dia ativo | `meta_cheia` ÷ dias ativos | separa "dia vivo" de "meta" |
| Efeito do reparo | retorno no dia seguinte depois de `ofensiva_recuperada` contra depois de `ofensiva_retorno` sem recuperação | custo de motivação [01-A40] |

Implementação de referência, com teste: `docs/anexos/referencia-retencao.js` (`node referencia-retencao.js`). Resultado de exemplo [MEDIDO] em 3 perfis sintéticos: D1 0,33; D7 0,33; D30 0,50 (n = 3, 3 e 2).

**Coorte semanal:** semana ISO do primeiro dia ativo (`coortes()` no mesmo arquivo). **No aparelho de uma família isso dá n pequeno** (1 a 4 perfis). Para ter coorte de verdade agora: o responsável exporta o **pacote de métricas** (JSON só com contadores, sem apelido), o Filipe junta os pacotes numa página fora do app e calcula. É dado entregue pelo responsável, por ato dele, para uma finalidade (medição); **passar pela `lgpd-gate`** antes de pedir a pacotes de terceiros (relatório 03 §2.2).

### 7.4 Onde fica o painel

| Painel | Para quem | Onde | Mostra |
|---|---|---|---|
| **Cartão dos pais** | responsável | Área do responsável (atrás do PIN) | só os números da criança (seção 4). **Nunca** D1/D7/D30 |
| **Medidor do produto** | Filipe | página estática separada (`medir.html`, fora do app, sem link), abre arquivos exportados no navegador, nada sobe | D1/D7/D30, retorno no dia seguinte, coortes, funil de blocos, onde sai |

### 7.5 O que só dá para medir com conta (Fase 4)

- Mesma criança em dois aparelhos (no local, são dois perfis).
- Perfil que **limpou os dados** do navegador aparece como usuário novo e infla o abandono. No Safari, dados de sites não instalados podem ser apagados depois de dias sem uso; **não verifiquei** a regra atual (conhecimento geral); app na Tela de Início costuma escapar (**OPINIÃO**).
- Coorte em escala e comparação entre grupos (teste A/B de verdade, por exemplo intervalos 1/3/7 contra 1/7/21, relatório 02 §9).
- Abertura de e-mail e de push, instalação do app, funil antes da primeira abertura.
- Cruzar com a série de retenção da Duolingo é inviável: não há D1/D7/D30 absolutos em fonte primária [01-C].

**Meta numérica só depois da linha de base** (relatório Fase 1 §5).

---

## 8. Modelo de dados novo (estado local v4)

### 8.1 Por que uma chave nova

O código v3 só reconhece os campos que conhece: `estadoDe()` (`index.html:4762`) copia as chaves de `estadoVazio()` e **descarta o resto**; `arrumarStore()` (`4786`) refaz o armazenamento a cada leitura. Se v4 escrevesse na chave `mundo-numeros-v2`, uma aba ou service worker velho apagaria os campos novos na primeira gravação. Decisão: **v4 usa `universo-bobby-v4`**; a chave `mundo-numeros-v2` fica **intocada** como cópia de segurança e rollback. O `start_url` e o `scope` do manifesto não mudam (decisão aprovada).

### 8.2 Esquema

```jsonc
// localStorage['universo-bobby-v4']
{
  "v": 4,
  "migradoDe": "mundo-numeros-v2@3",      // ou null em instalação nova
  "criadoEm": "2026-10-24",
  "atual": "p3k9x1",                       // id do perfil em uso
  "senha": { "s": "...", "h": "..." },     // igual ao v3 (a trocar por PBKDF2, seção 4.6)
  "perfis": [ {
    "id": "p3k9x1",                         // também é o "pid" dos eventos (sorteio local)
    "nome": "Lua",                          // APELIDO (único dado pessoal), até 18 caracteres
    "cor": "#12A06E",
    "criado": 1761264000000,
    "dados": {
      "faixa": "f78",                       // f78 | f910 | f1112
      "materia": "mat",                     // mat | pt | en

      "xp": 1520,                           // nunca diminui
      "moedas": 340,                        // gasta na loja / continuar
      "acertosTotal": 412, "melhorCombo": 8,

      "feitas": { "1.1": 3, "p2.4": 2, "e1.1": 1, "revmat1": 2 },   // idDaFase -> estrelas 1..3 ("d" = diagnóstico, sem XP)
      "look": {}, "comprado": [],          // igual ao v3

      "ofensiva": {                         // seção 5.3
        "atual": 12, "melhor": 19, "ultimo": "2026-10-23",
        "descansando": false, "valorAntes": 0, "lacuna": 0,
        "congeladores": 1, "prog": 3, "recuperouEm": "", "recuperavel": null,
        "cobertos": [], "marcos": [3, 7]
      },
      "diario": {                           // zera todo dia
        "dia": "2026-10-24", "blocos": 1, "perguntas": 14, "metaOk": false,
        "bau": { "aberto": false, "dia": 12 },
        "missoes": [ {"id":"M01","alvo":1,"prog":1,"ok":true}, {"id":"M13","alvo":4,"prog":2,"ok":false}, {"id":"M03","alvo":5,"prog":0,"ok":false} ],
        "paradaVista": false
      },
      "espera": { "bilhete": "N07", "presente": "adesivo", "desde": "2026-10-23" },

      "config": {                           // só o responsável altera
        "metaMin": 5, "revisaoPorDia": 8, "limiteBlocosDia": null,
        "diasLivres": [0], "pausaAte": "",
        "ofensivaLigada": true, "missoesLigadas": true,
        "lembrete": { "ics": false, "hora": "17:00", "dias": [1,2,3,4,5], "comApelido": false },
        "ligaFamilia": false
      },

      "habil": { "e3.2:a": { "j": [1,1,0,1,1,1], "camada": 2, "n": 14, "a": 11 } },   // seção 3
      "revisao": {                          // seção 2
        "itens": { "en:w:hello": [2, "2026-10-27", 5, 4, 1, "2026-10-24"] },          // [caixa, due, n, acertos, lapsos, ultimo]
        "congelados": { "er:a1b2c3d4": { "type":"input","prompt":"...","answer":"7","sk":"2.3:b" } },
        "ultimoAquecimento": "2026-10-24"
      },
      "diag": { "feito": true, "dia": "2026-10-24", "inicio": { "mat": 2, "pt": 1, "en": 1 } },

      "stats": {
        "dias": { "2026-10-24": { "b": 2, "q": 24, "s": 420, "ac": 19, "rev": 6 } },
        "porLicao": { "1.1": { "acertos": 12, "erros": 3 } },
        "tempo": 5400
      },
      "som": true, "voz": true, "velocidadeVoz": 1.0,
      "legado": { "errados": {}, "nivel": "facil", "vozPt": "", "vozEn": "" }
    }
  } ]
}
```

**Tamanho esperado.** Perfil com 1.000 itens de revisão, 900 habilidades e 120 dias de estatística: cerca de 150 a 300 KB (**OPINIÃO**). Eventos ficam em chave separada (seção 7.1). Se o total passar de 2 MB, migrar para IndexedDB (mesma forma).

### 8.3 Migração `mundo-numeros-v2` (v3) para v4, sem perder progresso

Roda uma vez, na primeira abertura da versão nova, **antes de qualquer tela**.

| Passo | Ação |
|---|---|
| 1 | Lê `mundo-numeros-v2` com `JSON.parse` em `try`. Se falhar ou não existir, lê `trilha-matematica-v1` (fluxo antigo, `index.html:4806-4820`); se também faltar, instalação nova |
| 2 | **Faz a cópia** `mundo-numeros-v2.bak-v3` (texto bruto) se couber; falha de cota não impede a migração, mas avisa o responsável para exportar um backup |
| 3 | Para cada perfil, monta `dados` v4 pela tabela abaixo |
| 4 | **Valida**: contagem de fases em `feitas` igual à de antes, `xp_novo + moedas_novas ≥ xp_antigo`, ofensiva ≥ 0. Se qualquer teste falhar, **não grava** v4, segue com o v3 e registra `migracao_falhou` |
| 5 | Grava `universo-bobby-v4`; marca `migradoDe`; **nunca apaga** a chave antiga |
| 6 | Mostra o aviso único, sem pressa: "O Bobby ganhou novidades. Seu progresso está todo aqui." e dá o congelador de cortesia |

| Campo v3 | Campo v4 | Regra |
|---|---|---|
| `nivel` `facil`/`medio`/`forte` | `faixa` `f78`/`f910`/`f1112` | 1 para 1; guarda o antigo em `legado.nivel` |
| `xp` (saldo) | `moedas` | igual |
| `ganhoTotal` | `xp` | `max(ganhoTotal, xp)` |
| `ofensiva`, `melhorOfensiva`, `ultimoDia` | `ofensiva.atual`, `.melhor`, `.ultimo` | datas UTC ficam como estão; `congeladores = 1` (cortesia); `prog = 0` |
| `feitas` | `feitas` | igual (valores numéricos 1 a 3; formatos estranhos tratados como `estrelasDaFase()`, `index.html:5744`) |
| `errados[materia+mundo]` | `revisao.congelados` + `legado.errados` | seção 2.6 |
| `stats.porLicao`, `.dias`, `.tempo` | idem; cada dia ganha `q` e `b` vazios | |
| `combo` | `melhorCombo` | |
| `acertos` | `acertosTotal` | |
| `som`, `voz` | `som` (efeitos), `voz` (narração) | `voz=false` passa a **silenciar** a narração gravada (hoje `S.voz` nunca é lido, relatório 00 B2) |
| `velocidade` 0,6 a 1,3 | `velocidadeVoz` | recortado para 0,8 a 1,2 |
| `vozPt`, `vozEn` | `legado.vozPt`, `.vozEn` | a voz do aparelho deixa de existir |
| `look`, `comprado`, `materia`, `nome`, `cor`, `id`, `criado` | iguais | |
| `senha` | `senha` | igual |
| (novo) | `pid` = `id` do perfil | se faltar, sorteia |

### 8.4 Backup: exportar e importar

Formato atual: `{app:'universo-de-bobby', versao:3, quando, perfil:{nome, cor, dados}}` (`baixarPerfil`, `index.html:6068`). Passa a:

```jsonc
{ "app":"universo-de-bobby", "versao":4, "quando":"2026-10-24T12:00:00.000Z",
  "perfil":{ "id":"p3k9x1", "nome":"Lua", "cor":"#12A06E", "dados":{...} },
  "soma":"fnv1a-8hex" }          // detecta arquivo cortado ou editado à mão
```

- **Importar** aceita versão 3 e 4. v3 passa pela migração do 8.3; v4 vale direto.
- Hoje a restauração **sempre cria perfil novo** (`restaurarPerfil`, `index.html:6076`). Passa a perguntar, se o `id` já existir: "Substituir o perfil existente" ou "Salvar como outro perfil". Nunca silencioso.
- `soma` errada: mostra aviso e deixa importar mesmo assim, depois de confirmação.
- Backup **não leva** eventos nem o `pid` de medição; "Exportar métricas anônimas" é botão à parte (seção 7).
- O arquivo contém só apelido, cor e progresso. Orientar o responsável: o arquivo vai para onde ele mandar (WhatsApp, Drive).
- O texto da tela "Levar o progresso para outro aparelho" (`index.html:5882`) é atualizado; continua dizendo que **não sincroniza sozinho** até a Fase 4.

### 8.5 Testes de migração (obrigatórios)

1. perfil v3 vazio; 2. perfil v3 com 50 fases e erros; 3. 3 perfis, um com senha; 4. JSON corrompido; 5. `ganhoTotal` ausente; 6. cota cheia; 7. importar backup v3 depois de já estar em v4; 8. abrir a versão antiga depois de migrar (deve continuar com o progresso antigo, intacto); 9. app instalado com service worker velho; 10. relógio em 21h30 de Brasília.

---

## 9. Áudio todo gravado

Decisão aprovada: nenhuma voz do aparelho (`speechSynthesis`) fica no app. Nada de áudio foi gerado; abaixo, só o inventário e o plano. **Antes de gerar qualquer coisa:** 5 amostras, estimativa de custo, aprovação do Filipe e conferência da licença comercial (decisão em `RESPOSTAS.md`; ainda aberta no relatório da Fase 1 §7).

### 9.1 Inventário extraído do código

Rodar `node docs/anexos/extrair-audio.js` (lê `index.html`, gera `docs/anexos/inventario-audio.tsv`). Texto falado = o que `emTexto()`/`limpaEN()` (`index.html:emTexto` e `limpaEN`) mandariam à voz, isto é, o HTML sem tags e com símbolos por extenso. Strings únicas por (classe, idioma, texto).

| Classe (arquivo `diretório`) | Idioma | Strings únicas | Caracteres | Origem no código |
|---|---|---|---|---|
| Passos de aula `aula/` | pt-BR | **554** | 78.108 | `AULAS` (`p.t + ". " + p.c`, lido por `blocoPasso()` e `data-ler`) |
| Abertura de capítulo `historia/` | pt-BR | 30 | 3.353 | `CAPITULOS`, `CAPITULOS_PT`, `CAPITULOS_EN` (`.abre`) |
| Missão `missao/` | pt-BR | 150 | 14.242 | `MISSOES`, `MISSOES_PT`, `MISSOES_EN` (`.t + ". " + .abre`) |
| Fecho de missão `missao/` | pt-BR | 110 | 3.672 | `.fim` (hoje só escrito, não falado; no inglês é um por mundo) |
| Palavras e frases em inglês `en/` | en-US | **437** | 5.144 | `LEX`, `VOC`, `FRASES`, `COGN` e cartões `data-ler` das aulas |
| Glosas em português do inglês `glosa/` | pt-BR | 440 | 5.661 | tradução de palavra e de frase (`LEX[3..4]`, `VOC`) para enunciados |
| Palavras de português `palavra/` | pt-BR | 56 | 293 | `PAL` (todas as 56 também saem de `ouvir`) |
| Sílabas `silaba/` | pt-BR | 60 | 129 | sílabas de `PAL` |
| Letras `letra/` | pt-BR | 26 | 26 | **não existe como string no código**; nome de cada letra, a gravar |
| Textos de leitura `leitura/` | pt-BR | 3 | 442 | `TEXTOS` (hoje só aparecem na tela, não são falados) |
| **Quadros de enunciado** `quadro/` | pt-BR | **~957** (limite superior) | ~17.500 | ver 9.2 |
| **Total no TSV** | | **2.823** | 128.570 | |

**Contagem final por idioma [MEDIDO]:**
- **pt-BR exato: 1.400 strings, 105.458 caracteres** (aulas, capítulos, missões, glosas, palavras, sílabas, letras).
- **en-US exato: 437 strings, 5.144 caracteres** (185 palavras soltas e 252 frases ou expressões).
- **Quadros pt-BR (limite superior): cerca de 957 strings, 17.500 caracteres.** Variam de 954 a 964 entre execuções porque a amostragem sorteia.
- **Total de strings únicas faladas: 1.837 exatas + ~957 quadros + 29 novas/não faladas hoje = 2.823.**
- Fora do TSV: numerais, nomes, frases do sistema (9.3).

### 9.2 O problema dos enunciados com número sorteado

A pergunta de matemática muda a cada vez. Em 300 rodadas por gerador saíram **22.476 enunciados distintos** de matemática sem saturar, **2.539** de português quase saturando, e 206 de inglês (que embutem palavras já inventariadas) [MEDIDO]. Gravar enunciado inteiro é inviável. Solução: **áudio composto por quadros**.

1. O enunciado falado é cortado em **quadros** (texto fixo entre números, nomes, letras, sílabas e palavras) e **encaixes** (os dados que variam).
2. Cada quadro e cada encaixe é um clipe. O reprodutor toca os clipes em fila, sem intervalo audível.
3. O corte **roda no navegador, igual ao script de build**, sobre o texto final da pergunta. Não é preciso mexer nos 900 geradores. O build roda cada gerador 300 vezes e **falha se algum quadro ou encaixe não tiver clipe** (cobertura testada).
4. Texto sem clipe: **mostra o texto e fica sem voz**; não cai para a voz do aparelho (decisão aprovada).

| Encaixe | Quantos clipes | Observação |
|---|---|---|
| Números | **cerca de 45** para falar qualquer número: 0 a 19 (20), dezenas 20 a 90 (8), cem, cento, 200 a 900 (7), mil, "e", "vírgula", "reais", "real", "centavos", "centavo" | nos enunciados saíram **cerca de 1.000 inteiros distintos (até 4.000)** e **cerca de 1.370 decimais** (1 e 2 casas) [MEDIDO, amostra aleatória de 300 rodadas, varia um pouco a cada execução]; falar cada um isolado seria cerca de 2.400 clipes. Regra de leitura em português já existe em `extenso()` (`index.html:889`). O corte de prosódia de números compostos precisa de teste auditivo (**OPINIÃO**: se soar picotado, gravar 0 a 1.000 inteiros, cerca de +1,5 MB) |
| Nomes das personagens dos problemas | 12 (`NOMES`) | |
| Letras | 26 (+ dígrafos `ch`, `lh`, `nh`, `rr`, `ss`) | |
| Sílabas | 60 | |
| Palavras de português | 56 | |
| Quadros | 351 de matemática, 430 de português, 176 de inglês (somam ~957) | **limite superior** por segmentação automática; a revisão editorial reduz, pois muitos são variações de ordem de frase (**OPINIÃO**: alvo de 600) |

Quadros mais frequentes, para ter noção: "escreva", "mais", "qual é", "palavra", "monte", "quanto", "primeira letra", "quantas sílabas tem", "em inglês", "o que significa", "como se diz", "agora toque em".

### 9.3 O que não está no código e precisa ser escrito

| Grupo | Strings | Origem |
|---|---|---|
| Falados hoje, fora do TSV (modelos com número) | 18 | `trocaAviso` (2), `telaVoz` (4: `index.html:5997-6008`), `ajudaForte()` (7), `dicaDaPergunta()` (5) |
| Feedback hoje só escrito (vira falado) | 12 | `pick2(['Isso aí!','Boa!','Perfeito!','Mandou bem!','Certinho!','Show!'])` (`index.html:5485`), "Quase!", "A resposta certa é", "Esta pergunta volta no fim...", "Fase concluída", "Fase perfeita", "Acabaram os corações" |
| Novos desta especificação | cerca de 90 (**OPINIÃO**) | 40 bilhetes (5.6), 14 missões (5.5), baú e marcos (10), parada e congelador (8), diagnóstico (6), feedback explicativo (12) |
| Histórias e leituras novas | 10 histórias de inglês por nível + 60 textos de português (1.3 e 1.4) | ~1.800 palavras em inglês e ~6.000 em português (**OPINIÃO**, a escrever) |

### 9.4 Convenção de nomes

```
voz/v1/<idioma>/<classe>/<slug32>-<fnv8>.m4a        # idioma: pt-br | en-us
voz/v1/manifesto.json
```

- `slug32`: primeiros 32 caracteres do texto sem acento, em minúsculas, hífens.
- `fnv8`: hash FNV-1a de 32 bits (8 hexadecimais) de `classe + texto`. É **síncrono** no navegador e idêntico ao do build (`extrair-audio.js`; nomes repetidos nesta rodada: 0). Mudou o texto, mudou o nome, e o cache se renova sozinho.
- `v1` sobe só quando mudar a voz ou o tratamento de áudio.
- Pacotes: `core` (numerais, nomes, letras, sílabas, frases do sistema, bilhetes), `en`, `pt`, `mat`.

`manifesto.json` (carregado sempre; deve ficar abaixo de 150 KB):

```json
{ "v": 1,
  "pacotes": { "core": ["pt-br/numero/vinte-1a2b3c4d.m4a", "..."], "en": ["..."], "pt": ["..."], "mat": ["..."] },
  "clipes": { "pt-br/numero/vinte-1a2b3c4d.m4a": { "ms": 640, "b": 2520 } } }
```

### 9.5 Formato e tamanho

- **Padrão: AAC-LC mono, 32 kbps, `.m4a`.** Toca em todo Android e iPhone. **Opus** (24 kbps) é menor, mas o suporte do Safari/iOS a Opus não foi verificado nesta sessão; só adotar depois de teste no aparelho (**OPINIÃO**). A escolha não muda o resto.
- Normalizar a -16 LUFS; 150 ms de silêncio no início e 250 ms no fim; palavras de inglês isoladas com pausa de 300 ms para não cortar.
- Duração estimada (**premissas**: 14 caracteres por segundo em português, 11 em inglês, 0,6 s de sobra por clipe e 0,4 s por quadro; escolha **OPINIÃO**, validar com as 5 amostras):

| Pacote | Clipes | Caracteres | Duração | 32 kbps | 24 kbps |
|---|---|---|---|---|---|
| Matemática | 615 | 40.375 | 53 min | 12,7 MB | 9,5 MB |
| Português | 885 | 42.243 | 58 min | 13,8 MB | 10,4 MB |
| Inglês | 1.323 | 45.952 | 69 min | 16,6 MB | 12,4 MB |
| **Total** | **2.823** | **128.570** | **180 min** | **43 MB** | **32 MB** |
| Numerais, nomes, sistema, bilhetes (a somar) | cerca de 200 | cerca de 6.000 | cerca de 8 min | cerca de 2 MB | cerca de 1,5 MB |

Os passos de aula dominam: 554 passos somam 98 minutos (23,6 MB a 32 kbps), mais da metade do total. **Reduzir o texto de aula na Fase 3** (média hoje de 141 caracteres por passo, cerca de 10 s) corta custo de geração e de armazenamento, e ajuda a atenção da criança (**OPINIÃO**). Número de caracteres é o que importa para o orçamento de geração; o preço depende do fornecedor e **não foi levantado**.

### 9.6 Vozes (sem gerar, sem gastar)

| Papel | Idioma | Uso | Requisitos |
|---|---|---|---|
| **Voz do Bobby** (guia) | pt-BR | enunciados, aulas, missões, bilhetes | calorosa, ritmo equivalente ao `rate 0,92` de hoje; um só intérprete em todo o lote; sotaque neutro |
| **Voz de inglês americano** | en-US | palavras, frases, histórias | falante nativo, articulação clara, ritmo equivalente ao `rate 0,82` de hoje; o inglês dos exemplos já é americano |
| **Voz da professora** (opcional) | pt-BR | explicação dos passos de aula | separada do Bobby, se as amostras indicarem |

Critérios obrigatórios: **licença comercial por escrito** do fornecedor, que cubra aplicativo vendido a famílias; mesma voz, mesmo modelo e mesmas configurações em todo o lote (o fornecedor pode mudar o modelo); **não clonar voz de criança, nem a da filha**: voz de criança é dado de risco alto [03-§4.1]; gravação de pessoa real exige contrato de cessão. Tratar nomes e palavras isoladas (ex.: *Lívia*) com controle de pronúncia. O inglês e o português do mesmo passo de aula (aula de inglês explicada em português com termos em inglês no meio) são **gravados em trechos separados**: hoje o texto sai todo na voz portuguesa (relatório 00, B6/B7), e cada trecho em inglês precisa ser marcado no texto (`<en>...</en>`) na Fase 3. Nas aulas de inglês há 105 cartões isolados já separados (`data-ler`).

### 9.7 Como funciona offline (Service Worker)

Fatos do código: `sw.js` guarda 6 arquivos num único cache `bobby-v3` e, ao ativar, **apaga todo cache com outro nome** (`sw.js:14-18`). Fontes do Google e o jsPDF não são pré-carregados (relatório 00 §2.8). **Sem mudar a regra de ativação, o cache de voz seria apagado a cada versão nova do app.**

Mudanças:
1. A ativação passa a apagar só caches `bobby-v*` antigos e **preserva `bobby-voz-*`**.
2. Cache próprio por pacote: `bobby-voz-core-v1`, `bobby-voz-en-v1`, `bobby-voz-pt-v1`, `bobby-voz-mat-v1`.
3. `core` entra no `install` (cerca de 3 a 5 MB); os pacotes de matéria baixam **quando o responsável toca em "Baixar vozes para jogar sem internet"** (mostra o tamanho) ou na primeira entrada na galáxia, com aviso. Sem download escondido.
4. Estratégia: cache primeiro, depois rede; ao achar clipe novo no manifesto, baixa só o que mudou (nome com hash). Apagar o antigo depois.
5. Tocar com **Web Audio**: `fetch()` do clipe, `decodeAudioData`, `AudioBufferSourceNode.start(t)` em sequência. Evita o problema de pedidos com cabeçalho `Range` em `<audio>` servido pelo service worker no Safari (conhecimento geral, **não verificado**), e dá fila exata para o áudio composto. Uma `AudioContext` só, `resume()` no primeiro toque da criança.
6. `navigator.storage.persist()` pedido no primeiro download; `navigator.storage.estimate()` mostrado ao responsável.
7. Quando o clipe falta e não há rede: mostra o texto e o evento `audio_falha` (seção 7). Nada de voz do aparelho.

**Corrige de uma vez** os bugs de áudio do relatório 00: fila única com token de cancelamento (B1, B9), `S.voz`/`S.som` respeitados (B2), nada de `cancel()` seguido de `speak()` (B5), contexto retomado (B10), pausa em `visibilitychange` (B11). B6 desaparece: o tipo da pergunta não depende mais de existirem vozes no aparelho.

---

## 10. Backlog priorizado

Ordem: **impacto em retenção e aprendizado**, depois dependência. P = até 2 dias, M = 3 a 8 dias, G = mais de 8 dias (**OPINIÃO**; um desenvolvedor). Fase: **2** = motor e dados, sem tela nova obrigatória; **3** = toca a interface, junto do visual; **4** = nuvem e servidor.

| # | Item | Esforço | Depende de | Fase | Critério de pronto |
|---|---|---|---|---|---|
| B01 | `diaLocal()` e correções de base: dia local, anel 1/50, placar de moedas, ofensiva visível no celular (CSS) | P | nenhum | 2 (CSS na 3) | `referencia-ofensiva.js` passa; 21h30 de Brasília conta como o mesmo dia; anel não soma outras matérias; placar igual ao saldo |
| B02 | Estado v4, migração v3 para v4, backup v4 com `soma` | M | B01 | 2 | 10 testes de 8.5 passam; chave antiga intacta; progresso idêntico antes e depois em 3 perfis reais de teste |
| B03 | Separar XP de moeda | P | B02 | 2 (UI na 3) | `xp` nunca cai; gastar em loja não muda `xp`; migração segue 5.7 |
| B04 | Eventos locais, exportar métricas, D1/D7/D30 | M | B02 | 2 (medidor na 3) | 20 eventos de 7.2 gravados; `referencia-retencao.js` bate com o app em dados sintéticos; nenhum campo de texto livre; teto de 4.000 respeitado |
| B05 | Motor de áudio gravado: fila, manifesto, composição por quadros, cancelamento, `S.som`/`S.voz`, Web Audio | G | B06 (amostras) | 2 | build falha se faltar clipe; nenhuma chamada a `speechSynthesis`; B1, B2, B5, B9, B10, B11 não reproduzem; funciona em modo avião depois de baixar o pacote |
| B06 | Produção do áudio: 5 amostras, aprovação de custo e licença, lote Inglês, depois Português, depois Matemática | G | **ok do Filipe**, B05 em paralelo | 2 | amostras aprovadas; licença comercial arquivada; 100% dos clipes do TSV; normalizados; manifesto gerado |
| B07 | Service worker: preservar `bobby-voz-*`, pacotes, botão de download | M | B05 | 2 (botão na 3) | atualização do app não apaga voz; baixa só o que mudou; mostra tamanho |
| B08 | Revisão espaçada (Leitner) + aquecimento + migrar `S.errados` | M | B02, B04 | 2 (tela da Revisão do dia na 3) | regras de 2.3; limite de 10 por dia; erros v3 aparecem escalonados; testes de caixa |
| B09 | Taxonomia: etiqueta `hab` por gerador (900), `dif` 1 a 3, `chave` | M | nenhum | 2 | 900/900 com etiqueta; script de rotulagem + revisão humana |
| B10 | Adaptação por habilidade | M | B08, B09 | 2 | regra de 3.2 em teste automático; camada muda o conjunto de geradores sorteados |
| B11 | Ciclo diário: estado de meta, ofensiva, congelador, missões, baú, bilhete | M | B01, B02, B04 | 2 (telas na 3) | casos de 5.3 passam; missões determinísticas por dia; baú sem sorteio; "Por hoje chega" aparece uma vez por dia |
| B12 | Telas do ciclo diário: rotina de hoje, baú, parada, bilhete, congeladores, topo | G | B11, visual da Fase 3 | 3 | desktop e mobile, console sem erro, ofensiva visível em 390 px, nenhum texto da lista proibida (5.3, 5.6) |
| B13 | Diagnóstico de entrada (motor) | M | B09, B05 (inglês) | 2 | termina em até 12 perguntas; posiciona dentro de ±1 unidade em 20 perfis simulados |
| B14 | Diagnóstico (telas) | M | B13 | 3 | missão com o Bobby, sem nota, opção pular |
| B15 | Feedback que explica: `porque` nos 20 geradores de mais erro | M | B09 | 3 | texto revisado por pedagogo; 100% dos erros desses geradores com explicação |
| B16 | Tipos de pergunta, onda Inglês: T3, T4, T9, T11, T14, T16 | G | B05, visual | 3 | cada tipo com dica degrau 1 e 2, `porque`, teclado, leitor de tela; 40% de interativas fora ouvir-e-tocar |
| B17 | Histórias narradas em inglês (10 por nível) + T13 e T15 | G | B05, B06, visual | 3 | texto revisado; 2 a 3 perguntas por história; sem hotspots decorativos [F18] |
| B18 | Tipos de pergunta, onda Português: T8 a T12 | G | B05 | 3 | idem; 60 textos de leitura com validação de especialista brasileiro |
| B19 | Tipos de pergunta, onda Matemática: T1, T2, T5, T6, T7 | G | B09 | 3 | interativas de 2,8% para pelo menos 20% |
| B20 | Cartão dos pais v2 + controles do responsável | M | B04, B08, B11 | 3 | seções 4.3 a 4.6; sem "ela"; resumo copiável |
| B21 | Lembrete `.ics` | P | B02 | 3 | abre no calendário no iPhone e no Android reais; sem apelido por padrão; hora fora de 07:00 a 19:30 recusada |
| B22 | PBKDF2 no PIN | P | B02 | 2 | PIN antigo continua valendo na migração |
| B23 | Desenho por etapa (30) e galeria por mundo | G | visual | 3 | migração dos 150 para 30 por `mundoCompleto()`; nenhum ícone gigante |
| B24 | Medidor do produto (`medir.html`, fora do app) | P | B04 | 3 | abre pacotes `.json` e mostra D1/D7/D30 e coortes |
| B25 | Conta do responsável, e-mail semanal, Web Push com VAPID, agregação de métricas | G | `lgpd-gate`, `seguranca-minima`, advogado | 4 | RLS conferida no banco; consentimento parental; nenhum dado além de apelido, cor e progresso |
| B26 | Liga da Família (só convidados) | G | B25 | 4 | sem chat; sem ranking público; desligada por padrão; convite só pelo responsável |

**Dentro da Fase 2** (ordem sugerida): B01, B02, B03, B04, B22, B09, B08, B10, B11, B13, B05 + B06 + B07 em paralelo. **Fase 3**: tudo que desenha tela (B12, B14 a B21, B23, B24). **Fase 4**: B25 e B26.

**Por quê esta ordem.** Retenção primeiro, porque a alavanca que mais move app de hábito é a volta no dia seguinte [01-D5 e 01-A28]. Áudio entra cedo porque 85% das perguntas de inglês dependem dele e é a principal queixa. Aprendizado vem junto: recuperação com feedback, espaçamento e feedback informativo têm a melhor evidência e o menor custo [F1, F2, F6]. Visual e tipos de pergunta ficam na Fase 3 porque dependem do elenco novo.

---

## 11. Riscos e o que NÃO fazer

### 11.1 ECA Digital e dark patterns (leitura de [03-§2.5]; **validar com advogado**)

| Risco | Onde aparece aqui | Regra |
|---|---|---|
| Recompensa pelo tempo de uso (Decreto art. 9º, III; ECA Digital art. 17 §4º, II) | meta, baú, ofensiva | meta em **ações**, não em minutos na tela; baú por meta cheia, não por duração; **ofensiva desligável** pelo responsável |
| Ocultar ponto de parada, conteúdo novo sem pedido (art. 9º, I e II) | fim de fase | tela "Por hoje chega!"; nada começa sozinho |
| Notificação excessiva (art. 9º, IV) | lembretes | 1 por dia, janela diurna, ao responsável; criança sem notificação |
| Pressão emocional e urgência fabricada (art. 10, II) | bilhete, ofensiva | sem culpa, sem contagem regressiva, sem "últimas horas" |
| Pressão parassocial do mascote (FTC) | Bobby | o Bobby incentiva; **nunca** triste, decepcionado, com saudade |
| *Loot box* (art. 20) | baú | baú grátis e **sem sorteio**; nunca vender |
| Moeda intermediária (FTC) | moedas | nunca comprável por dinheiro |
| Dado da criança (LGPD art. 14) | eventos, backup | só apelido; sem texto livre; sem microfone; sem voz da criança |
| Perfilamento para publicidade (arts. 22 e 26) | todo o app | zero anúncio |
| Reparo de ofensiva enfraquece o efeito (Silverman e Barasch, só o resumo lido) | recuperação | limitar (14 dias, 3 dias) e **medir** |

### 11.2 Promessas que o app e o site **não** fazem

- Não escrever "método Singapura", "mastery" ou números de Khan, Prodigy, DreamBox, Duolingo como resultado do Bobby. O ensaio aleatório de mastery lido deu 0,10 DP, não significativo [F7]; os números de Khan e Prodigy são correlacionais e de origem própria [F13, F14].
- Não prometer **fluência** em inglês [relatório 02 §5.4].
- Não prometer nota na escola, nem equivalência com a prova da escola: o ganho de tutores aparece em testes alinhados ao conteúdo e cai em testes padronizados [F5].
- Não citar o "0,38% dos congeladores", o "5x" e o "triplicou" como fato [01-C, 01-D].
- Não dizer "baseado em ciência" sem dizer qual parte. A seção 1.2 lista o que tem fonte e o que é hipótese.

### 11.3 O que NÃO fazer no produto

1. Vender congelador, reparo, baú, moeda ou sorteio.
2. Mascote triste, bravo, com saudade, ou que apareça em notificação à criança.
3. Notificação à criança por padrão; lembrete à noite; mais de um por dia.
4. Ocultar a tela de "por hoje chega" ou iniciar conteúdo sozinho.
5. Contagem regressiva, tempo na tela cobrando a criança, ranking público, ranking contra desconhecidos.
6. Mostrar "87 revisões pendentes" ou qualquer fila acumulada.
7. Fazer a criança ver nível subir ou descer; nota; comparar com outras crianças.
8. Pedir microfone, câmera, localização, nome completo, escola, foto.
9. Fazer análise de comportamento para venda ou publicidade; enviar dado a terceiros.
10. Usar a voz do aparelho como reserva; clonar voz de criança.
11. Gravar versão v4 na chave antiga ou apagar a chave `mundo-numeros-v2` ao migrar.
12. Gerar áudio ou imagem sem estimativa de custo e ok explícito do Filipe.
13. Tratar números desta especificação marcados **OPINIÃO** como fato nas conversas com pais ou clientes.

### 11.4 Riscos técnicos e de conteúdo

| Risco | Mitigação |
|---|---|
| Voz composta soa picotada (números, quadros) | teste auditivo com as 5 amostras; plano B de gravar 0 a 1.000 |
| Safari/iOS: Opus, `Range` em áudio, áudio suspenso, instalação | AAC como padrão; Web Audio; `resume()`; testar em iPhone **real** (nenhum teste feito) |
| Licença comercial da voz e das imagens do Google Flow | confirmar por escrito antes de vender (Fase 1 §7) |
| 900 etiquetas `dif`/`hab` feitas à mão | script propõe, pedagogo revisa; começar por Inglês |
| Ordem de grafemas em português | validar com especialista brasileiro [F10, relatório 02 §4.2]; a BNCC não foi aberta |
| Intervalos do Leitner para 7 a 12 anos | começar com 1/3/7/14/30 e medir retenção em 30 dias por caixa [relatório 02 §9] |
| Intercalação para 7 a 9 anos | só depois da 2ª semana do tópico; medir |
| Crianças brincando em aba comum perdem dados | orientar instalação; backup; (Fase 4) conta |
| Data/hora errada no aparelho quebra ofensiva e revisão | usar data do aparelho com tolerância; se `ultimo` > hoje, não penalizar; registrar `relogio_estranho` |
| Dois responsáveis, dois aparelhos, mesmo perfil | sem sincronização até a Fase 4; avisar |
| Trabalho em duas sessões do Code no mesmo projeto | quem abrir sessão no projeto confere antes se há outra mexendo (regra pessoal do Filipe) |

### 11.5 O que esta especificação **não** resolve

- Nenhuma meta numérica de retenção: não existe linha de base. D1/D7/D30 absolutos da Duolingo e do Duolingo ABC não estão em fonte primária [01-C].
- Intervalos, camadas e metas de missão são **hipóteses a calibrar** com as primeiras famílias.
- Nenhum teste em iPhone ou Android reais foi feito nesta fase; B4, B6 e B10 do relatório 00 seguem como risco por leitura.
- Consentimento parental, política de privacidade, termos e leitura do ECA Digital precisam de advogado antes da venda [03-§6].

---

**Revisão independente.** Esta entrega ainda não passou por revisor que não a produziu (regra de nota de entrega do Filipe). Nota: pendente.
