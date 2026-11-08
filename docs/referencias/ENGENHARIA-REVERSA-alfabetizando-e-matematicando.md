# Engenharia reversa: Alfabetizando e Matematicando (pacote comprado) e o que serve ao Bobby

Data: 08/11/2026. Fonte: os dois arquivos `alfabetizando.jsx` (1.248 linhas) e `matematicando.jsx` (1.314 linhas) em `~/Downloads`, lidos inteiros. Avaliação técnica e pedagógica minha, marcada DADO (está no código) ou OPINIÃO.

## 1. O que os dois são (DADO)
- Um componente React cada, sem dependência além do React, feitos para v0 e Lovable (comentário no cabeçalho). Estilo embutido, só celular (coluna de 480 px), emojis como toda a parte visual, voz pelo `speechSynthesis` do aparelho a 0,85 de velocidade, progresso em `localStorage`.
- Os dois têm o MESMO esqueleto (cerca de 90% do código de interface é idêntico): gerador determinístico de exercícios com semente fixa (ids estáveis), trilha de 20 dias com 10 exercícios por dia, "atividades por tema" com filtro de nível, tela de progresso, dicas para quem ensina, perfil com nome e nível recomendado, sessão de 10 perguntas de múltipla escolha com 4 opções, feedback imediato com a resposta certa e uma dica, estrelas por acerto de primeira.
- Público declarado: "professoras e mães". Alfabetizando: 4 a 7 anos. Matematicando: 4 a 9 anos.
- Não há no código nada que prove validação com crianças (sem métricas, sem evento, sem teste A/B, sem citação de fonte pedagógica). "Validado" é afirmação de quem vendeu o pacote; eu não achei evidência dentro do produto. OPINIÃO: são apps de template bem organizados, não produtos testados.

## 2. Alfabetizando: o que ensina (DADO)
Banco de 91 palavras com sílabas marcadas e emoji, 25 famílias de rimas, 10 sujeitos e 10 predicados para frases. Gera cerca de 650 exercícios em 10 temas e 4 níveis (4-5, 5-6, 6, 7 anos):
1. Letras: reconhecer a letra pedida; maiúscula e minúscula (par).
2. Alfabeto: antes, depois e entre.
3. Vogais e consoantes; vogal que falta na palavra.
4. Primeira letra da figura (consciência do som inicial).
5. Rimas (final igual).
6. Sílabas: contar (bater palma), sílaba que falta, juntar duas sílabas.
7. Figura e palavra.
8. Completar a letra que falta.
9. Escrita certa: a grafia correta entre variantes geradas por 4 erros típicos (trocar letras vizinhas, trocar por letra parecida, tirar uma letra, dobrar uma letra).
10. Frases: quem faz, o que faz, palavra que falta, contar palavras.

Diferenciais de verdade (OPINIÃO sobre DADO):
- **Tabela de letras confundíveis** (`CONF`: b/d/p/q, m/n, u/v, f/t, i/l, o/c/e...) usada para gerar distratores que enganam de verdade, em vez de letras aleatórias. É o melhor achado do arquivo.
- **Gerador de erros de ortografia** plausíveis (as 4 operações acima). Dá para portar direto.
- **Progressão fonológica correta**: som inicial, rima, sílaba, letra que falta, grafia, frase. Bate com a trilha "som e letra antes de palavra" que a nossa pesquisa 02 recomenda (IES/WWC 2016).
- **Dicas para quem ensina** (10): "comece pelo som, não pelo nome", "etiquete a casa", "b/d se confundem até os 7 anos", "nem tudo precisa de correção". Boas, curtas, para o adulto.
- A dica do feedback sempre ensina ("fale a palavra devagar e escute o som que falta"), não só revela a resposta.

## 3. Matematicando: o que ensina (DADO)
Cerca de 650 exercícios em 13 temas e 4 níveis (4-5, 6, 7, 8-9 anos):
contar (até 20, emojis repetidos), números (antes, depois, entre), comparar (maior, menor, mais), somar (100), subtrair (80), sequências e padrões (40), formas e lados (30), multiplicar com figuras (60), dividir igualmente (40), frações (metade, terço, quarto), **dinheiro** (notas, moedas, troco), **tempo** (relógio de hora cheia com emoji de relógio, dias da semana, meses), **historinhas** (60 problemas do dia a dia com nomes de crianças: ganhou, perdeu, repartiu, comparação).

Diferenciais (OPINIÃO sobre DADO):
- **Cobre justamente os eixos em que o Bobby é fraco na BNCC** (nosso `docs/bncc-mapa.md`): grandezas e medidas (dinheiro, tempo), geometria (formas e lados), sequências e padrões, e problemas em palavras. É a parte que mais vale copiar como ideia.
- Trilha de 20 dias em ordem pedagógica sensata: contar, ordem, comparar, formas, somar, subtrair, padrões, relógio, historinhas, dezenas, dinheiro, tabuada, dividir, frações, desafio.
- As 10 dicas ao adulto são as melhores do pacote: "sessões curtas", "use objetos de verdade", "peça para ela explicar", "respeite o nível", "dedos, sim".

