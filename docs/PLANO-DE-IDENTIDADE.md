# PLANO DE IDENTIDADE · O Universo de Bobby

Versão 1 · 24/10/2026 · branch `reforma-fase-2` · nota do Filipe depois de jogar: 5 de 10 (antes 2). Frase dele: "melhorou muito, mas ainda é uma coisa meio genérica a zona".

Nada foi alterado em `src/`. Nenhuma imagem, áudio ou voz foi gerado e nenhum crédito foi gasto. Este arquivo é o único gravado.

**Como ler as marcas de confiança.** Cada afirmação sobre fora do projeto diz de onde veio e o que eu abri de verdade. **ABERTO** = li a página ou o PDF nesta sessão. **RESUMO** = vi só o resumo que a busca devolveu, sem abrir o texto. **NÃO ABRI** = a fonte existe, mas não li o conteúdo. **OPINIÃO** = inferência minha. Contagens do projeto saíram de comandos rodados nesta sessão (`wc`, `du`, `gzip`, `grep`).

---

## 0. Resumo em 12 linhas

1. O app melhorou na vitrine (mapa, baú, desenhos, Meu personagem) e continua igual a qualquer app de quiz na sala de máquinas: a tela de pergunta.
2. A criança passa quase todo o tempo na pergunta. Nela, o Bobby é um círculo de 56 px, não há cena, não há som próprio, não há reação com humor e o único mundo visível é um cartão azul-marinho com a lista 1, 2, 3, 4.
3. A crítica da filha ("imagem com colagens sem graça por cima") voltou de outra forma: a arte 3D boa está colada em círculos e emblemas sobre uma interface plana e igual para as três matérias.
4. Som hoje: 6 bipes de onda senoidal e nenhuma trilha. É o maior buraco de identidade por custo. Dá para resolver com síntese no próprio navegador, 0 KB de arquivo.
5. A história existe só como parágrafo de abertura. Ela não avança, não tem problema nem personagem que volte, e some quando a pergunta começa.
6. Os companheiros (Teo, Rufa, Otto, Brisa, Capi, Fagulha) existem como arte aprovada e quase não aparecem no jogo.
7. O plano tem 15 mudanças em ordem de impacto sobre esforço, em 3 ondas de uma semana de agente.
8. A Onda 1 não precisa de nenhuma imagem nova: usa as 164 imagens que já estão no app e muda o que a criança vê e ouve em toda pergunta.
9. Peso: o app inicial está em cerca de 2,9 MB brutos (índice 677 KB, arte inicial 2,29 MB). Sobra menos de 100 KB. Tudo que for novo entra por carga tardia, depois da primeira tela, como a arte e o áudio já fazem.
10. Ética: nada aqui usa dinheiro, urgência, culpa ou sorteio. Proponho tirar as vidas e o botão "continuar por 50 moedas" (decisão D1).
11. Quem decide: 9 decisões do Filipe no fim (seção 10).
12. Meta de aceite: o Filipe sobe de 5 para 8 no mesmo jogo de 15 minutos, e a filha reconhece o app só pelo som e por um print sem logo (seção 9).

---

## 1. Por que ainda parece genérico: 7 causas, da mais pesada para a mais leve

### Causa 1 · O laço central é um quiz de formulário
Medido nas capturas: a tela de pergunta (`11`, `13`, `16`, `21`, `celular-toque-mat-erro`) tem, de cima para baixo, barra de progresso, cartão "Contar as sementes 0 de 8", retrato redondo do Bobby com o texto "Pergunta 1", cartão azul "Lembre da aula" aberto, o enunciado e uma lista de alternativas numeradas. Em 390 x 844 a quarta alternativa fica cortada atrás do botão Verificar (captura `13-m390-mat-q1-pergunta`). O "Lembre da aula" ocupa cerca de um terço da tela. Isso é o desenho de qualquer app de exercícios. É também o que a filha chamou de "colagem sem graça": o personagem real entra como adesivo redondo.

### Causa 2 · Integração extrínseca: a história é prefácio, o jogo é prova
A abertura da fase conta "O Bobby resolveu plantar uma horta" (captura `10`). Na pergunta seguinte ninguém planta, ninguém colhe, a contagem de sementes vira um ícone de 20 px no cartão do topo. A pesquisa que mais se aproxima do problema (Habgood e Ainsworth, 2011, **ABERTO** no PDF da versão aceita): num jogo de matemática para 7 a 11 anos, a versão em que o ato de responder é a própria mecânica do jogo ensinou mais com tempo fixo (58 crianças) e foi jogada 7 vezes mais tempo quando a criança podia escolher (16 crianças). Limites: amostras pequenas; um resumo de busca diz que replicações posteriores foram mistas (**RESUMO**, não abri). Uso como direção, não como promessa.

### Causa 3 · O Bobby não tem voz de personagem
O elogio sai de `pick2(['Isso aí!','Boa!','Perfeito!','Mandou bem!','Certinho!','Show!'])` em `licao.js:396`, e o erro diz "Quase!". São as frases de todo app de quiz. Não há humor, não há memória ("você acertou 3 seguidas"), não há reação diferente por matéria e os seis companheiros nunca falam na pergunta. O blog da Duolingo sobre o elenco dela (**ABERTO**, sem data na página) diz que os personagens "falam" a frase do exercício na maioria das telas, que cada um tem animação própria para o acerto e que o humor é central. É a parte do produto que as pessoas lembram.

### Causa 4 · Silêncio e bipe
`som-e-voz.js` tem seis funções (`somCerto`, `somErro`, `somFim`, `somMoeda`, `somPasso`, `somVida`), todas uma onda senoidal. Não há trilha, nem som de interface, nem passos com superfície, nem baú com rangido, nem som de companheiro, e um único interruptor liga ou desliga tudo (`S.som`). A voz gravada (3.635 clipes, 3 h 14 min, Kokoro `pm_alex`, `audio/LEIA-ME.md`) é boa e fica sozinha, sem camada de som embaixo.

### Causa 5 · A interface é a mesma nas três matérias
As capturas de Matemática, Português e Inglês mudam o acento (azul, violeta, turquesa) e o resto é o mesmo azul-marinho, o mesmo cartão, o mesmo botão. Os cenários (`CENARIOS-E-DESENHOS.md`) dizem latão e cobre, papel e lanterna, madeira branca e corda; nada disso chegou ao cartão, ao botão ou à moldura da pergunta.

### Causa 6 · O mundo não muda
O mapa é bonito e parado: sem clima, sem hora do dia, sem o companheiro andando junto, sem coisa que apareça de um dia para o outro. O Bobby anda entre nós, e só. A "rotina de hoje" (captura `25`) é uma lista de verificação com pergaminhos.

### Causa 7 · Acabamento que denuncia amadorismo
- Cartão "Looks" com o nome do item escrito por cima da imagem (captura `35-m390-looks-2`).
- Estrela da missão gigante na rotina (captura `26`, já tratada na 5ª passada, conferir).
- Computador: coluna de 640 px no meio de um vazio escuro (captura `45-d1280-mapa-dobra1`, `revisao-final-3/1280x800-04`).
- Fim de fase com três cartões de estatística ("Acertos", "Moedas", "Melhor combo", captura `19`), painel típico de aplicativo de produtividade.
- Vidas (5 corações) e o botão "continuar por 50 moedas" depois do erro (captura `celular-toque-mat-erro`): o estado de falha é o que menos combina com "sem culpa" e já está marcado como pendente de advogado no README da Fase 3.

> OPINIÃO sobre o conjunto: o app tem arte de RPG na vitrine e interface de formulário no corpo. A nota 5 é essa diferença. Subir a nota é levar o mundo para dentro da pergunta, dar voz ao elenco e dar som a tudo, antes de gerar mais arte.

---

## 2. O que já é distintivo (e não pode ser perdido)

| O que | Onde se vê | Por que importa |
|---|---|---|
| Bobby em render 3D semirrealista, 12 poses e 8 expressões, recortados | `31`, `celular-visual-5-corpo`, fim de fase `19` | A filha pediu "mais realista, como RPG". Isso responde ao pedido e poucos apps infantis têm |
| Planetas e cenários por matéria, com a cena que acende por fase | `celular-visual-1-mapa-etapa`, planetas em `03` | Mundo de verdade, com profundidade e luz coerente |
| Looks reais em corpo inteiro (lenço, capa, capacete) | `celular-looks` | Personalização visível, sem colagem |
| Desenho por etapa que a criança colore dentro do app | `37`, `39` | Algo para levar, ligado ao cenário da etapa |
| "Por hoje chega" e bilhete do Bobby segurando a carta | `29`, `celular-ciclo-1-bilhete` | Ponto de parada honesto, raro no mercado, e ligado à lei |
| Voz gravada local, 100% sem voz do aparelho | `audio/` | Funciona igual em qualquer celular, offline |
| Baú 3D e ícones de recompensa | `28`, `celular-ciclo-6-bau-aberto` | Recompensa tem cara de objeto, não de emoji |
| Premissa de capítulo e missão por fase | `historias-*.js` | A base de história já existe (30 capítulos, 150 missões) |

---

## 3. O que as referências ensinam (com fonte, data e limite)

Tabela curta; o que importa para decisão está na coluna "Uso aqui".

