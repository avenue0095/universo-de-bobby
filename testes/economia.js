#!/usr/bin/env node
'use strict';
/* Economia: simula uma criança média (80% de acerto, meta de 5 minutos = 20 perguntas por dia em fases de 8, 8 e 4, uma sequência de dias)
   com as constantes REAIS do app (ECON, PRECOS e a tabela do baú) e confere os prazos para juntar cada preço partindo do zero:
   1º companheiro ~3 dias, 2º ~5, os mais raros 10 a 14. Também confere que o Bobby é grátis, que nada liga a dinheiro real e que a
   tabela de preços vive num lugar só.   Uso: node testes/economia.js */
const A = require('assert');
const fs = require('fs');
const path = require('path');
const { carregarApp } = require('./lib/carregar.js');
const { teste, resumo } = require('./lib/mini.js');

function mulberry(a) { return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }

(async () => {
  const app = carregarApp(5, {});
  app.avaliar("novoPerfil('Zeca','#12A06E')");
  const E = JSON.parse(app.avaliar('JSON.stringify(ECON)'));
  const P = JSON.parse(app.avaliar('JSON.stringify(PRECOS)'));
  const bau = (dia) => app.avaliar('recompensaDoDia(' + dia + ').filter(function(r){return r[0]==="moedas"}).reduce(function(a,r){return a+r[1]},0)');

  /* ganho médio por dia de jogo de uma criança média, N crianças simuladas */
  function simula(criancas, dias, acerto, seed) {
    const rnd = mulberry(seed), porDia = new Array(dias).fill(0);
    for (let c = 0; c < criancas; c++) {
      for (let d = 1; d <= dias; d++) {
        let moedas = bau(d), restantes = E.perguntasPorDia;
        for (const tam of [8, 8, 4]) {
          if (restantes <= 0) break;
          const n = Math.min(tam, restantes); restantes -= n;
          let combo = 0, erros = 0;
          for (let i = 0; i < n; i++) {
            if (rnd() < acerto) { combo++; moedas += E.ganhoAcerto; if (combo >= E.sequenciaDe && combo % E.sequenciaDe === 0) moedas += E.bonusSequencia; }
            else { combo = 0; erros++; }
          }
          if (n === 8 && erros === 0) moedas += E.bonusFasePerfeita;
        }
        porDia[d - 1] += moedas / criancas;
      }
    }
    return porDia;
  }
  const dias = 30, media = simula(400, dias, 0.8, 7);
  const diasPara = (preco, serie) => { let t = 0; for (let d = 0; d < serie.length; d++) { t += serie[d]; if (t >= preco) return d + 1; } return Infinity; };
  const ganhoDia = media.slice(0, 14).reduce((a, b) => a + b, 0) / 14;
  console.log('          ganho medio: ' + Math.round(ganhoDia) + ' moedas por dia de jogo');
  const tab = Object.keys(P.companheiro).map((k) => k + ' ' + P.companheiro[k] + ' = ' + diasPara(P.companheiro[k], media) + ' dias').join(' | ');
  console.log('          prazos: ' + tab);

  await teste('1. 1o companheiro em cerca de 3 dias, 2o em cerca de 5, os mais raros em 10 a 14 (crianca media, do zero)', () => {
    const preco = Object.values(P.companheiro).sort((a, b) => a - b);
    const prazo = preco.map((p) => diasPara(p, media));
    A.ok(prazo[0] >= 2 && prazo[0] <= 4, '1o: ' + prazo[0] + ' dias');
    A.ok(prazo[1] >= 4 && prazo[1] <= 6, '2o: ' + prazo[1] + ' dias');
    A.ok(prazo[prazo.length - 1] >= 10 && prazo[prazo.length - 1] <= 14, 'mais raro: ' + prazo[prazo.length - 1] + ' dias');
    A.ok(prazo[prazo.length - 2] >= 10 && prazo[prazo.length - 2] <= 14, 'penultimo: ' + prazo[prazo.length - 2] + ' dias');
    for (let i = 1; i < prazo.length; i++) A.ok(prazo[i] >= prazo[i - 1], 'precos fora de ordem');
  });
  await teste('2. nao forca jogo excessivo: mesmo errando mais (60% de acerto) o mais raro sai em ate 20 dias; com 90% ainda leva 9 dias ou mais', () => {
    const baixo = simula(200, dias, 0.6, 3), alto = simula(200, dias, 0.9, 4), raro = Math.max(...Object.values(P.companheiro));
    A.ok(diasPara(raro, baixo) <= 20, '60%: ' + diasPara(raro, baixo));
    A.ok(diasPara(raro, alto) >= 9, '90%: ' + diasPara(raro, alto));
  });
  await teste('3. looks custam menos que qualquer companheiro, e todo preco e moeda do jogo (inteiro positivo)', () => {
    const maxLook = Math.max(...Object.values(P.look)), minComp = Math.min(...Object.values(P.companheiro));
    A.ok(maxLook > 0 && maxLook < Math.max(...Object.values(P.companheiro)), 'looks devem ser menores que os mais caros');
    A.ok(Math.min(...Object.values(P.look)) < minComp, 'o look mais barato deve custar menos que o 1o companheiro');
    Object.values(P.companheiro).concat(Object.values(P.look)).forEach((v) => A.ok(Number.isInteger(v) && v > 0));
  });
  await teste('4. o Bobby e gratis e companheiro nao escolhido sem comprar nao entra (compra confirma, tira moedas e escolhe)', () => {
    const a = carregarApp(6, {}); a.avaliar("novoPerfil('Zeca','#12A06E')");
    A.strictEqual(a.avaliar("persAtivo().tipo"), 'bobby');
    a.avaliar("S.moedas=100;escolherCompanheiro('rufa')");
    A.strictEqual(a.avaliar("S.look.companheiro===undefined||S.look.companheiro===''"), true, 'escolheu sem comprar');
    a.avaliar("comprarCompanheiro('rufa')");
    A.strictEqual(a.avaliar('S.moedas'), 100, 'sem saldo nao compra');
    a.avaliar("S.moedas=" + (P.companheiro.rufa + 40) + ";comprarCompanheiro('rufa')");
    A.strictEqual(a.avaliar('S.moedas'), 40);
    A.strictEqual(a.avaliar("S.look.companheiro"), 'rufa');
    A.ok(a.avaliar("S.comprado.indexOf('rufa')>=0"));
    a.avaliar("S.moedas=5000;comprarCompanheiro('rufa')");
    A.strictEqual(a.avaliar('S.moedas'), 5000, 'comprou duas vezes');
    // migracao: quem tinha um companheiro escolhido mantem sem pagar
    A.strictEqual(a.avaliar("estadoDe({look:{companheiro:'capi'},comprado:[],moedas:0}).look.companheiro"), 'capi');
  });
  await teste('5. a tabela de precos vive so em economia.js e nada liga a dinheiro real', () => {
    const src = fs.readdirSync(path.join(__dirname, '..', 'src', 'interface')).filter((f) => f.endsWith('.js'));
    src.forEach((f) => {
      const t = fs.readFileSync(path.join(__dirname, '..', 'src', 'interface', f), 'utf8');
      if (f !== 'economia.js') A.ok(!/companheiro:\{teo:/.test(t), 'precos de companheiro fora de economia.js: ' + f);
      const m = /cart[aã]o de cr[eé]dito|\bpix\b|in-app purchase|compra no app|comprar com dinheiro/i.exec(t.replace(/\/\*[\s\S]*?\*\//g, '')); A.ok(!m, 'pagamento real em ' + f + ': ' + (m && m[0]));
    });
  });
  resumo('economia.js');
})();
