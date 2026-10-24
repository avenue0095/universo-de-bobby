# Relatório de produção de arte · O Universo de Bobby

Atualizado em 24/10/2026 (madrugada), terceira rodada (baú, recompensas, guarda-roupa, correções). Ferramenta: Google Flow, projeto "out. 24 - 01:29", modelo Nano Banana 2.1, 4 variações por geração. Quem gerou e julgou: o agente de produção, sem aprovação humana (o Filipe dormia), aplicando os critérios de `docs/LOTE-PILOTO.md`, `BIBLIA-DE-PERSONAGENS.md` e `CENARIOS-E-DESENHOS.md`. Todas as notas são minhas, olhando cada imagem; nenhum revisor independente nem a filha viu nada.

## 1. Resumo

- 164 imagens aprovadas (147 das rodadas 1 e 2 mais 17 da rodada 3: baú fechado e aberto, 8 ícones de recompensa, ITEM-BASE e 6 itens do guarda-roupa; 3 apagados foram refeitos e substituem os antigos) em `arte/aprovadas/`, cerca de 700 imagens baixadas em `arte/fonte/` (cerca de 153 gerações de 4 variações), todas em `arte/fonte/registro.tsv` (id, arquivo, prompt, modelo, proporção, créditos, nota, status).
- Custo: o Flow mostrou "usar 0 créditos" em todas as gerações (plano Plus). Custo em crédito medido: 0.
- Limites do Flow: nenhuma cota, erro ou captcha. Só roda uma geração por vez (clique de envio com outra geração em andamento é ignorado em silêncio).
- O Flow aceita imagem de referência e ela segura bem a identidade (personagens) e o estilo do planeta (cenários).
- Exportações finais prontas: `arte/otimizadas/` (229 WebP, cerca de 14 MB no total, após a rodada 3) e `arte/manifesto-arte.json` (id, arquivo, origem, largura, altura, bytes, tipo, transparência).
- Recortes de fundo (WebP com alfa em `otimizadas/*-recorte.webp`, PNG em `arte/recortes/`): 65, incluindo as 8 folhas de 3 vistas.

## 2. O que existe, por grupo

| Grupo | Aprovadas | Notas / observação |
|---|---|---|
| Bobby: folha frontal, folha 3 vistas | 2 | 8,3 e 9,0 |
| Bobby: 13 poses (P01 a P12, P05A e P05B) | 13 | 8,0 a 9,0 (P11 de costas: mochila retangular com rolo, 8,0) |
| Bobby: 8 expressões, recorte 1:1 | 8 | 8,2 a 8,6 |
| Bobby: chapéu (item) | 1 | 8,6 |
| Otto, Capi, Rufa, Brisa, Fagulha | 5 folhas + 20 poses | 8,0 a 8,8 |
| Teo | 1 folha + 4 poses | folha 8,3; poses 7,0 a 7,5 (luzes do peito, ver A7) |
| Planetas MAT, POR, ING | 3 | 8,3 a 8,6 |
| Cenários etapa 1, completo e apagado, 3 planetas | 6 | 8,3 a 8,6 |
| **Cenários etapas 2 a 10 completos: Inglês, Matemática, Português** | **27** | 8,0 a 8,6; referências: planeta e cenário da etapa 1 |
| **Cenários etapas 2 a 10 apagados** | **27** | 7,7 a 8,5; ver seção 4 |
| **Desenhos ING01 a ING10, MAT01 a MAT10, POR01 a POR10** | **30** | 7,8 a 8,1; ver seção 3 |

## 3. Desenhos para colorir (os 30)

Frase de simplicidade (A4) mais reforço (A9: "aim for about 15 areas, thick bold outlines, empty white space; Bobby from behind or the side in the lower corner"). Resultado medido por contagem de regiões brancas fechadas maiores que 600 px (`arte/regioes.py`): ING 45 a 62, MAT 45 a 83, POR 42 a 88 áreas por desenho aprovado, contra a meta de 20 a 30. O gerador não obedece contagem; o reforço baixou a média de cerca de 90 para cerca de 60 e deixou o Bobby de costas ou de lado em todos. Linhas pretas fechadas, fundo branco, sem texto, cinza só de suavização (1,5 a 3 por cento dos pixels). Não imprimi em A4 nem testei balde de tinta. Escolhi sempre a variante com menos áreas que ainda mostrava os 5 elementos do cenário.

## 4. Cenários etapas 2 a 10

