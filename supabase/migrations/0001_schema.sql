-- =============================================================================
-- O Universo de Bobby · Fase 4 · 0001_schema.sql
-- Esquema do backend: conta do responsável, perfis das crianças, progresso,
-- assinatura, pagamento e consentimento.
--
-- Regras que este arquivo obedece (docs/fase4/ARQUITETURA.md):
--   * A conta é do ADULTO (auth.users). A criança nunca loga e nunca tem e-mail.
--   * Da criança só sobem: apelido (até 18 caracteres), cor, faixa etária e progresso.
--   * Nenhuma fase, aula, pergunta ou desenho vai para o banco: é código do app.
--   * Toda tabela ganha RLS no 0002_rls.sql. Este arquivo só cria estrutura.
--   * Nenhum segredo aqui. Chaves do provedor ficam em variável de ambiente.
--
-- Como rodar: supabase db push, ou colar no SQL Editor do projeto, na ordem
-- 0001 -> 0002 -> 0003. Depois rodar supabase/testes/rls.sql e conferir que
-- todas as linhas terminam em "OK".
-- =============================================================================

create extension if not exists pgcrypto;   -- gen_random_uuid, digest

-- -----------------------------------------------------------------------------
-- Função utilitária: carimbo de atualização
-- -----------------------------------------------------------------------------
create or replace function public.set_atualizado_em()
returns trigger
language plpgsql
as $$
begin
  new.atualizado_em := now();
  return new;
end;
$$;

-- =============================================================================
-- 1. responsavel · 1 linha por conta do adulto (auth.users)
-- =============================================================================
create table public.responsavel (
  id                 uuid primary key references auth.users(id) on delete cascade,
  relatorio_email    boolean      not null default false,   -- opt-in explícito (CONSENTIMENTO-E-TERMOS.md)
  exclusao_pedida_em timestamptz,                           -- LGPD art. 18 VI: pedido de apagar conta
  criado_em          timestamptz  not null default now(),
  atualizado_em      timestamptz  not null default now()
);
comment on table public.responsavel is
  'Conta do adulto. O e-mail fica em auth.users; aqui só o que o app precisa. Sem nome, CPF, telefone ou endereço.';

create trigger trg_responsavel_atualizado
  before update on public.responsavel
  for each row execute function public.set_atualizado_em();

-- Cria a linha de responsavel assim que o adulto confirma o e-mail / cria a conta.
-- SECURITY DEFINER porque o gatilho roda no esquema auth, onde o papel comum não escreve.
create or replace function public.criar_responsavel_ao_cadastrar()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.responsavel (id) values (new.id)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists trg_auth_user_criado on auth.users;
create trigger trg_auth_user_criado
  after insert on auth.users
  for each row execute function public.criar_responsavel_ao_cadastrar();

-- =============================================================================
-- 2. perfil · cada criança (até 4 por família, conferido por gatilho)
-- =============================================================================
create table public.perfil (
  id             uuid primary key default gen_random_uuid(),
  responsavel_id uuid not null references public.responsavel(id) on delete cascade,
  id_local       text not null,   -- o id "p..." do localStorage; une o aparelho à nuvem
  apelido        text not null check (char_length(apelido) between 1 and 18),
  cor            text not null check (cor ~ '^#[0-9A-Fa-f]{6}$'),
  faixa          text not null default 'f78' check (faixa in ('f78','f910','f1112')),
  criado_em      timestamptz not null default now(),
  atualizado_em  timestamptz not null default now(),
  unique (responsavel_id, id_local)
);
comment on table public.perfil is
  'Perfil da criança. Só apelido, cor e faixa etária (nunca data de nascimento, foto, e-mail ou localização).';
comment on column public.perfil.id_local is
  'Id gerado no aparelho (estado v4). Permite migrar o localStorage na primeira conta sem duplicar perfil.';

create index perfil_responsavel_idx on public.perfil (responsavel_id);

create trigger trg_perfil_atualizado
  before update on public.perfil
  for each row execute function public.set_atualizado_em();

-- Limite de perfis por família: vem da assinatura (max_perfis) ou 4 por padrão.
create or replace function public.conferir_limite_perfis()
returns trigger
language plpgsql
as $$
declare
  v_max   int;
  v_total int;
