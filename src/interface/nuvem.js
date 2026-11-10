/* ===== Nuvem: sincronização com a conta do responsável (Fase 4, S5 sem conta; docs/fase4/ARQUITETURA.md seção 5) =====
   O aparelho continua sendo a verdade imediata: salvar() grava no localStorage como sempre. Esta parte só ANOTA o que mudou
   (outbox 'universo-bobby-sync-v1'), empurra com atraso de 5 s (e ao esconder a aba e ao voltar a rede) e mescla a resposta com
   as MESMAS regras do servidor (supabase/migrations/0003_rpc.sql, sincronizar_perfil):
     - xp, acertos, melhor combo, estrelas, contadores do dia: o maior vence (nunca reduz);
     - moedas são um razão POR APARELHO: cada aparelho sobe só o que ELE ganhou e gastou (só cresce); o total é a soma dos
       aparelhos e o saldo é ganhas - gastas. Dois aparelhos offline não se apagam (0006_moedas_por_aparelho.sql);
     - comprado: união;  blocos (look, config, ofensiva...): o carimbo mais novo vence;  item de revisão: o carimbo mais novo vence.
   SEM CONFIGURAÇÃO NÃO FAZ NADA: NUVEM_CONFIG vazio e nenhum transporte = nuvem desligada; marcarSujo volta na hora, sem gravar
   chave nenhuma e sem ouvir evento nenhum. O formato 'universo-bobby-v4' não muda (o razão de moedas mora na outbox).
   O cliente do Supabase entra atrás da interface "transporte" (abaixo). PENDENTE-CONTA (S5 com conta): transporteSupabase() com o
   supabase-js servido localmente (sem CDN); a biblioteca NÃO foi baixada nesta rodada.
   Transporte = {criarPerfil({id_local,apelido,cor,faixa}) -> {id}, sincronizarPerfil(id,estado,fases,itens,dias) -> snapshot,
                 snapshotPerfil(id) -> snapshot}; snapshot no formato de snapshot_perfil() (0003_rpc.sql). */
const NUVEM_CHAVE='universo-bobby-sync-v1';
const NUVEM_CONFIG=Object.freeze({url:'',anon:''});   /* vazio = desligada. A S5 com conta preenche (SUPABASE_URL e a chave anon, que é pública). */
const NUVEM_TEMPO=Object.freeze({debounce:5000,intervalo:60000,cachePull:60000});   /* 60 s por perfil: cabe no limite de 240 por hora da conta */
const NUVEM_BLOCOS=['materia','look','config','ofensiva','colecao','desenhos','revisao_meta','prefs'];
const NUVEM_MAX_PERFIS=4;
const NUVEM_AVISO_MIGRACAO='Não consegui guardar na nuvem ainda. Seu progresso está todo aqui no aparelho.';

/* impressão digital curta de um valor (FNV-1a 32 bits): só para saber se mudou, não é segurança */
function nuvemHash(v){const s=JSON.stringify(v===undefined?null:v);let h=0x811c9dc5;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)>>>0;}return h.toString(36);}
const nuvemMateriaDaFase=id=>/^p/.test(id)?'pt':/^e/.test(id)?'en':'mat';
const nuvemObj=v=>(v&&typeof v==='object'&&!Array.isArray(v))?v:{};
const nuvemInt=v=>{v=Math.floor(+v);return isFinite(v)&&v>0?v:0;};
const nuvemMaisNovo=(a,b)=>!!a&&(!b||Date.parse(a)>Date.parse(b));

