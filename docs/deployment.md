# Publication du 22 octobre 2026

La demande « Publie déjà ça sur dwenn.ch, ensuite… » a été exécutée dans cet ordre : publication de la refonte sombre existante, puis enrichissement local des interactions.

## Version publiée

- Domaine : https://dwenn.ch
- Worker Cloudflare : `dwenn` ; domaine personnalisé existant.
- Version publiée : `c834b42e-6a8c-498a-b09c-326e9522a084`.
- Version précédente : `818bd164-7867-4850-af51-e09134fd5ced`.
- Outil : Wrangler 4.152.0, authentification OAuth existante.
- Message de déploiement : `Publish rebuilt bilingual developer portfolio`.
- Configuration et bindings Worker existants conservés ; assets servis depuis `dist`.
- Aucun commit ni push Git.

## Sauvegarde et preuves

Avant toute modification interactive, archive de la source et du build : `output/releases/2026-10-22-baseline/source-dist.tgz` ; sommes SHA-256 dans `hashes.txt`. Bundle du dry-run conservé dans `bundle/`. Le dry-run puis le déploiement réel ont réussi ; 41 fichiers d’assets nouveaux ou modifiés téléversés.

Vérification publique terminée à `2026-10-22T20:49:56.205Z` : 14 routes HTTP 200, nouveau design confirmé, contrôles Chrome desktop 1440×900 et mobile 390×844, changement des onglets, aucun débordement ni erreur JavaScript. Configuration publique du contact : `configured:true`. Aucun message n’a été envoyé ; ce contrôle ne prouve pas la livraison d’un e-mail.

Rapport machine : `output/releases/2026-10-22-baseline/deployment.json`. Captures : `live-desktop.png` et `live-mobile.png` dans le même dossier.

## Travail effectué ensuite

La console avec code source, démonstration Canapey, palette de navigation et nouvelles animations a été ajoutée et contrôlée **après** cette publication. Ce travail est visible sur http://127.0.0.1:4399/ (build) et http://127.0.0.1:4321/ (développement). Il n’a pas été publié avec la version ci-dessus.


## Publication de la version interactive

L’instruction suivante « publie » autorise la seconde publication. Le build a été relancé à 23:16:52 Europe/Zurich : 37 fichiers contrôlés, aucun diagnostic, 15 pages et sitemap. L’état distant avant publication était toujours `c834b42e-6a8c-498a-b09c-326e9522a084`.

Déploiement réussi avec Wrangler 4.152.0 : 37 assets modifiés, Worker et bindings existants conservés, domaine personnalisé https://dwenn.ch. Nouvelle version **`4135251f-18a5-4cf5-99c7-0320b4224a61`** ; message `Publish interactive project explorer and homepage animations`.

L’archive exacte avant publication est `output/releases/2026-10-22-interactive/source-dist.tgz`, avec sommes SHA-256 dans `hashes.txt` et métadonnées dans `deployment.json`. Aucun commit ni push Git. Le navigateur intégré affiche désormais le domaine public.


Vérification en production : 14 routes HTTP 200 ; les assets JavaScript de la homepage correspondent au build publié. Sur Chrome desktop 1440×900 : onglets, extraits de code, agrandissement, retour du focus, démo Canapey et recherche rapide fonctionnent, sans erreur JavaScript ni débordement. Sur Chrome mobile 390×844 (anglais) : 35 contrôles réussis, dont interactions tactiles et recherche accentuée, sans erreur console, requête échouée ou envoi de données. La configuration publique du contact reste active ; aucun e-mail n’a été envoyé.

Preuves de cette publication dans `output/releases/2026-10-22-interactive/` : `live-desktop.json`, `live-desktop.png`, `live-desktop-code.png`, `live-mobile.json` et captures mobiles associées. Sessions Chrome isolées fermées ; aucun profil personnel utilisé.


## Publication du sitemap officiel Astro

Après la demande de sitemap automatique, l’utilisateur a demandé son ajout à Google Search Console depuis Helium. Le sitemap a été publié avant sa soumission. Build du 22 octobre à 23:26 Europe/Zurich : 37 fichiers contrôlés, aucun diagnostic, 15 pages et les fichiers XML générés par `@astrojs/sitemap`.

Wrangler 4.152.0 a publié 17 assets nouveaux ou modifiés sur le Worker `dwenn`, avec les bindings existants. Version **`edb80123-35f7-4590-85dc-d0f4d51ff369`**, précédente `4135251f-18a5-4cf5-99c7-0320b4224a61`. Message : `Publish official Astro sitemap integration`. Aucun commit ni push Git.

Archive avant publication : `output/releases/2026-10-22-sitemap/source-dist.tgz`, sommes SHA-256 dans `hashes.txt`. Contrôles publics dans `live-check.json` ; métadonnées dans `deployment.json`.

Soumission unique de https://dwenn.ch/sitemap-index.xml depuis l’onglet Helium existant, propriété `dwenn.ch`. Google a confirmé « Sitemap envoyé », puis « Opération effectuée » après actualisation, type « Index de sitemaps », dernière lecture au 22 octobre 2026. La première réponse « Impossible de récupérer le sitemap » était transitoire ; aucun changement serveur ni seconde soumission n’a été nécessaire. À ce stade, Google affichait 0 page découverte : l’indexation n’est pas confirmée. Capture `search-console.png` dans le dossier de publication.
