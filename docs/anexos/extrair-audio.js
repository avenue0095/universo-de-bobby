/* Inventário de áudio (seção 9). Lê /index.html (commit c9b07e9, 6.484 linhas), NÃO altera nada.
   Uso:  node extrair-audio.js [caminho/index.html] > resumo.txt   (gera inventario-audio.tsv ao lado)
   Os blocos <script> de dados são avaliados numa VM sem DOM. Amostragem: 300 rodadas por gerador. */
const fs=require('fs'),vm=require('vm'),path=require('path'),crypto=require('crypto');
const arq=process.argv[2]||path.join(__dirname,'..','..','index.html');
const html=fs.readFileSync(arq,'utf8');
const scripts=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1]);
// blocos de dados = os que definem UNITS_*, AULAS, LEX, CAPITULOS...; o bloco do app (usa document) e o do SW ficam de fora
const dados=scripts.filter(s=>!/document\.querySelector|serviceWorker/.test(s)&&!/Desenhos para colorir/.test(s));
const ctx=vm.createContext({console,Math,Date,JSON,Array,Object,String,Number,Set,Map,RegExp,parseInt,parseFloat,isNaN,encodeURIComponent,decodeURIComponent});
dados.forEach((s,i)=>{try{vm.runInContext(s,ctx,{filename:'dados'+i});}catch(e){console.error('bloco',i,e.message);}});
const run=s=>vm.runInContext(s,ctx);
// emTexto e limpaEN copiadas do app (funções puras)
const m1=html.match(/function emTexto[\s\S]*?\n}\n/)[0], m2=html.match(/function limpaEN[\s\S]*?\n}\n/)[0];
run(m1+m2+';function temVoz(){return true;}');
const em=h=>run('emTexto')(h), le=h=>run('limpaEN')(h);
const subj=id=>id[0]==='p'?'pt':id[0]==='e'?'en':'mat';
const R=[];const add=(classe,idioma,materia,origem,texto,tipo)=>{texto=String(texto).replace(/\s+/g,' ').trim();if(texto)R.push({classe,idioma,materia,origem,texto,tipo:tipo||'exato'});};

// A. textos fixos (contagem exata)
const AULAS=run('AULAS');
for(const id of Object.keys(AULAS))AULAS[id].forEach((p,i)=>{
  add('aula-passo','pt-BR',subj(id),id+'.p'+(i+1),em(p.t+'. '+p.c));
  for(const m of String(p.fig||'').matchAll(/data-ler="([^"]*)"/g))add('en-alvo','en-US',subj(id),id+'.p'+(i+1)+'.cartao',decodeURIComponent(m[1]));
});
[['mat','CAPITULOS'],['pt','CAPITULOS_PT'],['en','CAPITULOS_EN']].forEach(([m,v])=>{const o=run(v);for(const n in o)add('capitulo-abre','pt-BR',m,'cap'+n,em(o[n].abre));});
[['mat','MISSOES'],['pt','MISSOES_PT'],['en','MISSOES_EN']].forEach(([m,v])=>{const o=run(v);for(const id in o){add('missao','pt-BR',m,id,em(o[id].t+'. '+o[id].abre));if(o[id].fim)add('missao-fim','pt-BR',m,id,em(o[id].fim));}});
const LEX=run('LEX'),VOC=run('VOC'),FR=run('FRASES'),COGN=run('COGN');
Object.entries(LEX).forEach(([id,a])=>a.forEach(w=>{add('en-alvo','en-US','en',id+'.lex',w[0]);if(w[3])add('en-alvo','en-US','en',id+'.frase',w[3]);if(w[4])add('pt-glosa','pt-BR','en',id+'.frasePt',w[4]);add('pt-glosa','pt-BR','en',id+'.pt',w[1]);}));
Object.entries(VOC).forEach(([m,a])=>a.forEach(x=>{add('en-alvo','en-US','en','VOC'+m,x[0]);add('pt-glosa','pt-BR','en','VOC'+m,x[1]);}));
FR.forEach(f=>{add('en-alvo','en-US','en','FRASES',f[0]);add('pt-glosa','pt-BR','en','FRASES',f[1]);});
COGN.forEach(f=>{add('en-alvo','en-US','en','COGN',f[0]);add('pt-glosa','pt-BR','en','COGN',f[1]);});
const PAL=run('PAL');PAL.forEach(w=>add('pt-palavra','pt-BR','pt','PAL',w.p));
const sil=new Set();PAL.forEach(w=>w.s.forEach(s=>sil.add(s)));sil.forEach(s=>add('pt-silaba','pt-BR','pt','PAL',s));
[...'abcdefghijklmnopqrstuvwxyz'].forEach(l=>add('pt-letra','pt-BR','pt','NOVO (nome da letra; não existe como string no código)',l,'novo'));
run('TEXTOS').forEach((t,i)=>add('pt-leitura','pt-BR','pt','TEXTOS#'+i,em(t.c),'novo-hoje-nao-falado'));

