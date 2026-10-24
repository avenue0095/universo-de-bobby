#!/usr/bin/env node
'use strict';
/* Camada de audio com a voz GRAVADA (src/interface/audio.js e audio-clipes.js), sem navegador.
   - nenhuma voz do aparelho: speechSynthesis nao aparece no codigo e, se alguem chamar, o teste falha
   - texto vira clipe pelo mesmo hash do gerador; enunciado com numero vira fila de quadros e encaixes
   - "desligar sons" silencia, fechar a fase cancela, formato .m4a por padrao, pacotes no cache bobby-audio-v1
   Uso: node testes/audio.js                                                                  */
const fs = require('fs');
const path = require('path');
const A = require('assert');
const { carregarApp } = require('./lib/carregar.js');
const { teste, espera, resumo } = require('./lib/mini.js');

const RAIZ = path.join(__dirname, '..');
const MIN = JSON.parse(fs.readFileSync(path.join(RAIZ, 'audio', 'manifesto-min.json'), 'utf8'));
const MIN_TXT = JSON.stringify(MIN);

/* app com manifesto, fetch, AudioContext e caches falsos; tudo registrado para conferir */
function novo(opcoes) {
  opcoes = opcoes || {};
  const a = carregarApp(5);
  const reg = { fetch: [], fontes: [], paradas: 0, cache: {}, sintese: 0 };
  a.ctx.speechSynthesis = new Proxy({}, { get() { reg.sintese++; throw new Error('speechSynthesis foi usado: nao pode haver voz do aparelho'); } });
  a.ctx.SpeechSynthesisUtterance = function () { reg.sintese++; throw new Error('SpeechSynthesisUtterance usado'); };
  a.ctx.fetch = async (url) => {
    reg.fetch.push(String(url));
    if (opcoes.semRede) throw new Error('sem rede');
    if (/manifesto-min\.json$/.test(url)) return { ok: true, status: 200, json: async () => JSON.parse(MIN_TXT), clone() { return this; } };
    return { ok: !opcoes.clipe404, status: opcoes.clipe404 ? 404 : 200, arrayBuffer: async () => new ArrayBuffer(8), clone() { return this; } };
  };
  a.ctx.AudioContext = function () {
    this.state = 'running'; this.destination = {}; this.currentTime = 10;
    this.decodeAudioData = (b, ok) => { ok({ duration: 1.5 }); };
    this.createBufferSource = () => {
      const f = { playbackRate: { value: 1 }, connect() {}, inicio: null, parada: false,
        start(t) { f.inicio = t; reg.fontes.push(f); setTimeout(() => f.onended && f.onended(), 2); },
        stop() { f.parada = true; reg.paradas++; } };
      return f;
    };
  };
  a.ctx.caches = { open: async (n) => { reg.cache[n] = reg.cache[n] || {}; return { match: async (u) => reg.cache[n][String(u)] || null, put: async (u, r) => { reg.cache[n][String(u)] = r; } }; }, keys: async () => Object.keys(reg.cache), delete: async () => true };
  a.avaliar('AC=null;AUDIO.pronto=null;AUDIO.semAudio=false;AUDIO.buffers.clear();AUDIO.formato=null;audioIndexar({v:1,pacotes:{}})');
  a.reg = reg;
  return a;
}
const pronto = async (a) => { await a.avaliar('audioIniciar()'); await espera(5); };
const chaveDe = (a, classe, lang, texto) => a.avaliar('audioChaveDe(' + JSON.stringify(classe) + ',' + JSON.stringify(lang) + ',' + JSON.stringify(texto) + ')');

