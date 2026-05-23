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
        const typeSpeed = 100, deleteSpeed = 50, pauseTime = 2000, restartPause = 500;
        function typeLoop() {
            const currentText = text.slice(0, i);
            el.textContent = currentText;
            if (!isDeleting && i < text.length)        { i++;  setTimeout(typeLoop, typeSpeed); }
            else if (!isDeleting && i === text.length)  { isDeleting = true; setTimeout(typeLoop, pauseTime); }
            else if (isDeleting && i > 0)               { i--;  setTimeout(typeLoop, deleteSpeed); }
            else if (isDeleting && i === 0)             { isDeleting = false; setTimeout(typeLoop, restartPause); }
        }
        typeLoop();
    })();
});


'use strict';

// ─── STATE ───────────────────────────────────────────────────
const S = {
  history: [],
  autoMode: true,
  saveHistory: true,
  histOpen: false,
  b64UrlSafe: false,
};

// ─── TOAST ───────────────────────────────────────────────────
const toast = document.getElementById('toast');
let toastTimer;
function showToast(msg, dur = 2000) {
  clearTimeout(toastTimer);
  toast.textContent = msg;
  toast.classList.add('show');
  toastTimer = setTimeout(() => toast.classList.remove('show'), dur);
}

// ─── COPY ────────────────────────────────────────────────────
async function copyText(text) {
  if (!text) return;
  try {
    await navigator.clipboard.writeText(text);
    showToast('✓ Copied to clipboard');
  } catch {
    const ta = document.createElement('textarea');
    ta.value = text; document.body.appendChild(ta);
    ta.select(); document.execCommand('copy');
    document.body.removeChild(ta);
    showToast('✓ Copied');
  }
}

// ─── TAB SWITCHING ───────────────────────────────────────────
function switchTab(id) {
  document.querySelectorAll('.tab-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.tab === id);
  });
  document.querySelectorAll('.panel').forEach(p => {
    p.classList.toggle('active', p.id === 'panel-' + id);
  });
}

document.getElementById('tabNav').addEventListener('click', e => {
  const btn = e.target.closest('.tab-btn');
  if (btn) switchTab(btn.dataset.tab);
});

// NEW: dropdown behavior (mobile)
const navDropdownTrigger = document.getElementById('navDropdownTrigger');
const navDropdownPanel   = document.getElementById('navDropdownPanel');

if (navDropdownTrigger && navDropdownPanel) {
  navDropdownTrigger.addEventListener('click', () => {
    const isOpen = navDropdownPanel.classList.toggle('open');
    navDropdownTrigger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  navDropdownPanel.addEventListener('click', (e) => {
    const item = e.target.closest('.nav-dd-item');
    if (!item) return;

    const tabId = item.dataset.tab;
    if (!tabId) return;

    // switch main content
    switchTab(tabId);

    // update active state and label
    navDropdownPanel.querySelectorAll('.nav-dd-item').forEach(el => {
      el.classList.toggle('active', el === item);
    });

    const label = document.getElementById('navDropdownLabel');
    if (label) label.textContent = item.textContent.trim();

    // close dropdown
    navDropdownPanel.classList.remove('open');
    navDropdownTrigger.setAttribute('aria-expanded', 'false');
  });

  // optional: auto-close dropdown if resizing up
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 480) {
      navDropdownPanel.classList.remove('open');
      navDropdownTrigger.setAttribute('aria-expanded', 'false');
    }
  });
}

// ─── URL ENCODE/DECODE ────────────────────────────────────────
const urlInput = document.getElementById('urlInput');
const urlOutput = document.getElementById('urlOutput');
const inCount = document.getElementById('inCount');
const outCount = document.getElementById('outCount');
const statEncoded = document.getElementById('statEncoded');
const statRatio = document.getElementById('statRatio');
const statBytes = document.getElementById('statBytes');
const urlStatus = document.getElementById('urlStatus');

