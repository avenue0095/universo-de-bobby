# DESIGN.md · O Universo de Bobby

Versão 1 · 24/10/2026 · Fase 3 (visual e jogabilidade) · rascunho para aprovação do Filipe.
Escopo: este arquivo manda no visual do app. Quem escreve interface lê aqui antes de tocar em cor, fonte, espaço, movimento ou componente. Nada fora deste arquivo vale.

Como adotar depois da aprovação: copiar para a raiz do projeto como `DESIGN.md` e acrescentar no `CLAUDE.md` do projeto a regra "Antes de gerar qualquer componente visual, leia @DESIGN.md por completo" (o `@` é obrigatório). Hoje o app lê as cores de `src/interface/style.css` e as fontes do Google Fonts; a migração está descrita na seção 14.

Decisões que vêm do cofre (`bobby-site/RESPOSTAS.md` e `GOSTO.md`), sem reabrir:
- Direção visual A, Cosmos futurista limpo, na versão mais realista.
- Crítica da filha de 8 anos: os personagens atuais "parecem uma imagem com colagens sem graça por cima". Ela quer algo mais realista, como jogos modernos de RPG.
- Mapa com cenário próprio por matéria (3 planetas), elenco novo, botão fixo "Meu personagem" na barra inferior, um desenho por etapa concluída (30 no total).
- Áudio todo gravado e dados só no aparelho (não mudam o visual, mudam o peso do pacote).

---

## 1. Marca

**Público.** Crianças de 7 a 12 anos jogando no celular, em sessões curtas (meta de 5 minutos), com o responsável por perto. O responsável compra, instala e lê o relatório.

**Produto.** App PWA de matemática, português e inglês, com trilha por matéria, personagem guia e coleção de desenhos para colorir.

**Sensação (3 adjetivos).** Luminoso. Calmo. Aventureiro.
- Luminoso: luz suave e vidro limpo, nunca neon. A cor vem da luz do planeta, não de contorno grosso.
- Calmo: o app nunca apressa a criança, nunca mostra relógio correndo, nunca deixa o mascote triste.
- Aventureiro: cada matéria é um lugar de verdade, com profundidade, onde a criança caminha com o personagem dela.

**Dois mundos visuais que convivem sem se misturar.**
1. **Interface** (botões, cartões, barra, texto): vetor limpo, plano com luz sutil, tokens deste arquivo. Legível a um braço de distância.
2. **Arte** (personagens, cenários, desenhos): imagem raster de aparência semirrealista, com corpo, luz e material de verdade (estilo render 3D estilizado de jogo moderno). A interface nunca imita essa arte, e a arte nunca é redesenhada em forma primitiva.

A queixa da filha aponta para a arte, não para a interface. Por isso o investimento pesado vai para personagem e cenário (documentos `BIBLIA-DE-PERSONAGENS.md` e `CENARIOS-E-DESENHOS.md`), e a interface fica sóbria para a arte brilhar.

**O que definitivamente NÃO combina.**
- Clipart, formas primitivas coladas, olhos e focinho em molde único (o problema de hoje).
- Estética de brinquedo de bebê (argila inchada, bolhas, bordas de 4 px). Os 7 a 12 anos já se acham grandes.
- Neon, brilho escuro, glow em texto, gradiente roxo genérico em fundo de tela.
- Qualquer tom de pressão: contagem regressiva, "você vai perder", mascote triste, vermelho de alarme, número piscando (ECA Digital, ver `pesquisa/03-etica-e-lgpd-infantil.md`).

---

## 2. Cores

### 2.1 Bloco de tokens (única fonte de hex do projeto)

Regra dura: **hex fora deste bloco é bug.** Componentes, SVG de interface e JavaScript só usam `var(--nome)`. As exceções documentadas são `manifest.webmanifest` e a meta `theme-color`, que não leem CSS: eles repetem `--cor-fundo` (claro e escuro) e um teste do build confere a igualdade.

Os mesmos mecanismos de tema de hoje continuam: automático pelo sistema (`prefers-color-scheme`) e escolha manual por `data-theme="light"` ou `data-theme="dark"` na raiz.

