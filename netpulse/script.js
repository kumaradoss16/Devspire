document.addEventListener("DOMContentLoaded", () => {
    const menuToggle = document.querySelector(".menu-toggle");
    const navLinks = document.querySelector(".nav-links");

    menuToggle.addEventListener("click", () => {
        navLinks.classList.toggle("active");
        const icon = menuToggle.querySelector("i");
        if (navLinks.classList.contains("active")) {
            icon.classList.remove("fa-bars");
            icon.classList.add("fa-times");
        } else {
            icon.classList.remove("fa-times");
            icon.classList.add("fa-bars");
        }
    });

    (function () {
        const el = document.getElementById("brand");
        const text = el.dataset.text || "DevSpireHub";
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
});


/* ════════════════════════════════════════════════
    SERVER DATA
    ════════════════════════════════════════════════ */
const ALL_SERVERS = [
    { city: 'Mumbai', country: 'IN', lat: 19.076, lng: 72.877, dl: [35, 90], ul: [15, 45], ping: [8, 25] },
    { city: 'Chennai', country: 'IN', lat: 13.082, lng: 80.270, dl: [40, 95], ul: [18, 50], ping: [10, 28] },
    { city: 'Bengaluru', country: 'IN', lat: 12.971, lng: 77.594, dl: [30, 85], ul: [12, 40], ping: [12, 32] },
    { city: 'Hyderabad', country: 'IN', lat: 17.385, lng: 78.486, dl: [28, 80], ul: [10, 38], ping: [14, 35] },
    { city: 'Delhi', country: 'IN', lat: 28.613, lng: 77.209, dl: [25, 78], ul: [10, 36], ping: [18, 50] },
    { city: 'Kolkata', country: 'IN', lat: 22.572, lng: 88.363, dl: [20, 65], ul: [8, 30], ping: [22, 55] },
    { city: 'Pune', country: 'IN', lat: 18.520, lng: 73.856, dl: [32, 88], ul: [14, 42], ping: [10, 30] },
    { city: 'Ahmedabad', country: 'IN', lat: 23.022, lng: 72.571, dl: [28, 75], ul: [12, 35], ping: [15, 40] },
    { city: 'Puducherry', country: 'IN', lat: 11.934, lng: 79.830, dl: [18, 60], ul: [8, 28], ping: [18, 45] },
    { city: 'Coimbatore', country: 'IN', lat: 11.016, lng: 76.955, dl: [25, 72], ul: [10, 35], ping: [16, 42] },
    { city: 'Kochi', country: 'IN', lat: 9.931, lng: 76.267, dl: [30, 80], ul: [12, 38], ping: [14, 38] },
    { city: 'Colombo', country: 'LK', lat: 6.927, lng: 79.861, dl: [15, 50], ul: [6, 22], ping: [30, 65] },
    { city: 'Singapore', country: 'SG', lat: 1.352, lng: 103.820, dl: [60, 150], ul: [25, 70], ping: [40, 80] },
    { city: 'Dubai', country: 'AE', lat: 25.204, lng: 55.270, dl: [20, 70], ul: [8, 30], ping: [75, 130] },
    { city: 'Frankfurt', country: 'DE', lat: 50.110, lng: 8.682, dl: [80, 200], ul: [30, 80], ping: [100, 160] },
    { city: 'London', country: 'GB', lat: 51.507, lng: -0.127, dl: [70, 180], ul: [25, 70], ping: [110, 180] },
    { city: 'Tokyo', country: 'JP', lat: 35.689, lng: 139.691, dl: [100, 300], ul: [40, 100], ping: [90, 150] },
    { city: 'Sydney', country: 'AU', lat: -33.868, lng: 151.209, dl: [50, 120], ul: [20, 50], ping: [150, 220] },
    { city: 'New York', country: 'US', lat: 40.712, lng: -74.005, dl: [80, 200], ul: [30, 80], ping: [160, 240] },
    { city: 'São Paulo', country: 'BR', lat: -23.550, lng: -46.633, dl: [30, 90], ul: [10, 35], ping: [180, 260] },
];

function haversine(la1, lo1, la2, lo2) {
    const R = 6371, dLa = (la2 - la1) * Math.PI / 180, dLo = (lo2 - lo1) * Math.PI / 180;
    const a = Math.sin(dLa / 2) ** 2 + Math.cos(la1 * Math.PI / 180) * Math.cos(la2 * Math.PI / 180) * Math.sin(dLo / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

let activeSrv = ALL_SERVERS[0], userLat = null, userLng = null;

/* ── IP detection ── */
function setNetInfoLoading() {
    ['niIsp','niIp','niCity','niCountry','niTimezone','niHostname'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = 'Detecting…';
    });
    const badge = document.getElementById('niCountryBadge');
    if (badge) badge.textContent = '—';
}

function populateNetInfo(d) {
    const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val || '—'; };
    set('niIsp',      d.org ? d.org.replace(/^AS\d+\s*/, '') : d.isp);
    set('niIp',       d.ip);
    set('niCity',     d.city && d.region ? `${d.city}, ${d.region}` : d.city);
    set('niCountry',  d.country_name || d.country);
    set('niTimezone', d.timezone);
    set('niHostname', d.hostname);
    const badge = document.getElementById('niCountryBadge');
    if (badge) badge.textContent = d.country_code || d.country || '—';
    /* also update header bar */
    document.getElementById('pubIp').textContent  = d.ip || '—';
    document.getElementById('ispName').textContent = d.org ? d.org.replace(/^AS\d+\s*/, '').slice(0, 28) : d.isp || '—';
}

async function fetchIpInfo() {
    setNetInfoLoading();

    /* ── Attempt 1: ip-api.com (free, no key, rich data) ── */
    try {
        const r = await fetch('http://ip-api.com/json/?fields=status,message,country,countryCode,regionName,city,zip,timezone,isp,org,as,query,hosting,mobile,proxy,reverse');
        const d = await r.json();
        if (d.status === 'success') {
            const isp = d.org || d.isp || d.as || '—';
            populateNetInfo({
                ip:           d.query,
                org:          isp,
                city:         d.city,
                region:       d.regionName,
                country_name: d.country,
                country_code: d.countryCode,
                timezone:     d.timezone,
                hostname:     d.reverse || '—',
            });
            return;
        }
    } catch { /* fall through */ }

    /* ── Attempt 2: ipapi.co (backup) ── */
    try {
        const r = await fetch('https://ipapi.co/json/');
        const d = await r.json();
        /* ipapi.co returns {error:true, reason:…} when rate-limited */
        if (!d.error && d.ip) {
            populateNetInfo(d);
            return;
        }
    } catch { /* fall through */ }

    /* ── Attempt 3: ipify (IP only) ── */
    try {
        const r = await fetch('https://api.ipify.org?format=json');
        const d = await r.json();
        const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val || '—'; };
        set('niIp', d.ip);
        set('niIsp', '—'); set('niCity', '—'); set('niCountry', '—');
        set('niTimezone', '—'); set('niHostname', '—');
        document.getElementById('pubIp').textContent = d.ip || '—';
        document.getElementById('ispName').textContent = '—';
        const badge = document.getElementById('niCountryBadge');
        if (badge) badge.textContent = '—';
    } catch {
        document.getElementById('pubIp').textContent = 'Unavailable';
        document.getElementById('ispName').textContent = '—';
        ['niIsp','niIp','niCity','niCountry','niTimezone','niHostname'].forEach(id => {
            const el = document.getElementById(id); if (el) el.textContent = 'Unavailable';
        });
    }
}
fetchIpInfo();

function setGeoStatus(msg, cls) {
    const el = document.getElementById('geoStatus');
    el.textContent = msg; el.className = 'geo-status' + (cls ? ' ' + cls : '');
}

function renderServers(servers) {
    const row = document.getElementById('srvRow');
    row.innerHTML = '';
    servers.forEach((s, i) => {
    const dist = (userLat !== null) ? Math.round(haversine(userLat, userLng, s.lat, s.lng)) : null;
    const b = document.createElement('button');
    b.className = 'srv-btn' + (i === 0 ? ' active' : '');
    const dl = dist !== null ? ` <span style="opacity:.55;font-size:10px">${dist < 1 ? '<1' : dist}km</span>` : '';
    b.innerHTML = `<i class="ti ti-server" style="font-size:11px" aria-hidden="true"></i> ${s.city}, ${s.country}${dl}`;
    b.onclick = () => {
        if (testing) return;
        activeSrv = s;
        document.querySelectorAll('.srv-btn').forEach(x => x.classList.remove('active'));
        b.classList.add('active');
        document.getElementById('activeSrv').textContent = s.city + ', ' + s.country;
    };
    row.appendChild(b);
    });
    activeSrv = servers[0];
    document.getElementById('activeSrv').textContent = servers[0].city + ', ' + servers[0].country;
}

async function detectLocation() {
    if (!navigator.geolocation) { setGeoStatus('Geolocation unavailable', 'err'); renderServers(ALL_SERVERS.slice(0, 6)); return; }
    navigator.geolocation.getCurrentPosition(pos => {
    userLat = pos.coords.latitude; userLng = pos.coords.longitude;
    setGeoStatus('Sorting servers…');
    const sorted = ALL_SERVERS.map(s => ({ ...s, dist: haversine(userLat, userLng, s.lat, s.lng) }))
        .sort((a, b) => a.dist - b.dist).slice(0, 6);
    setGeoStatus('✓ ' + sorted.length + ' nearby', 'ok');
    renderServers(sorted);
    }, () => { setGeoStatus('Location denied', 'err'); renderServers(ALL_SERVERS.slice(0, 6)); }, { timeout: 8000 });
}
detectLocation();

/* ════════════════════════════════════════════════
    SPEEDOMETER
    ════════════════════════════════════════════════ */
const CX = 150, CY = 143, R = 100;
const SA_DEG = -210, EA_DEG = 30;
const SA = SA_DEG * Math.PI / 180, EA = EA_DEG * Math.PI / 180;
const TOTAL_ANG = EA - SA;
const NEEDLE_OFFSET = 90;

function pc(a, r) { return { x: CX + r * Math.cos(a), y: CY + r * Math.sin(a) }; }
function arc(a1, a2, r) {
    const s = pc(a1, r), e = pc(a2, r), lg = (a2 - a1) > Math.PI ? 1 : 0;
    return `M${s.x.toFixed(2)} ${s.y.toFixed(2)}A${r} ${r} 0 ${lg} 1 ${e.x.toFixed(2)} ${e.y.toFixed(2)}`;
}

document.getElementById('trk').setAttribute('d', arc(SA, EA, R));
document.getElementById('fil').setAttribute('d', arc(SA, SA + .001, R));

const tkg = document.getElementById('tks');
for (let i = 0; i <= 20; i++) {
    const f = i / 20, a = SA + f * TOTAL_ANG, major = i % 4 === 0;
    const o = pc(a, R + 9), inn = pc(a, R + (major ? 2 : 5));
    const l = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    l.setAttribute('x1', o.x); l.setAttribute('y1', o.y);
    l.setAttribute('x2', inn.x); l.setAttribute('y2', inn.y);
    l.setAttribute('stroke', major ? '#555c75' : '#222738');
    l.setAttribute('stroke-width', major ? '1.5' : '1');
    tkg.appendChild(l);
}

let needleCurrent = 0, needleTarget = 0, needleVel = 0, rafId = null;
const SPRING = 0.10, DAMP = 0.72;

function needleAngleDeg(pct) {
    const SPAN = EA_DEG - SA_DEG;
    return SA_DEG + Math.max(0, Math.min(1, pct)) * SPAN;
}
function applyNeedle(pct) {
    const deg = needleAngleDeg(pct);
    document.getElementById('ndlG').setAttribute('transform', `rotate(${(deg + NEEDLE_OFFSET).toFixed(3)},${CX},${CY})`);
    const arcEnd = SA + Math.max(0, Math.min(1, pct)) * TOTAL_ANG;
    document.getElementById('fil').setAttribute('d', pct > 0.001 ? arc(SA, arcEnd, R) : arc(SA, SA + .001, R));
}
function animateNeedle() {
    const diff = needleTarget - needleCurrent;
    needleVel = needleVel * DAMP + diff * SPRING;
    needleCurrent += needleVel;
    applyNeedle(needleCurrent);
    if (Math.abs(diff) > 0.0005 || Math.abs(needleVel) > 0.0003) rafId = requestAnimationFrame(animateNeedle);
    else { needleCurrent = needleTarget; applyNeedle(needleCurrent); rafId = null; }
}
function setNeedle(pct) {
    needleTarget = Math.max(0, Math.min(1, pct));
    if (!rafId) rafId = requestAnimationFrame(animateNeedle);
}
applyNeedle(0);
window.MAX_SPD = 100;

/* ════════════════════════════════════════════════
    CHARTS
    ════════════════════════════════════════════════ */
const N = 30;
let liveChart, pingChart;

function mkChart(id, datasets, yMax) {
    return new Chart(document.getElementById(id), {
    type: 'line',
    data: { labels: Array(N).fill(''), datasets },
    options: {
        responsive: true, maintainAspectRatio: false, animation: false,
        plugins: { legend: { display: false } },
        scales: {
        x: { display: false },
        y: {
            min: 0, max: yMax, border: { display: false },
            grid: { color: 'rgba(255,255,255,0.05)' },
            ticks: { font: { size: 9 }, color: '#555c75', maxTicksLimit: 4 }
        }
        },
        elements: { point: { radius: 0 }, line: { tension: .4 } }
    }
    });
}

liveChart = mkChart('liveC', [
    { label: 'Download', data: Array(N).fill(null), borderColor: '#1D9E75', borderWidth: 2, fill: true, backgroundColor: 'rgba(29,158,117,0.12)' },
    { label: 'Upload', data: Array(N).fill(null), borderColor: '#378ADD', borderWidth: 2, borderDash: [4, 3], fill: false }
], 120);

pingChart = mkChart('pingC', [
    { label: 'Ping', data: Array(N).fill(null), borderColor: '#EF9F27', borderWidth: 2, fill: false },
    { label: 'Jitter', data: Array(N).fill(null), borderColor: '#D4537E', borderWidth: 2, borderDash: [3, 3], fill: false }
], 120);

function pushC(ch, vals) {
    ch.data.labels.push(''); ch.data.labels.shift();
    vals.forEach((v, i) => { ch.data.datasets[i].data.push(v); ch.data.datasets[i].data.shift(); });
    ch.update('none');
}

/* ════════════════════════════════════════════════
    TEST LOGIC
    ════════════════════════════════════════════════ */
let testing = false, testInt = null, timerInt = null;
let dlFin = 0, ulFin = 0, pingFin = 0, jitFin = 0;
const hist = [];
const PHASE = 15;

function rnd(a, b) { return a + Math.random() * (b - a); }
function setBar(id, p) {
    const w = Math.min(100, Math.max(0, Math.round(p)));
    document.getElementById(id + 'Bar').style.width = w + '%';
    document.getElementById(id + 'Pct').textContent = w + '%';
}
function setSpd(id, v) { document.getElementById(id + 'Spd').innerHTML = v.toFixed(1) + ' <span>Mbps</span>'; }
function setSt(id, t) { document.getElementById(id + 'St').textContent = t; }
function setRing(sec, total, lbl) {
    const circ = 2 * Math.PI * 34;
    document.getElementById('ringFg').style.strokeDashoffset = (circ * (1 - Math.min(1, sec / total))).toFixed(2);
    document.getElementById('ringNum').textContent = sec > 0 ? sec : '✓';
    document.getElementById('ringLbl').textContent = lbl;
}
function setBadge(txt, cls) {
    const b = document.getElementById('modeBadge');
    b.textContent = txt; b.className = 'badge' + (cls ? ' ' + cls : '');
}

/* Animated number display */
let dispVel = 0, dispCurrent = 0, dispTarget = 0, dispRaf = null;
function animateDisplay() {
    const diff = dispTarget - dispCurrent;
    dispVel = dispVel * 0.75 + diff * 0.12;
    dispCurrent += dispVel;
    document.getElementById('liveSpd').textContent = Math.max(0, dispCurrent).toFixed(1);
    if (Math.abs(diff) > 0.05 || Math.abs(dispVel) > 0.02) dispRaf = requestAnimationFrame(animateDisplay);
    else { dispCurrent = dispTarget; document.getElementById('liveSpd').textContent = dispTarget.toFixed(1); dispRaf = null; }
}
function setDisplay(v) {
    dispTarget = v;
    if (!dispRaf) dispRaf = requestAnimationFrame(animateDisplay);
}

function toggleTest() { testing ? stopTest() : startTest(); }

function startTest() {
    testing = true;
    dlFin = rnd(...activeSrv.dl); ulFin = rnd(...activeSrv.ul);
    pingFin = Math.round(rnd(...activeSrv.ping)); jitFin = Math.round(rnd(2, pingFin * .3 + 4));
    window.MAX_SPD = Math.max(100, Math.ceil(activeSrv.dl[1] / 50) * 50);
    document.getElementById('lbl100').textContent = window.MAX_SPD + '+';
    document.getElementById('mainBtn').className = 'main-btn stop';
    document.getElementById('mainBtn').innerHTML = '<i class="ti ti-player-stop" aria-hidden="true"></i> Stop';
    ['dlN', 'ulN'].forEach(id => document.getElementById(id).textContent = '—');
    ['pingV', 'jitV', 'lossV'].forEach(id => document.getElementById(id).textContent = '—');
    setBar('dl', 0); setBar('ul', 0); setSpd('dl', 0); setSpd('ul', 0);
    setSt('dl', 'Waiting…'); setSt('ul', 'Waiting…');
    setNeedle(0); dispCurrent = 0; dispTarget = 0;
    document.getElementById('liveUnit').textContent = 'ms ping';
    runPing();
}

function runPing() {
    setBadge('Ping', 'ping-b');
    let t = 0;
    const iv = setInterval(() => {
    t++;
    const p = Math.round(pingFin * (.5 + .5 * t / 8) + rnd(-3, 3));
    const j = Math.round(jitFin * (t / 8) + rnd(0, 2));
    setDisplay(p); setNeedle(p / 300);
    setRing(Math.min(t, 8), 8, 'Measuring ping…');
    pushC(liveChart, [null, null]); pushC(pingChart, [p, j]);
    if (t >= 8) {
        clearInterval(iv);
        document.getElementById('pingV').textContent = pingFin;
        document.getElementById('jitV').textContent = jitFin;
        document.getElementById('lossV').textContent = '0%';
        document.getElementById('liveUnit').textContent = 'Mbps';
        runDl();
    }
    }, 300);
}

function runDl() {
    setBadge('Download', 'dl'); setSt('dl', 'Testing…');
    let sec = PHASE, step = 0; const SPX = 5, total = PHASE * SPX;
    timerInt = setInterval(() => { sec--; setRing(PHASE - sec, PHASE, 'Download — ' + Math.max(0, sec) + 's left'); if (sec <= 0) clearInterval(timerInt); }, 1000);
    testInt = setInterval(() => {
    step++;
    const pct = (step / total) * 100, ramp = Math.min(1, step / (total * .35));
    const spd = Math.max(0, dlFin * ramp + rnd(-dlFin * .06, dlFin * .06));
    setBar('dl', pct); setSpd('dl', spd);
    setDisplay(spd); setNeedle(spd / (window.MAX_SPD || 100));
    pushC(liveChart, [spd, null]); pushC(pingChart, [pingFin + rnd(-2, 2), jitFin + rnd(-1, 1)]);
    if (step >= total) {
        clearInterval(testInt); clearInterval(timerInt);
        setBar('dl', 100); setSt('dl', 'Complete ✓'); setSpd('dl', dlFin);
        document.getElementById('dlN').textContent = dlFin.toFixed(1);
        setRing(PHASE, PHASE, 'Download done');
        setTimeout(runUl, 700);
    }
    }, 1000 / SPX);
}

function runUl() {
    setBadge('Upload', 'ul'); setSt('ul', 'Testing…');
    let sec = PHASE, step = 0; const SPX = 5, total = PHASE * SPX;
    timerInt = setInterval(() => { sec--; setRing(PHASE - sec, PHASE, 'Upload — ' + Math.max(0, sec) + 's left'); if (sec <= 0) clearInterval(timerInt); }, 1000);
    testInt = setInterval(() => {
    step++;
    const pct = (step / total) * 100, ramp = Math.min(1, step / (total * .35));
    const spd = Math.max(0, ulFin * ramp + rnd(-ulFin * .06, ulFin * .06));
    setBar('ul', pct); setSpd('ul', spd);
    setDisplay(spd); setNeedle(spd / (window.MAX_SPD || 100));
    pushC(liveChart, [dlFin + rnd(-1, 1), spd]); pushC(pingChart, [pingFin + rnd(-2, 2), jitFin + rnd(-1, 1)]);
    if (step >= total) {
        clearInterval(testInt); clearInterval(timerInt);
        setBar('ul', 100); setSt('ul', 'Complete ✓'); setSpd('ul', ulFin);
        document.getElementById('ulN').textContent = ulFin.toFixed(1);
        setRing(PHASE, PHASE, 'Upload done');
        finishTest();
    }
    }, 1000 / SPX);
}

function finishTest() {
    testing = false;
    document.getElementById('mainBtn').className = 'main-btn start';
    document.getElementById('mainBtn').innerHTML = '<i class="ti ti-refresh" aria-hidden="true"></i> Test again';
    setBadge('Done', 'done');
    setDisplay(dlFin); setNeedle(dlFin / (window.MAX_SPD || 100));
    setRing(PHASE, PHASE, 'All done');
    const now = new Date();
    const ts = now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }) + ' ' +
    now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    hist.unshift({
    ts, srv: activeSrv.city + ', ' + activeSrv.country,
    dl: dlFin, ul: ulFin, ping: pingFin, jit: jitFin
    });
    renderHist();
}

