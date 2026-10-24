/* ---------- caderno de erros e revisão do mundo ---------- */
function chaveQ(q){return q.prompt+'||'+q.answer;}
function guardarErrado(q){
  const n=MATERIA+LIC.u.n;const lista=S.errados[n]||[];
  const k=chaveQ(q);
  if(!lista.some(x=>chaveQ(x)===k)){
    const c={type:q.type,prompt:q.prompt,answer:q.answer};
    if(q.options)c.options=q.options.slice();
    if(q.figure)c.figure=q.figure;
    lista.push(c);
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
    exemplo:'Se travar em alguma, volte na fase daquele assunto e leia a aula de novo — ela continua lá, sempre aberta.',
    dica:'Cada pergunta que você acertar aqui sai do seu caderno de erros. Acertando todas, o caderno fica limpo!'}};
  LIC={ui:ui,li:-1,u:u,l:falso,qs:qs,base:qs.length,i:0,passo:0,vidas:5,erros:0,acertos:0,
       combo:0,melhorCombo:0,etapa:'aula',resp:null,digitado:'',conferido:false,dica:false,rev:true,
       md:{c:0,d:0,u:0},miss:{t:'Revisão do Mundo '+u.n,abre:'',fim:'Revisão concluída!'},
       cap:(CAP_ATUAL?CAP_ATUAL[u.n]:null)};
  $('#licao').classList.add('on');
  $('#revisao').classList.remove('on');
  $('#licao').style.setProperty('--ub',corUnidade(u));
  document.body.style.overflow='hidden';
  pintarLicao();
}

/* ---------- rever a aula ---------- */
function abrirRevisao(){
  const ps=passosDe(LIC.l);
  let h='';ps.forEach((_,k)=>{h+=blocoPasso(ps,k,false);});
  $('#rev-corpo').innerHTML='<div class="lc-in">'+h+'</div>';
  $('#rev-titulo').textContent=LIC.l.title;
  $('#revisao').classList.add('on');
}

