-- =============================================================================
-- O Universo de Bobby · Fase 4 · 0002_rls.sql
-- Row Level Security em TODAS as tabelas do schema public.
--
-- Regras da casa (skill seguranca-minima, item 4):
--   * Toda política leva "to authenticated" (ou service_role). Política sem "to"
--     vale para PUBLIC, inclusive anon.
--   * Nenhuma tabela com "using (true)".
--   * RLS se prova consultando o banco (supabase/testes/rls.sql), não por migração.
--
-- Quem escreve o quê:
--   responsável (authenticated): perfil, perfil_estado, progresso_fase,
--     erro_pendente, dia_atividade (só dos próprios perfis), responsavel (só a
--     própria linha, campos de preferência), consentimento (só inserir).
--   servidor (service_role, via Edge Function): assinatura, pagamento,
--     webhook_evento, limite_taxa. service_role ignora RLS por definição.
--   anon: nada (privilégios já revogados no 0001).
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Função de apoio: o perfil pertence ao usuário logado?
-- SECURITY DEFINER + STABLE para a política das tabelas filhas não refazer o
-- join sob RLS a cada linha (supabase-postgres-best-practices, security-rls-*).
-- -----------------------------------------------------------------------------
create or replace function public.perfil_e_meu(p_perfil uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
      from public.perfil p
     where p.id = p_perfil
       and p.responsavel_id = (select auth.uid())
  );
$$;
revoke all on function public.perfil_e_meu(uuid) from public, anon;
grant execute on function public.perfil_e_meu(uuid) to authenticated, service_role;

-- =============================================================================
-- Ligar RLS em tudo.
-- Sem FORCE de propósito: os gatilhos SECURITY DEFINER (criar responsavel ao
-- cadastrar, limite_ok) rodam como dono da tabela (postgres) e precisam passar.
-- O app nunca usa o papel postgres; ele só existe para migração e painel.
-- =============================================================================
alter table public.responsavel     enable row level security;
alter table public.perfil          enable row level security;
alter table public.perfil_estado   enable row level security;
alter table public.progresso_fase  enable row level security;
alter table public.erro_pendente   enable row level security;
alter table public.dia_atividade   enable row level security;
alter table public.assinatura      enable row level security;
alter table public.pagamento       enable row level security;
alter table public.consentimento   enable row level security;
alter table public.webhook_evento  enable row level security;
alter table public.limite_taxa     enable row level security;

-- =============================================================================
-- responsavel · só a própria linha. Insert vem do gatilho (security definer).
-- Delete não é permitido aqui: apagar conta passa pela Edge Function
-- (cancela no provedor, depois apaga auth.users, que cascateia).
-- =============================================================================
create policy responsavel_select_proprio on public.responsavel
  for select to authenticated
  using (id = (select auth.uid()));

create policy responsavel_update_proprio on public.responsavel
  for update to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

-- Das colunas, o responsável só altera o opt-in do relatório. exclusao_pedida_em
-- passa pela RPC pedir_exclusao() (security definer); criado_em ninguém altera.
revoke update on public.responsavel from authenticated;
grant  update (relatorio_email) on public.responsavel to authenticated;

-- =============================================================================
-- perfil · CRUD completo, só dos próprios
-- =============================================================================
create policy perfil_select_proprio on public.perfil
  for select to authenticated
  using (responsavel_id = (select auth.uid()));

create policy perfil_insert_proprio on public.perfil
  for insert to authenticated
  with check (responsavel_id = (select auth.uid()));

create policy perfil_update_proprio on public.perfil
  for update to authenticated
  using (responsavel_id = (select auth.uid()))
  with check (responsavel_id = (select auth.uid()));

create policy perfil_delete_proprio on public.perfil
  for delete to authenticated
  using (responsavel_id = (select auth.uid()));

-- =============================================================================
-- Tabelas filhas do perfil · mesmo padrão, via perfil_e_meu()
-- =============================================================================
-- perfil_estado
create policy perfil_estado_select on public.perfil_estado
  for select to authenticated using (public.perfil_e_meu(perfil_id));
