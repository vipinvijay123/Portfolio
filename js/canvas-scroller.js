/**
 * Canvas Frame Scroller Engine (300 Images Sequence)
 * Scans, interpolates and scrubs 300 frames with seamless chapter syncing
 */
(function() {
  const canvas = document.getElementById('gl') || document.getElementById('hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d', { alpha: false });

  const container = document.getElementById('canvas-scroll-track');
  const peekThumb = document.getElementById('peek-thumb');
  const railButtons = document.querySelectorAll('.rail button');
  const chapterChips = document.querySelectorAll('.chip');

  let currentFrame = 0;
  let targetFrame = 0;
  let lastRenderedFrame = -1;
  let scrollProgress = 0;

  let width = 0;
  let height = 0;

  function resizeCanvas() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;

    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    ctx.scale(dpr, dpr);
    lastRenderedFrame = -1;
    renderFrame(Math.round(currentFrame));
  }

  function drawCoverImage(img) {
    if (!img || !img.complete || img.naturalWidth === 0) return;

    const imgWidth = img.naturalWidth;
    const imgHeight = img.naturalHeight;
    const imgRatio = imgWidth / imgHeight;
    const screenRatio = width / height;

    let renderW, renderH, offsetX, offsetY;

    if (screenRatio > imgRatio) {
      renderW = width;
      renderH = width / imgRatio;
      offsetX = 0;
      offsetY = (height - renderH) / 2;
    } else {
      renderH = height;
      renderW = height * imgRatio;
      offsetX = (width - renderW) / 2;
      offsetY = 0;
    }

    ctx.fillStyle = '#05070a';
    ctx.fillRect(0, 0, width, height);
    ctx.drawImage(img, offsetX, offsetY, renderW, renderH);
  }

  function getNearestFrame(index) {
    const cache = window.imageCache;
    if (!cache) return null;

    if (cache[index] && cache[index].complete) {
      return cache[index];
    }

    for (let offset = 1; offset < 300; offset++) {
      if (index - offset >= 0 && cache[index - offset] && cache[index - offset].complete) {
        return cache[index - offset];
      }
      if (index + offset < 300 && cache[index + offset] && cache[index + offset].complete) {
        return cache[index + offset];
      }
    }
    return null;
  }

  function renderFrame(frameIdx) {
    const clamped = Math.max(0, Math.min(299, frameIdx));
    if (clamped === lastRenderedFrame) return;

    const img = getNearestFrame(clamped);
    if (img) {
      drawCoverImage(img);
      lastRenderedFrame = clamped;

      // Update peek thumbnail
      if (peekThumb && img.src) {
        peekThumb.src = img.src;
      }
    }
  }

  window.renderInitialFrame = function(img) {
    drawCoverImage(img);
    if (peekThumb && img.src) {
      peekThumb.src = img.src;
    }
  };

  function updateScroll() {
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const trackHeight = container.offsetHeight - window.innerHeight;

    if (trackHeight <= 0) return;

    const rawProgress = -rect.top / trackHeight;
    scrollProgress = Math.max(0, Math.min(1, rawProgress));
    targetFrame = scrollProgress * 299;

    // Update chapter chips active states
    const chipIdx = Math.min(3, Math.floor(scrollProgress * 4));
    chapterChips.forEach((chip, i) => {
      chip.classList.toggle('on', i === chipIdx);
    });

    // Update rail buttons
    const railIdx = Math.min(railButtons.length - 1, Math.floor((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * railButtons.length));
    railButtons.forEach((btn, i) => {
      btn.classList.toggle('on', i === railIdx);
    });
  }

  function loop() {
    updateScroll();

    const diff = targetFrame - currentFrame;
    if (Math.abs(diff) > 0.01) {
      currentFrame += diff * 0.16;
      renderFrame(Math.round(currentFrame));
    }

    requestAnimationFrame(loop);
  }

  // Chapter chip click handler: jump directly to corresponding chapter frame!
  chapterChips.forEach((chip, idx) => {
    chip.addEventListener('click', () => {
      if (!container) return;
      const targetPct = (idx / 4) + 0.05;
      const targetY = container.offsetTop + targetPct * (container.offsetHeight - window.innerHeight);
      window.scrollTo({ top: targetY, behavior: 'smooth' });
      if (window.sound) window.sound.warp();
    });
  });

  window.addEventListener('resize', resizeCanvas, { passive: true });
  window.addEventListener('scroll', updateScroll, { passive: true });

  window.addEventListener('DOMContentLoaded', () => {
    resizeCanvas();
    requestAnimationFrame(loop);
  });
})();
