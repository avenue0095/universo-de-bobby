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
