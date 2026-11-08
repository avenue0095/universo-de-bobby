# Mesa do Bobby · 05 · Negócio e concorrência

Data da pesquisa: 24/10/2026. Autor: especialista de negócio e concorrência da mesa. Nada no código foi editado; nenhum crédito pago foi gasto.

**Convenção.** Cada linha marca **DADO** (abri a fonte e li; fonte e data ao lado), **DADO FRACO** (só fonte secundária ou agregador; não confirmado na origem) ou **OPINIÃO** (leitura minha). O que não abriu está na seção 9 e não entra nas tabelas como fato. Preços em R$ são os exibidos na App Store brasileira em 24/10/2026, salvo quando indicado. Isto não é parecer jurídico nem contábil: o que precisa de advogado ou contador está marcado.

**Ponto de partida (DADO, código e `pesquisa/00-mapa-do-app-hoje.md`).** O Bobby hoje é grátis, sem conta, sem servidor, sem pagamento, sem anúncio e com dados 100% no aparelho. Moedas só se ganham jogando (`src/interface/economia.js`, linhas 2 e 3). Há área do responsável com relatório local, senha PBKDF2, cópia de segurança em `.json` e pacote de métricas pseudonimizado. O ECA Digital (Lei 15.211/2025) e o Decreto 12.880/2026 já estão em vigor e a leitura das mecânicas contra a lei está em `pesquisa/03-etica-e-lgpd-infantil.md`; este documento não repete aquela análise, só a usa.

---

## 1. Quem compete no Brasil para pais de crianças de 7 a 12

### 1.1 Tabela de preço, entrega e prova (o que abri)

| Concorrente | Tipo | Preço no Brasil (R$) | O que entrega | Como vende ao pai (promessa, prova, relatório) | Idioma | Fonte e data |
|---|---|---|---|---|---|---|
| **Duolingo (Super)** | Indireto (idiomas; tem matemática em pt) | Itens na App Store BR: R$ 31,90, R$ 179,90 e R$ 224,90, sem rótulo de período na loja. Que o de R$ 31,90 seja o mensal e os outros dois anuais é **inferência minha** pela escala dos valores. Canaltech 19/04/2025: individual anual R$ 179,90 (R$ 14,99/mês), família anual R$ 269,90 (R$ 22,49/mês, até 6 pessoas), 2 semanas grátis | Vidas ilimitadas, sem anúncio, revisão de erros, prática personalizada, "videochamadas" com personagens | Promessa de progresso por hábito (ofensiva, ligas); grátis com anúncio e energia limitada; família como âncora | pt-BR | DADO: App Store BR id570060128; Canaltech 19/04/2025 |
| **Duolingo ABC** | Indireto (alfabetização) | Grátis, sem compras, sem anúncio | Leitura para 0 a 5 anos | Marca Duolingo; nota 3,9 (96 avaliações BR) | Só inglês | DADO: App Store BR id1440502568 |
| **Khan Academy** | Substituto grátis | Grátis, sem compras, sem anúncio | Matemática por ano escolar, vídeos e exercícios, 26 idiomas | Sem fins lucrativos; relatório para pais e professores; nota 4,8 (3,5 mil BR) | pt-BR | DADO: App Store BR id469863705 |
| **Khan Academy Kids** | Substituto grátis | Grátis, sem compras, sem anúncio | Leitura e matemática, 2 a 8 anos | Nota 4,8 (611 BR); reclamação recorrente: só inglês | Só inglês | DADO: App Store BR id1378467217 |
| **Prodigy Math Game** | Direto (matemática gamificada, 1º ao 8º ano) | Core R$ 79,90/mês ou R$ 499,90/ano; Plus R$ 129,90/mês ou R$ 699,90/ano; Ultra R$ 179,90/mês ou R$ 999,90/ano; "Magicoin 2200" R$ 129,90; 25% de desconto para mais de um filho | Jogo de batalhas com perguntas de matemática; versão grátis financiada pela assinatura dos pais; app "Prodigy for Parents" | Página de assinatura promete "helped millions of children learn math" sem estudo; prova social "11.000+ pais na última semana"; página não cita relatório | Só inglês | DADO: App Store BR id950795722; webflow.prodigygame.com/main-en/membership |
| **Lingokids** | Direto (inglês 2 a 8 anos; tem matemática) | Plus/Unlimited mensal R$ 59,90; anual R$ 289,00 (R$ 24,08/mês) a R$ 359,90 (R$ 29,99/mês); item de R$ 26,90 não rotulado | 4.000+ jogos, músicas e desenhos; sem anúncio; selo kidSAFE; até 4 perfis; relatório de progresso no plano Plus | Parcerias de marca (Disney, Oxford, NASA), selo de segurança, relatório; grátis limitado | pt-BR na interface, conteúdo em inglês | DADO: App Store BR id1002043426 |
| **PlayKids** | Indireto (vídeos e jogos 0 a 8) | Premium mensal R$ 29,90; outros itens R$ 21,90 e R$ 12,90; via Claro R$ 14,99/mês ou R$ 4,99/semana | 18 mil vídeos, 150 jogos, offline, limite de tempo de tela, sem anúncio | Controle parental e "sem anúncio"; reembolso do anual em 7 dias | pt-BR | DADO: App Store BR id613398383; claro.com.br/servicos/kids/playkids |
| **YouTube Kids** | Substituto grátis com anúncio | Grátis com publicidade; sem anúncio com YouTube Premium (família R$ 34,90/mês desde 21/11/2022; individual R$ 20,90) | Vídeo com filtro de idade e controle parental | Marca Google; 204 mil avaliações BR, nota 4,7 | pt-BR | DADO: App Store BR id936971630; Tecnoblog 20/10/2022 (preço pode ter mudado) |
| **Matific** | Direto (matemática adaptativa, "ensino em casa") | Tem plano mensal e anual para pais e teste grátis de 7 dias; os valores em R$ não carregaram na página | "Tutor pessoal", 30 min por semana, trilha adaptativa, "Zona do Responsável" com frequência, tempo, tópicos e e-mail semanal | Promete "melhora de 34% em testes" com estudo próprio não detalhado | pt-BR | DADO: matific.com/bra/pt-br/home/parents (preço não carregou) |
| **Kumon (e Kumon Connect)** | Indireto (método presencial com tablet) | Sem preço no site; venda por unidade e orientador, com avaliação gratuita. Faixa de R$ 150 a R$ 350/mês circula em textos sem data e sem origem (DADO FRACO) | Matemática, português, inglês, japonês; Connect é o mesmo material em tablet | "Autonomia para aprender. Confiança para ir além"; hábito de estudo; orientador humano | pt-BR | DADO: kumon.com.br; faixa de preço: DADO FRACO |
| **Árvore** | Indireto (leitura; venda para escola) | Sem preço para família; CTA "Solicitar demonstração" | Trilhas de leitura, avaliação de fluência, SuperAutor | Família aparece como beneficiária; quem paga é a escola | pt-BR | DADO: arvore.com.br |
| **Elefante Letrado** | Indireto (leitura; venda para escola) | Acesso "exclusivo para alunos de escolas que assinam" | Biblioteca digital infantil | Nota 3,7 (366 BR) | pt-BR | DADO: App Store BR id1192489395 |
| **Escola Games** | Substituto grátis | Grátis; menu mostra "Conta Free", o que sugere plano pago não descrito | Jogos do 1º ao 5º ano | Não identifica mantenedor na home | pt-BR | DADO: escolagames.com.br (não confirmei anúncios de terceiros) |
| **Ludo Educativo** | Substituto grátis | Grátis, sem plano pago, sem anúncio de terceiro visível | Português 1º ao 7º, matemática 1º ao 9º, ciências e outras | Mantido por CDMF/INCTMN, apoio CNPq e FAPESP | pt-BR | DADO: ludoeducativo.com.br |
| **Smartick** | Direto (matemática e leitura, 4 a 14 anos, 15 min/dia) | Preço varia por país e só aparece na área dos pais; não consegui ver o valor do Brasil | Método adaptativo diário | Promessa de sessão curta diária; "tarifas especiais para mais de um filho e períodos longos" | pt (há site em pt) | DADO: support.smartickmethod.com artigo 2761197 (sem valor) |
| **Alura Kids** | Não encontrado | Nenhuma página de produto infantil da Alura apareceu; só planos adultos (Plus e Pro, 2 anos) e "START by Alura" para rede pública | | | | Não entra |
| **Mathler** | Fora do escopo | Jogo de quebra-cabeça diário em inglês (mathler.com); não é produto para pais | | | | Não entra |

