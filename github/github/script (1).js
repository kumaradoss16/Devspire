(function () {

            /* ============================================================
  REPO DATA — loaded from repos.json at runtime.
  To update repos, edit repos.json only. Do not hardcode here.
============================================================ */

let allRepos = [];

async function loadRepos() {
  try {
    const res = await fetch('repos.json');
    if (!res.ok) throw new Error('Failed to load repos.json: ' + res.status);
    allRepos = await res.json();
  } catch (err) {
    console.error('Could not load repos.json:', err);
    allRepos = [];
  }
}



            const CATS = {
                all: { label: "All Projects", emoji: "⚡", desc: "Show everything", color: "#22d3a0", dim: "rgba(34,211,160,.09)", border: "rgba(34,211,160,.28)" },
                security: { label: "Security", emoji: "🛡️", desc: "Hacking & pen-testing", color: "#22d3a0", dim: "rgba(34,211,160,.09)", border: "rgba(34,211,160,.28)" },
                ai: { label: "AI / ML", emoji: "🧠", desc: "Models & automation", color: "#a78bfa", dim: "rgba(167,139,250,.09)", border: "rgba(167,139,250,.28)" },
                dev: { label: "Dev Tools", emoji: "🛠️", desc: "CLIs, linters, utils", color: "#60a5fa", dim: "rgba(96,165,250,.09)", border: "rgba(96,165,250,.28)" },
                network: { label: "Network", emoji: "📡", desc: "Scanners & protocols", color: "#22d3ee", dim: "rgba(34,211,238,.09)", border: "rgba(34,211,238,.28)" },
                systems: { label: "Systems", emoji: "⚙️", desc: "OS & low-level tools", color: "#fbbf24", dim: "rgba(251,191,36,.09)", border: "rgba(251,191,36,.28)" },
                web: { label: "Web", emoji: "🌐", desc: "Frameworks & frontends", color: "#f87171", dim: "rgba(248,113,113,.09)", border: "rgba(248,113,113,.28)" }
            };

            const LANG_COLORS = { Python: "#3572A5", JavaScript: "#f1e05a", TypeScript: "#3178c6", Go: "#00ADD8", Rust: "#dea584", C: "#555", "C++": "#f34b7d", Java: "#b07219", Kotlin: "#A97BFF", Shell: "#89e051", HTML: "#e34c26", CSS: "#563d7c", Ruby: "#701516", Swift: "#F05138", PHP: "#4F5D95", Dart: "#00B4AB", default: "#8892a4" };

            let active = "all", menuOpen = false;

            /* ---- Build card (no icon) ---- */
            function buildCard(r) {
                const lc = LANG_COLORS[r.language] || LANG_COLORS.default;
                const topics = (r.topics || []).slice(0, 3);
                const cm = CATS[r.cat] || CATS.all;
                return `
    <a href="${r.url}" target="_blank" rel="noopener noreferrer"
       class="oss-card" data-cat="${r.cat}" aria-label="${r.owner}/${r.name} on GitHub">

      <div class="card__top">
        <div class="card__badges">
          <span class="card__cat-pill">${cm.label}</span>
        </div>
        <div class="card__arrow" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
               stroke-linecap="round" stroke-linejoin="round">
            <line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/>
          </svg>
        </div>
      </div>

      <div>
        <div class="card__owner">${r.owner} /</div>
        <div class="card__name">${r.name}</div>
      </div>

      <p class="card__desc">${r.desc}</p>

      ${topics.length ? `<div class="card__topics">${topics.map(t => `<span class="card__topic">${t}</span>`).join("")}</div>` : ""}

      <div class="card__footer">
        <div class="card__lang">
          ${r.language ? `<span class="lang-dot" style="background:${lc};" aria-hidden="true"></span>${r.language}` : "—"}
        </div>
        <div class="card__updated"><i class="fas fa-calendar"></i> ${r.updated}</div>
      </div>
    </a>`;
            }

            /* ---- Build dropdown ---- */
            function buildMenu() {
                const menu = document.getElementById("sb-menu");
                const usedCats = [...new Set(allRepos.map(r => r.cat))];
                const allCats = ["all", ...usedCats];
                let html = "";
                allCats.forEach((cat, i) => {
                    const m = CATS[cat] || CATS.all;
                    const count = cat === "all" ? allRepos.length : allRepos.filter(r => r.cat === cat).length;
                    const isSel = cat === active;
                    html += `
      <button class="sb__menu-item${isSel ? " selected" : ""}" data-cat="${cat}"
              style="--item-color:${m.color};--item-dim:${m.dim};"
              role="option" aria-selected="${isSel}">
        <span class="sb__item-emoji">${m.emoji}</span>
        <div class="sb__item-body">
          <div class="sb__item-label">${m.label}</div>
          <div class="sb__item-desc">${m.desc}</div>
        </div>
        <span class="sb__item-count">${count}</span>
      </button>`;
                    if (i === 0) html += `<div class="sb__menu-div"></div>`;
                });
                menu.innerHTML = html;
                menu.querySelectorAll(".sb__menu-item").forEach(btn => {
                    btn.addEventListener("click", e => {
                        e.stopPropagation(); active = btn.dataset.cat; closeMenu();
                        updateTrigger(); renderGrid(); updateBanner();
                        menu.querySelectorAll(".sb__menu-item").forEach(b => {
                            const sel = b.dataset.cat === active;
                            b.classList.toggle("selected", sel); b.setAttribute("aria-selected", sel);
                        });
                    });
                });
            }

            const trigger = document.getElementById("sb-trigger");
            const menuEl = document.getElementById("sb-menu");
            function openMenu() { menuOpen = true; menuEl.classList.add("open"); trigger.classList.add("open"); trigger.setAttribute("aria-expanded", "true"); }
            function closeMenu() { menuOpen = false; menuEl.classList.remove("open"); trigger.classList.remove("open"); trigger.setAttribute("aria-expanded", "false"); }
            trigger.addEventListener("click", e => { e.stopPropagation(); menuOpen ? closeMenu() : openMenu(); });
            document.addEventListener("click", () => closeMenu());
            document.addEventListener("keydown", e => { if (e.key === "Escape") closeMenu(); });

            function updateTrigger() {
                const m = CATS[active] || CATS.all;
                document.getElementById("sb-trigger-icon").textContent = m.emoji;
                document.getElementById("sb-trigger-label").textContent = m.label;
                document.getElementById("sb-trigger-sub").textContent = m.desc;
                document.getElementById("sb-trigger-bar").style.background = m.color;
                trigger.style.setProperty("--cat-color", m.color);
                trigger.style.setProperty("--cat-glow", m.dim);
            }

            function updateBanner() {
                const banner = document.getElementById("cat-banner");
                const m = CATS[active] || CATS.all;
                const visible = active === "all" ? allRepos.length : allRepos.filter(r => r.cat === active).length;
                banner.style.cssText = `--cat:${m.color};--catd:${m.dim};--catb:${m.border};`;
                banner.innerHTML = `
      <span style="font-size:1rem">${m.emoji}</span>
      <strong style="font-size:.85rem">${m.label}</strong>
      <div class="cat-banner__right">
        <span>${visible} project${visible !== 1 ? "s" : ""}</span>
      </div>`;
            }

            function renderGrid() {
                const grid = document.getElementById("oss-grid");
                const filtered = active === "all" ? allRepos : allRepos.filter(r => r.cat === active);
                grid.innerHTML = filtered.length
                    ? filtered.map(buildCard).join("")
                    : `<div class="oss-empty">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"
               stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <p>No projects in this category yet.</p>
        </div>`;
                document.getElementById("sb-total").textContent = allRepos.length;
                document.getElementById("sb-visible").textContent = filtered.length;
            }

            /* ---- INIT ---- */
            buildMenu();
            updateTrigger();
            renderGrid();
            updateBanner();

        })();
    
