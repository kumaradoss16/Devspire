// ===================================================
document.addEventListener('DOMContentLoaded', () => {

  /* ═══════════════════════════════════════════════
     1. NAV MENU TOGGLE
  ═══════════════════════════════════════════════ */
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks   = document.querySelector('.nav-links');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      const icon = menuToggle.querySelector('i');
      if (navLinks.classList.contains('active')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
      } else {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
      }
    });
  }

  /* ═══════════════════════════════════════════════
     2. TYPEWRITER EFFECT
  ═══════════════════════════════════════════════ */
  const el = document.getElementById('brand');
  if (el) {
    const text        = el.dataset.text || 'DevSpireHub';
    let i             = 0;
    let isDeleting    = false;
    const typeSpeed   = 100;
    const deleteSpeed = 50;
    const pauseTime   = 2000;
    const restartPause= 500;

    function typeLoop() {
      el.textContent = text.slice(0, i);
      if (!isDeleting && i < text.length) {
        i++;
        setTimeout(typeLoop, typeSpeed);
      } else if (!isDeleting && i === text.length) {
        isDeleting = true;
        setTimeout(typeLoop, pauseTime);
      } else if (isDeleting && i > 0) {
        i--;
        setTimeout(typeLoop, deleteSpeed);
      } else {
        isDeleting = false;
        setTimeout(typeLoop, restartPause);
      }
    }
    typeLoop();
  }

  /* ═══════════════════════════════════════════════
     3. SCROLL TO TOP — PROGRESS CIRCLE
  ═══════════════════════════════════════════════ */
  const scrollBtn    = document.getElementById('scrollUpBtn');
  if (scrollBtn) {
    const circle       = scrollBtn.querySelector('.progress-circle');
    const circumference = 2 * Math.PI * 15.9155;

    if (circle) {
      circle.style.strokeDasharray  = circumference;
      circle.style.strokeDashoffset = circumference;
    }

    window.addEventListener('scroll', () => {
      const scrollTop   = window.scrollY;
      const docHeight   = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = docHeight > 0 ? scrollTop / docHeight : 0;

      if (circle) {
        circle.style.strokeDashoffset = circumference * (1 - scrollPercent);
      }
      scrollBtn.style.display = scrollTop > 100 ? 'block' : 'none';
    });

    scrollBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
});

// Image Converter Pro — Main Script
// ===================================================
'use strict';

// ============================
// State
// ============================
const state = {
  files: [],
  selectedFileIndex: 0,
  outputFormat: 'image/png',
  quality: 0.92,
  compressLevel: 0.7,
  resizeWidth: null,
  resizeHeight: null,
  resizePct: 100,
  resizeFitW: null,
  resizeFitH: null,
  lockRatio: true,
  history: [],
  deferredPrompt: null,
};

// ============================
// FileEntry class
// ============================
class FileEntry {
  constructor(file) {
    this.id = Math.random().toString(36).slice(2);
    this.file = file;
    this.name = file.name;
    this.size = file.size;
    this.type = file.type || detectTypeFromName(file.name);
    this.status = 'queued';    // queued | processing | complete | failed
    this.outputBlob = null;
    this.outputSize = 0;
    this.outputFormat = '';
    this.preview = null;       // Object URL for thumbnail
    this.width = 0;
    this.height = 0;
    this.imageEl = null;       // Loaded HTMLImageElement
  }
}

function detectTypeFromName(name) {
  const ext = name.split('.').pop().toLowerCase();
  const map = { jpg:'image/jpeg', jpeg:'image/jpeg', png:'image/png',
    webp:'image/webp', gif:'image/gif', bmp:'image/bmp',
    tiff:'image/tiff', tif:'image/tiff', svg:'image/svg+xml' };
  return map[ext] || 'image/png';
}

// ============================
// DOM References
// ============================
const $ = id => document.getElementById(id);
const $$ = sel => document.querySelectorAll(sel);

const dropZone        = $('drop-zone');
const fileInput       = $('file-input');
const fileGrid        = $('file-grid');
const fileQueueSec    = $('file-queue-section');
const fileCountBadge  = $('file-count-badge');
const qualitySlider   = $('quality-slider');
const qualityDisplay  = $('quality-display');
const dashboardSec    = $('dashboard-section');
const dashboardBody   = $('dashboard-body');
const compSec         = $('comparison-section');
const compSlider      = $('comp-slider');
const compAfter       = $('comp-after');
const compBefore      = $('comp-before');

// ============================
// Theme
// ============================
(function initTheme() {
  const saved = localStorage.getItem('imgconv-theme') || 'dark';
  if (saved === 'light') document.documentElement.setAttribute('data-theme','light');
  updateThemeIcon(saved);
})();

$('theme-toggle').addEventListener('click', () => {
  const isDark = !document.documentElement.hasAttribute('data-theme') ||
    document.documentElement.getAttribute('data-theme') !== 'light';
  const next = isDark ? 'light' : 'dark';
  if (next === 'light') {
    document.documentElement.setAttribute('data-theme','light');
  } else {
    document.documentElement.removeAttribute('data-theme');
  }
  localStorage.setItem('imgconv-theme', next);
  updateThemeIcon(next);
});

function updateThemeIcon(theme) {
  $('theme-icon-dark').style.display  = theme === 'dark'  ? '' : 'none';
  $('theme-icon-light').style.display = theme === 'light' ? '' : 'none';
}

// ============================
// Upload / File Handling
// ============================
function initUpload() {
  // Browse button
  $('browse-btn').addEventListener('click', () => fileInput.click());
  $('header-upload-btn').addEventListener('click', () => fileInput.click());
  fileInput.addEventListener('change', e => handleFiles(Array.from(e.target.files)));

  // Paste from clipboard
  const pasteBtn = $('paste-btn');
  if (!navigator.clipboard?.read) {
    pasteBtn.disabled = true;
    pasteBtn.title = 'Clipboard access requires HTTPS and a modern browser';
  }
  pasteBtn.addEventListener('click', async () => {
    if (!navigator.clipboard?.read) {
      return showToast('Clipboard paste not supported in this browser or context (requires HTTPS)', 'error');
    }
    try {
      const items = await navigator.clipboard.read();
      for (const item of items) {
        for (const type of item.types) {
          if (type.startsWith('image/')) {
            const blob = await item.getType(type);
            const file = new File([blob], `pasted-image.${type.split('/')[1]}`, { type });
            handleFiles([file]);
            return;
          }
        }
      }
      showToast('No image found in clipboard', 'error');
    } catch {
      showToast('Could not read clipboard', 'error');
    }
  });

  // Drag & Drop — attach to dropZone to prevent page-wide highlight on scroll
  dropZone.addEventListener('dragenter', e => { e.preventDefault(); dropZone.classList.add('dragover'); });
  dropZone.addEventListener('dragover', e => {
    e.preventDefault();
    dropZone.classList.add('dragover');
  });
  dropZone.addEventListener('dragleave', e => {
    if (!dropZone.contains(e.relatedTarget)) {
      dropZone.classList.remove('dragover');
    }
  });
  dropZone.addEventListener('drop', e => {
    e.preventDefault();
    dropZone.classList.remove('dragover');
    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/') || f.name.endsWith('.svg') || f.name.endsWith('.bmp') || f.name.endsWith('.tiff') || f.name.endsWith('.tif'));
    if (files.length) { handleFiles(files); showToast(`Uploaded ${files.length} file${files.length>1?'s':''}`, 'success'); }
  });

  // Click drop zone
  dropZone.addEventListener('click', e => {
    if (e.target === dropZone || dropZone.querySelector('.drop-zone-inner').contains(e.target)) {
      if (!e.target.closest('button')) fileInput.click();
    }
  });
  dropZone.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') fileInput.click(); });
}

