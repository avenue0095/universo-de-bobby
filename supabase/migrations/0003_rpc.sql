-- =============================================================================
-- O Universo de Bobby · Fase 4 · 0003_rpc.sql
-- Funções chamadas pelo app (PostgREST /rpc). Todas rodam como SECURITY INVOKER,
-- ou seja, sob a RLS do usuário logado, salvo onde está escrito o contrário.
--
--   acesso_liberado()                 -> a assinatura da família libera o app?
--   snapshot_perfil(perfil)           -> baixar o estado inteiro de um perfil
--   sincronizar_perfil(...)           -> subir o estado local e receber o merge
--   exportar_meus_dados()             -> LGPD art. 18 (portabilidade / acesso)
--   pedir_exclusao()                  -> LGPD art. 18 VI (a Edge Function conclui)
--
-- Regra de merge (ARQUITETURA.md, seção 5): "maior progresso vence".
--   * xp, moedas_ganhas, moedas_gastas, acertos_total, melhor_combo, estrelas,
--     contadores: GREATEST. O saldo de moedas é ganhas - gastas: gastar sobe
--     "gastas", então nenhum sync devolve moeda gasta nem apaga moeda ganha.
--   * comprado: união (item comprado nunca some).
--   * blocos jsonb (look, config, ofensiva, colecao, desenhos, revisao_meta,
--     prefs, materia): vence o carimbo mais novo DO BLOCO (blocos_em).
--   * itens de revisão: vence o carimbo mais novo DO ITEM.
--   Conflito NUNCA reduz estrelas, moedas ou itens.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Cria a linha de perfil_estado junto com o perfil
-- -----------------------------------------------------------------------------
create or replace function public.criar_estado_do_perfil()
returns trigger
language plpgsql
as $$
begin
  insert into public.perfil_estado (perfil_id) values (new.id)
  on conflict (perfil_id) do nothing;
  return new;
end;
$$;

drop trigger if exists trg_perfil_cria_estado on public.perfil;
create trigger trg_perfil_cria_estado
  after insert on public.perfil
  for each row execute function public.criar_estado_do_perfil();

-- =============================================================================
-- acesso_liberado()
-- Lê a assinatura vigente da família. O app guarda o resultado em cache local
-- com a data acesso_ate e usa esse cache offline (ARQUITETURA.md 6.4).
-- =============================================================================
create or replace function public.acesso_liberado()
returns jsonb
language sql
stable
security invoker
set search_path = public
as $$
  select coalesce(
    (
      select jsonb_build_object(
        'liberado',   (a.acesso_ate is not null and a.acesso_ate > now()),
        'status',     a.status,
        'plano',      a.plano,
        'acesso_ate', a.acesso_ate,
        'max_perfis', a.max_perfis
      )
      from public.assinatura a
      where a.responsavel_id = (select auth.uid())
      order by (a.acesso_ate is not null and a.acesso_ate > now()) desc, a.acesso_ate desc nulls last
      limit 1
    ),
    jsonb_build_object('liberado', false, 'status', 'sem_assinatura', 'plano', null, 'acesso_ate', null, 'max_perfis', 4)
  );
$$;
revoke all on function public.acesso_liberado() from public, anon;
grant execute on function public.acesso_liberado() to authenticated;

-- =============================================================================
-- snapshot_perfil(perfil) · tudo de um perfil, no formato que o app consome
-- =============================================================================
create or replace function public.snapshot_perfil(p_perfil uuid)
returns jsonb
language sql
stable
security invoker
set search_path = public
as $$
  select jsonb_build_object(
    'perfil', (
      select to_jsonb(p) - 'responsavel_id'
        from public.perfil p where p.id = p_perfil
    ),
    'estado', (
      select to_jsonb(e) from public.perfil_estado e where e.perfil_id = p_perfil
    ),
    'fases', coalesce((
      select jsonb_agg(to_jsonb(f) - 'perfil_id' order by f.fase_id)
        from public.progresso_fase f where f.perfil_id = p_perfil
    ), '[]'::jsonb),
    'itens', coalesce((
      select jsonb_agg(to_jsonb(i) - 'perfil_id' order by i.chave)
        from public.erro_pendente i where i.perfil_id = p_perfil
    ), '[]'::jsonb),
    'dias', coalesce((
      select jsonb_agg(to_jsonb(d) - 'perfil_id' order by d.dia)
        from public.dia_atividade d where d.perfil_id = p_perfil
    ), '[]'::jsonb),
    'baixado_em', now()
  );
$$;
revoke all on function public.snapshot_perfil(uuid) from public, anon;
grant execute on function public.snapshot_perfil(uuid) to authenticated;

