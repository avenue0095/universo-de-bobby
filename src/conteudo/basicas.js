/* ===== Aulas básicas (etapas 1 a 3 de cada planeta) com os 7 itens aprovados da engenharia reversa (docs/referencias/ENGENHARIA-REVERSA-...md) =====
   Itens 1 a 3 aqui: (1) dinheiro, relógio, formas, padrões e historinhas como geradores; (2) trilha fonológica de 7 a 8 anos (som inicial, rima,
   contar e juntar sílabas, vogal e letra que falta, grafia certa); (3) distratores por letras confundíveis e gerador de erros de ortografia.
   Banco de palavras e famílias de rima escritos aqui (não copiados dos apps). Figuras em SVG simples com classes (cores no :root).
   Os geradores entram NO FIM da lista de cada fase (a chave da habilidade é a posição: interface/adaptacao.js). */

/* ---------- letras que se confundem de verdade (b/d/p/q, m/n, u/v, f/t, i/l, a/o/e) ---------- */
const CONFUNDE={b:['d','p','q'],d:['b','p','q'],p:['q','b','d'],q:['p','d','b'],m:['n','u'],n:['m','u'],u:['v','n'],v:['u','f'],f:['t','v'],t:['f','l'],
  i:['l','j'],l:['i','t'],a:['o','e'],o:['a','e'],e:['a','o'],c:['e','o','g'],g:['q','j'],j:['g','i'],s:['z','c'],z:['s','x'],r:['n','l'],x:['z','ch']};
function distratoresDaLetra(l,n){
  const c=(CONFUNDE[l]||[]).slice(),out=[];
  shuf(c).forEach(x=>{if(out.length<n&&x!==l&&out.indexOf(x)<0)out.push(x);});
  const reserva='abcdefgilmnoprstuv'.split('');
  while(out.length<n){const x=pick(reserva);if(x!==l&&out.indexOf(x)<0)out.push(x);}
  return out;
}
/* dá para ler em voz alta: nenhuma sílaba sem vogal (sem 3 consoantes seguidas, começo só com encontro que existe: BR, CL, CH...) */
const ENCONTROS=/^(br|bl|cr|cl|dr|fr|fl|gr|gl|pr|pl|tr|vr|ch|lh|nh)/;
/* duas vogais juntas que a palavra certa não tinha (MAAL, BLOO, SAAPTO): ruim de ler */
function hiatoNovo(t,p){const pares=w=>(String(w).toLowerCase().match(/[aeiou](?=[aeiou])/g)?[...String(w).toLowerCase().matchAll(/(?=([aeiou][aeiou]))/g)].map(m=>m[1]):[]);const ok=new Set(pares(p));return pares(t).some(x=>!ok.has(x));}
/* consoante seguida de consoante só quando o par existe de verdade: os encontros acima (BR, CL...), RR e SS, o par que a palavra certa
   já tem (DENTE tem NT, BORBOLETA tem RB) ou consoante que fecha sílaba no português (R, S, L antes de qualquer uma; M antes de P e B;
   N antes das outras: ARTO, FESTA, CAMPO, DENTE). Letra dobrada só RR e SS (nada de RATTO, BOLLO). Sem isso saíam ACSA, AJNELA e DETNE.
   CH, LH, NH, QU e GU contam como UMA consoante, mas entram na conta do par (antes era um marcador que pulava o par e deixava passar
   OFGUETE, FOGGUETE, GALINNHA): depois deles só vem vogal; antes de CH, QU e GU só R, S, L ou N que fecha sílaba (MARCHA, ESQUILO,
   ALGUÉM, SANGUE; nunca GGU nem CCH), antes de LH e NH nenhuma consoante. H sozinho só no começo (HORA): GALNIHA não. */
