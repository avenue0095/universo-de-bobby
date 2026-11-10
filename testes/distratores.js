#!/usr/bin/env node
'use strict';
/* Distratores da escrita certa contra a lista de bloqueio e contra a conferência lida à mão (defeito 3 da segunda passada da Fase 4:
   PEDO, DODO, PETATE e PALO saíam como resposta errada para criança). EXAUSTIVO: usa candidatosDeGrafia (todas as escritas possíveis
   de cada palavra do banco), não amostra.   Uso: node testes/distratores.js */
const A = require('assert');
const fs = require('fs');
const { carregarApp } = require('./lib/carregar.js');
const { teste, resumo } = require('./lib/mini.js');
const { montar, lerConferencia, DOC } = require('../build/distratores.js');

const J = (x) => JSON.parse(JSON.stringify(x));
const a = carregarApp(19, {});
const BLOQ = new Set(J(a.avaliar('[...PALAVRAS_BLOQUEADAS]')));
const conf = lerConferencia(fs.readFileSync(DOC, 'utf8'));
const linhas = Object.values(conf);

(async () => {
  await teste('1. a lista de bloqueio existe e tem os casos achados pelo revisor (PEDO, DODO, PETATE, PALO) e os da leitura (POTO, FELA, PETACA, MENINE)', () => {
    ['pedo', 'dodo', 'petate', 'palo', 'poto', 'fela', 'petaca', 'menine', 'zapato', 'nala'].forEach((w) => A.ok(BLOQ.has(w), w + ' fora da lista'));
    A.ok(J(a.avaliar('Object.values(BLOQUEIO_MOTIVO).every(m=>typeof m==="string"&&m.length>=5)')), 'palavra bloqueada sem motivo');
  });

  await teste('2. EXAUSTIVO: nenhuma escrita possivel de nenhuma das palavras do banco esta na lista de bloqueio nem e palavra real', () => {
    const todas = J(a.avaliar('PALAVRAS_BASE.map(w=>[w.p,[...new Set(candidatosDeGrafia(w.p))]])'));
    A.ok(todas.length >= 37, 'banco com ' + todas.length + ' palavras');
    const ruins = [];
    const reais = new Set(J(a.avaliar('[...PALAVRAS_REAIS]')).concat(todas.map(([p]) => p)));
    todas.forEach(([p, l]) => l.forEach((t) => { if (BLOQ.has(t)) ruins.push(p + ' -> ' + t + ' (bloqueada)'); if (reais.has(t)) ruins.push(p + ' -> ' + t + ' (real)'); }));
    A.deepStrictEqual(ruins, []);
    /* e o que de fato sai nas perguntas (sorteio) tambem nao: 2.000 de cada gerador que usa errosDeGrafia */
    const saiu = J(a.avaliar(`(()=>{const o=[];for(let i=0;i<2000;i++){[PT_BAS.grafiaCerta(),PT_BAS.juntarSilabas()].forEach(q=>q.options.forEach(x=>{if(x!==q.answer)o.push(String(x).toLowerCase());}));}return [...new Set(o)];})()`));
    A.deepStrictEqual(saiu.filter((t) => BLOQ.has(t)), []);
  });

  await teste('3. toda escrita possivel foi lida na conferencia (nenhuma nova sem leitura) e nenhuma esta A CONFERIR', () => {
    const b = carregarApp(19, {});
    b.avaliar('PALAVRAS_BLOQUEADAS.clear()');   /* as cruas: o que a conferencia precisa ter lido, inclusive o que depois foi bloqueado */
    const crus = J(b.avaliar('PALAVRAS_BASE.map(w=>[w.p,[...new Set(candidatosDeGrafia(w.p))]])'));
    const faltam = [];
    crus.forEach(([p, l]) => l.forEach((t) => { if (!conf[p + '|' + t]) faltam.push(p + ' -> ' + t); }));
    A.deepStrictEqual(faltam, [], 'escrita nova sem leitura: rode node build/distratores.js e leia');
    A.deepStrictEqual(linhas.filter((x) => x.veredito === 'A CONFERIR').map((x) => x.alvo + ' -> ' + x.palavra), []);
    const { md, aConferir } = montar();
    A.strictEqual(aConferir, 0);
    A.strictEqual(fs.readFileSync(DOC, 'utf8'), md, 'conferencia fora de dia: rode node build/distratores.js');
  });

  await teste('4. conferencia e lista de bloqueio batem: o que esta BLOQUEADA na conferencia esta na lista, e vice-versa; nada liberado esta bloqueado', () => {
    const naConf = new Set(linhas.filter((x) => x.veredito === 'BLOQUEADA').map((x) => x.palavra));
    A.deepStrictEqual([...BLOQ].filter((w) => !naConf.has(w)).sort(), [], 'bloqueada no codigo e fora da conferencia');
    A.deepStrictEqual([...naConf].filter((w) => !BLOQ.has(w)).sort(), [], 'bloqueada na conferencia e fora do codigo');
    A.deepStrictEqual(linhas.filter((x) => x.veredito === 'ok' && BLOQ.has(x.palavra)).map((x) => x.palavra), []);
  });

  await teste('5. palavra que ficou com menos de 2 escritas erradas depois do bloqueio nunca chega a crianca por errosDeGrafia', () => {
    /* grafiaCerta so usa palavra com 3 ou mais; juntarSilabas so cai em errosDeGrafia se nao tiver 2 palavras do banco com silaba igual */
    const r = J(a.avaliar(`(()=>{const o=[];PALAVRAS_BASE.forEach(w=>{const n=new Set(candidatosDeGrafia(w.p)).size;if(n>=2)return;
      const junta=w.s.length===2?PALAVRAS_BASE.filter(x=>x.s.length===2&&x.p!==w.p&&(x.s[0]===w.s[0]||x.s[1]===w.s[1])).length:99;
      o.push([w.p,n,junta]);});return o;})()`));
    r.forEach(([p, n, junta]) => A.ok(junta >= 2, p + ' tem ' + n + ' escrita errada e juntarSilabas cairia nela'));
    console.log('          com menos de 2 escritas erradas (nunca usadas por errosDeGrafia): ' + (r.map(([p, n]) => p.toUpperCase() + ' ' + n).join(', ') || 'nenhuma'));
  });

  resumo('distratores.js');
})();
