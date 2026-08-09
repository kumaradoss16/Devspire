/* Code Window actions — copy & download for .code-window blocks */
(function () {
  function getCodeEl(windowEl) {
    return windowEl.querySelector('pre code');
  }

  function getFilename(windowEl) {
    var pill = windowEl.querySelector('.code-window-title-pill span');
    return (pill ? pill.textContent.trim() : 'snippet') || 'snippet';
  }

  async function copyCode(btn, windowEl) {
    var codeEl = getCodeEl(windowEl);
    if (!codeEl) return;
    var text = codeEl.textContent;
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(text);
      } else {
        var ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
      btn.classList.add('copied');
      var original = btn.getAttribute('data-tooltip');
      btn.setAttribute('data-tooltip', 'Copied!');
      setTimeout(function () {
        btn.classList.remove('copied');
        btn.setAttribute('data-tooltip', original);
      }, 1500);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  }

  function downloadCode(windowEl) {
    var codeEl = getCodeEl(windowEl);
    if (!codeEl) return;
    var text = codeEl.textContent;
    var filename = getFilename(windowEl);
    var blob = new Blob([text], { type: 'text/plain' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function init() {
    document.querySelectorAll('.code-window').forEach(function (windowEl) {
      var copyBtn = windowEl.querySelector('[data-action="copy"]');
      var downloadBtn = windowEl.querySelector('[data-action="download"]');

      if (copyBtn) {
        copyBtn.addEventListener('click', function () {
          copyCode(copyBtn, windowEl);
        });
      }
      if (downloadBtn) {
        downloadBtn.addEventListener('click', function () {
          downloadCode(windowEl);
        });
      }
      // "share" and "add" buttons are left as extension points —
      // wire them to your own handlers via [data-action="share"] / [data-action="add"]
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
