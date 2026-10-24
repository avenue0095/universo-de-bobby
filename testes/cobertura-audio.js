#!/usr/bin/env node
'use strict';
/* Cobertura do audio gravado: tudo o que o app FALA nas 150 fases tem clipe no manifesto (audio/manifesto-min.json)?
   Amostra as perguntas como verifica.js (gera cada fase varias vezes), mais todos os passos de aula, as aberturas de
   capitulo e missao, os cartoes de ingles e os elogios. Resolve cada texto pelo MESMO caminho do app (audioSequencia).
   Sem clipe = sem voz (decisao do Filipe: nada de voz do aparelho): vira AVISO aqui, com a lista.
   Ignora o unico quadro "__" (so lacuna, sem fala) e conta os 68 clipes extras (numeros, nomes, elogios) como cobertura de encaixe.
   Uso: node testes/cobertura-audio.js [--rodadas=40] [--semente=1] [--minimo=99.5] [--lista]                   */
const fs = require('fs');
const path = require('path');
const { carregarApp } = require('./lib/carregar.js');

const arg = (n, p) => { const a = process.argv.find((x) => x.startsWith('--' + n + '=')); return a ? Number(a.split('=')[1]) : p; };
const RODADAS = arg('rodadas', 40), SEMENTE = arg('semente', 1), MINIMO = arg('minimo', 99.5);
const LISTA = process.argv.includes('--lista');
const JSON_SAIDA = (process.argv.find((x) => x.startsWith('--json=')) || '').slice(7);
const PENDENTES_ARQ = path.join(__dirname, '..', 'audio', 'regerar-pendentes.json');
/* audio/regerar-pendentes.json: textos que mudaram e esperam o agente de audio regerar o clipe. Enquanto o arquivo existir, esses textos
   contam como PENDENTES (aviso), nao como falha; qualquer texto sem clipe que NAO esteja na lista continua reprovando. */
const pendentes = new Set(fs.existsSync(PENDENTES_ARQ) ? JSON.parse(fs.readFileSync(PENDENTES_ARQ, 'utf8')).itens.map((i) => i.idioma + '|' + i.materia + '|' + i.texto) : []);
const semClipe = [];
const min = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'audio', 'manifesto-min.json'), 'utf8'));
const completo = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'audio', 'manifesto.json'), 'utf8'));
const ignorados = new Set((completo.ignorados || []).map((i) => i.texto));
/* cauda longa (manifesto.json nao_gerados.textos): quadros de ajuda que juntam a resposta por extenso e nao foram gravados de proposito; ficam sem voz
   com o texto na tela. Contam como informativo, nao como falha. */
const caudaLonga = new Set(((completo.nao_gerados || {}).textos) || []);
let caudaVista = 0;

const app = carregarApp(SEMENTE);
app.ctx.__min = min;
const indexados = app.avaliar('audioIndexar(__min)');
/* o boot do app tenta baixar o manifesto (sem rede aqui): fixa o estado "com audio" como no app com manifesto carregado */
app.avaliar('AUDIO.semAudio=false;AUDIO.pronto=Promise.resolve(true)');
const seq = (texto, lang, mat) => { app.ctx.__t = texto; app.ctx.__l = lang; app.ctx.__m = mat; return app.avaliar('(function(){const s=audioSequencia(__t,__l,__m);return {f:s.faltas,n:s.chaves.length}})()'); };

const cat = {};   // categoria -> { total (distintos), ok, faltas: Map(falta -> exemplo) , usos, usosOk }
function conta(nome, texto, lang, mat) {
  const c = cat[nome] = cat[nome] || { vistos: new Set(), ok: 0, total: 0, faltas: new Map(), usos: 0, usosOk: 0 };
  const chave = lang + '|' + mat + '|' + texto;
  const r = seq(texto, lang, mat);
  const faltas = r.f.filter((f) => { if (f.startsWith('quadro:') && caudaLonga.has(f.slice(7).trim())) { caudaVista++; return false; } return !(f.startsWith('quadro:') && ignorados.has(f.slice(7).trim())) && f !== 'quadro:__'; });
  c.usos++;
  const bom = r.n > 0 && !faltas.length;
  if (bom) c.usosOk++;
  if (c.vistos.has(chave)) return;
  c.vistos.add(chave); c.total++;
  if (bom) c.ok++;
  else { (faltas.length ? faltas : ['(nada para falar)']).forEach((f) => { if (!c.faltas.has(f)) c.faltas.set(f, texto); }); semClipe.push({ texto: texto, idioma: lang, materia: mat, categoria: nome, faltas: faltas.slice(0, 6), pendente: pendentes.has(lang + '|' + mat + '|' + texto) }); if (pendentes.has(lang + '|' + mat + '|' + texto)) c.pend = (c.pend || 0) + 1; }
}

