# Áudio gravado de O Universo de Bobby

Gerado em 24/10/2026. Voz provisória, 100% local, custo R$ 0. Nenhum texto saiu do Mac.

## O que tem aqui

| Item | Valor |
|---|---|
| Clipes | 3.622 (pt-BR 3.185, en-US 437) |
| Duração total | 3 h 14 min |
| Tamanho em Opus (24 kbps, mono) | 35,1 MB |
| Tamanho em AAC (.m4a, 24 kbps, mono) | 41,7 MB |
| Manifesto completo | `manifesto.json` (cerca de 2,4 MB): texto, arquivo, idioma, voz, duração, tamanho, hash do texto |
| Manifesto para o app | `manifesto-min.json` (213 KB): pacotes `core`, `mat`, `pt`, `en` com `[ms, bytes_opus, bytes_m4a]` por clipe |

Cada clipe existe em dois formatos, lado a lado: `pt-br/aula/<slug>-<fnv8>.opus` e `pt-br/aula/<slug>-<fnv8>.m4a`. A chave do manifesto é o caminho sem extensão. O nome segue a seção 9.4 da especificação (slug de 32 caracteres e hash FNV-1a de `classe + texto`), com a extensão trocada, e as pastas em minúsculas (`pt-br`, `en-us`), como no inventário.

Pacotes (seção 9.4): `core` 171 clipes, `mat` 825, `pt` 1.074, `en` 1.552. Os valores por pacote e por formato estão em `manifesto-min.json`.

## Voz, velocidade e motor

| Idioma | Voz | Velocidade | Motor |
|---|---|---|---|
| Português do Brasil | `pm_alex` | 0,9 | Kokoro-82M v1.0, ONNX int8, CPU |
| Inglês americano | `am_michael` | 0,9 | idem |

Escolhi 0,9 nos dois porque é a ponta lenta da faixa aprovada (0,9 a 1,0), mais próxima do ritmo que o app usa hoje (0,92 em português) e melhor para criança. Medido: cerca de 15 caracteres por segundo em português. Esta escolha foi feita por medida, sem ouvir: o Filipe ainda precisa ouvir. Se achar rápida ou lenta, é só mudar `VOZ` em `ferramentas/synth.py` e regerar.

Modelo fixado por hash (SHA256): `kokoro-v1.0.int8.onnx` = `6e742170d309016e5891a994e1ce1559c702a2ccd0075e67ef7157974f6406cb`; `voices-v1.0.bin` = `bca610b8308e8d99f32e6fe4197e7ec01679264efed0cac9140fe9c29f1fbf7d`.

## Licença

Kokoro e a conversão kokoro-onnx são Apache 2.0 (código da conversão em MIT), uso comercial permitido. Fonte e conferência em `docs/VOZ-GRATIS-TESTE.md`, seção 2.

Ressalva que continua aberta: o README do Kokoro diz que o treino usou áudio sintético gerado por TTS fechados de grandes empresas. Não há restrição de uso comercial declarada, mas não dá para eliminar daqui o risco de os termos desses provedores serem invocados. Risco baixo, não zero. Antes de vender o app, vale um parecer rápido de advogado. As dependências de geração (phonemizer e espeak-ng, GPL) não vão no app, só os arquivos de áudio.

Guarde junto do app uma cópia do texto da licença Apache 2.0.

## A voz é provisória

Vale até o Filipe ouvir e aprovar. Se ele quiser pagar por algo mais próximo da Will (ElevenLabs), a troca é regerar o lote com a nova voz: `v` do manifesto sobe para 2, a pasta do app passa a `voz/v2/` e os nomes de arquivo continuam os mesmos, porque dependem só do texto. Alternativas sem custo estão em `docs/VOZ-GRATIS-TESTE.md`, seção 7 (por exemplo, testar o modelo fp32 e baixar o tom 1 a 2 semitons).

## Formato: qual usar

A especificação (seção 9.5) manda AAC-LC `.m4a` como padrão e só aceita Opus depois de teste em aparelho, porque o suporte do Safari e do iOS a Opus não foi verificado. Mantive isso: o lote tem os dois. Recomendação:

1. Integrar primeiro com `.m4a` (toca em todo Android e iPhone).
2. Testar `.opus` num iPhone real com `decodeAudioData`. Se passar, trocar e economizar cerca de 6 MB.
3. Não gerei MP3, porque o AAC cobre o iOS antigo e a spec não pede MP3.

O pacote que vai no aparelho é um formato só. Em Opus fica em 35,1 MB e em AAC em 41,7 MB, os dois dentro da meta de 32 a 45 MB (para isso baixei o AAC de 32 para 24 kbps depois do lote 2; fala em 24 kbps AAC-LC mono é aceitável, mas vale ouvir).

## Tratamento do áudio

