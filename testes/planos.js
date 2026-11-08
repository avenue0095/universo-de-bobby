#!/usr/bin/env node
'use strict';
/* Estrutura para venda (planos.js): configuracao unica, muro e tela Assinatura. NAO ha login nem cobranca de verdade.
   (1) modo 'aberto' nao bloqueia nada (fase, revisao do mundo, revisao do dia); (2) modo 'pago' sem conta bloqueia e mostra a tela
   Assinatura; (3) conta com assinatura ativa libera, vencida ou com plano desconhecido nao; (4) precos exibidos batem com PLANOS e nenhum
   preco e escrito a mao fora de planos.js; (5) nenhum texto visivel com "teste gratis"; (6) secao Plano na area do responsavel;
   (7) conta nunca vem do aparelho (localStorage ou backup); (8) limite de jogadores so no modo pago.   Uso: node testes/planos.js */
const fs = require('fs');
const path = require('path');
const A = require('assert');
const { carregarApp, HTML_LOG } = require('./lib/carregar.js');
const { teste, resumo } = require('./lib/mini.js');

const RAIZ = path.join(__dirname, '..');
const J = (x) => JSON.parse(JSON.stringify(x));
const novo = () => { const a = carregarApp(5, {}); a.avaliar("novoPerfil('Bia','#12A06E')"); return a; };
const html = (desde) => HTML_LOG.slice(desde).join('\n');

