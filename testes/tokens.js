#!/usr/bin/env node
'use strict';
/* Regras do DESIGN.md sobre o CSS INTEIRO (nao so o novo):
   hex e rgba so dentro dos blocos :root; todo var(--x) existe; fonte so por token; espaco na grade de 8 px; raio so por token.
   O JavaScript da interface nao pinta com hex (so os dados de cor guardados no perfil, listados abaixo).   Uso: node testes/tokens.js */
const fs = require('fs');
const path = require('path');
const A = require('assert');
const { teste, resumo } = require('./lib/mini.js');

const dir = path.join(__dirname, '..', 'src', 'interface');
const css = fs.readFileSync(path.join(dir, 'style.css'), 'utf8');
const semComentario = (t) => t.replace(/\/\*[\s\S]*?\*\//g, '');
const limpo = semComentario(css);

/* tira os blocos cujo seletor menciona :root (o unico lugar onde hex e rgba podem existir), respeitando @media aninhado */
function semRoot(t) {
  let out = '', i = 0;
  while (i < t.length) {
    const ab = t.indexOf('{', i);
    if (ab < 0) { out += t.slice(i); break; }
    const seletor = t.slice(i, ab);
    let prof = 1, j = ab + 1;
    while (j < t.length && prof) { if (t[j] === '{') prof++; else if (t[j] === '}') prof--; j++; }
    const corpo = t.slice(ab + 1, j - 1);
    if (/^\s*@media/.test(seletor)) out += seletor + '{' + semRoot(corpo) + '}';
    else if (/:root/.test(seletor)) out += '';
    else out += seletor + '{' + corpo + '}';
    i = j;
  }
  return out;
}
const fora = semRoot(limpo);
const vazio = (lista, msg) => A.ok(lista.length === 0, (msg || '') + lista.slice(0, 40).join(' | '));
const HEX = /#[0-9a-fA-F]{3,8}\b/;

(async () => {
  await teste('1. nenhum hex nem rgba fora dos blocos :root (CSS inteiro)', () => {
    const ruins = fora.split('\n').filter((l) => HEX.test(l) || /rgba?\(/.test(l));
    vazio(ruins.map((l) => l.trim().slice(0, 100)));
  });
  await teste('2. todo var(--x) do CSS existe como token (ou e definido inline pelo componente)', () => {
    const definidos = new Set(limpo.match(/--[a-z0-9-]+(?=\s*:)/g) || []);
    ['--p', '--e', '--ub', '--c1', '--c2', '--x', '--y', '--aro', '--d', '--w'].forEach((x) => definidos.add(x));
    const usados = new Set((limpo.match(/var\((--[a-z0-9-]+)/g) || []).map((x) => x.slice(4)));
    const faltam = [...usados].filter((u) => !definidos.has(u));
    vazio(faltam, 'token inexistente: ');
  });
  await teste('3. escala tipografica fixa: font-size so por token --t-* (ou em/inherit)', () => {
    const ruins = fora.split('\n').filter((l) => /font-size:\s*[\d.]+px/.test(l));
    vazio(ruins.map((l) => l.trim().slice(0, 100)));
  });
  await teste('4. grade de 8 px: padding, margin e gap so com 0, 4, 8, 16, 24, 32, 40, 48, 64, 96 (ou calc/var)', () => {
    const ok = new Set([0, 4, 8, 16, 24, 32, 40, 48, 64, 96]);
    const ruins = [];
    for (const m of fora.matchAll(/(?:^|[;{\s])((?:padding|margin|gap|row-gap|column-gap)(?:-[a-z]+)?)\s*:\s*([^;{}]*)/g)) {
      if (/calc\(|env\(/.test(m[2])) continue;
      for (const n of m[2].matchAll(/(-?\d+(?:\.\d+)?)px/g)) if (!ok.has(Math.abs(+n[1]))) ruins.push(m[1] + ':' + m[2].trim());
    }
    vazio([...new Set(ruins)]);
  });
  await teste('5. raios so por token --raio-* (ou 0 e 50% em formas redondas)', () => {
    const ruins = fora.split('\n').filter((l) => /border-radius:\s*[\d.]+px/.test(l) && !/border-radius:\s*0px/.test(l));
    vazio(ruins.map((l) => l.trim().slice(0, 100)));
  });
  await teste('6. bloco de tokens do DESIGN.md esta no CSS (claro, escuro automatico e escuro manual)', () => {
    ['--cor-fundo', '--cor-acao', '--cor-gelo', '--esp-8', '--toque-min', '--mat-base', '--por-base', '--ing-base'].forEach((t) => A.ok(css.includes(t + ':'), t + ' nao definido'));
    A.ok(/prefers-color-scheme: dark\) \{\s*:root:not\(\[data-theme="light"\]\)/.test(css));
    A.ok(css.includes(':root[data-theme="dark"]'));
  });
  await teste('7. fontes hospedadas no app: sem Google Fonts nem CDN de fonte no HTML e no CSS', () => {
    const shell = fs.readFileSync(path.join(dir, 'shell.html'), 'utf8');
    A.ok(!/fonts\.(googleapis|gstatic)/.test(shell + css));
    ['Fredoka-variavel-latin.woff2', 'Nunito-variavel-latin.woff2', 'OFL-Fredoka.txt', 'OFL-Nunito.txt'].forEach((f) => A.ok(fs.existsSync(path.join(__dirname, '..', 'assets', 'fontes', f)), f));
  });
  await teste('8. JavaScript da interface nao pinta com hex (dados de cor do perfil ficam em estado.js)', () => {
    const livres = ['estado.js', 'cenario-e-materias.js', 'personagem.js', 'telas-auxiliares.js']; /* os tres ultimos saem nas etapas do mapa, do personagem e do desenho */
    const ruins = [];
    for (const f of fs.readdirSync(dir).filter((x) => x.endsWith('.js') && !livres.includes(x))) {
      const src = semComentario(fs.readFileSync(path.join(dir, f), 'utf8')).replace(/&#\d+;/g, '');
      if (HEX.test(src)) ruins.push(f);
    }
    vazio(ruins);
  });
  resumo('tokens.js');
})();
