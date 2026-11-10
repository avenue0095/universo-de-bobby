// =============================================================================
// Acesso ao banco pelas Edge Functions (papel service_role, só no servidor).
// A interface existe para os testes trocarem o banco por memória (testes/memoria.ts).
// A implementação real fala com o PostgREST do Supabase por fetch, sem biblioteca:
// nada a baixar e nada a atualizar. PENDENTE-CONTA: rodar contra o banco real na S1.
// =============================================================================

import type { Fetch } from './auth.ts';
import type { Plano } from './config.ts';

export type StatusAssinatura = 'pendente' | 'ativa' | 'atrasada' | 'cancelada' | 'expirada' | 'reembolsada';
export type StatusPagamento = 'pendente' | 'confirmado' | 'recebido' | 'vencido' | 'estornado' | 'falhou';

export interface Assinatura {
  id: string;
  responsavel_id: string;
  provedor: string;
  provedor_cliente_id: string | null;
  provedor_assinatura_id: string | null;
  provedor_checkout_id: string | null;
  plano: Plano;
  valor_centavos: number;
  status: StatusAssinatura;
  max_perfis: number;
  inicio_em: string | null;
  acesso_ate: string | null;
  cancelada_em: string | null;
  motivo_cancelamento: string | null;
  criado_em: string;
}

export interface Pagamento {
  provedor_pagamento_id: string;
  assinatura_id: string | null;
  responsavel_id: string | null;
  provedor: string;
  valor_centavos: number;
  metodo: 'cartao' | 'pix' | 'boleto' | null;
  status: StatusPagamento;
  vencimento: string | null;
  pago_em: string | null;
}

export type NovaAssinatura = Pick<Assinatura, 'responsavel_id' | 'plano' | 'valor_centavos' | 'status' | 'max_perfis'> &
  Partial<Pick<Assinatura, 'provedor_checkout_id'>>;

/** Resposta de public.reabrir_assinatura_paga (0008). 'mudou': já não está expirada (outro aviso tratou), o webhook relê. */
export type ResultadoReabrir = 'reaberta' | 'mudou' | 'expirada_ja_usada' | 'pagamento_duplicado' | 'sem_assinatura';
export const RESULTADOS_REABRIR: readonly ResultadoReabrir[] = ['reaberta', 'mudou', 'expirada_ja_usada', 'pagamento_duplicado', 'sem_assinatura'];

export type FiltroAssinatura = { id: string } | { provedor_assinatura_id: string } | { provedor_checkout_id: string };

export interface Repositorio {
  /** Conta uma chamada na janela; true se ainda cabe (public.limite_ok, só service_role). */
  limiteOk(chave: string, max: number, janela: string): Promise<boolean>;
  /** Tipos de consentimento cujo registro MAIS RECENTE é aceito = true. */
  consentimentosAceitos(uid: string): Promise<Set<string>>;
  /** Assinatura mais recente da família que ainda conta (pendente, ativa, atrasada ou cancelada). */
  assinaturaDoResponsavel(uid: string): Promise<Assinatura | null>;
  inserirAssinatura(a: NovaAssinatura): Promise<Assinatura>;
  atualizarAssinatura(id: string, patch: Partial<Assinatura>): Promise<void>;
  buscarAssinatura(f: FiltroAssinatura): Promise<Assinatura | null>;
  /**
   * Reabre, numa transação só e com a família travada, a assinatura 'expirada' que foi paga (public.reabrir_assinatura_paga, 0008):
   * expira o checkout pendente mais novo e ativa a paga com inicio_em = agora e acesso_ate = o maior. Não reabre se já teve acesso
   * ou se a família tem outra assinatura valendo (ativa, atrasada, cancelada com acesso no futuro).
   */
  reabrirAssinaturaPaga(id: string, acessoAte: string, agora: string): Promise<ResultadoReabrir>;
  /** Idempotência do webhook: 'novo' grava a linha; 'ja_processado' manda sair; 'reprocessar' é evento que falhou antes. */
  registrarEvento(id: string, tipo: string): Promise<'novo' | 'ja_processado' | 'reprocessar'>;
  concluirEvento(id: string, erro: string | null): Promise<void>;
  /** Upsert por provedor_pagamento_id (uma linha por cobrança, nunca duas). */
  salvarPagamento(p: Pagamento): Promise<void>;
  /** A linha da cobrança, se já existe (o webhook junta com o evento por mesclarPagamento antes de gravar). */
  buscarPagamento(provedorPagamentoId: string): Promise<Pagamento | null>;
  pagamentosDaAssinatura(assinaturaId: string): Promise<Pagamento[]>;
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const ID_PROVEDOR = /^[A-Za-z0-9_&.:-]{1,120}$/;

function exigir(cond: boolean, msg: string): void { if (!cond) throw new Error(msg); }

/** Implementação real: PostgREST com a chave service_role (só existe no servidor). */
export class RepositorioPostgrest implements Repositorio {
  constructor(private readonly url: string, private readonly chave: string, private readonly f: Fetch = fetch) {
    exigir(!!url && !!chave, 'SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY são obrigatórios');
  }

  private async pedir(caminho: string, init: RequestInit & { prefer?: string } = {}): Promise<unknown> {
    const headers: Record<string, string> = {
      apikey: this.chave,
      Authorization: 'Bearer ' + this.chave,
      'Content-Type': 'application/json',
    };
    if (init.prefer) headers['Prefer'] = init.prefer;
    const r = await this.f(this.url + '/rest/v1/' + caminho, { ...init, headers });
    if (!r.ok) {
      await r.body?.cancel();
      throw new Error('banco respondeu ' + r.status);   // sem corpo: pode ecoar dado
    }
    const t = await r.text();
    return t ? JSON.parse(t) : null;
  }

