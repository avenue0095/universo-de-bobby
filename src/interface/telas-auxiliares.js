/* ---------- quem vai jogar ---------- */
let apagando=-1;
function telaPerfis(){
  let h='<div class="perfis-in"><h1>Quem vai jogar?</h1>'+
    '<p class="perfis-sub">Cada jogador tem o próprio mapa, moedas e desenhos.</p><div class="cartoes">';
  STORE.perfis.forEach((p,i)=>{
    const d=estadoDe(p.dados);
    const n=Object.keys(d.feitas||{}).filter(k=>k.indexOf('rev')!==0).length;
    h+='<div class="cartao'+(apagando===i?' apagando':'')+'">'+
       '<button class="cartao-bt" data-i="'+i+'" style="--m1:'+p.cor+'">'+
       '<span class="rosto">'+MASC('feliz')+'</span><b>'+escapa(p.nome)+'</b>'+
       '<span class="pg">'+n+' de '+TOTAL_LESSONS+' fases</span></button>'+
       '<button class="lixo" data-del="'+i+'" aria-label="Apagar jogador">'+
       (apagando===i?'<span class="conf">apagar?</span>':IC.lixo)+'</button></div>';
  });
  h+='<button class="cartao-bt novo" id="novo-perfil"><span class="mais">+</span><b>Novo jogador</b>'+
     '<span class="pg">começar do zero</span></button>';
  h+='</div></div>';
  $('#perfis').innerHTML=h;
  $('#perfis').classList.add('on');
  document.body.style.overflow='hidden';
  $('#perfis').querySelectorAll('.cartao-bt[data-i]').forEach(b=>
    b.addEventListener('click',()=>usarPerfil(+b.dataset.i)));
  $('#perfis').querySelectorAll('[data-del]').forEach(b=>
    b.addEventListener('click',()=>{
      const i=+b.dataset.del;
      if(apagando===i){apagando=-1;comSenha(()=>apagarPerfil(i));}
      else{apagando=i;telaPerfis();}
    }));
  $('#novo-perfil').addEventListener('click',()=>pedirNome(true));
}
function fecharPerfis(){
  apagando=-1;$('#perfis').classList.remove('on');document.body.style.overflow='';
}

/* ---------- galeria de desenhos ---------- */
function abrirGaleria(destaque){
  const prontos=[];
  let h='<p class="galeria-intro">Cada fase concluída libera um desenho novo para colorir, em folha A4. '+
    'Toque em “baixar” para salvar e imprimir.</p>'+
    '<div class="gal-acoes"><button class="btn" id="baixar-todos">'+IC.baixar+' Baixar todos os desenhos</button></div>'+
    '<div id="aviso-baixa"></div><div class="galeria">';
  UNITS.forEach((u,ui)=>{
    u.lessons.forEach((l,li)=>{
      const ok=S.feitas[l.id];
      const d=ok?DESENHO(ui,li):null;
      h+='<figure class="quadro'+(ok?'':' trava')+'" style="--ub:'+corUnidade(u)+'">'+
         (ok?d.svg:'<div class="fechado">'+IC.cadeado+'</div>')+
         '<figcaption><b>'+(ok?d.mundo:'Mundo '+u.n+' · Fase '+(li+1))+'</b>'+l.title+
         (ok?'<i>'+d.tarefa+'</i><button class="baixar" data-ui="'+ui+'" data-li="'+li+'">'+IC.baixar+' baixar</button>'
            :'<i>Conclua a fase para liberar</i>')+'</figcaption></figure>';
    if(ok)prontos.push([ui,li]);
    });
  });
  h+='</div>';
  $('#gal-corpo').innerHTML='<div class="lc-in">'+h+'</div>';
  $('#galeria').classList.add('on');
  document.body.style.overflow='hidden';
  $('#gal-corpo').querySelectorAll('.baixar').forEach(b=>b.addEventListener('click',()=>
    baixarDesenhos([[+b.dataset.ui,+b.dataset.li]],b)));
  $('#baixar-todos').addEventListener('click',(e)=>{
    if(!prontos.length){avisoBaixa('Conclua pelo menos uma fase para liberar um desenho.');return;}
    baixarDesenhos(prontos,e.currentTarget);
  });
  if(destaque){const el=$('#gal-corpo').querySelectorAll('.quadro:not(.trava)');
    if(el.length)el[el.length-1].scrollIntoView({block:'center'});}
}
function fecharGaleria(){
  $('#galeria').classList.remove('on');
  if(!$('#licao').classList.contains('on'))document.body.style.overflow='';
}

