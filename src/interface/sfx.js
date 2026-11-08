/* ---------- som sintetizado: efeitos, motivos dos personagens e música dos planetas (Web Audio, 0 KB de arquivo) ----------
   docs/PLANO-DE-IDENTIDADE.md, seção 6. Três interruptores independentes: Efeitos (S.som), Música (S.musica) e Voz (S.voz).
   Regras de som para criança: pico limitado (compressor mestre), entrada de 10 ms, nada de alarme, o ERRO é mais baixo e mais curto que o
   ACERTO (6 dB a menos) e não tem energia abaixo de 250 Hz, e a voz manda: com uma fala tocando, efeitos e música caem 10 dB.
   Cada receita recebe (contexto, saída, instante) e devolve a duração, assim o mesmo código toca ao vivo e renderiza em OfflineAudioContext
   para o teste medir pico, duração e energia. */
const SFXG={ctx:null,mestre:null,efeitos:null,musica:null,gesto:false,voz:false,ruido:null};
const SFX_PENT=[523.25,587.33,659.25,783.99,880,1046.5];       /* C5 D5 E5 G5 A5 C6 */
const sfxDb=db=>Math.pow(10,db/20);

function sfxGrafo(){
  const c=ctxAudio();if(!c)return null;
  if(SFXG.ctx===c)return SFXG;
  try{return sfxMontaGrafo(c);}catch(e){return null;}      /* ambiente sem Web Audio completo (teste em Node): fica sem som, sem erro */
}
function sfxMontaGrafo(c){
  const comp=c.createDynamicsCompressor();
  comp.threshold.value=-18;comp.knee.value=12;comp.ratio.value=5;comp.attack.value=.004;comp.release.value=.2;
  const mestre=c.createGain();mestre.gain.value=.9;
  const ef=c.createGain(),mu=c.createGain();ef.gain.value=1;mu.gain.value=1;
  ef.connect(comp);mu.connect(comp);comp.connect(mestre);mestre.connect(c.destination);
  SFXG.ctx=c;SFXG.mestre=mestre;SFXG.efeitos=ef;SFXG.musica=mu;SFXG.ruido=null;
  return SFXG;
}
/* a voz manda: efeitos e música caem 10 dB enquanto a fala toca e voltam em 400 ms */
function sfxVoz(fala){
  SFXG.voz=!!fala;
  const g=SFXG.ctx&&SFXG.mestre;if(!g)return;
  const t=SFXG.ctx.currentTime;
  try{g.gain.cancelScheduledValues(t);g.gain.setTargetAtTime(fala?.9*sfxDb(-10):.9,t,fala?.03:.15);}catch(e){}
  if(typeof musicaDucking==='function')musicaDucking();
}
/* ---------- instrumentos ---------- */
function sfxRuidoBuf(c){
  if(c._ruido)return c._ruido;
  const n=Math.floor(c.sampleRate*1.2),b=c.createBuffer(1,n,c.sampleRate),d=b.getChannelData(0);
  let s=12345;for(let i=0;i<n;i++){s=(s*1664525+1013904223)>>>0;d[i]=(s/4294967296)*2-1;}
  c._ruido=b;return b;
}
function sTom(c,out,t,f,dur,o){
  o=o||{};
  const os=c.createOscillator(),g=c.createGain();
  os.type=o.tipo||'sine';os.frequency.setValueAtTime(f,t);
  if(o.ate)os.frequency.exponentialRampToValueAtTime(o.ate,t+dur);
  let n=os;
  if(o.filtro){const fl=c.createBiquadFilter();fl.type=o.filtro[0];fl.frequency.value=o.filtro[1];os.connect(fl);n=fl;}
  n.connect(g);
  let saida=g;
  if(o.pan&&c.createStereoPanner){const p=c.createStereoPanner();p.pan.value=o.pan;g.connect(p);saida=p;}
  saida.connect(out);
  const v=o.vol||.2,a=o.ataque||.01;
  g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v,t+a);g.gain.exponentialRampToValueAtTime(.0001,t+Math.max(dur,a+.02));
  os.start(t);os.stop(t+dur+.05);
  if(o.h2){sTom(c,out,t,f*2,dur,{tipo:'sine',vol:v*o.h2,ataque:a,ate:o.ate?o.ate*2:0});}
}
function sRuido(c,out,t,dur,o){
  o=o||{};
  const s=c.createBufferSource();s.buffer=sfxRuidoBuf(c);s.loop=true;
  const fl=c.createBiquadFilter();fl.type=o.tipo||'bandpass';fl.Q.value=o.q||1.2;
  fl.frequency.setValueAtTime(o.de||1000,t);if(o.ate)fl.frequency.exponentialRampToValueAtTime(o.ate,t+dur);
  const g=c.createGain();s.connect(fl);fl.connect(g);g.connect(out);
  const v=o.vol||.1,a=o.ataque||.01;
  g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v,t+a);g.gain.exponentialRampToValueAtTime(.0001,t+dur);
  s.start(t);s.stop(t+dur+.05);
}
const sSino=(c,out,t,f,dur,v)=>sTom(c,out,t,f,dur,{vol:v,ataque:.008,h2:.3});
/* ---------- as receitas (nível de pico entre parênteses, da tabela da seção 6.2) ---------- */
const SFX={
  clique:(c,o,t)=>{sRuido(c,o,t,.012,{de:1200,vol:.14,q:2});sTom(c,o,t,330,.06,{vol:.16});return .06;},                     /* 1 (-14) */
  seleciona:(c,o,t)=>{sTom(c,o,t,1200,.04,{vol:.2});return .04;},                                                       /* 2 (-14) */
  verifica:(c,o,t)=>{sTom(c,o,t,520,.09,{vol:.24,ate:700});return .09;},                                                 /* 3 (-12) */
  acerto:(c,o,t,n)=>{n=Math.max(1,n||1);const i=Math.min(n-1,4);                                                        /* 4 e 5 (-6): sobe a escala a cada seguida; curto (ate 400 ms) e sem agudo acima de A5 */
    if(n<=1){sSino(c,o,t,659.25,.26,.3);sSino(c,o,t+.08,783.99,.3,.3);}
    else{sSino(c,o,t,SFX_PENT[i],.26,.28);sSino(c,o,t+.08,SFX_PENT[Math.min(i+1,4)],.3,.28);}
    return .4;},
  erro:(c,o,t)=>{sTom(c,o,t,392,.18,{tipo:'triangle',vol:.13,ate:349,filtro:['lowpass',1200]});return .18;},                /* 6 (-12): toc de madeira G4 a F4, nada abaixo de 250 Hz */
  dica:(c,o,t)=>{sSino(c,o,t,659.25,.25,.2);sSino(c,o,t+.1,880,.3,.2);return .35;},                                      /* 7 */
  moeda:(c,o,t)=>{sTom(c,o,t,987.8,.12,{vol:.28,ataque:.005});sTom(c,o,t+.06,1318.5,.16,{vol:.28,ataque:.005});return .22;}, /* 8 */
  faseOk:(c,o,t)=>{[523.25,659.25,783.99,1046.5].forEach((f,i)=>sSino(c,o,t+i*.11,f,.5,.3));return .95;},                 /* 9 */
  estrela:(c,o,t,i)=>{sSino(c,o,t,[783.99,987.77,1174.7][Math.min(2,i||0)],.35,.36);return .35;},                         /* 10 */
  pecaAcende:(c,o,t)=>{sRuido(c,o,t,.48,{de:500,ate:2500,vol:.28});[261.6,329.6,392].forEach(f=>sTom(c,o,t+.2,f,.5,{vol:.12,ataque:.08}));return .7;}, /* 11 */
  etapaOk:(c,o,t)=>{[261.6,329.6,392].forEach(f=>sTom(c,o,t,f,1.2,{vol:.12,ataque:.2,tipo:'triangle'}));
    [523.25,587.33,659.25,783.99,880,1046.5].forEach((f,i)=>sSino(c,o,t+.2+i*.28,f,.5,.26));return 2.4;},                   /* 12 */
  planetaOk:(c,o,t)=>{[392,523.25,659.25,783.99].forEach((f,i)=>sSino(c,o,t+i*.35,f,.9,.2));sRuido(c,o,t+1.4,1.5,{de:400,ate:3000,vol:.1});
    [523.25,659.25,783.99,1046.5].forEach(f=>sSino(c,o,t+2.9,f,1.4,.1));return 4.4;},                                       /* 13 */
  passo:(c,o,t,sup)=>{                                                                                                    /* 14 (-16): dois passos por nó, 110 e 100 Hz */
    [110,100].forEach((f,i)=>{const a=t+i*.18;sTom(c,o,a,f,.07,{vol:.12,filtro:['lowpass',400]});
      if(sup==='madeira'){sRuido(c,o,a,.05,{de:800,vol:.12,q:3});}else if(sup==='areia'){sRuido(c,o,a,.07,{tipo:'highpass',de:2500,vol:.1});}else{sRuido(c,o,a,.07,{tipo:'lowpass',de:1200,vol:.12});}});
    return .27;},
  abre:(c,o,t)=>{sRuido(c,o,t,.22,{de:300,ate:900,vol:.18});return .22;},                                                 /* 15 */
  fecha:(c,o,t)=>{sRuido(c,o,t,.13,{de:900,ate:300,vol:.16});return .13;},                                                /* 16 */
  aba:(c,o,t)=>{sTom(c,o,t,180,.07,{vol:.16});sTom(c,o,t,900,.05,{vol:.08});return .07;},                                 /* 17 */
  bauRange:(c,o,t)=>{sRuido(c,o,t,.35,{de:400,ate:900,vol:.28,q:4});return .35;},                                         /* 18 */
  bauTampa:(c,o,t)=>{sRuido(c,o,t,.03,{de:900,vol:.3,q:3});sRuido(c,o,t+.02,.1,{tipo:'lowpass',de:1500,vol:.2});return .12;}, /* 19 */
  bauMoedas:(c,o,t)=>{for(let i=0;i<12;i++)sTom(c,o,t+i*.05,2000+((i*379)%2000),.1,{vol:.22,ataque:.004,pan:((i*7)%11)/5-1});return .7;}, /* 20 */
  bauRevela:(c,o,t)=>{[523.25,659.25,783.99,1046.5].forEach((f,i)=>sSino(c,o,t+i*.08,f,.7,.2));return .8;},                /* 21 */
  cadeado:(c,o,t)=>{sRuido(c,o,t,.09,{tipo:'lowpass',de:800,vol:.2});return .09;},                                        /* 22 */
  desbloqueia:(c,o,t)=>{sRuido(c,o,t,.03,{de:2500,vol:.2,q:4});sSino(c,o,t+.08,783.99,.3,.28);sSino(c,o,t+.17,1174.7,.3,.28);return .4;}, /* 23 */
  gelo:(c,o,t)=>{sRuido(c,o,t,.4,{tipo:'highpass',de:7000,vol:.1});sSino(c,o,t+.05,1046.5,.45,.3);return .5;},             /* 24 */
  missao:(c,o,t)=>{sSino(c,o,t,783.99,.3,.35);sSino(c,o,t+.12,987.77,.3,.35);return .35;},                                 /* 25 */
  pega:(c,o,t)=>{sTom(c,o,t,1800,.05,{vol:.2});return .05;},                                                              /* 26 */
  encaixa:(c,o,t)=>{sTom(c,o,t,140,.12,{vol:.3,tipo:'triangle'});sSino(c,o,t+.02,1318.5,.3,.2);return .3;},
  /* solta (objeto volta ao lugar): "plop" macio que desce de E5 para A4, com um toque de madeira por baixo. Antes era ruído acima de 2 kHz (chiado) */
  solta:(c,o,t)=>{sTom(c,o,t,659.25,.14,{vol:.22,ate:440,ataque:.006});sTom(c,o,t+.01,329.63,.1,{tipo:'triangle',vol:.08,filtro:['lowpass',1200]});return .15;},
  conquista:(c,o,t)=>{sSino(c,o,t,880,.5,.32);sSino(c,o,t+.12,1318.5,.5,.32);sRuido(c,o,t+.1,.3,{de:1500,ate:4000,vol:.12});return .65;}, /* 27 */
  parada:(c,o,t)=>{[659.25,523.25,392].forEach((f,i)=>sTom(c,o,t+i*.45,f,.9,{tipo:'triangle',vol:.22,ataque:.02,h2:.25}));return 1.6;}, /* 28 */
  /* motivos dos personagens, 2 a 4 notas */
  motivo:(c,o,t,quem)=>{
    if(quem==='teo'){[392,523.25,659.25].forEach((f,i)=>sTom(c,o,t+i*.09,f,.09,{tipo:'square',vol:.1,filtro:['lowpass',2400]}));return .3;}
    if(quem==='rufa'){sTom(c,o,t,659.25,.5,{tipo:'sine',vol:.22,ate:880,ataque:.06});sTom(c,o,t,663,.5,{vol:.1,ate:884,ataque:.06});return .55;}
    if(quem==='otto'){sTom(c,o,t,520,.22,{vol:.3,ate:200});sTom(c,o,t+.15,620,.2,{vol:.2,ate:260});return .4;}
    if(quem==='brisa'){sRuido(c,o,t,.5,{de:900,ate:2600,vol:.12,q:6});return .5;}
    if(quem==='capi'){sTom(c,o,t,98,.5,{tipo:'triangle',vol:.14,filtro:['lowpass',500]});sTom(c,o,t+.55,110,.5,{tipo:'triangle',vol:.14,filtro:['lowpass',500]});return 1;}
    if(quem==='fagulha'){[2093,2349,2637].forEach((f,i)=>sTom(c,o,t+i*.06,f,.1,{vol:.14,ataque:.004}));return .3;}
    if(quem==='embaralho'){sRuido(c,o,t,.25,{de:3000,vol:.14});sTom(c,o,t+.1,330,.2,{tipo:'sawtooth',vol:.08,ate:440,filtro:['lowpass',900]});return .35;}
    [392,523.25,659.25,783.99].forEach((f,i)=>sSino(c,o,t+i*.1,f,.5,.28));return .65;     /* Bobby: G4 C5 E5 G5 em sino */
  }
};
/* toca ao vivo (só com Efeitos ligados). Devolve false quando calado. */
function sfx(nome,arg){
  if(!S||S.som===false)return false;
  const g=sfxGrafo();if(!g)return false;
  const f=SFX[nome];if(!f)return false;
  try{f(g.ctx,g.efeitos,g.ctx.currentTime+.005,arg);return true;}catch(e){return false;}
}
/* renderização offline para o teste: devolve {amostras, dur} com a mesma receita */
async function sfxRender(nome,arg,filtroBaixo){
  const OC=window.OfflineAudioContext||window.webkitOfflineAudioContext,sr=44100,seg=5;
  const c=new OC(1,sr*seg,sr);
  let saida=c.destination;
  if(filtroBaixo){const fl=c.createBiquadFilter();fl.type='lowpass';fl.frequency.value=filtroBaixo;fl.connect(c.destination);saida=fl;}
  const mix=c.createGain();mix.gain.value=1;mix.connect(saida);
  const dur=SFX[nome](c,mix,.01,arg);
  const b=await c.startRendering();
  return {amostras:b.getChannelData(0),dur:dur};
}
/* vibração curta (Android); iPhone não oferece, e nada vibra com movimento reduzido ou com o interruptor desligado */
function vibrar(ms){
  try{
    if(!S||S.vibra===false||!navigator.vibrate)return false;
    if(navigator.userActivation&&!navigator.userActivation.hasBeenActive)return false;     /* o navegador só deixa vibrar depois de um toque */
    if(matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches)return false;
    return navigator.vibrate(ms||10);
  }catch(e){return false;}
}
/* ---------- música por planeta: faixas CC0 (assets/musica/*.m4a, ver LICENCAS.md), sob demanda, em loop, volume baixo ----------
   A trilha sintetizada anterior saiu (o Filipe achou irritante, 24/10/2026). Carrega a faixa só quando a música está ligada (nunca na carga
   inicial), toca em loop com fade de 1,5 s, a -18 dB do cheio; enquanto um clipe de voz toca, cai para -28 dB (ducking). */
