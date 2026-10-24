#!/usr/bin/env node
'use strict';
/* Os 12 casos de docs/anexos/referencia-ofensiva.js rodando contra o codigo REAL do app
   (src/interface/nucleo.js + ofensiva.js), mais casos extras de dia local e relogio.
   Uso: node testes/ofensiva.js                                                              */
const A = require('assert');
const { carregarModulos } = require('./lib/carregar.js');
const { teste, resumo } = require('./lib/mini.js');

const M = carregarModulos(['interface/nucleo.js', 'interface/ofensiva.js'],
  '({novo:ofensivaNova,abrir:ofensivaAbrir,bloco:ofensivaBloco,diaLocal,difDias,somaDias,diaSemana,OF_P})');
const { novo, abrir, bloco, diaLocal } = M;
const jogar = (s, dias) => dias.forEach((d) => bloco(s, d));

(async () => {
  await teste('1. joga 3 dias seguidos: 3', () => { const s = novo(); jogar(s, ['2026-10-01', '2026-10-02', '2026-10-03']); A.equal(s.atual, 3); });
  await teste('2. dois blocos no mesmo dia: 1', () => { const s = novo(); jogar(s, ['2026-10-01', '2026-10-01']); A.equal(s.atual, 1); });
  await teste('3. 7 dias vivos, falta 1 dia: congelador ganho e gasto, ofensiva 8', () => {
    const s = novo();
    jogar(s, ['2026-10-01', '2026-10-02', '2026-10-03', '2026-10-04', '2026-10-05', '2026-10-06', '2026-10-07']);
    A.equal(s.congeladores, 1);
    bloco(s, '2026-10-09'); A.equal(s.atual, 8); A.equal(s.congeladores, 0);
  });
  await teste('4. ofensiva 10, falta 1 dia, sem congelador: descansa, volta em 5, melhor continua 10', () => {
    const s = novo(); s.atual = 10; s.melhor = 10; s.ultimo = '2026-10-01';
    abrir(s, '2026-10-03'); A.equal(s.descansando, true); A.equal(s.atual, 10);
    bloco(s, '2026-10-03'); A.equal(s.atual, 5); A.equal(s.melhor, 10);
  });
  await teste('5. idem, mais 1 bloco extra no dia da volta: 11', () => {
    const s = novo(); s.atual = 10; s.melhor = 10; s.ultimo = '2026-10-01';
    bloco(s, '2026-10-03'); bloco(s, '2026-10-03'); A.equal(s.atual, 11);
  });
  await teste('6. falta 9 dias: volta em 5, sem recuperacao', () => {
    const s = novo(); s.atual = 10; s.ultimo = '2026-10-01';
    bloco(s, '2026-10-10'); bloco(s, '2026-10-10'); A.equal(s.atual, 5);
  });
  await teste('7. 2a recuperacao 4 dias depois da 1a: nao recupera (carencia de 14 dias)', () => {
    const s = novo(); s.atual = 10; s.ultimo = '2026-10-01';
    bloco(s, '2026-10-03'); bloco(s, '2026-10-03'); A.equal(s.atual, 11);
    s.ultimo = '2026-10-05'; s.atual = 11; bloco(s, '2026-10-07'); bloco(s, '2026-10-07'); A.equal(s.atual, 6);
  });
  await teste('8. domingo marcado como livre nao e falta', () => {
    const s = novo(); s.diasLivres = [0]; s.atual = 4; s.ultimo = '2026-10-17';   // sabado; 18/10/2026 e domingo
    A.equal(M.diaSemana('2026-10-18'), 0);
    bloco(s, '2026-10-19'); A.equal(s.atual, 5); A.equal(s.descansando, false);
  });
  await teste('9. pausa do responsavel ate 06/10 nao e falta', () => {
    const s = novo(); s.atual = 4; s.ultimo = '2026-10-01'; s.pausaAte = '2026-10-06';
    bloco(s, '2026-10-07'); A.equal(s.atual, 5);
  });
  await teste('10. ja com 2 congeladores: contador fica em 6', () => {
    const s = novo(); s.congeladores = 2; s.prog = 6; bloco(s, '2026-10-01'); A.equal(s.congeladores, 2); A.equal(s.prog, 6);
  });
  await teste('11. 1 congelador, 3 dias perdidos: nao gasta, descansa', () => {
    const s = novo(); s.atual = 6; s.congeladores = 1; s.ultimo = '2026-10-01';
    abrir(s, '2026-10-04'); A.equal(s.congeladores, 1); A.equal(s.descansando, true);
  });
  await teste('12. 21h30 em Brasilia (UTC-3) e o mesmo dia LOCAL (diaLocal usa componentes locais)', () => {
    // 21h30 do dia 24/10 em Brasilia = 00h30Z do dia 25. diaLocal recebe um Date e le getFullYear/Month/Date (locais).
    // Constroi o instante com componentes locais: qualquer fuso do aparelho deve devolver o dia 24.
    const noite = new Date(2026, 9, 24, 21, 30, 0);
    A.equal(diaLocal(noite), '2026-10-24');
    A.equal(diaLocal(new Date(2026, 9, 24, 0, 0, 1)), '2026-10-24');
    A.equal(diaLocal(new Date(2026, 9, 24, 23, 59, 59)), '2026-10-24');
    // contraste: a forma antiga (UTC) erra quando o fuso do aparelho e negativo
    const utc = noite.toISOString().slice(0, 10);
    if (noite.getTimezoneOffset() > 0) A.notEqual(utc, '2026-10-24', 'em fuso negativo o UTC ja e o dia seguinte');
  });
  await teste('13. dia local no codigo: nenhum toISOString() decide o dia em src/', () => {
    const fs = require('fs'); const path = require('path');
    const dir = path.join(__dirname, '..', 'src', 'interface');
    const ruins = [];
    for (const f of fs.readdirSync(dir).filter((x) => x.endsWith('.js'))) {
      fs.readFileSync(path.join(dir, f), 'utf8').split('\n').forEach((l, i) => {
        if (/toISOString\(\)\.slice\(0,\s*10\)/.test(l)) ruins.push(f + ':' + (i + 1));
      });
    }
    A.deepStrictEqual(ruins, [], 'ainda usa data em UTC: ' + ruins.join(', '));
  });
  await teste('14. relogio voltou no tempo: nao penaliza nem conta o dia duas vezes', () => {
    const s = novo(); s.atual = 5; s.melhor = 5; s.ultimo = '2026-10-10';
    bloco(s, '2026-10-08'); A.equal(s.atual, 5); A.equal(s.ultimo, '2026-10-10'); A.equal(s.relogioEstranho, true);
  });
  await teste('15. marcos 3, 7, 14 viram medalha permanente (nao se perdem no descanso)', () => {
    const s = novo(); jogar(s, ['2026-10-01', '2026-10-02', '2026-10-03', '2026-10-04', '2026-10-05', '2026-10-06', '2026-10-07']);
    A.equal(JSON.stringify(s.marcos), '[3,7]');
    bloco(s, '2026-10-20'); A.equal(s.atual, 4); A.equal(JSON.stringify(s.marcos), '[3,7]');
  });
  await teste('16. dias livres + pausa + congelador juntos: so os dias de verdade contam', () => {
    const s = novo(); s.diasLivres = [0]; s.congeladores = 1; s.atual = 3; s.ultimo = '2026-10-16'; // sexta
    // sab 17 faltou (1 dia), dom 18 livre; volta segunda 19
    bloco(s, '2026-10-19'); A.equal(s.congeladores, 0); A.equal(s.atual, 4);
  });
  resumo('ofensiva.js');
})();