- Silêncio do início e do fim cortado (limiar de menos 48 dBFS por quadros de 10 ms), fade de 6 ms nas pontas.
- Volume: alvo de menos 16 LUFS (medido com `ebur128`; clipes curtos são repetidos até 2 s só para medir), ganho único por clipe e limitador a menos 1,5 dBFS. Resultado medido nos arquivos finais: mediana menos 16,3 LUFS, 90% entre menos 17,1 e menos 15,6; extremos menos 18,4 e menos 14,7 (clipes muito curtos oscilam mais). Não usei o `loudnorm` em duas passadas porque ele não mede clipes de menos de 1 s, e aqui há centenas.
- Preenchimento: frases (aula, missão, capítulo, glosa, leitura, feedback, frase em inglês) com 150 ms no início e 250 ms no fim; palavras soltas de inglês 150 ms e 300 ms; clipes feitos para compor áudio (quadros, números, nomes, letras, sílabas, palavras de português) com 30 ms e 60 ms, para a fila não ficar picotada.

## Como o texto virou fala

O texto de cada clipe vem do inventário (`ferramentas/extrair-audio.js` sobre o `index.html`), sem tocar nele. Antes da voz, `ferramentas/prep.py` faz:

- Números em português por extenso (`3,5` vira "três vírgula cinco"; `90°` vira "noventa graus"), em inglês por extenso nas frases em inglês.
- Inglês dentro de frase em português: o texto é cortado em trechos por idioma (266 clipes têm troca). Trechos em inglês saem na voz `am_michael`, o resto na `pm_alex`, com 80 ms entre eles. A detecção é por dicionário (palavras em inglês que nunca aparecem em texto de matemática ou português), com lista de exceções; não há marcação no inventário. A grafia fonética em português das aulas ("uân", "tchú") fica na voz portuguesa, de propósito.
- Siglas e unidades: `cm`, `kg`, `km`, `mL` e afins viram a palavra; `x` vira "xis"; `RR`, `CH`, `LH`, `NH` e afins viram o nome das letras; `EUA` vira "Estados Unidos"; `TV` vira "tê vê"; sílabas e palavras em maiúscula (`CASA`, `CA`) viram minúscula para serem lidas como palavra.
- Letras: nome da letra por extenso (`dáblio`, `ípsilon`, `érre`); a letra `e` sai como "é". O motor lê `é` isolado como "e agudo", então esse caso é escrito `e`.
- Sílabas terminadas em `e` que aparecem no meio de palavra levam `ê` ("de" vira "dê"), porque o motor reduz o `e` final isolado para "i". As que só aparecem no fim de palavra (por exemplo a de "peixe") ficam como estão.
- O "e" dos números ("vinte e três") é gravado como "i", que é como se fala.

## Cobertura

- Inventário: 2.831 linhas na execução usada como fonte. O extrator sorteia os quadros de enunciado a cada execução (954 a 967 textos), então rodei 5 vezes e gerei a união: 2.862 textos do inventário, 2.861 com fala. O lote 1 teve 2.929 clipes (hoje 3.622, com o lote 2 descrito mais abaixo) e inclui 68 extras que não estão no inventário e o app vai precisar (ver abaixo). Cobertura do lote 1 conferida por script: todo texto do inventário da execução principal tem arquivo, exceto 1.
- Exceção: o quadro `pt-br/quadro/-e04e25bc` tem texto `__` (só lacuna, nada para falar). Não foi gerado e está em `ignorados` no `manifesto.json`. O teste de cobertura do build tem que ignorar esse.
- Extras (68), fora do TSV, necessários para o áudio composto da seção 9.2: 49 clipes de número (0 a 19, dezenas, cem, cento, centenas, mil, "e", "vírgula", "reais", "real", "centavos", "centavo", "uma", "duas", "menos", "por cento"), 12 nomes das personagens dos problemas e 7 frases de feedback ("Isso aí!", "Boa!", "Perfeito!", "Mandou bem!", "Certinho!", "Show!", "Quase!"). Os dígrafos (`ch`, `lh`, `nh`, `rr`, `ss`) não ganharam clipe próprio: nos textos de aula eles já saem pelo nome das letras. Se o player precisar deles como encaixe, é um item novo no `prep.py`.
- Nada mudo: nenhum arquivo com menos de 0,2 s ou volume médio abaixo de menos 45 dB, nos dois formatos. Nenhum silêncio interno acima de 1,2 s. Nenhum clipe com ritmo fora do esperado, exceto 13 passos de aula de inglês em forma de lista ("dog (cachorro), cat (gato)"), lentos por causa da troca de voz.

## O que ouvir primeiro (pontos fracos conhecidos)

