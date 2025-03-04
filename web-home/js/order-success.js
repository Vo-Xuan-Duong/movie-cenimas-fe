function handlePaymentReturn() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.size === 0) return;

    showLoading(true);

    axios.get(`http://localhost:8080/api/v1/payment/return_payment${window.location.search}`, {
        headers: {
            'Content-Type': 'application/json',
            // Thêm header Authorization nếu cần
            // 'Authorization': 'Bearer your-token'
        }
    })
    .then(response => {
        showLoading(false);
        console.log("Full API response from browser:", response.data);
        console.log("Booking data:", response.data.data?.booking);
        console.log("QR Code value:", response.data.data?.booking?.qrCode);

        const data = response.data;
        const bookingData = data.data?.booking;
        if (!bookingData || !Array.isArray(bookingData.tickets) || bookingData.tickets.length === 0) {
            throw new Error('Dữ liệu đặt vé không hợp lệ');
        }

        const tickets = bookingData.tickets;
        const showTime = tickets[0]?.showTime;
        if (!showTime) throw new Error('Không có thông tin suất chiếu');

        const price_seat = tickets.map(s => s.price).reduce((a, b) => a + b, 0);

        const elements = {
            movie_name: document.querySelector('.name-movie'),
            movie_time: document.querySelector('.showtime-time'),
            movie_date: document.querySelector('.showtime-date'),
            theater_title: document.querySelector('.cinema_title'),
            theater_address: document.querySelector('.cinema_address'),
            movie_seat: document.querySelector('.seats'),
            movie_room: document.querySelector('.room-movie'),
            type_movie: document.querySelector('.type-movie'),
            total_price_seat: document.querySelector('.price-seat'),
            bookingCode: document.querySelector('.bookingCode'),
            price_gg: document.querySelector('.price-gg'),
            price_tt: document.querySelector('.price-tt'),
            total_price: document.querySelector('.total-price')
        };

        // Cập nhật các phần tử DOM (kiểm tra null trước)
        if (elements.movie_name) elements.movie_name.innerHTML = showTime.movieName || '';
        if (elements.movie_time) elements.movie_time.innerHTML = `${showTime.start_time || ''} ~ ${showTime.end_time || ''}`;
        if (elements.movie_date) elements.movie_date.innerHTML = showTime.show_date || '';
        if (elements.theater_title) elements.theater_title.innerHTML = showTime.cinema?.cinema_name || '';
        if (elements.theater_address) elements.theater_address.innerHTML = showTime.cinema?.cinema_address || '';
        if (elements.movie_room) elements.movie_room.innerHTML = showTime.room?.name || '';
        if (elements.movie_seat) elements.movie_seat.innerHTML = tickets.map(s => s.seatNumber).join(', ') || '';
        if (elements.type_movie) elements.type_movie.innerHTML = showTime.room?.type || '';
        if (elements.total_price_seat) elements.total_price_seat.innerHTML = price_seat.toLocaleString('vi-VN') + 'đ';
        if (elements.price_tt) elements.price_tt.innerHTML = price_seat.toLocaleString('vi-VN') + 'đ';
        if (elements.bookingCode) elements.bookingCode.innerHTML = bookingData.bookingCode || '';

        let total_price_gg = (bookingData.totalPrice || 0) - price_seat;
        if (elements.price_gg) elements.price_gg.innerHTML = total_price_gg.toLocaleString('vi-VN') + 'đ';
        if (elements.total_price) elements.total_price.innerHTML = (bookingData.totalPrice || 0).toLocaleString('vi-VN') + 'đ';

        // Xử lý QR code
        const qrImage = document.getElementById('qr-code-img');
        if (bookingData.qrCode) {
            console.log("QR Code Base64:", bookingData.qrCode);
            if (qrImage) {
                qrImage.src = `data:image/png;base64,${bookingData.qrCode}`;
            } else {
                console.warn('Không tìm thấy phần tử QR code trong DOM');
            }
        } else {
            console.warn('QR Code is null or undefined in API response');
            if (qrImage) {
                qrImage.src = '';
                qrImage.alt = 'QR code không khả dụng';
            }
            
        }

        const downloadButton = document.getElementById('download-qr-btn');
        if (downloadButton && qrImage && qrImage.src) {
            downloadButton.onclick = () => {
                const link = document.createElement('a');
                link.href = qrImage.src;
                link.download = `${bookingData.bookingCode}_qrcode.png`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            };
        } else if (downloadButton) {
            downloadButton.disabled = true;
        }
    })
    .catch(error => {
        console.error('Error:', error.response ? error.response.data : error.message);
        showLoading(false);
        const errorElement = document.getElementById('error-message');
        showError(errorElement, 'Lỗi khi lấy kết quả thanh toán. Vui lòng thử lại!');
    });
}



function showLoading(isLoading) {
    const loadingElement = document.getElementById('loading');
    if (isLoading) {
        loadingElement.classList.remove('hidden');
    } else {
        loadingElement.classList.add('hidden');
    }
}



window.onload = function () {
    if (window.location.pathname.includes('order-success.html')) {
        handlePaymentReturn();
    }
};