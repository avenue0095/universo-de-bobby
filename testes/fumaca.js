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
      /* STORE.atual=-1: o app grava o estado ao sair da pagina (pagehide); sem isso ele regravaria o jogador antigo logo apos o clear */
      await js("STORE.atual=-1;localStorage.clear();location.reload();0");
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
      const alvos = await js("(()=>{const r={};['#troca-materia','#som','#bb-mapa','#bb-pers','#bb-gal','#bb-perfil'].forEach(q=>{const b=document.querySelector(q).getBoundingClientRect();r[q]=Math.min(b.width,b.height)});return r})()");
      Object.keys(alvos).forEach((q) => { if (alvos[q] < 48) problemas.push(rot + ': alvo de toque ' + q + ' com ' + Math.round(alvos[q]) + ' px (minimo 48)'); });
      const bar = await js("Array.from(document.querySelectorAll('.barra-baixo button')).map(b=>Math.round(b.getBoundingClientRect().height))");
      if (new Set(bar).size > 1) problemas.push(rot + ': itens da barra com alturas diferentes ' + bar.join(','));
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
        const mapa = await js("({etapas:document.querySelectorAll('.etapa').length,nos:document.querySelectorAll('.no .bt').length,luz:(document.querySelector('#etapa-1 .cena-luz')||{}).naturalWidth,planeta:(document.querySelector('.planeta-img img')||{}).naturalWidth,voce:!!document.querySelector('.voce'),menor:Math.min.apply(null,Array.from(document.querySelectorAll('.no .bt')).map(b=>Math.min(b.getBoundingClientRect().width,b.getBoundingClientRect().height))),retrato:(document.querySelector('#retrato-bb img')||{}).naturalWidth})");
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
        if (gal.cartoes !== 30 || gal.livres < 1) problemas.push(rot + ' desenhos: galeria ' + JSON.stringify(gal));
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
        await js("document.querySelector('[data-aba=\"chapeu\"]').click();0"); await dorme(200);
        await js("document.querySelector('[data-buy]').click();0"); await dorme(300);
        const roupa = await js("({chapeu:!!document.querySelector('.palco .item-chapeu'),look:S.look.chapeu,moedas:S.moedas})");
        if (!roupa.chapeu || roupa.look !== 'explorador') problemas.push(rot + ' personagem: chapeu nao apareceu ' + JSON.stringify(roupa));
        await js("document.querySelector('[data-aba=\"comp\"]').click();0"); await dorme(200);
        await js("document.querySelector('[data-comp=\"rufa\"]').click();0"); await dorme(300);
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
      await js("S.som=false;0");
      const mudo = await js("falar('Boa!').then(r=>r)");
      if (mudo !== 'mudo') problemas.push(rot + ': com o som desligado falar() devolveu ' + mudo);
      await js("S.som=true;0");
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
      await js("document.querySelector('.cartao-bt[data-i=\"0\"]').click();0"); await dorme(400);
      await js("document.querySelector('[data-m=\"mat\"]').click();0"); await dorme(400);
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
