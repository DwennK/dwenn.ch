# Product evidence and image provenance

Checked on 2026-10-22. This is an editorial evidence register for dwenn.ch, not a release or production audit of the products. The three source repositories were inspected without modification. No company database, personal browser profile, live API data, or real customer records were opened.

## POS Téléphonie

- Public source: https://github.com/DwennK/004-Nuxt
- Public HEAD checked with `git ls-remote`: `d4a2ae39c6c8ae82fa13f621b733a186b78d6f92`.
- Local read-only source: `/Users/dwenn/Documents/dev/004-Nuxt`, HEAD `145e28a8be828cb0e8f8f957c9bc57e007388438` (behind remote by three commits at inspection). Current remote `package.json` and `README.md` were also fetched read-only; the core stack matches.
- Verified stack: Nuxt 4, Vue 3, TypeScript, Nuxt UI, Drizzle ORM, Turso/libSQL; Nuxt server endpoints and Cloudflare Workers via Nitro.
- Source evidence: `package.json`, `nuxt.config.ts`, `app/pages`, `server/api`, `server/db`, `shared/types/pos`, and `README.md`.
- Verified product capabilities: customer records, service/repair cases, catalog, counter sales, quotes/orders/invoices, PDF/print output, separately tracked payments, recorded refunds, smartphone stock/reservations, end-of-day and broader reporting.
- Important architectural story: a repair case, a commercial document, and a payment are distinct domain objects. The product follows the actual repair/counter workflow instead of treating every action as a generic invoice.
- Representative code verification: `server/api/sales/create-and-pay.post.ts` requires financial capability, an idempotency key and validated input; `server/api/reports/overview.get.ts` requires financial read capability; the corresponding pages and API handlers exist. This is code evidence, not a fresh end-to-end production test.
- Do not claim adoption counts, measured time savings, revenue impact, universal integrations, or verified deployment from the README.

### Screenshot assets

| Public asset | Original | Dimensions | Evidence |
| --- | --- | --- | --- |
| `/images/projects/pos-telephonie.webp` | `004-Nuxt/output/playwright/simplified-print/dossier-desktop.png` | 1440 × 900 | Actual earlier local browser QA screenshot. Visible `REP-TEST-001`, `Camille Exemple`, `Compte test POS`; no telephone, email, IMEI, serial or access code shown. |
| `/images/projects/pos-telephonie-payment.webp` | `004-Nuxt/output/playwright/simplified-print/sale-desktop.png` | 1440 × 900 | Actual earlier local QA screenshot: `FA-TEST-001`, `Camille Exemple`, CHF 100.00. `tests/fixtures/document-print.ts` confirms this exact synthetic invoice/customer/amount fixture. |

Both images were visually inspected and losslessly encoded to WebP. They are development snapshots of the real interface, with test data, not illustrations and not a promise that the current production UI is pixel-identical. The historical internal UI branding `Microwest POS` remains visible; the portfolio's public project name is **POS Téléphonie**. The screenshot's old `REP-` reference must not override current source terminology (`DOS-` in the current repository).

Suggested bilingual caption:

- FR: « Interface réelle · données de démonstration. Capture d’une version de développement. »
- EN: “Actual interface · demonstration data. Screenshot of a development version.”

### Suggested editorial copy

**FR — Caisse, réparations et gestion de magasin.**

J’ai conçu POS Téléphonie pour relier ce qui se passe au comptoir à ce qui se passe à l’atelier. Un appareil entre, un dossier se construit, un devis devient une facture, un paiement est enregistré. Chaque étape garde sa place, sans perdre le fil de l’intervention.

L’interface ne représente qu’une partie du travail. J’ai aussi construit les API, le modèle de données et les règles qui distinguent les dossiers, les documents commerciaux et les mouvements de paiement. Stock, impressions et reporting viennent compléter ce même produit.

**EN — Point of sale, repairs and shop operations.**

