# Teste de voz grátis para o áudio gravado do Bobby

Data: 24/10/2026. Objetivo: achar uma voz masculina grátis, com licença que permita uso comercial e redistribuição do áudio dentro do app, parecida com a "Will - Natural Conversations" (ElevenLabs, tom médio de 104 a 127 Hz).

**Aviso importante sobre a nota de naturalidade.** Quem rodou o teste foi um agente que não ouve áudio. As notas abaixo são estimativas feitas a partir de medidas (variação de tom, ritmo de fala), da transcrição fonética que o motor usa e da nota pública do autor do Kokoro. Elas NÃO substituem o ouvido do Filipe. Os arquivos de amostra estão prontos para ele ouvir e dar a nota final.

## 1. Resumo

| Item | Resultado |
|---|---|
| Voz grátis com licença comercial limpa, em português do Brasil | Só o Kokoro (pm_alex, pm_santa, pf_dora), com uma ressalva |
| Voz grátis com licença comercial limpa, em inglês americano | Kokoro (am_michael, am_adam, am_fenrir, af_heart, af_bella, af_nicole), com a mesma ressalva |
| Todas as vozes Piper em português (faber, cadu, jeff, edresson) | Fora: herdam treino de base com licença de pesquisa ou não comercial |
| Voz mais próxima do Will em tom | am_michael (118 Hz, dentro da faixa 104 a 127 Hz) |
| Custo | R$ 0 |
| Lote de 2.823 textos (~128 mil caracteres) | Cerca de 15 a 25 minutos neste Mac, uma voz só |
| Tamanho final em Opus (24 kbps, mono) | Cerca de 23 a 25 MB |
| Veredito | Serve como áudio provisório e para prova de conceito. Soar como o Will, não soa. Decisão final depende do ouvido do Filipe |

## 2. Licenças (conferidas na fonte antes de baixar)

Veredito: **OK** = comercial permitido; **OK com ressalva**; **NÃO**; **incerto** (tratado como NÃO, não entrou nas amostras).

### 2.1 Kokoro

| Item | Licença | Fonte | Veredito |
|---|---|---|---|
| Modelo Kokoro-82M v1.0 | Apache 2.0 | https://huggingface.co/hexgrad/Kokoro-82M (cabeçalho e README: "Apache-licensed weights ... deployed in numerous projects and commercial APIs") | OK |
| Conversão ONNX e voices-v1.0.bin (kokoro-onnx) | MIT (código) e Apache 2.0 (modelo) | https://github.com/thewh1teagle/kokoro-onnx (LICENSE e README, seção License) | OK |
| Vozes pm_alex, pm_santa, pf_dora (pt-BR) | Cobertas pelo Apache 2.0 do repositório. O VOICES.md lista as três sem licença própria | https://huggingface.co/hexgrad/Kokoro-82M/blob/main/VOICES.md | OK com ressalva |
| Vozes am_michael, am_adam, am_fenrir, af_heart, af_bella, af_nicole | Idem | mesma fonte | OK com ressalva |

Ressalva dos dados de treino (README do Kokoro, seção Training Details): o modelo foi treinado "exclusivamente com áudio permissivo ou não protegido por direito autoral", incluindo domínio público, áudio sob Apache/MIT e **áudio sintético gerado por TTS fechados de grandes empresas**. A única lista de atribuição CC BY é de japonês (Koniwa) e francês (SIWIS), que não afeta as vozes em pt e en. Não há restrição de uso comercial declarada. O que fica em aberto é se os termos dos provedores que geraram o áudio sintético poderiam ser invocados contra quem usa o modelo. Risco baixo, mas não zero, e eu não consigo eliminá-lo daqui. Para o app que será vendido, vale um parecer rápido de advogado antes do lançamento.

Dependências usadas só para gerar o áudio (não vão no app, o app leva apenas os arquivos de áudio): kokoro-onnx (MIT), onnxruntime (MIT), phonemizer (GPLv3+) e espeak-ng (GPLv3). O GPL cobre o programa, não o áudio que ele produz. Ele só viraria problema se o app embutisse o espeak-ng para gerar voz no aparelho, que não é o caso de áudio pré-gravado.

