-- =============================================================================
-- O Universo de Bobby · Fase 4 · testes/rls.sql
-- PROVA da RLS consultando o banco (regra da casa: migração não prova nada).
--
-- Como rodar: no SQL Editor do Supabase (papel postgres) ou via
--   psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f supabase/testes/rls.sql
-- Em projeto de PRODUÇÃO rode dentro de BEGIN/ROLLBACK (já está assim abaixo):
-- nada fica gravado. Em projeto novo ou local pode rodar direto.
--
-- Cada bloco imprime "OK: <o que provou>" ou aborta com "FALHA: ...".
-- A regra: o 400 (CHECK) não prova RLS. O que prova é 0 linhas no SELECT,
-- 0 linhas no UPDATE/DELETE, ou erro 42501 (insufficient_privilege) no INSERT.
-- =============================================================================

begin;

-- -----------------------------------------------------------------------------
-- 0. Dois adultos de teste (A e B) e um perfil para cada um
-- -----------------------------------------------------------------------------
do $$
declare
  a uuid := '00000000-0000-4000-8000-00000000000a';
  b uuid := '00000000-0000-4000-8000-00000000000b';
begin
  insert into auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data)
  values
    (a, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'teste-a@exemplo.invalid', '', now(), now(), now(), '{"provider":"email","providers":["email"]}', '{}'),
    (b, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'teste-b@exemplo.invalid', '', now(), now(), now(), '{"provider":"email","providers":["email"]}', '{}')
  on conflict (id) do nothing;

  -- o gatilho criou responsavel A e B?
  if (select count(*) from public.responsavel where id in (a,b)) <> 2 then
    raise exception 'FALHA: gatilho criar_responsavel_ao_cadastrar não criou as 2 linhas';
  end if;
  raise notice 'OK: gatilho cria responsavel ao cadastrar';

  insert into public.perfil (id, responsavel_id, id_local, apelido, cor, faixa) values
    ('00000000-0000-4000-8000-0000000000a1', a, 'pA1', 'Lua',  '#12A06E', 'f78'),
    ('00000000-0000-4000-8000-0000000000b1', b, 'pB1', 'Theo', '#1B93C8', 'f910');

  if (select count(*) from public.perfil_estado where perfil_id in ('00000000-0000-4000-8000-0000000000a1','00000000-0000-4000-8000-0000000000b1')) <> 2 then
    raise exception 'FALHA: gatilho criar_estado_do_perfil não criou perfil_estado';
  end if;
  raise notice 'OK: gatilho cria perfil_estado junto com o perfil';

  insert into public.progresso_fase (perfil_id, fase_id, materia, estrelas) values
    ('00000000-0000-4000-8000-0000000000a1', '1.1', 'mat', 3),
    ('00000000-0000-4000-8000-0000000000b1', '1.1', 'mat', 2);

  insert into public.assinatura (id, responsavel_id, plano, valor_centavos, status, acesso_ate, provedor_assinatura_id) values
    ('00000000-0000-4000-8000-0000000000aa', a, 'anual', 14900, 'ativa', now() + interval '300 days', 'sub_teste_a'),
    ('00000000-0000-4000-8000-0000000000bb', b, 'mensal', 1990, 'expirada', now() - interval '10 days', 'sub_teste_b');

  -- 0006: um aparelho de B com moedas (para provar que A não vê nem mexe)
  insert into public.moedas_aparelho (perfil_id, aparelho_id, ganhas, gastas) values
    ('00000000-0000-4000-8000-0000000000b1', 'aparelhoB01', 70, 10);
end $$;

-- -----------------------------------------------------------------------------
-- 1. Toda tabela do public tem RLS ligada
-- -----------------------------------------------------------------------------
do $$
declare r record; n int := 0;
begin
  for r in
    select c.relname, c.relrowsecurity
      from pg_class c join pg_namespace s on s.oid = c.relnamespace
     where s.nspname = 'public' and c.relkind = 'r'
  loop
    n := n + 1;
    if not r.relrowsecurity then
      raise exception 'FALHA: tabela % sem RLS ligada', r.relname;
    end if;
  end loop;
  if n <> 13 then raise exception 'FALHA: esperava 13 tabelas no public (11 + moedas_aparelho da 0006 + moedas_limitadas da 0007), achei %', n; end if;
  raise notice 'OK: % tabelas do public com RLS ligada', n;
end $$;

