#!/usr/bin/env python3
# uso: apagar.py ID  -> gera fonte/CEN-ID-APAGADO-vN.jpg a partir de aprovadas/CEN-ID-COMPLETO.jpg
# edicao deterministica: tira a cor (resta 12%), esfria, reduz contraste, leve neblina; mesmo enquadramento (correl. 1.0)
import sys,glob,re
from PIL import Image, ImageEnhance, ImageFilter
i=sys.argv[1]
im=Image.open(f'aprovadas/CEN-{i}-COMPLETO.jpg').convert('RGB')
g=ImageEnhance.Color(im).enhance(0.12)
g=ImageEnhance.Contrast(g).enhance(0.78)
g=ImageEnhance.Brightness(g).enhance(0.97)
cool=Image.new('RGB',g.size,(120,140,170))
g=Image.blend(g,cool,0.18)
soft=g.filter(ImageFilter.GaussianBlur(0.8))
g=Image.blend(g,soft,0.5)
ns=[int(re.search(r'-v(\d+)\.jpg',f).group(1)) for f in glob.glob(f'fonte/CEN-{i}-APAGADO-v*.jpg')]
n=max(ns)+1
out=f'fonte/CEN-{i}-APAGADO-v{n}.jpg'; g.save(out,quality=92); print(out)
