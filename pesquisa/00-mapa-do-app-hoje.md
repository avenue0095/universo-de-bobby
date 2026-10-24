# O Universo de Bobby: mapa do app hoje

Data da observação: 24/10/2026. Versão observada: `index.html` de produção (6.484 linhas, 488.614 bytes), commit `c9b07e9`. Nada foi editado no app.
Método: servi a pasta com `http.server 8765`, abri no Playwright (desktop 1280x800 e mobile 390x844), criei o perfil de teste "Teste" (nível 9 a 10 anos), joguei a fase 1.1 de matemática com acerto e erro, abri perfil, loja, responsável (PIN de teste criado e descartado com o localStorage do navegador de teste), voz, galeria, mapa de português e fase de inglês. Li o código por trechos. Para o catálogo de perguntas, rodei `genQuestions` em todas as 150 fases.
Prints: `pesquisa/mapa-atual/` (prefixo `d` = desktop, `m` = mobile).

Convenção de evidência: `L<número>` é linha de `/Users/filipealvesesilva/Projetos/universo-de-bobby/index.html`.

---

## 1. Queixas da usuária (filha) e causa provável

Esta seção vem primeiro por pedido do Filipe. Tudo abaixo foi conferido no código e, quando dá, reproduzido.

### 1.1 Voz dos áudios muito ruim no celular

**Como o app fala hoje.** Só existe `speechSynthesis` (voz do próprio aparelho). Não há nenhum arquivo de áudio gravado nem voz neural: busquei `new Audio`, `.mp3`, `.ogg`, `.wav` e não há ocorrência. O resto do som são bipes de Web Audio com oscilador (`nota()`, L4881).

Fluxo de `falar(html, lang)` (L4955-L4976):
1. `speechSynthesis.cancel()` e logo em seguida `speak()` (L4958 e L4974), sem pausa.
2. Português: se a criança não escolheu voz (`S.vozPt` vazio, que é o padrão), o app **não define `u.voice`** (L4969-L4970). Quem decide é o aparelho. No Android isso costuma ser o motor de voz padrão do fabricante (muitas vezes a voz robótica "compacta").
3. Inglês: se não houve escolha, `vozDe('en-US')` ranqueia por nome (L4924-L4953). Se não há voz inglesa ou a lista de vozes ainda está vazia, `falar` **retorna calado** (L4971). O aviso `avisoVoz()` só aparece se `VOZES.length>0` (L4971).
4. Velocidade: `u.rate=(ing?.82:.92)*S.velocidade`, `u.pitch=1.05` (L4973). Padrão 100%, controle de 60% a 130% em `telaVoz` (L5982).

**Causas prováveis da voz ruim (ordem de impacto):**
- **O ranking de qualidade só reconhece nomes de macOS e Windows** (`samantha|ava|allison|luciana|joana|google|zira|aria|jenny|francisca`, `premium|enhanced|neural|natural|siri`, L4934-L4937). No Android, as vozes vêm com nomes como "Português do Brasil" ou ids `pt-br-x-xxx-local`; nenhum bate. O score vira só `localService +4` e `lang +6`, ou seja, um empate que escolhe a primeira da lista. Prova: no meu Chrome de Mac, a lista de português ordenou `Luciana, Felipe (Aprimorada), Felipe, Eddy, Flo` (voz de piada no top 5 porque só existem poucas vozes pt-BR).
- **`localService` ganha +4**, então voz local compacta vence voz de rede (que costuma ser a melhor, ex.: vozes Google/Neural). O app prefere "funciona offline" a "soa bem" sem avisar ninguém.
- **Português sem escolha = voz padrão do aparelho** (L4969). Não há tentativa de achar a melhor voz pt-BR como fez para o inglês.
- **A tela de escolha de voz lista tudo, inclusive vozes de piada.** `VOZ_RUIM` (L4922) só rebaixa na ordenação; `telaVoz` (L5935-L5968) mostra todas. Vi `Eddy`, `Flo`, `Grandma`, `Grandpa` como opções para uma criança (print `d16-voz.png`). Os nomes `Felipe` aparecem duplicados (uma é "Aprimorada", mas o rótulo curto corta no parêntese, `nomeCurto` L5940).
- **Texto longo numa fala só.** A abertura do capítulo + título + história vão juntos num único `Utterance` (L5213). O Chrome (desktop e Android com voz de rede) costuma cortar falas longas por volta de 15 s. Não há `onend`, nem fila, nem divisão por frase.
- **Sem opção de desligar só a voz.** `S.voz:true` existe no estado (L4755) mas **nunca é lido**. O botão de som (`#som`) só controla bipes.

