function initializeScrollButtons(containerSelector) {
    const movieContainer = document.querySelector(containerSelector);
    const movieList = movieContainer.querySelector('.show-list-date');
    const movieCards = movieList.querySelectorAll('.date-item');
    const scrollLeftBtn = movieContainer.querySelector('.btn-date-selector-left');
    const scrollRightBtn = movieContainer.querySelector('.btn-date-selector-right');

    const visibleMovieCount = 1;
    const cardWidth = movieCards[0]?.offsetWidth + 10 || 0; // Chiều rộng của card + khoảng cách giữa các card
    let scrollPosition = 0;
    console.log("cardWidth = ", cardWidth);
    console.log("số lượng item : ", movieCards.length);
    // Hiển thị hoặc ẩn các nút điều hướng
    function updateButtons() {
        scrollLeftBtn.style.display = scrollPosition > 0 ? 'block' : 'none';
        console.log("scrollPosition = ", scrollPosition);
        scrollRightBtn.style.display = (scrollPosition + 10) < movieCards.length ? 'block' : 'none';
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

initializeScrollButtons('.description-movie-main .date-selector');