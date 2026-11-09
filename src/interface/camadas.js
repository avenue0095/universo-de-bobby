/* ---------- 1F · editor em camadas: vários acessórios ao mesmo tempo, em TODAS as poses ----------
   REQUISITO DO FILIPE (08/11/2026): cabeça + rosto + pescoço + costas + mão juntos, e cada acessório aparece em todas as poses do Bobby
   (Oi, Comemora, Caminha, Pensa, as outras 8 poses e as 8 expressões). Nunca uma imagem por combinação: a pose base é UMA imagem e cada
   acessório é UMA camada posicionada pela âncora da pose. 5 slots x 20 poses = 100 âncoras, não 864 x 20 imagens.
   Âncoras: fração da imagem da pose (x da largura, y da altura). W = largura da cabeça de orelha a orelha (fração da largura).
     cab:[cx, y do topo da orelha, W, giro em graus]   olho:[cx, y da linha dos olhos]   pesc:[cx, y da gola, largura]
     cost:[cx, y do alto das costas, largura]          mao:[x, y da mão livre, escala relativa a W]
   Medidas a olho em 08/11/2026 sobre a arte de assets/personagens e assets/expressoes (grade de 10%); as poses de frente reaproveitam
   FRONTAIS. Ajuste fino e arte definitiva por vista: arte/PEDIDOS-DE-ARTE.md, seção "Guarda-roupa em camadas". */
const ANCORAS={
  'bobby-p01':{cab:[.45,0,.645,0],olho:[.46,.185],pesc:[.46,.37,.46],cost:[.46,.40,.62],mao:[.07,.63,.55]},
  'bobby-p02':{cab:[.49,.014,.58,0],olho:[.50,.19],pesc:[.50,.34,.42],cost:[.50,.38,.58],mao:[.92,.19,.5]},
  'bobby-p03':{cab:[.53,0,.78,0],olho:[.53,.20],pesc:[.50,.37,.55],cost:[.55,.40,.75],mao:[.30,.52,.5]},
  'bobby-p04':{cab:[.63,0,.52,0],olho:[.62,.19],pesc:[.60,.35,.38],cost:[.66,.39,.52],mao:[.05,.34,.5]},
  'bobby-p05a':{cab:[.62,0,.58,6],olho:[.70,.19],pesc:[.56,.35,.40],cost:[.45,.38,.56],mao:[.93,.54,.5]},
  'bobby-p05b':{cab:[.62,0,.60,6],olho:[.70,.19],pesc:[.56,.35,.40],cost:[.45,.38,.58],mao:[.92,.55,.5]},
  'bobby-p06':{cab:[.53,0,.72,0],olho:[.54,.21],pesc:[.52,.37,.50],cost:[.52,.40,.70],mao:[.90,.56,.5]},
  'bobby-p07':{cab:[.60,0,.62,-4],olho:[.62,.20],pesc:[.55,.37,.48],cost:[.55,.40,.64],mao:[.90,.68,.5]},
  'bobby-p08':{cab:[.60,0,.71,0],olho:[.61,.20],pesc:[.60,.37,.50],cost:[.60,.40,.70],mao:[.82,.60,.5]},
  'bobby-p09':{cab:[.50,0,.69,0],olho:[.51,.20],pesc:[.51,.36,.50],cost:[.51,.40,.70],mao:[.94,.56,.5]},
  'bobby-p10':{cab:[.50,0,.88,0],olho:[.51,.20],pesc:[.51,.37,.62],cost:[.51,.40,.88],mao:[.86,.52,.5]},
  'bobby-p11':{cab:[.62,0,.56,4],olho:[.68,.20],pesc:[.57,.37,.42],cost:[.40,.40,.55],mao:[.85,.25,.5]},
  'bobby-p12':{cab:[.62,.02,.52,0],olho:[.62,.21],pesc:[.58,.40,.42],cost:[.80,.40,.45],mao:[.45,.60,.45]},
  'bobby-e01':{cab:[.5,0,.94,0],olho:[.5,.41],pesc:[.5,.83,.62],cost:[.5,.86,.98],mao:[.88,.86,.32]},
  'bobby-e02':{cab:[.5,0,.92,0],olho:[.5,.40],pesc:[.5,.82,.62],cost:[.5,.86,.98],mao:[.88,.86,.32]},
  'bobby-e03':{cab:[.53,.03,.92,0],olho:[.55,.49],pesc:[.53,.88,.60],cost:[.5,.90,.98],mao:[.88,.88,.32]},
  'bobby-e04':{cab:[.5,0,.92,0],olho:[.5,.43],pesc:[.5,.84,.62],cost:[.5,.87,.98],mao:[.88,.87,.32]},
  'bobby-e05':{cab:[.5,0,.92,0],olho:[.5,.41],pesc:[.5,.84,.62],cost:[.5,.87,.98],mao:[.88,.87,.32]},
  'bobby-e06':{cab:[.5,0,.92,0],olho:[.5,.42],pesc:[.5,.84,.62],cost:[.5,.87,.98],mao:[.88,.87,.32]},
  'bobby-e07':{cab:[.5,0,.87,0],olho:[.5,.42],pesc:[.5,.84,.62],cost:[.5,.87,.98],mao:[.88,.87,.32]},
  'bobby-e08':{cab:[.5,0,.92,0],olho:[.5,.42],pesc:[.5,.84,.62],cost:[.5,.87,.98],mao:[.88,.87,.32]}
};
const SLOTS=['cabeca','rosto','pescoco','costas','mao'];
const NOME_SLOT={cabeca:'Cabeça',rosto:'Rosto',pescoco:'Pescoço',costas:'Costas',mao:'Mão'};
/* ordem de pintura: costas atrás do urso; o resto na frente */
const Z_SLOT={costas:1,pescoco:3,rosto:4,cabeca:5,mao:6};
/* SVG desenhado no código para o que ainda não tem arte (cores só por classe; os tons vivem em :root, tokens --item-*).
   Cada um: viewBox e proporção (largura/altura). */
