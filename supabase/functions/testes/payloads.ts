// Payloads de webhook do Asaas montados a partir da documentação pública (lida em 09/11/2026).
// Os ids, valores e datas foram trocados para o cenário do Bobby; os NOMES dos campos e a forma
// do objeto seguem o exemplo da fonte citada em cada um. Nenhum dado real: e-mail, nome e CPF
// abaixo são falsos e existem só para provar que nada disso vai para o log.
// PENDENTE-CONTA (S0): trocar por eventos gravados no sandbox, sem dado pessoal.

/**
 * Cobrança. Fonte: https://docs.asaas.com/docs/webhook-para-cobrancas
 * (exemplo "PAYMENT_RECEIVED": id evt_..., event, dateCreated, account, payment{object, id, customer,
 * subscription, dueDate, value, netValue, billingType, status, confirmedDate, paymentDate, invoiceUrl, creditCard ...}).
 */
export function eventoPagamento(evento: string, o: { id?: string; pagamento?: string; assinatura?: string | null; vencimento?: string; valor?: number; billingType?: string; referencia?: string | null } = {}) {
  const status: Record<string, string> = {
    PAYMENT_CONFIRMED: 'CONFIRMED', PAYMENT_RECEIVED: 'RECEIVED', PAYMENT_OVERDUE: 'OVERDUE', PAYMENT_REFUNDED: 'REFUNDED', PAYMENT_CREATED: 'PENDING',
  };
  return {
    id: o.id ?? 'evt_05b708f961d739ea7eba7e4db318f621&368604920',
    event: evento,
    dateCreated: '2026-11-10 16:45:03',
    account: { id: '47ed0d25-f9fb-4b35-b23a-d8895caf92b7', ownerId: null },
    payment: {
      object: 'payment',
      id: o.pagamento ?? 'pay_080225913252',
      dateCreated: '2026-11-10',
      customer: 'cus_G7Dvo4iphUNk',
      subscription: o.assinatura === undefined ? 'sub_VXJBYgP2u0eO' : o.assinatura,
      installment: null,
      paymentLink: null,
      dueDate: o.vencimento ?? '2026-11-10',
      originalDueDate: o.vencimento ?? '2026-11-10',
      value: o.valor ?? 47,
      netValue: 44.51,
      originalValue: null,
      interestValue: null,
      nossoNumero: null,
      description: 'O Universo de Bobby, plano mensal',
      externalReference: o.referencia ?? null,
      billingType: o.billingType ?? 'CREDIT_CARD',
      status: status[evento] ?? 'PENDING',
      pixTransaction: null,
      confirmedDate: '2026-11-10',
      paymentDate: '2026-11-10',
      clientPaymentDate: '2026-11-10',
      installmentNumber: null,
      creditDate: '2026-12-10',
      custody: null,
      estimatedCreditDate: '2026-12-10',
      invoiceUrl: 'https://www.asaas.com/i/080225913252',
      bankSlipUrl: null,
      transactionReceiptUrl: 'https://www.asaas.com/comprovantes/4937311816045162',
      invoiceNumber: '00005101',
      deleted: false,
      anticipated: false,
      anticipable: false,
      lastInvoiceViewedDate: null,
      lastBankSlipViewedDate: null,
      postalService: false,
      creditCard: { creditCardNumber: '8829', creditCardBrand: 'MASTERCARD', creditCardToken: 'token-de-cartao-ficticio' },
      discount: { value: 0, dueDateLimitDays: 0, limitedDate: null, type: 'FIXED' },
      fine: { value: 0, type: 'FIXED' },
      interest: { value: 0, type: 'PERCENTAGE' },
    },
  };
}

/**
 * Assinatura. Fonte: https://docs.asaas.com/docs/eventos-para-assinaturas
 * (exemplo "SUBSCRIPTION_CREATED": subscription{object, id, dateCreated, customer, paymentLink, value,
 * nextDueDate, cycle, description, billingType, deleted, status, externalReference ...}).
 */