function stopTest() {
    clearInterval(testInt); clearInterval(timerInt);
    if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
    if (dispRaf) { cancelAnimationFrame(dispRaf); dispRaf = null; }
    testing = false;
    document.getElementById('mainBtn').className = 'main-btn start';
    document.getElementById('mainBtn').innerHTML = '<i class="ti ti-player-play" aria-hidden="true"></i> Start Test';
    setBadge('Stopped', ''); setSt('dl', 'Stopped'); setSt('ul', 'Stopped');
    document.getElementById('ringNum').textContent = '—';
    document.getElementById('ringLbl').textContent = 'Test stopped';
    document.getElementById('ringFg').style.strokeDashoffset = '213';
    setNeedle(0);
}

function getSpeedRating(dl) {
    if (dl >= 100) return { label: 'Excellent', cls: 'sr-excellent', desc: '4K streaming, gaming, large file transfers, and multiple users simultaneously.' };
    if (dl >= 50)  return { label: 'Good',      cls: 'sr-good',      desc: 'HD streaming, video calls, and smooth browsing for 2–4 users.' };
    if (dl >= 20)  return { label: 'Fair',       cls: 'sr-fair',      desc: 'Basic streaming and browsing. May slow down with multiple devices connected.' };
    return                 { label: 'Poor',       cls: 'sr-poor',      desc: 'May struggle with HD video, large downloads, or multiple connected devices.' };
}

