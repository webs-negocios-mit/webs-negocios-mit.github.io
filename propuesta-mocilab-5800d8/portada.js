/* Solo portada: pase de fotos, clubes, tienda con filtros, categorías, reseñas y licencias. */
const isPack=p=>/pack/i.test(p.t);
const CATS=[['all','Todo',()=>1],['monedas','Monedas',p=>p.cat==='monedas'],['cuadernos','Cuadernos 3D',p=>p.cat==='cuadernos'],['blocs','Blocs 3D',p=>p.cat==='blocs'],['packs','Packs',isPack],['regalo','Regalos < 25 €',p=>p.p<25&&p.ok],['fav','Favoritos',p=>favs.has(p.h)]];
const SORTS={new:(a,b)=>b.ok-a.ok||b.new.localeCompare(a.new),asc:(a,b)=>b.ok-a.ok||a.p-b.p,desc:(a,b)=>b.ok-a.ok||b.p-a.p,az:(a,b)=>a.t.localeCompare(b.t,'es')};
const P=new URLSearchParams(location.search), okCat=c=>CATS.some(x=>x[0]===c);
let st={club:clubName[P.get('club')]?P.get('club'):'all',cat:okCat(P.get('cat'))?P.get('cat'):'all',sort:SORTS[P.get('sort')]?P.get('sort'):'new',q:P.get('q')||'',n:16};

/* --- pase de fotos --- */
const SLIDES=[['Thumbnails-Valencia-26_1_8cc0a5bb-501c-4229-ae4f-a148f593d4c9.png','moneda-oficial-valencia-cf-coleccionable-1919-oro','50% 40%'],
 ['Thumbnail-Cuaderno-Benfica-04_1.png','cuaderno-3d-oficial-a5-sport-lisboa-e-benfica','60% 50%'],
 ['Thumbnails-MonedasIDOLS-35_1.png','pack-3-fc-barcelona-idols-pedri-raphinha-lewandowski-copia','50% 50%'],
 ['Thumbnails-Valencia-30_1.png','moneda-oficial-valencia-cf-coleccionable-bronco-oro','50% 60%'],
 ['Thumbnails-Porto-04.png','cuaderno-3d-fc-porto-a5','40% 50%'],
 ['Thumbnails-Monedas-Sporting-05_ede6594f-5822-4c2f-aab7-d4b426048df1.png','pack-5-monedas-oficiales-sporting-cp','50% 50%'],
 ['Thumbnails-FCB-03_1f702c7f-f739-4dd5-8cd3-9ec018f18aae.png','pack-5-sobres-icoins-collection-fc-barcelona','50% 50%']].filter(s=>byH[s[1]]);
$('#slides').innerHTML=SLIDES.map(([f,h,o],i)=>`<div class="slide" style="--o:${o}"><img src="${F}${f}?width=2000" alt="${esc(byH[h].t)}" width="2000" height="2000" ${i?'loading="lazy"':'fetchpriority="high"'}></div>`).join('');
$('#prog').innerHTML=SLIDES.map((s,i)=>`<button aria-label="Ver foto ${i+1} de ${SLIDES.length}"><i></i></button>`).join('');
let cur=-1,timer,paused=matchMedia('(prefers-reduced-motion: reduce)').matches;
function go(i){
  cur=(i+SLIDES.length)%SLIDES.length;
  $$('.slide').forEach((s,k)=>{s.classList.toggle('on',k===cur);s.setAttribute('aria-hidden',k!==cur)});
  $$('#prog button').forEach((b,k)=>{b.className=k<cur?'done':'';b.toggleAttribute('aria-current',k===cur);if(k===cur){void b.offsetWidth;b.className='on'}});
  const p=byH[SLIDES[cur][1]];$('#chip').href=prodURL(p.h);$('#chipImg').src=p.img;$('#chipTxt').textContent=`${p.t} · ${eur(p.p)}`;
  clearTimeout(timer);if(!paused)timer=setTimeout(()=>go(cur+1),7000);
}
function setPause(v){paused=v;$('#hero').classList.toggle('paused',v);$('#pp').setAttribute('aria-label',v?'Reanudar pase de fotos':'Pausar pase de fotos');
  $('#ppIcon').innerHTML=v?'<path d="M3 1.5v11l9-5.5z"/>':'<rect x="2" y="1" width="3.5" height="12" rx="1"/><rect x="8.5" y="1" width="3.5" height="12" rx="1"/>';clearTimeout(timer);if(!v)timer=setTimeout(()=>go(cur+1),4000)}
$('#pp').onclick=()=>setPause(!paused);
$('#prog').onclick=e=>{const b=e.target.closest('button');if(b)go($$('#prog button').indexOf(b))};
document.addEventListener('visibilitychange',()=>{if(document.hidden)clearTimeout(timer);else if(!paused)go(cur)});

