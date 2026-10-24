/* ---------- áudio: player da voz GRAVADA ----------
   Decisão do Filipe: a voz é toda gravada (audio/, manifesto-min.json). NÃO existe voz do aparelho (speechSynthesis):
   texto sem clipe fica sem voz e vira aviso no teste de cobertura (testes/cobertura-audio.js) e evento 'audio_falha'.
   API para o resto do app:
     audioTocar(alvo, idioma)   alvo = texto (html), chave de clipe ou lista deles. Resolve texto -> clipe(s) (audio-clipes.js),
                                compõe quadros e encaixes quando preciso, toca em fila sem intervalo (Web Audio).
                                Devolve Promise: 'gravado' | 'sem-clipe' | 'mudo' | 'cancelado' | 'indisponivel'
     audioPrecarregarTexto(t)   baixa e decodifica os clipes do próximo texto
     audioParar()               para clipe, fila e TODA fala agendada (nada sai depois de fechar a fase)
     audioAgendar(fn, ms)       setTimeout que o audioParar() cancela
     audioIniciar()             carrega o manifesto, escolhe .m4a (AAC) ou .opus, baixa o pacote core na primeira visita
     audioBaixarPacote(nome)    guarda um pacote (core, mat, pt, en) no cache 'bobby-audio-v1' para jogar sem internet
   Regras: S.voz=false cala a voz (Efeitos e Música têm interruptor próprio). Formato: .m4a por padrão; .opus só se o aparelho não toca AAC
   e confirma Opus em canPlayType (docs/FASE-2-especificacao.md, 9.5). */
const AUDIO_CACHE='bobby-audio-v1';
const AUDIO_CHAVE_LS='universo-bobby-audio';
const AUDIO={base:'audio/',token:0,timers:[],fontes:[],buffers:new Map(),max:80,pronto:null,semAudio:false,
  formato:null,log:[],avisados:new Set(),baixando:{},fins:[]};

/* a voz só depende do interruptor Voz: com os Efeitos desligados ela continua (três interruptores independentes) */
function audioAtivo(){return !!S&&S.voz!==false;}
function ctxAudio(){
  try{
    AC=AC||new (window.AudioContext||window.webkitAudioContext)();
    if(AC.state==='suspended'&&AC.resume)AC.resume();
    return AC;
  }catch(e){return null;}
}
/* o app só oferece "ouça e escolha" quando há áudio; sem manifesto (primeira visita sem internet) a pergunta vira de ler */
const audioPodeOuvir=()=>!AUDIO.semAudio;
function audioLog(chave,estado){
  AUDIO.log.push({chave:chave,estado:estado,t:Date.now()});
  if(AUDIO.log.length>200)AUDIO.log.shift();
}
function audioFormato(){
  if(AUDIO.formato)return AUDIO.formato;
  let f='.m4a';
  try{
    const a=document.createElement('audio');
    const aac=a.canPlayType&&a.canPlayType('audio/mp4; codecs="mp4a.40.2"');
    const opus=a.canPlayType&&a.canPlayType('audio/ogg; codecs="opus"');
    if(!aac&&opus)f='.opus';
  }catch(e){}
  AUDIO.formato=f;
  return f;
}
const audioUrl=chave=>AUDIO.base+chave+audioFormato();

/* ---------- manifesto ---------- */
function audioIniciar(){
  if(AUDIO.pronto)return AUDIO.pronto;
  AUDIO.pronto=(async()=>{
    let min=null;
    try{
      const r=await fetch(AUDIO.base+'manifesto-min.json');
      if(!r.ok)throw new Error('HTTP '+r.status);
      min=await r.json();
    }catch(e){
      try{const c=await caches.open(AUDIO_CACHE);const r=await c.match(AUDIO.base+'manifesto-min.json');if(r)min=await r.json();}catch(e2){}
    }
    /* sem manifesto (primeira visita sem internet): perguntas de ouvir viram de ler, e a próxima chamada tenta de novo */
    if(!min||!audioIndexar(min)){AUDIO.semAudio=true;AUDIO.pronto=null;return false;}
    AUDIO.semAudio=false;
    /* primeira visita: o pacote core (letras, sílabas, números, nomes, feedback) vem junto */
    audioBaixarPacote('core').catch(()=>{});
    return true;
  })();
  return AUDIO.pronto;
}

