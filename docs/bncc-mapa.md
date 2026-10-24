# Mapa BNCC do Universo de Bobby
Gerado em 24/10/2026 pelo verificador de fatos. Fonte única: texto oficial da BNCC (versão final homologada), PDF do MEC.
- URL pedida: http://basenacionalcomum.mec.gov.br/images/BNCC_EI_EF_110518_versaofinal_site.pdf
- URL efetivamente aberta (redirecionamento do próprio MEC): https://cdn.mec.gov.br/basenacionalcomum.mec.gov.br/images/BNCC_EI_EF_110518_versaofinal_site.pdf
- Como foi conferido: o PDF (600 páginas) foi baixado e o texto extraído; cada código citado aqui foi localizado no PDF com a descrição exata, o quadro do ano, a unidade temática (ou prática de linguagem, no caso de Português, ou eixo e unidade, no caso de Inglês) e o objeto de conhecimento. O arquivo `bncc-mapa.json` traz tudo isso campo a campo, com a página do PDF.
- Regra para o relatório dos pais: só citar código com `conferido: true` e só nas fases com status `mapeada`. Fase `sem código claro` e fase de `revisão` não citam código. Inglês não cita código para criança de 7 a 10 anos.

## Números
- Fases: 150 (50 por matéria). Mapeadas a pelo menos um código: 142.
- Códigos distintos usados no mapa: 132. Conferidos no PDF oficial: 132. Não conferidos: 0.
- Fases sem código claro (não citar código): 9.2, 9.5, p6.3, p6.4.
- Fases de revisão (herdam o código da pergunta sorteada): 10.5, p10.5, e10.5.

## Códigos que NÃO foram conferidos
Nenhum. Todos os códigos usados no mapa foram encontrados no PDF oficial com descrição, ano, unidade e objeto. Os códigos que o documento da mesa marcou como "memória" (EF06MA33, EF07MA35, EF07MA17, EF07MA37, potência em EF06MA03, EF06LI01 a EF06LI26) existem e têm o sentido descrito.

## Erros e imprecisões no documento da mesa (docs/mesa/04-pedagogia-e-retencao.md, seção 6 e plano 7d)
- **EF06MA14**: no documento, "expressões numéricas". Texto oficial: "Reconhecer que a relação de igualdade matemática não se altera ao adicionar, subtrair, multiplicar ou dividir os seus dois membros por um mesmo número e utilizar essa noção para determinar valores desconhecidos na resolução de problemas.". ERRADO: é propriedades da igualdade (Álgebra). Expressões numéricas não têm código próprio.
- **EF06MA23**: no documento, "fluxograma". Texto oficial: "Construir algoritmo para resolver situações passo a passo (como na construção de dobraduras ou na indicação de deslocamento de um objeto no plano segundo pontos de referência e distâncias fornecidas etc.).". IMPRECISO: é construir algoritmo passo a passo; fluxograma está em EF06MA04 e EF06MA34.
- **EF06MA34**: no documento, "algoritmos". Texto oficial: "Interpretar e desenvolver fluxogramas simples, identificando as relações entre os objetos representados (por exemplo, posição de cidades considerando as estradas que as unem, hierarquia dos funcionários de uma empresa etc.).". IMPRECISO: é interpretar e desenvolver fluxogramas; algoritmo está em EF06MA04 e EF06MA23.
- **EF06MA02**: no documento, "naturais e decimais na reta (01, 02)". Texto oficial: "Reconhecer o sistema de numeração decimal, como o que prevaleceu no mundo ocidental, e destacar semelhanças e diferenças com outros sistemas, de modo a sistematizar suas principais características (base, valor posicional e função do zero), utilizando, inclusive, a composição e decomposição de números naturais e números racionais em sua representação decimal.". IMPRECISO: a reta numérica está em EF06MA01; EF06MA02 é sobre o sistema de numeração decimal e outros sistemas.
- **EF04MA28**: no documento, "gráficos com síntese escrita (27, 28)". Texto oficial: "Realizar pesquisa envolvendo variáveis categóricas e numéricas e organizar dados coletados por meio de tabelas e gráficos de colunas simples ou agrupadas, com e sem uso de tecnologias digitais.". IMPRECISO: a síntese escrita é EF04MA27; EF04MA28 é realizar pesquisa e organizar dados.
- **EF03MA09**: no documento, "metade e frações unitárias". Texto oficial: "Associar o quociente de uma divisão com resto zero de um número natural por 2, 3, 4, 5 e 10 às ideias de metade, terça, quarta, quinta e décima partes.". ACEITÁVEL: quociente de divisão exata associado a metade, terça, quarta, quinta e décima partes.
- **EF02LP06**: no documento, "nomes das letras". Texto oficial: "Perceber o princípio acrofônico que opera nos nomes das letras do alfabeto.". ACEITÁVEL: princípio acrofônico dos nomes das letras.
- Todos os outros códigos citados nas tabelas 6.1, 6.2 e 7d existem e correspondem ao que o documento descreve.
- Conteúdo que o app ensina e que fica fora do 1º ao 7º ano: raiz quadrada (9.5) é 8º ano (EF08MA02); futuro com will (e10.1) é conteúdo do 8º ano (EF08LI14 e EF08LI12; a palavra will não aparece no texto), não do 6º ou 7º.
- Conteúdo do app sem habilidade própria na BNCC: ordem das operações (9.2), singular e plural (p6.3), masculino e feminino (p6.4), conceito de frase (p5.1, p5.3 em parte), multiplicação por 0 e 1, divisão por 1 e por ele mesmo.

## As cinco maiores lacunas (resumo para decisão)
Contagem feita sobre o PDF oficial: habilidade do ano que nenhuma fase nem maker do Bobby trabalha. Habilidades de produção de texto, oralidade e pesquisa de campo contam como fora do alcance de um app de perguntas e estão marcadas assim nas listas; as lacunas abaixo são as que um app de perguntas poderia cobrir e não cobre.

1. **Matemática, Grandezas e medidas do 1º ao 4º ano: zero fases.** Calendário, relógio digital e analógico, horas e minutos, duração (EF01MA16, EF01MA17, EF01MA18, EF02MA18, EF02MA19, EF03MA22, EF03MA23, EF04MA22), medir e estimar comprimento, massa e capacidade com a unidade certa (EF01MA15, EF02MA16, EF02MA17, EF03MA17, EF03MA18, EF03MA19, EF03MA20), temperatura (EF04MA23, EF04MA24). São 16 habilidades. O app só tem conversão de unidades (8.5, nível de 5º ano) e perímetro e área.
2. **Matemática, Geometria de localização, sólidos e transformações do 1º ao 7º ano: zero fases.** Localização e trajetos (EF01MA11, EF01MA12, EF02MA12, EF02MA13, EF03MA12, EF04MA16), sólidos e planificações (EF01MA13, EF01MA14, EF02MA14, EF02MA15, EF03MA13, EF03MA14, EF04MA17, EF05MA16, EF06MA17), plano cartesiano (EF05MA14, EF05MA15, EF06MA16, EF07MA19, EF07MA20), simetria, ampliação e redução, congruência (EF03MA16, EF04MA19, EF05MA18, EF06MA21, EF07MA21). São 25 habilidades. A unidade 8 do app só trata de polígonos planos, perímetro, área e ângulos.
3. **Português, leitura e compreensão além de "achar a informação": 3 textos para 50 fases e um único código de leitura (EF15LP03).** Faltam antecipar e checar hipóteses (EF15LP02), ler com fluência (EF35LP01), ideia central (EF35LP03), inferir implícito (EF35LP04), sentido de palavra pelo contexto (EF35LP05), coesão por substituição (EF35LP06, EF35LP14) e os gêneros por campo que a BNCC lista ano a ano (cantiga EF02LP12, carta e diário EF03LP12, notícia EF04LP14 e EF12LP08, fato e opinião EF04LP15, regras de jogo EF05LP09, anedota EF05LP10, texto de divulgação científica EF04LP19, verbete EF05LP22, narrativa com conflito EF02LP28 e EF35LP29, poema EF12LP18 e EF35LP23). É a lacuna que mais pesa para 9 a 12 anos.
4. **Matemática, Probabilidade e estatística e Álgebra de padrões do 1º ao 5º ano: quase nada antes da unidade 9 e 10 (feitas para 11 a 12 anos).** Acaso qualitativo (EF01MA20, EF03MA25, EF04MA26; EF02MA21 só num maker de 10.3), tabelas simples e de dupla entrada e gráficos de colunas para 1º e 2º ano (EF01MA21, EF02MA22), síntese de dados (EF05MA24), sequências e padrões (EF01MA09, EF02MA09, EF02MA10, EF02MA11), igualdade como equilíbrio (EF03MA11, EF04MA14, EF05MA10), contagem de possibilidades (EF04MA08, EF05MA09). São 17 habilidades.
5. **Português do 4º e do 5º ano: 5 de 27 e 4 de 28 habilidades tocadas.** Acentuação por regra de paroxítonas (EF04LP04), concordância verbal (EF04LP06), flexão verbal por pronome (EF05LP06), pontuação expressiva (EF05LP04), prefixos e sufixos (EF03LP10, EF05LP08), ditongos reduzidos (EF04LP02), polissemia (EF05LP02), sinônimos, antônimos, aumentativo e diminutivo do 2º ano (EF02LP10, EF02LP11), estruturas silábicas CVC, CCV, VC (EF03LP02; o app só usa CV). Para 10 a 12 anos, o português do Bobby é revisão de ortografia do 3º ano.

Fora do ranking por serem estruturais: (a) **produção de texto e oralidade** (todas as habilidades de Escrita, Produção de textos e Oralidade de LP, e os eixos Oralidade e Escrita de LI) não cabem num app sem texto livre, decisão já tomada por privacidade; (b) **Inglês para 7 a 10 anos** não tem currículo na BNCC, então não é lacuna, é extra; para 11 a 12 anos faltam toda a gramática do 6º ano (verbo to be, presente simples e contínuo, imperativo, genitivo, possessivos: EF06LI19 a EF06LI23) e toda a leitura de texto (EF06LI07 a EF06LI12); (c) **7º ano de Matemática**: 27 de 37 habilidades fora, porque o app para nos números inteiros e na equação do 1º grau; faltam operações com racionais (EF07MA11, EF07MA12), linguagem algébrica e sequências (EF07MA13 a EF07MA16), toda a geometria do ano e gráfico de setores (EF07MA37).

### Cobertura por ano (habilidades do ano tocadas por pelo menos um maker)

| Componente | Ano | Habilidades | Tocadas | Não cobertas |
|---|---|---|---|---|
| Matemática | 1º | 22 | 7 | 15 |
| Matemática | 2º | 23 | 8 | 15 |
| Matemática | 3º | 28 | 14 | 14 |
| Matemática | 4º | 28 | 13 | 15 |
| Matemática | 5º | 25 | 13 | 12 |
| Matemática | 6º | 34 | 16 | 18 |
| Matemática | 7º | 37 | 10 | 27 |
| Língua Portuguesa | 1º | 26 | 10 | 16 |
| Língua Portuguesa | 2º | 29 | 8 | 21 |
| Língua Portuguesa | 3º | 27 | 10 | 17 |
| Língua Portuguesa | 4º | 27 | 5 | 22 |
| Língua Portuguesa | 5º | 28 | 4 | 24 |
| Língua Inglesa | 6º | 26 | 8 | 18 |
| Língua Portuguesa (habilidades de bloco de anos) | EF12LP | 19 | 3 | 16 |
| Língua Portuguesa (habilidades de bloco de anos) | EF15LP | 19 | 2 | 17 |
| Língua Portuguesa (habilidades de bloco de anos) | EF35LP | 31 | 1 | 30 |

## Fases de Matemática

| Fase | Título | Status | Códigos | Observação |
|---|---|---|---|---|
| 1.1 | Contar até 20 | mapeada | EF01MA02, EF01MA04, EF01MA10 | Habilidades do 1º ano (6 anos): abaixo da faixa do app, mas é o ponto de partida da trilha. |
| 1.2 | Maior, menor ou igual | mapeada | EF02MA01, EF01MA05 |  |
| 1.3 | A dezena: juntar de 10 em 10 | mapeada | EF01MA07, EF02MA04 |  |
| 1.4 | Unidade, dezena e centena | mapeada | EF02MA01, EF02MA04, EF03MA01 |  |
| 1.5 | Reta numérica e arredondar | mapeada | EF03MA10, EF03MA04, EF06MA12 | Arredondar à dezena ou centena não tem habilidade própria do 1º ao 5º ano; o código mais próximo é EF06MA12 (6º ano). EF04MA03 fala em "fazer estimativas do resultado", que é uso, não o arredondamento em si. |
| 2.1 | Somas até 20 | mapeada | EF01MA06, EF02MA05 |  |
| 2.2 | Somar com dezenas | mapeada | EF02MA06, EF03MA05 |  |
| 2.3 | Subtrair | mapeada | EF02MA05, EF02MA06, EF03MA05 |  |
| 2.4 | Contas até 1000 | mapeada | EF03MA05, EF04MA03 |  |
| 2.5 | Problemas do dia a dia | mapeada | EF02MA06, EF03MA06, EF04MA03 |  |
| 3.1 | A ideia de multiplicar | mapeada | EF02MA07, EF03MA07 | Elemento neutro e multiplicação por zero não têm habilidade própria na BNCC. |
| 3.2 | Tabuada do 2 ao 5 | mapeada | EF03MA03, EF03MA07, EF02MA08 |  |
| 3.3 | Tabuada do 6 ao 9 | mapeada | EF03MA03 | EF03MA03 fala em fatos básicos da multiplicação sem fixar até qual tabuada; as tabuadas de 6 a 9 ficam entre o 3º e o 4º ano (EF04MA06). |
| 3.4 | Multiplicar por 10, 100 e 1000 | mapeada | EF04MA02, EF04MA05 |  |
| 3.5 | Multiplicação com 2 algarismos | mapeada | EF04MA06, EF04MA05 |  |
| 4.1 | Repartir em partes iguais | mapeada | EF03MA08, EF04MA13 |  |
| 4.2 | Divisões exatas | mapeada | EF03MA08, EF04MA07 |  |
| 4.3 | Divisão com resto | mapeada | EF03MA08, EF04MA07 |  |
| 4.4 | Dobro, metade, triplo e terça parte | mapeada | EF02MA08, EF03MA09 |  |
| 4.5 | Múltiplos, divisores e primos | mapeada | EF06MA05, EF06MA06, EF04MA11 | Número primo entra na BNCC só no 6º ano (EF06MA05). Múltiplos aparecem antes (EF04MA11). |
| 5.1 | O que é uma fração | mapeada | EF04MA09, EF05MA03 |  |
| 5.2 | Frações equivalentes | mapeada | EF05MA04, EF06MA07 |  |
| 5.3 | Comparar frações | mapeada | EF05MA05, EF06MA07 |  |
| 5.4 | Somar e subtrair frações | mapeada | EF06MA10 | Adição e subtração de frações só entram na BNCC no 6º ano (EF06MA10). No 5º ano (EF05MA07) as operações são com decimais finitos. |
| 5.5 | Fração de uma quantidade | mapeada | EF06MA09, EF03MA09 |  |
| 6.1 | Décimos e centésimos | mapeada | EF04MA10, EF05MA02, EF06MA08 |  |
| 6.2 | Comparar decimais | mapeada | EF05MA02, EF05MA05 |  |
| 6.3 | Somar e subtrair decimais | mapeada | EF05MA07, EF02MA20 |  |
| 6.4 | Dinheiro e troco | mapeada | EF04MA25, EF05MA08, EF02MA20 |  |
| 6.5 | Decimais por 10 e por 100 | mapeada | EF05MA08 |  |
| 7.1 | O que é porcentagem | mapeada | EF05MA06, EF06MA13 |  |
| 7.2 | Calcular de cabeça | mapeada | EF05MA06, EF06MA13 |  |
| 7.3 | Descontos e aumentos | mapeada | EF07MA02, EF04MA25 |  |
| 7.4 | Razão e proporção | mapeada | EF05MA12, EF07MA09 |  |
| 7.5 | Regra de três | mapeada | EF07MA17, EF05MA12 | Regra de três como procedimento não é nomeada na BNCC; EF06MA13 pede porcentagem SEM regra de três. O código que cobre proporcionalidade com sentença é EF07MA17. |
| 8.1 | Formas e seus lados | mapeada | EF03MA15, EF05MA17, EF06MA20 |  |
| 8.2 | Perímetro | mapeada | EF04MA20, EF06MA24 |  |
| 8.3 | Área | mapeada | EF06MA24, EF07MA31, EF06MA29 | O app usa fórmula (base × altura). EF06MA24 pede área sem fórmula; a expressão de cálculo é EF07MA31. |
| 8.4 | Ângulos | mapeada | EF06MA25, EF07MA24, EF04MA18 |  |
| 8.5 | Unidades de medida | mapeada | EF05MA19, EF07MA30 |  |
| 9.1 | O número desconhecido | mapeada | EF04MA15, EF05MA11 |  |
| 9.2 | Ordem das operações | sem código claro | (nenhum) | Expressões numéricas e ordem das operações não têm habilidade própria na BNCC do 1º ao 7º ano. O código mais próximo, e ainda assim genérico, é EF06MA03 (cálculos com naturais por estratégias variadas). Não citar código no relatório. |
| 9.3 | Equações do 1º grau | mapeada | EF07MA18, EF06MA14 |  |
| 9.4 | Potências | mapeada | EF06MA03 | A potenciação aparece no objeto de conhecimento de EF06MA03 (operações com naturais), não no texto da habilidade. Correspondência aceitável, mas fraca. |
| 9.5 | Raiz quadrada | sem código claro | (nenhum) | Raiz quadrada entra na BNCC só no 8º ano (EF08MA02, potenciação e radiciação), fora da faixa de 7 a 12 anos. Não citar código no relatório; marcar como conteúdo adiantado. |
| 10.1 | Média | mapeada | EF07MA35 | Média aritmética é habilidade do 7º ano (EF07MA35), não do 5º. |
| 10.2 | Ler gráficos | mapeada | EF03MA26, EF03MA27, EF07MA35 |  |
| 10.3 | Probabilidade | mapeada | EF05MA23, EF06MA30 |  |
| 10.4 | Números negativos | mapeada | EF07MA03, EF07MA04 | Números inteiros negativos são conteúdo do 7º ano. |
| 10.5 | Desafio final | revisão | (nenhum) | Fase de revisão: herda o código da fase de origem de cada pergunta (q.__mk). Não tem código próprio. |

### Detalhe por maker (ordem do array em src/conteudo)

**1.1 Contar até 20**
- m0: contar bolinhas (6 a 20) → EF01MA02, EF01MA04
- m1: número que vem depois → EF01MA10
- m2: número que vem antes → EF01MA10
- m3: completar sequência +1 → EF01MA10
- m4: contar de trás para frente → EF01MA10
- m5: ganha mais 1 figurinha → EF01MA08

**1.2 Maior, menor ou igual**
- m0: maior de três números de 2 algarismos → EF01MA05, EF02MA01
- m1: menor de três números → EF01MA05, EF02MA01
- m2: sinal > ou < com 2 algarismos → EF01MA05
- m3: sinal > ou < com 3 algarismos → EF02MA01
- m4: verdadeiro ou falso: a é maior que a+k → EF02MA01
- m5: verdadeiro ou falso: a é maior que a-k → EF02MA01

**1.3 A dezena: juntar de 10 em 10**
- m0: quantos cubinhos tem uma barrinha → EF01MA07
- m1: quanto valem d barrinhas → EF01MA07
- m2: montar d0 com barrinhas (material dourado) → EF01MA07, EF02MA04
- m3: contar cubinhos: dezenas e unidades → EF01MA07
- m4: trocar cubinhos soltos por barrinha → EF01MA07
- m5: quantas dezenas cabem em d0 → EF01MA07

**1.4 Unidade, dezena e centena**
- m0: ler o número montado com placas, barrinhas e cubinhos → EF02MA04
- m1: montar número de 3 ordens com as peças → EF02MA04
- m2: valor posicional do algarismo das centenas → EF02MA01
- m3: c centenas + d dezenas + u unidades → EF02MA04, EF03MA02
- m4: quantas barrinhas cabem numa placa → EF02MA04
- m5: como se lê o número (por extenso) → EF03MA01

**1.5 Reta numérica e arredondar**
- m0: sequência de 2 em 2, 5 em 5, 10 em 10... → EF03MA10, EF04MA11
- m1: arredondar à dezena → EF06MA12
- m2: arredondar à centena → EF06MA12
- m3: ponto médio entre dois números na reta → EF03MA04
- m4: verdadeiro ou falso sobre arredondamento → EF06MA12
- m5: contar de 3 em 3, 4 em 4... → EF03MA10, EF04MA11

**2.1 Somas até 20**
- m0: a + b até 20 (digitar) → EF01MA06, EF02MA05
- m1: a + b passando de 10 → EF01MA06, EF02MA05
- m2: escolher a soma certa → EF02MA05
- m3: completar ___ + a = t → EF02MA05
- m4: comutatividade (verdadeiro ou falso) → EF04MA05
- m5: contar bolinhas de dois grupos → EF01MA08

**2.2 Somar com dezenas**
- m0: soma de 2 algarismos sem reserva → EF03MA05
- m1: soma de 2 algarismos com reserva → EF03MA05
- m2: somar dezenas redondas → EF02MA05
- m3: escolher a soma certa → EF03MA05
- m4: completar a + ___ = t → EF03MA05
- m5: problema: tinha a figurinhas e ganhou b → EF02MA06

**2.3 Subtrair**
- m0: a − b até 20 → EF02MA05
- m1: a − b com 2 algarismos → EF03MA05
- m2: diferença entre dois números → EF03MA05, EF03MA06
- m3: escolher a diferença certa → EF03MA05
- m4: completar a − ___ = r → EF03MA05
- m5: problema: tinha a reais e gastou b → EF02MA06

**2.4 Contas até 1000**
- m0: soma de 3 algarismos → EF03MA05, EF04MA03
- m1: subtração de 3 algarismos → EF03MA05, EF04MA03
- m2: subtrair de centena redonda → EF03MA05, EF04MA03
- m3: a + b − c → EF04MA03
- m4: escolher a soma certa → EF03MA05
- m5: completar a + ___ = t → EF03MA05

**2.5 Problemas do dia a dia**
- m0: páginas lidas ao todo (juntar) → EF02MA06, EF03MA06
- m1: quantas a mais (comparar) → EF03MA06
- m2: ganhou e deu (duas etapas) → EF04MA03
- m3: quantas páginas faltam (completar) → EF03MA06
- m4: três cores de bolas ao todo → EF02MA06
- m5: qual conta resolve o problema → EF03MA06

**3.1 A ideia de multiplicar**
- m0: bolinhas em grupos iguais (figura) → EF02MA07, EF03MA07
- m1: montar g grupos de p (interativo) → EF02MA07
- m2: montar g × p com caixinhas → EF02MA07, EF03MA07
- m3: g grupos de p é igual a quanto → EF02MA07
- m4: qual soma é igual a a × 4 → EF02MA07
- m5: comutatividade da multiplicação → EF04MA05
- m6: a × 1 → sem código claro
- m7: a × 0 → sem código claro

**3.2 Tabuada do 2 ao 5**
- m0: a × b com a de 2 a 5 → EF03MA03
- m1: 2 × b → EF03MA03
- m2: 5 × b → EF03MA03
- m3: montar grupos e dizer o total → EF03MA07
- m4: escolher o produto certo → EF03MA03
- m5: completar a × ___ = p → EF03MA03, EF04MA13
- m6: o dobro de b → EF02MA08

**3.3 Tabuada do 6 ao 9**
- m0: a × b com a de 6 a 9 → EF03MA03
- m1: 9 × b → EF03MA03
- m2: 7 × b → EF03MA03
- m3: escolher o produto certo → EF03MA03
- m4: completar ___ × b = p → EF04MA13
- m5: a × a (quadrados) → EF03MA03

**3.4 Multiplicar por 10, 100 e 1000**
- m0: a × 10 → EF04MA02
- m1: a × 100 → EF04MA02
- m2: a × 1000 → EF04MA02
- m3: a × 20 (dobrar e × 10) → EF04MA05
- m4: a00 × 3 → EF04MA05
- m5: quantas vezes a cabe em a00 → EF04MA02

**3.5 Multiplicação com 2 algarismos**
- m0: 2 algarismos × 1 algarismo → EF04MA06
- m1: 2 algarismos × 2 algarismos → EF04MA06
- m2: escolher o produto certo → EF04MA06
- m3: decompor a × 12 em a × 10 + a × 2 → EF04MA05
- m4: lápis em c caixas (parcelas iguais) → EF04MA06
- m5: fileiras × cadeiras (disposição retangular) → EF04MA06

**4.1 Repartir em partes iguais**
- m0: repartir bolinhas em g grupos (figura) → EF03MA08
- m1: balas entre c crianças → EF03MA08
- m2: se a × b = p, quanto é p ÷ a → EF04MA13
- m3: a ÷ 1 → sem código claro
- m4: a ÷ a → sem código claro
- m5: dividir por 2 é achar a metade → EF03MA09

**4.2 Divisões exatas**
- m0: p ÷ a pela tabuada → EF03MA08
- m1: p ÷ b com b de 3 a 9 → EF03MA08
- m2: escolher o quociente certo → EF03MA08
- m3: a0 ÷ 10 → EF03MA08
- m4: completar ___ ÷ a = b → EF04MA13
- m5: dividendo de 2 algarismos ÷ b → EF04MA07

**4.3 Divisão com resto**
- m0: quociente de divisão não exata → EF03MA08, EF04MA07
- m1: resto de divisão não exata → EF03MA08
- m2: escolher o resto certo → EF03MA08
- m3: figurinhas entre amigos: quantas sobram → EF03MA08
- m4: divisão exata tem resto zero → EF03MA08
- m5: resto não pode ser igual ao divisor → EF04MA07

**4.4 Dobro, metade, triplo e terça parte**
- m0: dobro de a → EF02MA08
- m1: metade de a → EF02MA08, EF03MA09
- m2: triplo de a → EF02MA08
- m3: terça parte de a → EF02MA08, EF03MA09
- m4: quarta parte de a → EF03MA09
- m5: verdadeiro ou falso: metade → EF02MA08

**4.5 Múltiplos, divisores e primos**
- m0: a×k é múltiplo de a → EF04MA11, EF06MA05
- m1: a×k+1 não é múltiplo de a → EF06MA05
- m2: qual é primo → EF06MA05
- m3: quantos divisores tem n → EF06MA06
- m4: qual é múltiplo de a → EF04MA11, EF06MA05
- m5: n não é primo → EF06MA05

**5.1 O que é uma fração**
- m0: que fração está pintada → EF05MA03
- m1: pintar a de b partes (interativo) → EF05MA03
- m2: pintar metade da barra → EF03MA09, EF04MA09
- m3: qual é o denominador → EF05MA03
- m4: qual é o numerador → EF05MA03
- m5: b/b é o inteiro → EF05MA03
- m6: 1/b é menor que 1/(b/2) → EF04MA09
- m7: qual fração é metade → EF04MA09

**5.2 Frações equivalentes**
- m0: qual fração é equivalente → EF05MA04
- m1: pintar 1/2 numa barra de b partes → EF05MA04
- m2: completar o numerador equivalente → EF05MA04
- m3: simplificar → EF05MA04, EF06MA07
- m4: 1/2 equivale a k/2k → EF05MA04
- m5: a/b não equivale a (a+1)/(b+1) → EF05MA04
- m6: qual fração vale um inteiro → EF05MA03

**5.3 Comparar frações**
- m0: maior com mesmo denominador → EF05MA05, EF06MA07
- m1: maior com mesmo numerador → EF05MA05, EF06MA07
- m2: sinal com 1/2 (menor) → EF05MA05
- m3: sinal com 1/2 (maior) → EF05MA05
- m4: 1/b menor que 1/(b+2)? (falso) → EF04MA09
- m5: a/b é menor que 1 → EF05MA03

**5.4 Somar e subtrair frações**
- m0: somar com mesmo denominador → EF06MA10
- m1: subtrair com mesmo denominador → EF06MA10
- m2: 1/2 + 1/b → EF06MA10
- m3: a/b + (b−a)/b = 1 inteiro → EF06MA10
- m4: quantos avos sobraram do bolo → EF06MA10
- m5: verdadeiro ou falso: soma de frações → EF06MA10

**5.5 Fração de uma quantidade**
- m0: a/b de n → EF06MA09
- m1: pintar a/b da barra → EF05MA03
- m2: metade de 2k → EF03MA09, EF02MA08
- m3: 1/b de n → EF03MA09, EF06MA09
- m4: escolher a/b de n → EF06MA09
- m5: deu 1/b das figurinhas → EF06MA09
- m6: 3/4 da turma foi ao passeio → EF06MA09

**6.1 Décimos e centésimos**
- m0: d/10 em decimal → EF04MA10, EF06MA08
- m1: c/100 em decimal → EF04MA10, EF06MA08
- m2: 1/2 = 0,5 → EF06MA08
- m3: 1/4 = 0,25 → EF06MA08
- m4: parte inteira de i,d → EF05MA02
- m5: algarismo dos centésimos → EF05MA02

**6.2 Comparar decimais**
- m0: qual decimal é maior → EF05MA05
- m1: sinal entre dois decimais → EF05MA05
- m2: 0,d = 0,d0 → EF05MA02
- m3: 0,a5 maior que 0,a → EF05MA05
- m4: decimal mais próximo de um inteiro → EF05MA02
- m5: ordem crescente 0,03 < 0,3 < 0,33 → EF05MA05

**6.3 Somar e subtrair decimais**
- m0: soma de decimais com 1 casa → EF05MA07
- m1: montar valor com notas e moedas (interativo) → EF02MA20, EF03MA24
- m2: soma de decimais com 2 casas → EF05MA07
- m3: subtração de decimais → EF05MA07
- m4: inteiro menos decimal → EF05MA07
- m5: a + 0,5 → EF05MA07
- m6: quanto falta para 10 → EF05MA07

