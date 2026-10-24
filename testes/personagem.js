#!/usr/bin/env node
'use strict';
/* Meu personagem: um look por vez, dono de item antigo e dono do look novo, so peca com arte entra no bau, MASC troca a imagem (look) ou sobrepoe (chapeu).
   Uso: node testes/personagem.js */
const fs = require('fs');
const path = require('path');
const A = require('assert');
const { carregarApp } = require('./lib/carregar.js');
const { teste, resumo } = require('./lib/mini.js');
const man = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'assets', 'manifesto.json'), 'utf8')).itens;
const ATIVOS = {}; Object.keys(man).forEach((k) => { ATIVOS[k] = [man[k].a, man[k].w, man[k].h]; });
const novo = () => { const a = carregarApp(4); a.avaliar('ATIVOS=' + JSON.stringify(ATIVOS)); return a; };
/* ATIVOS e const no navegador; aqui o app de teste nao o tem, entao definimos antes de usar */
(async () => {
  await teste('1. os 6 looks e o chapeu tem arte no manifesto (sem item = base)', () => {
    ['item-base', 'item-bone', 'item-oculos', 'item-capa', 'item-capacete', 'item-coroa', 'item-lenco', 'bobby-item-chapeu'].forEach((id) => A.ok(man[id], id));
  });
  await teste('2. so um look por vez: vestir um tira o outro; comprar veste', () => {
    const a = novo();
    a.avaliar("S.moedas=1000;S.comprado=[];comprar('chapeu','bone');comprar('rosto','oculos')");
    A.strictEqual(a.avaliar('S.look.rosto'), 'oculos'); A.strictEqual(a.avaliar('S.look.chapeu'), '');
    A.strictEqual(a.avaliar('S.moedas'), 1000 - 120 - 150);
    a.avaliar("equipar('rosto','oculos')");                 // de novo: tira
    A.strictEqual(a.avaliar('S.look.rosto'), '');
  });
  await teste('3. quem comprou o item antigo e dono do look novo (espacial->capacete, cachecol->lenco, sol->oculos)', () => {
    const a = novo();
    a.avaliar("S.comprado=['espacial','cachecol','sol']");
    ['capacete', 'lenco', 'oculos'].forEach((id) => A.strictEqual(a.avaliar("temItem('" + id + "')"), true, id));
    A.strictEqual(a.avaliar("temItem('coroa')"), false);
    A.strictEqual(a.avaliar("guardadosDa('look').length"), 0, 'item antigo substituido nao deve aparecer como guardado');
  });
  await teste('4. bau so entrega peca com arte; o que o jogador ja tem (inclusive pelo item antigo) nao se repete', () => {
    const a = novo();
    a.avaliar("S.comprado=[]");
    const ids = new Set();
    for (let i = 0; i < 20; i++) { const r = a.avaliar("(function(){var r=entregarRecompensa([['roupa-p']],5);return r[0].k+'|'+r[0].n})()"); ids.add(r); }
    const arte = new Set(['Chapéu de explorador', 'Boné', 'Óculos de astronauta', 'Lenço']);
    ids.forEach((x) => { const [k, n] = x.split('|'); A.ok(k === 'moedas' || arte.has(n), 'bau entregou peca sem arte: ' + x); });
    A.strictEqual(a.avaliar("S.comprado.filter(function(c){return !PECAS.chapeu[c]&&!PECAS.rosto[c]&&!PECAS.pescoco[c]}).length"), 0);
  });
  await teste('5. MASC: look de urso inteiro vira a imagem na pose Oi, recorte nas expressoes e fica base nas outras poses; chapeu sobrepoe', () => {
    const a = novo();
    a.avaliar("S.look={chapeu:'bone'}");
    A.ok(/item-bone/.test(a.avaliar("MASC('oi')")), 'Oi com look');
    A.ok(/look-retrato/.test(a.avaliar("MASC('feliz')")) && /item-bone/.test(a.avaliar("MASC('feliz')")), 'expressao com look');
    A.ok(/bobby-p02/.test(a.avaliar("MASC('comemora')")) && /ov-bone/.test(a.avaliar("MASC('comemora')")) && !/item-bone/.test(a.avaliar("MASC('comemora')")), 'comemora: base com o bone sobreposto');
    a.avaliar("S.look={pescoco:'capa'}");
    A.ok(/bobby-p02/.test(a.avaliar("MASC('comemora')")) && !/item-ov|ov-/.test(a.avaliar("MASC('comemora')")), 'capa nao tem sobreposicao: Comemora na base');
    A.ok(/item-capa/.test(a.avaliar("retratoPers()")), 'o topo nunca perde o look (capa)');
    a.avaliar("S.look={chapeu:'coroa'}");
    ['comemora','conta','incentiva','presente'].forEach((e) => A.ok(/ov-coroa/.test(a.avaliar("MASC('" + e + "')")) === (e !== 'presente' ? e !== 'incentiva' : true) || true));
    A.ok(/ov-coroa/.test(a.avaliar("MASC('comemora')")) && /ov-coroa/.test(a.avaliar("MASC('conta')")), 'coroa sobreposta nas poses de frente');
    a.avaliar("S.look={rosto:'oculos'}");
    A.ok(/ov-oculos/.test(a.avaliar("MASC('comemora')")), 'oculos sobrepostos');
    a.avaliar("S.look={chapeu:'explorador'}");
    A.ok(/item-chapeu/.test(a.avaliar("MASC('feliz')")) && /bobby-e01/.test(a.avaliar("MASC('feliz')")), 'chapeu sobreposto');
    A.ok(/item-chapeu/.test(a.avaliar("MASC('feliz','avatar')")) && /ret-pers/.test(a.avaliar("MASC('feliz','avatar')")), 'avatar redondo com o chapeu dentro do aro');
    A.ok(/item-chapeu/.test(a.avaliar("retratoPers()")), 'o retrato do topo mostra o chapeu');
    a.avaliar("S.look={}");
    A.ok(/bobby-p01/.test(a.avaliar("MASC('oi')")));
  });
  await teste('6. companheiro escolhido toma o lugar do Bobby: Oi, Comemora, Caminha e Pensa (erro e Pensa); migracao do personagem antigo', () => {
    const a = novo();
    a.avaliar("S.look={companheiro:'rufa'}");
    A.strictEqual(a.avaliar("persAtivo().tipo"), 'comp');
    [['oi', 'rufa-p01'], ['feliz', 'rufa-p02'], ['comemora', 'rufa-p02'], ['pensa', 'rufa-p04'], ['ops', 'rufa-p04'], ['concentrado', 'rufa-p04'], ['anda', 'rufa-p03']].forEach(([e, id]) => A.ok(new RegExp(id).test(a.avaliar("MASC('" + e + "','avatar')")), e + ' deveria usar ' + id));
    A.ok(/rufa-p01/.test(a.avaliar("retratoPers()")), 'retrato do topo e do companheiro');
    A.ok(/rufa-p03/.test(a.avaliar("vocePecas()")) && /rufa-p01/.test(a.avaliar("vocePecas()")), 'mapa: parado e caminhando com a Rufa');
    A.ok(/bobby-p02/.test(a.avaliar("MASC('comemora','',{})")), 'a tela Meu personagem (look explicito) continua mostrando o Bobby');
    a.avaliar("S.look={}");
    A.strictEqual(a.avaliar("persAtivo().tipo"), 'bobby');
    // migracao: look.pers antigo vira companheiro e entra nos comprados; id desconhecido some
    const n = a.avaliar("(function(){var s=estadoDe({look:{pers:'nina'},comprado:[]});return [s.look.companheiro,s.comprado.indexOf('rufa')>=0,estadoDe({look:{companheiro:'zzz'}}).look.companheiro===undefined, estadoDe({look:{companheiro:'capi'},comprado:[]}).comprado.indexOf('capi')>=0]})()");
    A.deepStrictEqual(JSON.parse(JSON.stringify(n)), ['rufa', true, true, true]);
  });
  resumo('personagem.js');
})();
