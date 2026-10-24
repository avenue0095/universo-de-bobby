/* ---------- telas do ciclo diário (versão funcional e sóbria; o acabamento visual vem com a arte) ----------
   Rotina de hoje, bilhete do Bobby, baú, "Por hoje chega", congeladores, barra de baixo e controles do responsável.
   Texto: português do Brasil, "você", frases curtas, sem travessão. O Bobby só incentiva: nunca culpa, cobra ou fica triste.
   Cores: só tokens do DESIGN.md (var(--cor-*)); nada de hex aqui. */
Object.assign(IC,{
 gelo:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M12 2v20M3.3 7l17.4 10M20.7 7 3.3 17M9 3.5l3 2.5 3-2.5M9 20.5l3-2.5 3 2.5"/></svg>',
 bau:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 10a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v2H3v-2Zm0 3h7v1.5h4V13h7v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-5Z"/></svg>',
 casa:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3 2 12h3v8h5v-5h4v5h5v-8h3L12 3Z"/></svg>',
 pessoa:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0 2c-5 0-9 2.6-9 5.6V22h18v-2.4c0-3-4-5.6-9-5.6Z"/></svg>',
 bobby:'<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="6" cy="6" r="3"/><circle cx="18" cy="6" r="3"/><rect x="3.5" y="5.5" width="17" height="15" rx="7.5"/><circle cx="9" cy="12.5" r="1.4" fill="var(--cor-superficie)"/><circle cx="15" cy="12.5" r="1.4" fill="var(--cor-superficie)"/></svg>'
});

/* ---------- folha (diálogo) ---------- */
function abrirFolha(html){
  const f=$('#folha');
  f.innerHTML=html;f.classList.add('on');
  const b=f.querySelector('button');if(b&&b.focus)try{b.focus();}catch(e){}
}
function fecharFolha(){$('#folha').classList.remove('on');$('#folha').innerHTML='';}

/* ---------- topo: ofensiva e moedas ---------- */
function textoOfensiva(){
  const o=S.ofensiva;
  if(o.descansando)return 'Ofensiva descansando';
  return 'Ofensiva: '+o.atual+(o.atual===1?' dia':' dias');
}

