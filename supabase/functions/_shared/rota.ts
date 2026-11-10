// =============================================================================
// Moldura das funções chamadas pelo app (com sessão do responsável).
// Faz, nesta ordem: CORS, só POST, JWT validado no Auth (401 sem sessão).
// Só depois disso a função recebe o uid.
// =============================================================================

import { type Fetch, uidDaRequisicao } from './auth.ts';
import type { Ambiente } from './config.ts';
import type { Checkout } from './provedor-asaas.ts';
import { cabecalhosCors, json, type Logger, registrar } from './http.ts';
import type { Repositorio } from './repositorio.ts';
import type { Plano } from './config.ts';

export interface Provedor {
  criarCheckout(plano: Plano, referencia: string, appUrl: string, agora?: Date): Promise<Checkout>;
  cancelarAssinatura(assinaturaId: string): Promise<void>;
  estornarPagamento(pagamentoId: string): Promise<void>;
}

export interface Deps {
  amb: Ambiente;
  repo: Repositorio;
  provedor: Provedor;
  fetchAuth?: Fetch;
  log?: Logger;
  agora?: () => Date;
}

export type Corpo = (uid: string, req: Request, cors: Record<string, string>) => Promise<Response>;

export function rotaComSessao(nome: string, deps: Deps, corpo: Corpo): (req: Request) => Promise<Response> {
  return async (req: Request) => {
    const cors = cabecalhosCors(deps.amb.appUrl, req.headers.get('origin'));
    if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
    if (req.method !== 'POST') return json(405, { erro: 'Use POST.' }, cors);
    const uid = await uidDaRequisicao(req, deps.amb, deps.fetchAuth ?? fetch);
    if (!uid) {
      registrar({ funcao: nome, http: 401 }, deps.log);
      return json(401, { erro: 'Entre na conta do responsável para continuar.' }, cors);
    }
    try {
      return await corpo(uid, req, cors);
    } catch (e) {
      registrar({ funcao: nome, http: 500, codigo: e instanceof Error ? e.constructor.name : 'erro' }, deps.log);
      return json(500, { erro: 'Não deu certo agora. Tente de novo em alguns minutos.' }, cors);
    }
  };
}
