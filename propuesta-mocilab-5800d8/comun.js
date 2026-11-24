/* Común a todas las páginas: cabecera, pie, carrito, favoritos, vista rápida y toast. Requiere data.js antes. */
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const eurF=new Intl.NumberFormat('es-ES',{style:'currency',currency:'EUR'}), eur=n=>eurF.format(n);
const FREE=40, F='https://mocilab.com/cdn/shop/files/', esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const CLUBS=[['all','Todos',''],['rm','Real Madrid','c3112c09a47ace3af7b8912fe8a884710abbb094.png'],['fcb','FC Barcelona','8d653c29cea20269ca7232c4cf56618ea511f9b2.png'],['atm','Atlético de Madrid','ATM_Color_8b00a209-2cda-48c0-a459-53ee521f1650.png'],['vcf','Valencia CF','Escudo.png'],['slb','SL Benfica','4s-team-benfica.png'],['scp','Sporting CP','images.png'],['fcp','FC Porto','LOGO_FCPorto.pdf.svg'],['laliga','LaLiga','RGB_Simbolo_LL_coral.png'],['fpf','Portugal','FPF_cOLOR.png'],['gaudi','Gaudí',''],['prin','El Principito','']];
const clubName=Object.fromEntries(CLUBS.map(c=>[c[0],c[1]]));
const recent=PRODUCTS.map(p=>p.new).sort().reverse()[11];
const byV=Object.fromEntries(PRODUCTS.map(p=>[p.v,p])), byH=Object.fromEntries(PRODUCTS.map(p=>[p.h,p]));
const store=(k,d)=>{try{return JSON.parse(localStorage[k])??d}catch{return d}};
// shortcut: carrito y favoritos solo en este navegador; en el tema real de Shopify irían a /cart/add.js y a la cuenta del cliente
let cart=store('mocicart',{}), favs=new Set(store('mocifav',[]));
const isIndex=document.body.dataset.page==='index', H=isIndex?'':'index.html';
const prodURL=h=>`producto.html?h=${encodeURIComponent(h)}`;
const heart='<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 21s-7.5-4.6-9.5-9.3C1 7.9 3.4 4.5 7 4.5c2 0 3.4 1.1 5 3 1.6-1.9 3-3 5-3 3.6 0 6 3.4 4.5 7.2C19.5 16.4 12 21 12 21z"/></svg>';

