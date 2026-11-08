# O Universo de Bobby: onde parou e o que vem depois (24/10/2026)

Sessão encerrada a pedido do Filipe por custo. Tudo abaixo está na branch `reforma-fase-2` do repo `~/Projetos/universo-de-bobby`. Nada foi publicado no ar e nada foi enviado ao GitHub. O app instalado no celular da filha continua o antigo.

## Estado do que está pronto (commitado)
- Fase 1 pesquisa (nota 8), Fase 2 especificação (nota 8), reorganização em `src/` + build + testes (nota 9).
- Lógica: estado v4, ofensiva, baú, missões, Leitner, pergunta irmã, ajuda por gerador, economia com companheiros pagos em moedas, 28 defeitos antigos corrigidos (nota 8).
- Áudio: 4.432 clipes Kokoro (grátis, provisório), cobertura 100% nas fases; pacote padrão 38 MB; ajudas sob demanda (nota 8). Lotes 4 e 5 commitados.
- Arte: 164 imagens aprovadas do Google Flow (0 créditos), integradas; 30 desenhos, cenários das 10 etapas, baú 3D, ícones, 7 looks.
- Visual: mapa com planeta, personagem escolhido em todas as telas, Meu personagem, galeria e colorir, cerimônias, falas por personagem, 29 efeitos sonoros, música CC0 desligada por padrão com botão de um toque (5ª revisão nota 7; depois disso entraram as correções do teste do Filipe e a 1B1, ainda sem nota).
- Segurança: backup validado, CSP, PIN forte, apagar tudo, `dist/site` só com o público (auditoria em `docs/AUDITORIA-SEGURANCA-LGPD.md`).
- Mesa de 5 especialistas e síntese (`docs/mesa/`, nota 8). BNCC mapeada e conferida (`docs/bncc-mapa.json`, campo `citavel`).
- Fase 4 desenhada (`docs/fase4/`, `supabase/`, nota 7 com teto: SQL não executado).

## Em andamento quando parou
- Sessão 1C (mundo reage): commit parcial `8281ca8`, build e npm test passando; a fumaça completa não terminou (bloco 2d8 do mundo sem prova de ponta a ponta). Ficou de fora: máscaras por peça das etapas 2 a 10, desenho pendurado no objeto, pontos de toque por cenário, clima e hora do dia, captura 320x568. Teste novo trava qualquer script que abra Chrome sem --mute-audio.
- Revisão independente da música e da 1B1: interrompida sem nota. O que passou: música desligada por padrão, botão de um toque liga só a música, faixa baixa sob demanda, ganho -18 dB e -28 dB na voz, licenças CC0 e hashes batem, 1.1 com 6 de 8 tocáveis, latência < 100 ms, painel de feedback 10 a 18% da altura. O que FALHOU e entra na 1B2: (1) trinca de verbos iguais em 97 das 150 fases (inglês 50 de 50 em 'ouvir e tocar'); (2) tocar objeto e depois tocar a cesta trava com 1 item dentro (troca oscila), arrasto funciona; (3) alternativas atrás do rodapé com ~20 objetos sem rolar (390 e 360) e última fileira cortada 18 px no 360; (4) perfis antigos ficam com musica=true (estadoDe usa ===true): migrar para false; (5) efeito 'solta' é ruído a 16 kHz, trocar; (6) objetos de contar parecem gotas, não sementes (arte das folhas de objetos).
- **FECHADO em 08/11/2026 (sessão 1B2, ainda sem revisão independente):** os 6 defeitos acima. (1) toda fase tem 3 ou mais verbos oficiais e zero trinca (150 fases x 20 rodadas, `testes/variedade.js`), com LIGAR e TRAÇAR novos e "arrastar a resposta" onde o ligar não é seguro; (2) cesta com 1 item: corrigido, teste de toque real em `testes/toque.js`; (3) 20 objetos cabem sem rolar em 390x844 e 360x640, em 320x568 a página rola sem nada cortado; (4) música de perfil antigo desligada uma vez (`musicaRevista`, teste 22 de `testes/estado.js`); (5) 'solta' virou tom que desce, sem chiado; (6) semente redesenhada em SVG (feijão com broto), sem arte nova. Detalhe em `README-FASE-3-LOGICA.md`, seção "Sessão 1B2".
- `npm run fumaca` em 08/11: 13 falhas, TODAS do mapa da 1C (primeira dobra, nó atrás da barra, imagem do mapa, fase abre antes de o personagem chegar, pontaria em nó coberto) e idênticas no commit anterior à 1B2 (rodado nos dois); o resto da fumaça passa. Entram no fechamento da 1C.
- **FEITO em 08/11/2026: estrutura para venda** (`src/interface/planos.js`: PLANOS R$ 47 e R$ 297, MAX_PERFIS 4, MURO 'aberto' hoje e 'pago' previsto, `acessoLiberado`, tela Assinatura com Entrar e Assinar desabilitados, seção Plano no responsável; `testes/planos.js`). Login e cobrança de verdade continuam na Fase 4. Detalhe em `README-FASE-3-LOGICA.md`, seção "Estrutura para venda".
- Lote 6 de áudio (193 fragmentos curtos de resposta da dica: "a resposta é", "antes do", "vem o"): NÃO concluído. Até gerar, a resposta falada da dica fica muda na maioria dos casos (o texto aparece). Lista em `audio/regerar-pendentes.json`; ferramentas em `audio/ferramentas/`.

