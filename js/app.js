const TYPE_LABELS = {
  mundial: "Copa Mundial",
  "mundial-clubes": "Mundial de Clubes",
  euro: "Eurocopa",
  "copa-america": "Copa América",
};

const TYPE_ICONS = {
  mundial: "🏆",
  "mundial-clubes": "🌍",
  euro: "⭐",
  "copa-america": "🌎",
};

function getInitials(name) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join("");
}

function createAvatar(winner) {
  const avatar = document.createElement("div");
  avatar.className = "card__avatar";

  if (winner.photo) {
    const img = document.createElement("img");
    img.src = winner.photo;
    img.alt = `Foto de ${winner.name}`;
    img.loading = "lazy";
    img.onerror = () => {
      avatar.innerHTML = "";
      avatar.appendChild(createInitialsEl(winner.name));
    };
    avatar.appendChild(img);
  } else {
    avatar.appendChild(createInitialsEl(winner.name));
  }

  return avatar;
}

function createInitialsEl(name) {
  const el = document.createElement("div");
  el.className = "card__avatar-initials";
  el.textContent = getInitials(name);
  el.setAttribute("aria-hidden", "true");
  return el;
}

function createTournamentVisual(entry) {
  const wrap = document.createElement("div");
  wrap.className = `card__tournament card__tournament--${entry.type}`;

  if (entry.logo) {
    const logoBox = document.createElement("div");
    logoBox.className = "card__tournament-logo";

    const img = document.createElement("img");
    img.className = "card__tournament-img";
    img.src = entry.logo;
    img.alt = `${entry.tournament} ${entry.edition}`;
    img.loading = "lazy";
    if (entry.logoPosition) {
      img.style.objectPosition = entry.logoPosition;
    }
    img.onerror = () => {
      logoBox.replaceWith(createFallback(entry.type));
    };
    logoBox.appendChild(img);
    wrap.appendChild(logoBox);
  } else {
    wrap.appendChild(createFallback(entry.type));
  }

  const overlay = document.createElement("div");
  overlay.className = "card__tournament-overlay";
  wrap.appendChild(overlay);

  const info = document.createElement("div");
  info.className = "card__tournament-info";

  const badge = document.createElement("span");
  badge.className = `card__type-badge card__type-badge--${entry.type}`;
  badge.textContent = TYPE_LABELS[entry.type];
  info.appendChild(badge);

  const name = document.createElement("p");
  name.className = "card__tournament-name";
  name.textContent = entry.tournament;
  info.appendChild(name);

  const edition = document.createElement("p");
  edition.className = "card__edition";
  edition.textContent = entry.edition;
  info.appendChild(edition);

  wrap.appendChild(info);
  return wrap;
}

function createFallback(type) {
  const el = document.createElement("div");
  el.className = `card__tournament-fallback card__tournament-fallback--${type}`;
  el.textContent = TYPE_ICONS[type] || "⚽";
  el.setAttribute("aria-hidden", "true");
  return el;
}

function createCard(entry) {
  const card = document.createElement("article");
  card.className = "card";
  card.dataset.type = entry.type;
  card.dataset.year = entry.year;

  card.appendChild(createTournamentVisual(entry));

  const winnerSection = document.createElement("div");
  winnerSection.className = "card__winner";

  winnerSection.appendChild(createAvatar(entry.winner));

  const info = document.createElement("div");
  info.className = "card__winner-info";

  const label = document.createElement("p");
  label.className = "card__winner-label";
  label.textContent = "Campeón del prode";
  info.appendChild(label);

  const name = document.createElement("p");
  name.className = "card__winner-name";
  name.textContent = entry.winner.name;
  info.appendChild(name);

  winnerSection.appendChild(info);

  const crown = document.createElement("span");
  crown.className = "card__crown";
  crown.textContent = "👑";
  crown.setAttribute("aria-hidden", "true");
  winnerSection.appendChild(crown);

  card.appendChild(winnerSection);
  return card;
}

function updateStats(data) {
  const uniqueWinners = new Set(data.map((e) => e.winner.name)).size;
  document.getElementById("stat-tournaments").textContent = data.length;
  document.getElementById("stat-winners").textContent = uniqueWinners;
  document.getElementById("stat-years").textContent =
    data[data.length - 1]?.year + "–" + data[0]?.year;
}

function setupFilters(cards) {
  const buttons = document.querySelectorAll(".filter-btn");
  const emptyState = document.getElementById("empty-state");

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      buttons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const filter = btn.dataset.filter;
      let visibleCount = 0;

      cards.forEach((card) => {
        const show = filter === "all" || card.dataset.type === filter;
        card.classList.toggle("hidden", !show);
        if (show) visibleCount++;
      });

      emptyState.classList.toggle("visible", visibleCount === 0);
    });
  });
}

function setupScrollReveal(cards) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );

  cards.forEach((card, i) => {
    card.style.transitionDelay = `${Math.min(i * 0.06, 0.36)}s`;
    observer.observe(card);
  });
}

function init() {
  const sorted = [...PRODE_WINNERS].sort((a, b) => b.year - a.year);
  const container = document.getElementById("cards");
  const cards = sorted.map(createCard);

  cards.forEach((card) => container.appendChild(card));

  updateStats(sorted);
  setupFilters(cards);
  setupScrollReveal(cards);
}

document.addEventListener("DOMContentLoaded", init);
