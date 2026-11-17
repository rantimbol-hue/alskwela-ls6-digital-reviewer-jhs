/* ALSKwela bank-ready v4.0 — pre-cache foundation and expansion sets. */
const CACHE="alskwela-ae2027-jhs-ls6-digital-bank-v4-0-20261117-timing-v4-0-2";
const PREFIX="alskwela-ae2027-jhs-ls6-digital-";
const VERSION='4.0.2';
const ROOT=new URL(self.registration.scope);
const ASSETS=['./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png','./verify-update-v3.html','./report-v3-check.json','./bank/expansion-loader.js','./bank/manifest.json','./bank/foundation.json'];
async function cacheOne(cache,path){
 const url=new URL(path,ROOT);const response=await fetch(new Request(url.href,{cache:'reload'}));
 if(!response.ok)throw Error(path+': '+response.status);
 await cache.put(url.href,response.clone());return response;
}
self.addEventListener('install',event=>event.waitUntil((async()=>{
 const cache=await caches.open(CACHE);
 for(const path of ASSETS)await cacheOne(cache,path);
 const manifest=await (await cache.match(new URL('./bank/manifest.json',ROOT))).json();
 for(const set of manifest.sets||[]){
   if(!/^bank\/sets\/[A-Za-z0-9_-]+\.json$/.test(set.file))throw Error('Invalid bank set path');
   await cacheOne(cache,'./'+set.file);
 }
 const index=await cache.match(new URL('./index.html',ROOT).href);
 await cache.put(ROOT.href,index.clone());
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
 const u=new URL(request.url);
 if(u.origin!==ROOT.origin||!u.pathname.startsWith(ROOT.pathname))return;
 const bankFile=u.pathname.includes('/bank/');
 if(request.mode==='navigate'||bankFile||u.pathname.endsWith('/report-v3-check.json')){
   event.respondWith((async()=>{
      const cache=await caches.open(CACHE);
      try{
        const response=await fetch(request,{cache:'no-store'});
        if(!response.ok)throw Error('HTTP '+response.status);
        await cache.put(request,response.clone());
        if(request.mode==='navigate'&&(u.pathname===ROOT.pathname||u.pathname===new URL('./index.html',ROOT).pathname)){
            await cache.put(ROOT.href,response.clone());
            await cache.put(new URL('./index.html',ROOT).href,response.clone());
        }
        return response;
      }catch(error){
         return await cache.match(request,{ignoreSearch:true})||
          (request.mode==='navigate'?await cache.match(ROOT.href):null)||
          new Response('Resource unavailable offline',{status:503});
      }
   })());return;
 }
 event.respondWith((async()=>{
  const hit=await caches.match(request,{ignoreSearch:true});if(hit)return hit;
  try{const response=await fetch(request);if(response.ok){const cache=await caches.open(CACHE);await cache.put(request,response.clone());}return response;}
  catch(error){return Response.error();}
 })());
});