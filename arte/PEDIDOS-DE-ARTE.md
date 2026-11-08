# Pedidos de arte (família 3D semirrealista, mesmo estilo dos REC-*)

Ícones que ainda aparecem como glifo de linha ao lado dos ícones 3D (moeda, medalha, estrela, troféu, pergaminho, baú). Pedir ao agente de arte, 192 px, fundo liso, mesma luz e material:

| Ícone | Onde aparece | Hoje |
|---|---|---|
| Chama da ofensiva (dias seguidos) | topo, Perfil, rotina | glifo de linha |
| Relógio (tempo total) | área do responsável | glifo de linha |
| Alvo (acerto geral) | área do responsável | glifo de linha |
| Quadro/desenho (desenhos) | Perfil (hoje usa o pergaminho) | pergaminho 3D como substituto |
| Bandeira de fase | Perfil (hoje usa a medalha) | medalha 3D como substituto |
| Check de missão cumprida | rotina, missões | glifo de linha pequeno |

Poses por look (hoje só a pose de frente tem o look inteiro; boné, coroa e óculos são sobrepostos nas outras poses de frente): Comemora, Caminha e Pensa de cada look, com capa, capacete e lenço inclusive.

## Objetos das perguntas (sessão 1B, mesa 03 mudança 12): 3 folhas piloto

Hoje os objetos tocáveis são SVG simples desenhados no código (`src/interface/verbos.js`, `OBJ_SVG`): semente, maçã, concha, caixa, lanche, fatia, peça de letra, vagão, placa, bilhete e cesta. Pedido: 3 folhas de 12 objetos, uma por planeta (etapa 1), fundo liso, sem texto, luz da referência ITEM-CHAPEU, 1:1, 2 estados (normal e marcado) e peso total abaixo de 60 KB em WebP: Numeral (sementes, maçãs, cestas, caixas, balança, régua), Fábula (letras de madeira, vagões, livros, penas), Horizonte (placas, arcos, bilhetes, conchas). Prompt no padrão `ESTILO_OBJ + FUNDO-OBJETO + NEG + "no face, no text"` (mesa 02 §11). Quando chegarem, entram em `assets/objetos/` e `OBJ_SVG` passa a usar `imgArte` por id.

## Máscaras por peça das cenas (sessão 1C, 08/11/2026): NÃO gerado, registrado para a próxima rodada de arte

Hoje as 30 cenas acendem por peça com recortes **retangulares** da arte que já existe (`HOTSPOTS` em `src/interface/mundo.js`, 6 por etapa, recortados a olho em 08/11/2026). Funciona e passa nos testes, mas o retângulo aparece como uma janela de luz em volta do objeto quando a peça acende. Pedido para quando houver rodada de arte (não gerar sem ordem do Filipe):

- Uma máscara em tons de cinza por peça (6 por cena, 180 no total), 765 x 1024, branco = a peça, preto = o resto, borda suave de 8 px, no mesmo enquadramento do `completo` e do `apagado`. Pode sair do próprio `completo` com recorte manual ou por segmentação; não precisa de imagem nova da cena.
- Peças que não aparecem sozinhas na arte de hoje (o recorte usa o objeto mais próximo do tema): Matemática 2 (onda levando conchas), Português 2 (vagão-mercado), Português 10 (balcão de recepção com bilhetes), Inglês 3 (berço), Inglês 10 (parede de espelhos). Se a cena for refeita, essas peças precisam estar visíveis e separadas, na ordem das fases.
- Quando chegarem: `peca-luz` troca o `clip-path` retangular por `mask-image` da máscara da peça; o resto (estado, toque, câmera, testes) fica igual.
