/* ===== Português: currículo do zero (10 mundos × 5 fases) ===== */
const PAL=[
 {p:'bola',s:['bo','la']},{p:'gato',s:['ga','to']},{p:'pato',s:['pa','to']},{p:'bolo',s:['bo','lo']},
 {p:'dedo',s:['de','do']},{p:'fada',s:['fa','da']},{p:'faca',s:['fa','ca']},{p:'lata',s:['la','ta']},
 {p:'luva',s:['lu','va']},{p:'mala',s:['ma','la']},{p:'mesa',s:['me','sa']},{p:'moto',s:['mo','to']},
 {p:'nave',s:['na','ve']},{p:'pipa',s:['pi','pa']},{p:'rato',s:['ra','to']},{p:'rosa',s:['ro','sa']},
 {p:'sapo',s:['sa','po']},{p:'sino',s:['si','no']},{p:'tatu',s:['ta','tu']},{p:'vaca',s:['va','ca']},
 {p:'vela',s:['ve','la']},{p:'casa',s:['ca','sa']},{p:'copo',s:['co','po']},{p:'cama',s:['ca','ma']},
 {p:'dado',s:['da','do']},{p:'fogo',s:['fo','go']},{p:'gelo',s:['ge','lo']},{p:'mapa',s:['ma','pa']},
 {p:'nuvem',s:['nu','vem']},{p:'peixe',s:['pei','xe']},{p:'porta',s:['por','ta']},{p:'livro',s:['li','vro']},
 {p:'cavalo',s:['ca','va','lo']},{p:'banana',s:['ba','na','na']},{p:'sapato',s:['sa','pa','to']},
 {p:'janela',s:['ja','ne','la']},{p:'menino',s:['me','ni','no']},{p:'menina',s:['me','ni','na']},
 {p:'boneca',s:['bo','ne','ca']},{p:'tomate',s:['to','ma','te']},{p:'macaco',s:['ma','ca','co']},
 {p:'estrela',s:['es','tre','la']},{p:'caneta',s:['ca','ne','ta']},{p:'camisa',s:['ca','mi','sa']},
 {p:'cabelo',s:['ca','be','lo']},{p:'escola',s:['es','co','la']},{p:'girafa',s:['gi','ra','fa']},
 {p:'pipoca',s:['pi','po','ca']},{p:'sorvete',s:['sor','ve','te']},{p:'foguete',s:['fo','gue','te']},
 {p:'abacaxi',s:['a','ba','ca','xi']},{p:'borboleta',s:['bor','bo','le','ta']},
 {p:'telefone',s:['te','le','fo','ne']},{p:'bicicleta',s:['bi','ci','cle','ta']},
 {p:'chocolate',s:['cho','co','la','te']},{p:'elefante',s:['e','le','fan','te']}
];
const pal2=()=>PAL.filter(x=>x.s.length===2);
const pal3=()=>PAL.filter(x=>x.s.length===3);
const palN=n=>PAL.filter(x=>x.s.length===n);
const ALFA='ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const VOG=['A','E','I','O','U'];
const maiusc=w=>w.charAt(0).toUpperCase()+w.slice(1);
function txtQ(prompt,resp,o){return Object.assign({type:'texto',prompt:prompt,answer:String(resp)},o||{});}
function silQ(prompt,palavra,silabas,o){
  const extras=shuf(['ba','te','mi','lo','ru','pe','sa','na','vi','co']).slice(0,2);
  return Object.assign({type:'silabas',prompt:prompt,answer:palavra,
    pecas:shuf(silabas.concat(extras)),n:silabas.length},o||{});
}
function ouvirQ(prompt,certa,erradas,o){
  return Object.assign({type:'mc',ouvir:certa,prompt:prompt,
    options:shuf([certa].concat(erradas)),answer:certa},o||{});
}
const fig=(t)=>'<div class="palavrao">'+t+'</div>';

const UNITS_PT=[];
const LP=(id,glyph,title,teach,makers)=>({id:id,glyph:glyph,title:title,teach:teach,makers:makers});

/* ---------- MUNDO 1 — as letras ---------- */
UNITS_PT.push({n:1,title:'As letras',sub:'Vogais, consoantes e o alfabeto inteiro, do começo.',tone:'verde',lessons:[
LP('p1.1','A','As vogais',
 {ideia:'As vogais são cinco: <b>A E I O U</b>. Toda palavra do português tem pelo menos uma vogal.',
  exemplo:'BOLA tem O e A. CASA tem duas letras A.',
  dica:'Cante o A-E-I-O-U. Elas aparecem em tudo.'},
 [
  ()=>{const v=pick(VOG);return mc('Qual delas é uma <b>vogal</b>?',v,shuf(['B','C','D','F','G','M','P']).slice(0,3));},
  ()=>{const c=pick(['B','C','D','F','G','J','L','M','P','T']);return mc('Qual delas <b>não</b> é vogal?',c,shuf(VOG).slice(0,3));},
  ()=>{const w=pick(PAL);const v=w.p.split('').filter(c=>'aeiou'.indexOf(c)>=0);
       return inp('Quantas vogais tem a palavra <b>'+w.p.toUpperCase()+'</b>?',v.length,{figure:fig(w.p.toUpperCase())});},
  ()=>{const w=pick(PAL);return mc('Qual é a <b>primeira vogal</b> de '+w.p.toUpperCase()+'?',
       w.p.split('').filter(c=>'aeiou'.indexOf(c)>=0)[0].toUpperCase(),shuf(VOG).slice(0,3),{figure:fig(w.p.toUpperCase())});},
  ()=>{return inp('Quantas vogais existem no alfabeto?',5);},
  ()=>{const v=pick(VOG);return txtQ('Escreva a vogal que vem depois de <b>'+VOG[Math.max(0,VOG.indexOf(v)-1)]+'</b>.',
       VOG[Math.min(4,Math.max(0,VOG.indexOf(v)-1)+1)],{teclado:'vogal'});}
 ]),
LP('p1.2','Bb','O alfabeto',
 {ideia:'O alfabeto tem <b>26 letras</b>. Elas sempre aparecem na mesma ordem, e é essa ordem que organiza o dicionário e a lista de chamada.',
  exemplo:'A, B, C, D, E, F, G... até Z.',
  dica:'Cante o alfabeto batendo palma em cada letra. A ordem gruda pelo ritmo.'},
 [
  ()=>{const i=R(0,23);return mc('Qual letra vem <b>depois</b> do '+ALFA[i]+'?',ALFA[i+1],shuf(ALFA.filter((_,k)=>k!==i+1)).slice(0,3));},
  ()=>{const i=R(1,25);return mc('Qual letra vem <b>antes</b> do '+ALFA[i]+'?',ALFA[i-1],shuf(ALFA.filter((_,k)=>k!==i-1)).slice(0,3));},
  ()=>{const i=R(0,23);return txtQ('Complete: '+ALFA[i]+' , '+ALFA[i+1]+' , ___',ALFA[i+2]);},
  ()=>{return inp('Quantas letras tem o alfabeto?',26);},
  ()=>{const i=R(0,25);return mc('A letra '+ALFA[i]+' é vogal ou consoante?',VOG.indexOf(ALFA[i])>=0?'vogal':'consoante',[VOG.indexOf(ALFA[i])>=0?'consoante':'vogal']);},
  ()=>{const w=pick(PAL);return txtQ('Escreva a <b>primeira letra</b> de '+w.p.toUpperCase()+'.',w.p[0].toUpperCase(),{figure:fig(w.p.toUpperCase())});}
 ]),
LP('p1.3','Aa','Maiúscula e minúscula',
 {ideia:'Cada letra tem duas formas: a <b>maiúscula</b> (grandona) e a <b>minúscula</b> (pequena). São a mesma letra, com roupas diferentes.',
  exemplo:'A e a. B e b. Casa começa com C maiúsculo quando abre a frase.',
  dica:'Nome de gente, de cidade e começo de frase pedem maiúscula.'},
 [
  ()=>{const i=R(0,25);return mc('Qual é a <b>minúscula</b> de '+ALFA[i]+'?',ALFA[i].toLowerCase(),
       shuf(ALFA.filter((_,k)=>k!==i)).slice(0,3).map(x=>x.toLowerCase()));},
  ()=>{const i=R(0,25);return mc('Qual é a <b>maiúscula</b> de '+ALFA[i].toLowerCase()+'?',ALFA[i],
       shuf(ALFA.filter((_,k)=>k!==i)).slice(0,3));},
  ()=>{const w=pick(PAL);return mc('Como se escreve o nome de uma pessoa chamada '+maiusc(w.p)+'?',maiusc(w.p),[w.p,w.p.toUpperCase()]);},
  ()=>{return tf('Toda frase começa com letra maiúscula.',true);},
  ()=>{return tf('O nome de uma cidade pode começar com letra minúscula.',false);},
  ()=>{const w=pick(PAL);return txtQ('Escreva a primeira letra de '+w.p.toUpperCase()+' em <b>maiúscula</b>.',w.p[0].toUpperCase());}
 ]),
LP('p1.4','?','Com que letra começa',
 {ideia:'Toda palavra tem um <b>som inicial</b>, e esse som é a primeira letra. Reconhecer o som do começo é o primeiro passo da leitura.',
  exemplo:'GATO começa com G. ESCOLA começa com E.',
  dica:'Fale a palavra devagar e segure o primeiro som: Gggg... gato.'},
 [
  ()=>{const w=pick(PAL);return mc('Com que letra começa <b>'+w.p.toUpperCase()+'</b>?',w.p[0].toUpperCase(),
       shuf(ALFA.filter(x=>x!==w.p[0].toUpperCase())).slice(0,3),{figure:fig(w.p.toUpperCase())});},
  ()=>{const w=pick(PAL);return mc('Com que letra <b>termina</b> '+w.p.toUpperCase()+'?',w.p.slice(-1).toUpperCase(),
       shuf(ALFA.filter(x=>x!==w.p.slice(-1).toUpperCase())).slice(0,3),{figure:fig(w.p.toUpperCase())});},
  ()=>{const l=pick(['B','C','F','G','M','P','S','T']);
       const certa=PAL.filter(x=>x.p[0].toUpperCase()===l);
       if(!certa.length)return mc('Qual palavra começa com M?','mala',['gato','pipa']);
       const w=pick(certa),outras=shuf(PAL.filter(x=>x.p[0].toUpperCase()!==l)).slice(0,3).map(x=>x.p);
       return mc('Qual palavra começa com <b>'+l+'</b>?',w.p,outras);},
  ()=>{const w=pick(PAL);return txtQ('Escreva a letra com que começa '+w.p.toUpperCase()+'.',w.p[0].toUpperCase(),{figure:fig(w.p.toUpperCase())});},
  ()=>{const w=pick(PAL);return inp('Quantas letras tem a palavra '+w.p.toUpperCase()+'?',w.p.length,{figure:fig(w.p.toUpperCase())});},
  ()=>{const w=pick(PAL),o=shuf(PAL.filter(x=>x.p!==w.p)).slice(0,3).map(x=>x.p);
       return ouvirQ('Ouça e toque na palavra certa.',w.p,o);}
 ]),
LP('p1.5','AZ','Ordem alfabética',
 {ideia:'Colocar em <b>ordem alfabética</b> é organizar as palavras seguindo o alfabeto: primeiro as de A, depois as de B, e assim por diante.',
  exemplo:'bola vem antes de casa, porque B vem antes de C.',
  dica:'Se as duas começam igual, olhe a segunda letra: casa vem antes de copo.'},
 [
  ()=>{const a=pick(PAL),b=pick(PAL.filter(x=>x.p[0]!==a.p[0]));
       const [x,y]=a.p<b.p?[a.p,b.p]:[b.p,a.p];
       return mc('Qual palavra vem <b>primeiro</b> no alfabeto?',x,[y]);},
  ()=>{const a=pick(PAL),b=pick(PAL.filter(x=>x.p[0]!==a.p[0]));
       const [x,y]=a.p<b.p?[a.p,b.p]:[b.p,a.p];
       return mc('Qual palavra vem <b>por último</b> no alfabeto?',y,[x]);},
  ()=>{const i=R(0,22);const tres=shuf([ALFA[i],ALFA[i+1],ALFA[i+2]]);
       return mc('Qual destas letras vem primeiro?',ALFA[i],tres.filter(x=>x!==ALFA[i]));},
  ()=>{const i=R(0,20);return mc('Coloque em ordem: '+ALFA[i+2]+', '+ALFA[i]+', '+ALFA[i+1],
       ALFA[i]+' '+ALFA[i+1]+' '+ALFA[i+2],[ALFA[i+2]+' '+ALFA[i+1]+' '+ALFA[i],ALFA[i+1]+' '+ALFA[i]+' '+ALFA[i+2]]);},
  ()=>{return tf('No dicionário, a palavra "abacaxi" vem antes de "bola".',true);},
  ()=>{return tf('A letra Z é a primeira do alfabeto.',false);}
 ])
]});

