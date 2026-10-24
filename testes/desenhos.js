#!/usr/bin/env node
'use strict';
/* Desenhos: 1 por etapa (30), direito herdado de quem ja tinha fase concluida, balde de tinta por inundacao, ativos coerentes.
   Uso: node testes/desenhos.js */
const fs = require('fs');
const path = require('path');
const A = require('assert');
const { carregarApp, carregarModulos } = require('./lib/carregar.js');
const { teste, resumo } = require('./lib/mini.js');
const RAIZ = path.resolve(__dirname, '..');

/* imagem sintetica: moldura de linha e uma divisoria vertical no meio (2 areas por dentro) */
function folha(w, h) {
  const lum = new Uint8Array(w * h).fill(255);
  const linha = (x, y) => { if (x >= 0 && y >= 0 && x < w && y < h) lum[y * w + x] = 0; };
  for (let x = 10; x < w - 10; x++) for (let e = 0; e < 4; e++) { linha(x, 10 + e); linha(x, h - 11 - e); }
  for (let y = 10; y < h - 10; y++) for (let e = 0; e < 4; e++) { linha(10 + e, y); linha(w - 11 - e, y); linha(Math.floor(w / 2) + e, y); }
  return lum;
}

(async () => {
  const T = carregarModulos(['interface/tinta.js'], '({tintaRegiao,tintaMapa,tintaSemente})');
  await teste('1. balde: pinta so a area tocada, nao passa da linha e nao pinta a linha', () => {
    const w = 120, h = 80, lum = folha(w, h);
    const reg = T.tintaRegiao(lum, w, h, 30, 40);
    A.ok(reg.length > 1000, 'area pequena demais');
    A.ok(reg.every((i) => lum[i] >= 140), 'pintou linha');
    A.ok(reg.every((i) => (i % w) < Math.floor(w / 2)), 'vazou para a outra area');
    const fora = T.tintaRegiao(lum, w, h, 2, 2);                       /* fora da moldura: outra area, tambem fechada */
    A.ok(fora.length > 0 && !fora.includes(40 * w + 30));
  });
  await teste('2. tocar na linha (ou a ate 3 px dela) acha a area do lado; longe de qualquer area nao pinta nada', () => {
    const w = 120, h = 80, lum = folha(w, h);
    A.ok(T.tintaRegiao(lum, w, h, 10, 40).length > 0, 'toque na linha deveria achar a area vizinha');
    const cheio = new Uint8Array(w * h);                                /* tudo linha */
    A.strictEqual(T.tintaRegiao(cheio, w, h, 20, 20).length, 0);
  });
  await teste('3. jogadas repetidas viram o mesmo mapa (guardar e reabrir devolve o desenho pintado)', () => {
    const w = 120, h = 80, lum = folha(w, h);
    const jog = [[30, 40, 2], [90, 40, 7], [30, 40, 4]];
    const m = T.tintaMapa(lum, w, h, jog);
    A.strictEqual(m[40 * w + 30], 5);                                   /* a ultima cor vence na mesma area */
    A.strictEqual(m[40 * w + 90], 8);
    A.deepStrictEqual(Array.from(T.tintaMapa(lum, w, h, jog)), Array.from(m));
  });
  await teste('4. desempenho: uma area grande em folha de 896 x 1200 em menos de 400 ms', () => {
    const w = 896, h = 1200, lum = folha(w, h);
    const t = Date.now(); const reg = T.tintaRegiao(lum, w, h, 100, 600);
    const ms = Date.now() - t;
    A.ok(reg.length > 100000, 'area inesperada');
    A.ok(ms < 400, 'lento: ' + ms + ' ms');
  });

  const app = carregarApp(3);
  await teste('5. catalogo: 30 desenhos (10 por materia), ids unicos e nomes da especificacao', () => {
    const cat = app.avaliar('desenhosCatalogo()');
    A.strictEqual(cat.length, 30);
    A.strictEqual(new Set(cat.map((d) => d.id)).size, 30);
    A.ok(cat.every((d) => /^des-(mat|por|ing)(0[1-9]|10)$/.test(d.id)));
    A.strictEqual(cat[0].nome, 'A horta do Bobby'); A.strictEqual(cat[29].nome, 'Falando como um local');
  });
  await teste('6. um desenho por ETAPA: so com as 5 fases concluidas; 4 de 5 nao dao', () => {
    app.avaliar("usarMateria('en');S.feitas={};S.desenhos=desenhosVazios()");
    app.avaliar("UNITS[0].lessons.slice(0,4).forEach(l=>S.feitas[l.id]=3)");
    A.strictEqual(app.avaliar("desenhoGanho(desenhoPorId('des-ing01'))"), false);
    app.avaliar("S.feitas[UNITS[0].lessons[4].id]=1");
    A.strictEqual(app.avaliar("desenhoGanho(desenhoPorId('des-ing01'))"), true);
    A.strictEqual(app.avaliar('desenhosGanhos().length'), 1);
  });
  await teste('7. migracao: quem ja tinha fase concluida (modelo antigo, 1 desenho por fase) mantem o direito da etapa', () => {
    const antigo = { nome: 'Lia', feitas: { '1.1': 3, '1.2': 2, 'p2.3': 1, 'e10.5': 3 }, moedas: 10, xp: 10 };   /* sem o campo desenhos */
    const s = app.avaliar('estadoDe(' + JSON.stringify(antigo) + ')');
    A.strictEqual(JSON.stringify(Array.from(s.desenhos.herdado).sort()), JSON.stringify(['des-ing10', 'des-mat01', 'des-por02']));
    app.avaliar('S=estadoDe(' + JSON.stringify(antigo) + ')');
    A.strictEqual(app.avaliar("desenhoGanho(desenhoPorId('des-mat01'))"), true);
    A.strictEqual(app.avaliar("desenhoGanho(desenhoPorId('des-mat02'))"), false);
    /* estado novo (ja com desenhos) nao reherda nada */
    const novo = app.avaliar('estadoDe(' + JSON.stringify({ feitas: { '1.1': 3 }, desenhos: { herdado: [], vistos: [], tinta: {} } }) + ')');
    A.strictEqual(novo.desenhos.herdado.length, 0);
  });
  await teste('8. normalizacao: lixo no campo desenhos nao entra (ids falsos, tinta fora da escala)', () => {
    const s = app.avaliar('estadoDe(' + JSON.stringify({ desenhos: { herdado: ['des-mat01', '<x>', 'des-zzz99'], vistos: [7], tinta: { 'des-mat01': [[1, 2, 3], [1, 2], 'x', [99999, -5, 99]], 'outro': [[1, 1, 1]] } } }) + ')');
    A.strictEqual(JSON.stringify(Array.from(s.desenhos.herdado)), JSON.stringify(['des-mat01']));
    A.strictEqual(Object.keys(s.desenhos.tinta).join(), 'des-mat01');
    A.strictEqual(s.desenhos.tinta['des-mat01'].length, 2);
    A.ok(s.desenhos.tinta['des-mat01'].every((o) => o[0] <= 4000 && o[1] >= 0 && o[2] <= 15));
  });
  await teste('9. todo desenho da arte tem lugar no catalogo e o peso e leve', () => {
    const man = JSON.parse(fs.readFileSync(path.join(RAIZ, 'assets', 'manifesto.json'), 'utf8')).itens;
    const ids = new Set(app.avaliar('desenhosCatalogo()').map((d) => d.id));
    Object.keys(man).filter((k) => k.startsWith('des-')).forEach((k) => A.ok(ids.has(k), k + ' fora do catalogo'));
  });
  await teste('10. nada de jsPDF nem de CDN no app e a impressao A4 existe no CSS', () => {
    const shell = fs.readFileSync(path.join(RAIZ, 'src', 'interface', 'shell.html'), 'utf8');
    const css = fs.readFileSync(path.join(RAIZ, 'src', 'interface', 'style.css'), 'utf8');
    A.ok(!/jspdf|cdnjs/i.test(shell));
    A.ok(/@page\{size:A4/.test(css) && /\.folha-a4/.test(css));
  });
  resumo('desenhos.js');
})();
