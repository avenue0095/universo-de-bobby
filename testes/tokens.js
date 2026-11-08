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
    ['--p', '--e', '--ub', '--c1', '--c2', '--x', '--y', '--aro', '--d', '--w', '--cor-da-tinta', '--op', '--nx', '--dx', '--dy', '--w', '--h', '--anda-ms', '--obj', '--jit', '--camada', '--rot-dx', '--i', '--camada-pendurado'].forEach((x) => definidos.add(x));
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
    const livres = ['estado.js', 'personagem.js']; /* o ultimo sai na etapa do personagem */
    const ruins = [];
    for (const f of fs.readdirSync(dir).filter((x) => x.endsWith('.js') && !livres.includes(x))) {
      const src = semComentario(fs.readFileSync(path.join(dir, f), 'utf8')).replace(/&#\d+;/g, '');
      if (HEX.test(src)) ruins.push(f);
    }
    vazio(ruins);
  });
  await teste('9. contraste AA dos pares do DESIGN.md (2.5), calculado nos tokens do CSS, claro e escuro', () => {
    const bloco = (ini) => { const i = css.indexOf(ini); const f = css.indexOf('}', i); return css.slice(i, f); };
    const lerHex = (b) => { const m = {}; for (const x of b.matchAll(/(--[a-z0-9-]+):\s*(#[0-9A-Fa-f]{6})/g)) m[x[1]] = x[2]; return m; };
    const claro = lerHex(bloco(':root {\n  color-scheme'));
    const escuro = Object.assign({}, claro, lerHex(bloco(':root[data-theme="dark"] {')));
    const lum = (h) => { const c = [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4))); return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]; };
    const razao = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
    const texto = [['cor-texto', 'cor-fundo'], ['cor-texto', 'cor-superficie'], ['cor-texto', 'cor-superficie-2'], ['cor-texto-suave', 'cor-fundo'], ['cor-texto-suave', 'cor-superficie'], ['cor-texto-suave', 'cor-superficie-2'],
      ['cor-acerto', 'cor-superficie'], ['cor-texto', 'cor-acerto-suave'], ['cor-ainda', 'cor-superficie'], ['cor-texto', 'cor-ainda-suave'], ['cor-ouro-sobre', 'cor-ouro'], ['cor-acao-sobre', 'cor-acao'], ['cor-gelo-sobre', 'cor-gelo'],
      ['cor-ouro-borda', 'cor-superficie'], ['cor-acao-borda', 'cor-superficie'], ['cor-texto', 'mat-suave'], ['cor-texto', 'por-suave'], ['cor-texto', 'ing-suave']];
    ['mat', 'por', 'ing'].forEach((m) => { texto.push([m + '-sobre', m + '-base'], [m + '-tinta', 'cor-superficie'], [m + '-tinta', m + '-suave']); });
    A.ok(Object.keys(claro).length > 40 && Object.keys(escuro).length > 40, 'nao li os tokens');
    const nao = [];
    [['claro', claro], ['escuro', escuro]].forEach(([nome, t]) => texto.forEach(([f, b]) => { const r = razao(t['--' + f], t['--' + b]); if (!(r >= 4.5)) nao.push(nome + ' ' + f + '/' + b + ' ' + r.toFixed(2)); }));
    [['claro', claro], ['escuro', escuro]].forEach(([nome, t]) => [['cor-linha-forte', 'cor-superficie'], ['cor-foco', 'cor-fundo'], ['cor-foco', 'cor-superficie']].forEach(([f, b]) => { const r = razao(t['--' + f], t['--' + b]); if (!(r >= 3)) nao.push(nome + ' ' + f + '/' + b + ' ' + r.toFixed(2)); }));
    vazio(nao, 'abaixo do minimo: ');
  });
  await teste('10. foco visivel cobre os componentes tocaveis (nos, alternativas, teclas, chips, swatches, barra) e hover so com ponteiro', () => {
    const fv = (fora.match(/:focus-visible/g) || []).length;
    A.ok(fv >= 12, 'poucos :focus-visible: ' + fv);
    ['.no .bt', '.alt', '.tecla', '.chip-ctl', '.tinta', '.barra-baixo button', '.mini-pose', '.des-card'].forEach((sel) => A.ok(fora.includes(sel + ':focus-visible'), 'sem foco em ' + sel));
    const hovers = fora.split('\n').filter((l) => /:hover/.test(l));
    const soPonteiro = fora.slice(fora.indexOf('@media (hover:hover)'));
    A.ok(soPonteiro.includes('.alt:hover') && soPonteiro.includes('.tecla:hover'), 'hover de alternativa e tecla fora de (hover:hover)');
    A.ok(hovers.length > 6);
  });
  await teste('11. icones de svg com largura e altura em multiplos de 4 px (as figuras das aulas ficam fora)', () => {
    const ruins = [];
    for (const m of fora.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
      if (!/svg|ic-arte/.test(m[1]) || /\.fig|\.md|\.barra|\.cubinho|\.placa|\.cen|\.chart/.test(m[1])) continue;
      for (const n of m[2].matchAll(/(?:width|height):\s*(\d+)px/g)) if (+n[1] % 4) ruins.push(m[1].trim().slice(0, 40) + ' ' + n[0]);
    }
    vazio(ruins);
  });
  resumo('tokens.js');
})();
