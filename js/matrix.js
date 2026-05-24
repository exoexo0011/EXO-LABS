/* ============================================
   EXO LABS - Matrix Rain Canvas Effect
   Pure vanilla, devicePixelRatio-aware, FPS-throttled
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

  // Mix of katakana, latin and digits — classic + clean
  const chars = 'ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎEXOLABS01<>{}[]/\\#$%&*+=?!:|@'.split('');

  let dpr = Math.min(window.devicePixelRatio || 1, 2);
  let columnWidth = 16;
  let columns = 0;
  let drops = [];
  let speeds = [];
  let lastTime = 0;
  const targetFps = 30;
  const frameInterval = 1000 / targetFps;

  function resize() {
    const rect = canvas.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(rect.width * dpr);
    canvas.height = Math.floor(rect.height * dpr);
    ctx.scale(dpr, dpr);

    columnWidth = Math.max(14, Math.floor(rect.width / 90));
    columns = Math.ceil(rect.width / columnWidth);
    drops = new Array(columns).fill(0).map(() => Math.random() * -100);
    speeds = new Array(columns).fill(0).map(() => 0.4 + Math.random() * 0.9);
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

    // Trail fade — translucent black layer
    ctx.fillStyle = 'rgba(0, 0, 0, 0.07)';
    ctx.fillRect(0, 0, w, h);

    ctx.font = `${columnWidth - 2}px "Share Tech Mono", monospace`;
    ctx.textBaseline = 'top';

    for (let i = 0; i < columns; i++) {
      const x = i * columnWidth;
      const y = drops[i] * columnWidth;
      const char = chars[(Math.random() * chars.length) | 0];

      // Lead glyph — bright white-green with glow
      if (drops[i] > 0 && Math.random() > 0.92) {
        ctx.fillStyle = '#d8ffe1';
        ctx.shadowColor = '#00ff41';
        ctx.shadowBlur = 8;
      } else {
        ctx.fillStyle = `rgba(0, 255, 65, ${0.45 + Math.random() * 0.4})`;
        ctx.shadowBlur = 0;
      }

      ctx.fillText(char, x, y);
      ctx.shadowBlur = 0;

      // Reset drop with random chance once it leaves the screen
      if (y > h && Math.random() > 0.965) {
        drops[i] = 0;
      }

      drops[i] += speeds[i];
    }

    requestAnimationFrame(draw);
  }

  // Pause animation when tab not visible (perf)
  let rafId = null;
  function start() {
    if (rafId) return;
    rafId = requestAnimationFrame(function loop(ts) {
      draw(ts);
      rafId = null; // draw() schedules its own raf, this is just kickoff
    });
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) return;
    start();
  });

  // Init
  resize();
  start();

  // Resize handler (debounced)
  let resizeTimer = null;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, 150);
  });
})();
