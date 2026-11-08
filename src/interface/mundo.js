/* ---------- o mundo reage (sessão 1C; mesa 03 mudanças 4, 5, 9 e 14 parcial) ----------
   Nós como objetos do diorama (as 10 etapas dos 3 planetas: recorte retangular da arte que já existe, sem imagem nova), com três estados
   lidos direto na arte: trancado = a lona do cenário "apagado", disponível = brilho suave, feito = a peça do cenário "completo" aparece.
   O Bobby (ou o companheiro) ANDA do nó atual ao próximo e a câmera vai junto; tocar num nó à frente faz ele andar até lá antes de abrir.
   O fim de fase acontece no mapa: a câmera vai ao objeto, a lona sai em 480 ms, Bobby e guia comemoram ao lado, estrelas sobre o objeto,
   uma linha de texto e um botão. Etapas sem recorte por peça mantêm a revelação de baixo para cima, com o nó como objeto genérico com brilho. */
/* retângulos [x0,y0,x1,y1] em fração da IMAGEM (765 x 1024); o 6º é a revisão (a casa, a janela, a casa grande).
   Etapas 2 a 10 (08/11/2026): recortadas a olho da arte que já existe, na ordem das peças de docs/CENARIOS-E-DESENHOS.md (seção das cenas),
   sem imagem nova. Quando a peça de uma fase não aparece sozinha na arte, a fase usa o objeto mais próximo do tema. */
