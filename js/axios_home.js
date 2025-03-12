
let currentPage = 0; // Bắt đầu từ 0 vì API Spring Boot thường sử dụng index 0
let rowsPerPage = 20;
let totalRows = 0;
let totalPages = 1;

function getAllMovies() {
    axios.get(`http://localhost:8080/api/v1/movie/allMovies?page=${currentPage}&size=${rowsPerPage}`)
        .then(function (response) {
            const data = response.data.data;
            console.log('Dữ liệu phim:', data);
            const movies = data.content; // Lấy danh sách phim từ content
            totalRows = data.totalElements; // Tổng số phim
            totalPages = data.totalPages; // Tổng số trang

            let allMovie = document.getElementById('list-movies');

            let html = '';

            if (movies && movies.length > 0) {
                movies.forEach(movie => {

                    html += `
                        <div class="movie-card">
                            <span class="movie-rating">${movie.certification}</span>
                            <div class="movie-poster-img">
                                <a href="movie-detail.html?movie_id=${movie.id}">
                                    <img src="${movie.poster || 'default.jpg'}" alt="Poster của ${movie.title}" />
                                </a>
                            </div>
                            
                            <h6 class="movie-title">${movie.title}</h6>
                            <p class="movie-genre">${movie.genres ? movie.genres.map(genres => genres.name).join(', ') : 'Không xác định'}</p>
                            <button style="border: none;" class="trailer-button" 
                                    data-bs-toggle="modal" 
                                    data-bs-target="#trailerModal" 
                                    data-trailer-id="${movie.trailer}">
                                <i class="fas fa-play-circle"></i> Xem trailer
                            </button>
                        </div>
                    `;

                });
            } else {
                html = '<p class="text-center text-white">Không có phim nào.</p>';
            }
            allMovie.innerHTML = html;

            renderPagination();
        })
        .catch(function (error) {
            console.log("Lỗi khi gọi API:", error);
            alert('Có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại.');
        });
}

function renderPagination() {
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';

    // Nút "Trước"
    const prevLi = document.createElement('li');
    prevLi.className = `page-item ${currentPage === 0 ? 'disabled' : ''}`; // Đổi điều kiện vì currentPage bắt đầu từ 0
    prevLi.innerHTML = `<button class="page-link" onclick="previousPage()"><</button>`;
    pagination.appendChild(prevLi);

    // Hiển thị các số trang
    const maxVisiblePages = 5; // Số trang tối đa hiển thị (bao gồm dấu ...)
    let startPage = Math.max(0, currentPage - 2); // Bắt đầu từ 0
    let endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 1); // Kết thúc từ 0

    if (endPage - startPage < maxVisiblePages - 1) {
        startPage = Math.max(0, endPage - maxVisiblePages + 1);
    }

    // Trang đầu tiên (0 hoặc 1, tùy API)
    if (startPage > 0) {
        const firstLi = document.createElement('li');
        firstLi.className = 'page-item';
        firstLi.innerHTML = `<span class="page-link page-number" onclick="goToPage(0)">1</span>`; // Hiển thị 1 cho người dùng, nhưng gửi 0 cho API
        pagination.appendChild(firstLi);

        if (startPage > 1) {
            const ellipsis = document.createElement('li');
            ellipsis.className = 'page-item';
            ellipsis.innerHTML = '<span class="page-link ellipsis">...</span>';
            pagination.appendChild(ellipsis);
        }
    }

    // Hiển thị các trang giữa
    for (let i = startPage; i <= endPage; i++) {
        const li = document.createElement('li');
        li.className = `page-item `;
        // Hiển thị số trang cho người dùng (i + 1), nhưng gửi i cho API
        li.innerHTML = `<span class="page-link ${currentPage === i ? 'active' : ''} page-number" onclick="goToPage(${i})">${i + 1}</span>`;
        pagination.appendChild(li);
    }

    // Trang cuối cùng nếu cần
    if (endPage < totalPages - 1) {
        if (endPage < totalPages - 2) {
            const ellipsis = document.createElement('li');
            ellipsis.className = 'page-item';
            ellipsis.innerHTML = '<span class="page-link ellipsis">...</span>';
            pagination.appendChild(ellipsis);
        }

        const lastLi = document.createElement('li');
        lastLi.className = 'page-item';
        lastLi.innerHTML = `<span class="page-link page-number" onclick="goToPage(${totalPages - 1})">${totalPages}</span>`; // Hiển thị tổng số trang
        pagination.appendChild(lastLi);
    }

    // Nút "Sau"
    const nextLi = document.createElement('li');
    nextLi.className = `page-item ${currentPage === totalPages - 1 ? 'disabled' : ''}`; // Đổi điều kiện vì currentPage bắt đầu từ 0
    nextLi.innerHTML = `<button class="page-link" onclick="nextPage()">></button>`;
    pagination.appendChild(nextLi);
}

function goToPage(page) {
    currentPage = page; // Sử dụng page trực tiếp (bắt đầu từ 0)
    getAllMovies(); // Gọi lại API với trang mới
}

function previousPage() {
    if (currentPage > 0) { // Chỉ giảm nếu > 0
        currentPage--;
        getAllMovies(); // Gọi lại API với trang mới
    }
}

function nextPage() {
    if (currentPage < totalPages - 1) { // Chỉ tăng nếu chưa phải trang cuối (tính từ 0)
        currentPage++;
        getAllMovies(); // Gọi lại API với trang mới
    }
}

