
/* =========================================================
   JOMION-SPORT — script.js
   JavaScript vanilla, sans dépendance externe.
   ========================================================= */


/* =========================================================
   1. PRONOSTICS DE SECOURS
   ========================================================= */

const PRONOSTICS = [
  // Exemple :
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
  // }
];


/* =========================================================
   2. ARTICLES DE SECOURS
   ========================================================= */

const ARTICLES = [
  // Exemple :
  // {
  //   titre: "Titre de l'article",
  //   sport: "Football",
  //   categorie: "Actualité",
  //   date: "12 août 2026",
  //   image: "",
  //   resume: "Résumé de l'article.",
  //   contenu: "Contenu complet.",
  //   auteur: "Rédaction Jomion-Sport"
  // }
];


/* =========================================================
   3. ANALYSES DE SECOURS
   ========================================================= */

const ANALYSES_SECOURS = [
  // Exemple :
  // {
  //   titre: "Sénégal — Maroc",
  //   sport: "Football",
  //   competition: "CAN 2026",
  //   date: "14 août 2026",
  //   texte_analyse: "Analyse détaillée...",
  //   conclusion: "Conclusion..."
  // }
];


/* =========================================================
   4. UTILITAIRES
   ========================================================= */

const SPORT_ICONS = {
  football: "⚽",
  basketball: "🏀",
  tennis: "🎾"
};