const MUSICA={mat:'assets/musica/mat.m4a',pt:'assets/musica/pt.m4a',en:'assets/musica/en.m4a'};
const MUSICA_GANHO=sfxDb(-18),MUSICA_GANHO_VOZ=sfxDb(-28),MUSICA_FADE=1.5;
const MUS={buffers:{},fonte:null,ganho:null,planeta:'',pedido:0};
async function musicaCarregar(planeta){
  if(MUS.buffers[planeta])return MUS.buffers[planeta];
  const g=sfxGrafo();if(!g||!MUSICA[planeta]||typeof fetch!=='function')return null;
  const r=await fetch(MUSICA[planeta]);if(!r.ok)throw new Error('HTTP '+r.status);
  const b=await g.ctx.decodeAudioData(await r.arrayBuffer());
  MUS.buffers[planeta]=b;return b;
}
function musicaGanhoAlvo(){return SFXG.voz?MUSICA_GANHO_VOZ:MUSICA_GANHO;}
function musicaLigar(planeta){
  if(!S||S.musica===false||!SFXG.gesto)return musicaDesligar();
  const g=sfxGrafo();if(!g)return;
  if(MUS.fonte&&MUS.planeta===planeta)return;
  musicaDesligar(true);
  MUS.planeta=planeta;const pedido=++MUS.pedido;
  musicaCarregar(planeta).then(buf=>{
    if(!buf||pedido!==MUS.pedido||!S||S.musica===false)return;
    const c=g.ctx,f=c.createBufferSource(),ga=c.createGain();
    f.buffer=buf;f.loop=true;f.connect(ga);ga.connect(g.musica);
    const t=c.currentTime;ga.gain.setValueAtTime(0.0001,t);ga.gain.exponentialRampToValueAtTime(musicaGanhoAlvo(),t+MUSICA_FADE);
    f.start(t);MUS.fonte=f;MUS.ganho=ga;
  }).catch(()=>{});   /* sem rede ou sem arquivo: fica sem música, sem erro */
}
function musicaDesligar(manterPlaneta){
  MUS.pedido++;
  const f=MUS.fonte,ga=MUS.ganho,c=SFXG.ctx;
  if(f&&ga&&c){try{const t=c.currentTime;ga.gain.cancelScheduledValues(t);ga.gain.setValueAtTime(Math.max(.0001,ga.gain.value),t);ga.gain.exponentialRampToValueAtTime(.0001,t+.6);f.stop(t+.65);}catch(e){try{f.stop();}catch(e2){}}}
  MUS.fonte=null;MUS.ganho=null;
  if(!manterPlaneta)MUS.planeta='';
}
const musicaTocando=()=>!!MUS.fonte;
/* a voz manda: a música cai para -28 dB enquanto a fala toca (chamado por sfxVoz) */
function musicaDucking(){const ga=MUS.ganho,c=SFXG.ctx;if(!ga||!c)return;try{const t=c.currentTime;ga.gain.cancelScheduledValues(t);ga.gain.setTargetAtTime(musicaGanhoAlvo(),t,SFXG.voz?.05:.3);}catch(e){}}
/* liga ou desliga só a música, em um toque (botão do topo) */
function musicaAlternar(){
  S.musica=!(S.musica!==false);salvar();
  if(S.musica){SFXG.gesto=true;sfxGrafo();musicaLigar(typeof MATERIA!=='undefined'?MATERIA:'mat');}else musicaDesligar();
  if(typeof pintarTopo==='function')pintarTopo();
  return S.musica;
}
/* o primeiro toque destrava o áudio do navegador e liga a música do planeta; aba escondida pausa a música */
function sfxDestravar(){
  if(SFXG.gesto)return;
  SFXG.gesto=true;ctxAudio();sfxGrafo();
  if(typeof MATERIA!=='undefined'&&S&&S.musica)musicaLigar(MATERIA);
}
if(typeof document!=='undefined'&&document.addEventListener){
  document.addEventListener('pointerdown',sfxDestravar,{passive:true});
  document.addEventListener('keydown',sfxDestravar);
  document.addEventListener('visibilitychange',()=>{if(document.hidden)musicaDesligar(true);else if(MUS.planeta&&S&&S.musica)musicaLigar(typeof MATERIA!=='undefined'?MATERIA:'mat');});
  /* toque em qualquer botão: o som certo para cada tipo (opção, verificar, aba, nó trancado, o resto) */
  document.addEventListener('pointerdown',e=>{
    const b=e.target&&e.target.closest?e.target.closest('button,.alt,.tecla,.chip'):null;
    if(!b||b.disabled)return;
    if(b.matches('.alt'))sfx('seleciona');
    else if(b.id==='acao')sfx('verifica');
    else if(b.closest('.barra-baixo'))sfx('aba');
    else if(b.matches('.no .bt[aria-disabled="true"]'))sfx('cadeado');
    else if(b.matches('.md-bt,.tecla,.chip'))return;
    else sfx('clique');
  },{passive:true});
}
