# LOTE PILOTO · O Universo de Bobby

Versão 1 · 24/10/2026 · Fase 3 · aguardando ok do Filipe.
**Nenhuma imagem foi gerada e nenhum crédito foi gasto.** Este documento diz o que gerar, em que ordem, como aprovar e como testar. Só depois do ok do Filipe, com a estimativa de crédito na mão, alguém abre o Google Flow.

Fundamento: o cofre diz "faço um lote piloto (Bobby, 2 companheiros e 1 cenário) e só sigo para o resto com o seu ok" (`RESPOSTAS.md`) e libera gerar imagens no Google Flow pelo navegador (`GOSTO.md`, "Liberado antes").

---

## 1. O que o piloto responde

Uma pergunta só: **a arte que sai do Flow, com estes blocos de prompt, parece de verdade para a filha de 8 anos e se mantém igual de uma imagem para a outra?** Se sim, libera o lote completo (cerca de 138 a 140 imagens aprovadas, `BIBLIA-DE-PERSONAGENS.md` seção 10 e `CENARIOS-E-DESENHOS.md` seção 9). Se não, os blocos de prompt são ajustados antes de gastar mais.

O piloto também mede o que hoje é estimativa: custo real por geração, peso real dos arquivos, quantas tentativas cada tipo de imagem exige.

## 2. Escopo (12 imagens aprovadas, 1 opcional)

| # | Item | ID no script | Por que está no piloto |
|---|---|---|---|
| 1 | Bobby, vista frontal (teste de identidade) | `BOBBY-SHEET-FRENTE` | primeiro teste: o bloco de identidade funciona? |
| 2 | Bobby, folha de referência em T-pose, 3 vistas | `BOBBY-SHEET` | a verdade que as outras imagens copiam |
| 3 | Bobby, pose Oi | `BOBBY-P01` | frontal e estática: base do retrato do botão "Meu personagem" |
| 4 | Bobby, pose Comemora | `BOBBY-P02` | movimento extremo: testa consistência sob pose difícil |
| 5 | Bobby, pose Caminha (quadro de contato) | `BOBBY-P05A` | é a imagem que vai ao mapa, de lado |
| 6 | Otto, folha | `OTTO-SHEET` | silhueta longa e baixa, guia de Inglês |
| 7 | Otto, pose Oi | `OTTO-P01` | confere o bloco de identidade fora do Bobby |
| 8 | Capi, folha | `CAPI-SHEET` | silhueta larga e baixa, oposta à do Otto, coringa |
| 9 | Capi, pose Oi | `CAPI-P01` | idem |
| 10 | Cenário de mapa, Horizonte, etapa 1, `completo` | `CEN-ING01-COMPLETO` | Inglês é a primeira matéria da reforma (`RESPOSTAS.md`) |
| 11 | Mesmo cenário, `apagado` (edição) | `CEN-ING01-APAGADO` | testa a montagem por revelação |
| 12 | Desenho para colorir da etapa 1 | `DES-ING01` | testa traço, fechamento e impressão |
| opc. | Chapéu do Bobby em fundo liso | `BOBBY-ITEM-CHAPEU` | testa a decisão D1 do guarda-roupa (sobreposição) |

A vista frontal (item 1) existe para isolar o problema de identidade antes de pedir as 3 vistas.

Fora do piloto de propósito: Teo, Rufa, Brisa, Fagulha, os outros planetas, as 8 expressões, as demais poses. Sobem só depois do ok.

## 3. Antes de abrir o Flow (sem custo)

1. Conferir na interface do Flow, e anotar em `arte/fonte/registro.tsv`: qual modelo de imagem ele usa hoje; se aceita imagem de referência na geração de imagem; quais proporções oferece (3:4, 16:9, 1:1); se há limite de tamanho do prompt (o maior prompt montado tem 338 palavras, ver `docs/anexos/prompts-montados.txt`); saldo de crédito e custo por geração.
2. Rodar `python3 docs/anexos/montar-prompts.py --piloto`. Ele grava `docs/anexos/prompts-piloto.txt` com os prompts na ordem abaixo, conferidos (nenhum bloco faltando, sem travessão, só ASCII).
3. **Parar e mostrar ao Filipe:** a lista, a estimativa de gerações (seção 5) e o custo por geração. Só segue com o ok escrito, como manda a regra da casa para gerar imagem e gastar crédito.

