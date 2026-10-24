/* ---------- verbos na cena (mesa 03, mudanças 1, 2, 3, 7 e 12; síntese 1B) ----------
   A pergunta deixa de ser só "toque na alternativa": a criança TOCA objeto por objeto para contar, ARRASTA objetos para cestas (ou toca origem e
   destino), toca a LETRA dentro da palavra, ORDENA cartas tocando na ordem e ouve e toca a placa (inglês). Ligar e traçar entram na sessão 1B2.
   Regras iguais para todo verbo: pressionado no mesmo quadro (.pressionado), hit-stop de 70 ms no acerto, o objeto certo faz squash, no erro o
   objeto balança sem vermelho, e o que a criança fez permanece na cena até a pergunta acabar. Objetos em SVG leve (sem arte nova por enquanto;
   pedido em arte/PEDIDOS-DE-ARTE.md), um tipo por capítulo. */
const VERBOS_OFICIAIS=['tocar','arrastar','ligar','ordenar','tracar'];
/* verbos que têm tela própria (os outros, como tocar-ouvir, usam a lista de alternativas de sempre) */
const VERBOS_COM_TELA=['tocar-objetos','arrastar','tocar-letra','ordenar'];
const temTelaPropria=q=>!!(q&&q.verbo&&VERBOS_COM_TELA.indexOf(q.verbo)>=0);
const OBJ_SVG={
  semente:'<svg viewBox="0 0 32 32"><path class="o1" d="M16 3c6 4 9 9 9 15a9 9 0 0 1-18 0c0-6 3-11 9-15Z"/><path class="o2" d="M16 7c3 3 5 7 5 11a5 5 0 0 1-10 0c0-4 2-8 5-11Z"/></svg>',
  maca:'<svg viewBox="0 0 32 32"><path class="o1" d="M11 9c-5 0-8 5-8 10 0 6 5 11 9 11 2 0 3-1 4-1s2 1 4 1c4 0 9-5 9-11 0-5-3-10-8-10-2 0-3 1-5 1s-3-1-5-1Z"/><path class="o3" d="M16 9c0-3 2-6 5-6"/></svg>',
  concha:'<svg viewBox="0 0 32 32"><path class="o1" d="M16 4 5 24a3 3 0 0 0 3 4h16a3 3 0 0 0 3-4L16 4Z"/><path class="o2" d="M16 8v18M10 22l6-11 6 11"/></svg>',
  caixa:'<svg viewBox="0 0 32 32"><rect class="o1" x="4" y="9" width="24" height="19" rx="2"/><path class="o2" d="M4 14h24M16 9v19"/><path class="o3" d="M8 9l4-5h8l4 5"/></svg>',
  lanche:'<svg viewBox="0 0 32 32"><rect class="o1" x="4" y="8" width="24" height="16" rx="6"/><path class="o2" d="M8 16h16"/><circle class="o3" cx="12" cy="12" r="1.5"/><circle class="o3" cx="20" cy="12" r="1.5"/></svg>',
  fatia:'<svg viewBox="0 0 32 32"><path class="o1" d="M16 4 28 26a2 2 0 0 1-2 3H6a2 2 0 0 1-2-3L16 4Z"/><circle class="o3" cx="16" cy="18" r="2.5"/><circle class="o3" cx="11" cy="24" r="2"/><circle class="o3" cx="21" cy="24" r="2"/></svg>',
  letra:'<svg viewBox="0 0 32 32"><rect class="o1" x="3" y="3" width="26" height="26" rx="5"/><path class="o2" d="M8 8h16v16H8z"/></svg>',
  vagao:'<svg viewBox="0 0 32 32"><rect class="o1" x="3" y="8" width="26" height="15" rx="3"/><circle class="o3" cx="10" cy="26" r="3"/><circle class="o3" cx="22" cy="26" r="3"/></svg>',
  placa:'<svg viewBox="0 0 32 32"><rect class="o1" x="4" y="5" width="24" height="14" rx="3"/><path class="o3" d="M16 19v10M12 29h8"/></svg>',
  bilhete:'<svg viewBox="0 0 32 32"><rect class="o1" x="3" y="7" width="26" height="18" rx="3"/><path class="o2" d="M3 10l13 9 13-9"/></svg>',
  cesta:'<svg viewBox="0 0 64 48"><path class="o1" d="M6 18h52l-6 26H12L6 18Z"/><path class="o2" d="M14 18c2-10 34-10 36 0"/><path class="o2" d="M10 28h44"/></svg>'
};
/* um objeto por capítulo (história da etapa) */
const OBJ_POR_ETAPA={
  mat:{1:'semente',2:'concha',3:'caixa',4:'lanche',5:'fatia',6:'caixa',7:'caixa',8:'maca',9:'caixa',10:'semente'},
  pt:{1:'letra',2:'vagao',3:'bilhete',4:'letra',5:'bilhete',6:'caixa',7:'letra',8:'bilhete',9:'letra',10:'vagao'},
  en:{1:'placa',2:'placa',3:'bilhete',4:'maca',5:'lanche',6:'caixa',7:'caixa',8:'placa',9:'bilhete',10:'placa'}
};
/* [singular, plural, gênero] */
const NOME_OBJ={semente:['semente','sementes','a'],maca:['maçã','maçãs','a'],concha:['concha','conchas','a'],caixa:['caixa','caixas','a'],lanche:['lanche','lanches','o'],fatia:['fatia','fatias','a'],letra:['peça','peças','a'],vagao:['vagão','vagões','o'],placa:['placa','placas','a'],bilhete:['bilhete','bilhetes','o']};
const art=(nome,pl)=>(nome[2]==='o'?(pl?'os':'o'):(pl?'as':'a'));
const quant=nome=>nome[2]==='o'?'Quantos':'Quantas';
const umA=nome=>nome[2]==='o'?'um':'uma';
function objetoDaFase(l){
  const id=String(l&&l.id||''),mat=id.charAt(0)==='p'?'pt':(id.charAt(0)==='e'?'en':'mat');
  const n=parseInt(id.replace(/^[pe]/,''),10)||1;
  return (OBJ_POR_ETAPA[mat]||OBJ_POR_ETAPA.mat)[n]||'semente';
}
const objetoHTML=(tipo,i,extra)=>'<button type="button" class="obj'+(extra&&extra.cls?' '+extra.cls:'')+'" data-i="'+i+'"'+(extra&&extra.attrs?' '+extra.attrs:'')+' aria-label="'+(NOME_OBJ[tipo]||['objeto'])[0]+' '+(i+1)+'">'+OBJ_SVG[tipo]+'<span class="obj-n" aria-hidden="true"></span></button>';

