const UNITS_MAT=[];

/* ============ UNIDADE 1 ============ */
UNITS_MAT.push({n:1,title:'Números e contagem',sub:'Onde tudo começa: contar, comparar e entender o valor de cada algarismo.',tone:'verde',lessons:[
L('1.1','1','Contar até 20',
 {ideia:'Contar é dizer quantos objetos existem, um de cada vez, sem pular e sem repetir. Cada número é sempre <b>um a mais</b> que o anterior.',
  exemplo:'●●●●● → 5 bolinhas. Se aparecer mais uma, viram 6.',
  dica:'Toque em cada bolinha com o dedo enquanto conta. Isso evita contar duas vezes a mesma.'},
 [
  ()=>{const n=R(6,20);return mc('Quantas bolinhas tem aqui?',n,[n+1,n-1,n+2],{figure:dots(n)});},
  ()=>{const n=R(1,19);return mc('Qual número vem <b>depois</b> do '+n+'?',n+1,[n-1,n+2,n]);},
  ()=>{const n=R(2,20);return mc('Qual número vem <b>antes</b> do '+n+'?',n-1,[n+1,n-2,n]);},
  ()=>{const n=R(3,15);return inp('Complete a sequência: '+n+', '+(n+1)+', '+(n+2)+', ___',n+3);},
  ()=>{const n=R(8,20);return inp('Contando de trás pra frente: '+n+', '+(n-1)+', '+(n-2)+', ___',n-3);},
  ()=>{const n=R(5,18);return inp('Se você tem '+n+' figurinhas e ganha mais 1, fica com quantas?',n+1);}
 ]),
L('1.2','>','Maior, menor ou igual',
 {ideia:'Para comparar dois números, olhe primeiro quantos algarismos cada um tem. Quem tem mais algarismos é maior. Se tiverem a mesma quantidade, compare da esquerda para a direita.',
  exemplo:'34 e 51 → os dois têm 2 algarismos. Comparando o primeiro: 3 é menor que 5, então 34 &lt; 51.',
  dica:'O sinal &lt; é uma boca aberta: ela sempre "come" o número maior.'},
 [
  ()=>{const a=R(10,99),b=R(10,99),c=R(10,99);if(a===b||b===c||a===c)return mc('Qual é o <b>maior</b>?',99,[10,55]);return mc('Qual é o <b>maior</b>?',Math.max(a,b,c),[Math.min(a,b,c),[a,b,c].sort((x,y)=>x-y)[1]]);},
  ()=>{const a=R(10,99),b=R(10,99),c=R(10,99);if(a===b||b===c||a===c)return mc('Qual é o <b>menor</b>?',10,[99,55]);return mc('Qual é o <b>menor</b>?',Math.min(a,b,c),[Math.max(a,b,c),[a,b,c].sort((x,y)=>x-y)[1]]);},
  ()=>{const a=R(10,99);let b=R(10,99);while(b===a)b=R(10,99);return mc('Qual sinal completa?  '+a+' ___ '+b,a>b?'>':'<',['=',a>b?'<':'>']);},
  ()=>{const a=R(100,999);let b=R(100,999);while(b===a)b=R(100,999);return mc('Qual sinal completa?  '+a+' ___ '+b,a>b?'>':'<',['=',a>b?'<':'>']);},
  ()=>{const a=R(20,80);return tf(a+' é maior que '+(a+R(1,15))+'.',false);},
  ()=>{const a=R(20,80);return tf(a+' é maior que '+(a-R(1,15))+'.',true);}
 ]),
L('1.3','10','A dezena: juntar de 10 em 10',
 {ideia:'Contar de um em um é lento e a gente se perde. Por isso a gente junta de <b>10 em 10</b>. Cada grupo de 10 é uma <b>dezena</b>.',
  exemplo:'10 cubinhos soltos viram 1 barrinha. 3 barrinhas são 3 dezenas, que valem 30.',
  dica:'Toda vez que juntar 10 soltinhos, troque por 1 barrinha. Esse é o jogo da troca.'},
 [
  ()=>{const d=R(1,6);return mc('Quantos cubinhos tem <b>uma barrinha</b>?',10,[1,100,5],{figure:dourado(0,1,0)});},
  ()=>{const d=R(1,9);return inp('Quanto vale '+d+' barrinha'+(d>1?'s':'')+'?',d*10,{figure:dourado(0,d,0)});},
  ()=>{const d=R(2,5);return blocos('Monte <b>'+(d*10)+'</b> com as barrinhas.',d*10,{max:{c:0,d:9,u:9}});},
  ()=>{const d=R(1,4),u=R(1,6);return inp('Quantos cubinhos há aqui ao todo?',d*10+u,{figure:dourado(0,d,u,true)});},
  ()=>{const u=R(11,19);return mc('Tenho '+u+' cubinhos soltos. Quantas barrinhas posso trocar?',1,[u-10,2,0]);},
  ()=>{const d=R(2,9);return mc('Quantas dezenas cabem em '+(d*10)+'?',d,[d*10,d+1,10]);}
 ]),
L('1.4','100','Unidade, dezena e centena',
 {ideia:'Cada casa do número tem um valor: o cubinho é a <b>unidade</b>, a barrinha é a <b>dezena</b> (10) e a placa é a <b>centena</b> (100).',
  exemplo:'246 = 2 placas + 4 barrinhas + 6 cubinhos = 200 + 40 + 6.',
  dica:'O algarismo sozinho não diz o valor: em 246, o 2 vale 200 porque está na casa da centena.'},
 [
  ()=>{const c=R(1,3),d=R(1,5),u=R(1,6);return inp('Que número está montado aqui?',c*100+d*10+u,{figure:dourado(c,d,u,true)});},
  ()=>{const c=R(1,3),d=R(1,4),u=R(1,5);return blocos('Monte o número <b>'+(c*100+d*10+u)+'</b> com as peças.',c*100+d*10+u,{max:{c:9,d:9,u:9}});},
  ()=>{const n=R(112,989);return mc('No número '+n+', quanto vale o algarismo '+Math.floor(n/100)+'?',Math.floor(n/100)*100,[Math.floor(n/100),Math.floor(n/100)*10]);},
  ()=>{const c=R(1,9),d=R(0,9),u=R(1,9);return inp(c+(c===1?' centena':' centenas')+' + '+d+(d===1?' dezena':' dezenas')+' + '+u+(u===1?' unidade':' unidades')+' = ?',c*100+d*10+u);},
  ()=>{const c=R(1,5);return mc('Quantas barrinhas cabem em 1 placa?',10,[100,5,1],{figure:dourado(1,0,0)});},
  ()=>{const n=R(120,980);return mc('Como se lê o número '+n+'?',extenso(n),[extenso(n+100>999?n-100:n+100),extenso(Math.floor(n/10)*10+((n%10)+1)%10)]);}
 ]),
L('1.5','~','Reta numérica e arredondar',
 {ideia:'Arredondar é trocar um número por outro mais “redondo” e bem próximo. Para arredondar à dezena, olhe a unidade: de 0 a 4 desce, de 5 a 9 sobe.',
  exemplo:'47 → o 7 é maior que 5, então sobe: 50. Já 43 → desce para 40.',
  dica:'Serve muito para estimar contas de cabeça no mercado.'},
 [
  ()=>{const s=pick([2,5,10,25,50,100]),a=s*R(1,6);return inp('Complete a sequência: '+a+', '+(a+s)+', '+(a+2*s)+', ___',a+3*s);},
  ()=>{const n=R(11,99);const ans=Math.round(n/10)*10;return mc('Arredonde '+n+' para a <b>dezena</b> mais próxima.',ans,[ans+10,ans-10,n]);},
  ()=>{const n=R(110,990);const ans=Math.round(n/100)*100;return mc('Arredonde '+n+' para a <b>centena</b> mais próxima.',ans,[ans+100,ans-100]);},
  ()=>{const a=R(2,9),b=a*R(2,9);return inp('Na reta numérica, qual número está bem no meio entre '+(a*10)+' e '+(a*10+20)+'?',a*10+10);},
  ()=>{const n=R(31,89);return tf('Arredondando '+n+' para a dezena mais próxima, o resultado é '+(Math.round(n/10)*10)+'.',true);},
  ()=>{const s=pick([3,4,6,7]),a=s*R(1,5);return inp('Contando de '+s+' em '+s+': '+a+', '+(a+s)+', '+(a+2*s)+', ___',a+3*s);}
 ])
]});

