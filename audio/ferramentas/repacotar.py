#!/usr/bin/env python3
"""Reescreve o campo 'pacote' do audio/manifesto.json com a regra de manifesto.py (ajudas faladas em pacote proprio, sob demanda)
e regera o audio/manifesto-min.json a partir dele, sem precisar da pasta de trabalho do gerador.   Uso: python3 audio/ferramentas/repacotar.py"""
import json, os, collections
OUT = os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
def pacote(it):
    c, m = it['classe'], it['materia']
    if any(x in str(it.get('origem', '')) for x in ('dica', 'ajuda', 'resposta')): return 'ajudas'
    if c in ('numero', 'nome', 'pt-letra', 'pt-silaba', 'feedback'): return 'core'
    return m if m in ('mat', 'pt', 'en') else 'core'
man = json.load(open(f'{OUT}/manifesto.json', encoding='utf-8'))
clipes = man['clipes']
mud = 0
for n, c in clipes.items():
    p = pacote(c)
    if c.get('pacote') != p: c['pacote'] = p; mud += 1
json.dump(man, open(f'{OUT}/manifesto.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
pk = collections.defaultdict(list)
for n, c in clipes.items(): pk[c['pacote']].append(n)
mini = dict(v=1, formatos=dict(opus='.opus', m4a='.m4a'), campos='[ms, bytes_opus, bytes_m4a]',
            personagens={n: c['personagem'] for n, c in clipes.items() if c.get('personagem')},
            pacotes={k: {n: [clipes[n]['ms'], clipes[n]['bytes_opus'], clipes[n]['bytes_m4a']] for n in sorted(v)} for k, v in pk.items()})
json.dump(mini, open(f'{OUT}/manifesto-min.json', 'w', encoding='utf-8'), ensure_ascii=False, separators=(',', ':'))
mb = lambda ks: sum(clipes[n]['bytes_m4a'] for k in ks for n in pk[k]) / 1e6
print('repacotados', mud, {k: len(v) for k, v in pk.items()}, 'm4a sem ajudas %.1f MB, ajudas %.1f MB' % (mb(['core', 'mat', 'pt', 'en']), mb(['ajudas'])))