I built POS Téléphonie to connect the shop counter with the repair bench. A device comes in, a case takes shape, a quote becomes an invoice and a payment is recorded. Each step has its own place while remaining part of the same repair journey.

The interface is only part of the work. I also built the APIs, data model and rules that keep repair cases, commercial documents and payment movements distinct. Inventory, print output and reporting round out the same product.

## Easy Salaires

- Public source: https://github.com/DwennK/Easy-Salaires
- Public and local HEAD checked: `09a59f8b3b078e52b4143ad18271cbd82277580f`.
- Local read-only source: `/Users/dwenn/Documents/dev/Easy-Salaire`.
- Verified stack: Tauri 2, Vue 3, TypeScript, Rust and native SQLite (`rusqlite`).
- Evidence: `package.json`, `src-tauri/Cargo.toml`, `src/components/AnnualWorkspace.vue`, `src/domain`, `src/lib/documents.ts`, `src/lib/bridge.ts`, `src-tauri/src`, `README.md`.
- Verified capabilities: employee records; annual workspace showing twelve months; monthly/hourly salaries; supplements and deductions; payment tracking separate from computed net pay; payslip PDFs; revision history; annual CSV/Excel exports; local company databases and backup/restore.
- Free-use intent is supplied directly by Dwenn's brief. It is appropriate to explain the personal motivation to provide a free useful tool to small businesses. Do not imply a service warranty or legal certification.
- Payroll scope is configured and bounded: company insurance rates and employee contributions need confirmation; the source explicitly describes a 2026 CCNC/Neuchâtel preset. Do not present the app as guaranteeing general Swiss payroll compliance or as executing bank transfers.
- Browser demo uses a separate IndexedDB store. Native company databases were not accessed.

### Screenshot assets

| Public asset | Original | Dimensions | Evidence |
| --- | --- | --- | --- |
| `/images/projects/easy-salaires.webp` | `dwenn.ch/output/playwright/product-evidence/easy-salaires-annual.png` | 1440 × 1165 | Fresh capture on 2026-10-22 from untouched local v0.1.3, using “Essayer la démonstration”. |
| `/images/projects/easy-salaires-monthly.webp` | `dwenn.ch/output/playwright/product-evidence/easy-salaires-monthly.png` | 1440 × 1074 | Same isolated browser demo, actual monthly overview. |

The source `src/domain/demo.ts` explicitly creates “Atelier du Lac Sàrl”, Camille Favre, Alex Morel and Léa Perret as demonstration data (`demo: true`). The banner and DÉMO badge remain visible. Both captures were visually inspected and losslessly converted to WebP. No screenshots were fabricated or composited.

Capture procedure: installed Google Chrome, headless, isolated task-owned `dwenn-products-easy` session; viewport 1440 × 1000 set before interaction; fonts settled; screenshots of full actual layout. Zero console errors observed. The browser session was closed and the task-owned Vite process on port 1427 was stopped afterward.

Suggested bilingual caption:

- FR: « Démonstration d’Easy Salaires · entreprise, employés et montants fictifs. »
- EN: “Easy Salaires demo · fictional company, employees and amounts.”

### Suggested editorial copy

**FR — Une année de paie, au même endroit.**

J’ai créé Easy Salaires avec une idée simple : proposer aux petites entreprises un outil gratuit pour préparer leurs salaires, sans disperser les informations dans plusieurs fichiers. Un employé, ses douze mois, ses fiches et leur historique restent dans le même espace de travail.

Le produit fonctionne sur ordinateur avec une base SQLite locale. J’ai réuni une interface Vue, des calculs explicites, la génération des documents et une couche Rust pour les données. Les paramètres de paie restent à adapter à la situation de l’entreprise.

**EN — A full year of payroll, in one place.**

I created Easy Salaires around a simple idea: give small businesses a free tool for preparing payroll without scattering information across files. An employee, all twelve months, payslips and their history stay in one workspace.

