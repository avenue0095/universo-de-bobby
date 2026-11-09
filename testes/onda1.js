#!/usr/bin/env node
'use strict';
/* Onda 1 no navegador de verdade (Chrome headless, --mute-audio). Cada pacote acrescenta o seu bloco.
   A (1G e pendências de 08/11): ligar de português com 3 cartões longos inteiro acima do rodapé em 320x568, sem rolar; relatório e missão de
     exploração abrem atrás da área do responsável em 320, 390 e 1280 sem nada cortado de lado.
   Falha com exceção ou console.error.   Uso: node testes/onda1.js [--foto] [--so=A] */
const { abrirChrome, dorme } = require('./lib/chrome.js');
const arg = (n) => { const a = process.argv.find((x) => x.startsWith('--' + n + '=')); return a ? a.slice(n.length + 3) : null; };
const SO = arg('so');
const TELAS = { '320x568': { width: 320, height: 568, deviceScaleFactor: 2, mobile: true }, '360x640': { width: 360, height: 640, deviceScaleFactor: 2, mobile: true },
  '390x844': { width: 390, height: 844, deviceScaleFactor: 2, mobile: true }, '1280x800': { width: 1280, height: 800, deviceScaleFactor: 1, mobile: false }, '1440x900': { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false } };
const BLOCOS = [];
const bloco = (nome, fn) => BLOCOS.push([nome, fn]);

/* ---------- A ---------- */
bloco('A', async (c, feito) => {
  /* ligar de português pelo gerador de verdade: procura nas fases de português um ligar com os 3 cartões da esquerda mais longos */
  for (const rot of ['320x568', '360x640', '390x844']) {
    await c.tela(TELAS[rot], 'Ana');
    const r = await c.js(`(()=>{usarMateria('pt');fecharFolha();let melhor=null,tam=0;
      UNITS.forEach((u,ui)=>u.lessons.forEach((l,li)=>{for(let k=0;k<6;k++){const q=genQuestions(l,8).find(x=>x.verbo==='ligar');if(!q)continue;
        const t=q.pares.reduce((a,p)=>a+p.e.length,0);if(t>tam){tam=t;melhor={ui:ui,li:li,q:q};}}}));
      abrirLicao(melhor.ui,melhor.li);LIC.etapa='questao';LIC.i=0;LIC.qs=[melhor.q];pintarLicao();return tam;})()`);
    await dorme(400);
    const m = await c.js(`(()=>{const pe=document.querySelector('#pe .pe-in')||document.querySelector('#pe');const lim=pe.getBoundingClientRect().top;
      const corpo=document.querySelector('.lc-corpo');const ls=[...document.querySelectorAll('#palco .lig')].map(e=>e.getBoundingClientRect());
      return {lim:lim,baixo:Math.max(...ls.map(x=>x.bottom)),n:ls.length,rola:corpo.scrollTop,larg:document.documentElement.scrollWidth>innerWidth,minH:Math.min(...ls.map(x=>x.height))};})()`);
    await c.foto('A-ligar-' + rot);
    if (m.n !== 6) c.problemas.push(rot + ' ligar: ' + m.n + ' cartoes');
    if (m.baixo > m.lim + 0.5) c.problemas.push(rot + ' ligar: o ultimo cartao termina em ' + Math.round(m.baixo) + ' e o rodape comeca em ' + Math.round(m.lim) + ' (cartoes somando ' + r + ' letras)');
    if (m.rola) c.problemas.push(rot + ' ligar: a fase abriu rolada');
    if (m.larg) c.problemas.push(rot + ' ligar: rola de lado');
    if (m.minH < 44) c.problemas.push(rot + ' ligar: cartao com ' + m.minH + ' px de altura (toque minimo)');
    c.coleta(rot + ' A ligar');
  }
  feito.push('A: ligar de portugues com os 3 cartoes mais longos acima do rodape em 320x568, 360x640 e 390x844');
  for (const rot of ['320x568', '390x844', '1280x800']) {
    await c.tela(TELAS[rot], 'Bia');
    await c.js("fecharFolha();telaResponsavel();0"); await dorme(300);
    const m = await c.js(`(()=>{const p=document.querySelector('#perfil');const txt=p.innerText;
      const largos=[...p.querySelectorAll('.rel-cartao, .linha-mundo, details')].filter(e=>e.getBoundingClientRect().right>innerWidth+1).length;
      return {tem:/Como vai o aprendizado/.test(txt)&&/Dicas para quem acompanha/.test(txt),largos:largos,lado:document.documentElement.scrollWidth>innerWidth,bts:p.querySelectorAll('[data-diag]').length};})()`);
    if (!m.tem) c.problemas.push(rot + ' relatorio nao apareceu na area do responsavel');
    if (m.largos || m.lado) c.problemas.push(rot + ' relatorio cortado de lado (' + m.largos + ' caixas)');
    if (m.bts !== 3) c.problemas.push(rot + ' relatorio: ' + m.bts + ' botoes de missao de exploracao');
    await c.foto('A-relatorio-' + rot);
    /* missão de exploração: o botão de verdade abre a fase sem moeda */
    await c.js("document.querySelector('[data-diag=\"mat\"]').scrollIntoView({block:'center'});0"); await dorme(150);
    const p = await c.js("(()=>{const r=document.querySelector('[data-diag=\"mat\"]').getBoundingClientRect();return {x:r.left+r.width/2,y:r.top+r.height/2}})()");
    await c.tocar(p.x, p.y, TELAS[rot].mobile); await dorme(500);
    const d = await c.js("({on:document.querySelector('#licao').classList.contains('on'),diag:!!(LIC&&LIC.diag),et:LIC.etapa})");
    if (!d.on || !d.diag) c.problemas.push(rot + ' missao de exploracao nao abriu: ' + JSON.stringify(d));
    c.coleta(rot + ' A relatorio');
  }
  feito.push('A: relatorio e missao de exploracao em 320x568, 390x844 e 1280x800, sem corte de lado e sem erro no console');
});

