/* ---------- estado v4: vários jogadores, chave 'universo-bobby-v4' ----------
   A chave antiga 'mundo-numeros-v2' (v3) só é LIDA e nunca mais escrita: ela é a cópia de segurança.
   Esquema e regras: docs/FASE-2-especificacao.md, seção 8. Migração: migracao.js. */
const CORES=['#A9713F','#12A06E','#1B93C8','#7B5BE0','#F0455F','#E8A317'];
const CHAVE2=CHAVE_V3;       /* nome antigo, ainda usado por quem lê a chave do v3 */
const APP_VERSAO='2026.10.24-logica';

const objDe=v=>(v&&typeof v==='object'&&!Array.isArray(v))?v:{};
const numDe=(v,min,max,def)=>{v=+v;if(!isFinite(v))return def;return Math.min(max,Math.max(min,v));};
const intDe=(v,min,max,def)=>Math.round(numDe(v,min,max,def));
const diaOuVazio=v=>ehDia(v)?String(v):'';
const listaDe=(v,max)=>Array.isArray(v)?v.slice(0,max):[];
const textosDe=(v,max,tam)=>listaDe(v,max).filter(x=>typeof x==='string').map(x=>x.slice(0,tam||120));

/* IMPORTANTE: cada perfil precisa do SEU proprio objeto.
   Um objeto "vazio" compartilhado faria o progresso de um jogador vazar para o outro. Por isso e uma funcao. */
function configPadrao(){
  return {metaMin:5,revisaoPorDia:8,limiteBlocosDia:null,diasLivres:[],pausaAte:'',
    ofensivaLigada:true,missoesLigadas:true,
    lembrete:{ics:false,hora:'17:00',dias:[1,2,3,4,5],comApelido:false},ligaFamilia:false};
}
function contadoresVazios(){
  return {fase:0,faseNova:0,revisao:0,fatos:0,historia:0,combo:0,enAudio:0,ditado:0,aulaRevista:0,
    lapso:0,mat:0,itensNovos:0,porque:0,materiasBloco:[]};
}
function diarioVazio(dia){
  return {dia:dia||'',blocos:0,perguntas:0,acertos:0,metaOk:false,estrela:false,liberados:0,kit:0,
    bau:{aberto:false,dia:0,itens:[]},missoes:[],paradaVista:false,paradaAcao:'',c:contadoresVazios()};
}
function revisaoVazia(){return {itens:{},congelados:{},ultimoAquecimento:''};}
/* desenhos (1 por etapa): herdado = etapas que já tinham fase concluída antes do modelo novo (mantêm o direito),
   vistos = desenhos já abertos (para o ponto de novidade), tinta = jogadas de colorir [x,y,cor] por desenho */
