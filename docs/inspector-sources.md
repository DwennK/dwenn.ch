# Sources de l’inspecteur de projets

Vérifié le 22 octobre 2026. Données exportées par `src/content/project-inspector.ts`.

Les trois dépôts ont été confirmés **publics** via le connecteur GitHub. Les neuf extraits ont été relus directement sur GitHub au SHA indiqué, puis comparés caractère par caractère après retrait de la seule indentation commune. Aucun token, commentaire ou retour de ligne interne n’a été réécrit. Chaque extrait comprend entre 5 et 12 lignes consécutives ; les fragments partiels restent des extraits, pas des programmes autonomes.

Les lectures locales ont servi à repérer les fichiers. Les liens et les lignes publiés viennent toujours du code distant au commit fixé. Aucun dépôt produit, fichier de données applicatives, base, journal ou secret n’a été modifié ou ouvert. Les captures existantes n’ont pas changé.

## POS Téléphonie

Dépôt : [DwennK/004-Nuxt](https://github.com/DwennK/004-Nuxt). Commit : [`d4a2ae39c6c8ae82fa13f621b733a186b78d6f92`](https://github.com/DwennK/004-Nuxt/commit/d4a2ae39c6c8ae82fa13f621b733a186b78d6f92).

| Rôle | Fichier et lignes | Lignes | Source du fichier (SHA Git) |
| --- | --- | ---: | --- |
| Encaisser le solde | [`app/components/pos/DocumentPaymentsEditor.vue:546–554`](https://github.com/DwennK/004-Nuxt/blob/d4a2ae39c6c8ae82fa13f621b733a186b78d6f92/app/components/pos/DocumentPaymentsEditor.vue#L546-L554) | 9 | `fb88feaf1af751492006a8d8d73974fc91dc9adc` |
| Vérifier la demande | [`server/api/documents/[id]/mark-paid.post.ts:8–14`](https://github.com/DwennK/004-Nuxt/blob/d4a2ae39c6c8ae82fa13f621b733a186b78d6f92/server/api/documents/[id]/mark-paid.post.ts#L8-L14) | 7 | `839521b9d0864a9b2ea4e11ee38119ed3d32d547` |
| Relier paiement et facture | [`server/db/schema.ts:294–305`](https://github.com/DwennK/004-Nuxt/blob/d4a2ae39c6c8ae82fa13f621b733a186b78d6f92/server/db/schema.ts#L294-L305) | 12 | `49cdfd2c97560fb965a4d8a5a009297eef4c6464` |

- **Interface** : Nuxt, Vue, Nuxt UI. L’écran permet de saisir et de suivre les paiements.
- **Serveur** : Nuxt server, TypeScript, Cloudflare Workers. L’API contrôle les droits et valide les données avant l’enregistrement.
- **Données** : Drizzle, Turso / libSQL. Les paiements sont reliés aux documents dans la base de données.

Stack confirmée dans [package.json](https://github.com/DwennK/004-Nuxt/blob/d4a2ae39c6c8ae82fa13f621b733a186b78d6f92/package.json) et [nuxt.config.ts](https://github.com/DwennK/004-Nuxt/blob/d4a2ae39c6c8ae82fa13f621b733a186b78d6f92/nuxt.config.ts). Le bouton appelle le parcours d’enregistrement des paiements ; l’API sélectionnée vérifie les droits, les paramètres, le corps et la clé d’idempotence. Le schéma conserve les paiements séparément des documents. Cela ne décrit pas une passerelle bancaire.

## Easy Salaires

Dépôt : [DwennK/Easy-Salaires](https://github.com/DwennK/Easy-Salaires). Commit : [`09a59f8b3b078e52b4143ad18271cbd82277580f`](https://github.com/DwennK/Easy-Salaires/commit/09a59f8b3b078e52b4143ad18271cbd82277580f).

| Rôle | Fichier et lignes | Lignes | Source du fichier (SHA Git) |
| --- | --- | ---: | --- |
| Les totaux de la vue annuelle | [`src/components/AnnualWorkspace.vue:99–108`](https://github.com/DwennK/Easy-Salaires/blob/09a59f8b3b078e52b4143ad18271cbd82277580f/src/components/AnnualWorkspace.vue#L99-L108) | 10 | `7a8bc230544da095570278e272364ea6b0668540` |
| Le calcul du salaire net | [`src/domain/payroll.ts:411–422`](https://github.com/DwennK/Easy-Salaires/blob/09a59f8b3b078e52b4143ad18271cbd82277580f/src/domain/payroll.ts#L411-L422) | 12 | `fb8c215d4137a4d1c1dda606135ca9cbfe231e36` |
| L’enregistrement d’une révision | [`src-tauri/src/storage.rs:361–371`](https://github.com/DwennK/Easy-Salaires/blob/09a59f8b3b078e52b4143ad18271cbd82277580f/src-tauri/src/storage.rs#L361-L371) | 11 | `d4787088602018f63d61f7d162a33164aa1affbf` |

- **Interface** : Vue 3, TypeScript. Une interface Vue pour consulter l’année de paie et les montants enregistrés.
- **Calculs** : TypeScript, Decimal.js. Les règles de paie sont calculées en TypeScript, avec des utilitaires monétaires utilisant Decimal.js.
- **Données locales** : Tauri 2, Rust, SQLite, rusqlite. La couche native Rust utilise SQLite pour conserver les données et les révisions de fiches sur l’ordinateur.

Stack confirmée dans [package.json](https://github.com/DwennK/Easy-Salaires/blob/09a59f8b3b078e52b4143ad18271cbd82277580f/package.json) et [Cargo.toml](https://github.com/DwennK/Easy-Salaires/blob/09a59f8b3b078e52b4143ad18271cbd82277580f/src-tauri/Cargo.toml). Les calculs métier sont en TypeScript ; Rust assure notamment la persistance native. L’extrait de calcul n’est pas une spécification complète de la paie et ne constitue pas une garantie de conformité. L’extrait SQLite appartient au chemin transactionnel de sauvegarde d’une révision et de son PDF.

## Canapey

Dépôt : [DwennK/canapey-launcher](https://github.com/DwennK/canapey-launcher). Commit : [`7fdbc66e6a1f672842b51d1779a6015f2e766f7f`](https://github.com/DwennK/canapey-launcher/commit/7fdbc66e6a1f672842b51d1779a6015f2e766f7f).

| Rôle | Fichier et lignes | Lignes | Source du fichier (SHA Git) |
| --- | --- | ---: | --- |
| Activer une application | [`src/components/AppCard.vue:52–58`](https://github.com/DwennK/canapey-launcher/blob/7fdbc66e6a1f672842b51d1779a6015f2e766f7f/src/components/AppCard.vue#L52-L58) | 7 | `f4ec4624614462dd4ac42047db1c7f8c9766d79b` |
| Appeler le code natif | [`src/lib/bridge.ts:73–78`](https://github.com/DwennK/canapey-launcher/blob/7fdbc66e6a1f672842b51d1779a6015f2e766f7f/src/lib/bridge.ts#L73-L78) | 6 | `2b71263ee871f5f52427070eae24e66ea2488ac5` |
| Lancer ou retrouver | [`src-tauri/src/runtime.rs:468–477`](https://github.com/DwennK/canapey-launcher/blob/7fdbc66e6a1f672842b51d1779a6015f2e766f7f/src-tauri/src/runtime.rs#L468-L477) | 10 | `bc23e1df7131cc304b4b5901b038880694728b9c` |

- **Interface** : Vue 3, TypeScript. Affiche les applications et gère leur sélection.
- **Commandes** : Tauri 2, TypeScript. Transmet les actions de l’interface au code natif.
- **Windows** : Rust, Windows APIs. Lance les applications et suit leurs processus.

Stack confirmée dans [package.json](https://github.com/DwennK/canapey-launcher/blob/7fdbc66e6a1f672842b51d1779a6015f2e766f7f/package.json) et [Cargo.toml](https://github.com/DwennK/canapey-launcher/blob/7fdbc66e6a1f672842b51d1779a6015f2e766f7f/src-tauri/Cargo.toml). Le code natif cible Windows ; les commandes du pont Tauri sont indisponibles dans l’aperçu web. Le projet reste expérimental. Le code source établit l’implémentation, pas une validation interactive sur un PC Windows ou une manette physique. Le fichier local AppCard.vue diffère du fichier public : les lignes 52–58 ont bien été prises sur GitHub.

## Contrat d’utilisation dans l’interface

- `projectInspectors` est indexé par `ProjectKey` : `pos`, `salaires`, `canapey`.
- Chaque projet contient exactement trois `roles` et trois `excerpts`, dans le même ordre. Les clés sont `interface / logic / data` pour POS et Easy Salaires, `interface / commands / runtime` pour Canapey.
- `label` et `description` sont disponibles en français et en anglais. `startLine` permet de numéroter le code avec les numéros de la source.
- Les trois rôles décrivent un parcours architectural simplifié. Ils ne prétendent pas constituer une trace d’exécution exhaustive ni un appel direct entre chacun des trois fragments.
- Afficher le code comme texte, avec la langue de coloration indiquée, et conserver l’action vers `source`. Les explications et les schémas peuvent être animés ; les extraits restent les mêmes.
- Les URLs pointent vers des commits immuables et des ancres de lignes. Une future actualisation doit relire les sources et recalculer les lignes, sans remplacer seulement le SHA.

## Validation

Les neuf comparaisons distantes sont exactes après désindentation commune. Leur longueur et la correspondance `endLine - startLine + 1` ont été vérifiées. Le contrôle TypeScript ciblé passe avec `node node_modules/typescript/bin/tsc --ignoreConfig --noEmit --target es2022 --module esnext --moduleResolution bundler src/content/project-inspector.ts`.

Les dépôts produits ont été consultés en lecture seule. Aucune publication, migration, exécution d’application métier ou action Git n’a été effectuée pour cette tâche.