**Oportunidade:** áudio pré-gravado ou neural (arquivos pequenos, cache no service worker) para o conjunto finito de falas fixas (aulas, histórias, palavras de inglês); `speechSynthesis` só como reserva.

### 1.2 Bugs de áudio e de aulas que dependem de áudio

Cada item tem o passo a passo. Os marcados **[reproduzido]** eu rodei no Playwright com `speechSynthesis.speak` instrumentado.

**B1. A fala continua depois de sair da fase [reproduzido].**
Passo a passo: perfil nível "6 a 8 anos" (`S.nivel==='facil'`) → abrir qualquer fase → tocar no X em menos de 0,4 s (ou avançar rápido).
Resultado medido: após `fecharLicao()` o app disparou 2 falas ("O Bobby resolveu plantar uma horta..." e "Qual número vem depois do 3?") **com a fase já fechada, na tela do mapa**.
Causa: `setTimeout(()=>falar(...),350)` em L5213 e `setTimeout(()=>falar(...),420)` em L5324 não guardam o id do timer, então `fecharLicao()` (L5152) e `avancar()` (L5512) chamam `calar()` mas não cancelam o timer pendente. Compare com `LIC.tDica`, que é guardado e cancelado (L5514). Em criança que toca rápido, a voz da pergunta anterior atropela a seguinte.
Também afeta o inglês: `q.ouvir` força fala em qualquer nível (L5324).

**B2. "Desligar sons" não desliga a voz [reproduzido].**
Passo a passo: ícone de alto-falante do topo (ou Perfil → Desligar sons) → abrir fase.
Resultado: com `S.som=false`, `falar('teste')` ainda chamou `speak` (1 fala). `falar` (L4955) nunca consulta `S.som` nem `S.voz`. Só `nota()` (L4882) respeita. Na prática o rótulo mente.

**B3. Botão de som e ofensiva somem no celular.**
Passo a passo: abrir em 390 px de largura.
Resultado (print `m02-mapa.png`): o cabeçalho mostra só moedas, matéria, desenhos e perfil. A regra `@media (max-width:430px){ #st-fogo,#som{display:none} }` (L659-L661) esconde a ofensiva e o botão de som. A criança no celular **não vê a ofensiva** e **não tem como silenciar** sem entrar no perfil.

**B4. iOS exige gesto para a fala; a fala automática vem de `setTimeout`.**
Passo a passo (iPhone/Safari): abrir o app, entrar em fase no modo "6 a 8 anos" sem ter tocado em nenhum botão de som.
Risco: Safari iOS só libera `speechSynthesis.speak` depois de um gesto do usuário na página. O toque em "Vamos ajudar!" conta como gesto, mas a fala sai de um `setTimeout` (L5213/L5324) e o iOS pode rejeitar a primeira. Não consegui testar em iOS real (não tenho aparelho no ambiente). **Precisa de teste no aparelho da filha.**

**B5. `cancel()` imediatamente antes de `speak()`.**
Em `falar` (L4958 e L4974). É um padrão que falha em vários Chrome/Android e iOS: a fala nova é engolida. Efeito percebido: "às vezes não fala", "às vezes corta o começo". Já chamamos `calar()` no clique do botão (L6385) e de novo dentro de `falar`.

**B6. Vozes carregam tarde e a pergunta de inglês é decidida uma vez só.**
`carregarVozes` tenta no load, em `voiceschanged` e com timeouts de 300 ms e 1,2 s (L4915-L4918). No iOS e em alguns Android `getVoices()` volta vazio por mais tempo. `ouvirEN` (L3833) decide **na geração da pergunta** (`genQuestions`, chamado em `abrirLicao`, L5137) se há voz inglesa (`podeOuvirEN`, L3830). Se as vozes ainda não chegaram, a pergunta vira "Qual destas palavras se fala assim" (L3838), isto é, a aula de ouvir vira aula de ler, **em silêncio e sem aviso**, para toda aquela fase. Se as vozes chegarem depois, nada muda.
Inverso: com `VOZES.length===0` e pergunta já marcada como `ouvir`, `falar` sai calado (L4971) e a criança não consegue responder a pergunta de "ouça".

