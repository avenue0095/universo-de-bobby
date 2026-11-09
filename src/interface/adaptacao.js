/* ---------- 1G · adaptação por habilidade (BKT por gerador) ----------
   docs/mesa/04-pedagogia-e-retencao.md §7a e docs/FASE-2-especificacao.md §3.
   Habilidade pequena = um gerador de pergunta (maker). Chave: 'idDaFase:posicao' (ex.: '1.3:2', 'p4.1:0', 'e2.5:5').
   A posição é a ordem do maker dentro da fase; ao inserir maker novo, ponha NO FIM da lista para não embaralhar o que já foi guardado.
   Estado: S.habil[chave] = {p, n, a, v, r, d:[dias], u, dom}
     p = probabilidade de domínio (pL) na data u; n = respostas de primeira; a = acertos de primeira; v = acertou depois (na irmã ou na repetição);
     r = acertos de primeira em revisão mista (caderno espaçado); d = dias distintos com pL >= 0,90; u = último dia visto; dom = dominada.
   Nada disto aparece para a criança: nem nível, nem nota, nem "subiu" ou "desceu". Só o responsável vê, em palavras, no relatório. */
const BKT={
  /* pT abaixo do da mesa 04 (0,20 a 0,25): com 0,20 o chute puro em escolha de 4 terminava em pL 0,42 e 50% de acerto em 0,80 (simulação
     em testes/adaptacao.js), o que contraria os testes 2 e 3 da própria mesa. Com 0,12 a 0,15: chute 0,29, metade 0,69, 100% chega a 0,90
     em 3 respostas. Continua OPINIÃO a calibrar com o piloto. */
  mat:{pL0:.25,pT:.12,pS:.10},pt:{pL0:.30,pT:.12,pS:.10},en:{pL0:.15,pT:.15,pS:.15},
  alvoFaixa:{f78:.85,f910:.80,f1112:.75},                 /* alvo de acerto previsto: 0,85 na faixa menor, 0,75 na maior (faixa 70 a 85%) */
  dominio:.90,queda:.75,meiaVida:45,exemploAbaixo:.30,exemploDepois:6,maxHabil:1500
};
const materiaDoId=id=>{id=String(id||'');return id.charAt(0)==='p'?'pt':(id.charAt(0)==='e'?'en':'mat');};
let _MK_CHAVE=null;
function _mapaDeGeradores(){
  _MK_CHAVE=new Map();
  [UNITS_MAT,UNITS_PT,UNITS_EN].forEach(us=>us.forEach(u=>u.lessons.forEach(l=>(l.makers||[]).forEach((m,i)=>{if(!_MK_CHAVE.has(m))_MK_CHAVE.set(m,l.id+':'+i);}))));
  return _MK_CHAVE;
}
function chaveDoGerador(mk){
  if(typeof mk!=='function')return '';
  const m=_MK_CHAVE||_mapaDeGeradores();
  if(!m.has(mk))_mapaDeGeradores();          /* conteúdo acrescentado depois (treinar por tema, 3º ano) */
  return _MK_CHAVE.get(mk)||'';
}
const chaveDaPergunta=q=>q?(q.__sk||(typeof q.__mk==='function'?chaveDoGerador(q.__mk):'')):'';
const faseDaChave=k=>String(k).split(':')[0];
/* chute: escolha de N opções = 1/N; verdadeiro ou falso = 1/2; montar, digitar, arrastar = quase zero */
function chuteDe(q,mat){
  if(q&&q.verbo==='ligar'&&Array.isArray(q.pares))return Math.max(.08,1/q.pares.length);
  if(q&&Array.isArray(q.options)&&q.options.length>=2)return Math.min(.5,1/q.options.length);
  return mat==='mat'?.10:.12;
}
function habilNova(mat){return {p:BKT[mat||'mat'].pL0,n:0,a:0,v:0,r:0,d:[],u:'',dom:false};}
function habilDe(chave){
  S.habil=S.habil||{};
  return S.habil[chave]||habilNova(materiaDoId(faseDaChave(chave)));
}
/* decaimento: pL x 0,5^(dias/45). Calculado na leitura, sem gravar (abrir a fase várias vezes não decai de novo) */
function pAtual(h,dia){
  if(!h||!h.u)return h?h.p:0;
  const dd=Math.max(0,difDias(h.u,dia||hoje()));
  return dd?h.p*Math.pow(.5,dd/BKT.meiaVida):h.p;
}
function bktPrever(p,par,pG){return p*(1-par.pS)+(1-p)*pG;}
/* atualização de uma resposta (Corbett e Anderson, 1995). Devolve o objeto atualizado. */
function bktAtualizar(h,ok,par,pG,dia){
  const pL=pAtual(h,dia);
  const dado=ok?(pL*(1-par.pS))/(pL*(1-par.pS)+(1-pL)*pG):(pL*par.pS)/(pL*par.pS+(1-pL)*(1-pG));
  h.p=Math.min(.999,Math.max(.001,dado+(1-dado)*par.pT));
  if(h.p>=BKT.dominio&&h.d.indexOf(dia)<0)h.d.push(dia);
  if(h.p<BKT.queda){h.d=[];h.dom=false;}
  if(h.d.length>2)h.d=h.d.slice(-2);
  h.u=dia;
  return h;
}
/* dominada: 2 dias distintos acima de 0,90 e pelo menos 1 acerto de primeira em revisão mista */
const bktDominada=h=>!!h&&h.d.length>=2&&(h.r||0)>=1;

