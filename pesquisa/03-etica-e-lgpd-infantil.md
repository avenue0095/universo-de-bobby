# Ética, dark patterns e proteção de dados infantis: O Universo de Bobby

Pesquisa feita em 24/10/2026. Público do app: crianças de 7 a 12 anos. Mecânicas em análise: ofensiva (streak), ligas, baús, notificações push. Venda no Brasil, no futuro.

**Aviso:** isto é pesquisa, não parecer jurídico. A versão final da política de privacidade, dos termos, do consentimento parental e do desenho das mecânicas precisa de advogado de proteção de dados e direito digital. A leitura das mecânicas contra a lei (seção 2.5) é interpretação minha e precisa ser validada.

**Legenda de confirmação usada no texto**
- [ABERTA] abri a fonte primária e li o texto.
- [RESUMO] abri a página, mas só tenho o resumo devolvido pela ferramenta de leitura, não o texto bruto.
- [SECUNDÁRIA] só apareceu em busca ou em blog. Não confirmei na fonte.
- [MINHA LEITURA] interpretação ou sugestão minha, não está escrita na fonte.

---

## 0. Resumo em 8 pontos

1. **O ECA Digital (Lei 15.211/2025) está em vigor desde 17/03/2026** e o Bobby se enquadra de cheio: é produto "direcionado a crianças". [ABERTA, planalto.gov.br]
2. **Streak, notificação e "recompensa por tempo de uso" estão no radar da lei.** O art. 17, §4º, II manda que as configurações-padrão da supervisão parental limitem "recompensas pelo tempo de uso, notificações e outros recursos" que estendam o uso artificialmente. O Decreto 12.880/2026 (art. 9º) lista como mecanismos de uso excessivo: esconder pontos naturais de parada, tocar conteúdo novo sem pedir, oferecer recompensa pelo tempo de uso e notificações excessivas. [ABERTA]
3. **O mesmo Decreto (art. 10) define prática manipulativa** com exemplos que batem direto em ofensiva culposa: "pressões emocionais" e "urgências fabricadas" para induzir decisão contra o melhor interesse da criança. [ABERTA]
4. **Caixa de recompensa (loot box) é proibida para criança** (art. 20), mas a definição legal exige **pagamento** (art. 2º, IV). Baú gratuito não é loot box pela letra da lei. Mesmo assim o governo trata "recompensas imprevisíveis que estimulam comportamento compulsivo" como vedadas no material de perguntas e respostas. [ABERTA, mas essa parte do P&R é material de divulgação, não texto de lei]
5. **Perfilamento para publicidade é proibido** (arts. 22 e 26) e o Bobby não deveria ter anúncio nenhum. Dado de verificação de idade só pode servir para verificar idade (art. 13). [ABERTA]
6. **LGPD art. 14:** consentimento específico e em destaque de pelo menos um dos pais, informação clara e adequada à criança, e não condicionar o jogo a dado além do estritamente necessário. [ABERTA]
7. **O que se faz com aversão à perda sem manipular:** ofensiva que a criança nunca "perde para zero", congelador automático, recompensa de volta sem culpa, notificação sem personagem triste. Silverman e Barasch (2023) indicam que o efeito da ofensiva é mais fraco quando existe opção de reparar, e mais forte quando a pessoa se culpa pela quebra; o custo do reparo precisa ser medido, e escolher reparo em vez de culpa é decisão nossa (opinião). [ABERTA no resumo da editora/repositório]
8. **O mascote é risco regulatório.** O relatório da FTC lista "pressão por relação parassocial" (usar personagem em quem a criança confia para pressioná-la) como dark pattern. Bobby fazendo cara de triste é exatamente isso. [ABERTA]

---

## 1. Dark patterns com criança: o que a literatura diz

### 1.1 FTC, "Bringing Dark Patterns to Light" (staff report, setembro de 2022)
- Fonte: ftc.gov/reports/bringing-dark-patterns-light; PDF aberto e lido. Divulgado em 15/09/2022. [ABERTA]
- É relatório de equipe da FTC (EUA), não lei. Serve como referência de prática considerada enganosa.
- O relatório classifica táticas em famílias (falsa urgência/escassez, interferência de interface, obstrução de cancelamento, coleta enganosa de dados, preços escondidos). [ABERTA]
- **Pontos que tocam o Bobby (conferidos no PDF):**
  - **"Parasocial Relationship Pressure":** usar personagem que a criança conhece e confia para pressioná-la a uma escolha. Exemplo do próprio relatório: personagem de desenho incentivando compra dentro do app.
  - **"Intermediate Currency":** esconder o custo real usando moeda virtual. Exemplo do relatório: "moedas" ou "bolotas" em apps infantis. Vale para qualquer gema ou moeda do Bobby que algum dia seja vendida.
  - **"Nagging":** pedir repetida e disruptivamente que o usuário faça algo.
  - Compras dentro de app com criança: a FTC cita os casos Apple, Google e Amazon e a ação contra o ABCmouse (aprendizado infantil) por cancelamento difícil, acordo de US$ 10 milhões em 2020.
- **O que NÃO está no relatório:** não encontrei "streak" nem "confirmshaming" no texto (busca no PDF). Não atribuir ao relatório crítica a streak. [ABERTA]