Nota sobre datas: os preços em R$ são da App Store BR em 24/10/2026, exceto onde a coluna de fonte diz outra coisa (Canaltech 19/04/2025 para os anuais do Duolingo, Tecnoblog 20/10/2022 para o YouTube Premium, Claro sem data para o PlayKids via operadora). As de data antiga podem ter mudado.

**Leitura (OPINIÃO).** Dois blocos competem de verdade pela carteira do pai: o **grátis de marca** (Khan em português, YouTube Kids, Duolingo grátis) e o **pago em inglês ou para escola** (Prodigy, Lingokids, Matific, Árvore, Elefante). **Não achei nenhum app pago, em português do Brasil, que cubra matemática, português e inglês para 7 a 12 anos, offline e sem conta obrigatória.** Isso é lacuna de posicionamento, não prova de demanda: pode ser que ninguém faça porque o pai brasileiro não paga por isso. O beta (seção 7) existe para responder essa dúvida.

### 1.2 Nota e volume de avaliações (BR, 24/10/2026)

| App | App Store BR (nota, avaliações) | Google Play, loja BR (nota, avaliações; a contagem do Play é global, não só Brasil) |
|---|---|---|
| Duolingo | 4,9 · 1,2 mi | 4,86 · 51,3 mi · contém anúncios · compras no app |
| Lingokids | 4,4 · 88 mil | 4,11 · 223 mil · sem anúncios · compras no app |
| PlayKids | 4,2 · 43 mil | 3,59 · 214 mil · sem anúncios · compras no app |
| Prodigy Math Game | 4,9 · 117 | 4,36 · 68,9 mil · sem anúncios · compras no app |
| Khan Academy Kids | 4,8 · 611 | 4,12 · 57,3 mil · sem anúncios · sem compras |
| Khan Academy | 4,8 · 3,5 mil | 4,07 · 174 mil · sem anúncios · sem compras |
| YouTube Kids | 4,7 · 204 mil | 4,33 · 3,43 mi · contém anúncios · sem compras |
| Duolingo ABC | 3,9 · 96 | não abri |
| Elefante Letrado | 3,7 · 366 | não abri |

Fonte: páginas da App Store BR via WebFetch e JSON-LD das páginas do Play (`hl=pt_BR&gl=BR`) via curl, 24/10/2026. Smartick e Matific Galaxy não retornaram dados no Play.

### 1.3 Faixa de preço do item comparável (assinatura mensal para família, cobrada no Brasil)

Entram só os pagos com valor em R$ confirmado: Duolingo Super (R$ 31,90, que entra como mensal por inferência, ver 1.1; anual R$ 179,90 a R$ 269,90), Lingokids (R$ 59,90 mensal; anual R$ 289,00 a R$ 359,90), PlayKids (R$ 29,90 mensal), Prodigy (R$ 79,90 a R$ 179,90 mensal; anual R$ 499,90 a R$ 999,90). Ficam fora: grátis, escola, Kumon (DADO FRACO), Matific e Smartick (sem valor).

- **Mensal:** mínimo R$ 29,90 (PlayKids), mediana R$ 45,90 (entre Duolingo 31,90 e Lingokids 59,90; com Prodigy Core 79,90 a lista é 29,90 / 31,90 / 59,90 / 79,90, mediana R$ 45,90), máximo R$ 179,90 (Prodigy Ultra).
- **Anual, equivalente por mês:** mínimo R$ 14,99 (Duolingo individual), R$ 22,49 (Duolingo família), R$ 24,08 a R$ 29,99 (Lingokids), R$ 41,66 a R$ 83,33 (Prodigy). Mediana da lista de 6 valores: R$ 27,04.
- **Conta:** o anual custa de 40% a 52% do mensal x 12 em todos (Duolingo 179,90 contra 382,80, 47%; Lingokids 289 contra 718,80, 40%; Prodigy 499,90 contra 958,80, 52%). O mercado empurra o pai para o anual com desconto grande.

### 1.4 Mapa de posicionamento (texto)

