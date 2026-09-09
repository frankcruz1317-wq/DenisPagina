(() => {
 'use strict';
 // No tracking service or persistent visitor identifier is installed.
 // Connect these non-personal events to the owner's analytics account when available.
 const allowed=new Set(['call_click','email_click','whatsapp_click','quote_start','quote_step','quote_submit_attempt','gallery_filter','google_reviews_click']);
 function track(event,fields={}){
  if(!allowed.has(event))return;
  const safe={event,page:location.pathname};
  for(const key of ['step','service','city','category'])if(fields[key]!==undefined)safe[key]=fields[key];
  window.dataLayer=window.dataLayer||[];window.dataLayer.push(safe);
  document.dispatchEvent(new CustomEvent('ariana:analytics',{detail:safe}));
 }
 window.ArianaEvents={track};
 document.addEventListener('click',e=>{
  const a=e.target.closest('a');if(!a)return;const href=a.getAttribute('href')||'';
  if(href.startsWith('tel:'))track('call_click');else if(href.startsWith('mailto:'))track('email_click');
  else if(href.includes('wa.me/'))track('whatsapp_click');else if(href.includes('quote.html'))track('quote_start');
  else if(a.dataset.googleReviews!==undefined)track('google_reviews_click');
 });
 const bar=document.getElementById('galleryGroupFilters'),types=document.getElementById('projectTypeFilters');
 if(bar&&types){
  let group=new URLSearchParams(location.search).get('view')==='projects'?'projects':'all',type='all';
  const sections=[...document.querySelectorAll('[data-gallery-group]')],cards=[...document.querySelectorAll('.gallery-grid .work-card')];
  function filter(){
   bar.querySelectorAll('[data-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.filter===group)));
   types.querySelectorAll('[data-type]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.type===type)));
   cards.forEach(card=>{const section=card.closest('[data-gallery-group]');card.hidden=(group!=='all'&&section.dataset.galleryGroup!==group)||(type!=='all'&&!card.dataset.workType.split(' ').includes(type));});
   sections.forEach(section=>section.hidden=![...section.querySelectorAll('.work-card')].some(card=>!card.hidden));
   const visible=cards.filter(c=>!c.hidden).length;document.getElementById('galleryCount').textContent=visible?`${visible} photos · select a photo to explore`:'No photos in this combination. Choose All photos or another type of work.';
  }
  bar.hidden=false;types.hidden=false;
  bar.addEventListener('click',e=>{const b=e.target.closest('[data-filter]');if(b){group=b.dataset.filter;type='all';filter();track('gallery_filter',{category:group});}});
  types.addEventListener('click',e=>{const b=e.target.closest('[data-type]');if(b){type=b.dataset.type;group='all';filter();track('gallery_filter',{category:type});}});filter();
 }
 // Optional, only rendered once a genuine same-property before/after pair is confirmed.
 document.querySelectorAll('[data-project-compare]').forEach(el=>{
  const range=el.querySelector('input[type=range]'),stage=el.querySelector('.compare-stage');
  if(!range||!stage)return;
  const update=()=>{stage.style.setProperty('--split',range.value+'%');range.setAttribute('aria-valuetext',range.value+'% before photo visible');};
  range.addEventListener('input',update);update();
 });
})();