async function handleFiles(files) {
  for (const file of files) {
    const entry = new FileEntry(file);
    state.files.push(entry);
    await loadImagePreview(entry);
  }
  renderFileGrid();
  updateFileCount();
  if (state.files.length > 0) {
    fileQueueSec.classList.remove('hidden');
  }
  updateCompressStats();
  updateConversionOverview();
  if (state.selectedFileIndex >= 0 && state.files.length > 0) {
    const sel = state.files[state.selectedFileIndex];
    if (sel.width && sel.height) { origW = sel.width; origH = sel.height; }
    loadMetadata(sel);
  }
  updateResizePreview();
}

async function loadImagePreview(entry) {
  return new Promise(resolve => {
    if (entry.type === 'image/svg+xml') {
      entry.preview = URL.createObjectURL(entry.file);
      resolve();
      return;
    }
    const reader = new FileReader();
    reader.onload = e => {
      const img = new Image();
      img.onload = () => {
        entry.width = img.naturalWidth;
        entry.height = img.naturalHeight;
        entry.imageEl = img;
        entry.preview = e.target.result;
        resolve();
      };
      img.onerror = () => { entry.preview = null; resolve(); };
      img.src = e.target.result;
    };
    reader.readAsDataURL(entry.file);
  });
}

// ============================
// Render File Grid
// ============================
function renderFileGrid() {
  fileGrid.innerHTML = '';
  state.files.forEach((entry, idx) => {
    const card = document.createElement('div');
    card.className = `file-card status-${entry.status}${idx === state.selectedFileIndex ? ' status-selected' : ''}`;
    card.setAttribute('role', 'listitem');
    card.dataset.id = entry.id;

    const thumb = entry.preview
      ? `<img class="file-thumb" src="${entry.preview}" alt="${escHtml(entry.name)}">`
      : `<div class="file-thumb-placeholder">🖼</div>`;

    const progress = entry.status === 'processing'
      ? `<div class="progress-bar-wrap"><div class="progress-bar" style="width:${entry.progress||0}%"></div></div>`
      : '';

    card.innerHTML = `
      <div class="file-card-actions">
        ${entry.status === 'complete' ? `<button class="file-action-btn file-download-btn" data-id="${entry.id}" title="Download" aria-label="Download ${escHtml(entry.name)}">↓</button>` : ''}
        <button class="file-action-btn" data-remove="${entry.id}" title="Remove" aria-label="Remove ${escHtml(entry.name)}">✕</button>
      </div>
      ${thumb}
      ${progress}
      <div class="file-info">
        <div class="file-name" title="${escHtml(entry.name)}">${escHtml(entry.name)}</div>
        <div class="file-meta">
          <span>${formatSize(entry.size)}</span>
          ${entry.width ? `<span>${entry.width}×${entry.height}</span>` : ''}
        </div>
        <span class="file-status ${entry.status}">${capitalize(entry.status)}</span>
        ${entry.status === 'complete' ? `<div class="file-meta" style="margin-top:0.2rem"><span style="color:var(--green-bright)">↓ ${formatSize(entry.outputSize)}</span></div>` : ''}
      </div>
    `;

    card.addEventListener('click', e => {
      if (e.target.closest('[data-remove]') || e.target.closest('.file-download-btn')) return;
      state.selectedFileIndex = idx;
      // Update origW/origH so resize lock-ratio and preview work immediately
      if (entry.width && entry.height) {
        origW = entry.width;
        origH = entry.height;
      }
      renderFileGrid();
      loadMetadata(entry);
      loadPalettePreview(entry);
      loadBase64(entry);
      loadSVGOptimizer(entry);
      updateResizePreview();
    });

    card.querySelector('[data-remove]')?.addEventListener('click', () => removeFile(entry.id));
    card.querySelector('.file-download-btn')?.addEventListener('click', () => downloadFile(entry));

    fileGrid.appendChild(card);
  });
}

function removeFile(id) {
  const file = state.files.find(f => f.id === id);
  if (file && file.preview && file.preview.startsWith('blob:')) {
    URL.revokeObjectURL(file.preview);
  }
  state.files = state.files.filter(f => f.id !== id);
  updateFileCount();
  if (state.files.length === 0) fileQueueSec.classList.add('hidden');
  if (state.selectedFileIndex >= state.files.length) state.selectedFileIndex = Math.max(0, state.files.length - 1);
  renderFileGrid();
  updateConversionOverview();
  updateCompressStats();
}

function updateFileCount() {
  fileCountBadge.textContent = state.files.length;
}

// ============================
// Conversion
// ============================
$('convert-all-btn').addEventListener('click', convertAll);

async function convertAll() {
  if (!state.files.length) return showToast('No files to convert', 'error');

  dashboardSec.classList.remove('hidden');
  const format   = state.outputFormat;
  const quality  = state.quality;
  const rMode    = resizeMode;
  const resizeW  = state.resizeWidth;
  const resizeH  = state.resizeHeight;
  const resizePct = state.resizePct || 100;
  const fitW     = state.resizeFitW;
  const fitH     = state.resizeFitH;

  for (const entry of state.files) {
    if (entry.status === 'complete') continue;
    entry.status = 'processing';
    entry.progress = 0;
    updateCard(entry);
    updateDashboardRow(entry, format);

    try {
      const blob = await convertFile(entry, format, quality, { rMode, resizeW, resizeH, resizePct, fitW, fitH });
      entry.outputBlob = blob;
      entry.outputSize = blob.size;
      entry.outputFormat = format;
      entry.status = 'complete';
      saveHistory(entry, format);
      updateComparisonView(entry);
    } catch(err) {
      entry.status = 'failed';
      console.error(err);
      showToast(`Failed: ${entry.name}${err.message ? ' — ' + err.message : ''}`, 'error');
    }
    updateCard(entry);
    updateDashboardRow(entry, format);
  }

  $('download-all-btn').disabled = false;
  renderFileGrid();
  renderDownloads();
  showToast('Conversion complete!', 'success');
  renderHistory();
}

