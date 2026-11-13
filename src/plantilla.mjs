// Plantilla de la página. El contenido viene de contenido/sitio.json.
// No hace falta tocar este archivo para cambiar textos o imágenes: use el panel.

const esc = (s = '') => String(s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

// *texto* se muestra en cursiva de color (énfasis)
const rich = (s = '') => esc(s).replace(/\*(.+?)\*/g, '<em>$1</em>');

const pad = (n) => String(n).padStart(2, '0');
const ICON_WA = '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><use href="#i-wa"/></svg>';
const ext = (a) => 'target="_blank" rel="noopener"';

export function render(d) {
  const wa = (msg) => `https://wa.me/${encodeURIComponent(d.contacto.whatsapp)}${msg ? '?text=' + encodeURIComponent(msg) : ''}`;
  const g0 = d.giros[0] || {};
  const n = d.productos.length;
  const partes = ['ram', 'ssd', 'os', 'clean'];

  const phone = (src, alt, scroll = true, lazy = true) =>
    `<div class="phone"><div class="phone__screen"><img ${lazy ? 'loading="lazy" ' : ''}${scroll ? 'class="scrolly" ' : ''}src="${esc(src)}" alt="${esc(alt)}" width="480" height="1440"></div></div>`;

  const arte = (p) => {
    if (p.tipo_imagen === 'palabras') {
      return `<figure class="scene__art scene__art--words" aria-label="Ejemplos">${(p.palabras || []).map((w) => `<span>${esc(w)}</span>`).join('')}</figure>`;
    }
    if (p.tipo_imagen === 'computadora_y_celular') {
      const [pc, cel] = p.imagenes || [];
      return `<figure class="scene__art scene__art--duo"><div class="frame"><img loading="lazy" src="${esc(pc || '')}" alt="${esc(p.nombre)} en computadora" width="1440" height="900"></div>${cel ? `<div class="phone phone--mini"><div class="phone__screen"><img loading="lazy" class="scrolly" src="${esc(cel)}" alt="${esc(p.nombre)} en el celular" width="480" height="1440"></div></div>` : ''}</figure>`;
    }
    if (p.tipo_imagen === 'celulares' || p.tipo_imagen === 'celulares_fijos') {
      const scroll = p.tipo_imagen === 'celulares';
      return `<figure class="scene__art scene__art--phones">${(p.imagenes || []).slice(0, 2).map((src) => phone(src, `${p.nombre} en el celular`, scroll)).join('')}</figure>`;
    }
    const src = (p.imagenes || [])[0] || '';
    return `<figure class="scene__art"><div class="frame"><img loading="lazy" src="${esc(src)}" alt="Pantalla de ${esc(p.nombre)} en DRC System" width="1440" height="900"></div></figure>`;
  };

  const datosJS = {
    whatsapp: d.contacto.whatsapp,
    giros: d.giros.map((g) => ({ w: g.palabra, n: g.negocio, t: g.frase, venta: g.img_venta, inv: g.img_inventario, cat: g.img_catalogo })),
  };

  const cinta = d.cinta.map((c) => `<span>${esc(c)}</span><i></i>`).join('');

  return `<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(d.general.titulo_pestana)}</title>
  <meta name="description" content="${esc(d.general.descripcion_google)}">
  <meta name="theme-color" content="#070B1F">
  <link rel="icon" type="image/png" sizes="32x32" href="assets/img/favicon-32.png">
  <link rel="apple-touch-icon" href="assets/img/apple-touch-icon.png">
  <meta property="og:type" content="website">
  <meta property="og:locale" content="es_HN">
  <meta property="og:site_name" content="Rodriguez IT Solutions">
  <meta property="og:title" content="${esc(d.general.titulo_al_compartir)}">
  <meta property="og:description" content="${esc(d.general.descripcion_google)}">
  <meta property="og:image" content="${esc(d.__base || '')}assets/img/og-image.jpg">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta name="twitter:card" content="summary_large_image">
  <script type="application/ld+json">${JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Rodriguez IT Solutions',
    description: d.general.descripcion_google,
    telephone: d.contacto.whatsapp_visible,
    areaServed: 'HN',
    address: { '@type': 'PostalAddress', addressCountry: 'HN' },
    sameAs: [d.contacto.instagram],
  }).replace(/</g, '\\u003c')}</script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wdth,wght@12..96,75..100,400..800&family=Instrument+Serif:ital@0;1&family=Schibsted+Grotesk:wght@400;500;600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="css/styles.css?v=${d.__ver}">
</head>
<body>

<header class="nav" id="nav">
  <a class="nav__brand" href="#inicio" aria-label="Rodriguez IT Solutions, inicio">
    <img src="assets/img/logo-rit.webp" alt="" width="40" height="40">
    <span>Rodriguez <em>IT</em> Solutions</span>
  </a>
  <nav class="nav__links" id="navLinks" aria-label="Secciones">
    <a href="#productos">Productos</a>
    <a href="#pruebe">Su negocio</a>
    <a href="#mantenimiento">Mantenimiento</a>
    <a href="#casos">Clientes</a>
  </nav>
  <div class="nav__right">
    <a class="btn btn--small" href="${esc(wa(d.contacto.mensaje_general))}" ${ext()}>${ICON_WA}<span>Escríbanos</span></a>
    <button class="nav__menu" id="navMenu" aria-label="Abrir menú" aria-expanded="false" aria-controls="navLinks"><svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" d="M4 8h16M4 16h16"/></svg></button>
  </div>
</header>

<main>

<section class="hero" id="inicio">
  <div class="hero__glow" aria-hidden="true"></div>
  <h1 class="hero__title">
    <span class="hero__line">${esc(d.portada.pregunta_inicio)} <span class="rot" id="rot" aria-live="polite"><span class="rot__word is-in">${esc(g0.palabra)}</span></span>?</span>
    <span class="hero__line hero__line--b">${esc(d.portada.linea_dos)}</span>
  </h1>
  <p class="hero__lede">${rich(d.portada.descripcion)}</p>
  <div class="hero__actions">
    <a class="btn" href="${esc(wa(d.portada.mensaje_boton_principal))}" ${ext()}>${ICON_WA} ${esc(d.portada.boton_principal)}</a>
    <a class="btn btn--ghost" href="#productos">${esc(d.portada.boton_secundario)} <svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><use href="#i-down"/></svg></a>
  </div>

  <div class="stage" id="stage">
    <div class="laptop" id="heroLaptop">
      <div class="laptop__lid">
        <div class="laptop__screen" id="heroScreen">
          <img class="is-on" src="${esc(g0.img_venta)}" alt="Pantalla de Nueva Venta de DRC System para ${esc(g0.negocio)}" width="1440" height="900">
        </div>
      </div>
      <div class="laptop__base" aria-hidden="true"></div>
    </div>
    <div class="phone phone--hero" id="heroPhone">
      <div class="phone__screen">
        <img class="is-on scrolly" src="${esc(g0.img_catalogo)}" alt="Catálogo web de ${esc(g0.negocio)} en el celular" width="480" height="1440">
      </div>
    </div>
    <p class="stage__tag" id="heroTag"><span class="dot" aria-hidden="true"></span><span id="heroTagText">${esc(g0.negocio)}</span> · ${esc(d.portada.texto_debajo)}</p>
  </div>
</section>

<div class="marquee" aria-hidden="true">
  <div class="marquee__track">${cinta}${cinta}</div>
</div>

<section class="seq" id="productos" aria-label="Productos" style="height:${Math.max(2, n) * 106 + 4}vh">
  <div class="seq__sticky">
    <div class="seq__bg" id="seqBg" aria-hidden="true"></div>
    <div class="seq__count" aria-hidden="true"><span class="seq__num" id="seqNum">01</span><span class="seq__of">/ ${pad(n)}</span></div>
    <div class="seq__bar" aria-hidden="true"><span id="seqBar"></span></div>
${d.productos.map((p, i) => `
    <article class="scene${i === 0 ? ' is-active' : ''}" data-bg="${esc(p.color_fondo)}" data-accent="${esc(p.color_acento)}">
      <div class="scene__text">
        <h2 class="scene__name">${esc(p.nombre)}</h2>
        <p class="scene__claim">${rich(p.frase)}</p>
        <ul class="scene__list">${(p.puntos || []).map((t) => `<li>${esc(t)}</li>`).join('')}</ul>
        <a class="btn btn--light" ${ext()} href="${esc(wa(p.mensaje_whatsapp))}">${esc(p.boton)}</a>
      </div>
      ${arte(p)}
    </article>`).join('')}
  </div>
</section>

<section class="try" id="pruebe">
  <div class="try__head">
    <h2 class="h2">${rich(d.pruebe.titulo)}</h2>
    <p class="lede">${rich(d.pruebe.descripcion)}</p>
  </div>
  <div class="chips" role="tablist" aria-label="Tipo de negocio" id="chips">
    ${d.giros.map((g, i) => `<button role="tab" aria-selected="${i === 0}" data-i="${i}">${esc(g.boton)}</button>`).join('\n    ')}
  </div>
  <div class="try__stage">
    <div class="try__desk">
      <div class="seg" role="group" aria-label="Pantalla">
        <button class="is-on" data-v="venta" aria-pressed="true">Venta</button>
        <button data-v="inv" aria-pressed="false">Inventario</button>
      </div>
      <div class="frame frame--try"><img id="tryDesk" src="${esc(g0.img_venta)}" alt="Pantalla de venta para ${esc(g0.frase)}" width="1440" height="900"></div>
    </div>
    <div class="phone phone--try"><div class="phone__screen"><img id="tryPhone" class="scrolly" src="${esc(g0.img_catalogo)}" alt="Catálogo web para ${esc(g0.frase)}" width="480" height="1440"></div></div>
  </div>
  <div class="try__cta">
    <p id="tryMsg">“Tengo <strong>${esc(g0.frase)}</strong> y quiero DRC System.”</p>
    <a class="btn" id="tryBtn" ${ext()} href="${esc(wa(`Hola, tengo ${g0.frase} y quiero DRC System`))}">${ICON_WA} ${esc(d.pruebe.boton)}</a>
  </div>
</section>

<section class="ba" id="antes">
  <h2 class="h2">${rich(d.antes_despues.titulo)}</h2>
  <div class="ba__box" id="baBox" style="--pos:50%">
    <div class="ba__after">
      ${(d.antes_despues.imagenes_despues || []).slice(0, 2).map((src) => phone(src, 'Después: catálogo web')).join('\n      ')}
      <span class="ba__label ba__label--r">Después</span>
    </div>
    <div class="ba__before" aria-hidden="true">
      <div class="chat">
        <div class="chat__top"><span class="chat__av"></span><div><b>Clienta</b><small>en línea</small></div></div>
        <div class="chat__body">
          <p class="msg in">Buenas, ¿qué tiene en coronas?</p>
          <p class="msg out ph"></p>
          <p class="msg out ph"></p>
          <p class="msg out">Esa en L 750 y esa en L 890</p>
          <p class="msg in">¿Y la primera que mandó cuánto era?</p>
          <p class="msg out ph"></p>
          <p class="msg in">¿Tiene en otro color?</p>
          <p class="msg out">Déjeme ver y le mando foto…</p>
        </div>
      </div>
      <span class="ba__label">Antes</span>
    </div>
    <input class="ba__range" type="range" min="0" max="100" value="50" aria-label="Comparar antes y después">
    <span class="ba__handle" aria-hidden="true"><svg viewBox="0 0 24 24"><use href="#i-lr"/></svg></span>
  </div>
</section>

<section class="fix" id="mantenimiento">
  <div class="fix__sticky">
    <div class="fix__text">
      <h2 class="h2">${rich(d.mantenimiento.titulo)}</h2>
      <p class="lede">${rich(d.mantenimiento.descripcion)}</p>
      <ol class="fix__list" id="fixList">
        ${d.mantenimiento.servicios.map((s, i) => `<li data-p="${partes[i % 4]}"><b>${esc(s.nombre)}</b><span>${esc(s.detalle)}</span></li>`).join('\n        ')}
      </ol>
      <div class="fix__modes">
        ${d.mantenimiento.modalidades.map((m) => `<a href="${esc(wa(m.mensaje_whatsapp))}" ${ext()}><b>${esc(m.nombre)}</b><span>${esc(m.detalle)}</span></a>`).join('\n        ')}
      </div>
    </div>
    <div class="fix__art" aria-hidden="true">
      <svg class="xpl" id="xpl" viewBox="0 0 600 560">
        <defs>
          <linearGradient id="gMetal" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#2A3563"/><stop offset="1" stop-color="#141B3D"/></linearGradient>
          <linearGradient id="gScreen" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stop-color="#2F5BFF"/><stop offset="1" stop-color="#0B2A8F"/></linearGradient>
          <linearGradient id="gPcb" x1="0" x2="1"><stop offset="0" stop-color="#0F6B4F"/><stop offset="1" stop-color="#0B4D3A"/></linearGradient>
        </defs>
        <g class="xpl__part" data-k="os" style="--dy:-70px">
          <rect x="120" y="40" width="360" height="225" rx="14" fill="url(#gMetal)" stroke="#3A4680"/>
          <rect x="134" y="54" width="332" height="197" rx="6" fill="url(#gScreen)"/>
          <g fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" opacity=".95"><circle cx="300" cy="148" r="34"/><path d="m284 149 11 11 21-23"/></g>
          <rect x="200" y="206" width="200" height="6" rx="3" fill="#fff" opacity=".35"/>
          <rect class="xpl__fill" x="200" y="206" width="140" height="6" rx="3" fill="#fff"/>
        </g>
        <g class="xpl__part" data-k="ram" style="--dy:-40px">
          <rect x="150" y="300" width="300" height="46" rx="4" fill="url(#gPcb)" stroke="#1E8F6A"/>
          <g fill="#0A0F24"><rect x="166" y="310" width="40" height="26" rx="2"/><rect x="216" y="310" width="40" height="26" rx="2"/><rect x="266" y="310" width="40" height="26" rx="2"/><rect x="316" y="310" width="40" height="26" rx="2"/><rect x="366" y="310" width="40" height="26" rx="2"/></g>
          <g fill="#E2B85C"><rect x="160" y="342" width="280" height="4"/></g>
        </g>
        <g class="xpl__part" data-k="ssd" style="--dy:-10px">
          <rect x="200" y="372" width="200" height="40" rx="4" fill="#0A0F24" stroke="#3A4680"/>
          <rect x="214" y="382" width="90" height="20" rx="2" fill="#2F5BFF"/>
          <text x="318" y="397" fill="#A7B0CC" font-size="12" font-family="Schibsted Grotesk, sans-serif" font-weight="600">SSD 1TB</text>
        </g>
        <g class="xpl__part" data-k="clean" style="--dy:20px">
          <path d="M70 470 L530 470 L560 500 Q560 512 548 512 L52 512 Q40 512 40 500 Z" fill="url(#gMetal)" stroke="#3A4680"/>
          <rect x="250" y="470" width="100" height="8" rx="4" fill="#0A0F24"/>
          <g class="xpl__dust" fill="#A7B0CC"><circle cx="120" cy="450" r="3"/><circle cx="180" cy="440" r="2"/><circle cx="430" cy="446" r="3"/><circle cx="480" cy="436" r="2"/><circle cx="300" cy="430" r="2"/></g>
        </g>
      </svg>
    </div>
  </div>
</section>

<section class="cases" id="casos">
  <h2 class="h2">${rich(d.clientes.titulo)}</h2>
  <div class="cases__row">
${d.clientes.lista.map((c) => `    <figure class="case">
      <button class="case__media"${c.video ? ` data-video="${esc(c.video)}"` : ''} aria-label="${c.video ? 'Ver video de ' : ''}${esc(c.nombre)}">
        <img loading="lazy" src="${esc(c.portada)}" alt="" width="540" height="960">
        ${c.video ? '<span class="play" aria-hidden="true"><svg viewBox="0 0 24 24"><use href="#i-play"/></svg></span>' : ''}
      </button>
      <figcaption><b>${esc(c.nombre)}</b><span>${esc(c.descripcion)}</span></figcaption>
    </figure>`).join('\n')}
  </div>
</section>

<section class="close" id="contacto">
  <h2 class="close__title">${rich(d.cierre.titulo)}</h2>
  <p class="lede">${rich(d.cierre.descripcion)}</p>
  <a class="btn btn--xl" href="${esc(wa(d.cierre.mensaje_whatsapp))}" ${ext()}>${ICON_WA} ${esc(d.contacto.whatsapp_visible)}</a>
</section>

</main>

<footer class="foot">
  <div class="foot__row">
    <div class="foot__brand">
      <img src="assets/img/logo-drc.webp" alt="DRC System" width="72" height="80">
      <p>${esc(d.general.texto_pie)}<br>${esc(d.general.hecho_en)}</p>
    </div>
    <ul class="foot__links">
      <li><a href="${esc(wa())}" ${ext()}>WhatsApp</a></li>
      <li><a href="${esc(d.contacto.instagram)}" ${ext()}>Instagram</a></li>
      <li><a href="#productos">Productos</a></li>
      <li><a href="#mantenimiento">Mantenimiento</a></li>
    </ul>
  </div>
  <p class="foot__word" aria-hidden="true">RODRIGUEZ&nbsp;IT</p>
  <p class="foot__legal">© ${esc(d.general.anio)} Rodriguez IT Solutions</p>
</footer>

<dialog class="vid" id="vid" aria-label="Video">
  <button class="vid__close" aria-label="Cerrar video"><svg viewBox="0 0 24 24"><use href="#i-x"/></svg></button>
  <video id="vidEl" controls playsinline preload="none"></video>
</dialog>

<svg width="0" height="0" style="position:absolute" aria-hidden="true">
  <symbol id="i-wa" viewBox="0 0 24 24"><path fill="currentColor" d="M12.04 2C6.58 2 2.13 6.450 2.130 11.910c0 1.750.46 3.450 1.320 4.950L2.050 22l5.250-1.380a9.900 9.900 0 0 0 4.740 1.210h.01c5.460 0 9.910-4.450 9.910-9.910 0-2.650-1.030-5.140-2.900-7.010A9.820 9.820 0 0 0 12.040 2Zm0 18.150h-.01a8.200 8.200 0 0 1-4.190-1.150l-.3-.18-3.120.82.83-3.040-.2-.31a8.200 8.200 0 0 1-1.260-4.380c0-4.540 3.700-8.240 8.250-8.240 2.200 0 4.270.86 5.830 2.420a8.180 8.180 0 0 1 2.410 5.830c0 4.540-3.700 8.230-8.240 8.230Zm4.520-6.160c-.25-.12-1.470-.72-1.700-.81-.23-.08-.39-.12-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.050-.39-1.990-1.230-.74-.66-1.230-1.470-1.380-1.720-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.13-.15.17-.25.25-.42.08-.17.04-.31-.02-.43-.06-.13-.56-1.340-.76-1.840-.2-.48-.41-.42-.56-.42h-.48c-.17 0-.43.06-.66.31-.23.25-.87.85-.87 2.070 0 1.220.89 2.400 1.010 2.560.12.17 1.750 2.670 4.230 3.740.59.26 1.050.41 1.410.52.59.19 1.130.16 1.560.1.48-.07 1.470-.6 1.670-1.180.21-.58.21-1.070.14-1.180-.06-.1-.22-.16-.47-.28Z"/></symbol>
  <symbol id="i-down" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M12 5v14m-6-6 6 6 6-6"/></symbol>
  <symbol id="i-lr" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="m9 6-6 6 6 6M15 6l6 6-6 6"/></symbol>
  <symbol id="i-play" viewBox="0 0 24 24"><path fill="currentColor" d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5Z"/></symbol>
  <symbol id="i-x" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" d="M6 6l12 12M18 6 6 18"/></symbol>
</svg>

<script>window.SITIO = ${JSON.stringify(datosJS).replace(/</g, '\\u003c')};</script>
<script src="js/main.js?v=${d.__ver}" defer></script>
</body>
</html>
`;
}