**6.4 Dinheiro e troco**
- m0: troco de uma compra → EF04MA25, EF05MA07
- m1: total de dois produtos → EF04MA25, EF05MA07
- m2: q cadernos a R$ u cada → EF05MA08, EF04MA25
- m3: conta dividida entre n pessoas → EF05MA08
- m4: falta ou sobra dinheiro → EF04MA25
- m5: quantas moedas de 50 centavos → EF02MA20, EF03MA24
- m6: montar valor para pagar a feira → EF02MA20, EF03MA24

**6.5 Decimais por 10 e por 100**
- m0: decimal × 10 → EF05MA08
- m1: decimal × 100 → EF05MA08
- m2: natural ÷ 10 (resultado decimal) → EF05MA08
- m3: natural ÷ 100 → EF05MA08
- m4: decimal × 2 → EF05MA08
- m5: decimal ÷ 2 → EF05MA08

**7.1 O que é porcentagem**
- m0: p% como fração → EF05MA06
- m1: p% como decimal → EF05MA06, EF06MA08
- m2: 50% é a metade → EF05MA06
- m3: 1% de n → EF06MA13
- m4: 100% de 80 é 80 → EF05MA06
- m5: 100% de n → EF05MA06

**7.2 Calcular de cabeça**
- m0: 10% de n → EF05MA06
- m1: 50% de n → EF05MA06
- m2: 25% de n → EF05MA06
- m3: 20% de n → EF06MA13
- m4: 30, 40, 60, 70% de n → EF06MA13
- m5: 75% de n → EF05MA06

**7.3 Descontos e aumentos**
- m0: preço com desconto → EF07MA02
- m1: valor do desconto em reais → EF07MA02, EF04MA25
- m2: preço com aumento → EF07MA02
- m3: com d% de desconto paga (100−d)% → EF07MA02
- m4: metade = 50% de desconto → EF05MA06
- m5: desconto de 100% é de graça → EF07MA02

**7.4 Razão e proporção**
- m0: preço de 1 caderno a partir de q → EF05MA12
- m1: preço de 2q cadernos → EF05MA12
- m2: razão equivalente → EF07MA09
- m3: receita para 8 pessoas → EF05MA12
- m4: km com 20 litros → EF05MA12
- m5: 6 caixas pesam o dobro → EF05MA12

**7.5 Regra de três**
- m0: b itens a partir de a itens → EF05MA12, EF07MA17
- m1: torneira: litros em 3h → EF05MA12, EF07MA17
- m2: pedreiros e dias-trabalho → EF07MA17
- m3: km por litro → EF05MA12
- m4: arroz para c+1 pessoas → EF05MA12
- m5: qual conta monta a regra de três → EF07MA17

**8.1 Formas e seus lados**
- m0: quantos lados tem o polígono → EF03MA15, EF05MA17
- m1: nome do polígono pelo número de lados → EF05MA17
- m2: todo quadrado é retângulo → EF06MA20
- m3: círculo não é polígono → EF05MA17
- m4: vértices do retângulo → EF03MA15
- m5: figura com lados iguais e ângulos de 90° → EF06MA20

**8.2 Perímetro**
- m0: perímetro do retângulo (figura) → EF04MA20, EF06MA24
- m1: perímetro do quadrado → EF04MA20
- m2: perímetro do triângulo → EF04MA20
- m3: escolher o perímetro certo → EF04MA20
- m4: lado a partir do perímetro (4 × lado = p) → EF05MA11
- m5: verdadeiro ou falso: perímetro → EF04MA20

**8.3 Área**
- m0: área do retângulo (figura) → EF06MA24, EF07MA31
- m1: área do quadrado → EF06MA24
- m2: área do triângulo (base × altura ÷ 2) → EF07MA31
- m3: escolher a área certa → EF06MA24
- m4: altura a partir da área → EF07MA31
- m5: dobrar o lado não dobra a área → EF06MA29

**8.4 Ângulos**
- m0: agudo ou obtuso (figura) → EF06MA25, EF04MA18
- m1: ângulo reto tem 90° → EF04MA18, EF06MA25
- m2: volta completa 360° → EF06MA25
- m3: terceiro ângulo do triângulo → EF07MA24
- m4: ângulos complementares → EF06MA26
- m5: 100° não é agudo → EF06MA25

**8.5 Unidades de medida**
- m0: metros em centímetros → EF05MA19
- m1: km em metros → EF05MA19
- m2: kg em gramas → EF05MA19
- m3: litros em mL → EF05MA19
- m4: volume da caixa a × b × c → EF07MA30
- m5: centímetros em metros → EF05MA19

**9.1 O número desconhecido**
- m0: x + a = s → EF04MA15
- m1: x − a = d → EF04MA15
- m2: a × x = p → EF04MA15, EF05MA11
- m3: x ÷ a = q → EF05MA11
- m4: escolher o valor de x → EF04MA15
- m5: verdadeiro ou falso: 3 × x → EF05MA11

**9.2 Ordem das operações**
- m0: a + b × c → sem código claro
- m1: (a + b) × c → sem código claro
- m2: a × b − c → sem código claro
- m3: p ÷ c + b → sem código claro
- m4: escolher o resultado → sem código claro
- m5: parênteses mudam o resultado → sem código claro

**9.3 Equações do 1º grau**
- m0: ax + b = c → EF07MA18
- m1: ax − b = c → EF07MA18
- m2: ax = c → EF06MA14, EF07MA18
- m3: ax + bx = c → EF07MA18
- m4: escolher a solução → EF07MA18
- m5: verificar 2x + 1 → EF06MA14

**9.4 Potências**
- m0: a² → EF06MA03
- m1: a³ → EF06MA03
- m2: escolher a² → EF06MA03
- m3: a² não é a × 2 → EF06MA03
- m4: 10² e 10³ → EF06MA03, EF04MA02
- m5: a¹ → EF06MA03

**9.5 Raiz quadrada**
- m0: √(a²) → sem código claro
- m1: escolher √n → sem código claro
- m2: verdadeiro ou falso: raiz → sem código claro
- m3: lado do quadrado pela área → sem código claro
- m4: qual é quadrado perfeito → sem código claro
- m5: x² = n, x positivo → sem código claro

**10.1 Média**
- m0: média de três números → EF07MA35
- m1: média de m−2, m, m+2 → EF07MA35
- m2: média de quatro notas → EF07MA35
- m3: achar a outra nota pela média → EF07MA35
- m4: verdadeiro ou falso: média → EF07MA35
- m5: média de 10, 10 e 4 → EF07MA35

**10.2 Ler gráficos**
- m0: dia de maior valor no gráfico de barras → EF03MA27
- m1: dia de menor valor → EF03MA27
- m2: total dos quatro dias → EF03MA26
- m3: quantos a mais que (gráfico) → EF03MA26
- m4: média diária a partir do total → EF07MA35
- m5: barra mais alta (verdadeiro ou falso) → EF03MA27

**10.3 Probabilidade**
- m0: chance de sair 3 no dado → EF05MA23, EF06MA30
- m1: chance de cara na moeda → EF05MA23
- m2: bola azul na caixa → EF06MA30
- m3: número par no dado → EF06MA30
- m4: sair 7 é impossível → EF02MA21, EF05MA22
- m5: roleta com n partes → EF05MA23

**10.4 Números negativos**
- m0: qual é menor entre negativos → EF07MA03
- m1: b − a com resultado negativo → EF07MA04
- m2: −a + (a+b) → EF07MA04
- m3: termômetro sobe graus → EF07MA04
- m4: −a não é maior que 0 → EF07MA03
- m5: sinal entre dois negativos → EF07MA03

**10.5 Desafio final**
- m0: sorteia pergunta das unidades 6 a 10 → revisão
- m1: sorteia pergunta das unidades 6 a 10 → revisão
- m2: sorteia pergunta das unidades 6 a 10 → revisão
- m3: sorteia pergunta de qualquer unidade → revisão
- m4: sorteia pergunta das unidades 6 a 10 → revisão
- m5: sorteia pergunta de qualquer unidade → revisão

## Fases de Português

| Fase | Título | Status | Códigos | Observação |
|---|---|---|---|---|
| p1.1 | As vogais | mapeada | EF01LP10, EF01LP07 | Vogal e consoante não são nomeadas em habilidade própria; EF01LP10 (nomear letras) e EF01LP07 (fonema e letra) são as mais próximas. |
| p1.2 | O alfabeto | mapeada | EF01LP10 |  |
| p1.3 | Maiúscula e minúscula | mapeada | EF01LP11, EF02LP01 |  |
| p1.4 | Com que letra começa | mapeada | EF01LP09, EF01LP07, EF01LP13 | Contar letras de uma palavra não tem habilidade própria. |
| p1.5 | Ordem alfabética | mapeada | EF01LP10 | Ordem alfabética aparece só no nome do objeto de conhecimento do 3º ao 5º ano e no uso do dicionário (EF04LP03, EF35LP12); a habilidade direta é recitar o alfabeto na ordem (EF01LP10). |
| p2.1 | Bater as sílabas | mapeada | EF01LP06, EF02LP02, EF03LP05 |  |
| p2.2 | Sílabas com B, C, D | mapeada | EF01LP08, EF02LP03, EF02LP04 | B e D são correspondências regulares diretas (p/b, t/d) de EF02LP03; C antes de A, O, U é a contextual c/q. |
| p2.3 | Sílabas com F, G, L, M | mapeada | EF01LP08, EF02LP03, EF02LP04 | F entra nas correspondências regulares diretas (f/v) de EF02LP03; G com E e I (gue, gui) é EF03LP01. |
| p2.4 | Sílabas com N, P, R, T, V | mapeada | EF01LP08, EF02LP03, EF02LP04 | P, T e V entram nas correspondências regulares diretas (p/b, t/d, f/v) de EF02LP03. |
| p2.5 | Juntar sílabas e formar palavras | mapeada | EF02LP02, EF12LP01 |  |
| p3.1 | Palavras de 2 sílabas | mapeada | EF12LP01, EF02LP04, EF01LP02 |  |
| p3.2 | Palavras de 3 sílabas | mapeada | EF12LP01, EF02LP04, EF03LP05 |  |
| p3.3 | A sílaba que falta | mapeada | EF02LP02, EF01LP08, EF12LP01 |  |
| p3.4 | Letras embaralhadas | mapeada | EF02LP02, EF01LP08 |  |
| p3.5 | Palavras parecidas | mapeada | EF01LP09, EF01LP13, EF12LP19 | A rima aqui é entre palavras soltas; EF12LP19 e EF12LP07 falam de rima em textos versificados e cantigas. Correspondência parcial. |
| p4.1 | CA CO CU e CE CI | mapeada | EF03LP01, EF02LP03, EF04LP01 |  |
| p4.2 | R e RR | mapeada | EF03LP01 |  |
| p4.3 | S, SS e o S com som de Z | mapeada | EF03LP01 |  |
| p4.4 | CH, LH e NH | mapeada | EF03LP03 |  |
| p4.5 | M antes de P e B | mapeada | EF02LP05, EF03LP01 |  |
| p5.1 | O que é uma frase | mapeada | EF03LP08 | O conceito de frase não tem habilidade própria; só os makers de agente e ação encaixam em EF03LP08. |
| p5.2 | Maiúscula no começo, ponto no fim | mapeada | EF02LP01, EF02LP09 |  |
| p5.3 | A ordem das palavras | mapeada | EF03LP08 | Ordem das palavras na frase não é habilidade da BNCC nos anos iniciais; EF03LP08 cobre só agente, ação e objeto. |
| p5.4 | Interrogação e exclamação | mapeada | EF02LP09, EF01LP14, EF03LP07 |  |
| p5.5 | Juntar duas frases | mapeada | EF05LP07 | Conjunções (adição, oposição, causa) são habilidade do 5º ano. |
| p6.1 | Substantivo | mapeada | EF03LP08 |  |
| p6.2 | O, A, OS, AS | mapeada | EF04LP07 | Artigo não é nomeado como classe na BNCC dos anos iniciais; a concordância artigo + substantivo (EF04LP07) é a correspondência mais próxima. |
| p6.3 | Singular e plural | sem código claro | (nenhum) | Flexão de número não tem habilidade própria do 1º ao 5º ano. O código mais próximo é EF04LP07 (concordância no grupo nominal), mas a fase não trabalha concordância. Não citar código. |
| p6.4 | Masculino e feminino | sem código claro | (nenhum) | Flexão de gênero não tem habilidade própria do 1º ao 5º ano. Não citar código. |
| p6.5 | Nomes próprios | mapeada | EF02LP01 |  |
| p7.1 | Adjetivo: como é | mapeada | EF03LP09 |  |
| p7.2 | Verbo: o que faz | mapeada | EF03LP08 |  |
| p7.3 | Combinar direitinho | mapeada | EF04LP07 |  |
| p7.4 | Ontem, hoje e amanhã | mapeada | EF05LP05, EF02LP17 |  |
| p7.5 | Montar frases completas | mapeada | EF03LP08, EF03LP09 |  |
| p8.1 | Palavras com Ç | mapeada | EF04LP01 |  |
| p8.2 | G e J | mapeada | EF05LP01, EF35LP13, EF04LP08 |  |
| p8.3 | X e CH | mapeada | EF05LP01, EF35LP13 |  |
| p8.4 | S e Z no fim | mapeada | EF05LP01, EF35LP13 |  |
| p8.5 | Palavras que confundem | mapeada | EF35LP13, EF05LP07 |  |
| p9.1 | Para que serve o acento | mapeada | EF03LP04, EF03LP06 |  |
| p9.2 | O til e os sons nasais | mapeada | EF02LP05, EF03LP01 |  |
| p9.3 | Palavras com acento agudo | mapeada | EF05LP03, EF03LP04 |  |
| p9.4 | A vírgula na lista | mapeada | EF04LP05 |  |
| p9.5 | Quando alguém fala | mapeada | EF03LP07, EF04LP05 |  |
| p10.1 | Ler um bilhete | mapeada | EF12LP04, EF15LP03, EF02LP16 | Só 3 textos (bilhete, receita, historinha) para as 5 fases; as perguntas são de localizar informação explícita (EF15LP03). |
| p10.2 | Ler uma instrução | mapeada | EF03LP11, EF15LP03, EF03LP16 |  |
| p10.3 | Ler uma historinha | mapeada | EF01LP26, EF15LP03, EF15LP16 | EF15LP16 (textos narrativos de maior porte) é correspondência parcial: a historinha do app tem 3 frases. |
| p10.4 | Achar a informação | mapeada | EF15LP03 |  |
| p10.5 | Desafio final | revisão | (nenhum) | Fase de revisão: herda o código da fase de origem de cada pergunta. |

### Detalhe por maker (ordem do array em src/conteudo)

**p1.1 As vogais**
- m0: qual é vogal → EF01LP10
- m1: qual não é vogal → EF01LP10
- m2: quantas vogais tem a palavra → EF01LP07
- m3: primeira vogal da palavra → EF01LP07
- m4: quantas vogais existem → EF01LP10
- m5: vogal que vem depois → EF01LP10

**p1.2 O alfabeto**
- m0: letra que vem depois → EF01LP10
- m1: letra que vem antes → EF01LP10
- m2: completar a sequência de letras → EF01LP10
- m3: quantas letras tem o alfabeto → EF01LP10
- m4: vogal ou consoante → EF01LP10
- m5: primeira letra da palavra → EF01LP07

**p1.3 Maiúscula e minúscula**
- m0: minúscula de uma letra → EF01LP11
- m1: maiúscula de uma letra → EF01LP11
- m2: nome de pessoa com inicial maiúscula → EF02LP01
- m3: toda frase começa com maiúscula → EF02LP01
- m4: nome de cidade → EF02LP01
- m5: escrever a inicial em maiúscula → EF01LP11

**p1.4 Com que letra começa**
- m0: com que letra começa → EF01LP09, EF01LP07
- m1: com que letra termina → EF01LP13
- m2: qual palavra começa com L → EF01LP09
- m3: escrever a letra inicial → EF01LP07
- m4: quantas letras tem a palavra → sem código claro
- m5: ouvir e tocar na palavra → EF12LP01

**p1.5 Ordem alfabética**
- m0: qual palavra vem primeiro no alfabeto → EF01LP10
- m1: qual vem por último → EF01LP10
- m2: qual letra vem primeiro → EF01LP10
- m3: colocar três letras em ordem → EF01LP10
- m4: abacaxi antes de bola no dicionário → EF04LP03
- m5: Z não é a primeira letra → EF01LP10

**p2.1 Bater as sílabas**
- m0: quantas sílabas (bater palma) → EF01LP06, EF03LP05
- m1: separar palavra de 2 sílabas → EF02LP02
- m2: separar palavra de 3 sílabas → EF02LP02
- m3: primeira sílaba → EF02LP02
- m4: última sílaba → EF02LP02
- m5: qual palavra tem n sílabas → EF03LP05

**p2.2 Sílabas com B, C, D**
- m0: juntar consoante + vogal → EF01LP08, EF02LP03
- m1: como se lê a sílaba → EF01LP08, EF02LP03
- m2: montar palavra tocando nas sílabas → EF02LP04
- m3: palavra que começa com a sílaba → EF01LP09
- m4: qual sílaba falta em BA BE _ BO BU → EF01LP08
- m5: ouvir e escolher → EF12LP01

**p2.3 Sílabas com F, G, L, M**
- m0: juntar consoante + vogal → EF01LP08, EF02LP03
- m1: montar a palavra → EF02LP04, EF02LP03
- m2: primeira sílaba → EF02LP02
- m3: sílaba com som de gue → EF03LP01
- m4: ouvir e escolher → EF12LP01
- m5: sílaba da família do F, L, M → EF01LP08

**p2.4 Sílabas com N, P, R, T, V**
- m0: juntar consoante + vogal → EF01LP08, EF02LP03
- m1: montar a palavra → EF02LP04, EF02LP03
- m2: que palavra é PA-TO → EF12LP01
- m3: ouvir e escolher → EF12LP01
- m4: PA + PA = papa → EF01LP08
- m5: escrever a sílaba com O → EF01LP08

**p2.5 Juntar sílabas e formar palavras**
- m0: montar palavra de 2 sílabas → EF02LP04
- m1: montar palavra de 3 sílabas → EF02LP04
- m2: que palavra formam as sílabas → EF12LP01
- m3: escrever a palavra → EF01LP02
- m4: BO + LO vira LO + BO → EF02LP02
- m5: ouvir e montar com os olhos → EF12LP01

**p3.1 Palavras de 2 sílabas**
- m0: montar a palavra → EF02LP04
- m1: escrever a palavra → EF01LP02
- m2: ouvir e escolher → EF12LP01
- m3: que palavra é X + Y → EF12LP01
- m4: quantas letras tem → sem código claro
- m5: falta a última letra → EF01LP08

**p3.2 Palavras de 3 sílabas**
- m0: montar a palavra → EF02LP04
- m1: ouvir e escolher → EF12LP01
- m2: que palavra é CA-VA-LO → EF12LP01
- m3: sílaba do meio → EF02LP02
- m4: escrever a palavra → EF01LP02
- m5: quantas sílabas → EF03LP05

**p3.3 A sílaba que falta**
- m0: qual sílaba falta (3 sílabas) → EF02LP02
- m1: escrever a sílaba que falta → EF02LP02
- m2: completar o começo → EF02LP02
- m3: montar de novo a palavra → EF02LP04, EF01LP08
- m4: palavra que começa com a sílaba → EF01LP09
- m5: ouvir e escolher → EF12LP01

**p3.4 Letras embaralhadas**
- m0: palavra com sílabas embaralhadas → EF02LP02
- m1: montar em ordem (2 sílabas) → EF02LP02, EF01LP08
- m2: montar em ordem (3 sílabas) → EF02LP02, EF01LP08
- m3: LO + BO → EF02LP02
- m4: SA + CA → EF02LP02
- m5: escrever a palavra certa → EF01LP02

**p3.5 Palavras parecidas**
- m0: ouvir pato, gato, rato, mato → EF01LP09
- m1: ouvir bola, bolo, mola, cola → EF01LP13
- m2: rima com GATO → EF12LP19
- m3: rima com MESA → EF12LP19
- m4: ouvir e escolher → EF12LP01
- m5: BOLA e BOLO mudam em qual letra → EF01LP13

**p4.1 CA CO CU e CE CI**
- m0: C com som de S → EF02LP03, EF03LP01
- m1: C com som de K → EF02LP03
- m2: Ç em MAÇÃ → EF04LP01
- m3: maçã está certo → EF04LP01
- m4: CI não é ki → EF02LP03
- m5: completar CABEÇA com C ou Ç → EF04LP01

**p4.2 R e RR**
- m0: carro → EF03LP01
- m1: som forte de R no meio → EF03LP01
- m2: R inicial já é forte → EF03LP01
- m3: rato → EF03LP01
- m4: completar CACHORRO → EF03LP01
- m5: CARO e CARRO diferem pelo som do R → EF03LP01

**p4.3 S, SS e o S com som de Z**
- m0: S com som de Z → EF03LP01
- m1: massa → EF03LP01
- m2: S entre vogais soa Z → EF03LP01
- m3: pêssego → EF03LP01
- m4: completar PASSARINHO → EF03LP01
- m5: som de S entre vogais → EF03LP01

**p4.4 CH, LH e NH**
- m0: chuva → EF03LP03
- m1: palavra com LH → EF03LP03
- m2: palavra com NH → EF03LP03
- m3: separar CHUVA → EF03LP03, EF02LP02
- m4: completar SONHO → EF03LP03
- m5: CH tem som de X → EF03LP03

**p4.5 M antes de P e B**
- m0: campo → EF02LP05
- m1: bomba → EF02LP05
- m2: completar TAMBÉM → EF02LP05
- m3: completar CAMPEÃO → EF02LP05
- m4: antes de P e B não é N → EF02LP05
- m5: qual está errada (conpra) → EF03LP01

**p5.1 O que é uma frase**
- m0: qual delas é uma frase → sem código claro
- m1: é uma frase (verdadeiro) → sem código claro
- m2: não é uma frase (falso) → sem código claro
- m3: frase na ordem certa → sem código claro
- m4: quem faz a ação → EF03LP08
- m5: qual é a ação → EF03LP08

**p5.2 Maiúscula no começo, ponto no fim**
- m0: qual está escrita corretamente → EF02LP01
- m1: o que falta em "a menina canta" → EF02LP01
- m2: frase não termina sem sinal → EF02LP09
- m3: qual sinal termina frase comum → EF02LP09
- m4: escolher a frase certa → EF02LP01
- m5: qual letra deve ser maiúscula → EF02LP01

**p5.3 A ordem das palavras**
- m0: montar a frase certa → sem código claro
- m1: o que vem primeiro na frase → EF03LP08
- m2: "Na escola a menina desenha" também está certa → sem código claro
- m3: qual parte diz ONDE → EF03LP08
- m4: qual parte diz o que faz → EF03LP08
- m5: qual frase está embaralhada → sem código claro

**p5.4 Interrogação e exclamação**
- m0: sinal da pergunta → EF02LP09
- m1: sinal da exclamação → EF02LP09
- m2: sinal da frase comum → EF02LP09
- m3: "Cuidado!" mostra um aviso forte → EF01LP14
- m4: toda pergunta termina com ? → EF02LP09
- m5: qual frase é pergunta → EF02LP09, EF03LP07

**p5.5 Juntar duas frases**
- m0: completar com e → EF05LP07
- m1: completar com mas → EF05LP07
- m2: completar com porque → EF05LP07
- m3: qual palavra mostra oposição → EF05LP07
- m4: qual palavra explica o motivo → EF05LP07
- m5: e junta ideias → EF05LP07

**p6.1 Substantivo**
- m0: qual é substantivo → EF03LP08
- m1: qual não é substantivo → EF03LP08
- m2: é um substantivo (verdadeiro) → EF03LP08
- m3: professora é nome de pessoa → EF03LP08
- m4: escola é lugar → EF03LP08
- m5: cachorro é bicho → EF03LP08

**p6.2 O, A, OS, AS**
- m0: artigo para bola → EF04LP07
- m1: artigo para gato → EF04LP07
- m2: artigo para meninas → EF04LP07
- m3: artigo para livros → EF04LP07
- m4: completar ___ casa → EF04LP07
- m5: A é usado com femininas → EF04LP07

**p6.3 Singular e plural**
- m0: plural de palavra de 2 sílabas → sem código claro
- m1: plural de palavra de 3 sílabas → sem código claro
- m2: plural de pão → sem código claro
- m3: plural de flor → sem código claro
- m4: meninas está no plural → sem código claro
- m5: plural quase sempre termina em S → sem código claro

**p6.4 Masculino e feminino**
- m0: feminino de menino → sem código claro
- m1: feminino de gato → sem código claro
- m2: masculino de professora → sem código claro
- m3: mesa é feminino → sem código claro
- m4: livro é masculino → sem código claro
- m5: feminino de rei → sem código claro

**p6.5 Nomes próprios**
- m0: qual é nome próprio → EF02LP01
- m1: Lívia com maiúscula → EF02LP01
- m2: nome de cachorro é próprio → EF02LP01
- m3: qual é nome comum → EF02LP01
- m4: Bobby com maiúscula → EF02LP01
- m5: cidades começam com maiúscula → EF02LP01

**p7.1 Adjetivo: como é**
- m0: qual palavra diz como é → EF03LP09
- m1: adjetivo em "a bola vermelha" → EF03LP09
- m2: adjetivo em "o cachorro rápido" → EF03LP09
- m3: qual não é adjetivo → EF03LP09
- m4: é um adjetivo (verdadeiro) → EF03LP09
- m5: completar "A menina é ___" → EF03LP09

**p7.2 Verbo: o que faz**
- m0: qual é verbo → EF03LP08
- m1: verbo em "o gato dorme" → EF03LP08
- m2: qual não é verbo → EF03LP08
- m3: qual é a ação → EF03LP08
- m4: completar "O menino ___ na escola" → EF03LP08
- m5: pular é verbo → EF03LP08

**p7.3 Combinar direitinho**
- m0: a menina bonita → EF04LP07
- m1: os meninos altos → EF04LP07
- m2: as casas novas → EF04LP07
- m3: O carro é rápido → EF04LP07
- m4: As flores são bonitas → EF04LP07
- m5: "A menina alto" está errado → EF04LP07

**p7.4 Ontem, hoje e amanhã**
- m0: Ontem eu brinquei → EF05LP05, EF02LP17
- m1: Hoje eu estudo → EF05LP05
- m2: Amanhã eu vou jogar → EF05LP05
- m3: comi está no passado → EF05LP05
- m4: vou comer está no futuro → EF05LP05
- m5: como está no presente → EF05LP05

**p7.5 Montar frases completas**
- m0: qual é a frase completa → sem código claro
- m1: o que falta (a ação) → EF03LP08
- m2: o que falta (quem faz) → EF03LP08
- m3: qual frase tem adjetivo → EF03LP09
- m4: qual frase diz onde → sem código claro
- m5: é uma frase completa → sem código claro

**p8.1 Palavras com Ç**
- m0: coração → EF04LP01
- m1: açúcar → EF04LP01
- m2: completar CABEÇA → EF04LP01
- m3: Ç não vem antes de E → EF04LP01
- m4: laço → EF04LP01
- m5: qual está errado (maçe) → EF04LP01

**p8.2 G e J**
- m0: gelo → EF05LP01, EF35LP13
- m1: janela → EF05LP01, EF35LP13
- m2: viagem (-agem com G) → EF04LP08
- m3: girafa → EF05LP01, EF35LP13
- m4: completar CORAGEM → EF04LP08
- m5: -agem se escreve com G → EF04LP08

**p8.3 X e CH**
- m0: xícara → EF35LP13
- m1: chuva → EF35LP13
- m2: caixa → EF35LP13
- m3: mochila → EF35LP13
- m4: completar PEIXE → EF35LP13
- m5: depois de EN vai X → EF05LP01

**p8.4 S e Z no fim**
- m0: feliz → EF35LP13
- m1: país → EF35LP13
- m2: casinha (origem com S) → EF05LP01
- m3: luz → EF35LP13
- m4: completar RAPAZ → EF35LP13
- m5: casinha mantém o S da origem → EF05LP01

**p8.5 Palavras que confundem**
- m0: mais (quantidade) → EF35LP13
- m1: mas (oposição) → EF05LP07, EF35LP13
- m2: mau → EF35LP13
- m3: mal → EF35LP13
- m4: mais indica quantidade → EF35LP13
- m5: mau é o contrário de bom → EF35LP13

**p9.1 Para que serve o acento**
- m0: sabiá → EF03LP04, EF03LP06
- m1: café → EF03LP04
- m2: sílaba forte em café → EF03LP06
- m3: é ou e na frase → EF03LP04
- m4: acento muda o sentido → EF03LP06
- m5: avô → EF03LP04

**p9.2 O til e os sons nasais**
- m0: mão → EF02LP05, EF03LP01
- m1: pão → EF02LP05, EF03LP01
- m2: plural de pão → sem código claro
- m3: plural de limão → sem código claro
- m4: completar CORAÇÃO com Ç → EF04LP01
- m5: o til deixa o som nasal → EF02LP05

**p9.3 Palavras com acento agudo**
- m0: água → EF05LP03
- m1: história → EF05LP03
- m2: também → EF03LP04, EF05LP03
- m3: você → EF03LP04, EF05LP03
- m4: médico → EF05LP03
- m5: qual não leva acento → EF05LP03

**p9.4 A vírgula na lista**
- m0: lista com vírgulas → EF04LP05
- m1: para que serve a vírgula na lista → EF04LP05
- m2: antes do último item vai e → EF04LP05
- m3: vírgula não termina a frase → EF04LP05
- m4: Gosto de bola, boneca e livro → EF04LP05
- m5: quantas vírgulas → EF04LP05

**p9.5 Quando alguém fala**
- m0: sinal da fala do personagem → EF03LP07
- m1: sinal que anuncia a fala → EF03LP07
- m2: Ela disse: travessão Vamos! → EF03LP07, EF04LP05
- m3: dois-pontos anunciam lista → EF04LP05
- m4: travessão no começo da fala → EF03LP07
- m5: fala não começa com vírgula → EF03LP07

