/* ===== Aulas passo a passo (linguagem para 8 anos) ===== */
const P=(t,c,fig)=>({t:t,c:c,fig:fig||''});
const AULAS={};

/* ---- Unidade 1 ---- */
AULAS['1.1']=[
 P('O que é contar?','Contar é apontar para cada coisa e falar um número em voz alta. Você não pode pular nenhuma nem contar a mesma duas vezes. O <b>último número que você falar</b> é a quantidade.',dots(5)),
 P('Vamos contar juntos','<ol class="passos"><li>Aponte a primeira bolinha e diga <b>um</b>.</li><li>Aponte a próxima e diga <b>dois</b>.</li><li>Siga assim: três, quatro, <b>cinco</b>.</li><li>Parou no cinco? Então são <b>5 bolinhas</b>.</li></ol>'),
 P('Pra não esquecer','Cada número é sempre <b>1 a mais</b> que o anterior. Depois do 5 vem o 6, porque é o 5 mais um. Contar para trás é o contrário: tira 1 de cada vez.')
];
AULAS['1.2']=[
 P('Comparar é ver quem tem mais','Quando dois números aparecem juntos, dá para saber qual é o <b>maior</b> (tem mais) e qual é o <b>menor</b> (tem menos). É como comparar duas caixas de brinquedo.'),
 P('Como comparar 34 e 51','<ol class="passos"><li>Conte os algarismos: 34 tem dois, 51 tem dois. Empatou.</li><li>Empatou? Olhe o <b>primeiro algarismo</b> de cada um: 3 e 5.</li><li>3 é menor que 5, então <b>34 é menor que 51</b>.</li></ol>'),
 P('O truque do jacaré','Os sinais &lt; e &gt; são a boca de um jacaré faminto. Ele sempre abre a boca para o <b>número maior</b>, porque quer comer mais. Assim: 34 &lt; 51.')
];
AULAS['1.3']=[
 P('Contar de um em um cansa','Quando são muitas coisas, contar uma por uma dá erro: a gente pula ou repete. Por isso os matemáticos inventaram um truque — juntar sempre de <b>10 em 10</b>.',dourado(0,0,9)),
 P('Dez viram um só','Junte 10 cubinhos e eles viram <b>uma barrinha</b>. Essa barrinha tem um nome: <b>dezena</b>. Ela vale 10, mesmo sendo uma peça só.',dourado(0,1,0)),
 P('O jogo da troca','<ol class="passos"><li>Conte 10 cubinhos soltos.</li><li>Troque esses 10 por <b>1 barrinha</b>.</li><li>Continue com os que sobraram.</li><li>No fim, conte as barrinhas de 10 em 10: 10, 20, 30...</li></ol>'),
 P('Lendo as barrinhas','3 barrinhas valem <b>30</b>, porque são 3 grupos de 10. Se além delas houver 4 cubinhos soltos, o número é <b>34</b>: 3 dezenas e 4 unidades.',dourado(0,3,4)),
 P('Pra não esquecer','No número 34, o <b>3 conta as barrinhas</b> (e vale 30) e o <b>4 conta os cubinhos soltos</b>. É a posição que manda, não o tamanho do algarismo.')
];
AULAS['1.4']=[
 P('Três peças, três valores','Agora são três peças. O <b>cubinho</b> é a unidade e vale 1. A <b>barrinha</b> é a dezena e vale 10. A <b>placa</b> é a centena e vale 100.',dourado(1,1,1,true)),
 P('A placa é feita de barrinhas','Assim como 10 cubinhos viram 1 barrinha, <b>10 barrinhas viram 1 placa</b>. Cada peça nova vale dez vezes a anterior.',dourado(1,0,0)),
 P('Montando o 246','<ol class="passos"><li>Pegue <b>2 placas</b>: já são 200.</li><li>Some <b>4 barrinhas</b>: 200 + 40 = 240.</li><li>Some <b>6 cubinhos</b>: 240 + 6 = <b>246</b>.</li><li>Lê-se “duzentos e quarenta e seis”.</li></ol>',dourado(2,4,6)),
 P('A posição manda','Repare no 246: o 2 não vale dois, vale <b>duzentos</b>. O 4 não vale quatro, vale <b>quarenta</b>. Só o 6, que está na última casa, vale mesmo 6.'),
 P('Pra não esquecer','Da direita para a esquerda: unidade, dezena, centena. Cada passo para a esquerda vale <b>10 vezes mais</b>. É por isso que 100 tem dois zeros: são dez dezenas.')
];
AULAS['1.5']=[
 P('A reta numérica é uma régua','Imagine os números numa régua, em ordem, sempre com a mesma distância entre eles. Quem está mais à direita é maior. Ela ajuda a ver quem está perto de quem.'),
 P('Arredondando o 47','<ol class="passos"><li>As dezenas mais perto de 47 são 40 e 50.</li><li>Olhe a unidade: é o <b>7</b>.</li><li>De 0 a 4 o número desce; de 5 a 9 ele sobe. Como 7 é maior que 5, <b>sobe</b>.</li><li>Então 47 arredondado vira <b>50</b>.</li></ol>'),
 P('Pra que serve isso?','Para calcular rápido de cabeça. No mercado, R$ 47 mais R$ 32 é quase 50 + 30 = 80. Você já sabe que vai dar “uns oitenta reais” antes de fazer a conta certinha.')
];

