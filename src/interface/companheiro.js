/* ---------- B2 · o companheiro evolui de graça (decisão do Filipe, P10, 09/11/2026) ----------
   3 estágios só por uso: cada resposta dada com o companheiro junto vale 1 ponto de companhia; o petisco do dia vale 5 (1 por dia conta).
   Estágio 1 (Amigo) de 0 a 299, estágio 2 (Grande amigo) de 300 a 999, estágio 3 (Melhor amigo) a partir de 1.000. Nunca cai, nunca cobra,
   nenhum texto de fome, tristeza ou saudade. O que se compra é só o acessório de cada companheiro (PRECOS.acessorio), que abre no estágio 2.
   Arte: sem imagem nova; o estágio aparece como um selo desenhado no código sobre o retrato e o acessório como um lenço em SVG
   (pedido de arte definitiva em arte/PEDIDOS-DE-ARTE.md). */
const COMPANHIA={estagio2:300,estagio3:1000,porResposta:1,porPetisco:5};
const NOME_ESTAGIO=['','Amigo','Grande amigo','Melhor amigo'];
function companhiaDe(id){const a=(S.amizade||{})[id];return a?(a.u||0)*COMPANHIA.porResposta+(a.xp||0)*COMPANHIA.porPetisco:0;}
function estagioDe(id){const x=companhiaDe(id);return x>=COMPANHIA.estagio3?3:(x>=COMPANHIA.estagio2?2:1);}
/* chamado a cada resposta: só conta se há um companheiro escolhido e comprado */
function companhiaResposta(){
  const c=S.look&&S.look.companheiro;if(!c||(S.comprado||[]).indexOf(c)<0)return 0;
  S.amizade=S.amizade||{};const a=S.amizade[c]||(S.amizade[c]={xp:0,dia:'',u:0});
  const antes=estagioDe(c);a.u=(a.u||0)+1;const depois=estagioDe(c);
  return depois>antes?depois:0;
}
const acessorioDe=id=>'aces-'+id;
const acessorioVestido=id=>!!(S.acessorioComp&&S.acessorioComp[id]);
/* selo do estágio e lenço do acessório, desenhados no código (classes com tokens) */
function seloEstagio(id){
  const e=estagioDe(id);if(e<2)return '';
  return '<svg class="selo-estagio e'+e+'" viewBox="0 0 40 40" role="img" aria-label="'+NOME_ESTAGIO[e]+'"><circle class="se-a" cx="20" cy="20" r="18"/>'+
    (e===3?'<path class="se-b" d="m20 7 4 8 9 1-7 6 2 9-8-5-8 5 2-9-7-6 9-1Z"/>':'<path class="se-b" d="M12 21l5 5 11-11" fill="none" stroke-width="4"/>')+'</svg>';
}
function lencoComp(id){
  return acessorioVestido(id)?'<svg class="lenco-comp" viewBox="0 0 120 70" aria-hidden="true"><path class="lc-a" d="M4 6h112L60 66Z"/><circle class="lc-b" cx="60" cy="14" r="7"/></svg>':'';
}
/* retrato do companheiro com o lenço e o selo (as camadas sobre a imagem da pose) */
function compComCamadas(id,pose,cls,alt){
  const extra=lencoComp(id)+seloEstagio(id);
  const img=imgArte(id+'-'+pose,{cls:extra?'':cls,alt:alt||''});
  return extra?'<span class="comp-camadas'+(cls?' '+cls:'')+'">'+img+extra+'</span>':img;
}
function vestirAcessorioComp(id,on){
  if(on&&(S.comprado||[]).indexOf(acessorioDe(id))<0)return false;
  S.acessorioComp=Object.assign({},S.acessorioComp);if(on)S.acessorioComp[id]=true;else delete S.acessorioComp[id];return true;
}
/* bloco do companheiro na tela Meu personagem: estágio, pontos de companhia e o acessório */
function amizadeHTML(c){
  const e=estagioDe(c.id),x=companhiaDe(c.id),prox=e===1?COMPANHIA.estagio2:(e===2?COMPANHIA.estagio3:0),aid=acessorioDe(c.id),tem=(S.comprado||[]).indexOf(aid)>=0;
  let h='<span class="tipo">'+NOME_ESTAGIO[e]+(prox?' · '+x+' de '+prox+' pontos de companhia':'')+'</span>';
  if(tem)h+='<button class="btn-sec" data-aces="'+c.id+'">'+(acessorioVestido(c.id)?'Tirar o lenço':'Usar o lenço')+'</button>';
  else h+=botaoPreco(aid);
  return h;
}