1. Ritmo e melodia do português: a fonética é correta para pt-BR, mas pode soar como estrangeiro lendo. Só o ouvido confirma.
2. Números compostos: "vinte e três" é a fila de clipes "vinte", "i", "três". A queda de entonação de cada palavra isolada pode soar picotada. Se soar, a spec 9.2 prevê gravar 0 a 1.000 inteiros (cerca de 1,5 MB).
3. Palavras de inglês soltas e muito curtas (`no`, `hi`, `pen`): o modelo avisa que vai pior em frase curta.
4. Troca de idioma no meio da frase: confira 10 ou 15 passos de aula de inglês.
5. `uma` e `duas` existem como clipe, mas o enunciado concordar em gênero ("duas bolinhas") depende do que o player escolher.
6. Quadros de enunciado têm pares que só diferem pelo sublinhado (`_ the` e `the`): saem como dois arquivos quase iguais. Sem prejuízo, 20 a 30 KB.
7. Palavras como `off` ("20 por cento off") e `is` saem na voz portuguesa.

## Como regerar

Tudo está em `ferramentas/`. `gerar-tudo.sh` roda a sequência inteira: inventário (5 sorteios), preparo do texto, voz, tratamento, medição e manifestos. Pré-requisitos: Node, ffmpeg com libopus, espeak-ng do Homebrew (o espeak empacotado na wheel falha neste Mac), um venv Python 3.12 com `kokoro-onnx`, `numpy` e `onnxruntime`, e os dois arquivos do modelo (SHA256 acima). Variáveis: `BOBBY_VOZ` (pasta com `modelos/kokoro-onnx-v1.0/`), `BOBBY_TRABALHO` (pasta de trabalho com `items.json` e os WAV, fora do repositório), `BOBBY_AUDIO` (padrão: esta pasta). Em Mac livre, cerca de 10 a 15 minutos de voz; com o Mac ocupado, até 50. Gera 3,2 horas de WAV (cerca de 560 MB) na pasta de trabalho; o que já existe é pulado, então dá para regerar só uma parte apagando os WAV correspondentes. Importante: a lista de palavras em inglês usa `/usr/share/dict/words` do macOS.

Os scripts de `ferramentas/` foram copiados da pasta de trabalho desta geração e só tiveram os caminhos trocados por variáveis; a sequência completa por `gerar-tudo.sh` não foi reexecutada em bloco. Os WAV originais ficaram numa pasta temporária da sessão e podem sumir.

## Lote 2 (24/10/2026): falas que o app pede e faltavam

O teste de cobertura do repositório (`testes/cobertura-audio.js`) e uma varredura própria (`ferramentas/lacunas.js`, somente leitura sobre o app) apontaram textos falados sem clipe. Foram gerados 693 clipes novos, com a mesma voz, velocidade, tratamento e convenção de nome:

- 16 falas novas da Fase 2, como frase inteira na classe `feedback` (pasta `sistema`, pacote `core`): os 13 bilhetes do Bobby, "Por hoje chega! Você fez um ótimo trabalho." e os dois avisos de troca ("10 unidades viraram 1 dezena!", "10 dezenas viraram 1 centena!").
- 660 quadros novos (`quadro-enunciado`): 599 vêm das dicas ("Como fazer", que usa o texto do passo da aula e os modelos com número), 57 da "Ajuda extra" ("Tirei N respostas erradas...", "A resposta começa com...", etc.) e 4 de Português por amostragem (por exemplo "professora canta com", "vovó come com o amigo é uma frase completa").
- 16 grafias fonéticas em português usadas nas dicas de inglês ("rái", "uân", "tchú", "iór uélcam"...), na classe `pt-glosa`, e a letra `ç` ("cê cedilha"), na classe `pt-letra`.

Amostragem: 6 semeaduras de 200 rodadas por fase (duas por execução, três execuções) e depois mais 2 de 60 para conferir. A lista de lacunas parou de crescer (as dicas fecharam em 599 quadros). Teste de cobertura do repositório com 200 rodadas por fase, semente 7: 24.370 textos distintos, 100% com clipe, 0 trechos sem clipe, 0 de 16 falas novas sem clipe. `npm test` passa inteiro.

Observações: as dicas viram quadros longos sem pontuação (o corte do app tira a pontuação), então saem sem as pausas de frase; vale ouvir 3 ou 4. Os quadros do lote 2 que são só um pedaço de aula ou dica de inglês passam pela mesma detecção de inglês dos demais. A conferência final está em `manifesto.json` e `manifesto-min.json`, que ficam coerentes entre si: mesmas chaves, mesmos pacotes, mesmos tamanhos.

## Integração (próxima etapa, outro agente)

- O player e o cache do service worker devem ler `manifesto-min.json` e tocar via Web Audio, como na seção 9.7.
- Para o corte em quadros funcionar, o texto do quadro tem que ser o mesmo que o `extrair-audio.js` produz (minúsculas, sem pontuação). Qualquer mudança nesse corte pede regerar os quadros.
- Texto novo ou alterado no app muda o hash do nome. Rode o inventário de novo, o `prep.py` e o `synth.py`: só o que for novo é gerado.