-- -----------------------------------------------------------------------------
-- 2. Nenhuma política vale para PUBLIC ou anon; nenhuma "using (true)"
-- -----------------------------------------------------------------------------
do $$
declare r record; n int := 0;
begin
  for r in select tablename, policyname, roles, qual, with_check from pg_policies where schemaname = 'public' loop
    n := n + 1;
    if 'public' = any(r.roles) or 'anon' = any(r.roles) then
      raise exception 'FALHA: política %.% vale para %', r.tablename, r.policyname, r.roles;
    end if;
    if coalesce(r.qual,'') = 'true' or coalesce(r.with_check,'') = 'true' then
      raise exception 'FALHA: política %.% é using/with check (true)', r.tablename, r.policyname;
    end if;
  end loop;
  raise notice 'OK: % políticas, todas restritas a authenticated e nenhuma (true)', n;
end $$;

-- -----------------------------------------------------------------------------
-- 3. Tabelas de dinheiro e de servidor não têm política de escrita para authenticated
-- -----------------------------------------------------------------------------
do $$
declare n int;
begin
  select count(*) into n from pg_policies
   where schemaname = 'public' and tablename in ('assinatura','pagamento') and cmd in ('INSERT','UPDATE','DELETE','ALL');
  if n > 0 then raise exception 'FALHA: assinatura/pagamento com política de escrita (%)', n; end if;
  select count(*) into n from pg_policies
   where schemaname = 'public' and tablename in ('webhook_evento','limite_taxa');
  if n > 0 then raise exception 'FALHA: webhook_evento/limite_taxa com política (%)', n; end if;
  raise notice 'OK: assinatura e pagamento só leitura; webhook_evento e limite_taxa sem política';
end $$;

-- -----------------------------------------------------------------------------
-- 3b. Saldo de moedas só pela RPC (0007): sem política nem grant de escrita em
--     moedas_aparelho, moedas_limitadas fechada, perfil_estado só com update nas
--     colunas de bloco, e a RPC é security definer com search_path fixo
-- -----------------------------------------------------------------------------
do $$
declare n int; cfg text[]; dono text; def boolean;
begin
  select count(*) into n from pg_policies
   where schemaname = 'public' and tablename = 'moedas_aparelho' and cmd in ('INSERT','UPDATE','DELETE','ALL');
  if n > 0 then raise exception 'FALHA: moedas_aparelho com política de escrita (%)', n; end if;
  select count(*) into n from pg_policies where schemaname = 'public' and tablename = 'moedas_limitadas';
  if n > 0 then raise exception 'FALHA: moedas_limitadas com política (%)', n; end if;
  if has_table_privilege('authenticated', 'public.moedas_aparelho', 'INSERT')
     or has_table_privilege('authenticated', 'public.moedas_aparelho', 'UPDATE')
     or has_table_privilege('authenticated', 'public.moedas_aparelho', 'DELETE') then
    raise exception 'FALHA: authenticated ainda escreve em moedas_aparelho';
  end if;
  if has_table_privilege('authenticated', 'public.moedas_limitadas', 'SELECT') then
    raise exception 'FALHA: authenticated lê moedas_limitadas';
  end if;
  if has_table_privilege('authenticated', 'public.perfil_estado', 'UPDATE') then
    raise exception 'FALHA: authenticated ainda tem update na tabela perfil_estado inteira';
  end if;
  if has_column_privilege('authenticated', 'public.perfil_estado', 'moedas_ganhas', 'UPDATE')
     or has_column_privilege('authenticated', 'public.perfil_estado', 'moedas_gastas', 'UPDATE')
     or has_column_privilege('authenticated', 'public.perfil_estado', 'xp', 'UPDATE')
     or has_column_privilege('authenticated', 'public.perfil_estado', 'comprado', 'UPDATE')
     or has_column_privilege('authenticated', 'public.perfil_estado', 'moedas_ganhas', 'INSERT') then
    raise exception 'FALHA: authenticated grava moedas/xp/comprado de perfil_estado direto';
  end if;
  if not has_column_privilege('authenticated', 'public.perfil_estado', 'look', 'UPDATE') then
    raise exception 'FALHA: o grant de volta das colunas de bloco não aconteceu (look)';
  end if;
  select p.proconfig, pg_get_userbyid(p.proowner), p.prosecdef into cfg, dono, def
    from pg_proc p where p.oid = 'public.sincronizar_perfil(uuid, jsonb, jsonb, jsonb, jsonb)'::regprocedure;
  if not def then raise exception 'FALHA: sincronizar_perfil não é security definer'; end if;
  if cfg is null or not ('search_path=""' = any(cfg)) then raise exception 'FALHA: sincronizar_perfil sem search_path vazio (%)', cfg; end if;
  if dono <> 'postgres' then raise exception 'FALHA: dono de sincronizar_perfil é %', dono; end if;
  raise notice 'OK: moedas só pela RPC (sem escrita direta em moedas_aparelho nem nas colunas de moeda; RPC definer, search_path vazio, dono postgres)';