**p10.1 Ler um bilhete**
- m0: pergunta sobre um dos 3 textos → EF15LP03, EF12LP04
- m1: pergunta sobre um dos 3 textos → EF15LP03, EF12LP04
- m2: no fim do bilhete vem quem escreveu → EF02LP16
- m3: para que serve um bilhete → EF02LP16
- m4: pergunta sobre um dos 3 textos → EF15LP03, EF12LP04
- m5: bilhete costuma ser curto → EF02LP16

**p10.2 Ler uma instrução**
- m0: pergunta sobre um dos 3 textos → EF15LP03, EF03LP11
- m1: pergunta sobre um dos 3 textos → EF15LP03, EF03LP11
- m2: por que os passos são numerados → EF03LP16
- m3: o que vem primeiro na receita → EF03LP16
- m4: pergunta sobre um dos 3 textos → EF15LP03, EF03LP11
- m5: passos em qualquer ordem (falso) → EF03LP16

**p10.3 Ler uma historinha**
- m0: pergunta sobre um dos 3 textos → EF15LP03, EF15LP16
- m1: pergunta sobre um dos 3 textos → EF15LP03, EF15LP16
- m2: quem é o personagem → EF01LP26
- m3: o que é o cenário → EF01LP26
- m4: pergunta sobre um dos 3 textos → EF15LP03, EF15LP16
- m5: história pode ter mais de um personagem → EF01LP26

**p10.4 Achar a informação**
- m0: pergunta sobre um dos 3 textos → EF15LP03
- m1: pergunta sobre um dos 3 textos → EF15LP03
- m2: pergunta sobre um dos 3 textos → EF15LP03
- m3: "quem?" pede nome de pessoa ou bicho → EF15LP03
- m4: "onde?" pede lugar → EF15LP03
- m5: pergunta sobre um dos 3 textos → EF15LP03

**p10.5 Desafio final**
- m0: sorteia pergunta dos mundos 4 a 10 → revisão
- m1: sorteia pergunta dos mundos 4 a 10 → revisão
- m2: sorteia pergunta dos mundos 4 a 10 → revisão
- m3: pergunta sobre um dos 3 textos → EF15LP03
- m4: sorteia pergunta dos mundos 4 a 10 → revisão
- m5: pergunta sobre um dos 3 textos → EF15LP03

## Fases de Inglês
A BNCC só traz Língua Inglesa a partir do 6º ano (11 anos). Para criança de 7 a 10 anos, TODA fase de inglês é "fora da BNCC, extra" e o relatório não cita código. Os códigos abaixo valem só para 11 e 12 anos e, mesmo assim, são de repertório lexical e convívio social (EF06LI16, EF06LI17): o app não trabalha oralidade, escrita de textos nem leitura de texto em inglês, que são a maior parte do 6º ano.

| Fase | Título | Status | Códigos | Observação |
|---|---|---|---|---|
| e1.1 | Hello and hi | fora da BNCC, extra (7 a 10 anos); mapeada (11 a 12 anos) | EF06LI16 |  |
| e1.2 | Good morning, good night | fora da BNCC, extra (7 a 10 anos); mapeada (11 a 12 anos) | EF06LI16 |  |
| e1.3 | Please and thank you | fora da BNCC, extra (7 a 10 anos); mapeada (11 a 12 anos) | EF06LI16 |  |
| e1.4 | My name is... | fora da BNCC, extra (7 a 10 anos); mapeada (11 a 12 anos) | EF06LI16, EF06LI05 |  |
| e1.5 | One, two, three | fora da BNCC, extra (7 a 10 anos); mapeada (11 a 12 anos) | EF06LI17 | Números em inglês não são nomeados na BNCC; EF06LI17 (repertório lexical de temas familiares) é a correspondência genérica. |
| e2.1 | Red, blue, green | fora da BNCC, extra (7 a 10 anos); mapeada (11 a 12 anos) | EF06LI17 |  |
| e2.2 | Yellow, black, white | fora da BNCC, extra (7 a 10 anos); mapeada (11 a 12 anos) | EF06LI17 |  |
| e2.3 | Orange, purple, pink | fora da BNCC, extra (7 a 10 anos); mapeada (11 a 12 anos) | EF06LI17 |  |
| e2.4 | Book and pencil | fora da BNCC, extra (7 a 10 anos); mapeada (11 a 12 anos) | EF06LI17 |  |
| e2.5 | School and teacher | fora da BNCC, extra (7 a 10 anos); mapeada (11 a 12 anos) | EF06LI17 |  |
| e3.1 | Mother and father | fora da BNCC, extra (7 a 10 anos); mapeada (11 a 12 anos) | EF06LI17 |  |
| e3.2 | Sister and brother | fora da BNCC, extra (7 a 10 anos); mapeada (11 a 12 anos) | EF06LI17 |  |
| e3.3 | Grandmother, grandfather | fora da BNCC, extra (7 a 10 anos); mapeada (11 a 12 anos) | EF06LI17 |  |
| e3.4 | Family and friends | fora da BNCC, extra (7 a 10 anos); mapeada (11 a 12 anos) | EF06LI17 |  |
| e3.5 | Boy, girl, baby | fora da BNCC, extra (7 a 10 anos); mapeada (11 a 12 anos) | EF06LI17 |  |
| e4.1 | Dog and cat | fora da BNCC, extra (7 a 10 anos); mapeada (11 a 12 anos) | EF06LI17 |  |
| e4.2 | Bird and fish | fora da BNCC, extra (7 a 10 anos); mapeada (11 a 12 anos) | EF06LI17 |  |
| e4.3 | Farm animals | fora da BNCC, extra (7 a 10 anos); mapeada (11 a 12 anos) | EF06LI17 |  |
| e4.4 | Wild animals | fora da BNCC, extra (7 a 10 anos); mapeada (11 a 12 anos) | EF06LI17 |  |
| e4.5 | Bear and rabbit | fora da BNCC, extra (7 a 10 anos); mapeada (11 a 12 anos) | EF06LI17 |  |
| e5.1 | Water and milk | fora da BNCC, extra (7 a 10 anos); mapeada (11 a 12 anos) | EF06LI17 |  |
| e5.2 | Bread and cheese | fora da BNCC, extra (7 a 10 anos); mapeada (11 a 12 anos) | EF06LI17 |  |
| e5.3 | Fruits | fora da BNCC, extra (7 a 10 anos); mapeada (11 a 12 anos) | EF06LI17 |  |
| e5.4 | Cake and candy | fora da BNCC, extra (7 a 10 anos); mapeada (11 a 12 anos) | EF06LI17 |  |
| e5.5 | Breakfast and dinner | fora da BNCC, extra (7 a 10 anos); mapeada (11 a 12 anos) | EF06LI17 |  |
| e6.1 | Head and hands | fora da BNCC, extra (7 a 10 anos); mapeada (11 a 12 anos) | EF06LI17 |  |
| e6.2 | Face | fora da BNCC, extra (7 a 10 anos); mapeada (11 a 12 anos) | EF06LI17 |  |
| e6.3 | Shirt and shoes | fora da BNCC, extra (7 a 10 anos); mapeada (11 a 12 anos) | EF06LI17 |  |
| e6.4 | Dress and hat | fora da BNCC, extra (7 a 10 anos); mapeada (11 a 12 anos) | EF06LI17 |  |
| e6.5 | Getting dressed | fora da BNCC, extra (7 a 10 anos); mapeada (11 a 12 anos) | EF06LI17 |  |
| e7.1 | House and door | fora da BNCC, extra (7 a 10 anos); mapeada (11 a 12 anos) | EF06LI17 |  |
| e7.2 | Kitchen and bedroom | fora da BNCC, extra (7 a 10 anos); mapeada (11 a 12 anos) | EF06LI17 |  |
| e7.3 | Table and chair | fora da BNCC, extra (7 a 10 anos); mapeada (11 a 12 anos) | EF06LI17 |  |
| e7.4 | Garden and rooms | fora da BNCC, extra (7 a 10 anos); mapeada (11 a 12 anos) | EF06LI17 |  |
| e7.5 | Key and light | fora da BNCC, extra (7 a 10 anos); mapeada (11 a 12 anos) | EF06LI17 |  |
| e8.1 | Run, eat, drink | fora da BNCC, extra (7 a 10 anos); mapeada (11 a 12 anos) | EF06LI17 |  |
| e8.2 | Sleep and play | fora da BNCC, extra (7 a 10 anos); mapeada (11 a 12 anos) | EF06LI17 |  |
| e8.3 | Read and write | fora da BNCC, extra (7 a 10 anos); mapeada (11 a 12 anos) | EF06LI17 |  |
| e8.4 | Walk, sing, jump | fora da BNCC, extra (7 a 10 anos); mapeada (11 a 12 anos) | EF06LI17 |  |
| e8.5 | I can, I like | fora da BNCC, extra (7 a 10 anos); mapeada (11 a 12 anos) | EF06LI05, EF06LI17 | "I like" e "I can" tocam gostos e preferências (EF06LI05); o verbo modal can é habilidade do 7º ano (EF07LI20). |
| e9.1 | What and where | fora da BNCC, extra (7 a 10 anos); mapeada (11 a 12 anos) | EF06LI02 |  |
| e9.2 | Who and when | fora da BNCC, extra (7 a 10 anos); mapeada (11 a 12 anos) | EF06LI02 |  |
| e9.3 | How many | fora da BNCC, extra (7 a 10 anos); mapeada (11 a 12 anos) | EF06LI02 |  |
| e9.4 | How are you? | fora da BNCC, extra (7 a 10 anos); mapeada (11 a 12 anos) | EF06LI16, EF06LI02 | Pergunta e resposta de convívio social (EF06LI16). O app não tem produção oral, então EF06LI01 (interagir oralmente) não se aplica. |
| e9.5 | How old are you? | fora da BNCC, extra (7 a 10 anos); mapeada (11 a 12 anos) | EF06LI05, EF06LI02 |  |
| e10.1 | Yesterday, today, tomorrow | fora da BNCC, extra (7 a 10 anos); sem código claro (11 a 12 anos) | (nenhum) | Passado simples (-ed) é habilidade do 7º ano (EF07LI18, EF07LI15, EF07LI16), não do 6º. Futuro com will não aparece do 6º ao 9º ano. Para 11 anos (6º ano) é conteúdo adiantado; para 12 anos (7º ano) cabe EF07LI18. |
| e10.2 | Frases do dia a dia | fora da BNCC, extra (7 a 10 anos); mapeada (11 a 12 anos) | EF06LI16 |  |
| e10.3 | Pedir e agradecer | fora da BNCC, extra (7 a 10 anos); mapeada (11 a 12 anos) | EF06LI16 |  |
| e10.4 | Palavras iguais e falsas | fora da BNCC, extra (7 a 10 anos); mapeada (11 a 12 anos) | EF06LI08, EF06LI04 | A BNCC trata cognatos como apoio à compreensão de textos (EF06LI04 oral, EF06LI08 escrito); o app trabalha a palavra isolada. Correspondência parcial. |
| e10.5 | Final challenge | fora da BNCC, extra (7 a 10 anos); revisão (11 a 12 anos) | (nenhum) | Fase de revisão: herda o código da fase de origem. |

### Detalhe por maker (ordem do array em src/conteudo)

**e1.1 Hello and hi**
- m0: como se diz X em inglês (escolha) → EF06LI16
- m1: o que significa X (escolha) → EF06LI16
- m2: ouvir e escolher a palavra → EF06LI16, EF06LI18
- m3: escrever a palavra em inglês → EF06LI16
- m4: ouvir com atenção e escolher → EF06LI16, EF06LI18
- m5: qual é a tradução (escolha) → EF06LI16

**e1.2 Good morning, good night**
- m0: como se diz X em inglês (escolha) → EF06LI16
- m1: o que significa X (escolha) → EF06LI16
- m2: ouvir e escolher a palavra → EF06LI16, EF06LI18
- m3: escrever a palavra em inglês → EF06LI16
- m4: ouvir com atenção e escolher → EF06LI16, EF06LI18
- m5: qual é a tradução (escolha) → EF06LI16

**e1.3 Please and thank you**
- m0: como se diz X em inglês (escolha) → EF06LI16
- m1: o que significa X (escolha) → EF06LI16
- m2: ouvir e escolher a palavra → EF06LI16, EF06LI18
- m3: escrever a palavra em inglês → EF06LI16
- m4: ouvir com atenção e escolher → EF06LI16, EF06LI18
- m5: qual é a tradução (escolha) → EF06LI16

**e1.4 My name is...**
- m0: como se diz X em inglês (escolha) → EF06LI16, EF06LI05
- m1: o que significa X (escolha) → EF06LI16, EF06LI05
- m2: ouvir e escolher a palavra → EF06LI16, EF06LI05, EF06LI18
- m3: escrever a palavra em inglês → EF06LI16, EF06LI05
- m4: ouvir com atenção e escolher → EF06LI16, EF06LI05, EF06LI18
- m5: qual é a tradução (escolha) → EF06LI16, EF06LI05

**e1.5 One, two, three**
- m0: como se diz X em inglês (escolha) → EF06LI17
- m1: o que significa X (escolha) → EF06LI17
- m2: ouvir e escolher a palavra → EF06LI17, EF06LI18
- m3: escrever a palavra em inglês → EF06LI17
- m4: ouvir com atenção e escolher → EF06LI17, EF06LI18
- m5: qual é a tradução (escolha) → EF06LI17

**e2.1 Red, blue, green**
- m0: como se diz X em inglês (escolha) → EF06LI17
- m1: o que significa X (escolha) → EF06LI17
- m2: ouvir e escolher a palavra → EF06LI17, EF06LI18
- m3: escrever a palavra em inglês → EF06LI17
- m4: ouvir com atenção e escolher → EF06LI17, EF06LI18
- m5: qual é a tradução (escolha) → EF06LI17

**e2.2 Yellow, black, white**
- m0: como se diz X em inglês (escolha) → EF06LI17
- m1: o que significa X (escolha) → EF06LI17
- m2: ouvir e escolher a palavra → EF06LI17, EF06LI18
- m3: escrever a palavra em inglês → EF06LI17
- m4: ouvir com atenção e escolher → EF06LI17, EF06LI18
- m5: qual é a tradução (escolha) → EF06LI17

**e2.3 Orange, purple, pink**
- m0: como se diz X em inglês (escolha) → EF06LI17
- m1: o que significa X (escolha) → EF06LI17
- m2: ouvir e escolher a palavra → EF06LI17, EF06LI18
- m3: escrever a palavra em inglês → EF06LI17
- m4: ouvir com atenção e escolher → EF06LI17, EF06LI18
- m5: qual é a tradução (escolha) → EF06LI17

**e2.4 Book and pencil**
- m0: como se diz X em inglês (escolha) → EF06LI17
- m1: o que significa X (escolha) → EF06LI17
- m2: ouvir e escolher a palavra → EF06LI17, EF06LI18
- m3: escrever a palavra em inglês → EF06LI17
- m4: ouvir com atenção e escolher → EF06LI17, EF06LI18
- m5: qual é a tradução (escolha) → EF06LI17

**e2.5 School and teacher**
- m0: como se diz X em inglês (escolha) → EF06LI17
- m1: o que significa X (escolha) → EF06LI17
- m2: ouvir e escolher a palavra → EF06LI17, EF06LI18
- m3: escrever a palavra em inglês → EF06LI17
- m4: ouvir com atenção e escolher → EF06LI17, EF06LI18
- m5: qual é a tradução (escolha) → EF06LI17

**e3.1 Mother and father**
- m0: como se diz X em inglês (escolha) → EF06LI17
- m1: o que significa X (escolha) → EF06LI17
- m2: ouvir e escolher a palavra → EF06LI17, EF06LI18
- m3: escrever a palavra em inglês → EF06LI17
- m4: ouvir com atenção e escolher → EF06LI17, EF06LI18
- m5: qual é a tradução (escolha) → EF06LI17

**e3.2 Sister and brother**
- m0: como se diz X em inglês (escolha) → EF06LI17
- m1: o que significa X (escolha) → EF06LI17
- m2: ouvir e escolher a palavra → EF06LI17, EF06LI18
- m3: escrever a palavra em inglês → EF06LI17
- m4: ouvir com atenção e escolher → EF06LI17, EF06LI18
- m5: qual é a tradução (escolha) → EF06LI17

**e3.3 Grandmother, grandfather**
- m0: como se diz X em inglês (escolha) → EF06LI17
- m1: o que significa X (escolha) → EF06LI17
- m2: ouvir e escolher a palavra → EF06LI17, EF06LI18
- m3: escrever a palavra em inglês → EF06LI17
- m4: ouvir com atenção e escolher → EF06LI17, EF06LI18
- m5: qual é a tradução (escolha) → EF06LI17

**e3.4 Family and friends**
- m0: como se diz X em inglês (escolha) → EF06LI17
- m1: o que significa X (escolha) → EF06LI17
- m2: ouvir e escolher a palavra → EF06LI17, EF06LI18
- m3: escrever a palavra em inglês → EF06LI17
- m4: ouvir com atenção e escolher → EF06LI17, EF06LI18
- m5: qual é a tradução (escolha) → EF06LI17

**e3.5 Boy, girl, baby**
- m0: como se diz X em inglês (escolha) → EF06LI17
- m1: o que significa X (escolha) → EF06LI17
- m2: ouvir e escolher a palavra → EF06LI17, EF06LI18
- m3: escrever a palavra em inglês → EF06LI17
- m4: ouvir com atenção e escolher → EF06LI17, EF06LI18
- m5: qual é a tradução (escolha) → EF06LI17

**e4.1 Dog and cat**
- m0: como se diz X em inglês (escolha) → EF06LI17
- m1: o que significa X (escolha) → EF06LI17
- m2: ouvir e escolher a palavra → EF06LI17, EF06LI18
- m3: escrever a palavra em inglês → EF06LI17
- m4: ouvir com atenção e escolher → EF06LI17, EF06LI18
- m5: qual é a tradução (escolha) → EF06LI17

**e4.2 Bird and fish**
- m0: como se diz X em inglês (escolha) → EF06LI17
- m1: o que significa X (escolha) → EF06LI17
- m2: ouvir e escolher a palavra → EF06LI17, EF06LI18
- m3: escrever a palavra em inglês → EF06LI17
- m4: ouvir com atenção e escolher → EF06LI17, EF06LI18
- m5: qual é a tradução (escolha) → EF06LI17

**e4.3 Farm animals**
- m0: como se diz X em inglês (escolha) → EF06LI17
- m1: o que significa X (escolha) → EF06LI17
- m2: ouvir e escolher a palavra → EF06LI17, EF06LI18
- m3: escrever a palavra em inglês → EF06LI17
- m4: ouvir com atenção e escolher → EF06LI17, EF06LI18
- m5: qual é a tradução (escolha) → EF06LI17

**e4.4 Wild animals**
- m0: como se diz X em inglês (escolha) → EF06LI17
- m1: o que significa X (escolha) → EF06LI17
- m2: ouvir e escolher a palavra → EF06LI17, EF06LI18
- m3: escrever a palavra em inglês → EF06LI17
- m4: ouvir com atenção e escolher → EF06LI17, EF06LI18
- m5: qual é a tradução (escolha) → EF06LI17

**e4.5 Bear and rabbit**
- m0: como se diz X em inglês (escolha) → EF06LI17
- m1: o que significa X (escolha) → EF06LI17
- m2: ouvir e escolher a palavra → EF06LI17, EF06LI18
- m3: escrever a palavra em inglês → EF06LI17
- m4: ouvir com atenção e escolher → EF06LI17, EF06LI18
- m5: qual é a tradução (escolha) → EF06LI17

**e5.1 Water and milk**
- m0: como se diz X em inglês (escolha) → EF06LI17
- m1: o que significa X (escolha) → EF06LI17
- m2: ouvir e escolher a palavra → EF06LI17, EF06LI18
- m3: escrever a palavra em inglês → EF06LI17
- m4: ouvir com atenção e escolher → EF06LI17, EF06LI18
- m5: qual é a tradução (escolha) → EF06LI17

**e5.2 Bread and cheese**
- m0: como se diz X em inglês (escolha) → EF06LI17
- m1: o que significa X (escolha) → EF06LI17
- m2: ouvir e escolher a palavra → EF06LI17, EF06LI18
- m3: escrever a palavra em inglês → EF06LI17
- m4: ouvir com atenção e escolher → EF06LI17, EF06LI18
- m5: qual é a tradução (escolha) → EF06LI17

**e5.3 Fruits**
- m0: como se diz X em inglês (escolha) → EF06LI17
- m1: o que significa X (escolha) → EF06LI17
- m2: ouvir e escolher a palavra → EF06LI17, EF06LI18
- m3: escrever a palavra em inglês → EF06LI17
- m4: ouvir com atenção e escolher → EF06LI17, EF06LI18
- m5: qual é a tradução (escolha) → EF06LI17

**e5.4 Cake and candy**
- m0: como se diz X em inglês (escolha) → EF06LI17
- m1: o que significa X (escolha) → EF06LI17
- m2: ouvir e escolher a palavra → EF06LI17, EF06LI18
- m3: escrever a palavra em inglês → EF06LI17
- m4: ouvir com atenção e escolher → EF06LI17, EF06LI18
- m5: qual é a tradução (escolha) → EF06LI17

**e5.5 Breakfast and dinner**
- m0: como se diz X em inglês (escolha) → EF06LI17
- m1: o que significa X (escolha) → EF06LI17
- m2: ouvir e escolher a palavra → EF06LI17, EF06LI18
- m3: escrever a palavra em inglês → EF06LI17
- m4: ouvir com atenção e escolher → EF06LI17, EF06LI18
- m5: qual é a tradução (escolha) → EF06LI17

**e6.1 Head and hands**
- m0: como se diz X em inglês (escolha) → EF06LI17
- m1: o que significa X (escolha) → EF06LI17
- m2: ouvir e escolher a palavra → EF06LI17, EF06LI18
- m3: escrever a palavra em inglês → EF06LI17
- m4: ouvir com atenção e escolher → EF06LI17, EF06LI18
- m5: qual é a tradução (escolha) → EF06LI17

**e6.2 Face**
- m0: como se diz X em inglês (escolha) → EF06LI17
- m1: o que significa X (escolha) → EF06LI17
- m2: ouvir e escolher a palavra → EF06LI17, EF06LI18
- m3: escrever a palavra em inglês → EF06LI17
- m4: ouvir com atenção e escolher → EF06LI17, EF06LI18
- m5: qual é a tradução (escolha) → EF06LI17

**e6.3 Shirt and shoes**
- m0: como se diz X em inglês (escolha) → EF06LI17
- m1: o que significa X (escolha) → EF06LI17
- m2: ouvir e escolher a palavra → EF06LI17, EF06LI18
- m3: escrever a palavra em inglês → EF06LI17
- m4: ouvir com atenção e escolher → EF06LI17, EF06LI18
- m5: qual é a tradução (escolha) → EF06LI17

**e6.4 Dress and hat**
- m0: como se diz X em inglês (escolha) → EF06LI17
- m1: o que significa X (escolha) → EF06LI17
- m2: ouvir e escolher a palavra → EF06LI17, EF06LI18
- m3: escrever a palavra em inglês → EF06LI17
- m4: ouvir com atenção e escolher → EF06LI17, EF06LI18
- m5: qual é a tradução (escolha) → EF06LI17

**e6.5 Getting dressed**
- m0: como se diz X em inglês (escolha) → EF06LI17
- m1: o que significa X (escolha) → EF06LI17
- m2: ouvir e escolher a palavra → EF06LI17, EF06LI18
- m3: escrever a palavra em inglês → EF06LI17
- m4: ouvir com atenção e escolher → EF06LI17, EF06LI18
- m5: qual é a tradução (escolha) → EF06LI17

**e7.1 House and door**
- m0: como se diz X em inglês (escolha) → EF06LI17
- m1: o que significa X (escolha) → EF06LI17
- m2: ouvir e escolher a palavra → EF06LI17, EF06LI18
- m3: escrever a palavra em inglês → EF06LI17
- m4: ouvir com atenção e escolher → EF06LI17, EF06LI18
- m5: qual é a tradução (escolha) → EF06LI17

**e7.2 Kitchen and bedroom**
- m0: como se diz X em inglês (escolha) → EF06LI17
- m1: o que significa X (escolha) → EF06LI17
- m2: ouvir e escolher a palavra → EF06LI17, EF06LI18
- m3: escrever a palavra em inglês → EF06LI17
- m4: ouvir com atenção e escolher → EF06LI17, EF06LI18
- m5: qual é a tradução (escolha) → EF06LI17

**e7.3 Table and chair**
- m0: como se diz X em inglês (escolha) → EF06LI17
- m1: o que significa X (escolha) → EF06LI17
- m2: ouvir e escolher a palavra → EF06LI17, EF06LI18
- m3: escrever a palavra em inglês → EF06LI17
- m4: ouvir com atenção e escolher → EF06LI17, EF06LI18
- m5: qual é a tradução (escolha) → EF06LI17

**e7.4 Garden and rooms**
- m0: como se diz X em inglês (escolha) → EF06LI17
- m1: o que significa X (escolha) → EF06LI17
- m2: ouvir e escolher a palavra → EF06LI17, EF06LI18
- m3: escrever a palavra em inglês → EF06LI17
- m4: ouvir com atenção e escolher → EF06LI17, EF06LI18
- m5: qual é a tradução (escolha) → EF06LI17

**e7.5 Key and light**
- m0: como se diz X em inglês (escolha) → EF06LI17
- m1: o que significa X (escolha) → EF06LI17
- m2: ouvir e escolher a palavra → EF06LI17, EF06LI18
- m3: escrever a palavra em inglês → EF06LI17
- m4: ouvir com atenção e escolher → EF06LI17, EF06LI18
- m5: qual é a tradução (escolha) → EF06LI17

**e8.1 Run, eat, drink**
- m0: como se diz X em inglês (escolha) → EF06LI17
- m1: o que significa X (escolha) → EF06LI17
- m2: ouvir e escolher a palavra → EF06LI17, EF06LI18
- m3: escrever a palavra em inglês → EF06LI17
- m4: ouvir com atenção e escolher → EF06LI17, EF06LI18
- m5: qual é a tradução (escolha) → EF06LI17

**e8.2 Sleep and play**
- m0: como se diz X em inglês (escolha) → EF06LI17
- m1: o que significa X (escolha) → EF06LI17
- m2: ouvir e escolher a palavra → EF06LI17, EF06LI18
- m3: escrever a palavra em inglês → EF06LI17
- m4: ouvir com atenção e escolher → EF06LI17, EF06LI18
- m5: qual é a tradução (escolha) → EF06LI17

**e8.3 Read and write**
- m0: como se diz X em inglês (escolha) → EF06LI17
- m1: o que significa X (escolha) → EF06LI17
- m2: ouvir e escolher a palavra → EF06LI17, EF06LI18
- m3: escrever a palavra em inglês → EF06LI17
- m4: ouvir com atenção e escolher → EF06LI17, EF06LI18
- m5: qual é a tradução (escolha) → EF06LI17

**e8.4 Walk, sing, jump**
- m0: como se diz X em inglês (escolha) → EF06LI17
- m1: o que significa X (escolha) → EF06LI17
- m2: ouvir e escolher a palavra → EF06LI17, EF06LI18
- m3: escrever a palavra em inglês → EF06LI17
- m4: ouvir com atenção e escolher → EF06LI17, EF06LI18
- m5: qual é a tradução (escolha) → EF06LI17

**e8.5 I can, I like**
- m0: como se diz X em inglês (escolha) → EF06LI05, EF06LI17
- m1: o que significa X (escolha) → EF06LI05, EF06LI17
- m2: ouvir e escolher a palavra → EF06LI05, EF06LI17, EF06LI18
- m3: escrever a palavra em inglês → EF06LI05, EF06LI17
- m4: ouvir com atenção e escolher → EF06LI05, EF06LI17, EF06LI18
- m5: qual é a tradução (escolha) → EF06LI05, EF06LI17

**e9.1 What and where**
- m0: como se diz X em inglês (escolha) → EF06LI02
- m1: o que significa X (escolha) → EF06LI02
- m2: ouvir e escolher a palavra → EF06LI02, EF06LI18
- m3: escrever a palavra em inglês → EF06LI02
- m4: ouvir com atenção e escolher → EF06LI02, EF06LI18
- m5: qual é a tradução (escolha) → EF06LI02

**e9.2 Who and when**
- m0: como se diz X em inglês (escolha) → EF06LI02
- m1: o que significa X (escolha) → EF06LI02
- m2: ouvir e escolher a palavra → EF06LI02, EF06LI18
- m3: escrever a palavra em inglês → EF06LI02
- m4: ouvir com atenção e escolher → EF06LI02, EF06LI18
- m5: qual é a tradução (escolha) → EF06LI02

**e9.3 How many**
- m0: como se diz X em inglês (escolha) → EF06LI02
- m1: o que significa X (escolha) → EF06LI02
- m2: ouvir e escolher a palavra → EF06LI02, EF06LI18
- m3: escrever a palavra em inglês → EF06LI02
- m4: ouvir com atenção e escolher → EF06LI02, EF06LI18
- m5: qual é a tradução (escolha) → EF06LI02

**e9.4 How are you?**
- m0: como se diz X em inglês (escolha) → EF06LI16, EF06LI02
- m1: o que significa X (escolha) → EF06LI16, EF06LI02
- m2: ouvir e escolher a palavra → EF06LI16, EF06LI02, EF06LI18
- m3: escrever a palavra em inglês → EF06LI16, EF06LI02
- m4: ouvir com atenção e escolher → EF06LI16, EF06LI02, EF06LI18
- m5: qual é a tradução (escolha) → EF06LI16, EF06LI02

