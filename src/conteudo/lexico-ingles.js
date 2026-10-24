/* ===== Vocabulário por fase + progressão didática (ensinar antes de testar) ===== */
/* cada item: [inglês, português, como se fala, frase de exemplo] */
const LEX={
'e1.1':[['hello','olá','rélou','Hello! Nice to meet you.','Olá! Prazer em conhecer você.'],['hi','oi','rái','Hi, Bobby!','Oi, Bobby!'],['goodbye','tchau','gudbái','Goodbye! See you tomorrow.','Tchau! Até amanhã.'],['bye','tchau','bái','Bye, mom!','Tchau, mãe!']],
'e1.2':[['good morning','bom dia','gud mórnin','Good morning, teacher!','Bom dia, professora!'],['good afternoon','boa tarde','gud áftârnun','Good afternoon, class.','Boa tarde, turma.'],['good evening','boa noite (ao chegar)','gud ívnin','Good evening, everyone.','Boa noite, pessoal.'],['good night','boa noite (ao dormir)','gud náit','Good night, sleep well.','Boa noite, durma bem.']],
'e1.3':[['please','por favor','plíz','Water, please.','Água, por favor.'],['thank you','obrigado','tênk iú','Thank you for the book.','Obrigado pelo livro.'],['you are welcome','de nada','iór uélcam','Thank you! — You are welcome.','Obrigado! — De nada.'],['sorry','desculpe','sóri','Sorry, I am late.','Desculpe, estou atrasado.']],
'e1.4':[['my name is','meu nome é','mái neim iz','My name is Bobby.','Meu nome é Bobby.'],['what is your name','qual é o seu nome','uóts iór neim','Hi! What is your name?','Oi! Qual é o seu nome?'],['nice to meet you','prazer em conhecer','náis tu mít iú','Nice to meet you, Lívia.','Prazer em conhecer você, Lívia.'],['I am','eu sou / eu estou','áim','I am Bobby.','Eu sou o Bobby.']],
'e1.5':[['one','um','uân','I have one dog.','Eu tenho um cachorro.'],['two','dois','tchú','Two apples, please.','Duas maçãs, por favor.'],['three','três','thrí','Three books on the table.','Três livros na mesa.'],['four','quatro','fór','Four chairs.','Quatro cadeiras.'],['five','cinco','fáiv','Five fingers on my hand.','Cinco dedos na minha mão.']],
'e2.1':[['red','vermelho','réd','The apple is red.','A maçã é vermelha.'],['blue','azul','blú','The sky is blue.','O céu é azul.'],['green','verde','grín','The tree is green.','A árvore é verde.']],
'e2.2':[['yellow','amarelo','iélou','The sun is yellow.','O sol é amarelo.'],['black','preto','blék','My shoes are black.','Meus sapatos são pretos.'],['white','branco','uáit','The milk is white.','O leite é branco.']],
'e2.3':[['orange','laranja','órinj','I eat an orange.','Eu como uma laranja.'],['purple','roxo','pârpol','A purple flower.','Uma flor roxa.'],['pink','rosa','pink','Her dress is pink.','O vestido dela é rosa.'],['brown','marrom','bráun','Bobby is a brown bear.','O Bobby é um urso marrom.']],
'e2.4':[['book','livro','buk','My book is new.','Meu livro é novo.'],['pencil','lápis','pênsol','A red pencil.','Um lápis vermelho.'],['pen','caneta','pén','I write with a pen.','Eu escrevo com uma caneta.'],['paper','papel','pêipâr','Give me a paper, please.','Me dê um papel, por favor.'],['backpack','mochila','békpék','My backpack is heavy.','Minha mochila está pesada.']],
'e2.5':[['school','escola','skúl','I go to school.','Eu vou para a escola.'],['teacher','professor(a)','tíchâr','My teacher is nice.','Minha professora é legal.'],['student','aluno(a)','stiúdent','I am a student.','Eu sou aluno.'],['friend','amigo(a)','frénd','She is my friend.','Ela é minha amiga.']],
'e3.1':[['mother','mãe','mâdâr','My mother is a teacher.','Minha mãe é professora.'],['father','pai','fádâr','My father works a lot.','Meu pai trabalha muito.'],['mom','mãe (carinhoso)','mâm','Hi, mom!','Oi, mãe!'],['dad','pai (carinhoso)','déd','Dad, look at me!','Pai, olha para mim!']],
'e3.2':[['sister','irmã','sistâr','I have one sister.','Eu tenho uma irmã.'],['brother','irmão','brâdâr','My brother is small.','Meu irmão é pequeno.'],['I have','eu tenho','ái rév','I have two dogs.','Eu tenho dois cachorros.']],
'e3.3':[['grandmother','avó','grândmâdâr','My grandmother cooks well.','Minha avó cozinha bem.'],['grandfather','avô','grândfádâr','My grandfather is funny.','Meu avô é engraçado.'],['grandma','vovó','grândmá','Grandma, I love you.','Vovó, eu te amo.'],['grandpa','vovô','grândpá','Grandpa has a hat.','O vovô tem um chapéu.']],
'e3.4':[['family','família','fémili','This is my family.','Esta é a minha família.'],['friend','amigo(a)','frénd','He is my best friend.','Ele é meu melhor amigo.'],['people','pessoas','pípol','Many people are here.','Muitas pessoas estão aqui.'],['this is','este/esta é','dis iz','This is my mother.','Esta é a minha mãe.']],
'e3.5':[['boy','menino','bói','The boy is running.','O menino está correndo.'],['girl','menina','gârl','The girl has a book.','A menina tem um livro.'],['baby','bebê','bêibi','The baby is sleeping.','O bebê está dormindo.'],['man','homem','mén','That man is tall.','Aquele homem é alto.'],['woman','mulher','uúman','The woman is my aunt.','A mulher é a minha tia.']],
'e4.1':[['dog','cachorro','dóg','My dog is brown.','Meu cachorro é marrom.'],['cat','gato','két','The cat is black.','O gato é preto.'],['pet','animal de estimação','pét','I have two pets.','Eu tenho dois bichinhos.']],
'e4.2':[['bird','pássaro','bârd','The bird can fly.','O pássaro sabe voar.'],['fish','peixe','fích','I see three fish.','Eu vejo três peixes.'],['fly','voar','flái','Birds fly in the sky.','Os pássaros voam no céu.'],['swim','nadar','suím','Fish swim in the water.','Os peixes nadam na água.']],
'e4.3':[['cow','vaca','cáu','The cow is white.','A vaca é branca.'],['horse','cavalo','rórs','The horse runs fast.','O cavalo corre rápido.'],['pig','porco','pig','The pig is pink.','O porco é rosa.'],['chicken','galinha','tchíken','The chicken has eggs.','A galinha tem ovos.'],['duck','pato','dâk','A duck in the water.','Um pato na água.']],
'e4.4':[['lion','leão','láian','The lion is strong.','O leão é forte.'],['elephant','elefante','élifant','The elephant is big.','O elefante é grande.'],['monkey','macaco','mânki','The monkey is fast.','O macaco é rápido.'],['tiger','tigre','táigâr','A tiger has stripes.','O tigre tem listras.']],
'e4.5':[['bear','urso','bér','Bobby is a bear.','O Bobby é um urso.'],['rabbit','coelho','rébit','The rabbit can jump.','O coelho sabe pular.'],['big','grande','big','The bear is big.','O urso é grande.'],['small','pequeno','smól','The rabbit is small.','O coelho é pequeno.']],
'e5.1':[['water','água','uótâr','I drink water.','Eu bebo água.'],['milk','leite','milk','Milk is white.','O leite é branco.'],['drink','beber','drink','I drink milk at night.','Eu bebo leite à noite.']],
'e5.2':[['bread','pão','bréd','Bread and cheese, please.','Pão e queijo, por favor.'],['cheese','queijo','tchíz','I like cheese.','Eu gosto de queijo.'],['butter','manteiga','bâtâr','Bread with butter.','Pão com manteiga.'],['egg','ovo','ég','Two eggs for breakfast.','Dois ovos no café da manhã.']],
'e5.3':[['apple','maçã','épol','I eat an apple.','Eu como uma maçã.'],['banana','banana','banâna','The banana is yellow.','A banana é amarela.'],['orange','laranja','órinj','Orange juice, please.','Suco de laranja, por favor.'],['grape','uva','grêip','Grapes are small.','As uvas são pequenas.']],
'e5.4':[['cake','bolo','quêik','The birthday cake is big.','O bolo de aniversário é grande.'],['candy','bala / doce','kéndi','I like candy.','Eu gosto de bala.'],['chocolate','chocolate','tchóklat','Chocolate cake!','Bolo de chocolate!'],['ice cream','sorvete','áis crím','I want ice cream.','Eu quero sorvete.']],
'e5.5':[['breakfast','café da manhã','brékfâst','Breakfast is at seven.','O café da manhã é às sete.'],['lunch','almoço','lântch','Lunch at noon.','Almoço ao meio-dia.'],['dinner','jantar','dínâr','Dinner with my family.','Jantar com a minha família.']],
'e6.1':[['head','cabeça','réd','My head hurts.','Minha cabeça dói.'],['hand','mão','rénd','Wash your hands!','Lave as suas mãos!'],['arm','braço','árm','My arm is strong.','Meu braço é forte.'],['leg','perna','lég','Two legs to walk.','Duas pernas para andar.'],['foot','pé','fút','One foot, two feet.','Um pé, dois pés.']],
'e6.2':[['eye','olho','ái','She has blue eyes.','Ela tem olhos azuis.'],['nose','nariz','nouz','My nose is cold.','Meu nariz está frio.'],['mouth','boca','máuth','Open your mouth.','Abra a sua boca.'],['ear','orelha','íâr','Two ears to listen.','Duas orelhas para ouvir.'],['hair','cabelo','rér','He has brown hair.','Ele tem cabelo castanho.']],
'e6.3':[['shirt','camisa','chârt','A blue shirt.','Uma camisa azul.'],['shoes','sapatos','chúz','My shoes are new.','Meus sapatos são novos.'],['pants','calça','pénts','Black pants.','Calça preta.'],['socks','meias','sóks','White socks.','Meias brancas.']],
'e6.4':[['dress','vestido','drés','A red dress.','Um vestido vermelho.'],['hat','chapéu','rét','Bobby has a hat.','O Bobby tem um chapéu.'],['coat','casaco','kout','It is cold: wear a coat.','Está frio: use um casaco.'],['skirt','saia','skârt','A green skirt.','Uma saia verde.']],
'e6.5':[['wear','vestir / usar','uér','I wear a hat.','Eu uso um chapéu.'],['put on','vestir (colocar)','put ón','Put on your shoes.','Calce os seus sapatos.'],['take off','tirar','têik óf','Take off your coat.','Tire o seu casaco.'],['get dressed','vestir-se','guét drést','I get dressed at seven.','Eu me visto às sete.']],
'e7.1':[['house','casa','ráus','My house is small.','Minha casa é pequena.'],['home','lar / casa','roum','I am going home.','Eu estou indo para casa.'],['door','porta','dór','Open the door, please.','Abra a porta, por favor.'],['window','janela','uíndou','The window is open.','A janela está aberta.']],
'e7.2':[['kitchen','cozinha','kítchen','Mom is in the kitchen.','A mãe está na cozinha.'],['bedroom','quarto','bédrum','My bedroom is blue.','Meu quarto é azul.'],['bathroom','banheiro','béthrum','Where is the bathroom?','Onde fica o banheiro?'],['living room','sala','lívin rum','We watch TV in the living room.','A gente assiste TV na sala.']],
'e7.3':[['table','mesa','têibol','The book is on the table.','O livro está em cima da mesa.'],['chair','cadeira','tchér','Four chairs.','Quatro cadeiras.'],['bed','cama','béd','My bed is soft.','Minha cama é macia.'],['sofa','sofá','sôufa','The cat sleeps on the sofa.','O gato dorme no sofá.']],
'e7.4':[['garden','jardim','gárden','We play in the garden.','A gente brinca no jardim.'],['yard','quintal','iárd','A big yard.','Um quintal grande.'],['garage','garagem','garáj','The car is in the garage.','O carro está na garagem.'],['roof','telhado','rúf','A bird on the roof.','Um pássaro no telhado.']],
'e7.5':[['key','chave','kí','Where is the key?','Onde está a chave?'],['light','luz','láit','Turn on the light.','Acenda a luz.'],['lamp','luminária','lémp','The lamp is old.','A luminária é velha.'],['clock','relógio','klók','The clock says three.','O relógio marca três horas.']],
'e8.1':[['run','correr','rân','I run in the park.','Eu corro no parque.'],['eat','comer','ít','I eat bread.','Eu como pão.'],['drink','beber','drink','I drink water.','Eu bebo água.']],
'e8.2':[['sleep','dormir','slíp','I sleep at nine.','Eu durmo às nove.'],['play','brincar / jogar','plêi','I play with my dog.','Eu brinco com o meu cachorro.'],['rest','descansar','rést','Rest a little.','Descanse um pouco.']],
'e8.3':[['read','ler','ríd','I read a book.','Eu leio um livro.'],['write','escrever','ráit','Write your name.','Escreva o seu nome.'],['listen','ouvir','lísen','Listen to the teacher.','Escute a professora.'],['speak','falar','spík','I speak English.','Eu falo inglês.']],
'e8.4':[['walk','andar','uók','I walk to school.','Eu vou andando para a escola.'],['sing','cantar','sing','She can sing.','Ela sabe cantar.'],['jump','pular','djâmp','The rabbit can jump.','O coelho sabe pular.'],['dance','dançar','déns','We dance together.','A gente dança junto.']],
'e8.5':[['I can','eu consigo / eu sei','ái kén','I can swim.','Eu sei nadar.'],['I like','eu gosto','ái láik','I like dogs.','Eu gosto de cachorros.'],['I do not like','eu não gosto','ái dont láik','I do not like fish.','Eu não gosto de peixe.'],['I cannot','eu não consigo','ái ként','I cannot fly.','Eu não consigo voar.']],
'e9.1':[['what','o quê','uót','What is this?','O que é isto?'],['where','onde','uér','Where is the key?','Onde está a chave?'],['what is this','o que é isto','uót iz dis','What is this? — A book.','O que é isto? — Um livro.']],
'e9.2':[['who','quem','rú','Who is that?','Quem é aquele?'],['when','quando','uén','When is your birthday?','Quando é o seu aniversário?'],['why','por quê','uái','Why are you sad?','Por que você está triste?'],['because','porque','bicóz','Because I am tired.','Porque eu estou cansado.']],
'e9.3':[['how many','quantos','ráu méni','How many books?','Quantos livros?'],['how much','quanto','ráu mâtch','How much water?','Quanta água?'],['how much is it','quanto custa','ráu mâtch iz it','How much is it? — Five dollars.','Quanto custa? — Cinco dólares.']],
'e9.4':[['how are you','como você está','ráu ár iú','Hi! How are you?','Oi! Como você está?'],['I am fine','estou bem','áim fáin','I am fine, thank you.','Eu estou bem, obrigado.'],['and you','e você','énd iú','I am fine. And you?','Eu estou bem. E você?']],
'e9.5':[['how old are you','quantos anos você tem','ráu ould ár iú','How old are you?','Quantos anos você tem?'],['I am eight years old','eu tenho oito anos','ái ém eit íârs ould','I am eight years old.','Eu tenho oito anos.'],['birthday','aniversário','bârthdei','My birthday is in May.','Meu aniversário é em maio.']],
'e10.1':[['yesterday','ontem','iéstârdei','Yesterday I played.','Ontem eu brinquei.'],['today','hoje','tudêi','Today is Monday.','Hoje é segunda-feira.'],['tomorrow','amanhã','tumórou','See you tomorrow!','Até amanhã!']],
'e10.2':[['excuse me','com licença','ikskiúz mi','Excuse me, where is the door?','Com licença, onde fica a porta?'],['I am sorry','me desculpe','áim sóri','I am sorry, my mistake.','Me desculpe, foi erro meu.'],['I do not understand','eu não entendi','ái dont ândârstend','Sorry, I do not understand.','Desculpe, eu não entendi.'],['can you repeat','pode repetir','kén iú ripít','Can you repeat, please?','Pode repetir, por favor?']],
'e10.3':[['can I have','posso ter','kén ái rév','Can I have some water, please?','Posso beber um pouco de água, por favor?'],['could you help me','você pode me ajudar','kud iú rélp mi','Could you help me, please?','Você pode me ajudar, por favor?'],['thank you so much','muito obrigado','tênk iú sou mâtch','Thank you so much!','Muito obrigado!'],['of course','claro','óv córs','Of course! Here you are.','Claro! Aqui está.']],
'e10.4':[['important','importante','impórtant','This is important.','Isto é importante.'],['actually','na verdade','ékchuali','Actually, I am nine.','Na verdade, eu tenho nove anos.'],['push','empurrar','puch','Push the door.','Empurre a porta.'],['parents','pais','pérents','My parents are here.','Meus pais estão aqui.']],
'e10.5':[['hello','olá','rélou','Hello, my friend!','Olá, meu amigo!'],['thank you','obrigado','tênk iú','Thank you very much.','Muito obrigado.'],['I can','eu consigo','ái kén','I can speak English!','Eu sei falar inglês!'],['friend','amigo(a)','frénd','You are my friend.','Você é meu amigo.'],['today','hoje','tudêi','Today I finished the galaxy.','Hoje eu terminei a galáxia.']]
};

