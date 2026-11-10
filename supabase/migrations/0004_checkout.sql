-- =============================================================================
-- O Universo de Bobby · Fase 4 · 0004_checkout.sql
-- Liga a assinatura do Bobby ao Checkout do Asaas.
--
-- Por que existe: o Asaas exige nome e CPF para criar um cliente pela API
-- (POST /v3/customers, campos obrigatórios name e cpfCnpj; fonte:
-- https://docs.asaas.com/reference/criar-novo-cliente). O Bobby não guarda nome
-- nem CPF (ARQUITETURA.md 5.1 e 8). Por isso a assinatura nasce num Checkout
-- hospedado pelo Asaas (POST /v3/checkouts com chargeTypes RECURRENT; fonte:
-- https://docs.asaas.com/docs/checkout-com-assinatura-recorrente), onde o
-- responsável digita os dados dele na página do provedor. O id do Checkout é o
-- que liga a assinatura do Bobby à assinatura que o Asaas cria depois do pagamento.
--
-- Como rodar: depois de 0001, 0002 e 0003 (supabase db push).
-- Só servidor grava aqui (0002: assinatura sem política de escrita).
-- =============================================================================

alter table public.assinatura
  add column if not exists provedor_checkout_id text unique;

comment on column public.assinatura.provedor_checkout_id is
  'Id do Checkout do provedor que originou a assinatura. Liga o webhook à família antes de existir provedor_assinatura_id.';