/* ---------- MUNDO 2 — sílabas ---------- */
UNITS_PT.push({n:2,title:'As sílabas',sub:'Bater palma em cada pedaço da palavra e juntar tudo de novo.',tone:'agua',lessons:[
LP('p2.1','ba','Bater as sílabas',
 {ideia:'<b>Sílaba</b> é cada pedacinho que a gente fala de uma vez só. BO-LA tem duas sílabas: dá para bater duas palmas.',
  exemplo:'CA-SA = 2 sílabas. CA-VA-LO = 3 sílabas.',
  dica:'Fale a palavra batendo palma. Cada palma é uma sílaba.'},
 [
  ()=>{const w=pick(PAL);return inp('Quantas sílabas tem <b>'+w.p.toUpperCase()+'</b>? (bata palma!)',w.s.length,{figure:fig(w.s.join(' - ').toUpperCase())});},
  ()=>{const w=pick(pal2());return mc('Como se separa '+w.p.toUpperCase()+'?',w.s.join(' - '),
       [w.p[0]+' - '+w.p.slice(1),w.p.slice(0,3)+' - '+w.p.slice(3)]);},
  ()=>{const w=pick(pal3());return mc('Como se separa '+w.p.toUpperCase()+'?',w.s.join(' - '),
       [w.s[0]+w.s[1]+' - '+w.s[2],w.s[0]+' - '+w.s[1]+w.s[2]]);},
  ()=>{const w=pick(PAL);return mc('Qual é a <b>primeira sílaba</b> de '+w.p.toUpperCase()+'?',w.s[0],
       shuf(PAL.filter(x=>x.s[0]!==w.s[0])).slice(0,3).map(x=>x.s[0]));},
  ()=>{const w=pick(PAL);return mc('Qual é a <b>última sílaba</b> de '+w.p.toUpperCase()+'?',w.s[w.s.length-1],
       shuf(PAL.filter(x=>x.s[x.s.length-1]!==w.s[w.s.length-1])).slice(0,3).map(x=>x.s[x.s.length-1]));},
  ()=>{const n=pick([2,3]),w=pick(palN(n)),o=shuf(PAL.filter(x=>x.s.length!==n)).slice(0,3).map(x=>x.p);
       return mc('Qual palavra tem <b>'+n+' sílabas</b>?',w.p,o);}
 ]),
LP('p2.2','BA','Sílabas com B, C, D',
 {ideia:'Juntando uma consoante com uma vogal nasce uma sílaba: B + A = <b>BA</b>. É assim que a leitura começa.',
  exemplo:'BA BE BI BO BU · CA CO CU · DA DE DI DO DU',
  dica:'Leia a família toda em voz alta antes de tentar a palavra.'},
 [
  ()=>{const c=pick(['B','C','D']),v=pick(VOG);return txtQ('Junte as letras: <b>'+c+' + '+v+'</b> = ?',c+v,{teclado:'letra'});},
  ()=>{const c=pick(['B','C','D']),v=pick(VOG);return mc('Como se lê '+c+' com '+v+'?',(c+v).toLowerCase(),
       shuf(VOG.filter(x=>x!==v)).slice(0,3).map(x=>(c+x).toLowerCase()));},
  ()=>{const w=pick(PAL.filter(x=>'bcd'.indexOf(x.p[0])>=0));
       return silQ('Monte a palavra <b>'+w.p.toUpperCase()+'</b> tocando nas sílabas.',w.p,w.s);},
  ()=>{const w=pick(PAL.filter(x=>'bcd'.indexOf(x.p[0])>=0));
       return mc('Qual palavra começa com a sílaba <b>'+w.s[0].toUpperCase()+'</b>?',w.p,
       shuf(PAL.filter(x=>x.s[0]!==w.s[0])).slice(0,3).map(x=>x.p));},
  ()=>{const v=pick(VOG);return mc('BA, BE, BI, BO, BU — qual falta aqui: BA, BE, ___, BO, BU?','BI',['BU','BA','BE']);},
  ()=>{const w=pick(PAL.filter(x=>'bcd'.indexOf(x.p[0])>=0));
       return ouvirQ('Ouça e escolha a palavra.',w.p,shuf(PAL.filter(x=>x.p!==w.p)).slice(0,3).map(x=>x.p));}
 ]),
LP('p2.3','FA','Sílabas com F, G, L, M',
 {ideia:'Cada consoante forma a sua família de sílabas com as cinco vogais.',
  exemplo:'FA FE FI FO FU · GA GO GU · LA LE LI LO LU · MA ME MI MO MU',
  dica:'Cuidado com o G: com E e I ele muda de som (GE, GI).'},
 [
  ()=>{const c=pick(['F','L','M']),v=pick(VOG);return txtQ('Junte: <b>'+c+' + '+v+'</b> = ?',c+v,{teclado:'letra'});},
  ()=>{const w=pick(PAL.filter(x=>'flmg'.indexOf(x.p[0])>=0));
       return silQ('Monte a palavra <b>'+w.p.toUpperCase()+'</b>.',w.p,w.s);},
  ()=>{const w=pick(PAL.filter(x=>'flmg'.indexOf(x.p[0])>=0));
       return mc('Qual é a primeira sílaba de '+w.p.toUpperCase()+'?',w.s[0],
       shuf(PAL.filter(x=>x.s[0]!==w.s[0])).slice(0,3).map(x=>x.s[0]));},
  ()=>{return mc('Qual sílaba tem som de "gue"?','gue',['ge','gi','ga']);},
  ()=>{const w=pick(PAL.filter(x=>'flmg'.indexOf(x.p[0])>=0));
       return ouvirQ('Ouça com atenção e escolha.',w.p,shuf(PAL.filter(x=>x.p!==w.p)).slice(0,3).map(x=>x.p));},
  ()=>{const c=pick(['F','L','M']);return mc('Qual sílaba é da família do '+c+'?',c.toLowerCase()+'a',
       shuf(['ba','ta','pa','va','sa']).slice(0,3));}
 ]),
LP('p2.4','PA','Sílabas com N, P, R, T, V',
 {ideia:'Mais famílias para completar a leitura: NA NE NI NO NU, PA PE PI PO PU, RA RE RI RO RU, TA TE TI TO TU, VA VE VI VO VU.',
  exemplo:'PA + TO = PATO. VA + CA = VACA.',
  dica:'Leia devagar, uma sílaba de cada vez, e depois junte tudo rápido.'},
 [
  ()=>{const c=pick(['N','P','R','T','V']),v=pick(VOG);return txtQ('Junte: <b>'+c+' + '+v+'</b> = ?',c+v,{teclado:'letra'});},
  ()=>{const w=pick(PAL.filter(x=>'nprtv'.indexOf(x.p[0])>=0));
       return silQ('Monte a palavra <b>'+w.p.toUpperCase()+'</b>.',w.p,w.s);},
  ()=>{const w=pick(PAL.filter(x=>'nprtv'.indexOf(x.p[0])>=0));
       return mc('Que palavra é essa: '+w.s.join(' - ').toUpperCase()+'?',w.p,
       shuf(PAL.filter(x=>x.p!==w.p)).slice(0,3).map(x=>x.p));},
  ()=>{const w=pick(PAL.filter(x=>'nprtv'.indexOf(x.p[0])>=0));
       return ouvirQ('Ouça e escolha a palavra certa.',w.p,shuf(PAL.filter(x=>x.p!==w.p)).slice(0,3).map(x=>x.p));},
  ()=>{return mc('PA + PA forma qual palavra?','papa',['pato','pipa','popa']);},
  ()=>{const c=pick(['N','P','R','T','V']);return txtQ('Escreva a sílaba de <b>'+c+'</b> com <b>O</b>.',c+'O',{teclado:'letra'});}
 ]),
LP('p2.5','+','Juntar sílabas e formar palavras',
 {ideia:'Ler é juntar sílabas na ordem certa. Trocar a ordem muda tudo: BO-LO e LO-BO são palavras diferentes.',
  exemplo:'CA + SA = CASA. SA + CA = SACA.',
  dica:'Monte com o dedo, sílaba por sílaba, e leia em voz alta no fim.'},
 [
  ()=>{const w=pick(pal2());return silQ('Monte a palavra <b>'+w.p.toUpperCase()+'</b>.',w.p,w.s);},
  ()=>{const w=pick(pal3());return silQ('Monte a palavra <b>'+w.p.toUpperCase()+'</b>.',w.p,w.s);},
  ()=>{const w=pick(PAL);return mc('Que palavra formam estas sílabas: '+w.s.join(' + ')+'?',w.p,
       shuf(PAL.filter(x=>x.p!==w.p)).slice(0,3).map(x=>x.p));},
  ()=>{const w=pick(pal2());return txtQ('Escreva a palavra: '+w.s.join(' + ').toUpperCase(),w.p,{teclado:'letra'});},
  ()=>{return mc('Trocando a ordem, BO + LO vira LO + BO. Que palavra é essa?','lobo',['bolo','bola','bode']);},
  ()=>{const w=pick(PAL);return ouvirQ('Ouça e monte com os olhos: qual é?',w.p,shuf(PAL.filter(x=>x.p!==w.p)).slice(0,3).map(x=>x.p));}
 ])
]});