/* distratores: completa com palavras do mesmo mundo, nunca repetindo a certa */
const _norm=t=>String(t).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z ]/g,'').trim();
/* duas opções "colam" se uma é a mesma coisa que a outra (oi x oi / olá) — nunca podem aparecer juntas */
function _colide(a,b){
  const x=_norm(a),y=_norm(b);
  if(!x||!y)return true;
  if(x===y)return true;
  const px=x.split(/ +/),py=y.split(/ +/);
  return px.some(p=>p.length>1&&py.indexOf(p)>=0);
}
function _outrasEN(id,alvo,campo){
  const m=+id.slice(1).split('.')[0];
  const certa=campo==='en'?alvo.en:alvo.pt;
  const par=campo==='en'?alvo.pt:alvo.en;
  const daFase=(LEX[id]||[]).map(w=>({en:w[0],pt:w[1]}));
  const doMundo=(VOC[m]||[]).map(x=>({en:x[0],pt:x[1]}));
  const vistos={};const res=[];
  shuf(daFase).concat(shuf(doMundo)).forEach(w=>{
    if(res.length>=3)return;
    const v=campo==='en'?w.en:w.pt;
    const outroLado=campo==='en'?w.pt:w.en;
    if(_colide(v,certa))return;              /* mesma palavra ou sinônimo da certa */
    if(_colide(outroLado,par))return;        /* traduz para a mesma coisa que a certa */
    if(res.some(r=>_colide(r,v)))return;     /* dois distratores iguais entre si */
    if(vistos[v])return;
    vistos[v]=1;res.push(v);
  });
  return res;
}
/* palavras iguais nas duas línguas (banana, chocolate): perguntar o significado não ensina nada */
const _igual=w=>_norm(w.en)===_norm(w.pt);
/* progressão de uma fase: apresentar → reconhecer → ouvir → produzir → frase → escrever */
function enMakers(id){
  const L=(LEX[id]||[]).map(w=>({en:w[0],pt:w[1],fala:w[2],frase:w[3],frasePt:w[4]}));
  if(!L.length)return null;
  /* O cursor era compartilhado pelos 6 makers e andava de 1 em 1. Com 3 palavras por fase,
     6 chamadas fechavam a volta exata e a 2ª rodada repetia palavra por palavra —
     genQuestions descartava tudo como duplicado e a fase saía com 6 perguntas em vez de 8.
     Reembaralhar a cada volta quebra esse alinhamento e ainda varia a fase a cada jogada. */
  let ordem=shuf(L),k=0;
  const gira=()=>{const w=ordem[k%ordem.length];k++;if(k%ordem.length===0){ordem=shuf(L);k=0;}return w;};
  return [
   /* 1. apresentação: a resposta está escrita no enunciado — aqui a criança aprende, não adivinha */
   ()=>{const w=gira();
     const ex=w.frase&&w.frasePt?'<span class="trad">Exemplo: '+w.frase+' = '+w.frasePt+'</span>':'';
     return mc('Em inglês, <b>'+w.pt+'</b> se diz <b>'+w.en+'</b> — fala-se “'+w.fala+'”.'+ex+'<br>Agora toque em <b>'+w.pt+'</b> escrito em inglês:',
       w.en,_outrasEN(id,w,'en'),{ouvir:w.en,lang:'en-US',dica:'A resposta está escrita no enunciado: <b>'+w.en+'</b>.'});},
   /* 2. reconhecer: vê o inglês, escolhe o significado */
   ()=>{let w=gira(),n=0;
     while(_igual(w)&&n++<L.length)w=gira();
     if(_igual(w)){
       const falas=L.filter(x=>x.fala&&x.fala!==w.fala).map(x=>x.fala);
       if(falas.length>=2)return mc('<b>'+w.en+'</b> se escreve igual em português! Toque no som certo em inglês:',
         w.fala,shuf(falas).slice(0,3),{ouvir:w.en,lang:'en-US',dica:'Aperte o som e escute com atenção.'});
       const o=L.filter(x=>!_igual(x))[0]||w;
       return mc('O que significa <b>'+o.en+'</b>?',o.pt,_outrasEN(id,o,'pt'),{ouvir:o.en,lang:'en-US'});
     }
     return mc('O que significa <b>'+w.en+'</b>?',w.pt,_outrasEN(id,w,'pt'),
       {ouvir:w.en,lang:'en-US',dica:'Fala-se “'+w.fala+'”. Lembra da aula?'});},
   /* 3. ouvir */
   ()=>{const w=gira();
     return ouvirEN('Ouça e escolha a palavra que você ouviu.',w.en,_outrasEN(id,w,'en'));},
   /* 4. produzir: do português para o inglês */
   ()=>{const w=gira();
     return mc('Como se diz <b>'+w.pt+'</b> em inglês?',w.en,_outrasEN(id,w,'en'),
       {ouvir:w.en,lang:'en-US',dica:'Começa com <b>'+w.en.charAt(0).toUpperCase()+'</b> e fala-se “'+w.fala+'”.'});},
   /* 5. dentro de uma frase de verdade — sempre com a tradução do lado */
   ()=>{const w=gira();
     if(!w.frase)return mc('Qual é a tradução de <b>'+w.pt+'</b>?',w.en,_outrasEN(id,w,'en'),{ouvir:w.en,lang:'en-US'});
     const trad=w.frasePt?'<span class="trad">Em português: '+w.frasePt+'</span>':'';
     const buraco=w.frase.replace(new RegExp(w.en.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),'i'),'____');
     if(buraco===w.frase)return mc('Nesta frase, o que quer dizer <b>'+w.en+'</b>?<br><b class="fr">'+w.frase+'</b>'+trad,
       w.pt,_outrasEN(id,w,'pt'),{ouvir:w.frase,lang:'en-US'});
     return mc('Complete a frase:<br><b class="fr">'+buraco+'</b>'+trad,w.en,_outrasEN(id,w,'en'),
       {ouvir:w.frase,lang:'en-US',dica:'A tradução está logo abaixo da frase: procure a palavra que quer dizer “'+w.pt+'”.'});},
   /* 6. escrever (só palavras curtas de uma palavra só) */
   ()=>{const curtas=L.filter(w=>w.en.length<8&&w.en.indexOf(' ')<0&&!_igual(w));
     if(!curtas.length){const w=gira();
       return mc('Qual destas é <b>“'+w.pt+'”</b> em inglês?',w.en,_outrasEN(id,w,'en'),
         {ouvir:w.en,lang:'en-US',dica:'Fala-se “'+w.fala+'”.'});}
     const w=curtas[(k++)%curtas.length];
     return txtQ('Escreva em inglês: <b>'+w.pt+'</b>',w.en,{teclado:'letra',dica:'Tem '+w.en.length+' letras e começa com <b>'+w.en.charAt(0).toUpperCase()+'</b>.'});}
  ];
}