/* --- cabecera, pie y capas --- */
const tapeTxt='Envío gratis desde <b>40 €</b> · Licencia oficial · 4,5 ★ en 477 reseñas · Diseñado en España · Ideas de regalo para Navidad · ';
document.body.insertAdjacentHTML('afterbegin',`<a class="skip" href="${isIndex?'#tienda':'#main'}">Saltar al contenido</a>
<div class="hdr-bg" aria-hidden="true"></div>
${isIndex?`<div class="tape" aria-hidden="true"><div><span>${tapeTxt.repeat(3)}</span><span>${tapeTxt.repeat(3)}</span></div></div>`:''}
<header id="hdr" class="glass">
  <nav aria-label="Principal"><a class="xmas" href="${H}?cat=regalo#tienda" data-cat="regalo">Regalos de Navidad</a><a href="${H}#tienda">Tienda</a><a href="${H}#categorias">Categorías</a><a href="info.html?p=nosotros">Nosotros</a></nav>
  <a class="logo" href="${isIndex?'#':'index.html'}" translate="no" aria-label="Mocilab, inicio">MOCILAB.</a>
  <div class="tools">
    <input id="q" class="srch" type="search" name="q" autocomplete="off" placeholder="Busca club, moneda…" aria-label="Buscar productos">
    <button class="ib" id="sbtn" aria-label="Buscar" aria-controls="q"><svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg></button>
    <button class="ib" id="favBtn" aria-label="Ver favoritos"><svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 21s-7.5-4.6-9.5-9.3C1 7.9 3.4 4.5 7 4.5c2 0 3.4 1.1 5 3 1.6-1.9 3-3 5-3 3.6 0 6 3.4 4.5 7.2C19.5 16.4 12 21 12 21z"/></svg><span class="badge num" id="favN"></span></button>
    <button class="ib" id="openCart" aria-label="Abrir carrito">Carrito <span class="badge num" id="count"></span></button>
  </div>
</header>`);
document.body.insertAdjacentHTML('beforeend',`<footer>
  <div class="cs">
    <div><h4>Únete al club</h4><p>Lanzamientos y ediciones limitadas antes que nadie.</p>
      <form class="nl" id="nl"><input type="email" name="email" autocomplete="email" spellcheck="false" required placeholder="tu@email.com" aria-label="Tu email"><button>Unirme</button></form></div>
    <div><h4>Ayuda</h4><a href="info.html?p=nosotros">Quiénes somos</a><a href="info.html?p=contacto">Contacto</a><a href="info.html?p=envios">Envíos y devoluciones</a><a href="info.html?p=faq">Preguntas frecuentes</a></div>
    <div><h4>Trabaja con nosotros</h4><a href="info.html?p=contacto">Partners</a><a href="info.html?p=contacto">Soy una marca</a><a href="info.html?p=contacto">Soy tienda</a></div>
    <div><h4>Síguenos</h4><a href="https://www.instagram.com/mocilab" rel="noopener">Instagram</a><a href="https://www.tiktok.com/@mocilab" rel="noopener">TikTok</a></div>
  </div>
  <div class="fl" translate="no" aria-hidden="true">MOCILAB.</div>
  <div class="lg">© 2026 MOCILAB · Propuesta de rediseño</div>
</footer>
<div class="scrim" id="scrim"></div>
<aside class="drawer" id="drawer" aria-label="Carrito" aria-hidden="true">
  <div class="dh"><b class="lbl">Tu carrito</b><button class="x" id="closeCart" aria-label="Cerrar carrito">×</button></div>
  <div class="ship" id="ship"></div>
  <div class="items" id="items"></div>
  <div class="df"><div class="t"><span>Total</span><span class="num" id="tot"></span></div><small>Impuestos incluidos. Envío calculado al pagar.</small><a class="btn w" id="checkout" href="#">Finalizar compra</a></div>
</aside>
<div class="qv" id="qv" role="dialog" aria-modal="true" aria-labelledby="qvT" aria-hidden="true"></div>
<div class="toast glass-l" id="toast" role="status" aria-live="polite"></div>`);

/* --- tarjeta de producto (tienda y relacionados) --- */
function card(p){
  const t=esc(p.t), u=prodURL(p.h);
  return `<article class="card"><div class="ph">
    <a href="${u}" aria-label="${t}"><img class="p" src="${p.img}" alt="" width="900" height="1125" loading="lazy">${p.life?`<img class="l" src="${p.life}" alt="" width="900" height="900" loading="lazy">`:''}</a>
    ${p.new>=recent?'<span class="tag n">NUEVO</span>':''}
    <button class="fav glass-l" data-fav="${p.h}" aria-pressed="${favs.has(p.h)}" aria-label="Guardar ${t} en favoritos">${heart}</button>
    <div class="acts"><button class="add glass-l" data-add="${p.v}" ${p.ok?'':'disabled'}>${p.ok?'AÑADIR AL CARRITO':'AGOTADO'}</button><button class="qvb glass-l" data-qv="${p.h}" aria-label="Vista rápida de ${t}"><svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg></button></div>
  </div><div class="meta"><span class="club-n">${clubName[p.c]||'Mocilab'}</span><h3><a href="${u}">${t}</a></h3><span class="pr num">${eur(p.p)}</span></div></article>`;
}

