#!/usr/bin/env python3
"""Gera assets/dados/bncc-<hash>.json (carregado so quando a area do responsavel abre: fica fora dos 3 MB iniciais) e
src/conteudo/bncc.js (so o nome do arquivo) a partir de docs/bncc-mapa.json, so com o que o relatorio dos pais pode citar.

Regra (docs/bncc-mapa.json, campo regras): o relatorio so cita codigo com conferido:true e citavel:true; mostra o ano do codigo;
usa 'habilidade relacionada', nunca 'cumprida'; fases sem codigo, revisoes e ingles de 7 a 10 anos nao citam.
Uso: python3 build/gerar-bncc.py        (grava)      python3 build/gerar-bncc.py --check   (falha se o arquivo estiver desatualizado)
"""
import json, sys, hashlib
from pathlib import Path
RAIZ = Path(__file__).resolve().parent.parent
ORIG = RAIZ / 'docs' / 'bncc-mapa.json'
DEST = RAIZ / 'src' / 'conteudo' / 'bncc.js'
DADOS = RAIZ / 'assets' / 'dados'


def montar():
    d = json.loads(ORIG.read_text(encoding='utf-8'))
    fases, cod = {}, {}
    for f in d['fases']:
        st = f.get('status', '')
        ingles = f['materia'] == 'ing'
        if ingles:
            if 'mapeada (11 a 12 anos)' not in st:
                continue
        elif st != 'mapeada':
            continue
        lista = []
        for c in f.get('codigos', []):
            if c.get('conferido') is True and c.get('citavel') is True:
                lista.append([c['codigo'], int(c['ano'])])
                cod[c['codigo']] = c['descricao']
        if lista:
            fases[f['fase']] = lista
    corpo = json.dumps({'fases': fases, 'cod': dict(sorted(cod.items()))}, ensure_ascii=False, separators=(',', ':'))
    nome = 'bncc-%s.json' % hashlib.sha256(corpo.encode('utf-8')).hexdigest()[:8]
    js = ('/* GERADO por build/gerar-bncc.py a partir de docs/bncc-mapa.json (gerado_em %s). Nao edite a mao.\n'
          '   Os dados (so codigos conferido:true e citavel:true) ficam em assets/dados/ e so carregam na area do responsavel. */\n'
          "const BNCC_ARQ='assets/dados/%s';\nlet BNCC=null;\n") % (d.get('gerado_em', ''), nome)
    return js, nome, corpo


def main():
    js, nome, corpo = montar()
    arq = DADOS / nome
    if '--check' in sys.argv:
        if not DEST.exists() or DEST.read_text(encoding='utf-8') != js or not arq.exists() or arq.read_text(encoding='utf-8') != corpo:
            print('bncc DESATUALIZADO: rode python3 build/gerar-bncc.py'); return 1
        print('bncc em dia'); return 0
    DADOS.mkdir(parents=True, exist_ok=True)
    arq.write_text(corpo, encoding='utf-8')
    DEST.write_text(js, encoding='utf-8')
    print('%s gravado (%d bytes) e bncc.js atualizado' % (arq.name, len(corpo.encode('utf-8'))))
    return 0


if __name__ == '__main__':
    sys.exit(main())
