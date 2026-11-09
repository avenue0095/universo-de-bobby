/* ---------- 1D · teclado completo e mouse no computador ----------
   Pergunta: 1 a 4 escolhem (ligacoes.js), setas andam entre as alternativas, Enter ou Espaço conferem e seguem, Esc sai da fase.
   Mapa: setas rolam, Enter abre a próxima fase, arrastar com o mouse rola o mapa. Esc fecha folha, tela do perfil e escolha de planeta.
   Nada disso muda o celular: lá tudo continua no toque. */
function telaAbertaPorCima(){
  if($('#folha').classList.contains('on'))return 'folha';
  if($('#licao').classList.contains('on'))return 'licao';
  if($('#perfil').classList.contains('on'))return 'perfil';
  if($('#materias').classList.contains('on'))return 'materias';
  if($('#perfis').classList.contains('on'))return 'perfis';
  if($('#modal')&&$('#modal').classList.contains('on'))return 'modal';
  return '';
}
const ehCampo=el=>!!el&&(/^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName)||el.isContentEditable);
function teclaGlobal(e){
  if(e.defaultPrevented||e.altKey||e.ctrlKey||e.metaKey||ehCampo(e.target))return;
  const t=telaAbertaPorCima();
  if(e.key==='Escape'){
    if(t==='folha'){fecharFolha();e.preventDefault();return;}
    if(t==='licao'){if($('#revisao').classList.contains('on')){$('#revisao').classList.remove('on');}else fecharLicao();e.preventDefault();return;}
    if(t==='perfil'){if(typeof provando!=='undefined')provando=null;fecharPerfil2();e.preventDefault();return;}
    if(t==='materias'){fecharMaterias();e.preventDefault();return;}
    return;
  }
  if(t==='licao'){
    if($('#revisao').classList.contains('on'))return;
    /* história, aula e fim: Enter ou Espaço apertam o botão de baixo (se o foco não estiver em outro botão) */
    if(LIC.etapa!=='questao'){
      if((e.key==='Enter'||e.key===' ')&&!(e.target&&e.target.closest&&e.target.closest('button,[role="button"],summary,a'))&&!$('#acao').disabled){$('#acao').click();e.preventDefault();}
      return;
    }
    const q=LIC.qs[LIC.i];
    if(!LIC.conferido&&q&&q.type==='mc'&&!(typeof temTelaPropria==='function'&&temTelaPropria(q))&&/^Arrow(Up|Down|Left|Right)$/.test(e.key)){
      const alts=[...$('#palco').querySelectorAll('.alt')];if(!alts.length)return;
      const i=alts.findIndex(b=>b.classList.contains('sel'));
      const d=/Up|Left/.test(e.key)?-1:1,n=alts[(i<0?(d>0?0:alts.length-1):(i+d+alts.length)%alts.length)];
      n.click();try{n.focus({preventScroll:false});}catch(x){}
      e.preventDefault();return;
    }
    /* Espaço confere e segue quando o foco não está num botão (no botão, o Espaço já aperta o próprio botão) */
    if(e.key===' '&&!(e.target&&e.target.closest&&e.target.closest('button,[role="button"],summary'))&&!$('#acao').disabled){$('#acao').click();e.preventDefault();}
    return;
  }
  if(t)return;
  /* mapa */
  if(e.key==='ArrowDown'||e.key==='ArrowUp'){window.scrollBy({top:(e.key==='ArrowDown'?1:-1)*Math.round(innerHeight*.35),behavior:'smooth'});e.preventDefault();return;}
  if(e.key==='Enter'&&!(e.target&&e.target.closest&&e.target.closest('button,a,summary'))){
    const p=proxima();if(p){abrirLicao(p[0],p[1]);e.preventDefault();}
  }
}
/* arrastar o mapa com o mouse (só mouse; no toque o navegador já rola) */
function ligarArrastoDoMapa(){
  const tela=$('#tela');if(!tela)return;
  let y0=null,s0=0,moveu=false;
  tela.addEventListener('pointerdown',e=>{
    if(e.pointerType!=='mouse'||e.button!==0||(e.target.closest&&e.target.closest('button,a,summary,input,.bt')))return;
    y0=e.clientY;s0=window.scrollY;moveu=false;
  });
  window.addEventListener('pointermove',e=>{
    if(y0===null)return;
    const dy=e.clientY-y0;if(Math.abs(dy)>4){moveu=true;tela.classList.add('arrastando');}
    if(moveu)window.scrollTo(0,s0-dy);
  });
  const fim=()=>{y0=null;tela.classList.remove('arrastando');};
  window.addEventListener('pointerup',fim);window.addEventListener('pointercancel',fim);
}
document.addEventListener('keydown',teclaGlobal);
ligarArrastoDoMapa();
