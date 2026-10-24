#!/usr/bin/env python3
# Recorte de fundo liso (sem instalar nada): chave por distancia ao tom do fundo + maior componente + preenche buracos + borda suavizada.
# uso: recortar.py ENTRADA.jpg SAIDA.png [tolerancia_baixa tolerancia_alta]
import sys, numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage
src, dst = sys.argv[1], sys.argv[2]
lo = float(sys.argv[3]) if len(sys.argv)>3 else 10; hi = float(sys.argv[4]) if len(sys.argv)>4 else 30
im = Image.open(src).convert('RGB'); a = np.asarray(im, float)
b = np.concatenate([a[:6].reshape(-1,3), a[-6:].reshape(-1,3), a[:,:6].reshape(-1,3), a[:,-6:].reshape(-1,3)])
bg = np.median(b, axis=0)
d = np.linalg.norm(a - bg, axis=2)
alpha = np.clip((d - lo) / (hi - lo), 0, 1)
mask = alpha > 0.5
lab, n = ndimage.label(mask)
if n:
    sizes = np.bincount(lab.ravel()); sizes[0] = 0; mask = (lab == sizes.argmax()) if not __import__('os').environ.get('TODOS') else np.isin(lab, np.where(sizes > 0.03*sizes.max())[0])
mask = ndimage.binary_fill_holes(mask)
mask = ndimage.binary_erosion(mask, iterations=1)
m = Image.fromarray((mask*255).astype('uint8')).filter(ImageFilter.GaussianBlur(0.8))
out = im.copy(); out.putalpha(m)
bb = m.point(lambda v: 255 if v>8 else 0).getbbox(); out = out.crop(bb)
out.save(dst); print(dst, out.size)
