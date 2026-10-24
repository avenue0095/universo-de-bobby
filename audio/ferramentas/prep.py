#!/usr/bin/env python3
"""Monta items.json a partir do inventario (uniao de 5 execucoes do extrair-audio.js) + extras de nucleo.
Cada item: id, classe, idioma, texto, tipo, segs=[[lang, fala]], pad.
"""
import csv, re, json, os, sys, collections, unicodedata

D = os.environ.get('BOBBY_TRABALHO', os.path.expanduser('~/bobby-audio-trabalho'))
rows = {}
for sub in ['', 'r2', 'r3', 'r4', 'r5']:
    p = os.path.join(D, sub, 'inventario-audio.tsv')
    for r in csv.DictReader(open(p, encoding='utf8'), delimiter='\t', quoting=csv.QUOTE_NONE):
        k = r['arquivo']
        if k not in rows:
            r['rodada'] = sub or 'r1'
            rows[k] = r
        # o inventario "oficial" desta execucao e a r1; o resto so soma quadros sorteados

# ---- lote 2: falas que o app pede e nao tinham clipe (gerado por lacunas.js -> novos.json) ----
def _slug(t): return re.sub(r'^-|-$', '', re.sub(r'[^a-z0-9]+', '-', unicodedata.normalize('NFD', t.lower()).encode('ascii', 'ignore').decode()))[:32]
def _fnv(t):
    h = 0x811c9dc5
    for b in t.encode('utf8'): h = ((h ^ b) * 0x01000193) & 0xffffffff
    return '%08x' % h
_DIR = {'aula-passo': 'aula', 'capitulo-abre': 'historia', 'missao': 'missao', 'quadro-enunciado': 'quadro', 'feedback': 'sistema', 'pt-glosa': 'glosa', 'pt-letra': 'letra', 'en-alvo': 'en'}
if os.path.exists(os.path.join(D, 'novos.json')):
    for n in json.load(open(os.path.join(D, 'novos.json'))):
        cl, tx = n['classe'], n['texto']
        if cl == '?mask': cl = 'pt-glosa'
        if cl == '?letra': cl = 'pt-letra'
        if cl.startswith('?'): continue
        lg = 'en-us' if n['idioma'] == 'en-US' else 'pt-br'
        k = f"{lg}/{_DIR[cl]}/{_slug(tx)}-{_fnv(cl + tx)}.m4a"
        if k in rows: continue
        rows[k] = dict(arquivo=k, classe=cl, idioma=n['idioma'], materia=n['materia'] if cl != 'pt-glosa' else 'en', tipo_contagem='novo-lote2',
                       chars=str(len(tx)), origem=(n['origem'] if n['origem'].startswith('lote ') else 'lote 2: ' + n['origem']), texto=tx, rodada='lote2',
                       personagem=n.get('personagem'), situacao=n.get('situacao'), segs_fixos=n.get('segs'))

# orfaos: clipes cujo texto nao existe mais no app (movidos para a pasta de revisao); saem do inventario
if os.path.exists(os.path.join(D, 'orfaos.json')):
    _orf = set(json.load(open(os.path.join(D, 'orfaos.json'))))
    for _k in [k for k in rows if re.sub(r'\.m4a$', '', k) in _orf]: del rows[_k]
base_n = len(list(csv.DictReader(open(os.path.join(D, 'inventario-audio.tsv'), encoding='utf8'), delimiter='\t', quoting=csv.QUOTE_NONE)))

# ---------------- numeros por extenso (pt-BR) ----------------
U20 = ['zero','um','dois','três','quatro','cinco','seis','sete','oito','nove','dez','onze','doze','treze','catorze','quinze','dezesseis','dezessete','dezoito','dezenove']
DZ = ['','','vinte','trinta','quarenta','cinquenta','sessenta','setenta','oitenta','noventa']
CT = ['','cento','duzentos','trezentos','quatrocentos','quinhentos','seiscentos','setecentos','oitocentos','novecentos']

