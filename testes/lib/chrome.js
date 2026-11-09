'use strict';
/* Chrome headless pelo DevTools (CDP), sem pacote, para os testes de navegador da onda 1 (testes/onda1.js).
   Sempre com --mute-audio; o perfil temporário sai em QUALQUER saída; servidor local serve a raiz (index.html gerado), nunca src/. */
const http = require('http');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawn } = require('child_process');
const RAIZ = path.resolve(__dirname, '..', '..');
const TIPOS = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.webp': 'image/webp',
  '.woff2': 'font/woff2', '.svg': 'image/svg+xml', '.webmanifest': 'application/manifest+json', '.json': 'application/json', '.mp3': 'audio/mpeg', '.ogg': 'audio/ogg', '.m4a': 'audio/mp4' };
const dorme = (ms) => new Promise((r) => setTimeout(r, ms));
function acharChrome() {
  const a = process.argv.find((x) => x.startsWith('--chrome='));
  return (a && a.slice(9)) || process.env.CHROME_BIN || ['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser'].find((p) => fs.existsSync(p));
}
async function abrirChrome() {
  const CHROME = acharChrome();
  if (!CHROME) { console.log('SEM CHROME: teste NAO rodou.'); process.exit(2); }
  const servidor = http.createServer((req, res) => {
    let rel = decodeURIComponent(req.url.split('?')[0]);
    if (rel === '/') rel = '/index.html';
    const arq = path.join(RAIZ, rel);
    if (!arq.startsWith(RAIZ) || rel.startsWith('/src') || rel.startsWith('/.git') || !fs.existsSync(arq) || fs.statSync(arq).isDirectory()) { res.writeHead(404); res.end('nao'); return; }
    res.writeHead(200, { 'content-type': TIPOS[path.extname(arq)] || 'application/octet-stream', 'cache-control': 'no-store' });
    fs.createReadStream(arq).pipe(res);
  });
  await new Promise((r) => servidor.listen(0, '127.0.0.1', r));
  const base = 'http://127.0.0.1:' + servidor.address().port;
  const perfil = fs.mkdtempSync(path.join(os.tmpdir(), 'bobby-onda1-'));
  const porta = 9950 + Math.floor(Math.random() * 40);
  const chrome = spawn(CHROME, ['--headless=new', '--remote-debugging-port=' + porta, '--user-data-dir=' + perfil, '--no-first-run', '--no-default-browser-check',
    '--disable-gpu', '--mute-audio', 'about:blank'], { stdio: 'ignore' });
  let fechado = false;
  const fechar = () => { if (fechado) return; fechado = true; try { chrome.kill('SIGKILL'); } catch (e) {} try { servidor.close(); } catch (e) {} try { fs.rmSync(perfil, { recursive: true, force: true }); } catch (e) {} };
  process.on('exit', fechar);
  let alvos = null;
  for (let i = 0; i < 80 && !alvos; i++) { try { const r = await fetch('http://127.0.0.1:' + porta + '/json/list'); if (r.ok) alvos = await r.json(); } catch (e) {} if (!alvos) await dorme(250); }
  if (!alvos) { fechar(); throw new Error('Chrome nao respondeu'); }
  const ws = new WebSocket(alvos.find((a) => a.type === 'page').webSocketDebuggerUrl);
  await new Promise((ok, no) => { ws.onopen = ok; ws.onerror = no; });
  let id = 0; const pend = new Map(); const eventos = [];
  ws.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id && pend.has(d.id)) { const { ok, no } = pend.get(d.id); pend.delete(d.id); d.error ? no(new Error(d.error.message)) : ok(d.result); } else if (d.method) eventos.push(d); };
  const cdp = (method, params) => new Promise((ok, no) => { const i = ++id; pend.set(i, { ok, no }); ws.send(JSON.stringify({ id: i, method, params: params || {} })); });
  const js = async (expr) => { const r = await cdp('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true });
    if (r.exceptionDetails) throw new Error('JS: ' + ((r.exceptionDetails.exception && r.exceptionDetails.exception.description) || r.exceptionDetails.text)); return r.result.value; };
  await cdp('Runtime.enable'); await cdp('Log.enable'); await cdp('Page.enable');
  const problemas = [];
  const coleta = (rot) => { while (eventos.length) { const e = eventos.shift(), p = e.params;
    if (e.method === 'Runtime.exceptionThrown') problemas.push(rot + ' excecao: ' + ((p.exceptionDetails.exception && p.exceptionDetails.exception.description) || p.exceptionDetails.text));
    if (e.method === 'Runtime.consoleAPICalled' && p.type === 'error') problemas.push(rot + ' console.error: ' + p.args.map((a) => a.value || a.description).join(' '));
    if (e.method === 'Log.entryAdded' && p.entry.level === 'error' && !/favicon/.test(p.entry.url || '')) problemas.push(rot + ' log: ' + p.entry.text + ' ' + (p.entry.url || '')); } };
  /* tela nova com um jogador criado do zero (preparo, nao e o que se testa) */
  async function tela(med, nome) {
    await cdp('Emulation.setDeviceMetricsOverride', med);
    await cdp('Emulation.setTouchEmulationEnabled', { enabled: !!med.mobile, maxTouchPoints: med.mobile ? 5 : 1 });
    await cdp('Page.navigate', { url: base + '/index.html' }); await dorme(1200);
    await js('STORE.atual=-1;localStorage.clear();location.reload();0'); await dorme(1500);
    await js("(()=>{document.querySelector('#modal').classList.remove('on');novoPerfil(" + JSON.stringify(nome || 'Teste') + ",'#12A06E');return 1})()"); await dorme(600); await js('fecharFolha();if(typeof fecharMaterias==="function")fecharMaterias();document.querySelector("#modal").classList.remove("on");0'); await dorme(300);
  }
  async function tocar(x, y, mobile) {
    if (mobile) { await cdp('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y }] }); await cdp('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] }); }
    else { await cdp('Input.dispatchMouseEvent', { type: 'mouseMoved', x, y }); await cdp('Input.dispatchMouseEvent', { type: 'mousePressed', x, y, button: 'left', clickCount: 1 }); await cdp('Input.dispatchMouseEvent', { type: 'mouseReleased', x, y, button: 'left', clickCount: 1 }); }
  }
  async function tecla(key, code, keyCode) {
    await cdp('Input.dispatchKeyEvent', { type: 'keyDown', key, code: code || key, windowsVirtualKeyCode: keyCode || 0, text: key.length === 1 ? key : undefined });
    await cdp('Input.dispatchKeyEvent', { type: 'keyUp', key, code: code || key, windowsVirtualKeyCode: keyCode || 0 });
  }
  async function foto(nome) {
    if (!process.argv.includes('--foto')) return;
    fs.mkdirSync(path.join(RAIZ, 'testes', 'saida'), { recursive: true });
    const f = await cdp('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(RAIZ, 'testes', 'saida', nome + '.png'), Buffer.from(f.data, 'base64'));
  }
  return { cdp, js, tela, tocar, tecla, foto, coleta, problemas, fechar, base, dorme };
}
module.exports = { abrirChrome, dorme, RAIZ };
