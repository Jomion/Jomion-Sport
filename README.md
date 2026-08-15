# Jomion-Sport — site web (V2)

Site statique multisports (HTML5 / CSS3 / JavaScript vanilla), sans serveur ni base de données, hébergé gratuitement sur **GitHub Pages**.

Cette V2 remplace l'ancien nom « Foot Afrique Analyse » par **Jomion-Sport** et rend le site multisports (Football ⚽, Basketball 🏀, Tennis 🎾, et d'autres sports si besoin). Le design, la navigation, les animations et les fonctionnalités de la version précédente ont été conservés.

## 1. Fichiers modifiés dans cette V2

- `index.html` — nouvelle identité, section « Sports disponibles »
- `pronostics.html` — filtres par sport, nouvelle structure de pronostic
- `analyses.html` — exemples multisports clairement identifiés « Exemple »
- `actualites.html` — filtres par sport pour les articles
- `guide.html` — textes adaptés au multisport
- `contact.html` — nouvelle identité
- `apropos.html` renommé en **`a-propos.html`** — contenu adapté au multisport
- `css/style.css` — styles pour les onglets de sport, badges et états vides
- `js/script.js` — entièrement restructuré : tableaux `PRONOSTICS` / `ARTICLES` multisports, filtres, données vides par défaut
- `assets/favicon.svg` — nouveau favicon monogramme « JS »
- `README.md` — ce fichier

## 2. Structure complète du projet

```
jomion-sport/
├── index.html
├── pronostics.html
├── analyses.html
├── actualites.html
├── guide.html
├── a-propos.html
├── contact.html
├── admin.html
├── css/
│   ├── style.css
│   └── admin.css
├── js/
│   ├── script.js
│   ├── supabase-client.js
│   └── admin.js
├── assets/
│   └── favicon.svg
└── README.md
```

## 3. Remplacer les anciens fichiers sur GitHub

Si votre dépôt contient encore les anciens fichiers « Foot Afrique Analyse » :

