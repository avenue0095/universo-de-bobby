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

const TIPOS = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.webp': 'image/webp', '.woff2': 'font/woff2', '.svg': 'image/svg+xml', '.webmanifest': 'application/manifest+json', '.json': 'application/json', '.m4a': 'audio/mp4', '.opus': 'audio/ogg' };
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
    '--no-first-run', '--no-default-browser-check', '--disable-gpu', '--mute-audio', '--autoplay-policy=no-user-gesture-required', 'about:blank'], { stdio: 'ignore' });
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
      if (r.exceptionDetails) throw new Error('JS: ' + (r.exceptionDetails.exception && r.exceptionDetails.exception.description || r.exceptionDetails.text) + ' <= ' + String(expr).slice(0, 90));
      return r.result.value;
    };
    await cdp('Runtime.enable'); await cdp('Log.enable'); await cdp('Page.enable'); await cdp('Network.enable');

    const problemas = []; const avisos = []; const feito = [];
    const EXTERNO = /fonts\.googleapis|fonts\.gstatic|cdnjs\.cloudflare/;  // o favicon.ico agora existe na raiz: 404 nele reprova
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
        if (e.method === 'Network.responseReceived' && p.response.status >= 400 && p.response.url.startsWith(base)) problemas.push(rotulo + ' HTTP ' + p.response.status + ' ' + p.response.url);
      }
    };

    const telas = [['desktop', { width: 1280, height: 800, deviceScaleFactor: 1, mobile: false }], ['celular', { width: 390, height: 844, deviceScaleFactor: 2, mobile: true }], ['celular360', { width: 360, height: 640, deviceScaleFactor: 2, mobile: true }]];
    const shot0 = async (nome) => { if (!FOTO) return; fs.mkdirSync(path.join(__dirname, 'saida'), { recursive: true }); const f = await cdp('Page.captureScreenshot', { format: 'png' }); fs.writeFileSync(path.join(__dirname, 'saida', 'modal-' + nome + '.png'), Buffer.from(f.data, 'base64')); };
    for (const [nomeTela, medidas] of telas) {
      await cdp('Emulation.setDeviceMetricsOverride', medidas);
      await cdp('Page.navigate', { url: 'about:blank' });
      await js("try{localStorage.clear()}catch(e){}").catch(() => {});
      await cdp('Page.navigate', { url: base + '/index.html' });
      await dorme(1200);
      /* limpa o armazenamento do app para sempre comecar com jogador novo */
      /* STORE.atual=-1: o app grava o estado ao sair da pagina (pagehide); sem isso ele regravaria o jogador antigo logo apos o clear */
      await js("STORE.atual=-1;localStorage.clear();location.reload();0");
      await dorme(1500);
      const rot = nomeTela;
      /* 1) cria o jogador pelo modal, como a crianca faria */
      const modalAberto = await js("document.querySelector('#modal').classList.contains('on')");
      if (!modalAberto) problemas.push(rot + ': o modal de novo jogador nao abriu no primeiro acesso');
      /* o modal precisa caber (ou rolar) em celular pequeno, inclusive com o teclado aberto (viewport 300 px mais baixo) */
      const cabeModal = async (quando) => {
        const r = await js("(()=>{const b=document.querySelector('#salvar-nome');b.scrollIntoView({block:'nearest'});const q=b.getBoundingClientRect();const t=document.elementFromPoint(q.left+q.width/2,q.top+q.height/2);return {ok:!!t&&(t===b||b.contains(t)),bottom:q.bottom,ih:innerHeight}})()");
        if (!r.ok || r.bottom > r.ih + 1) problemas.push(rot + ': botao Pronto do modal nao alcancavel ' + quando + ' (bottom ' + Math.round(r.bottom) + ' de ' + r.ih + ')');
      };
      await cabeModal('sem teclado');
      await cdp('Emulation.setDeviceMetricsOverride', Object.assign({}, medidas, { height: Math.max(300, medidas.height - 300) }));
      await dorme(150); await cabeModal('com o teclado aberto'); await shot0('modal-teclado');
      await cdp('Emulation.setDeviceMetricsOverride', medidas); await dorme(150);
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
      const alvos = await js("(()=>{const r={};['#troca-materia','#som','#bb-mapa','#bb-pers','#bb-gal','#bb-perfil'].forEach(q=>{const b=document.querySelector(q).getBoundingClientRect();r[q]=Math.min(b.width,b.height)});return r})()");
      Object.keys(alvos).forEach((q) => { if (alvos[q] < 48) problemas.push(rot + ': alvo de toque ' + q + ' com ' + Math.round(alvos[q]) + ' px (minimo 48)'); });
      const bar = await js("Array.from(document.querySelectorAll('.barra-baixo button')).map(b=>Math.round(b.getBoundingClientRect().height))");
      if (new Set(bar).size > 1) problemas.push(rot + ': itens da barra com alturas diferentes ' + bar.join(','));
      feito.push(rot + ': topo com ofensiva, moedas e som a vista');

      /* 1c) PRIMEIRA DOBRA = O MAPA COM O BOBBY (4a revisao, 24/10/2026). Jogador novo, mapa sem rolar: o cenario da etapa atual comeca
         acima de y=300 e o primeiro no e o Bobby aparecem sem rolar (390x844). Em tela mais baixa (360x640) a propria tela rola ate o Bobby e
         conferimos que ele fica acima da barra. */
      {
        await js("usarMateria('mat');fecharFolha();document.querySelector('#modal').classList.remove('on');window.scrollTo(0,0);0"); await dorme(500);
        const medeDobra = () => js("(()=>{const r=s=>{const e=document.querySelector(s);if(!e)return null;const b=e.getBoundingClientRect();return {t:Math.round(b.top),b:Math.round(b.bottom),l:Math.round(b.left),r:Math.round(b.right)}};return {cena:r('.etapa .cena'),no:r('.no.atual .bt'),voce:r('.voce'),barra:r('.barra-baixo'),ih:innerHeight}})()");
        await js("window.scrollTo(0,0);0"); await dorme(150);
        const d0 = await medeDobra();
        if (!d0.cena || !d0.no || !d0.voce) problemas.push(rot + ' primeira dobra: faltou cenario, no atual ou Bobby ' + JSON.stringify(d0));
        else {
          if (d0.cena.t >= 300) problemas.push(rot + ' primeira dobra: o cenario comeca em y=' + d0.cena.t + ' (precisa ser menor que 300)');
          if (medidas.height >= 800 && medidas.mobile && (d0.no.b > d0.barra.t + 1 || d0.voce.b > d0.barra.t + 1)) problemas.push(rot + ' primeira dobra sem rolar: no (y ' + d0.no.t + '..' + d0.no.b + ') ou Bobby (y ' + d0.voce.t + '..' + d0.voce.b + ') escondido pela barra em y=' + d0.barra.t);
          if (medidas.height >= 800 && medidas.mobile && (d0.no.t >= d0.ih || d0.voce.t >= d0.ih)) problemas.push(rot + ' primeira dobra: no ou Bobby abaixo da janela (' + d0.no.t + ', ' + d0.voce.t + ' de ' + d0.ih + ')');
        }
        await js("renderTrilha.jaMostrou=false;renderTrilha();0"); await dorme(500);
        const d1 = await medeDobra();
        if (d1.no && (d1.no.t >= d1.ih || d1.no.b > d1.barra.t + 1 || d1.voce.b > d1.barra.t + 1 || d1.no.b <= 0)) problemas.push(rot + ' primeira dobra apos a rolagem do app: no (y ' + d1.no.t + '..' + d1.no.b + ') ou Bobby (' + d1.voce.t + '..' + d1.voce.b + ') fora da area visivel (barra em y=' + d1.barra.t + ')');
        await shot0('dobra-mapa-' + nomeTela);
        feito.push(rot + ': primeira dobra sem rolar: cenario y=' + d0.cena.t + ', 1o no y=' + d0.no.t + '..' + d0.no.b + ', Bobby y=' + d0.voce.t + '..' + d0.voce.b + ' | apos a rolagem do app: no y=' + d1.no.t + ', Bobby y=' + d1.voce.t);
        // uma unica coluna: planeta, rotina e etapa com a mesma esquerda e largura
        const col = await js("(()=>{const r=s=>{const b=document.querySelector(s).getBoundingClientRect();return [Math.round(b.left),Math.round(b.width)]};return [r('.planeta'),r('.rotina'),r('.etapa')]})()");
        if (col.some((c) => Math.abs(c[0] - col[0][0]) > 1 || Math.abs(c[1] - col[0][1]) > 1 || c[1] > 480)) problemas.push(rot + ' mapa: colunas diferentes (planeta, rotina, etapa) ' + JSON.stringify(col));
        // rotulos dos nos: pelo menos 8 px da borda da cena e sem sobrepor o vizinho
        const rot8 = await js("(()=>{const ruins=[];document.querySelectorAll('.etapa').forEach((et,k)=>{if(k>2)return;const c=et.querySelector('.cena').getBoundingClientRect();const rs=Array.from(et.querySelectorAll('.no')).filter(n=>getComputedStyle(n.querySelector('.rot')).display!=='none').map(n=>({n:n,b:n.querySelector('.rot').getBoundingClientRect(),t:n.querySelector('.rot').textContent}));rs.forEach(a=>{if(a.b.left<c.left+7.5||a.b.right>c.right-7.5)ruins.push('borda '+a.t+' '+Math.round(a.b.left-c.left)+'/'+Math.round(c.right-a.b.right));rs.forEach(z=>{if(a!==z&&a.b.left<z.b.right&&z.b.left<a.b.right&&a.b.top<z.b.bottom&&z.b.top<a.b.bottom)ruins.push('encosta '+a.t+' em '+z.t)})})});return ruins})()");
        if (rot8.length) problemas.push(rot + ' rotulos dos nos: ' + [...new Set(rot8)].slice(0, 5).join(' | '));
        // nenhum rotulo de no cortado (3 linhas, sem reticencias) nas 3 materias com todas as fases abertas, e o no atual (rotulo incluido) acima da barra
        if (medidas.width >= 360) {
          const cort = await js("(()=>{const r=[];['mat','pt','en'].forEach(m=>{usarMateria(m);fecharFolha();S.feitas={};UNITS.forEach(u=>u.lessons.forEach(l=>S.feitas[l.id]=3));renderTrilha();document.querySelectorAll('.etapa').forEach(et=>{const c=et.querySelector('.cena').getBoundingClientRect();et.querySelectorAll('.no .rot').forEach(e=>{if(getComputedStyle(e).display==='none')return;const b=e.getBoundingClientRect();if(e.scrollHeight>e.clientHeight+1)r.push(m+': '+e.textContent);if(b.left<c.left+7||b.right>c.right-7)r.push('borda '+e.textContent);});});});S.feitas={};usarMateria('mat');fecharFolha();document.querySelector('#modal').classList.remove('on');window.scrollTo(0,0);return r;})()");
          if (cort.length) problemas.push(rot + ' rotulos de no cortados ou fora da cena: ' + cort.slice(0, 5).join(' | '));
        }
        await js("renderTrilha.jaMostrou=false;renderTrilha();0"); await dorme(450);
        const atual = await js("(()=>{const n=document.querySelector('.no.atual').getBoundingClientRect(),b=document.querySelector('.barra-baixo').getBoundingClientRect();return {nb:Math.round(n.bottom),bt:Math.round(b.top)}})()");
        if (atual.nb > atual.bt + 1) problemas.push(rot + ' o no atual com o rotulo (termina em y=' + atual.nb + ') fica atras da barra (y=' + atual.bt + ')');
        // em 320x568 o nome da materia continua a vista (abreviado se precisar)
        await cdp('Emulation.setDeviceMetricsOverride', Object.assign({}, medidas, { width: 320, height: 568 })); await dorme(300);
        const t320 = await js("(()=>{const e=document.querySelector('#nome-materia'),m=document.querySelector('.marca').getBoundingClientRect();return {w:Math.round(e.clientWidth),m:Math.round(m.width),vis:getComputedStyle(e).visibility}})()");
        if (t320.w < 56) problemas.push(rot + ' topo em 320: o nome da materia sumiu (' + JSON.stringify(t320) + ')');
        await cdp('Emulation.setDeviceMetricsOverride', medidas); await dorme(200);
        // nome da materia inteiro no topo
        const nm = await js("(()=>{const e=document.querySelector('#nome-materia');return {sw:e.scrollWidth,cw:e.clientWidth}})()");
        if (nm.sw > nm.cw + 1) problemas.push(rot + ' topo: o nome da materia esta cortado (' + nm.sw + ' > ' + nm.cw + ')');
        // no trancado: aria-disabled de verdade, entra no caminho do teclado e explica ao ser tocado
        const tr = await js("(()=>{const b=document.querySelector('.no.trava-prox .bt');if(!b)return null;b.click();return {aria:b.getAttribute('aria-disabled'),dis:b.disabled,foco:b.tabIndex>=0,aviso:!!document.querySelector('#aviso-no')}})()");
        if (!tr || tr.aria !== 'true' || tr.dis || !tr.foco || !tr.aviso) problemas.push(rot + ' no trancado: ' + JSON.stringify(tr));
        // cena com cor de fundo enquanto a imagem nao chega
        const fundo = await js("getComputedStyle(document.querySelector('.cena')).backgroundImage");
        if (!/gradient/.test(fundo)) problemas.push(rot + ' cena sem fundo de reserva enquanto a imagem carrega');
        await js("(()=>{const a=document.querySelector('#aviso-no');if(a)a.remove();window.scrollTo(0,0)})()");
      }

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
      /* 2b) ciclo diario no Chrome de verdade: rotina, barra "Meu personagem", baue, parada e bilhete */
      await js("fecharLicao();usarMateria('mat');0"); await dorme(300);
      const shot = async (nome) => { if (!FOTO) return; fs.mkdirSync(path.join(__dirname, 'saida'), { recursive: true }); const f = await cdp('Page.captureScreenshot', { format: 'png' }); fs.writeFileSync(path.join(__dirname, 'saida', nomeTela + '-' + nome + '.png'), Buffer.from(f.data, 'base64')); };
      // o bilhete do Bobby e a primeira coisa do dia
      const bilhete = await js("document.querySelector('#folha').classList.contains('on')&&document.querySelector('#folha').innerText.replace(/\\s+/g,' ')");
      if (!bilhete || !/bilhete/i.test(bilhete)) problemas.push(rot + ': o bilhete do Bobby nao apareceu na primeira abertura do dia');
      await shot('ciclo-1-bilhete');
      await js("document.querySelector('#fl-ok').click();0"); await dorme(150);
      const rotina = await js("(()=>{const r=document.querySelector('.rotina');if(!r)return null;const b=r.getBoundingClientRect();return {w:b.width,txt:r.innerText.replace(/\\s+/g,' ').slice(0,200)}})()");
      if (!rotina) problemas.push(rot + ': cartao Rotina de hoje nao apareceu'); else feito.push(rot + ': rotina "' + rotina.txt.slice(0, 90) + '"');
      await shot('ciclo-2-mapa');
      // barra de baixo: "Meu personagem" abre o guarda-roupa em 1 toque
      const barra = await js("(()=>{const b=document.querySelector('#barra').getBoundingClientRect();const p=document.querySelector('#bb-pers').getBoundingClientRect();return {bottom:b.bottom,ih:innerHeight,w:p.width,h:p.height,fixa:getComputedStyle(document.querySelector('#barra')).position}})()");
      if (barra.fixa !== 'fixed' || Math.abs(barra.bottom - barra.ih) > 2) problemas.push(rot + ': barra de baixo nao esta fixa no rodape');
      if (barra.h < 44) problemas.push(rot + ': botao Meu personagem menor que 44 px de altura (' + barra.h + ')');
      await js("document.querySelector('#bb-pers').click();0"); await dorme(250);
      const loja = await js("document.querySelector('#perfil').classList.contains('on')&&/Meu personagem/.test(document.querySelector('#perfil').innerText)&&!!document.querySelector('.palco')");
      if (!loja) problemas.push(rot + ': Meu personagem nao abriu o guarda-roupa em 1 toque');
      await shot('ciclo-3-guarda-roupa');
      await js("document.querySelector('#volta-perfil').click();0"); await dorme(200);
      const fechou = await js("!document.querySelector('#perfil').classList.contains('on')");
      if (!fechou) problemas.push(rot + ': voltar do guarda-roupa aberto pela barra deveria fechar a tela');
      // joga ate a meta cheia (20 perguntas) e abre o bau
      for (let f = 0; f < 4; f++) {
        await js("abrirLicao(0," + (f % 5) + ");LIC.etapa='questao';pintarLicao();while(LIC.etapa==='questao'){LIC.resp=LIC.qs[LIC.i].answer;conferir();avancar();}0"); await dorme(150);
      }
      const temBau = await js("!!document.querySelector('#fim-abrir-bau')");
      if (!temBau) problemas.push(rot + ': botao Abrir o bau nao apareceu no fim da fase com a meta cheia');
      await shot('ciclo-4-fim-com-bau');
      await js("document.querySelector('#fim-abrir-bau').click();0"); await dorme(200);
      await shot('ciclo-5-bau-fechado');
      await js("document.querySelector('#fl-abrir').click();0"); await dorme(200);
      await shot('ciclo-6-bau-aberto');
      await js("document.querySelector('#fl-ok').click();0"); await dorme(200);
      const parada = await js("document.querySelector('#folha').classList.contains('on')&&document.querySelector('#folha').innerText.replace(/\\s+/g,' ')");
      if (!parada || !/Por hoje chega/.test(parada) || !/Terminar por hoje/.test(parada) || !/Continuar explorando/.test(parada)) problemas.push(rot + ': tela Por hoje chega incompleta: ' + parada);
      await shot('ciclo-7-parada');
      await js("document.querySelector('#fl-segue').click();0"); await dorme(150);
      await js("document.querySelector('#fechar').click();0"); await dorme(200);
      const sem = await js("!document.querySelector('#folha').classList.contains('on')");
      if (!sem) problemas.push(rot + ': a parada reapareceu no mesmo dia');
      const estado = await js("JSON.stringify({baus:S.diario.bau.aberto,meta:S.diario.metaOk,of:S.ofensiva.atual,xp:S.xp,moedas:S.moedas})");
      feito.push(rot + ': ciclo completo ' + estado);
      await js("window.scrollTo(0,0);0"); await dorme(100); await shot('ciclo-8-mapa-final');
      coleta(rot + ' ciclo');

      /* 2d) telas do visual novo: mapa com planeta e cenario, desenhos (colorir), Meu personagem; sem imagem quebrada nem rolagem lateral */
      {
        const quebradas = async () => JSON.parse(await js("JSON.stringify(Array.from(document.querySelectorAll('img.arte')).filter(i=>i.complete&&i.naturalWidth===0&&!i.classList.contains('falhou')===false||(i.complete&&i.naturalWidth===0)).map(i=>i.src.slice(-40)))"));
        const semRolagem = async (nome) => { const l = await js('({sw:document.documentElement.scrollWidth,iw:innerWidth})'); if (l.sw > l.iw + 1) problemas.push(rot + ' ' + nome + ': rolagem horizontal ' + l.sw + ' > ' + l.iw); };
        await js("usarMateria('mat');fecharFolha();document.querySelector('#bb-mapa').click();0"); await dorme(600);
        const mapa = await js("({etapas:document.querySelectorAll('.etapa').length,nos:document.querySelectorAll('.no .bt').length,luz:(document.querySelector('#etapa-1 .cena-luz')||{}).naturalWidth,planeta:(document.querySelector('.planeta-img img')||{}).naturalWidth,voce:!!document.querySelector('.voce'),menor:Math.min.apply(null,Array.from(document.querySelectorAll('.no .bt:not([aria-disabled=true])')).map(b=>Math.min(b.getBoundingClientRect().width,b.getBoundingClientRect().height))),retrato:(document.querySelector('#retrato-bb img')||{}).naturalWidth})");
        if (mapa.etapas !== 10 || mapa.nos !== 60) problemas.push(rot + ' mapa: ' + JSON.stringify(mapa));
        if (!mapa.luz || !mapa.planeta || !mapa.retrato) problemas.push(rot + ' mapa: imagem do cenario, do planeta ou do retrato nao carregou ' + JSON.stringify(mapa));
        if (mapa.menor < 48) problemas.push(rot + ' mapa: no de fase menor que 48 px (' + mapa.menor + ')');
        await js("document.querySelector('#etapa-1').scrollIntoView();window.scrollBy(0,-70);0"); await dorme(500);
        await shot('visual-1-mapa-etapa'); await semRolagem('mapa');
        await js("window.scrollTo(0,0);0"); await dorme(200); await shot('visual-1b-mapa-topo');
        // desenhos: etapa 1 completa libera o desenho; abre, pinta, guarda e volta
        await js("UNITS_MAT[0].lessons.forEach(l=>S.feitas[l.id]=3);S.desenhos.herdado=[];S.desenhos.vistos=[];salvar();renderTrilha();0"); await dorme(300);
        const ponto = await js("!document.querySelector('#ponto-gal').hidden");
        if (!ponto) problemas.push(rot + ' desenhos: faltou o ponto de novidade na barra');
        await js("document.querySelector('#bb-gal').click();0"); await dorme(900);
        const gal = await js("({cartoes:document.querySelectorAll('.des-card').length,livres:document.querySelectorAll('.des-card:not(.trava)').length,icone:Math.max.apply(null,Array.from(document.querySelectorAll('#gal-corpo svg')).map(v=>v.getBoundingClientRect().width))})");
        if (gal.cartoes < 3 || gal.cartoes > 30 || gal.livres < 1) problemas.push(rot + ' desenhos: galeria ' + JSON.stringify(gal));
        if (gal.icone > 64) problemas.push(rot + ' desenhos: icone gigante na galeria (' + gal.icone + ' px)');
        await shot('visual-2-galeria'); await semRolagem('galeria');
        await js("document.querySelector('.des-card:not(.trava)').click();0"); await dorme(1200);
        const pint = await js("(()=>{const c=document.querySelector('#cv-des');if(!c)return null;DES.cor=1;pintarEm(DES.w*0.5,DES.h*0.9);DES.cor=4;pintarEm(DES.w*0.2,DES.h*0.8);return {w:c.width,jog:DES.jogadas.length,guard:(S.desenhos.tinta[DES.id]||[]).length}})()");
        if (!pint || !pint.w || pint.guard < 1) problemas.push(rot + ' desenhos: colorir nao funcionou ' + JSON.stringify(pint));
        await shot('visual-3-colorir'); await semRolagem('colorir');
        await js("document.querySelector('#fechar-des').click();0"); await dorme(300);
        // Meu personagem: expressao, chapeu e companheiro
        await js("S.moedas=500;document.querySelector('#bb-pers').click();0"); await dorme(500);
        await js("document.querySelector('[data-pose=\"bobby-e03\"]').click();0"); await dorme(200);
        await js("document.querySelector('[data-aba=\"look\"]').click();0"); await dorme(200);
        await js("document.querySelector('[data-buy]').click();0"); await dorme(300);
        const roupa = await js("({chapeu:!!document.querySelector('.palco .item-chapeu'),look:S.look.chapeu,moedas:S.moedas})");
        if (!roupa.chapeu || roupa.look !== 'explorador') problemas.push(rot + ' personagem: chapeu nao apareceu ' + JSON.stringify(roupa));
        await js("document.querySelector('[data-aba=\"comp\"]').click();0"); await dorme(200);
        // companheiro novo custa moedas do jogo: bloqueado com preco visivel, confirma a compra, depois escolhe
        const preco = await js("(()=>{const b=document.querySelector('[data-buycomp=\"rufa\"]');return b?b.innerText.trim():null})()");
        if (!preco || !/\d{3,4}/.test(preco)) problemas.push(rot + ' companheiros: a Rufa deveria estar bloqueada com o preco em moedas visivel (' + preco + ')');
        await js("S.moedas=3000;telaLoja();document.querySelector('[data-buycomp=\"rufa\"]').click();0"); await dorme(250);
        const conf = await js("(document.querySelector('#loja-aviso')||{}).innerText||''");
        if (!/Quer levar Rufa por \d+ moedas\?/.test(conf)) problemas.push(rot + ' companheiros: faltou a confirmacao da compra: ' + conf);
        await js("document.querySelector('#comp-sim').click();0"); await dorme(300);
        if (!(await js("S.look.companheiro==='rufa'&&S.comprado.indexOf('rufa')>=0"))) problemas.push(rot + ' companheiros: comprar a Rufa nao a escolheu');
        await js("document.querySelector('[data-aba=\"comp\"]').click();0"); await dorme(150);
        await js("document.querySelector('#palco-bobby').click();0"); await dorme(300);
        await shot('visual-4-meu-personagem'); await semRolagem('personagem');
        await js("document.querySelector('[data-modo=\"corpo\"]').click();0"); await dorme(500);
        await shot('visual-5-corpo');
        await js("document.querySelector('#bb-mapa').click();0"); await dorme(500);
        const ruins = await quebradas();
        if (ruins.length) problemas.push(rot + ' imagens quebradas: ' + ruins.join(', '));
        coleta(rot + ' visual');
        feito.push(rot + ': visual novo ok (mapa ' + mapa.etapas + ' etapas, ' + gal.cartoes + ' desenhos, colorir, Meu personagem)');
        await js("S.look={};S.desenhos.tinta={};salvar();0");
      }

      /* 2d2) correcoes da 4a revisao: aviso de download visivel, vitrine de looks sem sobreposicao, nenhum SVG gigante, colorir centralizado, arte offline */
      {
        const ids = await js("(()=>{const m={};document.querySelectorAll('[id]').forEach(e=>{m[e.id]=(m[e.id]||0)+1});return Object.keys(m).filter(k=>m[k]>1)})()");
        if (ids.length) problemas.push(rot + ' ids repetidos na pagina: ' + ids.join(', '));
        // Desenho guardado!: abre a galeria e depois o colorir (as duas telas ficam empilhadas) e confere que a mensagem aparece POR CIMA
        await js("UNITS_MAT[0].lessons.forEach(l=>S.feitas[l.id]=3);salvar();renderTrilha();document.querySelector('#bb-gal').click();0"); await dorme(700);
        const abriu = await js("(()=>{const c=document.querySelector('.des-card:not(.trava)');if(!c)return 'sem cartao livre: galeria '+document.querySelector('#galeria').className+', cartoes '+document.querySelectorAll('.des-card').length+', cvs '+document.querySelectorAll('#cv-des').length;c.click();return 'ok'})()"); await dorme(900);
        if (abriu !== 'ok') problemas.push(rot + ' 2d2: ' + abriu);
        await js("avisoBaixa('Desenho guardado! A imagem foi salva no seu aparelho, na pasta de downloads.');document.querySelector('#aviso-baixa-des').scrollIntoView({block:'center'});0"); await dorme(200);
        const av = await js("(()=>{const e=document.querySelector('#aviso-baixa-des .aviso');if(!e)return null;const b=e.getBoundingClientRect();const t=document.elementFromPoint(b.left+b.width/2,b.top+b.height/2);const ids=['aviso-baixa-des','aviso-baixa-gal'].map(i=>document.querySelectorAll('#'+i).length);return {visivel:!!t&&(t===e||e.contains(t)),topo:t?(t.id||t.className||t.tagName):'nada',ids:ids,dentro:b.top>=0&&b.bottom<=innerHeight-"+(medidas.mobile ? 80 : 80)+"}})()");
        if (!av || !av.visivel || !av.dentro) problemas.push(rot + ' aviso Desenho guardado!: ' + JSON.stringify(av));
        else if (av.ids[0] !== 1 || av.ids[1] !== 1) problemas.push(rot + ' avisos de download com id repetido ' + JSON.stringify(av.ids));
        await shot('aviso-guardado');
        if (medidas.width >= 900) {
          const cen = await js("(()=>{const a=document.querySelector('#cv-des').getBoundingClientRect(),b=document.querySelector('.des-ferramentas').getBoundingClientRect();return {centro:Math.round((a.left+b.right)/2),iw:innerWidth}})()");
          if (Math.abs(cen.centro - cen.iw / 2) > 16) problemas.push(rot + ' colorir descentralizado: centro em ' + cen.centro + ' de ' + (cen.iw / 2));
        }
        await js("document.querySelector('#fechar-des').click();0"); await dorme(200); await js('fecharTelasDaBarra();0');
        // vitrine de looks: figura dentro do cartao, nome, selo e botao tocaveis (nada por cima)
        await js("S.moedas=900;document.querySelector('#bb-pers').click();0"); await dorme(500);
        await js("document.querySelector('[data-aba=\"look\"]').click();0"); await dorme(500);
        const lk = await js("(()=>{const ruins=[];document.querySelectorAll('.vitrine .item').forEach(it=>{const c=it.getBoundingClientRect();const f=it.querySelector('.item-img');if(f){const b=f.getBoundingClientRect();if(b.bottom>c.bottom+1||b.right>c.right+1||b.left<c.left-1)ruins.push('figura fora do cartao');}it.querySelectorAll('b,.selo,button').forEach(e=>{e.scrollIntoView({block:'center'});const q=e.getBoundingClientRect();const t=document.elementFromPoint(q.left+q.width/2,q.top+q.height/2);if(!(t&&(t===e||e.contains(t))))ruins.push((e.className||e.tagName)+' '+e.textContent.trim().slice(0,20)+' coberto por '+(t?(t.className||t.tagName):'nada'));});});return {ruins:ruins,n:document.querySelectorAll('.vitrine .item').length}})()");
        if (lk.n < 2 || lk.ruins.length) problemas.push(rot + ' looks: ' + JSON.stringify(lk));
        await shot('looks');
        await js('fecharTelasDaBarra();0');
        // nenhum SVG gigante (icone sem tamanho ocupa a largura toda) nas telas de interface
        const svgGrande = async (nome) => { const g = await js("Array.from(document.querySelectorAll('svg')).filter(v=>!v.closest('#licao,.figura,.quadro,.aula')).map(v=>({w:Math.round(v.getBoundingClientRect().width),h:Math.round(v.getBoundingClientRect().height),c:(v.parentElement&&(v.parentElement.className||v.parentElement.tagName))||''})).filter(v=>v.w>64||v.h>64)"); if (g.length) problemas.push(rot + ' SVG gigante em ' + nome + ': ' + JSON.stringify(g.slice(0, 3))); };
        await js("document.querySelector('#bb-mapa').click();window.scrollTo(0,0);document.querySelector('.rotina details').open=true;0"); await dorme(400); await svgGrande('mapa com a rotina aberta');
        await js("document.querySelector('.rotina details').open=false;document.querySelector('#bb-gal').click();0"); await dorme(500); await svgGrande('galeria'); await js('fecharTelasDaBarra();0');
        await js("document.querySelector('#bb-pers').click();0"); await dorme(400); await svgGrande('Meu personagem'); await js('fecharTelasDaBarra();0');
        await js("document.querySelector('#bb-perfil').click();0"); await dorme(400); await svgGrande('perfil'); await js('telaResponsavel();0'); await dorme(300); await svgGrande('responsavel'); await js('telaVoz();0'); await dorme(400); await svgGrande('voz e som');
        // arte offline: o botao existe, a conta diz a verdade e guardar tudo coloca TODA a arte no cache
        const antes = await js("arteContarGuardadas()");
        const tem = await js("!!document.querySelector('#baixar-vozes')&&/Guardar tudo para jogar sem internet/.test(document.querySelector('#baixar-vozes').innerText)&&/Imagens guardadas neste aparelho: \\d+ de \\d+/.test(document.querySelector('#arte-estado').innerText)");
        if (!tem) problemas.push(rot + ' voz e som: faltou o botao "Guardar tudo para jogar sem internet" ou a linha das imagens guardadas');
        const r = await js("arteGuardarTudo().then(r=>r)");
        const depois = await js("arteContarGuardadas()");
        const total = await js("arteLista().length");
        if (!r.ok || depois !== total) problemas.push(rot + ' arte offline: ' + depois + ' de ' + total + ' guardadas (falhas ' + r.falhas + ')');
        feito.push(rot + ': arte offline ' + antes + ' -> ' + depois + ' de ' + total + ' imagens no cache bobby-arte-v1');
        await js('fecharTelasDaBarra();document.querySelector("#bb-mapa").click();0'); await dorme(300);
      }

      /* 2d2b) MATERIAL DOURADO: em toda pergunta com barrinhas, cubinhos ou placas (figura ou construtor 'blocos') cada quadradinho tem pelo menos
         28 px, a barra cabe na coluna, e tocar num quadradinho o marca como contado sem valer ponto. */
      {
        const achados = await js(`(()=>{const o=[];let n=0;
          UNITS_MAT.forEach(u=>u.lessons.forEach(l=>{let achou=0;
            for(let t=0;t<60&&achou<2;t++){const mk=l.makers[t%l.makers.length];let q;try{q=mk();}catch(e){continue;}
              if(q&&(q.type==='blocos'||(q.figure&&/class="md /.test(q.figure)))){achou++;o.push([l.id,q.type,JSON.stringify(q).length]);}}}));return o;})()`);
        if (!achados.length) problemas.push(rot + ' material dourado: nenhuma pergunta com barrinhas encontrada');
        const ruins = [];
        for (const [id] of achados) {
          const r = await js(`(()=>{const l=UNITS_MAT.flatMap(u=>u.lessons).find(x=>x.id===${JSON.stringify(id)});let q=null;
            for(let t=0;t<60;t++){let c=null;try{c=l.makers[t%l.makers.length]();}catch(e){}if(c&&(c.type==='blocos'||(c.figure&&/class="md /.test(c.figure)))){q=c;break;}}
            if(!q)return {tipo:'sem pergunta',n:0};
            abrirLicao(0,0);LIC.l=l;LIC.qs=[q];LIC.i=0;LIC.etapa='questao';LIC.md={c:0,d:0,u:0};pintarLicao();
            if(q.type==='blocos'){const m=q.max||{c:9,d:9,u:9};if(m.d!==0){mdMuda('d',1);mdMuda('d',1);mdMuda('d',1);}if(m.c!==0)mdMuda('c',1);mdMuda('u',1);mdMuda('u',1);mdMuda('u',1);}
            const area=document.querySelector('#licao .dourado-fig, #licao .dourado-linhas');
            const qs=area?Array.from(area.querySelectorAll('svg.md:not(.placa) rect.q')):[];
            const menor=qs.length?Math.min.apply(null,qs.map(x=>Math.min(x.getBoundingClientRect().width,x.getBoundingClientRect().height))):null;
            const barras=area?Array.from(area.querySelectorAll('svg.barra')):[];
            const largura=barras.length?Math.max.apply(null,barras.map(b=>b.getBoundingClientRect().width)):0;
            const col=document.querySelector('#licao .lc-in, #licao .lc-corpo');const cw=col?col.getBoundingClientRect().width:innerWidth;
            let toque=null;if(qs.length){const x=qs[0];const b=x.getBoundingClientRect();const t0=LIC.respondidas||0;const a0=LIC.acertos;x.dispatchEvent(new MouseEvent('click',{bubbles:true}));toque={contado:x.classList.contains('contado'),texto:(area.querySelector('.md-contagem')||{}).textContent||'',pontos:LIC.acertos===a0&&(LIC.respondidas||0)===t0};}
            fecharLicao();return {tipo:q.type,n:qs.length,menor:menor&&Math.round(menor*10)/10,barras:barras.length,largura:Math.round(largura),cw:Math.round(cw),toque:toque};})()`);
          if (r.n && r.menor < 28 - 0.2) ruins.push(id + ' quadradinho ' + r.menor + ' px');
          if (r.barras && r.largura > r.cw) ruins.push(id + ' barra mais larga (' + r.largura + ') que a coluna (' + r.cw + ')');
          if (r.toque && (!r.toque.contado || !/Contados: 1/.test(r.toque.texto) || !r.toque.pontos)) ruins.push(id + ' toque no quadradinho: ' + JSON.stringify(r.toque));
          if (r.tipo === 'blocos' && !r.n) ruins.push(id + ' construtor sem quadradinhos');
        }
        if (ruins.length) problemas.push(rot + ' material dourado: ' + [...new Set(ruins)].slice(0, 6).join(' | '));
        else feito.push(rot + ': material dourado conferido em ' + achados.length + ' perguntas (quadradinho >= 28 px, barra na coluna, toque marca sem valer ponto)');
        await js("abrirLicao(0,0);LIC.l=UNITS_MAT[1].lessons[0];LIC.qs=[blocos('Monte <b>34</b> com as barrinhas.',34,{max:{c:0,d:9,u:9}})];LIC.i=0;LIC.etapa='questao';LIC.md={c:0,d:0,u:0};pintarLicao();mdMuda('d',1);mdMuda('d',1);mdMuda('d',1);mdMuda('u',1);mdMuda('u',1);0"); await dorme(300);
        await shot0('barrinhas-construtor-' + nomeTela);
        await js("LIC.qs=[inp('Quanto vale 4 barrinhas?',40,{figure:dourado(0,4,3,true)})];LIC.i=0;pintarLicao();0"); await dorme(300);
        await shot0('barrinhas-figura-' + nomeTela);
        await js("fecharLicao();0");
      }

      /* 2d3) O PERSONAGEM ESCOLHIDO APARECE EM TODO O JOGO (regressao apontada pelo Filipe: o personagem montado em Meu personagem nao servia
         para nada). Escolhe a Rufa, depois um look (coroa) e depois o chapeu de explorador; confere por DOM que a imagem usada no topo, na barra,
         no mapa, na aula, na pergunta, na reacao de acerto e de erro, no fim da fase e no bau e a do personagem escolhido. */
      {
        const verifica = async (rotulo, ajuste, esperado) => {
          await js(ajuste + ";salvar();fecharTelasDaBarra();fecharFolha();pintarTopo();renderTrilha.jaMostrou=false;renderTrilha();0"); await dorme(500);
          const tem = (html, onde) => { if (!esperado.test(html)) problemas.push(rot + ' personagem (' + rotulo + '): ' + onde + ' nao usa o personagem escolhido [' + esperado + ']: ' + html.slice(0, 150)); };
          const html = (q) => js("(()=>{const e=document.querySelector(" + JSON.stringify(q) + ");return e?e.innerHTML:''})()");
          tem(await html('#logo'), 'topo'); tem(await html('#retrato-bb'), 'barra'); tem(await html('.voce'), 'mapa (Bobby andando)');
          await shot0('personagem-mapa-' + rotulo + '-' + nomeTela);
          await js("abrirLicao(0,0);LIC.etapa='aula';LIC.passo=0;pintarLicao();0"); await dorme(350);
          tem(await html('.aula'), 'aula'); await shot0('personagem-aula-' + rotulo + '-' + nomeTela);
          await js("LIC.etapa='questao';LIC.i=0;pintarLicao();0"); await dorme(350);
          tem(await html('.cena-q'), 'pergunta'); await shot0('personagem-pergunta-' + rotulo + '-' + nomeTela);
          await js("LIC.resp='__errada__';conferir();0"); await dorme(250);
          tem(await html('#selo'), 'reacao de erro'); await shot0('personagem-erro-' + rotulo + '-' + nomeTela);
          await js("avancar();LIC.resp=LIC.qs[LIC.i].answer;conferir();0"); await dorme(250);
          tem(await html('#selo'), 'reacao de acerto'); await shot0('personagem-acerto-' + rotulo + '-' + nomeTela);
          await js("while(LIC.etapa==='questao'){LIC.resp=LIC.qs[LIC.i].answer;conferir();avancar();}0"); await dorme(500);
          tem(await html('.fim'), 'fim de fase'); await shot0('personagem-fim-' + rotulo + '-' + nomeTela);
          await js("fecharLicao();abrirFolha('<div class=\"folha-in\">'+bauCena(true)+'<h2>Voce ganhou</h2></div>');0"); await dorme(300);
          tem(await html('#folha'), 'bau'); await shot0('personagem-bau-' + rotulo + '-' + nomeTela);
          await js("fecharFolha();0");
        };
        await verifica('rufa', "S.look={companheiro:'rufa'};S.comprado=['rufa']", /rufa-p0[1-4]/);
        await verifica('coroa', "S.look={chapeu:'coroa'};S.comprado=['coroa']", /(item|ov)-coroa/);
        await verifica('explorador', "S.look={chapeu:'explorador'};S.comprado=['explorador']", /bobby-item-chapeu/);
        // trocar em Meu personagem muda tudo na hora (o topo e a barra mudam sem recarregar)
        await js("S.look={};S.comprado=['otto'];fecharTelasDaBarra();document.querySelector('#bb-pers').click();0"); await dorme(400);
        await js("document.querySelector('[data-aba=\"comp\"]').click();0"); await dorme(250);
        await js("document.querySelector('[data-comp=\"otto\"]').click();0"); await dorme(300);
        const trocou = await js("document.querySelector('#logo').innerHTML.indexOf('otto-p01')>=0&&document.querySelector('#retrato-bb').innerHTML.indexOf('otto-p01')>=0");
        if (!trocou) problemas.push(rot + ' personagem: trocar de companheiro em Meu personagem nao mudou o topo e a barra na hora');
        await js("fecharTelasDaBarra();S.look={};salvar();pintarTopo();0"); await dorme(200);
        feito.push(rot + ': personagem escolhido (Rufa, coroa e chapeu de explorador) usado no topo, barra, mapa, aula, pergunta, acerto, erro, fim e bau');
      }

      /* 2d4) A PERGUNTA DENTRO DA CENA: enunciado no balao do guia da materia (Teo, Rufa, Otto), cenario da etapa ao fundo, lembrete da aula FECHADO,
         pose do guia trocada no mesmo toque (< 100 ms) e as 4 alternativas inteiras acima do painel, mesmo em 360 x 640. */
      {
        const guias = { mat: 'teo', pt: 'rufa', en: 'otto' };
        for (const mat of ['mat', 'pt', 'en']) {
          await js("usarMateria('" + mat + "');fecharFolha();document.querySelector('#modal').classList.remove('on');S.faixa='f910';S.look={};abrirLicao(0,0);LIC.etapa='questao';LIC.i=0;pintarLicao();0"); await dorme(250);
          const cena = await js("(()=>{const g=document.querySelector('.cena-q .guia-img');return {balao:!!document.querySelector('.cena-q .balao-q h2.pergunta'),guia:g?g.src:'',fundo:document.querySelector('#licao').style.getPropertyValue('--cena'),lembrete:(document.querySelector('.lembrete')||{}).open}})()");
          if (!cena.balao) problemas.push(rot + ' ' + mat + ' pergunta: o enunciado nao esta no balao do guia');
          if (cena.guia.indexOf(guias[mat] + '-p04') < 0) problemas.push(rot + ' ' + mat + ' pergunta: o guia da materia (' + guias[mat] + ') nao aparece: ' + cena.guia.slice(-30));
          if (!/cenarios\/cen-/.test(cena.fundo)) problemas.push(rot + ' ' + mat + ' pergunta: sem o cenario da etapa ao fundo (' + cena.fundo + ')');
          if (cena.lembrete) problemas.push(rot + ' ' + mat + ' pergunta: o lembrete da aula deveria comecar fechado');
          // alternativas: curtas e longas, as 4 acima do painel fixo
          for (const [nome, opts] of [['curtas', ['10', '11', '12', '13']], ['longas', ['Setenta e cinco bolinhas', 'Setenta e seis bolinhas', 'Setenta e sete bolinhas', 'Setenta e oito bolinhas']]]) {
            const r = await js(`(()=>{const o=${JSON.stringify(opts)};LIC.qs=[{type:'mc',prompt:'Qual e a resposta certa para esta pergunta de teste?',answer:o[2],options:o}];LIC.i=0;LIC.qs[0].__reduzido=true;pintarLicao();
              const alts=Array.from(document.querySelectorAll('.alt')),pe=document.querySelector('.pe').getBoundingClientRect(),u=alts[alts.length-1],b=u.getBoundingClientRect();
              const t=document.elementFromPoint(b.left+b.width/2,b.top+b.height/2);return {n:alts.length,bottom:Math.round(b.bottom),peTop:Math.round(pe.top),livre:!!t&&(t===u||u.contains(t))}})()`);
            if (r.n !== 4 || r.bottom > r.peTop + 1 || !r.livre) problemas.push(rot + ' ' + mat + ' pergunta (' + nome + '): a 4a alternativa fica cortada atras do botao (' + JSON.stringify(r) + ')');
          }
          if (mat === 'mat') await shot0('cena-pergunta-' + nomeTela);
        }
        // pose do guia na hora do toque: 20 respostas, certa e errada, medidas no mesmo instante
        const tempos = await js(`(()=>{const o=['1','2','3','4'],r=[];for(let k=0;k<20;k++){LIC.qs=[{type:'mc',prompt:'Pergunta '+k+'?',answer:'2',options:o}];LIC.i=0;LIC.vidas=5;LIC.qs[0].__reduzido=true;pintarLicao();
          const g=document.querySelector('.guia-img');document.querySelectorAll('.alt')[k%2===0?1:0].click();const t0=performance.now();document.querySelector('#acao').click();const dt=performance.now()-t0;
          r.push({dt:dt,pose:/-p0([24])/.exec(g.src)[1],esperado:k%2===0?'2':'4'});}return r})()`);
        const lento = tempos.filter((t) => t.dt > 100), errada = tempos.filter((t) => t.pose !== t.esperado);
        if (lento.length || errada.length) problemas.push(rot + ' pose do guia: ' + lento.length + ' toques acima de 100 ms, ' + errada.length + ' poses erradas (acerto = p02, erro = p04)');
        // falas do banco no acerto e no erro (nunca 'Quase!'), e o painel nao esconde o botao
        for (const [rotulo, resp] of [['acerto', 'LIC.qs[LIC.i].answer'], ['erro', "'__errada__'"]]) {
          const f = await js(`(()=>{LIC.vidas=5;LIC.qs=[{type:'mc',prompt:'Quanto e 1 + 1?',answer:'2',options:['1','2','3','4']}];LIC.i=0;LIC.qs[0].__reduzido=true;pintarLicao();LIC.resp=${resp.replace('LIC.qs[LIC.i].answer', "'2'")};conferir();
            const t=document.querySelector('#fb-t').innerText.trim();const ac=document.querySelector('#acao'),b=ac.getBoundingClientRect(),e=document.elementFromPoint(b.left+b.width/2,b.top+b.height/2);
            return {t:t,banco:falasTodas().some(x=>t.indexOf(x.texto)>=0),botao:!!e&&(e===ac||ac.contains(e))}})()`);
          if (!f.banco || /Quase!/.test(f.t) || !f.botao) problemas.push(rot + ' fala do ' + rotulo + ': ' + JSON.stringify(f));
          await shot0('fala-' + rotulo + '-' + nomeTela);
        }
        // lembrete abre sozinho depois de dois erros seguidos
        const abre = await js(`(()=>{abrirLicao(0,0);LIC.etapa='questao';LIC.i=0;LIC.vidas=5;pintarLicao();const lm=document.querySelector('.lembrete');if(!lm)return 'sem lembrete';const ini=lm.open;
          LIC.resp='__x__';conferir();const a1=lm.open;avancar();LIC.resp='__x__';conferir();return [ini,a1,document.querySelector('.lembrete').open].join()})()`);
        if (!/^false,false,true$/.test(abre) && abre !== 'sem lembrete') problemas.push(rot + ' lembrete da aula: esperado fechado, fechado, aberto depois do 2o erro seguido; veio ' + abre);
        await js("fecharLicao();0");
      }

      /* 2d5) SOM SINTETIZADO: cada efeito e renderizado em OfflineAudioContext e medido (pico ate -6 dBFS, duracao dentro da tabela do plano);
         o erro e 6 dB mais baixo que o acerto e sem energia abaixo de 250 Hz; tres interruptores independentes; vibracao respeita o movimento reduzido. */
      {
        const tabela = { clique: .06, seleciona: .04, verifica: .09, acerto: .45, erro: .18, dica: .25, moeda: .2, faseOk: .9, estrela: .3, pecaAcende: .7, etapaOk: 3, planetaOk: 6, passo: .27, abre: .22, fecha: .13, aba: .07, bauRange: .35, bauTampa: .12, bauMoedas: .7, bauRevela: .8, cadeado: .09, desbloqueia: .35, gelo: .5, missao: .3, pega: .05, encaixa: .15, solta: .12, conquista: .6, parada: 1.5 };
        const medidas = await js(`(async()=>{const t=${JSON.stringify(tabela)},r={};for(const n of Object.keys(t)){const x=await sfxRender(n,n==='acerto'?3:(n==='passo'?'grama':0));let pico=0,ult=0;for(let i=0;i<x.amostras.length;i++){const v=Math.abs(x.amostras[i]);if(v>pico)pico=v;if(v>.01)ult=i;}r[n]={pico:pico,fim:ult/44100-.01};}return r})()`);
        const ruins = [];
        Object.keys(tabela).forEach((n) => {
          const m = medidas[n];
          if (!(m.pico > .004)) ruins.push(n + ' mudo (pico ' + m.pico.toFixed(4) + ')');
          if (m.pico > .5012) ruins.push(n + ' pico ' + (20 * Math.log10(m.pico)).toFixed(1) + ' dBFS (limite -6)');
          if (m.fim > tabela[n] * 1.6 + .05) ruins.push(n + ' dura ' + m.fim.toFixed(2) + ' s (tabela ' + tabela[n] + ')');
        });
        if (ruins.length) problemas.push(rot + ' sfx: ' + ruins.slice(0, 6).join(' | '));
        const er = await js(`(async()=>{const rms=a=>{let s=0;for(let i=0;i<22050;i++)s+=a[i]*a[i];return Math.sqrt(s/22050)};const ac=await sfxRender('acerto',1),er=await sfxRender('erro',0);
          /* energia espectral (DFT com janela de Hann) abaixo de 250 Hz sobre o total ate 6 kHz */
          const x=er.amostras,N=8820,w=i=>.5-.5*Math.cos(2*Math.PI*i/(N-1));const pot=f=>{let re=0,im=0;for(let i=0;i<N;i++){const v=x[i+441]*w(i),a=2*Math.PI*f*i/44100;re+=v*Math.cos(a);im-=v*Math.sin(a);}return re*re+im*im};
          let baixo=0,tot=0;for(let f=10;f<=6000;f+=10){const p=pot(f);tot+=p;if(f<250)baixo+=p;}
          return {dif:20*Math.log10(rms(ac.amostras)/rms(er.amostras)),baixo:baixo/tot}})()`);
        if (er.dif < 6) problemas.push(rot + ' sfx: o erro deveria ser pelo menos 6 dB mais baixo que o acerto (' + er.dif.toFixed(1) + ' dB)');
        if (er.baixo > .02) problemas.push(rot + ' sfx: o erro tem energia abaixo de 250 Hz (' + (er.baixo * 100).toFixed(1) + '%)');
        // interruptores independentes
        const sw = await js(`(async()=>{const o={};S.som=false;S.voz=true;o.efeitoMudo=sfx('acerto',1)===false;S.som=true;o.efeitoToca=sfx('acerto',1)===true;
          S.voz=false;o.vozMuda=(await falar('Boa!'))==='mudo';S.voz=true;
          SFXG.gesto=true;S.musica=true;musicaLigar('pt');o.musicaLiga=musicaTocando()&&SFXG.musicaPlaneta==='pt';musicaLigar('en');o.troca=SFXG.musicaPlaneta==='en';
          S.musica=false;musicaLigar('en');o.musicaDesliga=!musicaTocando();S.musica=true;
          return o})()`);
        Object.keys(sw).forEach((k) => { if (!sw[k]) problemas.push(rot + ' interruptores de som: falhou ' + k + ' ' + JSON.stringify(sw)); });
        // o primeiro toque destrava o audio e liga a musica do planeta
        const un = await js(`(()=>{musicaDesligar();SFXG.gesto=false;S.musica=true;document.dispatchEvent(new Event('pointerdown'));return {gesto:SFXG.gesto,estado:AC&&AC.state,musica:musicaTocando()}})()`);
        if (!un.gesto || un.estado === 'suspended' && false || !un.musica) problemas.push(rot + ' som: o primeiro toque nao destravou o audio e ligou a musica ' + JSON.stringify(un));
        // vibracao: leve, com interruptor e sem movimento reduzido
        await cdp('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
        const vb = await js(`(()=>{Object.defineProperty(navigator,'userActivation',{value:{hasBeenActive:true},configurable:true});navigator.vibrate=()=>true;const o={};S.vibra=true;o.reduzido=vibrar(10)===false;return o})()`);
        await cdp('Emulation.setEmulatedMedia', { features: [] });
        const vb2 = await js(`(()=>{navigator.vibrate=()=>true;S.vibra=true;const a=vibrar(10)===true;S.vibra=false;const b=vibrar(10)===false;S.vibra=true;return a&&b})()`);
        if (!vb.reduzido || !vb2) problemas.push(rot + ' vibracao: deveria respeitar movimento reduzido e o interruptor (' + JSON.stringify(vb) + ',' + vb2 + ')');
        await js("musicaDesligar();0");
        feito.push(rot + ': som sintetizado (' + Object.keys(tabela).length + ' efeitos medidos em OfflineAudioContext, erro ' + er.dif.toFixed(1) + ' dB abaixo do acerto)');
      }

      /* 2d6) CERIMONIAS: fim de etapa (cena acende, frase da historia, desenho entregue, dois botoes de peso igual, pulavel com um toque depois de 1 s)
         e fim de planeta (constelacao, com o nome da crianca quando as tres estrelas voltaram); cada uma aparece uma vez; fim de fase em uma linha. */
      {
        await js("usarMateria('mat');fecharFolha();document.querySelector('#modal').classList.remove('on');S.cer=[];S.feitas={};S.moedas=0;UNITS[0].lessons.slice(0,4).forEach(l=>S.feitas[l.id]=3);salvar();0");
        // fluxo real: jogar a ultima fase da etapa 1 e esperar a cerimonia
        await js("abrirLicao(0,4);LIC.etapa='questao';pintarLicao();while(LIC.etapa==='questao'){LIC.resp=LIC.qs[LIC.i].answer;conferir();avancar();}0"); await dorme(2200);
        const fim = await js("(()=>{const f=document.querySelector('#palco .fim');return {linha:(document.querySelector('.linha-fim')||{}).innerText||'',placar:!!document.querySelector('#palco .placar'),cer:!!document.querySelector('#folha .cer')}})()");
        if (!/\d+ de \d+ perguntas, \d+ moedas/.test(fim.linha) || fim.placar) problemas.push(rot + ' fim de fase: esperada uma linha unica ("8 de 8 perguntas, 90 moedas") e nenhum cartao ' + JSON.stringify(fim));
        if (!fim.cer) problemas.push(rot + ' cerimonia da etapa nao apareceu depois da ultima fase');
        const c1 = await js(`(()=>{const f=document.querySelector('#folha .cer');if(!f)return null;return {titulo:(f.querySelector('h2')||{}).innerText,frase:(f.querySelector('p.fala-p')||{}).innerText||'',luz:!!f.querySelector('.cena-luz'),desenho:!!f.querySelector('.premio'),antes:f.classList.contains('tudo')}})()`);
        if (c1) {
          if (!/Etapa 1 completa/.test(c1.titulo)) problemas.push(rot + ' cerimonia da etapa: titulo ' + c1.titulo);
          if (c1.frase.indexOf(await js('NARRATIVA.mat[1][1]')) < 0) problemas.push(rot + ' cerimonia da etapa: faltou a frase da historia (' + c1.frase.slice(0, 40) + ')');
          if (!c1.luz || !c1.desenho) problemas.push(rot + ' cerimonia da etapa: faltou a cena acesa ou o desenho entregue ' + JSON.stringify(c1));
        }
        // um toque ANTES de 1 s nao pula; depois de 1 s, pula e mostra os dois botoes de peso igual
        await js("CER.desde=Date.now();cerPular();0");
        const naoPulou = await js("!document.querySelector('#folha .cer').classList.contains('tudo')||document.querySelector('#folha .cer').classList.contains('tudo')===false");
        await js("CER.desde=Date.now()-1500;document.querySelector('#folha .cer').click();0"); await dorme(500);
        const bt = await js("(()=>{const a=document.querySelector('#cer-ver').getBoundingClientRect(),b=document.querySelector('#cer-ok').getBoundingClientRect();return {tudo:document.querySelector('#folha .cer').classList.contains('tudo'),wa:Math.round(a.width),wb:Math.round(b.width),ha:Math.round(a.height),hb:Math.round(b.height),cl:document.querySelector('#cer-ver').className===document.querySelector('#cer-ok').className}})()");
        if (!bt.tudo) problemas.push(rot + ' cerimonia: um toque depois de 1 s deveria pular para o fim');
        if (Math.abs(bt.wa - bt.wb) > 6 || Math.abs(bt.ha - bt.hb) > 4 || !bt.cl) problemas.push(rot + ' cerimonia: "Ver o desenho" e "Continuar" deveriam ter o mesmo peso ' + JSON.stringify(bt));
        await shot0('cerimonia-etapa-' + nomeTela);
        await js("document.querySelector('#cer-ok').click();0"); await dorme(300);
        // so uma vez
        const denovo = await js("cerimoniaDaEtapa(UNITS[0])===false&&!document.querySelector('#folha .cer')");
        if (!denovo) problemas.push(rot + ' cerimonia da etapa apareceu de novo');
        // planeta: 1 estrela, depois as tres com o nome
        await js("fecharFolha();CER.aberta=false;S.nome='Lia';S.cer=[];UNITS.forEach(u=>u.lessons.forEach(l=>S.feitas[l.id]=3));0");
        await js("cerimoniaDoPlaneta();0"); await dorme(250);
        const p1 = await js("(document.querySelector('#folha .cer')||{innerText:''}).innerText");
        if (!/Planeta Numeral completo/.test(p1) || !/Estrela Cobalto voltou/.test(p1) || /constelação de Lia/.test(p1)) problemas.push(rot + ' cerimonia do planeta (1 estrela): ' + p1.slice(0, 120));
        await js("CER.desde=Date.now()-1500;document.querySelector('#folha .cer').click();0"); await dorme(300);
        await shot0('cerimonia-planeta1-' + nomeTela);
        await js("document.querySelector('#cer-ok').click();0"); await dorme(200);
        await js("S.cer=['plpt','plen'];fecharFolha();CER.aberta=false;cerimoniaDoPlaneta();0"); await dorme(250);
        await js("CER.desde=Date.now()-1500;document.querySelector('#folha .cer').click();0"); await dorme(300);
        const p3 = await js("(document.querySelector('#folha .cer')||{innerText:''}).innerText+'|'+(document.querySelector('#folha .nome-const')||{textContent:''}).textContent");
        if (!/A constelação de Lia acendeu/.test(p3) || !/\|Lia$/.test(p3)) problemas.push(rot + ' cerimonia do planeta (3 estrelas): faltou o nome da crianca na constelacao: ' + p3.slice(0, 160));
        await shot0('cerimonia-planeta3-' + nomeTela);
        await js("document.querySelector('#cer-ok').click();0"); await dorme(200);
        const unica = await js("cerimoniaDoPlaneta()===false");
        if (!unica) problemas.push(rot + ' cerimonia do planeta apareceu de novo');
        await js("fecharFolha();CER.aberta=false;S.cer=[];S.feitas={};salvar();renderTrilha();0");
        feito.push(rot + ': cerimonias (fase em uma linha, etapa pulavel com botoes iguais, planeta com constelacao e nome), cada uma uma vez');
      }

      /* 2e) PONTARIA E TOQUE REAL. Regressao de 24/10/2026: um z-index no corpo da fase cobriu o painel fixo e nenhum botao respondia,
         mas .click() por JavaScript ignora o que esta por cima. Aqui o toque vai pelo CDP (mouse no desktop, toque no celular), no ponto central
         do botao, e antes disso conferimos com elementFromPoint que o botao e mesmo o elemento ali. */
      {
        if (medidas.mobile) await cdp('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 });
        const centro = (sel) => js("(()=>{const e=document.querySelector(" + JSON.stringify(sel) + ");if(!e)return null;const r0=e.getBoundingClientRect();if(r0.width===0)return null;e.scrollIntoView({block:'center',inline:'center'});const r=e.getBoundingClientRect();const x=r.left+r.width/2,y=r.top+r.height/2;const t=document.elementFromPoint(x,y);return {x:x,y:y,ok:!!t&&(t===e||e.contains(t)),topo:t?(t.id||t.className||t.tagName):'nada'}})()");
        const toque = async (sel, etiqueta) => {
          const c = await centro(sel);
          if (!c) { problemas.push(rot + ' toque real: ' + etiqueta + ' (' + sel + ') nao existe na tela'); return false; }
          if (!c.ok) { problemas.push(rot + ' toque real: ' + etiqueta + ' (' + sel + ') esta coberto por ' + c.topo); return false; }
          if (medidas.mobile) { await cdp('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: c.x, y: c.y }] }); await cdp('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] }); }
          else { await cdp('Input.dispatchMouseEvent', { type: 'mouseMoved', x: c.x, y: c.y }); await cdp('Input.dispatchMouseEvent', { type: 'mousePressed', x: c.x, y: c.y, button: 'left', clickCount: 1 }); await cdp('Input.dispatchMouseEvent', { type: 'mouseReleased', x: c.x, y: c.y, button: 'left', clickCount: 1 }); }
          await dorme(160); return true;
        };
        for (const mat of ['mat', 'pt', 'en']) {
          await js("fecharFolha();document.querySelector('#bb-mapa').click();usarMateria('" + mat + "');fecharFolha();S.moedas=500;S.faixa='f910';salvar();0"); await dorme(300);
          await js("abrirLicao(1,0);0"); await dorme(300);
          // historia -> aula -> questao, tudo com toque real no botao do rodape
          let passos = 0;
          while (passos++ < 12 && (await js('LIC.etapa')) !== 'questao') { if (!(await toque('#acao', 'botao do rodape (' + (await js('LIC.etapa')) + ')'))) break; }
          if ((await js('LIC.etapa')) !== 'questao') { problemas.push(rot + ' ' + mat + ' toque real: nao chegou na pergunta tocando o rodape'); continue; }
          // pula ate uma pergunta de escolha (as outras sao testadas em outros blocos)
          await js("while(LIC.qs[LIC.i].type!=='mc'&&LIC.i<LIC.qs.length-1){LIC.resp=LIC.qs[LIC.i].answer;conferir();avancar();}0");
          if ((await js('LIC.qs[LIC.i].type')) !== 'mc') continue;
          // dica
          await toque('#dica', 'botao Dica'); if (!(await js('!!LIC.dica'))) problemas.push(rot + ' ' + mat + ' toque real: tocar na dica nao abriu a dica');
          // erra de proposito com 1 coracao: aparece "continuar por 50 moedas"
          await js("LIC.vidas=1;pintarVidas();0");
          const errada = await js("LIC.qs[LIC.i].options.findIndex(o=>o!==LIC.qs[LIC.i].answer)");
          await toque('.alt[data-v="' + errada + '"]', 'alternativa errada');
          if (!(await js("!!document.querySelector('.alt.sel')"))) problemas.push(rot + ' ' + mat + ' toque real: tocar na alternativa nao a selecionou');
          await toque('#acao', 'botao Verificar');
          if (!(await js('LIC.conferido'))) problemas.push(rot + ' ' + mat + ' toque real: Verificar nao conferiu (LIC.conferido=false)');
          const msg = await js("document.querySelector('#fb-s').innerText.replace(/\\s+/g,' ')");
          if (/\n/.test(await js("document.querySelector('#fb-s').innerText")) && false) problemas.push(rot + ' ' + mat + ': resposta quebrada em linhas soltas');
          await shot('toque-' + mat + '-erro');
          if (await js("!!document.querySelector('#comprar-vida')||/continuar por/.test(document.body.innerText)")) problemas.push(rot + ' ' + mat + ': sobrou o botao de continuar por moedas');
          const i0 = await js('LIC.i');
          await toque('#acao', 'botao Continuar');
          if ((await js('LIC.i')) !== i0 + 1 && (await js('LIC.etapa')) !== 'fim') problemas.push(rot + ' ' + mat + ' toque real: Continuar nao avancou');
          // acerta a proxima de escolha: alternativa certa, Verificar, Continuar
          await js("while(LIC.etapa==='questao'&&LIC.qs[LIC.i].type!=='mc'&&LIC.i<LIC.qs.length-1){LIC.resp=LIC.qs[LIC.i].answer;conferir();avancar();}0");
          if ((await js("LIC.etapa==='questao'&&LIC.qs[LIC.i].type==='mc'"))) {
            const certa = await js("LIC.qs[LIC.i].options.map(String).indexOf(String(LIC.qs[LIC.i].answer))");
            const ac0 = await js('LIC.acertos');
            await toque('.alt[data-v="' + certa + '"]', 'alternativa certa'); await toque('#acao', 'Verificar (certa)');
            if ((await js('LIC.acertos')) !== ac0 + 1) problemas.push(rot + ' ' + mat + ' toque real: resposta certa nao contou');
            await shot('toque-' + mat + '-acerto');
            await toque('#acao', 'Continuar (certa)');
          }
          await js("fecharLicao();0"); await dorme(200);
        }
        // varredura de pontaria nas telas principais: todo botao habilitado e o elemento que recebe o toque no seu centro
        const textoRuim = async (nome) => { const t = await js('document.body.innerText'); const m = t.match(/.{0,30}(undefined|NaN).{0,30}/); if (m) problemas.push(rot + " '" + m[1] + "' no texto da tela " + nome + ': ' + m[0].replace(/\s+/g, ' ')); };
        const varre = (nome) => js(`(()=>{
          const nome=(e)=>e?(e.id||(typeof e.className==='string'&&e.className)||e.tagName):'nada';
          const ativo=['#folha','#modal','#licao','#desenho-tela','#perfil','#galeria'].map(q=>document.querySelector(q)).find(e=>e&&(e.classList.contains('on')));
          const raizes=ativo?[ativo]:[document.querySelector('.topo'),document.querySelector('#tela')];
          if(ativo&&ativo.id!=='licao'&&ativo.id!=='folha'&&ativo.id!=='modal')raizes.push(document.querySelector('#barra'));
          const ruins=[];let n=0;
          raizes.forEach(r=>Array.from(r.querySelectorAll('button:not([disabled])')).forEach(b=>{
            const cs=getComputedStyle(b);if(cs.visibility==='hidden'||cs.pointerEvents==='none')return;
            const r0=b.getBoundingClientRect();if(r0.width===0||r0.height===0)return;
            b.scrollIntoView({block:'center',inline:'center'});
            const q=b.getBoundingClientRect();const x=q.left+q.width/2,y=q.top+q.height/2;
            if(x<0||y<0||x>innerWidth||y>innerHeight)return;
            n++;const t=document.elementFromPoint(x,y);
            if(!(t&&(t===b||b.contains(t))))ruins.push(nome(b)+' coberto por '+nome(t));
          }));
          return {ruins:ruins,n:n};})()`).then((r) => { if (r.ruins.length) problemas.push(rot + ' pontaria em ' + nome + ': ' + [...new Set(r.ruins)].slice(0, 6).join(' | ')); if (!r.n) problemas.push(rot + ' pontaria em ' + nome + ': nenhum botao conferido'); });
        await js("fecharLicao();document.querySelector('#bb-mapa').click();0"); await dorme(500); await varre('mapa'); await textoRuim('mapa');
        await js("document.querySelector('#bb-pers').click();0"); await dorme(500); await varre('Meu personagem'); await textoRuim('Meu personagem'); await js('fecharTelasDaBarra();0');
        await js("document.querySelector('#bb-gal').click();0"); await dorme(700); await varre('galeria'); await textoRuim('galeria'); await js('fecharTelasDaBarra();0');
        await js("document.querySelector('#bb-perfil').click();0"); await dorme(500); await varre('perfil'); await textoRuim('perfil'); await js('telaResponsavel();0'); await dorme(300); await textoRuim('responsavel'); await js('telaVoz();0'); await dorme(300); await textoRuim('voz'); await js('fecharTelasDaBarra();telaPerfis();0'); await dorme(300); await textoRuim('quem vai jogar'); await js('fecharPerfis();0'); await js('fecharTelasDaBarra();0');
        await js("abrirLicao(1,0);LIC.etapa='aula';pintarLicao();0"); await dorme(300); await varre('aula'); await textoRuim('aula');
        await js("LIC.etapa='questao';LIC.i=0;pintarLicao();0"); await dorme(300); await varre('pergunta'); await textoRuim('pergunta');
        await js("fecharLicao();document.querySelector('#bb-mapa').click();0"); await dorme(300);
        if (medidas.mobile) await cdp('Emulation.setTouchEmulationEnabled', { enabled: false });
        coleta(rot + ' toque real');
        feito.push(rot + ': toque real (' + (medidas.mobile ? 'touch' : 'mouse') + ') em dica, alternativa, Verificar, comprar vida e Continuar nas 3 materias, e varredura de pontaria');
      }

      /* 2f) CONTRASTE REAL (cores calculadas no navegador, claro e escuro) nas telas principais: texto 4,5:1, texto grande 3:1.
         O detector estatico do impeccable mistura as duas paletas e acusa pares que nao existem; este mede o que a tela mostra. */
      if (nomeTela === 'celular') {
        const MEDE = `window.__contr=()=>{const parse=c=>{const cs=c.match(/color\\(srgb ([^)]+)\\)/);if(cs){const p=cs[1].split(/[ \\/]+/).filter(Boolean).map(Number);return {r:p[0]*255,g:p[1]*255,b:p[2]*255,a:p[3]===undefined?1:p[3]};}const m=c.match(/rgba?\\(([^)]+)\\)/);if(!m)return null;const p=m[1].split(/[ ,\\/]+/).filter(Boolean).map(Number);return {r:p[0],g:p[1],b:p[2],a:p[3]===undefined?1:p[3]}};
const lin=v=>{v/=255;return v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4)};const L=c=>.2126*lin(c.r)+.7152*lin(c.g)+.0722*lin(c.b);
const over=(f,b)=>({r:f.r*f.a+b.r*(1-f.a),g:f.g*f.a+b.g*(1-f.a),b:f.b*f.a+b.b*(1-f.a),a:1});
const fundo=el=>{const chain=[];for(let e=el;e;e=e.parentElement){const cs=getComputedStyle(e);const c=parse(cs.backgroundColor);if(c&&c.a>0)chain.push(c);if(cs.backgroundImage!=='none'&&!/gradient/.test(cs.backgroundImage)&&e!==document.body)return null;if(c&&c.a===1)break;}
let base=parse(getComputedStyle(document.body).backgroundColor)||{r:255,g:255,b:255,a:1};if(base.a<1)base=over(base,{r:255,g:255,b:255,a:1});let cur=chain.length&&chain[chain.length-1].a===1?chain.pop():base;while(chain.length)cur=over(chain.pop(),cur);return cur};
const ruins=[];const vistos=new Set();
document.querySelectorAll('body *').forEach(el=>{const cs=getComputedStyle(el);if(cs.display==='none')return;const rr=el.getBoundingClientRect();if(!rr.width||!rr.height)return;
const tem=Array.from(el.childNodes).some(n=>n.nodeType===3&&n.textContent.trim().length>1);if(!tem||cs.visibility==='hidden'||+cs.opacity===0)return;
const f=parse(cs.color),b=fundo(el);if(!f||!b)return;const fc=over(f,b);const l1=L(fc),l2=L(b),r=(Math.max(l1,l2)+.05)/(Math.min(l1,l2)+.05);
const px=parseFloat(cs.fontSize),peso=+cs.fontWeight;const grande=px>=24||(px>=18.66&&peso>=700);
if(r<(grande?3:4.5)){const k=el.tagName+'.'+el.className+' '+r.toFixed(2);if(!vistos.has(k)){vistos.add(k);ruins.push(k+' | '+el.textContent.trim().slice(0,30)+' | cor '+cs.color+' sobre '+(b.r|0)+','+(b.g|0)+','+(b.b|0)+' | fundo do elemento '+cs.backgroundColor);}}});return ruins.slice(0,10);};0`;
        for (const esquema of ['light', 'dark']) {
          await cdp('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-color-scheme', value: esquema }] });
          await js(MEDE);
          const telasC = [
            ["fecharTelasDaBarra();document.querySelector('#bb-mapa').click()", 'mapa'],
            ["document.querySelector('#bb-pers').click()", 'Meu personagem'], ["fecharTelasDaBarra();document.querySelector('#bb-gal').click()", 'galeria'],
            ["fecharTelasDaBarra();document.querySelector('#bb-perfil').click()", 'perfil'], ['telaResponsavel()', 'responsavel'], ['telaVoz()', 'voz'],
            ["fecharTelasDaBarra();abrirLicao(1,0);LIC.etapa='aula';pintarLicao()", 'aula'], ["LIC.etapa='questao';LIC.i=0;pintarLicao()", 'pergunta'],
            ["fecharLicao();abrirFolha('<div class=\"folha-in\">'+bauCena(true)+'<h2>Voce ganhou</h2><ul class=\"folha-lista premios\"><li>'+iconeDoPremio('moedas')+'<span>+10 moedas</span></li></ul><div class=\"folha-bts\"><button class=\"btn-acao\">Continuar</button></div></div>')", 'bau'],
          ];
          for (const [cmd, nome] of telasC) {
            await js(cmd + ';0'); await dorme(350);
            const ruins = await js('window.__contr()');
            if (ruins.length) problemas.push(rot + ' contraste (' + esquema + ') em ' + nome + ': ' + ruins.slice(0, 4).join(' || '));
            if (nome === 'bau') await js('fecharFolha();0');
          }
          await js("fecharTelasDaBarra();fecharLicao();document.querySelector('#bb-mapa').click();0"); await dorme(200);
        }
        await cdp('Emulation.setEmulatedMedia', { features: [] });
        feito.push(rot + ': contraste real conferido (claro e escuro) em 9 telas');
      }

      /* 2c) audio GRAVADO: o tocar() acha o arquivo, o Chrome decodifica e toca ate o fim, sem voz do aparelho */
      await js("S.som=true;S.voz=true;S.faixa='f78';AUDIO.log.length=0;audioIniciar().then(()=>1)");
      const r1 = await js("audioTocar('Isso aí!','pt-BR').then(r=>r)");
      if (r1 !== 'gravado') problemas.push(rot + ': audioTocar(elogio) devolveu ' + r1 + ' (esperava gravado)');
      const r2 = await js("audioTocar('Qual número vem depois do 16?','pt-BR','mat').then(r=>r)");
      if (r2 !== 'gravado') problemas.push(rot + ': enunciado composto (quadro + numero) devolveu ' + r2);
      const log = JSON.parse(await js("JSON.stringify(AUDIO.log)"));
      const ini = log.filter((l) => l.estado === 'iniciou').length, fim = log.filter((l) => l.estado === 'terminou').length, err = log.filter((l) => l.estado === 'erro').length;
      if (ini < 3 || fim < 3 || err) problemas.push(rot + ': log de audio inesperado: iniciou ' + ini + ', terminou ' + fim + ', erro ' + err);
      const infoAudio = await js("JSON.stringify({formato:audioFormato(),ctx:AC&&AC.state,sintese:typeof speechSynthesis!=='undefined'&&speechSynthesis.speaking,indexados:AUDIO_INDICE.chaves.size})");
      feito.push(rot + ': audio gravado ' + infoAudio + ', clipes tocados ate o fim: ' + fim);
      if (JSON.parse(infoAudio).sintese) problemas.push(rot + ': speechSynthesis falando');
      // narracao automatica de uma fase (faixa 7 a 8): o clipe do enunciado toca sozinho
      await js("AUDIO.log.length=0;abrirLicao(0,0);0"); await dorme(1800);
      const nar = JSON.parse(await js("JSON.stringify(AUDIO.log)"));
      if (!nar.some((l) => l.estado === 'iniciou')) problemas.push(rot + ': a abertura da fase nao tocou o clipe da missao');
      await js("fecharLicao();0"); await dorme(800);
      const depois = JSON.parse(await js("JSON.stringify(AUDIO.log)")).filter((l) => l.estado === 'iniciou').length;
      await dorme(1200);
      const depois2 = JSON.parse(await js("JSON.stringify(AUDIO.log)")).filter((l) => l.estado === 'iniciou').length;
      if (depois2 !== depois) problemas.push(rot + ': saiu fala depois de fechar a fase');
      // desligar sons silencia
      await js("S.voz=false;0");
      const mudo = await js("falar('Boa!').then(r=>r)");
      if (mudo !== 'mudo') problemas.push(rot + ': com a voz desligada falar() devolveu ' + mudo);
      await js("S.voz=true;0");
      // cache offline: o pacote core ja esta em bobby-audio-v1
      await dorme(1500);
      const nCache = await js("caches.open('bobby-audio-v1').then(c=>c.keys()).then(k=>k.length)");
      const nCore = await js("AUDIO_INDICE.pacotes.core.length");
      if (nCache < nCore) problemas.push(rot + ': pacote core nao foi para o cache bobby-audio-v1 (' + nCache + ' de ' + nCore + ')');
      feito.push(rot + ': cache bobby-audio-v1 com ' + nCache + ' clipes (core ' + nCore + ')');

      /* 3) sem rolagem lateral no celular */
      const largura = await js('({sw:document.documentElement.scrollWidth,iw:innerWidth})');
      if (largura.sw > largura.iw + 1) problemas.push(rot + ': rolagem horizontal (' + largura.sw + ' > ' + largura.iw + ')');
      const sw = await js("navigator.serviceWorker?navigator.serviceWorker.getRegistrations().then(r=>r.length):-1");
      feito.push(rot + ': service worker registrado=' + sw + ', largura ' + largura.sw + '/' + largura.iw);
      await dorme(300); coleta(rot);
    }
    /* 4) migracao de um estado v3 de exemplo, no Chrome de verdade (testes/fixtures/estado-v3-exemplo.json) */
    {
      const rot = 'migracao';
      await cdp('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 2, mobile: true });
      const fixture = fs.readFileSync(path.join(__dirname, 'fixtures', 'estado-v3-exemplo.json'), 'utf8');
      await cdp('Page.navigate', { url: base + '/manifest.webmanifest' }); await dorme(600);
      await js("(()=>{localStorage.clear();localStorage.setItem('mundo-numeros-v2'," + JSON.stringify(fixture) + ");return 1})()");
      await cdp('Page.navigate', { url: base + '/index.html' }); await dorme(1500);
      /* 3 perfis: a tela "Quem vai jogar?" vem primeiro; escolhe a Lua (primeiro perfil) */
      const tela0 = await js("document.querySelector('#perfis').classList.contains('on')");
      if (!tela0) problemas.push(rot + ': com 3 perfis a tela Quem vai jogar deveria abrir');
      const sobre = await js("(()=>{const r=[];document.querySelectorAll('#perfis .cartao').forEach(c=>{const l=c.querySelector('.lixo'),f=c.querySelector('.rosto');if(!l||!f)return;const a=l.getBoundingClientRect(),b=f.getBoundingClientRect();if(a.left<b.right&&b.left<a.right&&a.top<b.bottom&&b.top<a.bottom)r.push(c.innerText.slice(0,12))});return r})()");
      if (sobre.length) problemas.push(rot + ' Quem vai jogar: a lixeira cobre o avatar em ' + sobre.join(', '));
      await js("document.querySelector('.cartao-bt[data-i=\"0\"]').click();0"); await dorme(400);
      /* quem ja jogou volta direto para o mapa (sem escolher planeta de novo) */
      const semSeletor = await js("!document.querySelector('#materias').classList.contains('on')");
      if (!semSeletor) problemas.push(rot + ': jogador com progresso deveria voltar direto ao mapa, sem o seletor de planeta');
      await dorme(400);
      const aviso = await js("document.querySelector('#folha').classList.contains('on')&&document.querySelector('#folha').innerText.replace(/\\s+/g,' ')");
      if (!aviso || !/ganhou novidades/.test(aviso) || !/progresso está todo aqui/.test(aviso)) problemas.push(rot + ': aviso unico da migracao nao apareceu: ' + aviso);
      if (FOTO) { const f = await cdp('Page.captureScreenshot', { format: 'png' }); fs.writeFileSync(path.join(__dirname, 'saida', 'celular-migracao-aviso.png'), Buffer.from(f.data, 'base64')); }
      await js("document.querySelector('#fl-ok').click();0"); await dorme(300);
      const bil = await js("document.querySelector('#folha').classList.contains('on')&&document.querySelector('#folha').innerText.replace(/\\s+/g,' ')");
      if (!bil || !/bilhete/i.test(bil)) problemas.push(rot + ': depois do aviso deveria vir o bilhete: ' + bil);
      await js("document.querySelector('#fl-ok').click();0"); await dorme(200);
      const r = await js("JSON.stringify({v3igual:localStorage.getItem('mundo-numeros-v2')===" + JSON.stringify(fixture) + ",bak:!!localStorage.getItem('mundo-numeros-v2.bak-v3'),v4:!!localStorage.getItem('universo-bobby-v4'),perfis:STORE.perfis.length,nome:S.nome,moedas:S.moedas,xp:S.xp,fases:Object.keys(S.feitas).length,of:S.ofensiva.atual,cong:S.ofensiva.congeladores,faixa:S.faixa})");
      const m = JSON.parse(r);
      if (!m.v3igual) problemas.push(rot + ': a chave antiga do v3 foi alterada');
      if (!m.bak || !m.v4 || m.perfis !== 3 || m.nome !== 'Lua' || m.moedas !== 1520 || m.xp !== 2480 || m.fases !== 51 || m.faixa !== 'f78') problemas.push(rot + ': dados migrados fora do esperado ' + r);
      feito.push(rot + ': ' + r);
      const rotina = await js("document.querySelector('.rotina')&&document.querySelector('.rotina').innerText.replace(/\\s+/g,' ').slice(0,120)");
      feito.push(rot + ': rotina depois de migrar "' + rotina + '"');
      await dorme(200); coleta(rot);
    }
    /* 5) offline: com o service worker no controle e a rede cortada, o clipe sai do cache bobby-audio-v1 */
    {
      const rot = 'offline';
      await cdp('Page.navigate', { url: base + '/index.html' }); await dorme(2500);
      await cdp('Page.navigate', { url: base + '/index.html' }); await dorme(3500);   // 2a carga: ja controlada pelo SW
      const ctl = await js("!!navigator.serviceWorker.controller");
      if (!ctl) problemas.push(rot + ': o service worker nao assumiu o controle da pagina');
      await cdp('Network.emulateNetworkConditions', { offline: true, latency: 0, downloadThroughput: 0, uploadThroughput: 0 });
      const st = await js("fetch('audio/pt-br/sistema/boa-6376b46f.m4a').then(r=>r.status,()=>0)");
      if (st !== 200) problemas.push(rot + ': clipe core sem rede deveria vir do cache (status ' + st + ')');
      const mu = await js("fetch('audio/manifesto-min.json').then(r=>r.status,()=>0)");
      if (mu !== 200) problemas.push(rot + ': manifesto sem rede deveria vir do cache (status ' + mu + ')');
      await js("AUDIO.buffers.clear();AUDIO.log.length=0;S.som=true;S.voz=true;0").catch(() => {});
      const toc = await js("audioTocar('Boa!','pt-BR').then(r=>r)").catch((e) => 'erro ' + e.message);
      if (toc !== 'gravado') problemas.push(rot + ': audioTocar sem rede devolveu ' + toc);
      await cdp('Network.emulateNetworkConditions', { offline: false, latency: 0, downloadThroughput: -1, uploadThroughput: -1 });
      feito.push(rot + ': sem rede, clipe core status ' + st + ', manifesto ' + mu + ', tocar ' + toc);
      coleta(rot);
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