- Completos: gerados com 3:4, prompt montado dos blocos do `CENARIOS-E-DESENHOS.md` (estilo, paleta, gabarito de 40 por cento inferior livre, os 5 elementos em ordem de profundidade, negativos) mais uma frase pedindo que as duas imagens de referência (planeta do tema e cenário da etapa 1) sirvam só como estilo, paleta, material e luz. Funcionou: cada planeta mantém a sua identidade (turquesa e branco; cobalto e latão; violeta e lanterna). Falha típica recorrente: a IA põe letras (portal ZOO no ING04 v3, reprovado) ou vaza objeto da referência (avião no ING06 v2, reprovado).
- Apagados: edição da imagem completa aprovada, com o bloco EDITAR-APAGADO. A coincidência de composição foi medida por correlação de bordas (`arte/corr.py`): Inglês 0,58 a 0,80; Português 0,53 a 0,75; Matemática 0,39 a 0,77. **Ressalva:** MAT06 (0,49) e MAT07 (0,44) mudaram o enquadramento em relação ao completo, e POR09 (0,53) também; para a revelação por máscara do app esses três talvez precisem ser regenerados ou alinhados à mão. Os demais ficaram próximos o bastante para a máscara.
- Os cenários não têm personagem nem texto (conferido nas aprovadas).

## 5. Ajustes de prompt (detalhe em `arte/fonte/AJUSTES-DE-PROMPT.md`)

- A1: prompts de personagem do script saem sem ESTILO e sem NEG; com os dois a arte vira o RPG moderno pedido (sem eles, saiu desenho animado liso). Script: `arte/montar-piloto-ajustado.py`. Recomendo corrigir a bíblia (não editei docs/).
- A2: de perfil, dizer qual orelha é a distante (estrela do Bobby).
- A4 e A9: simplicidade dos desenhos.
- A6: a pena da Rufa sai sempre na orelha do lado direito da imagem; aceitei o lado do Flow.
- A7: o Teo deveria ter 4 luzes no peito em grade 2x2; as poses saem com 5 ou 6 (3 rodadas, aceito com ressalva). Recomendo trocar a marca por algo que o gerador não precise contar.
- A8: a proporção vem do chip de configurações do Flow, não da frase do prompt.

## 6. Exportações

- `arte/exportar.py` gera tudo (rodar de novo regenera). Largura máxima 1024 para cenário, planeta e desenho; 768 para pose, expressão, folha e item; WebP qualidade 82; desenhos em tons de cinza; recortes e folhas com alfa.
- Peso por tipo (KB): pose 14 a 97 (mediana 43), expressão 40 a 89, cenário 53 a 131 (mediana 94), planeta 77 a 113, desenho 38 a 86, folha 11 a 78. Todos dentro das metas do LOTE-PILOTO (60 por pose na mediana, 150 por cena, 120 por desenho); pose máxima 97 KB passa de 60.
- Franja dos recortes: testada em Bobby, Rufa, Brisa, Fagulha, Capi, Teo e a pose de pulo sobre fundos claro, escuro, céu e xadrez; sem buraco; leve halo claro em pelo sobre branco e halo escuro fino na Capi (fundo carvão) sobre fundo claro. Recomendo olhar o Capi a 200 por cento antes de usar no app.

## 7. Gerações e limites

Cerca de 153 gerações de 4 imagens (613 imagens), uma por vez. Piloto de 13 itens: cerca de 17 gerações. Média geral de 1,0 a 1,1 geração por imagem aprovada, bem abaixo da hipótese de 3 a 4. Sem erro, cota ou captcha.

## 8. Lista do que falta

- Teste com a filha (L10 do LOTE-PILOTO), a única decisão que não é minha: perguntar sobre `arte/aprovadas/BOBBY-P01.jpg`, `BOBBY-P02.jpg`, `BOBBY-P05A.jpg`, sem induzir.
- MAT06, MAT07 e POR09 apagados: refeitos na rodada 3 (seção 11); ficou só a decisão do Filipe sobre o estilo do apagado. Talvez Teo (luzes) e a Rufa (lado da pena) se o Filipe preferir o bloco original.
- Impressão A4 de pelo menos 3 desenhos e teste do balde de tinta.
- Bobby: BOBBY-EXPR-GRADE (grade de 8 expressões numa imagem), BOBBY-SHEET-LADO e BOBBY-SHEET-COSTAS (a folha de 3 vistas já cobre).
- Passar as imagens por revisor independente (regra 9 do Filipe), que eu não rodei.
- Nada foi copiado para `docs/piloto/` nem para `src/` (fora do que eu podia editar); os nomes finais estão no manifesto.

