/* ---------- 1F · Meu personagem: editor em camadas + 1E loja da semana, cofrinho e ralos (tela) ----------
   Abas: Companheiro | Vestir (cabeça, rosto, pescoço, costas, mão, tudo ao mesmo tempo) | Loja da semana | Cofrinho e mais.
   Palco: o Bobby com tudo o que está vestido, na pose escolhida (Oi, Comemora, Caminha, Pensa e as expressões).
   1 toque num item que a criança não tem = experimenta (marca "experimentando", nada é cobrado); comprar é um 2º toque, no botão de preço. */
let abaLoja='vestir',slotLoja='cabeca',lojaOrigem='perfil',palcoId='bobby-p01',provando=null;
const POSES_PALCO=[['bobby-p01','Oi'],['bobby-p02','Comemora'],['bobby-p05a','Caminha'],['bobby-p03','Pensa'],['bobby-e01','Rosto']];
const ABAS_LOJA=[['comp','Companheiro'],['vestir','Vestir'],['semana','Loja da semana'],['mais','Cofrinho e mais']];
const NOMES_SEMANA={'moldura-sol':'Moldura de sol','moldura-mar':'Moldura do mar','moldura-folha':'Moldura de folhas','moldura-noite':'Moldura da noite',
  'moldura-ouro':'Moldura dourada','moldura-arco':'Moldura arco-íris','trilha-ouro':'Brilho dourado','trilha-mar':'Brilho do mar','trilha-rosa':'Brilho rosa',
  'trilha-verde':'Brilho verde','trilha-lilas':'Brilho lilás','trilha-arco':'Brilho arco-íris','adesivo-estrela':'Adesivo estrela','adesivo-foguete':'Adesivo foguete',
  'adesivo-planeta':'Adesivo planeta','adesivo-cometa':'Adesivo cometa','adesivo-lua':'Adesivo lua','adesivo-folha':'Adesivo folha','adesivo-coracao':'Adesivo coração',
  'adesivo-nuvem':'Adesivo nuvem','adesivo-raio':'Adesivo raio','adesivo-flor':'Adesivo flor','adesivo-concha':'Adesivo concha','adesivo-livro':'Adesivo livro'};
