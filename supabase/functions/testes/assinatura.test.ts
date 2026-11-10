// Testes das Edge Functions de assinatura (S2 do docs/fase4/PLANO.md, critérios (a), (b) e (d)).
// Sem rede: o Auth do Supabase e o Asaas são fetch falsos; o banco é RepositorioMemoria.
// Uso: deno test supabase/functions   (na raiz do projeto)

// Sem dependência baixada (nada de jsr:@std nem npm): três conferências bastam, dados aqui são JSON puro.
const assert = (c: unknown, msg = 'esperava verdadeiro') => { if (!c) throw new Error(msg); };
const assertEquals = (a: unknown, b: unknown) => {
  const x = JSON.stringify(a), y = JSON.stringify(b);
  if (x !== y || (a === undefined) !== (b === undefined)) throw new Error('diferente:\n  veio     ' + x + '\n  esperado ' + y);
};
const assertMatch = (t: string, re: RegExp) => { if (!re.test(t)) throw new Error(JSON.stringify(t) + ' não casa com ' + re); };
import { acessoAteDe, lerAmbiente, PLANOS } from '../_shared/config.ts';
import { tokensIguais } from '../_shared/auth.ts';
import { registrar } from '../_shared/http.ts';
import { ProvedorAsaas } from '../_shared/provedor-asaas.ts';
import { RepositorioPostgrest } from '../_shared/repositorio.ts';
import type { Deps } from '../_shared/rota.ts';
import { criarHandler as checkout } from '../criar-checkout/index.ts';
import { criarHandler as cancelar } from '../cancelar-assinatura/index.ts';
import { criarHandler as reembolso } from '../pedir-reembolso/index.ts';
import { criarHandler as webhook } from '../webhook-pagamento/index.ts';
import { RepositorioMemoria } from './memoria.ts';
import { DADOS_PESSOAIS_FALSOS, eventoAssinatura, eventoCheckout, eventoPagamento, respostaCheckout } from './payloads.ts';

// ---------------------------------------------------------------- cenário
const UID = '11111111-1111-4111-8111-111111111111';
const OUTRO = '22222222-2222-4222-8222-222222222222';
const JWT = 'eyJ.teste-do-responsavel-a.assinatura';   // falso; o Auth falso só reconhece este texto
const JWT_B = 'eyJ.teste-do-responsavel-b.assinatura';
const JWT_SEM_EMAIL = 'eyJ.teste-sem-email-confirmado.x';
const TOKEN = 'token-de-teste-do-webhook-com-mais-de-32-caracteres';   // falso
const AMB = lerAmbiente((n) => ({
  SUPABASE_URL: 'https://projeto-falso.supabase.test', SUPABASE_ANON_KEY: 'anon-falsa', SUPABASE_SERVICE_ROLE_KEY: 'service-falsa',
  ASAAS_AMBIENTE: 'sandbox', ASAAS_API_KEY: 'chave-falsa', ASAAS_WEBHOOK_TOKEN: TOKEN, APP_URL: 'https://app.exemplo.test',
} as Record<string, string>)[n]);
const AGORA = new Date('2026-11-10T15:00:00Z');

const LOG: string[] = [];
const log = (l: string) => { LOG.push(l); };

/** Auth falso: GET /auth/v1/user com o JWT certo devolve o usuário (como o GoTrue). */
const fetchAuth: typeof fetch = (input, init) => {
  const url = String(input instanceof Request ? input.url : input);
  const h = new Headers(init?.headers);
  assertEquals(url, AMB.supabaseUrl + '/auth/v1/user');
  assertEquals(h.get('apikey'), AMB.supabaseAnonKey);
  const tok = (h.get('authorization') ?? '').replace('Bearer ', '');
  const user = tok === JWT ? { id: UID, email: 'responsavel.teste@exemplo.test', email_confirmed_at: '2026-11-01T00:00:00Z' }
    : tok === JWT_B ? { id: OUTRO, email: 'outro@exemplo.test', email_confirmed_at: '2026-11-01T00:00:00Z' }
    : tok === JWT_SEM_EMAIL ? { id: OUTRO, email: 'x@exemplo.test', email_confirmed_at: null } : null;
  return Promise.resolve(user ? Response.json(user) : new Response('{"msg":"invalid JWT"}', { status: 401 }));
};

