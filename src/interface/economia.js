/* ---------- economia do jogo: o que se ganha e o que custa, num lugar só ----------
   Moedas só se ganham jogando (resposta certa, sequência, fase perfeita, baú). Nunca são vendidas nem compradas com dinheiro, nem em loja
   (ECA Digital): nada aqui liga a pagamento real. O Bobby é grátis. Companheiros e looks custam moedas do jogo, sem culpa e sem urgência.
   Calibragem (testes/economia.js simula uma criança média: 80% de acerto, meta de 5 minutos = 20 perguntas por dia, 3 fases por dia de 8, 8 e 4):
   rende cerca de 180 moedas por dia de jogo. Prazos medidos juntando do ZERO: 1º companheiro ~3 dias, 2º ~5, os mais raros 10 a 14. */
const ECON={ganhoAcerto:10,bonusSequencia:5,sequenciaDe:3,bonusFasePerfeita:20,bonusRevisao:5,perguntasPorDia:20};
/* preço em moedas (só do jogo). Looks custam menos que companheiros. */
const PRECOS={
  companheiro:{teo:500,rufa:900,otto:1000,capi:1500,brisa:2000,fagulha:2500},
  look:{explorador:150,bone:200,oculos:250,lenco:300,capacete:450,capa:600,coroa:900}
};
const precoDoCompanheiro=id=>PRECOS.companheiro[id]||0;
