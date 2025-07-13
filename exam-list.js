/* ============================================================
   EXAM LIST SCRIPT  |  PhysicsEducationSPV
   ------------------------------------------------------------
   1. Smooth‑scroll sidebar links
   2. Scroll‑spy: highlight active link while scrolling
   3. Ready / Pending state auto‑detect for exam items
   ============================================================ */

(() => {
  /* ---------- DOM Shortcuts ---------- */
  const $$ = (sel, par = document) => [...par.querySelectorAll(sel)];
  const navLinks = $$('.sticky-nav a');
  const sections = $$('.topic-section');

  /* ---------- 1. Smooth Scroll ---------- */
  navLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  /* ---------- 2. Scroll‑Spy Highlight ---------- */
  if ('IntersectionObserver' in window) {
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const link = document.querySelector(`.sticky-nav a[href='#${entry.target.id}']`);
          if (!link) return;
          if (entry.isIntersecting) {
            navLinks.forEach((l) => l.classList.remove('active'));
            link.classList.add('active');
          }
        });
      },
      { rootMargin: '-60% 0px -35% 0px', threshold: 0 }
    );
    sections.forEach((sec) => spy.observe(sec));
  }

  /* ---------- 3. Ready / Pending State ---------- */
  $$('.exam-item').forEach((item) => {
    const btn = item.querySelector('.action-button');
    const pending = !btn || btn.classList.contains('disabled') || btn.getAttribute('href') === '#';
    item.classList.toggle('pending', pending);
    item.classList.toggle('ready', !pending);
  });
})();
