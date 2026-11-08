/* ---------- verbos na cena (mesa 03, mudanças 1, 2, 3, 7 e 12; síntese 1B) ----------
   A pergunta deixa de ser só "toque na alternativa": a criança TOCA objeto por objeto para contar, ARRASTA objetos para cestas (ou toca origem e
   destino), toca a LETRA dentro da palavra, ORDENA cartas tocando na ordem e ouve e toca a placa (inglês). Sessão 1B2: LIGAR (três perguntas
   da própria fase ligadas às respostas com um traço ou com dois toques) e TRAÇAR (seguir com o dedo o caminho da estrela até a resposta).
   Toda fase de 4 ou mais perguntas sai com pelo menos 3 verbos oficiais (testes/variedade.js mede as 150 fases).
   Regras iguais para todo verbo: pressionado no mesmo quadro (.pressionado), hit-stop de 70 ms no acerto, o objeto certo faz squash, no erro o
   objeto balança sem vermelho, e o que a criança fez permanece na cena até a pergunta acabar. Objetos em SVG leve (sem arte nova por enquanto;
   pedido em arte/PEDIDOS-DE-ARTE.md), um tipo por capítulo. */
const VERBOS_OFICIAIS=['tocar','arrastar','ligar','ordenar','tracar'];
/* verbos que têm tela própria (os outros, como tocar-ouvir, usam a lista de alternativas de sempre) */
const VERBOS_COM_TELA=['tocar-objetos','arrastar','tocar-letra','ordenar','ligar','tracar','arrastar-resposta'];
const temTelaPropria=q=>!!(q&&q.verbo&&VERBOS_COM_TELA.indexOf(q.verbo)>=0);
const OBJ_SVG={
  /* semente que brota (feijão marrom com risco e um broto de duas folhas): a forma antiga, uma gota azul, parecia água */
  semente:'<svg viewBox="0 0 32 32"><path class="s4" d="M17 12c0-3 0-5-.5-7"/><path class="s3" d="M16.5 6c-3-3-7-3-9-1 2.5 2.5 6 3 9 1Z"/><path class="s3" d="M16.7 5.5c2-3 6-4 8.5-2.5-1.5 2.5-5 4-8.5 2.5Z"/><ellipse class="s1" cx="16" cy="20.5" rx="7.5" ry="9.5" transform="rotate(-24 16 20.5)"/><path class="s2" d="M13.5 13.5c3 2.5 4.5 7 3.5 12.5"/></svg>',
  maca:'<svg viewBox="0 0 32 32"><path class="o1" d="M11 9c-5 0-8 5-8 10 0 6 5 11 9 11 2 0 3-1 4-1s2 1 4 1c4 0 9-5 9-11 0-5-3-10-8-10-2 0-3 1-5 1s-3-1-5-1Z"/><path class="o3" d="M16 9c0-3 2-6 5-6"/></svg>',
  concha:'<svg viewBox="0 0 32 32"><path class="o1" d="M16 4 5 24a3 3 0 0 0 3 4h16a3 3 0 0 0 3-4L16 4Z"/><path class="o2" d="M16 8v18M10 22l6-11 6 11"/></svg>',
  caixa:'<svg viewBox="0 0 32 32"><rect class="o1" x="4" y="9" width="24" height="19" rx="2"/><path class="o2" d="M4 14h24M16 9v19"/><path class="o3" d="M8 9l4-5h8l4 5"/></svg>',
  lanche:'<svg viewBox="0 0 32 32"><rect class="o1" x="4" y="8" width="24" height="16" rx="6"/><path class="o2" d="M8 16h16"/><circle class="o3" cx="12" cy="12" r="1.5"/><circle class="o3" cx="20" cy="12" r="1.5"/></svg>',
  fatia:'<svg viewBox="0 0 32 32"><path class="o1" d="M16 4 28 26a2 2 0 0 1-2 3H6a2 2 0 0 1-2-3L16 4Z"/><circle class="o3" cx="16" cy="18" r="2.5"/><circle class="o3" cx="11" cy="24" r="2"/><circle class="o3" cx="21" cy="24" r="2"/></svg>',
  letra:'<svg viewBox="0 0 32 32"><rect class="o1" x="3" y="3" width="26" height="26" rx="5"/><path class="o2" d="M8 8h16v16H8z"/></svg>',
  vagao:'<svg viewBox="0 0 32 32"><rect class="o1" x="3" y="8" width="26" height="15" rx="3"/><circle class="o3" cx="10" cy="26" r="3"/><circle class="o3" cx="22" cy="26" r="3"/></svg>',
  placa:'<svg viewBox="0 0 32 32"><rect class="o1" x="4" y="5" width="24" height="14" rx="3"/><path class="o3" d="M16 19v10M12 29h8"/></svg>',
  bilhete:'<svg viewBox="0 0 32 32"><rect class="o1" x="3" y="7" width="26" height="18" rx="3"/><path class="o2" d="M3 10l13 9 13-9"/></svg>',
  cesta:'<svg viewBox="0 0 64 48"><path class="o1" d="M6 18h52l-6 26H12L6 18Z"/><path class="o2" d="M14 18c2-10 34-10 36 0"/><path class="o2" d="M10 28h44"/></svg>'
};
/* um objeto por capítulo (história da etapa) */
const OBJ_POR_ETAPA={
  mat:{1:'semente',2:'concha',3:'caixa',4:'lanche',5:'fatia',6:'caixa',7:'caixa',8:'maca',9:'caixa',10:'semente'},
  pt:{1:'letra',2:'vagao',3:'bilhete',4:'letra',5:'bilhete',6:'caixa',7:'letra',8:'bilhete',9:'letra',10:'vagao'},
  en:{1:'placa',2:'placa',3:'bilhete',4:'maca',5:'lanche',6:'caixa',7:'caixa',8:'placa',9:'bilhete',10:'placa'}
};
/* [singular, plural, gênero] */
const NOME_OBJ={semente:['semente','sementes','a'],maca:['maçã','maçãs','a'],concha:['concha','conchas','a'],caixa:['caixa','caixas','a'],lanche:['lanche','lanches','o'],fatia:['fatia','fatias','a'],letra:['peça','peças','a'],vagao:['vagão','vagões','o'],placa:['placa','placas','a'],bilhete:['bilhete','bilhetes','o']};
const art=(nome,pl)=>(nome[2]==='o'?(pl?'os':'o'):(pl?'as':'a'));
const quant=nome=>nome[2]==='o'?'Quantos':'Quantas';
const umA=nome=>nome[2]==='o'?'um':'uma';
function objetoDaFase(l){
  const id=String(l&&l.id||''),mat=id.charAt(0)==='p'?'pt':(id.charAt(0)==='e'?'en':'mat');
  const n=parseInt(id.replace(/^[pe]/,''),10)||1;
  return (OBJ_POR_ETAPA[mat]||OBJ_POR_ETAPA.mat)[n]||'semente';
}
const objetoHTML=(tipo,i,extra)=>'<button type="button" class="obj'+(extra&&extra.cls?' '+extra.cls:'')+'" data-i="'+i+'"'+(extra&&extra.attrs?' '+extra.attrs:'')+' aria-label="'+(NOME_OBJ[tipo]||['objeto'])[0]+' '+(i+1)+'">'+OBJ_SVG[tipo]+'<span class="obj-n" aria-hidden="true"></span></button>';

