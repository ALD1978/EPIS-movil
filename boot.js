/* © Milsa Trillo Galicia · Prevención de Riesgos Laborales. EPIS · Revisiones (app instalable).
   La app publicada no lleva datos: personas, equipos y líneas de vida llegan en el archivo EPIS-datos-movil_vN.json
   que pasa Prevención y se guardan solo en este móvil (IndexedDB). */
(()=>{
const DB="epis-pwa";
function idb(mode,fn){return new Promise((ok,ko)=>{const r=indexedDB.open(DB,1);r.onupgradeneeded=()=>r.result.createObjectStore("d");
  r.onsuccess=()=>{const t=r.result.transaction("d",mode),q=fn(t.objectStore("d"));t.oncomplete=()=>ok(q&&q.result);t.onerror=()=>ko(t.error)};r.onerror=()=>ko(r.error)})}
const get=k=>idb("readonly",s=>s.get(k)),put=(k,v)=>idb("readwrite",s=>s.put(v,k));
if("serviceWorker" in navigator)navigator.serviceWorker.register("sw.js").catch(()=>{});
try{navigator.storage&&navigator.storage.persist&&navigator.storage.persist()}catch(e){}
async function leer(f){
  let p;try{p=JSON.parse(await f.text())}catch(e){throw new Error("Ese archivo no es un archivo de datos de EPIS.")}
  if(!p||p.tipo!=="epis-datos-movil"||!p.D)throw new Error("Ese archivo no es un archivo de datos de EPIS (EPIS-datos-movil_vN.json).");
  await put("pkg",p);
  if(p.ls)for(const k in p.ls){try{localStorage.setItem(k,p.ls[k])}catch(e){}}
  return p}
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
function pide(msg){
  document.getElementById("b").innerHTML=`<h1>EPIS · Revisiones</h1><p class="s">Milsa Trillo Galicia · Prevención</p>
  ${msg?`<p class="w">${esc(msg)}</p>`:""}
  <p>Para empezar, carga el <b>archivo de datos</b> que te ha pasado Prevención (<b>EPIS-datos-movil_vN.json</b>, por WhatsApp, correo o Teams). Guárdalo antes en el móvil.</p>
  <label class="btn">📂 Cargar archivo de datos<input type="file" hidden id="f"></label>
  <p class="n">Los datos se guardan solo en este móvil. Las revisiones que hagas se envían a Prevención con «📤 Enviar».</p>
  <footer>© Milsa Trillo Galicia · Prevención de Riesgos Laborales</footer>`;
  document.getElementById("f").onchange=async e=>{const f=e.target.files[0];if(!f)return;
    document.getElementById("b").innerHTML="<p>Cargando datos…</p>";
    try{await leer(f);arranca()}catch(x){pide(x.message)}}}
/* funciones que usa la app ya arrancada (botón «⟳ Datos») */
function api(I){
  const DB="epis-pwa";
  function idb(mode,fn){return new Promise((ok,ko)=>{const r=indexedDB.open(DB,1);r.onupgradeneeded=()=>r.result.createObjectStore("d");
    r.onsuccess=()=>{const t=r.result.transaction("d",mode),q=fn(t.objectStore("d"));t.oncomplete=()=>ok(q&&q.result);t.onerror=()=>ko(t.error)};r.onerror=()=>ko(r.error)})}
  window.EPIS_PWA={info:()=>I.ver+" · generado el "+I.fecha.split("-").reverse().join("/"),
    cargar(){const i=document.createElement("input");i.type="file";
      i.onchange=async()=>{const f=i.files[0];if(!f)return;let p;
        try{p=JSON.parse(await f.text())}catch(e){return alert("Ese archivo no es un archivo de datos de EPIS.")}
        if(!p||p.tipo!=="epis-datos-movil"||!p.D)return alert("Ese archivo no es un archivo de datos de EPIS (EPIS-datos-movil_vN.json).");
        if(!confirm("Cargar los datos "+p.ver+" del "+p.fecha.split("-").reverse().join("/")+"?\nTus revisiones hechas en este móvil se conservan."))return;
        await idb("readwrite",s=>s.put(p,"pkg"));
        if(p.ls)for(const k in p.ls){try{localStorage.setItem(k,p.ls[k])}catch(e){}}
        window.EPIS_RECARGA=true;location.reload()};
      i.click()}}}
async function arranca(){
  let p;try{p=await get("pkg")}catch(e){return pide("Este navegador no deja guardar datos (¿modo incógnito?).")}
  if(!p)return pide();
  let t;try{t=await (await fetch("app.txt")).text()}catch(e){return pide("Sin conexión la primera vez: abre la app con internet una vez.")}
  const need=[...new Set([...t.matchAll(/__EPD_(\w+)__/g)].map(m=>m[1]))].filter(k=>k!=="pl"&&!(k in p.D));
  if(need.length||!p.pl)return pide("El archivo de datos cargado ("+p.ver+") no vale para esta versión de la app. Pide a Prevención el archivo de datos nuevo.");
  const h=t.replace(/__EPD_(\w+)__/g,(m,k)=>k==="pl"?p.pl:JSON.stringify(p.D[k]).replace(/<\//g,"<\\/"))
    .replace("<head>",'<head><link rel="manifest" href="manifest.webmanifest"><meta name="theme-color" content="#123b33"><link rel="apple-touch-icon" href="icon-192.png"><meta name="apple-mobile-web-app-capable" content="yes"><script>('+api.toString()+')('+JSON.stringify({ver:p.ver,fecha:p.fecha})+')<\/script>');
  document.open();document.write(h);document.close()}
arranca();
})();