/* ---------- estado v4 <-> formato do banco ---------- */
function nuvemBlocoDe(s,b){
  switch(b){
    case 'materia':return s.materia;
    case 'revisao_meta':return {ultimoAquecimento:s.revisao.ultimoAquecimento||'',ajustadoEm:s.revisao.ajustadoEm||'',aliviadoEm:s.revisao.aliviadoEm||''};
    case 'prefs':return {som:s.som,voz:s.voz,musica:s.musica,vibra:s.vibra,velocidade:s.velocidade};
    default:return s[b];
  }
}
function nuvemPorBloco(s,b,v){
  const o=nuvemObj(v);
  if(b==='materia'){if(['mat','pt','en'].indexOf(v)>=0)s.materia=v;}
  else if(b==='revisao_meta'){s.revisao.ultimoAquecimento=o.ultimoAquecimento||'';s.revisao.ajustadoEm=o.ajustadoEm||'';s.revisao.aliviadoEm=o.aliviadoEm||'';}
  else if(b==='prefs'){['som','voz','musica','vibra','velocidade'].forEach(k=>{if(o[k]!==undefined)s[k]=o[k];});}
  else s[b]=JSON.parse(JSON.stringify(o));
}
function nuvemFasesDe(s){const ids={};Object.keys(s.feitas||{}).forEach(k=>{ids[k]=1;});Object.keys((s.stats&&s.stats.porLicao)||{}).forEach(k=>{ids[k]=1;});return Object.keys(ids);}
function nuvemFase(s,id){const p=nuvemObj(s.stats.porLicao[id]);return {fase_id:id,materia:nuvemMateriaDaFase(id),estrelas:+s.feitas[id]||0,acertos:nuvemInt(p.acertos),erros:nuvemInt(p.erros),tempo_seg:0,concluida_em:null};}
function nuvemDia(s,d){const x=nuvemObj(s.stats.dias[d]);return {dia:d,blocos:nuvemInt(x.b),perguntas:nuvemInt(x.q),acertos:nuvemInt(x.ac),revisoes:nuvemInt(x.rev),segundos:Math.min(86400,nuvemInt(x.seg))};}
function nuvemItem(s,k,carimbo){
  const a=s.revisao.itens[k],c=nuvemObj(s.revisao.congelados[k]);
  return {chave:k,materia:['mat','pt','en'].indexOf(c.m)>=0?c.m:'mat',caixa:a[0],proxima:a[1],vezes:a[2],acertos:a[3],lapsos:a[4],ultimo:a[5]||null,
    pergunta:k.indexOf('er:')===0?c:null,removido:false,carimbo:carimbo};
}
/* foto: impressão digital de cada parte, para marcarSujo saber o que mudou sem guardar cópia do estado */
function nuvemFoto(s){
  const f={blocos:{},fases:{},itens:{},dias:{}};
  NUVEM_BLOCOS.forEach(b=>{f.blocos[b]=nuvemHash(nuvemBlocoDe(s,b));});
  nuvemFasesDe(s).forEach(id=>{f.fases[id]=nuvemHash(nuvemFase(s,id));});
  Object.keys(s.revisao.itens).forEach(k=>{f.itens[k]=[nuvemHash([s.revisao.itens[k],s.revisao.congelados[k]]),nuvemObj(s.revisao.congelados[k]).m||'mat'];});
  Object.keys(s.stats.dias).forEach(d=>{f.dias[d]=nuvemHash(nuvemDia(s,d));});
  f.num=nuvemHash([s.xp,s.acertosTotal,s.melhorCombo,(s.comprado||[]).slice().sort()]);
  return f;
}
/* razão de moedas de um perfil que já existia (ARQUITETURA 5.5): gastas = preço de tudo que foi comprado, ganhas = saldo + gastas */
function nuvemRazaoInicial(s,preco){
  const gastas=(s.comprado||[]).reduce((t,id)=>t+(typeof preco==='function'?nuvemInt(preco(id)):0),0);
  return {ganhas:nuvemInt(s.moedas)+gastas,gastas:gastas,saldo:nuvemInt(s.moedas)};
}
/* cada gravação compara o saldo com o último visto: subiu = ganhou, desceu = gastou, no contador DESTE aparelho (reg.razao).
   Os outros aparelhos ficam em reg.outros (o que o servidor disse de cada um). Tudo só cresce e total ganhas - total gastas == saldo. */
const nuvemTotal=(reg,k)=>reg.razao[k]+Object.keys(reg.outros||{}).reduce((t,id)=>t+nuvemInt(reg.outros[id][k]),0);
function nuvemObservarSaldo(reg,saldo){
  saldo=nuvemInt(saldo);const d=saldo-reg.razao.saldo;
  if(d>0)reg.razao.ganhas+=d;else if(d<0)reg.razao.gastas+=-d;
  reg.razao.saldo=saldo;
}

/* o servidor aceita no máximo 5000 moedas ganhas a mais por chamada e por aparelho (0007_saldo_so_pela_rpc.sql). Se o aparelho tem
   mais guardado (dias offline, primeira subida de um perfil antigo), a linha DELE no snapshot volta menor que o razão local: falta subir
   o resto. O aparelho não baixa o próprio contador (nuvemMesclar usa o maior), então nada se perde; só chega em parcelas. */
