#!/usr/bin/env python3
"""Pipeline de ativos: converte a arte aprovada em WebP leve dentro de assets/ e grava assets/manifesto.json.

Uso:
  python3 build/ativos.py              converte o que mudou (ignora arquivo ja pronto e mais novo que a fonte)
  python3 build/ativos.py --tudo       refaz tudo
  python3 build/ativos.py --lista      so mostra o plano e o peso, sem gravar

Precisa de Pillow (com WebP), NumPy e SciPy. O build normal (build.py) NAO precisa disto: ele so le assets/manifesto.json,
que fica no repositorio junto com os .webp. Nada em arte/ e alterado: a pasta e so lida.

Regras (docs/DESIGN.md secao 9 e o pedido da Fase 3 visual):
  poses e expressoes (recortes com alfa)      ate 768 px no maior lado, WebP qualidade 82 com alfa
  chapeu (item)                               ate 512 px
  cenarios e planetas                         ate 1024 px no maior lado, qualidade 82 (planeta ganha alfa: o fundo escuro sai)
  desenhos para colorir                       linha limpa em tons de cinza, WebP SEM perda (a tinta por inundacao precisa de borda nitida)
  companheiro sem recorte pronto              recortado aqui, com o mesmo metodo de arte/recortar.py (chave de cor do fundo liso)

Camada 'inicial' = o que o service worker guarda na instalacao (cache bobby-arte-v1). O resto carrega sob demanda e entra no mesmo cache.
"""
import json, re, sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage

RAIZ = Path(__file__).resolve().parent.parent
ARTE = RAIZ / 'arte'
SAIDA = RAIZ / 'assets'

QUALIDADE = 82
MAX_POSE = 768
MAX_ITEM = 512
MAX_CENA = 1024
MAX_ICONE = 192      # icone de recompensa: aparece de 16 a 96 px
MAX_BAU = 512

# o que entra no pre-cache da arte (camada inicial). O resto e sob demanda.
INICIAIS = {
    'rec-moeda', 'rec-estrela', 'rec-medalha', 'rec-congelador', 'rec-pergaminho', 'rec-bilhete', 'rec-presente', 'rec-trofeu', 'bau-fechado',
    'bobby-p01', 'bobby-p05a', 'bobby-p05b', 'bobby-e01', 'bobby-e02', 'bobby-e06',
    # camada maior (teto de 3 MB no total): todas as expressões e poses do Bobby, que aparecem em toda pergunta e em Meu personagem
    'bobby-e03', 'bobby-e04', 'bobby-e05', 'bobby-e07', 'bobby-e08',
    'bobby-p02', 'bobby-p03', 'bobby-p04', 'bobby-p06', 'bobby-p07', 'bobby-p08', 'bobby-p09', 'bobby-p10', 'bobby-p11',
    'bobby-sheet', 'bobby-sheet-frente', 'item-base',
    'planeta-mat', 'planeta-por', 'planeta-ing',
    'cen-mat01-apagado', 'cen-mat01-completo', 'cen-por01-apagado', 'cen-por01-completo', 'cen-ing01-apagado', 'cen-ing01-completo',
}


def slug(nome):
    return nome.lower().replace('_', '-')


def reduz(im, maximo):
    w, h = im.size
    m = max(w, h)
    if m <= maximo:
        return im
    k = maximo / m
    return im.resize((max(1, round(w * k)), max(1, round(h * k))), Image.LANCZOS)


def recorta_fundo_liso(src, lo=10, hi=30):
    """Mesmo metodo de arte/recortar.py: chave por distancia ao tom do fundo, maior componente, buracos preenchidos."""
    im = Image.open(src).convert('RGB')
    a = np.asarray(im, float)
    b = np.concatenate([a[:6].reshape(-1, 3), a[-6:].reshape(-1, 3), a[:, :6].reshape(-1, 3), a[:, -6:].reshape(-1, 3)])
    bg = np.median(b, axis=0)
    d = np.linalg.norm(a - bg, axis=2)
    mask = np.clip((d - lo) / (hi - lo), 0, 1) > 0.5
    lab, n = ndimage.label(mask)
    if n:
        tam = np.bincount(lab.ravel())
        tam[0] = 0
        mask = lab == tam.argmax()
    mask = ndimage.binary_fill_holes(mask)
    mask = ndimage.binary_erosion(mask, iterations=1)
    m = Image.fromarray((mask * 255).astype('uint8')).filter(ImageFilter.GaussianBlur(0.8))
    out = im.copy()
    out.putalpha(m)
    bb = m.point(lambda v: 255 if v > 8 else 0).getbbox()
    return out.crop(bb)