## 4. O que é fraco nos dois (OPINIÃO, com DADO)
- Visual inteiro em emoji: é exatamente a "colagem" que a filha rejeitou no Bobby. O relógio é um emoji, as formas são emojis coloridos, as quantidades são emojis repetidos.
- Só múltipla escolha de 4 opções; nenhuma interação de tocar, arrastar ou ordenar.
- Banco fixo de 650 por app: acaba em 65 sessões; não gera variação por criança. O Bobby gera infinito por fase.
- Voz do aparelho (`speechSynthesis`), que o Bobby já abandonou pela voz gravada por causa do Android.
- "Marcar como completado" sem fazer os exercícios: o progresso mente.
- Sem revisão espaçada, sem adaptação, sem história, sem mascote, sem recompensa além de estrelas, sem relatório ao responsável, sem offline (PWA), sem acessibilidade além do foco.
- Número do gerador `numOpts` pode produzir distratores iguais à resposta mais 1, 2, 3 sem relação com o erro típico da criança (o Bobby já faz melhor com os vizinhos decimais).

## 5. O que portar para o Bobby, em ordem de impacto (OPINIÃO)
1. **Conteúdo que falta na BNCC, pronto para virar makers:** dinheiro e troco, relógio de hora cheia e meia, dias da semana e meses, formas e número de lados, sequências e padrões, historinhas de soma, subtração, repartição e comparação com nomes de crianças. Entra no plano "3º ano" já aprovado (medidas e tempo primeiro). Com a arte do Flow no lugar dos emojis e os verbos na cena (arrastar moedas, girar ponteiro).
2. **Trilha de alfabetização para a faixa de 7 a 8 anos:** som inicial, rima, contar e juntar sílabas, vogal e letra que falta, grafia correta. O Bobby hoje começa em ortografia e sílabas; falta a base fonológica. Usar o banco de 91 palavras e as 25 famílias de rimas como semente (é pequeno e dá para ampliar).
3. **Distratores por confusão real:** tabela de letras confundíveis (b/d/p/q, m/n, u/v...) e o gerador de 4 erros de ortografia. Portar para `src/conteudo/portugues.js` e para a pergunta irmã.
4. **Dicas para quem ensina:** as 20 dicas dos dois apps viram conteúdo da área do responsável e do relatório semanal ("vale ajudar em", com atividade de 5 minutos). Barato e alinhado à evidência de envolvimento parental da pesquisa 04.
5. **Prática livre por tema com filtro de nível e selo "indicado":** hoje o Bobby só tem a trilha por etapa. Um "treinar por tema" (tabuada, rimas, troco) com 10 perguntas, fora da trilha, com o que a criança ainda não acertou vindo primeiro (eles ordenam pendentes antes dos já acertados), é um modo de uso que o Bobby não tem e as mães do público deles usam.
6. **Métrica "acerto de primeira"** separada de "acertou em algum momento": eles guardam `first` e `tries` por exercício. O Bobby mede por fase; medir por pergunta melhora a revisão espaçada e o relatório.
7. **Trilha de N dias** como modo alternativo para o adulto ("20 dias de alfabetização"): um plano curto e fechado que a mãe entende de cara. Pode ser um "programa" dentro de cada planeta, sem substituir o mapa.

## 6. O que NÃO copiar
Emojis como arte, voz do aparelho, banco fixo, "marcar como completado", só múltipla escolha, ausência de retenção e de relatório. Nada disso agrega ao Bobby; o Bobby já está à frente nesses pontos.

## 7. Resposta direta às perguntas do Filipe
- **São bons de verdade?** São corretos e bem organizados para o que são: um caderno de exercícios digital com 650 itens, 20 dias de plano e dicas para o adulto. Pedagogicamente a sequência faz sentido. Como produto, estão abaixo do Bobby atual em quase tudo (visual, voz, variedade, retenção, offline).
- **Por que foram "validados"?** Não há evidência no código. Segundo o Filipe (08/11), a validação é de mercado e uso: os apps foram vendidos, várias crianças usaram e há recorrência (informação do vendedor do pacote, não verificável no código). Vale como sinal de que o formato engaja; não como medida de aprendizado.
- **Diferencial de cada um:** Alfabetizando: progressão fonológica e distratores por confusão de letras. Matematicando: cobertura de medidas, tempo, dinheiro, formas e problemas em palavras, que o Bobby não tem.
- **Como agregam ao Bobby:** como banco de ideias de conteúdo e de geradores (itens 1 a 3 acima), como fonte das dicas ao responsável (item 4) e como modo "treinar por tema" (item 5). Não como modelo de app.
