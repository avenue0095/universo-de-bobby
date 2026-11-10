-- =============================================================================
-- O Universo de Bobby · Fase 4 · 0007_saldo_so_pela_rpc.sql
-- O saldo de moedas só muda pela RPC sincronizar_perfil, com teto por chamada.
--
-- O furo que isto fecha (terceira passada da Fase 4, revisor):
--   * 0006 deu insert/update em moedas_aparelho para authenticated (políticas
--     moedas_aparelho_insert e _update, só com perfil_e_meu). Com o JWT da família
--     dava para gravar ganhas = 2147483647 direto pelo PostgREST; o teto de 50
--     aparelhos só valia dentro da RPC.
--   * 0002 (perfil_estado_update) deixava gravar moedas_ganhas direto do mesmo jeito.
--     O gatilho so_cresce só impede DESCER, não SUBIR.
--
-- O que muda:
--   1. moedas_aparelho: authenticated só LÊ. Sem política de escrita, sem grant de
--      insert/update/delete. Quem grava é a RPC (security definer).
--   2. perfil_estado: o update da tabela inteira sai de authenticated e volta só nas
--      colunas que o app grava pelo critério "carimbo mais novo vence" (blocos):
--      materia, look, config, ofensiva, colecao, desenhos, revisao_meta, prefs,
--      blocos_em, versao_app. Ficam DE FORA: moedas_ganhas, moedas_gastas, xp,
--      acertos_total, melhor_combo, comprado, perfil_id, atualizado_em (este o gatilho
--      grava). O insert fica só na coluna perfil_id (o gatilho criar_estado_do_perfil
--      roda como quem cria o perfil e só grava perfil_id; os números nascem 0).
--      Conferido no código do app: src/interface/nuvem.js não grava perfil_estado
--      direto, tudo passa pela RPC; as colunas devolvidas são para o painel futuro.
--   3. sincronizar_perfil vira SECURITY DEFINER (dono postgres), search_path vazio,
--      todo nome qualificado, perfil_e_meu conferido dentro, e com TETO de incremento.
--
-- O teto (moedas_ganhas por chamada, por aparelho): 5000.
--   Regra de moedas do app (src/interface/economia.js, ECON; licao.js; ciclo.js):
--   resposta certa 10, +5 a cada 3 certas seguidas (sequência), +20 na fase perfeita
--   e +5 na revisão diária (os dois no fim da fase), baú até 20, kit de volta 15.
--   Por resposta certa isso dá no máximo cerca de 17 moedas (10 + 5/3 + 25 da fase
--   rateados por fases de 5 perguntas). 5000 = umas 300 respostas certas seguidas.
--   Online, o app sincroniza a cada 60 s (NUVEM_TEMPO.intervalo): em 60 s nenhuma
--   criança faz 300 acertos. A criança média (calibragem da economia) ganha ~180 por
--   DIA, então 5000 é mais de 25 dias de jogo normal numa chamada só.
--   Offline por muitos dias (ou a primeira subida de um perfil antigo), o aparelho
--   pode ter mais do que isso guardado: a RPC aceita 5000, registra, e o aparelho
--   continua com o contador dele (nuvem.js nunca baixa o próprio contador), então o
--   resto sobe nas chamadas seguintes. Nada se perde; só chega em parcelas.
--
-- Ultrapassou o teto: a RPC NÃO quebra. Limita o valor e grava uma linha em
-- moedas_limitadas (quem, qual aparelho, pedido, aceito, quando). Ninguém além do
-- servidor lê essa tabela.
--
-- O que continua sendo confiança no cliente (registrado em docs/fase4/ANDAMENTO.md 6):
-- abaixo do teto, o servidor não sabe se as moedas foram ganhas jogando. Um adulto
-- com o JWT consegue subir até 5000 por chamada, e o limite de 240 sincronizações por
-- hora da conta (limite_ok_usuario) segura isso em ~1,2 milhão por hora. O dano fica
-- dentro da própria família: moeda só compra cosmético do jogo, não vale dinheiro,
-- não é vendida e não há ranking entre famílias. Provar cada moeda exigiria o
-- servidor reproduzir a lição, o que não cabe num app offline.
--
-- Como rodar: depois de 0001 a 0006 (supabase db push). Prova no banco:
-- supabase/testes/rls.sql, blocos 3b, 13b, 13f e 13g, e a contagem do bloco 18.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. moedas_aparelho: authenticated só lê
-- -----------------------------------------------------------------------------
drop policy if exists moedas_aparelho_insert on public.moedas_aparelho;
drop policy if exists moedas_aparelho_update on public.moedas_aparelho;
revoke insert, update, delete, truncate on public.moedas_aparelho from authenticated;
grant select on public.moedas_aparelho to authenticated;
comment on table public.moedas_aparelho is
  'Razão de moedas de cada aparelho (só cresce). perfil_estado.moedas_ganhas/gastas = soma destas linhas. Só a RPC sincronizar_perfil grava (0007).';

