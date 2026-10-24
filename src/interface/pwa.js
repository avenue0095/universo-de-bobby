/* Registra o modo offline e, quando existir uma versao mais nova no servidor,
   troca sozinho e recarrega uma vez so. */
if('serviceWorker' in navigator){
  window.addEventListener('load',function(){
    navigator.serviceWorker.register('./sw.js').then(function(reg){
      reg.update().catch(function(){});   /* sem internet o update falha: isso não é erro */
      setInterval(function(){reg.update();},60*60*1000);
      reg.addEventListener('updatefound',function(){
        var novo=reg.installing;
        if(!novo)return;
        novo.addEventListener('statechange',function(){
          if(novo.state==='installed'&&navigator.serviceWorker.controller){
            novo.postMessage('atualizar-agora');
          }
        });
      });
    }).catch(function(){});
    /* Na PRIMEIRA visita o service worker assume o controle e isso tambem
       dispara controllerchange — recarregar ali seria um piscar sem motivo.
       So recarregamos quando ja havia um controlador, ou seja, numa troca
       de versao de verdade. */
    var tinhaControlador=!!navigator.serviceWorker.controller;
    var recarregou=false;
    navigator.serviceWorker.addEventListener('controllerchange',function(){
      if(!tinhaControlador||recarregou)return;
      recarregou=true;location.reload();
    });
  });
}