end $$;

-- -----------------------------------------------------------------------------
-- 4. anon não tem privilégio de tabela em nada do public
-- -----------------------------------------------------------------------------
do $$
declare n int;
begin
  select count(*) into n from information_schema.role_table_grants
   where table_schema = 'public' and grantee = 'anon';
  if n > 0 then raise exception 'FALHA: anon ainda tem % privilégios de tabela no public', n; end if;
  raise notice 'OK: anon sem privilégio de tabela no public';
end $$;

-- =============================================================================
-- A partir daqui simulamos o usuário A logado (JWT com sub = A)
-- =============================================================================
set local role authenticated;
select set_config('request.jwt.claims',
  '{"sub":"00000000-0000-4000-8000-00000000000a","role":"authenticated","email":"teste-a@exemplo.invalid"}', true);

-- 5. A vê só o próprio perfil
do $$
declare n int;
begin
  select count(*) into n from public.perfil;
  if n <> 1 then raise exception 'FALHA: A vê % perfis (esperado 1)', n; end if;
  if not exists (select 1 from public.perfil where id_local = 'pA1') then raise exception 'FALHA: A não vê o próprio perfil'; end if;
  raise notice 'OK: A vê 1 perfil e é o dele';
end $$;

-- 6. A não vê o progresso de B (tabela filha, via perfil_e_meu)
do $$
declare n int;
begin
  select count(*) into n from public.progresso_fase;
  if n <> 1 then raise exception 'FALHA: A vê % linhas de progresso (esperado 1)', n; end if;
  select count(*) into n from public.perfil_estado;
  if n <> 1 then raise exception 'FALHA: A vê % perfil_estado (esperado 1)', n; end if;
  raise notice 'OK: tabelas filhas filtradas pelo dono do perfil';
end $$;

-- 7. A não consegue INSERIR fase no perfil de B (42501, não 400)
do $$
begin
  begin
    insert into public.progresso_fase (perfil_id, fase_id, materia, estrelas)
    values ('00000000-0000-4000-8000-0000000000b1', '2.2', 'mat', 1);
    raise exception 'FALHA: A inseriu fase no perfil de B';
  exception when insufficient_privilege then
    raise notice 'OK: insert no perfil de outro responsável devolve 42501';
  end;
end $$;

-- 8. UPDATE no progresso de B afeta 0 linhas (RLS silencia, não erra)
do $$
declare n int;
begin
  update public.progresso_fase set estrelas = 3 where perfil_id = '00000000-0000-4000-8000-0000000000b1';
  get diagnostics n = row_count;
  if n <> 0 then raise exception 'FALHA: A alterou % linhas de B', n; end if;
  raise notice 'OK: update no progresso de B afeta 0 linhas';
end $$;

-- 9. A não consegue criar perfil em nome de B
do $$
begin
  begin
    insert into public.perfil (responsavel_id, id_local, apelido, cor)
    values ('00000000-0000-4000-8000-00000000000b', 'pX', 'Intruso', '#000000');
    raise exception 'FALHA: A criou perfil para B';
  exception when insufficient_privilege then
    raise notice 'OK: perfil só nasce com responsavel_id = auth.uid()';
  end;
end $$;

-- 10. A lê a própria assinatura e não a de B; não consegue escrever em nenhuma
do $$
declare n int;
begin
  select count(*) into n from public.assinatura;
  if n <> 1 then raise exception 'FALHA: A vê % assinaturas (esperado 1)', n; end if;
  begin
    insert into public.assinatura (responsavel_id, plano, valor_centavos, status, acesso_ate)
    values ('00000000-0000-4000-8000-00000000000a', 'anual', 1, 'ativa', now() + interval '10 years');
    raise exception 'FALHA: A se deu uma assinatura';
  exception when insufficient_privilege then null;
  end;
  update public.assinatura set acesso_ate = now() + interval '10 years';
  get diagnostics n = row_count;
  if n <> 0 then raise exception 'FALHA: A estendeu a própria assinatura (% linhas)', n; end if;
  raise notice 'OK: assinatura é só leitura para o responsável';
end $$;