/* ---------- B ---------- */
bloco('B', async (c, feito) => {
  for (const rot of ['390x844', '320x568', '1280x800']) {
    await c.tela(TELAS[rot], 'Caio');
    await c.js("S.comprado=['bone','oculos','lenco','capa','bandeira'];S.look={cabeca:'bone',rosto:'oculos',pescoco:'lenco',costas:'capa',mao:'bandeira'};S.moedas=600;salvar();pintarTopo();renderTrilha();0"); await dorme(400);
    /* no mapa: parado e andando com os 5 */
    const mapa = await c.js("(()=>{const v=document.querySelector('.voce');return v?[...v.querySelectorAll('.bobby-camadas')].map(b=>b.querySelectorAll('.camada').length):[]})()");
    if (!mapa.length || mapa.some((n) => n !== 5)) c.problemas.push(rot + ' mapa: camadas por pose ' + JSON.stringify(mapa));
    await c.js("fecharFolha();lojaOrigem='perfil';abaLoja='vestir';palcoId='bobby-p01';telaLoja();0"); await dorme(400);
    for (const pose of ['bobby-p01', 'bobby-p02', 'bobby-p05a', 'bobby-p03', 'bobby-e01']) {
      await c.js("document.querySelector('[data-pose=\"" + pose + "\"]').click();0"); await dorme(450);
      const m = await c.js(`(()=>{const b=document.querySelector('.palco .bobby-camadas');if(!b)return {sem:1};const base=b.querySelector('.camada-base').getBoundingClientRect();
        const cs=[...b.querySelectorAll('.camada')].map(e=>{const r=e.getBoundingClientRect();return {id:e.dataset.item,w:r.width,h:r.height,
          perto:r.right>base.left-base.width*.3&&r.left<base.right+base.width*.3&&r.bottom>base.top-base.height*.3&&r.top<base.bottom+base.height*.3}});
        return {pose:b.dataset.vista,n:cs.length,ruins:cs.filter(x=>!(x.w>4&&x.h>4&&x.perto)).map(x=>x.id),lado:document.documentElement.scrollWidth>innerWidth};})()`);
      if (m.sem || m.pose !== pose || m.n !== 5 || m.ruins.length || m.lado) c.problemas.push(rot + ' palco ' + pose + ': ' + JSON.stringify(m));
      await c.foto('B-palco-' + pose + '-' + rot);
    }
    /* experimentar: nao cobra; comprar e o 2o toque */
    await c.js("document.querySelector('[data-slot=\"cabeca\"]').click();0"); await dorme(250);
    await c.js("document.querySelector('[data-prova=\"explorador\"]').click();0"); await dorme(250);
    const pr = await c.js("({prova:!!document.querySelector('.palco [data-item=\"explorador\"]'),marca:!!document.querySelector('.marca-prova'),moedas:S.moedas,cab:S.look.cabeca})");
    if (!pr.prova || !pr.marca || pr.moedas !== 600 || pr.cab !== 'bone') c.problemas.push(rot + ' experimentar: ' + JSON.stringify(pr));
    for (const aba of ['semana', 'mais', 'comp']) {
      await c.js("document.querySelector('[data-aba=\"" + aba + "\"]').click();0"); await dorme(300);
      const m = await c.js("({itens:document.querySelectorAll('#perfil .vitrine .item, #perfil .album-vaga, #perfil .cofrinho, #perfil .dica-loja').length,lado:document.documentElement.scrollWidth>innerWidth,urg:/resta|última|só hoje|acaba em/i.test(document.querySelector('#perfil').innerText)})");
      if (!m.itens || m.lado || m.urg) c.problemas.push(rot + ' aba ' + aba + ': ' + JSON.stringify(m));
      await c.foto('B-aba-' + aba + '-' + rot);
    }
    c.coleta(rot + ' B');
  }
  feito.push('B: 5 acessorios ao mesmo tempo no mapa e no palco em Oi, Comemora, Caminha, Pensa e Rosto (390, 320 e 1280); experimentar sem cobrar; abas da loja sem urgencia');
});

