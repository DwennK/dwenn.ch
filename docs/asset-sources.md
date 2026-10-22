# Portfolio asset provenance and Peaks evidence

Checked 2026-10-22. Downloaded assets are real photographs, real public website captures, or official publisher artwork. None of the files below were generated with AI.

## Real portrait

- Local: `public/images/portrait.avif` — 709 × 945, 36,061 bytes.
- Source page: https://peaks.ch/a-propos/
- Original: https://peaks.ch/_astro/dwenn-kaufmann.eoFUKSTZ_Z2c7fGO.avif
- Credit: Dwenn Kaufmann / Peaks. This is the exact portrait supplied in the brief; it was visually inspected after local PNG conversion because the image inspection tool does not decode AVIF. The original AVIF is unchanged.
- FR alt: « Portrait de Dwenn Kaufmann, développeur full stack et fondateur de Peaks. »
- EN alt: “Portrait of Dwenn Kaufmann, full stack developer and founder of Peaks.”

## Current website captures

All current images below were captured directly on the named public website using installed Google Chrome, headless, isolated profile, at 1440 × 900. The viewport was set before interactions. Fonts and finite browser animations were allowed to finish. No user account, private profile, or private data was accessed. The task-owned Playwright session `dwenn-peaks-assets` was closed successfully after capture. PNG captures were encoded to WebP quality 88, without compositing or alteration of the website content.

| File | Dimensions | Bytes | Source and credit |
| --- | --- | --- | --- |
| `public/images/peaks/shopyphone.webp` | 1440 × 900 | 75000 | https://shopyphone.ch/ — ShopyPhone; site implementation by Dwenn/Peaks as confirmed in the brief. French selected in the public language control, optional cookies declined. |
| `public/images/peaks/ca-farte.webp` | 1440 × 900 | 48424 | https://cafarte.ch/ — Ça farte / Custom Bike Shop; site implementation by Dwenn/Peaks as confirmed in the brief. |
| `public/images/peaks/genevawrist.webp` | 1440 × 900 | 87106 | https://genevawrist.com/ — GenevaWrist; site implementation by Dwenn/Peaks as confirmed in the brief. The hero is a real rotating watch gallery; the captured frame shows a Rolex Daytona. |

The initially supplied Peaks desktop capture URLs still respond, but those files are older. The Ça farte capture displayed a duplicated masthead and large blank area; ShopyPhone has since moved to a new Shopify presentation. All three local `*.webp` captures above were therefore refreshed live and visually inspected.

Suggested alt labels:

- FR ShopyPhone: « Page d’accueil de ShopyPhone : smartphones reconditionnés, catalogue et achat en ligne. » EN: “ShopyPhone homepage with refurbished smartphones, product catalogue and online shopping.”
- FR Ça farte: « Page d’accueil de Ça farte, avec son identité jaune et noire et des skis au premier plan. » EN: “Ça farte homepage with its yellow and black identity and a pair of skis in the foreground.”
- FR GenevaWrist: « Page d’accueil de GenevaWrist, catalogue de montres de luxe et parcours d’achat et de revente. » EN: “GenevaWrist homepage for discovering, buying and selling luxury watches.”

## Supplemental presentation visuals from Peaks

These are existing portfolio mockups published by Peaks, not live captures. They may show an earlier design. Prefer the current captures above as the main proof.

| File | Dimensions | Bytes | Original source |
| --- | --- | --- | --- |
| `public/images/peaks/shopyphone-presentation.webp` | 1800 × 760 | 46590 | https://peaks.ch/_astro/references-shopyphone.Cp7rLXIv_14UJYK.webp |
| `public/images/peaks/ca-farte-presentation.webp` | 1800 × 760 | 48978 | https://peaks.ch/_astro/all-devices-black-2.CfZyedzs_Z23dUI5.webp |
| `public/images/peaks/genevawrist-presentation.webp` | 1800 × 760 | 77874 | https://peaks.ch/_astro/references-geneva-wrist.DACrREcG_Z1zo5kk.webp |

Credit: respective client / Peaks. Source pages are the case studies listed below.

