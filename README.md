# Rénov'auto – Site statique

Site vitrine pour le garage Rénov'auto, full **HTML / CSS / JavaScript**.

## Pages

- `index.html` : accueil, présentation garage + 3 véhicules au hasard.
- `centre_auto.html` : liste de tous les véhicules avec filtres + tri.
- `vo.html` : fiche détaillée d'un véhicule (galerie + options "Afficher plus").
- `ethanol.html` : page à remplir sur la prestation Éthanol.
- `assets/css/style.css` : thème clair moderne.
- `assets/js/vo_data.js` : données des véhicules (généré automatiquement).
- `assets/js/index_page.js` : logique page d'accueil.
- `assets/js/centre_auto.js` : filtres + tri.
- `assets/js/vo_page.js` : fiche VO.
- `scripts/generateVoData.mjs` : génère vo_data.js à partir du dossier `vo/`.
- `update_vo_and_push.command` : génère vo_data.js + git commit + git push.

## Ajouter un véhicule

1. Créez un dossier dans `vo/`, par exemple :

   `vo/ford_c-max_dv698cb/`

2. Mettez les photos dans ce dossier (`1.jpg`, `2.jpg`, `3.png`, etc.).
   Tous les formats suivants sont acceptés : `.jpg`, `.jpeg`, `.png`, `.webp`, `.gif`.

3. Ajoutez un fichier `infos.txt` (ou `infos.text`) dans ce dossier :

   Exemple :

   title = Ford C-MAX 1.0 EcoBoost 125 S&S Titanium
   prix = 8500
   annee = 2015
   km = 116980
   carburant = Essence
   boite = Manuelle
   puissance = 125 ch (6 CV)
   couleur = Grise
   resume = Ford C-Max très propre, entretien à jour, prêt à partir. Idéal pour la famille, confortable et bien équipé.
   options =
   3 appuis-tête AR
   3 sièges AR indépendants rabattables et déposables
   Climatisation automatique bizone
   Aide au démarrage en côte
   Aide au stationnement AR
   Régulateur et limiteur de vitesse
   Allumage auto des feux et essuie-glaces
   Système Audio Nav Sync 3 avec écran tactile

4. À la racine du projet, lancez :

   ./update_vo_and_push.command

   ou double-cliquez sur le fichier sur macOS.

5. Le script va :

   - générer `assets/js/vo_data.js`,
   - faire un `git add vo assets/js/vo_data.js`,
   - faire un commit,
   - pousser sur GitHub.

6. Sur le site (GitHub Pages par exemple) :

   - Le véhicule sera visible sur `centre_auto.html`,
   - Le bouton "Voir la fiche" ouvrira la page `vo.html?id=<id_du_dossier>`.

> Astuce : l'`id` utilisé dans l'URL est le nom du dossier VO (sauf si `id =` est défini dans `infos.txt`).
