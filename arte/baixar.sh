#!/bin/bash
# uso: baixar.sh NOME URL   (grava arte/fonte/NOME.jpg; completa o '=' final da assinatura)
cd "$(dirname "$0")/fonte"
u="$2"; [[ "$u" == *= ]] || u="$u="
curl -s -o "$1.jpg" -w "$1 %{http_code} %{size_download}\n" "$u"
