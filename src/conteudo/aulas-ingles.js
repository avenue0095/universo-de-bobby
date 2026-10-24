/* ===== Aulas passo a passo — English Galaxy (explicado em pt-BR) ===== */
const EN=(en,pt,fala)=>'<button type="button" class="cartao-en" data-ler="'+encodeURIComponent(en)+'" data-lang="en-US" aria-label="Ouvir '+en+' em inglês">'+
  '<b>'+en+'</b><span class="pt">'+pt+'</span><span class="fala">'+(typeof IC!=='undefined'&&IC.falar?IC.falar:'&#9834;')+' '+fala+'</span></button>';
const ENS=(...c)=>'<div class="tira-en">'+c.join('')+'</div>';

AULAS['e1.1']=[
 P('Duas palavras para "oi"','Em inglês americano existem duas formas de cumprimentar: <b>hello</b> e <b>hi</b>. As duas querem dizer "oi", mas <b>hi</b> é mais solto, entre amigos, e <b>hello</b> é um pouquinho mais formal.',ENS(EN('hello','olá','rélou'),EN('hi','oi','rái'))),
 P('Como se fala','<ol class="passos"><li><b>hello</b> = "ré-lou". O H em inglês tem som de um R bem leve, quase um sopro.</li><li><b>hi</b> = "rái". Rima com "pai".</li></ol>'),
 P('Usando de verdade','Ao encontrar alguém: <b>Hi!</b> Ao atender o telefone, os americanos dizem <b>Hello?</b> Ao se despedir: <b>Bye!</b> (fala-se "bái").'),
 P('Pra não esquecer','Comece toda conversa com hi ou hello. São as duas primeiras palavras que qualquer pessoa aprende em inglês.')
];
AULAS['e1.2']=[
 P('Cumprimentos do dia','O inglês muda o cumprimento conforme a hora: <b>good morning</b> de manhã, <b>good afternoon</b> à tarde, <b>good evening</b> no começo da noite e <b>good night</b> só na hora de dormir.',ENS(EN('good morning','bom dia','gud mórnin'),EN('good night','boa noite','gud náit'))),
 P('A pegadinha do good night','<ol class="passos"><li><b>good evening</b> = boa noite ao <b>chegar</b>.</li><li><b>good night</b> = boa noite ao <b>ir embora</b> ou dormir.</li><li>Chegar numa festa dizendo "good night" soa como "tchau"!</li></ol>'),
 P('Good = bom','Repare que todos começam com <b>good</b>, que quer dizer "bom". Uma palavra só, quatro cumprimentos. Isso é economia de memória.'),
 P('Pra não esquecer','good morning (manhã), good afternoon (tarde), good evening (chegando à noite), good night (indo dormir).')
];
AULAS['e1.3']=[
 P('As palavras mágicas','<b>Please</b> quer dizer "por favor" e <b>thank you</b> quer dizer "obrigado". Nos Estados Unidos elas são usadas o tempo todo, até em coisas pequenas.',ENS(EN('please','por favor','plíz'),EN('thank you','obrigado','tênk iú'))),
 P('Respondendo','<ol class="passos"><li>Alguém diz <b>thank you</b>.</li><li>Você responde <b>you\'re welcome</b> ("iór uélcam") = de nada.</li><li>Entre amigos, também vale <b>sure</b> ou <b>no problem</b>.</li></ol>'),
 P('Thanks é a versão curta','<b>Thanks</b> ("tênks") é o mesmo que thank you, só que mais informal, como o nosso "valeu".'),
 P('Pra não esquecer','Please antes do pedido, thank you depois de receber. Com essas duas, você já é educado em inglês.')
];
AULAS['e1.4']=[
 P('Dizendo seu nome','A frase é <b>My name is...</b> ("mái neim iz") = "Meu nome é...". Depois é só falar seu nome.',ENS(EN('my name is','meu nome é','mái neim iz'),EN('what\'s your name?','qual é seu nome?','uóts iór neim'))),
 P('Uma conversa completa','<ol class="passos"><li><b>Hi! What\'s your name?</b> (Oi! Qual é o seu nome?)</li><li><b>My name is Lívia. And you?</b> (Meu nome é Lívia. E você?)</li><li><b>My name is Bobby. Nice to meet you!</b> (Meu nome é Bobby. Prazer em conhecer você!)</li></ol>'),
 P('O jeito curto','No dia a dia, americanos dizem só <b>I\'m Bobby</b> ("áim Bobby") = "eu sou o Bobby". Mais rápido e igualmente correto.'),
 P('Pra não esquecer','My name is + seu nome. Essa é a frase que abre qualquer apresentação.')
];
AULAS['e1.5']=[
 P('Os primeiros números','one, two, three, four, five, 1 a 5. Repare que a escrita não parece nada com o som; em inglês isso é comum.',ENS(EN('one','um','uân'),EN('two','dois','tchú'),EN('three','três','thrí'))),
 P('Como falar cada um','<ol class="passos"><li><b>one</b> = "uân"</li><li><b>two</b> = "tchú" (o W é mudo)</li><li><b>three</b> = "thrí" a língua vai entre os dentes</li><li><b>four</b> = "fór", <b>five</b> = "fáiv"</li></ol>'),
 P('Até dez','six ("siks"), seven ("sévan"), eight ("eit", o GH é mudo), nine ("náin"), ten ("tén").'),
 P('Pra não esquecer','Conte de 1 a 10 em inglês todo dia, apontando os dedos. Em uma semana sai automático.')
];