/* ---------- letras e sílabas ---------- */
const LETRAS='ABCDEFGHIJKLMNOPQRSTUVWXYZÇ'.split('');
function letrasHTML(q){
  const set=q.teclado==='vogal'?['A','E','I','O','U']:LETRAS;
  return '<div class="teclado letras'+(set.length>6?'':' poucas')+'">'+
    set.map(k=>'<button class="tecla" data-k="'+k+'">'+k+'</button>').join('')+
    '<button class="tecla apaga" data-k="apagar" aria-label="Apagar">'+IC.apagar+'</button></div>';
}
function digitarLetra(k){
  if(LIC.conferido)return;
  if(k==='apagar')LIC.digitado=LIC.digitado.slice(0,-1);
  else if(LIC.digitado.length<14)LIC.digitado+=k;
  LIC.resp=LIC.digitado;pintarCampo();nota(700,0,.05,.05);
}
function silabasHTML(q){
  return '<div class="resp" id="sil-campo"></div>'+
   '<div class="chips">'+q.pecas.map((p,i)=>'<button class="chip" data-s="'+p+'" data-i="'+i+'">'+p+'</button>').join('')+
   '</div><button class="btn fantasma" id="sil-apaga">apagar a última</button>';
}
function atualizaSilabas(){
  const c=$('#sil-campo');if(!c)return;
  const w=(LIC.sil||[]).join('');
  c.innerHTML=w?w.toUpperCase():'<span class="ph">?</span>';
  LIC.resp=w;
  if(!LIC.conferido)$('#acao').disabled=!w;
}

/* ---------- fração, grupos e dinheiro na tela ---------- */
function fracaoHTML(q){
  let h='<div class="fbarra">';
  for(let i=0;i<q.partes;i++)h+='<button class="parte" data-i="'+i+'" aria-label="parte '+(i+1)+'"></button>';
  return h+'</div><div class="visor"><b id="fr-n">0</b><small id="fr-t">toque nas partes para pintar</small></div>';
}
function atualizaFracao(){
  const q=LIC.qs[LIC.i],n=(LIC.frac||[]).filter(Boolean).length;
  $('#palco').querySelectorAll('.parte').forEach((b,i)=>b.classList.toggle('on',!!(LIC.frac||[])[i]));
  const vn=$('#fr-n');if(vn)vn.innerHTML='<span class="frac"><b>'+n+'</b><i>'+q.partes+'</i></span>';
  const vt=$('#fr-t');if(vt)vt.textContent=n+' de '+q.partes+' partes pintadas';
  LIC.resp=String(n);
  if(!LIC.conferido)$('#acao').disabled=(n===0);
}
function grupinhosHTML(q){
  return '<div class="dourado-jogo">'+
   '<div class="col-md"><div class="pilha" id="g-caixas"></div><div class="bts">'+
   '<button class="md-bt gr-bt" data-k="g" data-op="-1">−</button><button class="md-bt mais gr-bt" data-k="g" data-op="1">+</button></div>'+
   '<span class="rot-md">grupos</span></div>'+
   '<div class="col-md"><div class="pilha" id="g-cada"></div><div class="bts">'+
   '<button class="md-bt gr-bt" data-k="p" data-op="-1">−</button><button class="md-bt mais gr-bt" data-k="p" data-op="1">+</button></div>'+
   '<span class="rot-md">em cada</span></div></div>'+
   '<div class="visor"><b id="gr-n">0</b><small id="gr-t">monte os grupos</small></div>';
}
function grMuda(k,dl){
  if(LIC.conferido)return;
  LIC.gr[k]=Math.max(0,Math.min(9,(LIC.gr[k]||0)+dl));
  nota(dl>0?720:420,0,.06,.05);atualizaGrupinhos();
}
function atualizaGrupinhos(){
  const g=LIC.gr.g||0,p=LIC.gr.p||0;
  let cx='';for(let i=0;i<g;i++){cx+='<span class="caixinha">';
    for(let k=0;k<p;k++)cx+='<i></i>';cx+='</span>';}
  const c1=$('#g-caixas');if(c1)c1.innerHTML=cx||'<span class="vazio">?</span>';
  const c2=$('#g-cada');if(c2){let o='';for(let k=0;k<p;k++)o+='<i class="bolinha"></i>';c2.innerHTML=o||'<span class="vazio">?</span>';}
  const tot=g*p;
  const vn=$('#gr-n');if(vn)vn.textContent=tot;
  const vt=$('#gr-t');if(vt)vt.textContent=g&&p?g+' grupos de '+p+' = '+tot:'monte os grupos';
  LIC.resp=String(tot);
  if(!LIC.conferido)$('#acao').disabled=(tot===0);
}
const CEDULAS=[['10','R$ 10'],['5','R$ 5'],['2','R$ 2'],['1','R$ 1'],['0.5','50¢'],['0.25','25¢']];
function dinheiroHTML(){
  return '<div class="cedulas">'+CEDULAS.map(c=>'<button class="ced'+(+c[0]<1?' moeda':'')+'" data-v="'+c[0]+'">'+c[1]+'</button>').join('')+'</div>'+
    '<div class="visor"><b id="din-n">R$ 0,00</b><small id="din-t">toque para juntar</small></div>'+
    '<button class="btn fantasma" id="limpa-din">limpar tudo</button>';
}
function atualizaDinheiro(){
  let tot=0,txt=[];
  CEDULAS.forEach(c=>{const n=LIC.din[c[0]]||0;if(n){tot+=n*parseFloat(c[0]);txt.push(n+'× '+c[1]);}});
  tot=Math.round(tot*100)/100;
  const vn=$('#din-n');if(vn)vn.textContent='R$ '+tot.toFixed(2).replace('.',',');
  const vt=$('#din-t');if(vt)vt.textContent=txt.join('  ')||'toque para juntar';
  LIC.resp=String(tot).replace('.',',');
  if(!LIC.conferido)$('#acao').disabled=(tot===0);
}