/* ---------- C ---------- */
bloco('C', async (c, feito) => {
  for (const rot of ['1280x800', '1440x900']) {
    const med = TELAS[rot];
    await c.tela(med, 'Duda');
    await c.js("fecharFolha();window.scrollTo(0,0);0"); await dorme(400);
    /* (a) o conteúdo útil ocupa pelo menos 85% da largura: barra lateral + mapa + painel do lado */
    const larg = await c.js(`(()=>{const ivs=[];const add=e=>{if(!e)return;const r=e.getBoundingClientRect();if(r.width>0&&r.height>0&&r.bottom>0&&r.top<innerHeight)ivs.push([Math.max(0,r.left),Math.min(innerWidth,r.right)]);};
      add(document.querySelector('#barra'));add(document.querySelector('.painel-lado'));document.querySelectorAll('#tela .etapa').forEach(add);
      ivs.sort((a,b)=>a[0]-b[0]);let tot=0,fim=-1;ivs.forEach(([a,b])=>{if(b<=fim)return;tot+=b-Math.max(a,fim);fim=b;});return {pct:tot/innerWidth,lado:document.documentElement.scrollWidth>innerWidth};})()`);
    if (larg.pct < 0.85 || larg.lado) c.problemas.push(rot + ' mapa: conteudo em ' + Math.round(larg.pct * 100) + '% da largura' + (larg.lado ? ' e rola de lado' : ''));
    await c.foto('C-mapa-' + rot);
    /* (b) teclado: setas rolam o mapa, Enter abre a fase, Enter passa história e aula, 1 escolhe, Enter confere e segue, Esc sai */
    const y0 = await c.js('window.scrollY'); await c.tecla('ArrowDown', 'ArrowDown', 40); await dorme(700);
    const y1 = await c.js('window.scrollY'); if (!(y1 > y0)) c.problemas.push(rot + ' teclado: seta para baixo nao rolou o mapa');
    await c.js("window.scrollTo(0,0);document.activeElement&&document.activeElement.blur&&document.activeElement.blur();0");
    await c.tecla('Enter', 'Enter', 13); await dorme(600);
    if (!(await c.js("document.querySelector('#licao').classList.contains('on')"))) { c.problemas.push(rot + ' teclado: Enter no mapa nao abriu a fase'); continue; }
    for (let k = 0; k < 8 && (await c.js('LIC.etapa')) !== 'questao'; k++) { await c.tecla('Enter', 'Enter', 13); await dorme(250); }
    await c.js("LIC.qs[LIC.i]=mc('Quanto é 2 + 3?','5',['4','6','7']);LIC.qs[LIC.i].__mk=UNITS[0].lessons[0].makers[0];pintarLicao();0"); await dorme(300);
    await c.foto('C-pergunta-' + rot);
    const lay = await c.js(`(()=>{const a=document.querySelector('.q-cena'),b=document.querySelector('.q-lado'),pe=document.querySelector('#pe');if(!a||!b)return {sem:1};
      const ra=a.getBoundingClientRect(),rb=b.getBoundingClientRect(),rp=pe.getBoundingClientRect();return {lado:rb.left>=ra.right-1,larg:Math.round(rb.width),pe:Math.round(rp.width)};})()`);
    if (lay.sem || !lay.lado || lay.larg < 380 || lay.larg > 440) c.problemas.push(rot + ' pergunta: cena e painel lado a lado com 420 px ' + JSON.stringify(lay));
    const idx = await c.js("LIC.qs[LIC.i].options.indexOf('5')");
    await c.tecla(String(idx + 1), 'Digit' + (idx + 1), 49 + idx); await dorme(150);
    await c.tecla('Enter', 'Enter', 13); await dorme(400);
    const conf = await c.js('({c:LIC.conferido,ac:LIC.acertos})');
    if (!conf.c || conf.ac < 1) c.problemas.push(rot + ' teclado: 1 a 4 e Enter nao conferiram ' + JSON.stringify(conf));
    await c.tecla('Enter', 'Enter', 13); await dorme(400);
    if (await c.js('LIC.conferido')) c.problemas.push(rot + ' teclado: Enter nao foi para a proxima pergunta');
    /* setas andam entre as alternativas */
    await c.js("LIC.qs[LIC.i]=mc('Quanto é 1 + 1?','2',['3','4','5']);pintarLicao();0"); await dorme(200);
    await c.tecla('ArrowDown', 'ArrowDown', 40); await dorme(100); await c.tecla('ArrowDown', 'ArrowDown', 40); await dorme(100);
    const sel = await c.js("[...document.querySelectorAll('#palco .alt')].findIndex(b=>b.classList.contains('sel'))");
    if (sel !== 1) c.problemas.push(rot + ' teclado: setas nao andaram entre as alternativas (' + sel + ')');
    await c.tecla('Escape', 'Escape', 27); await dorme(400);
    if (await c.js("document.querySelector('#licao').classList.contains('on')")) c.problemas.push(rot + ' teclado: Esc nao saiu da fase');
    /* (c) hover em tudo que se toca; (d) nenhum texto cortado */
    const hov = await c.js(`(()=>{let ok=false;for(const sh of document.styleSheets){let rs;try{rs=sh.cssRules}catch(e){continue}
      const varre=l=>{for(const r of l){if(r.cssRules)varre(r.cssRules);if(r.selectorText&&r.selectorText.indexOf('button:not(:disabled):hover')>=0&&r.selectorText.indexOf('[role="button"]:hover')>=0)ok=true;}};varre(rs);}return ok;})()`);
    if (!hov) c.problemas.push(rot + ' hover: falta a regra de :hover para botoes e role=button');
    const cort = await c.js(`[...document.querySelectorAll('#tela h1,#tela h2,#tela p,#tela b,#tela span,.barra-baixo span,.topo b,.topo span')].filter(e=>{const r=e.getBoundingClientRect();return r.width>0&&getComputedStyle(e).overflow!=='visible'&&e.scrollWidth>e.clientWidth+1;}).slice(0,5).map(e=>e.textContent.slice(0,30))`);
    if (cort.length) c.problemas.push(rot + ' texto cortado: ' + JSON.stringify(cort));
    c.coleta(rot + ' C');
  }
  feito.push('C: computador em 1280x800 e 1440x900 (85% da largura, pergunta em 2 colunas, setas, Enter, 1 a 4 e Esc, hover, nada cortado)');
  /* 1A no navegador: o topo mostra os dias de exploração, nunca a ofensiva */
  await c.tela(TELAS['390x844'], 'Gabi');
  const topo = await c.js("(()=>{S.ofensiva.atual=7;S.ofensiva.congeladores=2;S.exploracao={dias:12,ultimo:hoje()};salvar();pintarTopo();renderTrilha();const t=document.body.innerText;return {exp:/12/.test(document.querySelector('#st-fogo').innerText),proib:(t.match(/ofensiva|dias seguidos|congelador|seguidas|combo|continuar por/i)||[''])[0]}})()");
  if (!topo.exp || topo.proib) c.problemas.push('390x844 1A: topo ' + JSON.stringify(topo));
  c.coleta('1A');
  feito.push('C: 1A no navegador (topo com 12 dias de exploracao, nenhuma palavra de ofensiva na tela do mapa)');
});

