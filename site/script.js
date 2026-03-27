const roles = ["Support Engineer", "IT Specialist", "SQL + API Problem Solver"];
const roleText = document.getElementById("roleText");
let index = 0;

if (roleText) {
  setInterval(() => {
    index = (index + 1) % roles.length;
    roleText.style.opacity = "0";
    setTimeout(() => {
      roleText.textContent = roles[index];
      roleText.style.opacity = "1";
    }, 180);
  }, 2200);
}

const splash = document.querySelector(".splash");
const enterCta = document.getElementById("enterCta");
const nightStars = document.getElementById("nightStars");
const jokerRunner = document.getElementById("jokerRunner");
const jokerQuote = document.getElementById("jokerQuote");
let spotlightX = 50;
let spotlightY = 34;

if (nightStars && nightStars.children.length === 0) {
  const starCount = 90;
  for (let i = 0; i < starCount; i += 1) {
    const star = document.createElement("span");
    star.className = "star";
    star.style.left = `${Math.random() * 100}%`;
    star.style.top = `${Math.random() * 64}%`;
    const size = Math.random() < 0.15 ? 3 : 2;
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    star.style.animationDelay = `${(Math.random() * 3.8).toFixed(2)}s`;
    star.style.animationDuration = `${(2.8 + Math.random() * 3).toFixed(2)}s`;
    nightStars.appendChild(star);
  }
}

if (splash && jokerRunner) {
  const towerNodes = Array.from(document.querySelectorAll(".skyscrapers .tower"));
  const fallbackRoute = [
    { left: 9, bottom: 37 },
    { left: 21, bottom: 46 },
    { left: 36, bottom: 35 },
    { left: 54, bottom: 49 },
    { left: 71, bottom: 40 },
    { left: 86, bottom: 45 }
  ];
  let currentIndex = 0;
  let direction = 1;

  const getTowerRoute = () => {
    if (!towerNodes.length) {
      return fallbackRoute;
    }

    const splashRect = splash.getBoundingClientRect();
    return towerNodes.map((tower) => {
      const rect = tower.getBoundingClientRect();
      const left = ((rect.left + rect.width / 2 - splashRect.left) / splashRect.width) * 100;
      const bottom = ((splashRect.bottom - rect.top) / splashRect.height) * 100;
      return {
        left: Math.max(5, Math.min(95, left)),
        bottom: Math.max(20, Math.min(64, bottom))
      };
    });
  };

  const jumpToNextTower = () => {
    const towerRoute = getTowerRoute();
    if (!towerRoute.length) {
      return;
    }

    if (currentIndex < 0) {
      currentIndex = 0;
    }
    if (currentIndex >= towerRoute.length) {
      currentIndex = towerRoute.length - 1;
    }

    const point = towerRoute[currentIndex];
    jokerRunner.classList.add("active");
    jokerRunner.style.left = `${point.left}%`;
    jokerRunner.style.bottom = `${point.bottom}%`;
    if (jokerQuote) {
      jokerQuote.style.left = `${point.left}%`;
      jokerQuote.style.bottom = `${point.bottom + 7}%`;
    }
    jokerRunner.classList.add("jump");

    setTimeout(() => {
      jokerRunner.classList.remove("jump");
    }, 220);

    if (towerRoute.length === 1) {
      return;
    }

    if (currentIndex >= towerRoute.length - 1) {
      direction = -1;
    } else if (currentIndex <= 0) {
      direction = 1;
    }

    currentIndex += direction;
  };

  jumpToNextTower();
  setInterval(jumpToNextTower, 3000);
}

if (splash) {
  const spawnShootingStar = () => {
    const star = document.createElement("span");
    star.className = "shooting-star";
    star.style.left = `${8 + Math.random() * 78}%`;
    star.style.top = `${4 + Math.random() * 32}%`;
    const duration = 1100 + Math.random() * 900;
    star.style.animationDuration = `${duration}ms`;
    splash.appendChild(star);
    setTimeout(() => {
      star.remove();
    }, duration + 160);
  };

  setTimeout(() => {
    spawnShootingStar();
  }, 5000 + Math.random() * 5000);

  setInterval(() => {
    const randomDelay = Math.random() * 6500;
    setTimeout(() => {
      spawnShootingStar();
    }, randomDelay);
  }, 20000);
}

if (splash) {
  const updateJokerQuoteVisibility = () => {
    if (!jokerRunner || !jokerQuote) {
      return;
    }

    const rect = splash.getBoundingClientRect();
    const jokerRect = jokerRunner.getBoundingClientRect();
    const jokerX = ((jokerRect.left + jokerRect.width / 2 - rect.left) / rect.width) * 100;
    const jokerY = ((jokerRect.top + jokerRect.height / 2 - rect.top) / rect.height) * 100;
    const dx = spotlightX - jokerX;
    const dy = spotlightY - jokerY;
    const distance = Math.hypot(dx, dy);
    const inBeam = distance < 14;

    jokerQuote.classList.toggle("visible", inBeam);
  };

  const updateSpotlight = (clientX, clientY) => {
    const rect = splash.getBoundingClientRect();
    const rawX = ((clientX - rect.left) / rect.width) * 100;
    const rawY = ((clientY - rect.top) / rect.height) * 100;
    const x = Math.max(6, Math.min(94, rawX));
    const y = Math.max(8, Math.min(84, rawY));
    spotlightX = x;
    spotlightY = y;
    splash.style.setProperty("--mx", `${x}%`);
    splash.style.setProperty("--my", `${y}%`);
    updateJokerQuoteVisibility();
  };

  splash.addEventListener("mousemove", (event) => {
    updateSpotlight(event.clientX, event.clientY);
  });

  splash.addEventListener("touchmove", (event) => {
    if (event.touches[0]) {
      updateSpotlight(event.touches[0].clientX, event.touches[0].clientY);
    }
  }, { passive: true });

  splash.addEventListener("mouseleave", () => {
    spotlightX = 50;
    spotlightY = 34;
    splash.style.setProperty("--mx", "50%");
    splash.style.setProperty("--my", "34%");
    updateJokerQuoteVisibility();
  });

  setInterval(updateJokerQuoteVisibility, 180);
}

if (enterCta) {
  enterCta.addEventListener("click", (event) => {
    event.preventDefault();
    const topSection = document.getElementById("top");
    if (topSection) {
      topSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
}

const hero = document.querySelector(".hero");
if (hero) {
  hero.addEventListener("mousemove", (event) => {
    const bounds = hero.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width;
    const y = (event.clientY - bounds.top) / bounds.height;
    const rotateX = (0.5 - y) * 4;
    const rotateY = (x - 0.5) * 5;
    hero.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });

  hero.addEventListener("mouseleave", () => {
    hero.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg)";
  });
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
    }
  });
}, { threshold: 0.14 });

document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
