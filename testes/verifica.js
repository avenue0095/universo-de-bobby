#!/usr/bin/env node
'use strict';
/* Verifica as 150 fases (10 mundos x 5 fases x 3 materias) sem navegador.
   Para cada fase gera perguntas varias vezes (o conteudo e sorteado) e checa:
   - sempre 8 perguntas;
   - todo gabarito presente nas opcoes (perguntas de multipla escolha);
   - sem opcao repetida;
   - sem "undefined", "NaN", "[object" nem decimal de ponto flutuante na tela;
   - sem numero negativo, salvo nas fases que ensinam negativos (MAT 10.4);
   - decimal escrito com virgula no gabarito nao vira ponto nas opcoes.
   Uso: node testes/verifica.js [--rodadas=60] [--semente=1]            */
const { carregarConteudo } = require('./lib/carregar.js');

const arg = (nome, padrao) => {
  const a = process.argv.find((x) => x.startsWith('--' + nome + '='));
  return a ? Number(a.split('=')[1]) : padrao;
};
const RODADAS = arg('rodadas', 60);
const SEMENTE = arg('semente', 1);

/* fases em que numero negativo e conteudo (a crianca aprende "abaixo de zero") */
const NEGATIVO_PERMITIDO = new Set(['10.4']);

const C = carregarConteudo(SEMENTE);
const materias = [['mat', C.UNITS_MAT], ['pt', C.UNITS_PT], ['en', C.UNITS_EN]];

const fs = require('fs');
const path = require('path');
const ESTRITO = process.argv.includes('--estrito');
/* Defeitos de conteudo que ja existiam antes da reorganizacao. A reforma nao muda comportamento,
   entao eles ficam LISTADOS aqui (nao escondidos) e so uma violacao NOVA derruba o teste.
   Com --estrito, os conhecidos tambem derrubam. */
const CONHECIDOS = JSON.parse(fs.readFileSync(path.join(__dirname, 'conhecidos.json'), 'utf8')).itens;
const falhas = new Map();  // chave -> {id,tipo,detalhe,n,conhecido}
let qAtual = '';
function falha(id, msg) {
  const tipo = msg.split(':')[0];
  const chave = id + '|' + tipo;
  const f = falhas.get(chave) || { id, tipo, enunciado: qAtual, exemplo: msg, n: 0 };
  f.n++;
  f.conhecido = CONHECIDOS.some((c) => c.fase === id && c.tipo === tipo);
  falhas.set(chave, f);
}

