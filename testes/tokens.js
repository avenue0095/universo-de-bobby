#!/usr/bin/env node
'use strict';
/* Regra do DESIGN.md: hex solto fora do :root e bug. Vale para o CSS NOVO (a partir do marcador "Componentes do ciclo diario")
   e para o JavaScript novo da interface do ciclo. O CSS antigo ainda usa hex em varios lugares: isso fica na lista da migracao visual.
   Tambem confere que todo var(--nome) do CSS novo existe num :root.   Uso: node testes/tokens.js     */
const fs = require('fs');
const path = require('path');
const A = require('assert');
const { teste, resumo } = require('./lib/mini.js');

const css = fs.readFileSync(path.join(__dirname, '..', 'src', 'interface', 'style.css'), 'utf8');
const MARCA = 'Componentes do ciclo diário';
const novo = css.slice(css.indexOf(MARCA));
const HEX = /#[0-9a-fA-F]{3,8}\b/;
const semComentario = (t) => t.replace(/\/\*[\s\S]*?\*\//g, '');

(async () => {
  await teste('1. CSS novo (componentes do ciclo diario) nao tem hex solto', () => {
    A.ok(css.includes(MARCA), 'marcador do CSS novo sumiu');
    const ruins = semComentario(novo).split('\n').filter((l) => HEX.test(l));
    A.deepStrictEqual(ruins, [], 'hex fora do :root: ' + ruins.join(' | '));
  });
  await teste('2. todo var(--x) do CSS novo existe como token', () => {
    const definidos = new Set((css.match(/--[a-z0-9-]+(?=\s*:)/g) || []));
    const usados = new Set((semComentario(novo).match(/var\((--[a-z0-9-]+)/g) || []).map((x) => x.slice(4)));
    const faltam = [...usados].filter((u) => !definidos.has(u));
    A.deepStrictEqual(faltam, [], 'token inexistente: ' + faltam.join(', '));
  });
  await teste('3. escala tipografica fixa e grade de 8 px no CSS novo (so tokens --t-* e --esp-*)', () => {
    const ruins = semComentario(novo).split('\n').filter((l) => /font-size:\s*\d+px/.test(l) && !/@media|barra-baixo button span/.test(l));
    A.deepStrictEqual(ruins, [], 'font-size solto: ' + ruins.join(' | '));
  });
  await teste('4. JavaScript do ciclo nao usa cor em hex', () => {
    for (const f of ['ciclo-ui.js', 'ciclo.js', 'backup.js']) {
      const src = semComentario(fs.readFileSync(path.join(__dirname, '..', 'src', 'interface', f), 'utf8'));
      A.ok(!HEX.test(src.replace(/&#\d+;/g, '')), f + ' tem hex');
    }
  });
  await teste('5. bloco de tokens do DESIGN.md esta no CSS (claro, escuro automatico e escuro manual)', () => {
    ['--cor-fundo', '--cor-acao', '--cor-gelo', '--esp-8', '--toque-min', '--mat-base'].forEach((t) => A.ok(css.includes(t + ':'), t + ' nao definido'));
    A.ok(/prefers-color-scheme: dark\) \{\s*:root:not\(\[data-theme="light"\]\)/.test(css));
    A.ok(css.includes(':root[data-theme="dark"]'));
  });
  resumo('tokens.js');
})();
