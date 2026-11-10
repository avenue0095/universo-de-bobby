-- =============================================================================
-- O Universo de Bobby · Fase 4 · 0008_reabrir_assinatura_atomica.sql
-- Reabrir assinatura 'expirada' que foi paga, numa transação só.
--
-- Por que existe (terceira passada da Fase 4, revisor): o webhook reabria em duas
-- gravações pelo PostgREST (expira o checkout pendente novo, depois ativa o velho).
-- Com dois avisos ao mesmo tempo da mesma família, a leitura de "quem está valendo"
-- e as gravações se cruzavam: o pendente podia ser ativado por um aviso no meio e
-- depois expirado pelo outro (família paga sem acesso), ou as duas ficavam vivas e
-- batiam no índice assinatura_vigente_unica (0001).
--
-- A regra é a mesma do webhook (supabase/functions/webhook-pagamento/index.ts):
--   * só reabre quem ainda está 'expirada' e nunca teve acesso (inicio_em vazio);
--   * a assinatura mais recente da família entre pendente, ativa, atrasada e
--     cancelada é a "atual"; se ela for outra e estiver valendo (ativa, atrasada, ou
--     cancelada com acesso_ate no futuro), as duas foram pagas: não reabre e devolve
--     'pagamento_duplicado' (o evento fica marcado para estorno);
--   * se a atual for um checkout 'pendente', ele expira ANTES de a paga voltar.
-- Trava: todas as linhas de assinatura da família, em ordem de id (dois avisos da
-- mesma família esperam um pelo outro; ordem fixa = sem deadlock).
--
-- Resposta: 'reaberta' | 'mudou' (não está mais expirada: outro aviso já tratou; o
-- webhook relê e segue o caminho normal) | 'expirada_ja_usada' | 'pagamento_duplicado'
-- | 'sem_assinatura'.
--
-- Acesso: SECURITY DEFINER (dono postgres), search_path vazio, nomes qualificados.
-- Ninguém além do servidor chama: execute só para service_role (a Edge Function).
-- Como rodar: depois de 0001 a 0007. Prova no banco: supabase/testes/rls.sql bloco 19.
-- =============================================================================

create or replace function public.reabrir_assinatura_paga(
  p_assinatura uuid,
  p_acesso_ate timestamptz,
  p_agora      timestamptz default now()
)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_resp  uuid;
  v_a     public.assinatura%rowtype;
  v_atual public.assinatura%rowtype;
begin
  select a.responsavel_id into v_resp from public.assinatura a where a.id = p_assinatura;
  if not found then return 'sem_assinatura'; end if;

  -- trava a família inteira (ordem fixa) e só então lê o que vale
  perform 1 from public.assinatura a where a.responsavel_id = v_resp order by a.id for update;
  select * into v_a from public.assinatura a where a.id = p_assinatura;

  if v_a.status <> 'expirada' then return 'mudou'; end if;
  if v_a.inicio_em is not null then return 'expirada_ja_usada'; end if;

  select * into v_atual from public.assinatura a
   where a.responsavel_id = v_resp and a.status in ('pendente','ativa','atrasada','cancelada')
   order by a.criado_em desc, a.id desc
   limit 1;
  if found and v_atual.id <> v_a.id then
    if v_atual.status in ('ativa','atrasada')
       or (v_atual.status = 'cancelada' and v_atual.acesso_ate is not null and v_atual.acesso_ate > p_agora) then
      return 'pagamento_duplicado';
    end if;
    if v_atual.status = 'pendente' then
      update public.assinatura set status = 'expirada' where id = v_atual.id;
    end if;
  end if;

  update public.assinatura set
    status     = 'ativa',
    inicio_em  = p_agora,
    acesso_ate = greatest(coalesce(acesso_ate, p_acesso_ate), p_acesso_ate)
  where id = v_a.id;
  return 'reaberta';
end;
$$;
alter function public.reabrir_assinatura_paga(uuid, timestamptz, timestamptz) owner to postgres;
revoke all on function public.reabrir_assinatura_paga(uuid, timestamptz, timestamptz) from public, anon, authenticated;
grant execute on function public.reabrir_assinatura_paga(uuid, timestamptz, timestamptz) to service_role;
comment on function public.reabrir_assinatura_paga(uuid, timestamptz, timestamptz) is
  'Webhook: reabre assinatura expirada que foi paga, numa transação, com a família travada (0008). Só service_role.';