/* ---- Unidade 2 ---- */
AULAS['2.1']=[
 P('Somar é juntar','Você tem 7 figurinhas e ganha mais 5. Somar é descobrir com quantas você ficou no total. O sinal + significa “junta com”.'),
 P('Fazendo 7 + 5','<ol class="passos"><li>Comece pelo número <b>maior</b>: 7.</li><li>Complete até 10: 7 + 3 = 10 (usei 3 dos 5).</li><li>Sobraram 2. Agora 10 + 2 = <b>12</b>.</li></ol>'),
 P('Truque que economiza tempo','A ordem não muda nada: 7 + 5 é igual a 5 + 7. Então comece sempre pelo número maior e conte só o menor para frente.')
];
AULAS['2.2']=[
 P('Números maiores, mesma ideia','Para somar 38 + 27 você não precisa contar de um em um. Dá para somar as partes separadas: primeiro as dezenas, depois as unidades.'),
 P('Fazendo 38 + 27 por partes','<ol class="passos"><li>Some as dezenas: 30 + 20 = <b>50</b>.</li><li>Some as unidades: 8 + 7 = <b>15</b>.</li><li>Junte tudo: 50 + 15 = <b>65</b>.</li></ol>'),
 P('E o tal do “vai um”?','Quando as unidades passam de 9 (como 8 + 7 = 15), o 10 que sobrou vira uma dezena nova — é isso que a professora chama de “vai um”. Somando por partes, isso acontece sozinho.')
];
AULAS['2.3']=[
 P('Subtrair é tirar','Você tinha 52 reais e gastou 27. Subtrair é descobrir quanto sobrou. Também serve para ver a <b>diferença</b> entre dois números: quanto um tem a mais que o outro.'),
 P('Fazendo 52 − 27','<ol class="passos"><li>Tire primeiro os 20: 52 − 20 = <b>32</b>.</li><li>Agora tire os 7 que faltam: 32 − 7 = <b>25</b>.</li><li>Resposta: sobraram <b>25</b>.</li></ol>'),
 P('Como saber se acertei','Faça a conta ao contrário: 25 + 27 = 52. Bateu com o número do começo? Então está certo. Esse é o melhor jeito de conferir sozinho.')
];
AULAS['2.4']=[
 P('Trabalhando com centenas','Com números grandes o método é o mesmo de sempre: junte centenas com centenas, dezenas com dezenas e unidades com unidades. Nunca misture as casas.'),
 P('Fazendo 347 + 265','<ol class="passos"><li>Centenas: 300 + 200 = <b>500</b>.</li><li>Dezenas: 40 + 60 = <b>100</b>.</li><li>Unidades: 7 + 5 = <b>12</b>.</li><li>Junte: 500 + 100 + 12 = <b>612</b>.</li></ol>'),
 P('Truque do número redondo','Para 500 − 168, tire 1 do 500 antes: 499 − 168 = 331. Depois devolva o 1: <b>332</b>. Assim você não precisa pedir emprestado nenhuma vez.')
];
AULAS['2.5']=[
 P('Problema é conta com história','Num problema, os números vêm no meio de uma historinha. Seu trabalho é descobrir qual conta a pergunta está pedindo.'),
 P('Resolvendo um exemplo','<b>“Lívia tinha 45 adesivos e deu 18. Com quantos ficou?”</b><ol class="passos"><li>Ache os números: <b>45</b> e <b>18</b>.</li><li>Veja o que aconteceu: ela <b>deu</b>, então perdeu adesivos.</li><li>Perdeu = subtração: 45 − 18 = <b>27</b>.</li></ol>'),
 P('Palavras que entregam a conta','“Ao todo”, “juntos”, “ganhou” pedem <b>soma</b>. “Sobrou”, “gastou”, “quanto falta”, “a mais que” pedem <b>subtração</b>. Leia duas vezes antes de escolher.')
];