-- =============================================================================
-- sincronizar_perfil(...)
--   p_estado : objeto com xp, moedas_ganhas, moedas_gastas, acertos_total, melhor_combo, comprado,
--              materia, look, config, ofensiva, colecao, desenhos, revisao_meta,
--              prefs, blocos_em, versao_app
--   p_fases  : [{fase_id, materia, estrelas, acertos, erros, tempo_seg, concluida_em}]
--   p_itens  : [{chave, materia, caixa, proxima, vezes, acertos, lapsos, ultimo,
--                pergunta, removido, carimbo}]
--   p_dias   : [{dia, blocos, perguntas, acertos, revisoes, segundos}]
-- Devolve o snapshot já mesclado, que o app grava por cima do localStorage.
-- =============================================================================
create or replace function public.sincronizar_perfil(
  p_perfil uuid,
  p_estado jsonb,
  p_fases  jsonb default '[]'::jsonb,
  p_itens  jsonb default '[]'::jsonb,
  p_dias   jsonb default '[]'::jsonb
)
returns jsonb
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_est      public.perfil_estado%rowtype;
  v_blocos   text[] := array['look','config','ofensiva','colecao','desenhos','revisao_meta','prefs'];
  v_k        text;
  v_novo_em  timestamptz;
  v_velho_em timestamptz;
  v_look     jsonb; v_config jsonb; v_ofensiva jsonb; v_colecao jsonb;
  v_desenhos jsonb; v_revmeta jsonb; v_prefs jsonb; v_em jsonb; v_materia text;
  v_comprado jsonb;
