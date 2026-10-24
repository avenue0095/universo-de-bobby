/* Simulação da carga de revisão (seção 2.5). Modelo ASSUMIDO (não medido com crianças):
   memória do item = exp(-dias/estabilidade); estabilidade cresce com a caixa. */
const INT=[1,3,7,14,30];            // intervalos por caixa (dias)
const EST=[3,8,20,45,100];          // estabilidade assumida por caixa (dias)
function rodar({novosPorDia,diasPorSemana,limite,semanas,seed=1}){
  let r=seed;const rnd=()=>(r=(r*1664525+1013904223)>>>0)/4294967296;
  const itens=[];let dia=0,sobra=[],hist=[];
  for(let sem=0;sem<semanas;sem++)for(let d=0;d<7;d++,dia++){
    if(d>=diasPorSemana)continue;
    const pend=itens.filter(i=>i.due<=dia).length;
    const quantos=Math.max(0,Math.min(novosPorDia,limite-pend));      // freio: item novo só entra se a fila couber
    for(let k=0;k<quantos;k++)itens.push({c:0,due:dia+1,ult:dia,n:0});
    const razao=i=>(dia-i.due)/INT[i.c];                                // prioridade = atraso relativo ao intervalo
    const vencidos=itens.filter(i=>i.due<=dia).sort((a,b)=>a.due-b.due||a.c-b.c);
    const fazer=vencidos.slice(0,limite);
    let ac=0;
    fazer.forEach(i=>{const p=Math.exp(-(dia-i.ult)/EST[i.c]);const ok=rnd()<p;ac+=ok;
      if(ok)i.c=Math.min(4,i.c+1);else i.c=Math.max(0,i.c-2);i.ult=dia;i.due=dia+INT[i.c];i.n++;});
    itens.forEach(i=>{if(dia-i.due>2*INT[i.c]&&i.c>0){i.c--;i.due=dia+1;}});
    hist.push({dia,devidos:vencidos.length,feitos:fazer.length,acerto:fazer.length?ac/fazer.length:null});
  }
  const ult=hist.slice(-10);
  return {devidoMedio:+(ult.reduce((a,x)=>a+x.devidos,0)/ult.length).toFixed(1),
          feitoMedio:+(ult.reduce((a,x)=>a+x.feitos,0)/ult.length).toFixed(1),
          acertoMedio:+(ult.reduce((a,x)=>a+(x.acerto||0),0)/ult.length).toFixed(2),
          itens:itens.length,caixa5:itens.filter(i=>i.c===4).length};
}
for(const cfg of [{novosPorDia:6,diasPorSemana:4},{novosPorDia:6,diasPorSemana:6},{novosPorDia:10,diasPorSemana:5},{novosPorDia:4,diasPorSemana:3}])
  for(const limite of [8,12])
    console.log(JSON.stringify(cfg),'limite',limite,JSON.stringify(rodar({...cfg,limite,semanas:12})));