### 1.2 Harry Brignull, deceptive.design
- Página de confirmshaming aberta: define como provocar culpa ou vergonha, em geral com texto de recusa depreciativo, para levar a pessoa a fazer algo que não faria sozinha. Exemplo clássico: botão "Não, prefiro sangrar até morrer". [ABERTA]
- Não consegui abrir a lista completa de tipos do site. Os nomes de outros padrões (nagging, falsa urgência etc.) vêm do relatório da FTC, não do site do Brignull. [NÃO CONFIRMADO no site]
- Tradução para o Bobby [MINHA LEITURA]: "Se você sair agora, o Bobby vai ficar triste" é confirmshaming com mascote.

### 1.3 Reino Unido: Age Appropriate Design Code (Children's code, ICO)
- Código do regulador britânico de dados, 15 padrões, vale para serviços online acessíveis a menores de 18. Lista dos 15 padrões aberta no site do ICO. [ABERTA]
- **Padrão 5, "Detrimental use of data":** citam reward loops, notificações e autoplay como estratégias "sticky" de estender engajamento. O ICO não proíbe recompensa nem notificação; o risco está em usar dado pessoal da criança para segurá-la. Recomenda: apresentar a opção de continuar de forma **neutra, sem sugerir perda**; oferecer **pausas sem perda de progresso**; autoplay só com escolha ativa. Diz que desenho orientado por dado que dificulta a criança sair provavelmente viola o princípio de lealdade do GDPR. [ABERTA, via leitura da página; o texto traz as seções "Strategies used to extend user engagement" e "Does this mean we can't use features such as rewards, notifications and likes"] A página não menciona "streak" nem push especificamente.
- **Padrão 13, "Nudge techniques":** não usar nudge para levar a criança a entregar dado desnecessário ou desligar proteção de privacidade; sugere nudges pró-privacidade por faixa etária (0 a 9, 10 a 12, 13 a 17) e incentivar pausas. [ABERTA]
- Outros padrões úteis ao Bobby: 7 (configurações padrão de alta privacidade), 8 (minimização), 9 (compartilhamento), 10 (geolocalização desligada), 12 (perfilamento desligado por padrão), 4 (transparência em linguagem da idade). [ABERTA, parafraseados do site do ICO]
- Ano de entrada em vigor do código (2020, com transição até 2021) vem do meu conhecimento prévio. [NÃO REABERTO]

### 1.4 5Rights Foundation, "Disrupted Childhood: the cost of persuasive design" (2018, versão 2 em abril de 2023)
- As páginas e o PDF da 5Rights devolveram **403** para mim. Não consegui ler o relatório.
- O que sei veio de resumo em buscas: o relatório trata reward loops, notificações e recomendações personalizadas como persuasive design e cita streaks entre os recursos que criam um ecossistema de distração e competição. [SECUNDÁRIA, não confirmei no texto]
- A tese central (não jogar a responsabilidade só em pais e crianças; desenhar para a fase de desenvolvimento) é consistente com o ECA Digital art. 4º e art. 5º, §2º. [MINHA LEITURA]

### 1.5 Duolingo, streak e "culpa do Duo"
- **Não achei estudo revisado por pares que meça ansiedade causada por streak ou notificação do Duolingo.** O que existe são blogs, Substack e opinião de estudante. Números como "62% sentem culpa" apareceram sem fonte original e **não devem ser usados**. [SECUNDÁRIA, descartado]
- **O que a própria Duolingo publica** (dados da empresa, sem auditoria):
  - Post de 10/05/2017 [ABERTA]: usuários são "altamente avessos a perder" a ofensiva; teste "Streak Wager" (apostar moeda virtual numa ofensiva de 7 dias) aumentou retenção, com +14% no dia 7; o "Weekend Amulet" (segurar a ofensiva no fim de semana) deixou o usuário 4% mais propenso a voltar em uma semana e 5% menos propenso a perder a ofensiva.
  - Central de ajuda e blog: congelador precisa ser comprado antes do dia perdido; reparo de ofensiva pode ser comprado com gemas. [RESUMO, via busca; não abri a central de ajuda]
- **Leitura para o Bobby [MINHA LEITURA]:** o histórico da Duolingo mostra que a indústria resolveu a dor da ofensiva quebrada com **mais camadas de proteção** (congelador, amuleto, reparo), o que é a parte aproveitável. O "Streak Wager" (apostar moeda na ofensiva) tem cara de aposta e não deve ir para app infantil. O Decreto 12.880 (art. 12, §2º, IV) lista "microtransações" como risco a ser informado na classificação indicativa.
- Crítica de culpa: existe como comentário (por exemplo textos sobre "You made Duo sad"). Trate como opinião. [SECUNDÁRIA]

### 1.6 Pesquisa acadêmica sobre streak e aversão à perda
- **Silverman e Barasch (2023), "On or Off Track: How (Broken) Streaks Affect Consumer Decisions", Journal of Consumer Research 49(6), 1095-1117.** Repositório da universidade aberto. [ABERTA, resumo do artigo]
  - Em sete estudos, mostrar ofensiva intacta aumenta o engajamento seguinte mais que mostrar ofensiva quebrada, e o efeito depende de como o log mostra, não do que a pessoa fez.
  - O efeito de quebrar é **maior quando a pessoa se culpa** e **menor quando pode "reparar" a ofensiva**.
  - Implicação direta para o Bobby: dê caminho de reparo e nunca escreva copy que culpe a criança.
