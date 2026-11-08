# Mesa · 04 · Pedagogia e retenção de longo prazo

Data: 24/10/2026. Autor: especialista em pedagogia e retenção da mesa. Base lida: `docs/FASE-2-especificacao.md`, `pesquisa/RELATORIO-FASE-1.md`, `pesquisa/01-duolingo-retencao.md`, `pesquisa/02-pedagogia-por-materia.md`, `pesquisa/03-etica-e-lgpd-infantil.md`, `README-FASE-3-LOGICA.md` e o conteúdo em `src/conteudo/` (títulos das 150 fases, contados por `grep` nesta sessão). Nenhum código foi editado, nenhum crédito gasto. Só este arquivo foi gravado.

Crítica do Filipe que orienta tudo aqui: "jogo que vai ser vendido tem que funcionar bem" e "ainda dá para evoluir". Leitura minha: funcionar bem, para um app de estudo vendido por assinatura, é a criança continuar voltando depois da semana 2 e o pai continuar pagando depois do mês 1. Tudo o que segue mira esses dois pontos.

## 0. Como ler

| Marca | Significa |
|---|---|
| **DADO** | saiu de página que abri e li nesta sessão, com fonte e data na seção 9. Quando a página só pôde ser lida por resumo de buscador, está escrito "DADO (resumo)" |
| **DADO (Fase 1)** | já estava confirmado nos relatórios `pesquisa/01`, `02` e `03`, com a referência deles (ex.: [01-A28], [F6], [03-§2.1]) |
| **MEDIDO** | contagem feita nesta sessão sobre o código do projeto |
| **OPINIÃO** | inferência, hipótese ou escolha de produto minha. Não é fato. Nunca vira texto de venda |

Regra deste documento: número que não tem fonte aberta não entra como dado, e nada que seja OPINIÃO pode virar promessa para pai ou cliente.

---

## 1. Resumo: as 6 decisões que mais importam

1. **Adaptar por habilidade pequena com um estimador simples (BKT de 4 parâmetros fixos por matéria), não por "nível".** Dominado = probabilidade de domínio acima de 0,90 **em dois dias diferentes**, confirmada por um acerto em revisão mista. Alvo de acerto durante a prática entre 75% e 85%. Seção 7a.
2. **Diagnóstico de entrada de até 10 perguntas por matéria, por escada de unidades**, que só posiciona a trilha e nunca mostra nota. O item que já existe na especificação (3.4) fica, com 10 em vez de 12 e com a saída alimentando o BKT. Seção 7a.
3. **Calendário de 90 dias com "novidade por semana" sem conteúdo infinito**: o que muda a cada semana é o tipo de desafio, o capítulo da história, o evento do planeta e o modo de revisão, não a quantidade de fases. Semanas 2, 4, 8 e 12 têm ritos próprios porque são os pontos em que os apps de estudo perdem gente. Seção 7b.
4. **O relatório dos pais é um produto, não uma tela de estatística**: toda semana, 5 números, 1 "brilhou em", 1 "vale ajudar em" com uma atividade de 5 minutos para fazer em casa, e no fim de cada mês um resumo com o mapa de habilidades. Ele chega por ação do responsável (copiar e compartilhar) até a Fase 4, nunca por push à criança. Seção 7c.
5. **Conteúdo cresce por ano escolar, na ordem 3º, 4º, 5º, 2º, 6º, 7º**, começando pelo que a BNCC pede e o Bobby ainda não cobre (medidas, tempo, probabilidade e estatística em matemática; texto conectado, acentuação e concordância em português). Inglês fica como diferencial e não como "currículo da escola", porque a BNCC só o torna obrigatório no 6º ano. Seção 7d.
6. **Antes de vender, provar retenção localmente com 10 a 20 famílias por 60 dias**: D1, D7, D30, D60 (estrito e janela), sessões por semana, retorno no dia seguinte (estilo CURR) e acerto por habilidade. Meta numérica só depois da linha de base, mas o piso de "vale vender" que proponho é D30 por janela acima de 25% e 3 sessões por semana na mediana. Seção 7e.

---

## 2. Pesquisa 1 · O que acontece com apps de estudo depois da semana 2 e do mês 1

### 2.1 O que tem fonte

| # | Afirmação | Tipo | Fonte |
|---|---|---|---|
| R1 | Benchmark de retenção para apps de **educação** em 2024: **D1 27,5%, D7 17,76%, D30 8,02%**. Média de todas as categorias: D1 28,29%, D7 17,86%, D30 7,88%. A página não define "retenção" nem o período dos dados; diz que vem de "trilhões de mensagens" enviadas pela plataforma | DADO | OneSignal, "Must-know mobile app benchmarks of 2024", publicada em 17/09/2024, modificada em 05/03/2026 |
| R2 | Outro conjunto de benchmarks, atribuído à AppsFlyer, coloca educação em **D1 de 14 a 15% e D30 de 2 a 3%** (2,1% citado como média da categoria, sem estudo nomeado). A página do Business of Apps que traria o número original devolveu bloqueio anti-robô e não foi lida | DADO (secundário, via passion.io, 17/10/2025) | passion.io, "Mobile app retention benchmarks for creators, course and coaching apps" |
| R3 | Leitura dos dois conjuntos: entre o dia 1 e o dia 30, apps de educação perdem de **70% a 85%** de quem voltou no primeiro dia. A diferença entre 8% e 2% no D30 é de método e de amostra (R1 vem de apps que usam push; R2 é mercado geral), não dá para somar | OPINIÃO sobre R1 e R2 | |
| R4 | Na Duolingo, a retenção "é mais frágil nos primeiros 7 dias" (fala do PM de retenção); o salto de 7 dias de ofensiva está associado a 2,4x mais chance de voltar no dia seguinte e 3,6x de terminar o curso; o que mais move o DAU é a volta de quem já usa (CURR, 84% no 2º trimestre de 2026) | DADO (Fase 1) | [01-A1], [01-A6], [01-A16], [01-A28] |
| R5 | A Duolingo celebra marcos de ofensiva em **1 semana, 1 mês, 100 dias e 1 ano**, com animação própria e cartão para compartilhar; sem métrica publicada | DADO (Fase 1) | [01-A10] |
| R6 | Evento de "volta sem culpa" em escala: "Streak Revival" (junho de 2026) restaurou a maior ofensiva de 15,4 milhões de pessoas, perto de 8 milhões sem ofensiva ativa, com 3 lições. A empresa chama de uma das campanhas mais bem-sucedidas, sem número de retenção | DADO (Fase 1) | [01-A15] |
| R7 | A Duolingo envia, por documento oficial, "relatórios de progresso" por e-mail e push, além de lembretes | DADO (Fase 1) | [01-A38] |
| R8 | Khan Academy: quem usa 30 minutos por semana ou mais (cerca de 9% da amostra de 350 mil alunos) teve ganho acima do esperado (efeito 0,36, associativo). Ou seja, até na Khan só 1 em 11 chega à dose que a própria Khan considera útil | DADO (Fase 1) | [F13] |
| R9 | Duolingo ABC (crianças): só existe o estudo encomendado pela Duolingo ao EDC (2021), "28% de ganho em letramento em 9 semanas", sem retenção publicada. Khan Kids: nenhum dado de retenção ou de relatório aos pais em fonte aberta | DADO (resumo); lacuna | busca em 24/10/2026 |
| R10 | Experimento no Peru (4º ao 6º ano): destacar a ofensiva aumentou a intensidade de uso; o lembrete personalizado moveu mais "se usa ou não" | DADO (Fase 1) | [01-A41] |

### 2.2 O que isso diz para o Bobby (OPINIÃO)

