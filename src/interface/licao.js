/* ---------- lição ---------- */
let LIC={};
function abrirLicao(ui,li){
  /* muro da venda (planos.js): no modo 'aberto' passa direto; no 'pago' sem assinatura a fase não abre e aparece a tela Assinatura */
  if(typeof portaoDeAcesso==='function'&&!portaoDeAcesso())return;
  calar();if(LIC&&LIC.tDica){clearTimeout(LIC.tDica);}
  garantirDia();
  /* limite de blocos do dia, definido pelo responsável: só "até amanhã" (o responsável libera com a senha) */
  if(limiteDeBlocosAtingido()){mostrarParada(true);return;}
  const u=UNITS[ui],l=u.lessons[li];
  /* base = quantas perguntas a fase REALMENTE tem. Fixo em 8 fazia a fase de 6 perguntas
     dizer "você acertou 6 de 8" numa jogada perfeita e travar a barra de missão em 75%. */
  const _qs=genQuestions(l,8);
  const faseNova=!S.feitas[l.id];
  const aquecimento=(typeof aquecimentoDaFase==='function'&&faseNova)?aquecimentoDaFase():[];
  /* aquecimento: 2 ou 3 itens do caderno entram logo depois da primeira pergunta (recuperar antes de aprender) */
  if(aquecimento.length&&_qs.length>1)_qs.splice(1,0,...aquecimento);
  /* 1G: habilidade da fase com 6 respostas ou mais e domínio abaixo de 0,30: a primeira pergunta abre com o lembrete da aula aberto (exemplo resolvido) */
  if(typeof precisaExemplo==='function'&&precisaExemplo(l)&&_qs[0])_qs[0].__exemplo=true;
  LIC={ui:ui,li:li,u:u,l:l,qs:_qs,base:_qs.length,i:0,passo:0,vidas:5,erros:0,acertos:0,
       combo:0,melhorCombo:0,etapa:'historia',resp:null,digitado:'',conferido:false,dica:false,
       md:{c:0,d:0,u:0},miss:(MISS_ATUAL?MISS_ATUAL[l.id]:null),
       cap:(CAP_ATUAL?CAP_ATUAL[u.n]:null),t0:Date.now(),
       tipoBloco:'fase',faseNova:faseNova,respondidas:0,ganhoFase:0,hist:[],tQ:0};
  registrarEvento('bloco_inicio',{tipo:'fase',lic:String(l.id).replace(/[^a-z0-9._]/gi,''),materia:MATERIA});
  $('#licao').classList.add('on');
  $('#revisao').classList.remove('on');
  $('#licao').style.setProperty('--ub',corUnidade(u));
  document.body.style.overflow='hidden';
  pintarLicao();
  sfx('motivo',guiaDaMateria());
}
function fecharLicao(){
  calar();
  if(LIC.tDica){clearTimeout(LIC.tDica);LIC.tDica=null;}
  /* saiu no meio do bloco: fica registrado como "abandonou" (não conta como dia ativo) */
  if(LIC.etapa==='questao'&&!LIC.encerrado&&(LIC.respondidas||0)>0){
    LIC.encerrado=true;
    registrarEvento('bloco_fim',{tipo:LIC.tipoBloco||'fase',lic:String((LIC.l&&LIC.l.id)||'').replace(/[^a-z0-9._]/gi,''),materia:MATERIA,
      perguntas:LIC.respondidas||0,acertos:LIC.acertos||0,abandonou:1,contou:0,seg:Math.round((Date.now()-(LIC.t0||Date.now()))/1000)});
  }
  $('#licao').classList.remove('on');document.body.style.overflow='';renderTrilha();
  if(typeof depoisDeFecharLicao==='function')depoisDeFecharLicao();
}
function pintarVidas(){
  let h='';for(let i=0;i<5;i++)h+=IC.coracao.replace('<svg',i<LIC.vidas?'<svg':'<svg class="off"');
  $('#vidas').innerHTML=h;
}
function blocoPasso(ps,k,comFala){
  const p=ps[k];
  let h='';
  if(comFala)h+='<div class="fala">'+MASCB(k===0?'feliz':(k===ps.length-1?'radiante':'pensa'),'avatar')+acompanhanteHTML()+
    '<span class="nome">Bobby explica</span>'+
    '<button class="icobtn ouvir" data-ler="'+encodeURIComponent(p.t+'. '+p.c)+'" aria-label="Ouvir a explicação">'+IC.falar+'</button></div>';
  h+='<div class="balao"><h2>'+p.t+'</h2><p>'+p.c+'</p>'+(p.fig?'<div class="figura">'+p.fig+'</div>':'')+'</div>';
  return h;
}
function ligarOuvir(escopo){
  escopo.querySelectorAll('[data-ler]').forEach(b=>b.addEventListener('click',()=>{
    const t=decodeURIComponent(b.dataset.ler);
    /* lista de textos (capítulo + missão) vem como JSON e toca em fila */
    let alvo=t;if(t.charAt(0)==='['){try{alvo=JSON.parse(t);}catch(e){}}
    falarPedido(alvo,b.dataset.lang);
  }));
}
function tecladoHTML(){
  const t=['1','2','3','4','5','6','7','8','9',',','0','apagar'];
  return '<div class="teclado">'+t.map(k=>k==='apagar'
    ?'<button class="tecla apaga" data-k="apagar" aria-label="Apagar">'+IC.apagar+'</button>'
    :'<button class="tecla" data-k="'+k+'">'+k+'</button>').join('')+'</div>';
}
function pintarCampo(){
  const c=$('#campo');if(!c)return;
  c.innerHTML=LIC.digitado?LIC.digitado:'<span class="ph">?</span>';
  $('#acao').disabled=!LIC.digitado;
}
function digitar(k){
  if(LIC.conferido)return;
  if(k==='apagar')LIC.digitado=LIC.digitado.slice(0,-1);
  else if(k===','){if(!LIC.digitado.includes(',')&&LIC.digitado)LIC.digitado+=',';}
  else if(LIC.digitado.length<7)LIC.digitado+=k;
  LIC.resp=LIC.digitado;pintarCampo();nota(700,0,.05,.05);
}
/* Fala agendada para depois que a tela pinta. Fica guardada no audio.js: fechar a fase, avançar ou abrir
   outra tela cancela (antes, a fala saía 420 ms depois, com a fase já fechada). */
