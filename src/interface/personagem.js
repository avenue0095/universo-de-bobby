/* ---------- o personagem: Bobby, o ursinho (arte semirrealista em WebP) e a tela "Meu personagem" ----------
   O Bobby agora é imagem: 12 poses de corpo inteiro (P01 a P12) e 8 expressões de retrato (E01 a E08).
   Guarda-roupa em camadas (1F, interface/camadas.js): cabeça, rosto, pescoço, costas e mão ao mesmo tempo, em todas as poses.
   Companheiros: 6, cada um com 4 poses (a primeira é a que aparece nas telas). Itens novos entram em ITENS, sem mexer no resto. */
const BOBBY={
  oi:'bobby-p01',comemora:'bobby-p02',pensa:'bobby-e04',aponta:'bobby-p04',anda:'bobby-p05a',le:'bobby-p06',escuta:'bobby-p07',conta:'bobby-p08',
  incentiva:'bobby-p09',presente:'bobby-p10',tchau:'bobby-p11',descansa:'bobby-p12',
  feliz:'bobby-e01',radiante:'bobby-e02',curioso:'bobby-e03',surpreso:'bobby-e05',ops:'bobby-e06',concentrado:'bobby-e07',tranquilo:'bobby-e08'
};
/* [id, nome por extenso (legenda do palco), nome curto (cabe na miniatura)] */
const EXPRESSOES=[['bobby-e01','Alegre','Alegre'],['bobby-e02','Radiante','Radiante'],['bobby-e03','Curioso','Curioso'],['bobby-e04','Pensativo','Pensa'],
  ['bobby-e05','Surpreso','Surpreso'],['bobby-e06','Incentivando','Anima'],['bobby-e07','Concentrado','Foco'],['bobby-e08','Tranquilo','Calmo']];
const POSES=[['bobby-p01','Oi','Oi'],['bobby-p02','Comemora','Festa'],['bobby-p03','Pensa','Pensa'],['bobby-p04','Aponta','Aponta'],['bobby-p05a','Caminha','Anda'],['bobby-p06','Lê','Lê'],
  ['bobby-p07','Escuta','Escuta'],['bobby-p08','Conta','Conta'],['bobby-p09','Joinha','Joinha'],['bobby-p10','Presente','Presente'],['bobby-p11','Tchau','Tchau'],['bobby-p12','Descansa','Soneca']];
/* imagens de frente onde o chapéu entra: [centro x, largura de orelha a orelha], em fração da largura da imagem */
const FRONTAIS={
  'bobby-p01':[.45,.645],'bobby-p02':[.49,.58],'bobby-p08':[.60,.71],'bobby-p09':[.50,.69],'bobby-p10':[.50,.88],
  'bobby-e01':[.5,.94],'bobby-e02':[.5,.92],'bobby-e03':[.5,.94],'bobby-e04':[.5,.92],'bobby-e05':[.5,.92],'bobby-e06':[.5,.92],'bobby-e07':[.5,.87],'bobby-e08':[.5,.92]
};
/* P6 (Filipe, 09/11/2026): ninguém jogou a versão antiga; não há item antigo sem arte para guardar nem dono de item antigo para converter. */
/* slots antigos (um look por vez) -> slots novos */
const SLOT_ANTIGO={chapeu:'cabeca'};
const EXPRESSAO_IDS=['feliz','radiante','curioso','pensa','surpreso','ops','concentrado','tranquilo'];
/* companheiros: P01 Oi, P02 Comemora, P03 Caminha, P04 Pensa. O que cada situação do jogo mostra (erro é Pensa, nunca triste) */
const POSE_COMP={oi:'p01',feliz:'p02',radiante:'p02',comemora:'p02',incentiva:'p02',pensa:'p04',concentrado:'p04',curioso:'p04',ops:'p04',anda:'p03'};
/* quem a criança escolheu: o companheiro (se tiver um e a arte existir) ou o Bobby com o que está vestido */
function persAtivo(L){
  L=L||(typeof S!=='undefined'&&S.look)||{};
  const c=L.companheiro&&COMPANHEIROS.filter(x=>x.id===L.companheiro)[0];
  return (c&&ativo(c.id+'-p01'))?{tipo:'comp',id:c.id,n:c.n,quem:c.quem}:{tipo:'bobby'};
}
/* O personagem escolhido numa tela. exp: nome de BOBBY (oi, feliz, ops...). Com companheiro escolhido ele toma o lugar do Bobby em todo o jogo
   (mapa, aula, pergunta, reações, baú, bilhete, fim de fase); só a tela Meu personagem passa o look explícito e continua mostrando o Bobby.
   alt vazio = decorativo (o texto ao lado já diz tudo). */