/* o verbo de uma pergunta (qualquer tipo) */
function verboDe(q){
  if(!q)return 'tocar';
  if(q.verbo)return q.verbo.split('-')[0];
  if(q.type==='silabas')return 'ordenar';
  if(q.type==='input'||q.type==='texto')return 'digitar';
  return 'tocar';
}
/* ---------- conversão: o que o gerador fez vira verbo na cena quando a pergunta permite ---------- */
function comVerbo(q,l){
  if(!q||q.__item||q.__aquec)return q;
  const p=String(q.prompt||'').replace(/<[^>]+>/g,''),tipoObj=objetoDaFase(l);
  /* contar bolinhas → tocar objeto por objeto (zero bolinhas genéricas na etapa com história) */
  if(q.type==='mc'&&/quant[ao]s bolinhas/i.test(p)&&/dots/.test(String(q.figure||''))&&+q.answer<=24){
    const n=+q.answer,nome=NOME_OBJ[tipoObj];
    q.verbo='tocar-objetos';q.objetos={n:n,tipo:tipoObj};q.figure='';
    q.prompt=/ao todo/i.test(p)?'Toque em cada '+nome[0]+' para contar. '+quant(nome)+' '+nome[1]+' são ao todo?':'Toque em cada '+nome[0]+' para contar. '+quant(nome)+' '+nome[1]+' tem aqui?';
    return q;
  }
  /* vem depois / vem antes (até 20): contar os objetos e mais um (ou menos um) tocando */
  let m;
  if(q.type==='mc'&&(m=p.match(/vem (depois|antes) do (\d+)\?/i))&&+m[2]<=20&&+m[2]>=1){
    const n=+m[2],dep=m[1].toLowerCase()==='depois',nome=NOME_OBJ[tipoObj];
    q.verbo='tocar-objetos';q.objetos={n:dep?n+1:n,tipo:tipoObj,nova:dep?1:0,tirada:dep?0:1};q.figure='';
    q.prompt=dep?'São '+n+' '+nome[1]+' e chegou mais '+umA(nome)+'. Toque em cada '+umA(nome)+' para contar: que número vem depois do '+n+'?'
              :'São '+n+' '+nome[1]+' e '+umA(nome)+' saiu. Toque n'+art(nome,true)+' que ficaram para contar: que número vem antes do '+n+'?';
    return q;
  }
  if(q.type==='input'&&(m=p.match(/Se você tem (\d+) figurinhas e ganha mais 1, fica com quantas\?/i))&&+m[1]<=20){
    const n=+m[1],nome=NOME_OBJ[tipoObj];
    q.type='mc';q.options=shufA([String(n+1),String(n),String(n+2)]);q.answer=String(n+1);
    q.verbo='tocar-objetos';q.objetos={n:n+1,tipo:tipoObj,nova:1,tirada:0};
    q.prompt='Você tinha '+n+' '+nome[1]+' e ganhou mais '+umA(nome)+'. Toque em cada '+umA(nome)+' para contar: com '+quant(nome).toLowerCase()+' ficou?';
    return q;
  }
  if(q.type==='input'&&(m=p.match(/^(\d+) (bolinhas|balas) (repartidas igualmente em|divididas entre) (\d+) (grupos|crianças)/i))&&+m[1]<=24&&+m[4]<=5){
    const n=+m[1],g=+m[4],nome=NOME_OBJ[tipoObj];
    q.verbo='arrastar';q.objetos={n:n,tipo:tipoObj};q.cestas=g;q.figure='';q.modo='cada';
    q.prompt='Arraste '+art(nome,true)+' '+n+' '+nome[1]+' para as '+g+' cestas, o mesmo tanto em cada uma. '+quant(nome)+' ficam em cada cesta?';
    return q;
  }
  if(q.type==='grupinhos'&&q.alvoG<=5&&q.alvoG*q.alvoP<=24){
    const n=q.alvoG*q.alvoP,nome=NOME_OBJ[tipoObj];
    q.verbo='arrastar';q.objetos={n:n,tipo:tipoObj};q.cestas=q.alvoG;q.modo='total';
    q.prompt='Monte '+q.alvoG+' grupos de '+q.alvoP+': arraste '+q.alvoP+' '+nome[1]+' para cada cesta. '+quant(nome)+' são ao todo?';
    return q;
  }
  /* letra dentro da palavra → tocar na letra */
  if(q.type==='mc'&&(m=p.match(/(primeira vogal|primeira letra|última letra|com que letra começa|com que letra termina) (?:de |a palavra )?([A-ZÁ-Ú]{3,})/i))){
    q.verbo='tocar-letra';q.palavra=m[2].toUpperCase();q.figure='';
    return q;
  }
  if(q.type==='mc'&&(m=p.match(/^Com que letra (começa|termina) ([A-ZÁ-Ú]{3,})\?/i))){q.verbo='tocar-letra';q.palavra=m[2].toUpperCase();return q;}
  /* ordem alfabética → ordenar cartas tocando na ordem */
  if(q.type==='mc'&&(m=p.match(/^Coloque em ordem: (.+)$/))){
    const cartas=m[1].split(/,\s*/).map(x=>x.trim()).filter(Boolean);
    if(cartas.length>=3&&cartas.length<=5){q.verbo='ordenar';q.cartas=cartas;q.prompt='Toque nas letras na ordem do alfabeto.';}
    return q;
  }
  /* ouvir e tocar (inglês): já é toque com áudio obrigatório; só marca */
  if(q.type==='mc'&&q.ouvir&&q.lang==='en-US'){q.verbo='tocar-ouvir';return q;}
  return q;
}
/* ordem: nunca 3 perguntas seguidas do mesmo verbo (a 1ª continua sendo de reconhecer). Guloso: a cada posição entra a pergunta do verbo
   com mais sobras que não forme trinca; quando não há como evitar (fase com um verbo só), fica como está. */
function ordenarVerbos(qs){
  if(qs.length<3)return qs;
  const resto=qs.slice(1),out=[qs[0]];
  const grupos={};resto.forEach(q=>{const v=verboDe(q);(grupos[v]=grupos[v]||[]).push(q);});
  while(out.length<qs.length){
    const n=out.length,u1=n>=1?verboDe(out[n-1]):'',u2=n>=2?verboDe(out[n-2]):'';
    const cand=Object.keys(grupos).filter(v=>grupos[v].length).sort((x,y)=>grupos[y].length-grupos[x].length);
    let v=cand.find(v=>!(v===u1&&v===u2));
    if(!v)v=cand[0];
    out.push(grupos[v].shift());
  }
  return out;
}
function aplicarVerbos(qs,l){
  try{
    let out=qs.map(q=>comVerbo(q,l));
    /* 1B2: fase de verdade (4 ou mais perguntas) ganha uma pergunta de ligar e uma de traçar, sempre do conteúdo da própria fase */
    if(out.length>=4){out=comLigar(out);out=comTracar(out);if(!out.some(q=>q&&q.verbo==='ligar'))out=comArrastarResposta(out);}
    return ordenarVerbos(out);
  }catch(e){return qs;}
}
/* ---------- LIGAR (1B2): três perguntas curtas da fase, cada uma ligada à sua resposta ----------
   Segurança do gabarito: cada lado esquerdo só pode combinar com UMA resposta da direita. Pergunta digitada (input, texto) tem resposta única
   por construção; pergunta de escolha só entra se as outras respostas do conjunto forem distratores dela (estão nas opções e não são o gabarito),
   ou se o enunciado for uma conta pura. */
const txtVerbo=s=>String(s==null?'':s).replace(/<br\s*\/?>/gi,' ').replace(/<[^>]+>/g,'').replace(/&nbsp;/g,' ').replace(/\s+/g,' ').trim();
/* "Quanto é 4 × 4?" e "4 × 4 = ?" são a mesma pergunta: o cartão do ligar mostra só "4 × 4" */
const nucleoDoEnunciado=p=>txtVerbo(p).replace(/^Quanto é (.+)\?$/i,'$1').replace(/^(.+?) = \?$/,'$1');
const chaveNucleo=q=>chaveVerbo(nucleoDoEnunciado(q.prompt))+'|'+chaveVerbo(q.answer);
const chaveVerbo=s=>txtVerbo(s).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
/* enunciado que só se responde ouvindo (o cartão do ligar não tem áudio) ou que tem lacuna (a lacuna aceita mais de uma resposta: GAT___ é
   gato e gata, MA - ___ é mala e mana); revisão independente de 08/11/2026 */
