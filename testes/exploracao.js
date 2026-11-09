#!/usr/bin/env node
'use strict';
/* 1A · dias de exploração no lugar da ofensiva na tela da criança (corações ficam). Varre o HTML das telas da criança (mapa, topo, rotina,
   perfil, pergunta, acerto com bônus, erro, fim de fase, baú, bilhete, Meu personagem, galeria) com ofensiva, congelador e combo no estado:
   nenhum "ofensiva", "dias seguidos", "congelador", "seguidas", "combo", "continuar por" ou "vida". O responsável continua vendo a ofensiva.
   Uso: node testes/exploracao.js */
const A = require('assert');
const { carregarApp, HTML_LOG } = require('./lib/carregar.js');
const { teste, resumo } = require('./lib/mini.js');
const novo = () => { const a = carregarApp(8, {}); a.avaliar("novoPerfil('Zeca','#12A06E')"); return a; };
const PROIB = /ofensiva|dias? seguidos?|congelador|seguidas|\bcombo\b|continuar por|\bvidas?\b/i;
const texto = (h) => h.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ');
const J = (x) => JSON.parse(JSON.stringify(x));

(async () => {
  await teste('1. varredura das telas da crianca: nenhuma palavra de ofensiva, congelador, seguidas, combo, continuar por ou vida', () => {
    const a = novo();
    a.avaliar("S.ofensiva.atual=9;S.ofensiva.melhor=12;S.ofensiva.congeladores=2;S.exploracao={dias:15,ultimo:hoje()};S.melhorCombo=9;salvar()");
    HTML_LOG.length = 0;
    const telas = ['renderTrilha()', 'pintarTopo()', 'telaPerfil()', 'telaLoja()', "abaLoja='semana';telaLoja()", "abaLoja='mais';telaLoja()", "abaLoja='comp';telaLoja()",
      "abrirLicao(0,0);pintarLicao();LIC.etapa='aula';pintarLicao();LIC.etapa='questao';pintarLicao()",
      "LIC.combo=2;LIC.resp=LIC.qs[0].answer;conferir()", "avancar();LIC.resp='__x__';conferir();avancar()",
      "while(LIC.etapa==='questao'){LIC.resp=LIC.qs[LIC.i].answer;conferir();avancar();}pintarFim()",
      "fecharLicao();S.diario.metaOk=true;S.diario.blocos=2;mostrarBau()", "abrirBau();mostrarBauAberto()",
      "document.body&&0;typeof mostrarBilhete==='function'&&mostrarBilhete()", "abrirGaleria(false)",
      "blocoFimHTML({contou:true,mudou:{primeiroDoDia:true,ganhouCongelador:true,recuperou:false}})"];
    const ruins = [];
    telas.forEach((t) => {
      const n0 = HTML_LOG.length; let extra = '';
      try { const r = a.avaliar(t); if (typeof r === 'string') extra = r; } catch (e) { ruins.push(t + ' -> erro ' + e.message); return; }
      const h = texto(HTML_LOG.slice(n0).join(' ') + ' ' + extra);
      const m = h.match(PROIB); if (m) ruins.push(t + ': "' + h.slice(Math.max(0, m.index - 50), m.index + 40) + '"');
    });
    A.deepStrictEqual(ruins, []);
    A.ok(/15 dias de exploração/.test(texto(a.avaliar("telaPerfil();document&&0")||'') + texto(HTML_LOG.join(' '))), 'dias de exploracao nao aparecem');
  });
  await teste('2. dias de exploracao: um por dia com resposta, cumulativo, nunca cai (dias sem jogar nao apagam nada)', () => {
    const a = novo();
    const r = J(a.avaliar(`(()=>{const o=[];S.exploracao={dias:0,ultimo:''};
      ['2026-11-01','2026-11-01','2026-11-02','2026-11-09','2026-12-25'].forEach(d=>{marcarDiaDeExploracao(d);o.push(S.exploracao.dias);});return o;})()`));
    A.deepStrictEqual(r, [1, 1, 2, 3, 4]);
    a.avaliar("S.exploracao={dias:0,ultimo:''};abrirLicao(0,0);LIC.etapa='questao';pintarLicao();LIC.resp=LIC.qs[0].answer;conferir()");
    A.strictEqual(a.avaliar('S.exploracao.dias'), 1, 'responder nao contou o dia');
  });
  await teste('3. o bau segue os dias de exploracao (nao a ofensiva)', () => {
    const a = novo();
    a.avaliar("S.ofensiva.atual=1;S.exploracao={dias:14,ultimo:hoje()};S.diario.metaOk=true;S.diario.blocos=1;S.diario.bau.aberto=false;abrirBau()");
    A.strictEqual(a.avaliar('S.diario.bau.dia'), 14);
  });
  await teste('4. coracoes ficam na fase; o responsavel ve a ofensiva e pode mostra-la de novo', () => {
    const a = novo();
    HTML_LOG.length = 0;
    a.avaliar("abrirLicao(0,0);LIC.etapa='questao';pintarLicao();pintarVidas()");
    A.ok(a.avaliar('LIC.vidas') === 5, 'coracoes');
    HTML_LOG.length = 0; a.avaliar('telaResponsavel()');
    A.ok(/Mostrar a ofensiva antiga/.test(texto(HTML_LOG.join(' '))), 'controle da ofensiva antiga');
    A.strictEqual(a.avaliar('mostrarOfensiva()'), false, 'padrao: escondida');
    a.avaliar('S.config.ofensivaVisivel=true'); A.strictEqual(a.avaliar('mostrarOfensiva()'), true);
    A.strictEqual(a.avaliar('estadoDe({config:{ofensivaVisivel:true}}).config.ofensivaVisivel'), true);
    A.strictEqual(a.avaliar('estadoDe({}).config.ofensivaVisivel'), false);
  });
  await teste('5. perfil de antes ganha os dias de exploracao que ja jogou (contados nas estatisticas)', () => {
    const a = novo();
    const n = a.avaliar("estadoDe({stats:{dias:{'2026-10-01':{q:3},'2026-10-05':{fases:1},'2026-10-06':{}}}}).exploracao.dias");
    A.strictEqual(n, 2);
  });
  await teste('6. missoes sem "seguidas": a de acertos conta acertos do dia', () => {
    const a = novo();
    const t = a.avaliar("MISSOES_CAT.map(m=>m.t(5)).join(' | ')");
    A.ok(!/seguidas/i.test(t), t);
  });
  resumo('exploracao.js');
})();
