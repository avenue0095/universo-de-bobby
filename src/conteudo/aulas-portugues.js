/* ===== Aulas passo a passo — Galáxia do Português (pt-BR) ===== */
const TIRA=(arr,cls)=>'<div class="tira '+(cls||'')+'">'+arr.map(x=>'<span>'+x+'</span>').join('')+'</div>';
const SIL=(...p)=>'<div class="tira sil">'+p.map(x=>'<span>'+x+'</span>').join('<i>+</i>')+'</div>';
const DUO=(a,b)=>'<div class="duo"><div><b>'+a[0]+'</b><span>'+a[1]+'</span></div><div><b>'+b[0]+'</b><span>'+b[1]+'</span></div></div>';

AULAS['p1.1']=[
 P('As cinco vogais','Todas as letras se dividem em dois times. O time pequeno, com só cinco jogadoras, é o das <b>vogais</b>: A, E, I, O, U. Elas são especiais porque a gente consegue cantar cada uma sozinha, sem precisar de nenhuma outra letra.',TIRA(['A','E','I','O','U'])),
 P('Toda palavra tem vogal','Experimente: BOLA, CASA, PÉ, URSO. Não existe palavra em português sem pelo menos uma vogal. Elas são o ar da palavra, sem elas a boca trava.'),
 P('Vamos achar as vogais','<ol class="passos"><li>Olhe a palavra <b>CASA</b>.</li><li>Passe o dedo letra por letra: C, A, S, A.</li><li>Marque as que estão no time das vogais: o primeiro <b>A</b> e o último <b>A</b>.</li><li>CASA tem 2 vogais.</li></ol>'),
 P('Pra não esquecer','Cante A-E-I-O-U olhando no espelho: a boca muda de formato em cada uma. É esse formato diferente que ajuda o Bobby a reconhecer cada vogal.')
];
AULAS['p1.2']=[
 P('O alfabeto é uma fila','O alfabeto é a fila oficial das 26 letras. Ela nunca muda de ordem, é sempre A, B, C, D... até o Z. Saber essa fila é como saber a ordem dos números.',TIRA(['A','B','C','D','E','F'])),
 P('As outras letras','Fora as cinco vogais, todas as outras são <b>consoantes</b>: B, C, D, F, G... Elas não cantam sozinhas, precisam sempre de uma vogal do lado. Tente falar só "B" sai "bê", com um E escondido.'),
 P('Achando a letra na fila','<ol class="passos"><li>Quer saber que letra vem depois do <b>F</b>?</li><li>Cante do começo: A, B, C, D, E, F...</li><li>A próxima é o <b>G</b>.</li><li>Com o tempo você para de cantar do início e já sabe direto.</li></ol>'),
 P('Pra não esquecer','O alfabeto tem 26 letras: 5 vogais e 21 consoantes. Ele é a base de tudo: do dicionário à lista de chamada da escola.')
];
AULAS['p1.3']=[
 P('Duas roupas para a mesma letra','Cada letra tem duas formas de se vestir: a <b>maiúscula</b> (grande, do tamanho da casa) e a <b>minúscula</b> (pequena). São a mesma letra, com o mesmo som, só o tamanho muda.',TIRA(['A a','B b','C c','D d'])),
 P('Quando usar a maiúscula','Usa-se maiúscula em três casos fáceis de lembrar: no <b>começo da frase</b>, em <b>nomes de pessoas</b> (Bobby, Lívia) e em <b>nomes de lugares</b> (Brasil, São Paulo).'),
 P('Vendo na prática','<ol class="passos"><li>Frase: <b>Bobby correu no parque.</b></li><li>O <b>B</b> é maiúsculo porque é nome de alguém E é o começo da frase.</li><li>"correu", "no" e "parque" ficam minúsculos.</li><li>No fim vem o ponto.</li></ol>'),
 P('Pra não esquecer','Maiúscula não é enfeite: ela avisa o leitor que ali começa algo importante, uma frase nova ou um nome.')
];
AULAS['p1.4']=[
 P('O som do começo','Toda palavra começa com um som. Se você fala <b>BOLA</b> bem devagar, o primeiro pedacinho que sai da boca é o "bê". Por isso ela começa com a letra <b>B</b>.'),
 P('Fale devagar e escute','<ol class="passos"><li>Pense na palavra <b>MACACO</b>.</li><li>Fale bem devagar: <b>Mmm</b>-a-ca-co.</li><li>O primeiro som é "mmm".</li><li>Que letra faz "mmm"? O <b>M</b>. Então MACACO começa com M.</li></ol>'),
 P('Cuidado com as pegadinhas','Escutar é melhor que adivinhar. HOJE começa com H, mas o H é mudo, não faz som nenhum. Nessas horas, vale lembrar a escrita da palavra.'),
 P('Pra não esquecer','Primeiro escute o som, depois procure a letra. Esse é o caminho que todo mundo faz quando aprende a ler.')
];
AULAS['p1.5']=[
 P('Por que ordenar?','Imagine procurar uma palavra num dicionário com 70 mil palavras bagunçadas. Impossível! Por isso tudo fica em <b>ordem alfabética</b>: a ordem da fila das letras.'),
 P('Ordenando três palavras','<ol class="passos"><li>Palavras: CASA, ABELHA, BOLA.</li><li>Olhe só a <b>primeira letra</b>: C, A, B.</li><li>Coloque na ordem do alfabeto: A, B, C.</li><li>Resultado: <b>ABELHA, BOLA, CASA</b>.</li></ol>'),
 P('E se empatar?','Se duas palavras começam com a mesma letra, olhe a <b>segunda</b>. CASA e CAVALO: as duas têm CA, mas depois vem S e V. O S vem antes do V, então CASA vem primeiro.'),
 P('Pra não esquecer','Ordem alfabética é usada na lista de chamada, na agenda do celular e na lista de produtos do mercado. É um superpoder de organização.')
];

