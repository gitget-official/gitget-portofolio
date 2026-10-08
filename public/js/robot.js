/*
 * gitget robotić vodič.
 *
 * Isti lik kao na gitget banneru (iste koordinate), rastavljen na dijelove koji se
 * zasebno animiraju: glava (lažni 3D okret), oči (treptanje, praćenje kursora),
 * antena (sjaj), ruke (mahanje, pokazivanje) i noge (hodanje).
 *
 * Gdje stoji:
 *  - u heroju stoji na "bini" (desna kolona), velik;
 *  - na širokim ekranima (>= 1200px) hoda između lijeve i desne bočne trake,
 *    koje su prazne jer je sadržaj sužen za njihovu širinu;
 *  - na manjim ekranima sjedi u donjoj traci, a oblačić je tekst u toj traci.
 * Animira se samo transform i opacity, jednom requestAnimationFrame petljom
 * koja staje kad tab nije vidljiv. Uz prefers-reduced-motion stoji miran.
 */
(function () {
  'use strict';

  var doc = document.documentElement;
  var reduceMq = window.matchMedia('(prefers-reduced-motion: reduce)');
  var fineMq = window.matchMedia('(hover: hover) and (pointer: fine)');
  var LANES_MIN = 1200;

  var LINES = {
    en: {
      hero: 'Hi! I’m the gitget bot. Scroll and I’ll show you around.',
      projects: 'These are our projects. Click a card!',
      services: 'From idea to launch, we do it all.',
      process: 'Four steps, no surprises.',
      team: 'Meet the team behind gitget.',
      tech: 'Our favorite tools.',
      contact: 'Got an idea? Write to us!',
      wave: 'Hello there!',
      jump: 'Wheee!',
      wink: 'Psst, check the projects.',
      copied: 'Copied! Talk soon.',
      lang: 'English it is!',
      menuTitle: 'Where to?',
      menuProjects: 'Show projects',
      menuServices: 'Services',
      menuContact: 'Contact us',
      label: 'gitget robot guide, open quick menu'
    },
    bs: {
      hero: 'Zdravo! Ja sam gitget robotić. Skrolaj, provešću te.',
      projects: 'Ovo su naši radovi, klikni na karticu!',
      services: 'Od ideje do objave, sve radimo mi.',
      process: 'Četiri koraka, bez iznenađenja.',
      team: 'Upoznaj tim iza gitgeta.',
      tech: 'Naši omiljeni alati.',
      contact: 'Imaš ideju? Piši nam!',
      wave: 'Ćao!',
      jump: 'Hop!',
      wink: 'Psst, pogledaj projekte.',
      copied: 'Kopirano! Čujemo se.',
      lang: 'Može na bosanskom!',
      menuTitle: 'Gdje idemo?',
      menuProjects: 'Pokaži projekte',
      menuServices: 'Usluge',
      menuContact: 'Kontaktiraj nas',
      label: 'gitget robotić vodič, otvori brzi meni'
    }
  };
  function L(key) {
    var lang = window.gitgetI18n ? window.gitgetI18n.lang() : 'en';
    return LINES[lang][key];
  }

  var G = 'M1009.6 270.7Q1008.1 270.7 1006.7 270.2Q1005.2 269.7 1004.1 268.8Q1003 267.9 1002.3 266.7L1006.6 264.6Q1007 265.4 1007.9 265.9Q1008.7 266.3 1009.7 266.3Q1010.7 266.3 1011.6 265.9Q1012.5 265.6 1013.1 264.9Q1013.6 264.2 1013.6 263.2V257.9H1014.2V243.6H1018.2V263.3Q1018.2 263.9 1018.2 264.5Q1018.1 265.1 1018 265.7Q1017.5 267.4 1016.3 268.5Q1015.1 269.6 1013.4 270.1Q1011.6 270.7 1009.6 270.7ZM1009.2 262.5Q1006.7 262.5 1004.8 261.2Q1002.9 260 1001.8 257.8Q1000.8 255.6 1000.8 252.8Q1000.8 250 1001.8 247.8Q1002.9 245.6 1004.9 244.4Q1006.8 243.1 1009.5 243.1Q1012.1 243.1 1013.9 244.4Q1015.6 245.7 1016.6 247.9Q1017.5 250.1 1017.5 252.8Q1017.5 255.6 1016.6 257.8Q1015.6 260 1013.8 261.2Q1012 262.5 1009.2 262.5ZM1010 258.4Q1011.5 258.4 1012.4 257.7Q1013.4 257 1013.8 255.7Q1014.2 254.5 1014.2 252.8Q1014.2 251.2 1013.8 249.9Q1013.4 248.6 1012.5 247.9Q1011.6 247.2 1010.1 247.2Q1008.6 247.2 1007.6 248Q1006.6 248.8 1006.1 250Q1005.6 251.3 1005.6 252.8Q1005.6 254.4 1006.1 255.6Q1006.6 256.9 1007.5 257.6Q1008.5 258.4 1010 258.4Z';

  var SVG =
    '<svg viewBox="870 4 280 350" aria-hidden="true" focusable="false">' +
    '<defs>' +
    '<linearGradient id="rb-hd" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#DCD8F0"/></linearGradient>' +
    '<linearGradient id="rb-bd" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#D3CEEA"/></linearGradient>' +
    '<linearGradient id="rb-vs" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#241B5A"/><stop offset="1" stop-color="#120D33"/></linearGradient>' +
    '<radialGradient id="rb-eg" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#A89DF9" stop-opacity=".8"/><stop offset="1" stop-color="#A89DF9" stop-opacity="0"/></radialGradient>' +
    '</defs>' +
    '<ellipse class="bot-focus" cx="1010" cy="182" rx="122" ry="168"/>' +
    '<ellipse id="rb-shadow" cx="1010" cy="338" rx="74" ry="10" fill="#05030F" opacity=".55"/>' +
    '<g id="rb-root"><g id="rb-flip">' +
    '<g id="rb-legL"><rect x="984" y="292" width="20" height="34" rx="10" fill="#E6E2F5"/><rect x="980" y="318" width="27" height="11" rx="5.5" fill="#C9C0FF"/></g>' +
    '<g id="rb-legR"><rect x="1016" y="292" width="20" height="34" rx="10" fill="#E6E2F5"/><rect x="1013" y="318" width="27" height="11" rx="5.5" fill="#C9C0FF"/></g>' +
    '<g id="rb-armL"><rect x="937" y="206" width="22" height="66" rx="11" fill="url(#rb-bd)"/></g>' +
    '<rect x="956" y="198" width="108" height="104" rx="46" fill="url(#rb-bd)"/>' +
    '<g id="rb-chest"><circle cx="1010" cy="250" r="24" fill="#1A1444"/><path d="' + G + '" fill="#F1EEFF"/><circle cx="1028" cy="258" r="3.6" fill="#A89DF9"/></g>' +
    '<g id="rb-armR"><rect x="1061" y="144" width="22" height="74" rx="11" fill="url(#rb-bd)"/><circle cx="1072" cy="142" r="15" fill="#FFFFFF"/></g>' +
    '<rect x="994" y="186" width="32" height="18" rx="6" fill="#CBC6E4"/>' +
    '<g id="rb-head">' +
    '<g id="rb-ant"><line x1="1010" y1="72" x2="1010" y2="44" stroke="#E6E2F5" stroke-width="6" stroke-linecap="round"/><circle id="rb-antGlow" cx="1010" cy="36" r="20" fill="url(#rb-eg)"/><circle cx="1010" cy="36" r="9.5" fill="#A89DF9"/></g>' +
    '<rect id="rb-earL" x="919" y="112" width="18" height="42" rx="9" fill="#A89DF9"/>' +
    '<rect id="rb-earR" x="1083" y="112" width="18" height="42" rx="9" fill="#A89DF9"/>' +
    '<rect x="930" y="68" width="160" height="124" rx="54" fill="url(#rb-hd)"/>' +
    '<g id="rb-face">' +
    '<rect x="948" y="90" width="124" height="80" rx="36" fill="url(#rb-vs)"/>' +
    '<path d="M962,108 Q980,96 1002,96" stroke="#FFFFFF" stroke-opacity=".18" stroke-width="5" fill="none" stroke-linecap="round"/>' +
    '<g id="rb-eyes">' +
    '<circle cx="988" cy="128" r="18" fill="url(#rb-eg)" opacity=".7"/><circle cx="1032" cy="128" r="18" fill="url(#rb-eg)" opacity=".7"/>' +
    '<g id="rb-eyeL"><ellipse cx="988" cy="128" rx="10.5" ry="13.5" fill="#A89DF9"/><circle cx="991.5" cy="122.5" r="3.2" fill="#FFFFFF" opacity=".85"/></g>' +
    '<g id="rb-eyeR"><ellipse cx="1032" cy="128" rx="10.5" ry="13.5" fill="#A89DF9"/><circle cx="1035.5" cy="122.5" r="3.2" fill="#FFFFFF" opacity=".85"/></g>' +
    '</g>' +
    '<path id="rb-smile" d="M997,150 Q1010,160 1023,150" stroke="#A89DF9" stroke-width="4.5" fill="none" stroke-linecap="round"/>' +
    '<path id="rb-open" d="M998,148 Q1010,166 1022,148 Z" fill="#A89DF9" stroke="#A89DF9" stroke-width="3" stroke-linejoin="round" visibility="hidden"/>' +
    '<ellipse cx="968" cy="152" rx="8" ry="4.5" fill="#E77AA7" opacity=".75"/><ellipse cx="1052" cy="152" rx="8" ry="4.5" fill="#E77AA7" opacity=".75"/>' +
    '</g></g>' +
    '</g></g>' +
    '</svg>';

  /* Mjere u koordinatama bannera */
  var VB_X = 870, VB_Y = 4, VB_W = 280;
  var W0 = 200;                    /* osnovna širina elementa u px */
  var K = W0 / VB_W;               /* px po jedinici SVG-a */
  var AX = (1010 - VB_X) * K;      /* tačka između stopala */
  var AY = (338 - VB_Y) * K;
  var BODY_H = (338 - 16) * K;     /* od vrha antene do tla */

  /* ---------- DOM ---------- */
  var bot = document.createElement('button');
  bot.type = 'button';
  bot.className = 'bot';
  bot.setAttribute('aria-haspopup', 'menu');
  bot.setAttribute('aria-expanded', 'false');
  bot.setAttribute('aria-controls', 'bot-menu');
  bot.style.setProperty('--bot-w', W0 + 'px');
  bot.innerHTML = SVG;

  var bubble = document.createElement('div');
  bubble.className = 'bot-bubble';
  bubble.setAttribute('aria-hidden', 'true');

  var menu = document.createElement('div');
  menu.className = 'bot-menu';
  menu.id = 'bot-menu';
  menu.hidden = true;
  menu.setAttribute('role', 'menu');
  menu.setAttribute('aria-labelledby', 'bot-menu-title');

  document.body.appendChild(bubble);
  document.body.appendChild(bot);
  document.body.appendChild(menu);

  var $ = function (id) { return bot.querySelector('#' + id); };
  var parts = {
    root: $('rb-root'), flip: $('rb-flip'), shadow: $('rb-shadow'),
    legL: $('rb-legL'), legR: $('rb-legR'), armL: $('rb-armL'), armR: $('rb-armR'),
    chest: $('rb-chest'), head: $('rb-head'), ant: $('rb-ant'), antGlow: $('rb-antGlow'),
    earL: $('rb-earL'), earR: $('rb-earR'), face: $('rb-face'), eyes: $('rb-eyes'),
    eyeL: $('rb-eyeL'), eyeR: $('rb-eyeR'), smile: $('rb-smile'), open: $('rb-open')
  };

  var stage = document.querySelector('[data-bot-stage]');
  var dockEl = document.querySelector('.bot-dock');
  var header = document.querySelector('.site-header');
  var sections = Array.prototype.slice.call(document.querySelectorAll('[data-bot-section]'));

  function buildMenu() {
    menu.innerHTML = '';
    var title = document.createElement('p');
    title.id = 'bot-menu-title';
    title.textContent = L('menuTitle');
    menu.appendChild(title);
    [['menuProjects', '#projects'], ['menuServices', '#services'], ['menuContact', '#contact']].forEach(function (it) {
      var b = document.createElement('button');
      b.type = 'button';
      b.setAttribute('role', 'menuitem');
      b.setAttribute('data-go', it[1]);
      b.textContent = L(it[0]);
      menu.appendChild(b);
    });
    bot.setAttribute('aria-label', L('label'));
  }
  buildMenu();

  /* ---------- Stanje ---------- */
  var mode = '';                         /* 'lanes' ili 'dock' */
  var reduced = reduceMq.matches;
  var vw = 0, vh = 0, headerH = 68;
  var pos = { x: 0, y: 0, s: 1 };        /* tačka između stopala, na ekranu */
  var target = { x: 0, y: 0, s: 1, where: 'stage' };
  var vel = 0;
  var walking = false, walkPhase = 0, walkAmt = 0;
  var facing = 1, facingTarget = 1;
  var headTurn = 0, eyeX = 0, eyeY = 0;
  var blinkT = -1, nextBlink = 2.5, winkT = -1;
  var jumpT = -1, waveT = -1, talkT = -1;
  var point = null, pointT = 0;          /* element prema kome pokazuje */
  var armR = 166, armL = 14;
  var pointer = null, pointerAt = -1e9;
  var scrollV = 0, lastScrollY = window.scrollY;
  var activeSection = null, spokenSection = null, settledFor = 0, pendingSpeak = false;
  var bubbleTimer = 0, menuOpen = false;
  var time = 0, last = 0, raf = 0, started = false;

  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function damp(cur, to, k, dt) { return cur + (to - cur) * (1 - Math.exp(-k * dt)); }
  function set(el, tr) { el.setAttribute('transform', tr); }

  function measure() {
    vw = doc.clientWidth;
    vh = window.innerHeight;
    headerH = header ? header.offsetHeight : 68;
    var m = vw >= LANES_MIN ? 'lanes' : 'dock';
    if (m !== mode) {
      mode = m;
      doc.classList.toggle('bot-lanes', mode === 'lanes');
      doc.classList.toggle('bot-docked', mode === 'dock');
      bubble.classList.toggle('docked', mode === 'dock');
      bubble.style.setProperty('--bubble-w', '');
    }
  }

  /* Prazna traka pored sadržaja (samo za široke ekrane) */
  function laneBounds(side) {
    var c = document.querySelector('main .container');
    var r = c.getBoundingClientRect();
    return side === 'left' ? { a: 0, b: r.left } : { a: r.right, b: vw };
  }

  function stageScale(r) { return clamp(r.height * 0.74 / BODY_H, 0.45, 1.6); }

  function computeTarget() {
    var line = vh * 0.45;
    var act = sections[0];
    for (var i = 0; i < sections.length; i++) {
      if (sections[i].getBoundingClientRect().top <= line) act = sections[i];
    }
    if (act !== activeSection) {
      activeSection = act;
      pendingSpeak = true;
      settledFor = 0;
      doc.setAttribute('data-bot-section', act.getAttribute('data-bot-section'));
    }

    var sr = stage ? stage.getBoundingClientRect() : null;
    var onStage = sr && sr.height > 0 && sr.bottom > headerH + sr.height * 0.55;
    if (onStage && mode === 'dock') onStage = sr.bottom < dockEl.getBoundingClientRect().top - 4;

    if (onStage) {
      var s = stageScale(sr);
      target.where = 'stage';
      target.s = s;
      target.x = sr.left + sr.width / 2;
      target.y = sr.top + sr.height / 2 + (BODY_H * s) / 2;
      facingTarget = mode === 'lanes' || vw >= 900 ? -1 : 1;
      return;
    }

    if (mode === 'dock') {
      var s2 = 0.25;
      var d = dockEl.getBoundingClientRect();
      target.where = 'dock';
      target.s = s2;
      target.x = vw - 18 - (W0 * s2) / 2;
      target.y = d.top + 62;
      facingTarget = -1;
      return;
    }

    var side = act.getAttribute('data-bot-side') || 'right';
    var lane = laneBounds(side);
    target.where = side;
    target.s = 0.62;
    target.x = (lane.a + lane.b) / 2;
    target.y = vh - 26;
    facingTarget = side === 'left' ? 1 : -1;
  }

  /* ---------- Govor ---------- */
  function placeBubble() {
    var bw = bubble.offsetWidth, bh = bubble.offsetHeight;
    var bx, by, tail;
    if (mode === 'dock') {
      var d = dockEl.getBoundingClientRect();
      var maxW = vw - 12 - W0 * 0.25 - 36;
      bubble.style.setProperty('--bubble-w', maxW + 'px');
      bw = bubble.offsetWidth; bh = bubble.offsetHeight;
      bx = 12;
      by = d.top + (64 - bh) / 2;
      tail = bw / 2;
    } else {
      var headTop = pos.y - BODY_H * pos.s;
      var cx = pos.x;
      var a = 8, b = vw - 8;
      if (target.where === 'left' || target.where === 'right') {
        var lane = laneBounds(target.where);
        a = lane.a + 8; b = lane.b - 8;
        bubble.style.setProperty('--bubble-w', Math.max(150, b - a) + 'px');
        bw = bubble.offsetWidth; bh = bubble.offsetHeight;
      } else if (stage) {
        var sr = stage.getBoundingClientRect();
        a = sr.left; b = Math.min(vw - 8, sr.right + 40);
        bubble.style.setProperty('--bubble-w', '260px');
        bw = bubble.offsetWidth; bh = bubble.offsetHeight;
      }
      bx = clamp(cx - bw / 2, a, Math.max(a, b - bw));
      by = Math.max(headerH + 8, headTop - bh - 14);
      tail = clamp(cx - bx, 22, bw - 22);
    }
    bubble.style.setProperty('--bx', bx.toFixed(1) + 'px');
    bubble.style.setProperty('--by', by.toFixed(1) + 'px');
    bubble.style.setProperty('--tail', tail.toFixed(1) + 'px');
    bubble.style.setProperty('--bo', tail.toFixed(0) + 'px 100%');
  }

  function say(text, ms) {
    if (menuOpen) return;
    bubble.textContent = text;
    placeBubble();
    bubble.classList.add('show');
    talkT = 0;
    clearTimeout(bubbleTimer);
    bubbleTimer = setTimeout(hideBubble, ms || (mode === 'dock' ? 3600 : 4600));
    if (reduced) render();
  }
  function hideBubble() {
    bubble.classList.remove('show');
    talkT = -1;
  }

  function pointAt(el) {
    if (!el) return;
    var r = el.getBoundingClientRect();
    var bottomLimit = vh - (mode === 'dock' ? 64 : 0);
    if (r.top < headerH || r.bottom > bottomLimit || r.width === 0) return;
    point = el;
    pointT = 0;
    el.classList.add('flash');
    setTimeout(function () { el.classList.remove('flash'); }, 1400);
  }

  function speakForSection() {
    var id = activeSection.getAttribute('data-bot-section');
    if (id === spokenSection) return;
    spokenSection = id;
    var line = L(id);
    if (line) say(line);
    pointAt(document.querySelector('[data-bot-point="' + id + '"]'));
  }

  /* ---------- Trikovi i meni ---------- */
  var tricks = ['wave', 'jump', 'wink'];
  var trickIdx = 0;
  function doTrick() {
    var tr = tricks[trickIdx++ % tricks.length];
    if (!reduced) {
      if (tr === 'wave') waveT = 0;
      if (tr === 'jump') jumpT = 0;
      if (tr === 'wink') winkT = 0;
    }
    return tr;
  }

  function placeMenu() {
    var mw = menu.offsetWidth, mh = menu.offsetHeight;
    var x, y;
    if (mode === 'dock') {
      x = vw - mw - 12;
      y = dockEl.getBoundingClientRect().top - mh - 10;
    } else {
      x = clamp(pos.x - mw / 2, 8, vw - mw - 8);
      y = Math.max(headerH + 8, pos.y - BODY_H * pos.s - mh - 14);
    }
    menu.style.setProperty('--mx', x.toFixed(0) + 'px');
    menu.style.setProperty('--my', y.toFixed(0) + 'px');
  }

  function openMenu() {
    hideBubble();
    menuOpen = true;
    menu.hidden = false;
    bot.setAttribute('aria-expanded', 'true');
    placeMenu();
    var first = menu.querySelector('button');
    if (first) first.focus({ preventScroll: true });
  }
  function closeMenu(focusBot) {
    if (!menuOpen) return;
    menuOpen = false;
    menu.hidden = true;
    bot.setAttribute('aria-expanded', 'false');
    if (focusBot) bot.focus({ preventScroll: true });
  }

  bot.addEventListener('click', function () {
    if (menuOpen) { closeMenu(true); return; }
    var tr = doTrick();
    if (!reduced) {
      say(L(tr), 1400);
      setTimeout(function () { if (!menuOpen) openMenu(); }, 650);
    } else {
      openMenu();
    }
  });

  menu.addEventListener('click', function (e) {
    var b = e.target.closest('[data-go]');
    if (!b) return;
    var sec = document.querySelector(b.getAttribute('data-go'));
    closeMenu(false);
    if (!sec) return;
    sec.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
    var h = sec.querySelector('h2');
    if (h) { h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); }
  });

  menu.addEventListener('keydown', function (e) {
    var items = Array.prototype.slice.call(menu.querySelectorAll('[role="menuitem"]'));
    var i = items.indexOf(document.activeElement);
    if (e.key === 'ArrowDown') { e.preventDefault(); items[(i + 1) % items.length].focus(); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); items[(i - 1 + items.length) % items.length].focus(); }
    else if (e.key === 'Home') { e.preventDefault(); items[0].focus(); }
    else if (e.key === 'End') { e.preventDefault(); items[items.length - 1].focus(); }
    else if (e.key === 'Escape') { e.preventDefault(); closeMenu(true); }
    else if (e.key === 'Tab') { closeMenu(false); }
  });

  document.addEventListener('pointerdown', function (e) {
    if (menuOpen && !menu.contains(e.target) && !bot.contains(e.target)) closeMenu(false);
  });

  document.addEventListener('langchange', function () {
    var wasOpen = menuOpen;
    buildMenu();
    if (wasOpen) { menuOpen = false; openMenu(); }
    else say(L('lang'), 2400);
  });
  document.addEventListener('emailcopied', function (e) { if (e.detail.ok) { waveT = reduced ? -1 : 0; say(L('copied'), 2600); } });

  /* ---------- Unos ---------- */
  window.addEventListener('pointermove', function (e) {
    if (e.pointerType !== 'mouse') return;
    pointer = { x: e.clientX, y: e.clientY };
    pointerAt = time;
  }, { passive: true });

  window.addEventListener('scroll', function () {
    var y = window.scrollY;
    scrollV = clamp(scrollV + (y - lastScrollY) * 0.08, -1, 1);
    lastScrollY = y;
    if (menuOpen) closeMenu(false);
    if (reduced) frameReduced();
  }, { passive: true });

  window.addEventListener('resize', function () {
    measure();
    if (reduced) frameReduced();
  });

  /* ---------- Crtanje ---------- */
  function render() {
    var s = pos.s;
    var X = pos.x - AX * s, Y = pos.y - AY * s;
    bot.style.transform = 'translate3d(' + X.toFixed(2) + 'px,' + Y.toFixed(2) + 'px,0) scale(' + s.toFixed(4) + ')';

    var f = Math.abs(facing) < 0.12 ? (facing < 0 ? -0.12 : 0.12) : facing;
    set(parts.flip, 'translate(1010 0) scale(' + f.toFixed(3) + ' 1) translate(-1010 0)');
    set(parts.chest, f < 0 ? 'translate(1010 0) scale(-1 1) translate(-1010 0)' : '');

    /* hod */
    var swing = Math.sin(walkPhase) * walkAmt;
    set(parts.legL, 'rotate(' + (swing * 24).toFixed(2) + ' 994 296)');
    set(parts.legR, 'rotate(' + (-swing * 24).toFixed(2) + ' 1026 296)');

    var bob = reduced ? 0 : Math.sin(time * 2.1) * 3 * (1 - walkAmt) - Math.abs(Math.sin(walkPhase)) * 7 * walkAmt;
    var jump = 0, squash = 1;
    if (jumpT >= 0) {
      var jt = jumpT / 0.75;
      if (jt < 0.15) squash = 1 - Math.sin(jt / 0.15 * Math.PI) * 0.08;
      else jump = -Math.sin((jt - 0.15) / 0.85 * Math.PI) * 70;
    }
    var lean = walkAmt * 5 * (vel > 0 ? 1 : vel < 0 ? -1 : 0);
    set(parts.root, 'translate(0 ' + (bob + jump).toFixed(2) + ') rotate(' + lean.toFixed(2) + ' 1010 330) translate(1010 338) scale(1 ' + squash.toFixed(3) + ') translate(-1010 -338)');
    var lift = clamp(-(bob + jump) / 80, 0, 1);
    set(parts.shadow, 'translate(1010 338) scale(' + (1 - lift * 0.45).toFixed(3) + ' 1) translate(-1010 -338)');
    parts.shadow.setAttribute('opacity', (0.55 - lift * 0.3).toFixed(2));

    /* ruke */
    set(parts.armL, 'rotate(' + armL.toFixed(2) + ' 948 210)');
    set(parts.armR, 'rotate(' + armR.toFixed(2) + ' 1072 212)');

    /* glava: lažni 3D okret */
    var h = headTurn;
    set(parts.head, 'rotate(' + (h * 4).toFixed(2) + ' 1010 190)');
    set(parts.face, 'translate(' + (h * 12).toFixed(2) + ' ' + (eyeY * 0.4).toFixed(2) + ')');
    set(parts.ant, 'translate(' + (h * 7).toFixed(2) + ' 0)');
    var earIn = Math.abs(h) * 11;
    set(parts.earL, 'translate(' + earIn.toFixed(2) + ' 0)');
    set(parts.earR, 'translate(' + (-earIn).toFixed(2) + ' 0)');
    set(parts.eyes, 'translate(' + eyeX.toFixed(2) + ' ' + eyeY.toFixed(2) + ')');

    /* treptanje i namigivanje */
    var bl = blinkT >= 0 ? 1 - Math.sin(Math.min(1, blinkT / 0.16) * Math.PI) * 0.9 : 1;
    var wk = winkT >= 0 ? (winkT < 0.9 ? 0.12 : 1) : 1;
    set(parts.eyeL, 'translate(0 128) scale(1 ' + (bl * wk).toFixed(3) + ') translate(0 -128)');
    set(parts.eyeR, 'translate(0 128) scale(1 ' + bl.toFixed(3) + ') translate(0 -128)');

    /* usta i antena */
    var talking = talkT >= 0 && talkT < 1.3 && Math.floor(talkT * 8) % 2 === 0;
    var happy = jumpT >= 0 || waveT >= 0 || winkT >= 0;
    var open = talking || happy;
    parts.open.setAttribute('visibility', open ? 'visible' : 'hidden');
    parts.smile.setAttribute('visibility', open ? 'hidden' : 'visible');
    var glow = reduced ? 0.8 : 0.55 + Math.sin(time * 3.2) * 0.35 + (talkT >= 0 ? 0.25 : 0);
    parts.antGlow.setAttribute('opacity', clamp(glow, 0.15, 1).toFixed(2));

    if (bubble.classList.contains('show')) placeBubble();
    if (menuOpen) placeMenu();
  }

  function frame(now) {
    raf = 0;
    if (document.hidden) return;
    var dt = last ? Math.min(0.05, (now - last) / 1000) : 0.016;
    last = now;
    time += dt;

    computeTarget();

    /* kretanje: hoda vodoravno, visinu i veličinu mijenja glatko */
    var dx = target.x - pos.x;
    var maxV = 640;
    if (Math.abs(dx) > 1.5) {
      var want = clamp(dx * 4, -maxV, maxV);
      vel = damp(vel, want, 7, dt);
      var step = vel * dt;
      if (Math.abs(step) > Math.abs(dx)) step = dx;
      pos.x += step;
      walking = Math.abs(vel) > 25;
      if (walking) facingTarget = vel > 0 ? 1 : -1;
    } else {
      pos.x = target.x;
      vel = 0;
      walking = false;
    }
    pos.y = damp(pos.y, target.y, target.where === 'stage' ? 18 : 7, dt);
    pos.s = damp(pos.s, target.s, 6, dt);

    if (walking && Math.abs(dx) > 160 && bubble.classList.contains('show')) hideBubble();
    walkAmt = damp(walkAmt, walking ? 1 : 0, 10, dt);
    if (walking) walkPhase += Math.abs(vel) * dt * 0.045;
    else walkPhase = damp(walkPhase, Math.round(walkPhase / Math.PI) * Math.PI, 8, dt);

    /* pokazivanje rukom */
    var armRT = 166 + Math.sin(time * 1.7) * 3, armLT = 14 - Math.sin(time * 1.7) * 3;
    if (walking) {
      armRT = 166 - Math.sin(walkPhase) * 20;
      armLT = 14 - Math.sin(walkPhase) * 20;
    }
    var pointing = false;
    if (point && !walking) {
      pointT += dt;
      if (pointT > 2.8) point = null;
      else {
        var r = point.getBoundingClientRect();
        var tx = r.left + r.width / 2, ty = r.top + r.height / 2;
        var dir = tx >= pos.x ? 1 : -1;
        facingTarget = dir;
        var shX = pos.x + dir * 62 * K * pos.s;
        var shY = pos.y - (338 - 212) * K * pos.s;
        var ang = Math.atan2((tx - shX) * dir, -(ty - shY)) * 180 / Math.PI;
        armRT = clamp(ang, 25, 155);
        pointing = true;
      }
    }
    if (waveT >= 0) {
      waveT += dt;
      armRT = 17 + Math.sin(waveT * 11) * 14;
      if (waveT > 1.6) waveT = -1;
    }
    if (jumpT >= 0) {
      jumpT += dt;
      armRT = 35; armLT = 145;
      if (jumpT > 0.75) jumpT = -1;
    }
    if (winkT >= 0) { winkT += dt; if (winkT > 1.1) winkT = -1; }
    armR = damp(armR, armRT, pointing || waveT >= 0 || jumpT >= 0 ? 12 : 8, dt);
    armL = damp(armL, armLT, 10, dt);

    facing = damp(facing, facingTarget, 9, dt);

    /* pogled: kursor na računaru, skrol na mobitelu */
    var lookX = 0, lookY = 0;
    if (pointing) {
      var pr = point.getBoundingClientRect();
      lookX = clamp((pr.left + pr.width / 2 - pos.x) / 260, -1, 1);
      lookY = clamp((pr.top + pr.height / 2 - (pos.y - BODY_H * pos.s * 0.6)) / 260, -1, 1);
    } else if (pointer && fineMq.matches && time - pointerAt < 5) {
      lookX = clamp((pointer.x - pos.x) / 320, -1, 1);
      lookY = clamp((pointer.y - (pos.y - BODY_H * pos.s * 0.6)) / 320, -1, 1);
    } else if (walking) {
      lookX = vel > 0 ? 0.8 : -0.8;
    } else {
      lookX = facingTarget * 0.25;
      lookY = scrollV;
    }
    scrollV = damp(scrollV, 0, 2.5, dt);
    var fs = facing < 0 ? -1 : 1;
    headTurn = damp(headTurn, lookX * 0.6 * fs, 6, dt);
    eyeX = damp(eyeX, lookX * 6 * fs, 10, dt);
    eyeY = damp(eyeY, lookY * 5, 10, dt);

    /* treptanje */
    if (blinkT >= 0) { blinkT += dt; if (blinkT > 0.16) blinkT = -1; }
    else if (time > nextBlink) { blinkT = 0; nextBlink = time + 2.2 + Math.random() * 3.5; }
    if (talkT >= 0) talkT += dt;

    /* kad stigne na mjesto, kaže rečenicu za sekciju */
    if (!walking && Math.abs(target.x - pos.x) < 3) settledFor += dt; else settledFor = 0;
    if (pendingSpeak && settledFor > 0.35 && started) { pendingSpeak = false; speakForSection(); }

    render();
    raf = requestAnimationFrame(frame);
  }

  /* Uz smanjene animacije: bez petlje, robotić samo stoji na svom mjestu */
  function frameReduced() {
    computeTarget();
    pos.x = target.x; pos.y = target.y; pos.s = target.s;
    facing = facingTarget;
    walkAmt = 0; headTurn = 0; eyeX = 0; eyeY = 0;
    render();
    if (pendingSpeak && started) { pendingSpeak = false; speakForSection(); }
  }

  function start() {
    measure();
    computeTarget();
    started = false;
    if (reduced) {
      started = true;
      frameReduced();
      bot.classList.add('ready');
      return;
    }
    /* ulazak na scenu: dolazi hodajući s desne strane */
    pos.x = vw + 140;
    pos.y = target.y;
    pos.s = target.s;
    facing = facingTarget = -1;
    bot.classList.add('ready');
    setTimeout(function () { started = true; }, 400);
    raf = requestAnimationFrame(frame);
  }

  reduceMq.addEventListener('change', function (e) {
    reduced = e.matches;
    cancelAnimationFrame(raf); raf = 0;
    last = 0;
    if (reduced) frameReduced();
    else raf = requestAnimationFrame(frame);
  });

  document.addEventListener('visibilitychange', function () {
    if (document.hidden) { cancelAnimationFrame(raf); raf = 0; }
    else if (!reduced && !raf) { last = 0; raf = requestAnimationFrame(frame); }
  });

  /* stanje za testove */
  window.gitgetBot = {
    state: function () {
      return { mode: mode, where: target.where, x: pos.x, y: pos.y, s: pos.s, walking: walking, reduced: reduced, menuOpen: menuOpen, section: activeSection && activeSection.getAttribute('data-bot-section') };
    },
    rect: function () { return bot.getBoundingClientRect(); }
  };

  if (document.readyState === 'complete') start();
  else window.addEventListener('load', start);
})();
