(function () {
    'use strict';

    var NEXUS_CONFIG = {
        name: 'Devspire Nexus',
        url: 'https://nexus.devspirehub.com/'
    };

    function initNexusCta() {
        var cta = document.querySelector('[data-nexus-cta]');
        if (!cta) return;
        try {
            var destination = new URL(NEXUS_CONFIG.url);
            if (destination.protocol === 'https:' || destination.protocol === 'http:') {
                cta.href = destination.href;
                cta.target = '_blank';
                cta.rel = 'noopener noreferrer';
                cta.setAttribute('aria-label', 'Explore ' + NEXUS_CONFIG.name + ' (opens in a new tab)');
            }
        } catch (e) {}
    }

    function initCardAnimations() {
        var cards = document.querySelectorAll('.ds-card--nexus:not(.ds-card--revealed), .ds-card--coffee:not(.ds-card--revealed), .ds-card--featured:not(.ds-card--revealed)');
        if (!cards.length) return;

        if (!('IntersectionObserver' in window)) {
            cards.forEach(function (c) { c.classList.add('ds-card--revealed'); });
            return;
        }

        var observer = new IntersectionObserver(function (entries, obs) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('ds-card--revealed');
                    obs.unobserve(entry.target);
                }
            });
        }, { rootMargin: '0px 0px -40px 0px', threshold: 0.12 });

        cards.forEach(function (c) { observer.observe(c); });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () {
            initNexusCta();
            initCardAnimations();
        });
    } else {
        initNexusCta();
        initCardAnimations();
    }
})();
