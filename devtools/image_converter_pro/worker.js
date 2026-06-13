// worker.js — Image Converter Pro Web Worker
// Handles image conversion off the main thread

self.onmessage = async function(e) {
  const { id, file, format, quality, resizeW, resizeH } = e.data;

  try {
    // Use OffscreenCanvas if available
    if (typeof OffscreenCanvas === 'undefined') {
      self.postMessage({ id, error: 'OffscreenCanvas not supported, using main thread' });
      return;
    }

    const bitmap = await createImageBitmap(file);
    let w = bitmap.width;
    let h = bitmap.height;

    if (resizeW && resizeH) { w = resizeW; h = resizeH; }
    else if (resizeW) { h = Math.round(bitmap.height * resizeW / bitmap.width); w = resizeW; }
    else if (resizeH) { w = Math.round(bitmap.width * resizeH / bitmap.height); h = resizeH; }

    const canvas = new OffscreenCanvas(w, h);
    const ctx = canvas.getContext('2d');

    if (format === 'image/jpeg') {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, w, h);
    }

    ctx.drawImage(bitmap, 0, 0, w, h);
    bitmap.close();

    const blob = await canvas.convertToBlob({
      type: format,
      quality: format === 'image/png' ? undefined : quality
    });

    self.postMessage({ id, blob, size: blob.size });
  } catch (err) {
    self.postMessage({ id, error: err.message });
  }
};