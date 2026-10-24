/* ===== Desenhos para colorir — cada fase tem cena, motivo e moldura próprios ===== */
const DW=600,DH=900;
const g=(c)=>'<g fill="none" stroke="#12233A" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">'+c+'</g>';
const br=(x,y,w,h,r)=>'<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="'+(r||0)+'" fill="#fff"/>';
const ci=(x,y,r)=>'<circle cx="'+x+'" cy="'+y+'" r="'+r+'" fill="#fff"/>';
const tx=(x,y,t,s)=>'<text x="'+x+'" y="'+y+'" font-size="'+(s||26)+'" text-anchor="middle" fill="#12233A" stroke="none" font-family="Fredoka, Nunito, sans-serif">'+t+'</text>';
const T=(x,y,ang)=>'<g transform="translate('+x+','+y+')'+(ang?' rotate('+ang+')':'')+'">';

/* ---------- o Bobby ---------- */
const ACESS={
 0:'',
 1:'<path d="M-30 -66h60" /><ellipse cx="0" cy="-62" rx="26" ry="12" fill="#fff"/>'+
   '<circle cx="-12" cy="-58" r="9" fill="#fff"/><circle cx="12" cy="-58" r="9" fill="#fff"/>'+
   '<path d="M24 -60q16 4 12 26" fill="#fff"/>',
 2:'<ellipse cx="0" cy="-86" rx="46" ry="9" fill="#fff"/><path d="M-22 -86a22 16 0 0 1 44 0Z" fill="#fff"/>',
 3:'<path d="M-30 -84h60l-8-18h-44Z" fill="#fff"/><path d="M-30 -84h60"/>',
 4:'<path d="M-26 -84h52l-4-14a22 22 0 0 0-44 0Z" fill="#fff"/><circle cx="0" cy="-106" r="9" fill="#fff"/>',
 5:'<path d="M-30 -82h60v-10h-60Z" fill="#fff"/><path d="M-22 -92h44v-12h-44Z" fill="#fff"/>',
 6:'<path d="M-28 -82h56l-6-16h-44Z" fill="#fff"/><path d="M-28 -82h56"/><circle cx="0" cy="-104" r="7" fill="#fff"/>',
 7:'<path d="M0 -122 22 -80h-44Z" fill="#fff"/><circle cx="0" cy="-124" r="7" fill="#fff"/>',
 8:'<path d="M-46 -58a46 46 0 0 1 92 0" fill="none"/><path d="M-46 -58a46 46 0 0 0 92 0Z" fill="none" opacity="0"/>'+
   '<circle cx="0" cy="-52" r="52" fill="none"/><path d="M46 -60l18-8v22Z" fill="#fff"/>',
 9:'<path d="M-30 -86h60l-6-10h-48Z" fill="#fff"/><path d="M-30 -86l-6 12h72l-6-12" fill="#fff"/>'+
   '<path d="M-24 -96l6-14 8 10 10-16 10 16 8-10 6 14Z" fill="#fff"/>'
};
function bobbyLinha(x,y,s,ac){
  s=s||1;
  return T(x,y)+'<g transform="scale('+s+')">'+
   ci(-34,-80,17)+ci(34,-80,17)+ci(-34,-80,8)+ci(34,-80,8)+
   '<ellipse cx="-27" cy="2" rx="15" ry="9" fill="#fff"/><ellipse cx="27" cy="2" rx="15" ry="9" fill="#fff"/>'+
   '<rect x="-48" y="-88" width="96" height="88" rx="44" fill="#fff"/>'+
   '<ellipse cx="0" cy="-26" rx="30" ry="21" fill="#fff"/>'+
   ci(-17,-58,12)+ci(17,-58,12)+
   '<circle cx="-17" cy="-57" r="5" fill="#12233A"/><circle cx="17" cy="-57" r="5" fill="#12233A"/>'+
   '<ellipse cx="0" cy="-40" rx="10" ry="7.5" fill="#12233A"/>'+
   '<path d="M0-33v6"/><path d="M0-27q-8 9-15 1"/><path d="M0-27q8 9 15 1"/>'+
   (ACESS[ac]||'')+'</g></g>';
}
function casteloLinha(x,y,s){
  return T(x,y)+'<g transform="scale('+(s||1)+')">'+
   br(-45,-30,90,62,6)+br(-64,-46,26,78,5)+br(38,-46,26,78,5)+
   '<path d="M-64 -46h26l-6-14h-14Z" fill="#fff"/><path d="M38 -46h26l-6-14h-14Z" fill="#fff"/>'+
   '<path d="M-45 -30h90l-9-16H-36Z" fill="#fff"/>'+
   '<path d="M-13 32V4a13 13 0 0 1 26 0v28" fill="#fff"/>'+ci(0,-16,7)+
   '<line x1="0" y1="-46" x2="0" y2="-76"/><path d="M0 -74h26l-8 8 8 8H0Z" fill="#fff"/></g></g>';
}