### 2.2 Piper (rhasspy/piper-voices)

O repositório inteiro está marcado como MIT em https://huggingface.co/rhasspy/piper-voices, mas cada voz tem o seu MODEL_CARD com a licença do dataset e, quando existe, a voz de onde foi refinada (finetuned). Consultei os cards em `https://huggingface.co/rhasspy/piper-voices/raw/main/<idioma>/<voz>/MODEL_CARD`.

A licença de base que contamina várias vozes: o dataset **Lessac / Blizzard 2013** é distribuído sob "Research Licence Agreement" e a definição de "Research Purposes" exclui expressamente "qualquer finalidade comercial, incluindo o desenvolvimento, marketing, comercialização, venda ou licenciamento de produtos ou serviços de síntese de voz" (https://www.cstr.ed.ac.uk/projects/blizzard/2013/lessac_blizzard2013/license.html). Toda voz "finetuned from lessac" parte de um checkpoint treinado nesse dado.

| Voz | Licença do dataset | Treino de base | Veredito |
|---|---|---|---|
| pt_BR faber, cadu, jeff (medium) | CC0 (OHF-Voice/voice-datasets) | Refinada da voz en_US lessac | **incerto** (CC0 no dado novo, mas o checkpoint de base é de licença só pesquisa) |
| pt_BR edresson (low) | CC BY 4.0 (TTS-Portuguese-Corpus) | Refinada da voz en_US ryan | **NÃO** (ryan é CC BY-NC-SA 4.0) |
| en_US ryan high | CC BY-NC-SA 4.0 | n/d | **NÃO** (não comercial) |
| en_US lessac | Licença Blizzard 2013 (só pesquisa) | n/d | **NÃO** |
| en_US amy | "See URL" (Mimic3 voices) | Refinada de lessac | **incerto** |
| en_US hfc_male | CC BY-NC-SA 4.0 | Refinada de lessac | **NÃO** |
| en_US libritts_r | CC BY 4.0 | "Fine-tuned from English lessac medium" | **incerto** (dado livre, base de pesquisa) |
| en_US norman (medium) | Domínio público (LibriVox) | Treinada do zero, 15,5 h | OK. Não baixada (63,5 MB, estouraria o teto de 150 MB) |
| en_US bryce, kristin, john (medium) | Domínio público | john vem de kristin; bryce de uma voz não publicada | OK provável, a conferir. Não baixadas (63,5 MB cada) |

Consequência prática: **nenhuma voz Piper em português passa no critério "licença comercial limpa"**. A faber, que o Filipe já tem no Mac, também cai em "incerto". Para o app vendido, não use faber, cadu nem jeff sem um parecer jurídico sobre a herança do checkpoint.

Observação: gerei, só como **régua de comparação**, 4 frases com a faber que já estava instalada (sem baixar nada). Estão numa pasta separada e marcada `NAO-APROVADA`. Não são candidatas.

## 3. O que foi baixado e como

Tudo em pastas novas, só de fontes oficiais:

| Item | Fonte | Tamanho |
|---|---|---|
| kokoro-v1.0.int8.onnx | GitHub thewh1teagle/kokoro-onnx, release model-files-v1.0 | 92,4 MB |
| voices-v1.0.bin | idem | 28,2 MB |
| Wheels PyPI (kokoro-onnx, onnxruntime, numpy, phonemizer, espeakng-loader e dependências) | PyPI, num venv novo | Estimo 30 a 45 MB (não medi o download exato; o venv instalado ocupa 155 MB) |

Total estimado: 150 a 165 MB, ligeiramente acima do teto "~150 MB". Foi usada a variante int8 (a menor) justamente para caber. Ela tem qualidade um pouco menor que a versão fp32 de 325 MB, que não coube. Isso pode estar piorando um pouco o resultado, e vale um novo teste com a fp32 antes de descartar o Kokoro.

Nenhum binário foi executado a não ser as wheels do PyPI. Usei o piper e o espeak-ng que já estavam no Mac (Homebrew), sem alterar nada. A biblioteca espeak-ng empacotada na wheel (`espeakng-loader`) falhou neste Mac ("Error processing file ... phontab"), então o gerador aponta para o espeak-ng do Homebrew. Isso fica registrado no script.

Local dos modelos: `/private/tmp/claude-501/-Users-filipealvesesilva-Documents-segundo-cerebro/564d3475-532d-49cb-8cab-1927849100da/scratchpad/voz/modelos/kokoro-onnx-v1.0/`. Scripts em `.../scratchpad/voz/scripts/`. Pasta temporária da sessão: se quiser guardar, mova para um lugar fixo.

## 4. Resultados por voz

Frases iguais em todas as vozes (4 em português, 4 em inglês). Velocidade 1.0, exceto as variantes `_v09` (0.9). O tempo de geração é do Kokoro int8 em CPU neste Mac, com o modelo já carregado.

| Voz | Idioma | Tom médio f0 (Hz) | Dentro de 104 a 127 Hz? | Geração por frase (mediana) | Tempo gerar / tempo de áudio | Fala (caracteres/s) | Variação de tom (semitons) | Opus das 4 frases | Nota de naturalidade (estimada, sem ouvir) |
|---|---|---|---|---|---|---|---|---|---|
| pm_alex | pt-BR | 132 | Quase (5 Hz acima) | 0,36 s | 0,12 | 16,7 | 3,1 | 36 KB | 5 |
| pm_santa | pt-BR | 142 | Não | 0,38 s | 0,12 | 16,4 | 3,2 | 37 KB | 5 |
| pf_dora (feminina) | pt-BR | 176 | Não | 0,36 s | 0,12 | 16,9 | 2,9 | 36 KB | 5 |
| pm_alex_v09 | pt-BR | 133 | Quase | 0,42 s | 0,12 | 15,6 | 3,3 | 39 KB | 5 |
| am_michael | en-US | 118 | **Sim** | 0,38 s | 0,17 | 15,0 | 2,7 | 28 KB | 6 |
| am_michael_v09 | en-US | 118 | **Sim** | 0,35 s | 0,14 | 13,9 | 2,7 | 31 KB | 6 |
| am_adam | en-US | 123 | **Sim** | 0,31 s | 0,16 | 17,4 | 2,9 | 25 KB | 4 |
| am_fenrir | en-US | 141 | Não | 0,27 s | 0,15 | 19,1 | 4,3 | 22 KB | 5 |
| af_heart (feminina) | en-US | 199 | Não | 0,28 s | 0,14 | 17,2 | 3,0 | 24 KB | 7 |
| af_bella (feminina) | en-US | 196 | Não | 0,32 s | 0,15 | 16,8 | 2,3 | 25 KB | 6 |
| af_nicole (feminina) | en-US | 145 | Não | 0,41 s | 0,14 | 11,8 | 2,2 | 34 KB | 5 |
| (ref.) Piper faber, NÃO aprovada | pt-BR | 150 | Não | ~1,0 s (inclui abrir o programa a cada frase, não comparável) | n/d | n/d | n/d | 34 KB | 5 |

Como o f0 foi medido: autocorrelação em numpy, quadros de 40 ms a cada 10 ms, só trechos com voz, faixa de 65 a 350 Hz. O medidor foi validado com tons sintéticos de 100, 120 e 180 Hz e acertou os três. A mediana de cada frase foi tirada e depois feita a média das 4 frases.

Justificativa das notas, com crítica (o cofre registra que o Kokoro padrão e a voz do macOS foram julgados "robóticos" pelo Filipe):

- **Base das notas.** A nota pública do próprio autor para as vozes en: am_michael e am_fenrir C+, am_adam F+, af_heart A, af_bella A-, af_nicole B-. As vozes pt (pm_alex, pm_santa, pf_dora) não têm nota nenhuma no VOICES.md, só uma lista, o que indica pouco dado de treino. Por isso dei 5 e não mais.
- **Variação de tom.** Fala natural de contador de história costuma passar de 3 a 4 semitons de variação. Todas as vozes ficam entre 2 e 3,3, exceto am_fenrir (4,3, mais expressiva, mas com tom mais alto). Isso sugere entonação mais comportada que a de uma voz humana calorosa.
- **am_adam** tem tom bom (123 Hz) mas nota F+ do autor, ou seja, baixa qualidade de treino. Possível instabilidade (não ouvi). Nota 4.
- **am_michael** é o equilíbrio: tom na faixa do Will e C+. Nota 6, e só para inglês.
- **Nenhuma voz sobe de 7**, e a única que chega nisso é feminina. Não espero que o Filipe ache qualquer uma tão calorosa quanto o Will. Prevejo que ele ainda ache "um pouco robótica".

### 4.1 Português do Brasil: o que dá para dizer pelo texto fonético

O Kokoro em português usa o espeak-ng pt-br para transformar texto em fonemas. Conferi a transcrição das 4 frases:

| Ponto | Transcrição | Avaliação |
|---|---|---|
| "dia" | `dʒˈiæ` | Correto: "dji" palatalizado |
| "sete" | `sˈɛtʃy` | Correto: "tchi" no final. A tônica "sé" está certa |
| "de" (de novo) | `dʒy` | Correto: "dji" |
| "agora" | `ˌaɡˈɔɾæ` | Tônica no "gó", certa. O r entre vogais é batido, certo |
| "números" | `nˈũmeɾʊs` | Tônica no "nú", certa |
| "consegue" | `kˌoŋsˈɛɡy` | Tônica no "sé", certa |
| "explorar" | `ˌesploɾˈaɾ` | Tônica no "rar", certa. O r final é batido; muita gente do Sul fala assim, mas no Brasil fica mais natural um r fraco ou aspirado |
| "você" | `vosˌe` | Falha leve: sai só com acento secundário. Pode sair sem a força de "cê" |
| "Bobby" | `bˈobi` | Aceitável, aportuguesado |

Sobre o sotaque: a fonética é correta para pt-BR, mas o espeak-ng gera símbolos sem pistas de ritmo e entonação regionais. O risco real não é o fonema errado, é o **ritmo e a melodia soarem de estrangeiro lendo português**. Isso eu só consigo confirmar ouvindo. Também não verifiquei como a voz lê números por extenso ("sete vezes oito" funcionou porque já veio escrito). Ao rodar o lote, converter dígitos em palavras antes.

## 5. Recomendação

| Idioma | Voz recomendada | Observação |
|---|---|---|
| Português do Brasil | **Kokoro pm_alex**, velocidade 0.9 a 1.0 | É a única masculina em pt com licença comercial limpa dentre as testadas. Tom (132 Hz) a 5 Hz do teto do Will. Descartar se o Filipe achar robótica |
| Inglês americano | **Kokoro am_michael**, velocidade 0.9 a 1.0 | Única masculina com tom dentro da faixa do Will (118 Hz) e nota C+. am_fenrir é a segunda opção, mais expressiva |
| Se o Filipe ouvir e reprovar | **Nenhuma serve** | Não existe hoje voz grátis, comercial e masculina em pt-BR melhor que o Kokoro |

Decisão que fica com o Filipe: ouvir os arquivos `kokoro-pm_alex-pt-*.mp3` e `kokoro-am_michael-en-*.mp3` e dizer se aceita como "voz provisória" ou se vai para uma das rotas da seção 7.

Vozes femininas (pf_dora, af_heart, af_bella, af_nicole) estão nas amostras só para comparação, já que a pergunta era por voz masculina.

## 6. Custo, tempo e tamanho do lote completo (2.823 textos, ~128 mil caracteres)

Medido nas 4 frases de cada voz e projetado linearmente:

| Voz | Tempo para gerar o lote | Áudio resultante | Tamanho final em Opus 24 kbps |
|---|---|---|---|
| pm_alex (pt) | cerca de 15 min | 2,1 h | cerca de 23 MB |
| pm_alex velocidade 0.9 | cerca de 17 min | 2,3 h | cerca de 25 MB |
| am_michael (en) | cerca de 24 min | 2,4 h | cerca de 25 MB |
| am_michael velocidade 0.9 | cerca de 22 min | 2,6 h | cerca de 28 MB |

- Custo: **R$ 0**. Roda no Mac, sem API e sem crédito, e nenhum texto saiu da máquina.
- O lote real será um mix pt e en, então conte 15 a 25 minutos no total. A conta é uma estimativa a partir de frases curtas. Textos longos podem se comportar diferente, e o modelo avisa que vai mal em frases muito curtas (menos de 10 a 20 tokens).
- Este teste usou o motor int8. A fp32 de 325 MB tende a ser mais lenta e um pouco melhor; não foi testada por causa do teto de download.
- Recomendo, na geração do lote, fixar a versão do modelo e guardar o hash dos arquivos (SHA256 do modelo int8 baixado: `6e742170d309016e5891a994e1ce1559c702a2ccd0075e67ef7157974f6406cb`, voices: `bca610b8308e8d99f32e6fe4197e7ec01679264efed0cac9140fe9c29f1fbf7d`). Guarde também uma cópia do texto de licença Apache 2.0 e da lista de atribuição junto do app.

## 7. O que falta para soar mais perto do Will

Em ordem de custo-benefício. Nada abaixo foi testado nesta rodada.

1. **Ouvir e ajustar o que já existe (grátis).** Velocidade 0.9, pausas entre frases, texto escrito do jeito que se fala (vírgulas, "Ahá!"), e conferir o tom: baixar pm_alex 1 a 2 semitons com ffmpeg o leva à faixa do Will, ao custo de um timbre um pouco artificial. Também dá para testar a mistura de duas vozes do Kokoro (média dos vetores de voz).
2. **Testar a versão fp32 do Kokoro** (325 MB). Pode tirar parte do "chiado" da int8.
3. **Gravar uma voz própria.** Para um produto vendido, a rota mais segura em licença é contratar um dublador ou usar a voz do próprio Filipe, gravar de 1 a 3 horas com roteiro e ajustar (fine-tune) um modelo de código aberto sobre essa gravação. Ele tem dono, tem contrato e soa mais humano que qualquer voz pronta grátis. Custa o estúdio e o dublador uma vez, sem mensalidade.
4. **Modelos de clonagem de código aberto** (tipo Chatterbox ou XTTS): só entram se a licença do peso do modelo for comercial. Não verifiquei nenhuma nesta rodada. O XTTS, por exemplo, tem fama de licença não comercial. Conferir na fonte antes de baixar, e só clonar com autorização por escrito de quem fala.
5. **Pagar uma vez.** Gerar o lote de 128 mil caracteres numa assinatura de um mês de uma ferramenta paga e cancelar. O áudio já gerado fica com você, mas confirmar nos termos do plano se o uso comercial em app e a redistribuição estão liberados. Não é o que o Filipe pediu agora (sem custo), mas é o atalho mais próximo do Will de verdade.

## 8. Arquivos

Amostras (MP3 mono 24 kHz, 48 kbps; Opus em `opus/`, WAV original em `wav/`), nomeadas `motor-voz-idioma-n.mp3`:

- Pasta: `/private/tmp/claude-501/-Users-filipealvesesilva-Documents-segundo-cerebro/564d3475-532d-49cb-8cab-1927849100da/scratchpad/voz/amostras/mp3/`
- Medidas completas em `.../amostras/medidas.json`; tempos em `.../amostras/tempos_kokoro.json`, `tempos_kokoro_v09.json`, `tempos_piper.json`
- Referência não aprovada: `.../amostras/mp3-referencia-piper-faber-NAO-APROVADA/`
- Tabelas de licença brutas (cards e textos): `.../scratchpad/voz/licencas/`

## 9. Pendências e limites

- Falta a audição do Filipe. É o dado que decide.
- Piper em inglês (norman, public domain) não foi baixado por causa do teto de 150 MB. Para testar, precisa de +63,5 MB e do ok dele.
- Não validei se o Kokoro lê bem números, siglas e palavras em inglês dentro de frase em português. Fazer um teste com uma amostra real dos 2.823 textos antes do lote.
- A ressalva de licença do Kokoro (dados sintéticos de treino) merece uma conferência jurídica antes de vender o app.