## 9. Como repetir (arquivos desta pasta)

`baixar-lote.sh`, `lote.sh`, `montar.py`, `reg.py`, `regioes.py`, `corr.py`, `recortar.py`, `exportar.py`, `copiar.py`, `montar-piloto-ajustado.py`. As imagens de referência no Flow foram marcadas com coração no projeto (marca do projeto, pode ser desfeita). URLs de imagem cheia saem direto dos blocos `flow-image-tile img` da grade; o download com `curl` completa o `=` final da assinatura.

## 10. Operação e segurança

Não digitei senha, não mudei configuração da conta, não compartilhei nada, não apaguei nada do Flow nem do disco. A aba do navegador usada foi só a "seed". Não toquei em `src/`, `index.html`, `sw.js`, `audio/` nem `docs/`. Uma vez outra sessão navegou a aba "seed" para `127.0.0.1:8791` (servidor meu, já desligado); voltei ao Flow e segui.

## 11. Rodada 3: baú, recompensas, guarda-roupa e correções

**Baú e ícones de recompensa** (fundo cinza sólido, recorte com transparência, tipo `recompensa` no manifesto): BAU-FECHADO (nota 8,6), BAU-ABERTO com moedas, faíscas e estrelinhas subindo (8,5), REC-MOEDA, REC-ESTRELA, REC-CONGELADOR (cristal de gelo com chama pequena), REC-MEDALHA, REC-PERGAMINHO, REC-PRESENTE, REC-BILHETE (envelope com selo de estrela), REC-TROFEU, todos de 8,2 a 8,7. Lição (A10): o bloco ESTILO dos personagens ("olhos grandes expressivos", "pelo") deu rosto, olhos e lenço à moeda, à estrela e ao cristal; criei ESTILO_OBJ e um negativo extra "sem rosto, sem olhos, sem boca". Nenhum ícone aprovado tem rosto.

**Guarda-roupa do Bobby** (tipo `item`): ITEM-BASE (pose frontal sem item, 8,6) e seis itens sobre a mesma pose frontal: ITEM-BONE (boné de explorador), ITEM-OCULOS (óculos de astronauta na testa), ITEM-CAPA (capa azul real com broche de estrela), ITEM-CAPACETE (capacete branco com viseira levantada, rosto visível), ITEM-COROA (coroa de papel amarela com estrela laranja), ITEM-LENCO (lenço de tricô verde-azulado com ponta solta); notas de 8,3 a 8,6. Referência usada: BOBBY-P01 variante 4. **Ressalva importante:** as imagens têm pose e escala muito parecidas, mas não coincidem pixel a pixel (a IA redesenha o urso a cada geração). Para sobrepor como camada no app é preciso alinhar à mão (use ITEM-BASE como gabarito) ou usar cada imagem como o Bobby inteiro vestido, que é o uso mais seguro. Cada recorte inclui o urso inteiro.

**Capi e Teo, halo escuro:** recortes refeitos com `recortar2.py` (erode 3 px e troca da cor da borda pela cor do interior mais próximo). Conferi o Capi sobre fundo claro; o halo sumiu.

**Apagados MAT06, MAT07 e POR09:** em vez de pedir ao Flow uma nova edição (a IA mudava o enquadramento: correlação de bordas 0,33 a 0,53 em 12 tentativas), refiz por edição determinística da imagem completa aprovada, com `arte/apagar.py`: cor reduzida a 12 por cento, tom frio, contraste menor e leve neblina. Mesmo enquadramento por construção (correlação de bordas com o completo: 0,972 a 0,976). É o apagado "só sem cor", sem estruturas cobertas. Os apagados antigos foram movidos (não apagados) para `~/_APAGAR DEPOIS (revisao)/2026-10-24/bobby-arte-apagados-v1/`, com log e `desfazer.sh`.

**Exportação:** `exportar.py` agora classifica BAU-/REC- como `recompensa`; `otimizadas/` e `manifesto-arte.json` regenerados com os recortes novos (17 imagens novas com WebP e WebP com alfa). Recorte do troféu feito sem preencher buracos (alças vazadas); o do baú aberto mantém as faíscas.

**Limites do Flow:** nenhum; crédito medido 0 de novo. Nada revisado por revisor independente.