/* ---------- carregar e decodificar ---------- */
function audioCarregar(chave){
  if(AUDIO.buffers.has(chave)){const v=AUDIO.buffers.get(chave);AUDIO.buffers.delete(chave);AUDIO.buffers.set(chave,v);return v;}
  const ctx=ctxAudio();
  if(!ctx||typeof fetch!=='function')return Promise.reject(new Error('sem Web Audio'));
  const p=fetch(audioUrl(chave)).then(r=>{
    if(!r.ok)throw new Error('HTTP '+r.status);
    return r.arrayBuffer();
  }).then(b=>new Promise((ok,no)=>{
    const r=ctx.decodeAudioData(b,ok,no);
    if(r&&r.then)r.then(ok,no);
  }));
  AUDIO.buffers.set(chave,p);
  p.catch(()=>{AUDIO.buffers.delete(chave);});      /* clipe que falhou não fica no cache: a próxima tentativa baixa de novo */
  while(AUDIO.buffers.size>AUDIO.max)AUDIO.buffers.delete(AUDIO.buffers.keys().next().value);
  return p;
}
/* lista de clipes de um alvo: texto, chave ou lista deles */
function audioClipesDe(alvo,idioma,mat){
  const itens=Array.isArray(alvo)?alvo:[alvo];
  const chaves=[],faltas=[];
  itens.forEach(it=>{
    if(typeof it==='string'&&audioTem(it)){chaves.push(it);return;}
    const s=audioSequencia(it,idioma,mat);
    s.chaves.forEach(k=>chaves.push(k));
    s.faltas.forEach(f=>faltas.push(f));
  });
  return {chaves:chaves,faltas:faltas};
}
function audioPrecarregarTexto(alvo,idioma,mat){
  if(!audioAtivo()||AUDIO.semAudio||!audioIndiceCheio())return Promise.resolve(0);
  const c=audioClipesDe(alvo,idioma||'pt-BR',mat||MATERIA);
  return Promise.all(c.chaves.map(k=>audioCarregar(k).then(()=>1,()=>0))).then(r=>r.reduce((a,b)=>a+b,0));
}
const audioIndiceCheio=()=>AUDIO_INDICE.chaves.size>0;

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
  AUDIO.fontes.splice(0).forEach(f=>{try{f.onended=null;f.stop();}catch(e){}});
  if(typeof sfxVoz==='function')sfxVoz(false);
  AUDIO.fins.splice(0).forEach(f=>f('cancelado'));      /* quem esperava a fala terminar recebe 'cancelado' */
}
function audioFalhou(chave,motivo){
  /* só código curto: texto livre nunca vai para os eventos */
  try{if(typeof registrarEvento==='function')registrarEvento('audio_falha',{clip:String(chave).slice(0,80),motivo:String(motivo).toLowerCase().replace(/[^a-z0-9]+/g,'-').slice(0,40)});}catch(e){}
}
const audioVelocidade=()=>Math.min(1.2,Math.max(.8,+S.velocidade||1));

/* ---------- tocar ---------- */
async function audioTocar(alvo,idioma,mat){
  if(!audioAtivo())return 'mudo';
  audioParar();
  const tok=AUDIO.token;
  const lang=idioma==='en-US'?'en-US':'pt-BR';
  try{await audioIniciar();}catch(e){}
  if(tok!==AUDIO.token)return 'cancelado';
  if(AUDIO.semAudio)return 'indisponivel';
  const c=audioClipesDe(alvo,lang,mat||MATERIA);
  c.faltas.forEach(f=>{
    /* aviso uma vez por sessão e por falta; o conteúdo da falta (texto do app, não da criança) vira só um código curto */
    const cod='sem-'+audioFnv8(f);
    if(!AUDIO.avisados.has(cod)){AUDIO.avisados.add(cod);audioFalhou(cod,'sem-clipe');}
  });
  if(!c.chaves.length)return 'sem-clipe';
  const ctx=ctxAudio();
  if(!ctx)return 'indisponivel';
  /* baixa e decodifica todos os clipes da fila antes de começar: assim a fila toca sem intervalo audível */
  const bufs=await Promise.all(c.chaves.map(k=>audioCarregar(k).then(b=>({k:k,b:b}),e=>{audioLog(k,'erro');audioFalhou(k,e&&e.message||'erro');return null;})));
  if(tok!==AUDIO.token)return 'cancelado';
  const ok=bufs.filter(Boolean);
  if(!ok.length)return 'sem-clipe';
  const vel=audioVelocidade();
  return new Promise(fim0=>{
    if(typeof sfxVoz==='function')sfxVoz(true);
    const fim=r=>{const i=AUDIO.fins.indexOf(fim0);if(i>=0)AUDIO.fins.splice(i,1);if(typeof sfxVoz==='function')sfxVoz(false);fim0(r);};
    AUDIO.fins.push(fim0);
    let t=ctx.currentTime+0.04;
    ok.forEach((x,i)=>{
      const fonte=ctx.createBufferSource();
      fonte.buffer=x.b;
      try{fonte.playbackRate.value=vel;}catch(e){}
      fonte.connect(ctx.destination);
      AUDIO.fontes.push(fonte);
      const ultimo=i===ok.length-1;
      fonte.onended=()=>{
        const j=AUDIO.fontes.indexOf(fonte);if(j>=0)AUDIO.fontes.splice(j,1);
        audioLog(x.k,'terminou');
        if(ultimo)fim('gravado');
      };
      audioLog(x.k,'iniciou');
      fonte.start(t);
      t+=(x.b.duration||0)/vel;
    });
  });
}

