#!/usr/bin/env node
'use strict';
/* Pipeline de ativos: o manifesto bate com os arquivos, o app inicial pesa pouco e cada imagem respeita o teto.
   Meta: index.html + fontes + camada 'inicial' da arte abaixo de 3 MB antes da primeira fase.   Uso: node testes/ativos.js */
const fs = require('fs');
const path = require('path');
const A = require('assert');
const { teste, resumo } = require('./lib/mini.js');
const RAIZ = path.resolve(__dirname, '..');
const man = JSON.parse(fs.readFileSync(path.join(RAIZ, 'assets', 'manifesto.json'), 'utf8'));
const itens = Object.entries(man.itens);
const tam = (rel) => fs.statSync(path.join(RAIZ, rel)).size;
const lista = (dir) => (fs.existsSync(path.join(RAIZ, dir)) ? fs.readdirSync(path.join(RAIZ, dir)).map((f) => dir + '/' + f) : []);

(async () => {
  await teste('1. todo ativo do manifesto existe, com o peso e o tamanho declarados', () => {
    itens.forEach(([id, m]) => { A.strictEqual(tam('assets/' + m.a), m.b, id + ' mudou de peso: rode python3 build/ativos.py'); });
  });
  await teste('2. nenhum .webp solto fora do manifesto', () => {
    const declarados = new Set(itens.map(([, m]) => 'assets/' + m.a));
    const soltos = ['personagens', 'expressoes', 'itens', 'companheiros', 'planetas', 'cenarios', 'desenhos'].flatMap((d) => lista('assets/' + d)).filter((f) => !declarados.has(f));
    A.deepStrictEqual(soltos, []);
  });
  await teste('3. tetos por imagem: pose/expressao 768 px e 120 KB; item 512 px; cenario e planeta 1024 px e 160 KB; desenho 160 KB', () => {
    itens.forEach(([id, m]) => {
      const mx = Math.max(m.w, m.h);
      if (m.g === 'personagem' || m.g === 'expressao' || m.g === 'companheiro') { A.ok(mx <= 768 && m.b <= 120 * 1024, id + ' ' + mx + 'px ' + m.b); }
      else if (m.g === 'item') A.ok(mx <= 512, id);
      else if (m.g === 'cenario' || m.g === 'planeta') A.ok(mx <= 1024 && m.b <= 160 * 1024, id + ' ' + mx + 'px ' + m.b);
      else if (m.g === 'desenho') A.ok(m.b <= 160 * 1024, id + ' ' + m.b);
    });
  });
  await teste('4. app inicial (index.html + fontes + arte inicial) abaixo de 3 MB', () => {
    const arte = itens.filter(([, m]) => m.inicial).reduce((a, [, m]) => a + m.b, 0);
    const fontes = lista('assets/fontes').filter((f) => f.endsWith('.woff2')).reduce((a, f) => a + tam(f), 0);
    const total = tam('index.html') + fontes + arte;
    console.log('          inicial: index ' + Math.round(tam('index.html') / 1024) + ' KB + fontes ' + Math.round(fontes / 1024) + ' KB + arte ' + Math.round(arte / 1024) + ' KB = ' + (total / 1048576).toFixed(2) + ' MB');
    A.ok(total < 3 * 1048576, 'passou de 3 MB: ' + total);
  });
  await teste('5. o indice ATIVOS embutido no index.html e o do manifesto sao os mesmos', () => {
    const html = fs.readFileSync(path.join(RAIZ, 'index.html'), 'utf8');
    const m = html.match(/const ATIVOS=(\{.*?\});<\/script>/);
    A.ok(m, 'ATIVOS ausente');
    const emb = JSON.parse(m[1]);
    A.deepStrictEqual(Object.keys(emb).sort(), itens.map(([id]) => id).sort());
  });
  await teste('6. tudo o que a camada inicial promete existe para as tres materias (planeta e cenario da etapa 1, Bobby oi e andando)', () => {
    ['planeta-mat', 'planeta-por', 'planeta-ing', 'cen-mat01-apagado', 'cen-mat01-completo', 'cen-por01-apagado', 'cen-por01-completo', 'cen-ing01-apagado', 'cen-ing01-completo', 'bobby-p01', 'bobby-p05a', 'bobby-p05b', 'bobby-e01']
      .forEach((id) => A.ok(man.itens[id] && man.itens[id].inicial, id));
  });
  resumo('ativos.js');
})();
