#!/usr/bin/env python3
"""Mede cada arquivo final (opus e m4a) e gera audio/manifesto.json + audio/manifesto-min.json + relatorio de cobertura."""
import json, os, re, subprocess, hashlib, sys, csv, datetime, collections
from multiprocessing import Pool
ROOT = os.environ.get('BOBBY_TRABALHO', os.path.expanduser('~/bobby-audio-trabalho'))   # items.json, wav/, medidas.json (nao fica no repositorio)
OUT = os.environ.get('BOBBY_AUDIO', os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')))
items = json.load(open(f'{ROOT}/items.json'))

def medir(it):
    nome = it['id']; r = dict(id=nome)
    for ext in ('opus', 'm4a'):
        p = f'{OUT}/{nome}.{ext}'
        if not os.path.exists(p): r[ext] = None; continue
        c = subprocess.run(['ffmpeg', '-hide_banner', '-nostats', '-i', p, '-af', 'volumedetect,silencedetect=n=-45dB:d=0.9,ebur128=peak=true', '-f', 'null', '-'], capture_output=True, text=True).stderr
        d = re.search(r'Duration: (\d+):(\d+):([\d.]+)', c)
        dur = int(d.group(1)) * 3600 + int(d.group(2)) * 60 + float(d.group(3)) if d else 0
        mv = re.search(r'mean_volume: (-?[\d.]+) dB', c); mx = re.search(r'max_volume: (-?[\d.]+) dB', c)
        I = re.search(r'Integrated loudness:\s*\n\s*I:\s*(-?[\d.]+) LUFS', c)
        sil = [float(x) for x in re.findall(r'silence_duration: ([\d.]+)', c)]
        # silencios internos: o ultimo costuma ser a cauda de preenchimento, o primeiro a cabeca; so conta se for >0.9 s
        r[ext] = dict(bytes=os.path.getsize(p), dur=round(dur, 3), mean=float(mv.group(1)) if mv else None, max=float(mx.group(1)) if mx else None,
                      lufs=float(I.group(1)) if I else None, silencios=sil)
    return r

if __name__ == '__main__':
    with Pool(int(os.environ.get('NPROC', '4'))) as p:
        med = p.map(medir, items, chunksize=8)
    M = {m['id']: m for m in med}
    json.dump(med, open(f'{ROOT}/medidas.json', 'w'))
    print('medidas ok')
