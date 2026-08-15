/* =========================================================
   JOMION-SPORT — script.js
   JavaScript vanilla, sans dépendance externe.
   ========================================================= */

/* ===========================================================
   1. PRONOSTICS DE SECOURS (utilisés uniquement si Supabase est indisponible)
   -----------------------------------------------------------
   Depuis le branchement sur Supabase, les pronostics affichés
   sur le site proviennent normalement de la table "pronostics"
   de votre projet Supabase (gérée depuis admin.html). Ce
   tableau PRONOSTICS ne sert donc plus qu'en secours : si la
   connexion à Supabase échoue pour une raison ou une autre, le
   site l'utilise automatiquement pour continuer à fonctionner.

   Vous pouvez laisser ce tableau vide, ou y garder quelques
   pronostics de secours. Le format reste le même :

   MODÈLE (à copier-coller) :
   {
     sport: "Football",              // "Football", "Basketball", "Tennis" ou un autre sport
     competition: "Premier League",
     equipe1: "Équipe ou joueur A",
     equipe2: "Équipe ou joueur B",
     date: "13 août 2026",
     heure: "20:00",
     pronostic: "Plus de 2,5 buts",
     cote: "",                        // facultatif, ex. "1,85" — laissez "" si inconnu
     confiance: 75,                   // un nombre entre 0 et 100
     analyse: "Analyse courte du match ou de la rencontre.",
     statut: "À venir"                // "À venir", "Terminé" ou "Annulé"
   }
   =========================================================== */

const PRONOSTICS = [
  // Exemple désactivé — décommentez et modifiez pour vous en servir de modèle :
  // {
  //   sport: "Football",
  //   competition: "Premier League",
  //   equipe1: "Équipe A",
  //   equipe2: "Équipe B",
  //   date: "13 août 2026",
  //   heure: "20:00",
  //   pronostic: "Plus de 2,5 buts",
  //   cote: "1,85",
  //   confiance: 75,
  //   analyse: "Analyse du match...",
  //   statut: "À venir"
  // },
];

/* ===========================================================
   2. ARTICLES DE SECOURS (utilisés uniquement si Supabase est indisponible)
   -----------------------------------------------------------
   Même principe que pour les pronostics : les articles publiés
   proviennent normalement de la table "articles" de Supabase
   (gérée depuis admin.html). Ce tableau ARTICLES ne sert qu'en
   secours si Supabase est injoignable.

   MODÈLE (à copier-coller) :
   {
     titre: "Titre de l'article",
     sport: "Football",
     categorie: "Actualité",          // ex. "Actualité", "Guide", "Analyse"
     date: "12 août 2026",
     image: "",                        // chemin vers une image, ex. "assets/articles/mon-image.jpg" — laissez "" pour un visuel par défaut
     resume: "Résumé court affiché sur la carte de l'article.",
     contenu: "Texte complet de l'article (facultatif pour l'instant).",
     auteur: "Nom de l'auteur"
   }
   =========================================================== */

const ARTICLES = [
  // Exemple désactivé — décommentez et modifiez pour vous en servir de modèle :
  // {
  //   titre: "Titre de l'article",
  //   sport: "Football",
  //   categorie: "Actualité",
  //   date: "12 août 2026",
  //   image: "",
  //   resume: "Résumé court affiché sur la carte de l'article.",
  //   contenu: "Texte complet de l'article (facultatif pour l'instant).",
  //   auteur: "Rédaction Jomion-Sport"
  // },
];

/* ---------------------------------------------------------
   3. UTILITAIRES
   --------------------------------------------------------- */

const SPORT_ICONS = {
  football: "⚽",
  basketball: "🏀",
  tennis: "🎾"
};

