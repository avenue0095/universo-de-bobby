/* ---------- perfil ---------- */
function feitasDaMateria(k){
  return Object.keys(S.feitas||{}).filter(x=>x.indexOf('rev')!==0&&
    (k==='pt'?x.charAt(0)==='p':(k==='en'?x.charAt(0)==='e':/^[0-9]/.test(x)))).length;
}
function telaPerfil(){
  const p=perfilAtual();
  const desenhos=desenhosGanhos().length;
  const totalGeral=Object.keys(MATERIAS).reduce((a,k)=>a+MATERIAS[k].total(),0);
  const feitasGeral=Object.keys(MATERIAS).reduce((a,k)=>a+feitasDaMateria(k),0);
  const niv=nivelDoExplorador();
  let h='<div class="perfil-in">';
  h+='<div class="perfil-cabeca"><div class="perfil-bobby">'+MASCB('feliz','',null,'Bobby, o ursinho')+'</div>'+
     '<h1>'+escapa(p.nome||'Jogador')+'</h1>'+
     '<span class="titulo">Explorador nível '+niv+' · '+ROTULO_FAIXA[S.faixa]+'</span></div>';
  h+='<div class="stats">'+
    stat(IC.medalha,feitasGeral+'/'+totalGeral,'fases')+
    stat(IC.estrelaDia,estrelasTotal(),'estrelas')+
    stat(IC.moeda,S.moedas,'moedas')+
    stat(IC.bussola,diasDeExploracao(),diasDeExploracao()===1?'dia de exploração':'dias de exploração')+
    stat(IC.pergaminho||IC.quadro,desenhos+'/'+desenhosCatalogo().length,'desenhos')+'</div>';

  /* progresso das três galáxias, sempre visível */
  h+='<h2 class="sec">Suas galáxias</h2><div class="mundos-lista">';
  Object.keys(MATERIAS).forEach(k=>{
    const m=MATERIAS[k],n=feitasDaMateria(k),tot=m.total();
    const pc=Math.round(n/tot*100);
    h+='<button class="linha-mundo galaxia'+(k===MATERIA?' atual':'')+'" data-gal="'+k+'" data-materia="'+MATCOD[k]+'">'+
       '<span class="gic">'+m.ic+'</span>'+
       '<div class="mtx"><b>'+m.n+(k===MATERIA?' <i class="agora">você está aqui</i>':'')+'</b>'+
       '<div class="mbar"><i style="width:'+pc+'%"></i></div></div>'+
       '<span class="mpc">'+n+'/'+tot+'</span></button>';
  });
  h+='</div>';

  h+='<h2 class="sec">Sua viagem em '+MATERIAS[MATERIA].n+'</h2><div class="mundos-lista">';
  UNITS.forEach(u=>{
    const n=u.lessons.filter(l=>S.feitas[l.id]).length;
    const pc=Math.round(n/u.lessons.length*100);
    h+='<div class="linha-mundo" style="--ub:'+corUnidade(u)+'"><span class="mn">'+u.n+'</span>'+
       '<div class="mtx"><b>'+u.title+'</b><div class="mbar"><i style="width:'+pc+'%"></i></div></div>'+
       '<span class="mpc">'+n+'/'+u.lessons.length+'</span></div>';
  });
  h+='</div>';
  h+='<h2 class="sec">Conquistas</h2><div class="medalhas">';
  CONQUISTAS.forEach(c=>{const ok=c.ok();
    h+='<div class="medalha'+(ok?' on':'')+'">'+IC.medalha+'<b>'+c.n+'</b><span>'+c.d+'</span></div>';});
  h+='</div>';
  h+='<h2 class="sec">Ajustes</h2>';
  h+='<div class="perfil-bts"><button class="btn" id="ir-loja">Meu personagem</button>'+
     '<button class="btn laranja" id="ir-galeria">'+IC.quadro+' Meus desenhos</button>'+
     '<button class="btn laranja" id="ir-resp">Para o responsável</button>'+
     '<button class="btn laranja" id="ir-voz">'+IC.falar+' Voz e som</button>'+
     '<button class="btn fantasma" id="som-perfil">'+(S.som?'Desligar sons':'Ligar sons')+'</button>'+
     '<button class="btn fantasma" id="ed-nome">Trocar nome e cor</button>'+
     '<button class="btn fantasma" id="tr-jogador">Trocar de jogador</button></div>';
  h+='</div>';
  $('#perfil').innerHTML='<div class="rev-topo"><button class="icobtn" id="fechar-perfil" aria-label="Voltar">'+IC.volta+'</button><h2>Meu perfil</h2></div><div class="rev-corpo">'+h+'</div>';
  $('#perfil').dataset.tela='perfil';
  $('#perfil').classList.add('on');document.body.style.overflow='hidden';
  $('#fechar-perfil').addEventListener('click',fecharPerfil2);
  $('#perfil').querySelectorAll('[data-gal]').forEach(b=>b.addEventListener('click',()=>{
    usarMateria(b.dataset.gal);telaPerfil();}));
  $('#ir-loja').addEventListener('click',()=>{lojaOrigem='perfil';telaLoja();});
  $('#ir-voz').addEventListener('click',telaVoz);
  $('#ir-galeria').addEventListener('click',()=>{fecharPerfil2();abrirGaleria(false);});
  $('#ir-resp').addEventListener('click',()=>comSenha(telaResponsavel));
  $('#som-perfil').addEventListener('click',()=>{S.som=!S.som;salvar();pintarTopo();telaPerfil();});
  $('#ed-nome').addEventListener('click',()=>{fecharPerfil2();pedirNome(false);});
  $('#tr-jogador').addEventListener('click',()=>{fecharPerfil2();telaPerfis();});
}
function stat(ic,v,r){return '<div class="stat-card">'+ic+'<b>'+v+'</b><span>'+r+'</span></div>';}
function fecharPerfil2(){$('#perfil').classList.remove('on');$('#perfil').dataset.tela='';document.body.style.overflow='';renderTrilha();pintarBarra();}