/* ============ UNIDADE 2 ============ */
UNITS_MAT.push({n:2,title:'Somar e subtrair',sub:'Juntar e tirar, as duas contas que aparecem todo dia.',tone:'agua',lessons:[
L('2.1','+','Somas até 20',
 {ideia:'Somar é juntar. A ordem não muda o resultado: 3 + 5 é igual a 5 + 3.',
  exemplo:'7 + 5 → complete primeiro até 10 (7 + 3 = 10) e some o que sobrou (10 + 2 = 12).',
  dica:'Comece sempre pelo número maior e conte para frente.'},
 [
  ()=>{const a=R(2,10),b=R(2,10);return inp(a+' + '+b+' = ?',a+b);},
  ()=>{const a=R(6,12),b=R(4,8);return inp(a+' + '+b+' = ?',a+b);},
  ()=>{const a=R(3,9),b=R(3,9);return mc('Quanto é '+a+' + '+b+'?',a+b,[a+b+1,a+b-1,a*b]);},
  ()=>{const a=R(3,9),t=R(12,20);return inp('___ + '+a+' = '+t,t-a);},
  ()=>{const a=R(4,9),b=R(4,9);return tf(a+' + '+b+' dá o mesmo que '+b+' + '+a+'.',true);},
  ()=>{const g=R(2,4),p=R(2,5),g2=R(2,4);return mc('Quantas bolinhas ao todo?',g*p+g2,[g*p,g*p+g2+1,g*p+g2-2],{figure:dots(g*p)+dots(g2,'alt2')});}
 ]),
L('2.2','++','Somar com dezenas',
 {ideia:'Para somar números maiores, some as unidades e depois as dezenas. Quando as unidades passam de 9, "vai um" para a dezena.',
  exemplo:'38 + 27 → 8 + 7 = 15 (escreve 5, vai 1). 3 + 2 + 1 = 6. Resultado: 65.',
  dica:'Também vale somar por partes: 38 + 20 = 58, depois 58 + 7 = 65.'},
 [
  ()=>{const a=R(11,44),b=R(11,44);return inp(a+' + '+b+' = ?',a+b);},
  ()=>{const a=R(25,79),b=R(15,49);return inp(a+' + '+b+' = ?',a+b);},
  ()=>{const a=R(2,9)*10,b=R(2,9)*10;return mc(a+' + '+b+' = ?',a+b,[a+b+10,a+b-10,a+b+100]);},
  ()=>{const a=R(20,70),b=R(20,70);return mc('Quanto é '+a+' + '+b+'?',a+b,[a+b+10,a+b-1,a+b+1]);},
  ()=>{const a=R(30,80),t=a+R(20,60);return inp(a+' + ___ = '+t,t-a);},
  ()=>{const [n1]=nome2();const a=R(23,68),b=R(14,39);return inp(n1+' tinha '+a+' figurinhas e ganhou mais '+b+'. Com quantas ficou?',a+b);}
 ]),
L('2.3','−','Subtrair',
 {ideia:'Subtrair é tirar, ou descobrir a diferença entre dois números. Quando a unidade de cima é menor, pedimos 10 emprestado da dezena.',
  exemplo:'52 − 27 → 2 é menor que 7, então pega 10 emprestado: 12 − 7 = 5. Sobra 4 dezenas: 4 − 2 = 2. Resultado: 25.',
  dica:'Confira somando de volta: 25 + 27 = 52. Se bater, acertou.'},
 [
  ()=>{const a=R(10,20),b=R(2,9);return inp(a+' − '+b+' = ?',a-b);},
  ()=>{const a=R(30,99),b=R(11,29);return inp(a+' − '+b+' = ?',a-b);},
  ()=>{const b=R(12,38),d=R(13,45);return inp((b+d)+' − '+b+' = ?',d);},
  ()=>{const a=R(40,90),b=R(11,39);return mc('Quanto é '+a+' − '+b+'?',a-b,[a-b+10,a-b-1,a+b]);},
  ()=>{const a=R(30,80),r=R(10,25);return inp(a+' − ___ = '+(a-r),r);},
  ()=>{const [n1]=nome2();const a=R(40,90),b=R(12,35);return inp(n1+' tinha '+a+' reais e gastou '+b+'. Quanto sobrou?',a-b);}
 ]),
L('2.4','±','Contas até 1000',
 {ideia:'Com números maiores o método é o mesmo: alinhe unidade com unidade, dezena com dezena, centena com centena.',
  exemplo:'347 + 265 = 612. E 500 − 168 = 332.',
  dica:'Para subtrair de números redondos (como 500), pense: 500 − 168 é o mesmo que 499 − 168 + 1. Some 1 no fim e não precisa emprestar.'},
 [
  ()=>{const a=R(120,480),b=R(120,480);return inp(a+' + '+b+' = ?',a+b);},
  ()=>{const a=R(300,900),b=R(110,290);return inp(a+' − '+b+' = ?',a-b);},
  ()=>{const a=R(2,9)*100,b=R(110,Math.min(390,a-10));return inp(a+' − '+b+' = ?',a-b);},
  ()=>{const a=R(150,450),b=R(150,450),c=R(20,90);return inp(a+' + '+b+' − '+c+' = ?',a+b-c);},
  ()=>{const a=R(200,700);const b=R(120,280);return mc('Quanto é '+a+' + '+b+'?',a+b,[a+b+100,a+b-10,a+b+10]);},
  ()=>{const a=R(300,800),t=a+R(100,190);return inp(a+' + ___ = '+t,t-a);}
 ]),
L('2.5','?','Problemas do dia a dia',
 {ideia:'Num problema, a pergunta indica a conta. Palavras como “ao todo”, “juntos” pedem soma; “sobrou”, “a mais que”, “quanto falta” pedem subtração.',
  exemplo:'“Tinha 45, gastou 18, quanto sobrou?” → 45 − 18 = 27.',
  dica:'Leia duas vezes, sublinhe os números e só então escolha a conta.'},
 [
  ()=>{const[n1,n2]=nome2();const a=R(15,60),b=R(15,60);return inp(n1+' leu '+a+' páginas e '+n2+' leu '+b+'. Quantas páginas os dois leram ao todo?',a+b);},
  ()=>{const[n1,n2]=nome2();const a=R(40,90),b=R(10,35);return inp(n1+' tem '+a+' bolinhas de gude e '+n2+' tem '+b+'. Quantas '+n1+' tem <b>a mais</b>?',a-b);},
  ()=>{const[n1]=nome2();const a=R(25,60),b=R(10,20),c=R(5,15);return inp(n1+' tinha '+a+' adesivos, ganhou '+b+' e deu '+c+' para um amigo. Com quantos ficou?',a+b-c);},
  ()=>{const p=R(12,40),t=R(60,120);return inp('Um livro tem '+t+' páginas. Já foram lidas '+p+'. Quantas faltam?',t-p);},
  ()=>{const a=R(3,9),b=R(3,9),c=R(3,9);return inp('Numa caixa há '+a+' bolas azuis, '+b+' vermelhas e '+c+' verdes. Quantas bolas há ao todo?',a+b+c);},
  ()=>{const[n1]=nome2();const a=R(30,80),g=R(15,40);return mc(n1+' precisa juntar '+(a+g)+' reais e já tem '+a+'. Qual conta resolve o problema?',(a+g)+' − '+a,[(a+g)+' + '+a,a+' − '+(a+g)]);}
 ])
]});

/* ============ UNIDADE 3 ============ */
UNITS_MAT.push({n:3,title:'Multiplicação',sub:'Somar várias vezes o mesmo número, de um jeito bem mais rápido.',tone:'ambar',lessons:[
L('3.1','×','A ideia de multiplicar',
 {ideia:'Multiplicar é somar grupos iguais. “4 × 3” significa 4 grupos de 3.',
  exemplo:'4 × 3 = 3 + 3 + 3 + 3 = 12.',
  dica:'A ordem não muda o resultado: 4 × 3 = 3 × 4. Isso corta a tabuada quase pela metade.'},
 [
  ()=>{const g=R(2,5),p=R(2,6);return mc('Quantas bolinhas ao todo?',g*p,[g*p+p,g+p,g*p-p],{figure:groups(g,p)});},
  ()=>{const g=R(2,4),p=R(2,5);return grupoQ('Monte <b>'+g+' grupos de '+p+'</b> e veja quanto dá.',g,p);},
  ()=>{const g=R(3,5),p=R(2,4);return grupoQ('Monte '+g+' × '+p+' com as caixinhas.',g,p);},
  ()=>{const g=R(2,6),p=R(2,6);return inp(g+' grupos de '+p+' é igual a quanto?',g*p);},
  ()=>{const a=R(2,6);return mc('Qual soma é a mesma coisa que '+a+' × 4?',Array(a).fill(4).join(' + '),[Array(4).fill(a+1).join(' + '),a+' + 4']);},
  ()=>{const a=R(2,9),b=R(2,9);return tf(a+' × '+b+' dá o mesmo resultado que '+b+' × '+a+'.',true);},
  ()=>{const a=R(2,9);return inp(a+' × 1 = ?',a);},
  ()=>{const a=R(2,9);return inp(a+' × 0 = ?',0);}
 ]),
L('3.2','2×','Tabuada do 2 ao 5',
 {ideia:'Multiplicar por 2 é dobrar. Por 4 é dobrar duas vezes. Por 5, o resultado sempre termina em 0 ou 5.',
  exemplo:'7 × 4 → dobro de 7 é 14, dobro de 14 é 28.',
  dica:'Para o 5, faça × 10 e divida por 2: 8 × 5 = 80 ÷ 2 = 40.'},
 [
  ()=>{const a=R(2,5),b=R(2,10);return inp(a+' × '+b+' = ?',a*b);},
  ()=>{const b=R(2,10);return inp('2 × '+b+' = ?',2*b);},
  ()=>{const b=R(2,10);return inp('5 × '+b+' = ?',5*b);},
  ()=>{const g=R(2,5),p=R(2,5);return grupoQ('Monte '+g+' grupos de '+p+' e diga o total.',g,p);},
  ()=>{const a=R(2,5),b=R(3,10);return mc('Quanto é '+a+' × '+b+'?',a*b,[a*b+a,a*b-a,a+b]);},
  ()=>{const a=R(2,5),b=R(3,9);return inp(a+' × ___ = '+(a*b),b);},
  ()=>{const b=R(3,9);return inp('O dobro de '+b+' é?',2*b);}
 ]),
L('3.3','9×','Tabuada do 6 ao 9',
 {ideia:'As tabuadas mais temidas têm atalhos. A do 9: os algarismos do resultado sempre somam 9.',
  exemplo:'9 × 6 = 54 (5 + 4 = 9). E 6 × 8 = 48, que é o dobro de 3 × 8 = 24.',
  dica:'Não sabe 7 × 8? Faça 7 × 4 = 28 e dobre: 56.'},
 [
  ()=>{const a=R(6,9),b=R(2,10);return inp(a+' × '+b+' = ?',a*b);},
  ()=>{const b=R(2,10);return inp('9 × '+b+' = ?',9*b);},
  ()=>{const b=R(3,9);return inp('7 × '+b+' = ?',7*b);},
  ()=>{const a=R(6,9),b=R(4,9);return mc('Quanto é '+a+' × '+b+'?',a*b,[a*b+a,a*b-b,a*b+10]);},
  ()=>{const a=R(6,9),b=R(3,9);return inp('___ × '+b+' = '+(a*b),a);},
  ()=>{const a=R(6,9);return inp(a+' × '+a+' = ?',a*a);}
 ]),
L('3.4','×10','Multiplicar por 10, 100 e 1000',
 {ideia:'Multiplicar por 10 empurra o número uma casa para a esquerda e coloca um zero no fim. Por 100, dois zeros. Por 1000, três.',
  exemplo:'34 × 10 = 340. E 34 × 100 = 3400.',
  dica:'Para multiplicar por 20, faça × 2 e depois × 10.'},
 [
  ()=>{const a=R(3,99);return inp(a+' × 10 = ?',a*10);},
  ()=>{const a=R(3,99);return inp(a+' × 100 = ?',a*100);},
  ()=>{const a=R(2,20);return inp(a+' × 1000 = ?',a*1000);},
  ()=>{const a=R(3,15);return mc('Quanto é '+a+' × 20?',a*20,[a*2,a*200,a*20+10]);},
  ()=>{const a=R(2,9);return inp(a+'00 × 3 = ?',a*300);},
  ()=>{const a=R(4,40);return mc('Quantas vezes '+a+' cabe em '+(a*100)+'?',100,[10,1000,a]);}
 ]),
L('3.5','××','Multiplicação com 2 algarismos',
 {ideia:'Para multiplicar por um número de dois algarismos, quebre em partes: multiplique pela dezena, depois pela unidade, e some.',
  exemplo:'23 × 14 = (23 × 10) + (23 × 4) = 230 + 92 = 322.',
  dica:'Quebrar em partes funciona sempre e evita erro de "vai um".'},
 [
  ()=>{const a=R(11,39),b=R(3,9);return inp(a+' × '+b+' = ?',a*b);},
  ()=>{const a=R(12,29),b=R(11,19);return inp(a+' × '+b+' = ?',a*b);},
  ()=>{const a=R(21,49),b=R(4,8);return mc('Quanto é '+a+' × '+b+'?',a*b,[a*b+b,a*b-a,a*b+10]);},
  ()=>{const a=R(12,25);return mc('Qual conta é igual a '+a+' × 12?',(a*10)+' + '+(a*2),[(a*10)+' + '+a,(a*12)+' + '+a]);},
  ()=>{const p=R(6,15),c=R(12,30);return inp('Uma caixa tem '+p+' lápis. Quantos lápis há em '+c+' caixas?',p*c);},
  ()=>{const l=R(6,14),c=R(5,12);return inp('Uma sala tem '+l+' fileiras com '+c+' cadeiras cada. Quantas cadeiras ao todo?',l*c);}
 ])
]});