/* ---- Unidade 3 ---- */
AULAS['3.1']=[
 P('Multiplicar é somar grupos iguais','Se você tem 4 pacotinhos e cada um tem 3 balas, dá para somar 3 + 3 + 3 + 3. Multiplicar é o jeito curto de fazer isso: 4 × 3.',groups(4,3)),
 P('Lendo 4 × 3','<ol class="passos"><li>O primeiro número diz <b>quantos grupos</b>: 4 grupos.</li><li>O segundo diz <b>quanto tem em cada um</b>: 3 balas.</li><li>Some: 3 + 3 + 3 + 3 = <b>12</b>. Então 4 × 3 = 12.</li></ol>'),
 P('Truque que corta a tabuada ao meio','4 × 3 dá o mesmo que 3 × 4. Se você já sabe um, sabe o outro de graça. E multiplicar por 1 não muda nada; por 0 dá sempre zero.')
];
AULAS['3.2']=[
 P('Começando pelas fáceis','As tabuadas do 2, 3, 4 e 5 são as mais amigas. A do 2 é só <b>dobrar</b>. A do 5 sempre termina em 0 ou 5.'),
 P('Fazendo 7 × 4 sem decorar','<ol class="passos"><li>Multiplicar por 4 é dobrar <b>duas vezes</b>.</li><li>Dobro de 7 = <b>14</b>.</li><li>Dobro de 14 = <b>28</b>. Pronto: 7 × 4 = 28.</li></ol>'),
 P('Truque do 5','Multiplique por 10 e pegue a metade. 8 × 5 → 8 × 10 = 80 → metade = <b>40</b>. Funciona sempre.')
];
AULAS['3.3']=[
 P('As tabuadas “difíceis”','6, 7, 8 e 9 assustam, mas têm atalhos. Ninguém precisa decorar tudo na marra — dá para montar o resultado a partir de contas que você já sabe.'),
 P('Fazendo 7 × 8 por partes','<ol class="passos"><li>Você sabe 7 × 4 = <b>28</b>.</li><li>8 é o dobro de 4, então dobre o resultado.</li><li>Dobro de 28 = <b>56</b>. Logo 7 × 8 = 56.</li></ol>'),
 P('Truque do 9','Na tabuada do 9, os dois algarismos do resultado sempre somam 9: 9 × 6 = 54 (5 + 4 = 9); 9 × 7 = 63 (6 + 3 = 9). Serve para conferir se você lembrou certo.')
];
AULAS['3.4']=[
 P('Multiplicar por 10 é fácil demais','Quando você multiplica por 10, é só colocar um <b>zero</b> no fim. Por 100, dois zeros. Por 1000, três zeros.'),
 P('Vendo acontecer','<ol class="passos"><li>34 × 10 = <b>340</b> (um zero).</li><li>34 × 100 = <b>3400</b> (dois zeros).</li><li>34 × 1000 = <b>34000</b> (três zeros).</li></ol>'),
 P('Usando o truque','Para multiplicar por 20, faça × 2 e depois × 10. Exemplo: 15 × 20 → 15 × 2 = 30 → 30 × 10 = <b>300</b>.')
];
AULAS['3.5']=[
 P('Números grandes, em pedaços','Para multiplicar por um número de dois algarismos, quebre ele em dezena e unidade. Faz duas contas fáceis no lugar de uma difícil.'),
 P('Fazendo 23 × 14','<ol class="passos"><li>Quebre o 14 em <b>10 + 4</b>.</li><li>23 × 10 = <b>230</b>.</li><li>23 × 4 = <b>92</b>.</li><li>Some os dois: 230 + 92 = <b>322</b>.</li></ol>'),
 P('Confira estimando','23 é quase 20 e 14 é quase 15. 20 × 15 = 300. Sua resposta deu 322, que é pertinho de 300 — então faz sentido.')
];

/* ---- Unidade 4 ---- */
AULAS['4.1']=[
 P('Dividir é repartir igual','Você tem 12 balas para dar a 3 amigos, e todos precisam receber a mesma quantidade. Dividir é descobrir quanto cabe para cada um.',groups(3,4)),
 P('Fazendo 12 ÷ 3','<ol class="passos"><li>Dê 1 bala para cada amigo. Já foram 3.</li><li>Dê mais 1 para cada. Já foram 6.</li><li>Continue até acabar: cada um ficou com <b>4</b>.</li><li>Então 12 ÷ 3 = 4.</li></ol>'),
 P('Divisão é a irmã da multiplicação','Se 3 × 4 = 12, então 12 ÷ 3 = 4 e 12 ÷ 4 = 3. Toda vez que travar numa divisão, pense na multiplicação que dá aquele número.')
];
AULAS['4.2']=[
 P('Divisão exata é quando não sobra nada','Algumas divisões repartem tudo certinho, sem sobrar. Para resolver, use a tabuada de trás para frente.'),
 P('Fazendo 56 ÷ 8','<ol class="passos"><li>Pergunte: “8 vezes quanto dá 56?”</li><li>Vá testando: 8 × 5 = 40, ainda é pouco.</li><li>8 × 6 = 48, quase lá.</li><li>8 × 7 = <b>56</b>. Achou! 56 ÷ 8 = 7.</li></ol>'),
 P('Pra não esquecer','Todo número dividido por 1 continua igual. E todo número dividido por ele mesmo dá 1. Essas duas nunca falham.')
];
AULAS['4.3']=[
 P('Nem sempre dá para repartir tudo','Se você tem 17 bombons para 5 crianças, cada uma leva 3 e ainda ficam 2 na mesa. Esses 2 que ficaram são o <b>resto</b>.'),
 P('Fazendo 17 ÷ 5','<ol class="passos"><li>Procure o maior número da tabuada do 5 que não passa de 17: 5 × 3 = <b>15</b>.</li><li>O quociente (resultado) é <b>3</b>.</li><li>Veja quanto sobrou: 17 − 15 = <b>2</b>. Esse é o resto.</li></ol>'),
 P('Duas regras de ouro','O resto é <b>sempre menor</b> que o número pelo qual você dividiu. E para conferir: quociente × divisor + resto = número do começo (3 × 5 + 2 = 17).')
];
AULAS['4.4']=[
 P('Palavras que aparecem o tempo todo','<b>Dobro</b> é multiplicar por 2. <b>Metade</b> é dividir por 2. <b>Triplo</b> é vezes 3, e <b>terça parte</b> é dividir por 3. São palavras que caem em prova e no dia a dia.'),
 P('Vendo com o número 14','<ol class="passos"><li>Dobro de 14: 14 × 2 = <b>28</b>.</li><li>Metade de 14: 14 ÷ 2 = <b>7</b>.</li><li>Triplo de 9: 9 × 3 = <b>27</b>. Terça parte de 9: 9 ÷ 3 = <b>3</b>.</li></ol>'),
 P('Cuidado com os ímpares','A metade de um número ímpar não é inteira: metade de 7 é <b>3,5</b>. Isso é normal — é meia unidade sobrando.')
];
AULAS['4.5']=[
 P('Três palavras novas','<b>Múltiplos</b> de 4 são os resultados da tabuada do 4: 4, 8, 12, 16... <b>Divisores</b> de 12 são os números que dividem 12 sem sobrar nada. <b>Primo</b> é o número que só pode ser dividido por 1 e por ele mesmo.'),
 P('Achando os divisores de 12','<ol class="passos"><li>Teste do 1 para cima: 12 ÷ 1 = 12 ✓</li><li>12 ÷ 2 = 6 ✓ &nbsp; 12 ÷ 3 = 4 ✓ &nbsp; 12 ÷ 4 = 3 ✓</li><li>12 ÷ 5 sobra resto ✗ &nbsp; 12 ÷ 6 = 2 ✓ &nbsp; 12 ÷ 12 = 1 ✓</li><li>Divisores: 1, 2, 3, 4, 6 e 12 — são <b>6</b> divisores.</li></ol>'),
 P('Os primos do começo','2, 3, 5, 7, 11, 13, 17, 19. Vale decorar esses. Atenção: o <b>1 não é primo</b> (só tem um divisor) e o <b>2 é o único primo par</b>.')
];

