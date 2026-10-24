/* ---------- perfil ---------- */
function feitasDaMateria(k){
  return Object.keys(S.feitas||{}).filter(x=>x.indexOf('rev')!==0&&
    (k==='pt'?x.charAt(0)==='p':(k==='en'?x.charAt(0)==='e':/^[0-9]/.test(x)))).length;
}
function telaPerfil(){
  const p=perfilAtual();
  const desenhos=fases();
  const totalGeral=Object.keys(MATERIAS).reduce((a,k)=>a+MATERIAS[k].total(),0);
  const feitasGeral=Object.keys(MATERIAS).reduce((a,k)=>a+feitasDaMateria(k),0);
  const niv=nivelDoExplorador();
  let h='<div class="perfil-in">';
  h+='<div class="perfil-cabeca"><div class="perfil-bobby">'+MASC('feliz')+'</div>'+
     '<h1>'+escapa(p.nome||'Jogador')+'</h1>'+
     '<span class="titulo">Explorador nível '+niv+' · '+ROTULO_FAIXA[S.faixa]+'</span></div>';
  h+='<div class="stats">'+
    stat(IC.bandeira,feitasGeral+'/'+totalGeral,'fases')+
    stat(IC.estrela,estrelasTotal(),'estrelas')+
    stat(IC.moeda,S.moedas,'moedas')+
    stat(IC.fogo,S.ofensiva.atual,'dias seguidos')+
    stat(IC.coracao,S.ofensiva.melhor,'recorde de dias')+
    stat(IC.quadro,desenhos,'desenhos')+'</div>';

  /* progresso das três galáxias, sempre visível */
  h+='<h2 class="sec">Suas galáxias</h2><div class="mundos-lista">';
  Object.keys(MATERIAS).forEach(k=>{
    const m=MATERIAS[k],n=feitasDaMateria(k),tot=m.total();
    const pc=Math.round(n/tot*100);
    h+='<button class="linha-mundo galaxia'+(k===MATERIA?' atual':'')+'" data-gal="'+k+'" style="--ub:'+m.cor+'">'+
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
  h+='<div class="perfil-bts"><button class="btn" id="ir-loja">'+IC.chapeu+' Guarda-roupa do Bobby</button>'+
     '<button class="btn laranja" id="ir-galeria">'+IC.quadro+' Meus desenhos</button>'+
     '<button class="btn laranja" id="ir-resp">Para o responsável</button>'+
     '<button class="btn laranja" id="ir-voz">'+IC.falar+' Voz e som</button>'+
     '<button class="btn fantasma" id="som-perfil">'+(S.som?'Desligar sons':'Ligar sons')+'</button>'+
     '<button class="btn fantasma" id="ed-nome">Trocar nome e cor</button>'+
     '<button class="btn fantasma" id="tr-jogador">Trocar de jogador</button></div>';
  h+='</div>';
  $('#perfil').innerHTML='<div class="rev-topo"><button class="icobtn" id="fechar-perfil" aria-label="Voltar">'+IC.volta+'</button><h2>Meu perfil</h2></div><div class="rev-corpo">'+h+'</div>';
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
function fecharPerfil2(){$('#perfil').classList.remove('on');document.body.style.overflow='';renderTrilha();}

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

  let h='<div class="perfil-in"><p class="galeria-intro">Resumo de <b>'+escapa(perfilAtual().nome||'')+'</b> para você acompanhar. '+
    'Nada aqui é enviado para lugar nenhum — fica só neste aparelho.</p>';
  h+='<div class="stats">'+
    stat(IC.bandeira,fases()+'/'+TOTAL_LESSONS,'fases feitas')+
    stat(IC.fogo,fmtTempo(st.tempo),'tempo total')+
    stat(IC.estrela,pc+'%','acerto geral')+'</div>';
  h+=semanaHTML();
  h+='<h2 class="sec">Últimos 7 dias</h2><div class="semana">';
  dias.forEach(x=>{const dt=new Date(x.d+'T12:00:00');
    h+='<div class="dia"><span class="col" style="height:'+Math.max(6,Math.round(x.n/maxD*70))+'px"></span>'+
       '<b>'+x.n+'</b><em>'+['dom','seg','ter','qua','qui','sex','sáb'][dt.getDay()]+'</em></div>';});
  h+='</div>';
  h+='<h2 class="sec">Onde mais erra</h2>';
  if(!lista.length)h+='<p class="galeria-intro">Ainda não há erros registrados. Assim que o jogo rolar, os assuntos difíceis aparecem aqui.</p>';
  else{h+='<div class="mundos-lista">';
    lista.slice(0,5).forEach(x=>{
      h+='<div class="linha-mundo" style="--ub:var(--coral)"><span class="mn">'+Math.round(x.taxa*100)+'%</span>'+
         '<div class="mtx"><b>'+x.t+'</b><span class="sub-l">Mundo '+x.m+' · '+x.e+' erro'+(x.e>1?'s':'')+' e '+x.a+' acerto'+(x.a===1?'':'s')+'</span></div></div>';
    });
    h+='</div>';}
  h+='<h2 class="sec">O que fazer hoje</h2><ol class="passos plano">';
  if(lista.length)h+='<li>Refaça junto a fase <b>'+lista[0].t+'</b> e peça para explicar em voz alta o que está fazendo.</li>';
  if(p)h+='<li>A próxima fase nova é <b>'+UNITS[p[0]].lessons[p[1]].title+'</b> (Mundo '+UNITS[p[0]].n+').</li>';
  h+='<li>Use a <b>Revisão do mundo</b> (medalha dourada no fim do mapa): ela devolve exatamente as perguntas erradas. A <b>Revisão do dia</b> do mapa traz de volta, aos poucos, o que já foi errado.</li>';
  h+='<li>Imprima o desenho da fase e peça para contar a história enquanto pinta — repetir com as mãos fixa mais que repetir com os olhos.</li></ol>';
  h+='<h2 class="sec">Como o app ensina</h2><p class="galeria-intro">Cada fase segue o caminho <b>concreto → desenho → número</b>: '+
     'primeiro a peça na tela (barrinhas, fatias, moedas), depois a figura, só então a conta escrita. '+
     'É o método usado com material dourado na escola. Se travar num assunto, volte um degrau em vez de repetir a conta.</p>';
  h+='<h2 class="sec">Instalar na tela inicial</h2>';
  h+='<p class="galeria-intro">Dá para deixar o Bobby como um ícone no celular, que abre em tela cheia, '+
     'sem a barra do navegador. '+instrucaoInstalar()+'</p>';
  h+='<h2 class="sec">Levar o progresso para outro aparelho</h2>';
  h+='<ol class="passos plano">'+
     '<li>Neste aparelho, toque em <b>Salvar cópia deste perfil</b> aqui embaixo. Sai um arquivo <b>.json</b>.</li>'+
     '<li>Mande esse arquivo para o outro aparelho (WhatsApp para você mesma, e-mail, Drive — tanto faz).</li>'+
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
     'Se você limpar os dados do navegador, o progresso vai junto — por isso vale guardar uma cópia.</p>';
  h+=controlesHTML();
  h+=medidorHTML();
  h+='<div id="resp-aviso"></div>';
  h+='<div class="perfil-bts">'+
     '<button class="btn laranja" id="bx-perfil">'+IC.baixar+' Salvar cópia deste perfil</button>'+
     '<button class="btn fantasma" id="rs-perfil">Restaurar de uma cópia</button>'+
     '<button class="btn fantasma" id="sn-perfil">'+(temSenha()?'Trocar a senha desta área':'Proteger esta área com senha')+'</button>'+
     '</div>';
  h+='<div class="perfil-bts"><button class="btn fantasma" id="volta-resp">Voltar ao perfil</button></div></div>';
  $('#perfil').innerHTML='<div class="rev-topo"><button class="icobtn" id="volta-resp2" aria-label="Voltar">'+IC.volta+'</button><h2>Para o responsável</h2></div><div class="rev-corpo">'+h+'</div>';
  $('#perfil').classList.add('on');document.body.style.overflow='hidden';
  $('#volta-resp').addEventListener('click',telaPerfil);
  $('#volta-resp2').addEventListener('click',telaPerfil);
  ligarControles(telaResponsavel);ligarSemana();ligarMedidor();
  $('#bx-perfil').addEventListener('click',baixarPerfil);
  $('#rs-perfil').addEventListener('click',restaurarPerfil);
  $('#sn-perfil').addEventListener('click',()=>pedirSenha(
    temSenha()?'Nova senha':'Criar senha',
    'Escolha de 4 a 6 números. Ela protege os relatórios e a troca de perfis — anote em algum lugar, não dá para recuperar.',
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
    '<b>“Adicionar à tela inicial”</b> — no iPhone fica no botão de compartilhar do Safari, '+
    'no Android fica nos três pontinhos do Chrome.';
}


