#!/usr/bin/env node
'use strict';
/* 1F · editor em camadas (REQUISITO DO FILIPE, 08/11/2026): vários acessórios ao mesmo tempo (cabeça + rosto + pescoço + costas + mão) e
   cada acessório em TODAS as poses do Bobby, por composição em camadas com âncora por pose (nunca uma imagem por combinação).
   O teste percorre TODAS as combinações válidas em TODAS as poses.   Uso: node testes/camadas.js */
const fs = require('fs');
const path = require('path');
const A = require('assert');
const { carregarApp } = require('./lib/carregar.js');
const { teste, resumo } = require('./lib/mini.js');
const man = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'assets', 'manifesto.json'), 'utf8')).itens;
const ATIVOS = {}; Object.keys(man).forEach((k) => { ATIVOS[k] = [man[k].a, man[k].w, man[k].h]; });
const novo = () => { const a = carregarApp(4); a.avaliar('ATIVOS=' + JSON.stringify(ATIVOS)); a.avaliar("novoPerfil('Zeca','#12A06E')"); return a; };
const J = (x) => JSON.parse(JSON.stringify(x));

(async () => {
  const a = novo();
  const POSES = J(a.avaliar('Object.keys(ANCORAS)'));
  const SL = J(a.avaliar('SLOTS'));
  const POR = {}; SL.forEach((s) => { POR[s] = J(a.avaliar('itensDoSlot(' + JSON.stringify(s) + ').filter(temArteDoItem)')); });

  await teste('1. toda pose e expressao do Bobby (as 12 poses, a 2a da caminhada e as 8 expressoes) tem ancora para os 5 slots', () => {
    const usadas = J(a.avaliar('Object.values(BOBBY).concat(["bobby-p05b"])'));
    usadas.forEach((p) => A.ok(POSES.indexOf(p) >= 0, 'pose sem ancora: ' + p));
    POSES.forEach((p) => ['cab', 'olho', 'pesc', 'cost', 'mao'].forEach((k) => A.ok(Array.isArray(a.avaliar('ANCORAS[' + JSON.stringify(p) + '].' + k)), p + ' sem ' + k)));
    A.ok(POSES.length >= 21, 'poses: ' + POSES.length);
  });
  await teste('2. os 7 looks de hoje viraram itens de camada; 5 slots com pelo menos 2 itens cada; todo item tem arte (imagem ou SVG)', () => {
    ['explorador', 'bone', 'oculos', 'lenco', 'capa', 'capacete', 'coroa'].forEach((id) => A.ok(a.avaliar('!!VESTIVEIS[' + JSON.stringify(id) + ']'), id));
    SL.forEach((s) => A.ok(POR[s].length >= 2, s + ': ' + POR[s].length));
  });
  await teste('3. TODAS as combinacoes validas em TODAS as poses: base da pose + uma camada por item, dentro do quadro, na ordem certa, sem imagem por combinacao', () => {
    const combos = [[]];
    SL.forEach((s) => { const n = []; combos.forEach((c) => { n.push(c.concat([null])); POR[s].forEach((id) => n.push(c.concat([id]))); }); combos.length = 0; combos.push(...n); });
    const r = J(a.avaliar(`(()=>{const combos=${JSON.stringify(combos)},poses=${JSON.stringify(POSES)},erros=[];let n=0,camadas=0;
      const imgs=new Set();
      combos.forEach(c=>{const L={};SLOTS.forEach((s,i)=>{if(c[i])L[s]=c[i];});
        poses.forEach(p=>{n++;const h=bobbyEmCamadas(p,'',L,'');const vest=c.filter(Boolean);
          if(!vest.length){if(h!==null)erros.push('sem item deveria ficar so a pose '+p);return;}
          if(!h){erros.push('nao montou '+p+' '+vest);return;}
          (h.match(/data-arte="([^"]+)"|src="[^"]*\\/([^/"]+)\\.webp"/g)||[]).forEach(x=>imgs.add(x));
          if((h.match(/camada-base/g)||[]).length!==1)erros.push('base '+p);
          vest.forEach(id=>{const k=(h.match(new RegExp('data-item="'+id+'"','g'))||[]).length;if(k!==1)erros.push(id+' aparece '+k+'x em '+p);
            const cx=caixaDaCamada(p,id);camadas++;
            const retrato=/^bobby-e/.test(p);if(!(cx.w>0&&cx.h>0&&cx.l>-30&&cx.l+cx.w<130&&cx.t>-45&&(retrato?cx.t<100:cx.t+cx.h<135)))erros.push(id+' fora do quadro em '+p+' '+JSON.stringify(cx));});
          const ordem=(h.match(/camada-(costas|pescoco|rosto|cabeca|mao)/g)||[]).map(x=>x.slice(7));
          const esp=SLOTS.filter((s,i)=>c[i]);if(ordem.join()!==esp.join())erros.push('ordem '+p+' '+ordem);
        });});
      return {n:n,camadas:camadas,erros:erros.slice(0,10),nErros:erros.length,imgs:[...imgs]};})()`));
    console.log('          ' + combos.length + ' combinacoes x ' + POSES.length + ' poses = ' + r.n + ' montagens, ' + r.camadas + ' camadas conferidas');
    A.strictEqual(r.nErros, 0, JSON.stringify(r.erros));
    A.ok(r.n >= combos.length * 21);
    /* nunca imagem de look inteiro (looks/item-*) nem uma imagem por combinacao: so poses, expressoes e as 4 artes de item */
    const proib = r.imgs.filter((x) => /looks\/|item-(bone|coroa|oculos|lenco|capa|capacete|base)/.test(x));
    A.deepStrictEqual(proib, [], 'imagem de look inteiro: ' + proib);
  });
  await teste('3b. no retrato (expressoes) o que passa da borda de baixo e cortado pelo CSS (capa e mochila viram so a gola atras dos ombros)', () => {
    const css = fs.readFileSync(path.join(__dirname, '..', 'src', 'interface', 'style.css'), 'utf8');
    A.ok(/\.bobby-camadas\[data-vista\^="bobby-e"\]\{[^}]*clip-path:inset\(-[0-9]+% -[0-9]+% 0 -[0-9]+%\)/.test(css), 'falta o corte da borda de baixo no retrato');
  });
  await teste('4. vestir 5 acessorios ao mesmo tempo; aparecem em Oi, Comemora, Caminha, Pensa, nas expressoes, no topo e no mapa', () => {
    const b = novo();
    b.avaliar("S.comprado=['bone','oculos','lenco','capa','bandeira'];['bone','oculos','lenco','capa','bandeira'].forEach(id=>vestir(VESTIVEIS[id].slot,id))");
    A.deepStrictEqual(J(b.avaliar('vestidos(S.look)')), { cabeca: 'bone', rosto: 'oculos', pescoco: 'lenco', costas: 'capa', mao: 'bandeira' });
    ['oi', 'comemora', 'anda', 'pensa', 'feliz', 'radiante', 'curioso', 'concentrado', 'tranquilo', 'aponta', 'le', 'tchau', 'descansa'].forEach((e) => {
      const h = b.avaliar("MASC('" + e + "')");
      ['bone', 'oculos', 'lenco', 'capa', 'bandeira'].forEach((id) => A.ok(h.indexOf('data-item="' + id + '"') >= 0, id + ' nao aparece em ' + e));
    });
    A.ok(/data-item="bone"/.test(b.avaliar('retratoPers()')), 'topo sem o bone');
    const m = b.avaliar('vocePecas()');
    A.ok((m.match(/data-item="capa"/g) || []).length >= 3, 'mapa: parado e andando com a capa');
    b.avaliar("vestir('cabeca','coroa')"); A.strictEqual(b.avaliar('S.look.cabeca'), 'bone', 'vestiu item que nao tem');
    b.avaliar("vestir('cabeca','')"); A.ok(!b.avaliar('S.look.cabeca') && b.avaliar('S.look.rosto') === 'oculos', 'tirar a cabeca nao mexe no resto');
  });
  await teste('5. migracao dos 3 slots antigos (chapeu, rosto, pescoco com capa) para os 5 novos; quem comprou continua dono', () => {
    const r = J(a.avaliar("(()=>{const s=estadoDe({look:{chapeu:'bone',rosto:'oculos',pescoco:'capa'},comprado:['bone','oculos','capa']});return {l:s.look,cap:temItemEm(s,'capa')};})()"));
    A.strictEqual(r.l.cabeca, 'bone'); A.strictEqual(r.l.rosto, 'oculos'); A.strictEqual(r.l.costas, 'capa'); A.ok(!r.l.chapeu && !r.l.pescoco);
    A.strictEqual(r.cap, true, 'quem comprou a capa continua dono');
    const l2 = J(a.avaliar("estadoDe({look:{chapeu:'xyz',mao:'__proto__',costas:'bone'}}).look"));
    A.ok(!l2.cabeca && !l2.mao && !l2.costas, 'item invalido ou no slot errado entrou: ' + JSON.stringify(l2));
  });
  await teste('6. experimentar nao cobra nem veste; comprar e um 2o toque', () => {
    const b = novo();
    b.avaliar("S.moedas=1000;provando='coroa';S.exploracao={dias:40,ultimo:''};S.feitas={}");
    A.ok(/data-item="coroa"/.test(b.avaliar('MASCB("bobby-p01","",lookDoPalco())')), 'prova nao aparece no palco');
    A.strictEqual(b.avaliar('S.moedas'), 1000); A.ok(!b.avaliar('S.look.cabeca'));
    A.strictEqual(b.avaliar("podeComprar('coroa').motivo"), 'portao', 'coroa (900) pede 3 etapas');
    A.strictEqual(b.avaliar("comprarItem('bone').ok"), true); A.strictEqual(b.avaliar('S.moedas'), 800);
  });
  resumo('camadas.js');
})();