async function convertFile(entry, format, quality, resize = {}) {
  return new Promise((resolve, reject) => {
    let prog = 0;
    const progInterval = setInterval(() => {
      prog = Math.min(prog + 15, 85);
      entry.progress = prog;
      updateCardProgress(entry);
    }, 80);

    requestAnimationFrame(async () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const { rMode, resizeW, resizeH, resizePct, fitW, fitH } = resize;

        // ── Helper: compute output w/h from source dimensions ──
        function calcDims(srcW, srcH) {
          let outW = srcW, outH = srcH;

          if (rMode === 'pct') {
            const scale = (resizePct || 100) / 100;
            outW = Math.round(srcW * scale);
            outH = Math.round(srcH * scale);
          } else if (rMode === 'fit') {
            if (fitW || fitH) {
              const scaleW = fitW ? fitW / srcW : Infinity;
              const scaleH = fitH ? fitH / srcH : Infinity;
              const scale  = Math.min(scaleW, scaleH); // allow upscale if explicitly requested
              outW = Math.max(1, Math.round(srcW * scale));
              outH = Math.max(1, Math.round(srcH * scale));
            }
          } else {
            // px mode
            if (resizeW && resizeH) {
              outW = resizeW; outH = resizeH;
            } else if (resizeW) {
              outW = resizeW;
              outH = lockRatio && srcH && srcW ? Math.round(resizeW * srcH / srcW) : srcH;
            } else if (resizeH) {
              outH = resizeH;
              outW = lockRatio && srcW && srcH ? Math.round(resizeH * srcW / srcH) : srcW;
            }
          }

          return { outW: Math.max(1, outW), outH: Math.max(1, outH) };
        }

        if (entry.type === 'image/svg+xml') {
          await new Promise((res, rej) => {
            const img = new Image();
            const svgUrl = URL.createObjectURL(entry.file);
            const cleanup = () => URL.revokeObjectURL(svgUrl);
            img.onload = () => {
              try {
                const srcW = img.naturalWidth  || 800;
                const srcH = img.naturalHeight || 600;
                const { outW, outH } = calcDims(srcW, srcH);
                canvas.width  = outW;
                canvas.height = outH;
                ctx.drawImage(img, 0, 0, outW, outH);
                cleanup(); res();
              } catch (drawErr) {
                cleanup();
                rej(new Error('SVG rendering failed. The SVG may contain external resources or unsupported filters.'));
              }
            };
            img.onerror = () => { cleanup(); rej(new Error('SVG could not be loaded.')); };
            img.src = svgUrl;
          });
        } else {
          const img = entry.imageEl || await loadImg(entry.file);
          const srcW = img.naturalWidth;
          const srcH = img.naturalHeight;
          const { outW, outH } = calcDims(srcW, srcH);

          canvas.width  = outW;
          canvas.height = outH;
          if (format === 'image/jpeg') { ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, outW, outH); }
          ctx.drawImage(img, 0, 0, outW, outH);
        }

        canvas.toBlob(blob => {
          clearInterval(progInterval);
          entry.progress = 100;
          if (blob) resolve(blob);
          else reject(new Error('Conversion failed — canvas.toBlob returned null'));
        }, format, format === 'image/png' ? undefined : quality);

      } catch (e) {
        clearInterval(progInterval);
        reject(e);
      }
    });
  });
}

function loadImg(file) {
  return new Promise((res, rej) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => { URL.revokeObjectURL(url); res(img); };
    img.onerror = rej;
    img.src = url;
  });
}

// ============================
// Download
// ============================
function downloadFile(entry) {
  if (!entry.outputBlob) return showToast('Convert the file first', 'error');
  const ext = entry.outputFormat.split('/')[1].replace('jpeg','jpg');
  const baseName = entry.name.split('.').slice(0,-1).join('.') || entry.name;
  const url = URL.createObjectURL(entry.outputBlob);
  triggerDownload(url, `${baseName}.${ext}`);
  URL.revokeObjectURL(url);
  showToast('Download started!', 'success');
}

function triggerDownload(url, filename) {
  const a = document.createElement('a');
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click();
  document.body.removeChild(a);
}

$('download-all-btn').addEventListener('click', async () => {
  const completed = state.files.filter(f => f.status === 'complete' && f.outputBlob);
  if (!completed.length) return showToast('No converted files yet', 'error');
  showToast('Packaging ZIP…', 'info');

  const zip = new JSZip();
  completed.forEach(entry => {
    const ext = entry.outputFormat.split('/')[1].replace('jpeg','jpg');
    const baseName = entry.name.split('.').slice(0,-1).join('.') || entry.name;
    zip.file(`${baseName}.${ext}`, entry.outputBlob);
  });
  const blob = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(blob);
  triggerDownload(url, 'converted-images.zip');
  URL.revokeObjectURL(url);
  showToast('ZIP ready! Download started.', 'success');
});

$('clear-all-btn').addEventListener('click', () => {
  // Revoke all preview object URLs to prevent memory leaks
  state.files.forEach(file => {
    if (file.preview && file.preview.startsWith('blob:')) URL.revokeObjectURL(file.preview);
  });
  if (currentComparisonUrl) { URL.revokeObjectURL(currentComparisonUrl); currentComparisonUrl = null; }
  state.files = [];
  renderFileGrid();
  updateFileCount();
  fileQueueSec.classList.add('hidden');
  dashboardSec.classList.add('hidden');
  compSec.classList.add('hidden');
  $('downloads-section').classList.add('hidden');
  dashboardBody.innerHTML = '';
  $('download-all-btn').disabled = true;
});

// ============================
// Quality Slider
// ============================
qualitySlider.addEventListener('input', () => {
  state.quality = parseInt(qualitySlider.value) / 100;
  qualityDisplay.textContent = `${qualitySlider.value}%`;
  updateCompressStats();
  updateConversionOverview();
});

// ============================
// Compress Module
// ============================
$$('.compress-mode-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    $$('.compress-mode-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const lvl = btn.dataset.level;
    const customWrap = $('custom-compress-wrap');
    if (lvl === 'custom') {
      customWrap.classList.remove('hidden');
    } else {
      customWrap.classList.add('hidden');
      state.compressLevel = parseFloat(lvl);
      qualitySlider.value = Math.round(state.compressLevel * 100);
      state.quality = state.compressLevel;
      qualityDisplay.textContent = `${Math.round(state.quality*100)}%`;
    }
    updateCompressStats();
  });
});

$('custom-quality').addEventListener('input', e => {
  const v = parseInt(e.target.value);
  $('custom-quality-val').textContent = `${v}%`;
  state.quality = v / 100;
  state.compressLevel = state.quality;
  qualitySlider.value = v;
  qualityDisplay.textContent = `${v}%`;
  updateCompressStats();
});

function updateCompressStats() {
  const selected = state.files[state.selectedFileIndex];
  if (!selected) { ['stat-original','stat-estimated','stat-savings'].forEach(id => $(id).textContent = '—'); return; }
  const orig = selected.size;
  const est = Math.round(orig * state.quality * 0.85);
  const saved = orig - est;
  const pct = orig ? Math.round((saved/orig)*100) : 0;
  $('stat-original').textContent = formatSize(orig);
  $('stat-estimated').textContent = formatSize(Math.max(est, 0));
  $('stat-savings').textContent = `${pct}%`;
}