**B7. Inglês: 341 de 400 perguntas sorteadas são de ouvir (85%).** Levantamento com `genQuestions(l,8)` em 50 fases: `mc+ouvir` 341, `texto` 42, `mc` 17. Se o áudio falhar (B1, B5, B6, voz ruim), **quase toda a galáxia de inglês fica inutilizável**. Não existe "gravar a própria voz" nem pergunta de falar.

**B8. Pergunta de inglês entrega a resposta.** Print `d24-pergunta-en.png`: o enunciado diz "tchau se diz **goodbye**... Agora toque em tchau escrito em inglês" e uma das opções é `goodbye`. É teste de reconhecimento, não de aprendizado.

**B9. Tocar de tela durante a fala.** `renderTrilha` chama `calar()` (L5106), mas abrir perfil, loja, galeria, responsável e voz **não chamam `calar`**. Fala iniciada por "ouvir exemplo" continua por cima da outra tela. `telaVoz` testa voz com `falar` (L5997-L6002) sem checar `S.som`.

**B10. Contexto de áudio do iOS.** `nota()` cria `AudioContext` na primeira chamada e nunca chama `resume()` (L4884). Após a tela bloquear ou uma ligação, o contexto fica `suspended` no iOS e os bipes ficam mudos até recarregar. Não testado em aparelho.

**B11. Sem pausa ao ir para segundo plano.** Não há `visibilitychange`. Em alguns Android a fala continua com o app em background.

### 1.3 Mapa e personagens parecem "fake"; difícil achar onde trocar personagem

**Quantos toques para trocar de personagem (medido no código):**
1. Toque no ícone de pessoa no cabeçalho (`#trocar-nome`, L813). **O rótulo diz "Trocar de jogador", mas abre "Meu perfil"** (L6396). O mesmo vale para o lápis ao lado de "Oi, Teste" (L5114, `editar-nome` → `telaPerfil`).
2. Rolar até "Guarda-roupa do Bobby" (botão `#ir-loja`, L5802). Fica **depois** dos cartões de estatística, das galáxias, da viagem e das conquistas, abaixo da dobra. No desktop precisa rolar.
3. Aba "Personagem" (a loja abre na aba "Chapéus", `abaLoja='chapeu'`, L5631).
4. Escolher e tocar em "usar" ou comprar.
**Mínimo: 4 toques mais rolagem.** Não há atalho no mapa: o Bobby do mapa e o Bobby da saudação não são tocáveis.

**Por que parece "fake":**
- **Um só molde de corpo.** `MASC()` (L4637-L4678) é uma cabeça redonda (`rect rx=44`) + focinho + dois pezinhos. Os 5 "personagens" (`PERS`, L4610) mudam só a orelha e um detalhe: Bobby ursinho, Nina coelhinha, Pim gatinho (bigodes), Zeca macaquinho (mancha), Lulu corujinha (bico + olhos redondos). Mesmos olhos, mesmo nariz, mesma boca.
- **O nome e o texto não acompanham o personagem.** `aria-label="Bobby, o ursinho"` fixo em L4666 e todo o texto de história fala "o Bobby", mesmo com a Lulu equipada.
- **Só 4 expressões** (`oi`, `feliz`, `ops`, `pensa`; L4650-L4663) e **só 2 animações CSS** no personagem (`pula` L394 e `tremer` L391). Sem corpo, sem braços, sem poses, sem reação de verdade ao longo da fase (só um selo trocando no rodapé).
- **Acessórios soltos:** 6 chapéus, 4 de rosto, 4 de pescoço, 6 cores de pelo (L4566-L4609). Bom para coleção, mas o personagem não "vive" no mapa nem nas aulas.
- **Cenário genérico:** 12 sprites de SVG simples (`CEN`, L4680) distribuídos por `TEMAS` (L5036) em 5 posições fixas (`CENAS`, L5035). Os 10 mundos usam só 2 traçados em zigue-zague (`TRACADO`, L5031) alternados por `ui%2`. **Os três mapas (matemática, português, inglês) usam exatamente o mesmo traçado e a mesma paleta verde** (prints `d03`, `d18`). Nada diz "estou em outra galáxia" além do título.
- **A recompensa de fase é pouca:** confete + estrelas + o mesmo Bobby sorrindo (print `d09-fim-fase.png`).