| Tema | Fonte e data | O que abri | O que diz | Limite | Uso aqui |
|---|---|---|---|---|---|
| Integração intrínseca | Habgood e Ainsworth, J. Learning Sciences 20(2), 2011 | **ABERTO** (PDF aceito, SHURA) | Responder como mecânica do jogo: mais aprendizado em 2 h (58 crianças, 7 a 11 anos) e 7 vezes mais tempo livre (16 crianças) | Amostra pequena; replicações mistas (**RESUMO**) | Mudanças 1, 8, 15: a pergunta passa a ser ação dentro da cena |
| Recompensa e motivação | Deci, Koestner e Ryan, Psychological Bulletin 125(6), 1999 | **RESUMO** (128 estudos) | Recompensa ligada a engajamento, término ou desempenho reduziu a motivação livre (d de -0,40, -0,36 e -0,28) | Há disputa com a meta-análise de Cameron e Pierce | Moedas e baú ficam de fundo; o centro é fazer, descobrir e colecionar |
| Personalização e contexto | Cordova e Lepper, J. Educ. Psychology 88(4), 1996 | **RESUMO** da citação; uma revisão a cita como exceção com ganho em matemática | Contextualizar e personalizar a tarefa (nome, escolhas) aumentou motivação e aprendizado | Não li o resumo do artigo | Mudança 12 (personalização que muda o que se vê) |
| Escolha | Patall, Cooper e Robinson, Psych. Bulletin, 2008 | **RESUMO** (41 estudos) | Dar escolha aumentou motivação intrínseca, esforço e competência percebida | Resumo de busca | Escolher quem faz a pergunta, cor e looks |
| Narrativa e aprendizado | Adams e outros, J. Educ. Psychology 104, 2012 | **NÃO ABRI** os resultados (só a citação) | Estudo com universitários sobre jogos narrativos | Não sei o achado, não uso para decidir | Regra de prudência (OPINIÃO): história curta, com áudio, que nunca aumente a leitura obrigatória |
| Elenco e humor | Duolingo, "Building character" (blog) | **ABERTO**, sem data na página | 18 meses de elenco, personagens "falam" o exercício, animação própria no acerto e na sequência, humor central | Fonte da própria empresa | Mudanças 1 e 3 |
| Brincar sem placar | Sago Mini (KidScreen, 09/04/2015); Toca Boca | **RESUMO** (a página abriu vazia para mim) | Apps sem níveis, sem texto e sem narração; testes mostraram criança passiva diante de narrador | Segunda fonte sobre Toca Boca é fraca | Mudança 5: tirar o estado de falha; ponto de parada claro |
| Elenco educativo gratuito | Khan Academy Kids (site e App Store) | **RESUMO** | 5 personagens, cada um com foco (letras, números, histórias, quebra-cabeças); sem anúncio, sem assinatura | Declaração da própria Khan | Um guia por matéria que fala na pergunta |
| Anti-exemplo | Prodigy, reclamação à FTC (Axios 19/02/2021; EdWeek 02/2021) | **RESUMO** | Itens exclusivos de assinante tentando a criança | Não vi o desfecho | Nenhum item atrás de pagamento, nunca |
| Resposta imediata | Nielsen, "Response Times" (1993, atualizado em 2014) | **ABERTO** | Até 0,1 s parece instantâneo | Texto geral de interface | Critério de pronto: toque até reação visual em 100 ms |
| Fim marca a memória | NN/g, "Peak-end rule" (30/12/2018); Kahneman e outros, 1993 | **ABERTO** | O pico e o fim pesam mais que a média | Evidência de adultos | Mudança 6: o fim de fase e de etapa é onde se investe a emoção |
| Game feel e suco | Palestra "Juice it or lose it" (Jonasson e Purho, 2012) | **RESUMO** (as fontes divergem no local do evento) | Efeitos pequenos dão sensação de vida a um protótipo | Há contra-argumento sobre perda de imersão | Mudança 4, com medida e sem excesso |
| Vibração no navegador | MDN, Vibration API | **ABERTO** | "Not Baseline": não funciona nos navegadores mais usados | A tabela não carregou; iPhone **NÃO verificado** (OPINIÃO: não suporta) | Háptica só como extra em Android, com detecção de recurso |

**Os três eixos que a pesquisa de educação apoia (autonomia, competência, pertencimento)** viram escolhas do plano: autonomia = escolher quem pergunta, cor e looks (mudanças 1 e 12); competência = feedback que explica, pergunta que muda de tipo, estrelas pelo domínio e nunca por pressão (mudanças 3, 8, 15); pertencimento = elenco que lembra e um céu com o nome da criança (mudanças 7 e 12). A autoria dos três nomes é da teoria da autodeterminação; **não consegui abrir** o artigo de Ryan e Deci (2000), o PDF veio ilegível. Os nomes dos três eixos estão no conhecimento geral e no trabalho de Patall (resumo).

---

## 4. Diagnóstico tela por tela

Capturas vistas: 33 (revisao-final-2, revisao-final-3 e `testes/saida`). A pasta `testes/saida` é mais recente que `revisao-final-2` e já tem o mapa novo com nós sobre o cenário.

| # | Tela (captura) | O que ainda é genérico e por quê | O que já é distintivo |
|---|---|---|---|
| 1 | Escolha do planeta (`03`, `44-d1280-chooser`) | Três cartões iguais em lista; planeta pequeno (56 px) ao lado de texto explicativo; só muda a cor do texto | Os três planetas têm arte própria |
| 2 | Mapa, topo (`24`, `45`) | Cabeçalho com "Oi, Lia", barra de progresso e "Rotina de hoje" parecem painel de app; o planeta sem animação | Planeta com guia (Teo, Rufa) ao lado |
| 3 | Mapa, trilha da etapa (`celular-visual-1-mapa-etapa`, `09`) | Nós são círculos azuis iguais nas três matérias e cobrem a arte; rótulos em caixas escuras empilhadas | Diorama 3D com Bobby ao lado do nó, estrelas, cena que acende |
| 4 | Abertura da fase (`10`) | Cartão de texto sobre fundo escuro, Bobby de 56 px, botão "Vamos ajudar!" | Capítulo com nome, premissa de história, áudio |
| 5 | Pergunta de escolha (`13`, `16`, `21`) | **A mais genérica.** Lista numerada, retrato redondo, "Pergunta 1", lembrete em cartão aberto, sem cena, sem personagem falando, 4ª opção cortada | Cartão do topo com o item do capítulo (semente) |
| 6 | Pergunta numérica (`14`) | Teclado 1 a 9 padrão num cartão, sem objeto contável, sem figura | Fonte Fredoka com números grandes |
| 7 | Feedback de acerto e de erro (`13` feedback, `22`, `14` erro) | Painel de base "Show!" e "Quase!" iguais ao padrão de mercado; Bobby de 48 px no canto | Seta circular em vez de X, sem sacudir, pergunta volta no fim |
| 8 | Fim de fase (`19`, `celular-ciclo-4`) | Três cartões de estatística; frase de elogio em caixa verde | Bobby 3D comemorando, confete, estrelas, desenho a ganhar |
| 9 | Baú (`28`, `celular-ciclo-6`) | Modal "Você ganhou" + botão laranja grande | Bobby e baú 3D, adesivo com foto de recompensa |
| 10 | Rotina de hoje (`25`) | Lista de verificação de missões | Pergaminho 3D no lugar de ícone |
| 11 | "Por hoje chega" (`29`) | Modal de texto com dois botões | Conceito raro e honesto, pose Tchau |
| 12 | Bilhete do Bobby (`celular-ciclo-1`) | Modal igual aos outros, só muda o texto | Bobby segurando a carta |
| 13 | Meu personagem e Looks (`31`, `35`, `celular-looks`) | Grade de cartões com preço em moedas (loja); sobreposição de texto no cartão do chapéu | Corpo inteiro real, companheiro ao lado, looks 3D |
| 14 | Desenhos e colorir (`37`, `39`) | Paleta de balde padrão, grade de miniaturas com cadeado e desfoque | Desenho consistente com o cenário da etapa |
| 15 | Perfil (`55`) | Grade de estatísticas com ícones | Retrato do Bobby no topo |
| 16 | Computador (`45`, `revisao-final-3`) | Coluna de 640 px no centro, vazio escuro dos lados, o planeta desfocado ao fundo | Planeta desfocado ao fundo dá clima |

---

## 5. O plano: 15 mudanças em ordem de prioridade

**Como li "prioridade".** Impacto percebido de 1 a 5 (quanto muda a sensação de produto na primeira partida) sobre esforço em dias de agente (P = até 1 dia, M = 2 a 3, G = 4 ou mais, OPINIÃO). Todas respeitam: sem dinheiro, sem urgência, sem culpa, sem sorteio, sem dado novo da criança. Imagens só no Google Flow a 0 crédito, som sintetizado ou CC0 conferido, voz Kokoro local. Todas fecham com fumaça em desktop e celular, console limpo, captura e nota do `revisor-de-entrega`.

### Mudança 1 · A pergunta passa a acontecer dentro da cena, dita pelo guia
- **O que muda.** O enunciado sai do cartão e entra num **balão de fala do guia da matéria** (Teo, Rufa ou Otto), com o guia em corpo de 96 px e a pose de acordo com a hora: `p03` (explica) durante a pergunta, `p02` (comemora) no acerto, `p04` (incentiva) no erro, `p01` (oi) na chegada. Atrás da pergunta, o cenário da etapa (já existe, `cen-*-completo`) recortado e escurecido com desfoque, não mais um fundo liso. A moldura e o botão ganham o **material do planeta** só por token (latão e cobre no Numeral, papel e pergaminho na Fábula, madeira clara e corda no Horizonte). O "Lembrete da aula" começa **fechado**, abre com um toque e abre sozinho depois de dois erros seguidos. Alternativas em cartões maiores, em grade de 2 colunas quando forem curtas, todas visíveis em 360 x 640. O retrato do Bobby fica como ajudante secundário (o jogador, no canto).
- **Tela.** Pergunta de escolha, numérica, de ouvir.
- **Ativo.** Nenhum novo: `assets/companheiros/{teo,rufa,otto}-p01..p04`, `assets/cenarios/cen-*-completo`, expressões do Bobby.
- **Pronto quando.** (a) Enunciado dentro do balão em 100% dos tipos; (b) em 360 x 640 e 390 x 844 as 4 alternativas ficam visíveis sem rolar com o lembrete fechado (teste por `elementFromPoint` e `getBoundingClientRect`); (c) a troca de pose do guia acontece em até 100 ms depois do toque (medida por `performance.now` entre `pointerdown` e a troca da imagem, 20 toques); (d) fumaça passa; (e) peso inicial não sobe mais que 25 KB brutos.
- **Risco ético.** Baixo. O guia nunca aparece triste nem decepcionado.
- **Mexe em `src/`.** Sim: `licao.js` (montagem da pergunta), `arte.js`, `style.css`.

