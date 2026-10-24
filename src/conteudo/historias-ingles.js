/* ===== Galáxia do Inglês: a viagem do Bobby ===== */
Object.assign(ITENS,{
 mala:'<svg viewBox="0 0 24 24"><path d="M3 8h18v12H3Z" fill="currentColor"/><path d="M9 8V5h6v3" fill="none" stroke="currentColor" stroke-width="2.2"/></svg>',
 passaporte:'<svg viewBox="0 0 24 24"><path d="M5 3h14v18H5Z" fill="currentColor"/><circle cx="12" cy="10" r="3" fill="#fff"/></svg>',
 bandeira:'<svg viewBox="0 0 24 24"><path d="M6 2v20h2v-8h11l-3-4 3-4H8V2Z" fill="currentColor"/></svg>'
});
const CAPITULOS_EN={
 1:{t:'Chegando na cidade (Landing in the city)',item:'mala',abre:'O Bobby desceu do avião numa cidade americana e não entende nada do que falam. As primeiras palavras vão salvar ele.'},
 2:{t:'A escola nova (The new school)',item:'lapis',abre:'Primeiro dia de aula. Tudo tem outro nome: as cores, o lápis, a mochila. Vamos aprender junto com ele.'},
 3:{t:'A família que recebe (The host family)',item:'carta',abre:'O Bobby vai morar com uma família americana. Precisa saber falar de mãe, pai, irmã e amigos.'},
 4:{t:'Um dia no zoológico (A day at the zoo)',item:'estrela',abre:'Passeio ao zoológico! Cada placa tem o nome de um bicho em inglês.'},
 5:{t:'No restaurante (At the diner)',item:'fruta',abre:'No restaurante da esquina o Bobby vai pedir comida sozinho pela primeira vez.'},
 6:{t:'A loja de roupas (The clothes store)',item:'etiqueta',abre:'Precisa comprar roupa nova. E para isso é preciso falar do corpo e das peças.'},
 7:{t:'Lar doce lar (Home sweet home)',item:'peca',abre:'A casa nova tem cômodos, portas e janelas — todos com nomes novos.'},
 8:{t:'Um dia na cidade (A day in the city)',item:'passaporte',abre:'Correr, comer, ler, brincar: o Bobby vai contar o dia dele inteiro em inglês.'},
 9:{t:'Fazendo amigos (Making friends)',item:'balao',abre:'Para fazer amizade é preciso perguntar e responder: <b>What?</b> (O quê?), <b>Where?</b> (Onde?) e <b>How old are you?</b> (Quantos anos você tem?)'},
 10:{t:'Falando como um local (Talking like a local)',item:'bandeira',abre:'A última etapa: falar como quem mora lá, com as frases do dia a dia.'}
};
const MISSOES_EN={};
(function(){
 const M={
 1:['Dizer o primeiro oi','Cumprimentar pela hora do dia','Pedir com educação','Se apresentar','Contar até três'],
 2:['As três primeiras cores','Mais três cores','As cores que faltam','O material da mochila','A escola e a professora'],
 3:['Mãe e pai','Irmã e irmão','Os avós','Família e amigos','Menino, menina e bebê'],
 4:['Cachorro e gato','Pássaro e peixe','Os bichos da fazenda','Os bichos selvagens','O urso e o coelho'],
 5:['Água e leite','Pão e queijo','As frutas','Bolo e doces','As refeições do dia'],
 6:['Cabeça, mão e pé','O rosto','Camiseta e sapatos','Vestido e chapéu','Se vestir inteiro'],
 7:['A casa e a porta','Cozinha e quarto','Mesa e cadeira','Jardim e cômodos','Chave e luz'],
 8:['Correr, comer, beber','Dormir e brincar','Ler e escrever','Caminhar, cantar, pular','Eu gosto, eu consigo'],
 9:['O quê e onde','Quem e quando','Quantos?','Como você está?','Quantos anos você tem?'],
 10:['Ontem, hoje, amanhã','As frases prontas','Pedir e agradecer','Palavras que enganam','O desafio final']
 };
 const F={
 1:'Primeiras palavras na ponta da língua!',2:'Material da escola dominado!',3:'A família toda apresentada!',
 4:'Todos os bichos identificados!',5:'Pedido feito e prato na mesa!',6:'Roupa nova escolhida sem gaguejar!',
 7:'Casa toda nomeada em inglês!',8:'Dia inteiro contado em inglês!',9:'Amizade feita!',10:'Agora você fala como um local!'
 };
 Object.keys(M).forEach(k=>{
  M[k].forEach((t,i)=>{
   MISSOES_EN['e'+k+'.'+(i+1)]={t:t,
     abre:'O Bobby precisa de você para esta parte: '+t.toLowerCase()+'. Cada resposta certa ajuda ele a se virar melhor.',
     fim:F[k]};
  });
 });
})();