-- 11. acesso_liberado() responde pela assinatura de A (ativa)
do $$
declare r jsonb;
begin
  r := public.acesso_liberado();
  if (r->>'liberado')::boolean is not true or r->>'plano' <> 'anual' then
    raise exception 'FALHA: acesso_liberado() devolveu %', r;
  end if;
  raise notice 'OK: acesso_liberado() = % / %', r->>'liberado', r->>'status';
end $$;

-- 12. webhook_evento e limite_taxa são invisíveis para o usuário logado
do $$
begin
  begin
    perform count(*) from public.webhook_evento;
    raise exception 'FALHA: authenticated leu webhook_evento';
  exception when insufficient_privilege then null;
  end;
  begin
    perform count(*) from public.limite_taxa;
    raise exception 'FALHA: authenticated leu limite_taxa';
  exception when insufficient_privilege then null;
  end;
  raise notice 'OK: webhook_evento e limite_taxa negados ao usuário logado';
end $$;

-- 13. sincronizar_perfil: merge nunca reduz estrelas nem moedas ganhas; gastar não
--     devolve moeda; união de comprado
do $$
declare r jsonb; e jsonb;
begin
  -- aparelho: ganhou 120, não gastou nada
  r := public.sincronizar_perfil(
    '00000000-0000-4000-8000-0000000000a1',
    jsonb_build_object('xp', 500, 'moedas_ganhas', 120, 'moedas_gastas', 0, 'comprado', '[]'::jsonb,
                       'look', '{"chapeu":"festa"}'::jsonb, 'blocos_em', jsonb_build_object('look', now())),
    '[{"fase_id":"1.1","materia":"mat","estrelas":1,"acertos":3,"erros":0,"tempo_seg":60},
      {"fase_id":"1.2","materia":"mat","estrelas":2,"acertos":5,"erros":1,"tempo_seg":90}]'::jsonb,
    '[]'::jsonb, '[{"dia":"2026-10-24","blocos":1,"perguntas":8,"acertos":7,"revisoes":0,"segundos":300}]'::jsonb);
  e := r->'estado';
  if (e->>'xp')::int <> 500 or (e->>'moedas')::int <> 120 then raise exception 'FALHA: estado não subiu: %', e; end if;
  if (select (f->>'estrelas')::int from jsonb_array_elements(r->'fases') f where f->>'fase_id' = '1.1') <> 3 then
    raise exception 'FALHA: merge reduziu as estrelas da 1.1 (banco tinha 3, aparelho mandou 1)';
  end if;

  -- aparelho: comprou o Teo por 80 (gastas sobe para 80, saldo local 40)
  r := public.sincronizar_perfil(
    '00000000-0000-4000-8000-0000000000a1',
    jsonb_build_object('xp', 500, 'moedas_ganhas', 120, 'moedas_gastas', 80, 'comprado', '["teo"]'::jsonb),
    '[]'::jsonb, '[]'::jsonb, '[]'::jsonb);
  e := r->'estado';
  if (e->>'moedas')::int <> 40 then raise exception 'FALHA: gastar não baixou o saldo (esperado 40): %', e; end if;

  -- aparelho atrasado manda valores menores: nada volta, nada some
  r := public.sincronizar_perfil(
    '00000000-0000-4000-8000-0000000000a1',
    jsonb_build_object('xp', 10, 'moedas_ganhas', 5, 'moedas_gastas', 0, 'comprado', '["rufa"]'::jsonb),
    '[]'::jsonb, '[]'::jsonb, '[]'::jsonb);
  e := r->'estado';
  if (e->>'xp')::int <> 500 or (e->>'moedas_ganhas')::int <> 120 or (e->>'moedas_gastas')::int <> 80 or (e->>'moedas')::int <> 40 then
    raise exception 'FALHA: aparelho atrasado alterou o razão de moedas: %', e;
  end if;
  if jsonb_array_length(e->'comprado') <> 2 then raise exception 'FALHA: comprado não é união: %', e->'comprado'; end if;
  raise notice 'OK: sincronizar_perfil nunca reduz estrelas/moedas ganhas, gastar não devolve moeda, comprado é união';
end $$;

