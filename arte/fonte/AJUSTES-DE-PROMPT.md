# Ajustes de prompt (registro)

A1 (24/10/2026, antes da rodada 2 de BOBBY-SHEET-FRENTE): os prompts de personagem em docs/anexos/prompts-piloto.txt saiam SEM os blocos ESTILO e NEG (a biblia declara so ident+fundo para personagens; so BOBBY-ITEM-CHAPEU declara estilo e neg). Resultado da rodada 1: visual de desenho animado liso. Ajuste: concatenar ESTILO no inicio e NEG antes do "Aspect ratio" em todo prompt de personagem. Script: arte/montar-piloto-ajustado.py (gera arte/prompts-piloto-ajustado.json). Efeito: pelo com textura, tecido com costura, aspecto mais proximo de RPG moderno. Recomendacao: corrigir a biblia (docs/) para incluir estilo=ESTILO neg=NEG nos prompts de personagem. Nao editei docs/.

A2 (BOBBY-P05A, rodada 2): na rodada 1 as 4 variacoes puseram a estrela na orelha proxima da camera (lado espelhado, porque de perfil para a direita a orelha esquerda dele e a distante). Ajuste: acrescentar na frase de pose "The cream star patch is on his left ear, which in this view is the far ear, mostly hidden behind his head; the near ear is plain with no star." Resultado: orelha proxima lisa nas 4 variacoes. Vale para toda pose de perfil: dizer qual orelha e a distante.

A3 (rodadas de poses): ao anexar referencia, o botao "+" do Flow anexa sozinho as ultimas referencias usadas (frente v7 + folha v3). Prompts de pose levam a frase REF da biblia (docs montar-prompts.py, REF).

A4 (DES-ING01, rodada 2): rodada 1 deu 64 a 83 areas fechadas (alvo 20 a 30). Ajuste: acrescentar apos "calm white margin around it": "Keep it very simple and bold: big shapes only, at most 30 closed areas in the whole page, no clouds, no waves, no hills, no small decorations and no repeated small objects." Resultado: 58 a 60 areas (melhora, ainda acima da meta; a IA nao obedece contagem). Sugestao: aceitar ~60 areas para 7 a 12 anos ou pedir 'at most 15'.

A5 (cenarios): prompt do piloto entrou exatamente como no script (318 palavras). Sem ajuste.

A6 (RUFA, lado da pena): o bloco IDENT-RUFA diz "pena atras da orelha direita dela (a orelha do lado esquerdo da imagem)". Em 8 de 8 variantes (2 rodadas, uma com frase de reforco em maiusculas) o Flow pos a pena na orelha do lado DIREITO da imagem. Decisao: aceitar o lado do Flow como canonico e, nas poses, usar o bloco com "right side of the image" (B.RUFA2, mesma frase do bloco com o lado trocado). Recomendacao: trocar o lado no IDENT-RUFA da biblia para evitar briga com a referencia.

A7 (TEO, 4 luzes do peito): ident pede painel com 4 luzes em grade 2x2. A folha saiu com 4, mas TODAS as poses (3 rodadas, com frases pedindo 'exatamente quatro') sairam com 5 ou 6. Aceito com ressalva. Recomendacao: trocar a marca por algo que o gerador nao precise contar (uma luz circular grande) ou corrigir em edicao.

A8 (ratio): a proporcao vem do chip de configuracoes da caixa, nao da frase "Aspect ratio" do prompt. Expressoes do Bobby (E01 a E08) foram geradas em 3:4 e recortadas 1:1 no topo (896x896).

A10 (objetos e icones de recompensa): com o bloco ESTILO de personagem ("large expressive eyes", "believable fur") a moeda e a estrela ganharam rosto, olhos e lenco. Ajuste: bloco ESTILO_OBJ (game item icon, polished metal, wood grain, "an inanimate object with no face, no eyes, no mouth and no clothing") e negativo extra "No face, no eyes, no mouth, no limbs, no scarf, no clothing". Chest fechado e aberto e moeda v3 sairam limpos ainda com o estilo antigo.
recortes Capi e Teo refeitos com recortar2.py (descontaminacao de borda)

A11 (apagados): pedir ao Flow para so tirar cor nao preservou o enquadramento (corr. 0,33 a 0,53); MAT06, MAT07 e POR09 apagados refeitos com arte/apagar.py a partir do completo aprovado (corr. 0,97). Itens do guarda-roupa: referencia BOBBY-P01-v4, frase de pose frontal fixa, 'no shoes'; recortes por recortar2.py (SEMBURACO=1 para alcas vazadas, TODOS=1 para faiscas).
