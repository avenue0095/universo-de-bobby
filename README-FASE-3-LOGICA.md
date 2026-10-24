# Fase 2 (lógica) · o que foi feito e o que ficou

Branch `reforma-fase-2`. Escopo: a camada de lógica e a correção de bugs, sem depender de arte nova nem do áudio gravado.
Nada foi publicado, nenhum áudio ou imagem foi gerado, nenhum crédito foi gasto. Nada em `docs/`, `arte/` ou `audio/` foi tocado.

## Feito (por item do pedido)

1. **28 defeitos de conteúdo.** Distratores com espaço no fim (`'chuva '`, `'caro '`, `'pães '`) trocados por erros reais; `'folha'` e `'banha'` eram segunda resposta certa (LH e NH) e foram trocadas; `mc()` compara opções sem espaço e `conferir()` compara a opção de escolha pelo texto exato (Lívia e lívia são opções diferentes de propósito). Negativos: 2.4, 6.3 e 9.2 não geram mais resultado negativo; no 10.5 as perguntas que revisam a 10.4 saem marcadas `q.negativo` (ali negativo é conteúdo). `conhecidos.json` está vazio e `verifica.js --estrito` passa.
2. **Áudio e interface.** `audio.js` com `audioTocar(chave|texto, idioma)`, pré-carga, cache, cancelamento por token e fala agendada cancelável (`audioAgendar`). A fala de 350/420 ms não sai mais depois de fechar a fase. `S.som=false` e `S.voz=false` silenciam a voz. Ranking de voz sem Eddy, Flo, Grandma, Grandpa, Reed, Rocko, Sandy, Shelley, Fred, Ralph etc. (saem da lista, nunca são escolhidas, nem as guardadas em perfil antigo); pt-BR vence pt-PT; voz local e Premium/Enhanced/Luciana/Samantha/Google sobem. Celular (<431 px): ofensiva e som voltam ao topo, compactos. O manifesto de clipes ainda não está integrado (`audioDefinirManifesto` existe, ninguém chama).
3. **Estado v4.** Chave `universo-bobby-v4`; `mundo-numeros-v2` só é lida (teste confere byte a byte, antes e depois de jogar) e ganha cópia `mundo-numeros-v2.bak-v3`. Migração valida (fases, XP, ofensiva) antes de gravar. XP nunca diminui; `moedas` é o saldo. Dia local (`diaLocal()`), fim do `toISOString()` como data. 1 congelador de cortesia. Backup v4 com `soma`, import de v3 e v4, pergunta "substituir ou salvar como outro" quando o id já existe, aviso quando a soma não bate. Placar de fim de fase mostra o ganho real. Anel do mapa conta só a matéria atual.
4. **Ciclo diário.** Ofensiva portada de `referencia-ofensiva.js` (os 12 casos, mais 4) com congelador ganho, descanso e recuperação. Dia vivo, meta cheia em perguntas (15 s por pergunta, calibra pela mediana depois de 50), baú sem sorteio com a tabela dos dias 1 a 30 (e marcos depois), 3 missões determinísticas (catálogo de 14, geração A/B/C, ajuste silencioso do alvo), bilhete do Bobby, Kit de volta, tela "Por hoje chega" (uma vez por dia; "continuar" desliga baú, missão nova e bônus de combo), limite de blocos pelo responsável. UI funcional com tokens do DESIGN.md.
5. **Caderno espaçado.** Caixas 1, 3, 7, 14, 30; erro cai 2; acerto com dica fica; atraso > 2x cai 1; dominado volta em amostra de 5% a cada 60 dias; teto de 10 por dia; freio de item novo; fila nunca vira culpa; mistura de matérias; aquecimento (2 a 3 itens) em fase nova; "Revisão do dia" como bloco; migração de `S.errados`.
6. **Medição local.** `universo-bobby-eventos-v1`, 4.000 eventos ou 120 dias, só número/booleano/código curto, `pid` separado do apelido e do id, trocado na exportação. D1/D7/D30 (estrito e janela), retorno no dia seguinte, meta por dia ativo, resumo da semana copiável, tudo na área do responsável (atrás da senha).
7. **Meu personagem.** Barra fixa embaixo (Mapa, Meu personagem, Desenhos, Perfil); 1 toque abre o guarda-roupa. "Trocar de jogador" saiu do topo e fica no menu do Perfil.

## Desvios da especificação (conscientes)

