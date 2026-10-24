/* ===== Inglês americano: currículo do zero (10 mundos × 5 fases) ===== */
const VOC={
 1:[['hello','oi / olá'],['hi','oi'],['good morning','bom dia'],['good night','boa noite'],['please','por favor'],
    ['thank you','obrigado'],['yes','sim'],['no','não'],['my name is','meu nome é'],['nice to meet you','prazer'],
    ['goodbye','tchau'],['sorry','desculpe'],['one','um'],['two','dois'],['three','três']],
 2:[['red','vermelho'],['blue','azul'],['green','verde'],['yellow','amarelo'],['black','preto'],
    ['white','branco'],['orange','laranja'],['purple','roxo'],['pink','rosa'],['brown','marrom'],
    ['book','livro'],['pencil','lápis'],['school','escola'],['teacher','professora'],['backpack','mochila']],
 3:[['mother','mãe'],['father','pai'],['sister','irmã'],['brother','irmão'],['grandmother','avó'],
    ['grandfather','avô'],['family','família'],['friend','amigo'],['baby','bebê'],['boy','menino'],
    ['girl','menina'],['man','homem'],['woman','mulher'],['son','filho'],['daughter','filha']],
 4:[['dog','cachorro'],['cat','gato'],['bird','pássaro'],['fish','peixe'],['horse','cavalo'],
    ['cow','vaca'],['pig','porco'],['chicken','galinha'],['rabbit','coelho'],['bear','urso'],
    ['lion','leão'],['monkey','macaco'],['elephant','elefante'],['snake','cobra'],['duck','pato']],
 5:[['water','água'],['milk','leite'],['bread','pão'],['apple','maçã'],['banana','banana'],
    ['rice','arroz'],['cheese','queijo'],['egg','ovo'],['cake','bolo'],['juice','suco'],
    ['chicken','frango'],['fruit','fruta'],['candy','bala'],['breakfast','café da manhã'],['dinner','jantar']],
 6:[['head','cabeça'],['hand','mão'],['foot','pé'],['eye','olho'],['mouth','boca'],
    ['nose','nariz'],['hair','cabelo'],['shirt','camiseta'],['shoes','sapatos'],['pants','calça'],
    ['dress','vestido'],['hat','chapéu'],['coat','casaco'],['sock','meia'],['glasses','óculos']],
 7:[['house','casa'],['door','porta'],['window','janela'],['kitchen','cozinha'],['bedroom','quarto'],
    ['bathroom','banheiro'],['table','mesa'],['chair','cadeira'],['bed','cama'],['garden','jardim'],
    ['room','cômodo'],['floor','chão'],['wall','parede'],['key','chave'],['light','luz']],
 8:[['run','correr'],['eat','comer'],['drink','beber'],['sleep','dormir'],['play','brincar'],
    ['read','ler'],['write','escrever'],['walk','caminhar'],['sing','cantar'],['jump','pular'],
    ['study','estudar'],['help','ajudar'],['open','abrir'],['close','fechar'],['look','olhar']],
 9:[['what','o quê'],['where','onde'],['who','quem'],['when','quando'],['how many','quantos'],
    ['how are you','como você está'],['I am fine','estou bem'],['how old are you','quantos anos você tem'],
    ['I like','eu gosto'],['I have','eu tenho'],['this is','isto é'],['there is','há / existe'],
    ['can you','você pode'],['do you like','você gosta'],['let us go','vamos']],
 10:[['today','hoje'],['tomorrow','amanhã'],['morning','manhã'],['night','noite'],['big','grande'],
    ['small','pequeno'],['happy','feliz'],['hot','quente'],['cold','frio'],['new','novo'],
    ['old','velho'],['fast','rápido'],['slow','devagar'],['good','bom'],['bad','ruim']]
};
function banco(m,i){
  const b=VOC[m];const ini=Math.min(b.length-6,i*2);
  return b.slice(Math.max(0,ini),Math.max(6,ini+7)).map(x=>({en:x[0],pt:x[1]}));
}
/* índice: palavra em inglês -> como se fala / o que quer dizer.
   preenchido pelo ingles-lex.js e usado quando o aparelho não tem voz em inglês */