```css
/* ===== TOKENS: O Universo de Bobby (única fonte de hex) ===== */
:root {
  color-scheme: light dark;

  /* ---------- claro: "Dia" ---------- */
  --cor-fundo: #F3F5FD;
  --cor-superficie: #FFFFFF;
  --cor-superficie-2: #E9EDFA;
  --cor-texto: #16213A;
  --cor-texto-suave: #4A5877;
  --cor-linha: rgba(22,33,58,.14);
  --cor-linha-forte: #6C7AA0;
  --cor-foco: #1B5FC4;
  --cor-sombra: rgba(22,33,58,.30);
  --cor-vidro: rgba(255,255,255,.80);
  --cor-acerto: #0B7A4B;
  --cor-acerto-suave: #D8F3E5;
  --cor-ainda: #A33C08;
  --cor-ainda-suave: #FDE6D6;
  --cor-ouro: #F2B134;
  --cor-ouro-sobre: #16213A;
  --cor-ouro-borda: #8A5A00;
  --cor-acao: #FF8A2B;
  --cor-acao-sobre: #16213A;
  --cor-acao-borda: #B4510A;
  --cor-gelo: #CDEEFF;
  --cor-gelo-sobre: #16213A;
  --cor-gelo-borda: #1F6F99;
  --mat-base: #1B5FC4;
  --mat-sobre: #FFFFFF;
  --mat-tinta: #1B5FC4;
  --mat-suave: #DCE8FB;
  --mat-luz: #6FA8FF;
  --mat-ceu-topo: #BFD7FF;
  --mat-ceu-horizonte: #EAF2FF;
  --mat-chao: #7FB0F5;
  --por-base: #6340D0;
  --por-sobre: #FFFFFF;
  --por-tinta: #6340D0;
  --por-suave: #E6DFFA;
  --por-luz: #A68CFF;
  --por-ceu-topo: #D9CCFF;
  --por-ceu-horizonte: #F4EFFF;
  --por-chao: #B49CF2;
  --ing-base: #066B62;
  --ing-sobre: #FFFFFF;
  --ing-tinta: #066B62;
  --ing-suave: #D5F1EC;
  --ing-luz: #3FD1BF;
  --ing-ceu-topo: #BDEFE8;
  --ing-ceu-horizonte: #E8FAF7;
  --ing-chao: #6CCFC2;

  /* ---------- personagens: REFERÊNCIA DE ARTE, nunca usar como cor de texto ---------- */
  --pers-bobby-pelo: #9A6338;
  --pers-bobby-pelo-sombra: #6E4524;
  --pers-bobby-focinho: #EBCDA6;
  --pers-bobby-olho: #2A1810;
  --pers-teo-corpo: #E6EAF2;
  --pers-teo-visor: #FFB02E;
  --pers-teo-junta: #5B6B8C;
  --pers-rufa-pelo: #D9622B;
  --pers-rufa-creme: #F7E4CC;
  --pers-rufa-meia: #3B2A26;
  --pers-otto-pelo: #7A5436;
  --pers-otto-barriga: #D8B48A;
  --pers-otto-cachecol: #F26B5B;
  --pers-brisa-escama: #2FB8C9;
  --pers-brisa-asa: #B9A6FF;
  --pers-brisa-barriga: #F2E6B8;
  --pers-capi-pelo: #B58A5A;
  --pers-capi-focinho: #8A6540;
  --pers-capi-folha: #7FA37A;
  --pers-fagulha-corpo: #2A2F4A;
  --pers-fagulha-lanterna: #FFE9A8;
  --pers-fagulha-asa: #AEB8D6;

  /* ---------- tipografia ---------- */
  --fonte-titulo: "Fredoka", "Nunito", system-ui, sans-serif;
  --fonte-corpo: "Nunito", system-ui, -apple-system, "Segoe UI", sans-serif;
  --peso-titulo: 600;
  --peso-corpo: 600;
  --peso-forte: 800;

  --t-legenda: 14px;  --lh-legenda: 20px;
  --t-pequeno: 16px;  --lh-pequeno: 24px;
  --t-corpo: 18px;    --lh-corpo: 28px;
  --t-destaque: 20px; --lh-destaque: 28px;
  --t-h3: 24px;       --lh-h3: 32px;
  --t-h2: 28px;       --lh-h2: 36px;
  --t-h1: 36px;       --lh-h1: 44px;
  --t-display: 48px;  --lh-display: 56px;
  --t-numero: 64px;   --lh-numero: 72px;

  /* ---------- grade de 8 px (4 só como meio passo) ---------- */
  --esp-4: 4px;
  --esp-8: 8px;
  --esp-16: 16px;
  --esp-24: 24px;
  --esp-32: 32px;
  --esp-40: 40px;
  --esp-48: 48px;
  --esp-64: 64px;
  --esp-96: 96px;

  /* ---------- raios ---------- */
  --raio-8: 8px;
  --raio-16: 16px;
  --raio-24: 24px;
  --raio-32: 32px;
  --raio-pilula: 999px;

  /* ---------- sombras (derivadas de --cor-sombra e --cor-linha) ---------- */
  --sombra-1: 0 1px 0 var(--cor-linha), 0 4px 8px -4px var(--cor-sombra);
  --sombra-2: 0 1px 0 var(--cor-linha), 0 8px 16px -8px var(--cor-sombra);
  --sombra-3: 0 1px 0 var(--cor-linha), 0 16px 32px -16px var(--cor-sombra);
  --sombra-contato: radial-gradient(closest-side, var(--cor-sombra), transparent);

  /* ---------- movimento ---------- */
  --mov-rapido: 120ms;
  --mov-padrao: 240ms;
  --mov-lento: 480ms;
  --mov-celebra: 800ms;
  --curva-entra: cubic-bezier(0.2, 0.8, 0.2, 1);
  --curva-sai: cubic-bezier(0.4, 0, 1, 1);
  --curva-move: cubic-bezier(0.4, 0, 0.2, 1);

  /* ---------- toque e layout ---------- */
  --toque-min: 48px;
  --toque-conforto: 56px;
  --toque-folga: 8px;
  --barra-h: 72px;
  --topo-h: 56px;
  --larg-conteudo: 640px;
  --area-segura-baixo: env(safe-area-inset-bottom, 0px);

  /* ---------- camadas ---------- */
  --z-mapa: 0;
  --z-cartao: 10;
  --z-barra: 20;
  --z-folha: 30;
  --z-modal: 40;
  --z-celebra: 50;
}

/* ---------- escuro: "Espaço" (segue o sistema, a menos que o usuário tenha escolhido claro) ---------- */
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    --cor-fundo: #0B1020;
    --cor-superficie: #151C33;
    --cor-superficie-2: #1E2742;
    --cor-texto: #EEF2FF;
    --cor-texto-suave: #A9B5D6;
    --cor-linha: rgba(169,181,214,.20);
    --cor-linha-forte: #7F8DB5;
    --cor-foco: #8DBBFF;
    --cor-sombra: rgba(0,0,0,.55);
    --cor-vidro: rgba(21,28,51,.78);
    --cor-acerto: #4BDB9A;
    --cor-acerto-suave: #123B2A;
    --cor-ainda: #FFA463;
    --cor-ainda-suave: #43261A;
    --cor-ouro: #F2B134;
    --cor-ouro-sobre: #0B1020;
    --cor-ouro-borda: #F2B134;
    --cor-acao: #FF9A45;
    --cor-acao-sobre: #0B1020;
    --cor-acao-borda: #FF9A45;
    --cor-gelo: #1E4A66;
    --cor-gelo-sobre: #EEF2FF;
    --cor-gelo-borda: #7CC8F2;
    --mat-base: #6FA8FF;
    --mat-sobre: #0B1020;
    --mat-tinta: #8DBBFF;
    --mat-suave: #1B2B52;
    --mat-luz: #6FA8FF;
    --mat-ceu-topo: #0E1A3D;
    --mat-ceu-horizonte: #1B2F66;
    --mat-chao: #14264F;
    --por-base: #A68CFF;
    --por-sobre: #0B1020;
    --por-tinta: #B9A6FF;
    --por-suave: #2A2257;
    --por-luz: #A68CFF;
    --por-ceu-topo: #1A1442;
    --por-ceu-horizonte: #34286E;
    --por-chao: #231A55;
    --ing-base: #3FD1BF;
    --ing-sobre: #0B1020;
    --ing-tinta: #5FE0CF;
    --ing-suave: #123B3A;
    --ing-luz: #3FD1BF;
    --ing-ceu-topo: #072B2A;
    --ing-ceu-horizonte: #0F4B48;
    --ing-chao: #0B3A38;
  }
}
:root[data-theme="dark"] {
  --cor-fundo: #0B1020;
  --cor-superficie: #151C33;
  --cor-superficie-2: #1E2742;
  --cor-texto: #EEF2FF;
  --cor-texto-suave: #A9B5D6;
  --cor-linha: rgba(169,181,214,.20);
  --cor-linha-forte: #7F8DB5;
  --cor-foco: #8DBBFF;
  --cor-sombra: rgba(0,0,0,.55);
  --cor-vidro: rgba(21,28,51,.78);
  --cor-acerto: #4BDB9A;
  --cor-acerto-suave: #123B2A;
  --cor-ainda: #FFA463;
  --cor-ainda-suave: #43261A;
  --cor-ouro: #F2B134;
  --cor-ouro-sobre: #0B1020;
  --cor-ouro-borda: #F2B134;
  --cor-acao: #FF9A45;
  --cor-acao-sobre: #0B1020;
  --cor-acao-borda: #FF9A45;
  --cor-gelo: #1E4A66;
  --cor-gelo-sobre: #EEF2FF;
  --cor-gelo-borda: #7CC8F2;
  --mat-base: #6FA8FF;
  --mat-sobre: #0B1020;
  --mat-tinta: #8DBBFF;
  --mat-suave: #1B2B52;
  --mat-luz: #6FA8FF;
  --mat-ceu-topo: #0E1A3D;
  --mat-ceu-horizonte: #1B2F66;
  --mat-chao: #14264F;
  --por-base: #A68CFF;
  --por-sobre: #0B1020;
  --por-tinta: #B9A6FF;
  --por-suave: #2A2257;
  --por-luz: #A68CFF;
  --por-ceu-topo: #1A1442;
  --por-ceu-horizonte: #34286E;
  --por-chao: #231A55;
  --ing-base: #3FD1BF;
  --ing-sobre: #0B1020;
  --ing-tinta: #5FE0CF;
  --ing-suave: #123B3A;
  --ing-luz: #3FD1BF;
  --ing-ceu-topo: #072B2A;
  --ing-ceu-horizonte: #0F4B48;
  --ing-chao: #0B3A38;
}

/* ---------- aliases por matéria: o componente usa --materia-*, nunca --mat-*, --por-* ou --ing-* ---------- */
[data-materia="mat"] { --materia-base: var(--mat-base); --materia-sobre: var(--mat-sobre); --materia-tinta: var(--mat-tinta); --materia-suave: var(--mat-suave); --materia-luz: var(--mat-luz); --materia-ceu-topo: var(--mat-ceu-topo); --materia-ceu-horizonte: var(--mat-ceu-horizonte); --materia-chao: var(--mat-chao); }
[data-materia="por"] { --materia-base: var(--por-base); --materia-sobre: var(--por-sobre); --materia-tinta: var(--por-tinta); --materia-suave: var(--por-suave); --materia-luz: var(--por-luz); --materia-ceu-topo: var(--por-ceu-topo); --materia-ceu-horizonte: var(--por-ceu-horizonte); --materia-chao: var(--por-chao); }
[data-materia="ing"] { --materia-base: var(--ing-base); --materia-sobre: var(--ing-sobre); --materia-tinta: var(--ing-tinta); --materia-suave: var(--ing-suave); --materia-luz: var(--ing-luz); --materia-ceu-topo: var(--ing-ceu-topo); --materia-ceu-horizonte: var(--ing-ceu-horizonte); --materia-chao: var(--ing-chao); }

@media (prefers-reduced-motion: reduce) {
  :root { --mov-rapido: 0ms; --mov-padrao: 0ms; --mov-lento: 0ms; --mov-celebra: 0ms; }
}
```

Nota sobre o bloco acima: os valores do modo escuro aparecem duas vezes (media query e atributo) porque o app já funciona assim hoje (`style.css`). O build deve gerar as duas cópias a partir de uma lista só, para não divergirem. Os hex acima foram gerados e conferidos por script (seção 2.5).

### 2.2 Regra de uso de cada token

