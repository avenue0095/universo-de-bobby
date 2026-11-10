// =============================================================================
// webhook-pagamento · aviso do Asaas sobre cobrança, assinatura e checkout.
//
// ROTA PÚBLICA, DE PROPÓSITO (seguranca-minima item 1): quem chama é o servidor
// do Asaas, que não tem sessão de usuário. Publicar com verify_jwt desligado
// (supabase functions deploy webhook-pagamento --no-verify-jwt). A proteção é o
// token que o Asaas manda no cabeçalho asaas-access-token
// (https://docs.asaas.com/docs/receba-eventos-do-asaas-no-seu-endpoint-de-webhook),
// conferido em tempo constante contra ASAAS_WEBHOOK_TOKEN. Sem token certo: 401
// e nada é lido do banco. Limite por IP fica na Cloudflare (ARQUITETURA.md 9, item 3).
//
// Idempotente: o id do evento entra em webhook_evento antes de qualquer gravação;
// evento repetido e já processado responde 200 e sai. Toda gravação é upsert ou
// "maior data vence", então reprocessar um evento que falhou no meio não duplica.
// Fora de ordem: o estado da cobrança só avança (pendente < confirmado < recebido,
// estornado terminal; _shared/pagamento.ts e gatilho da 0005).
//
// O payload NÃO é guardado nem registrado (tem nome, e-mail e CPF do pagador).
// O log leva só id do evento, tipo e id da assinatura.
// =============================================================================

import { tokensIguais } from '../_shared/auth.ts';
import { acessoAteDe, lerAmbiente } from '../_shared/config.ts';
import { json, type Logger, lerJson, registrar } from '../_shared/http.ts';
import { mesclarPagamento } from '../_shared/pagamento.ts';
import { type EventoAsaas, lerEvento, statusDoPagamento } from '../_shared/provedor-asaas.ts';
import { type Assinatura, type Repositorio, RepositorioPostgrest } from '../_shared/repositorio.ts';

