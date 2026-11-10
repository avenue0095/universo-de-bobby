// =============================================================================
// Estado de uma cobrança só avança. O Asaas pode entregar eventos fora de ordem
// (repetição depois de falha, fila retomada), então o evento mais recente a
// chegar NÃO é necessariamente o mais novo. Regra:
//
//   pendente (e vencido, falhou)  <  confirmado  <  recebido      ;  estornado é terminal
//
// * PAYMENT_RECEIVED e depois PAYMENT_UPDATED atrasado: fica recebido, pago_em mantido.
// * PAYMENT_REFUNDED e depois PAYMENT_CONFIRMED atrasado: fica estornado.
// * Entre os estados "não pago" (pendente, vencido, falhou) o último evento vence:
//   PAYMENT_UPDATED depois de PAYMENT_OVERDUE (vencimento mudou) volta a pendente.
//
// A mesma regra está no banco (0005_pagamento_so_avanca.sql, gatilho
// pagamento_so_avanca), para valer também quando dois avisos chegam juntos.
// =============================================================================

import type { Pagamento, StatusPagamento } from './repositorio.ts';

const ORDEM: Record<StatusPagamento, number> = { pendente: 0, vencido: 0, falhou: 0, confirmado: 1, recebido: 2, estornado: 3 };

/** Nível do estado: 0 não pago, 1 confirmado, 2 recebido, 3 estornado (terminal). */
export const nivelDoPagamento = (s: StatusPagamento): number => ORDEM[s];

/**
 * Junta o que o banco tem com o que o evento traz. Devolve a linha a gravar.
 * Os campos descritivos (valor, vencimento, método) vêm do evento; status e pago_em só avançam.
 */
export function mesclarPagamento(antigo: Pagamento | null, novo: Pagamento): Pagamento {
  if (!antigo) return novo;
  const nA = ORDEM[antigo.status], nN = ORDEM[novo.status];
  if (nN < nA) {   // estornado tem o nível mais alto: nada passa dele (terminal)
    return { ...novo, status: antigo.status, pago_em: antigo.pago_em };
  }
  if (nN === 0) return { ...novo, pago_em: null };
  return { ...novo, pago_em: novo.pago_em ?? antigo.pago_em };
}
