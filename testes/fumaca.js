#!/usr/bin/env node
'use strict';
/* Teste de fumaca no navegador de verdade (Chrome), SEM pacote nenhum:
   sobe um servidor local, abre o Chrome headless e conversa com ele pelo protocolo DevTools (CDP).
   Cria um jogador, joga UMA fase de cada materia (desktop e celular) e falha se houver
   excecao, console.error ou erro de rede de arquivo local.
   Se preferir Playwright: instrucoes no README.md (secao Testes).
   Uso: node testes/fumaca.js [--chrome="/caminho/do/chrome"] [--foto]            */
const http = require('http');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawn } = require('child_process');

const RAIZ = path.resolve(__dirname, '..');
const arg = (n) => { const a = process.argv.find((x) => x.startsWith('--' + n + '=')); return a ? a.slice(n.length + 3) : null; };
const FOTO = process.argv.includes('--foto');
const CHROME = arg('chrome') || process.env.CHROME_BIN || [
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser',
].find((p) => fs.existsSync(p));

if (!CHROME) { console.log('SEM CHROME: instale o Chrome ou passe --chrome=/caminho. Teste NAO rodou.'); process.exit(2); }
if (typeof WebSocket === 'undefined') { console.log('Precisa de Node 22+ (WebSocket nativo). Teste NAO rodou.'); process.exit(2); }

const TIPOS = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.svg': 'image/svg+xml', '.webmanifest': 'application/manifest+json' };
const servidor = http.createServer((req, res) => {
  let rel = decodeURIComponent(req.url.split('?')[0]);
  if (rel === '/') rel = '/index.html';
  const arq = path.join(RAIZ, rel);
  if (!arq.startsWith(RAIZ) || rel.startsWith('/src') || rel.startsWith('/.git') || !fs.existsSync(arq) || fs.statSync(arq).isDirectory()) { res.writeHead(404); res.end('nao'); return; }
  res.writeHead(200, { 'content-type': TIPOS[path.extname(arq)] || 'application/octet-stream', 'cache-control': 'no-store' });
  fs.createReadStream(arq).pipe(res);
});

const dorme = (ms) => new Promise((r) => setTimeout(r, ms));
async function esperaHttp(url, tentativas = 60) {
  for (let i = 0; i < tentativas; i++) {
    try { const r = await fetch(url); if (r.ok) return r.json(); } catch (e) { /* ainda subindo */ }
    await dorme(250);
  }
  throw new Error('Chrome nao respondeu em ' + url);
}

