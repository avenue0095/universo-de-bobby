#!/usr/bin/env python3
# uso: copiar.py ID [--ref]   -> copia o prompt montado (com ajuste A1: ESTILO+NEG nos personagens) para a area de transferencia
import importlib.util, sys, subprocess
from pathlib import Path
raiz = Path(__file__).resolve().parent.parent
spec = importlib.util.spec_from_file_location('mp', raiz/'docs/anexos/montar-prompts.py')
mp = importlib.util.module_from_spec(spec); spec.loader.exec_module(mp)
blocos, prompts, piloto = mp.ler(); mp.expandir(blocos, prompts)
pid = sys.argv[1]; kv = dict(prompts[pid])
if pid.split('-')[0] in ('BOBBY','OTTO','CAPI','TEO','RUFA','BRISA','FAGULHA') and 'ITEM' not in pid:
    kv.setdefault('estilo','ESTILO'); kv.setdefault('neg','NEG')
if '--ref' in sys.argv: kv['ref']='sim'
erros=[]; t = mp.montar(pid, kv, blocos, erros); mp.confere(pid, t, erros)
if erros: print(erros); sys.exit(1)
subprocess.run(['pbcopy'], input=t.encode()); print(pid, len(t.split()), 'palavras copiadas; ar', kv.get('ar'))