### 1.4 Desenhos para colorir: feios, mal feitos, um por fase

**Como são gerados:**
- `DESENHO(ui, li)` (L2600) monta um SVG 600x900 em **linha preta sobre branco** juntando: moldura (`MOLDURA`, L2312), título, cena de caminho (`CENA_FN`, 5 funções, L2174), peças de cenário (`PC`, L2080) e um "exercício visual" `M[cfg[0]]` (L2177, ex.: `itens`, `grupos`, `cestas`, `escada`, `grade`).
- A configuração de cada desenho está em tabelas por fase: `FASES` (matemática, L2541), `FASES_PT` (L2437), `FASES_EN` (L2489). Exemplo: `'1.1':['itens',[12,'ITEM'],'Conte as sementes...']`.
- Tudo é formas primitivas (retângulos, círculos, elipses) com traço de 3 px e texto Fredoka no SVG. Viram PNG 1000x1500 no canvas e PDF A4 com jsPDF (`baixarDesenhos`, L6280-L6300).
- Cada fase concluída libera **um** desenho. **Total: 150 desenhos** (50 por galáxia), todos com a mesma lógica de cena + contagem, onde o desenho vira exercício, não ilustração para pintar.

**O que está ruim (ver `d17-galeria.png`, `m06-galeria.png`):**
- O Bobby desenhado em linha (`bobbyLinha`, L2057) é só a cabeça e a casa-castelo é um bloco de retângulos.
- Espaços para colorir pequenos e repetitivos (12 sementes iguais), composição de cartão de atividade, não de página de livro de colorir.
- **Bug visual na galeria:** o botão "Baixar todos os desenhos" mostra o ícone **gigante** (200 px, empurrando o texto) porque `.gal-acoes .btn svg` não tem regra de tamanho (L523-L524; as outras telas têm, L578 e L762). Aparece em desktop e mobile.
- A dependência de PDF vem de CDN externa (`jspdf` em cdnjs, L872); sem internet o app cai para `.svg`. Em L6305 há resquício de `window.claude.use('downloads')`, de quando o código rodava como artefato; é código morto aqui.

**Como o mapa agrupa fases (a "casinha"):**
- Cada galáxia tem **10 mundos** (`UNITS_MAT`, `UNITS_PT`, `UNITS_EN`; 50 fases por galáxia, 150 no total).
- Cada mundo = **5 fases + 1 "Revisão do mundo"** (medalha) e usa um capítulo de história (`CAPITULOS`, L1955; 10 capítulos em matemática, com um item temático: semente, concha, gota, fruta...). A 5ª fase tem o ícone de castelo (`ehCastelo`, L5069).
- O fecho do mundo é detectado por `mundoCompleto(u)` (L5018) e mostrado como "Mundo N completo!" na tela de fim (L5553). **Já existe o gancho certo para "um desenho por etapa completa".**
- **Proposta da família (um desenho por mundo):** hoje 150; passaria a 30 (10 por galáxia). O ponto de troca é `pintarFim` (L5533, bloco `premio`) e a galeria `abrirGaleria` (L6144), que hoje itera por fase. O capítulo de cada mundo (`CAPITULOS[n].t` e `.item`) já dá o tema do desenho. A arte pode ficar em 30 SVGs/PNGs desenhados de verdade (e não procedurais), e a galeria pode mostrar o desenho "montando" conforme as 5 fases avançam.

---

## 2. O que existe (inventário)

