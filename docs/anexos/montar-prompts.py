#!/usr/bin/env python3
"""Monta os prompts finais do Google Flow a partir dos documentos de docs/.

Uso (Python 3, sem dependencias, nao gasta credito, nao acessa a internet):
  python3 docs/anexos/montar-prompts.py            grava docs/anexos/prompts-montados.txt
  python3 docs/anexos/montar-prompts.py --piloto   grava docs/anexos/prompts-piloto.txt (ordem do LOTE-PILOTO.md)
  python3 docs/anexos/montar-prompts.py --id BOBBY-P01   imprime um prompt na tela

Formato lido (cercas de codigo dos .md):
  ```bloco NOME           o texto da cerca e um bloco reutilizavel
  ```prompt ID k=v ...    o texto da cerca e a frase de pose ou a instrucao final
     chaves: estilo, paleta, ident, gabarito, cena, fundo, neg (nomes de bloco), ref=sim, ar=3:4
  ```ordem-piloto         lista de IDs, um por linha (so no LOTE-PILOTO.md)
Ordem de montagem: [ref] estilo, paleta, ident, gabarito, cena, frase, fundo, neg, [ar].
Cada bloco CENA-xxNN gera sozinho CEN-xxNN-COMPLETO, CEN-xxNN-APAGADO e DES-xxNN, a menos que o ID
ja esteja escrito a mao nos documentos.
Confere: bloco inexistente, travessao, caractere fora do ASCII. Sai com erro se achar algo.
"""
import re, sys
from pathlib import Path

DOCS = Path(__file__).resolve().parent.parent
ARQS = ['BIBLIA-DE-PERSONAGENS.md', 'CENARIOS-E-DESENHOS.md', 'LOTE-PILOTO.md']
CERCA = re.compile(r'^```(bloco|prompt|ordem-piloto)[ \t]*(.*?)\n(.*?)\n```', re.S | re.M)
ORDEM = ['estilo', 'paleta', 'ident', 'gabarito', 'cena', 'FRASE', 'fundo', 'neg']
REF = ("Use the attached reference image(s) as the exact identity reference: the same character, "
       "the same proportions, the same colors, the same materials and the same markings.")


def ler():
    blocos, prompts, piloto = {}, {}, []
    for a in ARQS:
        f = DOCS / a
        if not f.exists():
            continue
        for tipo, cab, corpo in CERCA.findall(f.read_text(encoding='utf-8')):
            corpo = corpo.strip()
            if tipo == 'bloco':
                blocos[cab.strip()] = corpo
            elif tipo == 'ordem-piloto':
                piloto += [l.strip() for l in corpo.splitlines() if l.strip()]
            else:
                partes = cab.split()
                pid, kv = partes[0], {}
                for p in partes[1:]:
                    if '=' in p:
                        k, v = p.split('=', 1)
                        kv[k] = v
                kv['FRASE'] = corpo
                prompts[pid] = kv
    return blocos, prompts, piloto


def expandir(blocos, prompts):
    for nome in list(blocos):
        m = re.fullmatch(r'CENA-(MAT|POR|ING)(\d\d)', nome)
        if not m:
            continue
        mat, n = m.groups()
        base = dict(cena=nome, paleta='PALETA-' + mat, estilo='ESTILO-CENARIO', gabarito='GABARITO', neg='NEG-CENARIO', ar='3:4')
        comp = dict(base, FRASE='Output a single image of this scene.')
        apag = dict(estilo='EDITAR-APAGADO', ar='3:4', FRASE='')
        col = dict(estilo='BLOCO-COLORIR', cena=nome, neg='NEG-COLORIR', ar='3:4',
                   FRASE='Output a single coloring page of this scene.')
        prompts.setdefault('CEN-%s%s-COMPLETO' % (mat, n), comp)
        prompts.setdefault('CEN-%s%s-APAGADO' % (mat, n), apag)
        prompts.setdefault('DES-%s%s' % (mat, n), col)


def montar(pid, kv, blocos, erros):
    out = []
    if kv.get('ref') == 'sim':
        out.append(REF)
    for k in ORDEM:
        if k == 'FRASE':
            if kv.get('FRASE'):
                out.append(kv['FRASE'])
            continue
        nome = kv.get(k)
        if not nome:
            continue
        if nome not in blocos:
            erros.append('%s: bloco %s nao existe' % (pid, nome))
            continue
        out.append(blocos[nome])
    if kv.get('ar'):
        out.append('Aspect ratio %s.' % kv['ar'])
    return ' '.join(out)


def confere(pid, texto, erros):
    for ch in ('—', '–'):
        if ch in texto:
            erros.append('%s: travessao no texto' % pid)
    if not texto.isascii():
        ruim = sorted({c for c in texto if ord(c) > 127})
        erros.append('%s: caractere fora do ASCII %r' % (pid, ruim))


def main(argv):
    blocos, prompts, piloto = ler()
    expandir(blocos, prompts)
    erros = []
    if '--id' in argv:
        pid = argv[argv.index('--id') + 1]
        print(montar(pid, prompts[pid], blocos, erros))
        return 1 if erros else 0
    if '--piloto' in argv:
        ids, destino = piloto, DOCS / 'anexos' / 'prompts-piloto.txt'
    else:
        ids, destino = list(prompts), DOCS / 'anexos' / 'prompts-montados.txt'
    linhas = []
    maior = 0
    for pid in ids:
        if pid not in prompts:
            erros.append('%s: id nao encontrado' % pid)
            continue
        t = montar(pid, prompts[pid], blocos, erros)
        confere(pid, t, erros)
        maior = max(maior, len(t.split()))
        linhas.append('### %s | %d palavras | proporcao %s\n%s\n' % (pid, len(t.split()), prompts[pid].get('ar', '-'), t))
    destino.write_text('\n'.join(linhas), encoding='utf-8')
    print('%d prompts gravados em %s (maior: %d palavras)' % (len(linhas), destino, maior))
    if erros:
        print('ERROS:')
        for e in erros:
            print(' ', e)
        return 1
    print('OK: nenhum bloco faltando, nenhum travessao, tudo ASCII')
    return 0


if __name__ == '__main__':
    sys.exit(main(sys.argv[1:]))
