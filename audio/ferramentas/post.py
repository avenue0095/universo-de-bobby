#!/usr/bin/env python3
"""Pos-processa wav/ -> /Users/.../universo-de-bobby/audio/<lang>/<classe>/<nome>.opus (+ .m4a). Retomavel (pula o que ja existe, a menos de --refazer)."""
import sys, os, json, wave, hashlib, subprocess, re, tempfile, shutil
import numpy as np
from multiprocessing import Pool
ROOT = os.environ.get('BOBBY_TRABALHO', os.path.expanduser('~/bobby-audio-trabalho'))   # items.json, wav/, medidas.json (nao fica no repositorio)
OUT = os.environ.get('BOBBY_AUDIO', os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')))
TARGET = -15.2   # compensa ~0.8 LU que o limitador tira
PEAK_MAX = -1.5          # dBFS
SR = 24000
OPUS_K = os.environ.get('OPUS_K', '24k')
AAC_K = os.environ.get('AAC_K', '32k')
PADS = {'frase': (0.150, 0.250), 'encaixe': (0.030, 0.060), 'palavra-en': (0.150, 0.300)}

def wid(i): return hashlib.sha1(i.encode()).hexdigest()[:16]
def lerwav(p):
    with wave.open(p, 'rb') as w:
        return np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(np.float32) / 32768.0, w.getframerate()
def gravawav(p, a):
    with wave.open(p, 'wb') as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((np.clip(a, -1, 1) * 32767).astype(np.int16).tobytes())

def limites(a):
    """primeiro e ultimo trecho com voz (quadros de 10 ms, limiar -48 dBFS RMS), com margem de 15 ms"""
    f = int(SR * 0.01); n = len(a) // f
    if n == 0: return 0, len(a)
    rms = np.sqrt((a[:n * f].reshape(n, f) ** 2).mean(axis=1) + 1e-12)
    voz = np.where(rms > 10 ** (-48 / 20))[0]
    if len(voz) == 0: return 0, 0
    ini = max(0, voz[0] * f - int(SR * 0.015)); fim = min(len(a), (voz[-1] + 1) * f + int(SR * 0.025))
    return ini, fim

def lufs(a):
    x = a
    while len(x) < SR * 2.0: x = np.concatenate([x, a])
    with tempfile.TemporaryDirectory() as d:
        p = d + '/m.wav'; gravawav(p, x)
        r = subprocess.run(['ffmpeg', '-hide_banner', '-nostats', '-i', p, '-af', 'ebur128=peak=true', '-f', 'null', '-'], capture_output=True, text=True)
    m = re.search(r'Integrated loudness:\s*\n\s*I:\s*(-?[\d.]+|-inf) LUFS', r.stderr)
    if not m or m.group(1) == '-inf': return None
    return float(m.group(1))

def um(it):
    nome = it['id']; lg_dir = nome
    dop = f'{OUT}/{nome}.opus'; dam = f'{OUT}/{nome}.m4a'
    if os.path.exists(dop) and os.path.exists(dam) and not os.environ.get('REFAZER'):
        return dict(id=nome, pulado=True)
    src = f'{ROOT}/wav/{wid(nome)}.wav'
    if not os.path.exists(src): return dict(id=nome, erro='sem wav')
    a, sr = lerwav(src)
    ini, fim = limites(a)
    bruto = len(a) / SR
    if fim - ini < SR * 0.05: return dict(id=nome, erro='mudo', bruto=bruto)
    v = a[ini:fim]
    perfil = it['pad']
    if it['classe'] == 'en-alvo' and len(it['texto'].split()) <= 2: perfil = 'palavra-en'
    h, t = PADS[perfil]
    L = lufs(v)
    if L is None: return dict(id=nome, erro='sem loudness')
    g = TARGET - L
    pico = float(np.abs(v).max())
    limitado = (pico * 10 ** (g / 20)) > 10 ** (PEAK_MAX / 20)   # vai passar pelo limitador
    # fade curtinho (6 ms) nas pontas, so para nao estalar
    fd = int(SR * 0.006); w = np.linspace(0, 1, fd)
    if len(v) > 2 * fd: v[:fd] *= w; v[-fd:] *= w[::-1]
    FILT = f'volume={g:.3f}dB,alimiter=limit=0.84:attack=5:release=80:level=disabled'
    out = np.concatenate([np.zeros(int(SR * h), np.float32), v.astype(np.float32), np.zeros(int(SR * t), np.float32)])
    os.makedirs(os.path.dirname(dop), exist_ok=True)
    with tempfile.TemporaryDirectory() as d:
        p = d + '/n.wav'; gravawav(p, out)
        r1 = subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', p, '-af', FILT, '-ac', '1', '-ar', str(SR), '-c:a', 'libopus', '-b:a', OPUS_K, '-vbr', 'on', '-application', 'audio', dop + '.tmp.opus'])
        r2 = subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', p, '-af', FILT, '-ac', '1', '-ar', str(SR), '-c:a', 'aac', '-b:a', AAC_K, '-movflags', '+faststart', dam + '.tmp.m4a'])
    if r1.returncode or r2.returncode: return dict(id=nome, erro='ffmpeg')
    os.replace(dop + '.tmp.opus', dop); os.replace(dam + '.tmp.m4a', dam)
    return dict(id=nome, lufs_in=round(L, 2), ganho=round(g, 2), limitado=bool(limitado), bruto=round(bruto, 3), dur=round(len(out) / SR, 3), pad=perfil)

if __name__ == '__main__':
    items = json.load(open(f'{ROOT}/items.json'))
    lim = int(sys.argv[1]) if len(sys.argv) > 1 else None
    if lim: items = items[:lim]
    items = [i for i in items if os.path.exists(f'{ROOT}/wav/{wid(i["id"])}.wav')]
    with Pool(int(os.environ.get('NPROC', '4'))) as p:
        res = p.map(um, items, chunksize=8)
    json.dump(res, open(f'{ROOT}/post_res.json', 'w'), ensure_ascii=False)
    print(len(res), 'itens;', sum(1 for r in res if 'erro' in r), 'erros;', sum(1 for r in res if r.get('limitado')), 'limitados por pico')