/* ---------- peças de cenário ---------- */
const PC={
 arvore:(x,y,s)=>T(x,y)+'<g transform="scale('+(s||1)+')">'+br(-5,-22,10,24,3)+ci(0,-38,24)+ci(-18,-26,15)+ci(18,-26,15)+'</g></g>',
 pinheiro:(x,y,s)=>T(x,y)+'<g transform="scale('+(s||1)+')">'+br(-5,-18,10,20,3)+'<path d="M0 -74 22 -40H-22Z" fill="#fff"/><path d="M0 -54 26 -18H-26Z" fill="#fff"/></g></g>',
 arbusto:(x,y,s)=>T(x,y)+'<g transform="scale('+(s||1)+')">'+ci(-14,-10,14)+ci(4,-18,18)+ci(20,-9,13)+'</g></g>',
 flor:(x,y,s)=>T(x,y)+'<g transform="scale('+(s||1)+')"><line x1="0" y1="0" x2="0" y2="-26"/>'+ci(0,-36,9)+ci(-13,-28,9)+ci(13,-28,9)+ci(0,-46,9)+ci(0,-34,6)+'</g></g>',
 palmeira:(x,y,s)=>T(x,y)+'<g transform="scale('+(s||1)+')"><path d="M-5 0q3-34 8-52h5q4 20 5 52Z" fill="#fff"/>'+
   '<ellipse cx="-22" cy="-58" rx="20" ry="8" fill="#fff" transform="rotate(-16 -22 -58)"/>'+
   '<ellipse cx="22" cy="-58" rx="20" ry="8" fill="#fff" transform="rotate(16 22 -58)"/>'+
   '<ellipse cx="0" cy="-68" rx="17" ry="8" fill="#fff"/></g></g>',
 cacto:(x,y,s)=>T(x,y)+'<g transform="scale('+(s||1)+')">'+br(-9,-58,18,58,9)+
   '<path d="M-9 -38h-14a8 8 0 0 0-8 8v10" fill="#fff"/><path d="M9 -46h14a8 8 0 0 1 8 8v6" fill="#fff"/></g></g>',
 montanha:(x,y,s)=>T(x,y)+'<g transform="scale('+(s||1)+')"><path d="M-46 0 -12-56 8-24l10-12L46 0Z" fill="#fff"/><path d="M-12 -56-24-36h24Z" fill="#fff"/></g></g>',
 pedra:(x,y,s)=>T(x,y)+'<g transform="scale('+(s||1)+')"><path d="M-26 0c-6-14 6-26 14-26s24 8 22 26Z" fill="#fff"/></g></g>',
 predio:(x,y,s)=>T(x,y)+'<g transform="scale('+(s||1)+')">'+br(-30,-64,32,64,3)+br(6,-42,26,42,3)+
   br(-24,-56,9,9)+br(-11,-56,9,9)+br(-24,-40,9,9)+br(-11,-40,9,9)+br(12,-34,8,8)+br(22,-34,8,8)+'</g></g>',
 estrela:(x,y,s)=>T(x,y)+'<g transform="scale('+(s||1)+')"><path d="m0-40 10 21 23 3-17 17 5 23-21-11-21 11 5-23-17-17 23-3Z" fill="#fff"/></g></g>',
 planeta:(x,y,s)=>T(x,y)+'<g transform="scale('+(s||1)+')">'+ci(0,-24,22)+'<ellipse cx="0" cy="-22" rx="38" ry="10" transform="rotate(-16 0 -22)"/></g></g>',
 cogumelo:(x,y,s)=>T(x,y)+'<g transform="scale('+(s||1)+')">'+br(-9,-26,18,26,7)+
   '<path d="M-32-26a32 24 0 0 1 64 0Z" fill="#fff"/><circle cx="-12" cy="-36" r="6"/><circle cx="10" cy="-40" r="7"/></g></g>',
 nuvem:(x,y,s)=>T(x,y)+'<g transform="scale('+(s||1)+')"><path d="M-38 0a16 16 0 0 1 4-31 24 24 0 0 1 46-6 18 18 0 0 1 26 17A15 15 0 0 1 26 0Z" fill="#fff"/></g></g>',
 sol:(x,y,s)=>{let r='';for(let i=0;i<10;i++){const a=i*Math.PI/5;
   r+='<line x1="'+(36*Math.cos(a)).toFixed(1)+'" y1="'+(36*Math.sin(a)).toFixed(1)+'" x2="'+(52*Math.cos(a)).toFixed(1)+'" y2="'+(52*Math.sin(a)).toFixed(1)+'"/>';}
   return T(x,y)+'<g transform="scale('+(s||1)+')">'+ci(0,0,30)+r+'</g></g>';},
 passaro:(x,y,s)=>T(x,y)+'<g transform="scale('+(s||1)+')"><path d="M-20 0q10-12 20 0"/><path d="M0 0q10-12 20 0"/></g></g>',
 borboleta:(x,y,s)=>T(x,y)+'<g transform="scale('+(s||1)+')"><path d="M0 0q-24-22-14-30t14 16" fill="#fff"/><path d="M0 0q24-22 14-30T0-14" fill="#fff"/>'+
   '<line x1="0" y1="-16" x2="0" y2="4"/></g></g>',
 peixe:(x,y,s)=>T(x,y)+'<g transform="scale('+(s||1)+')"><path d="M-26 0a26 16 0 0 1 44-12 26 16 0 0 1-44 12Z" fill="#fff"/>'+
   '<path d="M18-11 34-20v20Z" fill="#fff"/><circle cx="-8" cy="-6" r="3" fill="#12233A"/></g></g>',
 barco:(x,y,s)=>T(x,y)+'<g transform="scale('+(s||1)+')"><path d="M-52 0h104l-16 26h-72Z" fill="#fff"/>'+
   '<line x1="0" y1="0" x2="0" y2="-58"/><path d="M4-56 44-16H4Z" fill="#fff"/></g></g>',
 balaoAr:(x,y,s)=>T(x,y)+'<g transform="scale('+(s||1)+')"><path d="M0-96a40 40 0 0 1 0 80 40 40 0 0 1 0-80Z" fill="#fff"/>'+
   '<path d="M-26-40 -14-8M26-40 14-8"/>'+br(-16,-10,32,26,5)+'</g></g>',
 foguete:(x,y,s)=>T(x,y)+'<g transform="scale('+(s||1)+')"><path d="M0-70q22 26 22 52H-22q0-26 22-52Z" fill="#fff"/>'+
   ci(0,-34,10)+'<path d="M-22-6-40 18h22Zm44 0 18 24H22Z" fill="#fff"/><path d="M-10 18q10 22 20 0Z" fill="#fff"/></g></g>',
 ponte:(x,y,s)=>T(x,y)+'<g transform="scale('+(s||1)+')"><path d="M-90 0q90-70 180 0"/><path d="M-90 22q90-70 180 0"/>'+
   '<line x1="-52" y1="-16" x2="-52" y2="6"/><line x1="0" y1="-28" x2="0" y2="-6"/><line x1="52" y1="-16" x2="52" y2="6"/></g></g>',
 bandeirinha:(x,y,n)=>{let r='<path d="M0 0q'+(n*22)+' -18 '+(n*44)+' 0"/>';
   for(let i=0;i<n;i++){const px=i*44+22,py=-14+Math.abs(i-(n-1)/2)*4;
     r+='<path d="M'+px+' '+py+'l14 0-7 20Z" fill="#fff"/>';}
   return T(x,y)+r+'</g>';}
};

/* ---------- cenas ---------- */
const TEMA=[
 {ac:0,p:['arvore','arbusto','flor']},{ac:1,p:['palmeira','pedra','arbusto']},
 {ac:2,p:['cacto','pedra','cacto']},{ac:3,p:['pinheiro','cogumelo','arbusto']},
 {ac:4,p:['montanha','pedra','pinheiro']},{ac:5,p:['predio','arbusto','predio']},
 {ac:6,p:['pedra','montanha','cacto']},{ac:7,p:['arvore','flor','borboleta']},
 {ac:8,p:['estrela','planeta','estrela']},{ac:9,p:['montanha','estrela','pinheiro']}
];
function cenaCaminho(t,f,ac){
  let s=PC.nuvem(112,250,1.1)+PC.nuvem(462,208,.85)+PC.sol(70,180,.7);
  s+='<path d="M40 424q70-26 150-10t150-6 132-14"/>';
  const px=118+f*232;
  for(let i=0;i<9;i++){const u=i/8,x=112+u*300,y=424-Math.sin(u*3.1)*10;
    if(Math.abs(x-px)>44)s+=ci(x.toFixed(0),y.toFixed(0),7);}
  s+=casteloLinha(498,398,1.2)+PC[t.p[0]](52,428,1)+PC[t.p[1]](112,442,.7);
  return s+bobbyLinha(px,418,1.05,ac);
}
function cenaColina(t,f,ac){
  let s=PC.sol(510,190,.9)+PC.nuvem(120,215,1)+PC.passaro(230,196,1.4)+PC.passaro(300,220,1);
  s+='<path d="M20 430q120-120 250-60t310-10"/>';
  s+=PC[t.p[0]](96,392,1.05)+PC[t.p[2]](420,404,.9)+PC.arbusto(500,420,.8);
  s+=casteloLinha(250,352,.62);
  return s+bobbyLinha(120+f*100,388,1.15,ac);
}
function cenaPonte(t,f,ac){
  let s=PC.nuvem(140,206,1)+PC.nuvem(470,240,.8)+PC.sol(80,190,.65);
  s+='<path d="M30 432h160M410 432h160"/>';
  s+='<path d="M190 440q110 44 220 0"/><path d="M215 462q95 30 175 0"/>';
  s+=PC.ponte(300,412,1)+PC[t.p[0]](70,430,.95)+PC[t.p[2]](540,432,.85)+casteloLinha(492,398,.72);
  return s+bobbyLinha(150+f*180,382,1.05,ac);
}
function cenaBalao(t,f,ac){
  let s=PC.nuvem(110,300,1.15)+PC.nuvem(500,250,.9)+PC.sol(80,180,.7)+PC.passaro(300,208,1.2);
  s+='<path d="M20 434q90-16 180-4t180-2 200-10"/>';
  s+=PC[t.p[0]](80,432,.9)+PC[t.p[2]](520,434,.8)+casteloLinha(372,420,.62);
  s+=PC.balaoAr(452,312,1.15);
  return s+bobbyLinha(100+f*118,430,1.1,ac);
}
function cenaViagem(t,f,ac){
  const espaco=(t.ac===8||t.ac===9);
  let s;
  if(espaco){
    s=PC.estrela(80,220,.7)+PC.estrela(520,182,.9)+PC.estrela(258,166,.55)+PC.planeta(468,272,.85);
    s+='<path d="M20 440q140-44 280-4t280-12"/>';
    s+=PC.foguete(430,424,1.15)+PC.pedra(110,438,.8);
  }else{
    s=PC.sol(500,182,.75)+PC.nuvem(130,216,1)+PC.nuvem(430,254,.75);
    s+='<path d="M20 430q60-20 120 0t120 0 120 0 120 0"/><path d="M20 458q60-20 120 0t120 0 120 0 120 0"/>';
    s+=PC.barco(420,414,.95)+PC.peixe(120,462,.8)+PC.peixe(510,466,.65);
  }
  return s+bobbyLinha(190,428,1.05,ac);
}
const CENA_FN=[cenaCaminho,cenaColina,cenaPonte,cenaBalao,cenaViagem];

