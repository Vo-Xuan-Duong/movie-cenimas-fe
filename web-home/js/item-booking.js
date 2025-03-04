// Hàm lấy bookingId từ URL
function getBookingIdFromUrl() {
    const searchParams = new URLSearchParams(window.location.search);
    return searchParams.get("bookingId");
}

console.log('ID đơn hàng:', getBookingIdFromUrl());

let bookingData; // Biến toàn cục để lưu dữ liệu từ API

// Hàm lấy chi tiết đơn hàng từ API
async function getBookingDetail() {
    try {
        const bookingId = getBookingIdFromUrl();
        console.log('ID đơn hàng:', bookingId);
        const response = await axios.get(`http://localhost:8080/api/v1/booking/getBooking/${bookingId}`);
        bookingData = response.data.data; // Lưu dữ liệu từ API vào bookingData
        console.log('Dữ liệu đơn hàng:', bookingData);
        renderBookingDetail();
    } catch (error) {
        console.error('Lỗi khi gọi API:', error);
        alert('Có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại.');
    }
}



// Hàm hiển thị thông tin đơn hàng
function renderBookingDetail() {
    if (!bookingData) return; // Kiểm tra nếu bookingData chưa được tải

    const elements = {
        bookingCode1: document.getElementById('bookingCode1'),
        bookingCode2: document.getElementById('bookingCode2'),
        movieName: document.getElementById('movieName'),
        startEndTime: document.getElementById('start-endTime'),
        showDate: document.getElementById('showDate'),
        roomName: document.getElementById('roomName'),
        cinemaName: document.getElementById('cinemaName'),
        bookingDate: document.getElementById('bookingDate')
    };
    console.log('bookingCode:', bookingData.bookingCode);
    let tickets = bookingData.tickets;
    let showTime = tickets[0].showTime;
    let movie = showTime.movie;
    console.log("Movie", movie);
    let room = showTime.room;
    let cinema = showTime.cinema;
    console.log("cinema", cinema);

    // Gán giá trị từ bookingData
    elements.bookingCode1.innerHTML = bookingData.bookingCode || 'N/A';
    elements.bookingCode2.innerHTML = bookingData.bookingCode || 'N/A';
    elements.movieName.innerHTML = `<a style="text-decoration: none;" href="item-movie.html?movieId=${movie.id}">${movie.title}</a>` || 'N/A';
    elements.startEndTime.innerHTML = `<span class="showTime_Time">${showTime.start_time} - ${showTime.end_time}</span>` || 'N/A';
    elements.showDate.innerHTML = `<span class="date">${showTime.show_date}</span>` || 'N/A';
    elements.roomName.innerHTML = room.name || 'N/A';
    elements.cinemaName.innerHTML = `<a style="text-decoration: none;" href="item-cinemas.html?cinemaId=${cinema.cinema_id}">${cinema.cinema_name}</a>` || 'N/A';
    elements.bookingDate.innerHTML = `<span class="date">${bookingData.bookingDate}</span>` || 'N/A';

    renderCustomerDetail(); // Gọi hàm hiển thị thông tin khách hàng
}


// Hàm hiển thị thông tin khách hàng
function renderCustomerDetail() {
    if (!bookingData) return; // Kiểm tra nếu bookingData chưa được tải

    const elements = {
        userName: document.getElementById('userName'),
        userPhone: document.getElementById('userPhone'),
        userEmail: document.getElementById('userEmail'),
        bookingStatus: document.getElementById('bookingStatus'),
        totalSeat: document.getElementById('totalSeat'),
        priceFree: document.getElementById('priceFree'),
        totalPrice: document.getElementById('totalPrice')
    };

    // Gán giá trị từ bookingData.user và bookingData
    const user = bookingData.user || {};
    let tickets = bookingData.tickets;
    let totalSeat = tickets.map(s => s.price).reduce((a, b) => a + b, 0);
    console.log('user:', user);
    elements.userName.innerHTML = `<a style="text-decoration: none;" href="info-user.html?userId=${user.id}">${user.username}</a>` || 'N/A';
    elements.userPhone.innerHTML = user.phone || 'N/A';
    elements.userEmail.innerHTML = user.email || 'N/A';
    elements.bookingStatus.innerHTML = checkStatus(bookingData.status) || 'N/A';
    elements.totalSeat.innerHTML = `<span class="price">${totalSeat}</span>` || 'N/A';
    elements.priceFree.innerHTML = `<span class="price">${bookingData.totalPrice - totalSeat}</span>` || 'N/A';
    elements.totalPrice.innerHTML = `<span class="price">${bookingData.totalPrice}</span>` || 'N/A';

    renderListSeat(); // Gọi hàm hiển thị danh sách ghế
}

function checkStatus(status) {
    if (status === 'CONFIRMED') {
        return `<span class="completed">Đã thanh toán</span>`;
    } else if (status === 'PENDING') {
        return `<span class="pending">Đang xử lý</span>`;
    } else {
        return `<span class="cancel">Đã hủy</span>`;
    }

}

function checkSeatType(saetType) {
    if (saetType === 'STANDARD') {
        return `<span class="seat_Type">Tiêu chuẩn</span>`;
    } else if (saetType === 'VIP') {
        return `<span class="seat_Type">VIP</span>`;
    } else {
        return `<span class="seat_Type">Ghế Đôi</span>`;
    }

}


// Hàm hiển thị danh sách ghế
function renderListSeat() {
    if (!bookingData || !bookingData.tickets) return;

    let tickets = bookingData.tickets;
    console.log('tickets:', tickets);

    const tableSeat = document.querySelector('.table-body-seat');
    let seatList = '';
    tickets.forEach(ticket => {
        seatList += `<tr>
            <td>${ticket.seatNumber || 'N/A'}</td>
            <td>${checkSeatType(ticket.seatType) || 'N/A'}</td>
            <td>${ticket.price || 'N/A'}</td>
        </tr>`;
    });
    tableSeat.innerHTML = seatList;
}

// Hàm hiển thị danh sách dịch vụ
function renderService() {
    if (!bookingData || !bookingData.services) return;

    const serviceTable = document.querySelector('.table-body-service');
    serviceTable.innerHTML = ''; // Xóa nội dung cũ

    bookingData.services.forEach(service => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${service.serviceName || 'N/A'}</td>
            <td>${service.quantity || 'N/A'}</td>
            <td>${service.unitPrice || 'N/A'}</td>
            <td>${service.totalServicePrice || 'N/A'}</td>
        `;
        serviceTable.appendChild(row);
    });
}

// Gọi hàm khi trang được tải
document.addEventListener('DOMContentLoaded', () => {
    getBookingDetail();
});