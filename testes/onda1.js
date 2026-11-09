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