- **Não existe curva de retenção pública de app de estudo infantil.** O que temos é benchmark de mercado (R1, R2) e dados de adultos (R4 a R7). A linha de base do Bobby vai ter que ser medida por nós (seção 7e).
- A curva típica (R1, R2) cai forte até o dia 7 e depois decai devagar. O trabalho de retenção tem dois alvos distintos: **chegar ao dia 7** (hábito, já endereçado pelo ciclo diário da Fase 2) e **sobreviver aos dias 14 a 30** (novidade e sentido, que o app ainda não tem).
- O que os que retêm fazem nos dias 30, 60 e 90, pelo que tem fonte: marcos celebrados (R5), volta sem culpa (R6), relatório de progresso ao usuário ou ao responsável (R7) e lembrete personalizado (R10). O que não tem fonte, mas toda a indústria faz: eventos de calendário e conteúdo novo por temporada. Entra como hipótese no calendário da seção 7b.
- **O ponto mais fraco do Bobby hoje para o mês 1 não é mecânica, é sentido**: a criança não sabe "para onde vai" além de acender estrelas no mapa. A narrativa do Embaralho (README, cerimônias) resolve isso por etapa. Falta a camada de 90 dias.

---

## 3. Pesquisa 2 · Domínio e adaptação por habilidade em apps reais

### 3.1 O que tem fonte

| # | Afirmação | Tipo | Fonte |
|---|---|---|---|
| M1 | **Khan Academy** (regras atuais): níveis por habilidade. *Attempted* = menos de 70% certo num exercício; *Familiar* = 70% a 99%; *Proficient* = 100% num exercício; *Mastered* = já *Proficient* **e** acerta a habilidade numa **avaliação mista** (mixed-skill assessment). Errar numa avaliação mista **derruba** um nível (Mastered cai para Proficient, Proficient cai para Familiar) | DADO | Central de ajuda da Khan Academy, artigo 5548760867853, "Updated 3 years ago" (captura datada 21/08/2023) |
| M2 | **Duolingo Birdbrain** (blog oficial, 07/10/2020): modelo que "faz um palpite educado sobre se o aluno vai acertar um exercício", juntando quanto a pessoa sabe e a dificuldade do material; o gerador de sessão usa isso para filtrar exercícios "na dificuldade certa"; testes A/B mostraram mais aprendizado e mais retorno diário, sem número publicado | DADO | blog.duolingo.com, Bicknell e Brust |
| M3 | Em entrevista (VentureBeat, 2020), Burr Settles descreve o alvo do Birdbrain como exercícios com **cerca de 70% de chance de acerto**, com cerca de 200 candidatos pontuados para escolher 14 | DADO (resumo de busca; a página não foi aberta) | VentureBeat, "How Duolingo uses AI in every part of its app" |
| M4 | **Duolingo, repetição espaçada**: a Half-Life Regression (Settles e Meeder, ACL 2016) reduziu o erro de previsão de lembrança em mais de 45% contra as linhas de base; o blog diz que, em teste A/B, subiu a retenção diária em 9,5% nas sessões de prática, 1,7% nas lições e 12% na atividade geral | DADO (resumo); paper não aberto | aclanthology P16-1174; blog.duolingo.com "How we learn how you learn" |
| M5 | **ALEKS**: diagnóstico inicial de 25 a 30 problemas abertos gerados por algoritmo; o modelo (teoria dos espaços de conhecimento, Falmagne e Doignon, 1983 a 1992) atualiza o "estado de conhecimento" e o conjunto de tópicos "prontos para aprender" a cada tópico aprendido; reavalia periodicamente para checar retenção | DADO (resumo; Wikipedia e material da McGraw-Hill) | en.wikipedia.org/wiki/ALEKS |
| M6 | **DreamBox**: adapta dentro e entre lições (dificuldade, apoio, sequência, dicas, ritmo), avaliando a estratégia que a criança usa; "cerca de 48 mil a 50 mil pontos de dado por hora" é número do próprio fabricante, sem verificação | DADO (resumo; material do fabricante) | dreambox.com; perfil D3 Harvard |
| M7 | **Regra dos 85%** (Wilson, Shenhav, Straccia e Cohen, Nature Communications, 05/11/2019): em tarefas de classificação binária com aprendizado por gradiente, a aprendizagem é mais rápida quando a acurácia de treino fica em cerca de 85% (erro ótimo 15,87%). É estudo **teórico e computacional** (perceptron, rede de duas camadas, modelo de aprendizado de macaco); **não foi testado em humanos nem em sala de aula**; o ótimo muda com o tipo de ruído (82%, 75%); os autores propõem testar a ligação com engajamento como trabalho futuro | DADO | PMC6831579 |
| M8 | **BKT** (Corbett e Anderson, 1995): quatro parâmetros (conhecimento prévio, aprendizagem, chute, escorregão); o limiar de "dominado" em 0,95 é convenção de prática, **não consta** do artigo original nas fontes abertas | DADO (resumo; artigo não aberto) | Wikipedia "Bayesian knowledge tracing"; Baker et al. |
| M9 | Tutores inteligentes: mediana de efeito 0,63 em 45 avaliações (0,75 nas alinhadas ao conteúdo); mastery learning clássico 0,45 a 0,60 em meta-análises antigas (segunda mão) e 0,07 a 0,10 no ensaio aleatório da EEF; feedback de alta informação d = 0,99 contra 0,46 corretivo | DADO (Fase 1) | [F5], [F7], [F6] |

### 3.2 Leitura (OPINIÃO)

- Os três apps que medem domínio de verdade (Khan, ALEKS, Birdbrain) têm em comum: **domínio não é acertar numa sessão, é acertar depois, misturado com outras coisas** (M1 "mixed-skill assessment", M5 reavaliação periódica, M4 meia-vida). O Bobby já tem a peça certa para isso: o caderno espaçado. Falta ligar o caderno ao conceito de "dominado" por habilidade.
- O alvo de acerto na prática: Birdbrain mira 70% (M3), a regra dos 85% é teórica (M7), o relatório 02 sugeriu 70% a 85%. Proponho **75% a 85%** como faixa de operação e medir se a criança de 7 a 9 anos aguenta 75% sem desanimar (M7 avisa que o número exato vale menos que a existência de um ponto doce).
- Khan e ALEKS evitam tédio com **pular o que já sabe** (diagnóstico e nível por habilidade) e evitam frustração com **descer de nível sem punição visível** (M1). O Bobby hoje não pula nada (a criança de 11 anos começa em "contar até 20" se quiser) e só adapta por faixa de idade. É o maior buraco pedagógico do produto.
- BKT com parâmetros fixos (M8) cabe em `localStorage` e em 40 linhas de JavaScript. Elo também caberia, mas Elo precisa de dificuldade por item e o Bobby tem geradores paramétricos (22 mil enunciados distintos de matemática, [MEDIDO] na especificação), então a unidade natural é o gerador, não o item. BKT por gerador é o caminho de menor custo.

---

## 4. Pesquisa 3 · O papel dos pais

### 4.1 O que tem fonte

| # | Afirmação | Tipo | Fonte |
|---|---|---|---|
| P1 | **Bedtime Math** (Berkowitz et al., Science, outubro de 2015): cerca de 600 famílias de 1º ano em Chicago (420 com app de matemática para ler junto, 167 com app de leitura sem matemática). Quem usou o app de matemática com frequência terminou o ano cerca de **3 meses à frente** em matemática; o ganho foi maior nos filhos de pais com mais **ansiedade matemática**; a autora diz que até cerca de uma vez por semana trouxe benefício | DADO (resumo de imprensa; o artigo da Science devolveu 403) | WBEZ/NPR, 08/10/2015; Science Update |
| P2 | Pais ansiosos com matemática que ajudam muito na lição de casa têm filhos que aprendem menos matemática e ficam mais ansiosos (Maloney et al., Psychological Science, 2015; 438 crianças de 1º e 2º ano). Ou seja, **ajuda mal orientada piora** | DADO | news.uchicago.edu, 10/08/2015 |
| P3 | **Mensagens de texto personalizadas aos pais** (Doss, Fahle, Loeb e York, Journal of Human Resources, 2019): mensagens ajustadas ao nível da criança no jardim de infância deram **63% mais chance de ler num nível mais alto** do que o programa de mensagens genéricas, e mais atividades de letramento em casa; o ganho se concentrou nas crianças mais distantes da média | DADO (resumo da Stanford SCALE) | scale.stanford.edu |
| P4 | **Metas semanais e lembretes aos pais** (Mayer, Kalil, Oreopoulos e Gallegos, JHR, 2019; 169 pais de pré-escola em Chicago): meta de tempo de leitura definida pelo pai no começo da semana mais lembrete diário e reconhecimento **dobrou** o tempo de leitura com app | DADO (resumo da Harris/J-PAL) | harris.uchicago.edu; povertyactionlab.org |
| P5 | Programas de envolvimento parental em geral: cerca de 0,3 desvio-padrão em 51 estudos (Jeynes, 2012); meta-análises posteriores (Erdem e Kaya) acham efeito "positivo mas pequeno". Castro et al. (2015, 37 estudos) não pôde ser aberto | DADO (resumo); sem o pooled de Castro | cde.state.co.us (Jeynes 2012) não abriu; só resumo de busca |
| P6 | Narração embutida em app de leitura ajuda, mas **não supera a leitura compartilhada com um adulto**; perguntas de conversa em tempo real melhoram o diálogo adulto-criança | DADO (Fase 1) | [F18] |
| P7 | ECA Digital art. 17: ferramentas de supervisão parental com **limite e monitoramento de tempo**; art. 18: pais devem ver métricas consolidadas de tempo; lembrete e notificação à criança são tratados como risco | DADO (Fase 1) | [03-§2.1] |

