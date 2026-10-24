'use strict';
/* Executor minimo de testes (sem pacote): teste(nome, fn) e resumo(). */
const resultados = [];
let erroAssincrono = null;
let emTeste = false;
process.on('uncaughtException', (e) => { if (emTeste) erroAssincrono = e; else { console.error('ERRO FORA DE TESTE:', e && e.stack || e); process.exit(1); } });
async function teste(nome, fn) {
  if (process.env.PASSO) console.error('> ' + nome);
  erroAssincrono = null; emTeste = true;
  try {
    await fn();
    if (erroAssincrono) throw erroAssincrono;
    resultados.push([true, nome]);
  } catch (e) {
    resultados.push([false, nome, e && e.stack ? e.stack.split('\n').slice(0, 4).join(' | ') : String(e)]);
  }
  emTeste = false;
}
const espera = (ms) => new Promise((r) => setTimeout(r, ms));
function resumo(titulo) {
  console.log(titulo);
  for (const r of resultados) console.log('  ' + (r[0] ? 'PASSOU  ' : 'FALHOU  ') + r[1] + (r[0] ? '' : '\n      ' + r[2]));
  const ok = resultados.filter((r) => r[0]).length;
  console.log('\n' + (ok === resultados.length ? 'OK' : 'FALHOU') + ': ' + ok + ' de ' + resultados.length + ' passaram');
  if (ok !== resultados.length) process.exitCode = 1;
}
module.exports = { teste, espera, resumo };
