/* ============================================
   EXO LABS - Hero Terminal Typewriter
   Plays a fake live EXO-NET scan line by line.
   Loops with a pause; respects prefers-reduced-motion.
   ============================================ */

(function () {
  'use strict';

  const el = document.getElementById('hero-terminal-body');
  if (!el) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Colour-coded line classes:
  //   tx-cmd  → user command / prompt
  //   tx-info → [*] informational
  //   tx-ok   → [+] positive / discovery
  //   tx-warn → [!] warning / risk
  //   tx-err  → [-] error
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

  const CHAR_DELAY = 18;     // ms per char (jittered)
  const LINE_DELAY = 200;    // ms between lines
  const RESTART_DELAY = 6000;// ms before looping

  let aborted = false;
  let started = false;

  function escape(s) {
    return s
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function renderInstant() {
    el.innerHTML = lines
      .map((L, i) => {
        const span = `<span class="${L.cls}">${escape(L.text)}</span>`;
        const cursor = L.tail === 'cursor' ? '<span class="tx-cursor"></span>' : '';
        const nl = i < lines.length - 1 ? '\n' : '';
        return span + cursor + nl;
      })
      .join('');
  }

  if (reduceMotion) {
    renderInstant();
    return;
  }

  function sleep(ms) {
    return new Promise((r) => setTimeout(r, ms));
  }

  async function typeLine(line, lineIndex) {
    const span = document.createElement('span');
    span.className = line.cls;
    el.appendChild(span);

    for (let i = 0; i < line.text.length; i++) {
      if (aborted) return;
      span.textContent += line.text[i];
      // micro-jitter feels alive without being chaotic
      await sleep(CHAR_DELAY + Math.random() * 14);
    }

    if (line.tail === 'cursor') {
      const cursor = document.createElement('span');
      cursor.className = 'tx-cursor';
      el.appendChild(cursor);
    }

    if (lineIndex < lines.length - 1) {
      el.appendChild(document.createTextNode('\n'));
    }
  }

  async function run() {
    // gentle fade between cycles
    el.style.transition = 'opacity 400ms ease';

    while (!aborted) {
      el.style.opacity = '1';
      el.innerHTML = '';

      for (let i = 0; i < lines.length; i++) {
        if (aborted) return;
        await typeLine(lines[i], i);
        await sleep(LINE_DELAY + Math.random() * 80);
      }

      await sleep(RESTART_DELAY);
      if (aborted) return;

      el.style.opacity = '0';
      await sleep(420);
    }
  }

  function start() {
    if (started) return;
    started = true;
    run();
  }

  // Kick off when the terminal scrolls into view (saves CPU until visible)
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            start();
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    io.observe(el);
  } else {
    start();
  }

  // Stop when leaving the page so we don't keep ticking
  window.addEventListener('pagehide', () => { aborted = true; });
})();