/* adesivos em SVG no código (sem arte nova); molduras e brilhos são CSS com tokens */
const SVG_ADESIVO={
  estrela:'<path class="ad-a" d="m32 4 8 18 20 2-15 13 5 20-18-11-18 11 5-20L4 24l20-2Z"/>',
  foguete:'<path class="ad-a" d="M32 4c10 8 14 20 12 34H20C18 24 22 12 32 4Z"/><circle class="ad-b" cx="32" cy="22" r="6"/><path class="ad-c" d="M24 40h16l-8 18Z"/>',
  planeta:'<circle class="ad-a" cx="32" cy="32" r="16"/><ellipse class="ad-b" cx="32" cy="34" rx="28" ry="7" fill="none" stroke-width="4"/>',
  cometa:'<circle class="ad-a" cx="44" cy="20" r="10"/><path class="ad-b" d="M38 26 6 58l26-38Z"/>',
  lua:'<path class="ad-a" d="M40 6a26 26 0 1 0 18 40A22 22 0 0 1 40 6Z"/>',
  folha:'<path class="ad-a" d="M8 56C8 24 28 8 58 6c0 30-18 50-50 50Z"/><path class="ad-b" d="M10 54 46 18" stroke-width="3"/>',
  coracao:'<path class="ad-a" d="M32 56 8 32a13 13 0 0 1 24-16 13 13 0 0 1 24 16Z"/>',
  nuvem:'<path class="ad-a" d="M16 46a10 10 0 0 1 2-20 14 14 0 0 1 27-4 11 11 0 0 1 5 24Z"/>',
  raio:'<path class="ad-a" d="M36 4 12 36h16l-6 24 26-34H32Z"/>',
  flor:'<circle class="ad-a" cx="32" cy="16" r="10"/><circle class="ad-a" cx="48" cy="32" r="10"/><circle class="ad-a" cx="32" cy="48" r="10"/><circle class="ad-a" cx="16" cy="32" r="10"/><circle class="ad-b" cx="32" cy="32" r="8"/>',
  concha:'<path class="ad-a" d="M32 8 6 44c8 10 44 10 52 0Z"/><path class="ad-b" d="M32 8v42M32 8 18 48M32 8l14 40" stroke-width="2"/>',
  livro:'<path class="ad-a" d="M6 12c10-4 20-4 26 4v40c-6-6-16-6-26-2Z"/><path class="ad-b" d="M58 12c-10-4-20-4-26 4v40c6-6 16-6 26-2Z"/>'
};
function figuraDaSemana(id){
  if(/^adesivo-/.test(id))return '<svg class="adesivo ad-'+id.slice(8)+'" viewBox="0 0 64 64" aria-hidden="true">'+(SVG_ADESIVO[id.slice(8)]||'')+'</svg>';
  if(/^moldura-/.test(id))return '<span class="moldura-amostra '+id+'">'+imgArte('bobby-e01',{alt:''})+'</span>';
  return '<span class="trilha-amostra '+id+'" aria-hidden="true"></span>';
}
function nomeDoItem(id){
  if(VESTIVEIS[id])return VESTIVEIS[id].n;
  if(NOMES_SEMANA[id])return NOMES_SEMANA[id];
  const c=COMPANHEIROS.filter(x=>x.id===id)[0];if(c)return c.n;
  if(/^pista-/.test(id))return 'Página do diário';
  return id;
}
/* o Bobby do palco: o que está vestido, mais o item em prova */
function lookDoPalco(){const L=Object.assign({},S.look||{});if(provando&&VESTIVEIS[provando])L[VESTIVEIS[provando].slot]=provando;return L;}
function palcoHTML(){
  const L=lookDoPalco(),comp=COMPANHEIROS.filter(c=>c.id===(S.look||{}).companheiro)[0]||null;
  const nomePose=(POSES_PALCO.filter(p=>p[0]===palcoId)[0]||['','Oi'])[1];
  const grande=MASCB(palcoId,'bobby-grande',L,'Bobby, o ursinho explorador');
  let h='<section class="palco" aria-label="Seu personagem"><div class="palco-bobby corpo'+(/bobby-e/.test(palcoId)?' rosto':'')+'" id="palco-bobby">'+grande+
    (provando?'<span class="marca-prova" aria-live="polite">experimentando</span>':'')+'</div>';
  if(comp)h+='<div class="palco-comp">'+imgArte(comp.id+'-p01',{alt:comp.n+', '+comp.quem})+'</div>';
  h+='<p class="palco-nome" aria-live="polite"><b>Bobby</b> · '+escapa(nomePose)+'</p></section>';
  h+='<div class="palco-escolha poses" role="group" aria-label="Poses">'+POSES_PALCO.map(p=>
    '<button class="mini-pose'+(p[0]===palcoId?' on':'')+'" data-pose="'+p[0]+'" aria-pressed="'+(p[0]===palcoId)+'"><span>'+p[1]+'</span></button>').join('')+'</div>';
  return h;
}
function botaoPreco(id,extra){
  const pc=precoDe(id),r=podeComprar(id);
  if(r.motivo==='portao')return '<span class="portao">'+escapa(/^pista-/.test(id)?'Abre quando a etapa terminar':portaoTexto(id))+'</span>';
  return '<button class="'+(r.ok?'btn-acao':'btn-sec')+'" data-compra="'+id+'"'+(extra||'')+' aria-label="Comprar '+escapa(nomeDoItem(id))+' por '+pc+' moedas">'+IC.moeda+' '+pc+'</button>';
}
function cartaoVestivel(id){
  const v=VESTIVEIS[id],L=S.look||{},tem=temItem(id),eq=L[v.slot]===id,prova=provando===id;
  let bt;
  if(tem)bt='<button class="btn-sec" data-veste="'+id+'">'+(eq?'Tirar':'Vestir')+'</button>';
  else bt='<button class="btn-sec" data-prova="'+id+'" aria-pressed="'+prova+'">'+(prova?'Parar de provar':'Experimentar')+'</button>'+botaoPreco(id);
  return '<div class="item'+(eq?' equipado':'')+(prova?' provando':'')+'"><div class="item-img item-camada">'+itemSozinhoHTML(id)+'</div>'+
    (eq?'<span class="selo">'+IC.certo+' vestido</span>':'')+'<b>'+escapa(v.n)+'</b><div class="item-bts">'+bt+'</div></div>';
}
function abaVestirHTML(){
  let h='<div class="abas slots" role="tablist" aria-label="Parte do corpo">'+SLOTS.map(sl=>
    '<button class="aba'+(slotLoja===sl?' on':'')+'" role="tab" aria-selected="'+(slotLoja===sl)+'" data-slot="'+sl+'">'+NOME_SLOT[sl]+
    ((S.look||{})[sl]?' <i class="ponto-vestido" aria-label="com item"></i>':'')+'</button>').join('')+'</div>';
  h+='<div class="vitrine">'+itensDoSlot(slotLoja).filter(temArteDoItem).map(cartaoVestivel).join('')+'</div>';
  h+='<div class="perfil-bts"><button class="btn" id="ver-no-mapa">Vestir e ver no mapa</button></div>';
  h+='<p class="dica-loja">Dá para usar um item em cada parte do corpo ao mesmo tempo. Experimentar é de graça.</p>';
  return h;
}
function abaSemanaHTML(){
  if(S.config&&S.config.lojaSemanaLigada===false)return '<p class="dica-loja">A loja da semana está desligada pelo responsável.</p>';
  const v=vitrineDaSemana(),d=desejos();
  let h='<p class="dica-loja">Toda semana chegam itens diferentes, e eles voltam outras vezes. Guarde até 3 na lista de desejos: eles ficam esperando você.</p><div class="vitrine">';
  v.forEach(id=>{const des=d.indexOf(id)>=0;
    h+='<div class="item"><div class="item-img">'+figuraDaSemana(id)+'</div><b>'+escapa(nomeDoItem(id))+'</b><div class="item-bts">'+botaoPreco(id)+
      '<button class="btn-sec" data-desejo="'+id+'" aria-pressed="'+des+'">'+(des?'Na lista de desejos':'Guardar na lista')+'</button></div></div>';});
  h+='</div>';
  const meus=ITENS_SEMANA.filter(temCompra);
  if(meus.length){
    h+='<h3 class="sec">Seus itens</h3><div class="vitrine">'+meus.map(id=>{const usa=usoVisual(id);
      return '<div class="item'+(usa?' equipado':'')+'"><div class="item-img">'+figuraDaSemana(id)+'</div><b>'+escapa(nomeDoItem(id))+'</b>'+
      (/^adesivo-/.test(id)?'<span class="tipo">no álbum</span>':'<button class="btn-sec" data-usa="'+id+'">'+(usa?'Tirar':'Usar')+'</button>')+'</div>';}).join('')+'</div>';
  }
  return h;
}
const usoVisual=id=>!!S.visual&&(S.visual.moldura===id||S.visual.trilha===id);
function abaMaisHTML(){
  const c=cofrinho();let h='<h3 class="sec">Cofrinho</h3>';
  if(c.meta){
    const pc=Math.round(c.guardado/c.preco*100);
    h+='<div class="cofrinho"><b>Juntando para: '+escapa(nomeDoItem(c.meta))+'</b><div class="mbar"><i style="width:'+pc+'%"></i></div>'+
      '<span>'+c.guardado+' de '+c.preco+' moedas guardadas. Metade do que você ganha vem para cá.</span>'+
      '<button class="btn-sec" id="cofre-desfaz">Tirar as moedas do cofrinho</button></div>';
  }else h+='<p class="dica-loja">Escolha uma meta grande e metade do que você ganhar fica guardada para ela. Dá para desfazer com um toque.</p>';
  const metas=Object.keys(PRECOS.companheiro).concat(Object.keys(PRECOS.look)).filter(id=>!temCompra(id)&&!temItem(id)&&precoDe(id)>=400&&id!==c.meta);
  if(metas.length)h+='<div class="metas">'+metas.slice(0,6).map(id=>'<button class="chip-ctl" data-meta="'+id+'">'+escapa(nomeDoItem(id))+' · '+precoDe(id)+'</button>').join('')+'</div>';
  /* petisco */
  const comp=COMPANHEIROS.filter(x=>x.id===(S.look||{}).companheiro)[0];
  if(comp&&!(S.config&&S.config.petiscoLigado===false)){
    const a=(S.amizade||{})[comp.id]||{xp:0};
    h+='<h3 class="sec">Petisco</h3><p class="dica-loja">'+escapa(comp.n)+' adora um petisco. Amizade: '+a.xp+(a.xp===1?' dia':' dias')+' de petisco.</p>'+
      '<div class="perfil-bts"><button class="btn-sec" id="dar-petisco">'+IC.moeda+' '+ECON.petisco+' · Dar um petisco</button></div>';
  }
  /* pistas da história */
  const ps=pistasAbertas(),lidas=(S.comprado||[]).filter(x=>/^pista-/.test(x));
  h+='<h3 class="sec">Diário do Bobby</h3>';
  if(!ps.length&&!lidas.length)h+='<p class="dica-loja">Cada etapa concluída abre uma página do diário do Bobby, com uma pista da história.</p>';
  ps.forEach(id=>{h+='<div class="item pista"><b>Página nova</b>'+botaoPreco(id)+'</div>';});
  lidas.forEach(id=>{h+='<div class="pista-lida"><p>'+escapa(textoDaPista(id))+'</p></div>';});
  /* álbum de adesivos */
  const ads=ITENS_SEMANA.filter(id=>/^adesivo-/.test(id));
  h+='<h3 class="sec">Álbum de adesivos</h3><div class="album">'+ads.map(id=>temCompra(id)?
    '<div class="album-vaga tem">'+figuraDaSemana(id)+'<span>'+escapa(nomeDoItem(id).replace('Adesivo ',''))+'</span></div>':
    '<div class="album-vaga"><span class="silhueta">'+figuraDaSemana(id)+'</span><span>Na loja da semana</span></div>').join('')+'</div>';
  /* céu estrelado */
  if(ceuDisponivel()||(S.ceu||[]).length){
    h+='<h3 class="sec">Céu estrelado</h3><p class="dica-loja">'+(S.ceu||[]).length+' estrelas com nome no seu céu.</p>';
    if(ceuDisponivel())h+='<div class="perfil-bts"><input class="campo" id="nome-estrela" maxlength="18" placeholder="Nome da estrela" aria-label="Nome da estrela"><button class="btn-sec" id="compra-estrela">'+IC.moeda+' '+ECON.estrela+' · Acender</button></div>';
  }
  return h;
}
function abaCompHTML(){
  const L=S.look||{};let h='<div class="vitrine">';
  COMPANHEIROS.forEach(c=>{
    const eq=(L.companheiro||'')===c.id,tem=companheiroComprado(c.id);
    h+='<div class="item'+(eq?' equipado':'')+(tem?'':' bloqueado')+'">'+(eq?'<span class="selo">'+IC.certo+' com você</span>':'')+
      '<div class="item-img">'+imgArte(c.id+'-p01',{})+'</div><b>'+c.n+'</b><span class="tipo">'+c.quem+'</span>'+
      (tem?'<button class="btn-sec" data-comp="'+c.id+'"'+(eq?' aria-pressed="true"':'')+'>'+(eq?'Tirar':'Chamar')+'</button>':botaoPreco(c.id,' data-buycomp="'+c.id+'"'))+'</div>';
  });
  return h+'</div><p class="dica-loja">O companheiro aparece no mapa e na sua tela.</p>';
}
function telaLoja(){
  let h='<div class="perfil-in guarda">'+palcoHTML();
  const c=cofrinho();
  h+='<div class="saldo-linha"><span class="saldo">'+IC.moeda+'<b>'+S.moedas+'</b> moedas</span>'+(c.guardado?'<span class="saldo-cofre">'+c.guardado+' no cofrinho</span>':'')+'</div>';
  h+='<div class="abas" role="tablist" aria-label="Meu personagem">'+ABAS_LOJA.map(a=>
    '<button class="aba'+(abaLoja===a[0]?' on':'')+'" role="tab" aria-selected="'+(abaLoja===a[0])+'" data-aba="'+a[0]+'">'+a[1]+'</button>').join('')+'</div>';
  h+='<div id="loja-aviso"></div>';
  h+=abaLoja==='comp'?abaCompHTML():(abaLoja==='semana'?abaSemanaHTML():(abaLoja==='mais'?abaMaisHTML():abaVestirHTML()));
  const guard=guardadosDa();
  if(guard.length)h+='<p class="guardados"><b>Guardados para a arte nova:</b> '+guard.map(escapa).join(', ')+'. Eles continuam seus e voltam quando ficarem prontos.</p>';
  h+='</div>';
  $('#perfil').dataset.tela='loja';
  $('#perfil').innerHTML='<div class="rev-topo"><button class="icobtn" id="volta-perfil" aria-label="Voltar">'+IC.volta+
    '</button><h2>Meu personagem</h2></div><div class="rev-corpo">'+h+'</div>';
  $('#perfil').classList.add('on');document.body.style.overflow='hidden';
  ligarLoja();
  if(typeof pintarBarra==='function')pintarBarra();
}
function refazLoja(){const rc=$('#perfil .rev-corpo'),y=rc?rc.scrollTop:0;telaLoja();const r2=$('#perfil .rev-corpo');if(r2)r2.scrollTop=y;}
function ligarLoja(){
  const P=$('#perfil'),on=(sel,fn)=>P.querySelectorAll(sel).forEach(b=>b.addEventListener('click',()=>fn(b)));
  $('#volta-perfil').addEventListener('click',()=>{provando=null;if(lojaOrigem==='barra'){lojaOrigem='perfil';fecharPerfil2();}else telaPerfil();});
  on('[data-aba]',b=>{abaLoja=b.dataset.aba;provando=null;refazLoja();});
  on('[data-slot]',b=>{slotLoja=b.dataset.slot;refazLoja();});
  on('[data-pose]',b=>{palcoId=b.dataset.pose;refazLoja();});
  on('[data-veste]',b=>{const id=b.dataset.veste,v=VESTIVEIS[id];vestir(v.slot,(S.look||{})[v.slot]===id?'':id);provando=null;salvar();somPasso();pintarTopo();refazLoja();});
  on('[data-prova]',b=>{provando=provando===b.dataset.prova?null:b.dataset.prova;somPasso();refazLoja();});
  on('[data-compra]',b=>pedirCompra(b.dataset.compra));
  on('[data-comp]',b=>escolherCompanheiro(S.look&&S.look.companheiro===b.dataset.comp?'':b.dataset.comp));
  on('[data-desejo]',b=>{if(!alternarDesejo(b.dataset.desejo))lojaAviso('A lista de desejos já tem 3 itens. Tire um para guardar outro.');else{salvar();refazLoja();}});
  on('[data-usa]',b=>{const id=b.dataset.usa,k=/^moldura-/.test(id)?'moldura':'trilha';S.visual=Object.assign({moldura:'',trilha:''},S.visual);S.visual[k]=S.visual[k]===id?'':id;salvar();aplicarVisual();pintarTopo();refazLoja();});
  on('[data-meta]',b=>{escolherMeta(b.dataset.meta);salvar();refazLoja();});
  const cd=$('#cofre-desfaz');if(cd)cd.addEventListener('click',()=>{desfazerCofrinho();salvar();refazLoja();});
  const dp=$('#dar-petisco');if(dp)dp.addEventListener('click',()=>{const r=darPetisco();if(r.ok){salvar();somMoeda();pintarTopo();refazLoja();lojaAviso(r.contou?'Que delícia! A amizade cresceu.':'Que delícia! Amanhã a amizade cresce de novo.');}else if(r.motivo==='moedas')lojaAviso('Faltam moedas para o petisco.');});
  const ce=$('#compra-estrela');if(ce)ce.addEventListener('click',()=>{const r=comprarEstrela(($('#nome-estrela')||{}).value);if(r.ok){salvar();somFim();pintarTopo();refazLoja();lojaAviso('A estrela “'+escapa(r.nome)+'” acendeu no seu céu.');}});
  const vm=$('#ver-no-mapa');if(vm)vm.addEventListener('click',()=>{provando=null;salvar();fecharPerfil2();if(typeof renderTrilha==='function')renderTrilha();});
}
/* comprar sempre pede confirmação (2º toque), sem pressa e sem culpa */
function pedirCompra(id){
  const r=podeComprar(id),a=$('#loja-aviso');if(!a)return;
  if(!r.ok){if(r.motivo==='moedas')lojaAviso('Faltam '+r.falta+' moedas para “'+escapa(nomeDoItem(id))+'”. Cada resposta certa vale '+ECON.ganhoAcerto+' moedas, sem pressa.');return;}
  a.innerHTML='<div class="aviso confirma" role="alertdialog" aria-label="Levar '+escapa(nomeDoItem(id))+'"><span>Quer levar “'+escapa(nomeDoItem(id))+'” por '+precoDe(id)+' moedas?</span>'+
    '<div class="confirma-bts"><button class="btn-acao" id="compra-sim">Sim, levar</button><button class="btn-sec" id="compra-nao">Agora não</button></div></div>';
  $('#compra-sim').addEventListener('click',()=>{
    const ok=comprarItem(id);if(!ok.ok)return;
    if(VESTIVEIS[id])vestir(VESTIVEIS[id].slot,id);
    if(PRECOS.companheiro[id]){S.look=Object.assign({},S.look);S.look.companheiro=id;}
    provando=null;salvar();somMoeda();somFim();pintarTopo();refazLoja();
  });
  $('#compra-nao').addEventListener('click',()=>{a.innerHTML='';});
  a.scrollIntoView&&a.scrollIntoView({block:'nearest'});
}
/* moldura no retrato do topo e brilho atrás do personagem no mapa */
function aplicarVisual(){
  const v=S.visual||{};
  if(typeof document==='undefined'||!document.body||!document.body.dataset)return;
  document.body.dataset.moldura=v.moldura||'';document.body.dataset.trilha=v.trilha||'';
}