- **Rewley et al. (2021), Games for Health Journal**, teste de gamificação com passos, 602 pessoas: quem estava em risco de perder um nível alcançou a meta com mais frequência. Só vi em resumo de busca, e é com adultos. [SECUNDÁRIA, adultos]
- Kahneman e Tversky (1979) como base da aversão à perda: conhecimento geral, não reaberto. [NÃO REABERTO]
- **Lacuna:** não encontrei estudo revisado por pares sobre streaks com crianças de 7 a 12. Tudo o que se diz de "efeito em criança" é extrapolação.

---

## 2. Legislação brasileira e comparados

### 2.1 ECA Digital, Lei 15.211/2025 [ABERTA, planalto.gov.br]

| Item | O que confirmei |
|---|---|
| Número e nome | Lei nº 15.211, de 17/09/2025, "Estatuto Digital da Criança e do Adolescente" |
| Publicação | DOU de 17/09/2025, edição extra |
| Vigência | Art. 41-A, na redação da Lei 15.352/2026: **vigora a partir de 17/03/2026**. (A redação anterior, da MP 1.319/2025, dizia seis meses após a publicação.) |
| Regulamento | **Decreto nº 12.880, de 18/03/2026**, em vigor na publicação (art. 54). Texto aberto no planalto.gov.br |
| Quem fiscaliza | ANPD, agora transformada em agência (Lei 15.352/2026). Multa de até 10% do faturamento do grupo no Brasil, **teto de R$ 50 milhões por infração**, além de advertência, suspensão e proibição de atividade (art. 35) |
| Para quem vale | Produto ou serviço de TI **direcionado** a criança e adolescente ou de **acesso provável** por eles (art. 1º). Inclui jogos conectados e apps (art. 2º, I) |
| Criança e adolescente | Conceitos do ECA, art. 2º (art. 2º, §1º da Lei 15.211). Pelo ECA, criança é quem tem até 12 anos incompletos. O texto do ECA não foi reaberto. [MINHA LEITURA do ECA] |

**Artigos mais relevantes para o Bobby**
- **Art. 5º e 4º:** melhor interesse, proteção integral, proteção contra exploração comercial. O art. 5º, §2º define melhor interesse incluindo privacidade, saúde mental, bem-estar.
- **Art. 7º:** por padrão, o modo **mais protetivo** de privacidade e dados.
- **Art. 8º, IV:** configurações padrão que **evitem o uso compulsivo** desde a concepção. Art. 8º, I: gerenciamento de risco das funcionalidades.
- **Art. 13:** dado coletado para verificar idade só pode ser usado para isso.
- **Art. 14, parágrafo único:** o app precisa de mecanismo próprio contra acesso indevido a conteúdo inadequado, mesmo recebendo sinal de idade da loja.
- **Art. 16:** informação sobre riscos e segurança acessível a pais e crianças, independente de comprar o produto; tratamento de dado de criança além do estritamente necessário exige **mapear e mitigar risco e elaborar relatório de impacto** que a autoridade pode requisitar.
- **Art. 17:** ferramentas de supervisão parental fáceis, aviso visível quando ativas, e **funções para limitar e monitorar tempo de uso**. §4º: o padrão dessas ferramentas deve ter proteção máxima, incluindo limitar "recompensas pelo tempo de uso, notificações e outros recursos" que estendam artificialmente o uso, e controle sobre recomendações personalizadas.
- **Art. 18:** pais devem poder ver e configurar conta e privacidade, **restringir compras**, ver métricas consolidadas de tempo de uso, tudo em português. §2º: **proibido** desenhar ou manipular interfaces para comprometer a autonomia do usuário ou enfraquecer a supervisão parental.
- **Art. 20:** **caixas de recompensa proibidas** em jogos direcionados a crianças ou de acesso provável por elas. **Art. 2º, IV** define como funcionalidade que permite adquirir, **mediante pagamento**, itens ou vantagens aleatórias sem conhecer o conteúdo.
- **Art. 21:** jogos com interação entre usuários (texto, áudio, vídeo, troca de conteúdo) devem cumprir o art. 16 da Lei 14.852/2024 e, por padrão, limitar a interação, assegurando consentimento dos pais.
- **Art. 22:** **proibido perfilamento para direcionar publicidade comercial** a criança, e uso de análise emocional, realidade aumentada, estendida ou virtual para esse fim. **Art. 26:** proibido criar perfil comportamental de criança para direcionar publicidade, inclusive com dado vindo da verificação de idade.
- **Art. 12:** lojas de aplicativos e sistemas operacionais aferem idade, fornecem **sinal de idade** por API e exigem **consentimento dos pais para baixar app** (§2º, sem presunção de autorização por silêncio).
- **Art. 40:** representante legal no Brasil. **Art. 31:** relatório semestral só para quem tem mais de 1 milhão de usuários menores de 18 registrados.
- **Art. 34, §1º, e art. 37, parágrafo único:** a regulação não pode criar vigilância em massa.

