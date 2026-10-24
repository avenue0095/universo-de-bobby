'use strict';
/* Carrega o codigo de src/ dentro do Node (modulo vm), fora do navegador.
   A ORDEM vem do proprio shell.html: e a mesma ordem que o navegador executa. */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const RAIZ = path.resolve(__dirname, '..', '..');
const SRC = path.join(RAIZ, 'src');

/* Cada marcador <!--@script ...--> do shell e UM bloco <script> no navegador. */
function blocosDoShell() {
  const shell = fs.readFileSync(path.join(SRC, 'interface', 'shell.html'), 'utf8');
  const blocos = [];
  const re = /<!--@script\s+(.*?)\s*-->/gs;
  let m;
  while ((m = re.exec(shell))) blocos.push(m[1].split(/\s+/));
  return blocos;
}
function ordemDosScripts() {
  return [].concat(...blocosDoShell());
}
/* Roda bloco a bloco, como o navegador: const/let de um bloco ficam visiveis nos seguintes,
   mas um bloco nao enxerga o que so e declarado depois (nada de TDZ falso por concatenar). */
function rodarBlocos(ctx, filtro) {
  const rodados = [];
  blocosDoShell().forEach((arqs, i) => {
    const usar = arqs.filter(filtro);
    if (!usar.length) return;
    vm.runInContext(usar.map(ler).join(''), ctx, { filename: 'bloco' + (i + 1) + ':' + usar[0] });
    rodados.push(...usar);
  });
  return rodados;
}

function ler(rel) {
  return fs.readFileSync(path.join(SRC, rel), 'utf8');
}

/* PRNG com semente (mulberry32): o teste repete igual quando a semente e a mesma. */
function prng(semente) {
  let a = semente >>> 0;
  return function () {
    a = (a + 0x6D2B79F5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* Elemento falso que aceita qualquer leitura/chamada: serve para o app rodar sem DOM. */
/* tudo o que o app escreve em innerHTML ou insertAdjacentHTML fica aqui, para os testes de seguranca olharem */
const HTML_LOG = [];
function elementoFalso() {
  const fn = function () {};
  const alvo = new Proxy(fn, {
    get(_, prop) {
      if (prop === Symbol.toPrimitive) return () => '';
      if (prop === 'then') return undefined;
      if (prop === 'length') return 0;
      if (prop === 'dataset') return {};
      if (prop === 'value') return '';
      if (prop === 'style') return { setProperty() {}, };
      if (prop === 'classList') return { add() {}, remove() {}, toggle() {}, contains() { return false; } };
      if (prop === 'insertAdjacentHTML') return (_p, h) => { HTML_LOG.push(String(h)); };
      if (prop === 'querySelectorAll') return () => [];
      if (prop === 'forEach') return () => {};
      return alvo;
    },
    set(_, prop, val) { if (prop === 'innerHTML' || prop === 'outerHTML') HTML_LOG.push(String(val)); return true; },
    apply() { return alvo; },
  });
  return alvo;
}

function contextoBase(semente) {
  const sandbox = {
    console,
    setTimeout, clearTimeout, setInterval, clearInterval,
    Math: Object.create(Math),
    Date, JSON, Object, Array, String, Number, Set, Map, Promise, RegExp, Error, Symbol,
    parseInt, parseFloat, isNaN, encodeURIComponent, decodeURIComponent,
  };
  sandbox.Math.random = prng(semente == null ? 1 : semente);
  sandbox.window = sandbox;
  sandbox.crypto = require('crypto').webcrypto; sandbox.TextEncoder = TextEncoder; sandbox.Uint8Array = Uint8Array;
  sandbox.innerWidth = 390; sandbox.innerHeight = 844;
  return sandbox;
}

/* So o motor de conteudo (src/conteudo/*): curriculo, aulas, historias, desenhos, lexico. */
function carregarConteudo(semente) {
  const sandbox = contextoBase(semente);
  const ctx = vm.createContext(sandbox);
  const arquivos = rodarBlocos(ctx, (f) => f.startsWith('conteudo/'));
  const codigo =
    '({UNITS_MAT,UNITS_PT,UNITS_EN,genQuestions,mc,inp,tf,escapa:typeof escapa==="function"?escapa:null,AULAS,MISSOES,CAPITULOS})';
  const saida = vm.runInContext(codigo, ctx, { filename: 'conteudo/(todos)' });
  return Object.assign({ ctx, arquivos }, saida);
}

/* O app inteiro com DOM falso: roda funcoes reais (abrirLicao, conferir, mostrarDica...). */
/* Date com relogio controlado: new Date() e Date.now() devolvem relogio.ms (mude relogio.ms para viajar no tempo). */
function dateComRelogio(relogio) {
  return class DataFalsa extends Date {
    constructor(...a) { if (a.length === 0) super(relogio.ms); else super(...a); }
    static now() { return relogio.ms; }
  };
}
/* opcoes: {armazenamento:{chave:texto}, relogio:{ms}} */
function carregarApp(semente, opcoes) {
  opcoes = opcoes || {};
  const sandbox = contextoBase(semente);
  if (opcoes.relogio) sandbox.Date = dateComRelogio(opcoes.relogio);
  const guarda = Object.assign({}, opcoes.armazenamento || {});
  sandbox.localStorage = {
    getItem: (k) => (k in guarda ? guarda[k] : null),
    setItem: (k, v) => { if (opcoes.recusar && opcoes.recusar(k)) throw new Error('QuotaExceededError'); guarda[k] = String(v); },
    removeItem: (k) => { delete guarda[k]; },
    key: (i) => Object.keys(guarda)[i] || null,
    get length() { return Object.keys(guarda).length; },
  };
  sandbox.document = {
    querySelector: () => elementoFalso(),
    querySelectorAll: () => [],
    getElementById: () => elementoFalso(),
    createElement: () => elementoFalso(),
    addEventListener() {},
    body: elementoFalso(),
    documentElement: elementoFalso(),
  };
  sandbox.navigator = { userAgent: 'node-teste', serviceWorker: undefined };
  sandbox.speechSynthesis = { cancel() {}, speak() {}, getVoices: () => [], addEventListener() {} };
  sandbox.SpeechSynthesisUtterance = function () {};
  sandbox.addEventListener = () => {};
  sandbox.matchMedia = () => ({ matches: false, addEventListener() {} });
  sandbox.requestAnimationFrame = (f) => setTimeout(f, 0);
  sandbox.AudioContext = undefined;
  const ctx = vm.createContext(sandbox);
  const arquivos = rodarBlocos(ctx, (f) => f !== 'interface/pwa.js');
  return { ctx, arquivos, guarda, avaliar: (js) => vm.runInContext(js, ctx) };
}

/* Modulos puros (sem DOM, sem estado): carrega so os arquivos pedidos, em ordem, num contexto limpo
   e devolve o que a expressao 'saida' montar, ex.: '({novo:ofensivaNova})'. */
function carregarModulos(arquivos, saida, semente) {
  const ctx = vm.createContext(contextoBase(semente));
  for (const f of arquivos) vm.runInContext(ler(f), ctx, { filename: f });
  const out = saida ? vm.runInContext(saida, ctx) : {};
  return Object.assign({ ctx, avaliar: (js) => vm.runInContext(js, ctx) }, out);
}

module.exports = { HTML_LOG, carregarModulos, RAIZ, SRC, ordemDosScripts, blocosDoShell, ler, carregarConteudo, carregarApp, prng, vm };