| Token | Uso e regra |
|---|---|
| `--cor-fundo` | fundo da tela. Atrás vai o céu do planeta (imagem), nunca texto direto sobre ele |
| `--cor-superficie` | cartões, painéis, barra inferior, folhas. Todo texto que fica sobre cenário fica sobre um cartão com esta cor |
| `--cor-superficie-2` | chips, campos, áreas fundas, trilhas de barra |
| `--cor-texto` | texto principal e números das perguntas |
| `--cor-texto-suave` | legenda, apoio, nota. Nunca para instrução da pergunta |
| `--cor-linha` | divisor e contorno decorativo (não conta como contraste de controle) |
| `--cor-linha-forte` | contorno de campo e botão secundário (3:1 contra o cartão) |
| `--cor-foco` | anel de foco de teclado e leitor de tela: 3 px, deslocamento de 2 px, sempre visível |
| `--cor-vidro` | fundo de vidro fosco (barra do topo e folhas). Só em até 2 elementos por tela. Em aparelho fraco, trocar por `--cor-superficie` sem `backdrop-filter` |
| `--cor-acerto` e `--cor-acerto-suave` | acerto. Sempre com ícone de check e texto, nunca só cor |
| `--cor-ainda` e `--cor-ainda-suave` | "ainda não" no lugar de erro. Laranja queimado de propósito: vermelho remete a alarme e punição. Sempre com ícone e texto |
| `--cor-ouro`, `--cor-ouro-sobre`, `--cor-ouro-borda` | moeda, medalha, selo de revisão, interior do baú. O contorno usa `--cor-ouro-borda` (o ouro puro não tem contraste sobre fundo claro) |
| `--cor-acao`, `--cor-acao-sobre`, `--cor-acao-borda` | única cor de chamada de ação fora das matérias: botão "Abrir baú", "Terminar por hoje", colete do Bobby. Texto escuro sobre laranja, nunca branco |
| `--cor-gelo`, `--cor-gelo-sobre`, `--cor-gelo-borda` | congelador de ofensiva. Frio e calmo, nunca vermelho |
| `--mat-*` | planeta Numeral (Matemática): azul cobalto |
| `--por-*` | planeta Fábula (Português): violeta |
| `--ing-*` | planeta Horizonte (Inglês): turquesa de mar |
| `--*-base` | botão principal da matéria, nó do mapa, barra de progresso, aba ativa |
| `--*-sobre` | texto e ícone sobre `--*-base` |
| `--*-tinta` | título, ícone e link da matéria sobre cartão ou chip |
| `--*-suave` | fundo de chip, cabeçalho de cartão de etapa, destaque da barra inferior |
| `--*-luz` | brilho decorativo (halo do nó atual, trilha de luz). Nunca texto, nunca contorno de controle |
| `--*-ceu-topo`, `--*-ceu-horizonte`, `--*-chao` | gradiente do céu e do chão atrás do mapa. Decorativos: texto nunca fica direto sobre eles |
| `--pers-*` | referência para quem gera e confere arte. Não entra em componente de interface |

### 2.3 As três matérias de relance

| Matéria | Planeta | Cor da matéria | Clima do cenário | Guia |
|---|---|---|---|---|
| Matemática | Numeral | azul cobalto, com cristais e metal polido | oficina, vilarejo de engenhocas e biomas variados | Teo, o robô |
| Português | Fábula | violeta, com papel quente e luz de lanterna | biblioteca flutuante, teatro e correio | Rufa, a raposa |
| Inglês | Horizonte | turquesa de mar, com coral | arquipélago de portos, pontes e barcos | Otto, a lontra |

A paleta dos companheiros coringas (Brisa, Capi e Fagulha) é própria e aparece nas matérias como visita, não como cor de tela.

### 2.4 Modos claro e escuro

- **Claro, "Dia":** fundo lavanda quase branco, cartões brancos, céu do planeta em pastel.
- **Escuro, "Espaço":** fundo azul-noite profundo, cartões azul-ardósia, céu do planeta em tons profundos, cores de matéria mais claras (para manter o contraste).
- **Arte é uma só.** Personagens e cenários são gerados com luz de entardecer suave e fundo recortado, e valem nos dois modos. Cada imagem precisa passar no teste de franja (recorte conferido sobre fundo claro e escuro, ver `LOTE-PILOTO.md`). Isso evita dobrar o número de imagens (60 cenários viram 120).
- Padrão: segue o sistema. O responsável pode forçar claro ou escuro no perfil.

### 2.5 Contraste mínimo AA (medido)

Metas: texto normal 4,5:1; texto grande (24 px, ou 18,66 px em negrito) 3:1; contorno de controle, ícone que carrega informação e anel de foco 3:1. Todas as combinações abaixo foram calculadas por script (fórmula de luminância relativa do WCAG 2.1) nos tokens do bloco da seção 2.1. **Resultado: 39 de 39 combinações passam no claro e 39 de 39 no escuro** (menor razão de texto: 4,58; menor razão de contorno: 4,26). Mudou token, refaz a tabela com o script do build (seção 14).

**Modo claro**

| Primeiro plano | Fundo | Razão | Mínimo | Uso | Passa |
|---|---|---|---|---|---|
| `cor-texto` | `cor-fundo` | 14.69 | 4.5 | texto de corpo no fundo | sim |
| `cor-texto` | `cor-superficie` | 16.00 | 4.5 | texto em cartões | sim |
| `cor-texto` | `cor-superficie-2` | 13.68 | 4.5 | texto em chips e áreas fundas | sim |
| `cor-texto-suave` | `cor-fundo` | 6.53 | 4.5 | legendas no fundo | sim |
| `cor-texto-suave` | `cor-superficie` | 7.11 | 4.5 | legendas em cartões | sim |
| `cor-texto-suave` | `cor-superficie-2` | 6.08 | 4.5 | legendas em chips | sim |
| `cor-linha-forte` | `cor-superficie` | 4.26 | 3 | borda de controle | sim |
| `cor-foco` | `cor-fundo` | 5.54 | 3 | anel de foco no fundo | sim |
| `cor-foco` | `cor-superficie` | 6.03 | 3 | anel de foco em cartões | sim |
| `mat-sobre` | `mat-base` | 6.03 | 4.5 | texto no botão Matemática | sim |
| `mat-tinta` | `cor-superficie` | 6.03 | 4.5 | título e ícone Matemática no cartão | sim |
| `mat-tinta` | `mat-suave` | 4.88 | 4.5 | texto no chip Matemática | sim |
| `cor-texto` | `mat-suave` | 12.93 | 4.5 | texto neutro no chip Matemática | sim |
| `mat-base` | `cor-fundo` | 5.54 | 3 | nó e trilha Matemática contra o fundo | sim |
| `mat-base` | `cor-superficie` | 6.03 | 3 | nó e trilha Matemática contra o cartão | sim |
| `por-sobre` | `por-base` | 6.61 | 4.5 | texto no botão Português | sim |
| `por-tinta` | `cor-superficie` | 6.61 | 4.5 | título e ícone Português no cartão | sim |
| `por-tinta` | `por-suave` | 5.13 | 4.5 | texto no chip Português | sim |
| `cor-texto` | `por-suave` | 12.42 | 4.5 | texto neutro no chip Português | sim |
| `por-base` | `cor-fundo` | 6.08 | 3 | nó e trilha Português contra o fundo | sim |
| `por-base` | `cor-superficie` | 6.61 | 3 | nó e trilha Português contra o cartão | sim |
| `ing-sobre` | `ing-base` | 6.39 | 4.5 | texto no botão Inglês | sim |
| `ing-tinta` | `cor-superficie` | 6.39 | 4.5 | título e ícone Inglês no cartão | sim |
| `ing-tinta` | `ing-suave` | 5.36 | 4.5 | texto no chip Inglês | sim |
| `cor-texto` | `ing-suave` | 13.42 | 4.5 | texto neutro no chip Inglês | sim |
| `ing-base` | `cor-fundo` | 5.87 | 3 | nó e trilha Inglês contra o fundo | sim |
| `ing-base` | `cor-superficie` | 6.39 | 3 | nó e trilha Inglês contra o cartão | sim |
| `cor-acerto` | `cor-superficie` | 5.39 | 4.5 | texto de acerto | sim |
| `cor-texto` | `cor-acerto-suave` | 13.61 | 4.5 | texto no painel de acerto | sim |
| `cor-acerto` | `cor-acerto-suave` | 4.58 | 4.5 | ícone e título no painel de acerto | sim |
| `cor-ainda` | `cor-superficie` | 6.55 | 4.5 | texto do "ainda não" | sim |
| `cor-texto` | `cor-ainda-suave` | 13.31 | 4.5 | texto no painel "ainda não" | sim |
| `cor-ainda` | `cor-ainda-suave` | 5.45 | 4.5 | ícone e título no painel "ainda não" | sim |
| `cor-ouro-sobre` | `cor-ouro` | 8.47 | 4.5 | número na moeda e no baú | sim |
| `cor-ouro-borda` | `cor-superficie` | 5.93 | 3 | contorno da moeda e do baú | sim |
| `cor-acao-sobre` | `cor-acao` | 6.80 | 4.5 | texto do botão de ação | sim |
| `cor-acao-borda` | `cor-superficie` | 5.09 | 3 | contorno do botão de ação | sim |
| `cor-gelo-sobre` | `cor-gelo` | 13.16 | 4.5 | texto no congelador | sim |
| `cor-gelo-borda` | `cor-superficie` | 5.54 | 3 | contorno do congelador | sim |

