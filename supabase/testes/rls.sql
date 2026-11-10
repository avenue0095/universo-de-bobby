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
  if n <> 11 then raise exception 'FALHA: esperava 11 tabelas no public, achei %', n; end if;
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

-- 13b. update direto (fora da RPC) também não consegue reduzir
do $$
declare v int;
begin
  update public.perfil_estado set xp = 1, moedas_ganhas = 1, comprado = '[]'::jsonb
   where perfil_id = '00000000-0000-4000-8000-0000000000a1';
  update public.progresso_fase set estrelas = 0 where perfil_id = '00000000-0000-4000-8000-0000000000a1' and fase_id = '1.1';
  select xp into v from public.perfil_estado where perfil_id = '00000000-0000-4000-8000-0000000000a1';
  if v <> 500 then raise exception 'FALHA: update direto reduziu xp para %', v; end if;
  select jsonb_array_length(comprado) into v from public.perfil_estado where perfil_id = '00000000-0000-4000-8000-0000000000a1';
  if v <> 2 then raise exception 'FALHA: update direto apagou item comprado'; end if;
  select estrelas into v from public.progresso_fase where perfil_id = '00000000-0000-4000-8000-0000000000a1' and fase_id = '1.1';
  if v <> 3 then raise exception 'FALHA: update direto reduziu estrelas para %', v; end if;
  raise notice 'OK: gatilhos so_cresce seguram o update direto';
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

-- 14. sincronizar_perfil no perfil de B é negado
do $$
begin
  begin
    perform public.sincronizar_perfil('00000000-0000-4000-8000-0000000000b1', '{}'::jsonb);
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
  foreach t in array array['responsavel','perfil','perfil_estado','progresso_fase','erro_pendente','dia_atividade','assinatura','pagamento','consentimento','webhook_evento','limite_taxa'] loop
    begin
      execute format('select count(*) from public.%I', t);
      raise exception 'FALHA: anon leu a tabela %', t;
    exception when insufficient_privilege then null;
    end;
  end loop;
  raise notice 'OK: anon negado nas 11 tabelas (42501)';
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

-- =============================================================================
-- Resumo esperado: 24 linhas "NOTICE: OK:" e nenhuma "FALHA". Conte com:
--   psql ... -f supabase/testes/rls.sql 2>&1 | grep -c 'OK:'
-- =============================================================================

-- =============================================================================
-- Desfaz tudo: os usuários e dados de teste não ficam no banco.
-- (Se quiser inspecionar antes, troque ROLLBACK por COMMIT só em projeto local.)
-- =============================================================================
rollback;
