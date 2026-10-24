#!/usr/bin/env python3
"""Remonta src/ em /index.html (raiz do repositorio). Python 3, sem dependencias.

Uso:
  python3 build/build.py            grava index.html na raiz
  python3 build/build.py --check    nao grava; sai com erro se index.html da raiz diferir de src/
  python3 build/build.py --sha      imprime o sha256 do resultado
  python3 build/build.py --sem-minificar   index.html legivel (so para depurar; o --check compara com a versao minificada)

Como funciona: src/interface/shell.html tem marcadores no lugar do <style> e de cada <script>:
  <!--@style interface/style.css-->
  <!--@script conteudo/a.js conteudo/b.js-->   (varios arquivos viram UM bloco <script>, na ordem escrita)
Cada marcador e trocado por <style>/<script> + conteudo dos arquivos concatenados + a tag de fechamento.
A ORDEM dos marcadores e dos arquivos e a ordem de execucao no navegador. Nao reordene sem testar.
"""
import hashlib, re, sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent))
from minificar import minificar_js, minificar_css

RAIZ = Path(__file__).resolve().parent.parent
SRC = RAIZ / 'src'
MARCADOR = re.compile(r'<!--@(style|script)\s+(.*?)\s*-->', re.S)
ATIVOS_MARCA = '<!--@ativos-->'
MINIFICAR = '--sem-minificar' not in sys.argv


def ler(rel):
    # newline='' e bytes: nada de converter fim de linha
    return (SRC / rel).read_bytes().decode('utf-8')


def ativos_js():
    """Embute o indice de ativos (assets/manifesto.json) como constante ATIVOS: id -> [caminho, largura, altura, alfa, inicial]."""
    import json
    arq = RAIZ / 'assets' / 'manifesto.json'
    itens = json.loads(arq.read_text(encoding='utf-8'))['itens'] if arq.exists() else {}
    mini = {k: [v['a'], v['w'], v['h']] for k, v in sorted(itens.items())}
    return '<script>const ATIVOS=%s;</script>' % json.dumps(mini, separators=(',', ':'), ensure_ascii=False)


def montar():
    shell = (SRC / 'interface' / 'shell.html').read_bytes().decode('utf-8')

    def troca(m):
        tag, lista = m.group(1), m.group(2).split()
        if not lista:
            raise SystemExit('marcador vazio no shell.html')
        corpo = ''.join(ler(f) for f in lista)
        # D8: JS e CSS saem minificados (comentarios, recuo e espacos); o src/ continua legivel. --sem-minificar mostra o index.html legivel.
        if MINIFICAR:
            corpo = minificar_css(corpo) if tag == 'style' else minificar_js(corpo)
        return '<%s>\n%s</%s>' % (tag, corpo, tag)

    html = MARCADOR.sub(troca, shell)
    return html.replace(ATIVOS_MARCA, ativos_js())


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