export function eventoAssinatura(evento: string, o: { id?: string; assinatura?: string; referencia?: string | null; ciclo?: string; checkoutSession?: string } = {}) {
  const s: Record<string, unknown> = {
    object: 'subscription',
    id: o.assinatura ?? 'sub_VXJBYgP2u0eO',
    dateCreated: '2026-11-10',
    customer: 'cus_G7Dvo4iphUNk',
    paymentLink: null,
    value: 47,
    nextDueDate: '2026-12-10',
    cycle: o.ciclo ?? 'MONTHLY',
    description: 'O Universo de Bobby, plano mensal',
    billingType: 'CREDIT_CARD',
    deleted: evento === 'SUBSCRIPTION_DELETED',
    status: evento === 'SUBSCRIPTION_DELETED' || evento === 'SUBSCRIPTION_INACTIVATED' ? 'INACTIVE' : 'ACTIVE',
    externalReference: o.referencia ?? null,
    sendPaymentByPostalService: false,
    discount: { value: 0, limitDate: null, dueDateLimitDays: 0, type: 'PERCENTAGE' },
    fine: { value: 0, type: 'PERCENTAGE' },
    interest: { value: 0, type: 'PERCENTAGE' },
  };
  if (o.checkoutSession) s.checkoutSession = o.checkoutSession;   // nome do campo PENDENTE-CONTA
  return {
    id: o.id ?? 'evt_6561b631fa5580caadd00bbe3b858607&9193',
    event: evento,
    dateCreated: '2026-11-10 11:11:04',
    account: { id: '47ed0d25-f9fb-4b35-b23a-d8895caf92b7', ownerId: null },
    subscription: s,
  };
}

/**
 * Checkout. Fonte: https://docs.asaas.com/docs/eventos-para-checkout
 * (exemplo "CHECKOUT_CREATED": checkout{id, link, status, minutesToExpire, billingTypes, chargeTypes,
 * callback, items, subscription ...}); customerData segue CheckoutSessionCustomerDataDTO de
 * https://docs.asaas.com/reference/criar-novo-checkout. Os dados do pagador são FALSOS.
 */
export function eventoCheckout(evento: string, o: { id?: string; checkout?: string; referencia?: string | null } = {}) {
  return {
    id: o.id ?? 'evt_37260be8159d4472b4458d3de13efc2d&15370',
    event: evento,
    dateCreated: '2026-11-10 18:07:47',
    account: { id: '47ed0d25-f9fb-4b35-b23a-d8895caf92b7', ownerId: null },
    checkout: {
      id: o.checkout ?? '2bd251f0-09b2-44ff-8a0c-a5cb29e5bbda',
      link: null,
      status: evento === 'CHECKOUT_PAID' ? 'PAID' : 'ACTIVE',
      minutesToExpire: 60,
      billingTypes: ['CREDIT_CARD'],
      chargeTypes: ['RECURRENT'],
      externalReference: o.referencia ?? null,
      callback: { cancelUrl: 'https://app.exemplo.test/?assinatura=cancelada', successUrl: 'https://app.exemplo.test/?assinatura=ok', expiredUrl: 'https://app.exemplo.test/?assinatura=expirada' },
      items: [{ name: 'O Universo de Bobby, plano mensal', description: 'O Universo de Bobby, plano mensal', quantity: 1, value: 47 }],
      customerData: { name: 'Pessoa Ficticia de Teste', cpfCnpj: '12345678909', email: 'responsavel.teste@exemplo.test', phone: '51999990000' },
      subscription: { cycle: 'MONTHLY', nextDueDate: '2026-11-10T03:00:00+0000', endDate: null },
      installment: null,
      split: null,
    },
  };
}

/** Resposta do POST /v3/checkouts. Fonte: CheckoutSessionResponseDTO em https://docs.asaas.com/reference/criar-novo-checkout */
export function respostaCheckout(id = 'c7b1c696-b27b-4d3d-80b9-d1c018e387f8') {
  return { id, link: null, status: 'ACTIVE', billingTypes: ['CREDIT_CARD'], chargeTypes: ['RECURRENT'], minutesToExpire: 60, externalReference: null };
}

/** Dados falsos do pagador usados acima, para o teste procurar no log. */
export const DADOS_PESSOAIS_FALSOS = ['Pessoa Ficticia de Teste', '12345678909', 'responsavel.teste@exemplo.test', '51999990000', 'Zeca'];
