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
  const hs=hotspotsDe(MATERIA,u.n);
  if(cena&&hs){
    /* por peça: a lona de cada objeto sai quando a fase dele é feita (recorte retangular do cenário completo); a casa acende com a revisão */
    let h='<div class="cena por-peca" data-k="'+k+'" style="--rev:70%">'+imgArte(cena.apagado,{cls:'cena-base',eager:!!agora});
    hs.forEach((r,li)=>{const feita=li<5?!!S.feitas[u.lessons[li].id]:!!S.feitas['rev'+MATERIA+u.n];
      h+=imgArte(cena.completo,{cls:'peca-luz'+(feita&&!(MAPA.fim&&MAPA.fim.ui===UNITS.indexOf(u)&&MAPA.fim.li===li)?' on':''),style:pecaStyle(r),eager:!!agora}).replace('<img','<img data-li="'+li+'"');});
    return h;
  }
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
    return imgArte(c+'-p01',{cls:'voce-pe',eager:true})+imgArte(ativo(c+'-p04')?c+'-p04':c+'-p01',{cls:'voce-pe2'})+imgArte(ativo(c+'-p03')?c+'-p03':c+'-p01',{cls:'voce-a1',eager:true})+imgArte(ativo(c+'-p03')?c+'-p03':c+'-p01',{cls:'voce-a2',eager:true});
  }
  const uso=lookEmUso(S.look||{});
  let parado=imgArte('bobby-p01',{cls:'voce-pe',eager:true});
  if(uso&&uso.peca.modo!=='sobrepor')parado=imgArte(uso.peca.arte,{cls:'voce-pe',eager:true});
  else if(uso){const an=FRONTAIS['bobby-p01'],a1=ativo('bobby-p01');parado+=imgArte(uso.peca.arte,{cls:'item-chapeu voce-pe',eager:true,style:'left:'+(an[0]*100).toFixed(1)+'%;top:'+(.34*an[1]*a1[1]/a1[2]*100).toFixed(1)+'%;width:'+(an[1]*.66*100).toFixed(1)+'%'});}
  return parado+imgArte('bobby-p09',{cls:'voce-pe2'})+imgArte('bobby-p05a',{cls:'voce-a1',eager:true})+imgArte('bobby-p05b',{cls:'voce-a2',eager:true});
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
  h+=cenaHTML(u,feitasN,ehAtual)+climaHTML(ehAtual);
  const hs=hotspotsDe(MATERIA,u.n),fimAqui=MAPA.fim&&MAPA.fim.ui===ui;
  h+='<div class="trilha'+(hs?' objetos':'')+'">'+(hs?'':trilhaPontos())+(hs?vivosHTML(u)+penduradoHTML(u):'');
  /* nó = objeto do cenário (recorte retangular, área de toque de pelo menos 64 x 64) ou, sem recorte, um marco genérico com brilho */
  const noHTML=(li,cls,atrs,rotulo,aria,miolo,est)=>{
    const p=posNo(u,li),r=hs&&hs[li];
    /* objetos que se sobrepõem na arte (os balões na frente da casa grande): o menor fica por cima, para o centro de cada um receber o toque */
    const camada=r?1+hs.filter(o=>(o[2]-o[0])*(o[3]-o[1])>(r[2]-r[0])*(r[3]-r[1])).length:0;
    const estilo=r?'left:'+p[0].toFixed(2)+'%;top:'+p[1].toFixed(2)+'%;--w:'+(r[2]-r[0]).toFixed(2)+';--h:'+(r[3]-r[1]).toFixed(2)+';--camada:'+camada
                  :'left:'+p[0]+'%;top:'+p[1]+'%;--nx:'+Math.min(p[0],100-p[0]);
    return '<div class="'+cls.join(' ')+(r?' obj-no':'')+'" data-li="'+li+'" style="'+estilo+'">'+
      '<button class="bt" '+atrs+' aria-label="'+aria+'">'+miolo+'</button>'+
      '<span class="estrelas" aria-hidden="true">'+(est?estrelasSVG(est):'')+'</span>'+
      '<span class="rot">'+rotulo+'</span></div>';
  };
  u.lessons.forEach((l,li)=>{
    const ok=S.feitas[l.id],abr=liberada(ui,li),atual=ehAtual&&atualNo===li;
    const p=posNo(u,li);
    const cls=['no'];if(p[0]<=16)cls.push('lado-e');else if(p[0]>=84)cls.push('lado-d');if(!abr)cls.push('trava');if(ok)cls.push('feito');if(atual)cls.push('atual');
    if(abr&&!ok)cls.push('disp');
    const proxTrava=ehAtual&&!abr&&li===atualNo+1;
    if(!abr)cls.push(proxTrava?'trava-prox':'trava-longe');
    const est=ok?estrelasDaFase(l.id):0;
    h+=noHTML(li,cls,'data-u="'+ui+'" data-l="'+li+'"'+(abr?'':' aria-disabled="true"'),escapa(nomeCurto(l.title)),
      'Fase '+(li+1)+': '+escapa(l.title)+(ok?'. Concluída com '+est+(est===1?' estrela':' estrelas'):(atual?'. Sua próxima fase':(abr?'':'. Ainda fechada'))),
      hs?(ok?'<span class="selo-feito">'+IC.estrela+'</span>':''):(abr?'<b>'+(li+1)+'</b>':(proxTrava?IC.cadeado:'')),est);
  });
  const cr=['no','revisao-no'];const p5=posNo(u,5);if(p5[0]<=16)cr.push('lado-e');if(!completo)cr.push('trava','trava-longe');if(estRev)cr.push('feito');if(completo&&!estRev)cr.push('disp');if(ehAtual&&atualNo===5)cr.push('atual');
  h+=noHTML(5,cr,'data-rev="'+ui+'"'+(completo?'':' aria-disabled="true"'),'Revisão'+(completo&&nErr?' · '+nErr+' para refazer':''),
    'Revisão da etapa '+u.n+(completo?'':'. Termine as 5 fases para abrir'),hs?(estRev?'<span class="selo-feito">'+IC.medalha+'</span>':''):(completo?IC.medalha:''),estRev);
  if(ehAtual||fimAqui){
    const noVoce=fimAqui?MAPA.fim.li:atualNo;
    const ant=fimAqui?noVoce:(NO_ANTES[chave]==null?noVoce:NO_ANTES[chave]);
    const p=posNo(u,ant),lado=posNo(u,noVoce)[0]<=16?'d':'e';
    h+='<div class="voce '+lado+'" data-no="'+noVoce+'" style="left:'+p[0].toFixed(2)+'%;top:'+p[1].toFixed(2)+'%" aria-hidden="true">'+vocePecas()+'</div>';
  }
  if(fimAqui)h+=fimCenaHTML(MAPA.fim);
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
  if(v&&prox&&isFinite(+v.dataset.no)&&!MAPA.fim){
    const chave=MATERIA+UNITS[prox[0]].n,no=+v.dataset.no,antes=NO_ANTES[chave];
    if(antes!=null&&antes!==no){v.dataset.no=antes;andarAte(prox[0],no);}
    else NO_ANTES[chave]=no;
  }
  idleMapa();
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
  const algumSom=S.som!==false||S.voz!==false;
  $('#som').innerHTML=algumSom?IC.falar:IC.somOff;
  $('#som').setAttribute('aria-label','Voz e som');
  /* botão de um toque da música, com o estado à vista */
  const bm=$('#musica');
  if(bm){const on=S.musica===true;bm.innerHTML=on?IC.nota:IC.notaOff;bm.classList.toggle('on',on);bm.setAttribute('aria-label','Música: '+(on?'ligada':'desligada'));bm.setAttribute('aria-pressed',on?'true':'false');}
  if(typeof musicaLigar==='function'&&SFXG.gesto&&S.musica===true&&(MUS.planeta!==MATERIA||!musicaTocando()))musicaLigar(MATERIA);
  /* o retrato do topo e da barra é o do personagem em uso (companheiro ou Bobby com o look), sempre atualizado */
  $('#logo').innerHTML=retratoPers();
  const rb=$('#retrato-bb');if(rb)rb.innerHTML=retratoPers();
}
function renderTrilha(){
  /* o mapa vai ser redesenhado: a caminhada em curso é de um personagem que vai sumir (a nova começa em animarMapa) */
  if(typeof pararCaminhada==='function')pararCaminhada();
  pintarTopo();calar();
  const p=proxima();
  garantirDia();
  const pct=Math.round(feitas()/TOTAL_LESSONS*100);
  const nome=escapa(S.nome?S.nome:'explorador');
  const pl=PLANETAS[MATERIA];
  const frase=feitas()===0?'Bem-vindo ao meu universo! Cada planeta é uma matéria e cada etapa tem 5 fases. Escolha por onde começar.'
    :(p?'Sua próxima fase é “'+escapa(tituloDaProxima(p))+'”. Bora?'
       :'Você terminou este planeta inteiro! Pode refazer as fases ou visitar outro planeta lá em cima.');
  const curta=feitas()===0?'Escolha por onde começar.':(p?'Próxima fase: “'+escapa(nomeCurto(tituloDaProxima(p)))+'”.':'Você terminou este planeta inteiro!');
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
  document.body.dataset.hora=horaDoDia();
  /* a cena nunca rola de lado (navegador sem overflow:clip): se o foco de um nó da borda rolar a cena, ela volta na hora */
  $('#tela').querySelectorAll('.cena').forEach(c=>c.addEventListener('scroll',()=>{if(c.scrollLeft||c.scrollTop){c.scrollLeft=0;c.scrollTop=0;}},{passive:true}));
  $('#tela').querySelectorAll('.vivo').forEach(b=>b.addEventListener('click',()=>tocarVivo(b)));
  pintarPendurados();
  $('#tela').querySelectorAll('.bt').forEach(b=>
    b.addEventListener('click',()=>{
      const noEl=b.closest('.no');if(noEl){noEl.classList.add('mostra');rotulosNaCena(noEl.closest('.etapa'));}
      if(b.getAttribute('aria-disabled')==='true'){avisoNo(b.dataset.rev!==undefined?'Termine as 5 fases da etapa para abrir a revisão.':(TRANCAR_ETAPAS&&b.dataset.l==='0'?'Termine a revisão da etapa anterior para abrir esta.':'Termine a fase anterior para abrir esta.'));return;}
      const abre=()=>{if(b.dataset.rev!==undefined)abrirRevisaoMundo(+b.dataset.rev);else abrirLicao(+b.dataset.u,+b.dataset.l);};
      /* o personagem anda até o objeto antes de abrir (quando está nesta etapa); a fase só abre quando ele chega */
      const ui=+(b.dataset.rev!==undefined?b.dataset.rev:b.dataset.u),li=b.dataset.rev!==undefined?5:+b.dataset.l;
      const sec=$('#etapa-'+(ui+1)),v=sec&&sec.querySelector('.voce');
      if(v&&+v.dataset.no!==li)andarAte(ui,li,abre);else abre();
    }));
  pintarPontoGaleria();
  rotulosNaCena();
  animarMapa(p);
  /* chegada: uma frase do Bobby pela hora do dia (uma vez por abertura, só se nada estiver por cima) */
  if(!renderTrilha.chegou&&p){
    renderTrilha.chegou=true;
    setTimeout(()=>{
      if(['#folha','#modal','#licao','#perfis','#materias','#perfil','#galeria'].some(q=>{const e=$(q);return e&&e.classList&&e.classList.contains('on');}))return;
      /* a mesma faixa da luz da cena (horaDoDia): de madrugada é boa noite, não bom dia */
      const fx=horaDoDia(),sit=feitas()===0?'chegada.curta':(S.diario&&S.diario.blocos>0?null:(fx==='manha'?'chegada.manha':(fx==='noite'?'chegada.noite':'chegada.tarde')));
      if(sit){avisoNo(falaDe(sit));sfx('motivo','bobby');}
    },1400);
  }
  if(MAPA.fim){ligarFimCena(MAPA.fim);}
  if(!renderTrilha.jaMostrou&&p){renderTrilha.jaMostrou=true;setTimeout(mostrarNoAtual,60);}
}
/* rótulo de objeto perto da borda da cena (o objeto pode até passar do corte da imagem): desliza para dentro, a 8 px da borda */
function rotulosNaCena(raiz){
  if(typeof document==='undefined'||typeof getComputedStyle!=='function')return;
  (raiz||document).querySelectorAll('.no.obj-no .rot').forEach(rot=>{
    rot.style.removeProperty('--rot-dx');
    if(getComputedStyle(rot).display==='none')return;
    const cena=rot.closest('.etapa')&&rot.closest('.etapa').querySelector('.cena');if(!cena)return;
    const r=rot.getBoundingClientRect(),c=cena.getBoundingClientRect();
    const dx=Math.max(0,c.left+8-r.left)+Math.min(0,c.right-8-r.right);
    if(dx)rot.style.setProperty('--rot-dx',Math.round(dx)+'px');
  });
}
if(typeof window!=='undefined'&&window.addEventListener)window.addEventListener('resize',()=>{if(typeof rotulosNaCena==='function')rotulosNaCena();});
/* primeira dobra: o nó atual (com o rótulo) e o personagem ficam juntos na faixa visível, entre o topo fixo e a barra de baixo.
   Antes era scrollIntoView({block:'nearest'}): com o objeto alto da etapa 1 (até 160 px) ele parava atrás da barra ou embaixo do topo. */
function mostrarNoAtual(){
  if(typeof document==='undefined'||typeof getComputedStyle!=='function'||typeof window==='undefined'||typeof window.scrollTo!=='function')return;
  /* com o personagem andando, a câmera da caminhada já leva o grupo do destino para a mesma faixa: não briga com ela */
  if(ANDA.ocupado)return;
  const no=document.querySelector('.no.atual');
  if(!no)return;
  try{window.scrollTo(0,alvoDoGrupo(grupoDoNo(no)));}catch(e){}
}