**Modo escuro**

| Primeiro plano | Fundo | Razão | Mínimo | Uso | Passa |
|---|---|---|---|---|---|
| `cor-texto` | `cor-fundo` | 16.93 | 4.5 | texto de corpo no fundo | sim |
| `cor-texto` | `cor-superficie` | 15.07 | 4.5 | texto em cartões | sim |
| `cor-texto` | `cor-superficie-2` | 13.19 | 4.5 | texto em chips e áreas fundas | sim |
| `cor-texto-suave` | `cor-fundo` | 9.26 | 4.5 | legendas no fundo | sim |
| `cor-texto-suave` | `cor-superficie` | 8.24 | 4.5 | legendas em cartões | sim |
| `cor-texto-suave` | `cor-superficie-2` | 7.21 | 4.5 | legendas em chips | sim |
| `cor-linha-forte` | `cor-superficie` | 5.12 | 3 | borda de controle | sim |
| `cor-foco` | `cor-fundo` | 9.63 | 3 | anel de foco no fundo | sim |
| `cor-foco` | `cor-superficie` | 8.58 | 3 | anel de foco em cartões | sim |
| `mat-sobre` | `mat-base` | 7.86 | 4.5 | texto no botão Matemática | sim |
| `mat-tinta` | `cor-superficie` | 8.58 | 4.5 | título e ícone Matemática no cartão | sim |
| `mat-tinta` | `mat-suave` | 7.06 | 4.5 | texto no chip Matemática | sim |
| `cor-texto` | `mat-suave` | 12.40 | 4.5 | texto neutro no chip Matemática | sim |
| `mat-base` | `cor-fundo` | 7.86 | 3 | nó e trilha Matemática contra o fundo | sim |
| `mat-base` | `cor-superficie` | 7.00 | 3 | nó e trilha Matemática contra o cartão | sim |
| `por-sobre` | `por-base` | 7.05 | 4.5 | texto no botão Português | sim |
| `por-tinta` | `cor-superficie` | 8.00 | 4.5 | título e ícone Português no cartão | sim |
| `por-tinta` | `por-suave` | 6.80 | 4.5 | texto no chip Português | sim |
| `cor-texto` | `por-suave` | 12.82 | 4.5 | texto neutro no chip Português | sim |
| `por-base` | `cor-fundo` | 7.05 | 3 | nó e trilha Português contra o fundo | sim |
| `por-base` | `cor-superficie` | 6.27 | 3 | nó e trilha Português contra o cartão | sim |
| `ing-sobre` | `ing-base` | 9.99 | 4.5 | texto no botão Inglês | sim |
| `ing-tinta` | `cor-superficie` | 10.48 | 4.5 | título e ícone Inglês no cartão | sim |
| `ing-tinta` | `ing-suave` | 7.62 | 4.5 | texto no chip Inglês | sim |
| `cor-texto` | `ing-suave` | 10.97 | 4.5 | texto neutro no chip Inglês | sim |
| `ing-base` | `cor-fundo` | 9.99 | 3 | nó e trilha Inglês contra o fundo | sim |
| `ing-base` | `cor-superficie` | 8.90 | 3 | nó e trilha Inglês contra o cartão | sim |
| `cor-acerto` | `cor-superficie` | 9.55 | 4.5 | texto de acerto | sim |
| `cor-texto` | `cor-acerto-suave` | 11.15 | 4.5 | texto no painel de acerto | sim |
| `cor-acerto` | `cor-acerto-suave` | 7.06 | 4.5 | ícone e título no painel de acerto | sim |
| `cor-ainda` | `cor-superficie` | 8.62 | 4.5 | texto do "ainda não" | sim |
| `cor-texto` | `cor-ainda-suave` | 12.27 | 4.5 | texto no painel "ainda não" | sim |
| `cor-ainda` | `cor-ainda-suave` | 7.02 | 4.5 | ícone e título no painel "ainda não" | sim |
| `cor-ouro-sobre` | `cor-ouro` | 10.02 | 4.5 | número na moeda e no baú | sim |
| `cor-ouro-borda` | `cor-superficie` | 8.92 | 3 | contorno da moeda e do baú | sim |
| `cor-acao-sobre` | `cor-acao` | 8.98 | 4.5 | texto do botão de ação | sim |
| `cor-acao-borda` | `cor-superficie` | 8.00 | 3 | contorno do botão de ação | sim |
| `cor-gelo-sobre` | `cor-gelo` | 8.43 | 4.5 | texto no congelador | sim |
| `cor-gelo-borda` | `cor-superficie` | 9.15 | 3 | contorno do congelador | sim |

Combinações que **não** passam e por isso são proibidas: `--cor-acao` e `--cor-ouro` como contorno sobre `--cor-superficie` no modo claro (usar `--cor-acao-borda` e `--cor-ouro-borda`); texto branco sobre `--cor-acao` ou `--cor-ouro`; `--*-luz` como texto; qualquer texto direto sobre `--*-ceu-*`.

**Cor nunca é o único sinal.** Certo e "ainda não" têm ícone e frase. Estrela do nó tem 1, 2 ou 3 formas. Nó bloqueado tem cadeado. Missão concluída tem check.

---

## 3. Tipografia

**Fontes (decisão: manter as atuais, trazendo para dentro do app).**

| Papel | Família | Pesos carregados | Por quê |
|---|---|---|---|
| Títulos, números grandes, botões | Fredoka | 600 | arredondada e amigável sem ser infantil demais, legível nos algarismos (números são o coração de matemática). Já é a fonte do app (continuidade para quem instalou) |
| Corpo, instruções, perguntas | Nunito | 600 e 800 | alta legibilidade em tela pequena, boa cobertura de acentos do português |

Resultado da busca de repertório (`ui-ux-pro-max`, domínio typography): o par "Playful Creative" Fredoka + Nunito aparece como combinação recomendada para apps infantis e educação. A busca de estilo sugeriu Claymorphism (e Baloo 2 com Comic Neue); foi **descartado**: o visual de argila é justamente a estética de brinquedo que a filha rejeitou, e Comic Neue pesa na leitura de enunciado.

**Funcionar offline e leve (hoje não funciona):** o app carrega as duas famílias do Google Fonts (`index.html:10`), sem cache no service worker (`pesquisa/00-mapa-do-app-hoje.md`, seção 2.8). Regras novas:
1. Hospedar `Fredoka-600.woff2`, `Nunito-600.woff2` e `Nunito-800.woff2` dentro do app, subconjunto latino (inclui acentos e cedilha do português e os símbolos de conta ×, ÷, −, ½), formato woff2.
2. Entrar no pré-cache do service worker. Sem requisição para o Google: ganha offline e tira um terceiro da conversa (relevante para app infantil e LGPD).
3. `font-display: swap`, e fonte local de reserva com `size-adjust` para não pular o layout.
4. Orçamento: as três fontes juntas em até 120 KB. **Não medido ainda**; medir no build antes de aceitar. Se estourar, cortar Nunito 800 e usar Fredoka 600 para ênfase.
5. Licença: ambas são OFL (uso comercial permitido). Conferir o texto da licença no arquivo baixado e guardá-lo em `licencas/` antes de empacotar. Não verificado nesta sessão.

**Escala fixa** (tokens da seção 2.1; nada de tamanho fluido nem `clamp`):

