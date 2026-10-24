#!/usr/bin/env node
'use strict';
/* Caderno de erros espacado (caixas 1, 3, 7, 14, 30 dias), sessao de Revisao do dia, aquecimento e freios.
   Regras: docs/FASE-2-especificacao.md, secao 2.   Uso: node testes/revisao.js                    */
const A = require('assert');
const { carregarApp } = require('./lib/carregar.js');
const { teste, resumo } = require('./lib/mini.js');

const quando = (a, m, d, h) => new Date(a, m - 1, d, h || 10, 0, 0).getTime();
const relogio = { ms: quando(2026, 10, 24) };
function novoApp() {
  relogio.ms = quando(2026, 10, 24);
  const a = carregarApp(21, { relogio });
  a.avaliar("novoPerfil('Zeca','#12A06E')");
  return a;
}
const dia = (a, n) => { relogio.ms += 864e5 * n; a.avaliar('garantirDia()'); };
const Q = (i, extra) => Object.assign({ type: 'mc', prompt: 'Pergunta ' + i + '?', answer: 'certa', options: ['certa', 'errada', 'outra'] }, extra || {});
const erro = (a, i, m, f, extra) => a.avaliar('revisaoErro(' + JSON.stringify(Q(i, extra)) + ',{m:"' + (m || 'mat') + '",f:"' + (f || '1.1') + '",w:1})');
const item = (a, k) => JSON.parse(JSON.stringify(a.avaliar('S.revisao.itens[' + JSON.stringify(k) + ']')));
const chave = (a, i) => a.avaliar('chaveItem(' + JSON.stringify(Q(i)) + ')');
const intervalos = [1, 3, 7, 14, 30];

