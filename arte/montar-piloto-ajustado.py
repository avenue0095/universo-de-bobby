#!/usr/bin/env python3
# Ajuste A1 (24/10/2026): os prompts de personagem do piloto saiam sem ESTILO e sem NEG
# (a biblia so declara ident+fundo). Aqui entram ESTILO e NEG nos personagens. Resto igual.
import importlib.util, sys, json
from pathlib import Path
raiz = Path(__file__).resolve().parent.parent
spec = importlib.util.spec_from_file_location('mp', raiz/'docs/anexos/montar-prompts.py')
mp = importlib.util.module_from_spec(spec); spec.loader.exec_module(mp)
blocos, prompts, piloto = mp.ler(); mp.expandir(blocos, prompts)
out = {}
for pid in piloto:
    kv = dict(prompts[pid])
    if pid.split('-')[0] in ('BOBBY','OTTO','CAPI','TEO','RUFA','BRISA','FAGULHA') and 'ITEM' not in pid:
        kv.setdefault('estilo','ESTILO'); kv.setdefault('neg','NEG')
    erros=[]; out[pid]=mp.montar(pid, kv, blocos, erros)
    if erros: print(erros)
(raiz/'arte/prompts-piloto-ajustado.json').write_text(json.dumps(out, ensure_ascii=True, indent=1))
print({k:len(v.split()) for k,v in out.items()})