function sportSlug(sport) {
  return (sport || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function sportIcon(sport) {
  return SPORT_ICONS[sportSlug(sport)] || "🏅";
}

function confidenceLevel(value) {
  const n = Number(value) || 0;
  if (n >= 70) return "high";
  if (n >= 40) return "medium";
  return "low";
}

const CONFIDENCE_TEXT = {
  high: "Confiance élevée",
  medium: "Confiance moyenne",
  low: "Confiance faible"
};

function confidenceSegments(value) {
  const n = Math.max(0, Math.min(100, Number(value) || 0));
  const filled = Math.round(n / 20); // 5 segments
  let html = '<div class="confidence__bar">';
  for (let i = 1; i <= 5; i++) {
    html += `<span class="confidence__seg${i <= filled ? " is-filled" : ""}"></span>`;
  }
  html += "</div>";
  return html;
}

function statutClass(statut) {
  const s = sportSlug(statut);
  if (s.includes("termine")) return "is-termine";
  if (s.includes("annule")) return "is-annule";
  return "is-avenir";
}

function escapeHTML(str) {
  const div = document.createElement("div");
  div.textContent = str == null ? "" : str;
  return div.innerHTML;
}

/* ---------------------------------------------------------
   4. GÉNÉRATION DES CARTES "BILLET DE MATCH"
   --------------------------------------------------------- */

function renderTicketCard(p) {
  const level = confidenceLevel(p.confiance);
  return `
    <article class="ticket-card" data-sport="${sportSlug(p.sport)}">
      <div class="ticket-card__top">
        <span class="ticket-card__competition">${escapeHTML(p.competition)}</span>
        <span>${escapeHTML(p.date)} · ${escapeHTML(p.heure)}</span>
      </div>
      <div class="ticket-card__body">
        <div class="ticket-card__badges">
          <span class="sport-badge">${sportIcon(p.sport)} ${escapeHTML(p.sport)}</span>
          ${p.statut ? `<span class="status-badge ${statutClass(p.statut)}">${escapeHTML(p.statut)}</span>` : ""}
        </div>
        <div class="ticket-card__teams">
          <span>${escapeHTML(p.equipe1)}</span>
          <span class="vs">vs</span>
          <span>${escapeHTML(p.equipe2)}</span>
        </div>
        <div class="ticket-card__pick">
          <strong>Pronostic :</strong> ${escapeHTML(p.pronostic)}
          ${p.cote ? `<div class="ticket-card__odds">Cote indicative : ${escapeHTML(p.cote)}</div>` : ""}
        </div>
        <p class="ticket-card__analysis">${escapeHTML(p.analyse)}</p>
      </div>
      <div class="ticket-card__perf"></div>
      <div class="confidence confidence--${level}">
        <div class="confidence__label">
          <span>${CONFIDENCE_TEXT[level]}</span>
          <strong>${escapeHTML(p.confiance)}%</strong>
        </div>
        ${confidenceSegments(p.confiance)}
      </div>
    </article>`;
}

function renderArticleCard(a) {
  return `
    <article class="article-card" data-sport="${sportSlug(a.sport)}">
      <div class="article-card__media" aria-hidden="true">
        ${a.image ? `<img src="${escapeHTML(a.image)}" alt="" loading="lazy" style="width:100%;height:100%;object-fit:cover;">` : `${sportIcon(a.sport)} ${escapeHTML(a.categorie || a.sport || "")}`}
      </div>
      <div class="article-card__body">
        <span class="article-card__date">${escapeHTML(a.date)} · ${escapeHTML(a.sport)}${a.auteur ? " · " + escapeHTML(a.auteur) : ""}</span>
        <h3 class="article-card__title">${escapeHTML(a.titre)}</h3>
        <p class="article-card__excerpt">${escapeHTML(a.resume)}</p>
        <a href="actualites.html" class="btn btn--outline" style="align-self:flex-start;">Lire l'article</a>
      </div>
    </article>`;
}

function emptyState(message) {
  return `<div class="empty-state"><strong>Rien à afficher pour le moment</strong>${escapeHTML(message)}</div>`;
}

/* ---------------------------------------------------------
   3 bis. CONNEXION AU SITE PUBLIC ↔ SUPABASE
   -----------------------------------------------------------
   Ces fonctions vont chercher les pronostics/articles publiés
   dans Supabase. Si Supabase n'est pas configuré sur cette page
   (fichier js/supabase-client.js absent) ou injoignable, elles
   renvoient "null" : mountLists() bascule alors automatiquement
   sur les tableaux PRONOSTICS / ARTICLES de secours définis plus
   haut, pour que le site continue de fonctionner dans tous les cas.
   --------------------------------------------------------- */

function formatDateFr(isoDate) {
  if (!isoDate) return "";
  try {
    const d = new Date(isoDate + "T00:00:00");
    return d.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
  } catch (e) {
    return isoDate;
  }
}

function formatHeure(heure) {
  return heure ? heure.slice(0, 5) : "";
}

function mapPronosticFromSupabase(row) {
  return {
    sport: (row.sports && row.sports.nom) || "",
    competition: (row.competitions && row.competitions.nom) || "",
    equipe1: row.equipe1,
    equipe2: row.equipe2,
    date: formatDateFr(row.date_match),
    heure: formatHeure(row.heure_match),
    pronostic: row.pronostic,
    cote: row.cote || "",
    confiance: row.confiance,
    analyse: row.texte_analyse || "",
    statut: row.statut
  };
}

function mapArticleFromSupabase(row) {
  return {
    titre: row.titre,
    sport: (row.sports && row.sports.nom) || "",
    categorie: row.categorie || "",
    date: formatDateFr(row.date_publication),
    image: row.image_url || "",
    resume: row.resume || "",
    contenu: row.contenu || "",
    auteur: row.auteur || ""
  };
}

async function fetchPronosticsFromSupabase(limit) {
  if (typeof supabaseClient === "undefined") return null;
  try {
    let query = supabaseClient
      .from("pronostics")
      .select("*, sports(nom, icone), competitions(nom)")
      .eq("publie", true)
      .order("date_match", { ascending: true });
    if (limit) query = query.limit(limit);
    const { data, error } = await query;
    if (error) throw error;
    return (data || []).map(mapPronosticFromSupabase);
  } catch (err) {
    console.warn("Supabase indisponible pour les pronostics, utilisation des données de secours.", err);
    return null;
  }
}

async function fetchArticlesFromSupabase(limit) {
  if (typeof supabaseClient === "undefined") return null;
  try {
    let query = supabaseClient
      .from("articles")
      .select("*, sports(nom, icone)")
      .eq("statut", "publié")
      .order("date_publication", { ascending: false });
    if (limit) query = query.limit(limit);
    const { data, error } = await query;
    if (error) throw error;
    return (data || []).map(mapArticleFromSupabase);
  } catch (err) {
    console.warn("Supabase indisponible pour les articles, utilisation des données de secours.", err);
    return null;
  }
}

async function mountLists() {
  // Une page peut afficher plusieurs blocs de pronostics (ex. l'accueil :
  // un aperçu dans le bandeau "hero" + la liste complète plus bas) : on
  // récupère les données une seule fois, puis on découpe pour chaque bloc.
  const pronosMounts = document.querySelectorAll("[data-mount='pronostics']");
  if (pronosMounts.length) {
    const limits = Array.from(pronosMounts).map((el) => Number(el.dataset.limit) || 0);
    const maxLimit = limits.includes(0) ? null : Math.max(...limits);
    let source = await fetchPronosticsFromSupabase(maxLimit);
    if (!source) source = PRONOSTICS;
    pronosMounts.forEach((mount) => {
      const limit = Number(mount.dataset.limit) || source.length;
      const items = source.slice(0, limit);
      mount.innerHTML = items.length
        ? items.map(renderTicketCard).join("")
        : emptyState("Aucun pronostic publié pour le moment.");
    });
  }

  const articlesMounts = document.querySelectorAll("[data-mount='articles']");
  if (articlesMounts.length) {
    const limits = Array.from(articlesMounts).map((el) => Number(el.dataset.limit) || 0);
    const maxLimit = limits.includes(0) ? null : Math.max(...limits);
    let source = await fetchArticlesFromSupabase(maxLimit);
    if (!source) source = ARTICLES;
    articlesMounts.forEach((mount) => {
      const limit = Number(mount.dataset.limit) || source.length;
      const items = source.slice(0, limit);
      mount.innerHTML = items.length
        ? items.map(renderArticleCard).join("")
        : emptyState("Aucun article publié pour le moment.");
    });
  }
}

/* ---------------------------------------------------------
   5. FILTRES PAR SPORT (onglets "Tous / Football / Basketball / Tennis")
   --------------------------------------------------------- */

function applySportFilter(mount, sport) {
  const cards = mount.querySelectorAll(":scope > article[data-sport]");
  let visibleCount = 0;
  cards.forEach((card) => {
    const match = sport === "tous" || card.dataset.sport === sport;
    card.style.display = match ? "" : "none";
    if (match) visibleCount++;
  });
  let empty = mount.querySelector(".empty-state[data-filter-empty]");
  if (visibleCount === 0 && cards.length > 0) {
    if (!empty) {
      empty = document.createElement("div");
      empty.className = "empty-state";
      empty.setAttribute("data-filter-empty", "true");
      empty.innerHTML = "<strong>Aucun résultat</strong>Aucun contenu pour ce sport pour le moment.";
      mount.appendChild(empty);
    }
  } else if (empty) {
    empty.remove();
  }
}

function initSportTabs() {
  const tabsContainers = document.querySelectorAll(".sport-tabs");
  if (!tabsContainers.length) return;

  tabsContainers.forEach((tabs) => {
    const section = tabs.closest("section");
    const mount = section ? section.querySelector("[data-mount][data-filterable]") : null;
    if (!mount) return;

    function selectSport(sport) {
      tabs.querySelectorAll(".sport-tab").forEach((btn) => {
        const isActive = btn.dataset.sportFilter === sport;
        btn.classList.toggle("is-active", isActive);
        btn.setAttribute("aria-selected", String(isActive));
      });
      applySportFilter(mount, sport);
    }

    tabs.querySelectorAll(".sport-tab").forEach((btn) => {
      btn.addEventListener("click", () => {
        selectSport(btn.dataset.sportFilter);
        history.replaceState(null, "", "#" + btn.dataset.sportFilter);
      });
    });

    // Permet d'arriver directement filtré via un lien du type pronostics.html#basketball
    const initial = window.location.hash.replace("#", "") || "tous";
    const validInitial = tabs.querySelector(`[data-sport-filter="${initial}"]`) ? initial : "tous";
    selectSport(validInitial);
  });
}

/* ---------------------------------------------------------
   6. NAVIGATION MOBILE
   --------------------------------------------------------- */

function initNav() {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".main-nav");
  const backdrop = document.querySelector(".nav-backdrop");
  if (!toggle || !nav) return;

  function closeNav() {
    nav.classList.remove("is-open");
    backdrop && backdrop.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  }
  function openNav() {
    nav.classList.add("is-open");
    backdrop && backdrop.classList.add("is-open");
    toggle.setAttribute("aria-expanded", "true");
  }

  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.contains("is-open");
    isOpen ? closeNav() : openNav();
  });
  backdrop && backdrop.addEventListener("click", closeNav);
  nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeNav));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeNav();
  });
}