/* ---------- Rotina de hoje (cartão do mapa) ---------- */
function rotinaHTML(){
  garantirDia();
  const d=S.diario,meta=perguntasMeta();
  const pct=Math.min(100,Math.round(d.perguntas/meta*100));
  let h='<section class="rotina" aria-label="Rotina de hoje"><div class="rotina-topo"><h2>Rotina de hoje</h2>';
  if(S.config.ofensivaLigada){
    h+='<span class="rotina-of'+(S.ofensiva.descansando?' descansa':'')+'">'+IC.fogo+textoOfensiva()+'</span>';
  }
  h+='</div>';
  h+='<div class="meta-linha"><div class="meta-barra" role="progressbar" aria-valuemin="0" aria-valuemax="'+meta+'" aria-valuenow="'+Math.min(meta,d.perguntas)+
     '" aria-label="Meta do dia"><i style="width:'+pct+'%"></i></div><span>'+Math.min(d.perguntas,meta)+' de '+meta+' perguntas</span></div>';
  h+='<p class="rotina-vivo">'+(d.blocos>0?'Seu dia está vivo. Você já jogou hoje.':'Jogue uma fase e o dia fica vivo.')+'</p>';
  if(S.config.missoesLigadas&&d.missoes.length){
    h+='<ul class="missoes">';
    d.missoes.forEach(m=>{
      h+='<li class="'+(m.ok?'ok':'')+'"><span class="mk">'+(m.ok?IC.certo:'')+'</span><span class="mt">'+textoDaMissao(m)+'</span><small>'+m.prog+' de '+m.alvo+'</small></li>';
    });
    h+='</ul>';
    if(d.estrela)h+='<p class="rotina-estrela">'+IC.estrela+' Estrela do dia conquistada!</p>';
  }
  h+='<div class="rotina-acoes">';
  if(bauPronto())h+='<button class="btn-acao" id="rt-bau">'+IC.bau+' Abrir o baú do dia</button>';
  if(d.kit===1)h+='<button class="btn-acao" id="rt-kit">Pegar o Kit de volta</button>';
  const rev=revisaoDoDiaPronta();
  if(rev>0&&revisaoRestanteDoDia()>0)h+='<button class="btn-sec" id="rt-rev">Revisão do dia · '+rev+' pergunta'+(rev>1?'s':'')+'</button>';
  h+='</div>';
  h+='<p class="rotina-rodape">';
  if(S.config.ofensivaLigada)h+='<span class="gelo-chip" title="Congeladores guardam sua sequência">'+IC.gelo+'Congeladores: '+S.ofensiva.congeladores+'</span> ';
  h+=d.bau.aberto?'<span>Amanhã no baú: '+categoriaDoBau(Math.max(1,S.ofensiva.atual)+1)+'</span></p></section>'
    :'<span>No baú de hoje: '+categoriaDoBau(Math.max(1,S.ofensiva.atual))+'</span></p></section>';
  return h;
}
function ligarRotina(){
  const bau=$('#rt-bau');if(bau)bau.addEventListener('click',mostrarBau);
  const kit=$('#rt-kit');if(kit)kit.addEventListener('click',()=>{
    const itens=pegarKit();renderTrilha();
    if(itens)abrirFolha('<div class="folha-in"><div class="folha-bobby">'+MASC('feliz')+'</div><h2>Seu Kit de volta</h2><ul class="folha-lista">'+
      itens.map(i=>'<li>'+escapa(i.n)+'</li>').join('')+'</ul><div class="folha-bts"><button class="btn-acao" id="fl-ok">Continuar</button></div></div>');
    const ok=$('#fl-ok');if(ok)ok.addEventListener('click',fecharFolha);
  });
  const rev=$('#rt-rev');if(rev)rev.addEventListener('click',abrirRevisaoDia);
}

/* ---------- bilhete do Bobby (uma vez por dia) ---------- */
function mostrarEntradaDoDia(){
  if(STORE.atual<0)return;
  if(!STORE.avisoVisto){mostrarAvisoMigracao(mostrarBilhete);return;}
  mostrarBilhete();
}
function mostrarAvisoMigracao(depois){
  STORE.avisoVisto=true;salvarStore();
  abrirFolha('<div class="folha-in"><div class="folha-bobby">'+MASC('oi')+'</div><h2>O Bobby ganhou novidades</h2>'+
    '<p>Seu progresso está todo aqui. Você também ganhou um congelador para guardar sua sequência.</p>'+
    '<div class="folha-bts"><button class="btn-acao" id="fl-ok">Vamos lá</button></div></div>');
  $('#fl-ok').addEventListener('click',()=>{fecharFolha();if(depois)depois();});
}
function mostrarBilhete(){
  const b=bilheteDeHoje();
  if(!b)return;
  abrirFolha('<div class="folha-in bilhete"><div class="folha-bobby">'+MASC('oi')+'</div><h2>Um bilhete do Bobby</h2>'+
    '<p class="bilhete-texto">'+b.texto+'</p>'+
    '<ul class="folha-lista"><li>No baú de amanhã: '+b.presente+'</li><li>'+b.pronto+'</li></ul>'+
    '<div class="folha-bts"><button class="btn-sec" id="fl-ouvir" aria-label="Ouvir o bilhete">'+IC.falar+' Ouvir</button>'+
    '<button class="btn-acao" id="fl-ok">Vamos jogar</button></div></div>');
  $('#fl-ok').addEventListener('click',()=>{marcarBilheteVisto();fecharFolha();});
  $('#fl-ouvir').addEventListener('click',()=>falarPedido(b.texto));
  if(ehF78())falarDepois2(500,b.texto);
}
function falarDepois2(ms,t){audioAgendar(()=>{if($('#folha').classList.contains('on'))falar(t);},ms);}

