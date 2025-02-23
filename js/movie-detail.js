function getMovieIdFromUrl() {
    let searchParams = new URLSearchParams(window.location.search);
    return searchParams.get("movie_id");
}

const movieId = getMovieIdFromUrl();
console.log("Movie ID:", movieId);

function getAllMovie() {
    axios.get('http://localhost:8080/api/v1/movie/allMovies')
        .then(function (response) {
            console.log(response.data);
            let data = response.data.data; // Lấy danh sách phim

            let upcomingMovie = document.getElementById('upcoming-movies');

            let html = '';

            if (data && data.length > 0) {
                data.forEach(movie => {
                    html += `
                        <div class="movie-item row">
                                <div class="col-3">
                                    <a href="movie-detail.html?movie_id=${movie.id}">
                                    <img src="${movie.posterUrl || 'default.jpg'}" alt="Poster của ${movie.title}" class="movie-item-img img-fluid" />
                                </a>
                                </div>
                                <div class="col-9">
                                    <span class="movie-item-age-rating">${movie.rating}</span>
                                    <p class="movie-title"><b>${movie.title}</b>
                                    </p>
                                    <p class="movie-genre">${movie.genre ? movie.genre.join(', ') : 'Không xác định'}</p>
                                    <div class="movie-rating">
                                        <span>⭐</span>
                                        <span>${movie.rating}</span>
                                    </div>
                                </div>
                            </div>
                            <hr>
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

getAllMovie();

function getMovieDetail() {
    if (!movieId) {
        console.error("Không tìm thấy ID phim.");
        return;
    }

    axios.get(`http://localhost:8080/api/v1/movie/getMovie/${movieId}`)
        .then(function (response) {
            console.log("Dữ liệu phim:", response.data);

            let data = response.data?.data || response.data; // Lấy thông tin phim

            // Lấy phần tử DOM
            let rating = document.querySelector('.movie-rating');
            let title = document.querySelector('.movie-title');
            let title_1 = document.querySelector('.movie-title-1');
            let poster = document.querySelector('.description-movie-img');
            let genre = document.querySelector('.movie-genre');
            let trailer = document.querySelector('.btn-trailer');
            let description = document.querySelector('.description-movie-content');
            let duration = document.querySelector('.movie-duration');
            let releaseDate = document.querySelector('.movie-release-date');

            if (data) {
                rating.innerHTML = data.rating || "Chưa có đánh giá";
                title.innerHTML = data.title || "Không có tiêu đề";
                title_1.innerHTML = data.title || "Không có tiêu đề";
                poster.src = data.posterUrl || 'default.jpg';
                genre.innerHTML = data.genre ? data.genre.join(', ') : 'Không xác định';
                trailer.href = data.trailerUrl || "#";
                description.innerHTML = data.description || "Không có mô tả";
                duration.innerHTML = data.duration || "Không rõ thời lượng";
                releaseDate.innerHTML = data.releaseDate || "Không có ngày phát hành";
            }
        })
        .catch(function (error) {
            console.error("Lỗi khi lấy thông tin phim:", error);
        });
}

// Gọi hàm lấy thông tin phim
getMovieDetail();


function showListTheater(movieId) {
    axios.get(`http://localhost:8080/api/v1/showtime/getByMovie/${movieId}`)
        .then(function (response) {
            console.log("Danh sách rạp chiếu phim:", response.data);

            let data = response.data.data; // Lấy danh sách rạp chiếu phim
            let theaterList = document.querySelector('.list-theater-item'); // Sửa lại selector

            let html = '';

            if (data && data.length > 0) {
                data.forEach(theater => {
                    let showtimesHtml = '';
                    console.log("số lượng showTime : ", theater.showTime.length);

                    if (theater.showTime && theater.showTime.length > 0) {
                        showtimesHtml = theater.showTime.map(showtime => `
                            <div data-bs-toggle="modal" data-bs-target="#ticket" class="time-slot">
                                <span class="highlight">${showtime.start_time}</span> ~ ${showtime.end_time}
                            </div>
                        `).join('');

                    } else {
                        showtimesHtml = '<p class="text-center text-muted">Không có suất chiếu</p>';
                    }

                    html += `

                        <div class="list-theater-item-main">
                            <div class="row">
                                <div class="theater-item-main-logo col-1">
                                    <img src="/img/logo-rapchieuphim.avif" alt="logo">
                                </div>
                                <div class="theater-item-main-content col-9">
                                    <p style="font-weight: 16px;margin-bottom: 0;">${theater.cinema_name}</p>
                                    <p style="font-size: 12px; color: rgb(169, 169, 169);margin-bottom: 0;">
                                        ${theater.cinema_address} 
                                        ${theater.cinema_address_map ? `<a href="${theater.cinema_address_map}">[Bản đồ]</a>` : ''}
                                    </p>
                                </div>
                            </div>
                            <div class="showtime">
                                <div class="schedule">2D Phụ đề</div>
                                ${showtimesHtml}
                            </div>
                        </div>
                        <hr>
                    `;
                });
            } else {
                html = '<p class="text-center text-white">Không có suất chiếu nào chiếu phim này.</p>';
            }

            theaterList.innerHTML = html;

        })
        .catch(function (error) {
            console.error("Lỗi khi lấy danh sách rạp chiếu phim:", error);
        });
}

showListTheater(movieId);



function showSeatForShowtime(showTime_id) {

    

    let selectedSeats = [];
    let totalPrice = 0;

    $(document).ready(function () {
        const rows = [...new Set(seatData.map(seat => seat.seatNumber.charAt(0)))];
        rows.forEach(row => {
            const rowSeats = seatData.filter(seat => seat.seatNumber.startsWith(row));
            const rowDiv = $('<div class="d-flex justify-content-center"></div>');
            rowSeats.forEach(seat => {
                let seatClass = 'seat-available';
                if (seat.seatStatus === 'occupied') seatClass = 'seat-booked';
                else if (seat.seatType === 'VIP') seatClass = 'seat-vip';

                const seatDiv = $('<div></div>')
                    .addClass(`seat ${seatClass}`)
                    .text(seat.seatNumber)
                    .attr('id', seat.seatNumber);

                seatDiv.click(function () {
                    if (!$(this).hasClass('seat-booked')) {
                        $(this).toggleClass('seat-selected');
                        const seatId = $(this).attr('id');
                        if (selectedSeats.includes(seatId)) {
                            selectedSeats = selectedSeats.filter(s => s !== seatId);
                        } else {
                            selectedSeats.push(seatId);
                        }
                        $('#selected-seats').text(selectedSeats.length ? selectedSeats.join(', ') : 'Chưa chọn ghế nào');
                        totalPrice = selectedSeats.length * 75000;
                        $('#total-price').text(totalPrice.toLocaleString('vi-VN') + 'đ');
                    }
                });
                rowDiv.append(seatDiv);
            });
            $('#seat-map').append(rowDiv);
        });

        $('#buy-ticket').click(function () {
            if (selectedSeats.length > 0) {
                alert('Bạn đã mua vé cho các ghế: ' + selectedSeats.join(', ') + '\nTổng cộng: ' + totalPrice.toLocaleString('vi-VN') + 'đ');
            } else {
                alert('Vui lòng chọn ghế trước khi mua vé.');
            }
        });
    });
}

