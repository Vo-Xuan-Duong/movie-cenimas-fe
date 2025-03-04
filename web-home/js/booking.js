let currentPage = 0; // Bắt đầu từ 0 vì API Spring Boot thường sử dụng index 0
let rowsPerPage = 10;
let totalRows = 0;
let totalPages = 1;
let bookingData = []; // Sử dụng bookingData thay vì movieData

async function getAllBookings() {
    try {
        const response = await axios.get(`http://localhost:8080/api/v1/booking/allBooking?page=${currentPage}&size=${rowsPerPage}&sort=bookingDate,desc`);
        const data = response.data.data;
        console.log('Dữ liệu bookings:', data);
        bookingData = data.content; // Lưu dữ liệu bookings từ API (giả sử API trả về `content` cho danh sách)
        totalRows = data.totalElements; // Tổng số bookings (theo chuẩn Spring Data)
        totalPages = data.totalPages; // Tổng số trang
        renderTable();
        renderPagination();
    } catch (error) {
        console.error('Lỗi khi gọi API:', error);
        alert('Có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại.');
    }
}

function renderTable() {
    const tbody = document.querySelector('.table-body');
    tbody.innerHTML = '';

    bookingData.forEach(booking => {

        let tickets = booking.tickets;
        let showTime = tickets[0].showTime;
        let room = showTime.room;

        const row = document.createElement('tr');
        // Giả sử API trả về các trường như bookingId, bookingDate, customerName, status, v.v.
        // Bạn cần thay các trường này bằng các trường thực tế từ API của bạn
        row.innerHTML = `
            <td><a style="text-decoration: none;" href="item-booking.html?bookingId=${booking.id}">${booking.bookingCode}</a></td>
            <td><a style="text-decoration: none;" href="${booking.id}">${showTime.movieName}</a></td>
            <td><span class="showTime_Time">${showTime.start_time} - ${showTime.end_time}</span> <span class="date">${showTime.show_date}</span> </td>
            <td>${room.name}</td>
            ${checkStatus(booking.status)}
            <td>${booking.totalPrice.toLocaleString('vi-VN') + 'đ'}</td>
            <td><span class="date">${booking.bookingDate}</span></td>
        `;
        tbody.appendChild(row);
    });
}

function checkStatus(status) {
    if (status === 'CONFIRMED') {
        return `<td><span class="completed">Đã thanh toán</span></td>`;
    } else if (status === 'PENDING') {
        return `<td><span class="pending">Đang xử lý</span></td>`;
    } else {
        return `<td><span class="cancel">Đã hủy</span></td>`;
    }

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
    getAllBookings(); // Gọi lại API với trang mới
}

function previousPage() {
    if (currentPage > 0) { // Chỉ giảm nếu > 0
        currentPage--;
        getAllBookings(); // Gọi lại API với trang mới
    }
}

function nextPage() {
    if (currentPage < totalPages - 1) { // Chỉ tăng nếu chưa phải trang cuối (tính từ 0)
        currentPage++;
        getAllBookings(); // Gọi lại API với trang mới
    }
}






// Khởi tạo khi tải trang
document.addEventListener('DOMContentLoaded', () => {
    getAllBookings();
});