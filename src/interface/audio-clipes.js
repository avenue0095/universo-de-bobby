/* ---------- áudio gravado: do texto falado ao clipe ----------
   Sem DOM e sem rede. Resolve "o que o app quer falar" em nomes de clipe do manifesto (audio/manifesto-min.json),
   do mesmo jeito que o gerador (audio/ferramentas/extrair-audio.js e prep.py):
   - nome do clipe = <idioma>/<pasta da classe>/<slug de 32 letras>-<FNV-1a 32 bits de classe + texto, em UTF-8>
   - texto = emTexto(html) (português) ou limpaEN(html) (inglês), com espaços simples
   - enunciado com número, nome, palavra ou sílaba sorteados = composição: QUADROS (trechos fixos, minúsculas e sem
     pontuação) + ENCAIXES (números, nomes, palavras, sílabas, letras), tocados em fila (docs/FASE-2-especificacao.md, 9.2).
   Texto sem clipe NÃO cai para voz do aparelho: fica sem voz e entra na lista de faltas. */
const AUDIO_DIR={'aula-passo':'aula','capitulo-abre':'historia','missao':'missao','missao-fim':'missao','en-alvo':'en','pt-glosa':'glosa',
  'pt-palavra':'palavra','pt-silaba':'silaba','pt-letra':'letra','pt-leitura':'leitura','quadro-enunciado':'quadro',
  'numero':'numero','nome':'nome','feedback':'sistema'};
const AUDIO_CLASSES={'pt-BR':['aula-passo','capitulo-abre','missao','missao-fim','pt-glosa','pt-palavra','pt-silaba','pt-letra','pt-leitura','quadro-enunciado','numero','nome','feedback'],
  'en-US':['en-alvo']};
/* manifesto carregado: chave (caminho sem extensão) -> {pacote, ms, b:[opus, m4a]} */
const AUDIO_INDICE={chaves:new Map(),pacotes:{}};

function audioFnv8(str){
  const b=unescape(encodeURIComponent(String(str)));   /* UTF-8 em "bytes", como o gerador */
  let h=0x811c9dc5;
  for(let i=0;i<b.length;i++){h^=b.charCodeAt(i);h=Math.imul(h,0x01000193);}
  return (h>>>0).toString(16).padStart(8,'0');
}
function audioSlug(t){
  return String(t).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,32);
}
function audioChaveDe(classe,idioma,texto){
  return (idioma==='en-US'?'en-us':'pt-br')+'/'+AUDIO_DIR[classe]+'/'+audioSlug(texto)+'-'+audioFnv8(classe+texto);
}
function audioIndexar(min){
  AUDIO_INDICE.chaves=new Map();AUDIO_INDICE.pacotes={};
  if(!min||!min.pacotes)return 0;
  Object.keys(min.pacotes).forEach(p=>{
    AUDIO_INDICE.pacotes[p]=Object.keys(min.pacotes[p]);
    Object.keys(min.pacotes[p]).forEach(k=>{const v=min.pacotes[p][k];AUDIO_INDICE.chaves.set(k,{pacote:p,ms:v[0],b:[v[1],v[2]]});});
  });
  return AUDIO_INDICE.chaves.size;
}
const audioTem=k=>AUDIO_INDICE.chaves.has(k);
function audioResolveTexto(texto,idioma,classes){
  const t=String(texto==null?'':texto).replace(/\s+/g,' ').trim();
  if(!t)return null;
  const lista=classes||AUDIO_CLASSES[idioma==='en-US'?'en-US':'pt-BR'];
  const lang=idioma==='en-US'?'en-US':'pt-BR';
  for(const c of lista){const k=audioChaveDe(c,lang,t);if(audioTem(k))return k;}
  /* o gerador junta "Excuse me" e "excuse me" num clipe só (a conta ignora maiúscula): tenta também em minúscula */
  const b=t.toLowerCase();
  if(b!==t)for(const c of lista){const k=audioChaveDe(c,lang,b);if(audioTem(k))return k;}
  return null;
}

