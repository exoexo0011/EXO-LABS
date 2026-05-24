/* ============================================
   EXO LABS - Typing Effect
   Animates [data-typed] elements once they're in view.
   Reads target text from [data-text] attribute.
   ============================================ */

(function () {
  'use strict';

  const targets = document.querySelectorAll('[data-typed]');
  if (!targets.length) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function typeOut(el) {
    const text = el.dataset.text || el.textContent || '';
    el.textContent = '';

    if (reduceMotion) {
      el.textContent = text;
      return;
    }

    let i = 0;
    const speed = 45; // ms per char
    const startDelay = 800; // wait for hero animations

    setTimeout(function tick() {
      if (i >= text.length) return;
      // Decode HTML entities like &amp; in data-text
      const tmp = document.createElement('div');
      tmp.innerHTML = text.slice(0, i + 1);
      el.textContent = tmp.textContent;
      i++;
      setTimeout(tick, speed + (Math.random() * 30 - 15));
    }, startDelay);
  }

  // IntersectionObserver — only animate when visible
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          typeOut(entry.target);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    targets.forEach((t) => io.observe(t));
  } else {
    targets.forEach(typeOut);
  }
})();
