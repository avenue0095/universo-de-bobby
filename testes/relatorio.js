#!/usr/bin/env node
'use strict';
/* 1G · relatório dos pais atrás do PIN: BNCC só com citavel:true, acerto de primeira por fase, no máximo 1 "vale ajudar em",
   20 dicas ao responsável, texto neutro em gênero. Dados gerados jogando fases de verdade (genQuestions + conferir).   Uso: node testes/relatorio.js */
const A = require('assert');
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { carregarApp, HTML_LOG, RAIZ } = require('./lib/carregar.js');
const { teste, resumo } = require('./lib/mini.js');
const novo = (s) => { const a = carregarApp(s || 31, {}); a.avaliar("novoPerfil('Zeca','#12A06E')");
  /* os dados da BNCC chegam por fetch no navegador; aqui lemos o mesmo arquivo do disco */
  const arq = a.avaliar('BNCC_ARQ'); a.avaliar('BNCC=' + fs.readFileSync(path.join(RAIZ, arq), 'utf8')); return a; };
const MAPA = JSON.parse(fs.readFileSync(path.join(RAIZ, 'docs', 'bncc-mapa.json'), 'utf8'));
const CITAVEL = new Set(), TODOS = new Set();
MAPA.fases.forEach((f) => (f.codigos || []).forEach((c) => { TODOS.add(c.codigo); if (c.citavel === true && c.conferido === true) CITAVEL.add(c.codigo); }));
const NAO_CITAVEL = [...TODOS].filter((c) => !CITAVEL.has(c));
/* joga uma fase inteira pela interface: acerta com probabilidade pAc (resposta do gabarito do proprio gerador) */
function jogar(a, mat, ui, li, pAc, dia) {
  a.avaliar(`usarMateria('${mat}');abrirLicao(${ui},${li});LIC.etapa='questao';pintarLicao()`);
  let g = 0;
  while (a.avaliar("LIC.etapa") === 'questao' && g++ < 40) {
    const acerta = Math.random() < pAc;
    a.avaliar(acerta ? 'LIC.resp=LIC.qs[LIC.i].answer;conferir();avancar()' : 'LIC.resp="__errada__";conferir();avancar()');
  }
}
const textoDe = (h) => h.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ');