/* --- aplica a progressão didática em todas as 50 fases de inglês ---
   ordem: apresentar → reconhecer → ouvir → (prática da fase) → produzir → frase → escrever */
(function(){
  if(typeof UNITS_EN==='undefined')return;
  UNITS_EN.forEach(u=>u.lessons.forEach(l=>{
    const g=enMakers(l.id);
    if(!g)return;
    const extra=l.custom||[];
    l.makers=g.slice(0,3).concat(extra,g.slice(3));
    l.ordem=true;
  }));
})();

/* alimenta o índice de pronúncia/significado usado quando não há voz em inglês */
(function(){
  if(typeof FALA_EN==='undefined')return;
  Object.keys(LEX).forEach(id=>LEX[id].forEach(w=>{
    const k=String(w[0]).toLowerCase();
    if(w[2]&&!FALA_EN[k])FALA_EN[k]=w[2];
    if(w[1]&&!SIG_EN[k])SIG_EN[k]=w[1];
  }));
  if(typeof VOC!=='undefined')Object.keys(VOC).forEach(m=>VOC[m].forEach(x=>{
    const k=String(x[0]).toLowerCase();
    if(x[1]&&!SIG_EN[k])SIG_EN[k]=x[1];
  }));
  if(typeof FRASES!=='undefined')FRASES.forEach(f=>{
    const k=String(f[0]).toLowerCase();
    if(f[1]&&!SIG_EN[k])SIG_EN[k]=f[1];
  });
})();

