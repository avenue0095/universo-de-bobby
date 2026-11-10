#!/usr/bin/env node
'use strict';
/* Nuvem sem conta (Fase 4, S5 do docs/fase4/PLANO.md): merge local, outbox, migração da primeira conta e modo offline.
   O servidor aqui é FALSO e escrito à parte, seguindo o SQL de supabase/migrations/0003_rpc.sql (sincronizar_perfil e snapshot_perfil)
   e os gatilhos so_cresce do 0001, com as moedas por aparelho da 0006 (moedas_aparelho: contador de cada aparelho só cresce,
   total = soma; chamada sem aparelho_id conta no aparelho 'legado'); não usa nada do nuvem.js. Os casos 1 a 3 repetem os números do caso 13 de supabase/testes/rls.sql.
   O transporte é falso também: nada de rede, nada de supabase-js.
   Uso: node testes/nuvem.js */
const A = require('assert');
const { carregarApp } = require('./lib/carregar.js');
const { teste, resumo } = require('./lib/mini.js');
const J = (x) => JSON.parse(JSON.stringify(x));

/* ---------------------------------------------------------------- servidor falso (regras do SQL) */
function servidorFalso() {
  const BLOCOS = ['look', 'config', 'ofensiva', 'colecao', 'desenhos', 'revisao_meta', 'prefs'];
  const perfis = new Map();   // id -> {perfil, estado, fases: Map, itens: Map, dias: Map}
  let n = 0;
  const mx = (a, b) => Math.max(+a || 0, +b || 0);
  const novoEstado = () => ({ xp: 0, moedas_ganhas: 0, moedas_gastas: 0, acertos_total: 0, melhor_combo: 0, comprado: [], materia: 'mat',
    look: {}, config: {}, ofensiva: {}, colecao: {}, desenhos: {}, revisao_meta: {}, prefs: {}, blocos_em: {}, versao_app: null });
  function snapshot(id) {
    const p = perfis.get(id);
    const e = Object.assign({}, p.estado, { moedas: Math.max(p.estado.moedas_ganhas - p.estado.moedas_gastas, 0) });
    const moedas = [...p.moedas.entries()].sort().map(([aparelho_id, m]) => ({ aparelho_id, ganhas: m.ganhas, gastas: m.gastas }));
    return J({ perfil: p.perfil, estado: e, moedas_aparelhos: moedas, fases: [...p.fases.values()], itens: [...p.itens.values()], dias: [...p.dias.values()], baixado_em: new Date().toISOString() });
  }
  return {
    perfis, chamadas: { criar: 0, sincronizar: 0, snapshot: 0 }, falhar: null,
    criarPerfil(dados) {
      this.chamadas.criar++;
      if (this.falhar === 'criar') return Promise.reject(new Error('rede'));
      for (const [id, p] of perfis) if (p.perfil.id_local === dados.id_local) return Promise.resolve({ id });   // unique(responsavel_id, id_local)
      const id = '00000000-0000-4000-8000-' + String(++n).padStart(12, '0');
      perfis.set(id, { perfil: J(Object.assign({ id }, dados)), estado: novoEstado(), moedas: new Map(), fases: new Map(), itens: new Map(), dias: new Map() });
      return Promise.resolve({ id });
    },
    sincronizarPerfil(id, est, fases, itens, dias) {
      this.chamadas.sincronizar++;
      if (this.falhar === 'sincronizar') return Promise.reject(new Error('rede'));
      const p = perfis.get(id); if (!p) return Promise.reject(new Error('42501'));
      est = J(est); const e = p.estado;
      for (const k of BLOCOS.concat('materia')) {   // 3a: carimbo mais novo do bloco vence
        const novo = est.blocos_em && est.blocos_em[k], velho = e.blocos_em[k];
        if (novo && (!velho || Date.parse(novo) > Date.parse(velho)) && k in est) { e[k] = k === 'materia' ? (['mat', 'pt', 'en'].includes(est[k]) ? est[k] : e[k]) : est[k]; e.blocos_em[k] = novo; }
      }
      e.comprado = [...new Set(e.comprado.concat((est.comprado || []).filter((x) => typeof x === 'string')))];   // 3b: união
      for (const k of ['xp', 'acertos_total', 'melhor_combo']) e[k] = mx(e[k], est[k]);   // greatest
      // 3c (0006): contador do aparelho só cresce; total = soma dos aparelhos
      const ap = typeof est.aparelho_id === 'string' && /^[A-Za-z0-9_-]{6,64}$/.test(est.aparelho_id) ? est.aparelho_id : 'legado';
      const m0 = p.moedas.get(ap) || { ganhas: 0, gastas: 0 };
      p.moedas.set(ap, { ganhas: mx(m0.ganhas, est.moedas_ganhas), gastas: mx(m0.gastas, est.moedas_gastas) });
      let sg = 0, ss = 0; for (const m of p.moedas.values()) { sg += m.ganhas; ss += m.gastas; }
      e.moedas_ganhas = mx(e.moedas_ganhas, sg); e.moedas_gastas = mx(e.moedas_gastas, ss);
      for (const f of J(fases || [])) {   // 4: fases só crescem
        const v = p.fases.get(f.fase_id);
        const nf = { fase_id: f.fase_id, materia: f.materia, estrelas: Math.min(3, Math.max(0, f.estrelas || 0)), acertos: f.acertos || 0, erros: f.erros || 0, tempo_seg: f.tempo_seg || 0, concluida_em: f.concluida_em || null };
        if (!v) p.fases.set(f.fase_id, nf);
        else { v.estrelas = mx(v.estrelas, nf.estrelas); v.acertos = mx(v.acertos, nf.acertos); v.erros = mx(v.erros, nf.erros); v.tempo_seg = mx(v.tempo_seg, nf.tempo_seg); }
      }
      for (const i of J(itens || [])) {   // 5: carimbo do aparelho mais novo vence
        const v = p.itens.get(i.chave);
        const ni = { chave: i.chave, materia: i.materia, caixa: Math.min(5, Math.max(1, i.caixa || 1)), proxima: i.proxima || null, vezes: i.vezes || 0, acertos: i.acertos || 0,
          lapsos: i.lapsos || 0, ultimo: i.ultimo || null, pergunta: i.chave.startsWith('er:') ? (i.pergunta || null) : null, removido: !!i.removido, carimbo: i.carimbo };
        if (!v) p.itens.set(i.chave, ni);
        else if (Date.parse(ni.carimbo) > Date.parse(v.carimbo)) {
          p.itens.set(i.chave, Object.assign(ni, { vezes: mx(v.vezes, ni.vezes), acertos: mx(v.acertos, ni.acertos), lapsos: mx(v.lapsos, ni.lapsos), pergunta: ni.pergunta || v.pergunta }));
        }
      }
      for (const d of J(dias || [])) {   // 6: dias só crescem, campo a campo
        const v = p.dias.get(d.dia) || { dia: d.dia, blocos: 0, perguntas: 0, acertos: 0, revisoes: 0, segundos: 0 };
        for (const k of ['blocos', 'perguntas', 'acertos', 'revisoes']) v[k] = mx(v[k], d[k]);
        v.segundos = mx(v.segundos, Math.min(86400, d.segundos || 0));
        p.dias.set(d.dia, v);
      }
      return Promise.resolve(snapshot(id));
    },
    snapshotPerfil(id) { this.chamadas.snapshot++; return Promise.resolve(snapshot(id)); },
    snapshot,
  };
}

