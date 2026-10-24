#!/usr/bin/env python3
"""Monta dist/site/ SO com o que vai ao publico. Python 3, sem dependencias.

Uso:
  python3 build/site.py                    grava dist/site/ (m4a apenas)
  python3 build/site.py --com-opus         inclui tambem os .opus (o app so usa se o aparelho nao toca AAC)
  python3 build/site.py --saida PASTA      grava em outra pasta (os testes usam isto)

Entra: index.html, sw.js, manifest.webmanifest, icones, assets/ (arte WebP, fontes e licencas, manifesto), audio/manifesto-min.json,
audio/**/*.m4a, _headers (cabecalhos de seguranca) e .nojekyll. NAO entra: arte/, docs/, pesquisa/, src/, build/, testes/, .git, node_modules,
audio/ferramentas, manifesto.json de audio (3 MB de texto), README. Nada e publicado por este script: ele so monta a pasta.
Publicar continua sendo decisao do Filipe (ver README.md, secao Publicar).
"""
import shutil, sys, os
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
PUBLICO_FIXO = ['index.html', 'sw.js', 'manifest.webmanifest', 'icone-192.png', 'icone-512.png', 'icone-maskable.png', 'icone.svg']
PROIBIDO = {'arte', 'docs', 'pesquisa', 'src', 'build', 'testes', '.git', 'node_modules', 'dist', 'ferramentas'}

# a mesma politica da meta CSP do index.html, mais o que so cabecalho consegue (frame-ancestors)
CSP = ("default-src 'none'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; "
       "font-src 'self'; media-src 'self' blob:; connect-src 'self'; manifest-src 'self'; worker-src 'self'; base-uri 'none'; "
       "form-action 'none'; object-src 'none'; frame-ancestors 'none'")
HEADERS = """/*
  Content-Security-Policy: %s
  Strict-Transport-Security: max-age=31536000
  X-Content-Type-Options: nosniff
  Referrer-Policy: no-referrer
  Permissions-Policy: camera=(), microphone=(), geolocation=()
  Cross-Origin-Opener-Policy: same-origin
/sw.js
  Cache-Control: no-cache
/index.html
  Cache-Control: no-cache
/audio/manifesto-min.json
  Cache-Control: no-cache
""" % CSP


def copia(origem, destino):
    destino.parent.mkdir(parents=True, exist_ok=True)
    try:
        os.link(origem, destino)           # rapido e sem gastar disco; cai para copia se a pasta for em outro volume
    except OSError:
        shutil.copy2(origem, destino)


def main(argv):
    com_opus = '--com-opus' in argv
    saida = RAIZ / 'dist' / 'site'
    if '--saida' in argv:
        saida = Path(argv[argv.index('--saida') + 1]).resolve()
    if saida == RAIZ or RAIZ in saida.parents and saida.relative_to(RAIZ).parts[0] in PROIBIDO - {'dist'}:
        raise SystemExit('saida dentro de pasta do projeto que nao e dist/: recuso')
    if saida.exists():
        shutil.rmtree(saida)                # pasta gerada: so o que este script criou
    saida.mkdir(parents=True)
    n = 0
    for f in PUBLICO_FIXO:
        if not (RAIZ / f).exists():
            raise SystemExit('falta ' + f)
        copia(RAIZ / f, saida / f); n += 1
    for f in sorted((RAIZ / 'assets').rglob('*')):
        if f.is_file():
            copia(f, saida / f.relative_to(RAIZ)); n += 1
    audio = RAIZ / 'audio'
    copia(audio / 'manifesto-min.json', saida / 'audio' / 'manifesto-min.json'); n += 1
    exts = ['.m4a'] + (['.opus'] if com_opus else [])
    for f in sorted(audio.rglob('*')):
        if f.is_file() and f.suffix in exts and not (PROIBIDO & set(f.relative_to(RAIZ).parts)):
            copia(f, saida / f.relative_to(RAIZ)); n += 1
    (saida / '_headers').write_text(HEADERS, encoding='utf-8')
    (saida / '.nojekyll').write_text('', encoding='utf-8')
    total = sum(f.stat().st_size for f in saida.rglob('*') if f.is_file())
    print('%s: %d arquivos, %.1f MB' % (saida, n + 2, total / 1048576))
    return 0


if __name__ == '__main__':
    sys.exit(main(sys.argv[1:]))
