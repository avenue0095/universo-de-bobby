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
  if(!f||f.length>6000)return null;
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