/* ============ UNIDADE 4 ============ */
UNITS_MAT.push({n:4,title:'Divisão',sub:'Repartir em partes iguais, com ou sem sobra.',tone:'coral',lessons:[
L('4.1','÷','Repartir em partes iguais',
 {ideia:'Dividir é repartir uma quantidade em partes iguais. “12 ÷ 3” pergunta: quanto cabe em cada uma das 3 partes?',
  exemplo:'12 balas para 3 crianças → cada uma fica com 4. Então 12 ÷ 3 = 4.',
  dica:'Divisão é a conta inversa da multiplicação: se 3 × 4 = 12, então 12 ÷ 3 = 4.'},
 [
  ()=>{const g=R(2,5),p=R(2,6);return inp((g*p)+' bolinhas repartidas igualmente em '+g+' grupos. Quantas em cada grupo?',p,{figure:groups(g,p)});},
  ()=>{const c=R(2,6),q=R(2,8);return inp(''+(c*q)+' balas divididas entre '+c+' crianças. Quantas para cada uma?',q);},
  ()=>{const a=R(2,9),b=R(2,9);return mc('Se '+a+' × '+b+' = '+(a*b)+', quanto é '+(a*b)+' ÷ '+a+'?',b,[a,a*b,b+1]);},
  ()=>{const a=R(2,9);return inp(a+' ÷ 1 = ?',a);},
  ()=>{const a=R(2,9);return inp(a+' ÷ '+a+' = ?',1);},
  ()=>{const p=R(3,8);return tf('Dividir '+(p*2)+' por 2 dá o mesmo que achar a metade de '+(p*2)+'.',true);}
 ]),
L('4.2','÷÷','Divisões exatas',
 {ideia:'Uma divisão é exata quando não sobra nada. Para resolver, pense na tabuada ao contrário.',
  exemplo:'56 ÷ 8 → “8 vezes quanto dá 56?” → 7.',
  dica:'Se travar, vá testando: 8 × 5 = 40, 8 × 6 = 48, 8 × 7 = 56. Achou.'},
 [
  ()=>{const a=R(2,9),b=R(2,10);return inp((a*b)+' ÷ '+a+' = ?',b);},
  ()=>{const a=R(6,9),b=R(3,9);return inp((a*b)+' ÷ '+b+' = ?',a);},
  ()=>{const a=R(2,9),b=R(4,9);return mc('Quanto é '+(a*b)+' ÷ '+a+'?',b,[b+1,b-1,a]);},
  ()=>{const a=R(3,9);return inp((a*10)+' ÷ 10 = ?',a);},
  ()=>{const a=R(2,9),b=R(2,9);return inp('___ ÷ '+a+' = '+b,a*b);},
  ()=>{const a=R(11,49),b=R(2,5);return inp((a*b)+' ÷ '+b+' = ?',a);}
 ]),
L('4.3','r','Divisão com resto',
 {ideia:'Quando não dá para repartir tudo igualmente, o que sobra é o <b>resto</b>. O resto é sempre menor que o divisor.',
  exemplo:'17 ÷ 5 → 5 × 3 = 15, sobram 2. Quociente 3, resto 2.',
  dica:'Confira: quociente × divisor + resto = número original. 3 × 5 + 2 = 17.'},
 [
  ()=>{const d=R(3,9),q=R(2,9),r=R(1,d-1);return inp('Quanto é '+(d*q+r)+' ÷ '+d+'? (escreva só o <b>quociente</b>)',q);},
  ()=>{const d=R(3,9),q=R(2,9),r=R(1,d-1);return inp('Na divisão '+(d*q+r)+' ÷ '+d+', qual é o <b>resto</b>?',r);},
  ()=>{const d=R(4,9),q=R(2,8),r=R(1,d-1);return mc('Qual é o resto de '+(d*q+r)+' ÷ '+d+'?',r,[r+1,d-r===r?d-1:d-r,0]);},
  ()=>{const c=R(3,7),t=c*R(3,8)+R(1,c-1);return inp(t+' figurinhas repartidas entre '+c+' amigos: quantas sobram?',t%c);},
  ()=>{const d=R(3,9),q=R(2,9);return tf('A divisão '+(d*q)+' ÷ '+d+' é exata (resto zero).',true);},
  ()=>{const d=R(4,9),q=R(2,9),r=R(1,d-1);return tf('Numa divisão por '+d+', o resto pode ser '+d+'.',false);}
 ]),
L('4.4','½','Dobro, metade, triplo e terça parte',
 {ideia:'Dobro é × 2 e metade é ÷ 2. Triplo é × 3 e a terça parte é ÷ 3. São operações inversas.',
  exemplo:'O dobro de 14 é 28; a metade de 14 é 7. O triplo de 9 é 27; a terça parte de 9 é 3.',
  dica:'Metade de número ímpar não é inteira: metade de 7 é 3,5.'},
 [
  ()=>{const a=R(6,40);return inp('Qual é o dobro de '+a+'?',a*2);},
  ()=>{const a=R(4,40)*2;return inp('Qual é a metade de '+a+'?',a/2);},
  ()=>{const a=R(3,20);return inp('Qual é o triplo de '+a+'?',a*3);},
  ()=>{const a=R(2,15)*3;return inp('Qual é a terça parte de '+a+'?',a/3);},
  ()=>{const a=R(5,30)*4;return mc('Qual é a quarta parte de '+a+'?',a/4,[a/2,a*4,a/4+1]);},
  ()=>{const a=R(4,20)*2;return tf('A metade de '+a+' é '+(a/2)+'.',true);}
 ]),
L('4.5','p','Múltiplos, divisores e primos',
 {ideia:'Múltiplos de um número são os resultados da sua tabuada. Divisores são os números que o dividem sem deixar resto. Número <b>primo</b> tem exatamente dois divisores: 1 e ele mesmo.',
  exemplo:'Múltiplos de 4: 4, 8, 12, 16... Divisores de 12: 1, 2, 3, 4, 6, 12. Primos: 2, 3, 5, 7, 11, 13...',
  dica:'1 não é primo, só tem um divisor. E 2 é o único primo par.'},
 [
  ()=>{const a=R(2,9),k=R(3,9);return tf(''+(a*k)+' é múltiplo de '+a+'.',true);},
  ()=>{const a=R(3,9),k=R(3,9);return tf(''+(a*k+1)+' é múltiplo de '+a+'.',false);},
  ()=>{const p=pick([2,3,5,7,11,13,17,19,23]);const c=pick([4,6,8,9,10,12,14,15,21]);return mc('Qual destes é um número <b>primo</b>?',p,[c,c+1===p?c+2:c+1,9]);},
  ()=>{const n=pick([12,18,20,24,30,36]);const divs=[];for(let i=1;i<=n;i++)if(n%i===0)divs.push(i);return inp('Quantos divisores tem o número '+n+'?',divs.length);},
  ()=>{const a=R(2,9);return mc('Qual destes é múltiplo de '+a+'?',a*R(4,9),[a*4+1,a*5+2]);},
  ()=>{const a=pick([6,8,9,10,12,15]);return tf('O número '+a+' é primo.',false);}
 ])
]});

