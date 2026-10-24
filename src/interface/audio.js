/* ---------- áudio: camada única de som falado ----------
   API para o resto do app:
     audioTocar(chaveOuTexto, idioma)   toca um clipe gravado (se o manifesto tiver) ou, só como RESERVA,
                                        lê o texto com a voz do aparelho. Devolve uma Promise que diz como saiu:
                                        'gravado' | 'reserva' | 'mudo' | 'cancelado' | 'sem-voz'
     audioPrecarregar([chaves])         baixa e decodifica clipes antes de precisar
     audioParar()                       para tudo: clipe em andamento, fala da voz do aparelho e
                                        TODA fala agendada com audioAgendar() (nada sai depois de fechar a fase)
     audioAgendar(fn, ms)               setTimeout que o audioParar() cancela
     audioDefinirManifesto(m, base)     liga o áudio gravado. Hoje ninguém chama: o manifesto vem do módulo
                                        de áudio (pasta audio/) e será integrado depois.
   Regras: S.som=false ou S.voz=false silenciam TUDO (efeitos e voz). Idioma: 'pt-BR' ou 'en-US'.
   Formato do manifesto (docs/FASE-2-especificacao.md, 9.4):
     { v:1, clipes:{ 'pt-br/numero/vinte-1a2b3c4d.m4a':{ms,b} }, textos:{ 'pt-br|texto normalizado':'chave' } } */
const AUDIO={manifesto:null,base:'',token:0,timers:[],fonte:null,cache:new Map(),max:48,ultimo:''};

function audioAtivo(){return !!S&&S.som!==false&&S.voz!==false;}
function ctxAudio(){
  try{
    AC=AC||new (window.AudioContext||window.webkitAudioContext)();
    if(AC.state==='suspended'&&AC.resume)AC.resume();
    return AC;
  }catch(e){return null;}
}
function audioDefinirManifesto(m,base){
  AUDIO.manifesto=(m&&typeof m==='object'&&m.clipes)?m:null;
  AUDIO.base=String(base||'');
  AUDIO.cache.clear();
}
/* normaliza o texto como o script de build normaliza: minúsculas, sem tags, espaços simples */
function audioNormaliza(t){
  return String(t==null?'':t).replace(/<[^>]*>/g,' ').replace(/&nbsp;/g,' ').replace(/\s+/g,' ').trim().toLowerCase();
}
function audioChave(alvo,idioma){
  const m=AUDIO.manifesto;
  if(!m)return null;
  const a=String(alvo==null?'':alvo);
  if(m.clipes&&Object.prototype.hasOwnProperty.call(m.clipes,a))return a;
  const lang=(idioma==='en-US')?'en-us':'pt-br';
  const k=m.textos&&m.textos[lang+'|'+audioNormaliza(a)];
  return (k&&m.clipes&&m.clipes[k])?k:null;
}
function audioCarregar(chave){
  if(AUDIO.cache.has(chave)){const v=AUDIO.cache.get(chave);AUDIO.cache.delete(chave);AUDIO.cache.set(chave,v);return v;}
  const ctx=ctxAudio();
  if(!ctx||typeof fetch!=='function')return Promise.reject(new Error('sem Web Audio'));
  const p=fetch(AUDIO.base+chave).then(r=>{
    if(!r.ok)throw new Error('HTTP '+r.status);
    return r.arrayBuffer();
  }).then(b=>new Promise((ok,no)=>{ctx.decodeAudioData(b,ok,no);}));
  AUDIO.cache.set(chave,p);
  /* clipe que falhou não fica no cache: a próxima tentativa baixa de novo */
  p.catch(()=>{AUDIO.cache.delete(chave);});
  while(AUDIO.cache.size>AUDIO.max)AUDIO.cache.delete(AUDIO.cache.keys().next().value);
  return p;
}
function audioPrecarregar(chaves){
  if(!AUDIO.manifesto)return Promise.resolve(0);
  const lista=(chaves||[]).filter(c=>AUDIO.manifesto.clipes&&AUDIO.manifesto.clipes[c]);
  return Promise.all(lista.map(c=>audioCarregar(c).then(()=>1,()=>0))).then(r=>r.reduce((a,b)=>a+b,0));
}
function audioAgendar(fn,ms){
  const id=setTimeout(()=>{
    const i=AUDIO.timers.indexOf(id);if(i>=0)AUDIO.timers.splice(i,1);
    fn();
  },ms);
  AUDIO.timers.push(id);
  return id;
}
function audioParar(){
  AUDIO.token++;
  AUDIO.timers.splice(0).forEach(clearTimeout);
  if(AUDIO.fonte){try{AUDIO.fonte.onended=null;AUDIO.fonte.stop();}catch(e){}AUDIO.fonte=null;}
  try{if(typeof speechSynthesis!=='undefined')speechSynthesis.cancel();}catch(e){}
}
function audioFalhou(chave,motivo){
  try{if(typeof registrarEvento==='function')registrarEvento('audio_falha',{clip:String(chave).slice(0,80),motivo:String(motivo).slice(0,40)});}catch(e){}
}
/* RESERVA: voz do aparelho. Nunca chama speak() logo depois de cancel(): em vários Androids o cancel
   engole a fala seguinte. Se havia fala em andamento, cancela e espera um instante. */
function audioReserva(texto,idioma,tok){
  if(typeof speechSynthesis==='undefined'||typeof SpeechSynthesisUtterance==='undefined')return Promise.resolve('sem-voz');
  const ing=idioma==='en-US';
  const t=String(texto||'').trim();
  if(!t)return Promise.resolve('mudo');
  return new Promise(ok=>{
    const dizer=()=>{
      if(tok!==AUDIO.token){ok('cancelado');return;}
      try{
        const v=vozDe(ing?'en-US':'pt-BR');
        if(ing&&!v){if(VOZES.length)avisoVoz();ok('sem-voz');return;}
        const u=new SpeechSynthesisUtterance(t);
        u.lang=ing?'en-US':'pt-BR';
        if(v){u.voice=v;if(v.lang)u.lang=v.lang;}
        u.rate=(ing?.82:.92)*(+S.velocidade||1);u.pitch=1.05;
        u.onend=()=>ok('reserva');u.onerror=()=>ok('reserva');
        speechSynthesis.speak(u);
        AUDIO.ultimo=t;
      }catch(e){ok('sem-voz');}
    };
    try{
      if(speechSynthesis.speaking||speechSynthesis.pending){speechSynthesis.cancel();audioAgendar(dizer,90);}
      else dizer();
    }catch(e){ok('sem-voz');}
  });
}
function audioTocar(alvo,idioma){
  if(!audioAtivo())return Promise.resolve('mudo');
  audioParar();
  const tok=AUDIO.token;
  const lang=(idioma==='en-US')?'en-US':'pt-BR';
  const chave=audioChave(alvo,lang);
  if(!chave)return audioReserva(alvo,lang,tok);
  return audioCarregar(chave).then(buf=>{
    if(tok!==AUDIO.token)return 'cancelado';
    const ctx=ctxAudio();
    const fonte=ctx.createBufferSource();
    fonte.buffer=buf;fonte.connect(ctx.destination);
    AUDIO.fonte=fonte;
    return new Promise(ok=>{fonte.onended=()=>{if(AUDIO.fonte===fonte)AUDIO.fonte=null;ok('gravado');};fonte.start(0);});
  }).catch(e=>{
    audioFalhou(chave,e&&e.message||'erro');
    if(tok!==AUDIO.token)return 'cancelado';
    return audioReserva(alvo,lang,tok);
  });
}