function updateConversionOverview() {
  const el = $('conversion-overview');
  if (!state.files.length) {
    el.innerHTML = `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.3"><rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg><p>Upload files to see conversion details</p>`;
    el.className = 'conversion-overview-empty';
    return;
  }
  const ext = state.outputFormat.split('/')[1].replace('jpeg','jpg').toUpperCase();
  el.className = '';
  el.innerHTML = `<div class="compress-stats">
    <div class="stat-box"><div class="stat-label">Files</div><div class="stat-value">${state.files.length}</div></div>
    <div class="stat-box"><div class="stat-label">Total Size</div><div class="stat-value">${formatSize(state.files.reduce((s,f)=>s+f.size,0))}</div></div>
    <div class="stat-box"><div class="stat-label">Output</div><div class="stat-value">${ext}</div></div>
    <div class="stat-box"><div class="stat-label">Quality</div><div class="stat-value">${Math.round(state.quality*100)}%</div></div>
  </div>`;
}

// ============================
// Resize Module
// ============================
let lockRatio = true;
let origW = 0, origH = 0;
let resizeMode = 'px'; // 'px' | 'pct' | 'fit'

function debounce(fn, delay) {
  let timer;
  return (...args) => { clearTimeout(timer); timer = setTimeout(() => fn(...args), delay); };
}

// ── Mode tab switching ──
$$('.resize-mode-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    $$('.resize-mode-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    resizeMode = btn.dataset.mode;
    // Show correct body
    ['px','pct','fit'].forEach(m => {
      const el = $(`resize-mode-${m}`);
      if (el) el.style.display = m === resizeMode ? '' : 'none';
    });
    updateResizeState();
    updateResizePreview();
  });
});

// ── Lock ratio button ──
$('lock-ratio-btn').addEventListener('click', () => {
  lockRatio = !lockRatio;
  const btn = $('lock-ratio-btn');
  btn.classList.toggle('locked', lockRatio);
  btn.querySelector('.lock-icon-locked').style.display  = lockRatio  ? '' : 'none';
  btn.querySelector('.lock-icon-unlocked').style.display = !lockRatio ? '' : 'none';
  updateResizePreview();
});

// ── Pixel mode inputs ──
$('resize-width').addEventListener('input', debounce(e => {
  const val = parseInt(e.target.value) || null;
  state.resizeWidth = val;
  if (lockRatio && val && origW && origH) {
    const h = Math.round(val * origH / origW);
    $('resize-height').value = h;
    state.resizeHeight = h;
  }
  updateResizePreview();
}, 200));

$('resize-height').addEventListener('input', debounce(e => {
  const val = parseInt(e.target.value) || null;
  state.resizeHeight = val;
  if (lockRatio && val && origW && origH) {
    const w = Math.round(val * origW / origH);
    $('resize-width').value = w;
    state.resizeWidth = w;
  }
  updateResizePreview();
}, 200));

// ── Percentage mode slider ──
$('resize-pct').addEventListener('input', e => {
  const pct = parseInt(e.target.value);
  $('resize-pct-val').textContent = `${pct}%`;
  state.resizePct = pct;
  updateResizeState();
  updateResizePreview();
});

// ── Fit mode inputs ──
$('resize-fit-w').addEventListener('input', debounce(e => {
  state.resizeFitW = parseInt(e.target.value) || null;
  updateResizeState();
  updateResizePreview();
}, 200));
$('resize-fit-h').addEventListener('input', debounce(e => {
  state.resizeFitH = parseInt(e.target.value) || null;
  updateResizeState();
  updateResizePreview();
}, 200));

// ── Presets ──
$$('.preset-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const w = parseInt(btn.dataset.w);
    const h = parseInt(btn.dataset.h);
    // Switch to px mode
    $$('.resize-mode-btn').forEach(b => b.classList.remove('active'));
    document.querySelector('.resize-mode-btn[data-mode="px"]').classList.add('active');
    resizeMode = 'px';
    ['px','pct','fit'].forEach(m => {
      const el = $(`resize-mode-${m}`);
      if (el) el.style.display = m === 'px' ? '' : 'none';
    });
    // Fill inputs
    $('resize-width').value = w;
    $('resize-height').value = h;
    state.resizeWidth = w;
    state.resizeHeight = h;
    // Disable lock for presets (explicit W+H)
    lockRatio = false;
    const lockBtn = $('lock-ratio-btn');
    lockBtn.classList.remove('locked');
    lockBtn.querySelector('.lock-icon-locked').style.display  = 'none';
    lockBtn.querySelector('.lock-icon-unlocked').style.display = '';
    updateResizeState();
    updateResizePreview();
    showToast(`Preset: ${w}×${h}`, 'info');
  });
});

// ── Reset ──
$('resize-reset-btn').addEventListener('click', () => {
  // Clear all inputs
  $('resize-width').value = '';
  $('resize-height').value = '';
  $('resize-pct').value = 100;
  $('resize-pct-val').textContent = '100%';
  $('resize-fit-w').value = '';
  $('resize-fit-h').value = '';
  state.resizeWidth = null;
  state.resizeHeight = null;
  state.resizePct = 100;
  state.resizeFitW = null;
  state.resizeFitH = null;
  updateResizeState();
  updateResizePreview();
  showToast('Resize cleared — original dimensions will be used', 'info');
});

// ── Sync state from current mode ──
function updateResizeState() {
  if (resizeMode === 'px') {
    // already updated inline
  } else if (resizeMode === 'pct') {
    // resizePct is set by the slider
  } else if (resizeMode === 'fit') {
    // resizeFitW/H set inline
  }
}

// ── Live preview of output dimensions ──
function updateResizePreview() {
  const previewDims = $('resize-preview-dims');
  const previewSrc  = $('resize-preview-source');
  if (!previewDims) return;

  const sel = state.files[state.selectedFileIndex];
  const srcW = (sel && sel.width)  || origW || 0;
  const srcH = (sel && sel.height) || origH || 0;

  if (!srcW || !srcH) {
    previewDims.textContent = '—';
    previewSrc.textContent  = 'Upload an image to preview';
    return;
  }

  let outW = srcW, outH = srcH;

  if (resizeMode === 'px') {
    const rw = state.resizeWidth;
    const rh = state.resizeHeight;
    if (rw && rh) {
      outW = rw; outH = rh;
    } else if (rw) {
      outW = rw;
      outH = lockRatio ? Math.round(rw * srcH / srcW) : srcH;
    } else if (rh) {
      outH = rh;
      outW = lockRatio ? Math.round(rh * srcW / srcH) : srcW;
    }
  } else if (resizeMode === 'pct') {
    const pct = (state.resizePct || 100) / 100;
    outW = Math.round(srcW * pct);
    outH = Math.round(srcH * pct);
  } else if (resizeMode === 'fit') {
    const fw = state.resizeFitW;
    const fh = state.resizeFitH;
    if (fw || fh) {
      const scaleW = fw ? fw / srcW : Infinity;
      const scaleH = fh ? fh / srcH : Infinity;
      const scale  = Math.min(scaleW, scaleH, 1); // never upscale unless both set
      outW = Math.round(srcW * scale);
      outH = Math.round(srcH * scale);
    }
  }

  const changed = outW !== srcW || outH !== srcH;
  previewDims.textContent = `${outW} × ${outH} px`;
  previewDims.style.color = changed ? 'var(--accent)' : 'var(--text-2)';
  previewSrc.textContent  = changed
    ? `(original: ${srcW} × ${srcH})`
    : `(no resize — using original)`;
}