/* ---------- MUNDO 3 — primeiras palavras ---------- */
UNITS_PT.push({n:3,title:'Primeiras palavras',sub:'Ler e escrever palavras inteiras, de duas e três sílabas.',tone:'ambar',lessons:[
LP('p3.1','ab','Palavras de 2 sílabas',
 {ideia:'Palavras curtas são as primeiras que a gente lê sozinho. Duas sílabas, uma de cada vez.',
  exemplo:'BO-LA, GA-TO, CA-SA, MO-TO.',
  dica:'Leia a primeira sílaba, depois a segunda, e só então junte rápido.'},
 [
  ()=>{const w=pick(pal2());return silQ('Monte a palavra <b>'+w.p.toUpperCase()+'</b>.',w.p,w.s);},
  ()=>{const w=pick(pal2());return txtQ('Escreva: '+w.s.join(' - ').toUpperCase(),w.p,{teclado:'letra'});},
  ()=>{const w=pick(pal2());return ouvirQ('Ouça e escolha.',w.p,shuf(pal2().filter(x=>x.p!==w.p)).slice(0,3).map(x=>x.p));},
  ()=>{const w=pick(pal2());return mc('Que palavra é '+w.s[0].toUpperCase()+' + '+w.s[1].toUpperCase()+'?',w.p,
       shuf(pal2().filter(x=>x.p!==w.p)).slice(0,3).map(x=>x.p));},
  ()=>{const w=pick(pal2());return inp('Quantas letras tem '+w.p.toUpperCase()+'?',w.p.length,{figure:fig(w.p.toUpperCase())});},
  ()=>{const w=pick(pal2());return txtQ('Falta a última letra: '+w.p.slice(0,-1).toUpperCase()+'___',w.p.slice(-1).toUpperCase(),{teclado:'letra'});}
 ]),
LP('p3.2','abc','Palavras de 3 sílabas',
 {ideia:'Palavras maiores se leem do mesmo jeito: uma sílaba de cada vez, sem pular nenhuma.',
  exemplo:'CA-VA-LO, BA-NA-NA, SA-PA-TO.',
  dica:'Se embolar, tape com o dedo as sílabas que ainda não leu.'},
 [
  ()=>{const w=pick(pal3());return silQ('Monte a palavra <b>'+w.p.toUpperCase()+'</b>.',w.p,w.s);},
  ()=>{const w=pick(pal3());return ouvirQ('Ouça e escolha a palavra.',w.p,shuf(pal3().filter(x=>x.p!==w.p)).slice(0,3).map(x=>x.p));},
  ()=>{const w=pick(pal3());return mc('Que palavra é '+w.s.join(' - ').toUpperCase()+'?',w.p,
       shuf(pal3().filter(x=>x.p!==w.p)).slice(0,3).map(x=>x.p));},
  ()=>{const w=pick(pal3());return mc('Qual é a sílaba do <b>meio</b> de '+w.p.toUpperCase()+'?',w.s[1],
       [w.s[0],w.s[2]]);},
  ()=>{const w=pick(pal3());return txtQ('Escreva: '+w.s.join(' - ').toUpperCase(),w.p,{teclado:'letra'});},
  ()=>{const w=pick(pal3());return inp('Quantas sílabas tem '+w.p.toUpperCase()+'?',3,{figure:fig(w.s.join(' - ').toUpperCase())});}
 ]),
LP('p3.3','_','A sílaba que falta',
 {ideia:'Quando falta um pedaço da palavra, a gente descobre pelo som e pelo sentido.',
  exemplo:'CA ___ LO → só pode ser VA: CAVALO.',
  dica:'Leia o que tem, faça o som do buraco e veja qual sílaba encaixa.'},
 [
  ()=>{const w=pick(pal3()),i=R(0,2);const mostra=w.s.map((x,k)=>k===i?'___':x.toUpperCase()).join(' - ');
       return mc('Qual sílaba falta em '+mostra+'?',w.s[i],
       shuf(PAL.filter(x=>x.s.indexOf(w.s[i])<0)).slice(0,3).map(x=>x.s[0]));},
  ()=>{const w=pick(pal2()),i=R(0,1);const mostra=w.s.map((x,k)=>k===i?'___':x.toUpperCase()).join(' - ');
       return txtQ('Escreva a sílaba que falta: '+mostra,w.s[i],{teclado:'letra'});},
  ()=>{const w=pick(PAL);return mc('Complete: ___ '+w.s.slice(1).join(' ').toUpperCase(),w.s[0],
       shuf(PAL.filter(x=>x.s[0]!==w.s[0])).slice(0,3).map(x=>x.s[0]));},
  ()=>{const w=pick(PAL);return silQ('Monte de novo a palavra <b>'+w.p.toUpperCase()+'</b>.',w.p,w.s);},
  ()=>{const w=pick(pal3());return mc('Que palavra fica com '+w.s[0].toUpperCase()+' no começo?',w.p,
       shuf(pal3().filter(x=>x.s[0]!==w.s[0])).slice(0,3).map(x=>x.p));},
  ()=>{const w=pick(PAL);return ouvirQ('Ouça e complete com os olhos: qual é?',w.p,shuf(PAL.filter(x=>x.p!==w.p)).slice(0,3).map(x=>x.p));}
 ]),
LP('p3.4','↺','Letras embaralhadas',
 {ideia:'A ordem das letras muda a palavra. AMOR e ROMA têm as mesmas letras e significados bem diferentes.',
  exemplo:'T-A-G-O embaralhado é GATO.',
  dica:'Procure primeiro a vogal e monte a primeira sílaba.'},
 [
  ()=>{const w=pick(pal2());return mc('Que palavra se forma com estas sílabas: '+shuf(w.s).join(' + ').toUpperCase()+'?',w.p,
       shuf(pal2().filter(x=>x.p!==w.p)).slice(0,3).map(x=>x.p));},
  ()=>{const w=pick(pal2());return silQ('As sílabas se misturaram! Monte <b>'+w.p.toUpperCase()+'</b>.',w.p,w.s);},
  ()=>{const w=pick(pal3());return silQ('Monte <b>'+w.p.toUpperCase()+'</b> na ordem certa.',w.p,w.s);},
  ()=>{return mc('BO + LO = BOLO. E LO + BO = ?','lobo',['bolo','bola','loba']);},
  ()=>{return mc('CA + SA = CASA. E SA + CA = ?','saca',['casa','caso','sapo']);},
  ()=>{const w=pick(pal2());return txtQ('Escreva a palavra certa: '+shuf(w.s).join(' + ').toUpperCase(),w.p,{teclado:'letra'});}
 ]),
LP('p3.5','≈','Palavras parecidas',
 {ideia:'Trocar uma letra só já muda a palavra inteira. Por isso é preciso ler com atenção até o fim.',
  exemplo:'PATO e GATO. BOLA e BOLO. FACA e VACA.',
  dica:'Leia a palavra toda antes de responder — não chute pelo começo.'},
 [
  ()=>{return ouvirQ('Ouça com atenção: qual palavra é?','pato',['gato','rato','mato']);},
  ()=>{return ouvirQ('Ouça com atenção: qual palavra é?','bola',['bolo','mola','cola']);},
  ()=>{return mc('Qual palavra rima com <b>GATO</b>?','pato',['casa','bola','mesa']);},
  ()=>{return mc('Qual palavra rima com <b>MESA</b>?','presa',['gato','bolo','pipa']);},
  ()=>{const w=pick(PAL);return ouvirQ('Ouça e escolha a certa.',w.p,shuf(PAL.filter(x=>x.p!==w.p)).slice(0,3).map(x=>x.p));},
  ()=>{return mc('BOLA e BOLO mudam em qual letra?','na última',['na primeira','no meio']);}
 ])
]});