const PARES_OK=new Set(['br','bl','cr','cl','dr','fr','fl','gr','gl','pr','pl','tr','vr','rr','ss']);
const fechaSilaba=x=>x[0]!==x[1]&&(/^[rsl]/.test(x)||/^m[pb]$/.test(x)||/^n[^pb]$/.test(x));
const NAO_VOGAL=/[^aeiouãõáéíóúâêôy]/;
const DIGRAFO=/^(ch|lh|nh|qu|gu)$/;
/* a palavra em pedaços: dígrafo inteiro ou uma letra */
/* QU e GU só são dígrafo antes de vogal (QUEIJO, GUERRA, ÁGUA); antes de consoante o U é vogal de verdade (AL-GU-MA, FI-GU-RA) */
const DIGRAFOS_RE=/ch|lh|nh|[qg]u(?=[aeiouáéíóâêôãõ])/g;
const pedacos=w=>String(w).toLowerCase().match(/ch|lh|nh|[qg]u(?=[aeiouáéíóâêôãõ])|./g)||[];
/* todo encontro de duas consoantes seguidas (dígrafo conta como consoante), escrito junto: 'nt', 'fgu', 'nnh' */
function paresDeConsoante(w){const t=pedacos(w),out=[];
  for(let i=0;i<t.length-1;i++)if(NAO_VOGAL.test(t[i][0])&&NAO_VOGAL.test(t[i+1][0]))out.push(t[i]+t[i+1]);return out;}