function desenhosVazios(){return {herdado:[],vistos:[],tinta:{}};}
const ID_DESENHO=/^des-(mat|por|ing)(0[1-9]|10)$/;
function desenhosHerdados(feitas){
  const r=[];
  [['mat',UNITS_MAT],['por',UNITS_PT],['ing',UNITS_EN]].forEach(par=>par[1].forEach((u,i)=>{
    if(u.lessons.some(l=>feitas[l.id]))r.push('des-'+par[0]+('0'+(i+1)).slice(-2));
  }));
  return r;
}
function normalizaDesenhos(x,feitas){
  const d=desenhosVazios();
  if(!x||typeof x!=='object'||Array.isArray(x)){d.herdado=desenhosHerdados(feitas||{});return d;}   /* estado de antes do modelo novo */
  d.herdado=listaDe(x.herdado,30).filter(i=>typeof i==='string'&&ID_DESENHO.test(i));
  d.vistos=listaDe(x.vistos,30).filter(i=>typeof i==='string'&&ID_DESENHO.test(i));
  const t=objDe(x.tinta);
  Object.keys(t).filter(k=>ID_DESENHO.test(k)).slice(0,30).forEach(k=>{
    if(!Array.isArray(t[k]))return;
    d.tinta[k]=t[k].slice(0,600).filter(o=>Array.isArray(o)&&o.length===3).map(o=>[intDe(o[0],0,4000,0),intDe(o[1],0,4000,0),intDe(o[2],0,15,0)]);
  });
  return d;
}
function colecaoVazia(){return {adesivos:[],ornamentos:[],medalhas:[],poses:[],molduras:[],trilhas:[],constelacao:[]};}
function estadoVazio(){
  return {nome:'',faixa:'f78',materia:'mat',
    xp:0,moedas:0,acertosTotal:0,melhorCombo:0,
    feitas:{},errados:{},comprado:[],look:{},desenhos:desenhosVazios(),
    ofensiva:ofensivaNova(),diario:diarioVazio(''),espera:null,
    config:configPadrao(),revisao:revisaoVazia(),colecao:colecaoVazia(),
    semana:{chave:'',estrelas:0,aulaRevista:0,constelacao:false},
    stats:{porLicao:{},dias:{},tempo:0,amostras:[]},missHist:[],
    som:true,voz:true,velocidade:1,
    legado:{nivel:'',errados:{},vozPt:'',vozEn:'',migradoEm:''}};
}
function clonar(o){
  try{return JSON.parse(JSON.stringify(o),semChavesPerigosas);}catch(e){return null;}
}
function normalizaOfensiva(x){
  x=objDe(x);const o=ofensivaNova();
  o.atual=intDe(x.atual,0,100000,0);o.melhor=Math.max(o.atual,intDe(x.melhor,0,100000,0));
  o.ultimo=diaOuVazio(x.ultimo);o.descansando=!!x.descansando;o.valorAntes=intDe(x.valorAntes,0,100000,0);
  o.lacuna=intDe(x.lacuna,0,100000,0);o.congeladores=intDe(x.congeladores,0,OF_P.maxCongeladores,0);
  o.prog=intDe(x.prog,0,OF_P.diasParaCongelador-1,0);o.recuperouEm=diaOuVazio(x.recuperouEm);
  const r=objDe(x.recuperavel);
  o.recuperavel=(x.recuperavel&&typeof x.recuperavel==='object')?{V:intDe(r.V,0,100000,0),extras:intDe(r.extras,0,99,0),feita:!!r.feita}:null;
  o.diasLivres=listaDe(x.diasLivres,7).map(Number).filter(n=>n>=0&&n<=6);
  o.pausaAte=diaOuVazio(x.pausaAte);
  o.cobertos=listaDe(x.cobertos,60).filter(ehDia);
  o.marcos=listaDe(x.marcos,20).map(Number).filter(n=>OF_MARCOS.indexOf(n)>=0);
  if(x.relogioEstranho)o.relogioEstranho=true;
  return o;
}
function normalizaConfig(x){
  x=objDe(x);const c=configPadrao(),l=objDe(x.lembrete);
  c.metaMin=[5,10,15].indexOf(+x.metaMin)>=0?+x.metaMin:5;
  c.revisaoPorDia=[5,8,12].indexOf(+x.revisaoPorDia)>=0?+x.revisaoPorDia:8;
  c.limiteBlocosDia=(+x.limiteBlocosDia>=1)?intDe(x.limiteBlocosDia,1,30,1):null;
  c.diasLivres=listaDe(x.diasLivres,7).map(Number).filter(n=>n>=0&&n<=6);
  c.pausaAte=diaOuVazio(x.pausaAte);
  c.ofensivaLigada=x.ofensivaLigada!==false;c.missoesLigadas=x.missoesLigadas!==false;
  c.lembrete={ics:!!l.ics,hora:/^\d{2}:\d{2}$/.test(l.hora)?l.hora:'17:00',
    dias:listaDe(l.dias,7).map(Number).filter(n=>n>=0&&n<=6),comApelido:!!l.comApelido};
  c.ligaFamilia=false;       /* só existe na Fase 4 */
  return c;
}
function normalizaDiario(x){
  x=objDe(x);const d=diarioVazio(diaOuVazio(x.dia)),b=objDe(x.bau),c=objDe(x.c);
  d.blocos=intDe(x.blocos,0,9999,0);d.perguntas=intDe(x.perguntas,0,99999,0);d.acertos=intDe(x.acertos,0,99999,0);
  d.metaOk=!!x.metaOk;d.estrela=!!x.estrela;d.liberados=intDe(x.liberados,0,99,0);d.kit=intDe(x.kit,0,2,0);
  d.bau={aberto:!!b.aberto,dia:intDe(b.dia,0,100000,0),itens:listaDe(b.itens,10).filter(i=>i&&typeof i==='object').map(i=>({k:String(i.k||'').slice(0,20),n:String(i.n||'').slice(0,60),v:intDe(i.v,0,100000,0)}))};
  d.missoes=listaDe(x.missoes,3).filter(m=>m&&typeof m==='object'&&typeof m.id==='string').map(m=>({id:m.id.slice(0,8),alvo:intDe(m.alvo,1,999,1),prog:intDe(m.prog,0,9999,0),ok:!!m.ok}));
  d.paradaVista=!!x.paradaVista;d.paradaAcao=['terminar','continuar'].indexOf(x.paradaAcao)>=0?x.paradaAcao:'';
  Object.keys(d.c).forEach(k=>{if(k!=='materiasBloco')d.c[k]=intDe(c[k],0,99999,0);});
  d.c.materiasBloco=textosDe(c.materiasBloco,3,4).filter(m=>['mat','pt','en'].indexOf(m)>=0);
  return d;
}
function normalizaRevisao(x){
  x=objDe(x);const r=revisaoVazia(),it=objDe(x.itens),cg=objDe(x.congelados);
  Object.keys(cg).slice(0,1500).forEach(k=>{if(!chaveOk(k)||!/^[a-zA-Z0-9:._|-]{1,80}$/.test(k))return;const q=perguntaSegura(cg[k]);if(q)r.congelados[k]=Object.assign(q,{m:['mat','pt','en'].indexOf(objDe(cg[k]).m)>=0?objDe(cg[k]).m:'mat'});});
  Object.keys(it).slice(0,2500).forEach(k=>{
    const a=it[k];if(!Array.isArray(a)||a.length<5||!ehDia(a[1]))return;
    if(k.indexOf('er:')===0&&!r.congelados[k])return;          /* erro sem a pergunta guardada não dá para refazer */
    r.itens[k]=[intDe(a[0],1,5,1),String(a[1]),intDe(a[2],0,99999,0),intDe(a[3],0,99999,0),intDe(a[4],0,99999,0),diaOuVazio(a[5]),a[6]?1:0,a[7]?1:0];
  });
  r.ultimoAquecimento=diaOuVazio(x.ultimoAquecimento);
  r.ajustadoEm=diaOuVazio(x.ajustadoEm);r.aliviadoEm=diaOuVazio(x.aliviadoEm);
  return r;
}
function normalizaStats(x){
  x=objDe(x);const s={porLicao:{},dias:{},tempo:Math.max(0,+x.tempo||0),amostras:[]};
  const pl=objDe(x.porLicao);
  Object.keys(pl).slice(0,400).forEach(k=>{const p=objDe(pl[k]);s.porLicao[k]={acertos:intDe(p.acertos,0,999999,0),erros:intDe(p.erros,0,999999,0)};});
  const dias=objDe(x.dias);
  Object.keys(dias).filter(ehDia).sort().slice(-400).forEach(k=>{
    const d=objDe(dias[k]);
    const bm=objDe(d.bm);
    s.dias[k]={fases:intDe(d.fases,0,9999,0),seg:intDe(d.seg,0,99999,0),b:intDe(d.b,0,9999,0),q:intDe(d.q,0,99999,0),ac:intDe(d.ac,0,99999,0),rev:intDe(d.rev,0,99999,0),revAc:intDe(d.revAc,0,99999,0),
      bm:{mat:intDe(bm.mat,0,999,0),pt:intDe(bm.pt,0,999,0),en:intDe(bm.en,0,999,0)}};
  });
  s.amostras=listaDe(x.amostras,120).map(Number).filter(n=>n>0&&n<=120);
  return s;
}
function normalizaColecao(x){
  x=objDe(x);const c=colecaoVazia();
  Object.keys(c).forEach(k=>{c[k]=textosDe(x[k],400,80);});
  return c;
}
/* monta um estado valido a partir do que estava guardado (v4, ou v3 que e convertido), sem reaproveitar objetos */
function estadoDe(dados){
  let d=(dados&&typeof dados==='object')?clonar(dados):null;
  if(d&&ehDadosV3(d))d=migrarDadosV3(d,hoje());
  const s=estadoVazio();
  d=d||{};
  s.nome=nomeSeguro(d.nome,18);
  s.faixa=FAIXAS.indexOf(d.faixa)>=0?d.faixa:'f78';
  s.materia=['mat','pt','en'].indexOf(d.materia)>=0?d.materia:'mat';
  s.xp=intDe(d.xp,0,1e9,0);s.moedas=intDe(d.moedas,0,1e9,0);
  s.acertosTotal=intDe(d.acertosTotal,0,1e9,0);s.melhorCombo=intDe(d.melhorCombo,0,1e6,0);
  const f=objDe(d.feitas);Object.keys(f).forEach(k=>{const e=estrelasDe(f[k]);if(e>0)s.feitas[k]=e;});
  const er=objDe(d.errados);Object.keys(er).forEach(k=>{if(!chaveOk(k)||!/^(mat|pt|en)[0-9]{1,2}$/.test(k))return;if(Array.isArray(er[k]))s.errados[k]=er[k].map(perguntaSegura).filter(Boolean).slice(-30);});
  s.comprado=listaDe(d.comprado,400).map(x=>idSimples(x)).filter(Boolean);
  s.look={};const lk=objDe(d.look);['chapeu','rosto','pescoco','pelo','pers','companheiro'].forEach(k=>{if(lk[k]!==undefined){const v=k==='pelo'||lk[k]===''?String(lk[k]).replace(/[^a-z0-9-]/g,'').slice(0,24):idSimples(lk[k]);s.look[k]=v;}});
  s.desenhos=normalizaDesenhos(d.desenhos,s.feitas);
  s.ofensiva=normalizaOfensiva(d.ofensiva);
  s.diario=normalizaDiario(d.diario);
  const e=objDe(d.espera);
  s.espera=d.espera&&typeof d.espera==='object'?{bilhete:String(e.bilhete||'').slice(0,20),presente:textoCurtoSeguro(e.presente,40),desde:diaOuVazio(e.desde),vistoEm:diaOuVazio(e.vistoEm),mundoNovo:!!e.mundoNovo,erroDificil:!!e.erroDificil,usouCongelador:diaOuVazio(e.usouCongelador)}:null;
  s.config=normalizaConfig(d.config);
  s.revisao=normalizaRevisao(d.revisao);
  s.colecao=normalizaColecao(d.colecao);
  const w=objDe(d.semana);s.semana={chave:String(w.chave||'').slice(0,10),estrelas:intDe(w.estrelas,0,99,0),aulaRevista:intDe(w.aulaRevista,0,99,0),constelacao:!!w.constelacao};
  s.stats=normalizaStats(d.stats);
  s.missHist=listaDe(d.missHist,5).filter(h=>h&&typeof h==='object'&&ehDia(h.dia)).map(h=>({dia:h.dia,ids:textosDe(h.ids,3,4),ok:intDe(h.ok,0,3,0)}));
  s.som=d.som!==false;s.voz=d.voz!==false;
  s.velocidade=numDe(d.velocidade,.8,1.2,1);   /* a voz gravada toca de 80% a 120% */
  const vozAntiga={pt:String(d.vozPt||'').slice(0,80),en:String(d.vozEn||'').slice(0,80)};
  const l=objDe(d.legado);
  s.legado={nivel:['','facil','medio','forte'].indexOf(l.nivel)>=0?l.nivel:'',errados:objDe(l.errados),vozPt:String(l.vozPt||vozAntiga.pt).slice(0,80),vozEn:String(l.vozEn||vozAntiga.en).slice(0,80),migradoEm:diaOuVazio(l.migradoEm)};
  return s;
}