const RUIM = /undefined|NaN|\[object|Infinity|null/;
const FLUTUANTE = /\d\.\d{4,}|\d,\d{4,}/;           // 0.30000000000000004, 27,3333
const NEG = /(^|[\s(:=])[−-]\d/;                      // −3, -3

function textos(q) {
  const t = [q.prompt, q.answer];
  if (Array.isArray(q.options)) t.push(...q.options);
  return t.filter((x) => x !== undefined).map(String);
}

let fases = 0, perguntas = 0;
const porMateria = {};

for (const [mat, unidades] of materias) {
  porMateria[mat] = 0;
  for (const u of unidades) {
    for (const l of u.lessons) {
      fases++; porMateria[mat]++;
      for (let r = 0; r < RODADAS; r++) {
        let qs;
        try { qs = C.genQuestions(l, 8); }
        catch (e) { falha(l.id, 'genQuestions lancou: ' + e.message); continue; }
        if (qs.length !== 8) falha(l.id, 'gerou ' + qs.length + ' perguntas, esperado 8');
        const vistos = new Set();
        for (const q of qs) {
          perguntas++; qAtual = (q && q.prompt) || '';
          if (!q || typeof q.prompt !== 'string' || !q.prompt.trim()) { falha(l.id, 'pergunta sem enunciado'); continue; }
          if (q.answer === undefined || String(q.answer).trim() === '') falha(l.id, 'sem gabarito: ' + q.prompt.slice(0, 50));
          const chave = q.prompt + '|' + q.answer;
          if (vistos.has(chave)) falha(l.id, 'pergunta repetida na mesma fase: ' + q.prompt.slice(0, 50));
          vistos.add(chave);

          for (const t of textos(q)) {
            const limpo = t.replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ');
            if (RUIM.test(limpo) && !/\bnull\b/.test(limpo.replace(/undefined|NaN/g, '')) ) {
              if (/undefined|NaN|\[object|Infinity/.test(limpo)) falha(l.id, 'texto com valor invalido: ' + limpo.slice(0, 60));
            }
            if (FLUTUANTE.test(limpo)) falha(l.id, 'ponto flutuante na tela: ' + limpo.slice(0, 60));
          }
          if (q.type === 'mc') {
            if (!Array.isArray(q.options) || q.options.length < 2) { falha(l.id, 'mc com menos de 2 opcoes: ' + q.prompt.slice(0, 50)); continue; }
            if (!q.options.map(String).includes(String(q.answer))) falha(l.id, 'gabarito fora das opcoes: ' + q.prompt.slice(0, 50));
            if (q.options.some((o) => String(o) !== String(o).trim())) falha(l.id, 'opcao com espaco no fim ou no comeco: ' + q.options.map((o) => JSON.stringify(String(o))).join(' | '));
            const norm = q.options.map((o) => String(o).trim());
            if (new Set(norm).size !== norm.length) falha(l.id, 'opcao repetida: ' + q.prompt.slice(0, 50) + ' -> ' + norm.join(' | '));
            /* decimal com virgula no gabarito: nenhuma opcao pode usar ponto */
            if (/^\d+,\d+$/.test(String(q.answer)) && q.options.some((o) => /^\d+\.\d+$/.test(String(o)))) {
              falha(l.id, 'opcao com ponto decimal: ' + q.options.join(' | '));
            }
            if (!NEGATIVO_PERMITIDO.has(l.id) && !q.negativo && !NEG.test(q.prompt)) {
              if (q.options.some((o) => NEG.test(' ' + o)) || NEG.test(' ' + q.answer)) {
                falha(l.id, 'opcao negativa fora da fase de negativos: ' + q.options.join(' | '));
              }
            }
          } else if (!NEGATIVO_PERMITIDO.has(l.id) && !q.negativo && /^\s*[−-]\d/.test(String(q.answer))) {
            falha(l.id, 'gabarito negativo fora da fase de negativos: ' + q.prompt.slice(0, 50));
          }
        }
      }
    }
  }
}

console.log('verifica.js: semente=' + SEMENTE + ' rodadas por fase=' + RODADAS);
console.log('fases verificadas: ' + fases + ' (mat ' + porMateria.mat + ', pt ' + porMateria.pt + ', en ' + porMateria.en + ')');
console.log('perguntas examinadas: ' + perguntas);
if (fases !== 150) { console.log('ERRO: esperado 150 fases, achei ' + fases); process.exitCode = 1; }
const todas = [...falhas.values()];
const novas = todas.filter((f) => !f.conhecido);
const conhecidas = todas.filter((f) => f.conhecido);
const mostra = (f) => '  fase ' + f.id + ' [' + f.tipo + '] x' + f.n + ' | ' + f.enunciado.replace(/<[^>]*>/g, '').slice(0, 70);
if (conhecidas.length) {
  console.log('\nDEFEITOS CONHECIDOS (ja existiam no c9b07e9; ver testes/conhecidos.json): ' + conhecidas.length);
  conhecidas.forEach((f) => console.log(mostra(f)));
}
if (novas.length) {
  console.log('\nVIOLACOES NOVAS: ' + novas.length);
  novas.forEach((f) => console.log(mostra(f) + '\n      ex.: ' + f.exemplo.replace(/<[^>]*>/g, '').slice(0, 160)));
  process.exitCode = 1;
} else if (!process.exitCode) {
  if (conhecidas.length && ESTRITO) { console.log('\nFALHA (--estrito): ha defeitos conhecidos'); process.exitCode = 1; }
  else console.log('\nOK: nenhuma violacao nova nas 150 fases' + (conhecidas.length ? ' (' + conhecidas.length + ' defeitos conhecidos listados acima)' : ''));
}