AULAS['e2.1']=[
 P('As primeiras cores','<b>red</b> (vermelho), <b>blue</b> (azul), <b>green</b> (verde). São três cores que aparecem em tudo: semáforo, bandeira, roupa.',ENS(EN('red','vermelho','réd'),EN('blue','azul','blú'),EN('green','verde','grín'))),
 P('Usando numa frase','<ol class="passos"><li>Estrutura: <b>The + coisa + is + cor</b>.</li><li>The ball is red. = A bola é vermelha.</li><li>The sky is blue. = O céu é azul.</li></ol>'),
 P('A cor vem antes','Diferente do português, em inglês a cor vem <b>antes</b> do objeto: "a red ball" (uma bola vermelha), nunca "a ball red".'),
 P('Pra não esquecer','Olhe ao seu redor e diga a cor de três objetos em inglês. Aprender cor é aprender vendo.')
];
AULAS['e2.2']=[
 P('Mais três cores','<b>yellow</b> (amarelo), <b>black</b> (preto), <b>white</b> (branco).',ENS(EN('yellow','amarelo','iélou'),EN('black','preto','blék'),EN('white','branco','uáit'))),
 P('Cuidado com a pronúncia','<ol class="passos"><li><b>yellow</b> tem dois L e termina em "ou": ié-lou.</li><li><b>white</b> tem o WH que soa "u": uáit.</li><li><b>black</b> tem um A curto, entre o nosso A e E.</li></ol>'),
 P('Perguntando a cor','<b>What color is it?</b> ("uót cálor iz it") = Que cor é? Responda: <b>It\'s yellow.</b> = É amarelo.'),
 P('Pra não esquecer','Nos EUA escreve-se <b>color</b>; na Inglaterra, colour. Aqui aprendemos o americano: color.')
];
AULAS['e2.3']=[
 P('Cores misturadas','<b>orange</b> (laranja), <b>purple</b> (roxo), <b>pink</b> (rosa).',ENS(EN('orange','laranja','órinj'),EN('purple','roxo','pârpol'),EN('pink','rosa','pink'))),
 P('Orange é fruta e cor','<ol class="passos"><li>An <b>orange</b> = uma laranja (a fruta).</li><li>The shirt is <b>orange</b> = a camisa é laranja (a cor).</li><li>Igual ao português: a mesma palavra serve para as duas coisas.</li></ol>'),
 P('Palavras parecidas','Repare que <b>pink</b> e <b>orange</b> parecem palavras que você já conhece do português. Muitas palavras do inglês vieram das mesmas raízes, isso vai te ajudar bastante.'),
 P('Pra não esquecer','Agora você já sabe nove cores. Dá para descrever quase qualquer coisa que você vê.')
];
AULAS['e2.4']=[
 P('Material escolar','<b>book</b> (livro), <b>pencil</b> (lápis), <b>pen</b> (caneta), <b>paper</b> (papel).',ENS(EN('book','livro','buk'),EN('pencil','lápis','pênsol'))),
 P('Um ou vários','<ol class="passos"><li>Um: <b>a book</b> (um livro), <b>a pencil</b> (um lápis).</li><li>Vários: acrescente S, <b>books</b> (livros), <b>pencils</b> (lápis).</li><li>Igualzinho ao português nesse ponto.</li></ol>'),
 P('A ou an?','Usa-se <b>a</b> antes de som de consoante (<b>a book</b> = um livro) e <b>an</b> antes de som de vogal (<b>an apple</b> = uma maçã, <b>an orange</b> = uma laranja). É só para a palavra soar melhor.'),
 P('Pra não esquecer','Junte com as cores: <b>a red pencil</b> = um lápis vermelho. Cor primeiro, coisa depois.')
];
AULAS['e2.5']=[
 P('Na escola','<b>school</b> (escola), <b>teacher</b> (professor/professora), <b>student</b> (aluno), <b>friend</b> (amigo).',ENS(EN('school','escola','skúl'),EN('teacher','professor(a)','tíchâr'))),
 P('Teacher vem de teach','<ol class="passos"><li><b>teach</b> = ensinar.</li><li>Acrescente <b>-er</b> e vira quem faz: <b>teacher</b> = quem ensina, o professor.</li><li>O mesmo truque: <b>play</b> (brincar) → <b>player</b> (jogador), <b>sing</b> (cantar) → <b>singer</b> (cantor), <b>work</b> (trabalhar) → <b>worker</b> (trabalhador).</li></ol>'),
 P('Não tem masculino e feminino','Em inglês, <b>teacher</b> serve para professor e professora. A língua quase não marca gênero, isso facilita muito a sua vida.'),
 P('Pra não esquecer','O sufixo <b>-er</b> transforma ação em pessoa. Guardando esse truque, você entende dezenas de palavras novas sozinho.')
];

