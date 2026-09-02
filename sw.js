/* Deixa o app funcionar sem internet depois da primeira visita. */
const CACHE='bobby-v1';
const ARQUIVOS=['./','./index.html','./manifest.webmanifest','./icone-192.png','./icone-512.png'];
self.addEventListener('install',e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ARQUIVOS)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(ks=>Promise.all(
    ks.filter(k=>k!==CACHE).map(k=>caches.delete(k))
  )).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  e.respondWith(
    caches.match(e.request).then(r=>r||fetch(e.request).then(resp=>{
      /* guarda o que for do próprio site, para funcionar offline depois */
      if(resp&&resp.status===200&&resp.type==='basic'){
        const copia=resp.clone();
        caches.open(CACHE).then(c=>c.put(e.request,copia));
      }
      return resp;
    }).catch(()=>caches.match('./index.html')))
  );
});
