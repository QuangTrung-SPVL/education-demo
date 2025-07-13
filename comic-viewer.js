/* ============================================================
   COMIC VIEWER SCRIPT | PhysicsEducationSPV
   Tương thích 100% với comic-viewer.html & comic-viewer.css
   ============================================================ */
document.addEventListener("DOMContentLoaded", () => {
  /* ---------------- LẤY THAM SỐ SLUG ---------------- */
  const params = new URLSearchParams(location.search);
  const slug   = params.get("slug");
  if (!slug) {
    alert("Thiếu tham số truyện, trở về thư viện.");
    location.href = "comics.html";
    return;
  }

  /* ---------------- CÁC PHẦN TỬ DOM ---------------- */
  const viewer   = document.querySelector(".comic-viewer");
  const strip    = document.getElementById("comicStrip");
  const thumbNav = document.getElementById("thumbStrip");
  const controls = document.querySelector(".viewer-controls");
  const btnPrev  = document.getElementById("btnPrev");
  const btnNext  = document.getElementById("btnNext");
  const btnFS    = document.getElementById("btnFS");
  const curSpan  = document.getElementById("currentPage");
  const totSpan  = document.getElementById("totalPages");

  /* ---------------- FETCH META / Fallback ---------------- */
  fetch(`comics/${slug}/meta.json`)
    .then((res) => (res.ok ? res.json() : Promise.reject()))
    .then((meta) => init(meta.pages))
    .catch(() => {
      console.warn("Không tìm thấy meta.json, mặc định 20 trang");
      init(20);
    });

  /* ---------------- HÀM KHỞI TẠO ---------------- */
  function init(totalPages) {
    totSpan.textContent = totalPages;

    // Tạo trang ảnh và thumbnail
    for (let i = 1; i <= totalPages; i++) {
      // Ảnh chính (lazy)
      const img = document.createElement("img");
      img.className = "comic-page";
      img.dataset.src = `comics/${slug}/page${i}.jpg`;
      img.alt = `${slug} trang ${i}`;
      strip.appendChild(img);

      // Thumbnail
      const thumb = document.createElement("img");
      thumb.className = "thumb";
      thumb.src = `comics/${slug}/thumb/page${i}.jpg`;
      thumb.dataset.page = i;
      thumbNav.appendChild(thumb);
    }

    lazyLoadPages();
    restoreLastPage();
    attachEvents(totalPages);
    showControls();
  }

  /* ---------------- LAZY LOAD ẢNH ---------------- */
  function lazyLoadPages() {
    const pages = document.querySelectorAll(".comic-page");
    const io = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const img = e.target;
            if (!img.src) img.src = img.dataset.src;
            obs.unobserve(img);
          }
        });
      },
      { threshold: 0.05 }
    );
    pages.forEach((p) => io.observe(p));
  }

  /* ---------------- SỰ KIỆN & ĐIỀU HƯỚNG ---------------- */
  function attachEvents(total) {
    // Prev / Next
    btnPrev.onclick = () => currentPage() > 1 && gotoPage(currentPage() - 1);
    btnNext.onclick = () => currentPage() < total && gotoPage(currentPage() + 1);

    // Keyboard
    document.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") btnPrev.click();
      else if (e.key === "ArrowRight") btnNext.click();
      else if (e.key.toLowerCase() === "f") toggleFullscreen();
      else if (e.key === "Escape") location.href = "comics.html";
    });

    // Touch swipe
    let startX = 0;
    viewer.addEventListener("touchstart", (e) => (startX = e.touches[0].clientX));
    viewer.addEventListener("touchend", (e) => {
      const dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 50) dx < 0 ? btnNext.click() : btnPrev.click();
    });

    // Thumbnail click
    thumbNav.addEventListener("click", (e) => {
      const t = e.target.closest(".thumb");
      if (t) gotoPage(+t.dataset.page);
    });

    // Scroll update indicator
    viewer.addEventListener("scroll", debounce(updateIndicator, 100));
  }

  function gotoPage(page) {
    viewer.scrollTo({ left: (page - 1) * viewer.clientWidth, behavior: "smooth" });
  }

  function currentPage() {
    return Math.round(viewer.scrollLeft / viewer.clientWidth) + 1;
  }

  function updateIndicator() {
    const p = currentPage();
    curSpan.textContent = p;
    // highlight thumbnail
    document.querySelectorAll(".thumb").forEach((t) => t.classList.toggle("active", +t.dataset.page === p));
    // save progress
    localStorage.setItem(`last-${slug}`, p);
  }

  /* ---------------- FULLSCREEN ---------------- */
  function toggleFullscreen() {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen();
    else document.exitFullscreen();
  }
  btnFS.onclick = toggleFullscreen;

  /* ---------------- ẨN/HIỆN CONTROLS ---------------- */
  let hideTimer;
  function showControls() {
    controls.classList.add("visible");
    clearTimeout(hideTimer);
    hideTimer = setTimeout(() => controls.classList.remove("visible"), 3000);
  }
  [viewer, controls].forEach((el) => el.addEventListener("mousemove", showControls));
  document.addEventListener("click", showControls);

  /* ---------------- PHỤ TRỢ ---------------- */
  function restoreLastPage() {
    const saved = +localStorage.getItem(`last-${slug}`);
    if (saved && saved > 1) viewer.scrollTo({ left: (saved - 1) * viewer.clientWidth });
    updateIndicator();
  }

  function debounce(fn, ms) {
    let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); };
  }
});