let STORE={v:VERSAO_DADOS,migradoDe:null,criadoEm:'',perfis:[],atual:-1,senha:null,avisoVisto:true};
let S=estadoVazio();
const ehF78=()=>S.faixa==='f78';
const ROTULO_FAIXA={f78:'7 a 8 anos',f910:'9 a 10 anos',f1112:'11 a 12 anos'};
/* nível do explorador: n quando xp >= 60 * (n-1)^2, teto 30. O xp nunca diminui, então o nível nunca cai. */
const nivelDoExplorador=()=>Math.min(30,Math.floor(Math.sqrt(Math.max(0,S.xp)/60))+1);

/* deixa o armazenamento sempre num formato valido, mesmo se vier corrompido. Aceita o store v3 (atual = indice) e o v4 (atual = id). */
function arrumarStore(x){
  const st={v:VERSAO_DADOS,migradoDe:null,criadoEm:hoje(),perfis:[],atual:-1,senha:null,avisoVisto:true};
  if(!x||typeof x!=='object')return st;
  st.migradoDe=x.migradoDe?String(x.migradoDe).slice(0,40):null;
  st.criadoEm=diaOuVazio(x.criadoEm)||hoje();
  st.avisoVisto=x.avisoVisto!==false;
  const lista=Array.isArray(x.perfis)?x.perfis:[];
  lista.forEach((p,i)=>{
    if(!p||typeof p!=='object')return;
    st.perfis.push({
      id:String(p.id||('p'+Date.now().toString(36)+i.toString(36))),
      pid:String(p.pid||sorteioId(12)).slice(0,24),
      nome:nomeSeguro(p.nome||('Jogador '+(i+1)),18)||('Jogador '+(i+1)),
      cor:CORES.indexOf(p.cor)>=0?p.cor:CORES[i%CORES.length],
      criado:+p.criado||Date.now(),
      dados:estadoDe(p.dados)
    });
  });
  if(x.senha&&typeof x.senha==='object'&&x.senha.h&&x.senha.s){
    const sn=x.senha;
    if(sn.v===2&&/^[0-9a-f]{32}$/.test(String(sn.s))&&/^[0-9a-f]{64}$/.test(String(sn.h)))
      st.senha={v:2,s:String(sn.s),it:intDe(sn.it,10000,2000000,150000),h:String(sn.h),e:intDe(sn.e,0,1000,0),b:Math.max(0,Math.min(Date.now()+900000,+sn.b||0))};
    else st.senha={s:String(sn.s).slice(0,40),h:String(sn.h).slice(0,40)};
  }
  if(typeof x.atual==='string'){st.atual=st.perfis.findIndex(p=>p.id===x.atual);}
  else{const a=+x.atual;st.atual=(a>=0&&a<st.perfis.length)?a:-1;}
  return st;
}
function storeParaDisco(){
  const p=STORE.perfis[STORE.atual];
  return {v:VERSAO_DADOS,migradoDe:STORE.migradoDe||null,criadoEm:STORE.criadoEm||hoje(),
    atual:p?p.id:null,avisoVisto:STORE.avisoVisto!==false,senha:STORE.senha,perfis:STORE.perfis};
}
/* Migra de 'mundo-numeros-v2' (v3) e, se faltar, do fluxo ainda mais antigo 'trilha-matematica-v1'.
   Devolve {store, migrou, aviso}. NUNCA escreve nem apaga a chave antiga. */