| Token | Tamanho / altura de linha | Fonte e peso | Uso |
|---|---|---|---|
| `--t-legenda` | 14 / 20 | Nunito 600 | rótulo da barra inferior, nota de apoio. Nunca instrução |
| `--t-pequeno` | 16 / 24 | Nunito 600 | texto de apoio, chips |
| `--t-corpo` | 18 / 28 | Nunito 600 | texto padrão, enunciado, opção de resposta |
| `--t-destaque` | 20 / 28 | Nunito 800 | frase de feedback, bilhete do Bobby |
| `--t-h3` | 24 / 32 | Fredoka 600 | título de cartão |
| `--t-h2` | 28 / 36 | Fredoka 600 | título de tela |
| `--t-h1` | 36 / 44 | Fredoka 600 | nome do planeta, "Por hoje chega!" |
| `--t-display` | 48 / 56 | Fredoka 600 | tela de conquista |
| `--t-numero` | 64 / 72 | Fredoka 600 | número da pergunta de matemática, contagens grandes |

- Alturas de linha são múltiplos de 4. Mínimo de 16 px em qualquer texto que a criança precisa ler para jogar.
- Comprimento máximo de linha: 60 caracteres no texto corrido, 40 no enunciado de pergunta. Alinhamento à esquerda; centralizar só número isolado, título de celebração e rótulo de nó.
- Numerais tabulares (`font-variant-numeric: tabular-nums`) em moedas, contagens e na pergunta de matemática.
- Texto de interface em português do Brasil, tratamento "você", sem travessão (regra da casa, seção 11).

---

## 4. Espaçamento, grade e layout

- **Grade de 8 px.** Escala: 4 8 16 24 32 40 48 64 96. O 4 só serve de meio passo (ícone ao lado de texto, folga entre linhas de rótulo). Nada fora da escala: 12 px, 13 px ou 27 px é bug.
- Margem lateral da tela: 16 px no celular, 24 px a partir de 768 px de largura. Coluna de conteúdo até `--larg-conteudo` (640 px) centralizada no computador, com o céu do planeta ocupando a largura toda.
- Espaço entre alvos de toque: no mínimo `--toque-folga` (8 px).
- Cartão: preenchimento interno 16 px (compacto) ou 24 px (padrão). Entre cartões: 16 px. Entre seções: 32 px ou 48 px.
- Pontos de quebra: 360 (base), 768 e 1024. Projetar primeiro em 360 por 740. Retrato no celular (o manifesto já trava `portrait`); computador mostra o mesmo layout em coluna.
- A barra inferior reserva `--barra-h` mais `--area-segura-baixo`; o conteúdo rolável termina 24 px acima dela.
- O topo (`--topo-h`, 56 px) mostra sempre **ofensiva, moedas e som**, inclusive em 360 px. Hoje o app esconde ofensiva e som abaixo de 430 px (bug B3 do relatório 00). Isso acaba.

---

## 5. Raios e sombras

| Token | Valor | Onde |
|---|---|---|
| `--raio-8` | 8 px | chip pequeno, selo, barra de progresso |
| `--raio-16` | 16 px | botão, campo, opção de resposta |
| `--raio-24` | 24 px | cartão, painel de feedback |
| `--raio-32` | 32 px | folha inferior (sheet), modal, cartão de etapa com arte |
| `--raio-pilula` | 999 px | chip, item ativo da barra, etiqueta de nó |

Nem tudo é arredondado igual: o raio acompanha o tamanho e o papel do objeto. Sombras são suaves e frias (`--sombra-1` repouso, `--sombra-2` elevado, `--sombra-3` folha e modal). Personagem e item de cenário usam `--sombra-contato` (elipse radial no pé), nunca `box-shadow` na imagem recortada. No escuro a sombra perde força e a separação vem de `--cor-linha`.

---

## 6. Movimento

**Princípio:** o movimento explica o que mudou (algo acendeu, algo chegou) e dá corpo ao personagem. Nunca entretém para prender.

| Token | Duração | Uso |
|---|---|---|
| `--mov-rapido` | 120 ms | pressionar botão, foco, troca de estado de opção |
| `--mov-padrao` | 240 ms | abrir folha, trocar aba, feedback de resposta |
| `--mov-lento` | 480 ms | revelar a peça do cenário que acendeu, Bobby andando um passo no mapa |
| `--mov-celebra` | 800 ms | abrir baú, fim de etapa, medalha nova |

**Curvas:** `--curva-entra` (desaceleração forte) para o que aparece; `--curva-sai` (aceleração) para o que some, sempre mais curto que a entrada (saída em 60% do tempo de entrada); `--curva-move` para deslocamento. **Sem overshoot e sem bounce.** A vida do personagem vem de pose e expressão trocadas, não de mola.

**O que anima:** pressão de botão (escala 0,97 em 120 ms), nó do mapa atual (halo respirando em 2 s, 2 ciclos e para), Bobby caminhando até o próximo nó, peça do cenário acendendo (máscara de revelação, 480 ms), baú abrindo, troca de pose do personagem após resposta.
**O que NÃO anima:** texto da pergunta, números, tabuada, contador de moedas (troca direta, sem rolar), qualquer coisa em loop infinito, qualquer coisa que pisque, parallax pesado em fase (só no mapa, até 2 camadas).

**`prefers-reduced-motion`:** respeitado. Os tokens de duração vão a 0 ms (bloco da seção 2.1), o halo vira anel estático, o Bobby troca de nó por corte, o baú mostra o quadro final. A informação nunca depende da animação.

**Orçamento:** animar só `transform` e `opacity`. Máximo de 2 animações simultâneas além da celebração. Meta de 60 quadros em celular de entrada (conferir em aparelho real; não testado).

---

## 7. Toque e acessibilidade

- **Área de toque mínima de 48 por 48 px** em todo elemento tocável (alvo visual pode ser menor, a área não). Alvos principais (nó, opção de resposta, botões de ação, itens da barra) têm `--toque-conforto` (56 px). Folga de 8 px entre vizinhos.
- Opção de resposta ocupa a largura toda (ou grade de 2 colunas com 8 px de vão), altura mínima de 56 px, texto em `--t-corpo`.
- Foco visível por teclado em tudo (`--cor-foco`, 3 px). Atalhos 1 a 4 e Enter das opções continuam.
- Leitura em voz alta: todo texto fixo tem áudio gravado (decisão do cofre). O ícone de som fica sempre visível no topo.
- `aria-live="polite"` no painel de feedback e no contador de missão; `role="progressbar"` com valor em barras; `aria-label` em todo ícone sozinho; rótulos em texto (a barra inferior mostra o nome, não só o ícone).
- Teclado numérico próprio ou `inputmode="numeric"` nas respostas de número. Respostas não dependem de gesto complexo (nada de arrastar como única forma; sempre há alternativa por toque).
- Cada tela funciona em retrato 360 por 740, com texto do sistema em 130% sem cortar.

---

## 8. Ícones

- Família: traço limpo de 2,5 px com pontas arredondadas, grade de 24 px (tamanhos 24, 32 e 48). Interface usa `currentColor` ou token; sem hex no SVG.
- Base sugerida: biblioteca aberta de ícones de traço (Lucide, licença ISC; **conferir a licença no momento de copiar**) para os genéricos, mais cinco ícones próprios de recompensa desenhados no mesmo traço: moeda, chama (ofensiva), floco (congelador), baú e estrela. Os próprios podem ter versão preenchida em duas cores usando `--cor-ouro`, `--cor-gelo` e `--cor-acao`.
- Nunca emoji como ícone (varia por aparelho e destoa da arte).
- Lista mínima: planetas, missões, meu personagem (usa o retrato do personagem, não um ícone), desenhos, moeda, ofensiva, congelador, baú, estrela, coração, som ligado e desligado, ouvir, dica, voltar, fechar, cadeado (nó bloqueado e área do responsável), check, perfil, ajustes.
- Ícone que carrega informação precisa de contraste 3:1 e de nome acessível.

---

## 9. Imagem e ilustração (as regras do realismo)

Estas regras traduzem a crítica da filha em critério que dá para conferir.