begin
  select coalesce(max(a.max_perfis), 4) into v_max
    from public.assinatura a
   where a.responsavel_id = new.responsavel_id
     and a.status in ('ativa','atrasada','cancelada')
     and a.acesso_ate > now();
  v_max := coalesce(v_max, 4);

  select count(*) into v_total
    from public.perfil p
   where p.responsavel_id = new.responsavel_id;

  if v_total >= v_max then
    raise exception 'limite de % perfis por família atingido', v_max
      using errcode = 'check_violation';
  end if;
  return new;
end;
$$;

create trigger trg_perfil_limite
  before insert on public.perfil
  for each row execute function public.conferir_limite_perfis();

-- =============================================================================
-- 3. perfil_estado · estado leve da criança (1 linha por perfil)
--    Campos numéricos que só crescem ficam em coluna (merge por GREATEST).
--    Blocos que o app grava inteiros ficam em jsonb, cada um com seu carimbo
--    em blocos_em (merge "último carimbo vence", por bloco).
-- =============================================================================
create table public.perfil_estado (
  perfil_id      uuid primary key references public.perfil(id) on delete cascade,
  -- só crescem (nunca reduzidos por sincronização)
  xp             integer not null default 0 check (xp >= 0),
  -- moedas é um razão: o que entrou e o que saiu só crescem; o saldo é a diferença.
  -- Assim gastar não é "reduzir" (gastas sobe) e um conflito nunca devolve moeda gasta
  -- nem apaga moeda ganha. Saldo guardado como coluna gerada, para leitura simples.
  moedas_ganhas  integer not null default 0 check (moedas_ganhas >= 0),
  moedas_gastas  integer not null default 0 check (moedas_gastas >= 0),
  moedas         integer generated always as (greatest(moedas_ganhas - moedas_gastas, 0)) stored,
  acertos_total  integer not null default 0 check (acertos_total >= 0),
  melhor_combo   integer not null default 0 check (melhor_combo >= 0),
  comprado       jsonb   not null default '[]'::jsonb check (jsonb_typeof(comprado) = 'array'),
  -- blocos (último carimbo vence)
  materia        text    not null default 'mat' check (materia in ('mat','pt','en')),
  look           jsonb   not null default '{}'::jsonb,
  config         jsonb   not null default '{}'::jsonb,
  ofensiva       jsonb   not null default '{}'::jsonb,
  colecao        jsonb   not null default '{}'::jsonb,
  desenhos       jsonb   not null default '{}'::jsonb,
  revisao_meta   jsonb   not null default '{}'::jsonb,   -- ultimoAquecimento, ajustadoEm, aliviadoEm
  prefs          jsonb   not null default '{}'::jsonb,   -- som, voz, musica, vibra, velocidade
  blocos_em      jsonb   not null default '{}'::jsonb,   -- {"look":"2026-10-24T12:00:00Z", ...}
  versao_app     text,
  atualizado_em  timestamptz not null default now(),
  -- teto de tamanho: o estado inteiro de um perfil cabe em bem menos que isso
  constraint perfil_estado_tamanho check (
    pg_column_size(look) + pg_column_size(config) + pg_column_size(ofensiva) +
    pg_column_size(colecao) + pg_column_size(desenhos) + pg_column_size(revisao_meta) +
    pg_column_size(prefs) + pg_column_size(comprado) < 262144
  )
);
comment on table public.perfil_estado is
  'Estado leve do perfil. Numéricos monotônicos em coluna; o resto em blocos jsonb com carimbo por bloco.';

create trigger trg_perfil_estado_atualizado
  before update on public.perfil_estado
  for each row execute function public.set_atualizado_em();

-- Garantia no BANCO (não só na RPC): colunas monotônicas nunca descem, nem por
-- update direto via PostgREST. comprado nunca perde item.
create or replace function public.perfil_estado_so_cresce()
returns trigger
language plpgsql
as $$
begin
  new.xp            := greatest(old.xp, new.xp);
  new.moedas_ganhas := greatest(old.moedas_ganhas, new.moedas_ganhas);
  new.moedas_gastas := greatest(old.moedas_gastas, new.moedas_gastas);
  new.acertos_total := greatest(old.acertos_total, new.acertos_total);
  new.melhor_combo  := greatest(old.melhor_combo, new.melhor_combo);
  select coalesce(jsonb_agg(distinct x), '[]'::jsonb) into new.comprado
    from (select jsonb_array_elements(coalesce(old.comprado,'[]'::jsonb)) x
          union
          select jsonb_array_elements(case when jsonb_typeof(new.comprado) = 'array' then new.comprado else '[]'::jsonb end)) s
   where jsonb_typeof(x) = 'string';
  return new;
