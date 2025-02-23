function initializeScrollButtons(containerSelector) {
    const movieContainer = document.querySelector(containerSelector);
    const movieList = movieContainer.querySelector('.list-show');
    const movieCards = movieList.querySelectorAll('.movie-card');
    const scrollLeftBtn = movieContainer.querySelector('.btn-scroll-prev-btn');
    const scrollRightBtn = movieContainer.querySelector('.btn-scroll-next-btn');

    const visibleMovieCount = 5;
    const cardWidth = movieCards[0]?.offsetWidth + 20 || 0; // Chiều rộng của card + khoảng cách giữa các card
    let scrollPosition = 0;

    // Hiển thị hoặc ẩn các nút điều hướng
    function updateButtons() {
        scrollLeftBtn.style.display = scrollPosition > 0 ? 'block' : 'none';
        scrollRightBtn.style.display = (scrollPosition + visibleMovieCount) < movieCards.length ? 'block' : 'none';
    }

    // Xử lý sự kiện bấm nút trái
    scrollLeftBtn.onclick = function (event) {
        event.stopPropagation();
        scrollPosition = Math.max(0, scrollPosition - visibleMovieCount);
        movieList.scrollTo({ left: scrollPosition * cardWidth, behavior: 'smooth' });
        updateButtons();
    };

    // Xử lý sự kiện bấm nút phải
    scrollRightBtn.onclick = function (event) {
        event.stopPropagation();
        scrollPosition = Math.min(movieCards.length - visibleMovieCount, scrollPosition + visibleMovieCount);
        movieList.scrollTo({ left: scrollPosition * cardWidth, behavior: 'smooth' });
        updateButtons();
    };

    updateButtons(); // Cập nhật lần đầu khi trang load
}

// Khởi tạo chức năng cuộn cho từng container
initializeScrollButtons('.main_header .list-show-movie');
initializeScrollButtons('.main_content .list-show-movie');




