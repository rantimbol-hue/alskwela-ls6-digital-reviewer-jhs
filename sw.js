/* ALSKwela JHS LS6 Digital Citizenship: offline-first, same-origin caching. */
const CACHE='alskwela-ae2027-jhs-ls6-digital-v1';
const PREFIX='alskwela-ae2027-jhs-ls6-digital-';
const ASSETS=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith(PREFIX)&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
 if(e.request.method!=='GET')return;
 const u=new URL(e.request.url);
 if(u.origin!==self.location.origin||!u.pathname.startsWith(new URL(self.registration.scope).pathname))return;
 e.respondWith(caches.match(e.request).then(cached=>cached||fetch(e.request).then(network=>{
  if(network.ok){const copy=network.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));}
  return network;
 }).catch(()=>caches.match('./index.html'))));
});