function MASC(exp,cls,look,alt){
  if(look===undefined||look===null){
    const pa=persAtivo();
    if(pa.tipo==='comp'){
      const pose=POSE_COMP[exp]||'p01',p2=ativo(pa.id+'-'+pose)?pose:'p01';
      return typeof compComCamadas==='function'?compComCamadas(pa.id,p2,'mascote comp'+(cls?' '+cls:''),alt):imgArte(pa.id+'-'+p2,{cls:'mascote comp'+(cls?' '+cls:''),alt:alt||''});
    }
  }
  return MASCB(exp,cls,look,alt);
}
/* O Bobby (sempre o Bobby) com tudo o que está vestido, em qualquer pose: a imagem da pose + uma camada por acessório (camadas.js). */
function MASCB(exp,cls,look,alt){
  const id=BOBBY[exp]||(ativo(exp)?exp:BOBBY.oi);
  const L=look||(typeof S!=='undefined'&&S.look)||{};
  const c=bobbyEmCamadas(id,'mascote'+(cls?' '+cls:''),L,alt||'');
  return c||imgArte(id,{cls:'mascote'+(cls?' '+cls:''),alt:alt||''});
}
/* retrato redondo do personagem em uso (topo, barra, cartões de jogador): o companheiro ou o rosto do Bobby com tudo o que está vestido.
   look = o do jogador (cartões de outros jogadores). */
function retratoPers(cls,look){
  const L=look||(typeof S!=='undefined'&&S.look)||{};
  const pa=persAtivo(L);
  if(pa.tipo==='comp')return typeof compComCamadas==='function'&&L===S.look?compComCamadas(pa.id,'p01','retrato retrato-comp'+(cls?' '+cls:''),pa.n):imgArte(pa.id+'-p01',{cls:'retrato retrato-comp'+(cls?' '+cls:''),eager:true,alt:pa.n});
  return bobbyEmCamadas('bobby-e01','retrato retrato-camadas'+(cls?' '+cls:''),L,'')||imgArte('bobby-e01',{cls:'retrato'+(cls?' '+cls:''),eager:true});
}
/* o Bobby de sempre (cartão de novo jogador, onde ainda não há look nem companheiro) */
const retratoBobby=cls=>imgArte('bobby-e01',{cls:'retrato'+(cls?' '+cls:''),eager:true});

/* ---------- Meu personagem: posse e vestir (a tela está em editor.js) ---------- */
const temItemEm=(st,id)=>((st&&st.comprado)||[]).indexOf(id)>=0;
const temItem=id=>temItemEm(S,id);
/* vestir num slot (vários slots ao mesmo tempo). id vazio tira. Só veste o que a criança tem e o que pertence ao slot. */
function vestir(slot,id){
  if(SLOTS.indexOf(slot)<0)return false;
  if(id&&!(VESTIVEIS[id]&&VESTIVEIS[id].slot===slot&&temItem(id)))return false;
  S.look=Object.assign({},S.look);S.look[slot]=id||'';
  return true;
}
const companheiroComprado=id=>(S.comprado||[]).indexOf(id)>=0;
/* compra do companheiro pelo catálogo único (loja.js): mesmas regras de portão e de cofrinho */
function comprarCompanheiro(id){
  const r=comprarItem(id);if(!r.ok)return;
  S.look=Object.assign({},S.look);S.look.companheiro=id;
  salvar();somMoeda();somFim();pintarTopo();telaLoja();
}
function escolherCompanheiro(id){
  if(id&&!companheiroComprado(id))return;
  S.look=Object.assign({},S.look);S.look.companheiro=id;
  salvar();somPasso();pintarTopo();telaLoja();
}
function lojaAviso(t){const a=$('#loja-aviso');if(a)a.innerHTML=t?'<div class="aviso">'+t+'</div>':'';}
