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

            let data = response.data.data; // Đảm bảo API trả về đúng định dạng
            let theaterList = document.querySelector('.list-theater-item');

            let html = '';

            if (data && data.length > 0) {
                data.forEach(theater => {
                    let showtimesHtml = '';

                    console.log("Số lượng suất chiếu:", theater.showTime ? theater.showTime.length : 0);

                    if (theater.showTime && theater.showTime.length > 0) {
                        showtimesHtml = theater.showTime.map(showtime => {
                            let showtimeData = encodeURIComponent(JSON.stringify(showtime)); // Encode dữ liệu
                            return `
                            <div data-bs-toggle="modal" data-bs-target="#ticket" 
                                 onclick="showSeatForShowtime('${showtimeData}')" 
                                 class="time-slot">
                              <span class="highlight">${showtime.start_time}</span> ~ ${showtime.end_time}
                            </div>
                          `;
                        }).join('');
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

// Gọi hàm để hiển thị danh sách rạp
showListTheater(movieId);


// 🚀 Cập nhật hiển thị ghế cho suất chiếu
function showSeatForShowtime(encodedShowtime) {
    let showTime = JSON.parse(decodeURIComponent(encodedShowtime));
    console.log("Suất chiếu:", showTime);


    axios.get(`http://localhost:8080/api/v1/seat/allSeatToShowTime?showTimeId=${showTime.id}`)
        .then(function (response) {
            console.log("Danh sách ghế:", response.data.data);

            let seatData = response.data.data; // Lấy danh sách ghế
            let selectedSeats = [];
            let totalPrice = 0;

            // Xóa ghế cũ trước khi hiển thị ghế mới
            $('#seat-map').empty();

            const rows = [...new Set(seatData.map(seat => seat.seatNumber.charAt(0)))];

            rows.forEach(row => {
                const rowSeats = seatData.filter(seat => seat.seatNumber.startsWith(row));
                const rowDiv = $('<div class="d-flex justify-content-center"></div>');

                rowSeats.forEach(seat => {
                    let seatClass = 'seat-available';
                    let seatPrice = showTime.price; // Giá mặc định

                    if (seat.seatStatus === 'OCCUPIED') {
                        seatClass = 'seat-booked';
                    } else {
                        if (seat.seatType === 'VIP') {
                            seatClass = 'seat-vip';
                            seatPrice += 50000; // Cộng thêm 50K
                        } else if (seat.seatType === 'COUPLE') {
                            seatClass = 'seat-couple';
                            seatPrice += 100000; // Cộng thêm 100K
                        }
                    }

                    const seatDiv = $('<div></div>')
                        .addClass(`seat ${seatClass}`)
                        .text(seat.seatNumber)
                        .attr('id', seat.seatNumber)
                        .data('seatId', seat.id)
                        .data('price', seatPrice); // Lưu giá tiền vào data của thẻ ghế

                    seatDiv.click(function () {
                        if (!$(this).hasClass('seat-booked')) {
                            $(this).toggleClass('seat-selected');
                            const seatId = $(this).attr('id');
                            const seat_id = $(this).data('seatId');
                            const seatPrice = $(this).data('price');

                            if (selectedSeats.some(s => s.id === seatId)) {
                                selectedSeats = selectedSeats.filter(s => s.id !== seatId);
                            } else {
                                selectedSeats.push({ id: seatId, seatId: seat_id, price: seatPrice });
                            }

                            $('#selected-seats').text(selectedSeats.length ? selectedSeats.map(s => s.id).join(', ') : 'Chưa chọn ghế nào');

                            // Tính tổng tiền
                            totalPrice = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);
                            $('#total-price').text(totalPrice.toLocaleString('vi-VN') + 'đ');
                        }
                    });

                    rowDiv.append(seatDiv);
                });

                $('#seat-map').append(rowDiv);
            });

            //xử lí tên phim
            document.querySelector('.text-center').innerHTML = `${showTime.movieName} - ${showTime.start_time} ~ ${showTime.end_time} - ${showTime.show_date} - ${showTime.room.name} - ${showTime.room.format}`

            // Xử lý mua vé
            $('#buy-ticket').off('click').on('click', function () {
                if (selectedSeats.length > 0) {
                    // alert('Bạn đã mua vé cho các ghế: ' + selectedSeats.map(s => s.id).join(', ') +
                    //       '\nTổng cộng: ' + totalPrice.toLocaleString('vi-VN') + 'đ');
                    showDetailTicket(encodedShowtime, selectedSeats, totalPrice);
                } else {
                    alert('Vui lòng chọn ghế trước khi mua vé.');
                }
            });

        })
        .catch(function (error) {
            console.error("Lỗi khi lấy danh sách ghế:", error);
        });
}



//Xử lí phần chọn phương thức thanh toán

let method_payment = "VNPAY";

document.querySelectorAll('.dropdown-item').forEach(item => {
    item.addEventListener('click', function (e) {
        e.preventDefault();
        let selectedValue = this.getAttribute('data-value');
        let selectedImg = this.querySelector('img').getAttribute('src');
        let selectedText = this.innerText.trim();
        document.getElementById('paymentDropdown').innerHTML = `<img src="${selectedImg}" style="width: 30px; height: 30px; margin-right: 10px;" alt="logo paypal"> ${selectedText}`;
        method_payment = selectedValue;
        console.log("Bạn đã chọn phương thức thanh toán:", selectedValue);

    });
});


//xử lí phần xác nhận thanh toán

function showDetailTicket(encodedShowtime, selectedSeats, totalPrice) {

    let showTime = JSON.parse(decodeURIComponent(encodedShowtime));

    document.getElementById('showtime_id').value = showTime.id;
    let movie_name = document.querySelector('.name-movie');
    let movie_time = document.querySelector('.showtime-time');
    let movie_date = document.querySelector('.showtime-date');
    let theater_title = document.querySelector('.cinema_title');
    let theater_address = document.querySelector('.cinema_address');
    let movie_seat = document.querySelector('.seats');
    let movie_room = document.querySelector('.room-movie');
    let type_movie = document.querySelector('.type-movie');
    let total_price = document.querySelector('.price-seat');
    console.log("tổng tiền ghế : ", totalPrice);

    movie_name.innerHTML = showTime.movieName;
    movie_time.innerHTML = showTime.start_time + " ~ " + showTime.end_time;
    movie_date.innerHTML = showTime.show_date;
    theater_title.innerHTML = showTime.cinema.cinema_name;
    theater_address.innerHTML = showTime.cinema.cinema_address;
    movie_room.innerHTML = showTime.room.name;
    movie_seat.innerHTML = selectedSeats.map(s => s.id).join(', ');
    document.getElementById('seats').value = selectedSeats.map(s => s.seatId).join(',');
    type_movie.innerHTML = showTime.room.format;
    total_price.innerHTML = totalPrice.toLocaleString('vi-VN') + 'đ';

    document.querySelector('.price-tt').innerHTML = totalPrice.toLocaleString('vi-VN') + 'đ';
    document.querySelector('.total-price').innerHTML = totalPrice.toLocaleString('vi-VN') + 'đ';

    var bookingModal = new bootstrap.Modal(document.getElementById('booking'), {

        focus: false
    });

    bookingModal.show();

}

function resetDiscount() {
    // Lấy instance đã tồn tại thay vì tạo mới
    var bookingModal = bootstrap.Modal.getInstance(document.getElementById('booking'));

    if (bookingModal) {
        bookingModal.hide(); // Đóng modal nếu đã tồn tại
    }

    // Xóa giá trị input
    document.getElementById('discount').value = '';

    document.getElementById('openModalButton').focus();
}


function checkDiscount() {
    // Lấy mã giảm giá từ ô nhập
    let discountCode = document.getElementById('discount').value.trim().toUpperCase();
    let originalPriceText = document.querySelector('.price-tt').innerText.replace(/[^\d]/g, ''); // Lấy giá trị tạm tính
    let originalPrice = parseInt(originalPriceText); // Chuyển thành số

    // Gửi yêu cầu kiểm tra mã giảm giá
    axios.get(`http://localhost:8080/api/v1/discount/check/${discountCode}`)
        .then(function (response) {
            console.log("Kiểm tra mã giảm giá:", response.data.data);

            let percent = response.data.data.discountAmount;

            let discountAmount = 0;

            // Áp dụng giảm giá
            if (discountCode === 'FREESHIP') {
                discountAmount = 15000; // Giảm 15,000đ
            } else {
                discountAmount = originalPrice * percent / 100; // Giảm theo %
            }

            // Tính tổng tiền sau giảm giá
            let totalPrice = originalPrice - discountAmount;
            totalPrice = totalPrice > 0 ? totalPrice : 0; // Đảm bảo không âm

            // Cập nhật giao diện
            document.querySelector('.total-price').innerText = totalPrice.toLocaleString('vi-VN') + ' đ';
        })
        .catch(function (error) {
            console.error("Lỗi khi kiểm tra mã giảm giá:", error);
            alert("Mã giảm giá không hợp lệ hoặc có lỗi xảy ra!");
        });
}


function payment() {
    let showtime_id = document.getElementById('showtime_id').value;
    let seats = document.getElementById('seats').value.split(',');
    let discount = document.getElementById('discount').value.trim().toUpperCase();
    let totalPrice = document.querySelector('.total-price').innerText.replace(/[^\d]/g, ''); // Lấy giá trị tổng tiền

    // Kiểm tra dữ liệu
    console.log("ID suất chiếu:", showtime_id);
    console.log("Ghế đã chọn:", seats);
    console.log("Mã giảm giá:", discount);
    console.log("Tổng tiền:", totalPrice);

    // Gửi yêu cầu thanh toán
    axios.post(`http://localhost:8080/api/v1/booking/create`, {
        showTimeId: showtime_id,
        seatIds: seats,
        paymentMethod: method_payment,
        discountCode: discount
    })
        .then(function (response) {
            console.log("Kết quả thanh toán:", response.data.data);
            let orderInfo = response.data.data.bookingCode;
            axios.post(`http://localhost:8080/api/v1/payment/create_payment?amount=${response.data.data.totalPrice}&orderInfo=${encodeURIComponent(orderInfo)}&methodPayment=${method_payment}`)
                .then(function (response) {
                    console.log("Kết quả thanh toán:", response.data.data);
                    let paymentUrl = response.data.data.url;
                    window.location.href = paymentUrl;
                })
                .catch(function (error) {
                    console.error("Lỗi khi thanh toán:", error);
                    alert("Thanh toán thất bại! Vui lòng thử lại.");
                });
        })
        .catch(function (error) {
            console.error("Lỗi khi thanh toán:", error);
            alert("Thanh toán thất bại! Vui lòng thử lại.");
        });

}


