/* ---------- economia do jogo: o que se ganha e o que custa, num lugar só (1E, mesa 01 §7.1) ----------
   Moedas só se ganham jogando (resposta certa, sequência, fase perfeita, baú). Nunca são vendidas nem compradas com dinheiro, nem em loja
   (ECA Digital): nada aqui liga a pagamento real. O Bobby é grátis.
   Regras da onda 1 (todas testadas em testes/economia.js e testes/loja.js):
   - portão duplo: item acima de 500 moedas pede moeda E uma conquista (dias de exploração, fases perfeitas, fases, etapas). Nunca "compre para destravar".
   - preço nunca muda: mudar qualquer preço exige subir CATALOGO_VERSAO (o teste compara com a fotografia de testes/fixtures/precos.json).
   - loja da semana: ciclo fixo de 12 semanas no calendário, 4 itens por semana, lista de desejos de 3 vagas (o item marcado continua
     comprável fora da semana dele). Sem contador, sem "última chance", sem "só hoje". Item comprado sai da lista.
   - ralos sem teto: petisco (20, só com companheiro, 1 por dia conta para a amizade), céu estrelado (100 por estrela, só quando sobra mais de
     2.000 e não há item comprável), pistas da história (100 por página, uma por etapa concluída).
   - cofrinho de meta: metade do que se ganha depois de escolher a meta fica guardada para ela; um toque desfaz; nada trava.
   Calibragem do ganho (criança média, 80% de acerto, 20 perguntas por dia): cerca de 180 moedas por dia de jogo. */
const ECON={ganhoAcerto:10,bonusSequencia:5,sequenciaDe:3,bonusFasePerfeita:20,bonusRevisao:5,perguntasPorDia:20,
  petisco:20,estrela:100,estrelaSobra:2000,portaoAcima:500,cofrinhoParte:.5,desejosMax:3,semanasCiclo:12,porSemana:4};
const CATALOGO_VERSAO=2;   /* 2 (09/11/2026): acessórios dos companheiros (B2); nenhum preço antigo mudou */
/* preço em moedas (só do jogo) */
const PRECOS={
  companheiro:{teo:500,rufa:900,otto:1000,capi:1500,brisa:2000,fagulha:2500},
  look:{explorador:150,bone:200,oculos:250,lenco:300,capacete:450,capa:600,coroa:900,
    gorro:250,'oculos-sol':220,gravata:140,medalha:350,'mochila-foguete':480,bandeira:160,lanterna:260,varinha:380},
  semana:{'moldura-sol':250,'moldura-mar':300,'moldura-folha':350,'moldura-noite':400,'moldura-ouro':500,'moldura-arco':600,
    'trilha-ouro':300,'trilha-mar':350,'trilha-rosa':400,'trilha-verde':450,'trilha-lilas':600,'trilha-arco':700,
    'adesivo-estrela':80,'adesivo-foguete':80,'adesivo-planeta':80,'adesivo-cometa':80,'adesivo-lua':80,'adesivo-folha':80,
    'adesivo-coracao':80,'adesivo-nuvem':80,'adesivo-raio':80,'adesivo-flor':80,'adesivo-concha':80,'adesivo-livro':80},
  pista:100,
  /* B2: o companheiro evolui de graça; só o acessório dele se compra (abre no estágio Grande amigo) */
  acessorio:{teo:300,rufa:300,otto:300,capi:350,brisa:400,fagulha:400}
};
/* portões (conquista que vem junto com a moeda): {t:'dias'|'perfeitas'|'fases'|'etapas', n} */
const PORTOES={
  rufa:{t:'fases',n:5},otto:{t:'etapas',n:1},capi:{t:'dias',n:14},brisa:{t:'perfeitas',n:10},fagulha:{t:'dias',n:30},
  capa:{t:'dias',n:7},coroa:{t:'etapas',n:3},'moldura-arco':{t:'dias',n:7},'trilha-lilas':{t:'dias',n:14},'trilha-arco':{t:'dias',n:14}
};
const precoDoCompanheiro=id=>PRECOS.companheiro[id]||0;