/* ============ UNIDADE 5 ============ */
const fracBar=(a,b)=>'<div class="fbar">'+Array.from({length:b},(_,i)=>'<span class="'+(i<a?'on':'')+'"></span>').join('')+'</div>';
UNITS_MAT.push({n:5,title:'Frações',sub:'Pedaços do inteiro: metade, um terço, três quartos.',tone:'roxo',lessons:[
L('5.1','½','O que é uma fração',
 {ideia:'Fração é um inteiro dividido em partes iguais. O número de baixo (<b>denominador</b>) diz em quantas partes o inteiro foi cortado. O de cima (<b>numerador</b>) diz quantas partes você pegou.',
  exemplo:'Uma pizza cortada em 4 fatias iguais; você comeu 3 → você comeu '+frac(3,4)+' da pizza.',
  dica:'Quanto maior o denominador, menores são os pedaços: '+frac(1,8)+' é menor que '+frac(1,4)+'.'},
 [
  ()=>{const b=pick([3,4,5,6,8]),a=R(1,b-1);return mc('Que fração está pintada?',frac(a,b),[frac(b-a,b),frac(a,b+1),frac(a+1,b)],{figure:fracBar(a,b)});},
  ()=>{const b=pick([4,5,6,8]),a=R(1,b-1);return fracQ('Toque para pintar <b>'+a+' de '+b+'</b> partes da barra.',a,b);},
  ()=>{const b=pick([4,6,8]);return fracQ('Pinte <b>metade</b> da barra.',b/2,b);},
  ()=>{const b=pick([4,5,6,8,10]),a=R(1,b-1);return inp('Na fração '+frac(a,b)+', qual é o <b>denominador</b>?',b);},
  ()=>{const b=pick([4,5,6,8,10]),a=R(1,b-1);return inp('Na fração '+frac(a,b)+', qual é o <b>numerador</b>?',a);},
  ()=>{const b=pick([3,4,5,6,8,10]);return mc('Uma barra foi cortada em '+b+' partes iguais e você pegou todas. Que fração é essa?',frac(b,b)+' (o inteiro)',[frac(1,b),frac(b,1)]);},
  ()=>{const b=pick([4,6,8,10]);return tf(frac(1,b)+' é maior que '+frac(1,b/2)+'.',false);},
  ()=>{const b=pick([3,5,7,9]);return mc('Qual fração representa <b>metade</b> do inteiro?',frac(1,2),[frac(1,3),frac(2,1),frac(1,4)]);}
 ]),
L('5.2','=','Frações equivalentes',
 {ideia:'Frações diferentes podem valer a mesma coisa. Multiplicando (ou dividindo) o de cima e o de baixo pelo mesmo número, o valor não muda.',
  exemplo:frac(1,2)+' = '+frac(2,4)+' = '+frac(3,6)+' = '+frac(50,100)+'. Todas valem metade.',
  dica:'Simplificar é dividir os dois pelo mesmo número até não dar mais.'},
 [
  ()=>{const b=pick([2,3,4,5]),a=R(1,b-1),k=R(2,4);return mc('Qual fração é equivalente a '+frac(a,b)+'?',frac(a*k,b*k),[frac(a+k,b+k),frac(a*k,b),frac(a,b*k)]);},
  ()=>{const b=pick([6,8,10]);return fracQ('Pinte '+frac(1,2)+' da barra: quantas das '+b+' partes você precisa pintar?',b/2,b);},
  ()=>{const b=pick([2,3,4,5]),a=R(1,b-1),k=R(2,5);return inp('Complete: '+frac(a,b)+' = '+frac('?',b*k)+' → qual é o numerador que falta?',a*k);},
  ()=>{const b=pick([2,3,4,5]),a=R(1,b-1),k=R(2,5);return mc('Simplifique a fração '+frac(a*k,b*k)+'.',frac(a,b),[frac(a*k,b),frac(a,b*k),frac(b,a)]);},
  ()=>{const k=R(2,6);return tf(frac(1,2)+' é equivalente a '+frac(k,2*k)+'.',true);},
  ()=>{const b=pick([3,4,5]),a=R(1,b-1);return tf(frac(a,b)+' é equivalente a '+frac(a+1,b+1)+'.',false);},
  ()=>{return mc('Qual destas frações vale <b>um inteiro</b>?',frac(5,5),[frac(5,1),frac(1,5),frac(4,5)]);}
 ]),
L('5.3','<>','Comparar frações',
 {ideia:'Com o mesmo denominador, ganha quem tem o numerador maior. Com o mesmo numerador, ganha quem tem o denominador <b>menor</b> (pedaços maiores).',
  exemplo:frac(3,7)+' &lt; '+frac(5,7)+'. E '+frac(2,3)+' &gt; '+frac(2,9)+'.',
  dica:'Denominadores diferentes? Deixe os dois iguais primeiro, usando frações equivalentes.'},
 [
  ()=>{const b=pick([7,8,9,10]);const ns=shuf([1,2,3,4,5,6,7,8,9].filter(x=>x<b)).slice(0,3).sort((x,y)=>x-y);return mc('Qual fração é maior?',frac(ns[2],b),[frac(ns[0],b),frac(ns[1],b)]);},
  ()=>{const a=R(1,3);const ds=shuf([4,5,6,8,9,10,12].filter(x=>x>a)).slice(0,3).sort((x,y)=>x-y);return mc('Qual fração é maior?',frac(a,ds[0]),[frac(a,ds[1]),frac(a,ds[2])]);},
  ()=>{const b=pick([4,6,8,10]);const a=R(1,b/2-1);return mc('Qual sinal completa?  '+frac(a,b)+' ___ '+frac(1,2),'<',['>','=']);},
  ()=>{const b=pick([4,6,8,10]);const a=R(b/2+1,b-1);return mc('Qual sinal completa?  '+frac(a,b)+' ___ '+frac(1,2),'>',['<','=']);},
  ()=>{const b=pick([3,4,5,6]);return tf(frac(1,b)+' é menor que '+frac(1,b+2)+'.',false);},
  ()=>{const b=pick([5,7,9]);const a=R(2,b-1);return tf(frac(a,b)+' é menor que 1.',true);}
 ]),
L('5.4','+½','Somar e subtrair frações',
 {ideia:'Com o mesmo denominador, some (ou subtraia) só os numeradores e mantenha o de baixo.',
  exemplo:frac(2,7)+' + '+frac(3,7)+' = '+frac(5,7)+'. E '+frac(5,8)+' − '+frac(2,8)+' = '+frac(3,8)+'.',
  dica:'Denominadores diferentes? Transforme um deles: '+frac(1,2)+' + '+frac(1,4)+' = '+frac(2,4)+' + '+frac(1,4)+' = '+frac(3,4)+'.'},
 [
  ()=>{const b=pick([5,6,7,8,9,10]),a=R(1,b-2),c=R(1,b-a-1);return mc(frac(a,b)+' + '+frac(c,b)+' = ?',frac(a+c,b),[frac(a+c,b+b),frac(a*c,b),frac(a+c,b-1)]);},
  ()=>{const b=pick([5,6,7,8,9,10]),a=R(2,b-1),c=R(1,a-1);return mc(frac(a,b)+' − '+frac(c,b)+' = ?',frac(a-c,b),[frac(a-c,0+b+1),frac(a+c,b),frac(c-a+b,b)]);},
  ()=>{const b=pick([4,6,8,10]);return mc(frac(1,2)+' + '+frac(1,b)+' = ?',frac(b/2+1,b),[frac(2,b+2),frac(1,b+2),frac(b/2,b)]);},
  ()=>{const b=pick([3,4,5,6,8]);const a=R(1,b-1);return mc(frac(a,b)+' + '+frac(b-a,b)+' = ?','1 inteiro',[frac(b,b*2),frac(b,1)]);},
  ()=>{const b=pick([4,5,6,8]);const a=R(1,b-1);return inp('Se '+frac(a,b)+' de um bolo foi comido, quantos '+b+' avos sobraram? (escreva só o número de cima)',b-a);},
  ()=>{const b=pick([6,8,10]);const a=R(2,b-2);return tf(frac(a,b)+' + '+frac(1,b)+' = '+frac(a+1,b)+'.',true);}
 ]),
L('5.5','⅗','Fração de uma quantidade',
 {ideia:'Para achar uma fração de uma quantidade: divida pelo número de baixo e multiplique pelo de cima.',
  exemplo:frac(3,4)+' de 20 → 20 ÷ 4 = 5, depois 5 × 3 = 15.',
  dica:'É assim que se calcula desconto, gorjeta e divisão de conta.'},
 [
  ()=>{const b=pick([2,3,4,5]),a=R(1,b-1),k=R(3,12);return inp('Quanto é '+frac(a,b)+' de '+(b*k)+'?',a*k);},
  ()=>{const b=pick([4,6,8]),a=R(1,b-1);return fracQ('Pinte '+frac(a,b)+' da barra.',a,b);},
  ()=>{const k=R(6,40);return inp('Quanto é a metade de '+(k*2)+'?',k);},
  ()=>{const b=pick([3,4,5]),k=R(4,15);return inp('Quanto é '+frac(1,b)+' de '+(b*k)+'?',k);},
  ()=>{const b=pick([2,4,5]),a=b-1,k=R(4,12);return mc('Quanto é '+frac(a,b)+' de '+(b*k)+'?',a*k,[k,b*k-a,a*k+b]);},
  ()=>{const b=pick([3,4]),k=R(5,15);const[n1]=nome2();return inp(n1+' tinha '+(b*k)+' figurinhas e deu '+frac(1,b)+' delas. Quantas deu?',k);},
  ()=>{const k=R(4,10);return inp('Numa turma de '+(k*4)+' alunos, '+frac(3,4)+' foram ao passeio. Quantos foram?',k*3);}
 ])
]});