**Decreto 12.880/2026 [ABERTA]**
- **Art. 9º:** fornecedores devem implementar mecanismos para evitar uso excessivo, problemático ou compulsivo. Parágrafo único: são "mecanismos de incentivo" ao uso excessivo **(I) ocultar pontos naturais de parada, (II) acionar novo conteúdo sem solicitação, (III) oferecer recompensas pelo tempo de uso, (IV) mostrar notificações excessivas**.
- **Art. 10:** ANPD vai regulamentar e coibir práticas manipulativas, enganosas ou coercitivas. Parágrafo único define: arquitetura de escolha que interfira na autonomia ou explore vulnerabilidades cognitivas e etárias, incluindo **(I) obstrução** (dificultar parar de usar, cancelar, mudar preferência), **(II) exploração de vulnerabilidades cognitivas** com "pressões emocionais, urgências fabricadas, escolhas enviesadas, inferências emocionais ou estímulos inadequados à idade", **(III) esconder ou dificultar controles** de privacidade, supervisão parental, consentimento ou revogação.
- **Art. 12, §2º:** a classificação indicativa de jogos e apps vai informar riscos, entre eles loot boxes, **estímulo ao uso problemático**, **microtransações** e **práticas manipulativas**. §4º: os termos de uso devem informar a classificação indicativa em português.
- **Art. 23:** jogo com loot box deve verificar idade, **ou** oferecer versão sem a funcionalidade, ou travar o acesso por padrão (caso em que dispensa verificação).
- **Art. 24, §3º:** dado de documento usado na verificação deve ser eliminado de modo imediato e irreversível após extrair a idade. **Art. 33:** publicidade para criança não pode usar perfilamento nem análise emocional.
- **Art. 25 (§4º):** se a aferição do app divergir do sinal de idade da loja, adotar a alternativa mais protetiva.

**Material oficial de perguntas e respostas (ANPD, MJSP, Secom), atualizado em 30/07/2026 [ABERTA]**
- Diz que práticas proibidas incluem "notificações de urgência fabricadas" e "recompensas imprevisíveis que estimulam comportamento compulsivo". É material de divulgação, não texto de lei; o texto do Decreto é mais genérico (item acima).
- Diz que o ECA Digital não proíbe jogos; a **única vedação expressa para jogos é loot box**.

**Estado da regulamentação e da fiscalização (página da ANPD publicada em 16/09/2026 e atualizada em 22/09/2026) [RESUMO]**
- O **guia definitivo de aferição de idade ainda não foi publicado.** Existem orientações preliminares, publicadas em 20/03/2026. [ABERTA, notícia da ANPD]
- Início de **2027:** ANPD poderá intensificar a fiscalização de fornecedores direcionados a crianças ou de acesso provável. A página não dá mês.
- **Consulta pública do Regulamento de Fiscalização e do Processo Sancionador vai até 26/10/2026.** Regulamento de dosimetria de sanções ainda vai a consulta. Guia de fornecedores de TI com escopo e obrigações: subsídios concluídos, em consolidação.
- Por ora a ANPD prioriza orientação, e abriu monitoramentos (lojas, sistemas operacionais, sites adultos, plataformas e IA generativa) e processo contra o Discord.
- Marco temporal prático: o Bobby só vai ao mercado depois, então deve ser desenhado já pela versão mais rígida.

### 2.2 LGPD, Lei 13.709/2018, art. 14 [ABERTA, planalto.gov.br]
- **Caput:** tratamento de dado de criança e adolescente sempre no **melhor interesse**.
- **§1º:** dado de **crianças** exige **consentimento específico e em destaque** de pelo menos um dos pais ou do responsável legal.
- **§2º:** manter pública a informação sobre tipos de dado coletado, uso e como exercer os direitos do art. 18.
- **§3º:** exceção para coleta sem consentimento só para **contatar os pais** (uso único, sem guardar) ou para **proteção** da criança; nunca repassar a terceiro sem consentimento.
- **§4º:** não condicionar a participação em jogos e aplicações ao fornecimento de dado **além do estritamente necessário**.
- **§5º:** "todos os esforços razoáveis" para verificar que quem consentiu é o responsável, considerando a tecnologia disponível.
- **§6º:** informação simples, clara, acessível, com **recursos audiovisuais** quando adequado, adequada ao entendimento da criança.
- **Arts. 15 e 16:** o tratamento termina quando a finalidade é cumprida ou o dado deixa de ser necessário, por pedido do titular (revogação) ou determinação da ANPD; depois, **eliminação**, salvo exceções (obrigação legal, pesquisa com anonimização etc.).
- **Nuance de idade [MINHA LEITURA]:** o §1º fala de "crianças" (até 12 incompletos). O público do Bobby vai de 7 a 12, então inclui quem já completou 12 e legalmente é adolescente. Para não depender dessa fronteira, trate **todos** como sujeitos a consentimento parental.