var FALA_EN={},SIG_EN={};
function podeOuvirEN(){
  try{return typeof temVoz==='function'?temVoz('en-US'):false;}catch(e){return false;}
}
function ouvirEN(prompt,certa,erradas){
  const fala=FALA_EN[String(certa).toLowerCase()];
  const sig=SIG_EN[String(certa).toLowerCase()];
  /* sem voz em inglês no aparelho a pergunta de ouvir ficaria impossível:
     vira uma pergunta equivalente que dá para responder lendo */
  if(!podeOuvirEN()){
    if(fala)return Object.assign({type:'mc',prompt:'Qual destas palavras se fala assim: <b>“'+fala+'”</b>?',
      options:shuf([certa].concat(erradas)),answer:certa,
      dica:'Leia cada opção em voz alta e veja qual soa como “'+fala+'”.'});
    if(sig)return Object.assign({type:'mc',prompt:'Como se diz <b>'+sig+'</b> em inglês?',
      options:shuf([certa].concat(erradas)),answer:certa});
  }
  return Object.assign({type:'mc',ouvir:certa,lang:'en-US',prompt:prompt,
    options:shuf([certa].concat(erradas)),answer:certa,
    dica:(fala?'Aperte o botão do som de novo. A palavra se fala <b>“'+fala+'”</b>.'
              :'Aperte o botão do som de novo e escute com atenção.')});
}
function vocMakers(m,i){
  const B=banco(m,i);
  const outras=n=>shuf(B.filter(x=>x.en!==n)).slice(0,3);
  return [
   ()=>{const w=pick(B);return mc('Como se diz <b>'+w.pt+'</b> em inglês?',w.en,outras(w.en).map(x=>x.en));},
   ()=>{const w=pick(B);return mc('O que significa <b>'+w.en+'</b>?',w.pt,outras(w.en).map(x=>x.pt));},
   ()=>{const w=pick(B);return ouvirEN('Ouça e escolha a palavra.',w.en,outras(w.en).map(x=>x.en));},
   ()=>{const w=pick(B.filter(x=>x.en.length<9&&x.en.indexOf(' ')<0));
        return w?txtQ('Escreva em inglês: <b>'+w.pt+'</b>',w.en,{teclado:'letra'}):
        mc('Como se diz '+B[0].pt+'?',B[0].en,outras(B[0].en).map(x=>x.en));},
   ()=>{const w=pick(B);return ouvirEN('Ouça com atenção e escolha.',w.en,outras(w.en).map(x=>x.en));},
   ()=>{const w=pick(B);return mc('Qual é a tradução de <b>'+w.pt+'</b>?',w.en,outras(w.en).map(x=>x.en));}
  ];
}
const UNITS_EN=[];
const LE=(id,glyph,title,teach,makers,custom)=>({id:id,glyph:glyph,title:title,teach:teach,makers:makers,custom:custom||null});
const AULA_EN=(o)=>o;

function mundoEN(n,title,sub,tone,fases){
  UNITS_EN.push({n:n,title:title,sub:sub,tone:tone,lessons:fases.map((f,i)=>
    LE('e'+n+'.'+(i+1),f.g,f.t,f.teach,f.makers||vocMakers(n,i),f.makers||null))});
}

