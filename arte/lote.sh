#!/bin/bash
# uso: lote.sh ID  (cola a saida do __harvestN(1) no stdin) -> baixa 4 variantes e monta /private/tmp/claude-501/montagem.jpg
cd "$(dirname "$0")"
grep -o 'https://flow-content[^"\\ ]*' | ./baixar-lote.sh "$1"
n=$(ls fonte/$1-v*.jpg | wc -l); ./montar.py "$1" $((n-3)) $n ${2:-0.5}
if [ -n "$CROP" ]; then python3 - "$1" <<'PY'
import sys,glob
from PIL import Image
fs=sorted(glob.glob('fonte/%s-v*.jpg'%sys.argv[1]), key=lambda f:int(f.split('-v')[-1][:-4]))[-4:]
ims=[Image.open(f).crop((0,0,896,896)).resize((448,448)) for f in fs]
m=Image.new('RGB',(448*4,448)); [m.paste(im,(i*448,0)) for i,im in enumerate(ims)]; m.save('/private/tmp/claude-501/montagem.jpg',quality=85)
PY
fi