/* ---------- motivos ---------- */
const M={};
M.peixes=(n)=>{let s=br(70,484,460,300,30);
  for(let i=0;i<n;i++){const c=i%4,r=Math.floor(i/4);
    s+=PC.peixe(140+c*110,548+r*80,1.15);}
  s+='<path d="M90 756q40-16 80 0t80 0 80 0 80 0 80 0"/>';return s;};
M.grupos=(gr,p)=>{let s='';const cols=Math.min(3,gr);
  for(let i=0;i<gr;i++){const c=i%cols,r=Math.floor(i/cols);
    const x=300+(c-(cols-1)/2)*178-80,y=478+r*128;
    s+=br(x,y,160,112,18);
    for(let k=0;k<p;k++){const cc=k%3,rr=Math.floor(k/3);
      s+=ci(x+40+cc*40,y+32+rr*38,15);}}
  return s;};
M.caixaOvos=(dez,un)=>{let s='';
  for(let d=0;d<dez;d++){const x=70+d*(dez>2?170:200),y=480+Math.floor(d/3)*150;
    s+=br(x,y,156,92,14);
    for(let k=0;k<10;k++)s+=ci(x+18+(k%5)*30,y+28+Math.floor(k/5)*36,11);}
  for(let u=0;u<un;u++)s+=ci(90+u*54,700,20);
  return s;};
M.escada=(n)=>{let s='';
  for(let i=0;i<n;i++){const h=40+i*26;
    s+=br(70+i*58,790-h,54,h,6)+tx(97+i*58,780,'',22);}
  return s+'<line x1="60" y1="792" x2="540" y2="792"/>';};
M.trem=(v)=>{let s=br(60,600,120,90,12)+ci(90,700,20)+ci(150,700,20)+br(96,566,44,34,6)+
  '<path d="M110 566v-16"/>'+PC.nuvem(120,520,.6);
  for(let i=0;i<v;i++){const x=200+i*118;s+=br(x,620,104,70,10)+ci(x+24,700,17)+ci(x+80,700,17)+
    br(x+22,638,60,36,6);}
  return s+'<line x1="40" y1="722" x2="560" y2="722"/>';};
M.colar=(n)=>{let s='<path d="M90 520q210 260 420 0"/>';
  for(let i=0;i<n;i++){const u=i/(n-1),x=90+u*420,y=520+Math.sin(u*Math.PI)*195;
    s+=ci(x.toFixed(0),y.toFixed(0),22);}
  return s;};
M.arvoreMacas=(n)=>{let s=br(280,706,40,110,8)+ci(300,600,142);
  for(let i=0;i<n;i++){const a=(i/n)*Math.PI*2,x=300+Math.cos(a)*92,y=600+Math.sin(a)*84;
    s+=ci(x.toFixed(0),y.toFixed(0),24)+'<path d="M'+x.toFixed(0)+' '+(y-24).toFixed(0)+'v-10"/>';}
  return s+'<line x1="170" y1="818" x2="430" y2="818"/>';};
M.jardim=(n)=>{let s='<line x1="50" y1="770" x2="550" y2="770"/>';
  for(let i=0;i<n;i++){const c=i%4,r=Math.floor(i/4);
    s+=PC.flor(110+c*126,760-r*130,1.5);}
  return s;};
M.cestaFrutas=(n)=>{let s='<path d="M140 640h320l-30 130H170Z" fill="#fff"/><path d="M140 640h320"/>'+
  '<path d="M180 640a120 90 0 0 1 240 0"/>';
  for(let i=0;i<n;i++){const c=i%4,r=Math.floor(i/4);
    s+=ci(190+c*76,520+r*72,28);}
  return s;};
M.borboletas=(n)=>{let s='';
  for(let i=0;i<n;i++){const c=i%3,r=Math.floor(i/3);
    s+=PC.borboleta(150+c*150,540+r*130,1.7);}
  return s;};
M.pipa=(n)=>{let s='';
  for(let i=0;i<n;i++){const x=130+i*170,y=596+((i%2)*54);
    s+=T(x,y)+'<path d="M0-70 52 0 0 70-52 0Z" fill="#fff"/><line x1="0" y1="-70" x2="0" y2="70"/>'+
      '<line x1="-52" y1="0" x2="52" y2="0"/></g>'+
      '<path d="M'+x+' '+(y+70)+'q-16 40 8 70t-8 60"/>';}
  return s;};
M.bolo=(f)=>{let s=br(140,600,320,150,14)+'<path d="M140 600q80-40 160 0t160 0"/>';
  for(let i=1;i<f;i++)s+='<line x1="'+(140+320/f*i)+'" y1="600" x2="'+(140+320/f*i)+'" y2="750"/>';
  for(let i=0;i<f;i++){const x=140+320/f*(i+.5);
    s+='<line x1="'+x.toFixed(0)+'" y1="576" x2="'+x.toFixed(0)+'" y2="530"/><path d="M'+x.toFixed(0)+' 530q-9-16 0-26 9 10 0 26Z" fill="#fff"/>';}
  return s;};
M.copos=(n)=>{let s='<path d="M70 500h110l-14 130H84Z" fill="#fff"/><path d="M180 530q34 10 0 40"/>';
  for(let i=0;i<n;i++){const c=i%4,r=Math.floor(i/4);
    s+='<path d="M'+(240+c*82)+' '+(520+r*140)+'h60l-8 92h-44Z" fill="#fff"/>';}
  return s;};
