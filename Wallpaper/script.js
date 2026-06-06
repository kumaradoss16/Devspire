document.addEventListener("DOMContentLoaded", () => {

    // ========================================
    // Typewriter Effect
    // ========================================
    (function () {
        const el = document.getElementById("brand");
        if (!el) return;

        const text = el.dataset.text || "DevSpire";
        let i = 0;
        let isDeleting = false;
        const typeSpeed = 100, deleteSpeed = 50, pauseTime = 2000, restartPause = 500;

        function typeLoop() {
            el.textContent = text.slice(0, i);
            if (!isDeleting && i < text.length)        { i++;  setTimeout(typeLoop, typeSpeed); }
            else if (!isDeleting && i === text.length) {       isDeleting = true; setTimeout(typeLoop, pauseTime); }
            else if (isDeleting && i > 0)              { i--;  setTimeout(typeLoop, deleteSpeed); }
            else                                       { isDeleting = false; setTimeout(typeLoop, restartPause); }
        }
        typeLoop();
    })();

    // ========================================
    // Navbar
    // ========================================
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks   = document.querySelector('.nav-links');

    if (menuToggle && navLinks) {
        const setMenuState = (isOpen) => {
            const icon = menuToggle.querySelector('i');
            navLinks.classList.toggle('active', isOpen);
            icon.classList.toggle('fa-bars',  !isOpen);
            icon.classList.toggle('fa-times',  isOpen);
        };
        menuToggle.addEventListener('click', () => setMenuState(!navLinks.classList.contains('active')));
        document.addEventListener('click', (e) => {
            if (!navLinks.contains(e.target) && !menuToggle.contains(e.target) && navLinks.classList.contains('active'))
                setMenuState(false);
        });
    }

    // ========================================
    // Scroll-to-top with progress ring
    // ========================================
    const scrollBtn = document.getElementById("scrollUpBtn");
    if (scrollBtn) {
        const circle = scrollBtn.querySelector(".progress-circle .progress");
        const circumference = 2 * Math.PI * 15.9155;
        if (circle) { circle.style.strokeDasharray = `${circumference}`; circle.style.strokeDashoffset = `${circumference}`; }

        window.addEventListener("scroll", () => {
            const scrollTop  = window.scrollY;
            const docHeight  = document.documentElement.scrollHeight - window.innerHeight;
            const pct        = docHeight > 0 ? scrollTop / docHeight : 0;
            if (circle) circle.style.strokeDashoffset = circumference * (1 - pct);
            scrollBtn.style.display = scrollTop > 100 ? "block" : "none";
        });

        scrollBtn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
    }

    // ========================================
    // Gallery Configuration
    // ========================================
    const PC_CONFIG = {
        total:       628,   // fallback; overwritten dynamically below
        initialLoad: 30,
        loadMore:    15,
        imagePath:   (n) => `images_upscale/wallpaper (${n}).png`,
        altPrefix:   "Desktop Wallpaper",
    };

    const MOBILE_CONFIG = {
        total:       441,   // fallback; overwritten dynamically below
        initialLoad: 30,
        loadMore:    15,
        imagePath:   (n) => `images_mobile/wallpaper (${n}).png`,
        altPrefix:   "Mobile Wallpaper",
    };

    // ========================================
    // Dynamic image count via binary search
    // ========================================
    async function probeImageExists(url) {
        try {
            const res = await fetch(url, { method: 'HEAD' });
            return res.ok;
        } catch {
            return false;
        }
    }

    async function detectImageCount(cfg) {
        if (!(await probeImageExists(cfg.imagePath(1)))) {
            return cfg.total;
        }

        let lo = 1;
        // BUG 1 FIX: hi must start ABOVE the known fallback total so the
        // "expand hi" loop below can actually confirm the boundary.
        // Using cfg.total directly as hi caused the loop to skip expansion
        // when the real count equalled the fallback, returning lo=1.
        let hi = cfg.total + 1;

        // Expand hi until it overshoots the real last image
        while (await probeImageExists(cfg.imagePath(hi))) {
            hi *= 2;
            if (hi > 50000) { hi = 50000; break; }
        }

        // Binary search for the exact boundary
        while (lo < hi - 1) {
            const mid = Math.floor((lo + hi) / 2);
            if (await probeImageExists(cfg.imagePath(mid))) {
                lo = mid;
            } else {
                hi = mid;
            }
        }
        return lo;
    }

    // ========================================
    // Intersection Observer (lazy loading)
    // ========================================
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const img = entry.target;
            const src = img.getAttribute('data-src');
            if (src) {
                img.src = src;
                img.removeAttribute('data-src');
                img.classList.remove('lazy-image');
            }
            observer.unobserve(img);
        });
    }, { rootMargin: '100px', threshold: 0.01 });

    // ========================================
    // Card Factory
    // ========================================
    function createWallpaperCard(index, cfg) {
        const card = document.createElement('div');
        card.className = 'wallpaper-card';
        card.innerHTML = `
            <div class="image-wrapper">
                <img
                    data-src="${cfg.imagePath(index)}"
                    src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 9'%3E%3Crect fill='%23212536' width='16' height='9'/%3E%3C/svg%3E"
                    alt="${cfg.altPrefix} ${index}"
                    loading="lazy"
                    class="lazy-image">
                <button class="download-btn-overlay" title="Download Wallpaper" aria-label="Download wallpaper ${index}">
                    <i class="fas fa-download" aria-hidden="true"></i>
                </button>
            </div>`;

        card.querySelector('.download-btn-overlay').addEventListener('click', (e) => {
            e.stopPropagation();
            downloadWallpaper(index, cfg);
        });

        const img = card.querySelector('.lazy-image');
        if (img) imageObserver.observe(img);

        return card;
    }

    // ========================================
    // Gallery State + Render
    // ========================================
    function buildGallery({ gridSelector, btnSelector, countBadgeId, cfg }) {
        const container = document.querySelector(gridSelector);
        const btn       = document.getElementById(btnSelector);
        const badge     = document.getElementById(countBadgeId);
        if (!container) return;

        let loaded = 0;

        if (badge) badge.textContent = cfg.total;

        function loadBatch(start, end) {
            const frag = document.createDocumentFragment();
            for (let i = start; i <= Math.min(end, cfg.total); i++) {
                frag.appendChild(createWallpaperCard(i, cfg));
            }
            container.appendChild(frag);
            loaded = Math.min(end, cfg.total);
            updateBtn();
        }

        function updateBtn() {
            if (!btn) return;
            const remaining = cfg.total - loaded;
            if (remaining <= 0) {
                btn.style.display = 'none';
            } else {
                btn.textContent = `Load More (${remaining} remaining)`;
                btn.style.display = 'block';
            }
        }

        loadBatch(1, cfg.initialLoad);

        if (btn) {
            btn.addEventListener('click', () => {
                if (loaded >= cfg.total) return;
                btn.classList.add('loading');
                btn.disabled = true;

                // BUG 2 FIX: capture loaded BEFORE the batch runs so the
                // scroll target index is calculated correctly.
                // Previously `loaded` was already updated by loadBatch()
                // before the scroll timeout read it, pointing to the wrong card.
                const prevLoaded = loaded;

                setTimeout(() => {
                    const next = Math.min(loaded + cfg.loadMore, cfg.total);
                    loadBatch(loaded + 1, next);
                    btn.classList.remove('loading');
                    btn.disabled = false;

                    setTimeout(() => {
                        const cards  = container.querySelectorAll('.wallpaper-card');
                        const target = cards[prevLoaded]; // first newly added card
                        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                    }, 150);
                }, 400);
            });
        }
    }

    // ========================================
    // Init: resolve dynamic counts, then build both galleries
    // ========================================
    (async () => {
        const [pcCount, mobileCount] = await Promise.all([
            detectImageCount(PC_CONFIG),
            detectImageCount(MOBILE_CONFIG),
        ]);

        PC_CONFIG.total     = pcCount;
        MOBILE_CONFIG.total = mobileCount;

        buildGallery({
            gridSelector:  '.pc-grid',
            btnSelector:   'view-all-btn-pc',
            countBadgeId:  'tab-count-pc',
            cfg:           PC_CONFIG,
        });

        buildGallery({
            gridSelector:  '.mobile-grid',
            btnSelector:   'view-all-btn-mobile',
            countBadgeId:  'tab-count-mobile',
            cfg:           MOBILE_CONFIG,
        });
    })();

    // ========================================
    // Tab Switcher
    // ========================================
    const tabs   = document.querySelectorAll('.gallery-tab');
    const panels = document.querySelectorAll('.gallery-panel');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const target = tab.dataset.tab;

            tabs.forEach(t => {
                t.classList.toggle('active', t === tab);
                t.setAttribute('aria-selected', t === tab ? 'true' : 'false');
            });

            panels.forEach(panel => {
                panel.hidden = panel.id !== `panel-${target}`;
            });
        });
    });

});

// ========================================
// Force download via fetch + blob
// ========================================
async function downloadWallpaper(num, cfg) {
    const url = cfg.imagePath(num);

    // BUG 3 FIX: filename was taken from the raw URL path which contains
    // spaces and parentheses — e.g. "wallpaper (42).png" — some browsers
    // silently drop or mangle such filenames. Use a clean sanitised name.
    const filename = `wallpaper_${num}.png`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const blob    = await response.blob();
        const blobUrl = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href     = blobUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();

        // BUG 4 FIX: 10 seconds is sometimes not enough for large wallpaper
        // files on slow connections — the blob gets revoked before the browser
        // finishes reading it, silently aborting the download. Use 60 seconds.
        setTimeout(() => URL.revokeObjectURL(blobUrl), 60_000);

    } catch (err) {
        console.error('Download failed, falling back to new tab:', err);
        window.open(url, '_blank', 'noopener,noreferrer');
    }
}