### 2.3 ANPD: melhor interesse e bases legais
- **Enunciado CD/ANPD nº 1, de 22/05/2023:** o tratamento de dado de criança e adolescente pode usar as hipóteses do art. 7º **ou** do art. 11 da LGPD, **desde que observado e prevalecente o melhor interesse**, avaliado no caso concreto (art. 14). Texto lido na biblioteca digital do MJ. [ABERTA]
- **Não encontrei "Resolução da ANPD sobre melhor interesse da criança".** O instrumento que achei é o **Enunciado** (não é resolução). Tratar a pergunta como "não confirmado que exista resolução". [NÃO CONFIRMADO]
- O **Guia de legítimo interesse da ANPD** (2024) existe, e pela leitura da busca exige teste de balanceamento documentado quando se usa essa base com criança. Não abri o PDF. [RESUMO, não aberto]
- **Consequência prática [MINHA LEITURA]:** juridicamente dá para tratar parte dos dados com outra base que não consentimento (por exemplo execução de contrato para o dado necessário ao funcionamento). Para um app infantil novo, a opção mais segura e mais fácil de explicar é: **consentimento parental para tudo que não for estritamente necessário**, e documentar o melhor interesse. A escolha de base por finalidade é decisão do advogado.

### 2.4 Comparação: COPPA (EUA) e GDPR (UE e Reino Unido)
- **COPPA** (16 CFR Parte 312, FTC), menores de 13: exige consentimento parental verificável antes de coletar dado. A regra foi **emendada**: anúncio de 16/01/2025, publicada no Federal Register em 22/04/2025, em vigor em 23/06/2025, com **prazo geral de adequação em 22/04/2026**. Mudanças: **consentimento separado** para repassar dado a terceiros em finalidade não integral (como publicidade direcionada), **limite de retenção** (só pelo tempo razoavelmente necessário, nunca indefinido), definição de dado pessoal ampliada (biometria, identificadores oficiais). A FTC **decidiu não adotar** a proposta de limitar push notification sem consentimento parental, mas diz continuar preocupada com push e engajamento. [ABERTA, comunicado da FTC; a data de adequação veio de busca no Federal Register]
- **GDPR art. 8:** consentimento do menor para serviço da sociedade da informação a partir de 16 anos (Estados-membros podem baixar até 13); abaixo disso, autorização dos pais e esforço razoável de verificação. Considerando 38: crianças merecem proteção específica em marketing e perfis. [RESUMO, EUR-Lex]
- **Reino Unido:** ver Children's code (1.3). Aplica-se a menores de 18.
- Para o Bobby no Brasil, nenhuma dessas é obrigatória. Servem de **referência de boa prática** e se um dia houver venda a famílias nos EUA ou Europa, aplica-se COPPA ou GDPR.

### 2.5 Leitura das mecânicas do Bobby contra a lei [MINHA LEITURA, validar com advogado]

| Mecânica | Risco | Por quê | O que fazer |
|---|---|---|---|
| **Ofensiva (streak)** | Médio | Não é proibida por nome, mas o art. 17 §4º II trata "recompensas pelo tempo de uso" e o Decreto art. 9º III repete. Streak por **ação cumprida** (uma missão pequena) é diferente de recompensa por **tempo**. Copy culposa cai no art. 10 II do Decreto | Ofensiva baseada em meta feita, não em minutos. Desligável pelos pais. Sem copy de culpa. Ver seção 3 |
| **Ligas** | Médio | Competição social gera pressão e comparação. Se houver mensagem ou troca de conteúdo entre crianças, entra o art. 21 e a Lei 14.852 art. 16 | Sem chat, sem nome real, avatar padronizado. Liga cooperativa ou contra o próprio recorde. Sem rebaixamento humilhante. Participação opcional e desligável pelos pais |
| **Baús** | Baixo se gratuito e sem aleatoriedade paga; **alto** se vendidos | Loot box é a funcionalidade com **pagamento** por item aleatório (art. 2º IV, art. 20): proibida. Baú gratuito não entra nessa definição pela letra da lei. Mas aleatoriedade que estimula compulsão aparece como vedada no P&R oficial e o Decreto art. 10 II fala em "escolhas enviesadas" | **Nunca vender baú nem sorteio.** Conteúdo do baú visível ou determinístico. Sem moeda comprável. Sem "abra agora ou perca" |
| **Notificações push** | Médio a alto | "Notificações excessivas" é mecanismo de uso excessivo (Decreto art. 9º IV); "urgência fabricada" é prática manipulativa (art. 10 II). O art. 17 §4º II manda o padrão limitar notificações | Padrão desligado para a criança; o lembrete vai ao **responsável**. Tom gentil, teto de frequência, sem personagem emocional. Ver seção 3 |
| **Mascote Bobby** | Médio | FTC: pressão parassocial com personagem querido é dark pattern | Bobby encoraja, nunca pressiona nem expressa tristeza por ausência |
| **Moeda virtual** (se existir) | Médio | FTC: "moeda intermediária"; Decreto cita microtransações | Só ganhar jogando, nunca comprar. Se vender algo no futuro, compra só por adulto autenticado (art. 18 II) |
| **Anúncio** | Proibido na prática | Arts. 22 e 26 | Zero anúncio comportamental. Melhor, zero anúncio |

---

## 3. Aversão à perda sem abuso: modelos práticos