const UN = [['mat', 'UNITS_MAT'], ['pt', 'UNITS_PT'], ['en', 'UNITS_EN']];
const CAP = { mat: ['CAPITULOS', 'MISSOES'], pt: ['CAPITULOS_PT', 'MISSOES_PT'], en: ['CAPITULOS_EN', 'MISSOES_EN'] };
for (const [m, U] of UN) {
  app.avaliar("MATERIA='" + m + "'");
  const units = app.avaliar(U);
  const caps = app.avaliar(CAP[m][0]), miss = app.avaliar(CAP[m][1]);
  units.forEach((u, ui) => u.lessons.forEach((l, li) => {
    // aulas: o texto do passo e os cartoes de ingles (data-ler)
    app.ctx.__l1 = l.id;
    const passos = app.avaliar('passosDe(' + U + '[' + ui + '].lessons[' + li + '])');
    passos.forEach((p) => {
      conta('aula (passo)', p.t + '. ' + p.c, 'pt-BR', m);
      for (const mm of String(p.fig || '').matchAll(/data-ler="([^"]*)"/g)) conta('aula (cartao em ingles)', decodeURIComponent(mm[1]), 'en-US', m);
    });
    // abertura do capitulo (1a fase do mundo) + missao
    if (li === 0 && caps[u.n]) conta('abertura de capitulo', caps[u.n].abre, 'pt-BR', m);
    const ms = miss[l.id];
    if (ms) conta('abertura de missao', ms.t + '. ' + ms.abre, 'pt-BR', m);
    // perguntas: como o verifica.js, varias rodadas por fase
    for (let r = 0; r < RODADAS; r++) {
      const qs = app.avaliar('genQuestions(' + U + '[' + ui + '].lessons[' + li + '],8)');
      qs.forEach((q) => {
        conta(m === 'mat' ? 'pergunta (matematica)' : m === 'pt' ? 'pergunta (portugues)' : 'pergunta (ingles)', q.ouvir || q.prompt, q.lang || 'pt-BR', m);
        /* dica ("Como fazer"), resposta e "Ajuda extra": o app fala metodo e resposta como DOIS clipes, entao cada um e conferido sozinho */
        if (r < 3) {
          app.ctx.__q = q;
          let h = null; try { h = app.avaliar('(function(){const h=ajudaDe(__q);return {m:String(h.metodo||""),r:String(h.resposta||"")}})()'); } catch (e) { h = null; }
          if (h && h.m) conta('dica (como fazer)', h.m, 'pt-BR', m);
          if (h && h.r) conta('resposta da dica', h.r, 'pt-BR', m);
          const A = [];
          if (q.type === 'mc') [1, 2, 3].forEach((n) => A.push('Tirei ' + n + ' resposta' + (n > 1 ? 's' : '') + ' errada' + (n > 1 ? 's' : '') + '. Agora escolha entre as que sobraram.'));
          else if (q.type === 'blocos') A.push('Já coloquei as placas e as barrinhas para você. Agora complete só os <b>cubinhos</b>.');
          else if (q.type === 'fracao') A.push('Pintei quase tudo. Falta pintar <b>1 parte</b>.');
          else if (q.type === 'grupinhos') A.push('Já montei os grupos. Agora coloque <b>' + q.alvoP + '</b> em cada um.');
          else if (q.type === 'texto' || q.type === 'input') { const a = String(q.answer); A.push('A resposta começa com <b>' + a.slice(0, 1) + '</b> e tem <b>' + a.length + '</b> ' + (a.length > 1 ? 'caracteres' : 'caractere') + '.'); }
          else if (q.type === 'silabas') A.push('A primeira sílaba é <b>' + String(q.answer).slice(0, 2) + '</b>.');
          else A.push('Leia devagar e tente de novo. Você consegue.');
          A.forEach((t) => conta('ajuda extra', t, 'pt-BR', m));
        }
      });
    }
  }));
}
['Isso aí!', 'Boa!', 'Perfeito!', 'Mandou bem!', 'Certinho!', 'Show!', 'Quase!'].forEach((t) => conta('elogio e retorno', t, 'pt-BR', 'mat'));

