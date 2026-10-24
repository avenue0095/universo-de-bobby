/* Implementação de referência da ofensiva (FASE-2-especificacao.md, seção 5.3).
   Sem DOM, sem localStorage. Datas são strings 'AAAA-MM-DD' do calendário LOCAL.
   Rodar os testes: node referencia-ofensiva.js */
const P={ // parâmetros (todos medidos/ajustáveis; ver seção 5.3)
  diasParaCongelador:7, maxCongeladores:2, maxLacunaRecuperavel:3,
  carenciaRecuperacao:14, tetoRetorno:10 };

const ymd=d=>d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
const diaLocal=(agora)=>ymd(agora||new Date());          // no app: diaLocal()
const idx=s=>{const[a,b,c]=s.split('-').map(Number);return Math.round(Date.UTC(a,b-1,c)/864e5);}; // sem fuso
const diff=(a,b)=>idx(b)-idx(a);
const soma=(s,n)=>{const d=new Date(idx(s)*864e5+n*864e5);return d.getUTCFullYear()+'-'+String(d.getUTCMonth()+1).padStart(2,'0')+'-'+String(d.getUTCDate()).padStart(2,'0');};
const dow=s=>new Date(idx(s)*864e5).getUTCDay();

function novo(){return {ofensiva:0,melhor:0,ultimo:'',descansando:false,valorAntes:0,
  congeladores:0,prog:0,recuperouEm:'',recuperavel:null,diasLivres:[],pausaAte:'',cobertos:[]};}

/* Chamar ao abrir o app e à virada do dia. Não gasta nada se não houver lacuna. */
function abrir(s,hoje){
  if(!s.ultimo||s.descansando)return s;
  const lacuna=[];
  for(let d=soma(s.ultimo,1);diff(d,hoje)>0;d=soma(d,1)){
    if(s.diasLivres.includes(dow(d))||(s.pausaAte&&d<=s.pausaAte))continue; // dia livre/pausa não conta como falta
    lacuna.push(d);
  }
  if(!lacuna.length){ if(diff(s.ultimo,hoje)>1)s.ultimo=soma(hoje,-1); return s; } // ofensiva segue "viva" até hoje
  if(s.congeladores>=lacuna.length){ s.congeladores-=lacuna.length; s.cobertos=s.cobertos.concat(lacuna); s.ultimo=soma(hoje,-1); return s; }
  s.descansando=true; s.valorAntes=s.ofensiva; s.lacuna=lacuna.length; return s;  // não gasta congelador parcial
}

/* Chamar ao concluir um bloco (>=6 perguntas respondidas). 'extra' = 2º bloco do mesmo dia. */
function blocoConcluido(s,hoje){
  abrir(s,hoje);
  if(s.ultimo===hoje){ // dia já vivo: só avalia a recuperação
    if(s.recuperavel&&!s.recuperavel.feita){
      s.recuperavel.extras++;
      if(s.recuperavel.extras>=1){ s.ofensiva=s.recuperavel.V+1; s.recuperavel.feita=true; s.recuperouEm=hoje; s.melhor=Math.max(s.melhor,s.ofensiva); }
    }
    return s;
  }
  if(s.descansando){
    const V=s.valorAntes, podeRecuperar=s.lacuna<=P.maxLacunaRecuperavel&&(!s.recuperouEm||diff(s.recuperouEm,hoje)>=P.carenciaRecuperacao);
    s.ofensiva=Math.max(1,Math.min(Math.ceil(V/2),P.tetoRetorno)); // retorno "pela metade", nunca zero
    s.recuperavel=podeRecuperar?{V,extras:0,feita:false}:null;
    s.descansando=false;
  } else s.ofensiva=s.ofensiva+1;
  s.ultimo=hoje; s.melhor=Math.max(s.melhor,s.ofensiva);
  s.prog++; if(s.prog>=P.diasParaCongelador){ if(s.congeladores<P.maxCongeladores){s.congeladores++;s.prog=0;} else s.prog=P.diasParaCongelador-1; }
  return s;
}

