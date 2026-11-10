// =============================================================================
// Sessão do responsável e comparação de token em tempo constante.
// seguranca-minima item 1: toda rota valida o JWT NO SERVIDOR antes de ler ou gravar.
// O uid vem do Auth do Supabase, nunca do corpo do pedido.
// =============================================================================

export type Fetch = typeof fetch;

/**
 * Valida o JWT do cabeçalho Authorization no Auth do Supabase (GET /auth/v1/user,
 * o mesmo que supabase.auth.getUser(jwt) faz) e devolve o uid, ou null.
 * Só aceita usuário com e-mail confirmado (ARQUITETURA.md 4).
 */
export async function uidDaRequisicao(
  req: Request,
  amb: { supabaseUrl: string; supabaseAnonKey: string },
  f: Fetch = fetch,
): Promise<string | null> {
  const cab = req.headers.get('authorization') ?? '';
  const m = /^Bearer\s+([A-Za-z0-9._-]{20,4096})$/.exec(cab.trim());
  if (!m || !amb.supabaseUrl || !amb.supabaseAnonKey) return null;
  let r: Response;
  try {
    r = await f(amb.supabaseUrl + '/auth/v1/user', {
      headers: { apikey: amb.supabaseAnonKey, Authorization: 'Bearer ' + m[1] },
    });
  } catch {
    return null;
  }
  if (!r.ok) { await r.body?.cancel(); return null; }
  const u = await r.json().catch(() => null) as { id?: unknown; email_confirmed_at?: unknown } | null;
  if (!u || typeof u.id !== 'string' || !/^[0-9a-f-]{36}$/i.test(u.id)) return null;
  if (!u.email_confirmed_at) return null;
  return u.id;
}

/**
 * Compara dois segredos em tempo constante. Os dois passam por SHA-256 antes, então o
 * tempo não depende nem do tamanho nem da posição do primeiro caractere diferente.
 * Segredo vazio nunca confere (servidor sem token configurado recusa tudo).
 */
export async function tokensIguais(recebido: string | null, esperado: string): Promise<boolean> {
  if (!esperado || recebido === null) return false;
  const enc = new TextEncoder();
  const [a, b] = await Promise.all([
    crypto.subtle.digest('SHA-256', enc.encode(recebido)),
    crypto.subtle.digest('SHA-256', enc.encode(esperado)),
  ]);
  const x = new Uint8Array(a), y = new Uint8Array(b);
  let dif = 0;
  for (let i = 0; i < x.length; i++) dif |= x[i] ^ y[i];
  return dif === 0;
}
