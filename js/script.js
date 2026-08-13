/* =========================================================
   FOOT AFRIQUE ANALYSE — script.js
   JavaScript vanilla, sans dépendance externe.
   ========================================================= */

/* ---------------------------------------------------------
   1. DONNÉES MODIFIABLES
   -----------------------------------------------------------
   Pour ajouter/retirer un pronostic ou un article, il suffit
   de modifier les tableaux ci-dessous. Aucune autre partie du
   code n'a besoin d'être touchée.
   --------------------------------------------------------- */

const PRONOSTICS = [
  {
    competition: "CAN 2026 — Phase de groupes",
    date: "14 août 2026",
    heure: "20:00 GMT",
    equipeA: "Sénégal",
    equipeB: "Maroc",
    type: "Double chance : Maroc ou nul",
    analyse: "Le Maroc n'a perdu aucun de ses 5 derniers matches officiels et possède la meilleure défense de la phase de groupes. Le Sénégal reste dangereux en contre-attaque.",
    confiance: "medium" // "high" | "medium" | "low"
  },
  {
    competition: "Ligue 1",
    date: "16 août 2026",
    heure: "17:00 GMT",
    equipeA: "PSG",
    equipeB: "Marseille",
    type: "Plus de 2,5 buts",
    analyse: "Les 4 dernières confrontations directes entre ces deux équipes ont toutes dépassé 2,5 buts. Les deux attaques sont en forme.",
    confiance: "high"
  },
  {
    competition: "Premier League",
    date: "17 août 2026",
    heure: "16:30 GMT",
    equipeA: "Arsenal",
    equipeB: "Chelsea",
    type: "BTTS (les deux équipes marquent)",
    analyse: "Chelsea encaisse régulièrement à l'extérieur cette saison, mais Arsenal n'a gardé sa cage inviolée qu'une fois sur les 5 derniers matches à domicile.",
    confiance: "low"
  }
];

const ARTICLES = [
  {
    date: "12 août 2026",
    titre: "CAN 2026 : comment se dessinent les favoris avant le coup d'envoi",
    resume: "Retour sur la préparation des principales sélections africaines et sur les statistiques qui permettent d'anticiper la phase de groupes.",
    tag: "Actualité"
  },
  {
    date: "9 août 2026",
    titre: "BTTS et Over/Under : les bases pour lire une statistique de match",
    resume: "Un point pédagogique sur deux indicateurs souvent cités dans nos analyses, avec des exemples concrets tirés de championnats africains et européens.",
    tag: "Guide"
  },
  {
    date: "5 août 2026",
    titre: "L'avantage du terrain en Ligue des champions africaine : mythe ou réalité ?",
    resume: "Nous avons étudié les résultats domicile/extérieur des trois dernières éditions pour mesurer le véritable poids du facteur terrain.",
    tag: "Analyse"
  }
];

/* ---------------------------------------------------------
   2. UTILITAIRES
   --------------------------------------------------------- */

const CONFIDENCE_LABELS = {
  high: "Confiance élevée",
  medium: "Confiance moyenne",
  low: "Confiance faible"
};

function confidenceSegments(level) {
  const totals = { high: 3, medium: 2, low: 1 };
  const filled = totals[level] || 1;
  let html = '<div class="confidence__bar">';
  for (let i = 1; i <= 3; i++) {
    html += `<span class="confidence__seg${i <= filled ? " is-filled" : ""}"></span>`;
  }
  html += "</div>";
  return html;
}

function escapeHTML(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

/* ---------------------------------------------------------
   3. GÉNÉRATION DES CARTES "BILLET DE MATCH"
   --------------------------------------------------------- */

function renderTicketCard(p) {
  return `
    <article class="ticket-card">
      <div class="ticket-card__top">
        <span class="ticket-card__competition">${escapeHTML(p.competition)}</span>
        <span>${escapeHTML(p.date)} · ${escapeHTML(p.heure)}</span>
      </div>
      <div class="ticket-card__body">
        <div class="ticket-card__teams">
          <span>${escapeHTML(p.equipeA)}</span>
          <span class="vs">vs</span>
          <span>${escapeHTML(p.equipeB)}</span>
        </div>
        <div class="ticket-card__pick">
          <strong>Pronostic :</strong> ${escapeHTML(p.type)}
        </div>
        <p class="ticket-card__analysis">${escapeHTML(p.analyse)}</p>
      </div>
      <div class="ticket-card__perf"></div>
      <div class="confidence confidence--${p.confiance}">
        <div class="confidence__label">
          <span>${CONFIDENCE_LABELS[p.confiance]}</span>
        </div>
        ${confidenceSegments(p.confiance)}
      </div>
    </article>`;
}

function renderArticleCard(a) {
  return `
    <article class="article-card">
      <div class="article-card__media" aria-hidden="true">${escapeHTML(a.tag)}</div>
      <div class="article-card__body">
        <span class="article-card__date">${escapeHTML(a.date)}</span>
        <h3 class="article-card__title">${escapeHTML(a.titre)}</h3>
        <p class="article-card__excerpt">${escapeHTML(a.resume)}</p>
        <a href="actualites.html" class="btn btn--outline" style="align-self:flex-start;">Lire l'article</a>
      </div>
    </article>`;
}

function mountLists() {
  const pronosMount = document.querySelector("[data-mount='pronostics']");
  if (pronosMount) {
    const limit = Number(pronosMount.dataset.limit) || PRONOSTICS.length;
    pronosMount.innerHTML = PRONOSTICS.slice(0, limit).map(renderTicketCard).join("");
  }

  const articlesMount = document.querySelector("[data-mount='articles']");
  if (articlesMount) {
    const limit = Number(articlesMount.dataset.limit) || ARTICLES.length;
    articlesMount.innerHTML = ARTICLES.slice(0, limit).map(renderArticleCard).join("");
  }
}

/* ---------------------------------------------------------
   4. NAVIGATION MOBILE
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
   5. ACCORDÉON (page Guide)
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
   6. FORMULAIRE DE CONTACT (visuel uniquement)
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
   7. ANNÉE COURANTE DANS LE PIED DE PAGE
   --------------------------------------------------------- */

function initFooterYear() {
  document.querySelectorAll("[data-year]").forEach((el) => {
    el.textContent = new Date().getFullYear();
  });
}

/* ---------------------------------------------------------
   INITIALISATION
   --------------------------------------------------------- */

document.addEventListener("DOMContentLoaded", () => {
  mountLists();
  initNav();
  initAccordion();
  initContactForm();
  initFooterYear();
});