Eixo horizontal: preço mensal equivalente (grátis, até R$ 25, R$ 25 a 60, acima de R$ 60). Eixo vertical: idioma e matérias para a criança brasileira de 7 a 12 (só inglês ou 1 matéria; pt-BR com 1 matéria; pt-BR com 3 matérias).

| | Grátis | Até R$ 25/mês | R$ 25 a 60/mês | Acima de R$ 60/mês |
|---|---|---|---|---|
| **pt-BR, 3 matérias (mat, pt, en)** | (vazio) | **Bobby (proposta)** | (vazio) | Kumon presencial (DADO FRACO no preço) |
| **pt-BR, 1 matéria** | Khan Academy (mat), Ludo, Escola Games | Duolingo família (idiomas e mat) | Matific (preço não confirmado), PlayKids | |
| **Só inglês ou escola** | Khan Kids, Duolingo ABC | | Lingokids anual | Prodigy, Lingokids mensal |

---

## 2. Como o pai brasileiro decide e do que reclama

### 2.1 Pesquisas (DADO)

- **Panorama Mobile Time/Opinion Box, Crianças e Smartphones 2025** (2.005 pais de 0 a 16 anos, julho de 2025, margem 2,2 p.p.; mobiletime.com.br, 05/09/2025): primeiro celular próprio em média aos **10 anos e 3 meses**; têm smartphone próprio **45% das crianças de 7 a 9** (eram 49%) e **69% das de 10 a 12** (eram 76%); pais que definem limite de tempo: **84% (7 a 9)** e **82% (10 a 12)**; mais da metade dos pais de crianças a partir de 4 anos acha que o filho usa o celular mais do que deveria. A matéria liga a queda da posse ao debate sobre danos e à lei federal que proibiu celular na escola. O relatório completo (apps educativos, compras em app) não estava na matéria.
- **TIC Kids Online Brasil 2025** (Cetic.br/NIC.br, 2.370 crianças e adolescentes de 9 a 17 e responsáveis, março a setembro de 2025; PDF "principais resultados", lido via pdftotext): **92%** dos 9 a 17 usam internet; **81%** pesquisam para trabalhos escolares; jogos online entre 9 a 10 anos: **43% jogam mais de uma vez por dia**, 20% ao menos uma vez por dia, 27% não jogaram; **21% dos 11 a 17 já gastaram em jogos online** para avançar de fase ou ganhar itens (11 a 12 anos: 16%); mediação técnica dos pais (total 9 a 17): **37% usam recurso que limita tempo, 34% monitoram sites e apps, 33% filtram apps que a criança pode baixar, 31% usam alerta de compra em aplicativo**; entre os 9 a 10, **58%** dizem que os pais colocam regras para usar o celular e 46% que olham o celular (leitura do gráfico 4A).
- **Datafolha para Itaú Social, Fundação Lemann e BID** (1.306 responsáveis, dezembro de 2021; Agência Brasil/O Povo, 15/02/2022): famílias dizem que o filho precisa de reforço em **matemática (71%)** e **português (70%)**; dois em cada três alunos precisariam de apoio em alguma matéria; 28% querem reforço e recuperação como prioridade da escola. É o dado mais recente que achei do Datafolha sobre o tema; não há edição 2025/2026 nos resultados.
- **Instituto Alana:** não achei relatório específico sobre apps infantis. O Relatório Alana 2024 (PDF de 03/2026) trata de influenciadores mirins e apostas e de design manipulativo em plataformas em geral; a busca por "aplicativo", "jogo digital", "loot" e "design manipulativo" no texto extraído não retornou trecho. Posição pública do Alana (Carta Capital, Congresso em Foco): criança não distingue publicidade de conteúdo; contra perfilamento e análise emocional para anúncio. Serve de contexto, não de dado sobre apps.

**O que isso diz para a venda (OPINIÃO).** O pai que vai pagar pelo Bobby (1) já limita tempo de tela e tem medo de tela demais, então a promessa precisa ser **curta e com parada clara**, não "horas de diversão"; (2) tem no celular próprio da criança de 10 a 12 anos o aparelho mais provável, e no de 7 a 9 o celular dos pais; (3) sente a dor em matemática e português antes de inglês; (4) em 1 de cada 3 casas já existe alerta de compra em app, logo "a criança não consegue comprar nada" é argumento real, não detalhe.

### 2.2 O que os pais reclamam nas avaliações (10 avaliações reais, sem nome; feed público de avaliações recentes da App Store BR, 24/10/2026)

| # | App | Data | Nota | O que diz (resumo fiel) | Tema |
|---|---|---|---|---|---|
| 1 | Lingokids | 16/10/2026 | 4 | "Infelizmente pra quem está no Brasil o preço fica muito caro" | preço em R$ |
| 2 | Lingokids | 12/09/2026 | 1 | Única frase: "Oferece compras dentro do app" | compra no app como motivo de 1 estrela |
| 3 | PlayKids | 15/10/2026 | 1 | Pagou o plano anual por engano, quer usar, mas o login dá erro | pagamento sem conta funcionando |
| 4 | PlayKids | 09/10/2026 | 4 | Jogos que antes eram grátis "agora são para o plano premium" | muro pago movido depois |
| 5 | PlayKids | 29/08/2026 | 1 | Assinante há mais de 10 anos; atualizar dado de pagamento é "um transtorno", cartão válido recusado, suporte | suporte e cobrança |
| 6 | PlayKids | 26/07/2026 | 1 | Precisa redefinir a senha e o e-mail nunca chega | recuperação de acesso |
| 7 | Duolingo | 23/10/2026 | 2 | Nas competições quem é Super "está sempre na frente"; pede ligas separadas | pagar para vencer |
| 8 | Duolingo | 22/10/2026 | 5 | "As lições poderiam precisar de menos baterias" | energia como atrito |
| 9 | Khan Academy Kids | 04/05/2024 | 1 | Veio por dica de professora, "só em inglês", promessa de português há 4 anos | idioma |
| 10 | Duolingo ABC | 06/01/2026 | 5 | "Falta a versão em português" (mesma queixa em 22/07/2025, 31/07/2025 e 25/08/2026 no Khan Kids) | idioma |

Outras, para contexto: Lingokids 04/10/2026 (4 estrelas, criança assustada com evento de Halloween), Lingokids App Store 21/12/2020 ("mensalidade cara, mas a filha adora") e 25/01/2018 ("não fui avisado que não era gratuito"); Duolingo 23/10/2026 (2 estrelas, leitor de tela quebrou após atualizações).

