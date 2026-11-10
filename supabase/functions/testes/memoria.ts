// Banco em memória com as MESMAS regras que o SQL impõe e que as funções dependem:
//   * assinatura_vigente_unica: uma só assinatura pendente/ativa/atrasada por família (0001);
//   * pagamento.provedor_pagamento_id único (upsert);
//     (o gatilho pagamento_so_avanca da 0005 NÃO é imitado aqui de propósito: assim o
//     teste prova que o webhook já aplica a regra sozinho, por mesclarPagamento)
//   * webhook_evento.id é a chave (idempotência);
//   * limite_ok: contador por chave dentro da janela (0001).
// Serve só para os testes; a implementação real é RepositorioPostgrest.

import type { Assinatura, FiltroAssinatura, NovaAssinatura, Pagamento, Repositorio } from '../_shared/repositorio.ts';

export class RepositorioMemoria implements Repositorio {
  assinaturas: Assinatura[] = [];
  pagamentos: Pagamento[] = [];
  eventos = new Map<string, { tipo: string; processado_em: string | null; erro: string | null }>();
  consentimentos: { responsavel_id: string; tipo: string; aceito: boolean }[] = [];
  contadores = new Map<string, number>();
  falharEm: string | null = null;   // nome do método que deve lançar (simula banco fora do ar)
  private seq = 0;

  private talvezFalhe(m: string) { if (this.falharEm === m) throw new Error('banco respondeu 503'); }

  limiteOk(chave: string, max: number, _janela: string): Promise<boolean> {
    this.talvezFalhe('limiteOk');
    const n = (this.contadores.get(chave) ?? 0) + 1;
    this.contadores.set(chave, n);
    return Promise.resolve(n <= max);
  }

  consentimentosAceitos(uid: string): Promise<Set<string>> {
    const ok = new Set<string>(), visto = new Set<string>();
    for (const c of [...this.consentimentos].reverse()) {   // o mais novo primeiro
      if (c.responsavel_id !== uid || visto.has(c.tipo)) continue;
      visto.add(c.tipo);
      if (c.aceito) ok.add(c.tipo);
    }
    return Promise.resolve(ok);
  }

  aceitarTudo(uid: string) {
    for (const tipo of ['termos', 'privacidade', 'parental']) this.consentimentos.push({ responsavel_id: uid, tipo, aceito: true });
  }

  assinaturaDoResponsavel(uid: string): Promise<Assinatura | null> {
    const l = this.assinaturas.filter((a) => a.responsavel_id === uid && ['pendente', 'ativa', 'atrasada', 'cancelada'].includes(a.status));
    return Promise.resolve(l.length ? { ...l[l.length - 1] } : null);
  }

  inserirAssinatura(n: NovaAssinatura): Promise<Assinatura> {
    if (['pendente', 'ativa', 'atrasada'].includes(n.status) &&
      this.assinaturas.some((a) => a.responsavel_id === n.responsavel_id && ['pendente', 'ativa', 'atrasada'].includes(a.status))) {
      throw new Error('banco respondeu 409');   // assinatura_vigente_unica
    }
    const a: Assinatura = {
      id: '00000000-0000-4000-8000-' + String(++this.seq).padStart(12, '0'), provedor: 'asaas', provedor_cliente_id: null,
      provedor_assinatura_id: null, provedor_checkout_id: null, inicio_em: null, acesso_ate: null, cancelada_em: null,
      motivo_cancelamento: null, criado_em: new Date().toISOString(), ...n,
    };
    this.assinaturas.push(a);
    return Promise.resolve({ ...a });
  }

  atualizarAssinatura(id: string, patch: Partial<Assinatura>): Promise<void> {
    this.talvezFalhe('atualizarAssinatura');
    const a = this.assinaturas.find((x) => x.id === id);
    if (a) Object.assign(a, patch);
    return Promise.resolve();
  }

  buscarAssinatura(f: FiltroAssinatura): Promise<Assinatura | null> {
    const [k, v] = Object.entries(f)[0] as [keyof Assinatura, string];
    const a = this.assinaturas.find((x) => x[k] === v);
    return Promise.resolve(a ? { ...a } : null);
  }

  registrarEvento(id: string, tipo: string): Promise<'novo' | 'ja_processado' | 'reprocessar'> {
    this.talvezFalhe('registrarEvento');
    const e = this.eventos.get(id);
    if (!e) { this.eventos.set(id, { tipo, processado_em: null, erro: null }); return Promise.resolve('novo'); }
    return Promise.resolve(e.processado_em ? 'ja_processado' : 'reprocessar');
  }

  concluirEvento(id: string, erro: string | null): Promise<void> {
    const e = this.eventos.get(id)!;
    if (erro) e.erro = erro; else { e.processado_em = new Date().toISOString(); e.erro = null; }
    return Promise.resolve();
  }

  salvarPagamento(p: Pagamento): Promise<void> {
    this.talvezFalhe('salvarPagamento');
    const i = this.pagamentos.findIndex((x) => x.provedor_pagamento_id === p.provedor_pagamento_id);
    if (i >= 0) this.pagamentos[i] = { ...this.pagamentos[i], ...p }; else this.pagamentos.push({ ...p });
    return Promise.resolve();
  }

  buscarPagamento(id: string): Promise<Pagamento | null> {
    this.talvezFalhe('buscarPagamento');
    const p = this.pagamentos.find((x) => x.provedor_pagamento_id === id);
    return Promise.resolve(p ? { ...p } : null);
  }

  pagamentosDaAssinatura(id: string): Promise<Pagamento[]> {
    return Promise.resolve(this.pagamentos.filter((p) => p.assinatura_id === id).map((p) => ({ ...p })));
  }
}