/* ---------- área do responsável ---------- */
function fmtTempo(seg){
  seg=seg||0;const h=Math.floor(seg/3600),m=Math.round((seg%3600)/60);
  return h?h+'h'+(m<10?'0':'')+m:(m||'0')+' min';
}
function telaResponsavel(){
  const st=S.stats||{porLicao:{},dias:{},tempo:0};
  const porL=st.porLicao||{};
  const lista=[];
  UNITS.forEach(u=>u.lessons.forEach(l=>{
    const p=porL[l.id];if(!p||!p.erros)return;
    const tot=(p.acertos||0)+p.erros;
    lista.push({id:l.id,t:l.title,m:u.n,e:p.erros,a:p.acertos||0,taxa:p.erros/tot});
  }));
  lista.sort((x,y)=>y.taxa-x.taxa||y.e-x.e);
  const dias=[];
  for(let i=6;i>=0;i--){
    const d=somaDias(hoje(),-i);
    dias.push({d:d,n:(st.dias[d]||{}).fases||0,s:(st.dias[d]||{}).seg||0});
  }
  const maxD=Math.max(1,...dias.map(x=>x.n));
  const p=proxima();
  const totalErros=Object.keys(porL).reduce((a,k)=>a+(porL[k].erros||0),0);
  const totalAcertos=Object.keys(porL).reduce((a,k)=>a+(porL[k].acertos||0),0);
  const pc=totalAcertos+totalErros?Math.round(totalAcertos/(totalAcertos+totalErros)*100):0;

  let h='<div class="perfil-in"><p class="galeria-intro">Resumo de <b>'+escapa(perfilAtual().nome||'quem joga')+'</b> para acompanhar. '+
    'Nada aqui é enviado para lugar nenhum: fica só neste aparelho.</p>';
  h+='<div class="stats">'+
    stat(IC.medalha,fases()+'/'+TOTAL_LESSONS,'fases feitas')+
    stat(IC.relogio,fmtTempo(st.tempo),'tempo total')+
    stat(IC.alvo,pc+'%','acerto geral')+'</div>';
  h+=semanaHTML();
  if(typeof relatorioHTML==='function')h+=relatorioHTML();
  h+='<h2 class="sec">Últimos 7 dias</h2><div class="semana">';
  dias.forEach(x=>{const dt=new Date(x.d+'T12:00:00');
    h+='<div class="dia"><span class="col" style="height:'+Math.max(6,Math.round(x.n/maxD*70))+'px"></span>'+
       '<b>'+x.n+'</b><em>'+['dom','seg','ter','qua','qui','sex','sáb'][dt.getDay()]+'</em></div>';});
  h+='</div>';
  h+='<h2 class="sec">Onde mais erra</h2>';
  if(!lista.length)h+='<p class="galeria-intro">Ainda não há erros registrados. Assim que o jogo rolar, os assuntos difíceis aparecem aqui.</p>';
  else{h+='<div class="mundos-lista">';
    lista.slice(0,5).forEach(x=>{
      h+='<div class="linha-mundo" style="--ub:var(--cor-ainda)"><span class="mn">'+Math.round(x.taxa*100)+'%</span>'+
         '<div class="mtx"><b>'+x.t+'</b><span class="sub-l">Mundo '+x.m+' · '+x.e+' erro'+(x.e>1?'s':'')+' e '+x.a+' acerto'+(x.a===1?'':'s')+'</span></div></div>';
    });
    h+='</div>';}
  h+='<h2 class="sec">O que fazer hoje</h2><ol class="passos plano">';
  if(lista.length)h+='<li>Joguem juntos a fase <b>'+lista[0].t+'</b> e peçam para a criança contar em voz alta como está pensando.</li>';
  if(p)h+='<li>A próxima fase nova é <b>'+tituloDaProxima(p)+'</b> (Mundo '+UNITS[p[0]].n+').</li>';
  h+='<li>Use a <b>Revisão do mundo</b> (medalha dourada no fim do mapa): ela devolve exatamente as perguntas erradas. A <b>Revisão do dia</b> do mapa traz de volta, aos poucos, o que já foi errado.</li>';
  h+='<li>Imprima o desenho da fase e peça para contar a história enquanto pinta: repetir com as mãos fixa mais que repetir com os olhos.</li></ol>';
  h+='<h2 class="sec">Como o app ensina</h2><p class="galeria-intro">Cada fase segue o caminho <b>concreto → desenho → número</b>: '+
     'primeiro a peça na tela (barrinhas, fatias, moedas), depois a figura, só então a conta escrita. '+
     'É o método usado com material dourado na escola. Se travar num assunto, volte um degrau em vez de repetir a conta.</p>';
  h+='<h2 class="sec">Instalar na tela inicial</h2>';
  h+='<p class="galeria-intro">Dá para deixar o Bobby como um ícone no celular, que abre em tela cheia, '+
     'sem a barra do navegador. '+instrucaoInstalar()+'</p>';
  h+='<h2 class="sec">Levar o progresso para outro aparelho</h2>';
  h+='<ol class="passos plano">'+
     '<li>Neste aparelho, toque em <b>Salvar cópia deste perfil</b> aqui embaixo. Sai um arquivo <b>.json</b>.</li>'+
     '<li>Mande esse arquivo para o outro aparelho (WhatsApp, e-mail ou Drive: tanto faz).</li>'+
     '<li>No outro aparelho, abra o app, vá em <b>Perfil → Para o responsável</b> e toque em <b>Restaurar de uma cópia</b>.</li>'+
     '<li>Escolha o arquivo. O perfil aparece na tela “Quem vai jogar?” com todo o progresso.</li>'+
     '</ol>';
  h+='<p class="galeria-intro">Vale lembrar: o progresso <b>não sincroniza sozinho</b> entre aparelhos. '+
     'Cada um guarda o seu. Se jogar nos dois, faça a cópia de novo para atualizar. '+
     'Ao restaurar, o app pergunta se você quer substituir o perfil que já existe ou salvar como outro perfil.</p>';
  h+='<h2 class="sec">Dados e privacidade</h2>';
  h+='<p class="galeria-intro">Todo o progresso fica guardado <b>só neste aparelho</b>, no navegador. '+
     'Nada é enviado para a internet e não existe cadastro nem e-mail. '+
     'Cada jogador tem a própria caixinha de dados: moedas, fases, erros e desenhos de um não aparecem no outro. '+
     'Se você limpar os dados do navegador, o progresso vai junto: por isso vale guardar uma cópia.</p>'+
     '<p class="galeria-intro"><b>A senha desta área é uma trava neste aparelho</b>, para a criança não entrar sozinha. '+
     'Ela não é controle parental com valor legal: quem sabe mexer no navegador consegue tirá-la. '+
     'A cópia do perfil é um arquivo de texto comum, sem proteção: guarde com cuidado, porque tem o progresso de uma criança. '+
     'O app registra números de uso (dias, perguntas, acertos) só neste aparelho, sem nome nem texto.</p>';
  if(typeof planoHTML==='function')h+=planoHTML();
  h+=controlesHTML();
  h+=medidorHTML();
  h+='<div id="resp-aviso"></div>';
  h+='<div class="perfil-bts">'+
     '<button class="btn laranja" id="bx-perfil">'+IC.baixar+' Salvar cópia deste perfil</button>'+
     '<button class="btn fantasma" id="rs-perfil">Restaurar de uma cópia</button>'+
     '<button class="btn fantasma" id="sn-perfil">'+(temSenha()?'Trocar a senha desta área':'Proteger esta área com senha')+'</button>'+
     '</div>';
  h+='<h2 class="sec">Apagar</h2><p class="galeria-intro">Remove deste aparelho todos os jogadores, o progresso, os desenhos coloridos, as cópias de segurança guardadas pelo app e a senha. Não dá para desfazer.</p>'+
     '<div class="perfil-bts"><button class="btn-sec" id="apagar-tudo">Apagar todos os dados deste aparelho</button></div>';
  h+='<div class="perfil-bts"><button class="btn fantasma" id="volta-resp">Voltar ao perfil</button></div></div>';
  $('#perfil').innerHTML='<div class="rev-topo"><button class="icobtn" id="volta-resp2" aria-label="Voltar">'+IC.volta+'</button><h2>Para o responsável</h2></div><div class="rev-corpo">'+h+'</div>';
  $('#perfil').classList.add('on');document.body.style.overflow='hidden';
  $('#volta-resp').addEventListener('click',telaPerfil);
  $('#volta-resp2').addEventListener('click',telaPerfil);
  ligarControles(telaResponsavel);ligarSemana();ligarMedidor();if(typeof ligarRelatorio==='function')ligarRelatorio();
  $('#bx-perfil').addEventListener('click',baixarPerfil);
  $('#rs-perfil').addEventListener('click',restaurarPerfil);
  $('#apagar-tudo').addEventListener('click',apagarTudoPasso1);
  const va=$('#ver-assinatura');if(va)va.addEventListener('click',telaAssinatura);
  $('#sn-perfil').addEventListener('click',()=>pedirSenha(
    temSenha()?'Nova senha':'Criar senha',
    'Escolha de 4 a 6 números. É uma trava neste aparelho para a criança não entrar sozinha, não um controle parental com valor legal. Anote em algum lugar, não dá para recuperar.',
    ()=>telaResponsavel(),true));
}