def planeta_com_alfa(src):
    """O planeta vem sobre fundo escuro liso. Tira o fundo com borda suave e guarda o anel junto."""
    im = Image.open(src).convert('RGB')
    a = np.asarray(im, float)
    b = np.concatenate([a[:8].reshape(-1, 3), a[-8:].reshape(-1, 3), a[:, :8].reshape(-1, 3), a[:, -8:].reshape(-1, 3)])
    bg = np.median(b, axis=0)
    d = np.linalg.norm(a - bg, axis=2)
    macio = np.clip((d - 16) / (46 - 16), 0, 1)
    firme = macio > 0.5
    lab, n = ndimage.label(ndimage.binary_dilation(firme, iterations=3))
    tam = np.bincount(lab.ravel())
    tam[0] = 0
    manter = np.isin(lab, [i for i in range(1, n + 1) if tam[i] > 400])
    miolo = ndimage.binary_fill_holes(ndimage.binary_closing(firme & manter, iterations=6))
    alfa = np.where(miolo, 1.0, macio * manter)
    alfa = ndimage.gaussian_filter(alfa, 0.7)
    out = im.copy()
    out.putalpha(Image.fromarray((np.clip(alfa, 0, 1) * 255).astype('uint8')))
    bb = out.getchannel('A').point(lambda v: 255 if v > 8 else 0).getbbox()
    return out.crop(bb)


def desenho_limpo(src):
    """Linha preta em fundo branco, sem cinza de JPEG: a tinta por inundacao depende de borda nitida."""
    g = Image.open(src).convert('L')
    return g.point(lambda v: 0 if v < 110 else (255 if v > 190 else int((v - 110) * 255 / 80)))


def plano():
    """Lista de (id, fonte, grupo, funcao que devolve a imagem, tamanho maximo, alfa, sem_perda)."""
    itens = []
    rec = ARTE / 'recortes'
    apr = ARTE / 'aprovadas'
    tem_recorte = set()
    for f in sorted(rec.glob('*.png')):
        nome = f.stem
        tem_recorte.add(nome)
        if nome.startswith('BOBBY-E'):
            grupo, mx = 'expressao', MAX_POSE
        elif nome == 'BOBBY-ITEM-CHAPEU':
            grupo, mx = 'item', MAX_ITEM
        elif nome.startswith('REC-'):
            grupo, mx = 'recompensa', MAX_ICONE
        elif nome.startswith('BAU-'):
            grupo, mx = 'recompensa', MAX_BAU
        elif nome.startswith('ITEM-'):
            grupo, mx = 'look', MAX_POSE
        elif nome.startswith('BOBBY-'):
            grupo, mx = 'personagem', MAX_POSE
        else:
            grupo, mx = 'companheiro', MAX_POSE
        itens.append((slug(nome), f, grupo, (lambda p=f: Image.open(p).convert('RGBA')), mx, True, False))
    # poses de companheiro aprovadas mas sem recorte pronto: recorta aqui, sem tocar em arte/
    for f in sorted(apr.glob('*-P0[1-4].jpg')):
        nome = f.stem
        if nome in tem_recorte or nome.startswith('BOBBY-'):
            continue
        itens.append((slug(nome), f, 'companheiro', (lambda p=f: recorta_fundo_liso(p)), MAX_POSE, True, False))
    # itens do guarda-roupa (BOBBY-ITEM-*), looks (ITEM-*) e icones (REC-*, BAU-*) que cheguem sem recorte pronto
    for f in sorted(list(apr.glob('BOBBY-ITEM-*.jpg'))+list(apr.glob('ITEM-*.jpg'))+list(apr.glob('REC-*.jpg'))+list(apr.glob('BAU-*.jpg'))):
        if f.stem in tem_recorte:
            continue
        grupo = 'item' if f.stem.startswith('BOBBY-ITEM') else ('look' if f.stem.startswith('ITEM-') else 'recompensa')
        itens.append((slug(f.stem), f, grupo, (lambda p=f: recorta_fundo_liso(p)), MAX_ITEM if grupo != 'look' else MAX_POSE, True, False))
    for f in sorted(apr.glob('PLANETA-*.jpg')):
        itens.append((slug(f.stem), f, 'planeta', (lambda p=f: planeta_com_alfa(p)), MAX_CENA, True, False))
    for f in sorted(apr.glob('CEN-*.jpg')):
        itens.append((slug(f.stem), f, 'cenario', (lambda p=f: Image.open(p).convert('RGB')), MAX_CENA, False, False))
    for f in sorted(apr.glob('DES-*.jpg')):
        itens.append((slug(f.stem), f, 'desenho', (lambda p=f: desenho_limpo(p)), MAX_CENA, False, True))
    return itens


