#!/usr/bin/env python3
# Recorte com descontaminacao de borda (para fundo escuro/claro): erode N px, depois substitui a cor das bordas pela cor do interior mais proximo.
# uso: recortar2.py ENTRADA SAIDA [erode=3] [lo=14] [hi=40]  (TODOS=1 mantem varios componentes)
import sys, os, numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage
src,dst=sys.argv[1],sys.argv[2]; er=int(sys.argv[3]) if len(sys.argv)>3 else 3
lo=float(sys.argv[4]) if len(sys.argv)>4 else 14; hi=float(sys.argv[5]) if len(sys.argv)>5 else 40
im=Image.open(src).convert('RGB'); a=np.asarray(im,float)
b=np.concatenate([a[:6].reshape(-1,3),a[-6:].reshape(-1,3),a[:,:6].reshape(-1,3),a[:,-6:].reshape(-1,3)]); bg=np.median(b,axis=0)
d=np.linalg.norm(a-bg,axis=2); mask=d>(lo+hi)/2
lab,n=ndimage.label(mask); s=np.bincount(lab.ravel()); s[0]=0
mask=(lab==s.argmax()) if not os.environ.get('TODOS') else np.isin(lab,np.where(s>0.03*s.max())[0])
if not os.environ.get('SEMBURACO'): mask=ndimage.binary_fill_holes(mask)
else:
    # remove so buracos ligados ao fundo; mantem interior de alcas (fundo cinza) transparente
    pass
core=ndimage.binary_erosion(mask,iterations=er+4)          # interior seguro
inner=ndimage.binary_erosion(mask,iterations=er)
# despill: cor das bordas = cor do pixel interior mais proximo
idx=ndimage.distance_transform_edt(~core,return_distances=False,return_indices=True)
fill=a[idx[0],idx[1]]
out=np.where(core[...,None],a,fill)
alpha=ndimage.gaussian_filter(inner.astype(float),0.9)
rgba=np.dstack([out,alpha*255]).astype('uint8'); img=Image.fromarray(rgba,'RGBA')
bb=img.split()[3].point(lambda v:255 if v>8 else 0).getbbox(); img=img.crop(bb); img.save(dst); print(dst,img.size)
