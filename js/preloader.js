/**
 * Minimalist Luxury Preloader
 * 300 Frames Progressive Caching with Hairline Indicator
 */
(function() {
  const TOTAL_FRAMES = 300;
  const imageCache = new Array(TOTAL_FRAMES);
  let loadedCount = 0;
  let targetProgress = 0;
  let displayProgress = 0;
  let isDone = false;

  window.imageCache = imageCache;
  window.TOTAL_FRAMES = TOTAL_FRAMES;

  const preloaderEl = document.getElementById('pre');
  const percentTextEl = document.getElementById('pre-pct');
  const progressBarEl = document.getElementById('pre-bar-fill');
  const enterBtnEl = document.getElementById('pre-enter-btn');

  function getFrameUrl(index) {
    const padded = String(index).padStart(3, '0');
    return `images/ezgif-frame-${padded}.jpg`;
  }

  function startPreloading() {
    // Priority queue: first 35 frames + keyframes
    const priorityQueue = [];
    const secondaryQueue = [];

    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      if (i <= 35 || i % 6 === 0) {
        priorityQueue.push(i);
      } else {
        secondaryQueue.push(i);
      }
    }

    const fullQueue = [...priorityQueue, ...secondaryQueue];
    const initialBatchSize = 14;
    let activeRequests = 0;
    let queueIndex = 0;

    function loadNext() {
      if (queueIndex >= fullQueue.length) return;

      const frameNum = fullQueue[queueIndex++];
      activeRequests++;

      const img = new Image();
      img.decoding = 'async';

      img.onload = () => {
        imageCache[frameNum - 1] = img;
        loadedCount++;
        activeRequests--;

        targetProgress = Math.min(100, Math.round((loadedCount / TOTAL_FRAMES) * 100));

        if (frameNum === 1 && window.renderInitialFrame) {
          window.renderInitialFrame(img);
        }

        loadNext();
      };

      img.onerror = () => {
        loadedCount++;
        activeRequests--;
        loadNext();
      };

      img.src = getFrameUrl(frameNum);

      if (activeRequests < initialBatchSize && queueIndex < fullQueue.length) {
        loadNext();
      }
    }

    for (let c = 0; c < initialBatchSize; c++) {
      loadNext();
    }
  }

  function animateLoader() {
    if (displayProgress < targetProgress) {
      displayProgress += (targetProgress - displayProgress) * 0.16 + 0.25;
      if (displayProgress > targetProgress) displayProgress = targetProgress;
    }

    const rounded = Math.min(100, Math.floor(displayProgress));
    if (percentTextEl) {
      percentTextEl.textContent = `${rounded}%`;
    }
    if (progressBarEl) {
      progressBarEl.style.right = `${100 - displayProgress}%`;
    }

    if (displayProgress >= 99.5 && !isDone) {
      isDone = true;
      if (percentTextEl) percentTextEl.textContent = "100%";
      if (progressBarEl) progressBarEl.style.right = "0%";

      if (enterBtnEl) {
        enterBtnEl.classList.add('ready');
      } else {
        setTimeout(dismissPreloader, 600);
      }
      return;
    }

    requestAnimationFrame(animateLoader);
  }

  function dismissPreloader() {
    if (window.sound) {
      window.sound.init();
      window.sound.warp();
    }

    if (preloaderEl) {
      preloaderEl.classList.add('done');
      document.body.classList.remove('is-locked');

      // Trigger word reveals in hero
      document.querySelectorAll('.mask-line').forEach((el) => {
        el.classList.add('rv-in');
      });
    }
  }

  if (enterBtnEl) {
    enterBtnEl.addEventListener('click', dismissPreloader);
  }

  window.addEventListener('keydown', (e) => {
    if (isDone && (e.key === 'Enter' || e.key === ' ')) {
      dismissPreloader();
    }
  });

  document.addEventListener('DOMContentLoaded', () => {
    startPreloading();
    requestAnimationFrame(animateLoader);
  });
})();