### 2.1 Estrutura e telas
- **Arquivo único** `index.html` (488 KB), com vários blocos `<script>` (dados das 3 matérias e o app). Sem build, sem framework.
- Telas (todas em `index.html`): escolha de jogador (`telaPerfis`, L6110), escolha de galáxia (`telaMaterias`, L4727), mapa/trilha (`renderTrilha`, L5105), fase (`abrirLicao`, L5137), revisão da aula (`abrirRevisao`, L5621), perfil (`telaPerfil`, L5757), guarda-roupa (`telaLoja`, L5653), responsável (`telaResponsavel`, L5831), voz (`telaVoz`, L5935), galeria de desenhos (`abrirGaleria`, L6144).
- Fluxo de uma fase (`LIC.etapa`): `historia` (só na 1ª do mundo, com capítulo) → `aula` (3 passos: ideia, exemplo, "pra não esquecer") → `questao` (8 perguntas, mais repetição dos erros) → `fim`.
- Perfil de teste e primeira abertura: a tela "Quem vai jogar?" abre o diálogo de novo jogador (nome, 6 cores e 3 faixas de idade: 6-8, 9-10, 11+). A faixa muda o nível (`facil`, `medio`, `dificil`).

### 2.2 Conteúdo
- 3 galáxias × 10 mundos × 5 fases = 150 fases. Matemática: contagem, soma/subtração, multiplicação, divisão, frações, decimais e dinheiro, porcentagem, geometria, álgebra, dados e negativos. Português: letras, sílabas, leitura, gramática. Inglês: vocabulário do dia a dia.
- Cada capítulo de matemática tem uma missão com história (`MISSOES`, L1977; ex.: "Contar as sementes", "Escolher o canteiro maior").

### 2.3 Tipos de pergunta (medido em 50 fases por galáxia, 8 perguntas por fase)

| Galáxia | Tipos e contagem |
|---|---|
| Matemática | múltipla escolha 131, digitar número 178, V/F 51, mc com figura 15, input com figura 12, **blocos 3, grupinhos 3, fração 4, dinheiro 2**, V/F com figura 1 |
| Português | múltipla escolha 238, V/F 44, mc com figura 28, **ouvir 23**, **montar letras 40**, **sílabas 15**, input 10 |
| Inglês | **mc com ouvir 341**, montar letras 42, mc 17 |

Leitura: os tipos interativos "de verdade" (blocos de material dourado, pintar fração, grupos, notas e moedas) são raros em matemática (12 de ~400) e somem em português e inglês. Não existem: arrastar e soltar, ordenar, ligar pares, escolher a imagem, falar ao microfone, ouvir-e-escrever.

### 2.4 Mecânicas de retenção
- **Moedas = XP.** São a mesma variável (`S.xp`), mostradas como "Moedas". +10 por acerto; combo a cada 3 acertos dá +5 e devolve 1 coração (`conferir`, L5462-L5490); fase perfeita dá +20 (L5536); dia seguido dá `min(50, ofensiva*5)` (`marcarDia`, L4871-L4876).
- **Ofensiva** (dias seguidos). Sem congelamento, sem aviso de "vai perder", sem notificação.
- **Corações:** 5 por fase, perde 1 por erro; com 0 a fase acaba (`Acabaram os corações`), mas dá para "continuar por 50 moedas" uma vez por fase (L5499-L5510).
- **Estrelas por fase:** 3 sem erro, 2 com até 2 erros, 1 acima disso (L5534).
- **Loja:** 5 personagens, 6 chapéus, 4 itens de rosto, 4 de pescoço, 6 cores de pelo; preços de 100 a 600 moedas (L4566-L4609).
- **Conquistas:** 12 (`CONQUISTAS`, L5726), ex.: "Primeira fase", "Uma semana".
- **Nível do explorador:** `floor(fases/5)+1`, máx. 20 (L5761), só exibido no perfil.
- **Missões do dia / meta diária / baú / evento semanal:** **não existem**.

### 2.5 Adaptação de dificuldade e revisão
- **Adaptação de verdade: não existe.** O que existe é por faixa de idade escolhida uma vez: no `facil` há mais fala automática, 3 opções em vez de 4 (L5200) e dica automática depois de erro (L5496).
- **Dentro da fase:** erro repete a pergunta uma vez no fim (`__rep`, L5493). As 2 primeiras perguntas mostram "Lembre da aula" (L5238). Fase curta completa com `reforco()` de fases anteriores (L1646).
- **Caderno de erros:** `S.errados[materia+mundo]`, até 30 por mundo (`guardarErrado`, L5580). A **Revisão do mundo** (medalha dourada) devolve os erros e completa com perguntas novas (`abrirRevisaoMundo`, L5596). Acertar tira do caderno. É o ponto forte de repetição espaçada, mas **só aparece depois de completar o mundo inteiro**; não há revisão diária.
- **Ajuda em 2 degraus:** "Como fazer" e "Ainda não entendi" (`mostrarDica` L5410, `ajudaForte` L5428), com fala.