1. Ouvrez votre dépôt sur [github.com](https://github.com).
2. Pour chaque fichier existant à mettre à jour (`index.html`, `pronostics.html`, `analyses.html`, `actualites.html`, `guide.html`, `contact.html`, `css/style.css`, `js/script.js`) : ouvrez-le, appuyez sur l'icône **crayon (Edit)**, sélectionnez tout le contenu, supprimez-le, collez le nouveau contenu correspondant, puis **Commit changes**.
3. Pour la page « À propos » : comme le nom de fichier change, **supprimez** l'ancien `apropos.html` (bouton **⋯ → Delete file**), puis créez un nouveau fichier `a-propos.html` (**Add file → Create new file**) et collez le contenu fourni.
4. Créez le nouveau fichier `assets/favicon.svg` (**Add file → Create new file**, tapez `assets/favicon.svg` comme nom).
5. Mettez à jour `README.md` avec ce nouveau contenu (facultatif mais recommandé).

Aucune autre manipulation n'est nécessaire : GitHub Pages republie automatiquement le site après chaque `Commit changes`, en général en moins d'une minute.

**Important :** dans les fichiers HTML, les balises `<link rel="canonical">` et `<meta property="og:url">` utilisent l'adresse `https://votre-nom-utilisateur.github.io/jomion-sport/`. Remplacez-la par votre véritable adresse GitHub Pages si votre dépôt porte un autre nom.

## 4. Modifier les pronostics depuis votre téléphone

Toutes les données sont centralisées dans **`js/script.js`**, tout en haut du fichier.

1. Ouvrez `js/script.js` sur GitHub (appuyez sur le fichier, puis sur le crayon **Edit**).
2. Repérez le commentaire **« AJOUTER OU MODIFIER LES PRONOSTICS ICI »** et le tableau `const PRONOSTICS = [ ... ]`.
3. Ce tableau est vide par défaut (le site affiche alors un message « Rien à afficher pour le moment »). Ajoutez un pronostic en copiant ce modèle à l'intérieur des crochets `[ ]` :

```js
{
  sport: "Football",              // "Football", "Basketball", "Tennis" ou un autre sport
  competition: "Premier League",
  equipe1: "Équipe ou joueur A",
  equipe2: "Équipe ou joueur B",
  date: "13 août 2026",
  heure: "20:00",
  pronostic: "Plus de 2,5 buts",
  cote: "",                        // facultatif, ex. "1,85"
  confiance: 75,                   // un nombre entre 0 et 100
  analyse: "Analyse courte du match.",
  statut: "À venir"                // "À venir", "Terminé" ou "Annulé"
},
```

4. Pour ajouter un deuxième pronostic, ajoutez une virgule après le `}` du premier, puis collez un nouveau bloc.
5. Validez avec **Commit changes**. Le pronostic apparaîtra automatiquement sur `index.html` (aperçu) et sur `pronostics.html` (liste complète, filtrable par sport).

## 5. Modifier les articles depuis votre téléphone

Même principe, un peu plus bas dans `js/script.js` :

1. Repérez le commentaire **« AJOUTER OU MODIFIER LES ARTICLES ICI »** et le tableau `const ARTICLES = [ ... ]`.
2. Ajoutez un article avec ce modèle :

```js
{
  titre: "Titre de l'article",
  sport: "Basketball",
  categorie: "Actualité",          // "Actualité", "Guide", "Analyse"...
  date: "12 août 2026",
  image: "",                        // chemin vers une image, ou "" pour un visuel par défaut
  resume: "Résumé court affiché sur la carte.",
  contenu: "Texte complet (facultatif pour l'instant).",
  auteur: "Nom de l'auteur"
},
```

3. Validez avec **Commit changes**. L'article apparaît sur `index.html` et `actualites.html`.

## 6. Filtres par sport

Les pages `pronostics.html` et `actualites.html` affichent des onglets **Tous / Football / Basketball / Tennis** qui filtrent instantanément le contenu, sans recharger la page. Le filtre choisi est aussi accessible par lien direct, par exemple :

- `pronostics.html#basketball` ouvre la page avec le filtre Basketball déjà actif.
- `pronostics.html#tennis` pour le tennis, etc.

C'est ce type de lien qui est utilisé par les cartes « Sports disponibles » de la page d'accueil.

Si vous ajoutez un sport qui n'est pas Football/Basketball/Tennis (ex. « Rugby »), il apparaîtra bien sur les cartes avec l'icône générique 🏅, mais il ne sera visible que via l'onglet « Tous » : ajoutez un bouton supplémentaire dans le bloc `.sport-tabs` des pages concernées si vous voulez un onglet dédié.

## 7. Emplacements pour votre futur lien d'affiliation

Recherchez le commentaire `EMPLACEMENT AFFILIATION` dans `index.html`, `pronostics.html` et `actualites.html`. Remplacez le bloc `<div class="affiliate-slot">…</div>` par votre bannière ou lien une fois votre programme d'affiliation confirmé. Aucun lien fictif n'est présent dans le code.

## 8. Activer le formulaire de contact

GitHub Pages ne peut pas exécuter de code serveur : le formulaire de `contact.html` reste donc visuel pour l'instant. Pour l'activer gratuitement :
1. Créez un compte sur [Formspree](https://formspree.io) ou Getform.
2. Remplacez l'attribut `action="#"` du `<form id="contact-form">` par l'URL fournie par le service.

## 9. Informations fictives à remplacer

Avant de publier, pensez à remplacer :
- l'adresse e-mail dans `contact.html` ;
- les liens de réseaux sociaux (actuellement `#`) ;
- les analyses « Exemple » de `analyses.html` par vos propres analyses ;
- l'URL canonique et Open Graph dans les balises `<head>` de chaque page.

## 10. Espace Administration (nouveauté — connecté à Supabase)

Le site dispose maintenant d'une page `admin.html`, distincte des pages publiques, qui permet d'ajouter/modifier/supprimer vos **compétitions**, **pronostics**, **analyses** et **articles** depuis un formulaire tactile, sans toucher au code — utilisable depuis votre téléphone comme depuis un ordinateur.

**Avant de l'utiliser :**
1. Ouvrez `js/supabase-client.js` et remplacez `SUPABASE_URL` et `SUPABASE_ANON_KEY` par les vôtres (Supabase → Project Settings → API). La clé « anon public » n'est pas secrète tant que RLS reste actif.
2. Ajoutez les nouveaux fichiers à votre dépôt GitHub : `admin.html`, `css/admin.css`, `js/supabase-client.js`, `js/admin.js` (**Add file → Create new file**, en tapant le chemin complet pour ceux dans `css/` et `js/`).
3. Rendez-vous sur `https://votre-nom-utilisateur.github.io/jomion-sport/admin.html` et connectez-vous avec le compte créé dans Supabase Authentication (voir l'étape « créer votre compte administrateur »).

**Important à savoir :**
- Cette page n'est pas listée dans le menu de navigation public : elle reste accessible uniquement à qui connaît son adresse, et de toute façon protégée par la connexion Supabase + les règles RLS (seuls les comptes présents dans la table `profils_admin` peuvent lire/écrire les brouillons et modifier du contenu).
- Un pronostic, une analyse ou un article reste invisible sur le site public tant qu'il est en statut « Brouillon » / non publié : basculez-le en « Publié » depuis le formulaire pour qu'il apparaisse.
- **Le site public (`index.html`, `pronostics.html`, etc.) n'affiche pas encore ces données Supabase** : pour l'instant il continue à lire les tableaux `PRONOSTICS`/`ARTICLES` de `js/script.js` (voir sections 4 et 5). Le branchement du site public sur Supabase est la prochaine étape prévue — vos ancien tableaux continueront de fonctionner jusque-là.
- Le bandeau de compétitions défilant, la rubrique Matchs/Scores et la gestion des Sports/Partenaires ne sont pas encore dans cette interface : ce sont les étapes suivantes.