AULAS['e3.1']=[
 P('Mãe e pai','<b>mother</b> (mãe) e <b>father</b> (pai). No dia a dia, os americanos usam mais <b>mom</b> e <b>dad</b>: como nosso "mãe" e "pai" carinhoso.',ENS(EN('mother','mãe','mâdâr'),EN('father','pai','fádâr'))),
 P('O som do TH','<ol class="passos"><li>Em <b>mother</b> e <b>father</b>, o TH é falado com a língua entre os dentes.</li><li>Não é T nem D nem F: é um som que o português não tem.</li><li>Comece falando "mâ-DÂR" já fica compreensível.</li></ol>'),
 P('Dizendo de quem é','Use <b>my</b> = meu/minha: <b>my mother</b>, <b>my father</b>. Não muda se é homem ou mulher, sempre "my".'),
 P('Pra não esquecer','mother/father para escrever, mom/dad para conversar.')
];
AULAS['e3.2']=[
 P('Irmãos','<b>sister</b> (irmã) e <b>brother</b> (irmão).',ENS(EN('sister','irmã','sistâr'),EN('brother','irmão','brâdâr'))),
 P('Falando da família','<ol class="passos"><li>I have a sister. = Eu tenho uma irmã.</li><li>I have two brothers. = Eu tenho dois irmãos.</li><li><b>I have</b> ("ái rév") = eu tenho.</li></ol>'),
 P('Uma palavra bônus','<b>sibling</b> quer dizer irmão ou irmã, sem dizer qual. O português não tem uma palavra assim.'),
 P('Pra não esquecer','I have + número + pessoa. Com essa fórmula você conta sua família inteira.')
];
AULAS['e3.3']=[
 P('Avós','<b>grandmother</b> (avó) e <b>grandfather</b> (avô). No dia a dia: <b>grandma</b> e <b>grandpa</b>.',ENS(EN('grandmother','avó','grândmâdâr'),EN('grandpa','vovô','grândpá'))),
 P('Grand = de cima','<ol class="passos"><li><b>grand</b> na frente significa uma geração acima ou abaixo.</li><li>grandmother = a mãe da sua mãe.</li><li>grandson = o filho do seu filho (neto).</li></ol>'),
 P('Palavras compostas','O inglês adora colar palavras: grand + mother = grandmother. Se você conhece as duas partes, entende a palavra inteira sem precisar decorar.'),
 P('Pra não esquecer','Procure as partes dentro das palavras longas. Quase sempre elas são duas palavras coladas.')
];
AULAS['e3.4']=[
 P('Família e amigos','<b>family</b> (família), <b>friend</b> (amigo/amiga), <b>people</b> (pessoas).',ENS(EN('family','família','fémili'),EN('friend','amigo(a)','frénd'))),
 P('Falando sobre eles','<ol class="passos"><li>This is my family. = Esta é minha família.</li><li>She is my friend. = Ela é minha amiga.</li><li>He is my friend. = Ele é meu amigo.</li></ol>'),
 P('He, she, they','<b>he</b> = ele, <b>she</b> = ela, <b>they</b> = eles/elas. Diferente do português, o inglês quase sempre precisa dizer o pronome: não dá para falar só "é meu amigo".'),
 P('Pra não esquecer','Family e friend são palavras que aparecem em qualquer conversa. Guarde bem essas duas.')
];
AULAS['e3.5']=[
 P('Menino, menina, bebê','<b>boy</b> (menino), <b>girl</b> (menina), <b>baby</b> (bebê), <b>man</b> (homem), <b>woman</b> (mulher).',ENS(EN('boy','menino','bói'),EN('girl','menina','gârl'),EN('baby','bebê','bêibi'))),
 P('Plurais irregulares','<ol class="passos"><li><b>boy</b> → <b>boys</b> (menino → meninos) e <b>girl</b> → <b>girls</b> (menina → meninas): normal, com S.</li><li><b>man</b> → <b>men</b> (homem → homens) e <b>woman</b> → <b>women</b> (mulher → mulheres): muda a letra do meio!</li><li><b>baby</b> → <b>babies</b> (bebê → bebês): o Y vira IES.</li></ol>'),
 P('Woman e women','No singular fala-se "uúman"; no plural, "uímen". A escrita muda pouco, mas o som muda bastante. Preste atenção ao ouvir.'),
 P('Pra não esquecer','A maioria dos plurais é só S. Os irregulares são poucos, e men/women são os mais usados de todos.')
];

AULAS['e4.1']=[
 P('Cachorro e gato','<b>dog</b> (cachorro) e <b>cat</b> (gato). Duas das palavras mais curtas e mais usadas do inglês.',ENS(EN('dog','cachorro','dóg'),EN('cat','gato','két'))),
 P('Falando dos bichos','<ol class="passos"><li>I have a dog. = Eu tenho um cachorro.</li><li>The cat is black. = O gato é preto.</li><li>Dogs are friendly. = Cachorros são amigáveis.</li></ol>'),
 P('Os sons dos bichos mudam!','Em inglês, o cachorro faz <b>woof woof</b> e o gato faz <b>meow</b>. Até o barulho dos animais é escrito diferente em cada língua.'),
 P('Pra não esquecer','Junte o que já sabe: <b>my black cat</b> = meu gato preto. Possessivo + cor + animal.')
];
AULAS['e4.2']=[
 P('Pássaro e peixe','<b>bird</b> (pássaro) e <b>fish</b> (peixe).',ENS(EN('bird','pássaro','bârd'),EN('fish','peixe','fích'))),
 P('Fish não muda no plural','<ol class="passos"><li>Um peixe: <b>a fish</b>.</li><li>Muitos peixes: <b>fish</b>: sem S!</li><li>Outros assim: sheep (ovelha), deer (cervo).</li></ol>'),
 P('Onde eles vivem','Birds fly in the sky. (Pássaros voam no céu.) Fish swim in the water. (Peixes nadam na água.) <b>fly</b> = voar, <b>swim</b> = nadar.'),
 P('Pra não esquecer','Palavras curtas como bird e fish são as que mais aparecem. Vale falar em voz alta várias vezes.')
];
AULAS['e4.3']=[
 P('Animais da fazenda','<b>cow</b> (vaca), <b>horse</b> (cavalo), <b>pig</b> (porco), <b>chicken</b> (galinha), <b>duck</b> (pato).',ENS(EN('cow','vaca','cáu'),EN('horse','cavalo','rórs'),EN('duck','pato','dâk'))),
 P('Uma frase pronta','<ol class="passos"><li>Estrutura: <b>There is a + animal</b> = Há um...</li><li>There is a cow. = Há uma vaca.</li><li>Plural: <b>There are</b> two cows.</li></ol>'),
 P('Carne tem outro nome','Curiosidade: o animal é <b>cow</b>, mas a carne dele é <b>beef</b>. O porco é <b>pig</b> e a carne é <b>pork</b>. São palavras diferentes.'),
 P('Pra não esquecer','There is (um) e There are (vários). Essa dupla serve para descrever qualquer lugar.')
];
AULAS['e4.4']=[
 P('Animais selvagens','<b>lion</b> (leão), <b>elephant</b> (elefante), <b>monkey</b> (macaco), <b>tiger</b> (tigre).',ENS(EN('lion','leão','láian'),EN('elephant','elefante','élifant'))),
 P('Palavras parecidas com o português','<ol class="passos"><li>lion / leão</li><li>elephant / elefante</li><li>tiger / tigre</li><li>Repare como muitas se parecem: são <b>cognatos</b>, palavras da mesma origem.</li></ol>'),
 P('Descrevendo com adjetivo','The lion is big. (O leão é grande.) The monkey is fast. (O macaco é rápido.) <b>big</b> = grande, <b>small</b> = pequeno, <b>fast</b> = rápido.'),
 P('Pra não esquecer','Quando uma palavra em inglês parecer com uma do português, provavelmente quer dizer a mesma coisa. Aproveite essa ajuda.')
];
AULAS['e4.5']=[
 P('O urso e o coelho','<b>bear</b> (urso, como o Bobby!) e <b>rabbit</b> (coelho).',ENS(EN('bear','urso','bér'),EN('rabbit','coelho','rébit'))),
 P('Cuidado: bear e beer','<ol class="passos"><li><b>bear</b> = urso, fala-se "bér".</li><li><b>beer</b> = cerveja, fala-se "bíer".</li><li>Uma letra trocada muda tudo, igual FACA e VACA em português.</li></ol>'),
 P('Apresentando o Bobby','<b>Bobby is a brown bear.</b> = O Bobby é um urso marrom.<br><b>He is my friend.</b> = Ele é meu amigo. (<b>brown</b> = marrom)'),
 P('Pra não esquecer','Você já sabe apresentar, descrever e falar de animais. Isso já é uma conversa de verdade.')
];