function clearHist() { hist.length = 0; renderHist(); }
function renderHist() {
    const el = document.getElementById('histBody');
    if (!hist.length) {
    el.innerHTML = '<div class="empty"><i class="ti ti-wifi-off" style="font-size:24px;display:block;margin-bottom:8px" aria-hidden="true"></i>No tests yet</div>';
    return;
    }
    let h = '<table class="hist-table"><thead><tr><th>Time</th><th>Server</th><th>Download</th><th>Upload</th><th>Ping</th><th>Jitter</th><th>Speed Rating</th></tr></thead><tbody>';
    hist.forEach(r => {
    const pc = r.ping < 20 ? 'pg' : r.ping < 60 ? 'po' : 'pb';
    const sr = getSpeedRating(r.dl);
    h += `<tr>
    <td style="color:#555c75">${r.ts}</td>
    <td style="color:#8b91a8">${r.srv.split(',')[0]}</td>
    <td><span class="bdl"><i class="ti ti-download" style="font-size:10px" aria-hidden="true"></i>${r.dl.toFixed(1)}</span></td>
    <td><span class="bul"><i class="ti ti-upload" style="font-size:10px" aria-hidden="true"></i>${r.ul.toFixed(1)}</span></td>
    <td class="${pc}">${r.ping} ms</td>
    <td style="color:#555c75">${r.jit} ms</td>
    <td><span class="sr-badge ${sr.cls}" title="${sr.desc}">${sr.label}</span></td>
</tr>`;
    });
    h += '</tbody></table>';
    el.innerHTML = h;
}