/* ---------- baú do dia (sem sorteio) ---------- */
function mostrarBau(){
  garantirDia();
  if(S.diario.bau.aberto){mostrarBauAberto();return;}
  if(!bauPronto())return;
  const dia=Math.max(1,S.ofensiva.atual);
  abrirFolha('<div class="folha-in"><div class="bau-fig" aria-hidden="true">'+IC.bau+'</div><h2>Baú do dia</h2>'+
    '<p>Você completou a meta de hoje. Dentro do baú tem '+categoriaDoBau(dia)+'.</p>'+
    '<div class="folha-bts"><button class="btn-acao" id="fl-abrir">Abrir o baú</button></div></div>');
  $('#fl-abrir').addEventListener('click',()=>{abrirBau();salvar();mostrarBauAberto();});
}
function mostrarBauAberto(){
  const b=S.diario.bau;
  abrirFolha('<div class="folha-in"><div class="bau-fig aberto" aria-hidden="true">'+IC.bau+'</div><h2>Você ganhou</h2>'+
    '<ul class="folha-lista premios">'+b.itens.map(i=>'<li>'+escapa(i.n)+'</li>').join('')+'</ul>'+
    '<div class="folha-bts"><button class="btn-acao" id="fl-ok">Continuar</button></div></div>');
  $('#fl-ok').addEventListener('click',()=>{
    fecharFolha();pintarTopo();
    if(paradaPendente())mostrarParada(false);else renderTrilha();
  });
}

/* ---------- "Por hoje chega!" ---------- */
function mostrarParada(limite){
  garantirDia();
  if(limite){
    abrirFolha('<div class="folha-in"><div class="folha-bobby">'+MASC('feliz')+'</div><h2>Por hoje chega!</h2>'+
      '<p>Você fez um ótimo trabalho. Amanhã tem mais.</p><p>Quando voltar, seu bilhete estará aqui.</p>'+
      '<div class="folha-bts"><button class="btn-acao" id="fl-ok">Até amanhã</button>'+
      '<button class="link-resp" id="fl-resp">Sou o responsável</button></div></div>');
    $('#fl-ok').addEventListener('click',()=>{fecharFolha();renderTrilha();});
    $('#fl-resp').addEventListener('click',()=>{
      fecharFolha();
      comSenha(()=>{S.diario.liberados=(S.diario.liberados||0)+1;salvar();renderTrilha();});
    });
    return;
  }
  abrirFolha('<div class="folha-in"><div class="folha-bobby">'+MASC('feliz','pula')+'</div><h2>Por hoje chega!</h2>'+
    '<p>Você fez um ótimo trabalho.</p><p>Amanhã tem mais. O baú de amanhã já está guardado.</p><p>Quando voltar, seu bilhete estará aqui.</p>'+
    '<div class="folha-bts par"><button class="btn-acao" id="fl-fim">Terminar por hoje</button>'+
    '<button class="btn-acao" id="fl-segue">Continuar explorando</button></div></div>');
  if(ehF78())falarDepois2(400,'Por hoje chega! Você fez um ótimo trabalho.');
  $('#fl-fim').addEventListener('click',()=>{
    registrarParada('terminar');
    abrirFolha('<div class="folha-in"><div class="folha-bobby">'+MASC('feliz')+'</div><h2>Até amanhã!</h2>'+
      '<p>Pode fechar o app. O Bobby guarda tudo para você.</p>'+
      '<div class="folha-bts"><button class="btn-sec" id="fl-mapa">Ver o mapa</button></div></div>');
    $('#fl-mapa').addEventListener('click',()=>{fecharFolha();renderTrilha();});
  });
  $('#fl-segue').addEventListener('click',()=>{registrarParada('continuar');fecharFolha();renderTrilha();});
}
/* chamado quando a lição fecha: a parada aparece uma vez por dia, depois que o baú foi aberto */
function depoisDeFecharLicao(){
  garantirDia();
  if(paradaPendente())mostrarParada(false);
}

