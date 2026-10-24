#!/usr/bin/env node
'use strict';
/* Eventos locais e retencao D1/D7/D30 (referencia: docs/anexos/referencia-retencao.js).
   Uso: node testes/medicao.js                                                                 */
const fs = require('fs');
const path = require('path');
const A = require('assert');
const { carregarApp } = require('./lib/carregar.js');
const { teste, resumo } = require('./lib/mini.js');

const quando = (a, m, d, h) => new Date(a, m - 1, d, h || 10, 30, 0).getTime();
const relogio = { ms: quando(2026, 10, 24, 10) };
function novoApp() {
  relogio.ms = quando(2026, 10, 24, 10);
  const a = carregarApp(5, { relogio });
  a.avaliar("novoPerfil('Zeca Silva','#12A06E')");
  return a;
}
const eventos = (a) => JSON.parse(a.guarda['universo-bobby-eventos-v1']).itens;

(async () => {
  await teste('1. retencao: o exemplo da referencia (3 perfis sinteticos) bate: D1 0,33, D7 0,33, D30 0,5', () => {
    const a = carregarApp(1, { relogio });
    const mk = (pid, ds) => ds.map((d) => ({ e: 'bloco_fim', d, pid }));
    const ev = [...mk('a', ['2026-10-01', '2026-10-02', '2026-10-08', '2026-10-31']), ...mk('b', ['2026-10-01', '2026-10-05']), ...mk('c', ['2026-10-20'])];
    const r = JSON.parse(JSON.stringify(a.avaliar('retencao(' + JSON.stringify(ev) + ",'2026-11-05')")));
    A.strictEqual(r.D1, 0.33); A.strictEqual(r.n.D1, 3);
    A.strictEqual(r.D7, 0.33); A.strictEqual(r.D1_janela, 0.33); A.strictEqual(r.D30, 0.5);
    A.strictEqual(Object.keys(a.avaliar('coortes(' + JSON.stringify(ev) + ')')).length, 2);
  });

  await teste('2. mesma conta que o script de referencia (docs/anexos), em dados aleatorios', () => {
    const refPath = path.join(__dirname, '..', 'docs', 'anexos', 'referencia-retencao.js');
    if (!fs.existsSync(refPath)) return;   // docs/ nao entra no build; sem ele este teste e dispensado
    const ref = require(refPath);
    const a = carregarApp(1, { relogio });
    let seed = 12345; const rnd = () => (seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff;
    const ev = [];
    for (let p = 0; p < 25; p++) for (let d = 0; d < 60; d++) if (rnd() < 0.35) ev.push({ e: 'bloco_fim', d: new Date(Date.UTC(2026, 8, 1 + d)).toISOString().slice(0, 10), pid: 'p' + p });
    const esperado = ref.retencao(ev, '2026-11-20');
    const obtido = JSON.parse(JSON.stringify(a.avaliar('retencao(' + JSON.stringify(ev) + ",'2026-11-20')")));
    A.deepStrictEqual(obtido, JSON.parse(JSON.stringify(esperado)));
  });

  await teste('3. dia aberto sem terminar bloco nao conta como dia ativo; bloco abandonado tambem nao', () => {
    const a = novoApp();
    a.avaliar("abrirLicao(0,0);LIC.etapa='questao';pintarLicao();LIC.resp=LIC.qs[0].answer;conferir();fecharLicao()");
    const ev = eventos(a);
    const fim = ev.filter((e) => e.e === 'bloco_fim');
    A.strictEqual(fim.length, 1); A.strictEqual(fim[0].abandonou, 1); A.strictEqual(fim[0].contou, 0);
    const r = JSON.parse(JSON.stringify(a.avaliar('retencao(' + JSON.stringify(ev) + ",'2026-10-30')")));
    A.strictEqual(r.n.D1, 0, 'dia com bloco abandonado entrou na retencao');
  });

  await teste('4. campos: so numero, booleano e codigo curto; apelido e frase digitada nunca entram', () => {
    const a = novoApp();
    a.avaliar("registrarEvento('config_mudou',{chave:'faixa',nome:'Zeca Silva',texto:'meu endereco e rua tal 123',frase:'isso tem espacos',email:'a@b.c',n:7,ok:true})");
    const e = eventos(a).filter((x) => x.e === 'config_mudou').pop();
    A.strictEqual(e.chave, 'faixa'); A.strictEqual(e.n, 7); A.strictEqual(e.ok, 1);
    ['nome', 'texto', 'frase', 'email'].forEach((c) => A.ok(!(c in e), 'campo ' + c + ' passou'));
    A.ok(!JSON.stringify(eventos(a)).includes('Zeca'), 'apelido vazou');
    A.ok(!JSON.stringify(eventos(a)).includes('rua tal'));
  });

  await teste('5. evento de nome desconhecido e ignorado', () => {
    const a = novoApp();
    A.strictEqual(a.avaliar("registrarEvento('qualquer_coisa',{})"), false);
  });

  await teste('6. campos comuns: dia local, hora cheia, versao e sorteio da abertura; pid separado do apelido', () => {
    const a = novoApp();
    const e = eventos(a).filter((x) => x.e === 'perfil_criado')[0];
    A.strictEqual(e.d, '2026-10-24'); A.strictEqual(e.h, 10); A.ok(e.v); A.ok(e.s); A.ok(e.pid.length >= 8);
    A.notStrictEqual(e.pid, a.avaliar('STORE.perfis[0].id'), 'pid nao pode ser o id do perfil (que vai no backup)');
    A.ok(!/Zeca/i.test(e.pid));
  });

  await teste('7. teto: no maximo 4.000 eventos', () => {
    const a = novoApp();
    a.avaliar("for(let i=0;i<4500;i++)registrarEvento('app_aberto',{instalado:0})");
    A.ok(eventos(a).length <= 4000, 'ficou com ' + eventos(a).length);
  });

  await teste('8. teto: eventos com mais de 120 dias saem', () => {
    const a = novoApp();
    a.avaliar("registrarEvento('app_aberto',{})");
    relogio.ms += 130 * 864e5;
    a.avaliar("registrarEvento('app_aberto',{})");
    const ds = eventos(a).map((e) => e.d);
    A.ok(ds.every((d) => d >= '2026-10-24' && d > '2026-10-30' || d >= a.avaliar('somaDias(hoje(),-120)')), ds.join());
    A.ok(!ds.includes('2026-10-24'));
  });

  await teste('9. exportar metricas: pid trocado, sem apelido, sem id de abertura, so do perfil atual', () => {
    const a = novoApp();
    const pid = a.avaliar('perfilAtual().pid');
    const pac = JSON.parse(JSON.stringify(a.avaliar('pacoteDeMetricas(perfilAtual().pid)')));
    A.strictEqual(pac.tipo, 'metricas-anonimas');
    A.ok(pac.eventos.length >= 1);
    pac.eventos.forEach((e) => { A.notStrictEqual(e.pid, pid); A.ok(!('s' in e)); });
    A.ok(!JSON.stringify(pac).includes('Zeca'));
    A.ok(!JSON.stringify(pac).includes(a.avaliar('STORE.perfis[0].id')));
    const um = new Set(pac.eventos.map((e) => e.pid)); A.strictEqual(um.size, 1);
  });

  await teste('10. apagar o perfil apaga os eventos dele', () => {
    const a = novoApp();
    const pid = a.avaliar('perfilAtual().pid');
    A.ok(eventos(a).some((e) => e.pid === pid));
    a.avaliar('apagarPerfil(0)');
    A.ok(!eventos(a).some((e) => e.pid === pid));
  });

  await teste('11. resumo da semana: dias, minutos, perguntas e % de acerto vindos das estatisticas', () => {
    const a = novoApp();
    a.avaliar("S.stats.dias={'2026-10-24':{b:2,q:20,ac:15,seg:600,rev:4},'2026-10-22':{b:1,q:10,ac:10,seg:300,rev:0},'2026-10-10':{b:1,q:99,ac:99,seg:99,rev:9}}");
    const r = JSON.parse(JSON.stringify(a.avaliar('resumoSemana(S.stats,hoje())')));
    A.strictEqual(r.dias, 2); A.strictEqual(r.min, 15); A.strictEqual(r.perguntas, 30); A.strictEqual(r.pct, 83); A.strictEqual(r.revisoes, 4);
  });

  await teste('12. o painel do responsavel monta com e sem dados (sem excecao)', () => {
    const a = novoApp();
    A.ok(String(a.avaliar('medidorHTML()')).includes('Medidor do produto'));
    A.ok(String(a.avaliar('semanaHTML()')).includes('Esta semana'));
    A.ok(String(a.avaliar('controlesHTML()')).includes('Meta do dia'));
    a.avaliar("abrirLicao(0,0);LIC.etapa='questao';pintarLicao();while(LIC.etapa==='questao'){LIC.resp=LIC.qs[LIC.i].answer;conferir();avancar();}");
    A.ok(String(a.avaliar('medidorHTML()')).includes('dia 1'));
    A.ok(String(a.avaliar('rotinaHTML()')).includes('Rotina de hoje'));
  });

  await teste('13. falha de audio vira evento audio_falha sem texto livre', () => {
    const a = novoApp();
    a.avaliar("audioFalhou('pt-br/numero/vinte-1a2b3c4d.m4a','HTTP 404')");
    const e = eventos(a).filter((x) => x.e === 'audio_falha').pop();
    A.ok(e && e.clip && e.motivo);
  });

  resumo('medicao.js');
})();
