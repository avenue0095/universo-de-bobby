/* ===== Desenhos para colorir: UM por etapa concluída (30 no total: 10 por matéria) =====
   Os nomes vêm de docs/CENARIOS-E-DESENHOS.md (seção 7). O arquivo da imagem é des-<matéria><NN>, ex.: des-mat01.
   A matéria usa o código do DESIGN.md (mat, por, ing). Se a arte ainda não chegou (não está em ATIVOS), a galeria mostra
   o planeta em contorno com o aviso "em breve": o direito ao desenho vale desde já. */
const DESENHOS_NOMES={
  mat:['A horta do Bobby','O tesouro da praia','A caravana do deserto','O piquenique da floresta','A pizzaria da montanha',
       'A feira da cidade','A loja de descontos','O parquinho novo','A oficina de foguetes','A festa no castelo'],
  por:['A caixa de letras','O trem das sílabas','A feira das palavras','A oficina dos sons','O correio das frases',
       'O mercado dos nomes','O teatro das ações','A gráfica','O jardim dos acentos','A biblioteca'],
  ing:['Chegando na cidade','A escola nova','A família que recebe','Um dia no zoológico','No restaurante',
       'A loja de roupas','Lar doce lar','Um dia na cidade','Fazendo amigos','Falando como um local']
};
/* código de matéria do app (mat, pt, en) para o do DESIGN.md */
const COD_DESENHO={mat:'mat',pt:'por',en:'ing'};
function desenhoIdDe(matApp,n){return 'des-'+COD_DESENHO[matApp]+('0'+n).slice(-2);}
/* todos os 30, na ordem do mapa: [{id,matApp,cod,n,nome}] */
function desenhosCatalogo(){
  const r=[];
  ['mat','pt','en'].forEach(m=>{
    const cod=COD_DESENHO[m];
    DESENHOS_NOMES[cod].forEach((nome,i)=>r.push({id:desenhoIdDe(m,i+1),matApp:m,cod:cod,n:i+1,nome:nome}));
  });
  return r;
}
