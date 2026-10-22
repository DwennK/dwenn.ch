# Dwenn Kaufmann — portfolio

Portfolio Astro / TypeScript, français à la racine et anglais sous `/en/`. La refonte sombre a été publiée sur https://dwenn.ch le 22 octobre 2026. Les interactions supplémentaires décrites ci-dessous ont été publiées ensuite sur demande.

## Lancer

Le projet utilise pnpm 12.15.0, fixé dans `package.json`. Le fichier `pnpm-lock.yaml` est la référence pour les installations reproductibles.

```sh
pnpm install --frozen-lockfile
pnpm dev
```

Développement : `http://127.0.0.1:4321`. Pour une prévisualisation de la compilation :

```sh
pnpm build
pnpm preview --port 4399
```

Prévisualisation : `http://127.0.0.1:4399`. Les deux serveurs ne chargent **aucun secret** et utilisent le vrai Worker avec des bindings vides : le formulaire affiche explicitement son indisponibilité locale et propose `hello@dwenn.ch`. Les succès, erreurs et protections sont testés avec des fournisseurs simulés, sans envoi réel.

## Modifier le contenu

- `src/content/site.ts` : coordonnées, routes équivalentes, navigation, `childhoodPhoto` (vide volontairement).
- `src/content/projects.ts` : trois produits, leurs textes FR/EN, captures, stacks et statuts.
- `src/content/about.ts` : parcours, compétences, influences et crédits Nintendo.
- `src/content/peaks.ts` : sites clients.
- `src/components/` : compositions des pages ; `src/styles/global.css` : tokens et règles partagées.
- `src/components/HomePage.astro` et `src/scripts/home.ts` : accueil, console à trois projets, agrandissement FLIP, clavier et animations GSAP avec reduced-motion.
- `src/content/project-inspector.ts` et `src/components/ProjectInspector.astro` : neuf vrais extraits de code, explications FR/EN et sources GitHub aux commits fixes.
- `src/components/CanapeyPlayground.astro`, `src/scripts/canapey-playground.ts`, `src/lib/canapey-navigation.ts` : démonstration de navigation Canapey, sans lancement d’applications.
- `src/components/HomeCommands.astro` et `src/scripts/commands.ts` : navigation rapide filtrable avec ⌘/Ctrl+K.
- `src/scripts/peaks-motion.ts` : animations des projets clients, activées sur l’accueil uniquement.

Les sources des images et les faits vérifiés sont consignés dans `docs/`. La version retenue utilise des interfaces, sites, portrait et illustrations de jeux réels. Les décors ImageGen de la première proposition rejetée ont été retirés du site et conservés dans `output/archive-v1/`.

## Vérifications

```sh
pnpm check
pnpm test
pnpm build
PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1 node scripts/site-qa.mjs
PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1 node scripts/layout-qa.mjs
PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1 node scripts/interaction-qa.mjs
```

La QA navigateur requiert Google Chrome installé et la preview sur le port 4399. Elle utilise un contexte isolé, sans profil personnel et sans télécharger de navigateur. Preuves locales dans `output/qa/` et `output/playwright/`. Rapport synthétique : `docs/validation.md`.

## Worker et migration

`worker.mjs`, les routes `/api/contact` et `/api/contact/config`, Turnstile, la limitation d’envoi et le binding d’e-mail préexistants sont préservés. Le changement de configuration Cloudflare est limité à `assets.directory = "./dist"`. Les anciennes pages `index.html`, `work.html` et leurs scripts/styles restent conservés à la racine pour préserver le travail antérieur ; Astro sert désormais les pages de `src/`.

`public/_redirects` conserve les anciennes URL HTML. Les liens directs vers les projets, Peaks, À propos et Contact sont disponibles sur l’accueil et la page Projets. Le site génère les métadonnées FR/EN et hreflang. Le sitemap utilise l’intégration officielle `@astrojs/sitemap` : chaque `pnpm build` découvre les pages Astro et produit `dist/sitemap-index.xml` et `dist/sitemap-0.xml`. Aucune liste d’URL de sitemap à maintenir. La table de routes existante sert uniquement à associer les traductions ; `robots.txt` reprend automatiquement le domaine configuré dans Astro. L’ancienne URL `/sitemap.xml` redirige en 301 vers l’index. Voir `docs/sitemap.md` pour la validation et le statut de publication.

La version enrichie avec le sitemap officiel Astro est en production : version Cloudflare `edb80123-35f7-4590-85dc-d0f4d51ff369`. La version précédente `4135251f-18a5-4cf5-99c7-0320b4224a61` reste identifiée pour un retour arrière. Le sitemap a été soumis à Google Search Console le 22 octobre 2026, avec le statut « Opération effectuée ». Le détail, les sauvegardes et les vérifications sont dans `docs/deployment.md`. Les sources sont versionnées sur GitHub ; les captures de QA et archives de publication restent locales dans `output/`.
