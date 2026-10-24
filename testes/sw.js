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
    const ap = await ativar(['bobby-v1', 'bobby-v2', 'bobby-v3', 'bobby-v6']);
    A.strictEqual(JSON.stringify(ap), JSON.stringify(['bobby-v1', 'bobby-v2', 'bobby-v3']));
  });
  await teste('2. nunca apaga bobby-audio-* (cache de audio gravado)', async () => {
    const ap = await ativar(['bobby-v2', 'bobby-v6', 'bobby-audio-v1', 'bobby-audio-core-v1', 'bobby-audio-en-v1', 'bobby-arte-v1']);
    A.strictEqual(JSON.stringify(ap), JSON.stringify(['bobby-v2']));
  });
  await teste('3. nao mexe em cache que nao e da app', async () => {
    const ap = await ativar(['outro-app-v1', 'workbox-precache', 'bobby-v1']);
    A.strictEqual(JSON.stringify(ap), JSON.stringify(['bobby-v1']));
  });
  await teste('4. clipe de audio: cache primeiro (so vai a rede se faltar) e guarda em bobby-audio-v1; pagina continua network-first', async () => {
    const guardado = {}; const rede = [];
    const mk = (nome) => ({ match: async (r) => guardado[nome + '|' + (r.url || r)] || null, put: async (r, resp) => { guardado[nome + '|' + (r.url || r)] = resp; }, addAll: async () => {} });
    const ouvintes = {};
    const sandbox = {
      self: { addEventListener: (n, f) => { ouvintes[n] = f; }, clients: { claim: async () => {} }, skipWaiting: async () => {} },
      caches: { keys: async () => [], delete: async () => true, open: async (n) => mk(n), match: async () => null },
      fetch: async (req) => { rede.push(req.url); return { status: 200, type: 'basic', clone() { return this; }, texto: 'rede' }; },
      URL, console,
    };
    vm.createContext(sandbox);
    vm.runInContext(fs.readFileSync(path.join(__dirname, '..', 'sw.js'), 'utf8'), sandbox);
    const pede = async (url, extra) => { let r; ouvintes.fetch({ request: Object.assign({ url, method: 'GET', mode: 'cors', destination: '', headers: { get: () => '' } }, extra || {}), respondWith: (p) => { r = p; } }); return r && await r; };
    const clipe = 'https://x.test/audio/pt-br/numero/zero-33dae30b.m4a';
    await pede(clipe);                       // 1a vez: rede, e guarda
    A.strictEqual(rede.length, 1); A.ok(guardado['bobby-audio-v1|' + clipe], 'nao guardou em bobby-audio-v1');
    await pede(clipe);                       // 2a vez: cache, sem rede
    A.strictEqual(rede.length, 1, 'foi a rede de novo com o clipe em cache');
    await pede('https://x.test/index.html', { mode: 'navigate' });
    A.strictEqual(rede.length, 2, 'a pagina tem que ir a rede primeiro');
    await pede('https://x.test/audio/manifesto-min.json');
    A.strictEqual(rede.length, 3, 'o manifesto vai a rede primeiro');
    A.ok(!Object.keys(guardado).some((k) => k.startsWith('bobby-v6|') && /audio/.test(k)), 'audio caiu no cache da app');
  });
  await teste('5b. origem: audio e arte de OUTRO dominio nao entram no cache; rota que nao e o inicio nao troca o index.html', async () => {
    const guardado = {}; const ouvintes = {};
    const mk = (nome) => ({ match: async (r) => guardado[nome + '|' + (r.url || r)] || null, put: async (r) => { guardado[nome + '|' + (r.url || r)] = 1; }, add: async () => {}, addAll: async () => {} });
    const sandbox = {
      self: { location: { origin: 'https://app.test', href: 'https://app.test/jogo/sw.js' }, addEventListener: (n, f) => { ouvintes[n] = f; }, clients: { claim: async () => {} }, skipWaiting: async () => {} },
      caches: { keys: async () => [], delete: async () => true, open: async (n) => mk(n), match: async () => null },
      fetch: async () => ({ status: 200, type: 'basic', clone() { return this; } }), URL, console,
    };
    vm.createContext(sandbox);
    vm.runInContext(fs.readFileSync(path.join(__dirname, '..', 'sw.js'), 'utf8'), sandbox);
    const pede = async (url, extra) => { let r; ouvintes.fetch({ request: Object.assign({ url, method: 'GET', mode: 'cors', destination: '', headers: { get: () => '' } }, extra || {}), respondWith: (p) => { r = p; } }); return r && await r; };
    await pede('https://outro.test/audio/x/y.m4a'); await pede('https://outro.test/assets/cenarios/a.webp');
    A.ok(!Object.keys(guardado).some((k) => /outro\.test/.test(k)), 'guardou recurso de outro dominio: ' + Object.keys(guardado));
    await pede('https://app.test/jogo/outra-rota', { mode: 'navigate' }); await new Promise((r) => setTimeout(r, 20));
    A.ok(!guardado['bobby-v6|./index.html'], 'rota estranha trocou o index.html do cache');
    await pede('https://app.test/jogo/index.html', { mode: 'navigate' }); await new Promise((r) => setTimeout(r, 20));
    A.ok(guardado['bobby-v6|./index.html'], 'o inicio do app deveria atualizar o index.html guardado');
  });
  await teste('5. arte: cache primeiro em bobby-arte-v1, nunca no cache da app; precache so da camada inicial', async () => {
    const guardado = {}; const rede = [];
    const mk = (nome) => ({ match: async (r) => guardado[nome + '|' + (r.url || r)] || null, put: async (r) => { guardado[nome + '|' + (r.url || r)] = 1; }, add: async (u) => { guardado[nome + '|' + u] = 1; }, addAll: async () => {} });
    const ouvintes = {};
    const manifesto = { itens: { a: { a: 'x/a.webp', inicial: true }, b: { a: 'x/b.webp', inicial: false } } };
    const sandbox = {
      self: { addEventListener: (n, f) => { ouvintes[n] = f; }, clients: { claim: async () => {} }, skipWaiting: async () => {} },
      caches: { keys: async () => [], delete: async () => true, open: async (n) => mk(n), match: async () => null },
      fetch: async (req) => { const u = req.url || req; rede.push(u); return { status: 200, type: 'basic', clone() { return this; }, json: async () => manifesto }; },
      URL, console,
    };
    vm.createContext(sandbox);
    vm.runInContext(fs.readFileSync(path.join(__dirname, '..', 'sw.js'), 'utf8'), sandbox);
    let espera; ouvintes.install({ waitUntil: (p) => { espera = p; } }); await espera;
    A.ok(guardado['bobby-arte-v1|./assets/x/a.webp'], 'a camada inicial nao foi guardada');
    A.ok(!guardado['bobby-arte-v1|./assets/x/b.webp'], 'a camada sob demanda foi guardada na instalacao');
    const img = 'https://x.test/assets/cenarios/cen-mat01-completo.webp';
    let r; ouvintes.fetch({ request: { url: img, method: 'GET', mode: 'no-cors', destination: 'image', headers: { get: () => '' } }, respondWith: (p) => { r = p; } }); await r;
    A.ok(guardado['bobby-arte-v1|' + img], 'imagem nao entrou em bobby-arte-v1');
    A.ok(!Object.keys(guardado).some((k) => k.startsWith('bobby-v6|') && /assets/.test(k)), 'arte caiu no cache da app');
  });
  resumo('sw.js');
})();