AULAS['p2.1']=[
 P('Sílaba é uma batida','Sílaba é cada pedacinho da palavra que sai numa só batida de voz. Bata palma enquanto fala <b>BO-LA</b>: duas palmas, duas sílabas.',SIL('BO','LA')),
 P('Batendo palmas','<ol class="passos"><li>Fale <b>CA-VA-LO</b> batendo uma palma por pedaço.</li><li>Contou 3 palmas? São <b>3 sílabas</b>.</li><li>Agora <b>PÃO</b>: só 1 palma, 1 sílaba.</li></ol>'),
 P('Cada sílaba tem vogal','Repare: BO tem O, LA tem A. <b>Toda sílaba tem pelo menos uma vogal.</b> É a vogal que abre a boca e deixa o som sair.'),
 P('Pra não esquecer','Ler ficou difícil? Quebre a palavra em sílabas e leia uma de cada vez. Ninguém precisa ler a palavra inteira de uma vez só.')
];
AULAS['p2.2']=[
 P('Consoante + vogal','A receita mais comum de sílaba é <b>uma consoante + uma vogal</b>. Pegue o B e passeie por todas as vogais: BA, BE, BI, BO, BU.',TIRA(['BA','BE','BI','BO','BU'])),
 P('A mesma receita com C e D','Com o C: CA, CE, CI, CO, CU. Com o D: DA, DE, DI, DO, DU. A consoante é a mesma; quem muda o som é a vogal que vem depois.'),
 P('Montando palavras','<ol class="passos"><li>Junte <b>BO</b> + <b>CA</b>.</li><li>Leia colado: BOCA.</li><li>Troque a primeira sílaba por <b>DE</b>: DECA? Não existe.</li><li>Nem toda junção vira palavra, mas todas se leem igual.</li></ol>'),
 P('Pra não esquecer','Aprendendo a família de uma consoante (BA-BE-BI-BO-BU), você já consegue ler qualquer palavra que tenha essas sílabas.')
];
AULAS['p2.3']=[
 P('Mais famílias de sílabas','Agora as famílias do F, G, L e M: FA-FE-FI-FO-FU, GA-GUE-GUI-GO-GU, LA-LE-LI-LO-LU, MA-ME-MI-MO-MU.',TIRA(['FA','LA','MA','GA'])),
 P('O M é fácil de sentir','Coloque a mão nos lábios e fale MA. Os lábios se fecham antes do som sair. É por isso que MAMÃE é uma das primeiras palavras que todo bebê fala.'),
 P('Lendo com as famílias','<ol class="passos"><li>Palavra nova: <b>FOLHA</b>.</li><li>Quebre: FO-LHA.</li><li>FO você já conhece da família do F.</li><li>Leia devagar e junte: FOLHA.</li></ol>'),
 P('Pra não esquecer','Quanto mais famílias você souber de cor, mais rápido lê. É treino, igual a decorar a tabuada.')
];
AULAS['p2.4']=[
 P('As últimas famílias','Faltam N, P, R, T e V: NA-NE-NI-NO-NU, PA-PE-PI-PO-PU, RA-RE-RI-RO-RU, TA-TE-TI-TO-TU, VA-VE-VI-VO-VU.',TIRA(['NA','PA','RA','TA','VA'])),
 P('N e M parecem, mas não são','MA fecha os lábios; NA deixa os lábios abertos e encosta a língua nos dentes. Fale MA-NA-MA-NA e sinta a diferença dentro da boca.'),
 P('Palavras para treinar','<ol class="passos"><li><b>PA-TO</b>: duas famílias novas juntas.</li><li><b>VI-DA</b>: V com I, D com A.</li><li><b>TE-SOU-RA</b>: três batidas.</li></ol>'),
 P('Pra não esquecer','Com essas famílias você já lê a maioria das palavras simples do português. As próximas fases só adicionam sons especiais.')
];
AULAS['p2.5']=[
 P('Sílabas viram palavras','Sílaba sozinha quase nunca quer dizer nada. Junte duas e nasce uma palavra: <b>CA</b> + <b>SA</b> = CASA.',SIL('CA','SA')),
 P('Trocando uma sílaba','<ol class="passos"><li>Comece com <b>MALA</b>.</li><li>Troque a primeira sílaba por BO: <b>BOLA</b>.</li><li>Troque de novo por CO: <b>COLA</b>.</li><li>Uma sílaba muda tudo!</li></ol>'),
 P('Ordem importa','CASA e SACA têm exatamente as mesmas sílabas, mas em ordem diferente, e viram palavras diferentes. Na leitura, a ordem manda.'),
 P('Pra não esquecer','Ler é juntar sílabas. Escrever é o contrário: falar devagar, ouvir cada batida e escrever a sílaba que você ouviu.')
];

