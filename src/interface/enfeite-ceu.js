/* ---------- céu de galáxia: enfeites grandes (as estrelas são CSS) ---------- */
(function enfeitesDoCeu(){
  const alvo=document.getElementById('ceu');
  if(!alvo)return;
  const planeta=(x,y,r,anel)=>'<svg class="planeta" style="left:'+x+'%;top:'+y+'%" width="'+(r*(anel?3.6:2.4))+
    '" height="'+(r*2.6)+'" viewBox="'+(anel?'-34 -24 68 48':'-24 -24 48 48')+'">'+
    '<circle r="'+r+'" fill="var(--estrela2)"/>'+
    (anel?'<ellipse rx="'+(r*1.9)+'" ry="'+(r*.52)+'" fill="none" stroke="var(--estrela3)" stroke-width="2.4" transform="rotate(-18)"/>':'')+
    '</svg>';
  const lua=(x,y,r)=>'<svg class="planeta" style="left:'+x+'%;top:'+y+'%" width="'+(r*2.6)+'" height="'+(r*2.6)+
    '" viewBox="-16 -16 32 32"><path d="M6 -11a13 13 0 1 0 0 22 15 15 0 0 1 0-22Z" fill="var(--estrela3)"/></svg>';
  alvo.innerHTML=planeta(7,64,12,true)+planeta(88,76,7,false)+lua(82,8,9)+planeta(26,30,5,false);
})();

