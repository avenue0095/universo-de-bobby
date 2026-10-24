/* ---------- ciclo diário: dia vivo, meta, baú, missões, bilhete e ponto de parada ----------
   docs/FASE-2-especificacao.md, seção 5. Lógica sem desenho (as telas ficam em ciclo-ui.js).
   Princípios que valem para cada texto e cada regra daqui:
   - o Bobby incentiva e NUNCA culpa, cobra ou fica triste; nada de contagem regressiva nem "você vai perder";
   - a meta é contada em PERGUNTAS (ações), não em minutos de tela; o relógio só calibra;
   - o baú não tem sorteio: o que vem em cada dia é conhecido antes de abrir; nada disto é vendido. */
const CICLO={segPorPergunta:15,minBloco:6,minAmostras:50,segMin:8,segMax:40,maxAmostras:120};

/* ---------- meta em perguntas ---------- */
function segPorPergunta(){
  const a=(S.stats.amostras||[]);
  if(a.length<CICLO.minAmostras)return CICLO.segPorPergunta;
  const o=a.slice().sort((x,y)=>x-y),med=o[Math.floor(o.length/2)];
  return Math.min(CICLO.segMax,Math.max(CICLO.segMin,med));
}
const perguntasMeta=()=>Math.max(1,Math.round(S.config.metaMin*60/segPorPergunta()));

/* ---------- recompensas do baú (tabela dos dias 1 a 30, só cosméticos) ----------
   k: adesivo | moedas | ornamento | roupa-p | roupa-g | roupa-ex | medalha | pose | moldura | trilha */
const ADESIVOS=['Primeira visita','Estrela cadente','Cometa curioso','Lua sorridente','Foguetinho','Planeta de anéis','Aurora',
  'Nave exploradora','Satélite amigo','Galáxia espiral','Urso astronauta','Meteoro veloz','Sol dourado','Nebulosa rosa',
  'Constelação do Urso','Estrela do mapa','Lanterna espacial','Astronauta mirim','Cristal azul','Planeta verde',
  'Cometa de gelo','Anel prateado','Lua cheia','Foguete listrado','Estrela do norte','Mapa do tesouro','Bússola',
  'Estrela do mar','Vaga-lume','Constelação do mês'];
const ORNAMENTOS=['Carimbo de estrela','Carimbo de lua','Carimbo de foguete','Carimbo de planeta','Carimbo de cometa',
  'Moldura de estrelas','Borda de nuvens','Faixa de constelação','Carimbo de nave','Carimbo de sol'];
const BAU_TABELA={
  1:[['adesivo','Primeira visita']],2:[['moedas',10]],3:[['adesivo'],['medalha','3 dias']],4:[['ornamento']],5:[['roupa-p']],
  6:[['moedas',10]],7:[['medalha','1 semana'],['pose','Pose de comemoração'],['moldura','Moldura de perfil: semana']],
  8:[['adesivo']],9:[['ornamento']],10:[['roupa-p']],11:[['moedas',15]],12:[['adesivo']],13:[['ornamento']],
  14:[['medalha','2 semanas'],['roupa-g'],['adesivo','Adesivo raro: cometa dourado']],
  15:[['moedas',15]],16:[['adesivo']],17:[['ornamento']],18:[['moedas',15]],19:[['roupa-p']],20:[['adesivo']],
  21:[['medalha','3 semanas'],['trilha','Trilha de brilho no mapa']],22:[['moedas',20]],23:[['ornamento']],24:[['adesivo']],
  25:[['roupa-p']],26:[['moedas',20]],27:[['ornamento']],28:[['medalha','4 semanas'],['pose','Pose de explorador']],29:[['adesivo']],
  30:[['medalha','do mês'],['roupa-ex'],['moldura','Moldura dourada'],['adesivo','Constelação']]
};
/* recompensa do dia n (valor da ofensiva). Depois do dia 30: a cada 10 dias um adesivo da Constelação;
   nos outros dias repete o ciclo da tabela, e o que a criança já tem vira +20 moedas. */
function recompensaDoDia(n){
  n=Math.max(1,Math.floor(n||1));
  if(n>30&&n%10===0)return [['adesivo','Constelação do mês '+Math.ceil(n/30)+', dia '+n]];
  const base=BAU_TABELA[n>30?((n-1)%30)+1:n];
  return base.map(x=>x.slice());
}
const ROTULO_BAU={adesivo:'um adesivo',moedas:'moedas',ornamento:'um ornamento de colorir',
  'roupa-p':'uma peça para o Bobby','roupa-g':'uma peça para o Bobby','roupa-ex':'uma peça exclusiva',
  medalha:'uma medalha',pose:'uma pose nova',moldura:'uma moldura',trilha:'uma trilha de brilho'};