AULAS['p3.1']=[
 P('Palavras de duas batidas','A maior parte das palavras do dia a dia tem duas sílabas: BO-LO, GA-TO, SA-PO, ME-SA. São as mais fáceis de ler e de escrever.',SIL('GA','TO')),
 P('Escrevendo pelo som','<ol class="passos"><li>Você quer escrever <b>SAPO</b>.</li><li>Fale devagar: <b>SA</b>... <b>PO</b>.</li><li>Escreva a primeira batida: SA.</li><li>Escreva a segunda: PO. Pronto: SAPO.</li></ol>'),
 P('Conferindo o que escreveu','Depois de escrever, leia em voz alta o que está no papel. Se soar igual ao que você queria dizer, acertou. Se soar estranho, falta ou sobra alguma letra.'),
 P('Pra não esquecer','Falar devagar é a ferramenta número um de quem está aprendendo a escrever. Nada de pressa.')
];
AULAS['p3.2']=[
 P('Três batidas','Palavras um pouco maiores têm três sílabas: CA-VA-LO, BO-NE-CA, SA-PA-TO, JA-NE-LA.',SIL('CA','VA','LO')),
 P('Não pule o miolo','O erro mais comum é comer a sílaba do meio e escrever CAVLO. Por isso batemos palma: cada palma é uma sílaba que precisa aparecer no papel.'),
 P('Passo a passo com BONECA','<ol class="passos"><li>Bata palma: BO (1) NE (2) CA (3).</li><li>Escreva uma sílaba para cada palma.</li><li>Leia de volta: BO-NE-CA. Bateu certo!</li></ol>'),
 P('Pra não esquecer','Conte as palmas antes de escrever e conte as sílabas depois de escrever. Se os dois números baterem, a palavra está inteira.')
];
AULAS['p3.3']=[
 P('Palavra com buraco','Às vezes falta um pedaço: CA__LO. Descobrir a sílaba que falta é como completar uma peça de quebra-cabeça.'),
 P('Como descobrir','<ol class="passos"><li>Leia o que tem: CA ... LO.</li><li>Pense em palavras que começam com CA e terminam com LO.</li><li>Teste no ouvido: CA-VA-LO. Faz sentido!</li><li>A sílaba que faltava era <b>VA</b>.</li></ol>'),
 P('Testar é permitido','Coloque a sílaba, leia a palavra inteira em voz alta e veja se existe mesmo. CA-MA-LO não existe; CA-VA-LO existe. O ouvido é o seu juiz.'),
 P('Pra não esquecer','Sempre releia a palavra completa depois de preencher. Metade dos erros aparece nessa releitura.')
];
AULAS['p3.4']=[
 P('Letras embaralhadas','As letras da palavra saíram da fila: A-S-C-A. Sua missão é colocá-las de volta na ordem certa para formar CASA.'),
 P('A estratégia','<ol class="passos"><li>Procure as <b>vogais</b>: A, A.</li><li>Toda sílaba precisa de uma; então a palavra tem umas 2 sílabas.</li><li>Teste juntar consoante + vogal: CA... SA...</li><li>CASA! Leia para conferir.</li></ol>'),
 P('Comece pelo som que você conhece','Se ver as letras P, O, A, S, pense em sílabas conhecidas: PO, SA, PA, SO. Monte com elas e teste: SA-PO. Achou.'),
 P('Pra não esquecer','Embaralhar letras treina você a enxergar sílabas dentro da palavra, exatamente o que o cérebro faz ao ler rápido.')
];
AULAS['p3.5']=[
 P('Uma letra muda tudo','FACA e VACA diferem só na primeira letra, mas uma corta pão e a outra dá leite. Ler com atenção às letras evita confusão.',DUO(['FACA','corta'],['VACA','dá leite'])),
 P('Pares que confundem','<ol class="passos"><li>MALA e MALHA</li><li>BOLA e BOLO</li><li>PATO e PRATO</li><li>Leia cada par em voz alta e ache a letra diferente.</li></ol>'),
 P('Devagar no comecinho e no fim','As diferenças costumam estar na primeira ou na última letra. Passe o dedo por baixo da palavra enquanto lê, sem pular nada.'),
 P('Pra não esquecer','Boa leitura não é leitura rápida, é leitura certa. A velocidade vem sozinha depois.')
];