document.addEventListener('DOMContentLoaded', () => {
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks   = document.querySelector('.nav-links');
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      const icon = menuToggle.querySelector('i');
      if (navLinks.classList.contains('active')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
      } else {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
      }
    });
  }
});

// ── Typewriter Effect ─────────────────────────────────
const el = document.getElementById('brand');
if (el) {
  const text         = el.dataset.text || 'DevSpireHub';
  let i              = 0;
  let isDeleting     = false;
  const typeSpeed    = 100;
  const deleteSpeed  = 50;
  const pauseTime    = 2000;
  const restartPause = 500;

  function typeLoop() {
    el.textContent = text.slice(0, i);
    if (!isDeleting && i < text.length) {
      i++;
      setTimeout(typeLoop, typeSpeed);
    } else if (!isDeleting && i === text.length) {
      isDeleting = true;
      setTimeout(typeLoop, pauseTime);
    } else if (isDeleting && i > 0) {
      i--;
      setTimeout(typeLoop, deleteSpeed);
    } else {
      isDeleting = false;
      setTimeout(typeLoop, restartPause);
    }
  }
  typeLoop();
}

// ── Scroll To Top + Progress Circle ──────────────────
const scrollBtn = document.getElementById('scrollUpBtn');
if (scrollBtn) {
  const circle        = scrollBtn.querySelector('.progress-circle');
  const circumference = 2 * Math.PI * 15.9155;

  if (circle) {
    circle.style.strokeDasharray  = circumference;
    circle.style.strokeDashoffset = circumference;
  }

  window.addEventListener('scroll', () => {
    const scrollTop     = window.scrollY;
    const docHeight     = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = docHeight > 0 ? scrollTop / docHeight : 0;

    if (circle) {
      circle.style.strokeDashoffset = circumference * (1 - scrollPercent);
    }
    scrollBtn.style.display = scrollTop > 100 ? 'block' : 'none';
  });

  scrollBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

function init() {
}
}


document.addEventListener('DOMContentLoaded', async () => {
  await loadRepos();
  init();
});