/* --- carrito, favoritos, toast --- */
function renderCart(){
  localStorage.mocicart=JSON.stringify(cart);
  const ids=Object.keys(cart).filter(v=>byV[v]), tot=ids.reduce((s,v)=>s+byV[v].p*cart[v],0), n=ids.reduce((s,v)=>s+cart[v],0);
  $('#count').textContent=n||'';$('#tot').textContent=eur(tot);
  $('#ship').innerHTML=(tot>=FREE?'Tienes el <b>envío gratis</b> ✓':`Te faltan <b class="num">${eur(FREE-tot)}</b> para el envío gratis`)+`<div class="meter"><i style="transform:scaleX(${Math.min(1,tot/FREE)})"></i></div>`;
  $('#items').innerHTML=ids.map(v=>{const p=byV[v];return `<div class="it"><img src="${p.img}" alt="" width="64" height="80"><div style="min-width:0"><a href="${prodURL(p.h)}">${esc(p.t)}</a><br><span class="qty"><button data-d="-1" data-v="${v}" aria-label="Quitar una unidad">−</button><span class="num">${cart[v]}</span><button data-d="1" data-v="${v}" aria-label="Añadir una unidad">+</button></span></div><b class="num">${eur(p.p*cart[v])}</b></div>`}).join('')||'<p style="padding:48px 0;text-align:center;color:#aaa">Tu carrito está vacío.<br>Empieza por tu club.</p>';
  // permalink de carrito de Shopify: lleva al checkout real de mocilab.com
  $('#checkout').href=ids.length?'https://mocilab.com/cart/'+ids.map(v=>v+':'+cart[v]).join(','):`${H}#tienda`;
}
function renderFav(){localStorage.mocifav=JSON.stringify([...favs]);$('#favN').textContent=favs.size||''}
let tt;function toast(m){const t=$('#toast');t.textContent=m;t.classList.add('show');clearTimeout(tt);tt=setTimeout(()=>t.classList.remove('show'),2400)}
function add(v,q=1){cart[v]=(cart[v]||0)+q;renderCart();toast('Añadido al carrito ✓')}
function toggleFav(h){favs.has(h)?favs.delete(h):favs.add(h);$$(`[data-fav="${h}"]`).forEach(b=>b.setAttribute('aria-pressed',favs.has(h)));renderFav();toast(favs.has(h)?'Guardado en favoritos ♥':'Quitado de favoritos')}

/* --- capas (carrito / vista rápida) con foco atrapado --- */
let lastFocus;
function openLayer(cls,el){lastFocus=document.activeElement;document.body.classList.add(cls);el.setAttribute('aria-hidden','false');el.inert=false;setTimeout(()=>el.querySelector('button,a[href]')?.focus(),60)}
function closeLayers(){document.body.classList.remove('cart-open','qv-open');[$('#drawer'),$('#qv')].forEach(e=>{e.setAttribute('aria-hidden','true');e.inert=true});lastFocus?.focus?.()}
[$('#drawer'),$('#qv')].forEach(e=>e.inert=true);
function quick(h){
  const p=byH[h],g=[p.img,...p.gal];let q=1;
  $('#qv').innerHTML=`<div class="gal"><div class="main"><img id="qvImg" src="${g[0]}" alt="${esc(p.t)}" width="900" height="1125"></div><div class="th">${g.map((u,i)=>`<button data-g="${i}" aria-pressed="${!i}" aria-label="Ver foto ${i+1}"><img src="${u.replace('width=1000','width=160')}" alt="" width="60" height="60" loading="lazy"></button>`).join('')}</div></div>
   <div class="info"><button class="x" data-close aria-label="Cerrar vista rápida">×</button><span class="lbl soft">${clubName[p.c]||'Mocilab'}</span><h3 id="qvT">${esc(p.t)}</h3><span class="pr num">${eur(p.p)}</span>
   <p class="desc">${esc(p.desc||'Producto oficial con licencia, diseñado en España.')}</p>
   <ul><li>Licencia oficial</li><li>Envío en 24-72 h · gratis desde 40&nbsp;€</li><li>Devolución en 14 días</li></ul>
   <div class="row"><div class="stepper"><button data-q="-1" aria-label="Quitar una unidad">−</button><output id="qvQ" class="num">1</output><button data-q="1" aria-label="Añadir una unidad">+</button></div>
   <button class="btn k" id="qvAdd" ${p.ok?'':'disabled'}>${p.ok?'Añadir al carrito':'Agotado'}</button></div>
   <a class="soft" style="font-size:14px;text-decoration:underline" href="${prodURL(p.h)}">Ver ficha completa</a></div>`;
  $('#qv').onclick=e=>{const t=e.target.closest('button');if(!t)return;e.stopPropagation();
    if(t.dataset.g){$('#qvImg').src=g[t.dataset.g];$$('#qv .th button').forEach(b=>b.setAttribute('aria-pressed',b===t))}
    else if(t.dataset.q){q=Math.max(1,q+ +t.dataset.q);$('#qvQ').textContent=q}
    else if(t.id==='qvAdd'){add(p.v,q);closeLayers()}
    else if('close' in t.dataset)closeLayers()};
  openLayer('qv-open',$('#qv'));
}

