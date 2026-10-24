/* ---------- caderno de erros e revisão do mundo ---------- */
function chaveQ(q){return q.prompt+'||'+q.answer;}
function guardarErrado(q){
  const n=MATERIA+LIC.u.n;const lista=S.errados[n]||[];
  const k=chaveQ(q);
  if(!lista.some(x=>chaveQ(x)===k)){
    /* guarda a pergunta inteira (fração precisa de 'partes', sílabas de 'pecas'...) e não só o texto */
    const c={};
    Object.keys(q).forEach(c2=>{if(c2.indexOf('__')!==0&&c2!=='reforco'&&typeof q[c2]!=='function')c[c2]=q[c2];});
    lista.push(JSON.parse(JSON.stringify(c)));
  }
  S.errados[n]=lista.slice(-30);salvar();
}
function tirarErrado(q){
  const n=MATERIA+LIC.u.n;const lista=S.errados[n]||[];
  const k=chaveQ(q);
  S.errados[n]=lista.filter(x=>chaveQ(x)!==k);salvar();
}
function abrirRevisaoMundo(ui){
  const u=UNITS[ui];
  let qs=(S.errados[MATERIA+u.n]||[]).slice().sort(()=>Math.random()-.5).slice(0,10);
  const faltam=Math.max(0,6-qs.length);
  for(let k=0;k<faltam;k++){
    const l=u.lessons[Math.floor(Math.random()*u.lessons.length)];
    const nova=genQuestions(l,1)[0];
    if(nova)qs.push(nova);
  }
  const falso={id:'rev'+MATERIA+u.n,glyph:'★',title:'Revisão do Mundo '+u.n,teach:{
    ideia:'Esta é a revisão do Mundo '+u.n+'. Aqui voltam justamente as perguntas que você errou nas fases, para ver se agora ficou claro.',
    exemplo:'Se travar em alguma, volte na fase daquele assunto e leia a aula de novo. Ela continua lá, sempre aberta.',
    dica:'Cada pergunta que você acertar aqui sai do seu caderno de erros. Acertando todas, o caderno fica limpo!'}};
  garantirDia();
  if(limiteDeBlocosAtingido()){mostrarParada(true);return;}
  LIC={ui:ui,li:-1,u:u,l:falso,qs:qs,base:qs.length,i:0,passo:0,vidas:5,erros:0,acertos:0,
       combo:0,melhorCombo:0,etapa:'aula',resp:null,digitado:'',conferido:false,dica:false,rev:true,
       md:{c:0,d:0,u:0},miss:{t:'Revisão do Mundo '+u.n,abre:'',fim:'Revisão concluída!'},
       cap:(CAP_ATUAL?CAP_ATUAL[u.n]:null),t0:Date.now(),
       tipoBloco:'revmundo',respondidas:0,ganhoFase:0,hist:[],tQ:0};
  registrarEvento('bloco_inicio',{tipo:'revmundo',lic:'rev'+MATERIA+u.n,materia:MATERIA});
  $('#licao').classList.add('on');
  $('#revisao').classList.remove('on');
  $('#licao').style.setProperty('--ub',corUnidade(u));
  document.body.style.overflow='hidden';
  pintarLicao();
}

/* ---------- rever a aula ---------- */
function abrirRevisao(){
  if(typeof cicloAulaRevista==='function')cicloAulaRevista();
  const ps=passosDe(LIC.l);
  let h='';ps.forEach((_,k)=>{h+=blocoPasso(ps,k,false);});
  $('#rev-corpo').innerHTML='<div class="lc-in">'+h+'</div>';
  $('#rev-titulo').textContent=LIC.l.title;
  $('#revisao').classList.add('on');
}