def ext(n):
    if n < 20: return U20[n]
    if n < 100:
        d, u = divmod(n, 10); return DZ[d] + (' e ' + U20[u] if u else '')
    if n == 100: return 'cem'
    if n < 1000:
        c, r = divmod(n, 100); return CT[c] + (' e ' + ext(r) if r else '')
    if n < 1000000:
        m, r = divmod(n, 1000)
        pre = 'mil' if m == 1 else ext(m) + ' mil'
        if r == 0: return pre
        return pre + (' e ' if (r < 100 or r % 100 == 0) else ' ') + ext(r)
    return str(n)

def dec_pt(s):
    a, b = s.split(',')
    return ext(int(a)) + ' vírgula ' + ('zero ' * (len(b) - len(b.lstrip('0'))) + ext(int(b)) if int(b) else 'zero')

E1 = ['zero','one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve','thirteen','fourteen','fifteen','sixteen','seventeen','eighteen','nineteen']
ET = ['','','twenty','thirty','forty','fifty','sixty','seventy','eighty','ninety']
def ext_en(n):
    if n < 20: return E1[n]
    if n < 100: return ET[n // 10] + ('-' + E1[n % 10] if n % 10 else '')
    if n < 1000: return E1[n // 100] + ' hundred' + (' ' + ext_en(n % 100) if n % 100 else '')
    return str(n)

def nums_pt(t):
    t = re.sub(r'(\d+,\d+)', lambda m: dec_pt(m.group(1)), t)
    t = re.sub(r'(\d+)\s*°', lambda m: m.group(1) + ' graus', t)
    t = re.sub(r'(?<![\d,])(\d+)(?![\d])', lambda m: ext(int(m.group(1))), t)
    return t

# ---------------- deteccao de ingles dentro de texto em portugues ----------------
tok_re = re.compile(r"[A-Za-zÀ-ÿ]+(?:'[A-Za-z]+)?")
def toks(s): return [m.group(0).lower() for m in tok_re.finditer(s)]

PTPURE = set()
for r in rows.values():
    if r['classe'] in ('en-alvo',): continue
    if r['materia'] == 'en' and r['classe'] in ('aula-passo', 'missao', 'capitulo-abre', 'quadro-enunciado', 'missao-fim', 'feedback'): continue
    PTPURE.update(toks(r['texto']))
ENA = set()
for r in rows.values():
    if r['classe'] == 'en-alvo': ENA.update(toks(r['texto']))
ENDICT = set(w.strip().lower() for w in open('/usr/share/dict/words', encoding='latin-1') if w.strip().isalpha())
WEAK = set("a an i me my is am are the to in on at he she it we you no yes so as or of if be by go has not his her our".split())
STOP = set("""casa mar pare dar ver ter cada era bola sala foi bom bem teta sol sede cola lia lava nada soma sino lua
pia pira fila rima tema asa uva ala ave ovo ele ela eles elas mais que quem sem com um uma uns umas aqui ali la
vem vai fica fim sim nao ate hoje agora vez nome gato rato pato mala tela vela rede dado fada nata rua sapo meia
paz luz mel otto teo rufa capi brisa fagulha embaralho bobby arcos jura curioso americana aula cantor chamar colada cueca escolar fazenda formal informal inclusive local mora pretender responde termine universal viva viver lou ed er ing ning th""".split())
ENX = {'simon', 'says', 'bobby'}  # bobby nao: nome do personagem, fica em pt
ENX.discard('bobby')
def strong(w):
    if w in STOP or w in PTPURE: return False
    return (w in ENDICT and len(w) >= 2) or w in ENA or w in ENX
def weak(w): return w in WEAK or (w in ENA and w not in PTPURE)

def seg_mixed(texto):
    """quebra um texto (ja sem digitos) em [(lang, trecho)], marcando corridas de ingles."""
    items = [(m.group(0), m.start(), m.end()) for m in tok_re.finditer(texto)]
    ws = [i[0].lower() for i in items]
    st = [strong(w) for w in ws]
    wk = [weak(w) for w in ws]
    # separador entre token i e i+1 permite continuar a corrida?
    def liga(i):
        sep = texto[items[i][2]:items[i + 1][1]]
        return re.fullmatch(r"[ ]+", sep) is not None
    en = [False] * len(items)
    for i in range(len(items)):
        if st[i]: en[i] = True
    # fracos grudados num forte vizinho
    changed = True
    while changed:
        changed = False
        for i in range(len(items)):
            if en[i] or not wk[i]: continue
            if i + 1 < len(items) and en[i + 1] and liga(i): en[i] = True; changed = True
            elif i > 0 and en[i - 1] and liga(i - 1) and not (ws[i] in ('a', 'no', 'as', 'me', 'so', 'or', 'of')): en[i] = True; changed = True
    # monta corridas
    runs = []; i = 0
    while i < len(items):
        if en[i]:
            j = i
            while j + 1 < len(items) and en[j + 1] and liga(j): j += 1
            s, e = items[i][1], items[j][2]
            m = re.match(r'[?!.,;]*', texto[e:]); e2 = e + (m.end() if m else 0)
            runs.append((s, e2)); i = j + 1
        else: i += 1
    out = []; pos = 0
    for s, e in runs:
        if s > pos: out.append(['pt-br', texto[pos:s]])
        out.append(['en-us', texto[s:e]]); pos = e
    if pos < len(texto): out.append(['pt-br', texto[pos:]])
    return out

# ---------------- limpeza para fala ----------------
LETRA = {'a':'á','b':'bê','c':'cê','d':'dê','e':'e','f':'efe','g':'gê','h':'agá','i':'i','j':'jota','k':'cá','l':'ele','m':'eme','n':'ene','o':'ó','p':'pê','q':'quê','r':'érre','s':'esse','t':'tê','u':'u','v':'vê','w':'dáblio','x':'xis','y':'ípsilon','z':'zê','ç':'cê cedilha'}

LETRA_S = dict(LETRA, e='é')

UNI = {'cm': ('centímetro', 'centímetros'), 'mm': ('milímetro', 'milímetros'), 'km': ('quilômetro', 'quilômetros'), 'kg': ('quilo', 'quilos'),
       'ml': ('mililitro', 'mililitros'), 'cl': ('centilitro', 'centilitros'), 'm': ('metro', 'metros'), 'g': ('grama', 'gramas'), 'l': ('litro', 'litros')}
DIGR = {'RR': 'érre érre', 'SS': 'esse esse', 'CH': 'cê agá', 'LH': 'ele agá', 'NH': 'ene agá', 'QU': 'quê u', 'GU': 'gê u', 'XC': 'xis cê', 'SC': 'esse cê', 'WH': 'dáblio agá', 'GH': 'gê agá', 'TH': 'tê agá'}
def caps_pt(t):
    t = re.sub(r'\bEUA\b', 'Estados Unidos', t)
    t = re.sub(r'\b(TV|tv)\b', 'tê vê', t)
    t = re.sub(r'\b[A-Z]{2}\b', lambda m: DIGR.get(m.group(0), m.group(0)), t)
    def low(m):
        w = m.group(0)
        if w in DIGR.values(): return w
        w = w.lower()
        return w[:-1] + 'ê' if (len(w) == 2 and w.endswith('e')) else w
    return re.sub(r'\b[A-ZÇÃÕÉÊÁÍÓÚ]{2,}\b', low, t)
def unidades(t, quadro=False):
    def f(m):
        n, u = m.group(1), m.group(2).lower()
        sing = n.lower() in ('1', 'um', 'uma')
        return n + ' ' + UNI[u][0 if sing else 1]
    t = re.sub(r'(?i)\b(\d+(?:,\d+)?|um|uma)\s+(cm|mm|km|kg|ml|cl|m|g|l)\b', f, t)
    t = re.sub(r'\b(cm|mm|km|kg|ml|mL|cl)\b', lambda m: UNI[m.group(1).lower()][1], t)
    if quadro: t = re.sub(r'\b(m|g|l)\b', lambda m: UNI[m.group(1)][1], t)
    t = re.sub(r'\b(L)\b', 'litros', t) if re.search(r'(?:\d|um|uma)\s+L\b', t) else t
    return t

def limpa_pt(t, quadro=False):
    t = unidades(t, quadro)
    t = re.sub(r'\bx\b', 'xis', t)
    t = caps_pt(t)
    t = t.replace('_', ' ')
    t = re.sub(r'\s*[✓✗~´]\s*', ' ', t)
    t = nums_pt(t)
    t = t.replace('→', ', vira ')
    t = re.sub(r'\s*[—–]\s*', ', ', t)
    t = re.sub(r'\s+-\s+', ', ', t)
    t = re.sub(r'\s*[“”"]\s*', ' ', t)
    t = re.sub(r'\s*[()]\s*', ', ', t)
    t = re.sub(r'\s*:\s*', ': ', t)
    t = re.sub(r'\s*/\s*', ' barra ', t)
    t = re.sub(r"(?<![A-Za-z])'|'(?![A-Za-z])", ' ', t)
    t = re.sub(r'\s+([.,;:?!])', r'\1', t)
    t = re.sub(r'([,;:])\s*([.?!])', r'\2', t)
    t = re.sub(r'(,\s*){2,}', ', ', t)
    t = re.sub(r'\s+', ' ', t).strip(' ,;')
    return t

def limpa_en(t):
    t = re.sub(r'(?i)\btv\b', 'T V', t)
    t = re.sub(r'(\d+)', lambda m: ext_en(int(m.group(1))), t)
    t = re.sub(r'\s+', ' ', t.replace('_', ' ')).strip()
    return t

def letras_soltas(t):
    """Letra maiuscula isolada em lista/soletrando (C - A - S - A, 'vogais: A, A') vira nome da letra.
    A, E, O so viram letra quando estao numa lista (virgula/traco ao lado) e nao sao 'E, mas'."""
    def f(m):
        l = m.group(1)
        pre = t[max(0, m.start() - 3):m.start()]
        pos = t[m.end():m.end() + 6]
        if l in 'AEO':
            lista = re.match(r'\s*[,—–-]', pos) or re.search(r'[,—–-]\s*$', pre)
            if not lista or re.match(r',\s*mas\b', pos): return l
        return LETRA_S[l.lower()]
    return re.sub(r'(?<![A-Za-zÀ-ÿ])([A-Z])(?![A-Za-zÀ-ÿ])', f, t)

# silabas terminadas em 'e' que aparecem fora de fim de palavra levam ê (o espeak reduz o e final isolado para 'i')
PAL = json.load(open(os.path.join(D, 'pal.json')))
_nf = set(); _fin = set()
for w in PAL:
    for j, sl in enumerate(w['s']): (_fin if j == len(w['s']) - 1 else _nf).add(sl)
SILFALA = {sl: sl[:-1] + 'ê' for sl in _nf if sl.endswith('e') and len(sl) > 1}
# ---------------- montar itens ----------------
items = []
def fp(classe):  # perfil de acolchoamento
    return 'frase' if classe in ('aula-passo', 'capitulo-abre', 'missao', 'missao-fim', 'pt-glosa', 'pt-leitura', 'en-alvo') else 'encaixe'

for k, r in rows.items():
    classe, idi, texto = r['classe'], r['idioma'], r['texto']
    if idi == 'en-US':
        segs = [['en-us', limpa_en(texto)]]
    else:
        base = texto
        if classe == 'pt-letra':
            segs = [['pt-br', LETRA[texto.lower()]]]
        else:
            if r.get('segs_fixos'):
                segs = [[lg, tx] for lg, tx in r['segs_fixos']]
            elif classe == 'pt-silaba':
                segs = [['pt-br', SILFALA.get(texto, texto)]]
            elif classe == 'pt-palavra':
                segs = [['pt-br', texto]]
            else:
                t = base
                if r['materia'] == 'pt' and classe in ('aula-passo', 'missao', 'quadro-enunciado', 'pt-leitura'):
                    t = letras_soltas(t)
                parts = seg_mixed(t) if r['materia'] == 'en' else [['pt-br', t]]
                segs = []
                for lg, tx in parts:
                    tx = limpa_pt(tx, classe == 'quadro-enunciado') if lg == 'pt-br' else limpa_en(re.sub(r'\s+', ' ', tx))
                    if re.search(r'[A-Za-zÀ-ÿ0-9]', tx): segs.append([lg, tx])
    segs = [s for s in segs if s[1].strip()]
    # arquivo sem extensao
    aid = re.sub(r'\.m4a$', '', k)
    items.append(dict(id=aid, classe=classe, idioma=idi, materia=r['materia'], tipo=r['tipo_contagem'], origem=r['origem'],
                      texto=texto, segs=segs, pad=fp(classe), inventario=(r['rodada'] != 'lote2'), rodada=r['rodada'],
                      personagem=r.get('personagem'), situacao=r.get('situacao')))

# ---------------- extras de nucleo (nao estao no TSV; necessarios para o audio composto) ----------------
def slug(t): return re.sub(r'^-|-$', '', re.sub(r'[^a-z0-9]+', '-', unicodedata.normalize('NFD', t.lower()).encode('ascii', 'ignore').decode()))[:32]
def fnv(t):
    h = 0x811c9dc5
    for b in t.encode('utf8'): h = ((h ^ b) * 0x01000193) & 0xffffffff
    return '%08x' % h
def extra(classe, dirn, texto, fala=None, idi='pt-BR', pad='encaixe', origem='nucleo (spec 9.2/9.3)'):
    lg = 'pt-br' if idi == 'pt-BR' else 'en-us'
    aid = f'{lg}/{dirn}/{slug(texto)}-{fnv(classe + texto)}'
    if any(i['id'] == aid for i in items): return
    items.append(dict(id=aid, classe=classe, idioma=idi, materia='core', tipo='extra', origem=origem, texto=texto,
                      segs=[[lg, fala or texto]], pad=pad, inventario=False, rodada='extra'))

for n in list(range(0, 20)) + [30, 40, 50, 60, 70, 80, 90, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000]:
    pass
palavras_num = ['zero','um','dois','três','quatro','cinco','seis','sete','oito','nove','dez','onze','doze','treze','catorze','quinze','dezesseis','dezessete','dezoito','dezenove',
                'vinte','trinta','quarenta','cinquenta','sessenta','setenta','oitenta','noventa','cem','cento','duzentos','trezentos','quatrocentos','quinhentos','seiscentos','setecentos','oitocentos','novecentos',
                'mil','e','vírgula','reais','real','centavos','centavo','uma','duas','menos','por cento']
for w in palavras_num: extra('numero', 'numero', w, fala=('i' if w == 'e' else None))
for n in ['Lívia','Enrico','Ana','Beto','Clara','Davi','Elisa','Théo','Manu','Rafa','Nina','Caio']: extra('nome', 'nome', n)
for d, f in [('ch', 'chê'), ('lh', 'ê lh'), ('nh', 'ê nh'), ('rr', 'érre érre'), ('ss', 'esse esse'), ('qu', 'quê u'), ('gu', 'gê u')]:
    pass  # digrafos: o nome falado em portugues e o das duas letras; deixado fora (decisao registrada no LEIA-ME)
for t in ['Isso aí!', 'Boa!', 'Perfeito!', 'Mandou bem!', 'Certinho!', 'Show!', 'Quase!']:
    extra('feedback', 'sistema', t, pad='frase', origem='index.html: feedback de resposta')

ign = [i for i in items if not i['segs']]
json.dump(ign, open(os.path.join(D, 'ignorados.json'), 'w'), ensure_ascii=False, indent=0)
items = [i for i in items if i['segs']]
json.dump(items, open(os.path.join(D, 'items.json'), 'w'), ensure_ascii=False, indent=0)
print('ignorados (sem fala):', [(i['id'], i['texto']) for i in ign])
c = collections.Counter((i['idioma'], i['inventario']) for i in items)
print('base r1:', base_n, '| uniao:', sum(1 for i in items if i['inventario']), '| extras:', sum(1 for i in items if not i['inventario']))
print(c)
mixed = [i for i in items if len({s[0] for s in i['segs']}) > 1]
print('itens com troca de idioma:', len(mixed))
json.dump(mixed, open(os.path.join(D, 'mistos.json'), 'w'), ensure_ascii=False, indent=0)
