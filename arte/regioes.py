#!/usr/bin/env python3
# uso: regioes.py ARQ...  -> conta areas coloriveis (regioes brancas > 600 px) e cinza
import sys, numpy as np
from PIL import Image
from scipy import ndimage
for f in sys.argv[1:]:
    im=np.asarray(Image.open(f).convert('L'),float); lab,n=ndimage.label(im>150); s=np.bincount(lab.ravel())[1:]
    print(f.split('/')[-1],'regioes>600px',(s>600).sum(),'cinza%',round(((im>60)&(im<200)).mean()*100,1))
