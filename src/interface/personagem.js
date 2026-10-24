/* ---------- o personagem: Bobby, o ursinho (arte semirrealista em WebP) e a tela "Meu personagem" ----------
   O Bobby agora é imagem: 12 poses de corpo inteiro (P01 a P12) e 8 expressões de retrato (E01 a E08).
   Chapéu é sobreposição e só aparece em imagem de frente (a cabeça virada pediria uma imagem nova por pose).
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
/* catálogo do guarda-roupa. 'arte' = existe imagem nova (o item aparece de verdade). Sem 'arte' = item da versão antiga:
   quem já tinha comprado continua com o direito e vê o item guardado ("volta com a arte nova"); ninguém compra o que não tem arte.
   Dois jeitos de aparecer: modo 'sobrepor' (o chapéu de explorador, por cima das imagens de frente) e 'look' (o urso inteiro usando o item:
   as poses não coincidem pixel a pixel com a base, então a imagem do Bobby é TROCADA pelo look escolhido, com transição de opacidade).
   Só um look por vez. Dono de item antigo é dono do look que o substitui (DONOS). */
const PECAS={
  chapeu:{
    explorador:{n:'Chapéu de explorador',p:100,arte:'bobby-item-chapeu',modo:'sobrepor'},
    bone:{n:'Boné',p:120,arte:'item-bone'},capacete:{n:'Capacete aberto',p:400,arte:'item-capacete'},coroa:{n:'Coroa de papel',p:600,arte:'item-coroa'},
    festa:{n:'Chapéu de festa',p:180},chef:{n:'Chapéu de chef',p:240},espacial:{n:'Capacete espacial',p:400},pirata:{n:'Chapéu de pirata',p:320}
  },
  rosto:{oculos:{n:'Óculos de astronauta',p:150,arte:'item-oculos'},sol:{n:'Óculos de sol',p:220},heroi:{n:'Máscara de herói',p:280},tapaolho:{n:'Tapa-olho',p:200}},
  pescoco:{lenco:{n:'Lenço',p:180,arte:'item-lenco'},capa:{n:'Capa azul',p:450,arte:'item-capa'},cachecol:{n:'Cachecol',p:180},gravata:{n:'Gravata-borboleta',p:140},medalha:{n:'Medalha de ouro',p:350}},
  pelo:{mel:{n:'Pelo mel',p:100},cinza:{n:'Pelo cinza',p:150},panda:{n:'Pelo panda',p:260},polar:{n:'Pelo polar',p:300},rosa:{n:'Pelo rosa',p:220},choco:{n:'Chocolate',p:180}},
  pers:{nina:{n:'Nina, a coelhinha',p:180},pim:{n:'Pim, o gatinho',p:220},zeca:{n:'Zeca, o macaquinho',p:260},lulu:{n:'Lulu, a corujinha',p:320}}
};
const DONOS={capacete:['espacial'],lenco:['cachecol'],oculos:['sol']};
const LOOKS_ORDEM=[['chapeu','explorador'],['chapeu','bone'],['rosto','oculos'],['pescoco','lenco'],['pescoco','capa'],['chapeu','capacete'],['chapeu','coroa']];
const SLOTS_LOOK=['chapeu','rosto','pescoco'];
const ABAS_LOJA=[['comp','Companheiro'],['look','Looks']];
const EXPRESSAO_IDS=['feliz','radiante','curioso','pensa','surpreso','ops','concentrado','tranquilo'];

/* o look em uso: {slot,id,peca} ou null (sem item ou sem arte) */
function lookEmUso(L){
  L=L||{};
  for(const sl of SLOTS_LOOK){const id=L[sl];const p=id&&PECAS[sl][id];if(p&&p.arte&&ativo(p.arte))return {slot:sl,id:id,peca:p};}
  return null;
}
/* Itens de look (boné, coroa, óculos) que existem como imagem de look inteiro (só na pose de frente) ganham também uma SOBREPOSIÇÃO recortada
   do próprio look (assets/itens/ov-*.webp, feita por build/ativos.py), para aparecer nas outras poses de frente (Comemora, Conta, Joinha, Presente).
   Ancoragem definida UMA vez, em unidades da largura de orelha a orelha (W) do Bobby da pose: k = largura do item / W; dx = deslocamento do
   centro do item em relação ao centro da cabeça / W; dy = topo do item em relação ao topo da orelha / W. Capa, capacete e lenço não têm
   sobreposição (o capacete e a capa são o corpo inteiro): nas outras poses o Bobby aparece sem eles. */
