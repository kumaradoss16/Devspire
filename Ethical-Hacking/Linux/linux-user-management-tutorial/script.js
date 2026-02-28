document.addEventListener("DOMContentLoaded", () => {
    (function () {
        const el = document.getElementById("brand");
        const text = el.dataset.text || "DevSpire";
        let i = 0;
        let isDeleting = false;

        const typeSpeed = 100;    // typing speed (ms)
        const deleteSpeed = 50;   // deleting speed (ms)
        const pauseTime = 2000;   // pause at end before deleting (ms)
        const restartPause = 500; // pause before restarting (ms)

        function typeLoop() {
            const currentText = text.slice(0, i);
            el.textContent = currentText;

            if (!isDeleting && i < text.length) {
                // Typing forward
                i++;
                setTimeout(typeLoop, typeSpeed);
            } else if (!isDeleting && i === text.length) {
                // Finished typing, pause then start deleting
                isDeleting = true;
                setTimeout(typeLoop, pauseTime);
            } else if (isDeleting && i > 0) {
                // Deleting
                i--;
                setTimeout(typeLoop, deleteSpeed);
            } else if (isDeleting && i === 0) {
                // Finished deleting, restart
                isDeleting = false;
                setTimeout(typeLoop, restartPause);
            }
        }

        typeLoop();
    })();

    // --- Code Snippet Copy Functionality ---
    const copyTerminalConfigs = [
        { btnId: 'copyCodeBtnC', snippetId: 'codeSnippetC', feedbackId: 'copyFeedbackC' }
    ];

    // Function to handle copying (reusable)
    function setupCopyFunctionality(button, snippet, feedback) {
        button.addEventListener('click', () => {
            const textToCopy = snippet.textContent;

            // Using the modern Clipboard API is preferred for security and simplicity,
            // with execCommand as a robust fallback.
            if (navigator.clipboard) {
                navigator.clipboard.writeText(textToCopy).then(() => {
                    feedback.textContent = 'Copied!';
                    feedback.classList.add('show');
                }).catch(err => {
                    console.error('Clipboard API failed: ', err);
                    feedback.textContent = 'Failed to copy.';
                    feedback.classList.add('show', 'error');
                });
            } else {
                // Fallback for older browsers or insecure contexts
                const textarea = document.createElement('textarea');
                textarea.value = textToCopy;
                textarea.style.position = 'fixed';
                textarea.style.opacity = 0;
                document.body.appendChild(textarea);
                textarea.select();
                try {
                    document.execCommand('copy');
                    feedback.textContent = 'Copied!';
                    feedback.classList.add('show');
                } catch (err) {
                    console.error('execCommand failed: ', err);
                    feedback.textContent = 'Failed to copy.';
                    feedback.classList.add('show', 'error');
                }
                document.body.removeChild(textarea);
            }

            setTimeout(() => {
                feedback.classList.remove('show', 'error');
            }, 2000);
        });
    }

    // OPTIMIZATION: Find elements and filter out any that don't exist on the page
    copyTerminalConfigs.forEach(config => {
        const button = document.getElementById(config.btnId);
        const snippet = document.getElementById(config.snippetId);
        const feedback = document.getElementById(config.feedbackId);

        // Only set up the listener if all three elements were found
        if (button && snippet && feedback) {
            setupCopyFunctionality(button, snippet, feedback);
        }
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
    });

    // --- Navbar Functionality ---
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle && navLinks) {
        // REFACTOR: Create a single function to control the menu state (open/closed)
        const setMenuState = (isOpen) => {
            const icon = menuToggle.querySelector('i');
            if (isOpen) {
                navLinks.classList.add('active');
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                navLinks.classList.remove('active');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        };

        // 1. Handle clicks on the menu toggle button
        menuToggle.addEventListener('click', () => {
            // Toggle based on the current state
            const isActive = navLinks.classList.contains('active');
            setMenuState(!isActive);
        });

        // 2. Handle clicks outside the menu to close it
        document.addEventListener('click', (event) => {
            const isClickInsideMenu = navLinks.contains(event.target);
            const isClickOnToggle = menuToggle.contains(event.target);

            // Only close if it's currently open and the click is outside
            if (!isClickInsideMenu && !isClickOnToggle && navLinks.classList.contains('active')) {
                setMenuState(false); // Explicitly close the menu
            }
        });
    } else {
        console.warn("Menu toggle or nav links not found. Mobile menu functionality will not work.");
    }

    // --- Scroll to top with progress indicator ---
    const scrollBtn = document.getElementById("scrollUpBtn");
    if (scrollBtn) {
        const circle = scrollBtn.querySelector(".progress-circle .progress");
        // The radius of the circle in the SVG is 15.9155.
        const circumference = 2 * Math.PI * 15.9155;

        if (circle) {
            // Set initial dash array and offset
            circle.style.strokeDasharray = `${circumference}`;
            circle.style.strokeDashoffset = `${circumference}`;
        }

        window.addEventListener("scroll", () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = docHeight > 0 ? scrollTop / docHeight : 0;

            // Animate progress circle
            if (circle) {
                const offset = circumference * (1 - scrollPercent);
                circle.style.strokeDashoffset = offset;
            }

            // Show/hide button
            scrollBtn.style.display = scrollTop > 100 ? "block" : "none";
        });

        scrollBtn.addEventListener("click", () => {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });
    }
});

function downloadProject(filename = "project.rar", filePath = "Download/project.rar") {
    // Create a temporary <a> element
    const link = document.createElement("a");
    link.href = filePath;
    link.download = filename;

    // Append to the document, trigger click, then remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

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