**e9.5 How old are you?**
- m0: como se diz X em inglês (escolha) → EF06LI05, EF06LI02
- m1: o que significa X (escolha) → EF06LI05, EF06LI02
- m2: ouvir e escolher a palavra → EF06LI05, EF06LI02, EF06LI18
- m3: escrever a palavra em inglês → EF06LI05, EF06LI02
- m4: ouvir com atenção e escolher → EF06LI05, EF06LI02, EF06LI18
- m5: qual é a tradução (escolha) → EF06LI05, EF06LI02

**e10.1 Yesterday, today, tomorrow**
- m0: Yesterday I played → sem código claro
- m1: Tomorrow I will study → sem código claro
- m2: o que significa yesterday → EF06LI17
- m3: o que significa tomorrow → EF06LI17
- m4: walk no passado → sem código claro
- m5: ouvir today → EF06LI17

**e10.2 Frases do dia a dia**
- m0: o que significa a frase → EF06LI16
- m1: como se diz a frase → EF06LI16
- m2: ouvir a frase e escolher → EF06LI16
- m3: resposta a What's up? → EF06LI16
- m4: I'm hungry → EF06LI16
- m5: quando se usa a frase → EF06LI16

**e10.3 Pedir e agradecer**
- m0: Can I have some water, please? → EF06LI16
- m1: How much is it? → EF06LI16
- m2: Excuse me → EF06LI16
- m3: ouvir thank you → EF06LI16
- m4: Thank you! → EF06LI16
- m5: I need help → EF06LI16, EF06LI03

**e10.4 Palavras iguais e falsas**
- m0: o que significa o cognato → EF06LI08
- m1: parents → EF06LI08
- m2: actually → EF06LI08
- m3: library → EF06LI08
- m4: push → EF06LI08
- m5: qual é quase igual em português → EF06LI08, EF06LI04

**e10.5 Final challenge**
- m0: sorteia pergunta de qualquer mundo → revisão
- m1: sorteia pergunta de qualquer mundo → revisão
- m2: sorteia pergunta de qualquer mundo → revisão
- m3: sorteia pergunta de qualquer mundo → revisão
- m4: sorteia pergunta de qualquer mundo → revisão
- m5: sorteia pergunta de qualquer mundo → revisão

## Códigos usados, com o texto oficial
- **EF01LP02** (Língua Portuguesa, 1º ano; Escrita (compartilhada e autônoma) · TODOS OS CAMPOS DE ATUAÇÃO; objeto: Correspondência fonema-grafema; PDF p. 101): Escrever, espontaneamente ou por ditado, palavras e frases de forma alfabética – usando letras/grafemas que representem fonemas. [fases: p2.5, p3.1, p3.2, p3.4]
- **EF01LP06** (Língua Portuguesa, 1º ano; Análise linguística/semiótica (Alfabetização) · TODOS OS CAMPOS DE ATUAÇÃO; objeto: Construção do sistema alfabético e da ortografia; PDF p. 101): Segmentar oralmente palavras em sílabas. [fases: p2.1]
- **EF01LP07** (Língua Portuguesa, 1º ano; Análise linguística/semiótica (Alfabetização) · TODOS OS CAMPOS DE ATUAÇÃO; objeto: Construção do sistema alfabético e da ortografia; PDF p. 101): Identificar fonemas e sua representação por letras. [fases: p1.1, p1.2, p1.4]
- **EF01LP08** (Língua Portuguesa, 1º ano; Análise linguística/semiótica (Alfabetização) · TODOS OS CAMPOS DE ATUAÇÃO; objeto: Construção do sistema alfabético e da ortografia; PDF p. 103): Relacionar elementos sonoros (sílabas, fonemas, partes de palavras) com sua representação escrita. [fases: p2.2, p2.3, p2.4, p3.1, p3.3, p3.4]
- **EF01LP09** (Língua Portuguesa, 1º ano; Análise linguística/semiótica (Alfabetização) · TODOS OS CAMPOS DE ATUAÇÃO; objeto: Construção do sistema alfabético e da ortografia; PDF p. 103): Comparar palavras, identificando semelhanças e diferenças entre sons de sílabas iniciais. [fases: p1.4, p2.2, p3.3, p3.5]
- **EF01LP10** (Língua Portuguesa, 1º ano; Análise linguística/semiótica (Alfabetização) · TODOS OS CAMPOS DE ATUAÇÃO; objeto: Conhecimento do alfabeto do português do Brasil; PDF p. 103): Nomear as letras do alfabeto e recitá-lo na ordem das letras. [fases: p1.1, p1.2, p1.5]
- **EF01LP11** (Língua Portuguesa, 1º ano; Análise linguística/semiótica (Alfabetização) · TODOS OS CAMPOS DE ATUAÇÃO; objeto: Conhecimento das diversas grafias do alfabeto/ Acentuação; PDF p. 103): Conhecer, diferenciar e relacionar letras em formato imprensa e cursiva, maiúsculas e minúsculas. [fases: p1.3]
- **EF01LP13** (Língua Portuguesa, 1º ano; Análise linguística/semiótica (Alfabetização) · TODOS OS CAMPOS DE ATUAÇÃO; objeto: Construção do sistema alfabético; PDF p. 103): Comparar palavras, identificando semelhanças e diferenças entre sons de sílabas mediais e finais. [fases: p1.4, p3.5]
- **EF01LP14** (Língua Portuguesa, 1º ano; Análise linguística/semiótica (Alfabetização) · TODOS OS CAMPOS DE ATUAÇÃO; objeto: Pontuação; PDF p. 103): Identificar outros sinais no texto além das letras, como pontos finais, de interrogação e exclamação e seus efeitos na entonação. [fases: p5.4]
- **EF01LP26** (Língua Portuguesa, 1º ano; Análise linguística/semiótica (Alfabetização) · CAMPO ARTÍSTICO-LITERÁRIO – Campo de atuação relativo à participação em situações de leitura, fruição e produção de textos literários e artísticos, representativos da diversidade cultural e linguística, que favoreçam experiências estéticas. Alguns gêneros deste campo: lendas, mitos, fábulas, contos, crônicas, canção, poemas, poemas visuais, cordéis, quadrinhos, tirinhas, charge/ cartum, dentre outros.; objeto: Formas de composição de narrativas; PDF p. 113): Identificar elementos de uma narrativa lida ou escutada, incluindo personagens, enredo, tempo e espaço. [fases: p10.3]
- **EF01MA02** (Matemática, 1º ano; Números; objeto: Quantificação de elementos de uma coleção: estimativas, contagem um a um, pareamento ou outros agrupamentos e comparação; PDF p. 281): Contar de maneira exata ou aproximada, utilizando diferentes estratégias como o pareamento e outros agrupamentos. [fases: 1.1]
- **EF01MA04** (Matemática, 1º ano; Números; objeto: Leitura, escrita e comparação de números naturais (até 100); PDF p. 281): Contar a quantidade de objetos de coleções até 100 unidades e apresentar o resultado por registros verbais e simbólicos, em situações de seu interesse, como jogos, brincadeiras, materiais da sala de aula, entre outros. [fases: 1.1]
- **EF01MA05** (Matemática, 1º ano; Números; objeto: Reta numérica; PDF p. 281): Comparar números naturais de até duas ordens em situações cotidianas, com e sem suporte da reta numérica. [fases: 1.2]
- **EF01MA06** (Matemática, 1º ano; Números; objeto: Construção de fatos básicos da adição; PDF p. 281): Construir fatos básicos da adição e utilizá-los em procedimentos de cálculo para resolver problemas. [fases: 2.1]
- **EF01MA07** (Matemática, 1º ano; Números; objeto: Composição e decomposição de números naturais; PDF p. 281): Compor e decompor número de até duas ordens, por meio de diferentes adições, com o suporte de material manipulável, contribuindo para a compreensão de características do sistema de numeração decimal e o desenvolvimento de estratégias de cálculo. [fases: 1.3]
- **EF01MA08** (Matemática, 1º ano; Números; objeto: Problemas envolvendo diferentes significados da adição e da subtração (juntar, acrescentar, separar, retirar); PDF p. 281): Resolver e elaborar problemas de adição e de subtração, envolvendo números de até dois algarismos, com os significados de juntar, acrescentar, separar e retirar, com o suporte de imagens e/ou material manipulável, utilizando estratégias e formas de registro pessoais. [fases: 1.1, 2.1]
- **EF01MA10** (Matemática, 1º ano; Álgebra; objeto: Sequências recursivas: observação de regras usadas utilizadas em seriações numéricas (mais 1, mais 2, menos 1, menos 2, por exemplo); PDF p. 281): Descrever, após o reconhecimento e a explicitação de um padrão (ou regularidade), os elementos ausentes em sequências recursivas de números naturais, objetos ou figuras. [fases: 1.1]
- **EF02LP01** (Língua Portuguesa, 2º ano; Escrita (compartilhada e autônoma) · TODOS OS CAMPOS DE ATUAÇÃO; objeto: Construção do sistema alfabético/ Convenções da escrita; PDF p. 101): Utilizar, ao produzir o texto, grafia correta de palavras conhecidas ou com estruturas silábicas já dominadas, letras maiúsculas em início de frases e em substantivos próprios, segmentação entre as palavras, ponto final, ponto de interrogação e ponto de exclamação. [fases: p1.3, p5.2, p6.5]
- **EF02LP02** (Língua Portuguesa, 2º ano; Análise linguística/semiótica (Alfabetização) · TODOS OS CAMPOS DE ATUAÇÃO; objeto: Construção do sistema alfabético e da ortografia; PDF p. 101): Segmentar palavras em sílabas e remover e substituir sílabas iniciais, mediais ou finais para criar novas palavras. [fases: p2.1, p2.3, p2.5, p3.2, p3.3, p3.4, p4.4]
- **EF02LP03** (Língua Portuguesa, 2º ano; Análise linguística/semiótica (Alfabetização) · TODOS OS CAMPOS DE ATUAÇÃO; objeto: Construção do sistema alfabético e da ortografia; PDF p. 101): Ler e escrever palavras com correspondências regulares diretas entre letras e fonemas (f, v, t, d, p, b) e correspondências regulares contextuais (c e q; e e o, em posição átona em final de palavra). [fases: p2.2, p2.3, p2.4, p4.1]
- **EF02LP04** (Língua Portuguesa, 2º ano; Análise linguística/semiótica (Alfabetização) · TODOS OS CAMPOS DE ATUAÇÃO; objeto: Construção do sistema alfabético e da ortografia; PDF p. 103): Ler e escrever corretamente palavras com sílabas CV, V, CVC, CCV, identificando que existem vogais em todas as sílabas. [fases: p2.2, p2.3, p2.4, p2.5, p3.1, p3.2, p3.3]
- **EF02LP05** (Língua Portuguesa, 2º ano; Análise linguística/semiótica (Alfabetização) · TODOS OS CAMPOS DE ATUAÇÃO; objeto: Construção do sistema alfabético e da ortografia; PDF p. 103): Ler e escrever corretamente palavras com marcas de nasalidade (til, m, n). [fases: p4.5, p9.2]
- **EF02LP09** (Língua Portuguesa, 2º ano; Análise linguística/semiótica (Alfabetização) · TODOS OS CAMPOS DE ATUAÇÃO; objeto: Pontuação; PDF p. 103): Usar adequadamente ponto final, ponto de interrogação e ponto de exclamação. [fases: p5.2, p5.4]
- **EF02LP16** (Língua Portuguesa, 2º ano; Análise linguística/semiótica (Alfabetização) · CAMPO DA VIDA COTIDIANA; objeto: Forma de composição do texto; PDF p. 107): Identificar e reproduzir, em bilhetes, recados, avisos, cartas, e-mails, receitas (modo de fazer), relatos (digitais ou impressos), a formatação e diagramação específica de cada um desses gêneros. [fases: p10.1]
- **EF02LP17** (Língua Portuguesa, 2º ano; Análise linguística/semiótica (Alfabetização) · CAMPO DA VIDA COTIDIANA; objeto: Forma de composição do texto; PDF p. 107): Identificar e reproduzir, em relatos de experiências pessoais, a sequência dos fatos, utilizando expressões que marquem a passagem do tempo (“antes”, “depois”, “ontem”, “hoje”, “amanhã”, “outro dia”, “antigamente”, “há muito tempo” etc.), e o nível de informatividade necessário. [fases: p7.4]
- **EF02MA01** (Matemática, 2º ano; Números; objeto: Leitura, escrita, comparação e ordenação de números de até três ordens pela compreensão de características do sistema de numeração decimal (valor posicional e papel do zero); PDF p. 285): Comparar e ordenar números naturais (até a ordem de centenas) pela compreensão de características do sistema de numeração decimal (valor posicional e função do zero). [fases: 1.2, 1.4]
- **EF02MA04** (Matemática, 2º ano; Números; objeto: Composição e decomposição de números naturais (até 1000); PDF p. 285): Compor e decompor números naturais de até três ordens, com suporte de material manipulável, por meio de diferentes adições. [fases: 1.3, 1.4]
- **EF02MA05** (Matemática, 2º ano; Números; objeto: Construção de fatos fundamentais da adição e da subtração; PDF p. 285): Construir fatos básicos da adição e subtração e utilizá-los no cálculo mental ou escrito. [fases: 2.1, 2.2, 2.3]
- **EF02MA06** (Matemática, 2º ano; Números; objeto: Problemas envolvendo diferentes significados da adição e da subtração (juntar, acrescentar, separar, retirar); PDF p. 285): Resolver e elaborar problemas de adição e de subtração, envolvendo números de até três ordens, com os significados de juntar, acrescentar, separar, retirar, utilizando estratégias pessoais. [fases: 2.2, 2.3, 2.5]
- **EF02MA07** (Matemática, 2º ano; Números; objeto: Problemas envolvendo adição de parcelas iguais (multiplicação); PDF p. 285): Resolver e elaborar problemas de multiplicação (por 2, 3, 4 e 5) com a ideia de adição de parcelas iguais por meio de estratégias e formas de registro pessoais, utilizando ou não suporte de imagens e/ou material manipulável. [fases: 3.1]
- **EF02MA08** (Matemática, 2º ano; Números; objeto: Problemas envolvendo significados de dobro, metade, triplo e terça parte; PDF p. 285): Resolver e elaborar problemas envolvendo dobro, metade, triplo e terça parte, com o suporte de imagens ou material manipulável, utilizando estratégias pessoais. [fases: 3.2, 4.4, 5.5]
- **EF02MA20** (Matemática, 2º ano; Grandezas e medidas; objeto: Sistema monetário brasileiro: reconhecimento de cédulas e moedas e equivalência de valores; PDF p. 287): Estabelecer a equivalência de valores entre moedas e cédulas do sistema monetário brasileiro para resolver situações cotidianas. [fases: 6.3, 6.4]
- **EF02MA21** (Matemática, 2º ano; Probabilidade e estatística; objeto: Análise da ideia de aleatório em situações do cotidiano; PDF p. 287): Classificar resultados de eventos cotidianos aleatórios como “pouco prováveis”, “muito prováveis”, “improváveis” e “impossíveis”. [fases: 10.3]
- **EF03LP01** (Língua Portuguesa, 3º ano; Análise linguística/semiótica (Ortografização) · TODOS OS CAMPOS DE ATUAÇÃO; objeto: Construção do sistema alfabético e da ortografia; PDF p. 117): Ler e escrever palavras com correspondências regulares contextuais entre grafemas e fonemas – c/qu; g/gu; r/rr; s/ss; o (e não u) e e (e não i) em sílaba átona em final de palavra – e com marcas de nasalidade (til, m, n). [fases: p2.3, p4.1, p4.2, p4.3, p4.5, p9.2]
- **EF03LP03** (Língua Portuguesa, 3º ano; Análise linguística/semiótica (Ortografização) · TODOS OS CAMPOS DE ATUAÇÃO; objeto: Construção do sistema alfabético e da ortografia; PDF p. 117): Ler e escrever corretamente palavras com os dígrafos lh, nh, ch. [fases: p4.4]
- **EF03LP04** (Língua Portuguesa, 3º ano; Análise linguística/semiótica (Ortografização) · TODOS OS CAMPOS DE ATUAÇÃO; objeto: Conhecimento das diversas grafias do alfabeto/ Acentuação; PDF p. 119): Usar acento gráfico (agudo ou circunflexo) em monossílabos tônicos terminados em a, e, o e em palavras oxítonas terminadas em a, e, o, seguidas ou não de s. [fases: p9.1, p9.3]
- **EF03LP05** (Língua Portuguesa, 3º ano; Análise linguística/semiótica (Ortografização) · TODOS OS CAMPOS DE ATUAÇÃO; objeto: Segmentação de palavras/Classificação de palavras por número de sílabas; PDF p. 119): Identificar o número de sílabas de palavras, classificando-as em monossílabas, dissílabas, trissílabas e polissílabas. [fases: p2.1, p3.2]
- **EF03LP06** (Língua Portuguesa, 3º ano; Análise linguística/semiótica (Ortografização) · TODOS OS CAMPOS DE ATUAÇÃO; objeto: Construção do sistema alfabético; PDF p. 119): Identificar a sílaba tônica em palavras, classificando-as em oxítonas, paroxítonas e proparoxítonas. [fases: p9.1]
- **EF03LP07** (Língua Portuguesa, 3º ano; Análise linguística/semiótica (Ortografização) · TODOS OS CAMPOS DE ATUAÇÃO; objeto: Pontuação; PDF p. 119): Identificar a função na leitura e usar na escrita ponto final, ponto de interrogação, ponto de exclamação e, em diálogos (discurso direto), dois-pontos e travessão. [fases: p5.4, p9.5]
- **EF03LP08** (Língua Portuguesa, 3º ano; Análise linguística/semiótica (Ortografização) · TODOS OS CAMPOS DE ATUAÇÃO; objeto: Morfologia/Morfossintaxe; PDF p. 119): Identificar e diferenciar, em textos, substantivos e verbos e suas funções na oração: agente, ação, objeto da ação. [fases: p5.1, p5.3, p6.1, p7.2, p7.5]
- **EF03LP09** (Língua Portuguesa, 3º ano; Análise linguística/semiótica (Ortografização) · TODOS OS CAMPOS DE ATUAÇÃO; objeto: Morfossintaxe; PDF p. 121): Identificar, em textos, adjetivos e sua função de atribuição de propriedades aos substantivos. [fases: p7.1, p7.5]
- **EF03LP11** (Língua Portuguesa, 3º ano; Leitura/escuta (compartilhada e autônoma) · CAMPO DA VIDA COTIDIANA – Campo de atuação relativo à participação em situações de leitura, próprias de atividades vivenciadas cotidianamente por crianças, adolescentes, jovens e adultos, no espaço doméstico e familiar, escolar, cultural e profissional. Alguns gêneros textuais deste campo: agendas, listas, bilhetes, recados, avisos, convites, cartas, cardápios, diários, receitas, regras de jogos e brincadeiras.; objeto: Compreensão em leitura; PDF p. 121): Ler e compreender, com autonomia, textos injuntivos instrucionais (receitas, instruções de montagem etc.), com a estrutura própria desses textos (verbos imperativos, indicação de passos a ser seguidos) e mesclando palavras, imagens e recursos gráficovisuais, considerando a situação comunicativa e o tema/assunto do texto. [fases: p10.2]
- **EF03LP16** (Língua Portuguesa, 3º ano; Análise linguística/semiótica (Ortografização) · CAMPO DA VIDA COTIDIANA; objeto: Forma de composição do texto; PDF p. 125): Identificar e reproduzir, em textos injuntivos instrucionais (receitas, instruções de montagem, digitais ou impressos), a formatação própria desses textos (verbos imperativos, indicação de passos a ser seguidos) e a diagramação específica dos textos desses gêneros (lista de ingredientes ou materiais e instruções de execução – "modo de fazer"). [fases: p10.2]
- **EF03MA01** (Matemática, 3º ano; Números; objeto: Leitura, escrita, comparação e ordenação de números naturais de quatro ordens; PDF p. 289): Ler, escrever e comparar números naturais de até a ordem de unidade de milhar, estabelecendo relações entre os registros numéricos e em língua materna. [fases: 1.4]
- **EF03MA02** (Matemática, 3º ano; Números; objeto: Composição e decomposição de números naturais; PDF p. 289): Identificar características do sistema de numeração decimal, utilizando a composição e a decomposição de número natural de até quatro ordens. [fases: 1.4]
- **EF03MA03** (Matemática, 3º ano; Números; objeto: Construção de fatos fundamentais da adição, subtração e multiplicação; PDF p. 289): Construir e utilizar fatos básicos da adição e da multiplicação para o cálculo mental ou escrito. [fases: 3.2, 3.3]
- **EF03MA04** (Matemática, 3º ano; Números; objeto: Reta numérica; PDF p. 289): Estabelecer a relação entre números naturais e pontos da reta numérica para utilizá-la na ordenação dos números naturais e também na construção de fatos da adição e da subtração, relacionando-os com deslocamentos para a direita ou para a esquerda. [fases: 1.5]
- **EF03MA05** (Matemática, 3º ano; Números; objeto: Procedimentos de cálculo (mental e escrito) com números naturais: adição e subtração; PDF p. 289): Utilizar diferentes procedimentos de cálculo mental e escrito, inclusive os convencionais, para resolver problemas significativos envolvendo adição e subtração com números naturais. [fases: 2.2, 2.3, 2.4]
- **EF03MA06** (Matemática, 3º ano; Números; objeto: Problemas envolvendo significados da adição e da subtração: juntar, acrescentar, separar, retirar, comparar e completar quantidades; PDF p. 289): Resolver e elaborar problemas de adição e subtração com os significados de juntar, acrescentar, separar, retirar, comparar e completar quantidades, utilizando diferentes estratégias de cálculo exato ou aproximado, incluindo cálculo mental. [fases: 2.3, 2.5]
- **EF03MA07** (Matemática, 3º ano; Números; objeto: Problemas envolvendo diferentes significados da multiplicação e da divisão: adição de parcelas iguais, configuração retangular, repartição em partes iguais e medida; PDF p. 289): Resolver e elaborar problemas de multiplicação (por 2, 3, 4, 5 e 10) com os significados de adição de parcelas iguais e elementos apresentados em disposição retangular, utilizando diferentes estratégias de cálculo e registros. [fases: 3.1, 3.2]
- **EF03MA08** (Matemática, 3º ano; Números; objeto: Problemas envolvendo diferentes significados da multiplicação e da divisão: adição de parcelas iguais, configuração retangular, repartição em partes iguais e medida; PDF p. 289): Resolver e elaborar problemas de divisão de um número natural por outro (até 10), com resto zero e com resto diferente de zero, com os significados de repartição equitativa e de medida, por meio de estratégias e registros pessoais. [fases: 4.1, 4.2, 4.3]
- **EF03MA09** (Matemática, 3º ano; Números; objeto: Significados de metade, terça parte, quarta parte, quinta parte e décima parte; PDF p. 289): Associar o quociente de uma divisão com resto zero de um número natural por 2, 3, 4, 5 e 10 às ideias de metade, terça, quarta, quinta e décima partes. [fases: 4.1, 4.4, 5.1, 5.5]
- **EF03MA10** (Matemática, 3º ano; Álgebra; objeto: Identificação e descrição de regularidades em sequências numéricas recursivas; PDF p. 289): Identificar regularidades em sequências ordenadas de números naturais, resultantes da realização de adições ou subtrações sucessivas, por um mesmo número, descrever uma regra de formação da sequência e determinar elementos faltantes ou seguintes. [fases: 1.5]
- **EF03MA15** (Matemática, 3º ano; Geometria; objeto: Figuras geométricas planas (triângulo, quadrado, retângulo, trapézio e paralelogramo): reconhecimento e análise de características; PDF p. 291): Classificar e comparar figuras planas (triângulo, quadrado, retângulo, trapézio e paralelogramo) em relação a seus lados (quantidade, posições relativas e comprimento) e vértices. [fases: 8.1]
- **EF03MA24** (Matemática, 3º ano; Grandezas e medidas; objeto: Sistema monetário brasileiro: estabelecimento de equivalências de um mesmo valor na utilização de diferentes cédulas e moedas; PDF p. 291): Resolver e elaborar problemas que envolvam a comparação e a equivalência de valores monetários do sistema brasileiro em situações de compra, venda e troca. [fases: 6.3, 6.4]
- **EF03MA26** (Matemática, 3º ano; Probabilidade e estatística; objeto: Leitura, interpretação e representação de dados em tabelas de dupla entrada e gráficos de barras; PDF p. 291): Resolver problemas cujos dados estão apresentados em tabelas de dupla entrada, gráficos de barras ou de colunas. [fases: 10.2]
- **EF03MA27** (Matemática, 3º ano; Probabilidade e estatística; objeto: Leitura, interpretação e representação de dados em tabelas de dupla entrada e gráficos de barras; PDF p. 291): Ler, interpretar e comparar dados apresentados em tabelas de dupla entrada, gráficos de barras ou de colunas, envolvendo resultados de pesquisas significativas, utilizando termos como maior e menor frequência, apropriando-se desse tipo de linguagem para compreender aspectos da realidade sociocultural significativos. [fases: 10.2]
- **EF04LP01** (Língua Portuguesa, 4º ano; Análise linguística/semiótica (Ortografização) · TODOS OS CAMPOS DE ATUAÇÃO; objeto: Construção do sistema alfabético e da ortografia; PDF p. 117): Grafar palavras utilizando regras de correspondência fonema-grafema regulares diretas e contextuais. [fases: p4.1, p8.1, p9.2]
- **EF04LP03** (Língua Portuguesa, 4º ano; Análise linguística/semiótica (Ortografização) · TODOS OS CAMPOS DE ATUAÇÃO; objeto: Conhecimento do alfabeto do português do Brasil/Ordem alfabética/Polissemia; PDF p. 117): Localizar palavras no dicionário para esclarecer significados, reconhecendo o significado mais plausível para o contexto que deu origem à consulta. [fases: p1.5]
- **EF04LP05** (Língua Portuguesa, 4º ano; Análise linguística/semiótica (Ortografização) · TODOS OS CAMPOS DE ATUAÇÃO; objeto: Pontuação; PDF p. 119): Identificar a função na leitura e usar, adequadamente, na escrita ponto final, de interrogação, de exclamação, dois-pontos e travessão em diálogos (discurso direto), vírgula em enumerações e em separação de vocativo e de aposto. [fases: p9.4, p9.5]
- **EF04LP07** (Língua Portuguesa, 4º ano; Análise linguística/semiótica (Ortografização) · TODOS OS CAMPOS DE ATUAÇÃO; objeto: Morfossintaxe; PDF p. 121): Identificar em textos e usar na produção textual a concordância entre artigo, substantivo e adjetivo (concordância no grupo nominal). [fases: p6.2, p7.3]
- **EF04LP08** (Língua Portuguesa, 4º ano; Análise linguística/semiótica (Ortografização) · TODOS OS CAMPOS DE ATUAÇÃO; objeto: Morfologia; PDF p. 121): Reconhecer e grafar, corretamente, palavras derivadas com os sufixos -agem, -oso, -eza, -izar/-isar (regulares morfológicas). [fases: p8.2]
- **EF04MA02** (Matemática, 4º ano; Números; objeto: Composição e decomposição de um número natural de até cinco ordens, por meio de adições e multiplicações por potências de 10; PDF p. 293): Mostrar, por decomposição e composição, que todo número natural pode ser escrito por meio de adições e multiplicações por potências de dez, para compreender o sistema de numeração decimal e desenvolver estratégias de cálculo. [fases: 3.4, 9.4]
- **EF04MA03** (Matemática, 4º ano; Números; objeto: Propriedades das operações para o desenvolvimento de diferentes estratégias de cálculo com números naturais; PDF p. 293): Resolver e elaborar problemas com números naturais envolvendo adição e subtração, utilizando estratégias diversas, como cálculo, cálculo mental e algoritmos, além de fazer estimativas do resultado. [fases: 2.4, 2.5]
- **EF04MA05** (Matemática, 4º ano; Números; objeto: Propriedades das operações para o desenvolvimento de diferentes estratégias de cálculo com números naturais; PDF p. 293): Utilizar as propriedades das operações para desenvolver estratégias de cálculo. [fases: 2.1, 3.1, 3.4, 3.5]
- **EF04MA06** (Matemática, 4º ano; Números; objeto: Problemas envolvendo diferentes significados da multiplicação e da divisão: adição de parcelas iguais, configuração retangular, proporcionalidade, repartição equitativa e medida; PDF p. 293): Resolver e elaborar problemas envolvendo diferentes significados da multiplicação (adição de parcelas iguais, organização retangular e proporcionalidade), utilizando estratégias diversas, como cálculo por estimativa, cálculo mental e algoritmos. [fases: 3.5]
- **EF04MA07** (Matemática, 4º ano; Números; objeto: Problemas envolvendo diferentes significados da multiplicação e da divisão: adição de parcelas iguais, configuração retangular, proporcionalidade, repartição equitativa e medida; PDF p. 293): Resolver e elaborar problemas de divisão cujo divisor tenha no máximo dois algarismos, envolvendo os significados de repartição equitativa e de medida, utilizando estratégias diversas, como cálculo por estimativa, cálculo mental e algoritmos. [fases: 4.2, 4.3]
- **EF04MA09** (Matemática, 4º ano; Números; objeto: Números racionais: frações unitárias mais usuais (1/2, 1/3, 1/4, 1/5, 1/10 e 1/100); PDF p. 293): Reconhecer as frações unitárias mais usuais (1/2, 1/3, 1/4, 1/5, 1/10 e 1/100) como unidades de medida menores do que uma unidade, utilizando a reta numérica como recurso. [fases: 5.1, 5.3]
- **EF04MA10** (Matemática, 4º ano; Números; objeto: Números racionais: representação decimal para escrever valores do sistema monetário brasileiro; PDF p. 293): Reconhecer que as regras do sistema de numeração decimal podem ser estendidas para a representação decimal de um número racional e relacionar décimos e centésimos com a representação do sistema monetário brasileiro. [fases: 6.1]
- **EF04MA11** (Matemática, 4º ano; Álgebra; objeto: Sequência numérica recursiva formada por múltiplos de um número natural; PDF p. 293): Identificar regularidades em sequências numéricas compostas por múltiplos de um número natural. [fases: 1.5, 4.5]
- **EF04MA13** (Matemática, 4º ano; Álgebra; objeto: Relações entre adição e subtração e entre multiplicação e divisão; PDF p. 293): Reconhecer, por meio de investigações, utilizando a calculadora quando necessário, as relações inversas entre as operações de adição e de subtração e de multiplicação e de divisão, para aplicá-las na resolução de problemas. [fases: 3.2, 3.3, 4.1, 4.2]
- **EF04MA15** (Matemática, 4º ano; Álgebra; objeto: Propriedades da igualdade; PDF p. 293): Determinar o número desconhecido que torna verdadeira uma igualdade que envolve as operações fundamentais com números naturais. [fases: 9.1]
- **EF04MA18** (Matemática, 4º ano; Geometria; objeto: Ângulos retos e não retos: uso de dobraduras, esquadros e softwares; PDF p. 295): Reconhecer ângulos retos e não retos em figuras poligonais com o uso de dobraduras, esquadros ou softwares de geometria. [fases: 8.4]
- **EF04MA20** (Matemática, 4º ano; Grandezas e medidas; objeto: Medidas de comprimento, massa e capacidade: estimativas, utilização de instrumentos de medida e de unidades de medida convencionais mais usuais; PDF p. 295): Medir e estimar comprimentos (incluindo perímetros), massas e capacidades, utilizando unidades de medida padronizadas mais usuais, valorizando e respeitando a cultura local. [fases: 8.2]
- **EF04MA25** (Matemática, 4º ano; Grandezas e medidas; objeto: Problemas utilizando o sistema monetário brasileiro; PDF p. 295): Resolver e elaborar problemas que envolvam situações de compra e venda e formas de pagamento, utilizando termos como troco e desconto, enfatizando o consumo ético, consciente e responsável. [fases: 6.4, 7.3]
- **EF05LP01** (Língua Portuguesa, 5º ano; Análise linguística/semiótica (Ortografização) · TODOS OS CAMPOS DE ATUAÇÃO; objeto: Construção do sistema alfabético e da ortografia; PDF p. 117): Grafar palavras utilizando regras de correspondência fonema-grafema regulares, contextuais e morfológicas e palavras de uso frequente com correspondências irregulares. [fases: p8.2, p8.3, p8.4]
- **EF05LP03** (Língua Portuguesa, 5º ano; Análise linguística/semiótica (Ortografização) · TODOS OS CAMPOS DE ATUAÇÃO; objeto: Conhecimento das diversas grafias do alfabeto/ Acentuação; PDF p. 119): Acentuar corretamente palavras oxítonas, paroxítonas e proparoxítonas. [fases: p9.3]
- **EF05LP05** (Língua Portuguesa, 5º ano; Análise linguística/semiótica (Ortografização) · TODOS OS CAMPOS DE ATUAÇÃO; objeto: Morfologia/Morfossintaxe; PDF p. 119): Identificar a expressão de presente, passado e futuro em tempos verbais do modo indicativo. [fases: p7.4]
- **EF05LP07** (Língua Portuguesa, 5º ano; Análise linguística/semiótica (Ortografização) · TODOS OS CAMPOS DE ATUAÇÃO; objeto: Morfologia; PDF p. 121): Identificar, em textos, o uso de conjunções e a relação que estabelecem entre partes do texto: adição, oposição, tempo, causa, condição, finalidade. [fases: p5.5, p8.5]
- **EF05MA02** (Matemática, 5º ano; Números; objeto: Números racionais expressos na forma decimal e sua representação na reta numérica; PDF p. 297): Ler, escrever e ordenar números racionais na forma decimal com compreensão das principais características do sistema de numeração decimal, utilizando, como recursos, a composição e decomposição e a reta numérica. [fases: 6.1, 6.2]
- **EF05MA03** (Matemática, 5º ano; Números; objeto: Representação fracionária dos números racionais: reconhecimento, significados, leitura e representação na reta numérica; PDF p. 297): Identificar e representar frações (menores e maiores que a unidade), associando-as ao resultado de uma divisão ou à ideia de parte de um todo, utilizando a reta numérica como recurso. [fases: 5.1, 5.2, 5.3, 5.5]
- **EF05MA04** (Matemática, 5º ano; Números; objeto: Comparação e ordenação de números racionais na representação decimal e na fracionária utilizando a noção de equivalência; PDF p. 297): Identificar frações equivalentes. [fases: 5.2]
- **EF05MA05** (Matemática, 5º ano; Números; objeto: Comparação e ordenação de números racionais na representação decimal e na fracionária utilizando a noção de equivalência; PDF p. 297): Comparar e ordenar números racionais positivos (representações fracionária e decimal), relacionando-os a pontos na reta numérica. [fases: 5.3, 6.2]
- **EF05MA06** (Matemática, 5º ano; Números; objeto: Cálculo de porcentagens e representação fracionária; PDF p. 297): Associar as representações 10%, 25%, 50%, 75% e 100% respectivamente à décima parte, quarta parte, metade, três quartos e um inteiro, para calcular porcentagens, utilizando estratégias pessoais, cálculo mental e calculadora, em contextos de educação financeira, entre outros. [fases: 7.1, 7.2, 7.3]
- **EF05MA07** (Matemática, 5º ano; Números; objeto: Problemas: adição e subtração de números naturais e números racionais cuja representação decimal é finita; PDF p. 297): Resolver e elaborar problemas de adição e subtração com números naturais e com números racionais, cuja representação decimal seja finita, utilizando estratégias diversas, como cálculo por estimativa, cálculo mental e algoritmos. [fases: 6.3, 6.4]
- **EF05MA08** (Matemática, 5º ano; Números; objeto: Problemas: multiplicação e divisão de números racionais cuja representação decimal é finita por números naturais; PDF p. 297): Resolver e elaborar problemas de multiplicação e divisão com números naturais e com números racionais cuja representação decimal é finita (com multiplicador natural e divisor natural e diferente de zero), utilizando estratégias diversas, como cálculo por estimativa, cálculo mental e algoritmos. [fases: 6.4, 6.5]
- **EF05MA11** (Matemática, 5º ano; Álgebra; objeto: Propriedades da igualdade e noção de equivalência; PDF p. 297): Resolver e elaborar problemas cuja conversão em sentença matemática seja uma igualdade com uma operação em que um dos termos é desconhecido. [fases: 8.2, 9.1]
- **EF05MA12** (Matemática, 5º ano; Álgebra; objeto: Grandezas diretamente proporcionais; PDF p. 297): Resolver problemas que envolvam variação de proporcionalidade direta entre duas grandezas, para associar a quantidade de um produto ao valor a pagar, alterar as quantidades de ingredientes de receitas, ampliar ou reduzir escala em mapas, entre outros. [fases: 7.4, 7.5]
- **EF05MA17** (Matemática, 5º ano; Geometria; objeto: Figuras geométricas planas: características, representações e ângulos; PDF p. 299): Reconhecer, nomear e comparar polígonos, considerando lados, vértices e ângulos, e desenhá-los, utilizando material de desenho ou tecnologias digitais. [fases: 8.1]
- **EF05MA19** (Matemática, 5º ano; Grandezas e medidas; objeto: Medidas de comprimento, área, massa, tempo, temperatura e capacidade: utilização de unidades convencionais e relações entre as unidades de medida mais usuais; PDF p. 299): Resolver e elaborar problemas envolvendo medidas das grandezas comprimento, área, massa, tempo, temperatura e capacidade, recorrendo a transformações entre as unidades mais usuais em contextos socioculturais. [fases: 8.5]
- **EF05MA22** (Matemática, 5º ano; Probabilidade e estatística; objeto: Espaço amostral: análise de chances de eventos aleatórios; PDF p. 299): Apresentar todos os possíveis resultados de um experimento aleatório, estimando se esses resultados são igualmente prováveis ou não. [fases: 10.3]
- **EF05MA23** (Matemática, 5º ano; Probabilidade e estatística; objeto: Cálculo de probabilidade de eventos equiprováveis; PDF p. 299): Determinar a probabilidade de ocorrência de um resultado em eventos aleatórios, quando todos os resultados possíveis têm a mesma chance de ocorrer (equiprováveis). [fases: 10.3]
- **EF06LI02** (Língua Inglesa, 6º ano; Interação discursiva · EIXO ORALIDADE – Práticas de compreensão e produção oral de língua inglesa, em diferentes contextos discursivos presenciais ou simulados, com repertório de falas diversas, incluída a fala do professor.; objeto: Construção de laços afetivos e convívio social; PDF p. 251): Coletar informações do grupo, perguntando e respondendo sobre a família, os amigos, a escola e a comunidade.. [fases: e9.1, e9.2, e9.3, e9.4, e9.5]
- **EF06LI03** (Língua Inglesa, 6º ano; Interação discursiva · EIXO ORALIDADE – Práticas de compreensão e produção oral de língua inglesa, em diferentes contextos discursivos presenciais ou simulados, com repertório de falas diversas, incluída a fala do professor.; objeto: Funções e usos da língua inglesa em sala de aula (Classroom language); PDF p. 251): Solicitar esclarecimentos em língua inglesa sobre o que não entendeu e o significado de palavras ou expressões desconhecidas. [fases: e10.3]
- **EF06LI04** (Língua Inglesa, 6º ano; Compreensão oral · EIXO ORALIDADE – Práticas de compreensão e produção oral de língua inglesa, em diferentes contextos discursivos presenciais ou simulados, com repertório de falas diversas, incluída a fala do professor.; objeto: Estratégias de compreensão de textos orais: palavras cognatas e pistas do contexto discursivo; PDF p. 251): Reconhecer, com o apoio de palavras cognatas e pistas do contexto discursivo, o assunto e as informações principais em textos orais sobre temas familiares. [fases: e10.4]
- **EF06LI05** (Língua Inglesa, 6º ano; Produção oral · EIXO ORALIDADE – Práticas de compreensão e produção oral de língua inglesa, em diferentes contextos discursivos presenciais ou simulados, com repertório de falas diversas, incluída a fala do professor.; objeto: Produção de textos orais, com a mediação do professor; PDF p. 251): Aplicar os conhecimentos da língua inglesa para falar de si e de outras pessoas, explicitando informações pessoais e características relacionadas a gostos, preferências e rotinas. [fases: e1.4, e8.5, e9.5]
- **EF06LI08** (Língua Inglesa, 6º ano; Estratégias de leitura · EIXO LEITURA – Práticas de leitura de textos diversos em língua inglesa (verbais, verbo-visuais, multimodais) presentes em diferentes suportes e esferas de circulação. Tais práticas envolvem articulação com os conhecimentos prévios dos alunos em língua materna e/ou outras línguas.; objeto: Compreensão geral e específica: leitura rápida (skimming, scanning); PDF p. 251): Identificar o assunto de um texto, reconhecendo sua organização textual e palavras cognatas. [fases: e10.4]
- **EF06LI16** (Língua Inglesa, 6º ano; Estudo do léxico · EIXO CONHECIMENTOS LINGUÍSTICOS – Práticas de análise linguística para a reflexão sobre o funcionamento da língua inglesa, com base nos usos de linguagem trabalhados nos eixos Oralidade, Leitura, Escrita e Dimensão intercultural.; objeto: Construção de repertório lexical; PDF p. 253): Construir repertório relativo às expressões usadas para o convívio social e o uso da língua inglesa em sala de aula. [fases: e1.1, e1.2, e1.3, e1.4, e10.2, e10.3, e9.4]
- **EF06LI17** (Língua Inglesa, 6º ano; Estudo do léxico · EIXO CONHECIMENTOS LINGUÍSTICOS – Práticas de análise linguística para a reflexão sobre o funcionamento da língua inglesa, com base nos usos de linguagem trabalhados nos eixos Oralidade, Leitura, Escrita e Dimensão intercultural.; objeto: Construção de repertório lexical; PDF p. 253): Construir repertório lexical relativo a temas familiares (escola, família, rotina diária, atividades de lazer, esportes, entre outros). [fases: e1.5, e10.1, e2.1, e2.2, e2.3, e2.4, e2.5, e3.1, e3.2, e3.3, e3.4, e3.5, e4.1, e4.2, e4.3, e4.4, e4.5, e5.1, e5.2, e5.3, e5.4, e5.5, e6.1, e6.2, e6.3, e6.4, e6.5, e7.1, e7.2, e7.3, e7.4, e7.5, e8.1, e8.2, e8.3, e8.4, e8.5]
- **EF06LI18** (Língua Inglesa, 6º ano; Estudo do léxico · EIXO CONHECIMENTOS LINGUÍSTICOS – Práticas de análise linguística para a reflexão sobre o funcionamento da língua inglesa, com base nos usos de linguagem trabalhados nos eixos Oralidade, Leitura, Escrita e Dimensão intercultural.; objeto: Pronúncia; PDF p. 253): Reconhecer semelhanças e diferenças na pronúncia de palavras da língua inglesa e da língua materna e/ou outras línguas conhecidas. [fases: e1.1, e1.2, e1.3, e1.4, e1.5, e2.1, e2.2, e2.3, e2.4, e2.5, e3.1, e3.2, e3.3, e3.4, e3.5, e4.1, e4.2, e4.3, e4.4, e4.5, e5.1, e5.2, e5.3, e5.4, e5.5, e6.1, e6.2, e6.3, e6.4, e6.5, e7.1, e7.2, e7.3, e7.4, e7.5, e8.1, e8.2, e8.3, e8.4, e8.5, e9.1, e9.2, e9.3, e9.4, e9.5]
- **EF06MA03** (Matemática, 6º ano; Números; objeto: Operações (adição, subtração, multiplicação, divisão e potenciação) com números naturais; PDF p. 303): Resolver e elaborar problemas que envolvam cálculos (mentais ou escritos, exatos ou aproximados) com números naturais, por meio de estratégias variadas, com compreensão dos processos neles envolvidos com e sem uso de calculadora. [fases: 9.4]
- **EF06MA05** (Matemática, 6º ano; Números; objeto: Múltiplos e divisores de um número natural; PDF p. 303): Classificar números naturais em primos e compostos, estabelecer relações entre números, expressas pelos termos “é múltiplo de”, “é divisor de”, “é fator de”, e estabelecer, por meio de investigações, critérios de divisibilidade por 2, 3, 4, 5, 6, 8, 9, 10, 100 e 1000. [fases: 4.5]
- **EF06MA06** (Matemática, 6º ano; Números; objeto: Números primos e compostos; PDF p. 303): Resolver e elaborar problemas que envolvam as ideias de múltiplo e de divisor. [fases: 4.5]
- **EF06MA07** (Matemática, 6º ano; Números; objeto: Frações: significados (parte/todo, quociente), equivalência, comparação, adição e subtração; cálculo da fração de um número natural; adição e subtração de frações; PDF p. 303): Compreender, comparar e ordenar frações associadas às ideias de partes de inteiros e resultado de divisão, identificando frações equivalentes. [fases: 5.2, 5.3]
- **EF06MA08** (Matemática, 6º ano; Números; objeto: Frações: significados (parte/todo, quociente), equivalência, comparação, adição e subtração; cálculo da fração de um número natural; adição e subtração de frações; PDF p. 303): Reconhecer que os números racionais positivos podem ser expressos nas formas fracionária e decimal, estabelecer relações entre essas representações, passando de uma representação para outra, e relacioná-los a pontos na reta numérica. [fases: 6.1, 7.1]
- **EF06MA09** (Matemática, 6º ano; Números; objeto: Frações: significados (parte/todo, quociente), equivalência, comparação, adição e subtração; cálculo da fração de um número natural; adição e subtração de frações; PDF p. 303): Resolver e elaborar problemas que envolvam o cálculo da fração de uma quantidade e cujo resultado seja um número natural, com e sem uso de calculadora. [fases: 5.5]
- **EF06MA10** (Matemática, 6º ano; Números; objeto: Frações: significados (parte/todo, quociente), equivalência, comparação, adição e subtração; cálculo da fração de um número natural; adição e subtração de frações; PDF p. 303): Resolver e elaborar problemas que envolvam adição ou subtração com números racionais positivos na representação fracionária. [fases: 5.4]
- **EF06MA12** (Matemática, 6º ano; Números; objeto: Aproximação de números para múltiplos de potências de 10; PDF p. 303): Fazer estimativas de quantidades e aproximar números para múltiplos da potência de 10 mais próxima. [fases: 1.5]
- **EF06MA13** (Matemática, 6º ano; Números; objeto: Cálculo de porcentagens por meio de estratégias diversas, sem fazer uso da “regra de três”; PDF p. 303): Resolver e elaborar problemas que envolvam porcentagens, com base na ideia de proporcionalidade, sem fazer uso da “regra de três”, utilizando estratégias pessoais, cálculo mental e calculadora, em contextos de educação financeira, entre outros. [fases: 7.1, 7.2]
- **EF06MA14** (Matemática, 6º ano; Álgebra; objeto: Propriedades da igualdade; PDF p. 305): Reconhecer que a relação de igualdade matemática não se altera ao adicionar, subtrair, multiplicar ou dividir os seus dois membros por um mesmo número e utilizar essa noção para determinar valores desconhecidos na resolução de problemas. [fases: 9.3]
- **EF06MA20** (Matemática, 6º ano; Geometria; objeto: Polígonos: classificações quanto ao número de vértices, às medidas de lados e ângulos e ao paralelismo e perpendicularismo dos lados; PDF p. 305): Identificar características dos quadriláteros, classificá-los em relação a lados e a ângulos e reconhecer a inclusão e a intersecção de classes entre eles. [fases: 8.1]
- **EF06MA24** (Matemática, 6º ano; Grandezas e medidas; objeto: Problemas sobre medidas envolvendo grandezas como comprimento, massa, tempo, temperatura, área, capacidade e volume; PDF p. 305): Resolver e elaborar problemas que envolvam as grandezas comprimento, massa, tempo, temperatura, área (triângulos e retângulos), capacidade e volume (sólidos formados por blocos retangulares), sem uso de fórmulas, inseridos, sempre que possível, em contextos oriundos de situações reais e/ou relacionadas às outras áreas do conhecimento. [fases: 8.2, 8.3]
- **EF06MA25** (Matemática, 6º ano; Grandezas e medidas; objeto: Ângulos: noção, usos e medida; PDF p. 305): Reconhecer a abertura do ângulo como grandeza associada às figuras geométricas. [fases: 8.4]
- **EF06MA26** (Matemática, 6º ano; Grandezas e medidas; objeto: Ângulos: noção, usos e medida; PDF p. 305): Resolver problemas que envolvam a noção de ângulo em diferentes contextos e em situações reais, como ângulo de visão. [fases: 8.4]
- **EF06MA29** (Matemática, 6º ano; Grandezas e medidas; objeto: Perímetro de um quadrado como grandeza proporcional à medida do lado; PDF p. 305): Analisar e descrever mudanças que ocorrem no perímetro e na área de um quadrado ao se ampliarem ou reduzirem, igualmente, as medidas de seus lados, para compreender que o perímetro é proporcional à medida do lado, o que não ocorre com a área. [fases: 8.3]
- **EF06MA30** (Matemática, 6º ano; Probabilidade e estatística; objeto: Cálculo de probabilidade como a razão entre o número de resultados favoráveis e o total de resultados possíveis em um espaço amostral equiprovável Cálculo de probabilidade por meio de muitas repetições de um experimento (frequências de ocorrências e probabilidade frequentista); PDF p. 307): Calcular a probabilidade de um evento aleatório, expressando-a por número racional (forma fracionária, decimal e percentual) e comparar esse número com a probabilidade obtida por meio de experimentos sucessivos. [fases: 10.3]
- **EF07MA02** (Matemática, 7º ano; Números; objeto: Cálculo de porcentagens e de acréscimos e decréscimos simples; PDF p. 309): Resolver e elaborar problemas que envolvam porcentagens, como os que lidam com acréscimos e decréscimos simples, utilizando estratégias pessoais, cálculo mental e calculadora, no contexto de educação financeira, entre outros. [fases: 7.3]
- **EF07MA03** (Matemática, 7º ano; Números; objeto: Números inteiros: usos, história, ordenação, associação com pontos da reta numérica e operações; PDF p. 309): Comparar e ordenar números inteiros em diferentes contextos, incluindo o histórico, associá-los a pontos da reta numérica e utilizá-los em situações que envolvam adição e subtração. [fases: 10.4]
- **EF07MA04** (Matemática, 7º ano; Números; objeto: Números inteiros: usos, história, ordenação, associação com pontos da reta numérica e operações; PDF p. 309): Resolver e elaborar problemas que envolvam operações com números inteiros. [fases: 10.4]
- **EF07MA09** (Matemática, 7º ano; Números; objeto: Fração e seus significados: como parte de inteiros, resultado da divisão, razão e operador; PDF p. 309): Utilizar, na resolução de problemas, a associação entre razão e fração, como a fração 2/3 para expressar a razão de duas partes de uma grandeza para três partes da mesma ou três partes de outra grandeza. [fases: 7.4]
- **EF07MA17** (Matemática, 7º ano; Álgebra; objeto: Problemas envolvendo grandezas diretamente proporcionais e grandezas inversamente proporcionais; PDF p. 309): Resolver e elaborar problemas que envolvam variação de proporcionalidade direta e de proporcionalidade inversa entre duas grandezas, utilizando sentença algébrica para expressar a relação entre elas. [fases: 7.5]
- **EF07MA18** (Matemática, 7º ano; Álgebra; objeto: Equações polinomiais do 1º grau; PDF p. 309): Resolver e elaborar problemas que possam ser representados por equações polinomiais de 1º grau, redutíveis à forma ax + b = c, fazendo uso das propriedades da igualdade. [fases: 9.3]
- **EF07MA24** (Matemática, 7º ano; Geometria; objeto: Triângulos: construção, condição de existência e soma das medidas dos ângulos internos; PDF p. 311): Construir triângulos, usando régua e compasso, reconhecer a condição de existência do triângulo quanto à medida dos lados e verificar que a soma das medidas dos ângulos internos de um triângulo é 180°. [fases: 8.4]
- **EF07MA30** (Matemática, 7º ano; Grandezas e medidas; objeto: Cálculo de volume de blocos retangulares, utilizando unidades de medida convencionais mais usuais; PDF p. 311): Resolver e elaborar problemas de cálculo de medida do volume de blocos retangulares, envolvendo as unidades usuais (metro cúbico, decímetro cúbico e centímetro cúbico). [fases: 8.5]
- **EF07MA31** (Matemática, 7º ano; Grandezas e medidas; objeto: Equivalência de área de figuras planas: cálculo de áreas de figuras que podem ser decompostas por outras, cujas áreas podem ser facilmente determinadas como triângulos e quadriláteros; PDF p. 311): Estabelecer expressões de cálculo de área de triângulos e de quadriláteros. [fases: 8.3]
- **EF07MA35** (Matemática, 7º ano; Probabilidade e estatística; objeto: Estatística: média e amplitude de um conjunto de dados; PDF p. 313): Compreender, em contextos significativos, o significado de média estatística como indicador da tendência de uma pesquisa, calcular seu valor e relacioná-lo, intuitivamente, com a amplitude do conjunto de dados. [fases: 10.1, 10.2]
- **EF12LP01** (Língua Portuguesa, 1º/2º ano; Leitura/escuta (compartilhada e autônoma) · TODOS OS CAMPOS DE ATUAÇÃO; objeto: Decodificação/Fluência de leitura; PDF p. 101): Ler palavras novas com precisão na decodificação, no caso de palavras de uso frequente, ler globalmente, por memorização. [fases: p1.4, p2.2, p2.3, p2.4, p2.5, p3.1, p3.2, p3.3, p3.5]
- **EF12LP04** (Língua Portuguesa, 1º/2º ano; Leitura/escuta (compartilhada e autônoma) · CAMPO DA VIDA COTIDIANA – Campo de atuação relativo à participação em situações de leitura, próprias de atividades vivenciadas cotidianamente por crianças, adolescentes, jovens e adultos, no espaço doméstico e familiar, escolar, cultural e profissional. Alguns gêneros textuais deste campo: agendas, listas, bilhetes, recados, avisos, convites, cartas, cardápios, diários, receitas, regras de jogos e brincadeiras.; objeto: Compreensão em leitura; PDF p. 105): Ler e compreender, em colaboração com os colegas e com a ajuda do professor ou já com certa autonomia, listas, agendas, calendários, avisos, convites, receitas, instruções de montagem (digitais ou impressos), dentre outros gêneros do campo da vida cotidiana, considerando a situação comunicativa e o tema/assunto do texto e relacionando sua forma de organização à sua finalidade. [fases: p10.1]
- **EF12LP19** (Língua Portuguesa, 1º/2º ano; Análise linguística/semiótica (Alfabetização) · CAMPO ARTÍSTICO-LITERÁRIO – Campo de atuação relativo à participação em situações de leitura, fruição e produção de textos literários e artísticos, representativos da diversidade cultural e linguística, que favoreçam experiências estéticas. Alguns gêneros deste campo: lendas, mitos, fábulas, contos, crônicas, canção, poemas, poemas visuais, cordéis, quadrinhos, tirinhas, charge/ cartum, dentre outros.; objeto: Formas de composição de textos poéticos; PDF p. 113): Reconhecer, em textos versificados, rimas, sonoridades, jogos de palavras, palavras, expressões, comparações, relacionando-as com sensações e associações. [fases: p3.5]
- **EF15LP03** (Língua Portuguesa, 1º/2º/3º/4º/5º ano; Leitura/escuta (compartilhada e autônoma) · TODOS OS CAMPOS DE ATUAÇÃO; objeto: Estratégia de leitura; PDF p. 97): Localizar informações explícitas em textos. [fases: p10.1, p10.2, p10.3, p10.4, p10.5]
- **EF15LP16** (Língua Portuguesa, 1º/2º/3º/4º/5º ano; Leitura/escuta (compartilhada e autônoma) · CAMPO ARTÍSTICO-LITERÁRIO – Campo de atuação relativo à participação em situações de leitura, fruição e produção de textos literários e artísticos, representativos da diversidade cultural e linguística, que favoreçam experiências estéticas. Alguns gêneros deste campo: lendas, mitos, fábulas, contos, crônicas, canção, poemas, poemas visuais, cordéis, quadrinhos, tirinhas, charge/ cartum, dentre outros.; objeto: Leitura colaborativa e autônoma; PDF p. 99): Ler e compreender, em colaboração com os colegas e com a ajuda do professor e, mais tarde, de maneira autônoma, textos narrativos de maior porte como contos (populares, de fadas, acumulativos, de assombração etc.) e crônicas. [fases: p10.3]
- **EF35LP13** (Língua Portuguesa, 3º/4º/5º ano; Análise linguística/semiótica (Ortografização) · TODOS OS CAMPOS DE ATUAÇÃO; objeto: Construção do sistema alfabético e da ortografia; PDF p. 117): Memorizar a grafia de palavras de uso frequente nas quais as relações fonema-grafema são irregulares e com h inicial que não representa fonema. [fases: p8.2, p8.3, p8.4, p8.5]

