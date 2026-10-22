# Validation — 22 octobre 2026

## Refonte initiale

Portfolio Astro / TypeScript refait après le rejet de la première direction : fond sombre, typographie Archivo, texte FR/EN réécrit, applications réelles au premier plan. Accueil reconstruit autour d’une console de trois projets, sans la longue scène épinglée. Pages Projets, À propos, Contact et trois études de cas dans les deux langues ; 404 et sitemap.

Prévisualisation compilée : http://127.0.0.1:4399/ . Le navigateur intégré affiche cette version. Développement : http://127.0.0.1:4321/ .

## Contrôles réussis

- `npm run build` : 29 fichiers contrôlés, 0 erreur, 0 avertissement, 0 hint ; 15 pages construites, plus sitemap. Dernière compilation : 22:23:34 Europe/Zurich.
- `npm test` : 20 tests du Worker réussis, fournisseurs simulés exclusivement.
- `scripts/site-qa.mjs` : 28 vues (14 routes × desktop 1440×900 / mobile 390×844), aucune erreur JavaScript, image cassée, page manquante ou largeur débordante. Un H1 par page ; métadonnées et liens FR/EN inspectés.
- 24 liens/ressources internes contrôlés ; anciennes routes redirigées en 301 ; pages inconnues en 404.
- Console d’accueil : trois onglets au clic et au toucher, un seul panneau actif, flèches clavier/Home/End, lien de projet, compte affiché, retour de scroll rapide, reduced-motion.
- Menu mobile : ouverture, fermeture par Escape, retour du focus, navigation. Skip-link au premier Tab. Langue et retour navigateur testés.
- Contrôle supplémentaire des 14 routes à 320×740, 390×844, 768×1024 et 1265×714 : aucun texte détecté hors écran ni débordement.
- Études de cas : 12 variantes inspectées visuellement et 12 nouveaux tests de pied de page après retrait d’un contact redondant. Liens d’agrandissement, GitHub, projet suivant, retour et contact vérifiés.
- Contact FR/EN : 20 contrôles navigateur de validation, focus, états attente/succès/429/indisponibilité, conservation du brouillon et absence de double envoi. Quatre POST simulés, zéro envoi réel. Contrastes mesurés sur les éléments principaux et de formulaire : 7,11:1 à 16,56:1.
- À propos, jeux, sites Peaks, page Projets et accueil : captures effectivement regardées sur desktop/mobile. Revue interactive supplémentaire dans le navigateur intégré, dont changement d’onglet et scroll aller/retour.
- `git diff --check` : réussi. Cette première validation précédait la publication demandée ensuite ; voir `deployment.md`. Aucun commit ni push.

## Corrections pendant la revue

La première direction colorée a été entièrement remplacée. La seconde passe a corrigé le débordement du menu mobile, l’espacement des mots autour des sauts de ligne, les offsets d’ancre, les tailles tactiles, la répétition de contact et un conflit entre animation d’entrée et opacité au retour de scroll. Les contrôles concernés ont été relancés avec succès.

## Preuves

- `output/qa/rebuild/report.json` : suite finale, zéro échec.
- `output/qa/rebuild/` : accueil, trois panneaux, mobile, reduced-motion et sections.
- `output/qa/site/layout-report.json` : contrôle complémentaire multi-largeurs.
- `output/qa/projects-dark/` : études de cas et pieds de page finaux.
- `output/qa/about-v2-preview/` : À propos et Peaks.
- `output/playwright/contact-dark-final-*.png` : contact.

## Limites et périmètre

Les vérifications mobiles utilisent Chrome en émulation, pas un téléphone physique. Les tests ont utilisé Google Chrome installé, des profils isolés et aucune session personnelle ; les sessions headless ont été fermées.

Le vrai Worker préexistant est préservé. Les serveurs locaux ne chargent aucun secret ni binding d’envoi : `/api/contact/config` répond `configured:false`. Le formulaire annonce donc son indisponibilité locale. Aucun test d’envoi réel ou de livraison fournisseur n’a été effectué.

Les captures de produits sont réelles ; les données de démonstration sont signalées. Canapey est présenté comme expérimental, Easy Salaires ne promet aucune conformité juridique automatique. Les faits et sources sont consignés dans les autres documents du dossier.

Les anciens fichiers HTML/CSS/JS et modifications Worker présents avant le travail restent conservés. La modification de configuration propre à Astro est `assets.directory = "./dist"`. La photo d’enfance reste vide ; aucune photo fictive n’a été créée.