### 4.2 Leitura (OPINIÃO)

- O relatório dos pais, para reter assinatura, precisa fazer três coisas que as fontes apoiam: **dar ao pai algo pequeno e concreto para fazer com a criança** (P1, P3, P4), **ajustado ao que a criança errou** (P3), **sem transformar o pai em professor de matemática** (P2). Um "vale ajudar em: dobro e metade. Hoje, na mesa, peça para ela dividir 8 uvas em 2 pratos" vale mais que qualquer gráfico.
- Co-play com propósito (P1, P6) é a melhor peça de retenção que o app pode ter para 7 a 8 anos: uma "missão em dupla" por semana, de 5 minutos, em que o adulto lê a pergunta e a criança responde. Cabe na Fase 3 sem arte nova.
- Meta conjunta (P4) já existe parcialmente: o responsável escolhe 5, 10 ou 15 minutos. Falta o fecho semanal ("vocês combinaram 4 dias; foram 3").

---

## 5. Pesquisa 4 · Quanto conteúdo o app tem e como não "acabar"

### 5.1 Medido no código

| Item | Valor | Como |
|---|---|---|
| Fases | 150 (50 por matéria, 10 unidades de 5) | `TOTAL_*`, títulos em `src/conteudo/*.js` [MEDIDO] |
| Geradores de pergunta | 6 por fase, cerca de 900 | especificação 3.1 e `L()`/`LP()`/`LE()` |
| Perguntas por passagem completa | 150 × 8 = **1.200** | README |
| Tempo por pergunta assumido | 15 s (calibra pela mediana depois de 50) | especificação 5.2 |
| **Horas de prática "nova" numa passagem completa** | 1.200 × 15 s = **5 horas de perguntas**, mais aulas e histórias (cerca de 1 a 2 horas de áudio de aula, pela seção 9.5 da especificação: 98 minutos de passos) | cálculo meu sobre os números acima |
| O que uma criança de 7 a 8 anos realmente percorre (foco da faixa) | mat U1 a U4 (20 fases) + pt U1 a U5 (25) + en 50 = 95 fases ≈ 760 perguntas ≈ **38 dias** a 20 perguntas por dia | tabela 1.1 da especificação; cálculo meu |
| Criança de 11 a 12 anos | mat U4 a U10 (35) + pt U5 a U10 (30) + en 50 = 115 fases ≈ 920 perguntas ≈ **46 dias** | idem |
| Textos de leitura em português | 3 (`TEXTOS`) | [MEDIDO] na especificação 1.3 |
| Palavras de inglês | 186 únicas | [MEDIDO] na especificação 1.4 |

**Conclusão (OPINIÃO sobre números medidos):** sem reposição, a criança **termina a trilha nova da sua faixa entre a semana 5 e a semana 7**, exatamente a janela em que o pai decide se renova o segundo mês. A revisão espaçada e as "pergunta irmã" alongam, mas não são conteúdo novo aos olhos da criança. Os geradores paramétricos garantem que **a pergunta nunca repete**, mas o **tipo** repete, e tédio vem do tipo.

### 5.2 Como apps vendidos evitam "acabou o conteúdo" (o que tem fonte)

| Técnica | Quem faz | Fonte |
|---|---|---|
| Geração algorítmica de problemas, com resposta digitada | ALEKS (diagnóstico e prática) | M5 |
| Domínio por habilidade com reavaliação periódica (sempre há o que revisar) | ALEKS, Khan (Mastered só com avaliação mista) | M1, M5 |
| Revisão calculada por item (meia-vida) em vez de fila fixa | Duolingo | M4 |
| Dificuldade por aluno dentro do mesmo material | Duolingo (Birdbrain), DreamBox | M2, M6 |
| Marcos de longo prazo celebrados (1 semana, 1 mês, 100 dias, 1 ano) | Duolingo | R5 |
| Evento de reativação em massa sem culpa | Duolingo (Streak Revival) | R6 |
| Eventos sazonais, temporadas, desafios semanais | prática geral da indústria | **sem fonte primária aberta nesta sessão**; tratar como hipótese |

O Bobby já tem a geração paramétrica e o Leitner. O que falta, em ordem: (1) domínio por habilidade (seção 7a), (2) camadas de dificuldade dentro do mesmo gerador (`dif` 1 a 3, item B09 do backlog), (3) desafios e modos de revisão que mudem o **tipo** de pergunta (seção 7b), (4) conteúdo por ano escolar (seção 7d).

---

## 6. Pesquisa 5 · O que a BNCC pede por ano e onde o Bobby cobre

**Fonte e limite.** O texto oficial da BNCC (basenacionalcomum.mec.gov.br) não pôde ser aberto nesta sessão (igual à Fase 1). Os códigos abaixo foram conferidos em páginas que reproduzem a BNCC por ano: profez.com.br (matemática 3º, 4º, 5º ano, listas completas), tudosaladeaula.com (matemática 2º ano; português 2º e 3º ano) e novaescola.org.br (códigos do 6º e 7º ano ligados a planos de aula, sem o texto da habilidade). Onde escrevo "memória", o código vem do meu conhecimento prévio e precisa ser conferido no texto oficial antes de ir para material de venda. Idade de referência: 2º ano = 7 anos, 7º ano = 12 anos.

**Fato que muda o posicionamento (DADO, resumo de várias fontes acadêmicas e de redes estaduais):** a BNCC traz Língua Inglesa como componente obrigatório **a partir do 6º ano** (Lei 13.415/2017). Nos anos iniciais não há habilidade de inglês na BNCC; a maioria das redes não tem política consolidada para inglês no 1º ao 5º ano. Logo, para 7 a 10 anos o inglês do Bobby é **extra**, não "reforço da escola". Isso é bom para a venda (ninguém mais oferece à criança o que a escola não dá) e ruim para a promessa (não dá para prometer "acompanha a escola").

### 6.1 Matemática

