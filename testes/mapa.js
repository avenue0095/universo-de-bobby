#!/usr/bin/env node
'use strict';
/* Mapa como mundo (1C): etapa N trancada ate a revisao da N-1 (decisao do Filipe, 24/10), proxima() aponta a revisao pendente,
   objetos do cenario (HOTSPOTS) com 6 recortes por etapa dentro da imagem e posicao do no dentro da cena.   Uso: node testes/mapa.js */
const A = require('assert');
const { carregarApp } = require('./lib/carregar.js');
const { teste, resumo } = require('./lib/mini.js');
const J = (x) => JSON.parse(JSON.stringify(x));
(async () => {
  const a = carregarApp(4, {}); a.avaliar("novoPerfil('Zeca','#12A06E')");
  await teste('1. trancar: a 1a fase da etapa 2 so abre depois da revisao da etapa 1; a fase seguinte so depois da anterior', () => {
    a.avaliar("usarMateria('mat');S.feitas={}");
    A.strictEqual(a.avaliar('liberada(0,0)'), true);
    A.strictEqual(a.avaliar('liberada(1,0)'), false);
    a.avaliar("UNITS[0].lessons.forEach(l=>S.feitas[l.id]=3)");
    A.strictEqual(a.avaliar('liberada(1,0)'), false, 'etapa 2 abriu sem a revisao da 1');
    A.deepStrictEqual(JSON.parse(JSON.stringify(a.avaliar('proxima()'))), [0, 5], 'proxima deveria apontar a revisao da etapa 1');
    A.strictEqual(a.avaliar('tituloDaProxima(proxima())'), 'Revisão da etapa 1');
    a.avaliar("S.feitas['revmat1']=3");
    A.strictEqual(a.avaliar('liberada(1,0)'), true);
    A.deepStrictEqual(JSON.parse(JSON.stringify(a.avaliar('proxima()'))), [1, 0]);
    A.strictEqual(a.avaliar('liberada(1,1)'), false);
    A.strictEqual(a.avaliar('TRANCAR_ETAPAS'), true);
  });
  await teste('2. objetos do cenario: as 10 etapas dos 3 planetas com 6 recortes dentro da imagem, cada um com area util, nos dentro da cena e o centro de cada objeto livre para o toque', () => {
    const H = a.avaliar('JSON.parse(JSON.stringify(HOTSPOTS))');
    const area = (r) => (r[2] - r[0]) * (r[3] - r[1]);
    const dentro = (x, y, r) => x > r[0] && x < r[2] && y > r[1] && y < r[3];
    ['mat', 'pt', 'en'].forEach((m) => {
      a.avaliar("usarMateria('" + m + "')");
      for (let n = 1; n <= 10; n++) {
        const hs = H[m][n], et = m + ' etapa ' + n;
        A.ok(hs && hs.length === 6, et + ': precisa de 6 recortes');
        hs.forEach((r) => { A.ok(r[0] >= 0 && r[1] >= 0 && r[2] <= 1 && r[3] <= 1 && r[2] > r[0] && r[3] > r[1], et + ' ' + r); A.ok((r[2] - r[0]) >= .12 - 1e-9 && (r[3] - r[1]) >= .1 - 1e-9, 'recorte pequeno ' + et + ' ' + r); });
        /* o menor fica por cima (--camada): o centro de um objeto nao pode cair dentro de outro menor que ele */
        hs.forEach((r, i) => { const cx = (r[0] + r[2]) / 2, cy = (r[1] + r[3]) / 2; hs.forEach((o, k) => { if (k !== i && area(o) < area(r)) A.ok(!dentro(cx, cy, o), et + ': o centro do objeto ' + i + ' fica embaixo do objeto ' + k); }); });
        /* revisao de 08/11/2026: cada recorte com pelo menos 90% dentro do quadro visivel (a cena corta 8,17% de cada lado da imagem),
           e nas etapas 2 a 10 nenhuma peca cobre mais de 25% da outra */
        hs.forEach((r, i) => { const dentro = Math.max(0, Math.min(r[2], .9183) - Math.max(r[0], .0817)) / (r[2] - r[0]); A.ok(dentro >= .9, et + ': objeto ' + i + ' com ' + Math.round(dentro * 100) + '% dentro do quadro'); });
        if (n > 1) hs.forEach((r, i) => hs.forEach((o, k) => { if (k <= i) return; const ix = Math.max(0, Math.min(r[2], o[2]) - Math.max(r[0], o[0])), iy = Math.max(0, Math.min(r[3], o[3]) - Math.max(r[1], o[1])); A.ok(ix * iy <= .25 * Math.min(area(r), area(o)), et + ': objetos ' + i + ' e ' + k + ' sobrepostos'); }));
        /* o centro visivel: a cena corta 8,17% de cada lado da imagem */
        hs.forEach((r, i) => { const cx = (r[0] + r[2]) / 2; A.ok(cx > .0817 && cx < .9183, et + ': objeto ' + i + ' com o centro fora da cena'); });
        A.ok(a.avaliar('!!hotspotsDe("' + m + '",' + n + ')'), et + ' sem recorte');
        for (let li = 0; li < 6; li++) { const p = a.avaliar('posNo(UNITS[' + (n - 1) + '],' + li + ')'); A.ok(p[0] > -5 && p[0] < 105 && p[1] > 0 && p[1] <= 100, et + ' no ' + li + ' ' + p); }
      }
    });
  });
  await teste('2b. pontos vivos, hora do dia, clima e desenho pendurado: 3 pontos por cenario fora dos objetos, fala uma vez por dia, 4 faixas de hora', () => {
    const H = a.avaliar('JSON.parse(JSON.stringify(HOTSPOTS))'), V = a.avaliar('JSON.parse(JSON.stringify(VIVOS))');
    ['mat', 'pt', 'en'].forEach((m) => {
      for (let n = 1; n <= 10; n++) {
        const v = V[m][n]; A.ok(v && v.length === 3, m + n + ': 3 pontos vivos');
        v.forEach((p, k) => {
          A.ok(p[0] > .0817 + .04 && p[0] < .9183 - .04 && p[1] > 0 && p[1] < .7, m + n + ' ponto ' + k + ' fora da cena ' + p);
          H[m][n].forEach((r, i) => A.ok(!(p[0] > r[0] && p[0] < r[2] && p[1] > r[1] && p[1] < r[3]), m + n + ' ponto ' + k + ' em cima do objeto ' + i));
          const f = a.avaliar('falaDoVivo("' + m + n + '-' + k + '")');
          A.ok(f && f.split(/\s+/).length <= 15 && !/—/.test(f), 'fala do ponto ' + m + n + '-' + k + ': ' + f);
        });
      }
    });
    a.avaliar("novoPerfil('Lia','#12A06E');usarMateria('mat')");
    const f1 = a.avaliar('vivoTocado("mat1-0")'), f2 = a.avaliar('vivoTocado("mat1-0")');
    A.ok(f1 && f2 === '', 'fala so na primeira vez do dia');
    A.deepStrictEqual(J(a.avaliar('normalizaDiario({dia:"2026-11-08",vivos:["mat1-0","en10-2","x","mat1-9",3]}).vivos')), ['mat1-0', 'en10-2']);
    A.deepStrictEqual(J(a.avaliar('diarioVazio("2026-11-09").vivos')), [], 'dia novo zera os pontos que ja falaram');
    A.deepStrictEqual([6, 11, 12, 16, 17, 18, 19, 23, 0, 5].map((h) => a.avaliar('horaDoDia(' + h + ')')),
      ['manha', 'manha', 'tarde', 'tarde', 'entardecer', 'entardecer', 'noite', 'noite', 'noite', 'noite']);
    A.strictEqual((a.avaliar('climaHTML(true)').match(/<i /g) || []).length, 6, 'clima: 6 particulas na etapa atual');
    A.strictEqual((a.avaliar('climaHTML(false)').match(/<i /g) || []).length, 0, 'clima so na etapa atual');
    /* desenho pendurado: so depois de pintar o desenho ganho da etapa */
    A.strictEqual(a.avaliar('penduradoHTML(UNITS[0])'), '', 'sem desenho ganho nao pendura nada');
    a.avaliar("UNITS[0].lessons.forEach(l=>S.feitas[l.id]=3)");
    A.strictEqual(a.avaliar('penduradoHTML(UNITS[0])'), '', 'ganho mas sem pintar nao pendura');
    a.avaliar("S.desenhos.tinta['des-mat01']=[[10,10,2]]");
    if (a.avaliar('!!ativo("des-mat01")')) A.ok(/class="pendurado" data-des="des-mat01"/.test(a.avaliar('penduradoHTML(UNITS[0])')), 'pintado: pendura na casa da etapa');
  });
  await teste('3. fim de fase no mapa: o cartao tem estrelas, uma linha, um botao Continuar e nenhum modal', () => {
    a.avaliar("usarMateria('mat');S.feitas={};MAPA.fim={ui:0,li:0,est:3,perfeita:true,acertos:8,base:8,ganho:110,completouMundo:false,bloco:null,fala:'Fase perfeita!',extraHTML:''}");
    const h = a.avaliar('fimCenaHTML(MAPA.fim)');
    A.ok(/fim-estrelas/.test(h) && /8 de 8 perguntas, 110 moedas/.test(h) && /id="fim-continuar"/.test(h) && !/class="modal/.test(h));
    a.avaliar('MAPA.fim=null');
  });
  await teste('4. todo script que abre o Chrome lanca com --mute-audio (nenhum teste toca som nos alto-falantes)', () => {
    const fs = require('fs'), path = require('path');
    const dir = path.join(__dirname);
    fs.readdirSync(dir).filter((f) => f.endsWith('.js')).forEach((f) => {
      const t = fs.readFileSync(path.join(dir, f), 'utf8');
      if (/--headless|--remote-debugging-port|spawn\(CHROME/.test(t)) A.ok(/--mute-audio/.test(t), f + ' abre o Chrome sem --mute-audio');
    });
  });
  resumo('mapa.js');
})();