/* ============ UNIDADE 6 ============ */
UNITS_MAT.push({n:6,title:'Decimais e dinheiro',sub:'A vírgula, o real e o centavo, matemática do mercado.',tone:'agua',lessons:[
L('6.1',',','Décimos e centésimos',
 {ideia:'A vírgula separa a parte inteira da parte quebrada. A primeira casa depois da vírgula são os <b>décimos</b> ('+frac(1,10)+'), a segunda são os <b>centésimos</b> ('+frac(1,100)+').',
  exemplo:'2,45 = 2 inteiros + 4 décimos + 5 centésimos. E 0,5 é o mesmo que '+frac(1,2)+'.',
  dica:'0,5 = metade; 0,25 = um quarto; 0,75 = três quartos. Vale decorar esses três.'},
 [
  ()=>{const d=R(1,9);return mc('Como se escreve '+frac(d,10)+' em número decimal?','0,'+d,[''+d+',0','0,0'+d]);},
  ()=>{const c=R(11,99);return mc('Como se escreve '+frac(c,100)+' em número decimal?','0,'+c,['0,0'+c,''+c+',00']);},
  ()=>{return mc('Qual decimal é igual a '+frac(1,2)+'?','0,5',['0,2','0,15','5,0']);},
  ()=>{return mc('Qual decimal é igual a '+frac(1,4)+'?','0,25',['0,4','0,14','4,0']);},
  ()=>{const i=R(1,9),d=R(1,9);return inp('No número '+i+','+d+' , qual é a parte inteira?',i);},
  ()=>{const i=R(1,9),d=R(1,9),c=R(1,9);return mc('No número '+i+','+d+c+' , quantos <b>centésimos</b> aparecem na última casa?',c,[d,i]);}
 ]),
L('6.2','0,5','Comparar decimais',
 {ideia:'Compare primeiro a parte inteira. Se empatar, compare casa por casa depois da vírgula. Zeros no fim não mudam o valor: 0,5 = 0,50.',
  exemplo:'0,7 e 0,25 → 7 décimos é mais que 2 décimos, então 0,7 &gt; 0,25.',
  dica:'Cuidado com a armadilha: 0,25 <b>não</b> é maior que 0,7 só por ter mais algarismos.'},
 [
  ()=>{const a=R(1,9)/10,b=R(10,99)/100;const A=r2(a),B=r2(b);if(A===B)return mc('Qual é maior?','0,9',['0,45']);return mc('Qual é maior?',fmt(Math.max(A,B)),[fmt(Math.min(A,B))]);},
  ()=>{const a=r2(R(10,49)/10),b=r2(R(50,99)/10);return mc('Qual sinal completa?  '+fmt(a)+' ___ '+fmt(b),'<',['>','=']);},
  ()=>{const d=R(1,9);return tf('0,'+d+' é igual a 0,'+d+'0.',true);},
  ()=>{const a=R(1,9);return tf('0,'+a+'5 é maior que 0,'+a+'.',true);},
  /* começa em 2,1 (era 1,1): com 1,1 o distrator de baixo virava -0,5 e a criança
     via um número negativo numa aula de decimais, conteúdo que ela ainda não viu */
  ()=>{const a=r2(R(21,89)/10);return mc('Qual é o número decimal mais próximo de '+Math.round(a)+'?',fmt(a),[fmt(r2(a+1.4)),fmt(r2(a-1.6))]);},
  ()=>{return mc('Coloque em ordem crescente: 0,3; 0,03; 0,33','0,03 &lt; 0,3 &lt; 0,33',['0,3 &lt; 0,03 &lt; 0,33','0,33 &lt; 0,3 &lt; 0,03']);}
 ]),
L('6.3','+,','Somar e subtrair decimais',
 {ideia:'Alinhe as vírgulas uma embaixo da outra. Se faltar casa, complete com zero. Depois some ou subtraia normalmente.',
  exemplo:'3,40 + 1,25 = 4,65. E 5,00 − 2,30 = 2,70.',
  dica:'Vírgula embaixo de vírgula. Esse é o segredo inteiro.'},
 [
  ()=>{const a=r2(R(10,90)/10),b=r2(R(10,90)/10);return inp(fmt(a)+' + '+fmt(b)+' = ?',fmt(r2(a+b)));},
  ()=>{const v=r2(R(3,28)/2);return dinQ('Monte <b>'+money(v)+'</b> com as notas e moedas.',fmt(v));},
  ()=>{const a=r2(R(100,900)/100),b=r2(R(100,900)/100);return inp(fmt(a)+' + '+fmt(b)+' = ?',fmt(r2(a+b)));},
  ()=>{const a=r2(R(50,99)/10),b=r2(R(10,49)/10);return inp(fmt(a)+' − '+fmt(b)+' = ?',fmt(r2(a-b)));},
  ()=>{const a=R(4,9),b=r2(R(105,395)/100);return inp(a+',00 − '+fmt(b)+' = ?',fmt(r2(a-b)));},
  ()=>{const a=r2(R(10,90)/10);return mc('Quanto é '+fmt(a)+' + 0,5?',fmt(r2(a+0.5)),[fmt(r2(a+5)),fmt(r2(a+0.05))]);},
  ()=>{const a=r2(R(15,45)/10);return inp('Quanto falta para '+fmt(a)+' chegar a 10?',fmt(r2(10-a)));}
 ]),
L('6.4','R$','Dinheiro e troco',
 {ideia:'No real, os centavos são as duas casas depois da vírgula. Troco é o que sobra: pagou menos o valor da compra.',
  exemplo:'Comprou algo de R$ 13,50 e pagou com R$ 20,00 → troco de R$ 6,50.',
  dica:'Arredonde para conferir: 13,50 é quase 14; 20 − 14 = 6. O troco tem que dar perto disso.'},
 [
  ()=>{const p=r2(R(150,1800)/100),pg=pick([20,50,100]);if(pg<=p)return inp('Preço R$ 12,50, pagou com R$ 20,00. Qual o troco? (só o número)',fmt(7.5));return inp('A compra deu '+money(p)+' e você pagou com '+money(pg)+'. Qual é o troco? (escreva só o número, ex.: 6,50)',fmt(r2(pg-p)));},
  ()=>{const a=r2(R(150,900)/100),b=r2(R(150,900)/100);return inp('Dois produtos: '+money(a)+' e '+money(b)+'. Qual o total? (só o número)',fmt(r2(a+b)));},
  ()=>{const u=r2(R(150,600)/100),q=R(2,5);return inp('Cada caderno custa '+money(u)+'. Quanto custam '+q+' cadernos? (só o número)',fmt(r2(u*q)));},
  ()=>{const t=r2(R(200,900)/100),n=pick([2,4,5]);return inp('A conta de '+money(t*n)+' foi dividida entre '+n+' pessoas. Quanto cada uma paga? (só o número)',fmt(r2(t)));},
  ()=>{const p=r2(R(300,900)/100);return mc('Você tem '+money(p)+' e o lanche custa '+money(r2(p+2.5))+'. O que acontece?','Falta dinheiro',['Sobra dinheiro','Dá exato']);},
  ()=>{const c=R(3,9);return inp('Quantas moedas de 50 centavos formam '+money(c*0.5)+'? ',c);},
  ()=>{const v=r2(R(5,40)/2);return dinQ('Monte <b>'+money(v)+'</b> para pagar a feira.',fmt(v));}
 ]),
L('6.5','×,','Decimais por 10 e por 100',
 {ideia:'Multiplicar por 10 anda com a vírgula uma casa para a <b>direita</b>. Dividir por 10 anda uma casa para a <b>esquerda</b>.',
  exemplo:'3,4 × 10 = 34. E 3,4 ÷ 10 = 0,34.',
  dica:'× 100 anda duas casas; ÷ 100 anda duas casas para o outro lado.'},
 [
  ()=>{const a=r2(R(11,99)/10);return inp(fmt(a)+' × 10 = ?',fmt(r2(a*10)));},
  ()=>{const a=r2(R(101,999)/100);return inp(fmt(a)+' × 100 = ?',fmt(r2(a*100)));},
  ()=>{const a=R(11,99);return inp(a+' ÷ 10 = ?',fmt(r2(a/10)));},
  ()=>{const a=R(110,990);return inp(a+' ÷ 100 = ?',fmt(r2(a/100)));},
  ()=>{const a=r2(R(11,99)/10);return mc('Quanto é '+fmt(a)+' × 2?',fmt(r2(a*2)),[fmt(r2(a*20)),fmt(r2(a+2))]);},
  ()=>{const a=r2(R(20,90)/10);return mc('Quanto é '+fmt(a)+' ÷ 2?',fmt(r2(a/2)),[fmt(r2(a*2)),fmt(r2(a-2))]);}
 ])
]});

/* ============ UNIDADE 7 ============ */
UNITS_MAT.push({n:7,title:'Porcentagem e proporção',sub:'Descontos, aumentos e o famoso “regra de três”.',tone:'ambar',lessons:[
L('7.1','%','O que é porcentagem',
 {ideia:'Por cento significa “de cada cem”. 25% é o mesmo que '+frac(25,100)+' , ou 0,25.',
  exemplo:'50% = metade. 100% = tudo. 10% = a décima parte.',
  dica:'Para achar 1% de um número, divida por 100. O resto é multiplicação.'},
 [
  ()=>{const p=pick([10,20,25,50,75]);return mc(''+p+'% é igual a qual fração?',frac(p,100),[frac(100,p),frac(p,10)]);},
  ()=>{const p=pick([10,20,25,50,75,5]);return mc(''+p+'% é igual a qual decimal?',fmt(r2(p/100)),[fmt(r2(p/10)),fmt(p)]);},
  ()=>{return mc('50% de um valor é o mesmo que...','a metade',['o dobro','a quarta parte']);},
  ()=>{const n=R(2,20)*100;return inp('Quanto é 1% de '+n+'?',n/100);},
  ()=>{return tf('100% de 80 é 80.',true);},
  ()=>{const n=R(3,30)*10;return inp('Quanto é 100% de '+n+'?',n);}
 ]),
L('7.2','10%','Calcular de cabeça',
 {ideia:'10% é dividir por 10. A partir daí quase tudo sai: 20% é o dobro de 10%, 5% é a metade de 10%, 25% é dividir por 4, 50% é dividir por 2.',
  exemplo:'10% de 240 = 24. Então 30% de 240 = 24 × 3 = 72.',
  dica:'30% de 50 é igual a 50% de 30. Trocar a ordem às vezes facilita muito.'},
 [
  ()=>{const n=R(3,40)*10;return inp('Quanto é 10% de '+n+'?',fmt(r2(n/10)));},
  ()=>{const n=R(2,20)*10;return inp('Quanto é 50% de '+n+'?',fmt(r2(n/2)));},
  ()=>{const n=R(2,20)*20;return inp('Quanto é 25% de '+n+'?',fmt(r2(n/4)));},
  ()=>{const n=R(3,30)*10;return inp('Quanto é 20% de '+n+'?',fmt(r2(n/5)));},
  ()=>{const n=R(4,20)*10,p=pick([30,40,60,70]);return mc('Quanto é '+p+'% de '+n+'?',r2(n*p/100),[r2(n*p/10),r2(n/p)]);},
  ()=>{const n=R(4,20)*20;return inp('Quanto é 75% de '+n+'?',fmt(r2(n*0.75)));}
 ]),
L('7.3','−%','Descontos e aumentos',
 {ideia:'Desconto: calcule a porcentagem e <b>subtraia</b> do preço. Aumento: calcule e <b>some</b>.',
  exemplo:'Camiseta de R$ 80 com 25% de desconto → 25% de 80 = 20 → paga R$ 60.',
  dica:'Atalho: com 25% de desconto você paga 75% do preço. Uma conta só.'},
 [
  ()=>{const p=R(2,10)*20,d=pick([10,20,25,50]);return inp('Um produto custa R$ '+p+' e está com '+d+'% de desconto. Quanto você paga? (só o número)',fmt(r2(p-p*d/100)));},
  ()=>{const p=R(4,20)*10,d=pick([10,20,50]);return inp('De quanto é o desconto, em reais, de '+d+'% sobre R$ '+p+'?',fmt(r2(p*d/100)));},
  ()=>{const p=R(4,20)*10,a=pick([10,20,50]);return inp('Um preço de R$ '+p+' subiu '+a+'%. Qual é o novo preço? (só o número)',fmt(r2(p+p*a/100)));},
  ()=>{const d=pick([10,20,25,40]);return mc('Com '+d+'% de desconto, você paga qual porcentagem do preço?',(100-d)+'%',[d+'%','100%']);},
  ()=>{const p=R(5,15)*20;return inp('Metade de R$ '+p+' é quanto? (é o mesmo que 50% de desconto)',fmt(r2(p/2)));},
  ()=>{const p=R(4,15)*10;return tf('Um desconto de 100% deixa o produto de graça.',true);}
 ]),
L('7.4',':','Razão e proporção',
 {ideia:'Razão compara duas quantidades. Proporção é quando duas razões são iguais, se uma cresce, a outra cresce junto na mesma medida.',
  exemplo:'Se 2 pães custam R$ 6, então 4 pães custam R$ 12. A razão preço/pão continua a mesma: 3.',
  dica:'Dobrou de um lado, dobra do outro. Triplicou, triplica.'},
 [
  ()=>{const u=R(2,9),q=R(2,5);return inp('Se '+q+' cadernos custam R$ '+(u*q)+', quanto custa 1 caderno?',u);},
  ()=>{const u=R(2,9),q=R(2,5),q2=q*2;return inp('Se '+q+' cadernos custam R$ '+(u*q)+', quanto custam '+q2+'?',u*q2);},
  ()=>{const a=R(2,6),b=a*R(2,4);return mc('A razão entre '+a+' e '+b+' é a mesma que entre...',(a*2)+' e '+(b*2),[(a+2)+' e '+(b+2),(a*2)+' e '+b]);},
  ()=>{const v=R(2,9);return inp('Uma receita para 4 pessoas usa '+(v*4)+' ovos. Quantos ovos para 8 pessoas?',v*8);},
  ()=>{const k=R(2,8);return inp('Um carro faz '+(k*10)+' km com 10 litros. Quantos km faz com 20 litros?',k*20);},
  ()=>{const a=R(2,5);return tf('Se 3 caixas pesam '+(a*3)+' kg, então 6 caixas pesam '+(a*6)+' kg.',true);}
 ]),
L('7.5','⇄','Regra de três',
 {ideia:'Monte as grandezas em duas colunas, multiplique em cruz e divida pelo que sobrou.',
  exemplo:'3 cadernos → R$ 21. 5 cadernos → x. Então x = (5 × 21) ÷ 3 = 35.',
  dica:'Antes de calcular, pergunte: aumentando um, o outro aumenta? Se sim, é direta, que é o caso da grande maioria.'},
 [
  ()=>{const u=R(3,9),a=R(2,4),b=R(5,9);return inp('Se '+a+' itens custam R$ '+(u*a)+', quanto custam '+b+' itens?',u*b);},
  ()=>{const v=R(2,8),h=R(2,5);return inp('Uma torneira enche '+(v*h)+' litros em '+h+' horas. Quantos litros em '+(h*3)+' horas?',v*h*3);},
  ()=>{const p=R(3,9),d=R(2,6);return inp(''+p+' pedreiros fazem um muro em '+(d*p)+' dias-trabalho. Quantos dias-trabalho para '+(p*2)+' pedreiros na mesma tarefa? (mesmo total de trabalho)',d*p);},
  ()=>{const km=R(20,80),l=R(2,5);return inp('Um carro faz '+(km*l)+' km com '+l+' litros. Quantos km faz com 1 litro?',km);},
  ()=>{const c=R(2,6),g=R(30,90);return inp('Se '+c+' pessoas comem '+(g*c)+' g de arroz, quanto comem '+(c+1)+' pessoas na mesma proporção?',g*(c+1));},
  ()=>{const a=R(2,5),b=R(6,10),u=R(2,7);return mc('Para achar o preço de '+b+' itens sabendo que '+a+' custam R$ '+(u*a)+', a conta é:','('+b+' × '+(u*a)+') ÷ '+a,['('+a+' × '+b+') ÷ '+(u*a),(u*a)+' ÷ ('+a+' × '+b+')']);}
 ])
]});