/* a abertura do capítulo e a missão são dois clipes separados: tocam em fila */
function textosDaHistoria(cap,m){
  const l=[];
  if(cap&&LIC.li===0)l.push(cap.abre);
  if(m)l.push(m.t+'. '+m.abre);
  return l;
}
function licaoAberta(){return $('#licao').classList.contains('on');}
function falarDepois(ms,texto,lang){
  audioAgendar(()=>{if(licaoAberta())falar(texto,lang);},ms);
}
function pintarLicao(){
  calar();
  const pe=$('#pe');pe.className='pe';
  $('#prog').style.width=(LIC.etapa==='aula'?0:Math.max(4,Math.round(LIC.acertos/LIC.base*100)))+'%';
  pintarVidas();
  const emQuestao=LIC.etapa==='questao';
  $('#vidas').style.visibility=emQuestao?'visible':'hidden';
  $('#rever').style.display=emQuestao?'grid':'none';
  $('#dica').style.display=emQuestao?'grid':'none';
  if(LIC.etapa==='historia'){
    const m=LIC.miss,cap=LIC.cap;
    const abreCap=(LIC.li===0&&cap)?'<p class="cap-abre">'+cap.abre+'</p>':'';
    let h='<div class="surge"><div class="et">'+(cap?'Capítulo '+LIC.u.n+' · '+cap.t:'Mundo '+LIC.u.n)+'</div>';
    h+='<div class="aula"><div class="fala">'+MASCB('curioso','avatar')+acompanhanteHTML()+'<span class="nome">Bobby precisa de você</span>'+
       '<button class="icobtn ouvir" data-ler="'+encodeURIComponent(JSON.stringify(textosDaHistoria(cap,m)))+'" aria-label="Ouvir">'+IC.falar+'</button></div>';
    h+='<div class="balao historia"><h2>'+(m?m.t:LIC.l.title)+'</h2>'+abreCap+'<p>'+(m?m.abre:'')+'</p></div>';
    h+='<div class="premio-missao">'+ITENS[(cap&&cap.item)||'estrela']+'<span>Cada resposta certa ajuda o Bobby a completar a missão.</span></div>';
    h+='</div></div>';
    $('#palco').innerHTML=h;ligarOuvir($('#palco'));
    $('#acao').textContent='Vamos ajudar!';$('#acao').disabled=false;
    $('.lc-corpo').scrollTo(0,0);
    if(ehF78())falarDepois(350,textosDaHistoria(cap,m));
    return;
  }
  if(LIC.etapa==='aula'){
    const ps=passosDe(LIC.l),k=LIC.passo;
    let h='<div class="surge"><div class="et">Mundo '+LIC.u.n+' · fase '+(LIC.li+1)+' · '+LIC.l.title+'</div>';
    h+='<div class="aula">'+blocoPasso(ps,k,true);
    h+='<div class="passinhos">';
    ps.forEach((_,j)=>{h+='<button class="'+(j===k?'on':'')+'" data-p="'+j+'" aria-label="Parte '+(j+1)+' de '+ps.length+'"></button>';});
    h+='</div></div></div>';
    $('#palco').innerHTML=h;
    $('#palco').querySelectorAll('.passinhos button').forEach(b=>b.addEventListener('click',()=>{
      LIC.passo=+b.dataset.p;pintarLicao();
    }));
    ligarOuvir($('#palco'));
    $('#acao').textContent=k<ps.length-1?'Entendi, continuar':(LIC.rev?'Começar a revisão':'Vamos jogar!');
    $('#acao').disabled=false;
    $('.lc-corpo').scrollTo(0,0);
    return;
  }
  if(LIC.etapa==='fim'){pintarFim();return;}
  const q=LIC.qs[LIC.i];
  if(ehF78()&&q.type==='mc'&&q.options.length>3&&!q.__reduzido){
    const fora=q.options.filter(o=>o!==q.answer);
    q.options=shufA([q.answer,fora[0],fora[1]]);q.__reduzido=true;
  }
  /* A pergunta acontece dentro da cena: o guia da matéria (Teo, Rufa ou Otto) fala o enunciado num balão, com o cenário da etapa ao fundo.
     Com companheiro escolhido ele acompanha como amigo (retrato ao lado do número da pergunta) e o guia da matéria continua ensinando. */
  const guia=PLANETAS[MATERIA].guia,pa=persAtivo(),amigo=pa.tipo==='comp'&&pa.id===guia?'':MASC('pensa','avatar');
  /* 1D: q-cena (guia, balão, lembrete, figura) e q-lado (respostas); no celular os dois somem do layout (display:contents), no computador viram 2 colunas */
  let h='<div class="surge"><div class="q-cena">'+barraMissao()+'<div class="cena-q" data-guia="'+guia+'">'+
    '<div class="guia-q">'+imgArte(guia+'-p04',{cls:'guia-img',eager:true,alt:PLANETAS[MATERIA].guiaNome+', o guia'})+'</div>'+
    '<div class="balao-q"><div class="balao-topo">'+amigo+'<div class="et">'+
    (LIC.diag?'Exploração · ':(LIC.rev?'Revisão · ':''))+'Pergunta '+(LIC.i+1)+
    (q.__irma?' · <b>parecida</b>':(q.__rep?' · <b>de novo</b>':''))+'</div>'+
    '<button class="icobtn ouvir" data-ler="'+encodeURIComponent(q.ouvir||q.prompt)+'"'+
    (q.lang?' data-lang="'+escapa(q.lang)+'"':'')+' aria-label="Ouvir">'+IC.falar+'</button></div>'+
    '<h2 class="pergunta">'+htmlSeguro(q.prompt,500)+'</h2>'+
    (()=>{const ult=LIC.i>=LIC.qs.length-1&&LIC.qs.length>2,meio=LIC.i===Math.floor(LIC.base/2)&&LIC.base>=6;
      return !LIC.rev&&(ult||meio)&&!(q.__rep)?'<small class="fala-mini">'+falaDe(ult?'ultima':'meio')+'</small>':'';})()+
    '<small class="fala-mini" id="fala-ocioso" hidden></small></div></div>';
  /* o lembrete da aula começa FECHADO (abre com um toque; abre sozinho depois de dois erros seguidos) */
  if(!LIC.rev&&(LIC.i<2||q.__exemplo)){
    const lem=lembreteDaAula(LIC.l);
    /* o texto vai dentro de um <div>: nó de texto solto dentro de <details> fechado era lido pelo leitor de tela sem as palavras em negrito */
    if(lem)h+='<details class="lembrete"'+(q.__exemplo?' open':'')+'><summary class="tit">'+IC.lampada+' Lembre da aula</summary><div class="lembrete-txt">'+lem+'</div></details>';
  }
  if(q.figure)h+='<div class="figura">'+q.figure+'</div>';
  h+='</div><div class="q-lado">';
  if(typeof temTelaPropria==='function'&&temTelaPropria(q)){
    h+=verbosHTML(q);
  }else if(q.type==='mc'){
    const curtas=q.options.length>=4&&q.options.every(o=>String(o).length<=9&&!/<|figure/.test(String(o)));
    h+='<div class="alts'+(curtas?' curtas':'')+'">';
    q.options.forEach((o,k)=>{h+='<button class="alt" data-v="'+k+'"><span class="k">'+(k+1)+'</span><span>'+htmlSeguro(o,120)+'</span></button>';});
    h+='</div>';
  }else if(q.type==='blocos'){
    h+=blocosHTML(q);
  }else if(q.type==='fracao'){
    h+=fracaoHTML(q);
  }else if(q.type==='grupinhos'){
    h+=grupinhosHTML(q);
  }else if(q.type==='dinheiro'){
    h+=dinheiroHTML(q);
  }else if(q.type==='texto'){
    h+='<div class="resp" id="campo"></div>'+letrasHTML(q);
  }else if(q.type==='silabas'){
    h+=silabasHTML(q);
  }else{
    h+='<div class="resp" id="campo"></div>'+tecladoHTML();
  }
  h+='<div class="caixa-dica" id="caixa-dica" hidden></div>';
  h+='</div></div>';
  $('#palco').innerHTML=h;
  /* cenário da etapa atrás da pergunta (escurecido e desfocado por CSS); sem a arte da etapa fica o planeta de sempre */
  const cn=cenaDaEtapa(MATERIA,LIC.u.n);
  if(cn&&ativo(cn.completo))$('#licao').style.setProperty('--cena','url("'+ARTE_BASE+ativo(cn.completo)[0]+'")');else $('#licao').style.setProperty('--cena','none');
  $('.lc-corpo').scrollTo(0,0);
  ligarOuvir($('#palco'));
  LIC.resp=null;LIC.digitado='';LIC.conferido=false;LIC.dica=false;LIC.tQ=Date.now();
  $('#acao').textContent='Verificar';$('#acao').disabled=true;
  $('#dica').style.display='grid';
  if(typeof temTelaPropria==='function'&&temTelaPropria(q)){
    ligarVerbos(q);
  }else if(q.type==='mc'){
    $('#palco').querySelectorAll('.alt').forEach(b=>b.addEventListener('click',()=>{
      if(LIC.conferido)return;
      $('#palco').querySelectorAll('.alt').forEach(x=>x.classList.remove('sel'));
      b.classList.add('sel');LIC.resp=q.options[+b.dataset.v];$('#acao').disabled=false;
      nota(600,0,.05,.05);
    }));
  }else if(q.type==='blocos'){
    LIC.md={c:0,d:0,u:0};
    $('#palco').querySelectorAll('.md-bt').forEach(b=>b.addEventListener('click',()=>mdMuda(b.dataset.k,+b.dataset.op)));
    atualizaBlocos();
  }else if(q.type==='fracao'){
    LIC.frac=[];
    $('#palco').querySelectorAll('.parte').forEach(b=>b.addEventListener('click',()=>{
      const i=+b.dataset.i;
      LIC.frac[i]=!LIC.frac[i];nota(LIC.frac[i]?760:420,0,.06,.05);atualizaFracao();}));
    atualizaFracao();
  }else if(q.type==='grupinhos'){
    LIC.gr={g:0,p:0};
    $('#palco').querySelectorAll('.gr-bt').forEach(b=>b.addEventListener('click',()=>grMuda(b.dataset.k,+b.dataset.op)));
    atualizaGrupinhos();
  }else if(q.type==='texto'){
    LIC.digitado='';pintarCampo();
    $('#palco').querySelectorAll('.tecla').forEach(b=>b.addEventListener('click',()=>digitarLetra(b.dataset.k)));
  }else if(q.type==='silabas'){
    LIC.sil=[];
    $('#palco').querySelectorAll('.chip').forEach(b=>b.addEventListener('click',()=>{
      if(LIC.conferido)return;
      LIC.sil.push(b.dataset.s);b.classList.add('usado');b.disabled=true;nota(720,0,.06,.05);atualizaSilabas();}));
    const ap=$('#sil-apaga');if(ap)ap.addEventListener('click',()=>{
      if(LIC.conferido||!LIC.sil.length)return;
      const u=LIC.sil.pop();
      const c=Array.prototype.slice.call($('#palco').querySelectorAll('.chip.usado')).filter(x=>x.dataset.s===u).pop();
      if(c){c.classList.remove('usado');c.disabled=false;}
      nota(420,0,.06,.05);atualizaSilabas();});
    atualizaSilabas();
  }else if(q.type==='dinheiro'){
    LIC.din={};
    $('#palco').querySelectorAll('.ced').forEach(b=>b.addEventListener('click',()=>{
      const v=b.dataset.v;LIC.din[v]=(LIC.din[v]||0)+1;nota(700,0,.06,.05);atualizaDinheiro();}));
    const lim=$('#limpa-din');if(lim)lim.addEventListener('click',()=>{LIC.din={};atualizaDinheiro();});
    atualizaDinheiro();
  }else{
    pintarCampo();
    $('#palco').querySelectorAll('.tecla').forEach(b=>b.addEventListener('click',()=>digitar(b.dataset.k)));
  }
  /* ocioso: depois de 20 s sem resposta, uma única frase tranquila (no máximo uma a cada 5 minutos), nunca cobra */
  clearTimeout(LIC.tOcioso);
  LIC.tOcioso=setTimeout(()=>{
    const el=$('#fala-ocioso');
    if(!el||LIC.conferido||LIC.etapa!=='questao'||Date.now()-(falaDe.ultimoOcioso||0)<300000)return;
    falaDe.ultimoOcioso=Date.now();el.textContent=falaDe('ocioso');el.hidden=false;
  },20000);
  if(ehF78()||q.ouvir)falarDepois(420,q.ouvir||q.prompt,q.lang);
  /* já deixa pronto o áudio da próxima pergunta (baixa e decodifica enquanto a criança responde) */
  const prox=LIC.qs[LIC.i+1];
  if(prox)audioPrecarregarTexto(prox.ouvir||prox.prompt,prox.lang);
}
const shufA=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
function barraMissao(){
  const m=LIC.miss,cap=LIC.cap;if(!m)return '';
  const ic=ITENS[(cap&&cap.item)||'estrela'];
  let its='';
  for(let i=0;i<LIC.base;i++)its+='<span class="it'+(i<LIC.acertos?' on':'')+'">'+ic+'</span>';
  return '<div class="missao"><div class="m-txt"><b>'+m.t+'</b><small>'+LIC.acertos+' de '+LIC.base+'</small></div>'+
    '<div class="itens">'+its+'</div></div>';
}
function blocosHTML(q){
  const m=q.max||{c:9,d:9,u:9};
  let h='<div class="md-legenda">'+CUBO+' 1 cubinho vale <b>1</b> &nbsp;·&nbsp; '+BARRA+' 1 barrinha vale <b>10</b>'+
    (m.c!==0?' &nbsp;·&nbsp; 1 placa vale <b>100</b>':'')+'</div><div class="dourado-linhas">';
  [['c','centena · 100'],['d','dezena · 10'],['u','unidade · 1']].forEach(col=>{
    if(m[col[0]]===0)return;
    h+='<div class="linha-md"><div class="cabeca-md"><span class="rot-md">'+col[1]+'</span>'+
       '<b class="conta-md" id="n-'+col[0]+'">0</b></div>'+
       '<div class="corpo-md"><div class="pilha" id="p-'+col[0]+'"></div>'+
       '<div class="bts"><button class="md-bt" data-k="'+col[0]+'" data-op="-1" aria-label="tirar">−</button>'+
       '<button class="md-bt mais" data-k="'+col[0]+'" data-op="1" aria-label="pôr">+</button></div></div></div>';
  });
  return h+'</div><div class="visor"><b id="visor-n">0</b><small id="visor-txt">monte o número</small></div>';
}
/* tocar num quadradinho do material dourado o marca como contado (só ajuda a contar: não vale ponto e não muda a resposta) */
document.addEventListener('click',e=>{
  const q=e.target&&e.target.closest?e.target.closest('svg.md rect.q'):null;
  if(!q||q.closest('.md-legenda'))return;
  q.classList.toggle('contado');
  const caixa=q.closest('.dourado-fig,.pilha,.corpo-md')||q.closest('svg').parentNode;
  if(!caixa)return;
  const raiz=q.closest('.dourado-fig')||q.closest('.dourado-linhas')||caixa;
  const n=raiz.querySelectorAll('svg.md rect.q.contado').length;
  let c=raiz.querySelector('.md-contagem');
  if(!c){c=document.createElement('div');c.className='md-contagem';c.setAttribute('role','status');raiz.appendChild(c);}
  c.textContent=n?('Contados: '+n):'';
  if(n)nota(560+Math.min(n,20)*14,0,.05,.04);
});
function atualizaBlocos(){
  const md=LIC.md;
  const mc=document.querySelector('.md-contagem');if(mc)mc.textContent='';
  const pc=$('#p-c'),pd=$('#p-d'),pu=$('#p-u');
  if(pc)pc.innerHTML=PLACA.repeat(md.c);
  if(pd)pd.innerHTML=BARRA.repeat(md.d);
  if(pu)pu.innerHTML=CUBO.repeat(md.u);
  ['c','d','u'].forEach(k=>{const e=$('#n-'+k);if(e)e.textContent=md[k];});
  const tot=md.c*100+md.d*10+md.u;
  const vn=$('#visor-n');if(vn)vn.textContent=tot;
  const vt=$('#visor-txt');
  if(vt)vt.textContent=(md.c?md.c+' centena'+(md.c>1?'s':'')+' ':'')+(md.d?md.d+' dezena'+(md.d>1?'s':'')+' ':'')+
    (md.u?md.u+' unidade'+(md.u>1?'s':''):'')||'monte o número';
  LIC.resp=String(tot);
  if(!LIC.conferido)$('#acao').disabled=(tot===0);
}
function mdMuda(k,dl){
  if(LIC.conferido)return;
  const m=LIC.qs[LIC.i].max||{c:9,d:9,u:9};
  const md=LIC.md;
  if(dl<0){md[k]=Math.max(0,md[k]-1);nota(420,0,.06,.05);}
  else{
    if(md[k]<9){md[k]++;nota(720,0,.06,.05);}
    else if(k==='u'&&m.d>0){md.u=0;md.d=Math.min(9,md.d+1);trocaAviso('10 unidades viraram 1 dezena!');}
    else if(k==='d'&&m.c>0){md.d=0;md.c=Math.min(9,md.c+1);trocaAviso('10 dezenas viraram 1 centena!');}
  }
  atualizaBlocos();
}
function trocaAviso(txt){
  somVida();falar(txt);
  const v=$('#visor-txt');if(!v)return;
  const el=document.createElement('div');el.className='troca';el.textContent=txt;
  $('#palco').appendChild(el);setTimeout(()=>el.remove(),2200);
}
const pick2=a=>a[Math.floor(Math.random()*a.length)];
/* a regrinha principal da fase, tirada da própria aula */
function lembreteDaAula(l){
  const ps=passosDe(l);
  if(!ps||!ps.length)return '';
  /* o último passo é sempre o "Pra não esquecer" */
  let p=ps[ps.length-1];
  if(!p||!p.c)p=ps[0];
  let t=String(p.c).replace(/<ol[\s\S]*?<\/ol>/g,' ').replace(/<[^>]+>/g,m=>/^<\/?b>$/.test(m)?m:' ');
  t=t.replace(/\s+/g,' ').trim();
  if(t.length<12)return '';
  if(t.length>210)t=t.slice(0,207).replace(/\s\S*$/,'')+'...';
  return t;
}
/* ajuda da PERGUNTA (do gerador, não da fase): antes de responder só o caminho; depois de um erro, o caminho e a resposta */
function dicaDaPergunta(q){
  const h=ajudaDe(q);
  return htmlSeguro(h.metodo,400)+(LIC.conferido&&h.resposta?' <b>'+htmlSeguro(h.resposta,200)+'</b>':'');
}
function mostrarDica(){
  /* No modo fácil a dica é agendada com 700ms de atraso depois de um erro.
     Se a criança tocar em "Continuar" (ou fechar a fase) nesse meio tempo,
     LIC.i já avançou e LIC.qs[LIC.i] vem undefined — dava TypeError e a dica sumia.
     Agora só mostra se ainda houver pergunta na tela. */
  if(LIC.etapa!=='questao')return;
  sfx('dica');
  const q=LIC.qs[LIC.i];
  const cx=$('#caixa-dica');
  if(!q||!cx)return;
  const txt=dicaDaPergunta(q),hq=ajudaDe(q);
  cx.innerHTML='<div class="mini-tuco">'+guiaAvatar('p04')+'</div><div><span class="tit">Como fazer</span>'+txt+
    '<button class="mais-ajuda" id="mais-ajuda">Ainda não entendi</button></div>';
  cx.hidden=false;LIC.dica=1;
  $('#dica').style.display='none';
  /* método e resposta são DOIS clipes em fila (nunca um texto colado: o cortador de quadros tiraria a pontuação entre eles) */
  falar(LIC.conferido&&hq.resposta?[hq.metodo,hq.resposta]:hq.metodo);
  const ma=$('#mais-ajuda');if(ma)ma.addEventListener('click',ajudaForte);
  $('.lc-corpo').scrollTo(0,$('.lc-corpo').scrollHeight);
}
function ajudaForte(){
  const q=LIC.qs[LIC.i];if(!q)return;
  LIC.dica=2;
  const cx=$('#caixa-dica');
  let msg='';
  const mv=typeof verbosAjuda==='function'?verbosAjuda(q):'';
  if(mv){msg=mv;}
  else if(q.type==='mc'){
    const errs=$('#palco').querySelectorAll('.alt');
    let tirados=0;
    errs.forEach(b=>{
      const v=q.options[+b.dataset.v];
      if(v!==q.answer&&tirados<Math.max(1,q.options.length-2)&&!b.classList.contains('fora')){
        b.classList.add('fora');b.disabled=true;tirados++;}
    });
    msg='Tirei '+tirados+' resposta'+(tirados>1?'s':'')+' errada'+(tirados>1?'s':'')+'. Agora escolha entre as que sobraram.';
  }else if(q.type==='blocos'){
    const n=+q.answer,c=Math.floor(n/100),d=Math.floor((n%100)/10);
    LIC.md={c:c,d:d,u:0};atualizaBlocos();
    msg='Já coloquei as placas e as barrinhas para você. Agora complete só os <b>cubinhos</b>.';
  }else if(q.type==='fracao'){
    LIC.frac=[];for(let i=0;i<(+q.answer)-1;i++)LIC.frac[i]=true;atualizaFracao();
    msg='Pintei quase tudo. Falta pintar <b>1 parte</b>.';
  }else if(q.type==='grupinhos'){
    LIC.gr={g:q.alvoG,p:0};atualizaGrupinhos();
    msg='Já montei os grupos. Agora coloque <b>'+q.alvoP+'</b> em cada um.';
  }else if(q.type==='texto'||q.type==='input'){
    const a=String(q.answer);
    msg='A resposta começa com <b>'+a.slice(0,1)+'</b> e tem <b>'+a.length+'</b> '+(a.length>1?'caracteres':'caractere')+'.';
  }else if(q.type==='silabas'){
    msg='A primeira sílaba é <b>'+String(q.answer).slice(0,2)+'</b>.';
  }else msg='Leia devagar e tente de novo. Você consegue.';
  const hq=ajudaDe(q),falas=[];
  if(hq.resposta&&LIC.conferido){falas.push(hq.resposta);msg='<b>'+htmlSeguro(hq.resposta,200)+'</b> '+msg;}
  falas.push(msg);
  cx.innerHTML='<div class="mini-tuco">'+guiaAvatar('p04')+'</div><div><span class="tit">Ajuda extra</span>'+msg+'</div>';
  falar(falas);
}
/* Pergunta irmã: mesma habilidade (mesmo gerador) com outros números ou palavras. Nunca igual a uma que a criança já viu na rodada.
   Se o gerador só sabe fazer aquela pergunta (Português com geradores de 1 pergunta), tenta os outros geradores da mesma fase, depois
   os das fases já vistas. Sem nenhuma irmã possível devolve null e quem chamou repete a original. */