function migrarDoLegado(){
  let bruto=null,v3=null,origem=null;
  try{bruto=localStorage.getItem(CHAVE_V3);}catch(e){}
  if(bruto){try{v3=JSON.parse(bruto);origem='mundo-numeros-v2@3';}catch(e){v3=null;}}
  if(!v3||typeof v3!=='object'||!Array.isArray(v3.perfis)){
    v3=null;
    try{
      const antigo=localStorage.getItem(CHAVE);
      if(antigo){
        const d=JSON.parse(antigo);
        v3={perfis:[{nome:(d&&d.nome)||'Jogador 1',cor:CORES[0],dados:d}],atual:0};
        origem='trilha-matematica-v1@1';bruto=null;
      }
    }catch(e){v3=null;}
  }
  const vazio=arrumarStore(null);
  if(!v3)return {store:vazio,migrou:false,aviso:''};
  let aviso='';
  /* passo 2: cópia bruta; falta de espaço não impede a migração, mas avisa */
  if(bruto){try{localStorage.setItem(CHAVE_V3_BAK,bruto);}catch(e){aviso='cota';}}
  const dia=hoje();
  const perfis=[];
  let falha=null;
  v3.perfis.forEach((p,i)=>{
    if(!p||typeof p!=='object')return;
    const antigo=(p.dados&&typeof p.dados==='object')?p.dados:{};
    const dados=ehDadosV3(antigo)||antigo.faixa===undefined?migrarDadosV3(antigo,dia):antigo;
    const motivo=validarMigracao(antigo,dados);
    if(motivo&&!falha)falha='perfil '+(i+1)+': '+motivo;
    const rv=migrarErrosParaRevisao(dados.errados,dia);
    dados.revisao={itens:rv.itens,congelados:rv.congelados,ultimoAquecimento:''};
    perfis.push({id:p.id,pid:sorteioId(12),nome:p.nome,cor:p.cor,criado:p.criado,dados:dados});
  });
  const st=arrumarStore({perfis:perfis,atual:v3.atual,senha:v3.senha,criadoEm:dia});
  st.migradoDe=origem;st.avisoVisto=false;
  if(falha){st.semGravar=true;aviso='falhou: '+falha;}
  return {store:st,migrou:true,aviso:aviso};
}
function lerStore(){
  let bruto=null;
  try{bruto=localStorage.getItem(CHAVE4);}catch(e){}
  if(bruto){
    try{STORE=arrumarStore(JSON.parse(bruto));return;}
    catch(e){try{localStorage.setItem(CHAVE_V4_RUIM,bruto);}catch(e2){}}   /* ilegível: guarda a cópia e tenta recomeçar do v3 */
  }
  const r=migrarDoLegado();
  STORE=r.store;
  if(r.migrou&&!STORE.semGravar){
    salvarStore();
    if(typeof registrarEvento==='function')registrarEvento('migracao_ok',{perfis:STORE.perfis.length});
  }
  if(r.aviso==='cota')avisoArmazenamento('Não consegui guardar a cópia de segurança do progresso antigo. Vale baixar um backup em Para o responsável.');
  else if(r.aviso)avisoArmazenamento('A atualização não conseguiu converter o progresso. Nada foi apagado: o progresso antigo continua guardado.');
}
function salvarStore(){
  if(STORE.semGravar)return;
  try{STORE.v=VERSAO_DADOS;localStorage.setItem(CHAVE4,JSON.stringify(storeParaDisco()));}
  catch(e){avisoArmazenamento();}
}
let avisouArmazenamento=false;
function avisoArmazenamento(texto){
  if(avisouArmazenamento)return;avisouArmazenamento=true;
  const d=document.createElement('div');d.className='aviso-voz';
  d.innerHTML='<b>Não consegui salvar o progresso</b><span>'+(texto||'A memória do navegador está cheia ou bloqueada. '+
    'O jogo continua funcionando, mas o progresso desta sessão pode se perder.')+'</span>';
  document.body.appendChild(d);
  setTimeout(()=>{d.classList.add('sai');setTimeout(()=>d.remove(),400);},7000);
}
function salvar(){
  /* so grava no perfil que esta em uso — nunca em outro */
  if(STORE.atual>=0&&STORE.perfis[STORE.atual]){
    STORE.perfis[STORE.atual].dados=S;
    if(S.nome)STORE.perfis[STORE.atual].nome=S.nome;
    salvarStore();
  }
}
function perfilAtual(){return STORE.perfis[STORE.atual]||{nome:'',cor:CORES[0]};}
function usarPerfil(i){
  STORE.atual=i;
  S=estadoDe(STORE.perfis[i].dados);
  S.nome=STORE.perfis[i].nome;
  if(typeof garantirDia==='function')garantirDia();
  salvar();fecharPerfis();
  MATERIA=S.materia||'mat';
  UNITS=MATERIAS[MATERIA].units();TOTAL_LESSONS=MATERIAS[MATERIA].total();
  CAP_ATUAL=MATERIAS[MATERIA].caps();MISS_ATUAL=MATERIAS[MATERIA].miss();
  $('#nome-materia').textContent=MATERIAS[MATERIA].n;
  renderTrilha();telaMaterias();
}
function novoPerfil(nome,cor){
  const novo=estadoVazio();
  novo.nome=nome;novo.faixa=faixaEscolhida;
  STORE.perfis.push({id:'p'+Date.now().toString(36)+Math.random().toString(36).slice(2,6),pid:sorteioId(12),
    nome:nome,cor:cor,criado:Date.now(),dados:novo});
  salvarStore();usarPerfil(STORE.perfis.length-1);
  if(typeof registrarEvento==='function')registrarEvento('perfil_criado',{faixa:novo.faixa});
}
/* Rastros de um perfil nas chaves antigas (a cópia do v3, a cópia bruta, a versão corrompida e o formato mais antigo):
   o app só lia essas chaves como segurança, mas dado de criança não pode ficar escondido depois de "apagar jogador". */