AULAS['e5.1']=[
 P('Bebidas','<b>water</b> (água) e <b>milk</b> (leite).',ENS(EN('water','água','uótâr'),EN('milk','leite','milk'))),
 P('Pedindo educadamente','<ol class="passos"><li><b>Water, please.</b> = Água, por favor.</li><li>Mais completo: <b>Can I have some water, please?</b></li><li>Traduzindo: "Eu posso ter um pouco de água, por favor?"</li></ol>'),
 P('Some e a','Com líquidos, não se diz "a water"; diz-se <b>some water</b> (um pouco de água). Isso acontece com tudo que não dá para contar: some milk, some rice.'),
 P('Pra não esquecer','<b>Can I have..., please?</b> é a fórmula universal para pedir qualquer coisa em inglês.')
];
AULAS['e5.2']=[
 P('Pão e queijo','<b>bread</b> (pão), <b>cheese</b> (queijo), <b>butter</b> (manteiga).',ENS(EN('bread','pão','bréd'),EN('cheese','queijo','tchíz'))),
 P('Say cheese!','<ol class="passos"><li>Nos EUA, quem tira foto diz <b>Say cheese!</b>: “Diga queijo!”</li><li>É porque falar “cheese” (queijo) faz a boca sorrir.</li><li>É o nosso “diga X”.</li></ol>'),
 P('Montando o lanche','Bread and cheese, please. <b>and</b> = e. Com "and" você junta qualquer par de palavras.'),
 P('Pra não esquecer','and é uma das palavras mais usadas do inglês. Curtinha e essencial.')
];
AULAS['e5.3']=[
 P('Frutas','<b>apple</b> (maçã), <b>banana</b> (banana), <b>orange</b> (laranja), <b>grape</b> (uva).',ENS(EN('apple','maçã','épol'),EN('banana','banana','banâna'))),
 P('Uma ajuda de graça','<ol class="passos"><li><b>banana</b> se escreve igual em português!</li><li><b>orange</b> você já aprendeu como cor.</li><li>Palavras assim são presente: já vêm sabidas.</li></ol>'),
 P('Gostando das coisas','<b>I like apples.</b> = Eu gosto de maçãs. Repare: no plural, sem "de". <b>I don\'t like bananas.</b> = Eu não gosto de bananas.'),
 P('Pra não esquecer','I like / I don\'t like + coisa no plural. Com isso você já fala dos seus gostos.')
];
AULAS['e5.4']=[
 P('Doces','<b>cake</b> (bolo), <b>candy</b> (bala/doce), <b>chocolate</b> (chocolate), <b>ice cream</b> (sorvete).',ENS(EN('cake','bolo','quêik'),EN('ice cream','sorvete','áis crím'))),
 P('Ice cream é gelo + creme','<ol class="passos"><li><b>ice</b> = gelo.</li><li><b>cream</b> = creme.</li><li>Juntos: sorvete. O inglês descreve as coisas com palavras que já existem.</li></ol>'),
 P('No aniversário','Happy birthday! = Feliz aniversário! <b>birthday</b> também é colada: birth (nascimento) + day (dia).'),
 P('Pra não esquecer','Sempre que ver uma palavra grande, tente parti-la em duas. Funciona na maioria das vezes.')
];
AULAS['e5.5']=[
 P('As refeições','<b>breakfast</b> (café da manhã), <b>lunch</b> (almoço), <b>dinner</b> (jantar).',ENS(EN('breakfast','café da manhã','brékfâst'),EN('dinner','jantar','dínâr'))),
 P('Breakfast quebra o jejum','<ol class="passos"><li><b>break</b> = quebrar.</li><li><b>fast</b> aqui quer dizer jejum.</li><li>breakfast = quebrar o jejum da noite. Bonito, né?</li></ol>'),
 P('Falando da rotina','I have breakfast at seven. = Eu tomo café da manhã às sete. Em inglês usa-se <b>have</b> (ter) para as refeições, não "comer".'),
 P('Pra não esquecer','have breakfast, have lunch, have dinner. Um verbo só para as três refeições.')
];

