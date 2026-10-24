/* ---------- backup: exportar e importar um perfil ----------
   docs/FASE-2-especificacao.md, seção 8.4. Formato v4:
   { app, versao:4, quando, perfil:{id,nome,cor,dados}, soma:'fnv1a-8hex' }
   A 'soma' detecta arquivo cortado ou editado à mão. O backup NÃO leva eventos de medição nem o 'pid'. */
function somaDoPerfil(perfil){return fnv8(JSON.stringify(perfil));}
function montarPacote(p){
  const perfil={id:p.id,nome:p.nome,cor:p.cor,dados:estadoDe(p.dados)};
  return {app:'universo-de-bobby',versao:VERSAO_DADOS,quando:new Date().toISOString(),perfil:perfil,soma:somaDoPerfil(perfil)};
}
/* Lê o texto de um arquivo de backup. Devolve {ok:false,erro} ou
   {ok:true,versao,id,nome,cor,dados,somaConfere}. Aceita as versões 3 e 4 (a 3 passa pela migração). */
function lerPacote(texto){
  if(typeof texto!=='string'||texto.length>TETO_BACKUP_BYTES)return {ok:false,erro:'Esse arquivo é grande demais para ser um backup do Universo de Bobby.'};
  let pac=null;
  try{pac=JSON.parse(texto,semChavesPerigosas);}catch(e){}
  if(!pac||pac.app!=='universo-de-bobby'||!pac.perfil||typeof pac.perfil!=='object')
    return {ok:false,erro:'Esse arquivo não é um backup do Universo de Bobby.'};
  const v=+pac.versao;
  if(v!==3&&v!==4)return {ok:false,erro:v>4?'Esse backup vem de uma versão mais nova do app. Atualize o app e tente de novo.':'Não reconheci a versão desse backup.'};
  const pf=pac.perfil;
  const somaConfere=v===4?(String(pac.soma||'')===somaDoPerfil(pf)):true;
  const nome=nomeSeguro(pf.nome||'Jogador',18)||'Jogador';
  return {ok:true,versao:v,id:v===4&&pf.id?String(pf.id).replace(/[^A-Za-z0-9_-]/g,'').slice(0,40):'',nome:nome,
    cor:CORES.indexOf(pf.cor)>=0?pf.cor:null,dados:estadoDe(pf.dados),somaConfere:somaConfere};
}
/* coloca o perfil lido no armazenamento. modo: 'substituir' (troca o de mesmo id) ou 'novo' (cria outro) */
function aplicarPacote(lido,modo){
  const idx=lido.id?STORE.perfis.findIndex(p=>p.id===lido.id):-1;
  const cor=lido.cor||CORES[STORE.perfis.length%CORES.length];
  if(modo==='substituir'&&idx>=0){
    STORE.perfis[idx].nome=lido.nome;STORE.perfis[idx].cor=cor;STORE.perfis[idx].dados=lido.dados;
    if(STORE.atual===idx){S=estadoDe(lido.dados);S.nome=lido.nome;}
    salvarStore();return idx;
  }
  STORE.perfis.push({id:'p'+Date.now().toString(36)+Math.random().toString(36).slice(2,5),pid:sorteioId(12),
    nome:lido.nome,cor:cor,criado:Date.now(),dados:lido.dados});
  salvarStore();return STORE.perfis.length-1;
}
function baixarPerfil(){
  const p=STORE.perfis[STORE.atual];
  if(!p)return;
  salvar();
  const pacote=montarPacote(p);
  const nome='bobby-'+String(p.nome||'perfil').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')+'.json';
  entregar(nome,JSON.stringify(pacote,null,1));
}
function restaurarPerfil(){
  const ent=document.createElement('input');
  ent.type='file';ent.accept='application/json,.json';
  ent.addEventListener('change',()=>{
    const f=ent.files&&ent.files[0];if(!f)return;
    if(f.size>TETO_BACKUP_BYTES){alertaResp('Esse arquivo é grande demais para ser um backup do Universo de Bobby.');return;}
    const fr=new FileReader();
    fr.onload=()=>{
      const lido=lerPacote(String(fr.result));
      if(!lido.ok){alertaResp(escapa(lido.erro));return;}
      confirmarRestauracao(lido);
    };
    fr.readAsText(f);
  });
  ent.click();
}
/* Nunca silencioso: soma errada pede confirmação; id já existente pergunta se substitui ou salva como outro perfil. */
function confirmarRestauracao(lido){
  const existe=lido.id&&STORE.perfis.some(p=>p.id===lido.id);
  const fim=(modo)=>{
    fecharFolha();
    aplicarPacote(lido,modo);
    alertaResp('Perfil <b>'+escapa(lido.nome)+'</b> '+(modo==='substituir'?'substituído':'restaurado')+'. Ele aparece na tela "Quem vai jogar?".');
  };
  const passoExiste=()=>{
    if(!existe){fim('novo');return;}
    abrirFolha('<div class="folha-in"><h2>Esse perfil já existe aqui</h2>'+
      '<p>Já há um jogador com o mesmo código de <b>'+escapa(lido.nome)+'</b>. O que você prefere?</p>'+
      '<div class="folha-bts"><button class="btn" id="rs-sub">Substituir o perfil existente</button>'+
      '<button class="btn fantasma" id="rs-novo">Salvar como outro perfil</button>'+
      '<button class="btn fantasma" id="rs-cancela">Cancelar</button></div></div>');
    $('#rs-sub').addEventListener('click',()=>fim('substituir'));
    $('#rs-novo').addEventListener('click',()=>fim('novo'));
    $('#rs-cancela').addEventListener('click',fecharFolha);
  };
  if(!lido.somaConfere){
    abrirFolha('<div class="folha-in"><h2>Esse arquivo parece diferente do original</h2>'+
      '<p>A conferência do backup não bateu. Ele pode ter sido cortado ou editado. Quer importar mesmo assim?</p>'+
      '<div class="folha-bts"><button class="btn fantasma" id="rs-mesmo">Importar mesmo assim</button>'+
      '<button class="btn" id="rs-cancela">Cancelar</button></div></div>');
    $('#rs-mesmo').addEventListener('click',passoExiste);
    $('#rs-cancela').addEventListener('click',fecharFolha);
    return;
  }
  passoExiste();
}
