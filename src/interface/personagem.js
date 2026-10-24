/* ---------- o personagem: Bobby, o ursinho (arte semirrealista em WebP) e a tela "Meu personagem" ----------
   O Bobby agora é imagem: 12 poses de corpo inteiro (P01 a P12) e 8 expressões de retrato (E01 a E08).
   Chapéu é sobreposição e só aparece em imagem de frente (a cabeça virada pediria uma imagem nova por pose).
   Companheiros: 6, cada um com 4 poses (a primeira é a que aparece nas telas). Itens novos entram em ITENS, sem mexer no resto. */
const BOBBY={
  oi:'bobby-p01',comemora:'bobby-p02',pensa:'bobby-e04',aponta:'bobby-p04',anda:'bobby-p05a',le:'bobby-p06',escuta:'bobby-p07',conta:'bobby-p08',
  incentiva:'bobby-p09',presente:'bobby-p10',tchau:'bobby-p11',descansa:'bobby-p12',
  feliz:'bobby-e01',radiante:'bobby-e02',curioso:'bobby-e03',surpreso:'bobby-e05',ops:'bobby-e06',concentrado:'bobby-e07',tranquilo:'bobby-e08'
};
const EXPRESSOES=[['bobby-e01','Alegre'],['bobby-e02','Radiante'],['bobby-e03','Curioso'],['bobby-e04','Pensativo'],
  ['bobby-e05','Surpreso'],['bobby-e06','Incentivando'],['bobby-e07','Concentrado'],['bobby-e08','Tranquilo']];
const POSES=[['bobby-p01','Oi'],['bobby-p02','Comemora'],['bobby-p03','Pensa'],['bobby-p04','Aponta'],['bobby-p05a','Caminha'],['bobby-p06','Lê'],
  ['bobby-p07','Escuta'],['bobby-p08','Conta'],['bobby-p09','Incentiva'],['bobby-p10','Presente'],['bobby-p11','Tchau'],['bobby-p12','Descansa']];
/* imagens de frente onde o chapéu entra: [centro x, largura de orelha a orelha], em fração da largura da imagem */
const FRONTAIS={
  'bobby-p01':[.45,.645],'bobby-p02':[.49,.58],'bobby-p08':[.60,.71],'bobby-p09':[.50,.69],'bobby-p10':[.50,.88],
  'bobby-e01':[.5,.94],'bobby-e02':[.5,.92],'bobby-e03':[.5,.94],'bobby-e04':[.5,.92],'bobby-e05':[.5,.92],'bobby-e06':[.5,.92],'bobby-e07':[.5,.87],'bobby-e08':[.5,.92]
};
/* catálogo do guarda-roupa. 'arte' = existe imagem nova (o item aparece de verdade). Sem 'arte' = item da versão antiga:
   quem já tinha comprado continua com o direito e vê o item guardado ("volta com a arte nova"); ninguém compra o que não tem arte. */
const PECAS={
  chapeu:{
    explorador:{n:'Chapéu de explorador',p:100,arte:'bobby-item-chapeu'},
    bone:{n:'Boné azul',p:120},festa:{n:'Chapéu de festa',p:180},chef:{n:'Chapéu de chef',p:240},
    espacial:{n:'Capacete espacial',p:400},pirata:{n:'Chapéu de pirata',p:320},coroa:{n:'Coroa do rei',p:600}
  },
  rosto:{oculos:{n:'Óculos redondos',p:150},sol:{n:'Óculos de sol',p:220},heroi:{n:'Máscara de herói',p:280},tapaolho:{n:'Tapa-olho',p:200}},
  pescoco:{cachecol:{n:'Cachecol',p:180},gravata:{n:'Gravata-borboleta',p:140},medalha:{n:'Medalha de ouro',p:350},capa:{n:'Capa de herói',p:450}},
  pelo:{mel:{n:'Pelo mel',p:100},cinza:{n:'Pelo cinza',p:150},panda:{n:'Pelo panda',p:260},polar:{n:'Pelo polar',p:300},rosa:{n:'Pelo rosa',p:220},choco:{n:'Chocolate',p:180}},
  pers:{nina:{n:'Nina, a coelhinha',p:180},pim:{n:'Pim, o gatinho',p:220},zeca:{n:'Zeca, o macaquinho',p:260},lulu:{n:'Lulu, a corujinha',p:320}}
};
const ABAS_LOJA=[['comp','Companheiro'],['chapeu','Chapéus'],['rosto','Rosto'],['pescoco','Pescoço']];