/* o par se lê? (sem contar o que a palavra certa já tem) */
function parLegivel(x){
  const d=x.slice(1);
  if(x.length>2&&DIGRAFO.test(x.slice(0,2)))return false;   /* dígrafo seguido de consoante: CHT, NHL */
  if(DIGRAFO.test(d))return /^(ch|qu|gu)$/.test(d)&&/^[rsln]$/.test(x[0]);
  return PARES_OK.has(x)||fechaSilaba(x);
}
function legivel(t,p){
  t=String(t).toLowerCase();
  if(/q(?!u)/.test(t))return false;   /* Q sem U depois não se lê (QATO, QOLA, QENTE) */
  if(pedacos(t).some((x,i)=>x==='h'&&i>0))return false;   /* H fora de CH, LH, NH só no começo da palavra (GALNIHA) */
  if(/[^aeiouãõáéíóúâêôy]{3,}/.test(t.replace(DIGRAFOS_RE,'C')))return false;
  if(/^[^aeiouãõáéíóúâêô]{2}/.test(t)&&!ENCONTROS.test(t))return false;
  if(/[^aeiouãõáéíóúâêômrslz]$/.test(t))return false;
  const daPalavra=new Set(p?paresDeConsoante(p):[]);
  if(paresDeConsoante(t).some(x=>!daPalavra.has(x)&&!parLegivel(x)))return false;
  return /[aeiouãõáéíóúâêô]/.test(t);
}
/* ---------- gerador de erros de ortografia: as 4 operações (trocar vizinhas, trocar por letra parecida, tirar uma, dobrar uma) ---------- */
function errosDeGrafia(p,n){
  p=String(p).toLowerCase();const out=new Set(),tenta=[];
  for(let i=0;i<p.length-1;i++)if(p[i]!==p[i+1])tenta.push(p.slice(0,i)+p[i+1]+p[i]+p.slice(i+2));
  /* letra parecida, mas vogal só vira vogal e consoante só vira consoante (N por U dava BOUECA, impossível de ler) */
  const Vg=c=>/[aeiou]/.test(c||'');
  for(let i=0;i<p.length;i++)(CONFUNDE[p[i]]||[]).forEach(c=>{if(c.length===1&&Vg(c)===Vg(p[i]))tenta.push(p.slice(0,i)+c+p.slice(i+1));});
  /* letra a menos: só consoante (tirar vogal deixa sílaba sem vogal: MLA, VCA, PPA, impossível de ler) */
  const V=c=>/[aeiouãõáéíóúâêô]/.test(c||'');
  for(let i=1;i<p.length;i++)if(!V(p[i])&&!(V(p[i-1])&&V(p[i+1])))tenta.push(p.slice(0,i)+p.slice(i+1));   /* nem vogal com vogal (CAA, PAO, SAO) */
  for(let i=1;i<p.length-1;i++)if(/[bcdfglmnprstv]/.test(p[i])&&p[i]!==p[i-1]&&p[i]!==p[i+1])tenta.push(p.slice(0,i+1)+p[i]+p.slice(i+1));
  /* o som do fim: O final soa U e E final soa I no Brasil (RATO -> RATU, DENTE -> DENTI), erro de verdade de quem está aprendendo */
  if(/o$/.test(p))tenta.push(p.slice(0,-1)+'u');if(/e$/.test(p))tenta.push(p.slice(0,-1)+'i');
  /* sílaba trocada de lugar (BOLA -> LABO) */
  const w=PALAVRAS_BASE.find(x=>x.p===p);if(w&&w.s.length>=2){const t=w.s.slice();[t[0],t[1]]=[t[1],t[0]];tenta.push(t.join(''));}
  /* nunca uma palavra de verdade (BALA no lugar de BOLA): conferido contra PALAVRAS_REAIS (corretor pt_BR, build/palavras-reais.swift) */
  shuf(tenta).forEach(t=>{if(out.size<n&&t!==p&&t.length>=2&&!ehPalavraReal(t)&&legivel(t,p)&&!hiatoNovo(t,p))out.add(t);});
  return [...out];
}
const ehPalavraReal=t=>(typeof PALAVRAS_REAIS==='object'&&PALAVRAS_REAIS.has(String(t).toLowerCase()))||PALAVRAS_BASE.some(w=>w.p===String(t).toLowerCase());
/* lacuna que só uma letra completa: nenhuma outra letra de A a Z (nem Ç) forma palavra real naquela posição */
const LETRAS_AZ='abcdefghijklmnopqrstuvwxyzç'.split('');
function lacunaUnica(p,i){return LETRAS_AZ.every(c=>c===p[i]||!ehPalavraReal(p.slice(0,i)+c+p.slice(i+1)));}
/* ---------- banco de palavras com sílabas (2 e 3 sílabas, sílabas simples primeiro) ---------- */
const PALAVRAS_BASE=[
  {p:'bola',s:['bo','la']},{p:'dado',s:['da','do']},{p:'pato',s:['pa','to']},{p:'gato',s:['ga','to']},{p:'mala',s:['ma','la']},{p:'casa',s:['ca','sa']},
  {p:'bolo',s:['bo','lo']},{p:'vaca',s:['va','ca']},{p:'faca',s:['fa','ca']},{p:'lua',s:['lu','a']},{p:'sapo',s:['sa','po']},{p:'tatu',s:['ta','tu']},
  {p:'dedo',s:['de','do']},{p:'pipa',s:['pi','pa']},{p:'mapa',s:['ma','pa']},{p:'rato',s:['ra','to']},{p:'uva',s:['u','va']},{p:'ovo',s:['o','vo']},
  {p:'nuvem',s:['nu','vem']},{p:'janela',s:['ja','ne','la']},{p:'boneca',s:['bo','ne','ca']},{p:'macaco',s:['ma','ca','co']},{p:'sapato',s:['sa','pa','to']},
  {p:'tomate',s:['to','ma','te']},{p:'panela',s:['pa','ne','la']},{p:'cavalo',s:['ca','va','lo']},{p:'banana',s:['ba','na','na']},{p:'menino',s:['me','ni','no']},
  {p:'peteca',s:['pe','te','ca']},{p:'tapete',s:['ta','pe','te']},{p:'galinha',s:['ga','li','nha']},{p:'abacate',s:['a','ba','ca','te']},{p:'borboleta',s:['bor','bo','le','ta']},
  {p:'foguete',s:['fo','gue','te']},{p:'dente',s:['den','te']},{p:'fada',s:['fa','da']},{p:'vela',s:['ve','la']},{p:'tijolo',s:['ti','jo','lo']}
];
/* famílias de rima pelo SOM final no português do Brasil (o L final soa U: MEL rima com CÉU), conferidas em testes/geradores.js */
const RIMAS=[['pão','mão','chão','feijão','balão'],['gato','pato','rato','sapato','prato'],['bola','cola','mola','sacola'],['janela','panela','vela','tigela'],
  ['dedo','medo','cedo','segredo'],['mel','papel','anel','pastel','chapéu','céu','véu','troféu'],['flor','cor','amor','calor'],['casa','asa','brasa'],['foguete','sorvete','tapete','chiclete'],
  ['bico','rico','fico','penico'],['lua','rua','sua','nua'],['caneca','boneca','peteca','sapeca']];
const MAI=s=>String(s).toUpperCase();
/* som final que rima: L final vira U (el=éu, il=iu, al=au, ol=óu); oxítona (acento, ão, r, l, z, u, i no fim) rima a partir da última vogal,
   paroxítona a partir da penúltima */
