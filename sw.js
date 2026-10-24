/* Deixa o app funcionar sem internet, mas SEM travar numa versão velha.

   A regra é diferente para cada tipo de arquivo:
   - a página do app: primeiro tenta a internet (para pegar a versão nova),
     e só usa o cache se estiver sem sinal;
   - ícones e manifesto: primeiro o cache, porque quase nunca mudam.  */
const CACHE='bobby-v6';
/* Áudio gravado: cache próprio. O prefixo 'bobby-audio-' NUNCA é apagado na ativação (o app só guarda áudio aqui, por pacote:
   core, mat, pt, en). Troca de versão do app não faz a criança baixar 40 MB de novo. */
const CACHE_AUDIO='bobby-audio-v1';
/* Arte (WebP em assets/): cache próprio, também protegido na ativação ('bobby-arte-'). A camada 'inicial' do assets/manifesto.json
   entra na instalação; o resto entra sozinho, na primeira vez que a criança vê a imagem. */
const CACHE_ARTE='bobby-arte-v1';
const ARQUIVOS=['./','./index.html','./manifest.webmanifest','./assets/fontes/Fredoka-variavel-latin.woff2','./assets/fontes/Nunito-variavel-latin.woff2','./icone-192.png','./icone-512.png','./icone-maskable.png'];

/* nunca derruba a instalação: se a arte não chegar agora, ela entra sob demanda depois */
function preCarregarArte(){
  return fetch('./assets/manifesto.json').then(r=>r.json()).then(m=>{
    const lista=Object.keys(m.itens||{}).filter(k=>m.itens[k].inicial).map(k=>'./assets/'+m.itens[k].a);
    return caches.open(CACHE_ARTE).then(c=>Promise.all(lista.map(u=>c.add(u).catch(()=>null))));
  }).catch(()=>null);
}
self.addEventListener('install',e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ARQUIVOS)).then(()=>preCarregarArte()).then(()=>self.skipWaiting()));
});

self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(ks=>Promise.all(
    /* só apaga caches antigos DESTA app (bobby-v*); 'bobby-audio-*' (áudio gravado), 'bobby-arte-*' (arte) e caches de outros nunca são apagados */
    ks.filter(k=>k.startsWith('bobby-')&&!k.startsWith('bobby-audio-')&&!k.startsWith('bobby-arte-')&&k!==CACHE).map(k=>caches.delete(k))
  )).then(()=>self.clients.claim()));
});

/* só guarda o que é desta origem: uma resposta de outro domínio com caminho /audio/x.m4a nunca entra no cache */
const ORIGEM=(self.location&&self.location.origin)||'';
const MESMA=url=>!ORIGEM||url.origin===ORIGEM;
const INICIO=(()=>{try{return new URL('./',self.location.href).pathname;}catch(e){return '/';}})();
const ehAudio=url=>MESMA(url)&&/\/audio\/.+\.(m4a|opus)$/.test(url.pathname);
/* qualquer WebP de assets/ (personagens, expressoes, itens, looks, companheiros, planetas, cenarios, desenhos, recompensas e o que vier), menos as fontes */
const ehArte=url=>MESMA(url)&&/\/assets\/(?!fontes\/)[^/]+\/.+\.webp$/.test(url.pathname);
const ehManifestoAudio=url=>MESMA(url)&&/\/audio\/manifesto-min\.json$/.test(url.pathname);

const ehPagina=req=>req.mode==='navigate'||
  (req.destination==='document')||
  (req.headers.get('accept')||'').indexOf('text/html')>=0;

self.addEventListener('fetch',e=>{
  const req=e.request;
  if(req.method!=='GET')return;

  let url=null;try{url=new URL(req.url);}catch(e){}
  /* outra origem: o service worker não toca (vai direto à rede) */
  if(url&&!MESMA(url))return;
  /* clipe de áudio: cache primeiro (o nome muda quando o texto muda, então nunca fica velho) */
  if(url&&ehAudio(url)){
    e.respondWith(caches.open(CACHE_AUDIO).then(c=>c.match(req).then(r=>r||fetch(req).then(resp=>{
      if(resp&&resp.status===200)c.put(req,resp.clone());
      return resp;
    }))));
    return;
  }
  /* arte: cache primeiro, guarda na primeira vez (o arquivo só muda de nome quando muda a imagem) */
  if(url&&ehArte(url)){
    e.respondWith(caches.open(CACHE_ARTE).then(c=>c.match(req).then(r=>r||fetch(req).then(resp=>{
      if(resp&&resp.status===200)c.put(req,resp.clone());
      return resp;
    }))));
    return;
  }
  /* manifesto do áudio: internet primeiro (pega versão nova), cache quando está sem sinal */
  if(url&&ehManifestoAudio(url)){
    e.respondWith(caches.open(CACHE_AUDIO).then(c=>fetch(req).then(resp=>{
      if(resp&&resp.status===200)c.put(req,resp.clone());
      return resp;
    }).catch(()=>c.match(req))));
    return;
  }
  if(ehPagina(req)){
    /* internet primeiro: assim uma versão nova chega sozinha na próxima abertura */
    e.respondWith(
      fetch(req).then(resp=>{
        if(resp&&resp.status===200){
          const copia=resp.clone();
          /* só a página inicial do app substitui o index.html guardado (outra rota que devolva 200 não pode trocá-lo) */
          if(url&&MESMA(url)&&(url.pathname===INICIO||url.pathname===INICIO+'index.html'))caches.open(CACHE).then(c=>{c.put('./index.html',copia);});
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