function irmaDe(q){
  if(q.__item||q.__aquec||(LIC.rev&&typeof q.__mk!=='function'))return null;   /* item do caderno: é a própria pergunta que volta amanhã */
  const vistos=new Set(LIC.qs.map(x=>x.prompt+'|'+x.answer));
  const serve=(c,tipo)=>c&&typeof c==='object'&&c.prompt!==undefined&&!vistos.has(c.prompt+'|'+c.answer)&&(!tipo||c.type===tipo);
  const tenta=(mk,n,tipo)=>{for(let t=0;t<n;t++){let c;try{c=mk();}catch(e){continue;}if(serve(c,tipo)){c.__mk=mk;return c;}}return null;};
  const l=LIC.l,fases=(l&&l.makers)?l.makers:[];
  let c=null;
  if(typeof q.__mk==='function')c=tenta(q.__mk,30,q.type)||tenta(q.__mk,10,null);
  for(const tipo of [q.type,null]){
    if(c)break;
    for(const mk of shufA(fases)){c=tenta(mk,8,tipo);if(c)break;}
  }
  if(!c&&typeof reforco==='function'&&l){
    const ex=reforco(l);
    for(let t=0;t<40&&!c&&ex.length;t++)c=tenta(pick2(ex),1,t<20?q.type:null);
  }
  if(!c)return null;
  c.__rep=true;c.__irma=true;c.reforco=true;
  return c;
}
/* quem fala: o guia da matéria (Teo, Rufa, Otto); Capi entra depois de dois erros seguidos (calma, sem pressa) */
const guiaDaMateria=()=>(PLANETAS[MATERIA]||PLANETAS.mat).guia;
/* o rosto do painel de feedback é o personagem escolhido (ele comemora com a criança). A fala só tem a marca do guia (Teo, Rufa, Otto)
   quando o personagem escolhido É esse guia; senão vem do banco geral, para o rótulo e o rosto serem sempre do mesmo personagem. */