/* ---------- MUNDO 4 — sons difíceis ---------- */
UNITS_PT.push({n:4,title:'Os sons difíceis',sub:'C/Ç, R/RR, S/SS, CH, LH, NH e o M antes de P e B.',tone:'coral',lessons:[
LP('p4.1','ca','CA CO CU e CE CI',
 {ideia:'A letra C tem dois sons. Com A, O, U ela soa como K: CA, CO, CU. Com E e I ela soa como S: CE, CI.',
  exemplo:'CASA, COPO, CUCA — som de K. CEBOLA, CINEMA — som de S.',
  dica:'Se o som é de S antes de A, O, U, aí escreve-se com Ç: MAÇÃ, AÇÚCAR.'},
 [
  ()=>{return mc('Em qual palavra o C tem som de S?','cebola',['casa','copo','cuca']);},
  ()=>{return mc('Em qual palavra o C tem som de K?','copo',['cebola','cinema','cidade']);},
  ()=>{return mc('Como se escreve o som "sa" no meio de MA__Ã?','ç',['c','s','ss']);},
  ()=>{return mc('Qual está certo?','maçã',['macã','massã','maçan']);},
  ()=>{return tf('CI tem som de "ki".',false);},
  ()=>{return txtQ('Complete com C ou Ç: CABE__A',
       'Ç',{teclado:'letra'});}
 ]),
LP('p4.2','rr','R e RR',
 {ideia:'No começo da palavra, um R só já tem som forte: RATO. No meio, o som forte pede <b>RR</b>: CARRO. Um R sozinho no meio tem som fraco: CARA.',
  exemplo:'CARRO (forte) e CARO (fraco). ERRO e ERA.',
  dica:'Fale as duas em voz alta. O som forte é o que "ronca".'},
 [
  ()=>{return mc('Qual está certo: o veículo com quatro rodas?','carro',['caro','carru','karro']);},
  ()=>{return mc('Qual palavra tem som forte de R no meio?','terra',['tera','cara','arara']);},
  ()=>{return tf('No começo da palavra basta um R para o som forte.',true);},
  ()=>{return mc('Como se escreve o nome do animal que é um roedor pequeno?','rato',['rrato','hrato']);},
  ()=>{return txtQ('Complete com R ou RR: CACHO__O','RR',{teclado:'letra'});},
  ()=>{return mc('CARO e CARRO são diferentes por quê?','pelo som do R',['pelo acento','pela vogal']);}
 ]),
LP('p4.3','ss','S, SS e o S com som de Z',
 {ideia:'Entre duas vogais, um S só tem som de Z: CASA. Para o som de S nessa posição, usa-se <b>SS</b>: MASSA.',
  exemplo:'CASA (som de Z) e MASSA (som de S).',
  dica:'Diga a palavra devagar: se chiar como Z, é um S só.'},
 [
  ()=>{return mc('Em qual palavra o S tem som de Z?','casa',['massa','sapo','sino']);},
  ()=>{return mc('Como se escreve o alimento feito de farinha?','massa',['masa','maça','maza']);},
  ()=>{return tf('Entre duas vogais, um S sozinho soa como Z.',true);},
  ()=>{return mc('Qual está certo?','pêssego',['pêsego','pessego','pêzego']);},
  ()=>{return txtQ('Complete com S ou SS: PA__ARINHO','SS',{teclado:'letra'});},
  ()=>{return mc('Qual palavra tem som de S entre vogais?','osso',['rosa','casa','mesa']);}
 ]),
LP('p4.4','ch','CH, LH e NH',
 {ideia:'Duas letras juntas que fazem um som só: <b>CH</b> (chuva), <b>LH</b> (filho), <b>NH</b> (banho).',
  exemplo:'CHAVE, MOLHO, SONHO.',
  dica:'Elas nunca se separam na hora de dividir a sílaba: CHU-VA, FI-LHO, BA-NHO.'},
 [
  ()=>{return mc('Como se escreve o que cai do céu na chuvarada?','chuva',['xuva','cuva','tchuva']);},
  ()=>{return mc('Qual palavra tem LH?','filho',['fio','fila','faca']);},
  ()=>{return mc('Qual palavra tem NH?','banho',['bano','bana','bamho']);},
  ()=>{return mc('Como se separa CHUVA em sílabas?','chu - va',['c - hu - va','ch - u - va']);},
  ()=>{return txtQ('Complete: SO__O (o que a gente tem dormindo)','NH',{teclado:'letra'});},
  ()=>{return tf('O CH tem som de X em chave.',true);}
 ]),
LP('p4.5','mp','M antes de P e B',
 {ideia:'Antes de <b>P</b> e <b>B</b> escreve-se sempre <b>M</b>, nunca N.',
  exemplo:'CAMPO, BOMBA, TAMBÉM, EMPADA.',
  dica:'Decore a frase: “antes de P e B, vai M”.'},
 [
  ()=>{return mc('Qual está certo?','campo',['canpo','cãpo']);},
  ()=>{return mc('Qual está certo?','bomba',['bonba','bõba']);},
  ()=>{return txtQ('Complete: TA__BÉM','M',{teclado:'letra'});},
  ()=>{return txtQ('Complete: CA__PEÃO','M',{teclado:'letra'});},
  ()=>{return tf('Antes de P e B usamos N.',false);},
  ()=>{return mc('Qual palavra está errada?','conpra',['compra','ombro','sombra']);}
 ])
]});