(async () => {
  await teste('1. PLANOS, MAX_PERFIS e MURO sao a configuracao unica (R$ 47 por mes, R$ 297 por ano, 4 jogadores, aberto)', () => {
    const a = novo();
    A.deepStrictEqual(J(a.avaliar('PLANOS')), { mensal: { centavos: 4700, rotulo: 'Mensal', ciclo: 'mensal' }, anual: { centavos: 29700, rotulo: 'Anual', ciclo: 'anual' } });
    A.strictEqual(a.avaliar('MAX_PERFIS'), 4);
    A.strictEqual(a.avaliar('MURO.modo'), 'aberto');
    A.deepStrictEqual(J(a.avaliar('MODOS_DO_MURO')), ['aberto', 'pago']);
    A.strictEqual(a.avaliar('reais(4700)'), 'R$ 47,00'); A.strictEqual(a.avaliar('reais(29700)'), 'R$ 297,00');
    A.strictEqual(a.avaliar('reais(123456)'), 'R$ 1.234,56'); A.strictEqual(a.avaliar('reais(5)'), 'R$ 0,05');
  });
  await teste('2. modo aberto: acessoLiberado e true e a fase, a revisao do mundo e a revisao do dia abrem; nenhuma tela Assinatura', () => {
    const a = novo();
    A.strictEqual(a.avaliar('acessoLiberado(S)'), true);
    A.strictEqual(a.avaliar('acessoLiberado(null)'), true);
    const d = HTML_LOG.length;
    a.avaliar('LIC={};abrirLicao(0,0)');
    A.ok(a.avaliar('Array.isArray(LIC.qs)&&LIC.qs.length>0'), 'a fase nao abriu no modo aberto');
    a.avaliar('LIC={};abrirRevisaoMundo(0)');
    A.ok(a.avaliar('Array.isArray(LIC.qs)'), 'a revisao do mundo nao abriu no modo aberto');
    A.ok(!/Assinatura/.test(html(d)), 'tela Assinatura apareceu no modo aberto');
  });
  await teste('3. modo pago sem conta: a fase NAO abre (nem revisao do mundo, nem revisao do dia) e a tela Assinatura aparece com os dois planos', () => {
    const a = novo();
    a.avaliar("MURO.modo='pago'");
    A.strictEqual(a.avaliar('acessoLiberado(S)'), false);
    for (const abre of ['abrirLicao(0,0)', 'abrirRevisaoMundo(0)', 'abrirRevisaoDia()']) {
      const d = HTML_LOG.length;
      a.avaliar('LIC={marca:1};' + abre);
      A.strictEqual(a.avaliar('LIC.marca'), 1, abre + ' abriu a fase sem assinatura');
      const h = html(d);
      A.ok(/<h2>Assinatura<\/h2>/.test(h), abre + ': tela Assinatura nao apareceu');
      A.ok(h.includes('R$ 47,00') && h.includes('R$ 297,00') && /por mês/.test(h) && /por ano/.test(h), abre + ': precos da tela');
      A.ok(/id="ass-entrar" disabled/.test(h) && /id="ass-assinar" disabled/.test(h) && /Disponível em breve/.test(h), abre + ': botoes Entrar e Assinar desabilitados com o aviso');
    }
  });
  await teste('4. modo pago com senha do responsavel: a crianca ve a senha antes da tela Assinatura', async () => {
    const a = novo();
    await a.avaliar("definirSenha('4821')"); a.avaliar("MURO.modo='pago';liberadoAte=0");
    const d = HTML_LOG.length;
    a.avaliar('LIC={marca:1};abrirLicao(0,0)');
    const h = html(d);
    A.strictEqual(a.avaliar('LIC.marca'), 1);
    A.ok(/campo-pin/.test(h) && /<h2>Assinatura<\/h2>/.test(h) && !/plano-cartao/.test(h), 'devia pedir a senha antes de mostrar os planos');
  });
  await teste('5. conta: assinatura ativa libera; vencida, cancelada, sem plano ou plano desconhecido nao; modo desconhecido fecha', () => {
    const a = novo();
    a.avaliar("MURO.modo='pago'");
    const caso = (c) => a.avaliar('acessoLiberado({conta:' + JSON.stringify(c) + '})');
    A.strictEqual(caso({ assinatura: { status: 'ativa', plano: 'mensal', ate: '2099-01-01' } }), true);
    A.strictEqual(caso({ assinatura: { status: 'ativa', plano: 'anual' } }), true);
    A.strictEqual(caso({ assinatura: { status: 'ativa', plano: 'mensal', ate: '2000-01-01' } }), false);
    A.strictEqual(caso({ assinatura: { status: 'cancelada', plano: 'mensal', ate: '2099-01-01' } }), false);
    A.strictEqual(caso({ assinatura: { status: 'ativa', plano: 'vitalicio' } }), false);
    A.strictEqual(caso({}), false); A.strictEqual(caso(null), false);
    a.avaliar("S.conta={assinatura:{status:'ativa',plano:'anual',ate:'2099-12-31'}}");
    a.avaliar('LIC={};abrirLicao(0,0)');
    A.ok(a.avaliar('Array.isArray(LIC.qs)'), 'com assinatura ativa a fase devia abrir');
    a.avaliar("MURO.modo='qualquer'");
    A.strictEqual(a.avaliar('acessoLiberado(S)'), false);
  });
  await teste('6. conta nunca vem do aparelho: estadoDe zera conta (localStorage editado ou backup nao liberam o muro)', () => {
    const a = novo();
    A.strictEqual(a.avaliar("estadoDe({conta:{assinatura:{status:'ativa',plano:'mensal',ate:'2099-01-01'}}}).conta"), null);
    A.strictEqual(a.avaliar('estadoVazio().conta'), null);
  });
  await teste('7. area do responsavel: secao Plano com o modo atual e os precos de PLANOS', () => {
    const a = novo();
    let d = HTML_LOG.length; a.avaliar('telaResponsavel()');
    let h = html(d);
    A.ok(/<h2 class="sec">Plano<\/h2>/.test(h) && /Modo atual: <b id="plano-modo">Aberto<\/b>/.test(h), 'secao Plano ou modo');
    A.ok(h.includes('R$ 47,00') && h.includes('R$ 297,00') && h.includes('R$ 24,75'), 'precos na secao Plano');
    a.avaliar("MURO.modo='pago'"); d = HTML_LOG.length; a.avaliar('telaResponsavel()'); h = html(d);
    A.ok(/Modo atual: <b id="plano-modo">Assinatura<\/b>/.test(h));
  });
  await teste('8. nenhum preco escrito a mao fora de planos.js (R$ 47, R$ 297, 4700, 29700, 47,00)', () => {
    const dir = path.join(RAIZ, 'src', 'interface');
    const ruins = [];
    for (const f of fs.readdirSync(dir).filter((x) => /\.(js|html)$/.test(x) && x !== 'planos.js')) {
      const t = fs.readFileSync(path.join(dir, f), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
      /* (o dinheiro da aula de moedas e notas, R$ 10, R$ 5..., e conteudo, nao preco) */
      if (/R\$(\s|&nbsp;)?(47|297|24,75)\b|\b(4700|29700|297)\b|47,00/.test(t)) ruins.push(f);
    }
    A.deepStrictEqual(ruins, []);
    const p = fs.readFileSync(path.join(dir, 'planos.js'), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
    A.strictEqual((p.match(/\b(4700|29700)\b/g) || []).length, 2, 'os precos aparecem so uma vez, em PLANOS');
  });
  await teste('9. nenhum texto visivel com "teste gratis" (codigo, conteudo e index.html)', () => {
    const ruins = [];
    const olha = (arq) => { const t = fs.readFileSync(arq, 'utf8').replace(/\/\*[\s\S]*?\*\//g, ''); if (/teste\s+gr[aá]tis|per[ií]odo\s+gr[aá]tis|gr[aá]tis\s+por\s+\d|free\s+trial/i.test(t)) ruins.push(path.relative(RAIZ, arq)); };
    for (const sub of ['interface', 'conteudo']) for (const f of fs.readdirSync(path.join(RAIZ, 'src', sub))) olha(path.join(RAIZ, 'src', sub, f));
    olha(path.join(RAIZ, 'index.html'));
    A.deepStrictEqual(ruins, []);
  });
  await teste('10. limite de jogadores: no modo aberto nada muda; no modo pago o 5o jogador nao pode ser criado', () => {
    const a = novo();
    a.avaliar("novoPerfil('B','#12A06E');novoPerfil('C','#12A06E');novoPerfil('D','#12A06E')");
    A.strictEqual(a.avaliar('STORE.perfis.length'), 4);
    A.strictEqual(a.avaliar('podeCriarPerfil()'), true);
    a.avaliar("MURO.modo='pago'");
    A.strictEqual(a.avaliar('podeCriarPerfil()'), false);
    const d = HTML_LOG.length; a.avaliar('telaPerfis()');
    A.ok(/id="novo-perfil" disabled/.test(html(d)) && /até 4 jogadores por assinatura/.test(html(d)));
  });
  resumo('planos.js');
})();
