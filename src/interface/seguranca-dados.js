/* ---------- segurança dos dados que entram no app (backup .json importado ou localStorage adulterado) ----------
   Sem DOM, testado em Node. Tudo o que vem de fora passa por aqui em estadoDe(): o resto do app confia no estado validado.
   Regras: chave perigosa nunca entra (__proto__, constructor, prototype); texto de pergunta só mantém marcação simples
   (b, i, em, strong, br, small, sup, sub e span com class), nunca atributo de evento, link nem script; figura só é aceita
   se for SVG com tags e atributos de uma lista curta; qualquer campo fora da lista é descartado. */
const CHAVES_PERIGOSAS=/^(__proto__|constructor|prototype)$/;
const chaveOk=k=>!CHAVES_PERIGOSAS.test(String(k));
/* reviver do JSON.parse: some com as chaves perigosas em qualquer profundidade */
const semChavesPerigosas=(k,v)=>chaveOk(k)?v:undefined;
const TETO_BACKUP_BYTES=2*1024*1024;

const TAGS_TEXTO=/^(b|i|em|strong|br|small|sup|sub)$/;
/* devolve o texto com toda marcação fora da lista transformada em texto puro (o < vira &lt;) */
function htmlSeguro(t,max){
  t=String(t==null?'':t).slice(0,max||400);
  return t.replace(/<(\/?)([a-zA-Z][a-zA-Z0-9]*)([^<>]*)>|<(?=[a-zA-Z\/!?])/g,(m,fecha,tag,resto)=>{
    if(!tag)return '&lt;';        /* < solto seguido de letra, barra, ! ou ?: nunca vira tag. < solto seguido de espaço, número ou fim (como em 3 < 5) fica como está */
    tag=tag.toLowerCase();
    const classe=/^\s+class="[a-z0-9 _-]{0,30}"\s*$/.test(resto||'');
    if((TAGS_TEXTO.test(tag)||tag==='span')&&(fecha?!/[^\s\/]/.test(resto||''):(classe&&tag!=='br')||!/[^\s\/]/.test(resto||'')))return '<'+fecha+tag+(classe&&!fecha?resto.replace(/\s+/g,' '):'')+'>';
    return m.replace(/</g,'&lt;').replace(/>/g,'&gt;');
  });
}
const TAGS_SVG=/^(svg|g|rect|circle|ellipse|line|polyline|polygon|path|text|tspan)$/;
const ATRS_SVG=/^(viewBox|class|role|width|height|x|y|x1|y1|x2|y2|cx|cy|r|rx|ry|d|points|fill|stroke|stroke-width|stroke-linecap|stroke-linejoin|text-anchor|font-size|font-family|transform|opacity|xmlns|aria-label)$/;
/* devolve a figura se for só SVG simples; senão null */
function figuraSegura(f){
  f=String(f==null?'':f);
  if(!f||f.length>20000)return null;
  const tags=f.match(/<[^>]*>/g)||[];
  const fora=f.replace(/<[^>]*>/g,'');
  if(/[<>]/.test(fora))return null;
  for(const t of tags){
    const m=t.match(/^<(\/?)([a-zA-Z][a-zA-Z0-9]*)((?:\s+[a-zA-Z:-]+="[^"<>]*")*)\s*(\/?)>$/);
    if(!m||!TAGS_SVG.test(m[2]))return null;
    const atrs=m[3].match(/[a-zA-Z:-]+="[^"]*"/g)||[];
    for(const a of atrs){
      const nome=a.slice(0,a.indexOf('='));
      const valor=a.slice(a.indexOf('=')+2,-1);
      if(!ATRS_SVG.test(nome)||/javascript:|url\(|data:|&#|expression/i.test(valor))return null;
    }
  }
  return f;
}
const textoPuro=(v,max)=>String(v==null?'':v).replace(/[<>]/g,'').slice(0,max||120);
/* uma pergunta guardada (erro ou item de revisão): só os campos conhecidos, cada um validado; null se não der para usar */
function perguntaSegura(q){
  if(!q||typeof q!=='object'||Array.isArray(q))return null;
  if(typeof q.prompt!=='string'||q.answer===undefined||q.answer===null)return null;
  const tipo=String(q.type||'');
  if(!/^[a-z]{2,12}$/.test(tipo))return null;
  const r={type:tipo,prompt:htmlSeguro(q.prompt,500)};
  const ans=a=>(typeof a==='number'&&isFinite(a))?a:htmlSeguro(a,120);
  r.answer=ans(q.answer);
  if(q.options!==undefined){
    if(!Array.isArray(q.options))return null;
    r.options=q.options.slice(0,6).map(ans);
  }
  if(tipo==='mc'&&!(r.options&&r.options.length>=2))return null;
  if(q.ouvir!==undefined)r.ouvir=textoPuro(q.ouvir,400);
  if(q.lang!==undefined){if(!/^[a-z]{2}(-[A-Za-z]{2})?$/.test(String(q.lang)))return null;r.lang=String(q.lang);}
  ['partes','alvoP','alvoG','max','w'].forEach(k=>{if(q[k]!==undefined){const n=+q[k];if(!isFinite(n)||n<0||n>1000)return;r[k]=Math.round(n);}});
  if(q.teclado!==undefined&&/^[a-z]{3,8}$/.test(String(q.teclado)))r.teclado=String(q.teclado);
  if(q.pecas!==undefined){
    if(!Array.isArray(q.pecas)||q.pecas.length>16)return null;
    const ok=q.pecas.every(p=>typeof p==='string'&&/^[\p{L}0-9'’ -]{1,20}$/u.test(p));
    if(!ok)return null;
    r.pecas=q.pecas.slice();
  }
  if(q.reforco!==undefined)r.reforco=htmlSeguro(q.reforco,300);
  if(q.figure!==undefined){const f=figuraSegura(q.figure);if(f)r.figure=f;}
  if(q.m!==undefined&&['mat','pt','en'].indexOf(q.m)>=0)r.m=q.m;
  if(q.f!==undefined&&/^[a-z0-9._]{0,12}$/.test(String(q.f)))r.f=String(q.f);
  if(q.sk!==undefined&&/^[a-z0-9._:-]{0,40}$/.test(String(q.sk)))r.sk=String(q.sk);
  verboSeguro(q,r);
  return repararVerbo(r);
}
/* ---------- pergunta com verbo guardada (caderno de erros e revisão espaçada) ----------
   Antes de 08/11/2026 o verbo e os objetos ficavam de fora daqui: a pergunta voltava com "Toque em cada semente..." e sem as sementes.
   Agora os campos do verbo entram validados; e item antigo (sem eles) é reconstruído pelo próprio enunciado e pela resposta. Se não der,
   vira pergunta de escolha com texto que não manda tocar em nada que não existe. O ligar nunca chega aqui (vai a pergunta de origem). */
const VERBOS_GUARDAVEIS=/^(tocar-objetos|arrastar|tocar-letra|ordenar|tracar|arrastar-resposta|tocar-ouvir)$/;
/* [singular, plural, tipo] (o mesmo NOME_OBJ de verbos.js, aqui sem depender da ordem dos scripts) */
const OBJ_NOMES=[['semente','sementes','semente'],['maçã','maçãs','maca'],['concha','conchas','concha'],['caixa','caixas','caixa'],['lanche','lanches','lanche'],
  ['fatia','fatias','fatia'],['peça','peças','letra'],['vagão','vagões','vagao'],['placa','placas','placa'],['bilhete','bilhetes','bilhete']];
const TIPOS_OBJ=OBJ_NOMES.map(o=>o[2]);
const intEntre=(v,a,b)=>{const n=+v;return Number.isInteger(n)&&n>=a&&n<=b?n:null;};
function verboSeguro(q,r){
  if(typeof q.verbo!=='string'||!VERBOS_GUARDAVEIS.test(q.verbo))return;
  const o=q.objetos;
  if(o&&typeof o==='object'&&!Array.isArray(o)){
    const n=intEntre(o.n,1,30);
    if(n!=null&&TIPOS_OBJ.indexOf(o.tipo)>=0){r.objetos={n:n,tipo:o.tipo};if(o.nova!==undefined)r.objetos.nova=o.nova?1:0;if(o.tirada!==undefined)r.objetos.tirada=o.tirada?1:0;}
  }
  if(q.cestas!==undefined){const c=intEntre(q.cestas,1,6);if(c!=null)r.cestas=c;}
  if(q.modo==='cada'||q.modo==='total')r.modo=q.modo;
  if(typeof q.palavra==='string'&&/^[A-ZÁ-ÚÀÂÊÔÃÕÇ]{2,16}$/.test(q.palavra))r.palavra=q.palavra;
  if(Array.isArray(q.cartas)&&q.cartas.length>=3&&q.cartas.length<=5&&q.cartas.every(c=>typeof c==='string'&&/^[\p{L}0-9]{1,3}$/u.test(c)))r.cartas=q.cartas.slice();
  r.verbo=q.verbo;
}
const objPorNome=t=>{t=String(t||'').toLowerCase();return OBJ_NOMES.find(o=>o[0]===t||o[1]===t)||null;};
const temOpcoes=r=>Array.isArray(r.options)&&r.options.length>=2&&r.options.some(o=>String(o)===String(r.answer));
/* o verbo tem tudo o que a tela dele precisa? */
function verboCompleto(r){
  switch(r.verbo){
    case 'tocar-objetos':return !!r.objetos&&r.type==='mc'&&temOpcoes(r);
    case 'arrastar':return !!r.objetos&&!!r.cestas&&(r.modo==='cada'||r.modo==='total');
    case 'tocar-letra':return !!r.palavra&&r.type==='mc'&&temOpcoes(r);
    case 'ordenar':return !!r.cartas&&r.type==='mc';
    case 'tracar':case 'arrastar-resposta':return r.type==='mc'&&temOpcoes(r)&&r.options.length<=4;
    case 'tocar-ouvir':return r.type==='mc'&&temOpcoes(r);
  }
  return false;
}
/* reconstrói pelo enunciado que o próprio app escreveu (comVerbo); devolve true se conseguiu */
function reconstruirVerbo(r){
  const p=String(r.prompt).replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim(),num=+String(r.answer).replace(',','.');
  let m;
  if((m=p.match(/^Toque em cada (\S+) para contar\. Quant[ao]s (\S+) (?:tem aqui|são ao todo)\?$/))&&objPorNome(m[1])&&Number.isInteger(num)&&num>=1&&num<=30){
    r.verbo='tocar-objetos';r.objetos={n:num,tipo:objPorNome(m[1])[2]};return true;}
  if((m=p.match(/^São (\d+) (\S+) e chegou mais (?:um|uma)\./))&&objPorNome(m[2])&&+m[1]<=29){
    r.verbo='tocar-objetos';r.objetos={n:+m[1]+1,tipo:objPorNome(m[2])[2],nova:1,tirada:0};return true;}
  if((m=p.match(/^São (\d+) (\S+) e (?:um|uma) saiu\./))&&objPorNome(m[2])&&+m[1]>=1&&+m[1]<=30){
    r.verbo='tocar-objetos';r.objetos={n:+m[1],tipo:objPorNome(m[2])[2],nova:0,tirada:1};return true;}
  if((m=p.match(/^Você tinha (\d+) (\S+) e ganhou mais/))&&objPorNome(m[2])&&+m[1]<=29){
    r.verbo='tocar-objetos';r.objetos={n:+m[1]+1,tipo:objPorNome(m[2])[2],nova:1,tirada:0};return true;}
  if((m=p.match(/^Arraste (?:as|os) (\d+) (\S+) para as (\d+) cestas/))&&objPorNome(m[2])&&+m[1]>=1&&+m[1]<=30&&+m[3]>=1&&+m[3]<=6){
    r.verbo='arrastar';r.objetos={n:+m[1],tipo:objPorNome(m[2])[2]};r.cestas=+m[3];r.modo='cada';return true;}
  if((m=p.match(/^Monte (\d+) grupos de (\d+): arraste \d+ (\S+) para cada cesta/))&&objPorNome(m[3])&&+m[1]>=1&&+m[1]<=6&&+m[1]*+m[2]<=30){
    r.verbo='arrastar';r.objetos={n:+m[1]*+m[2],tipo:objPorNome(m[3])[2]};r.cestas=+m[1];r.modo='total';r.alvoG=+m[1];r.alvoP=+m[2];return true;}
  if(r.type==='mc'&&temOpcoes(r)&&(m=p.match(/(primeira vogal|primeira letra|última letra|com que letra começa|com que letra termina) (?:de |a palavra )?([A-ZÁ-ÚÀÂÊÔÃÕÇ]{3,16})\b/i))){
    r.verbo='tocar-letra';r.palavra=m[2].toUpperCase();return true;}
  if(/^Toque nas letras na ordem do alfabeto\.$/.test(p)&&r.type==='mc'){
    const letras=String(r.answer).split(/[\s,]+/).filter(Boolean);
    if(letras.length>=3&&letras.length<=5&&letras.every(c=>/^[\p{L}]{1,3}$/u.test(c))){
      /* a ordem original se perdeu: embaralha de um jeito fixo que nunca começa certo */
      r.verbo='ordenar';r.cartas=letras.slice(2).concat(letras.slice(0,2)).reverse();return true;}
  }
  return false;
}
/* texto de escolha coerente quando não dá para reconstruir: tira a instrução de tocar ou arrastar */
function semInstrucaoDeVerbo(r){
  const p=String(r.prompt).replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim();
  let m;
  if((m=p.match(/vem (depois|antes) do (\d+)\?$/)))return 'Que número vem '+m[1]+' do '+m[2]+'?';
  if((m=p.match(/^Você tinha (\d+) (\S+) e ganhou mais (um|uma) (\S+)/)))return 'Você tinha '+m[1]+' '+m[2]+' e ganhou mais '+m[3]+'. Com quant'+(m[3]==='um'?'o':'a')+'s ficou?';
  if((m=p.match(/^Arraste (?:as|os) (\d+) (\S+) para as (\d+) cestas/)))return m[1]+' '+m[2]+' repartid'+(objPorNome(m[2])&&/o$/.test(m[2].replace(/s$/,''))?'o':'a')+'s em '+m[3]+' cestas, o mesmo tanto em cada uma. Quant'+(/o$/.test(m[2].replace(/s$/,''))?'o':'a')+'s em cada cesta?';
  if((m=p.match(/^Monte (\d+) grupos de (\d+)/)))return m[1]+' grupos de '+m[2]+'. Quantos são ao todo?';
  if(/^Toque nas letras na ordem do alfabeto/.test(p))return 'Qual é a ordem do alfabeto?';
  if(/^(Toque|Arraste|Ligue|Siga|Solte)\b/i.test(p))return 'Escolha a resposta certa.';
  /* "Toque em cada semente para contar. Quantas sementes tem aqui?" sem as sementes não tem como responder: escolha pelo número */
  return null;
}
function repararVerbo(r){
  if(r.verbo&&verboCompleto(r))return r;
  delete r.verbo;delete r.objetos;delete r.cestas;delete r.modo;delete r.palavra;delete r.cartas;
  if(reconstruirVerbo(r)&&verboCompleto(r))return r;
  delete r.verbo;delete r.objetos;delete r.cestas;delete r.modo;delete r.cartas;
  const p=String(r.prompt).replace(/<[^>]+>/g,' ');
  if(!/\b(Toque|toque|Arraste|arraste|Ligue|Siga|Solte|Monte)\b/.test(p))return r;
  /* não reconstruiu, mas o texto manda tocar ou arrastar: vira escolha com texto coerente, nunca instrução sem objeto */
  const novo=semInstrucaoDeVerbo(r);
  if(!novo)return null;          /* sem texto coerente possível: o item sai (a fase gera outra pergunta) */
  r.prompt=novo;
  if(r.type!=='mc'||!temOpcoes(r)){
    const a=String(r.answer),n=parseInt(a,10);
    if(!/^\d{1,3}$/.test(a))return null;
    r.type='mc';r.options=[a,String(n+1),String(n>0?n-1:n+2)].sort();
  }
  return r;
}
/* texto curto de lista fechada de caracteres (o "presente" do baú de amanhã) */
function textoCurtoSeguro(v,max){
  v=String(v==null?'':v).slice(0,max||40);
  return /^[\p{L}0-9 ,.'’:()+-]*$/u.test(v)?v:'';
}

/* listas e nomes simples */
const idSimples=(v,max)=>{v=String(v==null?'':v);return /^[a-z0-9-]{1,40}$/.test(v)&&v.length<=(max||24)?v:'';};
const nomeSeguro=(v,max)=>String(v==null?'':v).replace(/[<>"&`]/g,'').slice(0,max||18);
