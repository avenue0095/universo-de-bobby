// =============================================================================
// Provedor de pagamento: Asaas (ARQUITETURA.md 7). Toda a conversa com o Asaas
// mora aqui; se o plano B (Stripe) entrar, só este arquivo muda.
//
// Fontes (documentação pública, lida em 09/11/2026):
//   autenticação (cabeçalho access_token, URLs)  https://docs.asaas.com/docs/autenticação-1
//   checkout recorrente (POST /v3/checkouts)      https://docs.asaas.com/docs/checkout-com-assinatura-recorrente
//   campos do checkout                            https://docs.asaas.com/reference/criar-novo-checkout
//   link do checkout                              https://docs.asaas.com/docs/link-do-checkout-e-redirecionamento-do-cliente
//   remover assinatura (DELETE /v3/subscriptions/{id}) https://docs.asaas.com/reference/remover-assinatura
//   estornar cobrança (POST /v3/payments/{id}/refund)  https://docs.asaas.com/reference/estornar-cobranca
//   eventos de cobrança                           https://docs.asaas.com/docs/webhook-para-cobrancas
//   eventos de assinatura                         https://docs.asaas.com/docs/eventos-para-assinaturas
//   eventos de checkout                           https://docs.asaas.com/docs/eventos-para-checkout
//
// Por que Checkout e não POST /v3/customers + /v3/subscriptions: o cliente da API
// exige name e cpfCnpj (https://docs.asaas.com/reference/criar-novo-cliente) e o
// Bobby não guarda nome nem CPF. No Checkout o responsável digita isso na página
// do Asaas. Consequência: o Checkout recorrente aceita só cartão (doc acima);
// Pix na assinatura fica para decisão do Filipe (item 9b do PLANO).
// =============================================================================

import type { Fetch } from './auth.ts';
import { ASAAS_URL, CHECKOUT_MINUTOS, IMAGEM_ITEM_BASE64, PLANOS, type Plano } from './config.ts';
import type { StatusPagamento } from './repositorio.ts';

export class ErroProvedor extends Error {
  constructor(public readonly status: number) { super('provedor respondeu ' + status); }
}

export interface Checkout { id: string; url: string }

/** Evento do webhook já reduzido ao que o Bobby usa. Nada de nome, e-mail, CPF ou cartão. */
export interface EventoAsaas {
  id: string;
  tipo: string;
  pagamento: null | {
    id: string;
    assinatura: string | null;
    referencia: string | null;
    valorCentavos: number;
    metodo: 'cartao' | 'pix' | 'boleto' | null;
    vencimento: string | null;
    pagoEm: string | null;
  };
  assinatura: null | { id: string; referencia: string | null; checkout: string | null };
  checkout: null | { id: string; referencia: string | null; assinatura: string | null };
}

const ID = /^[A-Za-z0-9_&.:-]{1,120}$/;
const txt = (v: unknown): string | null => (typeof v === 'string' && ID.test(v) ? v : null);
const data = (v: unknown): string | null => (typeof v === 'string' && /^\d{4}-\d{2}-\d{2}/.test(v) ? v.slice(0, 10) : null);

function metodoDe(billingType: unknown): 'cartao' | 'pix' | 'boleto' | null {
  switch (billingType) {
    case 'CREDIT_CARD': case 'DEBIT_CARD': return 'cartao';
    case 'PIX': return 'pix';
    case 'BOLETO': return 'boleto';
    default: return null;
  }
}

/** Status da cobrança no Bobby a partir do EVENTO (o evento é mais confiável que o campo status). */
export function statusDoPagamento(tipo: string): StatusPagamento | null {
  switch (tipo) {
    case 'PAYMENT_CREATED': case 'PAYMENT_UPDATED': case 'PAYMENT_RESTORED': return 'pendente';
    case 'PAYMENT_CONFIRMED': return 'confirmado';
    case 'PAYMENT_RECEIVED': return 'recebido';
    case 'PAYMENT_OVERDUE': return 'vencido';
    case 'PAYMENT_REFUNDED': case 'PAYMENT_PARTIALLY_REFUNDED': case 'PAYMENT_CHARGEBACK_REQUESTED': return 'estornado';
    case 'PAYMENT_CREDIT_CARD_CAPTURE_REFUSED': case 'PAYMENT_REPROVED_BY_RISK_ANALYSIS': case 'PAYMENT_DELETED': return 'falhou';
    default: return null;
  }
}