/** Asaas falso: grava as chamadas e responde como a documentação. */
function asaasFalso() {
  const chamadas: { metodo: string; url: string; corpo: unknown; chave: string | null }[] = [];
  let falhar = 0;
  const f: typeof fetch = (input, init) => {
    const url = String(input), metodo = init?.method ?? 'GET';
    const corpo = init?.body ? JSON.parse(String(init.body)) : null;
    chamadas.push({ metodo, url, corpo, chave: new Headers(init?.headers).get('access_token') });
    if (falhar) return Promise.resolve(new Response('{"errors":[{"code":"x","description":"Pessoa Ficticia de Teste"}]}', { status: falhar }));
    if (metodo === 'POST' && url.endsWith('/checkouts')) return Promise.resolve(Response.json(respostaCheckout('chk-' + chamadas.length)));
    if (metodo === 'DELETE' && url.includes('/subscriptions/')) return Promise.resolve(Response.json({ deleted: true, id: url.split('/').pop() }));
    if (metodo === 'POST' && url.endsWith('/refund')) return Promise.resolve(Response.json({ object: 'payment', id: url.split('/')[5], status: 'REFUNDED' }));
    return Promise.resolve(new Response('não achei', { status: 404 }));
  };
  return { f, chamadas, falha: (s: number) => { falhar = s; } };
}

function montar() {
  const repo = new RepositorioMemoria();
  const asaas = asaasFalso();
  const deps: Deps = { amb: AMB, repo, provedor: new ProvedorAsaas(AMB.asaasApiKey, AMB.asaasAmbiente, asaas.f), fetchAuth, log, agora: () => AGORA };
  return {
    repo, asaas,
    checkout: checkout(deps), cancelar: cancelar(deps), reembolso: reembolso(deps),
    webhook: webhook({ token: AMB.asaasWebhookToken, repo, log, agora: () => AGORA }),
  };
}

const pedido = (jwt: string | null, corpo: unknown = {}, metodo = 'POST') =>
  new Request('https://f.test/x', {
    method: metodo,
    headers: { ...(jwt ? { Authorization: 'Bearer ' + jwt } : {}), 'Content-Type': 'application/json', Origin: AMB.appUrl },
    body: metodo === 'POST' ? JSON.stringify(corpo) : undefined,
  });
const aviso = (corpo: unknown, token: string | null = TOKEN) =>
  new Request('https://f.test/webhook-pagamento', {
    method: 'POST', headers: { 'Content-Type': 'application/json', ...(token !== null ? { 'asaas-access-token': token } : {}) }, body: JSON.stringify(corpo),
  });

/** Família com checkout aberto, ligado à assinatura do Asaas sub_VXJBYgP2u0eO. */
async function familiaComCheckout(plano: 'mensal' | 'anual' = 'mensal') {
  const m = montar();
  m.repo.aceitarTudo(UID);
  const r = await m.checkout(pedido(JWT, { plano }));
  assertEquals(r.status, 200);
  const a = m.repo.assinaturas[0];
  await m.webhook(aviso(eventoAssinatura('SUBSCRIPTION_CREATED', { referencia: a.id, ciclo: PLANOS[plano].ciclo })));
  return { ...m, a: () => m.repo.assinaturas.find((x) => x.id === a.id)! };
}

// ======================================================================= (a) webhook
Deno.test('S2(a) webhook sem token responde 401 e não toca no banco', async () => {
  const m = montar();
  const r1 = await m.webhook(aviso(eventoPagamento('PAYMENT_CONFIRMED'), null));
  const r2 = await m.webhook(aviso(eventoPagamento('PAYMENT_CONFIRMED'), 'token-errado-mas-com-mais-de-32-caracteres-x'));
  const r3 = await m.webhook(aviso(eventoPagamento('PAYMENT_CONFIRMED'), TOKEN.slice(0, -1)));
  assertEquals([r1.status, r2.status, r3.status], [401, 401, 401]);
  assertEquals(m.repo.eventos.size, 0);
  assertEquals(m.repo.pagamentos.length, 0);
});

Deno.test('S2(a) webhook com token não configurado ou curto recusa tudo (falha fechada)', async () => {
  const repo = new RepositorioMemoria();
  for (const t of ['', 'curto-demais']) {
    const h = webhook({ token: t, repo, log });
    assertEquals((await h(aviso(eventoPagamento('PAYMENT_CONFIRMED'), t))).status, 401);
  }
  assertEquals(repo.eventos.size, 0);
});