/* ============ UNIDADE 8 ============ */
const svgRect=(w,h,uw,uh)=>'<svg class="fig" viewBox="0 0 200 130" role="img"><rect x="30" y="25" width="140" height="70" rx="4" fill="var(--fig-fill)" stroke="var(--fig-line)" stroke-width="3"/><text x="100" y="18" text-anchor="middle" fill="var(--fig-text)" font-size="15">'+w+' '+(uw||'cm')+'</text><text x="182" y="64" text-anchor="middle" fill="var(--fig-text)" font-size="15">'+h+' '+(uh||'cm')+'</text></svg>';
const svgTri=(b,h)=>'<svg class="fig" viewBox="0 0 200 130" role="img"><polygon points="35,100 165,100 100,30" fill="var(--fig-fill)" stroke="var(--fig-line)" stroke-width="3"/><text x="100" y="120" text-anchor="middle" fill="var(--fig-text)" font-size="15">base '+b+' cm</text><text x="112" y="66" fill="var(--fig-text)" font-size="15">altura '+h+' cm</text></svg>';
const svgAng=(deg)=>{const r=70,rad=(180-deg)*Math.PI/180;const x=30+r*Math.cos(rad)*-1,y=105-r*Math.sin(rad);return '<svg class="fig" viewBox="0 0 200 130" role="img"><line x1="30" y1="105" x2="175" y2="105" stroke="var(--fig-line)" stroke-width="3"/><line x1="30" y1="105" x2="'+(30+r*Math.cos(deg*Math.PI/180)).toFixed(1)+'" y2="'+(105-r*Math.sin(deg*Math.PI/180)).toFixed(1)+'" stroke="var(--fig-line)" stroke-width="3"/><path d="M 55 105 A 25 25 0 0 0 '+(30+25*Math.cos(deg*Math.PI/180)).toFixed(1)+' '+(105-25*Math.sin(deg*Math.PI/180)).toFixed(1)+'" fill="none" stroke="var(--fig-acc)" stroke-width="3"/></svg>';};
UNITS_MAT.push({n:8,title:'Geometria e medidas',sub:'Formas, contorno, superfície, ângulo e as unidades certas.',tone:'verde',lessons:[
L('8.1','△','Formas e seus lados',
 {ideia:'Polígonos são formas fechadas feitas só de linhas retas. O nome vem do número de lados.',
  exemplo:'3 lados = triângulo, 4 = quadrilátero (quadrado, retângulo), 5 = pentágono, 6 = hexágono.',
  dica:'Quadrado é um retângulo especial: tem os 4 lados iguais.'},
 [
  ()=>{const m={'triângulo':3,'quadrado':4,'pentágono':5,'hexágono':6,'octógono':8};const k=pick(Object.keys(m));return inp('Quantos lados tem um '+k+'?',m[k]);},
  ()=>{const m={3:'triângulo',4:'quadrilátero',5:'pentágono',6:'hexágono'};const k=pick(Object.keys(m));return mc('Como se chama o polígono de '+k+' lados?',m[k],Object.values(m).filter(v=>v!==m[k]));},
  ()=>{return tf('Todo quadrado é também um retângulo.',true);},
  ()=>{return tf('O círculo é um polígono.',false);},
  ()=>{return mc('Quantos vértices (cantos) tem um retângulo?',4,[3,6,8]);},
  ()=>{return mc('Qual figura tem todos os lados iguais e todos os ângulos de 90°?','quadrado',['retângulo','losango','triângulo']);}
 ]),
L('8.2','▭','Perímetro',
 {ideia:'Perímetro é o contorno: a soma de todos os lados. É o que você mediria andando ao redor da figura.',
  exemplo:'Retângulo de 8 cm por 5 cm → 8 + 5 + 8 + 5 = 26 cm.',
  dica:'Atalho do retângulo: (base + altura) × 2.'},
 [
  ()=>{const w=R(3,15),h=R(2,12);return inp('Qual é o perímetro deste retângulo, em cm?',2*(w+h),{figure:svgRect(w,h)});},
  ()=>{const l=R(3,20);return inp('Um quadrado tem lado de '+l+' cm. Qual é o perímetro?',4*l);},
  ()=>{const a=R(3,12),b=R(3,12),c=R(4,12);return inp('Um triângulo tem lados de '+a+', '+b+' e '+c+' cm. Qual é o perímetro?',a+b+c);},
  ()=>{const w=R(4,15);let h=R(3,12);while(w*h===2*(w+h))h=R(3,12);return mc('Qual é o perímetro de um retângulo '+w+' cm × '+h+' cm?',2*(w+h)+' cm',[(w*h)+' cm',(w+h)+' cm']);},
  ()=>{const p=R(4,15)*4;return inp('Um quadrado tem perímetro de '+p+' cm. Quanto mede cada lado?',p/4);},
  ()=>{const w=R(5,12),h=R(3,9);return tf('O perímetro de um retângulo '+w+'×'+h+' cm é '+(2*(w+h))+' cm.',true);}
 ]),
L('8.3','□','Área',
 {ideia:'Área é a superfície ocupada, quantos quadradinhos de 1 cm cabem dentro. No retângulo: base × altura.',
  exemplo:'Retângulo de 8 cm por 5 cm → 8 × 5 = 40 cm².',
  dica:'Perímetro se mede em cm; área em cm² (centímetros <b>quadrados</b>).'},
 [
  ()=>{const w=R(3,14),h=R(2,10);return inp('Qual é a área deste retângulo, em cm²?',w*h,{figure:svgRect(w,h)});},
  ()=>{const l=R(3,15);return inp('Um quadrado tem lado de '+l+' cm. Qual é a área, em cm²?',l*l);},
  ()=>{const b=R(4,16),h=R(2,10)*2;return inp('Qual é a área deste triângulo, em cm²? (base × altura ÷ 2)',b*h/2,{figure:svgTri(b,h)});},
  ()=>{const w=R(3,12);let h=R(3,10);while(h===w||w*h===2*(w+h))h=R(3,10);return mc('Área de um retângulo '+w+' cm × '+h+' cm:',(w*h)+' cm²',[(2*(w+h))+' cm²',(w+h)+' cm²']);},
  ()=>{const w=R(2,9),a=w*R(3,9);return inp('Um retângulo tem área de '+a+' cm² e base de '+w+' cm. Qual é a altura?',a/w);},
  ()=>{return tf('Dobrando o lado de um quadrado, a área também apenas dobra.',false);}
 ]),
L('8.4','∠','Ângulos',
 {ideia:'Ângulo mede a abertura entre duas linhas, em graus. Reto = 90°, agudo = menos que 90°, obtuso = entre 90° e 180°, raso = 180°.',
  exemplo:'O canto de uma folha de papel é um ângulo reto: 90°. Meia volta é 180°, uma volta inteira é 360°.',
  dica:'Os três ângulos de qualquer triângulo sempre somam 180°.'},
 [
  ()=>{const d=pick([30,45,60,120,135,150]);return mc('Este ângulo é...',d<90?'agudo':'obtuso',[d<90?'obtuso':'agudo','reto'],{figure:svgAng(d)});},
  ()=>{return inp('Quantos graus tem um ângulo reto?',90);},
  ()=>{return inp('Quantos graus tem uma volta completa?',360);},
  ()=>{const a=R(30,70),b=R(30,70);return inp('Num triângulo, dois ângulos medem '+a+'° e '+b+'°. Quanto mede o terceiro?',180-a-b);},
  ()=>{const a=R(20,70);return inp('Dois ângulos são complementares (somam 90°). Um mede '+a+'°. Quanto mede o outro?',90-a);},
  ()=>{return tf('Um ângulo de 100° é agudo.',false);}
 ]),
L('8.5','km','Unidades de medida',
 {ideia:'Cada unidade tem seus múltiplos. 1 m = 100 cm; 1 km = 1000 m; 1 kg = 1000 g; 1 L = 1000 mL. Volume de uma caixa: comprimento × largura × altura.',
  exemplo:'2,5 m = 250 cm. E uma caixa 2 × 3 × 4 cm tem volume de 24 cm³.',
  dica:'Para trocar de unidade, pergunte: vou para uma unidade menor? Então multiplico.'},
 [
  ()=>{const m=R(2,9);return inp(''+m+' metros equivalem a quantos centímetros?',m*100);},
  ()=>{const k=R(2,9);return inp(''+k+' km equivalem a quantos metros?',k*1000);},
  ()=>{const g=R(2,9);return inp(''+g+' kg equivalem a quantos gramas?',g*1000);},
  ()=>{const l=r2(R(15,90)/10);return inp(''+fmt(l)+' L equivalem a quantos mL?',Math.round(l*1000));},
  ()=>{const a=R(2,8),b=R(2,8),c=R(2,8);return inp('Uma caixa mede '+a+' × '+b+' × '+c+' cm. Qual é o volume, em cm³?',a*b*c);},
  ()=>{const cm=R(2,9)*100;return mc(''+cm+' cm são quantos metros?',cm/100+' m',[cm*100+' m',cm/10+' m']);}
 ])
]});