function nuvemFaltaSubir(snap,reg,aparelho){
  if(!Array.isArray(nuvemObj(snap).moedas_aparelhos))return false;   /* servidor sem a lista: não dá para saber, não insiste */
  const l=(Array.isArray(nuvemObj(snap).moedas_aparelhos)?snap.moedas_aparelhos:[]).find(m=>m&&m.aparelho_id===aparelho)||{};
  return nuvemInt(l.ganhas)<reg.razao.ganhas||nuvemInt(l.gastas)<reg.razao.gastas;
}

/* ---------- merge local: o snapshot do servidor por cima do estado do aparelho, com as regras do servidor ---------- */
function nuvemMesclar(s,reg,snap,aparelho){
  snap=nuvemObj(snap);const e=nuvemObj(snap.estado),em=nuvemObj(e.blocos_em);
  const t=JSON.parse(JSON.stringify(s));   /* trabalha numa cópia; o estado vivo só recebe o que passar por estadoDe */
  t.xp=Math.max(nuvemInt(t.xp),nuvemInt(e.xp));
  t.acertosTotal=Math.max(nuvemInt(t.acertosTotal),nuvemInt(e.acertos_total));
  t.melhorCombo=Math.max(nuvemInt(t.melhorCombo),nuvemInt(e.melhor_combo));
  /* moedas: o servidor manda o contador de cada aparelho. O deste aparelho nunca desce (o que ele ganhou offline e ainda não subiu
     fica); o de cada outro vale pelo maior já visto. Total = soma. Nenhum ganho de nenhum aparelho se perde. */
  reg.outros=nuvemObj(reg.outros);
  (Array.isArray(snap.moedas_aparelhos)?snap.moedas_aparelhos:[]).forEach(m=>{
    if(!m||typeof m.aparelho_id!=='string')return;
    if(m.aparelho_id===aparelho){reg.razao.ganhas=Math.max(reg.razao.ganhas,nuvemInt(m.ganhas));reg.razao.gastas=Math.max(reg.razao.gastas,nuvemInt(m.gastas));return;}
    const o=nuvemObj(reg.outros[m.aparelho_id]);
    reg.outros[m.aparelho_id]={ganhas:Math.max(nuvemInt(o.ganhas),nuvemInt(m.ganhas)),gastas:Math.max(nuvemInt(o.gastas),nuvemInt(m.gastas))};
  });
  t.moedas=Math.max(0,nuvemTotal(reg,'ganhas')-nuvemTotal(reg,'gastas'));
  (Array.isArray(e.comprado)?e.comprado:[]).forEach(id=>{if(typeof id==='string'&&t.comprado.indexOf(id)<0)t.comprado.push(id);});
  NUVEM_BLOCOS.forEach(b=>{if(nuvemMaisNovo(em[b],reg.blocosEm[b])&&e[b]!==undefined){nuvemPorBloco(t,b,e[b]);reg.blocosEm[b]=em[b];}});
  (Array.isArray(snap.fases)?snap.fases:[]).forEach(f=>{
    if(!f||typeof f.fase_id!=='string')return;const id=f.fase_id;
    const est=Math.max(+t.feitas[id]||0,Math.min(3,nuvemInt(f.estrelas)));if(est>0)t.feitas[id]=est;
    const p=nuvemObj(t.stats.porLicao[id]);
    if(f.acertos||f.erros||t.stats.porLicao[id])t.stats.porLicao[id]={acertos:Math.max(nuvemInt(p.acertos),nuvemInt(f.acertos)),erros:Math.max(nuvemInt(p.erros),nuvemInt(f.erros))};
  });
  (Array.isArray(snap.itens)?snap.itens:[]).forEach(i=>{
    if(!i||typeof i.chave!=='string'||!nuvemMaisNovo(i.carimbo,reg.carimbos[i.chave]))return;
    const k=i.chave,a=t.revisao.itens[k];
    reg.carimbos[k]=i.carimbo;
    if(i.removido){delete t.revisao.itens[k];delete t.revisao.congelados[k];return;}
    t.revisao.itens[k]=[i.caixa,i.proxima,Math.max(nuvemInt(i.vezes),a?nuvemInt(a[2]):0),Math.max(nuvemInt(i.acertos),a?nuvemInt(a[3]):0),
      Math.max(nuvemInt(i.lapsos),a?nuvemInt(a[4]):0),i.ultimo||'',a?a[6]:0,a?a[7]:0];   /* dificil e dom não existem no banco: ficam os do aparelho */
    if(i.pergunta&&typeof i.pergunta==='object')t.revisao.congelados[k]=i.pergunta;
  });
  (Array.isArray(snap.dias)?snap.dias:[]).forEach(d=>{
    if(!d||typeof d.dia!=='string')return;
    const x=Object.assign({fases:0,seg:0,b:0,q:0,ac:0,rev:0,revAc:0,bm:{mat:0,pt:0,en:0}},nuvemObj(t.stats.dias[d.dia]));
    x.b=Math.max(nuvemInt(x.b),nuvemInt(d.blocos));x.q=Math.max(nuvemInt(x.q),nuvemInt(d.perguntas));x.ac=Math.max(nuvemInt(x.ac),nuvemInt(d.acertos));
    x.rev=Math.max(nuvemInt(x.rev),nuvemInt(d.revisoes));x.seg=Math.max(nuvemInt(x.seg),Math.min(86400,nuvemInt(d.segundos)));
    t.stats.dias[d.dia]=x;
  });
  /* tudo que veio de fora passa pela mesma validação do backup e do localStorage (tipo, tamanho, texto seguro) */
  const v=estadoDe(t);
  ['xp','moedas','acertosTotal','melhorCombo','comprado','materia','look','config','ofensiva','colecao','desenhos','revisao','feitas','som','voz','musica','vibra','velocidade']
    .forEach(k=>{s[k]=v[k];});
  s.stats.porLicao=v.stats.porLicao;s.stats.dias=v.stats.dias;
  reg.razao.saldo=s.moedas;
  return s;
}