Deno.test('S2(a) token certo + evento repetido: 200 nas duas vezes e UMA linha em pagamento', async () => {
  const m = await familiaComCheckout();
  const ev = eventoPagamento('PAYMENT_CONFIRMED', { id: 'evt_repetido&1' });
  const r1 = await m.webhook(aviso(ev));
  const r2 = await m.webhook(aviso(ev));
  assertEquals([r1.status, r2.status], [200, 200]);
  assertEquals((await r2.json()).repetido, true);
  assertEquals(m.repo.pagamentos.length, 1);
  // o mesmo pagamento em outro evento (RECEIVED depois de CONFIRMED) atualiza a linha, não cria outra
  await m.webhook(aviso(eventoPagamento('PAYMENT_RECEIVED', { id: 'evt_outro&2' })));
  assertEquals(m.repo.pagamentos.length, 1);
  assertEquals(m.repo.pagamentos[0].status, 'recebido');
});

Deno.test('S2(a) confirmado: acesso_ate = fim do ciclo + 3 dias (mensal e anual) e status ativa', async () => {
  const m = await familiaComCheckout('mensal');
  await m.webhook(aviso(eventoPagamento('PAYMENT_CONFIRMED', { vencimento: '2026-11-10' })));
  assertEquals(m.a().status, 'ativa');
  assertEquals(m.a().acesso_ate, '2026-12-13T03:00:00.000Z');   // 10/12 + 3 dias, meia-noite de Brasília
  assertEquals(m.a().inicio_em, AGORA.toISOString());

  const n = await familiaComCheckout('anual');
  await n.webhook(aviso(eventoPagamento('PAYMENT_CONFIRMED', { vencimento: '2026-11-10', valor: 297 })));
  assertEquals(n.a().acesso_ate, '2027-11-13T03:00:00.000Z');
  assertEquals(n.repo.pagamentos[0].valor_centavos, 29700);
});

Deno.test('S2(a) acesso_ate: 31/01 + 1 mês cai no último dia de fevereiro, nunca em março', () => {
  assertEquals(acessoAteDe('2027-01-31', 'mensal').toISOString(), '2027-03-03T03:00:00.000Z');   // 28/02 + 3
  assertEquals(acessoAteDe('2028-02-29', 'anual').toISOString(), '2029-03-03T03:00:00.000Z');    // 28/02/2029 + 3
});

Deno.test('S2(a) renovação empurra acesso_ate; evento atrasado de ciclo antigo nunca encolhe', async () => {
  const m = await familiaComCheckout();
  await m.webhook(aviso(eventoPagamento('PAYMENT_CONFIRMED', { id: 'e1', pagamento: 'pay_1', vencimento: '2026-11-10' })));
  await m.webhook(aviso(eventoPagamento('PAYMENT_CONFIRMED', { id: 'e2', pagamento: 'pay_2', vencimento: '2026-12-10' })));
  assertEquals(m.a().acesso_ate, '2027-01-13T03:00:00.000Z');
  await m.webhook(aviso(eventoPagamento('PAYMENT_RECEIVED', { id: 'e3', pagamento: 'pay_1', vencimento: '2026-11-10' })));
  assertEquals(m.a().acesso_ate, '2027-01-13T03:00:00.000Z');
});

Deno.test('S2(a) reembolso no webhook: acesso_ate = agora e status reembolsada', async () => {
  const m = await familiaComCheckout();
  await m.webhook(aviso(eventoPagamento('PAYMENT_CONFIRMED', { id: 'e1' })));
  await m.webhook(aviso(eventoPagamento('PAYMENT_REFUNDED', { id: 'e2' })));
  assertEquals(m.a().status, 'reembolsada');
  assertEquals(m.a().acesso_ate, AGORA.toISOString());
  assertEquals(m.repo.pagamentos[0].status, 'estornado');
});

Deno.test('S2(a) atraso marca atrasada sem mexer em acesso_ate; cancelamento no Asaas marca cancelada e mantém o acesso', async () => {
  const m = await familiaComCheckout();
  await m.webhook(aviso(eventoPagamento('PAYMENT_CONFIRMED', { id: 'e1' })));
  const ate = m.a().acesso_ate;
  await m.webhook(aviso(eventoPagamento('PAYMENT_OVERDUE', { id: 'e2', pagamento: 'pay_2', vencimento: '2026-12-10' })));
  assertEquals([m.a().status, m.a().acesso_ate], ['atrasada', ate]);
  await m.webhook(aviso(eventoAssinatura('SUBSCRIPTION_DELETED', { id: 'e3' })));
  assertEquals([m.a().status, m.a().acesso_ate], ['cancelada', ate]);
});

