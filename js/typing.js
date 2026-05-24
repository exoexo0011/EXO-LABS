/* ============================================
   EXO LABS - Typewriters
   Handles BOTH:
     1) Hero tagline   — any element with [data-typed]
     2) Hero terminal  — #hero-terminal-body
        Loops between two scenes:
          Scene 1: EXO-NET interactive menu
          Scene 2: EXO-NET aggressive scan output
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
     2) Hero terminal — TWO-SCENE loop
     ============================================================ */

  // Box-drawing characters (kept as \u escapes so the file is ASCII-safe)
  const BOX_W = 34;                                  // inner width of the menu box
  const HBAR  = '\u2550'.repeat(BOX_W);              // ═ × 34
  const TOP   = '\u2554' + HBAR + '\u2557';          // ╔══...══╗
  const SEP   = '\u2560' + HBAR + '\u2563';          // ╠══...══╣
  const BOT   = '\u255A' + HBAR + '\u255D';          // ╚══...══╝

  // ----- Scene 1: Interactive menu -----
  const SCENE_1 = [
    'exo@labs:~$ python exonet.py',
    '',
    TOP,
    '\u2551      EXO NET Pro v2.0.0          \u2551',
    SEP,
    '\u2551  [1]  Quick Scan                 \u2551',
    '\u2551  [2]  Full Network Scan          \u2551',
    '\u2551  [3]  Pro Scan                   \u2551',
    '\u2551  [4]  Stealth Scan               \u2551',
    '\u2551  [Q]  Quit                       \u2551',
    BOT,
    '',
    '[?] Choose option: 3',
    '[*] Starting Pro Scan...'
  ];

  // ----- Scene 2: Aggressive scan output -----
  const SCENE_2 = [
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

  const SCENES = [SCENE_1, SCENE_2];

  // Timings
  const CHAR_DELAY = 40;    // ms per character
  const LINE_DELAY = 300;   // ms between lines
  const HOLD_DELAY = 2000;  // ms hold after a scene completes
  const FADE_DELAY = 400;   // ms smooth clear between scenes

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
    if (line.startsWith('[?]')) return 'tx-accent'; // purple
    return 'tx-cmd';                                // white — commands / prompt
  }

  let terminalAborted = false;

  async function typeScene(el, scene) {
    // Reset for this scene
    el.innerHTML = '';
    el.style.opacity = '1';

    // A single blinking cursor that follows the typing position
    const cursor = document.createElement('span');
    cursor.className = 'tx-cursor';

    for (let i = 0; i < scene.length; i++) {
      if (terminalAborted) return;

      const text = scene[i];
      const span = document.createElement('span');
      span.className = classFor(text);
      el.appendChild(span);

      // Move the blinking cursor to the end of this line
      if (cursor.parentNode) cursor.remove();
      el.appendChild(cursor);

      // Type each character (empty lines: short pause for visual breathing room)
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
      if (i < scene.length - 1) {
        cursor.remove();
        el.appendChild(document.createTextNode('\n'));
        await sleep(LINE_DELAY);
      }
    }
  }

  async function runTerminal(el) {
    // Smooth crossfade between scenes
    el.style.transition = 'opacity ' + FADE_DELAY + 'ms ease';

    let sceneIdx = 0;

    while (!terminalAborted) {
      // Type the current scene
      await typeScene(el, SCENES[sceneIdx]);
      if (terminalAborted) return;

      // Hold for 2s with the blinking cursor pinned to the last line
      await sleep(HOLD_DELAY);
      if (terminalAborted) return;

      // Smooth clear (fade to 0, wait, then the next iteration sets opacity 1)
      el.style.opacity = '0';
      await sleep(FADE_DELAY);

      // Advance to next scene (wraps 0 → 1 → 0 → 1 … forever)
      sceneIdx = (sceneIdx + 1) % SCENES.length;
    }
  }

  function setupTerminal() {
    const el = document.getElementById('hero-terminal-body');
    if (!el) return;

    if (reduceMotion) {
      // Render Scene 1 (the menu) statically with a cursor — preferred for
      // reduced-motion users since it conveys both the brand and the UI.
      el.innerHTML = SCENE_1.map((line, i) => {
        const span = `<span class="${classFor(line)}">${escapeHtml(line)}</span>`;
        const cursor = i === SCENE_1.length - 1
          ? '<span class="tx-cursor"></span>'
          : '';
        const nl = i < SCENE_1.length - 1 ? '\n' : '';
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
