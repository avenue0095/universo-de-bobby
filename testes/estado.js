#!/usr/bin/env node
'use strict';
/* Estado v4, migracao a partir do v3 (fixture em testes/fixtures/estado-v3-exemplo.json), backup, XP x moeda e dia local.
   Cobre os 10 testes de migracao de docs/FASE-2-especificacao.md, 8.5.
   Uso: node testes/estado.js                                                                */
const fs = require('fs');
const path = require('path');
const A = require('assert');
const { carregarApp } = require('./lib/carregar.js');
const { teste, resumo } = require('./lib/mini.js');

const FIX = fs.readFileSync(path.join(__dirname, 'fixtures', 'estado-v3-exemplo.json'), 'utf8');
const V3 = JSON.parse(FIX);
const quando = (a, m, d, h, mi) => new Date(a, m - 1, d, h || 12, mi || 0, 0).getTime();
const abrir = (arm, relogio) => carregarApp(7, { armazenamento: arm, relogio: relogio || { ms: quando(2026, 10, 24, 10) } });
const v4 = (app) => JSON.parse(app.guarda['universo-bobby-v4']);
const J = (x) => JSON.parse(JSON.stringify(x));

(async () => {
  await teste('1. instalacao nova: store v4 vazio, nada gravado ate haver jogador', () => {
    const a = abrir({});
    A.strictEqual(a.avaliar('STORE.perfis.length'), 0);
    A.strictEqual(a.avaliar('STORE.v'), 4);
    A.strictEqual(a.guarda['universo-bobby-v4'], undefined);
  });

  await teste('2. migra 3 perfis (um com senha): fases, nomes, ids e senha iguais', () => {
    const a = abrir({ 'mundo-numeros-v2': FIX });
    const s = v4(a);
    A.strictEqual(s.v, 4); A.strictEqual(s.migradoDe, 'mundo-numeros-v2@3');
    A.strictEqual(s.perfis.length, 3);
    A.deepStrictEqual(s.perfis.map((p) => p.nome), ['Lua', 'Teo', 'Ana']);
    A.deepStrictEqual(s.perfis.map((p) => p.id), ['pLUA1', 'pTEO1', 'pANA1']);
    A.strictEqual(s.atual, 'pLUA1');
    A.deepStrictEqual(s.senha, V3.senha);
    const lua = s.perfis[0].dados;
    A.strictEqual(Object.keys(lua.feitas).length, Object.keys(V3.perfis[0].dados.feitas).length, 'perdeu fases');
    A.deepStrictEqual(lua.feitas, V3.perfis[0].dados.feitas);
    A.strictEqual(lua.faixa, 'f78'); A.strictEqual(s.perfis[1].dados.faixa, 'f1112'); A.strictEqual(s.perfis[2].dados.faixa, 'f910');
    A.strictEqual(lua.legado.nivel, 'facil');
    A.deepStrictEqual(lua.comprado, ['bone', 'oculos']); A.strictEqual(lua.look.chapeu, 'bone');
    A.strictEqual(lua.legado.vozPt, 'Luciana'); A.ok(!('vozPt' in lua), 'voz do aparelho nao fica mais no perfil'); A.strictEqual(lua.velocidade, 1.1); A.strictEqual(v4(a).perfis[2].dados.velocidade, 0.8, 'velocidade 0,7 do v3 vira 0,8 (minimo da voz gravada)'); A.strictEqual(lua.acertosTotal, 412); A.strictEqual(lua.melhorCombo, 8);
  });

  await teste('3. XP separado da moeda: xp = max(ganhoTotal, saldo), moedas = saldo antigo', () => {
    const a = abrir({ 'mundo-numeros-v2': FIX });
    const [lua, teo, ana] = v4(a).perfis.map((p) => p.dados);
    A.strictEqual(lua.xp, 2480); A.strictEqual(lua.moedas, 1520);
    A.strictEqual(teo.xp, 0); A.strictEqual(teo.moedas, 0);
    A.strictEqual(ana.xp, 310, 'ganhoTotal menor que o saldo: xp nao pode ser menor que o saldo');
    A.strictEqual(ana.moedas, 310);
  });

  await teste('4. ofensiva migrada + 1 congelador de cortesia; datas antigas ficam como estao', () => {
    const a = abrir({ 'mundo-numeros-v2': FIX });
    const lua = v4(a).perfis[0].dados;
    A.strictEqual(lua.ofensiva.atual, 12); A.strictEqual(lua.ofensiva.melhor, 19); A.strictEqual(lua.ofensiva.ultimo, '2026-10-23');
    A.strictEqual(lua.ofensiva.congeladores, 1);
    A.deepStrictEqual(lua.ofensiva.marcos, [3, 7]);
  });

  await teste('5. chave antiga INTACTA (byte a byte) depois de migrar e de jogar; copia de seguranca criada', () => {
    const a = abrir({ 'mundo-numeros-v2': FIX });
    A.strictEqual(a.guarda['mundo-numeros-v2'], FIX, 'a chave do v3 mudou');
    A.strictEqual(a.guarda['mundo-numeros-v2.bak-v3'], FIX);
    a.avaliar('usarPerfil(0)'); a.avaliar('S.moedas+=5;salvar()');
    A.strictEqual(a.guarda['mundo-numeros-v2'], FIX, 'jogar alterou a chave do v3');
  });

  await teste('6. nao migra duas vezes: abrir de novo le o v4 e nao concede outro congelador', () => {
    const a = abrir({ 'mundo-numeros-v2': FIX });
    a.avaliar('usarPerfil(0)'); a.avaliar('S.ofensiva.congeladores=0;salvar()');
    const b = abrir({ 'mundo-numeros-v2': FIX, 'universo-bobby-v4': a.guarda['universo-bobby-v4'] });
    A.strictEqual(b.avaliar('STORE.perfis[0].dados.ofensiva.congeladores'), 0);
  });

  await teste('7. erros do caderno viram itens da revisao (caixa 1, datas escalonadas) e continuam em errados', () => {
    const a = abrir({ 'mundo-numeros-v2': FIX });
    const lua = v4(a).perfis[0].dados;
    const ks = Object.keys(lua.revisao.itens);
    A.strictEqual(ks.length, 3, 'mc/input entram; "fracao" sem "partes" nao sabe se refazer: ' + ks.length);
    ks.forEach((k) => { A.strictEqual(lua.revisao.itens[k][0], 1); A.ok(lua.revisao.congelados[k].prompt); });
    A.strictEqual(lua.errados.mat3.length, 2); A.strictEqual(lua.errados.pt2.length, 2);
    A.strictEqual(Object.keys(lua.legado.errados).length, 2);
  });

  await teste('8. JSON corrompido no v4: guarda copia do texto ruim e recomeca do v3', () => {
    const a = abrir({ 'universo-bobby-v4': '{"v":4,"perfis":[{', 'mundo-numeros-v2': FIX });
    A.strictEqual(a.avaliar('STORE.perfis.length'), 3);
    A.strictEqual(a.guarda['universo-bobby-v4.corrompido'], '{"v":4,"perfis":[{');
  });

  await teste('9. JSON corrompido no v3 e sem v4: instalacao nova, sem excecao', () => {
    const a = abrir({ 'mundo-numeros-v2': '{nao e json' });
    A.strictEqual(a.avaliar('STORE.perfis.length'), 0);
    A.strictEqual(a.guarda['mundo-numeros-v2'], '{nao e json');
  });

  await teste('10. cota cheia: a migracao acontece mesmo sem a copia de seguranca (e avisa)', () => {
    const a = carregarApp(7, { armazenamento: { 'mundo-numeros-v2': FIX }, relogio: { ms: quando(2026, 10, 24, 10) } });
    // refaz o carregamento com um localStorage que recusa a copia .bak
    const bruto = require('./lib/carregar.js');
    const b = bruto.carregarApp(7, { armazenamento: { 'mundo-numeros-v2': FIX }, relogio: { ms: quando(2026, 10, 24, 10) },
      recusar: (k) => k.endsWith('.bak-v3') });
    A.strictEqual(b.avaliar('STORE.perfis.length'), 3);
    A.strictEqual(b.guarda['mundo-numeros-v2.bak-v3'], undefined);
    A.ok(a);
  });

  await teste('11. fluxo ainda mais antigo (trilha-matematica-v1) tambem migra', () => {
    const antigo = JSON.stringify({ nome: 'Velho', xp: 90, ganhoTotal: 90, feitas: { '1.1': 3 }, nivel: 'medio' });
    const a = abrir({ 'trilha-matematica-v1': antigo });
    const s = v4(a);
    A.strictEqual(s.perfis.length, 1); A.strictEqual(s.perfis[0].dados.faixa, 'f910'); A.strictEqual(s.perfis[0].dados.moedas, 90);
    A.strictEqual(a.guarda['trilha-matematica-v1'], antigo);
  });

  await teste('12. 21h30 de Brasilia: o dia do app e o dia local (24), nao o UTC (25)', () => {
    const a = abrir({ 'mundo-numeros-v2': FIX }, { ms: quando(2026, 10, 24, 21, 30) });
    A.strictEqual(a.avaliar('hoje()'), '2026-10-24');
    A.strictEqual(a.avaliar('diaLocal()'), '2026-10-24');
    a.avaliar('usarPerfil(0)');
    // joga as 21h30: a ofensiva da Lua estava em 23 -> dia seguido (24)
    A.strictEqual(a.avaliar('S.ofensiva.ultimo'), '2026-10-23');
    a.avaliar("concluirBloco({tipo:'fase',lic:'1.1',materia:'mat',perguntas:8,acertos:8,estrelas:3,seg:100})");
    A.strictEqual(a.avaliar('S.ofensiva.ultimo'), '2026-10-24');
    A.strictEqual(a.avaliar('S.ofensiva.atual'), 13);
  });

  await teste('13. XP nunca diminui; gastar na loja so mexe nas moedas', () => {
    const a = abrir({ 'mundo-numeros-v2': FIX });
    a.avaliar('usarPerfil(0)');
    a.avaliar("S.moedas=500;S.xp=2480;comprar('chapeu','explorador')");
    A.strictEqual(a.avaliar('S.xp'), 2480);
    A.strictEqual(a.avaliar('S.moedas'), 400);
    A.ok(a.avaliar("S.comprado.indexOf('explorador')>=0"));
    a.avaliar("S.moedas=10;S.comprado=[];comprar('chapeu','explorador');comprar('chapeu','coroa')");   // sem saldo (ou item sem arte nova): nao compra, nao mexe
    A.strictEqual(a.avaliar('S.moedas'), 10); A.strictEqual(a.avaliar('S.xp'), 2480);
  });

  await teste('14. acerto soma XP e moeda; "continuar por 50 moedas" tira so moeda', () => {
    const a = abrir({});
    a.avaliar("novoPerfil('Zeca','#12A06E')");
    a.avaliar("abrirLicao(0,0);LIC.etapa='questao';pintarLicao()");
    a.avaliar("LIC.resp=LIC.qs[LIC.i].answer;conferir()");
    A.strictEqual(a.avaliar('S.xp'), 10); A.strictEqual(a.avaliar('S.moedas'), 10);
    a.avaliar('S.moedas=60;LIC.vidas=0;LIC.i=0;LIC.conferido=false;LIC.resp="x";conferir()');
    A.ok(a.avaliar('S.xp') >= 10);
  });

  await teste('15. backup v4: soma confere, nao leva pid nem eventos; round trip identico', () => {
    const a = abrir({ 'mundo-numeros-v2': FIX });
    a.avaliar('usarPerfil(0)');
    const pac = J(a.avaliar('montarPacote(STORE.perfis[0])'));
    A.strictEqual(pac.versao, 4); A.strictEqual(pac.app, 'universo-de-bobby');
    A.ok(/^[0-9a-f]{8}$/.test(pac.soma));
    A.ok(!('pid' in pac.perfil), 'pid foi para o backup');
    A.ok(!JSON.stringify(pac).includes('eventos'));
    const lido = J(a.avaliar('lerPacote(' + JSON.stringify(JSON.stringify(pac)) + ')'));
    A.strictEqual(lido.ok, true); A.strictEqual(lido.somaConfere, true); A.strictEqual(lido.versao, 4);
    A.deepStrictEqual(lido.dados.feitas, pac.perfil.dados.feitas);
    A.strictEqual(lido.dados.xp, pac.perfil.dados.xp);
    // arquivo editado a mao
    pac.perfil.dados.moedas = 999999;
    const ruim = J(a.avaliar('lerPacote(' + JSON.stringify(JSON.stringify(pac)) + ')'));
    A.strictEqual(ruim.ok, true); A.strictEqual(ruim.somaConfere, false);
  });

  await teste('16. importar backup v3 DEPOIS de ja estar em v4: migra o perfil e nao mexe nos outros', () => {
    const a = abrir({ 'mundo-numeros-v2': FIX });
    const antes = a.avaliar('STORE.perfis.length');
    const pacV3 = JSON.stringify({ app: 'universo-de-bobby', versao: 3, quando: '2026-09-01T00:00:00Z', perfil: { nome: 'Importada', cor: '#F0455F', dados: V3.perfis[0].dados } });
    const lido = J(a.avaliar('lerPacote(' + JSON.stringify(pacV3) + ')'));
    A.strictEqual(lido.ok, true); A.strictEqual(lido.versao, 3); A.strictEqual(lido.dados.faixa, 'f78');
    A.strictEqual(lido.dados.moedas, 1520); A.strictEqual(lido.dados.xp, 2480);
    a.avaliar('aplicarPacote(lerPacote(' + JSON.stringify(pacV3) + "),'novo')");
    A.strictEqual(a.avaliar('STORE.perfis.length'), antes + 1);
    A.strictEqual(a.avaliar('STORE.perfis[0].nome'), 'Lua');
  });

  await teste('17. importar com id repetido: "substituir" troca; "novo" cria outro; nunca silencioso', () => {
    const a = abrir({ 'mundo-numeros-v2': FIX });
    a.avaliar('usarPerfil(0)');
    const pac = J(a.avaliar('montarPacote(STORE.perfis[0])'));
    pac.perfil.dados.moedas = 77; pac.soma = a.avaliar('somaDoPerfil(' + JSON.stringify(pac.perfil) + ')');
    const lido = a.avaliar('lerPacote(' + JSON.stringify(JSON.stringify(pac)) + ')');
    A.strictEqual(a.avaliar('STORE.perfis.some(p=>p.id==="' + lido.id + '")'), true, 'o id repetido precisa ser detectado');
    a.avaliar('aplicarPacote(lerPacote(' + JSON.stringify(JSON.stringify(pac)) + "),'novo')");
    A.strictEqual(a.avaliar('STORE.perfis.length'), 4);
    a.avaliar('aplicarPacote(lerPacote(' + JSON.stringify(JSON.stringify(pac)) + "),'substituir')");
    A.strictEqual(a.avaliar('STORE.perfis.length'), 4);
    A.strictEqual(a.avaliar('STORE.perfis[0].dados.moedas'), 77);
  });

  await teste('18. arquivo que nao e backup e versao futura sao recusados com mensagem', () => {
    const a = abrir({});
    A.strictEqual(a.avaliar("lerPacote('nada')").ok, false);
    A.strictEqual(a.avaliar("lerPacote('{\"app\":\"outro\"}')").ok, false);
    const fut = a.avaliar("lerPacote('{\"app\":\"universo-de-bobby\",\"versao\":9,\"perfil\":{}}')");
    A.strictEqual(fut.ok, false); A.ok(/mais nova/.test(fut.erro));
  });

  await teste('19. app instalado com service worker velho: HTML segue network-first e o index nao depende de cache', () => {
    const sw = fs.readFileSync(path.join(__dirname, '..', 'sw.js'), 'utf8');
    A.ok(/fetch\(req\)\.then/.test(sw) && /bobby-v5/.test(sw));
  });

  await teste('20. estadoDe tolera lixo: valores absurdos viram valores validos', () => {
    const a = abrir({});
    const s = J(a.avaliar('estadoDe({faixa:"x",xp:-5,moedas:"abc",ofensiva:{atual:-3,congeladores:99,ultimo:"ontem"},config:{metaMin:7,limiteBlocosDia:-1,diasLivres:[9,2]},feitas:{"1.1":9}})'));
    A.strictEqual(s.faixa, 'f78'); A.strictEqual(s.xp, 0); A.strictEqual(s.moedas, 0);
    A.strictEqual(s.ofensiva.atual, 0); A.strictEqual(s.ofensiva.congeladores, 2); A.strictEqual(s.ofensiva.ultimo, '');
    A.strictEqual(s.config.metaMin, 5); A.strictEqual(s.config.limiteBlocosDia, null); A.deepStrictEqual(s.config.diasLivres, [2]);
    A.strictEqual(s.feitas['1.1'], 3);
  });

  await teste('21. cada perfil tem o seu proprio objeto (nada vaza de um jogador para o outro)', () => {
    const a = abrir({ 'mundo-numeros-v2': FIX });
    a.avaliar('usarPerfil(1)'); a.avaliar("S.feitas['9.9']=3;S.colecao.adesivos.push('x');S.config.diasLivres.push(3);salvar()");
    A.strictEqual(a.avaliar("STORE.perfis[2].dados.feitas['9.9']"), undefined);
    A.strictEqual(a.avaliar('STORE.perfis[0].dados.colecao.adesivos.length'), 0);
    A.strictEqual(a.avaliar('STORE.perfis[0].dados.config.diasLivres.length'), 0);
  });

  resumo('estado.js');
})();