| Ano | O que a BNCC pede (códigos conferidos) | Bobby cobre | Lacuna |
|---|---|---|---|
| 2º (7 anos) | números até 3 ordens, fatos de + e − (EF02MA05), problemas de + e − (06), multiplicação por 2 a 5 como adição repetida (07), **dobro, metade, triplo, terça parte (08)**, sequências (09 a 11), **localização e trajetos (12, 13)**, sólidos e figuras planas (14, 15), **medir comprimento, capacidade, massa (16, 17)**, **calendário e relógio digital (18, 19)**, **moedas e cédulas (20)**, **provável/improvável (21)**, **tabelas e gráficos de barras (22, 23)** | 1.1 a 1.4, 2.1 a 2.3, 3.1, 3.2, 4.4, 8.1, 6.4 (dinheiro, mas em decimais, acima do nível) | **medidas (comprimento, massa, capacidade), tempo (calendário, relógio), probabilidade intuitiva, gráficos simples, localização.** Metade das habilidades do 2º ano está fora |
| 3º (8 anos) | até milhar (EF03MA01, 02), fatos de + e × (03), **reta numérica (04)**, problemas de + e − com todos os sentidos (06), × por 2, 3, 4, 5 e 10 com **disposição retangular** (07), **÷ por até 10 com e sem resto (08)**, metade e frações unitárias (09), sequências e **igualdade (10, 11)**, sólidos e planificações (13, 14), figuras planas incluindo trapézio e paralelogramo (15), **congruência (16)**, **unidades de medida (17 a 20)**, **comparar áreas (21)**, **horas e minutos (22, 23)**, dinheiro (24), **chance (25)**, **tabelas de dupla entrada e gráficos (26 a 28)** | 1.4, 1.5 (reta), 2.1 a 2.4, 3.2, 4.1 a 4.3, 5.1, 8.1, 8.5 (parcial) | **tempo (relógio), medidas práticas, estatística e probabilidade, planificações, igualdade como equilíbrio** |
| 4º (9 anos) | até dezena de milhar (EF04MA01, 02), **estimativa e propriedades das operações (03 a 05)**, × com grupos, retangular e **proporcionalidade (06)**, ÷ por 2 algarismos (07), **contagem de possibilidades (08)**, **frações unitárias na reta (09)**, **décimos e centésimos ligados ao dinheiro (10)**, múltiplos e restos (11, 12), **igualdade e termo desconhecido (14, 15)**, ângulos retos (18), **simetria (19)**, perímetro e **área em malha (20, 21)**, **tempo em h, min, s (22)**, **temperatura (23, 24)**, compras, troco e **desconto (25)**, **gráficos com síntese escrita (27, 28)** | 1.5, 2.4, 2.5, 3.3 a 3.5, 4.2 a 4.5, 5.1 a 5.3, 6.1, 6.4, 8.2 a 8.4, 9.1 (parcial), 10.2 | **estimativa, propriedades, contagem de possibilidades, simetria, área em malha, tempo, temperatura, síntese de gráfico** |
| 5º (10 anos) | centena de milhar (EF05MA01), **decimais na reta (02)**, frações próprias e impróprias (03), equivalentes (04), **comparar fração e decimal (05)**, **10%, 25%, 50%, 75% ligados a frações (06)**, + e − com decimais (07), **× e ÷ de decimal por natural (08)**, princípio multiplicativo (09), igualdade e termo desconhecido (10, 11), **proporcionalidade direta e partilha proporcional (12, 13)**, plano cartesiano 1º quadrante (15), polígonos (17), **ampliação e redução (18)**, conversão de unidades (19), **perímetro e área, um não determina o outro (20)**, **volume com cubos (21)**, **probabilidade com casos iguais (22, 23)**, dados em texto e gráfico (24, 25) | 5.2 a 5.5, 6.1 a 6.5, 7.1, 7.2, 7.4, 8.2, 8.3, 8.5, 9.1, 10.2, 10.3 | **plano cartesiano, volume, ampliação e redução, perímetro × área, fração como divisão.** Atenção: **média (10.1) não está no 5º ano**, está no 6º (memória: EF06MA33 trata de pesquisa; média aritmética é 7º ano, EF07MA35, memória) |
| 6º (11 anos) | naturais e decimais na reta (EF06MA01, 02), **operações e potências (03, memória para potência)**, múltiplos, divisores e **critérios de divisibilidade (05, 06)**, frações como parte e como **divisão**, equivalentes, operações (07 a 10), **porcentagem sem regra de três (13)**, **expressões numéricas (14)**, prismas e pirâmides (17), polígonos (18 a 21), **fluxograma (23)**, medidas (24), **ângulos (25 a 27)**, probabilidade (30), pesquisa (33), **algoritmos (34)** | 3.4, 4.5, 5.1 a 5.5, 6.1 a 6.5, 7.1, 7.2, 8.1, 8.4, 8.5, 9.2, 9.4, 10.3 | **critérios de divisibilidade, fração como divisão, expressões com parênteses em sequência, fluxograma e algoritmo, ângulos com transferidor** |
| 7º (12 anos) | **porcentagem: acréscimos e descontos (EF07MA02)**, **inteiros negativos e operações (03, 04)**, racionais (08 a 12), **linguagem algébrica e sequências (13 a 16)**, **equação do 1º grau (18)**, plano cartesiano (19, 20), **simetria (21)**, triângulos (24, 25), construção de polígonos (26, 28), **média aritmética (memória: 35)**, proporcionalidade e **regra de três (memória: 17)** | 7.3 a 7.5, 9.1 a 9.5, 10.1, 10.4 | **plano cartesiano, simetrias e transformações, construção com algoritmo, gráficos de setores (memória: EF07MA37)**. O que o Bobby tem de 9.4 e 9.5 (potências e raiz) é 6º e 8º ano, não problema |

**Resumo matemática (OPINIÃO sobre a tabela):** o Bobby é forte em **Números** (do 2º ao 7º ano) e **Álgebra** de 6º e 7º, e fraco em três eixos inteiros da BNCC: **Grandezas e medidas** (tempo, massa, capacidade, temperatura, volume), **Probabilidade e estatística** dos anos iniciais (só 10.1 a 10.3, pensadas para 11 a 12 anos) e **Geometria de localização e transformação** (trajetos, plano cartesiano, simetria). Para uma criança de 7 a 9 anos, isso significa que **cerca de metade** do que a escola pede no ano não está no app.

### 6.2 Português

| Ano | O que a BNCC pede (códigos conferidos) | Bobby cobre | Lacuna |
|---|---|---|---|
| 2º (7 anos) | grafia de palavras conhecidas, maiúscula, segmentação, pontos (EF02LP01), **separar sílabas e trocar sílabas (02)**, correspondências regulares f/v, t/d, p/b e contextuais c/q, e/o átonos (03), **sílabas CV, V, CVC, CCV (04)**, **nasalidade: til, m, n (05)**, nomes das letras (06), **separar palavras na frase (08)**, ponto final, ? e ! (09), **sinônimos e antônimos com in- e im- (10)**, **aumentativo e diminutivo (11)**, ler listas, avisos, receitas (EF12LP04), **decodificar palavras novas e ler globalmente as frequentes (EF12LP01)**, prever e checar hipóteses (EF15LP02), localizar informação explícita (EF15LP03), cantigas e poemas com rima (EF12LP18, 19), **conflito e resolução da narrativa (EF02LP28)** | p1.1 a p1.5, p2.1 a p2.5, p3.1 a p3.5, p4.1 a p4.3, p4.5, p5.1, p5.2, p5.4, p6.3, p10.1, p10.2 | **sílabas CVC e CCV (travadas), nasalidade além de M antes de P e B, aumentativo/diminutivo, sinônimos/antônimos, rima e cantiga, texto conectado curto (só 3 textos para 50 fases), narrativa com conflito** |
| 3º (8 anos) | regulares c/qu, g/gu, r/rr, s/ss, nasalidade (EF03LP01), **estruturas silábicas variadas (02)**, lh, nh, ch (03), **acento em monossílabos e oxítonas (04)**, **contar sílabas e classificar (05)**, **sílaba tônica: oxítona, paroxítona, proparoxítona (06)**, pontuação incluindo dois-pontos e travessão em diálogo (07), substantivo e verbo (08), adjetivo (09), **prefixos e sufixos (10)**, **pronomes como coesão (EF35LP14)**, **ler com fluência em silêncio e em voz alta (EF35LP01)**, ideia central (03), **inferir implícito (04)**, **sentido pelo contexto (05)**, instruções e receitas (EF03LP11), cartas e diários (12), **dicionário e palavras irregulares memorizadas (EF35LP12, 13)** | p4.1 a p4.4, p5.3 a p5.5, p6.1, p7.1, p7.2, p9.1, p9.3, p9.5, p10.2, p10.3, p10.4 | **sílaba tônica e classificação, prefixo e sufixo, pronomes, inferência, sentido pelo contexto, carta e diário, fluência de leitura.** Compreensão hoje é só "achar a informação" (nível mais baixo do Saeb) |
| 4º (9 anos) | regulares diretas e contextuais (EF04LP01), **acento em paroxítonas -i(s), -l, -r, -ão(s) (04)**, pontuação com vírgula em enumeração, vocativo e aposto (05), **concordância verbal (06) e nominal (07)**, sufixos -agem, -oso, -eza, -izar/-isar (08), mais EF35LP01 a 14 | p7.3 (concordância, parcial), p9.4 (vírgula na lista) | **acentuação por regra, concordância sistemática, derivação por sufixo, aposto e vocativo** |
| 5º (10 anos) | regulares, contextuais, morfológicas e **irregulares frequentes (EF05LP01)**, **acentuação de oxítonas, paroxítonas e proparoxítonas (03)**, vírgula, ponto e vírgula, dois-pontos, **reticências, aspas e parênteses (04)**, flexão verbal por pronome (06), e as EF35LP de leitura e produção | p8.1 a p8.5, p9.1 a p9.3 | **acentuação completa, pontuação expressiva, flexão verbal, produção de texto** (fora do escopo por privacidade, como já decidido) |
| 6º e 7º (11 a 12) | leitura de gêneros variados, coesão, **concordância e regência (memória)**, **tempos e modos verbais (memória)**, **orações e período (memória)**, figuras de linguagem, variação linguística | p7.4 (ontem/hoje/amanhã), p10.x | **quase tudo dos anos finais**; o português do Bobby para 11 a 12 anos é revisão de ortografia, não currículo do 6º e 7º |

