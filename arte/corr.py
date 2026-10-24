#!/usr/bin/env python3
# uso: corr.py COMPLETO.jpg PREFIXO_APAGADO v_ini v_fim -> correlacao de bordas (alinhamento de composicao)
import sys, numpy as np
from PIL import Image, ImageFilter
def e(p):
    im=Image.open(p).convert('L').resize((224,300)).filter(ImageFilter.FIND_EDGES); a=np.asarray(im,float); return (a-a.mean())/a.std()
c=e(sys.argv[1]); base='fonte/'
for i in range(int(sys.argv[3]),int(sys.argv[4])+1):
    a=e(f'{base}{sys.argv[2]}-v{i}.jpg'); print(i, round(float((a*c).mean()),3))
