#!/usr/bin/env python3
# Exporta arte/aprovadas -> arte/otimizadas (WebP q82) + recortes (WebP com alfa) + arte/manifesto-arte.json
# Larguras maximas: cenarios e planetas 1024; poses e expressoes 768. Desenho vira WebP em tons de cinza; recortes e folhas com alfa.
import os, json, io, glob
from PIL import Image
ROOT=os.path.dirname(os.path.abspath(__file__)); AP=f'{ROOT}/aprovadas'; RC=f'{ROOT}/recortes'; OT=f'{ROOT}/otimizadas'
os.makedirs(OT,exist_ok=True); man=[]
def tipo(n):
    if n.startswith('BAU-') or n.startswith('REC-'): return 'recompensa'
    if n.startswith('PLANETA'): return 'planeta'
    if n.startswith('CEN-'): return 'cenario'
    if n.startswith('DES-'): return 'desenho'
    if '-E0' in n: return 'expressao'
    if '-SHEET' in n: return 'personagem'
    if 'ITEM' in n: return 'item'
    return 'pose'
def maxw(t): return 1024 if t in('cenario','planeta','desenho') else 768
def salvar(img,dest,t,orig,extra):
    w=maxw(t)
    if img.width>w: img=img.resize((w,round(img.height*w/img.width)),Image.LANCZOS)
    img.save(dest,'WEBP',quality=82,method=6)
    man.append(dict(id=os.path.basename(dest)[:-5],arquivo='otimizadas/'+os.path.basename(dest),origem=orig,largura=img.width,altura=img.height,bytes=os.path.getsize(dest),tipo=t,**extra))
for f in sorted(glob.glob(AP+'/*.jpg')):
    n=os.path.basename(f)[:-4]; t=tipo(n); im=Image.open(f)
    salvar(im.convert('RGB') if t!='desenho' else im.convert('L'),f'{OT}/{n}.webp',t,'aprovadas/'+n+'.jpg',dict(transparencia=False))
for f in sorted(glob.glob(RC+'/*.png')):
    n=os.path.basename(f)[:-4]; t=tipo(n); im=Image.open(f).convert('RGBA')
    salvar(im,f'{OT}/{n}-recorte.webp',t,'recortes/'+n+'.png',dict(transparencia=True))
json.dump(man,open(f'{ROOT}/manifesto-arte.json','w'),ensure_ascii=False,indent=1)
tot=sum(m['bytes'] for m in man); print(len(man),'arquivos',round(tot/1e6,2),'MB')
