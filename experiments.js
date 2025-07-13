/* =============================================================
   EXPERIMENTS PAGE SCRIPT | PhysicsEducationSPV
   - Smooth scroll from quick‑nav
   - Highlight active nav link khi cuộn
   - Lazy‑load YouTube iframe
   - Ẩn/hiện placeholder card chưa có video
   ============================================================= */

document.addEventListener("DOMContentLoaded", () => {
  /* -----------------------------------------------------------
     1. SMOOTH SCROLL & ACTIVE HIGHLIGHT
  ----------------------------------------------------------- */
  const navLinks = document.querySelectorAll(".quick-nav a");

  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute("href"));
      if (target)
        target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  // highlight nav khi cuộn
  const sections = document.querySelectorAll(".topic-section");
  const ioSec = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        const id = `#${e.target.id}`;
        const nav = document.querySelector(`.quick-nav a[href='${id}']`);
        if (nav) nav.classList.toggle("active", e.isIntersecting && e.intersectionRatio > 0.4);
      });
    },
    { threshold: 0.4 }
  );
  sections.forEach((s) => ioSec.observe(s));

  /* -----------------------------------------------------------
     2. LAZY‑LOAD YOUTUBE IFRAMES
  ----------------------------------------------------------- */
  const lazyFrames = document.querySelectorAll("iframe[data-src]");
  if (lazyFrames.length) {
    const io = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const ifr = e.target;
            ifr.src = ifr.dataset.src;
            ifr.removeAttribute("data-src");
            obs.unobserve(ifr);
          }
        });
      },
      { threshold: 0.1 }
    );
    lazyFrames.forEach((f) => io.observe(f));
  }

  /* -----------------------------------------------------------
     3. ẨN PLACEHOLDER CHƯA CÓ VIDEO
  ----------------------------------------------------------- */
  document.querySelectorAll(".video-item").forEach((card) => {
    const iframe = card.querySelector("iframe");
    if (!iframe || !iframe.getAttribute("src") && !iframe.getAttribute("data-src")) {
      card.classList.add("placeholder");
    }
  });
});