### 2.6 Relatório dos pais
Tela "Para o responsável" (L5831; print `d13-responsavel-0.png`): fases feitas, tempo total, acerto geral, barras dos últimos 7 dias, "Onde ela mais erra" (fases com maior taxa de erro), "O que fazer com ela hoje" (4 sugestões práticas), explicação do método, instruções de instalar na tela inicial, cópia de segurança em `.json`, restauração e senha. Texto fixo no feminino ("ela", L5863), mesmo que o perfil seja de menino. Nada é enviado para fora (aviso explícito na tela). Senha: 4 a 6 números (`pedirSenha`, L6035), hash `djb2` simples com sal (`embaralha`, L6016). É uma tranca para a criança, não segurança real (o próprio código diz isso, L6008-L6010); 4 dígitos se quebram em milissegundos por quem abre o console.

### 2.7 Eventos e analytics
**Nenhum.** Não há `fetch`, `gtag`, pixel, `Notification` nem endpoint. As únicas requisições externas são Google Fonts e jsPDF (cdnjs). Há estatística **local** (`S.stats`: por fase acertos e erros, por dia fases e segundos, tempo total, L5521-L5532). Para o Filipe isso significa: não dá para medir retenção real (D1, D7) hoje.

### 2.8 PWA
- `manifest.webmanifest`: `standalone`, `portrait`, ícones 192, 512 e maskable, `theme_color #12A06E`, `lang pt-BR`. OK.
- `sw.js` (cache `bobby-v3`): página "rede primeiro, cache como reserva"; ícones e manifesto "cache primeiro"; recarrega sozinho em versão nova (`index.html` L6455-L6484). Pontos fracos: **não pré-carrega as fontes do Google nem o jsPDF** (offline cai para a fonte do sistema e não gera PDF), e **não existem notificações nem push**.
- Instalação orientada por texto no painel do responsável (`instrucaoInstalar`, L5919). Não há botão "instalar" (`beforeinstallprompt`).

### 2.9 Acessibilidade
Pontos bons: `lang="pt-BR"`, `prefers-reduced-motion` respeitado (L123, L400, confete L6328), `:focus-visible` (L126), 35 `aria-label`/`role`, atalhos de teclado 1 a 4 e Enter (L6405), tema escuro automático, leitura em voz alta de tudo. Pontos fracos: `aria-live` só no contêiner da fase; mapa com 1.123 nós sem landmark; cor sozinha marca certo/errado (verde/vermelho), embora haja ícone de estrela; ícone de som do topo escondido no celular (B3); feedback de erro quebra em 3 linhas ("A resposta certa é / 8 / . Esta pergunta volta...", print `d07-erro.png`).

### 2.10 Desempenho e console
- Carga: `domContentLoaded` 672 ms e `load` 676 ms no localhost (sem rede real). 2.330 elementos no DOM; o mapa renderiza **os 10 mundos de uma vez** (1.123 nós).
- Dependências externas: Google Fonts (Fredoka, Nunito) e `jspdf@2.5.1` (cdnjs). Mais nada.
- Console: **0 erros do app**. Só o `favicon.ico` 404 (o `<link rel=icon>` aponta para o PNG, mas o navegador pede `/favicon.ico`).

---

## 3. O que funciona bem

- **Método concreto → desenho → número** na aula (barrinhas, fatias, moedas) e dicas com 2 degraus. Pedagogia séria e escrita com cuidado.
- **Narrativa por capítulo** com missão por fase e item temático (a criança "ajuda o Bobby").
- **Caderno de erros e revisão do mundo** sem punição.
- **Perfis separados, cópia de segurança, dados 100% locais, nome escapado contra XSS** (`escapa`, L4996). Boa história para LGPD e pais.
- **Painel do responsável útil**: fala o que fazer hoje, não só números.
- **PWA que se atualiza sozinho** sem prender versão velha.
- **Zero erro de console**, carga rápida, sem dependência pesada.
- Corrigido recentemente: placar real, distratores, média redonda (commit `c9b07e9`).