begin
  -- 1. dono e limite de chamadas
  if not public.perfil_e_meu(p_perfil) then
    raise exception 'perfil não pertence a esta conta' using errcode = '42501';
  end if;
  if not public.limite_ok_usuario('sync') then
    raise exception 'muitas sincronizações em pouco tempo; tente mais tarde' using errcode = 'P0001';
  end if;

  -- 2. tetos de tamanho (defesa contra payload absurdo)
  if jsonb_typeof(p_estado) <> 'object' then raise exception 'p_estado deve ser objeto'; end if;
  if jsonb_array_length(coalesce(p_fases,'[]'::jsonb)) > 2000 then raise exception 'p_fases grande demais'; end if;
  if jsonb_array_length(coalesce(p_itens,'[]'::jsonb)) > 4000 then raise exception 'p_itens grande demais'; end if;
  if jsonb_array_length(coalesce(p_dias ,'[]'::jsonb)) > 800  then raise exception 'p_dias grande demais';  end if;

  -- 3. estado leve
  select * into v_est from public.perfil_estado where perfil_id = p_perfil for update;
  if not found then
    insert into public.perfil_estado (perfil_id) values (p_perfil);
    select * into v_est from public.perfil_estado where perfil_id = p_perfil for update;
  end if;

  -- 3a. blocos: o carimbo mais novo vence, bloco a bloco
  v_look := v_est.look; v_config := v_est.config; v_ofensiva := v_est.ofensiva; v_colecao := v_est.colecao;
  v_desenhos := v_est.desenhos; v_revmeta := v_est.revisao_meta; v_prefs := v_est.prefs; v_em := v_est.blocos_em;
  v_materia := v_est.materia;

  foreach v_k in array v_blocos || array['materia'] loop
    v_novo_em  := nullif(p_estado->'blocos_em'->>v_k, '')::timestamptz;
    v_velho_em := nullif(v_est.blocos_em->>v_k, '')::timestamptz;
    if v_novo_em is not null and (v_velho_em is null or v_novo_em > v_velho_em) and p_estado ? v_k then
      case v_k
        when 'look'         then v_look     := p_estado->'look';
        when 'config'       then v_config   := p_estado->'config';
        when 'ofensiva'     then v_ofensiva := p_estado->'ofensiva';
        when 'colecao'      then v_colecao  := p_estado->'colecao';
        when 'desenhos'     then v_desenhos := p_estado->'desenhos';
        when 'revisao_meta' then v_revmeta  := p_estado->'revisao_meta';
        when 'prefs'        then v_prefs    := p_estado->'prefs';
        when 'materia'      then v_materia  := case when p_estado->>'materia' in ('mat','pt','en') then p_estado->>'materia' else v_materia end;
      end case;
      v_em := v_em || jsonb_build_object(v_k, v_novo_em);
    end if;
  end loop;

  -- 3b. comprado: união, sem repetir
  select coalesce(jsonb_agg(distinct x), '[]'::jsonb) into v_comprado
    from (
      select jsonb_array_elements(coalesce(v_est.comprado,'[]'::jsonb)) x
      union
      select jsonb_array_elements(case when jsonb_typeof(p_estado->'comprado') = 'array' then p_estado->'comprado' else '[]'::jsonb end)
    ) s
   where jsonb_typeof(x) = 'string';

  update public.perfil_estado set
    xp            = greatest(v_est.xp,            coalesce((p_estado->>'xp')::int, 0)),
    moedas_ganhas = greatest(v_est.moedas_ganhas, coalesce((p_estado->>'moedas_ganhas')::int, 0)),
    moedas_gastas = greatest(v_est.moedas_gastas, coalesce((p_estado->>'moedas_gastas')::int, 0)),
    acertos_total = greatest(v_est.acertos_total, coalesce((p_estado->>'acertos_total')::int, 0)),
    melhor_combo  = greatest(v_est.melhor_combo,  coalesce((p_estado->>'melhor_combo')::int, 0)),
    comprado      = v_comprado,
    materia       = v_materia,
    look          = coalesce(v_look, '{}'::jsonb),
    config        = coalesce(v_config, '{}'::jsonb),
    ofensiva      = coalesce(v_ofensiva, '{}'::jsonb),
    colecao       = coalesce(v_colecao, '{}'::jsonb),
    desenhos      = coalesce(v_desenhos, '{}'::jsonb),
    revisao_meta  = coalesce(v_revmeta, '{}'::jsonb),
    prefs         = coalesce(v_prefs, '{}'::jsonb),
    blocos_em     = v_em,
    versao_app    = coalesce(left(p_estado->>'versao_app', 40), v_est.versao_app)
  where perfil_id = p_perfil;

  -- 4. fases: só cresce
  insert into public.progresso_fase (perfil_id, fase_id, materia, estrelas, acertos, erros, tempo_seg, concluida_em)
  select p_perfil, f.fase_id, f.materia,
         least(greatest(coalesce(f.estrelas,0),0),3),
         greatest(coalesce(f.acertos,0),0), greatest(coalesce(f.erros,0),0), greatest(coalesce(f.tempo_seg,0),0),
         f.concluida_em
    from jsonb_to_recordset(coalesce(p_fases,'[]'::jsonb))
         as f(fase_id text, materia text, estrelas int, acertos int, erros int, tempo_seg int, concluida_em timestamptz)
   where f.fase_id ~ '^[a-z0-9._-]{1,24}$' and f.materia in ('mat','pt','en')
  on conflict (perfil_id, fase_id) do update set
    estrelas     = greatest(public.progresso_fase.estrelas, excluded.estrelas),
    acertos      = greatest(public.progresso_fase.acertos,  excluded.acertos),
    erros        = greatest(public.progresso_fase.erros,    excluded.erros),
    tempo_seg    = greatest(public.progresso_fase.tempo_seg, excluded.tempo_seg),
    concluida_em = least(public.progresso_fase.concluida_em, excluded.concluida_em);

  -- 5. itens de revisão: carimbo do aparelho mais novo vence
  insert into public.erro_pendente (perfil_id, chave, materia, caixa, proxima, vezes, acertos, lapsos, ultimo, pergunta, removido, carimbo)
  select p_perfil, i.chave, i.materia,
         least(greatest(coalesce(i.caixa,1),1),5), i.proxima,
         greatest(coalesce(i.vezes,0),0), greatest(coalesce(i.acertos,0),0), greatest(coalesce(i.lapsos,0),0),
         i.ultimo,
         case when i.chave like 'er:%' then i.pergunta else null end,
         coalesce(i.removido,false), coalesce(i.carimbo, now())
    from jsonb_to_recordset(coalesce(p_itens,'[]'::jsonb))
         as i(chave text, materia text, caixa int, proxima date, vezes int, acertos int, lapsos int, ultimo date,
              pergunta jsonb, removido boolean, carimbo timestamptz)
   where i.chave ~ '^[a-zA-Z0-9:._|-]{1,80}$' and i.materia in ('mat','pt','en')
  on conflict (perfil_id, chave) do update set
    materia  = excluded.materia,
    caixa    = excluded.caixa,
    proxima  = excluded.proxima,
    vezes    = greatest(public.erro_pendente.vezes, excluded.vezes),
    acertos  = greatest(public.erro_pendente.acertos, excluded.acertos),
    lapsos   = greatest(public.erro_pendente.lapsos, excluded.lapsos),
    ultimo   = excluded.ultimo,
    pergunta = coalesce(excluded.pergunta, public.erro_pendente.pergunta),
    removido = excluded.removido,
    carimbo  = excluded.carimbo
  where excluded.carimbo > public.erro_pendente.carimbo;

  -- 6. dias: só cresce, campo a campo
  insert into public.dia_atividade (perfil_id, dia, blocos, perguntas, acertos, revisoes, segundos)
  select p_perfil, d.dia,
         greatest(coalesce(d.blocos,0),0), greatest(coalesce(d.perguntas,0),0), greatest(coalesce(d.acertos,0),0),
         greatest(coalesce(d.revisoes,0),0), least(greatest(coalesce(d.segundos,0),0), 86400)
    from jsonb_to_recordset(coalesce(p_dias,'[]'::jsonb))
         as d(dia date, blocos int, perguntas int, acertos int, revisoes int, segundos int)
   where d.dia is not null
  on conflict (perfil_id, dia) do update set
    blocos    = greatest(public.dia_atividade.blocos,    excluded.blocos),
    perguntas = greatest(public.dia_atividade.perguntas, excluded.perguntas),
    acertos   = greatest(public.dia_atividade.acertos,   excluded.acertos),
    revisoes  = greatest(public.dia_atividade.revisoes,  excluded.revisoes),
    segundos  = greatest(public.dia_atividade.segundos,  excluded.segundos);

  -- 7. devolve o merge
  return public.snapshot_perfil(p_perfil);
