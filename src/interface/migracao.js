/* ---------- migração do estado v3 ('mundo-numeros-v2') para o v4 ('universo-bobby-v4') ----------
   docs/FASE-2-especificacao.md, seção 8.3. Funções PURAS: recebem o objeto antigo e devolvem o novo.
   A chave antiga NUNCA é alterada nem apagada: ela é a cópia de segurança (rollback). */
const VERSAO_DADOS=4;
const CHAVE4='universo-bobby-v4';
const CHAVE_V3='mundo-numeros-v2';
const CHAVE_V3_BAK='mundo-numeros-v2.bak-v3';
const CHAVE_V4_RUIM='universo-bobby-v4.corrompido';
const FAIXA_DO_NIVEL={facil:'f78',medio:'f910',forte:'f1112'};
const NIVEL_DA_FAIXA={f78:'facil',f910:'medio',f1112:'forte'};
const FAIXAS=['f78','f910','f1112'];

/* estrelas de uma fase, aceitando o formato estranho de backups antigos (número, {estrelas}, ou só "verdadeiro") */
function estrelasDe(v){
  if(typeof v==='number'&&isFinite(v))return Math.max(1,Math.min(3,Math.round(v)));
  if(v&&typeof v==='object'&&typeof v.estrelas==='number')return Math.max(1,Math.min(3,Math.round(v.estrelas)));
  return v?1:0;
}
/* o objeto parece dados do v3? (v4 sempre tem 'faixa') */
function ehDadosV3(d){
  if(!d||typeof d!=='object')return false;
  if(d.faixa!==undefined)return false;
  return d.nivel!==undefined||typeof d.ofensiva==='number'||d.ultimoDia!==undefined||
    d.ganhoTotal!==undefined||(d.xp!==undefined&&d.moedas===undefined);
}
/* converte os dados de UM perfil v3 em dados v4 (ainda sem a normalização de estadoDe) */
function migrarDadosV3(d,dia){
  d=(d&&typeof d==='object')?d:{};
  const obj=v=>(v&&typeof v==='object'&&!Array.isArray(v))?v:{};
  const n=(v,def)=>{v=+v;return isFinite(v)?v:(def||0);};
  const saldo=Math.max(0,n(d.xp));
  const ganho=Math.max(0,n(d.ganhoTotal));
  const o=ofensivaNova();
  o.atual=Math.max(0,Math.round(n(d.ofensiva)));
  o.melhor=Math.max(o.atual,Math.round(n(d.melhorOfensiva)));
  o.ultimo=ehDia(d.ultimoDia)?d.ultimoDia:'';
  o.congeladores=1;          /* congelador de cortesia: absorve o dia de diferença do fuso UTC para local */
  o.prog=0;
  ofensivaMarcos(o);
  const stats=obj(d.stats);
  const dias={};
  const diasV3=obj(stats.dias);
  Object.keys(diasV3).forEach(k=>{
    const x=obj(diasV3[k]);
    if(!ehDia(k))return;
    dias[k]={fases:Math.max(0,n(x.fases)),seg:Math.max(0,n(x.seg)),b:Math.max(0,n(x.fases)),q:0};
  });
  const feitas={};
  const f3=obj(d.feitas);
  Object.keys(f3).forEach(k=>{const e=estrelasDe(f3[k]);if(e>0)feitas[k]=e;});
  const errados={};
  const e3=obj(d.errados);
  Object.keys(e3).forEach(k=>{if(Array.isArray(e3[k]))errados[k]=e3[k].filter(q=>q&&typeof q==='object'&&q.prompt!==undefined).slice(-30);});
  return {
    faixa:FAIXA_DO_NIVEL[d.nivel]||'f78',
    materia:['mat','pt','en'].indexOf(d.materia)>=0?d.materia:'mat',
    xp:Math.max(ganho,saldo),
    moedas:saldo,
    acertosTotal:Math.max(0,Math.round(n(d.acertos))),
    melhorCombo:Math.max(0,Math.round(n(d.combo))),
    feitas:feitas,
    look:Object.assign({},obj(d.look)),
    comprado:Array.isArray(d.comprado)?d.comprado.filter(x=>typeof x==='string').slice(0,400):[],
    ofensiva:o,
    errados:errados,
    stats:{porLicao:Object.assign({},obj(stats.porLicao)),dias:dias,tempo:Math.max(0,n(stats.tempo)),amostras:[]},
    som:d.som!==false,voz:d.voz!==false,
    velocidade:Math.min(1.2,Math.max(.8,n(d.velocidade,1)||1)),    /* a voz gravada toca de 80% a 120% */
    nome:String(d.nome||'').slice(0,18),
    legado:{nivel:['facil','medio','forte'].indexOf(d.nivel)>=0?d.nivel:'facil',errados:JSON.parse(JSON.stringify(errados)),
            vozPt:String(d.vozPt||'').slice(0,80),vozEn:String(d.vozEn||'').slice(0,80),migradoEm:dia||''}
  };
}
/* Valida o resultado contra o original. Devolve null se estiver tudo certo, ou o motivo da falha.
   (passo 4 da migração: falhou, o v4 NÃO é gravado) */
function validarMigracao(antigo,novo){
  antigo=(antigo&&typeof antigo==='object')?antigo:{};
  const f3=(antigo.feitas&&typeof antigo.feitas==='object')?antigo.feitas:{};
  const antes=Object.keys(f3).filter(k=>estrelasDe(f3[k])>0).length;
  const depois=Object.keys(novo.feitas||{}).length;
  if(antes!==depois)return 'fases: '+antes+' antes, '+depois+' depois';
  const xp0=Math.max(0,+antigo.xp||0);
  if(!((novo.xp||0)+(novo.moedas||0)>=xp0))return 'xp+moedas menor que o xp antigo';
  if(!(novo.moedas===xp0))return 'moedas diferentes do saldo antigo';
  if(!(novo.ofensiva&&novo.ofensiva.atual>=0))return 'ofensiva negativa';
  return null;
}
/* Erros do caderno v3 viram itens da revisão espaçada: caixa 1, datas escalonadas hoje + floor(i/5) dias.
   Só entram os tipos que sabem se redesenhar a partir do que o v3 guardava (escolha e digitação). */
const TIPOS_DO_CADERNO_V3=['mc','input','texto'];
function migrarErrosParaRevisao(errados,dia){
  const itens={},congelados={};
  let i=0;
  Object.keys(errados||{}).forEach(chave=>{
    const m=/^(mat|pt|en)(\d+)$/.exec(chave);
    (errados[chave]||[]).forEach(q=>{
      if(!q||TIPOS_DO_CADERNO_V3.indexOf(q.type)<0)return;
      const k='er:'+fnv8(q.prompt+'||'+q.answer);
      if(itens[k])return;
      const snap={};
      ['type','prompt','answer','options','figure','teclado','ouvir','lang'].forEach(c=>{if(q[c]!==undefined)snap[c]=q[c];});
      snap.m=m?m[1]:'mat';snap.w=m?+m[2]:0;snap.sk='';
      congelados[k]=snap;
      itens[k]=[1,somaDias(dia,Math.floor(i/5)),1,0,1,'',0,0];
      i++;
    });
  });
  return {itens:itens,congelados:congelados};
}