## 4. O que está fraco ou ausente

1. **Áudio:** qualidade dependente do aparelho, falhas silenciosas, fala após sair da fase, "sem som" que não silencia voz (seção 1).
2. **Identidade visual:** mesmo mapa e mesma paleta nas 3 galáxias; personagens variam só a orelha; sem animação de corpo.
3. **Retenção rasa:** moedas, ofensiva, corações e 12 conquistas, mas sem missão do dia, sem meta, sem proteção de ofensiva, sem lembrete, sem evento. E a ofensiva **some do cabeçalho no celular**.
4. **Ofensiva calculada em UTC.** `hoje()` usa `new Date().toISOString()` (L4870). No Brasil (UTC-3), jogar depois das 21h conta como o dia seguinte; uma criança que joga todo dia às 21h30 pode "pular" ou "repetir" dia e quebrar a ofensiva sem motivo. Teste feito só de leitura de código; vale reproduzir com data simulada.
5. **Anel de progresso do mapa conta todas as galáxias.** `feitas()` (L5013) soma todas as chaves de `S.feitas`, mas divide pelo total só da matéria atual (L5108). Com 1 fase de matemática feita, o mapa de português mostrou **"1/50"** (print `d18-mapa-pt.png`) enquanto o perfil e a tela de galáxias diziam 0/50. Aumenta errado quando a criança joga duas matérias.
6. **Placar do fim diz "Moedas 80"** enquanto o saldo subiu 95 (a conta do placar ignora o bônus de combo, L5565). Pequeno, mas quebra confiança na moeda.
7. **Tipos de pergunta pobres** em português e inglês; inglês é quase só "ouvir e tocar".
8. **Sem adaptação** além da faixa de idade escolhida na criação.
9. **Sem analytics**: impossível medir D1/D7, fase onde as crianças saem, taxa de erro por pergunta.
10. **Relatório do responsável só no aparelho** e só se o pai abrir. Sem resumo semanal por WhatsApp/e-mail.
11. **Mensagens de erro e acabamento:** feedback de erro quebrado em linhas, ícone gigante na galeria, rótulo "Trocar de jogador" que abre o perfil.
12. **Texto do responsável sempre no feminino** ("ela").

---

## 5. Oportunidades por área (com evidência)

### Personagens
- **Áudio como parte do personagem:** voz gravada do Bobby para frases fixas (aulas, histórias, palavras). Evidência: 1.1, `falar` L4955.
- **Corpo e poses de verdade:** hoje só cabeça; faltam poses (comemorar, pensar, apontar, dormir) e animações por evento. Evidência: `MASC` L4637, 4 expressões, 2 keyframes (L391, L394).
- **Personagens com personalidade:** Nina, Pim, Zeca e Lulu poderiam ter nome em falas e reações próprias; hoje todos "são o Bobby" (L4666).
- **Ponto de entrada visível:** tocar no Bobby do mapa ou da saudação abre o guarda-roupa (hoje 4 toques e rolagem).
- **Cada galáxia com seu "guia"** (matemática, português, inglês) em vez do mesmo urso.

### Mapa
- **Três mundos visuais distintos** (traçado, paleta, cenário). Hoje `TRACADO` tem 2 variantes e `TEMAS` só troca sprites (L5031, L5036).
- **O Bobby andando pelo caminho** até o próximo nó (hoje ele "pula" fixo no nó, L5069) e o castelo com estado (cadeado, luz, bandeira).
- **Mapa por "casinha" (mundo):** abrir um mundo por vez em vez de 10 mundos em rolagem (DOM de 1.123 nós, bom também para desempenho).
- **Corrigir o anel "1/50"** (5.5) e mostrar progresso do mundo.

### Ensino
- **Mais tipos de pergunta** onde faltam: ordenar, ligar, arrastar, escolher a figura, ditado (ouvir e escrever), leitura em voz alta. Evidência: tabela 2.3.
- **Inglês sem depender de TTS ruim:** áudio gravado por palavra e frase e pergunta que avalia sem som quando o áudio falha (B6, B7).
- **Adaptação simples:** subir ou descer a dificuldade pela taxa de erro recente da criança em vez de só pela idade informada na criação (hoje `S.nivel` fixo).
- **Revisão diária curta** (3 a 5 perguntas do caderno de erros) em vez de só a "Revisão do mundo" ao fim de 5 fases.
- **Corrigir pergunta que entrega resposta** (B8).

