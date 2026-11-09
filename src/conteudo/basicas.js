/* ===== Aulas básicas (etapas 1 a 3 de cada planeta) com os 7 itens aprovados da engenharia reversa (docs/referencias/ENGENHARIA-REVERSA-...md) =====
   Itens 1 a 3 aqui: (1) dinheiro, relógio, formas, padrões e historinhas como geradores; (2) trilha fonológica de 7 a 8 anos (som inicial, rima,
   contar e juntar sílabas, vogal e letra que falta, grafia certa); (3) distratores por letras confundíveis e gerador de erros de ortografia.
   Banco de palavras e famílias de rima escritos aqui (não copiados dos apps). Figuras em SVG simples com classes (cores no :root).
   Os geradores entram NO FIM da lista de cada fase (a chave da habilidade é a posição: interface/adaptacao.js). */

/* ---------- letras que se confundem de verdade (b/d/p/q, m/n, u/v, f/t, i/l, a/o/e) ---------- */
const CONFUNDE={b:['d','p','q'],d:['b','p','q'],p:['q','b','d'],q:['p','d','b'],m:['n','u'],n:['m','u'],u:['v','n'],v:['u','f'],f:['t','v'],t:['f','l'],
  i:['l','j'],l:['i','t'],a:['o','e'],o:['a','e'],e:['a','o'],c:['e','o'],g:['q','j'],j:['g','i'],s:['z','c'],z:['s','x'],r:['n','l'],x:['z','ch']};
function distratoresDaLetra(l,n){
  const c=(CONFUNDE[l]||[]).slice(),out=[];
  shuf(c).forEach(x=>{if(out.length<n&&x!==l&&out.indexOf(x)<0)out.push(x);});
  const reserva='abcdefgilmnoprstuv'.split('');
  while(out.length<n){const x=pick(reserva);if(x!==l&&out.indexOf(x)<0)out.push(x);}
  return out;
}
/* ---------- gerador de erros de ortografia: as 4 operações (trocar vizinhas, trocar por letra parecida, tirar uma, dobrar uma) ---------- */
function errosDeGrafia(p,n){
  p=String(p).toLowerCase();const out=new Set(),tenta=[];
  for(let i=0;i<p.length-1;i++)if(p[i]!==p[i+1])tenta.push(p.slice(0,i)+p[i+1]+p[i]+p.slice(i+2));
  for(let i=0;i<p.length;i++)(CONFUNDE[p[i]]||[]).forEach(c=>tenta.push(p.slice(0,i)+c+p.slice(i+1)));
  for(let i=1;i<p.length;i++)tenta.push(p.slice(0,i)+p.slice(i+1));
  for(let i=1;i<p.length-1;i++)if(/[bcdfglmnprstv]/.test(p[i])&&p[i]!==p[i-1]&&p[i]!==p[i+1])tenta.push(p.slice(0,i+1)+p[i]+p.slice(i+1));
  shuf(tenta).forEach(t=>{if(out.size<n&&t!==p&&t.length>=2&&!PALAVRAS_BASE.some(w=>w.p===t))out.add(t);});
  return [...out];
}
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
/* famílias de rima (fim igual) */
const RIMAS=[['pão','mão','chão','feijão','balão'],['gato','pato','rato','sapato','prato'],['bola','cola','mola','sacola'],['janela','panela','vela','tigela'],
  ['dedo','medo','cedo','segredo'],['mel','papel','anel','chapéu'],['flor','cor','amor','calor'],['casa','asa','brasa'],['foguete','sorvete','tapete','chiclete'],
  ['bico','rico','fico','penico'],['lua','rua','sua','nua'],['caneca','boneca','peteca','sapeca']];
const MAI=s=>String(s).toUpperCase();