## Verified editorial facts and concise copy

### Peaks

Sources: https://peaks.ch/ and https://peaks.ch/a-propos/

The public About page lists Dwenn as founder and developer. It also lists Desmond as a founder; do not imply Dwenn is the only founder. The brief explicitly confirms personal execution of the three selected projects. The agency works with Swiss SMEs, and its public page assigns conception/development, design and UX quality to Dwenn.

FR: « Fondateur de Peaks. J’aide les petites entreprises à prendre leur place sur le web. Une identité qui leur ressemble, un site qui explique leur métier et un parcours qui donne envie de les contacter. »

EN: “Founder of Peaks. I help small businesses find their place on the web, with an identity that feels like them, a website that explains what they do and a clear path to getting in touch.”

### ShopyPhone

Sources: https://peaks.ch/references/shopyphone/ and https://shopyphone.ch/

Verified need: turn a local refurbished-device offer into an accessible Swiss online store. Verified functions: catalogue categories, product variants, search, customer account, cart, delivery information. No adoption, revenue or conversion claims.

**Stack drift:** the Peaks case study explicitly says WooCommerce. Current live HTML contains `Shopify.shop` and `Shopify.theme` (Horizon), with no WooCommerce or WordPress assets. Accordingly, either omit the stack in the portfolio overview or say the current site runs on Shopify; do not call the live current site WooCommerce. The case study's WooCommerce attribution describes the older implementation.

FR: « Le reconditionné, à portée de clic. J’ai structuré une boutique où l’on peut comparer les appareils, choisir sa variante et acheter avec des repères clairs. »

EN: “Refurbished tech, within reach. I built a store around a clear journey: explore devices, choose a variant and make an informed purchase.”

### Ça farte

Sources: https://peaks.ch/references/ca-farte/ and https://cafarte.ch/

Verified need: explain an unusual service—ski/snowboard pickup, maintenance and return—and make maintenance tiers comparable. Visible functions: service catalogue, booking links, online payment description, FAQ and service areas. Do not import business statistics.

Stack independently verified from served source: WordPress generator metadata plus loaded WooCommerce plugin CSS/JS. This is code evidence, not a guess from appearance.

FR: « Moins de logistique. Plus de glisse. J’ai donné une identité et un parcours de réservation à un service qui récupère, entretient puis ramène le matériel de ski. »

EN: “Less logistics. More time on the slopes. I shaped the identity and booking journey for a service that collects, tunes and returns ski equipment.”

### GenevaWrist

Sources: https://peaks.ch/references/genevawrist/ and https://genevawrist.com/

Verified need: show luxury watches with clear collection, sale and specialist-contact paths. Visible functions: watch catalogue, brands, sell-your-watch journey, language and currency controls, consultation link. Do not adopt generic customer quotes or commercial claims as portfolio results.

Stack verified from the current local repository `../genevawrist.com/apps/storefront-nuxt/package.json`: Nuxt 4, Vue 3, TypeScript, Sanity integration. Live site serves `/_nuxt/` modules. These sources support describing it as a Nuxt/Vue storefront with Sanity-managed content, without claiming a checkout implementation from appearance.

FR: « L’horlogerie, jusque dans le détail. J’ai conçu une vitrine où l’on découvre les pièces, explore les marques et passe naturellement de la collection à l’échange avec un spécialiste. »

EN: “Watchmaking, down to the details. I designed a storefront that connects watch discovery, brand exploration and a direct conversation with a specialist.”

## Nintendo influences

See [nintendo-sources.md](nintendo-sources.md) for original image URLs, official source pages, exact rights credits and FR/EN alt labels. Available images:

- `public/images/influences/pokemon-blue.jpg`, 1600 × 800.
- `public/images/influences/mario-kart-64.jpg`, 1600 × 800.
- `public/images/influences/donkey-kong-64.jpg`, 1600 × 800.

Use as personal influences, never as Dwenn's own projects. Keep source links/credits accessible in the rendered About page. These are publisher art assets, not AI approximations. The future childhood photograph remains intentionally absent; no substitute was created.
