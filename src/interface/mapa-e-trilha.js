/* ---------- mapa: planeta no topo, etapas que acendem e o Bobby andando ----------
   Cada etapa (um "mundo" do código: 5 fases e a revisão) é um lugar que começa apagado e acende de baixo para cima,
   uma parte por fase concluída. Os 6 nós ficam no chão calmo da cena, em serpentina (3 embaixo, 3 em cima; o chão calmo ocupa os 40% de baixo da cena).
   Se a arte da etapa ainda não existe, o planeta da matéria faz o papel de cenário (apagado e aceso do mesmo jeito). */
const NOS=[[16,78],[50,74],[84,78],[84,52],[50,48],[16,52]];   /* x e y em %; o 6º é a revisão */
const REV_TOPO=70,REV_VAO=78;                                    /* faixa da revelação: de 70% (nada aceso) a -8% (tudo aceso) */
const revPct=k=>(REV_TOPO-REV_VAO*Math.max(0,Math.min(5,k))/5).toFixed(1)+'%';
const NO_ANTES={},REV_ANTES={};                                  /* onde o Bobby e a luz estavam no desenho anterior (só nesta sessão) */

function trilhaPontos(){
  let h='';
  for(let i=0;i<NOS.length-1;i++){
    const a=NOS[i],b=NOS[i+1];
    for(let k=1;k<=4;k++){
      const t=k/5;
      const x=a[0]+(b[0]-a[0])*t,y=a[1]+(b[1]-a[1])*t;
      h+='<span class="passo-trilha" style="left:'+x.toFixed(1)+'%;top:'+y.toFixed(1)+'%"></span>';
    }
  }
  return h;
}
/* o nó mostra só o nome principal (em inglês, o que vem antes do parêntese); a tradução fica na aula e no rótulo de acessibilidade */
/* títulos que não cabem em 3 linhas na largura de um celular pequeno ganham um nome curto no nó (o título inteiro continua na aula e na leitura de tela) */
const NOME_NO_CURTO={'Dobro, metade, triplo e terça parte':'Dobro, metade e triplo','Juntar sílabas e formar palavras':'Juntar sílabas','Maiúscula no começo, ponto no fim':'Maiúscula e ponto'};
const nomeCurto=t=>NOME_NO_CURTO[t]||String(t).replace(/\s*\([^)]*\)\s*$/,'')||String(t);
/* 'Animals · Animais' vira duas linhas (nome e tradução), sem ponto solto no começo de uma linha */
function tituloEmDuasLinhas(t){
  const p=String(t).split(' · ');
  return escapa(p[0])+(p[1]?'<span class="t-2">'+escapa(p.slice(1).join(' · '))+'</span>':'');
}
function noAtualDaEtapa(u){
  for(let li=0;li<u.lessons.length;li++)if(!S.feitas[u.lessons[li].id])return li;
  return 5;   /* tudo feito: ele espera na revisão */
}
function cenaHTML(u,k,agora){
  const cena=cenaDaEtapa(MATERIA,u.n),pl=PLANETAS[MATERIA];
  if(cena){
    const ant=REV_ANTES[MATERIA+u.n]==null?k:REV_ANTES[MATERIA+u.n];
    return '<div class="cena" data-k="'+k+'" style="--rev:'+revPct(ant)+'">'+
      imgArte(cena.apagado,{cls:'cena-base',eager:!!agora})+imgArte(cena.completo,{cls:'cena-luz',eager:!!agora});
  }
  /* sem arte da etapa: o planeta no céu da matéria; apagado por filtro, aceso pela mesma revelação */
  return '<div class="cena sem-arte" data-k="'+k+'" style="--rev:'+revPct(REV_ANTES[MATERIA+u.n]==null?k:REV_ANTES[MATERIA+u.n])+'">'+
    '<div class="cena-ceu"></div>'+
    '<div class="cena-planeta cena-base">'+imgArte(pl.img,{})+'</div>'+
    '<div class="cena-planeta cena-luz">'+imgArte(pl.img,{})+'</div>'+
    '<span class="cena-breve">Lugar novo em breve</span>';
}
/* o personagem escolhido no mapa: parado (Oi, com o look) e andando (Caminha). Companheiro: P01 e P03. Bobby: o look de frente parado e a
   caminhada do Bobby de sempre (a caminhada é de três quartos; o item só aparece nas poses de frente). */