const PEDE_OUVIR=/\b(ouça|ouvir|ouviu|ouve|escute|escutou|listen|hear)\b/i;
const TEM_LACUNA=/_{2,}|\bfalta\b|\bque falta\b|complete/i;
const ehNumero=t=>/^-?\d{1,7}([.,]\d{1,3})?$/.test(String(t).trim());
function parDe(q){
  if(!q||typeof q!=='object'||q.figure||q.__item||q.__aquec||q.__irma)return null;
  if(q.verbo||q.ouvir)return null;
  if(PEDE_OUVIR.test(txtVerbo(q.prompt))||TEM_LACUNA.test(txtVerbo(q.prompt)))return null;
  if(['mc','input','texto'].indexOf(q.type)<0)return null;
  /* marcação que carrega sentido (fração, expoente, figura) não sobrevive ao texto puro do cartão: fica de fora */
  if(/<(?!\/?(b|br|strong|em)\b)[a-z]/i.test(String(q.prompt))||/[<&]/.test(String(q.answer))||/&(?!nbsp;)[a-z]+;/i.test(String(q.prompt)))return null;
  const r=txtVerbo(q.answer);
  let e=nucleoDoEnunciado(q.prompt);
  if(!r||r.length>16||/^(verdadeiro|falso)$/i.test(r)||/[<>]/.test(r))return null;
  if(e.length<2||e.length>72||/^(qual está certo|qual delas|qual destas)\??$/i.test(e))return null;
  const conta=/^[\d\s+−×÷\-:,.()=_?]+$/.test(e)&&/\d/.test(e);
  /* português: enunciado ancorado numa palavra em MAIÚSCULAS ou num trecho entre aspas, sem lacuna, e cuja resposta é um pedaço dessa âncora
     (primeira sílaba de PORTA, a ação em "O gato corre", plural de PEIXE). Na trinca, nenhuma outra resposta pode caber na mesma âncora. */
  let ancora='';
  if(q.lang!=='en-US'&&!/_{2,}/.test(e)){
    const pedacos=(e.match(/["“][^"“”]{2,}["”]/g)||[]).concat(e.match(/(?:^|[^\p{L}])([A-ZÁÉÍÓÚÂÊÔÃÕÇ]{3,})(?=$|[^\p{L}])/gu)||[]);
    ancora=pedacos.map(soLetras).join('|');
    if(ancora&&!ancoraTem(ancora,soLetras(r)))ancora='';
  }
  /* resposta única por construção só quando é conta pura ou, em pergunta digitada, um número (texto digitado pode ter sinônimo ou outra flexão);
     o resto só entra se as outras respostas do conjunto forem distratores dela (ops) ou não couberem na âncora */
  const unica=conta||(q.type!=='mc'&&ehNumero(r));
  if(!unica&&!ancora&&!(q.options&&q.options.length))return null;
  return {e:e,r:r,kr:chaveVerbo(r),ke:chaveVerbo(e),q:q,unica:unica,ancora:ancora,ops:(q.options||[]).map(chaveVerbo)};
}
/* o par p aceita o par o ao lado? (a resposta de o não pode servir para p) */
const soLetras=t=>chaveVerbo(t).replace(/[^a-z0-9]/g,'');
const ancoraTem=(ancora,x)=>!!x&&(ancora.indexOf(x)>=0||ancora.split('|').some(a=>a&&x.indexOf(a)===0));
function parCombina(p,o){
  if(p.kr===o.kr||p.ke===o.ke)return false;
  if(p.unica)return true;
  if(p.ancora)return !ancoraTem(p.ancora,soLetras(o.r));
  return p.ops.indexOf(o.kr)>=0;
}
function trincaDePares(pool){
  for(let a=0;a<pool.length;a++)for(let b=a+1;b<pool.length;b++){
    if(!parCombina(pool[a],pool[b])||!parCombina(pool[b],pool[a]))continue;
    for(let c=b+1;c<pool.length;c++){
      const t=[pool[a],pool[b],pool[c]];
      if(t.every(x=>t.every(y=>x===y||parCombina(x,y))))return t;
    }
  }
  return null;
}
function montarLigar(pares){
  const dir=shufA(pares.map((p,i)=>i));
  /* a direita nunca fica na mesma ordem da esquerda (senão é só tocar em linha reta) */
  if(dir.every((v,i)=>v===i))dir.push(dir.shift());
  const q={type:'ligar',verbo:'ligar',prompt:'Ligue cada pergunta à resposta certa.',
    pares:pares.map(p=>({e:p.e,r:p.r})),dir:dir,
    answer:pares.map(p=>p.e+' → '+p.r).join('; ')};
  /* a pergunta de origem é quem vai para o caderno, para a revisão e para a pergunta irmã (ligar é o jeito de responder, não um conteúdo novo) */
  q.__base=pares[0].q;q.__mk=pares[0].q.__mk;q.__origens=pares.map(p=>p.q);
  return q;
}
function comLigar(qs){
  if(qs.some(q=>q&&q.verbo==='ligar'))return qs;
  /* troca uma pergunta de digitar ou de tocar simples (nunca a 1ª, de reconhecer); os pares vêm de amostras NOVAS dos geradores da fase
     (mesma habilidade, outros números e palavras) e nunca repetem uma pergunta que continua na fase */
  const simples=i=>i>0&&!qs[i].verbo&&['mc','input','texto'].indexOf(qs[i].type)>=0;
  const cands=qs.map((q,i)=>i).filter(simples);
  if(!cands.length)return qs;
  const ja=new Set(qs.map(chaveNucleo));
  const mks=[];qs.forEach(q=>{if(q&&typeof q.__mk==='function'&&mks.indexOf(q.__mk)<0)mks.push(q.__mk);});
  const amostras=[];
  mks.forEach(mk=>{for(let t=0;t<8;t++){let c;try{c=mk();}catch(e){continue;}if(c&&typeof c==='object'&&c.prompt!=null&&!ja.has(chaveNucleo(c))){c.__mk=mk;amostras.push(c);}}});
  /* prefere trocar uma pergunta de digitar; ela mesma pode ser um dos três pares */
  const ordem=cands.filter(i=>qs[i].type!=='mc').concat(cands.filter(i=>qs[i].type==='mc'));
  for(const k of ordem){
    const pool=[],vistos=new Set();
    const poe=q=>{const p=parDe(q);if(p&&!vistos.has(p.ke)){vistos.add(p.ke);pool.push(p);}};
    /* a própria pergunta trocada entra no ligar, a não ser que a fase tenha outra igual a ela ("Quanto é 2 × 4?" e "2 × 4 = ?") */
    if(qs.filter((q,i)=>i!==k&&chaveNucleo(q)===chaveNucleo(qs[k])).length===0)poe(qs[k]);
    amostras.forEach(poe);
    const t=trincaDePares(pool);
    if(!t)continue;
    const out=qs.slice();out[k]=montarLigar(t);
    return out;
  }
  return qs;
}
/* ---------- TRAÇAR (1B2): seguir com o dedo (ou o mouse) o caminho da estrela até a resposta ----------
   Serve para pergunta de escolha com 2 a 4 opções curtas, sem figura nas opções. Pergunta digitada de número inteiro vira escolha com
   vizinhos do número (como a das figurinhas). */
const FRAC_OPCAO=/^<span class="frac"><b>\d{1,3}<\/b><i>\d{1,3}<\/i><\/span>$/;
const opcaoCurta=o=>{const t=txtVerbo(o);return t.length>=1&&t.length<=22&&(!/[<>]/.test(String(o))||FRAC_OPCAO.test(String(o)));};
function podeTracar(q){
  if(!q||q.type!=='mc'||(q.verbo&&q.verbo!=='tocar-ouvir'))return false;
  return Array.isArray(q.options)&&q.options.length>=2&&q.options.length<=4&&q.options.every(opcaoCurta);
}
/* pergunta digitada de número inteiro vira escolha com os vizinhos do número (como a das figurinhas); devolve a posição ou -1 */
function virarEscolha(qs){
  const k=qs.findIndex((q,i)=>i>0&&q.type==='input'&&!q.verbo&&/^\d{1,3}(,\d{1,2})?$/.test(String(q.answer)));
  if(k<0)return -1;
  /* decimal com vírgula: os vizinhos andam 1 inteiro (5,3 vira 4,3 e 6,3), as casas ficam iguais */
  const q=qs[k],a=String(q.answer),dec=a.indexOf(',')>=0?a.slice(a.indexOf(',')):'',n=parseInt(a,10);
  const viz=[n+1,n>0?n-1:n+2].map(x=>String(x)+dec);
  q.type='mc';q.options=shufA([a,...viz]);q.answer=a;
  return k;
}
function comTracar(qs){
  if(qs.some(q=>q&&q.verbo==='tracar'))return qs;
  let k=qs.findIndex((q,i)=>i>0&&podeTracar(q)&&!q.verbo);
  if(k<0)k=qs.findIndex((q,i)=>i>0&&podeTracar(q));
  if(k<0)k=virarEscolha(qs);
  if(k<0)return qs;
  qs[k].verbo='tracar';
  /* 7 a 8 anos: só 2 caminhos (a resposta e um distrator) */
  if(tracarSimples()&&qs[k].options.length>2){const q=qs[k],d=q.options.filter(o=>o!==q.answer);q.options=shufA([q.answer,d[0]]);}
  return qs;
}
/* ---------- ARRASTAR A RESPOSTA (1B2): quando a fase não comporta ligar, uma pergunta de escolha vira "arraste a resposta até o balão" ---------- */
function comArrastarResposta(qs){
  const vs=new Set(qs.map(verboDe));
  if(vs.has('arrastar')&&new Set([...vs].filter(v=>VERBOS_OFICIAIS.indexOf(v)>=0)).size>=3)return qs;
  let k=qs.findIndex((q,i)=>i>0&&podeTracar(q)&&!q.verbo);
  if(k<0)k=qs.findIndex((q,i)=>i>0&&podeTracar(q));
  if(k<0)k=virarEscolha(qs);
  if(k<0)return qs;
  qs[k].verbo='arrastar-resposta';
  return qs;
}
/* ---------- a tela de cada verbo ---------- */
function verbosHTML(q){
  if(q.verbo==='tocar-objetos'){
    let h='<div class="cena-obj" data-verbo="tocar" aria-label="Objetos para contar">';
    for(let i=0;i<q.objetos.n;i++)h+=objetoHTML(q.objetos.tipo,i,{cls:(q.objetos.nova&&i===q.objetos.n-1?'nova':'')+(q.objetos.tirada&&i===q.objetos.n-1?' tirada':''),attrs:'style="--dx:'+((i*37)%23-11)+'px;--dy:'+((i*53)%17-8)+'px"'+(q.objetos.tirada&&i===q.objetos.n-1?' disabled aria-label="'+(NOME_OBJ[q.objetos.tipo]||['objeto'])[0]+' que saiu"':'')});
    h+='</div><p class="contagem" id="contagem" aria-live="polite">Toque em cada uma para contar</p>';
    h+='<div class="alts curtas '+(q.options.length>=4?'quatro':'tres')+'">'+q.options.map((o,k)=>'<button class="alt" data-v="'+k+'"><span>'+htmlSeguro(o,20)+'</span></button>').join('')+'</div>';
    return h;
  }
  if(q.verbo==='arrastar'){
    let h='<div class="cena-obj arrastar" data-verbo="arrastar"><div class="origem" id="origem" aria-label="Objetos">';
    for(let i=0;i<q.objetos.n;i++)h+=objetoHTML(q.objetos.tipo,i,{cls:'solto',attrs:'draggable="false"'});
    h+='</div><div class="cestas">';
    for(let c=0;c<q.cestas;c++)h+='<button type="button" class="cesta" data-c="'+c+'" aria-label="cesta '+(c+1)+'">'+OBJ_SVG.cesta+'<span class="cesta-n" aria-hidden="true">0</span><span class="cesta-itens"></span></button>';
    h+='</div></div><p class="contagem" id="contagem" aria-live="polite">Arraste cada uma até uma cesta, ou toque nela e depois na cesta</p>';
    return h;
  }
  if(q.verbo==='tocar-letra'){
    return '<div class="palavra-toque" role="group" aria-label="Letras de '+escapa(q.palavra)+'">'+
      q.palavra.split('').map((l,i)=>'<button type="button" class="letra-t" data-l="'+escapa(l)+'" data-i="'+i+'" aria-label="letra '+escapa(l)+'">'+escapa(l)+'</button>').join('')+'</div>'+
      '<p class="contagem" id="contagem">Toque na letra certa dentro da palavra</p>';
  }
  if(q.verbo==='ligar'){
    let h='<div class="ligar" id="ligar"><svg class="ligar-linhas" id="ligar-linhas" aria-hidden="true"></svg>'+
      '<div class="ligar-col esq" role="group" aria-label="Perguntas">'+q.pares.map((p,i)=>'<button type="button" class="lig lig-a" data-i="'+i+'"><span class="lig-txt">'+escapa(p.e)+'</span><i class="lig-ponto" aria-hidden="true"></i></button>').join('')+'</div>'+
      '<div class="ligar-col dir" role="group" aria-label="Respostas">'+q.dir.map(j=>'<button type="button" class="lig lig-b" data-j="'+j+'"><i class="lig-ponto" aria-hidden="true"></i><span class="lig-txt">'+escapa(q.pares[j].r)+'</span></button>').join('')+'</div></div>';
    return h+'<p class="contagem" id="contagem" aria-live="polite">Arraste um traço da pergunta até a resposta, ou toque numa e depois na outra</p>';
  }
  if(q.verbo==='tracar'){
    const cs=caminhosTracar(q.options.length);
    let h='<div class="tracar" id="tracar"><svg class="tracar-svg" viewBox="0 0 '+TRACO.W+' '+TRACO.H+'" preserveAspectRatio="none" aria-hidden="true">';
    cs.forEach((pts,k)=>{h+='<path class="caminho" data-k="'+k+'" d="'+dDe(pts)+'"/>';});
    h+='<path class="tinta" id="tracar-tinta" d=""/></svg><span class="tracar-estrela" aria-hidden="true">'+ESTRELA_SVG+'</span>';
    h+='<div class="tracar-fins" role="group" aria-label="Respostas">'+q.options.map((o,k)=>'<button type="button" class="tracar-fim" data-k="'+k+'">'+htmlSeguro(o,80)+'</button>').join('')+'</div></div>';
    return h+'<p class="contagem" id="contagem" aria-live="polite">Ponha o dedo na estrela e siga um caminho até a resposta</p>';
  }
  if(q.verbo==='arrastar-resposta'){
    return '<div class="arrasta-r"><button type="button" class="alvo-r" id="alvo-r" aria-label="Balão da resposta"><span class="alvo-ph">Solte aqui a resposta</span></button>'+
      '<div class="cartas-r" id="cartas-r" role="group" aria-label="Respostas">'+q.options.map((o,k)=>'<button type="button" class="carta-r" data-k="'+k+'">'+htmlSeguro(o,80)+'</button>').join('')+'</div></div>'+
      '<p class="contagem" id="contagem" aria-live="polite">Arraste a resposta até o balão, ou toque nela e depois no balão</p>';
  }
  if(q.verbo==='ordenar'){
    return '<div class="fila-ordem" id="fila-ordem" aria-label="Sua ordem"></div><div class="cartas" role="group" aria-label="Cartas">'+
      q.cartas.map((c,i)=>'<button type="button" class="carta" data-i="'+i+'" data-v="'+escapa(c)+'">'+escapa(c)+'</button>').join('')+'</div>'+
      '<button type="button" class="btn fantasma" id="ordem-apaga">tirar a última</button>';
  }
  return '';
}
/* ---------- comportamento ---------- */
const VER={cont:0,marcados:[],pego:null,cestas:[],ordem:[],soltouEm:0};
function contagemTexto(t){const c=$('#contagem');if(c)c.textContent=t;}
function ligarVerbos(q){
  VER.cont=0;VER.marcados=[];VER.pego=null;VER.cestas=[];VER.ordem=[];VER.soltouEm=0;VER.lig={};VER.ligSel=null;VER.traco=null;VER.escolheuEm=0;
  const palco=$('#palco');
  if(q.verbo==='tocar-objetos'){
    encaixaObjetos();requestAnimationFrame(encaixaObjetos);setTimeout(encaixaObjetos,350);
    palco.querySelectorAll('.obj').forEach(o=>o.addEventListener('pointerdown',()=>{
      if(LIC.conferido)return;
      const i=+o.dataset.i;
      if(o.classList.contains('marcado')){o.classList.remove('marcado');o.querySelector('.obj-n').textContent='';VER.marcados=VER.marcados.filter(x=>x!==i);}
      else{VER.marcados.push(i);o.classList.add('marcado');o.querySelector('.obj-n').textContent=VER.marcados.length;}
      /* renumera na ordem em que foram tocados: o número aparece no mesmo evento (menos de 100 ms) */
      VER.marcados.forEach((k,n)=>{const e=palco.querySelector('.obj[data-i="'+k+'"] .obj-n');if(e)e.textContent=n+1;});
      VER.cont=VER.marcados.length;
      contagemTexto(VER.cont?VER.cont+' contada'+(VER.cont>1?'s':''):'Toque em cada uma para contar');
      sfx('seleciona');
    },{passive:true}));
    palco.querySelectorAll('.alt').forEach(b=>b.addEventListener('click',()=>{
      if(LIC.conferido)return;
      palco.querySelectorAll('.alt').forEach(x=>x.classList.remove('sel'));
      b.classList.add('sel');LIC.resp=q.options[+b.dataset.v];$('#acao').disabled=false;
    }));
    return;
  }
  if(q.verbo==='arrastar'){
    VER.cestas=Array.from({length:q.cestas},()=>[]);
    const cestas=Array.from(palco.querySelectorAll('.cesta')),origem=$('#origem');
    const cestaPerto=(x,y)=>{   /* ímã de 24 px: a cesta cujo retângulo (crescido 24 px) contém o ponto */
      for(const c of cestas){const r=c.getBoundingClientRect();if(x>=r.left-24&&x<=r.right+24&&y>=r.top-24&&y<=r.bottom+24)return c;}
      return null;
    };
    const poe=(o,c)=>{
      const i=+o.dataset.i,ci=+c.dataset.c;
      VER.cestas.forEach(l=>{const k=l.indexOf(i);if(k>=0)l.splice(k,1);});
      VER.cestas[ci].push(i);
      o.classList.remove('solto','pego');o.classList.add('na-cesta');o.style.transform='';
      c.querySelector('.cesta-itens').appendChild(o);
      cestas.forEach((cc,k)=>{cc.querySelector('.cesta-n').textContent=VER.cestas[k].length;});
      VER.pego=null;palco.querySelectorAll('.obj').forEach(x=>x.classList.remove('pego'));
      sfx('encaixa');atualizaArrastar(q);
    };
    const tira=(o)=>{const i=+o.dataset.i;VER.cestas.forEach(l=>{const k=l.indexOf(i);if(k>=0)l.splice(k,1);});o.classList.remove('na-cesta');o.classList.add('solto');origem.appendChild(o);
      cestas.forEach((cc,k)=>{cc.querySelector('.cesta-n').textContent=VER.cestas[k].length;});atualizaArrastar(q);};
    palco.querySelectorAll('.obj').forEach(o=>{
      let x0=0,y0=0,dx=0,dy=0,arrastou=false;
      o.addEventListener('pointerdown',e=>{
        if(LIC.conferido)return;
        /* objeto que já está na cesta não recebe toque (pointer-events:none no CSS): quem decide é a cesta. Antes, tocar a cesta com 1 item
           acertava o item, que saía, e o clique seguia para a cesta, que punha o outro: a troca oscilava e travava. */
        if(o.classList.contains('na-cesta'))return;
        x0=e.clientX;y0=e.clientY;dx=dy=0;arrastou=false;
        try{o.setPointerCapture(e.pointerId);}catch(e2){}
        palco.querySelectorAll('.obj').forEach(x=>x.classList.remove('pego'));
        o.classList.add('pego');VER.pego=o;sfx('pega');
      });
      o.addEventListener('pointermove',e=>{
        if(VER.pego!==o||LIC.conferido)return;
        dx=e.clientX-x0;dy=e.clientY-y0;
        if(Math.abs(dx)+Math.abs(dy)>6)arrastou=true;
        if(arrastou){o.style.transform='translate('+dx+'px,'+dy+'px)';const c=cestaPerto(e.clientX,e.clientY);cestas.forEach(cc=>cc.classList.toggle('ima',cc===c));}
      });
      const solta=e=>{
        if(VER.pego!==o)return;
        cestas.forEach(cc=>cc.classList.remove('ima'));
        if(arrastou){VER.soltouEm=Date.now();const c=cestaPerto(e.clientX,e.clientY);if(c)poe(o,c);else{o.style.transform='';o.classList.remove('pego');VER.pego=null;sfx('solta');}}
        /* sem arrastar: fica "pego" esperando o toque na cesta (caminho sem arrastar) */
      };
      o.addEventListener('pointerup',solta);o.addEventListener('pointercancel',solta);
    });
    /* toque na cesta: com um objeto escolhido, ele entra; sem objeto escolhido, o último que entrou nesta cesta volta (o clique que vem logo
       depois de um arraste é ignorado, senão o objeto recém-solto voltaria) */
    cestas.forEach(c=>c.addEventListener('click',()=>{
      if(LIC.conferido||Date.now()-(VER.soltouEm||0)<120)return;
      if(VER.pego&&VER.pego.classList.contains('pego')){poe(VER.pego,c);return;}
      const l=VER.cestas[+c.dataset.c];
      if(l&&l.length){const o=palco.querySelector('.obj[data-i="'+l[l.length-1]+'"]');if(o){tira(o);sfx('solta');}}
    }));
    atualizaArrastar(q);
    return;
  }
  if(q.verbo==='tocar-letra'){
    palco.querySelectorAll('.letra-t').forEach(b=>b.addEventListener('click',()=>{
      if(LIC.conferido)return;
      palco.querySelectorAll('.letra-t').forEach(x=>x.classList.remove('sel'));
      b.classList.add('sel');LIC.resp=b.dataset.l;$('#acao').disabled=false;sfx('seleciona');
      contagemTexto('Você escolheu a letra '+b.dataset.l);
    }));
    return;
  }
  if(q.verbo==='ligar'){ligarLigar(q,palco);return;}
  if(q.verbo==='tracar'){ligarTracar(q,palco);return;}
  if(q.verbo==='arrastar-resposta'){ligarArrastarResposta(q,palco);return;}
  if(q.verbo==='ordenar'){
    const fila=$('#fila-ordem');
    const pinta=()=>{fila.innerHTML=VER.ordem.length?VER.ordem.map(i=>'<span class="carta posta">'+escapa(q.cartas[i])+'</span>').join(''):'<span class="ph">toque nas cartas na ordem</span>';
      palco.querySelectorAll('.carta[data-i]').forEach(c=>{c.classList.toggle('usada',VER.ordem.indexOf(+c.dataset.i)>=0);});
      LIC.resp=VER.ordem.map(i=>q.cartas[i]).join(' ');
      if(!LIC.conferido)$('#acao').disabled=VER.ordem.length!==q.cartas.length;};
    palco.querySelectorAll('.carta[data-i]').forEach(c=>c.addEventListener('click',()=>{
      if(LIC.conferido||c.classList.contains('usada'))return;VER.ordem.push(+c.dataset.i);sfx('seleciona');pinta();}));
    const ap=$('#ordem-apaga');if(ap)ap.addEventListener('click',()=>{if(LIC.conferido||!VER.ordem.length)return;VER.ordem.pop();pinta();});
    pinta();
    return;
  }
}
/* 20 objetos cabem: o objeto encolhe (de 48 até 36 px) até a cena, a contagem e as alternativas caberem acima do rodapé, sem rolar e sem
   área interna que rola. Se nem com 36 px couber (telefone muito baixo), a cena cresce e quem rola é a página: nada fica cortado nem atrás do rodapé. */
const OBJ_TAM={max:48,min:36,gap:4,pad:8};
function encaixaObjetos(){
  const cena=document.querySelector('#palco .cena-obj:not(.arrastar)'),pe=document.querySelector('#pe'),alts=document.querySelector('#palco .alts');
  if(!cena||!pe||!alts)return;
  const n=cena.querySelectorAll('.obj').length;if(!n)return;
  const lc=document.querySelector('.lc-corpo'),rolado=lc?lc.scrollTop:0;
  const cr=cena.getBoundingClientRect(),abaixo=alts.getBoundingClientRect().bottom-cr.bottom,topo=cr.top+rolado;
  const largura=cena.clientWidth-2*OBJ_TAM.pad,altura=pe.getBoundingClientRect().top-8-topo-abaixo-2*OBJ_TAM.pad-4;
  const cabe=s=>{const cols=Math.max(1,Math.floor((largura+OBJ_TAM.gap)/(s+OBJ_TAM.gap)));const lin=Math.ceil(n/cols);return lin*s+(lin-1)*OBJ_TAM.gap<=altura;};
  let s=OBJ_TAM.max;while(s>OBJ_TAM.min&&!cabe(s))s-=2;
  cena.style.setProperty('--obj',s+'px');
  cena.style.setProperty('--jit',s>=OBJ_TAM.max?'1':'0');
  cena.classList.toggle('apertada',s<OBJ_TAM.max);
}
if(typeof window!=='undefined'&&window.addEventListener)window.addEventListener('resize',()=>{if(document.querySelector('#palco .cena-obj'))encaixaObjetos();});
function atualizaArrastar(q){
  const total=VER.cestas.reduce((a,l)=>a+l.length,0),falta=q.objetos.n-total;
  const iguais=VER.cestas.every(l=>l.length===VER.cestas[0].length);
  if(falta>0)contagemTexto(falta+' ainda fora das cestas');
  else contagemTexto(iguais?'Todas nas cestas: '+VER.cestas[0].length+' em cada uma':'Todas nas cestas, mas as cestas estão diferentes');
  if(q.modo==='cada')LIC.resp=falta===0&&iguais?String(VER.cestas[0].length):'';
  else LIC.resp=falta===0?String(total):'';
  if(!LIC.conferido)$('#acao').disabled=!LIC.resp;
}
/* no conferir: marca o que acertou e o que errou DENTRO da cena, sem vermelho */
function verbosConferir(q,ok){
  const palco=$('#palco');
  if(q.verbo==='tocar-letra'){
    palco.querySelectorAll('.letra-t').forEach(b=>{b.disabled=true;if(b.dataset.l===String(q.answer))b.classList.add('certa');else if(b.classList.contains('sel'))b.classList.add('errada');});
  }
  if(q.verbo==='tocar-objetos'){
    palco.querySelectorAll('.alt').forEach(b=>{const v=q.options[+b.dataset.v];b.disabled=true;b.classList.remove('sel');if(v===q.answer)b.classList.add('certa');else if(v===LIC.resp)b.classList.add('errada');});
    palco.querySelectorAll('.obj').forEach(o=>{o.disabled=true;});
  }
  if(q.verbo==='arrastar'){palco.querySelectorAll('.obj,.cesta').forEach(o=>{o.disabled=true;});}
  if(q.verbo==='ordenar'){palco.querySelectorAll('.carta,#ordem-apaga').forEach(o=>{o.disabled=true;});const f=$('#fila-ordem');if(f)f.classList.add(ok?'certa':'errada');}
  if(q.verbo==='ligar'){
    palco.querySelectorAll('.lig').forEach(b=>{b.disabled=true;});
    q.pares.forEach((p,i)=>{const a=palco.querySelector('.lig-a[data-i="'+i+'"]');if(a)a.classList.add(VER.lig[i]===i?'certa':'errada');});
    desenhaLigacoes(q,true);
  }
  if(q.verbo==='tracar'||q.verbo==='arrastar-resposta'){
    palco.querySelectorAll('.tracar-fim,.carta-r,.alvo-r').forEach(b=>{b.disabled=true;});
    palco.querySelectorAll('.tracar-fim,.carta-r').forEach(b=>{const v=q.options[+b.dataset.k];if(v===q.answer)b.classList.add('certa');else if(v===LIC.resp)b.classList.add('errada');});
    const al=$('#alvo-r');if(al&&LIC.resp!=null)al.classList.add(ok?'certa':'errada');
  }
  if(ok)hitStop(()=>{const c=palco.querySelector('.letra-t.certa, .alt.certa, .fila-ordem.certa, .tracar-fim.certa, .alvo-r.certa, .ligar, .cena-obj');if(c)squash(c);});
  else{const e=palco.querySelector('.letra-t.errada, .alt.errada, .fila-ordem.errada, .tracar-fim.errada, .alvo-r.errada, .ligar, .cena-obj');if(e)balanca(e);}
}
/* ---------- 1B2: ligar, traçar e arrastar a resposta (toque de verdade e mouse, pelos eventos de ponteiro) ---------- */
/* resposta da criança no ligar: os pares na ordem da esquerda, no mesmo texto do gabarito */
function textoDoLigar(q,lig){return q.pares.map((p,i)=>p.e+' → '+(lig[i]!=null&&q.pares[lig[i]]?q.pares[lig[i]].r:'?')).join('; ');}
/* acerto dos verbos que não comparam texto de opção (ligar). undefined = o conferir de sempre decide */
function verbosAcertou(q){
  /* o texto montado dos traços só é igual ao gabarito quando os 3 pares estão certos; comparação exata (acertou() leria "2 + 3 → 5" como o número 2) */
  if(q&&q.verbo==='ligar')return String(LIC.resp)===String(q.answer);
  return undefined;
}
/* a pergunta que vai para o caderno, a revisão e a irmã: no ligar, a pergunta de origem do primeiro par */
function perguntaBase(q){return q&&q.verbo==='ligar'&&q.__base?q.__base:q;}
/* "Ainda não entendi" nos verbos com tela própria: tira caminhos ou cartas erradas, ou liga o primeiro par */
function verbosAjuda(q){
  const palco=$('#palco');
  if(q.verbo==='ligar'){
    const i=q.pares.findIndex((p,k)=>VER.lig[k]!==k);
    if(i<0)return 'Os traços estão certos. Toque em Verificar.';
    ligarPar(q,i,i);return 'Liguei uma para você. Agora ligue as outras.';
  }
  if(q.verbo==='tracar'||q.verbo==='arrastar-resposta'){
    const sel=q.verbo==='tracar'?'.tracar-fim':'.carta-r';
    let tirados=0;const max=Math.max(1,q.options.length-2);
    palco.querySelectorAll(sel).forEach(b=>{const k=+b.dataset.k;if(q.options[k]!==q.answer&&tirados<max&&!b.classList.contains('fora')){b.classList.add('fora');b.disabled=true;tirados++;
      const c=palco.querySelector('.caminho[data-k="'+k+'"]');if(c)c.classList.add('fora');}});
    return 'Tirei '+tirados+' resposta'+(tirados>1?'s':'')+' errada'+(tirados>1?'s':'')+'. Agora escolha entre as que sobraram.';
  }
  if(q.verbo==='tocar-letra'){
    let tirados=0;const ls=palco.querySelectorAll('.letra-t'),max=Math.max(1,Math.floor(ls.length/2));
    ls.forEach(b=>{if(b.dataset.l!==String(q.answer)&&tirados<max&&!b.disabled){b.disabled=true;b.classList.add('fora');tirados++;}});
    return 'Apaguei '+tirados+' letra'+(tirados>1?'s':'')+' que não '+(tirados>1?'são':'é')+'. Procure entre as que sobraram.';
  }
  return '';
}
/* ----- LIGAR ----- */
function centroDe(el,caixa,lado){const r=el.getBoundingClientRect();return {x:(lado==='dir'?r.left:r.right)-caixa.left,y:r.top+r.height/2-caixa.top};}
function desenhaLigacoes(q,conferido){
  const box=$('#ligar'),svg=$('#ligar-linhas');if(!box||!svg)return;
  const cx=box.getBoundingClientRect();
  svg.setAttribute('viewBox','0 0 '+Math.round(cx.width)+' '+Math.round(cx.height));
  let h='';
  Object.keys(VER.lig).forEach(i=>{
    const a=box.querySelector('.lig-a[data-i="'+i+'"]'),b=box.querySelector('.lig-b[data-j="'+VER.lig[i]+'"]');if(!a||!b)return;
    const p=centroDe(a,cx,'esq'),r=centroDe(b,cx,'dir');
    h+='<line class="linha'+(conferido?(VER.lig[i]===+i?' certa':' errada'):'')+'" x1="'+p.x+'" y1="'+p.y+'" x2="'+r.x+'" y2="'+r.y+'"/>';
  });
  /* no erro, o traço certo aparece pontilhado ao lado (a criança vê o caminho, sem vermelho) */
  if(conferido)q.pares.forEach((pp,i)=>{if(VER.lig[i]===i)return;const a=box.querySelector('.lig-a[data-i="'+i+'"]'),b=box.querySelector('.lig-b[data-j="'+i+'"]');if(!a||!b)return;
    const p=centroDe(a,cx,'esq'),r=centroDe(b,cx,'dir');h+='<line class="linha gabarito" x1="'+p.x+'" y1="'+p.y+'" x2="'+r.x+'" y2="'+r.y+'"/>';});
  if(VER.ligTemp)h+='<line class="linha temp" x1="'+VER.ligTemp.x1+'" y1="'+VER.ligTemp.y1+'" x2="'+VER.ligTemp.x2+'" y2="'+VER.ligTemp.y2+'"/>';
  svg.innerHTML=h;
  box.querySelectorAll('.lig-a').forEach(a=>a.classList.toggle('ligada',VER.lig[+a.dataset.i]!=null));
  const usados=Object.keys(VER.lig).map(k=>VER.lig[k]);
  box.querySelectorAll('.lig-b').forEach(b=>b.classList.toggle('ligada',usados.indexOf(+b.dataset.j)>=0));
}
function ligarPar(q,i,j){
  Object.keys(VER.lig).forEach(k=>{if(VER.lig[k]===j)delete VER.lig[k];});
  VER.lig[i]=j;VER.ligSel=null;
  $('#palco').querySelectorAll('.lig').forEach(x=>x.classList.remove('sel'));
  const n=Object.keys(VER.lig).length;
  LIC.resp=textoDoLigar(q,VER.lig);
  if(!LIC.conferido)$('#acao').disabled=n<q.pares.length;
  contagemTexto(n<q.pares.length?n+' de '+q.pares.length+' ligadas':'Tudo ligado. Confira e toque em Verificar.');
  sfx('encaixa');desenhaLigacoes(q,false);
}
function ligarLigar(q,palco){
  const box=$('#ligar');if(!box)return;
  const ladoDe=el=>el.classList.contains('lig-a')?'esq':'dir';
  const idDe=el=>el.classList.contains('lig-a')?+el.dataset.i:+el.dataset.j;
  const liga=(x,y)=>{const a=ladoDe(x)==='esq'?x:y,b=ladoDe(x)==='esq'?y:x;ligarPar(q,+a.dataset.i,+b.dataset.j);};
  let ini=null,x0=0,y0=0,moveu=false;
  box.querySelectorAll('.lig').forEach(el=>{
    el.addEventListener('pointerdown',e=>{
      if(LIC.conferido||el.disabled)return;
      /* segundo toque do caminho tocar-tocar: o outro lado já estava escolhido */
      if(VER.ligSel&&ladoDe(VER.ligSel)!==ladoDe(el)){liga(VER.ligSel,el);ini=null;VER.ligouEm=Date.now();return;}
      ini=el;x0=e.clientX;y0=e.clientY;moveu=false;
      try{el.releasePointerCapture(e.pointerId);}catch(e2){}
    });
  });
  box.addEventListener('pointermove',e=>{
    if(!ini||LIC.conferido)return;
    if(Math.abs(e.clientX-x0)+Math.abs(e.clientY-y0)>8)moveu=true;
    if(!moveu)return;
    const cx=box.getBoundingClientRect(),p=centroDe(ini,cx,ladoDe(ini)==='esq'?'esq':'dir');
    VER.ligTemp={x1:p.x,y1:p.y,x2:e.clientX-cx.left,y2:e.clientY-cx.top};
    desenhaLigacoes(q,false);
  });
  const fim=e=>{
    if(!ini)return;
    const de=ini;ini=null;VER.ligTemp=null;
    if(moveu){
      const t=document.elementFromPoint(e.clientX,e.clientY),alvo=t&&t.closest?t.closest('.lig'):null;
      if(alvo&&box.contains(alvo)&&ladoDe(alvo)!==ladoDe(de)&&!alvo.disabled){liga(de,alvo);VER.ligouEm=Date.now();}
      else{desenhaLigacoes(q,false);contagemTexto('Leve o traço até o outro lado');sfx('solta');}
      return;
    }
    /* toque simples: escolhe este lado (toque de novo no mesmo desmarca) */
    if(VER.ligSel===de){VER.ligSel=null;de.classList.remove('sel');return;}
    box.querySelectorAll('.lig').forEach(x=>x.classList.remove('sel'));
    VER.ligSel=de;de.classList.add('sel');sfx('seleciona');
    contagemTexto(ladoDe(de)==='esq'?'Agora toque na resposta':'Agora toque na pergunta');
  };
  box.addEventListener('pointerup',fim);box.addEventListener('pointercancel',()=>{ini=null;VER.ligTemp=null;desenhaLigacoes(q,false);});
  /* teclado e leitor de tela: Enter ou espaço num lado e depois no outro (o clique de teclado chega com detail 0) */
  box.querySelectorAll('.lig').forEach(el=>el.addEventListener('click',e=>{
    if(e.detail!==0||LIC.conferido)return;
    if(VER.ligSel&&ladoDe(VER.ligSel)!==ladoDe(el)){liga(VER.ligSel,el);return;}
    box.querySelectorAll('.lig').forEach(x=>x.classList.remove('sel'));VER.ligSel=el;el.classList.add('sel');
  }));
  desenhaLigacoes(q,false);
  if(typeof ResizeObserver==='function'){const ro=new ResizeObserver(()=>{if(document.body.contains(box))desenhaLigacoes(q,LIC.conferido);else ro.disconnect();});ro.observe(box);}
}
/* ----- TRAÇAR ----- */
const TRACO={W:300,H:200,amostras:28};
const ESTRELA_SVG='<svg viewBox="0 0 24 24"><path d="M12 2l2.9 6.3 6.9.7-5.2 4.6 1.5 6.8L12 17l-6.1 3.4 1.5-6.8L2.2 9l6.9-.7L12 2Z"/></svg>';
/* caminhos da estrela (topo, meio) até cada resposta (embaixo). Faixa de 7 a 8 anos (revisão de 08/11/2026: estava um labirinto): no máximo
   2 respostas e caminhos que NÃO se cruzam, cada um descendo para o seu lado. A partir de 9 anos os caminhos se cruzam no meio (a criança
   precisa seguir o traço). Em todas as faixas cada caminho tem a sua cor, repetida na borda da resposta. */
const tracarSimples=()=>typeof ehF78==='function'&&ehF78();
function caminhosTracar(n,simples){
  if(simples==null)simples=tracarSimples();
  const W=TRACO.W,H=TRACO.H,col=k=>(k+.5)*W/n,meio=k=>simples?col(k):col((k+1)%n);
  const bez=(a,b,c,d,t)=>{const u=1-t;return u*u*u*a+3*u*u*t*b+3*u*t*t*c+t*t*t*d;};
  const seg=(p0,p1,p2,p3)=>{const o=[];for(let i=0;i<=TRACO.amostras;i++){const t=i/TRACO.amostras;o.push([bez(p0[0],p1[0],p2[0],p3[0],t),bez(p0[1],p1[1],p2[1],p3[1],t)]);}return o;};
  const out=[];
  for(let k=0;k<n;k++){
    const m=meio(k),s0=[W/2,16],mid=[m,H*.5],fimP=[col(k),H-4];
    out.push(seg(s0,[W/2,H*.24],[m,H*.26],mid).concat(seg(mid,[m,H*.74],[col(k),H*.76],fimP).slice(1)));
  }
  return out;
}
const dDe=pts=>pts.map((p,i)=>(i?'L':'M')+p[0].toFixed(1)+' '+p[1].toFixed(1)).join(' ');
function escolheTracado(q,k){
  const palco=$('#palco');
  palco.querySelectorAll('.tracar-fim').forEach(b=>b.classList.toggle('sel',+b.dataset.k===k));
  palco.querySelectorAll('.caminho').forEach(c=>c.classList.toggle('feito',+c.dataset.k===k));
  LIC.resp=q.options[k];VER.escolheuEm=Date.now();
  if(!LIC.conferido)$('#acao').disabled=false;
  contagemTexto('Você chegou em '+txtVerbo(q.options[k])+'. Pode traçar de novo para mudar.');
  sfx('encaixa');
}
function ligarTracar(q,palco){
  const box=$('#tracar'),svg=box&&box.querySelector('.tracar-svg'),tinta=$('#tracar-tinta');if(!svg)return;
  const cs=caminhosTracar(q.options.length);
  let tr=null;
  const paraTela=(r,p)=>[r.left+p[0]/TRACO.W*r.width,r.top+p[1]/TRACO.H*r.height];
  const paraSvg=(r,x,y)=>[(x-r.left)/r.width*TRACO.W,(y-r.top)/r.height*TRACO.H];
  const dist=(a,b)=>Math.hypot(a[0]-b[0],a[1]-b[1]);
  const recomeca=msg=>{tr=null;if(tinta)tinta.setAttribute('d','');if(msg)contagemTexto(msg);};
  svg.addEventListener('pointerdown',e=>{
    if(LIC.conferido)return;
    const r=svg.getBoundingClientRect(),tol=Math.max(22,Math.min(36,r.width/q.options.length*.3));
    const telas=cs.map(pts=>pts.map(p=>paraTela(r,p)));
    if(dist([e.clientX,e.clientY],telas[0][0])>tol*1.6){contagemTexto('Comece na estrela, lá em cima');return;}
    try{svg.setPointerCapture(e.pointerId);}catch(e2){}
    tr={r:r,tol:tol,telas:telas,idx:cs.map(()=>0),vivo:cs.map((c,k)=>!box.querySelector('.tracar-fim[data-k="'+k+'"]').classList.contains('fora')),pts:[paraSvg(r,e.clientX,e.clientY)]};
    VER.traco=tr;sfx('pega');
  });
  svg.addEventListener('pointermove',e=>{
    if(!tr||LIC.conferido)return;
    const p=[e.clientX,e.clientY];
    tr.pts.push(paraSvg(tr.r,p[0],p[1]));
    if(tinta)tinta.setAttribute('d',dDe(tr.pts));
    tr.telas.forEach((pts,k)=>{
      if(!tr.vivo[k])return;
      const ate=Math.min(pts.length-1,tr.idx[k]+10);
      for(let j=ate;j>tr.idx[k];j--)if(dist(p,pts[j])<=tr.tol){tr.idx[k]=j;break;}
      let perto=Infinity;for(let j=Math.max(0,tr.idx[k]-3);j<=ate;j++)perto=Math.min(perto,dist(p,pts[j]));
      if(perto>tr.tol*1.8)tr.vivo[k]=false;
    });
    const k=tr.telas.findIndex((pts,k)=>tr.vivo[k]&&tr.idx[k]>=pts.length-2);
    if(k>=0){tr=null;escolheTracado(q,k);return;}
    if(!tr.vivo.some(Boolean))recomeca('Saiu do caminho. Volte na estrela e tente de novo.');
  });
  const solta=()=>{if(tr)recomeca('Siga o caminho até o fim, sem tirar o dedo.');};
  svg.addEventListener('pointerup',solta);svg.addEventListener('pointercancel',solta);
  /* a resposta não se escolhe com toque (o verbo é traçar); teclado e leitor de tela escolhem com Enter (clique de teclado tem detail 0) */
  box.querySelectorAll('.tracar-fim').forEach(b=>b.addEventListener('click',e=>{
    if(LIC.conferido||Date.now()-VER.escolheuEm<120)return;
    if(e.detail===0){escolheTracado(q,+b.dataset.k);return;}
    /* tocar na resposta não escolhe (o verbo é traçar), mas mostra o que fazer: o caminho dela fica forte e a estrela de partida chama */
    contagemTexto('Use o dedo: ponha na estrela e siga o caminho colorido até '+txtVerbo(q.options[+b.dataset.k]));
    palco.querySelectorAll('.caminho').forEach(c=>c.classList.toggle('destaca',c.dataset.k===b.dataset.k));
    palco.querySelectorAll('.tracar-fim').forEach(f=>f.classList.toggle('destaca',f===b));
    const est=palco.querySelector('.tracar-estrela');if(est){est.classList.remove('chama');void est.getBoundingClientRect();est.classList.add('chama');}
  }));
}
/* ----- ARRASTAR A RESPOSTA até o balão ----- */
function ligarArrastarResposta(q,palco){
  const alvo=$('#alvo-r'),monte=$('#cartas-r');if(!alvo||!monte)return;
  const perto=(x,y)=>{const r=alvo.getBoundingClientRect();return x>=r.left-24&&x<=r.right+24&&y>=r.top-24&&y<=r.bottom+24;};
  const poe=c=>{
    const ja=alvo.querySelector('.carta-r');if(ja&&ja!==c){ja.classList.remove('posta');monte.appendChild(ja);}
    c.classList.remove('pego');c.classList.add('posta');c.style.transform='';alvo.appendChild(c);
    alvo.classList.add('cheio');VER.pego=null;LIC.resp=q.options[+c.dataset.k];
    if(!LIC.conferido)$('#acao').disabled=false;
    contagemTexto('Você escolheu '+txtVerbo(q.options[+c.dataset.k])+'. Pode trocar arrastando outra.');sfx('encaixa');
  };
  const volta=()=>{const c=alvo.querySelector('.carta-r');if(!c)return;c.classList.remove('posta');monte.appendChild(c);alvo.classList.remove('cheio');LIC.resp=null;
    if(!LIC.conferido)$('#acao').disabled=true;contagemTexto('Arraste a resposta até o balão, ou toque nela e depois no balão');sfx('solta');};
  palco.querySelectorAll('.carta-r').forEach(c=>{
    let x0=0,y0=0,arrastou=false;
    c.addEventListener('pointerdown',e=>{
      if(LIC.conferido||c.disabled||c.classList.contains('posta'))return;
      x0=e.clientX;y0=e.clientY;arrastou=false;
      try{c.setPointerCapture(e.pointerId);}catch(e2){}
      palco.querySelectorAll('.carta-r').forEach(x=>x.classList.remove('pego'));c.classList.add('pego');VER.pego=c;sfx('pega');
    });
    c.addEventListener('pointermove',e=>{
      if(VER.pego!==c||LIC.conferido)return;
      const dx=e.clientX-x0,dy=e.clientY-y0;if(Math.abs(dx)+Math.abs(dy)>6)arrastou=true;
      if(arrastou){c.style.transform='translate('+dx+'px,'+dy+'px)';alvo.classList.toggle('ima',perto(e.clientX,e.clientY));}
    });
    const solta=e=>{
      if(VER.pego!==c)return;alvo.classList.remove('ima');
      if(arrastou){VER.soltouEm=Date.now();if(perto(e.clientX,e.clientY))poe(c);else{c.style.transform='';c.classList.remove('pego');VER.pego=null;sfx('solta');}}
    };
    c.addEventListener('pointerup',solta);c.addEventListener('pointercancel',solta);
    c.addEventListener('click',e=>{if(e.detail===0&&!LIC.conferido&&!c.classList.contains('posta'))poe(c);});
  });
  alvo.addEventListener('click',()=>{
    if(LIC.conferido||Date.now()-(VER.soltouEm||0)<120)return;
    if(VER.pego&&VER.pego.classList.contains('pego')){poe(VER.pego);return;}
    volta();
  });
}
/* ---------- juice: pressionado no mesmo quadro, hit-stop de 70 ms, squash e balanço ---------- */
const JUICE={reduz:()=>{try{return matchMedia('(prefers-reduced-motion: reduce)').matches;}catch(e){return false;}},parado:false,ultimoHitStop:0};
function hitStop(depois){
  const ms=JUICE.reduz()?0:70;
  JUICE.ultimoHitStop=ms;
  if(ms){document.documentElement.classList.add('hitstop');JUICE.parado=true;}
  setTimeout(()=>{document.documentElement.classList.remove('hitstop');JUICE.parado=false;if(depois)depois();},ms);
}
function squash(el){if(!el||JUICE.reduz())return;el.classList.remove('squash');void el.offsetWidth;el.classList.add('squash');}
function balanca(el){if(!el||JUICE.reduz())return;el.classList.remove('balanca');void el.offsetWidth;el.classList.add('balanca');}
if(typeof document!=='undefined'&&document.addEventListener){
  const ALVO='button,.alt,.obj,.letra-t,.carta,.cesta,.tecla,.chip,.parte,.tinta,.lig,.carta-r,.tracar-fim';
  document.addEventListener('pointerdown',e=>{
    const b=e.target&&e.target.closest?e.target.closest(ALVO):null;
    if(!b||b.disabled)return;
    b.classList.add('pressionado');     /* no mesmo evento: antes do próximo quadro */
    const solta=()=>{b.classList.remove('pressionado');};
    b.addEventListener('pointerup',solta,{once:true});b.addEventListener('pointercancel',solta,{once:true});b.addEventListener('pointerleave',solta,{once:true});
  },{passive:true});
}