### Mudança 2 · Design de som completo, sintetizado (0 KB)
- **O que muda.** Um módulo `sfx.js` com a lista da seção 6: acerto escalonado, erro gentil, passos por superfície, UI, baú, fim de fase, fim de etapa, motivos dos companheiros e ambiente por planeta. Três interruptores separados (Efeitos, Música, Voz) em "Voz e som". Voz tem prioridade: toda fala gravada abaixa o resto em 10 dB.
- **Tela.** Todas.
- **Ativo.** Nenhum arquivo. Síntese em Web Audio no próprio app (a base `nota()` já existe). Substitui os 6 bipes.
- **Pronto quando.** (a) Os 28 sons da seção 6 existem; (b) renderizados em `OfflineAudioContext` pelo teste, pico de até -6 dBFS e duração dentro da tabela; (c) o erro mais baixo que o acerto em 6 dB e sem energia abaixo de 250 Hz; (d) interruptores independentes, e voz continua quando efeitos estão desligados; (e) o primeiro toque desbloqueia o áudio sem erro de política de autoplay; (f) peso: +4 KB brutos de código, 0 KB de dados.
- **Risco ético.** Som alto ou surpresa: pico limitado e entrada suave de 10 ms; nenhum som de alarme, nenhum som que acelere.
- **Mexe em `src/`.** Sim: `som-e-voz.js`, `licao.js`, `ciclo-ui.js`, `mapa-e-trilha.js`, `perfil-e-responsavel.js`.

### Mudança 3 · Banco de falas e reações, com humor e memória
- **O que muda.** `falas.js` com situação → frases por personagem (seção 7), sorteio sem repetir as últimas 4, uma fala "rara" a cada 8 acertos, e frases que usam a memória do jogo (sequência, primeira de primeira, volta depois de erro). O elogio de 6 frases e o "Quase!" saem. Cada guia tem voz própria (Teo exato, Rufa de conto, Otto que repete duas vezes e mistura inglês, Capi calmo, Brisa que duvida de brincadeira, Fagulha baixinho). Tocar no Bobby ou no guia fala (cócegas, humor). Frase de ocioso sempre tranquilizadora ("sem pressa"), nunca cobra.
- **Tela.** Painel de feedback, mapa, fase, fim de fase, baú.
- **Ativo.** Texto (seção 7); áudio Kokoro local (pt-BR `pm_alex`, `pm_santa`, `pf_dora`, com variação de tom e velocidade por personagem, sem custo). Lote de cerca de 200 falas, 8 a 11 minutos, cerca de 2 MB em AAC 24 kbps (conta: 3 KB por segundo; estimativa a medir), em pacote tardio.
- **Pronto quando.** (a) 100% das falas com clipe (`testes/cobertura-audio.js` sem aviso); (b) nenhuma fala passa de 15 palavras; (c) `copy-check` com PROIBIDOS 0; (d) lista de palavras de tristeza e culpa ("triste", "saudade", "decepcion", "você perdeu", "faz dias") com 0 ocorrência; (e) teste de repetição: em 200 acertos simulados, nenhuma frase igual em janela de 4; (f) a filha ouve e aprova a voz de pelo menos 5 dos 7 personagens.
- **Risco ético.** O maior da lista: pressão parassocial do mascote (FTC, citada no relatório da Fase 1). Regra: o personagem incentiva e nunca pede nem sente falta. Revisão com a lista da seção 7.4.
- **Mexe em `src/`.** Sim: `licao.js`, `ciclo-ui.js`, `personagem.js`, `audio-clipes.js` (novas chaves), `audio/regerar-pendentes.json`.

### Mudança 4 · Game feel: resposta em 100 ms e microanimações com intenção
- **O que muda.** Pressão de botão (escala 0,97 em 120 ms, já no DESIGN); opção tocada afunda e faz "tique"; a certa pulsa uma vez e a moeda voa até o contador em 480 ms; a barra de progresso enche com curva suave; transição entre perguntas (a atual sai para a esquerda em 180 ms, a nova entra em 240 ms); troca de expressão do Bobby em 100 ms; vibração curta de 10 ms em Android quando houver o recurso (iPhone: **NÃO verificado**, tratar como ausente). Tudo `transform` e `opacity`, respeitando `prefers-reduced-motion`.
- **Tela.** Pergunta, feedback, mapa.
- **Ativo.** Nenhum.
- **Pronto quando.** (a) Reação visual do toque em até 100 ms (Nielsen), 20 toques medidos em Chrome pelo CDP; (b) no máximo 2 animações simultâneas além da celebração (regra do DESIGN); (c) com `prefers-reduced-motion` o fluxo funciona e nada anima; (d) desligar a vibração está a 2 toques em "Voz e som"; (e) 60 quadros por segundo só se conta depois de teste em aparelho real, o que ainda não aconteceu.
- **Risco ético.** Brilho e movimento viciantes: sem loop infinito, sem pisca, sem contador rolando. O DESIGN.md já proíbe bounce e overshoot; manter assim nas telas de estudo e discutir só nas celebrações (decisão D2).
- **Mexe em `src/`.** Sim: `style.css`, `licao.js`.

### Mudança 5 · Sem estado de falha, e acabamento que denuncia amadorismo
- **O que muda.** (1) Fim das vidas e do "continuar por 50 moedas": o erro só devolve a pergunta ao fim da fila. (2) Layout de computador: cenário e pergunta em duas colunas (guia e cena à esquerda, interação à direita) em 1024 px ou mais. (3) Cartão de Looks sem sobreposição de texto. (4) Fim de fase sem os 3 cartões de estatística: uma linha ("8 de 8, 90 moedas") e a fala do guia.
- **Tela.** Pergunta, fim de fase, Looks, todas no computador.
- **Ativo.** Nenhum.
- **Pronto quando.** (a) Nenhum elemento com `.vida` ou texto "continuar por" no DOM; (b) 3 capturas (1280, 390, 360) sem texto sobreposto, conferido por varredura de caixas que se cruzam; (c) em 1280 x 800 o conteúdo usa pelo menos 70% da largura; (d) o conteúdo antigo das vidas guardado em `legado` no estado (nada se perde).
- **Risco ético.** Diminui o risco. Pedir parecer do advogado sobre o que sobrou do ciclo de moedas.
- **Mexe em `src/`.** Sim: `licao.js`, `style.css`, `personagem.js`.

### Mudança 6 · Cerimônia de fim de fase, de etapa e de conquista
- **O que muda.** Três tamanhos, descritos na seção 8: fase (até 3 s), etapa (até 8 s, pode ser pulada), planeta (até 20 s, pode ser pulado). Cada um com som, fala do guia, peça do cenário acendendo e um único botão de continuar com peso igual ao de "Ver" (nunca um botão enorme e um link apagado).
- **Tela.** Fim de fase, fim de etapa, perfil (conquistas).
- **Ativo.** Já existem: `cen-*-apagado/completo`, `rec-trofeu`, `rec-medalha`, `bobby-p02`, `*-p02`, confete. Novo: nenhum. (A parte do céu e da estrela entra com a mudança 7.)
- **Pronto quando.** (a) Duração medida: fase menor que 3 s, etapa menor que 8 s; (b) toque em qualquer ponto depois de 1 s pula; (c) com som desligado a cerimônia funciona com os mesmos textos; (d) o resultado do jogo (estrelas, moedas) não muda por pular; (e) em 20 etapas simuladas, a recompensa é a mesma de sempre (sem sorteio).
- **Risco ético.** Efeito de caça-níquel. Regras: recompensa fixa e conhecida, sem "abrir surpresa", sem repetição automática, sem contagem regressiva.
- **Mexe em `src/`.** Sim: `licao.js` (fim), `mapa-e-trilha.js`, `ciclo-ui.js`.

### Mudança 7 · Narrativa em arco: o Embaralho e as três estrelas do céu
- **O que muda.** Um fio por planeta (seção 7.2): o **Embaralho**, um cometinha travesso que troca as coisas de lugar por brincadeira, derrubou as três estrelas-guia (cobalto, violeta, turquesa). Cada etapa avança uma frase; a etapa 6 mostra o Embaralho, as 7 a 9 são o jogo de pega-pega amistoso, a 10 devolve a estrela e vira festa. Ao devolver as três, acende a **constelação do Bobby com o nome da criança**. A abertura da fase passa de 4 linhas para 2 e a história aparece de novo no fim da fase e da etapa, sempre com áudio e botão "Pular".
- **Tela.** Abertura da fase, fim de etapa, perfil (céu).
- **Ativo.** Texto (30 frases + 6 falas do Embaralho, seção 7.2). Imagens no Flow, 0 crédito: Embaralho (1 folha + 4 poses), 3 estrelas, 1 céu com a constelação apagada e acesa. Quantidade: 10 imagens. Peso: cerca de 0,5 MB, **estimativa a medir**, em carga tardia.
- **Pronto quando.** (a) 30 frases de até 20 palavras, `copy-check` PASSOU; (b) cada etapa mostra a sua frase na abertura e no fim; (c) "Pular" a 1 toque e nunca perde recompensa; (d) o jogo funciona sem ler uma linha (áudio em todas); (e) o Embaralho tem silhueta distinta do Bobby e dos 6 companheiros no teste de 96 px.
- **Risco ético.** Vilão assustador: ele é travesso e vira amigo. Sem ameaça, sem perda para a criança.
- **Mexe em `src/`.** Sim: `historias-*.js`, `licao.js`, `perfil-e-responsavel.js`, `arte.js`. Busca de marca do nome "Embaralho" no INPI antes de vender (decisão D3).

### Mudança 8 · Tipos novos de pergunta, onda 1: ligar pares, arrastar para grupos, ordenar, ouvir e tocar a figura
- **O que muda.** Quatro tipos da especificação (T4, T1, T3, T14) com a regra do DESIGN (arrastar nunca é o único jeito: sempre dá para tocar e depois tocar o destino). Detalhe na seção 9.
- **Tela.** Pergunta.
- **Ativo.** Os três primeiros não precisam de imagem nova (números, sílabas, objetos já existentes). O quarto (ouvir e tocar a figura, inglês) precisa de **40 figuras de palavras comuns** (4 folhas do Flow, 10 por folha), cerca de 8 KB cada, estimativa a medir, tardio.
- **Pronto quando.** (a) 4 tipos no ar, cada um com dica degrau 1 e 2, `porque` por erro comum, rótulo de acessibilidade e teclado; (b) toque real pelo CDP, mouse no computador e toque no celular, com e sem arrastar; (c) interativas passam de 2,8% para pelo menos 15% da matemática nesta onda (meta final da spec: 25%) e inglês sem depender só de ouvir e tocar texto; (d) 0 erros no console.
- **Risco ético.** Nenhum específico. Sem cronômetro.
- **Mexe em `src/`.** Sim, o maior item de código: `licao.js`, geradores em `conteudo/*.js`, `style.css`.