/** Lê o corpo do webhook. Devolve null se não tiver id e event (payload inválido). */
export function lerEvento(corpo: unknown): EventoAsaas | null {
  if (!corpo || typeof corpo !== 'object') return null;
  const c = corpo as Record<string, unknown>;
  const id = typeof c.id === 'string' && c.id.length <= 120 ? c.id : null;
  const tipo = typeof c.event === 'string' && /^[A-Z_]{3,60}$/.test(c.event) ? c.event : null;
  if (!id || !tipo) return null;
  const p = c.payment as Record<string, unknown> | undefined;
  const s = c.subscription as Record<string, unknown> | undefined;
  const k = c.checkout as Record<string, unknown> | undefined;
  return {
    id,
    tipo,
    pagamento: p && txt(p.id) ? {
      id: txt(p.id)!,
      assinatura: txt(p.subscription),
      referencia: txt(p.externalReference),
      valorCentavos: typeof p.value === 'number' && p.value >= 0 ? Math.round(p.value * 100) : 0,
      metodo: metodoDe(p.billingType),
      vencimento: data(p.dueDate),
      pagoEm: data(p.confirmedDate) ?? data(p.paymentDate) ?? data(p.clientPaymentDate),
    } : null,
    // checkoutSession: nome do campo PENDENTE-CONTA (confirmar no sandbox qual campo da assinatura aponta o Checkout)
    assinatura: s && txt(s.id) ? { id: txt(s.id)!, referencia: txt(s.externalReference), checkout: txt(s.checkoutSession) } : null,
    checkout: k && txt(k.id) ? { id: txt(k.id)!, referencia: txt(k.externalReference), assinatura: txt(k.subscription) } : null,
  };
}

/** Data e hora de Brasília no formato que o Asaas usa ("2027-01-31 15:02:38"). */
function agoraBrasilia(agora: Date): string {
  const t = new Date(agora.getTime() - 3 * 3600 * 1000).toISOString();
  return t.slice(0, 10) + ' ' + t.slice(11, 19);
}

export class ProvedorAsaas {
  private readonly base: string;
  constructor(private readonly apiKey: string, ambiente: 'sandbox' | 'producao', private readonly f: Fetch = fetch) {
    if (!apiKey) throw new Error('ASAAS_API_KEY ausente');
    this.base = ASAAS_URL[ambiente];
  }

  private async pedir(metodo: string, caminho: string, corpo?: unknown): Promise<Record<string, unknown>> {
    const r = await this.f(this.base + caminho, {
      method: metodo,
      headers: { access_token: this.apiKey, 'Content-Type': 'application/json', 'User-Agent': 'universo-de-bobby' },
      body: corpo === undefined ? undefined : JSON.stringify(corpo),
    });
    if (!r.ok) { await r.body?.cancel(); throw new ErroProvedor(r.status); }   // sem corpo no erro: pode ter dado do pagador
    return (await r.json().catch(() => ({}))) as Record<string, unknown>;
  }

  /**
   * Cria o Checkout recorrente. referencia = id da assinatura no Bobby (uuid, sem dado pessoal),
   * vai em externalReference para o webhook achar a família.
   */
  async criarCheckout(plano: Plano, referencia: string, appUrl: string, agora = new Date()): Promise<Checkout> {
    const p = PLANOS[plano];
    const volta = (estado: string) => appUrl + '/?assinatura=' + estado;
    const r = await this.pedir('POST', '/checkouts', {
      billingTypes: ['CREDIT_CARD'],
      chargeTypes: ['RECURRENT'],
      minutesToExpire: CHECKOUT_MINUTOS,
      externalReference: referencia,
      callback: { successUrl: volta('ok'), cancelUrl: volta('cancelada'), expiredUrl: volta('expirada') },
      items: [{ name: p.nome, description: p.nome, quantity: 1, value: p.centavos / 100, imageBase64: IMAGEM_ITEM_BASE64 }],
      subscription: { cycle: p.ciclo, nextDueDate: agoraBrasilia(agora) },
    });
    const id = txt(r.id);
    if (!id) throw new ErroProvedor(502);
    const link = typeof r.link === 'string' && /^https:\/\/([a-z0-9-]+\.)*asaas\.com\//.test(r.link) ? r.link : null;
    // sem link na resposta: monta como a doc manda (asaas.com/checkoutSession/show?id=). O host do sandbox é PENDENTE-CONTA.
    const host = this.base.includes('sandbox') ? 'https://sandbox.asaas.com' : 'https://asaas.com';
    return { id, url: link ?? host + '/checkoutSession/show?id=' + encodeURIComponent(id) };
  }

  async cancelarAssinatura(assinaturaId: string): Promise<void> {
    if (!txt(assinaturaId)) throw new Error('id inválido');
    await this.pedir('DELETE', '/subscriptions/' + encodeURIComponent(assinaturaId));
  }

  async estornarPagamento(pagamentoId: string): Promise<void> {
    if (!txt(pagamentoId)) throw new Error('id inválido');
    await this.pedir('POST', '/payments/' + encodeURIComponent(pagamentoId) + '/refund', {});
  }
}