/* ---- Unidade 5 ---- */
AULAS['5.1']=[
 P('Fração é pedaço de um inteiro','Uma pizza inteira foi cortada em 4 fatias <b>iguais</b> e você comeu 3. Você comeu três quartos da pizza. Isso se escreve com um número em cima e outro embaixo.',fracBar(3,4)),
 P('Lendo a fração '+frac(3,4),'<ol class="passos"><li>O número de <b>baixo</b> (4) diz em quantos pedaços o inteiro foi cortado. Chama-se denominador.</li><li>O número de <b>cima</b> (3) diz quantos pedaços você pegou. Chama-se numerador.</li><li>Lê-se “três quartos”.</li></ol>'),
 P('A pegadinha do número de baixo','Quanto <b>maior</b> o número de baixo, <b>menores</b> são os pedaços. Uma pizza dividida em 8 tem fatias menores que uma dividida em 4. Por isso '+frac(1,8)+' é menos que '+frac(1,4)+'.')
];
AULAS['5.2']=[
 P('Frações diferentes, mesmo tanto','Meia pizza é a mesma coisa que duas fatias de quatro. Os números mudam, mas a quantidade é igual. Frações assim se chamam <b>equivalentes</b>.'),
 P('Fabricando frações iguais a '+frac(1,2),'<ol class="passos"><li>Multiplique o de cima e o de baixo pelo <b>mesmo</b> número.</li><li>Por 2: '+frac(1,2)+' vira '+frac(2,4)+'.</li><li>Por 3: vira '+frac(3,6)+'. Por 50: vira '+frac(50,100)+'.</li><li>Todas valem metade.</li></ol>'),
 P('Simplificar é o caminho de volta','Dividindo os dois números pelo mesmo valor, a fração fica menor e mais fácil de ler: '+frac(6,8)+' dividido por 2 vira '+frac(3,4)+'.')
];
AULAS['5.3']=[
 P('Como saber qual fração é maior','Depende do que está igual nas duas. Existem dois casos fáceis e um truque para o resto.'),
 P('Os dois casos fáceis','<ol class="passos"><li><b>Mesmo número embaixo:</b> ganha quem tem o de cima maior. '+frac(5,7)+' &gt; '+frac(3,7)+'.</li><li><b>Mesmo número em cima:</b> ganha quem tem o de <b>baixo menor</b>, porque os pedaços são maiores. '+frac(2,3)+' &gt; '+frac(2,9)+'.</li></ol>'),
 P('O truque da metade','Compare cada fração com '+frac(1,2)+'. Se o de cima passa da metade do de baixo, ela é maior que meio. '+frac(5,8)+' é maior que meio (5 passa de 4); '+frac(3,8)+' é menor.')
];
AULAS['5.4']=[
 P('Somando pedaços do mesmo tamanho','Se as fatias têm o mesmo tamanho, é só contar quantas você tem. 2 fatias mais 3 fatias dão 5 fatias.'),
 P('Fazendo '+frac(2,7)+' + '+frac(3,7),'<ol class="passos"><li>Some só os números de <b>cima</b>: 2 + 3 = 5.</li><li>O de <b>baixo não muda</b>: continua 7.</li><li>Resultado: '+frac(5,7)+'.</li></ol>'),
 P('E quando os de baixo são diferentes?','Deixe os dois iguais primeiro, usando frações equivalentes: '+frac(1,2)+' + '+frac(1,4)+' vira '+frac(2,4)+' + '+frac(1,4)+' = '+frac(3,4)+'.')
];
AULAS['5.5']=[
 P('Fração de uma quantidade','Perguntas como “quanto é três quartos de 20 figurinhas?” aparecem toda hora: em desconto, em receita, em dividir a conta.'),
 P('Fazendo '+frac(3,4)+' de 20','<ol class="passos"><li><b>Divida</b> pelo número de baixo: 20 ÷ 4 = <b>5</b>. Cada quarto vale 5.</li><li><b>Multiplique</b> pelo número de cima: 5 × 3 = <b>15</b>.</li><li>Resposta: 15 figurinhas.</li></ol>'),
 P('Pra não esquecer','Primeiro divide, depois multiplica. Sempre nessa ordem — e o resultado nunca pode ser maior que o total, a não ser que a fração passe de um inteiro.')
];