/* registra a resposta. ctx: {primeira, rev, dia}. Só a primeira tentativa de uma pergunta nova conta para o BKT e para o "acerto de primeira";
   a irmã e a repetição contam como "acertou depois" (v). */
function adaptRegistrar(q,ok,ctx){
  ctx=ctx||{};
  const chave=chaveDaPergunta(q);if(!chave)return null;
  const dia=ctx.dia||hoje(),mat=materiaDoId(faseDaChave(chave)),par=BKT[mat];
  S.habil=S.habil||{};
  const h=S.habil[chave]||habilNova(mat);
  if(!ctx.primeira&&ok)h.v=(h.v||0)+1;
  if(!ctx.primeira&&!ctx.irma){S.habil[chave]=h;return h;}      /* repetição da mesma pergunta: mede memória da resposta, não a habilidade */
  bktAtualizar(h,ok,par,chuteDe(q,mat),dia);
  if(ctx.primeira){h.n++;if(ok)h.a++;}
  if(ok&&ctx.rev)h.r=(h.r||0)+1;
  h.dom=bktDominada(h);
  S.habil[chave]=h;
  semanaDeHabil(chave,h,dia);
  aparaHabil();
  return h;
}
/* guarda o pL de cada habilidade no começo da semana (para o "brilhou em" do relatório) */
function semanaDeHabil(chave,h,dia){
  const w=semanaIso(dia);
  if(!S.habilSemana||S.habilSemana.w!==w)S.habilSemana={w:w,p0:{}};
  if(S.habilSemana.p0[chave]===undefined){
    /* valor ANTES desta resposta: aproximado pelo pL0 quando é a primeira vez que aparece */
    S.habilSemana.p0[chave]=h.n<=1?BKT[materiaDoId(faseDaChave(chave))].pL0:Math.round(h.p*1000)/1000;
  }
}
function aparaHabil(){
  const ks=Object.keys(S.habil);if(ks.length<=BKT.maxHabil)return;
  ks.sort((a,b)=>(idxDia(S.habil[a].u)||0)-(idxDia(S.habil[b].u)||0)).slice(0,ks.length-BKT.maxHabil).forEach(k=>delete S.habil[k]);
}
const alvoDaFaixa=()=>BKT.alvoFaixa[(typeof S==='object'&&S&&S.faixa)||'f910']||.80;
/* escolhe o próximo gerador: probabilidade prevista mais perto do alvo, sem o mesmo gerador 3 vezes seguidas, dominado fora da rotação,
   o que nunca apareceu ganha uma chance, e o que já saiu nesta fase pesa um pouco (para variar). Sem dado nenhum, vira um embaralhar. */
