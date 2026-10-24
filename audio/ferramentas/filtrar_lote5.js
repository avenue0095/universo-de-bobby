// Regra do lote 5 (ajudas faladas). Uso: node filtrar_lote5.js <trio1: a,b,c> [trio2 ...] [--extra=t6.json,...]
// Entra no lote: quadro de origem-base (dica antes de responder, ajuda extra, resposta falada sozinha, falas) que aparece em TODAS as
// varreduras de pelo menos um trio de semeaduras (ou em qualquer arquivo --extra, que sao passadas curtas de saturacao rapida).
// Fica de fora, registrado em nao_gerados.json:
//  - "colagem": quadro que so existe na variante "depois do erro" (metodo + resposta, ou resposta + ajuda, colados sem corte de frase);
//  - "cauda longa": quadro de origem-base que nao se repete entre semeaduras (resposta por extenso dentro do texto).
const fs=require('fs');
const args=process.argv.slice(2); const extra=(args.find(a=>a.startsWith('--extra='))||'--extra=').slice(8).split(',').filter(Boolean);
const trios=args.filter(a=>!a.startsWith('--')).map(t=>t.split(','));
const key=x=>x.classe+'|'+x.idioma+'|'+x.texto;
const base=o=>!/apos erro/.test(o);
const estaveis=new Set(), vistos=new Map(), origens=new Map();
const reg=x=>{const k=key(x);if(!vistos.has(k))vistos.set(k,x);(origens.get(k)||origens.set(k,new Set()).get(k)).add(x.origem.replace(/^lote \d: /,''));};
for(const trio of trios){
  const sets=trio.map(f=>{const s=new Set();for(const x of require('./'+f+'.json')){reg(x);if(base(x.origem))s.add(key(x));}return s;});
  for(const k of sets[0]) if(sets.every(s=>s.has(k))) estaveis.add(k);
}
for(const f of extra) for(const x of require('./'+f)){reg(x);if(base(x.origem))estaveis.add(key(x));}
const novos=require('./novos.json'); const manter=[], fora=[];
const motivo=k=>[...origens.get(k)||[]].every(o=>!base(o))?'colagem':'cauda longa';
for(const n of novos){ if(!/^lote 5/.test(n.origem)){manter.push(n);continue;} (estaveis.has(key(n))?manter:fora).push(n); }
const temos=new Set(manter.map(key)); let add=0;
for(const k of estaveis){ if(!temos.has(k)){const x=Object.assign({},vistos.get(k));x.origem='lote 5: '+x.origem.replace(/^lote \d: /,'');manter.push(x);add++;} }
for(const k of vistos.keys()) if(!estaveis.has(k)&&!temos.has(k)&&!fora.some(f=>key(f)===k)&&/quadro|mask/.test(vistos.get(k).classe)) fora.push(vistos.get(k));
fs.writeFileSync('novos.json',JSON.stringify(manter));
const ng=fora.map(n=>({classe:n.classe,texto:n.texto,origem:n.origem.replace(/^lote \d: /,''),motivo:motivo(key(n))}));
fs.writeFileSync('nao_gerados.json',JSON.stringify(ng));
const c={};ng.forEach(x=>c[x.motivo]=(c[x.motivo]||0)+1);
console.log('estaveis',estaveis.size,'| novos.json',manter.length,'(+'+add+')','| nao gerados',ng.length,JSON.stringify(c));