/* ---------- MUNDO 5 — frases ---------- */
const SUJ=['O gato','A menina','O cachorro','A vovó','O menino','A professora','O sapo','A borboleta'];
const VERB=['come','corre','pula','dorme','brinca','canta','escreve','desenha'];
const COMP=['no quintal','na escola','com a bola','de manhã','no jardim','em casa','com o amigo','na praça'];
UNITS_PT.push({n:5,title:'As frases',sub:'Juntar palavras com sentido, começar com maiúscula e terminar com ponto.',tone:'roxo',lessons:[
LP('p5.1','.','O que é uma frase',
 {ideia:'<b>Frase</b> é um conjunto de palavras que faz sentido junto. "O gato dorme" é frase. "Gato o dorme" não é.',
  exemplo:'O cachorro corre no quintal. ← faz sentido, é frase.',
  dica:'Leia em voz alta: se você entende, é frase.'},
 [
  ()=>{const a=pick(SUJ),v=pick(VERB);return mc('Qual delas é uma frase?',a+' '+v+'.',
       [v+' '+a.toLowerCase()+'.',a+' '+a.toLowerCase()+'.']);},
  ()=>{return tf('"A menina brinca na praça." é uma frase.',true);},
  ()=>{return tf('"Bola pula a o" é uma frase.',false);},
  ()=>{const a=pick(SUJ),v=pick(VERB),c=pick(COMP);return mc('Qual frase está na ordem certa?',a+' '+v+' '+c+'.',
       [v+' '+c+' '+a.toLowerCase()+'.',c+' '+a.toLowerCase()+' '+v+'.']);},
  ()=>{const a=pick(SUJ),v=pick(VERB);return mc('Nesta frase, quem faz a ação: "'+a+' '+v+'"?',a,
       [v,'ninguém']);},
  ()=>{const a=pick(SUJ),v=pick(VERB);return mc('Nesta frase, qual é a ação: "'+a+' '+v+'"?',v,[a,'nenhuma']);}
 ]),
LP('p5.2','Aa.','Maiúscula no começo, ponto no fim',
 {ideia:'Toda frase começa com <b>letra maiúscula</b> e termina com <b>ponto final</b>. É a roupa da frase.',
  exemplo:'o gato dorme → <b>O</b> gato dorme<b>.</b>',
  dica:'Antes de entregar, confira o começo e o fim.'},
 [
  ()=>{const a=pick(SUJ),v=pick(VERB);return mc('Qual está escrita corretamente?',a+' '+v+'.',
       [a.toLowerCase()+' '+v+'.',a+' '+v]);},
  ()=>{return mc('O que falta em "a menina canta"?','maiúscula no começo e ponto no fim',
       ['só o ponto','só a maiúscula','nada']);},
  ()=>{return tf('Uma frase pode terminar sem nenhum sinal.',false);},
  ()=>{return mc('Qual sinal termina uma frase que só conta uma coisa?','.',['?','!']);},
  ()=>{const a=pick(SUJ),v=pick(VERB),c=pick(COMP);return mc('Escolha a frase certa:',a+' '+v+' '+c+'.',
       [a.toLowerCase()+' '+v+' '+c+'.',a+' '+v+' '+c]);},
  ()=>{return txtQ('Qual letra deve ser maiúscula em "o sapo pulou"?','O',{teclado:'letra'});}
 ]),
LP('p5.3','↔','A ordem das palavras',
 {ideia:'Em português a ordem costuma ser: <b>quem</b> + <b>faz o quê</b> + <b>onde/como</b>.',
  exemplo:'A menina (quem) desenha (o quê) na escola (onde).',
  dica:'Se a frase soar estranha, provavelmente a ordem está trocada.'},
 [
  ()=>{const a=pick(SUJ),v=pick(VERB),c=pick(COMP);return mc('Monte a frase certa:',a+' '+v+' '+c+'.',
       [v+' '+a.toLowerCase()+' '+c+'.',c+' '+v+' '+a.toLowerCase()+'.']);},
  ()=>{const a=pick(SUJ),v=pick(VERB);return mc('O que vem primeiro na frase?','quem faz a ação',['a ação','o lugar']);},
  ()=>{return tf('"Na escola a menina desenha." também está correta.',true);},
  ()=>{const a=pick(SUJ),v=pick(VERB),c=pick(COMP);return mc('Qual parte diz ONDE?',c,[a,v]);},
  ()=>{const a=pick(SUJ),v=pick(VERB),c=pick(COMP);return mc('Qual parte diz O QUE ELE FAZ?',v,[a,c]);},
  ()=>{return mc('Qual frase está embaralhada?','Corre o cachorro quintal no.',
       ['O cachorro corre no quintal.','No quintal o cachorro corre.']);}
 ]),
LP('p5.4','?!','Interrogação e exclamação',
 {ideia:'O <b>?</b> fecha uma pergunta. O <b>!</b> mostra susto, alegria ou grito. O <b>.</b> fecha uma frase comum.',
  exemplo:'Você viu o gato? / Que susto! / O gato dormiu.',
  dica:'Leia em voz alta: a entonação te diz qual sinal usar.'},
 [
  ()=>{return mc('Qual sinal fecha "Você gosta de sorvete"?','?',['.','!']);},
  ()=>{return mc('Qual sinal fecha "Que legal"?','!',['.','?']);},
  ()=>{return mc('Qual sinal fecha "O menino chegou cedo"?','.',['?','!']);},
  ()=>{return mc('"Cuidado!" mostra o quê?','um aviso forte',['uma pergunta','uma lista']);},
  ()=>{return tf('Toda pergunta termina com ponto de interrogação.',true);},
  ()=>{return mc('Qual frase é uma pergunta?','Onde está a bola?',['A bola está aqui.','Que bola linda!']);}
 ]),
LP('p5.5','+','Juntar duas frases',
 {ideia:'Palavrinhas como <b>e</b>, <b>mas</b> e <b>porque</b> ligam duas frases numa só.',
  exemplo:'Eu corri <b>e</b> cheguei cansado. Queria sair, <b>mas</b> choveu. Fiquei feliz <b>porque</b> ganhei.',
  dica:'"E" soma, "mas" contraria, "porque" explica.'},
 [
  ()=>{return mc('Complete: "Estudei ___ passei na prova."','e',['mas','porque']);},
  ()=>{return mc('Complete: "Queria brincar, ___ estava chovendo."','mas',['e','porque']);},
  ()=>{return mc('Complete: "Fiquei feliz ___ ganhei um presente."','porque',['mas','e']);},
  ()=>{return mc('Qual palavra mostra que algo deu errado?','mas',['e','porque']);},
  ()=>{return mc('Qual palavra explica o motivo?','porque',['e','mas']);},
  ()=>{return tf('"E" serve para juntar duas ideias que combinam.',true);}
 ])
]});

