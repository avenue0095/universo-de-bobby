# O Universo de Bobby · Relatório da Fase 1 (pesquisa)

Data: 24/10/2026. Versão curta. Os quatro relatórios completos, com cada fonte, data e endereço, estão nesta pasta:
`00-mapa-do-app-hoje.md` · `01-duolingo-retencao.md` · `02-pedagogia-por-materia.md` · `03-etica-e-lgpd-infantil.md`.
Cada afirmação abaixo marca se é **DADO** (tem fonte aberta e lida), **FALA** (entrevista, sem documento oficial) ou **OPINIÃO** (inferência nossa).

---

## 1. Como o app está hoje (DADO, medido no navegador e no código)

- Voz: só `speechSynthesis` do aparelho, sem áudio gravado. No Android a escolha da voz é quase aleatória; o seletor ainda mostra vozes de piada (Eddy, Flo, Grandma). 341 de 400 perguntas de inglês sorteadas dependem de ouvir.
- Bugs de áudio reproduzidos: a fala sai depois de fechar a fase (timers sem cancelar); "desligar sons" não silencia a voz; no celular (menos de 431 px) a ofensiva e o botão de som ficam escondidos.
- Personagem: 5 personagens com o mesmo molde de cabeça, 4 expressões, 2 animações. Trocar leva 4 toques mais rolagem, e o ícone "Trocar de jogador" abre o perfil.
- Mapa: as 3 matérias usam o mesmo traçado e a mesma paleta verde.
- Desenhos: 150, gerados por código com formas primitivas, um por fase. Já existe o gancho (`mundoCompleto`, `pintarFim`) para um desenho por etapa.
- Retenção: moedas e XP são a mesma variável; não há missão do dia, baú, congelador, notificação nem eventos de medição. A ofensiva usa data em UTC (leitura de código, a reproduzir com data simulada).
- Ensino: não adapta dificuldade (só por faixa de idade). O caderno de erros é o ponto forte. Poucas perguntas interativas fora de matemática.
- Código: o repositório só tem o `index.html` pronto. A pasta `src/`, o build e os testes citados nos documentos antigos não existem em nenhum lugar do computador.

## 2. Duolingo: o que se sabe com fonte

