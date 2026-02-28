document.addEventListener("DOMContentLoaded", () => {
    const protocolCards = document.querySelectorAll(".protocol-card");

    protocolCards.forEach(clickedCard => {
        clickedCard.addEventListener("click", () => {
            // Check if the card that was clicked is already expanded
            const wasAlreadyExpanded = clickedCard.classList.contains("expanded");

            // First, remove the 'expanded' class from all cards
            protocolCards.forEach(card => {
                card.classList.remove("expanded");
            });

            // If the clicked card was not already expanded, add the 'expanded' class to it
            if (!wasAlreadyExpanded) {
                clickedCard.classList.add("expanded");
            }
        });
    });

    window.addEventListener("scroll", () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;

        const circle = document.querySelector(".progress-circle .progress");
        circle.style.strokeDasharray = `${scrollPercent}, 100`;

        const scrollBtn = document.getElementById("scrollUpBtn");
        scrollBtn.style.display = scrollTop > 100 ? "block" : "none";

        document.getElementById("scrollUpBtn").addEventListener("click", () => {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });
    })
});

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
