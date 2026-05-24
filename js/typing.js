/* ============================================
   EXO LABS - Typewriters
   Handles BOTH:
     1) Hero tagline   — any element with [data-typed]
     2) Hero terminal  — #hero-terminal-body
   No external deps. Respects prefers-reduced-motion.
   ============================================ */

(function () {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  function escapeHtml(s) {
    return s
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  /* ============================================================
     1) Tagline typewriter
     ============================================================ */
  function setupTaglines() {
    const targets = document.querySelectorAll('[data-typed]');
    if (!targets.length) return;

    targets.forEach((el) => {
      const text = el.dataset.text || el.textContent || '';
      el.textContent = '';

      if (reduceMotion) {
        const tmp = document.createElement('div');
        tmp.innerHTML = text;
        el.textContent = tmp.textContent;
        return;
      }

      let i = 0;
      const speed = 45;
      const startDelay = 800;

      setTimeout(function tick() {
        if (i >= text.length) return;
        const tmp = document.createElement('div');
        tmp.innerHTML = text.slice(0, i + 1);
        el.textContent = tmp.textContent;
        i++;
        setTimeout(tick, speed + (Math.random() * 30 - 15));
      }, startDelay);
    });
  }

  /* ============================================================
     2) Hero terminal typewriter
     ============================================================ */

  // Lines, exactly per spec (using \u escapes so the file stays ASCII-safe)
  const TERMINAL_LINES = [
    'exo@labs:~$ ./exonet --target 192.168.1.0/24 --aggressive',
    '[*] Initializing EXO NET Pro v2.0.0...',
    '[*] Discovering hosts on 192.168.1.0/24...',
    '[+] Host found: 192.168.1.1 (router.lan) os=Linux ttl=64',
    '[+] Host found: 192.168.1.5 (desktop.lan) os=Windows ttl=128',
    '[+] Port 80 open \u2014 nginx/1.24 | "Admin Panel"',
    '[+] Port 443 open \u2014 TLS 1.3 | self-signed cert detected',
    '[!] Risk score: MEDIUM (47/100)',
    '[*] Report saved \u2192 exonet_results/report_pro.html',
    'exo@labs:~$ '
  ];

  // Timings — per spec
  const CHAR_DELAY    = 40;    // ms per character
  const LINE_DELAY    = 200;   // ms between lines
  const RESTART_DELAY = 2000;  // ms before clearing & looping

  // Colour by line prefix
  function classFor(line) {
    if (line.startsWith('[*]')) return 'tx-info';   // cyan
    if (line.startsWith('[+]')) return 'tx-ok';     // green
    if (line.startsWith('[!]')) return 'tx-warn';   // yellow
    if (line.startsWith('[-]')) return 'tx-err';    // red
    return 'tx-cmd';                                // white — commands / prompt
  }

  let terminalAborted = false;

  async function runTerminal(el) {
    while (!terminalAborted) {
      // Reset for this cycle
      el.innerHTML = '';

      // A single blinking cursor that follows the typing position
      const cursor = document.createElement('span');
      cursor.className = 'tx-cursor';

      for (let i = 0; i < TERMINAL_LINES.length; i++) {
        if (terminalAborted) return;

        const text = TERMINAL_LINES[i];

        const span = document.createElement('span');
        span.className = classFor(text);
        el.appendChild(span);

        // Move the blinking cursor to the end of this line
        if (cursor.parentNode) cursor.remove();
        el.appendChild(cursor);

        // Type each character
        for (let j = 0; j < text.length; j++) {
          if (terminalAborted) return;
          span.textContent += text[j];
          await sleep(CHAR_DELAY);
        }

        // Newline + pause between lines (skip after last line)
        if (i < TERMINAL_LINES.length - 1) {
          // Detach the cursor before adding the newline so the newline
          // ends up *between* lines and the cursor will be re-appended
          // at the end of the next line.
          cursor.remove();
          el.appendChild(document.createTextNode('\n'));
          await sleep(LINE_DELAY);
        }
      }

      // Hold final state, then clear and loop from beginning
      await sleep(RESTART_DELAY);
    }
  }

  function setupTerminal() {
    const el = document.getElementById('hero-terminal-body');
    if (!el) return;

    if (reduceMotion) {
      el.innerHTML = TERMINAL_LINES.map((line, i) => {
        const span = `<span class="${classFor(line)}">${escapeHtml(line)}</span>`;
        const cursor = i === TERMINAL_LINES.length - 1
          ? '<span class="tx-cursor"></span>'
          : '';
        const nl = i < TERMINAL_LINES.length - 1 ? '\n' : '';
        return span + cursor + nl;
      }).join('');
      return;
    }

    runTerminal(el).catch((err) => {
      console.error('[EXO LABS] terminal error:', err);
    });
  }

  /* ============================================================
     Boot
     ============================================================ */
  function boot() {
    setupTaglines();
    setupTerminal();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }

  // Stop typing when leaving the page so we don't keep ticking
  window.addEventListener('pagehide', () => { terminalAborted = true; });
})();