function vocePecas(){
  const pa=persAtivo();
  if(pa.tipo==='comp'){
    const c=pa.id;
    return imgArte(c+'-p01',{cls:'voce-pe',eager:true})+imgArte(ativo(c+'-p03')?c+'-p03':c+'-p01',{cls:'voce-a1',eager:true})+imgArte(ativo(c+'-p03')?c+'-p03':c+'-p01',{cls:'voce-a2',eager:true});
  }
  const uso=lookEmUso(S.look||{});
  let parado=imgArte('bobby-p01',{cls:'voce-pe',eager:true});
  if(uso&&uso.peca.modo!=='sobrepor')parado=imgArte(uso.peca.arte,{cls:'voce-pe',eager:true});
  else if(uso){const an=FRONTAIS['bobby-p01'],a1=ativo('bobby-p01');parado+=imgArte(uso.peca.arte,{cls:'item-chapeu voce-pe',eager:true,style:'left:'+(an[0]*100).toFixed(1)+'%;top:'+(.34*an[1]*a1[1]/a1[2]*100).toFixed(1)+'%;width:'+(an[1]*.66*100).toFixed(1)+'%'});}
  return parado+imgArte('bobby-p05a',{cls:'voce-a1',eager:true})+imgArte('bobby-p05b',{cls:'voce-a2',eager:true});
}
function etapaHTML(u,ui,prox){
  const feitasN=u.lessons.filter(l=>S.feitas[l.id]).length;
  const completo=mundoCompleto(u);
  const estRev=S.feitas['rev'+MATERIA+u.n]||0;
  const nErr=(S.errados[MATERIA+u.n]||[]).length;
  const ehAtual=!!prox&&prox[0]===ui;
  const chave=MATERIA+u.n;
  const atualNo=ehAtual?noAtualDaEtapa(u):-1;
  let h='<section class="etapa'+(completo?' completa':'')+(estRev?' acesa':'')+'" id="etapa-'+(ui+1)+'" aria-labelledby="etapa-t-'+(ui+1)+'">';
  h+='<header class="etapa-cab"><div class="etapa-tx"><span class="etapa-n">Etapa '+u.n+'</span>'+
     '<h3 id="etapa-t-'+(ui+1)+'">'+tituloEmDuasLinhas(u.title)+'</h3><p>'+escapa(u.sub)+'</p></div>'+
     '<span class="etapa-prog'+(completo?' ok':'')+'">'+(completo?IC.certo+' Completa':feitasN+' de '+u.lessons.length+' fases')+'</span></header>';
  h+=cenaHTML(u,feitasN,ehAtual);
  h+='<div class="trilha">'+trilhaPontos();
  u.lessons.forEach((l,li)=>{
    const ok=S.feitas[l.id],abr=liberada(ui,li),atual=ehAtual&&atualNo===li;
    const cls=['no'];if(NOS[li][0]<=16)cls.push('lado-e');else if(NOS[li][0]>=84)cls.push('lado-d');if(!abr)cls.push('trava');if(ok)cls.push('feito');if(atual)cls.push('atual');
    /* só o PRÓXIMO nó da etapa atual mostra o cadeado grande; os outros trancados viram pontos (menos cadeado cobrindo o cenário) */
    const proxTrava=ehAtual&&!abr&&li===atualNo+1;
    if(!abr)cls.push(proxTrava?'trava-prox':'trava-longe');
    const est=ok?estrelasDaFase(l.id):0;
    h+='<div class="'+cls.join(' ')+'" style="left:'+NOS[li][0]+'%;top:'+NOS[li][1]+'%;--nx:'+Math.min(NOS[li][0],100-NOS[li][0])+'">'+
       '<button class="bt" data-u="'+ui+'" data-l="'+li+'"'+(abr?'':' aria-disabled="true"')+
       ' aria-label="Fase '+(li+1)+': '+escapa(l.title)+(ok?'. Concluída com '+est+(est===1?' estrela':' estrelas'):(atual?'. Sua próxima fase':''))+'">'+
       (abr?'<b>'+(li+1)+'</b>':(proxTrava?IC.cadeado:''))+'</button>'+
       '<span class="estrelas" aria-hidden="true">'+(ok?estrelasSVG(est):'')+'</span>'+
       '<span class="rot">'+escapa(nomeCurto(l.title))+'</span></div>';
  });
  const cr=['no','revisao-no'];if(NOS[5][0]<=16)cr.push('lado-e');if(!completo)cr.push('trava','trava-longe');if(estRev)cr.push('feito');if(ehAtual&&atualNo===5)cr.push('atual');
  h+='<div class="'+cr.join(' ')+'" style="left:'+NOS[5][0]+'%;top:'+NOS[5][1]+'%;--nx:'+Math.min(NOS[5][0],100-NOS[5][0])+'">'+
     '<button class="bt" data-rev="'+ui+'"'+(completo?'':' aria-disabled="true"')+
     ' aria-label="Revisão da etapa '+u.n+(completo?'':'. Termine as 5 fases para abrir')+'">'+(completo?IC.medalha:'')+'</button>'+
     '<span class="estrelas" aria-hidden="true">'+(estRev?estrelasSVG(estRev):'')+'</span>'+
     '<span class="rot">Revisão'+(completo&&nErr?' · '+nErr+' para refazer':'')+'</span></div>';
  if(ehAtual){
    const ant=NO_ANTES[chave]==null?atualNo:NO_ANTES[chave];
    const p=NOS[ant],lado=NOS[atualNo][0]<=16?'d':'e';
    h+='<div class="voce '+lado+'" data-no="'+atualNo+'" style="left:'+p[0]+'%;top:'+p[1]+'%" aria-hidden="true">'+vocePecas()+'</div>';
  }
  h+='</div></div></section>';
  return h;
}
/* depois de pintar: acende a luz que ganhou e leva o Bobby ao nó novo (sem animação quando o movimento está reduzido) */
function animarMapa(prox){
  const reduz=typeof matchMedia==='function'&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.querySelectorAll('.cena[data-k]').forEach(el=>{
    const sec=el.closest('.etapa'),ui=+sec.id.replace('etapa-','')-1,chave=MATERIA+UNITS[ui].n,k=+el.dataset.k;
    const antes=REV_ANTES[chave];REV_ANTES[chave]=k;
    if(antes!=null&&antes!==k){
      const acende=()=>{el.style.setProperty('--rev',revPct(k));};
      if(reduz)acende();
      else requestAnimationFrame(()=>requestAnimationFrame(acende));
    }else el.style.setProperty('--rev',revPct(k));
  });
  const v=document.querySelectorAll('.voce')[0];
  if(v&&prox&&isFinite(+v.dataset.no)){
    const chave=MATERIA+UNITS[prox[0]].n,no=+v.dataset.no,antes=NO_ANTES[chave];
    NO_ANTES[chave]=no;
    if(antes!=null&&antes!==no){
      const alvo=NOS[no];
      const vai=()=>{if(typeof sfx==='function')sfx('passo',{mat:'madeira',pt:'grama',en:'areia'}[MATERIA]||'grama');v.classList.add('anda');v.style.left=alvo[0]+'%';v.style.top=alvo[1]+'%';
        if(reduz)v.classList.remove('anda');else setTimeout(()=>v.classList.remove('anda'),520);};
      if(reduz)vai();else requestAnimationFrame(()=>requestAnimationFrame(vai));
    }
  }
}

