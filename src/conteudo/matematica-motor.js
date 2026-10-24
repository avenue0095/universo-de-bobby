/* ===== Motor de conteúdo — Trilha da Matemática ===== */
const R=(a,b)=>Math.floor(Math.random()*(b-a+1))+a;
const pick=a=>a[R(0,a.length-1)];
const shuf=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=R(0,i);[a[i],a[j]]=[a[j],a[i]];}return a;};
const NOMES=['Lívia','Enrico','Ana','Beto','Clara','Davi','Elisa','Théo','Manu','Rafa','Nina','Caio'];
const nome2=()=>{const a=pick(NOMES);let b=pick(NOMES);while(b===a)b=pick(NOMES);return [a,b];};
const fmt=n=>String(n).replace('.',',');
const r2=n=>Math.round(n*100)/100;
const money=n=>'R$&nbsp;'+n.toFixed(2).replace('.',',');
const dots=(n,cls)=>'<div class="dots '+(cls||'')+'">'+'<i></i>'.repeat(n)+'</div>';
const groups=(g,p)=>'<div class="grupos">'+Array.from({length:g},()=>'<div class="grupo">'+'<i></i>'.repeat(p)+'</div>').join('')+'</div>';
const frac=(a,b)=>'<span class="frac"><b>'+a+'</b><i>'+b+'</i></span>';
const U20=['zero','um','dois','três','quatro','cinco','seis','sete','oito','nove','dez','onze','doze','treze','catorze','quinze','dezesseis','dezessete','dezoito','dezenove'];
const DZ=['','','vinte','trinta','quarenta','cinquenta','sessenta','setenta','oitenta','noventa'];
const CT=['','cento','duzentos','trezentos','quatrocentos','quinhentos','seiscentos','setecentos','oitocentos','novecentos'];
function extenso(n){if(n<20)return U20[n];if(n<100){const d=Math.floor(n/10),u=n%10;return DZ[d]+(u?' e '+U20[u]:'');}if(n===100)return 'cem';if(n<1000){const c=Math.floor(n/100),r=n%100;return CT[c]+(r?' e '+extenso(r):'');}if(n===1000)return 'mil';return String(n);}
const mdc=(a,b)=>b?mdc(b,a%b):a;

/* material dourado: cubinho, barra (10) e placa (100). Quadradinho de 28 px para a criança conseguir contar (e tocar para marcar o que já contou).
   Tudo em SVG simples (a figura de uma pergunta errada é guardada no caderno e só aceita SVG). A barra são 2 grupos de 5 com separador visível. */
const _Q=(x,y,t)=>'<rect class="q" x="'+x+'" y="'+y+'" width="'+t+'" height="'+t+'" rx="5"/>';
function _grupo(x0){let h='';for(let i=0;i<5;i++)h+=_Q(x0+i*28,0,28);return h;}
const PLACA='<svg class="md placa" viewBox="0 0 120 120" role="img" aria-label="placa de 100"><rect x="1" y="1" width="118" height="118" rx="8"/><path class="grade" d="'+(()=>{let d='';for(let i=1;i<10;i++)d+='M'+(i*12)+' 1V119M1 '+(i*12)+'H119';return d;})()+'"/></svg>';
const BARRA='<svg class="md barra" viewBox="0 0 284 28" role="img" aria-label="barrinha de 10">'+_grupo(0)+'<path class="sep" d="M142 -3V31"/>'+_grupo(144)+'</svg>';
const CUBO='<svg class="md cubinho" viewBox="0 0 28 28" role="img" aria-label="cubinho de 1">'+_Q(0,0,28)+'</svg>';
function dourado(c,d,u,rot){
  let h='<div class="dourado-fig">';
  if(c)h+='<div class="md-col">'+PLACA.repeat(c)+(rot?'<span>'+c+' centena'+(c>1?'s':'')+'</span>':'')+'</div>';
  if(d)h+='<div class="md-col">'+BARRA.repeat(d)+(rot?'<span>'+d+' dezena'+(d>1?'s':'')+'</span>':'')+'</div>';
  if(u)h+='<div class="md-col cubs">'+CUBO.repeat(u)+(rot?'<span>'+u+' unidade'+(u>1?'s':'')+'</span>':'')+'</div>';
  return h+'</div>';
}
function blocos(prompt,alvo,o){return Object.assign({type:'blocos',prompt:prompt,answer:String(alvo)},o||{});}
function fracQ(prompt,a,b,o){return Object.assign({type:'fracao',prompt:prompt,answer:String(a),partes:b},o||{});}
function grupoQ(prompt,g,p,o){return Object.assign({type:'grupinhos',prompt:prompt,answer:String(g*p),alvoG:g,alvoP:p},o||{});}
function dinQ(prompt,v,o){return Object.assign({type:'dinheiro',prompt:prompt,answer:String(v).replace('.',',')},o||{});}

function mc(prompt,correct,wrongs,o){
  o=o||{};correct=String(correct);
  const set=[correct];
  (wrongs||[]).forEach(w=>{const s=String(w);if(!set.some(x=>x.trim()===s.trim())&&set.length<4)set.push(s);});
  /* Completa as opções quando a fase não mandou distratores suficientes.
     Três regras, porque criança de 7 a 12 anos ainda não estuda negativo e o app
     escreve decimal com vírgula:
       1) nunca oferecer número negativo;
       2) usar a mesma pontuação do gabarito (1,25 gera 1,75 — nunca 1.75);
       3) arredondar na casa do gabarito, senão aparece 0.30000000000000004 na tela. */
  const virg=correct.indexOf(',')>=0;
  const n=Number(correct.replace(',','.'));
  const casas=(correct.split(virg?',':'.')[1]||'').length;
  const esc=Math.pow(10,casas);
  const escreve=v=>{const t=v.toFixed(casas);return virg?t.replace('.',','):t;};
  let guard=0;
  while(set.length<3&&guard++<80){
    if(isNaN(n))break;
    /* metade das vezes um vizinho na mesma casa decimal (1,25 -> 1,28),
       metade um vizinho inteiro (1,25 -> 4,25): os dois enganam de verdade */
    const v=Math.round((casas&&R(0,1)?n+(R(1,9)*(R(0,1)?1:-1))/esc:n+(R(-8,8)||9))*esc)/esc;
    if(v<0)continue;
    const cand=escreve(v);
    if(cand!==correct&&set.indexOf(cand)<0)set.push(cand);
  }
  return Object.assign({type:'mc',prompt:prompt,options:shuf(set),answer:correct},o);
}
function inp(prompt,answer,o){return Object.assign({type:'input',prompt:prompt,answer:String(answer)},o||{});}
function tf(prompt,ok,o){return Object.assign({type:'mc',tf:true,prompt:prompt,options:['Verdadeiro','Falso'],answer:ok?'Verdadeiro':'Falso'},o||{});}

/* aula: {ideia, exemplo, dica} */
function L(id,glyph,title,teach,makers){return {id:id,glyph:glyph,title:title,teach:teach,makers:makers};}

