/* ============================================
   EXO LABS - Hero Terminal Typewriter
   Plays a fake live EXO-NET scan line by line.
   Loops forever; respects prefers-reduced-motion.
   ============================================ */

(function () {
  'use strict';

  const lines = [
    { cls: 'tx-cmd',  text: 'exo@labs:~$ ./exonet --target 192.168.1.0/24 --aggressive' },
    { cls: 'tx-info', text: '[*] Initializing EXO NET Pro v2.0.0...' },
    { cls: 'tx-info', text: '[*] Discovering hosts on 192.168.1.0/24...' },
    { cls: 'tx-ok',   text: '[+] Host found: 192.168.1.1 (router.lan) os=Linux ttl=64' },
    { cls: 'tx-ok',   text: '[+] Host found: 192.168.1.5 (desktop.lan) os=Windows ttl=128' },
    { cls: 'tx-ok',   text: '[+] Port 80 open \u2014 nginx/1.24 | "Admin Panel"' },
    { cls: 'tx-ok',   text: '[+] Port 443 open \u2014 TLS 1.3 | self-signed cert detected' },
    { cls: 'tx-warn', text: '[!] Risk score: MEDIUM (47/100)' },
    { cls: 'tx-info', text: '[*] Report saved to exonet_results/report_pro.html' },
    { cls: 'tx-cmd',  text: 'exo@labs:~$ ', tail: 'cursor' }
  ];

  // Timings — per spec
  const CHAR_DELAY    = 50;    // ms per character
  const LINE_DELAY    = 300;   // ms between lines
  const RESTART_DELAY = 4000;  // ms before looping

  let aborted = false;

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  function escape(s) {
    return s
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function renderInstant(el) {
    // Reduced-motion: render the whole transcript immediately, with cursor.
    el.innerHTML = lines
      .map((L, i) => {
        const span = `<span class="${L.cls}">${escape(L.text)}</span>`;
        const cursor = L.tail === 'cursor' ? '<span class="tx-cursor"></span>' : '';
        const nl = i < lines.length - 1 ? '\n' : '';
        return span + cursor + nl;
      })
      .join('');
  }

  async function typeAllLines(el) {
    // Loop forever
    while (!aborted) {
      el.innerHTML = '';

      for (let i = 0; i < lines.length; i++) {
        if (aborted) return;

        const line = lines[i];

        // Each line is its own colour-coded span
        const span = document.createElement('span');
        span.className = line.cls;
        el.appendChild(span);

        // Type one character at a time
        for (let j = 0; j < line.text.length; j++) {
          if (aborted) return;
          span.textContent += line.text[j];
          await sleep(CHAR_DELAY);
        }

        // Cursor pinned to the final prompt line
        if (line.tail === 'cursor') {
          const cursor = document.createElement('span');
          cursor.className = 'tx-cursor';
          el.appendChild(cursor);
        }

        // Newline between lines so <pre> renders the line break
        if (i < lines.length - 1) {
          el.appendChild(document.createTextNode('\n'));
          await sleep(LINE_DELAY);
        }
      }

      // Hold the final state, then loop
      await sleep(RESTART_DELAY);
    }
  }

  function boot() {
    const el = document.getElementById('hero-terminal-body');
    if (!el) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) {
      renderInstant(el);
      return;
    }

    typeAllLines(el);
  }

  // Start as soon as the DOM is ready (no IntersectionObserver gating —
  // the terminal lives inside the hero which is always above the fold
  // on first paint).
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }

  // Stop when leaving the page so we don't keep ticking
  window.addEventListener('pagehide', () => { aborted = true; });
})();
