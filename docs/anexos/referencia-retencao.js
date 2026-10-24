/* Cálculo local de D1/D7/D30 e retorno no dia seguinte (FASE-2-especificacao.md, seção 7).
   Entrada: lista de eventos {e, d:'AAAA-MM-DD', pid}. "Dia ativo" = dia com pelo menos 1 'bloco_fim'.
   Rodar: node referencia-retencao.js */
const idx=s=>{const[a,b,c]=s.split('-').map(Number);return Math.round(Date.UTC(a,b-1,c)/864e5);};
const diasAtivos=ev=>{const m={};ev.filter(x=>x.e==='bloco_fim').forEach(x=>{(m[x.pid]=m[x.pid]||new Set()).add(x.d);});return m;};
function retencao(ev,hoje){
  const A=diasAtivos(ev),out={D1:[0,0],D7:[0,0],D30:[0,0],D1j:[0,0],D7j:[0,0],D30j:[0,0],curr:[0,0]};
  for(const pid in A){
    const dias=[...A[pid]].map(idx).sort((a,b)=>a-b),p=dias[0],set=new Set(dias),h=idx(hoje);
    [[1,'D1',1,1],[7,'D7',7,1],[30,'D30',30,2]].forEach(([n,k,_,folga])=>{
      if(p+n>h)return;                                   // ainda não deu tempo: fora do denominador
      out[k][1]++; if(set.has(p+n))out[k][0]++;           // estrita: exatamente no dia N
      out[k+'j'][1]++; for(let j=Math.max(1,n-folga);j<=n+folga;j++)if(set.has(p+j)){out[k+'j'][0]++;break;}  // janela
    });
    // retorno no dia seguinte (parecido com o CURR [01-A25]): dia ativo com outro dia ativo nos 7 dias anteriores
    dias.forEach(d=>{ if(d+1>h)return; let recente=false; for(let j=1;j<=7;j++)if(set.has(d-j))recente=true;
      if(recente){out.curr[1]++; if(set.has(d+1))out.curr[0]++;} });
  }
  const r=k=>out[k][1]?+(out[k][0]/out[k][1]).toFixed(2):null;
  return {D1:r('D1'),D7:r('D7'),D30:r('D30'),D1_janela:r('D1j'),D7_janela:r('D7j'),D30_janela:r('D30j'),retornoDiaSeguinte:r('curr'),n:{D1:out.D1[1],D7:out.D7[1],D30:out.D30[1],curr:out.curr[1]}};
}
function coortes(ev){ // semana ISO do primeiro dia ativo
  const A=diasAtivos(ev),c={};
  for(const pid in A){const p=[...A[pid]].sort()[0],d=new Date(idx(p)*864e5),q=new Date(Date.UTC(d.getUTCFullYear(),d.getUTCMonth(),d.getUTCDate()));
    q.setUTCDate(q.getUTCDate()+4-(q.getUTCDay()||7));const y=q.getUTCFullYear(),w=Math.ceil(((q-Date.UTC(y,0,1))/864e5+1)/7);
    (c[y+'-S'+String(w).padStart(2,'0')]=c[y+'-S'+String(w).padStart(2,'0')]||[]).push(pid);}
  return c;
}
module.exports={retencao,coortes};
if(require.main===module){
  const A=require('assert'),mk=(pid,ds)=>ds.map(d=>({e:'bloco_fim',d,pid}));
  const ev=[...mk('a',['2026-10-01','2026-10-02','2026-10-08','2026-10-31']),...mk('b',['2026-10-01','2026-10-05']),...mk('c',['2026-10-20'])];
  const r=retencao(ev,'2026-11-05');
  A.equal(r.D1,0.33);  A.equal(r.n.D1,3);   // só a voltou no dia 1 (1 de 3)
  A.equal(r.D7,0.33);  A.equal(r.D1_janela,0.33);A.equal(r.D30,0.5);  // D30: só a e b entram (c ainda não completou 30 dias); a jogou em 31/10 = dia 30
  console.log(JSON.stringify(r));
  A.equal(Object.keys(coortes(ev)).length,2);
  console.log('ok');
}