  async limiteOk(chave: string, max: number, janela: string): Promise<boolean> {
    const r = await this.pedir('rpc/limite_ok', { method: 'POST', body: JSON.stringify({ p_chave: chave, p_max: max, p_janela: janela }) });
    return r === true;
  }

  async consentimentosAceitos(uid: string): Promise<Set<string>> {
    exigir(UUID.test(uid), 'uid inválido');
    const linhas = await this.pedir(
      'consentimento?select=tipo,aceito&responsavel_id=eq.' + uid + '&order=criado_em.desc,id.desc&limit=200',
    ) as { tipo: string; aceito: boolean }[];
    const visto = new Set<string>(), ok = new Set<string>();
    for (const l of linhas ?? []) {
      if (visto.has(l.tipo)) continue;
      visto.add(l.tipo);
      if (l.aceito) ok.add(l.tipo);
    }
    return ok;
  }

  async assinaturaDoResponsavel(uid: string): Promise<Assinatura | null> {
    exigir(UUID.test(uid), 'uid inválido');
    const r = await this.pedir(
      'assinatura?select=*&responsavel_id=eq.' + uid + '&status=in.(pendente,ativa,atrasada,cancelada)&order=criado_em.desc&limit=1',
    ) as Assinatura[];
    return r?.[0] ?? null;
  }

  async inserirAssinatura(a: NovaAssinatura): Promise<Assinatura> {
    const r = await this.pedir('assinatura', { method: 'POST', body: JSON.stringify(a), prefer: 'return=representation' }) as Assinatura[];
    return r[0];
  }

  async atualizarAssinatura(id: string, patch: Partial<Assinatura>): Promise<void> {
    exigir(UUID.test(id), 'id inválido');
    await this.pedir('assinatura?id=eq.' + id, { method: 'PATCH', body: JSON.stringify(patch), prefer: 'return=minimal' });
  }

  async buscarAssinatura(f: FiltroAssinatura): Promise<Assinatura | null> {
    const [campo, valor] = Object.entries(f)[0] as [string, string];
    exigir(campo === 'id' ? UUID.test(valor) : ID_PROVEDOR.test(valor), 'filtro inválido');
    const r = await this.pedir('assinatura?select=*&' + campo + '=eq.' + encodeURIComponent(valor) + '&limit=1') as Assinatura[];
    return r?.[0] ?? null;
  }

  async reabrirAssinaturaPaga(id: string, acessoAte: string, agora: string): Promise<ResultadoReabrir> {
    exigir(UUID.test(id), 'id inválido');
    const r = await this.pedir('rpc/reabrir_assinatura_paga', {
      method: 'POST',
      body: JSON.stringify({ p_assinatura: id, p_acesso_ate: acessoAte, p_agora: agora }),
    });
    exigir(typeof r === 'string' && (RESULTADOS_REABRIR as readonly string[]).includes(r), 'resposta inesperada de reabrir_assinatura_paga');
    return r as ResultadoReabrir;
  }

  async registrarEvento(id: string, tipo: string): Promise<'novo' | 'ja_processado' | 'reprocessar'> {
    const novo = await this.pedir('webhook_evento?on_conflict=id', {
      method: 'POST',
      body: JSON.stringify({ id, tipo, provedor: 'asaas' }),
      prefer: 'resolution=ignore-duplicates,return=representation',
    }) as unknown[];
    if (novo && novo.length) return 'novo';
    const r = await this.pedir('webhook_evento?select=processado_em&id=eq.' + encodeURIComponent(id)) as { processado_em: string | null }[];
    return r?.[0]?.processado_em ? 'ja_processado' : 'reprocessar';
  }

  async concluirEvento(id: string, erro: string | null): Promise<void> {
    const patch = erro ? { erro: erro.slice(0, 80) } : { processado_em: new Date().toISOString(), erro: null };
    await this.pedir('webhook_evento?id=eq.' + encodeURIComponent(id), { method: 'PATCH', body: JSON.stringify(patch), prefer: 'return=minimal' });
  }

  async salvarPagamento(p: Pagamento): Promise<void> {
    exigir(ID_PROVEDOR.test(p.provedor_pagamento_id), 'id de pagamento inválido');
    await this.pedir('pagamento?on_conflict=provedor_pagamento_id', {
      method: 'POST',
      body: JSON.stringify(p),
      prefer: 'resolution=merge-duplicates,return=minimal',
    });
  }

  async buscarPagamento(provedorPagamentoId: string): Promise<Pagamento | null> {
    exigir(ID_PROVEDOR.test(provedorPagamentoId), 'id de pagamento inválido');
    const r = await this.pedir(
      'pagamento?select=provedor_pagamento_id,assinatura_id,responsavel_id,provedor,valor_centavos,metodo,status,vencimento,pago_em' +
        '&provedor_pagamento_id=eq.' + encodeURIComponent(provedorPagamentoId) + '&limit=1',
    ) as Pagamento[];
    return r?.[0] ?? null;
  }

  async pagamentosDaAssinatura(assinaturaId: string): Promise<Pagamento[]> {
    exigir(UUID.test(assinaturaId), 'id inválido');
    return (await this.pedir('pagamento?select=*&assinatura_id=eq.' + assinaturaId + '&order=criado_em.desc&limit=50') as Pagamento[]) ?? [];
  }
}
