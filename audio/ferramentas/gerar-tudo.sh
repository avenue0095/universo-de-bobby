#!/bin/bash
# Regera todo o audio do Bobby. Rode da pasta audio/ferramentas. Leva cerca de 15 a 50 minutos, conforme o Mac estiver livre.
# Pre-requisitos: Node, ffmpeg (com libopus), espeak-ng do Homebrew, e um venv Python 3.12 com kokoro-onnx, numpy e onnxruntime.
# O modelo (kokoro-v1.0.int8.onnx) e voices-v1.0.bin ficam em $BOBBY_VOZ/modelos/kokoro-onnx-v1.0/ (SHA256 em LEIA-ME.md).
set -e
export BOBBY_TRABALHO="${BOBBY_TRABALHO:-$HOME/bobby-audio-trabalho}"
export BOBBY_VOZ="${BOBBY_VOZ:-$HOME/voz-kokoro}"
PY="${PY:-$BOBBY_VOZ/venv/bin/python}"
REPO="$(cd ../.. && pwd)"
mkdir -p "$BOBBY_TRABALHO"
# 1) inventario: 5 sorteios do extrator (os quadros de enunciado variam; a uniao evita faltar clipe)
for r in "" r2 r3 r4 r5; do mkdir -p "$BOBBY_TRABALHO/$r"; cp extrair-audio.js "$BOBBY_TRABALHO/$r/"; (cd "$BOBBY_TRABALHO/$r" && node extrair-audio.js "$REPO/index.html" | tail -3); done
(cd "$BOBBY_TRABALHO" && node "$OLDPWD/gerar-pal.js" "$REPO/index.html")
# 2) texto -> itens (numeros por extenso, ingles dentro de frase em portugues, siglas, unidades)
python3 prep.py
# 3) voz: 2 processos; o segundo vai de tras para a frente (retomavel: pula o que ja existe)
OMP_NUM_THREADS=4 "$PY" synth.py 0 2 & REV=1 "$PY" synth.py 1 2 & wait
"$PY" synth.py 0 1   # fecha o que sobrou
# 4) corte de silencio, normalizacao, Opus 24k e AAC 28k
NPROC=6 AAC_K=28k python3 post.py
# 5) medicao e manifestos
NPROC=6 python3 verifica.py && python3 manifesto.py