/* ---- Unidade 6 ---- */
AULAS['6.1']=[
 P('A vírgula parte o número em dois','Antes da vírgula fica a parte inteira (o que está completo). Depois dela ficam os pedaços que não chegaram a formar um inteiro — como os centavos do real.'),
 P('Lendo o número 2,45','<ol class="passos"><li>O <b>2</b> antes da vírgula: dois inteiros.</li><li>O <b>4</b> logo depois: 4 <b>décimos</b> (o inteiro dividido em 10 partes).</li><li>O <b>5</b> em seguida: 5 <b>centésimos</b> (dividido em 100 partes).</li></ol>'),
 P('Três que valem decorar','<b>0,5</b> é metade. <b>0,25</b> é um quarto. <b>0,75</b> é três quartos. Se você guardar esses três, muita conta fica fácil.')
];
AULAS['6.2']=[
 P('Mais algarismos não quer dizer maior','Muita gente acha que 0,25 é maior que 0,7 porque tem mais números. É armadilha! O que vale é o valor de cada casa.'),
 P('Comparando 0,7 e 0,25','<ol class="passos"><li>A parte inteira é 0 nos dois. Empatou.</li><li>Olhe a primeira casa depois da vírgula: <b>7</b> décimos contra <b>2</b> décimos.</li><li>7 é maior que 2, então <b>0,7 &gt; 0,25</b>.</li></ol>'),
 P('Zeros no fim não mudam nada','0,5 é igual a 0,50 e igual a 0,500. Isso ajuda a comparar: escreva 0,7 como 0,70 e fica fácil ver que é maior que 0,25.')
];
AULAS['6.3']=[
 P('A regra é uma só','Para somar ou subtrair decimais, escreva um número embaixo do outro com a <b>vírgula alinhada</b>. Só isso já resolve quase tudo.'),
 P('Fazendo 3,4 + 1,25','<ol class="passos"><li>Complete com zero para ficarem do mesmo tamanho: <b>3,40</b> + 1,25.</li><li>Some os centésimos: 0 + 5 = 5.</li><li>Some os décimos: 4 + 2 = 6.</li><li>Some os inteiros: 3 + 1 = 4. Resultado: <b>4,65</b>.</li></ol>'),
 P('Pra não esquecer','Vírgula embaixo de vírgula, sempre. E a vírgula do resultado desce na mesma coluna das outras duas.')
];
AULAS['6.4']=[
 P('Real e centavo','No preço, os dois números depois da vírgula são os <b>centavos</b>. R$ 13,50 é treze reais e cinquenta centavos — e cinquenta centavos é meio real.'),
 P('Calculando o troco','<b>Comprou algo de R$ 13,50 e pagou com R$ 20,00.</b><ol class="passos"><li>Troco é o que você pagou <b>menos</b> o preço.</li><li>20,00 − 13,50.</li><li>De 13,50 até 14 falta 0,50; de 14 até 20 faltam 6.</li><li>Troco: 6 + 0,50 = <b>R$ 6,50</b>.</li></ol>'),
 P('Confira arredondando','13,50 é quase 14. E 20 − 14 = 6. Seu troco deu 6,50, que está pertinho de 6 — sinal de que a conta está certa.')
];
AULAS['6.5']=[
 P('A vírgula caminha','Multiplicar ou dividir por 10, 100 e 1000 não muda os algarismos: só faz a vírgula <b>andar de casa</b>.'),
 P('Vendo para os dois lados','<ol class="passos"><li>Multiplicando, a vírgula anda para a <b>direita</b>: 3,4 × 10 = <b>34</b>.</li><li>Por 100, anda duas casas: 3,4 × 100 = <b>340</b>.</li><li>Dividindo, ela anda para a <b>esquerda</b>: 3,4 ÷ 10 = <b>0,34</b>.</li></ol>'),
 P('Quantas casas?','Conte os zeros: 10 tem um zero, então uma casa. 100 tem dois zeros, duas casas. 1000, três casas. Simples assim.')
];