function somDaRima(w){
  w=String(w).toLowerCase();const oxi=/[áéíóúâêôãõ]|[rlzui]$|ão$|ãe$/.test(w.slice(-3));
  let t=w.normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/([gq])u([ei])/g,'$1$2').replace(/([aeiou])l$/,'$1u');   /* GUE e QUI: o U não soa */
  const vs=[...t.matchAll(/[aeiou]+/g)];if(!vs.length)return t;
  const v=oxi||vs.length<2?vs[vs.length-1]:vs[vs.length-2];
  return t.slice(v.index).replace(/^([aeiou])[aeiou](?=[^aeiou])/,'$1');
}
/* pista curta da palavra alvo da "escrita certa" */
const PISTA_PALAVRA={bola:'brinquedo redondo que rola',dado:'cubo com pontinhos do jogo',pato:'ave que nada e faz quá-quá',gato:'bicho que mia',mala:'leva a roupa na viagem',
  casa:'onde a família mora',bolo:'doce de aniversário onde vão as velinhas',vaca:'bicho que dá leite',faca:'corta o pão',sapo:'bicho verde que pula na lagoa e coaxa',tatu:'bicho com casco que cava buraco',
  dedo:'a mão tem cinco',pipa:'voa no céu presa na linha',mapa:'mostra o caminho',rato:'bichinho que gosta de queijo',nuvem:'fica no céu e traz chuva',
  janela:'abre para entrar ar e luz',boneca:'brinquedo com cara de gente',macaco:'bicho que pula de galho em galho',sapato:'calçado de couro para ir à festa',tomate:'fruto vermelho da salada',
  panela:'vai no fogão para cozinhar a comida',cavalo:'bicho que galopa',banana:'fruta amarela e comprida que o macaco adora',menino:'é o contrário de menina',peteca:'brinquedo de bater com a mão',tapete:'pano macio que fica no chão da sala',
  galinha:'bota ovo',abacate:'fruta verde de caroço grande',borboleta:'inseto de asas coloridas',foguete:'vai para o espaço',dente:'é branco, fica na boca e a gente escova',fada:'tem varinha mágica',
  vela:'acende no bolo',tijolo:'serve para fazer parede'};