AULAS['p4.1']=[
 P('O C tem dois sons','O C muda de som conforme a vogal que vem depois. Com A, O e U ele fica <b>duro</b>: CA, CO, CU (casa, copo, cuca). Com E e I ele fica <b>fino</b>: CE, CI (cebola, cinco).',DUO(['CA CO CU','som de K'],['CE CI','som de S'])),
 P('Por que isso acontece?','É uma regra antiga da língua, e vale sempre. Não existe exceção: se você vê CE ou CI, o som é de S.'),
 P('Testando','<ol class="passos"><li>CASA: depois do C vem A → som duro, "kaza".</li><li>CEBOLA: depois do C vem E → som fino, "sebola".</li><li>CINCO tem os dois: CI (fino) e CO (duro).</li></ol>'),
 P('Pra não esquecer','Olhe sempre a vogal seguinte antes de decidir o som do C. Ela é quem manda.')
];
AULAS['p4.2']=[
 P('O R forte e o R fraco','No começo da palavra, o R é <b>forte</b>: RATO, RIO, ROSA. No meio, entre duas vogais, ele fica <b>fraco</b>: CARA, ARARA, PERA.'),
 P('Quando usar RR','<ol class="passos"><li>Quer o som forte no <b>meio</b> da palavra?</li><li>Aí precisa de dois erres: CA<b>RR</b>O, TE<b>RR</b>A, FE<b>RR</b>O.</li><li>Com um R só, o som fica fraco: CARO é diferente de CARRO.</li></ol>',DUO(['CARO','preço alto'],['CARRO','veículo'])),
 P('Nunca no começo','Não existe palavra começando com RR. No começo, um R sozinho já tem som forte, não precisa de reforço.'),
 P('Pra não esquecer','Som forte no meio da palavra = RR. Som fraco no meio = R sozinho. No começo, sempre um R só.')
];
AULAS['p4.3']=[
 P('O S também tem dois sons','No começo da palavra o S é sempre S: SAPO, SOL. Mas entre duas vogais ele vira som de Z: CASA (fala-se "caza"), MESA ("meza").'),
 P('Quando dobrar o S','<ol class="passos"><li>Quer som de S no meio da palavra?</li><li>Use <b>SS</b>: PÁSSARO, MASSA, PESSOA.</li><li>Com um S só, viraria "pázaro" errado.</li></ol>'),
 P('Comparando','MASSA (comida) e MASA não existe; CASA tem som de Z; PASSO tem som de S. Fale em voz alta e escute onde a garganta vibra: no Z ela vibra mais.'),
 P('Pra não esquecer','SS só existe entre vogais. Nunca no começo nem no fim da palavra.')
];
AULAS['p4.4']=[
 P('Duas letras, um som só','Existem duplas que fazem um som novo, diferente das letras separadas: <b>CH</b>, <b>LH</b> e <b>NH</b>.',TIRA(['CHA','LHA','NHA'])),
 P('Uma a uma','<ol class="passos"><li><b>CH</b> como em CHAVE, CHUVA, som de "x".</li><li><b>LH</b> como em FILHO, MOLHO, a língua toca o céu da boca.</li><li><b>NH</b> como em NINHO, BANHO, o som sai pelo nariz.</li></ol>'),
 P('Não separe na hora de dividir','Ao dividir em sílabas, essas duplas andam juntas: FI-LHO, NI-NHO, CHA-VE. Nunca FIL-HO.'),
 P('Pra não esquecer','CH, LH e NH são times inseparáveis: duas letras que sempre trabalham como uma só.')
];
AULAS['p4.5']=[
 P('A regra do M','Antes das letras <b>P</b> e <b>B</b>, escreve-se sempre <b>M</b>: caMPo, teMPo, boMBa, taMBém. Antes de qualquer outra letra, é N: caNto, poNte.'),
 P('Por que existe essa regra?','Porque P e B são feitos fechando os lábios, e o M também. A boca já está na posição certa, então a língua escolhe o M naturalmente. Fale "campo" e sinta os lábios se fecharem.'),
 P('Aplicando','<ol class="passos"><li>Palavra: CA_PO (lugar de plantar).</li><li>A próxima letra é <b>P</b>.</li><li>Antes de P vai M → CAMPO.</li></ol>'),
 P('Pra não esquecer','M antes de P e B. Essa é uma das poucas regras do português que não tem exceção, pode confiar.')
];

AULAS['p5.1']=[
 P('Frase é uma ideia completa','"O gato" não é uma frase, falta saber o que ele fez. "O gato dormiu" é uma frase, porque agora a ideia está completa: alguém e o que aconteceu.'),
 P('O teste da pergunta','<ol class="passos"><li>Leia o que está escrito.</li><li>Pergunte: <b>eu entendi o que aconteceu?</b></li><li>Se sim, é frase. Se ficou faltando algo, não é.</li></ol>'),
 P('Frases curtas também valem','"Choveu." é uma frase completa com uma palavra só, porque diz o que aconteceu. Tamanho não é o que decide, sentido é.'),
 P('Pra não esquecer','Frase = ideia inteira. Se quem lê fica esperando o resto, ainda não é frase.')
];
AULAS['p5.2']=[
 P('As roupas da frase','Toda frase se veste igual: começa com <b>letra maiúscula</b> e termina com <b>ponto final</b>. É a moldura que mostra onde ela começa e acaba.'),
 P('Arrumando uma frase','<ol class="passos"><li>Escrito: <i>bobby achou a chave</i></li><li>Coloque maiúscula no começo: <b>B</b>obby.</li><li>Coloque o ponto no fim: chave<b>.</b></li><li>Fica: Bobby achou a chave.</li></ol>'),
 P('Por que isso ajuda?','Sem ponto, tudo vira uma frase gigante e quem lê se perde. O ponto é o lugar de respirar.'),
 P('Pra não esquecer','Maiúscula abre, ponto fecha. Confira sempre esses dois antes de entregar o que escreveu.')
];
AULAS['p5.3']=[
 P('A ordem conta a história','"O Bobby comeu o mel" e "O mel comeu o Bobby" têm as mesmas palavras, mas contam coisas bem diferentes. A ordem diz quem fez e quem recebeu.'),
 P('A ordem mais comum','<ol class="passos"><li>Primeiro: <b>quem</b> faz (o Bobby).</li><li>Depois: <b>o que faz</b> (comeu).</li><li>Por último: <b>o quê / onde</b> (o mel).</li></ol>'),
 P('Montando frases embaralhadas','Se as palavras vierem fora de ordem, "mel / o / comeu / Bobby / o" procure primeiro quem faz a ação, depois a ação, depois o resto.'),
 P('Pra não esquecer','Leia a frase montada em voz alta. Se soar esquisita, provavelmente a ordem está trocada.')
];
AULAS['p5.4']=[
 P('Outros dois pontos finais','Nem toda frase termina com ponto. Se for <b>pergunta</b>, termina com <b>?</b>. Se for <b>susto ou emoção</b>, termina com <b>!</b>.',DUO(['?','pergunta'],['!','emoção'])),
 P('Como escolher','<ol class="passos"><li>Estou perguntando algo? → <b>?</b> (Onde está o Bobby?)</li><li>Estou gritando, comemorando, assustado? → <b>!</b> (Que legal!)</li><li>Só contando um fato? → <b>.</b> (O Bobby chegou.)</li></ol>'),
 P('Mudar o sinal muda a voz','"Você achou" é uma constatação. "Você achou?" é uma dúvida. "Você achou!" é uma comemoração. A mesma palavra, três sentidos.'),
 P('Pra não esquecer','O sinal do fim ensina o leitor a fazer a voz certa. É o tom de voz escrito no papel.')
];
AULAS['p5.5']=[
 P('Colando duas frases','"Bobby correu." + "Bobby caiu." podem virar uma frase só: "Bobby correu <b>e</b> caiu." A palavrinha que cola chama-se conectivo.'),
 P('Os três colas mais úteis','<ol class="passos"><li><b>e</b> = junta coisas que combinam: Ele correu e caiu.</li><li><b>mas</b> = mostra surpresa ou oposição: Ele correu, mas não caiu.</li><li><b>porque</b> = explica o motivo: Ele caiu porque correu demais.</li></ol>'),
 P('Não repita o nome','Ao juntar, tire o que se repete: "Bobby correu e Bobby caiu" fica melhor como "Bobby correu e caiu".'),
 P('Pra não esquecer','Frases coladas deixam o texto mais bonito de ler. Mas cuidado: colar demais cansa. Duas ou três ideias por frase basta.')
];

