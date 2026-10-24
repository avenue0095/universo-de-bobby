#!/usr/bin/env python3
"""Uso: synth.py <shard> <nshards> [limite]  -> grava wav/<hash>.wav (24 kHz mono int16). Retomavel."""
import sys, os, json, time, wave, hashlib
import numpy as np
from kokoro_onnx import Kokoro
from kokoro_onnx.config import EspeakConfig
ROOT = os.environ.get('BOBBY_TRABALHO', os.path.expanduser('~/bobby-audio-trabalho'))   # items.json, wav/, medidas.json (nao fica no repositorio)
V = os.environ.get('BOBBY_VOZ', os.path.expanduser('~/voz-kokoro'))   # pasta com modelos/kokoro-onnx-v1.0 (kokoro-v1.0.int8.onnx e voices-v1.0.bin)
M = f'{V}/modelos/kokoro-onnx-v1.0'
VOZ = {'pt-br': ('pm_alex', 0.9), 'en-us': ('am_michael', 0.9)}
sh, n = int(sys.argv[1]), int(sys.argv[2])
lim = int(sys.argv[3]) if len(sys.argv) > 3 else None
items = json.load(open(f'{ROOT}/items.json'))
os.makedirs(f'{ROOT}/wav', exist_ok=True)
import onnxruntime as rt
so = rt.SessionOptions(); so.intra_op_num_threads = 2; so.inter_op_num_threads = 1
sess = rt.InferenceSession(f'{M}/kokoro-v1.0.int8.onnx', sess_options=so, providers=['CPUExecutionProvider'])
sess._model_path = f'{M}/kokoro-v1.0.int8.onnx'
k = Kokoro.from_session(sess, f'{M}/voices-v1.0.bin',
           espeak_config=EspeakConfig(lib_path='/opt/homebrew/lib/libespeak-ng.dylib', data_path='/opt/homebrew/share/espeak-ng-data'))
def wid(it): return hashlib.sha1(it['id'].encode()).hexdigest()[:16]
mine = [it for i, it in enumerate(items) if i % n == sh]
if lim: mine = mine[:lim]
if os.environ.get('REV'): mine = mine[::-1]
t0 = time.time(); done = 0; err = []
for it in mine:
    p = f'{ROOT}/wav/{wid(it)}.wav'
    if os.path.exists(p) or os.path.exists(p + '.tmp'): continue
    parts = []; sr = 24000
    try:
        for j, (lg, tx) in enumerate(it['segs']):
            v, sp = VOZ[lg]
            a, sr = k.create(tx, voice=v, speed=sp, lang=lg)
            if j: parts.append(np.zeros(int(sr * 0.08), dtype=np.float32))
            parts.append(a.astype(np.float32))
        a = np.concatenate(parts) if parts else np.zeros(1, dtype=np.float32)
        pcm = (np.clip(a, -1, 1) * 32767).astype(np.int16)
        with wave.open(p + '.tmp', 'wb') as w:
            w.setnchannels(1); w.setsampwidth(2); w.setframerate(sr); w.writeframes(pcm.tobytes())
        os.rename(p + '.tmp', p)
    except Exception as e:
        err.append((it['id'], repr(e)))
        print('ERRO', it['id'], repr(e), flush=True)
    done += 1
    if done % 50 == 0: print(f'[{sh}] {done}/{len(mine)} {time.time()-t0:.0f}s', flush=True)
print(f'[{sh}] fim {done} itens em {time.time()-t0:.0f}s, erros {len(err)}', flush=True)
json.dump(err, open(f'{ROOT}/erros_{sh}.json', 'w'))