### Mudança 9 · Mapa vivo: companheiro andando, clima, hora do dia, coisas que mudam
- **O que muda.** Seção 10. O guia do planeta anda atrás do Bobby; clima próprio por planeta feito de partículas em CSS; a hora do dia vem do relógio do aparelho e muda a luz por sobreposição (sem trocar imagem); Bobby troca de pose em repouso; três pontos de toque por cenário, cada um com uma frase e uma figurinha achada (liga com a mudança 13).
- **Tela.** Mapa.
- **Ativo.** 3 poses "caminha" dos guias (Teo, Rufa, Otto), no Flow, 0 crédito. O resto é CSS.
- **Pronto quando.** (a) Guia aparece andando em 3 planetas; (b) 4 faixas de hora com contraste AA conferido nas 4; (c) com `prefers-reduced-motion` tudo estático; (d) nenhum pisca; (e) no máximo 12 elementos animados na tela; (f) peso: +40 KB de arte, tardio.
- **Risco ético.** A faixa da noite não pode virar pressão para parar ou continuar. A frase "boa noite" aparece uma vez por dia, sem botão de cobrança.
- **Mexe em `src/`.** Sim: `mapa-e-trilha.js`, `style.css`.

### Mudança 10 · Trilha musical por planeta, com loop
- **O que muda.** Uma trilha leve para cada planeta e uma para o menu, com loop, que abaixa na pergunta e some na fala. Seção 6.3 traz as opções reais e o caminho recomendado: **primeiro versão gerada no navegador (0 KB, sem dúvida de licença), depois decidir com o Filipe se entra uma trilha CC0 gravada**.
- **Tela.** Mapa, planetas, menu, fim de etapa; muda por planeta.
- **Ativo.** Opção A: código. Opção B: 3 a 4 faixas CC0 transcodificadas (cerca de 250 a 400 KB cada, **estimativa**), carga tardia, nunca no pacote inicial.
- **Pronto quando.** (a) Loop sem estalo (teste: soma das amostras na emenda abaixo de -60 dBFS); (b) volume de música em -24 LUFS e voz em -16 LUFS (padrão do `audio/LEIA-ME.md`); (c) música desligável em 1 toque, preferência guardada; (d) licença de cada arquivo registrada em `docs/CREDITOS-AUDIO.md` com URL, autor, linha da licença, data de acesso e SHA-256; (e) nenhum arquivo de licença NC ou CC-BY sem tela de crédito.
- **Risco ético.** Música que prende ou acelera: tempo fixo, sem crescendo por insistência.
- **Mexe em `src/`.** Sim: novo `musica.js`, `som-e-voz.js`, `sw.js` (cache tardio).

### Mudança 11 · O desafio da Brisa no fim de cada etapa (o "chefe amistoso")
- **O que muda.** A fase de revisão da etapa vira uma cena de RPG: a Brisa aparece com a pose `p03` (desafio), a criança responde 5 perguntas mistas, uma barra "de coragem" da Brisa desce a cada acerto. Erro nunca tira nada da criança; a Brisa só "se recupera um pouquinho" e a pergunta volta. Ela sempre perde com graça e dá uma pena como selo.
- **Tela.** Revisão de etapa.
- **Ativo.** Nenhum novo (já existem `brisa-p01..p04`). Selo "pena da Brisa" como `rec-pena` no Flow (1 imagem).
- **Pronto quando.** (a) 100% das crianças simuladas terminam (nenhum caminho sem fim ou com derrota); (b) as falas da Brisa passam no `copy-check` e na lista de tristeza e culpa; (c) som e fala próprios; (d) a recompensa é a mesma de antes.
- **Risco ético.** "Competição" com o mascote é o ponto delicado; regra: a Brisa nunca ganha da criança.
- **Mexe em `src/`.** Sim: `licao.js` (bloco de revisão), `ciclo.js`.

### Mudança 12 · Personalização que muda o que se vê e o que se ouve
- **O que muda.** (1) A criança batiza o céu: "Constelação da Lia" (apelido, só no aparelho). (2) A cor do perfil passa a pintar o rastro do Bobby no mapa, o halo da constelação e a borda do balão do jogador. (3) Escolher o guia que pergunta em qualquer matéria (padrão: o da matéria). (4) Os looks aparecem em 4 poses (Oi, Comemora, Caminha, Pensa) em vez de voltar à base (hoje só há uma pose por look). (5) O "acampamento": uma tela onde ficam os desenhos pintados e as figurinhas.
- **Tela.** Meu personagem, mapa, perfil.
- **Ativo.** 7 looks x 3 poses extras = 21 imagens no Flow, cerca de 45 KB cada, **estimativa**, cerca de 1 MB tardio, com retorno à base se o arquivo faltar.
- **Pronto quando.** (a) Nome do céu sanitizado e limitado a 24 caracteres, guardado em `S`, nunca enviado; (b) a cor muda em 3 lugares; (c) look visível em 4 poses; (d) nenhum campo novo no backup além de nome do céu e guia escolhido (revisão pela `lgpd-gate`).
- **Risco ético.** Dado da criança: só apelido, cor e escolhas, sempre local.
- **Mexe em `src/`.** Sim: `personagem.js`, `estado.js`, `backup.js`, `mapa-e-trilha.js`.

### Mudança 13 · Álbum de figurinhas: cada peça acesa do cenário vira coleção
- **O que muda.** Cada etapa tem 5 peças que se montam; cada peça acesa vira uma figurinha no álbum, 150 no total, sem raridade, sem sorteio e sem contagem de "faltam". Aparecem só as já achadas e a silhueta da próxima. Substitui o SVG de 20 px do cartão do topo da pergunta.
- **Tela.** Perfil, acampamento, pergunta.
- **Ativo.** Os mesmos kits da mudança 14 (as 5 peças de cada capítulo).
- **Pronto quando.** (a) 150 figurinhas ligadas ao progresso; (b) nenhuma tela mostra "faltam N" nem lista de vazias; (c) álbum funciona offline depois de carregado.
- **Risco ético.** Coleção pode gerar ansiedade de completar. Mitigação: sem contador de falta, sem prazo, sem raridade.
- **Mexe em `src/`.** Sim: `estado.js`, `desenhos-ui.js` (reuso), `licao.js`.

### Mudança 14 · Arte de contexto: kits de objetos por capítulo e cena dentro da pergunta
- **O que muda.** Uma folha do Flow por capítulo com 12 objetos soltos sobre fundo liso (5 peças do cenário + 7 objetos de contar), recortados e separados em WebP pequeno. As perguntas de contar, arrastar e ligar usam esses objetos em vez de ícones. A pergunta "Se você tem 13 figurinhas e ganha mais 1" mostra as figurinhas.
- **Tela.** Pergunta de contar, arrastar e ligar; álbum.
- **Ativo.** 30 folhas x 12 = 360 objetos, cerca de 8 KB cada, **estimativa a medir com as 3 primeiras folhas**, cerca de 2,9 MB no total e só o capítulo atual é baixado (cerca de 100 KB por capítulo). Flow a 0 crédito. Regra do DESIGN: sem texto dentro da imagem.
- **Pronto quando.** (a) 30 folhas aprovadas na ficha da `BIBLIA-DE-PERSONAGENS.md` (luz, recorte, sem texto); (b) o capítulo abre sem objetos e os baixa em segundo plano, sem travar; (c) peso real medido e registrado no `assets/manifesto.json`.
- **Risco ético.** Nenhum. Licença comercial das imagens do Flow continua pendente de confirmação (README da Fase 3).
- **Mexe em `src/`.** Sim, pouco: `arte.js`, `ativos.py` (já lê o manifesto).

### Mudança 15 · Tipos novos de pergunta, onda 2
- **O que muda.** Construir número com blocos (centena, dezena, unidade), ditado (ouve e monta com letras, mostra o erro exato), reta numérica, barra-modelo, par mínimo (ship e sheep) e leitura ecoada. Seção 9.
- **Tela.** Pergunta.
- **Ativo.** Texto, áudio Kokoro dos pares mínimos e das leituras, blocos de base 10 em SVG ou Flow (3 imagens).
- **Pronto quando.** (a) 6 tipos no ar com os mesmos 6 requisitos da mudança 8; (b) interativas chegam a 25% na matemática e a 40% no português.
- **Risco ético.** Nenhum específico.
- **Mexe em `src/`.** Sim, grande.

### Tabela de prioridade

| # | Mudança | Impacto (1 a 5) | Esforço | Imagem nova | Onda |
|---|---|---|---|---|---|
| 1 | Pergunta na cena, dita pelo guia | 5 | M | não | 1 |
| 2 | Design de som sintetizado | 5 | M | não | 1 |
| 3 | Falas e reações com humor | 5 | M | não | 1 |
| 4 | Game feel | 4 | P | não | 1 |
| 5 | Sem falha e acabamento | 3 | P | não | 1 |
| 6 | Cerimônias | 4 | M | não | 2 |
| 7 | Embaralho e as três estrelas | 5 | M | 10 | 2 |
| 8 | Tipos novos, onda 1 | 5 | G | 40 figuras | 2 |
| 9 | Mapa vivo | 4 | M | 3 | 2 |
| 10 | Trilha por planeta | 4 | M | não | 2 |
| 11 | Desafio da Brisa | 4 | M | 1 | 3 |
| 12 | Personalização | 4 | M | 21 | 3 |
| 13 | Álbum de figurinhas | 3 | M | (kits) | 3 |
| 14 | Arte de contexto (kits) | 4 | G | 360 | 3 |
| 15 | Tipos novos, onda 2 | 4 | G | 3 | 3 |

---

## 6. (a) Design de som completo

### 6.1 Princípios
1. **Som de acerto sobe e som de erro é mais baixo e mais curto.** Assimetria de 6 dB. O erro nunca é buzina, nunca é grave, nunca é sombrio.
2. **Cada som tem um timbre da família do planeta.** Numeral: sinos e madeira, um toque de metal. Fábula: caixa de música e flauta. Horizonte: pluck de violão e gotas.
3. **Voz manda.** Quando uma fala toca, efeitos e música caem 10 dB e voltam em 400 ms.
4. **Tudo sintetizado agora, com opção de amostra CC0 depois.** Zero arquivo de efeito no pacote inicial.
5. **Três interruptores:** Efeitos, Música e Voz, cada um lembra o seu estado. O alto-falante do topo continua e abre a tela com os três.