## Lacunas do app por ano (o que a BNCC pede e nenhuma fase do Bobby trabalha)
Critério: habilidade do ano que não aparece em nenhuma fase nem maker do mapa. Habilidades de "elaborar problemas", "realizar pesquisa", produção de texto, oralidade e uso de instrumentos físicos (régua, esquadro, transferidor, calculadora, planilha) são estruturalmente fora de um app de perguntas e estão marcadas como tal onde for o caso.

### Matemática

**1º ano**: 22 habilidades, 7 tocadas pelo app, 15 não cobertas.
- Cobertas: EF01MA02, EF01MA04, EF01MA05, EF01MA06, EF01MA07, EF01MA08, EF01MA10
- EF01MA01 (Números; Contagem de rotina Contagem ascendente e descendente Reconhecimento de números no contexto diário: indicação de quantidades, indicação de ordem ou indicação de código para a organização de informações): Utilizar números naturais como indicador de quantidade ou de ordem em diferentes situações cotidianas e reconhecer situações em que os números não indicam contagem nem ordem, mas sim código de identificação.
- EF01MA03 (Números; Quantificação de elementos de uma coleção: estimativas, contagem um a um, pareamento ou outros agrupamentos e comparação): Estimar e comparar quantidades de objetos de dois conjuntos (em torno de 20 elementos), por estimativa e/ou por correspondência (um a um, dois a dois) para indicar “tem mais”, “tem menos” ou “tem a mesma quantidade”.
- EF01MA09 (Álgebra; Padrões figurais e numéricos: investigação de regularidades ou padrões em sequências): Organizar e ordenar objetos familiares ou representações por figuras, por meio de atributos, tais como cor, forma e medida.
- EF01MA11 (Geometria; Localização de objetos e de pessoas no espaço, utilizando diversos pontos de referência e vocabulário apropriado): Descrever a localização de pessoas e de objetos no espaço em relação à sua própria posição, utilizando termos como à direita, à esquerda, em frente, atrás.
- EF01MA12 (Geometria; Localização de objetos e de pessoas no espaço, utilizando diversos pontos de referência e vocabulário apropriado): Descrever a localização de pessoas e de objetos no espaço segundo um dado ponto de referência, compreendendo que, para a utilização de termos que se referem à posição, como direita, esquerda, em cima, em baixo, é necessário explicitar-se o referencial.
- EF01MA13 (Geometria; Figuras geométricas espaciais: reconhecimento e relações com objetos familiares do mundo físico): Relacionar figuras geométricas espaciais (cones, cilindros, esferas e blocos retangulares) a objetos familiares do mundo físico.
- EF01MA14 (Geometria; Figuras geométricas planas: reconhecimento do formato das faces de figuras geométricas espaciais): Identificar e nomear figuras planas (círculo, quadrado, retângulo e triângulo) em desenhos apresentados em diferentes disposições ou em contornos de faces de sólidos geométricos.
- EF01MA15 (Grandezas e medidas; Medidas de comprimento, massa e capacidade: comparações e unidades de medida não convencionais): Comparar comprimentos, capacidades ou massas, utilizando termos como mais alto, mais baixo, mais comprido, mais curto, mais grosso, mais fino, mais largo, mais pesado, mais leve, cabe mais, cabe menos, entre outros, para ordenar objetos de uso cotidiano.
- EF01MA16 (Grandezas e medidas; Medidas de tempo: unidades de medida de tempo, suas relações e o uso do calendário): Relatar em linguagem verbal ou não verbal sequência de acontecimentos relativos a um dia, utilizando, quando possível, os horários dos eventos.
- EF01MA17 (Grandezas e medidas; Medidas de tempo: unidades de medida de tempo, suas relações e o uso do calendário): Reconhecer e relacionar períodos do dia, dias da semana e meses do ano, utilizando calendário, quando necessário.
- EF01MA18 (Grandezas e medidas; Medidas de tempo: unidades de medida de tempo, suas relações e o uso do calendário): Produzir a escrita de uma data, apresentando o dia, o mês e o ano, e indicar o dia da semana de uma data, consultando calendários.
- EF01MA19 (Grandezas e medidas; Sistema monetário brasileiro: reconhecimento de cédulas e moedas): Reconhecer e relacionar valores de moedas e cédulas do sistema monetário brasileiro para resolver situações simples do cotidiano do estudante.
- EF01MA20 (Probabilidade e estatística; Noção de acaso): Classificar eventos envolvendo o acaso, tais como “acontecerá com certeza”, “talvez aconteça” e “é impossível acontecer”, em situações do cotidiano.
- EF01MA21 (Probabilidade e estatística; Leitura de tabelas e de gráficos de colunas simples): Ler dados expressos em tabelas e em gráficos de colunas simples.
- EF01MA22 (Probabilidade e estatística; Coleta e organização de informações): Realizar pesquisa, envolvendo até duas variáveis categóricas de seu interesse e universo de até 30 elementos, e organizar dados por meio de representações pessoais. [pesquisa de campo: fora do alcance do app]