/* ---------- português: trilha fonológica ---------- */
const PT_BAS={
  somInicial(){const w=pick(PALAVRAS_BASE),l=w.p[0];
    return mc('Com que letra começa a palavra <b>'+MAI(w.p)+'</b>?',MAI(l),distratoresDaLetra(l,3).map(MAI),{ouvir:'Com que letra começa a palavra '+w.p+'?'});},
  rima(){const f=pick(RIMAS),a=pick(f),certa=pick(f.filter(x=>x!==a));
    const outras=shuf(RIMAS.filter(x=>x!==f&&somDaRima(x[0])!==somDaRima(a))).slice(0,3).map(x=>pick(x));
    return mc('Qual palavra rima com <b>'+MAI(a)+'</b>?',MAI(certa),outras.map(MAI));},
  contarSilabas(){const w=pick(PALAVRAS_BASE);
    return mc('Bata uma palma para cada pedaço: <b>'+MAI(w.p)+'</b>. Quantas sílabas?',String(w.s.length),[1,2,3,4,5].filter(n=>n!==w.s.length).map(String).slice(0,3));},
  juntarSilabas(){const w=pick(PALAVRAS_BASE.filter(x=>x.s.length===2)),erradas=shuf(PALAVRAS_BASE.filter(x=>x.s.length===2&&x.p!==w.p&&(x.s[0]===w.s[0]||x.s[1]===w.s[1]))).slice(0,3).map(x=>MAI(x.p));
    return mc('Junte as sílabas <b>'+MAI(w.s[0])+'</b> e <b>'+MAI(w.s[1])+'</b>. Que palavra forma?',MAI(w.p),erradas.length>=2?erradas:errosDeGrafia(w.p,3).map(MAI));},
  vogalQueFalta(){const pos=PALAVRAS_BASE.filter(x=>x.p.length<=6).map(x=>({w:x,i:[...x.p].map((c,i)=>/[aeiou]/.test(c)&&lacunaUnica(x.p,i)?i:-1).filter(i=>i>=0)})).filter(x=>x.i.length);
    const e=pick(pos),w=e.w,i=pick(e.i),v=w.p[i];
    const lac=MAI(w.p.slice(0,i))+'__'+MAI(w.p.slice(i+1));
    return mc('Qual vogal falta em <b>'+lac+'</b>?',MAI(v),'aeiou'.split('').filter(x=>x!==v).slice(0,3).map(MAI),{ouvir:'Qual vogal falta na palavra '+w.p+'?'});},
  letraQueFalta(){const pos=PALAVRAS_BASE.map(x=>({w:x,i:[...x.p].map((c,i)=>/[bdpqmnfvtl]/.test(c)&&lacunaUnica(x.p,i)?i:-1).filter(i=>i>=0)})).filter(x=>x.i.length);
    const e=pick(pos),w=e.w,i=pick(e.i),l=w.p[i];
    const lac=MAI(w.p.slice(0,i))+'__'+MAI(w.p.slice(i+1));
    return mc('Qual letra completa <b>'+lac+'</b>?',MAI(l),distratoresDaLetra(l,3).map(MAI),{ouvir:'Qual letra completa a palavra '+w.p+'?'});},
  /* a palavra alvo aparece por uma pista (sem voz dá para saber qual é a palavra; as erradas nunca são palavra de verdade) */
  grafiaCerta(){const w=pick(PALAVRAS_BASE.filter(x=>x.p.length>=4&&PISTA_PALAVRA[x.p]&&errosDeGrafia(x.p,3).length>=3));
    return mc('Qual é o jeito certo de escrever: <b>'+PISTA_PALAVRA[w.p]+'</b>?',MAI(w.p),errosDeGrafia(w.p,3).map(MAI),{ouvir:'Qual é o jeito certo de escrever: '+PISTA_PALAVRA[w.p]+'? '+w.p});}
};
/* ---------- matemática: dinheiro, relógio, formas, padrões e historinhas (com figura em SVG, sem emoji) ---------- */
function relogioSVG(h,m){
  const am=m/60*360,ah=((h%12)+m/60)/12*360,p=(a,r)=>[(50+r*Math.sin(a*Math.PI/180)).toFixed(1),(50-r*Math.cos(a*Math.PI/180)).toFixed(1)];
  let t='';for(let i=1;i<=12;i++){const q=p(i*30,38);t+='<text x="'+q[0]+'" y="'+(+q[1]+4)+'" class="rel-n" font-size="9">'+i+'</text>';}
  const H=p(ah,22),M=p(am,33);
  return '<svg class="relogio" viewBox="0 0 100 100" role="img" aria-label="relógio"><circle class="rel-fundo" cx="50" cy="50" r="46"/>'+t+
    '<path class="rel-h" d="M50 50L'+H[0]+' '+H[1]+'"/><path class="rel-m" d="M50 50L'+M[0]+' '+M[1]+'"/><circle class="rel-c" cx="50" cy="50" r="3"/></svg>';
}
const NOME_HORA=(h,m)=>(h===1?'1 hora':h+' horas')+(m===30?' e meia':(m?' e '+m+' minutos':''));
function formaSVG(n){
  if(n===0)return '<svg class="forma" viewBox="0 0 100 100" role="img" aria-label="forma"><circle class="fm" cx="50" cy="50" r="40"/></svg>';
  let d='';for(let i=0;i<n;i++){const a=(i/n)*2*Math.PI-Math.PI/2;d+=(i?'L':'M')+(50+40*Math.cos(a)).toFixed(1)+' '+(52+40*Math.sin(a)).toFixed(1);}
  return '<svg class="forma" viewBox="0 0 100 100" role="img" aria-label="forma"><path class="fm" d="'+d+'Z"/></svg>';
}
const NOME_FORMA={3:'triângulo',4:'quadrado',5:'pentágono',6:'hexágono',0:'círculo'};
/* três erradas distintas, positivas e diferentes da certa (o mc só completa até 3 opções e não completa valor em reais) */
function tresErradas(certa,cands,fmt){const out=[];fmt=fmt||String;
  cands.forEach(v=>{if(out.length<3&&v>=1&&v!==certa&&out.indexOf(v)<0)out.push(v);});
  for(let d=1;out.length<3;d++)[certa+d,certa-d].forEach(v=>{if(out.length<3&&v>=1&&v!==certa&&out.indexOf(v)<0)out.push(v);});
  return out.map(fmt);}
