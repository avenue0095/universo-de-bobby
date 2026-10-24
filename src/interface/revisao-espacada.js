/* ---------- caderno de erros espaçado (caixas tipo Leitner) ----------
   docs/FASE-2-especificacao.md, seção 2. Cinco caixas com intervalos de 1, 3, 7, 14 e 30 dias (hipótese a calibrar).
   Entram na fila: todo ERRO e até 3 itens-chave por fase. A criança nunca vê "87 pendentes".
   Cada item em S.revisao.itens[chave] é um array compacto:
     [caixa, vence, n, acertos, lapsos, ultimo, dificil, dom]       (dom: 0, 1 = 1 acerto na caixa 5, 2 = dominado)
   e a pergunta congelada fica em S.revisao.congelados[chave]. */
const LEITNER={intervalos:[1,3,7,14,30],maxPorDia:10,chavesPorFase:3,aquecimento:3,
  atrasoMax:2,voltaDominado:60,amostraDominado:20,maxCongelados:600,filaMax:3};
const IT={CAIXA:0,VENCE:1,N:2,AC:3,LAPSOS:4,ULTIMO:5,DIFICIL:6,DOM:7};
const intervaloDe=caixa=>LEITNER.intervalos[Math.max(1,Math.min(5,caixa))-1];

const chaveItem=q=>'er:'+fnv8(q.prompt+'||'+q.answer);
/* guarda a pergunta inteira (menos o que é só da tela), para refazer igualzinha: fração precisa de 'partes',
   sílabas de 'pecas' etc. O caderno antigo só guardava tipo, enunciado, resposta e opções. */
function congelarPergunta(q,ctx){
  const c={};
  Object.keys(q).forEach(k=>{
    if(k.indexOf('__')===0||typeof q[k]==='function')return;
    c[k]=q[k];
  });
  c.m=(ctx&&ctx.m)||'mat';c.f=(ctx&&ctx.f)||'';c.w=(ctx&&ctx.w)||0;c.sk='';
  return JSON.parse(JSON.stringify(c));
}
function perguntaDoItem(chave){
  const c=S.revisao.congelados[chave];
  if(!c)return null;
  const q=JSON.parse(JSON.stringify(c));
  delete q.m;delete q.f;delete q.w;delete q.sk;
  q.__item=chave;
  const it=S.revisao.itens[chave];
  if(it&&it[IT.LAPSOS]>0)q.__lapso=true;
  return q;
}
function ctxDaFase(){
  const id=(typeof LIC==='object'&&LIC&&LIC.l&&LIC.l.id)||'';
  const u=(typeof LIC==='object'&&LIC&&LIC.u)||null;
  return {m:MATERIA,f:String(id),w:u?u.n:0};
}
function aparaCongelados(){
  const ks=Object.keys(S.revisao.congelados);
  if(ks.length<=LEITNER.maxCongelados)return;
  /* sobra: tira primeiro os dominados, depois os mais antigos */
  const nota=k=>{const it=S.revisao.itens[k];return it?(it[IT.DOM]===2?0:1)*1e6+(idxDia(it[IT.ULTIMO]||it[IT.VENCE])||0):-1;};
  ks.sort((a,b)=>nota(a)-nota(b)).slice(0,ks.length-LEITNER.maxCongelados).forEach(k=>{
    delete S.revisao.congelados[k];delete S.revisao.itens[k];});
}
/* aplica o resultado de uma resposta a um item que já existe. dica: 0 (nenhuma), 1 ou 2 */
function aplicarResultado(it,ok,dica,dia){
  it[IT.N]++;
  if(ok){
    it[IT.AC]++;
    if(!dica){
      const eraCinco=it[IT.CAIXA]===5;
      if(eraCinco&&it[IT.ULTIMO]!==dia){
        it[IT.DOM]=Math.min(2,(it[IT.DOM]||0)+1);
        if(it[IT.DOM]>=2){it[IT.VENCE]=somaDias(dia,LEITNER.voltaDominado);it[IT.ULTIMO]=dia;return it;}   /* dominado */
      }
      it[IT.CAIXA]=Math.min(5,it[IT.CAIXA]+1);
    }
    it[IT.VENCE]=somaDias(dia,intervaloDe(it[IT.CAIXA]));
  }else{
    it[IT.CAIXA]=Math.max(1,it[IT.CAIXA]-2);
    it[IT.VENCE]=somaDias(dia,1);
    it[IT.LAPSOS]++;it[IT.DOM]=0;
    if(it[IT.LAPSOS]>=3&&it[IT.CAIXA]<=2)it[IT.DIFICIL]=1;
  }
  it[IT.ULTIMO]=dia;
  return it;
}
/* Resposta a uma pergunta que JÁ está no caderno (sessão de revisão do dia). */
function revisaoResultado(chave,ok,dica){
  const it=S.revisao.itens[chave];if(!it)return null;
  const antes=it[IT.CAIXA];
  aplicarResultado(it,ok,dica||0,hoje());
  if(typeof cicloRevisaoItem==='function')cicloRevisaoItem(antes,it[IT.CAIXA],ok);
  return it;
}
/* Erro numa fase normal: o item entra na caixa 1 (vence amanhã) ou, se já estava lá, cai 2 caixas. */
function revisaoErro(q,ctx){
  const k=chaveItem(q),dia=hoje();
  if(S.revisao.itens[k]){aplicarResultado(S.revisao.itens[k],false,0,dia);return k;}
  S.revisao.congelados[k]=congelarPergunta(q,ctx||ctxDaFase());
  S.revisao.itens[k]=[1,somaDias(dia,1),1,0,1,dia,0,0];
  aparaCongelados();
  return k;
}
/* Item-chave da fase concluída: entra na caixa 1, vence amanhã, qualquer que tenha sido o resultado.
   Respeita o freio: com a fila cheia, item novo espera. Devolve true se entrou. */
