(() => {
  'use strict';
  const reduced = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : {matches:true};
  const header = document.querySelector('.navbar');
  const progress = document.querySelector('.reading-progress');
  let ticking = false;
  const updateScroll = () => {
    ticking = false;
    const y = window.scrollY || 0;
    if (header) header.classList.toggle('is-scrolled', y > 30);
    if (progress) {
      const distance = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.transform = 'scaleX(' + Math.max(0,Math.min(1,distance > 0 ? y / distance : 0)) + ')';
    }
  };
  window.addEventListener('scroll', () => { if (!ticking) {ticking=true;window.requestAnimationFrame(updateScroll);} }, {passive:true});
  window.addEventListener('resize', updateScroll);
  updateScroll();
  const nav = document.getElementById('navMenu'), toggle = document.getElementById('menuToggle');
  const closeMenu = (focus=false) => {
    if (!nav || !toggle) return;
    nav.classList.remove('open'); toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label','Open menu');
    if (focus) toggle.focus();
  };
  if (nav && toggle) {
    document.addEventListener('keydown', e => {if(e.key === 'Escape' && nav.classList.contains('open'))closeMenu(true);});
    document.addEventListener('click', e => {if(!header.contains(e.target))closeMenu();});
    nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => closeMenu()));
    window.addEventListener('resize', () => {if(window.innerWidth>980)closeMenu();});
    const active=nav.querySelector('.is-active');if(active)active.setAttribute('aria-current','page');
  }
  // Reveal once on entry. Observe only standalone visible surfaces, never form fields.
  if (!reduced.matches && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target);}});
    }, {threshold:0.08});
    document.querySelectorAll('.section-heading,.editorial-card,.project-bento>a,.story-photo,.planner-surface,.process-step,.local-town-grid,.footer-invitation').forEach((el,index) => {
      if (el.getBoundingClientRect().top < window.innerHeight) return;
      el.style.setProperty('--reveal-delay',(index%3)*65+'ms');el.classList.add('reveal-ready');observer.observe(el);
    });
    const showAll=()=>{observer.disconnect();document.querySelectorAll('.reveal-ready').forEach(el=>el.classList.add('is-visible'));};
    if(reduced.addEventListener)reduced.addEventListener('change',e=>{if(e.matches)showAll();});
    window.addEventListener('beforeprint',showAll);
  }
  const serviceBar=document.getElementById('serviceFilters');
  const galleryBar=document.getElementById('galleryFilters');
  const params=new URLSearchParams(window.location.search);
  if(galleryBar && ['projects','seasonal','all'].includes(params.get('view'))) {
    galleryBar.querySelector('[data-filter="'+params.get('view')+'"]').click();
  }
  if(serviceBar && ['fall','lawn','exterior','winter','all'].includes(params.get('category'))) {
    serviceBar.querySelector('[data-filter="'+params.get('category')+'"]').click();
  }
  [serviceBar,galleryBar].filter(Boolean).forEach(bar=>bar.addEventListener('click', e=>{
    if(!e.target.closest('button')||reduced.matches)return;
    const selector=bar===serviceBar?'.service-tile:not([hidden])':'[data-gallery-group]:not([hidden])';
    document.querySelectorAll(selector).forEach(el=>{
      el.classList.remove('filter-arrive');
      window.requestAnimationFrame(()=>el.classList.add('filter-arrive'));
    });
  }));
  // Keep the image illustrative and make the leaf question relevant to the service.
  const planner=document.getElementById('seasonPlanner');
  if(planner) {
    const scope=document.getElementById('leafScope');
    const updatePlanner=()=>{
      const selected=planner.querySelector('input[name="service"]:checked');
      if(scope){scope.disabled=selected && selected.value==='Gutter cleaning';scope.closest('div').hidden=scope.disabled;}
    };
    planner.addEventListener('change',updatePlanner);updatePlanner();
  }
})();