-- -----------------------------------------------------------------------------
-- 2. perfil_estado: update só nas colunas de bloco; insert só de perfil_id
--    (revoke update(col) não tira o grant da tabela inteira: por isso revoga a
--    tabela e concede de volta coluna a coluna)
-- -----------------------------------------------------------------------------
revoke insert, update on public.perfil_estado from authenticated;
grant insert (perfil_id) on public.perfil_estado to authenticated;
grant update (materia, look, config, ofensiva, colecao, desenhos, revisao_meta, prefs, blocos_em, versao_app)
  on public.perfil_estado to authenticated;

-- -----------------------------------------------------------------------------
-- 3. Registro de teto atingido (só o servidor lê)
-- -----------------------------------------------------------------------------
create table public.moedas_limitadas (
  id          bigint generated always as identity primary key,
  perfil_id   uuid    not null references public.perfil(id) on delete cascade,
  aparelho_id text    not null,
  pedido      numeric not null,
  aceito      integer not null,
  em          timestamptz not null default now()
);
comment on table public.moedas_limitadas is
  'Chamadas de sincronizar_perfil em que moedas_ganhas subiu mais que o teto (0007). Só service_role lê. Sai junto com o perfil.';
create index moedas_limitadas_perfil_idx on public.moedas_limitadas (perfil_id, em desc);
alter table public.moedas_limitadas enable row level security;
-- RLS ligada e nenhuma política: só service_role (que ignora RLS) e o dono da RPC entram
revoke all on public.moedas_limitadas from anon, authenticated;