/* o verbo de uma pergunta (qualquer tipo) */
function verboDe(q){
  if(!q)return 'tocar';
  if(q.verbo)return q.verbo.split('-')[0];
  if(q.type==='silabas')return 'ordenar';
  if(q.type==='input'||q.type==='texto')return 'digitar';
  return 'tocar';
}
/* ---------- conversão: o que o gerador fez vira verbo na cena quando a pergunta permite ---------- */
function comVerbo(q,l){
  if(!q||q.__item||q.__aquec)return q;
  const p=String(q.prompt||'').replace(/<[^>]+>/g,''),tipoObj=objetoDaFase(l);
  /* contar bolinhas → tocar objeto por objeto (zero bolinhas genéricas na etapa com história) */
  if(q.type==='mc'&&/quant[ao]s bolinhas/i.test(p)&&/dots/.test(String(q.figure||''))&&+q.answer<=24){
    const n=+q.answer,nome=NOME_OBJ[tipoObj];
    q.verbo='tocar-objetos';q.objetos={n:n,tipo:tipoObj};q.figure='';
    q.prompt=/ao todo/i.test(p)?'Toque em cada '+nome[0]+' para contar. '+quant(nome)+' '+nome[1]+' são ao todo?':'Toque em cada '+nome[0]+' para contar. '+quant(nome)+' '+nome[1]+' tem aqui?';
    return q;
  }
  /* vem depois / vem antes (até 20): contar os objetos e mais um (ou menos um) tocando */
  let m;
  if(q.type==='mc'&&(m=p.match(/vem (depois|antes) do (\d+)\?/i))&&+m[2]<=20&&+m[2]>=1){
    const n=+m[2],dep=m[1].toLowerCase()==='depois',nome=NOME_OBJ[tipoObj];
    q.verbo='tocar-objetos';q.objetos={n:dep?n+1:n,tipo:tipoObj,nova:dep?1:0,tirada:dep?0:1};q.figure='';
    q.prompt=dep?'São '+n+' '+nome[1]+' e chegou mais '+umA(nome)+'. Toque em cada '+umA(nome)+' para contar: que número vem depois do '+n+'?'
              :'São '+n+' '+nome[1]+' e '+umA(nome)+' saiu. Toque n'+art(nome,true)+' que ficaram para contar: que número vem antes do '+n+'?';
    return q;
  }
  if(q.type==='input'&&(m=p.match(/Se você tem (\d+) figurinhas e ganha mais 1, fica com quantas\?/i))&&+m[1]<=20){
    const n=+m[1],nome=NOME_OBJ[tipoObj];
    q.type='mc';q.options=shufA([String(n+1),String(n),String(n+2)]);q.answer=String(n+1);
    q.verbo='tocar-objetos';q.objetos={n:n+1,tipo:tipoObj,nova:1,tirada:0};
    q.prompt='Você tinha '+n+' '+nome[1]+' e ganhou mais '+umA(nome)+'. Toque em cada '+umA(nome)+' para contar: com '+quant(nome).toLowerCase()+' ficou?';
    return q;
  }
  if(q.type==='input'&&(m=p.match(/^(\d+) (bolinhas|balas) (repartidas igualmente em|divididas entre) (\d+) (grupos|crianças)/i))&&+m[1]<=24&&+m[4]<=5){
    const n=+m[1],g=+m[4],nome=NOME_OBJ[tipoObj];
    q.verbo='arrastar';q.objetos={n:n,tipo:tipoObj};q.cestas=g;q.figure='';q.modo='cada';
    q.prompt='Arraste '+art(nome,true)+' '+n+' '+nome[1]+' para as '+g+' cestas, o mesmo tanto em cada uma. '+quant(nome)+' ficam em cada cesta?';
    return q;
  }
  if(q.type==='grupinhos'&&q.alvoG<=5&&q.alvoG*q.alvoP<=24){
    const n=q.alvoG*q.alvoP,nome=NOME_OBJ[tipoObj];
    q.verbo='arrastar';q.objetos={n:n,tipo:tipoObj};q.cestas=q.alvoG;q.modo='total';
    q.prompt='Monte '+q.alvoG+' grupos de '+q.alvoP+': arraste '+q.alvoP+' '+nome[1]+' para cada cesta. '+quant(nome)+' são ao todo?';
    return q;
  }
  /* letra dentro da palavra → tocar na letra */
  if(q.type==='mc'&&(m=p.match(/(primeira vogal|primeira letra|última letra|com que letra começa|com que letra termina) (?:de |a palavra )?([A-ZÁ-Ú]{3,})/i))){
    q.verbo='tocar-letra';q.palavra=m[2].toUpperCase();q.figure='';
    return q;
  }
  if(q.type==='mc'&&(m=p.match(/^Com que letra (começa|termina) ([A-ZÁ-Ú]{3,})\?/i))){q.verbo='tocar-letra';q.palavra=m[2].toUpperCase();return q;}
  /* ordem alfabética → ordenar cartas tocando na ordem */
  if(q.type==='mc'&&(m=p.match(/^Coloque em ordem: (.+)$/))){
    const cartas=m[1].split(/,\s*/).map(x=>x.trim()).filter(Boolean);
    if(cartas.length>=3&&cartas.length<=5){q.verbo='ordenar';q.cartas=cartas;q.prompt='Toque nas letras na ordem do alfabeto.';}
    return q;
  }
  /* ouvir e tocar (inglês): já é toque com áudio obrigatório; só marca */
  if(q.type==='mc'&&q.ouvir&&q.lang==='en-US'){q.verbo='tocar-ouvir';return q;}
  return q;
}
/* ordem: nunca 3 perguntas seguidas do mesmo verbo (a 1ª continua sendo de reconhecer). Guloso: a cada posição entra a pergunta do verbo
   com mais sobras que não forme trinca; quando não há como evitar (fase com um verbo só), fica como está. */