-- 13b. update direto (fora da RPC): moedas, xp e comprado negados (0007); bloco
--      continua gravável; estrelas seguem presas pelo gatilho so_cresce
do $$
declare v int;
begin
  begin
    update public.perfil_estado set xp = 1 where perfil_id = '00000000-0000-4000-8000-0000000000a1';
    raise exception 'FALHA: update direto de xp aceito';
  exception when insufficient_privilege then null;
  end;
  begin
    update public.perfil_estado set comprado = '[]'::jsonb where perfil_id = '00000000-0000-4000-8000-0000000000a1';
    raise exception 'FALHA: update direto de comprado aceito';
  exception when insufficient_privilege then null;
  end;
  update public.perfil_estado set look = '{"chapeu":"festa"}'::jsonb where perfil_id = '00000000-0000-4000-8000-0000000000a1';
  update public.progresso_fase set estrelas = 0 where perfil_id = '00000000-0000-4000-8000-0000000000a1' and fase_id = '1.1';
  select xp into v from public.perfil_estado where perfil_id = '00000000-0000-4000-8000-0000000000a1';
  if v <> 500 then raise exception 'FALHA: xp mudou para %', v; end if;
  select jsonb_array_length(comprado) into v from public.perfil_estado where perfil_id = '00000000-0000-4000-8000-0000000000a1';
  if v <> 2 then raise exception 'FALHA: update direto apagou item comprado'; end if;
  select estrelas into v from public.progresso_fase where perfil_id = '00000000-0000-4000-8000-0000000000a1' and fase_id = '1.1';
  if v <> 3 then raise exception 'FALHA: update direto reduziu estrelas para %', v; end if;
  raise notice 'OK: update direto de xp e comprado negado (42501), bloco gravável, estrelas presas pelo gatilho';
end $$;

-- 13c. limite_ok não é chamável pelo usuário (só a versão que deriva a chave de auth.uid())
do $$
begin
  begin
    perform public.limite_ok('sync:00000000-0000-4000-8000-0000000000b1', 1, interval '1 hour');
    raise exception 'FALHA: usuário logado chamou limite_ok com chave arbitrária';
  exception when insufficient_privilege then null;
  end;
  if not public.limite_ok_usuario('sync') then raise exception 'FALHA: limite_ok_usuario negou a primeira chamada'; end if;
  raise notice 'OK: limite_ok só para o servidor; limite_ok_usuario deriva a chave da sessão';
end $$;

-- 13d. responsável só altera relatorio_email na própria linha
do $$
begin
  update public.responsavel set relatorio_email = true where id = '00000000-0000-4000-8000-00000000000a';
  begin
    update public.responsavel set exclusao_pedida_em = now() where id = '00000000-0000-4000-8000-00000000000a';
    raise exception 'FALHA: responsável alterou exclusao_pedida_em direto';
  exception when insufficient_privilege then null;
  end;
  if public.pedir_exclusao() is null then raise exception 'FALHA: pedir_exclusao não marcou'; end if;
  raise notice 'OK: responsavel só grava relatorio_email; exclusão passa pela RPC';
end $$;

-- 13e. moedas por aparelho (0006): dois aparelhos offline não se apagam
--      (até aqui o perfil tem só a linha 'legado' com 120 ganhas e 80 gastas, do caso 13)
do $$
declare e jsonb; r jsonb;
begin
  r := public.sincronizar_perfil('00000000-0000-4000-8000-0000000000a1',
         '{"aparelho_id":"tabletA01","moedas_ganhas":50,"moedas_gastas":0}'::jsonb);
  r := public.sincronizar_perfil('00000000-0000-4000-8000-0000000000a1',
         '{"aparelho_id":"celularA1","moedas_ganhas":30,"moedas_gastas":20}'::jsonb);
  -- a mesma mensagem do tablet chega de novo (rede ruim): não soma outra vez
  r := public.sincronizar_perfil('00000000-0000-4000-8000-0000000000a1',
         '{"aparelho_id":"tabletA01","moedas_ganhas":50,"moedas_gastas":0}'::jsonb);
  e := r->'estado';
  if (e->>'moedas_ganhas')::int <> 200 or (e->>'moedas_gastas')::int <> 100 or (e->>'moedas')::int <> 100 then
    raise exception 'FALHA: moedas de dois aparelhos não somaram (esperado 200/100/100): %', e;
  end if;
  if jsonb_array_length(r->'moedas_aparelhos') <> 3 then
    raise exception 'FALHA: snapshot sem as 3 linhas de aparelho (legado, tablet, celular): %', r->'moedas_aparelhos';
  end if;
  raise notice 'OK: moedas por aparelho somam (120 + 50 + 30) e repetir o envio não soma de novo';
end $$;

