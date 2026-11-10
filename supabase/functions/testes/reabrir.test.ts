// Pagamento atrasado de assinatura 'expirada' (defeito 6 da segunda passada da Fase 4).
// criar-checkout expira o checkout pendente quando a família abre outro. Se o PRIMEIRO for pago depois, a família pagou
// e tem de ter acesso: a assinatura paga reabre. Se as duas forem pagas, não reabre e o evento fica marcado para estorno.

const assertEquals = (a: unknown, b: unknown) => {
  const x = JSON.stringify(a), y = JSON.stringify(b);
  if (x !== y) throw new Error('diferente:\n  veio     ' + x + '\n  esperado ' + y);
};
import { lerAmbiente } from '../_shared/config.ts';
import { ProvedorAsaas } from '../_shared/provedor-asaas.ts';
import type { Deps } from '../_shared/rota.ts';
import { criarHandler as checkout } from '../criar-checkout/index.ts';
import { criarHandler as webhook } from '../webhook-pagamento/index.ts';
import { RepositorioMemoria } from './memoria.ts';
import { eventoAssinatura, eventoPagamento, respostaCheckout } from './payloads.ts';

const UID = '11111111-1111-4111-8111-111111111111';
const JWT = 'eyJ.teste-reabrir.assinatura';   // falso
const TOKEN = 'token-de-teste-do-webhook-com-mais-de-32-caracteres';   // falso
const AMB = lerAmbiente((n) => ({
  SUPABASE_URL: 'https://projeto-falso.supabase.test', SUPABASE_ANON_KEY: 'anon-falsa', SUPABASE_SERVICE_ROLE_KEY: 'service-falsa',
  ASAAS_AMBIENTE: 'sandbox', ASAAS_API_KEY: 'chave-falsa', ASAAS_WEBHOOK_TOKEN: TOKEN, APP_URL: 'https://app.exemplo.test',
} as Record<string, string>)[n]);
const AGORA = new Date('2026-11-10T15:00:00Z');

function montar() {
  const repo = new RepositorioMemoria();
  let n = 0;
  const asaas: typeof fetch = () => Promise.resolve(Response.json(respostaCheckout('chk-' + (++n))));
  const fetchAuth: typeof fetch = () => Promise.resolve(Response.json({ id: UID, email: 'r@exemplo.test', email_confirmed_at: '2026-11-01T00:00:00Z' }));
  const deps: Deps = { amb: AMB, repo, provedor: new ProvedorAsaas(AMB.asaasApiKey, AMB.asaasAmbiente, asaas), fetchAuth, log: () => {}, agora: () => AGORA };
  const wh = webhook({ token: TOKEN, repo, log: () => {}, agora: () => AGORA });
  const aviso = (corpo: unknown) => wh(new Request('https://f.test/w', {
    method: 'POST', headers: { 'Content-Type': 'application/json', 'asaas-access-token': TOKEN }, body: JSON.stringify(corpo),
  }));
  const abrir = (plano: string) => checkout(deps)(new Request('https://f.test/x', {
    method: 'POST', headers: { Authorization: 'Bearer ' + JWT, Origin: AMB.appUrl }, body: JSON.stringify({ plano }),
  }));
  repo.aceitarTudo(UID);
  return { repo, aviso, abrir };
}

/** A família abre o checkout mensal (A), desiste, abre o anual (B). A vira expirada. */
async function doisCheckouts() {
  const m = montar();
  assertEquals((await m.abrir('mensal')).status, 200);
  assertEquals((await m.abrir('anual')).status, 200);
  const [A, B] = m.repo.assinaturas;
  assertEquals([A.status, B.status], ['expirada', 'pendente']);
  // o Asaas cria a assinatura de cada checkout quando ele é pago
  await m.aviso(eventoAssinatura('SUBSCRIPTION_CREATED', { id: 'sA', assinatura: 'sub_A', referencia: A.id }));
  return { ...m, A: () => m.repo.assinaturas[0], B: () => m.repo.assinaturas[1] };
}