(async () => {
  await teste('1. dados da BNCC em dia com docs/bncc-mapa.json, fora do pacote inicial, e so com codigos citavel:true', () => {
    execFileSync('python3', [path.join(RAIZ, 'build', 'gerar-bncc.py'), '--check'], { stdio: 'pipe' });
    const a = novo();
    const cods = a.avaliar('Object.keys(BNCC.cod)');
    A.ok(/^assets\/dados\/bncc-[0-9a-f]{8}\.json$/.test(a.avaliar('BNCC_ARQ')), 'BNCC fora do pacote inicial');
    A.ok(fs.readFileSync(path.join(RAIZ, 'index.html'), 'utf8').indexOf('EF01MA02') < 0, 'descricao da BNCC dentro do index.html (pesa no inicial)');
    A.ok(cods.length > 100, 'poucos codigos: ' + cods.length);
    cods.forEach((c) => A.ok(CITAVEL.has(c), c + ' nao e citavel'));
    A.ok(NAO_CITAVEL.length >= 1, 'o mapa deveria ter codigos nao citaveis para o teste valer');
  });

  await teste('2. relatorio cita so codigos citaveis das fases concluidas, como "relacionada"; ingles so na faixa de 11 a 12 anos', () => {
    const a = novo();
    a.avaliar(`['1.5','8.3','9.4','1.1','p3.1','e1.1','e2.3'].forEach(id=>S.feitas[id]=3);S.faixa='f78';`);
    const h78 = textoDe(a.avaliar('relatorioHTML()'));
    NAO_CITAVEL.forEach((c) => A.ok(h78.indexOf(c) < 0, 'citou codigo nao citavel ' + c));
    A.ok(h78.indexOf('EF01MA02') >= 0, 'deveria citar EF01MA02 da fase 1.1');
    A.ok(!/EF0\dLI/.test(h78), 'ingles citado na faixa de 7 a 8 anos');
    A.ok(/relacionad/i.test(h78) && !/cumprid/i.test(h78), 'texto deve dizer relacionada, nunca cumprida');
    a.avaliar("S.faixa='f1112'");
    const h12 = textoDe(a.avaliar('relatorioHTML()'));
    A.ok(/EF06LI/.test(h12), 'ingles deveria aparecer na faixa de 11 a 12 anos');
    A.ok(/\(\dº ano\)/.test(h12), 'mostra o ano do codigo');
  });

  await teste('3. acerto de primeira por fase vem de partidas jogadas pelo gerador de verdade; segunda chance separada', () => {
    const a = novo();
    for (let k = 0; k < 3; k++) jogar(a, 'mat', 0, 1, 0.6);
    const r = a.avaliar('JSON.parse(JSON.stringify(fasesComAcerto(hoje())))');
    A.ok(r.length >= 1, 'nenhuma fase com acerto de primeira');
    const f = r.find((x) => x.id === '1.2');
    A.ok(f && f.n >= 8 && f.a <= f.n, 'fase 1.2: ' + JSON.stringify(f));
    const h = textoDe(a.avaliar('relatorioHTML()'));
    A.ok(new RegExp(f.a + ' de ' + f.n + ' de primeira').test(h), 'o numero nao aparece no relatorio');
  });

  await teste('4. semana 1 sem "vale ajudar"; da 2a semana em diante no maximo 1 "vale ajudar em", com dica de casa', () => {
    const a = novo();
    for (let k = 0; k < 2; k++) jogar(a, 'mat', 0, 0, 0.3);
    jogar(a, 'pt', 0, 0, 0.3);
    let h = textoDe(a.avaliar('relatorioHTML()'));
    A.ok(/Semana 1/.test(h) && !/Vale ajudar em/.test(h), 'semana 1 nao pode ter vale ajudar');
    /* empurra o primeiro dia de uso 10 dias para tras: agora e a semana 2 */
    a.avaliar(`(()=>{const d=Object.keys(S.stats.dias)[0];S.stats.dias[somaDias(hoje(),-10)]=Object.assign({},S.stats.dias[d]);})()`);
    h = textoDe(a.avaliar('relatorioHTML()'));
    const n = (h.match(/Vale ajudar em/g) || []).length;
    A.ok(n <= 1, 'vale ajudar aparece ' + n + ' vezes');
    if (n) A.ok(/Em casa:/.test(h), 'vale ajudar sem dica de casa');
  });

  await teste('5. as 20 dicas: 20, neutras, sem "explique/ensine/corrija", sem travessao, sem "tu"', () => {
    const a = novo();
    const d = a.avaliar('DICAS_RESP.map(x=>x.t)');
    A.strictEqual(d.length, 20);
    d.forEach((t) => {
      A.ok(!/\b(expli(que|car)|ensin(e|ar)|corrij|corrigir)\b/i.test(t), 'verbo proibido: ' + t);
      A.ok(!/[—–]/.test(t), 'travessao: ' + t);
      A.ok(!/\btu\b/i.test(t), '"tu": ' + t);
      A.ok(!/\b(ela|ele|dela|dele|sua filha|seu filho)\b/i.test(t), 'genero: ' + t);
    });
    const h = textoDe(a.avaliar('relatorioHTML()'));
    A.strictEqual((h.match(/Ver as 20 dicas/g) || []).length, 1);
  });

  await teste('6. tela do responsavel inteira sem texto no feminino ou masculino fixo e atras do PIN', () => {
    const a = novo();
    jogar(a, 'mat', 0, 0, 0.7);
    HTML_LOG.length = 0;
    a.avaliar('telaResponsavel()');
    const h = textoDe(HTML_LOG.join(' '));
    A.ok(/Como vai o aprendizado/.test(h), 'relatorio nao entrou na tela do responsavel');
    /* "ela" sozinho aparece referindo coisas (a senha, a revisão); o que nao pode e genero fixo da crianca ou de quem acompanha */
    const ruim = h.match(/(você mesma|você mesmo|sua filha|seu filho|a filha|o filho|seu jogador|sua jogadora|onde ela|ela mais|ele mais|peça para ela|peça para ele)/i);
    A.ok(!ruim, 'texto com genero fixo: ' + (ruim && ruim[0]));
    const src = fs.readFileSync(path.join(RAIZ, 'src', 'interface', 'perfil-e-responsavel.js'), 'utf8');
    A.ok(/comSenha\(telaResponsavel\)/.test(src), 'a area do responsavel deveria abrir por comSenha');
    const todos = fs.readdirSync(path.join(RAIZ, 'src', 'interface')).filter((f) => f.endsWith('.js'))
      .filter((f) => /relatorioHTML\(\)/.test(fs.readFileSync(path.join(RAIZ, 'src', 'interface', f), 'utf8')) && f !== 'relatorio.js');
    A.deepStrictEqual(todos, ['perfil-e-responsavel.js'], 'relatorio chamado fora da area do responsavel: ' + todos);
    const t = a.avaliar('textoDoResumo()');
    A.ok(!/seu jogador|sua jogadora/.test(t), t);
  });

  resumo();
})();
