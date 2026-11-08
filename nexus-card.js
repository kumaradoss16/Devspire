(function () {
    'use strict';

    var NEXUS_CONFIG = {
        name: 'Devspire Nexus',
        url: 'https://nexus.devspirehub.com/'
    };

    var cta = document.querySelector('[data-nexus-cta]');
    if (!cta) {
        return;
    }

    var destination;
    try {
        destination = new URL(NEXUS_CONFIG.url);
    } catch (error) {
        return;
    }

    if (destination.protocol !== 'https:' && destination.protocol !== 'http:') {
        return;
    }

    cta.href = destination.href;
    cta.target = '_blank';
    cta.rel = 'noopener noreferrer';
    cta.setAttribute('aria-label', 'Explore ' + NEXUS_CONFIG.name + ' (opens in a new tab)');
})();