/* ---- Unidade 7 ---- */
AULAS['7.1']=[
 P('Por cento quer dizer “de cada cem”','Imagine que tudo foi dividido em 100 partes iguais. 25% significa que você está pegando 25 dessas 100 partes.'),
 P('As três caras do 25%','<ol class="passos"><li>Em porcentagem: <b>25%</b>.</li><li>Em fração: '+frac(25,100)+' , que simplificando é '+frac(1,4)+'.</li><li>Em decimal: <b>0,25</b>. Os três são a mesma coisa.</li></ol>'),
 P('Os valores que vale saber de cor','<b>100%</b> é tudo. <b>50%</b> é metade. <b>25%</b> é um quarto. <b>10%</b> é a décima parte. E <b>1%</b> é dividir por 100.')
];
AULAS['7.2']=[
 P('Comece sempre pelos 10%','Achar 10% é só dividir por 10 — e a partir dele você monta quase todos os outros. 20% é o dobro de 10%, 5% é a metade.'),
 P('Achando 30% de 240','<ol class="passos"><li>10% de 240 = 240 ÷ 10 = <b>24</b>.</li><li>30% é três vezes 10%.</li><li>24 × 3 = <b>72</b>.</li></ol>'),
 P('Truque de virar a conta','30% de 50 dá o mesmo que 50% de 30. Quando um lado for difícil, inverta: 50% de 30 é metade de 30, ou seja, <b>15</b>. Bem mais rápido.')
];
AULAS['7.3']=[
 P('Desconto tira, aumento põe','No desconto você calcula a porcentagem e <b>subtrai</b> do preço. No aumento, você calcula e <b>soma</b>.'),
 P('Camiseta de R$ 80 com 25% off','<ol class="passos"><li>Calcule 25% de 80: 80 ÷ 4 = <b>20</b>.</li><li>Esse é o valor do desconto, em reais.</li><li>Tire do preço: 80 − 20 = <b>R$ 60</b>.</li></ol>'),
 P('Atalho de uma conta só','Com 25% de desconto você paga <b>75%</b> do preço. Então 80 × 0,75 = 60 direto. Com 10% off, paga 90%; com 30% off, paga 70%.')
];
AULAS['7.4']=[
 P('Razão compara duas coisas','Se 2 pães custam R$ 6, existe uma relação fixa entre pão e preço: cada pão sai por R$ 3. Essa relação é a razão.'),
 P('Usando a razão','<ol class="passos"><li>2 pães → R$ 6. Então 1 pão → 6 ÷ 2 = <b>R$ 3</b>.</li><li>4 pães → 3 × 4 = <b>R$ 12</b>.</li><li>Repare: o número de pães dobrou e o preço dobrou junto.</li></ol>'),
 P('A regra do “junto”','Numa proporção, se um lado dobra, o outro dobra. Se um triplica, o outro triplica. Se isso não acontecer, não é proporção.')
];
AULAS['7.5']=[
 P('Regra de três é uma tabelinha','Serve para achar um valor que falta quando você conhece os outros três. Monte duas colunas: uma para cada grandeza.'),
 P('3 cadernos custam R$ 21. E 5 cadernos?','<ol class="passos"><li>Monte: 3 → 21 &nbsp;/&nbsp; 5 → x.</li><li>Multiplique <b>em cruz</b>: 5 × 21 = 105.</li><li>Divida pelo que sobrou: 105 ÷ 3 = <b>35</b>.</li><li>Cinco cadernos custam R$ 35.</li></ol>'),
 P('Antes de calcular, pergunte','“Se um aumenta, o outro aumenta?” Se sim (o caso quase sempre), é regra de três direta e você multiplica em cruz como acima.')
];