- **DADO (carta aos investidores, Q2 2026):** 58,7 milhões de usuários ativos por dia; 84% de quem já estava ativo volta no dia seguinte (CURR, recorde). O crescimento de usuários por dia caiu de +59% (Q2 2024) para +23% (Q2 2026).
- **DADO (blog oficial, 19/11/2020):** separar "meta diária" da "ofensiva" (uma lição já conta) subiu a retenção do dia 14 em 3,3%, mas menos gente bateu a meta.
- **FALA (Sean Colombo, VP de Engenharia, texto convidado no Lenny's, 02/04/2024):** quarta versão das ligas: retenção D1/D7/D14 +1%/+2%/+3% e tempo de estudo cerca de +17%.
- **NÃO CONFIRMADO:** "dois congeladores subiram os usuários diários em 0,38%". O relatório 01 atribui o número a um post de 31/01/2022, mas o relatório 03 não o achou no post que abriu. Não usar.
- **DADO (só o resumo foi lido):** Silverman e Barasch (2023, 7 estudos) mostram que destacar a ofensiva intacta aumenta o engajamento seguinte, e que o efeito é mais fraco quando existe a opção de reparar a ofensiva. Ou seja, reparar tem custo para a motivação. Nossa escolha de ofensiva que "descansa e se recupera" é OPINIÃO (protege contra culpa e segue o ECA Digital) e esse custo precisa ser medido.
- **DADO (resumo do estudo):** experimento aleatório no Peru (NBER 34173, 2025, cerca de 60 mil alunos do 4º ao 6º ano): destacar a ofensiva e lembretes personalizados aumentaram o uso. Só cerca de 1.500 alunos fizeram a prova final, e nela a nota de matemática melhorou só em comparação com o controle (diferença contra os outros grupos não significativa).
- **FALA (Mazal, entrevista Lenny's, 2023):** o fator que mais move o total é a volta no dia seguinte de quem já usa (cerca de 5x o segundo colocado); aquisição moveu pouco; ofensiva de 10+ dias reduz abandono (o próprio Mazal ressalva que pode ser correlação). O blog oficial diz +2% **ao mês** na simulação e 4x de crescimento; a fala diz +2% por trimestre e 4,5x. Não usar esses números como promessa.
- **NÃO CONFIRMADO:** ganho do Friend Streak, gemas e baús, horário ideal de push, regras de promoção das ligas, e dado de retenção do Duolingo ABC (crianças).

**Tese que vamos adotar (OPINIÃO apoiada nos dados):** o que mais move um app de hábito é fazer quem já usa voltar amanhã. Portanto o ciclo de retorno diário vem antes de qualquer plano de aquisição.

## 3. Como ensinar 7 a 12 anos (DADO, com limites)

Fonte principal: relatório `02`, fontes F1 a F27. Pontos centrais:
- Prática de recuperação (produzir a resposta) com feedback e repetição espaçada têm a evidência mais forte (Dunlosky 2013; guia IES 2007). Feedback que explica o erro: d=0,99, contra 0,24 para só reforço ou punição (Wisniewski, Zierer e Hattie, 2020).
- Intercalação em matemática: d=0,83 em ensaio aleatório (Rohrer 2020), mas com alunos do 7º ano. Em 7 a 9 anos é hipótese a medir no app.
- Alfabetização: guia IES/WWC 2016 dá evidência forte a som e letra e a decodificação com escrita. No Brasil, 66% estavam alfabetizados no 2º ano em 2025 (fonte secundária) e 27% chegam ao nível 2 em matemática no PISA 2022 (o PISA mede jovens de 15 anos, só contexto).
- "Singapura", Khan e Prodigy: o ensaio aleatório que li de programa tipo Singapura (EEF) deu efeito pequeno e não significativo; a evidência de Khan e Prodigy é correlacional e vem das próprias empresas. **Não vender nenhum deles como garantia de efeito.**
- Inglês como segunda língua para criança é a base mais fraca (phonics em EFL: efeito moderado em habilidades de base, pequeno em palavras reais; sem estudo causal de app). **Não prometer fluência.**

## 4. Ética e lei (DADO de texto oficial; leitura nossa precisa de advogado)

- A Lei 15.211/2025 (ECA Digital) vigora desde 17/03/2026; o Decreto 12.880/2026 a regulamenta. Tratam como risco recompensa por tempo de uso, notificação em excesso e ocultar pontos de parada, e listam "pressão emocional" e "urgência fabricada" como prática manipulativa (lido em planalto.gov.br).
- Loot box é proibida (art. 20), mas a definição exige pagamento. Baú grátis fica fora da letra da lei. Perfilamento para publicidade é proibido. A ANPD diz que fiscaliza mais a partir do início de 2027. O guia de verificação de idade ainda não saiu.
- A FTC (2022) lista a pressão do personagem querido sobre a criança como dark pattern. O Bobby é mascote, então esse risco é nosso.
- O que dá para usar sem manipular (OPINIÃO apoiada no código do ICO e no ECA Digital; Silverman e Barasch indicam o custo do reparo, ver seção 2): congelador ganho jogando, nunca vendido; ofensiva que descansa e se recupera em vez de zerar; lembrete ao responsável, não à criança; ponto de parada claro; tom do Bobby de incentivo, nunca de culpa.
- Não confirmado: texto do 5Rights (acesso bloqueado), estudo revisado por pares sobre Duolingo e ansiedade, estudo de ofensiva com crianças de 7 a 12.

## 5. O que vamos aplicar, em ordem de impacto (OPINIÃO; os itens 1 a 3 dependem das suas respostas no documento de revisão)

| # | Aplicar | Por quê (fonte) | Fase |
|---|---|---|---|
| 1 | Consertar áudio: voz gravada de qualidade (híbrido) e botão de som que silencia de verdade; corrigir os 3 bugs | queixa principal da usuária; mapa `00` | 2 e 4 |
| 2 | Ciclo de retorno diário: meta curta escolhida pelo responsável, baú do dia, 3 missões, bilhete do Bobby esperando | CURR é a alavanca principal (carta Q2 2026; Mazal, FALA) | 2 |
| 3 | Ofensiva com congelador ganho, que descansa e se recupera; sem culpa (o reparo pode enfraquecer um pouco o efeito da ofensiva: medir) | OPINIÃO; ECA Digital art. 17 e Decreto art. 10; Silverman e Barasch 2023 (resumo) | 2 |
| 4 | Prática de recuperação com feedback que explica o erro, em toda fase | Dunlosky 2013; Wisniewski 2020 | 2 |
| 5 | Repetição espaçada por item e caderno de erros que volta no dia seguinte | Dunlosky 2013; IES 2007 | 2 |
| 6 | Diagnóstico de entrada e dificuldade adaptativa por habilidade (três faixas: 7-8, 9-10, 11-12) | Kulik e Fletcher 2012; guia RtI | 2 |
| 7 | Desenho bonito por etapa concluída (a "casinha"), 30 no total, no lugar de 150 por fase | OPINIÃO / pedido da usuária; ganchos já existem no código | 3 |
| 8 | Elenco novo de personagens (Bobby com mais poses e 6 companheiros) e botão fixo "Meu personagem" | OPINIÃO / queixa de "fake" e de achar onde trocar | 3 |
| 9 | Mapa com cenário próprio por matéria | OPINIÃO / mapa `00` | 3 |
| 10 | Relatório semanal curto para os pais e lembrete ao responsável | ECA Digital; retenção pelo lado da família | 2 |
| 11 | Eventos de medição (D1, D7, D30) locais, sem dado pessoal | não existe hoje | 2 |
| 12 | Liga da Família (convidados pelo responsável); conta na nuvem só se for vender | OPINIÃO: evita moderação e dado de criança | depois |

**Medida de sucesso:** retorno no dia seguinte (D1), no dia 7 (D7) e no dia 30 (D30), por coorte semanal, medido localmente sem dado pessoal (mesma lógica do CURR da Duolingo). Meta numérica só depois de ter a linha de base.

**Próxima ação única:** o Filipe (e a Fran) respondem o documento de revisão, começando pelas perguntas de código, voz, estilo visual, elenco, desenho por etapa e ofensiva. Depois disso, aprovação da Fase 1.

## 6. O que NÃO fazer
- Não escrever "método Singapura", "mastery" ou número de Khan/Prodigy/Duolingo como promessa de resultado.
- Não prometer fluência em inglês.
- Não vender congelador, não usar mascote triste ou culpando, não esconder ponto de parada.
- Não usar notificação direta e frequente à criança.
- Não tratar os números do resumo colado (5x, triplicou, 4,5x) como fato.

## 7. Pendências e riscos
- Código fonte: decidir, no documento de revisão, reconstruir `src/`, build e testes a partir do `index.html` (backup feito em `~/Projetos/_backups/bobby-site-20261024-antes-da-reforma`).
- Não testado em iPhone nem Android reais (gesto para falar e áudio suspenso no iOS ficaram como risco por leitura de código).
- Licença comercial das imagens do Google Flow e da voz gerada: confirmar antes de vender.
- Advogado para a versão final dos termos, consentimento dos pais e leitura do ECA Digital.
- Custo desta fase: nenhuma geração paga.