- **Medidor dentro do app.** O pedido manda o painel D1/D7/D30 na área do responsável; a especificação (7.4) dizia só em página separada (`medir.html`). Está na área do responsável, em seção própria "Medidor do produto". **Decisão pendente do Filipe:** o painel D1/D7/D30 dentro do app é desvio da especificação 7.4 (lá, só em `medir.html`, fora do app). Fica até ele decidir; para tirar, basta remover `medidorHTML()` da tela do responsável.
- `vozPt`, `vozEn` e `velocidade` ficam no topo do perfil (a tela de escolha de voz de reserva ainda existe); a especificação os movia para `legado`. Saem quando o áudio gravado entrar.
- `errados` continua vivo ao lado de `revisao` (a "Revisão do mundo" ainda usa), e uma cópia vai para `legado.errados`.
- `pid` de medição é um campo à parte do `id` do perfil (o `id` vai no backup, o `pid` nunca).
- Nível do explorador agora vem do XP (`60 x (n-1)^2`, teto 30).
- Corrigi de passagem: o diálogo da senha apagava o formulário de novo jogador (agora usa `#folha`, que ganhou o estilo que faltava); `entregar()` salvava `.json` com tipo `image/svg+xml`; texto do responsável sem "ela".

## Ficou de fora

- **Missões indisponíveis** (marcadas `ok:()=>false` no catálogo): M05 fatos, M06 história/leitura, M07 ditado, M12 "por quê?". Dependem de tipos de pergunta e blocos que não existem ainda.
- **B09/B10/B13**: etiquetas `hab`/`dif`/`chave` nos 900 geradores, adaptação por habilidade e diagnóstico de entrada. Por isso o "item-chave da fase" é aproximado: erros primeiro, depois os acertos mais lentos.
- **B22** PBKDF2 no PIN, **B21** lembrete `.ics`, **B24** `medir.html`, **B05/B06/B07** (motor de áudio gravado, clipes, service worker de voz: só a camada `audio.js` está pronta).
- Acabamento visual: o CSS antigo continua com hex e escala própria; só o CSS novo segue o DESIGN.md (`testes/tokens.js` vigia isso). Textos do Bobby precisam de revisão de pedagogo.
- Texto do relatório dos pais v2 (4.3 a 4.6) completo; lista de "como ajudar em casa".

## Riscos

- **Nada foi testado em iPhone ou Android reais.** O ranking de voz foi testado com listas simuladas; o comportamento de `cancel()` seguido de `speak()` só em lógica.
- **Fuso:** quem migra pode ter 1 dia de diferença no instante da migração (UTC para local); o congelador de cortesia cobre. Perfil v3 parado há muito tempo abre com a ofensiva "descansando" (volta pela metade), sem culpa, e o recorde fica.
- **`localStorage`:** v4 mais eventos (até cerca de 240 KB) mais o backup `.bak-v3` duplicam o peso de um perfil grande; se a cota estourar, a migração segue sem a cópia e avisa.
- **Tela "Terminar por hoje"** não fecha o PWA (a web não deixa); mostra "Até amanhã" e o mapa continua a um toque. O limite rígido só existe com `limiteBlocosDia` do responsável (a senha é só uma tranca simples).
- **Baú por meta cheia** e o botão "continuar por 50 moedas" seguem pendentes de advogado (ECA Digital), como diz a especificação 5.2 e 5.7.
- `color-scheme: light dark` entrou junto com os tokens do DESIGN.md e muda a cor de controles nativos no escuro.
- A tela de aviso de migração aparece uma vez; se o responsável fechar a aba antes de tocar, ela volta na próxima abertura.

- Service worker: a ativação agora só apaga caches `bobby-*` antigos e nunca `bobby-audio-*` (reservado ao áudio gravado). `CACHE` continua `bobby-v3`.

## Áudio gravado integrado (24/10/2026, segunda rodada)