/* ---------------------------------------------------------------- app com a nuvem ligada ao servidor falso */
function montar(semente, opc) {
  opc = opc || {};
  const relogio = { ms: Date.parse('2026-11-10T12:00:00Z') };
  const a = carregarApp(semente || 3, { relogio });
  const srv = opc.servidor || servidorFalso();
  const timers = [];
  const ouvintes = {};
  const rede = { online: opc.online !== false };
  Object.assign(a.ctx, {
    __srv: srv, __timers: timers, __ouvintes: ouvintes, __rede: rede, __rel: relogio,
  });
  a.avaliar(`NUVEM=criarNuvem({config:{url:'https://projeto-falso.supabase.test',anon:'anon-falsa'},transporte:__srv,
    armazem:{ler:k=>localStorage.getItem(k),gravar:(k,v)=>localStorage.setItem(k,v)},
    agora:()=>new Date(__rel.ms),agendar:(f,ms)=>{const t={f,ms};__timers.push(t);return t;},desagendar:t=>{if(t)t.f=null;},
    online:()=>__rede.online,preco:precoDe,perfis:()=>STORE.perfis,atual:()=>STORE.atual,
    dadosDe:i=>i===STORE.atual?S:STORE.perfis[i].dados,persistir:i=>{if(i===STORE.atual)STORE.perfis[i].dados=S;salvarStore();},
    ouvir:(ev,f)=>{(__ouvintes[ev]=__ouvintes[ev]||[]).push(f);}})`);
  const passa = (ms) => { relogio.ms += ms; };
  /* roda só o que o app agendou e espera terminar (nada de empurrar por fora: o teste mede o que o app faz sozinho) */
  const rodarTimers = async () => { const ts = timers.splice(0); for (const t of ts) if (t.f) await t.f(); };
  const disparar = async (ev) => { for (const f of ouvintes[ev] || []) await f(); };
  return { a, srv, rede, passa, rodarTimers, disparar, relogio, timers };
}
/* perfil local já migrado para a nuvem (sem progresso), pronto para os casos de merge */
async function comPerfil(semente, opc) {
  const m = montar(semente, opc);
  m.a.avaliar("novoPerfil('Zeca','#12A06E')");
  const r = J(await m.a.avaliar('NUVEM.migrarPrimeiraConta()'));
  A.strictEqual(r.ok, true, 'migração do perfil vazio falhou');
  m.id = m.a.avaliar('NUVEM.registro(STORE.perfis[0].id).nuvemId');
  return m;
}
const subir = (m) => { m.passa(61000); return m.a.avaliar('NUVEM.empurrar("forcado")'); };
const servidorEstado = (m) => m.srv.snapshot(m.id);