-- 13f. moedas_aparelho: A não vê nem apaga a linha de B; update direto não reduz; apagar a própria linha não acontece
do $$
declare n int; v int;
begin
  select count(*) into n from public.moedas_aparelho where perfil_id = '00000000-0000-4000-8000-0000000000b1';
  if n <> 0 then raise exception 'FALHA: A vê % linhas de moedas de B', n; end if;
  begin
    update public.moedas_aparelho set ganhas = 0 where perfil_id = '00000000-0000-4000-8000-0000000000a1' and aparelho_id = 'tabletA01';
    raise exception 'FALHA: update direto em moedas_aparelho aceito';
  exception when insufficient_privilege then null;   -- 0007: authenticated não tem update
  end;
  select ganhas into v from public.moedas_aparelho where perfil_id = '00000000-0000-4000-8000-0000000000a1' and aparelho_id = 'tabletA01';
  if v <> 50 then raise exception 'FALHA: update direto reduziu o contador do aparelho para %', v; end if;
  begin
    delete from public.moedas_aparelho where perfil_id = '00000000-0000-4000-8000-0000000000a1';
    get diagnostics n = row_count;
  exception when insufficient_privilege then n := 0;   -- 0006 tira o delete de authenticated: 42501 também prova
  end;
  if n <> 0 then raise exception 'FALHA: A apagou % linhas de moedas (sem política de delete)', n; end if;
  begin
    insert into public.moedas_aparelho (perfil_id, aparelho_id, ganhas) values ('00000000-0000-4000-8000-0000000000b1', 'intruso01', 999);
    raise exception 'FALHA: A inseriu moedas no perfil de B';
  exception when insufficient_privilege then null;
  end;
  raise notice 'OK: moedas_aparelho só do dono, só cresce e não se apaga por fora';
end $$;

-- 13g. ninguém infla o próprio saldo (0007): insert e update diretos negados; a RPC
--      aceita no máximo 5000 a mais por chamada e por aparelho, limita sem quebrar e
--      registra em moedas_limitadas (contado como postgres no bloco 18)
do $$
declare r jsonb; e jsonb; v int;
begin
  begin
    insert into public.moedas_aparelho (perfil_id, aparelho_id, ganhas) values ('00000000-0000-4000-8000-0000000000a1', 'infla0001', 2147483647);
    raise exception 'FALHA: A inseriu moedas direto no próprio perfil';
  exception when insufficient_privilege then null;
  end;
  begin
    update public.perfil_estado set moedas_ganhas = 2147483647 where perfil_id = '00000000-0000-4000-8000-0000000000a1';
    raise exception 'FALHA: A gravou moedas_ganhas direto';
  exception when insufficient_privilege then null;
  end;
  begin
    insert into public.perfil_estado (perfil_id, moedas_ganhas) values ('00000000-0000-4000-8000-0000000000a1', 2147483647);
    raise exception 'FALHA: A inseriu perfil_estado com moedas';
  exception when insufficient_privilege then null;
  end;
  -- até aqui: 200 ganhas (13e). Aparelho novo pede 2147483647: entra 5000
  r := public.sincronizar_perfil('00000000-0000-4000-8000-0000000000a1',
         '{"aparelho_id":"inflador1","moedas_ganhas":2147483647,"moedas_gastas":0}'::jsonb);
  e := r->'estado';
  if (e->>'moedas_ganhas')::int <> 5200 then raise exception 'FALHA: teto não segurou (esperado 5200): %', e; end if;
  -- o mesmo aparelho pede um número que nem cabe em bigint: mais 5000, sem erro
  r := public.sincronizar_perfil('00000000-0000-4000-8000-0000000000a1',
         '{"aparelho_id":"inflador1","moedas_ganhas":1e30,"moedas_gastas":0}'::jsonb);
  e := r->'estado';
  if (e->>'moedas_ganhas')::int <> 10200 then raise exception 'FALHA: segunda chamada fora do teto (esperado 10200): %', e; end if;
  -- abaixo do teto passa inteiro (confiança no cliente, ANDAMENTO 6): +300 no tablet
  r := public.sincronizar_perfil('00000000-0000-4000-8000-0000000000a1',
         '{"aparelho_id":"tabletA01","moedas_ganhas":350,"moedas_gastas":0}'::jsonb);
  select ganhas into v from public.moedas_aparelho where perfil_id = '00000000-0000-4000-8000-0000000000a1' and aparelho_id = 'tabletA01';
  if v <> 350 then raise exception 'FALHA: ganho abaixo do teto não entrou inteiro (%)', v; end if;
  raise notice 'OK: insert/update direto de moedas negados; RPC limita a 5000 por chamada sem quebrar';
end $$;

