document.addEventListener("DOMContentLoaded", () => {
  const readerContent = document.querySelector("#reader-content");
  const detailLink = document.querySelector("#detail-link");
  const allManga = Array.isArray(window.MANGA_DATA) ? window.MANGA_DATA : [];

  const searchParams = new URLSearchParams(window.location.search);
  const mangaId = searchParams.get("id");
  const selectedManga = allManga.find((item) => item.id === mangaId);

  if (!selectedManga) {
    if (detailLink) {
      detailLink.setAttribute("href", "../index.html");
      detailLink.textContent = "Quay lại danh sách";
    }

    readerContent.innerHTML = `
      <div class="not-found">
        <h1>Không tìm thấy chương mẫu</h1>
        <p>Truyện không tồn tại hoặc liên kết đã hết hiệu lực.</p>
        <a class="reader-btn primary" href="../index.html">Về trang chủ</a>
      </div>
    `;
    return;
  }

  const chapterLabel = selectedManga.chapter || "Chương 1";
  const detailHref = `./manga-detail.html?id=${encodeURIComponent(selectedManga.id)}`;

  if (detailLink) {
    detailLink.setAttribute("href", detailHref);
    detailLink.textContent = "Trang chi tiết";
  }

  document.title = `${selectedManga.title} - ${chapterLabel} | TRUYENHAY`;

  const sampleParagraphs = [
    `Cơn gió đêm lướt qua thành phố, mở ra một khởi đầu mới cho ${selectedManga.title}. Tưởng như bình yên, nhưng từng bước chân đều dẫn đến một bí mật chưa được gọi tên.`,
    `Nhân vật chính đứng trước lựa chọn khó khăn: tiếp tục im lặng hay đối diện với sự thật đã đeo bám suốt thời gian qua. Chỉ một quyết định nhỏ cũng đủ làm thay đổi toàn bộ cục diện.`,
    `Khi những mối quan hệ cũ dần hé lộ mặt khuất, mọi lời hứa tưởng chừng chắc chắn đều bị thử thách. Không ai biết ai mới là người thật sự có thể tin tưởng.`,
    `Giữa khoảnh khắc căng thẳng, một cuộc gặp bất ngờ xuất hiện như tia sáng trong đêm tối. Từ đó, hành trình bước sang chương mới với nhiều cảm xúc lẫn nguy cơ khó lường.`,
    `Chương mẫu khép lại ở điểm nút quan trọng, để lại dư âm và câu hỏi lớn cho phần tiếp theo. Câu chuyện của ${selectedManga.title} chỉ mới bắt đầu.`,
  ];

  readerContent.innerHTML = `
    <span class="reader-badge">CHƯƠNG MẪU</span>
    <h1 class="reader-title">${selectedManga.title}</h1>
    <p class="reader-chapter">${chapterLabel}</p>
    <p class="reader-meta">Tác giả: ${selectedManga.author || "Đang cập nhật"} • Thể loại: ${(selectedManga.genres || []).join(", ")}</p>
    <p class="reader-description">${selectedManga.description || "Nội dung đang được cập nhật."}</p>

    <div class="reader-body">
      ${sampleParagraphs.map((paragraph) => `<p>${paragraph}</p>`).join("")}
    </div>

    <p class="reader-note">Đây là chương đọc thử. Nội dung đầy đủ sẽ được cập nhật trong các chương tiếp theo.</p>

    <div class="reader-actions">
      <a class="reader-btn" href="${detailHref}">Về trang chi tiết</a>
      <a class="reader-btn primary" href="../index.html">Khám phá thêm truyện</a>
    </div>
  `;
});
