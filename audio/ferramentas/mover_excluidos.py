#!/usr/bin/env python3
"""Move para a pasta de revisao (com LOG.tsv e desfazer.sh) os clipes que estao em audio/ mas nao estao mais em items.json."""
import json,os,shutil,datetime,hashlib
OUT=os.environ.get('BOBBY_AUDIO', os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')))
D=os.path.expanduser('~/_APAGAR DEPOIS (revisao)/2026-10-24/audio-excluidos-lote5'); os.makedirs(D,exist_ok=True)
ids={i['id'] for i in json.load(open('items.json'))}
disco={os.path.relpath(os.path.join(r,x),OUT).rsplit('.',1)[0] for r,_,fs in os.walk(OUT) for x in fs if x.endswith(('.opus','.m4a'))}
sobra=sorted(disco-ids); hoje=datetime.date.today().isoformat()
log=[] if os.path.exists(D+'/LOG.tsv') else ['data\tmotivo\tde\tpara\tsituacao']; undo=[] if os.path.exists(D+'/desfazer.sh') else ['#!/bin/bash','set -u']
for k in sobra:
    for e in ('opus','m4a'):
        s=f'{OUT}/{k}.{e}'; d=f'{D}/{k}.{e}'
        if not os.path.exists(s): continue
        os.makedirs(os.path.dirname(d),exist_ok=True); shutil.move(s,d)
        log.append(f'{hoje}\tquadro de ajuda excluido do lote 5 (colagem metodo+resposta sem corte de frase, ou cauda longa por extenso)\t{s}\t{d}\tmovido')
        undo.append(f'[ -e "{d}" ] && [ ! -e "{s}" ] && mkdir -p "$(dirname "{s}")" && mv "{d}" "{s}"')
open(D+'/LOG.tsv','a').write('\n'.join(log)+'\n'); open(D+'/desfazer.sh','a').write('\n'.join(undo)+'\n'); os.chmod(D+'/desfazer.sh',0o755)
print('movidos',len(sobra),'clipes (x2 formatos) para',D)
