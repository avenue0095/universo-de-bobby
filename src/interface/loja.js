/* ---------- 1E · loja nova: portão duplo, loja da semana, lista de desejos, cofrinho e ralos (lógica sem tela) ----------
   Tudo lê ECON, PRECOS e PORTOES de economia.js (a tabela vive num lugar só). */
const PORTAO_TXT={dias:n=>n+' dias de exploração',perfeitas:n=>n+' fases perfeitas',fases:n=>n+' fases concluídas',etapas:n=>n===1?'1 etapa completa':n+' etapas completas'};
/* conquistas que abrem portão, contadas do estado (nunca diminuem) */
function contextoDeConquista(){
  const f=S.feitas||{};
  const fasesReais=Object.keys(f).filter(k=>k.indexOf('rev')!==0);
  let etapas=0;
  [UNITS_MAT,UNITS_PT,UNITS_EN].forEach(us=>us.forEach(u=>{if(u.lessons.every(l=>f[l.id]))etapas++;}));
  return {dias:diasDeExploracao(),perfeitas:fasesReais.filter(k=>estrelasDe(f[k])===3).length,fases:fasesReais.length,etapas:etapas};
}
/* dias de exploração: dias diferentes em que a criança respondeu pelo menos uma pergunta. Cumulativo, nunca cai (1A). */
function diasDeExploracao(){return (S.exploracao&&S.exploracao.dias)||0;}
function marcarDiaDeExploracao(dia){
  S.exploracao=S.exploracao||{dias:0,ultimo:''};
  if(S.exploracao.ultimo!==dia){S.exploracao.dias++;S.exploracao.ultimo=dia;return true;}
  return false;
}
const portaoDe=id=>PORTOES[id]||null;
function portaoOk(id,ctx){const p=portaoDe(id);if(!p)return true;ctx=ctx||contextoDeConquista();return (ctx[p.t]||0)>=p.n;}
/* texto do portão, sempre com a origem ("abre com 14 dias de exploração"), nunca "compre para destravar" */
function portaoTexto(id,ctx){
  if(/^aces-/.test(id)){const c=id.slice(5);return companheiroComprado(c)?'Abre quando vocês forem Grande amigo ('+companhiaDe(c)+' de '+COMPANHIA.estagio2+')':'Abre depois que o companheiro estiver com você';}
  const p=portaoDe(id);if(!p)return '';
  ctx=ctx||contextoDeConquista();const tem=ctx[p.t]||0;
  return 'Abre com '+PORTAO_TXT[p.t](p.n)+' (você tem '+tem+')';
}
/* ---------- loja da semana: ciclo fixo de 12 semanas no calendário ---------- */
const ITENS_SEMANA=Object.keys(PRECOS.semana);
/* a semana do ciclo (0 a 11), a partir da segunda-feira 05/01/2026: igual para todo mundo, nunca sorteada */
function semanaDoCiclo(dia){return Math.floor((idxDia(dia||hoje())-idxDia('2026-01-05'))/7)%ECON.semanasCiclo;}
/* item k aparece nas semanas k e k+6 do ciclo: 24 itens, 4 por semana, cada um 2 vezes a cada 12 semanas */
function semanasDoItem(id){const k=ITENS_SEMANA.indexOf(id);return k<0?[]:[k%ECON.semanasCiclo,(k+6)%ECON.semanasCiclo].filter((v,i,a)=>a.indexOf(v)===i);}
function itensDaSemana(dia){const w=semanaDoCiclo(dia);return ITENS_SEMANA.filter(id=>semanasDoItem(id).indexOf(w)>=0);}
const temCompra=id=>(S.comprado||[]).indexOf(id)>=0;
function desejos(){S.desejos=(S.desejos||[]).filter(id=>ITENS_SEMANA.indexOf(id)>=0&&!temCompra(id));return S.desejos;}
/* o que aparece na loja da semana: os da semana (menos os comprados) + a lista de desejos */
function vitrineDaSemana(dia){
  const v=itensDaSemana(dia).filter(id=>!temCompra(id));
  desejos().forEach(id=>{if(v.indexOf(id)<0)v.push(id);});
  return v;
}
function alternarDesejo(id){
  const d=desejos(),i=d.indexOf(id);
  if(i>=0){d.splice(i,1);return true;}
  if(d.length>=ECON.desejosMax||temCompra(id)||ITENS_SEMANA.indexOf(id)<0)return false;
  d.push(id);return true;
}
/* ---------- cofrinho de meta ---------- */
/* guardado = metade do que se ganhou (o XP sobe junto com a moeda ganha) desde que a meta foi escolhida, até o preço da meta e até o saldo */
function cofrinho(){
  const c=S.cofrinho;if(!c||!c.meta)return {meta:'',guardado:0,preco:0};
  const preco=precoDe(c.meta);
  const g=Math.max(0,Math.min(preco,Math.floor((S.xp-c.base)*ECON.cofrinhoParte),S.moedas));
  return {meta:c.meta,guardado:g,preco:preco};
}
function escolherMeta(id){if(!precoDe(id)||temCompra(id))return false;S.cofrinho={meta:id,base:S.xp};return true;}
function desfazerCofrinho(){S.cofrinho={meta:'',base:S.xp};}
const noBolso=()=>S.moedas-cofrinho().guardado;
/* ---------- preço e compra únicos para todo o catálogo ---------- */
function precoDe(id){
  if(PRECOS.companheiro[id])return PRECOS.companheiro[id];
  if(PRECOS.look[id])return PRECOS.look[id];
  if(PRECOS.semana[id])return PRECOS.semana[id];
  if(/^pista-(mat|pt|en)(10|[1-9])$/.test(id))return PRECOS.pista;
  if(/^aces-[a-z]+$/.test(id))return PRECOS.acessorio[id.slice(5)]||0;
  return 0;
}
/* o mesmo valor em moedas do jogo, com outro nome para o ciclo diário (o baú só entrega, nunca vende) */
const custoDe=id=>precoDe(id);
/* pode comprar? {ok, motivo}. Meta do cofrinho usa o saldo inteiro; o resto usa só o bolso. */
function podeComprar(id,dia){
  const p=precoDe(id);
  if(!p)return {ok:false,motivo:'nao-existe'};
  if(temCompra(id))return {ok:false,motivo:'ja-tem'};
  if(!portaoOk(id))return {ok:false,motivo:'portao'};
  if(ITENS_SEMANA.indexOf(id)>=0&&vitrineDaSemana(dia).indexOf(id)<0)return {ok:false,motivo:'fora-da-semana'};
  if(/^pista-/.test(id)&&!pistaAberta(id))return {ok:false,motivo:'portao'};
  if(/^aces-/.test(id)&&!(companheiroComprado(id.slice(5))&&estagioDe(id.slice(5))>=2))return {ok:false,motivo:'portao'};
  const meta=cofrinho().meta===id,saldo=meta?S.moedas:noBolso();
  if(saldo<p)return {ok:false,motivo:'moedas',falta:p-saldo};
  return {ok:true};
}
function comprarItem(id,dia){
  const r=podeComprar(id,dia);if(!r.ok)return r;
  const p=precoDe(id),meta=cofrinho().meta===id;
  S.moedas-=p;S.comprado=(S.comprado||[]).concat([id]);
  S.gasto=(S.gasto||0)+p;
  if(meta)S.cofrinho={meta:'',base:S.xp};
  desejos();
  return {ok:true,preco:p};
}
/* ---------- ralos ---------- */
/* petisco: só com companheiro escolhido; 1 por dia conta para a amizade; nunca é pedido */
function darPetisco(dia){
  dia=dia||hoje();
  const comp=S.look&&S.look.companheiro;if(!comp)return {ok:false,motivo:'sem-companheiro'};
  if(S.config&&S.config.petiscoLigado===false)return {ok:false,motivo:'desligado'};
  if(noBolso()<ECON.petisco)return {ok:false,motivo:'moedas'};
  S.moedas-=ECON.petisco;S.gasto=(S.gasto||0)+ECON.petisco;
  S.amizade=S.amizade||{};const a=S.amizade[comp]||(S.amizade[comp]={xp:0,dia:''});
  let contou=false;if(a.dia!==dia){a.xp++;a.dia=dia;contou=true;}
  return {ok:true,contou:contou};
}
/* céu estrelado: só quando sobra mais de 2.000 e nenhum item comprável está à mostra */
function algumCompravel(dia){
  const ids=Object.keys(PRECOS.companheiro).concat(Object.keys(PRECOS.look)).concat(vitrineDaSemana(dia)).concat(pistasAbertas());
  return ids.some(id=>podeComprar(id,dia).ok);
}
function ceuDisponivel(dia){return S.moedas>ECON.estrelaSobra&&!algumCompravel(dia);}
function comprarEstrela(nome,dia){
  if(!ceuDisponivel(dia))return {ok:false};
  const n=nomeSeguro(nome||'',18)||('Estrela '+((S.ceu||[]).length+1));
  S.moedas-=ECON.estrela;S.gasto=(S.gasto||0)+ECON.estrela;
  S.ceu=(S.ceu||[]).concat([n]).slice(-500);
  return {ok:true,nome:n};
}
/* pistas da história: uma página por etapa concluída (pista-mat3 abre quando a etapa 3 de matemática termina) */
function pistaAberta(id){
  const m=/^pista-(mat|pt|en)(10|[1-9])$/.exec(id);if(!m)return false;
  const u=MATERIAS[m[1]].units()[+m[2]-1];
  return !!u&&u.lessons.every(l=>S.feitas&&S.feitas[l.id]);
}
function pistasAbertas(){
  const r=[];['mat','pt','en'].forEach(m=>{for(let n=1;n<=10;n++){const id='pista-'+m+n;if(pistaAberta(id)&&!temCompra(id))r.push(id);}});
  return r;
}
function textoDaPista(id){
  const m=/^pista-(mat|pt|en)(10|[1-9])$/.exec(id);if(!m)return '';
  const t=PISTAS[m[1]][+m[2]-1];return t||'';
}
