# Sitemap automatique Astro

L’ancien endpoint XML fait maison a été remplacé par l’intégration officielle [`@astrojs/sitemap`](https://docs.astro.build/en/guides/integrations-guide/sitemap/), version 3.7.4, configurée dans `astro.config.mjs`.

## Génération

`npm run build` découvre automatiquement les pages statiques Astro, y compris celles produites par `getStaticPaths()`, et écrit `dist/sitemap-index.xml` et `dist/sitemap-0.xml`. Les nouvelles pages Astro sont incluses sans ajout à une liste de sitemap. Les pages d’erreur et endpoints ne sont pas inclus.

La fonction officielle `serialize` utilise la table existante de `src/content/site.ts` uniquement pour associer les traductions : `/realisations/` avec `/en/work/`, par exemple. Elle conserve aussi `x-default` vers le français, comme le head HTML. Une page sans correspondance dans cette table reste incluse automatiquement.

`src/pages/robots.txt.ts` génère robots.txt avec le domaine Astro et l’index du sitemap. Le layout contient un lien de découverte. `public/_redirects` conserve l’ancienne adresse `/sitemap.xml` avec une redirection permanente vers `/sitemap-index.xml`.

## Validation du 22 octobre 2026

- Build : 37 fichiers contrôlés, zéro erreur, avertissement ou hint.
- XML parsé : 14 URL uniques, exactement les pages canoniques du build ; aucune 404, API ou ancienne URL.
- Chaque entrée possède les liens FR, EN et x-default identiques au head HTML. Liens réciproques, URL HTTPS absolues, slash final cohérent.
- Prévisualisation du build : les deux XML et robots.txt répondent 200 avec le bon type de contenu ; les 14 pages répondent 200 ; l’ancienne URL répond 301 vers l’index.
- Six nouveaux paquets, aucune version de dépendance préexistante modifiée.
- Rapport : `output/qa/sitemap/report.json`.

## Publication et Google Search Console

Publié le 22 octobre 2026 sur https://dwenn.ch avec la version Cloudflare `edb80123-35f7-4590-85dc-d0f4d51ff369`. Les deux XML et robots.txt sont accessibles en production. L’ancien sitemap redirige vers l’index.

L’URL https://dwenn.ch/sitemap-index.xml a été envoyée depuis Helium à la propriété de domaine `dwenn.ch` dans Google Search Console. Après actualisation, Google affiche « Index de sitemaps », « Opération effectuée » et une dernière lecture au 22 octobre 2026. Le compteur reste à 0 page découverte au moment du contrôle ; cela ne confirme pas encore l’indexation des pages. Aucune seconde soumission effectuée.

Preuves : `output/releases/2026-10-22-sitemap/search-console.png` et `live-check.json`.