**Resumo português (OPINIÃO):** o Bobby cobre bem **apropriação do sistema de escrita** (eixo 1 da matriz do Saeb, [F27]) e ortografia; cobre pouco **leitura** (3 textos, só localização de informação) e nada de **fluência**, **inferência** e **gramática dos anos finais**. Para 7 a 8 anos está alinhado; para 10 a 12 está abaixo do ano escolar.

### 6.3 Inglês

A BNCC não pede inglês antes do 6º ano (DADO acima). As 50 fases do Bobby (cumprimentos, cores, família, animais, comida, corpo, casa, verbos, perguntas, frases do dia) correspondem ao que as redes privadas chamam de "pré-A1" e ao que o 6º ano da BNCC revisita no eixo de oralidade e vocabulário (memória: EF06LI01 a EF06LI26, com foco em interação oral, leitura de textos simples e vocabulário de apresentação, família, escola e rotina). **Não há lacuna "escolar" para 7 a 10 anos**, porque não há currículo oficial. Para 11 a 12 anos, falta: **leitura de texto curto em inglês com pergunta**, **present simple e present continuous**, **there is/there are**, **números até 100 e horas**, **dias e meses** (memória sobre o 6º ano da BNCC; confirmar no texto oficial).

---

## 7. Propostas

### 7a. Adaptação por habilidade (executável)

**Princípios (OPINIÃO apoiada em M1 a M9):** habilidade pequena = um gerador (`__mk`), como a especificação já prevê (B09). Estimador: **BKT com 4 parâmetros fixos por matéria** (sem ajuste por aluno nas primeiras versões). Dominado = `pL ≥ 0,90` em **dois dias diferentes** e um acerto em **revisão mista** (igual ao *Mastered* da Khan, M1). Próximo item: dentro da fase, escolher o gerador cuja probabilidade prevista de acerto esteja mais perto de **0,80** (faixa 0,75 a 0,85), com freio de variedade. Nunca mostrar nível para a criança.

**Estado por habilidade** (cabe no `S.habil` já previsto em 8.2 da especificação):

```
habil[mk] = { pL, n, acertos, dias: [d1, d2], dom: false, ult: 'AAAA-MM-DD', dif: 1|2|3 }
```

**Parâmetros iniciais por matéria (OPINIÃO; calibrar com dado):**

| Matéria | pL0 (prévio) | pT (aprende) | pG (chute) | pS (escorrega) |
|---|---|---|---|---|
| Matemática | 0,25 | 0,20 | 0,20 (escolha de 4) / 0,10 (digitar) | 0,10 |
| Português | 0,30 | 0,20 | 0,25 | 0,10 |
| Inglês | 0,15 | 0,25 | 0,25 | 0,15 (áudio) |

`pG` depende do tipo de pergunta: múltipla escolha com 4 opções chuta 25%, com 3 opções 33%, digitar quase 0. Isso já está na pergunta (`q.type`, número de opções).

**Pseudocódigo (JavaScript, sem dependência):**

```js
// Atualização BKT depois de uma resposta
function bktAtualizar(h, ok, p) {               // h = habil[mk], p = {pT,pG,pS}
  const pL = h.pL;
  const pCertoDado = ok
    ? (pL * (1 - p.pS)) / (pL * (1 - p.pS) + (1 - pL) * p.pG)
    : (pL * p.pS)       / (pL * p.pS       + (1 - pL) * (1 - p.pG));
  h.pL = pCertoDado + (1 - pCertoDado) * p.pT;  // transição de aprendizagem
  h.n++; if (ok) h.acertos++;
  const d = diaLocal();
  if (h.pL >= 0.90 && h.dias.indexOf(d) < 0) h.dias.push(d);   // dias distintos acima do limiar
  if (h.pL < 0.75) h.dias = [];                                 // caiu: recomeça a contagem
  h.ult = d;
}

// Probabilidade prevista de acerto na próxima pergunta desse gerador
function bktPrever(h, p) { return h.pL * (1 - p.pS) + (1 - h.pL) * p.pG; }

// Dominado: 2 dias distintos acima de 0,90 + 1 acerto em revisão mista (caixa >= 3 do Leitner)
function bktDominado(h, it) { return h.dias.length >= 2 && it && it[IT.CAIXA] >= 3 && it[IT.ACERTOS] >= 1; }

// Escolha do próximo gerador dentro da fase
function escolherGerador(makers, habil, p, ultimos) {
  const ALVO = 0.80;
  const cand = makers.map((mk, i) => {
    const h = habil[mk.__id] || { pL: p.pL0 };
    const prev = bktPrever(h, p);
    let custo = Math.abs(prev - ALVO);
    if (ultimos.slice(-2).indexOf(mk.__id) >= 0) custo += 0.30;   // não repetir o mesmo gerador 3x seguidas
    if (h.dom) custo += 0.50;                                        // dominado sai da rotação (volta pelo Leitner)
    if ((h.n || 0) === 0) custo -= 0.10;                             // dar chance ao que nunca apareceu
    return { i, custo };
  });
  cand.sort((a, b) => a.custo - b.custo);
  return makers[cand[0].i];
}
```

**Regras de borda (OPINIÃO):**
- Em `camada 1` (faixa 7 a 8) o alvo sobe para 0,85; em `camada 3` desce para 0,75. A criança menor precisa de mais acerto para não desanimar; isso é hipótese a medir (M7 não testa humanos).
- Se `pL < 0,30` depois de 6 respostas, a próxima exposição abre com o exemplo resolvido (T6) e a fase oferece a "volta rápida" ao pré-requisito, como já está em 3.2 da especificação.
- Habilidade **dominada sai da rotação** da fase e só volta pelo caderno espaçado (caixas 3, 4, 5) e pela amostra de 5% a cada 60 dias que o README já implementa. É isso que evita tédio sem precisar de conteúdo novo.
- O `pL` **decai com o tempo** quando a habilidade não é vista: `pL = pL × 0,5^(dias/45)` ao abrir a fase (meia-vida de 45 dias, OPINIÃO inspirada em M4). Sem isso, BKT assume que nunca se esquece (M8), o que para criança é falso.

**Diagnóstico de entrada (10 perguntas por matéria):** mantém a escada da especificação 3.4 (sobe 2 unidades com 2/2, repete com 1/2, desce 1 com 0/2), com três ajustes: (1) teto de **10**, não 12, porque a criança de 7 anos cansa; (2) cada resposta alimenta o BKT da habilidade correspondente com `pL0` ajustado (certo → 0,70; errado → 0,15), em vez de só mandar para a caixa do Leitner; (3) unidades abaixo do ponto de partida ganham `pL = 0,85` em todas as habilidades (jogáveis, sem XP, como já decidido), de modo que a "Revisão do dia" possa puxar uma delas de vez em quando e confirmar ou derrubar.