**2º ano**: 23 habilidades, 8 tocadas pelo app, 15 não cobertas.
- Cobertas: EF02MA01, EF02MA04, EF02MA05, EF02MA06, EF02MA07, EF02MA08, EF02MA20, EF02MA21
- EF02MA02 (Números; Leitura, escrita, comparação e ordenação de números de até três ordens pela compreensão de características do sistema de numeração decimal (valor posicional e papel do zero)): Fazer estimativas por meio de estratégias diversas a respeito da quantidade de objetos de coleções e registrar o resultado da contagem desses objetos (até 1000 unidades).
- EF02MA03 (Números; Leitura, escrita, comparação e ordenação de números de até três ordens pela compreensão de características do sistema de numeração decimal (valor posicional e papel do zero)): Comparar quantidades de objetos de dois conjuntos, por estimativa e/ou por correspondência (um a um, dois a dois, entre outros), para indicar “tem mais”, “tem menos” ou “tem a mesma quantidade”, indicando, quando for o caso, quantos a mais e quantos a menos.
- EF02MA09 (Álgebra; Construção de sequências repetitivas e de sequências recursivas): Construir sequências de números naturais em ordem crescente ou decrescente a partir de um número qualquer, utilizando uma regularidade estabelecida.
- EF02MA10 (Álgebra; Identificação de regularidade de sequências e determinação de elementos ausentes na sequência): Descrever um padrão (ou regularidade) de sequências repetitivas e de sequências recursivas, por meio de palavras, símbolos ou desenhos.
- EF02MA11 (Álgebra; Identificação de regularidade de sequências e determinação de elementos ausentes na sequência): Descrever os elementos ausentes em sequências repetitivas e em sequências recursivas de números naturais, objetos ou figuras.
- EF02MA12 (Geometria; Localização e movimentação de pessoas e objetos no espaço, segundo pontos de referência, e indicação de mudanças de direção e sentido): Identificar e registrar, em linguagem verbal ou não verbal, a localização e os deslocamentos de pessoas e de objetos no espaço, considerando mais de um ponto de referência, e indicar as mudanças de direção e de sentido.
- EF02MA13 (Geometria; Esboço de roteiros e de plantas simples): Esboçar roteiros a ser seguidos ou plantas de ambientes familiares, assinalando entradas, saídas e alguns pontos de referência.
- EF02MA14 (Geometria; Figuras geométricas espaciais (cubo, bloco retangular, pirâmide, cone, cilindro e esfera): reconhecimento e características): Reconhecer, nomear e comparar figuras geométricas espaciais (cubo, bloco retangular, pirâmide, cone, cilindro e esfera), relacionando-as com objetos do mundo físico.
- EF02MA15 (Geometria; Figuras geométricas planas (círculo, quadrado, retângulo e triângulo): reconhecimento e características): Reconhecer, comparar e nomear figuras planas (círculo, quadrado, retângulo e triângulo), por meio de características comuns, em desenhos apresentados em diferentes disposições ou em sólidos geométricos.
- EF02MA16 (Grandezas e medidas; Medida de comprimento: unidades não padronizadas e padronizadas (metro, centímetro e milímetro)): Estimar, medir e comparar comprimentos de lados de salas (incluindo contorno) e de polígonos, utilizando unidades de medida não padronizadas e padronizadas (metro, centímetro e milímetro) e instrumentos adequados.
- EF02MA17 (Grandezas e medidas; Medida de capacidade e de massa: unidades de medida não convencionais e convencionais (litro, mililitro, cm 3 , grama e quilograma)): Estimar, medir e comparar capacidade e massa, utilizando estratégias pessoais e unidades de medida não padronizadas ou padronizadas (litro, mililitro, grama e quilograma).
- EF02MA18 (Grandezas e medidas; Medidas de tempo: intervalo de tempo, uso do calendário, leitura de horas em relógios digitais e ordenação de datas): Indicar a duração de intervalos de tempo entre duas datas, como dias da semana e meses do ano, utilizando calendário, para planejamentos e organização de agenda.
- EF02MA19 (Grandezas e medidas; Medidas de tempo: intervalo de tempo, uso do calendário, leitura de horas em relógios digitais e ordenação de datas): Medir a duração de um intervalo de tempo por meio de relógio digital e registrar o horário do início e do fim do intervalo.
- EF02MA22 (Probabilidade e estatística; Coleta, classificação e representação de dados em tabelas simples e de dupla entrada e em gráficos de colunas): Comparar informações de pesquisas apresentadas por meio de tabelas de dupla entrada e em gráficos de colunas simples ou barras, para melhor compreender aspectos da realidade próxima.
- EF02MA23 (Probabilidade e estatística; Coleta, classificação e representação de dados em tabelas simples e de dupla entrada e em gráficos de colunas): Realizar pesquisa em universo de até 30 elementos, escolhendo até três variáveis categóricas de seu interesse, organizando os dados coletados em listas, tabelas e gráficos de colunas simples. [pesquisa de campo: fora do alcance do app]

**3º ano**: 28 habilidades, 14 tocadas pelo app, 14 não cobertas.
- Cobertas: EF03MA01, EF03MA02, EF03MA03, EF03MA04, EF03MA05, EF03MA06, EF03MA07, EF03MA08, EF03MA09, EF03MA10, EF03MA15, EF03MA24, EF03MA26, EF03MA27
- EF03MA11 (Álgebra; Relação de igualdade): Compreender a ideia de igualdade para escrever diferentes sentenças de adições ou de subtrações de dois números naturais que resultem na mesma soma ou diferença.
- EF03MA12 (Geometria; Localização e movimentação: representação de objetos e pontos de referência): Descrever e representar, por meio de esboços de trajetos ou utilizando croquis e maquetes, a movimentação de pessoas ou de objetos no espaço, incluindo mudanças de direção e sentido, com base em diferentes pontos de referência.
- EF03MA13 (Geometria; Figuras geométricas espaciais (cubo, bloco retangular, pirâmide, cone, cilindro e esfera): reconhecimento, análise de características e planificações): Associar figuras geométricas espaciais (cubo, bloco retangular, pirâmide, cone, cilindro e esfera) a objetos do mundo físico e nomear essas figuras.
- EF03MA14 (Geometria; Figuras geométricas espaciais (cubo, bloco retangular, pirâmide, cone, cilindro e esfera): reconhecimento, análise de características e planificações): Descrever características de algumas figuras geométricas espaciais (prismas retos, pirâmides, cilindros, cones), relacionando-as com suas planificações.
- EF03MA16 (Geometria; Congruência de figuras geométricas planas): Reconhecer figuras congruentes, usando sobreposição e desenhos em malhas quadriculadas ou triangulares, incluindo o uso de tecnologias digitais.
- EF03MA17 (Grandezas e medidas; Significado de medida e de unidade de medida): Reconhecer que o resultado de uma medida depende da unidade de medida utilizada.
- EF03MA18 (Grandezas e medidas; Significado de medida e de unidade de medida): Escolher a unidade de medida e o instrumento mais apropriado para medições de comprimento, tempo e capacidade.
- EF03MA19 (Grandezas e medidas; Medidas de comprimento (unidades não convencionais e convencionais): registro, instrumentos de medida, estimativas e comparações): Estimar, medir e comparar comprimentos, utilizando unidades de medida não padronizadas e padronizadas mais usuais (metro, centímetro e milímetro) e diversos instrumentos de medida.
- EF03MA20 (Grandezas e medidas; Medidas de capacidade e de massa (unidades não convencionais e convencionais): registro, estimativas e comparações): Estimar e medir capacidade e massa, utilizando unidades de medida não padronizadas e padronizadas mais usuais (litro, mililitro, quilograma, grama e miligrama), reconhecendo-as em leitura de rótulos e embalagens, entre outros.
- EF03MA21 (Grandezas e medidas; Comparação de áreas por superposição): Comparar, visualmente ou por superposição, áreas de faces de objetos, de figuras planas ou de desenhos.
- EF03MA22 (Grandezas e medidas; Medidas de tempo: leitura de horas em relógios digitais e analógicos, duração de eventos e reconhecimento de relações entre unidades de medida de tempo): Ler e registrar medidas e intervalos de tempo, utilizando relógios (analógico e digital) para informar os horários de início e término de realização de uma atividade e sua duração.
- EF03MA23 (Grandezas e medidas; Medidas de tempo: leitura de horas em relógios digitais e analógicos, duração de eventos e reconhecimento de relações entre unidades de medida de tempo): Ler horas em relógios digitais e em relógios analógicos e reconhecer a relação entre hora e minutos e entre minuto e segundos.
- EF03MA25 (Probabilidade e estatística; Análise da ideia de acaso em situações do cotidiano: espaço amostral): Identificar, em eventos familiares aleatórios, todos os resultados possíveis, estimando os que têm maiores ou menores chances de ocorrência.
- EF03MA28 (Probabilidade e estatística; Coleta, classificação e representação de dados referentes a variáveis categóricas, por meio de tabelas e gráficos): Realizar pesquisa envolvendo variáveis categóricas em um universo de até 50 elementos, organizar os dados coletados utilizando listas, tabelas simples ou de dupla entrada e representá-los em gráficos de colunas simples, com e sem uso de tecnologias digitais. [pesquisa de campo: fora do alcance do app]

**4º ano**: 28 habilidades, 13 tocadas pelo app, 15 não cobertas.
- Cobertas: EF04MA02, EF04MA03, EF04MA05, EF04MA06, EF04MA07, EF04MA09, EF04MA10, EF04MA11, EF04MA13, EF04MA15, EF04MA18, EF04MA20, EF04MA25
- EF04MA01 (Números; Sistema de numeração decimal: leitura, escrita, comparação e ordenação de números naturais de até cinco ordens): Ler, escrever e ordenar números naturais até a ordem de dezenas de milhar.
- EF04MA04 (Números; Propriedades das operações para o desenvolvimento de diferentes estratégias de cálculo com números naturais): Utilizar as relações entre adição e subtração, bem como entre multiplicação e divisão, para ampliar as estratégias de cálculo.
- EF04MA08 (Números; Problemas de contagem): Resolver, com o suporte de imagem e/ou material manipulável, problemas simples de contagem, como a determinação do número de agrupamentos possíveis ao se combinar cada elemento de uma coleção com todos os elementos de outra, utilizando estratégias e formas de registro pessoais.
- EF04MA12 (Álgebra; Sequência numérica recursiva formada por números que deixam o mesmo resto ao ser divididos por um mesmo número natural diferente de zero): Reconhecer, por meio de investigações, que há grupos de números naturais para os quais as divisões por um determinado número resultam em restos iguais, identificando regularidades.
- EF04MA14 (Álgebra; Propriedades da igualdade): Reconhecer e mostrar, por meio de exemplos, que a relação de igualdade existente entre dois termos permanece quando se adiciona ou se subtrai um mesmo número a cada um desses termos.
- EF04MA16 (Geometria; Localização e movimentação: pontos de referência, direção e sentido Paralelismo e perpendicularismo): Descrever deslocamentos e localização de pessoas e de objetos no espaço, por meio de malhas quadriculadas e representações como desenhos, mapas, planta baixa e croquis, empregando termos como direita e esquerda, mudanças de direção e sentido, intersecção, transversais, paralelas e perpendiculares.
- EF04MA17 (Geometria; Figuras geométricas espaciais (prismas e pirâmides): reconhecimento, representações, planificações e características): Associar prismas e pirâmides a suas planificações e analisar, nomear e comparar seus atributos, estabelecendo relações entre as representações planas e espaciais.
- EF04MA19 (Geometria; Simetria de reflexão): Reconhecer simetria de reflexão em figuras e em pares de figuras geométricas planas e utilizá-la na construção de figuras congruentes, com o uso de malhas quadriculadas e de softwares de geometria.
- EF04MA21 (Grandezas e medidas; Áreas de figuras construídas em malhas quadriculadas): Medir, comparar e estimar área de figuras planas desenhadas em malha quadriculada, pela contagem dos quadradinhos ou de metades de quadradinho, reconhecendo que duas figuras com formatos diferentes podem ter a mesma medida de área.
- EF04MA22 (Grandezas e medidas; Medidas de tempo: leitura de horas em relógios digitais e analógicos, duração de eventos e relações entre unidades de medida de tempo): Ler e registrar medidas e intervalos de tempo em horas, minutos e segundos em situações relacionadas ao seu cotidiano, como informar os horários de início e término de realização de uma tarefa e sua duração.
- EF04MA23 (Grandezas e medidas; Medidas de temperatura em grau Celsius: construção de gráficos para indicar a variação da temperatura (mínima e máxima) medida em um dado dia ou em uma semana): Reconhecer temperatura como grandeza e o grau Celsius como unidade de medida a ela associada e utilizá-lo em comparações de temperaturas em diferentes regiões do Brasil ou no exterior ou, ainda, em discussões que envolvam problemas relacionados ao aquecimento global.
- EF04MA24 (Grandezas e medidas; Medidas de temperatura em grau Celsius: construção de gráficos para indicar a variação da temperatura (mínima e máxima) medida em um dado dia ou em uma semana): Registrar as temperaturas máxima e mínima diárias, em locais do seu cotidiano, e elaborar gráficos de colunas com as variações diárias da temperatura, utilizando, inclusive, planilhas eletrônicas.
- EF04MA26 (Probabilidade e estatística; Análise de chances de eventos aleatórios): Identificar, entre eventos aleatórios cotidianos, aqueles que têm maior chance de ocorrência, reconhecendo características de resultados mais prováveis, sem utilizar frações.
- EF04MA27 (Probabilidade e estatística; Leitura, interpretação e representação de dados em tabelas de dupla entrada, gráficos de colunas simples e agrupadas, gráficos de barras e colunas e gráficos pictóricos): Analisar dados apresentados em tabelas simples ou de dupla entrada e em gráficos de colunas ou pictóricos, com base em informações das diferentes áreas do conhecimento, e produzir texto com a síntese de sua análise.
- EF04MA28 (Probabilidade e estatística; Diferenciação entre variáveis categóricas e variáveis numéricas Coleta, classificação e representação de dados de pesquisa realizada): Realizar pesquisa envolvendo variáveis categóricas e numéricas e organizar dados coletados por meio de tabelas e gráficos de colunas simples ou agrupadas, com e sem uso de tecnologias digitais. [pesquisa de campo: fora do alcance do app]

**5º ano**: 25 habilidades, 13 tocadas pelo app, 12 não cobertas.
- Cobertas: EF05MA02, EF05MA03, EF05MA04, EF05MA05, EF05MA06, EF05MA07, EF05MA08, EF05MA11, EF05MA12, EF05MA17, EF05MA19, EF05MA22, EF05MA23
- EF05MA01 (Números; Sistema de numeração decimal: leitura, escrita e ordenação de números naturais (de até seis ordens)): Ler, escrever e ordenar números naturais até a ordem das centenas de milhar com compreensão das principais características do sistema de numeração decimal.
- EF05MA09 (Números; Problemas de contagem do tipo: “Se cada objeto de uma coleção A for combinado com todos os elementos de uma coleção B, quantos agrupamentos desse tipo podem ser formados?”): Resolver e elaborar problemas simples de contagem envolvendo o princípio multiplicativo, como a determinação do número de agrupamentos possíveis ao se combinar cada elemento de uma coleção com todos os elementos de outra coleção, por meio de diagramas de árvore ou por tabelas. [a parte "resolver" cabe no app; "elaborar problemas" não]
- EF05MA10 (Álgebra; Propriedades da igualdade e noção de equivalência): Concluir, por meio de investigações, que a relação de igualdade existente entre dois membros permanece ao adicionar, subtrair, multiplicar ou dividir cada um desses membros por um mesmo número, para construir a noção de equivalência.
- EF05MA13 (Álgebra; Problemas envolvendo a partição de um todo em duas partes proporcionais): Resolver problemas envolvendo a partilha de uma quantidade em duas partes desiguais, tais como dividir uma quantidade em duas partes, de modo que uma seja o dobro da outra, com compreensão da ideia de razão entre as partes e delas com o todo.
- EF05MA14 (Geometria; Plano cartesiano: coordenadas cartesianas (1º quadrante) e representação de deslocamentos no plano cartesiano): Utilizar e compreender diferentes representações para a localização de objetos no plano, como mapas, células em planilhas eletrônicas e coordenadas geográficas, a fim de desenvolver as primeiras noções de coordenadas cartesianas.
- EF05MA15 (Geometria; Plano cartesiano: coordenadas cartesianas (1º quadrante) e representação de deslocamentos no plano cartesiano): Interpretar, descrever e representar a localização ou movimentação de objetos no plano cartesiano (1º quadrante), utilizando coordenadas cartesianas, indicando mudanças de direção e de sentido e giros.
- EF05MA16 (Geometria; Figuras geométricas espaciais: reconhecimento, representações, planificações e características): Associar figuras espaciais a suas planificações (prismas, pirâmides, cilindros e cones) e analisar, nomear e comparar seus atributos.
- EF05MA18 (Geometria; Ampliação e redução de figuras poligonais em malhas quadriculadas: reconhecimento da congruência dos ângulos e da proporcionalidade dos lados correspondentes): Reconhecer a congruência dos ângulos e a proporcionalidade entre os lados correspondentes de figuras poligonais em situações de ampliação e de redução em malhas quadriculadas e usando tecnologias digitais.
- EF05MA20 (Grandezas e medidas; Áreas e perímetros de figuras poligonais: algumas relações): Concluir, por meio de investigações, que figuras de perímetros iguais podem ter áreas diferentes e que, também, figuras que têm a mesma área podem ter perímetros diferentes.
- EF05MA21 (Grandezas e medidas; Noção de volume): Reconhecer volume como grandeza associada a sólidos geométricos e medir volumes por meio de empilhamento de cubos, utilizando, preferencialmente, objetos concretos.
- EF05MA24 (Probabilidade e estatística; Leitura, coleta, classificação interpretação e representação de dados em tabelas de dupla entrada, gráfico de colunas agrupadas, gráficos pictóricos e gráfico de linhas): Interpretar dados estatísticos apresentados em textos, tabelas e gráficos (colunas ou linhas), referentes a outras áreas do conhecimento ou a outros contextos, como saúde e trânsito, e produzir textos com o objetivo de sintetizar conclusões.
- EF05MA25 (Probabilidade e estatística; Leitura, coleta, classificação interpretação e representação de dados em tabelas de dupla entrada, gráfico de colunas agrupadas, gráficos pictóricos e gráfico de linhas): Realizar pesquisa envolvendo variáveis categóricas e numéricas, organizar dados coletados por meio de tabelas, gráficos de colunas, pictóricos e de linhas, com e sem uso de tecnologias digitais, e apresentar texto escrito sobre a finalidade da pesquisa e a síntese dos resultados. [pesquisa de campo: fora do alcance do app]

**6º ano**: 34 habilidades, 16 tocadas pelo app, 18 não cobertas.
- Cobertas: EF06MA03, EF06MA05, EF06MA06, EF06MA07, EF06MA08, EF06MA09, EF06MA10, EF06MA12, EF06MA13, EF06MA14, EF06MA20, EF06MA24, EF06MA25, EF06MA26, EF06MA29, EF06MA30
- EF06MA01 (Números; Sistema de numeração decimal: características, leitura, escrita e comparação de números naturais e de números racionais representados na forma decimal): Comparar, ordenar, ler e escrever números naturais e números racionais cuja representação decimal é finita, fazendo uso da reta numérica.
- EF06MA02 (Números; Sistema de numeração decimal: características, leitura, escrita e comparação de números naturais e de números racionais representados na forma decimal): Reconhecer o sistema de numeração decimal, como o que prevaleceu no mundo ocidental, e destacar semelhanças e diferenças com outros sistemas, de modo a sistematizar suas principais características (base, valor posicional e função do zero), utilizando, inclusive, a composição e decomposição de números naturais e números racionais em sua representação decimal.
- EF06MA04 (Números; Fluxograma para determinar a paridade de um número natural): Construir algoritmo em linguagem natural e representá-lo por fluxograma que indique a resolução de um problema simples (por exemplo, se um número natural qualquer é par).
- EF06MA11 (Números; Operações (adição, subtração, multiplicação, divisão e potenciação) com números racionais): Resolver e elaborar problemas com números racionais positivos na representação decimal, envolvendo as quatro operações fundamentais e a potenciação, por meio de estratégias diversas, utilizando estimativas e arredondamentos para verificar a razoabilidade de respostas, com e sem uso de calculadora. [a parte "resolver" cabe no app; "elaborar problemas" não]
- EF06MA15 (Álgebra; Problemas que tratam da partição de um todo em duas partes desiguais, envolvendo razões entre as partes e entre uma das partes e o todo): Resolver e elaborar problemas que envolvam a partilha de uma quantidade em duas partes desiguais, envolvendo relações aditivas e multiplicativas, bem como a razão entre as partes e entre uma das partes e o todo. [a parte "resolver" cabe no app; "elaborar problemas" não]
- EF06MA16 (Geometria; Plano cartesiano: associação dos vértices de um polígono a pares ordenados): Associar pares ordenados de números a pontos do plano cartesiano do 1º quadrante, em situações como a localização dos vértices de um polígono.
- EF06MA17 (Geometria; Prismas e pirâmides: planificações e relações entre seus elementos (vértices, faces e arestas)): Quantificar e estabelecer relações entre o número de vértices, faces e arestas de prismas e pirâmides, em função do seu polígono da base, para resolver problemas e desenvolver a percepção espacial.
- EF06MA18 (Geometria; Polígonos: classificações quanto ao número de vértices, às medidas de lados e ângulos e ao paralelismo e perpendicularismo dos lados): Reconhecer, nomear e comparar polígonos, considerando lados, vértices e ângulos, e classificá-los em regulares e não regulares, tanto em suas representações no plano como em faces de poliedros.
- EF06MA19 (Geometria; Polígonos: classificações quanto ao número de vértices, às medidas de lados e ângulos e ao paralelismo e perpendicularismo dos lados): Identificar características dos triângulos e classificá-los em relação às medidas dos lados e dos ângulos.
- EF06MA21 (Geometria; Construção de figuras semelhantes: ampliação e redução de figuras planas em malhas quadriculadas): Construir figuras planas semelhantes em situações de ampliação e de redução, com o uso de malhas quadriculadas, plano cartesiano ou tecnologias digitais.
- EF06MA22 (Geometria; Construção de retas paralelas e perpendiculares, fazendo uso de réguas, esquadros e softwares): Utilizar instrumentos, como réguas e esquadros, ou softwares para representações de retas paralelas e perpendiculares e construção de quadriláteros, entre outros.
- EF06MA23 (Geometria; Construção de retas paralelas e perpendiculares, fazendo uso de réguas, esquadros e softwares): Construir algoritmo para resolver situações passo a passo (como na construção de dobraduras ou na indicação de deslocamento de um objeto no plano segundo pontos de referência e distâncias fornecidas etc.).
- EF06MA27 (Grandezas e medidas; Ângulos: noção, usos e medida): Determinar medidas da abertura de ângulos, por meio de transferidor e/ou tecnologias digitais.
- EF06MA28 (Grandezas e medidas; Plantas baixas e vistas aéreas): Interpretar, descrever e desenhar plantas baixas simples de residências e vistas aéreas.
- EF06MA31 (Probabilidade e estatística; Leitura e interpretação de tabelas e gráficos (de colunas ou barras simples ou múltiplas) referentes a variáveis categóricas e variáveis numéricas): Identificar as variáveis e suas frequências e os elementos constitutivos (título, eixos, legendas, fontes e datas) em diferentes tipos de gráfico.
- EF06MA32 (Probabilidade e estatística; Leitura e interpretação de tabelas e gráficos (de colunas ou barras simples ou múltiplas) referentes a variáveis categóricas e variáveis numéricas): Interpretar e resolver situações que envolvam dados de pesquisas sobre contextos ambientais, sustentabilidade, trânsito, consumo responsável, entre outros, apresentadas pela mídia em tabelas e em diferentes tipos de gráficos e redigir textos escritos com o objetivo de sintetizar conclusões.
- EF06MA33 (Probabilidade e estatística; Coleta de dados, organização e registro): Planejar e coletar dados de pesquisa referente a práticas sociais escolhidas pelos alunos e fazer uso de planilhas eletrônicas para registro, representação e interpretação das informações, em tabelas, vários tipos de gráficos e texto. [pesquisa de campo: fora do alcance do app]
- EF06MA34 (Probabilidade e estatística; Diferentes tipos de representação de informações: gráficos e fluxogramas): Interpretar e desenvolver fluxogramas simples, identificando as relações entre os objetos representados (por exemplo, posição de cidades considerando as estradas que as unem, hierarquia dos funcionários de uma empresa etc.).

