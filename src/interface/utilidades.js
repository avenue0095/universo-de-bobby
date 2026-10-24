/* ---------- utilidades ---------- */
/* O nome do perfil é digitado pela criança e entra em innerHTML em vários lugares.
   Sem escapar, um nome como <img src=x onerror=...> vira código — e o nome viaja
   junto no backup .json, então um arquivo restaurado também carregaria o problema. */
function escapa(t){return String(t==null?'':t)
  .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
  .replace(/"/g,'&quot;').replace(/'/g,'&#39;');}
function estrelasSVG(n,total){let h='';for(let i=0;i<(total||3);i++)h+=IC.estrela.replace('<svg',i<n?'<svg class="on"':'<svg');return h;}
function corUnidade(u){return 'var(--materia-base)';}
function normaliza(t){
  return String(t).toLowerCase().replace(/r\$/g,'').replace(/\s|&nbsp;/g,'')
    .replace(/cm²|cm2|cm³|cm3|cm|graus|°|reais|km|kg|ml|litros?|m\b/g,'').replace(',','.').trim();
}
const semAcento=t=>String(t).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9,]/g,'');
function acertou(dado,gab){
  const a=normaliza(dado),b=normaliza(gab);
  if(a===b)return true;
  const na=parseFloat(a),nb=parseFloat(b);
  if(!isNaN(na)&&!isNaN(nb))return Math.abs(na-nb)<1e-9;
  return semAcento(dado)===semAcento(gab);
}
/* fases concluídas DA MATÉRIA ATUAL (o anel do mapa somava as três galáxias e as revisões: dava 1/50 com 3 matérias jogadas) */
const feitas=()=>fases();
/* Decisão do Filipe (24/10/2026, rodada 2): a etapa N só abre depois da REVISÃO da etapa N-1. Reversível: TRANCAR_ETAPAS=false volta a abrir a 1ª fase de toda etapa. */
const TRANCAR_ETAPAS=true;
const revisaoFeita=ui=>!!S.feitas['rev'+MATERIA+UNITS[ui].n];
function liberada(ui,li){
  if(li===0)return ui===0||!TRANCAR_ETAPAS||revisaoFeita(ui-1);
  return !!S.feitas[UNITS[ui].lessons[li-1].id];
}
function mundoCompleto(u){return u.lessons.every(l=>S.feitas[l.id]);}
/* [etapa, fase] da próxima fase; [etapa, 5] quando as 5 fases estão feitas e falta a revisão que destranca a etapa seguinte */
function proxima(){
  for(let i=0;i<UNITS.length;i++){
    for(let j=0;j<UNITS[i].lessons.length;j++)if(!S.feitas[UNITS[i].lessons[j].id]){
      if(j===0&&!liberada(i,0))return [i-1,5];
      return [i,j];
    }
    if(TRANCAR_ETAPAS&&!revisaoFeita(i)&&i<UNITS.length-1)return [i,5];
  }
  return null;
}
const tituloDaProxima=p=>p?(p[1]===5?'Revisão da etapa '+UNITS[p[0]].n:UNITS[p[0]].lessons[p[1]].title):'';
function passosDe(l){
  if(typeof AULAS!=='undefined'&&AULAS[l.id])return AULAS[l.id];
  const t=l.teach;
  return [{t:'O que é isso?',c:t.ideia},{t:'Um exemplo',c:t.exemplo},{t:'Pra não esquecer',c:t.dica}];
}

