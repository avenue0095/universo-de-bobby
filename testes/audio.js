#!/usr/bin/env node
'use strict';
/* Camada de audio (src/interface/audio.js) e voz de reserva (som-e-voz.js), sem navegador.
   - a fala agendada nao sai depois de fechar a fase
   - som desligado silencia a voz
   - ranking de vozes: nada de Eddy/Flo/Grandma; voz sensata por idioma
   - tocar(): clipe do manifesto, reserva so quando falta clipe, cancelamento
   Uso: node testes/audio.js                                                            */
const assert = require('assert');
const { carregarApp } = require('./lib/carregar.js');
const { teste, espera, resumo } = require('./lib/mini.js');

function voz(name, lang, extra) { return Object.assign({ name, lang, localService: true, default: false }, extra || {}); }
function app() {
  const a = carregarApp(5);
  const falas = [];
  const cancelamentos = { n: 0 };
  a.ctx.speechSynthesis = {
    speaking: false, pending: false,
    cancel() { cancelamentos.n++; }, speak(u) { falas.push(u); setTimeout(() => u.onend && u.onend(), 0); },
    getVoices: () => a.ctx.__vozes || [], addEventListener() {},
  };
  a.ctx.SpeechSynthesisUtterance = function (t) { this.text = t; };
  a.ctx.__vozes = [];
  a.ctx.licaoAberta = () => true;       // o DOM falso nunca diz "aberta"
  return { a, falas, cancelamentos };
}
const usar = (a, vozes) => { a.ctx.__vozes = vozes; a.avaliar('carregarVozes()'); };