/* aviso curto, no mesmo lugar do aviso de voz (acima da barra), que some sozinho */
function avisoNo(txt){
  let a=document.querySelector('#aviso-no');
  if(!a){a=document.createElement('div');a.id='aviso-no';a.setAttribute('role','status');document.body.appendChild(a);}
  a.className='aviso-voz';a.innerHTML='<span>'+escapa(txt)+'</span>';
  clearTimeout(a._t);clearTimeout(a._t2);
  a._t=setTimeout(()=>{a.classList.add('sai');},2600);
  a._t2=setTimeout(()=>{if(a.parentNode)a.parentNode.removeChild(a);},3100);
}
/* ---------- tela inicial ---------- */
function pintarTopo(){
  document.body.dataset.materia=MATCOD[MATERIA]||'mat';
  const o=S.ofensiva,fogo=$('#st-fogo');
  fogo.innerHTML=IC.fogo+'<em>'+o.atual+'</em>'+(o.congeladores>0?'<span class="gelo-n" aria-hidden="true">'+IC.gelo+o.congeladores+'</span>':'');
  fogo.style.display=S.config.ofensivaLigada?'':'none';
  fogo.classList.toggle('descansa',!!o.descansando);
  fogo.setAttribute('title',textoOfensiva()+(o.congeladores?' · Congeladores: '+o.congeladores:''));
  fogo.setAttribute('aria-label',textoOfensiva()+'. Congeladores: '+o.congeladores);
  $('#st-moedas').innerHTML=IC.moeda+'<em>'+S.moedas+'</em>';
  $('#st-moedas').setAttribute('aria-label','Moedas: '+S.moedas);
  const algumSom=S.som!==false||S.voz!==false||S.musica!==false;
  $('#som').innerHTML=algumSom?IC.falar:IC.somOff;
  $('#som').setAttribute('aria-label','Voz e som');
  if(typeof musicaLigar==='function'&&SFXG.gesto&&(SFXG.musicaPlaneta!==MATERIA||!musicaTocando()))musicaLigar(MATERIA);
  /* o retrato do topo e da barra é o do personagem em uso (companheiro ou Bobby com o look), sempre atualizado */
  $('#logo').innerHTML=retratoPers();
  const rb=$('#retrato-bb');if(rb)rb.innerHTML=retratoPers();
}
function renderTrilha(){
  pintarTopo();calar();
  const p=proxima();
  garantirDia();
  const pct=Math.round(feitas()/TOTAL_LESSONS*100);
  const nome=escapa(S.nome?S.nome:'explorador');
  const pl=PLANETAS[MATERIA];
  const frase=feitas()===0?'Bem-vindo ao meu universo! Cada planeta é uma matéria e cada etapa tem 5 fases. Escolha por onde começar.'
    :(p?'Sua próxima fase é “'+escapa(UNITS[p[0]].lessons[p[1]].title)+'”. Bora?'
       :'Você terminou este planeta inteiro! Pode refazer as fases ou visitar outro planeta lá em cima.');
  const curta=feitas()===0?'Escolha por onde começar.':(p?'Próxima fase: “'+escapa(nomeCurto(UNITS[p[0]].lessons[p[1]].title))+'”.':'Você terminou este planeta inteiro!');
  let h='<section class="planeta" aria-label="Planeta '+pl.n+'">'+
    '<div class="planeta-img">'+imgArte(pl.img,{eager:true})+'</div>'+
    '<div class="planeta-txt"><span class="planeta-nome">Planeta '+pl.n+' · '+MATERIAS[MATERIA].n+'</span>'+
    '<h1><span class="oi-nome">Oi, '+nome+'</span> <button class="lapis" id="editar-nome" aria-label="Trocar nome e cor">'+IC.lapis+'</button></h1>'+
    '<p>'+curta+'</p>'+
    '<div class="meta-linha"><div class="meta-barra" role="progressbar" aria-valuemin="0" aria-valuemax="'+TOTAL_LESSONS+'" aria-valuenow="'+feitas()+
    '" aria-label="Fases deste planeta"><i style="width:'+pct+'%"></i></div><span>'+feitas()+' de '+TOTAL_LESSONS+' fases</span></div></div>'+
    '</section>'+rotinaHTML();
  /* o mapa vem primeiro: a etapa onde o Bobby está sobe para o topo da lista, e as outras seguem na ordem de sempre */
  const ordem=UNITS.map((u,i)=>i);
  if(p){ordem.splice(ordem.indexOf(p[0]),1);ordem.unshift(p[0]);}
  ordem.forEach((ui,k)=>{
    if(p&&k===0)h+='<h2 class="etapa-faixa agora">Sua etapa agora</h2>';
    if(p&&k===1)h+='<h2 class="etapa-faixa">Outras etapas</h2>';
    h+=etapaHTML(UNITS[ui],ui,p);
  });
  $('#tela').innerHTML=h;
  const en=$('#editar-nome');if(en)en.addEventListener('click',telaPerfil);
  ligarRotina();
  /* nó trancado: continua no caminho do teclado (aria-disabled, não disabled) e explica o que falta em vez de ficar mudo */
  $('#tela').querySelectorAll('.bt').forEach(b=>
    b.addEventListener('click',()=>{
      if(b.getAttribute('aria-disabled')==='true'){avisoNo(b.dataset.rev!==undefined?'Termine as 5 fases da etapa para abrir a revisão.':'Termine a fase anterior para abrir esta.');return;}
      if(b.dataset.rev!==undefined)abrirRevisaoMundo(+b.dataset.rev);
      else abrirLicao(+b.dataset.u,+b.dataset.l);
    }));
  pintarPontoGaleria();
  animarMapa(p);
  /* chegada: uma frase do Bobby pela hora do dia (uma vez por abertura, só se nada estiver por cima) */
  if(!renderTrilha.chegou&&p){
    renderTrilha.chegou=true;
    setTimeout(()=>{
      if(['#folha','#modal','#licao','#perfis','#materias','#perfil','#galeria'].some(q=>{const e=$(q);return e&&e.classList&&e.classList.contains('on');}))return;
      const h=new Date().getHours(),sit=feitas()===0?'chegada.curta':(S.diario&&S.diario.blocos>0?null:(h<12?'chegada.manha':(h<18?'chegada.tarde':'chegada.noite')));
      if(sit){avisoNo(falaDe(sit));sfx('motivo','bobby');}
    },1400);
  }
  if(!renderTrilha.jaMostrou&&p){renderTrilha.jaMostrou=true;const v=document.querySelector('.no.atual')||document.querySelector('.voce');if(v&&v.scrollIntoView)setTimeout(()=>{try{v.scrollIntoView({block:'nearest'});}catch(e){}},60);}
}
