/* Rodriguez IT Solutions · interacciones */
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  // Los datos vienen del panel (contenido/sitio.json), inyectados por el generador
  const SITIO = window.SITIO || { whatsapp: '50433180857', giros: [] };
  const WA = `https://wa.me/${SITIO.whatsapp}?text=`;
  const GIROS = SITIO.giros; // { w: palabra, n: negocio, t: frase, venta, inv, cat }
  const img = (g, kind) => g[kind];

  // Precarga suave de las imágenes de giros
  const preload = (src) => { const i = new Image(); i.decoding = 'async'; i.src = src; return i; };
  window.addEventListener('load', () => {
    GIROS.forEach((g) => { preload(g.venta); preload(g.cat); });
  });

  /* ---------- Navegación sólida al bajar ---------- */
  const nav = $('#nav');
  const navMenu = $('#navMenu');
  const setMenu = (open) => {
    nav.classList.toggle('is-open', open);
    navMenu.setAttribute('aria-expanded', String(open));
    navMenu.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  };
  navMenu.addEventListener('click', () => setMenu(!nav.classList.contains('is-open')));
  $$('#navLinks a').forEach((a) => a.addEventListener('click', () => setMenu(false)));
  addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });

  /* ---------- Cinta de giros: avanza con el scroll, no sola ---------- */
  const mq = $('.marquee');
  const mqTrack = $('.marquee__track');

  /* ---------- Portada: palabra que rota + pantallas sincronizadas ---------- */
  const rot = $('#rot');
  const screen = $('#heroScreen');
  const phoneScr = $('#heroPhone .phone__screen');
  const tagText = $('#heroTagText');
  let gi = 0;

  function swapImg(container, src, alt, extraClass = '') {
    const old = container.querySelector('img.is-on');
    const next = document.createElement('img');
    next.src = src; next.alt = alt; next.decoding = 'async';
    if (extraClass) next.className = extraClass;
    container.appendChild(next);
    const show = () => requestAnimationFrame(() => {
      next.classList.add('is-on');
      if (old) { old.classList.remove('is-on'); setTimeout(() => old.remove(), 700); }
    });
    if (next.complete) show(); else next.onload = show;
  }

  function nextGiro() {
    gi = (gi + 1) % GIROS.length;
    const g = GIROS[gi];
    const { w, n } = g;
    const cur = rot.querySelector('.rot__word.is-in');
    const word = document.createElement('span');
    word.className = 'rot__word is-pre';
    word.textContent = w;
    rot.appendChild(word);
    requestAnimationFrame(() => requestAnimationFrame(() => {
      word.classList.replace('is-pre', 'is-in');
      if (cur) { cur.classList.replace('is-in', 'is-out'); setTimeout(() => cur.remove(), 600); }
    }));
    swapImg(screen, img(g, 'venta'), `Pantalla de Nueva Venta de DRC System para ${n}`);
    // en el celular el catálogo cambia sin desvanecerse (es otra "app")
    const ph = phoneScr.querySelector('img');
    if (ph) { ph.src = img(g, 'cat'); ph.alt = `Catálogo web de ${n} en el celular`; }
    tagText.textContent = n;
  }
  if (!reduce && GIROS.length > 1) setInterval(() => { if (!document.hidden && heroVisible) nextGiro(); }, 2600);

  let heroVisible = true;
  new IntersectionObserver(([e]) => { heroVisible = e.isIntersecting; }, { threshold: 0.05 }).observe($('.hero'));

  /* ---------- Bucle de scroll ---------- */
  const stage = $('#stage');
  const heroBg = $('#heroBg');
  const seq = $('#productos');
  const scenes = $$('.scene', seq);
  const seqBg = $('#seqBg');
  const seqNum = $('#seqNum');
  const seqBar = $('#seqBar');
  const words = $$('.scene__art--words span');
  const fix = $('#mantenimiento');
  const parts = $$('.fix__photos img');
  const fixItems = $$('#fixList li');
  let activeScene = -1;
  let activeFix = -1;

  function setScene(i) {
    if (i === activeScene) return;
    scenes.forEach((s, k) => {
      s.classList.toggle('is-active', k === i);
      s.classList.toggle('is-leaving', k < i);
    });
    const s = scenes[i];
    seqBg.style.setProperty('--seq-bg', s.dataset.bg);
    seqBg.style.backgroundColor = s.dataset.bg;
    s.style.setProperty('--accent', s.dataset.accent);
    seqNum.textContent = String(i + 1).padStart(2, '0');
    document.querySelector('meta[name="theme-color"]').content = s.dataset.bg;
    activeScene = i;
  }
  scenes.forEach((s) => s.style.setProperty('--accent', s.dataset.accent));

  function progress(el) {
    const r = el.getBoundingClientRect();
    const total = r.height - innerHeight;
    return total > 0 ? clamp(-r.top / total) : 0;
  }

  function onScroll() {
    nav.classList.toggle('is-solid', scrollY > 40);

    if (!reduce) {
      const mr = mq.getBoundingClientRect();
      if (mr.bottom > 0 && mr.top < innerHeight) {
        const half = mqTrack.scrollWidth / 2;
        mqTrack.style.setProperty('--mq', (((innerHeight - mr.top) * 0.6) % half).toFixed(1));
      }
    }

    // Portada: la foto de fondo baja más despacio que la página (efecto de profundidad)
    if (heroBg && !reduce && scrollY < innerHeight * 1.3) heroBg.style.setProperty('--hy', (scrollY * 0.35).toFixed(1) + 'px');

    // Portada: la laptop se "abre" hacia el espectador
    if (!reduce) {
      const r = stage.getBoundingClientRect();
      const p = clamp(1 - (r.top - innerHeight * 0.25) / (innerHeight * 0.55));
      stage.style.setProperty('--p', p.toFixed(3));
    } else stage.style.setProperty('--p', 1);

    // Productos: escena según el avance
    const sp = progress(seq);
    const idx = Math.min(scenes.length - 1, Math.floor(sp * scenes.length * 0.999));
    setScene(idx);
    seqBar.style.width = (sp * 100).toFixed(2) + '%';
    if (idx === scenes.length - 1 && words.length) {
      const local = clamp(sp * scenes.length - idx);
      const lit = Math.floor(local * (words.length + 0.5));
      words.forEach((w, k) => w.classList.toggle('is-lit', k < lit));
    }

    // Mantenimiento: cambia la foto según el servicio
    if (innerWidth > 900 && fixItems.length) {
      const fp = progress(fix);
      const fi = Math.min(fixItems.length - 1, Math.floor(fp * fixItems.length * 0.999));
      if (fi !== activeFix) {
        fixItems.forEach((li, k) => li.classList.toggle('is-on', k === fi));
        parts.forEach((pt) => pt.classList.toggle('is-on', pt.dataset.k === fixItems[fi].dataset.p));
        activeFix = fi;
      }
    }
  }
  let ticking = false;
  const req = () => { if (!ticking) { ticking = true; requestAnimationFrame(() => { onScroll(); ticking = false; }); } };
  addEventListener('scroll', req, { passive: true });
  addEventListener('resize', req);
  onScroll();

  // En celular, la foto cambia por punto en lugar de scroll fijado
  if (innerWidth <= 900) {
    const io = new IntersectionObserver((ents) => ents.forEach((e) => {
      if (e.isIntersecting) {
        const k = e.target.dataset.p;
        fixItems.forEach((li) => li.classList.toggle('is-on', li === e.target));
        parts.forEach((pt) => pt.classList.toggle('is-on', pt.dataset.k === k));
      }
    }), { rootMargin: '-45% 0px -45% 0px' });
    fixItems.forEach((li) => io.observe(li));
  }

  /* ---------- Pruebe con su negocio ---------- */
  const chips = $$('#chips button');
  const segBtns = $$('.seg button');
  const tryDesk = $('#tryDesk');
  const tryPhone = $('#tryPhone');
  const tryMsg = $('#tryMsg');
  const tryBtn = $('#tryBtn');
  let tryG = GIROS[0], tryV = 'venta', tryT = GIROS[0] ? GIROS[0].t : '';

  function fade(el, src, alt) {
    el.classList.add('is-swapping');
    el.dataset.want = src; // solo gana la última petición
    const pre = preload(src);
    const done = () => setTimeout(() => {
      if (el.dataset.want !== src) return;
      el.src = src; el.alt = alt; el.classList.remove('is-swapping');
    }, 180);
    if (pre.complete) done(); else pre.onload = done;
  }
  function renderTry() {
    fade(tryDesk, img(tryG, tryV), `Pantalla de ${tryV === 'venta' ? 'venta' : 'inventario'} para ${tryT}`);
    fade(tryPhone, img(tryG, 'cat'), `Catálogo web para ${tryT}`);
    tryMsg.textContent = '';
    tryMsg.append('“Tengo ', Object.assign(document.createElement('strong'), { textContent: tryT }), ' y quiero DRC System.”');
    tryBtn.href = WA + encodeURIComponent(`Hola, tengo ${tryT} y quiero DRC System`);
  }
  chips.forEach((b) => b.addEventListener('click', () => {
    chips.forEach((c) => c.setAttribute('aria-selected', String(c === b)));
    tryG = GIROS[+b.dataset.i]; tryT = tryG.t;
    renderTry();
  }));
  segBtns.forEach((b) => b.addEventListener('click', () => {
    segBtns.forEach((c) => { c.classList.toggle('is-on', c === b); c.setAttribute('aria-pressed', String(c === b)); });
    tryV = b.dataset.v;
    renderTry();
  }));
  // flechas en la lista de giros
  $('#chips').addEventListener('keydown', (e) => {
    if (!['ArrowRight', 'ArrowLeft'].includes(e.key)) return;
    const i = chips.indexOf(document.activeElement);
    if (i < 0) return;
    const n = chips[(i + (e.key === 'ArrowRight' ? 1 : chips.length - 1)) % chips.length];
    n.focus(); n.click();
  });

  /* ---------- Antes / después ---------- */
  const baBox = $('#baBox');
  const baRange = $('.ba__range', baBox);
  baRange.addEventListener('input', () => baBox.style.setProperty('--pos', baRange.value + '%'));

  /* ---------- Videos de clientes ---------- */
  const dlg = $('#vid');
  const vEl = $('#vidEl');
  $$('.case__media, .job__media[data-video]').forEach((b) => b.addEventListener('click', () => {
    dlg.classList.toggle('vid--wide', b.hasAttribute('data-wide'));
    vEl.src = b.dataset.video;
    dlg.showModal();
    vEl.play().catch(() => {});
  }));
  const closeVid = () => { vEl.pause(); vEl.removeAttribute('src'); vEl.load(); dlg.close(); };
  $('.vid__close').addEventListener('click', closeVid);
  dlg.addEventListener('click', (e) => { if (e.target === dlg) closeVid(); });
  dlg.addEventListener('cancel', () => { vEl.pause(); });

  /* ---------- Trabajos: los videos se reproducen solos (sin sonido) al verse ---------- */
  const jobVids = $$('.job video');
  if (jobVids.length && !reduce) {
    const vio = new IntersectionObserver((ents) => ents.forEach((e) => {
      const v = e.target;
      if (e.isIntersecting) {
        if (!v.src) v.src = v.dataset.src;
        v.play().catch(() => {});
      } else v.pause();
    }), { threshold: 0.5 });
    jobVids.forEach((v) => vio.observe(v));
  }

  /* ---------- Menú: marcar la sección que se está viendo ---------- */
  const navAs = $$('#navLinks a[href^="#"]');
  const secs = navAs.map((a) => document.getElementById(a.getAttribute('href').slice(1))).filter(Boolean);
  if (secs.length) {
    const marcar = () => {
      const y = innerHeight * 0.35;
      let cur = secs[0];
      for (const s of secs) if (s.getBoundingClientRect().top <= y) cur = s;
      navAs.forEach((a) => a.classList.toggle('is-active', a.getAttribute('href') === '#' + cur.id));
    };
    let t2 = false;
    addEventListener('scroll', () => { if (!t2) { t2 = true; setTimeout(() => { marcar(); t2 = false; }, 120); } }, { passive: true });
    addEventListener('resize', marcar);
    marcar();
  }

  /* ---------- Botón flotante de WhatsApp ---------- */
  const waF = $('#waFloat');
  if (waF) {
    const hero = $('#inicio');
    const cierre = $('#contacto');
    const vis = { hero: true, cierre: false };
    const upd = () => waF.classList.toggle('is-on', !vis.hero && !vis.cierre);
    const fio = new IntersectionObserver((ents) => ents.forEach((e) => {
      vis[e.target === hero ? 'hero' : 'cierre'] = e.isIntersecting; upd();
    }));
    if (hero) fio.observe(hero);
    if (cierre) fio.observe(cierre);
  }
})();
