/* ============================================================
   COMICS GALLERY SCRIPT  |  PhysicsEducationSPV
   ============================================================ */
document.addEventListener("DOMContentLoaded", () => {
  /* ------------ 1. Lấy DOM ------------ */
  const gallery     = document.getElementById("gallery");
  const searchInput = document.getElementById("search-input");
  const topicFilter = document.getElementById("topic-filter");

  let comicsData = [];            // sẽ gán sau khi load JSON

  /* ------------ 2. Fetch comics.json ------------ */
  fetch("comics.json")            // nếu để trong /data, đổi thành 'data/comics.json'
    .then((res) => res.json())
    .then((data) => {
      comicsData = data;
      renderGallery(comicsData);  // lần đầu render toàn bộ
    })
    .catch((err) => {
      console.error("Lỗi tải comics.json:", err);
      renderGallery([]);          // hiển thị thông báo trống
    });

  /* ------------ 3. Hàm render ------------ */
  function renderGallery(list) {
    gallery.innerHTML = "";                       // reset

    if (!list.length) {
      gallery.innerHTML =
        "<p style='grid-column:1/-1;text-align:center;'>Không tìm thấy truyện phù hợp.</p>";
      return;
    }

    list.forEach((c) => {
      const item = document.createElement("div");
      item.className = "comic-item";
      item.innerHTML = `
        <img loading="lazy" src="${c.cover}" alt="Bìa truyện ${c.title}" />
        <h3>${c.title}</h3>
        <a class="read-button" href="comic-viewer.html?slug=${c.slug}">Đọc ngay →</a>
      `;
      gallery.appendChild(item);
    });

    /* Hiệu ứng xuất hiện khi cuộn */
    const io =
      "IntersectionObserver" in window
        ? new IntersectionObserver(
            (entries, obs) => {
              entries.forEach((e) => {
                if (e.isIntersecting) {
                  e.target.classList.add("visible");
                  obs.unobserve(e.target);
                }
              });
            },
            { threshold: 0.15 }
          )
        : null;

    document.querySelectorAll(".comic-item").forEach((it) => {
      if (io) io.observe(it);
      else it.classList.add("visible"); // fallback
    });
  }

  /* ------------ 4. Tìm kiếm & bộ lọc ------------ */
  function applyFilter() {
    const kw   = searchInput.value.trim().toLowerCase();
    const cat  = topicFilter.value;
    const list = comicsData.filter((c) => {
      const matchKW  = c.title.toLowerCase().includes(kw);
      const matchCat = cat === "all" || c.topic === cat;
      return matchKW && matchCat;
    });
    renderGallery(list);
  }

  searchInput.addEventListener("input",  applyFilter);
  topicFilter.addEventListener("change", applyFilter);
});
