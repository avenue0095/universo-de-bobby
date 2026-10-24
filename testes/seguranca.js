#!/usr/bin/env node
'use strict';
/* Seguranca dos dados que entram no app. Importa um backup MALICIOSO (e um localStorage adulterado) e prova que nada executa:
   nenhum HTML escrito pelo app contem tag fora da lista, atributo de evento, javascript: ou chave __proto__.   Uso: node testes/seguranca.js */
const A = require('assert');
const { carregarApp, carregarModulos, carregarConteudo, HTML_LOG } = require('./lib/carregar.js');
const { teste, resumo } = require('./lib/mini.js');

const XSS = ['<img src=x onerror=alert(1)>', '<script>alert(1)</script>', '"><svg onload=alert(1)>', 'javascript:alert(1)', '<a href="javascript:alert(1)">x</a>', '<b onmouseover=alert(1)>x</b>', '&#60;img src=x onerror=alert(1)&#62;'];
const PERIGO = /<\s*(img|script|iframe|object|embed|link|style|a|form|input|body|html|meta)\b|\son[a-z]+\s*=|javascript:|<svg[^>]*\son/i;
const J = (x) => JSON.parse(JSON.stringify(x));

function backupMalicioso() {
  const q = (n) => ({ type: 'mc', prompt: XSS[n % XSS.length] + ' quanto é 2+2?', options: [XSS[(n + 1) % XSS.length], '4', XSS[(n + 2) % XSS.length]], answer: XSS[(n + 3) % XSS.length], figure: '<svg onload=alert(1)><script>alert(1)</script></svg>', lang: '" onclick="alert(1)', ouvir: '<img src=x onerror=alert(1)>', pecas: ['"><img src=x onerror=alert(1)>'], extra: { __proto__: 'x' } });
  const dados = {
    nome: XSS[0], feitas: { '1.1': 3, '__proto__': 3, 'constructor': 3 },
    errados: { mat1: [q(0), q(1), q(2)], pt1: [q(3)], '__proto__': [q(4)], 'x"><img src=x onerror=alert(1)>': [q(5)] },
    revisao: { itens: { 'er:mat1:abc': [1, '2026-10-24', 0, 0, 0, '', 0, 0] }, congelados: { 'er:mat1:abc': q(6), '__proto__': q(0), '"><img src=x onerror=1>': q(1) } },
    espera: { bilhete: 'oi', presente: '<img src=x onerror=alert(1)>', desde: '2026-10-24' },
    comprado: [XSS[0], 'explorador'], look: { chapeu: XSS[0], companheiro: '"><img src=x onerror=alert(1)>' },
    desenhos: { herdado: [XSS[0]], vistos: [], tinta: { '__proto__': [[1, 2, 3]] } },
  };
  const texto = JSON.stringify({ app: 'universo-de-bobby', versao: 4, quando: 'x', perfil: { id: XSS[1], nome: XSS[0], cor: '#000', dados }, soma: 'xx' })
    .replace('"__proto__"', '"__proto__"');
  return texto;
}