const MAT_BAS={
  dinheiro(){const m1=R(1,4),n=pick([2,5,10]),tot=m1+n;
    return mc('Uma criança tem '+m1+(m1===1?' moeda':' moedas')+' de R$&nbsp;1 e uma nota de R$&nbsp;'+n+'. Quanto ela tem ao todo?',money(tot),tresErradas(tot,[tot+1,tot-1,m1*n,n,tot+2],money),{ouvir:'Uma criança tem '+m1+(m1===1?' moeda':' moedas')+' de 1 real e uma nota de '+n+' reais. Quanto ela tem ao todo?'});},
  troco(){const preco=R(2,9),pago=preco<5?5:10,t=pago-preco;
    return mc('Um lanche custa R$&nbsp;'+preco+'. Pagando com uma nota de R$&nbsp;'+pago+', quanto volta de troco?',money(t),tresErradas(t,[t+1,t+2,t-1,preco],money),{ouvir:'Um lanche custa '+preco+' reais. Pagando com uma nota de '+pago+' reais, quanto volta de troco?'});},
  relogioHora(){const h=R(1,12),m=pick([0,0,30]),certa=NOME_HORA(h,m);
    const cand=[NOME_HORA(h%12+1,m),NOME_HORA(h,m===30?0:30),NOME_HORA((h+5)%12+1,m),NOME_HORA((h+10)%12+1,m)].filter((x,i,a)=>x!==certa&&a.indexOf(x)===i);
    return mc('Que horas o relógio marca?',certa,cand.slice(0,3),{figure:relogioSVG(h,m)});},
  formas(){const n=pick([3,4,5,6]);
    return mc('Quantos lados tem esta forma?',String(n),[3,4,5,6,8].filter(x=>x!==n).slice(0,3).map(String),{figure:formaSVG(n)});},
  formaNome(){const n=pick([0,3,4,6]);
    return mc('Qual é o nome desta forma?',NOME_FORMA[n],Object.keys(NOME_FORMA).filter(k=>+k!==n).map(k=>NOME_FORMA[k]).slice(0,3),{figure:formaSVG(n)});},
  padrao(){const passo=pick([2,3,5,10]),ini=R(0,5)*passo/(passo===10?1:1),seq=[0,1,2,3].map(i=>ini+i*passo),prox=ini+4*passo;
    return mc('Qual número continua o padrão? <b>'+seq.join(', ')+', ?</b>',String(prox),[prox+1,prox-1,prox+passo].map(String));},
  historinhaSoma(){const [a]=nome2(),x=R(3,12),y=R(2,8);
    return mc(a+' tinha '+x+' figurinhas e ganhou mais '+y+'. Com quantas figurinhas '+a+' ficou?',String(x+y),[x+y+1,x+y-1,Math.abs(x-y)].map(String));},
  historinhaTira(){const [a,b]=nome2(),x=R(8,15),y=R(2,7);
    return mc(a+' tinha '+x+' balas e deu '+y+' para '+b+'. Quantas balas sobraram?',String(x-y),[x+y,x-y+1,x-y-1].map(String));},
  historinhaReparte(){const [a]=nome2(),g=pick([2,3,4]),c=R(2,5),tot=g*c;
    return mc(a+' repartiu '+tot+' biscoitos igualmente entre '+g+' amigos. Quantos biscoitos cada amigo ganhou?',String(c),tresErradas(c,[c+1,c-1,tot-g,g,c+2]));},
  historinhaCompara(){const [a,b]=nome2(),x=R(6,15),y=R(2,x-2);
    return mc(a+' tem '+x+' carrinhos e '+b+' tem '+y+'. Quantos carrinhos '+a+' tem a mais?',String(x-y),[x+y,x-y+1,x-y-1].map(String));}
};
/* ---------- inglês: som inicial da palavra com letras confundíveis ---------- */
const EN_BAS_PALAVRAS=['book','dog','pen','bird','door','pink','bed','duck','pig'];   /* só palavras que já têm voz gravada em inglês */
const EN_BAS={
  letraInicial(){const w=pick(EN_BAS_PALAVRAS),l=w[0];
    return mc('Which letter starts <b>'+w+'</b>? (Com que letra começa?)',l.toUpperCase(),distratoresDaLetra(l,3).map(x=>x.toUpperCase()),{ouvir:w,lang:'en-US'});}
};
/* "Como fazer" de cada gerador novo (vai em q.dica: a ajuda vem do próprio gerador; conteudo/ajudas.js) */
function comDica(obj,dicas){Object.keys(dicas).forEach(k=>{const f=obj[k];obj[k]=function(){const q=f();if(q&&!q.dica)q.dica=dicas[k];return q;};});}
comDica(PT_BAS,{somInicial:'Fale a palavra devagar e preste atenção no primeiro som. Que letra faz esse som?',
  rima:'Rimar é terminar com o mesmo som. Fale as duas palavras e escute o final de cada uma.',
  contarSilabas:'Fale a palavra batendo uma palma em cada pedaço. Conte as palmas.',
  juntarSilabas:'Fale as duas sílabas uma logo depois da outra, bem juntinhas.',
  vogalQueFalta:'Fale a palavra inteira devagar. Que som de A, E, I, O ou U está faltando?',
  letraQueFalta:'Fale a palavra devagar e escute o som que falta. Cuidado com as letras parecidas, como B e D, P e Q.',
  grafiaCerta:'Leia cada opção bem devagar, letra por letra. A certa tem todas as letras no lugar.'});
