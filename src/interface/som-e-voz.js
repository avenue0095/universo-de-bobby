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
/* falar(html, 'pt-BR'|'en-US'): entrega ao audio.js, que acha o clipe gravado (ou compõe quadros e encaixes).
   Respeita S.som e S.voz: com o som desligado a voz também fica calada. Sem clipe, fica sem voz (nada de voz do aparelho).
   html pode ser um texto ou uma lista de textos (tocam em fila). */
function falar(html,lang){return audioTocar(html,lang);}
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
const calar=()=>audioParar();