(async () => {
  /* ======================================================== (a) os 7 casos de merge */
  await teste('a1. estrela menor nao reduz: banco com 3 estrelas na 1.1, aparelho com 1, os dois ficam com 3 (rls.sql caso 13)', async () => {
    const m = await comPerfil(11);
    await m.srv.sincronizarPerfil(m.id, { blocos_em: {} }, [{ fase_id: '1.1', materia: 'mat', estrelas: 3, acertos: 5, erros: 0, tempo_seg: 60 }], [], []);
    m.a.avaliar("S.feitas['1.1']=1;S.feitas['1.2']=2;S.stats.porLicao['1.1']={acertos:3,erros:0};salvar()");
    await subir(m);
    A.strictEqual(m.a.avaliar("S.feitas['1.1']"), 3);
    A.strictEqual(m.a.avaliar("S.feitas['1.2']"), 2);
    A.strictEqual(m.a.avaliar("S.stats.porLicao['1.1'].acertos"), 5);
    const f = servidorEstado(m).fases.find((x) => x.fase_id === '1.1');
    A.deepStrictEqual([f.estrelas, f.acertos], [3, 5]);
  });

  await teste('a2. ganhas e gastas maiores vencem e gastar nao devolve moeda: ganhou 120, comprou o Teo por 80, aparelho atrasado manda menos (rls.sql caso 13)', async () => {
    const m = await comPerfil(12);
    m.a.avaliar('S.xp=500;S.moedas+=120;salvar()');
    await subir(m);
    A.deepStrictEqual([servidorEstado(m).estado.moedas_ganhas, servidorEstado(m).estado.moedas], [120, 120]);
    m.a.avaliar("S.moedas-=80;S.comprado.push('teo');salvar()");
    await subir(m);
    let e = servidorEstado(m).estado;
    A.deepStrictEqual([e.moedas_ganhas, e.moedas_gastas, e.moedas], [120, 80, 40]);
    A.strictEqual(m.a.avaliar('S.moedas'), 40, 'o saldo local voltou para 120: gastar foi desfeito');
    // mensagem atrasada DESTE aparelho (mesmo aparelho_id, contador velho) chega depois: nada volta
    const ap = m.a.avaliar('NUVEM.aparelho()');
    await m.srv.sincronizarPerfil(m.id, { aparelho_id: ap, xp: 10, moedas_ganhas: 5, moedas_gastas: 0, comprado: ['rufa'], blocos_em: {} }, [], [], []);
    e = servidorEstado(m).estado;
    A.deepStrictEqual([e.xp, e.moedas_ganhas, e.moedas_gastas, e.moedas], [500, 120, 80, 40]);
    m.passa(61000);
    await m.a.avaliar('NUVEM.puxar(0)');
    A.deepStrictEqual(J(m.a.avaliar('[S.xp,S.moedas]')), [500, 40]);
  });

  await teste('a3. comprado e uniao: aparelho com teo, banco com rufa (de outro tablet), os dois ficam com os dois', async () => {
    const m = await comPerfil(13);
    await m.srv.sincronizarPerfil(m.id, { comprado: ['rufa'], moedas_ganhas: 900, moedas_gastas: 900, blocos_em: {} }, [], [], []);
    m.a.avaliar("S.moedas+=500;salvar();S.moedas-=500;S.comprado.push('teo');salvar()");
    await subir(m);
    A.deepStrictEqual(J(m.a.avaliar('S.comprado.slice().sort()')), ['rufa', 'teo']);
    A.deepStrictEqual(servidorEstado(m).estado.comprado.slice().sort(), ['rufa', 'teo']);
    // as duas compras pagas: o saldo nunca fica negativo nem ganha moeda de graça
    A.strictEqual(m.a.avaliar('S.moedas'), Math.max(0, servidorEstado(m).estado.moedas_ganhas - servidorEstado(m).estado.moedas_gastas));
  });

  await teste('a4. look mais novo vence: carimbo do banco mais novo troca o look do aparelho; carimbo do aparelho mais novo troca o do banco', async () => {
    const m = await comPerfil(14);
    m.a.avaliar("S.look.cabeca='bone';salvar()");   // carimbo do aparelho: 12:00
    await m.srv.sincronizarPerfil(m.id, { look: { cabeca: 'coroa' }, blocos_em: { look: '2026-11-10T13:00:00Z' } }, [], [], []);   // outro tablet às 13:00
    await subir(m);
    A.strictEqual(m.a.avaliar('S.look.cabeca'), 'coroa');
    A.strictEqual(servidorEstado(m).estado.look.cabeca, 'coroa');
    m.passa(3600000);   // 14:01: a criança troca de novo neste aparelho
    m.a.avaliar("S.look.cabeca='gorro';salvar()");
    await subir(m);
    A.strictEqual(servidorEstado(m).estado.look.cabeca, 'gorro');
    A.strictEqual(m.a.avaliar('S.look.cabeca'), 'gorro');
  });

  await teste('a5. item de revisao mais novo vence (contadores pelo maior); item antigo do banco nao desfaz o do aparelho', async () => {
    const m = await comPerfil(15);
    m.a.avaliar("S.revisao.congelados['er:abc12345']={type:'mc',prompt:'2+2?',answer:'4',options:['4','5'],m:'mat',f:'1.1',w:1,sk:''};S.revisao.itens['er:abc12345']=[1,'2026-11-11',1,0,1,'2026-11-10',1,0];salvar()");
    await subir(m);
    A.strictEqual(servidorEstado(m).itens[0].caixa, 1);
    // outro tablet respondeu certo depois (carimbo mais novo): caixa 2, 2 vezes
    await m.srv.sincronizarPerfil(m.id, { blocos_em: {} }, [], [{ chave: 'er:abc12345', materia: 'mat', caixa: 2, proxima: '2026-11-14', vezes: 2, acertos: 1, lapsos: 1, ultimo: '2026-11-11', carimbo: '2026-11-11T09:00:00Z' }], []);
    m.passa(3600000);
    await m.a.avaliar('NUVEM.puxar(0)');
    A.deepStrictEqual(J(m.a.avaliar("S.revisao.itens['er:abc12345']")), [2, '2026-11-14', 2, 1, 1, '2026-11-11', 1, 0]);
    // aparelho atrasado manda o item velho (carimbo antigo): o banco não volta para a caixa 1
    await m.srv.sincronizarPerfil(m.id, { blocos_em: {} }, [], [{ chave: 'er:abc12345', materia: 'mat', caixa: 1, proxima: '2026-11-11', vezes: 1, acertos: 0, lapsos: 1, ultimo: '2026-11-10', carimbo: '2026-11-10T12:00:00Z' }], []);
    A.strictEqual(servidorEstado(m).itens[0].caixa, 2);
    // e o aparelho, mexendo depois, vence
    m.relogio.ms = Date.parse('2026-11-12T10:00:00Z');
    m.a.avaliar("S.revisao.itens['er:abc12345']=[3,'2026-11-19',3,2,1,'2026-11-12',1,0];salvar()");
    await subir(m);
    A.strictEqual(servidorEstado(m).itens[0].caixa, 3);
  });

  await teste('a6. dia pelo maior, campo a campo, nos dois lados', async () => {
    const m = await comPerfil(16);
    await m.srv.sincronizarPerfil(m.id, { blocos_em: {} }, [], [], [{ dia: '2026-11-10', blocos: 1, perguntas: 12, acertos: 3, revisoes: 0, segundos: 900 }]);
    m.a.avaliar("S.stats.dias['2026-11-10']={fases:1,seg:300,b:2,q:8,ac:7,rev:1,revAc:1,bm:{mat:2,pt:0,en:0}};salvar()");
    await subir(m);
    A.deepStrictEqual(J(m.a.avaliar("(d=>[d.b,d.q,d.ac,d.rev,d.seg,d.fases])(S.stats.dias['2026-11-10'])")), [2, 12, 7, 1, 900, 1]);
    const d = servidorEstado(m).dias[0];
    A.deepStrictEqual([d.blocos, d.perguntas, d.acertos, d.revisoes, d.segundos], [2, 12, 7, 1, 900]);
  });

  await teste('a7. depois de 200 acoes simuladas (ganhar, gastar, sincronizar) ganhas - gastas == S.moedas no aparelho e no banco', async () => {
    const m = await comPerfil(17);
    const precos = J(m.a.avaliar("Object.keys(PRECOS.look).map(k=>[k,PRECOS.look[k]])"));
    let rnd = 99;
    const r = () => { rnd = (rnd * 1103515245 + 12345) % 2147483648; return rnd / 2147483648; };
    for (let i = 0; i < 200; i++) {
      const x = r();
      if (x < 0.55) m.a.avaliar('S.moedas+=' + (1 + Math.floor(r() * 30)) + ';salvar()');
      else if (x < 0.8) {
        const [id, p] = precos[Math.floor(r() * precos.length)];
        if (m.a.avaliar("S.moedas>=" + p + "&&S.comprado.indexOf('" + id + "')<0")) m.a.avaliar("S.moedas-=" + p + ";S.comprado.push('" + id + "');salvar()");
      } else if (x < 0.9) { m.a.avaliar('S.xp+=10;salvar()'); }
      else await subir(m);
      const z = J(m.a.avaliar('(r=>[r.razao.ganhas,r.razao.gastas,S.moedas])(NUVEM.registro(STORE.perfis[0].id))'));
      A.strictEqual(z[0] - z[1], z[2], 'acao ' + i + ': ganhas - gastas = ' + (z[0] - z[1]) + ', saldo = ' + z[2]);
    }
    await subir(m);
    const e = servidorEstado(m).estado;
    A.strictEqual(e.moedas_ganhas - e.moedas_gastas, m.a.avaliar('S.moedas'));
    A.ok(e.moedas_gastas > 0 && e.moedas_ganhas > 0, 'o teste precisa ter ganho e gasto');
  });

  await teste('a8. puxar sem empurrar (abrir o app noutro dia): o banco nao desfaz o que o aparelho tem de maior ou mais novo, e traz o que outro tablet ganhou', async () => {
    const m = await comPerfil(18);
    m.a.avaliar("S.feitas['1.3']=1;S.moedas+=50;S.look.cabeca='bone';S.revisao.congelados['er:aaa11111']={type:'mc',prompt:'3+3?',answer:'6',options:['6','7'],m:'mat',f:'1.1',w:1,sk:''};S.revisao.itens['er:aaa11111']=[1,'2026-11-11',1,0,1,'2026-11-10',0,0];salvar()");
    await subir(m);
    // outro tablet: ganhou 30 moedas (o contador DELE), look antigo (carimbo das 12:00), item velho
    await m.srv.sincronizarPerfil(m.id, { aparelho_id: 'tablet-da-sala', moedas_ganhas: 30, look: { cabeca: 'coroa' }, blocos_em: { look: '2026-11-10T12:00:30Z' } }, [], [], []);
    // este aparelho, sem rede para empurrar, muda depois: 3 estrelas na 1.3, outro look, item na caixa 2
    m.passa(3600000);
    m.a.avaliar("S.feitas['1.3']=3;S.look.cabeca='gorro';S.revisao.itens['er:aaa11111']=[2,'2026-11-14',2,1,1,'2026-11-10',0,0];salvar()");
    m.passa(61000);
    A.strictEqual(await m.a.avaliar('NUVEM.puxar(0)'), true);
    A.strictEqual(m.a.avaliar("S.feitas['1.3']"), 3, 'pull reduziu estrelas');
    A.strictEqual(m.a.avaliar('S.look.cabeca'), 'gorro', 'look mais velho do banco venceu o mais novo do aparelho');
    A.strictEqual(m.a.avaliar("S.revisao.itens['er:aaa11111'][0]"), 2, 'item mais velho do banco venceu');
    A.strictEqual(m.a.avaliar('S.moedas'), 80, 'as 30 moedas do outro tablet nao chegaram');
    // e o proximo push leva tudo isso para o banco
    await subir(m);
    const e = servidorEstado(m);
    A.deepStrictEqual([e.estado.look.cabeca, e.fases.find((f) => f.fase_id === '1.3').estrelas, e.itens[0].caixa, e.estado.moedas], ['gorro', 3, 2, 80]);
  });

  await teste('a9. servidor com ganhas MENOR que o aparelho (ganhou offline e puxou antes de empurrar): o merge nao baixa o razao nem o saldo', async () => {
    const m = await comPerfil(19);
    m.a.avaliar('S.moedas+=50;salvar()');   // ganhou 50 sem empurrar ainda (o servidor continua com ganhas 0)
    A.strictEqual(servidorEstado(m).estado.moedas_ganhas, 0);
    m.passa(61000);
    A.strictEqual(await m.a.avaliar('NUVEM.puxar(0)'), true);
    A.strictEqual(m.a.avaliar('S.moedas'), 50, 'o pull devolveu o saldo do servidor (0) por cima do que o aparelho ganhou');
    A.deepStrictEqual(J(m.a.avaliar('(r=>[r.razao.ganhas,r.razao.gastas])(NUVEM.registro(STORE.perfis[0].id))')), [50, 0]);
    await subir(m);
    A.deepStrictEqual([servidorEstado(m).estado.moedas_ganhas, servidorEstado(m).estado.moedas], [50, 50]);
  });

  await teste('a10. o que muda DURANTE o envio continua sujo e sobe no proximo push (limparEnviado so limpa o que foi enviado igual)', async () => {
    const m = await comPerfil(20);
    m.a.avaliar("S.feitas['1.1']=1;salvar()");
    await subir(m);
    // no meio da próxima ida ao servidor, a criança termina a 1.4 e melhora a 1.1 (o relógio anda: carimbo novo)
    const orig = m.srv.sincronizarPerfil.bind(m.srv);
    let uma = true;
    m.srv.sincronizarPerfil = async (...x) => {
      const r = await orig(...x);
      if (uma) { uma = false; m.passa(1000); m.a.avaliar("S.feitas['1.1']=2;S.feitas['1.4']=3;S.xp+=7;salvar()"); }
      return r;
    };
    m.a.avaliar("S.feitas['1.2']=1;salvar()");
    await subir(m);
    const sujo = J(m.a.avaliar('NUVEM.registro(STORE.perfis[0].id).sujo'));
    A.deepStrictEqual(Object.keys(sujo.fases).sort(), ['1.1', '1.4'], 'o que mudou durante o envio deixou de estar sujo');
    A.ok(sujo.estado, 'o xp que mudou durante o envio deixou de estar sujo');
    A.deepStrictEqual(J(m.a.avaliar("[S.feitas['1.1'],S.feitas['1.4']]")), [2, 3], 'a resposta do servidor apagou o que a criança fez durante o envio');
    await subir(m);
    const fs = {}; servidorEstado(m).fases.forEach((f) => { fs[f.fase_id] = f.estrelas; });
    A.deepStrictEqual([fs['1.1'], fs['1.2'], fs['1.4']], [2, 1, 3]);
    A.strictEqual(servidorEstado(m).estado.xp, m.a.avaliar('S.xp'));
    A.deepStrictEqual(J(m.a.avaliar('NUVEM.registro(STORE.perfis[0].id).sujo.fases')), {});
  });

  await teste('a11. dois aparelhos offline (ARQUITETURA 5.5): base 100, o tablet ganha 50 e o celular ganha 30; os dois ficam com 180 e o banco tambem', async () => {
    const srv = servidorFalso();
    const t = await comPerfil(51, { servidor: srv });   // tablet
    t.a.avaliar('S.moedas+=100;salvar()');
    await subir(t);
    A.strictEqual(servidorEstado(t).estado.moedas, 100);
    // o celular entra na mesma conta e puxa o perfil (mesmo nuvemId, aparelho diferente)
    const c = montar(52, { servidor: srv });
    c.a.avaliar("novoPerfil('Zeca','#12A06E')");
    c.a.ctx.__nid = t.id;
    c.a.avaliar("(r=>{r.nuvemId=__nid;r.migradoEm='2026-11-10T12:00:00Z';})(NUVEM.registro(STORE.perfis[0].id)||(NUVEM.marcarSujo(),NUVEM.registro(STORE.perfis[0].id)))");
    c.id = t.id;
    c.passa(61000);
    A.strictEqual(await c.a.avaliar('NUVEM.puxar(0)'), true);
    A.strictEqual(c.a.avaliar('S.moedas'), 100, 'o celular nao recebeu as 100 da base');
    A.notStrictEqual(t.a.avaliar('NUVEM.aparelho()'), c.a.avaliar('NUVEM.aparelho()'));
    // os dois sem rede: o tablet ganha 50, o celular ganha 30 e gasta 20 num chapeu
    t.rede.online = false; c.rede.online = false;
    t.a.avaliar('S.moedas+=50;salvar()');
    c.a.avaliar('S.moedas+=30;salvar()');
    c.a.avaliar('S.moedas-=20;salvar()');
    // a rede volta: os dois empurram, em qualquer ordem
    t.rede.online = true; c.rede.online = true;
    await subir(c); await subir(t);
    let e = servidorEstado(t).estado;
    A.deepStrictEqual([e.moedas_ganhas, e.moedas_gastas, e.moedas], [180, 20, 160], 'o banco perdeu o ganho de um dos aparelhos');
    A.strictEqual(t.a.avaliar('S.moedas'), 160, 'tablet');
    A.strictEqual(c.a.avaliar('S.moedas'), 110, 'o celular subiu antes do tablet: ainda nao sabe dos 50');
    c.passa(61000);
    A.strictEqual(await c.a.avaliar('NUVEM.puxar(0)'), true);   // abrir o app de novo: puxa
    A.strictEqual(c.a.avaliar('S.moedas'), 160, 'celular');
    // repetir os envios (rede ruim, mesma mensagem duas vezes) nao soma de novo
    const apT = t.a.avaliar('NUVEM.aparelho()');
    await srv.sincronizarPerfil(t.id, { aparelho_id: apT, moedas_ganhas: 150, moedas_gastas: 0, blocos_em: {} }, [], [], []);
    await srv.sincronizarPerfil(t.id, { aparelho_id: apT, moedas_ganhas: 150, moedas_gastas: 0, blocos_em: {} }, [], [], []);
    e = servidorEstado(t).estado;
    A.deepStrictEqual([e.moedas_ganhas, e.moedas_gastas, e.moedas], [180, 20, 160]);
    // e o razao de cada aparelho continua fechando: proprio + outros = saldo
    for (const x of [t, c]) {
      const z = J(x.a.avaliar('(r=>[r.razao.ganhas+Object.values(r.outros).reduce((s,o)=>s+o.ganhas,0),r.razao.gastas+Object.values(r.outros).reduce((s,o)=>s+o.gastas,0),S.moedas])(NUVEM.registro(STORE.perfis[0].id))'));
      A.strictEqual(z[0] - z[1], z[2]);
    }
  });

  /* ======================================================== (b) migração da primeira conta */
  const LICOES50 = (a) => J(a.avaliar("[].concat(...['mat','pt','en'].map(m=>MATERIAS[m].units().flatMap(u=>u.lessons.map(l=>l.id)))).slice(0,50)"));
  const perfilV4 = (m) => {
    m.a.avaliar("novoPerfil('Lua','#1B93C8')");
    const ids = LICOES50(m.a);
    m.a.ctx.__ids = ids;
    m.a.avaliar("__ids.forEach((id,i)=>{S.feitas[id]=1+(i%3);});S.xp=1234;S.moedas=77;S.comprado=['teo','bone'];salvar()");
    return ids;
  };
  await teste('b1. migracao: perfil v4 com 50 fases e 2 itens comprados sobe; snapshot com >= 50 fases, xp igual, gastas = soma dos PRECOS, saldo igual', async () => {
    const m = montar(21);
    perfilV4(m);
    const r = J(await m.a.avaliar('NUVEM.migrarPrimeiraConta()'));
    A.strictEqual(r.ok, true);
    const id = m.a.avaliar('NUVEM.registro(STORE.perfis[0].id).nuvemId');
    const s = m.srv.snapshot(id), e = s.estado;
    A.ok(s.fases.filter((f) => f.estrelas > 0).length >= 50, 'fases: ' + s.fases.length);
    A.strictEqual(e.xp, 1234);
    A.strictEqual(e.moedas_gastas, m.a.avaliar('PRECOS.companheiro.teo+PRECOS.look.bone'));
    A.strictEqual(e.moedas_gastas, 700);
    A.strictEqual(e.moedas, 77);
    A.strictEqual(m.a.avaliar('S.moedas'), 77);
    A.deepStrictEqual(e.comprado.slice().sort(), ['bone', 'teo']);
    A.ok(m.a.avaliar('!!NUVEM.registro(STORE.perfis[0].id).migradoEm'));
    A.strictEqual(m.srv.perfis.get(id).perfil.apelido, 'Lua');
    A.strictEqual(m.srv.perfis.get(id).perfil.id_local, m.a.avaliar('STORE.perfis[0].id'));
  });

  await teste('b2. falha simulada (rede cai no meio ou snapshot nao confere) nao marca migrado e nao mexe no local', async () => {
    for (const falha of ['criar', 'sincronizar', 'snapshot-ruim']) {
      const srv = servidorFalso();
      if (falha === 'snapshot-ruim') { const orig = srv.sincronizarPerfil.bind(srv); srv.sincronizarPerfil = async (...x) => { const s = await orig(...x); s.fases = s.fases.slice(0, 10); return s; }; }
      else srv.falhar = falha;
      const m = montar(22, { servidor: srv });
      perfilV4(m);
      const antes = m.a.avaliar('JSON.stringify([S.feitas,S.xp,S.moedas,S.comprado])');
      const r = J(await m.a.avaliar('NUVEM.migrarPrimeiraConta()'));
      A.strictEqual(r.ok, false, falha);
      A.strictEqual(r.aviso, 'Não consegui guardar na nuvem ainda. Seu progresso está todo aqui no aparelho.');
      A.strictEqual(m.a.avaliar('NUVEM.registro(STORE.perfis[0].id).migradoEm'), '', falha + ': marcou migrado');
      A.strictEqual(m.a.avaliar('JSON.stringify([S.feitas,S.xp,S.moedas,S.comprado])'), antes, falha + ': mexeu no local');
    }
  });

  await teste('b3. mais de 4 perfis: sobem os escolhidos (ate 4); os outros ficam so no aparelho e a lista volta', async () => {
    const m = montar(23);
    for (const n of ['Ana', 'Bia', 'Caio', 'Duda', 'Edu']) m.a.avaliar("novoPerfil('" + n + "','#12A06E')");
    const r = J(await m.a.avaliar('NUVEM.migrarPrimeiraConta([0,2,3,4,1])'));
    A.strictEqual(r.feitos.length, 4);
    A.deepStrictEqual(r.ficaramNoAparelho, [m.a.avaliar('STORE.perfis[1].id')]);
    A.strictEqual(m.srv.perfis.size, 4);
  });

  /* ======================================================== (c) offline */
  await teste('c. offline: 20 gravacoes sem rede, nenhuma chamada; volta a rede, 1 push, banco igual ao local', async () => {
    const m = await comPerfil(31);
    const antes = m.srv.chamadas.sincronizar;
    m.rede.online = false;
    for (let i = 0; i < 20; i++) {
      m.passa(7000);
      m.a.avaliar("S.xp+=5;S.moedas+=2;S.feitas['1." + (1 + (i % 5)) + "']=" + (1 + (i % 3)) + ";S.stats.dias['2026-11-10']={fases:" + i + ",seg:" + (60 * i) + ",b:" + i + ",q:" + (8 * i) + ",ac:" + (6 * i) + ",rev:0,revAc:0,bm:{mat:" + i + ",pt:0,en:0}};salvar()");
      await m.rodarTimers();
    }
    A.strictEqual(m.srv.chamadas.sincronizar - antes, 0, 'chamou o servidor sem rede');
    A.ok(m.a.avaliar("localStorage.getItem('universo-bobby-sync-v1').length") > 0);
    m.rede.online = true;
    await m.disparar('online');
    A.strictEqual(m.srv.chamadas.sincronizar - antes, 1, 'esperava 1 push ao voltar a rede');
    const s = servidorEstado(m), local = J(m.a.avaliar("({xp:S.xp,moedas:S.moedas,feitas:S.feitas,dia:S.stats.dias['2026-11-10']})"));
    A.strictEqual(s.estado.xp, local.xp);
    A.strictEqual(s.estado.moedas, local.moedas);
    const fs = {}; s.fases.forEach((f) => { fs[f.fase_id] = f.estrelas; });
    A.deepStrictEqual(fs, local.feitas);
    A.deepStrictEqual([s.dias[0].blocos, s.dias[0].perguntas, s.dias[0].acertos, s.dias[0].segundos], [local.dia.b, local.dia.q, local.dia.ac, local.dia.seg]);
    // nada mais sujo: outro "online" não chama de novo
    await m.disparar('online');
    A.strictEqual(m.srv.chamadas.sincronizar - antes, 1);
  });

  await teste('c2. debounce de 5 s e intervalo de 60 s por perfil: 10 gravacoes seguidas viram 1 push; aba escondida fura o intervalo', async () => {
    const m = await comPerfil(32);
    const antes = m.srv.chamadas.sincronizar;
    m.passa(61000);
    for (let i = 0; i < 10; i++) { m.passa(500); m.a.avaliar('S.xp+=1;salvar()'); }
    A.ok(m.timers.length >= 1 && m.timers[m.timers.length - 1].ms === 5000, 'debounce de 5 s');
    await m.rodarTimers();
    A.strictEqual(m.srv.chamadas.sincronizar - antes, 1);
    m.passa(6000); m.a.avaliar('S.xp+=1;salvar()');
    await m.rodarTimers();
    A.strictEqual(m.srv.chamadas.sincronizar - antes, 1, 'empurrou antes de 60 s');
    m.a.ctx.document.visibilityState = 'hidden';
    await m.disparar('visibilitychange');
    A.strictEqual(m.srv.chamadas.sincronizar - antes, 2, 'aba escondida deveria empurrar na hora');
  });

  /* ======================================================== desligada e formato v4 */
  await teste('d. sem configuracao a nuvem nao faz nada: ligada() falso, nenhuma chave nova, nenhum evento; v4 com as mesmas chaves de sempre', () => {
    const relogio = { ms: Date.parse('2026-11-10T12:00:00Z') };
    const a = carregarApp(41, { relogio });
    A.strictEqual(a.avaliar('NUVEM.ligada()'), false);
    a.avaliar("novoPerfil('Zeca','#12A06E')");
    for (let i = 0; i < 10; i++) a.avaliar('S.xp+=3;S.moedas+=1;salvar()');
    A.strictEqual(a.avaliar("localStorage.getItem('universo-bobby-sync-v1')"), null);
    const v4 = JSON.parse(a.avaliar("localStorage.getItem('universo-bobby-v4')"));
    A.deepStrictEqual(Object.keys(v4.perfis[0].dados).sort(), J(a.avaliar('Object.keys(estadoVazio()).sort()')));
    A.ok(!/ganhas|gastas|nuvem/i.test(JSON.stringify(v4)), 'o v4 ganhou campo da nuvem');
    // configuração sem transporte também fica desligada (o supabase-js ainda não existe aqui)
    A.strictEqual(a.avaliar("criarNuvem({config:{url:'https://x.supabase.test',anon:'a'},transporte:null}).ligada()"), false);
  });

  await teste('e. cache do acesso: liberado offline so enquanto agora < acesso_ate que o servidor deu', async () => {
    const m = await comPerfil(42);
    A.strictEqual(m.a.avaliar("NUVEM.guardarAcesso({liberado:true,acesso_ate:'2026-12-13T03:00:00Z'})"), true);
    A.strictEqual(m.a.avaliar('NUVEM.acessoValido()'), true);
    m.relogio.ms = Date.parse('2026-12-13T03:00:01Z');
    A.strictEqual(m.a.avaliar('NUVEM.acessoValido()'), false);
    m.a.avaliar("NUVEM.guardarAcesso({liberado:false,acesso_ate:null})");
    A.strictEqual(m.a.avaliar('NUVEM.acessoValido()'), false);
  });

  resumo('nuvem.js');
})();