const SVG_ITEM={
  capacete:{vb:'0 0 120 84',r:120/84,s:'<path class="it-metal" d="M8 74C8 30 32 6 60 6s52 24 52 68Z"/><path class="it-visor" d="M24 60c0-22 16-38 36-38s36 16 36 38Z"/><rect class="it-borda" x="2" y="70" width="116" height="12" rx="6"/><circle class="it-luz" cx="60" cy="12" r="5"/>'},
  gorro:{vb:'0 0 120 80',r:1.5,s:'<path class="it-la" d="M10 64C10 26 34 8 60 8s50 18 50 56Z"/><rect class="it-la-2" x="4" y="58" width="112" height="18" rx="9"/><circle class="it-la-2" cx="60" cy="8" r="8"/>'},
  'oculos-sol':{vb:'0 0 140 44',r:140/44,s:'<rect class="it-lente-escura" x="6" y="6" width="54" height="32" rx="14"/><rect class="it-lente-escura" x="80" y="6" width="54" height="32" rx="14"/><path class="it-haste" d="M60 18h20" /><path class="it-haste" d="M6 16 0 12M134 16l6-4"/>'},
  lenco:{vb:'0 0 120 70',r:120/70,s:'<path class="it-lenco" d="M4 6h112L60 66Z"/><path class="it-lenco-2" d="M4 6h112l-8 10H12Z"/><circle class="it-lenco-2" cx="60" cy="14" r="7"/>'},
  gravata:{vb:'0 0 100 50',r:2,s:'<path class="it-gravata" d="M50 25 6 4v42Zm0 0 44-21v42Z"/><rect class="it-gravata-2" x="40" y="15" width="20" height="20" rx="6"/>'},
  medalha:{vb:'0 0 80 100',r:.8,s:'<path class="it-fita" d="M14 0h18l18 46H32ZM66 0H48L30 46h18Z"/><circle class="it-ouro" cx="40" cy="70" r="26"/><path class="it-ouro-2" d="m40 54 5 10 11 2-8 8 2 11-10-5-10 5 2-11-8-8 11-2Z"/>'},
  capa:{vb:'0 0 160 170',r:160/170,s:'<path class="it-capa" d="M30 4h100l26 160H4Z"/><path class="it-capa-2" d="M30 4h100l-6 18H36Z"/>'},
  'mochila-foguete':{vb:'0 0 120 150',r:.8,s:'<rect class="it-metal" x="10" y="10" width="44" height="110" rx="20"/><rect class="it-metal" x="66" y="10" width="44" height="110" rx="20"/><path class="it-chama" d="M18 120h28l-14 28ZM74 120h28l-14 28Z"/><rect class="it-borda" x="40" y="40" width="40" height="30" rx="8"/>'},
  bandeira:{vb:'0 0 80 120',r:80/120,s:'<rect class="it-haste-madeira" x="8" y="4" width="8" height="112" rx="4"/><path class="it-bandeira" d="M16 8h58L60 28l14 20H16Z"/>'},
  lanterna:{vb:'0 0 80 110',r:80/110,s:'<path class="it-luz-raio" d="M40 0 4 40h72Z"/><rect class="it-metal" x="24" y="36" width="32" height="70" rx="10"/><rect class="it-borda" x="20" y="34" width="40" height="14" rx="5"/>'},
  varinha:{vb:'0 0 90 120',r:.75,s:'<rect class="it-haste-madeira" x="40" y="40" width="10" height="78" rx="5" transform="rotate(14 45 80)"/><path class="it-ouro" d="m45 4 10 20 22 3-16 15 4 22-20-10-20 10 4-22-16-15 22-3Z"/>'}
};
/* os 15 acessórios vestíveis. arte: id da imagem (os 7 looks de hoje viraram camada) ou svg: id em SVG_ITEM.
   Encaixe da camada: k = largura do item / W; px,py = ponto do item que fica na âncora (0 a 1); dx,dy = deslocamento em W.
   Os números de boné, coroa e óculos vêm das sobreposições medidas na sessão anterior (OVERLAYS). */