/* ---- Unidade 8 ---- */
AULAS['8.1']=[
 P('Polígono é forma fechada de linhas retas','Se a figura é fechada e todos os lados são retos, é um polígono. O nome dela vem da <b>quantidade de lados</b>.'),
 P('Conhecendo a turma','<ol class="passos"><li>3 lados: <b>triângulo</b>.</li><li>4 lados: <b>quadrilátero</b> — aqui entram o quadrado e o retângulo.</li><li>5 lados: <b>pentágono</b>. 6 lados: <b>hexágono</b>.</li></ol>'),
 P('Duas coisas que confundem','O <b>círculo não é polígono</b>, porque não tem lados retos. E todo <b>quadrado é um retângulo</b> — é só um retângulo com os quatro lados iguais.')
];
AULAS['8.2']=[
 P('Perímetro é o contorno','Imagine uma cerca em volta de um terreno, ou você andando na beirada de uma quadra. O perímetro é a soma de <b>todos os lados</b>.',svgRect(8,5)),
 P('Retângulo de 8 cm por 5 cm','<ol class="passos"><li>Os lados são 8, 5, 8 e 5.</li><li>Some tudo: 8 + 5 + 8 + 5 = <b>26 cm</b>.</li><li>Atalho: (8 + 5) × 2 = 13 × 2 = <b>26 cm</b>.</li></ol>'),
 P('E no quadrado?','Como os quatro lados são iguais, basta multiplicar o lado por 4. Lado de 7 cm → perímetro de <b>28 cm</b>.')
];
AULAS['8.3']=[
 P('Área é o espaço de dentro','Perímetro é a cerca; área é o gramado. Área conta quantos quadradinhos de 1 cm cabem dentro da figura.',svgRect(8,5)),
 P('Área do retângulo 8 × 5','<ol class="passos"><li>Cabem 8 quadradinhos em cada fileira.</li><li>São 5 fileiras.</li><li>8 × 5 = <b>40 quadradinhos</b>, ou seja, 40 cm².</li></ol>'),
 P('Não confunda as unidades','Perímetro se mede em cm (é comprimento). Área se mede em <b>cm²</b>, centímetros quadrados, porque conta quadradinhos. O triângulo é metade: base × altura ÷ 2.')
];
AULAS['8.4']=[
 P('Ângulo é o tamanho da abertura','Pense numa porta abrindo, ou nos ponteiros do relógio se afastando. O ângulo mede o quanto duas linhas se abrem, e a medida é o <b>grau</b> (°).'),
 P('Os ângulos que você precisa conhecer','<ol class="passos"><li><b>Reto</b>: 90°, o canto de uma folha de papel.</li><li><b>Agudo</b>: menor que 90°, bem fechadinho.</li><li><b>Obtuso</b>: entre 90° e 180°, bem aberto.</li><li><b>Raso</b>: 180°, uma linha reta. Volta completa: 360°.</li></ol>'),
 P('A regra do triângulo','Os três ângulos de qualquer triângulo somam sempre <b>180°</b>. Sabendo dois, você acha o terceiro: 180 menos a soma dos dois.')
];
AULAS['8.5']=[
 P('Cada medida tem sua família','Comprimento: 1 m = 100 cm e 1 km = 1000 m. Massa: 1 kg = 1000 g. Capacidade: 1 L = 1000 mL. Sempre de mil em mil ou de cem em cem.'),
 P('Trocando de unidade','<ol class="passos"><li>Vai para uma unidade <b>menor</b>? <b>Multiplique</b>: 2,5 m = 2,5 × 100 = <b>250 cm</b>.</li><li>Vai para uma unidade <b>maior</b>? <b>Divida</b>: 300 cm = 300 ÷ 100 = <b>3 m</b>.</li></ol>'),
 P('Volume é o espaço ocupado','Numa caixa, multiplique os três: comprimento × largura × altura. Uma caixa de 2 × 3 × 4 cm tem volume de <b>24 cm³</b>.')
];

/* ---- Unidade 9 ---- */
AULAS['9.1']=[
 P('A letra é um número escondido','Quando a gente não sabe um número ainda, escreve uma letra no lugar dele — quase sempre o <b>x</b>. Descobrir quanto vale o x é resolver o mistério.'),
 P('Descobrindo o x em x + 7 = 12','<ol class="passos"><li>Alguma coisa mais 7 deu 12.</li><li>Para voltar, faça a operação <b>contrária</b> do +: subtraia.</li><li>12 − 7 = <b>5</b>. Então x = 5.</li><li>Confira: 5 + 7 = 12 ✓</li></ol>'),
 P('A tabela do contrário','Somou? Subtraia. Subtraiu? Some. Multiplicou? Divida. Dividiu? Multiplique. É sempre a operação inversa que revela o x.')
];
AULAS['9.2']=[
 P('As contas têm ordem de chegada','Numa expressão com vários sinais, não se resolve da esquerda para a direita. Existe uma fila: primeiro <b>parênteses</b>, depois potências, depois <b>× e ÷</b>, e por último <b>+ e −</b>.'),
 P('Resolvendo 2 + 3 × 4','<ol class="passos"><li>Tem multiplicação e soma. A multiplicação vem primeiro.</li><li>3 × 4 = <b>12</b>.</li><li>Agora a soma: 2 + 12 = <b>14</b>.</li><li>Quem faz na ordem errada acha 20 — e erra.</li></ol>'),
 P('Parênteses furam a fila','O que está dentro do parêntese sempre passa na frente: (2 + 3) × 4 = 5 × 4 = <b>20</b>. Por isso eles existem.')
];
AULAS['9.3']=[
 P('Equação é uma balança','O sinal de = quer dizer que os dois lados pesam a mesma coisa. Se você tirar algo de um lado, precisa tirar do outro também, senão a balança desequilibra.'),
 P('Resolvendo 2x + 5 = 17','<ol class="passos"><li>Tire 5 dos <b>dois</b> lados: 2x = 12.</li><li>Agora o x está multiplicado por 2. Divida os dois lados por 2.</li><li>x = <b>6</b>.</li><li>Confira: 2 × 6 + 5 = 17 ✓</li></ol>'),
 P('A ordem que funciona sempre','Primeiro tire o que está somando ou subtraindo. Depois desfaça o que está multiplicando ou dividindo. O objetivo é deixar o x <b>sozinho</b> de um lado.')
];
AULAS['9.4']=[
 P('Potência é multiplicar por si mesmo','5² não é 5 × 2. É o 5 multiplicado por ele mesmo. O número pequeno lá em cima, chamado <b>expoente</b>, diz quantas vezes o número aparece na multiplicação.'),
 P('Abrindo as potências','<ol class="passos"><li>5² = 5 × 5 = <b>25</b> (o 5 aparece 2 vezes).</li><li>2³ = 2 × 2 × 2 = <b>8</b> (o 2 aparece 3 vezes).</li><li>10² = 10 × 10 = <b>100</b>.</li></ol>'),
 P('Dois casos especiais','Qualquer número elevado a <b>1</b> é ele mesmo (7¹ = 7). E qualquer número elevado a <b>0</b> dá 1. O 2 lê-se “ao quadrado” e o 3, “ao cubo”.')
];
AULAS['9.5']=[
 P('Raiz é o caminho de volta','A raiz quadrada desfaz a potência de 2. Ela pergunta: “que número, multiplicado por ele mesmo, dá isso aqui?”'),
 P('Calculando √49','<ol class="passos"><li>Procure um número que vezes ele mesmo dê 49.</li><li>Teste: 6 × 6 = 36, pouco. 7 × 7 = <b>49</b>. Achou!</li><li>Então √49 = <b>7</b>.</li></ol>'),
 P('A lista que resolve tudo','Decore os quadrados perfeitos: 1, 4, 9, 16, 25, 36, 49, 64, 81, 100, 121, 144. Com eles, quase toda raiz da escola sai na hora.')
];