AULAS['e6.1']=[
 P('Cabeça e mãos','<b>head</b> (cabeça), <b>hand</b> (mão), <b>arm</b> (braço), <b>leg</b> (perna), <b>foot</b> (pé).',ENS(EN('head','cabeça','réd'),EN('hand','mão','rénd'))),
 P('Plurais que mudam','<ol class="passos"><li>hand → hands (normal).</li><li><b>foot</b> → <b>feet</b> (pé → pés).</li><li><b>tooth</b> → <b>teeth</b> (dente → dentes).</li></ol>'),
 P('Uma música que ajuda','Existe uma canção famosa nas escolas americanas: <i>Head, shoulders, knees and toes</i>, cabeça, ombros, joelhos e dedos do pé. Cantar ajuda a decorar.'),
 P('Pra não esquecer','Aponte para a parte do corpo enquanto fala a palavra. O corpo aprende junto com a memória.')
];
AULAS['e6.2']=[
 P('O rosto','<b>eyes</b> (olhos), <b>nose</b> (nariz), <b>mouth</b> (boca), <b>ears</b> (orelhas), <b>hair</b> (cabelo).',ENS(EN('eyes','olhos','áis'),EN('mouth','boca','máuth'))),
 P('Descrevendo alguém','<ol class="passos"><li>She has blue eyes. = Ela tem olhos azuis.</li><li>He has brown hair. = Ele tem cabelo castanho.</li><li><b>has</b> = tem (para he/she/it).</li></ol>'),
 P('Have e has','Eu, você, nós e eles usam <b>have</b>. Ele, ela e "isso" usam <b>has</b>. É a única troca importante nesse verbo.'),
 P('Pra não esquecer','I have / you have / he has / she has. Repita essa sequência até sair sem pensar.')
];
AULAS['e6.3']=[
 P('Roupas básicas','<b>shirt</b> (camisa), <b>shoes</b> (sapatos), <b>pants</b> (calça), <b>socks</b> (meias).',ENS(EN('shirt','camisa','chârt'),EN('shoes','sapatos','chúz'))),
 P('Palavras que só existem no plural','<ol class="passos"><li><b>pants</b> = uma calça (mas sempre com S).</li><li><b>shoes</b>, <b>socks</b>: normalmente aos pares.</li><li>Para uma peça só: <b>a pair of shoes</b> = um par de sapatos.</li></ol>'),
 P('Nos EUA é diferente','Nos Estados Unidos, calça é <b>pants</b>. Na Inglaterra, pants quer dizer cueca! Estamos aprendendo o americano.'),
 P('Pra não esquecer','Junte com cor: <b>a blue shirt</b>, <b>black shoes</b>. Cor sempre antes da roupa.')
];
AULAS['e6.4']=[
 P('Mais roupas','<b>dress</b> (vestido), <b>hat</b> (chapéu), <b>coat</b> (casaco), <b>skirt</b> (saia).',ENS(EN('dress','vestido','drés'),EN('hat','chapéu','rét'))),
 P('Verbo wear','<ol class="passos"><li><b>wear</b> ("uér") = vestir, usar.</li><li>I wear a hat. = Eu uso um chapéu.</li><li>She is wearing a red dress. = Ela está usando um vestido vermelho.</li></ol>'),
 P('Roupa por estação','It\'s cold: wear a coat. (Está frio: use um casaco.) It\'s hot: wear a shirt. <b>cold</b> = frio, <b>hot</b> = quente.'),
 P('Pra não esquecer','wear serve para roupa, sapato, chapéu e até óculos. Um verbo para tudo que se veste.')
];
AULAS['e6.5']=[
 P('Se arrumando','<b>put on</b> (vestir), <b>take off</b> (tirar), <b>get dressed</b> (se vestir).',ENS(EN('put on','vestir','put ón'),EN('take off','tirar','têik óf'))),
 P('Verbos de duas palavras','<ol class="passos"><li>O inglês tem muitos verbos formados por duas palavras.</li><li><b>put</b> = colocar; <b>put on</b> = vestir.</li><li><b>take</b> = pegar; <b>take off</b> = tirar (e também decolar!).</li></ol>'),
 P('A rotina da manhã','<ol class="passos"><li><b>I get up.</b> = Eu levanto.</li><li><b>I get dressed.</b> = Eu me visto.</li><li><b>I have breakfast.</b> = Eu tomo café da manhã.</li><li><b>I go to school.</b> = Eu vou pra escola.</li></ol>'),
 P('Pra não esquecer','Esses verbos de duas palavras são muito usados na conversa do dia a dia. Vale aprender junto, como se fossem uma palavra só.')
];