/* o que aparece FECHADO no baú de amanhã: só a categoria principal */
function categoriaDoBau(n){
  const it=recompensaDoDia(n);
  const principal=it.find(x=>x[0]==='medalha')||it[0];
  return ROTULO_BAU[principal[0]]||'uma surpresa boa';
}
function nomeDe(kind,n){
  const dia=Math.max(1,n);
  if(kind==='adesivo')return ADESIVOS[(dia-1)%ADESIVOS.length];
  if(kind==='ornamento')return ORNAMENTOS[(dia-1)%ORNAMENTOS.length];
  return kind;
}
const COLECAO_DE={adesivo:'adesivos',ornamento:'ornamentos',medalha:'medalhas',pose:'poses',moldura:'molduras',trilha:'trilhas'};
/* peças do guarda-roupa por faixa de preço: pequena, maior e exclusiva (a mais cara que a criança ainda não tem) */
function pecaParaBau(tam){
  const todas=[];
  /* só peça com arte nova entra no baú: dar o que a criança não consegue ver seria promessa vazia */
  ['chapeu','rosto','pescoco'].forEach(sl=>Object.keys(PECAS[sl]||{}).forEach(id=>{if(PECAS[sl][id].arte)todas.push({id:id,n:PECAS[sl][id].n,p:PECAS[sl][id].p});}));
  const livres=todas.filter(x=>!temItem(x.id)).sort((a,b)=>a.p-b.p||(a.id<b.id?-1:1));
  if(!livres.length)return null;
  if(tam==='roupa-p')return livres.find(x=>x.p<=220)||null;
  if(tam==='roupa-g')return livres.find(x=>x.p>=250&&x.p<=450)||null;
  return livres[livres.length-1];
}
/* entrega de verdade o que o baú prometeu. Item que a criança já tem vira +20 moedas (nada se perde, nada se repete). */
function entregarRecompensa(lista,dia){
  const itens=[];
  lista.forEach(r=>{
    const k=r[0];let v=r[1];
    if(k==='moedas'){S.moedas+=v;itens.push({k:k,n:'+'+v+' moedas',v:v});return;}
    if(k.indexOf('roupa')===0){
      const p=pecaParaBau(k);
      if(p){S.comprado.push(p.id);itens.push({k:k,n:p.n,v:0});}
      else{S.moedas+=20;itens.push({k:'moedas',n:'+20 moedas (você já tem todas as peças dessa faixa)',v:20});}
      return;
    }
    const lista2=S.colecao[COLECAO_DE[k]];
    const nome=(typeof v==='string'&&v)?(k==='medalha'?'Medalha '+v:v):nomeDe(k,dia);
    if(lista2.indexOf(nome)>=0){S.moedas+=20;itens.push({k:'moedas',n:'+20 moedas ('+nome+' você já tem)',v:20});}
    else{lista2.push(nome);itens.push({k:k,n:nome,v:0});}
  });
  return itens;
}

