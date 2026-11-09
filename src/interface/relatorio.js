/* ---------- 1G · relatório dos pais e diagnóstico de entrada (interface) ----------
   Fica atrás do PIN, dentro de "Para o responsável". Texto neutro em gênero ("a criança", apelido). Só números locais.
   BNCC: só código com conferido:true e citavel:true (src/conteudo/bncc.js, gerado de docs/bncc-mapa.json), sempre como
   "habilidade relacionada", nunca "cumprida"; inglês só na faixa de 11 a 12 anos. */

/* 20 dicas a quem acompanha (escritas a partir das ideias dos dois apps de referência, sem copiar o texto; SEM REVISÃO DE PEDAGOGO).
   m: matéria a que a dica serve ('*' = qualquer). Nenhuma pede para o adulto dar aula: só gesto de casa. */
const DICAS_RESP=[
  {m:'*',t:'Sessões curtas rendem mais: 10 minutos com atenção valem mais que meia hora com cansaço.'},
  {m:'mat',t:'Use coisas de verdade para contar: feijões, tampinhas, colheres. A mão aprende antes do papel.'},
  {m:'mat',t:'Contar nos dedos é permitido. É um apoio que vai embora sozinho quando a conta fica fácil.'},
  {m:'*',t:'Peça para a criança contar como pensou. Ouvir o caminho mostra mais do que olhar só a resposta.'},
  {m:'*',t:'Voltar uma etapa não é atraso, é base. Cada criança tem o seu ritmo.'},
  {m:'mat',t:'Procurem números na rua: placas, preços no mercado, número das casas.'},
  {m:'mat',t:'Brinquem de lojinha com moedas de verdade ou de papel: pagar e receber troco vira jogo.'},
  {m:'mat',t:'Um relógio de ponteiros em casa ajuda a ler as horas. Perguntem juntos quanto falta para o lanche.'},
  {m:'mat',t:'Repartir a comida em partes iguais é fração na prática: metade do pão, um quarto da maçã.'},
  {m:'mat',t:'Tabuada firma com jogo curto e repetido: bingo, música, cartas. Pouco por dia funciona melhor.'},
  {m:'pt',t:'Comecem pelo som da letra, não pelo nome da letra: o “mmm” de mala ajuda mais do que “eme”.'},
  {m:'pt',t:'Etiquetas em objetos da casa (porta, mesa, cama) deixam a palavra escrita sempre à vista.'},
  {m:'pt',t:'Trocar b e d, p e q é comum até uns 7 ou 8 anos e costuma passar com o tempo e a leitura.'},
  {m:'*',t:'Nem todo erro precisa ser apontado na hora. Escolha um por vez e comemore o que deu certo.'},
  {m:'pt',t:'Brinquem de rima na fila ou no carro: pão rima com mão, chão, feijão.'},
  {m:'pt',t:'Bater uma palma para cada pedaço da palavra ajuda a separar as sílabas: ca-ne-ta.'},
  {m:'pt',t:'Leiam juntos todo dia, nem que seja uma página. A criança lê as palavras que já conhece.'},
  {m:'pt',t:'Bilhetes curtos na geladeira ou na lancheira dão motivo de verdade para ler.'},
  {m:'en',t:'Música e desenho em inglês contam: o ouvido se acostuma antes da boca.'},
  {m:'en',t:'Usem no dia a dia as palavras em inglês que a criança já sabe: cores, números, bichos.'}
];
let _LIC_POR_ID=null;
function licaoPorId(id){
  if(!_LIC_POR_ID){_LIC_POR_ID={};[['mat',UNITS_MAT],['pt',UNITS_PT],['en',UNITS_EN]].forEach(p=>p[1].forEach(u=>u.lessons.forEach(l=>{_LIC_POR_ID[l.id]={l:l,u:u,m:p[0]};})));}
  return _LIC_POR_ID[id]||null;
}
const nomeDaFase=id=>{const x=licaoPorId(id);return x?x.l.title+' (Planeta '+PLANETAS[x.m].n+', etapa '+x.u.n+')':id;};
/* semana de uso: 1 na primeira semana com atividade */
function semanaDeUso(dia){
  const ds=Object.keys((S.stats&&S.stats.dias)||{}).filter(k=>{const x=S.stats.dias[k];return x&&(x.q||x.fases);}).sort();
  if(!ds.length)return 0;
  return Math.floor(Math.max(0,difDias(ds[0],dia))/7)+1;
}
/* fases com resposta de primeira registrada, mais recentes primeiro */
function fasesComAcerto(dia){
  const por={};
  Object.keys(S.habil||{}).forEach(k=>{const h=S.habil[k];if(!h.n)return;const f=faseDaChave(k);
    const r=por[f]||(por[f]={id:f,n:0,a:0,v:0,u:''});r.n+=h.n;r.a+=h.a;r.v+=h.v||0;if(h.u>r.u)r.u=h.u;});
  return Object.keys(por).map(k=>por[k]).filter(r=>licaoPorId(r.id)).sort((x,y)=>y.u<x.u?-1:(y.u>x.u?1:y.n-x.n));
}
/* "brilhou em": a fase em que o domínio mais cresceu nesta semana (só ganho de pelo menos 0,15) */
function brilhouEm(dia){
  const sem=S.habilSemana||{w:'',p0:{}};if(sem.w!==semanaIso(dia))return null;
  const ganho={};
  Object.keys(sem.p0).forEach(k=>{const h=S.habil[k];if(!h)return;const f=faseDaChave(k);
    ganho[f]=Math.max(ganho[f]||0,pAtual(h,dia)-sem.p0[k]);});
  let melhor=null;Object.keys(ganho).forEach(f=>{if(ganho[f]>=.15&&licaoPorId(f)&&(!melhor||ganho[f]>ganho[melhor]))melhor=f;});
  return melhor;
}
/* "vale ajudar em": no máximo 1 fase, com pelo menos 6 respostas de primeira e acerto de primeira até 55% */
function valeAjudarEm(dia){
  const c=fasesComAcerto(dia).filter(r=>r.n>=6&&r.a/r.n<=.55);
  c.sort((x,y)=>x.a/x.n-y.a/y.n);
  return c.length?c[0]:null;
}
function dicaPara(mat,dia){
  const l=DICAS_RESP.filter(d=>d.m===mat);
  return l.length?l[(idxDia(dia)>>>0)%l.length]:DICAS_RESP[0];
}
/* habilidades da BNCC relacionadas ao que a criança já praticou (fases concluídas) */
function bnccRelacionadas(){
  if(typeof BNCC!=='object'||!BNCC)return [];
  const vistos={},r=[];
  Object.keys(S.feitas||{}).forEach(id=>{
    const lst=BNCC.fases[id];if(!lst)return;
    if(materiaDoId(id)==='en'&&S.faixa!=='f1112')return;      /* inglês na BNCC só a partir do 6º ano */
    lst.forEach(c=>{if(vistos[c[0]])return;vistos[c[0]]=1;r.push({cod:c[0],ano:c[1],desc:BNCC.cod[c[0]]||'',fase:id});});
  });
  return r.sort((a,b)=>a.ano-b.ano||(a.cod<b.cod?-1:1));
}
function relatorioHTML(){
  const dia=hoje(),sem=semanaDeUso(dia),nome=escapa(perfilAtual().nome||'a criança');
  let h='<h2 class="sec">Como vai o aprendizado</h2>';
  /* ponto de partida (diagnóstico) */
  h+='<div class="mundos-lista">';
  ['mat','pt','en'].forEach(m=>{
    const d=(S.diag||{})[m];
    h+='<div class="linha-mundo"><div class="mtx"><b>'+MATERIAS[m].n+'</b><span class="sub-l">'+
      (d?'Ponto de partida: etapa '+d.u+' (missão de exploração em '+d.dia.split('-').reverse().join('/')+').':'Missão de exploração ainda não feita.')+
      '</span></div><button class="btn fantasma diag-bt" data-diag="'+m+'">'+(d?'Refazer':'Fazer agora')+'</button></div>';
  });
  h+='</div><p class="galeria-intro">A missão de exploração tem até 10 perguntas, sem ponto e sem pressa. Ela só ajuda o app a escolher perguntas na medida certa: '+
    'nem fáceis demais, nem difíceis demais. Entregue o aparelho para a criança e acompanhe.</p>';
  if(sem<=1){
    h+='<div class="rel-cartao"><b>Semana 1: conhecendo '+nome+'</b><p>Ainda é cedo para comparar. Nesta semana o app observa o que já está firme e onde vale ir com calma.</p>';
    const f=fasesComAcerto(dia).filter(r=>r.n>=3).sort((x,y)=>y.a/y.n-x.a/x.n)[0];
    if(f)h+='<p>Já faz bem: <b>'+escapa(nomeDaFase(f.id))+'</b>.</p>';
    h+='</div>';
  }else{
    const b=brilhouEm(dia),v=valeAjudarEm(dia);
    h+='<div class="rel-cartao">';
    h+='<p><b>Brilhou em:</b> '+(b?escapa(nomeDaFase(b)):'nada se destacou nesta semana ainda; continue no ritmo de sempre.')+'</p>';
    if(v){const d=dicaPara(materiaDoId(v.id),dia);
      h+='<p><b>Vale ajudar em:</b> '+escapa(nomeDaFase(v.id))+'.</p><p class="rel-dica">Em casa: '+escapa(d.t)+'</p>';}
    h+='</div>';
  }
  /* acerto de primeira por fase */
  const fs=fasesComAcerto(dia).slice(0,8);
  h+='<h2 class="sec">Acerto de primeira</h2>';
  if(!fs.length)h+='<p class="galeria-intro">Assim que a criança jogar, aparece aqui quantas perguntas de cada fase saíram certas logo na primeira tentativa.</p>';
  else{
    h+='<p class="galeria-intro">Quantas perguntas saíram certas logo na primeira tentativa, nas fases mais recentes. “Na segunda chance” conta as que deram certo quando a pergunta voltou.</p><div class="mundos-lista">';
    fs.forEach(r=>{h+='<div class="linha-mundo"><div class="mtx"><b>'+escapa(nomeDaFase(r.id))+'</b><span class="sub-l">'+r.a+' de '+r.n+' de primeira'+
      (r.v?' · '+r.v+' na segunda chance':'')+'</span></div></div>';});
    h+='</div>';
  }
  /* BNCC */
  h+='<h2 class="sec">Habilidades da BNCC relacionadas</h2><div id="rel-bncc">'+bnccHTML()+'</div>';
  /* 20 dicas */
  h+='<h2 class="sec">Dicas para quem acompanha</h2><details class="rel-dicas"><summary>Ver as '+DICAS_RESP.length+' dicas</summary><ol class="passos plano">';
  DICAS_RESP.forEach(d=>{h+='<li>'+escapa(d.t)+'</li>';});
  h+='</ol><p class="galeria-intro">Dicas gerais, ainda sem revisão de pedagogo.</p></details>';
  return h;
}
/* lista da BNCC (o arquivo de dados só é baixado quando esta área abre) */
function bnccHTML(){
  const bn=bnccRelacionadas();
  let h='';
  if(!BNCC)return '<p class="galeria-intro">Carregando a lista da BNCC. Sem internet, ela aparece na próxima vez que esta área abrir com conexão.</p>';
  if(!bn.length)h+='<p class="galeria-intro">Quando a criança concluir fases, aparecem aqui as habilidades da Base Nacional Comum Curricular relacionadas a elas.</p>';
  else{
    h+='<p class="galeria-intro">Habilidades da BNCC relacionadas às fases já concluídas. Relacionada quer dizer que a fase trabalha esse assunto, sem afirmar que ele já está dominado. Texto oficial do MEC.</p>';
    h+='<details class="rel-bncc"><summary>Ver as '+bn.length+' habilidades relacionadas</summary><ul>';
    bn.forEach(c=>{h+='<li><b>'+escapa(c.cod)+'</b> ('+c.ano+'º ano): '+escapa(c.desc)+'</li>';});
    h+='</ul></details>';
  }
  return h;
}
function carregarBncc(){
  if(BNCC||typeof fetch!=='function')return Promise.resolve(BNCC);
  return fetch('./'+BNCC_ARQ).then(r=>r.ok?r.json():null).then(j=>{if(j&&j.fases&&j.cod)BNCC=j;return BNCC;}).catch(()=>null);
}
function ligarRelatorio(){
  carregarBncc().then(()=>{const el=$('#rel-bncc');if(el&&BNCC)el.innerHTML=bnccHTML();});
  $('#perfil').querySelectorAll('[data-diag]').forEach(b=>b.addEventListener('click',()=>abrirDiagnostico(b.dataset.diag)));
}
/* linha extra do resumo copiado: brilhou e vale ajudar (só da 2ª semana em diante) */
function resumoDoRelatorio(){
  const dia=hoje();if(semanaDeUso(dia)<=1)return '';
  const b=brilhouEm(dia),v=valeAjudarEm(dia);
  return (b?' Brilhou em: '+nomeDaFase(b)+'.':'')+(v?' Vale ajudar em: '+nomeDaFase(v.id)+'.':'');
}