## Próximas etapas, em ordem
1. Fechar a 1C e rodar revisão independente (nota mínima 8). Regra nova: todo Chrome de teste com `--mute-audio`.
2. Lote 6 de áudio (fragmentos de resposta) e os textos das perguntas com verbo (`audio/regerar-pendentes.json`, agora com os da 1B2: "Ligue cada pergunta à resposta certa." e as ajudas dos verbos).
3. Onda 1 da síntese: ~~1B2 (ligar e traçar)~~ (feito em 08/11, falta revisão independente com nota), 1D (computador como tela de jogo), 1A (dias de exploração no lugar da ofensiva na tela da criança; corações ficam), 1E (economia: portão duplo, cofrinho, loja da semana, ralos; teste de 180 dias), 1F (editor em camadas com os 52 itens, álbum, base do Bobby, companheiro em 3 estágios; REQUISITO DO FILIPE em 08/11: vários acessórios AO MESMO TEMPO (cabeça + rosto + pescoço + costas + mão), e cada acessório aparece em TODAS as poses do personagem (Oi, Comemora, Caminha, Pensa, expressões), por composição em camadas com âncoras por pose, nunca um render por combinação; os 7 looks inteiros atuais viram itens de camada; teste percorre todas as combinações válidas em todas as poses), 1G (adaptação por habilidade, diagnóstico de 10 perguntas, relatório dos pais citando BNCC só com `citavel:true`).
4. Arte: itens do guarda-roupa por camadas (`arte/PEDIDOS-DE-ARTE.md`), 3 folhas de objetos das cenas, looks em 4 poses.
5. Conteúdo novo: 3º ano (medidas e tempo em matemática, 20 textos curtos em português), lacunas em `docs/bncc-mapa.md`. DECISÃO MINHA (Filipe deixou a meu critério em 08/11): a linha dos apps de referência entra nas AULAS BÁSICAS (etapas 1 a 3 de cada planeta: trilha fonológica, contar com objetos, som inicial, rima, sílaba, antes e depois) e o modo 'treinar por tema' vale para todas; a forma do Bobby (mapa, personagem, história, verbos na cena) fica. APROVADO em 08/11/2026: entram os 7 itens de `docs/referencias/ENGENHARIA-REVERSA-alfabetizando-e-matematicando.md` (dinheiro, relógio, formas, padrões e historinhas como makers com arte do Flow; trilha fonológica 7-8 anos; distratores por letras confundíveis e gerador de erros de ortografia; 20 dicas ao responsável no relatório; modo 'treinar por tema'; acerto de primeira por pergunta; programa de 20 dias), nessa ordem.
6. Fase 4: S0 a S8 em `docs/fase4/PLANO.md` (começa quando o Filipe criar Supabase, Asaas, CNPJ, advogado, contador, domínio, e-mail).
7. Testes com crianças: filha, uma de 7 e uma de 11 a 12 anos (roteiro na mesa 03).

## Precisa da mão do Filipe
- Ouvir as 3 faixas CC0 (`assets/musica/`) e as vozes Kokoro; decidir se ficam.
- Excluir pelo `/artifacts` os dois documentos de revisão já consolidados.
- ~~Confirmar "sem teste grátis" = tudo pago desde o 1º dia.~~ Confirmado no pedido de 08/11 e implementado como modo 'pago' do muro (desligado até a Fase 4).
- Revisão independente da 1B2 e da estrutura para venda (nota mínima 8).
- Lista completa da Fase 4 em `docs/fase4/PLANO.md` seção 4.
- Publicar no ar: só com ordem dele, da pasta `dist/site`.

## Como retomar
```
cd ~/Projetos/universo-de-bobby && git checkout reforma-fase-2 && npm test && python3 build/build.py --check
```
Leia `README.md`, `README-FASE-3-LOGICA.md`, `README-FASE-3-VISUAL.md`, `docs/mesa/00-SINTESE.md` e este arquivo. Contexto no cofre: `04-Projetos/bobby-site/INDICE-bobby-site.md`.

Custo total das gerações: R$ 0 (imagens no Flow a 0 créditos, voz local, música CC0).