1. **Corpo, luz e material.** Todo personagem tem volume, luz principal e luz de recorte (rim light) no tom do planeta, material legível (pelo, metal, tecido) e sombra de contato. Imagem que parece forma achatada com detalhe colado reprova.
2. **Profundidade no cenário.** Todo cenário tem no mínimo 3 planos (fundo, meio, frente), com perspectiva atmosférica (o fundo mais claro e frio). Nada de cena em uma camada só.
3. **Sem colagem.** Personagem e cenário compartilham a mesma luz (direção, cor e dureza) e o mesmo grau de detalhe. Se a luz do cenário vem da esquerda, a do personagem também.
4. **Semirrealista, não hiper-realista.** Proporção de personagem estilizada (cabeça grande, olhos expressivos), material realista. Nada de pele ou pelo "de documentário", nada de rosto que lembre pessoa real.
5. **Recorte limpo.** Contorno de pelo curto e denso, sem fios soltos, sem transparência e sem brilho que escape do contorno, para o fundo sair sem franja (regras completas na `BIBLIA-DE-PERSONAGENS.md`).
6. **Silhueta legível a 96 px.** Cada personagem se reconhece só pelo contorno preto, em tamanho de ícone.
7. **Sem texto dentro da imagem.** Letras geradas por IA saem erradas. Todo texto entra pelo app.
8. **Formato e peso.** WebP com transparência (AVIF só se o teste em aparelho aprovar). Personagem: 512 px de altura para mapa e lista, 1024 px para tela cheia. Cenário: largura 1080 px. Orçamento total de imagem no pré-cache: até 10 MB; o resto sob demanda e guardado em cache depois. **Estimativa, não medida:** cada pose pesa cerca de 60 KB e cada cenário cerca de 250 KB. Medir no lote piloto.
9. **Mesma lente em tudo.** Câmera na altura dos olhos do personagem, lente de cerca de 50 mm equivalente, sem distorção de grande angular. Dá coerência entre elenco e cenário.

---

## 10. Componentes

Convenção: todo componente é uma peça de `src/interface/` que usa só tokens. Estados obrigatórios: padrão, hover (só quando há ponteiro), foco, pressionado, desabilitado, carregando, erro, vazio. Se um estado não se aplica, a tabela diz "não se aplica" e por quê. Todos recebem `data-materia` do ancestral para pegar `--materia-*`.

### 10.1 Barra inferior

- **Posição e medidas:** fixa embaixo, altura `--barra-h` (72 px) mais `--area-segura-baixo`, fundo `--cor-superficie` (com `--sombra-2` para cima), 4 itens de largura igual, cada item com área de toque de pelo menos 48 px de altura e a largura toda do quarto da tela.
- **Itens, nesta ordem:** Planetas · Missões · Meu personagem · Desenhos. Perfil e "Trocar de jogador" ficam no menu do avatar, no topo; responsável fica dentro do perfil, atrás da senha.
- **Anatomia do item:** ícone de 28 px, rótulo em `--t-legenda` peso 800 (sempre visível, máx. 16 caracteres), cápsula de destaque `--raio-pilula` atrás do ícone quando ativo.
- **Não aparece dentro de uma fase** (foco total na pergunta); volta no fim de fase.

| Estado | Visual |
|---|---|
| Padrão | ícone e rótulo em `--cor-texto-suave` |
| Ativo | cápsula `--materia-suave`, ícone e rótulo `--materia-tinta`, traço de 4 px em `--materia-base` no topo do item |
| Hover | fundo `--cor-superficie-2` (só com ponteiro) |
| Foco | anel `--cor-foco` ao redor do item inteiro |
| Pressionado | escala 0,97 por `--mov-rapido` |
| Desabilitado | não se aplica (nenhum item some ou apaga; ainda sem conteúdo, abre o estado vazio da tela) |
| Carregando | não se aplica (a barra nunca espera dado) |
| Erro | não se aplica |
| Vazio | não se aplica |
| Novidade | ponto de 12 px em `--cor-acao`, **sem número**, some ao abrir a tela. Nunca pisca |

### 10.2 Botão "Meu personagem"

O pedido aprovado: 1 toque, de qualquer tela, até o guarda-roupa (hoje são 4 toques mais rolagem; relatório 00, seção 1.3).

- **Posição:** terceiro item da barra inferior. Em vez de ícone, mostra o **retrato vivo** do personagem equipado: círculo de 40 px com a expressão "Alegre" do personagem do jogador (com as peças de roupa que ele está usando).
- **Aro:** 3 px, `--cor-acao-borda` quando há novidade, `--materia-base` quando ativo, `--cor-linha-forte` no padrão. Rótulo fixo: "Meu personagem" (14 caracteres).
- **Destino:** tela Guarda-roupa com prévia grande do personagem andando em um trecho do mapa da matéria atual, abas Personagem, Chapéus, Rosto, Pescoço, Cor. "Trocar de jogador" não mora aqui.
- **Toque:** área de 56 px de altura e a largura do item; o retrato fica a 4 px do topo do item.

| Estado | Visual |
|---|---|
| Padrão | retrato 40 px, aro `--cor-linha-forte` |
| Hover e foco | aro `--cor-foco` com deslocamento de 2 px |
| Pressionado | retrato escala 0,95, personagem troca para a pose "Oi" |
| Desabilitado | não se aplica |
| Carregando | a imagem do retrato ainda não chegou: círculo `--cor-superficie-2` com a inicial do apelido. O botão já funciona |
| Erro | se a imagem falhar, mantém o círculo com a inicial. Não mostra mensagem na barra |
| Vazio | não se aplica (sempre há o personagem inicial) |
| Novidade | ponto `--cor-acao`, sem número |

### 10.3 Botão primário e secundário

- Primário: fundo `--materia-base`, texto `--materia-sobre`, `--t-h3`, altura 56 px, `--raio-16`, largura toda no celular. Secundário: fundo `--cor-superficie`, contorno 2 px `--cor-linha-forte`, texto `--materia-tinta`. De recompensa ("Abrir baú"): fundo `--cor-acao`, texto `--cor-acao-sobre`, contorno `--cor-acao-borda`.
- Rótulo começa com verbo ("Continuar", "Conferir", "Abrir baú"), até 20 caracteres.

| Estado | Visual |
|---|---|
| Padrão | como acima, `--sombra-1` |
| Hover | superfície 8% mais clara no claro (mistura com `--cor-superficie`), só com ponteiro |
| Foco | anel `--cor-foco` 3 px, deslocamento 2 px |
| Pressionado | escala 0,97, `--sombra-1` some |
| Desabilitado | fundo `--cor-superficie-2`, texto `--cor-texto-suave`, sem sombra; e **diz o motivo** ao lado ("Escolha uma resposta") |
| Carregando | rótulo troca para o que está acontecendo ("Conferindo") com anel girando 1 s; botão trava, largura não muda |
| Erro | contorno 2 px `--cor-ainda`, mensagem de 3 partes logo abaixo (seção 11) |
| Vazio | não se aplica |

### 10.4 Cartão de etapa (um lugar do planeta)

Cada planeta tem 10 etapas (os "mundos" do código). O cartão mostra o lugar que se monta com as fases concluídas.

- **Anatomia (de cima para baixo):** imagem do lugar (proporção 3:2, `--raio-32` no topo) com revelação por máscara do "apagado" para o "completo"; faixa com nome do lugar em `--t-h3`; linha "3 de 5 fases" em `--t-pequeno` com 5 marcadores de 12 px mais um sexto dourado (revisão); botão "Entrar" ou "Continuar".
- Fundo do cartão: `--cor-superficie`; cabeçalho `--materia-suave`. Largura da coluna; altura mínima 224 px.

| Estado | Visual |
|---|---|
| Bloqueado | imagem em versão "apagado" com cadeado de 32 px, nome e frase "Termine o lugar anterior para abrir". Toque abre uma folha curta explicando (não faz nada de errado) |
| Disponível | imagem "apagado", marcadores vazios, botão "Começar" |
| Em andamento | revelação proporcional (1/5 a 4/5), marcadores preenchidos em `--materia-base`, botão "Continuar" |
| Concluído | imagem "completo", marcadores cheios e o sexto dourado aceso, selo de check, botão "Ver desenho" |
| Revisão pronta | as 5 fases cheias e o sexto marcador pulsando 2 ciclos, botão "Fazer a revisão" |
| Hover e foco | contorno `--cor-foco` (cartão inteiro é tocável) |
| Pressionado | escala 0,98 |
| Carregando | imagem some e entra um bloco `--cor-superficie-2`; texto e botão já funcionam |
| Erro | imagem não carregou: mantém o bloco com o nome do lugar. Sem mensagem, o jogo segue |
| Vazio | não se aplica (o planeta sempre tem 10) |

