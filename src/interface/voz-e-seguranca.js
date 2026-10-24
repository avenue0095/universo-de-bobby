/* ---------- voz e som ---------- */
function telaVoz(){
  const pt=vozesDe('pt-BR'),en=vozesDe('en-US');
  const REGIAO={'pt-br':'português do Brasil','pt-pt':'português de Portugal',
    'en-us':'inglês americano','en-gb':'inglês britânico','en-au':'inglês australiano',
    'en-ie':'inglês irlandês','en-za':'inglês sul-africano','en-in':'inglês indiano'};
  const nomeCurto=v=>{
    /* nomes vêm como "Eddy (Português (Brasil))" — corta tudo do primeiro parêntese */
    const i=String(v.name||'').indexOf('(');
    return (i>0?String(v.name).slice(0,i):String(v.name||'')).trim()||'Voz sem nome';
  };
  const detalhe=v=>{
    const e=[];
    const reg=REGIAO[idioma(v)];
    if(reg)e.push(reg);
    if(/premium|enhanced|neural|natural/i.test(v.name))e.push('melhor qualidade');
    if(!v.localService)e.push('precisa de internet');
    return e.join(' · ')||idioma(v);
  };
  const lista=(vs,atual,campo)=>{
    if(!vs.length)return '<p class="galeria-intro">Este aparelho não tem nenhuma voz instalada para este idioma.</p>';
    let h='<div class="vozes">';
    h+='<button class="voz-op'+(!atual?' on':'')+'" data-voz="'+campo+'|">'+
       '<b>Voz padrão do aparelho</b><span>a mesma de sempre</span></button>';
    /* quando dois nomes iguais aparecem, o detalhe do lado desempata */
    const vistos={};vs.forEach(v=>{const n=nomeCurto(v);vistos[n]=(vistos[n]||0)+1;});
    vs.forEach(v=>{
      const sel=atual===v.name,n=nomeCurto(v);
      h+='<button class="voz-op'+(sel?' on':'')+'" data-voz="'+campo+'|'+
         String(v.name).replace(/"/g,'&quot;')+'"><b>'+n+'</b>'+
         '<span>'+detalhe(v)+'</span></button>';
    });
    return h+'</div>';
  };

  let h='<div class="perfil-in">';
  h+='<p class="galeria-intro">A voz que lê as aulas vem do próprio aparelho — cada celular tem as suas. '+
     'Toque numa opção para ouvir e ela já fica escolhida.</p>';

  h+='<h2 class="sec">Voz do português</h2>'+lista(pt,S.vozPt,'pt');
  h+='<h2 class="sec">Voz do inglês</h2>';
  if(!en.length)h+='<p class="galeria-intro">Nenhuma voz em inglês instalada. '+
     'No iPhone: <b>Ajustes → Acessibilidade → Conteúdo Falado → Vozes → Inglês</b>. '+
     'No Android: <b>Config. → Idiomas → Conversão de texto em voz</b>.</p>';
  h+=lista(en,S.vozEn,'en');

  const v=Math.round((+S.velocidade||1)*100);
  h+='<h2 class="sec">Velocidade da fala</h2>';
  h+='<div class="velocidade"><input type="range" id="vel" min="60" max="130" step="5" value="'+v+'">'+
     '<div class="vel-tx"><span>mais devagar</span><b id="vel-n">'+v+'%</b><span>mais rápido</span></div>'+
     '<button class="btn fantasma" id="vel-teste">Ouvir uma frase</button></div>';

  h+='<div class="perfil-bts"><button class="btn fantasma" id="volta-voz">Voltar ao perfil</button></div></div>';

  $('#perfil').innerHTML='<div class="rev-topo"><button class="icobtn" id="volta-voz2" aria-label="Voltar">'+
    IC.volta+'</button><h2>Voz e som</h2></div><div class="rev-corpo">'+h+'</div>';
  $('#perfil').classList.add('on');document.body.style.overflow='hidden';
  $('#volta-voz').addEventListener('click',telaPerfil);
  $('#volta-voz2').addEventListener('click',telaPerfil);

  $('#perfil').querySelectorAll('[data-voz]').forEach(b=>b.addEventListener('click',()=>{
    const i=b.dataset.voz.indexOf('|');
    const campo=b.dataset.voz.slice(0,i),nome=b.dataset.voz.slice(i+1);
    if(campo==='pt'){S.vozPt=nome;salvar();falarPedido('Oi! Eu sou o Bobby. Vamos aprender juntos?');}
    else{S.vozEn=nome;salvar();falarPedido('Hello! My name is Bobby. Nice to meet you!','en-US');}
    telaVoz();
  }));
  const r=$('#vel');
  if(r){
    r.addEventListener('input',()=>{$('#vel-n').textContent=r.value+'%';});
    r.addEventListener('change',()=>{S.velocidade=(+r.value)/100;salvar();
      falarPedido('Assim está bom para você acompanhar?');});
  }
  const t=$('#vel-teste');
  if(t)t.addEventListener('click',()=>falarPedido('Contar é apontar para cada coisa e falar um número em voz alta.'));
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
    $('#modal').innerHTML='<div class="modal-in senha-in">'+
      '<h2>'+titulo+'</h2><p class="perfis-sub">'+texto+'</p>'+
      '<input id="campo-pin" class="campo pin" type="password" inputmode="numeric" '+
      'autocomplete="off" maxlength="6" placeholder="••••" aria-label="Senha de 4 números">'+
      (erro?'<p class="erro-pin">'+erro+'</p>':'')+
      '<div class="modal-bts"><button class="link" id="pin-cancela">Cancelar</button>'+
      '<button class="btn" id="pin-ok">'+(criando?'Criar senha':'Entrar')+'</button></div></div>';
    $('#modal').classList.add('on');
    const campo=$('#campo-pin');campo.focus();
    const tenta=()=>{
      const v=(campo.value||'').trim();
      if(criando){
        if(!/^[0-9]{4,6}$/.test(v)){erro='Use de 4 a 6 números.';pinta();return;}
        definirSenha(v);liberadoAte=Date.now()+15*60000;
        $('#modal').classList.remove('on');aoAcertar();return;
      }
      if(conferirSenha(v)){liberadoAte=Date.now()+15*60000;$('#modal').classList.remove('on');aoAcertar();}
      else{erro='Senha errada. Tente de novo.';pinta();}
    };
    $('#pin-ok').addEventListener('click',tenta);
    campo.addEventListener('keydown',e=>{if(e.key==='Enter')tenta();});
    $('#pin-cancela').addEventListener('click',()=>{$('#modal').classList.remove('on');});
  };
  pinta();
}
function comSenha(fn){
  if(respLiberado()){fn();return;}
  pedirSenha('Área do responsável','Digite a senha para ver os relatórios e mexer nos perfis.',fn,false);
}
/* backup: leva o perfil inteiro para outro aparelho */
function baixarPerfil(){
  const p=STORE.perfis[STORE.atual];
  if(!p)return;
  const pacote={app:'universo-de-bobby',versao:VERSAO_DADOS,quando:new Date().toISOString(),
    perfil:{nome:p.nome,cor:p.cor,dados:estadoDe(p.dados)}};
  const nome='bobby-'+String(p.nome||'perfil').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')+'.json';
  entregar(nome,JSON.stringify(pacote,null,1));
}
function restaurarPerfil(){
  const ent=document.createElement('input');
  ent.type='file';ent.accept='application/json,.json';
  ent.addEventListener('change',()=>{
    const f=ent.files&&ent.files[0];if(!f)return;
    const fr=new FileReader();
    fr.onload=()=>{
      let pac=null;
      try{pac=JSON.parse(fr.result);}catch(e){}
      if(!pac||pac.app!=='universo-de-bobby'||!pac.perfil){
        alertaResp('Esse arquivo não é um backup do Universo de Bobby.');return;
      }
      const d=estadoDe(pac.perfil.dados);
      const nome=String(pac.perfil.nome||'Jogador').slice(0,18);
      STORE.perfis.push({id:'p'+Date.now().toString(36),nome:nome,
        cor:CORES.indexOf(pac.perfil.cor)>=0?pac.perfil.cor:CORES[STORE.perfis.length%CORES.length],
        criado:Date.now(),dados:d});
      salvarStore();
      alertaResp('Perfil <b>'+nome+'</b> restaurado. Ele aparece na tela "Quem vai jogar?".');
    };
    fr.readAsText(f);
  });
  ent.click();
}
function alertaResp(msg){
  const cx=$('#resp-aviso');
  if(cx){cx.innerHTML='<div class="aviso-ok">'+msg+'</div>';return;}
  const d=document.createElement('div');d.className='aviso-voz';
  d.innerHTML='<span>'+msg+'</span>';document.body.appendChild(d);
  setTimeout(()=>{d.classList.add('sai');setTimeout(()=>d.remove(),400);},5200);
}

