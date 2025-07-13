/* =============================================================
   QUESTION‑BANK  |  PhysicsEducationSPV
   -------------------------------------------------------------
   1. Smooth scroll sidebar links
   2. Scroll‑spy: highlight active link
   3. Ready / Pending state: link "#"  → pending
   ============================================================= */

(() => {
  /* ---------- DOM helper ---------- */
  const $all = (sel, par = document) => [...par.querySelectorAll(sel)];

  /* ---------- 1. Smooth scroll ---------- */
  const navLinks = $all('.sticky-nav a');
  navLinks.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  /* ---------- 2. Scroll‑spy highlight ---------- */
  const sections = $all('.topic-section');
  if ('IntersectionObserver' in window) {
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach(ent => {
          const link = document.querySelector(`.sticky-nav a[href='#${ent.target.id}']`);
          if (!link) return;
          if (ent.isIntersecting) {
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
          }
        });
      },
      { rootMargin: '-55% 0px -40% 0px', threshold: 0 }
    );
    sections.forEach(sec => spy.observe(sec));
  }

  /* ---------- 3. Ready / Pending link ---------- */
  $all('.file-container a').forEach(a => {
    const pending = !a || a.getAttribute('href') === '#';
    a.classList.toggle('pending', pending);   // dùng trong CSS nếu muốn làm mờ
    a.classList.toggle('ready', !pending);
  });
})();
