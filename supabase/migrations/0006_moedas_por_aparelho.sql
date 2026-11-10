-- O Universo de Bobby · Fase 4 · 0006_moedas_por_aparelho.sql
-- Moedas contadas por aparelho: ninguém perde moeda ganha (ARQUITETURA.md 5.5).
--
-- Por que existe: até a 0005, perfil_estado.moedas_ganhas e moedas_gastas eram
-- mescladas por GREATEST. Com dois aparelhos offline isso perde moeda: base 100,
-- o tablet A ganha 50 (manda 150), o celular B ganha 30 (manda 130), o banco
-- fica com 150 e os 30 de B somem. O mesmo vale para gastas (duas compras em
-- aparelhos diferentes: uma "sai de graça").
--
-- Agora cada aparelho tem o PRÓPRIO contador (o que ele mesmo ganhou e gastou),
-- que só cresce (GREATEST por aparelho), e o total é a SOMA dos aparelhos:
--   moedas_ganhas = soma(ganhas), moedas_gastas = soma(gastas), saldo = diferença.
-- Repetir o mesmo envio não soma de novo (é GREATEST no contador do aparelho).
--
-- aparelho_id: texto aleatório que o app sorteia uma vez por instalação
-- (outbox universo-bobby-sync-v1). Não identifica pessoa nem aparelho físico.
-- Chamada sem aparelho_id (cliente antigo, testes/rls.sql caso 13) conta no
-- aparelho 'legado', com a regra antiga (GREATEST), então nada quebra.
-- Os totais que já existiam viram a linha 'legado' de cada perfil.
--
-- Como rodar: depois de 0001 a 0005 (supabase db push). Prova no banco:
-- supabase/testes/rls.sql, blocos 13e e 13f (e a tabela entra na conta do bloco 1).
-- RLS: ligada, com política explícita (mesmo padrão de perfil_estado, via
-- perfil_e_meu); sem política de delete (a linha só some com o perfil, em cascata).
-- =============================================================================

create table public.moedas_aparelho (
  perfil_id     uuid    not null references public.perfil(id) on delete cascade,
  aparelho_id   text    not null check (aparelho_id ~ '^[A-Za-z0-9_-]{6,64}$'),
  ganhas        integer not null default 0 check (ganhas >= 0),
  gastas        integer not null default 0 check (gastas >= 0),
  atualizado_em timestamptz not null default now(),
  primary key (perfil_id, aparelho_id)
);
comment on table public.moedas_aparelho is
  'Razão de moedas de cada aparelho (só cresce). perfil_estado.moedas_ganhas/gastas = soma destas linhas. Ninguém perde moeda ganha.';

alter table public.moedas_aparelho enable row level security;

create policy moedas_aparelho_select on public.moedas_aparelho
  for select to authenticated using (public.perfil_e_meu(perfil_id));
create policy moedas_aparelho_insert on public.moedas_aparelho
  for insert to authenticated with check (public.perfil_e_meu(perfil_id));
create policy moedas_aparelho_update on public.moedas_aparelho
  for update to authenticated using (public.perfil_e_meu(perfil_id)) with check (public.perfil_e_meu(perfil_id));
-- sem política de delete: apagar uma linha baixaria o total; ela só sai com o perfil (on delete cascade)

revoke all on public.moedas_aparelho from anon;
revoke delete, truncate on public.moedas_aparelho from authenticated;
grant select, insert, update on public.moedas_aparelho to authenticated;

create trigger trg_moedas_aparelho_atualizado
  before update on public.moedas_aparelho
  for each row execute function public.set_atualizado_em();

-- o contador de um aparelho nunca desce, nem por update direto via PostgREST
create or replace function public.moedas_aparelho_so_cresce()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.ganhas := greatest(old.ganhas, new.ganhas);
  new.gastas := greatest(old.gastas, new.gastas);
  return new;
end;
$$;
create trigger trg_moedas_aparelho_so_cresce
  before update on public.moedas_aparelho
  for each row execute function public.moedas_aparelho_so_cresce();

-- o que já existia vira a linha 'legado' do perfil
insert into public.moedas_aparelho (perfil_id, aparelho_id, ganhas, gastas)
select perfil_id, 'legado', moedas_ganhas, moedas_gastas
  from public.perfil_estado
 where moedas_ganhas > 0 or moedas_gastas > 0
on conflict (perfil_id, aparelho_id) do nothing;

-- =============================================================================
-- snapshot_perfil: igual à 0003, com a lista 'moedas_aparelhos' (o app precisa
-- dela para somar os outros aparelhos sem contar o próprio duas vezes).
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
    'moedas_aparelhos', coalesce((
      select jsonb_agg(jsonb_build_object('aparelho_id', m.aparelho_id, 'ganhas', m.ganhas, 'gastas', m.gastas) order by m.aparelho_id)
        from public.moedas_aparelho m where m.perfil_id = p_perfil
    ), '[]'::jsonb),
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
-- sincronizar_perfil: igual à 0003, menos o passo das moedas:
--   p_estado.aparelho_id (opcional) + moedas_ganhas/moedas_gastas DESTE aparelho
--   -> GREATEST na linha do aparelho -> total = soma das linhas.
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
  v_aparelho text;
  v_ganhas   bigint; v_gastas bigint;
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

  -- 3c. moedas: contador DESTE aparelho (só cresce); o total é a soma dos aparelhos
  v_aparelho := case when coalesce(p_estado->>'aparelho_id','') ~ '^[A-Za-z0-9_-]{6,64}$' then p_estado->>'aparelho_id' else 'legado' end;
  if v_aparelho <> 'legado'
     and not exists (select 1 from public.moedas_aparelho where perfil_id = p_perfil and aparelho_id = v_aparelho)
     and (select count(*) from public.moedas_aparelho where perfil_id = p_perfil) >= 50 then
    raise exception 'aparelhos demais neste perfil' using errcode = 'P0001';
  end if;
  insert into public.moedas_aparelho (perfil_id, aparelho_id, ganhas, gastas)
  values (p_perfil, v_aparelho,
          greatest(coalesce((p_estado->>'moedas_ganhas')::int, 0), 0),
          greatest(coalesce((p_estado->>'moedas_gastas')::int, 0), 0))
  on conflict (perfil_id, aparelho_id) do update set
    ganhas = greatest(public.moedas_aparelho.ganhas, excluded.ganhas),
    gastas = greatest(public.moedas_aparelho.gastas, excluded.gastas);
  select coalesce(sum(ganhas), 0), coalesce(sum(gastas), 0) into v_ganhas, v_gastas
    from public.moedas_aparelho where perfil_id = p_perfil;

  update public.perfil_estado set
    xp            = greatest(v_est.xp,            coalesce((p_estado->>'xp')::int, 0)),
    moedas_ganhas = greatest(v_est.moedas_ganhas, least(v_ganhas, 2147483647)::int),
    moedas_gastas = greatest(v_est.moedas_gastas, least(v_gastas, 2147483647)::int),
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