/* ---- Unidade 10 ---- */
AULAS['10.1']=[
 P('Média é dividir tudo igualzinho','Se três amigos têm quantidades diferentes de bolinhas e resolvem repartir para todos ficarem iguais, cada um fica com a média.'),
 P('Média das notas 6, 8 e 10','<ol class="passos"><li>Some tudo: 6 + 8 + 10 = <b>24</b>.</li><li>Conte quantos valores são: <b>3</b>.</li><li>Divida: 24 ÷ 3 = <b>8</b>. A média é 8.</li></ol>'),
 P('Como saber se errei','A média fica sempre <b>entre</b> o menor e o maior valor. Se deu um número fora desse intervalo, tem erro na conta.')
];
AULAS['10.2']=[
 P('Gráfico é informação desenhada','Num gráfico de barras, quanto mais alta a barra, maior a quantidade. Dá para comparar tudo de uma olhada, sem ler número por número.',barras(['Seg','Ter','Qua','Qui'],[6,14,20,11])),
 P('Como ler','<ol class="passos"><li>Leia primeiro o que está <b>embaixo</b> de cada barra: o dia, o nome, a categoria.</li><li>Veja a altura de cada uma para achar a maior e a menor.</li><li>Só então faça contas: somar tudo, ver a diferença entre duas, calcular a média.</li></ol>'),
 P('Pergunta clássica de prova','“Quanto Quarta teve <b>a mais</b> que Segunda?” — “a mais” é subtração: pegue a altura de quarta e tire a de segunda.')
];
AULAS['10.3']=[
 P('Probabilidade é medir a chance','Antes de jogar um dado, ninguém sabe o que vai sair. Mas dá para calcular a chance: quantos jeitos dão certo, divididos por quantos jeitos existem no total.'),
 P('Chance de tirar 3 num dado','<ol class="passos"><li>Jeitos que dão certo: só um, o lado com 3. Numerador = <b>1</b>.</li><li>Jeitos possíveis: o dado tem 6 lados. Denominador = <b>6</b>.</li><li>Chance = '+frac(1,6)+'.</li></ol>'),
 P('Os limites da chance','A chance vai de <b>0</b> (impossível, como tirar 7 num dado de 6 lados) até <b>1</b>, ou 100% (certeza absoluta). Nunca passa disso.')
];
AULAS['10.4']=[
 P('Existe número abaixo do zero','No termômetro no inverno, ou no saldo de uma conta devendo, os números passam do zero para baixo. Eles levam um sinal de menos na frente: −5.'),
 P('Comparando negativos','<ol class="passos"><li>Na reta numérica, os negativos ficam à <b>esquerda</b> do zero.</li><li>Quanto mais longe do zero, <b>menor</b> o número.</li><li>Por isso −5 é menor que −2. E qualquer negativo é menor que 0.</li></ol>'),
 P('Contas com negativo','Somar um negativo é o mesmo que subtrair: 5 + (−3) = 5 − 3 = <b>2</b>. E se o termômetro está em −7 e sobe 10 graus, ele chega a <b>3</b>.')
];
AULAS['10.5']=[
 P('Aqui cai de tudo','Este é o desafio final: as perguntas misturam frações, decimais, porcentagem, geometria e álgebra. Elas não avisam de qual unidade vieram.'),
 P('O que fazer em cada pergunta','<ol class="passos"><li>Leia com calma até o fim, sem pressa.</li><li>Descubra o <b>assunto</b>: tem vírgula? tem %? tem cm? tem x?</li><li>Use a estratégia daquela unidade.</li><li>Confira o resultado antes de responder.</li></ol>'),
 P('Errar aqui é normal','Se travar num assunto, volte na unidade dele e refaça a lição. Ninguém aprende de primeira, e a trilha inteira continua aberta para você repetir quantas vezes quiser.')
];

