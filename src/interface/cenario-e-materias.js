/* ---------- cenário do mapa ---------- */
const sv=(c)=>'<svg viewBox="0 0 60 60" class="cen">'+c+'</svg>';
const CEN={
 arvore:sv('<rect x="26" y="34" width="8" height="20" rx="3" fill="var(--tronco)"/><circle cx="30" cy="26" r="17" fill="var(--folha)"/><circle cx="19" cy="32" r="11" fill="var(--folha2)"/><circle cx="41" cy="32" r="11" fill="var(--folha2)"/>'),
 arbusto:sv('<circle cx="20" cy="42" r="12" fill="var(--folha2)"/><circle cx="34" cy="38" r="15" fill="var(--folha)"/><circle cx="44" cy="45" r="10" fill="var(--folha2)"/>'),
 flor:sv('<rect x="28" y="34" width="4" height="20" rx="2" fill="var(--folha)"/><circle cx="30" cy="26" r="7" fill="var(--flor1)"/><circle cx="20" cy="26" r="7" fill="var(--flor2)"/><circle cx="40" cy="26" r="7" fill="var(--flor2)"/><circle cx="30" cy="16" r="7" fill="var(--flor2)"/><circle cx="30" cy="26" r="5" fill="#FFD84D"/>'),
 pinheiro:sv('<rect x="27" y="42" width="6" height="12" rx="2" fill="var(--tronco)"/><path d="M30 6 44 28H16Z" fill="var(--folha)"/><path d="M30 20 47 44H13Z" fill="var(--folha2)"/>'),
 palmeira:sv('<path d="M28 54V26h5v28Z" fill="var(--tronco)"/><ellipse cx="16" cy="22" rx="14" ry="6" fill="var(--folha)" transform="rotate(-18 16 22)"/><ellipse cx="45" cy="22" rx="14" ry="6" fill="var(--folha)" transform="rotate(18 45 22)"/><ellipse cx="30" cy="14" rx="13" ry="6" fill="var(--folha2)"/>'),
 cacto:sv('<rect x="25" y="16" width="11" height="38" rx="5" fill="var(--folha)"/><rect x="11" y="26" width="9" height="18" rx="4" fill="var(--folha)"/><rect x="11" y="36" width="16" height="8" rx="4" fill="var(--folha)"/><rect x="41" y="20" width="9" height="16" rx="4" fill="var(--folha2)"/><rect x="33" y="28" width="16" height="8" rx="4" fill="var(--folha2)"/>'),
 cogumelo:sv('<rect x="24" y="32" width="12" height="22" rx="5" fill="#FFF0DA"/><path d="M6 34a24 18 0 0 1 48 0Z" fill="var(--flor1)"/><circle cx="20" cy="24" r="4.5" fill="#fff"/><circle cx="38" cy="21" r="5.5" fill="#fff"/>'),
 montanha:sv('<path d="M4 54 24 16l14 22 6-8 12 24Z" fill="var(--pedra)"/><path d="M24 16 33 30h-18Z" fill="#fff" opacity=".85"/>'),
 pedra:sv('<path d="M10 50c-4-10 6-20 16-20s22 8 20 20Z" fill="var(--pedra)"/><path d="M20 38c2-4 8-5 11-2" stroke="rgba(255,255,255,.5)" stroke-width="3" fill="none" stroke-linecap="round"/>'),
 predio:sv('<rect x="10" y="14" width="18" height="40" rx="3" fill="var(--pedra)"/><rect x="32" y="26" width="18" height="28" rx="3" fill="var(--folha2)"/><g fill="#FFD84D"><rect x="14" y="20" width="5" height="5"/><rect x="21" y="20" width="5" height="5"/><rect x="14" y="30" width="5" height="5"/><rect x="21" y="30" width="5" height="5"/><rect x="36" y="32" width="5" height="5"/><rect x="43" y="32" width="5" height="5"/></g>'),
 estrela:sv('<path d="m30 8 6 13 14 2-10 10 3 14-13-7-13 7 3-14-10-10 14-2Z" fill="#FFD84D"/>'),
 planeta:sv('<circle cx="30" cy="30" r="15" fill="var(--flor2)"/><ellipse cx="30" cy="32" rx="27" ry="7" fill="none" stroke="#FFD84D" stroke-width="4" transform="rotate(-18 30 32)"/>'),
 nuvem:sv('<g fill="var(--nuvem)"><circle cx="20" cy="34" r="12"/><circle cx="34" cy="30" r="16"/><circle cx="46" cy="36" r="11"/><rect x="18" y="34" width="30" height="13" rx="6"/></g>')
};
const CASTELO='<svg viewBox="0 0 100 100" class="cast-svg">'+
 '<rect x="14" y="40" width="72" height="48" rx="6" fill="var(--ub)"/>'+
 '<rect x="4" y="30" width="20" height="58" rx="5" fill="var(--ub)"/>'+
 '<rect x="76" y="30" width="20" height="58" rx="5" fill="var(--ub)"/>'+
 '<path d="M4 30h20l-4-10h-12Z" fill="rgba(0,0,0,.18)"/><path d="M76 30h20l-4-10h-12Z" fill="rgba(0,0,0,.18)"/>'+
 '<path d="M14 40h72l-6-12H20Z" fill="rgba(0,0,0,.18)"/>'+
 '<rect x="40" y="58" width="20" height="30" rx="10" fill="#4A2E12"/>'+
 '<circle cx="50" cy="47" r="6" fill="#FFD84D"/>'+
 '<rect x="48" y="4" width="4" height="20" fill="#7A5A3A"/><path d="M52 6h20l-6 6 6 6H52Z" fill="#FF4D5E"/></svg>';