/* O Bobby numa tela. exp: nome de BOBBY (oi, feliz, ops...). Devolve <img>, com o chapéu por cima se estiver equipado e a imagem for de frente.
   alt vazio = decorativo (o texto ao lado já diz tudo). */
function MASC(exp,cls,look,alt){
  const id=BOBBY[exp]||(ativo(exp)?exp:BOBBY.oi);
  const L=look||(typeof S!=='undefined'&&S.look)||{};
  const img=imgArte(id,{cls:'mascote'+(cls?' '+cls:''),alt:alt||''});
  const peca=L.chapeu&&PECAS.chapeu[L.chapeu],anc=FRONTAIS[id],a=ativo(id);
  if(!peca||!peca.arte||!anc||!a||!ativo(peca.arte)||/avatar/.test(cls||''))return img;   /* avatar redondo: sem chapéu */
  const larg=anc[1]*.66,topo=.34*anc[1]*a[1]/a[2];
  return '<span class="bobby-com-item">'+img+imgArte(peca.arte,{cls:'item-chapeu',style:'left:'+(anc[0]*100).toFixed(1)+'%;top:'+(topo*100).toFixed(1)+'%;width:'+(larg*100).toFixed(1)+'%'})+'</span>';
}
/* retrato redondo do jogador (barra, topo, perfis): sempre a expressão alegre, sem chapéu (cabe num círculo) */
const retratoBobby=cls=>imgArte('bobby-e01',{cls:'retrato'+(cls?' '+cls:''),eager:true});