/* ---------- MUNDO 6 — nomes ---------- */
UNITS_PT.push({n:6,title:'Os nomes das coisas',sub:'Substantivo, artigo, singular e plural, masculino e feminino.',tone:'agua',lessons:[
LP('p6.1','n','Substantivo',
 {ideia:'<b>Substantivo</b> é o nome das coisas, das pessoas, dos bichos e dos lugares.',
  exemplo:'bola, menina, cachorro, escola — todos são substantivos.',
  dica:'Se dá para colocar "o" ou "a" na frente, é substantivo.'},
 [
  ()=>{const w=pick(PAL);return mc('Qual destas é o nome de uma coisa (substantivo)?',w.p,shuf(VERB).slice(0,3));},
  ()=>{return mc('Qual destas NÃO é substantivo?','correr',['gato','escola','bola']);},
  ()=>{const w=pick(PAL);return tf('"'+w.p+'" é um substantivo.',true);},
  ()=>{return mc('"Professora" é nome de quê?','pessoa',['lugar','coisa']);},
  ()=>{return mc('"Escola" é nome de quê?','lugar',['pessoa','bicho']);},
  ()=>{return mc('"Cachorro" é nome de quê?','bicho',['lugar','pessoa']);}
 ]),
LP('p6.2','o/a','O, A, OS, AS',
 {ideia:'Os <b>artigos</b> vêm antes do substantivo e mostram se ele é masculino ou feminino, um ou vários.',
  exemplo:'<b>o</b> gato, <b>a</b> bola, <b>os</b> gatos, <b>as</b> bolas.',
  dica:'Fale a palavra com "o" e com "a". Só uma soa certa.'},
 [
  ()=>{return mc('Qual artigo combina com "bola"?','a',['o','os']);},
  ()=>{return mc('Qual artigo combina com "gato"?','o',['a','as']);},
  ()=>{return mc('Qual artigo combina com "meninas"?','as',['a','o']);},
  ()=>{return mc('Qual artigo combina com "livros"?','os',['o','as']);},
  ()=>{return txtQ('Complete: ___ casa é bonita.','A',{teclado:'letra'});},
  ()=>{return tf('"A" é usado com palavras femininas.',true);}
 ]),
LP('p6.3','s','Singular e plural',
 {ideia:'<b>Singular</b> é um só. <b>Plural</b> é mais de um, e quase sempre ganha um <b>S</b> no fim.',
  exemplo:'bola → bolas. menino → meninos. Mas: pão → pães, flor → flores.',
  dica:'Se já termina em S no singular (lápis), o plural não muda.'},
 [
  ()=>{const w=pick(pal2());return txtQ('Escreva o plural de '+w.p.toUpperCase()+'.',w.p+'s',{teclado:'letra'});},
  ()=>{const w=pick(pal3());return mc('Qual é o plural de "'+w.p+'"?',w.p+'s',[w.p,w.p+'es']);},
  ()=>{return mc('Qual é o plural de "pão"?','pães',['pãos','pões','pans']);},
  ()=>{return mc('Qual é o plural de "flor"?','flores',['flors','florses']);},
  ()=>{return mc('"Meninas" está em qual forma?','plural',['singular']);},
  ()=>{return tf('O plural quase sempre termina em S.',true);}
 ]),
LP('p6.4','♂♀','Masculino e feminino',
 {ideia:'Palavras masculinas pedem <b>o</b>; femininas pedem <b>a</b>. Muitas mudam o final: menino → menina.',
  exemplo:'gato/gata, professor/professora, rei/rainha.',
  dica:'Nem tudo segue a regra: o dia (masculino), a mão (feminino).'},
 [
  ()=>{return mc('Qual é o feminino de "menino"?','menina',['menines','meninos']);},
  ()=>{return mc('Qual é o feminino de "gato"?','gata',['gatas','gato']);},
  ()=>{return mc('Qual é o masculino de "professora"?','professor',['professoro','professores']);},
  ()=>{return mc('"A mesa" é masculino ou feminino?','feminino',['masculino']);},
  ()=>{return mc('"O livro" é masculino ou feminino?','masculino',['feminino']);},
  ()=>{return mc('Qual é o feminino de "rei"?','rainha',['reia','reina']);}
 ]),
LP('p6.5','Nn','Nomes próprios',
 {ideia:'<b>Nome próprio</b> é o nome de alguém ou de algum lugar específico, e sempre começa com <b>maiúscula</b>.',
  exemplo:'Lívia, Enrico, Brasil, Porto Alegre, Bobby.',
  dica:'Nome comum: menina. Nome próprio: Lívia.'},
 [
  ()=>{return mc('Qual é um nome próprio?','Brasil',['país','cidade','rua']);},
  ()=>{return mc('Qual está escrito corretamente?','Lívia',['lívia','LÍVIA']);},
  ()=>{return tf('Nome de cachorro também é nome próprio e leva maiúscula.',true);},
  ()=>{return mc('Qual é nome comum?','menina',['Lívia','Bobby','Brasil']);},
  ()=>{return mc('Como se escreve o nome do nosso ursinho?','Bobby',['bobby','BOBBY']);},
  ()=>{return tf('Nomes de cidades começam com letra minúscula.',false);}
 ])
]});

/* ---------- MUNDO 7 — como é e o que faz ---------- */
const ADJ=['alto','bonito','rápido','pequeno','feliz','forte','novo','limpo'];
UNITS_PT.push({n:7,title:'Como é e o que faz',sub:'Adjetivo, verbo e a combinação certa entre eles.',tone:'ambar',lessons:[
LP('p7.1','!','Adjetivo: como é',
 {ideia:'<b>Adjetivo</b> é a palavra que diz <b>como</b> alguém ou alguma coisa é.',
  exemplo:'O gato <b>preto</b>. A casa <b>grande</b>. O menino <b>alegre</b>.',
  dica:'Pergunte "como é?" para achar o adjetivo.'},
 [
  ()=>{const a=pick(ADJ);return mc('Qual destas palavras diz COMO uma coisa é?',a,shuf(PAL).slice(0,3).map(x=>x.p));},
  ()=>{return mc('Na frase "a bola vermelha", qual é o adjetivo?','vermelha',['bola','a']);},
  ()=>{return mc('Na frase "o cachorro rápido", qual é o adjetivo?','rápido',['cachorro','o']);},
  ()=>{return mc('Qual NÃO é adjetivo?','escola',['bonita','pequena','nova']);},
  ()=>{const a=pick(ADJ);return tf('"'+a+'" é um adjetivo.',true);},
  ()=>{return mc('Complete: "A menina é ___."','esperta',['corre','escola']);}
 ]),
LP('p7.2','→','Verbo: o que faz',
 {ideia:'<b>Verbo</b> é a palavra da ação: o que alguém faz, fez ou vai fazer.',
  exemplo:'correr, comer, pular, dormir, estudar.',
  dica:'Pergunte "o que ele faz?" para achar o verbo.'},
 [
  ()=>{const v=pick(VERB);return mc('Qual destas é uma ação (verbo)?',v,shuf(PAL).slice(0,3).map(x=>x.p));},
  ()=>{return mc('Na frase "o gato dorme", qual é o verbo?','dorme',['gato','o']);},
  ()=>{return mc('Qual NÃO é verbo?','bola',['correr','pular','comer']);},
  ()=>{const a=pick(SUJ),v=pick(VERB);return mc('Qual é a ação em "'+a+' '+v+'"?',v,[a]);},
  ()=>{return mc('Complete: "O menino ___ na escola."','estuda',['escola','bonito']);},
  ()=>{return tf('"Pular" é um verbo.',true);}
 ]),
LP('p7.3','=','Combinar direitinho',
 {ideia:'O adjetivo tem que combinar com o substantivo em <b>gênero</b> e <b>número</b>: o menino alto, a menina alta, os meninos altos.',
  exemplo:'A casa bonita. Os carros novos.',
  dica:'Troque o substantivo e veja se o adjetivo acompanha.'},
 [
  ()=>{return mc('Qual está certo?','a menina bonita',['a menina bonito','o menina bonita']);},
  ()=>{return mc('Qual está certo?','os meninos altos',['os meninos alto','o meninos altos']);},
  ()=>{return mc('Qual está certo?','as casas novas',['as casas novo','a casas novas']);},
  ()=>{return mc('Complete: "O carro é ___."','rápido',['rápida','rápidos']);},
  ()=>{return mc('Complete: "As flores são ___."','bonitas',['bonita','bonito']);},
  ()=>{return tf('"A menina alto" está correto.',false);}
 ]),
LP('p7.4','⏱','Ontem, hoje e amanhã',
 {ideia:'O verbo muda conforme o tempo: <b>ontem</b> (passado), <b>hoje</b> (presente), <b>amanhã</b> (futuro).',
  exemplo:'Ontem eu <b>brinquei</b>. Hoje eu <b>brinco</b>. Amanhã eu <b>vou brincar</b>.',
  dica:'Procure as palavras ontem, hoje e amanhã: elas entregam o tempo.'},
 [
  ()=>{return mc('"Ontem eu ___ na praça." Qual completa?','brinquei',['brinco','vou brincar']);},
  ()=>{return mc('"Hoje eu ___ na escola." Qual completa?','estudo',['estudei','vou estudar']);},
  ()=>{return mc('"Amanhã eu ___ com você." Qual completa?','vou jogar',['joguei','jogo']);},
  ()=>{return mc('"Comi" está em qual tempo?','passado',['presente','futuro']);},
  ()=>{return mc('"Vou comer" está em qual tempo?','futuro',['passado','presente']);},
  ()=>{return mc('"Como" está em qual tempo?','presente',['passado','futuro']);}
 ]),
LP('p7.5','∑','Montar frases completas',
 {ideia:'Uma frase completa tem <b>quem</b>, <b>o que faz</b> e às vezes <b>como</b> ou <b>onde</b>.',
  exemplo:'A menina esperta desenha na escola.',
  dica:'Leia sua frase em voz alta antes de dar como pronta.'},
 [
  ()=>{const a=pick(SUJ),v=pick(VERB),c=pick(COMP);return mc('Qual é a frase completa?',a+' '+v+' '+c+'.',
       [a+'.',v+' '+c+'.']);},
  ()=>{const a=pick(SUJ),v=pick(VERB);return mc('O que falta em "'+a+'"?','a ação',['o nome','nada']);},
  ()=>{const v=pick(VERB),c=pick(COMP);return mc('O que falta em "'+v+' '+c+'"?','quem faz',['a ação','o lugar']);},
  ()=>{return mc('Qual frase tem adjetivo?','O gato preto dorme.',['O gato dorme.','Dorme o gato.']);},
  ()=>{return mc('Qual frase diz ONDE?','A menina corre no parque.',['A menina corre.','Corre a menina.']);},
  ()=>{const a=pick(SUJ),v=pick(VERB),c=pick(COMP);return tf('"'+a+' '+v+' '+c+'." é uma frase completa.',true);}
 ])
]});