/* ---------- D ---------- */
bloco('D', async (c, feito) => {
  for (const rot of ['390x844', '1280x800']) {
    await c.tela(TELAS[rot], 'Eva');
    await c.js("fecharFolha();window.scrollTo(0,0);0"); await dorme(300);
    /* computador: botão no painel do mapa; celular: botão em Perfil */
    if (TELAS[rot].mobile) { await c.js("telaPerfil();0"); await dorme(400); }
    const bt = await c.js("(()=>{let b=document.querySelector('#abrir-treino');if(!b||!b.offsetParent)b=document.querySelector('#ir-treino');if(!b)return null;b.scrollIntoView({block:'center'});const r=b.getBoundingClientRect();return {x:r.left+r.width/2,y:r.top+r.height/2}})()");
    if (!bt) { c.problemas.push(rot + ' treino: sem o botao Treinar por tema no mapa'); continue; }
    await dorme(200); await c.tocar(bt.x, bt.y, TELAS[rot].mobile); await dorme(500);
    const lista = await c.js("({n:document.querySelectorAll('#folha [data-tema]').length,ind:document.querySelectorAll('#folha .tema.indicado').length,lado:document.documentElement.scrollWidth>innerWidth})");
    if (lista.n < 10 || !lista.ind || lista.lado) c.problemas.push(rot + ' treino: lista de temas ' + JSON.stringify(lista));
    await c.foto('D-temas-' + rot);
    await c.js("document.querySelector('#folha [data-tema=\"relogio\"]').click();0"); await dorme(600);
    const tr = await c.js("({on:document.querySelector('#licao').classList.contains('on'),base:LIC.base,treino:LIC.treino})");
    if (!tr.on || tr.base !== 10 || tr.treino !== 'relogio') c.problemas.push(rot + ' treino: nao abriu o tema relogio ' + JSON.stringify(tr));
    /* acha um relogio de verdade entre as perguntas do treino */
    const rel = await c.js("(()=>{const i=LIC.qs.findIndex(q=>q.figure&&/relogio/.test(q.figure));if(i<0)return {sem:1};LIC.i=i;pintarLicao();const s=document.querySelector('#palco svg.relogio');const r=s&&s.getBoundingClientRect();return {w:r?Math.round(r.width):0,n:s?s.querySelectorAll('text').length:0}})()");
    if (rel.sem || rel.w < 80 || rel.n !== 12) c.problemas.push(rot + ' treino: relogio ' + JSON.stringify(rel));
    await c.foto('D-relogio-' + rot);
    let g = 0; await c.js('LIC.i=0;pintarLicao();0');
    while ((await c.js('LIC.etapa')) === 'questao' && g++ < 30) await c.js('LIC.resp=LIC.qs[LIC.i].answer;conferir();avancar();0');
    const fim = await c.js("({et:LIC.etapa,txt:(document.querySelector('#palco')||{}).innerText||''})");
    if (fim.et !== 'fim' || !/Treino concluído/.test(fim.txt)) c.problemas.push(rot + ' treino: fim ' + JSON.stringify(fim).slice(0, 160));
    await c.js("fecharLicao();telaResponsavel();0"); await dorme(400);
    const pg = await c.js("({n:document.querySelectorAll('#perfil .programa li').length,bt:!!document.querySelector('#perfil [data-prog]')})");
    if (pg.n !== 20 || !pg.bt) c.problemas.push(rot + ' programa de 20 dias: ' + JSON.stringify(pg));
    c.coleta(rot + ' D');
  }
  feito.push('D: treinar por tema pelo botao do mapa (390 e 1280), relogio desenhado, rodada de 10 com fim de treino, programa de 20 dias na area do responsavel');
});