/* ---------- missões ---------- */
/* alvo por faixa: [f78, f910, f1112] */
const MISSOES_CAT=[
 {id:'M01',g:'revisao',alvo:[1,1,1],t:n=>'Faça a Revisão do dia',conta:c=>c.revisao,ok:()=>true},
 {id:'M02',g:'fase',alvo:[1,1,1],t:n=>'Complete uma fase',conta:c=>c.fase,ok:()=>true},
 {id:'M03',g:'combo',alvo:[4,5,6],t:n=>'Acerte '+n+' seguidas',conta:c=>c.combo,ok:()=>true},
 {id:'M04',g:'en-audio',alvo:[4,5,6],t:n=>'Ouça e acerte '+n+' palavras em inglês',conta:c=>c.enAudio,ok:()=>true},
 {id:'M05',g:'fatos',alvo:[1,1,1],t:n=>'Faça uma rodada de fatos',conta:c=>c.fatos,ok:()=>false},          /* rodada de fatos ainda não existe */
 {id:'M06',g:'historia',alvo:[1,1,1],t:n=>'Leia um texto com o Bobby',conta:c=>c.historia,ok:()=>false},     /* histórias e leituras ainda não existem */
 {id:'M07',g:'ditado',alvo:[3,4,5],t:n=>'Escreva '+n+' palavras que você ouviu',conta:c=>c.ditado,ok:()=>false},  /* ditado ainda não existe */
 {id:'M08',g:'galaxias',alvo:[2,2,2],t:n=>'Jogue em outra galáxia',conta:c=>c.materiasBloco.length,ok:()=>true},
 {id:'M09',g:'aula',alvo:[1,1,1],t:n=>'Releia uma aula',conta:c=>c.aulaRevista,ok:()=>(S.semana.aulaRevista||0)<1},   /* no máximo 1 vez por semana */
 {id:'M10',g:'lapso',alvo:[2,3,4],t:n=>'Acerte '+n+' perguntas que já errou antes',conta:c=>c.lapso,ok:()=>Object.keys(S.revisao.itens).some(k=>S.revisao.itens[k][IT.LAPSOS]>0)},
 {id:'M11',g:'mat',alvo:[8,10,12],t:n=>'Responda '+n+' perguntas de matemática',conta:c=>c.mat,ok:()=>true},
 {id:'M12',g:'porque',alvo:[1,1,1],t:n=>'Responda um "por quê?"',conta:c=>c.porque,ok:()=>false},              /* só depois do tipo "por quê" */
 {id:'M13',g:'novos',alvo:[3,4,5],t:n=>'Aprenda '+n+' coisas novas',conta:c=>c.itensNovos,ok:()=>true},
 {id:'M14',g:'fase',alvo:[1,1,1],t:n=>'Avance um passo no mundo',conta:c=>c.faseNova,ok:()=>true}
];
const missaoPorId=id=>MISSOES_CAT.filter(m=>m.id===id)[0];
const FAIXA_COLUNA={f78:0,f910:1,f1112:2};
/* degrau do alvo: cai 1 se em 3 dos últimos 5 dias fez menos de 2 das 3; sobe 1 se fez as 3 em 5 dias seguidos (teto f1112) */
function deltaDeAlvo(){
  const h=(S.missHist||[]).slice(-5);
  if(h.length>=3&&h.filter(x=>x.ok<2).length>=3)return -1;
  if(h.length>=5&&h.every(x=>x.ok>=3))return 1;
  return 0;
}
function alvoDaMissao(m){
  const col=Math.max(0,Math.min(2,(FAIXA_COLUNA[S.faixa]||0)+deltaDeAlvo()));
  return m.alvo[col];
}
/* matéria menos jogada nos últimos 3 dias (blocos por matéria) */
function materiaMenosJogada(dia){
  const n={mat:0,pt:0,en:0};
  for(let i=0;i<3;i++){const d=S.stats.dias[somaDias(dia,-i)];if(d&&d.bm)Object.keys(n).forEach(m=>{n[m]+=d.bm[m]||0;});}
  return ['mat','pt','en'].sort((a,b)=>n[a]-n[b])[0];
}
/* 3 missões do dia, determinísticas: mesma semente (perfil + dia) = mesmas missões o dia inteiro */
function gerarMissoes(dia){
  const rnd=mulberry32(fnv1a((perfilAtual().pid||'')+'|'+dia));
  const venc=(typeof revisaoVencidos==='function')?revisaoVencidos(dia).length:0;
  const ids=[];
  const ok=m=>m.ok();
  const usadas3=new Set();
  (S.missHist||[]).slice(-3).forEach(h=>(h.ids||[]).forEach(i=>usadas3.add(i)));
  const grupos=()=>ids.map(i=>missaoPorId(i).g);
  const livre=lista=>lista.map(missaoPorId).filter(m=>ok(m)&&ids.indexOf(m.id)<0&&grupos().indexOf(m.g)<0);
  const sorteia=lista=>lista.length?escolheCom(rnd,lista).id:null;
  /* A: base de aprendizado */
  let a=venc>=4?'M01':sorteia(livre(['M13','M02']));
  if(a)ids.push(a);
  /* B: progresso */
  const menos=materiaMenosJogada(dia);
  const poolB=['M02','M14','M13'].concat(menos==='mat'?['M11']:[]);
  const b=sorteia(livre(poolB));
  if(b)ids.push(b);
  /* C: desafio (evita o que já saiu nos últimos 3 dias; se ficar sem opção, aceita repetir) */
  const poolC=['M03','M04','M07','M10','M12','M08','M06','M05'];
  let cands=livre(poolC).filter(m=>!usadas3.has(m.id));
  if(!cands.length)cands=livre(poolC);
  const c=cands.length?escolheCom(rnd,cands).id:null;
  if(c)ids.push(c);
  /* se algum pool secou, completa com o que sobrar para sempre haver 3 */
  ['M02','M13','M03','M11','M08','M14'].forEach(i=>{
    const m=missaoPorId(i);
    if(ids.length<3&&ok(m)&&ids.indexOf(i)<0&&grupos().indexOf(m.g)<0)ids.push(i);
  });
  return ids.slice(0,3).map(id=>({id:id,alvo:alvoDaMissao(missaoPorId(id)),prog:0,ok:false}));
}
function atualizarMissoes(){
  const d=S.diario;
  d.missoes.forEach(m=>{
    const cat=missaoPorId(m.id);if(!cat)return;
    m.prog=Math.min(m.alvo,cat.conta(d.c,d));
    if(!m.ok&&m.prog>=m.alvo){
      m.ok=true;
      registrarEvento('missao_ok',{id:m.id});
    }
  });
  if(d.missoes.length===3&&d.missoes.every(m=>m.ok)&&!d.estrela){
    d.estrela=true;
    S.semana.estrelas++;
    if(S.semana.estrelas>=5&&!S.semana.constelacao){
      S.semana.constelacao=true;
      S.colecao.constelacao.push('Peça da Constelação da semana '+S.semana.chave);
    }
  }
}
const textoDaMissao=m=>missaoPorId(m.id).t(m.alvo);

