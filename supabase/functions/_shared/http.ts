// =============================================================================
// Respostas HTTP, CORS e log sem dado pessoal.
// =============================================================================

/** Só estas chaves entram no log. Nada de e-mail, apelido, nome, CPF, token ou payload. */
const CHAVES_DE_LOG = new Set(['funcao', 'evento', 'tipo', 'status', 'codigo', 'assinatura_id', 'pagamento_id', 'evento_id', 'http']);
const PARECE_PESSOAL = /@|\d{3}\.?\d{3}\.?\d{3}-?\d{2}|\s/;   // e-mail, CPF ou texto livre com espaço

export type Registro = Record<string, string | number | boolean | null | undefined>;
export type Logger = (linha: string) => void;

/**
 * Registra uma linha de log com ids e códigos apenas. Chave fora da lista ou valor que
 * parece e-mail, CPF ou texto livre é descartado (seguranca-minima item 5, lgpd-gate 5).
 */
export function registrar(dados: Registro, saida: Logger = (l) => console.log(l)): void {
  const limpo: Record<string, string | number | boolean> = {};
  for (const [k, v] of Object.entries(dados)) {
    if (!CHAVES_DE_LOG.has(k) || v === null || v === undefined) continue;
    if (typeof v === 'string' && (v.length > 80 || PARECE_PESSOAL.test(v))) continue;
    limpo[k] = v;
  }
  saida(JSON.stringify(limpo));
}

export function cabecalhosCors(origemPermitida: string, origem: string | null): Record<string, string> {
  const h: Record<string, string> = {
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'authorization, content-type, apikey, x-client-info',
    'Vary': 'Origin',
  };
  if (origemPermitida && origem === origemPermitida) h['Access-Control-Allow-Origin'] = origemPermitida;
  return h;
}

export function json(status: number, corpo: unknown, extra: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(corpo), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff', ...extra },
  });
}

/** Lê o corpo como JSON com teto de tamanho. Devolve null se não for JSON válido. */
export async function lerJson(req: Request, maxBytes = 64 * 1024): Promise<unknown | null> {
  const texto = await req.text();
  if (texto.length > maxBytes) return null;
  if (!texto) return {};
  try { return JSON.parse(texto); } catch { return null; }
}