/* --- eventos comunes; cada página puede añadir window.pageClick(e,t) --- */
document.addEventListener('click',e=>{
  const t=e.target.closest('button,a');if(!t)return;
  const d=t.dataset;
  if(d.qv){e.preventDefault();quick(d.qv)}
  else if(d.add)add(d.add);
  else if(d.fav){toggleFav(d.fav);window.onFav?.()}
  else if(d.d){const v=d.v;cart[v]+= +d.d;if(cart[v]<=0)delete cart[v];renderCart()}
  else if(t.id==='openCart')openLayer('cart-open',$('#drawer'));
  else if(t.id==='closeCart')closeLayers();
  else if(t.id==='favBtn'){if(!favs.size)toast('Pulsa ♥ en un producto para guardarlo');else if(window.showFavs)showFavs();else location.href='index.html?cat=fav#tienda'}
  else if(t.id==='sbtn'){$('#q').classList.toggle('on');$('#q').focus()}
  else window.pageClick?.(e,t);
});
$('#scrim').onclick=closeLayers;
addEventListener('keydown',e=>{
  if(e.key==='Escape')closeLayers();
  if(e.key==='Tab'){const L=document.body.classList.contains('qv-open')?$('#qv'):document.body.classList.contains('cart-open')?$('#drawer'):null;if(!L)return;
    const f=[...L.querySelectorAll('button:not([disabled]),a[href]')];if(!f.length)return;
    if(e.shiftKey&&document.activeElement===f[0]){e.preventDefault();f.at(-1).focus()}else if(!e.shiftKey&&document.activeElement===f.at(-1)){e.preventDefault();f[0].focus()}}
});
// búsqueda: en la portada filtra en vivo (window.onSearch); en el resto lleva a la tienda al pulsar Intro
$('#q').addEventListener('keydown',e=>{if(e.key==='Enter'&&!window.onSearch&&e.target.value.trim())location.href='index.html?q='+encodeURIComponent(e.target.value.trim())+'#tienda'});
let qt;$('#q').oninput=e=>{if(!window.onSearch)return;clearTimeout(qt);qt=setTimeout(()=>onSearch(e.target.value.trim()),180)};
$('#nl').onsubmit=e=>{e.preventDefault();toast('¡Gracias! Ya estás en el club');e.target.reset()};
const hdr=$('#hdr');
if(isIndex){const onScroll=()=>{const s=scrollY>innerHeight*.7;hdr.classList.toggle('solid',s);document.body.classList.toggle('scrolled',s)};addEventListener('scroll',onScroll,{passive:true});onScroll()}
else{hdr.classList.add('solid');document.body.classList.add('scrolled','inner')}
renderCart();renderFav();
