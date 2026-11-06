/* © Milsa Trillo Galicia · Prevención de Riesgos Laborales. Caché del programa (sin datos) para usarlo sin conexión */
const V="epis-mov-538e719bd682",PRE=["./", "index.html", "boot.js", "app.txt", "manifest.webmanifest", "icon-192.png", "icon-512.png", "icon-mask.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(PRE.map(u=>new Request(u,{cache:"reload"})))).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{if(e.request.method!=="GET")return;const u=new URL(e.request.url);if(u.origin!==location.origin)return;
  e.respondWith(caches.match(e.request,{ignoreSearch:true}).then(r=>r||fetch(e.request)))});
