/* ============================================================
   EXERCISES PAGE SCRIPT  |  PhysicsEducationSPV
   ------------------------------------------------------------
   1. Smooth scroll sidebar links
   2. Scroll‑spy: auto‑highlight active link (IntersectionObserver)
   3. Ready / Pending state detection (href="#" or .disabled → pending)
   4. Collapsible sections (click .section-header)
   ============================================================ */

(() => {
  /* -------- Helpers -------- */
  const qsa = (sel, parent = document) => [...parent.querySelectorAll(sel)];
  const navLinks = qsa('.sticky-nav a');
  const sections = qsa('.topic-section');

  /* ---------- 1. Smooth Scroll ---------- */
  navLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  /* ---------- 2. Scroll‑spy ---------- */
  if ('IntersectionObserver' in window) {
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const active = document.querySelector(`.sticky-nav a[href='#${entry.target.id}']`);
          if (active) active.classList.toggle('active', entry.isIntersecting && entry.intersectionRatio > 0.4);
        });
      },
      { threshold: 0.4 }
    );
    sections.forEach((sec) => spy.observe(sec));
  }

  /* ---------- 3. Ready / Pending ---------- */
  qsa('.exercise-item').forEach((item) => {
    const btn = item.querySelector('.download-button');
    const isPending = !btn || btn.classList.contains('disabled') || btn.getAttribute('href') === '#';
    item.classList.toggle('pending', isPending);
    item.classList.toggle('ready', !isPending);
  });

  /* ---------- 4. Collapsible Sections ---------- */
  sections.forEach((sec) => {
    const header = sec.querySelector('.section-header');
    const list   = sec.querySelector('.exercise-list');
    const zipBox = sec.querySelector('.download-all-container');

    if (!header || !list) return;
    header.style.cursor = 'pointer';

    header.addEventListener('click', () => {
      const isHidden = list.hasAttribute('data-collapsed');
      list.toggleAttribute('data-collapsed');
      list.style.display   = isHidden ? ''   : 'none';
      if (zipBox) zipBox.style.display = isHidden ? '' : 'none';
    });
  });
})();
