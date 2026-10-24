/* ---------- voz e som (voz gravada: só liga/desliga, velocidade e pacotes para jogar sem internet) ---------- */
function telaVoz(){
  let h='<div class="perfil-in">';
  h+='<p class="galeria-intro">A voz do Bobby é gravada e vem junto com o app. Aqui você liga ou desliga os sons e escolhe a velocidade da fala.</p>';
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
  const g=audioGuardado();
  h+='<div class="mundos-lista" id="pacotes-voz">';
  ['core','mat','pt','en'].forEach(p=>{
    const ok=g.pacotes&&g.pacotes[p]&&g.formato===audioFormato();
    h+='<div class="linha-mundo"><div class="mtx"><b>'+NOME_PACOTE[p].replace(/^./,c=>c.toUpperCase())+'</b>'+
       '<span class="sub-l">'+(audioIndiceCheio()?audioMB(audioTamanhoPacote(p)):'tamanho indisponível')+' · '+(ok?'guardado neste aparelho':'ainda não guardado')+'</span></div></div>';
  });
  h+='</div>';
  h+='<div class="perfil-bts"><button class="btn laranja" id="baixar-vozes">'+IC.baixar+' Guardar todas as vozes</button></div><div id="voz-aviso"></div>';
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
  const bx=$('#baixar-vozes');
  if(bx)bx.addEventListener('click',async()=>{
    bx.disabled=true;
    const av=$('#voz-aviso');
    await audioIniciar();
    let falhas=0;
    for(const p of ['core','mat','pt','en']){
      const r2=await audioBaixarPacote(p,(a,b)=>{av.innerHTML='<div class="aviso-ok">Guardando '+NOME_PACOTE[p]+': '+a+' de '+b+'</div>';},false);
      if(r2&&!r2.ok)falhas++;
    }
    av.innerHTML='<div class="aviso-ok">'+(falhas?'Alguns arquivos não baixaram. Tente de novo com internet.':'Pronto! As vozes estão guardadas neste aparelho.')+'</div>';
    registrarEvento('config_mudou',{chave:'vozes_offline'});
    bx.disabled=false;
  });
}

/* ---------- segurança e dados do perfil ---------- */
/* A senha guarda a AREA DO RESPONSAVEL (relatorios, apagar perfis, backup).
   Nao e criptografia de verdade — e uma tranca simples para a crianca nao entrar
   sozinha. Nenhum dado sai deste aparelho. */
function temSenha(){return !!(STORE.senha&&STORE.senha.h);}
function embaralha(pin){
  /* hash simples e estavel; guardamos so o resultado, nunca a senha em si */
  const sal=STORE.senha&&STORE.senha.s?STORE.senha.s:('s'+Math.random().toString(36).slice(2,10));
  let h=5381;const t=sal+'|'+String(pin);
  for(let i=0;i<t.length;i++)h=((h<<5)+h+t.charCodeAt(i))>>>0;
  for(let v=0;v<5000;v++)h=((h<<5)+h+(v%97))>>>0;
  return {s:sal,h:h.toString(36)};
}
function definirSenha(pin){STORE.senha=null;STORE.senha=embaralha(pin);salvarStore();}
function conferirSenha(pin){
  if(!temSenha())return true;
  const sal=STORE.senha.s;
  let h=5381;const t=sal+'|'+String(pin);
  for(let i=0;i<t.length;i++)h=((h<<5)+h+t.charCodeAt(i))>>>0;
  for(let v=0;v<5000;v++)h=((h<<5)+h+(v%97))>>>0;
  return h.toString(36)===STORE.senha.h;
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
    const tenta=()=>{
      const v=(campo.value||'').trim();
      if(criando){
        if(!/^[0-9]{4,6}$/.test(v)){erro='Use de 4 a 6 números.';pinta();return;}
        definirSenha(v);liberadoAte=Date.now()+15*60000;
        $('#folha').classList.remove('on');aoAcertar();return;
      }
      if(conferirSenha(v)){liberadoAte=Date.now()+15*60000;$('#folha').classList.remove('on');aoAcertar();}
      else{erro='Senha errada. Tente de novo.';pinta();}
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

