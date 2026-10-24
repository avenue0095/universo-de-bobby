/* ---------- matérias ---------- */
var UNITS=UNITS_MAT,TOTAL_LESSONS=TOTAL_MAT,MATERIA='mat';
const MATERIAS={
 mat:{n:'Matemática',sub:'Os números, do contar às equações',
      units:()=>UNITS_MAT,total:()=>TOTAL_MAT,caps:()=>CAPITULOS,miss:()=>MISSOES,
      ic:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M4 3h7v7H4Zm9 0h7v7h-7ZM4 14h7v7H4Zm9 0h7v7h-7Z" opacity=".25"/><path d="M6.2 5.2h2.6v1.4H6.2Zm0 2.2h2.6v1.4H6.2Z"/><path d="M14.6 5.6h4v1.5h-4Zm1.2 9.6h1.6v1.6h1.6v1.6h-1.6v1.6h-1.6v-1.6h-1.6v-1.6h1.6Z"/><path d="M5.4 16.2h4.2v1.6H5.4Z"/></svg>'},
 pt:{n:'Português',sub:'As palavras, das letras à leitura',
      units:()=>UNITS_PT,total:()=>TOTAL_PT,caps:()=>CAPITULOS_PT,miss:()=>MISSOES_PT,
      ic:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M4 4h7a3 3 0 0 1 3 3v13a3 3 0 0 0-3-2H4Zm16 0h-7a3 3 0 0 0-3 3v13a3 3 0 0 1 3-2h7Z"/></svg>'},
 en:{n:'Inglês',sub:'O inglês, do zero à conversa do dia a dia',
      units:()=>UNITS_EN,total:()=>TOTAL_EN,caps:()=>CAPITULOS_EN,miss:()=>MISSOES_EN,
      ic:'<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="9.5" opacity=".22"/><path d="M12 2.5a9.5 9.5 0 0 1 0 19 9.5 9.5 0 0 1 0-19Zm0 0c-3 3-3 16 0 19M2.8 9h18.4M2.8 15h18.4" fill="none" stroke="currentColor" stroke-width="1.9"/></svg>'}
};
function usarMateria(m){
  MATERIA=m;
  UNITS=MATERIAS[m].units();TOTAL_LESSONS=MATERIAS[m].total();
  CAP_ATUAL=MATERIAS[m].caps();MISS_ATUAL=MATERIAS[m].miss();
  S.materia=m;S.matEsc=true;salvar();
  $('#nome-materia').textContent=MATERIAS[m].n;
  fecharMaterias();renderTrilha();
  if(typeof audioPrepararMateria==='function')audioPrepararMateria(m);
  if(typeof mostrarEntradaDoDia==='function')mostrarEntradaDoDia();
}
/* código de matéria do app (mat, pt, en) para o código de cor do DESIGN.md (mat, por, ing) */
const MATCOD={mat:'mat',pt:'por',en:'ing'};
let CAP_ATUAL=null,MISS_ATUAL=null;
function telaMaterias(){
  let h='<div class="perfis-in"><h1>Escolha o seu planeta</h1>'+
    '<p class="perfis-sub">Cada planeta é uma matéria, cheia de etapas para explorar. O progresso de cada um é guardado separado.</p><div class="cartoes planetas">';
  Object.keys(MATERIAS).forEach(k=>{
    const m=MATERIAS[k],pl=PLANETAS[k];
    const feitasM=Object.keys(S.feitas||{}).filter(x=>x.indexOf('rev')!==0&&(k==='pt'?x.charAt(0)==='p':(k==='en'?x.charAt(0)==='e':/^[0-9]/.test(x)))).length;
    h+='<button class="cartao-bt materia'+(k===MATERIA?' atual':'')+'" data-m="'+k+'" data-materia="'+MATCOD[k]+'">'+
       '<span class="mat-planeta">'+imgArte(pl.img,{eager:true})+'</span>'+
       '<span class="mat-nome">Planeta '+pl.n+'</span><b>'+m.n+'</b><span class="pg">'+m.sub+'</span>'+
       '<span class="pg forte">'+feitasM+' de '+m.total()+' fases</span></button>';
  });
  h+='</div></div>';
  $('#materias').innerHTML=h;
  $('#materias').classList.add('on');document.body.style.overflow='hidden';
  $('#materias').querySelectorAll('[data-m]').forEach(b=>b.addEventListener('click',()=>usarMateria(b.dataset.m)));
}
function fecharMaterias(){$('#materias').classList.remove('on');document.body.style.overflow='';}