### 10.5 Nó do mapa (uma fase)

- Disco de 64 px (visual) dentro de uma área de toque de 72 px, ligado ao próximo por trilha de pontos de 8 px. Conteúdo: o número da fase em `--t-h3` ou o ícone do estado. Etiqueta com o nome da fase em `--t-legenda`, em pílula `--cor-superficie`, no máximo 2 linhas.
- O personagem do jogador **fica em pé ao lado do nó atual** e caminha até o seguinte quando a fase é concluída (480 ms; sem animação com movimento reduzido).

| Estado | Visual |
|---|---|
| Bloqueado | disco `--cor-superficie-2`, cadeado, contorno `--cor-linha-forte` |
| Disponível | disco `--materia-base`, número em `--materia-sobre`, halo `--materia-luz` (respira 2 ciclos) |
| Atual | igual a disponível, maior em 8 px, com o personagem ao lado |
| Concluído | disco `--materia-base` com 1 a 3 estrelas em formas distintas (cheia, meia, vazia) sob o número |
| Revisão (medalha) | disco `--cor-ouro`, contorno `--cor-ouro-borda`, ícone de medalha em `--cor-ouro-sobre` |
| Foco | anel `--cor-foco` 3 px |
| Pressionado | escala 0,95 |
| Carregando | ao tocar, anel girando no disco por até 300 ms enquanto a fase abre |
| Erro | a fase não abriu: folha curta com "Não consegui abrir esta fase. Toque para tentar de novo." |
| Vazio | não se aplica |

### 10.6 Baú do dia

Sem sorteio: a criança sabe a categoria antes de abrir (decisão da especificação, seção 5.4, exigência de ética infantil).

- Imagem do baú (arte semirrealista, 160 px) com `--sombra-contato`. Abaixo, uma linha "Dentro: um adesivo" (categoria visível). Botão de recompensa "Abrir baú" quando a meta está cheia.

| Estado | Visual |
|---|---|
| Fechado (meta incompleta) | baú fechado, barra de meta "12 de 20 perguntas" (texto e barra), sem botão |
| Pronto | baú com halo `--cor-ouro` (respira 2 ciclos), botão "Abrir baú" |
| Abrindo | `--mov-celebra`: tampa abre e o item sobe (quadro final com movimento reduzido) |
| Aberto | item mostrado em cartão, botão "Guardar" que leva ao item no Meu personagem ou nos desenhos |
| De amanhã | baú pequeno fechado com "Amanhã: um ornamento para colorir", sem contagem de horas |
| Foco, hover e pressionado | como botão de recompensa |
| Desabilitado | não existe: sem meta cheia o baú é o estado Fechado, que explica o que falta |
| Carregando | arte do baú ainda não chegou: ícone de baú do conjunto de ícones no lugar |
| Erro | falha ao gravar a recompensa: "Não consegui guardar seu prêmio. Seu baú continua aqui. Toque para tentar de novo." (nunca perder o prêmio) |
| Vazio | não se aplica |

### 10.7 Congelador de ofensiva

- Mostra o ícone de floco de 32 px e "Congeladores: 1 de 2", junto da ofensiva no topo (a chama). Folha de explicação ao tocar.

| Estado | Visual |
|---|---|
| Sem congelador | floco só com contorno `--cor-gelo-borda`, texto "Congeladores: 0 de 2" e linha "Faltam 3 dias de jogo para ganhar um" |
| Com 1 ou 2 | flocos preenchidos `--cor-gelo` com contorno `--cor-gelo-borda`, 1 ou 2 conforme |
| Usado hoje | floco "derrete" suave em 480 ms e aparece o texto "O Bobby usou um congelador. Sua sequência continua firme." (sem tom de alarme) |
| Ganho | floco novo entra com `--mov-lento`, texto "Você ganhou um congelador por jogar 7 dias." |
| Ofensiva descansando | chama em `--cor-texto-suave` com a palavra "descansando"; nunca vermelho, nunca "perdeu" |
| Foco, hover e pressionado | contorno `--cor-foco`; tocar abre a explicação |
| Desabilitado | não se aplica |
| Carregando | números no lugar com traço "..."; não bloqueia |
| Erro | não se aplica (valor vem do estado local) |
| Vazio | é o estado "Sem congelador" |

### 10.8 Missões do dia

Três cartões empilhados, 8 px de vão, dentro da meta do dia. Cada missão: ícone de 32 px, texto em `--t-corpo`, barra de progresso de 12 px com "2 de 4" em texto.

| Estado | Visual |
|---|---|
| Pendente | barra vazia, texto `--cor-texto` |
| Em andamento | barra preenchida em `--materia-base`, contador em texto |
| Concluída | check em círculo `--cor-acerto-suave`, barra cheia, texto continua `--cor-texto` (sem riscar) |
| Três concluídas | "estrela do dia" acende no topo da lista, `--mov-celebra` |
| Foco, hover e pressionado | contorno `--cor-foco`; tocar leva ao tipo de jogo da missão |
| Desabilitado | não se aplica (missão nunca bloqueia nada) |
| Carregando | três blocos `--cor-superficie-2` por até 300 ms; as missões saem do estado local |
| Erro | não se aplica |
| Vazio | "Suas missões de hoje estão completas. Amanhã tem novas." (e nunca "você falhou" para missão não feita: missão não feita simplesmente não aparece como falha) |

### 10.9 Opção de resposta e painel de feedback (o coração da fase)

- Opção: largura total, altura mínima 56 px, `--raio-16`, contorno 2 px `--cor-linha-forte`, texto em `--t-corpo`. Número da pergunta em `--t-numero`.
- Painel de feedback: sobe da base, `--raio-24` no topo, `--mov-padrao`. Acerto: `--cor-acerto-suave`, check, frase em `--t-destaque`. "Ainda não": `--cor-ainda-suave`, ícone de seta circular, três partes em linhas separadas (o que houve, por quê, o que vem agora). Nunca quebra a resposta em três linhas soltas como hoje.
- Estados da opção: padrão, hover, foco, pressionada (escala 0,98), selecionada (contorno `--materia-base` 3 px e fundo `--materia-suave`), certa (check, fundo `--cor-acerto-suave`), errada (seta, fundo `--cor-ainda-suave`, sem sacudir), desabilitada (após conferir), carregando (não se aplica), erro e vazio (não se aplicam).

### 10.10 Folha inferior, modal e campos

- Folha: `--cor-superficie`, `--raio-32` no topo, alça de 4 por 40 px, `--sombra-3`, fecha por botão "Fechar" visível (não só por arrasto). Modal: igual, centrado no computador, com dois botões de **peso visual igual** quando for escolha ("Terminar por hoje" e "Continuar explorando"), nunca um botão enorme e um link apagado.
- Campo de texto: altura 56 px, `--raio-16`, contorno 2 px `--cor-linha-forte`, rótulo visível acima (não só placeholder). Estados: padrão, foco (contorno `--cor-foco`), preenchido, erro (contorno `--cor-ainda` e mensagem de 3 partes abaixo), desabilitado, carregando (não se aplica), vazio (placeholder em `--cor-texto-suave`).

### 10.11 Faixa de status do topo

Altura `--topo-h`. Esquerda: avatar do jogador (abre menu com Perfil, Trocar de jogador, Responsável). Centro: nome do planeta. Direita: ofensiva (chama), moedas, som. Fundo `--cor-vidro` (ou `--cor-superficie` quando o vidro estiver desligado). Sempre os três indicadores, em qualquer largura. Estados: o número troca direto, sem rolar; ofensiva descansando segue o 10.7.

---

## 11. Microcopy (textos curtos)

Regras (skill `microcopy-de-interface`, adaptadas à casa): português do Brasil, "você", frases curtas, sem travessão, sem "tu" e sem a figura de negar uma coisa para afirmar outra. Botão começa com verbo e nomeia a ação. Erro em três partes. Tom: caloroso, calmo, sem pressão. Exclamação só em acerto e recompensa. Proibido: "senti sua falta", "você vai perder", "últimas horas", mascote triste. Texto lido em voz alta: frases de até 15 palavras (conferido por script nas recomendadas e nas alternativas da tabela abaixo: nenhuma passa de 15).

