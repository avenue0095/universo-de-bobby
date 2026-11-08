#!/bin/bash
# uso: baixar-lote.sh PREFIXO  < urls.txt   -> fonte/PREFIXO-v1..vN.jpg (numeracao continua a partir do maior existente)
cd "$(dirname "$0")/fonte"
p="$1"; n=$(ls ${p}-v*.jpg 2>/dev/null | sed -E "s/.*-v([0-9]+)\.jpg/\1/" | sort -n | tail -1); n=${n:-0}
while read -r u; do [ -z "$u" ] && continue; n=$((n+1)); [[ "$u" == *= ]] || u="$u="; curl -s -o "${p}-v$n.jpg" -w "${p}-v$n %{http_code} %{size_download}\n" "$u"; done