Deno.test('S2(a) a assinatura é achada pelo id do Checkout quando o Asaas não devolve a referência', async () => {
  const m = montar();
  m.repo.aceitarTudo(UID);
  await m.checkout(pedido(JWT, { plano: 'mensal' }));
  const a = m.repo.assinaturas[0];
  await m.webhook(aviso(eventoAssinatura('SUBSCRIPTION_CREATED', { assinatura: 'sub_pelo_checkout', checkoutSession: a.provedor_checkout_id! })));
  await m.webhook(aviso(eventoPagamento('PAYMENT_CONFIRMED', { id: 'e9', assinatura: 'sub_pelo_checkout' })));
  assertEquals(m.repo.assinaturas[0].provedor_assinatura_id, 'sub_pelo_checkout');
  assertEquals(m.repo.assinaturas[0].status, 'ativa');
});

Deno.test('S2(a) pagamento de assinatura desconhecida: 200 (não pausa a fila do Asaas), nada gravado, evento fica para reprocessar', async () => {
  const m = montar();
  const r = await m.webhook(aviso(eventoPagamento('PAYMENT_CONFIRMED', { id: 'e_orfao', assinatura: 'sub_de_outro_sistema' })));
  assertEquals(r.status, 200);
  assertEquals(m.repo.pagamentos.length, 0);
  assertEquals(m.repo.eventos.get('e_orfao')?.processado_em, null);
  assertEquals(m.repo.eventos.get('e_orfao')?.erro, 'sem_assinatura');
});

Deno.test('S2(a) banco cai no meio: 500 para o Asaas repetir; na repetição processa uma vez só', async () => {
  const m = await familiaComCheckout();
  m.repo.falharEm = 'salvarPagamento';
  const ev = eventoPagamento('PAYMENT_CONFIRMED', { id: 'e_falha' });
  assertEquals((await m.webhook(aviso(ev))).status, 500);
  m.repo.falharEm = null;
  assertEquals((await m.webhook(aviso(ev))).status, 200);
  assertEquals((await m.webhook(aviso(ev))).status, 200);
  assertEquals(m.repo.pagamentos.length, 1);
  assertEquals(m.a().status, 'ativa');
});

Deno.test('S2(a) payload inválido: 400; evento desconhecido autenticado: 200; GET: 405', async () => {
  const m = montar();
  assertEquals((await m.webhook(aviso({ nada: 1 }))).status, 400);
  assertEquals((await m.webhook(aviso({ id: 'e_x', event: 'ALGO_NOVO_DO_ASAAS' }))).status, 200);
  assertEquals((await m.webhook(new Request('https://f.test/w', { method: 'GET' }))).status, 405);
});

Deno.test('S2(a) checkout expirado antes de pagar: a assinatura pendente vira expirada', async () => {
  const m = montar();
  m.repo.aceitarTudo(UID);
  await m.checkout(pedido(JWT, { plano: 'mensal' }));
  const a = m.repo.assinaturas[0];
  await m.webhook(aviso(eventoCheckout('CHECKOUT_EXPIRED', { checkout: a.provedor_checkout_id!, referencia: a.id })));
  assertEquals(m.repo.assinaturas[0].status, 'expirada');
});

Deno.test('tokensIguais: igual confere; diferente, vazio, nulo e prefixo não conferem', async () => {
  assert(await tokensIguais(TOKEN, TOKEN));
  assert(!(await tokensIguais(TOKEN + 'x', TOKEN)));
  assert(!(await tokensIguais(TOKEN.slice(0, 10), TOKEN)));
  assert(!(await tokensIguais('', '')));
  assert(!(await tokensIguais(null, TOKEN)));
});

// ======================================================================= (b) criar-checkout
Deno.test('S2(b) criar-checkout sem JWT, com JWT inválido ou sem e-mail confirmado: 401', async () => {
  const m = montar();
  m.repo.aceitarTudo(UID);
  assertEquals((await m.checkout(pedido(null, { plano: 'mensal' }))).status, 401);
  assertEquals((await m.checkout(pedido('eyJ.qualquer-coisa-falsa-aqui.x', { plano: 'mensal' }))).status, 401);
  assertEquals((await m.checkout(pedido(JWT_SEM_EMAIL, { plano: 'mensal' }))).status, 401);
  assertEquals(m.asaas.chamadas.length, 0);
  assertEquals(m.repo.assinaturas.length, 0);
});