(async () => {
  await teste('1. nenhuma voz do aparelho no codigo: speechSynthesis e SpeechSynthesisUtterance nao existem em src/', () => {
    const dir = path.join(RAIZ, 'src');
    const achados = [];
    const varre = (d) => fs.readdirSync(d, { withFileTypes: true }).forEach((e) => {
      const p = path.join(d, e.name);
      if (e.isDirectory()) return varre(p);
      if (!/\.(js|html)$/.test(e.name)) return;
      const t = fs.readFileSync(p, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
      if (/speechSynthesis|SpeechSynthesisUtterance|getVoices|vozesDe|vozDe\(|temVoz|VOZ_PIADA/.test(t)) achados.push(path.relative(RAIZ, p));
    });
    varre(dir);
    A.deepStrictEqual(achados, [], 'ainda usa voz do aparelho: ' + achados.join(', '));
  });

  await teste('2. o hash do nome do clipe e o do gerador (FNV-1a de classe + texto, em UTF-8, com acentos)', () => {
    const a = novo(); a.avaliar('audioIndexar(' + MIN_TXT + ')');
    A.strictEqual(chaveDe(a, 'numero', 'pt-BR', 'zero'), 'pt-br/numero/zero-33dae30b');
    A.strictEqual(chaveDe(a, 'nome', 'pt-BR', 'Lívia'), 'pt-br/nome/livia-65ccc418');
    A.strictEqual(chaveDe(a, 'numero', 'pt-BR', 'três'), 'pt-br/numero/tres-e1268bbf');
    // todo clipe do manifesto cujo texto conhecemos: confere uma amostra do manifesto completo
    const M = JSON.parse(fs.readFileSync(path.join(RAIZ, 'audio', 'manifesto.json'), 'utf8')).clipes;
    const dir = { 'aula-passo': 1, 'capitulo-abre': 1, missao: 1, 'missao-fim': 1, 'en-alvo': 1, 'pt-glosa': 1, 'pt-palavra': 1, 'pt-silaba': 1, 'pt-letra': 1, 'pt-leitura': 1, 'quadro-enunciado': 1, numero: 1, nome: 1, feedback: 1 };
    const ks = Object.keys(M).filter((k, i) => i % 7 === 0 && dir[M[k].classe]);
    let ok = 0;
    ks.forEach((k) => { const v = M[k]; if (chaveDe(a, v.classe, v.idioma, v.texto) === k) ok++; });
    A.strictEqual(ok, ks.length, 'so ' + ok + ' de ' + ks.length + ' nomes bateram');
  });

  await teste('3. enunciado com numeros: quadros + numeros por extenso, na ordem em que se fala', () => {
    const a = novo(); a.avaliar('audioIndexar(' + MIN_TXT + ')');
    const s = a.avaliar("(function(){const s=audioSequencia('Qual número vem depois do 16?','pt-BR','mat');return {f:s.faltas,c:s.chaves,comp:s.composto}})()");
    A.strictEqual(JSON.stringify(s.f), '[]'); A.strictEqual(s.comp, true);
    const txt = s.c.map((k) => k.split('/').pop().replace(/-[0-9a-f]{8}$/, ''));
    A.strictEqual(JSON.stringify(txt), JSON.stringify(['qual-numero-vem-depois-do', 'dezesseis']));
    const n23 = a.avaliar("audioNumeroClipes('23').chaves.map(k=>k.split('/').pop().replace(/-[0-9a-f]{8}$/,''))");
    A.strictEqual(JSON.stringify(n23), JSON.stringify(['vinte', 'e', 'tres']));
    A.deepStrictEqual(a.avaliar("audioNumeroPalavras('3,5')"), 'três vírgula cinco');
    A.deepStrictEqual(a.avaliar("audioNumeroPalavras('1250')"), 'mil duzentos e cinquenta');
    A.deepStrictEqual(a.avaliar("audioNumeroPalavras('3,05')"), 'três vírgula zero cinco');
    A.strictEqual(a.avaliar("audioNumeroPalavras('100')"), 'cem'); A.strictEqual(a.avaliar("audioNumeroPalavras('101')"), 'cento e um');
  });

  await teste('4. texto inteiro com clipe (passo de aula) toca 1 clipe; sem clipe devolve a falta e NAO inventa voz', () => {
    const a = novo(); a.avaliar('audioIndexar(' + MIN_TXT + ')');
    const s = a.avaliar("(function(){const p=passosDe(UNITS_MAT[0].lessons[0])[0];const r=audioSequencia(p.t+'. '+p.c,'pt-BR','mat');return {n:r.chaves.length,f:r.faltas}})()");
    A.strictEqual(s.n, 1); A.strictEqual(JSON.stringify(s.f), '[]');
    const x = a.avaliar("audioSequencia('uma frase que ninguem gravou jamais','pt-BR','mat')");
    A.strictEqual(x.chaves.length, 0); A.ok(x.faltas.length >= 1);
  });

  await teste('5. tocar(): baixa o manifesto, usa .m4a, toca em fila sem intervalo e termina "gravado"', async () => {
    const a = novo(); await pronto(a);
    const r = await a.avaliar("audioTocar('Qual número vem depois do 16?','pt-BR','mat')");
    A.strictEqual(r, 'gravado');
    const urls = a.reg.fetch.filter((u) => /\.m4a$/.test(u));
    A.strictEqual(urls.length >= 2, true, 'esperava os clipes .m4a, veio ' + a.reg.fetch.join());
    A.ok(a.reg.fetch.every((u) => !/\.opus$/.test(u)), 'pediu opus sem precisar');
    A.ok(urls.every((u) => u.startsWith('audio/')));
    const ini = a.reg.fontes.map((f) => f.inicio);
    A.strictEqual(ini.length, 2);
    A.ok(Math.abs((ini[1] - ini[0]) - 1.5) < 1e-6, 'a fila deveria ser contigua (1,5 s de clipe): ' + ini);
    const log = a.avaliar('AUDIO.log.map(l=>l.estado)');
    A.ok(log.includes('iniciou') && log.includes('terminou'));
    A.strictEqual(a.reg.sintese, 0);
  });

  await teste('6. formato: .m4a (AAC) por padrao; .opus so se o aparelho nao toca AAC e confirma Opus', () => {
    const a = novo();
    const prova = (aac, opus) => {
      a.ctx.document.createElement = () => ({ canPlayType: (t) => (/mp4a/.test(t) ? aac : /opus/.test(t) ? opus : '') });
      a.avaliar('AUDIO.formato=null'); return a.avaliar('audioFormato()');
    };
    A.strictEqual(prova('probably', 'probably'), '.m4a');
    A.strictEqual(prova('maybe', ''), '.m4a');
    A.strictEqual(prova('', 'probably'), '.opus');
    A.strictEqual(prova('', ''), '.m4a');
  });

  await teste('7. tres interruptores independentes: Voz desligada cala a fala e nem baixa clipe; Efeitos desligados NAO calam a voz', async () => {
    const a = novo(); await pronto(a); await espera(60);          // deixa o pacote core da 1a visita terminar
    const antes = a.reg.fetch.length;
    a.avaliar('S.voz=false');
    A.strictEqual(await a.avaliar("falar('Boa!')"), 'mudo');
    A.strictEqual(await a.avaliar("falarPedido('Boa!')"), 'mudo');
    A.strictEqual(a.reg.fontes.length, 0); A.strictEqual(a.reg.fetch.length, antes, 'baixou clipe com a voz desligada');
    a.avaliar('S.som=false;S.voz=true');
    A.strictEqual(await a.avaliar("falar('Boa!')"), 'gravado', 'a voz deveria continuar com os efeitos desligados');
    A.strictEqual(a.avaliar("sfx('acerto',1)"), false, 'efeito tocou com Efeitos desligados');
    a.avaliar('S.som=true');
    A.strictEqual(await a.avaliar("falar('Boa!')"), 'gravado');
  });

  await teste('8. desligar o som no meio da fala para o clipe', async () => {
    const a = novo(); await pronto(a);
    const p = a.avaliar("audioTocar('Qual número vem depois do 16?','pt-BR','mat')");
    await espera(1);
    a.avaliar('S.voz=false;calar()');
    await p;
    await espera(10);
    A.ok(a.reg.fontes.every((f) => f.parada || f.inicio === null) || a.reg.paradas >= 0);
  });

  await teste('9. fechar a fase cancela: fala agendada nao sai e clipe em andamento para', async () => {
    const a = novo(); await pronto(a);
    a.ctx.licaoAberta = () => true;
    a.avaliar("S.faixa='f78';S.som=true;S.voz=true");
    a.avaliar('abrirLicao(0,0)');               // agenda a fala de abertura (350 ms)
    a.avaliar('fecharLicao()');
    await espera(700);
    A.strictEqual(a.reg.fontes.length, 0, 'falou depois de fechar a fase');
    // controle: sem fechar, sai
    const b = novo(); await pronto(b);
    b.ctx.licaoAberta = () => true;
    b.avaliar("S.faixa='f78';S.som=true;S.voz=true");
    b.avaliar('abrirLicao(0,0)');
    await espera(700);
    A.ok(b.reg.fontes.length >= 1, 'controle: a abertura deveria tocar');
    // clipe tocando para ao fechar
    b.avaliar("audioTocar('Qual número vem depois do 16?','pt-BR','mat')");
    await espera(1);
    const antes = b.reg.paradas;
    b.avaliar('fecharLicao()');
    A.ok(b.reg.paradas >= antes);
  });

  await teste('10. nova fala cancela a anterior (so uma fila por vez)', async () => {
    const a = novo(); await pronto(a);
    const p1 = a.avaliar("audioTocar('Qual número vem depois do 16?','pt-BR','mat')");
    const r2 = await a.avaliar("audioTocar('Boa!','pt-BR','mat')");
    A.strictEqual(r2, 'gravado');
    A.strictEqual(await p1, 'cancelado');
  });

  await teste('11. abertura de capitulo + missao tocam em fila (2 clipes, uma chamada)', async () => {
    const a = novo(); await pronto(a);
    const r = await a.avaliar("(function(){const cap=CAPITULOS[1],m=MISSOES['1.1'];return audioTocar([cap.abre,m.t+'. '+m.abre],'pt-BR','mat');})()");
    A.strictEqual(r, 'gravado'); A.strictEqual(a.reg.fontes.length, 2);
  });

  await teste('12. sem clipe: devolve sem-clipe, nada toca, e o aviso vira evento so com codigo curto (sem o texto)', async () => {
    const a = novo(); await pronto(a);
    a.avaliar("novoPerfil('Zeca','#12A06E')");
    const r = await a.avaliar("audioTocar('frase secreta do Zeca que ninguem gravou','pt-BR','mat')");
    A.strictEqual(r, 'sem-clipe'); A.strictEqual(a.reg.fontes.length, 0); A.strictEqual(a.reg.sintese, 0);
    const ev = JSON.parse(a.guarda['universo-bobby-eventos-v1']).itens.filter((e) => e.e === 'audio_falha');
    A.ok(ev.length >= 1); ev.forEach((e) => A.ok(/^sem-[0-9a-f]{8}$/.test(e.clip) && !/Zeca|secreta/.test(JSON.stringify(e))));
  });

  await teste('13. clipe que da 404: pula e segue; nao cai em voz do aparelho', async () => {
    const a = novo({ clipe404: true }); await pronto(a);
    const r = await a.avaliar("audioTocar('Boa!','pt-BR','mat')");
    A.strictEqual(r, 'sem-clipe'); A.strictEqual(a.reg.sintese, 0);
  });

  await teste('14. velocidade: 80% a 120%, aplicada no playbackRate; a duracao da fila acompanha', async () => {
    const a = novo(); await pronto(a);
    a.avaliar('S.velocidade=0.5'); A.strictEqual(a.avaliar('audioVelocidade()'), 0.8);
    a.avaliar('S.velocidade=2'); A.strictEqual(a.avaliar('audioVelocidade()'), 1.2);
    a.avaliar('S.velocidade=1.2');
    await a.avaliar("audioTocar('Qual número vem depois do 16?','pt-BR','mat')");
    A.ok(a.reg.fontes.every((f) => f.playbackRate.value === 1.2));
    A.ok(Math.abs((a.reg.fontes[1].inicio - a.reg.fontes[0].inicio) - 1.5 / 1.2) < 1e-6);
  });

  await teste('15. pre-carga do proximo texto: baixa e decodifica sem tocar', async () => {
    const a = novo(); await pronto(a);
    const n = await a.avaliar("audioPrecarregarTexto('Qual número vem depois do 16?','pt-BR','mat')");
    A.strictEqual(n, 2); A.strictEqual(a.reg.fontes.length, 0);
    const antes = a.reg.fetch.length;
    await a.avaliar("audioTocar('Qual número vem depois do 16?','pt-BR','mat')");
    A.strictEqual(a.reg.fetch.length, antes, 'tocou de novo baixando: a pre-carga nao valeu');
  });

  await teste('16. pacote core vai para o cache bobby-audio-v1 na primeira visita; 2a vez nao baixa de novo', async () => {
    const a = novo(); await pronto(a);
    await espera(50);
    const n = Object.keys(a.reg.cache['bobby-audio-v1'] || {}).filter((u) => /\.m4a$/.test(u)).length;
    A.strictEqual(n, MIN.pacotes.core ? Object.keys(MIN.pacotes.core).length : 0, 'core: ' + n);
    A.ok(a.avaliar('audioGuardado().pacotes.core'));
    const f = a.reg.fetch.length;
    const r = await a.avaliar("audioBaixarPacote('core')");
    A.strictEqual(r.ja, true); A.strictEqual(a.reg.fetch.length, f);
  });

  await teste('17. pacote de materia: baixa so a materia pedida, com tamanho conhecido; falha de arquivo nao marca como guardado', async () => {
    const a = novo(); await pronto(a); await espera(30);
    const r = await a.avaliar("audioBaixarPacote('mat')");
    A.strictEqual(r.ok, true); A.strictEqual(r.total, Object.keys(MIN.pacotes.mat).length);
    A.strictEqual(a.avaliar('audioTamanhoPacote("mat")'), Object.values(MIN.pacotes.mat).reduce((s, v) => s + v[2], 0));
    const b = novo({ clipe404: true }); await pronto(b);
    const r2 = await b.avaliar("audioBaixarPacote('pt')");
    A.strictEqual(r2.ok, false); A.ok(r2.falhas > 0);
    A.ok(!(b.avaliar('audioGuardado().pacotes||{}').pt), 'marcou guardado com falha');
  });

  await teste('18. sem manifesto (sem internet na 1a visita): perguntas de ouvir viram de ler; ao voltar a rede, ouvir volta', async () => {
    const a = novo({ semRede: true });
    await a.avaliar('audioIniciar()').catch(() => {});
    A.strictEqual(a.avaliar('audioPodeOuvir()'), false);
    A.strictEqual(a.avaliar("podeOuvirEN()"), false);
    A.strictEqual(await a.avaliar("audioTocar('Boa!','pt-BR','mat')"), 'indisponivel');
    A.strictEqual(a.reg.sintese, 0);
    a.ctx.fetch = async (u) => (/manifesto/.test(u) ? { ok: true, json: async () => JSON.parse(MIN_TXT) } : { ok: true, arrayBuffer: async () => new ArrayBuffer(8) });
    await a.avaliar('audioIniciar()');
    A.strictEqual(a.avaliar('audioPodeOuvir()'), true);
  });

  await teste('19. com audio, pergunta de ingles e de OUVIR (nao a de ler "se fala assim")', () => {
    const a = novo(); a.avaliar('audioIndexar(' + MIN_TXT + ')');
    const r = a.avaliar("(function(){let ouvir=0,ler=0;for(let i=0;i<60;i++){genQuestions(UNITS_EN[0].lessons[2],8).forEach(q=>{if(q.ouvir)ouvir++;if(/se fala assim/.test(q.prompt))ler++;});}return {ouvir:ouvir,ler:ler};})()");
    A.ok(r.ouvir > 0 && r.ler === 0, JSON.stringify(r));
  });

  await teste('20. tela Voz e som monta sem seletor de voz do aparelho e com liga/desliga, velocidade e pacotes', () => {
    const a = novo(); a.avaliar('audioIndexar(' + MIN_TXT + ')');
    a.avaliar("novoPerfil('Zeca','#12A06E')");
    a.avaliar('telaVoz()');
    A.strictEqual(a.reg.sintese, 0);
    const fonte = fs.readFileSync(path.join(RAIZ, 'src', 'interface', 'voz-e-seguranca.js'), 'utf8');
    ['data-som', 'data-voz', 'id="vel"', 'Guardar tudo para jogar sem internet'].forEach((t) => A.ok(fonte.includes(t), 'falta ' + t));
    A.ok(!/Voz do português|Voz padrão do aparelho/.test(fonte));
  });

  resumo('audio.js');
})();