/* ============ UNIDADE 9 ============ */
UNITS_MAT.push({n:9,title:'Álgebra inicial',sub:'Quando a letra entra na conta, e continua sendo só matemática.',tone:'roxo',lessons:[
L('9.1','x','O número desconhecido',
 {ideia:'Quando não sabemos um número, damos um nome a ele, normalmente <b>x</b>. Descobrir x é fazer a operação contrária.',
  exemplo:'x + 7 = 12 → faço 12 − 7 = 5. Então x = 5.',
  dica:'Somou? Subtraia. Multiplicou? Divida. Sempre o contrário.'},
 [
  ()=>{const x=R(2,20),a=R(2,15);return inp('x + '+a+' = '+(x+a). toString()+'  → x = ?',x);},
  ()=>{const x=R(5,30),a=R(2,4);return inp('x − '+a+' = '+(x-a)+'  → x = ?',x);},
  ()=>{const x=R(2,12),a=R(2,9);return inp(''+a+' × x = '+(a*x)+'  → x = ?',x);},
  ()=>{const x=R(2,12),a=R(2,9);return inp('x ÷ '+a+' = '+x+'  → x = ?',x*a);},
  ()=>{const x=R(3,15),a=R(2,10);return mc('Se x + '+a+' = '+(x+a)+', quanto vale x?',x,[x+a,a,x+1]);},
  ()=>{const x=R(2,9);return tf('Se 3 × x = '+(3*x)+', então x = '+x+'.',true);}
 ]),
L('9.2','()','Ordem das operações',
 {ideia:'Numa expressão, a ordem é: primeiro o que está entre <b>parênteses</b>, depois potências, depois multiplicação e divisão, e por último soma e subtração.',
  exemplo:'2 + 3 × 4 = 2 + 12 = 14 (e não 20). Já (2 + 3) × 4 = 20.',
  dica:'Os parênteses existem justamente para furar a fila.'},
 [
  ()=>{const a=R(2,9),b=R(2,9),c=R(2,9);return inp(a+' + '+b+' × '+c+' = ?',a+b*c);},
  ()=>{const a=R(2,9),b=R(2,9),c=R(2,9);return inp('('+a+' + '+b+') × '+c+' = ?',(a+b)*c);},
  ()=>{const a=R(2,9),b=R(2,9),c=R(1,Math.min(9,a*b-1));return inp(a+' × '+b+' − '+c+' = ?',a*b-c);},
  ()=>{const b=R(2,9),c=R(2,6);return inp(''+(b*c)+' ÷ '+c+' + '+b+' = ?',b+b);},
  ()=>{const a=R(2,9),b=R(2,9),c=R(2,9);return mc('Quanto é '+a+' + '+b+' × '+c+'?',a+b*c,[(a+b)*c,a*b+c]);},
  ()=>{const a=R(2,9),b=R(2,9);return tf('('+a+' + '+b+') × 2 dá o mesmo que '+a+' + '+b+' × 2.',false);}
 ]),
L('9.3','=','Equações do 1º grau',
 {ideia:'Numa equação, os dois lados valem a mesma coisa. O que você faz de um lado, precisa fazer do outro. O objetivo é deixar o x sozinho.',
  exemplo:'2x + 5 = 17 → tira 5 dos dois lados: 2x = 12 → divide por 2: x = 6.',
  dica:'Confira sempre: coloque o valor achado de volta na equação e veja se fecha.'},
 [
  ()=>{const x=R(2,12),a=R(2,9),b=R(1,20);return inp(''+a+'x + '+b+' = '+(a*x+b)+'  → x = ?',x);},
  ()=>{const x=R(3,15),a=R(2,6),b=R(1,10);return inp(''+a+'x − '+b+' = '+(a*x-b)+'  → x = ?',x);},
  ()=>{const x=R(2,10),a=R(2,6);return inp(''+a+'x = '+(a*x)+'  → x = ?',x);},
  ()=>{const x=R(2,10),a=R(2,5),b=R(2,5);return inp(''+a+'x + '+b+'x = '+((a+b)*x)+'  → x = ?',x);},
  ()=>{const x=R(2,10),a=R(2,6),b=R(2,12);return mc('Resolva: '+a+'x + '+b+' = '+(a*x+b),'x = '+x,['x = '+(x+1),'x = '+(a*x+b)]);},
  ()=>{const x=R(2,9);return tf('Se x = '+x+', então 2x + 1 = '+(2*x+1)+'.',true);}
 ]),
L('9.4','x²','Potências',
 {ideia:'Potência é multiplicar um número por ele mesmo várias vezes. O expoente diz quantas vezes.',
  exemplo:'5² = 5 × 5 = 25. E 2³ = 2 × 2 × 2 = 8.',
  dica:'Qualquer número elevado a 1 é ele mesmo; elevado a 0 dá 1.'},
 [
  ()=>{const a=R(2,12);return inp(a+'² = ?',a*a);},
  ()=>{const a=R(2,6);return inp(a+'³ = ?',a*a*a);},
  ()=>{const a=R(2,9);return mc('Quanto é '+a+'²?',a*a,[a*2,a*a*a,a+a]);},
  ()=>{const a=R(2,9);return tf(a+'² é o mesmo que '+a+' × 2.',false);},
  ()=>{const a=R(2,10);return inp('10'+(a<5?'²':'³')+' = ?',a<5?100:1000);},
  ()=>{const a=R(2,9);return inp(a+'¹ = ?',a);}
 ]),
L('9.5','√','Raiz quadrada',
 {ideia:'A raiz quadrada é a operação contrária da potência de 2: pergunta qual número, multiplicado por ele mesmo, dá aquele resultado.',
  exemplo:'√49 = 7, porque 7 × 7 = 49.',
  dica:'Vale decorar os quadrados perfeitos: 1, 4, 9, 16, 25, 36, 49, 64, 81, 100, 121, 144.'},
 [
  ()=>{const a=R(2,12);return inp('√'+(a*a)+' = ?',a);},
  ()=>{const a=R(2,10);return mc('Quanto é √'+(a*a)+'?',a,[a*a,a+1,a*2]);},
  ()=>{const a=R(3,12);return tf('√'+(a*a)+' = '+a+'.',true);},
  ()=>{const a=R(2,9);return inp('Um quadrado tem área de '+(a*a)+' cm². Quanto mede o lado?',a);},
  ()=>{const a=pick([4,9,16,25,36,49,64,81,100]);return mc('Qual destes é um quadrado perfeito?',a,[a+2,a+3,a-3]);},
  ()=>{const a=R(2,10);return inp('Se x² = '+(a*a)+' e x é positivo, quanto vale x?',a);}
 ])
]});

