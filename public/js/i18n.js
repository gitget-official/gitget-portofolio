/* Prevodi. Engleski tekst stoji u HTML-u, ovdje su bosanski prevodi i tekstovi koje gradi JavaScript. */
(function () {
  'use strict';

  var BS = {
    skip: 'Preskoči na sadržaj',
    brandLabel: 'gitget, nazad na vrh',
    navLabel: 'Glavni meni',
    navProjects: 'Projekti',
    navServices: 'Usluge',
    navProcess: 'Kako radimo',
    navTeam: 'Tim',
    navTech: 'Tehnologije',
    navContact: 'Kontakt',
    langLabel: 'Jezik',
    menuOpen: 'Otvori meni',
    menuClose: 'Zatvori meni',
    heroEyebrow: 'Studio za web, mobilne aplikacije i AI',
    heroLead: 'Mali tim iz Bosne i Hercegovine koji dizajnira i pravi web i mobilne aplikacije sa AI-jem u srži. Ideju vodimo od prve skice do proizvoda koji je objavljen, brz i jednostavan za korištenje.',
    ctaProjects: 'Pogledaj projekte',
    ctaContact: 'Javi nam se',
    chipsLabel: 'Šta radimo',
    chipWeb: 'Web aplikacije',
    chipMobile: 'Mobilne aplikacije',
    chipAi: 'AI funkcije',
    projectsKicker: 'Izdvojeni radovi',
    projectsTitle: 'Projekti',
    projectsLead: 'Pravi proizvodi koje je napravio naš tim, od ski centara i klinika do fudbalske statistike i enciklopedije okusa. Klikni na karticu za detalje.',
    badgeLive: 'Uživo',
    altShishaHome: 'Početna stranica MyShishapedije sa naslovom o okusima i nacrtanom nargilom',
    pShishaShort: 'Dvojezična enciklopedija okusa za nargilu, sa poređenjem, mikserom i kvizom.',
    pGrabShort: 'Pomoćnik za Fantasy Premier League sa predviđanjima mašinskog učenja.',
    pSkiShort: 'Poslovanje ski centra: karte, liftovi, staze i izvještaji u jednom sistemu.',
    pClinicShort: 'Termini i kartoni pacijenata za male privatne klinike.',
    pVetShort: 'Nađi veterinara na mapi, rezerviši slobodan termin i vodi karton ljubimca.',
    servicesKicker: 'Šta radimo',
    servicesTitle: 'Usluge',
    sWebTitle: 'Web aplikacije',
    sWebText: 'Brzi, responzivni proizvodi, od landing stranica do cijelih platformi.',
    sMobTitle: 'Mobilne aplikacije',
    sMobText: 'Aplikacije za Android i iOS iz jednog koda, rađene s istom pažnjom kao web.',
    sAiTitle: 'AI funkcije',
    sAiText: 'Asistenti, pametna pretraga, preporuke i automatizacija unutar tvog proizvoda.',
    sLaunchTitle: 'Od dizajna do objave',
    sLaunchText: 'UX, dizajn interfejsa, razvoj, objava i briga nakon objave.',
    servicesCta: 'Ispričaj nam svoju ideju',
    processKicker: 'Kako radimo',
    processTitle: 'Četiri koraka, bez iznenađenja',
    st1Title: 'Ideja',
    st1Text: 'Zajedno definišemo šta proizvod mora raditi i za koga.',
    st2Title: 'Prva verzija',
    st2Text: 'Radni prototip rano, da ga možeš isprobati.',
    st3Title: 'Dorada',
    st3Text: 'Zajedno doteramo detalje dok sve ne bude kako treba.',
    st4Title: 'Objava i održavanje',
    st4Text: 'Uživo, pod nadzorom i stalno sve bolje nakon objave.',
    teamKicker: 'Ljudi',
    teamTitle: 'Tim',
    newTab: ' (otvara se u novoj kartici)',
    techKicker: 'Alati kojima vjerujemo',
    techTitle: 'Tehnologije',
    contactKicker: 'Kontakt',
    contactTitle: 'Imaš ideju? Napravimo je.',
    contactLead: 'Piši nam o svojoj ideji ili projektu i javićemo ti se.',
    copyEmail: 'Kopiraj email',
    footerNote: 'Bez praćenja i bez kolačića.',
    toTop: 'Nazad na vrh',
    close: 'Zatvori'
  };

  /* Tekstovi koje koriste skripte, na oba jezika */
  var UI = {
    en: {
      title: 'gitget | AI-driven web & mobile apps',
      description: 'gitget is a small team from Bosnia and Herzegovina that designs and builds web and mobile apps with AI at their core. See our projects and get in touch.',
      copied: 'Email copied to clipboard.',
      copyFail: 'Copying did not work. The email is gitget.official@gmail.com',
      copiedBtn: 'Copied!',
      menuOpen: 'Open menu',
      menuClose: 'Close menu',
      features: 'Main features',
      tech: 'Technologies',
      platforms: 'Platforms',
      screens: 'Screenshots',
      source: 'Source code',
      live: 'Live site',
      newTab: ' (opens in a new tab)',
      noShots: 'Screenshots of this project are coming soon. The picture above is an illustration, not a screen from the app.'
    },
    bs: {
      title: 'gitget | AI-driven web & mobile apps',
      description: 'gitget je mali tim iz Bosne i Hercegovine koji pravi web i mobilne aplikacije sa AI-jem u srži. Pogledaj naše projekte i javi nam se.',
      copied: 'Email je kopiran.',
      copyFail: 'Kopiranje nije uspjelo. Email je gitget.official@gmail.com',
      copiedBtn: 'Kopirano!',
      menuOpen: 'Otvori meni',
      menuClose: 'Zatvori meni',
      features: 'Glavne funkcije',
      tech: 'Tehnologije',
      platforms: 'Platforme',
      screens: 'Screenshotovi',
      source: 'Izvorni kod',
      live: 'Sajt uživo',
      newTab: ' (otvara se u novoj kartici)',
      noShots: 'Screenshotovi ovog projekta stižu uskoro. Slika iznad je ilustracija, a ne ekran iz aplikacije.'
    }
  };

  var EN = null; /* popunjava se iz HTML-a pri prvom pokretanju */

  function collectEnglish() {
    EN = {};
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      EN[el.getAttribute('data-i18n')] = el.textContent;
    });
    document.querySelectorAll('[data-i18n-attr]').forEach(function (el) {
      el.getAttribute('data-i18n-attr').split(';').forEach(function (pair) {
        var p = pair.split(':');
        EN[p[1]] = el.getAttribute(p[0]);
      });
    });
  }

  function current() {
    return document.documentElement.lang === 'bs' ? 'bs' : 'en';
  }

  function apply(lang) {
    if (!EN) collectEnglish();
    var dict = lang === 'bs' ? BS : EN;
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var v = dict[el.getAttribute('data-i18n')];
      if (v != null) el.textContent = v;
    });
    document.querySelectorAll('[data-i18n-attr]').forEach(function (el) {
      el.getAttribute('data-i18n-attr').split(';').forEach(function (pair) {
        var p = pair.split(':');
        var v = dict[p[1]];
        if (v != null) el.setAttribute(p[0], v);
      });
    });
    document.title = UI[lang].title;
    var md = document.querySelector('meta[name="description"]');
    if (md) md.setAttribute('content', UI[lang].description);
    document.querySelectorAll('.lang-btn').forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.getAttribute('data-lang') === lang));
    });
    document.documentElement.classList.remove('lang-pending');
    try { localStorage.setItem('lang', lang); } catch (e) {}
    document.dispatchEvent(new CustomEvent('langchange', { detail: { lang: lang } }));
  }

  window.gitgetI18n = {
    t: function (key) { return UI[current()][key]; },
    lang: current,
    set: apply
  };

  collectEnglish();
  if (current() === 'bs') apply('bs');

  document.addEventListener('click', function (e) {
    var b = e.target.closest('.lang-btn');
    if (!b) return;
    var lang = b.getAttribute('data-lang');
    if (lang !== current()) apply(lang);
  });
})();