### 6.2 Lista dos efeitos (receitas de partida; afinar de ouvido com a filha)

Frequências em hertz: C5 523, D5 587, E5 659, G5 784, A5 880, C6 1047.

| # | Som | Quando | Receita (ponto de partida) | Duração | Nível de pico |
|---|---|---|---|---|---|
| 1 | Toque em botão | Todo botão | Estalo de madeira: ruído filtrado em 1,2 kHz de 12 ms + seno em 330 Hz | 60 ms | -14 dBFS |
| 2 | Selecionar alternativa | Toque na opção | "Tique" seno 1,2 kHz com queda de 40 ms | 40 ms | -14 dBFS |
| 3 | Verificar | Botão principal | Pop curto: seno 520 Hz subindo para 700 Hz em 50 ms | 90 ms | -12 dBFS |
| 4 | Acerto | Resposta certa | Dois sinos: G5 e depois C6 (seno + 2º harmônico a 30%), ataque 10 ms, queda 350 ms, mais um brilho de ruído agudo | 450 ms | -6 dBFS |
| 5 | Acerto em sequência | 2ª, 3ª, 4ª, 5ª, 6ª seguida | O mesmo acerto subindo a escala pentatônica: C5, D5, E5, G5, A5, C6; a partir da 6ª fica em C6 com oitava brilhando | 450 a 600 ms | -6 dBFS |
| 6 | Erro gentil | Resposta errada | "Toc" de madeira (triângulo com filtro passa-baixa em 1,2 kHz) caindo um tom de G4 para F4, sem nada abaixo de 250 Hz; reinicia a escala do acerto sem som extra | 180 ms | -12 dBFS |
| 7 | Dica aberta | Lâmpada | Duas notas subindo (E5, A5) em celesta | 250 ms | -12 dBFS |
| 8 | Moeda | Moeda voando ao contador | Dois pings agudos (B5, E6) com 60 ms de intervalo | 200 ms | -10 dBFS |
| 9 | Fase concluída | Fim de fase | Arpejo C5, E5, G5, C6 a cada 110 ms, finalizando em acorde | 900 ms | -6 dBFS |
| 10 | Estrela ganha | 1ª, 2ª e 3ª estrela | "Ding" de sino em G5, B5 e D6, a 0,35 s, 0,65 s e 0,95 s | 3 x 300 ms | -8 dBFS |
| 11 | Peça do cenário acende | Cada fase ou a revisão | Varredura de ruído passa-banda subindo de 500 a 2.500 Hz em 480 ms + acorde suave de pad | 700 ms | -10 dBFS |
| 12 | Etapa concluída | Fim de etapa | Pad C maior em 1,2 s + melodia de 6 notas do motivo do planeta + brilho | 3 s | -6 dBFS |
| 13 | Planeta concluído | Etapa 10 | Motivo do Bobby (G4, C5, E5, G5) em orquestra de sinos, estrela voltando ao céu com varredura ascendente de 1,5 s | 6 s | -6 dBFS |
| 14 | Passos do Bobby | Andar entre nós | Dois passos por nó, alternando 110 Hz e 100 Hz (esquerdo e direito, ±8%). Superfície por planeta: grama (ruído passa-baixa em 1,2 kHz), madeira (passa-banda em 800 Hz + estalo), areia (ruído com passa-alta, mais crocante) | 2 x 70 ms | -16 dBFS |
| 15 | Abrir folha | Baú, perfil, folhas | Varredura de ruído de 300 a 900 Hz subindo | 220 ms | -14 dBFS |
| 16 | Fechar folha | Idem | Mesma varredura descendo, 60% do tempo | 130 ms | -14 dBFS |
| 17 | Trocar de aba | Barra inferior | Tique grave suave, 180 Hz mais 900 Hz | 70 ms | -14 dBFS |
| 18 | Baú, etapa 1: rangido | Tocar no baú | Ruído passa-banda de 400 a 900 Hz com vibrato lento | 350 ms | -10 dBFS |
| 19 | Baú, etapa 2: tampa | Abrir | Estalo de madeira + puff de ruído | 120 ms | -8 dBFS |
| 20 | Baú, etapa 3: moedas | Sair os prêmios | 10 a 14 pings de seno em 2 a 4 kHz, intervalo de 30 a 60 ms, posição estéreo aleatória | 700 ms | -10 dBFS |
| 21 | Baú, etapa 4: revelação | Item novo | Acorde de sinos em C maior subindo | 800 ms | -6 dBFS |
| 22 | Cadeado | Toque em item travado | Estalo surdo curto, sem tom | 90 ms | -16 dBFS |
| 23 | Desbloquear | Item novo disponível | Clique de chave + dois sinos | 350 ms | -8 dBFS |
| 24 | Congelador usado | Ofensiva protegida | Cristal: brilho de ruído agudo + C6 | 500 ms | -10 dBFS |
| 25 | Missão cumprida | Cada missão | Dois sinos G5 e B5 | 300 ms | -8 dBFS |
| 26 | Pegar e encaixar | Arrastar (mudança 8) | Pegar: tique agudo; encaixar: "tum" de madeira com sino; soltar fora: sopro curto | 60 a 150 ms | -14 dBFS |
| 27 | Conquista (toast) | Medalha | Sino duplo + varredura curta | 600 ms | -8 dBFS |
| 28 | Por hoje chega | Tela de parada | Três notas de caixa de música em descida suave (E5, C5, G4) | 1,5 s | -12 dBFS |

**Motivos dos personagens** (cada um, 2 a 4 notas, usados em entrada e em fala): Bobby, quatro notas subindo G4, C5, E5, G5 em sino. Teo, três bipes quadrados curtos em arpejo (robô alegre). Rufa, flauta com glissando e vibrato leve. Otto, "bloop" de água (seno com curva de afinação descendente). Brisa, sopro com assobio que sobe. Capi, dois toques graves e macios de pulso lento. Fagulha, três cintilações agudas e rápidas. Embaralho, "farfalhar" de cartas em ruído e kazoo (serra com filtro e vibrato).

**Ambiente por planeta** (camada de fundo muito baixa, -34 dBFS): Numeral, tique esparso de engrenagens e zumbido de oficina. Fábula, estalidos de lareira (ruído com picos) e vento. Horizonte, ondas (ruído passa-baixa com oscilador lento de 0,1 Hz) e uma gaivota a cada cerca de 40 s.

**Implementação.** Mini sintetizador de ~3 a 4 KB (osciladores, envelope, filtro, ruído, compressor mestre) a partir da `nota()` que já existe. A biblioteca ZzFX (MIT, cerca de 1 KB comprimida, **ABERTO** na página do projeto; o texto da licença não veio no que li) serve de referência para guardar cada som como uma lista curta de números. Não é obrigatório usar.

### 6.3 Trilha musical por planeta: opções reais com licença

**O que abri e confirmei:**