## 4. Ordem de geração, com portões

```ordem-piloto
BOBBY-SHEET-FRENTE
BOBBY-SHEET
BOBBY-P01
BOBBY-P02
BOBBY-P05A
OTTO-SHEET
OTTO-P01
CAPI-SHEET
CAPI-P01
CEN-ING01-COMPLETO
CEN-ING01-APAGADO
DES-ING01
BOBBY-ITEM-CHAPEU
```

**Bloco 1: Bobby (portão A).**
1. `BOBBY-SHEET-FRENTE`: gerar 4 variações. Escolher a mais fiel ao bloco de identidade. Aprovar na ficha (`BIBLIA-DE-PERSONAGENS.md`, seção 9).
2. `BOBBY-SHEET`: gerar 4 variações com a frontal aprovada como referência (ou, se a folha não sair em 3 vistas, gerar `BOBBY-SHEET-LADO` e `BOBBY-SHEET-COSTAS` à parte, que também estão no script).
3. `BOBBY-P01`, `BOBBY-P02`, `BOBBY-P05A`: 4 variações cada, com a folha como referência.
4. Recortar (seção 3 da bíblia), aprovar na ficha e rodar o harness de teste (seção 6).
5. **Portão A:** o Bobby só passa se as 3 poses mais a folha forem aprovadas. Se reprovar depois de **3 rodadas** em alguma imagem, parar, anotar o que falhou, voltar às seções 1 e 2 da bíblia, e **não gerar os demais itens**.

**Bloco 2: companheiros.** `OTTO-SHEET`, `OTTO-P01`, `CAPI-SHEET`, `CAPI-P01`, mesma rotina (frontal ou folha, depois pose, recorte, ficha). O objetivo é confirmar que o método de identidade funciona para outros corpos (comprido e largo), não só para o Bobby.

**Bloco 3: cenário (portão B).** `CEN-ING01-COMPLETO`, e depois `CEN-ING01-APAGADO` por edição da imagem aprovada. Aprovar na ficha de cenário (`CENARIOS-E-DESENHOS.md`, seção 6). **Portão B:** colocar o Bobby `P05A` sobre a cena no harness. Se parecer colagem (luz, escala ou borda diferentes), voltar à luz do cenário e do personagem antes de seguir.

**Bloco 4: desenho (portão C).** `DES-ING01`. Aprovar na ficha da seção 8 de `CENARIOS-E-DESENHOS.md`; imprimir em A4 de verdade (impressora ou PDF) e colorir um pedaço no balde de tinta de um editor.

**Opcional:** `BOBBY-ITEM-CHAPEU`, para o teste de sobreposição do guarda-roupa (decisão D1).

## 5. Estimativa de tentativas (hipótese a medir, não dado)

| Tipo | Imagens | Gerações por imagem aprovada (hipótese) | Total |
|---|---|---|---|
| Personagem (folha e poses) | 9 | 3 a 4 | 27 a 36 |
| Cenário | 2 | 3 a 4 | 6 a 8 |
| Desenho | 1 | 3 a 4 | 3 a 4 |
| Opcional chapéu | 1 | 2 a 3 | 2 a 3 |
| **Piloto** | **12 ou 13** | | **36 a 51** |

Teto de segurança: **60 gerações no piloto** (a hipótese acima fica entre 36 e 51). Chegou em 60 sem fechar o portão A, para e pergunta ao Filipe. **Custo em crédito: não consultado e não conhecido.** Preencher: custo por geração ______ × 60 (teto) = ______. Registrar o custo real ao final; ele passa a ser o número do lote completo (seção 9 de `CENARIOS-E-DESENHOS.md` e seção 10 da bíblia).

## 6. Como testar (no app e no navegador)

Regra da casa: build passando não é entrega funcionando. O piloto tem **dois testes**, o primeiro hoje e o segundo na implementação.