/* ============ UNIDADE 10 ============ */
const barras=(labels,vals)=>{const mx=Math.max.apply(null,vals);return '<div class="chart">'+labels.map((l,i)=>'<div class="bar"><span style="height:'+Math.round(vals[i]/mx*100)+'%"><b>'+vals[i]+'</b></span><em>'+l+'</em></div>').join('')+'</div>';};
UNITS_MAT.push({n:10,title:'Dados, negativos e desafios',sub:'Ler informação, entender o que está abaixo de zero e juntar tudo.',tone:'coral',lessons:[
L('10.1','x̄','Média',
 {ideia:'Média é somar todos os valores e dividir pela quantidade de valores. Ela mostra o valor “típico” do conjunto.',
  exemplo:'Notas 6, 8 e 10 → soma 24, dividido por 3 = média 8.',
  dica:'A média sempre fica entre o menor e o maior valor. Se der fora disso, tem erro na conta.'},
 [
  ()=>{const a=R(2,10),b=R(2,10),c=R(2,10);const s=a+b+c;const ok=s%3===0;const A=ok?a:a+(3-s%3);return inp('Qual é a média de '+A+', '+b+' e '+c+'?',(A+b+c)/3);},
  ()=>{const m=R(3,10);const a=m-2,b=m,c=m+2;return inp('Qual é a média de '+a+', '+b+' e '+c+'?',m);},
  ()=>{const m=R(4,9);return inp('Quatro notas: '+(m-1)+', '+(m+1)+', '+(m-2)+', '+(m+2)+'. Qual é a média?',m);},
  ()=>{const m=R(5,9);return inp('A média de duas notas é '+m+'. Uma delas é '+(m-2)+'. Qual é a outra?',m+2);},
  ()=>{const a=R(2,8);return tf('A média de '+a+' e '+(a+4)+' é '+(a+2)+'.',true);},
  ()=>{return mc('A média de 10, 10 e 4 é...','8',['10','24','6']);}
 ]),
L('10.2','▥','Ler gráficos',
 {ideia:'Num gráfico de barras, a altura da barra mostra a quantidade. Compare as alturas antes de fazer qualquer conta.',
  exemplo:'Se a barra de terça é a mais alta, terça foi o dia de maior venda.',
  dica:'Sempre leia primeiro o que está escrito embaixo de cada barra.'},
 [
  ()=>{const l=['Seg','Ter','Qua','Qui'],v=shuf([R(2,9),R(10,15),R(16,22),R(23,30)]);const i=v.indexOf(Math.max.apply(null,v));return mc('Qual dia teve o maior valor?',l[i],l.filter(x=>x!==l[i]),{figure:barras(l,v)});},
  ()=>{const l=['Seg','Ter','Qua','Qui'],v=shuf([R(2,9),R(10,15),R(16,22),R(23,30)]);const i=v.indexOf(Math.min.apply(null,v));return mc('Qual dia teve o menor valor?',l[i],l.filter(x=>x!==l[i]),{figure:barras(l,v)});},
  ()=>{const l=['Seg','Ter','Qua','Qui'],v=[R(4,9),R(10,15),R(16,22),R(23,30)];return inp('Qual é o total dos quatro dias?',v.reduce((a,b)=>a+b,0),{figure:barras(l,v)});},
  ()=>{const l=['Ana','Beto','Caio'],v=[R(4,9),R(10,15),R(16,22)];return inp('Quantos '+l[2]+' tem <b>a mais</b> que '+l[0]+'?',v[2]-v[0],{figure:barras(l,v)});},
  /* Antes os três valores eram sorteados soltos e o total quase nunca dava certinho por 3:
     a resposta certa aparecia escrita como "27.333333333333332" no botão.
     Agora sorteia a MÉDIA primeiro e monta os três dias em volta dela (m-d, m, m+d),
     então o total é sempre 3*m e a média é sempre um número redondo. */
  ()=>{const m=R(8,30),d=R(1,5),v=[m-d,m,m+d];const tot=v[0]+v[1]+v[2];
       return mc('Na segunda foram '+v[0]+', na terça '+v[1]+' e na quarta '+v[2]+'. O total é '+tot+'. A média diária é...',
         m,[tot,Math.round(tot/2),m+d]);},
  ()=>{const l=['A','B','C','D'],v=[R(5,9),R(10,14),R(15,19),R(20,25)];return tf('A barra D é a mais alta do gráfico.',true,{figure:barras(l,v)});}
 ]),
L('10.3','◐','Probabilidade',
 {ideia:'Probabilidade é a chance de algo acontecer: casos favoráveis divididos pelo total de casos possíveis.',
  exemplo:'Num dado de 6 faces, a chance de sair 4 é '+frac(1,6)+'. De sair par é '+frac(3,6)+' = '+frac(1,2)+'.',
  dica:'A chance nunca é maior que 1 (ou 100%). Certeza = 1, impossível = 0.'},
 [
  ()=>{return mc('Num dado comum de 6 faces, qual é a chance de sair o número 3?',frac(1,6),[frac(1,3),frac(3,6),frac(6,1)]);},
  ()=>{return mc('Numa moeda, qual é a chance de dar cara?',frac(1,2),[frac(1,1),frac(1,4)]);},
  ()=>{const a=R(2,5);let b=R(3,7);while(b===a)b=R(3,7);return mc('Numa caixa com '+a+' bolas azuis e '+b+' vermelhas, qual a chance de tirar uma azul?',frac(a,a+b),[frac(b,a+b),frac(a,b)]);},
  ()=>{return mc('Num dado de 6 faces, a chance de sair um número <b>par</b> é...',frac(1,2),[frac(1,6),frac(1,3)]);},
  ()=>{return tf('A chance de sair o número 7 num dado comum de 6 faces é zero.',true);},
  ()=>{const n=R(4,10);return mc('Numa roleta com '+n+' partes iguais, a chance de cair numa parte escolhida é...',frac(1,n),[frac(n,1),frac(2,n)]);}
 ]),
L('10.4','−5','Números negativos',
 {ideia:'Abaixo de zero existem os números negativos. Na reta numérica eles ficam à esquerda do zero: quanto mais longe, menor.',
  exemplo:'−5 é menor que −2. Um termômetro que marca −3 °C está mais frio que um que marca 1 °C.',
  dica:'Somar um negativo é o mesmo que subtrair: 5 + (−3) = 5 − 3 = 2.'},
 [
  ()=>{const a=R(1,9),b=R(1,9);return mc('Qual é menor?','−'+Math.max(a+1,b+1),['−'+Math.min(a,b),'0']);},
  ()=>{const a=R(2,9),b=R(1,a-1);return inp(''+b+' − '+a+' = ?',b-a);},
  ()=>{const a=R(2,9),b=R(2,9);return inp('−'+a+' + '+(a+b)+' = ?',b);},
  ()=>{const t=R(2,9);return inp('O termômetro marcava −'+t+' °C e subiu '+(t+3)+' graus. Quanto marca agora?',3);},
  ()=>{const a=R(2,9);return tf('−'+a+' é maior que 0.',false);},
  ()=>{const a=R(3,9);return mc('Qual sinal completa?  −'+a+' ___ −'+(a-2),'<',['>','=']);}
 ]),
L('10.5','★','Desafio final',
 {ideia:'Aqui cai de tudo o que você aprendeu na trilha: frações, decimais, porcentagem, geometria e álgebra, misturados.',
  exemplo:'Leia com calma, identifique o assunto e use a estratégia daquela unidade.',
  dica:'Errou? Volte na lição do assunto e refaça. Não tem pressa.'},
 [
  ()=>hardMaker(),()=>hardMaker(),()=>hardMaker(),()=>anyMaker(),()=>hardMaker(),()=>anyMaker()
 ])
]});

/* A fase 10.4 ensina números negativos. Quando o Desafio final (10.5) revisa essa fase, as perguntas vêm
   marcadas com q.negativo=true: negativo ali é conteúdo. Em qualquer outra pergunta, negativo é defeito. */
const marcaNegativo=mk=>()=>{const q=mk();if(q&&typeof q==='object')q.negativo=true;return q;};
function pool(minU,maxU){const ls=[];UNITS_MAT.forEach(u=>{if(u.n>=minU&&u.n<=maxU)u.lessons.forEach(l=>{if(l.id!=='10.5')ls.push.apply(ls,l.id==='10.4'?l.makers.map(marcaNegativo):l.makers);});});return ls;}
function hardMaker(){return pick(pool(6,10))();}
function anyMaker(){return pick(pool(1,10))();}

function genQuestions(lesson,n){
  const out=[];const seen=new Set();
  const emOrdem=!!lesson.ordem;
  /* 1G: fora das fases em ordem, a sacola segue a adaptação por habilidade (alvo de acerto 70 a 85%, interface/adaptacao.js);
     sem dado nenhum da criança ela equivale a embaralhar */
  const novaSacola=()=>emOrdem?lesson.makers.slice():(typeof ordemAdaptativa==='function'&&typeof S==='object'&&S&&S.habil?ordemAdaptativa(lesson.makers,n):shuf(lesson.makers));
  let bag=novaSacola();let i=0,guard=0;
  /* a 1ª pergunta é sempre de reconhecer (múltipla escolha) quando a fase tiver alguma:
     reconhecer vem antes de produzir — ninguém escreve o que ainda não sabe ler */
  if(!emOrdem){
    for(let t=0;t<14;t++){
      const j=t%bag.length;
      let q0;try{q0=bag[j]();}catch(e){continue;}
      if(q0&&q0.type==='mc'){q0.__mk=bag[j];out.push(q0);seen.add(q0.prompt+'|'+q0.answer);break;}
    }
  }
  while(out.length<n&&guard++<n*12){
    if(i>=bag.length){bag=novaSacola();i=0;}
    const mk=bag[i++];let q;try{q=mk();}catch(e){continue;}
    if(!q)continue;
    const key=q.prompt+'|'+q.answer;
    if(seen.has(key))continue;
    /* __mk: o gerador que fez a pergunta (para a pergunta irmã quando a criança errar) */
    q.__mk=mk;
    seen.add(key);out.push(q);
  }
  /* Algumas fases têm poucas perguntas possíveis (p6.2 só consegue montar 6).
     Antes isso entregava uma fase curta e o placar dizia "6 de 8" numa jogada perfeita.
     Agora completa com perguntas das fases já vistas da mesma matéria — revisão
     intercalada, que é justamente o que fixa o que foi aprendido antes. */
  if(out.length<n){
    const extra=reforco(lesson);
    let g2=0;
    while(out.length<n&&extra.length&&g2++<n*20){
      const mk=pick(extra);let q;try{q=mk();}catch(e){continue;}
      if(!q)continue;
      const key=q.prompt+'|'+q.answer;
      if(seen.has(key))continue;
      q.__mk=mk;seen.add(key);q.reforco=true;out.push(q);
    }
  }
  /* verbos na cena (interface/verbos.js): contar vira tocar objeto por objeto, repartir vira arrastar, letra na palavra vira tocar; e nunca 3 verbos iguais seguidos */
  if(typeof aplicarVerbos==='function')return aplicarVerbos(out,lesson);
  return out;
}
/* perguntas de apoio: só das fases que a criança já passou, nunca de conteúdo mais adiantado */
function reforco(lesson){
  const id=String(lesson&&lesson.id||'');
  try{
    if(id.charAt(0)==='p')return ptPool(1,Math.max(1,parseInt(id.slice(1),10)||1));
    if(id.charAt(0)==='e'){
      const ate=Math.max(1,parseInt(id.slice(1),10)||1),ls=[];
      UNITS_EN.forEach(u=>{if(u.n<=ate)u.lessons.forEach(l=>{if(l.id!=='e10.5')ls.push.apply(ls,l.makers);});});
      return ls;
    }
    return pool(1,Math.max(1,parseInt(id,10)||1));
  }catch(e){return [];}
}
const TOTAL_MAT=UNITS_MAT.reduce((a,u)=>a+u.lessons.length,0);

