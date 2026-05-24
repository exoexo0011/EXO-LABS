/* ============================================
   EXO LABS - Matrix Rain Canvas Effect (v2)
   Faster, denser, more visible.
   devicePixelRatio-aware, FPS-throttled, paused when tab hidden.
   ============================================ */

(function () {
  'use strict';

  const canvas = document.getElementById('matrix-canvas');
  if (!canvas) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) {
    canvas.style.display = 'none';
    return;
  }

  const ctx = canvas.getContext('2d', { alpha: true });

  // Mix of katakana, latin and digits — recognizable + noisy
  const chars = 'ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎEXOLABS01<>{}[]/\\#$%&*+=?!:|@'.split('');

  let dpr = Math.min(window.devicePixelRatio || 1, 2);
  let columnWidth = 14;
  let columns = 0;
  let drops = [];
  let speeds = [];
  let lastTime = 0;
  const targetFps = 50;            // was 30
  const frameInterval = 1000 / targetFps;

  function resize() {
    const rect = canvas.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(rect.width * dpr);
    canvas.height = Math.floor(rect.height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    columnWidth = Math.max(13, Math.floor(rect.width / 70)); // denser columns
    columns = Math.ceil(rect.width / columnWidth);
    drops = new Array(columns).fill(0).map(() => Math.random() * -100);
    speeds = new Array(columns).fill(0).map(() => 0.7 + Math.random() * 1.6); // faster
  }

  function draw(timestamp) {
    if (timestamp - lastTime < frameInterval) {
      requestAnimationFrame(draw);
      return;
    }
    lastTime = timestamp;

    const rect = canvas.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;

    // Trail fade — slightly slower fade so trails are longer/more visible
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, w, h);

    ctx.font = `${columnWidth - 2}px "Share Tech Mono", monospace`;
    ctx.textBaseline = 'top';

    for (let i = 0; i < columns; i++) {
      const x = i * columnWidth;
      const y = drops[i] * columnWidth;
      const char = chars[(Math.random() * chars.length) | 0];

      // Lead glyph — bright off-white with strong glow
      if (drops[i] > 0 && Math.random() > 0.90) {
        ctx.fillStyle = '#e8ffe8';
        ctx.shadowColor = '#00ff41';
        ctx.shadowBlur = 12;
      } else {
        ctx.fillStyle = `rgba(0, 255, 65, ${0.55 + Math.random() * 0.4})`;
        ctx.shadowBlur = 0;
      }

      ctx.fillText(char, x, y);
      ctx.shadowBlur = 0;

      if (y > h && Math.random() > 0.96) {
        drops[i] = 0;
      }

      drops[i] += speeds[i];
    }

    requestAnimationFrame(draw);
  }

  let started = false;
  function start() {
    if (started) return;
    started = true;
    requestAnimationFrame(draw);
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) return;
    // raf will resume naturally; nothing to do
  });

  resize();
  start();

  let resizeTimer = null;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, 150);
  });
})();