/* ---------- MUNDO 8 — escrever certo ---------- */
UNITS_PT.push({n:8,title:'Escrever certo',sub:'Ç, G e J, X e CH, S e Z, e as palavras que confundem.',tone:'coral',lessons:[
LP('p8.1','ç','Palavras com Ç',
 {ideia:'O <b>Ç</b> faz som de S antes de A, O e U. Ele nunca aparece antes de E e I (aí usa-se só C).',
  exemplo:'maçã, açúcar, coração, França.',
  dica:'Se o som é de S antes de A, O ou U, provavelmente é Ç.'},
 [
  ()=>{return mc('Qual está certo?','coração',['coracão','corasão']);},
  ()=>{return mc('Qual está certo?','açúcar',['acúcar','assúcar']);},
  ()=>{return txtQ('Complete: CABE__A','Ç',{teclado:'letra'});},
  ()=>{return tf('O Ç pode vir antes de E.',false);},
  ()=>{return mc('Qual palavra tem Ç?','laço',['laso','lasso']);},
  ()=>{return mc('Qual está errado?','maçe',['maçã','moço','muçulmano']);}
 ]),
LP('p8.2','gj','G e J',
 {ideia:'Antes de E e I, o <b>G</b> tem o mesmo som do <b>J</b>. Aí é preciso lembrar como a palavra se escreve.',
  exemplo:'gelo, girafa (com G) · janela, jipe (com J).',
  dica:'Palavras terminadas em -agem, -igem, -ugem vão com G: viagem, coragem.'},
 [
  ()=>{return mc('Qual está certo?','gelo',['jelo']);},
  ()=>{return mc('Qual está certo?','janela',['ganela']);},
  ()=>{return mc('Qual está certo?','viagem',['viajem']);},
  ()=>{return mc('Qual está certo?','girafa',['jirafa']);},
  ()=>{return txtQ('Complete: CORA__EM','G',{teclado:'letra'});},
  ()=>{return tf('Palavras terminadas em -agem se escrevem com G.',true);}
 ]),
LP('p8.3','xch','X e CH',
 {ideia:'<b>X</b> e <b>CH</b> podem ter o mesmo som. Não existe regra para tudo: algumas palavras a gente decora.',
  exemplo:'xícara, peixe, caixa (com X) · chave, chuva, mochila (com CH).',
  dica:'Depois de EN e ME quase sempre vai X: enxada, mexer.'},
 [
  ()=>{return mc('Qual está certo?','xícara',['chícara']);},
  ()=>{return mc('Qual está certo?','chuva',['xuva']);},
  ()=>{return mc('Qual está certo?','caixa',['caicha']);},
  ()=>{return mc('Qual está certo?','mochila',['moxila']);},
  ()=>{return txtQ('Complete: PEI__E','X',{teclado:'letra'});},
  ()=>{return tf('Depois de EN quase sempre se escreve X.',true);}
 ]),
LP('p8.4','sz','S e Z no fim',
 {ideia:'No fim das palavras, S e Z soam igual. Palavras derivadas mantêm a letra da origem: casa → casinha (com S).',
  exemplo:'feliz, luz, rapaz (com Z) · mês, país, aviso (com S).',
  dica:'Se der para formar outra palavra da família, ela mostra a letra certa.'},
 [
  ()=>{return mc('Qual está certo?','feliz',['felis']);},
  ()=>{return mc('Qual está certo?','país',['paíz']);},
  ()=>{return mc('Qual está certo?','casinha',['cazinha']);},
  ()=>{return mc('Qual está certo?','luz',['lus']);},
  ()=>{return txtQ('Complete: RAPA__','Z',{teclado:'letra'});},
  ()=>{return tf('"Casa" vira "casinha" com S porque a origem tem S.',true);}
 ]),
LP('p8.5','≠','Palavras que confundem',
 {ideia:'Algumas palavras parecem iguais mas têm sentidos diferentes: <b>mas</b> e <b>mais</b>, <b>mal</b> e <b>mau</b>.',
  exemplo:'Queria ir, <b>mas</b> choveu. Quero <b>mais</b> bolo. Ele dormiu <b>mal</b>. Ele é <b>mau</b>.',
  dica:'"Mais" é quantidade. "Mas" contraria. "Mau" é o contrário de bom; "mal" é o contrário de bem.'},
 [
  ()=>{return mc('Complete: "Quero ___ suco."','mais',['mas']);},
  ()=>{return mc('Complete: "Estudei, ___ esqueci."','mas',['mais']);},
  ()=>{return mc('Complete: "Ele é um menino ___."','mau',['mal']);},
  ()=>{return mc('Complete: "Ele foi ___ na prova."','mal',['mau']);},
  ()=>{return mc('"Mais" indica o quê?','quantidade',['oposição','lugar']);},
  ()=>{return tf('"Mau" é o contrário de bom.',true);}
 ])
]});