function sportSlug(sport) {
  return (sport || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
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
  const n = Math.max(
    0,
    Math.min(100, Number(value) || 0)
  );

  const filled = Math.round(n / 20);

  let html = '<div class="confidence__bar">';

  for (let i = 1; i <= 5; i++) {
    html += `
      <span class="confidence__seg${
        i <= filled ? " is-filled" : ""
      }"></span>
    `;
  }

  html += "</div>";

  return html;
}


function statutClass(statut) {
  const s = sportSlug(statut);
  if (s.includes("termine")) return "is-termine";
  if (s.includes("annule")) return "is-annule";
  if (s.includes("encours")) return "is-encours";
  return "is-avenir";
}

function escapeHTML(str) {
  const div = document.createElement("div");

  div.textContent = str == null ? "" : String(str);

  return div.innerHTML;
}


function escapeHTMLMultiline(str) {
  return escapeHTML(str).replace(/\n/g, "<br>");
}


function normaliserNom(str) {
  return (str || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "");
}


/* =========================================================
   5. LOGOS DES ÉQUIPES
   ========================================================= */

let _equipesLogosCache = null;


async function fetchEquipesLogos() {
  if (_equipesLogosCache) {
    return _equipesLogosCache;
  }

  _equipesLogosCache = new Map();

  if (typeof supabaseClient === "undefined") {
    return _equipesLogosCache;
  }

  try {
    const { data, error } = await supabaseClient
      .from("equipes")
      .select("nom, logo_url")
      .not("logo_url", "is", null);

    if (error) {
      throw error;
    }

    (data || []).forEach((equipe) => {
      if (equipe.logo_url) {
        _equipesLogosCache.set(
          normaliserNom(equipe.nom),
          equipe.logo_url
        );
      }
    });
  } catch (err) {
    console.warn(
      "Supabase indisponible pour les logos d'équipes.",
      err
    );
  }

  return _equipesLogosCache;
}


/* =========================================================
   6. CARTES PRONOSTICS
   ========================================================= */

function renderTicketCard(p) {
  const level = confidenceLevel(p.confiance);

  return `
    <article
      class="ticket-card"
      data-sport="${sportSlug(p.sport)}"
    >

      <div class="ticket-card__top">

        <span class="ticket-card__competition">
          ${
            p.competitionLogo
              ? `
                <img
                  src="${escapeHTML(p.competitionLogo)}"
                  alt=""
                  class="competition-logo"
                  loading="lazy"
                >
              `
              : ""
          }

          ${escapeHTML(p.competition)}
        </span>

        <span>
          ${escapeHTML(p.date)}
          ${p.heure ? " · " + escapeHTML(p.heure) : ""}
        </span>

      </div>


      <div class="ticket-card__body">

        <div class="ticket-card__badges">

          <span class="sport-badge">
            ${sportIcon(p.sport)}
            ${escapeHTML(p.sport)}
          </span>

          ${
            p.statut
              ? `
                <span
                  class="status-badge ${statutClass(p.statut)}"
                >
                  ${escapeHTML(p.statut)}
                </span>
              `
              : ""
          }

        </div>


        <div class="ticket-card__teams">

          <span>
            ${
              p.equipe1Logo
                ? `
                  <img
                    src="${escapeHTML(p.equipe1Logo)}"
                    alt=""
                    class="team-logo"
                    loading="lazy"
                  >
                `
                : ""
            }

            ${escapeHTML(p.equipe1)}
          </span>

          <span class="vs">vs</span>

          <span>
            ${
              p.equipe2Logo
                ? `
                  <img
                    src="${escapeHTML(p.equipe2Logo)}"
                    alt=""
                    class="team-logo"
                    loading="lazy"
                  >
                `
                : ""
            }

            ${escapeHTML(p.equipe2)}
          </span>

        </div>


        <div class="ticket-card__pick">

          <strong>Pronostic :</strong>

          ${escapeHTML(p.pronostic)}

          ${
            p.cote
              ? `
                <div class="ticket-card__odds">
                  Cote indicative :
                  ${escapeHTML(p.cote)}
                </div>
              `
              : ""
          }

        </div>


        ${
          p.analyse
            ? `
              <p class="ticket-card__analysis">
                ${escapeHTML(p.analyse)}
              </p>
            `
            : ""
        }

      </div>


      <div class="ticket-card__perf"></div>


      <div class="confidence confidence--${level}">

        <div class="confidence__label">

          <span>
            ${CONFIDENCE_TEXT[level]}
          </span>

          <strong>
            ${escapeHTML(p.confiance)}%
          </strong>

        </div>

        ${confidenceSegments(p.confiance)}

      </div>

    </article>
  `;
}


/* =========================================================
   7. CARTES ARTICLES
   ========================================================= */

function renderArticleCard(a) {
  return `
    <article
      class="article-card"
      data-sport="${sportSlug(a.sport)}"
    >

      <div
        class="article-card__media"
        aria-hidden="true"
      >

        ${
          a.image
            ? `
              <img
                src="${escapeHTML(a.image)}"
                alt=""
                loading="lazy"
                style="
                  width:100%;
                  height:100%;
                  object-fit:cover;
                "
              >
            `
            : `
              ${sportIcon(a.sport)}
              ${escapeHTML(
                a.categorie || a.sport || ""
              )}
            `
        }

      </div>


      <div class="article-card__body">

        <span class="article-card__date">

          ${escapeHTML(a.date)}

          ${a.sport
            ? " · " + escapeHTML(a.sport)
            : ""}

          ${
            a.auteur
              ? " · " + escapeHTML(a.auteur)
              : ""
          }

        </span>


        <h3 class="article-card__title">
          ${escapeHTML(a.titre)}
        </h3>


        ${
          a.resume
            ? `
              <p class="article-card__excerpt">
                ${escapeHTML(a.resume)}
              </p>
            `
            : ""
        }


        <a
          href="actualites.html"
          class="btn btn--outline"
          style="align-self:flex-start;"
        >
          Lire l'article
        </a>

      </div>

    </article>
  `;
}


/* =========================================================
   8. ÉTAT VIDE
   ========================================================= */

function emptyState(message) {
  return `
    <div class="empty-state">
      <strong>
        Rien à afficher pour le moment
      </strong>

      ${escapeHTML(message)}
    </div>
  `;
}


/* =========================================================
   9. CARTES ANALYSES
   ========================================================= */

function renderAnalysisCard(a) {
  return `
    <article class="analysis-card">

      <h3>
        ${escapeHTML(a.titre)}
      </h3>


      <p class="analysis-card__meta">

        ${escapeHTML(a.sport)}

        ${
          a.competition
            ? " · " + escapeHTML(a.competition)
            : ""
        }

        ${
          a.date
            ? " · " + escapeHTML(a.date)
            : ""
        }

      </p>


      ${
        a.texte_analyse
          ? `
            <p>
              ${escapeHTMLMultiline(
                a.texte_analyse
              )}
            </p>
          `
          : ""
      }


      ${
        a.conclusion
          ? `
            <p>
              <strong>Conclusion :</strong>

              ${escapeHTMLMultiline(
                a.conclusion
              )}
            </p>
          `
          : ""
      }

    </article>
  `;
}


/* =========================================================
   10. FORMATAGE DES DATES
   ========================================================= */

function formatDateFr(isoDate) {
  if (!isoDate) {
    return "";
  }

  try {
    const d = new Date(
      isoDate + "T00:00:00"
    );

    return d.toLocaleDateString(
      "fr-FR",
      {
        day: "numeric",
        month: "long",
        year: "numeric"
      }
    );
  } catch (e) {
    return isoDate;
  }
}


function formatHeure(heure) {
  return heure
    ? String(heure).slice(0, 5)
    : "";
}


/* =========================================================
   11. CONVERSION PRONOSTIC SUPABASE
   ========================================================= */

function mapPronosticFromSupabase(row, logos) {
  return {
    sport:
      (row.sports && row.sports.nom) || "",

    competition:
      (row.competitions &&
        row.competitions.nom) || "",

    competitionLogo:
      (row.competitions &&
        row.competitions.logo_url) || "",

    equipe1: row.equipe1 || "",

    equipe1Logo:
      (logos &&
        logos.get(
          normaliserNom(row.equipe1)
        )) || "",

    equipe2: row.equipe2 || "",

    equipe2Logo:
      (logos &&
        logos.get(
          normaliserNom(row.equipe2)
        )) || "",

    date:
      formatDateFr(row.date_match),

    heure:
      formatHeure(row.heure_match),

    pronostic:
      row.pronostic || "",

    cote:
      row.cote || "",

    confiance:
      row.confiance || 0,

    analyse:
      row.texte_analyse || "",

    statut:
      row.statut || ""
  };
}


/* =========================================================
   12. CONVERSION ARTICLE SUPABASE
   ========================================================= */

function mapArticleFromSupabase(row) {
  return {
    titre: row.titre || "",

    sport:
      (row.sports && row.sports.nom) || "",

    categorie:
      row.categorie || "",

    date:
      formatDateFr(row.date_publication),

    image:
      row.image_url || "",

    resume:
      row.resume || "",

    contenu:
      row.contenu || "",

    auteur:
      row.auteur || ""
  };
}


/* =========================================================
   13. RÉCUPÉRATION DES PRONOSTICS SUPABASE
   ========================================================= */

async function fetchPronosticsFromSupabase(limit) {
  if (typeof supabaseClient === "undefined") {
    return null;
  }

  try {
    const logos =
      await fetchEquipesLogos();

    let query = supabaseClient
      .from("pronostics")
      .select(
        "*, sports(nom, icone), competitions(nom, logo_url)"
      )
      .eq("publie", true)
      .order(
        "date_match",
        { ascending: true }
      );

    if (limit) {
      query = query.limit(limit);
    }

    const {
      data,
      error
    } = await query;

    if (error) {
      throw error;
    }

    return (data || []).map(
      (row) =>
        mapPronosticFromSupabase(
          row,
          logos
        )
    );

  } catch (err) {

    console.warn(
      "Supabase indisponible pour les pronostics, utilisation des données de secours.",
      err
    );

    return null;
  }
}


/* =========================================================
   14. RÉCUPÉRATION DES ARTICLES SUPABASE
   ========================================================= */

async function fetchArticlesFromSupabase(limit) {
  if (typeof supabaseClient === "undefined") {
    return null;
  }

  try {

    let query = supabaseClient
      .from("articles")
      .select(
        "*, sports(nom, icone)"
      )
      .eq("statut", "publié")
      .order(
        "date_publication",
        { ascending: false }
      );

    if (limit) {
      query = query.limit(limit);
    }

    const {
      data,
      error
    } = await query;

    if (error) {
      throw error;
    }

    return (data || []).map(
      mapArticleFromSupabase
    );

  } catch (err) {

    console.warn(
      "Supabase indisponible pour les articles, utilisation des données de secours.",
      err
    );

    return null;
  }
}


/* =========================================================
   15. CONVERSION ANALYSE SUPABASE
   ========================================================= */

function mapAnalyseFromSupabase(row) {
  return {
    titre:
      row.titre || "",

    sport:
      (row.sports && row.sports.nom) || "",

    competition:
      (row.competitions &&
        row.competitions.nom) || "",

    date:
      formatDateFr(
        row.date_publication
      ),

    texte_analyse:
      row.texte_analyse || "",

    conclusion:
      row.conclusion || ""
  };
}


/* =========================================================
   16. RÉCUPÉRATION DES ANALYSES SUPABASE
   ========================================================= */

async function fetchAnalysesFromSupabase(limit) {
  if (typeof supabaseClient === "undefined") {
    return null;
  }

  try {

    let query = supabaseClient
      .from("analyses")
      .select(
        "*, sports(nom, icone), competitions(nom)"
      )
      .eq("statut", "publié")
      .order(
        "date_publication",
        { ascending: false }
      );

    if (limit) {
      query = query.limit(limit);
    }

    const {
      data,
      error
    } = await query;

    if (error) {
      throw error;
    }

    return (data || []).map(
      mapAnalyseFromSupabase
    );

  } catch (err) {

    console.warn(
      "Supabase indisponible pour les analyses, utilisation des données de secours.",
      err
    );

    return null;
  }
}


/* =========================================================
   17. MONTAGE DES LISTES
   ========================================================= */

async function mountLists() {

  /* -------------------------------------------------------
     PRONOSTICS
     ------------------------------------------------------- */

  const pronosMounts =
    document.querySelectorAll(
      "[data-mount='pronostics']"
    );

  if (pronosMounts.length) {

    const limits =
      Array.from(pronosMounts).map(
        (el) =>
          Number(el.dataset.limit) || 0
      );

    const maxLimit =
      limits.includes(0)
        ? null
        : Math.max(...limits);

    let source =
      await fetchPronosticsFromSupabase(
        maxLimit
      );

    if (!source) {
      source = PRONOSTICS;
    }

    pronosMounts.forEach((mount) => {

      const limit =
        Number(mount.dataset.limit) ||
        source.length;

      const items =
        source.slice(0, limit);

      mount.innerHTML =
        items.length
          ? items
              .map(renderTicketCard)
              .join("")
          : emptyState(
              "Aucun pronostic publié pour le moment."
            );
    });
  }


  /* -------------------------------------------------------
     ARTICLES
     ------------------------------------------------------- */

  const articlesMounts =
    document.querySelectorAll(
      "[data-mount='articles']"
    );

  if (articlesMounts.length) {

    const limits =
      Array.from(articlesMounts).map(
        (el) =>
          Number(el.dataset.limit) || 0
      );

    const maxLimit =
      limits.includes(0)
        ? null
        : Math.max(...limits);

    let source =
      await fetchArticlesFromSupabase(
        maxLimit
      );

    if (!source) {
      source = ARTICLES;
    }

    articlesMounts.forEach((mount) => {

      const limit =
        Number(mount.dataset.limit) ||
        source.length;

      const items =
        source.slice(0, limit);

      mount.innerHTML =
        items.length
          ? items
              .map(renderArticleCard)
              .join("")
          : emptyState(
              "Aucun article publié pour le moment."
            );
    });
  }


  /* -------------------------------------------------------
     ANALYSES
     ------------------------------------------------------- */

  const analysesMounts =
    document.querySelectorAll(
      "[data-mount='analyses']"
    );

  if (analysesMounts.length) {

    const limits =
      Array.from(analysesMounts).map(
        (el) =>
          Number(el.dataset.limit) || 0
      );

    const maxLimit =
      limits.includes(0)
        ? null
        : Math.max(...limits);

    let source =
      await fetchAnalysesFromSupabase(
        maxLimit
      );

    if (!source) {
      source = ANALYSES_SECOURS;
    }

    analysesMounts.forEach((mount) => {

      const limit =
        Number(mount.dataset.limit) ||
        source.length;

      const items =
        source.slice(0, limit);

      mount.innerHTML =
        items.length
          ? items
              .map(renderAnalysisCard)
              .join("")
          : emptyState(
              "Aucune analyse publiée pour le moment."
            );
    });
  }
}


/* =========================================================
   18. BANDEAU DES COMPÉTITIONS
   ========================================================= */

const COMPETITIONS_SECOURS = [
  "Football",
  "Basketball",
  "Tennis",
  "CAN 2026",
  "Premier League",
  "NBA",
  "ATP / WTA",
  "Ligue 1"
];


async function fetchCompetitionsForTicker() {

  if (typeof supabaseClient === "undefined") {
    return null;
  }

  try {

    const {
      data,
      error
    } = await supabaseClient
      .from("competitions")
      .select("nom")
      .eq("actif", true)
      .order(
        "ordre_affichage",
        { ascending: true }
      );

    if (error) {
      throw error;
    }

    return (data || []).map(
      (c) => c.nom
    );

  } catch (err) {

    console.warn(
      "Supabase indisponible pour le bandeau de compétitions, utilisation de la liste de secours.",
      err
    );

    return null;
  }
}


async function renderTicker() {

  const track =
    document.querySelector(
      ".ticker__track"
    );

  if (!track) {
    return;
  }

  let noms =
    await fetchCompetitionsForTicker();

  if (!noms || !noms.length) {
    noms = COMPETITIONS_SECOURS;
  }

  const itemsHTML =
    noms
      .map(
        (nom) =>
          `<span>${escapeHTML(nom)}</span>`
      )
      .join("");

  track.innerHTML =
    itemsHTML + itemsHTML;
}


/* =========================================================
   19. MATCHS À VENIR
   ========================================================= */

function mapMatchFromSupabase(
  row,
  logos
) {
  return {

    sport:
      (row.sports && row.sports.nom) || "",

    competition:
      (row.competitions &&
        row.competitions.nom) || "",

    competitionLogo:
      (row.competitions &&
        row.competitions.logo_url) || "",

    pays:
      row.pays || "",

    equipe1:
      row.equipe1 || "",

    equipe1Logo:
      (logos &&
        logos.get(
          normaliserNom(row.equipe1)
        )) || "",

    equipe2:
      row.equipe2 || "",

    equipe2Logo:
      (logos &&
        logos.get(
          normaliserNom(row.equipe2)
        )) || "",

    date:
      formatDateFr(row.date_match),

    dateIso:
      row.date_match || "",

    heure:
      formatHeure(row.heure_match),

    statut:
      row.statut || ""
  };
}


async function fetchMatchsAVenir() {

  if (typeof supabaseClient === "undefined") {
    return [];
  }

  try {

    const logos =
      await fetchEquipesLogos();

    const {
      data,
      error
    } = await supabaseClient
      .from("matchs")
      .select(
        "*, sports(nom, icone), competitions(nom, logo_url)"
      )
      .in(
        "statut",
        ["à venir", "en cours"]
      )
      .order(
        "date_match",
        { ascending: true }
      );

    if (error) {
      throw error;
    }

    return (data || []).map(
      (row) =>
        mapMatchFromSupabase(
          row,
          logos
        )
    );

  } catch (err) {

    console.warn(
      "Supabase indisponible pour les matchs.",
      err
    );

    return [];
  }
}


function renderMatchCard(m) {

  return `
    <article
      class="match-card"
      data-sport="${sportSlug(m.sport)}"
      data-pays="${escapeHTML(m.pays)}"
      data-competition="${escapeHTML(m.competition)}"
      data-date="${escapeHTML(m.dateIso)}"
    >

      <div class="match-card__top">

        <span class="sport-badge">
          ${sportIcon(m.sport)}
          ${escapeHTML(m.sport)}
        </span>

        <span
          class="status-badge ${statutClass(m.statut)}"
        >
          ${escapeHTML(m.statut)}
        </span>

      </div>


      <div class="match-card__body">

        <div class="match-card__competition">

          ${
            m.competitionLogo
              ? `
                <img
                  src="${escapeHTML(m.competitionLogo)}"
                  alt=""
                  class="competition-logo"
                  loading="lazy"
                >
              `
              : ""
          }

          ${escapeHTML(m.competition)}

          ${
            m.pays
              ? " · " + escapeHTML(m.pays)
              : ""
          }

        </div>


        <div class="match-card__teams">

          <span>

            ${
              m.equipe1Logo
                ? `
                  <img
                    src="${escapeHTML(m.equipe1Logo)}"
                    alt=""
                    class="team-logo"
                    loading="lazy"
                  >
                `
                : ""
            }

            ${escapeHTML(m.equipe1)}

          </span>


          <span class="vs">
            vs
          </span>


          <span>

            ${
              m.equipe2Logo
                ? `
                  <img
                    src="${escapeHTML(m.equipe2Logo)}"
                    alt=""
                    class="team-logo"
                    loading="lazy"
                  >
                `
                : ""
            }

            ${escapeHTML(m.equipe2)}

          </span>

        </div>


        <div class="match-card__meta">

          ${escapeHTML(m.date)}

          ${
            m.heure
              ? " · " +
                escapeHTML(m.heure)
              : ""
          }

        </div>

      </div>

    </article>
  `;
}


/* =========================================================
   20. FILTRES
   ========================================================= */

function fillFilterSelect(
  selectEl,
  values,
  placeholder
) {

  if (!selectEl) {
    return;
  }

  const uniques =
    [
      ...new Set(
        values.filter(Boolean)
      )
    ];

  selectEl.innerHTML =
    `<option value="">
      ${escapeHTML(placeholder)}
    </option>` +

    uniques
      .map(
        (v) =>
          `<option value="${escapeHTML(v)}">
            ${escapeHTML(v)}
          </option>`
      )
      .join("");
}


/* =========================================================
   21. ONGLET ACTIF SELON L'URL
   ========================================================= */

function setActiveTabFromHash(tabs) {

  if (!tabs) {
    return;
  }

  const initial =
    window.location.hash.replace(
      "#",
      ""
    ) || "tous";

  const match =
    tabs.querySelector(
      `[data-sport-filter="${initial}"]`
    );

  tabs
    .querySelectorAll(".sport-tab")
    .forEach((btn) => {

      const active = match
        ? btn === match
        : btn.dataset.sportFilter ===
          "tous";

      btn.classList.toggle(
        "is-active",
        active
      );

      btn.setAttribute(
        "aria-selected",
        String(active)
      );
    });
}


/* =========================================================
   22. APPLICATION DES FILTRES
   ========================================================= */

function applyCardFilters(
  mount,
  tabs
) {

  if (!mount) {
    return;
  }

  const activeButton =
    tabs
      ? tabs.querySelector(
          ".sport-tab.is-active"
        )
      : null;

  const activeSport =
    activeButton
      ? activeButton.dataset.sportFilter
      : "tous";


  const pays =
    document.getElementById(
      "filtre-pays"
    );

  const competition =
    document.getElementById(
      "filtre-competition"
    );

  const date =
    document.getElementById(
      "filtre-date"
    );


  const cards =
    mount.querySelectorAll(
      ":scope > article[data-sport]"
    );


  let visible = 0;


  cards.forEach((card) => {

    const okSport =
      activeSport === "tous" ||
      card.dataset.sport ===
        activeSport;


    const okPays =
      !pays ||
      !pays.value ||
      card.dataset.pays ===
        pays.value;


    const okCompetition =
      !competition ||
      !competition.value ||
      card.dataset.competition ===
        competition.value;


    const okDate =
      !date ||
      !date.value ||
      card.dataset.date ===
        date.value;


    const match =
      okSport &&
      okPays &&
      okCompetition &&
      okDate;


    card.style.display =
      match ? "" : "none";


    if (match) {
      visible++;
    }

  });


  let empty =
    mount.querySelector(
      ".empty-state[data-filter-empty]"
    );


  if (
    visible === 0 &&
    cards.length > 0
  ) {

    if (!empty) {

      empty =
        document.createElement(
          "div"
        );

      empty.className =
        "empty-state";

      empty.setAttribute(
        "data-filter-empty",
        "true"
      );

      empty.innerHTML =
        "<strong>Aucun résultat</strong>" +
        "Aucun contenu ne correspond à ces filtres.";

      mount.appendChild(empty);
    }

  } else if (empty) {

    empty.remove();
  }
}


/* =========================================================
   23. INITIALISATION PAGE MATCHS
   ========================================================= */

async function initMatchsPage() {

  const mount =
    document.getElementById(
      "matchs-liste"
    );

  if (!mount) {
    return;
  }


  const matchs =
    await fetchMatchsAVenir();


  mount.innerHTML =
    matchs.length
      ? matchs
          .map(renderMatchCard)
          .join("")
      : emptyState(
          "Aucun match à venir pour le moment."
        );


  const tabs =
    document.querySelector(
      ".sport-tabs"
    );

  const paysSelect =
    document.getElementById(
      "filtre-pays"
    );

  const competitionSelect =
    document.getElementById(
      "filtre-competition"
    );

  const dateSelect =
    document.getElementById(
      "filtre-date"
    );


  fillFilterSelect(
    paysSelect,
    matchs.map(
      (m) => m.pays
    ),
    "Tous les pays"
  );


  fillFilterSelect(
    competitionSelect,
    matchs.map(
      (m) => m.competition
    ),
    "Toutes les compétitions"
  );


  fillFilterSelect(
    dateSelect,
    matchs.map(
      (m) => m.dateIso
    ),
    "Toutes les dates"
  );


  [
    paysSelect,
    competitionSelect,
    dateSelect
  ]
    .filter(Boolean)
    .forEach((select) => {

      select.addEventListener(
        "change",
        () => {
          applyCardFilters(
            mount,
            tabs
          );
        }
      );

    });


  if (tabs) {

    tabs
      .querySelectorAll(
        ".sport-tab"
      )
      .forEach((btn) => {

        btn.addEventListener(
          "click",
          () => {

            tabs
              .querySelectorAll(
                ".sport-tab"
              )
              .forEach((b) => {

                const active =
                  b === btn;

                b.classList.toggle(
                  "is-active",
                  active
                );

                b.setAttribute(
                  "aria-selected",
                  String(active)
                );
              });


            history.replaceState(
              null,
              "",
              "#" +
                btn.dataset.sportFilter
            );


            applyCardFilters(
              mount,
              tabs
            );
          }
        );

      });
  }


  setActiveTabFromHash(tabs);

  applyCardFilters(
    mount,
    tabs
  );
}


/* =========================================================
   24. SCORES
   ========================================================= */

function mapScoreFromSupabase(
  row,
  logos
) {

  const s =
    Array.isArray(row.scores)
      ? row.scores[0]
      : row.scores;


  return {

    sport:
      (row.sports &&
        row.sports.nom) || "",

    competition:
      (row.competitions &&
        row.competitions.nom) || "",

    competitionLogo:
      (row.competitions &&
        row.competitions.logo_url) || "",

    pays:
      row.pays || "",

    equipe1:
      row.equipe1 || "",

    equipe1Logo:
      (logos &&
        logos.get(
          normaliserNom(
            row.equipe1
          )
        )) || "",

    equipe2:
      row.equipe2 || "",

    equipe2Logo:
      (logos &&
        logos.get(
          normaliserNom(
            row.equipe2
          )
        )) || "",

    date:
      formatDateFr(
        row.date_match
      ),

    dateIso:
      row.date_match || "",

    score1:
      s &&
      s.score_equipe1 !==
        undefined
        ? s.score_equipe1
        : null,

    score2:
      s &&
      s.score_equipe2 !==
        undefined
        ? s.score_equipe2
        : null,

    mt1:
      s &&
      s.score_mt_equipe1 !==
        undefined
        ? s.score_mt_equipe1
        : null,

    mt2:
      s &&
      s.score_mt_equipe2 !==
        undefined
        ? s.score_mt_equipe2
        : null
  };
}


async function fetchScoresTermines() {

  if (
    typeof supabaseClient ===
    "undefined"
  ) {
    return [];
  }


  try {

    const logos =
      await fetchEquipesLogos();


    const {
      data,
      error
    } = await supabaseClient
      .from("matchs")
      .select(
        "*, sports(nom, icone), competitions(nom, logo_url), scores(score_equipe1, score_equipe2, score_mt_equipe1, score_mt_equipe2)"
      )
      .eq(
        "statut",
        "terminé"
      )
      .order(
        "date_match",
        { ascending: false }
      );


    if (error) {
      throw error;
    }


    return (data || []).map(
      (row) =>
        mapScoreFromSupabase(
          row,
          logos
        )
    );

  } catch (err) {

    console.warn(
      "Supabase indisponible pour les scores.",
      err
    );

    return [];
  }
}


function renderScoreCard(m) {

  const hasScore =
    m.score1 !== null &&
    m.score1 !== undefined;


  return `
    <article
      class="match-card score-card"
      data-sport="${sportSlug(m.sport)}"
      data-pays="${escapeHTML(m.pays)}"
      data-competition="${escapeHTML(m.competition)}"
      data-date="${escapeHTML(m.dateIso)}"
    >

      <div class="match-card__top">

        <span class="sport-badge">
          ${sportIcon(m.sport)}
          ${escapeHTML(m.sport)}
        </span>

        <span class="status-badge is-termine">
          Terminé
        </span>

      </div>


      <div class="match-card__body">

        <div class="match-card__competition">

          ${
            m.competitionLogo
              ? `
                <img
                  src="${escapeHTML(m.competitionLogo)}"
                  alt=""
                  class="competition-logo"
                  loading="lazy"
                >
              `
              : ""
          }

          ${escapeHTML(m.competition)}

          ${
            m.pays
              ? " · " +
                escapeHTML(m.pays)
              : ""
          }

        </div>


        <div class="match-card__teams">

          <span>

            ${
              m.equipe1Logo
                ? `
                  <img
                    src="${escapeHTML(m.equipe1Logo)}"
                    alt=""
                    class="team-logo"
                    loading="lazy"
                  >
                `
                : ""
            }

            ${escapeHTML(m.equipe1)}

          </span>


          <span class="vs">
            vs
          </span>


          <span>

            ${
              m.equipe2Logo
                ? `
                  <img
                    src="${escapeHTML(m.equipe2Logo)}"
                    alt=""
                    class="team-logo"
                    loading="lazy"
                  >
                `
                : ""
            }

            ${escapeHTML(m.equipe2)}

          </span>

        </div>


        ${
          hasScore
            ? `
              <div class="score-card__score">

                <span>
                  ${escapeHTML(m.score1)}
                </span>

                <span class="separateur">
                  –
                </span>

                <span>
                  ${escapeHTML(m.score2)}
                </span>

              </div>


              ${
                m.mt1 !== null &&
                m.mt1 !== undefined
                  ? `
                    <div class="score-card__mt">
                      Mi-temps :
                      ${escapeHTML(m.mt1)}
                      –
                      ${escapeHTML(m.mt2)}
                    </div>
                  `
                  : ""
              }
            `
            : `
              <p class="match-card__meta">
                Score non renseigné.
              </p>
            `
        }


        <div class="match-card__meta">
          ${escapeHTML(m.date)}
        </div>

      </div>

    </article>
  `;
}


/* =========================================================
   25. INITIALISATION PAGE SCORES
   ========================================================= */

async function initScoresPage() {

  const mount =
    document.getElementById(
      "scores-liste"
    );

  if (!mount) {
    return;
  }


  const scores =
    await fetchScoresTermines();


  mount.innerHTML =
    scores.length
      ? scores
          .map(renderScoreCard)
          .join("")
      : emptyState(
          "Aucun résultat pour le moment."
        );


  const tabs =
    document.querySelector(
      ".sport-tabs"
    );

  const paysSelect =
    document.getElementById(
      "filtre-pays"
    );

  const competitionSelect =
    document.getElementById(
      "filtre-competition"
    );

  const dateSelect =
    document.getElementById(
      "filtre-date"
    );


  fillFilterSelect(
    paysSelect,
    scores.map(
      (m) => m.pays
    ),
    "Tous les pays"
  );


  fillFilterSelect(
    competitionSelect,
    scores.map(
      (m) => m.competition
    ),
    "Toutes les compétitions"
  );


  fillFilterSelect(
    dateSelect,
    scores.map(
      (m) => m.dateIso
    ),
    "Toutes les dates"
  );


  [
    paysSelect,
    competitionSelect,
    dateSelect
  ]
    .filter(Boolean)
    .forEach((select) => {

      select.addEventListener(
        "change",
        () => {
          applyCardFilters(
            mount,
            tabs
          );
        }
      );

    });


  if (tabs) {

    tabs
      .querySelectorAll(
        ".sport-tab"
      )
      .forEach((btn) => {

        btn.addEventListener(
          "click",
          () => {

            tabs
              .querySelectorAll(
                ".sport-tab"
              )
              .forEach((b) => {

                const active =
                  b === btn;

                b.classList.toggle(
                  "is-active",
                  active
                );

                b.setAttribute(
                  "aria-selected",
                  String(active)
                );
              });


            history.replaceState(
              null,
              "",
              "#" +
                btn.dataset.sportFilter
            );


            applyCardFilters(
              mount,
              tabs
            );
          }
        );

      });
  }


  setActiveTabFromHash(tabs);

  applyCardFilters(
    mount,
    tabs
  );
}


/* =========================================================
   26. COMPÉTITIONS
   ========================================================= */

function mapCompetitionFromSupabase(
  row
) {

  return {

    nom:
      row.nom || "",

    logo:
      row.logo_url || "",

    sport:
      (row.sports &&
        row.sports.nom) || "",

    pays:
      row.pays || ""
  };
}


async function fetchCompetitionsPublic() {

  if (
    typeof supabaseClient ===
    "undefined"
  ) {
    return [];
  }


  try {

    const {
      data,
      error
    } = await supabaseClient
      .from("competitions")
      .select(
        "*, sports(nom, icone)"
      )
      .eq(
        "actif",
        true
      )
      .order(
        "ordre_affichage",
        { ascending: true }
      );


    if (error) {
      throw error;
    }


    return (data || []).map(
      mapCompetitionFromSupabase
    );

  } catch (err) {

    console.warn(
      "Supabase indisponible pour les compétitions.",
      err
    );

    return [];
  }
}


function renderCompetitionCard(c) {

  return `
    <article
      class="match-card"
      data-sport="${sportSlug(c.sport)}"
      data-pays="${escapeHTML(c.pays)}"
    >

      <div class="match-card__top">

        <span class="sport-badge">
          ${sportIcon(c.sport)}
          ${escapeHTML(c.sport)}
        </span>

      </div>


      <div class="match-card__body">

        <div
          class="match-card__teams"
          style="font-size:1.1rem;"
        >

          ${
            c.logo
              ? `
                <img
                  src="${escapeHTML(c.logo)}"
                  alt=""
                  class="competition-logo"
                  loading="lazy"
                >
              `
              : ""
          }

          ${escapeHTML(c.nom)}

        </div>


        ${
          c.pays
            ? `
              <div class="match-card__meta">
                ${escapeHTML(c.pays)}
              </div>
            `
            : ""
        }

      </div>

    </article>
  `;
}


/* =========================================================
   27. INITIALISATION PAGE COMPÉTITIONS
   ========================================================= */

async function initCompetitionsPage() {

  const mount =
    document.getElementById(
      "competitions-liste"
    );

  if (!mount) {
    return;
  }


  const competitions =
    await fetchCompetitionsPublic();


  mount.innerHTML =
    competitions.length
      ? competitions
          .map(
            renderCompetitionCard
          )
          .join("")
      : emptyState(
          "Aucune compétition pour le moment."
        );


  const tabs =
    document.querySelector(
      ".sport-tabs"
    );

  const paysSelect =
    document.getElementById(
      "filtre-pays"
    );


  if (paysSelect) {

    fillFilterSelect(
      paysSelect,
      competitions.map(
        (c) => c.pays
      ),
      "Tous les pays"
    );


    paysSelect.addEventListener(
      "change",
      () => {

        applyCardFilters(
          mount,
          tabs
        );

      }
    );
  }


  if (tabs) {

    tabs
      .querySelectorAll(
        ".sport-tab"
      )
      .forEach((btn) => {

        btn.addEventListener(
          "click",
          () => {

            tabs
              .querySelectorAll(
                ".sport-tab"
              )
              .forEach((b) => {

                const active =
                  b === btn;

                b.classList.toggle(
                  "is-active",
                  active
                );

                b.setAttribute(
                  "aria-selected",
                  String(active)
                );

              });


            history.replaceState(
              null,
              "",
              "#" +
                btn.dataset.sportFilter
            );


            applyCardFilters(
              mount,
              tabs
            );
          }
        );

      });
  }


  setActiveTabFromHash(tabs);

  applyCardFilters(
    mount,
    tabs
  );
}


/* =========================================================
   28. FILTRE SPORT SIMPLE
   ========================================================= */

function applySportFilter(
  mount,
  sport
) {

  if (!mount) {
    return;
  }


  const cards =
    mount.querySelectorAll(
      ":scope > article[data-sport]"
    );


  let visibleCount = 0;


  cards.forEach((card) => {

    const match =
      sport === "tous" ||
      card.dataset.sport ===
        sport;


    card.style.display =
      match ? "" : "none";


    if (match) {
      visibleCount++;
    }

  });


  let empty =
    mount.querySelector(
      ".empty-state[data-filter-empty]"
    );


  if (
    visibleCount === 0 &&
    cards.length > 0
  ) {

    if (!empty) {

      empty =
        document.createElement(
          "div"
        );

      empty.className =
        "empty-state";

      empty.setAttribute(
        "data-filter-empty",
        "true"
      );

      empty.innerHTML =
        "<strong>Aucun résultat</strong>" +
        "Aucun contenu pour ce sport pour le moment.";

      mount.appendChild(empty);
    }

  } else if (empty) {

    empty.remove();
  }
}


/* =========================================================
   29. ONGLETS SPORTS
   ========================================================= */

function initSportTabs() {

  const tabsContainers =
    document.querySelectorAll(
      ".sport-tabs"
    );


  if (!tabsContainers.length) {
    return;
  }


  tabsContainers.forEach(
    (tabs) => {

      const section =
        tabs.closest(
          "section"
        );


      const mount =
        section
          ? section.querySelector(
              "[data-mount][data-filterable]"
            )
          : null;


      if (!mount) {
        return;
      }


      function selectSport(
        sport
      ) {

        tabs
          .querySelectorAll(
            ".sport-tab"
          )
          .forEach((btn) => {

            const isActive =
              btn.dataset
                .sportFilter ===
              sport;


            btn.classList.toggle(
              "is-active",
              isActive
            );


            btn.setAttribute(
              "aria-selected",
              String(isActive)
            );

          });


        applySportFilter(
          mount,
          sport
        );
      }


      tabs
        .querySelectorAll(
          ".sport-tab"
        )
        .forEach((btn) => {

          btn.addEventListener(
            "click",
            () => {

              selectSport(
                btn.dataset
                  .sportFilter
              );


              history.replaceState(
                null,
                "",
                "#" +
                  btn.dataset
                    .sportFilter
              );

            }
          );

        });


      const initial =
        window.location.hash.replace(
          "#",
          ""
        ) || "tous";


      const validInitial =
        tabs.querySelector(
          `[data-sport-filter="${initial}"]`
        )
          ? initial
          : "tous";


      selectSport(
        validInitial
      );
    }
  );
}


/* =========================================================
   30. NAVIGATION MOBILE
   ========================================================= */

function initNav() {

  const toggle =
    document.querySelector(
      ".nav-toggle"
    );

  const nav =
    document.querySelector(
      ".main-nav"
    );

  const backdrop =
    document.querySelector(
      ".nav-backdrop"
    );


  if (!toggle || !nav) {
    return;
  }


  function closeNav() {

    nav.classList.remove(
      "is-open"
    );


    if (backdrop) {
      backdrop.classList.remove(
        "is-open"
      );
    }


    toggle.setAttribute(
      "aria-expanded",
      "false"
    );
  }


  function openNav() {

    nav.classList.add(
      "is-open"
    );


    if (backdrop) {
      backdrop.classList.add(
        "is-open"
      );
    }


    toggle.setAttribute(
      "aria-expanded",
      "true"
    );
  }


  toggle.addEventListener(
    "click",
    () => {

      const isOpen =
        nav.classList.contains(
          "is-open"
        );


      if (isOpen) {
        closeNav();
      } else {
        openNav();
      }

    }
  );


  if (backdrop) {

    backdrop.addEventListener(
      "click",
      closeNav
    );

  }


  nav
    .querySelectorAll("a")
    .forEach(
      (link) =>
        link.addEventListener(
          "click",
          closeNav
        )
    );


  document.addEventListener(
    "keydown",
    (e) => {

      if (e.key === "Escape") {
        closeNav();
      }

    }
  );
}


/* =========================================================
   31. ACCORDÉON
   ========================================================= */

function initAccordion() {

  document
    .querySelectorAll(
      ".accordion__trigger"
    )
    .forEach((btn) => {

      btn.addEventListener(
        "click",
        () => {

          const panel =
            document.getElementById(
              btn.getAttribute(
                "aria-controls"
              )
            );


          const expanded =
            btn.getAttribute(
              "aria-expanded"
            ) === "true";


          btn.setAttribute(
            "aria-expanded",
            String(!expanded)
          );


          if (!panel) {
            return;
          }


          panel.style.maxHeight =
            expanded
              ? null
              : panel.scrollHeight +
                "px";
        }
      );

    });
}


/* =========================================================
   32. FORMULAIRE DE CONTACT
   ========================================================= */

function initContactForm() {

  const form =
    document.querySelector(
      "#contact-form"
    );


  if (!form) {
    return;
  }


  form.addEventListener(
    "submit",
    (e) => {

      e.preventDefault();


      const note =
        document.querySelector(
          "#contact-form-note"
        );


      if (note) {

        note.textContent =
          "Ce formulaire est une démonstration visuelle : aucun message n'est envoyé pour l'instant. Connectez un service comme Formspree pour l'activer.";

      }

    }
  );
}


/* =========================================================
   33. ANNÉE DU FOOTER
   ========================================================= */

function initFooterYear() {

  document
    .querySelectorAll(
      "[data-year]"
    )
    .forEach((el) => {

      el.textContent =
        new Date().getFullYear();

    });
}


/* =========================================================
   34. CLASSEMENT
   ========================================================= */

async function initClassementPage() {
  const mount = document.getElementById("classement-liste");

  // La page n'existe pas sur toutes les pages : aucune erreur ne doit être levée.
  if (!mount) return;

  // Le schéma de la table de classement n'étant pas défini dans ce script,
  // on ne fait aucune requête arbitraire à Supabase. On affiche un état vide
  // propre en attendant la définition du modèle de données.
  mount.innerHTML = emptyState(
    "Le classement sera disponible dès que sa source de données sera configurée."
  );
}


/* =========================================================
   35. ACTUALISATION AUTOMATIQUE
   ========================================================= */

function initAutoRefreshLive() {
  // Actualisation uniquement si un conteneur de matchs est présent.
  const mount = document.getElementById("matchs-liste");
  if (!mount) return;

  // Évite de créer plusieurs timers si le script est chargé deux fois.
  if (window.__jomionSportRefreshTimer) {
    clearInterval(window.__jomionSportRefreshTimer);
  }

  window.__jomionSportRefreshTimer = window.setInterval(async () => {
    try {
      await initMatchsPage();
    } catch (error) {
      console.warn("Actualisation des matchs impossible.", error);
    }
  }, 60000);
}


/* =========================================================
   INITIALISATION GÉNÉRALE
   ========================================================= */

document.addEventListener("DOMContentLoaded", async () => {

  try {

    await Promise.all([
      mountLists(),
      renderTicker()
    ]);

    initSportTabs();

    await initMatchsPage();

    await initScoresPage();

    await initCompetitionsPage();

    await initClassementPage();

    initNav();

    initAccordion();

    initContactForm();

    initFooterYear();

    initAutoRefreshLive();

  } catch (error) {

    console.error(
      "Erreur lors de l'initialisation de Jomion-Sport :",
      error
    );

  }

});