Deno.test('reabrir: o primeiro checkout (já expirado por um novo) é pago depois: reabre com acesso e o pendente novo expira', async () => {
  const m = await doisCheckouts();
  const r = await m.aviso(eventoPagamento('PAYMENT_CONFIRMED', { id: 'pA', pagamento: 'pay_A', assinatura: 'sub_A', vencimento: '2026-11-10' }));
  assertEquals(r.status, 200);
  assertEquals([m.A().status, m.A().acesso_ate, m.A().inicio_em], ['ativa', '2026-12-13T03:00:00.000Z', AGORA.toISOString()]);
  assertEquals(m.B().status, 'expirada');
  assertEquals(m.repo.eventos.get('pA')?.erro, null);
  // a família agora é assinante: um novo checkout dá 409 (a reaberta é a que vale)
  assertEquals((await m.abrir('mensal')).status, 409);
});

Deno.test('reabrir: as duas pagas (B primeiro, A atrasado): A não reabre, B segue ativa e o evento fica marcado pagamento_duplicado', async () => {
  const m = await doisCheckouts();
  await m.aviso(eventoAssinatura('SUBSCRIPTION_CREATED', { id: 'sB', assinatura: 'sub_B', referencia: m.B().id, ciclo: 'YEARLY' }));
  await m.aviso(eventoPagamento('PAYMENT_CONFIRMED', { id: 'pB', pagamento: 'pay_B', assinatura: 'sub_B', valor: 297 }));
  assertEquals(m.B().status, 'ativa');
  const r = await m.aviso(eventoPagamento('PAYMENT_CONFIRMED', { id: 'pA', pagamento: 'pay_A', assinatura: 'sub_A' }));
  assertEquals(r.status, 200);   // não pausa a fila do Asaas
  assertEquals([m.A().status, m.A().acesso_ate, m.B().status], ['expirada', null, 'ativa']);
  assertEquals(m.repo.eventos.get('pA')?.erro, 'pagamento_duplicado');
  assertEquals(m.repo.eventos.get('pA')?.processado_em, null);   // fica à vista para o estorno
  assertEquals(m.repo.pagamentos.find((p) => p.provedor_pagamento_id === 'pay_A')?.status, 'confirmado');   // o dinheiro está registrado
});

Deno.test('reabrir: reembolsada nunca reabre com pagamento atrasado', async () => {
  const m = await doisCheckouts();
  m.repo.assinaturas[0].status = 'reembolsada';
  await m.aviso(eventoPagamento('PAYMENT_CONFIRMED', { id: 'pA', pagamento: 'pay_A', assinatura: 'sub_A' }));
  assertEquals([m.A().status, m.A().acesso_ate, m.B().status], ['reembolsada', null, 'pendente']);
});

Deno.test('reabrir: expirada que já teve acesso (inicio_em) não volta por pagamento atrasado', async () => {
  const m = await doisCheckouts();
  m.repo.assinaturas[0].inicio_em = '2026-10-01T00:00:00.000Z';
  await m.aviso(eventoPagamento('PAYMENT_CONFIRMED', { id: 'pA', pagamento: 'pay_A', assinatura: 'sub_A' }));
  assertEquals([m.A().status, m.B().status], ['expirada', 'pendente']);
  assertEquals(m.repo.eventos.get('pA')?.erro, 'expirada_ja_usada');
});

Deno.test('reabrir: família com assinatura ATRASADA paga o checkout velho: não reabre e o evento fica marcado pagamento_duplicado', async () => {
  const m = await doisCheckouts();
  // B foi paga, virou ativa e depois atrasou a cobrança seguinte (atrasada ainda dá acesso: é assinatura valendo)
  await m.aviso(eventoAssinatura('SUBSCRIPTION_CREATED', { id: 'sB', assinatura: 'sub_B', referencia: m.B().id, ciclo: 'YEARLY' }));
  await m.aviso(eventoPagamento('PAYMENT_CONFIRMED', { id: 'pB', pagamento: 'pay_B', assinatura: 'sub_B', valor: 297 }));
  await m.aviso(eventoPagamento('PAYMENT_OVERDUE', { id: 'pB2', pagamento: 'pay_B2', assinatura: 'sub_B' }));
  assertEquals(m.B().status, 'atrasada');
  const r = await m.aviso(eventoPagamento('PAYMENT_CONFIRMED', { id: 'pA', pagamento: 'pay_A', assinatura: 'sub_A' }));
  assertEquals(r.status, 200);
  assertEquals([m.A().status, m.A().acesso_ate, m.B().status], ['expirada', null, 'atrasada']);
  assertEquals(m.repo.eventos.get('pA')?.erro, 'pagamento_duplicado');
  assertEquals(m.repo.eventos.get('pA')?.processado_em, null);
});

