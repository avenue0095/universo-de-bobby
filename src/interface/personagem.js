/* ---------- o personagem: Bobby, o ursinho ---------- */
const PECAS={
 chapeu:{
  bone:{n:'Boné azul',p:120,c:['#2C6FD1','#1B4E9B'],
    d:'<path d="M20 36a41 30 0 0 1 82 0Z" fill="var(--c1)"/><path d="M96 36h22a6 6 0 0 1 0 10H96Z" fill="var(--c2)"/>'},
  festa:{n:'Chapéu de festa',p:180,c:['#F0455F','#FFD84D'],
    d:'<path d="M61 -6 84 34H38Z" fill="var(--c1)"/><circle cx="61" cy="-8" r="8" fill="var(--c2)"/><circle cx="52" cy="18" r="4" fill="var(--c2)"/><circle cx="70" cy="26" r="4" fill="var(--c2)"/>'},
  chef:{n:'Chapéu de chef',p:240,c:['#FFFFFF','#E4E9F2'],
    d:'<path d="M30 36V16a15 15 0 0 1 24-9 16 16 0 0 1 26 0 15 15 0 0 1 24 9v20Z" fill="var(--c1)" stroke="var(--c2)" stroke-width="2"/><rect x="30" y="30" width="62" height="10" rx="4" fill="var(--c2)"/>'},
  espacial:{n:'Capacete espacial',p:400,c:['#BFD4EE','#8FB4E0'],
    d:'<circle cx="61" cy="62" r="54" fill="none" stroke="var(--c1)" stroke-width="6" opacity=".9"/><path d="M112 52l14-6v26Z" fill="var(--c2)"/>'},
  pirata:{n:'Chapéu de pirata',p:320,c:['#2B3A55','#FFD84D'],
    d:'<path d="M14 38q47-34 94 0q-47 12-94 0Z" fill="var(--c1)"/><circle cx="61" cy="24" r="7" fill="var(--c2)"/>'},
  coroa:{n:'Coroa do rei',p:600,c:['#F2B617','#FF6B8A'],
    d:'<path d="M22 34 28 2l16 16L61 -2l17 20 16-16 6 32Z" fill="var(--c1)"/><circle cx="44" cy="20" r="5" fill="var(--c2)"/><circle cx="78" cy="20" r="5" fill="var(--c2)"/>'}
 },
 rosto:{
  oculos:{n:'Óculos redondos',p:150,c:['#2B3A55','#2B3A55'],
    d:'<circle cx="44" cy="58" r="16" fill="none" stroke="var(--c1)" stroke-width="4.5"/><circle cx="78" cy="58" r="16" fill="none" stroke="var(--c1)" stroke-width="4.5"/><path d="M60 58h2M12 54l16 4M110 54l-16 4" stroke="var(--c1)" stroke-width="4.5" fill="none" stroke-linecap="round"/>'},
  sol:{n:'Óculos de sol',p:220,c:['#1D2739','#3E5A86'],
    d:'<path d="M24 48h74l-4 16a13 13 0 0 1-24 3 8 8 0 0 0-18 0 13 13 0 0 1-24-3Z" fill="var(--c1)"/><path d="M28 52h20l-2 8Z" fill="var(--c2)"/>'},
  heroi:{n:'Máscara de herói',p:280,c:['#F0455F','#FFD84D'],
    d:'<path d="M20 46h82l-6 22H26Z" fill="var(--c1)"/><circle cx="44" cy="58" r="10" fill="#fff"/><circle cx="78" cy="58" r="10" fill="#fff"/><circle cx="44" cy="58" r="5" fill="var(--m-olho)"/><circle cx="78" cy="58" r="5" fill="var(--m-olho)"/>'},
  tapaolho:{n:'Tapa-olho',p:200,c:['#1D2739','#1D2739'],
    d:'<path d="M8 44 96 52" stroke="var(--c1)" stroke-width="4" fill="none"/><rect x="66" y="46" width="26" height="22" rx="8" fill="var(--c1)"/>'}
 },
 pescoco:{
  cachecol:{n:'Cachecol',p:180,c:['#E14D5A','#FFD84D'],
    d:'<path d="M18 96q43 22 86 0l4 16q-45 22-94 0Z" fill="var(--c1)"/><path d="M96 108l10 26h14l-10-28Z" fill="var(--c2)"/>'},
  gravata:{n:'Gravata-borboleta',p:140,c:['#7B5BE0','#5B3FC0'],
    d:'<path d="M61 108 40 96v24Zm0 0 21-12v24Z" fill="var(--c1)"/><circle cx="61" cy="108" r="7" fill="var(--c2)"/>'},
  medalha:{n:'Medalha de ouro',p:350,c:['#F2B617','#FFE59B'],
    d:'<path d="M48 92 58 112M74 92 64 112" stroke="var(--c1)" stroke-width="5" fill="none"/><circle cx="61" cy="118" r="13" fill="var(--c1)"/><circle cx="61" cy="118" r="7" fill="var(--c2)"/>'},
  capa:{n:'Capa de herói',p:450,c:['#2C6FD1','#7FB2F0'],atras:true,
    d:'<path d="M18 44q43 26 86 0l14 78q-57 22-114 0Z" fill="var(--c1)"/><path d="M42 46q19 10 38 0l6 74q-25 8-50 0Z" fill="var(--c2)" opacity=".55"/>'}
 },
 pelo:{
  mel:{n:'Pelo mel',p:100,cor:'#D9A24A'},
  cinza:{n:'Pelo cinza',p:150,cor:'#8C93A3'},
  panda:{n:'Pelo panda',p:260,cor:'#2E3849'},
  polar:{n:'Pelo polar',p:300,cor:'#E7EDF7'},
  rosa:{n:'Pelo rosa',p:220,cor:'#E7789A'},
  choco:{n:'Chocolate',p:180,cor:'#7A4A25'}
 }
};
const PERS={
 bobby:{n:'Bobby',tipo:'ursinho',p:0,cor:'#A9713F',
  topo:'<circle cx="28" cy="34" r="18" fill="var(--m1)"/><circle cx="94" cy="34" r="18" fill="var(--m1)"/>'+
       '<circle cx="28" cy="34" r="9" fill="var(--m3)"/><circle cx="94" cy="34" r="9" fill="var(--m3)"/>',extra:''},
 nina:{n:'Nina',tipo:'coelhinha',p:180,cor:'#E7B7C6',
  topo:'<ellipse cx="34" cy="14" rx="11" ry="26" fill="var(--m1)"/><ellipse cx="88" cy="14" rx="11" ry="26" fill="var(--m1)"/>'+
       '<ellipse cx="34" cy="16" rx="5" ry="17" fill="var(--m3)"/><ellipse cx="88" cy="16" rx="5" ry="17" fill="var(--m3)"/>',extra:''},
 pim:{n:'Pim',tipo:'gatinho',p:220,cor:'#8C93A3',
  topo:'<path d="M14 40 20 8l26 16Z" fill="var(--m1)"/><path d="M108 40 102 8 76 24Z" fill="var(--m1)"/>'+
       '<path d="M22 34 25 18l13 8Z" fill="var(--m3)"/><path d="M100 34 97 18 84 26Z" fill="var(--m3)"/>',
  extra:'<g stroke="var(--m-olho)" stroke-width="2.4" stroke-linecap="round" opacity=".7">'+
        '<path d="M28 78h-16M28 86h-16M94 78h16M94 86h16"/></g>'},
 zeca:{n:'Zeca',tipo:'macaquinho',p:260,cor:'#8A5A2E',
  topo:'<circle cx="20" cy="58" r="16" fill="var(--m1)"/><circle cx="102" cy="58" r="16" fill="var(--m1)"/>'+
       '<circle cx="20" cy="58" r="8" fill="var(--m3)"/><circle cx="102" cy="58" r="8" fill="var(--m3)"/>',
  extra:'<path d="M61 30q-26 4-26 26h52q0-22-26-26Z" fill="var(--m3)" opacity=".55"/>'},
 lulu:{n:'Lulu',tipo:'corujinha',p:320,cor:'#7B8FB5',
  topo:'<path d="M20 34 30 12l16 14Z" fill="var(--m1)"/><path d="M102 34 92 12 76 26Z" fill="var(--m1)"/>',
  extra:'<circle cx="44" cy="58" r="18" fill="none" stroke="var(--m3)" stroke-width="4"/>'+
        '<circle cx="78" cy="58" r="18" fill="none" stroke="var(--m3)" stroke-width="4"/>'}
};
const SLOTS=[['pers','Personagem'],['chapeu','Chapéus'],['rosto','No rosto'],['pescoco','No pescoço'],['pelo','Cor do pelo']];
function pecaSVG(slot,id){
  const it=PECAS[slot]&&PECAS[slot][id];
  if(!it||!it.d)return '';
  return '<g style="--c1:'+it.c[0]+';--c2:'+it.c[1]+'">'+it.d+'</g>';
}
function MASC(exp,cls,look){
  const e=exp||'oi';
  const L=look||(typeof S!=='undefined'&&S.look)||{};
  const P0=PERS[L.pers]||PERS.bobby;
  const corPelo=(PECAS.pelo[L.pelo]&&PECAS.pelo[L.pelo].cor)||(L.pers&&P0.cor)||null;
  const olhosAb='<circle cx="44" cy="58" r="12" fill="#fff"/><circle cx="78" cy="58" r="12" fill="#fff"/>';
  const pup=(dx,dy)=>'<circle cx="'+(44+dx)+'" cy="'+(58+dy)+'" r="5.6" fill="var(--m-olho)"/>'+
    '<circle cx="'+(78+dx)+'" cy="'+(58+dy)+'" r="5.6" fill="var(--m-olho)"/>'+
    '<circle cx="'+(42+dx)+'" cy="'+(56+dy)+'" r="2" fill="#fff"/>'+
    '<circle cx="'+(76+dx)+'" cy="'+(56+dy)+'" r="2" fill="#fff"/>';
  let olhos,boca;
  if(e==='feliz'){
    olhos='<path d="M36 60q8-11 16 0" fill="none" stroke="var(--m-olho)" stroke-width="4.6" stroke-linecap="round"/>'+
          '<path d="M70 60q8-11 16 0" fill="none" stroke="var(--m-olho)" stroke-width="4.6" stroke-linecap="round"/>';
    boca='<path d="M50 86q11 15 22 0Z" fill="var(--m-olho)"/><path d="M56 94q5 5 10 0Z" fill="#FF9AA8"/>';
  }else if(e==='ops'){
    olhos=olhosAb+pup(0,3);
    boca='<path d="M52 96q9-9 18 0" fill="none" stroke="var(--m-olho)" stroke-width="4" stroke-linecap="round"/>';
  }else if(e==='pensa'){
    olhos=olhosAb+pup(-3,-4);
    boca='<ellipse cx="61" cy="90" rx="5" ry="5.5" fill="var(--m-olho)"/>';
  }else{
    olhos=olhosAb+pup(0,1);
    boca='<path d="M61 82v6"/><path d="M61 88q-8 9-16 1" fill="none" stroke="var(--m-olho)" stroke-width="3.6" stroke-linecap="round"/>'+
         '<path d="M61 88q8 9 16 1" fill="none" stroke="var(--m-olho)" stroke-width="3.6" stroke-linecap="round"/>';
  }
  const pesc=L.pescoco||'',atras=PECAS.pescoco[pesc]&&PECAS.pescoco[pesc].atras;
  return '<svg class="mascote '+(cls||'')+'" viewBox="0 0 122 140" role="img" aria-label="Bobby, o ursinho"'+
    (corPelo?' style="--m1:'+corPelo+'"':'')+'>'+
    (atras?pecaSVG('pescoco',pesc):'')+P0.topo+
    '<ellipse cx="34" cy="116" rx="15" ry="9" fill="var(--m3)"/><ellipse cx="88" cy="116" rx="15" ry="9" fill="var(--m3)"/>'+
    '<rect x="13" y="26" width="96" height="88" rx="44" fill="var(--m1)"/>'+
    '<ellipse cx="61" cy="88" rx="30" ry="21" fill="var(--m3)"/>'+
    '<circle cx="26" cy="76" r="7.5" fill="#FF9AA8" opacity=".7"/>'+
    '<circle cx="96" cy="76" r="7.5" fill="#FF9AA8" opacity=".7"/>'+
    (L.pers==='lulu'?'<path d="M61 66 74 82H48Z" fill="#F2B617"/>':'<ellipse cx="61" cy="74" rx="11" ry="8.5" fill="var(--m-olho)"/>')+
    P0.extra+olhos+'<g stroke="var(--m-olho)" stroke-width="3.6" stroke-linecap="round" fill="none">'+boca+'</g>'+
    (atras?'':pecaSVG('pescoco',pesc))+pecaSVG('rosto',L.rosto)+pecaSVG('chapeu',L.chapeu)+
    '</svg>';
}