Deno.test('S2(b) criar-checkout sem os 3 consentimentos: 403 com mensagem que diz o que falta', async () => {
  const m = montar();
  let r = await m.checkout(pedido(JWT, { plano: 'mensal' }));
  assertEquals(r.status, 403);
  let c = await r.json();
  assertEquals(c.faltam, ['termos', 'privacidade', 'parental']);
  assertMatch(c.erro, /Antes de assinar, aceite: termos de uso, política de privacidade, consentimento do responsável\./);
  // aceitou e depois retirou o parental: volta a faltar
  m.repo.aceitarTudo(UID);
  m.repo.consentimentos.push({ responsavel_id: UID, tipo: 'parental', aceito: false });
  r = await m.checkout(pedido(JWT, { plano: 'mensal' }));
  c = await r.json();
  assertEquals([r.status, c.faltam], [403, ['parental']]);
  // aceite de OUTRA família não vale
  const n = montar();
  n.repo.aceitarTudo(OUTRO);
  assertEquals((await n.checkout(pedido(JWT, { plano: 'mensal' }))).status, 403);
  assertEquals(m.asaas.chamadas.length + n.asaas.chamadas.length, 0);
});

Deno.test('S2(b) criar-checkout: 11ª chamada no dia é 429 (limite por conta, outra família não é afetada)', async () => {
  const m = montar();
  m.repo.aceitarTudo(UID);
  m.repo.aceitarTudo(OUTRO);
  const st: number[] = [];
  for (let i = 0; i < 11; i++) st.push((await m.checkout(pedido(JWT, { plano: 'mensal' }))).status);
  assertEquals(st.slice(0, 10), Array(10).fill(200));
  assertEquals(st[10], 429);
  assertEquals((await m.checkout(pedido(JWT_B, { plano: 'anual' }))).status, 200);
  assert(m.repo.contadores.has('checkout:' + UID));
});

Deno.test('S2(b) criar-checkout manda ao Asaas o preço do servidor, cartão recorrente e só o uuid da assinatura como referência', async () => {
  const m = montar();
  m.repo.aceitarTudo(UID);
  const r = await m.checkout(pedido(JWT, { plano: 'anual', valor: 1, preco: 1 }));   // valor vindo do app é ignorado
  assertEquals(r.status, 200);
  const { url } = await r.json();
  assertMatch(url, /^https:\/\/sandbox\.asaas\.com\/checkoutSession\/show\?id=chk-1$/);
  const ch = m.asaas.chamadas[0];
  assertEquals([ch.metodo, ch.url, ch.chave], ['POST', 'https://api-sandbox.asaas.com/v3/checkouts', 'chave-falsa']);
  const corpo = ch.corpo as { items: { value: number }[]; chargeTypes: string[]; billingTypes: string[]; subscription: { cycle: string }; externalReference: string; customerData?: unknown };
  assertEquals(corpo.items[0].value, 297);
  assertEquals(corpo.chargeTypes, ['RECURRENT']);
  assertEquals(corpo.billingTypes, ['CREDIT_CARD']);
  assertEquals(corpo.subscription.cycle, 'YEARLY');
  assertEquals(corpo.externalReference, m.repo.assinaturas[0].id);
  assertEquals(corpo.customerData, undefined);   // nada do responsável sai do Bobby
  assertEquals(m.repo.assinaturas[0].status, 'pendente');
  assertEquals(m.repo.assinaturas[0].provedor_checkout_id, 'chk-1');
});

Deno.test('S2(b) criar-checkout: plano inválido 400; já assinante 409; segundo checkout expira o pendente anterior', async () => {
  const m = montar();
  m.repo.aceitarTudo(UID);
  assertEquals((await m.checkout(pedido(JWT, { plano: 'vitalicio' }))).status, 400);
  assertEquals((await m.checkout(pedido(JWT, { plano: 'mensal' }))).status, 200);
  assertEquals((await m.checkout(pedido(JWT, { plano: 'anual' }))).status, 200);
  assertEquals(m.repo.assinaturas.map((a) => a.status), ['expirada', 'pendente']);
  await m.webhook(aviso(eventoAssinatura('SUBSCRIPTION_CREATED', { referencia: m.repo.assinaturas[1].id, ciclo: 'YEARLY' })));
  await m.webhook(aviso(eventoPagamento('PAYMENT_CONFIRMED', { id: 'x1' })));
  assertEquals((await m.checkout(pedido(JWT, { plano: 'mensal' }))).status, 409);
});