/* ---------- números por extenso, em palavras que existem como clipe ('numero') ---------- */
const AU_U20=['zero','um','dois','três','quatro','cinco','seis','sete','oito','nove','dez','onze','doze','treze','catorze','quinze','dezesseis','dezessete','dezoito','dezenove'];
const AU_DZ=['','','vinte','trinta','quarenta','cinquenta','sessenta','setenta','oitenta','noventa'];
const AU_CT=['','cento','duzentos','trezentos','quatrocentos','quinhentos','seiscentos','setecentos','oitocentos','novecentos'];
function audioExtenso(n){
  if(n<20)return AU_U20[n];
  if(n<100){const d=Math.floor(n/10),u=n%10;return AU_DZ[d]+(u?' e '+AU_U20[u]:'');}
  if(n===100)return 'cem';
  if(n<1000){const c=Math.floor(n/100),r=n%100;return AU_CT[c]+(r?' e '+audioExtenso(r):'');}
  if(n<1000000){
    const m=Math.floor(n/1000),r=n%1000,pre=m===1?'mil':audioExtenso(m)+' mil';
    if(r===0)return pre;
    return pre+((r<100||r%100===0)?' e ':' ')+audioExtenso(r);
  }
  return String(n).split('').map(d=>AU_U20[+d]).join(' ');
}
/* '23' -> 'vinte e três'; '3,5' -> 'três vírgula cinco'; '3,05' -> 'três vírgula zero cinco' (mesma regra do prep.py) */
function audioNumeroPalavras(s){
  s=String(s);
  if(s.indexOf(',')>=0){
    const p=s.split(','),b=p[1];
    const zeros=b.length-b.replace(/^0+/,'').length;
    return audioExtenso(+p[0])+' vírgula '+(+b?('zero '.repeat(zeros)+audioExtenso(+b)):'zero');
  }
  return audioExtenso(+s);
}
function audioNumeroClipes(s){
  const ch=[],falta=[];
  audioNumeroPalavras(s).split(' ').forEach(w=>{
    const k=audioChaveDe('numero','pt-BR',w);
    if(audioTem(k))ch.push(k);else falta.push('numero:'+w);
  });
  return {chaves:ch,faltas:falta};
}