AULAS['p6.1']=[
 P('Substantivo é nome de coisa','Substantivo é a palavra que dá nome: nome de coisa (mesa), de pessoa (Lívia), de animal (gato), de lugar (praia) e até de sentimento (medo).'),
 P('O teste do artigo','<ol class="passos"><li>Coloque <b>o</b> ou <b>a</b> na frente da palavra.</li><li>"a mesa" → funciona → é substantivo.</li><li>"o correu" → não funciona → não é substantivo.</li></ol>'),
 P('Achando numa frase','Na frase "O gato subiu na árvore", os substantivos são <b>gato</b> e <b>árvore</b>: as duas coisas que existem ali.'),
 P('Pra não esquecer','Se dá para apontar ou imaginar, quase sempre é substantivo. É a palavra que nomeia o mundo.')
];
AULAS['p6.2']=[
 P('Os artigos','O, A, OS, AS são <b>artigos</b>: palavrinhas que vêm antes do substantivo e avisam duas coisas, se é masculino ou feminino, e se é um ou vários.',TIRA(['o','a','os','as'])),
 P('A tabelinha','<ol class="passos"><li><b>o</b> = masculino, um: o gato</li><li><b>a</b> = feminino, uma: a gata</li><li><b>os</b> = masculino, vários: os gatos</li><li><b>as</b> = feminino, várias: as gatas</li></ol>'),
 P('Tudo tem que combinar','Não se diz "o casa" nem "as menino". O artigo, o substantivo e o resto da frase precisam concordar.'),
 P('Pra não esquecer','Na dúvida sobre o gênero da palavra, teste com o e a e veja qual soa natural: "a mesa" soa certo, "o mesa" soa errado.')
];
AULAS['p6.3']=[
 P('Um ou muitos','<b>Singular</b> é um só. <b>Plural</b> é mais de um. Na escrita, o plural quase sempre ganha um <b>S</b> no fim: gato → gatos.',DUO(['gato','1'],['gatos','vários'])),
 P('Casos especiais','<ol class="passos"><li>Termina em <b>M</b>? troca por NS: homem → home<b>ns</b>.</li><li>Termina em <b>L</b>? vira IS: papel → pape<b>is</b>.</li><li>Termina em <b>ÃO</b>? costuma virar ÕES: leão → le<b>ões</b>.</li></ol>'),
 P('O resto da frase acompanha','Se o substantivo vai para o plural, o artigo e o adjetivo vão junto: "a flor bonita" → "<b>as</b> flor<b>es</b> bonit<b>as</b>".'),
 P('Pra não esquecer','Plural não é só a palavra principal: é a frase inteira combinando.')
];
AULAS['p6.4']=[
 P('Masculino e feminino','Palavras masculinas aceitam <b>o</b>; femininas aceitam <b>a</b>. Muitas vezes basta trocar a letra do fim: menino → menina, gato → gata.'),
 P('Nem tudo segue a regra','<ol class="passos"><li>Alguns pares mudam a palavra inteira: homem/mulher, boi/vaca.</li><li>Outros nem mudam: o estudante / a estudante.</li><li>E objetos também têm gênero: <b>a</b> mesa, <b>o</b> livro.</li></ol>'),
 P('Objeto não tem sexo','A mesa não é menina, só a palavra é feminina. Isso é uma característica da língua, não do objeto.'),
 P('Pra não esquecer','O artigo é a pista mais rápida do gênero. Quando aprender uma palavra nova, aprenda junto com o o ou a.')
];
AULAS['p6.5']=[
 P('Nome próprio','Nome próprio é o nome particular de alguém ou de algum lugar: <b>Bobby</b>, <b>Lívia</b>, <b>Brasil</b>, <b>Rio de Janeiro</b>. Ele sempre começa com letra maiúscula.'),
 P('Comum x próprio','<ol class="passos"><li><b>cachorro</b>: comum, serve para todos os cachorros.</li><li><b>Rex</b>: próprio, é o nome daquele cachorro.</li><li><b>cidade</b>: comum. <b>Salvador</b>: próprio.</li></ol>'),
 P('No meio da frase também','Mesmo no meio da frase, o nome próprio mantém a maiúscula: "Ontem o Bobby foi ao Brasil." Duas maiúsculas no meio, e está certo.'),
 P('Pra não esquecer','Maiúscula em nome próprio é sinal de respeito com o nome, mostra que aquilo é único.')
];

