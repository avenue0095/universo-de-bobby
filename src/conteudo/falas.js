/* ---------- banco de falas dos personagens (docs/PLANO-DE-IDENTIDADE.md, seção 7) ----------
   Texto que passou no copy-check (scratchpad/identidade/falas.txt). Regras de toda fala: até 15 palavras, "você", sem travessão, sem tristeza,
   sem culpa, sem pedir nem sentir falta ("ainda não", nunca "você perdeu"). Quem fala: Bobby (colega), Teo (Matemática), Rufa (Português),
   Otto (Inglês), Capi (depois de dois erros seguidos), Fagulha (bilhete), Brisa (desafio), Embaralho (cometinha travesso).
   Duas pequenas trocas em relação ao lote original: "Isso conta em dobro" saiu (nada conta em dobro no jogo) e "a pergunta volta mais tarde"
   só aparece quando a mesma pergunta realmente volta (erroIgual); quando volta uma parecida, o painel já diz isso. */
const FALAS={
  /* pontos vivos do mapa (sessão 1C): uma por ponto, uma vez por dia; quem fala é o Bobby */
  vivo:{
    mat:['Esse cristal azul brilha mais quando alguém aprende.','Psiu! Daqui dá para ouvir as sementes crescendo.','Olha que capricho! Cada tábua foi medida duas vezes.',
      'O vento conta até dez e começa de novo.','Achei uma pedrinha redonda. Vou guardar na mochila.','Se a gente contar as folhas, perde a conta. Eu já tentei.'],
    pt:['Essa lanterna acende sozinha quando alguém lê em voz alta.','Shh! As letras estão dormindo nas prateleiras.','Aqui tem cheiro de livro novo. Adoro!',
      'Cada janela desta rua guarda uma história diferente.','Encontrei uma vírgula perdida. Vou devolver para a frase.','Se você bater palmas devagar, ouve as sílabas.'],
    en:['Hello, gaivota! Ela só fala inglês.','Daqui dá para ver o mar inteiro. Que bonito!','O barco chegou cheio de palavras novas.',
      'Esse telhado azul é o meu preferido da cidade.','Ouvi alguém dizer good morning lá do porto.','A brisa daqui tem gosto de aventura.']
  },
  chegada:{
    manha:['Bom dia, explorador! Hoje o céu está limpo e a mochila está cheia.'],
    tarde:['Boa tarde! Trouxe lanche, lupa e muita curiosidade. E você?'],
    noite:['Boa noite! Uma missão pequena e depois a gente descansa.'],
    volta:['Que bom ver você de novo! Vamos ver o que mudou no planeta?'],
    mapa:['Cadê meu mapa? Ah, está na mochila. Sempre está.'],
    planetas:['Escolha um planeta. Cada um tem um amigo esperando, com uma história para contar.'],
    curta:['Hoje a missão é curta. Eu vou junto.'],
    embaralho:['O Embaralho passou por aqui de novo. Vamos arrumar a bagunça!']
  },
  acerto:{
    geral:['Uau!','Boa! Mandou bem.','Certinho! Pode me chamar de ajudante de ouro.','Perfeito! Até a mochila ficou orgulhosa.','Oba!','Aí sim.'],
    teo:['Calculei, conferi e confirmei: você acertou.','Padrão encontrado! Eu adoro quando os números combinam.','Número bonito! Três e quatro, sete. Ótima conta.'],
    rufa:['Era uma vez uma resposta certa, e ela era sua.','Que final feliz! Merece até um ponto final.','Essa palavra ficou linda no papel. Quer ler de novo?'],
    otto:['Great! Great job! Isso mesmo.','Say it with me: hello, hello! Agora você.'],
    rara:['Duvido que você consiga. Ah, conseguiu!','Mais uma rodada? Eu não perco com graça, perco com estilo.']
  },
  sequencia3:['Três seguidas! A mochila está chacoalhando de alegria.'],
  sequencia5:['Cinco seguidas! Você está voando mais que a Brisa.'],
  primeira:['Acertou de primeira. Eu nem tinha terminado de torcer.'],
  recuperou:['Agora sim! Tentar de novo funciona.'],
  dificil:['Esse foi difícil e você resolveu. Caprichou!'],
  rapida:['Eita, você é rápido! Eu pisquei e a resposta já estava lá.'],
  erro:{
    bobby:['Errar faz parte da exploração. Todo mapa tem uma curva.','Essa era das difíceis mesmo. Vamos olhar juntos.','Quase todo explorador erra esse. Olha só a dica.'],
    teo:['Epa, essa conta travou. Vamos olhar o caminho juntos.','Ainda não. Olha o caminho: a resposta aparece com calma.'],
    rufa:['Errar faz parte da exploração. Todo mapa tem uma curva.','Essa era das difíceis mesmo. Vamos olhar juntos.'],
    otto:['Nice try! Vamos ouvir de novo, bem devagar.','Repita comigo, devagar. Quanto mais devagar, melhor o som.'],
    capi:['Respira fundo. A gente tenta de novo, sem pressa.','Uma resposta errada ajuda o cérebro a crescer. Pode ficar tranquilo.']
  },
  erroIgual:['Ainda não. A resposta certa é essa, e a pergunta volta mais tarde.'],
  dica:['Quer uma dica? Dica não gasta nada.','Pedir ajuda é coisa de explorador esperto.','Uma pergunta por vez. A gente chega lá.'],
  meio:['Pronto. Agora vamos conferir o que a gente aprendeu nessa trilha.','Ufa, que subida! Mas a vista lá de cima vale cada passo.'],
  ultima:['Falta pouco. Só mais uma, e depois a gente confere a mochila inteira.'],
  faseCompleta:['Fase completa! Minha mochila quer dançar.'],
  fasePerfeita:['Fase perfeita! Isso merece abraço de urso.'],
  etapaCompleta:['Etapa completa! Olha o lugar acendendo.'],
  estrela:['Uma estrela voltou para o céu. Falta pouco para a constelação.'],
  bauPronto:['Seu baú do dia está pronto. Quer abrir?'],
  bauAberto:['Que baú bonito! Tem uma coisa nova lá dentro.'],
  parada:['Por hoje chega. Você fez um ótimo trabalho, e amanhã tem mais.','Descansar também faz parte da aventura.','Hoje foi bastante.'],
  congelador:['Um congelador cuidou da sua sequência. Ela continua firme.'],
  descansando:['Sua sequência estava descansando. Hoje ela volta com tudo.'],
  bilhete:['Psiu! Tem um bilhete para você.','Entreguei! Era para você mesmo.'],
  chapeu:['Ei, esse chapéu combinou com você.'],
  toque:['Cócegas na orelha! Hahaha. Para, para, para.','Pode me chamar do que quiser. Eu respondo a qualquer apelido que venha com lanche.','Olha, um passarinho! Sumiu. Mas eu juro que ele estava ali.','Hmm. Interessante. Muito interessante. Nenhuma ideia, mas interessante.','Ops.'],
  embaralho:['Hihi, troquei tudo de lugar! Ops. Desculpa.','Você me achou! Eu não sei perder esconde-esconde.'],
  ocioso:['Sem pressa. Pensar também é jogar.']
};
/* sorteio sem repetir as últimas 3 falas (qualquer situação), com injeção de aleatório para o teste */
const FALAS_RECENTES=[];
function falaDe(sit,quem,rnd){
  rnd=rnd||Math.random;
  const g=String(sit).split('.').reduce((o,k)=>o&&o[k],FALAS);
  if(!g)return '';
  let pool=Array.isArray(g)?g.slice():[].concat((quem&&g[quem])||[],g.geral||g.bobby||[]);
  if(!pool.length)pool=[].concat.apply([],Object.keys(g).map(k=>g[k]));
  let livres=pool.filter(t=>FALAS_RECENTES.indexOf(t)<0);
  if(!livres.length)livres=pool.filter(t=>t!==FALAS_RECENTES[FALAS_RECENTES.length-1]);
  if(!livres.length)livres=pool;
  const t=livres[Math.floor(rnd()*livres.length)];
  FALAS_RECENTES.push(t);while(FALAS_RECENTES.length>3)FALAS_RECENTES.shift();
  return t;
}
/* todas as falas, em lista plana (testes e lista de texto novo para o áudio) */
function falasTodas(){
  const o=[];(function anda(x,cam){if(Array.isArray(x))x.forEach(t=>o.push({texto:t,situacao:cam}));else Object.keys(x).forEach(k=>anda(x[k],cam?cam+'.'+k:k));})(FALAS,'');
  return o;
}
