document.addEventListener("DOMContentLoaded", () => {
  const slider = document.querySelector(".slider");
  const prevButton = document.querySelector(".prev");
  const nextButton = document.querySelector(".next");

  if (slider && prevButton && nextButton) {
    let slideIndex = 0;
    let isSliding = false;
    let autoSlideTimer;
    let resizeFrameId;
    let metrics = {
      step: 0,
      maxIndex: 0,
    };

    const getSlides = () => Array.from(slider.querySelectorAll(".slide"));

    const getSliderMetrics = () => {
      const slides = getSlides();
      const firstSlide = slides[0];
      if (!firstSlide) {
        return { step: 0, maxIndex: 0 };
      }

      const computed = window.getComputedStyle(slider);
      const gap = parseFloat(computed.gap || computed.columnGap || "0") || 0;
      const step = firstSlide.getBoundingClientRect().width + gap;
      const viewportWidth = slider.getBoundingClientRect().width;
      const visibleCount = Math.max(
        1,
        Math.floor((viewportWidth + gap) / step),
      );
      const maxIndex = Math.max(0, slides.length - visibleCount);

      return { step, maxIndex };
    };

    const syncButtonState = () => {
      const disabled = metrics.maxIndex === 0;
      prevButton.disabled = disabled;
      nextButton.disabled = disabled;
    };

    const applySlidePosition = (withAnimation = true) => {
      if (metrics.step === 0) {
        return;
      }

      slider.style.transition = withAnimation ? "transform 0.45s ease" : "none";
      slider.style.transform = `translateX(-${slideIndex * metrics.step}px)`;
    };

    const recalcSlider = () => {
      metrics = getSliderMetrics();

      if (slideIndex > metrics.maxIndex) {
        slideIndex = metrics.maxIndex;
      }

      applySlidePosition(false);
      syncButtonState();
    };

    const moveSlide = (direction) => {
      if (isSliding || metrics.maxIndex === 0) {
        return;
      }

      isSliding = true;

      if (direction > 0) {
        slideIndex = slideIndex >= metrics.maxIndex ? 0 : slideIndex + 1;
      } else {
        slideIndex = slideIndex <= 0 ? metrics.maxIndex : slideIndex - 1;
      }

      applySlidePosition(true);

      window.setTimeout(() => {
        isSliding = false;
      }, 460);
    };

    const stopAutoSlide = () => {
      clearInterval(autoSlideTimer);
    };

    const startAutoSlide = () => {
      stopAutoSlide();
      if (metrics.maxIndex === 0) {
        return;
      }

      autoSlideTimer = window.setInterval(() => {
        moveSlide(1);
      }, 3200);
    };

    prevButton.addEventListener("click", () => moveSlide(-1));
    nextButton.addEventListener("click", () => moveSlide(1));

    slider.addEventListener("mouseenter", stopAutoSlide);
    slider.addEventListener("mouseleave", startAutoSlide);

    window.addEventListener("resize", () => {
      window.cancelAnimationFrame(resizeFrameId);
      resizeFrameId = window.requestAnimationFrame(() => {
        recalcSlider();
        startAutoSlide();
      });
    });

    recalcSlider();
    startAutoSlide();
  }

  const mangaGrid = document.querySelector("#manga-grid");
  const mangaPagination = document.querySelector("#manga-pagination");

  if (mangaGrid && mangaPagination) {
    const rawData = Array.isArray(window.MANGA_DATA) ? window.MANGA_DATA : [];
    const mangaData = rawData.map((item, index) => ({
      id: item.id || `manga-${index + 1}`,
      title: item.title || "Chưa có tiêu đề",
      chapter: item.chapter || "Chương 1",
      timeAgo: item.timeAgo || "Mới cập nhật",
      image: item.image || "images.jpg",
    }));

    if (!mangaData.length) {
      mangaGrid.innerHTML =
        '<p class="manga-empty-state">Chưa có dữ liệu truyện. Vui lòng thử lại sau.</p>';
      mangaPagination.innerHTML = "";
    } else {
      const itemsPerPage = 15;
      const totalPages = Math.ceil(mangaData.length / itemsPerPage);
      let currentPage = 1;

      const renderMangaPage = (page) => {
        const startIndex = (page - 1) * itemsPerPage;
        const pageItems = mangaData.slice(
          startIndex,
          startIndex + itemsPerPage,
        );

        mangaGrid.innerHTML = pageItems
          .map(
            (item) => `
              <a class="manga-card-link" href="./pages/manga-detail.html?id=${encodeURIComponent(item.id)}" aria-label="Xem chi tiết ${item.title}">
                <article class="manga-card">
                  <div class="manga-image" style="background-image: url(./assets/${item.image});">
                    <div class="manga-tag">${item.timeAgo}</div>
                  </div>
                  <div class="manga-info">
                    <div class="manga-title">${item.title}</div>
                    <div class="manga-chapter">${item.chapter}</div>
                  </div>
                </article>
              </a>
            `,
          )
          .join("");
      };

      const renderPagination = () => {
        let paginationHtml = `
          <button class="page-button" data-nav="prev" ${currentPage === 1 ? "disabled" : ""}>
            &lt;
          </button>
        `;

        for (let page = 1; page <= totalPages; page += 1) {
          paginationHtml += `
            <button class="page-button ${page === currentPage ? "active" : ""}" data-page="${page}">
              ${page}
            </button>
          `;
        }

        paginationHtml += `
          <button class="page-button" data-nav="next" ${currentPage === totalPages ? "disabled" : ""}>
            &gt;
          </button>
        `;

        mangaPagination.innerHTML = paginationHtml;
      };

      const updatePage = (targetPage) => {
        currentPage = Math.min(Math.max(1, targetPage), totalPages);
        renderMangaPage(currentPage);
        renderPagination();
      };

      mangaPagination.addEventListener("click", (event) => {
        const button = event.target.closest(".page-button");
        if (!button || button.disabled) {
          return;
        }

        const selectedPage = Number(button.dataset.page);
        const direction = button.dataset.nav;

        if (selectedPage) {
          updatePage(selectedPage);
          return;
        }

        if (direction === "prev") {
          updatePage(currentPage - 1);
        }

        if (direction === "next") {
          updatePage(currentPage + 1);
        }
      });

      updatePage(1);
    }
  }

  const menuToggle = document.querySelector(".menu-toggle");
  const searchToggle = document.querySelector(".search-toggle");
  const navDropdown = document.querySelector(".nav-home1");
  const searchBar = document.querySelector(".top_search");
  const dropdownItems = document.querySelectorAll(".navigation-dropdown li");

  if (menuToggle && navDropdown) {
    menuToggle.addEventListener("click", () => {
      navDropdown.classList.toggle("active");
    });
  }

  if (searchToggle && searchBar) {
    searchToggle.addEventListener("click", () => {
      searchBar.classList.toggle("active");
    });
  }

  dropdownItems.forEach((item) => {
    item.addEventListener("click", () => {
      const hasSubmenu = item.querySelector(
        ".home-dropdown-content1, .home-dropdown-content2",
      );
      if (window.innerWidth <= 1023 && hasSubmenu) {
        item.classList.toggle("active");
      }
    });
  });
});
