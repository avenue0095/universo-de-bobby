-- O Universo de Bobby · Fase 4 · 0005_pagamento_so_avanca.sql
-- O estado de uma cobrança só avança, também no banco.
--
-- Por que existe: o Asaas pode entregar avisos fora de ordem (repetição depois
-- de falha, fila retomada). Sem esta regra, PAYMENT_RECEIVED seguido de um
-- PAYMENT_UPDATED atrasado voltava a cobrança para 'pendente' e zerava pago_em,
-- e o pedir-reembolso (que procura cobrança confirmada ou recebida) respondia
-- 404 dentro dos 7 dias do CDC. PAYMENT_REFUNDED seguido de PAYMENT_CONFIRMED
-- atrasado voltava para 'confirmado'.
--
-- Regra (a mesma de supabase/functions/_shared/pagamento.ts, mesclarPagamento):
--   pendente, vencido, falhou (nível 0)  <  confirmado (1)  <  recebido (2)
--   estornado (3) é terminal.
--   Entre os de nível 0, o último aviso vence (vencimento mudou: volta a pendente).
--   Se o aviso recua, status e pago_em ficam os do banco; os outros campos
--   (valor, vencimento, método) seguem o aviso.
--
-- O webhook já aplica a regra antes de gravar. O gatilho cobre o caso de dois
-- avisos da mesma cobrança chegarem ao mesmo tempo (ler e gravar não é atômico
-- pelo PostgREST) e qualquer update feito à mão.
--
-- Como rodar: depois de 0001 a 0004 (supabase db push). Prova no banco:
-- supabase/testes/rls.sql, bloco 17.
-- RLS: nenhuma tabela nova; pagamento continua só leitura para authenticated
-- (0002) e só o servidor grava.
-- =============================================================================

create or replace function public.pagamento_so_avanca()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  -- nível do estado; inline (sem função auxiliar) para o gatilho não depender de grant de execute
  n_old integer := case old.status when 'confirmado' then 1 when 'recebido' then 2 when 'estornado' then 3 else 0 end;
  n_new integer := case new.status when 'confirmado' then 1 when 'recebido' then 2 when 'estornado' then 3 else 0 end;
begin
  if n_new < n_old then   -- estornado tem o nível mais alto: nada passa dele (terminal)
    new.status  := old.status;
    new.pago_em := old.pago_em;
  elsif n_new = 0 then
    new.pago_em := null;
  else
    new.pago_em := coalesce(new.pago_em, old.pago_em);
  end if;
  return new;
end;
$$;

comment on function public.pagamento_so_avanca() is
  'Estado da cobrança só avança: pendente < confirmado < recebido; estornado terminal. Igual a mesclarPagamento (Edge Functions).';

drop trigger if exists trg_pagamento_so_avanca on public.pagamento;
create trigger trg_pagamento_so_avanca
  before update on public.pagamento
  for each row execute function public.pagamento_so_avanca();

-- função de gatilho: o Postgres não confere execute ao disparar; ninguém chama direto.
revoke all on function public.pagamento_so_avanca() from public, anon, authenticated;
