#!/usr/bin/env node
'use strict';
/* Trava da URL de entrada: o GitHub Pages serve da raiz e quem ja instalou o app depende disto.
   Falha se alguem mudar start_url, scope, o nome index.html ou tirar o index.html do cache do SW. */
const fs = require('fs');
const path = require('path');
const assert = require('assert');
const RAIZ = path.resolve(__dirname, '..');
const erros = [];
const t = (nome, fn) => { try { fn(); console.log('  PASSOU  ' + nome); } catch (e) { erros.push(nome); console.log('  FALHOU  ' + nome + '\n          -> ' + e.message); } };

console.log('trava-url.js');
const man = JSON.parse(fs.readFileSync(path.join(RAIZ, 'manifest.webmanifest'), 'utf8'));
const sw = fs.readFileSync(path.join(RAIZ, 'sw.js'), 'utf8');
const html = fs.readFileSync(path.join(RAIZ, 'index.html'), 'utf8');
t('index.html existe na raiz', () => assert(fs.statSync(path.join(RAIZ, 'index.html')).size > 100000));
t('manifest: start_url e ./index.html', () => assert.strictEqual(man.start_url, './index.html'));
t('manifest: scope e ./', () => assert.strictEqual(man.scope, './'));
t('manifest: icones existem', () => man.icons.forEach((i) => assert(fs.existsSync(path.join(RAIZ, i.src)), i.src)));
t('sw.js guarda ./index.html e ./ no cache', () => { assert(/ARQUIVOS=\[[^\]]*'\.\/index\.html'/.test(sw)); assert(/ARQUIVOS=\[\s*'\.\/'/.test(sw)); });
t('index.html aponta para ./manifest.webmanifest', () => assert(html.includes('<link rel="manifest" href="./manifest.webmanifest">')));
t('index.html registra ./sw.js', () => assert(/serviceWorker\.register\(\s*['"]\.\/sw\.js/.test(html)));
t('index.html na raiz nao tem marcador do build solto', () => assert(!/<!--@(script|style)/.test(html)));
process.exit(erros.length ? 1 : 0);