/* ---------- B2 ---------- */
bloco('B2', async (c, feito) => {
  for (const rot of ['390x844', '1280x800']) {
    await c.tela(TELAS[rot], 'Ivo');
    await c.js("S.comprado=['teo','aces-teo'];S.look={companheiro:'teo'};S.amizade={teo:{xp:0,dia:'',u:1200}};S.acessorioComp={teo:true};salvar();fecharFolha();pintarTopo();renderTrilha();0"); await dorme(500);
    const m = await c.js("(()=>{const v=document.querySelector('.voce');return {lenco:!!(v&&v.querySelector('.lenco-comp')),selo:!!document.querySelector('#logo .selo-estagio,#retrato-bb .selo-estagio')}})()");
    if (!m.lenco || !m.selo) c.problemas.push(rot + ' B2: lenco no mapa e selo no retrato ' + JSON.stringify(m));
    await c.js("lojaOrigem='perfil';abaLoja='comp';telaLoja();0"); await dorme(400);
    const t = await c.js("({txt:document.querySelector('#perfil').innerText,lado:document.documentElement.scrollWidth>innerWidth})");
    if (!/Melhor amigo/.test(t.txt) || /fome|triste|saudade/i.test(t.txt) || t.lado) c.problemas.push(rot + ' B2: tela do companheiro ' + t.txt.slice(0, 80));
    await c.foto('B2-companheiro-' + rot);
    c.coleta(rot + ' B2');
  }
  feito.push('B2: companheiro Melhor amigo com o lenco no mapa, selo no retrato e estagio na tela Meu personagem (390 e 1280)');
});