function revisaoIntroduzir(q,ctx){
  const k=chaveItem(q),dia=hoje();
  if(S.revisao.itens[k])return false;
  if(revisaoVencidos(dia).length>=S.config.revisaoPorDia*2)return false;
  S.revisao.congelados[k]=congelarPergunta(q,ctx||ctxDaFase());
  S.revisao.itens[k]=[1,somaDias(dia,1),1,1,0,dia,0,0];
  aparaCongelados();
  return true;
}
/* esquecimento provável: atrasou mais de 2x o intervalo -> cai 1 caixa e vence hoje (uma vez por dia) */
function revisaoAjustaAtrasos(dia){
  if(S.revisao.ajustadoEm===dia)return;
  Object.keys(S.revisao.itens).forEach(k=>{
    const it=S.revisao.itens[k];
    if(it[IT.DOM]===2)return;
    const atraso=difDias(it[IT.VENCE],dia);
    if(atraso>LEITNER.atrasoMax*intervaloDe(it[IT.CAIXA])){it[IT.CAIXA]=Math.max(1,it[IT.CAIXA]-1);it[IT.VENCE]=dia;}
  });
  S.revisao.ajustadoEm=dia;
}
/* a fila nunca vira culpa: se há mais de 3x o limite vencido, os itens de caixa 3 ou mais esperam mais um pouco */
function revisaoAliviaFila(dia,vencidos){
  const limite=S.config.revisaoPorDia;
  if(vencidos.length<=LEITNER.filaMax*limite||S.revisao.aliviadoEm===dia)return vencidos;
  vencidos.forEach(k=>{
    const it=S.revisao.itens[k];
    if(it[IT.CAIXA]>=3)it[IT.VENCE]=somaDias(dia,Math.ceil(intervaloDe(it[IT.CAIXA])/2));
  });
  S.revisao.aliviadoEm=dia;
  return Object.keys(S.revisao.itens).filter(k=>S.revisao.itens[k][IT.VENCE]<=dia);
}
/* itens que vencem hoje (dominados só voltam numa amostra de 5%, e só de 60 em 60 dias) */
function revisaoVencidos(dia){
  dia=dia||hoje();
  const todos=Object.keys(S.revisao.itens).filter(k=>{
    const it=S.revisao.itens[k];
    if(it[IT.VENCE]>dia)return false;
    if(it[IT.DOM]===2)return fnv1a(k+'|'+dia)%LEITNER.amostraDominado===0;
    return true;
  });
  return todos;
}
function revisoesHoje(){return ((S.stats.dias[hoje()]||{}).rev)||0;}
function revisaoRestanteDoDia(){return Math.max(0,LEITNER.maxPorDia-revisoesHoje());}
/* Escolhe até 'n' itens: mais atrasados em proporção ao intervalo, caixas baixas primeiro, pelo menos 1 de cada
   matéria que tenha vencido, e nunca 3 seguidos da mesma matéria/fase. */
function revisaoSelecionar(n,dia){
  dia=dia||hoje();
  revisaoAjustaAtrasos(dia);
  let venc=revisaoVencidos(dia);
  venc=revisaoAliviaFila(dia,venc).filter(k=>S.revisao.itens[k][IT.VENCE]<=dia&&S.revisao.congelados[k]);
  const atraso=k=>{const it=S.revisao.itens[k];return (difDias(it[IT.VENCE],dia)+1)/intervaloDe(it[IT.CAIXA]);};
  venc.sort((a,b)=>atraso(b)-atraso(a)||S.revisao.itens[a][IT.CAIXA]-S.revisao.itens[b][IT.CAIXA]||(a<b?-1:1));
  const lim=Math.max(0,Math.min(n,revisaoRestanteDoDia()));
  const escolha=[];
  ['mat','pt','en'].forEach(m=>{
    const k=venc.find(x=>S.revisao.congelados[x].m===m&&escolha.indexOf(x)<0);
    if(k&&escolha.length<lim)escolha.push(k);
  });
  venc.forEach(k=>{if(escolha.length<lim&&escolha.indexOf(k)<0)escolha.push(k);});
  /* intercalação: reordena para não repetir a mesma matéria/fase 3 vezes seguidas */
  const tag=k=>S.revisao.congelados[k].m+'/'+S.revisao.congelados[k].f;
  const fila=escolha.slice(),saida=[];
  while(fila.length){
    let i=0;
    for(;i<fila.length;i++){
      const n2=saida.length;
      if(!(n2>=2&&tag(saida[n2-1])===tag(fila[i])&&tag(saida[n2-2])===tag(fila[i])))break;
    }
    saida.push(fila.splice(i<fila.length?i:0,1)[0]);
  }
  return saida;
}
function revisaoContagens(){
  const venc=revisaoVencidos(hoje());
  return {vencidos:venc.length,total:Object.keys(S.revisao.itens).length};
}
