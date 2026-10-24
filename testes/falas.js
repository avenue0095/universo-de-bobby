#!/usr/bin/env node
'use strict';
/* Banco de falas dos personagens (docs/PLANO-DE-IDENTIDADE.md, secao 7): regras de texto, sorteio sem repetir as ultimas 3, uso no jogo
   e lista de textos novos para o agente de audio.   Uso: node testes/falas.js */
const A = require('assert');
const fs = require('fs');
const path = require('path');
const { carregarApp, HTML_LOG } = require('./lib/carregar.js');
const { teste, resumo } = require('./lib/mini.js');

const mulberry = (a) => () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };

(async () => {
  const app = carregarApp(3, {});
  app.avaliar("novoPerfil('Zeca','#12A06E')");
  const todas = JSON.parse(app.avaliar('JSON.stringify(falasTodas())'));

  await teste('1. regras: ate 15 palavras, sem travessao, sem "tu", sem tristeza, culpa, falta nem pedido', () => {
    A.ok(todas.length >= 60, 'banco pequeno: ' + todas.length);
    const proibidas = /triste|saudade|decepcion|você perdeu|voce perdeu|faz dias|sentiu falta|sozinho|volte logo|não me deixe|nao me deixe/i;
    todas.forEach((f) => {
      const n = f.texto.trim().split(/\s+/).length;
      A.ok(n <= 15, 'mais de 15 palavras (' + n + '): ' + f.texto);
      A.ok(!/—|&mdash;/.test(f.texto), 'travessao: ' + f.texto);
      A.ok(!/\btu\b|\bteu\b|\btua\b/i.test(f.texto), 'tu: ' + f.texto);
      A.ok(!proibidas.test(f.texto), 'palavra proibida: ' + f.texto);
      A.ok(!/não é .*, é |nao e .*, e /i.test(f.texto), 'negar para afirmar: ' + f.texto);
    });
  });

  await teste('2. sorteio: em 200 acertos simulados nenhuma frase igual numa janela de 3', () => {
    const r = JSON.parse(app.avaliar(`JSON.stringify((()=>{const rnd=(${mulberry.toString()})(9);const o=[];for(let i=0;i<200;i++)o.push(falaDe('acerto',['teo','rufa','otto'][i%3],rnd));return o})())`));
    for (let i = 0; i < r.length; i++) for (let k = 1; k <= 3 && i - k >= 0; k++) A.notStrictEqual(r[i], r[i - k], 'repetiu na janela: ' + r[i] + ' (posicao ' + i + ')');
    A.ok(new Set(r).size >= 8, 'pouca variedade');
  });

  await teste('3. cada guia fala com a sua voz: Teo (matematica), Rufa (portugues), Otto (ingles); erro depois de 2 seguidos vem da Capi', () => {
    const f = (sit, quem) => JSON.parse(app.avaliar(`JSON.stringify((()=>{const o=[];for(let i=0;i<60;i++)o.push(falaDe(${JSON.stringify(sit)},${JSON.stringify(quem)}));return o})())`));
    const teo = f('acerto', 'teo'), rufa = f('acerto', 'rufa'), otto = f('acerto', 'otto'), capi = f('erro', 'capi');
    A.ok(teo.some((t) => /Padrão encontrado|Calculei/.test(t)), 'Teo sem marca');
    A.ok(rufa.some((t) => /Era uma vez|final feliz/.test(t)), 'Rufa sem marca');
    A.ok(otto.some((t) => /Great/.test(t)), 'Otto sem marca');
    A.ok(capi.some((t) => /sem pressa|Respira/i.test(t)), 'Capi sem marca');
  });

  await teste('4. o jogo usa o banco: acerto e erro mostram fala do banco, nunca "Quase!" nem o elogio antigo', () => {
    const a = carregarApp(4, {}); a.avaliar("novoPerfil('Zeca','#12A06E')");
    a.avaliar("abrirLicao(0,0);LIC.etapa='questao';pintarLicao()");
    const n0 = HTML_LOG.length;
    a.avaliar('LIC.resp=LIC.qs[LIC.i].answer;conferir()');
    const acerto = HTML_LOG.slice(n0).join(' ');
    a.avaliar('avancar();LIC.resp="__errada__";conferir()');
    const tudo = HTML_LOG.slice(n0).join(' ');
    const dentro = (txt) => todas.some((f) => txt.indexOf(f.texto.replace(/&/g, '&amp;')) >= 0 || txt.indexOf(f.texto) >= 0);
    A.ok(dentro(acerto), 'o acerto nao usou uma fala do banco: ' + acerto.slice(0, 200));
    A.ok(dentro(tudo.slice(acerto.length)), 'o erro nao usou uma fala do banco');
    A.ok(!/Quase!/.test(tudo), 'sobrou "Quase!"');
    const src = fs.readFileSync(path.join(__dirname, '..', 'src', 'interface', 'licao.js'), 'utf8');
    A.ok(!/'Quase!'|Isso aí!','Boa!'/.test(src), 'elogio antigo ainda no codigo');
  });

  await teste('5. todo texto novo do banco esta na lista do agente de audio (audio/regerar-pendentes.json) ou ja tem clipe', () => {
    const arq = path.join(__dirname, '..', 'audio', 'regerar-pendentes.json');
    const lista = new Set(fs.existsSync(arq) ? JSON.parse(fs.readFileSync(arq, 'utf8')).itens.map((i) => i.texto) : []);
    const man = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'audio', 'manifesto-min.json'), 'utf8'));
    const chaves = new Set(); Object.values(man.pacotes).forEach((pk) => Object.keys(pk).forEach((k) => chaves.add(k)));
    const sem = todas.filter((f) => !lista.has(f.texto) && !app.avaliar('audioResolveTexto(' + JSON.stringify(f.texto) + ',"pt-BR",["feedback"])'));
    A.deepStrictEqual(sem.map((f) => f.texto), [], 'faltam na lista do audio');
  });
  await teste('6. narrativa do Embaralho: 10 etapas por planeta, sem tristeza, culpa nem travessao, e todo texto esta na lista do audio', () => {
    const N = JSON.parse(app.avaliar('JSON.stringify(NARRATIVA)'));
    const arq = path.join(__dirname, '..', 'audio', 'regerar-pendentes.json');
    const lista = new Set(fs.existsSync(arq) ? JSON.parse(fs.readFileSync(arq, 'utf8')).itens.map((i) => i.texto) : []);
    ['mat', 'pt', 'en'].forEach((k) => {
      A.strictEqual(N[k].length, 10, k);
      N[k].forEach(([nome, frase]) => {
        A.ok(nome && frase.length > 20, k + ' ' + nome);
        A.ok(!/triste|saudade|decepcion|culpa|\u2014|\btu\b/i.test(frase), 'regra de texto: ' + frase);
        A.ok(lista.has(frase) || app.avaliar('audioResolveTexto(' + JSON.stringify(frase) + ',"pt-BR",["feedback"])'), 'sem clipe nem lista de audio: ' + frase);
      });
    });
  });
  resumo('falas.js');
})();