function escolherGerador(makers,ultimos,opc){
  opc=opc||{};
  const alvo=opc.alvo||alvoDaFaixa(),dia=opc.dia||hoje(),rnd=opc.rnd||Math.random,cont=opc.cont||{};
  let melhor=null,custoMin=Infinity;
  makers.forEach((mk,i)=>{
    const k=opc.chaves?opc.chaves[i]:chaveDoGerador(mk);
    const mat=materiaDoId(faseDaChave(k)),par=BKT[mat];
    const h=(S.habil&&S.habil[k])||null;
    const p=h?pAtual(h,dia):par.pL0;
    let custo=Math.abs(bktPrever(p,par,opc.pG||.25)-alvo);
    const u2=ultimos.slice(-2);
    if(u2.length===2&&u2[0]===mk&&u2[1]===mk)custo+=10;      /* nunca 3 seguidas */
    else if(u2[u2.length-1]===mk)custo+=.30;
    if(h&&h.dom)custo+=.50;
    if(!h||!h.n)custo-=.10;
    custo+=(cont[i]||0)*.06+rnd()*.04;
    if(custo<custoMin){custoMin=custo;melhor=i;}
  });
  return melhor===null?null:makers[melhor];
}
/* a "sacola" da fase em ordem adaptativa (substitui o embaralhar de genQuestions) */
function ordemAdaptativa(makers,n){
  if(!makers||!makers.length)return [];
  const seq=[],cont={},chaves=makers.map(chaveDoGerador);
  const tot=Math.max(makers.length,n||makers.length);
  for(let t=0;t<tot;t++){
    const mk=escolherGerador(makers,seq,{cont:cont,chaves:chaves});
    const i=makers.indexOf(mk);cont[i]=(cont[i]||0)+1;seq.push(mk);
  }
  return seq;
}
/* exemplo resolvido: alguma habilidade da fase com 6 respostas ou mais e pL abaixo de 0,30 */
function precisaExemplo(lesson,dia){
  if(!lesson||!lesson.makers)return false;
  return lesson.makers.some((mk,i)=>{const h=S.habil&&S.habil[lesson.id+':'+i];return !!h&&h.n>=BKT.exemploDepois&&pAtual(h,dia)<BKT.exemploAbaixo;});
}
/* resumo por fase para o relatório: respostas de primeira, acertos de primeira, acertou depois, pL médio */
function resumoDaFase(lid,dia){
  const r={n:0,a:0,v:0,p:0,k:0,dom:0};
  Object.keys(S.habil||{}).forEach(k=>{
    if(faseDaChave(k)!==lid)return;const h=S.habil[k];
    r.n+=h.n;r.a+=h.a;r.v+=h.v||0;r.p+=pAtual(h,dia);r.k++;if(h.dom)r.dom++;
  });
  r.p=r.k?r.p/r.k:0;
  return r;
}

/* ---------- diagnóstico de entrada: escada de unidades, até 10 perguntas por matéria ----------
   Começa na unidade da faixa; em cada unidade sorteia das fases x.3 e x.5 (as de integração).
   2 de 2 certas: sobe 2. 1 de 2: mais uma na mesma unidade (2 de 3 passa, 1 de 3 não). 0 de 2: desce 1.
   Para quando há uma unidade que passou logo abaixo de uma que não passou, ou em 10 perguntas.
   Saída: unidade de início; cada resposta semeia o BKT (certo 0,70, errado 0,15) e as unidades abaixo do início ganham pL 0,85.
   Não mostra nota; não dá moeda nem XP; pode ser refeito pelo responsável. */
const DIAG={max:10,inicio:{mat:{f78:1,f910:2,f1112:4},pt:{f78:1,f910:3,f1112:5},en:{f78:1,f910:1,f1112:1}},
  certo:.70,errado:.15,abaixo:.85};