**7º ano**: 37 habilidades, 10 tocadas pelo app, 27 não cobertas.
- Cobertas: EF07MA02, EF07MA03, EF07MA04, EF07MA09, EF07MA17, EF07MA18, EF07MA24, EF07MA30, EF07MA31, EF07MA35
- EF07MA01 (Números; Múltiplos e divisores de um número natural): Resolver e elaborar problemas com números naturais, envolvendo as noções de divisor e de múltiplo, podendo incluir máximo divisor comum ou mínimo múltiplo comum, por meio de estratégias diversas, sem a aplicação de algoritmos. [a parte "resolver" cabe no app; "elaborar problemas" não]
- EF07MA05 (Números; Fração e seus significados: como parte de inteiros, resultado da divisão, razão e operador): Resolver um mesmo problema utilizando diferentes algoritmos.
- EF07MA06 (Números; Fração e seus significados: como parte de inteiros, resultado da divisão, razão e operador): Reconhecer que as resoluções de um grupo de problemas que têm a mesma estrutura podem ser obtidas utilizando os mesmos procedimentos.
- EF07MA07 (Números; Fração e seus significados: como parte de inteiros, resultado da divisão, razão e operador): Representar por meio de um fluxograma os passos utilizados para resolver um grupo de problemas.
- EF07MA08 (Números; Fração e seus significados: como parte de inteiros, resultado da divisão, razão e operador): Comparar e ordenar frações associadas às ideias de partes de inteiros, resultado da divisão, razão e operador.
- EF07MA10 (Números; Números racionais na representação fracionária e na decimal: usos, ordenação e associação com pontos da reta numérica e operações): Comparar e ordenar números racionais em diferentes contextos e associá-los a pontos da reta numérica.
- EF07MA11 (Números; Números racionais na representação fracionária e na decimal: usos, ordenação e associação com pontos da reta numérica e operações): Compreender e utilizar a multiplicação e a divisão de números racionais, a relação entre elas e suas propriedades operatórias.
- EF07MA12 (Números; Números racionais na representação fracionária e na decimal: usos, ordenação e associação com pontos da reta numérica e operações): Resolver e elaborar problemas que envolvam as operações com números racionais. [a parte "resolver" cabe no app; "elaborar problemas" não]
- EF07MA13 (Álgebra; Linguagem algébrica: variável e incógnita): Compreender a ideia de variável, representada por letra ou símbolo, para expressar relação entre duas grandezas, diferenciando-a da ideia de incógnita.
- EF07MA14 (Álgebra; Linguagem algébrica: variável e incógnita): Classificar sequências em recursivas e não recursivas, reconhecendo que o conceito de recursão está presente não apenas na matemática, mas também nas artes e na literatura.
- EF07MA15 (Álgebra; Linguagem algébrica: variável e incógnita): Utilizar a simbologia algébrica para expressar regularidades encontradas em sequências numéricas.
- EF07MA16 (Álgebra; Equivalência de expressões algébricas: identificação da regularidade de uma sequência numérica): Reconhecer se duas expressões algébricas obtidas para descrever a regularidade de uma mesma sequência numérica são ou não equivalentes.
- EF07MA19 (Geometria; Transformações geométricas de polígonos no plano cartesiano: multiplicação das coordenadas por um número inteiro e obtenção de simétricos em relação aos eixos e à origem): Realizar transformações de polígonos representados no plano cartesiano, decorrentes da multiplicação das coordenadas de seus vértices por um número inteiro.
- EF07MA20 (Geometria; Transformações geométricas de polígonos no plano cartesiano: multiplicação das coordenadas por um número inteiro e obtenção de simétricos em relação aos eixos e à origem): Reconhecer e representar, no plano cartesiano, o simétrico de figuras em relação aos eixos e à origem.
- EF07MA21 (Geometria; Simetrias de translação, rotação e reflexão): Reconhecer e construir figuras obtidas por simetrias de translação, rotação e reflexão, usando instrumentos de desenho ou softwares de geometria dinâmica e vincular esse estudo a representações planas de obras de arte, elementos arquitetônicos, entre outros.
- EF07MA22 (Geometria; A circunferência como lugar geométrico): Construir circunferências, utilizando compasso, reconhecê-las como lugar geométrico e utilizá-las para fazer composições artísticas e resolver problemas que envolvam objetos equidistantes.
- EF07MA23 (Geometria; Relações entre os ângulos formados por retas paralelas intersectadas por uma transversal): Verificar relações entre os ângulos formados por retas paralelas cortadas por uma transversal, com e sem uso de softwares de geometria dinâmica.
- EF07MA25 (Geometria; Triângulos: construção, condição de existência e soma das medidas dos ângulos internos): Reconhecer a rigidez geométrica dos triângulos e suas aplicações, como na construção de estruturas arquitetônicas (telhados, estruturas metálicas e outras) ou nas artes plásticas.
- EF07MA26 (Geometria; Triângulos: construção, condição de existência e soma das medidas dos ângulos internos): Descrever, por escrito e por meio de um fluxograma, um algoritmo para a construção de um triângulo qualquer, conhecidas as medidas dos três lados.
- EF07MA27 (Geometria; Polígonos regulares: quadrado e triângulo equilátero): Calcular medidas de ângulos internos de polígonos regulares, sem o uso de fórmulas, e estabelecer relações entre ângulos internos e externos de polígonos, preferencialmente vinculadas à construção de mosaicos e de ladrilhamentos.
- EF07MA28 (Geometria; Polígonos regulares: quadrado e triângulo equilátero): Descrever, por escrito e por meio de um fluxograma, um algoritmo para a construção de um polígono regular (como quadrado e triângulo equilátero), conhecida a medida de seu lado.
- EF07MA29 (Grandezas e medidas; Problemas envolvendo medições): Resolver e elaborar problemas que envolvam medidas de grandezas inseridos em contextos oriundos de situações cotidianas ou de outras áreas do conhecimento, reconhecendo que toda medida empírica é aproximada. [a parte "resolver" cabe no app; "elaborar problemas" não]
- EF07MA32 (Grandezas e medidas; Equivalência de área de figuras planas: cálculo de áreas de figuras que podem ser decompostas por outras, cujas áreas podem ser facilmente determinadas como triângulos e quadriláteros): Resolver e elaborar problemas de cálculo de medida de área de figuras planas que podem ser decompostas por quadrados, retângulos e/ou triângulos, utilizando a equivalência entre áreas. [a parte "resolver" cabe no app; "elaborar problemas" não]
- EF07MA33 (Grandezas e medidas; Medida do comprimento da circunferência): Estabelecer o número como a razão entre a medida de uma circunferência e seu diâmetro, para compreender e resolver problemas, inclusive os de natureza histórica.
- EF07MA34 (Probabilidade e estatística; Experimentos aleatórios: espaço amostral e estimativa de probabilidade por meio de frequência de ocorrências): Planejar e realizar experimentos aleatórios ou simulações que envolvem cálculo de probabilidades ou estimativas por meio de frequência de ocorrências. [pesquisa de campo: fora do alcance do app]
- EF07MA36 (Probabilidade e estatística; Pesquisa amostral e pesquisa censitária Planejamento de pesquisa, coleta e organização dos dados, construção de tabelas e gráficos e interpretação das informações): Planejar e realizar pesquisa envolvendo tema da realidade social, identificando a necessidade de ser censitária ou de usar amostra, e interpretar os dados para comunicá-los por meio de relatório escrito, tabelas e gráficos, com o apoio de planilhas eletrônicas. [pesquisa de campo: fora do alcance do app]
- EF07MA37 (Probabilidade e estatística; Gráficos de setores: interpretação, pertinência e construção para representar conjunto de dados): Interpretar e analisar dados apresentados em gráfico de setores divulgados pela mídia e compreender quando é possível ou conveniente sua utilização.

### Língua Portuguesa

**1º ano**: 26 habilidades, 10 tocadas pelo app, 16 não cobertas.
- Cobertas: EF01LP02, EF01LP06, EF01LP07, EF01LP08, EF01LP09, EF01LP10, EF01LP11, EF01LP13, EF01LP14, EF01LP26
- EF01LP01 (Leitura/escuta (compartilhada e autônoma); Protocolos de leitura): Reconhecer que textos são lidos e escritos da esquerda para a direita e de cima para baixo da página.
- EF01LP03 (Escrita (compartilhada e autônoma); Construção do sistema alfabético/ Convenções da escrita): Observar escritas convencionais, comparando-as às suas produções escritas, percebendo semelhanças e diferenças. [fora do alcance de um app de perguntas: produção ou oralidade]
- EF01LP04 (Análise linguística/semiótica (Alfabetização); Conhecimento do alfabeto do português do Brasil): Distinguir as letras do alfabeto de outros sinais gráficos.
- EF01LP05 (Análise linguística/semiótica (Alfabetização); Construção do sistema alfabético): Reconhecer o sistema de escrita alfabética como representação dos sons da fala.
- EF01LP12 (Análise linguística/semiótica (Alfabetização); Segmentação de palavras/Classificação de palavras por número de sílabas): Reconhecer a separação das palavras, na escrita, por espaços em branco.
- EF01LP15 (Análise linguística/semiótica (Alfabetização); Sinonímia e antonímia/Morfologia/Pontuação): Agrupar palavras pelo critério de aproximação de significado (sinonímia) e separar palavras pelo critério de oposição de significado (antonímia).
- EF01LP16 (Leitura/escuta (compartilhada e autônoma); Compreensão em leitura): Ler e compreender, em colaboração com os colegas e com a ajuda do professor, quadras, quadrinhas, parlendas, trava-línguas, dentre outros gêneros do campo da vida cotidiana, considerando a situação comunicativa e o tema/assunto do texto e relacionando sua forma de organização à sua finalidade.
- EF01LP17 (Escrita (compartilhada e autônoma); Escrita autônoma e compartilhada): Planejar e produzir, em colaboração com os colegas e com a ajuda do professor, listas, agendas, calendários, avisos, convites, receitas, instruções de montagem e legendas para álbuns, fotos ou ilustrações (digitais ou impressos), dentre outros gêneros do campo da vida cotidiana, considerando a situação comunicativa e o tema/assunto/ finalidade do texto. [fora do alcance de um app de perguntas: produção ou oralidade]
- EF01LP18 (Escrita (compartilhada e autônoma); Escrita autônoma e compartilhada): Registrar, em colaboração com os colegas e com a ajuda do professor, cantigas, quadras, quadrinhas, parlendas, trava-línguas, dentre outros gêneros do campo da vida cotidiana, considerando a situação comunicativa e o tema/assunto/finalidade do texto. [fora do alcance de um app de perguntas: produção ou oralidade]
- EF01LP19 (Oralidade; Produção de texto oral): Recitar parlendas, quadras, quadrinhas, trava-línguas, com entonação adequada e observando as rimas. [fora do alcance de um app de perguntas: produção ou oralidade]
- EF01LP20 (Análise linguística/semiótica (Alfabetização); Forma de composição do texto): Identificar e reproduzir, em listas, agendas, calendários, regras, avisos, convites, receitas, instruções de montagem e legendas para álbuns, fotos ou ilustrações (digitais ou impressos), a formatação e diagramação específica de cada um desses gêneros.
- EF01LP21 (Escrita (compartilhada e autônoma); Escrita compartilhada): Escrever, em colaboração com os colegas e com a ajuda do professor, listas de regras e regulamentos que organizam a vida na comunidade escolar, dentre outros gêneros do campo da atuação cidadã, considerando a situação comunicativa e o tema/assunto do texto. [fora do alcance de um app de perguntas: produção ou oralidade]
- EF01LP22 (Escrita (compartilhada e autônoma); Produção de textos): Planejar e produzir, em colaboração com os colegas e com a ajuda do professor, diagramas, entrevistas, curiosidades, dentre outros gêneros do campo investigativo, digitais ou impressos, considerando a situação comunicativa e o tema/assunto/finalidade do texto. [fora do alcance de um app de perguntas: produção ou oralidade]
- EF01LP23 (Oralidade; Planejamento de texto oral): Planejar e produzir, em colaboração com os colegas e com a ajuda do professor, entrevistas, curiosidades, dentre outros gêneros do campo investigativo, que possam ser repassados oralmente por meio de ferramentas digitais, em áudio ou vídeo, considerando a situação comunicativa e o tema/assunto/finalidade do texto. [fora do alcance de um app de perguntas: produção ou oralidade]
- EF01LP24 (Análise linguística/semiótica (Alfabetização); Forma de composição dos textos/Adequação do texto às normas de escrita): Identificar e reproduzir, em enunciados de tarefas escolares, diagramas, entrevistas, curiosidades, digitais ou impressos, a formatação e diagramação específica de cada um desses gêneros, inclusive em suas versões orais.
- EF01LP25 (Escrita (compartilhada e autônoma); Escrita autônoma e compartilhada): Produzir, tendo o professor como escriba, recontagens de histórias lidas pelo professor, histórias imaginadas ou baseadas em livros de imagens, observando a forma de composição de textos narrativos (personagens, enredo, tempo e espaço). [fora do alcance de um app de perguntas: produção ou oralidade]

**2º ano**: 29 habilidades, 8 tocadas pelo app, 21 não cobertas.
- Cobertas: EF02LP01, EF02LP02, EF02LP03, EF02LP04, EF02LP05, EF02LP09, EF02LP16, EF02LP17
- EF02LP06 (Análise linguística/semiótica (Alfabetização); Conhecimento do alfabeto do português do Brasil): Perceber o princípio acrofônico que opera nos nomes das letras do alfabeto.
- EF02LP07 (Análise linguística/semiótica (Alfabetização); Conhecimento das diversas grafias do alfabeto/ Acentuação): Escrever palavras, frases, textos curtos nas formas imprensa e cursiva.
- EF02LP08 (Análise linguística/semiótica (Alfabetização); Segmentação de palavras/Classificação de palavras por número de sílabas): Segmentar corretamente as palavras ao escrever frases e textos.
- EF02LP10 (Análise linguística/semiótica (Alfabetização); Sinonímia e antonímia/Morfologia/Pontuação): Identificar sinônimos de palavras de texto lido, determinando a diferença de sentido entre eles, e formar antônimos de palavras encontradas em texto lido pelo acréscimo do prefixo de negação in-/im-.
- EF02LP11 (Análise linguística/semiótica (Alfabetização); Morfologia): Formar o aumentativo e o diminutivo de palavras com os sufixos -ão e -inho/-zinho.
- EF02LP12 (Leitura/escuta (compartilhada e autônoma); Compreensão em leitura): Ler e compreender com certa autonomia cantigas, letras de canção, dentre outros gêneros do campo da vida cotidiana, considerando a situação comunicativa e o tema/assunto do texto e relacionando sua forma de organização à sua finalidade.
- EF02LP13 (Escrita (compartilhada e autônoma); Escrita autônoma e compartilhada): Planejar e produzir bilhetes e cartas, em meio impresso e/ou digital, dentre outros gêneros do campo da vida cotidiana, considerando a situação comunicativa e o tema/assunto/finalidade do texto. [fora do alcance de um app de perguntas: produção ou oralidade]
- EF02LP14 (Escrita (compartilhada e autônoma); Escrita autônoma e compartilhada): Planejar e produzir pequenos relatos de observação de processos, de fatos, de experiências pessoais, mantendo as características do gênero, considerando a situação comunicativa e o tema/assunto do texto. [fora do alcance de um app de perguntas: produção ou oralidade]
- EF02LP15 (Oralidade; Produção de texto oral): Cantar cantigas e canções, obedecendo ao ritmo e à melodia. [fora do alcance de um app de perguntas: produção ou oralidade]
- EF02LP18 (Escrita (compartilhada e autônoma); Escrita compartilhada): Planejar e produzir cartazes e folhetos para divulgar eventos da escola ou da comunidade, utilizando linguagem persuasiva e elementos textuais e visuais (tamanho da letra, leiaute, imagens) adequados ao gênero, considerando a situação comunicativa e o tema/assunto do texto. [fora do alcance de um app de perguntas: produção ou oralidade]
- EF02LP19 (Oralidade; Produção de texto oral): Planejar e produzir, em colaboração com os colegas e com a ajuda do professor, notícias curtas para público infantil, para compor jornal falado que possa ser repassado oralmente ou em meio digital, em áudio ou vídeo, dentre outros gêneros do campo jornalístico, considerando a situação comunicativa e o tema/assunto do texto. [fora do alcance de um app de perguntas: produção ou oralidade]
- EF02LP20 (Leitura/escuta (compartilhada e autônoma); Imagens analíticas em textos): Reconhecer a função de textos utilizados para apresentar informações coletadas em atividades de pesquisa (enquetes, pequenas entrevistas, registros de experimentações).
- EF02LP21 (Leitura/escuta (compartilhada e autônoma); Pesquisa): Explorar, com a mediação do professor, textos informativos de diferentes ambientes digitais de pesquisa, conhecendo suas possibilidades.
- EF02LP22 (Escrita (compartilhada e autônoma); Produção de textos): Planejar e produzir, em colaboração com os colegas e com a ajuda do professor, pequenos relatos de experimentos, entrevistas, verbetes de enciclopédia infantil, dentre outros gêneros do campo investigativo, digitais ou impressos, considerando a situação comunicativa e o tema/assunto/finalidade do texto. [fora do alcance de um app de perguntas: produção ou oralidade]
- EF02LP23 (Escrita (compartilhada e autônoma); Escrita autônoma): Planejar e produzir, com certa autonomia, pequenos registros de observação de resultados de pesquisa, coerentes com um tema investigado. [fora do alcance de um app de perguntas: produção ou oralidade]
- EF02LP24 (Oralidade; Planejamento de texto oral): Planejar e produzir, em colaboração com os colegas e com a ajuda do professor, relatos de experimentos, registros de observação, entrevistas, dentre outros gêneros do campo investigativo, que possam ser repassados oralmente por meio de ferramentas digitais, em áudio ou vídeo, considerando a situação comunicativa e o tema/assunto/ finalidade do texto. [fora do alcance de um app de perguntas: produção ou oralidade]
- EF02LP25 (Análise linguística/semiótica (Alfabetização); Forma de composição dos textos/Adequação do texto às normas de escrita): Identificar e reproduzir, em relatos de experimentos, entrevistas, verbetes de enciclopédia infantil, digitais ou impressos, a formatação e diagramação específica de cada um desses gêneros, inclusive em suas versões orais.
- EF02LP26 (Leitura/escuta (compartilhada e autônoma); Formação do leitor literário): Ler e compreender, com certa autonomia, textos literários, de gêneros variados, desenvolvendo o gosto pela leitura.
- EF02LP27 (Escrita (compartilhada e autônoma); Escrita autônoma e compartilhada): Reescrever textos narrativos literários lidos pelo professor. [fora do alcance de um app de perguntas: produção ou oralidade]
- EF02LP28 (Análise linguística/semiótica (Alfabetização); Formas de composição de narrativas): Reconhecer o conflito gerador de uma narrativa ficcional e sua resolução, além de palavras, expressões e frases que caracterizam personagens e ambientes.
- EF02LP29 (Análise linguística/semiótica (Alfabetização); Formas de composição de textos poéticos visuais): Observar, em poemas visuais, o formato do texto na página, as ilustrações e outros efeitos visuais.

**3º ano**: 27 habilidades, 10 tocadas pelo app, 17 não cobertas.
- Cobertas: EF03LP01, EF03LP03, EF03LP04, EF03LP05, EF03LP06, EF03LP07, EF03LP08, EF03LP09, EF03LP11, EF03LP16
- EF03LP02 (Análise linguística/semiótica (Ortografização); Construção do sistema alfabético e da ortografia): Ler e escrever corretamente palavras com sílabas CV, V, CVC, CCV, VC, VV, CVV, identificando que existem vogais em todas as sílabas.
- EF03LP10 (Análise linguística/semiótica (Ortografização); Morfologia): Reconhecer prefixos e sufixos produtivos na formação de palavras derivadas de substantivos, de adjetivos e de verbos, utilizando-os para compreender palavras e para formar novas palavras.
- EF03LP12 (Leitura/escuta (compartilhada e autônoma); Compreensão em leitura): Ler e compreender, com autonomia, cartas pessoais e diários, com expressão de sentimentos e opiniões, dentre outros gêneros do campo da vida cotidiana, de acordo com as convenções do gênero carta e considerando a situação comunicativa e o tema/assunto do texto.
- EF03LP13 (Produção de textos (escrita compartilhada e autônoma); Escrita colaborativa): Planejar e produzir cartas pessoais e diários, com expressão de sentimentos e opiniões, dentre outros gêneros do campo da vida cotidiana, de acordo com as convenções dos gêneros carta e diário e considerando a situação comunicativa e o tema/assunto do texto. [fora do alcance de um app de perguntas: produção ou oralidade]
- EF03LP14 (Escrita (compartilhada e autônoma); Escrita colaborativa): Planejar e produzir textos injuntivos instrucionais, com a estrutura própria desses textos (verbos imperativos, indicação de passos a ser seguidos) e mesclando palavras, imagens e recursos gráfico-visuais, considerando a situação comunicativa e o tema/ assunto do texto. [fora do alcance de um app de perguntas: produção ou oralidade]
- EF03LP15 (Oralidade; Produção de texto oral): Assistir, em vídeo digital, a programa de culinária infantil e, a partir dele, planejar e produzir receitas em áudio ou vídeo. [fora do alcance de um app de perguntas: produção ou oralidade]
- EF03LP17 (Análise linguística/semiótica (Ortografização); Forma de composição do texto): Identificar e reproduzir, em gêneros epistolares e diários, a formatação própria desses textos (relatos de acontecimentos, expressão de vivências, emoções, opiniões ou críticas) e a diagramação específica dos textos desses gêneros (data, saudação, corpo do texto, despedida, assinatura).
- EF03LP18 (Leitura/escuta (compartilhada e autônoma); Compreensão em leitura): Ler e compreender, com autonomia, cartas dirigidas a veículos da mídia impressa ou digital (cartas de leitor e de reclamação a jornais, revistas) e notícias, dentre outros gêneros do campo jornalístico, de acordo com as convenções do gênero carta e considerando a situação comunicativa e o tema/assunto do texto.
- EF03LP19 (Leitura/escuta (compartilhada e autônoma); Compreensão em leitura): Identificar e discutir o propósito do uso de recursos de persuasão (cores, imagens, escolha de palavras, jogo de palavras, tamanho de letras) em textos publicitários e de propaganda, como elementos de convencimento.
- EF03LP20 (Produção de textos (escrita compartilhada e autônoma); Escrita colaborativa): Produzir cartas dirigidas a veículos da mídia impressa ou digital (cartas do leitor ou de reclamação a jornais ou revistas), dentre outros gêneros do campo político-cidadão, com opiniões e críticas, de acordo com as convenções do gênero carta e considerando a situação comunicativa e o tema/assunto do texto. [fora do alcance de um app de perguntas: produção ou oralidade]
- EF03LP21 (Produção de textos (escrita compartilhada e autônoma); Escrita colaborativa): Produzir anúncios publicitários, textos de campanhas de conscientização destinados ao público infantil, observando os recursos de persuasão utilizados nos textos publicitários e de propaganda (cores, imagens, slogan, escolha de palavras, jogo de palavras, tamanho e tipo de letras, diagramação). [fora do alcance de um app de perguntas: produção ou oralidade]
- EF03LP22 (Oralidade; Planejamento e produção de texto): Planejar e produzir, em colaboração com os colegas, telejornal para público infantil com algumas notícias e textos de campanhas que possam ser repassados oralmente ou em meio digital, em áudio ou vídeo, considerando a situação comunicativa, a organização específica da fala nesses gêneros e o tema/assunto/ finalidade dos textos. [fora do alcance de um app de perguntas: produção ou oralidade]
- EF03LP23 (Análise linguística/semiótica (Ortografização); Forma de composição dos textos): Analisar o uso de adjetivos em cartas dirigidas a veículos da mídia impressa ou digital (cartas do leitor ou de reclamação a jornais ou revistas), digitais ou impressas.
- EF03LP24 (Leitura/escuta (compartilhada e autônoma); Compreensão em leitura): Ler/ouvir e compreender, com autonomia, relatos de observações e de pesquisas em fontes de informações, considerando a situação comunicativa e o tema/assunto do texto.
- EF03LP25 (Produção de textos (escrita compartilhada e autônoma); Produção de textos): Planejar e produzir textos para apresentar resultados de observações e de pesquisas em fontes de informações, incluindo, quando pertinente, imagens, diagramas e gráficos ou tabelas simples, considerando a situação comunicativa e o tema/assunto do texto. [fora do alcance de um app de perguntas: produção ou oralidade]
- EF03LP26 (Análise linguística/semiótica (Ortografização); Forma de composição dos textos): Identificar e reproduzir, em relatórios de observação e pesquisa, a formatação e diagramação específica desses gêneros (passos ou listas de itens, tabelas, ilustrações, gráficos, resumo dos resultados), inclusive em suas versões orais.
- EF03LP27 (Oralidade; Performances orais): Recitar cordel e cantar repentes e emboladas, observando as rimas e obedecendo ao ritmo e à melodia. [fora do alcance de um app de perguntas: produção ou oralidade]

**4º ano**: 27 habilidades, 5 tocadas pelo app, 22 não cobertas.
- Cobertas: EF04LP01, EF04LP03, EF04LP05, EF04LP07, EF04LP08
- EF04LP02 (Análise linguística/semiótica (Ortografização); Construção do sistema alfabético e da ortografia): Ler e escrever, corretamente, palavras com sílabas VV e CVV em casos nos quais a combinação VV (ditongo) é reduzida na língua oral (ai, ei, ou).
- EF04LP04 (Análise linguística/semiótica (Ortografização); Conhecimento das diversas grafias do alfabeto/ Acentuação): Usar acento gráfico (agudo ou circunflexo) em paroxítonas terminadas em -i(s), -l, -r, -ão(s).
- EF04LP06 (Análise linguística/semiótica (Ortografização); Morfologia/Morfossintaxe): Identificar em textos e usar na produção textual a concordância entre substantivo ou pronome pessoal e verbo (concordância verbal).
- EF04LP09 (Leitura/escuta (compartilhada e autônoma); Compreensão em leitura): Ler e compreender, com autonomia, boletos, faturas e carnês, dentre outros gêneros do campo da vida cotidiana, de acordo com as convenções do gênero (campos, itens elencados, medidas de consumo, código de barras) e considerando a situação comunicativa e a finalidade do texto.
- EF04LP10 (Leitura/escuta (compartilhada e autônoma); Compreensão em leitura): Ler e compreender, com autonomia, cartas pessoais de reclamação, dentre outros gêneros do campo da vida cotidiana, de acordo com as convenções do gênero carta e considerando a situação comunicativa e o tema/assunto/finalidade do texto.
- EF04LP11 (Produção de textos (escrita compartilhada e autônoma); Escrita colaborativa): Planejar e produzir, com autonomia, cartas pessoais de reclamação, dentre outros gêneros do campo da vida cotidiana, de acordo com as convenções do gênero carta e com a estrutura própria desses textos (problema, opinião, argumentos), considerando a situação comunicativa e o tema/assunto/finalidade do texto. [fora do alcance de um app de perguntas: produção ou oralidade]
- EF04LP12 (Oralidade; Produção de texto oral): Assistir, em vídeo digital, a programa infantil com instruções de montagem, de jogos e brincadeiras e, a partir dele, planejar e produzir tutoriais em áudio ou vídeo. [fora do alcance de um app de perguntas: produção ou oralidade]
- EF04LP13 (Análise linguística/semiótica (Ortografização); Forma de composição do texto): Identificar e reproduzir, em textos injuntivos instrucionais (instruções de jogos digitais ou impressos), a formatação própria desses textos (verbos imperativos, indicação de passos a ser seguidos) e formato específico dos textos orais ou escritos desses gêneros (lista/ apresentação de materiais e instruções/passos de jogo).
- EF04LP14 (Leitura/escuta (compartilhada e autônoma); Compreensão em leitura): Identificar, em notícias, fatos, participantes, local e momento/tempo da ocorrência do fato noticiado.
- EF04LP15 (Leitura/escuta (compartilhada e autônoma); Compreensão em leitura): Distinguir fatos de opiniões/sugestões em textos (informativos, jornalísticos, publicitários etc.).
- EF04LP16 (Produção de textos (escrita compartilhada e autônoma); Escrita colaborativa): Produzir notícias sobre fatos ocorridos no universo escolar, digitais ou impressas, para o jornal da escola, noticiando os fatos e seus atores e comentando decorrências, de acordo com as convenções do gênero notícia e considerando a situação comunicativa e o tema/assunto do texto. [fora do alcance de um app de perguntas: produção ou oralidade]
- EF04LP17 (Oralidade; Planejamento e produção de texto): Produzir jornais radiofônicos ou televisivos e entrevistas veiculadas em rádio, TV e na internet, orientando-se por roteiro ou texto e demonstrando conhecimento dos gêneros jornal falado/televisivo e entrevista. [fora do alcance de um app de perguntas: produção ou oralidade]
- EF04LP18 (Análise linguística/semiótica (Ortografização); Forma de composição dos textos): Analisar o padrão entonacional e a expressão facial e corporal de âncoras de jornais radiofônicos ou televisivos e de entrevistadores/entrevistados.
- EF04LP19 (Leitura/escuta (compartilhada e autônoma); Compreensão em leitura): Ler e compreender textos expositivos de divulgação científica para crianças, considerando a situação comunicativa e o tema/ assunto do texto.
- EF04LP20 (Leitura/escuta (compartilhada e autônoma); Imagens analíticas em textos): Reconhecer a função de gráficos, diagramas e tabelas em textos, como forma de apresentação de dados e informações.
- EF04LP21 (Produção de textos (escrita compartilhada e autônoma); Produção de textos): Planejar e produzir textos sobre temas de interesse, com base em resultados de observações e pesquisas em fontes de informações impressas ou eletrônicas, incluindo, quando pertinente, imagens e gráficos ou tabelas simples, considerando a situação comunicativa e o tema/assunto do texto. [fora do alcance de um app de perguntas: produção ou oralidade]
- EF04LP22 (Produção de textos (escrita compartilhada e autônoma); Escrita autônoma): Planejar e produzir, com certa autonomia, verbetes de enciclopédia infantil, digitais ou impressos, considerando a situação comunicativa e o tema/ assunto/finalidade do texto. [fora do alcance de um app de perguntas: produção ou oralidade]
- EF04LP23 (Análise linguística/semiótica (Ortografização); Forma de composição dos textos): Identificar e reproduzir, em verbetes de enciclopédia infantil, digitais ou impressos, a formatação e diagramação específica desse gênero (título do verbete, definição, detalhamento, curiosidades), considerando a situação comunicativa e o tema/ assunto/finalidade do texto.
- EF04LP24 (Análise linguística/semiótica (Ortografização); Forma de composição dos textos): Identificar e reproduzir, em seu formato, tabelas, diagramas e gráficos em relatórios de observação e pesquisa, como forma de apresentação de dados e informações.
- EF04LP25 (Oralidade; Performances orais): Representar cenas de textos dramáticos, reproduzindo as falas das personagens, de acordo com as rubricas de interpretação e movimento indicadas pelo autor. [fora do alcance de um app de perguntas: produção ou oralidade]
- EF04LP26 (Análise linguística/semiótica (Ortografização); Forma de composição de textos poéticos visuais): Observar, em poemas concretos, o formato, a distribuição e a diagramação das letras do texto na página.
- EF04LP27 (Análise linguística/semiótica (Ortografização); Forma de composição de textos dramáticos): Identificar, em textos dramáticos, marcadores das falas das personagens e de cena.