function encodeURL(txt) {
  return encodeURIComponent(txt);
}
function decodeURL(txt) {
  return decodeURIComponent(txt.replace(/\+/g, ' '));
}
function isLikelyEncoded(txt) {
  return /%[0-9A-Fa-f]{2}/.test(txt);
}
function countEncoded(txt) {
  return (txt.match(/%[0-9A-Fa-f]{2}/g) || []).length;
}
function byteLength(txt) {
  return new TextEncoder().encode(txt).length;
}

function doEncode() {
  const raw = urlInput.value;
  if (!raw) return;
  try {
    const enc = encodeURL(raw);
    urlOutput.value = enc;
    updateStats(raw, enc);
    addHistory('ENCODE', raw, enc);
    urlStatus.innerHTML = '<span class="badge badge-ok">ENCODED</span>';
  } catch (e) {
    urlStatus.innerHTML = '<span class="badge badge-err">ERROR</span>';
  }
}

function doDecode() {
  const raw = urlInput.value;
  if (!raw) return;
  try {
    const dec = decodeURL(raw);
    urlOutput.value = dec;
    updateStats(raw, dec);
    addHistory('DECODE', raw, dec);
    urlStatus.innerHTML = '<span class="badge badge-info">DECODED</span>';
  } catch (e) {
    urlStatus.innerHTML = '<span class="badge badge-err">INVALID</span>';
  }
}

function updateStats(inp, out) {
  inCount.textContent = inp.length + ' chars';
  outCount.textContent = out.length + ' chars';
  const enc = countEncoded(out);
  statEncoded.textContent = enc;
  const ratio = inp.length > 0 ? (out.length / inp.length).toFixed(2) + 'x' : '—';
  statRatio.textContent = ratio;
  statBytes.textContent = byteLength(inp);
}

urlInput.addEventListener('input', () => {
  inCount.textContent = urlInput.value.length + ' chars';
  if (S.autoMode && urlInput.value) {
    if (isLikelyEncoded(urlInput.value)) doDecode();
    else doEncode();
  }
});

document.getElementById('encodeBtn').addEventListener('click', doEncode);
document.getElementById('decodeBtn').addEventListener('click', doDecode);
document.getElementById('encodeMid').addEventListener('click', doEncode);
document.getElementById('decodeMid').addEventListener('click', doDecode);

document.getElementById('swapBtn').addEventListener('click', () => {
  const tmp = urlInput.value;
  urlInput.value = urlOutput.value;
  urlOutput.value = tmp;
  inCount.textContent = urlInput.value.length + ' chars';
  outCount.textContent = urlOutput.value.length + ' chars';
});

document.getElementById('clearBtn').addEventListener('click', () => {
  urlInput.value = ''; urlOutput.value = '';
  inCount.textContent = '0 chars'; outCount.textContent = '0 chars';
  statEncoded.textContent = '0'; statRatio.textContent = '—'; statBytes.textContent = '0';
  urlStatus.innerHTML = '';
});

document.getElementById('clearGlobal').addEventListener('click', () => {
  urlInput.value = ''; urlOutput.value = '';
  inCount.textContent = '0 chars'; outCount.textContent = '0 chars';
});