Princípio [MINHA LEITURA, apoiado em ICO padrão 5 e Silverman e Barasch]: usar a **conquista** como ativo ("você construiu 12 dias") e não a **ameaça** ("você vai perder"). O estudo indica que o efeito é mais forte quando a pessoa se culpa pela quebra; ele não diz que reparar elimina o efeito negativo, e sim que o enfraquece.

### 3.1 Congelador de ofensiva
- **Congelador automático ganho, não comprado.** Ex.: a cada 7 dias de ofensiva, a criança ganha 1 congelador (máximo 2 guardados). Usa-se sozinho no dia perdido, sem a criança precisar fazer nada. [sugestão minha; os números 7 e 2 são exemplos para testar]
- **Dias de descanso planejados:** os pais (ou a criança, com os pais) marcam dias que não contam, como fim de semana, viagem, prova. Cumpre a ideia do Weekend Amulet da Duolingo (4% mais retorno e 5% menos perda de ofensiva, dados da empresa) sem custo. [ABERTA para o dado da Duolingo]
- **Nunca vender congelador** nem reparo com moeda comprável. Venda de proteção contra perda é o ponto em que o mecanismo vira cobrança sobre ansiedade.

### 3.2 Recompensa de volta em vez de culpa
- **"Ofensiva viva": nunca zerar.** Se a sequência quebra, ela vira "melhor ofensiva: 12 dias" (permanece no perfil) e a atual recomeça de **metade** ou do último marco, não de zero. [sugestão minha] Isso é o "reparo" que a pesquisa associa a menos efeito negativo.
- **Boas-vindas de volta:** quem volta depois de pausa ganha um baú de volta (gratuito, conteúdo visível) e a mensagem fala do que a criança já sabe, não do que perdeu.
- **Meta semanal flexível:** "3 de 5 dias esta semana" absorve um dia perdido sem quebrar nada.

### 3.3 Meta que a criança e os pais controlam
- A criança escolhe a meta diária (por exemplo 1, 2 ou 3 missões); os pais podem baixar o teto e desligar ofensiva, ligas e lembretes. O art. 17 e o art. 18 (§2º, não enfraquecer a supervisão) pedem isso.
- **Painel dos pais** com tempo total de uso (art. 18, IV), compras bloqueadas por padrão (art. 18, II) e botão claro para pausar o app.
- **Ponto natural de parada:** ao terminar a missão do dia, tela de "terminou por hoje" com opção neutra de continuar, não um próximo exercício que começa sozinho (Decreto art. 9º I e II; ICO padrão 5).
- Opção "pausar sem perder progresso", visível e sem penalidade.

### 3.4 Notificações com tom gentil
**Regras [MINHA LEITURA, derivadas de Decreto art. 9º IV e 10 II, FTC e ICO]:**
- **Padrão: desligada na criança.** O lembrete padrão vai para o **aparelho do responsável** ("Hoje ainda tem uma missão de 5 minutos esperando o Bobby e o João"), ligado pelos pais.
- Frequência: no máximo 1 por dia, em janela diurna combinada com a família; **nunca à noite**. Se 2 lembretes seguidos não forem abertos, parar de mandar por uma semana.
- Sem contagem regressiva, sem "últimas horas", sem "você vai perder".
- Sem o mascote sentindo falta, triste, decepcionado ou chorando.
- Sem prometer recompensa surpresa para forçar abertura (recompensa imprevisível).
- Opt-out em um toque, na própria notificação e nas configurações.

**Exemplos de copy**
| Evitar | Preferir |
|---|---|
| "Não deixe sua ofensiva de 12 dias morrer!" | "Você já estudou 12 dias. Hoje tem uma missão rápida, se quiser." |
| "O Bobby está triste sem você" | "O Bobby preparou uma missão nova de ciências." |
| "Últimas 2 horas para manter sua ofensiva!" | "Sua missão de hoje continua disponível até a noite." |
| "Seus amigos já passaram você na liga!" | "Esta semana você fez 4 missões. Bom trabalho." |
| Botão de recusa "Não, prefiro ficar para trás" | Botão de recusa "Agora não" |

### 3.5 Limites de tempo e pausas
- Teto suave de missões por dia, definido pelos pais; ao atingir, mensagem de encerramento positiva, sem recompensa extra por continuar.
- Sugestão de pausa a cada bloco de tempo, com botão "salvar e sair" que mantém o progresso. (ICO padrão 13 recomenda incentivar pausas.)
- Evitar qualquer recompensa por tempo na tela (Decreto art. 9º III).

---

## 4. Checklist prático

### 4.1 Dados mínimos
- [ ] Mapear cada dado coletado e a finalidade de cada um. Se não é estritamente necessário para a criança jogar, não coletar (LGPD art. 14 §4º; ICO padrão 8).
- [ ] **Criança:** apelido e avatar, não nome completo, foto, escola, endereço ou geolocalização. Idade ou faixa, não data de nascimento exata. [MINHA LEITURA, coerente com Decreto art. 25 §1º que veda envio de data exata no sinal de idade]
- [ ] **Responsável:** e-mail para contato e prova de consentimento. Nada além disso por padrão.
- [ ] Sem voz, imagem ou microfone da criança. Se algum dia houver, é dado sensível de risco alto e exige nova análise.
- [ ] Sem SDK de anúncio e sem analytics de terceiros que enviem ID de criança. Se usar analytics, de preferência próprio ou configurado sem identificador persistente.
- [ ] Geolocalização desligada (art. 17 §4º VI).