AULAS['p7.1']=[
 P('Adjetivo diz como é','Adjetivo é a palavra que descreve: <b>grande</b>, <b>pequeno</b>, <b>bonito</b>, <b>rápido</b>, <b>feliz</b>. Ele dá cor e detalhe ao substantivo.'),
 P('O teste do "como é"','<ol class="passos"><li>Pense num urso.</li><li>Pergunte: <b>como ele é?</b></li><li>Marrom, grande, macio, amigável, tudo isso são adjetivos.</li></ol>'),
 P('Combina com o substantivo','Se o substantivo é feminino plural, o adjetivo também: "as casas bonit<b>as</b>". Nunca "as casas bonito".'),
 P('Pra não esquecer','Substantivo é o quê; adjetivo é como é. Juntos formam a imagem na cabeça de quem lê.')
];
AULAS['p7.2']=[
 P('Verbo diz o que faz','Verbo é a palavra da ação: <b>correr</b>, <b>comer</b>, <b>pular</b>, <b>dormir</b>, <b>ser</b>. Sem verbo não existe frase de verdade.'),
 P('O teste da ação','<ol class="passos"><li>Pergunte: <b>o que aconteceu?</b> ou <b>o que ele fez?</b></li><li>Na frase "O Bobby pulou o muro", o que ele fez? <b>pulou</b>.</li><li>Achou o verbo.</li></ol>'),
 P('Verbos também sentem','Nem toda ação é movimento: pensar, gostar, querer e ser também são verbos, mesmo sem mexer o corpo.'),
 P('Pra não esquecer','O verbo é o coração da frase: é ele que faz a ideia acontecer.')
];
AULAS['p7.3']=[
 P('Tudo combinando','Na frase, quem faz e o verbo precisam combinar: "o menino corre" (um) e "os meninos correm" (vários). Isso chama-se concordância.'),
 P('Ouvindo o erro','<ol class="passos"><li>"Os menino corre." → soa errado.</li><li>Conserte o substantivo: os <b>meninos</b>.</li><li>Conserte o verbo: corre<b>m</b>.</li><li>"Os meninos correm." Agora sim.</li></ol>'),
 P('A dica do M','Quando o sujeito é plural, o verbo geralmente ganha <b>M</b> no fim: correm, comem, dormem.'),
 P('Pra não esquecer','Leia a frase em voz alta. Concordância errada quase sempre soa estranha antes mesmo de você saber a regra.')
];
AULAS['p7.4']=[
 P('O verbo viaja no tempo','O mesmo verbo muda de forma conforme o tempo: <b>ontem</b> eu corri, <b>hoje</b> eu corro, <b>amanhã</b> eu vou correr.',DUO(['corri','ontem'],['corro','hoje'])),
 P('Os três tempos','<ol class="passos"><li><b>Passado</b>: já aconteceu (comeu, brincou, foi).</li><li><b>Presente</b>: acontece agora (come, brinca, vai).</li><li><b>Futuro</b>: vai acontecer (vai comer, comerá).</li></ol>'),
 P('A palavra do tempo ajuda','Ontem, hoje, amanhã, agora, depois: essas palavrinhas avisam o tempo antes mesmo do verbo aparecer.'),
 P('Pra não esquecer','O tempo do verbo precisa combinar com o resto da frase. "Ontem eu como" está errado; "ontem eu comi" está certo.')
];
AULAS['p7.5']=[
 P('Montando frases inteiras','Uma frase bem montada tem: <b>quem</b> (substantivo) + <b>o que faz</b> (verbo) + <b>detalhe</b> (adjetivo, lugar, tempo).'),
 P('Construindo passo a passo','<ol class="passos"><li>Quem: <b>O urso</b>.</li><li>Faz o quê: <b>encontrou</b>.</li><li>O quê: <b>a chave dourada</b>.</li><li>Onde: <b>no castelo</b>. → O urso encontrou a chave dourada no castelo.</li></ol>'),
 P('Corte o que não precisa','Frase boa não é frase longa. Se der para tirar uma palavra sem perder o sentido, tire.'),
 P('Pra não esquecer','Escrever é montar peças: nome + ação + detalhe. Com essas três você conta qualquer história.')
];

