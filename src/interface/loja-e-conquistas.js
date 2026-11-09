/* ---------- conquistas ---------- */
const CONQUISTAS=[
 {id:'c1',n:'Primeira fase',d:'Concluir 1 fase',ok:()=>fases()>=1},
 {id:'c2',n:'Explorador',d:'Concluir 5 fases',ok:()=>fases()>=5},
 {id:'c3',n:'Meio caminho',d:'Concluir 25 fases',ok:()=>fases()>=25},
 {id:'c4',n:'Mapa inteiro',d:'Concluir as 50 fases',ok:()=>fases()>=50},
 {id:'c5',n:'Primeiro castelo',d:'Completar 1 mundo',ok:()=>mundosOk()>=1},
 {id:'c6',n:'Meia jornada',d:'Completar 5 mundos',ok:()=>mundosOk()>=5},
 {id:'c7',n:'Rei dos mundos',d:'Completar os 10 mundos',ok:()=>mundosOk()>=10},
 {id:'c8',n:'Três dias',d:'3 dias de exploração',ok:()=>diasDeExploracao()>=3},
 {id:'c9',n:'Uma semana',d:'7 dias de exploração',ok:()=>diasDeExploracao()>=7},
 {id:'c10',n:'Sem errar',d:'Uma fase sem nenhum erro',ok:()=>Object.keys(S.feitas).some(k=>estrelasDaFase(k)===3)},
 {id:'c11',n:'Cofre cheio',d:'Ganhar 500 moedas',ok:()=>(S.xp||0)>=500},
 {id:'c12',n:'Perfeccionista',d:'3 estrelas em 10 fases',ok:()=>Object.keys(S.feitas).filter(k=>estrelasDaFase(k)===3).length>=10}
];
const daMateria=k=>MATERIA==='pt'?k.charAt(0)==='p':(MATERIA==='en'?k.charAt(0)==='e':/^[0-9]/.test(k));
const fases=()=>Object.keys(S.feitas).filter(k=>k.indexOf('rev')!==0&&daMateria(k)).length;
const mundosOk=()=>UNITS.filter(u=>mundoCompleto(u)).length;
/* aceita tanto o formato novo (número) quanto qualquer coisa estranha vinda de um backup antigo */
const estrelasDaFase=k=>{
  const v=S.feitas[k];
  if(typeof v==='number')return v;
  if(v&&typeof v==='object'&&typeof v.estrelas==='number')return v.estrelas;
  return v?1:0;
};
const estrelasTotal=()=>Object.keys(S.feitas).reduce((a,k)=>a+estrelasDaFase(k),0);

