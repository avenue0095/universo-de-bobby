#!/usr/bin/env node
'use strict';
/* Gera docs/fase4/DISTRATORES-CONFERENCIA.md: TODAS as escritas erradas que o app pode mostrar para cada palavra do banco
   (candidatosDeGrafia, sem sorteio e sem amostra), cada uma com o veredito de quem leu.
   Uso:  node build/distratores.js            (regrava a conferência; o que é novo entra como A CONFERIR)
         node build/distratores.js --checar   (só diz se a conferência está em dia; sai com 1 se não estiver)
   Vereditos:
     ok              lida e liberada (a observação, se houver, diz por que ficou)
     BLOQUEADA       está em src/conteudo/bloqueio.js; o motivo vem de lá
     A CONFERIR      apareceu agora e ninguém leu: testes/distratores.js reprova até alguém ler e trocar para ok ou bloquear
   O veredito "ok" e a observação são preservados entre regravações (vêm do próprio arquivo). */
const fs = require('fs');
const path = require('path');
const { carregarApp } = require('../testes/lib/carregar.js');

const RAIZ = path.resolve(__dirname, '..');
const DOC = path.join(RAIZ, 'docs', 'fase4', 'DISTRATORES-CONFERENCIA.md');

/** Lê a tabela da conferência: {'alvo|escrita': {alvo, palavra, veredito, obs}}; o bloqueio preventivo tem alvo '(preventivo)'. */
function lerConferencia(texto) {
  const out = {};
  let alvo = null;
  for (const linha of String(texto || '').split('\n')) {
    const h = linha.match(/^### ([A-ZÇÁÉÍÓÚÂÊÔÃÕ]+) \(/);
    if (h) { alvo = h[1].toLowerCase(); continue; }
    const m = linha.match(/^\| ([A-ZÇÁÉÍÓÚÂÊÔÃÕ]+) \| (ok|BLOQUEADA|A CONFERIR) \| (.*) \|$/);
    if (/^## Bloqueio preventivo/.test(linha)) alvo = '(preventivo)';
    if (m && alvo) out[alvo + '|' + m[1].toLowerCase()] = { alvo, palavra: m[1].toLowerCase(), veredito: m[2], obs: m[3].trim() };
  }
  return out;
}

function montar() {
  const a = carregarApp(19, {});
  const motivo = JSON.parse(JSON.stringify(a.avaliar('BLOQUEIO_MOTIVO')));
  a.avaliar('PALAVRAS_BLOQUEADAS.clear()');
  const crus = JSON.parse(JSON.stringify(a.avaliar('PALAVRAS_BASE.map(w=>[w.p,[...new Set(candidatosDeGrafia(w.p))].sort()])')));
  const antes = fs.existsSync(DOC) ? lerConferencia(fs.readFileSync(DOC, 'utf8')) : {};
  const conferidas = new Set();
  let total = 0, bloq = 0, aConferir = 0;
  const blocos = crus.map(([p, lista]) => {
    const linhas = lista.map((t) => {
      total++;
      let v, obs;
      if (motivo[t]) { v = 'BLOQUEADA'; obs = motivo[t]; bloq++; conferidas.add(t); }
      else if (antes[p + '|' + t] && antes[p + '|' + t].veredito === 'ok') { v = 'ok'; obs = antes[p + '|' + t].obs; }
      else { v = 'A CONFERIR'; obs = ''; aConferir++; }
      return '| ' + t.toUpperCase() + ' | ' + v + ' | ' + obs + ' |';
    });
    const sobra = lista.filter((t) => !motivo[t]).length;
    return '### ' + p.toUpperCase() + ' (' + lista.length + ' possíveis, ' + sobra + ' liberadas)\n\n| Escrita | Veredito | Observação |\n|---|---|---|\n' + linhas.join('\n');
  });
  const preventivas = Object.keys(motivo).filter((w) => !conferidas.has(w)).sort();
  const md = [
    '# Fase 4 · Conferência dos distratores da escrita certa',
    '',
    'Gerado por `node build/distratores.js` a partir de `candidatosDeGrafia` (src/conteudo/basicas.js): **todas** as escritas erradas que o app',
    'pode mostrar para cada uma das ' + crus.length + ' palavras do banco, sem sorteio e sem amostra, já com os filtros de legibilidade e de palavra real.',
    'Cada linha foi lida à mão com olho de pai: palavra real (também a que só é real com acento e que a criança reconhece lendo em voz alta),',
    'gíria, palavrão, palavra de outro país lusófono, nome próprio comum, conotação ruim em português, espanhol ou inglês.',
    '',
    'Critério para palavra estrangeira: bloqueada se for gíria, palavrão, conotação ruim ou o nome da MESMA coisa em outra língua',
    '(ZAPATO, TOMATO: a criança pode achar que está certo). Palavra estrangeira neutra e desconhecida da criança fica (CAZA, MOPA, UVE),',
    'com a observação na linha.',
    '',
    '`testes/distratores.js` reprova se: aparecer escrita nova sem leitura (A CONFERIR), algum distrator do app estiver na lista de bloqueio,',
    'ou esta conferência e `src/conteudo/bloqueio.js` não baterem.',
    '',
    '**Resumo:** ' + total + ' escritas possíveis, ' + bloq + ' bloqueadas, ' + (total - bloq - aConferir) + ' liberadas, ' + aConferir + ' a conferir.',
    '',
    '## Por palavra',
    '',
    blocos.join('\n\n'),
    '',
    '## Bloqueio preventivo (o gerador hoje não produz; fica para o banco crescer)',
    '',
    '| Escrita | Veredito | Observação |',
    '|---|---|---|',
    ...preventivas.map((w) => '| ' + w.toUpperCase() + ' | BLOQUEADA | ' + motivo[w] + ' |'),
    '',
  ].join('\n');
  return { md, aConferir };
}

if (require.main === module) {
  const { md, aConferir } = montar();
  if (process.argv.includes('--checar')) {
    const atual = fs.existsSync(DOC) ? fs.readFileSync(DOC, 'utf8') : '';
    if (atual !== md || aConferir) { console.error('conferência fora de dia (' + aConferir + ' a conferir): rode node build/distratores.js e leia'); process.exit(1); }
    console.log('OK: conferência em dia');
  } else {
    fs.writeFileSync(DOC, md);
    console.log('gravado ' + path.relative(RAIZ, DOC) + (aConferir ? ' com ' + aConferir + ' A CONFERIR' : ''));
  }
}
module.exports = { montar, lerConferencia, DOC };