**5º ano**: 28 habilidades, 4 tocadas pelo app, 24 não cobertas.
- Cobertas: EF05LP01, EF05LP03, EF05LP05, EF05LP07
- EF05LP02 (Análise linguística/semiótica (Ortografização); Conhecimento do alfabeto do português do Brasil/Ordem alfabética/Polissemia): Identificar o caráter polissêmico das palavras (uma mesma palavra com diferentes significados, de acordo com o contexto de uso), comparando o significado de determinados termos utilizados nas áreas científicas com esses mesmos termos utilizados na linguagem usual.
- EF05LP04 (Análise linguística/semiótica (Ortografização); Pontuação): Diferenciar, na leitura de textos, vírgula, ponto e vírgula, dois-pontos e reconhecer, na leitura de textos, o efeito de sentido que decorre do uso de reticências, aspas, parênteses.
- EF05LP06 (Análise linguística/semiótica (Ortografização); Morfologia/Morfossintaxe): Flexionar, adequadamente, na escrita e na oralidade, os verbos em concordância com pronomes pessoais/nomes sujeitos da oração.
- EF05LP08 (Análise linguística/semiótica (Ortografização); Morfologia): Diferenciar palavras primitivas, derivadas e compostas, e derivadas por adição de prefixo e de sufixo.
- EF05LP09 (Leitura/escuta (compartilhada e autônoma); Compreensão em leitura): Ler e compreender, com autonomia, textos instrucional de regras de jogo, dentre outros gêneros do campo da vida cotidiana, de acordo com as convenções do gênero e considerando a situação comunicativa e a finalidade do texto.
- EF05LP10 (Leitura/escuta (compartilhada e autônoma); Compreensão em leitura): Ler e compreender, com autonomia, anedotas, piadas e cartuns, dentre outros gêneros do campo da vida cotidiana, de acordo com as convenções do gênero e considerando a situação comunicativa e a finalidade do texto.
- EF05LP11 (Produção de textos (escrita compartilhada e autônoma); Escrita colaborativa): Registrar, com autonomia, anedotas, piadas e cartuns, dentre outros gêneros do campo da vida cotidiana, de acordo com as convenções do gênero e considerando a situação comunicativa e a finalidade do texto. [fora do alcance de um app de perguntas: produção ou oralidade]
- EF05LP12 (Escrita (compartilhada e autônoma); Escrita colaborativa): Planejar e produzir, com autonomia, textos instrucionais de regras de jogo, dentre outros gêneros do campo da vida cotidiana, de acordo com as convenções do gênero e considerando a situação comunicativa e a finalidade do texto. [fora do alcance de um app de perguntas: produção ou oralidade]
- EF05LP13 (Oralidade; Produção de texto oral): Assistir, em vídeo digital, a postagem de vlog infantil de críticas de brinquedos e livros de literatura infantil e, a partir dele, planejar e produzir resenhas digitais em áudio ou vídeo. [fora do alcance de um app de perguntas: produção ou oralidade]
- EF05LP14 (Análise linguística/semiótica (Ortografização); Forma de composição do texto): Identificar e reproduzir, em textos de resenha crítica de brinquedos ou livros de literatura infantil, a formatação própria desses textos (apresentação e avaliação do produto).
- EF05LP15 (Leitura/escuta (compartilhada e autônoma); Compreensão em leitura): Ler/assistir e compreender, com autonomia, notícias, reportagens, vídeos em vlogs argumentativos, dentre outros gêneros do campo político-cidadão, de acordo com as convenções dos gêneros e considerando a situação comunicativa e o tema/assunto do texto.
- EF05LP16 (Leitura/escuta (compartilhada e autônoma); Compreensão em leitura): Comparar informações sobre um mesmo fato veiculadas em diferentes mídias e concluir sobre qual é mais confiável e por quê.
- EF05LP17 (Produção de textos (escrita compartilhada e autônoma); Escrita colaborativa): Produzir roteiro para edição de uma reportagem digital sobre temas de interesse da turma, a partir de buscas de informações, imagens, áudios e vídeos na internet, de acordo com as convenções do gênero e considerando a situação comunicativa e o tema/assunto do texto. [fora do alcance de um app de perguntas: produção ou oralidade]
- EF05LP18 (Oralidade; Planejamento e produção de texto): Roteirizar, produzir e editar vídeo para vlogs argumentativos sobre produtos de mídia para público infantil (filmes, desenhos animados, HQs, games etc.), com base em conhecimentos sobre os mesmos, de acordo com as convenções do gênero e considerando a situação comunicativa e o tema/ assunto/finalidade do texto. [fora do alcance de um app de perguntas: produção ou oralidade]
- EF05LP19 (Oralidade; Produção de texto): Argumentar oralmente sobre acontecimentos de interesse social, com base em conhecimentos sobre fatos divulgados em TV, rádio, mídia impressa e digital, respeitando pontos de vista diferentes. [fora do alcance de um app de perguntas: produção ou oralidade]
- EF05LP20 (Análise linguística/semiótica (Ortografização); Forma de composição dos textos): Analisar a validade e força de argumentos em argumentações sobre produtos de mídia para público infantil (filmes, desenhos animados, HQs, games etc.), com base em conhecimentos sobre os mesmos.
- EF05LP21 (Análise linguística/semiótica (Ortografização); Forma de composição dos textos): Analisar o padrão entonacional, a expressão facial e corporal e as escolhas de variedade e registro linguísticos de vloggers de vlogs opinativos ou argumentativos.
- EF05LP22 (Leitura/escuta (compartilhada e autônoma); Compreensão em leitura): Ler e compreender verbetes de dicionário, identificando a estrutura, as informações gramaticais (significado de abreviaturas) e as informações semânticas.
- EF05LP23 (Leitura/escuta (compartilhada e autônoma); Imagens analíticas em textos): Comparar informações apresentadas em gráficos ou tabelas.
- EF05LP24 (Produção de textos (escrita compartilhada e autônoma); Produção de textos): Planejar e produzir texto sobre tema de interesse, organizando resultados de pesquisa em fontes de informação impressas ou digitais, incluindo imagens e gráficos ou tabelas, considerando a situação comunicativa e o tema/assunto do texto. [fora do alcance de um app de perguntas: produção ou oralidade]
- EF05LP25 (Produção de textos (escrita compartilhada e autônoma); Escrita autônoma): Planejar e produzir, com certa autonomia, verbetes de dicionário, digitais ou impressos, considerando a situação comunicativa e o tema/assunto/finalidade do texto. [fora do alcance de um app de perguntas: produção ou oralidade]
- EF05LP26 (Análise linguística/semiótica (Ortografização); Forma de composição dos textos): Utilizar, ao produzir o texto, conhecimentos linguísticos e gramaticais: regras sintáticas de concordância nominal e verbal, convenções de escrita de citações, pontuação (ponto final, dois-pontos, vírgulas em enumerações) e regras ortográficas.
- EF05LP27 (Análise linguística/semiótica (Ortografização); Forma de composição dos textos): Utilizar, ao produzir o texto, recursos de coesão pronominal (pronomes anafóricos) e articuladores de relações de sentido (tempo, causa, oposição, conclusão, comparação), com nível adequado de informatividade.
- EF05LP28 (Análise linguística/semiótica (Ortografização); Forma de composição de textos poéticos visuais): Observar, em ciberpoemas e minicontos infantis em mídia digital, os recursos multissemióticos presentes nesses textos digitais.

### Língua Inglesa

**6º ano**: 26 habilidades, 8 tocadas pelo app, 18 não cobertas.
- Cobertas: EF06LI02, EF06LI03, EF06LI04, EF06LI05, EF06LI08, EF06LI16, EF06LI17, EF06LI18
- EF06LI01 (Interação discursiva; Construção de laços afetivos e convívio social): Interagir em situações de intercâmbio oral, demonstrando iniciativa para utilizar a língua inglesa. [fora do alcance de um app de perguntas: produção ou oralidade]
- EF06LI06 (Produção oral; Produção de textos orais, com a mediação do professor): Planejar apresentação sobre a família, a comunidade e a escola, compartilhando-a oralmente com o grupo. [fora do alcance de um app de perguntas: produção ou oralidade]
- EF06LI07 (Estratégias de leitura; Hipóteses sobre a finalidade de um texto): Formular hipóteses sobre a finalidade de um texto em língua inglesa, com base em sua estrutura, organização textual e pistas gráficas.
- EF06LI09 (Estratégias de leitura; Compreensão geral e específica: leitura rápida (skimming, scanning)): Localizar informações específicas em texto.
- EF06LI10 (Práticas de leitura e construção de repertório lexical; Construção de repertório lexical e autonomia leitora): Conhecer a organização de um dicionário bilíngue (impresso e/ou on-line) para construir repertório lexical.
- EF06LI11 (Práticas de leitura e construção de repertório lexical; Construção de repertório lexical e autonomia leitora): Explorar ambientes virtuais e/ou aplicativos para construir repertório lexical na língua inglesa.
- EF06LI12 (Atitudes e disposições favoráveis do leitor; Partilha de leitura, com mediação do professor): Interessar-se pelo texto lido, compartilhando suas ideias sobre o que o texto informa/comunica.
- EF06LI13 (Estratégias de escrita: pré-escrita; Planejamento do texto: brainstorming): Listar ideias para a produção de textos, levando em conta o tema e o assunto. [fora do alcance de um app de perguntas: produção ou oralidade]
- EF06LI14 (Estratégias de escrita: pré-escrita; Planejamento do texto: organização de ideias): Organizar ideias, selecionando-as em função da estrutura e do objetivo do texto. [fora do alcance de um app de perguntas: produção ou oralidade]
- EF06LI15 (Práticas de escrita; Produção de textos escritos, em formatos diversos, com a mediação do professor): Produzir textos escritos em língua inglesa (histórias em quadrinhos, cartazes, chats, blogues, agendas, fotolegendas, entre outros), sobre si mesmo, sua família, seus amigos, gostos, preferências e rotinas, sua comunidade e seu contexto escolar. [fora do alcance de um app de perguntas: produção ou oralidade]
- EF06LI19 (Gramática; Presente simples e contínuo (formas afirmativa, negativa e interrogativa)): Utilizar o presente do indicativo para identificar pessoas (verbo to be) e descrever rotinas diárias.
- EF06LI20 (Gramática; Presente simples e contínuo (formas afirmativa, negativa e interrogativa)): Utilizar o presente contínuo para descrever ações em progresso.
- EF06LI21 (Gramática; Imperativo): Reconhecer o uso do imperativo em enunciados de atividades, comandos e instruções.
- EF06LI22 (Gramática; Caso genitivo (‘s)): Descrever relações por meio do uso de apóstrofo (’) + s.
- EF06LI23 (Gramática; Adjetivos possessivos): Empregar, de forma inteligível, os adjetivos possessivos.
- EF06LI24 (A língua inglesa no mundo; Países que têm a língua inglesa como língua materna e/ou oficial): Investigar o alcance da língua inglesa no mundo: como língua materna e/ou oficial (primeira ou segunda língua).
- EF06LI25 (A língua inglesa no cotidiano da sociedade brasileira/comunidade; Presença da língua inglesa no cotidiano): Identificar a presença da língua inglesa na sociedade brasileira/comunidade (palavras, expressões, suportes e esferas de circulação e consumo) e seu significado.
- EF06LI26 (A língua inglesa no cotidiano da sociedade brasileira/comunidade; Presença da língua inglesa no cotidiano): Avaliar, problematizando elementos/produtos culturais de países de língua inglesa absorvidos pela sociedade brasileira/comunidade.

### Língua Portuguesa (habilidades de bloco de anos)

**EF12LP**: 19 habilidades, 3 tocadas pelo app, 16 não cobertas.
- Cobertas: EF12LP01, EF12LP04, EF12LP19
- EF12LP02 (Leitura/escuta (compartilhada e autônoma); Formação de leitor): Buscar, selecionar e ler, com a mediação do professor (leitura compartilhada), textos que circulam em meios impressos ou digitais, de acordo com as necessidades e interesses.
- EF12LP03 (Escrita (compartilhada e autônoma); Construção do sistema alfabético/ Estabelecimento de relações anafóricas na referenciação e construção da coesão): Copiar textos breves, mantendo suas características e voltando para o texto sempre que tiver dúvidas sobre sua distribuição gráfica, espaçamento entre as palavras, escrita das palavras e pontuação. [fora do alcance de um app de perguntas: produção ou oralidade]
- EF12LP05 (Escrita (compartilhada e autônoma); Escrita compartilhada): Planejar e produzir, em colaboração com os colegas e com a ajuda do professor, (re)contagens de histórias, poemas e outros textos versificados (letras de canção, quadrinhas, cordel), poemas visuais, tiras e histórias em quadrinhos, dentre outros gêneros do campo artístico-literário, considerando a situação comunicativa e a finalidade do texto. [fora do alcance de um app de perguntas: produção ou oralidade]
- EF12LP06 (Oralidade; Produção de texto oral): Planejar e produzir, em colaboração com os colegas e com a ajuda do professor, recados, avisos, convites, receitas, instruções de montagem, dentre outros gêneros do campo da vida cotidiana, que possam ser repassados oralmente por meio de ferramentas digitais, em áudio ou vídeo, considerando a situação comunicativa e o tema/assunto/finalidade do texto. [fora do alcance de um app de perguntas: produção ou oralidade]
- EF12LP07 (Análise linguística/semiótica (Alfabetização); Forma de composição do texto): Identificar e (re)produzir, em cantiga, quadras, quadrinhas, parlendas, trava-línguas e canções, rimas, aliterações, assonâncias, o ritmo de fala relacionado ao ritmo e à melodia das músicas e seus efeitos de sentido.
- EF12LP08 (Leitura/escuta (compartilhada e autônoma); Compreensão em leitura): Ler e compreender, em colaboração com os colegas e com a ajuda do professor, fotolegendas em notícias, manchetes e lides em notícias, álbum de fotos digital noticioso e notícias curtas para público infantil, dentre outros gêneros do campo jornalístico, considerando a situação comunicativa e o tema/assunto do texto.
- EF12LP09 (Leitura/escuta (compartilhada e autônoma); Compreensão em leitura): Ler e compreender, em colaboração com os colegas e com a ajuda do professor, slogans, anúncios publicitários e textos de campanhas de conscientização destinados ao público infantil, dentre outros gêneros do campo publicitário, considerando a situação comunicativa e o tema/assunto do texto.
- EF12LP10 (Leitura/escuta (compartilhada e autônoma); Compreensão em leitura): Ler e compreender, em colaboração com os colegas e com a ajuda do professor, cartazes, avisos, folhetos, regras e regulamentos que organizam a vida na comunidade escolar, dentre outros gêneros do campo da atuação cidadã, considerando a situação comunicativa e o tema/assunto do texto.
- EF12LP11 (Escrita (compartilhada e autônoma); Escrita compartilhada): Escrever, em colaboração com os colegas e com a ajuda do professor, fotolegendas em notícias, manchetes e lides em notícias, álbum de fotos digital noticioso e notícias curtas para público infantil, digitais ou impressos, dentre outros gêneros do campo jornalístico, considerando a situação comunicativa e o tema/assunto do texto. [fora do alcance de um app de perguntas: produção ou oralidade]
- EF12LP12 (Escrita (compartilhada e autônoma); Escrita compartilhada): Escrever, em colaboração com os colegas e com a ajuda do professor, slogans, anúncios publicitários e textos de campanhas de conscientização destinados ao público infantil, dentre outros gêneros do campo publicitário, considerando a situação comunicativa e o tema/ assunto/finalidade do texto. [fora do alcance de um app de perguntas: produção ou oralidade]
- EF12LP13 (Oralidade; Produção de texto oral): Planejar, em colaboração com os colegas e com a ajuda do professor, slogans e peça de campanha de conscientização destinada ao público infantil que possam ser repassados oralmente por meio de ferramentas digitais, em áudio ou vídeo, considerando a situação comunicativa e o tema/assunto/finalidade do texto. [fora do alcance de um app de perguntas: produção ou oralidade]
- EF12LP14 (Análise linguística/semiótica (Alfabetização); Forma de composição do texto): Identificar e reproduzir, em fotolegendas de notícias, álbum de fotos digital noticioso, cartas de leitor (revista infantil), digitais ou impressos, a formatação e diagramação específica de cada um desses gêneros, inclusive em suas versões orais.
- EF12LP15 (Análise linguística/semiótica (Alfabetização); Forma de composição do texto): Identificar a forma de composição de slogans publicitários.
- EF12LP16 (Análise linguística/semiótica (Alfabetização); Forma de composição do texto): Identificar e reproduzir, em anúncios publicitários e textos de campanhas de conscientização destinados ao público infantil (orais e escritos, digitais ou impressos), a formatação e diagramação específica de cada um desses gêneros, inclusive o uso de imagens.
- EF12LP17 (Leitura/escuta (compartilhada e autônoma); Compreensão em leitura): Ler e compreender, em colaboração com os colegas e com a ajuda do professor, enunciados de tarefas escolares, diagramas, curiosidades, pequenos relatos de experimentos, entrevistas, verbetes de enciclopédia infantil, entre outros gêneros do campo investigativo, considerando a situação comunicativa e o tema/assunto do texto.
- EF12LP18 (Leitura/escuta (compartilhada e autônoma); Apreciação estética/Estilo): Apreciar poemas e outros textos versificados, observando rimas, sonoridades, jogos de palavras, reconhecendo seu pertencimento ao mundo imaginário e sua dimensão de encantamento, jogo e fruição.

**EF15LP**: 19 habilidades, 2 tocadas pelo app, 17 não cobertas.
- Cobertas: EF15LP03, EF15LP16
- EF15LP01 (Leitura/escuta (compartilhada e autônoma); Reconstrução das condições de produção e recepção de textos): Identificar a função social de textos que circulam em campos da vida social dos quais participa cotidianamente (a casa, a rua, a comunidade, a escola) e nas mídias impressa, de massa e digital, reconhecendo para que foram produzidos, onde circulam, quem os produziu e a quem se destinam.
- EF15LP02 (Leitura/escuta (compartilhada e autônoma); Estratégia de leitura): Estabelecer expectativas em relação ao texto que vai ler (pressuposições antecipadoras dos sentidos, da forma e da função social do texto), apoiando-se em seus conhecimentos prévios sobre as condições de produção e recepção desse texto, o gênero, o suporte e o universo temático, bem como sobre saliências textuais, recursos gráficos, imagens, dados da própria obra (índice, prefácio etc.), confirmando antecipações e inferências realizadas antes e durante a leitura de textos, checando a adequação das hipóteses realizadas.
- EF15LP04 (Leitura/escuta (compartilhada e autônoma); Estratégia de leitura): Identificar o efeito de sentido produzido pelo uso de recursos expressivos gráfico-visuais em textos multissemióticos.
- EF15LP05 (Produção de textos (escrita compartilhada e autônoma); Planejamento de texto): Planejar, com a ajuda do professor, o texto que será produzido, considerando a situação comunicativa, os interlocutores (quem escreve/para quem escreve); a finalidade ou o propósito (escrever para quê); a circulação (onde o texto vai circular); o suporte (qual é o portador do texto); a linguagem, organização e forma do texto e seu tema, pesquisando em meios impressos ou digitais, sempre que for preciso, informações necessárias à produção do texto, organizando em tópicos os dados e as fontes pesquisadas. [fora do alcance de um app de perguntas: produção ou oralidade]
- EF15LP06 (Produção de textos (escrita compartilhada e autônoma); Revisão de textos): Reler e revisar o texto produzido com a ajuda do professor e a colaboração dos colegas, para corrigi-lo e aprimorá-lo, fazendo cortes, acréscimos, reformulações, correções de ortografia e pontuação. [fora do alcance de um app de perguntas: produção ou oralidade]
- EF15LP07 (Produção de textos (escrita compartilhada e autônoma); Edição de textos): Editar a versão final do texto, em colaboração com os colegas e com a ajuda do professor, ilustrando, quando for o caso, em suporte adequado, manual ou digital. [fora do alcance de um app de perguntas: produção ou oralidade]
- EF15LP08 (Produção de textos (escrita compartilhada e autônoma); Utilização de tecnologia digital): Utilizar software, inclusive programas de edição de texto, para editar e publicar os textos produzidos, explorando os recursos multissemióticos disponíveis. [fora do alcance de um app de perguntas: produção ou oralidade]
- EF15LP09 (Oralidade; Oralidade pública/Intercâmbio conversacional em sala de aula): Expressar-se em situações de intercâmbio oral com clareza, preocupando-se em ser compreendido pelo interlocutor e usando a palavra com tom de voz audível, boa articulação e ritmo adequado. [fora do alcance de um app de perguntas: produção ou oralidade]
- EF15LP10 (Oralidade; Escuta atenta): Escutar, com atenção, falas de professores e colegas, formulando perguntas pertinentes ao tema e solicitando esclarecimentos sempre que necessário. [fora do alcance de um app de perguntas: produção ou oralidade]
- EF15LP11 (Oralidade; Características da conversação espontânea): Reconhecer características da conversação espontânea presencial, respeitando os turnos de fala, selecionando e utilizando, durante a conversação, formas de tratamento adequadas, de acordo com a situação e a posição do interlocutor. [fora do alcance de um app de perguntas: produção ou oralidade]
- EF15LP12 (Oralidade; Aspectos não linguísticos (paralinguísticos) no ato da fala): Atribuir significado a aspectos não linguísticos (paralinguísticos) observados na fala, como direção do olhar, riso, gestos, movimentos da cabeça (de concordância ou discordância), expressão corporal, tom de voz. [fora do alcance de um app de perguntas: produção ou oralidade]
- EF15LP13 (Oralidade; Relato oral/Registro formal e informal): Identificar finalidades da interação oral em diferentes contextos comunicativos (solicitar informações, apresentar opiniões, informar, relatar experiências etc.). [fora do alcance de um app de perguntas: produção ou oralidade]
- EF15LP14 (Leitura/escuta (compartilhada e autônoma); Leitura de imagens em narrativas visuais): Construir o sentido de histórias em quadrinhos e tirinhas, relacionando imagens e palavras e interpretando recursos gráficos (tipos de balões, de letras, onomatopeias).
- EF15LP15 (Leitura/escuta (compartilhada e autônoma); Formação do leitor literário): Reconhecer que os textos literários fazem parte do mundo do imaginário e apresentam uma dimensão lúdica, de encantamento, valorizando-os, em sua diversidade cultural, como patrimônio artístico da humanidade.
- EF15LP17 (Leitura/escuta (compartilhada e autônoma); Apreciação estética/Estilo): Apreciar poemas visuais e concretos, observando efeitos de sentido criados pelo formato do texto na página, distribuição e diagramação das letras, pelas ilustrações e por outros efeitos visuais.
- EF15LP18 (Leitura/escuta (compartilhada e autônoma); Formação do leitor literário/Leitura multissemiótica): Relacionar texto com ilustrações e outros recursos gráficos.
- EF15LP19 (Oralidade; Contagem de histórias): Recontar oralmente, com e sem apoio de imagem, textos literários lidos pelo professor. [fora do alcance de um app de perguntas: produção ou oralidade]

**EF35LP**: 31 habilidades, 1 tocadas pelo app, 30 não cobertas.
- Cobertas: EF35LP13
- EF35LP01 (Leitura/escuta (compartilhada e autônoma); Decodificação/Fluência de leitura): Ler e compreender, silenciosamente e, em seguida, em voz alta, com autonomia e fluência, textos curtos com nível de textualidade adequado.
- EF35LP02 (Leitura/escuta (compartilhada e autônoma); Formação de leitor): Selecionar livros da biblioteca e/ou do cantinho de leitura da sala de aula e/ou disponíveis em meios digitais para leitura individual, justificando a escolha e compartilhando com os colegas sua opinião, após a leitura.
- EF35LP03 (Leitura/escuta (compartilhada e autônoma); Compreensão): Identificar a ideia central do texto, demonstrando compreensão global.
- EF35LP04 (Leitura/escuta (compartilhada e autônoma); Estratégia de leitura): Inferir informações implícitas nos textos lidos.
- EF35LP05 (Leitura/escuta (compartilhada e autônoma); Estratégia de leitura): Inferir o sentido de palavras ou expressões desconhecidas em textos, com base no contexto da frase ou do texto.
- EF35LP06 (Leitura/escuta (compartilhada e autônoma); Estratégia de leitura): Recuperar relações entre partes de um texto, identificando substituições lexicais (de substantivos por sinônimos) ou pronominais (uso de pronomes anafóricos – pessoais, possessivos, demonstrativos) que contribuem para a continuidade do texto.
- EF35LP07 (Produção de textos (escrita compartilhada e autônoma); Construção do sistema alfabético/ Convenções da escrita): Utilizar, ao produzir um texto, conhecimentos linguísticos e gramaticais, tais como ortografia, regras básicas de concordância nominal e verbal, pontuação (ponto final, ponto de exclamação, ponto de interrogação, vírgulas em enumerações) e pontuação do discurso direto, quando for o caso. [fora do alcance de um app de perguntas: produção ou oralidade]
- EF35LP08 (Produção de textos (escrita compartilhada e autônoma); Construção do sistema alfabético/ Estabelecimento de relações anafóricas na referenciação e construção da coesão): Utilizar, ao produzir um texto, recursos de referenciação (por substituição lexical ou por pronomes pessoais, possessivos e demonstrativos), vocabulário apropriado ao gênero, recursos de coesão pronominal (pronomes anafóricos) e articuladores de relações de sentido (tempo, causa, oposição, conclusão, comparação), com nível suficiente de informatividade. [fora do alcance de um app de perguntas: produção ou oralidade]
- EF35LP09 (Produção de textos (escrita compartilhada e autônoma); Planejamento de texto/Progressão temática e paragrafação): Organizar o texto em unidades de sentido, dividindo-o em parágrafos segundo as normas gráficas e de acordo com as características do gênero textual. [fora do alcance de um app de perguntas: produção ou oralidade]
- EF35LP10 (Oralidade; Forma de composição de gêneros orais): Identificar gêneros do discurso oral, utilizados em diferentes situações e contextos comunicativos, e suas características linguístico-expressivas e composicionais (conversação espontânea, conversação telefônica, entrevistas pessoais, entrevistas no rádio ou na TV, debate, noticiário de rádio e TV, narração de jogos esportivos no rádio e TV, aula, debate etc.). [fora do alcance de um app de perguntas: produção ou oralidade]
- EF35LP11 (Oralidade; Variação linguística): Ouvir gravações, canções, textos falados em diferentes variedades linguísticas, identificando características regionais, urbanas e rurais da fala e respeitando as diversas variedades linguísticas como características do uso da língua por diferentes grupos regionais ou diferentes culturas locais, rejeitando preconceitos linguísticos. [fora do alcance de um app de perguntas: produção ou oralidade]
- EF35LP12 (Análise linguística/semiótica (Ortografização); Construção do sistema alfabético e da ortografia): Recorrer ao dicionário para esclarecer dúvida sobre a escrita de palavras, especialmente no caso de palavras com relações irregulares fonema-grafema.
- EF35LP14 (Análise linguística/semiótica (Ortografização); Morfologia): Identificar em textos e usar na produção textual pronomes pessoais, possessivos e demonstrativos, como recurso coesivo anafórico.
- EF35LP15 (Produção de textos (escrita compartilhada e autônoma); Escrita colaborativa): Opinar e defender ponto de vista sobre tema polêmico relacionado a situações vivenciadas na escola e/ou na comunidade, utilizando registro formal e estrutura adequada à argumentação, considerando a situação comunicativa e o tema/assunto do texto. [fora do alcance de um app de perguntas: produção ou oralidade]
- EF35LP16 (Análise linguística/semiótica (Ortografização); Forma de composição dos textos): Identificar e reproduzir, em notícias, manchetes, lides e corpo de notícias simples para público infantil e cartas de reclamação (revista infantil), digitais ou impressos, a formatação e diagramação específica de cada um desses gêneros, inclusive em suas versões orais.
- EF35LP17 (Leitura/escuta (compartilhada e autônoma); Pesquisa): Buscar e selecionar, com o apoio do professor, informações de interesse sobre fenômenos sociais e naturais, em textos que circulam em meios impressos ou digitais.
- EF35LP18 (Oralidade; Escuta de textos orais): Escutar, com atenção, apresentações de trabalhos realizadas por colegas, formulando perguntas pertinentes ao tema e solicitando esclarecimentos sempre que necessário. [fora do alcance de um app de perguntas: produção ou oralidade]
- EF35LP19 (Oralidade; Compreensão de textos orais): Recuperar as ideias principais em situações formais de escuta de exposições, apresentações e palestras. [fora do alcance de um app de perguntas: produção ou oralidade]
- EF35LP20 (Oralidade; Planejamento de texto oral): Expor trabalhos ou pesquisas escolares, em sala de aula, com apoio de recursos multissemióticos (imagens, diagrama, tabelas etc.), orientando-se por roteiro escrito, planejando o tempo de fala e adequando a linguagem à situação comunicativa. [fora do alcance de um app de perguntas: produção ou oralidade]
- EF35LP21 (Leitura/escuta (compartilhada e autônoma); Formação do leitor literário): Ler e compreender, de forma autônoma, textos literários de diferentes gêneros e extensões, inclusive aqueles sem ilustrações, estabelecendo preferências por gêneros, temas, autores.
- EF35LP22 (Leitura/escuta (compartilhada e autônoma); Formação do leitor literário/ Leitura multissemiótica): Perceber diálogos em textos narrativos, observando o efeito de sentido de verbos de enunciação e, se for o caso, o uso de variedades linguísticas no discurso direto.
- EF35LP23 (Leitura/escuta (compartilhada e autônoma); Apreciação estética/Estilo): Apreciar poemas e outros textos versificados, observando rimas, aliterações e diferentes modos de divisão dos versos, estrofes e refrões e seu efeito de sentido.
- EF35LP24 (Leitura/escuta (compartilhada e autônoma); Textos dramáticos): Identificar funções do texto dramático (escrito para ser encenado) e sua organização por meio de diálogos entre personagens e marcadores das falas das personagens e de cena.
- EF35LP25 (Produção de textos (escrita compartilhada e autônoma); Escrita autônoma e compartilhada): Criar narrativas ficcionais, com certa autonomia, utilizando detalhes descritivos, sequências de eventos e imagens apropriadas para sustentar o sentido do texto, e marcadores de tempo, espaço e de fala de personagens. [fora do alcance de um app de perguntas: produção ou oralidade]
- EF35LP26 (Produção de textos (escrita compartilhada e autônoma); Escrita autônoma e compartilhada): Ler e compreender, com certa autonomia, narrativas ficcionais que apresentem cenários e personagens, observando os elementos da estrutura narrativa: enredo, tempo, espaço, personagens, narrador e a construção do discurso indireto e discurso direto. [fora do alcance de um app de perguntas: produção ou oralidade]
- EF35LP27 (Produção de textos (escrita compartilhada e autônoma); Escrita autônoma): Ler e compreender, com certa autonomia, textos em versos, explorando rimas, sons e jogos de palavras, imagens poéticas (sentidos figurados) e recursos visuais e sonoros. [fora do alcance de um app de perguntas: produção ou oralidade]
- EF35LP28 (Oralidade; Declamação): Declamar poemas, com entonação, postura e interpretação adequadas. [fora do alcance de um app de perguntas: produção ou oralidade]
- EF35LP29 (Análise linguística/semiótica (Ortografização); Formas de composição de narrativas): Identificar, em narrativas, cenário, personagem central, conflito gerador, resolução e o ponto de vista com base no qual histórias são narradas, diferenciando narrativas em primeira e terceira pessoas.
- EF35LP30 (Análise linguística/semiótica (Ortografização); Discurso direto e indireto): Diferenciar discurso indireto e discurso direto, determinando o efeito de sentido de verbos de enunciação e explicando o uso de variedades linguísticas no discurso direto, quando for o caso.
- EF35LP31 (Análise linguística/semiótica (Ortografização); Forma de composição de textos poéticos): Identificar, em textos versificados, efeitos de sentido decorrentes do uso de recursos rítmicos e sonoros e de metáforas.