document.getElementById('copyUrl').addEventListener('click', () => copyText(urlOutput.value));
document.getElementById('downloadUrl').addEventListener('click', () => {
  const blob = new Blob([urlOutput.value], { type: 'text/plain' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob); a.download = 'encoded.txt';
  a.click();
});

// ─── AUTO MODE ────────────────────────────────────────────────
const autoModeChk = document.getElementById('autoMode');
const autoChip = document.getElementById('autoChip');
const modeHint = document.getElementById('modeHint');

autoModeChk.addEventListener('change', () => {
  S.autoMode = autoModeChk.checked;
  autoChip.classList.toggle('on', S.autoMode);
  modeHint.textContent = S.autoMode ? 'AUTO' : 'MANUAL';
  localStorage.setItem('autoMode', S.autoMode);
});

// ─── HISTORY ──────────────────────────────────────────────────
function addHistory(type, inp, out) {
  if (!S.saveHistory) return;
  S.history.unshift({ type, inp, out, ts: Date.now() });
  if (S.history.length > 50) S.history.pop();
  localStorage.setItem('urlt_history', JSON.stringify(S.history));
  renderHistory();
}

function renderHistory() {
  const list = document.getElementById('historyList');
  if (!S.history.length) {
    list.innerHTML = '<div class="empty-msg"><span class="em">∅</span>No conversions yet</div>';
    return;
  }
  list.innerHTML = S.history.map((h, i) => `
<div class="hist-item" data-i="${i}">
  <span class="hist-type hist-${h.type === 'ENCODE' ? 'enc' : 'dec'}">${h.type}</span>
  <div class="hist-text">
    <div class="hist-in">${escH(h.inp.slice(0, 80))}</div>
    <div class="hist-out">${escH(h.out.slice(0, 80))}</div>
  </div>
  <span class="hist-time">${timeAgo(h.ts)}</span>
</div>
`).join('');
  list.querySelectorAll('.hist-item').forEach(el => {
    el.addEventListener('click', () => {
      const h = S.history[el.dataset.i];
      urlInput.value = h.inp; urlOutput.value = h.out;
      inCount.textContent = h.inp.length + ' chars';
      outCount.textContent = h.out.length + ' chars';
    });
  });
}

function escH(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
function timeAgo(ts) {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return s + 's ago';
  if (s < 3600) return Math.floor(s / 60) + 'm ago';
  return Math.floor(s / 3600) + 'h ago';
}

document.getElementById('histBtn').addEventListener('click', () => {
  const d = document.getElementById('historyDrawer');
  d.style.display = d.style.display === 'none' ? 'block' : 'none';
  renderHistory();
});
document.getElementById('clearHistBtn').addEventListener('click', () => {
  S.history = []; localStorage.removeItem('urlt_history'); renderHistory();
});

function loadHistory() {
  try { S.history = JSON.parse(localStorage.getItem('urlt_history') || '[]'); } catch { S.history = []; }
}

// ─── CHAR MAP ─────────────────────────────────────────────────
const CHARS = [
  [' ', '%20'], ['\t', '%09'], ['!', '%21'], ['#', '%23'], ['$', '%24'], ['&', '%26'],
  ["'", '%27'], ['(', '%28'], [')', ')'], ['*', '%2A'],
  ['+', '%2B'], [',', '%2C'], ['/', '/'], ['?', '%3F'],
  ['@', '%40'], ['[', '%5B'], [']', '%5D'], ['=', '%3D'], ['~', '%7E'],
  ['ñ', '%C3%B1'], ['é', '%C3%A9'], ['ü', '%C3%BC'], ['🚀', '%F0%9F%9A%80'], ['中', '%E4%B8%AD']
];

const charMap = document.getElementById('charMap');
charMap.innerHTML = CHARS.map(([raw, enc]) => `
<div class="char-cell" data-raw="${raw}" data-enc="${enc}">
<div class="c-raw">${raw === ' ' ? '·' : escH(raw)}</div>
<div class="c-enc">${enc}</div>
</div>
`).join('');

charMap.addEventListener('click', e => {
  const cell = e.target.closest('.char-cell');
  if (!cell) return;
  const raw = cell.dataset.raw;
  urlInput.value += raw;
  urlInput.dispatchEvent(new Event('input'));
  showToast('Inserted: ' + (raw === ' ' ? 'space' : raw));
});

// ─── QUERY PARAMS BUILDER ─────────────────────────────────────
let paramCount = 0;

function addParamRow(key = '', val = '') {
  paramCount++;
  const id = paramCount;
  const div = document.createElement('div');
  div.className = 'param-row'; div.id = 'pr-' + id;
  div.innerHTML = `
<input class="param-input param-key" placeholder="key" value="${escH(key)}" id="pk-${id}" aria-label="Parameter key">
<input class="param-input param-val" placeholder="value" value="${escH(val)}" id="pv-${id}" aria-label="Parameter value">
<button class="btn btn-r btn-icon-only" data-remove="${id}" aria-label="Remove parameter row">✕</button>
`;
  document.getElementById('paramRows').appendChild(div);
  div.querySelectorAll('input').forEach(inp => inp.addEventListener('input', buildQP));
  // Event delegation handles the remove button — no inline onclick needed
}

// Remove-row via event delegation on the container
document.getElementById('paramRows').addEventListener('click', e => {
  const btn = e.target.closest('[data-remove]');
  if (!btn) return;
  const id = btn.dataset.remove;
  const row = document.getElementById('pr-' + id);
  if (row) { row.remove(); buildQP(); }
});

function buildQP() {
  const base = document.getElementById('qpBaseUrl').value.trim();
  const rows = document.querySelectorAll('.param-row');
  const params = [];
  rows.forEach(row => {
    const k = row.querySelector('.param-key').value.trim();
    const v = row.querySelector('.param-val').value.trim();
    if (k) params.push(encodeURIComponent(k) + '=' + encodeURIComponent(v));
  });
  const query = params.length ? '?' + params.join('&') : '';
  document.getElementById('qpResult').textContent = base + query || '—';
}

document.getElementById('addParam').addEventListener('click', () => { addParamRow(); buildQP(); });
document.getElementById('qpBuild').addEventListener('click', buildQP);
document.getElementById('qpBaseUrl').addEventListener('input', buildQP);

document.getElementById('parseUrl').addEventListener('click', () => {
  const box = document.getElementById('parseUrlBox');
  box.style.display = 'block';
  document.getElementById('parseUrlInput').focus();
});

document.getElementById('parseUrlCancel').addEventListener('click', () => {
  document.getElementById('parseUrlBox').style.display = 'none';
  document.getElementById('parseUrlInput').value = '';
});

document.getElementById('parseUrlConfirm').addEventListener('click', () => {
  const raw = document.getElementById('parseUrlInput').value.trim();
  if (!raw) { showToast('⚠ Please enter a URL'); return; }
  try {
    const url = new URL(raw);
    document.getElementById('qpBaseUrl').value = url.origin + url.pathname;
    document.getElementById('paramRows').innerHTML = '';
    paramCount = 0;
    url.searchParams.forEach((v, k) => addParamRow(k, v));
    buildQP();
    document.getElementById('parseUrlBox').style.display = 'none';
    document.getElementById('parseUrlInput').value = '';
    showToast('✓ URL parsed into params');
  } catch { showToast('⚠ Invalid URL — include https://'); }
});

// Allow Enter key in the parse input box
document.getElementById('parseUrlInput').addEventListener('keydown', e => {
  if (e.key === 'Enter') document.getElementById('parseUrlConfirm').click();
  if (e.key === 'Escape') document.getElementById('parseUrlCancel').click();
});

document.getElementById('copyQp').addEventListener('click', () =>
  copyText(document.getElementById('qpResult').textContent));
document.getElementById('openQp').addEventListener('click', () => {
  const url = document.getElementById('qpResult').textContent;
  if (url !== '—') window.open(url, '_blank');
});

addParamRow();

// ─── BASE64 ───────────────────────────────────────────────────
const b64Input = document.getElementById('b64Input');
const b64Output = document.getElementById('b64Output');
const b64Status = document.getElementById('b64Status');

function b64Encode() {
  try {
    const raw = b64Input.value;
    let enc = btoa(unescape(encodeURIComponent(raw)));
    if (S.b64UrlSafe) enc = enc.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
    b64Output.value = enc;
    b64Status.innerHTML = '<span class="badge badge-ok">ENCODED</span>';
    updateB64Stats(enc);
    addHistory('ENCODE', raw, enc);
  } catch (e) {
    b64Status.innerHTML = '<span class="badge badge-err">ERROR</span>';
  }
}

function b64Decode() {
  try {
    let raw = b64Input.value.trim();
    if (S.b64UrlSafe) raw = raw.replace(/-/g, '+').replace(/_/g, '/');
    const dec = decodeURIComponent(escape(atob(raw)));
    b64Output.value = dec;
    b64Status.innerHTML = '<span class="badge badge-info">DECODED</span>';
    updateB64Stats(raw);
    addHistory('DECODE', raw, dec);
  } catch (e) {
    b64Status.innerHTML = '<span class="badge badge-err">INVALID B64</span>';
  }
}

function updateB64Stats(enc) {
  const padding = (enc.match(/=/g) || []).length;
  document.getElementById('b64Padding').textContent = padding + ' bytes';
  const valid = /^[A-Za-z0-9+/\-_]*={0,2}$/.test(enc);
  document.getElementById('b64Valid').textContent = valid ? 'Yes' : 'No';
  document.getElementById('b64InCount').textContent = b64Input.value.length + ' chars';
  document.getElementById('b64OutCount').textContent = b64Output.value.length + ' chars';
}

b64Input.addEventListener('input', () => {
  document.getElementById('b64InCount').textContent = b64Input.value.length + ' chars';
});

document.getElementById('b64Encode').addEventListener('click', b64Encode);
document.getElementById('b64Decode').addEventListener('click', b64Decode);
document.getElementById('b64MidEnc').addEventListener('click', b64Encode);
document.getElementById('b64MidDec').addEventListener('click', b64Decode);
document.getElementById('b64Swap').addEventListener('click', () => {
  const t = b64Input.value; b64Input.value = b64Output.value; b64Output.value = t;
});
document.getElementById('b64Clear').addEventListener('click', () => {
  b64Input.value = ''; b64Output.value = ''; b64Status.innerHTML = '';
});
document.getElementById('copyB64').addEventListener('click', () => copyText(b64Output.value));
document.getElementById('b64UrlSafe').addEventListener('click', function () {
  S.b64UrlSafe = !S.b64UrlSafe;
  this.classList.toggle('btn-y', S.b64UrlSafe);
  this.classList.toggle('btn-ghost', !S.b64UrlSafe);
  showToast('URL-safe mode: ' + (S.b64UrlSafe ? 'ON' : 'OFF'));
});

// ─── JWT VIEWER ───────────────────────────────────────────────
document.getElementById('jwtInput').addEventListener('input', () => {
  if (document.getElementById('jwtInput').value.includes('.')) jwtDecode();
});
document.getElementById('jwtDecode').addEventListener('click', jwtDecode);

function jwtDecode() {
  const token = document.getElementById('jwtInput').value.trim();
  const parts = token.split('.');
  const status = document.getElementById('jwtStatus');
  const result = document.getElementById('jwtResult');

  if (parts.length !== 3) {
    status.innerHTML = '<span class="badge badge-err">INVALID JWT</span>';
    result.innerHTML = '';
    return;
  }

  try {
    function b64urlDecode(s) {
      s = s.replace(/-/g, '+').replace(/_/g, '/');
      while (s.length % 4) s += '=';
      return JSON.parse(decodeURIComponent(escape(atob(s))));
    }

    const header = b64urlDecode(parts[0]);
    const payload = b64urlDecode(parts[1]);

    status.innerHTML = '<span class="badge badge-ok">VALID STRUCTURE</span>';

    // Expiry check
    let expBadge = '';
    if (payload.exp) {
      const now = Math.floor(Date.now() / 1000);
      const expired = payload.exp < now;
      expBadge = expired
        ? '<span class="badge badge-err" style="margin-left:.5rem;">EXPIRED</span>'
        : '<span class="badge badge-ok" style="margin-left:.5rem;">VALID</span>';
      payload._exp_human = new Date(payload.exp * 1000).toLocaleString();
      payload._iat_human = payload.iat ? new Date(payload.iat * 1000).toLocaleString() : undefined;
    }

    result.innerHTML = `
  ${expBadge}
  <div class="jwt-parts" style="margin-top:${expBadge ? '0.75rem' : '0'}">
    <div class="jwt-part jwt-header-p">
      <div class="jwt-part-head">HEADER · Algorithm & Token Type</div>
      <div class="jwt-json">${syntaxHighlight(header)}</div>
    </div>
    <div class="jwt-part jwt-payload-p">
      <div class="jwt-part-head">PAYLOAD · Data</div>
      <div class="jwt-json">${syntaxHighlight(payload)}</div>
    </div>
    <div class="jwt-part jwt-sig-p">
      <div class="jwt-part-head">SIGNATURE · (Base64URL)</div>
      <div class="jwt-json" style="color:var(--p); word-break:break-all;">${parts[2]}</div>
    </div>
  </div>
`;
  } catch (e) {
    status.innerHTML = '<span class="badge badge-err">DECODE ERROR</span>';
  }
}

function syntaxHighlight(obj) {
  return JSON.stringify(obj, null, 2)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, m => {
      if (/^"/.test(m)) {
        if (/:$/.test(m)) return `<span class="jwt-key">${m}</span>`;
        return `<span class="jwt-str">${m}</span>`;
      }
      if (/true|false/.test(m)) return `<span class="jwt-bool">${m}</span>`;
      return `<span class="jwt-num">${m}</span>`;
    });
}

// ─── HASH GENERATOR ───────────────────────────────────────────
document.getElementById('hashGenBtn').addEventListener('click', generateHashes);
document.getElementById('hashInput').addEventListener('input', generateHashes);

async function sha(algo, text) {
  const buf = await crypto.subtle.digest(algo, new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

async function generateHashes() {
  const text = document.getElementById('hashInput').value;
  const result = document.getElementById('hashResult');
  if (!text) { result.innerHTML = ''; return; }

  result.innerHTML = '<div class="hash-row"><div class="hash-alg" style="color:var(--t3);">Computing…</div></div>';

  // SHA-1 is included for legacy/compatibility reference only; not recommended for security use
  const algos = [
    { label: 'SHA-1', algo: 'SHA-1', warn: true },
    { label: 'SHA-256', algo: 'SHA-256', warn: false },
    { label: 'SHA-384', algo: 'SHA-384', warn: false },
    { label: 'SHA-512', algo: 'SHA-512', warn: false },
  ];

  const results = await Promise.all(algos.map(({ label, algo, warn }) =>
    sha(algo, text).then(h => ({ label, h, warn })).catch(() => ({ label, h: 'N/A', warn }))
  ));

  result.innerHTML = results.map(({ label, h, warn }) => `
<div class="hash-row">
  <div class="hash-alg">
    ${label}
    ${warn ? '<span title="SHA-1 is cryptographically broken — use SHA-256 or higher for security purposes" style="color:var(--y);cursor:help;margin-left:0.3rem;" aria-label="SHA-1 deprecation warning">⚠</span>' : ''}
  </div>
  <div class="hash-val" data-hash="${escH(h)}">${escH(h)}</div>
  <button class="btn btn-ghost btn-icon-only hash-copy-btn" data-hash="${escH(h)}" aria-label="Copy ${label} hash">⎘</button>
</div>
`).join('');

  // Event delegation — no inline onclick
  result.querySelectorAll('.hash-copy-btn').forEach(btn => {
    btn.addEventListener('click', () => copyText(btn.dataset.hash));
  });
}

// ─── DIFF ─────────────────────────────────────────────────────
document.getElementById('diffBtn').addEventListener('click', doDiff);

function doDiff() {
  const a = document.getElementById('diffA').value;
  const b = document.getElementById('diffB').value;
  const status = document.getElementById('diffStatus');

  if (!a && !b) { document.getElementById('diffOutput').textContent = '—'; return; }

  // Simple char-level diff
  const out = charDiff(a, b);
  document.getElementById('diffOutput').innerHTML = out;

  const changes = (out.match(/class="diff-(add|rem)"/g) || []).length;
  status.innerHTML = changes === 0
    ? '<span class="badge badge-ok">IDENTICAL</span>'
    : `<span class="badge badge-warn">${changes} change${changes !== 1 ? 's' : ''}</span>`;
}

function charDiff(a, b) {
  // Word-level diff
  const wa = a.split(/(\s+)/);
  const wb = b.split(/(\s+)/);
  const dp = Array.from({ length: wa.length + 1 }, () => new Array(wb.length + 1).fill(0));
  for (let i = wa.length - 1; i >= 0; i--)
    for (let j = wb.length - 1; j >= 0; j--)
      dp[i][j] = wa[i] === wb[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);

  let i = 0, j = 0, html = '';
  while (i < wa.length || j < wb.length) {
    if (i < wa.length && j < wb.length && wa[i] === wb[j]) {
      html += `<span class="diff-eq">${escH(wa[i])}</span>`; i++; j++;
    } else if (j < wb.length && (i >= wa.length || dp[i][j + 1] >= dp[i + 1][j])) {
      html += `<span class="diff-add">${escH(wb[j])}</span>`; j++;
    } else {
      html += `<span class="diff-rem">${escH(wa[i])}</span>`; i++;
    }
  }
  return html;
}

// ─── SETTINGS ─────────────────────────────────────────────────
document.getElementById('settingAuto').addEventListener('change', function () {
  S.autoMode = this.checked;
  document.getElementById('autoMode').checked = this.checked;
  autoChip.classList.toggle('on', this.checked);
  modeHint.textContent = this.checked ? 'AUTO' : 'MANUAL';
});
document.getElementById('settingHistory').addEventListener('change', function () {
  S.saveHistory = this.checked;
});
document.getElementById('settingScanline').addEventListener('change', function () {
  document.body.style.setProperty('--scanline-opacity', this.checked ? '1' : '0');
  // toggle the ::before pseudo via class
  document.body.classList.toggle('no-scanlines', !this.checked);
});
document.getElementById('settingStats').addEventListener('change', function () {
  document.querySelectorAll('.stats-bar').forEach(el => {
    el.style.display = this.checked ? '' : 'none';
  });
});

document.getElementById('clearAllHistory').addEventListener('click', () => {
  if (confirm('Clear all history?')) {
    S.history = []; localStorage.removeItem('urlt_history');
    renderHistory(); showToast('History cleared');
  }
});
document.getElementById('exportHistory').addEventListener('click', () => {
  const blob = new Blob([JSON.stringify(S.history, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob); a.download = 'url-tool-history.json';
  a.click();
});

// ─── KEYBOARD SHORTCUTS ───────────────────────────────────────
document.addEventListener('keydown', e => {
  const mod = e.ctrlKey || e.metaKey;
  if (mod && e.key === 'Enter') { e.preventDefault(); doEncode(); }
  if (mod && e.shiftKey && e.key === 'D') { e.preventDefault(); doDecode(); }
  if (mod && e.shiftKey && e.key === 'S') { e.preventDefault(); document.getElementById('swapBtn').click(); }
  if (mod && e.shiftKey && e.key === 'C') { e.preventDefault(); document.getElementById('clearBtn').click(); }
  if (mod && e.shiftKey && e.key === 'X') { e.preventDefault(); copyText(urlOutput.value); }
  if (mod && e.shiftKey && e.key === 'H') { e.preventDefault(); document.getElementById('histBtn').click(); }
});

// ─── INIT ─────────────────────────────────────────────────────
(function init() {
  loadHistory();
  S.autoMode = localStorage.getItem('autoMode') !== 'false';
  document.getElementById('autoMode').checked = S.autoMode;
  autoChip.classList.toggle('on', S.autoMode);
  modeHint.textContent = S.autoMode ? 'AUTO' : 'MANUAL';

  // Footer reference link — no inline onclick
  document.getElementById('footerRefLink').addEventListener('click', e => {
    e.preventDefault(); switchTab('ref');
  });

  // Add "no-scanlines" style if needed
  const style = document.createElement('style');
  style.textContent = '.no-scanlines::before { display: none; }';
  document.head.appendChild(style);

  // ── TAB NAV: DROPDOWN (<480px) + SCROLL (≥480px) ───────────
  const nav = document.getElementById('tabNav');
  const wrapper = document.getElementById('tabNavWrapper');
  const btnLeft = document.getElementById('tabScrollLeft');
  const btnRight = document.getElementById('tabScrollRight');
  const ddTrigger = document.getElementById('navDropdownTrigger');
  const ddPanel = document.getElementById('navDropdownPanel');
  const ddLabel = document.getElementById('navDropdownLabel');
  const SCROLL_STEP = 140;
  const DROPDOWN_BP = 480; // px — matches CSS breakpoint

  // ── Helpers ───────────────────────────────────────────────
  function isMobileNav() {
    return window.innerWidth < DROPDOWN_BP;
  }

  // ── Scroll arrows ─────────────────────────────────────────
  function updateScrollState() {
    if (isMobileNav()) return;
    const { scrollLeft, scrollWidth, clientWidth } = nav;
    const canLeft = scrollLeft > 2;
    const canRight = scrollLeft < scrollWidth - clientWidth - 2;
    btnLeft.hidden = !canLeft;
    btnRight.hidden = !canRight;
    wrapper.classList.toggle('can-scroll-left', canLeft);
    wrapper.classList.toggle('can-scroll-right', canRight);
  }

  function scrollNav(dir) {
    nav.scrollBy({ left: dir * SCROLL_STEP, behavior: 'smooth' });
  }

  btnLeft.addEventListener('click', () => scrollNav(-1));
  btnRight.addEventListener('click', () => scrollNav(1));
  nav.addEventListener('scroll', updateScrollState, { passive: true });
  nav.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') { e.preventDefault(); scrollNav(-1); }
    if (e.key === 'ArrowRight') { e.preventDefault(); scrollNav(1); }
  });

  const ro = new ResizeObserver(() => {
    updateScrollState();
    // close dropdown if window grew past breakpoint
    if (!isMobileNav() && ddPanel.classList.contains('open')) closeDropdown();
  });
  ro.observe(document.documentElement);

  // ── Dropdown ──────────────────────────────────────────────
  function openDropdown() {
    ddPanel.classList.add('open');
    ddTrigger.setAttribute('aria-expanded', 'true');
  }

  function closeDropdown() {
    ddPanel.classList.remove('open');
    ddTrigger.setAttribute('aria-expanded', 'false');
  }

  function toggleDropdown() {
    ddPanel.classList.contains('open') ? closeDropdown() : openDropdown();
  }

  ddTrigger.addEventListener('click', e => {
    e.stopPropagation();
    toggleDropdown();
  });

  // close on outside click
  document.addEventListener('click', e => {
    if (!e.target.closest('#siteHeader')) closeDropdown();
  });

  // close on Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeDropdown();
  });

  // dropdown item click
  ddPanel.addEventListener('click', e => {
    const item = e.target.closest('.nav-dd-item');
    if (!item) return;
    const tabId = item.dataset.tab;
    switchTab(tabId);
    closeDropdown();
  });

  // ── Unified tab switcher ──────────────────────────────────
  // Override switchTab to also sync dropdown label + active states
  const _origSwitch = switchTab;
  window.switchTab = function (id) {
    _origSwitch(id);

    // sync horizontal nav active state (already done in _origSwitch)
    // sync dropdown items
    ddPanel.querySelectorAll('.nav-dd-item').forEach(el => {
      const active = el.dataset.tab === id;
      el.classList.toggle('active', active);
      el.setAttribute('aria-selected', active);
    });

    // update trigger label
    const activeBtn = nav.querySelector('.tab-btn.active');
    if (activeBtn) {
      ddLabel.textContent = activeBtn.textContent.trim();
      // scroll into view for horizontal nav
      activeBtn.scrollIntoView({ inline: 'nearest', behavior: 'smooth', block: 'nearest' });
    }

    setTimeout(updateScrollState, 300);
  };

  // ── Init ─────────────────────────────────────────────────
  updateScrollState();
  // set initial dropdown label to match the active tab
  const initActive = nav.querySelector('.tab-btn.active');
  if (initActive) ddLabel.textContent = initActive.textContent.trim();
})();

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
        const typeSpeed = 100, deleteSpeed = 50, pauseTime = 2000, restartPause = 500;
        function typeLoop() {
            const currentText = text.slice(0, i);
            el.textContent = currentText;
            if (!isDeleting && i < text.length)        { i++;  setTimeout(typeLoop, typeSpeed); }
            else if (!isDeleting && i === text.length)  { isDeleting = true; setTimeout(typeLoop, pauseTime); }
            else if (isDeleting && i > 0)               { i--;  setTimeout(typeLoop, deleteSpeed); }
            else if (isDeleting && i === 0)             { isDeleting = false; setTimeout(typeLoop, restartPause); }
        }
        typeLoop();
    })();
});


