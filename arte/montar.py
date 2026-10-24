#!/usr/bin/env python3
# uso: montar.py PREFIXO v_ini v_fim -> /private/tmp/claude-501/montagem.jpg (lado a lado, metade do tamanho)
import sys
from PIL import Image
p,a,b=sys.argv[1],int(sys.argv[2]),int(sys.argv[3])
base='/Users/filipealvesesilva/Projetos/universo-de-bobby/arte/fonte/'
ims=[Image.open(f'{base}{p}-v{i}.jpg') for i in range(a,b+1)]
w,h=ims[0].size
s=float(sys.argv[4]) if len(sys.argv)>4 else 0.5
if w>h and len(ims)>1:  # paisagem: empilha em 2 colunas
    cols=2
else: cols=len(ims)
rows=(len(ims)+cols-1)//cols
W,H=int(w*s),int(h*s)
m=Image.new('RGB',(W*cols,H*rows))
for i,im in enumerate(ims): m.paste(im.resize((W,H)),((i%cols)*W,(i//cols)*H))
m.save('/private/tmp/claude-501/montagem.jpg',quality=85); print(m.size)
