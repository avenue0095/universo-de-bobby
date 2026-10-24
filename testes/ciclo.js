#!/usr/bin/env node
'use strict';
/* Ciclo diario: dia vivo, meta em perguntas, bau sem sorteio, 3 missoes deterministicas, bilhete, ponto de parada,
   congelador no fluxo real, limite de blocos e tom dos textos (nada de culpa, tristeza ou contagem regressiva).
   Uso: node testes/ciclo.js                                                                   */
const fs = require('fs');
const path = require('path');
const A = require('assert');
const { carregarApp } = require('./lib/carregar.js');
const { teste, resumo } = require('./lib/mini.js');

const quando = (a, m, d, h) => new Date(a, m - 1, d, h || 10, 0, 0).getTime();
const relogio = { ms: quando(2026, 10, 24) };
function novoApp(faixa) {
  relogio.ms = quando(2026, 10, 24);
  const a = carregarApp(11, { relogio });
  a.avaliar("novoPerfil('Zeca','#12A06E')");
  if (faixa) a.avaliar("S.faixa='" + faixa + "';salvar()");
  return a;
}
const bloco = (a, u, l) => a.avaliar("(function(){abrirLicao(" + (u || 0) + "," + (l || 0) + ");LIC.etapa='questao';pintarLicao();" +
  "while(LIC.etapa==='questao'){LIC.resp=LIC.qs[LIC.i].answer;conferir();avancar();}return JSON.parse(JSON.stringify(LIC.bloco||{}));})()");
const proximoDia = (a, n) => { relogio.ms += 864e5 * (n || 1); a.avaliar('garantirDia()'); };