// ============================
// Output Format
// ============================
$$('[name="output-format"]').forEach(radio => {
  radio.addEventListener('change', e => {
    state.outputFormat = e.target.value;
    updateConversionOverview();
    // Show/hide PNG lossless note
    const note = $('quality-png-note');
    const slider = $('quality-slider');
    if (note && slider) {
      const isPng = e.target.value === 'image/png';
      note.style.display = isPng ? '' : 'none';
      slider.disabled = isPng;
    }
  });
});

// ============================
// Metadata Viewer
// ============================
async function loadMetadata(entry) {
  const display = $('metadata-display');
  if (!entry || !entry.file) {
    display.innerHTML = '<p class="empty-state">Select an image to view metadata</p>';
    return;
  }

  const meta = [];
  meta.push(['File Name', entry.name]);
  meta.push(['File Size', formatSize(entry.size)]);
  meta.push(['MIME Type', entry.type]);
  if (entry.width) meta.push(['Dimensions', `${entry.width} × ${entry.height} px`]);
  const ext = entry.name.split('.').pop().toLowerCase();
  meta.push(['Format', ext.toUpperCase()]);
  meta.push(['Color Mode', entry.type === 'image/png' ? 'RGBA/RGB' : 'RGB']);
  meta.push(['Last Modified', new Date(entry.file.lastModified).toLocaleString()]);

  // Attempt basic EXIF read for JPEG
  if ((entry.type === 'image/jpeg' || entry.type === 'image/jpg') && entry.file.size < 20 * 1024 * 1024) {
    try {
      const exif = await readBasicExif(entry.file);
      if (exif) Object.entries(exif).forEach(([k,v]) => meta.push([k, v]));
    } catch {}
  }

  display.innerHTML = meta.map(([k,v]) =>
    `<div class="meta-row"><span class="meta-key">${escHtml(k)}</span><span class="meta-val">${escHtml(String(v))}</span></div>`
  ).join('');

  // Update for currently selected
  origW = entry.width;
  origH = entry.height;
  if (entry.width && !$('resize-width').value) {
    $('resize-width').value = entry.width;
    $('resize-height').value = entry.height;
  }
}

async function readBasicExif(file) {
  const buf = await file.slice(0, 64 * 1024).arrayBuffer();
  const view = new DataView(buf);
  const exif = {};

  if (view.getUint16(0) !== 0xFFD8) return null;

  let offset = 2;
  while (offset < view.byteLength - 2) {
    const marker = view.getUint16(offset);
    if (marker === 0xFFE1) {
      const len = view.getUint16(offset + 2);
      try {
        const seg = new Uint8Array(buf, offset + 4, len - 2);
        const str = String.fromCharCode.apply(null, seg.slice(0,4));
        if (str === 'Exif') {
          const start = offset + 10;
          const little = view.getUint16(start) === 0x4949;
          const tiffView = new DataView(buf, start);
          const ifdOffset = tiffView.getUint32(4, little);
          const count = tiffView.getUint16(ifdOffset, little);
          for (let i = 0; i < count; i++) {
            const ent = ifdOffset + 2 + i * 12;
            const tag = tiffView.getUint16(ent, little);
            const type = tiffView.getUint16(ent+2, little);
            const val = tiffView.getUint32(ent+8, little);
            if (tag === 0x0110) exif['Camera Model'] = readString(tiffView, val, 64);
            if (tag === 0x013B) exif['Artist'] = readString(tiffView, val, 64);
            if (tag === 0x8827) exif['ISO'] = val;
            if (tag === 0x9003) exif['Date Taken'] = readString(tiffView, val, 20);
          }
        }
      } catch {}
      break;
    }
    if (!(marker >= 0xFF00 && marker <= 0xFFFF)) break;
    offset += 2 + view.getUint16(offset + 2);
  }
  return Object.keys(exif).length ? exif : null;
}

function readString(view, offset, maxLen) {
  let s = '';
  for (let i = 0; i < maxLen; i++) {
    const c = view.getUint8(offset + i);
    if (c === 0) break;
    s += String.fromCharCode(c);
  }
  return s;
}

// ============================
// Metadata Remover
// ============================
$('remove-metadata-btn').addEventListener('click', async () => {
  const entry = state.files[state.selectedFileIndex];
  if (!entry) return showToast('Please select an image first', 'error');

  const removeExif     = $('rm-exif')?.checked     !== false;
  const removeGPS      = $('rm-gps')?.checked      !== false;
  const removeCamInfo  = $('rm-camera')?.checked   !== false;

  const removingAll = removeExif && removeGPS && removeCamInfo;
  const removingAny = removeExif || removeGPS || removeCamInfo;

  if (!removingAny) return showToast('Select at least one metadata type to remove', 'error');

  showToast('Removing metadata…', 'info');
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const img = entry.imageEl || await loadImg(entry.file);
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  if (entry.type === 'image/jpeg') { ctx.fillStyle = '#fff'; ctx.fillRect(0,0,canvas.width,canvas.height); }
  ctx.drawImage(img, 0, 0);
  // Canvas re-draw strips all EXIF/GPS/camera metadata by design.
  // Selective removal is noted in filename for user clarity.
  const suffix = removingAll ? '_clean' : (removeGPS ? '_nogps' : '_partial');
  canvas.toBlob(blob => {
    const ext = entry.type.split('/')[1].replace('jpeg','jpg');
    const name = entry.name.split('.').slice(0,-1).join('.') || entry.name;
    const url = URL.createObjectURL(blob);
    triggerDownload(url, `${name}${suffix}.${ext}`);
    URL.revokeObjectURL(url);
    showToast('Metadata removed! Download started.', 'success');
  }, entry.type, 0.95);
});

// ============================
// Color Palette Extractor
// ============================
function loadPalettePreview(entry) {
  const imgWrap = $('palette-image-preview');
  if (entry.preview) {
    imgWrap.innerHTML = `<img src="${entry.preview}" alt="Preview" style="width:100%;border-radius:6px;">`;
  } else {
    imgWrap.innerHTML = '';
  }
}

$('extract-palette-btn').addEventListener('click', () => {
  const entry = state.files[state.selectedFileIndex];
  if (!entry || !entry.imageEl) return showToast('Please select an image first', 'error');
  extractPalette(entry);
});