**Testes (para `testes/adaptacao.js`, a escrever):**
1. Criança simulada que acerta 100%: toda habilidade da fase atinge `pL ≥ 0,90` em no máximo 5 respostas e **não** fica dominada no mesmo dia (precisa de 2 dias).
2. Criança que acerta 50%: `pL` oscila e fica abaixo de 0,75; a fase oferece exemplo resolvido depois de 6 respostas; nenhuma habilidade domina.
3. Criança que chuta em múltipla escolha de 4: 25% de acerto puro não leva `pL` acima de 0,40 em 20 respostas (prova de que `pG` protege).
4. Escolha do próximo gerador: em 1.000 sorteios com `pL` variados, a média da probabilidade prevista fica entre 0,75 e 0,85 e nenhum gerador aparece 3 vezes seguidas.
5. Decaimento: habilidade com `pL = 0,95` sem uso por 90 dias abre com `pL ≈ 0,24` e volta à rotação.
6. Diagnóstico: 20 perfis simulados com "ano real" conhecido são posicionados dentro de ±1 unidade em pelo menos 17.
7. Nada disso é visível à criança: nenhuma string de nível, nota ou "subiu/desceu" sai para a tela (grep no HTML gerado).

**Esforço (OPINIÃO):** motor e testes, 3 a 5 dias; etiqueta `dif` e `hab` nos 900 geradores é o gargalo (já era, B09), 5 a 8 dias com script que propõe e humano que revisa. Começar por Inglês, como a ordem de reforma já diz.

### 7b. Calendário de retenção de 90 dias

**Princípio (OPINIÃO sobre R1 a R10):** a criança deve encontrar **uma coisa nova por semana** que não dependa de conteúdo novo, e o pai deve receber **um sinal por semana** de que vale continuar. Semanas 2, 4, 8 e 12 têm rito próprio porque são os pontos de queda da curva (R1, R2) e os marcos que a Duolingo celebra (R5). Nada aqui usa sorteio, contagem regressiva, culpa ou push à criança ([03-§2.1]).

| Semana | O que a criança encontra de novo | O que o pai recebe | Já existe? |
|---|---|---|---|
| 1 | Diagnóstico como "missão de exploração"; bilhete do Bobby; baú dos dias 1 a 7; medalha de 3 dias | Cartão "Conhecendo" (ponto de partida por matéria, sem comparação) | ciclo diário sim; diagnóstico não |
| 2 | **Medalha de 1 semana e pose nova do Bobby** (dia 7); primeira "Revisão do dia" com item de 7 dias atrás ("você lembrou!"); **desafio da semana** aparece pela primeira vez: 10 perguntas misturadas das fases feitas (intercalação, [F4]), 1 vez por semana, recompensa fixa (adesivo da constelação) | Cartão com primeira comparação consigo mesma; **1 missão em dupla** de 5 min para fazer junto (P1, P6) | baú e medalha sim; desafio semanal não; missão em dupla não |
| 3 | **Capítulo 2 da história do Embaralho** (a criança já fechou 1 etapa em pelo menos uma matéria); "modo relâmpago": rodada de fatos sem relógio visível (T7) | Cartão com tendência e sugestão de meta | narrativa por etapa sim; relâmpago não |
| 4 | **Medalha do mês** (dia 28 a 30), moldura dourada, "Constelação do mês"; **revisão do mês**: 12 perguntas dos itens de caixa 3 a 5 com o selo "você sabe isso há 1 mês" | **Resumo do mês** com mapa de habilidades (seção 7c) e "o que vem no mês 2" | baú do dia 30 sim; revisão do mês não; resumo do mês parcial |
| 5 | **Evento de planeta** (1ª vez): durante 7 dias, uma matéria ganha cenário festivo e o desafio da semana é só dela ("Semana do Planeta Numeral"); recompensa fixa (look temático). Rotação: Numeral, Fábula, Horizonte, 3 semanas cada ciclo | Cartão normal | não |
| 6 | **Modo "ensine o Bobby"**: perguntas T8 "por quê?" em que a criança escolhe a explicação (1 por dia, [F2] evidência forte para pergunta explicativa) | Cartão com "frase da criança" (resposta de T8 escolhida, sem texto livre) | T8 não existe |
| 7 | Capítulo 3; **primeiro "você dominou"**: tela de fim de fase mostra habilidades dominadas acendendo como estrelas fixas (sem número) | Cartão; primeira lista de habilidades dominadas | não (depende de 7a) |
| 8 | **Medalha de 2 meses** (dia 60); **Kit de volta** aprimorado para quem sumiu de 4 a 14 dias: 3 perguntas fáceis de itens de caixa 4 e 5, "você ainda sabe" (R6, sem culpa) | **Resumo do mês 2**; se a criança sumiu 7 dias ou mais: cartão "sem pressa" com uma só sugestão | kit de volta sim; versão "ainda sabe" não |
| 9 | Evento de planeta 2 (Fábula); **desafio em dupla** semanal (o adulto lê, a criança responde; 6 perguntas) | Missão em dupla | não |
| 10 | **Revisão espaçada abre "o baú dos 100 dias"** no horizonte: a criança vê (fechado, categoria visível) o presente do dia 100 | Cartão | tabela de baú já prevê marcos de 10 em 10 |
| 11 | Evento de planeta 3 (Horizonte); **história de inglês nova** (quando existir, B17) | Cartão | não |
| 12 | **Medalha de 3 meses** (dia 84 a 90); **"álbum do trimestre"**: galeria dos desenhos por etapa e das constelações; sem ranking | **Resumo trimestral** em uma página copiável, com a frase "o que a criança faz hoje que não fazia em setembro" (baseada em habilidades dominadas) | galeria parcial |

**O que é novo em código (ordem de custo, OPINIÃO):** desafio da semana (P, reusa `genQuestions` com `pool` de fases feitas); revisão do mês (P, reusa Leitner com filtro de caixa); evento de planeta (M, cenário e look, depende de arte); missão em dupla (P, só um rótulo e um modo sem corações); "ensine o Bobby" (depende de T8, M); álbum (M). Tudo determinístico por `pid + semana`, sem sorteio.

**Risco a medir:** eventos e medalhas podem virar o "mau uso da gamificação" ([01-A22]); por isso toda recompensa é fixa e cosmética, e a métrica de controle é a proporção de tempo em prática contra tempo em tela de prêmio (seção 7e).

### 7c. Relatório dos pais que mantém a assinatura

**Tese (OPINIÃO sobre P1 a P7):** o pai renova quando vê três coisas: **que a criança usou** (sem ele mandar), **que aprendeu algo nomeável** e **o que ele pode fazer em 5 minutos**. Gráfico de tempo não faz nenhuma das três. O relatório precisa falar de habilidades, não de minutos.

**Cartão semanal (domingo à noite ou na primeira abertura da semana; só no aparelho; "Copiar resumo" como já previsto em 4.5):**

```
Semana de 19 a 25 de outubro · Lua (8 anos)

Jogou 4 dias de 7 · 23 minutos no total · 96 perguntas · 81% de acerto

Brilhou em: subtrair com dezenas (acertou 11 de 12, sem dica)
Já sabe há 1 mês: tabuada do 2 ao 5, sílabas com NH

Vale ajudar em: dobro e metade
  Em casa, 5 minutos: na mesa, peça para ela dividir 8 uvas em 2 pratos
  e depois juntar de novo. Pergunte "e se fossem 10?". Sem corrigir
  na hora: deixe ela contar.

Semana que vem: o Bobby vai apresentar "A ideia de multiplicar".
Missão em dupla disponível (5 min): "Quantos pés tem a família?"
```

Regras: no máximo **1** "vale ajudar em" por semana (P2: ajuda demais piora); a frase de casa vem de uma lista fixa de **30 frases, uma por unidade** (já prevista em 4.3 da especificação), escrita por pedagogo, **sem pedir que o pai ensine o método**; "já sabe há 1 mês" só aparece quando existe item em caixa 5 há 30 dias ou mais (dado real do Leitner); nada de nota, percentil ou comparação com outras crianças; texto neutro em gênero.