function quemReage(){const pa=persAtivo();return pa.tipo==='comp'&&pa.id===guiaDaMateria()?pa.id:'';}
/* fala do acerto, em ordem de peso: sequência de 5 ou de 3, volta depois de erro (irmã), uma rara a cada 8 acertos, rápida, de primeira, o guia */
function falaDoAcerto(q,ms){
  const n=S.acertosTotal||0;
  if(LIC.combo>=5&&LIC.combo%5===0)return falaDe('sequencia5');
  if(LIC.combo===3)return falaDe('sequencia3');
  if(q.__irma)return falaDe('recuperou');
  if(n>0&&n%8===0)return falaDe('acerto.rara');
  if(ms&&ms<2500&&!q.__rep&&LIC.combo>1)return falaDe('rapida');
  if(!q.__rep&&!LIC.dica&&LIC.acertos===1)return falaDe('primeira');
  return falaDe('acerto',quemReage());
}
function falaDoErro(q){
  if(q&&(q.__rep&&!q.__irma))return falaDe('erroIgual');
  return falaDe('erro',(LIC.errosSeguidos||0)>=2?'capi':(quemReage()||'bobby'));
}
/* quem aparece em cada lugar da fase (rótulo e rosto sempre do mesmo personagem):
   história e aula são do Bobby ("Bobby precisa de você", "Bobby explica"): rosto do Bobby, com o companheiro escolhido ao lado, menor;
   pergunta, feedback e ajuda são do guia da matéria (Teo, Rufa, Otto): rosto do guia; o companheiro fica na bolha, como amigo. */
