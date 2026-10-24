#!/usr/bin/env node
'use strict';
/* Service worker: a ativacao so apaga caches antigos DESTA app (bobby-*), nunca o cache de audio (bobby-audio-*)
   nem caches de outras origens de codigo. Roda sw.js num contexto falso.   Uso: node testes/sw.js */
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const A = require('assert');
const { teste, resumo } = require('./lib/mini.js');

async function ativar(existentes) {
  const apagados = [];
  const ouvintes = {};
  const sandbox = {
    self: { addEventListener: (n, f) => { ouvintes[n] = f; }, clients: { claim: async () => {} }, skipWaiting: async () => {} },
    caches: { keys: async () => existentes.slice(), delete: async (k) => { apagados.push(k); return true; }, open: async () => ({ addAll: async () => {} }), match: async () => null },
    console,
  };
  vm.createContext(sandbox);
  vm.runInContext(fs.readFileSync(path.join(__dirname, '..', 'sw.js'), 'utf8'), sandbox);
  let espera;
  ouvintes.activate({ waitUntil: (p) => { espera = p; } });
  await espera;
  return apagados;
}
(async () => {
  await teste('1. ativacao apaga so cache antigo da app (bobby-v*) e preserva o atual', async () => {
    const ap = await ativar(['bobby-v1', 'bobby-v2', 'bobby-v3']);
    A.strictEqual(JSON.stringify(ap), JSON.stringify(['bobby-v1', 'bobby-v2']));
  });
  await teste('2. nunca apaga bobby-audio-* (cache de audio gravado)', async () => {
    const ap = await ativar(['bobby-v2', 'bobby-v3', 'bobby-audio-core-v1', 'bobby-audio-en-v1']);
    A.strictEqual(JSON.stringify(ap), JSON.stringify(['bobby-v2']));
  });
  await teste('3. nao mexe em cache que nao e da app', async () => {
    const ap = await ativar(['outro-app-v1', 'workbox-precache', 'bobby-v1']);
    A.strictEqual(JSON.stringify(ap), JSON.stringify(['bobby-v1']));
  });
  resumo('sw.js');
})();
