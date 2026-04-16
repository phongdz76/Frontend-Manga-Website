document.addEventListener("DOMContentLoaded", () => {
  const detailContent = document.querySelector("#detail-content");
  const relatedGrid = document.querySelector("#related-grid");
  const allManga = Array.isArray(window.MANGA_DATA) ? window.MANGA_DATA : [];

  const getImagePath = (imageName) => `../assets/${imageName || "images.jpg"}`;
  const searchParams = new URLSearchParams(window.location.search);
  const mangaId = searchParams.get("id");

  const selectedManga = allManga.find((item) => item.id === mangaId);

  if (!selectedManga) {
    detailContent.innerHTML = `
      <div class="not-found">
        <h1>Không tìm thấy truyện</h1>
        <p>Dữ liệu truyện không tồn tại hoặc đường dẫn đã thay đổi.</p>
        <a class="detail-btn primary" href="../index.html">Về trang chủ</a>
      </div>
    `;
    relatedGrid.innerHTML = "";
    return;
  }

  document.title = `${selectedManga.title} | TRUYENHAY`;

  const genreMarkup = (
    Array.isArray(selectedManga.genres) ? selectedManga.genres : []
  )
    .map((genre) => `<span class="genre-item">${genre}</span>`)
    .join("");

  detailContent.innerHTML = `
    <article class="detail-card">
      <img class="detail-poster" src="${getImagePath(selectedManga.image)}" alt="${selectedManga.title}">
      <div>
        <h1 class="detail-title">${selectedManga.title}</h1>
        <div class="detail-meta">
          <div class="detail-meta-item">
            <span class="detail-meta-label">Tác giả</span>
            <span class="detail-meta-value">${selectedManga.author || "Đang cập nhật"}</span>
          </div>
          <div class="detail-meta-item">
            <span class="detail-meta-label">Tình trạng</span>
            <span class="detail-meta-value">${selectedManga.status || "Đang cập nhật"}</span>
          </div>
          <div class="detail-meta-item">
            <span class="detail-meta-label">Chương mới nhất</span>
            <span class="detail-meta-value">${selectedManga.chapter || "Chương 1"}</span>
          </div>
          <div class="detail-meta-item">
            <span class="detail-meta-label">Cập nhật</span>
            <span class="detail-meta-value">${selectedManga.timeAgo || "Mới cập nhật"}</span>
          </div>
        </div>

        <div class="genre-list">${genreMarkup}</div>

        <p class="detail-summary">${selectedManga.description || "Nội dung đang được cập nhật."}</p>

        <div class="detail-actions">
          <a class="detail-btn primary" href="./read-chapter.html?id=${encodeURIComponent(selectedManga.id)}">Đọc ngay</a>
          <a class="detail-btn" href="../index.html">Quay lại danh sách</a>
        </div>
      </div>
    </article>
  `;

  const relatedItems = allManga
    .filter((item) => item.id !== selectedManga.id)
    .slice(0, 8);

  if (!relatedItems.length) {
    relatedGrid.innerHTML = "";
    return;
  }

  relatedGrid.innerHTML = relatedItems
    .map(
      (item) => `
        <a class="related-card" href="./manga-detail.html?id=${encodeURIComponent(item.id)}" aria-label="Xem chi tiết ${item.title}">
          <img class="related-thumb" src="${getImagePath(item.image)}" alt="${item.title}">
          <div class="related-info">
            <h3 class="related-title">${item.title}</h3>
            <div class="related-chapter">${item.chapter || "Chương 1"}</div>
          </div>
        </a>
      `,
    )
    .join("");
});
