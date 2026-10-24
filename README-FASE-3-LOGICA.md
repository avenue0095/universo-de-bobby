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

- **Medidor dentro do app.** O pedido manda o painel D1/D7/D30 na área do responsável; a especificação (7.4) dizia só em página separada (`medir.html`). Está na área do responsável, em seção própria "Medidor do produto". Revisar se o Filipe preferir tirar de lá.
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