PASTA = {'personagem': 'personagens', 'expressao': 'expressoes', 'item': 'itens', 'companheiro': 'companheiros',
         'planeta': 'planetas', 'cenario': 'cenarios', 'desenho': 'desenhos', 'recompensa': 'recompensas', 'look': 'looks'}


def main(argv):
    refazer = '--tudo' in argv
    so_lista = '--lista' in argv
    itens = plano()
    manifesto = {}
    for ident, fonte, grupo, abre, mx, alfa, sem_perda in itens:
        rel = '%s/%s.webp' % (PASTA[grupo], ident)
        destino = SAIDA / rel
        if not so_lista and (refazer or not destino.exists() or destino.stat().st_mtime < fonte.stat().st_mtime):
            destino.parent.mkdir(parents=True, exist_ok=True)
            im = reduz(abre(), mx)
            if sem_perda:
                im.save(destino, 'WEBP', lossless=True, method=6)
            else:
                im.save(destino, 'WEBP', quality=QUALIDADE, alpha_quality=92, method=6)
        if destino.exists():
            w, h = Image.open(destino).size
            manifesto[ident] = {'a': rel, 'w': w, 'h': h, 'b': destino.stat().st_size, 'g': grupo,
                                'alfa': bool(alfa), 'inicial': ident in INICIAIS, 'fonte': fonte.name}
        else:
            print('(faltaria) %s' % rel)
    tot = {'inicial': 0, 'demanda': 0}
    for m in manifesto.values():
        tot['inicial' if m['inicial'] else 'demanda'] += m['b']
    # arte/manifesto-arte.json (do agente de arte), se existir: so registra o que ele declara. A fonte da verdade sao os arquivos.
    ext = ARTE / 'manifesto-arte.json'
    extra = None
    if ext.exists():
        try:
            extra = json.loads(ext.read_text(encoding='utf-8'))
        except Exception as e:
            print('manifesto-arte.json ilegivel (%s); sigo so com os arquivos' % e)
    saida = {'versao': 1, 'totais': {'inicial_bytes': tot['inicial'], 'demanda_bytes': tot['demanda'],
                                      'total_bytes': tot['inicial'] + tot['demanda'], 'itens': len(manifesto)},
             'itens': manifesto}
    if extra is not None:
        saida['manifesto_arte_lido'] = True
    if not so_lista:
        SAIDA.mkdir(exist_ok=True)
        (SAIDA / 'manifesto.json').write_text(json.dumps(saida, ensure_ascii=False, indent=1, sort_keys=True) + '\n', encoding='utf-8')
    print('%d itens | inicial %.0f KB | sob demanda %.0f KB | total %.1f MB' % (
        len(manifesto), tot['inicial'] / 1024, tot['demanda'] / 1024, (tot['inicial'] + tot['demanda']) / 1048576))
    return 0


if __name__ == '__main__':
    sys.exit(main(sys.argv[1:]))