function extractPalette(entry) {
  const img = entry.imageEl;
  const canvas = document.createElement('canvas');
  const size = 100; // Downscale for speed
  canvas.width = size;
  canvas.height = Math.round(size * img.naturalHeight / img.naturalWidth);
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
  const colorMap = {};
  const step = 4; // Sample every Nth pixel

  for (let i = 0; i < data.length; i += 4 * step) {
    const r = Math.round(data[i] / 32) * 32;
    const g = Math.round(data[i+1] / 32) * 32;
    const b = Math.round(data[i+2] / 32) * 32;
    const a = data[i+3];
    if (a < 128) continue;
    const key = `${r},${g},${b}`;
    colorMap[key] = (colorMap[key] || 0) + 1;
  }

  const sorted = Object.entries(colorMap).sort((a,b) => b[1]-a[1]).slice(0, 8);
  const container = $('palette-colors');

  container.innerHTML = sorted.map(([rgb]) => {
    const [r,g,b] = rgb.split(',').map(Number);
    const hex = '#' + [r,g,b].map(v => v.toString(16).padStart(2,'0')).join('');
    return `
      <div class="palette-row">
        <div class="palette-swatch" style="background:${hex}"></div>
        <div class="palette-codes">
          <div class="palette-hex">${hex.toUpperCase()}</div>
          <div class="palette-rgb">rgb(${r}, ${g}, ${b})</div>
        </div>
        <button class="palette-copy-btn" data-hex="${hex}" title="Copy HEX">Copy</button>
      </div>`;
  }).join('');

  container.querySelectorAll('.palette-copy-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      navigator.clipboard.writeText(btn.dataset.hex).then(() => showToast('Color copied!', 'success'));
    });
  });

  showToast('Palette extracted!', 'success');
}

// ============================
// Base64 Module
// ============================
function loadBase64(entry) {
  // Auto-populate if on base64 tab
  const panel = $('panel-base64');
  if (panel.classList.contains('active')) genBase64(entry, false);
}

$('gen-base64-btn').addEventListener('click', () => {
  const entry = state.files[state.selectedFileIndex];
  if (!entry) return showToast('Please select an image first', 'error');
  genBase64(entry, false);
});

$('gen-datauri-btn').addEventListener('click', () => {
  const entry = state.files[state.selectedFileIndex];
  if (!entry) return showToast('Please select an image first', 'error');
  genBase64(entry, true);
});

function genBase64(entry, asDataURI) {
  const reader = new FileReader();
  reader.onload = e => {
    const dataURI = e.target.result;
    if (asDataURI) {
      $('base64-output').value = dataURI;
    } else {
      $('base64-output').value = dataURI.split(',')[1] || dataURI;
    }
    showToast(asDataURI ? 'Data URI generated!' : 'Base64 generated!', 'success');
  };
  reader.readAsDataURL(entry.file);
}

$('copy-base64-btn').addEventListener('click', () => {
  const val = $('base64-output').value;
  if (!val) return showToast('Nothing to copy', 'error');
  navigator.clipboard.writeText(val).then(() => showToast('Copied to clipboard!', 'success'));
});

$('decode-base64-btn').addEventListener('click', () => {
  const input = $('base64-input').value.trim();
  if (!input) return showToast('Paste a Base64 string first', 'error');

  let src = input;
  if (!src.startsWith('data:')) src = `data:image/png;base64,${src}`;

  const preview = $('base64-decoded-preview');
  preview.innerHTML = '';
  const img = document.createElement('img');
  img.alt = 'Decoded image';
  img.onerror = () => { preview.innerHTML = '<p style="color:var(--red)">Invalid Base64 data</p>'; };
  img.src = src;
  const dlBtn = document.createElement('button');
  dlBtn.className = 'btn-primary';
  dlBtn.style.marginTop = '0.5rem';
  dlBtn.textContent = 'Download Image';
  dlBtn.dataset.src = src;
  dlBtn.addEventListener('click', () => {
    triggerDownload(dlBtn.dataset.src, 'decoded-image.png');
    showToast('Download started!', 'success');
  });
  preview.appendChild(img);
  preview.appendChild(document.createElement('br'));
  preview.appendChild(dlBtn);
  preview.classList.remove('hidden');
  showToast('Image decoded!', 'success');
});

// ============================
// SVG Optimizer
// ============================
function loadSVGOptimizer(entry) {
  if (entry && entry.type === 'image/svg+xml') {
    // Auto-optimze indicator
    $('svg-original-size').textContent = formatSize(entry.size);
    $('svg-opt-size').textContent = '—';
    $('svg-reduction').textContent = '—';
  }
}

$('optimize-svg-btn').addEventListener('click', async () => {
  const entry = state.files.find(f => f.type === 'image/svg+xml');
  if (!entry) return showToast('Please upload an SVG file first', 'error');

  const text = await entry.file.text();
  const originalBytes = entry.size; // Use actual File.size for accurate byte count

  let optimized = text
    .replace(/<!--[\s\S]*?-->/g, '')           // Remove comments
    .replace(/<metadata[\s\S]*?<\/metadata>/g,'')  // Remove metadata
    .replace(/<title>[\s\S]*?<\/title>/g,'')   // Remove title
    .replace(/<desc>[\s\S]*?<\/desc>/g,'')     // Remove desc
    .replace(/\s{2,}/g,' ')                    // Collapse whitespace
    .replace(/>\s+</g,'><')                    // Remove whitespace between tags
    .replace(/\s+\/>/g,'/>')                   // Clean self-closing tags
    .trim();

  // Only strip id="" attributes that are NOT referenced by url(#...) elsewhere
  optimized = optimized.replace(/ id="([^"]*?)"/g, (match, id) => {
    const urlRef = new RegExp('url\\(#' + id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\)');
    const hrefRef = new RegExp('[Hh]ref=["\']#' + id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '["\']');
    if (urlRef.test(optimized) || hrefRef.test(optimized)) return match; // Keep referenced IDs
    return '';
  });

  const optimizedBytes = new Blob([optimized]).size;
  const reduction = Math.round((1 - optimizedBytes / originalBytes) * 100);

  $('svg-original-size').textContent = formatSize(originalBytes);
  $('svg-opt-size').textContent = formatSize(optimizedBytes);
  $('svg-reduction').textContent = `${reduction}%`;
  $('svg-output').value = optimized;

  showToast(`SVG optimized! Saved ${reduction}%`, 'success');
});

$('copy-svg-btn').addEventListener('click', () => {
  const val = $('svg-output').value;
  if (!val) return showToast('Nothing to copy', 'error');
  navigator.clipboard.writeText(val).then(() => showToast('SVG copied!', 'success'));
});

$('download-svg-btn').addEventListener('click', () => {
  const val = $('svg-output').value;
  if (!val) return showToast('Optimize an SVG first', 'error');
  const entry = state.files.find(f => f.type === 'image/svg+xml');
  const baseName = entry
    ? (entry.name.split('.').slice(0,-1).join('.') || entry.name)
    : 'optimized';
  const blob = new Blob([val], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);
  triggerDownload(url, `${baseName}-optimized.svg`);
  URL.revokeObjectURL(url);
  showToast('Download started!', 'success');
});

// ============================
// Before/After Comparison
// ============================
let currentComparisonUrl = null;

function updateComparisonView(entry) {
  if (!entry.outputBlob || !entry.preview) return;
  compSec.classList.remove('hidden');
  $('comp-before-img').src = entry.preview;
  if (currentComparisonUrl) URL.revokeObjectURL(currentComparisonUrl);
  currentComparisonUrl = URL.createObjectURL(entry.outputBlob);
  $('comp-after-img').src = currentComparisonUrl;

  // Set container height
  const container = document.querySelector('.comparison-container');
  const beforeImg = $('comp-before-img');
  beforeImg.onload = () => {
    const ratio = beforeImg.naturalHeight / beforeImg.naturalWidth;
    container.style.paddingBottom = `${Math.min(ratio * 100, 60)}%`;
  };
}