comDica(MAT_BAS,{dinheiro:'Some o valor de cada moeda e o da nota. Conte as moedas primeiro e depois junte a nota.',
  troco:'Troco é o que sobra: conte do preço até o valor que você pagou.',
  relogioHora:'O ponteiro pequeno mostra a hora. O grande mostra os minutos: no 12 é hora certa, no 6 é e meia.',
  formas:'Conte os lados com o dedo, um por um, até voltar ao começo.',
  formaNome:'Conte os lados: 3 é triângulo, 4 é quadrado, 6 é hexágono. Sem lados retos é círculo.',
  padrao:'Veja quanto o número pula de um para o outro e dê o mesmo pulo mais uma vez.',
  historinhaSoma:'Ganhou é juntar: some o que tinha com o que ganhou.',historinhaTira:'Deu é tirar: do que tinha, tire o que deu.',
  historinhaReparte:'Repartir igual é dividir: distribua um para cada amigo até acabar.',historinhaCompara:'A mais é a diferença: tire o menor do maior.'});
comDica(EN_BAS,{letraInicial:'Ouça a palavra em inglês e preste atenção no primeiro som.'});
/* em que fase cada gerador entra (sempre no fim da lista da fase) */
const BASICAS_POR_FASE={
  /* 1.1 (contar as sementes) fica só com contagem: a fase precisa de 5 em 8 perguntas com objetos para tocar (testes/variedade.js) */
  '1.2':[MAT_BAS.historinhaCompara],'1.5':[MAT_BAS.relogioHora,MAT_BAS.padrao],
  '2.1':[MAT_BAS.historinhaSoma],'2.3':[MAT_BAS.historinhaTira],'2.5':[MAT_BAS.dinheiro,MAT_BAS.troco],
  '3.1':[MAT_BAS.historinhaReparte],'3.2':[MAT_BAS.formaNome,MAT_BAS.formas],
  'p1.1':[PT_BAS.vogalQueFalta],'p1.4':[PT_BAS.somInicial],'p2.1':[PT_BAS.contarSilabas,PT_BAS.rima],'p2.5':[PT_BAS.juntarSilabas],
  'p3.3':[PT_BAS.letraQueFalta],'p3.5':[PT_BAS.grafiaCerta],
  'e2.4':[EN_BAS.letraInicial],'e3.4':[EN_BAS.letraInicial]
};
(function encaixarBasicas(){
  [UNITS_MAT,UNITS_PT,UNITS_EN].forEach(us=>us.forEach(u=>u.lessons.forEach(l=>{const ex=BASICAS_POR_FASE[l.id];if(ex)l.makers=l.makers.concat(ex);})));
})();