end;
$$;
revoke all on function public.sincronizar_perfil(uuid, jsonb, jsonb, jsonb, jsonb) from public, anon;
grant execute on function public.sincronizar_perfil(uuid, jsonb, jsonb, jsonb, jsonb) to authenticated;

-- =============================================================================
-- exportar_meus_dados() · LGPD art. 18 II e V (acesso e portabilidade)
-- Tudo que a conta tem, em JSON. Limite: 5 exportações por dia.
-- =============================================================================
create or replace function public.exportar_meus_dados()
returns jsonb
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_uid uuid := (select auth.uid());
begin
  if v_uid is null then raise exception 'sem sessão' using errcode = '42501'; end if;
  if not public.limite_ok_usuario('export') then
    raise exception 'limite de exportações do dia atingido' using errcode = 'P0001';
  end if;

  return jsonb_build_object(
    'app', 'universo-de-bobby',
    'formato', 'exportacao-lgpd-v1',
    'gerado_em', now(),
    'responsavel', jsonb_build_object(
      'id', v_uid,
      'email', (select auth.jwt() ->> 'email'),
      'relatorio_email', (select r.relatorio_email from public.responsavel r where r.id = v_uid),
      'criado_em', (select r.criado_em from public.responsavel r where r.id = v_uid)
    ),
    'perfis', coalesce((
      select jsonb_agg(public.snapshot_perfil(p.id) order by p.criado_em)
        from public.perfil p where p.responsavel_id = v_uid
    ), '[]'::jsonb),
    'assinaturas', coalesce((
      select jsonb_agg(to_jsonb(a) - 'responsavel_id' order by a.criado_em)
        from public.assinatura a where a.responsavel_id = v_uid
    ), '[]'::jsonb),
    'pagamentos', coalesce((
      select jsonb_agg(to_jsonb(g) - 'responsavel_id' order by g.criado_em)
        from public.pagamento g where g.responsavel_id = v_uid
    ), '[]'::jsonb),
    'consentimentos', coalesce((
      select jsonb_agg(to_jsonb(c) - 'responsavel_id' - 'ip_hash' order by c.criado_em)
        from public.consentimento c where c.responsavel_id = v_uid
    ), '[]'::jsonb)
  );
end;
$$;
revoke all on function public.exportar_meus_dados() from public, anon;
grant execute on function public.exportar_meus_dados() to authenticated;

-- =============================================================================
-- pedir_exclusao() · marca o pedido. A Edge Function "apagar-conta" conclui:
-- cancela a assinatura no provedor, registra consentimento revogado e apaga
-- auth.users (cascade apaga responsavel, perfis e tudo abaixo; pagamento e
-- consentimento ficam com responsavel_id = null pelo prazo fiscal/legal).
-- =============================================================================
-- SECURITY DEFINER porque o usuário só tem grant de update em relatorio_email;
-- a função filtra por auth.uid(), então só marca a própria conta.
create or replace function public.pedir_exclusao()
returns timestamptz
language plpgsql
security definer
set search_path = public
as $$
declare
  v_quando timestamptz;
begin
  update public.responsavel
     set exclusao_pedida_em = coalesce(exclusao_pedida_em, now())
   where id = (select auth.uid())
  returning exclusao_pedida_em into v_quando;
  if v_quando is null then raise exception 'sem sessão' using errcode = '42501'; end if;
  return v_quando;
end;
$$;
revoke all on function public.pedir_exclusao() from public, anon;
grant execute on function public.pedir_exclusao() to authenticated;
