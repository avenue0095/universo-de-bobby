#!/usr/bin/env python3
import json, os, csv, hashlib, datetime, collections, re
ROOT = os.environ.get('BOBBY_TRABALHO', os.path.expanduser('~/bobby-audio-trabalho'))
OUT = os.environ.get('BOBBY_AUDIO', os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')))
items = json.load(open(f'{ROOT}/items.json'))
med = {m['id']: m for m in json.load(open(f'{ROOT}/medidas.json'))}
post = {p['id']: p for p in json.load(open(f'{ROOT}/post_res.json'))} if os.path.exists(f'{ROOT}/post_res.json') else {}
VOZ = {'pt-br': dict(motor='kokoro-onnx v1.0 (int8)', voz='pm_alex', velocidade=0.9, lang='pt-br'),
       'en-us': dict(motor='kokoro-onnx v1.0 (int8)', voz='am_michael', velocidade=0.9, lang='en-us')}
def pacote(it):
    c, m = it['classe'], it['materia']
    if c in ('numero', 'nome', 'pt-letra', 'pt-silaba', 'feedback'): return 'core'
    return m if m in ('mat', 'pt', 'en') else 'core'
clipes = {}; mapa = {}
for it in items:
    nome = it['id']; m = med[nome]
    lang = it['segs'][0][0] if len({s[0] for s in it['segs']}) == 1 else 'misto'
    langs = sorted({s[0] for s in it['segs']})
    h = hashlib.sha256((it['classe'] + '\n' + it['texto']).encode()).hexdigest()[:16]
    e = dict(arquivo=nome, texto=it['texto'], fala=' | '.join(f'[{a}] {b}' for a, b in it['segs']) if len(it['segs']) > 1 or it['segs'][0][1] != it['texto'] else None,
             idioma=it['idioma'], vozes={l: VOZ[l]['voz'] for l in langs}, velocidade=0.9, classe=it['classe'], materia=it['materia'], pacote=pacote(it),
             ms=int(round(m['opus']['dur'] * 1000)), bytes_opus=m['opus']['bytes'], bytes_m4a=m['m4a']['bytes'], hash_texto=h,
             origem=it['origem'], no_inventario=it['inventario'])
    if it.get('personagem'): e['personagem'] = it['personagem']; e['situacao'] = it.get('situacao')
    if e['fala'] is None: del e['fala']
    clipes[nome] = e
    mapa.setdefault(it['classe'] + '|' + it['idioma'] + '|' + it['texto'], nome)
tot = lambda k: sum(c[k] for c in clipes.values())
man = dict(v=1, gerado_em=datetime.datetime.now().astimezone().isoformat(timespec='seconds'),
           vozes=VOZ, formatos=dict(opus=dict(codec='Opus', bitrate='24k', canais=1, ext='.opus', bytes=tot('bytes_opus')),
                                    m4a=dict(codec='AAC-LC', bitrate='24k', canais=1, ext='.m4a', bytes=tot('bytes_m4a'))),
           normalizacao=dict(alvo_lufs=-16, teto_pico_dbfs=-1.5, metodo='ebur128 + ganho + alimiter'),
           preenchimento_ms=dict(frase=[150, 250], encaixe=[30, 60], palavra_en=[150, 300]),
           total_clipes=len(clipes), duracao_total_ms=tot('ms'),
           nota='Chave do mapa = arquivo sem extensao, relativo a audio/. Troque a extensao por .opus ou .m4a. mapa_texto: classe|idioma|texto -> arquivo.',
           nao_gerados=(lambda L: dict(quantos=len(L), motivo='cauda longa: a "Ajuda extra" e a dica depois do erro juntam a resposta (muitas vezes por extenso) ao texto do metodo num quadro so, sem corte na pontuacao; sao combinacoes quase infinitas e so entram os quadros que aparecem em todas as varreduras de um trio de semeaduras', exemplos=[x['texto'][:120] for x in L[:12]], textos=[x['texto'] for x in L]))(json.load(open(f'{ROOT}/nao_gerados.json')) if os.path.exists(f'{ROOT}/nao_gerados.json') else []),
           ignorados=[dict(arquivo=i['id'], texto=i['texto'], motivo='quadro que e so lacuna (sublinhados), sem texto falavel') for i in json.load(open(f'{ROOT}/ignorados.json'))],
           clipes=clipes, mapa_texto=mapa)
json.dump(man, open(f'{OUT}/manifesto.json', 'w'), ensure_ascii=False, indent=1)
# versao enxuta para o app (spec 9.4): pacotes + {ms, b}
pk = collections.defaultdict(list)
for n, c in clipes.items(): pk[c['pacote']].append(n)
mini = dict(v=1, formatos=dict(opus='.opus', m4a='.m4a'), campos='[ms, bytes_opus, bytes_m4a]',
            personagens={n: c['personagem'] for n, c in clipes.items() if c.get('personagem')},
            pacotes={k: {n: [clipes[n]['ms'], clipes[n]['bytes_opus'], clipes[n]['bytes_m4a']] for n in sorted(v)} for k, v in pk.items()})
json.dump(mini, open(f'{OUT}/manifesto-min.json', 'w'), ensure_ascii=False, separators=(',', ':'))
print('clipes', len(clipes), 'opus MB', tot('bytes_opus') / 1e6, 'm4a MB', tot('bytes_m4a') / 1e6, 'horas', tot('ms') / 3.6e6)
print({k: len(v) for k, v in pk.items()}, 'min KB', os.path.getsize(f'{OUT}/manifesto-min.json') / 1024)