/* --- contenido fijo --- */
$('#clubs').innerHTML=CLUBS.map(([k,n,f])=>`<button class="club" data-club="${k}" aria-pressed="false">${f?`<img src="${F}${f}?width=64" alt="" width="32" height="32">`:`<span class="ph0" aria-hidden="true">${k==='all'?'✦':n[0]}</span>`}${n}</button>`).join('');
$('#cats').innerHTML=[['Monedas','monedas','Thumbnails-Valencia-30_1.png'],['Cuadernos 3D','cuadernos','Thumbnail-Cuaderno-Benfica-04_1.png'],['Blocs 3D','blocs','Thumbnails-Porto-04.png'],['Packs','packs','Thumbnails-MonedasIDOLS-35_1.png']]
  .map(([n,k,f])=>`<a class="cat" href="?cat=${k}#tienda" data-cat="${k}"><img src="${F}${f}?width=800" alt="" width="800" height="800" loading="lazy"><div class="lb glass-l"><b>${n}</b><span class="num">${PRODUCTS.filter(CATS.find(c=>c[0]===k)[2]).length} productos →</span></div></a>`).join('');
const R=[['Las monedas llegaron en perfecto estado y son preciosas para la colección del Benfica.','João Pedro C.'],['Primera compra y ya me he convertido en cliente habitual.','Espartaco V.'],['Monedas y servicio excelentes. ¡Enhorabuena!','Carlos B.'],['Muy buena calidad.','Paulo L.'],['Rápidos y todo excelente.','Verónica P.'],['Todo fue bien, las monedas son preciosas.','Jorge C.'],['Una colección preciosa y de calidad.','Gonçalo F.']];
const rvH=R.map(([t,a])=>`<figure class="rv"><span class="st" aria-label="5 de 5 estrellas">★★★★★</span><p>“${t}”</p><small>${a} · Compra verificada</small></figure>`).join('');
$('#rv').innerHTML=rvH+rvH.replaceAll('<figure class="rv"','<figure class="rv" aria-hidden="true"');
$('#lic').innerHTML=[['real-madrid','Real Madrid'],['barcelona','FC Barcelona'],['atletico-madrid','Atlético de Madrid'],['valencia-color','Valencia CF'],['benfica_db303d1e-b820-4261-82c0-e056132e01ea','SL Benfica'],['sporting','Sporting CP'],['porto','FC Porto'],['portugal-fpf','Federación Portuguesa de Fútbol']].map(([f,a])=>`<img src="${F}${f}.png?width=160" alt="${a}" width="160" height="160" loading="lazy">`).join('');

/* --- tienda --- */
function syncURL(){const u=new URLSearchParams();if(st.club!=='all')u.set('club',st.club);if(st.cat!=='all')u.set('cat',st.cat);if(st.sort!=='new')u.set('sort',st.sort);if(st.q)u.set('q',st.q);history.replaceState(null,'',(u+''?'?'+u:location.pathname)+location.hash)}
function base(){const q=st.q.toLowerCase();return PRODUCTS.filter(p=>(st.club==='all'||p.c===st.club)&&(!q||p.t.toLowerCase().includes(q)))}
function render(){
  const B=base(), L=B.filter(CATS.find(c=>c[0]===st.cat)[2]).sort(SORTS[st.sort]);
  $('#pills').innerHTML=CATS.filter(c=>c[0]!=='fav'||favs.size).map(([k,n,f])=>`<button class="pill" data-cat="${k}" aria-pressed="${k===st.cat}">${n} <small class="num">${B.filter(f).length}</small></button>`).join('');
  const a=$('#pills [aria-pressed=true]');if(a)$('#pills').scrollLeft=a.offsetLeft-24;
  const c=clubName[st.club];
  $('#ttl').innerHTML=st.q?`Resultados <span>“${esc(st.q)}”</span>`:st.cat==='fav'?'Tus <span>favoritos</span>':st.club==='all'?'Toda la <span class="out">tienda</span>':`${c} <span>oficial</span>`;
  $('#n').textContent=`${L.length} ${L.length===1?'producto':'productos'}`;
  $('#grid').innerHTML=L.slice(0,st.n).map(card).join('')||`<div class="empty"><p>No hay productos con estos filtros.</p><button class="btn k" id="reset">Ver toda la tienda</button></div>`;
  $('#more').hidden=L.length<=st.n;
  $$('.club').forEach(b=>b.setAttribute('aria-pressed',b.dataset.club===st.club));
  $('#sort').value=st.sort;
  syncURL();
}
const toShop=()=>$('#tienda').scrollIntoView();
window.onFav=()=>{if(st.cat==='fav'||favs.size<=1)render()};
window.showFavs=()=>{st.cat='fav';render();toShop()};
window.onSearch=q=>{st.q=q;st.n=16;render();if(q)toShop()};
window.pageClick=(e,t)=>{const d=t.dataset;
  if(d.club){st.club=d.club;st.n=16;render();toShop()}
  else if(d.cat){e.preventDefault();st.cat=d.cat;st.n=16;render();if(!t.closest('#pills'))toShop()}
  else if(t.id==='more'){st.n+=16;render()}
  else if(t.id==='reset'){st={...st,club:'all',cat:'all',q:''};$('#q').value='';render()}};
$('#sort').onchange=e=>{st.sort=e.target.value;render()};
if(st.q){$('#q').value=st.q;$('#q').classList.add('on')}
go(0);if(paused)setPause(true);render();