end;
$$;
create trigger trg_perfil_estado_so_cresce
  before update on public.perfil_estado
  for each row execute function public.perfil_estado_so_cresce();

-- =============================================================================
-- 4. progresso_fase · estrelas por fase (o que o responsável mais consulta)
-- =============================================================================
create table public.progresso_fase (
  perfil_id     uuid not null references public.perfil(id) on delete cascade,
  fase_id       text not null check (fase_id ~ '^[a-z0-9._-]{1,24}$'),
  materia       text not null check (materia in ('mat','pt','en')),
  estrelas      smallint not null default 0 check (estrelas between 0 and 3),
  acertos       integer  not null default 0 check (acertos >= 0),
  erros         integer  not null default 0 check (erros >= 0),
  tempo_seg     integer  not null default 0 check (tempo_seg >= 0),
  concluida_em  timestamptz,
  atualizado_em timestamptz not null default now(),
  primary key (perfil_id, fase_id)
);
create index progresso_fase_perfil_materia_idx on public.progresso_fase (perfil_id, materia);

create trigger trg_progresso_fase_atualizado
  before update on public.progresso_fase
  for each row execute function public.set_atualizado_em();

-- Estrelas e contadores nunca descem, nem por update direto.
create or replace function public.progresso_fase_so_cresce()
returns trigger
language plpgsql
as $$
begin
  new.estrelas     := greatest(old.estrelas, new.estrelas);
  new.acertos      := greatest(old.acertos, new.acertos);
  new.erros        := greatest(old.erros, new.erros);
  new.tempo_seg    := greatest(old.tempo_seg, new.tempo_seg);
  new.concluida_em := least(old.concluida_em, new.concluida_em);
  return new;
end;
$$;
create trigger trg_progresso_fase_so_cresce
  before update on public.progresso_fase
  for each row execute function public.progresso_fase_so_cresce();

-- =============================================================================
-- 5. erro_pendente · itens da revisão espaçada (caixas de Leitner)
--    Inclui os erros com a pergunta congelada e os itens sem pergunta (palavras).
-- =============================================================================
create table public.erro_pendente (
  perfil_id     uuid not null references public.perfil(id) on delete cascade,
  chave         text not null check (chave ~ '^[a-zA-Z0-9:._|-]{1,80}$'),
  materia       text not null check (materia in ('mat','pt','en')),
  caixa         smallint not null default 1 check (caixa between 1 and 5),
  proxima       date,
  vezes         integer not null default 0 check (vezes >= 0),
  acertos       integer not null default 0 check (acertos >= 0),
  lapsos        integer not null default 0 check (lapsos >= 0),
  ultimo        date,
  pergunta      jsonb,   -- só para chaves "er:*"; texto puro, validado no app antes de subir
  removido      boolean not null default false,   -- dominado e retirado da fila (sem apagar a linha no merge)
  carimbo       timestamptz not null default now(),  -- relógio do APARELHO na última mudança; decide o merge (último vence)
  atualizado_em timestamptz not null default now(),  -- relógio do SERVIDOR (gatilho); só auditoria
  primary key (perfil_id, chave),
  constraint erro_pendente_pergunta_tamanho check (pergunta is null or pg_column_size(pergunta) < 4096)
);
create index erro_pendente_perfil_proxima_idx on public.erro_pendente (perfil_id, proxima)
  where removido = false;

create trigger trg_erro_pendente_atualizado
  before update on public.erro_pendente
  for each row execute function public.set_atualizado_em();

