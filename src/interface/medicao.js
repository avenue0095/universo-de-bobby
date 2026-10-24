/* ---------- medição local: eventos sem dado pessoal e retenção D1/D7/D30 ----------
   docs/FASE-2-especificacao.md, seção 7. Nada sai do aparelho: exportar é ato do responsável.
   Regras: nada de apelido, texto livre ou identificador do aparelho; 'pid' é um sorteio local separado do apelido,
   trocado por outro sorteio na exportação; hora só em horas cheias; no máximo 4.000 eventos ou 120 dias. */
const CHAVE_EVENTOS='universo-bobby-eventos-v1';
const EV={max:4000,dias:120,abertura:sorteioId(8)};
const EVENTOS_NOMES=['app_aberto','perfil_criado','diag_fim','bloco_inicio','bloco_fim','meta_cheia','bau_aberto','missao_ok',
  'parada_vista','congelador_ganho','congelador_usado','ofensiva_descansa','ofensiva_recuperada','ofensiva_retorno',
  'revisao_item','audio_falha','relatorio_visto','lembrete_ics','config_mudou','sessao_fim','migracao_ok','migracao_falhou','relogio_estranho'];
/* só aceita número, verdadeiro/falso ou um código curto (letras, números, _ . : / -). Frase digitada nunca passa. */
const EV_CODIGO=/^[a-z0-9_.:\/\-]{0,80}$/i;
const EV_PROIBIDOS=/nome|apelido|email|e-mail|texto|senha|telefone|cpf/i;
let EVENTOS=null;

function eventosLer(){
  if(EVENTOS)return EVENTOS;
  EVENTOS=[];
  try{
    const j=JSON.parse(localStorage.getItem(CHAVE_EVENTOS)||'null');
    if(j&&Array.isArray(j.itens))EVENTOS=j.itens.filter(x=>x&&typeof x==='object'&&EVENTOS_NOMES.indexOf(x.e)>=0&&ehDia(x.d));
  }catch(e){EVENTOS=[];}
  return EVENTOS;
}
function eventosGravar(){
  try{localStorage.setItem(CHAVE_EVENTOS,JSON.stringify({v:1,itens:EVENTOS}));}catch(e){}
}
function eventosAparar(dia){
  const lim=somaDias(dia,-EV.dias);
  EVENTOS=EVENTOS.filter(x=>x.d>=lim);
  if(EVENTOS.length>EV.max)EVENTOS=EVENTOS.slice(EVENTOS.length-EV.max);
}
function eventoLimpo(campos){
  const out={};
  Object.keys(campos||{}).forEach(k=>{
    if(EV_PROIBIDOS.test(k)||!/^[a-z0-9_]{1,20}$/i.test(k))return;
    const v=campos[k];
    if(typeof v==='number'&&isFinite(v))out[k]=Math.round(v*100)/100;
    else if(typeof v==='boolean')out[k]=v?1:0;
    else if(typeof v==='string'&&EV_CODIGO.test(v))out[k]=v;
  });
  return out;
}
function registrarEvento(nome,campos){
  try{
    if(EVENTOS_NOMES.indexOf(nome)<0)return false;
    const p=perfilAtual(),pid=p&&p.pid;
    if(!pid)return false;
    eventosLer();
    const agora=new Date(),dia=diaLocal(agora);
    const reg=Object.assign({e:nome,d:dia,h:agora.getHours(),s:EV.abertura,v:APP_VERSAO,pid:pid},eventoLimpo(campos));
    EVENTOS.push(reg);
    eventosAparar(dia);
    eventosGravar();
    return true;
  }catch(e){return false;}
}
function apagarEventosDe(pid){
  eventosLer();
  EVENTOS=EVENTOS.filter(x=>x.pid!==pid);
  eventosGravar();
}
function eventosDoPerfil(pid){return eventosLer().filter(x=>x.pid===pid);}

/* ---- retenção (porte de docs/anexos/referencia-retencao.js) ----
   Dia ativo = data local com pelo menos 1 'bloco_fim'. Abrir o app sem terminar bloco não conta. */
