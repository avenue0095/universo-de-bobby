// Webhook com avisos fora de ordem (defeito 1 da segunda passada da Fase 4).
// O estado de uma cobrança só avança: pendente < confirmado < recebido; estornado é terminal.
// O banco em memória NÃO imita o gatilho da 0005: estes testes provam a regra no webhook.

const assertEquals = (a: unknown, b: unknown) => {
  const x = JSON.stringify(a), y = JSON.stringify(b);
  if (x !== y) throw new Error('diferente:\n  veio     ' + x + '\n  esperado ' + y);
};
import { lerAmbiente } from '../_shared/config.ts';
import { mesclarPagamento } from '../_shared/pagamento.ts';
import { ProvedorAsaas } from '../_shared/provedor-asaas.ts';
import type { Pagamento, StatusPagamento } from '../_shared/repositorio.ts';
import type { Deps } from '../_shared/rota.ts';
import { criarHandler as checkout } from '../criar-checkout/index.ts';
import { criarHandler as reembolso } from '../pedir-reembolso/index.ts';
import { criarHandler as webhook } from '../webhook-pagamento/index.ts';
import { RepositorioMemoria } from './memoria.ts';
import { eventoAssinatura, eventoPagamento, respostaCheckout } from './payloads.ts';

const UID = '11111111-1111-4111-8111-111111111111';
const JWT = 'eyJ.teste-ordem.assinatura';   // falso
const TOKEN = 'token-de-teste-do-webhook-com-mais-de-32-caracteres';   // falso
const AMB = lerAmbiente((n) => ({
  SUPABASE_URL: 'https://projeto-falso.supabase.test', SUPABASE_ANON_KEY: 'anon-falsa', SUPABASE_SERVICE_ROLE_KEY: 'service-falsa',
  ASAAS_AMBIENTE: 'sandbox', ASAAS_API_KEY: 'chave-falsa', ASAAS_WEBHOOK_TOKEN: TOKEN, APP_URL: 'https://app.exemplo.test',
} as Record<string, string>)[n]);
const AGORA = new Date('2026-11-10T15:00:00Z');

const fetchAuth: typeof fetch = (_i, init) => {
  const tok = (new Headers(init?.headers).get('authorization') ?? '').replace('Bearer ', '');
  return Promise.resolve(tok === JWT
    ? Response.json({ id: UID, email: 'r@exemplo.test', email_confirmed_at: '2026-11-01T00:00:00Z' })
    : new Response('{}', { status: 401 }));
};
const asaas: typeof fetch = (input, init) => {
  const url = String(input), metodo = init?.method ?? 'GET';
  if (metodo === 'POST' && url.endsWith('/checkouts')) return Promise.resolve(Response.json(respostaCheckout('chk-ordem')));
  if (metodo === 'DELETE') return Promise.resolve(Response.json({ deleted: true }));
  if (url.endsWith('/refund')) return Promise.resolve(Response.json({ status: 'REFUNDED' }));
  return Promise.resolve(new Response('', { status: 404 }));
};

async function familiaPagante() {
  const repo = new RepositorioMemoria();
  const deps: Deps = { amb: AMB, repo, provedor: new ProvedorAsaas(AMB.asaasApiKey, AMB.asaasAmbiente, asaas), fetchAuth, log: () => {}, agora: () => AGORA };
  const wh = webhook({ token: TOKEN, repo, log: () => {}, agora: () => AGORA });
  const aviso = (corpo: unknown) => wh(new Request('https://f.test/w', {
    method: 'POST', headers: { 'Content-Type': 'application/json', 'asaas-access-token': TOKEN }, body: JSON.stringify(corpo),
  }));
  const pedido = () => new Request('https://f.test/x', { method: 'POST', headers: { Authorization: 'Bearer ' + JWT, Origin: AMB.appUrl }, body: '{}' });
  repo.aceitarTudo(UID);
  await checkout(deps)(new Request('https://f.test/x', { method: 'POST', headers: { Authorization: 'Bearer ' + JWT, Origin: AMB.appUrl }, body: '{"plano":"mensal"}' }));
  await aviso(eventoAssinatura('SUBSCRIPTION_CREATED', { referencia: repo.assinaturas[0].id }));
  return { repo, aviso, reembolso: () => reembolso(deps)(pedido()), a: () => repo.assinaturas[0], p: () => repo.pagamentos[0] };
}

