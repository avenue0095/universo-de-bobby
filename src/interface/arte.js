/* ---------- arte: imagens WebP de assets/ (índice ATIVOS embutido pelo build) ----------
   Regras do DESIGN.md: toda imagem tem width e height (sem pulo de layout), carrega preguiçosa e decodifica fora da thread principal.
   Imagem decorativa tem alt vazio; imagem que informa recebe texto. Se a imagem falhar, o bloco fica neutro e o jogo segue. */
const ARTE_BASE='./assets/';
function ativo(id){return (typeof ATIVOS!=='undefined'&&ATIVOS[id])||null;}
function imgArte(id,o){
  o=o||{};const a=ativo(id);if(!a)return '';
  return '<img class="arte'+(o.cls?' '+o.cls:'')+'" src="'+ARTE_BASE+a[0]+'" width="'+a[1]+'" height="'+a[2]+'" alt="'+escapa(o.alt||'')+
    '" decoding="async" loading="'+(o.eager?'eager':'lazy')+'"'+(o.style?' style="'+o.style+'"':'')+
    ' onerror="this.classList.add(\'falhou\')">';
}

/* planeta e guia de cada matéria (código do app: mat, pt, en) */
const PLANETAS={
  mat:{n:'Numeral',img:'planeta-mat',guia:'teo',guiaNome:'Teo',cena:'mat'},
  pt:{n:'Fábula',img:'planeta-por',guia:'rufa',guiaNome:'Rufa',cena:'por'},
  en:{n:'Horizonte',img:'planeta-ing',guia:'otto',guiaNome:'Otto',cena:'ing'}
};
const COMPANHEIROS=[
  {id:'teo',n:'Teo',quem:'o robô explorador',fala:'Guia de Matemática'},
  {id:'rufa',n:'Rufa',quem:'a raposa ruiva',fala:'Guia de Português'},
  {id:'otto',n:'Otto',quem:'a lontra viajante',fala:'Guia de Inglês'},
  {id:'brisa',n:'Brisa',quem:'a dragoa do ar',fala:'Gosta de desafios'},
  {id:'capi',n:'Capi',quem:'a capivara',fala:'Cuida de quem precisa de calma'},
  {id:'fagulha',n:'Fagulha',quem:'a vaga-lume',fala:'Leva os bilhetes'}
];
/* cenário da etapa n (1 a 10) da matéria: o par apagado/completo, se a arte já existe */
function cenaDaEtapa(mat,n){
  const cod=(PLANETAS[mat]||PLANETAS.mat).cena,k=('0'+n).slice(-2);
  const ap='cen-'+cod+k+'-apagado',co='cen-'+cod+k+'-completo';
  return (ativo(ap)&&ativo(co))?{apagado:ap,completo:co}:null;
}
