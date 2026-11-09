#!/usr/bin/env node
'use strict';
/* Toque de verdade (sessao 1B2 e estrutura para venda), no Chrome headless via DevTools (CDP), sem pacote.
   Celular: Input.dispatchTouchEvent com emulacao de toque; computador: Input.dispatchMouseEvent. Antes de cada toque confere com
   document.elementFromPoint que o alvo e o elemento no ponto (nunca .click() por JavaScript no que esta sendo testado).
   Cobre: (1) ligar com traco e com dois toques; (2) tracar o caminho ate a resposta (e sair do caminho nao escolhe nada);
   (3) arrastar a resposta ate o balao; (4) tocar objeto e depois tocar a cesta que ja tem 1 item (o defeito da troca que oscilava);
   (5) 20 objetos para contar cabem sem rolar, com as alternativas acima do rodape, em 320x568, 360x640 e 390x844;
   (6) muro no modo 'pago' sem conta: a fase nao abre e a tela Assinatura aparece com os precos de PLANOS; modo 'aberto' nao muda nada.
   Falha se houver excecao ou console.error. Chrome sempre com --mute-audio.
   Uso: node testes/toque.js [--chrome=/caminho] [--foto] [--so=390]  */
const http = require('http');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawn } = require('child_process');

const RAIZ = path.resolve(__dirname, '..');
const arg = (n) => { const a = process.argv.find((x) => x.startsWith('--' + n + '=')); return a ? a.slice(n.length + 3) : null; };
const FOTO = process.argv.includes('--foto');
const SO = arg('so');
const CHROME = arg('chrome') || process.env.CHROME_BIN || [
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser',
].find((p) => fs.existsSync(p));
if (!CHROME) { console.log('SEM CHROME: teste NAO rodou.'); process.exit(2); }

const TIPOS = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.webp': 'image/webp', '.woff2': 'font/woff2', '.svg': 'image/svg+xml', '.webmanifest': 'application/manifest+json', '.json': 'application/json', '.m4a': 'audio/mp4', '.opus': 'audio/ogg', '.ico': 'image/x-icon' };
const servidor = http.createServer((req, res) => {
  let rel = decodeURIComponent(req.url.split('?')[0]);
  if (rel === '/') rel = '/index.html';
  const arq = path.join(RAIZ, rel);
  if (!arq.startsWith(RAIZ) || rel.startsWith('/src') || rel.startsWith('/.git') || !fs.existsSync(arq) || fs.statSync(arq).isDirectory()) { res.writeHead(404); res.end('nao'); return; }
  res.writeHead(200, { 'content-type': TIPOS[path.extname(arq)] || 'application/octet-stream', 'cache-control': 'no-store' });
  fs.createReadStream(arq).pipe(res);
});
const dorme = (ms) => new Promise((r) => setTimeout(r, ms));
async function esperaHttp(url) { for (let i = 0; i < 240; i++) { try { const r = await fetch(url); if (r.ok) return r.json(); } catch (e) { /* subindo */ } await dorme(250); } throw new Error('Chrome nao respondeu'); }