/* ---------- diagnóstico: a missão de exploração ---------- */
function abrirDiagnostico(mat){
  if(['mat','pt','en'].indexOf(mat)<0)return;
  /* trocar de planeta pode abrir o bilhete do Bobby: a missão vem antes, o bilhete fica para a volta ao mapa */
  if(MATERIA!==mat&&typeof usarMateria==='function'){usarMateria(mat);if(typeof fecharFolha==='function')fecharFolha();}
  $('#perfil').classList.remove('on');$('#perfil').dataset.tela='';
  const dg=diagNovo(mat,S.faixa);
  const q=diagPergunta(dg);if(!q)return;
  const u=UNITS[0];
  const falso={id:'diag',glyph:'★',title:'Missão de exploração',teach:{
    ideia:'O Bobby quer saber por onde começar a viagem com você. São até 10 perguntas, sem ponto e sem pressa.',
    exemplo:'Se não souber alguma, tudo bem: escolha a que parecer melhor e siga em frente.',
    dica:'Não precisa acertar todas. A missão só mostra por onde começar.'}};
  LIC={ui:0,li:-1,u:u,l:falso,qs:[q],base:DIAG.max,i:0,passo:0,vidas:5,erros:0,acertos:0,
       combo:0,melhorCombo:0,etapa:'aula',resp:null,digitado:'',conferido:false,dica:false,rev:true,diag:dg,
       md:{c:0,d:0,u:0},miss:{t:'Missão de exploração',abre:'',fim:''},
       cap:null,t0:Date.now(),tipoBloco:'diagnostico',respondidas:0,ganhoFase:0,hist:[],tQ:0};
  registrarEvento('bloco_inicio',{tipo:'diagnostico',lic:'diag',materia:mat});
  $('#licao').classList.add('on');
  $('#revisao').classList.remove('on');
  $('#licao').style.setProperty('--ub','var(--cor-acao)');
  document.body.style.overflow='hidden';
  pintarLicao();
}
function diagConferir(q,ok){
  const pe=$('#pe');pe.classList.add('mostra');pe.classList.add(ok?'certo':'errado');
  LIC.respondidas=(LIC.respondidas||0)+1;if(ok)LIC.acertos++;
  guiaPose(ok?'p02':'p04');
  $('#selo').innerHTML=MASC(ok?'feliz':'pensa','avatar');
  $('#fb-t').innerHTML=(ok?IC.certo:IC.refazer)+'<span>'+(ok?'Isso mesmo!':'Valeu por tentar!')+'</span>';
  $('#fb-s').innerHTML=(ok||q.verbo==='ligar'?'':'A resposta era <b>'+htmlSeguro(q.answer,120)+'</b>. ')+'Vamos explorar mais um pouco.';
  if(ok)somCerto();else somErro();
  const acabou=diagResponder(LIC.diag,q,ok);
  if(!acabou){const n=diagPergunta(LIC.diag);if(n)LIC.qs.push(n);else diagFechar(LIC.diag);}
  salvar();pintarTopo();
  $('#acao').textContent=LIC.i+1>=LIC.qs.length?'Terminar':'Continuar';
}
function diagFimHTML(){
  const dg=LIC.diag;
  if(!dg.fim)diagFechar(dg);
  registrarEvento('bloco_fim',{tipo:'diagnostico',lic:'diag',materia:dg.m,perguntas:LIC.respondidas||0,acertos:LIC.acertos,estrelas:0,seg:0,abandonou:0,contou:0});
  return '<div class="fim surge">'+MASC('comemora')+'<h2>Missão de exploração concluída!</h2>'+
    '<p class="fala-p">Obrigado! Agora o Bobby sabe por onde começar a viagem no Planeta '+PLANETAS[dg.m].n+'.</p>'+
    '<p class="sub">As próximas perguntas vão chegar na medida certa para você.</p></div>';
}
