// =============================================================================
// cancelar-assinatura · cancelar em um toque, sem oferta de retenção
// (ARQUITETURA.md 6.6; Decreto 12.880 art. 10 I). O acesso continua até acesso_ate.
// Entrada: POST com JWT; corpo {motivo?} (até 200 caracteres, opcional).
// Saída:   200 {acesso_ate} · 401 sem sessão · 404 sem assinatura · 429 limite.
// =============================================================================

import { lerAmbiente } from '../_shared/config.ts';
import { json, lerJson, registrar } from '../_shared/http.ts';
import { dentroDoLimite } from '../_shared/limite.ts';
import { ProvedorAsaas } from '../_shared/provedor-asaas.ts';
import { RepositorioPostgrest } from '../_shared/repositorio.ts';
import { type Deps, rotaComSessao } from '../_shared/rota.ts';

export function criarHandler(deps: Deps) {
  const agora = deps.agora ?? (() => new Date());
  return rotaComSessao('cancelar-assinatura', deps, async (uid, req, cors) => {
    if (!(await dentroDoLimite(deps.repo, 'cancelar', uid))) return json(429, { erro: 'Muitos pedidos hoje. Tente de novo amanhã.' }, cors);

    const a = await deps.repo.assinaturaDoResponsavel(uid);
    if (!a) return json(404, { erro: 'Não há assinatura para cancelar.' }, cors);
    if (a.status === 'cancelada') return json(200, { acesso_ate: a.acesso_ate }, cors);   // repetir o toque não faz mal

    const corpo = await lerJson(req, 2048) as { motivo?: unknown } | null;
    const motivo = typeof corpo?.motivo === 'string' ? corpo.motivo.trim().slice(0, 200) || null : null;

    if (a.provedor_assinatura_id) await deps.provedor.cancelarAssinatura(a.provedor_assinatura_id);
    const agoraIso = agora().toISOString();
    if (a.status === 'pendente') {
      await deps.repo.atualizarAssinatura(a.id, { status: 'expirada', cancelada_em: agoraIso, motivo_cancelamento: motivo });
    } else {
      await deps.repo.atualizarAssinatura(a.id, { status: 'cancelada', cancelada_em: agoraIso, motivo_cancelamento: motivo });
    }
    registrar({ funcao: 'cancelar-assinatura', http: 200, assinatura_id: a.id }, deps.log);   // o motivo nunca vai para o log
    return json(200, { acesso_ate: a.status === 'pendente' ? null : a.acesso_ate }, cors);
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
