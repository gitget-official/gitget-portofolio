# gitget portfolio

Portfolio stranica za **gitget**, AI-driven web & mobile apps.

Čisti HTML, CSS i JavaScript, bez build koraka. Sve što se objavljuje je u folderu `public/`.

## Pokretanje lokalno

```bash
npm install
npm run serve     # http://localhost:8080
```

## Struktura

```
public/            stranica koja se objavljuje
  index.html       sve sekcije (engleski tekst je u HTML-u)
  css/style.css    stilovi
  js/i18n.js       bosanski prevodi i prekidač jezika
  js/main.js       meni, otkrivanje pri skrolu, kartice projekata, kopiranje emaila
  js/robot.js      robotić vodič
  fonts/           Manrope (SIL OFL, self-hosted)
  img/             slike projekata (webp/avif) i OG slika
  _headers         Cloudflare zaglavlja i keširanje
tools/             pomoćne skripte (slike, ikonice, OG slika, mjerenje)
tests/             Playwright i axe testovi
```

## Skripte

| Komanda | Šta radi |
|---|---|
| `npm run serve` | lokalni server za `public/` |
| `npm test` | Playwright testovi (širine, jezici, klikovi, axe, reduced motion) |
| `npm run perf` | Lighthouse mjerenje na usporenom mobitelu |
| `npm run og` | ponovo pravi `public/img/og.png` |
| `node tools/make-icons.mjs` | pravi PNG ikonice iz `public/favicon.svg` |
| `node tools/make-images.mjs <slika> <ime> <širine>` | pretvara sliku projekta u webp i avif |

## Objava na Cloudflare

- **Workers:** `npx wrangler deploy` (podešavanje je u `wrangler.jsonc`, servira se folder `public/`).
- **Pages:** build komanda prazna, output folder `public`.

Prije objave zamijeni privremenu adresu `https://gitget.pages.dev` pravom domenom u
`public/index.html` (canonical, og:url, og:image, JSON-LD), `public/robots.txt` i `public/sitemap.xml`.