function getAllMovieUpComing() {
    return axios.get('http://localhost:8080/api/v1/movie/upcoming')
        .then(function (response) {
            console.log(response.data);
            let data = response.data.data; // Lấy danh sách phim


            let upcomingMovie = document.getElementById('upcoming-movies');

            let html = '';

            if (data && data.length > 0) {
                data.forEach(movie => {

                    html += `
                        <div class="movie-card">
                            <span class="movie-rating">${movie.certification}</span>
                            <div class="movie-poster-img">
                                <a href="movie-detail.html?movie_id=${movie.id}">
                                    <img src="${movie.poster || 'default.jpg'}" alt="Poster của ${movie.title}" />
                                </a>
                            </div>
                            
                            <h6 class="movie-title">${movie.title}</h6>
                            <p class="movie-genre">${movie.genres ? movie.genres.map(genres => genres.name).join(', ') : 'Không xác định'}</p>
                            <button style="border: none;" class="trailer-button" 
                                    data-bs-toggle="modal" 
                                    data-bs-target="#trailerModal" 
                                    data-trailer-id="${movie.trailer}">
                                <i class="fas fa-play-circle"></i> Xem trailer
                            </button>
                        </div>
                    `;

                });
            } else {
                html = '<p class="text-center text-white">Không có phim nào.</p>';
            }


            upcomingMovie.innerHTML = html;

        })
        .catch(function (error) {
            console.error("Lỗi khi lấy danh sách phim:", error);
        });
}

function getAllMovieNowPlay() {
    return axios.get('http://localhost:8080/api/v1/movie/playing_now')
        .then(function (response) {
            console.log(response.data);
            let data = response.data.data; // Lấy danh sách phim

            let nowShowingMovie = document.getElementById('now-showing-movies');

            let html = '';

            if (data && data.length > 0) {
                data.forEach(movie => {

                    html += `
                        <div class="movie-card">
                            <span class="movie-rating">${movie.certification}</span>
                            <div class="movie-poster-img">
                                <a href="movie-detail.html?movie_id=${movie.id}">
                                    <img src="${movie.poster || 'default.jpg'}" alt="Poster của ${movie.title}" />
                                </a>
                            </div>
                            
                            <h6 class="movie-title">${movie.title}</h6>
                            <p class="movie-genre">${movie.genres ? movie.genres.map(genres => genres.name).join(', ') : 'Không xác định'}</p>
                            <button style="border: none;" class="trailer-button" 
                                    data-bs-toggle="modal" 
                                    data-bs-target="#trailerModal" 
                                    data-trailer-id="${movie.trailer}">
                                <i class="fas fa-play-circle"></i> Xem trailer
                            </button>
                        </div>
                    `;

                });
            } else {
                html = '<p class="text-center text-white">Không có phim nào.</p>';
            }

            nowShowingMovie.innerHTML = html;
        })
        .catch(function (error) {
            console.error("Lỗi khi lấy danh sách phim:", error);
        });
}

function initializeScrollButtons(containerSelector) {
    const movieContainer = document.querySelector(containerSelector);
    const movieList = movieContainer.querySelector('.list-show');
    const movieCards = movieList.querySelectorAll('.movie-card');
    const scrollLeftBtn = movieContainer.querySelector('.btn-scroll-prev-btn');
    const scrollRightBtn = movieContainer.querySelector('.btn-scroll-next-btn');

    const visibleMovieCount = 5;
    const cardWidth = movieCards[0]?.offsetWidth + 20 || 0; // Chiều rộng của card + khoảng cách giữa các card
    let scrollPosition = 0;

    console.log('Số lượng thẻ ', movieCards.length);

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

// Gọi hàm khi trang tải xong
document.addEventListener("DOMContentLoaded", function () {

    // Khởi tạo modal
    const trailerModal = document.getElementById('trailerModal');
    const trailerVideo = document.getElementById('trailerVideo');
    const modal = new bootstrap.Modal(trailerModal);

    // Khi modal mở, xử lý URL trailer và nhúng video
    trailerModal.addEventListener('show.bs.modal', function (event) {
        const button = event.relatedTarget; // Nút "Xem trailer" đã được nhấn
        let trailerUrl = button.getAttribute('data-trailer-id'); // Lấy toàn bộ URL trailer
        const movieTitle = button.closest('.movie-card').querySelector('.movie-title').textContent;

        console.log('URL trailer:', trailerUrl);
        console.log('Tiêu đề phim:', movieTitle);

        // Kiểm tra nếu URL là YouTube, chuyển thành URL embed
        let embedUrl = trailerUrl;
        

        // Đặt URL vào iframe
        trailerVideo.setAttribute('src', embedUrl);
        trailerModal.querySelector('.modal-title').textContent = `Trailer: ${movieTitle}`;
    });

    // Khi modal đóng, dừng video
    trailerModal.addEventListener('hidden.bs.modal', function () {
        trailerVideo.setAttribute('src', ''); // Xóa src để dừng video
    });

    getAllMovies();
    getAllMovieNowPlay().then(() => initializeScrollButtons('.main_header .list-show-movie'));
    getAllMovieUpComing().then(() => initializeScrollButtons('.main_content .list-show-movie'));
    // initializeScrollButtons('.main_header .list-show-movie');
    // initializeScrollButtons('.main_content .list-show-movie');

});

// Khởi tạo chức năng cuộn cho từng container