/* ---------- senha antes do relatório (revisão de 09/11) ---------- */
bloco('PIN', async (c, feito) => {
  for (const rot of ['390x844', '1280x800']) {
    await c.tela(TELAS[rot], 'Lia');
    await c.js("fecharFolha();telaPerfil();0"); await dorme(400);
    const p = await c.js("(()=>{const b=document.querySelector('#ir-resp');b.scrollIntoView({block:'center'});const r=b.getBoundingClientRect();return {x:r.left+r.width/2,y:r.top+r.height/2,senha:temSenha()}})()");
    if (p.senha) c.problemas.push(rot + ' PIN: o jogador novo ja tinha senha');
    await dorme(200); await c.tocar(p.x, p.y, TELAS[rot].mobile); await dorme(500);
    const f = await c.js("({folha:document.querySelector('#folha').classList.contains('on'),txt:document.querySelector('#folha').innerText,rel:/Como vai o aprendizado/.test(document.querySelector('#perfil').innerText)})");
    if (!f.folha || !/Primeiro, crie uma senha/.test(f.txt) || !/Agora não/.test(f.txt) || f.rel) c.problemas.push(rot + ' PIN: primeira abertura ' + JSON.stringify(f).slice(0, 200));
    await c.foto('PIN-criar-' + rot);
    const q = await c.js("(()=>{const b=document.querySelector('#pin-cancela');const r=b.getBoundingClientRect();return {x:r.left+r.width/2,y:r.top+r.height/2}})()");
    await c.tocar(q.x, q.y, TELAS[rot].mobile); await dorme(400);
    const v = await c.js("({folha:document.querySelector('#folha').classList.contains('on'),rel:/Como vai o aprendizado/.test(document.querySelector('#perfil').innerText),perfil:document.querySelector('#perfil').dataset.tela,senha:temSenha()})");
    if (v.folha || v.rel || v.senha) c.problemas.push(rot + ' PIN: "Agora nao" deveria voltar sem abrir o relatorio ' + JSON.stringify(v));
    c.coleta(rot + ' PIN');
  }
  feito.push('PIN: sem senha, Para o responsavel abre "Primeiro, crie uma senha"; "Agora nao" volta ao perfil sem abrir o relatorio (390 e 1280)');
});

(async () => {
  const c = await abrirChrome();
  const feito = [];
  try {
    for (const [nome, fn] of BLOCOS) { if (SO && SO !== nome) continue; await fn(c, feito); }
  } catch (e) { c.problemas.push('excecao no teste: ' + (e.stack || e.message)); }
  feito.forEach((f) => console.log('  ok  ' + f));
  if (c.problemas.length) { console.log('\nPROBLEMAS (' + c.problemas.length + '):'); c.problemas.forEach((p) => console.log('  - ' + p)); c.fechar(); process.exit(1); }
  console.log('\nOK: onda1 sem problemas'); c.fechar(); process.exit(0);
})();
