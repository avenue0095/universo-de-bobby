#!/usr/bin/env python3
"""Remonta src/ em /index.html (raiz do repositorio). Python 3, sem dependencias.

Uso:
  python3 build/build.py            grava index.html na raiz
  python3 build/build.py --check    nao grava; sai com erro se index.html da raiz diferir de src/
  python3 build/build.py --sha      imprime o sha256 do resultado

Como funciona: src/interface/shell.html tem marcadores no lugar do <style> e de cada <script>:
  <!--@style interface/style.css-->
  <!--@script conteudo/a.js conteudo/b.js-->   (varios arquivos viram UM bloco <script>, na ordem escrita)
Cada marcador e trocado por <style>/<script> + conteudo dos arquivos concatenados + a tag de fechamento.
A ORDEM dos marcadores e dos arquivos e a ordem de execucao no navegador. Nao reordene sem testar.
"""
import hashlib, re, sys
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
SRC = RAIZ / 'src'
MARCADOR = re.compile(r'<!--@(style|script)\s+(.*?)\s*-->', re.S)


def ler(rel):
    # newline='' e bytes: nada de converter fim de linha
    return (SRC / rel).read_bytes().decode('utf-8')


def montar():
    shell = (SRC / 'interface' / 'shell.html').read_bytes().decode('utf-8')

    def troca(m):
        tag, lista = m.group(1), m.group(2).split()
        if not lista:
            raise SystemExit('marcador vazio no shell.html')
        corpo = ''.join(ler(f) for f in lista)
        return '<%s>\n%s</%s>' % (tag, corpo, tag)

    return MARCADOR.sub(troca, shell)


def main(argv):
    html = montar()
    dados = html.encode('utf-8')
    sha = hashlib.sha256(dados).hexdigest()
    destino = RAIZ / 'index.html'
    if '--sha' in argv:
        print(sha)
        return 0
    if '--check' in argv:
        atual = hashlib.sha256(destino.read_bytes()).hexdigest()
        print('src/ -> %s\nindex.html -> %s' % (sha, atual))
        if sha != atual:
            print('DIFERENTE: rode python3 build/build.py')
            return 1
        print('OK: index.html da raiz esta em dia com src/')
        return 0
    destino.write_bytes(dados)
    print('index.html gravado (%d bytes) sha256=%s' % (len(dados), sha))
    return 0


if __name__ == '__main__':
    sys.exit(main(sys.argv[1:]))
