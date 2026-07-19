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

function createPodiumInitialsEl(name, variant) {
  const el = document.createElement("div");
  el.className = `card__podium-avatar-initials card__podium-avatar-initials--${variant}`;
  el.textContent = getInitials(name);
  el.setAttribute("aria-hidden", "true");
  return el;
}

function createCelebrationInitialsEl(name) {
  const el = document.createElement("div");
  el.className = "celebration-overlay__avatar-initials";
  el.textContent = getInitials(name);
  el.setAttribute("aria-hidden", "true");
  return el;
}

function createPodiumAvatar(winner, variant) {
  const avatar = document.createElement("div");
  avatar.className = `card__podium-avatar card__podium-avatar--${variant}`;

  if (winner.photo) {
    const img = document.createElement("img");
    img.src = winner.photo;
    img.alt = `Foto de ${winner.name}`;
    img.loading = "lazy";
    img.onerror = () => {
      avatar.innerHTML = "";
      avatar.appendChild(createPodiumInitialsEl(winner.name, variant));
    };
    avatar.appendChild(img);
  } else {
    avatar.appendChild(createPodiumInitialsEl(winner.name, variant));
  }

  return avatar;
}

function createPodiumWinner(winner, variant) {
  const item = document.createElement("div");
  item.className = `card__podium-item card__podium-item--${variant}`;

  item.appendChild(createPodiumAvatar(winner, variant));

  const info = document.createElement("div");
  info.className = "card__podium-info";

  const place = document.createElement("span");
  place.className = `card__podium-place card__podium-place--${variant}`;
  place.textContent = `${winner.place}º`;
  info.appendChild(place);

  const name = document.createElement("p");
  name.className = `card__podium-name card__podium-name--${variant}`;
  name.textContent = winner.name;
  info.appendChild(name);

  const stage = document.createElement("div");
  stage.className = `card__podium-stage card__podium-stage--${variant}`;
  info.appendChild(stage);

  item.appendChild(info);
  return item;
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
  card.className = `card${entry.winners && entry.winners.length ? " card--wide" : ""}`;
  card.dataset.type = entry.type;
  card.dataset.year = entry.year;

  card.appendChild(createTournamentVisual(entry));

  if (entry.winners && entry.winners.length) {
    const podium = document.createElement("div");
    podium.className = "card__podium";

    entry.winners
      .slice()
      .sort((a, b) => a.place - b.place)
      .forEach((winner) => {
        const variant = winner.place === 1 ? "1" : winner.place === 2 ? "2" : "3";
        podium.appendChild(createPodiumWinner(winner, variant));
      });

    card.appendChild(podium);
  } else {
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
  }

  return card;
}

function createCelebrationWinnerCard(winner, position) {
  const card = document.createElement("div");
  card.className = `celebration-overlay__winner celebration-overlay__winner--${position}`;

  const avatar = document.createElement("div");
  avatar.className = "celebration-overlay__avatar";

  if (winner.photo) {
    const img = document.createElement("img");
    img.src = winner.photo;
    img.alt = `Foto de ${winner.name}`;
    img.loading = "lazy";
    img.onerror = () => {
      avatar.innerHTML = "";
      avatar.appendChild(createCelebrationInitialsEl(winner.name));
    };
    avatar.appendChild(img);
  } else {
    avatar.appendChild(createCelebrationInitialsEl(winner.name));
  }

  card.appendChild(avatar);

  const place = document.createElement("span");
  place.className = "celebration-overlay__winner-place";
  place.textContent = `${winner.place}º`;
  card.appendChild(place);

  const name = document.createElement("p");
  name.className = "celebration-overlay__winner-name";
  name.textContent = winner.name;
  card.appendChild(name);

  return card;
}

function startCelebrationOverlay() {
  const overlay = document.getElementById("celebration-overlay");
  const intro = document.getElementById("celebration-intro");
  const introLogo = document.getElementById("celebration-intro-logo");
  const introName = document.getElementById("celebration-intro-name");
  const title = document.getElementById("celebration-title");
  const winnersContainer = document.getElementById("celebration-winners");

  if (!overlay || !winnersContainer) return;

  const tournament = PRODE_WINNERS.find((entry) => entry.id === "wc-2026") || PRODE_WINNERS[0];
  const orderedWinners = [...(tournament?.winners || [])].sort((a, b) => a.place - b.place);

  if (introLogo && introName && tournament) {
    introLogo.innerHTML = "";
    if (tournament.logo) {
      const logo = document.createElement("img");
      logo.src = tournament.logo;
      logo.alt = `${tournament.tournament} ${tournament.edition}`;
      logo.loading = "lazy";
      introLogo.appendChild(logo);
    } else {
      introLogo.textContent = TYPE_ICONS[tournament.type] || "⚽";
    }
    introName.textContent = `${tournament.tournament} ${tournament.edition}`;
  }

  winnersContainer.innerHTML = "";
  orderedWinners.forEach((winner, index) => {
    const card = createCelebrationWinnerCard(winner, index + 1);
    winnersContainer.appendChild(card);
  });

  const sparkCount = 6;
  for (let i = 0; i < sparkCount; i += 1) {
    const spark = document.createElement("div");
    spark.className = `celebration-overlay__spark celebration-overlay__spark--${i + 1}`;
    overlay.appendChild(spark);
  }

  requestAnimationFrame(() => {
    overlay.classList.add("visible");
  });

  const cards = Array.from(winnersContainer.children);
  const [first, second, third] = cards;

  const revealSequence = () => {
    window.setTimeout(() => {
      if (intro) intro.classList.add("is-hidden");
      if (title) title.classList.add("visible");
      winnersContainer.classList.add("visible");
    }, 2200);

    if (first) {
      window.setTimeout(() => first.classList.add("active"), 2600);
    }
    if (second) {
      window.setTimeout(() => second.classList.add("active"), 3600);
    }
    if (third) {
      window.setTimeout(() => third.classList.add("active"), 4600);
    }

    window.setTimeout(() => {
      cards.forEach((card) => card.classList.add("podium"));
    }, 5600);
  };

  revealSequence();

  window.setTimeout(() => {
    overlay.classList.add("hidden");
  }, 10000);
}

function updateStats(data) {
  const uniqueWinners = new Set(data.map((e) => e.winner.name)).size;
  const tournamentsEl = document.getElementById("stat-tournaments");
  const winnersEl = document.getElementById("stat-winners");
  
  if (tournamentsEl) tournamentsEl.textContent = data.length;
  if (winnersEl) winnersEl.textContent = uniqueWinners;
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

  startCelebrationOverlay();
  updateStats(sorted);
  setupFilters(cards);
  setupScrollReveal(cards);
}

document.addEventListener("DOMContentLoaded", init);