-- =============================================================================
-- 6. dia_atividade · uso por dia (gráfico do responsável, "dias de exploração")
-- =============================================================================
create table public.dia_atividade (
  perfil_id     uuid not null references public.perfil(id) on delete cascade,
  dia           date not null,
  blocos        integer not null default 0 check (blocos >= 0),
  perguntas     integer not null default 0 check (perguntas >= 0),
  acertos       integer not null default 0 check (acertos >= 0),
  revisoes      integer not null default 0 check (revisoes >= 0),
  segundos      integer not null default 0 check (segundos between 0 and 86400),
  atualizado_em timestamptz not null default now(),
  primary key (perfil_id, dia)
);
create index dia_atividade_perfil_dia_idx on public.dia_atividade (perfil_id, dia desc);

create trigger trg_dia_atividade_atualizado
  before update on public.dia_atividade
  for each row execute function public.set_atualizado_em();

-- =============================================================================
-- 7. assinatura · 1 por família (histórico permitido; 1 vigente por vez)
--    Só o servidor (service_role, via webhook) escreve. O responsável só lê.
-- =============================================================================
create table public.assinatura (
  id                     uuid primary key default gen_random_uuid(),
  responsavel_id         uuid not null references public.responsavel(id) on delete cascade,
  provedor               text not null default 'asaas' check (provedor in ('asaas','stripe','pagarme')),
  provedor_cliente_id    text,
  provedor_assinatura_id text unique,
  plano                  text not null check (plano in ('mensal','anual')),
  valor_centavos         integer not null check (valor_centavos > 0),
  moeda                  text not null default 'BRL',
  status                 text not null default 'pendente'
                         check (status in ('pendente','ativa','atrasada','cancelada','expirada','reembolsada')),
  max_perfis             integer not null default 4 check (max_perfis between 1 and 4),
  inicio_em              timestamptz,
  acesso_ate             timestamptz,            -- fonte única da verdade para liberar o app
  cancelada_em           timestamptz,
  motivo_cancelamento    text check (motivo_cancelamento is null or char_length(motivo_cancelamento) <= 200),
  criado_em              timestamptz not null default now(),
  atualizado_em          timestamptz not null default now()
);
comment on column public.assinatura.acesso_ate is
  'O app libera enquanto now() < acesso_ate. O webhook empurra essa data a cada pagamento confirmado (+ tolerância, ver ARQUITETURA.md 6.4).';

create index assinatura_responsavel_idx on public.assinatura (responsavel_id);
-- só uma assinatura "viva" por família
create unique index assinatura_vigente_unica
  on public.assinatura (responsavel_id)
  where status in ('pendente','ativa','atrasada');

create trigger trg_assinatura_atualizado
  before update on public.assinatura
  for each row execute function public.set_atualizado_em();

-- =============================================================================
-- 8. pagamento · cada cobrança (registro fiscal; sobrevive à exclusão da conta
--    com responsavel_id = null, pelo prazo que contador e advogado definirem)
-- =============================================================================
create table public.pagamento (
  id                     uuid primary key default gen_random_uuid(),
  assinatura_id          uuid references public.assinatura(id) on delete set null,
  responsavel_id         uuid references public.responsavel(id) on delete set null,
  provedor               text not null default 'asaas',
  provedor_pagamento_id  text not null unique,
  valor_centavos         integer not null check (valor_centavos >= 0),
  metodo                 text check (metodo in ('cartao','pix','boleto')),
  status                 text not null check (status in ('pendente','confirmado','recebido','vencido','estornado','falhou')),
  vencimento             date,
  pago_em                timestamptz,
  nfse_numero            text,
  nfse_url               text,
  criado_em              timestamptz not null default now(),
  atualizado_em          timestamptz not null default now()
);
comment on table public.pagamento is
  'Uma linha por cobrança do provedor. Nunca guarda número de cartão, CPF ou nome: isso fica no provedor.';

create index pagamento_assinatura_idx on public.pagamento (assinatura_id);
create index pagamento_responsavel_idx on public.pagamento (responsavel_id);

create trigger trg_pagamento_atualizado
  before update on public.pagamento
  for each row execute function public.set_atualizado_em();