/* ---------- fim de fase: ofensiva, congelador e baú ---------- */
function blocoFimHTML(bloco){
  let h='';
  if(bloco&&bloco.contou){
    const m=bloco.mudou||{};
    if(S.config.ofensivaLigada){
      let t='';
      if(m.recuperou)t='Sua sequência foi recuperada: '+S.ofensiva.atual+' dias.';
      else if(m.voltouPelaMetade)t='Sua sequência voltou com tudo: '+S.ofensiva.atual+(S.ofensiva.atual===1?' dia':' dias')+'. O seu recorde continua guardado.';
      else if(m.primeiroDoDia)t=textoOfensiva()+'.';
      if(m.ganhouCongelador)t+=' Você ganhou um congelador!';
      if(t)h+='<p class="fim-of">'+IC.fogo+' '+t.trim()+'</p>';
    }
    if(bauPronto())h+='<div class="fim-bau"><b>O baú do dia está pronto!</b><button class="btn-acao" id="fim-abrir-bau">'+IC.bau+' Abrir o baú</button></div>';
    else if(S.diario.metaOk&&!S.diario.bau.aberto)h+='';
    if(S.diario.estrela&&!S.diario._estrelaDita){S.diario._estrelaDita=true;h+='<p class="fim-of">'+IC.estrela+' Estrela do dia conquistada!</p>';}
  }
  return h;
}
function ligarBlocoFim(){
  const b=$('#fim-abrir-bau');if(b)b.addEventListener('click',mostrarBau);
}

/* ---------- barra de baixo ---------- */
function ligarBarra(){
  const mapa=$('#bb-mapa'),pers=$('#bb-pers'),gal=$('#bb-gal'),perfil=$('#bb-perfil');
  if(mapa)mapa.addEventListener('click',()=>{
    if($('#perfil').classList.contains('on'))fecharPerfil2();
    if($('#galeria').classList.contains('on'))fecharGaleria();
    window.scrollTo&&window.scrollTo(0,0);
  });
  /* Meu personagem: 1 toque até o guarda-roupa */
  if(pers)pers.addEventListener('click',()=>{lojaOrigem='barra';telaLoja();});
  if(gal)gal.addEventListener('click',()=>abrirGaleria(false));
  if(perfil)perfil.addEventListener('click',telaPerfil);
}

/* ---------- abertura e fechamento da sessão ---------- */
let SESSAO={ini:Date.now(),blocos0:0};
function iniciarCiclo(){
  ligarBarra();
  let standalone=0;
  try{standalone=((window.matchMedia&&matchMedia('(display-mode: standalone)').matches)||navigator.standalone)?1:0;}catch(e){}
  registrarEvento('app_aberto',{instalado:standalone});
  SESSAO.blocos0=(S&&S.diario)?S.diario.blocos:0;
  const sai=()=>{
    try{
      if(STORE.atual<0)return;
      gravarEspera();salvar();
      registrarEvento('sessao_fim',{seg:Math.round((Date.now()-SESSAO.ini)/1000),blocos:Math.max(0,S.diario.blocos-SESSAO.blocos0)});
    }catch(e){}
  };
  document.addEventListener('visibilitychange',()=>{
    if(document.hidden)sai();
    else{SESSAO.ini=Date.now();SESSAO.blocos0=S.diario.blocos;if(STORE.atual>=0){garantirDia();salvar();}}
  });
  window.addEventListener('pagehide',sai);
}

