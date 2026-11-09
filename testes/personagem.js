#!/usr/bin/env node
'use strict';
/* Meu personagem (1F, guarda-roupa em camadas): varios acessorios ao mesmo tempo, dono de item antigo e dono do novo, so peca com arte entra no bau,
   MASC monta a pose com uma camada por acessorio (o teste de todas as combinacoes em todas as poses e testes/camadas.js).
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
  await teste('2. (1F) varios acessorios ao mesmo tempo: comprar nao tira o que ja esta vestido; vestir de novo o mesmo item tira so ele', () => {
    const a = novo();
    a.avaliar("S.moedas=1000;S.comprado=[];comprarItem('bone');vestir('cabeca','bone');comprarItem('oculos');vestir('rosto','oculos')");
    A.strictEqual(a.avaliar('S.look.rosto'), 'oculos'); A.strictEqual(a.avaliar('S.look.cabeca'), 'bone');
    A.strictEqual(a.avaliar('S.moedas'), 1000 - a.avaliar('PRECOS.look.bone') - a.avaliar('PRECOS.look.oculos'));
    a.avaliar("vestir('rosto','')");
    A.strictEqual(a.avaliar('S.look.rosto'), ''); A.strictEqual(a.avaliar('S.look.cabeca'), 'bone');
  });
  await teste('3. (P6) sem legado: item antigo sem arte (festa, sol, espacial) nao entra nem converte; so o catalogo de hoje vale', () => {
    const a = novo();
    const c = JSON.parse(JSON.stringify(a.avaliar("estadoDe({comprado:['festa','sol','espacial','bone','rufa','__x']}).comprado")));
    A.deepStrictEqual(c, ['bone', 'rufa']);
    a.avaliar("S.comprado=['espacial']"); A.strictEqual(a.avaliar("temItem('capacete')"), false);
  });
  await teste('4. bau so entrega acessorio com arte e sem portao; o que o jogador ja tem (inclusive pelo item antigo) nao se repete', () => {
    const a = novo();
    a.avaliar("S.comprado=[]");
    for (let i = 0; i < 20; i++) {
      const r = JSON.parse(JSON.stringify(a.avaliar("entregarRecompensa([['roupa-p']],5)[0]")));
      if (r.k === 'moedas') continue;
      const id = a.avaliar("S.comprado[S.comprado.length-1]");
      A.ok(a.avaliar("temArteDoItem(" + JSON.stringify(id) + ")&&!portaoDe(" + JSON.stringify(id) + ")"), 'bau entregou ' + id);
    }
    A.strictEqual(a.avaliar("S.comprado.length"), a.avaliar("new Set(S.comprado).size"), 'repetiu peca');
  });
  await teste('5. (1F) MASC: o acessorio aparece por camada em TODAS as poses (nunca a imagem do look inteiro); sem nada vestido fica a pose', () => {
    const a = novo();
    a.avaliar("S.comprado=['bone','capa','explorador'];S.look={cabeca:'bone'}");
    ['oi', 'comemora', 'anda', 'pensa', 'feliz', 'aponta', 'descansa'].forEach((e) => {
      const h = a.avaliar("MASC('" + e + "')");
      A.ok(/ov-bone/.test(h) && !/looks\/item-/.test(h), e + ': ' + h.slice(0, 120));
    });
    A.ok(/bobby-p02/.test(a.avaliar("MASC('comemora')")), 'comemora usa a pose de verdade');
    a.avaliar("S.look={costas:'capa'}");
    A.ok(/data-item="capa"/.test(a.avaliar("MASC('comemora')")) && /data-item="capa"/.test(a.avaliar("retratoPers()")), 'capa em comemora e no topo');
    a.avaliar("S.look={cabeca:'explorador'}");
    A.ok(/bobby-item-chapeu/.test(a.avaliar("MASC('feliz','avatar')")), 'avatar com o chapeu');
    a.avaliar("S.look={}");
    A.ok(/bobby-p01/.test(a.avaliar("MASC('oi')")) && !/camada/.test(a.avaliar("MASC('oi')")));
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
