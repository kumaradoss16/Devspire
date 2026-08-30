document.addEventListener('DOMContentLoaded', () => {

  /* ═══════════════════════════════════════════════
     1. NAV MENU TOGGLE
  ═══════════════════════════════════════════════ */
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

  /* ═══════════════════════════════════════════════
     2. TYPEWRITER EFFECT
  ═══════════════════════════════════════════════ */
  const el = document.getElementById('brand');
  if (el) {
    const text        = el.dataset.text || 'DevSpireHub';
    let i             = 0;
    let isDeleting    = false;
    const typeSpeed   = 100;
    const deleteSpeed = 50;
    const pauseTime   = 2000;
    const restartPause= 500;

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

  /* ═══════════════════════════════════════════════
     3. SCROLL TO TOP — PROGRESS CIRCLE
  ═══════════════════════════════════════════════ */
  const scrollBtn    = document.getElementById('scrollUpBtn');
  if (scrollBtn) {
    const circle       = scrollBtn.querySelector('.progress-circle');
    const circumference = 2 * Math.PI * 15.9155;

    if (circle) {
      circle.style.strokeDasharray  = circumference;
      circle.style.strokeDashoffset = circumference;
    }

    window.addEventListener('scroll', () => {
      const scrollTop   = window.scrollY;
      const docHeight   = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = docHeight > 0 ? scrollTop / docHeight : 0;

      if (circle) {
        circle.style.strokeDashoffset = circumference * (1 - scrollPercent);
      }
      scrollBtn.style.display = scrollTop > 100 ? 'block' : 'none';
    });

    scrollBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  function addSectionAnchors() {
  document.querySelectorAll(".content h3, .content h4").forEach(function (heading) {
    if (heading.querySelector(".ds-anchor")) return;

    var parent = heading.closest("[id]");
    if (!parent) return;

    var link = document.createElement("a");
    link.className = "ds-anchor";
    link.href = "#" + parent.id;
    link.textContent = "#";
    link.style.marginLeft = "8px";
    link.style.fontSize = "0.8em";
    link.style.color = "#64748b";
    link.style.textDecoration = "none";
    link.setAttribute("aria-label", "Link to this section");

    link.addEventListener("click", function (e) {
      e.preventDefault();
      var url = location.origin + location.pathname + "#" + parent.id;
      navigator.clipboard.writeText(url);
      history.replaceState(null, "", "#" + parent.id);
      link.textContent = "✓";
      setTimeout(function () { link.textContent = "#"; }, 1200);
    });

    heading.appendChild(link);
  });
}
document.addEventListener("DOMContentLoaded", addSectionAnchors);

function secureExternalLinks() {
  var host = location.hostname;
  document.querySelectorAll("a[href^='http']").forEach(function (a) {
    try {
      var linkHost = new URL(a.href).hostname;
      if (linkHost !== host && !a.classList.contains("ds-ext")) {
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        a.classList.add("ds-ext");
        a.style.borderBottom = "1px dotted currentColor";
      }
    } catch (e) {}
  });
}
document.addEventListener("DOMContentLoaded", secureExternalLinks);

function initSearchShortcut() {
  var searchInput = document.querySelector("input[type='search'], .search-input");
  if (!searchInput) return;

  document.addEventListener("keydown", function (e) {
    var isTyping = ["INPUT", "TEXTAREA"].includes(document.activeElement.tagName);
    if (e.key === "/" && !isTyping) {
      e.preventDefault();
      searchInput.focus();
    }
  });
}
document.addEventListener("DOMContentLoaded", initSearchShortcut);

function addContentImageFallback() {
  var SITEROOT = document.querySelector('link[rel="icon"]')
    ? document.querySelector('link[rel="icon"]').getAttribute('href').replace('images/icon.webp', '')
    : '../../../../../';

  document.querySelectorAll(".content img, .image-placeholder img").forEach(function (img) {
    img.addEventListener("error", function () {
      if (img.dataset.fallbackApplied) return;
      img.dataset.fallbackApplied = "true";
      img.src = SITEROOT + "images/placeholder.webp";
      img.alt = img.alt || "Image unavailable";
    }, { once: true });
  });
}
document.addEventListener("DOMContentLoaded", addContentImageFallback);


  /* ═══════════════════════════════════════════════
     5. DEALS / AFFILIATE LOADER
  ═══════════════════════════════════════════════ */
  const DEALS_PER_PAGE = 6;
  let   dealsPage      = 0;

  const SITEROOT  = '../../../../../';
  const JSONPATH  = SITEROOT + 'amazon-links.json';
  const IMGFOLDER = SITEROOT + 'images/products/';

  function loadDeals() {
    const grid = document.getElementById('dealsGrid');
    if (!grid) return;

    fetch(JSONPATH)
      .then(res => {
        if (!res.ok) throw new Error('HTTP ' + res.status + ' — ' + JSONPATH);
        return res.json();
      })
      .then(data => renderDeals(data.products))
      .catch(err => {
        console.error('Deals load failed:', err.message);
        const grid = document.getElementById('dealsGrid');
        if (grid) grid.innerHTML = `<p style="color:#aaa;font-size:13px;padding:10px">Deals unavailable. Please try again later.</p>`;
      });
  }

  function renderDeals(products) {
    const grid = document.getElementById('dealsGrid');
    if (!grid) return;

    grid.innerHTML = products.map((prod, i) => `
      <a href="${prod.link}" target="_blank" rel="nofollow sponsored"
         class="deal-card" data-id="${prod.id}" style="display:none"
         aria-label="Buy ${prod.name.replace(/<br>/g, ' ')} on Amazon">
        <span class="deal-badge">${prod.badge}</span>
        <div class="deal-img-wrap">
          <img src="${IMGFOLDER}${prod.image}"
               alt="${prod.name.replace(/<br>/g, ' ')}"
               loading="lazy"
               onerror="this.src='${IMGFOLDER}placeholder.webp';this.onerror=null">
        </div>
        <p class="deal-label">${prod.name}</p>
      </a>
    `).join('');

    showDealsPage(0);
  }

  function showDealsPage(page) {
    const cards = document.querySelectorAll('#dealsGrid .deal-card');
    if (!cards.length) return;

    const totalPages = Math.ceil(cards.length / DEALS_PER_PAGE);
    if (page < 0)          page = totalPages - 1;
    if (page >= totalPages) page = 0;
    dealsPage = page;

    const start = dealsPage * DEALS_PER_PAGE;
    const end   = start + DEALS_PER_PAGE;
    cards.forEach((card, i) => {
      card.style.display = (i >= start && i < end) ? 'flex' : 'none';
    });

    const indicator = document.getElementById('dealsPageIndicator');
    if (indicator) indicator.textContent = `${dealsPage + 1} / ${totalPages}`;

    const prev = document.querySelector('.deal-arrow-btn[aria-label="Previous"]');
    const next = document.querySelector('.deal-arrow-btn[aria-label="Next"]');
    if (prev) prev.style.opacity = dealsPage === 0            ? '0.4' : '1';
    if (next) next.style.opacity = dealsPage === totalPages-1 ? '0.4' : '1';
  }

  window.scrollDeals = function (dir) { showDealsPage(dealsPage + dir); };

  loadDeals();

  /* ═══════════════════════════════════════════════
     6. FEATURED OPEN-SOURCE PROJECTS BANNER
        Single source of truth: repos-data.js (window.REPOS)
  ═══════════════════════════════════════════════ */
  initBanner();
});

// Adds checkboxes to <li> items inside the "Practice Roadmap" section
// (id="step-7") and remembers checked state per-page in localStorage.
// Shows a "X/Y solved" progress line above the list.
function initRoadmapTracker() {
  var roadmap = document.querySelector("#step-7");
  if (!roadmap) return;

  var items = roadmap.querySelectorAll("li");
  if (!items.length) return;

  var storageKey = "ds-roadmap-" + location.pathname;
  var saved = JSON.parse(localStorage.getItem(storageKey) || "{}");

  var progressEl = document.createElement("p");
  progressEl.style.cssText = "font-weight:600;margin-bottom:12px;color:#f97316;";
  roadmap.querySelector("h3")?.insertAdjacentElement("afterend", progressEl);

  function updateProgress() {
    var checked = roadmap.querySelectorAll("input[type=checkbox]:checked").length;
    progressEl.textContent = checked + " / " + items.length + " problems solved";
  }

  items.forEach(function (li, i) {
    var checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.style.marginRight = "8px";
    checkbox.checked = !!saved[i];
    checkbox.addEventListener("change", function () {
      saved[i] = checkbox.checked;
      localStorage.setItem(storageKey, JSON.stringify(saved));
      updateProgress();
    });
    li.prepend(checkbox);
  });

  updateProgress();
}

// Saves scroll position per-URL in localStorage (throttled) and shows a
// small dismissible banner on return visits offering to resume reading.
function initResumeReading() {
  var storageKey = "ds-scroll-" + location.pathname;
  var saved = localStorage.getItem(storageKey);

  if (saved && parseInt(saved, 10) > 400) {
    var banner = document.createElement("div");
    banner.style.cssText =
      "position:fixed;bottom:20px;left:20px;right:20px;max-width:360px;" +
      "background:#0f172a;color:#e2e8f0;padding:12px 16px;border-radius:8px;" +
      "box-shadow:0 4px 12px rgba(0,0,0,.3);z-index:999;font-size:14px;" +
      "display:flex;justify-content:space-between;align-items:center;gap:12px;";
    banner.innerHTML =
      '<span>Resume where you left off?</span>' +
      '<span style="display:flex;gap:8px;">' +
      '<button id="ds-resume-yes" style="background:#f97316;border:none;color:#fff;padding:6px 12px;border-radius:4px;cursor:pointer;">Resume</button>' +
      '<button id="ds-resume-no" style="background:transparent;border:none;color:#94a3b8;cursor:pointer;">✕</button>' +
      '</span>';
    document.body.appendChild(banner);

    document.getElementById("ds-resume-yes").addEventListener("click", function () {
      window.scrollTo({ top: parseInt(saved, 10), behavior: "smooth" });
      banner.remove();
    });
    document.getElementById("ds-resume-no").addEventListener("click", function () {
      banner.remove();
    });
  }

  var saveTimer;
  window.addEventListener("scroll", function () {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(function () {
      localStorage.setItem(storageKey, String(window.scrollY));
    }, 500);
  });
}


function auditPageMetadata() {
  var title = document.title.trim();
  var ogTitle = document.querySelector('meta[property="og:title"]')?.content.trim();
  var canonical = document.querySelector('link[rel="canonical"]')?.href;
  var ldScripts = document.querySelectorAll('script[type="application/ld+json"]');

  var articleHeadline = null;
  ldScripts.forEach(function (s) {
    try {
      var data = JSON.parse(s.textContent);
      if (data['@type'] === 'TechArticle') articleHeadline = data.headline;
    } catch (e) {}
  });

  var mismatches = [];
  if (ogTitle && !titlesRoughlyMatch(title, ogTitle)) mismatches.push('title vs og:title');
  if (articleHeadline && !titlesRoughlyMatch(title, articleHeadline)) mismatches.push('title vs JSON-LD headline');
  if (canonical && !canonical.includes(location.pathname.split('/').pop().replace('.html', ''))) {
    mismatches.push('canonical URL vs current filename');
  }

  if (mismatches.length) {
    console.warn('Metadata mismatch detected:', mismatches.join(', '));
  }

  function titlesRoughlyMatch(a, b) {
    var norm = function (s) { return s.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 20); };
    return norm(a) === norm(b) || norm(a).includes(norm(b).slice(0, 10)) || norm(b).includes(norm(a).slice(0, 10));
  }
}

function secureExternalLinks() {
  var host = location.hostname;
  document.querySelectorAll("a[href^='http']").forEach(function (a) {
    try {
      var linkHost = new URL(a.href).hostname;
      if (linkHost !== host && !a.classList.contains("ds-ext")) {
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        a.classList.add("ds-ext");
        a.style.borderBottom = "1px dotted currentColor";
      }
    } catch (e) {}
  });
}

function initSearchShortcut() {
  var searchInput = document.querySelector("input[type='search'], .search-input");
  if (!searchInput) return;

  document.addEventListener("keydown", function (e) {
    var isTyping = ["INPUT", "TEXTAREA"].includes(document.activeElement.tagName);
    if (e.key === "/" && !isTyping) {
      e.preventDefault();
      searchInput.focus();
    }
  });
}

function addContentImageFallback() {
  var SITEROOT = document.querySelector('link[rel="icon"]')
    ? document.querySelector('link[rel="icon"]').getAttribute('href').replace('images/icon.webp', '')
    : '../../../../../';

  document.querySelectorAll(".content img, .image-placeholder img").forEach(function (img) {
    img.addEventListener("error", function () {
      if (img.dataset.fallbackApplied) return;
      img.dataset.fallbackApplied = "true";
      img.src = SITEROOT + "images/placeholder.webp";
      img.alt = img.alt || "Image unavailable";
    }, { once: true });
  });
}

 function initShareButton() {
        var btn = document.createElement("button");
        btn.setAttribute("aria-label", "Share this page");
        btn.textContent = "Share";
        btn.style.cssText =
            "position:fixed;bottom:20px;right:20px;background:#f97316;color:#fff;" +
            "border:none;padding:10px 16px;border-radius:24px;cursor:pointer;" +
            "font-size:13px;font-weight:600;z-index:998;box-shadow:0 2px 8px rgba(0,0,0,.25);";

        btn.addEventListener("click", function () {
            var title = document.querySelector('meta[property="og:title"]')?.content || document.title;
            var url = document.querySelector('link[rel="canonical"]')?.href || location.href;

            if (navigator.share) {
            navigator.share({ title: title, url: url }).catch(function () {});
            } else {
            navigator.clipboard.writeText(url);
            btn.textContent = "Copied!";
            setTimeout(function () { btn.textContent = "Share"; }, 1500);
            }
        });

        document.body.appendChild(btn);
        }
        document.addEventListener("DOMContentLoaded", initShareButton);

/* ─────────────────────────────────────────────────
   BANNER — outside DOMContentLoaded so it can be
   called again if needed (e.g. after dynamic load)
───────────────────────────────────────────────── */
function initBanner() {

  /* Guard: repos-data.js must be loaded first */
  if (typeof REPOS === 'undefined' || !Array.isArray(REPOS)) {
    console.warn('[DevspireHub] REPOS not found — load repos-data.js before script.js');
    return;
  }

  /* ── CATEGORY CONFIG ── */
  // const CATS = {
  //   security : { label: 'Security',  emoji: '🛡️', color: '#22d3a0', dim: 'rgba(34,211,160,.09)',  border: 'rgba(34,211,160,.28)'  },
  //   ai       : { label: 'AI & ML',   emoji: '🤖', color: '#a78bfa', dim: 'rgba(167,139,250,.09)', border: 'rgba(167,139,250,.28)' },
  //   dev      : { label: 'Dev Tools', emoji: '🔧', color: '#60a5fa', dim: 'rgba(96,165,250,.09)',  border: 'rgba(96,165,250,.28)'  },
  //   network  : { label: 'Network',   emoji: '🌐', color: '#22d3ee', dim: 'rgba(34,211,238,.09)',  border: 'rgba(34,211,238,.28)'  },
  //   systems  : { label: 'Systems',   emoji: '⚙️', color: '#fbbf24', dim: 'rgba(251,191,36,.09)',  border: 'rgba(251,191,36,.28)'  },
  //   web      : { label: 'Web',       emoji: '🕸️', color: '#f87171', dim: 'rgba(248,113,113,.09)', border: 'rgba(248,113,113,.28)' },
  //   mobile   : { label: 'Mobile',    emoji: '📱', color: '#34d399', dim: 'rgba(52,211,153,.09)',  border: 'rgba(52,211,153,.28)'  },
  //   tools    : { label: 'Tools',     emoji: '🛠️', color: '#fb923c', dim: 'rgba(251,146,60,.09)',  border: 'rgba(251,146,60,.28)'  },
  // };

  /* ── LANGUAGE DOT COLORS ── */
  const LANGCOLORS = {
    Python          : '#3572A5',
    JavaScript      : '#f1e05a',
    TypeScript      : '#3178c6',
    Go              : '#00ADD8',
    Rust            : '#dea584',
    'C++'           : '#f34b7d',
    C               : '#555555',
    'C#'            : '#178600',
    Shell           : '#89e051',
    Java            : '#b07219',
    Kotlin          : '#A97BFF',
    HTML            : '#e34c26',
    CSS             : '#563d7c',
    Ruby            : '#701516',
    Swift           : '#F05138',
    PHP             : '#4F5D95',
    Dart            : '#00B4AB',
    'Jupyter Notebook': '#DA5B0B',
    PowerShell      : '#012456',
    Dockerfile      : '#384d54',
    Zig             : '#ec915c',
    Vue             : '#41b883',
    Elixir          : '#6e4a7e',
    Nushell         : '#4E9906',
    'Objective-C'   : '#438eff',
    HLSL            : '#aace60',
    PLpgSQL         : '#336791',
    Markdown        : '#083fa1',
    TeX             : '#3D6117',
    default         : '#8892a4',
  };

  /* ══════════════════════════════════════════════
     STEP A — Compute counts from REPOS
  ══════════════════════════════════════════════ */
  const catCounts = {};
  REPOS.forEach(r => {
    if (!r.cat) return;
    catCounts[r.cat] = (catCounts[r.cat] || 0) + 1;
  });

  const totalRepos  = REPOS.length;
  const newRepos    = REPOS.filter(r => r.isNew === true).length;
  const activeCats  = Object.keys(catCounts).filter(k => CATS[k]);
  const totalCats   = activeCats.length;

  /* ══════════════════════════════════════════════
     STEP B — Update stat pill numbers
  ══════════════════════════════════════════════ */
  const elTotal = document.getElementById('js-total-count');
  const elNew   = document.getElementById('js-new-count');
  const elCats  = document.getElementById('js-cats-count');

  if (elTotal) elTotal.textContent = totalRepos;
  if (elNew)   elNew.textContent   = newRepos;
  if (elCats)  elCats.textContent  = totalCats;

  /* ══════════════════════════════════════════════
     STEP C — Build ticker pills with per-cat count
               Doubled for seamless infinite scroll
  ══════════════════════════════════════════════ */
  const tickerEl = document.getElementById('ticker');
  if (tickerEl) {
    const pills = activeCats.map(k => {
      const v   = CATS[k];
      const cnt = catCounts[k];
      return `<span class="ticker-pill"
                style="color:${v.color};background:${v.dim};border-color:${v.border}"
              >${v.emoji} ${v.label} <strong>${cnt}</strong></span>`;
    }).join('');

    tickerEl.innerHTML = pills + pills; /* double for seamless loop */
  }

  /* ══════════════════════════════════════════════
     STEP D — Build mini repo cards
               isNew first, then newest by date
  ══════════════════════════════════════════════ */
  const cardListEl = document.getElementById('card-list');
  if (cardListEl) {

    const parseDate = s => {
      if (!s) return 0;
      const d = new Date(s);
      return isNaN(d) ? 0 : d.getTime();
    };

    const sorted = [...REPOS].sort((a, b) => {
      if (a.isNew && !b.isNew) return -1;
      if (!a.isNew && b.isNew) return  1;
      return parseDate(b.updated) - parseDate(a.updated);
    });

    cardListEl.innerHTML = sorted.slice(0, 6).map(r => {
      const cat    = CATS[r.cat]    || CATS.ai;
      const lc     = LANGCOLORS[r.language] || LANGCOLORS.default;
      const topics = (r.topics || []).slice(0, 2);

      return `
        <a href="${r.url}" target="_blank" rel="noopener noreferrer"
           class="mini-card" data-cat="${r.cat || 'ai'}" role="listitem"
           aria-label="${r.owner}/${r.name} on GitHub">
          <div class="mini-card-icon">${cat.emoji}</div>
          <div class="mini-card-body">
            <div class="mini-card-meta">
              <span class="mini-card-owner">${r.owner}</span>
              <span class="mini-card-sep">/</span>
              <span class="mini-card-name">${r.name}</span>
            </div>
            ${r.desc ? `<p class="mini-card-desc">${r.desc}</p>` : ''}
            <div class="mini-card-foot">
              <span class="mini-card-cat"
                style="color:${cat.color};background:${cat.dim};border-color:${cat.border}">
                ${cat.label}
              </span>
              ${r.language ? `
              <span class="mini-card-lang">
                <span class="lang-dot" style="background:${lc}"></span>
                ${r.language}
              </span>` : ''}
              ${r.isNew ? `<span class="mini-card-new">New</span>` : ''}
              ${topics.map(t => `<span class="mini-card-topic">${t}</span>`).join('')}
            </div>
          </div>
        </a>`;
    }).join('');
  }
}
