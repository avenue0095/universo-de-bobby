/* ---------- voz e som (voz gravada: só liga/desliga, velocidade e pacotes para jogar sem internet) ---------- */
/* ---------- jogar sem internet: arte e vozes ---------- */
const ARTE_CACHE='bobby-arte-v1';
const arteLista=()=>Object.keys(typeof ATIVOS==='object'?ATIVOS:{}).map(k=>ARTE_BASE+ATIVOS[k][0]);
/* quantas imagens já estão guardadas neste aparelho (para dizer a verdade na tela) */
async function arteContarGuardadas(){
  try{
    if(typeof caches==='undefined')return 0;
    const c=await caches.open(ARTE_CACHE),lista=arteLista();let n=0;
    for(const u of lista){if(await c.match(u))n++;}
    return n;
  }catch(e){return 0;}
}
/* guarda TODA a arte no cache da arte, 4 por vez, com progresso. As que já estão guardadas não baixam de novo. */
async function arteGuardarTudo(progresso){
  const lista=arteLista();
  if(typeof caches==='undefined'||typeof fetch!=='function')return {ok:false,falhas:0,total:lista.length,semCache:true};
  const cache=await caches.open(ARTE_CACHE);
  let i=0,feitos=0,falhas=0;
  const trabalha=async()=>{
    while(i<lista.length){
      const u=lista[i++];
      try{
        if(!(await cache.match(u))){const r=await fetch(u);if(!r.ok)throw new Error('HTTP '+r.status);await cache.put(u,r);}
      }catch(e){falhas++;}
      feitos++;
      if(progresso)try{progresso(feitos,lista.length);}catch(e){}
    }
  };
  await Promise.all([trabalha(),trabalha(),trabalha(),trabalha()]);
  return {ok:falhas===0,falhas:falhas,total:lista.length};
}
/* linhas dos pacotes de voz (repintadas depois de baixar, para a tela dizer a verdade) */
function pacotesVozHTML(){
  const g=audioGuardado();
  return ['core','mat','pt','en'].map(p=>{
    const ok=g.pacotes&&g.pacotes[p]&&g.formato===audioFormato();
    return '<div class="linha-mundo"><div class="mtx"><b>'+NOME_PACOTE[p].replace(/^./,c=>c.toUpperCase())+'</b>'+
       '<span class="sub-l">'+(audioIndiceCheio()?audioMB(audioTamanhoPacote(p)):'tamanho indisponível')+' · '+(ok?'guardado neste aparelho':'ainda não guardado')+'</span></div></div>';
  }).join('');
}
function telaVoz(){
  let h='<div class="perfil-in">';
  h+='<p class="galeria-intro">A voz do Bobby é gravada e vem junto com o app. Aqui você liga ou desliga os sons e escolhe a velocidade da fala.</p>';
  h+='<p class="galeria-intro" id="voz-estado" role="status">'+escapa(AUDIO.avisoPacote||'As vozes ficam guardadas no aparelho depois de baixadas, para jogar sem internet.')+'</p>';
  h+='<h2 class="sec">Sons</h2><div class="ctl">';
  h+='<div class="ctl-linha"><b>Efeitos e voz</b><div>'+
     '<button class="chip-ctl'+(S.som?' on':'')+'" data-som="1">Ligados</button>'+
     '<button class="chip-ctl'+(!S.som?' on':'')+'" data-som="0">Desligados</button></div>'+
     '<small>Com os sons desligados, o Bobby também fica em silêncio.</small></div>';
  h+='<div class="ctl-linha"><b>Narração do Bobby</b><div>'+
     '<button class="chip-ctl'+(S.voz?' on':'')+'" data-voz="1">Ligada</button>'+
     '<button class="chip-ctl'+(!S.voz?' on':'')+'" data-voz="0">Desligada</button></div></div></div>';
  const v=Math.round(audioVelocidade()*100);
  h+='<h2 class="sec">Velocidade da fala</h2>';
  h+='<div class="velocidade"><input type="range" id="vel" min="80" max="120" step="5" value="'+v+'" aria-label="Velocidade da fala">'+
     '<div class="vel-tx"><span>mais devagar</span><b id="vel-n">'+v+'%</b><span>mais rápido</span></div>'+
     '<button class="btn fantasma" id="vel-teste">Ouvir uma frase</button></div>';
  h+='<h2 class="sec">Jogar sem internet</h2>';
  h+='<p class="galeria-intro">As vozes ficam guardadas neste aparelho. Cada matéria baixa uma vez, quando você entra nela. Pelo celular, o tamanho aparece antes.</p>';
  h+='<div class="mundos-lista" id="pacotes-voz">'+pacotesVozHTML()+'</div>';
  h+='<p class="galeria-intro" id="arte-estado" role="status">Conferindo as imagens guardadas...</p>';
  h+='<div class="perfil-bts"><button class="btn laranja" id="baixar-vozes">'+IC.baixar+' Guardar tudo para jogar sem internet</button></div><div id="voz-aviso" role="status" aria-live="polite"></div>';
  h+='<div class="perfil-bts"><button class="btn fantasma" id="volta-voz">Voltar ao perfil</button></div></div>';

  $('#perfil').innerHTML='<div class="rev-topo"><button class="icobtn" id="volta-voz2" aria-label="Voltar">'+
    IC.volta+'</button><h2>Voz e som</h2></div><div class="rev-corpo">'+h+'</div>';
  $('#perfil').classList.add('on');document.body.style.overflow='hidden';
  $('#volta-voz').addEventListener('click',telaPerfil);
  $('#volta-voz2').addEventListener('click',telaPerfil);
  $('#perfil').querySelectorAll('[data-som]').forEach(b=>b.addEventListener('click',()=>{
    S.som=b.dataset.som==='1';salvar();pintarTopo();if(!S.som)calar();telaVoz();}));
  $('#perfil').querySelectorAll('[data-voz]').forEach(b=>b.addEventListener('click',()=>{
    S.voz=b.dataset.voz==='1';salvar();if(!S.voz)calar();telaVoz();}));
  const r=$('#vel');
  if(r){
    r.addEventListener('input',()=>{$('#vel-n').textContent=r.value+'%';});
    r.addEventListener('change',()=>{S.velocidade=(+r.value)/100;salvar();falarPedido('Boa!');});
  }
  const t=$('#vel-teste');
  if(t)t.addEventListener('click',()=>falarPedido('Isso aí!'));
  const total=arteLista().length;
  arteContarGuardadas().then(n=>{const e=$('#arte-estado');if(e)e.textContent='Imagens guardadas neste aparelho: '+n+' de '+total+(n<total?'. Toque no botão abaixo para guardar o resto.':'. Tudo pronto para jogar sem internet.');});
  const bx=$('#baixar-vozes');
  if(bx)bx.addEventListener('click',async()=>{
    bx.disabled=true;
    const av=$('#voz-aviso');
    const diz=t=>{av.innerHTML='<div class="aviso-ok">'+t+'</div>';};
    let falhas=0;
    const ra=await arteGuardarTudo((a2,b2)=>diz('Guardando as imagens: '+a2+' de '+b2));
    if(!ra.ok)falhas+=ra.falhas||1;
    await audioIniciar();
    for(const p of ['core','mat','pt','en']){
      const r2=await audioBaixarPacote(p,(a2,b2)=>diz('Guardando as vozes de '+NOME_PACOTE[p]+': '+a2+' de '+b2),false);
      if(r2&&!r2.ok)falhas++;
      else if(r2&&r2.ok&&typeof audioMarcarGuardado==='function')audioMarcarGuardado(p,audioFormato());
    }
    const lp=$('#pacotes-voz');if(lp)lp.innerHTML=pacotesVozHTML();
    diz(falhas?'Alguns arquivos não baixaram. Tente de novo com internet.':'Pronto! Imagens e vozes estão guardadas neste aparelho.');
    arteContarGuardadas().then(n=>{const e=$('#arte-estado');if(e)e.textContent='Imagens guardadas neste aparelho: '+n+' de '+total+(n<total?'. Toque no botão abaixo para guardar o resto.':'. Tudo pronto para jogar sem internet.');});
    registrarEvento('config_mudou',{chave:'vozes_offline'});
    bx.disabled=false;
  });
}

