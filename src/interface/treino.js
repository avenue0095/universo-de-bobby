/* ---------- treinar por tema (todas as matérias) e programa de 20 dias ----------
   Fora da trilha: 10 perguntas de um tema, o que a criança ainda não domina primeiro (menor domínio na adaptação), com moeda por acerto
   como numa fase, sem estrela e sem trancar nada. "Indicado" = tema da faixa da criança. */
const TREINO={n:10};
function geradoresDoTema(t){
  const mk=[];
  (t.f||[]).forEach(id=>{const x=licaoPorId(id);if(x)x.l.makers.forEach(m=>{if(mk.indexOf(m)<0)mk.push(m);});});
  if(t.g)t.g().forEach(m=>{if(mk.indexOf(m)<0)mk.push(m);});
  return mk;
}
/* ordem do treino: menor domínio primeiro (o que ainda não acertou vem antes), dominado por último; sem 3 iguais seguidos */
function perguntasDoTreino(t,n){
  n=n||TREINO.n;
  /* o ligar junta 3 perguntas em 1: gera um pouco mais até a rodada ter as n perguntas */
  let r=[];for(let k=n;k<=n+30&&r.length<n;k+=3){r=perguntasCruas(t,k);r=typeof aplicarVerbos==='function'?aplicarVerbos(r,{id:'treino',makers:geradoresDoTema(t)}):r;}
  return r.slice(0,n);
}
function perguntasCruas(t,n){
  const mks=geradoresDoTema(t),dia=hoje();
  const pk=mk=>{const k=chaveDoGerador(mk),h=k&&S.habil&&S.habil[k];return h?(h.dom?2:pAtual(h,dia)):-.1+Math.random()*.05;};
  const ord=mks.map(m=>({m:m,p:pk(m)})).sort((a,b)=>a.p-b.p).map(x=>x.m);
  const out=[],vistos=new Set();let i=0,guard=0;
  while(out.length<(n||TREINO.n)&&guard++<200&&ord.length){
    const mk=ord[i%Math.min(ord.length,Math.max(3,Math.ceil(ord.length/2)))];i++;
    let q;try{q=mk();}catch(e){continue;}
    if(!q||vistos.has(q.prompt+'|'+q.answer))continue;
    if(ord.length>1&&out.length>=2&&out[out.length-1].__mk===mk&&out[out.length-2].__mk===mk)continue;
    q.__mk=mk;vistos.add(q.prompt+'|'+q.answer);out.push(q);
  }
  return out;
}
const temasDe=m=>(TEMAS[m]||[]).filter(t=>geradoresDoTema(t).length);
function telaTreino(m){
  m=m||MATERIA;
  const ts=temasDe(m);
  let h='<div class="folha-in treino"><h2>Treinar por tema</h2><p class="perfis-sub">Escolha um assunto e faça 10 perguntas. O que você ainda está aprendendo vem primeiro.</p>'+
    '<div class="abas" role="tablist">'+['mat','pt','en'].map(k=>'<button class="aba'+(k===m?' on':'')+'" data-treino-m="'+k+'">'+MATERIAS[k].n+'</button>').join('')+'</div><div class="temas">';
  ts.forEach(t=>{const ind=t.faixa.indexOf(S.faixa)>=0;
    h+='<button class="tema'+(ind?' indicado':'')+'" data-tema="'+t.id+'"><b>'+escapa(t.n)+'</b>'+(ind?'<span class="selo-ind">indicado</span>':'')+'</button>';});
  h+='</div><div class="folha-bts"><button class="btn-sec" id="treino-fecha">Voltar</button></div></div>';
  abrirFolha(h);
  $('#folha').querySelectorAll('[data-treino-m]').forEach(b=>b.addEventListener('click',()=>telaTreino(b.dataset.treinoM)));
  $('#folha').querySelectorAll('[data-tema]').forEach(b=>b.addEventListener('click',()=>{fecharFolha();abrirTreino(m,b.dataset.tema);}));
  $('#treino-fecha').addEventListener('click',fecharFolha);
}
function abrirTreino(m,id,doPrograma){
  /* treino aberto fora do programa de 20 dias nunca marca dia do programa */
  if(!doPrograma)S.programaAtual=null;
  const t=(TEMAS[m]||[]).filter(x=>x.id===id)[0];if(!t)return;
  if(typeof portaoDeAcesso==='function'&&!portaoDeAcesso())return;
  if(MATERIA!==m){usarMateria(m);if(typeof fecharFolha==='function')fecharFolha();}
  const qs=perguntasDoTreino(t);if(!qs.length)return;
  garantirDia();
  const u=UNITS[0];
  const falso={id:'treino',glyph:'★',title:'Treinar: '+t.n,teach:{ideia:'Treino de '+t.n+'. São '+qs.length+' perguntas, e o que você ainda está aprendendo vem primeiro.',
    exemplo:'Errou? Sem problema: a pergunta parecida volta logo depois.',dica:'Treinar um pouco todo dia vale mais do que muito de uma vez.'}};
  LIC={ui:0,li:-1,u:u,l:falso,qs:qs,base:qs.length,i:0,passo:0,vidas:5,erros:0,acertos:0,
       combo:0,melhorCombo:0,etapa:'questao',resp:null,digitado:'',conferido:false,dica:false,rev:true,treino:t.id,
       md:{c:0,d:0,u:0},miss:{t:'Treinar: '+t.n,abre:'',fim:'Treino concluído!'},
       cap:null,t0:Date.now(),tipoBloco:'treino',respondidas:0,ganhoFase:0,hist:[],tQ:0};
  registrarEvento('bloco_inicio',{tipo:'treino',lic:'treino',materia:m});
  $('#licao').classList.add('on');$('#revisao').classList.remove('on');
  $('#licao').style.setProperty('--ub','var(--cor-acao)');
  document.body.style.overflow='hidden';
  pintarLicao();
}
/* programa de 20 dias (área do responsável): um tema por dia, na ordem pedagógica; o dia fica feito quando o treino dele foi feito */
function programaHTML(){
  const m=MATERIA,dias=PROGRAMA20[m]||[],feitos=(S.programa&&S.programa[m])||[];
  if(!dias.length)return '';
  const prox=dias.findIndex((x,i)=>feitos.indexOf(i)<0);
  let h='<h2 class="sec">Programa de 20 dias (opcional)</h2><p class="galeria-intro">Um plano curto e fechado para '+MATERIAS[m].n+
    ': um tema por dia, uns 5 minutos. Não substitui o mapa. '+feitos.length+' de 20 dias feitos.</p><ol class="programa">';
  dias.forEach((id,i)=>{const t=(TEMAS[m]||[]).filter(x=>x.id===id)[0];if(!t)return;
    h+='<li class="'+(feitos.indexOf(i)>=0?'ok':'')+(i===prox?' agora':'')+'"><span>Dia '+(i+1)+': '+escapa(t.n)+'</span>'+(i===prox?'<button class="btn-sec" data-prog="'+i+'">Começar</button>':'')+'</li>';});
  return h+'</ol>';
}
function ligarPrograma(){
  $('#perfil').querySelectorAll('[data-prog]').forEach(b=>b.addEventListener('click',()=>{
    const i=+b.dataset.prog,id=PROGRAMA20[MATERIA][i];
    S.programaAtual={m:MATERIA,i:i};fecharPerfil2();abrirTreino(MATERIA,id,true);
  }));
}
/* fim do treino: marca o dia do programa (se veio dele) */
function treinoConcluido(){
  const pa=S.programaAtual;
  if(pa&&LIC.treino&&PROGRAMA20[pa.m]&&PROGRAMA20[pa.m][pa.i]===LIC.treino){
    S.programa=S.programa||{};const l=S.programa[pa.m]||(S.programa[pa.m]=[]);if(l.indexOf(pa.i)<0)l.push(pa.i);
    S.programaAtual=null;
  }
}