/* ---------- a outbox ---------- */
function nuvemRegistroVazio(){return {nuvemId:'',migradoEm:'',sujo:{estado:'',fases:{},itens:{},dias:{}},blocosEm:{},carimbos:{},foto:null,razao:null,outros:{},ultimoPush:0,ultimoPull:0};}
/* id deste aparelho para o razão de moedas: sorteado uma vez por instalação, não identifica pessoa nem aparelho físico */
const NUVEM_APARELHO_RE=/^[A-Za-z0-9_-]{6,64}$/;
function nuvemNovoAparelho(){
  let b='';try{const a=new Uint8Array(12);crypto.getRandomValues(a);a.forEach(x=>{b+=('0'+x.toString(16)).slice(-2);});}catch(e){}
  if(!b)for(let i=0;i<24;i++)b+=Math.floor(Math.random()*16).toString(16);
  return 'ap'+b;
}
function nuvemArrumar(x){
  const o={v:1,aparelho:'',perfis:{},acesso:null};x=nuvemObj(x);const ps=nuvemObj(x.perfis);
  o.aparelho=typeof x.aparelho==='string'&&NUVEM_APARELHO_RE.test(x.aparelho)?x.aparelho:nuvemNovoAparelho();
  Object.keys(ps).slice(0,40).forEach(id=>{const r=Object.assign(nuvemRegistroVazio(),nuvemObj(ps[id]));
    r.sujo=Object.assign({estado:'',fases:{},itens:{},dias:{}},nuvemObj(r.sujo));
    if(r.razao&&!(r.razao.ganhas>=0&&r.razao.gastas>=0&&r.razao.saldo>=0))r.razao=null;
    const outros={};Object.keys(nuvemObj(r.outros)).slice(0,60).forEach(k=>{const v=nuvemObj(r.outros[k]);
      if(NUVEM_APARELHO_RE.test(k)&&k!==o.aparelho)outros[k]={ganhas:nuvemInt(v.ganhas),gastas:nuvemInt(v.gastas)};});
    r.outros=outros;o.perfis[id]=r;});
  const a=nuvemObj(x.acesso);if(typeof a.acesso_ate==='string')o.acesso={liberado:!!a.liberado,acesso_ate:a.acesso_ate,conferidoEm:String(a.conferidoEm||'')};
  return o;
}