Deno.test('S2(b) Asaas fora do ar: 502, assinatura pendente não fica presa e o corpo do erro do Asaas não vaza', async () => {
  const m = montar();
  m.repo.aceitarTudo(UID);
  m.asaas.falha(503);
  const r = await m.checkout(pedido(JWT, { plano: 'mensal' }));
  assertEquals(r.status, 502);
  assert(!(await r.text()).includes('Pessoa'));
  assertEquals(m.repo.assinaturas[0].status, 'expirada');
});

Deno.test('S2(b) CORS: só a origem do app; OPTIONS 204; GET 405', async () => {
  const m = montar();
  const r = await m.checkout(new Request('https://f.test/x', { method: 'OPTIONS', headers: { Origin: AMB.appUrl } }));
  assertEquals(r.status, 204);
  assertEquals(r.headers.get('access-control-allow-origin'), AMB.appUrl);
  const r2 = await m.checkout(new Request('https://f.test/x', { method: 'OPTIONS', headers: { Origin: 'https://mal.test' } }));
  assertEquals(r2.headers.get('access-control-allow-origin'), null);
  assertEquals((await m.checkout(pedido(JWT, {}, 'GET'))).status, 405);
});

// ======================================================================= cancelar e reembolsar
Deno.test('cancelar-assinatura: 401 sem sessão; cancela no Asaas, mantém acesso_ate, repetir não faz mal', async () => {
  const m = await familiaComCheckout();
  await m.webhook(aviso(eventoPagamento('PAYMENT_CONFIRMED', { id: 'e1' })));
  assertEquals((await m.cancelar(pedido(null))).status, 401);
  const r = await m.cancelar(pedido(JWT, { motivo: 'Meu nome é Pessoa Ficticia de Teste e quero sair' }));
  assertEquals(r.status, 200);
  assertEquals((await r.json()).acesso_ate, '2026-12-13T03:00:00.000Z');
  assertEquals(m.a().status, 'cancelada');
  assertEquals(m.a().acesso_ate, '2026-12-13T03:00:00.000Z');
  const del = m.asaas.chamadas.filter((c) => c.metodo === 'DELETE');
  assertEquals(del.map((c) => c.url), ['https://api-sandbox.asaas.com/v3/subscriptions/sub_VXJBYgP2u0eO']);
  assertEquals((await m.cancelar(pedido(JWT))).status, 200);
  assertEquals(m.asaas.chamadas.filter((c) => c.metodo === 'DELETE').length, 1);
});

Deno.test('cancelar-assinatura: outra família não cancela a minha (404 para ela, a minha segue ativa)', async () => {
  const m = await familiaComCheckout();
  await m.webhook(aviso(eventoPagamento('PAYMENT_CONFIRMED', { id: 'e1' })));
  assertEquals((await m.cancelar(pedido(JWT_B))).status, 404);
  assertEquals(m.a().status, 'ativa');
});

Deno.test('pedir-reembolso: dentro de 7 dias estorna, cancela a recorrência e corta o acesso na hora', async () => {
  const m = await familiaComCheckout();
  await m.webhook(aviso(eventoPagamento('PAYMENT_CONFIRMED', { id: 'e1' })));
  assertEquals((await m.reembolso(pedido(null))).status, 401);
  const r = await m.reembolso(pedido(JWT));
  assertEquals(r.status, 200);
  assertEquals((await r.json()).status, 'reembolsada');
  assertEquals([m.a().status, m.a().acesso_ate], ['reembolsada', AGORA.toISOString()]);
  assertEquals(m.asaas.chamadas.filter((c) => c.url.endsWith('/payments/pay_080225913252/refund')).length, 1);
  assertEquals(m.asaas.chamadas.filter((c) => c.metodo === 'DELETE').length, 1);
  // o aviso de estorno que o Asaas manda depois não muda nada nem duplica
  await m.webhook(aviso(eventoPagamento('PAYMENT_REFUNDED', { id: 'e2' })));
  assertEquals(m.repo.pagamentos.length, 1);
  assertEquals(m.a().status, 'reembolsada');
});