**Resumo do mês (4ª semana):** os 5 números do mês, **mapa de habilidades** (lista por unidade: dominadas, em prática, ainda não vistas; sem porcentagem de domínio, só os nomes), melhor sequência, 1 frase de "o que ela faz hoje que não fazia no começo do mês" (gerada a partir de habilidades que passaram a dominadas), e "o que vem no mês que vem". É este cartão que precisa ser bom na semana 4 e na semana 8, porque é quando o pai decide renovar (R1, R2).

**Quando chega:** até a Fase 4, por abertura do app pelo responsável e pelo botão de compartilhar. Na Fase 4, por e-mail semanal com opt-in, 1 por semana, janela diurna, com 1 toque para parar (6.3 da especificação). Nunca à criança.

**O que medir para saber se o relatório funciona:** `relatorio_visto` por semana (já existe no esquema de eventos) e, com a Fase 4, taxa de abertura do e-mail e renovação por quem abriu contra quem não abriu. Sem isso, qualquer afirmação de que "o relatório retém" é opinião.

### 7d. Plano de conteúdo por ano escolar

**Critério de ordem (OPINIÃO):** (1) tamanho da lacuna na BNCC (seção 6), (2) tamanho do público (7 a 10 anos é o centro do app e da compra), (3) esforço (gerador com números é barato; texto, áudio e arte são caros), (4) o que a adaptação por habilidade precisa para pular o que a criança já sabe.

| Prioridade | Ano | Entrega | Lacuna que fecha | Esforço (OPINIÃO) |
|---|---|---|---|---|
| 1 | 3º (8 anos) | **Matemática: unidade nova "Medidas e tempo"** (relógio, calendário, comprimento, massa, capacidade, dinheiro prático) com 5 fases e geradores paramétricos; **Português: 20 textos curtos de 40 a 80 palavras** com 3 perguntas (localizar, inferir, sentido pelo contexto) e áudio de leitura ecoada | EF03MA17 a 24; EF35LP01, 03, 04, 05; EF03LP11, 12 | M (geradores) + G (textos, áudio, revisão por pedagogo) |
| 2 | 4º (9 anos) | **Matemática: "Dados e chance" para anos iniciais** (tabela, gráfico de barras com síntese, provável/improvável, contagem de possibilidades); **Português: acentuação por regra e concordância** como fases novas em U7 e U9 | EF04MA08, 26 a 28; EF04LP04, 06, 07 | M |
| 3 | 5º (10 anos) | **Matemática: plano cartesiano, perímetro × área, volume com cubos, fração como divisão**; **Português: flexão verbal e pontuação expressiva**; **Inglês: números até 100, horas, dias e meses** | EF05MA05, 15, 20, 21; EF05LP03, 04, 06 | M |
| 4 | 2º (7 anos) | **Matemática: localização e trajetos, sólidos e planificação, provável/improvável**; **Português: sílabas travadas (CVC, CCV), nasalidade, aumentativo e diminutivo, rimas e cantigas (T10)** | EF02MA12 a 15, 21; EF02LP04, 05, 10, 11; EF12LP18, 19 | M + áudio |
| 5 | 6º (11 anos) | **Matemática: divisibilidade, expressões com parênteses, ângulos com transferidor (interativo), fluxograma**; **Inglês: texto curto com perguntas, there is/are, present simple** | EF06MA05, 06, 14, 23, 25 a 27 | M + G (inglês com áudio) |
| 6 | 7º (12 anos) | **Matemática: simetria e transformações, plano cartesiano completo, gráfico de setores**; **Português: período, concordância e regência, tempos verbais** | EF07MA19 a 21, 37 | M; português G (precisa de pedagogo de anos finais) |

Regras para todo conteúdo novo: cada gerador nasce com `hab`, `dif`, `chave`, `dica` degrau 1 e 2 e `porque` por distrator (contrato de 1.6 e 1.7 da especificação); texto de aula com no máximo 100 caracteres por passo (a especificação mostra que aula é mais da metade do custo de áudio); nada vai ao ar sem revisão de pedagogo brasileiro, porque a ordem de grafemas e a progressão por ano **não têm fonte aberta validada** aqui ([F10], ressalva do relatório 02).

**Promessa possível depois das prioridades 1 a 3 (OPINIÃO):** "cobre os números, as medidas e a leitura do 2º ao 5º ano". **Não** prometer "100% da BNCC", "acompanha a escola" nem "inglês do 6º ano".

### 7e. Métricas a medir localmente antes de vender

O app já grava eventos locais, `diasAtivosDe`, `retencao`, `coortes`, `metaPorDiaAtivo`, `resumoSemana` e `pacoteDeMetricas` (`src/interface/medicao.js`, [MEDIDO] por grep). O que proponho é o **protocolo de uso** e três métricas a somar.

**Piloto (OPINIÃO):** 10 a 20 famílias (fora da própria casa), 60 dias, exportação do pacote anônimo pelo responsável nas semanas 2, 4 e 8, juntado em `medir.html` (B24). Passa pela `lgpd-gate` antes de pedir o primeiro pacote.

| Métrica | Definição (já no app ou a somar) | Por que | Piso de "vale vender" (OPINIÃO, a rever com a linha de base) |
|---|---|---|---|
| D1, D7, D30, **D60** (estrito e janela) | dia ativo = 1 `bloco_fim`; janela 1-2, 6-8, 28-32, **56-64** (somar D60) | curva de sobrevivência; comparar com R1 (8% D30 de mercado) | D7 janela ≥ 50%, D30 janela ≥ 25%, D60 janela ≥ 15% |
| Retorno no dia seguinte (estilo CURR) | já definido em 7.3 da especificação | a alavanca que mais move DAU ([01-A25]) | ≥ 50% nas semanas 2 a 8 |
| **Sessões por semana** (somar) | dias ativos por semana ISO por perfil; reportar mediana e distribuição | criança não joga todo dia; é a métrica que o pai entende | mediana ≥ 3 |
| Meta cheia por dia ativo | já existe | separa "dia vivo" de "meta" ([01-A2, A3]) | ≥ 60% |
| **Acerto por habilidade** (somar) | por `mk`: n, acertos, `pL` final, dias até dominar; agregado por unidade, sem texto livre | prova de aprendizado dentro do app; calibra BKT e `dif` | faixa de acerto de prática entre 70% e 88% em pelo menos 80% das habilidades com n ≥ 6 |
| Retenção de item em 30 dias por caixa | `revisao_item` já existe; cruzar caixa com acerto | calibrar 1/3/7/14/30 contra 1/7/21/45/90 ([relatório 02 §9]) | acerto na caixa 4 ≥ 75% |
| Tempo em prática contra tempo em prêmio | somar `seg` em `bloco_fim` contra tempo em baú, cerimônia, loja (evento novo `tela_premio`, só segundos) | risco de gamificação que rouba o estudo ([01-A22]) | prática ≥ 80% do tempo |
| Efeito do reparo da ofensiva | já previsto: retorno após `ofensiva_recuperada` contra `ofensiva_retorno` | custo do reparo ([01-A40]) | sem piso; só comparar |
| `relatorio_visto` por semana | já existe | o relatório dos pais funciona? | ≥ 50% das semanas com visualização |
| Funil do diagnóstico | `diag_fim` com `perguntas` e `inicio` | o diagnóstico posiciona ou é pulado? | ≥ 70% completam |

**O que não dá para medir antes da Fase 4** (já na especificação 7.5): mesma criança em dois aparelhos, perda por limpeza de dados, teste A/B de verdade. Logo, todo número do piloto é de **n pequeno** e se reporta com o n ao lado, nunca como porcentagem solta.

### 7f. Riscos

