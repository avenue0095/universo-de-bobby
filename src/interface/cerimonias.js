/* ---------- cerimônias: fim de etapa e fim de planeta (docs/PLANO-DE-IDENTIDADE.md, seção 8) ----------
   Recompensa fixa e conhecida (nada de sorteio), pulável com um toque depois de 1 s, igual com o som desligado, sem contagem regressiva.
   A fase concluída tem a sua (estrelas que acendem uma a uma) em licao.js. Cada cerimônia aparece uma vez (S.cer guarda quais já passaram). */
const CER={timers:[],aberta:false,desde:0};
const cerLimpa=()=>{CER.timers.splice(0).forEach(clearTimeout);};
const cerAgenda=(fn,ms)=>{CER.timers.push(setTimeout(fn,ms));};
const cerJaVista=k=>(S.cer||[]).indexOf(k)>=0;
function cerMarca(k){S.cer=(S.cer||[]).concat([k]).slice(-60);salvar();}
const cerReduz=()=>{try{return matchMedia('(prefers-reduced-motion: reduce)').matches;}catch(e){return false;}};

/* um toque (depois de 1 s) mostra tudo e liga os botões; o fim natural faz o mesmo */
function cerPular(){
  if(!CER.aberta)return;
  const f=$('#folha .cer');if(!f||f.classList.contains('tudo'))return;
  if(Date.now()-CER.desde<1000)return;
  cerLimpa();f.classList.add('tudo');
  const c=$('#folha .cer-cena');if(c)c.style.setProperty('--rev','-8%');
}
function cerBase(html){
  CER.aberta=true;CER.desde=Date.now();cerLimpa();
  abrirFolha('<div class="folha-in cer'+(cerReduz()?' tudo':'')+'" id="cer">'+html+'</div>');
  const f=$('#folha .cer');
  f.addEventListener('click',e=>{if(!e.target.closest('button'))cerPular();});
}
function cerFecha(){cerLimpa();CER.aberta=false;audioParar();fecharFolha();}
function cenaCerimonia(u){
  const cena=cenaDaEtapa(MATERIA,u.n),pl=PLANETAS[MATERIA];
  if(cena)return '<div class="cena cer-cena" style="--rev:70%">'+imgArte(cena.apagado,{cls:'cena-base',eager:true})+imgArte(cena.completo,{cls:'cena-luz',eager:true})+'</div>';
  return '<div class="cena cer-cena sem-arte" style="--rev:70%"><div class="cena-ceu"></div><div class="cena-planeta cena-base">'+imgArte(pl.img,{})+'</div><div class="cena-planeta cena-luz">'+imgArte(pl.img,{})+'</div></div>';
}
/* etapa concluída (até 8 s): a cena acende, Bobby e o guia entram, troféu e estrelas, título e frase da história, desenho entregue, dois botões iguais */
function cerimoniaDaEtapa(u,depois){
  const chave=MATERIA+u.n;
  if(cerJaVista(chave)){if(depois)depois();return false;}
  cerMarca(chave);
  const d=desenhoPorId(desenhoIdDe(MATERIA,u.n)),pl=PLANETAS[MATERIA];
  const est=u.lessons.reduce((a,l)=>a+estrelasDaFase(l.id),0),prox=NARRATIVA[MATERIA]&&NARRATIVA[MATERIA][u.n];
  const frase=prox?prox[1]:'';
  cerBase(cenaCerimonia(u)+
    '<div class="cer-atores p1">'+MASC('comemora')+imgArte(pl.guia+'-p02',{cls:'cer-guia',alt:''})+'</div>'+
    '<div class="cer-trofeu p2">'+IC.trofeu+'<span>'+est+' de '+(u.lessons.length*3)+' estrelas</span></div>'+
    '<h2 class="p3">Etapa '+u.n+' completa!</h2>'+
    (frase?'<p class="fala-p p3">'+escapa(frase)+'</p>':'')+
    (d?'<div class="premio p4" data-materia="'+COD_DESENHO[d.matApp]+'"><div class="mini-desenho">'+(ativo(d.id)?imgArte(d.id,{alt:''}):'<span class="des-silhueta">'+imgArte(pl.img,{})+'</span>')+'</div>'+
       '<div><b>Você ganhou um desenho!</b><span>“'+escapa(d.nome)+'” já está na sua galeria.</span></div></div>':'')+
    '<div class="folha-bts par p5"><button class="btn-sec" id="cer-ver"'+(d?'':' hidden')+'>Ver o desenho</button><button class="btn-sec" id="cer-ok">Continuar</button></div>');
  const fim=()=>{cerFecha();if(depois)depois();};
  $('#cer-ok').addEventListener('click',fim);
  $('#cer-ver').addEventListener('click',()=>{cerFecha();if(d)abrirGaleria(d.id);});
  /* a linha do tempo (sons e voz); com movimento reduzido tudo já está na tela, só os sons seguem */
  sfx('pecaAcende');
  cerAgenda(()=>{const c=$('#folha .cer-cena');if(c)c.style.setProperty('--rev','-8%');},120);
  cerAgenda(()=>{sfx('motivo','bobby');sfx('motivo',pl.guia);},1200);
  cerAgenda(()=>{for(let i=0;i<3;i++)setTimeout(()=>sfx('estrela',i),i*300);},2000);
  cerAgenda(()=>{sfx('etapaOk');if(frase&&S.voz!==false)falar(frase);},3500);
  cerAgenda(()=>{sfx('conquista');},5000);
  cerAgenda(()=>{const f=$('#folha .cer');if(f)f.classList.add('tudo');},6500);
  return true;
}
/* constelação: três estrelas (uma por planeta) ligadas por traços; acende cada uma que voltou, e com as três vem o nome da criança */
function constelacaoSVG(voltaram,nome){
  const pos={mat:[60,110],pt:[150,40],en:[240,100]};
  const ordem=['mat','pt','en'];
  let l='',e='';
  l+='<path class="traco'+(voltaram.indexOf('mat')>=0&&voltaram.indexOf('pt')>=0?' on':'')+'" d="M60 110L150 40"/>';
  l+='<path class="traco'+(voltaram.indexOf('pt')>=0&&voltaram.indexOf('en')>=0?' on':'')+'" d="M150 40L240 100"/>';
  ordem.forEach(k=>{const on=voltaram.indexOf(k)>=0;e+='<g data-materia="'+MATCOD[k]+'"><circle class="estrela'+(on?' on':'')+'" cx="'+pos[k][0]+'" cy="'+pos[k][1]+'" r="'+(on?11:7)+'"/></g>';});
  const todas=voltaram.length===3;
  const t=todas?'<text class="nome-const" x="150" y="165" text-anchor="middle">'+escapa(nome||'explorador')+'</text>':'';
  return '<svg class="constelacao" viewBox="0 0 300 180" role="img" aria-label="'+(todas?'Constelação de '+escapa(nome||'explorador'):voltaram.length+' de 3 estrelas de volta ao céu')+'">'+l+e+t+'</svg>';
}
function planetaCompleto(){return UNITS.every(u=>mundoCompleto(u));}
/* planeta concluído (até 20 s, uma vez por planeta): a estrela volta ao céu, o Embaralho pede para ir à festa, a constelação (com o nome quando as três voltaram) */
function cerimoniaDoPlaneta(depois){
  const chave='pl'+MATERIA;
  if(cerJaVista(chave)||!planetaCompleto()){if(depois)depois();return false;}
  cerMarca(chave);
  const voltaram=['mat','pt','en'].filter(k=>cerJaVista('pl'+k)),todas=voltaram.length===3,pl=PLANETAS[MATERIA],est=ESTRELAS_DO_CEU[MATERIA];
  const nome=S.nome||'explorador';
  const fala1=todas?'A constelação acendeu. O céu inteiro agora tem o seu nome.':falaDe('estrela');
  cerBase('<div class="cer-ceu">'+constelacaoSVG(voltaram,nome)+'</div>'+
    '<div class="cer-atores p1">'+MASC('comemora')+imgArte(pl.guia+'-p02',{cls:'cer-guia',alt:''})+'</div>'+
    '<h2 class="p2">Planeta '+pl.n+' completo!</h2>'+
    '<p class="fala-p p2">A '+est.n+' voltou para o céu.</p>'+
    '<p class="fala-p p3">'+(todas?'A constelação de '+escapa(nome)+' acendeu. O céu inteiro agora tem o seu nome.':escapa(fala1))+'</p>'+
    '<p class="fala-p p4">'+escapa(falaDe('embaralho'))+'</p>'+
    '<p class="fala-p p5">Descansar também faz parte da aventura.</p>'+
    '<div class="folha-bts p5"><button class="btn-acao" id="cer-ok">Voltar ao mapa</button></div>');
  $('#cer-ok').addEventListener('click',()=>{cerFecha();if(depois)depois();});
  cerAgenda(()=>{sfx('planetaOk');},300);
  cerAgenda(()=>{sfx('motivo','embaralho');},4000);
  cerAgenda(()=>{if(S.voz!==false)falar(fala1);},2600);
  cerAgenda(()=>{const f=$('#folha .cer');if(f)f.classList.add('tudo');},6000);
  return true;
}
/* depois da última fase de uma etapa: a cerimônia da etapa e, se o planeta ficou completo, a do planeta */
function cerimoniasDoFim(u){
  cerimoniaDaEtapa(u,()=>{if(planetaCompleto())cerimoniaDoPlaneta();});
}