export interface DepsWebhook {
  token: string;
  repo: Repositorio;
  log?: Logger;
  agora?: () => Date;
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Acha a assinatura do Bobby: pelo id da assinatura no Asaas, pela referência (nosso uuid) ou pelo Checkout. */
async function acharAssinatura(repo: Repositorio, ev: EventoAsaas): Promise<Assinatura | null> {
  const subId = ev.pagamento?.assinatura ?? ev.assinatura?.id ?? ev.checkout?.assinatura ?? null;
  const refs = [ev.pagamento?.referencia, ev.assinatura?.referencia, ev.checkout?.referencia].filter((x): x is string => !!x && UUID.test(x));
  const chk = ev.checkout?.id ?? ev.assinatura?.checkout ?? null;

  let a: Assinatura | null = null;
  if (subId) a = await repo.buscarAssinatura({ provedor_assinatura_id: subId });
  for (const r of refs) if (!a) a = await repo.buscarAssinatura({ id: r });
  if (!a && chk) a = await repo.buscarAssinatura({ provedor_checkout_id: chk });
  // primeira vez que o id da assinatura do Asaas aparece: guarda, para os próximos eventos acharem direto
  if (a && subId && !a.provedor_assinatura_id) {
    await repo.atualizarAssinatura(a.id, { provedor_assinatura_id: subId });
    a = { ...a, provedor_assinatura_id: subId };
  }
  return a;
}

const maior = (a: string | null, b: Date): string => (a && new Date(a) > b ? a : b.toISOString());

async function processar(repo: Repositorio, ev: EventoAsaas, agora: Date): Promise<string | null> {
  const a = await acharAssinatura(repo, ev);
  const t = ev.tipo;

  if (t.startsWith('PAYMENT_')) {
    const st = statusDoPagamento(t);
    if (!ev.pagamento || !st) return null;   // evento de cobrança que não muda nada no Bobby (ex.: PAYMENT_BANK_SLIP_VIEWED)
    if (!a) return 'sem_assinatura';
    const p = ev.pagamento;
    // o estado da cobrança só avança (_shared/pagamento.ts): evento atrasado não desfaz pagamento nem estorno
    const gravado = mesclarPagamento(await repo.buscarPagamento(p.id), {
      provedor_pagamento_id: p.id, assinatura_id: a.id, responsavel_id: a.responsavel_id, provedor: 'asaas',
      valor_centavos: p.valorCentavos, metodo: p.metodo, status: st, vencimento: p.vencimento,
      pago_em: st === 'confirmado' || st === 'recebido' ? (p.pagoEm ?? agora.toISOString().slice(0, 10)) : null,
    });
    await repo.salvarPagamento(gravado);
    // evento vencido pela regra acima (ex.: OVERDUE depois de CONFIRMED da mesma cobrança): só registra, não mexe na assinatura
    if (gravado.status !== st) return null;
    if (t === 'PAYMENT_CONFIRMED' || t === 'PAYMENT_RECEIVED') {
      if (a.status === 'reembolsada' || a.status === 'expirada') return null;   // pagamento tardio de assinatura encerrada: só registra
      const ate = acessoAteDe(p.vencimento ?? agora.toISOString().slice(0, 10), a.plano);
      await repo.atualizarAssinatura(a.id, {
        status: a.status === 'cancelada' ? 'cancelada' : 'ativa',
        inicio_em: a.inicio_em ?? agora.toISOString(),
        acesso_ate: maior(a.acesso_ate, ate),
      });
    } else if (t === 'PAYMENT_OVERDUE') {
      if (a.status === 'ativa') await repo.atualizarAssinatura(a.id, { status: 'atrasada' });   // acesso_ate não muda
    } else if (t === 'PAYMENT_REFUNDED' || t === 'PAYMENT_CHARGEBACK_REQUESTED') {
      await repo.atualizarAssinatura(a.id, { status: 'reembolsada', acesso_ate: agora.toISOString(), cancelada_em: a.cancelada_em ?? agora.toISOString() });
    }
    return null;
  }

  if (t === 'SUBSCRIPTION_DELETED' || t === 'SUBSCRIPTION_INACTIVATED') {
    if (a && (a.status === 'ativa' || a.status === 'atrasada')) {
      await repo.atualizarAssinatura(a.id, { status: 'cancelada', cancelada_em: a.cancelada_em ?? agora.toISOString() });
    } else if (a && a.status === 'pendente') {
      await repo.atualizarAssinatura(a.id, { status: 'expirada' });
    }
    return null;
  }

  if (t === 'CHECKOUT_EXPIRED' || t === 'CHECKOUT_CANCELED') {
    if (a && a.status === 'pendente' && !a.provedor_assinatura_id) await repo.atualizarAssinatura(a.id, { status: 'expirada' });
    return null;
  }

  // SUBSCRIPTION_CREATED, CHECKOUT_PAID e o resto: acharAssinatura já ligou o que dava para ligar
  return null;
}

export function criarHandler(deps: DepsWebhook) {
  const agora = deps.agora ?? (() => new Date());
  return async (req: Request): Promise<Response> => {
    if (req.method !== 'POST') return json(405, { erro: 'POST' });

    // 1. token antes de tudo. Token mal configurado (vazio ou curto) recusa tudo: falha fechada.
    const tokenOk = deps.token.length >= 32 && await tokensIguais(req.headers.get('asaas-access-token'), deps.token);
    if (!tokenOk) {
      await req.body?.cancel();
      registrar({ funcao: 'webhook-pagamento', http: 401, codigo: deps.token.length >= 32 ? 'token' : 'token_mal_configurado' }, deps.log);
      return json(401, { erro: 'não autorizado' });
    }

    // 2. payload
    const ev = lerEvento(await lerJson(req, 256 * 1024));
    if (!ev) return json(400, { erro: 'payload inválido' });

    // 3. idempotência
    try {
      const estado = await deps.repo.registrarEvento(ev.id, ev.tipo);
      if (estado === 'ja_processado') {
        registrar({ funcao: 'webhook-pagamento', http: 200, evento_id: ev.id, tipo: ev.tipo, status: 'repetido' }, deps.log);
        return json(200, { ok: true, repetido: true });
      }
    } catch {
      registrar({ funcao: 'webhook-pagamento', http: 500, evento_id: ev.id, codigo: 'banco' }, deps.log);
      return json(500, { erro: 'tente de novo' });
    }

    // 4. processa. Erro de banco: 500 para o Asaas repetir (o evento fica sem processado_em).
    try {
      const aviso = await processar(deps.repo, ev, agora());
      await deps.repo.concluirEvento(ev.id, aviso);
      registrar({ funcao: 'webhook-pagamento', http: 200, evento_id: ev.id, tipo: ev.tipo, codigo: aviso ?? undefined }, deps.log);
      // sem_assinatura responde 200: repetir não ajuda e 15 falhas seguidas pausam a fila do Asaas (doc acima)
      return json(200, { ok: true });
    } catch {
      try { await deps.repo.concluirEvento(ev.id, 'falha'); } catch { /* o 500 abaixo já faz o Asaas repetir */ }
      registrar({ funcao: 'webhook-pagamento', http: 500, evento_id: ev.id, tipo: ev.tipo, codigo: 'falha' }, deps.log);
      return json(500, { erro: 'tente de novo' });
    }
  };
}

if (import.meta.main) {
  const amb = lerAmbiente();
  Deno.serve(criarHandler({ token: amb.asaasWebhookToken, repo: new RepositorioPostgrest(amb.supabaseUrl, amb.supabaseServiceRoleKey) }));
}