### 4.2 Consentimento dos pais
- [ ] Consentimento **específico e em destaque** (LGPD 14 §1º), separado dos termos de uso, por finalidade, sem caixa pré-marcada.
- [ ] Esforço razoável de verificar que quem consente é adulto responsável (§5º). A forma concreta (por exemplo confirmação por e-mail mais um segundo fator) é decisão para o advogado; a ANPD ainda não publicou guia definitivo.
- [ ] Aviso à criança em linguagem simples, com recurso visual ou em áudio (§6º).
- [ ] Política pública com tipos de dado, uso e como exercer direitos (§2º).
- [ ] Revogação tão fácil quanto dar o consentimento, em português (art. 8º §5º da LGPD; Decreto art. 10 III).
- [ ] Pais com painel: ver e configurar conta e privacidade, restringir compras, ver tempo de uso, desligar recursos (ECA Digital arts. 17 e 18).
- [ ] Alinhar com a **loja de aplicativos**: o sinal de idade e a autorização de download dos pais (art. 12 §2º) vêm da Apple e do Google. O app deve estar preparado para receber o sinal (art. 14).
- [ ] Indicar a **classificação indicativa** nos termos de uso, em português (Decreto art. 12 §4º). A classificação do app em loja é obrigação de processo junto ao MJSP e às lojas; o rito exato eu não confirmei.

### 4.3 Sem anúncio comportamental
- [ ] Zero publicidade direcionada por perfil (arts. 22 e 26) e zero análise emocional para publicidade.
- [ ] Sem perfil comportamental da criança para qualquer fim comercial (art. 26 é específico para publicidade, mas o art. 7º §2º e o melhor interesse sustentam a regra mais ampla). [MINHA LEITURA]
- [ ] Personalização de conteúdo pedagógico (dificuldade, tema) é permitida em tese, mas deve ser desligável pelos pais (art. 17 §4º V) e documentada no relatório de impacto.
- [ ] Sem venda nem cessão de dado a terceiro.

### 4.4 Retenção e exclusão
- [ ] Definir prazo por tipo de dado e escrever na política. Guardar só pelo tempo necessário (LGPD art. 15 e 16; COPPA com a mesma lógica).
- [ ] Botão de exclusão da conta e dos dados pelos pais, com confirmação, e rotina que apague de verdade, inclusive backups dentro de prazo definido.
- [ ] Conta inativa: aviso aos pais e eliminação após período de inatividade (prazo a definir; **12 a 24 meses é sugestão minha**, não está na lei).
- [ ] Dado usado para verificar idade: eliminar imediatamente (art. 13 da Lei 15.211; Decreto art. 24 §3º).
- [ ] Anonimizar dado para estatística (LGPD art. 16, IV) quando for manter.
- [ ] Prova de consentimento: guardar o registro enquanto durar o tratamento e pelo prazo que o advogado definir.
- [ ] Atender pedidos de acesso e correção em prazo curto, canal em português (LGPD art. 18).
- [ ] Segurança: cifrar dado no campo, RLS ligada em toda tabela com dado de criança, acesso mínimo, log de acesso. (Regras da skill `seguranca-minima`.)

### 4.5 Governança
- [ ] **Relatório de impacto à proteção de dados** (ECA Digital art. 16, parágrafo único) para o tratamento além do estritamente necessário, e gerenciamento de risco das funcionalidades (art. 8º I).
- [ ] **Representante legal no Brasil** (art. 40), óbvio se a empresa já é brasileira, mas precisa estar nos documentos.
- [ ] Canal de denúncia e contato do encarregado (DPO) em português.
- [ ] Revisão de cada mecânica de engajamento contra o checklist do Decreto arts. 9º e 10 **antes** de cada lançamento. Guardar registro dessa revisão.
- [ ] Observar a consulta pública da ANPD sobre fiscalização e sanção (até 26/10/2026) e o guia definitivo de aferição de idade quando sair.

---

## 5. O que não consegui confirmar