/* ---------- pacotes no cache (jogar sem internet) ---------- */
function audioGuardado(){
  try{return JSON.parse(localStorage.getItem(AUDIO_CHAVE_LS)||'{}')||{};}catch(e){return {};}
}
function audioMarcarGuardado(pacote,formato){
  try{const g=audioGuardado();g.formato=formato;g.pacotes=g.pacotes||{};g.pacotes[pacote]=diaLocal();localStorage.setItem(AUDIO_CHAVE_LS,JSON.stringify(g));}catch(e){}
}
function audioTamanhoPacote(nome){
  const i=audioFormato()==='.opus'?0:1;
  return (AUDIO_INDICE.pacotes[nome]||[]).reduce((a,k)=>a+AUDIO_INDICE.chaves.get(k).b[i],0);
}
const audioMB=b=>(b/1048576).toFixed(1).replace('.',',')+' MB';
/* Guarda os clipes de um pacote no cache 'bobby-audio-v1'. Nada de download escondido grande: o app avisa o tamanho
   antes (ver avisoBaixando) e respeita "economia de dados" do aparelho nos pacotes de matéria. */
async function audioBaixarPacote(nome,progresso,forcar){
  if(AUDIO.baixando[nome])return AUDIO.baixando[nome];
  const g=audioGuardado();
  if(!forcar&&g.pacotes&&g.pacotes[nome]&&g.formato===audioFormato())return {ok:true,ja:true,falhas:0};
  if(typeof caches==='undefined'||typeof fetch!=='function')return {ok:false,falhas:0,semCache:true};
  AUDIO.baixando[nome]=(async()=>{
    await audioIniciar();
    const chaves=(AUDIO_INDICE.pacotes[nome]||[]).slice();
    const cache=await caches.open(AUDIO_CACHE);
    let feitos=0,falhas=0,i=0;
    const trabalha=async()=>{
      while(i<chaves.length){
        const k=chaves[i++],url=audioUrl(k);
        try{
          if(!(await cache.match(url))){const r=await fetch(url);if(!r.ok)throw new Error('HTTP '+r.status);await cache.put(url,r);}
        }catch(e){falhas++;}
        feitos++;
        if(progresso)try{progresso(feitos,chaves.length);}catch(e){}
      }
    };
    await Promise.all([trabalha(),trabalha(),trabalha(),trabalha()]);
    if(!falhas)audioMarcarGuardado(nome,audioFormato());
    delete AUDIO.baixando[nome];
    return {ok:falhas===0,falhas:falhas,total:chaves.length};
  })();
  AUDIO.baixando[nome].catch(()=>{delete AUDIO.baixando[nome];});
  return AUDIO.baixando[nome];
}
const NOME_PACOTE={core:'vozes básicas',mat:'Matemática',pt:'Português',en:'Inglês',ajudas:'ajudas faladas'};
/* o que 'Guardar tudo' baixa por padrão; as ajudas faladas (10 MB) só com a opção marcada, e nunca sozinhas ao entrar na matéria */
const PACOTES_PADRAO=['core','mat','pt','en'];
/* ao abrir uma galáxia: avisa o tamanho e guarda o pacote da matéria (uma vez) */
async function audioPrepararMateria(m){
  try{
    await audioIniciar();
    if(AUDIO.semAudio)return;
    const g=audioGuardado();
    if(g.pacotes&&g.pacotes[m]&&g.formato===audioFormato())return;
    if(navigator.connection&&navigator.connection.saveData)return;     /* economia de dados ligada: não baixa sozinho */
    avisoBaixando('Baixando as vozes de '+NOME_PACOTE[m]+' ('+audioMB(audioTamanhoPacote(m))+') para jogar sem internet.');
    audioBaixarPacote(m).then(r=>{if(r&&r.ok&&!r.ja)avisoBaixando('Vozes de '+NOME_PACOTE[m]+' prontas para jogar sem internet.');});
  }catch(e){}
}
/* O aviso das vozes NUNCA aparece sobre o mapa nem sobre a fase: fica guardado e é mostrado só na tela Voz e som (linha de estado). */
function avisoBaixando(texto){
  try{
    AUDIO.avisoPacote=texto;
    const aberta=document.querySelector('#perfil');
    if(!aberta||!aberta.classList||!aberta.classList.contains('on')||!document.querySelector('#voz-estado'))return;
    const vz=document.querySelector('#voz-estado');if(vz)vz.textContent=texto;
  }catch(e){}
}