/* ---------------------------------------------------------
   7. ACCORDÉON (page Guide)
   --------------------------------------------------------- */

function initAccordion() {
  document.querySelectorAll(".accordion__trigger").forEach((btn) => {
    btn.addEventListener("click", () => {
      const panel = document.getElementById(btn.getAttribute("aria-controls"));
      const expanded = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", String(!expanded));
      if (!panel) return;
      panel.style.maxHeight = expanded ? null : panel.scrollHeight + "px";
    });
  });
}

/* ---------------------------------------------------------
   8. FORMULAIRE DE CONTACT (visuel uniquement)
   -----------------------------------------------------------
   GitHub Pages n'exécute pas de code côté serveur : ce
   formulaire ne peut donc pas envoyer réellement de message.
   Pour le rendre fonctionnel plus tard, deux options simples :
     1) un service comme Formspree ou Getform (gratuit, sans
        serveur à gérer) : il suffit de remplacer l'attribut
        "action" du <form> par l'URL fournie par le service ;
     2) un lien "mailto:" classique si vous préférez rester
        très simple.
   --------------------------------------------------------- */

function initContactForm() {
  const form = document.querySelector("#contact-form");
  if (!form) return;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const note = document.querySelector("#contact-form-note");
    if (note) {
      note.textContent = "Ce formulaire est une démonstration visuelle : aucun message n'est envoyé pour l'instant. Connectez un service comme Formspree pour l'activer.";
    }
  });
}

/* ---------------------------------------------------------
   9. ANNÉE COURANTE DANS LE PIED DE PAGE
   --------------------------------------------------------- */

function initFooterYear() {
  document.querySelectorAll("[data-year]").forEach((el) => {
    el.textContent = new Date().getFullYear();
  });
}

/* ---------------------------------------------------------
   INITIALISATION
   --------------------------------------------------------- */

document.addEventListener("DOMContentLoaded", async () => {
  await mountLists();
  initSportTabs();
  initNav();
  initAccordion();
  initContactForm();
  initFooterYear();
});