// B. enunciados paramétricos (amostragem; "quadros" = trechos fixos entre números/nomes/palavras)
const NOM=run('NOMES');
const mask=new Set();[LEX,VOC].forEach(o=>Object.values(o).forEach(a=>a.forEach(w=>w.forEach(x=>x&&mask.add(String(x))))));FR.forEach(f=>f.forEach(x=>mask.add(x)));COGN.forEach(f=>f.slice(0,2).forEach(x=>mask.add(x)));
const palavras=new Set(PAL.map(w=>w.p)),silabas=[...sil];
const quadrosDe=(p,mat)=>{let s=p;
  if(mat==='en')[...mask].filter(x=>x.length>1).sort((a,b)=>b.length-a.length).forEach(m=>{s=s.split(m).join('\u0001');});
  s=s.replace(/\d+(,\d+)?/g,'\u0001');NOM.forEach(n=>{s=s.replace(new RegExp('\\b'+n+'\\b','g'),'\u0001');});
  if(mat==='pt'){s=s.replace(/\b[A-ZÇ]{1,3}\b/g,'\u0001');[...palavras].forEach(w=>{s=s.replace(new RegExp('\\b'+w+'\\b','gi'),'\u0001');});silabas.forEach(w=>{s=s.replace(new RegExp('(?<![\\p{L}\u0001])'+w+'(?![\\p{L}\u0001])','giu'),'\u0001');});}
  return s.split('\u0001').map(x=>x.replace(/[?!.,:;()"“”‘’→–—\-=]+/g,' ').replace(/\s+/g,' ').trim().toLowerCase()).filter(x=>x.length>1);};
const Q={mat:new Set(),pt:new Set(),en:new Set()},NUMS=new Set(),INTEIROS=new Set();
for(const [m,U] of [['mat','UNITS_MAT'],['pt','UNITS_PT'],['en','UNITS_EN']])for(let r=0;r<300;r++)for(const u of run(U))for(const l of u.lessons)for(const mk of l.makers){
  let q;try{q=mk();}catch(e){continue;}if(!q)continue;const p=em(q.prompt);
  (p.match(/\d+(,\d+)?/g)||[]).forEach(n=>{NUMS.add(n);if(!n.includes(','))INTEIROS.add(+n);});
  quadrosDe(p,m).forEach(f=>Q[m].add(f));}
for(const m of ['mat','pt','en'])[...Q[m]].sort().forEach(f=>add('quadro-enunciado','pt-BR',m,'amostragem (limite superior)',f,'limite-superior'));

const dedupe=(rows)=>{const seen=new Set();return rows.filter(r=>{const k=r.classe+'|'+r.idioma+'|'+r.texto.toLowerCase();if(seen.has(k))return false;seen.add(k);return true;});};
const U=dedupe(R);
const hash=t=>{let h=0x811c9dc5;for(const b of Buffer.from(t,'utf8')){h^=b;h=Math.imul(h,0x01000193)>>>0;}return h.toString(16).padStart(8,'0');}; // FNV-1a 32 bits: síncrono no navegador também
const slug=t=>t.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,32);
const dir={ 'aula-passo':'aula','capitulo-abre':'historia','missao':'missao','missao-fim':'missao','en-alvo':'en','pt-glosa':'glosa','pt-palavra':'palavra','pt-silaba':'silaba','pt-letra':'letra','pt-leitura':'leitura','quadro-enunciado':'quadro'};
const out=['arquivo\tclasse\tidioma\tmateria\ttipo_contagem\tchars\torigem\ttexto'];
U.forEach(r=>out.push([ (r.idioma==='en-US'?'en-us':'pt-br')+'/'+dir[r.classe]+'/'+slug(r.texto)+'-'+hash(r.classe+r.texto)+'.m4a',r.classe,r.idioma,r.materia,r.tipo,r.texto.length,r.origem,r.texto].join('\t')));
const nomes=out.slice(1).map(l=>l.split('\t')[0]);const dup=nomes.length-new Set(nomes).size;
fs.writeFileSync(path.join(__dirname,'inventario-audio.tsv'),out.join('\n')+'\n');
// resumo
const por={};U.forEach(r=>{const k=r.classe+' ['+r.idioma+']'+(r.tipo!=='exato'?' ('+r.tipo+')':'');por[k]=por[k]||{n:0,ch:0};por[k].n++;por[k].ch+=r.texto.length;});
console.log('nomes de arquivo repetidos:',dup);
console.log('classe\tstrings únicas\tcaracteres');Object.entries(por).forEach(([k,v])=>console.log(k+'\t'+v.n+'\t'+v.ch));
const tot=(f)=>U.filter(f).reduce((a,r)=>({n:a.n+1,ch:a.ch+r.texto.length}),{n:0,ch:0});
console.log('TOTAL pt-BR exato',JSON.stringify(tot(r=>r.idioma==='pt-BR'&&r.tipo==='exato')));
console.log('TOTAL en-US exato',JSON.stringify(tot(r=>r.idioma==='en-US'&&r.tipo==='exato')));
console.log('TOTAL quadros (limite superior)',JSON.stringify(tot(r=>r.tipo==='limite-superior')));
console.log('TOTAL novos/nao-falados-hoje',JSON.stringify(tot(r=>r.tipo.startsWith('novo'))));
console.log('numeros distintos nos enunciados: inteiros',INTEIROS.size,'(max '+Math.max(...INTEIROS)+') | total com decimais',NUMS.size);