AULAS['e7.1']=[
 P('Casa e porta','<b>house</b> (casa), <b>home</b> (lar), <b>door</b> (porta), <b>window</b> (janela).',ENS(EN('house','casa','ráus'),EN('door','porta','dór'))),
 P('House ou home?','<ol class="passos"><li><b>house</b> = o prédio, a construção.</li><li><b>home</b> = onde você mora, com sentido de aconchego.</li><li>"I\'m going home" = estou indo para casa.</li></ol>'),
 P('Preposições de lugar','<b>in</b> (dentro), <b>on</b> (em cima), <b>under</b> (embaixo). The cat is under the table. = O gato está embaixo da mesa.'),
 P('Pra não esquecer','in, on, under: três palavrinhas que resolvem quase toda descrição de lugar.')
];
AULAS['e7.2']=[
 P('Cômodos','<b>kitchen</b> (cozinha), <b>bedroom</b> (quarto), <b>bathroom</b> (banheiro), <b>living room</b> (sala).',ENS(EN('kitchen','cozinha','kítchen'),EN('bedroom','quarto','bédrum'))),
 P('Palavras coladas de novo','<ol class="passos"><li><b>bed</b> (cama) + <b>room</b> (cômodo) = bedroom, o cômodo da cama.</li><li><b>bath</b> (banho) + room = bathroom.</li><li><b>living</b> (viver) + room = a sala de estar.</li></ol>'),
 P('Onde você está','I am in the kitchen. = Eu estou na cozinha. <b>in the</b> + cômodo. Simples e sempre igual.'),
 P('Pra não esquecer','Sabendo <b>room</b>, você entende metade dos cômodos da casa sem decorar nada.')
];
AULAS['e7.3']=[
 P('Móveis','<b>table</b> (mesa), <b>chair</b> (cadeira), <b>bed</b> (cama), <b>sofa</b> (sofá).',ENS(EN('table','mesa','têibol'),EN('chair','cadeira','tchér'))),
 P('Descrevendo um cômodo','<ol class="passos"><li><b>There is a table in the kitchen.</b> (Há uma mesa na cozinha.)</li><li><b>There are four chairs.</b> (Há quatro cadeiras.)</li><li><b>The bed is in the bedroom.</b> (A cama está no quarto.)</li></ol>'),
 P('Cognatos de novo','<b>table</b> lembra "tábua"; <b>sofa</b> é quase igual a "sofá". Sempre que puder, ligue a palavra nova a uma parecida que você já conhece.'),
 P('Pra não esquecer','There is / There are + móvel + in the + cômodo. Uma fórmula, muitas frases.')
];
AULAS['e7.4']=[
 P('Fora de casa','<b>garden</b> (jardim/quintal), <b>yard</b> (quintal), <b>garage</b> (garagem), <b>roof</b> (telhado).',ENS(EN('garden','jardim','gárden'),EN('roof','telhado','rúf'))),
 P('Como falar da sua casa','<ol class="passos"><li>My house has three rooms. = Minha casa tem três cômodos.</li><li>There is a garden. = Há um jardim.</li><li>Junte tudo e você já descreve onde mora.</li></ol>'),
 P('Yard é palavra americana','Nos EUA fala-se <b>yard</b> para o quintal e <b>garden</b> quando tem plantas. Na Inglaterra usam garden para os dois.'),
 P('Pra não esquecer','Descrever a própria casa é um dos primeiros exercícios de qualquer curso de inglês. Tente fazer em voz alta.')
];
AULAS['e7.5']=[
 P('Chave e luz','<b>key</b> (chave), <b>light</b> (luz), <b>lamp</b> (lâmpada/luminária), <b>clock</b> (relógio de parede).',ENS(EN('key','chave','kí'),EN('light','luz','láit'))),
 P('O GH mudo','<ol class="passos"><li>Em <b>light</b>, o GH não é falado: "láit".</li><li>Igual em night ("náit"), right ("ráit"), eight ("eit").</li><li>Aprendeu um, aprendeu todos.</li></ol>'),
 P('Frases úteis','Turn on the light. = Acenda a luz. Turn off the light. = Apague a luz. <b>turn on/off</b> = ligar/desligar.'),
 P('Pra não esquecer','O Bobby precisa da <b>key</b> para abrir o castelo. Guarde essa palavra, ela vai aparecer bastante.')
];