/* ---------- Meu personagem ---------- */
let abaLoja='comp',lojaOrigem='perfil',palcoModo='rosto',palcoId='bobby-e01';
const temItem=id=>(S.comprado||[]).indexOf(id)>=0;
function comprar(slot,id){
  const it=PECAS[slot][id];
  if(!it||!it.arte)return;
  if(S.moedas<it.p){lojaAviso('Faltam '+(it.p-S.moedas)+' moedas para “'+it.n+'”. Cada resposta certa vale 10 moedas.');return;}
  S.moedas-=it.p;S.comprado=(S.comprado||[]).concat([id]);
  S.look=Object.assign({},S.look);S.look[slot]=id;
  salvar();somMoeda();somFim();telaLoja();
}
function equipar(slot,id){
  S.look=Object.assign({},S.look);
  S.look[slot]=(S.look[slot]===id?'':id);
  salvar();somPasso();telaLoja();
}
function escolherCompanheiro(id){
  S.look=Object.assign({},S.look);S.look.companheiro=id;
  salvar();somPasso();telaLoja();
}
function lojaAviso(t){const a=$('#loja-aviso');if(a)a.innerHTML=t?'<div class="aviso">'+t+'</div>':'';}
/* itens que o jogador já comprou na versão antiga e ainda não têm arte nova: ficam guardados */
function guardadosDa(slot){
  const r=[];
  Object.keys(PECAS[slot]||{}).forEach(id=>{const it=PECAS[slot][id];if(!it.arte&&temItem(id))r.push(it.n);});
  if(slot==='comp')['pers','pelo'].forEach(sl=>Object.keys(PECAS[sl]).forEach(id=>{if(temItem(id))r.push(PECAS[sl][id].n);}));
  return r;
}
function palcoHTML(){
  const L=S.look||{};
  const ex=EXPRESSOES.concat(POSES);
  const nomeAtual=(ex.filter(x=>x[0]===palcoId)[0]||['','Alegre'])[1];
  const comp=COMPANHEIROS.filter(c=>c.id===L.companheiro)[0]||null;
  const chapeuEq=L.chapeu&&PECAS.chapeu[L.chapeu]&&PECAS.chapeu[L.chapeu].arte;
  const semChapeu=chapeuEq&&!FRONTAIS[palcoId];
  const grande=MASC(palcoId,'bobby-grande',L,'Bobby, o ursinho explorador, '+nomeAtual.toLowerCase()+(chapeuEq&&FRONTAIS[palcoId]?', de chapéu':''));
  let h='<section class="palco" aria-label="Seu personagem">'+
    '<button class="palco-bobby '+(palcoModo==='corpo'?'corpo':'rosto')+'" id="palco-bobby" aria-label="Bobby, '+nomeAtual.toLowerCase()+'. Toque para mudar a expressão">'+grande+'</button>';
  if(comp)h+='<div class="palco-comp">'+imgArte(comp.id+'-p01',{alt:comp.n+', '+comp.quem})+'</div>';
  h+='<p class="palco-nome" aria-live="polite"><b>Bobby</b> · '+nomeAtual+(semChapeu?'<small>O chapéu aparece nas imagens de frente.</small>':'')+'</p></section>';
  h+='<div class="palco-modos" role="group" aria-label="O que mostrar"><button class="aba'+(palcoModo==='rosto'?' on':'')+'" data-modo="rosto">Rosto</button>'+
     '<button class="aba'+(palcoModo==='corpo'?' on':'')+'" data-modo="corpo">Corpo inteiro</button></div>';
  const lista=palcoModo==='rosto'?EXPRESSOES:POSES;
  h+='<div class="palco-escolha" role="group" aria-label="'+(palcoModo==='rosto'?'Expressões':'Poses')+'">'+lista.map(x=>
    '<button class="mini-pose'+(x[0]===palcoId?' on':'')+'" data-pose="'+x[0]+'" aria-label="'+x[1]+'" aria-pressed="'+(x[0]===palcoId)+'">'+imgArte(x[0],{})+'<span>'+x[1]+'</span></button>').join('')+'</div>';
  return h;
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
    Object.keys(PECAS[abaLoja]).forEach(id=>{
      const it=PECAS[abaLoja][id];
      if(!it.arte)return;
      const tem=temItem(id),eq=L[abaLoja]===id;
      const bt=tem?'<button class="btn-sec" data-eq="'+abaLoja+'|'+id+'">'+(eq?'Tirar':'Usar')+'</button>'
                  :'<button class="'+(S.moedas<it.p?'btn-sec':'btn-acao')+'" data-buy="'+abaLoja+'|'+id+'">'+IC.moeda+' '+it.p+'</button>';
      h+='<div class="item'+(eq?' equipado':'')+'">'+(eq?'<span class="selo">'+IC.certo+' em uso</span>':'')+
        '<div class="item-img item-peca">'+imgArte(it.arte,{})+'</div><b>'+it.n+'</b>'+bt+'</div>';
    });
    if(!Object.keys(PECAS[abaLoja]).some(id=>PECAS[abaLoja][id].arte))
      h+='<div class="item vazio"><b>Chega em breve</b><span class="tipo">Esta parte do guarda-roupa ainda está sendo desenhada.</span></div>';
  }
  h+='</div>';
  h+='<p class="dica-loja">'+(abaLoja==='comp'?'O companheiro aparece no mapa e na sua tela.':'Cada resposta certa vale 10 moedas. Mais peças chegam em breve, e o baú do dia também traz roupas.')+'</p>';
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
    /* tocar no Bobby troca a expressão (ou a pose): vai para a próxima da lista */
    const lista=(palcoModo==='rosto'?EXPRESSOES:POSES).map(x=>x[0]);
    palcoId=lista[(lista.indexOf(palcoId)+1)%lista.length];trocarPalco();
  });
  P.querySelectorAll('[data-comp]').forEach(b=>b.addEventListener('click',()=>escolherCompanheiro(S.look&&S.look.companheiro===b.dataset.comp?'':b.dataset.comp)));
  P.querySelectorAll('[data-buy]').forEach(b=>b.addEventListener('click',()=>{const q=b.dataset.buy.split('|');comprar(q[0],q[1]);}));
  P.querySelectorAll('[data-eq]').forEach(b=>b.addEventListener('click',()=>{const q=b.dataset.eq.split('|');equipar(q[0],q[1]);}));
  if(typeof pintarBarra==='function')pintarBarra();
}
/* troca só o palco (sem refazer a tela inteira) para a expressão mudar na hora, sem pulo na rolagem */
function trocarPalco(){
  const alvo=$('.palco');if(!alvo){telaLoja();return;}
  const rolagem=$('#perfil .rev-corpo').scrollTop;
  telaLoja();
  const rc=$('#perfil .rev-corpo');if(rc)rc.scrollTop=rolagem;
}