- **Voz toda gravada, sem voz do aparelho.** `speechSynthesis` não existe mais em `src/` (teste confere no código e falha se alguém chamar). Texto sem clipe fica sem voz, vira evento `audio_falha` (só código curto, nunca o texto) e aparece como AVISO em `node testes/cobertura-audio.js`.
- **Resolução texto para clipe** (`audio-clipes.js`): nome do clipe = pasta da classe + slug + FNV-1a em UTF-8 de classe + texto, igual ao gerador. Enunciado com número, nome, palavra ou sílaba sorteados vira fila de quadros e encaixes (porte do `quadrosDe` do `extrair-audio.js`); números por extenso com os 49 clipes de número. O gerador junta "Excuse me" e "excuse me" num clipe só, então o app tenta também em minúscula.
- **Player** (`audio.js`): Web Audio, fila contígua, pré-carga do próximo texto, cancelamento por token (fechar fase, nova fala, som desligado), velocidade de 80% a 120%. Formato `.m4a` (AAC); `.opus` só se o aparelho não toca AAC e confirma Opus em `canPlayType`. Sem manifesto (primeira visita sem internet) as perguntas de ouvir viram perguntas de ler, e a próxima chamada tenta de novo.
- **Offline**: cache `bobby-audio-v1`. Pacote `core` na primeira visita; pacote da matéria quando a criança entra na galáxia (aviso com o tamanho; não baixa sozinho com "economia de dados" ligada); botão "Guardar todas as vozes" em Voz e som. O `sw.js` (agora `bobby-v4`) serve clipe em cache-first, manifesto em network-first e continua com o HTML network-first; a ativação nunca apaga `bobby-audio-*`.
- **Tela Voz e som**: só liga/desliga de sons e narração, velocidade e pacotes. `vozPt`/`vozEn` foram para `legado`; velocidade antiga é recortada para 0,8 a 1,2.
- **Cobertura**: ver o relatório de `node testes/cobertura-audio.js`. Ficam sem clipe de propósito: dicas e "Ajuda extra", avisos de troca de dezena, bilhetes do Bobby, tela "Por hoje chega" e textos novos da Fase 2 (16 falas no teste, informativo). Entram no próximo lote do agente de áudio.
- **Pendente**: ouvir as vozes (o Filipe ainda não ouviu), testar `.m4a` e Web Audio em iPhone real, testar `.opus` antes de trocar de formato, parecer de advogado sobre a licença do Kokoro.

## Decisões de 24/10/2026 (feedback do Filipe, nota 5)

**Pergunta irmã no lugar da repetição.** Erro não repete a mesma pergunta (isso mede memória da resposta). Volta uma pergunta do mesmo gerador (`q.__mk`) com outros números ou palavras, 3 posições depois (duas perguntas no meio), marcada `reforco`, `__rep` e `__irma`, nunca igual a uma que a criança já viu na rodada. Gerador de uma pergunta só (Português): usa outro gerador da mesma fase, depois os das fases já vistas, e só sem nada disso repete a original. O item original errado continua indo para o caderno de erros (revisão espaçada, caixas 1, 3, 7, 14, 30). Cada erro gera no máximo uma reaparição. Item do caderno e aquecimento não ganham irmã. `testes/irmas.js` cobre as 150 fases.

**Economia e companheiros pagos com moedas do jogo.** Moedas só se ganham jogando; nunca dinheiro real nem compra em loja (ECA Digital). O Bobby é grátis. Os 6 companheiros ficam bloqueados com preço visível, pedem confirmação ("Quer levar a Rufa por 900 moedas?", botão "Agora não", sem culpa nem urgência). Tabela única em `src/interface/economia.js` (`PRECOS`, `ECON`). Ganho medido por `testes/economia.js` (criança média, 80% de acerto, 20 perguntas por dia): cerca de 186 moedas por dia.

| Companheiro | Preço | Prazo do zero (criança média) |
|---|---|---|
| Teo | 500 | 3 dias |
| Rufa | 900 | 5 dias |
| Otto | 1000 | 6 dias |
| Capi | 1500 | 9 dias |
| Brisa | 2000 | 11 dias |
| Fagulha | 2500 | 14 dias |

Looks (menores): chapéu de explorador 150, boné 200, óculos 250, lenço 300, capacete 450, capa 600, coroa 900. O primeiro presente do baú continua grátis. Quem já tinha companheiro escolhido (inclusive o personagem antigo `nina`, `pim`, `zeca`, `lulu`, que migra para Rufa, Otto, Capi e Brisa) mantém e ele entra na lista de comprados. Interpretação a confirmar com o Filipe: os prazos de 3, 5 e 10 a 14 dias contam juntando do zero para cada um, não acumulados. Reversível: é só mudar `PRECOS`.

**D1 (decidida pelo coordenador no lugar do Filipe, reversível): o botão "continuar por 50 moedas" foi removido** (estava pendente de advogado e contra "sem culpa"). Os corações continuam como ritmo; acabar os corações encerra a rodada com gentileza ("Vamos descansar e revisar"), os erros já estão no caderno e o progresso de etapa não se perde. Para voltar atrás é só restaurar o botão (está no histórico do git, commit desta linha).

