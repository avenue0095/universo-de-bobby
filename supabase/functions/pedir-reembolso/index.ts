// =============================================================================
// pedir-reembolso · arrependimento em 7 dias (CDC art. 49; prazo e texto com o
// advogado). Estorna no Asaas o que foi pago, cancela a recorrência e corta o
// acesso na hora (ARQUITETURA.md 6.6).
// Entrada: POST com JWT.
// Saída:   200 {status:'reembolsada'} · 401 · 404 sem assinatura paga · 403 fora do prazo · 429.
// =============================================================================

import { DIAS_REEMBOLSO, lerAmbiente } from '../_shared/config.ts';
import { json, registrar } from '../_shared/http.ts';
import { dentroDoLimite } from '../_shared/limite.ts';
import { ProvedorAsaas } from '../_shared/provedor-asaas.ts';
import { RepositorioPostgrest } from '../_shared/repositorio.ts';
import { type Deps, rotaComSessao } from '../_shared/rota.ts';

export function criarHandler(deps: Deps) {
  const agora = deps.agora ?? (() => new Date());
  return rotaComSessao('pedir-reembolso', deps, async (uid, _req, cors) => {
    if (!(await dentroDoLimite(deps.repo, 'reembolso', uid))) return json(429, { erro: 'Muitos pedidos hoje. Tente de novo amanhã.' }, cors);

    const a = await deps.repo.assinaturaDoResponsavel(uid);
    if (!a || !a.inicio_em || a.status === 'pendente') return json(404, { erro: 'Não há pagamento para reembolsar.' }, cors);
    const dias = (agora().getTime() - new Date(a.inicio_em).getTime()) / 86400000;
    if (dias > DIAS_REEMBOLSO) return json(403, { erro: 'O prazo de ' + DIAS_REEMBOLSO + ' dias para pedir reembolso já passou.' }, cors);

    const pagos = (await deps.repo.pagamentosDaAssinatura(a.id)).filter((p) => p.status === 'confirmado' || p.status === 'recebido');
    if (!pagos.length) return json(404, { erro: 'Não há pagamento para reembolsar.' }, cors);
    for (const p of pagos) {
      await deps.provedor.estornarPagamento(p.provedor_pagamento_id);
      await deps.repo.salvarPagamento({ ...p, status: 'estornado' });
    }
    if (a.provedor_assinatura_id && a.status !== 'cancelada') await deps.provedor.cancelarAssinatura(a.provedor_assinatura_id);

    const agoraIso = agora().toISOString();
    await deps.repo.atualizarAssinatura(a.id, { status: 'reembolsada', acesso_ate: agoraIso, cancelada_em: a.cancelada_em ?? agoraIso });
    registrar({ funcao: 'pedir-reembolso', http: 200, assinatura_id: a.id }, deps.log);
    return json(200, { status: 'reembolsada' }, cors);
  });
}

if (import.meta.main) {
  const amb = lerAmbiente();
  Deno.serve(criarHandler({
    amb,
    repo: new RepositorioPostgrest(amb.supabaseUrl, amb.supabaseServiceRoleKey),
    provedor: new ProvedorAsaas(amb.asaasApiKey, amb.asaasAmbiente),
  }));
}