create policy perfil_estado_insert on public.perfil_estado
  for insert to authenticated with check (public.perfil_e_meu(perfil_id));
create policy perfil_estado_update on public.perfil_estado
  for update to authenticated using (public.perfil_e_meu(perfil_id)) with check (public.perfil_e_meu(perfil_id));
create policy perfil_estado_delete on public.perfil_estado
  for delete to authenticated using (public.perfil_e_meu(perfil_id));

-- progresso_fase
create policy progresso_fase_select on public.progresso_fase
  for select to authenticated using (public.perfil_e_meu(perfil_id));
create policy progresso_fase_insert on public.progresso_fase
  for insert to authenticated with check (public.perfil_e_meu(perfil_id));
create policy progresso_fase_update on public.progresso_fase
  for update to authenticated using (public.perfil_e_meu(perfil_id)) with check (public.perfil_e_meu(perfil_id));
create policy progresso_fase_delete on public.progresso_fase
  for delete to authenticated using (public.perfil_e_meu(perfil_id));

-- erro_pendente
create policy erro_pendente_select on public.erro_pendente
  for select to authenticated using (public.perfil_e_meu(perfil_id));
create policy erro_pendente_insert on public.erro_pendente
  for insert to authenticated with check (public.perfil_e_meu(perfil_id));
create policy erro_pendente_update on public.erro_pendente
  for update to authenticated using (public.perfil_e_meu(perfil_id)) with check (public.perfil_e_meu(perfil_id));
create policy erro_pendente_delete on public.erro_pendente
  for delete to authenticated using (public.perfil_e_meu(perfil_id));

-- dia_atividade
create policy dia_atividade_select on public.dia_atividade
  for select to authenticated using (public.perfil_e_meu(perfil_id));
create policy dia_atividade_insert on public.dia_atividade
  for insert to authenticated with check (public.perfil_e_meu(perfil_id));
create policy dia_atividade_update on public.dia_atividade
  for update to authenticated using (public.perfil_e_meu(perfil_id)) with check (public.perfil_e_meu(perfil_id));
create policy dia_atividade_delete on public.dia_atividade
  for delete to authenticated using (public.perfil_e_meu(perfil_id));

-- =============================================================================
-- assinatura e pagamento · o responsável SÓ LÊ as próprias.
-- Não existe política de insert/update/delete para authenticated: negado.
-- Quem grava é a Edge Function com service_role (bypass de RLS), depois de
-- verificar a assinatura do webhook do provedor.
-- =============================================================================
create policy assinatura_select_propria on public.assinatura
  for select to authenticated
  using (responsavel_id = (select auth.uid()));

create policy pagamento_select_proprio on public.pagamento
  for select to authenticated
  using (responsavel_id = (select auth.uid()));

-- =============================================================================
-- consentimento · ler e INSERIR os próprios. Nunca editar nem apagar
-- (revogação é uma linha nova com aceito = false).
-- =============================================================================
create policy consentimento_select_proprio on public.consentimento
  for select to authenticated
  using (responsavel_id = (select auth.uid()));

create policy consentimento_insert_proprio on public.consentimento
  for insert to authenticated
  with check (responsavel_id = (select auth.uid()));

-- =============================================================================
-- webhook_evento e limite_taxa · nenhuma política para authenticated.
-- RLS ligada + nenhuma política = ninguém além de service_role entra.
-- (Os privilégios de tabela já foram revogados no 0001; isto é a segunda tranca.)
-- =============================================================================

-- =============================================================================
-- Conferência rápida (a prova de verdade está em supabase/testes/rls.sql):
--   select tablename, rowsecurity from pg_tables where schemaname = 'public';
--   select tablename, policyname, roles, cmd from pg_policies where schemaname = 'public' order by 1,2;
-- Toda linha de pg_tables deve ter rowsecurity = true.
-- Toda linha de pg_policies deve ter roles = {authenticated}. Nenhuma {public}.
-- =============================================================================