/* ---------- composição de enunciado (espelha quadrosDe do extrair-audio.js) ---------- */
let AU_CACHE=null;
function audioDadosDeConteudo(){
  if(AU_CACHE)return AU_CACHE;
  const mask=new Set();
  try{
    [LEX,VOC].forEach(o=>Object.values(o).forEach(a=>a.forEach(w=>w.forEach(x=>x&&mask.add(String(x))))));
    FRASES.forEach(f=>f.forEach(x=>mask.add(x)));
    COGN.forEach(f=>f.slice(0,2).forEach(x=>mask.add(x)));
  }catch(e){}
  const sil=new Set();
  PAL.forEach(w=>w.s.forEach(s=>sil.add(s)));
  AU_CACHE={
    mask:[...mask].filter(x=>x.length>1).sort((a,b)=>b.length-a.length),
    palavras:PAL.map(w=>w.p),silabas:[...sil],
    nomes:NOMES.slice()
  };
  AU_CACHE.reNome=AU_CACHE.nomes.map(n=>new RegExp('\\b'+n+'\\b','g'));
  AU_CACHE.rePal=AU_CACHE.palavras.map(w=>new RegExp('\\b'+w+'\\b','gi'));
  AU_CACHE.reSil=AU_CACHE.silabas.map(w=>new RegExp('(?<![\\p{L}\\u0001\\uE000-\\uF8FF])'+w+'(?![\\p{L}])','giu'));
  return AU_CACHE;
}
const AU_MARCA=i=>String.fromCharCode(0xE000+i);
/* corta o texto em [{t:'quadro',v}, {t:'num'|'nome'|'mask'|'caps'|'pal'|'sil', v}] na ordem em que se fala */
function audioPartes(p,mat){
  const D=audioDadosDeConteudo(),enc=[];
  const marca=(v,tipo)=>{enc.push([v,tipo]);return AU_MARCA(enc.length-1);};
  let s=p;
  if(mat==='en')D.mask.forEach(m=>{if(s.indexOf(m)>=0)s=s.split(m).join(marca(m,'mask'));});
  s=s.replace(/\d+(,\d+)?/g,m=>marca(m,'num'));
  D.reNome.forEach(re=>{s=s.replace(re,m=>marca(m,'nome'));});
  if(mat==='pt'){
    s=s.replace(/\b[A-ZÇ]{1,3}\b/g,m=>marca(m,'caps'));
    D.rePal.forEach(re=>{s=s.replace(re,m=>marca(m,'pal'));});
    D.reSil.forEach(re=>{s=s.replace(re,m=>marca(m,'sil'));});
  }
  const partes=[];
  let atual='';
  const fecha=()=>{
    const q=atual.replace(/[?!.,:;()"“”‘’→–—\-=]+/g,' ').replace(/\s+/g,' ').trim().toLowerCase();
    if(q.length>1)partes.push({t:'quadro',v:q});
    atual='';
  };
  for(const ch of s){
    const c=ch.charCodeAt(0);
    if(c>=0xE000&&c<=0xF8FF){fecha();const e=enc[c-0xE000];if(e)partes.push({t:e[1],v:e[0]});}
    else atual+=ch;
  }
  fecha();
  return partes;
}
/* clipes de um encaixe; devolve {chaves, faltas} */
function audioEncaixe(parte){
  const v=parte.v;
  if(parte.t==='num')return audioNumeroClipes(v);
  const um=k=>k?{chaves:[k],faltas:[]}:{chaves:[],faltas:[parte.t+':'+v]};
  if(parte.t==='nome')return um(audioResolveTexto(v,'pt-BR',['nome']));
  if(parte.t==='mask')return um(audioResolveTexto(v,'en-US',['en-alvo'])||audioResolveTexto(v,'pt-BR',['pt-glosa']));
  if(parte.t==='pal')return um(audioResolveTexto(v.toLowerCase(),'pt-BR',['pt-palavra']));
  if(parte.t==='sil'||parte.t==='caps'){
    const baixo=v.toLowerCase();
    const k=audioResolveTexto(baixo,'pt-BR',['pt-silaba','pt-palavra','pt-letra']);
    if(k)return {chaves:[k],faltas:[]};
    /* sigla ou dígrafo (RR, CH, LH): fala o nome das letras, uma a uma */
    const ch=[],falta=[];
    baixo.split('').forEach(l=>{const kl=audioResolveTexto(l,'pt-BR',['pt-letra']);if(kl)ch.push(kl);else falta.push('letra:'+l);});
    return {chaves:ch,faltas:falta};
  }
  return {chaves:[],faltas:[parte.t+':'+v]};
}
/* O texto inteiro pode ter clipe próprio (aula, palavra, frase em inglês). Se não tiver, compõe por quadros e encaixes.
   html: o que o app mandaria falar. idioma: 'pt-BR'|'en-US'. mat: matéria do enunciado ('mat'|'pt'|'en'). */
function audioSequencia(html,idioma,mat){
  const ing=idioma==='en-US';
  const t=ing?limpaEN(html):emTexto(html);
  const inteiro=audioResolveTexto(t,idioma);
  if(inteiro)return {texto:t,chaves:[inteiro],faltas:[],composto:false};
  if(ing)return {texto:t,chaves:[],faltas:[t],composto:false};
  const chaves=[],faltas=[];
  const partes=audioPartes(t,mat||'mat');
  partes.forEach(p=>{
    if(p.t==='quadro'){
      const k=audioResolveTexto(p.v,'pt-BR',['quadro-enunciado']);
      if(k)chaves.push(k);else faltas.push('quadro:'+p.v);
    }else{const r=audioEncaixe(p);r.chaves.forEach(k=>chaves.push(k));r.faltas.forEach(f=>faltas.push(f));}
  });
  return {texto:t,chaves:chaves,faltas:faltas,composto:true};
}