Deno.test('pedir-reembolso: depois de 7 dias 403; sem pagamento 404', async () => {
  const m = await familiaComCheckout();
  assertEquals((await m.reembolso(pedido(JWT))).status, 404);
  await m.webhook(aviso(eventoPagamento('PAYMENT_CONFIRMED', { id: 'e1' })));
  m.repo.assinaturas[0].inicio_em = new Date(AGORA.getTime() - 8 * 86400000).toISOString();
  const r = await m.reembolso(pedido(JWT));
  assertEquals(r.status, 403);
  assertMatch((await r.json()).erro, /prazo de 7 dias/);
  assertEquals(m.asaas.chamadas.filter((c) => c.url.endsWith('/refund')).length, 0);
});

// ======================================================================= repositório real (forma do pedido)
Deno.test('RepositorioPostgrest fala com /rest/v1 usando a chave de serviço e nunca monta filtro com texto livre', async () => {
  const pedidos: { url: string; metodo: string; prefer: string | null; apikey: string | null }[] = [];
  const f: typeof fetch = (input, init) => {
    const h = new Headers(init?.headers);
    pedidos.push({ url: String(input), metodo: init?.method ?? 'GET', prefer: h.get('prefer'), apikey: h.get('apikey') });
    return Promise.resolve(String(input).includes('rpc/limite_ok') ? Response.json(true) : Response.json([]));
  };
  const r = new RepositorioPostgrest('https://projeto-falso.supabase.test', 'service-falsa', f);
  assertEquals(await r.limiteOk('checkout:' + UID, 10, '1 day'), true);
  assertEquals(await r.registrarEvento('evt_a&1', 'PAYMENT_CONFIRMED'), 'reprocessar');
  await r.salvarPagamento({ provedor_pagamento_id: 'pay_1', assinatura_id: null, responsavel_id: null, provedor: 'asaas', valor_centavos: 4700, metodo: 'cartao', status: 'confirmado', vencimento: null, pago_em: null });
  assertEquals(pedidos[0].url, 'https://projeto-falso.supabase.test/rest/v1/rpc/limite_ok');
  assert(pedidos.every((p) => p.apikey === 'service-falsa'));
  assertEquals(pedidos[1].prefer, 'resolution=ignore-duplicates,return=representation');
  assertMatch(pedidos[pedidos.length - 1].url, /pagamento\?on_conflict=provedor_pagamento_id$/);
  let recusou = false;
  try { await r.buscarAssinatura({ provedor_checkout_id: 'x,status.eq.ativa)' }); } catch { recusou = true; }
  assert(recusou, 'filtro com vírgula e parêntese deveria ser recusado');
});

// ======================================================================= (d) log sem dado pessoal
Deno.test('S2(d) log das funções sem e-mail, apelido, nome ou CPF', async () => {
  // roda um fluxo inteiro com payloads que TÊM dado pessoal (falso) e procura no log
  const m = await familiaComCheckout();
  await m.webhook(aviso(eventoCheckout('CHECKOUT_PAID', { referencia: m.a().id })));
  await m.webhook(aviso(eventoPagamento('PAYMENT_CONFIRMED', { id: 'e1' })));
  await m.cancelar(pedido(JWT, { motivo: 'Pessoa Ficticia de Teste, responsavel.teste@exemplo.test' }));
  registrar({ funcao: 'teste', evento: 'responsavel.teste@exemplo.test', codigo: '123.456.789-09', tipo: 'Zeca e amigos' }, log);
  const antes = LOG.length;
  registrar({ funcao: 'teste', apelido: 'Lua', nome_do_pai: 'Joao' }, log);   // chave fora da lista nunca entra, mesmo sem cara de dado pessoal
  assertEquals(LOG[antes], '{"funcao":"teste"}');
  const tudo = LOG.join('\n');
  assert(LOG.length > 10, 'o teste precisa de log para olhar');
  for (const d of DADOS_PESSOAIS_FALSOS) assert(!tudo.includes(d), 'apareceu no log: ' + d.slice(0, 4) + '...');
  assert(!/@/.test(tudo), 'e-mail no log');
  assert(!/\d{3}\.?\d{3}\.?\d{3}-?\d{2}/.test(tudo), 'CPF no log');
  assert(!tudo.includes(TOKEN) && !tudo.includes('chave-falsa') && !tudo.includes('service-falsa'), 'segredo no log');
});