M.relogio=()=>{let s=ci(300,648,155)+ci(300,648,138);
  for(let i=0;i<12;i++){const a=i*Math.PI/6-Math.PI/2;
    s+='<line x1="'+(300+118*Math.cos(a)).toFixed(0)+'" y1="'+(648+118*Math.sin(a)).toFixed(0)+
       '" x2="'+(300+134*Math.cos(a)).toFixed(0)+'" y2="'+(648+134*Math.sin(a)).toFixed(0)+'"/>';}
  return s+'<line x1="300" y1="648" x2="300" y2="558"/><line x1="300" y1="648" x2="370" y2="678"/>'+ci(300,648,9);};
M.regua=()=>{let s=br(60,590,480,110,10);
  for(let i=1;i<16;i++)s+='<line x1="'+(60+30*i)+'" y1="590" x2="'+(60+30*i)+'" y2="'+(i%5===0?640:618)+'"/>';
  return s+br(120,730,360,60,10);};
M.dinheiro=()=>{let s=br(70,500,220,120,12)+ci(180,560,34)+br(310,500,220,120,12)+ci(420,560,34);
  for(let i=0;i<4;i++)s+=ci(130+i*110,720,44)+ci(130+i*110,720,32);
  return s;};
M.domino=()=>{let s='';
  for(let i=0;i<3;i++){const x=90+i*150;
    s+=br(x,540,120,240,14)+'<line x1="'+x+'" y1="660" x2="'+(x+120)+'" y2="660"/>';
    for(let k=0;k<=i;k++)s+=ci(x+40+k*20,590,10);
    for(let k=0;k<=2-i;k++)s+=ci(x+40+k*20,715,10);}
  return s;};
M.foguetes=(n)=>{let s='';
  for(let i=0;i<n;i++)s+=PC.foguete(130+i*110,700,1.15)+PC.estrela(110+i*110,540,.55);
  return s;};
M.pizza=(b,marc)=>{let s=ci(300,630,150)+'<circle cx="300" cy="630" r="128" fill="none"/>';
  for(let i=0;i<b;i++){const a=(i/b)*Math.PI*2-Math.PI/2;
    s+='<line x1="300" y1="630" x2="'+(300+150*Math.cos(a)).toFixed(1)+'" y2="'+(630+150*Math.sin(a)).toFixed(1)+'"/>';}
  for(let i=0;i<(marc||0);i++){const am=((i+.5)/b)*Math.PI*2-Math.PI/2;
    s+=ci((300+92*Math.cos(am)).toFixed(1),(630+92*Math.sin(am)).toFixed(1),13);}
  return s;};
M.barra=(b,t)=>{let s=br(70,560,460,130,16);
  for(let i=1;i<b;i++)s+='<line x1="'+(70+460/b*i)+'" y1="560" x2="'+(70+460/b*i)+'" y2="690"/>';
  return s+(t?tx(300,750,t,30):'');};
M.grade=()=>{let s=br(140,478,320,320,10);
  for(let i=1;i<10;i++)s+='<line x1="'+(140+32*i)+'" y1="478" x2="'+(140+32*i)+'" y2="798"/>'+
    '<line x1="140" y1="'+(478+32*i)+'" x2="460" y2="'+(478+32*i)+'"/>';
  return s;};
M.reta=()=>{let s='<line x1="60" y1="620" x2="540" y2="620"/><path d="M528 608l14 12-14 12"/>';
  for(let i=0;i<9;i++){const x=70+i*57;s+='<line x1="'+x+'" y1="606" x2="'+x+'" y2="634"/>'+br(x-22,656,44,44,8);}
  return s;};
M.formas=()=>br(70,500,150,150,8)+ci(390,575,76)+
  '<path d="M145 830 60 700h170Z" fill="#fff"/><path d="m390 700 76 55-29 90h-94l-29-90Z" fill="#fff"/>';
M.angulos=()=>'<path d="M90 700h200"/><path d="M90 700 250 570"/><path d="M150 700a60 60 0 0 0-18-42"/>'+
  '<path d="M330 700h200"/><path d="M330 700 430 545"/><path d="M390 700a60 60 0 0 0-31-52"/>'+
  tx(190,760,'ângulo 1',24)+tx(430,760,'ângulo 2',24);
M.balanca=()=>'<line x1="300" y1="510" x2="300" y2="750"/><line x1="120" y1="550" x2="480" y2="550"/>'+
  '<path d="M120 550 80 630h80Z" fill="#fff"/><path d="M480 550 440 630h80Z" fill="#fff"/>'+
  '<path d="M240 750h120l14 40H226Z" fill="#fff"/>'+tx(120,612,'x',46)+ci(455,602,18)+ci(505,602,18);
M.grafico=()=>{let s='<line x1="90" y1="800" x2="530" y2="800"/><line x1="90" y1="500" x2="90" y2="800"/>';
  [110,190,150,240].forEach((h,i)=>{s+=br(120+i*100,800-h,70,h,6);});return s;};
M.termometro=()=>{let s=br(270,490,60,270,30)+ci(300,790,46);
  for(let i=0;i<7;i++)s+='<line x1="330" y1="'+(520+i*36)+'" x2="362" y2="'+(520+i*36)+'"/>';
  return s;};
M.dado=()=>{let s=br(90,530,200,200,26)+br(320,530,200,200,26);
  [[150,590],[230,590],[150,670],[230,670],[190,630]].forEach(p=>s+=ci(p[0],p[1],16));
  [[380,590],[460,670],[420,630]].forEach(p=>s+=ci(p[0],p[1],16));
  return s;};
M.quadradoPontos=(n)=>{let s='';
  for(let r=0;r<n;r++)for(let c=0;c<n;c++)s+=br(300-n*32+c*64,520+r*64,58,58,8);
  return s;};
M.doisGrupos=(a,b)=>{let s=br(50,500,230,230,20)+br(320,500,230,230,20);
  const p=(n,x0)=>{let o='';for(let i=0;i<n;i++){const c=i%3,r=Math.floor(i/3);
    o+=ci(x0+55+c*60,548+r*60,23);}return o;};
  return s+p(a,50)+p(b,320);};
M.cestas=(total,gr)=>{let s='';
  for(let i=0;i<gr;i++){const x=300+(i-(gr-1)/2)*(gr>3?125:160);
    s+='<path d="M'+(x-52)+' 690h104l-14 60h-76Z" fill="#fff"/><path d="M'+(x-52)+' 690h104"/>';}
  for(let i=0;i<total;i++){const c=i%6,r=Math.floor(i/6);s+=ci(60+c*88+44,530+r*74,26);}
  return s;};
M.balaoNumeros=(n)=>{let s='';
  for(let i=0;i<n;i++){const c=i%4,r=Math.floor(i/4);const x=120+c*120,y=540+r*140;
    s+='<ellipse cx="'+x+'" cy="'+y+'" rx="46" ry="56" fill="#fff"/><path d="M'+x+' '+(y+56)+'l-9 14h18Z" fill="#fff"/>'+
       '<path d="M'+x+' '+(y+70)+'q14 22 0 44"/>';}
  return s;};