AULAS['e8.1']=[
 P('Primeiros verbos','<b>run</b> (correr), <b>eat</b> (comer), <b>drink</b> (beber).',ENS(EN('run','correr','rân'),EN('eat','comer','ít'),EN('drink','beber','drink'))),
 P('Falando de você','<ol class="passos"><li><b>I run.</b> = Eu corro.</li><li><b>I eat bread.</b> = Eu como pão.</li><li><b>I drink water.</b> = Eu bebo água.</li></ol>'),
 P('A regra do S','Com he, she e it, o verbo ganha <b>S</b>: He runs. She eats. It drinks. Só nessas três pessoas, em todas as outras, o verbo fica igual.'),
 P('Pra não esquecer','I run / he runs. Essa é a diferença mais importante do presente em inglês.')
];
AULAS['e8.2']=[
 P('Dormir e brincar','<b>sleep</b> (dormir), <b>play</b> (brincar/jogar), <b>rest</b> (descansar).',ENS(EN('sleep','dormir','slíp'),EN('play','brincar','plêi'))),
 P('Play serve para muita coisa','<ol class="passos"><li>play soccer = jogar futebol</li><li>play the guitar = tocar violão</li><li>play with friends = brincar com amigos</li></ol>'),
 P('Agora mesmo','Para dizer que está acontecendo agora: <b>I am playing</b> = eu estou brincando. É o verbo <b>to be</b> + verbo com <b>-ing</b>.'),
 P('Pra não esquecer','-ing no fim do verbo quer dizer "está acontecendo agora". Você vai ver isso o tempo todo.')
];
AULAS['e8.3']=[
 P('Ler e escrever','<b>read</b> (ler), <b>write</b> (escrever), <b>listen</b> (ouvir), <b>speak</b> (falar).',ENS(EN('read','ler','ríd'),EN('write','escrever','ráit'))),
 P('Letras mudas','<ol class="passos"><li>Em <b>write</b>, o W não é falado: "ráit".</li><li>Em <b>listen</b>, o T não é falado: "lísen".</li><li>O inglês tem muitas letras que se escrevem mas não se falam.</li></ol>'),
 P('As quatro habilidades','Para aprender uma língua você precisa de read, write, listen e speak. Este app treina as quatro, inclusive ouvir, no botão do som.'),
 P('Pra não esquecer','Fale em voz alta sempre que puder. Ouvir a própria voz em inglês é o que destrava a conversa.')
];
AULAS['e8.4']=[
 P('Mais ações','<b>walk</b> (andar), <b>sing</b> (cantar), <b>jump</b> (pular), <b>dance</b> (dançar).',ENS(EN('walk','andar','uók'),EN('jump','pular','djâmp'))),
 P('Dando ordens','<ol class="passos"><li>Para mandar alguém fazer algo, use o verbo sozinho.</li><li><b>Jump!</b> = Pule! <b>Sing!</b> = Cante!</li><li>Com please fica educado: <b>Sit down, please.</b></li></ol>'),
 P('Um jogo americano','Crianças nos EUA brincam de <i>Simon says</i> (“Simon diz”): alguém fala <b>Simon says jump!</b> (“Simon diz: pule!”) e todo mundo pula. É assim que se aprende verbo brincando.'),
 P('Pra não esquecer','O verbo sozinho vira ordem ou convite. Sem conjugar nada, o inglês facilita nessa parte.')
];
AULAS['e8.5']=[
 P('Eu consigo, eu gosto','<b>I can</b> = eu consigo/eu sei. <b>I like</b> = eu gosto.',ENS(EN('I can','eu consigo','ái kén'),EN('I like','eu gosto','ái láik'))),
 P('Como montar','<ol class="passos"><li><b>I can swim.</b> = Eu sei nadar.</li><li><b>I like to read.</b> = Eu gosto de ler.</li><li>Depois de <b>can</b> (conseguir), o verbo vem puro: <b>can swim</b> (sabe nadar), nunca “can to swim”.</li></ol>'),
 P('Negando','I <b>can\'t</b> swim = eu não sei nadar. I <b>don\'t</b> like fish = eu não gosto de peixe. <b>can\'t</b> e <b>don\'t</b> são as duas negações mais usadas.'),
 P('Pra não esquecer','Com <b>I can</b> (eu consigo), <b>I like</b> (eu gosto) e <b>I don\'t like</b> (eu não gosto) você já fala sobre si mesmo, que é o assunto de toda primeira conversa.')
];

AULAS['e9.1']=[
 P('O que e onde','<b>what</b> = o quê. <b>where</b> = onde. As duas perguntas mais úteis do inglês.',ENS(EN('what','o quê','uót'),EN('where','onde','uér'))),
 P('Perguntas prontas','<ol class="passos"><li><b>What is this?</b> = O que é isto?</li><li><b>Where is the key?</b> = Onde está a chave?</li><li><b>What\'s your name?</b> = Qual é o seu nome?</li></ol>'),
 P('A palavra da pergunta vem primeiro','Em inglês, a pergunta sempre começa pela palavra interrogativa: What..., Where..., Who... Nunca no meio da frase.'),
 P('Pra não esquecer','What + is + coisa. Where + is + coisa. Duas fórmulas que abrem centenas de perguntas.')
];
AULAS['e9.2']=[
 P('Quem e quando','<b>who</b> = quem. <b>when</b> = quando.',ENS(EN('who','quem','rú'),EN('when','quando','uén'))),
 P('Perguntando','<ol class="passos"><li><b>Who is that?</b> = Quem é aquele?</li><li><b>When is your birthday?</b> = Quando é seu aniversário?</li><li><b>Why?</b> = Por quê? <b>Because...</b> = Porque...</li></ol>'),
 P('A família WH','what, where, who, when, why, which, how, quase todas começam com WH. Os americanos chamam de <i>wh- questions</i>.'),
 P('Pra não esquecer','Decore a família WH e você tem a chave de qualquer conversa: dá para perguntar tudo.')
];
AULAS['e9.3']=[
 P('Quantos','<b>How many</b> = quantos (para coisas que se contam). <b>How much</b> = quanto (para o que não se conta, e para preço).',ENS(EN('how many','quantos','ráu méni'),EN('how much','quanto','ráu mâtch'))),
 P('Escolhendo entre os dois','<ol class="passos"><li>Dá para contar? use <b>many</b>: How many books?</li><li>Não dá para contar? use <b>much</b>: How much water?</li><li>Preço: <b>How much is it?</b> = Quanto custa?</li></ol>'),
 P('Respondendo','How many cats? <b>Three cats.</b> Basta o número. Não precisa repetir a frase inteira.'),
 P('Pra não esquecer','many para contáveis, much para não contáveis. É a mesma lógica de "some" que você já viu.')
];
AULAS['e9.4']=[
 P('Como você está','<b>How are you?</b> = Como você está? É a pergunta mais comum de todas nos Estados Unidos.',ENS(EN('how are you?','como vai?','ráu ár iú'),EN('I\'m fine','estou bem','áim fáin'))),
 P('A conversa completa','<ol class="passos"><li><b>Hi! How are you?</b> (Oi! Como você está?)</li><li><b>I\'m fine, thank you. And you?</b> (Estou bem, obrigado. E você?)</li><li><b>I\'m good, thanks!</b> (Estou bem, valeu!)</li></ol>'),
 P('Não é bem uma pergunta','Nos EUA, <b>How are you?</b> (Como você está?) funciona quase como um “oi”. Ninguém espera uma resposta longa, responda <b>fine, thanks</b> (bem, obrigado) e siga a conversa.'),
 P('Pra não esquecer','<b>Hi</b> (oi) → <b>How are you?</b> (como você está?) → <b>I\'m fine, thank you. And you?</b> (estou bem, obrigado. E você?). Esse é o roteiro de qualquer encontro.')
];
AULAS['e9.5']=[
 P('Quantos anos você tem','<b>How old are you?</b> = Quantos anos você tem? Responda: <b>I am eight years old.</b> = Eu tenho oito anos.',ENS(EN('how old are you?','quantos anos?','ráu ould ár iú'),EN('I am 8 years old','tenho 8 anos','ái ém eit íârs ould'))),
 P('Cuidado com a tradução','<ol class="passos"><li>Em português: eu <b>tenho</b> 8 anos.</li><li>Em inglês: eu <b>sou</b> 8 anos velho (I am 8 years old).</li><li>Traduzir palavra por palavra dá errado, aprenda a frase inteira.</li></ol>'),
 P('Frases feitas','Muitas coisas em inglês são assim: blocos prontos. <b>I\'m hungry</b> (estou com fome) também usa "I am", não "I have".'),
 P('Pra não esquecer','Guarde a frase inteira, não palavra por palavra. É assim que se fala rápido e certo.')
];