**O personagem escolhido aparece em todo o jogo** (mapa, aula, pergunta, reações, baú, bilhete, fim de fase, topo e barra). Companheiro toma o lugar do Bobby; Bobby usa o look de frente onde a pose é de frente, e boné, coroa e óculos são sobrepostos (recortados do próprio look por `build/ativos.py`, ancorados uma vez em `OVERLAYS`) nas outras poses de frente. Capa, capacete e lenço só aparecem na pose de frente. Caminhada do Bobby no mapa é a base (pose de três quartos): o item não aparece andando. Pendente de arte: poses Comemora, Caminha e Pensa de cada look.

**Decisão pendente do Filipe (24/10/2026): a 1ª fase de TODAS as etapas abre desde o início** (`utilidades.js`, função `liberada`). Resultado: o nó 1 das etapas à frente parece "o próximo". Por ora ele ganhou o visual "disponível, mas não é o próximo" (contorno da matéria, sem o azul vivo). Decidir: manter etapas abertas desde o começo (a criança escolhe) ou trancar a etapa N até a revisão da N-1. Reversível: uma linha em `liberada`.

## Som sintetizado e três interruptores (24/10/2026, Onda 1 item 3)

- `src/interface/sfx.js`: efeitos, motivos dos personagens e música de cada planeta feitos em Web Audio, 0 KB de arquivo (cerca de 12 KB de código). 29 efeitos medidos por `testes/fumaca.js` em `OfflineAudioContext`: pico até -6 dBFS, duração dentro da tabela do plano; o erro é 14 dB mais baixo que o acerto e quase sem energia abaixo de 250 Hz (DFT); o acerto sobe a escala pentatônica a cada seguida. Compressor mestre; a voz manda (efeitos e música caem 10 dB enquanto a fala toca).
- **Três interruptores independentes** em Voz e som: Efeitos (`S.som`), Música (`S.musica`, ligada por padrão em volume baixo, decisão D6) e Voz (`S.voz`). A voz continua com os efeitos desligados (mudança em relação à versão anterior, em que som desligado calava a voz). Vibração leve (`S.vibra`, decisão D7) só onde existe (Android), com interruptor, sem movimento reduzido e só depois de um toque. O alto-falante do topo abre essa tela. Reversíveis: padrões em `estadoVazio`.
- Música: laço gerado no navegador (Numeral: sino; Fábula: caixa de música; Horizonte: pluck), começa no primeiro toque (política de autoplay), pausa com a aba escondida. As faixas CC0 do plano (Kenney, JRPG Pack 4 Calm) ficam como opção futura, se couberem na carga tardia.
- Ainda não verificado: som em iPhone e Android reais, volume com fone, e se o laço agrada à filha. Passos do Bobby tocam ao andar no mapa (madeira em Matemática, grama em Português, areia em Inglês).

## Cerimônias e narrativa (24/10/2026, Onda 1 item 4, decisão D3 do coordenador, reversível)

- **Fim de fase** em uma linha ("8 de 8 perguntas, 90 moedas") sem os três cartões; as estrelas ganhas acendem uma a uma com o "ding" de cada uma.
- **Fim de etapa** (`src/interface/cerimonias.js`): a cena acende por máscara, Bobby e o guia entram, troféu e estrelas, "Etapa N completa!" com a frase da história (a da etapa seguinte, de `src/conteudo/narrativa.js`), o desenho entregue e dois botões de peso igual ("Ver o desenho" e "Continuar"). **Planeta**: a estrela do planeta volta ao céu, o Embaralho aparece, e a constelação acende (com o nome da criança quando as três estrelas voltaram). Recompensa fixa, sem sorteio; um toque depois de 1 s pula; com movimento reduzido tudo já aparece; cada cerimônia passa uma vez (`S.cer`).
- Narrativa aprovada: o cometinha Embaralho derrubou as três estrelas do céu; uma frase por etapa; nunca é mau. Os textos novos (30 frases e as do planeta) entraram em `audio/regerar-pendentes.json` para o agente de áudio (104 textos no total, sem clipe até o próximo lote).
- Ainda não existem as imagens do Embaralho (o plano prevê 10 no Flow) nem a constelação em arte 3D: hoje é um SVG simples.