function limparRastrosDoPerfil(p){
  if(!p)return;
  try{
    [CHAVE_V3,CHAVE_V3_BAK].forEach(k=>{
      const bruto=localStorage.getItem(k);if(!bruto)return;
      let o=null;try{o=JSON.parse(bruto,semChavesPerigosas);}catch(e){}
      if(!o||!Array.isArray(o.perfis)){localStorage.removeItem(k);return;}      /* ilegível: não dá para separar, sai inteiro */
      const resto=o.perfis.filter(q=>!(q&&q.id!==undefined&&String(q.id)===String(p.id)));
      if(resto.length===o.perfis.length)return;
      if(!resto.length)localStorage.removeItem(k);
      else{o.perfis=resto;if(!resto.some(q=>q&&String(q.id)===String(o.atual)))o.atual=0;localStorage.setItem(k,JSON.stringify(o));}
    });
    localStorage.removeItem(CHAVE_V4_RUIM);
    const antigo=localStorage.getItem(CHAVE);
    if(antigo){let d=null;try{d=JSON.parse(antigo);}catch(e){}
      if(!d||String(d.nome||'')===String(p.nome||'')||STORE.perfis.length===0)localStorage.removeItem(CHAVE);}
  }catch(e){}
}
const PREFIXOS_DO_APP=['universo-bobby','mundo-numeros','trilha-matematica'];
/* Apaga TUDO que o app guarda neste aparelho. opc.caches: também as imagens e vozes guardadas para jogar sem internet. */
async function apagarTudoDoAparelho(opc){
  opc=opc||{};
  const chaves=[];
  try{
    for(let i=localStorage.length-1;i>=0;i--){const k=localStorage.key(i);if(k&&PREFIXOS_DO_APP.some(pf=>k.indexOf(pf)===0))chaves.push(k);}
  }catch(e){}
  [CHAVE4,CHAVE_V3,CHAVE_V3_BAK,CHAVE_V4_RUIM,CHAVE,typeof CHAVE_EVENTOS!=='undefined'?CHAVE_EVENTOS:'universo-bobby-eventos-v1'].forEach(k=>{if(chaves.indexOf(k)<0)chaves.push(k);});
  chaves.forEach(k=>{try{localStorage.removeItem(k);}catch(e){}});
  const apagados=[];
  if(opc.caches&&typeof caches!=='undefined'){
    try{const ks=await caches.keys();for(const k of ks){if(k.indexOf('bobby-arte-')===0||k.indexOf('bobby-audio-')===0){await caches.delete(k);apagados.push(k);}}}catch(e){}
  }
  STORE.perfis=[];STORE.atual=-1;STORE.senha=null;S=estadoVazio();
  return {chaves:chaves,caches:apagados};
}
function apagarPerfil(i){
  const apagado=STORE.perfis[i];
  const pid=STORE.perfis[i]&&STORE.perfis[i].pid;
  STORE.perfis.splice(i,1);
  if(STORE.atual===i)STORE.atual=-1;
  else if(STORE.atual>i)STORE.atual--;
  salvarStore();
  limparRastrosDoPerfil(apagado);
  if(pid&&typeof apagarEventosDe==='function')apagarEventosDe(pid);
  if(STORE.atual<0){S=estadoVazio();}
  telaPerfis();
}