## Enrichissement interactif après publication

Cette seconde version conserve la direction sombre et les captures réelles. Elle reste locale : la production contient la refonte initiale publiée à la demande de l’utilisateur.

- Une console unique : trois projets, modes Aperçu / Code, et Essayer pour Canapey. Les trois couches de chaque projet ouvrent directement l’extrait correspondant.
- Neuf extraits réels, coloration syntaxique au build, copie et liens immuables vers GitHub. Provenance dans `inspector-sources.md`.
- Agrandissement de la même console dans un dialogue natif avec transition GSAP FLIP, état conservé, focus capturé/restauré, Escape et clic hors du dialogue.
- Démonstration de la navigation Canapey : fonction réelle de sélection, carrousel/grille, fonds et logos du dépôt, clavier limité à la démo et commandes tactiles. Aucune application n’est lancée.
- Palette de navigation ⌘/Ctrl+K avec filtrage, accents, flèches, Enter, Escape, neuf destinations FR/EN et protection contre l’ouverture de deux dialogues.
- Entrée du titre par lettres, apparition de la console, inclinaison discrète au pointeur, révélations des sites clients, label de lien au pointeur/focus et parallaxe. Les préférences de mouvement réduit sont respectées.
- Trois volets de compétences dans l’introduction desktop, textes courts FR/EN.

### Résultats de la seconde passe

- `scripts/interaction-qa.mjs` : huit parcours complets FR/EN à 1440×900, 390×844, 320×740 et 768×1024. Tous passent : 3 projets × 3 sources, liens immuables, copie exacte, clavier, agrandissement, retour du focus, absence de débordement et d’erreurs JavaScript. Les deux dernières tailles utilisent reduced-motion.
- Suite globale relancée : 28 vues, 24 liens, zéro échec. Contrôle des mises en page : 56 vues, zéro coupe de texte ni débordement.
- Canapey : carrousel/grille, sélection, état conservé en agrandissant, chargement différé des fonds, Escape en deux étapes, FR/EN desktop/mobile et reduced-motion vérifiés ; 10 assertions sur les fonctions pures passent.
- Peaks : hover, focus, retour de défilement, mobile, reduced-motion et nettoyage/reprise vérifiés. Pas d’activation sur les autres pages.
- Inspection réelle des captures desktop/mobile et utilisation de la console/code agrandi dans le navigateur intégré.

Preuves : `output/qa/interactive/report.json`, `output/qa/interactive/`, `output/qa/peaks-motion/report.json`, `output/playwright/canapey/report.json`, `output/qa/rebuild/report.json`, `output/qa/site/layout-report.json`.


### Livraison locale finale

- Build final à 23:09:09 Europe/Zurich : 37 fichiers contrôlés, 0 erreur, 0 avertissement, 0 hint ; 15 pages et sitemap. Les 20 tests Worker ont été relancés avec succès, uniquement avec fournisseurs simulés.
- Palette : 42 contrôles réussis, dont clavier, tactile, recherche FR/EN, écran court 390×500 et préférences de mouvement réduit. Captures `output/playwright/commands-final-*.png`.
- Deux corrections d’accessibilité de l’inspecteur : orientation verticale/Haut-Bas sur desktop, horizontale/Gauche-Droite sur mobile ; annonce de copie par région live. Validation FR/EN sur le build final : `output/qa/interactive/a11y-final.json`.
- Commandes et code agrandis sur mobile. Nouvelle vérification des sept vues de projets, dans les deux langues, à 1440, 390, 320 et 768 px : zéro débordement dans la page, les barres de modes et les dialogues. Rapport `output/qa/interactive/layout-final.json`.
- Captures finales inspectées : `final-workspace.png`, `final-mobile-code.png` dans `output/qa/interactive/`. Le navigateur intégré conserve l’aperçu local avec la démo Canapey ouverte.
- `git diff --check` propre. Aucun commit ni push ; aucune seconde publication. Sessions de test Chrome fermées.


## Publication après validation

Après l’instruction explicite « publie », la version enrichie a été déployée sur https://dwenn.ch : `4135251f-18a5-4cf5-99c7-0320b4224a61`. Nouveau build à 23:16:52, sans diagnostic. Vérifications en production réussies : 14 routes, assets du build concordants, parcours interactifs desktop et 35 contrôles mobile anglais. Aucune erreur console ni débordement, aucun e-mail envoyé. Le détail et les preuves se trouvent dans `deployment.md` et `output/releases/2026-10-22-interactive/`. Aucun commit ni push Git.
