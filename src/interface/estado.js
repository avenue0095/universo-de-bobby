/* ---------- estado: vários jogadores ---------- */
const CHAVE2='mundo-numeros-v2';
const CORES=['#A9713F','#12A06E','#1B93C8','#7B5BE0','#F0455F','#E8A317'];
const VERSAO_DADOS=3;
/* IMPORTANTE: cada perfil precisa do SEU proprio objeto.
   Um objeto "vazio" compartilhado faria o progresso de um jogador vazar para o outro,
   porque {feitas:{}} seria a MESMA caixinha para todo mundo. Por isso e uma funcao. */
function estadoVazio(){
  return {nome:'',xp:0,ganhoTotal:0,ofensiva:0,melhorOfensiva:0,ultimoDia:'',
    feitas:{},errados:{},comprado:[],look:{},
    stats:{porLicao:{},dias:{},tempo:0},
    acertos:0,combo:0,som:true,voz:true,nivel:'facil',materia:'mat',
    vozPt:'',vozEn:'',velocidade:1};
}
function clonar(o){
  try{return JSON.parse(JSON.stringify(o));}catch(e){return null;}
}
/* monta um estado valido a partir do que estava guardado, sem nunca reaproveitar objetos */
function estadoDe(dados){
  const s=estadoVazio();
  const d=(dados&&typeof dados==='object')?clonar(dados):null;
  if(d)Object.keys(s).forEach(k=>{if(d[k]!==undefined&&d[k]!==null)s[k]=d[k];});
  const obj=v=>(v&&typeof v==='object'&&!Array.isArray(v))?v:{};
  s.feitas=obj(s.feitas);s.errados=obj(s.errados);s.look=obj(s.look);
  s.stats=obj(s.stats);
  s.stats.porLicao=obj(s.stats.porLicao);
  s.stats.dias=obj(s.stats.dias);
  s.stats.tempo=+s.stats.tempo||0;
  s.comprado=Array.isArray(s.comprado)?s.comprado.slice():[];
  ['xp','ganhoTotal','ofensiva','melhorOfensiva','acertos','combo'].forEach(k=>{s[k]=+s[k]||0;});
  s.som=s.som!==false;s.voz=s.voz!==false;
  s.vozPt=String(s.vozPt||'').slice(0,80);
  s.vozEn=String(s.vozEn||'').slice(0,80);
  s.velocidade=Math.min(1.3,Math.max(.6,+s.velocidade||1));
  if(['facil','medio','forte'].indexOf(s.nivel)<0)s.nivel='facil';
  if(['mat','pt','en'].indexOf(s.materia)<0)s.materia='mat';
  s.nome=String(s.nome||'').slice(0,18);
  return s;
}
let STORE={v:VERSAO_DADOS,perfis:[],atual:-1,senha:null};
let S=estadoVazio();
/* deixa o armazenamento sempre num formato valido, mesmo se vier corrompido */
function arrumarStore(x){
  const st={v:VERSAO_DADOS,perfis:[],atual:-1,senha:null};
  if(!x||typeof x!=='object')return st;
  const lista=Array.isArray(x.perfis)?x.perfis:[];
  lista.forEach((p,i)=>{
    if(!p||typeof p!=='object')return;
    st.perfis.push({
      id:String(p.id||('p'+Date.now().toString(36)+i.toString(36))),
      nome:String(p.nome||('Jogador '+(i+1))).slice(0,18),
      cor:CORES.indexOf(p.cor)>=0?p.cor:CORES[i%CORES.length],
      criado:+p.criado||Date.now(),
      dados:estadoDe(p.dados)
    });
  });
  if(x.senha&&typeof x.senha==='object'&&x.senha.h&&x.senha.s)
    st.senha={s:String(x.senha.s),h:String(x.senha.h)};
  const a=+x.atual;
  st.atual=(a>=0&&a<st.perfis.length)?a:-1;
  return st;
}
function lerStore(){
  try{
    const raw=localStorage.getItem(CHAVE2);
    if(raw){STORE=arrumarStore(JSON.parse(raw));return;}
  }catch(e){}
  try{
    const antigo=localStorage.getItem(CHAVE);
    if(antigo){
      const d=estadoDe(JSON.parse(antigo));
      STORE=arrumarStore({perfis:[{nome:d.nome||'Jogador 1',cor:CORES[0],dados:d}],atual:0});
      salvarStore();return;
    }
  }catch(e){}
  STORE={v:VERSAO_DADOS,perfis:[],atual:-1,senha:null};
}
function salvarStore(){
  try{STORE.v=VERSAO_DADOS;localStorage.setItem(CHAVE2,JSON.stringify(STORE));}
  catch(e){avisoArmazenamento();}
}
let avisouArmazenamento=false;
function avisoArmazenamento(){
  if(avisouArmazenamento)return;avisouArmazenamento=true;
  const d=document.createElement('div');d.className='aviso-voz';
  d.innerHTML='<b>Não consegui salvar o progresso</b><span>A memória do navegador está cheia ou bloqueada. '+
    'O jogo continua funcionando, mas o progresso desta sessão pode se perder.</span>';
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
  salvar();fecharPerfis();
  MATERIA=S.materia||'mat';
  UNITS=MATERIAS[MATERIA].units();TOTAL_LESSONS=MATERIAS[MATERIA].total();
  CAP_ATUAL=MATERIAS[MATERIA].caps();MISS_ATUAL=MATERIAS[MATERIA].miss();
  $('#nome-materia').textContent=MATERIAS[MATERIA].n;
  renderTrilha();telaMaterias();
}
function novoPerfil(nome,cor){
  const novo=estadoVazio();
  novo.nome=nome;novo.nivel=nivelEscolhido;
  STORE.perfis.push({id:'p'+Date.now().toString(36)+Math.random().toString(36).slice(2,6),
    nome:nome,cor:cor,criado:Date.now(),dados:novo});
  salvarStore();usarPerfil(STORE.perfis.length-1);
}
function apagarPerfil(i){
  STORE.perfis.splice(i,1);
  if(STORE.atual===i)STORE.atual=-1;
  else if(STORE.atual>i)STORE.atual--;
  salvarStore();
  if(STORE.atual<0){S=estadoVazio();}
  telaPerfis();
}
const hoje=()=>new Date().toISOString().slice(0,10);
function marcarDia(){
  const d=hoje();if(S.ultimoDia===d)return;
  const ontem=new Date(Date.now()-864e5).toISOString().slice(0,10);
  S.ofensiva=(S.ultimoDia===ontem)?S.ofensiva+1:1;S.ultimoDia=d;
  S.melhorOfensiva=Math.max(S.melhorOfensiva||0,S.ofensiva);
  const b=Math.min(50,S.ofensiva*5);S.xp+=b;S.ganhoTotal=(S.ganhoTotal||0)+b;
  LIC.bonusDia=b;
}