// Comparison slider
let isDragging = false;
const compContainer = document.querySelector('.comparison-container');

function handleCompSlider(e) {
  if (!isDragging) return;
  const rect = compContainer.getBoundingClientRect();
  const x = (e.clientX || e.touches?.[0]?.clientX || 0) - rect.left;
  const pct = Math.max(0, Math.min(100, (x / rect.width) * 100));
  compSlider.style.left = `${pct}%`;
  compAfter.style.clipPath = `inset(0 ${100-pct}% 0 0)`;
}

compSlider.addEventListener('mousedown', () => isDragging = true);
compSlider.addEventListener('touchstart', () => isDragging = true);
document.addEventListener('mouseup', () => isDragging = false);
document.addEventListener('touchend', () => isDragging = false);
document.addEventListener('mousemove', handleCompSlider);
document.addEventListener('touchmove', handleCompSlider, { passive: true });
compContainer?.addEventListener('click', e => {
  const rect = compContainer.getBoundingClientRect();
  const pct = ((e.clientX - rect.left) / rect.width) * 100;
  compSlider.style.left = `${pct}%`;
  compAfter.style.clipPath = `inset(0 ${100-pct}% 0 0)`;
});

// Keyboard accessibility for comparison slider
compSlider.setAttribute('tabindex', '0');
compSlider.setAttribute('role', 'slider');
compSlider.setAttribute('aria-label', 'Before/After comparison slider');
compSlider.setAttribute('aria-valuemin', '0');
compSlider.setAttribute('aria-valuemax', '100');
compSlider.setAttribute('aria-valuenow', '50');
compSlider.addEventListener('keydown', e => {
  const step = e.shiftKey ? 10 : 2;
  const current = parseFloat(compSlider.style.left) || 50;
  let next = current;
  if (e.key === 'ArrowLeft')  { next = Math.max(0,   current - step); e.preventDefault(); }
  if (e.key === 'ArrowRight') { next = Math.min(100, current + step); e.preventDefault(); }
  if (e.key === 'Home')       { next = 0;   e.preventDefault(); }
  if (e.key === 'End')        { next = 100; e.preventDefault(); }
  if (next !== current) {
    compSlider.style.left = `${next}%`;
    compAfter.style.clipPath = `inset(0 ${100-next}% 0 0)`;
    compSlider.setAttribute('aria-valuenow', Math.round(next));
  }
});

// ============================
// Downloads Section
// ============================
function renderDownloads() {
  const completed = state.files.filter(f => f.status === 'complete' && f.outputBlob);
  const section = $('downloads-section');
  const grid = $('downloads-grid');
  const badge = $('dl-count-badge');

  if (!completed.length) { section.classList.add('hidden'); return; }

  section.classList.remove('hidden');
  badge.textContent = completed.length;

  grid.innerHTML = '';
  completed.forEach(entry => {
    const ext = entry.outputFormat.split('/')[1].replace('jpeg','jpg');
    const savings = entry.outputSize
      ? Math.round((1 - entry.outputSize / entry.size) * 100)
      : 0;

    const card = document.createElement('div');
    card.className = 'download-card';

    const thumb = entry.preview
      ? `<img class="download-card-thumb" src="${entry.preview}" alt="${escHtml(entry.name)}">`
      : `<div class="download-card-thumb-placeholder">🖼</div>`;

    card.innerHTML = `
      ${thumb}
      <div class="download-card-body">
        <div class="download-card-name" title="${escHtml(entry.name)}">${escHtml(entry.name.split('.').slice(0,-1).join('.'))}.${ext}</div>
        <div class="download-card-meta">
          <span class="download-badge">${ext.toUpperCase()}</span>
          <span class="download-size-info">
            <span>${formatSize(entry.size)}</span>
            <span>→</span>
            <span>${formatSize(entry.outputSize)}</span>
          </span>
          ${savings > 0 ? `<span class="download-savings">-${savings}%</span>` : ''}
        </div>
        <button class="download-card-btn" data-id="${entry.id}">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          Download
        </button>
      </div>
    `;

    card.querySelector('.download-card-btn').addEventListener('click', () => downloadFile(entry));
    grid.appendChild(card);
  });
}

$('dl-zip-btn').addEventListener('click', async () => {
  const completed = state.files.filter(f => f.status === 'complete' && f.outputBlob);
  if (!completed.length) return showToast('No converted files yet', 'error');
  showToast('Packaging ZIP…', 'info');
  const zip = new JSZip();
  completed.forEach(entry => {
    const ext = entry.outputFormat.split('/')[1].replace('jpeg','jpg');
    const baseName = entry.name.split('.').slice(0,-1).join('.') || entry.name;
    zip.file(`${baseName}.${ext}`, entry.outputBlob);
  });
  const blob = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(blob);
  triggerDownload(url, 'converted-images.zip');
  URL.revokeObjectURL(url);
  showToast('ZIP ready! Download started.', 'success');
});

$('dl-all-individual-btn').addEventListener('click', () => {
  const completed = state.files.filter(f => f.status === 'complete' && f.outputBlob);
  if (!completed.length) return showToast('No converted files yet', 'error');
  completed.forEach((entry, i) => {
    setTimeout(() => downloadFile(entry), i * 300);
  });
  showToast(`Downloading ${completed.length} files…`, 'success');
});


function updateDashboardRow(entry, format) {
  const ext = format.split('/')[1].replace('jpeg','jpg').toUpperCase();
  let row = dashboardBody.querySelector(`[data-id="${entry.id}"]`);
  if (!row) {
    row = document.createElement('tr');
    row.dataset.id = entry.id;
    dashboardBody.appendChild(row);
  }
  const savings = entry.outputSize
    ? Math.round((1 - entry.outputSize / entry.size) * 100)
    : '—';
  row.innerHTML = `
    <td title="${escHtml(entry.name)}" style="max-width:180px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${escHtml(entry.name)}</td>
    <td>${formatSize(entry.size)}</td>
    <td>${entry.outputSize ? formatSize(entry.outputSize) : '—'}</td>
    <td style="color:var(--green-bright)">${typeof savings === 'number' ? savings + '%' : savings}</td>
    <td>${ext}</td>
    <td><span class="status-pill ${entry.status}">${capitalize(entry.status)}</span></td>
    <td>${entry.status === 'complete' ? `<button class="btn-ghost btn-sm dashboard-save-btn" data-id="${entry.id}">↓ Save</button>` : '—'}</td>
  `;
}

function updateCard(entry) {
  const card = fileGrid.querySelector(`[data-id="${entry.id}"]`);
  if (!card) return;
  card.className = `file-card status-${entry.status}`;
  const statusEl = card.querySelector('.file-status');
  if (statusEl) {
    statusEl.className = `file-status ${entry.status}`;
    statusEl.textContent = capitalize(entry.status);
  }
}

function updateCardProgress(entry) {
  const card = fileGrid.querySelector(`[data-id="${entry.id}"]`);
  if (!card) return;
  const bar = card.querySelector('.progress-bar');
  if (bar) bar.style.width = `${entry.progress}%`;
}