function diagNovo(mat,faixa){
  return {m:mat,u:DIAG.inicio[mat][faixa]||1,res:{},n:0,fim:false,inicio:0,hist:[]};
}
function diagUnidades(mat){return MATERIAS[mat].units();}
/* próxima pergunta do diagnóstico (gerada pelo gerador de verdade da fase x.3 ou x.5) */
function diagPergunta(dg){
  const us=diagUnidades(dg.m),u=us[dg.u-1];if(!u)return null;
  const r=dg.res[dg.u]||{c:0,t:0};
  const l=u.lessons[Math.min(u.lessons.length-1,r.t%2===0?2:4)];
  /* entre algumas perguntas do gerador, a que menos dá para acertar no chute (verdadeiro ou falso acerta metade das vezes) */
  const qs=(genQuestions(l,6)||[]).filter(x=>x&&!x.__rep&&!x.reforco);
  qs.sort((a,b)=>chuteDe(a,dg.m)-chuteDe(b,dg.m));
  const q=qs[0];
  if(!q)return null;
  q.__diag={u:dg.u,l:l.id};
  return q;
}
function _passou(r){return r&&((r.c>=2&&r.t<=3));}
function _falhou(r){return r&&((r.t>=2&&r.c===0)||(r.t>=3&&r.c<2));}
/* registra a resposta e anda a escada. Devolve true se o diagnóstico acabou. */
function diagResponder(dg,q,ok){
  const u=dg.u;dg.n++;
  const r=dg.res[u]||(dg.res[u]={c:0,t:0});r.t++;if(ok)r.c++;
  dg.hist.push([u,ok?1:0]);
  const chave=chaveDaPergunta(q);
  if(chave){const mat=materiaDoId(faseDaChave(chave));S.habil=S.habil||{};const h=S.habil[chave]||habilNova(mat);
    h.p=ok?DIAG.certo:DIAG.errado;h.u=hoje();S.habil[chave]=h;}
  const nU=diagUnidades(dg.m).length;
  if(_passou(r)){
    if(_falhou(dg.res[u+1])||u>=nU){return diagFechar(dg);}
    dg.u=Math.min(nU,u+(r.t===2?2:1));
    if(_passou(dg.res[dg.u]))dg.u=Math.min(nU,u+1);
  }else if(_falhou(r)){
    if(_passou(dg.res[u-1])||u<=1){return diagFechar(dg);}
    dg.u=Math.max(1,u-1);
    if(_falhou(dg.res[dg.u]))return diagFechar(dg);
  }
  if(dg.n>=DIAG.max)return diagFechar(dg);
  return false;
}
function diagFechar(dg){
  const nU=diagUnidades(dg.m).length,us=Object.keys(dg.res).map(Number);
  const pass=us.filter(u=>_passou(dg.res[u])),fal=us.filter(u=>_falhou(dg.res[u]));
  let ini;
  const maxP=pass.length?Math.max(...pass):0;
  const falAcima=fal.filter(u=>u>maxP);
  if(falAcima.length)ini=Math.min(...falAcima);
  else if(maxP)ini=Math.min(nU,maxP+1);
  else ini=fal.length?Math.max(1,Math.min(...fal)):dg.u;
  /* unidade em andamento sem veredito: a escada parou no teto de perguntas */
  if(!falAcima.length&&!maxP&&!fal.length)ini=dg.u;
  dg.inicio=Math.max(1,Math.min(nU,ini));dg.fim=true;
  /* unidades abaixo do início: todas as habilidades com pL 0,85 (sem XP, sem estrela: só a adaptação sabe) */
  const dia=hoje();
  diagUnidades(dg.m).forEach(u=>{if(u.n>=dg.inicio)return;u.lessons.forEach(l=>(l.makers||[]).forEach((mk,i)=>{
    const k=l.id+':'+i;const h=S.habil[k]||habilNova(dg.m);if(!h.n){h.p=Math.max(h.p,DIAG.abaixo);h.u=dia;S.habil[k]=h;}}));});
  S.diag=S.diag||{};
  S.diag[dg.m]={u:dg.inicio,dia:dia,n:dg.n};
  return true;
}
/* normaliza o que vem do aparelho ou de um backup */
function normalizaHabil(x){
  const o={};x=objDe(x);
  Object.keys(x).slice(0,BKT.maxHabil).forEach(k=>{
    if(!/^(p|e)?\d{1,2}\.\d{1,2}:\d{1,2}$/.test(k)&&!/^t[a-z]{1,3}\d{1,2}\.\d{1,2}:\d{1,2}$/.test(k))return;
    const h=objDe(x[k]);
    o[k]={p:numDe(h.p,.001,.999,BKT[materiaDoId(k)].pL0),n:intDe(h.n,0,1e6,0),a:intDe(h.a,0,1e6,0),v:intDe(h.v,0,1e6,0),r:intDe(h.r,0,1e6,0),
      d:listaDe(h.d,2).filter(ehDia),u:diaOuVazio(h.u),dom:!!h.dom};
    if(o[k].a>o[k].n)o[k].a=o[k].n;
  });
  return o;
}
function normalizaDiag(x){
  const o={};x=objDe(x);
  ['mat','pt','en'].forEach(m=>{const d=objDe(x[m]);if(d.u!==undefined)o[m]={u:intDe(d.u,1,10,1),dia:diaOuVazio(d.dia),n:intDe(d.n,0,10,0)};});
  return o;
}
function normalizaHabilSemana(x){
  x=objDe(x);const w=String(x.w||'');
  if(!/^\d{4}-S\d{2}$/.test(w))return {w:'',p0:{}};
  const p0={},src=objDe(x.p0);
  Object.keys(src).slice(0,BKT.maxHabil).forEach(k=>{if(/^[a-z0-9.:]{3,16}$/.test(k))p0[k]=numDe(src[k],0,1,0);});
  return {w:w,p0:p0};
}