(async () => {
  await teste('1. fala agendada NAO sai depois de fechar a fase', async () => {
    const { a, falas } = app();
    a.avaliar("S.nivel='facil';S.som=true;S.voz=true");
    a.avaliar('abrirLicao(0,0)');               // etapa historia: agenda a fala em 350 ms
    a.avaliar('fecharLicao()');
    await espera(700);
    assert.strictEqual(falas.length, 0, 'falou ' + falas.length + ' vez(es) com a fase fechada');
  });

  await teste('1b. controle: sem fechar, a mesma fala agendada sai', async () => {
    const { a, falas } = app();
    a.avaliar("S.nivel='facil';S.som=true;S.voz=true");
    a.avaliar('abrirLicao(0,0)');
    await espera(700);
    assert.strictEqual(falas.length, 1, 'esperava 1 fala, saiu ' + falas.length);
  });

  await teste('1c. avancar de tela cancela a fala da tela anterior', async () => {
    const { a, falas } = app();
    a.avaliar("S.nivel='facil';S.som=true;S.voz=true");
    a.avaliar('abrirLicao(0,0)');               // agenda fala da historia
    a.avaliar("LIC.etapa='aula';pintarLicao()");   // outra tela antes dos 350 ms
    await espera(700);
    assert.strictEqual(falas.length, 0, 'a fala da historia saiu depois de a tela mudar para a aula');
  });

  await teste('2. desligar sons silencia a voz (falar e falarPedido)', async () => {
    const { a, falas } = app();
    a.avaliar('S.som=false');
    await a.avaliar("falar('Ola, tudo bem?')");
    await a.avaliar("falarPedido('Ola de novo')");
    assert.strictEqual(falas.length, 0, 'a voz falou com o som desligado');
    a.avaliar('S.som=true');
    const r = await a.avaliar("falar('Agora pode')");
    assert.strictEqual(r, 'reserva');
    assert.strictEqual(falas.length, 1);
    a.avaliar('S.voz=false');
    await a.avaliar("falar('Narracao desligada')");
    assert.strictEqual(falas.length, 1, 'S.voz=false tambem silencia');
  });

  await teste('3. ranking: sem vozes de piada; pt-BR e en-US sensatas', () => {
    const { a } = app();
    usar(a, [
      voz('Eddy (Português (Brasil))', 'pt-BR'), voz('Flo (Português (Brasil))', 'pt-BR'), voz('Grandma (Português (Brasil))', 'pt-BR'),
      voz('Grandpa (Português (Brasil))', 'pt-BR'), voz('Reed (Português (Brasil))', 'pt-BR'), voz('Rocko (Português (Brasil))', 'pt-BR'),
      voz('Sandy (Português (Brasil))', 'pt-BR'), voz('Shelley (Português (Brasil))', 'pt-BR'),
      voz('Joana', 'pt-PT'), voz('Luciana', 'pt-BR'), voz('Felipe', 'pt-BR'),
      voz('Fred', 'en-US'), voz('Ralph', 'en-US'), voz('Albert', 'en-US'), voz('Bad News', 'en-US'), voz('Zarvox', 'en-US'),
      voz('Samantha', 'en-US'), voz('Daniel', 'en-GB'), voz('Eddy (English (US))', 'en-US'),
    ]);
    const nomes = (l) => a.avaliar("vozesDe('" + l + "').map(v=>v.name)");
    const pt = nomes('pt-BR'), en = nomes('en-US');
    for (const ruim of ['Eddy', 'Flo', 'Grandma', 'Grandpa', 'Reed', 'Rocko', 'Sandy', 'Shelley', 'Fred', 'Ralph', 'Albert', 'Bad News', 'Zarvox']) {
      assert(!pt.concat(en).some((n) => n.startsWith(ruim)), ruim + ' continua na lista: ' + pt.concat(en));
    }
    assert.deepStrictEqual(pt.slice().sort(), ['Felipe', 'Luciana'], 'pt-BR deveria ter so Luciana e Felipe: ' + pt);
    assert.strictEqual(pt[0], 'Luciana');
    assert.deepStrictEqual(en, ['Samantha']);
    assert.strictEqual(a.avaliar("vozDe('pt-BR').name"), 'Luciana');
  });

  await teste('3b. Android: voz Google pt-BR vence pt-PT; local vence rede', () => {
    const { a } = app();
    usar(a, [voz('português (Portugal)', 'pt_PT'), voz('Google português do Brasil', 'pt_BR', { localService: false }),
             voz('pt-br-x-afs-local', 'pt_BR'), voz('Google US English', 'en_US', { localService: false }), voz('English United States', 'en_US')]);
    const pt = a.avaliar("vozesDe('pt-BR').map(v=>v.name)");
    assert(!pt.includes('português (Portugal)'), 'pt-PT entrou na lista de pt-BR');
    assert.strictEqual(pt.length, 2);
    const en = a.avaliar("vozesDe('en-US').map(v=>v.name)");
    assert.strictEqual(en.length, 2);
  });

  await teste('3c. so ha pt-PT: usa como ultimo recurso; so ha vozes de piada: nenhuma voz', () => {
    const { a } = app();
    usar(a, [voz('Joana', 'pt-PT')]);
    assert.strictEqual(a.avaliar("vozDe('pt-BR').name"), 'Joana');
    usar(a, [voz('Eddy (Português (Brasil))', 'pt-BR'), voz('Fred', 'en-US')]);
    assert.strictEqual(a.avaliar("vozDe('pt-BR')"), null);
    assert.strictEqual(a.avaliar("vozDe('en-US')"), null);
  });

  await teste('3d. voz escolhida de piada (de um perfil antigo) e ignorada', () => {
    const { a } = app();
    usar(a, [voz('Eddy (Português (Brasil))', 'pt-BR'), voz('Luciana', 'pt-BR')]);
    a.avaliar("S.vozPt='Eddy (Português (Brasil))'");
    assert.strictEqual(a.avaliar("vozDe('pt-BR').name"), 'Luciana');
  });

  await teste('4. tocar(): clipe do manifesto toca gravado, sem voz do aparelho', async () => {
    const { a, falas } = app();
    const eventos = [];
    const fontes = [];
    a.ctx.fetch = async (url) => { eventos.push(url); return { ok: true, arrayBuffer: async () => new ArrayBuffer(8) }; };
    a.ctx.AudioContext = function () {
      this.state = 'running'; this.destination = {};
      this.decodeAudioData = (b, ok) => ok({ duration: 1 });
      this.createBufferSource = () => { const f = { connect() {}, start() { setTimeout(() => f.onended && f.onended(), 5); }, stop() {} }; fontes.push(f); return f; };
    };
    a.avaliar("AC=null;audioDefinirManifesto({v:1,clipes:{'pt-br/aula/oi-12345678.m4a':{ms:900}},textos:{'pt-br|oi, tudo bem?':'pt-br/aula/oi-12345678.m4a'}},'voz/v1/')");
    const r1 = await a.avaliar("audioTocar('pt-br/aula/oi-12345678.m4a','pt-BR')");
    assert.strictEqual(r1, 'gravado');
    const r2 = await a.avaliar("audioTocar('Oi,   tudo bem?','pt-BR')");
    assert.strictEqual(r2, 'gravado', 'texto normalizado deveria achar o clipe');
    assert.strictEqual(falas.length, 0, 'voz do aparelho falou mesmo com clipe gravado');
    assert(eventos.every((u) => u.startsWith('voz/v1/')));
    assert.strictEqual(eventos.length, 1, 'o clipe deveria vir do cache na segunda vez');
    const r3 = await a.avaliar("audioTocar('texto sem clipe','pt-BR')");
    assert.strictEqual(r3, 'reserva');
    assert.strictEqual(falas.length, 1);
  });

  await teste('4b. clipe que falha cai para a reserva e nao fica em cache', async () => {
    const { a, falas } = app();
    a.ctx.fetch = async () => ({ ok: false, status: 404 });
    a.ctx.AudioContext = function () { this.state = 'running'; this.destination = {}; this.decodeAudioData = () => {}; this.createBufferSource = () => ({}); };
    a.avaliar("AC=null;audioDefinirManifesto({v:1,clipes:{'pt-br/x.m4a':{}},textos:{'pt-br|ola':'pt-br/x.m4a'}},'')");
    const r = await a.avaliar("audioTocar('ola','pt-BR')");
    assert.strictEqual(r, 'reserva');
    assert.strictEqual(falas.length, 1);
    assert.strictEqual(a.avaliar('AUDIO.cache.size'), 0);
  });

  await teste('4c. audioParar cancela clipe em andamento e fala agendada', async () => {
    const { a, falas } = app();
    let parou = 0;
    a.ctx.fetch = async () => ({ ok: true, arrayBuffer: async () => new ArrayBuffer(8) });
    a.ctx.AudioContext = function () {
      this.state = 'running'; this.destination = {};
      this.decodeAudioData = (b, ok) => ok({});
      this.createBufferSource = () => ({ connect() {}, start() {}, stop() { parou++; } });
    };
    a.avaliar("AC=null;audioDefinirManifesto({v:1,clipes:{'k.m4a':{}}},'')");
    const p = a.avaliar("audioTocar('k.m4a','pt-BR')");
    a.avaliar("audioAgendar(()=>falar('nunca'),50)");
    await espera(10);
    a.avaliar('audioParar()');
    await espera(120);
    assert.strictEqual(parou, 1, 'o clipe nao foi parado');
    assert.strictEqual(falas.length, 0, 'fala agendada saiu depois do audioParar');
    void p;
  });

  await teste('5. reserva: nao chama speak() em cima de cancel() quando ja ha fala', async () => {
    const { a, falas } = app();
    a.ctx.speechSynthesis.speaking = true;
    const p = a.avaliar("falar('uma fala longa')");
    assert.strictEqual(falas.length, 0, 'falou imediatamente depois do cancel');
    await espera(200);
    assert.strictEqual(falas.length, 1, 'a fala sumiu depois do cancel');
    void p;
  });

  await teste('6. en-US sem voz inglesa nao le com sotaque portugues', async () => {
    const { a, falas } = app();
    usar(a, [voz('Luciana', 'pt-BR')]);
    const r = await a.avaliar("falar('hello','en-US')");
    assert.strictEqual(r, 'sem-voz');
    assert.strictEqual(falas.length, 0);
  });

  resumo('audio.js');
})();
