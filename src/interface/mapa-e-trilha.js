/* ---------- mapa dos mundos ---------- */
const TRACADO=[
  [[20,124],[56,226],[27,334],[64,440],[43,546],[76,636]],
  [[76,124],[40,226],[71,334],[32,440],[57,546],[24,636]]
];
const CENAS=[[76,176,1],[9,286,.85],[85,392,.9],[12,498,1],[66,598,.8]];
const TEMAS=[
 ['arvore','arbusto','flor','arvore','arbusto'],
 ['palmeira','pedra','arbusto','palmeira','flor'],
 ['cacto','pedra','cacto','arbusto','pedra'],
 ['pinheiro','cogumelo','pinheiro','arbusto','cogumelo'],
 ['montanha','pedra','pinheiro','montanha','arbusto'],
 ['predio','arbusto','predio','flor','predio'],
 ['pedra','montanha','pedra','cacto','pedra'],
 ['arvore','flor','arbusto','arvore','flor'],
 ['estrela','planeta','estrela','planeta','estrela'],
 ['montanha','estrela','pinheiro','planeta','estrela']
];
const ALT_MAPA=726;
function trilhaPontos(pos){
  let h='';
  for(let i=0;i<pos.length-1;i++){
    const a=pos[i],b=pos[i+1];
    for(let k=1;k<=5;k++){
      const t=k/6;
      const x=a[0]+(b[0]-a[0])*t+Math.sin(Math.PI*t)*3.5*(i%2?-1:1);
      const y=a[1]+(b[1]-a[1])*t;
      h+='<span class="passo-trilha" style="left:'+x.toFixed(1)+'%;top:'+y.toFixed(0)+'px"></span>';
    }
  }
  return h;
}
function mapaMundo(u,ui,prox){
  const pos=TRACADO[ui%2],tema=TEMAS[ui%TEMAS.length];
  let h='<div class="mapa" style="height:'+ALT_MAPA+'px">';
  h+='<span class="cenario nuvem" style="left:'+(ui%2?18:62)+'%;top:44px">'+CEN.nuvem+'</span>';
  h+='<span class="cenario nuvem lenta" style="left:'+(ui%2?70:22)+'%;top:276px">'+CEN.nuvem+'</span>';
  tema.forEach((t,k)=>{const c=CENAS[k];
    h+='<span class="cenario" style="left:'+c[0]+'%;top:'+c[1]+'px;--e:'+c[2]+'">'+(CEN[t]||CEN.arbusto)+'</span>';});
  h+=trilhaPontos(pos);
  u.lessons.forEach((l,li)=>{
    const ok=S.feitas[l.id],abr=liberada(ui,li),ehCastelo=li===u.lessons.length-1;
    const atual=prox&&prox[0]===ui&&prox[1]===li;
    const cls=['fase'];if(!abr)cls.push('trava');if(ok)cls.push('feito');if(atual)cls.push('atual');
    if(ehCastelo)cls.push('castelo');
    h+='<div class="'+cls.join(' ')+'" style="left:'+pos[li][0]+'%;top:'+pos[li][1]+'px">';
    if(atual)h+='<span class="voce">'+MASC('feliz','pula')+'</span>';
    h+='<button class="bt" data-u="'+ui+'" data-l="'+li+'"'+(abr?'':' disabled aria-disabled="true"')+
       ' aria-label="Fase '+(li+1)+': '+l.title+'">'+
       (ehCastelo?(abr?CASTELO:IC.cadeado):(abr?'<b>'+(li+1)+'</b>':IC.cadeado))+'</button>';
    h+='<span class="estrelas">'+(ok?estrelasSVG(ok):'')+'</span>';
    h+='<span class="rot">'+l.title+'</span></div>';
  });
  const completo=mundoCompleto(u);
  const nErr=(S.errados[MATERIA+u.n]||[]).length;
  const estRev=S.feitas['rev'+MATERIA+u.n]||0;
  const cr=['fase','revisao-fase'];if(!completo)cr.push('trava');if(estRev)cr.push('feito');
  h+='<div class="'+cr.join(' ')+'" style="left:'+pos[5][0]+'%;top:'+pos[5][1]+'px">';
  h+='<button class="bt" data-rev="'+ui+'"'+(completo?'':' disabled aria-disabled="true"')+
     ' aria-label="Revisao do Mundo '+u.n+'">'+(completo?IC.medalha:IC.cadeado)+'</button>';
  h+='<span class="estrelas">'+(estRev?estrelasSVG(estRev):'')+'</span>';
  h+='<span class="rot">Revisão do mundo'+(completo&&nErr?'<br><i>'+nErr+' para refazer</i>':'')+'</span></div>';
  h+='</div>';
  return h;
}

/* ---------- tela inicial ---------- */
function pintarTopo(){
  document.documentElement.style.setProperty('--m1',perfilAtual().cor||CORES[0]);
  $('#st-fogo').innerHTML=IC.fogo+'<em>'+S.ofensiva+'</em>';
  $('#st-moedas').innerHTML=IC.moeda+'<em>'+S.xp+'</em>';
  $('#som').innerHTML=S.som?IC.falar:IC.somOff;
  $('#som').setAttribute('aria-label',S.som?'Desligar sons':'Ligar sons');
  $('#logo').innerHTML=MASC('oi');
}
function renderTrilha(){
  pintarTopo();calar();
  const p=proxima();
  const pct=Math.round(feitas()/TOTAL_LESSONS*100);
  const nome=escapa(S.nome?S.nome:'explorador');
  const frase=feitas()===0?'Bem-vindo ao meu universo! Cada galáxia é uma matéria e cada mundo tem 5 fases. Escolha por onde começar.'
    :(p?'Sua próxima fase é “'+UNITS[p[0]].lessons[p[1]].title+'”. Bora?'
       :'Você zerou esta galáxia inteira! Pode refazer as fases ou trocar de matéria lá em cima.');
  let h='<div class="ola"><div class="mini">'+MASC('feliz')+'</div>'+
    '<div class="txt"><h1>Oi, '+nome+' <button class="lapis" id="editar-nome" aria-label="Trocar nome e cor">'+IC.lapis+'</button></h1><p>'+frase+'</p></div>'+
    '<div class="anel" style="--p:'+pct+'"><i>'+feitas()+'/'+TOTAL_LESSONS+'</i></div></div>';

  UNITS.forEach((u,ui)=>{
    const completo=mundoCompleto(u);
    h+='<section class="mundo" style="--ub:'+corUnidade(u)+'">';
    h+='<div class="faixa"><div class="nun">Mundo '+u.n+' · '+u.lessons.length+' fases'+
       (completo?' <span class="zerado">'+IC.bandeira+' completo</span>':'')+'</div>'+
       '<h2>'+u.title+'</h2><p>'+u.sub+'</p></div>';
    h+=mapaMundo(u,ui,p);
    h+='</section>';
  });
  $('#tela').innerHTML=h;
  const en=$('#editar-nome');if(en)en.addEventListener('click',telaPerfil);
  $('#tela').querySelectorAll('.bt:not([disabled])').forEach(b=>
    b.addEventListener('click',()=>{
      if(b.dataset.rev!==undefined)abrirRevisaoMundo(+b.dataset.rev);
      else abrirLicao(+b.dataset.u,+b.dataset.l);
    }));
}