// ---------------------------------------------------------------------------------------------------------------------------
// Dois avisos ao mesmo tempo (terceira passada): a reabertura é uma transação só (0008, reabrir_assinatura_paga). O Asaas repete
// o aviso que recebeu 500; o teste faz o mesmo. Nos dois casos o estado final tem de fazer sentido: uma assinatura só valendo e,
// se as duas foram pagas, um aviso marcado pagamento_duplicado (nunca uma família que pagou e ficou sem marca nem acesso).
// ---------------------------------------------------------------------------------------------------------------------------
async function comRepeticao(m: Awaited<ReturnType<typeof doisCheckouts>>, avisos: unknown[]) {
  const rs = await Promise.all(avisos.map((a) => m.aviso(a)));
  for (let i = 0; i < avisos.length; i++) if (rs[i].status === 500) rs[i] = await m.aviso(avisos[i]);   // o Asaas repete
  return rs.map((r) => r.status);
}

Deno.test('reabrir: A (velho, expirado) e B (novo, pendente) pagos JUNTOS: uma só fica valendo e o outro aviso fica marcado', async () => {
  const m = await doisCheckouts();
  await m.aviso(eventoAssinatura('SUBSCRIPTION_CREATED', { id: 'sB', assinatura: 'sub_B', referencia: m.B().id, ciclo: 'YEARLY' }));
  const st = await comRepeticao(m, [
    eventoPagamento('PAYMENT_CONFIRMED', { id: 'pA', pagamento: 'pay_A', assinatura: 'sub_A', vencimento: '2026-11-10' }),
    eventoPagamento('PAYMENT_CONFIRMED', { id: 'pB', pagamento: 'pay_B', assinatura: 'sub_B', valor: 297 }),
  ]);
  assertEquals(st, [200, 200]);
  const vivas = m.repo.assinaturas.filter((a) => ['ativa', 'atrasada', 'pendente'].includes(a.status));
  assertEquals(vivas.length, 1);
  assertEquals(vivas[0].status, 'ativa');
  const morta = vivas[0].id === m.A().id ? 'pB' : 'pA';
  assertEquals(m.repo.eventos.get(morta)?.erro, 'pagamento_duplicado');
});

Deno.test('reabrir: CONFIRMED e RECEIVED da mesma cobrança de A chegam JUNTOS: A reabre uma vez, B expira, nenhum aviso com erro', async () => {
  const m = await doisCheckouts();
  const st = await comRepeticao(m, [
    eventoPagamento('PAYMENT_CONFIRMED', { id: 'pA1', pagamento: 'pay_A', assinatura: 'sub_A', vencimento: '2026-11-10' }),
    eventoPagamento('PAYMENT_RECEIVED', { id: 'pA2', pagamento: 'pay_A', assinatura: 'sub_A', vencimento: '2026-11-10' }),
  ]);
  assertEquals(st, [200, 200]);
  assertEquals([m.A().status, m.A().acesso_ate, m.B().status], ['ativa', '2026-12-13T03:00:00.000Z', 'expirada']);
  assertEquals([m.repo.eventos.get('pA1')?.erro, m.repo.eventos.get('pA2')?.erro], [null, null]);
});

Deno.test("reabrir: a RPC responde 'mudou' (outro aviso reabriu no meio): o webhook relê e segue o caminho normal, acesso pelo maior", async () => {
  const m = await doisCheckouts();
  const orig = m.repo.reabrirAssinaturaPaga.bind(m.repo);
  m.repo.reabrirAssinaturaPaga = async (id, _ate, agora) => {
    await orig(id, '2026-11-20T03:00:00.000Z', agora);   // o "outro aviso" reabriu com acesso mais curto
    return 'mudou';
  };
  const r = await m.aviso(eventoPagamento('PAYMENT_CONFIRMED', { id: 'pA', pagamento: 'pay_A', assinatura: 'sub_A', vencimento: '2026-11-10' }));
  assertEquals(r.status, 200);
  assertEquals([m.A().status, m.A().acesso_ate, m.B().status], ['ativa', '2026-12-13T03:00:00.000Z', 'expirada']);
  assertEquals(m.repo.eventos.get('pA')?.erro, null);
});