-- -----------------------------------------------------------------------------
-- 4. sincronizar_perfil: igual à 0006, agora SECURITY DEFINER e com teto
-- -----------------------------------------------------------------------------
create or replace function public.sincronizar_perfil(
  p_perfil uuid,
  p_estado jsonb,
  p_fases  jsonb default '[]'::jsonb,
  p_itens  jsonb default '[]'::jsonb,
  p_dias   jsonb default '[]'::jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  c_teto     constant integer := 5000;   -- teto de moedas_ganhas por chamada (justificativa no cabeçalho)
  c_int_max  constant bigint  := 2147483647;
  v_est      public.perfil_estado%rowtype;
  v_blocos   text[] := array['look','config','ofensiva','colecao','desenhos','revisao_meta','prefs'];
  v_k        text;
  v_novo_em  timestamptz;
  v_velho_em timestamptz;
  v_look     jsonb; v_config jsonb; v_ofensiva jsonb; v_colecao jsonb;
  v_desenhos jsonb; v_revmeta jsonb; v_prefs jsonb; v_em jsonb; v_materia text;
  v_comprado jsonb;
  v_aparelho text;
  v_tinha_g  bigint; v_tinha_s bigint;
  v_pedido_g numeric; v_pedido_s numeric;
  v_aceito_g bigint;  v_aceito_s bigint;
  v_ganhas   bigint; v_gastas bigint;
begin
  -- 1. dono e limite de chamadas (security definer: a conferência do dono é AQUI, não na RLS)
  if p_perfil is null or not public.perfil_e_meu(p_perfil) then
    raise exception 'perfil não pertence a esta conta' using errcode = '42501';
  end if;
  if not public.limite_ok_usuario('sync') then
    raise exception 'muitas sincronizações em pouco tempo; tente mais tarde' using errcode = 'P0001';
  end if;

  -- 2. tetos de tamanho (defesa contra payload absurdo)
  if jsonb_typeof(p_estado) is distinct from 'object' then raise exception 'p_estado deve ser objeto'; end if;
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

  -- 3c. moedas: contador DESTE aparelho (só cresce, e no máximo c_teto a mais por chamada); total = soma dos aparelhos
  v_aparelho := case when coalesce(p_estado->>'aparelho_id','') ~ '^[A-Za-z0-9_-]{6,64}$' then p_estado->>'aparelho_id' else 'legado' end;
  select m.ganhas, m.gastas into v_tinha_g, v_tinha_s
    from public.moedas_aparelho m where m.perfil_id = p_perfil and m.aparelho_id = v_aparelho for update;
  if not found then
    if v_aparelho <> 'legado'
       and (select count(*) from public.moedas_aparelho m where m.perfil_id = p_perfil) >= 50 then
      raise exception 'aparelhos demais neste perfil' using errcode = 'P0001';
    end if;
    v_tinha_g := 0; v_tinha_s := 0;
  end if;
  -- numeric: um número gigante no JSON não estoura o cast, só é limitado
  v_pedido_g := greatest(floor(coalesce((p_estado->>'moedas_ganhas')::numeric, 0)), 0);
  v_pedido_s := greatest(floor(coalesce((p_estado->>'moedas_gastas')::numeric, 0)), 0);
  v_aceito_g := greatest(v_tinha_g, least(v_pedido_g, v_tinha_g + c_teto, c_int_max))::bigint;
  v_aceito_s := greatest(v_tinha_s, least(v_pedido_s, c_int_max))::bigint;   -- gastar a mais só baixa o próprio saldo: sem teto
  if v_pedido_g > v_aceito_g then
    insert into public.moedas_limitadas (perfil_id, aparelho_id, pedido, aceito)
    values (p_perfil, v_aparelho, least(v_pedido_g, 1e18), v_aceito_g::integer);
  end if;
  insert into public.moedas_aparelho (perfil_id, aparelho_id, ganhas, gastas)
  values (p_perfil, v_aparelho, v_aceito_g::integer, v_aceito_s::integer)
  on conflict (perfil_id, aparelho_id) do update set
    ganhas = greatest(public.moedas_aparelho.ganhas, excluded.ganhas),
    gastas = greatest(public.moedas_aparelho.gastas, excluded.gastas);
  select coalesce(sum(m.ganhas), 0), coalesce(sum(m.gastas), 0) into v_ganhas, v_gastas
    from public.moedas_aparelho m where m.perfil_id = p_perfil;

  update public.perfil_estado set
    xp            = greatest(v_est.xp,            coalesce((p_estado->>'xp')::int, 0)),
    moedas_ganhas = greatest(v_est.moedas_ganhas, least(v_ganhas, c_int_max)::int),
    moedas_gastas = greatest(v_est.moedas_gastas, least(v_gastas, c_int_max)::int),
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
alter function public.sincronizar_perfil(uuid, jsonb, jsonb, jsonb, jsonb) owner to postgres;
revoke all on function public.sincronizar_perfil(uuid, jsonb, jsonb, jsonb, jsonb) from public, anon;
grant execute on function public.sincronizar_perfil(uuid, jsonb, jsonb, jsonb, jsonb) to authenticated;
