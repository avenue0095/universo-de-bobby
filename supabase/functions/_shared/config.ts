// =============================================================================
// O Universo de Bobby · Edge Functions · configuração
// Preço, ciclo, tolerância e limites ficam AQUI (servidor), nunca no app.
// O app lê o preço por função para mostrar na área do responsável (ARQUITETURA.md 6.1).
// Nenhum segredo neste arquivo: chaves só via Deno.env (lerAmbiente, abaixo).
// =============================================================================

export type Plano = 'mensal' | 'anual';

/** Preço decidido pelo Filipe em 08/11/2026. O preço nunca muda (decisão do Filipe). */
export const PLANOS: Readonly<Record<Plano, { centavos: number; ciclo: 'MONTHLY' | 'YEARLY'; meses: number; nome: string }>> = Object.freeze({
  mensal: Object.freeze({ centavos: 4700, ciclo: 'MONTHLY', meses: 1, nome: 'O Universo de Bobby, plano mensal' }),
  anual: Object.freeze({ centavos: 29700, ciclo: 'YEARLY', meses: 12, nome: 'O Universo de Bobby, plano anual' }),
});

/** Dias de folga depois do fim do ciclo pago (cobre feriado e atraso do Pix; ARQUITETURA.md 6.2). */
export const TOLERANCIA_DIAS = 3;

/** Perfis por família (0001_schema.sql, assinatura.max_perfis). */
export const MAX_PERFIS = 4;

/** Direito de arrependimento (CDC art. 49; prazo e texto ficam com o advogado). */
export const DIAS_REEMBOLSO = 7;

/**
 * Muro do app. Decisão do Filipe: o muro final é 'tudo-pago', mas o app continua
 * com MURO = {modo:'aberto'} até existir checagem no servidor. Aqui fica só como
 * referência do que o servidor considera; o app não lê isto ainda.
 */
export const MURO_FINAL = Object.freeze({ modo: 'tudo-pago' as const });

/** Consentimentos exigidos antes do checkout (CONSENTIMENTO-E-TERMOS.md). */
export const CONSENTIMENTOS_OBRIGATORIOS = Object.freeze(['termos', 'privacidade', 'parental'] as const);

/** Limites por conta (seguranca-minima item 3). A chave do contador vem do uid do JWT, nunca do corpo. */
export const LIMITES = Object.freeze({
  checkout: { max: 10, janela: '1 day' },
  cancelar: { max: 10, janela: '1 day' },
  reembolso: { max: 5, janela: '1 day' },
});

/** Minutos que o link do Checkout fica válido (o Asaas aceita de 10 a 1440). */
export const CHECKOUT_MINUTOS = 60;

/**
 * Imagem do item no Checkout. O Asaas marca imageBase64 como obrigatório no item
 * (CheckoutSessionItemsDTO, https://docs.asaas.com/reference/criar-novo-checkout).
 * PNG de 1 x 1 transparente até o Filipe escolher a arte (PENDENTE-CONTA: conferir no sandbox).
 */
export const IMAGEM_ITEM_BASE64 =
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';

export const ASAAS_URL = Object.freeze({
  sandbox: 'https://api-sandbox.asaas.com/v3',   // https://docs.asaas.com/docs/autenticação-1
  producao: 'https://api.asaas.com/v3',
});

export interface Ambiente {
  supabaseUrl: string;
  supabaseAnonKey: string;
  supabaseServiceRoleKey: string;
  asaasAmbiente: 'sandbox' | 'producao';
  asaasApiKey: string;
  asaasWebhookToken: string;
  appUrl: string;
}

/**
 * Lê o ambiente. Recebe a função de leitura para os testes injetarem valores falsos;
 * em produção é Deno.env.get. Nunca devolve nem registra o valor de uma chave.
 */
export function lerAmbiente(get: (nome: string) => string | undefined = (n) => Deno.env.get(n)): Ambiente {
  const amb = (get('ASAAS_AMBIENTE') ?? 'sandbox') === 'producao' ? 'producao' : 'sandbox';
  return {
    supabaseUrl: (get('SUPABASE_URL') ?? '').replace(/\/+$/, ''),
    supabaseAnonKey: get('SUPABASE_ANON_KEY') ?? '',
    supabaseServiceRoleKey: get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    asaasAmbiente: amb,
    asaasApiKey: get('ASAAS_API_KEY') ?? '',
    asaasWebhookToken: get('ASAAS_WEBHOOK_TOKEN') ?? '',
    appUrl: (get('APP_URL') ?? '').replace(/\/+$/, ''),
  };
}

/** Fim do ciclo pago + tolerância. Base: vencimento da cobrança (data, fuso de Brasília). */
export function acessoAteDe(vencimento: string, plano: Plano): Date {
  const [a, m, d] = vencimento.slice(0, 10).split('-').map(Number);
  if (!a || !m || !d) throw new Error('vencimento inválido');
  const meses = PLANOS[plano].meses;
  // meia-noite de Brasília (UTC-3, sem horário de verão desde 2019) do vencimento + ciclo + tolerância
  const base = new Date(Date.UTC(a, m - 1 + meses, d, 3, 0, 0));
  // mês sem o dia (31/01 + 1 mês): Date.UTC rola para março; volta para o último dia do mês certo
  const mesAlvo = (m - 1 + meses) % 12;
  if (base.getUTCMonth() !== mesAlvo) base.setUTCDate(0);
  base.setUTCDate(base.getUTCDate() + TOLERANCIA_DIAS);
  return base;
}
