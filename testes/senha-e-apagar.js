#!/usr/bin/env node
'use strict';
/* PIN do responsavel (PBKDF2, sal proprio, espera apos erros, migracao do hash antigo) e apagar dados (perfil e aparelho inteiro).
   Uso: node testes/senha-e-apagar.js */
const fs = require('fs');
const path = require('path');
const A = require('assert');
const { carregarApp } = require('./lib/carregar.js');
const { teste, resumo } = require('./lib/mini.js');
const FIX = fs.readFileSync(path.join(__dirname, 'fixtures', 'estado-v3-exemplo.json'), 'utf8');
const quando = (a, m, d, h) => new Date(a, m - 1, d, h || 12, 0, 0).getTime();
const abrir = (arm, rel) => carregarApp(5, { armazenamento: arm || {}, relogio: rel || { ms: quando(2026, 10, 24, 10) } });
const ev = (app, js) => app.avaliar('(async()=>{' + js + '})()');

(async () => {
  await teste('1. definirSenha: PBKDF2, sal de 16 bytes em hex, hash de 32 bytes; mesmo PIN com sal diferente da hash diferente', async () => {
    const a = abrir();
    await ev(a, "await definirSenha('1234');");
    const s1 = JSON.parse(JSON.stringify(a.avaliar('STORE.senha')));
    A.strictEqual(s1.v, 2); A.ok(/^[0-9a-f]{32}$/.test(s1.s)); A.ok(/^[0-9a-f]{64}$/.test(s1.h)); A.strictEqual(s1.it, 150000);
    await ev(a, "await definirSenha('1234');");
    const s2 = JSON.parse(JSON.stringify(a.avaliar('STORE.senha')));
    A.notStrictEqual(s1.s, s2.s); A.notStrictEqual(s1.h, s2.h);
    A.ok(!JSON.stringify(s2).includes('1234'));
  });
  await teste('2. conferir: PIN certo passa, errado nao; 5 erros seguidos travam (mesmo o PIN certo) e a espera cresce', async () => {
    const a = abrir({}, { ms: quando(2026, 10, 24, 10) });
    await ev(a, "await definirSenha('4321');");
    A.strictEqual(await ev(a, "return await conferirSenha('4321')"), true);
    for (let i = 0; i < 4; i++) A.strictEqual(await ev(a, "return await conferirSenha('0000')"), false);
    A.strictEqual(a.avaliar('esperaDoPin()'), 0, 'travou cedo demais');
    await ev(a, "await conferirSenha('0000')");
    const e1 = a.avaliar('esperaDoPin()');
    A.ok(e1 > 20000 && e1 <= 30000, 'primeira espera deveria ser de 30 s: ' + e1);
    A.strictEqual(await ev(a, "return await conferirSenha('4321')"), false, 'o PIN certo passou durante a espera');
    a.avaliar('STORE.senha.b=0');                       // passou a espera
    await ev(a, "await conferirSenha('0000')");
    const e2 = a.avaliar('esperaDoPin()');
    A.ok(e2 > e1 + 20000, 'a espera deveria dobrar: ' + e1 + ' -> ' + e2);
    a.avaliar('STORE.senha.b=0');
    A.strictEqual(await ev(a, "return await conferirSenha('4321')"), true);
    A.strictEqual(a.avaliar('STORE.senha.e'), 0, 'acerto zera a contagem');
  });
  await teste('3. senha antiga (hash simples) continua valendo e vira PBKDF2 no primeiro acerto', async () => {
    const a = abrir();
    a.avaliar("STORE.senha={s:'sabc123',h:hashLegado('2580','sabc123')}");
    A.strictEqual(await ev(a, "return await conferirSenha('0000')"), false);
    A.strictEqual(a.avaliar('STORE.senha.v'), undefined, 'erro nao deveria migrar');
    A.strictEqual(await ev(a, "return await conferirSenha('2580')"), true);
    A.strictEqual(a.avaliar('STORE.senha.v'), 2);
    A.strictEqual(await ev(a, "return await conferirSenha('2580')"), true);
  });
  await teste('4. migracao do v3 mantem a senha antiga igual (fixture) e arrumarStore aceita os dois formatos, rejeitando lixo', () => {
    const a = abrir({ 'mundo-numeros-v2': FIX });
    A.ok(a.avaliar('STORE.senha&&STORE.senha.h'));
    const lixo = a.avaliar("arrumarStore({perfis:[],senha:{v:2,s:'xx',h:'yy',b:99999999999999}}).senha");
    A.strictEqual(lixo.v, undefined);           // formato v2 invalido cai no formato simples
    const bom = a.avaliar("arrumarStore({perfis:[],senha:{v:2,s:'" + 'a'.repeat(32) + "',h:'" + 'b'.repeat(64) + "',it:150000,e:2,b:99999999999999}}).senha");
    A.strictEqual(bom.v, 2); A.ok(bom.b <= a.avaliar('Date.now()') + 900000 + 5, 'bloqueio acima de 15 min');
  });
  await teste('5. apagar jogador limpa os rastros dele nas chaves antigas (v3, copia bruta, corrompido)', () => {
    const a = abrir({ 'mundo-numeros-v2': FIX });
    A.ok(a.guarda['mundo-numeros-v2.bak-v3'], 'a migracao deveria ter criado a copia');
    a.guarda['universo-bobby-v4.corrompido'] = '{lixo com dado de crianca';
    const id0 = a.avaliar('STORE.perfis[0].id'), n0 = JSON.parse(FIX).perfis.length;
    a.avaliar('apagarPerfil(0)');
    const v3 = JSON.parse(a.guarda['mundo-numeros-v2']);
    A.strictEqual(v3.perfis.length, n0 - 1); A.ok(!v3.perfis.some((p) => p.id === id0), 'perfil apagado ainda esta no v3');
    const bak = JSON.parse(a.guarda['mundo-numeros-v2.bak-v3']);
    A.ok(!bak.perfis.some((p) => p.id === id0), 'perfil apagado ainda esta na copia bruta');
    A.strictEqual(a.guarda['universo-bobby-v4.corrompido'], undefined);
    A.ok(!JSON.stringify(a.guarda).includes(JSON.parse(FIX).perfis[0].nome) || JSON.parse(FIX).perfis.slice(1).some((p) => p.nome === JSON.parse(FIX).perfis[0].nome));
  });
  await teste('6. apagar tudo: remove todas as chaves do app, esvazia o estado e so apaga caches se pedido', async () => {
    const a = abrir({ 'mundo-numeros-v2': FIX, 'outra-coisa': 'fica', 'universo-bobby-eventos-v1': '[]' });
    a.guarda['universo-bobby-v4.corrompido'] = 'x';
    const r = await ev(a, "return await apagarTudoDoAparelho({caches:false})");
    ['universo-bobby-v4', 'mundo-numeros-v2', 'mundo-numeros-v2.bak-v3', 'universo-bobby-v4.corrompido', 'universo-bobby-eventos-v1'].forEach((k) => A.strictEqual(a.guarda[k], undefined, k + ' sobrou'));
    A.strictEqual(a.guarda['outra-coisa'], 'fica', 'apagou chave que nao e do app');
    A.strictEqual(a.avaliar('STORE.perfis.length'), 0); A.strictEqual(a.avaliar('STORE.senha'), null);
    A.ok(r.chaves.length >= 4);
  });
  await teste('7. a tela do responsavel tem o botao, o fluxo em dois passos exige senha (ou a palavra APAGAR) e o texto diz que a senha e uma trava local', () => {
    const src = fs.readFileSync(path.join(__dirname, '..', 'src', 'interface', 'perfil-e-responsavel.js'), 'utf8');
    A.ok(/Apagar todos os dados deste aparelho/.test(src) && /apagarTudoPasso1/.test(src) && /apagarTudoPasso2/.test(src));
    A.ok(/conferirSenha\(v\)/.test(src) && /'APAGAR'/.test(src));
    A.ok(/trava neste aparelho/.test(src) && /controle parental com valor legal/.test(src));
  });
  resumo('senha-e-apagar.js');
})();