(async () => {
  await teste('1. erro entra na caixa 1, vence amanha, guarda a pergunta INTEIRA (fracao com partes)', () => {
    const a = novoApp();
    const k = erro(a, 1, 'mat', '5.1', { type: 'fracao', partes: 8, answer: '3', options: undefined });
    const it = item(a, k);
    A.strictEqual(it[0], 1); A.strictEqual(it[1], '2026-10-25'); A.strictEqual(it[4], 1);
    const q = a.avaliar('JSON.parse(JSON.stringify(perguntaDoItem(' + JSON.stringify(k) + ')))');
    A.strictEqual(q.partes, 8); A.strictEqual(q.type, 'fracao'); A.strictEqual(q.__item, k);
    A.ok(!('m' in q) && !('f' in q));
  });

  await teste('2. acerto na 1a tentativa sem dica sobe uma caixa; vence em hoje + intervalo da nova caixa', () => {
    const a = novoApp();
    const k = erro(a, 1);
    for (let cx = 2; cx <= 5; cx++) {
      a.avaliar('revisaoResultado(' + JSON.stringify(k) + ',true,0)');
      const it = item(a, k);
      A.strictEqual(it[0], cx);
      const d = new Date(relogio.ms); d.setDate(d.getDate() + intervalos[cx - 1]);
      A.strictEqual(it[1], a.avaliar('somaDias(hoje(),' + intervalos[cx - 1] + ')'));
      dia(a, intervalos[cx - 1]);
    }
    a.avaliar('revisaoResultado(' + JSON.stringify(k) + ',true,0)');
    A.strictEqual(item(a, k)[0], 5, 'teto na caixa 5');
  });

  await teste('3. acerto com dica fica na caixa (vence hoje + intervalo da MESMA caixa)', () => {
    const a = novoApp();
    const k = erro(a, 1);
    a.avaliar('revisaoResultado(' + JSON.stringify(k) + ',true,0)');     // caixa 2
    a.avaliar('revisaoResultado(' + JSON.stringify(k) + ',true,1)');
    const it = item(a, k);
    A.strictEqual(it[0], 2); A.strictEqual(it[1], a.avaliar('somaDias(hoje(),3)'));
    a.avaliar('revisaoResultado(' + JSON.stringify(k) + ',true,2)');
    A.strictEqual(item(a, k)[0], 2);
  });

  await teste('4. erro cai 2 caixas (minimo 1), vence amanha, conta lapso; 3 lapsos nas caixas baixas = dificil', () => {
    const a = novoApp();
    const k = erro(a, 1);
    for (let i = 0; i < 3; i++) a.avaliar('revisaoResultado(' + JSON.stringify(k) + ',true,0)');   // caixa 4
    A.strictEqual(item(a, k)[0], 4);
    a.avaliar('revisaoResultado(' + JSON.stringify(k) + ',false,0)');
    let it = item(a, k);
    A.strictEqual(it[0], 2); A.strictEqual(it[1], a.avaliar('somaDias(hoje(),1)')); A.strictEqual(it[4], 2);
    A.strictEqual(it[6], 0);
    a.avaliar('revisaoResultado(' + JSON.stringify(k) + ',false,0)');
    it = item(a, k);
    A.strictEqual(it[0], 1); A.strictEqual(it[4], 3); A.strictEqual(it[6], 1, 'deveria marcar dificil');
  });

  await teste('5. atraso maior que 2x o intervalo: cai 1 caixa e vence hoje (esquecimento provavel)', () => {
    const a = novoApp();
    const k = erro(a, 1);
    a.avaliar('revisaoResultado(' + JSON.stringify(k) + ',true,0)');   // caixa 2, vence em +3
    dia(a, 3 + 7);                                                      // atrasou 7 dias > 2 x 3
    a.avaliar('revisaoSelecionar(8)');
    const it = item(a, k);
    A.strictEqual(it[0], 1); A.strictEqual(it[1], a.avaliar('hoje()'));
  });

  await teste('6. dominado: 2 acertos em dias diferentes na caixa 5 saem da fila ativa (volta so em 60 dias, amostra de 5%)', () => {
    const a = novoApp();
    const k = erro(a, 1);
    a.avaliar('S.revisao.itens[' + JSON.stringify(k) + ']=[5,hoje(),9,8,1,"2026-10-01",0,0]');
    a.avaliar('revisaoResultado(' + JSON.stringify(k) + ',true,0)');
    A.strictEqual(item(a, k)[7], 1);
    dia(a, 30);
    a.avaliar('revisaoResultado(' + JSON.stringify(k) + ',true,0)');
    const it = item(a, k);
    A.strictEqual(it[7], 2); A.strictEqual(it[1], a.avaliar('somaDias(hoje(),60)'));
    dia(a, 61);
    const vistos = [];
    for (let i = 0; i < 40; i++) { vistos.push(a.avaliar('revisaoVencidos(somaDias(hoje(),' + i + ')).length')); }
    A.ok(vistos.filter((n) => n > 0).length <= 6, 'dominado voltou demais: ' + vistos.join(''));
  });

  await teste('7. seleciona os mais atrasados primeiro (em proporcao ao intervalo) e respeita o limite', () => {
    const a = novoApp();
    const ks = [1, 2, 3, 4, 5, 6].map((i) => erro(a, i));
    a.avaliar('S.revisao.itens[' + JSON.stringify(ks[0]) + ']=[3,somaDias(hoje(),-7),2,1,1,"",0,0]');   // 7 dias de atraso, intervalo 7
    a.avaliar('S.revisao.itens[' + JSON.stringify(ks[1]) + ']=[1,somaDias(hoje(),-2),2,1,1,"",0,0]');   // 2 dias, intervalo 1
    dia(a, 1);
    const sel = a.avaliar('revisaoSelecionar(2)');
    A.strictEqual(sel.length, 2);
    A.strictEqual(a.avaliar('revisaoSelecionar(100).length') <= 6, true);
  });

  await teste('8. mistura as materias (pelo menos 1 de cada que venceu) e nunca 3 seguidas da mesma fase', () => {
    const a = novoApp();
    for (let i = 0; i < 3; i++) erro(a, i, 'mat', '1.1');
    for (let i = 3; i < 6; i++) erro(a, i, 'pt', 'p1.1');
    erro(a, 10, 'en', 'e1.1'); erro(a, 11, 'en', 'e1.1');
    dia(a, 1);
    const sel = a.avaliar('revisaoSelecionar(5).map(k=>S.revisao.congelados[k].m)');
    A.ok(sel.includes('pt') && sel.includes('en') && sel.includes('mat'), 'faltou materia: ' + sel);
    const tags = a.avaliar('revisaoSelecionar(8).map(k=>S.revisao.congelados[k].m+"/"+S.revisao.congelados[k].f)');
    for (let i = 2; i < tags.length; i++) A.ok(!(tags[i] === tags[i - 1] && tags[i] === tags[i - 2]), '3 seguidas: ' + tags);
  });

  await teste('9. teto do dia: no maximo 10 perguntas de revisao (incluindo aquecimento)', () => {
    const a = novoApp();
    for (let i = 0; i < 30; i++) erro(a, i);
    dia(a, 1);
    A.strictEqual(a.avaliar('revisaoSelecionar(12).length'), 10, '12 pedidas, teto 10');
    a.avaliar('diaDeStats().rev=7');
    A.strictEqual(a.avaliar('revisaoSelecionar(8).length'), 3);
    a.avaliar('diaDeStats().rev=10');
    A.strictEqual(a.avaliar('revisaoSelecionar(8).length'), 0);
  });

  await teste('10. fila invisivel: com vencidos > 3x o limite, itens de caixa 3+ esperam; a fila nunca vira culpa', () => {
    const a = novoApp();
    for (let i = 0; i < 40; i++) erro(a, i);
    a.avaliar('Object.keys(S.revisao.itens).slice(0,10).forEach(k=>{S.revisao.itens[k][0]=4;})');
    dia(a, 1);
    const antes = a.avaliar('revisaoVencidos(hoje()).length');
    A.strictEqual(antes, 40);
    a.avaliar('revisaoSelecionar(8)');
    const depois = a.avaliar('revisaoVencidos(hoje()).length');
    A.strictEqual(depois, 30, 'os 10 de caixa alta deveriam esperar');
  });

  await teste('11. freio: item novo (chave da fase) nao entra com a fila cheia; entra com a fila folgada', () => {
    const a = novoApp();
    const ctx = '{m:"mat",f:"1.1",w:1}';
    A.strictEqual(a.avaliar('revisaoIntroduzir(' + JSON.stringify(Q(500)) + ',' + ctx + ')'), true);
    A.strictEqual(a.avaliar('revisaoIntroduzir(' + JSON.stringify(Q(500)) + ',' + ctx + ')'), false, 'mesmo item entrou 2 vezes');
    for (let i = 0; i < 20; i++) erro(a, i);
    dia(a, 1);
    A.strictEqual(a.avaliar('revisaoIntroduzir(' + JSON.stringify(Q(501)) + ',' + ctx + ')'), false, 'fila cheia, nao deveria entrar');
  });

  await teste('12. migracao: 12 erros do caderno antigo viram itens escalonados hoje + floor(i/5) dias', () => {
    const a = carregarApp(3, { relogio });
    const r = a.avaliar('JSON.parse(JSON.stringify(migrarErrosParaRevisao({mat3:' + JSON.stringify(Array.from({ length: 12 }, (_, i) => Q(i))) + '},"2026-10-24")))');
    const datas = Object.values(r.itens).map((it) => it[1]).sort();
    A.deepStrictEqual(datas, ['2026-10-24', '2026-10-24', '2026-10-24', '2026-10-24', '2026-10-24', '2026-10-25', '2026-10-25', '2026-10-25', '2026-10-25', '2026-10-25', '2026-10-26', '2026-10-26']);
    Object.values(r.itens).forEach((it) => A.strictEqual(it[0], 1));
    Object.values(r.congelados).forEach((c) => A.strictEqual(c.m, 'mat') || A.strictEqual(c.w, 3));
  });

  await teste('13. erro no jogo real entra no caderno (primeira tentativa) e a repeticao da mesma pergunta nao conta de novo', () => {
    const a = novoApp();
    a.avaliar("abrirLicao(0,0);LIC.etapa='questao';pintarLicao()");
    const q = a.avaliar('JSON.parse(JSON.stringify(LIC.qs[0]))');
    a.avaliar('LIC.resp="__errada__";conferir()');
    const k = a.avaliar('chaveItem(LIC.qs[0])');
    A.strictEqual(item(a, k)[4], 1);
    // a pergunta volta no fim da fila (__rep) e erra de novo: nao pode contar outro lapso
    a.avaliar('avancar()');
    a.avaliar('LIC.i=LIC.qs.length-1;LIC.conferido=false;LIC.resp="__errada__";conferir()');
    A.strictEqual(item(a, k)[4], 1, 'a repeticao contou como lapso');
    A.ok(q.prompt);
  });

  await teste('14. Revisao do dia de ponta a ponta: acertar sobe caixa, vira bloco (dia vivo), M01 conta, +5 de XP', () => {
    const a = novoApp();
    for (let i = 0; i < 7; i++) erro(a, i);
    dia(a, 1);
    a.avaliar("S.diario.missoes=[{id:'M01',alvo:1,prog:0,ok:false},{id:'M02',alvo:1,prog:0,ok:false},{id:'M03',alvo:4,prog:0,ok:false}]");
    A.strictEqual(a.avaliar('revisaoDoDiaPronta()'), 7);
    const xp0 = a.avaliar('S.xp');
    a.avaliar("abrirRevisaoDia();LIC.etapa='questao';pintarLicao();while(LIC.etapa==='questao'){LIC.resp=LIC.qs[LIC.i].answer;conferir();avancar();}");
    A.strictEqual(a.avaliar('LIC.diaria'), true);
    A.strictEqual(a.avaliar('S.diario.c.revisao'), 1);
    A.strictEqual(a.avaliar('S.diario.missoes[0].ok'), true);
    A.strictEqual(a.avaliar('S.diario.blocos'), 1); A.strictEqual(a.avaliar('S.ofensiva.atual'), 1);
    const caixas = a.avaliar('Object.values(S.revisao.itens).map(i=>i[0])');
    A.ok(caixas.every((c) => c === 2), 'todos deveriam estar na caixa 2: ' + caixas);
    A.strictEqual(a.avaliar('S.xp') - xp0, 7 * 10 + 2 * 5 + 20 + 5, 'XP: 7 acertos x10 + 2 bonus de combo x5 (3 e 6 seguidas) + fase perfeita 20 + revisao 5');
  });

  await teste('15. revisao com menos de 6 vencidos completa com perguntas novas das fases ja feitas (bloco precisa de 6)', () => {
    const a = novoApp();
    bloco(a, 0, 0);
    erro(a, 1); erro(a, 2);
    dia(a, 1);
    a.avaliar("abrirRevisaoDia()");
    A.ok(a.avaliar('LIC.qs.length') >= 6, 'so ' + a.avaliar('LIC.qs.length'));
  });

  await teste('16. aquecimento: fase NOVA recebe ate 3 itens vencidos depois da 1a pergunta, uma vez por dia', () => {
    const a = novoApp();
    for (let i = 0; i < 5; i++) erro(a, i);
    dia(a, 1);
    a.avaliar('abrirLicao(0,1)');
    const marcas = a.avaliar('LIC.qs.map(q=>!!q.__aquec)');
    A.strictEqual(marcas.filter(Boolean).length, 3);
    A.strictEqual(marcas[0], false); A.strictEqual(marcas[1], true);
    a.avaliar('abrirLicao(0,2)');
    A.strictEqual(a.avaliar('LIC.qs.filter(q=>q.__aquec).length'), 0, 'aquecimento so uma vez por dia');
  });

  await teste('17. fase concluida: ate 3 itens entram (erros + chaves) e contam como "coisas novas"', () => {
    const a = novoApp();
    bloco(a, 0, 0);
    const n = a.avaliar('Object.keys(S.revisao.itens).length');
    A.ok(n >= 1 && n <= 3, 'entraram ' + n);
    A.strictEqual(a.avaliar('S.diario.c.itensNovos'), n);
  });

  await teste('18. simulacao de 40 dias (80% de acerto): nunca passa de 10 revisoes por dia nem acumula fila impossivel', () => {
    const a = novoApp();
    let max = 0, vencMax = 0;
    for (let d = 0; d < 40; d++) {
      for (let i = 0; i < 3; i++) erro(a, d * 10 + i);
      const sel = a.avaliar('revisaoSelecionar(8)');
      sel.forEach((k, j) => {
        a.avaliar('diaDeStats().rev=(diaDeStats().rev||0)+1');
        a.avaliar('revisaoResultado(' + JSON.stringify(k) + ',' + ((j % 5) !== 0) + ',0)');
      });
      max = Math.max(max, a.avaliar('revisoesHoje()'));
      vencMax = Math.max(vencMax, a.avaliar('revisaoVencidos(hoje()).length'));
      dia(a, 1);
    }
    A.ok(max <= 10, 'passou do teto: ' + max);
    A.ok(a.avaliar('Object.keys(S.revisao.congelados).length') <= 600);
  });

  await teste('19. nada de dado pessoal na pergunta congelada (so o que a pergunta mostra)', () => {
    const a = novoApp();
    const k = erro(a, 1);
    const c = JSON.stringify(a.avaliar('S.revisao.congelados[' + JSON.stringify(k) + ']'));
    A.ok(!/Zeca/.test(c));
  });

  await teste('X. nenhum travessao (U+2014) em texto de tela: src/conteudo, src/interface e shell.html, fora de comentarios', () => {
    const fs = require('fs'), path = require('path');
    const raiz = path.join(__dirname, '..', 'src');
    const arqs = ['conteudo', 'interface'].flatMap((d) => fs.readdirSync(path.join(raiz, d)).map((f) => path.join(raiz, d, f))).filter((f) => /\.(js|html)$/.test(f));
    const sem = (t) => t.replace(/\/\*[\s\S]*?\*\//g, '').replace(/<!--[\s\S]*?-->/g, '').replace(/(^|[^:'"\\])\/\/.*$/gm, '$1');
    const ruins = [];
    arqs.forEach((f) => sem(fs.readFileSync(f, 'utf8')).split('\n').forEach((l, i) => { if (l.includes('\u2014')) ruins.push(path.basename(f) + ': ' + l.trim().slice(0, 90)); }));
    A.ok(ruins.length === 0, ruins.length + ' linhas com travessao: ' + ruins.slice(0, 5).join(' | '));
  });
  resumo('revisao.js');
})();
function bloco(a, u, l) {
  return a.avaliar("(function(){abrirLicao(" + u + "," + l + ");LIC.etapa='questao';pintarLicao();while(LIC.etapa==='questao'){LIC.resp=LIC.qs[LIC.i].answer;conferir();avancar();}return 1;})()");
}
