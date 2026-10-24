/* ---------- ajuda por pergunta: "Como fazer" e "Ajuda extra" vêm do GERADOR da pergunta, não da fase ----------
   ajudaDe(q) devolve {metodo, resposta, fonte}: o método ensina o caminho para ESTA pergunta (sem dar a resposta; é o que aparece no botão
   Dica antes de responder) e a resposta é a frase que fecha a conta depois de um erro. fonte: 'maker' (o gerador mandou q.dica),
   'padrao' (modelo reconhecido pelo texto da pergunta) ou 'generica' (nenhum modelo serviu; o teste verifica.js não deixa passar).
   Texto segue as regras das falas: "você", frase curta, sem travessão, sem culpa. */
const AJ_TXT=h=>String(h==null?'':h).replace(/<br\s*\/?>/gi,' ').replace(/<[^>]+>/g,' ').replace(/&nbsp;/g,' ').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&').replace(/\s+/g,' ').trim();
const AJ_NUMS=p=>(p.match(/-?\d+(?:[.,]\d+)?/g)||[]);
const AJ_ASPAS=p=>{const m=p.match(/[“"]([^”"]+)[”"]/);return m?m[1]:'';};
const AJ_MAIUSC=p=>(p.match(/\b[A-ZÁÉÍÓÚÂÊÔÃÕÇ][A-ZÁÉÍÓÚÂÊÔÃÕÇ_-]{1,}\b/g)||[]).filter(w=>!/^(R\$|NÃO|COMO|ONDE|QUE|ELE|FAZ)$/.test(w));
const AJ_B=p=>{const m=String(p).match(/<b>([^<]+)<\/b>/);return m?AJ_TXT(m[1]):'';};
const aj=(metodo,resposta,fonte)=>({metodo:metodo,resposta:resposta||'',fonte:fonte||'padrao'});

function ajudaMat(q,p,a,n){
  let m;
  if((m=p.match(/vem antes d[oe] (\d+)/i)))return aj('Conte para trás a partir do '+m[1]+'. O número que você fala logo depois dele é o que vem antes.','Antes do '+m[1]+' vem o '+a+'.');
  if((m=p.match(/vem depois d[oe] (\d+)/i)))return aj('Conte para a frente a partir do '+m[1]+'. O número seguinte é o que vem depois.','Depois do '+m[1]+' vem o '+a+'.');
  if(/quant[ao]s (bolinhas|cubinhos|bolas)/i.test(p)&&!/a mais|azuis|caixa/i.test(p))return aj('Toque em cada bolinha com o dedo e conte em voz alta, sem pular nem repetir. O último número que você falar é a quantidade.','São '+a+'.');
  if(/barrinha/i.test(p)&&/quanto vale/i.test(p))return aj('Cada barrinha vale 10. Conte de 10 em 10, uma vez para cada barrinha: 10, 20, 30...','Dá '+a+'.');
  if(/monte .* barrinhas|monte o n[úu]mero/i.test(p))return aj('Separe o número em dezenas e unidades: cada barrinha vale 10 e cada cubinho vale 1.','Para '+a+': '+Math.floor(+a/10)%10+' barrinhas e '+(+a%10)+' cubinhos'+(+a>=100?', mais '+Math.floor(+a/100)+' placa':'')+'.');
  if(/centenas? \+|dezenas? \+|unidades? =/i.test(p))return aj('Centena vale 100, dezena vale 10 e unidade vale 1. Multiplique cada um pelo seu valor e some tudo.','Dá '+a+'.');
  if(/maior que|menor que|sinal completa|qual sinal|maior ou menor/i.test(p)&&n.length>=2)return aj('Compare '+n[0]+' e '+n[1]+': quem tem mais algarismos é maior; se tiver o mesmo tanto, olhe o primeiro algarismo da esquerda.','A resposta é '+a+'.');
  if(/complete a sequ[êe]ncia|contando de|de tr[áa]s pra frente/i.test(p)&&n.length>=3){const d=(+n[1].replace(',','.'))-(+n[0].replace(',','.'));return aj('Veja quanto pula de um número para o outro: de '+n[0]+' para '+n[1]+' '+(d>=0?'sobe':'desce')+' '+Math.abs(d)+'. Continue pulando igual.','Depois do '+n[n.length-1]+' vem '+a+'.');}
  if(/dobro/i.test(p)&&n.length)return aj('O dobro é o número somado com ele mesmo: '+n[n.length-1]+' + '+n[n.length-1]+'.','O dobro de '+n[n.length-1]+' é '+a+'.');
  if(/triplo/i.test(p)&&n.length)return aj('O triplo é o número três vezes: '+n[0]+' + '+n[0]+' + '+n[0]+'.','O triplo de '+n[0]+' é '+a+'.');
  if(/metade/i.test(p)&&n.length)return aj('Metade é dividir em duas partes iguais: que número somado com ele mesmo dá '+n[n.length-1]+'?','A metade de '+n[n.length-1]+' é '+a+'.');
  if(/ter[çc]a parte/i.test(p)&&n.length)return aj('Terça parte é dividir em três partes iguais: que número vezes 3 dá '+n[0]+'?','A terça parte de '+n[0]+' é '+a+'.');
  if(/%/.test(p)&&n.length>=2)return aj('Para achar '+n[0]+'% de um valor, divida o valor por 100 e multiplique por '+n[0]+'. 10% é só dividir por 10.','A resposta é '+a+'.');
  if(/numerador/i.test(p))return aj('Na fração, o número de cima é o numerador: quantas partes você pega.','O numerador é '+a+'.');
  if(/denominador/i.test(p))return aj('Na fração, o número de baixo é o denominador: em quantas partes o inteiro foi dividido.','O denominador é '+a+'.');
  if(/m[ée]dia/i.test(p))return aj('Média é somar tudo e dividir pela quantidade de números que você somou.','A média é '+a+'.');
  if(/per[íi]metro/i.test(p))return aj('Perímetro é a volta inteira: some o tamanho de todos os lados.','O perímetro é '+a+'.');
  if(/[áa]rea/i.test(p))return aj(/tri[âa]ngulo/i.test(p)?'Área do triângulo: base vezes altura, dividido por 2.':'Área do retângulo: base vezes altura. No quadrado, lado vezes lado.','A área é '+a+'.');
  if(/volume/i.test(p))return aj('Volume da caixa: multiplique as três medidas, comprimento, largura e altura.','O volume é '+a+'.');
  if(/[âa]ngulo|graus/i.test(p))return aj('Lembre: ângulo reto tem 90°, meia-volta tem 180°, volta completa tem 360°. Os três ângulos de um triângulo somam 180°.','A resposta é '+a+'.');
  if(/quantos lados/i.test(p))return aj('O começo do nome diz a quantidade: tri é três, penta é cinco, hexa é seis, octo é oito.','Tem '+a+' lados.');
  if(/divisores/i.test(p)&&n.length)return aj('Divisor é um número que divide '+n[0]+' sem deixar resto. Teste 1, 2, 3... até '+n[0]+'.','O '+n[0]+' tem '+a+' divisores.');
  if(/resto/i.test(p)&&n.length>=2)return aj('Veja quantas vezes '+n[1]+' cabe em '+n[0]+' sem passar. O que sobra é o resto.','O resto é '+a+'.');
  if(/equivalem|km|kg\b|mL|litros?/i.test(p)&&/quant/i.test(p))return aj('Lembre as trocas: 1 km = 1000 m, 1 m = 100 cm, 1 kg = 1000 g, 1 L = 1000 mL. Multiplique.','Dá '+a+'.');
  if(/x\s*[²³]|²\s*=|³\s*=|¹\s*=|\^/i.test(p)||/\d[²³¹]/.test(p))return aj('O número pequeno em cima diz quantas vezes multiplicar o número por ele mesmo: ao quadrado é duas vezes, ao cubo é três.','A resposta é '+a+'.');
  if(/\bx\b/.test(p)&&/=/.test(p))return aj('Para achar o x, faça a operação contrária dos dois lados: o que soma vira subtração, o que multiplica vira divisão, até sobrar só o x.','x = '+a+'.');
  if(/___|\?/.test(p)&&/[+−\-×÷]/.test(p)&&n.length>=2){
    if(/\+/.test(p))return aj('Pense na conta ao contrário: quanto falta de '+n[0]+' para chegar a '+n[1]+'? Conte para a frente a partir do menor.','O número que falta é '+a+'.');
    if(/[−\-]/.test(p))return aj('Pense na conta ao contrário: use os dois números que você já tem e some ou subtraia para achar o que falta.','O número que falta é '+a+'.');
    if(/×/.test(p))return aj('Pense na conta ao contrário: quantas vezes '+n[0]+' cabe em '+n[1]+'? Conte de '+n[0]+' em '+n[0]+'.','O número que falta é '+a+'.');
    if(/÷/.test(p))return aj('Pense na conta ao contrário: divisão desfaz multiplicação. Multiplique os números que você tem.','O número que falta é '+a+'.');
  }
  const expr=p.match(/(\d+(?:[.,]\d+)?)\s*([+−\-×÷])\s*(\d+(?:[.,]\d+)?)/);
  if(expr){
    const x=expr[1],op=expr[2],y=expr[3];
    const ops=/[+]/.test(op)?aj('Comece pelo número maior e conte '+Math.min(+x,+y)+' para a frente. Pode somar por partes: primeiro as dezenas, depois as unidades.',x+' + '+y+' = '+a+'.')
      :/[−\-]/.test(op)?aj('Comece em '+x+' e conte '+y+' para trás. Ou pense: quanto falta de '+y+' para chegar a '+x+'?',x+' − '+y+' = '+a+'.')
      :/×/.test(op)?aj(x+' × '+y+' são '+x+' grupos de '+y+'. Some '+y+' vezes seguidas, ou conte de '+y+' em '+y+'.',x+' × '+y+' = '+a+'.')
      :aj('Reparta '+x+' em '+y+' partes iguais: quantas vezes '+y+' cabe em '+x+'?',x+' ÷ '+y+' = '+a+'.');
    if(/\+.*×|×.*\+|÷.*\+|−.*×/.test(p))ops.metodo='Faça primeiro a multiplicação ou a divisão, depois a soma ou a subtração. O que está entre parênteses vem antes de tudo.';
    return ops;
  }
  if(/troco|sobrou|gastou|quanto falta|a mais que|a mais\?|faltam|deu \d+ delas|quantas deu|foram ao passeio|desconto/i.test(p)&&n.length>=2)return aj('Palavras como sobrou, falta, troco e a mais pedem subtração. Os números da pergunta são '+n[0]+' e '+n[1]+': tire o menor do maior.','A resposta é '+a+'.');
  if(/ao todo|juntos|ganhou|e você pagou|total|ficou com|leram|há \d+ bolas/i.test(p)&&n.length>=2)return aj('Palavras como ao todo, juntos e ganhou pedem soma. Os números da pergunta são '+n.slice(0,3).join(', ')+': some um por um, começando pelo maior.','A resposta é '+a+'.');
  if(/reparti|dividid|cada uma|cada um|entre \d+|quantas para cada|quanto cada/i.test(p)&&n.length>=2)return aj('Repartir igualmente é dividir. Separe '+n[0]+' em '+n[1]+' partes iguais, distribuindo um por vez.','A resposta é '+a+'.');
  if(/cada caixa|em \d+ caixas|fileiras|cada cadern|custam \d+|custa .* quanto custam|lápis|grupos de|receita|torneira|carro faz|pedreiros|pessoas comem|produto custa|preço/i.test(p)&&n.length>=2)return aj('Quando a mesma quantidade se repete, multiplique. Veja quanto vale UM e multiplique pela quantidade pedida (ou divida, se a pergunta pede o valor de um).','A resposta é '+a+'.');
  if(/quantas moedas de/i.test(p)&&n.length>=2)return aj('Conte de '+n[0]+' em '+n[0]+' centavos até chegar ao valor. Lembre: 1 real tem 100 centavos.','São '+a+' moedas.');
  if(/term[ôo]metro|°C|graus/i.test(p)&&n.length>=2)return aj('Desenhe a reta dos números com o zero no meio. Subir é andar para a direita, descer é andar para a esquerda.','Marca '+a+'.');
  if(/parte inteira/i.test(p))return aj('A parte inteira é o que vem antes da vírgula.','A parte inteira é '+a+'.');
  if(/bem no meio entre/i.test(p)&&n.length>=2)return aj('Ache a distância entre '+n[0]+' e '+n[1]+' e ande metade dela a partir do menor.','O meio é '+a+'.');
  if(/número está montado|quantos cubinhos há aqui/i.test(p))return aj('Conte as placas (100 cada), depois as barrinhas (10 cada) e por fim os cubinhos (1 cada). Some tudo.','O número é '+a+'.');
  if(/quadrado tem|ret[âa]ngulo tem|lado de/i.test(p))return aj('Lembre: perímetro é a soma dos lados e área é base vezes altura. Leia o que a pergunta pede e use os números dela.','A resposta é '+a+'.');
  if(/múltiplo de (\d+)/i.test(p)){const k=p.match(/múltiplo de (\d+)/i)[1];return aj('Conte de '+k+' em '+k+' (a tabuada do '+k+') e veja se o '+n[0]+' aparece. Se aparecer, é múltiplo.','A frase é '+a.toLowerCase()+': '+n[0]+(a==='Verdadeiro'?' é':' não é')+' múltiplo de '+k+'.');}
  if(/é primo/i.test(p))return aj('Primo é o número que só pode ser dividido por 1 e por ele mesmo. Tente dividir '+n[0]+' por 2, 3, 5...','A frase é '+a.toLowerCase()+'.');
  if(/equivalente/i.test(p))return aj('Frações equivalentes valem o mesmo tanto. Multiplique em cima e embaixo de '+n[0]+'/'+n[1]+' pelo mesmo número e veja se chega a '+n[2]+'/'+n[3]+'.','A frase é '+a.toLowerCase()+'.');
  if(/arredondando (\d+)/i.test(p))return aj('Olhe o último algarismo de '+n[0]+': de 0 a 4 a dezena fica como está; de 5 a 9, sobe para a próxima.','A frase é '+a.toLowerCase()+'.');
  if(/√(\d+)/.test(p))return aj('Raiz quadrada pergunta: que número vezes ele mesmo dá '+p.match(/√(\d+)/)[1]+'? Teste 1 × 1, 2 × 2, 3 × 3...','A frase é '+a.toLowerCase()+'.');
  if(/quadrado perfeito/i.test(p))return aj('Quadrado perfeito é o resultado de um número vezes ele mesmo: 1, 4, 9, 16, 25, 36... Procure um desses entre as opções.','A resposta é '+a+'.');
  if(/é igual a 0,/i.test(p))return aj('Zero no fim de um decimal não muda o valor: 0,5 e 0,50 são a mesma coisa. Compare '+n[0]+' com '+n[1]+'.','A frase é '+a.toLowerCase()+'.');
  if(/desconto de \d+%/i.test(p))return aj('Desconto tira uma parte do preço: 50% tira a metade, 100% tira tudo. Pense quanto sobra depois do desconto de '+n[0]+'%.','A frase é '+a.toLowerCase()+'.');
  if(/se \d+ caixas pesam/i.test(p))return aj('Primeiro descubra quanto pesa UMA caixa: '+n[1]+' dividido por '+n[0]+'. Depois multiplique pela nova quantidade e compare com a frase.','A frase é '+a.toLowerCase()+'.');
  if(/polígono/i.test(p))return aj('Polígono é uma figura fechada só com lados retos. Pense se o círculo tem algum lado reto.',a+': o círculo é todo curvo, sem lados retos, então não é polígono.');
  if(/gráfico|barra [A-D]|qual dia teve|total dos .* dias/i.test(p))return aj('Olhe o gráfico: cada barra é um dia, e a altura mostra o valor. Compare as alturas (ou some os valores, se a pergunta pede o total).','A resposta é '+a+'.');
  if(/chance|dado comum|moeda/i.test(p)&&/chance|sair/i.test(p))return aj('Chance é quantas vezes o que você quer aparece entre todas as possibilidades. Uma moeda tem 2 lados; um dado tem 6 faces.','A resposta é '+a+'.');
  if(/^qual (destes )?é (maior|menor)\??$/i.test(p)&&q.options)return aj('Compare as opções: '+q.options.map(AJ_TXT).join(', ')+'. Olhe primeiro quantos algarismos cada uma tem, depois o primeiro da esquerda; em decimal, compare casa por casa.','A '+(/maior/i.test(p)?'maior':'menor')+' é '+a+'.');
  if(q.tf)return aj('Confira a frase: '+p+' Faça a conta com calma e compare com o que ela afirma. Se bater, é verdadeira; se não bater, é falsa.','A frase é '+a.toLowerCase()+'.');
  if(n.length>=1)return aj('Anote os números da pergunta: '+n.slice(0,3).join(', ')+'. Leia de novo o que ela pede e escolha a conta: soma, subtração, multiplicação ou divisão.','A resposta é '+a+'.');
  return null;
}
function ajudaPt(q,p,a,n){
  let m;const W=AJ_MAIUSC(p),asp=AJ_ASPAS(p),w=W[0]||asp;
  if(q.type==='silabas'||/monte (a palavra )?[A-Z]{3,}|na ordem certa|se misturaram/i.test(p)){const pw=W[W.length-1]||a;return aj('Fale '+pw+' bem devagar, batendo uma palma em cada pedaço. Cada palma é uma sílaba. Toque nas sílabas nessa ordem.','A palavra é '+a+'.');}
  if((m=p.match(/quantas letras tem (a palavra )?([A-ZÁ-Ú]+)/i)))return aj('Soletre '+m[2]+' devagar, apontando um dedo para cada letra. O último dedo é a quantidade.',m[2]+' tem '+a+' letras.');
  if(/quantas letras tem o alfabeto/i.test(p))return aj('Cante o alfabeto de A a Z batendo palma em cada letra, e conte as palmas.','O alfabeto tem '+a+' letras.');
  if((m=p.match(/quantas s[íi]labas tem ([A-ZÁ-Ú]+)/i)))return aj('Fale '+m[1]+' devagar, batendo uma palma em cada pedaço. Conte as palmas.',m[1]+' tem '+a+' sílabas.');
  if(/quantas vogais existem/i.test(p))return aj('As vogais são A, E, I, O, U. Conte nos dedos.','São '+a+' vogais.');
  if((m=p.match(/quantas vogais tem a palavra ([A-ZÁ-Ú]+)/i)))return aj('As vogais são A, E, I, O, U. Olhe cada letra de '+m[1]+' e marque só as vogais.',m[1]+' tem '+a+' vogais.');
  if((m=p.match(/a letra (\w) é vogal ou consoante/i)))return aj('As vogais são só cinco: A, E, I, O, U. Todas as outras letras são consoantes. Veja se o '+m[1]+' está nas cinco.','A letra '+m[1]+' é '+a.toLowerCase()+'.');
  if(/qual delas (não )?é (uma )?vogal/i.test(p))return aj('As vogais são só cinco: A, E, I, O, U. Compare cada opção com essas cinco.','A resposta é '+a+'.');
  if((m=p.match(/com que letra (começa|termina) ([A-ZÁ-Ú]+)/i)))return aj('Fale '+m[2]+' bem devagar e segure o '+(m[1]==='começa'?'primeiro':'último')+' som: esse som é a letra.',m[2]+' '+m[1]+' com '+a+'.');
  if((m=p.match(/escreva a letra com que começa ([A-ZÁ-Ú]+)/i)))return aj('Fale '+m[1]+' devagar e segure o primeiro som.',m[1]+' começa com '+a+'.');
  if((m=p.match(/qual letra vem (antes|depois) d[oe] (\w)/i)))return aj('Cante o alfabeto devagar até chegar no '+m[2]+' e pare na letra logo '+m[1]+'.','A letra que vem '+m[1]+' do '+m[2]+' é '+a+'.');
  if(/coloque em ordem|vem primeiro no alfabeto|vem por último no alfabeto|qual destas letras vem primeiro|no dicionário/i.test(p))return aj('Cante o alfabeto e veja qual letra aparece primeiro. Se duas palavras começam igual, olhe a segunda letra.','A resposta é '+a+'.');
  if(/complete: \w , \w , ___/i.test(p))return aj('Cante o alfabeto a partir da primeira letra da lista e veja qual vem em seguida.','A letra que falta é '+a+'.');
  if((m=p.match(/qual é a (maiúscula|minúscula) de (\w)/i)))return aj('Maiúscula é a letra grande, minúscula é a pequena. Pense em como o '+m[2]+' fica do outro tamanho.','A '+m[1]+' de '+m[2]+' é '+a+'.');
  if((m=p.match(/como se lê (\w) com (\w)/i)))return aj('Junte o som da consoante com a vogal: '+m[1]+' e '+m[2]+' formam uma sílaba só. Fale os dois sons bem juntos.','Lê-se '+a+'.');
  if(/família do (\w)/i.test(p))return aj('A família de uma letra são as sílabas que começam com ela: a letra com A, E, I, O, U.','A resposta é '+a+'.');
  if(/como se separa|sílaba falta|primeira sílaba|última sílaba|sílaba do meio|forma qual palavra|que palavra (formam|se forma|é|fica)|\+ .* = |no começo\?|trocando a ordem|sílabas: /i.test(p))return aj('Fale a palavra devagar, batendo uma palma em cada pedaço. Cada palma é uma sílaba. Depois junte os pedaços na ordem.','A resposta é '+a+'.');
  if((m=p.match(/rima com ([A-ZÁ-Ú]+)/i)))return aj('Rima é quando o fim das palavras soa igual. Fale '+m[1]+' e cada opção, prestando atenção no final.','A que rima com '+m[1]+' é '+a+'.');
  if(/começa com (a sílaba )?(\w+)\?/i.test(p))return aj('Fale cada opção devagar e escute o começo: qual começa com o som pedido?','A resposta é '+a+'.');
  if(/qual palavra tem (\d+ sílabas|LH|NH|Ç|acento|som)/i.test(p))return aj('Fale cada opção em voz alta e preste atenção no que a pergunta pede: o som, as letras ou as sílabas.','A resposta é '+a+'.');
  if(/som de (s|z|k|w|x|ss)|c ou ç|r ou rr|s ou ss|som forte|entre vogais|\bch\b|-agem|antes de p e b|depois de en|o ç|som “/i.test(p)||/__/.test(p))return aj('Fale a palavra inteira em voz alta e escute o som da parte que falta. Lembre a regra da aula para esse som.','A resposta é '+a+'.');
  if(/acento|sílaba forte|til/i.test(p))return aj('Fale a palavra e sinta qual pedaço sai mais forte. O acento marca a sílaba forte, e o til deixa o som nasal.','A resposta é '+a+'.');
  if(/plural/i.test(p))return aj('Plural é quando falamos de mais de um. Quase sempre a palavra ganha S no fim; palavras em ÃO e em L mudam de outro jeito.','O plural é '+a+'.');
  if(/feminino|masculino/i.test(p))return aj('Pense em "o" ou "a" na frente da palavra: o menino, a menina. Muitas vezes o feminino troca o final por A.','A resposta é '+a+'.');
  if(/verbo|ação|o que ele faz/i.test(p))return aj('Verbo é a palavra da ação: o que alguém faz ou o que acontece. Procure a palavra que dá para fazer.','A resposta é '+a+'.');
  if(/adjetivo|como uma coisa é|como é/i.test(p))return aj('Adjetivo diz como a coisa é: grande, vermelho, feliz. Procure a palavra que descreve.','A resposta é '+a+'.');
  if(/substantivo|nome de uma coisa|nome próprio|nome comum|nome de quê|maiúscula|minúscula/i.test(p))return aj('Substantivo é nome de coisa, gente, lugar ou bicho. Nome próprio (de pessoa, cidade, cachorro) começa com maiúscula.','A resposta é '+a+'.');
  if(/artigo/i.test(p))return aj('Artigo é a palavrinha que vem antes: o, a, os, as, um, uma. Combine com a palavra: masculino ou feminino, um ou vários.','A resposta é '+a+'.');
  if(/vírgula|ponto|interroga|exclama|sinal|travessão|dois-pontos|fala de um personagem|lista/i.test(p))return aj('Pense no que a frase faz: pergunta termina com ?, surpresa com !, afirmação com ponto. O travessão mostra quem fala; a vírgula separa itens.','A resposta é '+a+'.');
  if(/onde|quando|o que|quem|como|por quê|motivo|deu errado|a que horas|o que .* encontrou|o que .* esquecer|foi fazer|quem escreveu|passo \d|receita|bilhete|cenário|personagem|história|quant[ao]s colheres|quanto tempo/i.test(p))return aj('A resposta está no texto que você leu. Volte ao texto e procure a parte que fala disso.','A resposta é '+a+'.');
  if(/frase/i.test(p))return aj('Leia cada opção em voz alta. A frase certa soa natural, começa com maiúscula e termina com um sinal.','A resposta é '+a+'.');
  if(/ouça/i.test(p))return aj('Toque no alto-falante de novo e escute com atenção. Depois leia cada opção devagar e compare com o som.','A resposta é '+a+'.');
  if(/está (certo|errado|escrit)|correta|corretamente|escreve|errada/i.test(p))return aj('Leia cada opção devagar, letra por letra, e compare com o jeito que a aula mostrou.','A resposta é '+a+'.');
  if(q.type==='texto')return aj('Fale a palavra devagar e escreva um som de cada vez. Ela tem '+String(a).length+' letras.','A resposta é '+a+'.');
  if(/primeira do alfabeto|última do alfabeto/i.test(p))return aj('Cante o alfabeto desde o A e veja onde a letra Z aparece: no começo, no meio ou no fim.',a+': o A é a primeira letra do alfabeto e o Z é a última.');
  if(/contrário de/i.test(p))return aj('Pense no par: bom e mau, bem e mal. Mau é o contrário de bom (adjetivo); mal é o contrário de bem.','A frase é '+a.toLowerCase()+'.');
  if(/está correto|está correta|também está correta/i.test(p)&&asp)return aj('Leia "'+asp+'" em voz alta e veja se as palavras combinam entre si (menino alto, menina alta).','A frase é '+a.toLowerCase()+'.');
  if(q.tf)return aj('Leia a frase de novo: '+p+' Compare com a regra da aula. Se combina, é verdadeira; se contradiz, é falsa.','A frase é '+a.toLowerCase()+'.');
  if(w){const r=aj('Olhe com atenção para '+w+' e leia a pergunta de novo: ela pede uma coisa só. Compare cada opção com isso.','A resposta é '+a+'.');r.fraco=true;return r;}
  return null;
}
function ajudaEn(q,p,a,n){
  let m;const b=AJ_B(q.prompt),asp=AJ_ASPAS(p);
  if(q.type==='texto'&&(m=p.match(/escreva em inglês: (.+)$/i)))return aj('A palavra para '+m[1].trim()+' tem '+String(a).length+' letras e começa com '+String(a).charAt(0).toUpperCase()+'. Lembre do som da aula.','Em inglês, '+m[1].trim()+' é '+a+'.');
  if((m=p.match(/como se diz (.+?)(?: em inglês)?\?/i)))return aj('Lembre da aula: pense em '+m[1].trim()+' e na palavra em inglês que apareceu junto. Se tiver som, aperte e escute.',m[1].trim()+' em inglês é '+a+'.');
  if(/o que significa|quer dizer/i.test(p)){const w2=b||asp||p.split(' ')[0];return aj('Pense em que situação '+w2+' apareceu na aula. A tradução é uma das opções.',w2+' quer dizer '+a+'.');}
  if(/complete a frase/i.test(p)&&/em português/i.test(p))return aj('A tradução está embaixo. Compare as duas frases palavra por palavra e ache a que falta em inglês.','A palavra que falta é '+a+'.');
  if(/quase igual em português|parecida com o português/i.test(p))return aj('Algumas palavras em inglês se escrevem quase como em português. Leia cada opção e veja qual você reconhece.','A resposta é '+a+'.');
  if(/ouça/i.test(p))return aj('Toque no alto-falante de novo e escute com atenção. Depois compare o som com cada opção.','A resposta é '+a+'.');
  if(/no passado/i.test(p))return aj('Verbo no passado em inglês quase sempre ganha ed no fim; alguns mudam de forma, como go e went.','No passado fica '+a+'.');
  if(/o que você (responde|diz)|como se pede|educadamente|alguém/i.test(p))return aj('Pense no que você diria em português nessa situação e procure a mesma ideia em inglês.','A resposta é '+a+'.');
  if(/toque em|escrito em inglês/i.test(p)&&b)return aj('A resposta está escrita na própria pergunta: procure '+b+' entre as opções.','É '+a+'.');
  if(/som certo|se fala|fala-se/i.test(p))return aj('Fale cada opção em voz alta e escute qual soa como a palavra da aula.','A resposta é '+a+'.');
  if(b||asp){const r=aj('Lembre onde '+(b||asp)+' apareceu na aula e o que estava perto. Compare cada opção com isso.','A resposta é '+a+'.');r.fraco=true;return r;}
  return null;
}
function ajudaDe(q){
  if(!q)return aj('Leia a pergunta de novo devagar.','','generica');
  const a=AJ_TXT(q.answer),p=AJ_TXT(q.prompt),n=AJ_NUMS(p);
  if(q.dica)return aj(AJ_TXT(q.dica)?String(q.dica):'', 'A resposta é '+a+'.','maker');
  if(q.type==='blocos'){const v=+a,c=Math.floor(v/100),d=Math.floor((v%100)/10),u=v%10;const pt=[];if(c)pt.push(c+' placa'+(c>1?'s':''));if(d)pt.push(d+' barrinha'+(d>1?'s':''));if(u)pt.push(u+' cubinho'+(u>1?'s':''));
    return aj('Separe '+v+' em centenas, dezenas e unidades. Toque no + de cada coluna essa quantidade de vezes e olhe o número lá embaixo.','Para montar '+v+': '+pt.join(', ')+'.');}
  if(q.type==='fracao')return aj('Conte as partes da barra e pinte só a quantidade que a fração pede, contando em voz alta: 1, 2, 3...','Pinte '+a+' partes.');
  if(q.type==='grupinhos')return aj('Coloque '+q.alvoG+' em grupos e '+q.alvoP+' em cada um. O total aparece sozinho.',q.alvoG+' grupos de '+q.alvoP+' dão '+a+'.');
  if(q.type==='dinheiro')return aj('Comece pelas notas maiores e vá completando com as moedas até o visor chegar ao valor pedido.','O valor é '+a+'.');
  const mat=typeof MATERIA==='string'?MATERIA:'mat';
  const materia=q.lang==='en-US'||/em inglês|english/i.test(p)?'en':(mat==='pt'||/sílaba|vogal|letra|palavra|frase/i.test(p)?'pt':mat);
  /* a matéria da tela vai primeiro; se ela só tiver um modelo fraco, as outras tentam antes (a pergunta pode ser de revisão de outra matéria) */
  const fns={en:ajudaEn,pt:ajudaPt,mat:ajudaMat},ordem=[materia].concat(['mat','pt','en'].filter(k=>k!==materia));
  let fraco=null;
  for(const k of ordem){let r=null;try{r=fns[k](q,p,a,n);}catch(e){r=null;}if(r&&!r.fraco)return r;if(r&&!fraco)fraco=r;}
  if(fraco){delete fraco.fraco;return fraco;}
  return aj('Leia a pergunta de novo com calma e pense no que ela pede. Compare cada opção com isso.','A resposta é '+a+'.','generica');
}
