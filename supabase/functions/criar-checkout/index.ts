// =============================================================================
// criar-checkout · o responsável escolhe Mensal ou Anual e recebe o link do
// Checkout do Asaas (ARQUITETURA.md 6.3, passo 5).
// Entrada: POST com JWT; corpo {plano: 'mensal' | 'anual'}.
// Saída:   200 {url} · 401 sem sessão · 403 sem os 3 aceites · 409 já assinante
//          · 429 depois de 10 pedidos no dia · 400 plano inválido.
// Nunca recebe dado de cartão, nome ou CPF: isso é digitado na página do Asaas.
// =============================================================================

import { CONSENTIMENTOS_OBRIGATORIOS, lerAmbiente, MAX_PERFIS, PLANOS, type Plano } from '../_shared/config.ts';
import { json, lerJson, registrar } from '../_shared/http.ts';
import { dentroDoLimite } from '../_shared/limite.ts';
import { ProvedorAsaas } from '../_shared/provedor-asaas.ts';
import { RepositorioPostgrest } from '../_shared/repositorio.ts';
import { type Deps, rotaComSessao } from '../_shared/rota.ts';

const NOME_ACEITE: Record<string, string> = { termos: 'termos de uso', privacidade: 'política de privacidade', parental: 'consentimento do responsável' };

export function criarHandler(deps: Deps) {
  const agora = deps.agora ?? (() => new Date());
  return rotaComSessao('criar-checkout', deps, async (uid, req, cors) => {
    if (!(await dentroDoLimite(deps.repo, 'checkout', uid))) {
      registrar({ funcao: 'criar-checkout', http: 429 }, deps.log);
      return json(429, { erro: 'Muitos pedidos hoje. Tente de novo amanhã.' }, cors);
    }

    const aceitos = await deps.repo.consentimentosAceitos(uid);
    const faltam = CONSENTIMENTOS_OBRIGATORIOS.filter((t) => !aceitos.has(t));
    if (faltam.length) {
      return json(403, { erro: 'Antes de assinar, aceite: ' + faltam.map((t) => NOME_ACEITE[t]).join(', ') + '.', faltam }, cors);
    }

    const corpo = await lerJson(req, 1024) as { plano?: unknown } | null;
    const plano = corpo?.plano;
    if (plano !== 'mensal' && plano !== 'anual') return json(400, { erro: 'Escolha o plano mensal ou o anual.' }, cors);

    const atual = await deps.repo.assinaturaDoResponsavel(uid);
    if (atual) {
      const vale = atual.acesso_ate !== null && new Date(atual.acesso_ate) > agora();
      if (atual.status === 'ativa' || atual.status === 'atrasada' || (atual.status === 'cancelada' && vale)) {
        return json(409, { erro: 'Esta conta já tem uma assinatura valendo.' }, cors);
      }
      // checkout anterior não pago: sai do caminho (o índice permite uma só assinatura viva por família)
      if (atual.status === 'pendente') await deps.repo.atualizarAssinatura(atual.id, { status: 'expirada' });
    }

    const nova = await deps.repo.inserirAssinatura({
      responsavel_id: uid, plano: plano as Plano, valor_centavos: PLANOS[plano as Plano].centavos, status: 'pendente', max_perfis: MAX_PERFIS,
    });
    try {
      const chk = await deps.provedor.criarCheckout(plano as Plano, nova.id, deps.amb.appUrl, agora());
      await deps.repo.atualizarAssinatura(nova.id, { provedor_checkout_id: chk.id });
      registrar({ funcao: 'criar-checkout', http: 200, assinatura_id: nova.id }, deps.log);
      return json(200, { url: chk.url }, cors);
    } catch (e) {
      await deps.repo.atualizarAssinatura(nova.id, { status: 'expirada' });
      registrar({ funcao: 'criar-checkout', http: 502, assinatura_id: nova.id, codigo: 'provedor' }, deps.log);
      if (e instanceof Error && e.message.startsWith('provedor')) {
        return json(502, { erro: 'O sistema de pagamento não respondeu. Tente de novo em alguns minutos.' }, cors);
      }
      throw e;
    }
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
