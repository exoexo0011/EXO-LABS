/* ============================================
   EXO LABS - Typewriters
   Handles BOTH:
     1) Hero tagline   — any element with [data-typed]
     2) Hero terminal  — #hero-terminal-body  (interactive menu demo)
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
     2) Hero terminal — EXO-NET interactive menu demo
     ============================================================ */

  // Each line is a distinct terminal row. Empty strings render blank lines.
  // Box-drawing chars render in the green "ok" colour so the menu looks
  // like a green TUI box.
  const TERMINAL_LINES = [
    'exo@labs:~$ python exonet.py',
    '',
    '\u2554\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2557',
    '\u2551     EXO NET Pro v2.0.0       \u2551',
    '\u2560\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2563',
    '\u2551  [1]  Quick Scan             \u2551',
    '\u2551  [2]  Full Network Scan      \u2551',
    '\u2551  [3]  Pro Scan               \u2551',
    '\u2551  [4]  Stealth Scan           \u2551',
    '\u2551  [Q]  Quit                   \u2551',
    '\u255A\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u255D',
    '',
    '[?] Choose option: 3'
  ];

  // Timings — per spec
  const CHAR_DELAY    = 40;    // ms per character
  const LINE_DELAY    = 200;   // ms between lines
  const RESTART_DELAY = 2500;  // ms before clearing & looping

  // Colour by line content
  function classFor(line) {
    if (!line) return 'tx-cmd';
    const c0 = line.charAt(0);
    // Box-drawing rows → green (the EXO menu UI)
    if (c0 === '\u2551' || c0 === '\u2554' || c0 === '\u2557' ||
        c0 === '\u255A' || c0 === '\u255D' || c0 === '\u2560' ||
        c0 === '\u2563' || c0 === '\u2550') {
      return 'tx-ok';
    }
    if (line.startsWith('[*]')) return 'tx-info';   // cyan
    if (line.startsWith('[+]')) return 'tx-ok';     // green
    if (line.startsWith('[!]')) return 'tx-warn';   // yellow
    if (line.startsWith('[-]')) return 'tx-err';    // red
    if (line.startsWith('[?]')) return 'tx-info';   // cyan prompt
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

        // Type each character (empty lines: nothing to type, just pause briefly)
        if (text.length === 0) {
          await sleep(LINE_DELAY / 2);
        } else {
          for (let j = 0; j < text.length; j++) {
            if (terminalAborted) return;
            span.textContent += text[j];
            await sleep(CHAR_DELAY);
          }
        }

        // Newline + pause between lines (skip after last line — cursor stays)
        if (i < TERMINAL_LINES.length - 1) {
          cursor.remove();
          el.appendChild(document.createTextNode('\n'));
          await sleep(LINE_DELAY);
        }
      }

      // Hold final state with the blinking cursor on the prompt, then loop
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