(async () => {
  await teste('1. meta em perguntas: 5 min = 20, 10 min = 40, 15 min = 60 (15 s por pergunta)', () => {
    const a = novoApp();
    A.strictEqual(a.avaliar('perguntasMeta()'), 20);
    a.avaliar('S.config.metaMin=10'); A.strictEqual(a.avaliar('perguntasMeta()'), 40);
    a.avaliar('S.config.metaMin=15'); A.strictEqual(a.avaliar('perguntasMeta()'), 60);
  });

  await teste('2. calibra com a mediana do proprio perfil depois de 50 perguntas (limites 8 a 40 s)', () => {
    const a = novoApp();
    a.avaliar('S.stats.amostras=Array(49).fill(10)'); A.strictEqual(a.avaliar('segPorPergunta()'), 15);
    a.avaliar('S.stats.amostras=Array(50).fill(10)'); A.strictEqual(a.avaliar('segPorPergunta()'), 10);
    a.avaliar('S.stats.amostras=Array(60).fill(3)'); A.strictEqual(a.avaliar('segPorPergunta()'), 8);
    a.avaliar('S.stats.amostras=Array(60).fill(55)'); A.strictEqual(a.avaliar('segPorPergunta()'), 40);
  });

  await teste('3. dia vivo: um bloco de 6+ perguntas; meta cheia conta PERGUNTAS, nao o tempo', () => {
    const a = novoApp();
    A.strictEqual(a.avaliar('S.diario.blocos'), 0);
    const b = bloco(a, 0, 0);
    A.strictEqual(b.contou, true);
    A.strictEqual(a.avaliar('S.diario.blocos'), 1); A.strictEqual(a.avaliar('S.ofensiva.atual'), 1);
    A.strictEqual(a.avaliar('S.diario.perguntas'), 8);
    A.strictEqual(a.avaliar('S.diario.metaOk'), false);
    bloco(a, 0, 1); A.strictEqual(a.avaliar('S.diario.metaOk'), false, '16 de 20');
    bloco(a, 0, 2); A.strictEqual(a.avaliar('S.diario.metaOk'), true, '24 de 20');
    A.strictEqual(a.avaliar('S.ofensiva.atual'), 1, 'varios blocos no mesmo dia nao sobem a ofensiva');
    A.strictEqual(a.avaliar('S.diario.blocos'), 3);
  });

  await teste('4. bloco com menos de 6 perguntas respondidas nao vira dia vivo', () => {
    const a = novoApp();
    const r = a.avaliar("JSON.parse(JSON.stringify(concluirBloco({tipo:'fase',lic:'1.1',materia:'mat',perguntas:5,acertos:5})))");
    A.strictEqual(r.contou, false);
    A.strictEqual(a.avaliar('S.ofensiva.atual'), 0); A.strictEqual(a.avaliar('S.diario.blocos'), 0);
  });

  await teste('5. bau so abre com meta cheia E dia vivo; abre uma vez so; sem sorteio (Math.random proibido)', () => {
    const a = novoApp();
    A.strictEqual(a.avaliar('bauPronto()'), false);
    for (let i = 0; i < 3; i++) bloco(a, 0, i);
    A.strictEqual(a.avaliar('bauPronto()'), true);
    a.avaliar("Math.random=function(){throw new Error('sorteio no bau')}");
    const r = a.avaliar('JSON.parse(JSON.stringify(abrirBau()))');
    A.strictEqual(r.aberto, true); A.strictEqual(r.dia, 1);
    A.strictEqual(r.itens[0].n, 'Primeira visita');      // dia 1 da tabela: Adesivo "Primeira visita"
    A.strictEqual(a.avaliar('abrirBau()'), null, 'abriu duas vezes');
    A.strictEqual(a.avaliar('bauPronto()'), false);
    A.ok(a.avaliar("S.colecao.adesivos.indexOf('Primeira visita')>=0"));
  });

  await teste('6. tabela do bau: dias 1 a 30 definidos, so cosmeticos e moedas, e identica a cada chamada', () => {
    const a = novoApp();
    for (let n = 1; n <= 30; n++) {
      const r1 = JSON.stringify(a.avaliar('recompensaDoDia(' + n + ')')), r2 = JSON.stringify(a.avaliar('recompensaDoDia(' + n + ')'));
      A.strictEqual(r1, r2); A.ok(JSON.parse(r1).length >= 1, 'dia ' + n + ' vazio');
      A.ok(!/R\$|real|reais|pix|compr/i.test(r1), 'dia ' + n + ' fala de dinheiro de verdade');
    }
    A.strictEqual(JSON.stringify(a.avaliar('recompensaDoDia(2)')), '[["moedas",10]]');
    A.ok(JSON.stringify(a.avaliar('recompensaDoDia(7)')).includes('1 semana'));
    A.ok(JSON.stringify(a.avaliar('recompensaDoDia(30)')).includes('roupa-ex'));
    // crescem: o valor das moedas nao diminui ao longo dos marcos de moedas (10,10,15,15,15,20,20)
    const moedas = [2, 6, 11, 15, 18, 22, 26].map((n) => a.avaliar('recompensaDoDia(' + n + ')[0][1]'));
    for (let i = 1; i < moedas.length; i++) A.ok(moedas[i] >= moedas[i - 1], 'moedas diminuem: ' + moedas);
    // depois do dia 30: marco a cada 10 dias
    A.ok(JSON.stringify(a.avaliar('recompensaDoDia(40)')).includes('Constelação'));
    A.ok(JSON.stringify(a.avaliar('recompensaDoDia(45)')).length > 5);
  });

  await teste('7. item que ja existe vira +20 moedas (nada repete, nada se perde)', () => {
    const a = novoApp();
    a.avaliar("S.colecao.adesivos.push('Primeira visita');S.moedas=0");
    const r = JSON.parse(JSON.stringify(a.avaliar("entregarRecompensa(recompensaDoDia(1),1)")));
    A.strictEqual(a.avaliar('S.moedas'), 20); A.strictEqual(a.avaliar('S.colecao.adesivos.length'), 1);
    A.ok(/você já tem/.test(r[0].n));
  });

  await teste('8. roupa do bau entra no guarda-roupa de verdade (comprado) e nao custa moeda', () => {
    const a = novoApp();
    const antes = a.avaliar('S.comprado.length');
    a.avaliar("S.moedas=100");
    a.avaliar("entregarRecompensa([['roupa-p']],5)");
    A.strictEqual(a.avaliar('S.comprado.length'), antes + 1); A.strictEqual(a.avaliar('S.moedas'), 100);
    const id = a.avaliar('S.comprado[S.comprado.length-1]');
    A.ok(a.avaliar("['chapeu','rosto','pescoco'].some(s=>PECAS[s]['" + id + "'])"));
  });

  await teste('9. 3 missoes: sempre 3, sem grupos repetidos, so as disponiveis, iguais o dia inteiro', () => {
    const a = novoApp();
    const m1 = JSON.stringify(a.avaliar('S.diario.missoes'));
    A.strictEqual(a.avaliar('S.diario.missoes.length'), 3);
    a.avaliar('garantirDia()'); A.strictEqual(JSON.stringify(a.avaliar('S.diario.missoes')), m1);
    const ids = a.avaliar('S.diario.missoes.map(m=>m.id)');
    const grupos = ids.map((i) => a.avaliar("missaoPorId('" + i + "').g"));
    A.strictEqual(new Set(grupos).size, 3, 'duas missoes contam o mesmo evento: ' + ids);
    ids.forEach((i) => A.notStrictEqual(['M05', 'M06', 'M07', 'M12'].indexOf(i) >= 0, true, 'missao indisponivel sorteada: ' + i));
    // varios dias, varios perfis: nunca quebra a regra
    for (let d = 0; d < 40; d++) {
      proximoDia(a, 1);
      const ms = a.avaliar('S.diario.missoes.map(m=>m.id)');
      A.strictEqual(ms.length, 3, 'dia ' + d + ': ' + ms);
      A.strictEqual(new Set(ms.map((i) => a.avaliar("missaoPorId('" + i + "').g"))).size, 3);
    }
  });

  await teste('10. mesmas missoes ao recarregar (semente = perfil + dia) e perfis diferentes podem diferir', () => {
    const a = novoApp();
    const a1 = JSON.stringify(a.avaliar('gerarMissoes(hoje())'));
    const a2 = JSON.stringify(a.avaliar('gerarMissoes(hoje())'));
    A.strictEqual(a1, a2);
    a.avaliar("S.diario.dia='';garantirDia()");
    A.strictEqual(JSON.stringify(a.avaliar('S.diario.missoes')), a1.replace(/"prog":0/g, '"prog":0'));
  });

  await teste('11. alvo por faixa: M03 = 4/5/6 seguidas; texto da missao traz o numero', () => {
    const a = novoApp();
    const alvo = (f) => { a.avaliar("S.faixa='" + f + "'"); return a.avaliar("alvoDaMissao(missaoPorId('M03'))"); };
    A.strictEqual(alvo('f78'), 4); A.strictEqual(alvo('f910'), 5); A.strictEqual(alvo('f1112'), 6);
    A.strictEqual(a.avaliar("textoDaMissao({id:'M03',alvo:5})"), 'Acerte 5 seguidas');
  });

  await teste('12. ajuste silencioso do alvo: cai 1 degrau com 3 dias fracos; sobe com 5 dias perfeitos (teto f1112)', () => {
    const a = novoApp('f910');
    a.avaliar("S.missHist=[{dia:'2026-10-20',ids:[],ok:1},{dia:'2026-10-21',ids:[],ok:0},{dia:'2026-10-22',ids:[],ok:1}]");
    A.strictEqual(a.avaliar("alvoDaMissao(missaoPorId('M03'))"), 4);
    a.avaliar("S.missHist=[1,2,3,4,5].map(i=>({dia:'2026-10-2'+i,ids:[],ok:3}))");
    A.strictEqual(a.avaliar("alvoDaMissao(missaoPorId('M03'))"), 6);
    a.avaliar("S.faixa='f1112'");
    A.strictEqual(a.avaliar("alvoDaMissao(missaoPorId('M03'))"), 6, 'teto');
  });

  await teste('13. missao conclui pelo jogo real, vira estrela do dia com as 3, e 5 estrelas acendem a constelacao da semana', () => {
    const a = novoApp();
    a.avaliar("S.diario.missoes=[{id:'M02',alvo:1,prog:0,ok:false},{id:'M11',alvo:8,prog:0,ok:false},{id:'M03',alvo:4,prog:0,ok:false}]");
    bloco(a, 0, 0);
    const ms = a.avaliar('S.diario.missoes');
    A.ok(ms.every((m) => m.ok), JSON.stringify(ms));
    A.strictEqual(a.avaliar('S.diario.estrela'), true); A.strictEqual(a.avaliar('S.semana.estrelas'), 1);
    a.avaliar('S.semana.estrelas=4;S.diario.estrela=false;S.diario.missoes.forEach(m=>m.ok=false);atualizarMissoes()');
    A.strictEqual(a.avaliar('S.semana.constelacao'), true); A.strictEqual(a.avaliar('S.colecao.constelacao.length'), 1);
  });

  await teste('14. a semana vira: estrelas zeram; o dia vira: missoes e contadores novos, historico guarda o dia anterior', () => {
    const a = novoApp();
    bloco(a, 0, 0);
    a.avaliar('S.semana.estrelas=3');
    proximoDia(a, 7);
    A.strictEqual(a.avaliar('S.semana.estrelas'), 0);
    A.strictEqual(a.avaliar('S.diario.blocos'), 0); A.strictEqual(a.avaliar('S.diario.perguntas'), 0);
    A.strictEqual(a.avaliar('S.missHist.length'), 1);
    A.strictEqual(a.avaliar('S.diario.metaOk'), false); A.strictEqual(a.avaliar('S.diario.bau.aberto'), false);
  });

  await teste('15. ponto de parada: aparece com meta cheia + bau aberto, uma vez por dia; "continuar" desliga bonus de combo', () => {
    const a = novoApp();
    A.strictEqual(a.avaliar('paradaPendente()'), false);
    for (let i = 0; i < 3; i++) bloco(a, 0, i);
    A.strictEqual(a.avaliar('paradaPendente()'), false, 'bau ainda fechado');
    a.avaliar('abrirBau()');
    A.strictEqual(a.avaliar('paradaPendente()'), true);
    A.strictEqual(a.avaliar('bonusDeComboAtivo()'), true);
    a.avaliar("registrarParada('continuar')");
    A.strictEqual(a.avaliar('paradaPendente()'), false);
    A.strictEqual(a.avaliar('bonusDeComboAtivo()'), false);
    A.strictEqual(a.avaliar('S.diario.paradaAcao'), 'continuar');
    proximoDia(a, 1);
    A.strictEqual(a.avaliar('bonusDeComboAtivo()'), true, 'no dia seguinte o bonus volta');
  });

  await teste('16. continuar explorando: nao gera novo bau nem nova missao; moedas e XP seguem normais', () => {
    const a = novoApp();
    for (let i = 0; i < 3; i++) bloco(a, 0, i);
    a.avaliar('abrirBau()'); a.avaliar("registrarParada('continuar')");
    const ms = JSON.stringify(a.avaliar('S.diario.missoes'));
    const xp = a.avaliar('S.xp');
    bloco(a, 1, 0);
    A.strictEqual(a.avaliar('bauPronto()'), false); A.strictEqual(a.avaliar('paradaPendente()'), false);
    A.strictEqual(JSON.stringify(a.avaliar('S.diario.missoes.map(m=>m.id)')), JSON.stringify(JSON.parse(ms).map((m) => m.id)));
    A.ok(a.avaliar('S.xp') > xp);
  });

  await teste('17. limite de blocos por dia: bloqueia a fase e so o responsavel libera (uma a uma)', () => {
    const a = novoApp();
    a.avaliar('S.config.limiteBlocosDia=2');
    bloco(a, 0, 0); bloco(a, 0, 1);
    A.strictEqual(a.avaliar('limiteDeBlocosAtingido()'), true);
    a.avaliar('LIC={};abrirLicao(0,2)');
    A.strictEqual(a.avaliar('LIC.l'), undefined, 'abriu a fase mesmo no limite');
    a.avaliar('S.diario.liberados=1');
    A.strictEqual(a.avaliar('limiteDeBlocosAtingido()'), false);
    proximoDia(a, 1);
    A.strictEqual(a.avaliar('limiteDeBlocosAtingido()'), false);
  });

  await teste('18. congelador no fluxo real: ganha no 7o dia, gasta sozinho ao faltar um dia, ofensiva intacta', () => {
    const a = novoApp();
    for (let d = 0; d < 7; d++) { bloco(a, 0, d % 5); proximoDia(a, 1); }
    A.strictEqual(a.avaliar('S.ofensiva.atual'), 7);
    A.strictEqual(a.avaliar('S.ofensiva.congeladores'), 1 );
    proximoDia(a, 1);                       // faltou um dia
    A.strictEqual(a.avaliar('S.ofensiva.congeladores'), 0, 'o congelador nao foi gasto');
    A.strictEqual(a.avaliar('S.ofensiva.descansando'), false);
    bloco(a, 0, 0);
    A.strictEqual(a.avaliar('S.ofensiva.atual'), 8);
  });

  await teste('19. sem congelador a ofensiva descansa (nao zera), volta pela metade e o recorde fica', () => {
    const a = novoApp();
    a.avaliar('S.ofensiva.congeladores=0');
    for (let d = 0; d < 8; d++) { bloco(a, 0, d % 5); proximoDia(a, 1); a.avaliar('S.ofensiva.congeladores=0'); }
    A.strictEqual(a.avaliar('S.ofensiva.atual'), 8);
    proximoDia(a, 3);
    A.strictEqual(a.avaliar('S.ofensiva.descansando'), true);
    A.strictEqual(a.avaliar('S.ofensiva.atual'), 8, 'zerou');
    bloco(a, 0, 0);
    A.strictEqual(a.avaliar('S.ofensiva.atual'), 4); A.strictEqual(a.avaliar('S.ofensiva.melhor'), 8);
    A.strictEqual(a.avaliar('S.ofensiva.descansando'), false);
  });

  await teste('20. dia livre do responsavel e pausa nao viram falta', () => {
    const a = novoApp();
    bloco(a, 0, 0);
    a.avaliar('S.config.pausaAte=somaDias(hoje(),3)');
    proximoDia(a, 3);
    A.strictEqual(a.avaliar('S.ofensiva.descansando'), false);
  });

  await teste('21. Kit de volta: 4 dias ou mais fora liberam o kit uma vez; cosmetico, sem culpa', () => {
    const a = novoApp();
    bloco(a, 0, 0); proximoDia(a, 5);
    A.strictEqual(a.avaliar('S.diario.kit'), 1);
    const m = a.avaliar('S.moedas');
    const itens = a.avaliar('JSON.parse(JSON.stringify(pegarKit()))');
    A.ok(itens.length >= 1); A.strictEqual(a.avaliar('S.moedas'), m + 15);
    A.strictEqual(a.avaliar('pegarKit()'), null);
  });

  await teste('22. bilhete: um por dia; o contexto certo para cada situacao', () => {
    const a = novoApp();
    let b = a.avaliar('bilheteDeHoje()');
    A.strictEqual(b.chave, 'primeiro');
    a.avaliar('marcarBilheteVisto()');
    A.strictEqual(a.avaliar('bilheteDeHoje()'), null, 'mostrou 2 vezes no mesmo dia');
    bloco(a, 0, 0); proximoDia(a, 1);
    b = a.avaliar('bilheteDeHoje()');
    A.ok(['revisao', 'diaSeguinte', 'sabado', 'fimDeSemana', 'neutro', 'marco'].indexOf(b.chave) >= 0, b.chave);
    a.avaliar('marcarBilheteVisto()');
    proximoDia(a, 3);   // 3 dias fora (e sem congelador gasto: ganhou 0)
    a.avaliar('S.espera.vistoEm=""');
    const c = a.avaliar('bilheteDeHoje()').chave;
    A.ok(['doisATres', 'descansando', 'congelador'].indexOf(c) >= 0, c);
    proximoDia(a, 6); a.avaliar('S.espera.vistoEm="";S.ofensiva.descansando=false');
    const d = a.avaliar('bilheteDeHoje()').chave;
    A.ok(['quatroOuMais', 'descansando'].indexOf(d) >= 0, d);
  });

  await teste('23. bilhete "congelador" depois de gastar um; "descansando" quando a ofensiva descansa', () => {
    const a = novoApp();
    a.avaliar('S.ofensiva.congeladores=1');
    bloco(a, 0, 0); proximoDia(a, 2);
    A.strictEqual(a.avaliar('bilheteDeHoje().chave'), 'congelador');
    const b = novoApp();
    b.avaliar('S.ofensiva.congeladores=0');
    bloco(b, 0, 0); proximoDia(b, 4); b.avaliar('S.espera.vistoEm=""');
    A.strictEqual(b.avaliar('bilheteDeHoje().chave'), 'descansando');
  });

  await teste('24. tom: nenhum texto do ciclo culpa, entristece, cobra ou faz contagem regressiva', () => {
    const a = novoApp();
    const textos = Object.values(a.avaliar('BILHETES'));
    const arquivos = ['ciclo.js', 'ciclo-ui.js'].map((f) => fs.readFileSync(path.join(__dirname, '..', 'src', 'interface', f), 'utf8'));
    const proibido = /triste|saudade|senti sua falta|sentimos sua falta|você perdeu|vai perder|perdeu a|últimas horas|ultimas horas|faz \d+ dias|não deixe|nao deixe|decepcion|abandon|castigo|culpa|sumiu|cadê você|cade voce|corra|rápido, só hoje|expira/i;
    textos.forEach((t) => A.ok(!proibido.test(t), 'bilhete com tom ruim: ' + t));
    // strings entre aspas simples/duplas dos dois arquivos de ciclo, sem comentarios
    arquivos.forEach((src, i) => {
      const semComentario = src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');
      (semComentario.match(/'[^'\n]{12,}'/g) || []).concat(semComentario.match(/"[^"\n]{12,}"/g) || []).forEach((t) => {
        if (/class=|<\/|viewBox|svg|function|=>/.test(t)) return;
        A.ok(!proibido.test(t), 'texto com tom ruim em ' + ['ciclo.js', 'ciclo-ui.js'][i] + ': ' + t);
      });
    });
    textos.forEach((t) => A.ok(!/—|–/.test(t), 'travessao no bilhete: ' + t));
    A.ok(!/—/.test(arquivos[1].replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '')), 'travessao em texto de tela do ciclo');
  });

  await teste('25. nada pago: nenhuma recompensa, congelador ou bau tem preco em dinheiro de verdade', () => {
    const src = fs.readFileSync(path.join(__dirname, '..', 'src', 'interface', 'ciclo.js'), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
    A.ok(!/R\$|comprar|preço|preco|pagamento|assin/i.test(src), 'ciclo.js fala de compra');
  });

  await teste('26. eventos do ciclo foram registrados sem dado pessoal', () => {
    const a = novoApp();
    for (let i = 0; i < 3; i++) bloco(a, 0, i);
    a.avaliar('abrirBau()'); a.avaliar("registrarParada('terminar')");
    const ev = JSON.parse(a.guarda['universo-bobby-eventos-v1']).itens;
    const nomes = new Set(ev.map((e) => e.e));
    ['perfil_criado', 'bloco_inicio', 'bloco_fim', 'meta_cheia', 'bau_aberto', 'parada_vista'].forEach((n) => A.ok(nomes.has(n), 'faltou evento ' + n));
    A.ok(!JSON.stringify(ev).includes('Zeca'), 'o apelido vazou para os eventos');
    ev.forEach((e) => A.ok(typeof e.pid === 'string' && e.pid.length >= 8 && e.pid !== 'Zeca'));
  });

  resumo('ciclo.js');
})();
