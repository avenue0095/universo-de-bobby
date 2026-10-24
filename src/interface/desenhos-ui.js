/* ---------- desenhos: galeria (um por etapa concluída), abrir, colorir na tela, imprimir e salvar ----------
   O direito ao desenho vem da etapa: as 5 fases feitas (ou fase feita antes do modelo novo: S.desenhos.herdado).
   Cores: só tokens (--tinta-*, lidos do CSS). Texto: português do Brasil, sem culpa e sem pressão. */
const NOMES_TINTA=['Vermelho','Laranja','Amarelo','Verde-limão','Verde','Turquesa','Azul-claro','Azul','Roxo','Rosa','Marrom','Cinza','Branco (apagar)'];
let DES={id:null,lum:null,w:0,h:0,jogadas:[],cor:2,mapa:null,base:null};

function unidadesDe(matApp){return matApp==='pt'?UNITS_PT:(matApp==='en'?UNITS_EN:UNITS_MAT);}
function desenhoGanho(d){
  if(S.desenhos.herdado.indexOf(d.id)>=0)return true;
  const u=unidadesDe(d.matApp)[d.n-1];
  return !!u&&u.lessons.every(l=>S.feitas[l.id]);
}
const desenhosGanhos=()=>desenhosCatalogo().filter(desenhoGanho);
function desenhoPorId(id){return desenhosCatalogo().filter(d=>d.id===id)[0]||null;}
const desenhosNovos=()=>desenhosGanhos().filter(d=>S.desenhos.vistos.indexOf(d.id)<0&&ativo(d.id));
function pintarPontoGaleria(){
  const p=$('#ponto-gal');if(p)p.hidden=desenhosNovos().length===0;
}
/* quanto falta para o desenho da etapa atual de uma matéria (texto do fim de fase) */
function faltaParaDesenho(u){
  const falta=u.lessons.filter(l=>!S.feitas[l.id]).length;
  return falta;
}

/* ---------- galeria ---------- */
function desenhoCartao(d,destaque){
  const ganho=desenhoGanho(d),tem=!!ativo(d.id),novo=ganho&&tem&&S.desenhos.vistos.indexOf(d.id)<0;
  const pl=PLANETAS[d.matApp];
  let cena='';
  if(!tem){
    cena='<span class="des-silhueta">'+imgArte(pl.img,{})+'</span>';
  }else{
    cena=imgArte(d.id,{alt:ganho?'Desenho para colorir: '+d.nome:''});
  }
  const rotulo=ganho?(tem?(novo?'Novo!':'Colorir'):'Em breve'):'Termine a etapa '+d.n;
  return '<button class="des-card'+(ganho?'':' trava')+(novo?' novo':'')+(destaque===d.id?' destaque':'')+'" data-des="'+d.id+'" data-materia="'+COD_DESENHO[d.matApp]+'"'+
    ' aria-label="'+escapa(d.nome)+'. '+(ganho?(tem?'Abrir para colorir':'Em breve'):'Termine a etapa '+d.n+' para ganhar')+'">'+
    '<span class="des-folha">'+cena+(ganho?'':'<span class="des-cadeado">'+IC.cadeado+'</span>')+'</span>'+
    '<span class="des-nome">'+escapa(d.nome)+'</span>'+
    '<span class="des-rot'+(novo?' novo':'')+'">Etapa '+d.n+' · '+rotulo+'</span></button>';
}
function abrirGaleria(destaque){
  const cat=desenhosCatalogo(),ganhos=cat.filter(desenhoGanho);
  const alvo=typeof destaque==='string'?destaque:null;
  let h='<p class="galeria-intro">Cada etapa concluída dá um desenho para colorir na tela ou imprimir em folha A4. '+
    'Você tem <b>'+ganhos.length+' de '+cat.length+'</b>.</p>'+
    '<div class="gal-acoes"><button class="btn-sec" id="imprimir-todos"'+(ganhos.filter(d=>ativo(d.id)).length?'':' disabled')+'>'+IC.impressora+' Imprimir meus desenhos</button></div>'+
    '<div id="aviso-baixa"></div>';
  ['mat','pt','en'].forEach(m=>{
    const pl=PLANETAS[m],lista=cat.filter(d=>d.matApp===m);
    h+='<section class="des-planeta" data-materia="'+COD_DESENHO[m]+'"><h2><span class="des-pl-img">'+imgArte(pl.img,{})+'</span>Planeta '+pl.n+
       ' <small>'+lista.filter(desenhoGanho).length+' de '+lista.length+'</small></h2><div class="galeria">'+
       lista.map(d=>desenhoCartao(d,alvo)).join('')+'</div></section>';
  });
  $('#gal-corpo').innerHTML='<div class="lc-in">'+h+'</div>';
  $('#galeria').classList.add('on');
  document.body.style.overflow='hidden';
  $('#gal-corpo').querySelectorAll('[data-des]').forEach(b=>b.addEventListener('click',()=>{
    const d=desenhoPorId(b.dataset.des);
    if(!desenhoGanho(d)){
      avisoBaixa('Este desenho é da etapa '+d.n+' do Planeta '+PLANETAS[d.matApp].n+'. Termine as 5 fases dela e ele é seu.');
      return;
    }
    abrirDesenho(d.id);
  }));
  const it=$('#imprimir-todos');
  if(it)it.addEventListener('click',()=>imprimirDesenhos(ganhos.filter(d=>ativo(d.id))));
  /* os vistos só entram quando o jogador abre o desenho; o ponto da barra some quando não há novidade */
  pintarBarra();
  const foco=alvo&&$('#gal-corpo').querySelector('[data-des="'+alvo+'"]');
  if(foco&&foco.scrollIntoView)foco.scrollIntoView({block:'center'});
}
function fecharGaleria(){
  $('#galeria').classList.remove('on');
  if(!$('#licao').classList.contains('on'))document.body.style.overflow='';
  pintarBarra();
}
function avisoBaixa(t){const a=$('#aviso-baixa');if(a)a.innerHTML=t?'<div class="aviso">'+t+'</div>':'';}

