/* ===== Treinar por tema (item 5 da engenharia reversa) e programa de 20 dias (item 7) =====
   Um tema junta fases (todos os geradores delas) ou geradores soltos das aulas básicas e do 3º ano. "Indicado" = tema da faixa da criança.
   A rodada de treino tem 10 perguntas, com o que a criança ainda não domina vindo primeiro (interface/treino.js). */
const TEMAS={
  mat:[
    {id:'contar',n:'Contar',f:['1.1','1.2'],faixa:['f78']},{id:'dezenas',n:'Dezenas e centenas',f:['1.3','1.4'],faixa:['f78','f910']},
    {id:'somar',n:'Somar',f:['2.1','2.2'],faixa:['f78','f910']},{id:'subtrair',n:'Subtrair',f:['2.3'],faixa:['f78','f910']},
    {id:'historinhas',n:'Historinhas',g:()=>[MAT_BAS.historinhaSoma,MAT_BAS.historinhaTira,MAT_BAS.historinhaReparte,MAT_BAS.historinhaCompara],faixa:['f78','f910']},
    {id:'dinheiro',n:'Dinheiro e troco',g:()=>[MAT_BAS.dinheiro,MAT_BAS.troco],f:['6.4'],faixa:['f78','f910']},
    {id:'relogio',n:'Relógio e tempo',g:()=>[MAT_BAS.relogioHora,MED3.relogioMinutos,MED3.minutosHora,MED3.meiaHora,MED3.duracao,MED3.diaDepois,MED3.mesDepois,MED3.semanaDias],faixa:['f78','f910']},
    {id:'medidas',n:'Medidas',g:()=>[MED3.cmM,MED3.kgG,MED3.litroMl,MED3.qualUnidade,MED3.maisPesado],faixa:['f910']},
    {id:'formas',n:'Formas e padrões',g:()=>[MAT_BAS.formas,MAT_BAS.formaNome,MAT_BAS.padrao],faixa:['f78']},
    {id:'tabuada',n:'Tabuada',f:['3.2','3.3'],faixa:['f910']},{id:'dividir',n:'Dividir',f:['4.1','4.2','4.3'],faixa:['f910','f1112']},
    {id:'fracoes',n:'Frações',f:['5.1','5.2','5.3','5.5'],faixa:['f910','f1112']},{id:'decimais',n:'Decimais',f:['6.1','6.2','6.3'],faixa:['f1112']},
    {id:'porcentagem',n:'Porcentagem',f:['7.1','7.2','7.3'],faixa:['f1112']},{id:'geometria',n:'Perímetro, área e ângulos',f:['8.2','8.3','8.4'],faixa:['f1112']},
    {id:'equacoes',n:'Equações e potências',f:['9.1','9.3','9.4'],faixa:['f1112']}
  ],
  pt:[
    {id:'som-inicial',n:'Som inicial',g:()=>[PT_BAS.somInicial],f:['p1.4'],faixa:['f78']},{id:'vogais',n:'Vogais',f:['p1.1'],g:()=>[PT_BAS.vogalQueFalta],faixa:['f78']},
    {id:'rimas',n:'Rimas',g:()=>[PT_BAS.rima],faixa:['f78']},{id:'silabas',n:'Sílabas',f:['p2.1','p2.5'],g:()=>[PT_BAS.contarSilabas,PT_BAS.juntarSilabas],faixa:['f78']},
    {id:'letra-falta',n:'Letra que falta',g:()=>[PT_BAS.letraQueFalta,PT_BAS.vogalQueFalta],f:['p3.3'],faixa:['f78','f910']},
    {id:'escrita-certa',n:'Escrita certa',g:()=>[PT_BAS.grafiaCerta],f:['p3.5','p8.5'],faixa:['f78','f910']},
    {id:'sons-dificeis',n:'Sons difíceis',f:['p4.1','p4.2','p4.3','p4.4'],faixa:['f910']},{id:'frases',n:'Frases',f:['p5.1','p5.2','p5.3','p5.4'],faixa:['f910']},
    {id:'classes',n:'Nomes, adjetivos e verbos',f:['p6.1','p6.3','p6.4','p7.1','p7.2'],faixa:['f910','f1112']},
    {id:'ortografia',n:'Ç, G e J, X e CH',f:['p8.1','p8.2','p8.3','p8.4'],faixa:['f1112']},{id:'acentos',n:'Acentos e pontuação',f:['p9.1','p9.2','p9.3','p9.4'],faixa:['f1112']},
    {id:'leitura',n:'Leitura de textos curtos',g:()=>[leituraCurta],f:['p10.1','p10.2','p10.4'],faixa:['f910','f1112']}
  ],
  en:[]
};
/* inglês: um tema por etapa (o nome em português), todos indicados para todas as faixas (inglês começa na etapa 1 para todo mundo) */
(function temasDeIngles(){
  UNITS_EN.forEach(u=>{const nome=String(u.title).split('·').pop().trim();TEMAS.en.push({id:'en'+u.n,n:nome,f:u.lessons.map(l=>l.id),faixa:u.n<=5?['f78','f910','f1112']:['f910','f1112']});});
})();
/* programa de 20 dias por planeta, na ordem dos apps de referência (contar, ordem, comparar, formas, somar...), um tema por dia */
const PROGRAMA20={
  mat:['contar','contar','dezenas','formas','somar','somar','subtrair','formas','relogio','historinhas','dezenas','dinheiro','somar','subtrair','tabuada','dividir','historinhas','relogio','medidas','fracoes'],
  pt:['vogais','som-inicial','som-inicial','rimas','silabas','silabas','rimas','letra-falta','letra-falta','escrita-certa','silabas','escrita-certa','sons-dificeis','frases','frases','leitura','classes','leitura','escrita-certa','leitura'],
  en:['en1','en1','en2','en2','en3','en3','en4','en4','en5','en5','en6','en6','en7','en7','en8','en8','en9','en9','en10','en10']
};