AULAS['p8.1']=[
 P('O Ç e sua cedilha','O <b>Ç</b> é o C com um rabinho embaixo, chamado cedilha. Ele tem som de S e só aparece antes de <b>A</b>, <b>O</b> e <b>U</b>: caçа, poço, açúcar.'),
 P('Por que ele existe?','Porque antes de A, O e U o C teria som duro (de K). A cedilha avisa: aqui o som é de S. Compare CACA e CAÇA.'),
 P('Nunca antes de E e I','<ol class="passos"><li>Antes de E e I, o C já tem som de S sozinho.</li><li>Então não se escreve ÇE nem ÇI.</li><li>É "cebola", não "çebola".</li></ol>'),
 P('Pra não esquecer','Ç só antes de A, O, U. E nunca no começo de palavra.')
];
AULAS['p8.2']=[
 P('G e J podem soar igual','Antes de E e I, o G tem o mesmo som do J: <b>gelo</b> e <b>jeito</b> soam parecidos no começo. Aí só a memória e a leitura ajudam.'),
 P('O G duro','<ol class="passos"><li>Antes de A, O, U o G é duro: gato, gota, gude.</li><li>Para som duro antes de E e I, entra o U mudo: <b>gue</b>rra, <b>gui</b>tarra.</li><li>Esse U não é falado, é só um escudo.</li></ol>'),
 P('Famílias que ajudam','Palavras da mesma família mantêm a letra: viagem/viajar mudam, mas gelo/gelado ficam com G. Quando não souber, lembre de uma palavra parecida que você já viu escrita.'),
 P('Pra não esquecer','Ler muito é o melhor jeito de decorar G e J. O olho aprende a estranhar a escrita errada.')
];
AULAS['p8.3']=[
 P('X e CH','<b>X</b> e <b>CH</b> podem ter o mesmo som: <b>xícara</b> e <b>chave</b> começam igual quando falamos. A diferença é só na escrita.'),
 P('Pistas úteis','<ol class="passos"><li>Depois de <b>EN</b>, quase sempre X: enxada, enxugar.</li><li>Depois de ditongo (duas vogais), costuma ser X: caixa, peixe.</li><li>Depois de consoante como o R, costuma ser CH: colcha, macho.</li></ol>'),
 P('O X é camaleão','O X ainda tem outros sons: em táxi soa "ks", em exame soa "z", em máximo soa "s". Ele é a letra mais bagunceira do alfabeto.'),
 P('Pra não esquecer','Nessas horas, escrever é lembrar da imagem da palavra. Quanto mais você lê, mais fotos de palavras guarda na cabeça.')
];
AULAS['p8.4']=[
 P('S ou Z no fim','No fim da palavra, S e Z podem soar igual: <b>lápis</b>, <b>arroz</b>, <b>feliz</b>, <b>país</b>. O ouvido não resolve; a memória e as famílias resolvem.'),
 P('A dica da família','<ol class="passos"><li>Pense numa palavra da mesma família com a letra no meio.</li><li>FELIZ → felic<b>i</b>dade... aqui muda; mas ANÁLISE → analis<b>ar</b> mantém o S.</li><li>Quando a família mantém a letra, você tem sua resposta.</li></ol>'),
 P('Plural também dá pista','Palavras com Z fazem plural em ZES: raiz → raízes, luz → luzes. Palavras com S mantêm o S: mês → meses.'),
 P('Pra não esquecer','Não dá para adivinhar pelo som. Aqui vale conferir, reler e guardar as palavras que você mais usa.')
];
AULAS['p8.5']=[
 P('Palavras que confundem','Algumas duplas soam iguais mas se escrevem diferente e querem dizer coisas diferentes: <b>mas</b> (porém) e <b>mais</b> (quantidade); <b>mal</b> (ruim) e <b>mau</b> (malvado).',DUO(['mas','porém'],['mais','quantidade'])),
 P('Como decidir','<ol class="passos"><li>Dá para trocar por "porém"? → escreva <b>mas</b>.</li><li>Dá para trocar por "menos" (o contrário)? → escreva <b>mais</b>.</li><li>Dá para trocar por "bem"? → escreva <b>mal</b>. Por "bom"? → <b>mau</b>.</li></ol>'),
 P('Outras duplas','há/a, viagem (a coisa)/viajem (o verbo), acerto/a certo. Sempre existe um teste de troca que resolve.'),
 P('Pra não esquecer','O truque é sempre o mesmo: troque por uma palavra que você tem certeza e veja se a frase continua fazendo sentido.')
];

AULAS['p9.1']=[
 P('O acento é um aviso','O acento mostra onde a voz fica mais <b>forte</b> na palavra. Sem ele, a gente leria errado: SABIA, SABIÁ e SÁBIA são três palavras diferentes.'),
 P('Escutando a força','<ol class="passos"><li>Fale <b>CAFÉ</b>: a força está no fim, no FÉ.</li><li>Fale <b>LÁPIS</b>: a força está no começo, no LÁ.</li><li>O acento marca justamente essa sílaba forte.</li></ol>'),
 P('Nem toda palavra leva acento','A maioria não leva. O acento só aparece quando a palavra foge do padrão da língua, é uma exceção sinalizada.'),
 P('Pra não esquecer','Antes de colocar acento, fale a palavra em voz alta e descubra onde sua voz aumenta.')
];
AULAS['p9.2']=[
 P('O til e o nariz','O <b>til</b> (~) sobre o A ou o O faz o som sair pelo <b>nariz</b>: mãe, pão, coração, irmã. Tape o nariz e tente falar "pão" não sai igual.'),
 P('Onde ele aparece','<ol class="passos"><li><b>ão</b>: pão, mão, coração</li><li><b>ã</b>: irmã, maçã, lã</li><li><b>õe</b>: põe, limões</li></ol>'),
 P('Plural do ÃO','Palavras terminadas em ÃO fazem plural de três jeitos: pão→pães, mão→mãos, coração→corações. Vale ir aprendendo uma a uma.'),
 P('Pra não esquecer','Til não é acento de força, é acento de som nasal. São coisas diferentes.')
];
AULAS['p9.3']=[
 P('O acento agudo','O acento agudo (´) deixa a vogal <b>aberta</b> e forte: café, avó, público, história. É o acento mais comum do português.'),
 P('Circunflexo é o irmão fechado','<ol class="passos"><li><b>avó</b> (com agudo), a mãe da mãe.</li><li><b>avô</b> (com circunflexo), o pai do pai.</li><li>A boca abre mais no agudo e fecha mais no circunflexo.</li></ol>',DUO(['avó','aberto'],['avô','fechado'])),
 P('Palavras do dia a dia com acento','água, história, médico, rápido, lápis, você, também. Repare que quase todas têm a força numa sílaba inesperada.'),
 P('Pra não esquecer','Acento não é enfeite: ele muda a palavra e às vezes muda o sentido inteiro da frase.')
];
AULAS['p9.4']=[
 P('A vírgula separa','A vírgula é uma pausinha curta. Um dos seus trabalhos mais fáceis é separar itens de uma lista: "Comprei pão, leite, queijo e ovos."'),
 P('A regra da lista','<ol class="passos"><li>Separe cada item com vírgula.</li><li>Antes do último item, use <b>e</b> em vez de vírgula.</li><li>Não coloque vírgula antes do "e" da lista.</li></ol>'),
 P('A vírgula muda tudo','"Vamos comer, Bobby!" é um convite. "Vamos comer Bobby!" é um perigo. A vírgula salva o urso.'),
 P('Pra não esquecer','Leia a frase em voz alta: onde você respira naturalmente, provavelmente vai uma vírgula.')
];
AULAS['p9.5']=[
 P('Quando alguém fala','Para mostrar que um personagem está falando, usa-se o <b>travessão</b> (&mdash;) no começo da fala, ou as <b>aspas</b> ("").'),
 P('Como escrever um diálogo','<ol class="passos"><li>Comece a linha com travessão: &mdash; Bom dia!</li><li>Depois da fala, diga quem falou: &mdash; Bom dia! &mdash; disse o Bobby.</li><li>Cada nova fala começa numa linha nova.</li></ol>'),
 P('Aspas também servem','O Bobby disse: "Encontrei a chave!", mesma ideia, outro formato. Nos livros de história, o travessão é mais comum.'),
 P('Pra não esquecer','Diálogo bem marcado deixa claro quem está falando. Sem isso, o leitor se perde na conversa.')
];