/* Falas do app que NAO fazem parte do lote gravado (texto novo da Fase 2 e modelos com numero). Informativo: ficam sem voz
   ate o proximo lote. Nao entram na porcentagem. */
const novas = [].concat(Object.values(app.avaliar('BILHETES')), ['Por hoje chega! Você fez um ótimo trabalho.', '10 unidades viraram 1 dezena!', '10 dezenas viraram 1 centena!']);
const semClipeNovas = novas.filter((t) => { const r = seq(t, 'pt-BR', 'mat'); return !r.n || r.f.length; });

let totT = 0, totOk = 0, ruim = [];
console.log('cobertura-audio.js | clipes indexados: ' + indexados + ' | rodadas por fase: ' + RODADAS + ' | semente ' + SEMENTE);
console.log('categoria\ttextos distintos\tcom clipe\t%\tusos amostrados (% com clipe)');
for (const [nome, c] of Object.entries(cat)) {
  const p = c.total ? (c.ok + (c.pend || 0)) / c.total * 100 : 100;      /* pendente de regerar nao reprova */
  totT += c.total; totOk += c.ok;
  console.log(nome + '\t' + c.total + '\t' + c.ok + '\t' + p.toFixed(2) + '%\t' + c.usos + ' (' + (c.usosOk / c.usos * 100).toFixed(2) + '%)');
  if (p < MINIMO) ruim.push(nome + ' ' + p.toFixed(2) + '%');
}
const pct = totOk / totT * 100;
if (JSON_SAIDA) {
  const vistos = new Set(), itens = [];
  semClipe.forEach((x) => { const k = x.idioma + '|' + x.materia + '|' + x.texto; if (vistos.has(k)) return; vistos.add(k); itens.push({ texto: x.texto, idioma: x.idioma, materia: x.materia, categoria: x.categoria, motivo: 'sem clipe no manifesto: o texto mudou (troca de travessao por virgula, dois-pontos ou ponto) ou e novo; regerar com a voz local', trechos_sem_clipe: x.faltas }); });
  fs.writeFileSync(JSON_SAIDA, JSON.stringify({ gerado: new Date().toISOString().slice(0, 10), total: itens.length, itens: itens }, null, 1) + '\n');
  console.log('gravado ' + JSON_SAIDA + ' com ' + itens.length + ' textos');
}
console.log('TOTAL\t' + totT + '\t' + totOk + '\t' + pct.toFixed(2) + '%');
const faltas = [];
for (const [nome, c] of Object.entries(cat)) for (const [f, ex] of c.faltas) faltas.push([nome, f, ex]);
const nPend = semClipe.filter((x) => x.pendente).length;
if (nPend) console.log('\nPENDENTES de regerar (audio/regerar-pendentes.json): ' + nPend + ' textos');
console.log('\nAVISO: ' + faltas.length + ' trechos sem clipe (ficam sem voz; nao ha voz do aparelho):');
const mostra = LISTA ? faltas : faltas.slice(0, 25);
mostra.forEach(([n, f, ex]) => console.log('  [' + n + '] ' + f + '   <= ' + String(ex).replace(/<[^>]*>/g, '').slice(0, 70)));
if (!LISTA && faltas.length > 25) console.log('  ... e mais ' + (faltas.length - 25) + ' (use --lista)');
if (caudaVista) console.log('\nINFORMATIVO: ' + caudaVista + ' usos de ajuda com quadro de cauda longa (resposta por extenso, nao gravada de proposito): ficam sem voz, com o texto na tela.');
console.log('\nINFORMATIVO: ' + semClipeNovas.length + ' de ' + novas.length + ' falas novas do app (bilhetes do Bobby, parada, avisos de troca) ainda nao tem clipe e ficam sem voz ate o proximo lote.');
if (ruim.length) { console.log('\nFALHOU: cobertura abaixo de ' + MINIMO + '% em: ' + ruim.join(', ')); process.exitCode = 1; }
else console.log('\nOK: toda categoria com pelo menos ' + MINIMO + '% dos textos distintos com clipe');