/* opções: {config, transporte, armazem:{ler,gravar}, agora, agendar, desagendar, online, preco, perfis, atual, dadosDe, persistir, registrarEvento, ouvir} */
function criarNuvem(op){
  op=op||{};
  const cfg=nuvemObj(op.config),tr=op.transporte;
  const ligadaJa=!!(cfg.url&&cfg.anon&&tr&&typeof tr.sincronizarPerfil==='function');
  const desligada={ligada:()=>false,marcarSujo:()=>false,empurrar:()=>Promise.resolve(0),puxar:()=>Promise.resolve(false),
    migrarPrimeiraConta:()=>Promise.resolve({ok:false,motivo:'desligada'}),guardarAcesso:()=>false,acessoValido:()=>false,registro:()=>null,aparelho:()=>''};
  if(!ligadaJa)return desligada;

  const agora=op.agora||(()=>new Date()),agendar=op.agendar||setTimeout,desagendar=op.desagendar||clearTimeout;
  const online=op.online||(()=>typeof navigator==='undefined'||navigator.onLine!==false);
  let out=null,timer=null,emCurso=null;
  const ler=()=>{if(!out){let x=null;try{x=JSON.parse(op.armazem.ler(NUVEM_CHAVE)||'null');}catch(e){}out=nuvemArrumar(x);}return out;};
  const gravar=()=>{try{op.armazem.gravar(NUVEM_CHAVE,JSON.stringify(out));}catch(e){}};
  const regDe=(id,s)=>{const o=ler();if(!o.perfis[id])o.perfis[id]=nuvemRegistroVazio();const r=o.perfis[id];
    if(!r.razao)r.razao=nuvemRazaoInicial(s,op.preco);if(!r.foto)r.foto=fotoCompleta(r,s,{});return r;};
  /* foto depois de aplicar o servidor: guarda a matéria dos removidos que ainda vão subir */
  function fotoCompleta(r,s,removidosAntes){const f=nuvemFoto(s);f.razao=r.razao.ganhas+'/'+r.razao.gastas;f.removidos={};
    Object.keys(removidosAntes||{}).forEach(k=>{if(r.sujo.itens[k]&&!f.itens[k])f.removidos[k]=removidosAntes[k];});return f;}

  /* compara o estado com a última foto e anota o que mudou, com o carimbo do aparelho */
  function detectar(r,s){
    const f=nuvemFoto(s),q=r.foto,quando=agora().toISOString();let mudou=false;
    nuvemObservarSaldo(r,s.moedas);
    NUVEM_BLOCOS.forEach(b=>{if(f.blocos[b]!==q.blocos[b]){r.blocosEm[b]=quando;r.sujo.estado=quando;mudou=true;}});
    if(f.num!==q.num||r.razao.ganhas+'/'+r.razao.gastas!==q.razao){r.sujo.estado=quando;mudou=true;}
    Object.keys(f.fases).forEach(k=>{if(f.fases[k]!==q.fases[k]){r.sujo.fases[k]=quando;mudou=true;}});
    Object.keys(f.dias).forEach(k=>{if(f.dias[k]!==q.dias[k]){r.sujo.dias[k]=quando;mudou=true;}});
    Object.keys(f.itens).forEach(k=>{if(!q.itens[k]||f.itens[k][0]!==q.itens[k][0]){r.sujo.itens[k]=quando;r.carimbos[k]=quando;mudou=true;}});
    /* item que saiu da fila (dominado ou aparado): sobe como removido, com a matéria que tinha */
    f.removidos=Object.assign({},q.removidos||{});
    Object.keys(q.itens).forEach(k=>{if(!f.itens[k]){r.sujo.itens[k]=quando;r.carimbos[k]=quando;f.removidos[k]=q.itens[k][1];mudou=true;}});
    Object.keys(f.itens).forEach(k=>{delete f.removidos[k];});
    f.razao=r.razao.ganhas+'/'+r.razao.gastas;
    r.foto=f;return mudou;
  }
  function payload(r,s,tudo){
    const estado={xp:s.xp,aparelho_id:ler().aparelho,moedas_ganhas:r.razao.ganhas,moedas_gastas:r.razao.gastas,acertos_total:s.acertosTotal,melhor_combo:s.melhorCombo,
      comprado:(s.comprado||[]).slice(),blocos_em:Object.assign({},r.blocosEm),versao_app:typeof APP_VERSAO==='string'?APP_VERSAO:''};
    NUVEM_BLOCOS.forEach(b=>{estado[b]=nuvemBlocoDe(s,b);});
    const fases=(tudo?nuvemFasesDe(s):Object.keys(r.sujo.fases)).map(id=>nuvemFase(s,id));
    const dias=(tudo?Object.keys(s.stats.dias):Object.keys(r.sujo.dias).filter(d=>s.stats.dias[d])).map(d=>nuvemDia(s,d));
    const ks=tudo?Object.keys(s.revisao.itens):Object.keys(r.sujo.itens);
    const itens=ks.map(k=>s.revisao.itens[k]?nuvemItem(s,k,r.carimbos[k]||agora().toISOString())
      :{chave:k,materia:nuvemObj(r.foto.removidos)[k]||'mat',caixa:1,removido:true,carimbo:r.carimbos[k]||agora().toISOString()});
    return {estado,fases,itens,dias};
  }
  const temSujo=r=>!!(r.sujo.estado||Object.keys(r.sujo.fases).length||Object.keys(r.sujo.itens).length||Object.keys(r.sujo.dias).length);
  function limparEnviado(r,enviado){
    if(r.sujo.estado===enviado.estado)r.sujo.estado='';
    ['fases','itens','dias'].forEach(k=>Object.keys(enviado[k]).forEach(x=>{if(r.sujo[k][x]===enviado[k][x])delete r.sujo[k][x];}));
  }
  /* sobe um perfil e aplica a resposta. Lança se o transporte falhar (quem chama decide). */
  async function subir(i,tudo){
    const p=op.perfis()[i],s=op.dadosDe(i),r=regDe(p.id,s);
    detectar(r,s);
    const enviado=JSON.parse(JSON.stringify(r.sujo)),dados=payload(r,s,tudo);
    const snap=await tr.sincronizarPerfil(r.nuvemId,dados.estado,dados.fases,dados.itens,dados.dias);
    const s2=op.dadosDe(i);detectar(r,s2);limparEnviado(r,enviado);   /* o que mudou durante a ida fica sujo para a próxima */
    nuvemMesclar(s2,r,snap,ler().aparelho);r.foto=fotoCompleta(r,s2,r.foto.removidos);
    r.ultimoPush=agora().getTime();
    /* teto do servidor: o resto do razão fica sujo e sobe na próxima janela de 60 s, sem esperar a criança ganhar mais */
    if(nuvemFaltaSubir(snap,r,ler().aparelho)){r.sujo.estado=r.sujo.estado||agora().toISOString();agendarPush(NUVEM_TEMPO.intervalo);}
    gravar();if(op.persistir)op.persistir(i);
    return snap;
  }
  /* motivo 'debounce' respeita o intervalo de 60 s por perfil; 'forcado' (aba escondida, rede voltou, fim de fase) não */
  async function empurrar(motivo){
    if(!online())return 0;
    if(emCurso)return emCurso;
    emCurso=(async()=>{let n=0;const o=ler(),ps=op.perfis();
      for(let i=0;i<ps.length;i++){const r=o.perfis[ps[i].id];if(!r||!r.nuvemId)continue;
        detectar(r,op.dadosDe(i));if(!temSujo(r))continue;
        const falta=NUVEM_TEMPO.intervalo-(agora().getTime()-r.ultimoPush);
        if(motivo==='debounce'&&falta>0){agendarPush(falta);continue;}
        try{await subir(i,false);n++;}catch(e){gravar();}   /* sem rede ou servidor fora: a outbox guarda; tenta de novo depois */
      }
      return n;})();
    try{return await emCurso;}finally{emCurso=null;}
  }
  function agendarPush(ms){if(timer)desagendar(timer);timer=agendar(()=>{timer=null;return empurrar('debounce');},ms);}
  function marcarSujo(){
    const ps=op.perfis(),i=typeof op.atual==='function'?op.atual():-1;if(i<0||!ps[i])return false;
    const mudou=detectar(regDe(ps[i].id,op.dadosDe(i)),op.dadosDe(i));
    gravar();if(mudou)agendarPush(NUVEM_TEMPO.debounce);
    return mudou;
  }
  async function puxar(i){
    const p=op.perfis()[i];if(!p||!online())return false;const r=ler().perfis[p.id];if(!r||!r.nuvemId)return false;
    if(agora().getTime()-r.ultimoPull<NUVEM_TEMPO.cachePull)return false;
    try{const s=op.dadosDe(i);detectar(r,s);const snap=await tr.snapshotPerfil(r.nuvemId);
      nuvemMesclar(s,r,snap,ler().aparelho);r.foto=fotoCompleta(r,s,r.foto.removidos);
      r.ultimoPull=agora().getTime();gravar();if(op.persistir)op.persistir(i);return true;}catch(e){return false;}
  }
  /* primeira conta (ARQUITETURA 5.6): sobe cada perfil escolhido (até 4) e só marca migrado se o snapshot confere com o aparelho */
  async function migrarPrimeiraConta(escolhidos){
    const ps=op.perfis(),idx=(Array.isArray(escolhidos)?escolhidos:ps.map((_,i)=>i)).filter(i=>ps[i]).slice(0,NUVEM_MAX_PERFIS);
    const falhou=[],feitos=[];
    for(const i of idx){
      const p=ps[i],s=op.dadosDe(i),r=regDe(p.id,s);
      if(r.migradoEm){feitos.push(p.id);continue;}
      if(!r.nuvemId)r.razao=nuvemRazaoInicial(s,op.preco);   /* perfil que já existia: o razão sai do que foi comprado (ARQUITETURA 5.5) */
      const antes={fases:Object.keys(s.feitas).length,xp:s.xp,moedas:s.moedas,comprado:(s.comprado||[]).slice()};
      const salvo=JSON.parse(JSON.stringify(r));
      try{
        const criado=await tr.criarPerfil({id_local:p.id,apelido:p.nome,cor:p.cor,faixa:s.faixa});
        if(!criado||typeof criado.id!=='string')throw new Error('sem id');
        r.nuvemId=criado.id;
        const snap=await subir(i,true),e=nuvemObj(snap&&snap.estado),fs=Array.isArray(snap&&snap.fases)?snap.fases:[];
        const comp=Array.isArray(e.comprado)?e.comprado:[];
        /* moedas: o servidor pode ter aceitado só uma parcela (teto por chamada); aí o que falta segue no razão deste aparelho e sobe depois */
        const moedasOk=nuvemInt(e.moedas)>=antes.moedas||(nuvemFaltaSubir(snap,r,ler().aparelho)&&nuvemInt(op.dadosDe(i).moedas)>=antes.moedas);
        const confere=fs.filter(f=>f&&f.estrelas>0).length>=antes.fases&&nuvemInt(e.xp)>=antes.xp&&moedasOk&&antes.comprado.every(id=>comp.indexOf(id)>=0);
        if(!confere)throw new Error('snapshot não confere');
        r.migradoEm=agora().toISOString();gravar();feitos.push(p.id);
      }catch(e){
        Object.assign(r,salvo);r.nuvemId='';r.migradoEm='';gravar();falhou.push(p.id);   /* nada marcado como migrado; o local fica intacto */
        if(typeof op.registrarEvento==='function')op.registrarEvento('sync_migracao_falhou',{});
      }
    }
    const ficaram=ps.map((p,i)=>i).filter(i=>idx.indexOf(i)<0).map(i=>ps[i].id);
    return {ok:!falhou.length,feitos,falhou,ficaramNoAparelho:ficaram,aviso:falhou.length?NUVEM_AVISO_MIGRACAO:''};
  }
  /* cache do acesso (ARQUITETURA 6.4): liberado offline só enquanto agora < acesso_ate que o SERVIDOR deu. Ainda não liga o muro. */
  function guardarAcesso(r){r=nuvemObj(r);if(typeof r.acesso_ate!=='string'&&r.acesso_ate!==null)return false;
    ler().acesso={liberado:!!r.liberado,acesso_ate:r.acesso_ate||'',conferidoEm:agora().toISOString()};gravar();return true;}
  function acessoValido(){const a=ler().acesso;return !!(a&&a.liberado&&a.acesso_ate&&Date.parse(a.acesso_ate)>agora().getTime());}

  if(typeof op.ouvir==='function'){
    op.ouvir('visibilitychange',()=>(typeof document!=='undefined'&&document.visibilityState==='hidden')?empurrar('forcado'):null);
    op.ouvir('online',()=>empurrar('forcado'));
  }
  return {ligada:()=>true,marcarSujo,empurrar,puxar,migrarPrimeiraConta,guardarAcesso,acessoValido,registro:id=>ler().perfis[id]||null,aparelho:()=>ler().aparelho};
}

/* instância do app. Sem NUVEM_CONFIG e sem transporte: desligada (não grava, não ouve, não chama rede). */
var NUVEM=criarNuvem({config:NUVEM_CONFIG,transporte:null});