/* ---------- virada do dia ---------- */
/* Chamar ao abrir o app, ao trocar de perfil e antes de qualquer ação. Barato quando o dia não mudou. */
function garantirDia(){
  const d=hoje();
  const o=S.ofensiva;
  o.diasLivres=S.config.diasLivres.slice();o.pausaAte=S.config.pausaAte;
  const antes={cong:o.congeladores,desc:o.descansando,ultimo:o.ultimo};
  ofensivaAbrir(o,d);
  if(o.congeladores<antes.cong){registrarEvento('congelador_usado',{saldo:o.congeladores});S.espera=S.espera||{};S.espera.usouCongelador=d;}
  if(!antes.desc&&o.descansando)registrarEvento('ofensiva_descansa',{valor:o.valorAntes,lacuna:o.lacuna});
  if(o.relogioEstranho){registrarEvento('relogio_estranho',{});o.relogioEstranho=false;}
  if(S.semana.chave!==semanaIso(d))S.semana={chave:semanaIso(d),estrelas:0,aulaRevista:0,constelacao:false};
  if(S.diario.dia!==d){
    const ontem=S.diario;
    /* guarda o resultado do dia que passou: alimenta o ajuste silencioso do alvo das missões */
    if(ontem.dia&&ontem.missoes.length){
      S.missHist=(S.missHist||[]).concat([{dia:ontem.dia,ids:ontem.missoes.map(m=>m.id),ok:ontem.missoes.filter(m=>m.ok).length}]).slice(-5);
    }
    S.diario=diarioVazio(d);
    S.diario.missoes=S.config.missoesLigadas?gerarMissoes(d):[];
    /* Kit de volta: quem volta depois de 4 dias ou mais ganha um presente de boas-vindas (fora da tabela do baú) */
    if(antes.ultimo&&difDias(antes.ultimo,d)>=4)S.diario.kit=1;
  }
  return S;
}

/* ---------- registro de cada pergunta e de cada bloco ---------- */
function diaDeStats(){
  const d=hoje();
  const x=S.stats.dias[d]||{fases:0,seg:0,b:0,q:0,ac:0,rev:0};
  if(!x.bm)x.bm={mat:0,pt:0,en:0};
  S.stats.dias[d]=x;
  return x;
}
/* chamada por conferir(). info: {ok, ms, dica, rev, lapso} */
function cicloPergunta(q,info){
  garantirDia();
  const d=S.diario,st=diaDeStats();
  d.perguntas++;st.q=(st.q||0)+1;
  if(info.ok){d.acertos++;st.ac=(st.ac||0)+1;}
  if(info.ms>0){S.stats.amostras.push(Math.max(1,Math.min(60,Math.round(info.ms/1000))));if(S.stats.amostras.length>CICLO.maxAmostras)S.stats.amostras.shift();}
  if(MATERIA==='mat')d.c.mat++;
  if(info.ok&&MATERIA==='en'&&q.ouvir)d.c.enAudio++;
  if(info.ok&&q.type==='texto'&&q.ouvir)d.c.ditado++;
  if(info.ok&&q.__lapso)d.c.lapso++;
  if(info.ok&&typeof LIC==='object')d.c.combo=Math.max(d.c.combo,LIC.combo||0);
  if(!d.metaOk&&d.perguntas>=perguntasMeta()){
    d.metaOk=true;
    registrarEvento('meta_cheia',{perguntas:d.perguntas,min:S.config.metaMin});
  }
  atualizarMissoes();
}
/* chamada ao fim de um bloco. info: {tipo:'fase'|'revisao', lic, materia, perguntas, acertos, estrelas, seg, faseNova}
   Devolve {contou, ofensiva:{...mudou}}. Só vira bloco quem respondeu 6 perguntas ou mais. */
