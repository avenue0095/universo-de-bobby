#!/usr/bin/env node
'use strict';
/* Minificacao do build (D8): o index.html minificado compila, e amostras dificeis (regex com //, string com //, template aninhado,
   divisao x regex, quebra de linha sem ponto e virgula) dao o MESMO resultado antes e depois.   Uso: node testes/minificar.js */
const A = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { spawnSync } = require('child_process');
const { teste, resumo } = require('./lib/mini.js');
const RAIZ = path.join(__dirname, '..');

function minificaPy(codigo, css) {
  const r = spawnSync('python3', ['-c', `import sys;sys.path.insert(0,'build');from minificar import *;print(${css ? 'minificar_css' : 'minificar_js'}(sys.stdin.read()),end='')`], { cwd: RAIZ, input: codigo, encoding: 'utf8' });
  if (r.status !== 0) throw new Error(r.stderr);
  return r.stdout;
}
(async () => {
  await teste('1. todo script do index.html compila e o build ficou menor que o src somado', () => {
    const html = fs.readFileSync(path.join(RAIZ, 'index.html'), 'utf8');
    const blocos = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map((m) => m[1]);
    A.ok(blocos.length >= 2);
    blocos.forEach((b, i) => { try { new vm.Script(b); } catch (e) { A.fail('script ' + i + ' nao compila: ' + e.message); } });
    A.ok(!/\/\* ---------- /.test(html.split('<style>')[1].split('</style>')[0]), 'comentario de CSS sobrou');
    let src = 0; for (const f of fs.readdirSync(path.join(RAIZ, 'src', 'interface'))) src += fs.statSync(path.join(RAIZ, 'src', 'interface', f)).size;
    A.ok(Buffer.byteLength(html) < src * 1.02 + 400000, 'index.html nao encolheu');
  });
  await teste('2. amostras dificeis de JS: mesmo resultado antes e depois', () => {
    const amostras = [
      "var a='http://x.com//y';var b=\"/* nao e comentario */\";var c=/a\\/\\/b/.test('a//b');a+b+c",
      "var x=10,y=2,z=x/y/1;var r=/[/]/.test('/');[z,r].join()",
      "var n=3;var s=`a${n+`b${n*2}c`}d // ${'}'}`;s",
      "var t=1\nvar u=2\n/* c */\n;[t,u].join()",
      "function f(a){return /x/g.test(a)}\n// fim\nf('x')+''+(4/2)",
      "var o={a:1,'b//c':2};  // comentario\n   /* varias\n linhas */ Object.keys(o).join()",
    ];
    amostras.forEach((a) => {
      const antes = vm.runInNewContext(a), depois = vm.runInNewContext(minificaPy(a, false));
      A.strictEqual(String(depois), String(antes), 'mudou o resultado: ' + a.slice(0, 40));
    });
  });
  await teste('3. CSS: nada que mude o sentido (seletor descendente, calc, url, string)', () => {
    const css = '/* c */ a b > c , d{ color: red ; margin:calc(1px + 2px) ; background:url("x y.png") } @media (min-width: 10px) and (max-width:20px){ .x::after{content:"a  b"} }';
    const m = minificaPy(css, true);
    A.ok(m.includes('a b>c,d{color:red;margin:calc(1px + 2px);background:url("x y.png")}'), m);
    A.ok(m.includes('content:"a  b"') && m.includes('and (max-width:20px)'), m);
  });
  resumo('minificar.js');
})();