// ============================
// History
// ============================
function saveHistory(entry, format) {
  const ext = format.split('/')[1].replace('jpeg','jpg').toUpperCase();
  state.history.unshift({
    name: entry.name,
    date: new Date().toLocaleString(),
    format: ext,
    originalSize: entry.size,
    outputSize: entry.outputSize,
  });
  if (state.history.length > 50) state.history = state.history.slice(0, 50);
  try { localStorage.setItem('imgconv-history', JSON.stringify(state.history)); } catch {}
  renderHistory();
}

function loadHistory() {
  try {
    const saved = localStorage.getItem('imgconv-history');
    if (saved) state.history = JSON.parse(saved);
  } catch {}
  renderHistory();
}

function renderHistory() {
  const list = $('history-list');
  $('history-count').textContent = state.history.length;
  if (!state.history.length) {
    list.innerHTML = '<p class="empty-state">No conversions yet</p>';
    return;
  }
  list.innerHTML = state.history.map(h => `
    <div class="history-row">
      <span class="history-name" title="${escHtml(h.name)}">${escHtml(h.name)}</span>
      <span class="history-date">${escHtml(h.date)}</span>
      <span class="history-format">${escHtml(h.format)}</span>
    </div>
  `).join('');
}

$('clear-history-btn').addEventListener('click', () => {
  state.history = [];
  localStorage.removeItem('imgconv-history');
  renderHistory();
  showToast('History cleared', 'info');
});

// ============================
// Tab Switching
// ============================
function initTabs() {
  // Mobile nav drawer
  const mobileMenuBtn = $('mobile-menu-btn');
  const mobileNavDrawer = $('mobile-nav-drawer');
  const mobileNavClose = $('mobile-nav-close');
  const mobileNavOverlay = $('mobile-nav-overlay');

  function openMobileNav() {
    mobileNavDrawer.classList.remove('hidden');
    mobileMenuBtn.setAttribute('aria-expanded', 'true');
  }
  function closeMobileNav() {
    mobileNavDrawer.classList.add('hidden');
    mobileMenuBtn.setAttribute('aria-expanded', 'false');
  }
  mobileMenuBtn?.addEventListener('click', openMobileNav);
  mobileNavClose?.addEventListener('click', closeMobileNav);
  mobileNavOverlay?.addEventListener('click', closeMobileNav);

  // Mobile nav links
  $$('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const tab = link.dataset.tab;
      document.querySelector(`.tab-btn[data-tab="${tab}"]`)?.click();
      $('tools-section').scrollIntoView({ behavior: 'smooth', block: 'start' });
      closeMobileNav();
    });
  });

  const tabBtns = $$('.tab-btn');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-selected','false'); });
      btn.classList.add('active');
      btn.setAttribute('aria-selected','true');
      const tab = btn.dataset.tab;
      $$('.tool-panel').forEach(p => { p.classList.remove('active'); p.setAttribute('aria-hidden','true'); });
      const panel = $(`panel-${tab}`);
      if (panel) { panel.classList.add('active'); panel.removeAttribute('aria-hidden'); }

      // Sync nav links
      $$('.nav-link').forEach(l => l.classList.remove('active'));
      document.querySelector(`.nav-link[data-tab="${tab}"]`)?.classList.add('active');

      if (tab === 'metadata' && state.files.length) loadMetadata(state.files[state.selectedFileIndex]);
      if (tab === 'palette' && state.files.length) loadPalettePreview(state.files[state.selectedFileIndex]);
      if (tab === 'history') renderHistory();
    });
  });

  // Nav link tab switching
  $$('.nav-link').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const tab = link.dataset.tab;
      document.querySelector(`.tab-btn[data-tab="${tab}"]`)?.click();
      $('tools-section').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

// ============================
// Toast Notifications
// ============================
const toastIcons = { success: '✓', error: '✕', info: 'ℹ' };

function showToast(message, type = 'info') {
  const container = $('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span>${toastIcons[type] || '•'}</span><span>${escHtml(message)}</span>`;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3200);
}

// ============================
// Keyboard Shortcuts
// ============================
function initShortcuts() {
  document.addEventListener('keydown', e => {
    if (e.target.matches('input,textarea,select')) return;
    if (e.key === '?') { $('shortcuts-modal').classList.remove('hidden'); return; }
    if (e.ctrlKey || e.metaKey) {
      if (e.key === 'u') { e.preventDefault(); fileInput.click(); }
      if (e.key === 'Enter') { e.preventDefault(); convertAll(); }
      if (e.key === 'd') { e.preventDefault(); $('download-all-btn').click(); }
    }
  });
  $('show-shortcuts-btn').addEventListener('click', () => $('shortcuts-modal').classList.remove('hidden'));
  $('close-shortcuts').addEventListener('click', () => $('shortcuts-modal').classList.add('hidden'));
  $('shortcuts-modal').addEventListener('click', e => {
    if (e.target === $('shortcuts-modal')) $('shortcuts-modal').classList.add('hidden');
  });
}

// ============================
// PWA
// ============================
function initPWA() {
  window.addEventListener('beforeinstallprompt', e => {
    e.preventDefault();
    state.deferredPrompt = e;
    const banner = $('pwa-banner');
    if (!localStorage.getItem('pwa-dismissed')) banner.classList.remove('hidden');
  });

  $('pwa-install-btn').addEventListener('click', async () => {
    if (!state.deferredPrompt) return;
    state.deferredPrompt.prompt();
    const { outcome } = await state.deferredPrompt.userChoice;
    if (outcome === 'accepted') showToast('App installed!', 'success');
    state.deferredPrompt = null;
    $('pwa-banner').classList.add('hidden');
  });

  $('pwa-dismiss-btn').addEventListener('click', () => {
    $('pwa-banner').classList.add('hidden');
    localStorage.setItem('pwa-dismissed', '1');
  });

  // Register SW
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js').catch(() => {});
  }
}

// ============================
// Helpers
// ============================
function formatSize(bytes) {
  if (!bytes) return '0 B';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024*1024) return `${(bytes/1024).toFixed(1)} KB`;
  return `${(bytes/(1024*1024)).toFixed(2)} MB`;
}

function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function escHtml(s) {
  return String(s)
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;')
    .replace(/'/g,'&#39;');
}

// Delegated event listener for dashboard save buttons (avoids inline onclick / CSP issues)
dashboardBody.addEventListener('click', e => {
  const btn = e.target.closest('.dashboard-save-btn');
  if (!btn) return;
  const entry = state.files.find(f => f.id === btn.dataset.id);
  if (entry) downloadFile(entry);
});

// ============================
// Init
// ============================
(function init() {
  initUpload();
  initTabs();
  initShortcuts();
  initPWA();
  loadHistory();

  // Initialize PNG quality note (PNG is default)
  const note = $('quality-png-note');
  const slider = $('quality-slider');
  if (note && slider) {
    note.style.display = '';   // PNG selected by default
    slider.disabled = true;
  }

  // Comparison container placeholder height
  const container = document.querySelector('.comparison-container');
  if (container) container.style.paddingBottom = '40%';
})();