function diasAtivosDe(ev){
  const m={};
  ev.filter(x=>x.e==='bloco_fim'&&(x.contou===undefined||x.contou)).forEach(x=>{(m[x.pid]=m[x.pid]||new Set()).add(x.d);});
  return m;
}
function retencao(ev,hojeStr){
  const A=diasAtivosDe(ev),out={D1:[0,0],D7:[0,0],D30:[0,0],D1j:[0,0],D7j:[0,0],D30j:[0,0],curr:[0,0]};
  for(const pid in A){
    const dias=[...A[pid]].map(idxDia).sort((a,b)=>a-b),p=dias[0],set=new Set(dias),h=idxDia(hojeStr);
    [[1,'D1',1],[7,'D7',1],[30,'D30',2]].forEach(([n,k,folga])=>{
      if(p+n>h)return;                                   /* ainda não deu tempo: fora do denominador */
      out[k][1]++;if(set.has(p+n))out[k][0]++;            /* estrita: exatamente no dia N */
      out[k+'j'][1]++;
      for(let j=Math.max(1,n-folga);j<=n+folga;j++)if(set.has(p+j)){out[k+'j'][0]++;break;}   /* janela */
    });
    /* retorno no dia seguinte (parecido com o CURR): dia ativo com outro dia ativo nos 7 dias anteriores */
    dias.forEach(d=>{
      if(d+1>h)return;
      let recente=false;for(let j=1;j<=7;j++)if(set.has(d-j))recente=true;
      if(recente){out.curr[1]++;if(set.has(d+1))out.curr[0]++;}
    });
  }
  const r=k=>out[k][1]?+(out[k][0]/out[k][1]).toFixed(2):null;
  return {D1:r('D1'),D7:r('D7'),D30:r('D30'),D1_janela:r('D1j'),D7_janela:r('D7j'),D30_janela:r('D30j'),
    retornoDiaSeguinte:r('curr'),n:{D1:out.D1[1],D7:out.D7[1],D30:out.D30[1],curr:out.curr[1]}};
}
function coortes(ev){
  const A=diasAtivosDe(ev),c={};
  for(const pid in A){
    const p=[...A[pid]].sort()[0],k=semanaIso(p);
    (c[k]=c[k]||[]).push(pid);
  }
  return c;
}
/* meta cheia por dia ativo: separa "dia vivo" de "meta" */
function metaPorDiaAtivo(ev){
  const dias=new Set(),metas=new Set();
  ev.forEach(x=>{
    if(x.e==='bloco_fim')dias.add(x.pid+'|'+x.d);
    if(x.e==='meta_cheia')metas.add(x.pid+'|'+x.d);
  });
  return dias.size?+(metas.size/dias.size).toFixed(2):null;
}
/* resumo curto da semana (7 dias até hojeStr) para o responsável, tirado das estatísticas do perfil */
function resumoSemana(stats,hojeStr){
  const r={dias:0,min:0,perguntas:0,acertos:0,revisoes:0,blocos:0};
  for(let i=0;i<7;i++){
    const d=stats.dias[somaDias(hojeStr,-i)];
    if(!d)continue;
    if((d.b||d.fases||0)>0||(d.q||0)>0)r.dias++;
    r.min+=Math.round((d.seg||0)/60);r.perguntas+=d.q||0;r.acertos+=d.ac||0;r.revisoes+=d.rev||0;r.blocos+=d.b||d.fases||0;
  }
  r.pct=r.perguntas?Math.round(r.acertos/r.perguntas*100):null;
  return r;
}
/* pacote SEM NOME (pseudonimizado, não anônimo: guarda dia e hora de uso): só contadores. O pid sai trocado por outro sorteio e o apelido nunca entra. */
function pacoteDeMetricas(pid){
  const troca=sorteioId(12);
  const itens=eventosDoPerfil(pid).map(x=>Object.assign({},x,{pid:troca,s:undefined}));
  itens.forEach(x=>{delete x.s;});
  return {app:'universo-de-bobby',tipo:'metricas-sem-nome',versao:1,quando:new Date().toISOString(),eventos:itens};
}