AULAS['e10.1']=[
 P('Os dias no tempo','<b>yesterday</b> (ontem), <b>today</b> (hoje), <b>tomorrow</b> (amanhã).',ENS(EN('yesterday','ontem','iéstârdei'),EN('tomorrow','amanhã','tumórou'))),
 P('O passado em -ed','<ol class="passos"><li>Hoje: I play. Ontem: I play<b>ed</b>.</li><li>Hoje: I walk. Ontem: I walk<b>ed</b>.</li><li>A maioria dos verbos ganha <b>-ed</b> no passado.</li></ol>'),
 P('Os irregulares mais usados','Alguns mudam por completo: go → <b>went</b>, eat → <b>ate</b>, see → <b>saw</b>, have → <b>had</b>. São poucos, mas são os mais falados.'),
 P('Pra não esquecer','-ed é a regra; os irregulares se aprendem no uso. Comece pelos quatro acima.')
];
AULAS['e10.2']=[
 P('Frases do dia a dia','Essas frases prontas resolvem quase qualquer situação: <b>Excuse me</b> (com licença), <b>I\'m sorry</b> (desculpa), <b>I don\'t understand</b> (não entendi).',ENS(EN('excuse me','com licença','ikskiúz mi'),EN('I\'m sorry','desculpa','áim sóri'))),
 P('Quando usar cada uma','<ol class="passos"><li><b>Excuse me</b>: para chamar alguém ou passar.</li><li><b>I\'m sorry</b>: para pedir desculpa de verdade.</li><li><b>I don\'t understand</b>: quando não entendeu. Não tenha vergonha!</li></ol>'),
 P('Pedindo para repetir','<b>Can you say that again, please?</b> = Pode repetir, por favor? Essa frase salva qualquer conversa.'),
 P('Pra não esquecer','Quem está aprendendo precisa dessas frases mais do que de vocabulário. Elas mantêm a conversa viva.')
];
AULAS['e10.3']=[
 P('Pedir e agradecer','<b>Can I have...?</b> (posso ter...?), <b>Could you help me?</b> (você pode me ajudar?), <b>Thank you so much</b> (muito obrigado).',ENS(EN('can I have...?','posso ter...?','kén ái rév'),EN('thank you so much','muito obrigado','tênk iú sou mâtch'))),
 P('Educação em inglês','<ol class="passos"><li>Sempre termine o pedido com <b>please</b>.</li><li><b>Could</b> é mais educado que <b>can</b>.</li><li>Depois de receber, <b>thank you</b>: sempre.</li></ol>'),
 P('Nos EUA isso importa muito','A cultura americana valoriza bastante please e thank you. Usar as duas faz você soar simpático mesmo com pouco vocabulário.'),
 P('Pra não esquecer','Could you + verbo + please? É a fórmula mais educada de todas.')
];
AULAS['e10.4']=[
 P('Palavras iguais e falsas','Muitas palavras se parecem com o português e querem dizer a mesma coisa (<b>cognatos</b>): hospital, animal, family, important. Outras enganam!',ENS(EN('important','importante','impórtant'),EN('actually','na verdade','ékchuali'))),
 P('Os falsos amigos','<ol class="passos"><li><b>actually</b> NÃO é atualmente, é "na verdade".</li><li><b>pretend</b> NÃO é pretender, é "fingir".</li><li><b>push</b> NÃO é puxar, é <b>empurrar</b>!</li><li><b>parents</b> NÃO é parentes, é "pais".</li></ol>'),
 P('Como não cair na armadilha','Quando uma palavra parecida aparecer numa frase que não faz sentido, desconfie: pode ser um falso amigo. Conferir vale mais que adivinhar.'),
 P('Pra não esquecer','Cognatos ajudam muito, mas os falsos amigos são poucos e famosos. Aprenda os quatro acima e você já evita os erros mais comuns.')
];
AULAS['e10.5']=[
 P('Final challenge','Aqui vem tudo: cumprimentos, cores, família, animais, comida, corpo, casa, ações, perguntas e frases do dia a dia.'),
 P('O que você já consegue fazer','<ol class="passos"><li>Cumprimentar e se apresentar.</li><li>Descrever pessoas, coisas e lugares.</li><li>Pedir, agradecer e pedir ajuda.</li><li>Perguntar e responder sobre você.</li></ol>'),
 P('O segredo daqui pra frente','Ouça músicas e desenhos em inglês, mesmo sem entender tudo. Seu ouvido vai pegando o ritmo antes da sua cabeça entender as palavras.'),
 P('Pra não esquecer','You did it! Você saiu do zero e já conversa em inglês. Congratulations!')
];