Cada item: texto recomendado e duas alternativas. Limites de espaço medidos com `len` em Python: rótulo da barra até 16 caracteres (o maior, "Meu personagem", tem 14) e botão até 20 (o maior, "Continuar explorando", tem exatamente 20; em 360 px de largura cabe em `--t-h3`, a confirmar no navegador).

| Elemento | Recomendado | Alternativa B | Alternativa C |
|---|---|---|---|
| Rótulos da barra | Planetas · Missões · Meu personagem · Desenhos | Mapa · Missões · Personagem · Coleção | Galáxias · Missões · Eu · Desenhos |
| Botão de fase | Continuar | Seguir em frente | Próxima |
| Botão de conferir | Conferir | Ver se acertei | Responder |
| Acerto | Isso mesmo! 5 e 3 juntos fazem 8. | Acertou. 5 e 3 fazem 8. | Muito bem. A conta é 5 + 3 = 8. |
| Ainda não (3 partes) | Ainda não. A resposta certa é 8, porque 5 e 3 juntos fazem 8. Esta pergunta volta daqui a pouco para você tentar de novo. | Quase. O certo é 8: 5 e 3 juntos fazem 8. Vamos ver essa de novo mais tarde. | Essa foi difícil. Era 8, pois 5 e 3 fazem 8. Ela volta no fim da fase. |
| Baú fechado | O baú abre quando você completar a meta de hoje. | Faltam 8 perguntas para abrir o baú. | Complete a meta e abra o baú do dia. |
| Baú pronto | Seu baú do dia está pronto. | Sua meta de hoje está completa. O baú abriu. | Meta cumprida. Abra seu baú. |
| Baú de amanhã | O baú de amanhã já está guardado. Dentro tem: um adesivo. | Amanhã tem baú novo, com um adesivo. | Seu próximo baú traz um adesivo. |
| Congelador (explicação) | Um congelador cuida da sua sequência quando você falta um dia. | Se você faltar um dia, o congelador guarda sua sequência. | O congelador protege sua sequência por um dia. |
| Congelador usado | O Bobby usou um congelador. Sua sequência continua firme. | O Bobby cuidou da sua sequência. Ela continua firme. | Seu congelador cobriu o dia de ontem. Sequência mantida. |
| Ofensiva descansando | Sua sequência estava descansando. Hoje ela volta com tudo. | Sua sequência voltou. Vamos de novo? | Que bom ter você de volta. A sequência recomeça hoje. |
| Meta de hoje | Meta de hoje: 20 perguntas | Hoje: 20 perguntas | Sua meta: 20 perguntas |
| Fim do dia | Por hoje chega! Até amanhã. | Você fez um ótimo trabalho. Amanhã tem mais. | Missão do dia cumprida. Descanse um pouco. |
| Botões do fim do dia | Terminar por hoje / Continuar explorando | Até amanhã / Jogar mais um pouco | Encerrar o dia / Seguir jogando |
| Missões vazio | Suas missões de hoje estão completas. Amanhã tem novas. | Missões do dia feitas. Volte amanhã para as novas. | Tudo certo por hoje. Novas missões chegam amanhã. |
| Guarda-roupa vazio | Seu guarda-roupa está começando. Jogue para ganhar adesivos e roupas. | Ainda não tem roupas novas. Elas chegam nos baús. | Aqui ficam suas roupas e adesivos. Abra baús para ganhar. |
| Imagem não carregou | Esta imagem ainda não chegou. O jogo continua normal. | Não consegui mostrar a imagem. Pode seguir jogando. | A imagem está demorando. Você pode jogar assim mesmo. |
| Fase não abriu | Não consegui abrir esta fase. Toque para tentar de novo. | Esta fase não abriu. Tente mais uma vez. | A fase não carregou. Toque em tentar de novo. |

Bilhetes do Bobby ficam na especificação (`docs/FASE-2-especificacao.md`, seção 5.6) e valem como estão.

---

## 12. Proibido

- Gradiente roxo ou azul-roxo genérico como fundo de interface. (Violeta é a cor do planeta Fábula, aplicada por token e em botão, não como pano de fundo de tela.)
- Easing com bounce ou overshoot. Mola em personagem.
- Glow escuro, neon, texto com brilho.
- Tudo centralizado: texto corrido e opção de resposta alinham à esquerda.
- Raio arredondado igual em todo canto: o raio segue a escala da seção 5.
- **Hex fora do bloco de tokens**, inclusive em SVG de interface, JavaScript e CSS inline.
- Tamanho de fonte, espaço ou duração fora das escalas.
- Texto direto sobre cenário (sempre sobre cartão ou chip).
- Cor como único sinal de estado.
- Emoji como ícone.
- Vermelho de alarme em erro, contagem regressiva, número piscando, mascote triste, selo "últimas horas", baú à venda, sorteio de prêmio.
- Personagem feito de formas primitivas ou imagem com detalhe colado por cima. Mesmo molde de cabeça para personagens diferentes.
- Ícone gigante sem tamanho definido (bug atual na galeria: `.gal-acoes .btn svg` sem regra).
- Barra inferior com mais de 5 itens, ou com item sem rótulo de texto.
- Pedir ao responsável ou à criança qualquer dado que não seja apelido, cor e progresso (ver relatório de ética).

---

## 13. Como validar (antes de escalar)

Peça **um** componente simples: o botão primário e o cartão de etapa de uma matéria. Conferir:
1. As cores batem com os tokens (inspecionar no navegador, nenhum hex fora do `:root`).
2. A fonte é Fredoka nos títulos e Nunito no corpo, carregadas do próprio app (rede desligada: continua igual).
3. Todo espaçamento está na escala 4 8 16 24 32 40 48 64 96.
4. Usou os componentes desta página e não criou um novo.
5. Rodar a auditoria: `npx impeccable detect src/` e `/impeccable audit`. O DESIGN.md decide, o impeccable audita.

Teste de entrega (regra da casa: build passando não é entrega funcionando): abrir no navegador de verdade, desktop e mobile (360 por 740 e 1280 por 800), claro e escuro, console sem erro, toque com o polegar na barra inferior, sessão com movimento reduzido ligado.

---

## 14. Do estado de hoje para este documento

| Hoje (`src/interface/style.css`) | Este documento |
|---|---|
| `--papel`, `--surf`, `--tinta`, `--quadro`, `--u-verde`... (nomes e cores atuais, tema único verde) | Tokens `--cor-*` e `--mat-`/`--por-`/`--ing-`; as cinco cores `--u-*` por mundo saem, cada planeta tem a sua |
| Hex dentro de SVG de personagem e cenário (`--m1`, `--folha`, `--flor1`) | Saem junto com o personagem e os cenários procedurais, trocados por arte raster |
| `font-size: 16.5px` solto | Escala fixa da seção 3 |
| Google Fonts por CDN | Fontes dentro do app, em cache |
| Ofensiva e som escondidos abaixo de 430 px | Sempre visíveis no topo |
| Sem barra inferior | Barra com "Meu personagem" |
| Duas cores de erro (verde e vermelho) | Acerto verde, "ainda não" laranja queimado, sempre com ícone e texto |

Ferramenta do build (a escrever na implementação): um script que (a) gera as duas cópias do tema escuro a partir de uma lista, (b) recalcula a tabela de contraste e falha se alguma combinação ficar abaixo do mínimo, (c) procura hex fora do bloco de tokens em `src/`, (d) confere `manifest.webmanifest` e `theme-color` contra `--cor-fundo`.

---

## 15. O que esta versão não resolveu e o que não rodou

- Nenhuma imagem foi gerada e nenhum crédito foi gasto. A estética descrita aqui depende de a arte do lote piloto passar no critério da filha (`LOTE-PILOTO.md`). Se não passar, a seção 9 e a `BIBLIA-DE-PERSONAGENS.md` voltam para ajuste antes de qualquer implementação.
- O contraste foi calculado por script nos tokens; **não** foi conferido em aparelho real, com sol na tela, nem com daltonismo simulado.
- Peso das fontes (120 KB) e das imagens (10 MB) são **orçamentos**, não medições.
- Licenças de Fredoka, Nunito e do conjunto de ícones precisam ser conferidas nos arquivos reais ao empacotar.
- Nomes dos personagens e dos planetas não passaram por busca de marca registrada (INPI). Fazer antes de vender.
- Nada foi testado em navegador (este arquivo é especificação). A validação da seção 13 acontece na Fase 3 de implementação.