/* ---------- abrir e colorir ---------- */
function paletaDeTinta(){
  const css=typeof getComputedStyle==='function'?getComputedStyle(document.body):null;
  return Array.from({length:13},(_,i)=>(css&&css.getPropertyValue('--tinta-'+(i+1)).trim())||'rgb(128,128,128)');
}
function rgbDe(txt){
  /* aceita #rrggbb ou rgb(r,g,b), que é o que o navegador devolve */
  const m=String(txt).match(/rgb\((\d+)\D+(\d+)\D+(\d+)/);
  if(m)return [+m[1],+m[2],+m[3]];
  const x=String(txt).replace('#','');
  return [parseInt(x.slice(0,2),16)||0,parseInt(x.slice(2,4),16)||0,parseInt(x.slice(4,6),16)||0];
}
function abrirDesenho(id){
  const d=desenhoPorId(id),a=ativo(id);
  if(!d)return;
  if(S.desenhos.vistos.indexOf(id)<0){S.desenhos.vistos.push(id);salvar();pintarPontoGaleria();}
  const tela=$('#desenho-tela');
  const pl=PLANETAS[d.matApp];
  tela.setAttribute('data-materia',COD_DESENHO[d.matApp]);
  let corpo;
  if(!a){
    corpo='<div class="des-breve"><span class="des-silhueta grande">'+imgArte(pl.img,{})+'</span>'+
      '<h3>Em breve</h3><p>O desenho “'+escapa(d.nome)+'” chega numa atualização. Ele já é seu: o planeta guarda o lugar enquanto isso.</p></div>';
  }else{
    corpo='<div class="des-tela"><canvas id="cv-des" role="img" aria-label="Desenho para colorir: '+escapa(d.nome)+'. Toque numa área para pintar."></canvas></div>'+
      '<div class="des-ferramentas"><div class="paleta" role="radiogroup" aria-label="Cores"></div>'+
      '<div class="des-acoes"><button class="btn-sec" id="des-desfazer">'+IC.volta+' Desfazer</button>'+
      '<button class="btn-sec" id="des-limpar">Recomeçar</button>'+
      '<button class="btn-sec" id="des-imprimir">'+IC.impressora+' Imprimir</button>'+
      '<button class="btn-sec" id="des-salvar">'+IC.baixar+' Salvar</button></div></div><div id="aviso-baixa"></div>';
  }
  tela.innerHTML='<div class="rev-topo"><button class="icobtn" id="fechar-des" aria-label="Voltar aos desenhos">'+IC.volta+'</button>'+
    '<h2>'+escapa(d.nome)+'</h2></div><div class="rev-corpo"><div class="lc-in des-in">'+corpo+'</div></div>';
  tela.classList.add('on');
  $('#fechar-des').addEventListener('click',fecharDesenho);
  if(!a)return;
  carregarDesenho(d,a);
}
function fecharDesenho(){
  $('#desenho-tela').classList.remove('on');
  /* a galeria por baixo mostra o estado novo (visto, sem o ponto) */
  if($('#galeria').classList.contains('on'))abrirGaleria(DES.id);
}
function carregarDesenho(d,a){
  const img=new Image();
  img.onload=()=>{
    const cv=$('#cv-des');if(!cv)return;
    const w=img.naturalWidth,h=img.naturalHeight;
    cv.width=w;cv.height=h;
    const cx=cv.getContext('2d',{willReadFrequently:true});
    cx.drawImage(img,0,0);
    const base=cx.getImageData(0,0,w,h),lum=new Uint8Array(w*h);
    for(let i=0;i<w*h;i++)lum[i]=base.data[i*4];
    DES={id:d.id,lum:lum,w:w,h:h,jogadas:(S.desenhos.tinta[d.id]||[]).map(j=>j.slice()),cor:2,mapa:null,base:base,paleta:paletaDeTinta()};
    desenharTinta();
    pintarPaleta();
    cv.addEventListener('pointerdown',ev=>{
      ev.preventDefault();
      const r=cv.getBoundingClientRect();
      const x=(ev.clientX-r.left)*w/r.width,y=(ev.clientY-r.top)*h/r.height;
      pintarEm(x,y);
    });
  };
  img.onerror=()=>{avisoBaixa('Esta imagem ainda não chegou. O jogo continua normal.');};
  img.src=ARTE_BASE+a[0];
}
function desenharTinta(){
  const cv=$('#cv-des');if(!cv||!DES.base)return;
  const cx=cv.getContext('2d'),w=DES.w,h=DES.h;
  DES.mapa=tintaMapa(DES.lum,w,h,DES.jogadas);
  const out=cx.createImageData(w,h),b=DES.base.data,cores=DES.paleta.map(rgbDe);
  for(let i=0;i<w*h;i++){
    const m=DES.mapa[i],o=i*4;
    if(m){const c=cores[m-1],k=DES.lum[i]/255;out.data[o]=c[0]*k;out.data[o+1]=c[1]*k;out.data[o+2]=c[2]*k;}
    else{out.data[o]=b[o];out.data[o+1]=b[o+1];out.data[o+2]=b[o+2];}
    out.data[o+3]=255;
  }
  cx.putImageData(out,0,0);
}
function pintarEm(x,y){
  if(!DES.lum)return;
  const reg=tintaRegiao(DES.lum,DES.w,DES.h,x,y);
  if(!reg.length)return;                                  /* tocou na linha: nada acontece */
  DES.jogadas.push([Math.round(x),Math.round(y),DES.cor]);
  if(DES.jogadas.length>600)DES.jogadas.shift();
  guardarTinta();desenharTinta();somPasso&&somPasso();
}
function guardarTinta(){S.desenhos.tinta[DES.id]=DES.jogadas.map(j=>j.slice());salvar();}
function pintarPaleta(){
  const el=document.querySelector('.paleta');if(!el)return;
  el.innerHTML=DES.paleta.map((c,i)=>'<button class="tinta'+(i===DES.cor?' on':'')+(i===12?' borracha':'')+'" role="radio" aria-checked="'+(i===DES.cor)+
    '" aria-label="'+NOMES_TINTA[i]+'" data-c="'+i+'" style="--cor-da-tinta:'+c+'"><span>'+(i===DES.cor?IC.certo:'')+'</span></button>').join('');
  el.querySelectorAll('.tinta').forEach(b=>b.addEventListener('click',()=>{DES.cor=+b.dataset.c;pintarPaleta();}));
  const q=id=>document.getElementById(id);
  q('des-desfazer').onclick=()=>{DES.jogadas.pop();guardarTinta();desenharTinta();};
  q('des-limpar').onclick=()=>{DES.jogadas=[];guardarTinta();desenharTinta();};
  q('des-imprimir').onclick=()=>imprimirDesenhos([desenhoPorId(DES.id)]);
  q('des-salvar').onclick=()=>{
    const cv=$('#cv-des');
    cv.toBlob(b=>{if(b)entregar('desenho-'+DES.id+'.png',b);},'image/png');
  };
}

/* ---------- imprimir: uma folha A4 por desenho, em contorno, para pintar com lápis ---------- */
async function imprimirDesenhos(lista){
  const alvo=$('#impressao');if(!alvo||!lista.length)return;
  alvo.innerHTML=lista.map(d=>{
    const a=ativo(d.id);
    return a?'<section class="folha-a4"><h2>'+escapa(d.nome)+'</h2><img src="'+ARTE_BASE+a[0]+'" alt="">'+
      '<p>O Universo de Bobby · Planeta '+PLANETAS[d.matApp].n+' · Etapa '+d.n+'</p></section>':'';
  }).join('');
  const imgs=Array.from(alvo.querySelectorAll('img'));
  try{await Promise.all(imgs.map(i=>i.decode?i.decode():Promise.resolve()));}catch(e){}
  const limpa=()=>{alvo.innerHTML='';window.removeEventListener('afterprint',limpa);};
  window.addEventListener('afterprint',limpa);
  window.print();
}