/* ---------- moldura decorativa ---------- */
const MOLDURA=[
 (i)=>PC.estrela(0,0,.28),(i)=>ci(0,0,7),(i)=>PC.flor(0,8,.3),
 (i)=>'<path d="M-7 0 0-8 7 0 0 8Z" fill="#fff"/>',(i)=>PC.nuvem(0,4,.22)
];
function moldura(k){
  const f=MOLDURA[k%MOLDURA.length];let s='';
  for(let i=0;i<11;i++){s+=T(34+i*53,26)+f(i)+'</g>'+T(34+i*53,DH-22)+f(i)+'</g>';}
  for(let i=1;i<14;i++){s+=T(24,40+i*60)+f(i)+'</g>'+T(DW-24,40+i*60)+f(i)+'</g>';}
  return s;
}

/* ---------- o que cada fase gera ---------- */

/* --- objetos das missões e motivos que seguem a história --- */
const OBJ={
 semente:(x,y,e)=>T(x,y)+'<g transform="scale('+(e||1)+')"><ellipse cx="0" cy="4" rx="16" ry="21" fill="#fff"/>'+
   '<path d="M0-17q11-9 17 0"/><path d="M-7 0q7 7 14 0"/></g></g>',
 concha:(x,y,e)=>T(x,y)+'<g transform="scale('+(e||1)+')"><path d="M0 22C-18 22-25 8-25-3a25 25 0 0 1 50 0c0 11-7 25-25 25Z" fill="#fff"/>'+
   '<path d="M0 22-10-16M0 22 0-24M0 22 10-16"/></g></g>',
 gota:(x,y,e)=>T(x,y)+'<g transform="scale('+(e||1)+')"><path d="M0-24c11 15 17 21 17 28a17 17 0 0 1-34 0c0-7 6-13 17-28Z" fill="#fff"/>'+
   '<path d="M-8 8a9 9 0 0 0 5 9"/></g></g>',
 fruta:(x,y,e)=>T(x,y)+'<g transform="scale('+(e||1)+')">'+ci(0,4,20)+'<path d="M0-16v-10"/><path d="M0-22q12-7 17 2"/></g></g>',
 fatia:(x,y,e)=>T(x,y)+'<g transform="scale('+(e||1)+')"><path d="M0-22 22 18H-22Z" fill="#fff"/>'+
   '<path d="M-11 8h22"/>'+ci(0,2,3.5)+ci(-7,13,3.5)+ci(8,13,3.5)+'</g></g>',
 moeda:(x,y,e)=>T(x,y)+'<g transform="scale('+(e||1)+')">'+ci(0,0,21)+ci(0,0,14)+'</g></g>',
 etiqueta:(x,y,e)=>T(x,y)+'<g transform="scale('+(e||1)+')"><path d="M-20-18h18l22 22-20 20-22-22Z" fill="#fff"/>'+ci(-11,-9,4)+'</g></g>',
 peca:(x,y,e)=>T(x,y)+'<g transform="scale('+(e||1)+')">'+br(-19,-19,38,38,7)+ci(0,0,8)+'</g></g>',
 parafuso:(x,y,e)=>T(x,y)+'<g transform="scale('+(e||1)+')"><path d="M-9-22h18v9l-9 7-9-7Z" fill="#fff"/>'+
   br(-6,-6,12,28,4)+'<path d="M-6 2h12M-6 10h12"/></g></g>',
 estrela:(x,y,e)=>T(x,y)+'<g transform="scale('+(e||1)+')"><path d="m0-24 7 15 16 2-12 11 3 16-14-8-14 8 3-16-12-11 16-2Z" fill="#fff"/></g></g>'
};
const ITEM_OK=t=>OBJ[t]?t:'estrela';
M.itens=(n,tipo)=>{
  const f=OBJ[ITEM_OK(tipo)];let s='';
  const cols=n>9?5:(n>6?4:3),lin=Math.ceil(n/cols);
  for(let i=0;i<n;i++){
    const c=i%cols,r=Math.floor(i/cols),nesta=Math.min(cols,n-r*cols);
    s+=f(300+(c-(nesta-1)/2)*(cols>4?100:120),545+r*(lin>3?84:108),cols>4?1.3:1.65);
  }
  return s;
};
M.doisGrupos=(a,b,tipo)=>{
  const f=OBJ[ITEM_OK(tipo)];
  let s=br(46,494,232,246,22)+br(322,494,232,246,22);
  const p=(n,x0)=>{let o='';for(let i=0;i<n;i++){const c=i%3,r=Math.floor(i/3);
    o+=f(x0+52+c*64,544+r*66,1.2);}return o;};
  return s+p(a,46)+p(b,322);
};
M.grupos=(gr,p,tipo)=>{
  const f=OBJ[ITEM_OK(tipo)];let s='';const cols=Math.min(3,gr);
  for(let i=0;i<gr;i++){
    const c=i%cols,r=Math.floor(i/cols);
    const x=300+(c-(cols-1)/2)*178,y=536+r*126;
    s+=br(x-80,y-54,160,110,18);
    for(let k=0;k<p;k++){const cc=k%3,rr=Math.floor(k/3);
      s+=f(x-40+cc*40,y-24+rr*38,.74);}
  }
  return s;
};
M.cestas=(total,gr,tipo)=>{
  const f=OBJ[ITEM_OK(tipo)];let s='';
  for(let i=0;i<gr;i++){const x=300+(i-(gr-1)/2)*(gr>3?125:160);
    s+='<path d="M'+(x-52)+' 700h104l-14 60h-76Z" fill="#fff"/><path d="M'+(x-52)+' 700h104"/>';}
  for(let i=0;i<total;i++){const c=i%6,r=Math.floor(i/6);s+=f(104+c*88,530+r*70,1);}
  return s;
};
M.colar=(n,tipo)=>{
  const f=OBJ[ITEM_OK(tipo)];let s='<path d="M90 520q210 250 420 0"/>';
  for(let i=0;i<n;i++){const u=i/(n-1),x=90+u*420,y=520+Math.sin(u*Math.PI)*190;
    s+=f(x.toFixed(0),y.toFixed(0),.95);}
  return s;
};


/* --- motivos de letras e palavras --- */
const letraOut=(t,x,y,tam)=>'<text x="'+x+'" y="'+y+'" font-size="'+tam+'" text-anchor="middle" fill="#fff" '+
  'stroke="#12233A" stroke-width="3.4" font-family="Fredoka, Nunito, sans-serif" font-weight="600">'+t+'</text>';