async function main() {
  await new Promise((r) => servidor.listen(0, '127.0.0.1', r));
  const porta = servidor.address().port;
  const base = 'http://127.0.0.1:' + porta;
  const perfil = fs.mkdtempSync(path.join(os.tmpdir(), 'bobby-chrome-'));
  const portaCdp = 9300 + Math.floor(Math.random() * 500);
  const chrome = spawn(CHROME, ['--headless=new', '--remote-debugging-port=' + portaCdp, '--user-data-dir=' + perfil,
    '--no-first-run', '--no-default-browser-check', '--disable-gpu', '--mute-audio', 'about:blank'], { stdio: 'ignore' });
  const limpa = () => { try { chrome.kill(); } catch (e) {} try { servidor.close(); } catch (e) {} };
  process.on('exit', limpa);

  try {
    const alvos = await esperaHttp('http://127.0.0.1:' + portaCdp + '/json/list');
    const pagina = alvos.find((a) => a.type === 'page');
    const ws = new WebSocket(pagina.webSocketDebuggerUrl);
    await new Promise((ok, no) => { ws.onopen = ok; ws.onerror = no; });
    let id = 0; const pend = new Map(); const eventos = [];
    ws.onmessage = (m) => {
      const d = JSON.parse(m.data);
      if (d.id && pend.has(d.id)) { const { ok, no } = pend.get(d.id); pend.delete(d.id); d.error ? no(new Error(d.error.message)) : ok(d.result); }
      else if (d.method) eventos.push(d);
    };
    const cdp = (method, params) => new Promise((ok, no) => { const i = ++id; pend.set(i, { ok, no }); ws.send(JSON.stringify({ id: i, method, params: params || {} })); });
    const js = async (expr) => {
      const r = await cdp('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true });
      if (r.exceptionDetails) throw new Error('JS: ' + (r.exceptionDetails.exception && r.exceptionDetails.exception.description || r.exceptionDetails.text));
      return r.result.value;
    };
    await cdp('Runtime.enable'); await cdp('Log.enable'); await cdp('Page.enable'); await cdp('Network.enable');

    const problemas = []; const avisos = []; const feito = [];
    const EXTERNO = /fonts\.googleapis|fonts\.gstatic|cdnjs\.cloudflare|favicon\.ico/;  // favicon.ico: o Chrome pede sozinho; o app declara o icone por <link>
    const urlsDeRede = new Map();
    const coleta = (rotulo) => {
      while (eventos.length) {
        const e = eventos.shift(), p = e.params;
        if (e.method === 'Network.requestWillBeSent') urlsDeRede.set(p.requestId, p.request.url);
        if (e.method === 'Runtime.exceptionThrown') problemas.push(rotulo + ' excecao: ' + ((p.exceptionDetails.exception && p.exceptionDetails.exception.description) || p.exceptionDetails.text));
        if (e.method === 'Runtime.consoleAPICalled' && p.type === 'error') problemas.push(rotulo + ' console.error: ' + p.args.map((a) => a.value || a.description).join(' '));
        if (e.method === 'Log.entryAdded' && p.entry.level === 'error') {
          const u = p.entry.url || '';
          (EXTERNO.test(u) || EXTERNO.test(p.entry.text) ? avisos : problemas).push(rotulo + ' log: ' + p.entry.text + ' ' + u);
        }
        if (e.method === 'Network.loadingFailed') {
          const u = urlsDeRede.get(p.requestId) || '';
          if (p.canceled) continue;
          (EXTERNO.test(u) ? avisos : problemas).push(rotulo + ' rede falhou: ' + u + ' ' + p.errorText);
        }
        if (e.method === 'Network.responseReceived' && p.response.status >= 400 && p.response.url.startsWith(base) && !/favicon\.ico/.test(p.response.url)) problemas.push(rotulo + ' HTTP ' + p.response.status + ' ' + p.response.url);
      }
    };

    const telas = [['desktop', { width: 1280, height: 800, deviceScaleFactor: 1, mobile: false }], ['celular', { width: 390, height: 844, deviceScaleFactor: 2, mobile: true }]];
    for (const [nomeTela, medidas] of telas) {
      await cdp('Emulation.setDeviceMetricsOverride', medidas);
      await cdp('Page.navigate', { url: 'about:blank' });
      await js("try{localStorage.clear()}catch(e){}").catch(() => {});
      await cdp('Page.navigate', { url: base + '/index.html' });
      await dorme(1200);
      /* limpa o armazenamento do app para sempre comecar com jogador novo */
      await js("localStorage.clear();location.reload();0");
      await dorme(1500);
      const rot = nomeTela;
      /* 1) cria o jogador pelo modal, como a crianca faria */
      const modalAberto = await js("document.querySelector('#modal').classList.contains('on')");
      if (!modalAberto) problemas.push(rot + ': o modal de novo jogador nao abriu no primeiro acesso');
      await js("(()=>{const c=document.querySelector('#campo-nome');c.value='Teste Fumaça';document.querySelector('#salvar-nome').click();return 1})()");
      await dorme(500);
      const nomeNaTela = await js("document.body.innerText.includes('Teste Fumaça')");
      if (!nomeNaTela) problemas.push(rot + ': o nome do jogador nao apareceu na tela inicial');

      /* 1b) ofensiva e botao de som precisam estar a vista no topo, inclusive no celular (antes eram escondidos) */
      const topo = await js("(()=>{const r=(s)=>{const e=document.querySelector(s);if(!e)return null;const b=e.getBoundingClientRect();return {w:b.width,h:b.height,r:b.right,l:b.left}};return {fogo:r('#st-fogo'),som:r('#som'),moedas:r('#st-moedas'),iw:innerWidth}})()");
      for (const k of ['fogo', 'som', 'moedas']) {
        const b = topo[k];
        if (!b || b.w < 10 || b.h < 10) problemas.push(rot + ': #' + k + ' escondido no topo');
        else if (b.r > topo.iw + 1 || b.l < -1) problemas.push(rot + ': #' + k + ' fora da tela (' + Math.round(b.l) + '..' + Math.round(b.r) + ' de ' + topo.iw + ')');
      }
      feito.push(rot + ': topo com ofensiva, moedas e som a vista');

      /* 2) joga a primeira fase de cada materia, clicando nos botoes de verdade */
      for (const mat of ['mat', 'pt', 'en']) {
        await js("usarMateria('" + mat + "');0"); await dorme(300);
        await js("abrirLicao(0,0);0"); await dorme(300);
        let etapa = '', guarda = 0;
        while (guarda++ < 80) {
          etapa = await js('LIC.etapa');
          if (etapa === 'fim') break;
          if (etapa === 'questao') {
            const info = await js("(()=>{const q=LIC.qs[LIC.i];return {tipo:q.type,k:q.type==='mc'?q.options.map(String).indexOf(String(q.answer)):-1,r:String(q.answer)}})()");
            if (info.tipo === 'mc') {
              if (info.k < 0) problemas.push(rot + ' ' + mat + ': gabarito fora das opcoes na tela');
              await js("document.querySelector('.alt[data-v=\"" + info.k + "\"]').click();0");
            } else {
              /* tipos com teclado/blocos/sílabas: grava a resposta como a interface gravaria */
              await js("(()=>{const q=LIC.qs[LIC.i];LIC.resp=String(q.answer);LIC.digitado=String(q.answer);const a=document.querySelector('#acao');a.disabled=false;return 1})()");
            }
          }
          await js("document.querySelector('#acao').click();0");
          await dorme(60);
          coleta(rot + ' ' + mat);
        }
        const r = await js('({etapa:LIC.etapa,acertos:LIC.acertos,base:LIC.base,vidas:LIC.vidas,erros:LIC.erros})');
        if (r.etapa !== 'fim' || r.acertos !== r.base || r.erros !== 0) problemas.push(rot + ' ' + mat + ': fase nao fechou perfeita ' + JSON.stringify(r));
        const placar = await js("document.querySelector('#palco').innerText.replace(/\\s+/g,' ').slice(0,160)");
        feito.push(rot + ' / ' + mat + ': ' + r.acertos + ' de ' + r.base + ' (' + r.vidas + ' coracoes) | tela final: "' + placar + '"');
        if (FOTO) {
          fs.mkdirSync(path.join(__dirname, 'saida'), { recursive: true });
          const shot = await cdp('Page.captureScreenshot', { format: 'png' });
          fs.writeFileSync(path.join(__dirname, 'saida', nomeTela + '-' + mat + '.png'), Buffer.from(shot.data, 'base64'));
        }
        await js("fecharLicao();0"); await dorme(200);
      }
      /* 3) sem rolagem lateral no celular */
      const largura = await js('({sw:document.documentElement.scrollWidth,iw:innerWidth})');
      if (largura.sw > largura.iw + 1) problemas.push(rot + ': rolagem horizontal (' + largura.sw + ' > ' + largura.iw + ')');
      const sw = await js("navigator.serviceWorker?navigator.serviceWorker.getRegistrations().then(r=>r.length):-1");
      feito.push(rot + ': service worker registrado=' + sw + ', largura ' + largura.sw + '/' + largura.iw);
      await dorme(300); coleta(rot);
    }
    ws.close();
    console.log('fumaca.js (Chrome headless via CDP, ' + base + ')');
    feito.forEach((l) => console.log('  ' + l));
    if (avisos.length) { console.log('\nAVISOS (recursos externos, esperado sem internet):'); [...new Set(avisos)].forEach((a) => console.log('  ' + a.slice(0, 160))); }
    if (problemas.length) { console.log('\nFALHOU:'); [...new Set(problemas)].forEach((p) => console.log('  ' + p.slice(0, 300))); process.exitCode = 1; }
    else console.log('\nOK: nenhuma excecao nem console.error; 3 fases jogadas em desktop e celular');
  } finally { limpa(); try { fs.rmSync(perfil, { recursive: true, force: true }); } catch (e) {} }
}
main().then(() => process.exit(process.exitCode || 0)).catch((e) => { console.error('ERRO no teste:', e.message); process.exit(1); });
