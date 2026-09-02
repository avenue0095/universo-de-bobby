/* Deixa o app funcionar sem internet, mas SEM travar numa versão velha.

   A regra é diferente para cada tipo de arquivo:
   - a página do app: primeiro tenta a internet (para pegar a versão nova),
     e só usa o cache se estiver sem sinal;
   - ícones e manifesto: primeiro o cache, porque quase nunca mudam.  */
const CACHE='bobby-v2';
const ARQUIVOS=['./','./index.html','./manifest.webmanifest','./icone-192.png','./icone-512.png'];

self.addEventListener('install',e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ARQUIVOS)).then(()=>self.skipWaiting()));
});

self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(ks=>Promise.all(
    ks.filter(k=>k!==CACHE).map(k=>caches.delete(k))
  )).then(()=>self.clients.claim()));
});

const ehPagina=req=>req.mode==='navigate'||
  (req.destination==='document')||
  (req.headers.get('accept')||'').indexOf('text/html')>=0;

self.addEventListener('fetch',e=>{
  const req=e.request;
  if(req.method!=='GET')return;

  if(ehPagina(req)){
    /* internet primeiro: assim uma versão nova chega sozinha na próxima abertura */
    e.respondWith(
      fetch(req).then(resp=>{
        if(resp&&resp.status===200){
          const copia=resp.clone();
          caches.open(CACHE).then(c=>{c.put('./index.html',copia);});
        }
        return resp;
      }).catch(()=>caches.match('./index.html').then(r=>r||caches.match('./')))
    );
    return;
  }

  /* o resto (ícones, manifesto): cache primeiro, é mais rápido */
  e.respondWith(
    caches.match(req).then(r=>r||fetch(req).then(resp=>{
      if(resp&&resp.status===200&&resp.type==='basic'){
        const copia=resp.clone();
        caches.open(CACHE).then(c=>c.put(req,copia));
      }
      return resp;
    }))
  );
});

/* permite que a página peça a troca imediata para a versão nova */
self.addEventListener('message',e=>{
  if(e.data==='atualizar-agora')self.skipWaiting();
});