M.letra=(L)=>{
  let s=letraOut(String(L).toUpperCase(),300,700,300);
  s+=letraOut(String(L).toLowerCase(),300,790,120);
  for(let i=0;i<6;i++)s+=PC.estrela(70+i*92,500,.42);
  return s;
};
M.palavra=(w)=>{
  const t=String(w).toUpperCase();
  const tam=t.length>7?66:(t.length>5?82:100);
  let s=letraOut(t,300,626,tam);
  s+='<path d="M70 700h460" stroke-dasharray="12 10"/>';
  s+='<path d="M70 772h460" stroke-dasharray="12 10"/>';
  return s;
};
M.baloes=(sils)=>{
  let s='';const n=sils.length;
  sils.forEach((sl,i)=>{
    const x=300+(i-(n-1)/2)*150,y=600;
    s+='<ellipse cx="'+x+'" cy="'+y+'" rx="66" ry="80" fill="#fff"/>';
    s+='<path d="M'+x+' '+(y+80)+'l-9 14h18Z" fill="#fff"/><path d="M'+x+' '+(y+94)+'q14 26 0 52"/>';
    s+=letraOut(sl.toUpperCase(),x,y+18,54);
  });
  return s;
};
M.linhas=(n,titulo)=>{
  const q=Math.min(n||3,3);
  let s=titulo?letraOut(String(titulo).toUpperCase(),300,578,54):'';
  for(let i=0;i<q;i++)s+='<path d="M70 '+(640+i*58)+'h460" stroke-dasharray="12 10"/>';
  return s;
};
M.parEN=(en,pt)=>{
  const t=String(en).toUpperCase();
  const tam=t.length>8?58:(t.length>6?72:88);
  let s=letraOut(t,300,596,tam);
  s+='<text x="300" y="656" font-size="23" text-anchor="middle" fill="#12233A" stroke="none" '+
     'font-family="Fredoka, Nunito, sans-serif">escreva em português:</text>';
  s+='<path d="M80 716h440" stroke-dasharray="12 10"/>';
  s+='<path d="M80 786h440" stroke-dasharray="12 10"/>';
  return s;
};
M.quadroHistoria=()=>{
  let s=br(60,520,480,300,24);
  s+='<text x="300" y="580" font-size="26" text-anchor="middle" fill="#12233A" stroke="none" '+
     'font-family="Fredoka, Nunito, sans-serif">desenhe aqui a sua parte da história</text>';
  return s;
};

