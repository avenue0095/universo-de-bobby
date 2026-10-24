/* ---------- ofensiva com congelador ganho, descanso e recuperação ----------
   Porte de docs/anexos/referencia-ofensiva.js (docs/FASE-2-especificacao.md, seção 5.3). Sem DOM, sem localStorage.
   Datas são 'AAAA-MM-DD' do calendário LOCAL (nucleo.js). A diferença para a referência: o contador se chama
   'atual' (a referência usava 'ofensiva') porque aqui o objeto inteiro é S.ofensiva.
   Tom: a ofensiva nunca "morre". Sem congelador ela DESCANSA e volta pela metade; o texto nunca culpa. */
const OF_P={diasParaCongelador:7,maxCongeladores:2,maxLacunaRecuperavel:3,carenciaRecuperacao:14,tetoRetorno:10};
const OF_MARCOS=[3,7,14,30,60,100];

function ofensivaNova(){
  return {atual:0,melhor:0,ultimo:'',descansando:false,valorAntes:0,lacuna:0,congeladores:0,prog:0,
    recuperouEm:'',recuperavel:null,diasLivres:[],pausaAte:'',cobertos:[],marcos:[]};
}

/* Chamar ao abrir o app e na virada do dia. Não gasta nada se não houver lacuna. */
function ofensivaAbrir(s,hoje){
  if(!s.ultimo||s.descansando)return s;
  const lacuna=[];
  for(let d=somaDias(s.ultimo,1);difDias(d,hoje)>0;d=somaDias(d,1)){
    /* dia livre (ex.: domingo) e pausa do responsável não contam como falta */
    if((s.diasLivres||[]).includes(diaSemana(d))||(s.pausaAte&&d<=s.pausaAte))continue;
    lacuna.push(d);
  }
  if(!lacuna.length){
    if(difDias(s.ultimo,hoje)>1)s.ultimo=somaDias(hoje,-1);   /* a ofensiva segue "viva" até hoje */
    return s;
  }
  /* só gasta se os congeladores cobrem TODOS os dias perdidos; nunca gasta parte */
  if(s.congeladores>=lacuna.length){
    s.congeladores-=lacuna.length;
    s.cobertos=(s.cobertos||[]).concat(lacuna).slice(-60);
    s.ultimo=somaDias(hoje,-1);
    return s;
  }
  s.descansando=true;s.valorAntes=s.atual;s.lacuna=lacuna.length;
  return s;
}

/* Chamar ao concluir um bloco (6 perguntas ou mais). O 2º bloco do mesmo dia vale como "bloco extra". */
function ofensivaBloco(s,hoje){
  /* relógio do aparelho voltou no tempo: não penaliza e não conta o dia duas vezes */
  if(s.ultimo&&difDias(hoje,s.ultimo)>0){s.relogioEstranho=true;hoje=s.ultimo;}
  ofensivaAbrir(s,hoje);
  if(s.ultimo===hoje){                       /* dia já vivo: só avalia a recuperação */
    if(s.recuperavel&&!s.recuperavel.feita){
      s.recuperavel.extras++;
      if(s.recuperavel.extras>=1){
        s.atual=s.recuperavel.V+1;s.recuperavel.feita=true;s.recuperouEm=hoje;
        s.melhor=Math.max(s.melhor,s.atual);
        ofensivaMarcos(s);
      }
    }
    return s;
  }
  if(s.descansando){
    const V=s.valorAntes;
    const podeRecuperar=s.lacuna<=OF_P.maxLacunaRecuperavel&&(!s.recuperouEm||difDias(s.recuperouEm,hoje)>=OF_P.carenciaRecuperacao);
    s.atual=Math.max(1,Math.min(Math.ceil(V/2),OF_P.tetoRetorno));   /* retorno "pela metade", nunca zero */
    s.recuperavel=podeRecuperar?{V:V,extras:0,feita:false}:null;
    s.descansando=false;
  }else s.atual=s.atual+1;
  s.ultimo=hoje;s.melhor=Math.max(s.melhor,s.atual);
  s.prog++;
  if(s.prog>=OF_P.diasParaCongelador){
    if(s.congeladores<OF_P.maxCongeladores){s.congeladores++;s.prog=0;}
    else s.prog=OF_P.diasParaCongelador-1;               /* com 2 guardados o contador fica em 6 de 7 */
  }
  ofensivaMarcos(s);
  return s;
}
/* medalha permanente: marco atingido não se perde */
function ofensivaMarcos(s){
  s.marcos=s.marcos||[];
  OF_MARCOS.forEach(m=>{if(s.atual>=m&&s.marcos.indexOf(m)<0)s.marcos.push(m);});
}