function concluirBloco(info){
  garantirDia();
  registrarEvento('bloco_fim',{tipo:info.tipo,lic:String(info.lic||'').replace(/[^a-z0-9._]/gi,''),materia:info.materia||MATERIA,
    perguntas:info.perguntas,acertos:info.acertos,estrelas:info.estrelas||0,seg:info.seg||0,abandonou:info.abandonou?1:0,contou:info.perguntas>=CICLO.minBloco?1:0});
  if(info.perguntas<CICLO.minBloco)return {contou:false};
  const o=S.ofensiva,d=S.diario,st=diaDeStats(),hj=hoje();
  o.diasLivres=S.config.diasLivres.slice();o.pausaAte=S.config.pausaAte;
  const a={atual:o.atual,cong:o.congeladores,desc:o.descansando,rec:!!(o.recuperavel&&o.recuperavel.feita),dia:o.ultimo===hj};
  ofensivaBloco(o,hj);
  const mudou={subiu:o.atual>a.atual,voltouPelaMetade:a.desc&&o.atual<a.atual,recuperou:!a.rec&&!!(o.recuperavel&&o.recuperavel.feita),
    ganhouCongelador:o.congeladores>a.cong,primeiroDoDia:!a.dia};
  if(mudou.voltouPelaMetade)registrarEvento('ofensiva_retorno',{valor_antes:a.atual,valor_depois:o.atual});
  if(mudou.recuperou)registrarEvento('ofensiva_recuperada',{valor:o.atual});
  if(mudou.ganhouCongelador)registrarEvento('congelador_ganho',{saldo:o.congeladores});
  d.blocos++;st.b=(st.b||0)+1;
  const mat=info.materia||MATERIA;
  st.bm[mat]=(st.bm[mat]||0)+1;
  if(d.c.materiasBloco.indexOf(mat)<0)d.c.materiasBloco.push(mat);
  if(info.tipo==='fase'){d.c.fase++;if(info.faseNova)d.c.faseNova++;}
  if(info.tipo==='revisao')d.c.revisao++;
  atualizarMissoes();
  gravarEspera(info);
  return {contou:true,mudou:mudou};
}

/* ---------- baú, parada, kit ---------- */
const bauPronto=()=>S.diario.metaOk&&S.diario.blocos>=1&&!S.diario.bau.aberto;
function abrirBau(){
  garantirDia();
  if(!bauPronto())return null;
  const dia=Math.max(1,S.ofensiva.atual);
  const itens=entregarRecompensa(recompensaDoDia(dia),dia);
  S.diario.bau={aberto:true,dia:dia,itens:itens};
  registrarEvento('bau_aberto',{dia:dia});
  gravarEspera();
  return S.diario.bau;
}
const paradaPendente=()=>S.diario.metaOk&&S.diario.bau.aberto&&!S.diario.paradaVista;
function limiteDeBlocosAtingido(){
  const l=S.config.limiteBlocosDia;
  return !!l&&S.diario.blocos>=l+(S.diario.liberados||0);
}
function registrarParada(acao){
  S.diario.paradaVista=true;S.diario.paradaAcao=acao==='terminar'?'terminar':'continuar';
  registrarEvento('parada_vista',{acao:S.diario.paradaAcao});
  gravarEspera();salvar();
}
/* depois da parada ("continuar explorando") não há novo baú, nova missão nem bônus de combo do dia */
const bonusDeComboAtivo=()=>!(S.diario.paradaVista&&S.diario.paradaAcao==='continuar');
function pegarKit(){
  if(S.diario.kit!==1)return null;
  S.diario.kit=2;
  S.moedas+=15;
  const nome='Kit de volta';
  let itens=[{k:'moedas',n:'+15 moedas',v:15}];
  if(S.colecao.adesivos.indexOf(nome)<0){S.colecao.adesivos.push(nome);itens.push({k:'adesivo',n:nome,v:0});}
  salvar();
  return itens;
}