/* --- desenhos das galáxias de Português e Inglês --- */
const FASES_PT={
 'p1.1':['letra',['A'],'Pinte a letra A, grande e pequena. Escreva 3 palavras que começam com ela.'],
 'p1.2':['letra',['B'],'Pinte o B e desenhe algo que comece com essa letra.'],
 'p1.3':['letra',['M'],'Pinte o M maiúsculo e o m minúsculo. Eles são a mesma letra!'],
 'p1.4':['letra',['S'],'Pinte o S e escreva o nome de três coisas que começam com ele.'],
 'p1.5':['linhas',[5,'A B C'],'Escreva o alfabeto em ordem nas linhas e pinte as letras do título.'],
 'p2.1':['baloes',[['bo','la']],'Pinte um balão para cada sílaba e bata palma ao ler.'],
 'p2.2':['baloes',[['ca','sa']],'Pinte as sílabas e leia a palavra que elas formam.'],
 'p2.3':['baloes',[['ma','la']],'Pinte cada sílaba de uma cor e junte no fim.'],
 'p2.4':['baloes',[['pa','to']],'Leia sílaba por sílaba e depois rápido, tudo junto.'],
 'p2.5':['baloes',[['ca','va','lo']],'Três sílabas, três balões. Que palavra é essa?'],
 'p3.1':['palavra',['bola'],'Pinte a palavra e copie ela três vezes nas linhas.'],
 'p3.2':['palavra',['cavalo'],'Pinte a palavra e escreva ela nas linhas de baixo.'],
 'p3.3':['palavra',['janela'],'Copie a palavra e circule as sílabas dela.'],
 'p3.4':['palavra',['sapato'],'Pinte, copie e depois escreva de trás para frente para brincar.'],
 'p3.5':['palavra',['gato'],'Pinte GATO e escreva embaixo três palavras que rimam com ela.'],
 'p4.1':['palavra',['maçã'],'Pinte a palavra e repare no cedilha. Copie nas linhas.'],
 'p4.2':['palavra',['carro'],'Pinte CARRO e escreva embaixo CARO. O que muda?'],
 'p4.3':['palavra',['casa'],'Pinte CASA e escreva MASSA embaixo. Ouça a diferença.'],
 'p4.4':['palavra',['chuva'],'Pinte a palavra e copie separando as sílabas: CHU-VA.'],
 'p4.5':['palavra',['campo'],'Pinte CAMPO e lembre: antes de P e B vai M.'],
 'p5.1':['linhas',[4,'frase'],'Escreva uma frase sobre o desenho lá de cima.'],
 'p5.2':['linhas',[4,'A. .'],'Escreva uma frase com maiúscula no começo e ponto no fim.'],
 'p5.3':['linhas',[4,'ordem'],'Escreva quem, o que faz e onde. Nessa ordem.'],
 'p5.4':['linhas',[4,'? !'],'Escreva uma pergunta e uma frase de exclamação.'],
 'p5.5':['linhas',[4,'e mas'],'Escreva uma frase usando "e" e outra usando "mas".'],
 'p6.1':['palavra',['escola'],'Pinte o substantivo e escreva mais quatro nomes de coisas.'],
 'p6.2':['linhas',[4,'o a'],'Escreva quatro palavras: duas com O e duas com A na frente.'],
 'p6.3':['linhas',[4,'1 e 2'],'Escreva quatro palavras no singular e o plural de cada uma.'],
 'p6.4':['linhas',[4,'ele ela'],'Escreva pares: menino/menina, gato/gata...'],
 'p6.5':['linhas',[4,'Nomes'],'Escreva o seu nome e o de três pessoas da família, com maiúscula.'],
 'p7.1':['linhas',[4,'como é'],'Escreva quatro adjetivos e desenhe um deles lá em cima.'],
 'p7.2':['linhas',[4,'o que faz'],'Escreva quatro verbos e faça mímica de cada um.'],
 'p7.3':['linhas',[4,'combina'],'Escreva: o menino alto, a menina alta... e mais dois pares.'],
 'p7.4':['linhas',[4,'tempo'],'Escreva o que você fez ontem, faz hoje e vai fazer amanhã.'],
 'p7.5':['linhas',[5,'frases'],'Escreva cinco frases completas sobre o desenho de cima.'],
 'p8.1':['palavra',['coração'],'Pinte a palavra e copie prestando atenção no Ç.'],
 'p8.2':['palavra',['girafa'],'Pinte GIRAFA e escreva embaixo JANELA. G ou J?'],
 'p8.3':['palavra',['peixe'],'Pinte PEIXE e escreva CHUVA embaixo. X ou CH?'],
 'p8.4':['palavra',['feliz'],'Pinte FELIZ e escreva PAÍS embaixo. Z ou S?'],
 'p8.5':['linhas',[4,'mas mais'],'Escreva uma frase com "mas" e outra com "mais".'],
 'p9.1':['palavra',['café'],'Pinte a palavra e marque bem o acento.'],
 'p9.2':['palavra',['pão'],'Pinte PÃO e escreva o plural embaixo: PÃES.'],
 'p9.3':['palavra',['água'],'Pinte ÁGUA e copie mais três palavras com acento.'],
 'p9.4':['linhas',[4,'lista'],'Escreva uma lista de compras usando vírgulas.'],
 'p9.5':['linhas',[4,'— fala'],'Escreva uma fala do Bobby começando com travessão.'],
 'p10.1':['linhas',[5,'bilhete'],'Escreva um bilhete curto para alguém da sua casa.'],
 'p10.2':['linhas',[5,'receita'],'Escreva os passos de uma receita bem simples.'],
 'p10.3':['quadroHistoria',[],'Desenhe a cena da historinha que você leu e conte para alguém.'],
 'p10.4':['linhas',[5,'quem onde'],'Escreva quem é o personagem, onde estava e o que aconteceu.'],
 'p10.5':['quadroHistoria',[],'Desenhe o final da história do Bobby na biblioteca.']
};
const FASES_EN={
 'e1.1':['parEN',['hello','oi'],'Pinte a palavra e escreva embaixo o que ela quer dizer.'],
 'e1.2':['parEN',['good morning','bom dia'],'Pinte e escreva a tradução na linha.'],
 'e1.3':['parEN',['thank you','obrigado'],'Pinte e diga em voz alta três vezes.'],
 'e1.4':['linhas',[4,'my name is'],'Escreva "My name is" e o seu nome, quatro vezes.'],
 'e1.5':['linhas',[4,'1 2 3'],'Escreva one, two, three e desenhe essa quantidade de bolinhas.'],
 'e2.1':['parEN',['red','vermelho'],'Pinte a palavra de vermelho de verdade!'],
 'e2.2':['parEN',['blue','azul'],'Pinte a palavra da cor que ela diz.'],
 'e2.3':['parEN',['green','verde'],'Pinte de verde e procure algo verde na sua casa.'],
 'e2.4':['parEN',['book','livro'],'Pinte e desenhe um livro do lado.'],
 'e2.5':['parEN',['school','escola'],'Pinte e escreva o nome da sua escola embaixo.'],
 'e3.1':['parEN',['mother','mãe'],'Pinte e faça um desenho para a sua mãe.'],
 'e3.2':['parEN',['father','pai'],'Pinte e escreva o nome do seu pai.'],
 'e3.3':['parEN',['family','família'],'Pinte e desenhe a sua família lá em cima.'],
 'e3.4':['parEN',['friend','amigo'],'Pinte e escreva o nome do seu melhor amigo.'],
 'e3.5':['linhas',[4,'my family'],'Escreva: mother, father, sister, brother.'],
 'e4.1':['parEN',['dog','cachorro'],'Pinte e desenhe um cachorro.'],
 'e4.2':['parEN',['cat','gato'],'Pinte e faça o som do gato em inglês: meow!'],
 'e4.3':['parEN',['horse','cavalo'],'Pinte e escreva mais dois animais da fazenda.'],
 'e4.4':['parEN',['lion','leão'],'Pinte e ruja bem alto.'],
 'e4.5':['parEN',['bear','urso'],'Pinte a palavra do Bobby: ele é a brown bear!'],
 'e5.1':['parEN',['water','água'],'Pinte e beba um copo de água agora.'],
 'e5.2':['parEN',['bread','pão'],'Pinte e escreva o que você come no café da manhã.'],
 'e5.3':['parEN',['apple','maçã'],'Pinte a maçã de vermelho e escreva a palavra.'],
 'e5.4':['parEN',['cake','bolo'],'Pinte e desenhe velinhas em cima.'],
 'e5.5':['linhas',[4,'food'],'Escreva quatro comidas em inglês.'],
 'e6.1':['parEN',['hand','mão'],'Pinte e contorne a sua mão de verdade lá em cima.'],
 'e6.2':['parEN',['eye','olho'],'Pinte e desenhe um rosto com dois eyes.'],
 'e6.3':['parEN',['shoes','sapatos'],'Pinte e desenhe o seu sapato preferido.'],
 'e6.4':['parEN',['hat','chapéu'],'Pinte e escolha um chapéu para o Bobby.'],
 'e6.5':['linhas',[4,'clothes'],'Escreva quatro roupas em inglês.'],
 'e7.1':['parEN',['house','casa'],'Pinte e desenhe a sua casa.'],
 'e7.2':['parEN',['kitchen','cozinha'],'Pinte e escreva o que tem na sua cozinha.'],
 'e7.3':['parEN',['table','mesa'],'Pinte e desenhe o que fica em cima da mesa.'],
 'e7.4':['parEN',['garden','jardim'],'Pinte e desenhe um jardim.'],
 'e7.5':['linhas',[4,'my house'],'Escreva quatro cômodos da casa em inglês.'],
 'e8.1':['parEN',['run','correr'],'Pinte e corra dez passos agora mesmo.'],
 'e8.2':['parEN',['sleep','dormir'],'Pinte e desenhe você dormindo.'],
 'e8.3':['parEN',['read','ler'],'Pinte e leia um livro hoje.'],
 'e8.4':['parEN',['jump','pular'],'Pinte e pule cinco vezes.'],
 'e8.5':['linhas',[4,'I like'],'Escreva quatro coisas que você gosta: I like...'],
 'e9.1':['parEN',['what','o quê'],'Pinte e escreva uma pergunta com "what".'],
 'e9.2':['parEN',['where','onde'],'Pinte e pergunte para alguém: where is my book?'],
 'e9.3':['linhas',[4,'how many'],'Escreva "how many" e conte coisas do seu quarto.'],
 'e9.4':['linhas',[4,'how are you'],'Escreva a pergunta e a resposta: I am fine.'],
 'e9.5':['linhas',[4,'how old'],'Escreva quantos anos você tem em inglês.'],
 'e10.1':['linhas',[4,'yesterday'],'Escreva o que você fez ontem, em inglês.'],
 'e10.2':['linhas',[4,'what\'s up'],'Escreva três frases do dia a dia em inglês.'],
 'e10.3':['linhas',[4,'please'],'Escreva um pedido educado em inglês.'],
 'e10.4':['linhas',[4,'friends'],'Escreva três palavras iguais nas duas línguas.'],
 'e10.5':['quadroHistoria',[],'Desenhe o Bobby na viagem dele e escreva uma frase em inglês.']
};
const FASES={
 '1.1':['itens',[12,'ITEM'],'Conte as sementes que o Bobby derrubou enquanto pinta. Quantas são?'],
 '1.2':['doisGrupos',[7,4,'ITEM'],'Pinte de verde o canteiro que tem MAIS sementes.'],
 '1.3':['caixaOvos',[3,4],'Amarre 3 maços de 10 mudas e deixe 4 soltas. Que número deu?'],
 '1.4':['grade',[],'A caixa grande da colheita tem 100 lugares. Pinte os 100 e veja a centena.'],
 '1.5':['escada',[8],'Marque a fita da horta de 2 em 2 e pinte os degraus.'],
 '2.1':['doisGrupos',[5,3,'ITEM'],'Pinte os dois montinhos de conchas. Quantas o Bobby achou ao todo?'],
 '2.2':['itens',[15,'ITEM'],'Pinte as 15 conchas do balde contando de 5 em 5.'],
 '2.3':['itens',[9,'ITEM'],'Pinte 9 conchas e risque 4 quebradas. Quantas sobraram na coleção?'],
 '2.4':['colar',[12,'ITEM'],'Monte o colar do Bobby pintando as conchas de 4 em 4.'],
 '2.5':['cestas',[12,2,'ITEM'],'Reparta as conchas nos dois baldes e invente um probleminha.'],
 '3.1':['grupos',[4,3,'ITEM'],'Cada camelo leva 3 cantis. Pinte 4 camelos: quanto é 4 × 3?'],
 '3.2':['grupos',[3,5,'ITEM'],'3 pacotes com 5 cantis cada. Quanto é 3 × 5?'],
 '3.3':['grupos',[2,7,'ITEM'],'2 pacotes com 7 cantis. Quanto é 2 × 7?'],
 '3.4':['grade',[],'O barril tem 10 fileiras de 10 gotas. Pinte tudo: 10 × 10 = 100.'],
 '3.5':['grupos',[6,4,'ITEM'],'6 caixas com 4 cantis cada. Quanta água a caravana leva?'],
 '4.1':['cestas',[12,3,'ITEM'],'Reparta as 12 frutas nas 3 cestas, uma cor para cada amigo.'],
 '4.2':['cestas',[12,4,'ITEM'],'Reparta as 12 frutas nas 4 cestas. Quantas em cada uma?'],
 '4.3':['cestas',[14,4,'ITEM'],'Reparta 14 frutas em 4 cestas. Quantas sobraram para o Bobby?'],
 '4.4':['itens',[12,'ITEM'],'Pinte metade das frutas de vermelho e a outra metade de verde.'],
 '4.5':['grade',[],'Arrume a mesa de 3 em 3 e descubra os múltiplos de 3.'],
 '5.1':['pizza',[4,3],'Pinte 3 das 4 fatias do primeiro pedido da pizzaria.'],
 '5.2':['barra',[8,'4 de 8 é o mesmo que 1/2'],'Pinte 4 das 8 partes. Repare: 4/8 é igual a 1/2.'],
 '5.3':['pizza',[6,2],'Pinte 2 das 6 fatias e compare com a metade: é mais ou é menos?'],
 '5.4':['bolo',[5],'Pinte 2 fatias de azul e 1 de amarelo. Quantos quintos ficaram?'],
 '5.5':['itens',[12,'ITEM'],'Pinte 3/4 das 12 fatias que saíram na promoção do dia.'],
 '6.1':['barra',[10,'uma parte é 0,1'],'Pinte 5 das 10 partes: 0,5 é a metade.'],
 '6.2':['dinheiro',[],'Escreva dois preços parecidos nas notas e circule o mais barato.'],
 '6.3':['dinheiro',[],'Escreva o preço de cada coisa da sacola e some tudo.'],
 '6.4':['dinheiro',[],'Escreva o preço do lanche e calcule o troco de R$ 20,00.'],
 '6.5':['itens',[10,'ITEM'],'Dez moedas iguais na mão do Bobby. Quanto dá tudo junto?'],
 '7.1':['grade',[],'A vitrine tem 100 quadradinhos. Pinte 25: isso é 25%.'],
 '7.2':['grade',[],'Pinte 10 quadradinhos de cada cor. Cada cor é 10% da vitrine.'],
 '7.3':['itens',[10,'ITEM'],'Escreva um preço em cada etiqueta e corte 50% dele.'],
 '7.4':['doisGrupos',[2,4,'ITEM'],'Uma pilha tem o dobro da outra. Pinte e compare.'],
 '7.5':['grupos',[3,7,'ITEM'],'3 caixas com 7 etiquetas. Quantas o Bobby precisa imprimir?'],
 '8.1':['formas',[],'Pinte cada peça do parquinho e escreva quantos lados ela tem.'],
 '8.2':['formas',[],'Contorne com caneta grossa a volta de cada peça: isso é o perímetro.'],
 '8.3':['grade',[],'Pinte um piso de 6 por 4 dentro da grade. Qual é a área?'],
 '8.4':['angulos',[],'Pinte de azul o escorregador de ângulo agudo e de vermelho o obtuso.'],
 '8.5':['regua',[],'Meça as peças com uma régua de verdade e anote em centímetros.'],
 '9.1':['balanca',[],'Descubra quantos parafusos faltam do lado do x e desenhe eles.'],
 '9.2':['domino',[],'Some os pontos de cada peça da oficina e escreva o resultado embaixo.'],
 '9.3':['balanca',[],'Deixe os dois lados do foguete com o mesmo peso.'],
 '9.4':['quadradoPontos',[4],'Pinte o painel de 4 por 4. Quanto é 4²?'],
 '9.5':['quadradoPontos',[5],'O painel tem 25 quadradinhos. Então √25 é quanto?'],
 '10.1':['grafico',[],'Pinte as barras de convidados por mesa e descubra a média.'],
 '10.2':['grafico',[],'Dê um nome para cada barra do gráfico da festa e pinte.'],
 '10.3':['dado',[],'Pinte os dados do sorteio. Qual é a chance de sair o número 5?'],
 '10.4':['termometro',[],'Pinte o freezer da festa: azul abaixo do zero, vermelho acima.'],
 '10.5':['itens',[12,'ITEM'],'Você chegou ao fim! Pinte as 12 estrelas da festa no castelo.']
};