function guiaAvatar(pose){const g=guiaDaMateria(),id=ativo(g+'-'+pose)?g+'-'+pose:g+'-p01';return imgArte(id,{cls:'mascote comp avatar guia-av',alt:PLANETAS[MATERIA].guiaNome});}
function acompanhanteHTML(){const pa=persAtivo();return pa.tipo==='comp'?'<span class="acompanhante">'+imgArte(pa.id+'-p01',{alt:pa.n+' acompanha'})+'</span>':'';}
/* troca a pose do guia na hora (mesma tarefa do toque): p02 comemora no acerto, p04 pensa na pergunta e no erro (nunca triste) */
function guiaPose(pose){
  const i=$('#palco .guia-img'),id=PLANETAS[MATERIA].guia+'-'+pose;
  if(i&&ativo(id))i.src=ARTE_BASE+ativo(id)[0];
}
function conferir(){
  const q=LIC.qs[LIC.i];LIC.conferido=true;
  /* escolha: compara o texto exato da opcao (Lívia e lívia são opções diferentes de propósito);
     o resto passa por acertou(), que aceita 1,5 e 1.5 e ignora acento e maiúscula na digitação */
  const okV=typeof verbosAcertou==='function'?verbosAcertou(q):undefined;
  const ok=okV!==undefined?okV:(q.type==='mc'?String(LIC.resp)===String(q.answer):acertou(LIC.resp,q.answer));
  const primeira=!q.__rep;
  /* no ligar, quem vai para o caderno, para a revisão espaçada e para a pergunta irmã é a pergunta de origem (ligar é o jeito de responder) */
  const qb=typeof perguntaBase==='function'?perguntaBase(q):q;
  const ms=LIC.tQ?Date.now()-LIC.tQ:0;
  LIC.respondidas=(LIC.respondidas||0)+1;
  /* ligar: cada par conta como a sua pergunta de origem (certo ou errado), no histórico, no caderno, na revisão e na irmã */
  const origens=typeof origensDoLigar==='function'?origensDoLigar(q):null,certosLig=origens?ligarParesCertos(q):null;
  const erradas=origens?origens.filter((o,i)=>!certosLig[i]):[qb];
  if(primeira){if(origens)origens.forEach((o,i)=>LIC.hist.push({q:o,ok:!!certosLig[i],ms:ms,dica:LIC.dica||0}));else LIC.hist.push({q:qb,ok:ok,ms:ms,dica:LIC.dica||0});}
  const pe=$('#pe');pe.classList.add('mostra');
  $('#dica').style.display='none';
  if(typeof temTelaPropria==='function'&&temTelaPropria(q))verbosConferir(q,ok);
  else if(q.type==='mc'){
    $('#palco').querySelectorAll('.alt').forEach(b=>{
      const v=q.options[+b.dataset.v];b.disabled=true;b.classList.remove('sel');
      if(v===q.answer){b.classList.add('certa');b.insertAdjacentHTML('beforeend','<span class="sinal">'+IC.certo+'</span>');}
      else if(v===LIC.resp){b.classList.add('errada');b.insertAdjacentHTML('beforeend','<span class="sinal">'+IC.refazer+'</span>');}
    });
  }
  /* diagnóstico de entrada: sem moeda, sem caderno, sem irmã; só anda a escada (interface/relatorio.js) */
  if(LIC.diag&&typeof diagConferir==='function'){diagConferir(q,ok);return;}
  if(ok){
    LIC.acertos++;LIC.combo++;LIC.errosSeguidos=0;guiaPose('p02');regStat(LIC.l.id,'acertos');
    LIC.melhorCombo=Math.max(LIC.melhorCombo,LIC.combo);
    let ganho=ECON.ganhoAcerto,extra='';
    if(LIC.combo>=ECON.sequenciaDe&&LIC.combo%ECON.sequenciaDe===0&&bonusDeComboAtivo()){
      ganho+=ECON.bonusSequencia;extra=' · <b>Bônus!</b> +'+ECON.bonusSequencia;
      if(LIC.vidas<5){LIC.vidas++;extra+=' e +1 coração';somVida();pintarVidas();}
    }
    /* XP nunca diminui; moedas são o saldo que a loja gasta */
    S.xp+=ganho;S.moedas+=ganho;LIC.ganhoFase=(LIC.ganhoFase||0)+ganho;S.acertosTotal=(S.acertosTotal||0)+1;
    S.melhorCombo=Math.max(S.melhorCombo||0,LIC.combo);pe.classList.add('certo');
    if(!temTelaPropria(q)&&typeof hitStop==='function')hitStop(()=>squash($('#palco .alt.certa')));
    $('#selo').innerHTML=MASC(LIC.combo>=3?'radiante':'feliz','avatar');
    const elogio=falaDoAcerto(q,ms);
    $('#fb-t').innerHTML=IC.certo+'<span>'+elogio+'</span>';
    if(ehF78())falar(elogio);
    $('#fb-s').innerHTML='+'+ganho+' moedas'+extra;
    somCerto();somMoeda();
    if(LIC.rev)(origens||[qb]).forEach(tirarErrado);
    if(primeira&&q.__item)revisaoResultado(q.__item,true,LIC.dica||0);
  }else{
    LIC.erros++;LIC.combo=0;LIC.vidas--;LIC.errosSeguidos=(LIC.errosSeguidos||0)+1;guiaPose('p04');regStat(LIC.l.id,'erros');pe.classList.add('errado');
    if(LIC.errosSeguidos>=2){const lm=$('#palco .lembrete');if(lm)lm.open=true;}
    const vaiProCaderno=erradas.length?erradas:[qb];
    vaiProCaderno.forEach(guardarErrado);
    if(!temTelaPropria(q)&&typeof balanca==='function')balanca($('#palco .alt.errada'));
    if(primeira){if(q.__item)revisaoResultado(q.__item,false,0);else vaiProCaderno.forEach(o=>revisaoErro(o));}
    $('#selo').innerHTML=(LIC.errosSeguidos||0)>=2&&ativo('capi-p04')?imgArte('capi-p04',{cls:'mascote comp avatar',alt:'Capi'}):MASC('pensa','avatar');
    const calma=falaDoErro(q);
    $('#fb-t').innerHTML=IC.refazer+'<span>'+escapa(calma)+'</span>';
    if(ehF78())falar(calma);
    /* o erro NÃO repete a mesma pergunta (isso mede memória da resposta): volta uma IRMÃ, do mesmo gerador, com outros números ou palavras,
       2 perguntas depois. O item errado em si já foi para o caderno (guardarErrado) e volta amanhã na revisão espaçada. */
    let voltaIrma=false,voltaIgual=false;
    if(!q.__rep&&LIC.vidas>0){
      /* um erro, uma reaparição (regra de testes/irmas.js): no ligar, a irmã é do primeiro par errado que tenha irmã; os outros pares
         errados já foram para o caderno e para a revisão espaçada logo acima */
      for(const o of vaiProCaderno){
        const irma=irmaDe(o);
        if(irma){LIC.qs.splice(Math.min(LIC.qs.length,LIC.i+3),0,irma);voltaIrma=true;break;}
      }
      if(!voltaIrma){const c=Object.assign({},q);c.__rep=true;LIC.qs.push(c);voltaIgual=true;}
    }
    $('#fb-s').innerHTML=(q.verbo==='ligar'?'Veja as linhas verdes: são as ligações certas.':'A resposta certa é <b>'+htmlSeguro(q.answer,120)+'</b>.')+
      (voltaIrma?' Vamos treinar uma parecida daqui a pouco.':(voltaIgual?' Esta pergunta volta no fim para você tentar de novo.':''));
    somErro();pintarVidas();
    if(ehF78()&&!LIC.dica)LIC.tDica=setTimeout(mostrarDica,700);
  }
  cicloPergunta(q,{ok:ok,ms:ms,dica:LIC.dica||0});
  /* 1G: cada resposta alimenta a habilidade (gerador) de origem; no ligar, cada par conta pela sua pergunta de origem */
  if(typeof adaptRegistrar==='function')(origens||[qb]).forEach((o,i)=>adaptRegistrar(chaveDaPergunta(o)?o:q,origens?!!certosLig[i]:ok,
    {primeira:primeira,irma:!!q.__irma,rev:!!(q.__item||LIC.diaria||q.__aquec)}));
  if(primeira&&(LIC.diaria||q.__aquec)){const st=diaDeStats();st.rev=(st.rev||0)+1;if(ok)st.revAc=(st.revAc||0)+1;}
  pintarTopo();salvar();
  $('#acao').textContent=(LIC.vidas<=0)?'Continuar':(LIC.i+1>=LIC.qs.length?'Terminar':'Continuar');
  /* sem 'continuar por moedas': acabar os corações encerra a rodada com gentileza (ver pintarFim) */
}
function avancar(){
  $('#pe').className='pe';calar();
  /* a dica do modo fácil pode estar agendada: cancelar antes de trocar de pergunta */
  if(LIC.tDica){clearTimeout(LIC.tDica);LIC.tDica=null;}
  if(LIC.vidas<=0){LIC.etapa='fim';pintarLicao();return;}
  LIC.i++;
  if(LIC.i>=LIC.qs.length){LIC.etapa='fim';pintarLicao();return;}
  pintarLicao();
}
function regStat(id,campo){
  S.stats=S.stats||{porLicao:{},dias:{},tempo:0};
  const p=S.stats.porLicao[id]||{acertos:0,erros:0};
  p[campo]=(p[campo]||0)+1;S.stats.porLicao[id]=p;
}
function regFim(){
  S.stats=S.stats||{porLicao:{},dias:{},tempo:0};
  const seg=Math.min(3600,Math.round((Date.now()-(LIC.t0||Date.now()))/1000));
  S.stats.tempo=(S.stats.tempo||0)+seg;
  const dia=diaDeStats();
  dia.fases=(dia.fases||0)+1;dia.seg=(dia.seg||0)+seg;
}
/* o desenho é da etapa: ao concluir a última fase, ele é ganho; antes disso, mostra quanto falta (sem pressão) */
function premioDesenhoHTML(completouMundo){
  const d=desenhoPorId(desenhoIdDe(MATERIA,LIC.u.n));if(!d)return '';
  if(completouMundo){
    const tem=!!ativo(d.id);
    return '<div class="premio" data-materia="'+COD_DESENHO[d.matApp]+'"><div class="mini-desenho">'+
      (tem?imgArte(d.id,{alt:''}):'<span class="des-silhueta">'+imgArte(PLANETAS[d.matApp].img,{})+'</span>')+'</div>'+
      '<div><b>Você ganhou um desenho!</b><span>“'+escapa(d.nome)+'” '+(tem?'já está na sua galeria, pronto para colorir.':'é seu. A imagem chega numa atualização.')+'</span>'+
      '<button class="btn-sec" id="ver-galeria" data-id="'+d.id+'">Ver meus desenhos</button></div></div>';
  }
  const falta=LIC.u.lessons.filter(l=>!S.feitas[l.id]).length;
  if(!falta)return '';
  return '<p class="premio-falta">'+IC.quadro+' '+(falta===1?'Falta 1 fase':'Faltam '+falta+' fases')+' para ganhar o desenho “'+escapa(d.nome)+'”.</p>';
}
function pintarFim(){
  /* diagnóstico: fim próprio, sem estrela, sem moeda e sem número (interface/relatorio.js) */
  if(LIC.diag&&typeof diagFimHTML==='function'){
    $('#vidas').style.visibility='hidden';$('#rever').style.display='none';$('#dica').style.display='none';$('#prog').style.width='100%';
    if(!LIC.encerrado){LIC.encerrado=true;$('#palco').innerHTML=diagFimHTML();salvar();}
    $('#pe').className='pe';$('#acao').textContent='Voltar para o mapa';$('#acao').disabled=false;return;
  }
  const passou=LIC.vidas>0;
  const est=!passou?0:(LIC.erros===0?3:(LIC.erros<=2?2:1));
  $('#vidas').style.visibility='hidden';
  $('#rever').style.display='none';
  $('#dica').style.display='none';
  $('#prog').style.width='100%';
  let completouMundo=false,bloco={contou:false};
  if(passou&&!LIC.fimPago){
    LIC.fimPago=true;
    /* bônus de fase perfeita (+20) e de revisão (+5): soma em XP e em moedas, e entra no placar */
    const bonus=(LIC.erros===0?ECON.bonusFasePerfeita:0)+(LIC.diaria?ECON.bonusRevisao:0);
    S.xp+=bonus;S.moedas+=bonus;LIC.ganhoFase=(LIC.ganhoFase||0)+bonus;
    if(!LIC.rev){const antes=S.feitas[LIC.l.id]||0;if(est>antes)S.feitas[LIC.l.id]=est;}
    regFim();
    completouMundo=!LIC.rev&&mundoCompleto(LIC.u);
    LIC.completouMundo=completouMundo;
  }
  if(!LIC.encerrado){
    LIC.encerrado=true;
    const seg=Math.min(3600,Math.round((Date.now()-(LIC.t0||Date.now()))/1000));
    bloco=concluirBloco({tipo:LIC.tipoBloco||'fase',lic:LIC.l.id,materia:MATERIA,perguntas:LIC.respondidas||0,acertos:LIC.acertos,
      estrelas:est,seg:seg,faseNova:!!LIC.faseNova&&passou,erros:LIC.erros,completouMundo:LIC.completouMundo});
    LIC.bloco=bloco;
    if(LIC.revAgg&&LIC.revAgg.n)registrarEvento('revisao_item',{n:LIC.revAgg.n,ok:LIC.revAgg.ok,
      caixa_antes:LIC.revAgg.antes/LIC.revAgg.n,caixa_depois:LIC.revAgg.depois/LIC.revAgg.n});
    if(passou&&typeof revisaoPosFase==='function')revisaoPosFase(LIC);
    if(passou){confete();somFim();}
    salvar();
  }
  completouMundo=!!LIC.completouMundo;
  const nErr=(S.errados[MATERIA+LIC.u.n]||[]).length;
  /* fase vencida: o fim acontece NO MAPA, ao lado do objeto que acendeu (mesa 03 mudança 9); revisão e "vamos descansar" ficam aqui */
  if(passou&&!LIC.rev&&typeof fimNoMapa==='function'&&!LIC.fimNoMapa){
    LIC.fimNoMapa=true;
    fimNoMapa({ui:LIC.ui,li:LIC.li,est:est,perfeita:LIC.erros===0,acertos:LIC.acertos,base:LIC.base,ganho:LIC.ganhoFase||0,completouMundo:completouMundo,bloco:bloco,
      fala:falaDe(LIC.erros===0?'fasePerfeita':'faseCompleta'),extraHTML:(typeof blocoFimHTML==='function'?blocoFimHTML(bloco):'')});
    pintarTopo();return;
  }
  $('#palco').innerHTML='<div class="fim surge">'+
    MASC(passou?'comemora':'incentiva')+
    '<div class="estrelao acende">'+estrelasSVG(est)+'</div>'+
    '<h2>'+(passou?(LIC.rev?'Revisão concluída!':(LIC.erros===0?'Fase perfeita!':'Fase concluída!'))
      :'Vamos descansar e revisar')+'</h2>'+
    (passou&&!LIC.rev?'<p class="fala-p">'+falaDe(LIC.erros===0?'fasePerfeita':'faseCompleta')+'</p>':'')+
    (passou&&LIC.miss&&LIC.miss.fim?'<p class="fecho">'+LIC.miss.fim+'</p>':'')+
    '<p class="sub">'+(passou?'Você acertou '+LIC.acertos+' de '+LIC.base+' perguntas.'+
        (LIC.rev?(nErr?' Ainda faltam '+nErr+' no caderno de erros. Volte aqui depois.':' Seu caderno de erros deste mundo está limpo!'):'')
      :'Os erros foram para o seu caderno e voltam amanhã na revisão. Seu progresso está guardado. Errar faz parte de aprender.')+'</p>'+
    (completouMundo?'<div class="mundo-ok">'+IC.trofeu+' Etapa '+LIC.u.n+' completa!</div><p class="fala-p">'+falaDe('etapaCompleta')+'</p>':'')+
    (passou&&!LIC.rev?premioDesenhoHTML(completouMundo):'')+
    '<p class="linha-fim">'+LIC.acertos+' de '+LIC.base+' perguntas, '+(LIC.ganhoFase||0)+' moedas</p>'+
    (typeof blocoFimHTML==='function'?blocoFimHTML(bloco):'')+
    '<button class="btn fantasma" id="rever-fim">Rever a aula desta fase</button></div>';
  $('.lc-corpo').scrollTo(0,0);
  /* cerimônia da fase (até 3 s): as estrelas ganhas acendem uma a uma, cada uma com o seu 'ding' */
  if(passou&&!LIC.cerEstrelas){LIC.cerEstrelas=true;for(let i=0;i<est;i++)setTimeout(()=>sfx('estrela',i),400+i*300);}
  /* depois da última fase da etapa: cerimônia da etapa e, se o planeta fechou, a do planeta (cada uma aparece uma vez) */
  if(completouMundo&&passou&&!LIC.rev&&!LIC.cerVista){LIC.cerVista=true;setTimeout(()=>cerimoniasDoFim(LIC.u),1500);}
  $('#rever-fim').addEventListener('click',abrirRevisao);
  if(typeof ligarBlocoFim==='function')ligarBlocoFim(bloco);
  const vg=$('#ver-galeria');if(vg)vg.addEventListener('click',()=>abrirGaleria(vg.dataset.id||true));
  $('#pe').className='pe';
  $('#acao').textContent=passou?'Voltar para o mapa':'Tentar de novo';
  if(!passou&&LIC.rev)$('#acao').textContent='Tentar a revisão de novo';
  $('#acao').disabled=false;
  pintarTopo();
}

