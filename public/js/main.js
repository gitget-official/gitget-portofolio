/* gitget portfolio: meni, otkrivanje pri skrolu, kartice projekata, kontakt */
(function () {
  'use strict';

  var doc = document.documentElement;
  var reduceMq = window.matchMedia('(prefers-reduced-motion: reduce)');
  var t = function (k) { return window.gitgetI18n ? window.gitgetI18n.t(k) : k; };
  var lang = function () { return window.gitgetI18n ? window.gitgetI18n.lang() : 'en'; };

  /* ---------- Podaci o projektima ---------- */
  var PROJECTS = {
    myshishapedia: {
      name: 'MyShishapedia',
      live: 'https://myshishapedia.com',
      source: 'https://github.com/grabator/myshishapedia',
      tech: ['HTML', 'CSS', 'JavaScript', 'Cloudflare'],
      platforms: { en: ['Web', 'EN / BS'], bs: ['Web', 'EN / BS'] },
      hero: { base: 'myshishapedia-home', w: 1200, h: 750, alt: { en: 'MyShishapedia home page', bs: 'Početna stranica MyShishapedije' } },
      shots: [
        { base: 'myshishapedia-flavor', size: 800, w: 800, h: 500, cap: { en: 'Flavor page with tags and description', bs: 'Stranica okusa sa oznakama i opisom' } },
        { base: 'myshishapedia-mixer', size: 800, w: 800, h: 500, cap: { en: 'Mixer that blends two flavors', bs: 'Mikser koji miješa dva okusa' } },
        { base: 'myshishapedia-mobile', size: 300, w: 300, h: 649, cap: { en: 'Home page on a phone', bs: 'Početna stranica na mobitelu' } }
      ],
      sub: {
        en: 'A bilingual hookah flavor encyclopedia: what each flavor is made of, how strongly each ingredient comes through and what else you might like.',
        bs: 'Dvojezična enciklopedija okusa za nargilu: od čega je okus napravljen, koliko se koji sastojak osjeti i šta bi ti se još moglo svidjeti.'
      },
      features: {
        en: ['Ingredients and a flavor profile for every flavor', 'Side by side comparison of two flavors', 'Mixer that blends two flavors live', 'Quiz, mix recipes and a hookah preparation guide', 'Own static site generator, pure HTML, CSS and JavaScript without a framework'],
        bs: ['Sastojci i profil okusa za svaki okus', 'Poređenje dva okusa jedan pored drugog', 'Mikser koji uživo miješa dva okusa', 'Kviz, recepti miksova i vodič za pripremu nargile', 'Vlastiti generator statičnih stranica, čisti HTML, CSS i JavaScript bez frameworka']
      }
    },
    grabpoints: {
      name: 'GrabPoints',
      source: 'https://github.com/grabator/IB210176-seminarski-rs2',
      tech: ['.NET', 'Flutter', 'SQL Server', 'RabbitMQ', 'ONNX', 'Stripe', 'Firebase'],
      platforms: { en: ['Mobile', 'Desktop', 'REST API'], bs: ['Mobilna', 'Desktop', 'REST API'] },
      sub: {
        en: 'A Fantasy Premier League assistant that uses machine learning to predict points and suggest the captain and transfers.',
        bs: 'Pomoćnik za Fantasy Premier League koji uz mašinsko učenje predviđa bodove i predlaže kapitena i transfere.'
      },
      features: {
        en: ['Predicted points from three trained ONNX models (xPts, xG, xA)', 'Captain and transfer suggestions', 'Player statistics and planning gameweeks ahead', 'Premium subscription with Stripe', 'Push notifications through Firebase and a RabbitMQ worker service'],
        bs: ['Predviđeni bodovi iz tri istrenirana ONNX modela (xPts, xG, xA)', 'Prijedlozi kapitena i transfera', 'Statistike igrača i planiranje kola unaprijed', 'Premium pretplata preko Stripea', 'Push notifikacije preko Firebasea i RabbitMQ worker servisa']
      }
    },
    skipass: {
      name: 'SkiPass',
      source: 'https://github.com/tarikganic/skipass',
      tech: ['.NET', 'ASP.NET Core', 'Flutter', 'SQL Server', 'RabbitMQ', 'PayPal', 'Docker'],
      platforms: { en: ['REST API', 'Windows', 'Mobile'], bs: ['REST API', 'Windows', 'Mobilna'] },
      sub: {
        en: 'A system that takes a ski resort’s daily operations digital: a REST API, a Windows app for staff and a mobile app for skiers.',
        bs: 'Sistem za digitalizaciju poslovanja ski centra: REST API, Windows aplikacija za osoblje i mobilna aplikacija za skijaše.'
      },
      features: {
        en: ['Ticket purchase with PayPal and QR tickets scanned at the lift', 'Status of trails and lifts, with condition and maintenance logs', 'Incident reports with GPS location and a photo', 'Sales reports with charts, exported to PDF', 'Recommended extras based on what skiers buy and view'],
        bs: ['Kupovina karata uz PayPal i QR karte koje se skeniraju na liftu', 'Stanje staza i liftova, sa evidencijom uslova i održavanja', 'Prijava incidenata sa GPS lokacijom i fotografijom', 'Izvještaji o prodaji sa grafom, izvoz u PDF', 'Preporuke pogodnosti na osnovu kupovina i pregleda']
      }
    },
    clinicnow: {
      name: 'ClinicNow',
      source: 'https://github.com/Ibro02/clinic-managment-flutter-app',
      tech: ['.NET', 'ASP.NET Core', 'Flutter', 'SQL Server', 'RabbitMQ', 'ML.NET', 'PayPal', 'Docker'],
      platforms: { en: ['REST API', 'Windows', 'Android'], bs: ['REST API', 'Windows', 'Android'] },
      sub: {
        en: 'SaaS for small private clinics that handles appointments and patients, with a desktop app for staff and doctors and an Android app for patients.',
        bs: 'SaaS za male privatne klinike koji vodi termine i pacijente, sa desktop aplikacijom za osoblje i doktore i Android aplikacijom za pacijente.'
      },
      features: {
        en: ['Booking and rescheduling with availability checked on the server', 'Medical records, lab findings and specialist referrals', 'PayPal checkout and refunds', 'ML.NET recommendations with a clear reason for every suggestion', 'Push notifications and emails through a RabbitMQ worker service'],
        bs: ['Zakazivanje i pomjeranje termina uz provjeru dostupnosti na serveru', 'Medicinski karton, nalazi i uputnice', 'PayPal plaćanje i povrat novca', 'ML.NET preporuke, uz jasan razlog za svaki prijedlog', 'Push notifikacije i emailovi preko RabbitMQ worker servisa']
      }
    },
    vetnow: {
      name: 'VetNow',
      source: 'https://github.com/Ibro02/vetnow-angular-dotnet',
      tech: ['Angular', 'TypeScript', 'ASP.NET Core', 'EF Core', 'SQL Server', 'Tailwind', 'Leaflet', 'Flutter'],
      platforms: { en: ['Web', 'Mobile'], bs: ['Web', 'Mobilna'] },
      sub: {
        en: 'A booking and management platform for veterinary clinics: pet owners find a clinic on the map and book a free slot, staff run the clinic from a dashboard.',
        bs: 'Platforma za rezervaciju i upravljanje veterinarskim stanicama: vlasnici ljubimaca nađu kliniku na mapi i rezervišu slobodan termin, a osoblje vodi kliniku iz kontrolne table.'
      },
      features: {
        en: ['Clinic search on an interactive map', 'Booking, rescheduling and cancelling against real availability', 'Pet records and client profiles with email verification', 'Team roles, working hours and appointments for clinic staff', 'Clinic statistics and PDF documents'],
        bs: ['Pretraga klinika na interaktivnoj mapi', 'Rezervacija, pomjeranje i otkazivanje termina prema stvarnoj dostupnosti', 'Kartoni ljubimaca i profili klijenata sa potvrdom emaila', 'Tim, uloge, radno vrijeme i termini za osoblje klinike', 'Statistika klinike i PDF dokumenti']
      }
    }
  };

  function el(tag, attrs, children) {
    var n = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      if (k === 'text') n.textContent = attrs[k];
      else if (k === 'class') n.className = attrs[k];
      else n.setAttribute(k, attrs[k]);
    });
    (children || []).forEach(function (c) { if (c) n.appendChild(c); });
    return n;
  }

  function picture(base, size, w, h, alt, sizes) {
    var pic = el('picture');
    pic.appendChild(el('source', { type: 'image/avif', srcset: '/img/projects/' + base + '-' + size + '.avif' }));
    pic.appendChild(el('img', { src: '/img/projects/' + base + '-' + size + '.webp', width: w, height: h, alt: alt, loading: 'lazy', decoding: 'async' }));
    return pic;
  }

  /* ---------- Detalji projekta ---------- */
  var dialog = document.getElementById('project-dialog');
  var content = document.getElementById('pd-content');
  var lastOpener = null;
  var openId = null;

  function renderProject(id) {
    var p = PROJECTS[id];
    var L = lang();
    content.textContent = '';

    var hero;
    if (p.hero) {
      hero = el('div', { class: 'pd-hero' }, [picture(p.hero.base, p.hero.w, p.hero.w, p.hero.h, p.hero.alt[L])]);
    } else {
      var media = document.querySelector('[data-project="' + id + '"] .project-media');
      hero = media.cloneNode(true);
      hero.className = 'pd-hero ' + media.className.replace('project-media', '').trim();
      hero.setAttribute('aria-hidden', 'true');
    }
    content.appendChild(hero);

    var body = el('div', { class: 'pd-body' });
    body.appendChild(el('div', null, [
      el('h2', { id: 'pd-title', text: p.name }),
      el('p', { class: 'pd-sub', text: p.sub[L] })
    ]));
    body.appendChild(el('div', { class: 'pd-meta', 'aria-label': t('platforms') }, p.platforms[L].map(function (x) { return el('span', { text: x }); })));

    body.appendChild(el('div', null, [
      el('h3', { text: t('features') }),
      el('ul', { class: 'pd-features' }, p.features[L].map(function (f) { return el('li', { text: f }); }))
    ]));
    body.appendChild(el('div', null, [
      el('h3', { text: t('tech') }),
      el('ul', { class: 'tags' }, p.tech.map(function (x) { return el('li', { text: x }); }))
    ]));

    if (p.shots) {
      body.appendChild(el('div', null, [
        el('h3', { text: t('screens') }),
        el('div', { class: 'pd-shots' }, p.shots.map(function (s) {
          return el('figure', null, [picture(s.base, s.size, s.w, s.h, s.cap[L]), el('figcaption', { text: s.cap[L] })]);
        }))
      ]));
    } else {
      body.appendChild(el('p', { class: 'pd-note', text: t('noShots') }));
    }

    var links = el('div', { class: 'pd-links' });
    if (p.live) {
      var live = el('a', { class: 'btn btn-primary', href: p.live, target: '_blank', rel: 'noopener', text: t('live') });
      live.appendChild(el('span', { class: 'sr-only', text: t('newTab') }));
      links.appendChild(live);
    }
    var src = el('a', { class: 'btn btn-ghost', href: p.source, target: '_blank', rel: 'noopener' });
    src.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true" class="fill"><use href="#i-gh"/></svg>';
    src.appendChild(document.createTextNode(t('source')));
    src.appendChild(el('span', { class: 'sr-only', text: t('newTab') }));
    links.appendChild(src);
    body.appendChild(links);
    content.appendChild(body);
  }

  function openProject(id, opener) {
    if (!PROJECTS[id] || !dialog) return;
    lastOpener = opener || null;
    openId = id;
    renderProject(id);
    if (typeof dialog.showModal === 'function') dialog.showModal();
    else dialog.setAttribute('open', '');
    dialog.scrollTop = 0;
    document.dispatchEvent(new CustomEvent('projectopen', { detail: { id: id } }));
  }

  function closeProject() {
    if (!dialog || !dialog.open) return;
    dialog.close();
  }

  if (dialog) {
    dialog.addEventListener('close', function () {
      openId = null;
      if (lastOpener) lastOpener.focus();
    });
    dialog.addEventListener('click', function (e) {
      if (e.target === dialog) closeProject();
      if (e.target.closest('.pd-close')) closeProject();
    });
  }
  document.addEventListener('click', function (e) {
    var b = e.target.closest('.project-open');
    if (b) openProject(b.getAttribute('data-open'), b);
  });
  document.addEventListener('langchange', function () { if (openId) renderProject(openId); });
  window.gitgetOpenProject = openProject;

  /* ---------- Meni ---------- */
  var nav = document.getElementById('site-nav');
  var menuBtn = document.querySelector('.menu-btn');
  function setMenu(open) {
    if (!nav || !menuBtn) return;
    nav.classList.toggle('open', open);
    doc.classList.toggle('nav-open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', t(open ? 'menuClose' : 'menuOpen'));
  }
  if (menuBtn) {
    menuBtn.addEventListener('click', function () { setMenu(!nav.classList.contains('open')); });
    nav.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('open')) { setMenu(false); menuBtn.focus(); }
    });
    document.addEventListener('click', function (e) {
      if (nav.classList.contains('open') && !e.target.closest('#site-nav') && !e.target.closest('.menu-btn')) setMenu(false);
    });
    document.addEventListener('langchange', function () { menuBtn.setAttribute('aria-label', t(nav.classList.contains('open') ? 'menuClose' : 'menuOpen')); });
    window.matchMedia('(min-width: 1100px)').addEventListener('change', function () { setMenu(false); });
  }

  /* ---------- Header i aktivni link ---------- */
  var header = document.querySelector('.site-header');
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav a'));
  var sections = navLinks.map(function (a) { return document.querySelector(a.getAttribute('href')); });
  var steps = document.querySelector('.steps');
  var ticking = false;

  function onScroll() {
    ticking = false;
    var y = window.scrollY;
    if (header) header.classList.toggle('scrolled', y > 8);
    var line = window.innerHeight * 0.4;
    var active = -1;
    sections.forEach(function (s, i) {
      if (!s) return;
      var r = s.getBoundingClientRect();
      if (r.top <= line && r.bottom > line) active = i;
    });
    navLinks.forEach(function (a, i) {
      if (i === active) a.setAttribute('aria-current', 'true');
      else a.removeAttribute('aria-current');
    });
    if (steps) {
      var r = steps.getBoundingClientRect();
      var p = (window.innerHeight * 0.8 - r.top) / (r.height + window.innerHeight * 0.3);
      steps.style.setProperty('--p', Math.max(0, Math.min(1, p)).toFixed(3));
    }
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });
  onScroll();

  /* ---------- Otkrivanje pri skrolu ---------- */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduceMq.matches) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    /* kartice u istom redu dobiju malo zakašnjenje, da se pojave jedna za drugom */
    document.querySelectorAll('.projects, .services, .steps, .team').forEach(function (group) {
      Array.prototype.forEach.call(group.querySelectorAll(':scope > .reveal'), function (c, i) {
        c.style.setProperty('--rd', (i % 3) * 90 + 'ms');
      });
    });
    reveals.forEach(function (r) { io.observe(r); });
  } else {
    reveals.forEach(function (r) { r.classList.add('in'); });
  }

  /* ---------- Tilt kartica ---------- */
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  document.querySelectorAll('.project').forEach(function (card) {
    var raf = 0;
    card.addEventListener('pointermove', function (e) {
      if (!finePointer.matches || reduceMq.matches) return;
      var r = card.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width;
      var y = (e.clientY - r.top) / r.height;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(function () {
        card.classList.add('tilting');
        card.style.setProperty('--ry', ((x - 0.5) * 9).toFixed(2) + 'deg');
        card.style.setProperty('--rx', ((0.5 - y) * 7).toFixed(2) + 'deg');
        card.style.setProperty('--mx', (x * 100).toFixed(1) + '%');
        card.style.setProperty('--my', (y * 100).toFixed(1) + '%');
      });
    });
    card.addEventListener('pointerleave', function () {
      cancelAnimationFrame(raf);
      card.classList.remove('tilting');
      card.style.setProperty('--rx', '0deg');
      card.style.setProperty('--ry', '0deg');
    });
  });

  /* ---------- Čestice u heroju ---------- */
  var particles = document.querySelector('.particles');
  if (particles && !reduceMq.matches) {
    var frag = document.createDocumentFragment();
    var seed = 7;
    var rnd = function () { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
    for (var i = 0; i < 26; i++) {
      var star = i % 6 === 0;
      var p = document.createElement('i');
      if (star) p.className = 'star';
      p.style.setProperty('--x', (45 + rnd() * 55).toFixed(1) + '%');
      p.style.setProperty('--y', (star ? 30 + rnd() * 60 : rnd() * 40).toFixed(1) + '%');
      p.style.setProperty('--s', (star ? 10 + rnd() * 6 : 2 + rnd() * 3).toFixed(1) + 'px');
      p.style.setProperty('--t', (5.5 + rnd() * 4).toFixed(2) + 's');
      p.style.setProperty('--dl', (-rnd() * 8).toFixed(2) + 's');
      frag.appendChild(p);
    }
    particles.appendChild(frag);
  }

  /* ---------- Kopiranje emaila ---------- */
  var copyBtn = document.getElementById('copy-email');
  var copyStatus = document.getElementById('copy-status');
  if (copyBtn) {
    var copyTimer = 0;
    copyBtn.addEventListener('click', function () {
      var email = copyBtn.getAttribute('data-email');
      var done = function (ok) {
        copyStatus.textContent = t(ok ? 'copied' : 'copyFail');
        var label = copyBtn.querySelector('span');
        if (ok) {
          label.textContent = t('copiedBtn');
          clearTimeout(copyTimer);
          copyTimer = setTimeout(function () {
            label.textContent = lang() === 'bs' ? 'Kopiraj email' : 'Copy email';
            copyStatus.textContent = '';
          }, 2600);
        }
        document.dispatchEvent(new CustomEvent('emailcopied', { detail: { ok: ok } }));
      };
      var fallback = function () {
        var ta = document.createElement('textarea');
        ta.value = email; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.opacity = '0';
        document.body.appendChild(ta); ta.select();
        var ok = false;
        try { ok = document.execCommand('copy'); } catch (e) {}
        ta.remove(); done(ok);
      };
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(email).then(function () { done(true); }, fallback);
      } else fallback();
    });
  }

  /* ---------- Pauza kad tab nije vidljiv ---------- */
  document.addEventListener('visibilitychange', function () {
    doc.classList.toggle('paused', document.hidden);
  });

  var year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