/* ---------- o que fica esperando (bilhete do Bobby) ---------- */
const BILHETES={
  primeiro:'Oi! Eu sou o Bobby. Deixei uma missão pequena para a gente começar.',
  diaSeguinte:'Que bom ver você de novo! Hoje a missão é rápida.',
  doisATres:'Oi de novo! Guardei um adesivo para você. Vamos?',
  quatroOuMais:'Seja bem-vindo de volta! Seu Kit de volta está aberto. Quer começar devagar?',
  revisao:'Preparei uma revisão curta com palavras que você já conhece.',
  mundo:'Você terminou um mundo inteiro! Hoje tem um mundo novo para explorar.',
  marco:'Hoje é um dia especial na sua sequência. Vem ver!',
  fimDeSemana:'Fim de semana de aventura! Uma missão e depois é só brincar.',
  sabado:'Sábado de aventura! Uma missão e depois é só brincar.',
  congelador:'O Bobby cuidou da sua sequência. Ela continua firme!',
  descansando:'Sua sequência estava descansando. Hoje ela volta com tudo!',
  erroDificil:'Aquela pergunta era difícil mesmo. Hoje a gente tenta de outro jeito.',
  neutro:'Que bom ver você! Vamos jogar um pouquinho?'
};
/* guarda o que a próxima abertura vai mostrar. Chamado ao fim de cada bloco, do baú e da parada. */
function gravarEspera(info){
  const e=S.espera||{};
  const dia=hoje();
  S.espera={bilhete:e.bilhete||'',presente:categoriaDoBau(Math.max(1,S.ofensiva.atual)+1),desde:dia,vistoEm:e.vistoEm||'',
    mundoNovo:!!(e.mundoNovo||(info&&info.completouMundo)),erroDificil:!!(e.erroDificil||(info&&info.erros>=3)),
    usouCongelador:e.usouCongelador};
  return S.espera;
}
/* Qual bilhete mostrar agora. A escolha depende do que aconteceu, nunca de "quanto tempo ficou fora" como cobrança. */
function escolherBilhete(){
  const dia=hoje(),o=S.ofensiva,e=S.espera||{};
  const ultimo=o.ultimo,fora=ultimo?difDias(ultimo,dia):0;
  const nunca=!ultimo&&Object.keys(S.stats.dias).length===0&&Object.keys(S.feitas).length===0;
  if(nunca)return 'primeiro';
  if(e.usouCongelador===dia)return 'congelador';
  if(o.descansando)return 'descansando';
  if(OF_MARCOS.indexOf(o.atual+1)>=0&&fora<=1)return 'marco';
  if(e.mundoNovo)return 'mundo';
  if(e.erroDificil)return 'erroDificil';
  if(fora>=4)return 'quatroOuMais';
  if(fora>=2)return 'doisATres';
  const venc=(typeof revisaoVencidos==='function')?revisaoVencidos(dia).length:0;
  if(venc>=1)return 'revisao';
  const dow=diaSemana(dia);
  if(dow===6)return 'sabado';
  if(dow===0)return 'fimDeSemana';
  if(fora===1)return 'diaSeguinte';
  return 'neutro';
}
/* {chave, texto, presente, pronto} ou null se já foi mostrado hoje */
function bilheteDeHoje(){
  garantirDia();
  const dia=hoje(),e=S.espera||{};
  if(e.vistoEm===dia)return null;
  const chave=escolherBilhete();
  const venc=(typeof revisaoVencidos==='function')?Math.min(S.config.revisaoPorDia,revisaoVencidos(dia).length):0;
  let pronto='Sua missão de hoje está pronta.';
  if(chave==='mundo')pronto='Um mundo novo foi liberado.';
  else if(venc>=1)pronto='Sua Revisão do dia está pronta ('+venc+' pergunta'+(venc>1?'s':'')+').';
  return {chave:chave,texto:BILHETES[chave],presente:e.presente||categoriaDoBau(Math.max(1,S.ofensiva.atual)+1),pronto:pronto};
}
function marcarBilheteVisto(){
  const e=S.espera||{};
  S.espera=Object.assign({},e,{vistoEm:hoje(),mundoNovo:false,erroDificil:false,usouCongelador:''});
  salvar();
}