mundoEN(1,'Hello! · Olá!','As primeiras palavras: cumprimentar, dizer o nome e contar até três.','verde',[
 {g:'hi',t:'Hello and hi (oi e olá)',teach:{ideia:'Em inglês americano, <b>hello</b> e <b>hi</b> são as duas formas de dizer oi. "Hi" é mais informal, entre amigos.',exemplo:'Hello! / Hi, Bobby!',dica:'Fala-se "rélou" e "rái".'}},
 {g:'gm',t:'Good morning, good night (bom dia, boa noite)',teach:{ideia:'O cumprimento muda com a hora: <b>good morning</b> (bom dia), <b>good afternoon</b> (boa tarde) e <b>good night</b> (boa noite).',exemplo:'Good morning, teacher!',dica:'"Good" se fala "gud".'}},
 {g:'ty',t:'Please and thank you (por favor e obrigado)',teach:{ideia:'<b>Please</b> é por favor e <b>thank you</b> é obrigado. Nos Estados Unidos essas duas aparecem o tempo todo.',exemplo:'Water, please. — Thank you!',dica:'Responder "you are welcome" é o nosso "de nada".'}},
 {g:'me',t:'My name is... (meu nome é...)',teach:{ideia:'Para se apresentar: <b>My name is Lívia.</b> Ou, mais curto: <b>I am Lívia.</b>',exemplo:'Hi! My name is Bobby. Nice to meet you!',dica:'"Nice to meet you" é "prazer em conhecer".'}},
 {g:'123',t:'One, two, three (um, dois, três)',teach:{ideia:'Os primeiros números: <b>one</b> (1), <b>two</b> (2), <b>three</b> (3).',exemplo:'I have two dogs.',dica:'"One" se fala "uân", "two" é "tú" e "three" tem a língua entre os dentes.'}}
]);
mundoEN(2,'Colors and school · Cores e escola','As cores e as coisas da escola.','agua',[
 {g:'R',t:'Red, blue, green (vermelho, azul, verde)',teach:{ideia:'As primeiras cores: <b>red</b> (vermelho), <b>blue</b> (azul), <b>green</b> (verde).',exemplo:'The apple is red.',dica:'Aponte para coisas na sua casa e diga a cor em inglês.'}},
 {g:'Y',t:'Yellow, black, white (amarelo, preto, branco)',teach:{ideia:'Mais cores: <b>yellow</b> (amarelo), <b>black</b> (preto), <b>white</b> (branco).',exemplo:'A zebra is black and white.',dica:'"Yellow" se fala "iélou".'}},
 {g:'P',t:'Orange, purple, pink (laranja, roxo, rosa)',teach:{ideia:'<b>Orange</b> é laranja (a cor e a fruta), <b>purple</b> é roxo e <b>pink</b> é rosa.',exemplo:'I like the pink shirt.',dica:'Orange serve para a fruta e para a cor, igual em português.'}},
 {g:'B',t:'Book and pencil (livro e lápis)',teach:{ideia:'Coisas da escola: <b>book</b> (livro), <b>pencil</b> (lápis), <b>backpack</b> (mochila).',exemplo:'My book is in the backpack.',dica:'"Pencil" se fala "pênsol".'}},
 {g:'S',t:'School and teacher (escola e professora)',teach:{ideia:'<b>School</b> é escola e <b>teacher</b> é professor ou professora.',exemplo:'My teacher is nice.',dica:'Em inglês, teacher serve para homem e mulher.'}}
]);
mundoEN(3,'My family · Minha família','As pessoas da casa e os amigos.','ambar',[
 {g:'M',t:'Mother and father (mãe e pai)',teach:{ideia:'<b>Mother</b> é mãe e <b>father</b> é pai. No dia a dia americano se usa muito <b>mom</b> e <b>dad</b>.',exemplo:'This is my mom.',dica:'"Mother" tem o som do TH, com a língua entre os dentes.'}},
 {g:'S',t:'Sister and brother (irmã e irmão)',teach:{ideia:'<b>Sister</b> é irmã e <b>brother</b> é irmão.',exemplo:'I have one brother and two sisters.',dica:'Repare que os dois terminam em -er.'}},
 {g:'G',t:'Grandmother, grandfather (avó e avô)',teach:{ideia:'<b>Grandmother</b> é avó e <b>grandfather</b> é avô. Carinhosamente: grandma e grandpa.',exemplo:'My grandma cooks very well.',dica:'"Grand" quer dizer grande, mas aqui indica a geração de cima.'}},
 {g:'F',t:'Family and friends (família e amigos)',teach:{ideia:'<b>Family</b> é família e <b>friend</b> é amigo ou amiga.',exemplo:'My family is big. My friend is Ana.',dica:'"Friend" se fala "frênd".'}},
 {g:'B',t:'Boy, girl, baby (menino, menina, bebê)',teach:{ideia:'<b>Boy</b> é menino, <b>girl</b> é menina e <b>baby</b> é bebê.',exemplo:'The baby is sleeping.',dica:'O plural quase sempre ganha S: boys, girls, babies.'}}
]);
mundoEN(4,'Animals · Animais','Bichos de casa, da fazenda e da floresta.','coral',[
 {g:'D',t:'Dog and cat (cachorro e gato)',teach:{ideia:'<b>Dog</b> é cachorro e <b>cat</b> é gato — os dois bichos mais comuns nas casas americanas.',exemplo:'My dog is brown.',dica:'Nos Estados Unidos, o cachorro faz "woof" e o gato faz "meow".'}},
 {g:'B',t:'Bird and fish (pássaro e peixe)',teach:{ideia:'<b>Bird</b> é pássaro e <b>fish</b> é peixe. Curiosidade: fish no plural continua fish.',exemplo:'I see three fish.',dica:'"Bird" se fala "bârd".'}},
 {g:'H',t:'Farm animals (bichos da fazenda)',teach:{ideia:'Na fazenda: <b>horse</b> (cavalo), <b>cow</b> (vaca), <b>pig</b> (porco), <b>chicken</b> (galinha).',exemplo:'The cow is white and black.',dica:'"Chicken" serve para a galinha e para o frango do prato.'}},
 {g:'L',t:'Wild animals (bichos selvagens)',teach:{ideia:'Na floresta: <b>lion</b> (leão), <b>monkey</b> (macaco), <b>elephant</b> (elefante), <b>snake</b> (cobra).',exemplo:'The elephant is very big.',dica:'"Lion" se fala "láion".'}},
 {g:'🐻',t:'Bear and rabbit (urso e coelho)',teach:{ideia:'<b>Bear</b> é urso — como o Bobby! E <b>rabbit</b> é coelho.',exemplo:'Bobby is a brown bear.',dica:'Cuidado: "bear" e "beer" (cerveja) são parecidos mas diferentes.'}}
]);
mundoEN(5,'Food and drinks · Comida e bebida','O que se come e o que se bebe.','roxo',[
 {g:'W',t:'Water and milk (água e leite)',teach:{ideia:'<b>Water</b> é água e <b>milk</b> é leite.',exemplo:'I drink water every day.',dica:'Nos EUA, "water" se fala quase "uórer".'}},
 {g:'B',t:'Bread and cheese (pão e queijo)',teach:{ideia:'<b>Bread</b> é pão, <b>cheese</b> é queijo e <b>egg</b> é ovo.',exemplo:'Bread and cheese, please.',dica:'"Cheese" é o que se fala para sorrir na foto.'}},
 {g:'A',t:'Fruits (frutas)',teach:{ideia:'<b>Apple</b> é maçã, <b>banana</b> é banana e <b>fruit</b> é fruta.',exemplo:'I eat an apple every morning.',dica:'Antes de som de vogal usa-se "an": an apple.'}},
 {g:'C',t:'Cake and candy (bolo e doces)',teach:{ideia:'<b>Cake</b> é bolo, <b>candy</b> é bala ou doce e <b>juice</b> é suco.',exemplo:'The birthday cake is big.',dica:'"Candy" é a palavra americana; no inglês britânico se diz "sweets".'}},
 {g:'D',t:'Breakfast and dinner (café da manhã e jantar)',teach:{ideia:'<b>Breakfast</b> é café da manhã, <b>lunch</b> é almoço e <b>dinner</b> é jantar.',exemplo:'Breakfast is at seven.',dica:'"Breakfast" é literalmente quebrar o jejum da noite.'}}
]);
mundoEN(6,'Body and clothes · Corpo e roupas','O corpo e as roupas.','verde',[
 {g:'H',t:'Head and hands (cabeça e mãos)',teach:{ideia:'<b>Head</b> é cabeça, <b>hand</b> é mão e <b>foot</b> é pé (plural: feet).',exemplo:'Wash your hands!',dica:'Um pé é foot, dois são feet.'}},
 {g:'E',t:'Face (o rosto)',teach:{ideia:'No rosto: <b>eye</b> (olho), <b>nose</b> (nariz), <b>mouth</b> (boca), <b>hair</b> (cabelo).',exemplo:'She has blue eyes.',dica:'"Eye" se fala como a letra I: "ái".'}},
 {g:'S',t:'Shirt and shoes (camisa e sapatos)',teach:{ideia:'<b>Shirt</b> é camiseta, <b>shoes</b> são sapatos e <b>pants</b> é calça (sempre no plural).',exemplo:'My shoes are new.',dica:'Nos EUA calça é "pants"; na Inglaterra, "trousers".'}},
 {g:'D',t:'Dress and hat (vestido e chapéu)',teach:{ideia:'<b>Dress</b> é vestido, <b>hat</b> é chapéu e <b>coat</b> é casaco.',exemplo:'Bobby has a funny hat.',dica:'"Dress" também pode ser o verbo vestir.'}},
 {g:'C',t:'Getting dressed (se vestir)',teach:{ideia:'Juntando tudo: <b>sock</b> (meia), <b>glasses</b> (óculos) e as roupas que você já sabe.',exemplo:'I wear glasses to read.',dica:'"Glasses" é sempre plural, como o nosso "óculos".'}}
]);
mundoEN(7,'My house · Minha casa','A casa e os cômodos.','agua',[
 {g:'H',t:'House and door (casa e porta)',teach:{ideia:'<b>House</b> é casa, <b>door</b> é porta e <b>window</b> é janela.',exemplo:'Open the door, please.',dica:'"House" se fala "ráus".'}},
 {g:'K',t:'Kitchen and bedroom (cozinha e quarto)',teach:{ideia:'<b>Kitchen</b> é cozinha, <b>bedroom</b> é quarto e <b>bathroom</b> é banheiro.',exemplo:'The kitchen is small.',dica:'"Bed" é cama; por isso bedroom é o quarto de dormir.'}},
 {g:'T',t:'Table and chair (mesa e cadeira)',teach:{ideia:'<b>Table</b> é mesa, <b>chair</b> é cadeira e <b>bed</b> é cama.',exemplo:'The book is on the table.',dica:'"On the table" quer dizer em cima da mesa.'}},
 {g:'G',t:'Garden and rooms (jardim e cômodos)',teach:{ideia:'<b>Garden</b> é jardim, <b>room</b> é cômodo, <b>floor</b> é chão e <b>wall</b> é parede.',exemplo:'We play in the garden.',dica:'"Floor" também quer dizer andar do prédio.'}},
 {g:'K',t:'Key and light (chave e luz)',teach:{ideia:'<b>Key</b> é chave e <b>light</b> é luz.',exemplo:'Turn on the light.',dica:'"Turn on" é ligar; "turn off" é desligar.'}}
]);
mundoEN(8,'What I do · O que eu faço','Os verbos do dia a dia.','ambar',[
 {g:'R',t:'Run, eat, drink (correr, comer, beber)',teach:{ideia:'Verbos são ações: <b>run</b> (correr), <b>eat</b> (comer), <b>drink</b> (beber).',exemplo:'I eat bread. I drink milk.',dica:'Em inglês o verbo quase não muda: I eat, you eat, we eat.'}},
 {g:'S',t:'Sleep and play (dormir e brincar)',teach:{ideia:'<b>Sleep</b> é dormir e <b>play</b> é brincar ou jogar.',exemplo:'I play with my dog.',dica:'"Play" serve para brincar, jogar e tocar um instrumento.'}},
 {g:'W',t:'Read and write (ler e escrever)',teach:{ideia:'<b>Read</b> é ler e <b>write</b> é escrever. O W de write é mudo.',exemplo:'I read a book every night.',dica:'Escreve-se write, mas fala-se "ráit".'}},
 {g:'J',t:'Walk, sing, jump (andar, cantar, pular)',teach:{ideia:'<b>Walk</b> é caminhar, <b>sing</b> é cantar e <b>jump</b> é pular.',exemplo:'The rabbit can jump.',dica:'O L de "walk" também é mudo: fala-se "uók".'}},
 {g:'I',t:'I can, I like (eu consigo, eu gosto)',teach:{ideia:'<b>I like</b> é eu gosto e <b>I can</b> é eu consigo/posso. Depois deles vem o verbo sem mudar nada.',exemplo:'I like to read. I can jump.',dica:'"I like dogs" — em inglês o plural aparece sem "os".'}}
]);
mundoEN(9,'Questions · Perguntas','Perguntar e responder.','coral',[
 {g:'?',t:'What and where (o quê e onde)',teach:{ideia:'<b>What</b> é o quê e <b>where</b> é onde.',exemplo:'What is this? Where is my book?',dica:'Toda pergunta em inglês termina com ? igual em português.'}},
 {g:'W',t:'Who and when (quem e quando)',teach:{ideia:'<b>Who</b> é quem e <b>when</b> é quando.',exemplo:'Who is she? When is the party?',dica:'O H de "who" não se pronuncia: fala-se "rú".'}},
 {g:'#',t:'How many (quantos)',teach:{ideia:'<b>How many</b> é quantos, para coisas que se podem contar.',exemplo:'How many dogs do you have?',dica:'Para o que não se conta (água, leite) usa-se "how much".'}},
 {g:'H',t:'How are you? (como você está?)',teach:{ideia:'<b>How are you?</b> é como você está. A resposta mais comum é <b>I am fine, thank you</b>.',exemplo:'— How are you? — I am fine!',dica:'Americanos costumam responder "I\'m good".'}},
 {g:'A',t:'How old are you? (quantos anos você tem?)',teach:{ideia:'<b>How old are you?</b> pergunta a idade. Responde-se <b>I am eight years old</b>.',exemplo:'— How old are you? — I am nine.',dica:'Em inglês a idade usa o verbo "to be", não "ter".'}}
]);
const FRASES=[
 ['What\'s up?','E aí? / Tudo bem?'],['I don\'t know','Eu não sei'],['Let\'s go','Vamos'],
 ['I\'m hungry','Estou com fome'],['I\'m tired','Estou cansado'],['Wait a minute','Espera um minuto'],
 ['Excuse me','Com licença'],['Can I have some water?','Posso pegar água?'],['How much is it?','Quanto custa?'],
 ['I need help','Preciso de ajuda'],['See you later','Até mais'],['That\'s cool','Que legal'],
 ['I\'m ready','Estou pronto'],['Come here','Vem cá'],['Look at this','Olha isso']
];
const COGN=[
 ['hospital','hospital',true],['animal','animal',true],['chocolate','chocolate',true],['family','família',true],
 ['color','cor',true],['music','música',true],['parents','pais (mãe e pai)',false],['pretend','fingir',false],
 ['actually','na verdade',false],['push','empurrar',false],['library','biblioteca',false],['fabric','tecido',false]
];
function frasePares(B){return shuf(B).slice(0,3);}
mundoEN(10,'Everyday English · Inglês do dia a dia','O inglês que se fala de verdade: tempo, frases prontas e pedidos.','roxo',[
 {g:'T',t:'Yesterday, today, tomorrow (ontem, hoje, amanhã)',teach:{ideia:'O verbo muda com o tempo: <b>I play</b> (hoje), <b>I played</b> (ontem), <b>I will play</b> (amanhã).',
   exemplo:'Yesterday I played. Today I play. Tomorrow I will play.',dica:'O passado dos verbos regulares ganha <b>-ed</b> no fim.'},
  makers:[
   ()=>mc('"Yesterday I ___ soccer." Qual completa?','played',['play','will play']),
   ()=>mc('"Tomorrow I ___ study." Qual completa?','will',['played','studies']),
   ()=>mc('O que significa <b>yesterday</b>?','ontem',['hoje','amanhã']),
   ()=>mc('O que significa <b>tomorrow</b>?','amanhã',['ontem','agora']),
   ()=>mc('Como fica "walk" no passado?','walked',['walking','will walk']),
   ()=>ouvirEN('Ouça e escolha.','today',['tomorrow','yesterday','tonight'])
  ]},
 {g:'💬',t:'Frases do dia a dia',teach:{ideia:'Muita coisa em inglês se aprende em bloco, como frase pronta: <b>What\'s up?</b>, <b>I don\'t know</b>, <b>Let\'s go</b>.',
   exemplo:'— What\'s up? — Nothing much. Let\'s go!',dica:'Guarde a frase inteira, não palavra por palavra. É assim que se fala rápido.'},
  makers:[
   ()=>{const f=pick(FRASES);return mc('O que significa <b>'+f[0]+'</b>?',f[1],frasePares(FRASES.filter(x=>x[1]!==f[1])).map(x=>x[1]));},
   ()=>{const f=pick(FRASES);return mc('Como se diz <b>'+f[1]+'</b>?',f[0],frasePares(FRASES.filter(x=>x[0]!==f[0])).map(x=>x[0]));},
   ()=>{const f=pick(FRASES);return ouvirEN('Ouça a frase e escolha.',f[0],frasePares(FRASES.filter(x=>x[0]!==f[0])).map(x=>x[0]));},
   ()=>mc('Alguém diz "What\'s up?". O que você responde?','Nothing much!',['Yes, please.','I am eight.']),
   ()=>mc('Você está com fome. O que fala?','I\'m hungry',['I\'m tired','See you later']),
   ()=>{const f=pick(FRASES);return mc('Quando se usa <b>'+f[0]+'</b>?',f[1],frasePares(FRASES.filter(x=>x[1]!==f[1])).map(x=>x[1]));}
  ]},
 {g:'🙋',t:'Pedir e agradecer',teach:{ideia:'Para pedir com educação: <b>Can I have...?</b> e <b>Excuse me</b>. Para saber o preço: <b>How much is it?</b>',
   exemplo:'Excuse me, can I have some water, please?',dica:'"Please" no fim deixa qualquer pedido educado.'},
  makers:[
   ()=>mc('Como se pede água educadamente?','Can I have some water, please?',['Water!','I want water now']),
   ()=>mc('O que significa <b>How much is it?</b>','Quanto custa?',['Que horas são?','Como você está?']),
   ()=>mc('O que significa <b>Excuse me</b>?','Com licença',['Obrigado','Tchau']),
   ()=>ouvirEN('Ouça e escolha.','thank you',['excuse me','how much','see you']),
   ()=>mc('Alguém te ajuda. O que você diz?','Thank you!',['Excuse me!','How much?']),
   ()=>mc('Como se diz "preciso de ajuda"?','I need help',['I am help','Help I need'])
  ]},
 {g:'≈',t:'Palavras iguais e falsas',teach:{ideia:'Muitas palavras em inglês são quase iguais ao português — os <b>cognatos</b>: hospital, animal, chocolate. Mas cuidado com os <b>falsos amigos</b>: <b>parents</b> é pais, não parentes.',
   exemplo:'"Actually" não é atualmente: quer dizer "na verdade".',dica:'Na dúvida, confira: às vezes a palavra parecida engana.'},
  makers:[
   ()=>{const c=pick(COGN);return mc('O que significa <b>'+c[0]+'</b>?',c[1],shuf(COGN.filter(x=>x[1]!==c[1])).slice(0,3).map(x=>x[1]));},
   ()=>mc('<b>Parents</b> quer dizer o quê?','pais (mãe e pai)',['parentes','padrinhos']),
   ()=>mc('<b>Actually</b> quer dizer o quê?','na verdade',['atualmente','agora']),
   ()=>mc('<b>Library</b> quer dizer o quê?','biblioteca',['livraria','livro']),
   ()=>mc('<b>Push</b> na porta quer dizer o quê?','empurre',['puxe','abra']),
   ()=>{const c=pick(COGN.filter(x=>x[2]));return mc('Qual destas é quase igual em português?',c[0],
        shuf(COGN.filter(x=>!x[2])).slice(0,3).map(x=>x[0]));}
  ]},
 {g:'★',t:'Final challenge (desafio final)',teach:{ideia:'Tudo o que você viu nos dez mundos, misturado: palavras, perguntas e frases do dia a dia.',
   exemplo:'Leia com calma e lembre do mundo em que aprendeu aquilo.',dica:'Errou? Volte no mundo do assunto e refaça a fase.'},
  makers:[()=>enHard(),()=>enHard(),()=>enHard(),()=>enHard(),()=>enHard(),()=>enHard()]}
]);
function enPool(){
  const ls=[];UNITS_EN.forEach(u=>u.lessons.forEach(l=>{if(l.id!=='e10.5')ls.push.apply(ls,l.makers);}));return ls;
}
function enHard(){return pick(enPool())();}
const TOTAL_EN=UNITS_EN.reduce((a,u)=>a+u.lessons.length,0);