const HOTSPOTS={
  mat:{1:[[.085,.55,.62,.76],[.725,.23,.915,.4],[.48,.27,.78,.43],[.63,.43,.915,.63],[.085,.36,.37,.56],[.12,.04,.62,.32]],2:[[.14,.56,.58,.7],[.48,.36,.915,.55],[.12,.42,.4,.52],[.42,.17,.66,.33],[.68,.1,.915,.3],[.13,.31,.32,.42]],3:[[.18,.59,.45,.73],[.56,.53,.915,.66],[.24,.4,.86,.53],[.22,.19,.47,.38],[.48,.16,.915,.38],[.085,.5,.36,.6]],4:[[.085,.56,.65,.71],[.1,.37,.46,.53],[.47,.4,.62,.52],[.62,.3,.915,.58],[.38,.18,.52,.28],[.68,.2,.84,.31]],5:[[.085,.43,.4,.68],[.13,.32,.4,.42],[.42,.38,.75,.52],[.63,.53,.915,.68],[.41,.19,.59,.37],[.64,.08,.915,.38]],6:[[.085,.49,.48,.7],[.52,.52,.75,.68],[.4,.32,.68,.5],[.7,.42,.915,.58],[.62,.08,.915,.38],[.085,.33,.38,.48]],7:[[.085,.33,.275,.6],[.26,.5,.5,.7],[.5,.36,.7,.56],[.71,.4,.915,.53],[.5,0,.915,.33],[.085,.1,.3,.32]],8:[[.63,.47,.915,.7],[.085,.42,.275,.55],[.26,.43,.62,.62],[.45,.23,.8,.43],[.14,.27,.45,.42],[.085,.56,.38,.72]],9:[[.38,.62,.6,.73],[.6,.55,.87,.7],[.42,.42,.62,.56],[.12,.38,.4,.58],[.67,.4,.915,.56],[.42,.04,.66,.42]],10:[[.45,.53,.915,.7],[.45,.36,.65,.52],[.72,.32,.915,.56],[.085,.43,.44,.62],[.38,0,.6,.33],[.085,.18,.3,.38]]},
  pt:{1:[[.085,.28,.35,.56],[.085,.52,.55,.7],[.44,.38,.9,.56],[.6,.5,.915,.66],[.55,.17,.9,.36],[.4,.12,.65,.33]],2:[[.56,.5,.915,.7],[.32,.38,.58,.62],[.58,.38,.8,.5],[.65,.22,.86,.34],[.22,0,.45,.17],[.13,.18,.58,.38]],3:[[.085,.45,.36,.7],[.58,.42,.915,.7],[.4,.26,.72,.42],[.085,.15,.33,.32],[.68,.06,.915,.3],[.18,0,.48,.14]],4:[[.085,.52,.58,.7],[.62,.42,.915,.62],[.085,.34,.42,.5],[.62,.28,.915,.4],[.4,.18,.62,.36],[.09,.14,.28,.3]],5:[[.44,.53,.56,.67],[.14,.4,.44,.62],[.58,.4,.915,.58],[.3,.13,.56,.38],[.66,0,.915,.39],[.62,.6,.915,.72]],6:[[.085,.45,.4,.66],[.2,.32,.46,.44],[.48,.4,.7,.6],[.72,.38,.915,.62],[.64,.1,.915,.3],[.085,0,.3,.2]],7:[[.35,.52,.915,.68],[.085,.37,.38,.55],[.725,.2,.915,.5],[.33,.36,.79,.5],[.32,.08,.8,.32],[.085,.56,.34,.68]],8:[[.085,.26,.36,.58],[.36,.37,.58,.52],[.66,.48,.915,.68],[.62,.35,.9,.47],[.46,.2,.9,.34],[.52,.06,.8,.19]],9:[[.085,.46,.48,.66],[.085,.18,.4,.45],[.58,.35,.83,.52],[.725,.53,.915,.7],[.43,0,.915,.32],[.4,.32,.58,.44]],10:[[.085,.52,.52,.7],[.38,.12,.58,.32],[.6,.46,.84,.62],[.26,.38,.54,.5],[.7,0,.9,.3],[.58,.3,.915,.46]]},
  en:{1:[[.085,.47,.45,.65],[.18,.17,.42,.52],[.52,.38,.8,.62],[.725,.46,.915,.64],[.46,.07,.62,.2],[.52,.03,.915,.42]],2:[[.085,.5,.5,.68],[.52,.45,.82,.62],[.22,.36,.5,.5],[.68,.355,.86,.465],[.52,0,.915,.36],[.085,.18,.34,.36]],3:[[.52,.38,.915,.66],[.14,.46,.38,.62],[.725,.28,.915,.38],[.3,.33,.48,.44],[.2,.2,.42,.34],[.52,.02,.915,.28]],4:[[.085,.5,.36,.64],[.56,.4,.915,.66],[.36,.3,.62,.46],[.54,.18,.915,.32],[.085,.16,.3,.3],[.48,.03,.74,.18]],5:[[.1,.52,.38,.66],[.6,.48,.915,.66],[.43,.47,.58,.58],[.56,.37,.72,.47],[.2,.22,.55,.38],[.55,0,.915,.32]],6:[[.22,.43,.4,.64],[.725,.48,.915,.66],[.36,.4,.6,.58],[.6,.33,.86,.48],[.64,.06,.84,.31],[.085,.25,.38,.4]],7:[[.14,.4,.34,.58],[.45,.2,.7,.48],[.42,.5,.68,.64],[.7,.42,.915,.6],[.725,.05,.915,.22],[.38,.04,.78,.19]],8:[[.085,.55,.4,.7],[.14,.38,.48,.53],[.52,.4,.915,.64],[.58,.2,.86,.34],[.72,.08,.915,.2],[.24,.08,.52,.24]],9:[[.1,.48,.48,.68],[.18,.12,.4,.47],[.56,.44,.915,.66],[.4,.22,.78,.38],[.74,.14,.9,.27],[.72,0,.915,.13]],10:[[.085,.3,.42,.46],[.725,.4,.915,.62],[.5,.38,.72,.62],[.085,.47,.4,.68],[.6,.02,.86,.32],[.085,.12,.3,.28]]}
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
/* faixa onde o mapa aparece de verdade: entre o topo fixo e a barra de baixo (8 px de folga em cada ponta) */
function faixaVisivel(){
  const topo=document.querySelector('.topo'),barra=document.querySelector('.barra-baixo');
  const cima=(topo?Math.max(0,topo.getBoundingClientRect().bottom):0)+8;
  const bb=barra&&barra.getBoundingClientRect();
  return {cima:cima,baixo:(bb&&bb.height?bb.top:innerHeight)-8};
}
/* o objeto de destino (com o rótulo) e o lugar onde o personagem fica ao lado dele: a câmera leva esse grupo para a faixa visível.
   Cabe: centraliza; não cabe: o topo do grupo encosta no topo da faixa. */
const PE_DO_PERSONAGEM=40;   /* o personagem passa um pouco da base do objeto (translate -76%) */
function grupoDoNo(no){
  if(!no)return [];
  const rot=no.querySelector('.rot');
  return [no,rot&&getComputedStyle(rot).display!=='none'?rot:null].filter(Boolean);
}
function alvoDoGrupo(els){
  const rs=els.filter(Boolean).map(e=>e.getBoundingClientRect()).filter(r=>r.height>0);
  const max=Math.max(0,document.documentElement.scrollHeight-innerHeight);
  if(!rs.length)return window.scrollY;
  const t=Math.min(...rs.map(r=>r.top)),b=Math.max(...rs.map(r=>r.bottom))+PE_DO_PERSONAGEM,f=faixaVisivel();
  const desloca=(b-t)<=(f.baixo-f.cima)?(t+b)/2-(f.cima+f.baixo)/2:t-f.cima;
  return Math.max(0,Math.min(max,window.scrollY+desloca));
}
function cameraPara(el,frac,ms,fim){
  if(!el){if(fim)fim();return;}
  const reduz=(typeof matchMedia==='function'&&matchMedia('(prefers-reduced-motion: reduce)').matches)||typeof requestAnimationFrame!=='function'||typeof cancelAnimationFrame!=='function';
  const alvoDe=Array.isArray(el)?()=>alvoDoGrupo(el):()=>{const r=el.getBoundingClientRect();return Math.max(0,Math.min(document.documentElement.scrollHeight-innerHeight,window.scrollY+r.top+r.height/2-innerHeight*(frac||.66)));};
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
const ANDA={ocupado:false,t:0,v:null};
/* para a caminhada em curso onde o personagem está agora (toque novo no meio do caminho, ou o mapa redesenhado) */
function pararCaminhada(){
  clearTimeout(ANDA.t);
  const v=ANDA.v;ANDA.ocupado=false;ANDA.v=null;
  if(!v||!v.isConnected||typeof getComputedStyle!=='function')return;
  const pai=v.offsetParent||v.parentNode,cs=getComputedStyle(v),w=pai&&pai.clientWidth,h=pai&&pai.clientHeight;
  v.style.transition='none';
  if(w&&h){v.style.left=(parseFloat(cs.left)/w*100).toFixed(2)+'%';v.style.top=(parseFloat(cs.top)/h*100).toFixed(2)+'%';}
  void v.offsetWidth;v.style.transition='';v.classList.remove('anda');
}
function andarAte(ui,no,depois){
  const sec=$('#etapa-'+(ui+1)),v=sec&&sec.querySelector('.voce');
  if(!v){if(depois)depois();return;}
  /* já andando: o toque mais novo vale. Ele muda de rumo de onde está (a caminhada anterior não abre nada) e a fase tocada só abre quando ele chega */
  if(ANDA.ocupado)pararCaminhada();
  const alvo=posNo(UNITS[ui],no),de=+v.dataset.no;
  if(de===no&&!v.classList.contains('anda')&&Math.abs((parseFloat(v.style.left)||0)-alvo[0])<.5&&Math.abs((parseFloat(v.style.top)||0)-alvo[1])<.5){if(depois)depois();return;}
  const reduz=(typeof matchMedia==='function'&&matchMedia('(prefers-reduced-motion: reduce)').matches)||typeof requestAnimationFrame!=='function';
  ANDA.ocupado=true;ANDA.v=v;v.dataset.no=no;NO_ANTES[MATERIA+UNITS[ui].n]=no;
  v.classList.toggle('d',alvo[0]<=16);v.classList.toggle('e',alvo[0]>16);
  const chega=()=>{v.classList.remove('anda');v.classList.add('chega');ANDA.ocupado=false;ANDA.v=null;setTimeout(()=>v.classList.remove('chega'),400);if(depois)depois();};
  if(reduz){v.classList.add('pula');v.style.left=alvo[0]+'%';v.style.top=alvo[1]+'%';ANDA.t=setTimeout(()=>{v.classList.remove('pula');chega();},320);return;}
  const dist=Math.hypot(alvo[0]-(parseFloat(v.style.left)||0),alvo[1]-(parseFloat(v.style.top)||0));
  const ms=Math.max(600,Math.min(900,600+dist*4));
  v.style.setProperty('--anda-ms',ms+'ms');
  const passo1=()=>{
    if(ANDA.v!==v)return;      /* outra caminhada tomou o lugar desta antes de ela começar */
    v.classList.add('anda');v.style.left=alvo[0]+'%';v.style.top=alvo[1]+'%';
    if(typeof sfx==='function')sfx('passo',{mat:'madeira',pt:'grama',en:'areia'}[MATERIA]||'grama');
    const noEl=sec.querySelector('.no[data-li="'+no+'"]');
    cameraPara(noEl?grupoDoNo(noEl):v,.66,ms);
    ANDA.t=setTimeout(chega,ms+40);
  };
  requestAnimationFrame(()=>requestAnimationFrame(passo1));
}
/* ---------- respiração: a cada 6 a 10 s o personagem troca de pose com fusão de 300 ms ---------- */
const IDLE={t:0,n:0};
function idleMapa(){
  clearTimeout(IDLE.t);
  /* nos testes em Node o temporizador não segura o processo (unref) */
  const prox=()=>{IDLE.t=setTimeout(()=>{const v=document.querySelector('.voce');if(v&&!v.classList.contains('anda')){v.classList.toggle('pose2');}prox();},6000+(IDLE.n++%5)*1000);   /* 6 a 10 s, sem sorteio (o teste do baú proíbe Math.random fora do lugar) */if(IDLE.t&&IDLE.t.unref)IDLE.t.unref();};
  prox();
}
/* ---------- pontos vivos (sessão 1C; mesa 03 §9 item 3): 3 por cenário, fora dos objetos das fases ----------
   Posição em fração da imagem, escolhida onde a arte tem detalhe (cristal, lanterna, árvore, telhado) e longe dos recortes das fases
   (scratchpad da sessão: densidade de bordas da própria arte). Tocar faz o ponto brilhar e balançar no mesmo quadro, com um sino baixo;
   a fala do ponto aparece UMA vez por dia (S.diario.vivos, que zera com o dia). Nada pisca e nada anda sozinho. */
const VIVOS={
  mat:{1:[[.582,.502],[.667,.224],[.444,.361]],2:[[.353,.21],[.542,.093],[.784,.049]],3:[[.19,.39],[.484,.58],[.163,.2]],4:[[.307,.283],[.634,.268],[.51,.122]],5:[[.562,.059],[.837,.42],[.379,.288]],6:[[.431,.166],[.176,.244],[.582,.278]],7:[[.817,.366],[.327,.439],[.438,.234]],8:[[.242,.176],[.837,.298],[.641,.2]],9:[[.366,.137],[.706,.249],[.32,.337]],10:[[.641,.307],[.83,.254],[.346,.346]]},
  pt:{1:[[.81,.088],[.399,.39],[.216,.083]],2:[[.529,.659],[.203,.659],[.837,.454]],3:[[.196,.395],[.392,.61],[.824,.371]],4:[[.758,.185],[.81,.659],[.588,.429]],5:[[.268,.239],[.51,.42],[.327,.659]],6:[[.608,.161],[.176,.234],[.49,.366]],7:[[.163,.307],[.307,.044],[.837,.054]],8:[[.255,.205],[.614,.634],[.333,.649]],9:[[.627,.551],[.399,.146],[.176,.073]],10:[[.163,.478],[.556,.571],[.641,.234]]},
  en:{1:[[.484,.42],[.529,.659],[.477,.263]],2:[[.542,.4],[.183,.463],[.732,.654]],3:[[.608,.312],[.484,.512],[.268,.415]],4:[[.288,.454],[.399,.263],[.81,.366]],5:[[.268,.415],[.752,.39],[.471,.439]],6:[[.608,.278],[.673,.522],[.183,.517]],7:[[.19,.346],[.386,.224],[.817,.268]],8:[[.235,.346],[.549,.356],[.686,.122]],9:[[.837,.302],[.458,.415],[.516,.61]],10:[[.484,.4],[.824,.351],[.431,.62]]}
};
function vivosHTML(u){
  const v=VIVOS[MATERIA]&&VIVOS[MATERIA][u.n];if(!v)return '';
  return v.map((p,k)=>'<button type="button" class="vivo" data-vivo="'+MATERIA+u.n+'-'+k+'" style="left:'+((p[0]-HS_CORTE)/HS_VIS*100).toFixed(2)+'%;top:'+(p[1]*100).toFixed(2)+'%" aria-label="Tocar no cenário"><span class="vivo-brilho" aria-hidden="true"></span></button>').join('');
}
function falaDoVivo(chave){
  const m=String(chave).match(/^(mat|pt|en)(\d+)-(\d)$/),lista=m&&typeof FALAS!=='undefined'&&FALAS.vivo&&FALAS.vivo[m[1]];
  return lista&&lista.length?lista[(+m[2]*3+ +m[3])%lista.length]:'';
}
/* devolve a fala quando é a primeira vez hoje; '' quando já falou (o ponto ainda reage) */
function vivoTocado(chave){
  const d=S.diario;if(!Array.isArray(d.vivos))d.vivos=[];
  if(d.vivos.indexOf(chave)>=0)return '';
  d.vivos.push(chave);if(d.vivos.length>90)d.vivos=d.vivos.slice(-90);salvar();
  return falaDoVivo(chave);
}
function tocarVivo(b){
  b.classList.remove('reage');void b.offsetWidth;b.classList.add('reage');
  if(typeof sfx==='function')sfx('dica');
  const fala=vivoTocado(b.dataset.vivo);
  if(fala&&typeof avisoNo==='function')avisoNo(fala);
}
/* ---------- hora do dia e clima (por sobreposição de CSS, 0 KB) ----------
   Quatro faixas pela hora LOCAL do aparelho: manhã (6 a 11h), tarde (12 a 16h), entardecer (17 a 18h) e noite (19 a 5h). A cor cai só sobre a
   arte da cena (o texto fica fora da camada, com o contraste de sempre). Clima por planeta, só na etapa atual e no máximo 6 partículas:
   folhas na Matemática, vaga-lumes na Português (luz constante, sem piscar), pétalas no Inglês. Movimento reduzido: sem partícula. */
function horaDoDia(h){h=h==null?new Date().getHours():h;return h>=6&&h<12?'manha':(h>=12&&h<17?'tarde':(h>=17&&h<19?'entardecer':'noite'));}
const CLIMA={mat:'folhas',pt:'vagalumes',en:'petalas'};
function climaHTML(agora){
  let h='<div class="hora" aria-hidden="true"></div>';
  if(agora&&CLIMA[MATERIA]){h+='<div class="clima '+CLIMA[MATERIA]+'" aria-hidden="true">';for(let i=0;i<6;i++)h+='<i style="--i:'+i+'"></i>';h+='</div>';}
  return h;
}
/* ---------- o desenho pintado fica pendurado na casa da etapa (miniatura de 48 px no objeto da revisão) ----------
   Só aparece depois de a criança pintar (S.desenhos.tinta do desenho da etapa). A miniatura é refeita pela mesma tinta do colorir
   (tintaMapa), uma vez por desenho alterado, e guardada só na memória desta sessão. */
const MINI={};
function desenhoPintadoDaEtapa(u){
  if(typeof desenhoIdDe!=='function'||typeof desenhoPorId!=='function')return null;
  const id=desenhoIdDe(MATERIA,u.n),d=desenhoPorId(id),j=S.desenhos&&S.desenhos.tinta&&S.desenhos.tinta[id];
  return d&&ativo(id)&&Array.isArray(j)&&j.length&&desenhoGanho(d)?d:null;
}
function penduradoHTML(u){
  const hs=hotspotsDe(MATERIA,u.n),d=hs&&desenhoPintadoDaEtapa(u);if(!d)return '';
  const r=hs[5];
  return '<span class="pendurado" data-des="'+d.id+'" style="left:'+((r[0]+r[2])/2).toFixed(2)+'%;top:'+(r[1]+(r[3]-r[1])*.18).toFixed(2)+'%" aria-hidden="true"><canvas width="96" height="128"></canvas></span>';
}
function miniDesenho(id){
  const j=(S.desenhos.tinta[id]||[]),chave=j.length+':'+JSON.stringify(j[j.length-1]||[]);
  if(MINI[id]&&MINI[id].chave===chave)return MINI[id].p;
  const p=new Promise(ok=>{
    const a=ativo(id);if(!a){ok(null);return;}
    const img=new Image();
    img.onload=()=>{try{
      const w=img.naturalWidth,h=img.naturalHeight,cv=document.createElement('canvas');cv.width=w;cv.height=h;
      const cx=cv.getContext('2d',{willReadFrequently:true});cx.drawImage(img,0,0);
      const base=cx.getImageData(0,0,w,h),lum=new Uint8Array(w*h);for(let i=0;i<w*h;i++)lum[i]=base.data[i*4];
      const mapa=tintaMapa(lum,w,h,j),cores=paletaDeTinta().map(rgbDe),out=cx.createImageData(w,h);
      for(let i=0;i<w*h;i++){const m=mapa[i],o=i*4;if(m){const c=cores[m-1],k=lum[i]/255;out.data[o]=c[0]*k;out.data[o+1]=c[1]*k;out.data[o+2]=c[2]*k;}else{out.data[o]=base.data[o];out.data[o+1]=base.data[o+1];out.data[o+2]=base.data[o+2];}out.data[o+3]=255;}
      cx.putImageData(out,0,0);
      const mini=document.createElement('canvas');mini.width=96;mini.height=128;mini.getContext('2d').drawImage(cv,0,0,96,128);
      ok(mini);
    }catch(e){ok(null);}};
    img.onerror=()=>ok(null);
    img.src=ARTE_BASE+a[0];
  });
  MINI[id]={chave:chave,p:p};
  return p;
}
function pintarPendurados(){
  if(typeof document==='undefined')return;
  document.querySelectorAll('.pendurado[data-des]').forEach(el=>{
    miniDesenho(el.dataset.des).then(mini=>{const cv=el.querySelector('canvas');if(!mini||!cv)return;cv.getContext('2d').drawImage(mini,0,0);el.classList.add('pronto');});
  });
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