| Risco | Onde bate | Regra (DADO quando há fonte; OPINIÃO quando é escolha) |
|---|---|---|
| **ECA Digital, uso excessivo** (Decreto 12.880 art. 9º: esconder ponto de parada, conteúdo sem pedido, recompensa por tempo, notificação excessiva) [03-§2.1] | calendário de 90 dias, eventos de planeta, medalhas de 30/60/90 dias | medalha e baú contam **dias com ação**, nunca minutos; evento de planeta não começa sozinho nem some com contagem regressiva; a tela "Por hoje chega" vale também em dia de evento |
| **Práticas manipulativas** (Decreto art. 10: pressão emocional, urgência fabricada) [03-§2.1]; **pressão parassocial** (FTC 2022) [03-§1.1] | Kit de volta, bilhete, "você ainda sabe" | copy sem saudade, sem "faz X dias", sem Bobby triste; o Kit de volta não depende do tempo fora |
| **Loot box** (art. 20, definição exige pagamento, art. 2º IV) [03-§2.1] | baú, álbum, looks de evento | tudo grátis e **sem sorteio**; conteúdo do baú visível antes |
| **Supervisão parental** (arts. 17 e 18) | relatório, metas conjuntas, limite de blocos | limite de tempo e pausa continuam na mão do responsável; o relatório mostra tempo consolidado porque a lei pede, sem recompensar tempo |
| **Dado de criança** (LGPD art. 14; [03-§4.1]) | acerto por habilidade, pacote de métricas, relatório compartilhado | só `mk` e contadores; apelido nunca sai no pacote; relatório vai para onde o pai mandar, por ato dele |
| **Promessa de resultado** | site, loja, relatório | **Proibido escrever**: "3 meses à frente" (P1 é de 1º ano, app de pais, EUA), "0,36 da Khan", "85% é a taxa ótima" (M7 é teórico), "método Singapura", "mastery comprovado", "fluência em inglês", "cobre a BNCC". **Permitido**: "a criança pratica com perguntas que não repetem, revisa o que errou nos dias seguintes e o responsável recebe um resumo semanal" (descreve o que o app faz, sem prometer efeito) |
| **Sem fonte não promete** | este documento | tudo que está como OPINIÃO (pisos de métrica, parâmetros do BKT, alvo de 80%, calendário) é hipótese interna; se um dia virar texto para pai, precisa antes do dado do piloto |
| **BNCC sem o texto oficial** | seção 6, plano 7d | antes de qualquer material que cite código de habilidade, abrir o texto oficial; os códigos marcados "memória" podem estar errados |
| **Inglês fora da BNCC nos anos iniciais** | posicionamento de venda | vender como "primeiro contato com inglês, com voz nativa gravada", não como "inglês da escola" |
| **Retenção sem linha de base** | metas de 7e | nenhum número de D30 vai para plano de negócio antes do piloto; os benchmarks R1 e R2 são de mercado adulto e de métodos diferentes |
| **Gamificação que rouba o estudo** ([01-A22]) | semanas 5, 9, 11 (eventos) | medir prática contra prêmio; se cair abaixo de 80%, cortar evento antes de cortar conteúdo |

---

## 8. O que ficou de fora e o que precisa da mão do Filipe

- **Não fiz** teste no navegador nem toquei em código: a mesa pediu documento.
- **Não abri** o texto oficial da BNCC, o artigo da Science (Berkowitz), o Business of Apps e a central da Khan em inglês direto (403); usei espelho para a Khan e imprensa para Berkowitz, e marquei.
- **Não existe** dado de retenção de app de estudo infantil em fonte aberta; o piloto da seção 7e é o jeito de ter o nosso.
- **Decisões que são do Filipe:** (1) aceitar BKT por gerador em vez de esperar um modelo mais fino; (2) ordem do plano de conteúdo (3º, 4º, 5º, 2º, 6º, 7º) ou começar pelo 2º por causa da filha; (3) se o relatório dos pais pode citar nome de habilidade da BNCC (pede conferência do texto oficial) ou fica em linguagem do app; (4) pisos de "vale vender" da seção 7e; (5) pedagogo brasileiro para revisar as 30 frases de casa, a ordem de grafemas e as etiquetas `dif`.

---

## 9. Fontes abertas nesta sessão (24/10/2026)

| Código | Fonte | Data | Como abri |
|---|---|---|---|
| R1 | OneSignal, "Must-know mobile app benchmarks of 2024", onesignal.com/mobile-app-benchmarks-2024 | publicada 17/09/2024, modificada 05/03/2026 | página aberta |
| R2 | passion.io, "Mobile app retention benchmarks for creators, course and coaching apps" (atribui a AppsFlyer e Business of Apps) | 17/10/2025 | página aberta; a fonte original (businessofapps.com) devolveu bloqueio |
| R9 | smartbrief.com (patrocinado pela Duolingo) sobre estudo EDC 2021 | n/d | só resumo de busca |
| M1 | support.khanacademy.org, artigo 5548760867853, "How do Khan Academy's Mastery levels work?" | "Updated 3 years ago"; captura de 21/08/2023 | aberta por espelho (r.jina.ai) após 403 direto |
| M2 | blog.duolingo.com, "Learning how to help you learn: introducing Birdbrain", Bicknell e Brust | 07/10/2020 | página aberta |
| M3 | VentureBeat, "How Duolingo uses AI in every part of its app" | 2020 | só resumo de busca |
| M4 | aclanthology.org P16-1174 (Settles e Meeder, 2016); blog.duolingo.com "How we learn how you learn" | 2016 | só resumo de busca |
| M5 | en.wikipedia.org/wiki/ALEKS; mheducation.com | acessado 24/10/2026 | só resumo de busca |
| M6 | dreambox.com; d3.harvard.edu (perfil) | n/d | só resumo de busca |
| M7 | Wilson, Shenhav, Straccia, Cohen, "The Eighty Five Percent Rule for optimal learning", Nature Communications 10:4646, PMC6831579 | 05/11/2019 | página aberta |
| M8 | en.wikipedia.org "Bayesian knowledge tracing"; Baker et al. (UPenn) | acessado 24/10/2026 | só resumo de busca |
| P1 | WBEZ/NPR, "Where the wild fractions are: the power of a bedtime math story" (sobre Berkowitz et al., Science, 2015) | 08/10/2015 | página aberta; science.org devolveu 403 |
| P2 | news.uchicago.edu, "Parents' math anxiety can undermine children's math achievement" (Maloney et al., Psychological Science) | 10/08/2015 | página aberta |
| P3 | scale.stanford.edu, resumo de Doss, Fahle, Loeb, York, JHR 54(3) | 2019 | só resumo de busca |
| P4 | harris.uchicago.edu e povertyactionlab.org, resumo de Mayer, Kalil, Oreopoulos, Gallegos, JHR 54(4) | 2019 | só resumo de busca |
| P5 | cde.state.co.us (Jeynes 2012) não abriu; resumo de busca | 2012 | só resumo de busca |
| BNCC MA 2º | tudosaladeaula.com, habilidades de matemática do 2º ano | acessado 24/10/2026 | página aberta |
| BNCC MA 3º, 4º, 5º | profez.com.br/bncc/matematica/3-ano, 4-ano, 5-ano | acessado 24/10/2026 | páginas abertas |
| BNCC MA 6º, 7º | novaescola.org.br/planos-de-aula/fundamental/6ano e 7ano/matematica (só códigos) | acessado 24/10/2026 | páginas abertas |
| BNCC LP 2º, 3º | tudosaladeaula.com, habilidades de língua portuguesa do 2º e do 3º ano | acessado 24/10/2026 | páginas abertas |
| BNCC LP 4º, 5º | resumo de busca (todamateria, tudosaladeaula) | acessado 24/10/2026 | só resumo de busca |
| BNCC inglês 6º | Caderno de Inglês de Rondônia (2021), artigos UFPB e UFCG | 2021 a 2024 | só resumo de busca |
| ECA Digital | Lei 15.211/2025 e Decreto 12.880/2026 | vigência 17/03/2026 | **não reaberto**; uso o que a Fase 1 já leu em planalto.gov.br [03-§2.1] |

Tentei e não abri (não entram como dado): businessofapps.com (bloqueio anti-robô, duas tentativas); science.org (403); support.khanacademy.org em inglês direto (403); planalto.gov.br e in.gov.br nesta sessão (conexão caiu; a Fase 1 abriu); reunir.unir.net (Castro 2015, 403); cde.state.co.us (conexão recusada); pubmed (exige cookie); basenacionalcomum.mec.gov.br (não tentado por ser aplicação em JavaScript; igual à Fase 1).