Deno.test('ordem: RECEIVED e depois PAYMENT_UPDATED atrasado continua recebido, com pago_em, e o reembolso em 7 dias acha a cobrança', async () => {
  const m = await familiaPagante();
  await m.aviso(eventoPagamento('PAYMENT_RECEIVED', { id: 'o1' }));
  await m.aviso(eventoPagamento('PAYMENT_UPDATED', { id: 'o2' }));
  await m.aviso(eventoPagamento('PAYMENT_CREATED', { id: 'o3' }));
  assertEquals([m.p().status, m.p().pago_em], ['recebido', '2026-11-10']);
  assertEquals(m.a().status, 'ativa');
  const r = await m.reembolso();
  assertEquals(r.status, 200);   // antes do conserto: 404 "Não há pagamento para reembolsar"
  assertEquals(m.p().status, 'estornado');
});

Deno.test('ordem: REFUNDED e depois PAYMENT_CONFIRMED atrasado continua estornado; assinatura segue reembolsada e sem acesso', async () => {
  const m = await familiaPagante();
  await m.aviso(eventoPagamento('PAYMENT_CONFIRMED', { id: 'o1' }));
  await m.aviso(eventoPagamento('PAYMENT_REFUNDED', { id: 'o2' }));
  await m.aviso(eventoPagamento('PAYMENT_CONFIRMED', { id: 'o3' }));
  await m.aviso(eventoPagamento('PAYMENT_RECEIVED', { id: 'o4' }));
  assertEquals(m.p().status, 'estornado');
  assertEquals([m.a().status, m.a().acesso_ate], ['reembolsada', AGORA.toISOString()]);
  assertEquals(m.repo.pagamentos.length, 1);
});

Deno.test('ordem: PAYMENT_OVERDUE atrasado de cobrança já confirmada não marca a assinatura como atrasada', async () => {
  const m = await familiaPagante();
  await m.aviso(eventoPagamento('PAYMENT_CONFIRMED', { id: 'o1' }));
  await m.aviso(eventoPagamento('PAYMENT_OVERDUE', { id: 'o2' }));
  assertEquals([m.p().status, m.a().status], ['confirmado', 'ativa']);
});

Deno.test('ordem: avançar continua possível (pendente → confirmado → recebido → estornado)', async () => {
  const m = await familiaPagante();
  const visto: string[] = [];
  for (const [i, t] of ['PAYMENT_CREATED', 'PAYMENT_CONFIRMED', 'PAYMENT_RECEIVED', 'PAYMENT_REFUNDED'].entries()) {
    await m.aviso(eventoPagamento(t, { id: 'a' + i }));
    visto.push(m.p().status);
  }
  assertEquals(visto, ['pendente', 'confirmado', 'recebido', 'estornado']);
  assertEquals(m.p().pago_em, '2026-11-10');   // o estorno não apaga quando foi pago
});

Deno.test('mesclarPagamento: tabela completa de quem vence', () => {
  const base: Pagamento = {
    provedor_pagamento_id: 'pay_1', assinatura_id: null, responsavel_id: null, provedor: 'asaas', valor_centavos: 4700, metodo: 'cartao',
    status: 'pendente', vencimento: '2026-11-10', pago_em: null,
  };
  const pg = (s: StatusPagamento): Pagamento => ({ ...base, status: s, pago_em: s === 'confirmado' || s === 'recebido' ? '2026-11-10' : null });
  const todos: StatusPagamento[] = ['pendente', 'vencido', 'falhou', 'confirmado', 'recebido', 'estornado'];
  const esperado: Record<string, string> = {};
  for (const a of todos) for (const n of todos) {
    const nivel = (s: string) => ({ confirmado: 1, recebido: 2, estornado: 3 } as Record<string, number>)[s] ?? 0;
    esperado[a + '>' + n] = a === 'estornado' ? 'estornado' : nivel(n) < nivel(a) ? a : n;
  }
  const veio: Record<string, string> = {};
  for (const a of todos) for (const n of todos) veio[a + '>' + n] = mesclarPagamento(pg(a), pg(n)).status;
  assertEquals(veio, esperado);
  // amostras que o defeito quebrava, escritas à mão
  assertEquals(mesclarPagamento(pg('recebido'), pg('pendente')).status, 'recebido');
  assertEquals(mesclarPagamento(pg('recebido'), pg('pendente')).pago_em, '2026-11-10');
  assertEquals(mesclarPagamento(pg('estornado'), pg('confirmado')).status, 'estornado');
  assertEquals(mesclarPagamento(pg('vencido'), pg('pendente')).status, 'pendente');   // vencimento mudou: volta a pendente
  assertEquals(mesclarPagamento(pg('confirmado'), pg('recebido')).status, 'recebido');
  assertEquals(mesclarPagamento(null, pg('vencido')).status, 'vencido');
  // campos descritivos seguem o aviso mais recente
  assertEquals(mesclarPagamento(pg('recebido'), { ...pg('pendente'), valor_centavos: 5000 }).valor_centavos, 5000);
});