module.exports={P,novo,abrir,blocoConcluido,diaLocal,diff,soma};

if(require.main===module){
  const A=require('assert');let n=0;const t=(nome,f)=>{f();n++;console.log('ok',nome);};
  const jogar=(s,dias)=>dias.forEach(d=>blocoConcluido(s,d));
  t('1 dia a dia',()=>{const s=novo();jogar(s,['2026-10-01','2026-10-02','2026-10-03']);A.equal(s.ofensiva,3);});
  t('2 mesma data duas vezes',()=>{const s=novo();jogar(s,['2026-10-01','2026-10-01']);A.equal(s.ofensiva,1);});
  t('3 congelador cobre 1 falta',()=>{const s=novo();jogar(s,['2026-10-01','2026-10-02','2026-10-03','2026-10-04','2026-10-05','2026-10-06','2026-10-07']);A.equal(s.congeladores,1);
    blocoConcluido(s,'2026-10-09');A.equal(s.ofensiva,8);A.equal(s.congeladores,0);});
  t('4 sem congelador: descansa, retorno pela metade',()=>{const s=novo();s.ofensiva=10;s.melhor=10;s.ultimo='2026-10-01';
    abrir(s,'2026-10-03');A.equal(s.descansando,true);A.equal(s.ofensiva,10);blocoConcluido(s,'2026-10-03');A.equal(s.ofensiva,5);A.equal(s.melhor,10);});
  t('5 recuperação com bloco extra',()=>{const s=novo();s.ofensiva=10;s.melhor=10;s.ultimo='2026-10-01';
    blocoConcluido(s,'2026-10-03');blocoConcluido(s,'2026-10-03');A.equal(s.ofensiva,11);});
  t('6 lacuna longa: sem recuperação',()=>{const s=novo();s.ofensiva=10;s.ultimo='2026-10-01';
    blocoConcluido(s,'2026-10-10');blocoConcluido(s,'2026-10-10');A.equal(s.ofensiva,5);});
  t('7 carência de 14 dias da recuperação',()=>{const s=novo();s.ofensiva=10;s.ultimo='2026-10-01';
    blocoConcluido(s,'2026-10-03');blocoConcluido(s,'2026-10-03');A.equal(s.ofensiva,11);
    s.ultimo='2026-10-05';s.ofensiva=11;blocoConcluido(s,'2026-10-07');blocoConcluido(s,'2026-10-07');A.equal(s.ofensiva,6);});
  t('8 dia livre (domingo=0) não é falta',()=>{const s=novo();s.diasLivres=[0];s.ofensiva=4;s.ultimo='2026-10-17'; // sábado
    blocoConcluido(s,'2026-10-19');A.equal(s.ofensiva,5);A.equal(s.descansando,false);}); // 18/10/2026 é domingo
  t('9 pausa do responsável',()=>{const s=novo();s.ofensiva=4;s.ultimo='2026-10-01';s.pausaAte='2026-10-06';
    blocoConcluido(s,'2026-10-07');A.equal(s.ofensiva,5);});
  t('10 teto de congeladores',()=>{const s=novo();s.congeladores=2;s.prog=6;blocoConcluido(s,'2026-10-01');A.equal(s.congeladores,2);A.equal(s.prog,6);});
  t('11 congelador parcial não é gasto',()=>{const s=novo();s.ofensiva=6;s.congeladores=1;s.ultimo='2026-10-01';
    abrir(s,'2026-10-04');A.equal(s.congeladores,1);A.equal(s.descansando,true);});
  t('12 fuso: 21h30 em UTC-3 é o mesmo dia local',()=>{const d=new Date('2026-10-25T00:30:00Z'); // 21h30 de 24/10 em Brasília
    const loc=new Date(d.getTime()-3*3600e3);A.equal(ymd(new Date(loc.getUTCFullYear(),loc.getUTCMonth(),loc.getUTCDate())),'2026-10-24');A.equal(d.toISOString().slice(0,10),'2026-10-25');});
  console.log(n+' testes passaram');
}