**Temas em ordem de risco para o comprador, depois por contagem (OPINIÃO sobre a ordem; contagem das 10 da tabela, com o que ficou fora da amostra entre parênteses):** (1) dinheiro perdido ou travado: pagou e não entra, cobrança e dado de cartão, muro pago movido (#3, #4, #5), 3 (mais 1 de 2018); (2) preço "caro para o Brasil" (#1), 1 (mais 1 de 2020); (3) idioma só inglês (#9, #10), 2 (mais 3 de 2025 e 2026 no Khan Kids e no Duolingo ABC); (4) pagar para vencer e energia (#7, #8), 2; (5) acesso e senha (#6), 1 (fino). Todo tema com menos de 3 avaliações na amostra é fino. Lição direta para o Bobby: o maior risco de 1 estrela está em **conta, cobrança e cancelamento** (#3, #5, #6, mais a de 2018 fora da amostra), e não no conteúdo. Hoje o Bobby não tem nenhum dos três.

---

## 3. Modelos de monetização e o que o ECA Digital permite

| Modelo | Como seria no Bobby | Viável? | Por quê (DADO) e risco (OPINIÃO) |
|---|---|---|---|
| **Assinatura do responsável (mensal e anual), por família** | Adulto paga uma vez e libera todos os perfis do aparelho (e da conta, quando houver) | **Sim, recomendado** | Decreto 12.880 art. 12 §2º só exige informar microtransações na classificação; compra é do adulto, não da criança (ECA Digital art. 18, II: pais devem poder restringir compras). Por família evita "por criança" que Prodigy cobra e o pai com 2 filhos sente. Risco: renovação automática mal avisada vira reclamação (CDC); anual precisa de reembolso em 7 dias (direito de arrependimento em compra à distância, CDC art. 49, **citado de memória, não reaberto; advogado confirma**; PlayKids declara reembolso do anual em 7 dias na App Store) |
| **Compra única (licença vitalícia)** | R$ X uma vez por família | **Sim, mas limita** | Cabe no PWA sem servidor. Risco: sem receita recorrente para pagar áudio, servidor e suporte; difícil subir depois; a loja Apple exige IAP para desbloquear conteúdo (guideline 3.1.1) |
| **Escola ou licença (B2B)** | Pacote por turma com painel do professor | **Sim, mas é outro produto** | Árvore, Elefante Letrado e Matific vivem disso. Exige painel de turma, contrato, licitação ou venda a escola particular, suporte. Depois do primeiro ano, não antes (OPINIÃO) |
| **Freemium com 1 planeta grátis** | 1 galáxia (ou os 2 primeiros mundos de cada) grátis para sempre; o resto na assinatura | **Sim, combinado com a assinatura** | Modelo de Duolingo, Lingokids e Prodigy. Regra: o muro nunca se move depois (queixa #4 PlayKids). Apple Kids Category exige que a oferta de compra fique atrás de parental gate (guideline 1.3) |
| **Anúncio (qualquer)** | | **Não** | Perfilamento para publicidade é proibido (Lei 15.211 arts. 22 e 26); Apple 1.3 e 5.1.4 vedam anúncio de terceiros em app infantil salvo exceção documentada; Google Families só permite SDK autocertificado e sem anúncio comportamental. Mesmo o permitido mata o argumento "sem anúncio", que é o que Lingokids e PlayKids vendem |
| **Loot box, baú pago, sorteio pago** | | **Proibido** | Lei 15.211 art. 20 e art. 2º IV (pagamento por item aleatório). Google Families lista "sorteios" como violação comum. Baú grátis e determinístico segue permitido pela letra da lei |
| **Moeda comprável, compra pela criança** | | **Não** | ECA Digital art. 18, II e §2º; Google Families exige distinguir moeda do jogo de dinheiro real; FTC trata moeda intermediária como padrão enganoso. O Bobby já declara em código que moeda nunca é vendida: manter |
| **Pagar para vencer (vantagem em liga)** | | **Evitar** | Cabe na lei, mas gera a queixa #7 do Duolingo e fere o princípio do art. 5º (melhor interesse) se a criança sente injustiça. Assinatura compra conteúdo e relatório, nunca vantagem no jogo |

**Decisão de desenho que isso impõe (OPINIÃO):** a assinatura libera **conteúdo (planetas), relatório e perfis**; nunca libera moeda, vida, congelador, baú ou vantagem. A tela de compra vive na área do responsável, atrás da senha, e a criança nunca vê preço.

---

## 4. Requisitos para vender

### 4.1 Pessoa jurídica, nota e contador

- **MEI não serve** para licenciar software ou assinatura de app: os CNAEs de desenvolvimento e licenciamento de programas (6201-5/01, 6202-3/00, 6203-1/00) não constam do Anexo XI da Resolução CGSN 140/2018 (lista da Unicamp/DGA 2024; buscadorncm.com.br). DADO em fontes secundárias; o texto consolidado do Anexo XI não foi reaberto. **Contador decide** o enquadramento: o caminho usual é ME no Simples Nacional com CNAE de licenciamento. Antes do primeiro real cobrado.
- **Nota fiscal:** serviço digital emite NFS-e pelo município (padrão nacional). Quem vende por Hotmart tem a plataforma como intermediária; não confirmei em página oficial quem emite a nota nesse caso (ver 9).
- **Imposto:** depende do anexo do Simples e do fator R. Não estimo; é do contador.

### 4.2 Documentos e consentimento (precisa de advogado)

Já mapeado em `pesquisa/03-etica-e-lgpd-infantil.md`, seções 4 e 6: termos de uso com classificação indicativa em português (Decreto 12.880 art. 12 §4º), política de privacidade pública (LGPD art. 14 §2º), consentimento parental específico e em destaque (art. 14 §1º), relatório de impacto se tratar dado além do estritamente necessário (Lei 15.211 art. 16), representante legal no Brasil (art. 40), canal do encarregado. A Apple avisa que o parental gate dela **não** vale como consentimento parental legal (guideline 5.1.4). Enquanto o Bobby não tiver conta nem servidor, o volume de dado tratado é mínimo; **a conta do responsável (seção 6, item 1) é o que faz o advogado virar obrigatório**.

### 4.3 Classificação indicativa e selo

- **Classificação indicativa:** Portaria MJSP 502/2021 (vigente desde 03/01/2022) e Portaria 361/2023: jogos e apps distribuídos só por via digital e autoclassificados no **IARC** ficam dispensados de requerimento prévio (art. 45); o MJSP pode reclassificar de ofício e pedir a versão publicada. Na Play e na App Store o questionário IARC faz parte da publicação. **Para a versão web (PWA) não há loja que gere o IARC**: a classificação nos termos de uso (Decreto art. 12 §4º) precisa de orientação do advogado sobre o rito. Não confirmei o rito para app só na web (ver 9).
- **Selo:** não achei selo ou certificação governamental brasileira para app infantil. O que existe e concorrentes exibem é o **kidSAFE Seal** (privado, EUA; Lingokids usa; apps brasileiros certificados: Educacross, EduEdu do Instituto ABCD, Play do Bem). É argumento de venda, não obrigação. Custo não aberto.

### 4.4 Canal de venda: web contra loja

| Item | Web (PWA) com Stripe | Web com Pagar.me (Stone) | Web com Hotmart | Google Play | Apple App Store |
|---|---|---|---|---|---|
| Taxa por venda | Cartão nacional **3,99% + R$ 0,39**; Pix **1,19%** (só por convite); boleto R$ 3,45; Billing (assinatura) **+0,7%** do volume; cartão internacional +2% (stripe.com/br/pricing, 24/10/2026) | Crédito à vista **4,19%**, Pix **0,99%**; a página não mostra recorrência nem débito (pagar.me/precos redireciona para Stone, 24/10/2026) | **9,9% + R$ 1,00** por venda (blog Hotmart; tactus.com.br). Tactus diz que o fixo passaria a R$ 2,49 em 21/09/2026 e um comparativo de 08/10/2026 já mostra 9,9% + R$ 2,49: **DADO FRACO**, não confirmei na página oficial | **15%** em assinatura com renovação automática, qualquer faturamento; 15% nas demais compras até US$ 1 mi/ano, 30% acima (support.google.com answer/112622) | **15%** no Small Business Program (até US$ 1 mi/ano de receita líquida), 30% padrão (developer.apple.com/app-store/small-business-program) |
| Custo de entrada | 0 | 0 | 0 | **US$ 25 uma vez**; conta pessoal criada após 13/11/2023 só publica após **teste fechado com 12 testadores por 14 dias** (regra em fontes secundárias; isenta para conta de organização) | **US$ 99/ano** |
| Regras para infantil | Nenhuma da plataforma; só a lei | idem | idem | Política de Famílias: declarar público, sem anúncio comportamental, só SDK autocertificado, sem AAID e identificadores, sem localização, "ação de adulto" para compra e recursos sociais | Kids Category (1.3): sem analytics nem anúncio de terceiros salvo exceção, compra atrás de parental gate; **IAP obrigatório** para desbloquear conteúdo (3.1.1); app multiplataforma pode aceitar o que foi comprado na web **desde que o mesmo item exista como IAP** (3.1.3 b) |
| Pix e parcelamento | Pix por convite; parcelamento não aberto | Pix sim | Pix e boleto sim (prática da plataforma; não abri a página) | Formas de pagamento do Google (cartão, Pix no Brasil via Google Play; não abri) | Formas da Apple |
| Quem emite nota e cuida de cancelamento | Você | Você | Hotmart (não confirmado) | Google | Apple |

**Conta de padaria (OPINIÃO com as taxas acima), assinatura anual de R$ 149:** Stripe cartão: 149 x 4,69% + 0,39 = R$ 7,38 de taxa, sobram **R$ 141,62**. Pagar.me Pix: 149 x 0,99% = R$ 1,48, sobram **R$ 147,52**. Hotmart (9,9% + 2,49): R$ 17,24, sobram **R$ 131,76**. Play ou Apple (15%): R$ 22,35, sobram **R$ 126,65**, antes de imposto em todos.

**Conclusão de canal (OPINIÃO):** primeiro ano na **web, com Pix e cartão**, porque a taxa é 3 a 5 vezes menor, o Bobby já é PWA instalável, não há fila de revisão e o cancelamento fica nas suas mãos (e sob o CDC). Loja entra depois, para alcance e confiança, e aí a regra da Apple obriga a vender também por IAP dentro do app.

---

## 5. Posicionamento em uma frase para o pai (OPINIÃO)

**Frase que vale hoje, com o que o app já faz (DADO: mapa do app e código):**

> **"O Universo de Bobby: matemática, português e inglês para crianças de 7 a 12 anos, em português do Brasil, sem anúncio, sem compra pela criança, funciona sem internet, e você vê no próprio app o que ela treinou e onde errou."**

**Frase-alvo, que só pode ir ao ar depois dos itens 1 a 3 da seção 6 (relatório semanal enviado e sessão curta com parada medida):**

> **"O Universo de Bobby: uma missão curta por dia de matemática, português e inglês para crianças de 7 a 12 anos, em português do Brasil, sem anúncio, sem compra pela criança, funciona sem internet, e toda semana você recebe o que ela treinou e onde errou."**

Não escrevo "15 minutos por dia" porque não há medição de duração de sessão no app hoje; a meta diária existe em perguntas, não em minutos (`src/interface/ciclo.js`). Se a medição do beta mostrar a duração típica, o número entra com fonte.

O que as frases **não** dizem, de propósito: "melhora a nota", "aprende mais rápido", "método comprovado". Pela pesquisa pedagógica da fase 1, a evidência de efeito de app é correlacional e das próprias empresas; prometer resultado sem estudo próprio é promessa sem fonte e, para criança, é publicidade de risco (Lei 15.211 art. 5º). A promessa do Matific ("34%") é o que **não** copiar.

---

## 6. O que o app precisa TER para o pai pagar (o que os pagos têm e o Bobby não), em ordem de impacto na venda

| # | Funcionalidade | Quem tem | Estado no Bobby (DADO, código e mapa) | Por que pesa na venda |
|---|---|---|---|---|
| 1 | **Conta do responsável com restauração de compra e sincronização entre aparelhos** | Todos os pagos | Não existe: tudo em `localStorage`, cópia manual em `.json` | Sem isso não dá para cobrar assinatura, trocar de celular, nem atender "paguei e não entra" (queixa #3). É pré-requisito, não feature |
| 2 | **Relatório semanal fora do app** (e-mail ou WhatsApp) | Matific (e-mail semanal), Lingokids (relatório no Plus), Prodigy (app dos pais) | Relatório existe, mas só dentro do app e só se o pai abrir (mapa, 2.6) | É o que o pai compra: ver sem precisar pedir o celular |
| 3 | **Teste grátis e muro fixo** (1 planeta grátis para sempre, resto pago; nunca mover) | Duolingo (2 semanas, Canaltech), Lingokids (grátis limitado), Prodigy (grátis com assinatura dos pais), Matific (7 dias), PlayKids (3 dias de degustação no plano via Claro, claro.com.br) | App 100% grátis hoje | O pai testa antes; e a regra "o grátis continua grátis" evita a queixa #4 |
| 4 | **Diagnóstico de entrada e dificuldade adaptativa** | Matific ("tutor pessoal"), Smartick | Só faixa de idade escolhida uma vez | É a diferença entre "joguinho" e "reforço"; e justifica preço acima de PlayKids |
| 5 | **Áudio de qualidade e inglês que funcione sem voz do aparelho** | Lingokids, Duolingo | Em andamento (fase 2 e 4) | Primeira queixa listada da própria usuária no mapa (`pesquisa/00-mapa-do-app-hoje.md`, seção 1.1); no inglês, 341 de 400 perguntas sorteadas dependem de ouvir (mesmo arquivo, B7) |
| 6 | **Perfis de família (até 4 crianças) num só pagamento** | Lingokids (4 perfis), Duolingo família (6) | Perfis existem, sem pagamento | Prodigy cobra por criança com 25% de desconto; família única é argumento de preço |
| 7 | **Alinhamento visível ao ano escolar (BNCC)** na tela do pai | Matific ("currículo nacional"), Prodigy ("aligned to curricula"), Khan (por ano) | Conteúdo segue progressão por mundo, sem rótulo de ano escolar para o pai | O pai pergunta "isso é do 3º ano?" |
| 8 | **Controles do responsável completos**: limite de tempo, desligar ofensiva e lembretes, pausar | PlayKids (limite de tela), exigência do ECA Digital art. 17 e 18 | Parte existe (senha, apagar, meta); limite de tempo e desligar mecânicas: conferir no ciclo | Além de lei, é o que 82% a 84% dos pais já fazem por conta própria (Panorama 2025) |
| 9 | **Cancelar em um toque, reembolso em 7 dias, suporte com prazo** | Todos via loja; PlayKids declara reembolso do anual em 7 dias | Não existe | Queixas #5 e #6; direito de arrependimento (CDC art. 49, citado de memória; advogado confirma) |
| 10 | **Prova social honesta**: famílias do beta, tempo médio de uso, erros que caíram | Prodigy usa "11.000 pais esta semana" | Nada publicado | Única prova que o Bobby pode ter sem inventar estudo |
| 11 | **Selo kidSAFE** (opcional) | Lingokids, Educacross, EduEdu | Não | Reforça "seguro"; custo a orçar |

Itens 1, 2 e 3 vêm antes de qualquer cobrança. Itens 4 a 7 justificam o preço do cenário 2. Itens 8 a 11 evitam 1 estrela.

---

## 7. Três cenários de preço e qual escolher no primeiro ano

Métrica de valor: **família** (não por criança), porque o valor para o pai escala com filhos e não com minutos (recompensa por tempo é justamente o que o Decreto art. 9º III trata como risco). Todos os cenários mantêm 1 planeta grátis e nada pago para a criança.

| Cenário | Mensal | Anual (equivale por mês) | Para quem | Comparação com concorrentes | Risco |
|---|---|---|---|---|---|
| **1. Compra única** | | R$ 449 uma vez, por família, vitalício (OPINIÃO: cerca de 3 anuais do cenário 2, para que a compra única não canibalize o anual; valor ilustrativo) | Pai que odeia assinatura; produto sem servidor | Não achei compra única entre os concorrentes pesquisados; Prodigy e Lingokids só assinam | Sem receita para áudio, suporte e servidor da conta; Apple exige IAP; não dá para subir sem trocar de produto. Bom só se o Bobby ficar 100% offline para sempre |
| **2. Assinatura família "para aprender" (recomendado)** | **R$ 19,90** | **R$ 149** (R$ 12,42/mês), até 4 perfis | Família de classe média que já paga Duolingo ou PlayKids | Mensal abaixo de PlayKids (29,90) e do item de R$ 31,90 do Duolingo (inferência de período, ver 1.1); anual entre Duolingo individual (179,90) e metade de Lingokids (289); 3 matérias em pt-BR que nenhum deles tem | Pode estar barato se o pai comparar com Kumon; sobe depois do beta, com aviso e preço antigo garantido para quem já paga |
| **3. Assinatura "reforço"** | R$ 34,90 | R$ 249 (R$ 20,75/mês) | Pai que compara com reforço escolar e Kumon | Acima do item mensal do Duolingo (31,90) e de PlayKids (29,90); igual ao YouTube Premium família de 2022 (34,90, sem confirmação atual); abaixo de Lingokids mensal (59,90) e Prodigy Core (79,90) | Só se sustenta com itens 2, 4 e 7 da seção 6 prontos e com prova social; sem isso o pai escolhe Khan grátis |

**Escolha para o primeiro ano (OPINIÃO, apoiada na skill de preço: "escolha um preço do qual dá para aprender", sem cair na armadilha do preço ultrabaixo):** **cenário 2**, com o anual como oferta principal. Motivos: (a) o pai brasileiro já tem R$ 20 a R$ 32 por mês ancorado em Duolingo família (R$ 22,49 equivalente), PlayKids (29,90) e no item de R$ 31,90 do Duolingo (inferência de período, ver 1.1), e o YouTube família estava em R$ 34,90 em 2022; a única reclamação de preço da amostra (#1) é do Lingokids, cujo mensal é R$ 59,90 (OPINIÃO: a avaliação não cita valor, então "caro a partir de 59,90" é leitura minha, não dado); (b) R$ 149/ano é um número redondo que paga Stripe, contador e domínio com poucas dezenas de famílias (conta na seção 8); (c) deixa subida clara para o cenário 3 quando os itens 4 e 7 existirem. Gatilho de revisão aos 90 dias de venda na web: se mais de 40% de quem termina o planeta grátis assina sem desconto, sobe para R$ 24,90 e R$ 199 para novos (regra de bolso da skill: conversão acima de 40% é sinal de preço baixo).

**Nunca:** desconto que expira em contagem regressiva na tela da criança, preço escondido em moeda, upsell no meio da fase. Tudo isso é prática manipulativa pelo Decreto art. 10.

---

## 8. Caminho de venda em 3 etapas, com custo e prazo

Custos abaixo: só os que têm fonte. Advogado, contador e selo: **pedir dois orçamentos**; não invento valor.

### Etapa 1 · Beta fechado com famílias conhecidas (meses 1 a 3)

- **Quem:** 10 a 20 famílias (escola da filha, Avenue, amigos), 1 a 3 crianças cada, mistura de 7 a 9 e 10 a 12 anos.
- **O que entregar antes:** itens 1 a 3 da seção 6 em versão mínima (conta por e-mail do responsável com link mágico, relatório semanal por e-mail, planeta grátis + código de acesso ao resto); termo de beta de uma página e aviso de privacidade (advogado revisa); medição D1/D7/D30 já existe (`medicao.js`).
- **O que medir:** D1, D7 e D30 por criança; fase onde param; se o pai abre o relatório semanal; ao fim, pergunta Van Westendorp aos pais (caro demais, barato demais, caro mas pagaria, pechincha) e **uma pré-venda real** do anual a R$ 149 com reembolso garantido. Intenção não conta; só cartão passado.
- **Custo com fonte:** domínio e e-mail transacional (não abri preços; ordem de dezenas de reais por mês, OPINIÃO); Stripe só cobra por venda. **Sem custo de loja.**
- **Precisa de:** advogado (termo de beta, aviso de privacidade, base legal do e-mail do pai); contador (abrir ME antes da pré-venda, porque MEI não cobre).
- **Portão de saída:** pelo menos 30% das famílias do beta pagam a pré-venda e D7 acima do que o app tem hoje (OPINIÃO sobre os números; são metas para discutir, não fonte).

### Etapa 2 · Lançamento na web (meses 4 a 8)

- **Como:** página de venda própria (preço em texto, FAQ, política, cancelamento em um clique), checkout Stripe (cartão 3,99% + 0,39, Billing 0,7%) e Pix (Stripe por convite a 1,19% ou Pagar.me a 0,99%); NFS-e automática pelo contador ou integração.
- **Aquisição:** canal orgânico (Instagram do Filipe, famílias do beta indicando, escola) antes de qualquer tráfego pago; tráfego pago para pais é permitido (anúncio é para o adulto), mas não antes de medir conversão da página.
- **Custo com fonte:** taxas por venda acima; sem taxa fixa. Conta de padaria a R$ 149/ano com Stripe cartão: sobram R$ 141,62 por família antes de imposto. 50 famílias = R$ 7.081 líquidos de taxa no ano; 200 famílias = R$ 28.324. Não cobre salário; cobre áudio, servidor e contador (OPINIÃO sobre o que cobre; custos de servidor não orçados aqui).
- **Precisa de:** advogado (termos, política, consentimento parental, relatório de impacto se a conta guardar dado de criança, classificação indicativa no texto); contador (NFS-e, Simples, fator R); seguranca-minima (7 itens) antes de publicar.
- **Portão de saída:** 100 famílias pagantes e churn mensal medido (OPINIÃO).

### Etapa 3 · Lojas (meses 9 a 12)

- **Google Play:** US$ 25 uma vez; se a conta for pessoal e nova, teste fechado com 12 testadores por 14 dias (as famílias do beta servem); política de Famílias; IARC; assinatura a 15%.
- **Apple:** US$ 99/ano; Kids Category (1.3) ou não (se não, nada de "para crianças" no nome, guideline 2.3.8); IAP obrigatório; manter preço do IAP igual ao da web (3.1.3 b permite aceitar compra feita na web, desde que o mesmo item exista como IAP); 15% no Small Business Program.
- **Risco técnico a conferir antes:** PWA empacotado pode ser recusado pela Apple por "funcionalidade mínima" (guideline 4.2; **não abri essa seção**, ver 9). Precisa de teste de aparelho iOS real, que a fase 1 já apontou como lacuna.
- **Precisa de:** advogado (termos por loja, parental gate não é consentimento), contador (receita via loja entra como venda intermediada).

---

## 9. Riscos, sinais de alerta e o que não abriu

### 9.1 Riscos (OPINIÃO, com o dado que sustenta)

1. **O grátis de marca é o concorrente real.** Khan em português, 4,8 na App Store BR, sem anúncio. Se o Bobby não entregar relatório semanal e adaptação (itens 2 e 4), o pai escolhe Khan. Sinal de alerta: pai do beta dizendo "mas a Khan é de graça" sem citar o relatório.
2. **Conta e cobrança são onde nascem as 1 estrela** (3 das 10 avaliações, mais 1 de 2018 fora da amostra). Sinal: qualquer e-mail de "paguei e não entra" no beta.
3. **Fiscalização da ANPD a partir do início de 2027 e guia de aferição de idade ainda não publicado** (`pesquisa/03`, 2.1). Lançar na web em 2026 significa lançar antes do guia; desenhar pela versão mais rígida.
4. **Sazonalidade escolar:** churn em dezembro e janeiro é provável (OPINIÃO, sem dado brasileiro aberto). Anual mitiga; medir no primeiro verão.
5. **Dependência de uma pessoa** (desenvolvimento, suporte, conteúdo). Suporte com prazo é item 9; se não houver quem responda em 1 dia útil, não vender anual.
6. **Promessa inflada por pressão de venda.** "34%" do Matific e "milhões aprenderam" do Prodigy são o modelo a evitar; qualquer número de resultado só com medição própria e método publicado.
7. **Apple pode recusar o empacotamento do PWA** (guideline 4.2, não lida). Não prometer loja Apple antes de testar.
8. **Pay-to-win por acidente:** se a assinatura algum dia liberar moeda, vida ou congelador, vira queixa #7 e fere o desenho ético já decidido.
9. **Preço "caro para o Brasil"** apareceu na amostra só no Lingokids (mensal de R$ 59,90; a avaliação não cita valor, OPINIÃO sobre o limiar); se subir para o cenário 3 sem prova, a reclamação tende a aparecer.
10. **Classificação indicativa para app só na web** sem rito claro: resolver com advogado antes da etapa 2.

### 9.2 O que não abriu (não entra como fato)

- Preço em R$ de **Smartick** (só na área dos pais), **Matific** (campos em branco na página), **Kumon** (só faixa sem data), **Hotmart** (página oficial de taxas deu 404; valores de blog), **Duolingo família atual** (itens da App Store sem rótulo; usei Canaltech 04/2025).
- **Alura Kids**: não existe página de produto encontrada. **Mathler**: fora do escopo.
- **Relatório completo do Panorama 2025** (parte de apps educativos e compras), **Datafolha 2025/2026** (não há), **relatório do Alana sobre apps** (não há).
- **Play Store**: contagem de avaliações é global; não há recorte Brasil público. **Prodigy** tem só 117 avaliações na App Store BR, o que sugere presença pequena no país (OPINIÃO).
- **Guideline 4.2 da Apple**, **página de formas de pagamento do Google Play no Brasil**, **quem emite nota na Hotmart**, **custo do kidSAFE**, **custos de advogado e contador**.
- **Texto consolidado do Anexo XI da Resolução CGSN 140** (MEI): usei lista da Unicamp 2024.

---

## 10. As 6 decisões de negócio que mais importam

1. **Modelo:** assinatura do **responsável, por família** (até 4 perfis), com **1 planeta grátis para sempre** e muro que nunca se move. Nada pago para a criança, nunca moeda, baú ou vantagem comprável.
2. **Preço do primeiro ano:** **R$ 19,90/mês e R$ 149/ano**, anual como oferta principal, revisão aos 90 dias de venda (sobe para R$ 24,90 e R$ 199 se a conversão passar de 40%), preço antigo garantido para quem já paga.
3. **Canal:** **web primeiro** (PWA + Stripe cartão + Pix), lojas só depois de 100 famílias pagantes; na Apple, mesmo item como IAP.
4. **Pré-requisito técnico antes do primeiro real:** conta do responsável com restauração e sincronização, relatório semanal por e-mail e muro do planeta grátis. Sem os três, não se cobra.
5. **Pessoa jurídica e gente:** abrir **ME no Simples** (MEI não cobre software), contador desde o beta, advogado para termo de beta, política, consentimento parental e classificação indicativa; seguranca-minima como portão antes da etapa 2.
6. **Promessa:** vender **rotina curta, três matérias em pt-BR, sem anúncio, sem compra pela criança, offline e relatório semanal**. Nenhum número de resultado até haver medição própria publicada.

---

## Fontes abertas nesta pesquisa (24/10/2026)

- App Store BR: Duolingo id570060128; Duolingo ABC id1440502568; Khan Academy Kids id1378467217; Khan Academy id469863705; Prodigy Math Game id950795722; Lingokids id1002043426; PlayKids id613398383; YouTube Kids id936971630; Elefante Letrado id1192489395. Avaliações: feed `itunes.apple.com/br/rss/customerreviews/id=<id>/sortBy=mostRecent/json`.
- Google Play (pt_BR, gl=BR), JSON-LD: com.duolingo; com.prodigygame.prodigy; es.monkimun.lingokids; com.movile.playkids; org.khankids.android; org.khanacademy.android; com.google.android.apps.youtube.kids.
- Canaltech, Super Duolingo, 19/04/2025: canaltech.com.br/apps/super-duolingo-veja-como-funciona-a-assinatura-e-os-beneficios/
- Prodigy membership: webflow.prodigygame.com/main-en/membership
- Matific pais: matific.com/bra/pt-br/home/parents/ · Kumon: kumon.com.br · Árvore: arvore.com.br · Smartick: support.smartickmethod.com/en/articles/2761197-how-much-does-it-cost · Escola Games: escolagames.com.br · Ludo Educativo: ludoeducativo.com.br · Mathler: mathler.com · Claro PlayKids: claro.com.br/servicos/kids/playkids
- Tecnoblog, YouTube Premium, 20/10/2022: tecnoblog.net/noticias/youtube-aumenta-preco-do-premium-familia-assinatura-fica-10-mais-cara-no-brasil/
- Mobile Time, Panorama Crianças e Smartphones 2025, 05/09/2025: mobiletime.com.br/noticias/05/09/2025/criancas-smartphone-25/
- Cetic.br, TIC Kids Online Brasil 2025, principais resultados (PDF): cetic.br/media/analises/tic_kids_online_brasil_2025_principais_resultados.pdf
- O Povo/Agência Brasil, Datafolha para Itaú Social, Lemann e BID, 15/02/2022: opovo.com.br/noticias/brasil/2022/02/15/dois-em-cada-tres-estudantes-precisam-de-reforco-escolar-diz-pesquisa.html
- Instituto Alana, Relatório 2024 (PDF): alana.org.br/wp-content/uploads/2026/03/RelatorioAlana2024.pdf
- Google Play, Política de Famílias: support.google.com/googleplay/android-developer/answer/9893335 · Taxa de serviço: answer/112622 · Conta de desenvolvedor: answer/6112435
- Apple, App Review Guidelines (1.3, 3.1.1, 3.1.3, 5.1.4): developer.apple.com/app-store/review/guidelines/ · Developer Program: developer.apple.com/programs/whats-included/ · Small Business Program: developer.apple.com/app-store/small-business-program/
- Stripe Brasil: stripe.com/br/pricing · Pagar.me (Stone): pagar.me/precos · Hotmart (DADO FRACO): tactus.com.br/taxas-da-hotmart-para-produtor/ e hotmart.com/pt-br/blog/imagens-chamativas
- MEI e CNAE de software: dga.unicamp.br/arquivo/fiscal-e-tributario/04-atividades-nao-permitidas-mei · buscadorncm.com.br/cnae/6201501
- Classificação indicativa: gov.br/mj (Portaria MJSP 502/2021) · lex.com.br (Portaria MJSP 361/2023) · cartilha SBP sobre Classind
- kidSAFE: kidsafeseal.com (Educacross, EduEdu, Play do Bem)
- Teste fechado de 12 testadores (secundárias): extendsclass.com/blog/google-plays-closed-testing-requirement-what-developers-need-to-know-in-2026 · choicely.com/blog/google-play-12-tester-rule
- Leis: já abertas e citadas em `pesquisa/03-etica-e-lgpd-infantil.md` (Lei 15.211/2025, Decreto 12.880/2026, LGPD). O CDC (art. 49) é citado de memória e não foi reaberto nesta pesquisa.
