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
}

// ── Download Project ──────────────────────────────────
function downloadProject(
  filename = 'login-system-using-javascript-&-firebase.rar',
  filePath = 'download/login-system-using-javascript-&-firebase.rar'
) {
  const link    = document.createElement('a');
  link.href     = filePath;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// ══════════════════════════════════════════════════════
//  CENTRAL DEALS LOADER
// ══════════════════════════════════════════════════════

const DEALS_PER_PAGE = 6;
let dealsPage = 0;

// ── Hardcoded SITE_ROOT — most reliable approach ──────
// Page location: /Programming/Projects/Web/login-system/page.html
// Folders deep : 4  →  go up 4 levels = '../../../../'
const SITE_ROOT  = '../../../../';
const JSON_PATH  = SITE_ROOT + 'amazon-links.json';
const IMG_FOLDER = SITE_ROOT + 'images/products/';

// ── Confirm paths in console (remove after testing) ───
console.log('✅ JSON_PATH :', JSON_PATH);
console.log('✅ IMG_FOLDER:', IMG_FOLDER);

// ── Fetch products from root amazon-links.json ────────
function loadDeals() {
  const grid = document.getElementById('dealsGrid');
  if (!grid) return;

  fetch(JSON_PATH)
    .then(res => {
      if (!res.ok) throw new Error('HTTP ' + res.status + ' → ' + JSON_PATH);
      return res.json();
    })
    .then(data => renderDeals(data.products))
    .catch(err => {
      console.error('❌ Deals load failed:', err.message);
      const grid = document.getElementById('dealsGrid');
      if (grid) grid.innerHTML = `
        <p style="color:#aaa;font-size:13px;padding:10px;">
          Deals unavailable. Please try again later.
        </p>`;
    });
}

// ── Build deal cards from JSON ────────────────────────
function renderDeals(products) {
  const grid = document.getElementById('dealsGrid');
  if (!grid) return;

  grid.innerHTML = products.map((prod, i) => `
    <a href="${prod.link}"
       target="_blank"
       rel="nofollow sponsored"
       class="deal-card"
       data-id="${prod.id}"
       style="display:none"
       aria-label="Buy ${prod.name.replace(/<br>/g, '')} on Amazon">
      <span class="deal-badge">${prod.badge}</span>
      <div class="deal-img-wrap">
        <img
          src="${IMG_FOLDER}${prod.image}"
          alt="${prod.name.replace(/<br>/g, ' ')}"
          loading="lazy"
          onerror="this.src='${IMG_FOLDER}placeholder.webp'; this.onerror=null;"
        />
      </div>
      <p class="deal-label">${prod.name}</p>
    </a>
  `).join('');

  showDealsPage(0);
}

// ── Show 6 cards per page ─────────────────────────────
function showDealsPage(page) {
  const cards = document.querySelectorAll('#dealsGrid .deal-card');
  if (!cards.length) return;

  const totalPages = Math.ceil(cards.length / DEALS_PER_PAGE);
  if (page < 0) page = totalPages - 1;
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
  if (prev) prev.style.opacity = dealsPage === 0 ? '0.4' : '1';
  if (next) next.style.opacity = dealsPage === totalPages - 1 ? '0.4' : '1';
}

// ── Arrow buttons ─────────────────────────────────────
function scrollDeals(dir) {
  showDealsPage(dealsPage + dir);
}

// ── Run on page load ──────────────────────────────────
document.addEventListener('DOMContentLoaded', loadDeals);