/* instrucao de instalacao conforme o aparelho */
function instrucaoInstalar(){
  const ua=navigator.userAgent||'';
  const iOS=/iPad|iPhone|iPod/.test(ua)||(/Macintosh/.test(ua)&&navigator.maxTouchPoints>1);
  const android=/Android/.test(ua);
  if(iOS)return 'No iPhone ou iPad: abra este endereço no <b>Safari</b>, toque no botão de '+
    '<b>compartilhar</b> (o quadradinho com a seta para cima) e escolha '+
    '<b>“Adicionar à Tela de Início”</b>.';
  if(android)return 'No Android: abra este endereço no <b>Chrome</b>, toque nos <b>três pontinhos</b> '+
    'do canto e escolha <b>“Adicionar à tela inicial”</b> ou <b>“Instalar app”</b>.';
  return 'No celular, abra este endereço no navegador e procure a opção '+
    '<b>“Adicionar à tela inicial”</b>: no iPhone fica no botão de compartilhar do Safari, '+
    'no Android fica nos três pontinhos do Chrome.';
}




/* ---------- apagar todos os dados deste aparelho: dois passos, com a senha ---------- */
function apagarTudoPasso1(){
  abrirFolha('<div class="folha-in"><h2>Apagar tudo deste aparelho?</h2>'+
    '<p>Isso remove todos os jogadores, o progresso, os desenhos coloridos, as cópias guardadas pelo app e a senha. Não dá para desfazer.</p>'+
    '<p>Se quiser guardar o progresso, feche esta janela e toque em “Salvar cópia deste perfil” antes.</p>'+
    '<div class="folha-bts par"><button class="btn-sec" id="at-cancela">Voltar</button><button class="btn-acao" id="at-segue">Quero continuar</button></div></div>');
  $('#at-cancela').addEventListener('click',fecharFolha);
  $('#at-segue').addEventListener('click',apagarTudoPasso2);
}
function apagarTudoPasso2(erro){
  const comPin=temSenha();
  abrirFolha('<div class="folha-in senha-in"><h2>Confirme para apagar</h2>'+
    '<p class="perfis-sub">'+(comPin?'Digite a senha desta área.':'Digite a palavra APAGAR.')+'</p>'+
    '<input id="at-campo" class="campo pin" '+(comPin?'type="password" inputmode="numeric" maxlength="6" placeholder="••••" aria-label="Senha da área do responsável"':'type="text" maxlength="6" placeholder="APAGAR" aria-label="Digite APAGAR"')+' autocomplete="off">'+
    '<label class="marcar"><input type="checkbox" id="at-caches"> Apagar também as imagens e vozes guardadas para jogar sem internet (será preciso baixar de novo)</label>'+
    (typeof erro==='string'&&erro?'<p class="erro-pin">'+escapa(erro)+'</p>':'')+
    '<div class="folha-bts par"><button class="btn-sec" id="at-cancela">Cancelar</button><button class="btn-acao" id="at-apaga">Apagar tudo</button></div></div>');
  $('#at-cancela').addEventListener('click',fecharFolha);
  $('#at-apaga').addEventListener('click',async()=>{
    const v=($('#at-campo').value||'').trim();
    if(comPin){
      const falta=Math.ceil(esperaDoPin()/1000);
      if(falta>0){apagarTudoPasso2('Muitas tentativas. Espere '+(falta>=60?Math.ceil(falta/60)+' min':falta+' s')+'.');return;}
      if(!(await conferirSenha(v))){apagarTudoPasso2('Senha errada.');return;}
    }else if(v!=='APAGAR'){apagarTudoPasso2('Digite a palavra APAGAR.');return;}
    const caches=!!$('#at-caches').checked;
    const r=await apagarTudoDoAparelho({caches:caches});
    abrirFolha('<div class="folha-in"><h2>Tudo apagado</h2><p>Os dados deste aparelho foram removidos ('+r.chaves.length+' registros'+(caches?' e as imagens e vozes guardadas':'')+'). O app vai recomeçar do zero.</p>'+
      '<div class="folha-bts"><button class="btn-acao" id="at-fim">Recomeçar</button></div></div>');
    $('#at-fim').addEventListener('click',()=>{try{location.reload();}catch(e){}});
  });
}
