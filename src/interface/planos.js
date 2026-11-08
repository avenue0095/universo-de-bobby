/* ---------- estrutura para venda (preparação da Fase 4; NÃO tem login nem cobrança de verdade) ----------
   Configuração ÚNICA dos planos, do limite de jogadores e do muro. Todo texto de preço sai daqui (reais(PLANOS.x.centavos)); nenhum número de
   preço escrito à mão em outro lugar (testes/planos.js confere).
   Decisão do Filipe: R$ 47 por mês e R$ 297 por ano, SEM teste grátis (no modo 'pago' tudo fica trancado até o responsável entrar com conta ativa).
   Modos do muro:
     'aberto'  hoje: tudo liberado, uso local, nada muda para a criança;
     'pago'    a fase só abre com assinatura ativa em estado.conta (que virá do servidor na Fase 4; hoje é sempre vazio). */
const PLANOS={
  mensal:{centavos:4700,rotulo:'Mensal',ciclo:'mensal'},
  anual:{centavos:29700,rotulo:'Anual',ciclo:'anual'}
};
const MAX_PERFIS=4;
const MURO={modo:'aberto'};
const MODOS_DO_MURO=['aberto','pago'];
const CICLO_TXT={mensal:['por mês',1],anual:['por ano',12]};
/* centavos inteiros em reais no padrão brasileiro: 4700 vira "R$ 47,00", 123456 vira "R$ 1.234,56" */
function reais(centavos){
  const c=Math.max(0,Math.round(+centavos||0)),int=String(Math.floor(c/100)).replace(/\B(?=(\d{3})+(?!\d))/g,'.');
  return 'R$ '+int+','+String(c%100).padStart(2,'0');
}
function precoDoPlano(id){const p=PLANOS[id];return p?reais(p.centavos)+' '+CICLO_TXT[p.ciclo][0]:'';}
/* plano anual dividido pelos meses do ciclo, só para comparação (arredonda para baixo, nunca promete menos do que cobra) */
function precoPorMes(id){const p=PLANOS[id];return p?reais(Math.floor(p.centavos/CICLO_TXT[p.ciclo][1])):'';}
/* assinatura ativa: estado.conta = {assinatura:{status:'ativa', plano:'mensal'|'anual', ate:'AAAA-MM-DD'}} (formato que a Fase 4 vai preencher) */
function assinaturaAtiva(conta,dia){
  if(!conta||typeof conta!=='object')return false;
  const a=conta.assinatura;
  if(!a||typeof a!=='object'||a.status!=='ativa'||!PLANOS[a.plano])return false;
  if(a.ate!==undefined&&!(/^\d{4}-\d{2}-\d{2}$/.test(String(a.ate))&&String(a.ate)>=dia))return false;
  return true;
}
function acessoLiberado(estado){
  if(MURO.modo==='aberto')return true;
  if(MURO.modo==='pago'){
    return assinaturaAtiva(estado&&estado.conta,hoje());     /* dia local (nucleo.js), nunca o dia em UTC */
  }
  return false;     /* modo desconhecido fecha (falha segura) */
}
/* O ÚNICO ponto de checagem antes de abrir uma fase, revisão do mundo ou revisão do dia (abrirLicao, abrirRevisaoMundo, abrirRevisaoDia).
   Sem acesso: a fase não abre e aparece a tela Assinatura, atrás da senha do responsável. */
function portaoDeAcesso(){
  if(acessoLiberado(typeof S==='object'?S:null))return true;
  if(typeof registrarEvento==='function')registrarEvento('muro',{modo:MURO.modo});
  abrirAssinaturaComSenha();
  return false;
}
/* limite de jogadores: só vale no modo pago (no aberto nada muda) */
function podeCriarPerfil(){return MURO.modo!=='pago'||((typeof STORE==='object'&&STORE.perfis)||[]).length<MAX_PERFIS;}
const MODO_TXT={aberto:['Aberto','Tudo liberado neste aparelho, sem conta e sem cobrança.'],
  pago:['Assinatura','As fases abrem com a assinatura ativa do responsável.']};
function planosHTML(){
  return '<div class="planos">'+Object.keys(PLANOS).map(id=>{const p=PLANOS[id];
    return '<div class="plano-cartao" data-plano="'+id+'"><b>'+escapa(p.rotulo)+'</b><span class="plano-preco">'+reais(p.centavos)+'</span>'+
      '<span class="plano-ciclo">'+CICLO_TXT[p.ciclo][0]+(CICLO_TXT[p.ciclo][1]>1?' (equivale a '+precoPorMes(id)+' por mês)':'')+'</span></div>';}).join('')+'</div>';
}
/* seção "Plano" da área do responsável */
function planoHTML(){
  const m=MODO_TXT[MURO.modo]||[MURO.modo,''];
  return '<h2 class="sec">Plano</h2><p class="galeria-intro">Modo atual: <b id="plano-modo">'+escapa(m[0])+'</b>. '+escapa(m[1])+'</p>'+planosHTML()+
    '<p class="galeria-intro">Uma assinatura vale para até '+MAX_PERFIS+' jogadores.</p>'+
    '<div class="perfil-bts"><button class="btn fantasma" id="ver-assinatura">Ver a assinatura</button></div>';
}
function telaAssinatura(){
  let h='<div class="perfil-in"><p class="galeria-intro">Para jogar todas as fases, o responsável entra com a conta e escolhe um plano. '+
    'Uma assinatura vale para até '+MAX_PERFIS+' jogadores neste aparelho.</p>'+planosHTML()+
    '<div class="perfil-bts assinatura-bts"><button class="btn" id="ass-entrar" disabled aria-describedby="ass-breve">Entrar</button>'+
    '<button class="btn laranja" id="ass-assinar" disabled aria-describedby="ass-breve">Assinar</button></div>'+
    '<p class="aviso-breve" id="ass-breve">Disponível em breve</p>'+
    '<div class="perfil-bts"><button class="btn fantasma" id="ass-volta">Voltar ao mapa</button></div></div>';
  $('#perfil').innerHTML='<div class="rev-topo"><button class="icobtn" id="ass-volta2" aria-label="Voltar">'+IC.volta+'</button><h2>Assinatura</h2></div><div class="rev-corpo">'+h+'</div>';
  $('#perfil').dataset.tela='assinatura';
  $('#perfil').classList.add('on');document.body.style.overflow='hidden';
  const volta=()=>{if(typeof fecharPerfil2==='function')fecharPerfil2();else $('#perfil').classList.remove('on');};
  $('#ass-volta').addEventListener('click',volta);$('#ass-volta2').addEventListener('click',volta);
}
/* a criança chega aqui tocando numa fase: a tela é do responsável, então passa pela senha da área (se houver senha) */
function abrirAssinaturaComSenha(){
  if(typeof respLiberado==='function'&&!respLiberado()){
    pedirSenha('Assinatura','Esta parte é para um adulto. Digite a senha da área do responsável para ver os planos.',telaAssinatura,false);
    return;
  }
  telaAssinatura();
}
