/* ALSKwela JHS_LS6_Digital v3.3 — network-first online updates; offline fallback. */
const CACHE='alskwela-ae2027-jhs-ls6-digital-studyreport-v3-3-20261117';
const PREFIX='alskwela-ae2027-jhs-ls6-digital-';
const VERSION='3.3';
const ROOT=new URL(self.registration.scope);
const ASSETS=['./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png','./verify-update-v3.html','./report-v3-check.json'];
async function cacheOne(cache,path){
  const u=new URL(path,ROOT);
  const request=new Request(u.href,{cache:'reload'});
  const response=await fetch(request);
  if(!response.ok)throw new Error('Failed to cache '+path+' HTTP '+response.status);
  await cache.put(u.href,response.clone());
  return response;
}
self.addEventListener('install',event=>event.waitUntil((async()=>{
  const cache=await caches.open(CACHE);
  for(const path of ASSETS)await cacheOne(cache,path);
  const main=await cache.match(new URL('./index.html',ROOT).href);
  await cache.put(ROOT.href,main.clone());
  await self.skipWaiting();
})()));
self.addEventListener('activate',event=>event.waitUntil((async()=>{
  const keys=await caches.keys();
  await Promise.all(keys.filter(key=>key.startsWith(PREFIX)&&key!==CACHE).map(key=>caches.delete(key)));
  await self.clients.claim();
})()));
self.addEventListener('message',event=>{
  if(event.data?.type==='SKIP_WAITING')self.skipWaiting();
  if(event.data?.type==='GET_VERSION')event.ports?.[0]?.postMessage({version:VERSION,cache:CACHE});
});
self.addEventListener('fetch',event=>{
  const request=event.request;if(request.method!=='GET')return;
  const url=new URL(request.url);
  if(url.origin!==ROOT.origin||!url.pathname.startsWith(ROOT.pathname))return;
  // Fresh HTML while online; same shell survives airplane mode.
  if(request.mode==='navigate'){
    event.respondWith((async()=>{
      const cache=await caches.open(CACHE);
      try{
        const fresh=await fetch(request,{cache:'no-store'});
        if(!fresh.ok)throw new Error('HTTP '+fresh.status);
        await cache.put(request,fresh.clone());
        if(url.pathname===ROOT.pathname||url.pathname===new URL('./index.html',ROOT).pathname){
          await cache.put(ROOT.href,fresh.clone());
          await cache.put(new URL('./index.html',ROOT).href,fresh.clone());
        }
        return fresh;
      }catch(error){
        return (await cache.match(request,{ignoreSearch:true}))||
               (await cache.match(ROOT.href))||
               (await cache.match(new URL('./index.html',ROOT).href))||
               new Response('Offline resources not yet installed',{status:503});
      }
    })());return;
  }
  // Network-first version diagnostics, otherwise cached static assets.
  if(url.pathname.endsWith('report-v3-check.json')){
    event.respondWith(fetch(request,{cache:'no-store'}).catch(()=>caches.match(request,{ignoreSearch:true})));return;
  }
  event.respondWith((async()=>{
    const hit=await caches.match(request,{ignoreSearch:true});if(hit)return hit;
    try{const fresh=await fetch(request);if(fresh.ok){const cache=await caches.open(CACHE);await cache.put(request,fresh.clone());}return fresh}
    catch(e){return Response.error();}
  })());
});