const OVERLAYS={bone:{arte:'ov-bone',k:.535,dx:-.013,dy:-.116},coroa:{arte:'ov-coroa',k:.369,dx:-.036,dy:-.167},oculos:{arte:'ov-oculos',k:.723,dx:-.039,dy:.016}};
/* topo da orelha em cada pose de frente, em fração da altura da imagem (a maioria começa no topo) */
const TOPO_ORELHA={'bobby-p02':.014};
/* companheiros: P01 Oi, P02 Comemora, P03 Caminha, P04 Pensa. O que cada situação do jogo mostra (erro é Pensa, nunca triste) */
const POSE_COMP={oi:'p01',feliz:'p02',radiante:'p02',comemora:'p02',incentiva:'p02',pensa:'p04',concentrado:'p04',curioso:'p04',ops:'p04',anda:'p03'};
/* quem a criança escolheu: o companheiro (se tiver um e a arte existir) ou o Bobby com o look em uso */
function persAtivo(L){
  L=L||(typeof S!=='undefined'&&S.look)||{};
  const c=L.companheiro&&COMPANHEIROS.filter(x=>x.id===L.companheiro)[0];
  return (c&&ativo(c.id+'-p01'))?{tipo:'comp',id:c.id,n:c.n,quem:c.quem}:{tipo:'bobby'};
}
function overlayDoLook(uso){return uso&&OVERLAYS[uso.id]&&ativo(OVERLAYS[uso.id].arte)?OVERLAYS[uso.id]:null;}
/* O personagem escolhido numa tela. exp: nome de BOBBY (oi, feliz, ops...). Com companheiro escolhido ele toma o lugar do Bobby em todo o jogo
   (mapa, aula, pergunta, reações, baú, bilhete, fim de fase); só a tela Meu personagem passa o look explícito e continua mostrando o Bobby.
   alt vazio = decorativo (o texto ao lado já diz tudo). */
function MASC(exp,cls,look,alt){
  if(look===undefined||look===null){
    const pa=persAtivo();
    if(pa.tipo==='comp'){
      const pose=POSE_COMP[exp]||'p01',id=ativo(pa.id+'-'+pose)?pa.id+'-'+pose:pa.id+'-p01';
      return imgArte(id,{cls:'mascote comp'+(cls?' '+cls:''),alt:alt||''});
    }
  }
  return MASCB(exp,cls,look,alt);
}
/* O Bobby (sempre o Bobby, com o look em uso). Look de urso inteiro só existe numa pose (a frontal, 'oi') e vira retrato recortado
   nas expressões; nas outras poses de frente entra a sobreposição do item (boné, coroa, óculos) ou o chapéu de explorador. */
function MASCB(exp,cls,look,alt){
  const id=BOBBY[exp]||(ativo(exp)?exp:BOBBY.oi);
  const L=look||(typeof S!=='undefined'&&S.look)||{};
  const uso=lookEmUso(L),avatar=/avatar/.test(cls||'');
  if(uso&&uso.peca.modo!=='sobrepor'){
    const retrato=EXPRESSAO_IDS.indexOf(exp)>=0||/^bobby-e0/.test(id);
    if(retrato)return '<span class="mascote look-retrato'+(cls?' '+cls:'')+'">'+imgArte(uso.peca.arte,{alt:alt||''})+'</span>';
    if(exp==='oi'||id==='bobby-p01')return imgArte(uso.peca.arte,{cls:'mascote look-corpo'+(cls?' '+cls:''),alt:alt||''});
  }
  const img=imgArte(id,{cls:'mascote'+(cls?' '+cls:''),alt:alt||''});
  const anc=FRONTAIS[id],a=ativo(id);
  if(!uso||!anc||!a)return img;
  if(uso.peca.modo==='sobrepor'){
    if(avatar){   /* círculo: o Bobby de frente com o chapéu, encolhido para o chapéu caber dentro do aro */
      const fr=MASCB('oi','',L);
      return '<span class="mascote ret-pers'+(cls?' '+cls:'')+'"><span class="ret-in">'+fr+'</span></span>';
    }
    const larg=anc[1]*.66,topo=.34*anc[1]*a[1]/a[2];
    return '<span class="bobby-com-item">'+img+imgArte(uso.peca.arte,{cls:'item-chapeu',style:'left:'+(anc[0]*100).toFixed(1)+'%;top:'+(topo*100).toFixed(1)+'%;width:'+(larg*100).toFixed(1)+'%'})+'</span>';
  }
  const ov=overlayDoLook(uso);
  if(!ov||avatar)return img;      /* capa, capacete, lenço: sem item fora da pose de frente */
  const cx=(anc[0]+ov.dx*anc[1])*100,larg=ov.k*anc[1]*100,topo=((TOPO_ORELHA[id]||0)+ov.dy*anc[1]*a[1]/a[2])*100;
  return '<span class="bobby-com-item">'+img+imgArte(ov.arte,{cls:'item-ov',style:'left:'+cx.toFixed(1)+'%;top:'+topo.toFixed(1)+'%;width:'+larg.toFixed(1)+'%'})+'</span>';
}
/* retrato redondo do personagem em uso (topo, barra, cartões de jogador): o companheiro, o Bobby com o look de urso inteiro (recortado na
   cabeça) ou o Bobby com o chapéu/boné/coroa/óculos. Nunca fica sem o look. look = o do jogador (cartões de outros jogadores). */
