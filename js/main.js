/* ==========================================================================
   main.js
   Builds the whole page from window.SITE (js/config.js) and runs the
   animations. Libraries: Bootstrap, GSAP + ScrollTrigger, Lenis, vanilla-tilt.
   Every library is optional: if a CDN fails the page still works, just calmer.
   ========================================================================== */
(function () {
  'use strict';

  const S = window.SITE;
  if (!S) { console.error('[landing] js/config.js did not load'); return; }

  /* ---------- Helpers ---------- */
  const doc = document;
  const root = doc.documentElement;
  const $ = (s, c = doc) => c.querySelector(s);
  const $$ = (s, c = doc) => Array.from(c.querySelectorAll(s));

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const hasGsap = typeof window.gsap !== 'undefined';
  const hasST = hasGsap && typeof window.ScrollTrigger !== 'undefined';
  const hasBS = typeof window.bootstrap !== 'undefined';
  if (hasST) window.gsap.registerPlugin(window.ScrollTrigger);

  const brand = S.brand || {};
  const contact = S.contact || {};
  const copy = S.copy || {};
  const products = S.products || [];
  const collections = S.collections || [];
  const byId = {};
  products.forEach((p) => { byId[p.id] = p; });
  const DEFAULT_SIZES = ['S', 'M', 'L', 'XL', 'XXL'];

  const esc = (v) => String(v == null ? '' : v).replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));
  const rich = (v) => esc(v).replace(/\*(.+?)\*/g, '<em>$1</em>');   // *word* becomes emphasis
  const money = (n) => (S.currency || '') + Number(n).toLocaleString('en-US');
  const setHTML = (sel, html) => { const el = $(sel); if (el) el.innerHTML = html; return el; };
  const pageUrl = () => window.location.href.split('#')[0];

  const waNumber = String(contact.whatsapp || '').replace(/\D/g, '');
  const waLink = (text) => (waNumber
    ? 'https://wa.me/' + waNumber + '?text=' + encodeURIComponent(text || '')
    : '#contact');

  function orderLink(p, size) {
    const tpl = S.orderMessage || 'Hello {brand}, I want to order {product} ({size}) {price} {url}';
    const vals = {
      brand: brand.name, product: p.name, size: size || 'to be confirmed',
      price: money(p.price), url: pageUrl()
    };
    return waLink(tpl.replace(/\{(\w+)\}/g, (m, k) => (vals[k] !== undefined ? vals[k] : m)));
  }

  /* ---------- Theme from config ---------- */
  function hexToRgb(hex) {
    let h = String(hex || '').replace('#', '');
    if (h.length === 3) h = h.split('').map((c) => c + c).join('');
    if (!/^[0-9a-f]{6}$/i.test(h)) return null;
    const n = parseInt(h, 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }

  function applyTheme() {
    const t = S.theme || {};
    const light = t.mode === 'light';
    root.setAttribute('data-theme', light ? 'light' : 'dark');
    root.setAttribute('data-bs-theme', light ? 'light' : 'dark');

    const accent = t.accent || '#d8c3a0';
    const rgb = hexToRgb(accent);
    let onAccent = '#14110c';
    if (rgb) {
      const lum = (0.299 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2]) / 255;
      onAccent = lum > 0.55 ? '#14110c' : '#ffffff';
      root.style.setProperty('--accent', accent);
      root.style.setProperty('--accent-rgb', rgb.join(','));
      root.style.setProperty('--on-accent', onAccent);
    }
    root.style.setProperty('--logo-h', (brand.logoHeight || 30) + 'px');

    const seo = S.seo || {};
    doc.title = seo.title || [brand.name, brand.tagline].filter(Boolean).join(' | ');
    const md = $('meta[name="description"]');
    if (md) md.setAttribute('content', seo.description || '');
    const mt = $('meta[name="theme-color"]');
    if (mt) mt.setAttribute('content', light ? '#f4f0e8' : '#0a0a0b');

    let icon = $('link[rel="icon"]');
    if (!icon) { icon = doc.createElement('link'); icon.rel = 'icon'; doc.head.appendChild(icon); }
    if (brand.favicon) {
      icon.href = brand.favicon;
    } else {
      const letter = esc((brand.name || 'B').trim().charAt(0).toUpperCase());
      const svg = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'><rect width='64' height='64' rx='14' fill='" +
        accent + "'/><text x='32' y='45' font-family='Georgia,serif' font-size='38' text-anchor='middle' fill='" +
        onAccent + "'>" + letter + '</text></svg>';
      icon.href = 'data:image/svg+xml,' + encodeURIComponent(svg);
    }
  }

  /* ---------- Garment illustrations (used when a product has no photo) ---------- */
  const SHAPES = {
    shirt: {
      body: 'M62 28 L86 18 L100 44 L114 18 L138 28 L182 58 L164 96 L142 84 L142 218 Q100 228 58 218 L58 84 L36 96 L18 58 Z',
      lines: 'M86 18 L100 44 L114 18 M100 44 L100 221 M58 84 L64 40 M142 84 L136 40',
      dots: [[100, 70], [100, 100], [100, 130], [100, 160], [100, 190]]
    },
    pants: {
      body: 'M58 22 L142 22 L150 70 L156 226 L108 226 L100 92 L92 226 L44 226 L50 70 Z',
      lines: 'M58 34 L142 34 M100 34 L100 92 M80 34 L76 90 M120 34 L124 90 M58 40 Q70 52 70 70',
      dots: [[100, 28]]
    },
    jacket: {
      body: 'M66 24 L88 16 L100 38 L112 16 L134 24 L172 44 L188 196 L160 200 L142 104 L142 220 L58 220 L58 104 L40 200 L12 196 L28 44 Z',
      lines: 'M88 16 L100 38 L112 16 M100 38 L100 220 M68 150 H92 V174 H68 Z M108 150 H132 V174 H108 Z',
      dots: [[100, 66], [100, 96], [100, 126], [100, 156], [100, 186]]
    },
    sweater: {
      body: 'M80 14 Q100 8 120 14 L122 34 L168 52 L186 190 L158 196 L142 108 L142 218 Q100 228 58 218 L58 108 L42 196 L14 190 L32 52 L78 34 Z',
      lines: 'M80 22 H120 M80 28 H120 M58 208 H142 M44 186 L16 182 M156 186 L184 182',
      dots: []
    },
    panjabi: {
      body: 'M72 20 Q100 36 128 20 L164 44 L184 132 L158 138 L144 84 L148 234 L52 234 L56 84 L42 138 L16 132 L36 44 Z',
      lines: 'M72 20 Q100 36 128 20 M100 34 L100 100 M52 234 L54 200 M148 234 L146 200',
      dots: [[100, 48], [100, 62], [100, 76], [100, 90]]
    }
  };

  let svgUid = 0;
  function garment(type, color) {
    const s = SHAPES[type] || SHAPES.shirt;
    const id = 'gd' + (++svgUid);
    const dots = (s.dots || []).map((d) => '<circle cx="' + d[0] + '" cy="' + d[1] + '" r="1.9" fill="rgba(0,0,0,.45)"/>').join('');
    return '<svg class="garment" viewBox="0 0 200 240" aria-hidden="true" focusable="false">' +
      '<defs><linearGradient id="' + id + '" x1="0" y1="0" x2="1" y2="1">' +
      '<stop offset="0" stop-color="#fff" stop-opacity=".26"/>' +
      '<stop offset=".48" stop-color="#fff" stop-opacity="0"/>' +
      '<stop offset="1" stop-color="#000" stop-opacity=".42"/></linearGradient></defs>' +
      '<path d="' + s.body + '" fill="' + esc(color) + '" stroke="rgba(255,255,255,.16)" stroke-width="1"/>' +
      '<path d="' + s.body + '" fill="url(#' + id + ')"/>' +
      '<path d="' + s.lines + '" fill="none" stroke="rgba(255,255,255,.14)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" transform="translate(.7 .7)"/>' +
      '<path d="' + s.lines + '" fill="none" stroke="rgba(0,0,0,.38)" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>' +
      dots + '</svg>';
  }

  const media = (item) => (item.img
    ? '<img src="' + esc(item.img) + '" alt="' + esc(item.name) + '" loading="lazy" decoding="async">'
    : garment(item.type, item.color));

  /* ---------- Render: brand, nav, hero ---------- */
  const brandHTML = () => (brand.logo
    ? '<img src="' + esc(brand.logo) + '" alt="' + esc(brand.name) + '">'
    : '<span class="brand-text">' + esc(brand.name) + '</span>');

  function sectionHead(h) {
    if (!h) return '';
    return (h.eyebrow ? '<p class="eyebrow">' + esc(h.eyebrow) + '</p>' : '') +
      '<h2 class="section-title">' + rich(h.title) + '</h2>' +
      (h.text ? '<p class="section-sub">' + esc(h.text) + '</p>' : '');
  }

  function splitChars(text) {
    return String(text).split(' ').map((word) =>
      '<span class="word">' + Array.from(word).map((ch) => '<span class="ch">' + esc(ch) + '</span>').join('') + '</span>'
    ).join(' ');
  }

  function renderShell() {
    setHTML('#preBrand', brandHTML());
    setHTML('#navBrand', brandHTML());
    setHTML('#menuBrand', brandHTML());

    const nav = S.nav || [];
    setHTML('#navLinks', nav.map((l) => '<a href="' + esc(l.href) + '">' + esc(l.label) + '</a>').join(''));
    setHTML('#menuLinks', nav.map((l) => '<a href="' + esc(l.href) + '"><span>' + esc(l.label) + '</span><i class="bi bi-arrow-up-right"></i></a>').join(''));

    const hello = waLink('Hello ' + (brand.name || '') + ', I have a question.');
    ['#navWa', '#fabWa'].forEach((sel) => { const a = $(sel); if (a) a.href = hello; });

    const mc = [];
    if (contact.phone) mc.push('<a href="tel:' + esc(String(contact.phone).replace(/[^+\d]/g, '')) + '"><i class="bi bi-telephone"></i>' + esc(contact.phone) + '</a>');
    if (contact.email) mc.push('<a href="mailto:' + esc(contact.email) + '"><i class="bi bi-envelope"></i>' + esc(contact.email) + '</a>');
    setHTML('#menuContact', mc.join(''));

    /* hero */
    const h = S.hero || {};
    const lines = h.title || [brand.name];
    setHTML('#heroEyebrow', esc(h.eyebrow || ''));
    const title = $('#heroTitle');
    if (title) {
      title.setAttribute('aria-label', lines.join(' '));
      title.innerHTML = lines.map((l, i) =>
        '<span class="line" aria-hidden="true"><span class="line-in' + (i === 1 ? ' is-outline' : '') + '">' + splitChars(l) + '</span></span>'
      ).join('');
    }
    setHTML('#heroSub', esc(h.text || ''));

    const cta = [];
    if (h.primary) cta.push('<a class="btn-brand magnetic" href="' + esc(h.primary.href) + '">' + esc(h.primary.label) + '<i class="bi bi-arrow-right"></i></a>');
    if (h.secondary) {
      const isWa = h.secondary.href === 'whatsapp';
      cta.push('<a class="btn-ghost magnetic" href="' + esc(isWa ? hello : h.secondary.href) + '"' + (isWa ? ' target="_blank" rel="noopener"' : '') + '><i class="bi bi-whatsapp"></i>' + esc(h.secondary.label) + '</a>');
    }
    setHTML('#heroCta', cta.join(''));
    setHTML('#heroPoints', (h.points || []).map((p) => '<li><i class="bi ' + esc(p.icon) + '"></i>' + esc(p.text) + '</li>').join(''));

    /* marquee: two identical groups so the loop is seamless */
    const group = '<div class="marquee-group">' + (S.marquee || []).map((t) => '<span>' + esc(t) + '</span><i class="bi bi-asterisk"></i>').join('') + '</div>';
    setHTML('#marquee', group + group);
  }

  /* ---------- Render: collections ---------- */
  function renderCollections() {
    setHTML('#collectionsHead', sectionHead(copy.collections));
    setHTML('#collectionGrid', collections.map((c) => {
      const count = products.filter((p) => p.category === c.id).length;
      const sample = products.find((p) => p.category === c.id && p.img);
      return '<div class="col-6 col-lg-3">' +
        '<a href="#shop" class="collection-card js-tilt" data-filter="' + esc(c.id) + '" style="--c:' + esc(c.color) + '" aria-label="' + esc(c.name) + ', ' + count + ' pieces">' +
        '<span class="cc-bg"></span>' +
        '<span class="cc-garment">' + (sample ? media(sample) : garment(c.type, c.color)) + '</span>' +
        '<span class="cc-label"><small>' + count + (count === 1 ? ' piece' : ' pieces') + '</small><strong>' + esc(c.name) + '</strong></span>' +
        '<span class="cc-arrow"><i class="bi bi-arrow-up-right"></i></span>' +
        '</a></div>';
    }).join(''));
  }

  /* ---------- Render: shop, filters, modal ---------- */
  let activeFilter = 'all';

  function productCard(p) {
    const tag = p.badge ? '<span class="badge-tag' + (/sale/i.test(p.badge) ? ' is-sale' : '') + '">' + esc(p.badge) + '</span>' : '';
    const cat = (collections.find((c) => c.id === p.category) || {}).name || '';
    return '<div class="col-6 col-md-4 col-xl-3 product-col">' +
      '<article class="product-card js-tilt" data-open="' + esc(p.id) + '" tabindex="0" role="button" aria-label="' + esc(p.name) + ', ' + esc(money(p.price)) + '">' +
      '<div class="product-media">' + tag + media(p) + '</div>' +
      '<div class="product-body">' +
      '<p class="product-cat">' + esc(cat) + '</p>' +
      '<h3 class="product-name">' + esc(p.name) + '</h3>' +
      '<div class="price-row">' +
      '<div class="price"><b>' + esc(money(p.price)) + '</b>' + (p.oldPrice ? '<s>' + esc(money(p.oldPrice)) + '</s>' : '') + '</div>' +
      '<a class="btn-icon quick" data-stop href="' + esc(orderLink(p)) + '" target="_blank" rel="noopener" aria-label="Order ' + esc(p.name) + ' on WhatsApp"><i class="bi bi-whatsapp"></i></a>' +
      '</div></div></article></div>';
  }

  function initTilt(nodes, opts) {
    if (!window.VanillaTilt || !finePointer || reduced || !nodes.length) return;
    window.VanillaTilt.init(nodes, Object.assign({
      max: 9, speed: 600, scale: 1.02, perspective: 1100, glare: true, 'max-glare': 0.2
    }, opts || {}));
  }

  function renderProducts(animate) {
    const grid = $('#productGrid');
    if (!grid) return;
    const list = activeFilter === 'all' ? products : products.filter((p) => p.category === activeFilter);
    grid.innerHTML = list.map(productCard).join('');
    setHTML('#shopCount', list.length + (list.length === 1 ? ' piece' : ' pieces'));
    initTilt($$('.js-tilt', grid));
    if (animate && hasGsap && !reduced) {
      window.gsap.fromTo($$('.product-col', grid), { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, stagger: 0.05, ease: 'power3.out', clearProps: 'transform,opacity' });
    }
    if (hasST) requestAnimationFrame(() => window.ScrollTrigger.refresh());
  }

  function renderShop() {
    setHTML('#shopHead', sectionHead(copy.shop));
    const chips = [{ id: 'all', name: 'All' }].concat(collections);
    setHTML('#filters', chips.map((c) =>
      '<button type="button" class="chip' + (c.id === 'all' ? ' is-active' : '') + '" data-chip="' + esc(c.id) + '" role="tab" aria-selected="' + (c.id === 'all') + '">' + esc(c.name) + '</button>'
    ).join(''));
    renderProducts(false);
  }

  function setFilter(id) {
    activeFilter = id;
    $$('.chip').forEach((c) => {
      const on = c.dataset.chip === id;
      c.classList.toggle('is-active', on);
      c.setAttribute('aria-selected', String(on));
    });
    renderProducts(true);
  }

  let modal = null;
  let current = null;
  let currentSize = '';

  function updateOrder() {
    const a = $('#pmOrder');
    if (a && current) a.href = orderLink(current, currentSize);
  }

  function openProduct(id) {
    const p = byId[id];
    if (!p) return;
    current = p;
    const sizes = p.sizes || DEFAULT_SIZES;
    currentSize = sizes[Math.min(1, sizes.length - 1)];

    setHTML('#pmMedia', media(p));
    setHTML('#pmCat', esc((collections.find((c) => c.id === p.category) || {}).name || ''));
    setHTML('#pmTitle', esc(p.name));
    setHTML('#pmPrice', '<b>' + esc(money(p.price)) + '</b>' + (p.oldPrice ? '<s>' + esc(money(p.oldPrice)) + '</s>' : ''));
    setHTML('#pmDesc', esc(p.desc || S.defaultDescription || ''));
    setHTML('#pmSizes', sizes.map((s) =>
      '<button type="button" class="size' + (s === currentSize ? ' is-active' : '') + '" data-size="' + esc(s) + '" role="radio" aria-checked="' + (s === currentSize) + '">' + esc(s) + '</button>'
    ).join(''));
    const call = $('#pmCall');
    if (call) {
      if (contact.phone) { call.href = 'tel:' + String(contact.phone).replace(/[^+\d]/g, ''); call.hidden = false; } else { call.hidden = true; }
    }
    updateOrder();

    if (hasBS) {
      if (!modal) modal = new window.bootstrap.Modal($('#productModal'));
      modal.show();
    } else {
      window.open(orderLink(p, currentSize), '_blank', 'noopener');
    }
  }

  /* ---------- Render: story, perks, reviews, contact, footer ---------- */
  function renderStory() {
    const st = S.story;
    const sec = $('#story');
    if (!st || !sec) { if (sec) sec.hidden = true; return; }
    const p = byId[st.product] || products[0] || { type: 'shirt', color: '#999', name: '' };
    setHTML('#storyFront', media(p));
    setHTML('#storyBack',
      brandHTML() + '<h3>' + esc(st.backTitle || '') + '</h3><p>' + esc(st.backText || '') + '</p>');
    setHTML('#storyCopy',
      (st.eyebrow ? '<p class="eyebrow">' + esc(st.eyebrow) + '</p>' : '') +
      '<h2 class="section-title">' + rich(st.title) + '</h2>' +
      '<p class="section-sub">' + esc(st.text) + '</p>' +
      '<ul class="story-list">' + (st.features || []).map((f) =>
        '<li class="story-item"><span class="ic"><i class="bi ' + esc(f.icon) + '"></i></span><div><h3>' + esc(f.title) + '</h3><p>' + esc(f.text) + '</p></div></li>'
      ).join('') + '</ul>' +
      (st.cta ? '<a class="btn-brand story-cta magnetic" href="#shop" data-filter="' + esc(st.cta.filter || 'all') + '">' + esc(st.cta.label) + '<i class="bi bi-arrow-right"></i></a>' : ''));
  }

  function renderPerks() {
    setHTML('#perksHead', sectionHead(copy.perks));
    setHTML('#perkGrid', (S.perks || []).map((p) =>
      '<div class="col-6 col-lg-3"><div class="perk"><i class="bi ' + esc(p.icon) + '"></i><h3>' + esc(p.title) + '</h3><p>' + esc(p.text) + '</p></div></div>'
    ).join(''));
  }

  function renderReviews() {
    const t = S.testimonials || {};
    const sec = $('#reviews');
    if (!sec) return;
    if (!t.enabled || !(t.items || []).length) { sec.hidden = true; return; }
    sec.hidden = false;
    setHTML('#reviewsHead', sectionHead(copy.reviews));
    setHTML('#reviewGrid', t.items.map((r) => {
      const stars = '<i class="bi bi-star-fill"></i>'.repeat(Math.max(0, Math.min(5, r.rating || 5)));
      return '<div class="col-md-6 col-lg-4"><figure class="review m-0"><div class="stars">' + stars + '</div><p>' + esc(r.text) + '</p><small>' + esc(r.name) + (r.place ? ', ' + esc(r.place) : '') + '</small></figure></div>';
    }).join(''));
  }

  function renderContact() {
    const c = copy.cta || {};
    setHTML('#ctaTitle', rich(c.title || ''));
    setHTML('#ctaText', esc(c.text || ''));
    const acts = [];
    if (waNumber) acts.push('<a class="btn-brand magnetic" href="' + esc(waLink('Hello ' + (brand.name || '') + ', I would like to place an order.')) + '" target="_blank" rel="noopener"><i class="bi bi-whatsapp"></i>Chat on WhatsApp</a>');
    if (contact.phone) acts.push('<a class="btn-ghost magnetic" href="tel:' + esc(String(contact.phone).replace(/[^+\d]/g, '')) + '"><i class="bi bi-telephone"></i>Call us</a>');
    if (contact.email) acts.push('<a class="btn-ghost magnetic" href="mailto:' + esc(contact.email) + '"><i class="bi bi-envelope"></i>Email</a>');
    if (contact.messenger) acts.push('<a class="btn-ghost magnetic" href="https://m.me/' + esc(contact.messenger) + '" target="_blank" rel="noopener"><i class="bi bi-messenger"></i>Messenger</a>');
    setHTML('#ctaActions', acts.join(''));
  }

  function renderFooter() {
    const social = Object.assign({}, S.social || {});
    if (waNumber) social.whatsapp = 'https://wa.me/' + waNumber;
    const icons = { facebook: 'bi-facebook', instagram: 'bi-instagram', youtube: 'bi-youtube', tiktok: 'bi-tiktok', x: 'bi-twitter-x', linkedin: 'bi-linkedin', whatsapp: 'bi-whatsapp' };
    const socials = Object.keys(social).filter((k) => social[k] && icons[k]).map((k) =>
      '<a class="btn-icon" href="' + esc(social[k]) + '" target="_blank" rel="noopener" aria-label="' + esc(k) + '"><i class="bi ' + icons[k] + '"></i></a>'
    ).join('');

    setHTML('#footerBrand', '<a class="brand" href="#top">' + brandHTML() + '</a><p>' + esc((S.footer || {}).about || brand.tagline || '') + '</p><div class="socials">' + socials + '</div>');
    setHTML('#footerShop', '<h4>Shop</h4>' + collections.map((c) => '<a href="#shop" data-filter="' + esc(c.id) + '">' + esc(c.name) + '</a>').join(''));
    setHTML('#footerHelp', '<h4>Help</h4>' + ((S.footer || {}).help || []).map((l) => '<a href="' + esc(l.href) + '">' + esc(l.label) + '</a>').join(''));

    const ci = [];
    if (contact.address) ci.push('<span class="line-item"><i class="bi bi-geo-alt"></i>' + esc(contact.address) + '</span>');
    if (contact.phone) ci.push('<a href="tel:' + esc(String(contact.phone).replace(/[^+\d]/g, '')) + '"><i class="bi bi-telephone"></i>' + esc(contact.phone) + '</a>');
    if (contact.email) ci.push('<a href="mailto:' + esc(contact.email) + '"><i class="bi bi-envelope"></i>' + esc(contact.email) + '</a>');
    setHTML('#footerContact', '<h4>Contact</h4>' + ci.join(''));

    const word = $('#footerWord');
    if (word) {
      word.textContent = brand.name || '';
      const len = Math.max(4, (brand.name || '').length);
      word.style.fontSize = 'min(14rem, calc(88vw / ' + (len * 0.74).toFixed(2) + '))';
    }
    setHTML('#footerBottom', '<span>&copy; ' + new Date().getFullYear() + ' ' + esc(brand.name || '') + '. All rights reserved.</span><span>' + esc(brand.tagline || '') + '</span>');
  }

  /* ---------- Smooth scroll (Lenis) ---------- */
  let lenis = null;
  function initLenis() {
    if (!window.Lenis || reduced) return;
    lenis = new window.Lenis({ lerp: 0.1, smoothWheel: true });
    if (hasST) {
      lenis.on('scroll', window.ScrollTrigger.update);
      window.gsap.ticker.add((t) => lenis.raf(t * 1000));
      window.gsap.ticker.lagSmoothing(0);
    } else {
      const raf = (t) => { lenis.raf(t); requestAnimationFrame(raf); };
      requestAnimationFrame(raf);
    }
  }

  function navOffset() { return (parseInt(getComputedStyle(root).getPropertyValue('--nav-h'), 10) || 72) - 1; }

  function scrollToHash(hash) {
    if (hash === '#top' || hash === '#') {
      if (lenis) lenis.scrollTo(0); else window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
      return;
    }
    const target = $(hash);
    if (!target) return;
    if (lenis) lenis.scrollTo(target, { offset: -navOffset() });
    else window.scrollTo({ top: target.getBoundingClientRect().top + window.pageYOffset - navOffset(), behavior: reduced ? 'auto' : 'smooth' });
  }

  /* ---------- Hero 3D ring ---------- */
  const ringApi = { intro: 0 };

  function initRing() {
    const stage = $('#stage');
    const ring = $('#ring');
    if (!stage || !ring) return;

    let list = products.filter((p) => p.featured);
    if (list.length < 5) list = list.concat(products.filter((p) => !p.featured));
    list = list.slice(0, 8);
    if (list.length < 3) { stage.style.display = 'none'; return; }

    ring.innerHTML = list.map((p) =>
      '<div class="ring-item"><button type="button" class="ring-card" data-open="' + esc(p.id) + '" aria-label="' + esc(p.name) + '">' +
      '<span class="rc-media">' + media(p) + '</span>' +
      '<span class="rc-info"><strong>' + esc(p.name) + '</strong><span>' + esc(money(p.price)) + '</span></span></button></div>'
    ).join('');

    const items = $$('.ring-item', ring);
    const n = items.length;

    function layout() {
      const w = items[0].offsetWidth || 160;
      const radius = Math.round((w / 2) / Math.tan(Math.PI / n)) + Math.max(18, w * 0.16);
      items.forEach((el, i) => { el.style.transform = 'rotateY(' + ((360 / n) * i) + 'deg) translateZ(' + radius + 'px)'; });
      stage.style.setProperty('--radius-3d', radius + 'px');
    }
    layout();
    window.addEventListener('resize', layout);

    const BASE = reduced ? 0 : 16;           // degrees per second
    let angle = 0, v = BASE, tilt = -5, tiltTarget = -5;
    let dragging = false, lastX = 0, lastT = 0, moved = 0, suppress = false, visible = true;

    stage.addEventListener('pointerdown', (e) => {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      dragging = true; moved = 0; lastX = e.clientX; lastT = performance.now();
      stage.classList.add('is-drag');
    });
    window.addEventListener('pointermove', (e) => {
      if (dragging) {
        const now = performance.now();
        const dx = e.clientX - lastX;
        const dt = Math.max(1, now - lastT) / 1000;
        moved += Math.abs(dx);
        angle += dx * 0.4;
        v = Math.max(-420, Math.min(420, (dx * 0.4) / dt));
        lastX = e.clientX; lastT = now;
      } else if (e.pointerType === 'mouse') {
        tiltTarget = -5 - ((e.clientY / window.innerHeight) - 0.5) * 14;
      }
    });
    const endDrag = () => {
      if (!dragging) return;
      dragging = false;
      stage.classList.remove('is-drag');
      if (moved > 6) { suppress = true; setTimeout(() => { suppress = false; }, 60); }
    };
    window.addEventListener('pointerup', endDrag);
    window.addEventListener('pointercancel', endDrag);
    stage.addEventListener('click', (e) => { if (suppress) { e.preventDefault(); e.stopPropagation(); } }, true);

    if ('IntersectionObserver' in window) {
      new IntersectionObserver((en) => { visible = en[0].isIntersecting; }).observe(stage);
    }

    let last = performance.now();
    function frame(now) {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (visible) {
        if (!dragging) { v += (BASE - v) * Math.min(1, dt * 1.8); angle += v * dt; }
        tilt += (tiltTarget - tilt) * Math.min(1, dt * 4);
        ring.style.transform = 'rotateX(' + tilt.toFixed(2) + 'deg) rotateY(' + (angle + ringApi.intro).toFixed(2) + 'deg)';
      }
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  /* ---------- Pinned 3D story ---------- */
  function initStory() {
    const sec = $('#story');
    const obj = $('#storyObject');
    if (!sec || sec.hidden || !obj) return;
    const items = $$('.story-item', sec);
    const n = items.length;
    const setActive = (i) => items.forEach((el, k) => el.classList.toggle('is-active', k === i));
    setActive(0);
    if (!hasST || reduced || !n) { items.forEach((el) => el.classList.add('is-active')); return; }

    const mm = window.gsap.matchMedia();
    const build = (pin) => {
      window.gsap.fromTo(obj, { rotationY: 0, rotationX: 7 }, {
        rotationY: 360, rotationX: -5, ease: 'none',
        scrollTrigger: {
          trigger: sec,
          start: pin ? 'top top' : 'top 70%',
          end: pin ? '+=130%' : 'bottom 30%',
          scrub: 0.6,
          pin: pin,
          anticipatePin: 1,
          onUpdate: (self) => setActive(Math.min(n - 1, Math.floor(self.progress * n)))
        }
      });
    };
    mm.add('(min-width: 992px)', () => build(true));
    mm.add('(max-width: 991.98px)', () => build(false));
  }

  /* ---------- Scroll reveals & parallax ---------- */
  function initReveals() {
    if (!hasST || reduced) return;
    const g = window.gsap;
    g.utils.toArray('[data-reveal]').forEach((el) => {
      g.from(el, { y: 44, opacity: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 90%', once: true } });
    });
    g.utils.toArray('[data-stagger]').forEach((group) => {
      if (!group.children.length) return;
      g.from(group.children, { y: 54, opacity: 0, scale: 0.97, duration: 0.9, stagger: 0.08, ease: 'power3.out', scrollTrigger: { trigger: group, start: 'top 88%', once: true } });
    });
    g.to('.hero-bg', { yPercent: 18, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    g.to('.hero-copy', { y: -50, opacity: 0.25, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
  }

  /* ---------- Hero intro (runs once the preloader is gone) ---------- */
  function intro() {
    if (!hasGsap || reduced) return;
    const g = window.gsap;
    const tl = g.timeline({ defaults: { ease: 'power3.out' } });
    tl.from('.site-nav .container', { y: -26, opacity: 0, duration: 0.8 }, 0)
      .from('.hero .eyebrow', { y: 18, opacity: 0, duration: 0.7 }, 0.1)
      .from('.hero-title .ch', { yPercent: 110, rotationX: -80, opacity: 0, transformOrigin: '50% 100%', duration: 1, stagger: 0.025 }, 0.15)
      .from('.hero-sub', { y: 22, opacity: 0, duration: 0.8 }, 0.7)
      .from('.hero-cta > *', { y: 22, opacity: 0, duration: 0.8, stagger: 0.1 }, 0.8)
      .from('.hero-points li', { y: 14, opacity: 0, duration: 0.6, stagger: 0.08 }, 1)
      .from('.stage', { scale: 0.72, opacity: 0, duration: 1.4, ease: 'expo.out' }, 0.25);
    g.fromTo(ringApi, { intro: -240 }, { intro: 0, duration: 2.4, ease: 'expo.out' });
  }

  /* ---------- Small interactions ---------- */
  function initMagnetic() {
    if (!finePointer || reduced) return;
    $$('.magnetic').forEach((el) => {
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - (r.left + r.width / 2)) * 0.22;
        const y = (e.clientY - (r.top + r.height / 2)) * 0.3;
        el.style.transform = 'translate(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px)';
      });
      el.addEventListener('pointerleave', () => { el.style.transform = ''; });
    });
  }

  function initScrollUI() {
    const nav = $('#siteNav');
    const bar = $('#progressBar');
    const top = $('#fabTop');
    let lastY = window.pageYOffset;
    const menu = $('#menu');

    function onScroll() {
      const y = window.pageYOffset;
      const max = Math.max(1, doc.documentElement.scrollHeight - window.innerHeight);
      if (nav) {
        nav.classList.toggle('is-scrolled', y > 30);
        const menuOpen = menu && menu.classList.contains('show');
        if (y > lastY + 6 && y > 420 && !menuOpen) nav.classList.add('is-hidden');
        else if (y < lastY - 6 || y < 420) nav.classList.remove('is-hidden');
      }
      if (bar) bar.style.transform = 'scaleX(' + Math.min(1, y / max).toFixed(4) + ')';
      if (top) top.classList.toggle('is-visible', y > 900);
      lastY = y;
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    if (top) top.addEventListener('click', () => scrollToHash('#top'));
  }

  function initEvents() {
    doc.addEventListener('click', (e) => {
      if (e.target.closest('[data-stop]')) return;

      const filterLink = e.target.closest('[data-filter]');
      if (filterLink) {
        e.preventDefault();
        const menu = $('#menu');
        if (hasBS && menu && menu.classList.contains('show')) window.bootstrap.Offcanvas.getInstance(menu).hide();
        setFilter(filterLink.dataset.filter);
        setTimeout(() => scrollToHash('#shop'), menu && menu.classList.contains('show') ? 350 : 0);
        return;
      }

      const chip = e.target.closest('[data-chip]');
      if (chip) { setFilter(chip.dataset.chip); return; }

      const size = e.target.closest('[data-size]');
      if (size) {
        currentSize = size.dataset.size;
        $$('#pmSizes .size').forEach((b) => {
          const on = b === size;
          b.classList.toggle('is-active', on);
          b.setAttribute('aria-checked', String(on));
        });
        updateOrder();
        return;
      }

      const opener = e.target.closest('[data-open]');
      if (opener) { e.preventDefault(); openProduct(opener.dataset.open); return; }

      const a = e.target.closest('a[href^="#"]');
      if (a) {
        const h = a.getAttribute('href');
        if (!h || h === '#') { e.preventDefault(); return; }
        e.preventDefault();
        const menu = a.closest('#menu');
        if (menu && hasBS) {
          window.bootstrap.Offcanvas.getInstance(menu).hide();
          setTimeout(() => scrollToHash(h), 350);
        } else {
          scrollToHash(h);
        }
      }
    });

    doc.addEventListener('keydown', (e) => {
      if ((e.key === 'Enter' || e.key === ' ') && e.target.matches && e.target.matches('.product-card')) {
        e.preventDefault();
        openProduct(e.target.dataset.open);
      }
    });

    ['#productModal', '#menu'].forEach((sel) => {
      const el = $(sel);
      if (!el) return;
      el.addEventListener('show.bs.modal', () => { if (lenis) lenis.stop(); });
      el.addEventListener('hidden.bs.modal', () => { if (lenis) lenis.start(); });
      el.addEventListener('show.bs.offcanvas', () => { if (lenis) lenis.stop(); });
      el.addEventListener('hidden.bs.offcanvas', () => { if (lenis) lenis.start(); });
    });
  }

  /* ---------- Preloader ---------- */
  function initPreloader() {
    const pre = $('#preloader');
    if (!pre) { doc.body.classList.remove('is-loading'); intro(); return; }
    requestAnimationFrame(() => pre.classList.add('is-run'));
    const started = performance.now();
    let launched = false;
    function launch() {
      if (launched) return;
      launched = true;
      const wait = Math.max(0, 1100 - (performance.now() - started));
      setTimeout(() => {
        pre.classList.add('is-done');
        doc.body.classList.remove('is-loading');
        if (hasST) window.ScrollTrigger.refresh();
        intro();
        setTimeout(() => pre.remove(), 900);
      }, wait);
    }
    if (doc.readyState === 'complete') launch(); else window.addEventListener('load', launch);
    setTimeout(launch, 4000);   // never get stuck on a slow CDN
  }

  /* ---------- Boot ---------- */
  applyTheme();
  renderShell();
  renderCollections();
  renderShop();
  renderStory();
  renderPerks();
  renderReviews();
  renderContact();
  renderFooter();

  initLenis();
  initEvents();
  initScrollUI();
  initRing();
  initTilt($$('#collectionGrid .js-tilt'), { max: 12, scale: 1.03 });
  initMagnetic();
  initReveals();
  initStory();
  initPreloader();
})();