1. **5Rights Foundation:** as páginas e o PDF deram 403. O que está acima sobre o relatório vem de resumos de busca.
2. **Lista de tipos de dark pattern do deceptive.design:** só abri a página de confirmshaming. Os demais nomes de padrão vêm do relatório da FTC.
3. **Resolução da ANPD sobre melhor interesse da criança:** não achei. O que existe é o Enunciado CD/ANPD 1/2023 [ABERTO] e o Guia de legítimo interesse (2024) [só resumo].
4. **Guia definitivo de aferição de idade:** segundo a ANPD (22/09/2026) ainda não foi publicado. Não há como afirmar o que ele vai exigir.
5. **Estudos revisados por pares sobre Duolingo e ansiedade, e sobre streaks com crianças de 7 a 12:** não achei. Números de blogs sobre culpa e ansiedade foram descartados.
6. **Rewley et al. (2021):** só em resumo de busca, com adultos.
7. **Central de ajuda da Duolingo (congelador e reparo):** só via resultado de busca; abri apenas o post de 2017. A cifra de +0,38% de usuários ativos com dois congeladores aparece em resumo de busca, mas **não a encontrei no post que abri**; não use.
8. **Ano de entrada em vigor do Children's code do Reino Unido, definição de criança do ECA (art. 2º) e Kahneman e Tversky:** do meu conhecimento prévio, não reabertos.
9. **GDPR art. 8:** conferi só pelo resumo da página oficial da UE, não li o texto bruto.
10. **Datas do COPPA:** a data de adequação 22/04/2026 e as exceções do §312.11 vêm de resultado de busca no Federal Register; não li o regulamento integral.
11. **Lei 14.852/2024 (Marco Legal dos Jogos Eletrônicos):** li os arts. 16 e 17 no planalto.gov.br. [ABERTA] Não analisei o resto da lei.
12. **Como a classificação indicativa de app é solicitada e o que a ANPD vai exigir para "acesso provável":** não confirmei o rito.
13. **Quais bases legais cabem para cada dado do Bobby:** não é pergunta de pesquisa, é decisão jurídica.

## 6. O que precisa de advogado antes da versão final

- Escolha da base legal por finalidade e redação do consentimento parental.
- Método de verificar o responsável, à luz do guia definitivo da ANPD.
- Enquadramento de ligas, baús e ofensiva contra os arts. 9º e 10 do Decreto 12.880 (a ANPD ainda vai regulamentar o detalhe).
- Política de privacidade, termos, relatório de impacto e contrato com operadores (hospedagem, banco, e-mail).
- Eventual cobrança futura: compra só por adulto, cancelamento fácil, consumidor (CDC), e a lógica de moeda virtual.

---

## 7. Fontes

**Primárias, abertas e lidas**
- Lei 15.211/2025 (ECA Digital): https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2025/lei/L15211.htm
- Decreto 12.880/2026: https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2026/decreto/d12880.htm
- LGPD, Lei 13.709/2018: https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm
- Lei 14.852/2024 (Marco Legal dos Jogos Eletrônicos): https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2024/lei/L14852.htm
- ANPD, perguntas e respostas sobre o ECA Digital (30/07/2026): https://www.gov.br/anpd/pt-br/assuntos/eca-digital/perguntas_respostas_eca_digital_30072026.pdf/@@display-file/file
- ANPD, orientações preliminares e cronograma de aferição de idade (20/03/2026): https://www.gov.br/anpd/pt-br/assuntos/noticias/anpd-publica-orientacoes-preliminares-e-cronograma-para-afericao-de-idade-no-ambiente-digital
- ANPD, "ECA Digital completa um ano" (16/09/2026, atualizada 22/09/2026): https://www.gov.br/anpd/pt-br/assuntos/noticias/eca-digital-completa-um-ano-e-e-marco-na-protecao-de-criancas-e-adolescentes-na-internet
- Enunciado CD/ANPD nº 1/2023: https://bibliotecadigital.mj.gov.br/bitstream/1/10215/2/Enunciado_ANPD_2023_1.html
- FTC, Bringing Dark Patterns to Light (PDF): https://www.ftc.gov/system/files/ftc_gov/pdf/P214800+Dark+Patterns+Report+9.14.2022+-+FINAL.pdf
- FTC, comunicado do relatório (15/09/2022): https://www.ftc.gov/news-events/news/press-releases/2022/09/ftc-report-shows-rise-sophisticated-dark-patterns-designed-trick-trap-consumers
- FTC, regra COPPA final (16/01/2025): https://www.ftc.gov/news-events/news/press-releases/2025/01/ftc-finalizes-changes-childrens-privacy-rule-limiting-companies-ability-monetize-kids-data
- ICO, Children's code, os 15 padrões: https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/childrens-information/childrens-code-guidance-and-resources/age-appropriate-design-a-code-of-practice-for-online-services/code-standards/
- ICO, padrão 5: https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/childrens-information/childrens-code-guidance-and-resources/age-appropriate-design-a-code-of-practice-for-online-services/5-detrimental-use-of-data/
- ICO, padrão 13: https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/childrens-information/childrens-code-guidance-and-resources/age-appropriate-design-a-code-of-practice-for-online-services/13-nudge-techniques/

**Secundárias ou resumo**
- Silverman e Barasch (2023), repositório da universidade de Delaware: https://udspace.udel.edu/handle/19716/34160
- Brignull, confirmshaming: https://www.deceptive.design/types/confirmshaming
- Duolingo, post de 2017 sobre streaks: https://blog.duolingo.com/how-streaks-keep-duolingo-learners-committed-to-their-language-goals/
- GDPR (EUR-Lex): https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32016R0679
- Federal Register, COPPA (22/04/2025): https://www.federalregister.gov/documents/2025/04/22/2025-05904/childrens-online-privacy-protection-rule
- 5Rights, Disrupted Childhood 2023 (não consegui abrir, 403): https://5rightsfoundation.com/uploads/Disrupted-Childhood-2023-v2.pdf

**Nota de método:** as páginas do planalto.gov.br exigiram `curl -k` (falha de certificado na cadeia do site do governo). Foi leitura pública, sem envio de dado, e o texto foi lido por completo nos artigos citados.