### 6.1 Teste de bancada (hoje, sem tocar no código do app)

O harness `docs/anexos/teste-piloto.html` mostra as imagens do piloto nas situações do app real:

1. **Franja:** cada personagem recortado sobre 6 fundos (claro, escuro, céu de cada planeta, xadrez), com controle de tamanho e ampliação. Aqui se vê halo cinza, serrilhado e buraco.
2. **Silhueta a 96 px:** cada personagem em preto sobre branco, em tamanho de ícone, ao lado do colorido. Os 3 precisam ser diferentes.
3. **Tela Etapa:** a cena `completo` e `apagado` empilhadas, com o controle de 0 a 6 (0 a 5 fases e a revisão), a zona dos nós com 6 círculos e o Bobby caminhando. É a revelação por máscara de verdade, na proporção de um celular.
4. **Barra inferior:** o recorte da cabeça do Bobby em círculo de 40 px no lugar do botão "Meu personagem", ao lado dos outros itens, nos dois temas.
5. **Desenho:** exibido em tamanho de página A4, com botão de imprimir.
6. **Peso:** o harness lê o tamanho real de cada arquivo e compara com a meta (60 KB por pose, 150 KB por cena, 120 KB por desenho).

**Como rodar** (nada é instalado, só Python):

```
cd /Users/filipealvesesilva/Projetos/universo-de-bobby/docs
python3 -m http.server 8790
```

Abrir `http://localhost:8790/anexos/teste-piloto.html` no navegador. Para ver no celular da filha (mesma rede wifi), subir com `python3 -m http.server 8790 --bind 0.0.0.0` e abrir `http://<IP do computador>:8790/anexos/teste-piloto.html`. Só com o ok do Filipe, porque expõe a pasta na rede local por alguns minutos.

**Nomes dos arquivos esperados em `docs/piloto/`** (WebP ou PNG; personagens recortados com transparência):

| Arquivo | Conteúdo |
|---|---|
| `bobby-folha` | folha de 3 vistas (pode ter fundo) |
| `bobby-p01-oi`, `bobby-p02-comemora`, `bobby-p05a-caminha` | poses recortadas |
| `otto-folha`, `otto-p01-oi`, `capi-folha`, `capi-p01-oi` | folhas e poses recortadas |
| `cen-ing01-completo`, `cen-ing01-apagado` | cenário, as duas versões |
| `des-ing01` | desenho em preto e branco |

O harness avisa "faltando" para o que ainda não existe, então pode ser aberto antes de gerar qualquer coisa. O console do navegador mostra um erro 404 por arquivo, da extensão que não existe (ele tenta `.webp` e depois `.png`); é esperado.

### 6.2 Teste no app (na implementação da Fase 3, depois da aprovação)

Não feito agora (a regra é não editar `src/` nem `index.html` nesta tarefa). Quando o piloto for aprovado:
1. Copiar as imagens para `src/interface/` (pasta de assets) e adicionar ao pré-cache do `sw.js`.
2. Montar a tela Etapa com os tokens do `DESIGN.md` e a revelação por máscara; montar a barra inferior com o botão "Meu personagem".
3. Rodar no navegador de verdade (Playwright): celular 360 por 740 e computador 1280 por 800, claro e escuro, console sem erro, movimento reduzido ligado, rede desligada (offline).
4. Conferir o peso total do pacote contra o orçamento de 10 MB (`DESIGN.md`, seção 9).
5. Teste em aparelho real com a filha (iOS e Android, se houver).

## 7. Critérios de aprovação do piloto

**Por imagem:** nota de 80% ou mais na ficha e nenhum item eliminatório em 0 (fichas: `BIBLIA-DE-PERSONAGENS.md` seção 9, `CENARIOS-E-DESENHOS.md` seções 6 e 8).

**Do lote (todos precisam passar para liberar o lote completo):**

