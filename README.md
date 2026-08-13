# Foot Afrique Analyse — site web

Site statique (HTML5 / CSS3 / JavaScript vanilla), sans serveur ni base de données, prêt à être hébergé gratuitement sur **GitHub Pages**.

## 1. Structure du projet

```
foot-afrique-analyse/
├── index.html          → page d'accueil
├── pronostics.html      → tous les pronostics
├── analyses.html         → analyses détaillées de matchs
├── actualites.html       → articles / actualités
├── guide.html             → guide pédagogique (accordéon)
├── apropos.html           → présentation du site
├── contact.html           → coordonnées + formulaire visuel
├── css/
│   └── style.css          → toute la charte graphique
├── js/
│   └── script.js           → navigation, données, interactions
└── README.md               → ce fichier
```

Chaque page a besoin de son dossier `css/` et `js/` juste à côté d'elle : ne changez pas ces noms de dossiers.

## 2. Publier le site sur GitHub Pages (depuis un téléphone)

**Étape 1 — Créer le dépôt**
1. Allez sur [github.com](https://github.com) et connectez-vous (ou créez un compte).
2. Appuyez sur **+** puis **New repository**.
3. Donnez-lui un nom, par exemple `foot-afrique-analyse`, laissez-le **Public**, puis **Create repository**.

**Étape 2 — Ajouter les fichiers**
Sur mobile, la méthode la plus fiable est de créer chaque fichier directement sur GitHub :
1. Dans le dépôt, appuyez sur **Add file → Create new file**.
2. Dans le champ du nom de fichier, tapez le chemin complet, par exemple `css/style.css` (le dossier `css` est créé automatiquement).
3. Collez le contenu du fichier correspondant, puis validez avec **Commit changes**.
4. Répétez l'opération pour tous les fichiers : `index.html`, `pronostics.html`, `analyses.html`, `actualites.html`, `guide.html`, `apropos.html`, `contact.html`, `css/style.css`, `js/script.js`.

Astuce : le fichier ZIP fourni à côté de ce README contient déjà tous les fichiers dans la bonne structure. Si vous préférez, vous pouvez aussi le décompresser sur votre téléphone puis utiliser **Add file → Upload files** en sélectionnant plusieurs fichiers à la fois (les navigateurs mobiles récents permettent parfois de glisser un dossier entier).

**Étape 3 — Activer GitHub Pages**
1. Dans le dépôt, allez dans **Settings → Pages**.
2. Sous « Build and deployment », choisissez la branche `main` et le dossier `/ (root)`.
3. Appuyez sur **Save**.
4. Après une minute ou deux, votre site sera visible à l'adresse :
   `https://votre-nom-utilisateur.github.io/foot-afrique-analyse/`

**Étape 4 — Mettre à jour l'URL dans le code**
Dans les fichiers HTML, remplacez toutes les occurrences de
`https://votre-nom-utilisateur.github.io/foot-afrique-analyse/`
par votre véritable adresse GitHub Pages (balises `<link rel="canonical">` et `<meta property="og:url">`).

## 3. Modifier le contenu facilement

### Ajouter ou modifier un pronostic
Ouvrez `js/script.js`, repérez le tableau `PRONOSTICS` tout en haut, et ajoutez un bloc sur ce modèle :

```js
{
  competition: "Nom de la compétition",
  date: "20 août 2026",
  heure: "18:00 GMT",
  equipeA: "Équipe A",
  equipeB: "Équipe B",
  type: "Type de pronostic",
  analyse: "Analyse courte en une ou deux phrases.",
  confiance: "high" // "high", "medium" ou "low"
}
```

Le pronostic apparaîtra automatiquement sur la page d'accueil et sur `pronostics.html`.

### Ajouter ou modifier un article
Même principe avec le tableau `ARTICLES` dans `js/script.js`.

### Modifier les statistiques de la page d'accueil ou les analyses détaillées
Ces contenus sont écrits directement dans `index.html` et `analyses.html` (blocs `.stat-box` et `.analysis-card`) : modifiez le texte comme un document normal.

## 4. Emplacements pour l'affiliation

Recherchez le commentaire `EMPLACEMENT AFFILIATION` dans `index.html`, `pronostics.html` et `actualites.html`. Remplacez le bloc `<div class="affiliate-slot">…</div>` par votre bannière ou lien une fois votre programme d'affiliation confirmé.

## 5. Activer le formulaire de contact

GitHub Pages ne peut pas exécuter de code serveur : le formulaire de `contact.html` est donc uniquement visuel pour l'instant. Pour le rendre fonctionnel gratuitement :
1. Créez un compte sur un service comme [Formspree](https://formspree.io) ou Getform.
2. Remplacez l'attribut `action="#"` du `<form id="contact-form">` par l'URL fournie par le service.

## 6. Remplacer les informations fictives

Avant de publier, pensez à remplacer :
- l'adresse e-mail dans `contact.html` ;
- les liens de réseaux sociaux (actuellement `#`) ;
- l'URL canonique et Open Graph dans les balises `<head>` de chaque page.
