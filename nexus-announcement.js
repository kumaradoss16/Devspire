(function () {
    'use strict';

    // Set destinationUrl to the official Devspire Nexus URL to enable the CTA.
    var NEXUS_ANNOUNCEMENT = {
        launchDate: '2026-11-08',
        launchTime: '11:00:00',
        timezone: 'Asia/Kolkata',
        destinationUrl: ''
    };

    var root = document.querySelector('.nexus-announcement');
    if (!root) {
        return;
    }

    var countdownEl = document.getElementById('nexus-countdown');
    var fallbackEl = document.getElementById('nexus-fallback');
    var liveEl = document.getElementById('nexus-live');
    var dateEl = document.getElementById('nexus-launch-date');
    var cta = document.getElementById('nexus-cta');
    var ctaNote = document.getElementById('nexus-cta-note');
    var unitEls = {
        days: root.querySelector('[data-nexus-unit="days"]'),
        hours: root.querySelector('[data-nexus-unit="hours"]'),
        minutes: root.querySelector('[data-nexus-unit="minutes"]'),
        seconds: root.querySelector('[data-nexus-unit="seconds"]')
    };

    var timerId = null;

    function createZoneFormatter(timeZone) {
        return new Intl.DateTimeFormat('en-US', {
            timeZone: timeZone,
            hourCycle: 'h23',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    }

    function getZoneParts(formatter, date) {
        var parts = {};
        formatter.formatToParts(date).forEach(function (part) {
            if (part.type !== 'literal') {
                parts[part.type] = Number(part.value);
            }
        });
        return parts;
    }

    function getZoneOffsetMs(formatter, date) {
        var parts = getZoneParts(formatter, date);
        var asUtc = Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute, parts.second);
        return asUtc - Math.floor(date.getTime() / 1000) * 1000;
    }

    // Converts a wall-clock date/time in the configured zone to a UTC timestamp.
    function resolveLaunchTimestamp(config) {
        var dateMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(config.launchDate || '');
        var timeMatch = /^(\d{2}):(\d{2})(?::(\d{2}))?$/.exec(config.launchTime || '');
        if (!dateMatch || !timeMatch) {
            return null;
        }

        var year = Number(dateMatch[1]);
        var month = Number(dateMatch[2]);
        var day = Number(dateMatch[3]);
        var hour = Number(timeMatch[1]);
        var minute = Number(timeMatch[2]);
        var second = Number(timeMatch[3] || 0);

        if (hour > 23 || minute > 59 || second > 59 || month < 1 || month > 12 || day < 1 || day > 31) {
            return null;
        }

        var calendarCheck = new Date(Date.UTC(year, month - 1, day));
        if (calendarCheck.getUTCFullYear() !== year ||
            calendarCheck.getUTCMonth() !== month - 1 ||
            calendarCheck.getUTCDate() !== day) {
            return null;
        }

        var formatter;
        try {
            formatter = createZoneFormatter(config.timezone);
        } catch (error) {
            return null;
        }

        var wallClockUtc = Date.UTC(year, month - 1, day, hour, minute, second);
        var timestamp = wallClockUtc - getZoneOffsetMs(formatter, new Date(wallClockUtc));
        timestamp = wallClockUtc - getZoneOffsetMs(formatter, new Date(timestamp));

        var check = getZoneParts(formatter, new Date(timestamp));
        if (check.year !== year || check.month !== month || check.day !== day ||
            check.hour !== hour || check.minute !== minute || check.second !== second) {
            return null;
        }

        return timestamp;
    }

    function formatLaunchDate(timestamp, timeZone) {
        try {
            return new Intl.DateTimeFormat('en-GB', {
                timeZone: timeZone,
                day: '2-digit',
                month: 'short',
                year: 'numeric'
            }).format(new Date(timestamp)).toUpperCase();
        } catch (error) {
            return '';
        }
    }

    function resolveDestination(rawUrl) {
        if (!rawUrl) {
            return null;
        }
        try {
            var url = new URL(rawUrl, window.location.href);
            if (url.protocol !== 'https:' && url.protocol !== 'http:') {
                return null;
            }
            return url.href;
        } catch (error) {
            return null;
        }
    }

    function stopTimer() {
        if (timerId !== null) {
            clearInterval(timerId);
            timerId = null;
        }
    }

    function setUnit(name, value) {
        var el = unitEls[name];
        if (el) {
            el.textContent = String(value).padStart(2, '0');
        }
    }

    function showLive() {
        stopTimer();
        if (countdownEl) {
            countdownEl.hidden = true;
        }
        if (fallbackEl) {
            fallbackEl.hidden = true;
        }
        if (liveEl) {
            liveEl.hidden = false;
        }
    }

    function showFallback() {
        stopTimer();
        if (countdownEl) {
            countdownEl.hidden = true;
        }
        if (liveEl) {
            liveEl.hidden = true;
        }
        if (dateEl) {
            dateEl.hidden = true;
        }
        if (fallbackEl) {
            fallbackEl.hidden = false;
        }
    }

    function renderCountdown(timestamp) {
        var remaining = timestamp - Date.now();
        if (remaining <= 0) {
            showLive();
            return;
        }

        var totalSeconds = Math.floor(remaining / 1000);
        setUnit('days', Math.floor(totalSeconds / 86400));
        setUnit('hours', Math.floor((totalSeconds % 86400) / 3600));
        setUnit('minutes', Math.floor((totalSeconds % 3600) / 60));
        setUnit('seconds', totalSeconds % 60);
    }

    var destination = resolveDestination(NEXUS_ANNOUNCEMENT.destinationUrl);
    if (destination) {
        cta.href = destination;
        cta.target = '_blank';
        cta.rel = 'noopener noreferrer';
        cta.removeAttribute('role');
        cta.removeAttribute('aria-disabled');
        cta.removeAttribute('aria-describedby');
        cta.removeAttribute('tabindex');
        cta.removeAttribute('title');
        if (ctaNote) {
            ctaNote.hidden = true;
        }
    } else {
        cta.addEventListener('click', function (event) {
            event.preventDefault();
        });
    }

    var launchTimestamp = resolveLaunchTimestamp(NEXUS_ANNOUNCEMENT);
    if (launchTimestamp === null) {
        showFallback();
        return;
    }

    if (dateEl) {
        var formattedDate = formatLaunchDate(launchTimestamp, NEXUS_ANNOUNCEMENT.timezone);
        if (formattedDate) {
            dateEl.textContent = formattedDate;
            dateEl.hidden = false;
        }
    }

    if (fallbackEl) {
        fallbackEl.hidden = true;
    }
    if (countdownEl) {
        countdownEl.hidden = false;
    }

    renderCountdown(launchTimestamp);
    if (launchTimestamp > Date.now()) {
        timerId = setInterval(function () {
            renderCountdown(launchTimestamp);
        }, 1000);
    }
})();
