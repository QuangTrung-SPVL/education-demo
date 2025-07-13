/* ==========================================================
   PHYSICSEDU LECTURE PAGE SCRIPT
   - Accordion mở/đóng + lazy‑load iFrame
   - Ghi nhớ phần đã xem (localStorage)
   - Tự mở mục theo URL hash
   - Hiệu ứng xuất hiện khi cuộn
   - Nút “Về đầu trang”
   ========================================================== */
document.addEventListener("DOMContentLoaded", () => {
  /* --------------------------------------------------------
     1. ACCORDION & LAZY‑LOAD iFRAME
  -------------------------------------------------------- */
  const accordionItems = document.querySelectorAll(".accordion-item");

  accordionItems.forEach((item) => {
    const header   = item.querySelector(".accordion-header");
    const content  = item.querySelector(".accordion-content");
    const iframe   = content.querySelector("iframe");

    header.addEventListener("click", () => {
      /* Đóng mọi mục khác đang mở */
      document.querySelectorAll(".accordion-item.active").forEach((open) => {
        if (open !== item) {
          open.classList.remove("active");
          open.querySelector(".accordion-content").style.maxHeight = 0;
        }
      });

      /* Toggle mục hiện tại */
      item.classList.toggle("active");

      if (item.classList.contains("active")) {
        /* Lazy‑load iFrame đúng lần mở đầu */
        if (iframe && iframe.dataset.src && !iframe.src) {
          iframe.src = iframe.dataset.src;
        }
        /* Mở accordion: set maxHeight = scrollHeight */
        content.style.maxHeight = content.scrollHeight + "px";

        /* Cập nhật URL & localStorage */
        history.replaceState(null, "", `#${item.id}`);
        localStorage.setItem(item.id, "viewed");
        item.classList.add("viewed");
      } else {
        /* Đóng accordion */
        content.style.maxHeight = 0;
      }
    });
  });

  /* --------------------------------------------------------
     2. TỰ MỞ MỤC THEO URL #HASH
  -------------------------------------------------------- */
  if (location.hash) {
    const target = document.querySelector(location.hash);
    if (target && target.querySelector(".accordion-header")) {
      target.querySelector(".accordion-header").click();
      /* Mượt hơn: cuộn chính xác tới mục */
      setTimeout(() => target.scrollIntoView({ behavior: "smooth", block: "start" }), 200);
    }
  }

  /* --------------------------------------------------------
     3. ĐÁNH DẤU PHẦN ĐÃ XEM (localStorage)
  -------------------------------------------------------- */
  accordionItems.forEach((item) => {
    if (localStorage.getItem(item.id) === "viewed") {
      item.classList.add("viewed");
    }
  });

  /* --------------------------------------------------------
     4. Hiệu ứng xuất hiện khi cuộn (Intersection Observer)
  -------------------------------------------------------- */
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    accordionItems.forEach((it) => io.observe(it));
  } else {
    /* Fallback: hiện ngay nếu trình duyệt cũ */
    accordionItems.forEach((it) => it.classList.add("visible"));
  }

  /* --------------------------------------------------------
     5. NÚT “VỀ ĐẦU TRANG”
  -------------------------------------------------------- */
  const backBtn = document.getElementById("back-to-top");
  window.addEventListener("scroll", () => {
    backBtn.classList.toggle("show", window.scrollY > 300);
  });
  backBtn.addEventListener("click", () =>
    window.scrollTo({ top: 0, behavior: "smooth" })
  );
});
