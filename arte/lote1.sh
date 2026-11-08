#!/bin/bash
# uso: lote1.sh ID < urls  -> baixa 4 e monta contato quadrado (2048x512) em /private/tmp/claude-501/montagem.jpg
cd "$(dirname "$0")"
grep -o 'https://flow-content[^"\\ ]*' | ./baixar-lote.sh "$1"
python3 - "$1" <<'PY'
import sys,glob
from PIL import Image
fs=sorted(glob.glob('fonte/%s-v*.jpg'%sys.argv[1]), key=lambda f:int(f.split('-v')[-1][:-4]))[-4:]
ims=[Image.open(f).convert('RGB').resize((512,512)) for f in fs]
m=Image.new('RGB',(2048,512)); [m.paste(im,(i*512,0)) for i,im in enumerate(ims)]; m.save('/private/tmp/claude-501/montagem.jpg',quality=85)
PY
