/* ---------- som e voz ---------- */
let AC=null;
function nota(f,t,dur,vol){
  if(!S.som)return;
  try{
    ctxAudio();
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
/* --- vozes do aparelho: SÓ COMO RESERVA enquanto o áudio gravado não chega (ver audio.js) --- */
let VOZES=[];
function carregarVozes(){
  try{VOZES=speechSynthesis.getVoices()||[];}catch(e){VOZES=[];}
}
if(typeof speechSynthesis!=='undefined'){
  carregarVozes();
  try{speechSynthesis.addEventListener('voiceschanged',carregarVozes);}catch(e){speechSynthesis.onvoiceschanged=carregarVozes;}
  setTimeout(carregarVozes,300);setTimeout(carregarVozes,1200);
}
const idioma=v=>String((v&&v.lang)||'').toLowerCase().replace(/_/g,'-');
/* nome sem o parêntese: "Eddy (Português (Brasil))" -> "eddy" */
const nomeBase=v=>String((v&&v.name)||'').split('(')[0].replace(/^(microsoft|google|apple)\s+/i,'').trim().toLowerCase();
/* Vozes de brincadeira do macOS/iOS (existem em vários idiomas, inclusive pt-BR e en-US).
   Nunca servem para ler uma aula e NÃO aparecem na lista nem são escolhidas sozinhas. */
const VOZ_PIADA=new Set(['albert','bad news','bahh','bells','boing','bubbles','cellos','deranged','eddy','flo','fred',
  'good news','grandma','grandpa','hysterical','jester','junior','kathy','organ','pipe organ','princess','ralph','reed',
  'rocko','sandy','shelley','superstar','trinoids','whisper','wobble','zarvox']);
const ehVozPiada=v=>{
  const n=nomeBase(v);
  return VOZ_PIADA.has(n)||/\b(novelty|bad news|good news|pipe organ)\b/.test(n)||VOZ_PIADA.has(n.split(' ')[0]);
};
/* vozes que costumam soar bem em cada idioma (Android, iOS, macOS, Windows/Edge) */
const VOZ_BOA={
  'pt':/luciana|felipe|francisca|thalita|antonio|maria|google portugu[eê]s do brasil|google portuguese|pt-br-x-/,
  'en':/samantha|ava|allison|nicky|zoe|evan|alex|aria|jenny|guy|google us english|en-us-x-/
};
function notaVoz(v,alvo){
  const n=String((v&&v.name)||'').toLowerCase(),b=nomeBase(v);
  let p=0;
  if(idioma(v)===alvo)p+=10;                              /* sotaque certo: pt-BR não perde para pt-PT */
  if(v.localService)p+=4;                                 /* funciona sem internet */
  if(/premium|enhanced|neural|natural|aprimorad/.test(n))p+=8;
  if(VOZ_BOA[alvo.slice(0,2)]&&VOZ_BOA[alvo.slice(0,2)].test(b+' '+n))p+=5;
  if(/compact|espeak|robot/.test(n))p-=6;
  if(v.default)p+=1;
  return p;
}
/* lista de vozes de um idioma, da melhor para a pior, sem vozes de piada */
function vozesDe(lang){
  if(!VOZES.length)carregarVozes();
  const alvo=(lang||'pt-BR').toLowerCase().replace(/_/g,'-'),raiz=alvo.slice(0,2);
  const limpas=VOZES.filter(v=>!ehVozPiada(v));
  let c=limpas.filter(v=>idioma(v)===alvo);
  /* sem a variante exata (pt-BR), aceita o mesmo idioma de outra região (pt-PT) em vez de nada */
  if(!c.length)c=limpas.filter(v=>idioma(v).slice(0,2)===raiz);
  return c.slice().sort((a,b)=>notaVoz(b,alvo)-notaVoz(a,alvo));
}
function vozDe(lang){
  const lista=vozesDe(lang);
  if(!lista.length)return null;
  /* respeita a voz escolhida nas configurações, se ela existir neste aparelho e não for de piada */
  const escolhida=(lang==='en-US')?S.vozEn:S.vozPt;
  if(escolhida){
    const achou=lista.filter(v=>v.name===escolhida)[0];
    if(achou)return achou;
  }
  return lista[0];
}
function temVoz(lang){return !!vozDe(lang);}
/* falar(html, 'pt-BR'|'en-US'): tira as tags, troca símbolos por extenso e entrega ao audio.js.
   Respeita S.som e S.voz: com o som desligado a voz também fica calada. */
function falar(html,lang){
  const ing=lang==='en-US';
  return audioTocar(ing?limpaEN(html):emTexto(html),ing?'en-US':'pt-BR');
}
/* fala pedida pela criança (botão de ouvir): se o som estiver desligado, avisa em vez de ficar mudo sem explicar */
function falarPedido(html,lang){
  if(!audioAtivo()){avisoSomDesligado();return Promise.resolve('mudo');}
  return falar(html,lang);
}
let avisouSomOff=false;
function avisoSomDesligado(){
  if(avisouSomOff)return;avisouSomOff=true;
  const d=document.createElement('div');d.className='aviso-voz';
  d.innerHTML='<b>Os sons estão desligados</b><span>Toque no alto-falante lá em cima para ligar de novo.</span>';
  document.body.appendChild(d);
  setTimeout(()=>{d.classList.add('sai');setTimeout(()=>{d.remove();avisouSomOff=false;},400);},3500);
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
const calar=()=>audioParar();
