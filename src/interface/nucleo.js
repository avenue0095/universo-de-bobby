/* ---------- núcleo: dia local, hash e sorteio com semente ----------
   Sem DOM e sem estado: estas funções rodam igual no navegador e nos testes em Node.
   Regra do dia: SEMPRE o calendário local do aparelho. new Date().toISOString() é UTC e, no Brasil (UTC-3),
   depois das 21h já devolve o dia seguinte (padrão do cofre: padrao-toisostring-e-utc-a-data-de-hoje-e-local). */
const _p2=n=>String(n).padStart(2,'0');
function diaLocal(agora){
  const d=agora instanceof Date?agora:(agora!==undefined&&agora!==null?new Date(agora):new Date());
  return d.getFullYear()+'-'+_p2(d.getMonth()+1)+'-'+_p2(d.getDate());
}
const hoje=()=>diaLocal();
/* número do dia (inteiro) a partir de 'AAAA-MM-DD', sem fuso: diferenças de dias nunca erram por horário de verão */
function idxDia(s){
  const m=/^(\d{4})-(\d{2})-(\d{2})$/.exec(String(s));
  if(!m)return NaN;
  return Math.round(Date.UTC(+m[1],+m[2]-1,+m[3])/864e5);
}
const difDias=(a,b)=>idxDia(b)-idxDia(a);
function somaDias(s,n){
  const d=new Date(idxDia(s)*864e5+n*864e5);
  return d.getUTCFullYear()+'-'+_p2(d.getUTCMonth()+1)+'-'+_p2(d.getUTCDate());
}
/* 0 = domingo ... 6 = sábado */
const diaSemana=s=>new Date(idxDia(s)*864e5).getUTCDay();
const ehDia=s=>/^\d{4}-\d{2}-\d{2}$/.test(String(s))&&!isNaN(idxDia(s));
/* semana ISO 'AAAA-Snn' */
function semanaIso(s){
  const q=new Date(idxDia(s)*864e5);
  q.setUTCDate(q.getUTCDate()+4-(q.getUTCDay()||7));
  const y=q.getUTCFullYear(),w=Math.ceil(((q-Date.UTC(y,0,1))/864e5+1)/7);
  return y+'-S'+_p2(w);
}
/* hash FNV-1a de 32 bits, síncrono e idêntico ao do script de build do áudio */
function fnv1a(str){
  let h=0x811c9dc5;str=String(str);
  for(let i=0;i<str.length;i++){h^=str.charCodeAt(i);h=Math.imul(h,0x01000193);}
  return h>>>0;
}
const fnv8=s=>fnv1a(s).toString(16).padStart(8,'0');
function mulberry32(a){
  return function(){
    a=(a+0x6D2B79F5)>>>0;let t=a;
    t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);
    return((t^(t>>>14))>>>0)/4294967296;
  };
}
const escolheCom=(rnd,lista)=>lista[Math.floor(rnd()*lista.length)];
/* sorteio local de identificador (não é segredo, não sai do aparelho) */
function sorteioId(n){
  const a='abcdefghjkmnpqrstuvwxyz23456789';let t='';
  for(let i=0;i<(n||12);i++)t+=a.charAt(Math.floor(Math.random()*a.length));
  return t;
}