const VESTIVEIS={
  explorador:{slot:'cabeca',n:'Chapéu de explorador',arte:'bobby-item-chapeu',k:.66,px:.5,py:1,dy:.34},
  bone:{slot:'cabeca',n:'Boné',arte:'ov-bone',k:.535,px:.5,py:0,dx:-.013,dy:-.116},
  coroa:{slot:'cabeca',n:'Coroa de papel',arte:'ov-coroa',k:.369,px:.5,py:0,dx:-.036,dy:-.167},
  capacete:{slot:'cabeca',n:'Capacete aberto',svg:'capacete',k:.82,px:.5,py:0,dy:-.06},
  gorro:{slot:'cabeca',n:'Gorro de lã',svg:'gorro',k:.66,px:.5,py:0,dy:-.08},
  oculos:{slot:'rosto',n:'Óculos de astronauta',arte:'ov-oculos',k:.68,px:.5,py:.5},
  'oculos-sol':{slot:'rosto',n:'Óculos de sol',svg:'oculos-sol',k:.62,px:.5,py:.5},
  lenco:{slot:'pescoco',n:'Lenço',svg:'lenco',k:.95,px:.5,py:.1},
  gravata:{slot:'pescoco',n:'Gravata-borboleta',svg:'gravata',k:.42,px:.5,py:.3},
  medalha:{slot:'pescoco',n:'Medalha de ouro',svg:'medalha',k:.32,px:.5,py:0},
  capa:{slot:'costas',n:'Capa azul',svg:'capa',k:1.05,px:.5,py:0,dy:-.06},
  'mochila-foguete':{slot:'costas',n:'Mochila-foguete',svg:'mochila-foguete',k:.8,px:.5,py:.15},
  bandeira:{slot:'mao',n:'Bandeirinha',svg:'bandeira',k:.42,px:.2,py:.85},
  lanterna:{slot:'mao',n:'Lanterna',svg:'lanterna',k:.34,px:.5,py:.8},
  varinha:{slot:'mao',n:'Varinha de estrela',svg:'varinha',k:.4,px:.5,py:.85}
};
/* os 7 looks de hoje viram itens de camada (mesmo id, o dono continua dono) */
const LOOKS_ANTIGOS=['explorador','bone','oculos','lenco','capa','capacete','coroa'];
const itensDoSlot=sl=>Object.keys(VESTIVEIS).filter(id=>VESTIVEIS[id].slot===sl);
const temArteDoItem=id=>{const v=VESTIVEIS[id];return !!v&&(v.svg?!!SVG_ITEM[v.svg]:!!ativo(v.arte));};
/* o que está vestido: {cabeca:'bone', rosto:'oculos', ...} só com item válido e com arte */
function vestidos(L){
  L=L||{};const r={};
  SLOTS.forEach(sl=>{const id=L[sl];if(id&&VESTIVEIS[id]&&VESTIVEIS[id].slot===sl&&temArteDoItem(id))r[sl]=id;});
  return r;
}
/* proporção (largura/altura) da imagem da pose */
function proporcaoDe(pose){const a=ativo(pose);return a?a[1]/a[2]:(/bobby-e/.test(pose)?1:.66);}
/* caixa da camada de um item numa pose, em % da caixa da pose: {l,t,w,h,rot} */
function caixaDaCamada(pose,id){
  const an=ANCORAS[pose],v=VESTIVEIS[id];if(!an||!v)return null;
  const prop=proporcaoDe(pose),W=an.cab[2];
  const sv=v.svg&&SVG_ITEM[v.svg],a=!sv&&ativo(v.arte);
  const r=sv?sv.r:(a?a[1]/a[2]:1);
  let ax,ay,larg,rot=0;
  if(v.slot==='cabeca'){ax=an.cab[0];ay=an.cab[1];larg=v.k*W;rot=an.cab[3]||0;}
  else if(v.slot==='rosto'){ax=an.olho[0];ay=an.olho[1];larg=v.k*W;rot=an.cab[3]||0;}
  else if(v.slot==='pescoco'){ax=an.pesc[0];ay=an.pesc[1];larg=v.k*an.pesc[2];}
  else if(v.slot==='costas'){ax=an.cost[0];ay=an.cost[1];larg=v.k*an.cost[2];}
  else {ax=an.mao[0];ay=an.mao[1];larg=v.k*W*(an.mao[2]/.5);}
  const alt=larg*prop/r;                     /* altura em fração da altura da pose */
  const l=ax+(v.dx||0)*W-larg*v.px, t=ay+(v.dy||0)*W*prop-alt*v.py;
  return {l:l*100,t:t*100,w:larg*100,h:alt*100,rot:rot};
}
function camadaHTML(pose,id){
  const c=caixaDaCamada(pose,id),v=VESTIVEIS[id];if(!c)return '';
  const st='left:'+c.l.toFixed(2)+'%;top:'+c.t.toFixed(2)+'%;width:'+c.w.toFixed(2)+'%;z-index:'+Z_SLOT[v.slot]+(c.rot?';transform:rotate('+c.rot+'deg)':'');
  if(v.svg){const s=SVG_ITEM[v.svg];
    return '<svg class="camada camada-'+v.slot+' it-'+v.svg+'" data-item="'+id+'" viewBox="'+s.vb+'" style="'+st+'" aria-hidden="true">'+s.s+'</svg>';}
  return imgArte(v.arte,{cls:'camada camada-'+v.slot,style:st,alt:''}).replace('<img ','<img data-item="'+id+'" ');
}
/* o Bobby numa pose com tudo o que está vestido: a imagem da pose + uma camada por slot. Sem nada vestido devolve null. */
function bobbyEmCamadas(pose,cls,L,alt){
  const vs=vestidos(L);if(!Object.keys(vs).length||!ANCORAS[pose]||!ativo(pose))return null;
  let h='<span class="bobby-camadas'+(cls?' '+cls:'')+'" data-vista="'+pose+'"'+(alt?' role="img" aria-label="'+escapa(alt)+'"':'')+' style="aspect-ratio:'+proporcaoDe(pose).toFixed(4)+'">';
  h+=imgArte(pose,{cls:'camada-base',alt:''});
  SLOTS.forEach(sl=>{if(vs[sl])h+=camadaHTML(pose,vs[sl]);});
  return h+'</span>';
}
/* miniatura do item sozinho (vitrine) */
function itemSozinhoHTML(id){
  const v=VESTIVEIS[id];if(!v)return '';
  if(v.svg){const s=SVG_ITEM[v.svg];return '<svg class="item-solo it-'+v.svg+'" viewBox="'+s.vb+'" role="img" aria-label="'+escapa(v.n)+'">'+s.s+'</svg>';}
  return imgArte(v.arte,{cls:'item-solo',alt:v.n});
}