/* ---------- controles do responsável (ficam atrás da senha, na tela do responsável) ---------- */
function controlesHTML(){
  const c=S.config,hj=hoje();
  const opt=(vals,atual,campo,rot)=>vals.map(v=>'<button class="chip-ctl'+(String(v)===String(atual)?' on':'')+'" data-cfg="'+campo+'" data-v="'+v+'">'+(rot?rot(v):v)+'</button>').join('');
  const pausada=c.pausaAte&&c.pausaAte>=hj;
  const dsem=['dom','seg','ter','qua','qui','sex','sáb'];
  let h='<h2 class="sec">Controles do dia a dia</h2><div class="ctl">';
  h+='<div class="ctl-linha"><b>Meta do dia</b><div>'+opt([5,10,15],c.metaMin,'metaMin',v=>v+' min')+'</div><small>Contada em perguntas: cerca de '+perguntasMeta()+' hoje.</small></div>';
  h+='<div class="ctl-linha"><b>Revisão por dia</b><div>'+opt([5,8,12],c.revisaoPorDia,'revisaoPorDia',v=>v+' perguntas')+'</div><small>No máximo 10 revisões por dia.</small></div>';
  h+='<div class="ctl-linha"><b>Limite de blocos por dia</b><div>'+opt(['','2','3','4','6','8'],c.limiteBlocosDia||'','limiteBlocosDia',v=>v?v:'Sem limite')+'</div><small>Ao chegar no limite, só o responsável libera mais um bloco.</small></div>';
  h+='<div class="ctl-linha"><b>Dias livres da ofensiva</b><div>'+dsem.map((n,i)=>'<button class="chip-ctl'+(c.diasLivres.indexOf(i)>=0?' on':'')+'" data-dia="'+i+'">'+n+'</button>').join('')+'</div><small>Nesses dias a ofensiva não perde nada.</small></div>';
  h+='<div class="ctl-linha"><b>Pausar a ofensiva</b><div>'+
     '<button class="chip-ctl'+(!pausada?' on':'')+'" data-pausa="0">Sem pausa</button>'+
     '<button class="chip-ctl" data-pausa="3">3 dias</button><button class="chip-ctl" data-pausa="7">7 dias</button></div>'+
     '<small>'+(pausada?'Pausada até '+c.pausaAte.split('-').reverse().join('/')+'.':'Máximo de 7 dias.')+'</small></div>';
  h+='<div class="ctl-linha"><b>Ofensiva</b><div>'+opt([1,0],c.ofensivaLigada?1:0,'ofensivaLigada',v=>v?'Ligada':'Desligada')+'</div></div>';
  h+='<div class="ctl-linha"><b>Missões do dia</b><div>'+opt([1,0],c.missoesLigadas?1:0,'missoesLigadas',v=>v?'Ligadas':'Desligadas')+'</div></div>';
  return h+'</div>';
}
function ligarControles(refaz){
  const c=S.config;
  const muda=(chave)=>{salvar();registrarEvento('config_mudou',{chave:chave});refaz();};
  $('#perfil').querySelectorAll('[data-cfg]').forEach(b=>b.addEventListener('click',()=>{
    const k=b.dataset.cfg,v=b.dataset.v;
    if(k==='metaMin'||k==='revisaoPorDia')c[k]=+v;
    else if(k==='limiteBlocosDia')c[k]=v?+v:null;
    else c[k]=v==='1';
    if(k==='missoesLigadas'){S.diario.missoes=c.missoesLigadas?gerarMissoes(hoje()):[];}
    muda(k);
  }));
  $('#perfil').querySelectorAll('[data-dia]').forEach(b=>b.addEventListener('click',()=>{
    const i=+b.dataset.dia,p=c.diasLivres.indexOf(i);
    if(p>=0)c.diasLivres.splice(p,1);else c.diasLivres.push(i);
    muda('diasLivres');
  }));
  $('#perfil').querySelectorAll('[data-pausa]').forEach(b=>b.addEventListener('click',()=>{
    const n=+b.dataset.pausa;c.pausaAte=n?somaDias(hoje(),n):'';muda('pausaAte');
  }));
}