### Retenção
- **Missão do dia + meta (ex.: 1 fase ou 5 acertos)** com recompensa visível; hoje não existe nada diário além do bônus de ofensiva.
- **Ofensiva visível no celular** (B3), **calculada no horário local** (item 4 da seção 4) e com "escudo" para um dia perdido.
- **Separar XP de moeda:** XP só sobe (nível, ranking), moeda é gasta na loja. Hoje as duas são `S.xp` (L4752) e gastar moedas "diminui" o progresso.
- **Recompensa por mundo completo** (desenho, item raro, animação do castelo) no lugar do desenho por fase (1.4).
- **Lembrete para o responsável** (resumo semanal pronto para mandar no WhatsApp), alinhado ao relatório já existente.

### Visual
- **Desenhos de verdade, 30 em vez de 150** (seção 1.4).
- **Acabamento:** ícone da galeria, quebra de linha no feedback de erro, rótulo "Trocar de jogador" (seção 4, item 11).
- **Um sistema de ilustração único** (personagem, cenário, itens do capítulo, desenhos para colorir) em vez de formas primitivas em 3 lugares.
- **Tema por galáxia** (cor, céu, decoração).

### Técnico
- **Fala:** guardar o id do timer e cancelar em `fecharLicao`/`avancar` (B1); respeitar `S.som` (B2); `cancel` com pausa curta; dividir texto em frases e encadear por `onend`; reavaliar tipo da pergunta de inglês quando as vozes chegarem (B6); `AudioContext.resume()` (B10); `visibilitychange` (B11).
- **Ranking de voz** pensado em Android e iOS (checar `localService`, `lang`, nome de vozes reais desses sistemas) e esconder vozes de piada no seletor.
- **Offline completo:** cachear fontes e jsPDF no `sw.js`.
- **Analytics local primeiro, depois um evento simples** (fase aberta, concluída, saiu no meio, erro por pergunta) com consentimento dos pais. Hoje: nada.
- **Hash de senha:** se o PIN for o único acesso ao relatório, o `djb2` com 5.000 voltas não segura um adulto curioso; avaliar PBKDF2 do `crypto.subtle` (continua local).
- **Arquivo único de 488 KB:** separar dados de conteúdo (matemática, português, inglês) em arquivos facilita revisar e trocar, e deixa cachear por pedaço.
- **favicon 404:** servir `/favicon.ico` ou usar o `<link>` já declarado.

---

## 6. Lista de prints (`pesquisa/mapa-atual/`)

Desktop 1280x800: `d02-galaxias`, `d03-mapa-mat`, `d04-aula-mat` (história), `d05-aula-passo`, `d06-pergunta`, `d07-erro`, `d08-acerto`, `d09-fim-fase`, `d10-mapa-apos-fase`, `d11-perfil`, `d12-loja`, `d13-responsavel-0`, `d14-pin`, `d15-pin-criado`, `d16-voz`, `d17-galeria`, `d18-mapa-pt`, `d19-pergunta-pt`, `d20-tipo-blocos`, `d21-tipo-fracao`, `d22-tipo-dinheiro`, `d23-tipo-silabas-pt`, `d24-pergunta-en`.
Mobile 390x844: `m01-inicial-ou-galaxias`, `m02-mapa`, `m03-pergunta`, `m04-loja`, `m05-perfil`, `m06-galeria`.
Observação: os prints da tela de matemática dos tipos `d22` e `d23` foram gerados abrindo a fase pelo console para chegar direto ao tipo de pergunta.

## 7. Limites desta observação

- Sem aparelho iOS/Android real: B4, B6 e B10 são risco por leitura de código, não reprodução. B1, B2, B3 e os números de tipos de pergunta foram medidos.
- Joguei uma fase completa com cliques reais (acerto e erro) e as demais por chamadas internas do app para chegar às telas; a lógica de fim de fase é a mesma.
- Ofensiva em UTC (item 4) e cálculo de moedas do placar (item 6) vêm de leitura de código mais um fim de fase real; conferir com data simulada antes de corrigir.