function quebra(t,max){
  const p=t.split(' ');const ls=[];let l='';
  p.forEach(w=>{if((l+' '+w).trim().length>max){ls.push(l.trim());l=w;}else l+=' '+w;});
  if(l.trim())ls.push(l.trim());
  return ls;
}
function DESENHO(ui,li){
  const u=UNITS[ui],l=u.lessons[li];
  const t=TEMA[ui%TEMA.length];
  const capAtiva=(typeof CAP_ATUAL!=='undefined'&&CAP_ATUAL)?CAP_ATUAL:(typeof CAPITULOS!=='undefined'?CAPITULOS:{});
  const item=(capAtiva[u.n]&&capAtiva[u.n].item)||'estrela';
  const TAB=(l.id.charAt(0)==='p'?FASES_PT:(l.id.charAt(0)==='e'?FASES_EN:FASES));
  const cfg=TAB[l.id]||['itens',[10,item],'Pinte o desenho e conte para alguém o que você aprendeu nesta fase.'];
  const args=cfg[1].map(a=>a==='ITEM'?item:a);
  const f=(li+1)/u.lessons.length;
  const cena=CENA_FN[(ui*2+li)%CENA_FN.length];
  let s=moldura(ui+li);
  s+='<text x="300" y="70" font-size="34" text-anchor="middle" fill="#12233A" stroke="none" font-family="Fredoka, Nunito, sans-serif">'+l.title+'</text>';
  const gal=(l.id.charAt(0)==='p'?'Galáxia do Português':(l.id.charAt(0)==='e'?'English Galaxy':'Galáxia da Matemática'));
  s+='<text x="300" y="106" font-size="20" text-anchor="middle" fill="#12233A" stroke="none" font-family="Fredoka, Nunito, sans-serif">Mundo '+u.n+' · Fase '+(li+1)+' · '+gal+'</text>';
  s+=cena(t,f,t.ac);
  s+='<g transform="translate(0,-6)">'+M[cfg[0]].apply(null,args)+'</g>';
  const linhas=quebra(cfg[2],48);
  s+=br(46,DH-86,508,linhas.length>1?70:52,20);
  linhas.forEach((txt,i)=>{s+=tx(300,DH-86+(linhas.length>1?32:34)+i*27,txt,21);});
  return {
    titulo:l.title,mundo:'Mundo '+u.n+' · Fase '+(li+1)+' · '+gal,tarefa:cfg[2],
    svg:'<svg viewBox="0 0 '+DW+' '+DH+'" xmlns="http://www.w3.org/2000/svg" class="colorir">'+
        '<rect width="'+DW+'" height="'+DH+'" fill="#fff"/>'+g(s)+'</svg>'
  };
}