function retratoPers(cls,look){
  const L=look||(typeof S!=='undefined'&&S.look)||{};
  const pa=persAtivo(L);
  if(pa.tipo==='comp')return imgArte(pa.id+'-p01',{cls:'retrato retrato-comp'+(cls?' '+cls:''),eager:true,alt:pa.n});
  const uso=lookEmUso(L);
  if(uso&&uso.peca.modo!=='sobrepor')return imgArte(uso.peca.arte,{cls:'retrato retrato-look'+(cls?' '+cls:''),eager:true});
  if(uso){
    /* só o chapéu de explorador chega aqui (boné, coroa e óculos têm look inteiro) */
    return '<span class="retrato ret-pers'+(cls?' '+cls:'')+'"><span class="ret-in">'+MASCB('oi','',L)+'</span></span>';
  }
  return imgArte('bobby-e01',{cls:'retrato'+(cls?' '+cls:''),eager:true});
}
/* o Bobby de sempre (cartão de novo jogador, onde ainda não há look nem companheiro) */
const retratoBobby=cls=>imgArte('bobby-e01',{cls:'retrato'+(cls?' '+cls:''),eager:true});

/* ---------- Meu personagem ---------- */
let abaLoja='comp',lojaOrigem='perfil',palcoModo='rosto',palcoId='bobby-e01',lookAnterior='';
const temItem=id=>(S.comprado||[]).indexOf(id)>=0||(DONOS[id]||[]).some(o=>(S.comprado||[]).indexOf(o)>=0);
const antigoSubstituido=id=>Object.keys(DONOS).some(k=>DONOS[k].indexOf(id)>=0);
function vestir(slot,id){            /* só um look por vez: vestir um tira o outro */
  S.look=Object.assign({},S.look);
  SLOTS_LOOK.forEach(sl=>{S.look[sl]='';});
  if(id)S.look[slot]=id;
}
function comprar(slot,id){
  const it=PECAS[slot][id];
  if(!it||!it.arte)return;
  if(S.moedas<it.p){lojaAviso('Faltam '+(it.p-S.moedas)+' moedas para “'+it.n+'”. Cada resposta certa vale 10 moedas.');return;}
  S.moedas-=it.p;S.comprado=(S.comprado||[]).concat([id]);
  vestir(slot,id);
  salvar();somMoeda();somFim();pintarTopo();telaLoja();
}
function equipar(slot,id){
  vestir(slot,(S.look||{})[slot]===id?'':id);
  salvar();somPasso();pintarTopo();telaLoja();
}
function escolherCompanheiro(id){
  S.look=Object.assign({},S.look);S.look.companheiro=id;
  salvar();somPasso();pintarTopo();telaLoja();
}
function lojaAviso(t){const a=$('#loja-aviso');if(a)a.innerHTML=t?'<div class="aviso">'+t+'</div>':'';}
/* itens que o jogador já comprou na versão antiga e ainda não têm arte nova: ficam guardados */
function guardadosDa(aba){
  const r=[];
  if(aba==='look')SLOTS_LOOK.forEach(sl=>Object.keys(PECAS[sl]).forEach(id=>{const it=PECAS[sl][id];if(!it.arte&&!antigoSubstituido(id)&&temItem(id))r.push(it.n);}));
  if(aba==='comp')['pers','pelo'].forEach(sl=>Object.keys(PECAS[sl]).forEach(id=>{if(temItem(id))r.push(PECAS[sl][id].n);}));
  return r;
}
function palcoHTML(){
  const L=S.look||{};
  const uso=lookEmUso(L),cheio=!!(uso&&uso.peca.modo!=='sobrepor');
  const ex=EXPRESSOES.concat(POSES);
  const nomeAtual=cheio?uso.peca.n:(ex.filter(x=>x[0]===palcoId)[0]||['','Alegre'])[1];
  const comp=COMPANHEIROS.filter(c=>c.id===L.companheiro)[0]||null;
  const chapeuEq=uso&&uso.peca.modo==='sobrepor';
  const semChapeu=chapeuEq&&!FRONTAIS[palcoId];
  const mudou=(uso?uso.id:'')!==lookAnterior;lookAnterior=uso?uso.id:'';
  const grande=cheio
    ?imgArte(uso.peca.arte,{cls:'mascote look-corpo bobby-grande'+(mudou?' entra':''),alt:'Bobby, o ursinho explorador, com '+uso.peca.n.toLowerCase()})
    :MASC(palcoId,'bobby-grande'+(mudou?' entra':''),L,'Bobby, o ursinho explorador, '+nomeAtual.toLowerCase()+(chapeuEq&&FRONTAIS[palcoId]?', de chapéu':''));
  let h='<section class="palco" aria-label="Seu personagem">'+
    '<button class="palco-bobby '+(cheio||palcoModo==='corpo'?'corpo':'rosto')+'" id="palco-bobby" aria-label="Bobby, '+nomeAtual.toLowerCase()+(cheio?'':'. Toque para mudar a expressão')+'">'+grande+'</button>';
  if(comp)h+='<div class="palco-comp">'+imgArte(comp.id+'-p01',{alt:comp.n+', '+comp.quem})+'</div>';
  h+='<p class="palco-nome" aria-live="polite"><b>Bobby</b> · '+escapa(nomeAtual)+(semChapeu?'<small>O chapéu aparece nas imagens de frente.</small>':'')+
     (cheio?'<small>Com um item de look o Bobby fica nesta pose. Tire o item para trocar a expressão.</small>':'')+'</p></section>';
  if(cheio)return h;
  h+='<div class="palco-modos" role="group" aria-label="O que mostrar"><button class="aba'+(palcoModo==='rosto'?' on':'')+'" data-modo="rosto">Rosto</button>'+
     '<button class="aba'+(palcoModo==='corpo'?' on':'')+'" data-modo="corpo">Corpo inteiro</button></div>';
  const lista=palcoModo==='rosto'?EXPRESSOES:POSES;
  h+='<div class="palco-escolha" role="group" aria-label="'+(palcoModo==='rosto'?'Expressões':'Poses')+'">'+lista.map(x=>
    '<button class="mini-pose'+(x[0]===palcoId?' on':'')+'" data-pose="'+x[0]+'" aria-label="'+x[1]+'" aria-pressed="'+(x[0]===palcoId)+'">'+imgArte(x[0],{})+'<span>'+(x[2]||x[1])+'</span></button>').join('')+'</div>';
  return h;
}
function cartaoLook(slot,id){
  const it=PECAS[slot][id],L=S.look||{},tem=temItem(id),eq=L[slot]===id;
  const bt=tem?'<button class="btn-sec" data-eq="'+slot+'|'+id+'">'+(eq?'Tirar':'Usar')+'</button>'
              :'<button class="'+(S.moedas<it.p?'btn-sec':'btn-acao')+'" data-buy="'+slot+'|'+id+'">'+IC.moeda+' '+it.p+'</button>';
  /* miniatura padronizada: o Bobby inteiro vestido com o item (o chapéu entra sobre a pose Oi) */
  const figura='<div class="item-img item-look">'+(it.modo==='sobrepor'?MASC('oi','',{[slot]:id},it.n):imgArte(it.arte,{alt:it.n}))+'</div>';
  return '<div class="item'+(eq?' equipado':'')+'">'+figura+(eq?'<span class="selo">'+IC.certo+' em uso</span>':'')+'<b>'+it.n+'</b>'+bt+'</div>';
}
function telaLoja(){
  const L=S.look||{};
  let h='<div class="perfil-in guarda">'+palcoHTML();
  h+='<div class="saldo-linha"><span class="saldo">'+IC.moeda+'<b>'+S.moedas+'</b> moedas</span></div>';
  h+='<div class="abas" role="tablist" aria-label="O que você quer trocar">'+ABAS_LOJA.map(sl=>
    '<button class="aba'+(abaLoja===sl[0]?' on':'')+'" role="tab" aria-selected="'+(abaLoja===sl[0])+'" data-aba="'+sl[0]+'">'+sl[1]+'</button>').join('')+'</div>';
  h+='<div id="loja-aviso"></div><div class="vitrine">';
  if(abaLoja==='comp'){
    COMPANHEIROS.forEach(c=>{
      const eq=(L.companheiro||'')===c.id;
      h+='<div class="item'+(eq?' equipado':'')+'">'+(eq?'<span class="selo">'+IC.certo+' com você</span>':'')+
        '<div class="item-img">'+imgArte(c.id+'-p01',{})+'</div><b>'+c.n+'</b><span class="tipo">'+c.quem+'</span>'+
        '<button class="btn-sec" data-comp="'+c.id+'"'+(eq?' aria-pressed="true"':'')+'>'+(eq?'Tirar':'Chamar')+'</button></div>';
    });
  }else{
    const nenhum=!lookEmUso(L);
    h+='<div class="item'+(nenhum?' equipado':'')+'">'+
      '<div class="item-img item-look">'+imgArte('item-base',{alt:'Bobby sem item'})+'</div>'+(nenhum?'<span class="selo">'+IC.certo+' em uso</span>':'')+'<b>Sem item</b><span class="tipo">o Bobby de sempre</span>'+
      '<button class="btn-sec" data-semlook="1"'+(nenhum?' disabled':'')+'>'+(nenhum?'Em uso':'Usar')+'</button></div>';
    LOOKS_ORDEM.forEach(par=>{if(PECAS[par[0]][par[1]]&&PECAS[par[0]][par[1]].arte&&ativo(PECAS[par[0]][par[1]].arte))h+=cartaoLook(par[0],par[1]);});
  }
  h+='</div>';
  h+='<p class="dica-loja">'+(abaLoja==='comp'?'O companheiro aparece no mapa e na sua tela.':'Cada resposta certa vale 10 moedas. Um look por vez; mais itens chegam em breve, e o baú do dia também traz roupas.')+'</p>';
  const guard=guardadosDa(abaLoja);
  if(guard.length)h+='<p class="guardados"><b>Guardados para a arte nova:</b> '+guard.map(escapa).join(', ')+'. Eles continuam seus e voltam quando ficarem prontos.</p>';
  h+='</div>';
  $('#perfil').dataset.tela='loja';
  $('#perfil').innerHTML='<div class="rev-topo"><button class="icobtn" id="volta-perfil" aria-label="Voltar">'+IC.volta+
    '</button><h2>Meu personagem</h2></div><div class="rev-corpo">'+h+'</div>';
  $('#perfil').classList.add('on');document.body.style.overflow='hidden';
  const P=$('#perfil');
  $('#volta-perfil').addEventListener('click',()=>{if(lojaOrigem==='barra'){lojaOrigem='perfil';fecharPerfil2();}else telaPerfil();});
  P.querySelectorAll('[data-aba]').forEach(b=>b.addEventListener('click',()=>{abaLoja=b.dataset.aba;telaLoja();}));
  P.querySelectorAll('[data-modo]').forEach(b=>b.addEventListener('click',()=>{
    palcoModo=b.dataset.modo;palcoId=palcoModo==='rosto'?'bobby-e01':'bobby-p01';telaLoja();}));
  P.querySelectorAll('[data-pose]').forEach(b=>b.addEventListener('click',()=>{palcoId=b.dataset.pose;trocarPalco();}));
  const pb=$('#palco-bobby');
  if(pb)pb.addEventListener('click',()=>{
    if(lookEmUso(S.look)&&lookEmUso(S.look).peca.modo!=='sobrepor')return;
    /* tocar no Bobby troca a expressão (ou a pose): vai para a próxima da lista */
    const lista=(palcoModo==='rosto'?EXPRESSOES:POSES).map(x=>x[0]);
    palcoId=lista[(lista.indexOf(palcoId)+1)%lista.length];trocarPalco();
  });
  P.querySelectorAll('[data-comp]').forEach(b=>b.addEventListener('click',()=>escolherCompanheiro(S.look&&S.look.companheiro===b.dataset.comp?'':b.dataset.comp)));
  P.querySelectorAll('[data-buy]').forEach(b=>b.addEventListener('click',()=>{const q=b.dataset.buy.split('|');comprar(q[0],q[1]);}));
  P.querySelectorAll('[data-eq]').forEach(b=>b.addEventListener('click',()=>{const q=b.dataset.eq.split('|');equipar(q[0],q[1]);}));
  P.querySelectorAll('[data-semlook]').forEach(b=>b.addEventListener('click',()=>{vestir('',''); salvar();somPasso();pintarTopo();telaLoja();}));
  if(typeof pintarBarra==='function')pintarBarra();
}
/* troca só o palco (sem refazer a tela inteira) para a expressão mudar na hora, sem pulo na rolagem */
function trocarPalco(){
  const alvo=$('.palco');if(!alvo){telaLoja();return;}
  const rolagem=$('#perfil .rev-corpo').scrollTop;
  telaLoja();
  const rc=$('#perfil .rev-corpo');if(rc)rc.scrollTop=rolagem;
}
