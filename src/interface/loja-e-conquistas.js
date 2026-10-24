/* ---------- guarda-roupa do Bobby ---------- */
const PRECO_CORACAO=50;
let abaLoja='chapeu';
const temItem=id=>(S.comprado||[]).indexOf(id)>=0;
function comprar(slot,id){
  const it=PECAS[slot][id];
  if(S.xp<it.p){lojaAviso('Faltam '+(it.p-S.xp)+' moedas para “'+it.n+'”. Cada acerto vale 10 moedas!');return;}
  S.xp-=it.p;S.comprado=(S.comprado||[]).concat([id]);
  S.look=Object.assign({},S.look);S.look[slot]=id;
  salvar();somMoeda();somFim();telaLoja();
}
function comprarPers(id){
  const it=PERS[id];
  if(S.xp<it.p){lojaAviso('Faltam '+(it.p-S.xp)+' moedas para trazer '+it.n+' para a turma.');return;}
  S.xp-=it.p;S.comprado=(S.comprado||[]).concat([id]);
  S.look=Object.assign({},S.look);S.look.pers=id;S.look.pelo='';
  salvar();somMoeda();somFim();telaLoja();
}
function equipar(slot,id){
  S.look=Object.assign({},S.look);
  S.look[slot]=(S.look[slot]===id?'':id);
  salvar();somPasso();telaLoja();
}
function lojaAviso(t){const a=$('#loja-aviso');if(a)a.innerHTML=t?'<div class="aviso">'+t+'</div>':'';}
function telaLoja(){
  const L=S.look||{};
  const nomePers=(PERS[(L.pers||'bobby')]||{}).n||'Bobby';
  const usando=[];
  SLOTS.forEach(sl=>{
    if(sl[0]==='pers')return;
    const id=L[sl[0]];
    if(!id)return;
    const it=(PECAS[sl[0]]||{})[id];
    if(it)usando.push(it.n);
  });

  let h='<div class="perfil-in">';
  /* 1) prévia: o personagem do jeito que está agora, sempre à vista */
  h+='<div class="previa">'+
     '<div class="previa-bobby">'+MASC('feliz')+'</div>'+
     '<div class="previa-tx"><span class="rot">seu personagem agora</span>'+
     '<b>'+nomePers+'</b>'+
     '<span class="usando">'+(usando.length?'usando: '+usando.join(', '):'sem acessórios ainda')+'</span>'+
     '<div class="saldo">'+IC.moeda+'<b>'+S.xp+'</b> moedas</div></div></div>';

  /* 2) abas: o que você quer trocar */
  h+='<span class="rot-abas">O que você quer trocar?</span>';
  h+='<div class="abas">'+SLOTS.map(sl=>'<button class="aba'+(abaLoja===sl[0]?' on':'')+'" data-aba="'+sl[0]+'">'+sl[1]+'</button>').join('')+'</div>';
  h+='<div id="loja-aviso"></div><div class="vitrine">';

  const cartao=(look,nome,tipo,botao,eq)=>
    '<div class="item'+(eq?' equipado':'')+'">'+
    (eq?'<span class="selo">'+IC.certo+' em uso</span>':'')+
    '<div class="item-bobby">'+MASC('oi','',look)+'</div>'+
    '<b>'+nome+'</b>'+(tipo?'<span class="tipo">'+tipo+'</span>':'')+botao+'</div>';

  if(abaLoja==='pers'){
    Object.keys(PERS).forEach(id=>{
      const it=PERS[id],tem=it.p===0||temItem(id),eq=(L.pers||'bobby')===id;
      const look=Object.assign({},L);look.pers=id;look.pelo='';
      const bt=tem?'<button class="btn '+(eq?'fantasma':'')+'" data-eq="pers|'+id+'"'+(eq?' disabled':'')+'>'+(eq?'em uso':'usar')+'</button>'
                  :'<button class="btn'+(S.xp<it.p?' pobre':'')+'" data-buy="pers|'+id+'">'+IC.moeda+' '+it.p+'</button>';
      h+=cartao(look,it.n,it.tipo,bt,eq);
    });
    h+='</div><p class="dica-loja">Todo personagem usa as mesmas roupas e acessórios que você já comprou.</p></div>';
  }else{
    if(abaLoja==='pelo'){
      const look=Object.assign({},L,{pelo:''}),eq=!L.pelo;
      h+=cartao(look,'Marrom','a cor original',
        '<button class="btn '+(eq?'fantasma':'')+'" data-eq="pelo|"'+(eq?' disabled':'')+'>'+(eq?'em uso':'usar')+'</button>',eq);
    }
    Object.keys(PECAS[abaLoja]).forEach(id=>{
      const it=PECAS[abaLoja][id],tem=temItem(id),eq=L[abaLoja]===id;
      const look=Object.assign({},L);look[abaLoja]=id;
      const bt=tem?'<button class="btn '+(eq?'fantasma':'')+'" data-eq="'+abaLoja+'|'+id+'">'+(eq?'tirar':'usar')+'</button>'
                  :'<button class="btn'+(S.xp<it.p?' pobre':'')+'" data-buy="'+abaLoja+'|'+id+'">'+IC.moeda+' '+it.p+'</button>';
      h+=cartao(look,it.n,'',bt,eq);
    });
    h+='</div><p class="dica-loja">Cada resposta certa vale 10 moedas. Combo de 3 dá bônus, e cada dia seguido rende moedas extras.</p></div>';
  }

  $('#perfil').innerHTML='<div class="rev-topo"><button class="icobtn" id="volta-perfil" aria-label="Voltar">'+IC.volta+
    '</button><h2>Guarda-roupa</h2></div><div class="rev-corpo">'+h+'</div>';
  $('#perfil').classList.add('on');document.body.style.overflow='hidden';
  $('#volta-perfil').addEventListener('click',telaPerfil);
  $('#perfil').querySelectorAll('[data-aba]').forEach(b=>b.addEventListener('click',()=>{abaLoja=b.dataset.aba;telaLoja();}));
  $('#perfil').querySelectorAll('[data-buy]').forEach(b=>b.addEventListener('click',()=>{
    const q=b.dataset.buy.split('|');
    if(q[0]==='pers')comprarPers(q[1]);else comprar(q[0],q[1]);
  }));
  $('#perfil').querySelectorAll('[data-eq]').forEach(b=>b.addEventListener('click',()=>{
    const q=b.dataset.eq.split('|');
    if(q[0]==='pers'){S.look=Object.assign({},S.look);S.look.pers=q[1];S.look.pelo='';salvar();somPasso();telaLoja();}
    else equipar(q[0],q[1]);
  }));
}
/* ---------- conquistas ---------- */
const CONQUISTAS=[
 {id:'c1',n:'Primeira fase',d:'Concluir 1 fase',ok:()=>fases()>=1},
 {id:'c2',n:'Explorador',d:'Concluir 5 fases',ok:()=>fases()>=5},
 {id:'c3',n:'Meio caminho',d:'Concluir 25 fases',ok:()=>fases()>=25},
 {id:'c4',n:'Mapa inteiro',d:'Concluir as 50 fases',ok:()=>fases()>=50},
 {id:'c5',n:'Primeiro castelo',d:'Completar 1 mundo',ok:()=>mundosOk()>=1},
 {id:'c6',n:'Meia jornada',d:'Completar 5 mundos',ok:()=>mundosOk()>=5},
 {id:'c7',n:'Rei dos mundos',d:'Completar os 10 mundos',ok:()=>mundosOk()>=10},
 {id:'c8',n:'Três dias',d:'Ofensiva de 3 dias',ok:()=>(S.melhorOfensiva||0)>=3},
 {id:'c9',n:'Uma semana',d:'Ofensiva de 7 dias',ok:()=>(S.melhorOfensiva||0)>=7},
 {id:'c10',n:'Sem errar',d:'8 acertos seguidos',ok:()=>(S.combo||0)>=8},
 {id:'c11',n:'Cofre cheio',d:'Ganhar 500 moedas',ok:()=>(S.ganhoTotal||0)>=500},
 {id:'c12',n:'Perfeccionista',d:'3 estrelas em 10 fases',ok:()=>Object.keys(S.feitas).filter(k=>estrelasDaFase(k)===3).length>=10}
];
const daMateria=k=>MATERIA==='pt'?k.charAt(0)==='p':(MATERIA==='en'?k.charAt(0)==='e':/^[0-9]/.test(k));
const fases=()=>Object.keys(S.feitas).filter(k=>k.indexOf('rev')!==0&&daMateria(k)).length;
const mundosOk=()=>UNITS.filter(u=>mundoCompleto(u)).length;
/* aceita tanto o formato novo (número) quanto qualquer coisa estranha vinda de um backup antigo */
const estrelasDaFase=k=>{
  const v=S.feitas[k];
  if(typeof v==='number')return v;
  if(v&&typeof v==='object'&&typeof v.estrelas==='number')return v.estrelas;
  return v?1:0;
};
const estrelasTotal=()=>Object.keys(S.feitas).reduce((a,k)=>a+estrelasDaFase(k),0);