-- 14. sincronizar_perfil no perfil de B é negado
do $$
begin
  begin
    perform public.sincronizar_perfil('00000000-0000-4000-8000-0000000000b1',
              '{"aparelho_id":"aparelhoB01","moedas_ganhas":999999,"moedas_gastas":0}'::jsonb);
    raise exception 'FALHA: A sincronizou o perfil de B';
  exception when insufficient_privilege then
    raise notice 'OK: sincronizar_perfil recusa perfil de outro responsável';
  end;
end $$;

-- 15. exportar_meus_dados() só traz o que é de A
do $$
declare r jsonb;
begin
  r := public.exportar_meus_dados();
  if jsonb_array_length(r->'perfis') <> 1 or jsonb_array_length(r->'assinaturas') <> 1 then
    raise exception 'FALHA: exportação trouxe dado de outro: perfis=% assinaturas=%', jsonb_array_length(r->'perfis'), jsonb_array_length(r->'assinaturas');
  end if;
  if r::text like '%Theo%' then raise exception 'FALHA: apelido do perfil de B apareceu na exportação de A'; end if;
  raise notice 'OK: exportação contém só os dados de A';
end $$;

-- 16. limite de 4 perfis por família
do $$
declare i int;
begin
  for i in 2..4 loop
    insert into public.perfil (responsavel_id, id_local, apelido, cor) values ('00000000-0000-4000-8000-00000000000a', 'pA'||i, 'Filho '||i, '#12A06E');
  end loop;
  begin
    insert into public.perfil (responsavel_id, id_local, apelido, cor) values ('00000000-0000-4000-8000-00000000000a', 'pA5', 'Quinto', '#12A06E');
    raise exception 'FALHA: 5º perfil aceito';
  exception when check_violation then
    raise notice 'OK: 5º perfil recusado (limite da família)';
  end;
end $$;

-- =============================================================================
-- Agora como anon (sem login): nada pode ser lido
-- =============================================================================
reset role;
set local role anon;
select set_config('request.jwt.claims', '{"role":"anon"}', true);

do $$
declare t text;
begin
  foreach t in array array['responsavel','perfil','perfil_estado','progresso_fase','erro_pendente','dia_atividade','assinatura','pagamento','consentimento','webhook_evento','limite_taxa','moedas_aparelho','moedas_limitadas'] loop
    begin
      execute format('select count(*) from public.%I', t);
      raise exception 'FALHA: anon leu a tabela %', t;
    exception when insufficient_privilege then null;
    end;
  end loop;
  raise notice 'OK: anon negado nas 13 tabelas (42501)';
end $$;

do $$
begin
  begin
    perform public.acesso_liberado();
    raise exception 'FALHA: anon chamou acesso_liberado()';
  exception when insufficient_privilege then
    raise notice 'OK: anon não executa as RPCs';
  end;
end $$;

reset role;

-- =============================================================================
-- Como o servidor (papel postgres): regras de gatilho que valem para qualquer gravação
-- =============================================================================

-- 17. pagamento só avança (0005): aviso atrasado do Asaas não desfaz pagamento nem estorno
do $$
declare st text; pg timestamptz;
begin
  insert into public.pagamento (provedor_pagamento_id, assinatura_id, responsavel_id, valor_centavos, status, pago_em)
  values ('pay_teste_ordem_1', '00000000-0000-4000-8000-0000000000aa', '00000000-0000-4000-8000-00000000000a', 1990, 'recebido', '2026-11-10'),
         ('pay_teste_ordem_2', '00000000-0000-4000-8000-0000000000aa', '00000000-0000-4000-8000-00000000000a', 1990, 'estornado', '2026-11-10');
  -- RECEIVED e depois UPDATED atrasado (o mesmo upsert do webhook)
  insert into public.pagamento (provedor_pagamento_id, valor_centavos, status, pago_em)
  values ('pay_teste_ordem_1', 1990, 'pendente', null)
  on conflict (provedor_pagamento_id) do update set status = excluded.status, pago_em = excluded.pago_em;
  select status, pago_em into st, pg from public.pagamento where provedor_pagamento_id = 'pay_teste_ordem_1';
  if st <> 'recebido' or pg is null then raise exception 'FALHA: aviso atrasado voltou a cobrança para % (pago_em %)', st, pg; end if;
  -- REFUNDED e depois CONFIRMED atrasado
  update public.pagamento set status = 'confirmado' where provedor_pagamento_id = 'pay_teste_ordem_2';
  select status into st from public.pagamento where provedor_pagamento_id = 'pay_teste_ordem_2';
  if st <> 'estornado' then raise exception 'FALHA: estorno virou % com aviso atrasado', st; end if;
  -- avançar continua possível
  update public.pagamento set status = 'estornado' where provedor_pagamento_id = 'pay_teste_ordem_1';
  select status, pago_em into st, pg from public.pagamento where provedor_pagamento_id = 'pay_teste_ordem_1';
  if st <> 'estornado' or pg is null then raise exception 'FALHA: recebido não avançou para estornado (%, %)', st, pg; end if;
  raise notice 'OK: pagamento só avança (pendente < confirmado < recebido; estornado terminal)';
