#!/usr/bin/env node
'use strict';
/* B2 · companheiro em 3 estágios, de graça, só por uso (decisão do Filipe P10); só o acessório de cada companheiro se compra.
   As respostas vêm de fases jogadas pelo gerador de verdade (abrirLicao + conferir).   Uso: node testes/companheiro.js */
const A = require('assert');
const { carregarApp, HTML_LOG } = require('./lib/carregar.js');
const { teste, resumo } = require('./lib/mini.js');
const fs = require('fs'), path = require('path');
const man = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'assets', 'manifesto.json'), 'utf8')).itens;
const ATIVOS = {}; Object.keys(man).forEach((k) => { ATIVOS[k] = [man[k].a, man[k].w, man[k].h]; });
const novo = () => { const a = carregarApp(15, {}); a.avaliar('ATIVOS=' + JSON.stringify(ATIVOS)); a.avaliar("novoPerfil('Zeca','#12A06E')"); return a; };
const jogar = (a, n) => { a.avaliar("abrirLicao(0,0);LIC.etapa='questao';pintarLicao()"); for (let i = 0; i < n && a.avaliar('LIC.etapa') === 'questao'; i++) a.avaliar('LIC.resp=LIC.qs[LIC.i].answer;conferir();avancar()'); };

(async () => {
  await teste('1. estagios por companhia: 0 a 299 Amigo, 300 a 999 Grande amigo, 1.000 Melhor amigo; resposta vale 1, petisco do dia vale 5', () => {
    const a = novo();
    const r = JSON.parse(a.avaliar(`JSON.stringify([0,299,300,999,1000,5000].map(u=>{S.amizade={teo:{xp:0,dia:'',u:u}};return estagioDe('teo');}))`));
    A.deepStrictEqual(r, [1, 1, 2, 2, 3, 3]);
    A.strictEqual(a.avaliar("S.amizade={teo:{xp:10,dia:'',u:250}};estagioDe('teo')"), 2, '250 respostas + 10 petiscos = 300');
  });
  await teste('2. so conta jogando com o companheiro escolhido e comprado; sem companheiro nao conta; tempo parado nao conta', () => {
    const a = novo();
    jogar(a, 8); A.strictEqual(a.avaliar('JSON.stringify(S.amizade)'), '{}', 'contou sem companheiro');
    a.avaliar("S.comprado=['otto'];S.look={companheiro:'otto'}");
    jogar(a, 8);
    const u = a.avaliar('S.amizade.otto.u'); A.ok(u >= 6 && u <= 12, 'respostas contadas: ' + u);
    a.avaliar("S.look={companheiro:'rufa'}"); jogar(a, 4);
    A.ok(!a.avaliar('S.amizade.rufa'), 'contou companheiro nao comprado');
  });
  await teste('3. o estagio nunca cai (nao existe caminho que diminua a companhia) e nao custa nada', () => {
    const a = novo();
    a.avaliar("S.comprado=['otto'];S.look={companheiro:'otto'};S.amizade={otto:{xp:0,dia:'',u:299}};S.moedas=50");
    jogar(a, 3);
    A.strictEqual(a.avaliar("estagioDe('otto')"), 2); A.ok(a.avaliar('S.moedas') >= 50, 'evoluir custou moeda');
    const s2 = a.avaliar("estadoDe(JSON.parse(JSON.stringify(S))).amizade.otto.u"); A.ok(s2 >= 300, 'perdeu companhia ao reler o estado');
  });
  await teste('4. so o acessorio se compra: abre no estagio 2, precisa ter o companheiro; vestir aparece no retrato e nas poses', () => {
    const a = novo();
    a.avaliar("S.moedas=5000;S.comprado=['teo'];S.look={companheiro:'teo'};S.amizade={teo:{xp:0,dia:'',u:10}}");
    A.strictEqual(a.avaliar("podeComprar('aces-teo').motivo"), 'portao');
    A.ok(/Grande amigo/.test(a.avaliar("portaoTexto('aces-teo')")));
    A.strictEqual(a.avaliar("podeComprar('aces-rufa').motivo"), 'portao', 'acessorio de companheiro que nao tem');
    a.avaliar("S.amizade.teo.u=300");
    A.strictEqual(a.avaliar("comprarItem('aces-teo').ok"), true);
    a.avaliar("vestirAcessorioComp('teo',true)");
    ['oi', 'comemora', 'pensa', 'anda'].forEach((e) => A.ok(/lenco-comp/.test(a.avaliar("MASC('" + e + "')")), 'acessorio fora de ' + e));
    A.ok(/selo-estagio/.test(a.avaliar('retratoPers()')), 'selo do estagio no retrato');
    A.ok(a.avaliar("Object.keys(PRECOS.companheiro).every(c=>PRECOS.acessorio[c]>0&&PRECOS.acessorio[c]<=500)"), 'todo companheiro tem acessorio de ate 500');
  });
  await teste('5. nenhum texto de fome, tristeza, saudade ou cobranca sobre o companheiro', () => {
    const a = novo();
    a.avaliar("S.comprado=['teo'];S.look={companheiro:'teo'};S.amizade={teo:{xp:3,dia:'',u:400}}");
    HTML_LOG.length = 0; a.avaliar("abaLoja='comp';telaLoja();abaLoja='mais';telaLoja()");
    const t = HTML_LOG.join(' ').replace(/<[^>]*>/g, ' ');
    A.ok(/Grande amigo/.test(t), 'estagio nao aparece');
    A.ok(!/fome|triste|saudade|sente falta|abandon|esqueceu de|volte|precisa de você/i.test(t), 'texto proibido');
  });
  resumo('companheiro.js');
})();