/* ---------- português: trilha fonológica ---------- */
const PT_BAS={
  somInicial(){const w=pick(PALAVRAS_BASE),l=w.p[0];
    return mc('Com que letra começa a palavra <b>'+MAI(w.p)+'</b>?',MAI(l),distratoresDaLetra(l,3).map(MAI),{ouvir:'Com que letra começa a palavra '+w.p+'?'});},
  rima(){const f=pick(RIMAS),a=pick(f),certa=pick(f.filter(x=>x!==a));
    const outras=shuf(RIMAS.filter(x=>x!==f)).slice(0,3).map(x=>pick(x));
    return mc('Qual palavra rima com <b>'+MAI(a)+'</b>?',MAI(certa),outras.map(MAI));},
  contarSilabas(){const w=pick(PALAVRAS_BASE);
    return mc('Bata uma palma para cada pedaço: <b>'+MAI(w.p)+'</b>. Quantas sílabas?',String(w.s.length),[1,2,3,4,5].filter(n=>n!==w.s.length).map(String).slice(0,3));},
  juntarSilabas(){const w=pick(PALAVRAS_BASE.filter(x=>x.s.length===2)),erradas=shuf(PALAVRAS_BASE.filter(x=>x.s.length===2&&x.p!==w.p&&(x.s[0]===w.s[0]||x.s[1]===w.s[1]))).slice(0,3).map(x=>MAI(x.p));
    return mc('Junte as sílabas <b>'+MAI(w.s[0])+'</b> e <b>'+MAI(w.s[1])+'</b>. Que palavra forma?',MAI(w.p),erradas.length>=2?erradas:errosDeGrafia(w.p,3).map(MAI));},
  vogalQueFalta(){const w=pick(PALAVRAS_BASE.filter(x=>x.p.length<=6)),idx=[...w.p].map((c,i)=>/[aeiou]/.test(c)?i:-1).filter(i=>i>=0),i=pick(idx),v=w.p[i];
    const lac=MAI(w.p.slice(0,i))+'__'+MAI(w.p.slice(i+1));
    return mc('Qual vogal falta em <b>'+lac+'</b>?',MAI(v),'aeiou'.split('').filter(x=>x!==v).slice(0,3).map(MAI),{ouvir:'Qual vogal falta na palavra '+w.p+'?'});},
  letraQueFalta(){const w=pick(PALAVRAS_BASE.filter(x=>/[bdpqmnfvtl]/.test(x.p))),idx=[...w.p].map((c,i)=>/[bdpqmnfvtl]/.test(c)?i:-1).filter(i=>i>=0),i=pick(idx),l=w.p[i];
    const lac=MAI(w.p.slice(0,i))+'__'+MAI(w.p.slice(i+1));
    return mc('Qual letra completa <b>'+lac+'</b>?',MAI(l),distratoresDaLetra(l,3).map(MAI),{ouvir:'Qual letra completa a palavra '+w.p+'?'});},
  grafiaCerta(){const w=pick(PALAVRAS_BASE.filter(x=>x.p.length>=4));
    return mc('Qual está escrita do jeito certo?',MAI(w.p),errosDeGrafia(w.p,3).map(MAI),{ouvir:'Qual palavra está escrita do jeito certo? '+w.p});}
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
const MAT_BAS={
  dinheiro(){const m1=R(1,4),n=pick([2,5,10]),tot=m1+n;
    return mc('Uma criança tem '+m1+(m1===1?' moeda':' moedas')+' de R$&nbsp;1 e uma nota de R$&nbsp;'+n+'. Quanto ela tem ao todo?',money(tot),[money(tot+1),money(Math.max(1,tot-1)),money(m1*n)],{ouvir:'Uma criança tem '+m1+(m1===1?' moeda':' moedas')+' de 1 real e uma nota de '+n+' reais. Quanto ela tem ao todo?'});},
  troco(){const preco=R(2,9),pago=preco<5?5:10,t=pago-preco;
    return mc('Um lanche custa R$&nbsp;'+preco+'. Pagando com uma nota de R$&nbsp;'+pago+', quanto volta de troco?',money(t),[money(t+1),money(t+2),money(Math.max(1,t-1))].filter(x=>x!==money(t)),{ouvir:'Um lanche custa '+preco+' reais. Pagando com uma nota de '+pago+' reais, quanto volta de troco?'});},
  relogioHora(){const h=R(1,12),m=pick([0,0,30]);
    return mc('Que horas o relógio marca?',NOME_HORA(h,m),[NOME_HORA(h%12+1,m),NOME_HORA(h,m===30?0:30),NOME_HORA((h+5)%12+1,m)],{figure:relogioSVG(h,m)});},
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
    return mc(a+' repartiu '+tot+' biscoitos igualmente entre '+g+' amigos. Quantos biscoitos cada amigo ganhou?',String(c),[c+1,Math.max(1,c-1),tot-g].map(String));},
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
