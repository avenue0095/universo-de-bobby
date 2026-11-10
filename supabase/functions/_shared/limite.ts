// =============================================================================
// Limite de tentativas por conta (seguranca-minima item 3).
// A chave do contador é montada aqui a partir do uid que o Auth devolveu: quem
// chama não escolhe a chave e não consegue esgotar o limite de outra família.
// O contador mora no banco (public.limite_ok, 0001_schema.sql), que só o
// service_role executa.
// =============================================================================

import { LIMITES } from './config.ts';
import type { Repositorio } from './repositorio.ts';

export type Acao = keyof typeof LIMITES;

export async function dentroDoLimite(repo: Repositorio, acao: Acao, uid: string): Promise<boolean> {
  const l = LIMITES[acao];
  try {
    return await repo.limiteOk(acao + ':' + uid, l.max, l.janela);
  } catch {
    return false;   // banco fora do ar: recusa (falha fechada), o app tenta de novo depois
  }
}