-- =============================================================================
-- 9. consentimento · prova de cada aceite (termos, privacidade, parental, e-mail)
--    Revogar = nova linha com aceito = false. Nunca se edita nem apaga uma linha.
-- =============================================================================
create table public.consentimento (
  id              bigint generated always as identity primary key,
  responsavel_id  uuid references public.responsavel(id) on delete set null,
  tipo            text not null check (tipo in ('termos','privacidade','parental','relatorio_email')),
  versao          text not null check (versao ~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}[a-z]?$'),  -- ex.: 2026-11-10
  aceito          boolean not null,
  texto_hash      text not null,   -- sha256 do texto exibido na hora (prova do que foi aceito)
  meio            text not null default 'app' check (meio in ('app','email','suporte')),
  user_agent      text check (user_agent is null or char_length(user_agent) <= 200),
  ip_hash         text,            -- sha256(ip + sal do servidor); nunca o IP em claro
  criado_em       timestamptz not null default now()
);
create index consentimento_responsavel_idx on public.consentimento (responsavel_id, tipo, criado_em desc);

-- =============================================================================
-- 10. webhook_evento · idempotência dos avisos do provedor (só service_role)
-- =============================================================================
create table public.webhook_evento (
  id            text primary key,          -- id do evento no provedor
  provedor      text not null default 'asaas',
  tipo          text not null,
  recebido_em   timestamptz not null default now(),
  processado_em timestamptz,
  erro          text
);
comment on table public.webhook_evento is
  'Só o id e o tipo do evento, para não processar duas vezes. O payload NÃO é guardado (tem dado pessoal do pagador).';

-- =============================================================================
-- 11. limite_taxa · contador simples para limitar tentativas (RPC e funções)
-- =============================================================================
create table public.limite_taxa (
  chave          text primary key,          -- ex.: 'sync:<uuid>' ou 'checkout:<uuid>'
  janela_inicio  timestamptz not null default now(),
  contagem       integer not null default 0
);

-- Devolve true se ainda cabe mais uma chamada dentro da janela. SECURITY DEFINER
-- para que o usuário comum não leia nem zere o contador.
create or replace function public.limite_ok(p_chave text, p_max integer, p_janela interval)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_inicio timestamptz;
  v_cont   integer;
begin
  insert into public.limite_taxa (chave, janela_inicio, contagem)
  values (p_chave, now(), 1)
  on conflict (chave) do update
    set contagem      = case when public.limite_taxa.janela_inicio + p_janela < now() then 1 else public.limite_taxa.contagem + 1 end,
        janela_inicio = case when public.limite_taxa.janela_inicio + p_janela < now() then now() else public.limite_taxa.janela_inicio end
  returning janela_inicio, contagem into v_inicio, v_cont;
  return v_cont <= p_max;
end;
$$;
-- limite_ok aceita qualquer chave: só o servidor pode chamar, senão um usuário
-- logado esgotaria o limite de outro perfil passando a chave dele.
revoke all on function public.limite_ok(text, integer, interval) from public, anon, authenticated;
grant execute on function public.limite_ok(text, integer, interval) to service_role;

-- Versão para o usuário logado: a chave é derivada de auth.uid(), nunca vem de fora.
-- Só ações conhecidas; os tetos ficam aqui (configuração), não no app.
create or replace function public.limite_ok_usuario(p_acao text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := (select auth.uid());
begin
  if v_uid is null then return false; end if;
  case p_acao
    when 'sync'   then return public.limite_ok('sync:'   || v_uid::text, 240, interval '1 hour');  -- 4 perfis x 60/h
    when 'export' then return public.limite_ok('export:' || v_uid::text, 5,   interval '1 day');
    else raise exception 'ação de limite desconhecida: %', p_acao;
  end case;
end;
$$;
revoke all on function public.limite_ok_usuario(text) from public, anon;
grant execute on function public.limite_ok_usuario(text) to authenticated, service_role;

-- =============================================================================
-- 12. Privilégios de base
--     O app nunca lê o banco sem login: anon não precisa de nada no schema public.
--     Isso é defesa em profundidade; a RLS do 0002 é a regra principal.
-- =============================================================================
revoke all on all tables    in schema public from anon;
revoke all on all sequences in schema public from anon;
revoke all on all functions in schema public from anon;
alter default privileges in schema public revoke all on tables    from anon;
alter default privileges in schema public revoke all on sequences from anon;
alter default privileges in schema public revoke all on functions from anon;

-- Tabelas que só o servidor toca: nem o usuário logado tem privilégio de tabela.
revoke all on public.webhook_evento from authenticated;
revoke all on public.limite_taxa    from authenticated;
