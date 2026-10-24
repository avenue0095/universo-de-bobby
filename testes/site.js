#!/usr/bin/env node
'use strict';
/* dist/site: so o que vai ao publico. Monta numa pasta temporaria (nao mexe em dist/) e confere: nenhuma pasta proibida, so extensoes esperadas,
   tamanho abaixo do teto, index.html identico ao da raiz, todo arquivo que o service worker pre-carrega existe.   Uso: node testes/site.js */
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');
const A = require('assert');
const { teste, resumo } = require('./lib/mini.js');
const RAIZ = path.resolve(__dirname, '..');
const SAIDA = fs.mkdtempSync(path.join(os.tmpdir(), 'bobby-site-'));
const r = spawnSync('python3', [path.join(RAIZ, 'build', 'site.py'), '--saida', SAIDA], { encoding: 'utf8' });
const todos = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? todos(path.join(d, e.name)) : [path.join(d, e.name)]));
const arquivos = r.status === 0 ? todos(SAIDA).map((f) => path.relative(SAIDA, f)) : [];
const PROIBIDAS = ['arte', 'docs', 'pesquisa', 'src', 'build', 'testes', '.git', 'node_modules', 'dist', 'ferramentas'];
const TETO_MB = 75;

(async () => {
  await teste('1. build/site.py roda e monta a pasta', () => { A.strictEqual(r.status, 0, r.stderr); A.ok(arquivos.length > 3000, 'poucos arquivos: ' + arquivos.length); });
  await teste('2. nenhuma pasta proibida (arte, docs, pesquisa, src, build, testes, .git, node_modules, ferramentas)', () => {
    const ruins = arquivos.filter((f) => f.split(path.sep).some((p) => PROIBIDAS.includes(p)));
    A.ok(ruins.length === 0, 'no site publico: ' + ruins.slice(0, 5).join(', '));
  });
  await teste('3. so extensoes do app: html, js (apenas sw.js), json, webmanifest, png, svg, webp, woff2, txt das licencas, m4a e _headers; sem .md, .py, .sh, .tsv, .jpg, .env', () => {
    const ok = /\.(html|json|webmanifest|png|svg|webp|woff2|m4a|ico)$/;
    const ruins = arquivos.filter((f) => !(ok.test(f) || f === 'sw.js' || f === '_headers' || f === '.nojekyll' || /^assets\/fontes\/OFL-[A-Za-z]+\.txt$/.test(f) || f === 'assets/musica/LICENCAS.txt'));
    A.ok(ruins.length === 0, 'arquivo fora da lista: ' + ruins.slice(0, 5).join(', '));
    A.ok(!arquivos.some((f) => /manifesto\.json$/.test(f) && f.startsWith('audio/')), 'manifesto.json de audio (texto das falas) nao deve ir');
  });
  await teste('4. tamanho: abaixo de ' + TETO_MB + ' MB (m4a apenas) e o index.html pesa menos de 1 MB', () => {
    const total = arquivos.reduce((a, f) => a + fs.statSync(path.join(SAIDA, f)).size, 0);
    console.log('          dist/site: ' + arquivos.length + ' arquivos, ' + (total / 1048576).toFixed(1) + ' MB');
    A.ok(total < TETO_MB * 1048576, 'passou do teto: ' + (total / 1048576).toFixed(1) + ' MB');
    A.ok(fs.statSync(path.join(SAIDA, 'index.html')).size < 1048576);
  });
  await teste('5. index.html e sw.js identicos aos da raiz, e tudo que o service worker pre-carrega existe no site', () => {
    ['index.html', 'sw.js', 'manifest.webmanifest'].forEach((f) => A.ok(fs.readFileSync(path.join(SAIDA, f)).equals(fs.readFileSync(path.join(RAIZ, f))), f + ' difere'));
    const sw = fs.readFileSync(path.join(SAIDA, 'sw.js'), 'utf8');
    const lista = sw.match(/const ARQUIVOS=\[([^\]]*)\]/)[1].match(/'([^']+)'/g).map((x) => x.slice(1, -1));
    lista.forEach((u) => { const f = u === './' ? 'index.html' : u.replace(/^\.\//, ''); A.ok(fs.existsSync(path.join(SAIDA, f)), 'o sw pre-carrega ' + u + ' e ele nao esta no site'); });
    const man = JSON.parse(fs.readFileSync(path.join(SAIDA, 'assets', 'manifesto.json'), 'utf8')).itens;
    Object.values(man).forEach((m) => A.ok(fs.existsSync(path.join(SAIDA, 'assets', m.a)), 'falta assets/' + m.a));
  });
  await teste('6. _headers com CSP e demais cabecalhos de seguranca; a CSP do cabecalho contem a da meta do HTML', () => {
    const h = fs.readFileSync(path.join(SAIDA, '_headers'), 'utf8');
    ['Content-Security-Policy:', 'frame-ancestors', 'Strict-Transport-Security', 'X-Content-Type-Options: nosniff', 'Referrer-Policy: no-referrer', 'Permissions-Policy', 'Cross-Origin-Opener-Policy'].forEach((x) => A.ok(h.includes(x), 'falta ' + x));
    const meta = fs.readFileSync(path.join(SAIDA, 'index.html'), 'utf8').match(/Content-Security-Policy" content="([^"]+)"/)[1];
    meta.split(';').map((s) => s.trim()).filter(Boolean).forEach((d) => A.ok(h.includes(d), 'diretiva da meta ausente do cabecalho: ' + d));
  });
  await teste('7. nenhuma chave, senha ou arquivo .env no site publico', () => {
    const ruins = arquivos.filter((f) => /\.env|\.pem$|\.key$|id_rsa/i.test(f));
    A.ok(ruins.length === 0);
    const html = fs.readFileSync(path.join(SAIDA, 'index.html'), 'utf8');
    A.ok(!/(sk-[A-Za-z0-9]{20,}|AIza[0-9A-Za-z_-]{30,}|-----BEGIN [A-Z ]*PRIVATE KEY)/.test(html), 'padrao de chave no index.html');
  });
  try { fs.rmSync(SAIDA, { recursive: true, force: true }); } catch (e) { /* temporaria */ }
  resumo('site.js');
})();