(async () => {
  const M = carregarModulos(['interface/seguranca-dados.js'], '({htmlSeguro,figuraSegura,perguntaSegura,textoCurtoSeguro,chaveOk})');
  await teste('1. htmlSeguro: deixa so b, i, em, strong, br, small, sup, sub e span com class; o resto vira texto', () => {
    A.strictEqual(M.htmlSeguro('2 <b>maior</b> que 1'), '2 <b>maior</b> que 1');
    A.strictEqual(M.htmlSeguro('<span class="frac"><b>1</b><i>2</i></span>'), '<span class="frac"><b>1</b><i>2</i></span>');
    XSS.forEach((x) => { const r = M.htmlSeguro(x); A.ok(!PERIGO.test(r.replace(/&lt;/g, '')) || !/<\s*(img|script|a|svg)/i.test(r), 'passou: ' + x + ' -> ' + r); A.ok(!/<(img|script|a|svg)\b/i.test(r), 'tag viva: ' + r); });
    A.ok(!/onerror=[^&]*>/.test(M.htmlSeguro('<img src=x onerror=alert(1)>')) || M.htmlSeguro('<img src=x onerror=alert(1)>').startsWith('&lt;'));
  });
  await teste('2. figuraSegura: so SVG simples; onload, script e href derrubam a figura', () => {
    A.ok(M.figuraSegura('<svg class="fig" viewBox="0 0 200 130" role="img"><rect x="30" y="25" width="140" height="70" rx="4" fill="var(--fig-fill)" stroke="var(--fig-line)" stroke-width="3"/><text x="100" y="18" text-anchor="middle" font-size="15">3 cm</text></svg>'));
    ['<svg onload=alert(1)></svg>', '<svg><script>alert(1)</script></svg>', '<svg><a href="javascript:alert(1)"></a></svg>', '<svg><image href="x"/></svg>', '<svg><rect fill="url(javascript:1)"/></svg>', '<img src=x>'].forEach((f) => A.strictEqual(M.figuraSegura(f), null, f));
  });
  await teste('3. perguntaSegura: campo fora da lista cai, lang e pecas com aspas derrubam a pergunta', () => {
    const ok = M.perguntaSegura({ type: 'mc', prompt: 'a <b>b</b>', options: ['1', '2'], answer: '1', lixo: 'x', __proto__x: 1 });
    A.deepStrictEqual(Object.keys(ok).sort(), ['answer', 'options', 'prompt', 'type']);
    A.strictEqual(M.perguntaSegura({ type: 'mc', prompt: 'a', options: ['1', '2'], answer: '1', lang: '" onclick="x' }), null);
    A.strictEqual(M.perguntaSegura({ type: 'silabas', prompt: 'a', answer: 'x', pecas: ['"><img>'] }), null);
    A.strictEqual(M.perguntaSegura({ type: 'mc', prompt: 'a', options: ['1'], answer: '1' }), null);
    A.strictEqual(M.perguntaSegura('texto'), null);
  });
  await teste('4. nenhuma pergunta gerada pelo proprio app e alterada pelo filtro (as 150 fases, varias rodadas)', () => {
    const C = carregarConteudo(3);
    const sem = carregarModulos(['interface/seguranca-dados.js'], '({htmlSeguro})');
    let n = 0;
    [C.UNITS_MAT, C.UNITS_PT, C.UNITS_EN].forEach((U) => U.forEach((u) => u.lessons.forEach((l) => {
      for (let r = 0; r < 12; r++) C.genQuestions(l, 8).forEach((q) => {
        n++;
        A.strictEqual(sem.htmlSeguro(q.prompt, 500), q.prompt, 'prompt alterado em ' + l.id + ': ' + q.prompt);
        (q.options || []).forEach((o) => { if (typeof o === 'string') A.strictEqual(sem.htmlSeguro(o, 120), o, 'opcao alterada em ' + l.id + ': ' + o); });
        if (typeof q.answer === 'string') A.strictEqual(sem.htmlSeguro(q.answer, 120), q.answer, 'resposta alterada em ' + l.id);
      });
    })));
    A.ok(n > 5000, 'poucas perguntas testadas: ' + n);
  });
  await teste('5. backup malicioso: importa, nada perigoso fica no estado e nenhuma chave __proto__ sobrevive', () => {
    const app = carregarApp(3);
    const lido = app.avaliar('lerPacote(' + JSON.stringify(backupMalicioso()) + ')');
    A.strictEqual(lido.ok, true);
    const texto = JSON.stringify(lido.dados);
    A.ok(!/__proto__|"constructor"/.test(texto), 'chave perigosa no estado');
    const lixo = []; JSON.parse(texto, (k, v) => { if (typeof v === 'string' && /</.test(v) && PERIGO.test(v)) lixo.push(k + '=' + v); return v; });
    A.deepStrictEqual(lixo, [], 'texto perigoso no estado: ' + lixo.join(' | '));
    A.ok(!lido.dados.espera || lido.dados.espera.presente === '', 'presente perigoso passou');
    A.strictEqual(({}).polluted, undefined);
  });
  await teste('6. backup malicioso nao executa nada: todo HTML que o app escreve (revisao do mundo, caderno, bilhete, perfil) esta limpo', () => {
    HTML_LOG.length = 0;
    const app = carregarApp(3);
    app.avaliar('usarMateria("mat")');
    const lido = app.avaliar('lerPacote(' + JSON.stringify(backupMalicioso()) + ')');
    app.avaliar('aplicarPacote(' + JSON.stringify({ ok: true, id: '', nome: 'Mal', cor: null, dados: lido.dados }) + ',"novo")');
    app.avaliar('usarPerfil(STORE.perfis.length-1)');
    app.avaliar('usarMateria("mat");S.espera={bilhete:"oi",presente:' + JSON.stringify('<img src=x onerror=alert(1)>') + ',desde:"2026-10-24"};0');
    // tela de pergunta a partir de um erro importado e do item congelado
    app.avaliar('(function(){var q=S.errados.mat1&&S.errados.mat1[0];if(!q)return;abrirLicao(0,0);LIC.etapa="questao";LIC.qs=[q];LIC.i=0;LIC.base=1;pintarLicao();LIC.resp=q.options?q.options[0]:q.answer;conferir();})()');
    app.avaliar('try{abrirRevisaoMundo(0)}catch(e){}');
    app.avaliar('try{telaPerfil()}catch(e){}');
    app.avaliar('try{mostrarBilhete()}catch(e){}');
    A.ok(HTML_LOG.length > 5, 'o teste nao exercitou telas (HTML escrito: ' + HTML_LOG.length + ')');
    const viva = (h) => h.replace(/&lt;[\s\S]*?&gt;/g, '').replace(/&[a-z#0-9]+;/g, '');   /* o que foi escapado vira texto na tela: nao conta */
    const ruins = HTML_LOG.filter((h) => PERIGO.test(viva(h)) && /alert\(|onerror|onload|javascript:/i.test(viva(h)));
    A.ok(ruins.length === 0, 'HTML perigoso escrito pelo app: ' + ruins.map((h) => h.slice(0, 300)).slice(0, 2).join(' ||| '));
  });
  await teste('7. backup acima de 2 MB e recusado antes de qualquer parse; versao ou app errados tambem', () => {
    const app = carregarApp(3);
    const grande = JSON.stringify({ app: 'universo-de-bobby', versao: 4, perfil: { dados: { nome: 'x'.repeat(3 * 1024 * 1024) } } });
    A.strictEqual(app.avaliar('lerPacote(' + JSON.stringify(grande) + ')').ok, false);
    A.strictEqual(app.avaliar('lerPacote("{")').ok, false);
    A.strictEqual(app.avaliar('lerPacote(' + JSON.stringify(JSON.stringify({ app: 'outro', versao: 4, perfil: {} })) + ')').ok, false);
  });
  await teste('8. localStorage adulterado (mesmo caminho do import) tambem e saneado ao carregar', () => {
    const dados = JSON.parse(backupMalicioso()).perfil.dados;
    const store = { v: 4, perfis: [{ id: 'p1', pid: 'abc', nome: XSS[0], cor: '#A9713F', criado: 1, dados }], atual: 'p1', avisoVisto: true };
    const app = carregarApp(3, { armazenamento: { 'universo-bobby-v4': JSON.stringify(store) } });
    const t = JSON.stringify(app.avaliar('STORE.perfis'));
    A.ok(!/__proto__|<img|<script|onerror/.test(t.replace(/&lt;/g, '')) || !/<img|<script/.test(t), 'sobrou marcacao viva');
    A.ok(!/<img|<script/.test(t));
  });
  resumo('seguranca.js');
})();
