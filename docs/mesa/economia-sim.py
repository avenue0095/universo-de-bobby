#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Simulação da economia do Bobby em 180 dias (mesa de especialistas, 24/10/2026).

Compara dois cenários para três perfis de criança:
  - ATUAL:    só o que existe hoje (6 companheiros 500 a 2.500 e 7 looks 150 a 900).
  - PROPOSTO: catálogo da seção (b) de docs/mesa/01-economia.md, com portões por conquista,
              loja semanal rotativa (com lista de desejos, sem estoque falso) e sumidouros sem teto.

As constantes de ganho são as REAIS do app (src/interface/economia.js): 10 por acerto, +5 a cada 3 seguidos,
+20 por fase perfeita de 8, baú do dia conforme docs/FASE-2-especificacao.md seção 5.4.
Tudo que é hipótese está marcado com "OPINIÃO" no comentário. Rodar: python3 docs/mesa/economia-sim.py
Não toca em nada do app; é só leitura de números.
"""
import random
from collections import defaultdict

DIAS = 180
ECON = dict(ganhoAcerto=10, bonusSequencia=5, sequenciaDe=3, bonusFasePerfeita=20)

# Baú do dia (FASE-2 §5.4): moedas por valor da ofensiva nos 30 primeiros dias; depois, OPINIÃO: 15 em dia comum,
# marco a cada 10 dias dá item (0 moedas).
BAU_30 = {2: 10, 6: 10, 11: 15, 15: 15, 18: 15, 22: 20, 26: 20}
def bau(ofensiva):
    if ofensiva <= 30:
        return BAU_30.get(ofensiva, 0)
    return 0 if ofensiva % 10 == 0 else 15

# Perfis (OPINIÃO: calibrar com as primeiras famílias). perguntas/dia = meta escolhida pelo responsável.
PERFIS = {
    "fraca": dict(acerto=0.65, perguntas=15, dias_semana=4.0, fases_novas_por_bloco=0.5),
    "media": dict(acerto=0.80, perguntas=20, dias_semana=5.5, fases_novas_por_bloco=0.6),
    "forte": dict(acerto=0.90, perguntas=35, dias_semana=6.5, fases_novas_por_bloco=0.7),
}

# ---------------------------------------------------------------- catálogo
# Cada item: id, grupo, preco, portao (função do estado -> bool), prateleira ('fixa' | 'rotativa'), prioridade (menor = compra antes).
# Portões por conquista: dias_vivos, etapas (de 30), fases_com_companheiro, planeta_pct.
def item(id_, grupo, preco, prio, portao=lambda s: True, prateleira="fixa"):
    return dict(id=id_, grupo=grupo, preco=preco, prio=prio, portao=portao, prateleira=prateleira)

def catalogo_atual():
    c = []
    for n, p in dict(teo=500, rufa=900, otto=1000, capi=1500, brisa=2000, fagulha=2500).items():
        c.append(item("comp-" + n, "companheiro", p, 1))
    for n, p in dict(explorador=150, bone=200, oculos=250, lenco=300, capacete=450, capa=600, coroa=900).items():
        c.append(item("look-" + n, "look", p, 2))
    return c

def catalogo_proposto():
    c = []
    # Prateleira fixa -------------------------------------------------
    # Looks do Bobby: os 7 de hoje + 5 novos (arte falta), preços sobem com o tempo de jogo.
    for n, p in dict(explorador=150, bone=200, oculos=250, lenco=300, capacete=450, capa=600, coroa=900).items():
        c.append(item("look-" + n, "look", p, 3))
    for n, p, dv in [("traje-espacial", 500, 14), ("mochila-foguete", 600, 21), ("capa-estelar", 800, 45),
                     ("escafandro", 900, 60), ("coroa-constelacao", 1000, 90)]:
        c.append(item("look-" + n, "look", p, 5, (lambda d: lambda s: s["dias_vivos"] >= d)(dv)))
    # Companheiros: guias (Teo, Rufa, Otto) sem portão; coringas por marco.
    c.append(item("comp-teo", "companheiro", 500, 1))
    c.append(item("comp-rufa", "companheiro", 900, 1))
    c.append(item("comp-otto", "companheiro", 1000, 1))
    c.append(item("comp-capi", "companheiro", 1500, 2, lambda s: s["dias_vivos"] >= 14))
    c.append(item("comp-brisa", "companheiro", 2000, 2, lambda s: s["fases_perfeitas"] >= 10))
    c.append(item("comp-fagulha", "companheiro", 2500, 2, lambda s: s["dias_vivos"] >= 30))
    # Amizade do companheiro (2 níveis por companheiro, arte: overlay por nível). Portão: fases jogadas com ele.
    for n in ["teo", "rufa", "otto", "capi", "brisa", "fagulha"]:
        c.append(item("amiz2-" + n, "amizade", 800, 3,
                      (lambda nn: lambda s: ("comp-" + nn) in s["tem"] and s["fases_com"][nn] >= 20)(n)))
        c.append(item("amiz3-" + n, "amizade", 1600, 6,
                      (lambda nn: lambda s: ("amiz2-" + nn) in s["tem"] and s["fases_com"][nn] >= 60)(n)))
    # Pistas de história: 1 página do diário por etapa concluída (texto e áudio, sem arte nova).
    for e in range(1, 31):
        c.append(item("pista-%02d" % e, "pista", 100, 7, (lambda ee: lambda s: s["etapas"] >= ee)(e)))
    # Prateleira rotativa (ciclo de 12 semanas, 4 itens por semana, lista de desejos trava o item) ------
    rot = []
    for i in range(1, 25):   # decoração da nave do Bobby (hub)
        rot.append(item("nave-%02d" % i, "nave", 150 + 50 * (i % 6), 8, lambda s: s["etapas"] >= 1, "rotativa"))
    for pl in ["numeral", "fabula", "horizonte"]:  # decoração do planeta: 3 peças por planeta, por % do planeta
        for k, (p, pct) in enumerate([(400, 30), (700, 60), (1000, 100)]):
            rot.append(item("planeta-%s-%d" % (pl, k + 1), "planeta", p, 4,
                            (lambda pp, pc: lambda s: s["planeta_pct"][pp] >= pc)(pl, pct), "rotativa"))
    for i, p in enumerate([250, 300, 400, 500, 600]):  # molduras compráveis (3 outras só por marco)
        rot.append(item("moldura-%d" % (i + 1), "moldura", p, 10, lambda s: s["dias_vivos"] >= 7, "rotativa"))
    for i, p in enumerate([300, 400, 500, 600, 700]):  # trilhas de brilho no mapa
        rot.append(item("trilha-%d" % (i + 1), "trilha", p, 11, lambda s: s["dias_vivos"] >= 14, "rotativa"))
    for i in range(1, 37):  # adesivos comuns do álbum (24 raros/lendários vêm por marco, sem moeda)
        rot.append(item("adesivo-%02d" % i, "adesivo", 80, 12, lambda s: True, "rotativa"))
    # distribui a rotativa em 12 semanas (determinístico), 4 por semana ~ 48 vagas por ciclo; sobra vai para o 2º ciclo
    random.Random(7).shuffle(rot)
    for k, it in enumerate(rot):
        it["semana"] = k % 12
    return c + rot

# ---------------------------------------------------------------- simulação
def simula(perfil, catalogo, seed, proposto):
    rnd = random.Random(seed)
    P = PERFIS[perfil]
    s = dict(moedas=0, ganho_total=0, gasto_total=0, dias_vivos=0, etapas=0, fases=0.0, fases_perfeitas=0,
             tem=set(), fases_com=defaultdict(int), planeta_pct=dict(numeral=0, fabula=0, horizonte=0),
             desejos=set(), estrelas=0, petiscos=0, compras=[], ofensiva=0, cofrinho=0)
    gasto_por_grupo = defaultdict(int)
    marcos = {}
    equipado = None
    saldo_em = {}
    for dia in range(1, DIAS + 1):
        joga = rnd.random() < P["dias_semana"] / 7.0
        if not joga:
            saldo_em[dia] = s["moedas"]
            continue
        s["dias_vivos"] += 1
        s["ofensiva"] += 1  # simplificação: congelador cobre faltas curtas (OPINIÃO)
        ganho = bau(s["ofensiva"])
        restantes = P["perguntas"]
        while restantes > 0:
            n = min(8, restantes); restantes -= n
            combo = 0; erros = 0
            for _ in range(n):
                if rnd.random() < P["acerto"]:
                    combo += 1; ganho += ECON["ganhoAcerto"]
                    if combo >= ECON["sequenciaDe"] and combo % ECON["sequenciaDe"] == 0:
                        ganho += ECON["bonusSequencia"]
                else:
                    combo = 0; erros += 1
            if n == 8 and erros == 0:
                ganho += ECON["bonusFasePerfeita"]; s["fases_perfeitas"] += 1
            # progresso de conteúdo: parte dos blocos é fase nova, o resto é revisão
            if rnd.random() < P["fases_novas_por_bloco"]:
                s["fases"] += 1
                if equipado: s["fases_com"][equipado] += 1
        s["moedas"] += ganho; s["ganho_total"] += ganho
        # 150 fases novas = 30 etapas de 5 fases; conteúdo acaba quando etapas = 30
        s["etapas"] = min(30, int(s["fases"] // 5))
        for i, pl in enumerate(["numeral", "fabula", "horizonte"]):
            # a criança alterna matérias: cada planeta avança 1/3 (OPINIÃO)
            s["planeta_pct"][pl] = min(100, int(s["etapas"] / 30 * 100))
        semana = (s["dias_vivos"] - 1) // 7 % 12

        # --- gastos
        def disponivel(it):
            if it["id"] in s["tem"] or not it["portao"](s):
                return False
            if it["prateleira"] == "rotativa" and proposto:
                return it["semana"] == semana or it["id"] in s["desejos"]
            return True
        # lista de desejos: a criança marca o item mais caro visível da semana que ainda não consegue pagar (OPINIÃO)
        if proposto:
            for it in catalogo:
                if it["prateleira"] == "rotativa" and it["semana"] == semana and it["id"] not in s["tem"] \
                        and it["portao"](s) and it["preco"] > s["moedas"] and len(s["desejos"]) < 3:
                    s["desejos"].add(it["id"])
        # petisco diário (20 moedas) se tem companheiro: recorrente, sem decaimento, conta 1 por dia
        if proposto and equipado and (s["moedas"] - s["cofrinho"]) >= 20:
            s["moedas"] -= 20; s["gasto_total"] += 20; s["petiscos"] += 1; gasto_por_grupo["petisco"] += 20
        # Política de compra = "cofrinho" (só no PROPOSTO): a criança escolhe uma meta grande (o próximo companheiro,
        # amizade, peça de planeta ou look acima de 500) e METADE do ganho do dia vai para o cofrinho dela (OPINIÃO: 50%;
        # é o que a tela do cofrinho sugere, nada é travado). Itens pequenos saem só do bolso. Sem meta, tudo é bolso.
        # No cenário ATUAL não há cofrinho: compra o que der, do mais barato ao mais caro (comportamento de hoje).
        def eh_grande(it):
            return it["grupo"] in ("companheiro", "amizade", "planeta") or it["preco"] > 500
        grandes = [it for it in sorted(catalogo, key=lambda x: (x["prio"], x["preco"])) if disponivel(it) and eh_grande(it)]
        meta = grandes[0] if (proposto and grandes) else None
        if meta:
            dep = ganho // 2; s["cofrinho"] += dep
        else:
            s["cofrinho"] = 0  # sem meta o dinheiro fica todo no bolso
        bolso = s["moedas"] - s["cofrinho"]
        grande = False
        for it in sorted(catalogo, key=lambda x: (x["prio"], x["preco"])):
            if not disponivel(it) or it["preco"] > s["moedas"]:
                continue
            if eh_grande(it):
                if grande or (proposto and it is not meta): continue
                grande = True
            elif proposto and it["preco"] > bolso:
                continue  # o cofrinho não paga item pequeno
            s["moedas"] -= it["preco"]; s["gasto_total"] += it["preco"]; s["tem"].add(it["id"])
            gasto_por_grupo[it["grupo"]] += it["preco"]; s["desejos"].discard(it["id"])
            s["compras"].append((dia, it["id"], it["preco"]))
            if eh_grande(it):
                s["cofrinho"] = max(0, s["cofrinho"] - it["preco"]); meta = None
            else:
                bolso -= it["preco"]
            s["cofrinho"] = min(s["cofrinho"], s["moedas"])
            if it["grupo"] == "companheiro" and equipado is None:
                equipado = it["id"].split("-")[1]
        # sumidouro sem teto: céu estrelado (100 por estrela) quando sobra muito e não há nada comprável
        if proposto and s["moedas"] >= 3000 and not any(disponivel(it) and it["preco"] <= s["moedas"] for it in catalogo):
            n = (s["moedas"] - 2000) // 100
            s["moedas"] -= 100 * n; s["gasto_total"] += 100 * n; s["estrelas"] += n; gasto_por_grupo["estrela"] += 100 * n
        saldo_em[dia] = s["moedas"]
        for m in (30, 90, 180):
            if dia == m: marcos[m] = dict(saldo=s["moedas"], ganho=s["ganho_total"], gasto=s["gasto_total"], tem=len(s["tem"]))
    # "nada mais para comprar": primeiro dia em que todo item do catálogo com portão aberto já foi comprado e sobra > 0
    compraveis = [it for it in catalogo]
    dia_fim_catalogo = None
    acumulado = set()
    for dia, idd, _ in s["compras"]:
        acumulado.add(idd)
        if len(acumulado) == len(compraveis):
            dia_fim_catalogo = dia; break
    return dict(perfil=perfil, s=s, marcos=marcos, grupo=dict(gasto_por_grupo), saldo_em=saldo_em,
                dia_fim_catalogo=dia_fim_catalogo, n_catalogo=len(compraveis))

def media_de(perfil, catalogo, proposto, n=200):
    rs = [simula(perfil, catalogo, 1000 + i, proposto) for i in range(n)]
    def med(f):
        v = [f(r) for r in rs if f(r) is not None]
        return sum(v) / len(v) if v else None
    out = dict(perfil=perfil,
               ganho=med(lambda r: r["s"]["ganho_total"]), gasto=med(lambda r: r["s"]["gasto_total"]),
               saldo=med(lambda r: r["s"]["moedas"]), dias_vivos=med(lambda r: r["s"]["dias_vivos"]),
               etapas=med(lambda r: r["s"]["etapas"]), itens=med(lambda r: len(r["s"]["tem"])),
               n_catalogo=rs[0]["n_catalogo"], estrelas=med(lambda r: r["s"]["estrelas"]), petiscos=med(lambda r: r["s"]["petiscos"]),
               fim_catalogo=med(lambda r: r["dia_fim_catalogo"]),
               pct_fim=sum(1 for r in rs if r["dia_fim_catalogo"]) / len(rs),
               marcos={m: {k: med(lambda r, mm=m, kk=k: r["marcos"].get(mm, {}).get(kk)) for k in ("saldo", "ganho", "gasto", "tem")} for m in (30, 90, 180)},
               grupo={})
    for g in set(k for r in rs for k in r["grupo"]):
        out["grupo"][g] = med(lambda r, gg=g: r["grupo"].get(gg, 0))
    # dia médio da 1ª compra por grupo e das compras-chave
    def primeiro(prefixo):
        v = []
        for r in rs:
            d = [dia for dia, idd, _ in r["s"]["compras"] if idd.startswith(prefixo)]
            if d: v.append(min(d))
        return (sum(v) / len(v), len(v) / len(rs)) if v else (None, 0)
    out["primeiros"] = {p: primeiro(p) for p in ["comp-teo", "comp-rufa", "comp-otto", "comp-capi", "comp-brisa", "comp-fagulha",
                                                  "look-coroa", "amiz2-", "amiz3-", "planeta-", "trilha-", "moldura-", "nave-"]}
    return out

def fmt(x, dec=0):
    if x is None: return "nunca"
    return ("{:,.%df}" % dec).format(x).replace(",", ".")

def imprime(titulo, res):
    print("\n" + "=" * 96); print(titulo); print("=" * 96)
    print("%-8s %10s %10s %10s %8s %8s %12s %14s" % ("perfil", "ganho", "gasto", "sobra", "dias", "etapas", "itens/catal.", "catálogo zerou"))
    for r in res:
        fim = "dia %s (%d%% das simulações)" % (fmt(r["fim_catalogo"]), round(100 * r["pct_fim"])) if r["fim_catalogo"] else "não zerou"
        print("%-8s %10s %10s %10s %8s %8s %12s %14s" % (r["perfil"], fmt(r["ganho"]), fmt(r["gasto"]), fmt(r["saldo"]),
                                                       fmt(r["dias_vivos"]), fmt(r["etapas"], 1), "%s/%d" % (fmt(r["itens"]), r["n_catalogo"]), fim))
    print("\nSaldo parado (moedas sem uso) em 30 / 90 / 180 dias:")
    for r in res:
        print("  %-7s" % r["perfil"], " | ".join("dia %d: sobra %s de %s ganhas" % (m, fmt(r["marcos"][m]["saldo"]), fmt(r["marcos"][m]["ganho"])) for m in (30, 90, 180)))
    print("\nDia médio da compra (e % das simulações em que aconteceu até o dia 180):")
    for r in res:
        partes = []
        for k, (d, p) in r["primeiros"].items():
            if d is not None: partes.append("%s=%s (%d%%)" % (k.rstrip("-"), fmt(d), round(100 * p)))
        print("  %-7s" % r["perfil"], ", ".join(partes))
    print("\nOnde o dinheiro foi (média por grupo):")
    for r in res:
        print("  %-7s" % r["perfil"], ", ".join("%s %s" % (g, fmt(v)) for g, v in sorted(r["grupo"].items(), key=lambda kv: -kv[1])),
              "| petiscos %s, estrelas %s" % (fmt(r["petiscos"]), fmt(r["estrelas"])))

if __name__ == "__main__":
    atual = catalogo_atual(); prop = catalogo_proposto()
    print("Catálogo ATUAL: %d itens, soma %s moedas" % (len(atual), fmt(sum(i["preco"] for i in atual))))
    print("Catálogo PROPOSTO: %d itens comprados com moeda, soma %s moedas (fora petisco e céu estrelado, que não têm teto)"
          % (len(prop), fmt(sum(i["preco"] for i in prop))))
    tot = {}
    for it in prop: tot[it["grupo"]] = tot.get(it["grupo"], 0) + it["preco"]
    print("  por grupo: " + ", ".join("%s %s" % (g, fmt(v)) for g, v in sorted(tot.items(), key=lambda kv: -kv[1])))
    imprime("CENÁRIO ATUAL (6 companheiros + 7 looks), 180 dias, média de 200 simulações por perfil",
            [media_de(p, atual, False) for p in PERFIS])
    imprime("CENÁRIO PROPOSTO (catálogo da seção b, portões por conquista, loja rotativa com lista de desejos), 180 dias",
            [media_de(p, prop, True) for p in PERFIS])