end $$;

-- 18. 0007 visto pelo servidor: o teto ficou registrado e a RPC negada (14) não mexeu em B
do $$
declare n int; v int;
begin
  select count(*) into n from public.moedas_limitadas
   where perfil_id = '00000000-0000-4000-8000-0000000000a1' and aparelho_id = 'inflador1' and aceito in (5000, 10000);
  if n <> 2 then raise exception 'FALHA: esperava 2 registros de teto em moedas_limitadas, achei %', n; end if;
  select ganhas into v from public.moedas_aparelho where perfil_id = '00000000-0000-4000-8000-0000000000b1' and aparelho_id = 'aparelhoB01';
  if v <> 70 then raise exception 'FALHA: a chamada negada de A mexeu nas moedas de B (%)', v; end if;
  select count(*) into n from public.moedas_limitadas where perfil_id = '00000000-0000-4000-8000-0000000000b1';
  if n <> 0 then raise exception 'FALHA: a chamada negada de A registrou teto no perfil de B'; end if;
  raise notice 'OK: teto registrado em moedas_limitadas; RPC de outra família não tocou em B';
end $$;

-- 19. reabrir_assinatura_paga (0008): só o servidor chama; reabre a expirada paga e expira o pendente novo na mesma transação
do $$
declare r text; st text; st2 text; ini timestamptz;
begin
  if has_function_privilege('authenticated', 'public.reabrir_assinatura_paga(uuid, timestamptz, timestamptz)', 'EXECUTE')
     or has_function_privilege('anon', 'public.reabrir_assinatura_paga(uuid, timestamptz, timestamptz)', 'EXECUTE') then
    raise exception 'FALHA: reabrir_assinatura_paga executável fora do servidor';
  end if;
  if not (select p.prosecdef and 'search_path=""' = any(p.proconfig) and pg_get_userbyid(p.proowner) = 'postgres'
            from pg_proc p where p.oid = 'public.reabrir_assinatura_paga(uuid, timestamptz, timestamptz)'::regprocedure) then
    raise exception 'FALHA: reabrir_assinatura_paga sem security definer, search_path vazio ou dono postgres';
  end if;
  -- B: 'bb' expirada sem inicio_em (do bloco 0) + um checkout novo pendente
  insert into public.assinatura (id, responsavel_id, plano, valor_centavos, status, criado_em)
  values ('00000000-0000-4000-8000-0000000000bc', '00000000-0000-4000-8000-00000000000b', 'mensal', 1990, 'pendente', now() + interval '1 second');
  r := public.reabrir_assinatura_paga('00000000-0000-4000-8000-0000000000bb', now() + interval '30 days', now());
  select status, inicio_em into st, ini from public.assinatura where id = '00000000-0000-4000-8000-0000000000bb';
  select status into st2 from public.assinatura where id = '00000000-0000-4000-8000-0000000000bc';
  if r <> 'reaberta' or st <> 'ativa' or ini is null or st2 <> 'expirada' then
    raise exception 'FALHA: reabrir devolveu % (bb %, bc %)', r, st, st2;
  end if;
  r := public.reabrir_assinatura_paga('00000000-0000-4000-8000-0000000000bb', now() + interval '30 days', now());
  if r <> 'mudou' then raise exception 'FALHA: segunda chamada devolveu % (esperado mudou)', r; end if;
  raise notice 'OK: reabrir_assinatura_paga só para o servidor, atômica (expira o pendente e reabre a paga)';
end $$;

-- =============================================================================
-- Resumo esperado: 30 linhas "NOTICE: OK:" e nenhuma "FALHA". Conte com:
--   psql ... -f supabase/testes/rls.sql 2>&1 | grep -c 'OK:'
-- =============================================================================

-- =============================================================================
-- Desfaz tudo: os usuários e dados de teste não ficam no banco.
-- (Se quiser inspecionar antes, troque ROLLBACK por COMMIT só em projeto local.)
-- =============================================================================
rollback;