/* ---------- cartão da semana e medidor ---------- */
function semanaHTML(){
  const r=resumoSemana(S.stats,hoje());
  let h='<h2 class="sec">Esta semana</h2><div class="stats">'+
    stat(IC.fogo,r.dias+' de 7','dias com atividade')+
    stat(IC.estrela,r.min+' min','de atividade')+
    stat(IC.bandeira,r.perguntas,'perguntas feitas')+'</div>';
  h+='<p class="galeria-intro">'+r.revisoes+' revisão'+(r.revisoes===1?'':'ões')+' feita'+(r.revisoes===1?'':'s')+
     (r.pct!==null?' e '+r.pct+'% de acerto nas perguntas da semana.':'.')+'</p>';
  h+='<div class="perfil-bts"><button class="btn fantasma" id="copia-resumo">Copiar o resumo da semana</button></div><div id="resumo-aviso"></div>';
  return h;
}
function textoDoResumo(){
  const r=resumoSemana(S.stats,hoje());
  const p=proxima();
  return 'Resumo da semana de '+(perfilAtual().nome||'seu jogador')+' no Universo de Bobby: '+r.dias+' de 7 dias com atividade, '+r.min+
    ' minutos, '+r.perguntas+' perguntas'+(r.pct!==null?', '+r.pct+'% de acerto':'')+'. '+r.revisoes+' revisões feitas.'+
    (p?' Próxima fase: '+UNITS[p[0]].lessons[p[1]].title+'.':'');
}
function ligarSemana(){
  const b=$('#copia-resumo');if(!b)return;
  b.addEventListener('click',()=>{
    const t=textoDoResumo();
    registrarEvento('relatorio_visto',{semana:semanaIso(hoje())});
    const fim=ok=>{$('#resumo-aviso').innerHTML='<div class="aviso-ok">'+(ok?'Resumo copiado. Cole onde quiser.':'Não consegui copiar. Selecione o texto: '+escapa(t))+'</div>';};
    try{
      if(navigator.share){navigator.share({text:t}).catch(()=>{});return;}
      if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(t).then(()=>fim(true),()=>fim(false));return;}
    }catch(e){}
    fim(false);
  });
}
function medidorHTML(){
  const pid=perfilAtual().pid,ev=eventosDoPerfil(pid),r=retencao(ev,hoje());
  const f=v=>v===null?'sem dados':Math.round(v*100)+'%';
  const meta=metaPorDiaAtivo(ev);
  let h='<h2 class="sec">Medidor do produto</h2><p class="galeria-intro">Para quem cuida do app. Números só deste jogador, calculados no aparelho. '+
    'Com poucos dias de uso eles ainda não dizem nada: servem para comparar depois, com várias famílias.</p>';
  h+='<div class="mundos-lista medidor">'+
    '<div class="linha-mundo"><div class="mtx"><b>Voltou no dia 1</b><span class="sub-l">exato: '+f(r.D1)+' · janela: '+f(r.D1_janela)+' · base '+r.n.D1+'</span></div></div>'+
    '<div class="linha-mundo"><div class="mtx"><b>Voltou no dia 7</b><span class="sub-l">exato: '+f(r.D7)+' · janela: '+f(r.D7_janela)+' · base '+r.n.D7+'</span></div></div>'+
    '<div class="linha-mundo"><div class="mtx"><b>Voltou no dia 30</b><span class="sub-l">exato: '+f(r.D30)+' · janela: '+f(r.D30_janela)+' · base '+r.n.D30+'</span></div></div>'+
    '<div class="linha-mundo"><div class="mtx"><b>Volta no dia seguinte</b><span class="sub-l">'+f(r.retornoDiaSeguinte)+' · base '+r.n.curr+'</span></div></div>'+
    '<div class="linha-mundo"><div class="mtx"><b>Meta cheia por dia ativo</b><span class="sub-l">'+f(meta)+'</span></div></div></div>';
  h+='<div class="perfil-bts"><button class="btn fantasma" id="exp-metricas">Exportar métricas anônimas</button></div>';
  return h;
}
function ligarMedidor(){
  const b=$('#exp-metricas');if(!b)return;
  b.addEventListener('click',()=>entregar('bobby-metricas.json',JSON.stringify(pacoteDeMetricas(perfilAtual().pid),null,1)));
}
