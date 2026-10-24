"""Minificador conservador, sem dependencias (Python 3), para o build do index.html.

JS: tira comentarios, recuo, linhas em branco e espaco no fim da linha. Mantem as quebras de linha (nada de ASI arriscado), cuida de
    strings, template literals (com ${...} aninhado) e expressoes regulares. Nao renomeia nada.
CSS: tira comentarios e espacos que nao fazem diferenca (em volta de { } ; , e depois de :), sem mexer em strings nem em url().
Uso: pelo build.py. Teste: node testes/minificar.js confere que a minificacao nao muda o comportamento (mesmos tokens fora de comentarios)."""
import re

_ANTES_REGEX = set('(,=:[!&|?{};+-*%<>~^')
_PALAVRAS_REGEX = {'return', 'typeof', 'case', 'in', 'of', 'delete', 'void', 'throw', 'new', 'else', 'do', 'instanceof', 'yield', 'await'}


def minificar_js(src):
    out = []
    n = len(src)
    ult = ''          # ultimo caractere significativo emitido
    palavra = ''      # ultima palavra emitida (para decidir regex)

    def emite(t):
        nonlocal ult, palavra
        out.append(t)
        for ch in t:
            if not ch.isspace():
                ult = ch

    def varre(i, fecha_chave):
        """Varre codigo a partir de i; se fecha_chave, para na chave que fecha o ${ } corrente. Devolve o indice depois."""
        nonlocal ult, palavra
        prof = 0
        while i < n:
            c = src[i]
            c2 = src[i:i + 2]
            if c2 == '//':
                j = src.find('\n', i)
                i = n if j < 0 else j
                continue
            if c2 == '/*':
                j = src.find('*/', i + 2)
                j = n if j < 0 else j + 2
                if '\n' in src[i:j] and out and not ''.join(out[-1:]).endswith('\n'):
                    out.append('\n')
                i = j
                continue
            if c in '\'"':
                j = i + 1
                while j < n and src[j] != c:
                    j += 2 if src[j] == '\\' else 1
                emite(src[i:j + 1])
                i = j + 1
                palavra = ''
                continue
            if c == '`':
                i = template(i)
                palavra = ''
                continue
            if c == '/':
                # regex ou divisao?
                if ult == '' or ult in _ANTES_REGEX or palavra in _PALAVRAS_REGEX:
                    j = i + 1
                    classe = False
                    while j < n:
                        d = src[j]
                        if d == '\\':
                            j += 2
                            continue
                        if d == '[':
                            classe = True
                        elif d == ']':
                            classe = False
                        elif d == '/' and not classe:
                            break
                        j += 1
                    j += 1
                    while j < n and (src[j].isalpha()):
                        j += 1
                    emite(src[i:j])
                    i = j
                    palavra = ''
                    continue
                emite(c)
                i += 1
                palavra = ''
                continue
            if c == '\n':
                # apara espaco no fim da linha, junta linhas em branco, tira o recuo da proxima linha
                while out and out[-1] and out[-1][-1] in ' \t' and out[-1].strip() == '':
                    out.pop()
                if out and out[-1] and out[-1][-1] in ' \t':
                    out[-1] = out[-1].rstrip(' \t')
                if out and out[-1] != '\n':
                    out.append('\n')
                i += 1
                while i < n and src[i] in ' \t\r':
                    i += 1
                continue
            if c == '{' and fecha_chave:
                prof += 1
            if c == '}' and fecha_chave:
                if prof == 0:
                    return i
                prof -= 1
            if c.isalnum() or c in '_$':
                j = i
                while j < n and (src[j].isalnum() or src[j] in '_$'):
                    j += 1
                palavra = src[i:j]
                emite(palavra)
                i = j
                continue
            emite(c)
            if not c.isspace():
                palavra = ''
            i += 1
        return i

    def template(i):
        nonlocal ult
        out.append('`')
        i += 1
        while i < n:
            c = src[i]
            if c == '\\':
                out.append(src[i:i + 2])
                i += 2
                continue
            if c == '`':
                out.append('`')
                ult = '`'
                return i + 1
            if c == '$' and src[i + 1:i + 2] == '{':
                out.append('${')
                i = varre(i + 2, True)
                out.append('}')
                i += 1
                continue
            out.append(c)
            i += 1
        return i

    varre(0, False)
    return ''.join(out).strip('\n') + '\n'


def minificar_css(src):
    # strings e url() ficam intactos: troca por marcas, minifica, devolve
    guardados = []

    def guarda(m):
        guardados.append(m.group(0))
        return '\x00%d\x00' % (len(guardados) - 1)

    t = re.sub(r'"(?:\\.|[^"\\])*"|\'(?:\\.|[^\'\\])*\'|url\([^)]*\)', guarda, src)
    t = re.sub(r'/\*.*?\*/', '', t, flags=re.S)
    t = re.sub(r'\s+', ' ', t)
    t = re.sub(r' ?([{};,>]) ?', r'\1', t)
    t = re.sub(r':\s+', ':', t)
    t = t.replace(';}', '}')
    t = re.sub(r'\x00(\d+)\x00', lambda m: guardados[int(m.group(1))], t)
    return t.strip() + '\n'