AULAS['p10.1']=[
 P('Ler um bilhete','Bilhete é um texto curtinho com um recado. Tem três partes: para <b>quem</b> é, o <b>recado</b> e <b>quem</b> escreveu.'),
 P('Como ler','<ol class="passos"><li>Leia tudo uma vez, sem parar.</li><li>Leia de novo procurando o recado principal.</li><li>Pergunte: o que essa pessoa quer que eu faça?</li></ol>'),
 P('Os detalhes importam','Hora, lugar e data costumam estar no bilhete e são justamente o que a pergunta vai cobrar. Volte ao texto para conferir, não confie só na memória.'),
 P('Pra não esquecer','Ler duas vezes não é perda de tempo: é o que separa quem entendeu de quem só passou os olhos.')
];
AULAS['p10.2']=[
 P('Ler uma instrução','Instrução é um texto que ensina a fazer algo: uma receita, as regras de um jogo, o manual de um brinquedo. Ela vem quase sempre em <b>passos numerados</b>.'),
 P('Como seguir','<ol class="passos"><li>Leia todos os passos <b>antes</b> de começar.</li><li>Veja o que você precisa ter em mãos.</li><li>Faça um passo de cada vez, na ordem.</li></ol>'),
 P('A ordem é obrigatória','Numa receita, bater os ovos depois de assar o bolo não funciona. Instrução é uma das poucas leituras em que pular linha estraga tudo.'),
 P('Pra não esquecer','Leu tudo, separou o material, seguiu na ordem: é assim que instrução vira resultado.')
];
AULAS['p10.3']=[
 P('Ler uma historinha','Toda história tem <b>personagens</b> (quem), <b>lugar</b> (onde), um <b>problema</b> e uma <b>solução</b>. Saber isso ajuda a entender qualquer texto.'),
 P('Enquanto lê, pergunte','<ol class="passos"><li>Quem aparece aqui?</li><li>Onde isso acontece?</li><li>Qual é o problema?</li><li>Como foi resolvido no fim?</li></ol>'),
 P('Contar de novo é a prova','Se você consegue recontar a história com suas palavras para outra pessoa, entendeu de verdade. Se travar em alguma parte, é aí que vale reler.'),
 P('Pra não esquecer','Ler história é diferente de decorar palavras: é montar um filme na cabeça.')
];
AULAS['p10.4']=[
 P('Achar a informação','Muitas perguntas de prova não pedem opinião, pedem uma informação que <b>já está escrita</b> no texto. Sua missão é localizá-la.'),
 P('A técnica do caça-palavras','<ol class="passos"><li>Leia a pergunta e escolha a <b>palavra-chave</b> dela.</li><li>Procure essa palavra no texto.</li><li>Leia a frase inteira em volta dela.</li><li>A resposta quase sempre está ali.</li></ol>'),
 P('Não responda de memória','Mesmo achando que lembra, volte e confirme no texto. A memória troca detalhes; o papel não.'),
 P('Pra não esquecer','Resposta boa é resposta que você consegue apontar com o dedo no texto.')
];
AULAS['p10.5']=[
 P('Desafio final','Aqui vem tudo junto: letras, sílabas, palavras, frases, ortografia, acentos e leitura. É a última fase da Galáxia do Português.'),
 P('Seu checklist de leitor','<ol class="passos"><li>Leia com calma, sem pular palavra.</li><li>Quebre em sílabas o que for difícil.</li><li>Confira maiúscula e ponto ao escrever.</li><li>Releia antes de responder.</li></ol>'),
 P('O que você conquistou','Você saiu das cinco vogais e chegou a ler textos inteiros e entender o que eles dizem. Isso é a base de todas as outras matérias.'),
 P('Pra não esquecer','Ler é um músculo: quanto mais você usa, mais forte fica. Leia todo dia, mesmo que só um pouquinho.')
];