function ordenarVerbos(qs){
  if(qs.length<3)return qs;
  const resto=qs.slice(1),out=[qs[0]];
  const grupos={};resto.forEach(q=>{const v=verboDe(q);(grupos[v]=grupos[v]||[]).push(q);});
  while(out.length<qs.length){
    const n=out.length,u1=n>=1?verboDe(out[n-1]):'',u2=n>=2?verboDe(out[n-2]):'';
    const cand=Object.keys(grupos).filter(v=>grupos[v].length).sort((x,y)=>grupos[y].length-grupos[x].length);
    let v=cand.find(v=>!(v===u1&&v===u2));
    if(!v)v=cand[0];
    out.push(grupos[v].shift());
  }
  return out;
}
function aplicarVerbos(qs,l){
  try{return ordenarVerbos(qs.map(q=>comVerbo(q,l)));}catch(e){return qs;}
}
/* ---------- a tela de cada verbo ---------- */
function verbosHTML(q){
  if(q.verbo==='tocar-objetos'){
    let h='<div class="cena-obj" data-verbo="tocar" aria-label="Objetos para contar">';
    for(let i=0;i<q.objetos.n;i++)h+=objetoHTML(q.objetos.tipo,i,{cls:(q.objetos.nova&&i===q.objetos.n-1?'nova':'')+(q.objetos.tirada&&i===q.objetos.n-1?' tirada':''),attrs:'style="--dx:'+((i*37)%23-11)+'px;--dy:'+((i*53)%17-8)+'px"'+(q.objetos.tirada&&i===q.objetos.n-1?' disabled aria-label="'+(NOME_OBJ[q.objetos.tipo]||['objeto'])[0]+' que saiu"':'')});
    h+='</div><p class="contagem" id="contagem" aria-live="polite">Toque em cada uma para contar</p>';
    h+='<div class="alts curtas tres">'+q.options.map((o,k)=>'<button class="alt" data-v="'+k+'"><span>'+htmlSeguro(o,20)+'</span></button>').join('')+'</div>';
    return h;
  }
  if(q.verbo==='arrastar'){
    let h='<div class="cena-obj arrastar" data-verbo="arrastar"><div class="origem" id="origem" aria-label="Objetos">';
    for(let i=0;i<q.objetos.n;i++)h+=objetoHTML(q.objetos.tipo,i,{cls:'solto',attrs:'draggable="false"'});
    h+='</div><div class="cestas">';
    for(let c=0;c<q.cestas;c++)h+='<button type="button" class="cesta" data-c="'+c+'" aria-label="cesta '+(c+1)+'">'+OBJ_SVG.cesta+'<span class="cesta-n" aria-hidden="true">0</span><span class="cesta-itens"></span></button>';
    h+='</div></div><p class="contagem" id="contagem" aria-live="polite">Arraste cada uma até uma cesta, ou toque nela e depois na cesta</p>';
    return h;
  }
  if(q.verbo==='tocar-letra'){
    return '<div class="palavra-toque" role="group" aria-label="Letras de '+escapa(q.palavra)+'">'+
      q.palavra.split('').map((l,i)=>'<button type="button" class="letra-t" data-l="'+escapa(l)+'" data-i="'+i+'" aria-label="letra '+escapa(l)+'">'+escapa(l)+'</button>').join('')+'</div>'+
      '<p class="contagem" id="contagem">Toque na letra certa dentro da palavra</p>';
  }
  if(q.verbo==='ordenar'){
    return '<div class="fila-ordem" id="fila-ordem" aria-label="Sua ordem"></div><div class="cartas" role="group" aria-label="Cartas">'+
      q.cartas.map((c,i)=>'<button type="button" class="carta" data-i="'+i+'" data-v="'+escapa(c)+'">'+escapa(c)+'</button>').join('')+'</div>'+
      '<button type="button" class="btn fantasma" id="ordem-apaga">tirar a última</button>';
  }
  return '';
}
/* ---------- comportamento ---------- */
const VER={cont:0,marcados:[],pego:null,cestas:[],ordem:[]};
function contagemTexto(t){const c=$('#contagem');if(c)c.textContent=t;}
function ligarVerbos(q){
  VER.cont=0;VER.marcados=[];VER.pego=null;VER.cestas=[];VER.ordem=[];
  const palco=$('#palco');
  if(q.verbo==='tocar-objetos'){
    palco.querySelectorAll('.obj').forEach(o=>o.addEventListener('pointerdown',()=>{
      if(LIC.conferido)return;
      const i=+o.dataset.i;
      if(o.classList.contains('marcado')){o.classList.remove('marcado');o.querySelector('.obj-n').textContent='';VER.marcados=VER.marcados.filter(x=>x!==i);}
      else{VER.marcados.push(i);o.classList.add('marcado');o.querySelector('.obj-n').textContent=VER.marcados.length;}
      /* renumera na ordem em que foram tocados: o número aparece no mesmo evento (menos de 100 ms) */
      VER.marcados.forEach((k,n)=>{const e=palco.querySelector('.obj[data-i="'+k+'"] .obj-n');if(e)e.textContent=n+1;});
      VER.cont=VER.marcados.length;
      contagemTexto(VER.cont?VER.cont+' contada'+(VER.cont>1?'s':''):'Toque em cada uma para contar');
      sfx('seleciona');
    },{passive:true}));
    palco.querySelectorAll('.alt').forEach(b=>b.addEventListener('click',()=>{
      if(LIC.conferido)return;
      palco.querySelectorAll('.alt').forEach(x=>x.classList.remove('sel'));
      b.classList.add('sel');LIC.resp=q.options[+b.dataset.v];$('#acao').disabled=false;
    }));
    return;
  }
  if(q.verbo==='arrastar'){
    VER.cestas=Array.from({length:q.cestas},()=>[]);
    const cestas=Array.from(palco.querySelectorAll('.cesta')),origem=$('#origem');
    const cestaPerto=(x,y)=>{   /* ímã de 24 px: a cesta cujo retângulo (crescido 24 px) contém o ponto */
      for(const c of cestas){const r=c.getBoundingClientRect();if(x>=r.left-24&&x<=r.right+24&&y>=r.top-24&&y<=r.bottom+24)return c;}
      return null;
    };
    const poe=(o,c)=>{
      const i=+o.dataset.i,ci=+c.dataset.c;
      VER.cestas.forEach(l=>{const k=l.indexOf(i);if(k>=0)l.splice(k,1);});
      VER.cestas[ci].push(i);
      o.classList.remove('solto','pego');o.classList.add('na-cesta');o.style.transform='';
      c.querySelector('.cesta-itens').appendChild(o);
      cestas.forEach((cc,k)=>{cc.querySelector('.cesta-n').textContent=VER.cestas[k].length;});
      VER.pego=null;palco.querySelectorAll('.obj').forEach(x=>x.classList.remove('pego'));
      sfx('encaixa');atualizaArrastar(q);
    };
    const tira=(o)=>{const i=+o.dataset.i;VER.cestas.forEach(l=>{const k=l.indexOf(i);if(k>=0)l.splice(k,1);});o.classList.remove('na-cesta');o.classList.add('solto');origem.appendChild(o);
      cestas.forEach((cc,k)=>{cc.querySelector('.cesta-n').textContent=VER.cestas[k].length;});atualizaArrastar(q);};
    palco.querySelectorAll('.obj').forEach(o=>{
      let x0=0,y0=0,dx=0,dy=0,arrastou=false;
      o.addEventListener('pointerdown',e=>{
        if(LIC.conferido)return;
        if(o.classList.contains('na-cesta')){tira(o);return;}
        x0=e.clientX;y0=e.clientY;dx=dy=0;arrastou=false;
        try{o.setPointerCapture(e.pointerId);}catch(e2){}
        palco.querySelectorAll('.obj').forEach(x=>x.classList.remove('pego'));
        o.classList.add('pego');VER.pego=o;sfx('pega');
      });
      o.addEventListener('pointermove',e=>{
        if(VER.pego!==o||LIC.conferido)return;
        dx=e.clientX-x0;dy=e.clientY-y0;
        if(Math.abs(dx)+Math.abs(dy)>6)arrastou=true;
        if(arrastou){o.style.transform='translate('+dx+'px,'+dy+'px)';const c=cestaPerto(e.clientX,e.clientY);cestas.forEach(cc=>cc.classList.toggle('ima',cc===c));}
      });
      const solta=e=>{
        if(VER.pego!==o)return;
        cestas.forEach(cc=>cc.classList.remove('ima'));
        if(arrastou){const c=cestaPerto(e.clientX,e.clientY);if(c)poe(o,c);else{o.style.transform='';o.classList.remove('pego');VER.pego=null;sfx('solta');}}
        /* sem arrastar: fica "pego" esperando o toque na cesta (caminho sem arrastar) */
      };
      o.addEventListener('pointerup',solta);o.addEventListener('pointercancel',solta);
    });
    cestas.forEach(c=>c.addEventListener('click',()=>{if(LIC.conferido)return;if(VER.pego&&VER.pego.classList.contains('pego'))poe(VER.pego,c);}));
    atualizaArrastar(q);
    return;
  }
  if(q.verbo==='tocar-letra'){
    palco.querySelectorAll('.letra-t').forEach(b=>b.addEventListener('click',()=>{
      if(LIC.conferido)return;
      palco.querySelectorAll('.letra-t').forEach(x=>x.classList.remove('sel'));
      b.classList.add('sel');LIC.resp=b.dataset.l;$('#acao').disabled=false;sfx('seleciona');
      contagemTexto('Você escolheu a letra '+b.dataset.l);
    }));
    return;
  }
  if(q.verbo==='ordenar'){
    const fila=$('#fila-ordem');
    const pinta=()=>{fila.innerHTML=VER.ordem.length?VER.ordem.map(i=>'<span class="carta posta">'+escapa(q.cartas[i])+'</span>').join(''):'<span class="ph">toque nas cartas na ordem</span>';
      palco.querySelectorAll('.carta[data-i]').forEach(c=>{c.classList.toggle('usada',VER.ordem.indexOf(+c.dataset.i)>=0);});
      LIC.resp=VER.ordem.map(i=>q.cartas[i]).join(' ');
      if(!LIC.conferido)$('#acao').disabled=VER.ordem.length!==q.cartas.length;};
    palco.querySelectorAll('.carta[data-i]').forEach(c=>c.addEventListener('click',()=>{
      if(LIC.conferido||c.classList.contains('usada'))return;VER.ordem.push(+c.dataset.i);sfx('seleciona');pinta();}));
    const ap=$('#ordem-apaga');if(ap)ap.addEventListener('click',()=>{if(LIC.conferido||!VER.ordem.length)return;VER.ordem.pop();pinta();});
    pinta();
    return;
  }
}
function atualizaArrastar(q){
  const total=VER.cestas.reduce((a,l)=>a+l.length,0),falta=q.objetos.n-total;
  const iguais=VER.cestas.every(l=>l.length===VER.cestas[0].length);
  if(falta>0)contagemTexto(falta+' ainda fora das cestas');
  else contagemTexto(iguais?'Todas nas cestas: '+VER.cestas[0].length+' em cada uma':'Todas nas cestas, mas as cestas estão diferentes');
  if(q.modo==='cada')LIC.resp=falta===0&&iguais?String(VER.cestas[0].length):'';
  else LIC.resp=falta===0?String(total):'';
  if(!LIC.conferido)$('#acao').disabled=!LIC.resp;
}
/* no conferir: marca o que acertou e o que errou DENTRO da cena, sem vermelho */
function verbosConferir(q,ok){
  const palco=$('#palco');
  if(q.verbo==='tocar-letra'){
    palco.querySelectorAll('.letra-t').forEach(b=>{b.disabled=true;if(b.dataset.l===String(q.answer))b.classList.add('certa');else if(b.classList.contains('sel'))b.classList.add('errada');});
  }
  if(q.verbo==='tocar-objetos'){
    palco.querySelectorAll('.alt').forEach(b=>{const v=q.options[+b.dataset.v];b.disabled=true;b.classList.remove('sel');if(v===q.answer)b.classList.add('certa');else if(v===LIC.resp)b.classList.add('errada');});
    palco.querySelectorAll('.obj').forEach(o=>{o.disabled=true;});
  }
  if(q.verbo==='arrastar'){palco.querySelectorAll('.obj,.cesta').forEach(o=>{o.disabled=true;});}
  if(q.verbo==='ordenar'){palco.querySelectorAll('.carta,#ordem-apaga').forEach(o=>{o.disabled=true;});const f=$('#fila-ordem');if(f)f.classList.add(ok?'certa':'errada');}
  const alvo=palco.querySelector('.cena-obj, .palavra-toque, .fila-ordem, .alt.certa, .letra-t.certa');
  if(ok)hitStop(()=>{const c=palco.querySelector('.letra-t.certa, .alt.certa, .fila-ordem.certa, .cena-obj');if(c)squash(c);});
  else{const e=palco.querySelector('.letra-t.errada, .alt.errada, .fila-ordem.errada, .cena-obj');if(e)balanca(e);}
}
/* ---------- juice: pressionado no mesmo quadro, hit-stop de 70 ms, squash e balanço ---------- */
const JUICE={reduz:()=>{try{return matchMedia('(prefers-reduced-motion: reduce)').matches;}catch(e){return false;}},parado:false,ultimoHitStop:0};
function hitStop(depois){
  const ms=JUICE.reduz()?0:70;
  JUICE.ultimoHitStop=ms;
  if(ms){document.documentElement.classList.add('hitstop');JUICE.parado=true;}
  setTimeout(()=>{document.documentElement.classList.remove('hitstop');JUICE.parado=false;if(depois)depois();},ms);
}
function squash(el){if(!el||JUICE.reduz())return;el.classList.remove('squash');void el.offsetWidth;el.classList.add('squash');}
function balanca(el){if(!el||JUICE.reduz())return;el.classList.remove('balanca');void el.offsetWidth;el.classList.add('balanca');}
if(typeof document!=='undefined'&&document.addEventListener){
  const ALVO='button,.alt,.obj,.letra-t,.carta,.cesta,.tecla,.chip,.parte,.tinta';
  document.addEventListener('pointerdown',e=>{
    const b=e.target&&e.target.closest?e.target.closest(ALVO):null;
    if(!b||b.disabled)return;
    b.classList.add('pressionado');     /* no mesmo evento: antes do próximo quadro */
    const solta=()=>{b.classList.remove('pressionado');};
    b.addEventListener('pointerup',solta,{once:true});b.addEventListener('pointercancel',solta,{once:true});b.addEventListener('pointerleave',solta,{once:true});
  },{passive:true});
}
