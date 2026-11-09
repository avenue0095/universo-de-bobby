/* ===== 3º ano: medidas e tempo (matemática) e 20 textos curtos (português) =====
   Plano de conteúdo aprovado (docs/PROXIMAS-ETAPAS.md, item 5; lacunas de grandezas e medidas em docs/bncc-mapa.md).
   Entram como geradores no FIM das fases que já tratam do assunto (8.5 Unidades de medida, 1.5 com o relógio, p10.1 a p10.4 Ler e entender)
   e como temas do modo "treinar por tema" (conteudo/temas.js). Textos novos com voz pendente: audio/regerar-pendentes.json. */
const MED3={
  cmM(){const m=R(1,5);return mc('Quantos centímetros tem '+(m===1?'1 metro':m+' metros')+'?',String(m*100),[m*10,m*1000,m*100+10].map(String));},
  kgG(){const k=R(1,4);return mc('Quantos gramas tem '+(k===1?'1 quilo':k+' quilos')+'?',String(k*1000),[k*100,k*10,k*1000+100].map(String));},
  litroMl(){const l=pick([1,2,3]);return mc('Quantos mililitros tem '+(l===1?'1 litro':l+' litros')+'?',String(l*1000),[l*100,l*10,l*500].map(String));},
  qualUnidade(){const it=pick([['a altura de uma porta','metro'],['o peso de uma melancia','quilograma'],['a água de um balde','litro'],['o comprimento de uma borracha','centímetro'],
      ['o remédio numa colher','mililitro'],['o peso de uma bala','grama']]);
    return mc('Qual unidade é melhor para medir '+it[0]+'?',it[1],['metro','quilograma','litro','centímetro','mililitro','grama'].filter(x=>x!==it[1]).slice(0,3));},
  maisPesado(){const b=R(1,3),gs=shuf([200,300,400,500,600,700,800,900]).slice(0,3);
    return mc('O que pesa mais?',(b===1?'1 quilo':b+' quilos'),gs.map(g=>g+' gramas'));},
  minutosHora(){const h=pick([1,2,3]);return mc('Quantos minutos tem '+(h===1?'1 hora':h+' horas')+'?',String(h*60),[h*100,h*30,h*60+10].map(String));},
  meiaHora(){return mc('Meia hora tem quantos minutos?','30',['50','15','60']);},
  duracao(){const ini=R(1,8),d=R(1,3),fim=ini+d,H=n=>n===1?'1 hora':n+' horas';
    /* 3 distratores sempre diferentes entre si e da resposta (antes saíam repetidos e a pergunta ficava com 3 opções) */
    const cand=[fim+1,ini,fim-1,fim+2,fim-2,ini+d+3].filter((x,i,a)=>x>0&&x<=12&&x!==fim&&a.indexOf(x)===i);
    return mc('O filme começou '+(ini===1?'à 1 hora':'às '+ini+' horas')+' e durou '+H(d)+'. A que horas terminou?',H(fim),cand.slice(0,3).map(H));},
  relogioMinutos(){const h=R(1,12),m=pick([15,45,10,20,40,50]),certa=NOME_HORA(h,m);
    const cand=[NOME_HORA(h,(m+30)%60||5),NOME_HORA(h%12+1,m),NOME_HORA(h,m===15?45:15),NOME_HORA(h,m===20?40:20),NOME_HORA((h+10)%12+1,m)].filter((x,i,a)=>x!==certa&&a.indexOf(x)===i);
    return mc('Que horas o relógio marca?',certa,cand.slice(0,3),{figure:relogioSVG(h,m)});},
  diaDepois(){const d=['domingo','segunda-feira','terça-feira','quarta-feira','quinta-feira','sexta-feira','sábado'],i=R(0,6);
    return mc('Que dia da semana vem depois de '+d[i]+'?',d[(i+1)%7],[d[(i+6)%7],d[(i+2)%7],d[(i+3)%7]]);},
  mesDepois(){const m=['janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro'],i=R(0,11);
    return mc('Que mês vem depois de '+m[i]+'?',m[(i+1)%12],[m[(i+11)%12],m[(i+2)%12],m[(i+6)%12]]);},
  semanaDias(){const s=R(1,4);return mc('Quantos dias têm '+(s===1?'1 semana':s+' semanas')+'?',String(s*7),[s*5,s*7+1,s*10].map(String));}
};
/* 20 textos curtos (2 ou 3 frases, palavras de uso comum) com 2 perguntas cada: quem, o quê, onde ou por quê. Escritos aqui (08/11/2026). */
const TEXTOS3=[
  {t:'Lia plantou um feijão num copo. Todo dia ela molhava a terra. Na sexta, nasceu um broto verde.',q:[['O que Lia plantou?','Um feijão',['Uma flor','Uma laranja','Um milho']],['Quando nasceu o broto?','Na sexta',['Na segunda','No domingo','Na quarta']]]},
  {t:'O cachorro Pipoca adora correr na praça. Quando chove, ele fica na janela olhando a rua.',q:[['Onde Pipoca gosta de correr?','Na praça',['Na escola','Na praia','No quintal']],['O que Pipoca faz quando chove?','Fica na janela',['Dorme na cama','Corre na rua','Come ração']]]},
  {t:'Davi esqueceu a lancheira em casa. A professora dividiu uma maçã com ele na hora do recreio.',q:[['O que Davi esqueceu?','A lancheira',['O caderno','A mochila','O casaco']],['Quem dividiu a maçã?','A professora',['A mãe','O colega','O diretor']]]},
  {t:'A vovó Rosa faz bolo de cenoura aos domingos. Os netos chegam cedo para ajudar a mexer a massa.',q:[['Que bolo a vovó faz?','De cenoura',['De chocolate','De milho','De banana']],['Por que os netos chegam cedo?','Para ajudar a mexer a massa',['Para dormir','Para brincar na rua','Para ver televisão']]]},
  {t:'Nina perdeu um dente de leite. Ela guardou o dente numa caixinha embaixo do travesseiro.',q:[['O que Nina perdeu?','Um dente de leite',['Um brinquedo','Uma meia','Um lápis']],['Onde ela guardou o dente?','Embaixo do travesseiro',['Na mochila','No armário','No bolso']]]},
  {t:'O ônibus da escola atrasou por causa da chuva forte. As crianças esperaram debaixo do toldo da padaria.',q:[['Por que o ônibus atrasou?','Por causa da chuva',['Porque quebrou','Por causa do sol','Porque não tinha motorista']],['Onde as crianças esperaram?','Debaixo do toldo da padaria',['Dentro da escola','No parque','Na casa da vizinha']]]},
  {t:'Théo montou uma pipa azul com o pai. No sábado, a pipa subiu bem alto no céu.',q:[['De que cor era a pipa?','Azul',['Vermelha','Amarela','Verde']],['Com quem Théo montou a pipa?','Com o pai',['Com a irmã','Sozinho','Com o avô']]]},
  {t:'Clara tem um gato chamado Bigode. Ele dorme o dia todo e acorda quando ouve o barulho da ração.',q:[['Como se chama o gato?','Bigode',['Pipoca','Mimi','Tigre']],['O que acorda o gato?','O barulho da ração',['A buzina','A chuva','O despertador']]]},
  {t:'Na feira, Beto comprou três laranjas e duas bananas. Ele pagou com uma nota de dez reais.',q:[['Quantas laranjas Beto comprou?','Três',['Duas','Cinco','Uma']],['Com que nota Beto pagou?','Dez reais',['Cinco reais','Dois reais','Vinte reais']]]},
  {t:'A turma visitou o museu dos dinossauros. O maior esqueleto era do tamanho de um ônibus.',q:[['Que museu a turma visitou?','O dos dinossauros',['O de carros','O de pinturas','O de trens']],['Do tamanho de que era o maior esqueleto?','De um ônibus',['De uma casa','De um cachorro','De uma bicicleta']]]},
  {t:'Elisa queria brincar de esconde-esconde, mas o irmão estava dormindo. Ela foi ler um livro de piratas.',q:[['De que Elisa queria brincar?','De esconde-esconde',['De bola','De pular corda','De boneca']],['Por que ela não brincou?','O irmão estava dormindo',['Estava chovendo','Era tarde','Ela estava com fome']]]},
  {t:'O pé de manga do quintal deu tantas frutas que a família fez suco para os vizinhos.',q:[['Que fruta deu no quintal?','Manga',['Goiaba','Uva','Maçã']],['O que a família fez?','Suco para os vizinhos',['Um bolo','Uma torta','Doce de leite']]]},
  {t:'Rafa ganhou um caderno novo de presente. Na primeira página, desenhou um foguete indo para a lua.',q:[['O que Rafa ganhou?','Um caderno',['Uma bola','Um jogo','Uma mochila']],['O que Rafa desenhou?','Um foguete',['Um barco','Uma casa','Um cachorro']]]},
  {t:'A tartaruga do lago sai da água para tomar sol. Quando alguém chega perto, ela volta nadando.',q:[['Onde mora a tartaruga?','No lago',['No mar','Na floresta','No aquário']],['O que ela faz quando alguém chega perto?','Volta nadando',['Dorme','Come','Pula']]]},
  {t:'Manu ajudou a mãe a arrumar a mesa do jantar. Ela colocou os pratos e os copos no lugar.',q:[['Quem ajudou a mãe?','Manu',['O pai','A avó','O irmão']],['O que Manu colocou na mesa?','Os pratos e os copos',['As flores','Os livros','As toalhas']]]},
  {t:'Quando o semáforo fica vermelho, os carros param. Então as pessoas atravessam a rua na faixa.',q:[['O que os carros fazem no sinal vermelho?','Param',['Correm','Buzinam','Viram']],['Onde as pessoas atravessam?','Na faixa',['No meio da rua','Na calçada','Na praça']]]},
  {t:'O passarinho fez um ninho no galho da árvore. Dentro do ninho havia três ovinhos azuis.',q:[['Onde estava o ninho?','No galho da árvore',['No telhado','No chão','Na janela']],['Quantos ovinhos havia?','Três',['Dois','Quatro','Cinco']]]},
  {t:'Era noite no acampamento e ventava muito. Caio sentiu frio, e o avô acendeu uma fogueira. Todos contaram histórias.',q:[['Por que Caio sentiu frio?','Era noite e ventava muito',['Estava na praia','Tomou sorvete','Estava na piscina']],['Quem acendeu a fogueira?','O avô',['Caio','A tia','O guarda']]]},
  {t:'A biblioteca da escola abre às oito horas. Ana pegou um livro sobre planetas e devolveu na semana seguinte.',q:[['A que horas a biblioteca abre?','Às oito horas',['Às dez horas','Ao meio-dia','Às seis horas']],['Sobre o que era o livro?','Planetas',['Dinossauros','Cachorros','Futebol']]]},
  {t:'No inverno, o lago da cidade fica cheio de patos. As crianças levam milho para dar a eles.',q:[['Quando o lago fica cheio de patos?','No inverno',['No verão','Na primavera','No carnaval']],['O que as crianças levam?','Milho',['Pão doce','Bala','Pipoca']]]}
];
comDica(MED3,{cmM:'Lembre: 1 metro tem 100 centímetros. Multiplique os metros por 100.',kgG:'Lembre: 1 quilo tem 1000 gramas. Multiplique os quilos por 1000.',
  litroMl:'Lembre: 1 litro tem 1000 mililitros.',qualUnidade:'Pense no tamanho da coisa: coisa comprida usa metro ou centímetro, peso usa quilo ou grama, líquido usa litro ou mililitro.',
  maisPesado:'Transforme tudo em gramas: 1 quilo tem 1000 gramas. Depois compare.',minutosHora:'Lembre: 1 hora tem 60 minutos.',meiaHora:'Meia hora é a metade de 60 minutos.',
  duracao:'Comece na hora em que começou e some as horas que durou.',relogioMinutos:'O ponteiro pequeno mostra a hora. O grande mostra os minutos: cada número dele vale 5 minutos.',
  diaDepois:'Fale os dias da semana em ordem, a partir de domingo.',mesDepois:'Fale os meses em ordem, a partir de janeiro.',semanaDias:'Uma semana tem 7 dias. Some 7 para cada semana.'});
function leituraCurta(){
  const x=pick(TEXTOS3),q=pick(x.q);
  return mc('<span class="texto-curto">'+x.t+'</span> '+q[0],q[1],q[2],{ouvir:x.t+' '+q[0],dica:'Leia o texto de novo com calma e procure a frase que responde a pergunta.'});
}
const TERCEIRO_POR_FASE={
  '8.5':[MED3.cmM,MED3.kgG,MED3.litroMl,MED3.qualUnidade,MED3.maisPesado],
  '1.5':[MED3.minutosHora,MED3.meiaHora],
  '2.4':[MED3.duracao],
  '6.4':[MED3.relogioMinutos],
  '1.4':[MED3.diaDepois,MED3.mesDepois,MED3.semanaDias],
  'p10.1':[leituraCurta],'p10.3':[leituraCurta],'p10.4':[leituraCurta]
};
(function encaixarTerceiro(){
  [UNITS_MAT,UNITS_PT].forEach(us=>us.forEach(u=>u.lessons.forEach(l=>{const ex=TERCEIRO_POR_FASE[l.id];if(ex)l.makers=l.makers.concat(ex);})));
})();