| # | Critério | Como se confere |
|---|---|---|
| L1 | **Consistência:** folha, P01, P02 e P05A do Bobby mostram as mesmas marcas fixas (estrela na orelha esquerda, colete com botão, mochila, 4 dígitos por pata) | lado a lado a 25% e a 100%, anotar divergência |
| L2 | **Identidade fora do Bobby:** Otto e Capi também mantêm as marcas (cachecol e concha; folha na cabeça) entre folha e pose | idem |
| L3 | **Franja:** nenhum halo, serrilhado ou buraco nos 6 fundos do harness | ampliar a 200% |
| L4 | **Silhueta:** os 3 personagens se distinguem a 96 px | harness, seção 2 |
| L5 | **Coerência de luz:** Bobby sobre a cena não parece colagem (luz, escala, borda) | harness, seção 3, e pergunta ao Filipe |
| L6 | **Montagem:** `apagado` sobreposto a `completo` a 50% coincide em composição | harness, seção 3 |
| L7 | **Desenho:** formas fechadas, 20 a 30 áreas, sem cinza, imprime em A4 | balde de tinta e impressão |
| L8 | **Peso:** dentro das metas (60 KB pose, 150 KB cena, 120 KB desenho) | harness, seção 6; se estourar, ajustar a compressão antes de aprovar |
| L9 | **Prompt:** o que foi digitado no Flow é exatamente o do script (sem retoques à mão) | comparar com `prompts-piloto.txt`; qualquer ajuste volta para o bloco do documento |
| L10 | **A filha:** respostas a "Isso parece de verdade? Você jogaria com ele?" e "Qual você mais gostou, o Bobby, o Otto ou o Capi?" | anotar a resposta literal em `RESPOSTAS.md` (cofre), sem induzir |

**Regra de decisão.** L1 a L9 aprovados e a filha respondendo que parece de verdade: libera o lote completo, com o custo real medido. L1 a L9 aprovados e a filha dizendo que ainda parece colagem: não libera; revisar as seções 1 e 9 do `DESIGN.md` e os blocos de estilo, e rodar um segundo piloto menor (Bobby apenas). L1 a L3 reprovados: o problema é o método de consistência, não o gosto; revisar a seção 2 da bíblia.

## 8. O que fazer com o resultado

1. Registrar no cofre: respostas em `RESPOSTAS.md`, o aprendizado de prompt em `GOSTO.md`, as pendências em `PENDENTES.md`.
2. Guardar os originais em `arte/fonte/` e o registro em `registro.tsv`. Nada se apaga.
3. Fechar as decisões abertas: D1 (guarda-roupa), D2 (nomes), D3 (silhuetas), D4 (montagem), D5 (nomes de planetas), D6 (item escondido).
4. Só então planejar o lote completo (ordem sugerida: Inglês, Português, Matemática, a mesma da reforma de ensino).

## 9. Riscos do piloto

| Risco | O que fazer |
|---|---|
| O Flow não aceita imagem de referência | o bloco de identidade carrega sozinho; esperar mais tentativas (L1 mais difícil) |
| Folha de 3 vistas sai inconsistente entre as vistas | gerar uma vista por imagem (`BOBBY-SHEET-LADO` e `BOBBY-SHEET-COSTAS`) usando a frontal como referência |
| A edição `apagado` muda a composição | plano B: gerar de novo com o mesmo prompt e alinhar à mão; custa mais tentativas |
| Pelo fica com franja no recorte | trocar o bloco de fundo (A, B ou C) e regenerar a pose; se persistir, encurtar ainda mais o pelo no bloco de identidade |
| IA coloca letras no cenário ou no desenho | o bloco já proíbe; se aparecer, tirar à mão no editor ou regenerar |
| Realismo não agrada a filha | segundo piloto menor; a bíblia e o `DESIGN.md` voltam para ajuste |
| Custo por geração maior que o esperado | o teto de 60 gerações e o ok do Filipe protegem; parar e perguntar |

## 10. O que não rodou

- Nenhuma geração, nenhum crédito, nenhuma consulta ao Flow. Tudo acima de custo, de número de tentativas e de peso é hipótese a medir no piloto.
- O harness foi aberto no navegador com 11 imagens sintéticas geradas só para o teste (retângulos e silhuetas simples) e a revelação, os nós e a barra funcionaram; não foi testado com arte real. Não há print guardado no repositório.
- Nada foi testado no aparelho da filha.
