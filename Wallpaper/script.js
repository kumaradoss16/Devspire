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
        if (circle) {
            circle.style.strokeDasharray  = `${circumference}`;
            circle.style.strokeDashoffset = `${circumference}`;
        }

        window.addEventListener("scroll", () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const pct       = docHeight > 0 ? scrollTop / docHeight : 0;
            if (circle) circle.style.strokeDashoffset = circumference * (1 - pct);
            scrollBtn.style.display = scrollTop > 100 ? "block" : "none";
        });

        scrollBtn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
    }

    // ========================================
    // Gallery Configuration
    // ========================================
    const PC_CONFIG = {
        total:       628,   
        initialLoad: 30,   
        loadMore:    18,
        imagePath:   (n) => `images_upscale/wallpaper (${n}).png`,
        altPrefix:   "Desktop Wallpaper",
        cacheKey:    "wallspire_pc_count",
    };

    const MOBILE_CONFIG = {
        total:       441,   
        initialLoad: 30,    
        loadMore:    18,
        imagePath:   (n) => `images_mobile/wallpaper (${n}).png`,
        altPrefix:   "Mobile Wallpaper",
        cacheKey:    "wallspire_mobile_count",
    };

    const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

    function readCachedCount(cacheKey) {
        try {
            const raw = localStorage.getItem(cacheKey);
            if (!raw) return null;
            const { count, ts } = JSON.parse(raw);
            if (Date.now() - ts < CACHE_TTL_MS) return count;
        } catch {
            // Corrupted cache entry — ignore and re-probe
        }
        return null;
    }

    function writeCachedCount(cacheKey, count) {
        try {
            localStorage.setItem(cacheKey, JSON.stringify({ count, ts: Date.now() }));
        } catch {
            // localStorage full or unavailable — silently skip caching
        }
    }

    async function probeImageExists(url) {
        try {
            const res = await fetch(url, { method: 'HEAD' });
            return res.ok;
        } catch {
            return false;
        }
    }

    async function resolveImageCount(cfg) {
        // 1. Try cache first
        const cached = readCachedCount(cfg.cacheKey);
        if (cached !== null) return cached;

        // 2. Cache miss — probe ONE image beyond current hardcoded total
        const probeUrl   = cfg.imagePath(cfg.total + 1);
        const hasMore    = await probeImageExists(probeUrl);
        const finalCount = hasMore ? cfg.total + 1 : cfg.total;

        writeCachedCount(cfg.cacheKey, finalCount);
        return finalCount;
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
    }, { rootMargin: '200px', threshold: 0.01 });

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
                    decoding="async"
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
    // Init — resolve counts (cache-first), then build both galleries
    // ========================================
    (async () => {
        const [pcCount, mobileCount] = await Promise.all([
            resolveImageCount(PC_CONFIG),
            resolveImageCount(MOBILE_CONFIG),
        ]);

        PC_CONFIG.total     = pcCount;
        MOBILE_CONFIG.total = mobileCount;

        buildGallery({
            gridSelector: '.pc-grid',
            btnSelector:  'view-all-btn-pc',
            countBadgeId: 'tab-count-pc',
            cfg:          PC_CONFIG,
        });

        buildGallery({
            gridSelector: '.mobile-grid',
            btnSelector:  'view-all-btn-mobile',
            countBadgeId: 'tab-count-mobile',
            cfg:          MOBILE_CONFIG,
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

        setTimeout(() => URL.revokeObjectURL(blobUrl), 60_000);

    } catch (err) {
        console.error('Download failed, falling back to new tab:', err);
        window.open(url, '_blank', 'noopener,noreferrer');
    }
}
