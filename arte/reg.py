#!/usr/bin/env python3
# uso: reg.py ID PROP APROVADA 'n|nota|texto' ... ; PROP = proporcao ; APROVADA = n da variante aprovada (ou 0)
import sys, shutil
id_, prop, ap = sys.argv[1], sys.argv[2], int(sys.argv[3]); rows=[]
for a in sys.argv[4:]:
    n,nota,txt = a.split('|',2)
    rows.append(f"{id_}-v{n}\t{id_}-v{n}.jpg\t{id_}\tNano Banana 2.1\t{prop}\t0\t{nota}\t{txt}{' APROVADA' if int(n)==ap else ''}")
open('fonte/registro.tsv','a').write('\n'.join(rows)+'\n')
if ap:
    import os
    if os.environ.get('CROP'):
        from PIL import Image
        Image.open(f'fonte/{id_}-v{ap}.jpg').crop((0,0,896,896)).save(f'aprovadas/{id_}.jpg',quality=92)
    else: shutil.copy(f'fonte/{id_}-v{ap}.jpg', f'aprovadas/{id_}.jpg')
print('ok', id_, 'aprovada v%d'%ap)
