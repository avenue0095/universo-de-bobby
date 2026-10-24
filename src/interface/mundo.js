/* ---------- o mundo reage (sessão 1C; mesa 03 mudanças 4, 5, 9 e 14 parcial) ----------
   Nós como objetos do diorama (etapa 1 de cada planeta por enquanto: recorte retangular da arte que já existe, sem imagem nova), com três estados
   lidos direto na arte: trancado = a lona do cenário "apagado", disponível = brilho suave, feito = a peça do cenário "completo" aparece.
   O Bobby (ou o companheiro) ANDA do nó atual ao próximo e a câmera vai junto; tocar num nó à frente faz ele andar até lá antes de abrir.
   O fim de fase acontece no mapa: a câmera vai ao objeto, a lona sai em 480 ms, Bobby e guia comemoram ao lado, estrelas sobre o objeto,
   uma linha de texto e um botão. Etapas sem recorte por peça mantêm a revelação de baixo para cima, com o nó como objeto genérico com brilho. */
/* retângulos [x0,y0,x1,y1] em fração da IMAGEM (765 x 1024); o 6º é a revisão (a casa, a janela, a casa grande) */
const HOTSPOTS={
  mat:{1:[[.08,.55,.62,.76],[.80,.23,.98,.40],[.48,.27,.78,.43],[.63,.43,.96,.63],[.07,.36,.37,.56],[.12,.04,.62,.32]]},
  pt:{1:[[.07,.28,.35,.56],[.08,.52,.55,.70],[.44,.38,.90,.56],[.60,.50,.98,.66],[.55,.17,.90,.36],[.40,.12,.65,.33]]},
  en:{1:[[.04,.47,.45,.65],[.18,.17,.42,.52],[.52,.38,.80,.62],[.78,.46,.99,.64],[.46,.07,.62,.20],[.52,.03,.97,.42]]}
};
/* a cena é 5:8 e a imagem 765:1024 com object-fit cover e topo alinhado: sobra 8,17% de cada lado da imagem */
const HS_CORTE=0.0817,HS_VIS=1-2*HS_CORTE;
const hsCena=r=>[(r[0]-HS_CORTE)/HS_VIS*100,r[1]*100,(r[2]-HS_CORTE)/HS_VIS*100,r[3]*100];   /* em % da cena */
function hotspotsDe(mat,n){const h=HOTSPOTS[mat]&&HOTSPOTS[mat][n];return h&&h.length===6?h.map(hsCena):null;}
/* posição [x%,y%] do nó na cena: centro-baixo do objeto, ou a serpentina NOS */
function posNo(u,li){
  const hs=hotspotsDe(MATERIA,u.n);
  if(!hs)return NOS[li];
  const r=hs[li];return [(r[0]+r[2])/2,r[3]];
}
function pecaStyle(r){return 'clip-path:inset('+r[1].toFixed(2)+'% '+(100-r[2]).toFixed(2)+'% '+(100-r[3]).toFixed(2)+'% '+r[0].toFixed(2)+'%)';}
/* ---------- câmera: rola a janela com lerp até o elemento ficar no terço inferior ---------- */
const CAM={raf:0};
function cameraPara(el,frac,ms,fim){
  if(!el){if(fim)fim();return;}
  const reduz=(typeof matchMedia==='function'&&matchMedia('(prefers-reduced-motion: reduce)').matches)||typeof requestAnimationFrame!=='function'||typeof cancelAnimationFrame!=='function';
  const alvoDe=()=>{const r=el.getBoundingClientRect();return Math.max(0,Math.min(document.documentElement.scrollHeight-innerHeight,window.scrollY+r.top+r.height/2-innerHeight*(frac||.66)));};
  if(reduz||!ms){try{window.scrollTo(0,alvoDe());}catch(e){}if(fim)fim();return;}
  cancelAnimationFrame(CAM.raf);
  const t0=performance.now();
  const passo=now=>{
    const t=Math.min(1,(now-t0)/ms),y=window.scrollY,alvo=alvoDe();
    window.scrollTo(0,y+(alvo-y)*Math.min(1,.18+t*.5));
    if(t<1)CAM.raf=requestAnimationFrame(passo);else{window.scrollTo(0,alvoDe());if(fim)fim();}
  };
  CAM.raf=requestAnimationFrame(passo);
}
/* ---------- o personagem anda até um nó (600 a 900 ms), com passos e câmera ---------- */
const ANDA={ocupado:false};
function andarAte(ui,no,depois){
  const sec=$('#etapa-'+(ui+1)),v=sec&&sec.querySelector('.voce');
  if(!v||ANDA.ocupado){if(depois)depois();return;}
  const alvo=posNo(UNITS[ui],no),de=+v.dataset.no;
  if(de===no){if(depois)depois();return;}
  const reduz=(typeof matchMedia==='function'&&matchMedia('(prefers-reduced-motion: reduce)').matches)||typeof requestAnimationFrame!=='function';
  ANDA.ocupado=true;v.dataset.no=no;NO_ANTES[MATERIA+UNITS[ui].n]=no;
  v.classList.toggle('d',alvo[0]<=16);v.classList.toggle('e',alvo[0]>16);
  const chega=()=>{v.classList.remove('anda');v.classList.add('chega');ANDA.ocupado=false;setTimeout(()=>v.classList.remove('chega'),400);if(depois)depois();};
  if(reduz){v.classList.add('pula');v.style.left=alvo[0]+'%';v.style.top=alvo[1]+'%';setTimeout(()=>{v.classList.remove('pula');chega();},320);return;}
  const dist=Math.hypot(alvo[0]-(parseFloat(v.style.left)||0),alvo[1]-(parseFloat(v.style.top)||0));
  const ms=Math.max(600,Math.min(900,600+dist*4));
  v.style.setProperty('--anda-ms',ms+'ms');
  requestAnimationFrame(()=>requestAnimationFrame(()=>{
    v.classList.add('anda');v.style.left=alvo[0]+'%';v.style.top=alvo[1]+'%';
    if(typeof sfx==='function')sfx('passo',{mat:'madeira',pt:'grama',en:'areia'}[MATERIA]||'grama');
    cameraPara(v,.66,ms);
    setTimeout(chega,ms+40);
  }));
}
/* ---------- respiração: a cada 6 a 10 s o personagem troca de pose com fusão de 300 ms ---------- */
const IDLE={t:0,n:0};
function idleMapa(){
  clearTimeout(IDLE.t);
  /* nos testes em Node o temporizador não segura o processo (unref) */
  const prox=()=>{IDLE.t=setTimeout(()=>{const v=document.querySelector('.voce');if(v&&!v.classList.contains('anda')){v.classList.toggle('pose2');}prox();},6000+(IDLE.n++%5)*1000);   /* 6 a 10 s, sem sorteio (o teste do baú proíbe Math.random fora do lugar) */if(IDLE.t&&IDLE.t.unref)IDLE.t.unref();};
  prox();
}
/* ---------- fim de fase no mapa ---------- */
const MAPA={fim:null};
function fimNoMapa(f){
  MAPA.fim=f;
  $('#licao').classList.remove('on');document.body.style.overflow='';
  renderTrilha();
  const sec=$('#etapa-'+(f.ui+1)),no=sec&&sec.querySelector('.no[data-li="'+f.li+'"]');
  cameraPara(no||sec,.5,500,()=>{
    /* a lona sai (480 ms) e as estrelas acendem sobre o objeto */
    if(no)no.classList.add('revela');
    const peca=sec&&sec.querySelector('.peca-luz[data-li="'+f.li+'"]');if(peca)requestAnimationFrame(()=>peca.classList.add('on'));
    if(typeof sfx==='function')sfx('pecaAcende');
    for(let i=0;i<f.est;i++)setTimeout(()=>{const e=sec&&sec.querySelector('.fim-estrelas svg:nth-child('+(i+1)+')');if(e)e.classList.add('on');if(typeof sfx==='function')sfx('estrela',i);},300+i*300);
    if(f.perfeita&&no&&typeof confete==='function'){const r=no.getBoundingClientRect();confete({x:r.left+r.width/2,y:r.top+r.height/2});}
  });
}
function fimCenaHTML(f){
  const pl=PLANETAS[MATERIA];
  return '<div class="fim fim-cena" role="dialog" aria-label="Fase concluída">'+
    '<div class="fim-atores">'+MASC('comemora')+imgArte(pl.guia+'-p02',{cls:'fim-guia',alt:''})+'</div>'+
    '<div class="fim-estrelas" aria-label="'+f.est+' de 3 estrelas">'+estrelasSVG(f.est)+'</div>'+
    '<p class="fala-p">'+escapa(f.fala)+'</p>'+
    '<p class="linha-fim">'+f.acertos+' de '+f.base+' perguntas, '+f.ganho+' moedas</p>'+
    (f.extraHTML||'')+
    '<div class="fim-bts"><button class="btn-acao" id="fim-continuar">Continuar</button><button class="btn fantasma" id="rever-fim">Rever a aula</button></div></div>';
}
function ligarFimCena(f){
  const b=$('#fim-continuar');if(b)b.addEventListener('click',()=>{
    MAPA.fim=null;renderTrilha();
    if(typeof ligarBlocoFim==='function')ligarBlocoFim(f.bloco);
    if(f.completouMundo)setTimeout(()=>cerimoniasDoFim(UNITS[f.ui]),900);
    else if(typeof depoisDeFecharLicao==='function')depoisDeFecharLicao();
  });
  const r=$('#rever-fim');if(r)r.addEventListener('click',()=>{LIC.etapa='fim';$('#licao').classList.add('on');document.body.style.overflow='hidden';abrirRevisao();});
  if(typeof ligarBlocoFim==='function')ligarBlocoFim(f.bloco);
}