/* ---------- matérias ---------- */
var UNITS=UNITS_MAT,TOTAL_LESSONS=TOTAL_MAT,MATERIA='mat';
const MATERIAS={
 mat:{n:'Matemática',sub:'Galáxia dos números: do contar às equações',cor:'#12A06E',
      units:()=>UNITS_MAT,total:()=>TOTAL_MAT,caps:()=>CAPITULOS,miss:()=>MISSOES,
      ic:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M4 3h7v7H4Zm9 0h7v7h-7ZM4 14h7v7H4Zm9 0h7v7h-7Z" opacity=".25"/><path d="M6.2 5.2h2.6v1.4H6.2Zm0 2.2h2.6v1.4H6.2Z"/><path d="M14.6 5.6h4v1.5h-4Zm1.2 9.6h1.6v1.6h1.6v1.6h-1.6v1.6h-1.6v-1.6h-1.6v-1.6h1.6Z"/><path d="M5.4 16.2h4.2v1.6H5.4Z"/></svg>'},
 pt:{n:'Português',sub:'Galáxia das palavras: das letras à leitura',cor:'#7B5BE0',
      units:()=>UNITS_PT,total:()=>TOTAL_PT,caps:()=>CAPITULOS_PT,miss:()=>MISSOES_PT,
      ic:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M4 4h7a3 3 0 0 1 3 3v13a3 3 0 0 0-3-2H4Zm16 0h-7a3 3 0 0 0-3 3v13a3 3 0 0 1 3-2h7Z"/></svg>'},
 en:{n:'Inglês',sub:'Galáxia do inglês: do zero à conversa do dia a dia',cor:'#1B93C8',
      units:()=>UNITS_EN,total:()=>TOTAL_EN,caps:()=>CAPITULOS_EN,miss:()=>MISSOES_EN,
      ic:'<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="9.5" opacity=".22"/><path d="M12 2.5a9.5 9.5 0 0 1 0 19 9.5 9.5 0 0 1 0-19Zm0 0c-3 3-3 16 0 19M2.8 9h18.4M2.8 15h18.4" fill="none" stroke="currentColor" stroke-width="1.9"/></svg>'}
};
function usarMateria(m){
  MATERIA=m;
  UNITS=MATERIAS[m].units();TOTAL_LESSONS=MATERIAS[m].total();
  CAP_ATUAL=MATERIAS[m].caps();MISS_ATUAL=MATERIAS[m].miss();
  S.materia=m;salvar();
  $('#nome-materia').textContent=MATERIAS[m].n;
  fecharMaterias();renderTrilha();
  if(typeof audioPrepararMateria==='function')audioPrepararMateria(m);
  if(typeof mostrarEntradaDoDia==='function')mostrarEntradaDoDia();
}
let CAP_ATUAL=null,MISS_ATUAL=null;
function telaMaterias(){
  let h='<div class="perfis-in"><h1>Escolha a sua galáxia</h1>'+
    '<p class="perfis-sub">Cada galáxia é uma matéria, cheia de mundos para desbravar. O progresso de cada uma é guardado separado.</p><div class="cartoes">';
  Object.keys(MATERIAS).forEach(k=>{
    const m=MATERIAS[k];
    const feitasM=Object.keys(S.feitas||{}).filter(x=>x.indexOf('rev')!==0&&(k==='pt'?x.charAt(0)==='p':(k==='en'?x.charAt(0)==='e':/^[0-9]/.test(x)))).length;
    h+='<button class="cartao-bt materia" data-m="'+k+'" style="--ub:'+m.cor+'">'+
       '<span class="mat-ic">'+m.ic+'</span><b>'+m.n+'</b><span class="pg">'+m.sub+'</span>'+
       '<span class="pg forte">'+feitasM+' de '+m.total()+' fases</span></button>';
  });
  h+='</div></div>';
  $('#materias').innerHTML=h;
  $('#materias').classList.add('on');document.body.style.overflow='hidden';
  $('#materias').querySelectorAll('[data-m]').forEach(b=>b.addEventListener('click',()=>usarMateria(b.dataset.m)));
}
function fecharMaterias(){$('#materias').classList.remove('on');document.body.style.overflow='';}

