/* ============================================
   EXO LABS - Main Site Logic
   - Mobile nav toggle
   - Sticky nav scroll state
   - Scroll progress bar
   - Back-to-top button
   - Copy-to-clipboard for install commands
   - Contact form (mailto fallback)
   - Footer year, last sync
   ============================================ */

(function () {
  'use strict';

  /* ------------------------------------------------------------------
     Footer year
     ------------------------------------------------------------------ */
  document.querySelectorAll('#year').forEach((el) => {
    el.textContent = new Date().getFullYear();
  });

  /* ------------------------------------------------------------------
     Last sync timestamp (contact page)
     ------------------------------------------------------------------ */
  const lastSync = document.getElementById('last-sync');
  if (lastSync) {
    const now = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    lastSync.textContent =
      `${now.getUTCFullYear()}-${pad(now.getUTCMonth() + 1)}-${pad(now.getUTCDate())}` +
      ` ${pad(now.getUTCHours())}:${pad(now.getUTCMinutes())} UTC`;
  }

  /* ------------------------------------------------------------------
     Mobile nav toggle
     ------------------------------------------------------------------ */
  const navToggle = document.getElementById('nav-toggle');
  const navLinks = document.getElementById('nav-links');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      navToggle.classList.toggle('active', isOpen);
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    // Close drawer on link click (mobile)
    navLinks.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', () => {
        if (navLinks.classList.contains('open')) {
          navLinks.classList.remove('open');
          navToggle.classList.remove('active');
          navToggle.setAttribute('aria-expanded', 'false');
        }
      });
    });

    // Close on escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navLinks.classList.contains('open')) {
        navLinks.classList.remove('open');
        navToggle.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.focus();
      }
    });
  }

  /* ------------------------------------------------------------------
     Scroll-driven UI: nav state, progress bar, back-to-top
     ------------------------------------------------------------------ */
  const nav = document.getElementById('nav');
  const progress = document.getElementById('scroll-progress');
  const backToTop = document.getElementById('back-to-top');

  let ticking = false;

  function onScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

    if (progress) progress.style.width = pct + '%';
    if (nav) nav.classList.toggle('scrolled', scrollTop > 20);
    if (backToTop) backToTop.classList.toggle('visible', scrollTop > 480);

    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(onScroll);
      ticking = true;
    }
  }, { passive: true });

  onScroll();

  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ------------------------------------------------------------------
     Copy-to-clipboard for install commands
     ------------------------------------------------------------------ */
  document.querySelectorAll('.copy-btn').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const text = btn.dataset.copy || '';
      const original = btn.textContent;

      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(text);
        } else {
          const ta = document.createElement('textarea');
          ta.value = text;
          ta.style.position = 'fixed';
          ta.style.left = '-9999px';
          document.body.appendChild(ta);
          ta.select();
          document.execCommand('copy');
          document.body.removeChild(ta);
        }

        btn.classList.add('copied');
        btn.textContent = 'COPIED ✓';
        setTimeout(() => {
          btn.classList.remove('copied');
          btn.textContent = original;
        }, 1800);
      } catch (err) {
        btn.textContent = 'ERROR';
        setTimeout(() => {
          btn.textContent = original;
        }, 1800);
      }
    });
  });

  /* ------------------------------------------------------------------
     Contact form — opens mailto: (no backend)
     ------------------------------------------------------------------ */
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    const status = document.getElementById('form-status');

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = (contactForm.elements['name'].value || '').trim();
      const email = (contactForm.elements['email'].value || '').trim();
      const subject = (contactForm.elements['subject'].value || '').trim();
      const message = (contactForm.elements['message'].value || '').trim();

      if (!name || !email || !subject || !message) {
        if (status) {
          status.className = 'form-status error';
          status.textContent = '> ERR: All fields required.';
        }
        return;
      }

      const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      if (!emailOk) {
        if (status) {
          status.className = 'form-status error';
          status.textContent = '> ERR: Invalid email format.';
        }
        return;
      }

      const body =
        `From: ${name} <${email}>\n` +
        `Subject: ${subject}\n\n` +
        `${message}\n`;

      const mailto =
        'mailto:contact@exolabs.dev' +
        '?subject=' + encodeURIComponent('[EXO LABS] ' + subject) +
        '&body=' + encodeURIComponent(body);

      window.location.href = mailto;

      if (status) {
        status.className = 'form-status success';
        status.textContent = '> TX OK: Mail client opened. Awaiting transmission...';
      }
    });

    contactForm.addEventListener('reset', () => {
      if (status) {
        status.className = 'form-status';
        status.textContent = '';
      }
    });
  }

  /* ------------------------------------------------------------------
     Smooth-scroll for in-page anchors (offset-aware via scroll-padding)
     ------------------------------------------------------------------ */
  document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    });
  });
})();
