/* ---------- confete ---------- */
function confete(){
  if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  const cv=document.createElement('canvas');cv.className='confete';document.body.appendChild(cv);
  const cx=cv.getContext('2d'),W=cv.width=innerWidth,H=cv.height=innerHeight;
  const css=getComputedStyle(document.body);
  const cores=['--cor-acao','--mat-base','--ing-base','--cor-ainda','--por-base','--cor-ouro'].map(n=>css.getPropertyValue(n).trim()||'orange');
  const ps=Array.from({length:120},()=>({x:W/2+(Math.random()-.5)*W*.5,y:H*.4,
    vx:(Math.random()-.5)*11,vy:-Math.random()*13-4,s:6+Math.random()*7,
    a:Math.random()*6.3,va:(Math.random()-.5)*.3,c:cores[Math.floor(Math.random()*cores.length)]}));
  let t=0;
  (function loop(){
    t++;cx.clearRect(0,0,W,H);
    ps.forEach(p=>{p.vy+=.38;p.x+=p.vx;p.y+=p.vy;p.a+=p.va;
      cx.save();cx.translate(p.x,p.y);cx.rotate(p.a);cx.fillStyle=p.c;
      cx.fillRect(-p.s/2,-p.s/2,p.s,p.s*.6);cx.restore();});
    if(t<155)requestAnimationFrame(loop);else cv.remove();
  })();
}

/* ---------- nome e cor ---------- */
let corEscolhida=CORES[0],criando=false,faixaEscolhida='f78';
function pintarCores(){
  $('#cores').innerHTML=CORES.map(c=>'<button class="cor'+(c===corEscolhida?' on':'')+
    '" data-c="'+c+'" style="background:'+c+'" aria-label="Cor"></button>').join('');
  $('#cores').querySelectorAll('.cor').forEach(b=>b.addEventListener('click',()=>{
    corEscolhida=b.dataset.c;pintarCores();
    $('#masc-modal').style.setProperty('--m1',corEscolhida);
  }));
}
function pedirNome(nova){
  criando=!!nova;
  corEscolhida=nova?CORES[STORE.perfis.length%CORES.length]:perfilAtual().cor;
  $('#masc-modal').innerHTML=MASC('oi');
  $('#masc-modal').style.setProperty('--m1',corEscolhida);
  $('#tt-nome').textContent=nova?'Novo jogador':'Trocar o nome';
  $('#txt-nome').textContent=nova?'Escolha um nome e a cor do seu Bobby.':'Você pode mudar seu nome e sua cor.';
  pintarCores();faixaEscolhida=nova?'f78':(S.faixa||'f78');pintarNiveis();
  $('#modal').classList.add('on');
  const c=$('#campo-nome');c.value=criando?'':(perfilAtual().nome||'');
  setTimeout(()=>c.focus(),80);
}
function pintarNiveis(){
  const ns=[['f78','7 a 8 anos','tudo lido em voz alta e menos opções'],
            ['f910','9 a 10 anos','ritmo normal'],
            ['f1112','11 a 12 anos','sem ajudas extras']];
  $('#niveis').innerHTML=ns.map(n=>'<button class="nv'+(n[0]===faixaEscolhida?' on':'')+'" data-n="'+n[0]+'"><b>'+n[1]+'</b><span>'+n[2]+'</span></button>').join('');
  $('#niveis').querySelectorAll('.nv').forEach(b=>b.addEventListener('click',()=>{faixaEscolhida=b.dataset.n;pintarNiveis();}));
}
function salvarNome(){
  const n=($('#campo-nome').value.trim()||'Jogador '+(STORE.perfis.length+1)).slice(0,18);
  $('#modal').classList.remove('on');
  if(criando){novoPerfil(n,corEscolhida);return;}
  STORE.perfis[STORE.atual].nome=n;
  STORE.perfis[STORE.atual].cor=corEscolhida;
  const mudouFaixa=S.faixa!==faixaEscolhida;
  S.nome=n;S.faixa=faixaEscolhida;salvar();renderTrilha();
  if(mudouFaixa)registrarEvento('config_mudou',{chave:'faixa'});
}

/* ---------- ligações ---------- */
$('#acao').addEventListener('click',()=>{
  calar();
  if(LIC.etapa==='historia'){LIC.etapa='aula';LIC.passo=0;pintarLicao();return;}
  if(LIC.etapa==='aula'){
    const ps=passosDe(LIC.l);
    if(LIC.passo<ps.length-1){LIC.passo++;somPasso();}
    else LIC.etapa='questao';
    pintarLicao();return;
  }
  if(LIC.etapa==='fim'){
    if(LIC.vidas<=0){if(LIC.rev)abrirRevisaoMundo(LIC.ui);else abrirLicao(LIC.ui,LIC.li);}
    else fecharLicao();
    return;
  }
  if(!LIC.conferido)conferir();else avancar();
});
$('#fechar').addEventListener('click',fecharLicao);
$('#rever').addEventListener('click',abrirRevisao);
$('#dica').addEventListener('click',mostrarDica);
$('#fechar-rev').addEventListener('click',()=>{calar();$('#revisao').classList.remove('on');});
$('#som').addEventListener('click',()=>{S.som=!S.som;salvar();pintarTopo();if(S.som)somCerto();else calar();});
$('#salvar-nome').addEventListener('click',salvarNome);
$('#pular-nome').addEventListener('click',()=>{$('#modal').classList.remove('on');if(criando&&STORE.atual<0)telaPerfis();});
$('#campo-nome').addEventListener('keydown',e=>{if(e.key==='Enter')salvarNome();});
$('#troca-materia').addEventListener('click',telaMaterias);
$('#fechar-gal').addEventListener('click',fecharGaleria);
document.addEventListener('keydown',e=>{
  if(!$('#licao').classList.contains('on')||LIC.etapa!=='questao')return;
  if($('#revisao').classList.contains('on'))return;
  const q=LIC.qs[LIC.i];
  if(!LIC.conferido){
    if(q.type==='mc'&&/^[1-4]$/.test(e.key)){
      const b=$('#palco').querySelector('.alt[data-v="'+(+e.key-1)+'"]');if(b)b.click();return;
    }
    if(q.type==='input'){
      if(/^[0-9]$/.test(e.key)){digitar(e.key);return;}
      if(e.key===','||e.key==='.'){digitar(',');return;}
      if(e.key==='Backspace'){digitar('apagar');return;}
    }
  }
  if(e.key==='Enter'&&!$('#acao').disabled)$('#acao').click();
});
lerStore();
CAP_ATUAL=MATERIAS.mat.caps();MISS_ATUAL=MATERIAS.mat.miss();
if(STORE.perfis.length===0){telaPerfis();setTimeout(()=>pedirNome(true),300);}
else if(STORE.perfis.length===1&&STORE.atual>=0){usarPerfil(STORE.atual);}
else{telaPerfis();if(STORE.atual>=0){S=estadoDe(STORE.perfis[STORE.atual].dados);S.nome=STORE.perfis[STORE.atual].nome;garantirDia();}
  CAP_ATUAL=MATERIAS.mat.caps();MISS_ATUAL=MATERIAS.mat.miss();renderTrilha();}
iniciarCiclo();
audioIniciar();