async function main() {
  await new Promise((r) => servidor.listen(0, '127.0.0.1', r));
  const base = 'http://127.0.0.1:' + servidor.address().port;
  const perfil = fs.mkdtempSync(path.join(os.tmpdir(), 'bobby-toque-'));
  const portaCdp = 9800 + Math.floor(Math.random() * 150);
  const chrome = spawn(CHROME, ['--headless=new', '--remote-debugging-port=' + portaCdp, '--user-data-dir=' + perfil, '--no-first-run', '--no-default-browser-check',
    '--disable-gpu', '--mute-audio', 'about:blank'], { stdio: 'ignore' });
  const limpa = () => { try { chrome.kill('SIGKILL'); } catch (e) {} try { servidor.close(); } catch (e) {} };
  /* o perfil temporario do Chrome sai em QUALQUER saida (fim normal, falha ou excecao), nao so no fim feliz */
  const tiraPerfil = () => { for (let i = 0; i < 30 && fs.existsSync(perfil); i++) { try { fs.rmSync(perfil, { recursive: true, force: true }); } catch (e) {} if (fs.existsSync(perfil)) Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 100); } };
  process.on('exit', () => { limpa(); tiraPerfil(); });
  const problemas = [], feito = [];
  try {
    const alvos = await esperaHttp('http://127.0.0.1:' + portaCdp + '/json/list');
    const ws = new WebSocket(alvos.find((a) => a.type === 'page').webSocketDebuggerUrl);
    await new Promise((ok, no) => { ws.onopen = ok; ws.onerror = no; });
    let id = 0; const pend = new Map(); const eventos = [];
    ws.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id && pend.has(d.id)) { const { ok, no } = pend.get(d.id); pend.delete(d.id); d.error ? no(new Error(d.error.message)) : ok(d.result); } else if (d.method) eventos.push(d); };
    const cdp = (method, params) => new Promise((ok, no) => { const i = ++id; pend.set(i, { ok, no }); ws.send(JSON.stringify({ id: i, method, params: params || {} })); });
    const js = async (expr) => { const r = await cdp('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true }); if (r.exceptionDetails) throw new Error('JS: ' + ((r.exceptionDetails.exception && r.exceptionDetails.exception.description) || r.exceptionDetails.text) + ' <= ' + String(expr).slice(0, 120)); return r.result.value; };
    await cdp('Runtime.enable'); await cdp('Log.enable'); await cdp('Page.enable');
    const coleta = (rot) => { while (eventos.length) { const e = eventos.shift(), p = e.params;
      if (e.method === 'Runtime.exceptionThrown') problemas.push(rot + ' excecao: ' + ((p.exceptionDetails.exception && p.exceptionDetails.exception.description) || p.exceptionDetails.text));
      if (e.method === 'Runtime.consoleAPICalled' && p.type === 'error') problemas.push(rot + ' console.error: ' + p.args.map((a) => a.value || a.description).join(' '));
      if (e.method === 'Log.entryAdded' && p.entry.level === 'error') problemas.push(rot + ' log: ' + p.entry.text + ' ' + (p.entry.url || '')); } };
    const foto = async (nome) => { if (!FOTO) return; fs.mkdirSync(path.join(__dirname, 'saida'), { recursive: true }); const f = await cdp('Page.captureScreenshot', { format: 'png' }); fs.writeFileSync(path.join(__dirname, 'saida', 'toque-' + nome + '.png'), Buffer.from(f.data, 'base64')); };

    const telas = [['390x844', { width: 390, height: 844, deviceScaleFactor: 2, mobile: true }], ['360x640', { width: 360, height: 640, deviceScaleFactor: 2, mobile: true }],
      ['320x568', { width: 320, height: 568, deviceScaleFactor: 2, mobile: true }], ['1280x800', { width: 1280, height: 800, deviceScaleFactor: 1, mobile: false }]]
      .filter(([n]) => !SO || n.startsWith(SO));
    for (const [rot, med] of telas) {
      const toqueTela = med.mobile;
      await cdp('Emulation.setDeviceMetricsOverride', med);
      await cdp('Emulation.setTouchEmulationEnabled', { enabled: toqueTela, maxTouchPoints: toqueTela ? 5 : 1 });
      await cdp('Page.navigate', { url: base + '/index.html' }); await dorme(1200);
      for (let k = 0; k < 70; k++) { let ok = false; try { ok = await js("typeof STORE!=='undefined'"); } catch (e) {} if (ok) break; await dorme(200); }
      await js("STORE.atual=-1;localStorage.clear();location.reload();0"); await dorme(1500);
      /* preparo (nao e o que se testa): cria o jogador */
      /* com a máquina carregada o modal pode demorar: espera o campo existir e estar visível (até 10 s) */
      for (let k = 0; k < 50; k++) { let ok = false; try { ok = await js("!!document.querySelector('#campo-nome')&&document.querySelector('#modal').classList.contains('on')"); } catch (e) {} if (ok) break; await dorme(200); }
      await js("(()=>{document.querySelector('#campo-nome').value='Toque';document.querySelector('#salvar-nome').click();return 1})()"); await dorme(500);
      coleta(rot + ' abrir');

      /* ponto de um seletor (rola para o centro antes) e confere que ele e o elemento no ponto */
      const ponto = async (sel, rolar = true) => js("(()=>{const e=document.querySelector(" + JSON.stringify(sel) + ");if(!e)return null;" + (rolar ? "e.scrollIntoView({block:'center'});" : '') +
        "const r=e.getBoundingClientRect(),x=r.left+r.width/2,y=r.top+r.height/2,t=document.elementFromPoint(x,y);return {x,y,livre:!!t&&(t===e||e.contains(t)),alvo:t?(t.className&&t.className.baseVal!==undefined?t.className.baseVal:t.className)+'':''}})()");
      const toque = async (sel, etiqueta, rolar = true) => {
        const c = await ponto(sel, rolar);
        if (!c) { problemas.push(rot + ' ' + etiqueta + ': nao achei ' + sel); return null; }
        if (!c.livre) problemas.push(rot + ' ' + etiqueta + ': ' + sel + ' coberto por ' + c.alvo);
        if (toqueTela) { await cdp('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: c.x, y: c.y }] }); await cdp('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] }); }
        else { await cdp('Input.dispatchMouseEvent', { type: 'mouseMoved', x: c.x, y: c.y }); await cdp('Input.dispatchMouseEvent', { type: 'mousePressed', x: c.x, y: c.y, button: 'left', clickCount: 1 }); await cdp('Input.dispatchMouseEvent', { type: 'mouseReleased', x: c.x, y: c.y, button: 'left', clickCount: 1 }); }
        await dorme(80); return c;
      };
      const arrasta = async (pts) => {
        if (toqueTela) {
          await cdp('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: pts[0][0], y: pts[0][1] }] });
          for (const p of pts.slice(1)) await cdp('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: p[0], y: p[1] }] });
          await cdp('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
        } else {
          await cdp('Input.dispatchMouseEvent', { type: 'mouseMoved', x: pts[0][0], y: pts[0][1] });
          await cdp('Input.dispatchMouseEvent', { type: 'mousePressed', x: pts[0][0], y: pts[0][1], button: 'left', clickCount: 1 });
          for (const p of pts.slice(1)) await cdp('Input.dispatchMouseEvent', { type: 'mouseMoved', x: p[0], y: p[1], button: 'left', buttons: 1 });
          const u = pts[pts.length - 1];
          await cdp('Input.dispatchMouseEvent', { type: 'mouseReleased', x: u[0], y: u[1], button: 'left', clickCount: 1 });
        }
        await dorme(120);
      };
      const linha = (a, b, n) => Array.from({ length: n + 1 }, (_, k) => [a[0] + (b[0] - a[0]) * k / n, a[1] + (b[1] - a[1]) * k / n]);
      /* abre uma pergunta montada (preparo por JS; a interacao e por toque real) */
      const pergunta = async (materia, ui, li, expr) => { await js("fecharLicao();fecharFolha();usarMateria('" + materia + "');fecharFolha();document.querySelector('#modal').classList.remove('on');S.faixa='f910';abrirLicao(" + ui + ',' + li + ");LIC.etapa='questao';LIC.i=0;LIC.qs=[" + expr + "];pintarLicao();0"); await dorme(300); };

      /* (0) MAPA (revisao de 08/11/2026). (a) tocar num objeto trancado ou a frente nao rola a cena de lado (scrollLeft fica 0; antes
         o foco rolava ate 25 px e abria uma faixa vazia); (b) o rotulo do objeto atual nunca fica embaixo do personagem e nao vira uma palavra
         por linha (elementFromPoint nos cantos do rotulo, so o personagem e o rotulo recebendo toque no teste) */
      if (toqueTela) {
        let tocados = 0; const desliza = [];
        for (const mat of ['mat', 'pt', 'en']) for (const n of [1, 4, 7, 10]) {
          await js("(()=>{fecharLicao();fecharFolha();document.querySelector('#modal').classList.remove('on');usarMateria('" + mat + "');fecharFolha();S.feitas={};UNITS.forEach(u=>{if(u.n<" + n + "){u.lessons.forEach(l=>S.feitas[l.id]=3);S.feitas['rev'+MATERIA+u.n]=3;}});salvar();renderTrilha();0})()"); await dorme(250);
          for (const li of [1, 3, 5]) {
            const sel = '#etapa-' + n + ' .no[data-li="' + li + '"] .bt';
            if (!(await js('!!document.querySelector(' + JSON.stringify(sel) + ')'))) continue;
            await toque(sel, 'objeto trancado ' + mat + n + ' ' + li); tocados++; await dorme(120);
            const sl = await js("(()=>{const c=document.querySelector('#etapa-" + n + " .cena');return c.scrollLeft+c.scrollTop})()");
            if (sl) desliza.push(mat + n + ':' + li + '=' + sl);
          }
        }
        if (desliza.length) problemas.push(rot + ' a cena rolou de lado depois do toque: ' + desliza.slice(0, 8).join(' '));
        const rotRuins = await js(`(()=>{const out=[];const st=document.createElement('style');st.textContent='#tela .trilha *{pointer-events:none!important} #tela .voce,#tela .voce *,#tela .no.atual .rot,#tela .no.atual .rot *{pointer-events:auto!important}';
          ['mat','pt','en'].forEach(m=>{usarMateria(m);fecharFolha();for(let n=1;n<=10;n++)for(const li of [0,2,4]){S.feitas={};UNITS.forEach(u=>{if(u.n<n){u.lessons.forEach(l=>S.feitas[l.id]=3);S.feitas['rev'+MATERIA+u.n]=3;}});UNITS[n-1].lessons.slice(0,li).forEach(l=>S.feitas[l.id]=3);
            Object.keys(NO_ANTES).forEach(k=>delete NO_ANTES[k]);renderTrilha();document.head.appendChild(st);
            const no=document.querySelector('.no.atual'),rot=no&&no.querySelector('.rot');if(!rot){out.push(m+n+' sem rotulo');st.remove();continue;}rot.scrollIntoView({block:'center'});
            const b=rot.getBoundingClientRect();[[b.left+12,b.top+6],[b.right-12,b.top+6],[b.left+12,b.bottom-6],[b.right-12,b.bottom-6],[b.left+b.width/2,b.top+b.height/2]].forEach(p=>{const t=document.elementFromPoint(p[0],p[1]);if(!(t&&(t===rot||rot.contains(t))))out.push(m+n+':'+li+' "'+rot.textContent+'" coberto por '+(t?String(t.className.baseVal!==undefined?t.className.baseVal:t.className):'nada'));});
            if(b.width<80)out.push(m+n+':'+li+' "'+rot.textContent+'" estreito '+Math.round(b.width));st.remove();}});
          S.feitas={};salvar();usarMateria('mat');fecharFolha();renderTrilha();return out;})()`);
        if (rotRuins.length) problemas.push(rot + ' rotulo do objeto atual: ' + [...new Set(rotRuins)].slice(0, 6).join(' | '));
        feito.push(rot + ': mapa, ' + tocados + ' toques em objetos trancados sem a cena rolar de lado; rotulo do objeto atual livre do personagem nas 30 etapas');
        coleta(rot + ' mapa');
      }

      const centro = (sel) => js("(()=>{const e=document.querySelector(" + JSON.stringify(sel) + ");const r=e.getBoundingClientRect();return [r.left+r.width/2,r.top+r.height/2]})()");

      /* (4) tocar objeto e depois tocar a cesta que ja tem 1 item: entra e fica (antes a troca oscilava) */
      await pergunta('mat', 3, 0, "comVerbo(inp('6 bolinhas repartidas igualmente em 2 grupos. Quantas em cada grupo?',3),UNITS[3].lessons[0])");
      const cestaN = (c) => js("document.querySelector('.cesta[data-c=\"" + c + "\"] .cesta-n').textContent");
      await toque('.obj[data-i="0"]', 'cesta'); await toque('.cesta[data-c="0"]', 'cesta');
      await toque('.obj[data-i="1"]', 'cesta'); await toque('.cesta[data-c="0"]', 'cesta com 1 item');
      await dorme(300);
      const c1 = await cestaN(0); await dorme(300); const c1b = await cestaN(0);
      const soltos1 = await js("document.querySelectorAll('.obj.solto').length");
      if (c1 !== '2' || c1b !== '2' || soltos1 !== 4) problemas.push(rot + ' cesta com 1 item: ' + JSON.stringify({ c1, c1b, soltos1 }));
      await toque('.obj[data-i="2"]', 'cesta'); await toque('.cesta[data-c="0"]', 'cesta com 2 itens');
      if (await cestaN(0) !== '3') problemas.push(rot + ' cesta com 2 itens nao recebeu o 3o');
      await toque('.cesta[data-c="0"]', 'tirar da cesta');           /* sem objeto escolhido: o ultimo sai */
      const c3 = await cestaN(0);
      if (c3 !== '2') problemas.push(rot + ' tocar a cesta sem objeto escolhido devia tirar o ultimo: ' + c3);
      { const o = await centro('.obj.solto'), c = await centro('.cesta[data-c="1"]'); await arrasta(linha(o, c, 8)); }
      await dorme(500);
      const c4 = await cestaN(1);
      if (c4 !== '1') problemas.push(rot + ' arrastar ate a cesta 1 (o clique depois do arraste nao pode tirar o objeto): ' + c4);
      await foto('cesta-' + rot);
      feito.push(rot + ': objeto e depois cesta com 1 e 2 itens entra e fica; cesta sem objeto escolhido devolve o ultimo; arraste nao desfaz');
      coleta(rot + ' cesta');

      /* (1) ligar: traco de verdade (esquerda para direita e direita para esquerda) e dois toques */
      await pergunta('mat', 1, 0, "(()=>{const q=montarLigar([inp('2 + 3 = ?',5),inp('4 + 4 = ?',8),inp('1 + 6 = ?',7)].map(parDe));q.dir=[2,0,1];return q})()");
      { const a = await centro('.lig-a[data-i="0"]'), b = await centro('.lig-b[data-j="1"]'); await arrasta(linha(a, b, 10)); }      /* errado de proposito */
      const errado = await js("JSON.stringify(VER.lig)");
      { const a = await centro('.lig-a[data-i="0"]'), b = await centro('.lig-b[data-j="0"]'); await arrasta(linha(a, b, 10)); }      /* refaz: troca o traco */
      await toque('.lig-a[data-i="1"]', 'ligar 1o toque'); await toque('.lig-b[data-j="1"]', 'ligar 2o toque');
      { const b = await centro('.lig-b[data-j="2"]'), a = await centro('.lig-a[data-i="2"]'); await arrasta(linha(b, a, 10)); }
      const lg = await js("({lig:JSON.stringify(VER.lig),ok:LIC.resp===LIC.qs[0].answer,acao:document.querySelector('#acao').disabled,linhas:document.querySelectorAll('#ligar-linhas .linha').length})");
      if (errado !== '{"0":1}' || lg.lig !== '{"0":0,"1":1,"2":2}' || !lg.ok || lg.acao || lg.linhas !== 3) problemas.push(rot + ' ligar: ' + JSON.stringify({ errado, lg }));
      await foto('ligar-' + rot);
      await toque('#acao', 'Verificar do ligar', false); await dorme(150);
      const lgc = await js("({ok:document.querySelector('.pe').classList.contains('certo'),certas:document.querySelectorAll('.lig-a.certa').length})");
      if (!lgc.ok || lgc.certas !== 3) problemas.push(rot + ' ligar conferido: ' + JSON.stringify(lgc));
      await foto('ligar-certo-' + rot);
      feito.push(rot + ': ligar com traco nos dois sentidos, troca de traco e dois toques; Verificar marca as 3 certas');
      coleta(rot + ' ligar');

      /* (2) tracar: sair do caminho nao escolhe; tocar na resposta nao escolhe (o verbo e tracar); seguir o caminho ate o fim escolhe */
      await pergunta('mat', 1, 0, "(()=>{const q=mc('Quanto é 2 + 2?','4',['3','5']);q.options=['3','4','5'];q.verbo='tracar';return q})()");
      const caminho = (k) => js("(()=>{const svg=document.querySelector('.tracar-svg');svg.scrollIntoView({block:'center'});const r=svg.getBoundingClientRect();return caminhosTracar(LIC.qs[0].options.length)[" + k + "].map(p=>[r.left+p[0]/TRACO.W*r.width,r.top+p[1]/TRACO.H*r.height])})()");
      const c0 = await caminho(1);
      await arrasta([c0[0]].concat(linha(c0[0], [c0[0][0] + 120, c0[0][1] + 40], 8)));   /* sai do caminho */
      const tr1 = await js("({resp:LIC.resp,txt:document.querySelector('#contagem').textContent})");
      await toque('.tracar-fim[data-k="1"]', 'tocar na resposta do tracar', false);
      const tr2 = await js("({resp:LIC.resp,txt:document.querySelector('#contagem').textContent,destaca:[...document.querySelectorAll('.caminho.destaca')].map(c=>c.dataset.k).join(),estrela:document.querySelector('.tracar-estrela').classList.contains('chama'),cores:new Set([...document.querySelectorAll('.caminho')].map(c=>getComputedStyle(c).stroke)).size})");
      /* revisao de 08/11/2026: tocar na resposta destaca o caminho DELA e chama a estrela de partida; cada caminho com a sua cor */
      if (tr2.destaca !== '1' || !tr2.estrela || tr2.cores !== 3) problemas.push(rot + ' tracar: tocar na resposta deveria destacar o caminho 1 e a estrela, com 3 cores ' + JSON.stringify(tr2));
      const c1p = await caminho(1);
      await arrasta(c1p);
      const tr3 = await js("({resp:LIC.resp,acao:document.querySelector('#acao').disabled,sel:document.querySelector('.tracar-fim.sel')&&document.querySelector('.tracar-fim.sel').dataset.k})");
      if (tr1.resp != null || !/Saiu do caminho|Siga o caminho/.test(tr1.txt) || tr2.resp != null || !/Use o dedo/.test(tr2.txt) || tr3.resp !== '4' || tr3.acao || tr3.sel !== '1') problemas.push(rot + ' tracar: ' + JSON.stringify({ tr1, tr2, tr3 }));
      const c2p = await caminho(2);
      await arrasta(c2p);
      const tr4 = await js("LIC.resp");
      if (tr4 !== '5') problemas.push(rot + ' tracar de novo para mudar: ' + tr4);
      await foto('tracar-' + rot);
      feito.push(rot + ': tracar segue o caminho com ' + (toqueTela ? 'o dedo' : 'o mouse') + ' (' + c1p.length + ' pontos); sair do caminho e tocar na resposta nao escolhem; tracar de novo troca');
      coleta(rot + ' tracar');

      /* (3) arrastar a resposta ate o balao (e tocar-tocar troca) */
      await pergunta('pt', 0, 0, "(()=>{const q=mc('Qual delas é uma vogal?','A',['B','C']);q.options=['B','A','C'];q.verbo='arrastar-resposta';return q})()");
      { const a = await centro('.carta-r[data-k="0"]'), b = await centro('#alvo-r'); await arrasta(linha(a, b, 8)); }
      const ar1 = await js("LIC.resp");
      await toque('.carta-r[data-k="1"]', 'carta'); await toque('#alvo-r', 'balao');
      const ar2 = await js("({resp:LIC.resp,no:document.querySelectorAll('#alvo-r .carta-r').length,monte:document.querySelectorAll('#cartas-r .carta-r').length})");
      if (ar1 !== 'B' || ar2.resp !== 'A' || ar2.no !== 1 || ar2.monte !== 2) problemas.push(rot + ' arrastar a resposta: ' + JSON.stringify({ ar1, ar2 }));
      await foto('arrasta-resposta-' + rot);
      feito.push(rot + ': arrastar a resposta ate o balao e trocar com dois toques');
      coleta(rot + ' arrastar resposta');

      /* (6) muro: no modo 'pago' sem conta, tocar de verdade no no da fase mostra a tela Assinatura e a fase nao abre; no 'aberto' abre */
      await js("fecharLicao();fecharFolha();usarMateria('mat');fecharFolha();document.querySelector('#modal').classList.remove('on');renderTrilha();MURO.modo='pago';0"); await dorme(300);
      const NO = '#tela .bt[data-u="0"][data-l="0"]';
      await toque(NO, 'no da fase (pago)'); await dorme(1600);
      const mp = await js("(()=>{const p=document.querySelector('#perfil');const t=p.innerText;const e=document.querySelector('#ass-entrar'),a=document.querySelector('#ass-assinar');" +
        "return {tela:p.classList.contains('on')&&p.dataset.tela==='assinatura',licao:document.querySelector('#licao').classList.contains('on'),mensal:t.includes(reais(PLANOS.mensal.centavos)),anual:t.includes(reais(PLANOS.anual.centavos))," +
        "breve:/Disponível em breve/.test(t),desab:!!e&&!!a&&e.disabled&&a.disabled,gratis:/teste\\s+gr[aá]tis/i.test(document.body.innerText)}})()");
      if (!mp.tela || mp.licao || !mp.mensal || !mp.anual || !mp.breve || !mp.desab || mp.gratis) problemas.push(rot + ' muro pago: ' + JSON.stringify(mp));
      await foto('assinatura-' + rot);
      await toque('#ass-volta', 'voltar da assinatura'); await dorme(300);
      await js("MURO.modo='aberto';renderTrilha();0"); await dorme(300);
      await toque(NO, 'no da fase (aberto)'); await dorme(1600);
      const ma = await js("({licao:document.querySelector('#licao').classList.contains('on'),assin:document.querySelector('#perfil').dataset.tela==='assinatura'&&document.querySelector('#perfil').classList.contains('on')})");
      if (!ma.licao || ma.assin) problemas.push(rot + ' muro aberto: ' + JSON.stringify(ma));
      await js("fecharLicao();0");
      /* secao Plano na area do responsavel (sem senha neste aparelho de teste) */
      await js("telaResponsavel();document.querySelector('#plano-modo').scrollIntoView({block:'center'});0"); await dorme(200);
      const pl = await js("(()=>{const t=document.querySelector('#perfil').innerText;return {modo:document.querySelector('#plano-modo').textContent,mensal:t.includes(reais(PLANOS.mensal.centavos)),anual:t.includes(reais(PLANOS.anual.centavos))}})()");
      if (pl.modo !== 'Aberto' || !pl.mensal || !pl.anual) problemas.push(rot + ' secao Plano: ' + JSON.stringify(pl));
      await foto('plano-' + rot);
      await js("fecharPerfil2();0");
      feito.push(rot + ': muro pago tocando no no da fase mostra Assinatura (' + (mp.mensal && mp.anual ? 'precos de PLANOS' : '?') + ', Entrar e Assinar desabilitados) e nao abre a fase; aberto abre; secao Plano no responsavel');
      coleta(rot + ' muro');

      /* (7) som 'solta': agradavel (tom que desce, sem chiado): pico espectral abaixo de 1,2 kHz, energia acima de 4 kHz abaixo de 2%, ate 0,24 s, pico ate -6 dBFS */
      if (rot === telas[0][0]) {
        const so = await js(`(async()=>{const x=(await sfxRender('solta',0)).amostras;let pico=0,ult=0;for(let i=0;i<x.length;i++){const v=Math.abs(x[i]);if(v>pico)pico=v;if(v>.01)ult=i;}
          const N=4410,w=i=>.5-.5*Math.cos(2*Math.PI*i/(N-1));const pot=f=>{let re=0,im=0;for(let i=0;i<N&&i<x.length;i++){const v=x[i]*w(i),a=2*Math.PI*f*i/44100;re+=v*Math.cos(a);im-=v*Math.sin(a);}return re*re+im*im};
          let best=0,bf=0,alto=0,tot=0;for(let f=50;f<=12000;f+=25){const p=pot(f);tot+=p;if(f>4000)alto+=p;if(p>best){best=p;bf=f;}}
          return {pico:pico,dur:ult/44100,bf:bf,alto:alto/tot}})()`);
        if (!(so.pico > .004) || so.pico > .5012 || so.dur > .24 || so.bf > 1200 || so.alto > .02) problemas.push(rot + " som 'solta': " + JSON.stringify(so));
        feito.push("som 'solta': pico espectral " + so.bf + ' Hz, ' + (so.alto * 100).toFixed(2) + '% acima de 4 kHz, ' + Math.round(so.dur * 1000) + ' ms, pico ' + (20 * Math.log10(so.pico)).toFixed(1) + ' dBFS');
      }

      /* (5) 20 objetos: cabem sem rolar e as alternativas ficam acima do rodape */
      if (toqueTela) {
        await pergunta('mat', 0, 0, "comVerbo(mc('Quantas bolinhas tem aqui?',20,[19,21,18],{figure:dots(20)}),UNITS[0].lessons[0])");
        await js("LIC.qs[0].__reduzido=true;0");
        const medir = (rolarAoFim) => js("(()=>{const lc=document.querySelector('.lc-corpo');lc.scrollTop=" + (rolarAoFim ? 'lc.scrollHeight' : '0') + ";const pe=document.querySelector('.pe').getBoundingClientRect();const cena=document.querySelector('.cena-obj'),cr=cena.getBoundingClientRect();" +
          "const objs=[...document.querySelectorAll('.obj')].map(o=>o.getBoundingClientRect());const cortados=objs.filter(r=>r.bottom>cr.bottom+1||r.top<cr.top-1).length,atras=objs.filter(r=>r.bottom>pe.top+1).length;" +
          "const alts=[...document.querySelectorAll('.alt')].map(a=>{const r=a.getBoundingClientRect();const t=document.elementFromPoint(r.left+r.width/2,r.top+r.height/2);return {b:Math.round(r.bottom),livre:!!t&&(t===a||a.contains(t))}});" +
          "return {pe:Math.round(pe.top),cortados,atras,rola:cena.scrollHeight>cena.clientHeight+1,alts,obj:Math.round(objs[0].width),altsOk:alts.every(a=>a.b<=pe.top+1&&a.livre)}})()");
        let m = await medir(false);
        /* a cena mede o espaço e escolhe o tamanho do objeto depois de pintar: com a máquina carregada isso pode atrasar; mede de novo uma vez */
        if (!m.altsOk && rot !== '320x568') { await dorme(800); m = await medir(false); }
        if (m.cortados || m.rola) problemas.push(rot + ' 20 objetos: ' + m.cortados + ' cortados pela cena, area interna rola=' + m.rola);
        await foto('20objetos-' + rot);
        if (rot === '320x568' && !m.altsOk) {
          /* telefone muito baixo: com o menor objeto (36 px) nao cabe; quem rola e a pagina, e no fim da rolagem tudo fica livre acima do rodape */
          const f = await medir(true);
          if (!f.altsOk || f.cortados || f.rola) problemas.push(rot + ' 20 objetos (rolando a pagina): ' + JSON.stringify(f));
          await foto('20objetos-' + rot + '-rolado');
          feito.push(rot + ': 20 objetos de ' + m.obj + ' px; a pagina rola e as alternativas ficam livres acima do rodape no fim (sem area interna que rola, nada cortado)');
        } else {
          if (!m.altsOk || m.atras) problemas.push(rot + ' 20 objetos: algo atras do rodape sem rolar ' + JSON.stringify(m));
          feito.push(rot + ': 20 objetos cabem sem rolar (objeto de ' + m.obj + ' px), alternativas acima do rodape');
        }
      }
      coleta(rot + ' 20 objetos');
    }
  } catch (e) { problemas.push('erro: ' + (e && e.stack || e)); }
  limpa();
  /* o perfil temporario do Chrome (cerca de 120 MB com o cache de arte e voz) sai junto, como na fumaca: antes ficava um por rodada na pasta temporaria */
  await new Promise((r) => setTimeout(r, 300)); try { fs.rmSync(perfil, { recursive: true, force: true }); } catch (e) {}
  feito.forEach((f) => console.log('  ok  ' + f));
  if (problemas.length) { console.log('\nFALHOU (' + problemas.length + '):'); problemas.forEach((p) => console.log('  - ' + p)); process.exit(1); }
  console.log('\nOK: toque.js'); process.exit(0);
}
main();