/* ---------- segurança e dados do perfil ---------- */
/* A senha guarda a ÁREA DO RESPONSÁVEL (relatórios, apagar perfis, backup, apagar tudo).
   É uma TRAVA LOCAL neste aparelho para a criança não entrar sozinha. NÃO é controle parental com valor legal: quem sabe mexer no
   navegador consegue removê-la, porque não existe servidor. Controle parental de verdade fica para a conta do responsável na nuvem.
   Guardada com PBKDF2-SHA256 (150 mil voltas, Web Crypto) e sal aleatório de 16 bytes, criado a cada vez que a senha é definida
   (a senha é uma só por aparelho, não por jogador). Depois de 5 erros seguidos, espera crescente (30 s, 1 min, 2 min... até 15 min).
   Senha criada nas versões anteriores (hash simples) continua valendo e é trocada pelo PBKDF2 no primeiro acerto. */
const PBKDF2_VOLTAS=150000,PIN_ERROS_ATE_ESPERA=5;
function temSenha(){return !!(STORE.senha&&STORE.senha.h);}
const paraHex=b=>Array.from(new Uint8Array(b)).map(x=>('0'+x.toString(16)).slice(-2)).join('');
const temCripto=()=>typeof crypto!=='undefined'&&crypto&&crypto.subtle&&typeof crypto.getRandomValues==='function';
function salAleatorio(){const a=new Uint8Array(16);crypto.getRandomValues(a);return paraHex(a);}
async function pbkdf2(pin,salHex,voltas){
  const chave=await crypto.subtle.importKey('raw',new TextEncoder().encode(String(pin)),'PBKDF2',false,['deriveBits']);
  const sal=Uint8Array.from(salHex.match(/../g).map(x=>parseInt(x,16)));
  return paraHex(await crypto.subtle.deriveBits({name:'PBKDF2',salt:sal,iterations:voltas,hash:'SHA-256'},chave,256));
}
/* hash simples das versões anteriores: só para conferir senha antiga e trocá-la */
function hashLegado(pin,sal){
  let h=5381;const t=sal+'|'+String(pin);
  for(let i=0;i<t.length;i++)h=((h<<5)+h+t.charCodeAt(i))>>>0;
  for(let v=0;v<5000;v++)h=((h<<5)+h+(v%97))>>>0;
  return h.toString(36);
}
async function definirSenha(pin){
  if(temCripto()){
    const s=salAleatorio();
    STORE.senha={v:2,s:s,it:PBKDF2_VOLTAS,h:await pbkdf2(pin,s,PBKDF2_VOLTAS),e:0,b:0};
  }else{                                    /* ambiente sem Web Crypto (não é o caso de https nem de localhost) */
    const s='s'+Math.random().toString(36).slice(2,10);
    STORE.senha={s:s,h:hashLegado(pin,s)};
  }
  salvarStore();
}
const esperaDoPin=()=>Math.max(0,((STORE.senha&&STORE.senha.b)||0)-Date.now());
async function conferirSenha(pin){
  if(!temSenha())return true;
  if(esperaDoPin()>0)return false;
  const sn=STORE.senha;
  let ok=false;
  if(sn.v===2&&temCripto())ok=(await pbkdf2(pin,sn.s,sn.it||PBKDF2_VOLTAS))===sn.h;
  else if(sn.v!==2){ok=hashLegado(pin,sn.s)===sn.h;if(ok)await definirSenha(pin);}   /* migra no primeiro acerto */
  if(ok){if(STORE.senha.e||STORE.senha.b){STORE.senha.e=0;STORE.senha.b=0;salvarStore();}return true;}
  if(sn.v===2){
    sn.e=(sn.e||0)+1;
    if(sn.e>=PIN_ERROS_ATE_ESPERA)sn.b=Date.now()+Math.min(900,30*Math.pow(2,sn.e-PIN_ERROS_ATE_ESPERA))*1000;
    salvarStore();
  }
  return false;
}
let liberadoAte=0;
const respLiberado=()=>!temSenha()||Date.now()<liberadoAte;
function pedirSenha(titulo,texto,aoAcertar,criando){
  let erro='';
  const pinta=()=>{
    $('#folha').innerHTML='<div class="folha-in senha-in">'+
      '<h2>'+titulo+'</h2><p class="perfis-sub">'+texto+'</p>'+
      '<input id="campo-pin" class="campo pin" type="password" inputmode="numeric" '+
      'autocomplete="off" maxlength="6" placeholder="••••" aria-label="Senha de 4 números">'+
      (erro?'<p class="erro-pin">'+erro+'</p>':'')+
      '<div class="modal-bts"><button class="link" id="pin-cancela">Cancelar</button>'+
      '<button class="btn" id="pin-ok">'+(criando?'Criar senha':'Entrar')+'</button></div></div>';
    $('#folha').classList.add('on');
    const campo=$('#campo-pin');campo.focus();
    const tenta=async()=>{
      const v=(campo.value||'').trim();
      if(criando){
        if(!/^[0-9]{4,6}$/.test(v)){erro='Use de 4 a 6 números.';pinta();return;}
        await definirSenha(v);liberadoAte=Date.now()+15*60000;
        $('#folha').classList.remove('on');aoAcertar();return;
      }
      const falta=Math.ceil(esperaDoPin()/1000);
      if(falta>0){erro='Muitas tentativas. Espere '+(falta>=60?Math.ceil(falta/60)+' min':falta+' s')+' para tentar de novo.';pinta();return;}
      if(await conferirSenha(v)){liberadoAte=Date.now()+15*60000;$('#folha').classList.remove('on');aoAcertar();}
      else{const f2=Math.ceil(esperaDoPin()/1000);erro=f2>0?'Muitas tentativas. Espere '+(f2>=60?Math.ceil(f2/60)+' min':f2+' s')+' para tentar de novo.':'Senha errada. Tente de novo.';pinta();}
    };
    $('#pin-ok').addEventListener('click',tenta);
    campo.addEventListener('keydown',e=>{if(e.key==='Enter')tenta();});
    $('#pin-cancela').addEventListener('click',()=>{$('#folha').classList.remove('on');});
  };
  pinta();
}
function comSenha(fn){
  if(respLiberado()){fn();return;}
  pedirSenha('Área do responsável','Digite a senha para ver os relatórios e mexer nos perfis.',fn,false);
}
function alertaResp(msg){
  const cx=$('#resp-aviso');
  if(cx){cx.innerHTML='<div class="aviso-ok">'+msg+'</div>';return;}
  const d=document.createElement('div');d.className='aviso-voz';
  d.innerHTML='<span>'+msg+'</span>';document.body.appendChild(d);
  setTimeout(()=>{d.classList.add('sai');setTimeout(()=>d.remove(),400);},5200);
}