/* ---------- baixar desenhos ---------- */
function avisoBaixa(t){const a=$('#aviso-baixa');if(a)a.innerHTML=t?'<div class="aviso">'+t+'</div>':'';}
function svgCompleto(svg){return svg.replace('<svg ','<svg width="600" height="900" ');}
function svgParaPng(svg){
  return new Promise((res,rej)=>{
    const img=new Image();
    img.onload=()=>{
      const cv=document.createElement('canvas');cv.width=1000;cv.height=1500;
      const cx=cv.getContext('2d');cx.fillStyle='#fff';cx.fillRect(0,0,1000,1500);
      cx.drawImage(img,0,0,1000,1500);
      try{res(cv.toDataURL('image/png'));}catch(e){rej(e);}
    };
    img.onerror=rej;
    img.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svgCompleto(svg));
  });
}
async function baixarDesenhos(lista,bt){
  const txt=bt?bt.innerHTML:'';
  if(bt){bt.disabled=true;bt.innerHTML='preparando...';}
  avisoBaixa('');
  try{
    const gx=({mat:'matematica',pt:'portugues',en:'ingles'})[MATERIA]||'matematica';
    const nome=lista.length===1
      ?'desenho-'+gx+'-mundo'+UNITS[lista[0][0]].n+'-fase'+(lista[0][1]+1)+'.pdf'
      :'caderno-'+gx+'.pdf';
    const jsPDFok=window.jspdf&&window.jspdf.jsPDF;
    if(jsPDFok){
      const doc=new window.jspdf.jsPDF({unit:'mm',format:'a4'});
      for(let k=0;k<lista.length;k++){
        const d=DESENHO(lista[k][0],lista[k][1]);
        const png=await svgParaPng(d.svg);
        if(k)doc.addPage();
        doc.addImage(png,'PNG',10,6,190,285);
      }
      await entregar(nome,doc.output('blob'));
    }else{
      const d=DESENHO(lista[0][0],lista[0][1]);
      await entregar(nome.replace('.pdf','.svg'),svgCompleto(d.svg));
    }
  }catch(e){
    avisoBaixa('Não consegui preparar o arquivo agora. Tente de novo em instantes.');
  }
  if(bt){bt.disabled=false;bt.innerHTML=txt;}
}
async function entregar(nome,dados){
  let cap=null;
  try{cap=window.claude&&claude.use?await claude.use('downloads'):null;}catch(e){cap=null;}
  if(cap){
    try{await cap.save({filename:nome,data:dados});avisoBaixa('');return;}
    catch(err){
      const c=err&&err.code;
      if(c==='declined')return;
      if(c==='rate_limited'){avisoBaixa('Já tem um download aguardando resposta. Confirme e tente de novo.');return;}
      avisoBaixa('Este aparelho não deixou salvar o arquivo. O caderno completo também vem em PDF na conversa.');
      return;
    }
  }
  const tipo=/\.json$/i.test(nome)?'application/json':(/\.ics$/i.test(nome)?'text/calendar':'image/svg+xml');
  const url=URL.createObjectURL(typeof dados==='string'?new Blob([dados],{type:tipo}):dados);
  const a=document.createElement('a');a.href=url;a.download=nome;document.body.appendChild(a);a.click();
  setTimeout(()=>{a.remove();URL.revokeObjectURL(url);},2000);
}

