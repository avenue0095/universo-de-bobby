#!/usr/bin/env node
'use strict';
/* Mapa como mundo (1C): etapa N trancada ate a revisao da N-1 (decisao do Filipe, 24/10), proxima() aponta a revisao pendente,
   objetos do cenario (HOTSPOTS) com 6 recortes por etapa dentro da imagem e posicao do no dentro da cena.   Uso: node testes/mapa.js */
const A = require('assert');
const { carregarApp } = require('./lib/carregar.js');
const { teste, resumo } = require('./lib/mini.js');
(async () => {
  const a = carregarApp(4, {}); a.avaliar("novoPerfil('Zeca','#12A06E')");
  await teste('1. trancar: a 1a fase da etapa 2 so abre depois da revisao da etapa 1; a fase seguinte so depois da anterior', () => {
    a.avaliar("usarMateria('mat');S.feitas={}");
    A.strictEqual(a.avaliar('liberada(0,0)'), true);
    A.strictEqual(a.avaliar('liberada(1,0)'), false);
    a.avaliar("UNITS[0].lessons.forEach(l=>S.feitas[l.id]=3)");
    A.strictEqual(a.avaliar('liberada(1,0)'), false, 'etapa 2 abriu sem a revisao da 1');
    A.deepStrictEqual(JSON.parse(JSON.stringify(a.avaliar('proxima()'))), [0, 5], 'proxima deveria apontar a revisao da etapa 1');
    A.strictEqual(a.avaliar('tituloDaProxima(proxima())'), 'Revisão da etapa 1');
    a.avaliar("S.feitas['revmat1']=3");
    A.strictEqual(a.avaliar('liberada(1,0)'), true);
    A.deepStrictEqual(JSON.parse(JSON.stringify(a.avaliar('proxima()'))), [1, 0]);
    A.strictEqual(a.avaliar('liberada(1,1)'), false);
    A.strictEqual(a.avaliar('TRANCAR_ETAPAS'), true);
  });
  await teste('2. objetos do cenario: etapa 1 dos 3 planetas com 6 recortes dentro da imagem, cada um com area util, e nos dentro da cena', () => {
    ['mat', 'pt', 'en'].forEach((m) => {
      const hs = a.avaliar('JSON.parse(JSON.stringify(HOTSPOTS))')[m][1];
      A.strictEqual(hs.length, 6, m);
      hs.forEach((r) => { A.ok(r[0] >= 0 && r[1] >= 0 && r[2] <= 1 && r[3] <= 1 && r[2] > r[0] && r[3] > r[1], m + ' ' + r); A.ok((r[2] - r[0]) >= .12 && (r[3] - r[1]) >= .1, 'recorte pequeno ' + m + ' ' + r); });
      a.avaliar("usarMateria('" + m + "')");
      for (let li = 0; li < 6; li++) { const p = a.avaliar('posNo(UNITS[0],' + li + ')'); A.ok(p[0] > -5 && p[0] < 105 && p[1] > 0 && p[1] <= 100, m + ' no ' + li + ' ' + p); }
      A.strictEqual(a.avaliar('hotspotsDe("' + m + '",2)'), null, 'etapa 2 nao tem recorte (mantem a revelacao de baixo para cima)');
    });
  });
  await teste('3. fim de fase no mapa: o cartao tem estrelas, uma linha, um botao Continuar e nenhum modal', () => {
    a.avaliar("usarMateria('mat');S.feitas={};MAPA.fim={ui:0,li:0,est:3,perfeita:true,acertos:8,base:8,ganho:110,completouMundo:false,bloco:null,fala:'Fase perfeita!',extraHTML:''}");
    const h = a.avaliar('fimCenaHTML(MAPA.fim)');
    A.ok(/fim-estrelas/.test(h) && /8 de 8 perguntas, 110 moedas/.test(h) && /id="fim-continuar"/.test(h) && !/class="modal/.test(h));
    a.avaliar('MAPA.fim=null');
  });
  await teste('4. todo script que abre o Chrome lanca com --mute-audio (nenhum teste toca som nos alto-falantes)', () => {
    const fs = require('fs'), path = require('path');
    const dir = path.join(__dirname);
    fs.readdirSync(dir).filter((f) => f.endsWith('.js')).forEach((f) => {
      const t = fs.readFileSync(path.join(dir, f), 'utf8');
      if (/--headless|--remote-debugging-port|spawn\(CHROME/.test(t)) A.ok(/--mute-audio/.test(t), f + ' abre o Chrome sem --mute-audio');
    });
  });
  resumo('mapa.js');
})();
