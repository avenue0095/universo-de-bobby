#!/usr/bin/env node
'use strict';
/* Regressao dos 8 defeitos corrigidos em 02/09/2026 (commit c9b07e9 e anteriores).
   Cada teste falharia no codigo ANTERIOR a correcao. Roda no Node, sem navegador.
   Uso: node testes/regressao.js [--rodadas=400]                                  */
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const assert = require('assert');
const { carregarConteudo, carregarApp, RAIZ } = require('./lib/carregar.js');

const RODADAS = Number((process.argv.find((a) => a.startsWith('--rodadas=')) || '--rodadas=400').split('=')[1]);
const resultados = [];
let erroAssincrono = null;
process.on('uncaughtException', (e) => { erroAssincrono = e; });

async function teste(nome, fn) {
  erroAssincrono = null;
  try {
    await fn();
    if (erroAssincrono) throw erroAssincrono;
    resultados.push([true, nome]);
  } catch (e) {
    resultados.push([false, nome, e && e.message ? e.message : String(e)]);
  }
}
const espera = (ms) => new Promise((r) => setTimeout(r, ms));
const achaFase = (units, id) => { for (const u of units) for (const l of u.lessons) if (l.id === id) return l; throw new Error('fase ' + id + ' nao existe'); };
const semTags = (t) => String(t).replace(/<[^>]*>/g, ' ');
const NEG = /(^|[\s(:=])[−-]\d/;

const C = carregarConteudo(11);

(async () => {
  /* 1) Placar real: fase curta (p6.2 so montava 6 perguntas) agora fecha 8 e o placar e 8 de 8 */
  await teste('1. placar real: p6.2 tem 8 perguntas e jogada perfeita marca 8 de 8', () => {
    const lp = achaFase(C.UNITS_PT, 'p6.2');
    for (let i = 0; i < RODADAS; i++) assert.strictEqual(C.genQuestions(lp, 8).length, 8, 'p6.2 gerou menos de 8');
    const app = carregarApp(3);
    app.avaliar("usarMateria('pt')");
    const ui = app.avaliar("UNITS.findIndex(u=>u.lessons.some(l=>l.id==='p6.2'))");
    const li = app.avaliar("UNITS[" + ui + "].lessons.findIndex(l=>l.id==='p6.2')");
    for (let r = 0; r < 20; r++) {
      app.avaliar('abrirLicao(' + ui + ',' + li + ')');
      assert.strictEqual(app.avaliar('LIC.base'), app.avaliar('LIC.qs.length'), 'base diferente do numero real de perguntas');
      app.avaliar("LIC.etapa='questao'");
      app.avaliar("for(let k=0;k<LIC.base;k++){LIC.resp=LIC.qs[LIC.i].answer;conferir();avancar();}");
      assert.strictEqual(app.avaliar('LIC.acertos'), 8, 'jogada perfeita nao deu 8 acertos');
      assert.strictEqual(app.avaliar('LIC.base'), 8, 'base nao e 8');
      assert.strictEqual(app.avaliar('LIC.erros'), 0);
    }
    assert(/base:_qs\.length/.test(fs.readFileSync(path.join(RAIZ, 'src/interface/licao.js'), 'utf8')), 'licao.js nao usa base:_qs.length');
  });

  /* 2) Opcoes dos decimais: sem negativo, sem ponto, sem ponto flutuante */
  await teste('2. decimais: opcoes sem negativo, sem ponto flutuante, com virgula', () => {
    const casos = [['1,25', []], ['0,3', []], ['0,05', ['0,50']], ['2,5', ['2,6']], ['0,1', []], ['3,75', []], ['0,2', ['0,3']]];
    for (const [certa, erradas] of casos) {
      for (let i = 0; i < RODADAS * 5; i++) {
        const q = C.mc('x', certa, erradas);
        const ops = q.options.map(String);
        assert(ops.includes(certa), 'sem gabarito ' + certa);
        assert.strictEqual(new Set(ops).size, ops.length, 'repetida ' + ops);
        assert(ops.length >= 3, 'menos de 3 opcoes para ' + certa);
        for (const o of ops) {
          assert(!NEG.test(' ' + o), 'opcao negativa ' + o + ' para ' + certa);
          assert(!/\d\.\d/.test(o), 'ponto decimal ' + o + ' para ' + certa);
          assert(!/\d{1,},\d{4,}/.test(o), 'flutuante ' + o);
          const casas = (certa.split(',')[1] || '').length;
          assert.strictEqual((o.split(',')[1] || '').length, casas, 'casas diferentes: ' + o + ' vs ' + certa);
        }
      }
    }
  });

  /* 3) Media redonda (unidade 10, fase de dados) */
  await teste('3. media redonda: o total dos tres dias dividido por 3 nunca quebra', () => {
    const makers = [].concat(...C.UNITS_MAT[9].lessons.filter((x) => x.id !== '10.5').map((x) => x.makers));
    let vistos = 0;
    for (let i = 0; i < RODADAS * 5; i++) {
      for (const mk of makers) {
        const q = mk();
        if (!/^Na segunda foram/.test(q.prompt)) continue;
        vistos++;
        const n = (q.prompt.match(/\d+/g) || []).map(Number); // seg, ter, qua, total
        assert.strictEqual(n[0] + n[1] + n[2], n[3], 'total errado: ' + q.prompt);
        assert(Number.isInteger(Number(q.answer)), 'media nao redonda: ' + q.answer);
        assert.strictEqual(Number(q.answer) * 3, n[3], 'media errada em: ' + q.prompt);
        q.options.forEach((o) => assert(/^\d+$/.test(String(o)), 'opcao nao inteira: ' + o));
      }
    }
    assert(vistos > 50, 'a pergunta da media quase nao apareceu (' + vistos + ')');
  });

  /* 4) Nome do jogador escapado */
  await teste('4. nome do jogador escapado (XSS) em todo lugar que vira HTML', () => {
    const app = carregarApp(4);
    const mal = '<img src=x onerror=alert(1)>"\'&';
    const out = app.ctx.escapa(mal);
    assert(!/[<>"']/.test(out.replace(/&(amp|lt|gt|quot|#39);/g, '')), 'sobrou caractere perigoso: ' + out);
    assert.strictEqual(out, '&lt;img src=x onerror=alert(1)&gt;&quot;&#39;&amp;');
    assert.strictEqual(app.ctx.escapa(null), '');
    assert.strictEqual(app.ctx.escapa(undefined), '');
    assert.strictEqual(app.ctx.escapa(7), '7');
    /* varredura: toda linha que monta HTML com nome do perfil precisa de escapa() */
    const dir = path.join(RAIZ, 'src/interface');
    const ruins = [];
    for (const f of fs.readdirSync(dir).filter((x) => x.endsWith('.js'))) {
      fs.readFileSync(path.join(dir, f), 'utf8').split('\n').forEach((linha, i) => {
        const monta = /['"]<[a-z]/i.test(linha) || /<\/[a-z]+>['"]/.test(linha);
        const usaNome = /\.nome\b/.test(linha);
        if (monta && usaNome && !/escapa\(/.test(linha)) ruins.push(f + ':' + (i + 1));
      });
    }
    assert.deepStrictEqual(ruins, [], 'nome sem escapa() em: ' + ruins.join(', '));
    /* e o uso real: o cabecalho da trilha escapa o nome salvo */
    assert(/const nome=escapa\(S\.nome/.test(fs.readFileSync(path.join(dir, 'mapa-e-trilha.js'), 'utf8')));
  });

  /* 5) Dica do modo facil: tocar em Continuar rapido nao deve lancar excecao */
  await teste('5. dica do modo facil sem excecao ao tocar Continuar rapido', async () => {
    const app = carregarApp(5);
    app.avaliar("usarMateria('mat');S.nivel='facil';abrirLicao(0,0);LIC.etapa='questao'");
    /* erra de proposito: o app agenda mostrarDica daqui a 700ms */
    app.avaliar("LIC.resp='resposta-errada-xyz';conferir()");
    assert(app.avaliar('LIC.tDica') != null, 'a dica nao foi agendada (teste sem efeito)');
    app.avaliar('avancar()');                       // Continuar antes dos 700ms
    assert.strictEqual(app.avaliar('LIC.tDica'), null, 'avancar() nao cancelou a dica agendada');
    /* o pior caso: o temporizador dispara mesmo assim, com a pergunta ja fora da lista */
    app.avaliar("LIC.i=LIC.qs.length;mostrarDica();LIC.etapa='questao';mostrarDica();ajudaForte&&ajudaForte()");
    app.avaliar("LIC.etapa='questao';LIC.i=0;LIC.resp='errada-xyz';conferir();fecharLicao()");
    await espera(900);                              // deixa qualquer timer vazado disparar
  });

  /* 6) Service worker: HTML com internet primeiro, cache so sem sinal */
  await teste('6. sw.js: HTML network-first (cache so quando falta rede)', async () => {
    const eventos = {};
    const caixa = { put: () => Promise.resolve(), addAll: () => Promise.resolve() };
    let chamadasRede = 0, rede = 'ok';
    const guardadoNoCache = { resp: 'COPIA-VELHA-DO-CACHE' };
    const ctx = vm.createContext({
      self: { addEventListener: (n, f) => { eventos[n] = f; }, skipWaiting() {}, clients: { claim() {} } },
      caches: {
        open: () => Promise.resolve(caixa),
        keys: () => Promise.resolve([]), delete: () => Promise.resolve(true),
        match: () => Promise.resolve(guardadoNoCache.resp),
      },
      fetch: () => { chamadasRede++; return rede === 'ok' ? Promise.resolve({ status: 200, type: 'basic', clone() { return this; }, corpo: 'VERSAO-NOVA' }) : Promise.reject(new Error('sem sinal')); },
      Promise, console,
    });
    vm.runInContext(fs.readFileSync(path.join(RAIZ, 'sw.js'), 'utf8'), ctx);
    const pagina = { method: 'GET', mode: 'navigate', destination: 'document', headers: { get: () => 'text/html' } };
    const chama = (req) => { let p; eventos.fetch({ request: req, respondWith: (x) => { p = x; } }); return p; };
    const r1 = await chama(pagina);
    assert.strictEqual(r1.corpo, 'VERSAO-NOVA', 'com internet o HTML tem de vir da rede, nao do cache');
    assert.strictEqual(chamadasRede, 1);
    rede = 'caiu';
    const r2 = await chama(pagina);
    assert.strictEqual(r2, 'COPIA-VELHA-DO-CACHE', 'sem internet o HTML tem de vir do cache');
    /* pagina chamada so por Accept: text/html (sem mode navigate) tambem e "pagina" */
    rede = 'ok';
    const r3 = await chama({ method: 'GET', mode: 'cors', destination: '', headers: { get: () => 'text/html,*/*' } });
    assert.strictEqual(r3.corpo, 'VERSAO-NOVA');
    /* icone: cache primeiro (nao pode bater na rede quando ja esta guardado) */
    const antes = chamadasRede;
    const r4 = await chama({ method: 'GET', mode: 'no-cors', destination: 'image', headers: { get: () => 'image/png' } });
    assert.strictEqual(r4, 'COPIA-VELHA-DO-CACHE');
    assert.strictEqual(chamadasRede, antes, 'icone nao devia ir a rede');
  });

  /* 7) p9.1: "e" x "é" so existe dentro de uma frase */
  await teste('7. p9.1: pergunta do e/é sempre com frase para completar', () => {
    const l = achaFase(C.UNITS_PT, 'p9.1');
    let vistos = 0;
    for (let i = 0; i < RODADAS * 5; i++) {
      for (const mk of l.makers) {
        const q = mk();
        const ops = (q.options || []).map((o) => String(o).trim());
        if (ops.length === 2 && ops.includes('é') && ops.includes('e')) {
          vistos++;
          assert(/___/.test(q.prompt), 'e/é sem frase: ' + q.prompt);
          assert(/^Complete/.test(q.prompt), 'enunciado inesperado: ' + q.prompt);
        }
        assert(!(q.prompt === 'Qual está certo?' && ops.includes('é') && ops.includes('e')), 'voltou a pergunta sem frase');
      }
    }
    assert(vistos > 30, 'a pergunta e/é quase nao apareceu (' + vistos + ')');
  });

  /* 8) MAT 6.2: nunca um numero negativo numa aula de decimais */
  await teste('8. MAT 6.2: nenhuma opcao ou gabarito negativo', () => {
    const l = achaFase(C.UNITS_MAT, '6.2');
    let proximo = 0;
    for (let i = 0; i < RODADAS * 20; i++) {
      for (const mk of l.makers) {
        const q = mk();
        const ts = [q.answer, ...(q.options || [])].map((t) => ' ' + semTags(t));
        ts.forEach((t) => assert(!NEG.test(t), 'negativo em 6.2: ' + q.prompt + ' -> ' + ts.join('|')));
        if (/decimal mais próximo/.test(q.prompt)) proximo++;
      }
    }
    assert(proximo > 50, 'a pergunta "mais proximo" quase nao apareceu (' + proximo + ')');
  });

  /* 9) concordancia (revisao de 08/11/2026): "1 centenas + 2 dezenas" virou "1 centena + 2 dezenas"; a ajuda do material dourado tambem */
  await teste('9. concordancia: 1 centena, 1 dezena, 1 unidade, 1 barrinha, 1 cubinho, 1 placa (nunca "1 centenas")', () => {
    const app = carregarApp(5);
    const r = app.avaliar(`(()=>{const ruins=[],vistos={c:0,d:0,u:0};usarMateria('mat');
      const RUIM=/(^|[^\\d,])1 (centenas|dezenas|unidades|barrinhas|cubinhos|placas)\\b/;
      UNITS.forEach(u=>u.lessons.forEach(l=>{for(let t=0;t<${Math.min(RODADAS, 30)};t++)genQuestions(l,8).forEach(q=>{
        const p=String(q.prompt);if(RUIM.test(p))ruins.push(p);
        if(/^1 centena \\+/.test(p))vistos.c++;if(/\\+ 1 dezena \\+/.test(p))vistos.d++;if(/\\+ 1 unidade =/.test(p))vistos.u++;
        const h=ajudaDe(q);[h.metodo,h.resposta,h.exemplo].forEach(x=>{if(x&&RUIM.test(String(x)))ruins.push('ajuda: '+x);});});}));
      /* a ajuda de "monte o numero" com 1 dezena e 1 unidade e com 1 centena */
      [ajudaDe({type:'input',prompt:'Monte o número 111 com barrinhas e cubinhos.',answer:111}),ajudaDe({type:'input',prompt:'Monte o número 11 com barrinhas.',answer:11})]
        .forEach(h=>Object.values(h).forEach(x=>{if(typeof x==='string'&&RUIM.test(x))ruins.push('ajuda monte: '+x);}));
      return {ruins:ruins.slice(0,5),vistos:vistos};})()`);
    assert.deepStrictEqual(JSON.parse(JSON.stringify(r.ruins)), [], 'plural errado: ' + r.ruins.join(' | '));
    assert(r.vistos.c + r.vistos.d + r.vistos.u > 0, 'o gerador de centenas, dezenas e unidades com 1 nao apareceu ' + JSON.stringify(r.vistos));
  });

  /* 10) "São 1 sementes" (revisao de 08/11/2026): nenhum enunciado gerado com 1 e substantivo no plural, em todas as fases */
  await teste('10. plural: nenhum enunciado gerado com "1" seguido de palavra no plural ("São 1 sementes"), nas 150 fases', () => {
    const app = carregarApp(6); app.avaliar("novoPerfil('Z','#12A06E')");
    const r = app.avaliar(`(()=>{const ruins={};let n=0;['mat','pt','en'].forEach(m=>{usarMateria(m);UNITS.forEach(u=>u.lessons.forEach(l=>{for(let t=0;t<${Math.min(RODADAS, 15)};t++)genQuestions(l,8).forEach(q=>{n++;
      const p=String(q.prompt).replace(/<[^>]+>/g,' ');(p.match(/(^|[^\\d,.])1 \\p{L}+s\\b/gu)||[]).forEach(x=>{if(!/1 (mais|menos)$/.test(x.trim()))ruins[x.trim()+' :: '+p.slice(0,60)]=1;});});}));});return {ruins:Object.keys(ruins).slice(0,6),n:n};})()`);
    assert(r.n > 10000, 'poucas perguntas geradas: ' + r.n);
    assert.deepStrictEqual(JSON.parse(JSON.stringify(r.ruins)), [], 'plural errado: ' + r.ruins.join(' | '));
    /* e o caso que o revisor viu, gerado direto */
    const p = app.avaliar("usarMateria('mat');comVerbo(mc('Que número vem depois do 1?',2,[1,3]),UNITS[0].lessons[0]).prompt");
    assert(/^É 1 semente e chegou mais uma\./.test(p), p);
  });

  console.log('regressao.js (8 defeitos de 02/09/2026), rodadas=' + RODADAS);
  let ruins = 0;
  for (const [ok, nome, msg] of resultados) {
    console.log((ok ? '  PASSOU  ' : '  FALHOU  ') + nome + (ok ? '' : '\n          -> ' + msg));
    if (!ok) ruins++;
  }
  console.log(ruins ? '\n' + ruins + ' de ' + resultados.length + ' falharam' : '\nOK: ' + resultados.length + ' de ' + resultados.length + ' passaram');
  process.exit(ruins ? 1 : 0);
})();