The desktop app keeps its data in a local SQLite database. I brought together a Vue interface, explicit calculations, document generation and a Rust data layer. Payroll settings still need to reflect each company's circumstances.

## Canapey

- Public source: https://github.com/DwennK/canapey-launcher
- Public HEAD checked: `7fdbc66e6a1f672842b51d1779a6015f2e766f7f`.
- Local read-only source: `/Users/dwenn/Documents/dev/Canapey Launcher`, HEAD `a5ac80ebefc6b7b090099a50fb533c57a5a842ed` (two local commits ahead at inspection).
- Verified stack in current public package/README and local source: Tauri 2, Rust, Vue 3, TypeScript.
- Core evidence: `src/App.vue`, `src/components`, `src/lib`, `src-tauri/src/input.rs`, `runtime.rs`, `tracking.rs`, `platform/windows.rs`, `README.md`.
- Product target: Windows 11 x64 living-room PC. Large-focus interface, controller/keyboard navigation, personal library of Windows applications and shortcuts, carousel and library grid, app-specific imagery, launch/session handling.
- Status: experimental `0.x` project, currently 0.5.0 in source. Native Windows and physical-controller interactive checks remain distinct from compilation/browser UI checks. The iPhone remote, Xbox-home and Flirc paths must not be portrayed as fully proven hardware capabilities. The portfolio can omit these experimental details entirely and state the overall experimental status.
- Do not imply a native Mac/Linux launcher, automatic comprehensive Steam-library synchronization, a released Silo product, or installed app detection from cards marked “À ajouter”.

### Screenshot assets

| Public asset | Original | Dimensions | Evidence |
| --- | --- | --- | --- |
| `/images/projects/canapey.webp` | `canapey-launcher/docs/images/home.png` | 1440 × 900 | Official project README screenshot of the real browser UI. |
| `/images/projects/canapey-ambience.webp` | `canapey-launcher/docs/images/ambience.png` | 1440 × 900 | Official project README screenshot with Spotify suggestion selected. |

README explicitly labels them actual browser previews, with unavailable native Windows actions and suggestions rather than detected installs. Both were visually inspected and optimized to quality-88 WebP. Original image bytes are retained in the source repository. Avoid using the library screenshot as a principal image because it includes a future Silo suggestion irrelevant to this portfolio's three-product selection.

Suggested bilingual caption:

- FR: « Interface réelle en aperçu web · projet expérimental pour Windows. »
- EN: “Actual interface in browser preview · experimental Windows project.”

### Suggested editorial copy

**FR — J’ai créé le launcher dont j’ai toujours rêvé.**

Un PC dans le salon, c’est beaucoup de possibilités. Mais je voulais pouvoir en profiter depuis le canapé, avec une manette et une interface pensée pour la télévision. Alors j’ai construit Canapey.

Une bibliothèque personnelle, une navigation lisible à distance et une ambiance qui change avec l’application : j’ai travaillé le passage entre le choix à l’écran et les fonctions natives de Windows. Le projet reste expérimental ; c’est aussi un terrain où je pousse ma curiosité pour les interfaces et le logiciel desktop.

**EN — I built the launcher I had always wanted.**

A living-room PC opens up plenty of possibilities. I wanted to enjoy them from the sofa, with a controller and an interface designed for the television. So I built Canapey.

A personal library, navigation that reads clearly from across the room, and a different atmosphere for each app: I worked on the connection between what you choose on screen and Windows' native behaviour. It remains an experimental project, and a place to explore my curiosity about interfaces and desktop software.

## Editorial boundaries

- The portfolio may present authorship, purpose, implemented scope and verified stack.
- No adoption, revenue, performance benchmark, commercial deployment or hardware compatibility claim is established by this research.
- Public pages should use simple labels and useful captions. Internal source hashes and verification details belong here rather than in visitor-facing prose.
- These product screenshots may be placed into generated environments, but their actual UI pixels and content must not be replaced by invented interfaces.
