/* ============================================================
   DevspireHub — Diwali firecracker bursts
   Decorative canvas confined to the homepage hero.

   Configure before this file loads, e.g.:
     <script>
       window.DIWALI_FIREWORKS_CONFIG = {
         enabled: true,
         maxBursts: 2,
         burstInterval: [2200, 4000]
       };
     </script>

   Or at runtime: window.DIWALI_FIREWORKS.disable() / .enable()
   Set `enabled: false` (or remove the script tag) for a fully
   static page. Respects prefers-reduced-motion automatically.
   ============================================================ */
(function () {
  'use strict';

  if (window.DIWALI_FIREWORKS) return;

  var canvas = document.querySelector('.diwali-fireworks-canvas');
  if (!canvas || typeof canvas.getContext !== 'function') return;

  var ctx = canvas.getContext('2d');
  if (!ctx) return;

  var BASE_CONFIG = {
    enabled: true,

    // Scheduling
    firstBurstDelay: 800,        // ms before the first burst
    burstInterval: [1600, 3200], // ms between bursts
    maxBursts: 3,                // bursts allowed to be alive together
    largeBurstEvery: 4,          // every Nth burst is a multi-layer burst
    initialDelayJitter: 500,

    // Particles
    particlesPerBurst: [36, 54],
    particleSpeed: [75, 250],    // px per second
    particleLifetime: [800, 1400], // ms
    particleSize: [1.4, 2.8],    // px
    gravity: 26,                 // px per second squared
    friction: 0.985,             // per-frame velocity retention at 60fps
    maxParticles: 240,
    maxFlashes: 3,
    intensity: 1,                // 0–1 overall brightness

    // Position (fractions of the hero canvas, side-biased so the
    // central heading and description stay clear)
    sideBand: [0.05, 0.28],      // left/right horizontal bands
    topBandY: [0.10, 0.26],      // vertical band for top-centre bursts
    bodyBandY: [0.16, 0.58],

    // Visuals
    colors: [
      '#F5C542', // gold
      '#FF9933', // saffron
      '#E86A17', // orange
      '#FFC857', // amber
      '#FF4D4D', // red
      '#19BAAF', // teal
      '#A78BFA', // purple
      '#FFFFFF'  // white
    ],

    tablet: {
      maxBursts: 2,
      burstInterval: [2000, 3600],
      particlesPerBurst: [28, 44],
      particleSpeed: [65, 205],
      maxParticles: 160,
      intensity: 0.9
    },

    mobile: {
      maxBursts: 1,
      burstInterval: [2400, 4200],
      particlesPerBurst: [20, 32],
      particleSpeed: [40, 120],
      particleLifetime: [600, 1000],
      maxParticles: 90,
      largeBurstEvery: 6,
      intensity: 0.7,
      // Mobile hero is text-dense, so keep bursts in the top strip
      // around the badge and above the heading.
      bodyBandY: [0.05, 0.16],
      topBandY: [0.03, 0.10]
    }
  };

  var overrides = window.DIWALI_FIREWORKS_CONFIG || {};
  var reducedQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  var forcedColorsQuery = window.matchMedia('(forced-colors: active)');

  var state = {
    enabled: overrides.enabled !== false,
    paused: false,
    reducedMotion: reducedQuery.matches,
    forcedColors: forcedColorsQuery.matches,
    hidden: document.hidden,
    offscreen: false,
    destroyed: false,
    running: false,
    rafId: 0,
    particles: [],
    flashes: [],
    bursts: [],
    burstCount: 0,
    config: null,
    nextBurstAt: 0,
    lastTime: 0,
    resizeId: 0,
    dpr: 1,
    width: 0,
    height: 0
  };

  /* ---------- helpers ---------- */

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function rand(range) {
    if (!range || !isFinite(range[0]) || !isFinite(range[1])) return 0;
    return range[0] + Math.random() * (range[1] - range[0]);
  }

  function randInt(range) {
    return Math.round(rand(range));
  }

  function copyInto(target, source) {
    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
    return target;
  }

  function activeTier() {
    if (window.innerWidth < 768) return BASE_CONFIG.mobile;
    if (window.innerWidth < 1200) return BASE_CONFIG.tablet;
    return null;
  }

  function getConfig() {
    var config = copyInto({}, BASE_CONFIG);
    var tier = activeTier();
    if (tier) copyInto(config, tier);
    copyInto(config, overrides);
    return config;
  }

  function parseColor(hex) {
    var value = String(hex || '').replace('#', '');
    if (value.length === 3) {
      value = value[0] + value[0] + value[1] + value[1] + value[2] + value[2];
    }
    var number = parseInt(value, 16);
    if (!isFinite(number)) return { r: 255, g: 200, b: 120 };
    return {
      r: (number >> 16) & 255,
      g: (number >> 8) & 255,
      b: number & 255
    };
  }

  var colorCache = {};

  function rgb(hex) {
    if (!colorCache[hex]) colorCache[hex] = parseColor(hex);
    return colorCache[hex];
  }

  function colorString(hex, alpha) {
    var c = rgb(hex);
    return 'rgba(' + c.r + ',' + c.g + ',' + c.b + ',' + alpha + ')';
  }

  function palette() {
    var config = getConfig();
    var colors = (config.colors || []).filter(function (c) {
      return typeof c === 'string' && c.charAt(0) === '#';
    });
    return colors.length ? colors : BASE_CONFIG.colors;
  }

  /* ---------- canvas sizing ---------- */

  function resize() {
    var rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    var limit = window.innerWidth < 768 ? 1.5 : 2;
    var dpr = clamp(window.devicePixelRatio || 1, 1, limit);
    var width = Math.round(rect.width * dpr);
    var height = Math.round(rect.height * dpr);

    if (width === canvas.width && height === canvas.height && dpr === state.dpr) {
      state.width = rect.width;
      state.height = rect.height;
      return;
    }

    canvas.width = width;
    canvas.height = height;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    state.dpr = dpr;
    state.width = rect.width;
    state.height = rect.height;

    // Old coordinates are invalid after a resize; restart cleanly.
    if (state.particles.length || state.flashes.length || state.running) {
      clearScene();
      state.nextBurstAt = performance.now() + getConfig().firstBurstDelay;
    }
  }

  function scheduleResize() {
    if (state.resizeId) return;
    state.resizeId = window.requestAnimationFrame(function () {
      state.resizeId = 0;
      resize();
    });
  }

  /* ---------- particles ---------- */

  function pruneBursts(now) {
    state.bursts = state.bursts.filter(function (expiry) {
      return expiry > now;
    });
  }

  function emitParticles(x, y, now) {
    var config = getConfig();
    var colors = palette();
    var scale = clamp(Math.min(state.width, state.height) / 620, 0.65, 1.3);
    var interval = Math.max(1, config.largeBurstEvery);
    var wasLarge = (state.burstCount + 1) % interval === 0;

    pruneBursts(now);
    if (state.bursts.length >= Math.max(1, config.maxBursts)) return false;

    var available = Math.max(0, config.maxParticles - state.particles.length);
    var total = Math.min(randInt(config.particlesPerBurst), available);
    if (total <= 0) return false;

    state.burstCount += 1;
    state.bursts.push(now + config.particleLifetime[1] + 250);

    if (wasLarge) {
      var flashColor = colors[Math.floor(Math.random() * colors.length)];
      state.flashes.push({
        x: x,
        y: y,
        radius: 4 * scale,
        maxRadius: 54 * scale,
        life: 0.34,
        maxLife: 0.34,
        color: flashColor
      });
      if (state.flashes.length > config.maxFlashes) {
        state.flashes.splice(0, state.flashes.length - config.maxFlashes);
      }
    }

    var layers = wasLarge ? 3 : 1;
    var perLayer = Math.max(1, Math.round(total / layers));
    var speedMultipliers = [1, 0.62, 0.4];

    for (var layer = 0; layer < layers; layer += 1) {
      var emitted = layer === layers - 1 ? total - perLayer * (layers - 1) : perLayer;
      for (var i = 0; i < emitted; i += 1) {
        if (state.particles.length >= config.maxParticles) break;

        var angle = Math.random() * Math.PI * 2;
        var speed = rand(config.particleSpeed) * scale * speedMultipliers[layer];
        var lifetime = rand(config.particleLifetime) / 1000;
        var color = colors[Math.floor(Math.random() * colors.length)];

        state.particles.push({
          x: x,
          y: y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: lifetime,
          maxLife: lifetime,
          size: rand(config.particleSize) * scale * (layer === 0 ? 1 : 0.8),
          gravity: config.gravity * scale,
          color: color
        });
      }
    }

    return true;
  }

  function spawnBurst(options) {
    if (!state.enabled || state.reducedMotion || state.forcedColors || state.destroyed) return false;
    if (!state.width || !state.height) resize();
    if (!state.width || !state.height) return false;

    var opts = options || {};
    var config = getConfig();
    var x;
    var y;

    if (isFinite(opts.x) && isFinite(opts.y)) {
      x = clamp(opts.x, 0.02, 0.98) * state.width;
      y = clamp(opts.y, 0.05, 0.95) * state.height;
    } else {
      var zone = Math.random();
      if (zone < 0.38) {
        // left band
        x = rand(config.sideBand) * state.width;
        y = rand(config.bodyBandY) * state.height;
      } else if (zone < 0.76) {
        // right band
        x = (1 - rand(config.sideBand)) * state.width;
        y = rand(config.bodyBandY) * state.height;
      } else {
        // upper centre, above the heading
        x = rand([0.34, 0.66]) * state.width;
        y = rand(config.topBandY) * state.height;
      }
    }

    return emitParticles(x, y, performance.now());
  }

  /* ---------- drawing ---------- */

  function draw(now) {
    ctx.clearRect(0, 0, state.width, state.height);
    ctx.globalCompositeOperation = 'lighter';

    var intensity = clamp((state.config || getConfig()).intensity, 0.1, 1);

    for (var f = state.flashes.length - 1; f >= 0; f -= 1) {
      var flash = state.flashes[f];
      var flashT = Math.max(flash.life / flash.maxLife, 0);
      if (flashT <= 0) {
        state.flashes.splice(f, 1);
        continue;
      }
      var glowRadius = flash.radius + (flash.maxRadius - flash.radius) * (1 - flashT);
      ctx.beginPath();
      ctx.fillStyle = colorString(flash.color, flashT * 0.16 * intensity);
      ctx.arc(flash.x, flash.y, glowRadius, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.fillStyle = colorString('#FFFFFF', flashT * 0.5 * intensity);
      ctx.arc(flash.x, flash.y, glowRadius * 0.35, 0, Math.PI * 2);
      ctx.fill();
    }

    for (var i = state.particles.length - 1; i >= 0; i -= 1) {
      var p = state.particles[i];
      if (p.life <= 0) {
        state.particles.splice(i, 1);
        continue;
      }

      var t = p.life / p.maxLife;
      var alpha = Math.pow(t, 1.35) * intensity;
      var tailX = p.x - p.vx * 0.05;
      var tailY = p.y - p.vy * 0.05;

      // Spark trail: a short velocity-aligned streak behind each ember.
      ctx.beginPath();
      ctx.strokeStyle = colorString(p.color, alpha * 0.45);
      ctx.lineWidth = Math.max(0.6, p.size * 0.9);
      ctx.lineCap = 'round';
      ctx.moveTo(tailX, tailY);
      ctx.lineTo(p.x, p.y);
      ctx.stroke();

      // Soft halo.
      ctx.beginPath();
      ctx.fillStyle = colorString(p.color, alpha * 0.15);
      ctx.arc(p.x, p.y, p.size * 2.8, 0, Math.PI * 2);
      ctx.fill();

      // Bright core with a white sparkle at the centre.
      ctx.beginPath();
      ctx.fillStyle = colorString(p.color, Math.min(1, alpha * 1.15));
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.fillStyle = 'rgba(255,255,255,' + alpha * 0.5 + ')';
      ctx.arc(p.x, p.y, Math.max(0.4, p.size * 0.4), 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.globalCompositeOperation = 'source-over';
  }

  function update(dt, now) {
    var config = getConfig();
    state.config = config;
    var drag = Math.pow(config.friction, dt * 60);

    for (var f = state.flashes.length - 1; f >= 0; f -= 1) {
      state.flashes[f].life -= dt;
      if (state.flashes[f].life <= 0) state.flashes.splice(f, 1);
    }

    for (var i = state.particles.length - 1; i >= 0; i -= 1) {
      var p = state.particles[i];
      p.vx *= drag;
      p.vy = p.vy * drag + p.gravity * dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.life -= dt;
      if (p.life <= 0) state.particles.splice(i, 1);
    }

    if (now >= state.nextBurstAt) {
      spawnBurst();
      state.nextBurstAt = now + rand(config.burstInterval);
    }
  }

  /* ---------- loop ---------- */

  function clearScene() {
    state.particles.length = 0;
    state.flashes.length = 0;
    state.bursts.length = 0;
    if (state.width && state.height) {
      ctx.clearRect(0, 0, state.width, state.height);
    }
  }

  function frame(timestamp) {
    if (!state.running) return;

    var now = typeof timestamp === 'number' ? timestamp : performance.now();
    var dt = state.lastTime ? Math.min((now - state.lastTime) / 1000, 0.05) : 0;
    state.lastTime = now;

    update(dt, now);
    draw(now);

    state.rafId = window.requestAnimationFrame(frame);
  }

  function shouldRun() {
    return state.enabled &&
      !state.paused &&
      !state.reducedMotion &&
      !state.forcedColors &&
      !state.hidden &&
      !state.offscreen &&
      !state.destroyed;
  }

  function sync() {
    if (shouldRun()) {
      if (state.running) return;
      resize();
      state.running = true;
      state.lastTime = 0;
      var now = performance.now();
      if (state.nextBurstAt <= now) {
        state.nextBurstAt = now + getConfig().firstBurstDelay + rand([0, getConfig().initialDelayJitter]);
      }
      state.rafId = window.requestAnimationFrame(frame);
      return;
    }

    if (state.rafId) {
      window.cancelAnimationFrame(state.rafId);
      state.rafId = 0;
    }
    state.running = false;
    clearScene();
  }

  /* ---------- observers & listeners ---------- */

  var hero = canvas.parentElement;

  function onVisibility() {
    state.hidden = document.hidden;
    sync();
  }

  function onMotionChange(event) {
    state.reducedMotion = event.matches;
    sync();
  }

  function onForcedColors(event) {
    state.forcedColors = event.matches;
    sync();
  }

  function addMediaListener(query, handler) {
    if (typeof query.addEventListener === 'function') {
      query.addEventListener('change', handler);
    } else if (typeof query.addListener === 'function') {
      query.addListener(handler);
    }
  }

  function removeMediaListener(query, handler) {
    if (typeof query.removeEventListener === 'function') {
      query.removeEventListener('change', handler);
    } else if (typeof query.removeListener === 'function') {
      query.removeListener(handler);
    }
  }

  var intersectionObserver = null;
  if (hero && typeof window.IntersectionObserver === 'function') {
    intersectionObserver = new IntersectionObserver(function (entries) {
      state.offscreen = !entries[0].isIntersecting;
      sync();
    }, { rootMargin: '80px' });
    intersectionObserver.observe(hero);
  }

  var resizeObserver = null;
  if (hero && typeof window.ResizeObserver === 'function') {
    resizeObserver = new ResizeObserver(scheduleResize);
    resizeObserver.observe(hero);
  }

  document.addEventListener('visibilitychange', onVisibility);
  window.addEventListener('resize', scheduleResize);
  addMediaListener(reducedQuery, onMotionChange);
  addMediaListener(forcedColorsQuery, onForcedColors);

  resize();
  sync();

  /* ---------- public API ---------- */

  window.DIWALI_FIREWORKS = {
    version: '1.0.0',

    getConfig: function () {
      return copyInto({}, getConfig());
    },

    setConfig: function (partial) {
      if (!partial || typeof partial !== 'object') return;
      copyInto(overrides, partial);
      if (partial.enabled === false) {
        state.enabled = false;
      } else if (partial.enabled === true) {
        state.enabled = true;
      }
      state.bursts.length = 0;
      state.nextBurstAt = performance.now() + getConfig().firstBurstDelay;
      sync();
    },

    enable: function () {
      overrides.enabled = true;
      state.enabled = true;
      sync();
    },

    disable: function () {
      overrides.enabled = false;
      state.enabled = false;
      sync();
    },

    pause: function () {
      state.paused = true;
      sync();
    },

    resume: function () {
      state.paused = false;
      sync();
    },

    burst: function (options) {
      return spawnBurst(options);
    },

    stats: function () {
      var config = getConfig();
      pruneBursts(performance.now());
      return {
        enabled: state.enabled,
        running: state.running,
        paused: state.paused,
        reducedMotion: state.reducedMotion,
        forcedColors: state.forcedColors,
        hidden: state.hidden,
        offscreen: state.offscreen,
        particles: state.particles.length,
        activeBursts: state.bursts.length,
        totalBursts: state.burstCount,
        maxParticles: config.maxParticles,
        maxBursts: config.maxBursts,
        tier: activeTier() === BASE_CONFIG.mobile ? 'mobile' : activeTier() === BASE_CONFIG.tablet ? 'tablet' : 'desktop',
        width: Math.round(state.width),
        height: Math.round(state.height),
        dpr: state.dpr
      };
    },

    destroy: function () {
      if (state.destroyed) return;
      state.destroyed = true;
      state.enabled = false;
      sync();
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('resize', scheduleResize);
      removeMediaListener(reducedQuery, onMotionChange);
      removeMediaListener(forcedColorsQuery, onForcedColors);
      if (intersectionObserver) intersectionObserver.disconnect();
      if (resizeObserver) resizeObserver.disconnect();
      if (state.resizeId) window.cancelAnimationFrame(state.resizeId);
    }
  };
})();