/* ---------- Revisão do dia (caixas espaçadas) ---------- */
/* fases que a criança já concluiu na matéria atual, para completar uma revisão curta com perguntas novas */
function fasesFeitasDaMateria(){
  const ls=[];
  UNITS.forEach(u=>u.lessons.forEach(l=>{if(S.feitas[l.id])ls.push(l);}));
  return ls;
}
function revisaoDoDiaPronta(){
  garantirDia();
  const n=Math.min(S.config.revisaoPorDia,revisaoSelecionar(S.config.revisaoPorDia).length);
  return n;
}
function abrirRevisaoDia(){
  garantirDia();
  if(limiteDeBlocosAtingido()){mostrarParada(true);return;}
  const chaves=revisaoSelecionar(S.config.revisaoPorDia);
  if(!chaves.length)return;
  const qs=chaves.map(perguntaDoItem).filter(Boolean);
  /* menos de 6 itens vencidos: completa com perguntas novas das fases que já passou (bloco precisa de 6) */
  const feitas=fasesFeitasDaMateria();
  for(let t=0;qs.length<CICLO.minBloco&&feitas.length&&t<40;t++){
    const l=feitas[Math.floor(Math.random()*feitas.length)];
    const nova=genQuestions(l,1)[0];
    if(nova&&!qs.some(x=>x.prompt===nova.prompt))qs.push(nova);
  }
  if(!qs.length)return;
  const u=UNITS[0];
  const falso={id:'revdia',glyph:'★',title:'Revisão do dia',teach:{
    ideia:'Estas são perguntas que o Bobby guardou para você rever hoje. Rever depois de alguns dias faz o cérebro guardar de verdade.',
    exemplo:'Errou alguma? Sem problema: ela volta mais uma vez, e logo você acerta.',
    dica:'Vá com calma. Cada acerto aqui deixa a lembrança mais forte.'}};
  LIC={ui:0,li:-1,u:u,l:falso,qs:qs,base:qs.length,i:0,passo:0,vidas:5,erros:0,acertos:0,
       combo:0,melhorCombo:0,etapa:'aula',resp:null,digitado:'',conferido:false,dica:false,rev:true,diaria:true,
       md:{c:0,d:0,u:0},miss:{t:'Revisão do dia',abre:'',fim:'Revisão do dia concluída!'},
       cap:null,t0:Date.now(),tipoBloco:'revisao',respondidas:0,ganhoFase:0,hist:[],tQ:0,revAgg:{n:0,ok:0,antes:0,depois:0}};
  registrarEvento('bloco_inicio',{tipo:'revisao',lic:'revdia',materia:MATERIA});
  $('#licao').classList.add('on');
  $('#revisao').classList.remove('on');
  $('#licao').style.setProperty('--ub','var(--cor-acao)');
  document.body.style.overflow='hidden';
  pintarLicao();
}
/* soma as respostas da sessão de revisão para o evento agregado 'revisao_item' */
function cicloRevisaoItem(antes,depois,ok){
  if(typeof LIC!=='object'||!LIC||!LIC.revAgg)return;
  const a=LIC.revAgg;a.n++;if(ok)a.ok++;a.antes+=antes;a.depois+=depois;
}
/* 2 ou 3 itens vencidos entram depois da primeira pergunta de uma fase NOVA (no máximo uma vez por dia, dentro do teto de 10) */
function aquecimentoDaFase(){
  garantirDia();
  if(S.revisao.ultimoAquecimento===hoje())return [];
  const n=Math.min(LEITNER.aquecimento,revisaoRestanteDoDia());
  if(n<=0)return [];
  const qs=revisaoSelecionar(n).map(perguntaDoItem).filter(Boolean);
  if(!qs.length)return [];
  S.revisao.ultimoAquecimento=hoje();
  qs.forEach(q=>{q.__aquec=true;});
  return qs;
}
/* ao concluir uma fase: até 3 itens-chave entram na caixa 1 (os erros já entraram na hora; completa com os que demoraram mais) */
function revisaoPosFase(lic){
  if(lic.rev)return;
  const ctx={m:MATERIA,f:String(lic.l.id),w:lic.u.n};
  const erros=lic.hist.filter(h=>!h.ok).length;
  let vagas=Math.max(0,LEITNER.chavesPorFase-erros);
  const certos=lic.hist.filter(h=>h.ok&&!h.q.__item&&!h.q.__aquec&&!h.q.reforco&&!h.dica).sort((a,b)=>b.ms-a.ms);
  let novos=0;
  for(const h of certos){
    if(vagas<=0)break;
    if(revisaoIntroduzir(h.q,ctx)){vagas--;novos++;}
  }
  novos+=lic.hist.filter(h=>!h.ok&&!h.q.__item&&S.revisao.itens[chaveItem(h.q)]&&S.revisao.itens[chaveItem(h.q)][IT.N]<=1).length;
  if(novos&&S.diario)S.diario.c.itensNovos+=novos;
  if(typeof atualizarMissoes==='function')atualizarMissoes();
}
function cicloAulaRevista(){
  garantirDia();
  S.diario.c.aulaRevista++;
  S.semana.aulaRevista=(S.semana.aulaRevista||0)+1;
  atualizarMissoes();
}
