// script1.js
document.addEventListener("DOMContentLoaded", () => {
  /* CARD EFFECT ------------------------------------ */
  const cards = document.querySelectorAll(".card");
  if (cards.length && "IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.2 }
    );
    cards.forEach((c) => io.observe(c));
  } else {
    cards.forEach((c) => c.classList.add("visible"));
  }

  /* MOBILE DROPDOWN -------------------------------- */
  const menuItems = document.querySelectorAll(".menu-item");
  menuItems.forEach((item) => {
    item.addEventListener("click", (ev) => {
      if (window.innerWidth <= 768) {
        ev.stopPropagation();
        const drop = item.querySelector(".dropdown");
        if (!drop) return;
        document
          .querySelectorAll(".dropdown.active")
          .forEach((d) => d !== drop && d.classList.remove("active"));
        drop.classList.toggle("active");
      }
    });
  });

  /* Đóng khi click ngoài */
  document.addEventListener("click", (e) => {
    if (window.innerWidth <= 768 && !e.target.closest(".menu-item")) {
      document
        .querySelectorAll(".dropdown.active")
        .forEach((d) => d.classList.remove("active"));
    }
  });

  /* Reset khi resize lên desktop */
  window.addEventListener("resize", () => {
    if (window.innerWidth > 768) {
      document
        .querySelectorAll(".dropdown.active")
        .forEach((d) => d.classList.remove("active"));
    }
  });
});