| Opção | Licença (onde li) | Tamanho e conteúdo | Serve? |
|---|---|---|---|
| **A. Gerada no navegador (recomendada primeiro)** | Código nosso, sem terceiros | 0 KB de dados; agendador Web Audio + padrões por planeta | Sim. Risco de licença zero. Risco de soar "de bipe": mitigar com timbre de pluck (Karplus-Strong) e pad |
| Kenney, pacotes de áudio | CC0 (**ABERTO**: página de suporte diz que os ativos são de domínio público e usáveis em projeto comercial; páginas dos pacotes mostram CC0) | Interface Sounds 100 arquivos; UI Audio 50; Digital Audio 60; Impact Sounds 130; RPG Audio 50 (tag passos e foley); **Music Jingles 85** (vinhetas curtas de 2014) | Sim para efeitos e vinhetas. O conteúdo dos zips não foi aberto: conferir o `License.txt` de cada zip no download |
| OpenGameArt, "JRPG Pack 4 Calm" (SubspaceAudio, zip assina Juhani Junkala) | CC0 (**ABERTO**: a linha "License(s): CC0") | 6 faixas calmas, zip de 13,3 MB; loops não declarados na página | Candidata para o mapa. **Não ouvi.** Transcodificar 3 faixas para AAC mono 48 kbps |
| OpenGameArt, coleção "CC0 Calm / Relaxing Music" | A página da coleção afirma CC0; **a licença de cada faixa precisa ser conferida na página da faixa** | 109 faixas (incluem JRPG Pack 2 Towns, Medieval: The Bard's Tale, Town 3) | Fonte de busca. Nada entra sem a página aberta |
| OpenGameArt, "Indie Meditations" e "Contemplative Fantasy Vol. 2" (YannZ) | **CC-BY 4.0** (obriga crédito) | Boas, mas pedem tela de créditos | Só com tela de créditos aprovada |
| Freesound | Por som: CC0 livre; **CC-BY** exige crédito; **CC-BY-NC proibido** (o app pode ser vendido) (**ABERTO**) | Milhares | Só CC0 |
| ZzFX e ZzFXM | MIT (**ABERTO**; texto da licença não veio) | ZzFX menor que 1 KB; ZzFXM toca música em formato de pattern | Referência para a opção A |
| ACE-Step (modelo de geração local) | Código Apache 2.0 e a página do modelo lista Apache 2.0 (**ABERTO**); nada diz sobre dados de treino nem uso comercial da saída | Roda no Mac; o próprio projeto cita 26 s por minuto de áudio em M2 Max | **Não recomendado sem parecer**: o material de treino não está declarado |
| MusicGen (Meta) | Código MIT, **pesos CC-BY-NC 4.0** (**ABERTO**) | Local | **Não.** NC |
| Stable Audio Open | "Stability AI Community License", condições comerciais na página deles, não li; treinado em Freesound e FMA (CC0, CC-BY, Sampling+) (**ABERTO**) | Até 47 s | **Não** até ler a licença de uso comercial |
| Pixabay Content License | Licença própria, **não é CC0**; veda venda ou distribuição do arquivo "isolado"; página sem data (**ABERTO**) | Muito material | Evitar: a regra de "arquivo isolado" gera dúvida dentro de um app |
| SoundFonts (GeneralUser GS e outros) para renderizar MIDI | **NÃO consegui achar a licença**; a página do repositório não diz | 261 instrumentos | Não usar |

**Como fica (recomendação):**
- Agora: opção A, nos 3 planetas e no menu. Parâmetros:
  - **Numeral:** dó maior pentatônica, 84 bpm, marimba e sino em arpejos curtos sobre pad; clima "curioso e organizado".
  - **Fábula:** ré dórico, 72 bpm, caixa de música e flauta lenta sobre pad quente; clima "hora da história".
  - **Horizonte:** sol mixolídio, 96 bpm, pluck de violão (Karplus-Strong) com pulso leve de percussão de ruído e gotas; clima "viagem".
  - **Menu e planetas:** motivo do Bobby (G4, C5, E5, G5) em sinos com pad curto; **12 s** e não repete em loop.
  - Loop de 8 compassos, a emenda fecha em silêncio de 300 ms.
- Depois (opcional, decisão do Filipe D4): ouvir 3 faixas CC0 (JRPG Calm) e comparar com a opção A; se ganhar, entram como carga tardia.
- Em cada pergunta a música cai para o ambiente; na fala, cai 10 dB; em "Por hoje chega", só a caixa de música do som 28 e silêncio.

**Registro de licença (obrigatório antes de qualquer arquivo entrar).** `docs/CREDITOS-AUDIO.md` com: nome do arquivo, URL da página, autor, linha exata da licença, data de acesso, SHA-256 do arquivo, e cópia da página salva em `audio/licencas/`. Para CC0 não há crédito obrigatório; registrar assim mesmo. Para CC-BY, tela de créditos antes de publicar.

**Peso.** Efeitos 0 KB; trilha A 0 KB; trilha B cerca de 1 MB tardio (estimativa); falas cerca de 2 MB tardias; total tardio de áudio novo menor que 3,5 MB. O que o app já tem de voz gravada (35 a 42 MB) continua por pacote.

---

## 7. (b) e (c) Personalidade, falas e narrativa

Texto escrito com `microcopy-de-interface` e `copy-pt-br`. Regras da casa: "você", frase curta (até 15 palavras para áudio), sem travessão, sem "tu", sem tristeza nem culpa, sem a figura de negar uma coisa para afirmar outra. **Veredito do `copy-check` do banco de falas: PASSOU, PROIBIDOS 0, ritmo 0,60** (arquivo `scratchpad/identidade/falas.txt`, 576 palavras, 137 frases).

### 7.1 Quem fala e como

| Personagem | Onde fala | Tom e humor | Marca de fala |
|---|---|---|---|
| **Bobby** | Em tudo, no papel de colega | Caloroso, curioso, atrapalhado, humor de explorador (mochila, lanche) | "Mochila" e "exploração" |
| **Teo** | Perguntas de Matemática | Exato e curto; ri dos próprios erros de brincadeira | "Padrão encontrado" |
| **Rufa** | Perguntas de Português | Narradora de conto, um pouco dramática | "Era uma vez" |
| **Otto** | Perguntas de Inglês | Alegre; repete a palavra duas vezes, devagar; mistura inglês | "Great! Great job!" |
| **Brisa** | Desafio de fim de etapa | Travessa, duvida de brincadeira, perde com graça | "Duvido." |
| **Capi** | Depois de um "ainda não", no "Por hoje chega" | Lenta e calma; respira com a criança | "Sem pressa." |
| **Fagulha** | Bilhete e volta ao app | Tímida; fala baixinho | "Psiu." |
| **Embaralho** | Etapas 6 a 10 de cada planeta | Travesso; pede desculpa rindo | "Ops." |

### 7.2 Banco de falas por situação (usar o sorteio sem repetir as últimas 4)

**Chegada ao app (Bobby; escolher pela hora do aparelho)**
- Manhã: "Bom dia, explorador! Hoje o céu está limpo e a mochila está cheia."
- Tarde: "Boa tarde! Trouxe lanche, lupa e muita curiosidade. E você?"
- Noite: "Boa noite! Uma missão pequena e depois a gente descansa."
- Volta: "Que bom ver você de novo! Vamos ver o que mudou no planeta?"
- Mapa: "Cadê meu mapa? Ah, está na mochila. Sempre está."
- Planetas: "Escolha um planeta. Cada um tem um amigo esperando por você, com uma história para contar."
- Embaralho por perto: "O Embaralho passou por aqui de novo. Vamos arrumar a bagunça!"

**Acerto simples (guia da matéria ou Bobby)**
- "Uau!" · "Boa! Mandou bem." · "Certinho! Pode me chamar de ajudante de ouro." · "Perfeito! Até a mochila ficou orgulhosa." · "Oba!" · "Aí sim."
- Teo: "Calculei, conferi e confirmei: você acertou." · "Padrão encontrado! Eu adoro quando os números combinam." · "Número bonito! Três e quatro, sete. Ótima conta."
- Rufa: "Era uma vez uma resposta certa, e ela era sua." · "Que final feliz! Merece até um ponto final." · "Essa palavra ficou linda no papel. Quer ler de novo?"
- Otto: "Great! Great job! Isso mesmo." · "Say it with me: hello, hello! Agora você."

**Sequência e memória**
- 3 seguidas: "Três seguidas! A mochila está chacoalhando de alegria."
- 5 seguidas: "Cinco seguidas! Você está voando mais que a Brisa."
- Primeira de primeira: "Acertou de primeira. Eu nem tinha terminado de torcer."
- Recuperou: "Agora sim! Tentar de novo funciona."
- Difícil resolvida: "Esse foi difícil e você resolveu. Isso conta em dobro."
- Rápida: "Eita, você é rápido! Eu pisquei e a resposta já estava lá."

**Erro ("ainda não": sempre calmo, nunca comemora o erro; trocar o "Quase!" por estas)**
- Bobby: "Ainda não. A resposta certa é essa, e a pergunta volta mais tarde." · "Errar faz parte da exploração. Todo mapa tem uma curva." · "Essa era das difíceis mesmo. Vamos olhar juntos."
- Capi (depois de 2 erros seguidos): "Respira fundo. A gente tenta de novo, sem pressa." · "Uma resposta errada ajuda o cérebro a crescer. Pode ficar tranquilo."
- Otto: "Nice try! Vamos ouvir de novo, bem devagar." · "Repita comigo, devagar. Quanto mais devagar, melhor o som."
- Teo: "Epa, esse cálculo travou. Vamos reiniciar o raciocínio juntos."
- Teo (humor): "Eu errei de propósito só para testar você. Quase funcionou."

**Dica e ajuda (sem culpa e sem custo)**
- "Quer uma dica? Dica não gasta nada." · "Pedir ajuda é coisa de explorador esperto." · "Uma pergunta por vez. A gente chega lá."

**Meio e fim**
- Meio da fase: "Pronto. Agora vamos conferir o que a gente aprendeu nessa trilha." · "Ufa, que subida! Mas a vista lá de cima vale cada passo."
- Última pergunta: "Falta pouco. Só mais uma, e depois a gente confere a mochila inteira."
- Fase completa: "Fase completa! Minha mochila quer dançar."
- Fase perfeita: "Fase perfeita! Isso merece abraço de urso."
- Etapa completa: "Etapa completa! Olha o lugar acendendo."
- Estrela do céu: "Uma estrela voltou para o céu. Falta pouco para a constelação."

**Rotina**
- Baú pronto: "Seu baú do dia está pronto. Quer abrir?" · Baú aberto: "Que baú bonito! Tem uma coisa nova lá dentro."
- Parada: "Por hoje chega. Você fez um ótimo trabalho, e amanhã tem mais." · "Descansar também faz parte da aventura." · "Hoje foi bastante."
- Congelador: "Um congelador cuidou da sua sequência. Ela continua firme."
- Ofensiva descansando: "Sua sequência estava descansando. Hoje ela volta com tudo."
- Fagulha: "Psiu! Tem um bilhete para você." · "Entreguei! Era para você mesmo."

**Brisa (desafio de fim de etapa)**
- "Duvido que você consiga. Ah, conseguiu!" · "Mais uma rodada? Eu não perco com graça, perco com estilo."

**Toque no Bobby e no cenário (humor, uma por toque)**
- "Cócegas na orelha! Hahaha. Para, para, para." · "Pode me chamar do jeito que quiser. Eu respondo a qualquer apelido que venha com lanche." · "Olha, um passarinho! Sumiu. Mas eu juro que ele estava ali." · "Hmm. Interessante. Muito interessante. Nenhuma ideia, mas interessante." · "Ops."

**Embaralho**
- "Hihi, troquei tudo de lugar! Ops. Desculpa." · "Você me achou! Eu não sei perder esconde-esconde."

**Ocioso (depois de 20 s sem toque)**
- "Sem pressa. Pensar também é jogar." (única frase de ocioso; nunca cobra, nunca repete em menos de 5 min)

### 7.3 Narrativa em arco: uma frase por etapa

**Fio geral.** O céu do Bobby perdeu três estrelas-guia (cobalto, violeta, turquesa) quando o Embaralho, um cometinha que adora trocar as coisas de lugar, passou voando. Cada planeta devolve a sua estrela. Ao devolver as três, a **constelação da criança** acende no céu com o nome que ela escolheu. O Embaralho nunca é mau: no fim, pede para entrar na festa.

**Capítulos que se abrem.** A etapa N+1 aparece com uma "abertura" (2 frases, áudio, botão Pular) assim que a etapa N termina. Os 10 capítulos de cada planeta já existem em `CAPITULOS`, `CAPITULOS_PT` e `CAPITULOS_EN`; a frase abaixo acrescenta o fio, sem apagar a premissa atual.

**Planeta Numeral (Teo): a Estrela Cobalto**
1. A horta: "Os saquinhos de sementes estão com a contagem trocada. Teo encontra um rastro de poeira brilhante."
2. A praia: "As conchas apareceram em pilhas erradas. O rastro de poeira continua pela areia."
3. A caravana: "A caravana saiu com caixas demais, ou de menos. Alguém bagunçou a carga durante a noite."
4. O piquenique: "Ninguém sabe repartir os lanches. Uma risadinha vem de trás de um tronco."
5. A pizzaria: "As fatias sumiram da bandeja. Teo vê a cauda de um cometa passar voando."
6. A feira: "As etiquetas de preço trocaram de lugar. O Embaralho aparece rindo, em cima da barraca."
7. A loja: "Ele diz que só queria brincar, mas levou um pedaço da Estrela Cobalto."
8. O parquinho: "Para alcançar o Embaralho, o Bobby precisa construir um parquinho com as medidas certas."
9. A oficina: "O foguete está quase pronto. Falta o número escondido que faz ele decolar."
10. A festa: "O Embaralho devolve a Estrela Cobalto e pede para ir à festa. O castelo inteiro aplaude."

**Planeta Fábula (Rufa): a Estrela Violeta**
1. A caixa de letras: "As letras da caixa estão fora de ordem. Rufa suspeita de um visitante bagunceiro."
2. O trem: "O trem só anda se os vagões estiverem na ordem. Alguém trocou todos de lugar."
3. A feira das palavras: "Os cartazes estão embaralhados. Rufa acha um brilho de poeira estelar no chão."
4. A oficina dos sons: "Na oficina os sons saem trocados. Isso tem cheiro de Embaralho."
5. O correio: "As cartas chegam sem ponto final e viram frases sem fim. Uma risadinha sai de um envelope."
6. O mercado: "O Embaralho aparece de verdade, com cauda de letras. Pega a Estrela Violeta e foge."
7. O teatro: "A estrela está escondida no palco. Para entrar, o Bobby vai atuar numa peça."
8. A gráfica: "As palavras saem com letras trocadas. Dá para ler o recado dele se você acertar tudo."
9. O jardim dos acentos: "O recado diz: quero brincar, não brigar. Rufa sorri e o jardim fica em silêncio."
10. A biblioteca: "O Embaralho devolve a Estrela Violeta e pede para ouvir uma história. Rufa lê para ele."

**Planeta Horizonte (Otto): a Estrela Turquesa**
1. Chegando: "O Bobby chega à cidade e as placas estão em inglês trocado. Otto dá as boas-vindas."
2. A escola nova: "As cores dos arcos estão trocadas. Otto jura que ontem eram outras."
3. A família que recebe: "Um bilhete chegou com metade das palavras faltando. Otto fica curioso."
4. O zoológico: "As placas dos bichos trocaram de lugar. O macaco parece rir de alguma coisa."
5. O restaurante: "O cardápio chegou embaralhado e o garçom não entende o pedido. Otto traduz com paciência."
6. A loja de roupas: "Uma sombra brilhante passa pelo provador. O Embaralho vestiu o manequim ao contrário."
7. Lar doce lar: "A casa tem uma chave que abre a porta errada. Cada cômodo guarda uma pista."
8. Um dia na cidade: "O Bobby segue o rastro de poeira pela cidade inteira e vê a Estrela Turquesa na ponte."
9. Fazendo amigos: "O Embaralho aparece e faz perguntas em inglês. Se o Bobby responder bem, ele conta onde está a estrela."
10. Falando como um local: "O Embaralho devolve a Estrela Turquesa. As três estrelas voltam e a constelação acende."

**Cena final (as 3 estrelas devolvidas):** "A constelação da [nome da criança] acendeu. O céu inteiro agora tem o seu nome." (Bobby, Embaralho e os três guias aparecem juntos, 20 s, pode pular.)

### 7.4 Lista de verificação ética de falas (rodar em todo lote)
1. Nenhuma frase pede à criança para continuar, voltar ou "não me deixar".
2. Nenhuma frase diz que o personagem sentiu falta, ficou triste, decepcionado ou sozinho.
3. Nenhuma frase compara a criança com outra ou com um recorde que ela não ajudou a criar.
4. Elogia o esforço ou o caminho, nunca "você é inteligente" (OPINIÃO apoiada em pesquisa de mentalidade; **não abri a fonte**).
5. Exclamação só em acerto e recompensa (regra do DESIGN).
6. Até 15 palavras, `copy-check` sem proibidos.

---

## 8. (e) Cerimônia de fim de fase, de etapa e de conquista

**Princípio.** O fim pesa na lembrança (peak-end, NN/g 2018, **ABERTO**), por isso o capricho vai para os últimos 3 segundos da fase e para a etapa, e não para a pergunta. Toda cerimônia: recompensa fixa e conhecida, pulável em um toque depois de 1 s, igual com som desligado, sem contagem regressiva.

### Fase concluída (até 3 s)
| Tempo | O que acontece | Som |
|---|---|---|
| 0,0 s | O painel de feedback da última pergunta se recolhe; o Bobby entra com `p02` (comemora) | som 9, arpejo |
| 0,4 s | Estrelas acendem uma a uma | som 10, três "dings" |
| 1,2 s | Frase do guia da matéria (uma fala do banco "fase completa" ou "perfeita"), com áudio | voz |
| 2,0 s | Linha única: "8 de 8 perguntas, 90 moedas" (sem os três cartões atuais) | nenhum |
| 3,0 s | Botão "Voltar para o mapa" e, se aplicável, "Ver a peça que acendeu" com o mesmo peso visual | nenhum |

### Etapa concluída (até 8 s, a cada 5 fases)
| Tempo | O que acontece | Som |
|---|---|---|
| 0,0 s | A cena (`cen-*-completo`) ocupa a tela; a última peça acende por máscara em 480 ms | som 11 |
| 1,2 s | Bobby (`p02`) e o guia do planeta (`p02`) entram pelos lados | motivos do Bobby e do guia |
| 2,0 s | O troféu (`rec-trofeu`) surge; contam-se as estrelas da etapa | som 10 |
| 3,5 s | Título "Etapa completa" e a frase da narrativa (seção 7.3), com áudio | som 12, voz |
| 5,0 s | "Você ganhou um desenho: A horta do Bobby": a miniatura voa até o ícone Desenhos | tique + sino |
| 6,5 s | Dois botões de peso igual: "Ver o desenho" e "Continuar" | nenhum |

### Planeta concluído (até 20 s, uma vez por planeta)
Todas as luzes da cena acendem em sequência, a estrela do planeta volta para o céu (som 13), o Embaralho aparece e pede para ir à festa, e aparece o botão "Ver a constelação". Se as três estrelas já voltaram, a constelação acende com o nome da criança. Fim com Capi dizendo "Descansar também faz parte da aventura" e um único botão "Voltar ao mapa".

### Conquista (medalha)
Faixa no topo por 2,5 s, com a medalha 3D (`rec-medalha`), som 27, sem bloquear o toque. Nada de tela cheia por conquista pequena.

**O que nunca entra:** "abra para ver o que veio", sorteio, brilho em loop, número que rola, botão enorme de continuar jogando contra um link apagado de parar.

---

## 9. (d) Tipos novos de pergunta

A especificação (`docs/FASE-2-especificacao.md`, seção 1.6) já prevê 16 tipos. Hoje: matemática 2,8% interativa, português 19%, inglês 10% (medidas da spec, sem script salvo, a refazer antes de virar meta). Regra do DESIGN: arrastar nunca é o único caminho; sempre há "toque e depois toque o destino" e o teclado.

### Onda 1 (mudança 8)
| Tipo (id da spec) | Matéria | Exemplo | Como se joga | Alternativa sem arrastar | Som | Arte |
|---|---|---|---|---|---|---|
| **Ligar pares** (T4) | MAT, PT, EN | `1/2` com `0,5`; sílaba `BA` com `BA-NA-NA`; `dog` com o cachorro | Toca um cartão e o par; linha acende | Toque, toque | 26 (pegar, encaixar), 4 no par certo | Números e sílabas sem arte; palavras de inglês com 40 figuras (4 folhas) |
| **Arrastar para grupos** (T1) | MAT | "Reparta 12 maçãs em 3 cestas iguais" | Arrasta as maçãs; cada cesta mostra o total | Toca a maçã e depois a cesta | 26, 4 | Objetos do capítulo (kits da mudança 14); antes disso, fichas |
| **Ordenar** (T3) | MAT, PT, EN | `0,5 · 0,25 · 0,75` do menor para o maior; palavras de uma frase | Arrasta cartas na ordem | Toca na carta, depois no lugar vazio | 26 | Nenhuma |
| **Ouvir e tocar a figura** (T14) | EN | Ouve "cat" e toca a figura certa entre 4 | Toque | Toque | 4, voz do Otto | 40 figuras; depois 120 |

### Onda 2 (mudança 15)
| Tipo | Matéria | Exemplo | Nota |
|---|---|---|---|
| **Construir número** (blocos) | MAT | "Monte 247" com 2 centenas, 4 dezenas e 7 unidades | Botões de mais e de menos por coluna; Teo comenta cada coluna |
| **Ditado de montar** (T11) | PT, EN | Ouve "banana" e monta com as letras | Mostra a letra que difere e a regra da aula; o tipo `texto` já existe e vira base |
| **Reta numérica** (T2) | MAT | Marca onde fica o 3/4 | Toque na reta, ajuste fino por botões |
| **Barra-modelo** (T5) | MAT | Problema de texto em segmentos | A de maior esforço |
| **Par mínimo** (T16) | EN | Ouve "ship" ou "sheep" | Áudio Kokoro dos pares |
| **Leitura ecoada** (T13) | PT, EN | Narrador lê, criança toca a próxima palavra | Reaproveita as histórias de capítulo |

**Critério comum.** Cada tipo entra com dica nos dois degraus, `porque` por erro comum, rótulo de acessibilidade, atalho de teclado e uma rodada de teste sem áudio. O teste por toque real usa o CDP, como o `testes/fumaca.js` já faz.

---

## 10. (f) Mapa vivo

Tudo abaixo respeita o limite de 2 animações simultâneas além da celebração e `prefers-reduced-motion`.

| Elemento | O que faz | Como se faz | Peso |
|---|---|---|---|
| **Guia do planeta andando** | Teo, Rufa ou Otto caminha atrás do Bobby e para quando ele para | 3 poses "caminha" no Flow, 0 crédito; movimento por `transform` | cerca de 40 KB, tardio |
| **Clima por planeta** | Numeral: faíscas e engrenagens do anel. Fábula: vagalumes e lanternas lentas. Horizonte: ondas e uma gaivota a cada 40 s | Partículas em CSS, no máximo 12 elementos | 0 KB de imagem |
| **Hora do dia** | Amanhecer 5 h a 8 h, dia 8 h a 17 h, entardecer 17 h a 19 h, noite 19 h a 5 h; muda a luz por camada e filtro, com janelas mais quentes à noite | Gradiente e `filter` sobre a mesma imagem; nada de trocar arquivo | 0 KB |
| **Tempo de cada visita** | Sol, nuvem ou chuva leve, sorteado por dia (sempre igual no mesmo dia, nada se perde) | Semente por data local | 0 KB |
| **Bobby em repouso** | A cada 6 a 10 s troca entre as poses 1, 3 e 4 com fusão de 300 ms; piscar por troca de expressão | Já existem 12 poses e 8 expressões | 0 KB |
| **Toque no cenário** | 3 pontos por etapa; cada um gera uma frase e uma figurinha achada, uma vez | Áreas de toque sobre a cena; liga com a mudança 13 | 0 KB |
| **Dia da semana** | No sábado, balões no planeta (frase do bilhete "Sábado de aventura"); sem data limite e sem perda | Camada extra | 0 KB |

Regra: nada some, nada exige voltar a tempo. A noite não vira aviso de "vá dormir"; só uma fala de "boa noite" uma vez por dia.

---

## 11. (g) Cenas dentro das perguntas (arte de contexto)

**Três camadas, da mais barata para a mais cara.**
1. **Fundo da etapa** (sem arte nova): `cen-*-completo` recortado, escurecido e desfocado atrás da pergunta (mudança 1). Já dá a sensação de estar no lugar.
2. **Guia com balão** (sem arte nova): quem faz a pergunta está lá, na pose certa.
3. **Kit de objetos do capítulo** (mudança 14): objetos reais na pergunta de contar, arrastar e ligar. A criança vê 13 figurinhas de verdade, não um número num cartão.

**Fluxo de produção no Flow (0 crédito, sem pagar).** Uma folha de 12 objetos soltos por capítulo, com o bloco de estilo do `CENARIOS-E-DESENHOS.md`, mesma luz do cenário, fundo liso, sem texto. Recorte com `arte/recortar.py`, conversão com `build/ativos.py`. Aprovação pela ficha da `BIBLIA-DE-PERSONAGENS.md` (luz, recorte, sem texto). **Lote piloto de 3 folhas antes do resto**, para medir peso e tentativas.

---

## 12. (h) Personalização que importa

| Escolha | O que muda de fato | Como | Revisão `lgpd-gate` |
|---|---|---|---|
| **Nome do céu** | Aparece na constelação final e no topo do perfil | Texto de até 24 caracteres, só no aparelho | Apelido, sem dado novo |
| **Cor** | Rastro do Bobby, halo da estrela, borda do balão do jogador | A cor do perfil que já existe | Nenhuma |
| **Quem pergunta** | O guia escolhido faz as perguntas em qualquer matéria | Preferência guardada | Nenhuma |
| **Looks em 4 poses** | O look aparece no mapa, na comemoração e no desenho do perfil | 21 imagens extras no Flow | Nenhuma |
| **Acampamento** | Mural com desenhos coloridos e figurinhas | Reaproveita galeria e álbum | Nenhuma |

Princípio (Cordova e Lepper 1996, **RESUMO**): personalizar só vale quando a escolha aparece no jogo. Por isso nada de escolha que some depois.

---

## 13. Custo de arquivo e carga

| Item | Hoje | Depois do plano | Onde entra |
|---|---|---|---|
| `index.html` | 677 KB brutos, 208 KB comprimidos (medido com `gzip -c`) | +60 KB brutos estimados (módulos de som, falas, cerimônia, tipos) | Pacote inicial |
| Arte inicial | 2,29 MB (`assets/manifesto.json`, `inicial_bytes` 2.287.818) | sem aumento | Pacote inicial |
| **Total inicial** | **cerca de 2,96 MB** (índice + arte inicial; o README diz 2,9 MB) | **abaixo de 3,0 MB por regra** | Teto do Filipe |
| Efeitos e trilha A | 0 | 0 KB de dados | Código |
| Falas gravadas | 0 | cerca de 2 MB, tardio | Cache `bobby-audio-v1` |
| Trilha B (opcional) | 0 | cerca de 1 MB, tardio | Idem |
| Arte da Onda 2 | 0 | cerca de 0,6 MB (10 + 3 + 40 imagens), tardio | Cache `bobby-arte-v1` |
| Arte da Onda 3 | 0 | cerca de 4 MB (21 looks, 360 objetos, 3 figuras), tardio | Idem |

**Regras para não estourar:** (1) nada de imagem ou áudio novo no pacote inicial; (2) o teste `testes/ativos.js` passa a falhar se o inicial passar de 3,0 MB; (3) como a margem é de menos de 100 KB, **minificar o JavaScript e o CSS do `index.html` na build** (hoje não há minificador no `build/`, medido por `grep`); o ganho **não foi medido**, medir antes de contar com ele; (4) se a minificação não bastar, tirar do pacote inicial as poses do Bobby menos usadas (hoje todas as 41 imagens entram para o offline) e manter só as 8 expressões e as 4 poses mais usadas.

---

## 14. Plano em 3 ondas (uma semana de trabalho de agente cada)

**Regra de cada onda.** Termina com: fumaça completa em desktop e celular, console limpo, capturas novas, `revisor-de-entrega` com nota 8 ou mais, e o teste de identidade da seção 15. Nada é publicado sem ok do Filipe.

### Onda 1 · "A pergunta ganha vida" (mudanças 1 a 5)
- Dia 1 a 2: mudança 1 (pergunta na cena, guia com balão, lembrete fechado, 4 alternativas visíveis).
- Dia 2 a 3: mudança 2 (sfx.js, 28 sons, três interruptores) e mudança 4 (game feel).
- Dia 3 a 4: mudança 3 (falas, `falas.js`, lote de áudio Kokoro local).
- Dia 5: mudança 5 (sem estado de falha, layout de computador, Looks, fim de fase) e fechamento da onda.
- Não depende de nenhuma imagem nova. Entrega a maior parte do salto de 5 para 7.

### Onda 2 · "Mundo e história" (mudanças 6 a 10)
- Dia 1: Flow para o Embaralho (10 imagens) e 3 poses "caminha" dos guias; lote piloto de 3 folhas de objetos.
- Dia 2 a 3: mudança 7 (narrativa) e mudança 6 (cerimônias).
- Dia 3 a 5: mudança 8 (4 tipos de pergunta), mudança 9 (mapa vivo) e mudança 10 (trilhas, opção A).
- Meta: nota 8 do Filipe e a filha reconhecer o app sem ver o logo.

### Onda 3 · "Coleção e profundidade" (mudanças 11 a 15)
- Dia 1 a 2: Flow dos 360 objetos em lotes (30 folhas), 21 looks, 3 blocos.
- Dia 2 a 3: mudança 11 (desafio da Brisa) e mudança 12 (personalização).
- Dia 3 a 5: mudanças 13, 14 e 15 (álbum, arte de contexto e tipos da onda 2).
- Em paralelo: testes em iPhone e Android reais (ainda não aconteceram), parecer do advogado sobre baú e moedas, busca de marca dos nomes.

---

## 15. Como saber se melhorou

1. **Nota do Filipe** no mesmo jogo de 15 minutos: de 5 para 7 na Onda 1, para 8 na Onda 2.
2. **Teste do print:** mostrar à filha 5 capturas sem logo (pergunta, mapa, fim de fase, Looks, baú) misturadas com 5 de outros apps; ela aponta quais são do Bobby. Meta: 5 de 5.
3. **Teste do som:** tocar 8 sons sem imagem (acerto, erro, baú, passos do Bobby, motivo do Teo, motivo da Rufa, motivo do Otto, fim de etapa) e perguntar "de quem é". Meta: 6 de 8 ligados ao Bobby ou ao personagem certo.
4. **Teste de quem fala:** perguntar à filha, ao fim da sessão, o nome do guia de cada matéria e do vilão. Meta: 4 de 4.
5. **Medidas automáticas:** reação em até 100 ms, 4 alternativas visíveis em 360 x 640, pico dos sons, texto sobreposto igual a 0, peso inicial menor que 3,0 MB.
6. **Também com uma criança de 11 a 12 anos**, porque o público vai até 12 e o tom pode parecer infantil para essa faixa (OPINIÃO; ninguém dessa idade jogou).

---

## 16. O que preciso do Filipe (decisões)

| # | Decisão | Minha sugestão |
|---|---|---|
| D1 | Remover as 5 vidas e o botão "continuar por 50 moedas" | Sim (mudança 5). O erro só devolve a pergunta ao fim da fila |
| D2 | Liberar bounce e overshoot só nas celebrações (hoje o DESIGN proíbe) | Sim, só nas celebrações da mudança 6; nas telas de estudo continua proibido |
| D3 | Aprovar o Embaralho e as 3 estrelas como fio da história; busca no INPI antes de vender | Aprovar para testar com a filha |
| D4 | Música: ouvir a opção A e uma faixa CC0 (JRPG Pack 4 Calm, **não ouvi ainda**) e escolher | Começar com A; ouvir B na Onda 2 |
| D5 | Vozes dos companheiros (Kokoro com tom e velocidade por personagem): ouvir 7 amostras | Aprovar amostra antes do lote de falas |
| D6 | Música ligada em volume baixo por padrão, ou desligada | Ligada em volume baixo, com interruptor à vista |
| D7 | Vibração em Android ligada por padrão | Ligada, com interruptor; iPhone sem |
| D8 | Teto de 3,0 MB do pacote inicial com carga tardia do resto | Manter |
| D9 | Sessão de teste com a filha (20 minutos) no fim de cada onda e com uma criança de 11 a 12 anos | Sim |

---

## 17. O que não rodou e o que fica em aberto

- **Não rodei** o app, o Playwright nem a fumaça: o pedido era leitura. A análise de tela vem das 33 capturas existentes.
- **Não ouvi** nenhum áudio (as vozes, as faixas CC0) e **não abri o Flow**.
- **Fontes que não consegui ler:** Ryan e Deci (2000, PDF ilegível), Adams e outros (2012, só citação), Cordova e Lepper (1996, só citação e uma revisão), páginas de GeneralUser GS e Pixabay (licença sem texto completo). Nada disso decide o plano; cada uso está marcado.
- **Licença comercial das imagens do Flow e da voz Kokoro** seguem pendentes de advogado (README da Fase 3 e `audio/LEIA-ME.md`).
- **iPhone e Android reais** ainda não testados: háptica, Web Audio, 60 quadros por segundo e `:has()` dependem disso.
- **Os pesos em KB de objetos, looks e figuras são estimativas** (8 KB, 45 KB), a medir no lote piloto.
- Esta análise não prova que a nota sobe: a meta da seção 15 é para medir, com a filha, depois de cada onda.
- Custo desta entrega: R$ 0 (nenhuma geração paga).