/* ---------- MUNDO 9 — acentos e pontuação ---------- */
UNITS_PT.push({n:9,title:'Acentos e pontuação',sub:'O acento que muda o som, o til, a vírgula e a fala nos textos.',tone:'roxo',lessons:[
LP('p9.1','´','Para que serve o acento',
 {ideia:'O <b>acento</b> mostra qual sílaba a gente fala mais forte. Sem ele, a palavra pode virar outra.',
  exemplo:'sabia / sabiá / sábia — três palavras diferentes.',
  dica:'Fale a palavra e sinta onde a voz sobe: é ali que mora o acento.'},
 [
  ()=>{return mc('Qual está certo: o passarinho que canta?','sabiá',['sabia','sábia']);},
  ()=>{return mc('Qual palavra tem acento?','café',['cafe','cafeh']);},
  ()=>{return mc('Onde está a sílaba forte em "café"?','fé',['ca']);},
  /* antes era mc('Qual está certo?','é',['e ']) — sem frase, "e" e "é" estão os dois certos
     em português (e = junta, é = do verbo ser). A pergunta só faz sentido dentro de uma frase. */
  ()=>{const f=pick([['O gato ___ preto.','é'],['Comprei pão ___ leite.','e'],
                     ['Ela ___ minha amiga.','é'],['Bola ___ boneca.','e']]);
       return mc('Complete: "'+f[0]+'"',f[1],[f[1]==='é'?'e':'é'],
         {dica:'<b>é</b> vem do verbo ser. <b>e</b> serve para juntar duas coisas.'});},
  ()=>{return tf('O acento pode mudar o sentido da palavra.',true);},
  ()=>{return mc('Qual está certo?','avô',['avo']);}
 ]),
LP('p9.2','ã','O til e os sons nasais',
 {ideia:'O <b>til</b> (~) deixa o som nasal, saindo pelo nariz: ã, õ.',
  exemplo:'mão, pão, coração, limões.',
  dica:'Tape o nariz e tente falar "mão". Não sai — é nasal mesmo.'},
 [
  ()=>{return mc('Qual está certo?','mão',['mao','mãao']);},
  ()=>{return mc('Qual está certo?','pão',['pao','pãn']);},
  ()=>{return mc('Qual é o plural de "pão"?','pães',['pãos','paos']);},
  ()=>{return mc('Qual é o plural de "limão"?','limões',['limãos','limaos']);},
  ()=>{return txtQ('Complete: CORA__ÃO','Ç',{teclado:'letra'});},
  ()=>{return tf('O til deixa o som nasal.',true);}
 ]),
LP('p9.3','á','Palavras com acento agudo',
 {ideia:'O acento agudo (´) aparece em muitas palavras do dia a dia. Vale reconhecer as mais comuns.',
  exemplo:'água, história, também, avó, você, é.',
  dica:'Palavras terminadas em -ária, -ório e -ência quase sempre levam acento.'},
 [
  ()=>{return mc('Qual está certo?','água',['agua']);},
  ()=>{return mc('Qual está certo?','história',['historia']);},
  ()=>{return mc('Qual está certo?','também',['tambem']);},
  ()=>{return mc('Qual está certo?','você',['voce']);},
  ()=>{return mc('Qual está certo?','médico',['medico']);},
  ()=>{return mc('Qual NÃO leva acento?','casa',['água','café','avó']);}
 ]),
LP('p9.4',',','A vírgula na lista',
 {ideia:'A <b>vírgula</b> separa os itens de uma lista e dá uma pausa curta na leitura. Antes do último item entra "e".',
  exemplo:'Comprei pão, leite, queijo e manteiga.',
  dica:'Leia em voz alta: onde você respira, costuma ter vírgula.'},
 [
  ()=>{return mc('Qual está certo?','Comprei pão, leite e queijo.',['Comprei pão leite queijo.','Comprei, pão leite, e queijo.']);},
  ()=>{return mc('Para que serve a vírgula na lista?','separar os itens',['terminar a frase','fazer pergunta']);},
  ()=>{return mc('Antes do último item da lista usamos...','e',['vírgula','ponto']);},
  ()=>{return tf('A vírgula termina a frase.',false);},
  ()=>{return mc('Qual está certo?','Gosto de bola, boneca e livro.',['Gosto de bola boneca livro.']);},
  ()=>{return mc('Quantas vírgulas tem "pão, leite, queijo e mel"?','2',['3','1']);}
 ]),
LP('p9.5','—','Quando alguém fala',
 {ideia:'Nos textos, a fala de um personagem começa com <b>travessão</b> (—). Os <b>dois-pontos</b> (:) anunciam que alguém vai falar ou que vem uma lista.',
  exemplo:'A menina disse:<br>— Estou pronta!',
  dica:'Travessão só na fala; dois-pontos antes dela.'},
 [
  ()=>{return mc('Qual sinal marca a fala de um personagem?','—',[',','?']);},
  ()=>{return mc('Qual sinal anuncia que alguém vai falar?',':',['.','!']);},
  ()=>{return mc('Qual está certo?','Ela disse: — Vamos!',['Ela disse — : Vamos!']);},
  ()=>{return tf('Os dois-pontos também anunciam uma lista.',true);},
  ()=>{return mc('No texto, o travessão aparece...','no começo da fala',['no fim da frase','depois da vírgula']);},
  ()=>{return tf('A fala de um personagem começa com vírgula.',false);}
 ])
]});

/* ---------- MUNDO 10 — ler e entender ---------- */
const TEXTOS=[
 {t:'O bilhete',c:'Lívia,<br>Fui ao mercado comprar leite e pão. Volto às cinco horas. Não esqueça de dar comida para o Bobby.<br>Beijos, mamãe.',
  q:[['Quem escreveu o bilhete?','a mãe',['a Lívia','o Bobby']],
     ['A que horas ela volta?','às cinco horas',['às três horas','de manhã']],
     ['O que a Lívia não pode esquecer?','dar comida para o Bobby',['ir ao mercado','comprar pão']]]},
 {t:'A receita',c:'Bolo de caneca<br>1) Coloque 4 colheres de farinha na caneca.<br>2) Junte 2 colheres de açúcar e 1 ovo.<br>3) Misture bem e leve ao micro-ondas por 3 minutos.',
  q:[['Quantas colheres de farinha vão na caneca?','4',['2','3']],
     ['O que se faz no passo 3?','misturar e levar ao micro-ondas',['juntar o açúcar','colocar farinha']],
     ['Quanto tempo no micro-ondas?','3 minutos',['4 minutos','1 minuto']]]},
 {t:'A historinha',c:'O Bobby acordou cedo e foi regar a horta. Quando chegou lá, viu que as sementes tinham virado pequenos brotos verdes. Ele ficou tão feliz que chamou todos os amigos para ver.',
  q:[['O que o Bobby foi fazer?','regar a horta',['brincar na praça','dormir mais']],
     ['O que ele encontrou na horta?','brotos verdes',['frutas maduras','uma pipa']],
     ['Como o Bobby ficou?','feliz',['bravo','triste']]]}
];
function textoQ(){
  const t=pick(TEXTOS),q=pick(t.q);
  return mc(q[0],q[1],q[2],{figure:'<div class="textinho"><b>'+t.t+'</b>'+t.c+'</div>'});
}
UNITS_PT.push({n:10,title:'Ler e entender',sub:'Bilhete, receita, historinha: ler de verdade e achar a informação.',tone:'verde',lessons:[
LP('p10.1','✉','Ler um bilhete',
 {ideia:'Um <b>bilhete</b> é um recado curto. Ele diz quem escreveu, para quem, e o que precisa ser feito.',
  exemplo:'"Fui ao mercado. Volto às cinco. Beijos, mamãe."',
  dica:'Procure sempre: quem escreveu, para quem, e qual é o pedido.'},
 [textoQ,textoQ,
  ()=>{return mc('No fim do bilhete costuma vir o quê?','quem escreveu',['a data de nascimento','o preço']);},
  ()=>{return mc('Para que serve um bilhete?','deixar um recado',['contar uma história longa','fazer uma conta']);},
  textoQ,
  ()=>{return tf('Um bilhete costuma ser curto.',true);}
 ]),
LP('p10.2','📋','Ler uma instrução',
 {ideia:'Receitas e instruções vêm em <b>passos numerados</b>. A ordem importa: pular um passo estraga tudo.',
  exemplo:'1) Misture. 2) Leve ao forno. 3) Espere esfriar.',
  dica:'Leia todos os passos antes de começar.'},
 [textoQ,textoQ,
  ()=>{return mc('Numa receita, por que os passos são numerados?','porque a ordem importa',['para ficar bonito','para contar as letras']);},
  ()=>{return mc('O que vem primeiro numa receita?','a lista do que usar',['o resultado','a sobremesa']);},
  textoQ,
  ()=>{return tf('Numa receita dá para fazer os passos em qualquer ordem.',false);}
 ]),
LP('p10.3','📖','Ler uma historinha',
 {ideia:'Toda história tem <b>personagem</b>, <b>lugar</b> e <b>o que aconteceu</b>.',
  exemplo:'O Bobby (personagem) foi à horta (lugar) e achou brotos (o que aconteceu).',
  dica:'Depois de ler, conte a história com suas palavras.'},
 [textoQ,textoQ,
  ()=>{return mc('Quem é o personagem de uma história?','quem faz as ações',['o lugar','o título']);},
  ()=>{return mc('O que é o cenário de uma história?','o lugar onde acontece',['o personagem','o final']);},
  textoQ,
  ()=>{return tf('Uma história pode ter mais de um personagem.',true);}
 ]),
LP('p10.4','🔎','Achar a informação',
 {ideia:'Muitas perguntas têm a resposta escrita no próprio texto. Basta voltar e procurar.',
  exemplo:'Se a pergunta é "a que horas?", procure um número com "horas" no texto.',
  dica:'Sublinhe no texto a parte que responde a pergunta.'},
 [textoQ,textoQ,textoQ,
  ()=>{return mc('Se a pergunta é "quem?", você procura no texto...','um nome de pessoa ou bicho',['um número','um lugar']);},
  ()=>{return mc('Se a pergunta é "onde?", você procura...','um lugar',['um nome','uma hora']);},
  textoQ
 ]),
LP('p10.5','★','Desafio final',
 {ideia:'Aqui cai tudo: letras, sílabas, palavras, frases, ortografia e leitura.',
  exemplo:'Leia com calma e use o que você aprendeu em cada mundo.',
  dica:'Errou? Volte no mundo daquele assunto e refaça a fase.'},
 [()=>ptHard(),()=>ptHard(),()=>ptHard(),textoQ,()=>ptHard(),textoQ]
 )
]});
function ptPool(minU,maxU){
  const ls=[];UNITS_PT.forEach(u=>{if(u.n>=minU&&u.n<=maxU)u.lessons.forEach(l=>{
    if(l.id!=='p10.5')ls.push.apply(ls,l.makers);});});return ls;
}
function ptHard(){return pick(ptPool(4,10))();}
const TOTAL_PT=UNITS_PT.reduce((a,u)=>a+u.lessons.length,0);

