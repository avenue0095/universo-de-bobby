/* ---------- som e voz ---------- */
let AC=null;
function nota(f,t,dur,vol){
  if(!S.som)return;
  try{
    AC=AC||new (window.AudioContext||window.webkitAudioContext)();
    const o=AC.createOscillator(),g=AC.createGain();
    o.type='sine';o.frequency.value=f;o.connect(g);g.connect(AC.destination);
    const t0=AC.currentTime+t;
    g.gain.setValueAtTime(0,t0);g.gain.linearRampToValueAtTime(vol||.12,t0+.02);
    g.gain.exponentialRampToValueAtTime(.0001,t0+dur);
    o.start(t0);o.stop(t0+dur+.02);
  }catch(e){}
}
const somCerto=()=>{nota(660,0,.13);nota(880,.09,.2);};
const somErro=()=>{nota(200,0,.18,.14);nota(150,.1,.25,.12);};
const somFim=()=>[523,659,784,1046].forEach((f,i)=>nota(f,i*.11,.35));
const somMoeda=()=>{nota(988,0,.07,.08);nota(1319,.06,.16,.08);};
const somPasso=()=>nota(520,0,.08,.06);
const somVida=()=>{nota(784,0,.1,.09);nota(1047,.08,.2,.09);};

function emTexto(html){
  let t=String(html)
    .replace(/<span class="frac"><b>(.-?[^<]*)<\/b><i>([^<]*)<\/i><\/span>/g,' $1 sobre $2 ')
    .replace(/<[^>]+>/g,' ').replace(/&nbsp;/g,' ').replace(/&lt;/g,' menor que ').replace(/&gt;/g,' maior que ');
  t=t.replace(/×/g,' vezes ').replace(/÷/g,' dividido por ').replace(/−/g,' menos ')
     .replace(/\+/g,' mais ').replace(/=/g,' igual a ').replace(/%/g,' por cento')
     .replace(/²/g,' ao quadrado').replace(/³/g,' ao cubo').replace(/√/g,' raiz quadrada de ')
     .replace(/R\$/g,' reais ').replace(/___/g,' quanto ').replace(/\s+/g,' ').trim();
  return t;
}
/* --- vozes: escolher uma voz de verdade do idioma pedido --- */
let VOZES=[];
function carregarVozes(){
  try{VOZES=speechSynthesis.getVoices()||[];}catch(e){VOZES=[];}
}
if(typeof speechSynthesis!=='undefined'){
  carregarVozes();
  try{speechSynthesis.addEventListener('voiceschanged',carregarVozes);}catch(e){speechSynthesis.onvoiceschanged=carregarVozes;}
  setTimeout(carregarVozes,300);setTimeout(carregarVozes,1200);
}
const idioma=v=>String((v&&v.lang)||'').toLowerCase().replace('_','-');
/* vozes de brincadeira do macOS/iOS: nunca servem para ler uma aula */
const VOZ_RUIM=/albert|bad news|bahh|bells|boing|bubbles|cellos|deranged|good news|jester|junior|organ|superstar|trinoids|whisper|wobble|zarvox|ralph|fred|kathy|princess|hysterical|pipe organ|eddy|flo|grandma|grandpa|reed|rocko|sandy|shelley|novelty/i;
/* lista de vozes de um idioma, da melhor para a pior */
function vozesDe(lang){
  if(!VOZES.length)carregarVozes();
  const alvo=(lang||'pt-BR').toLowerCase(),raiz=alvo.slice(0,2);
  let c=VOZES.filter(v=>idioma(v)===alvo);
  if(!c.length)c=VOZES.filter(v=>idioma(v).slice(0,2)===raiz);
  const nota=v=>{
    let p=0;const n=(v.name||'').toLowerCase();
    if(VOZ_RUIM.test(n))p-=40;                         /* voz de piada, fora */
    if(v.localService)p+=4;                            /* funciona sem internet */
    if(idioma(v)===alvo)p+=6;                          /* sotaque certo */
    if(/premium|enhanced|neural|natural|siri/.test(n))p+=8;  /* as boas de verdade */
    if(/samantha|ava|allison|luciana|joana|google|zira|aria|jenny|francisca/.test(n))p+=4;
    if(/compact/.test(n))p-=3;
    if(v.default)p+=1;
    return p;
  };
  return c.slice().sort((a,b)=>nota(b)-nota(a));
}
function vozDe(lang){
  const lista=vozesDe(lang);
  if(!lista.length)return null;
  /* respeita a voz escolhida nas configurações, se ela existir neste aparelho */
  const escolhida=(lang==='en-US')?S.vozEn:S.vozPt;
  if(escolhida){
    const achou=lista.filter(v=>v.name===escolhida)[0]||
                VOZES.filter(v=>v.name===escolhida)[0];
    if(achou)return achou;
  }
  return lista[0];
}
function temVoz(lang){return !!vozDe(lang);}
function falar(html,lang){
  try{
    if(!('speechSynthesis' in window))return;
    speechSynthesis.cancel();
    const ing=lang==='en-US';
    const u=new SpeechSynthesisUtterance(ing?limpaEN(html):emTexto(html));
    u.lang=ing?'en-US':'pt-BR';
    const escolhida=ing?S.vozEn:S.vozPt;
    /* Português: sem escolha, deixa o aparelho usar a voz padrão dele —
       é o som que a criança já conhecia. Inglês é diferente: se ninguém
       escolher, o aparelho leria com a voz portuguesa e sairia errado,
       então aí sim procuramos uma voz inglesa de verdade. */
    let v=null;
    if(escolhida)v=VOZES.filter(x=>x.name===escolhida)[0]||null;
    if(!v&&ing)v=vozDe('en-US');
    if(ing&&!v){if(VOZES.length)avisoVoz();return;}
    if(v)u.voice=v;
    const vel=+S.velocidade||1;
    u.rate=(ing?.82:.92)*vel;u.pitch=1.05;
    speechSynthesis.speak(u);
  }catch(e){}
}
function limpaEN(html){
  return String(html).replace(/<[^>]+>/g,' ').replace(/&nbsp;/g,' ')
    .replace(/&amp;/g,'and').replace(/[“”"]/g,'').replace(/\s+/g,' ').trim();
}
let avisouVoz=false;
function avisoVoz(){
  if(avisouVoz)return;avisouVoz=true;
  const d=document.createElement('div');
  d.className='aviso-voz';
  d.innerHTML='<b>Som em inglês indisponível</b><span>Este aparelho não tem uma voz em inglês instalada, então preferimos não ler com sotaque errado. Nas configurações do aparelho, adicione o idioma inglês (EUA) na leitura em voz alta.</span>';
  document.body.appendChild(d);
  setTimeout(()=>{d.classList.add('sai');setTimeout(()=>d.remove(),400);},6500);
}
const calar=()=>{try{speechSynthesis.cancel();}catch(e){}};

