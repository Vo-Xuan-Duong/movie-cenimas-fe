let currentPage = 0; // Bắt đầu từ 0 vì API Spring Boot thường sử dụng index 0
let rowsPerPage = 10;
let totalRows = 0;
let totalPages = 1;

function getAllCinemas() {
    axios.get(`http://localhost:8080/api/v1/cinemas/getAll?page=${currentPage}&size=${rowsPerPage}`)
        .then(function (response) {
            
            const data = response.data.data;
            const cinemas = data.content; // Lấy danh sách rạp từ `data`
            totalRows = data.totalElements || cinemas.length; // Tổng số rạp (tùy cấu trúc API)
            totalPages = data.totalPages || Math.ceil(totalRows / rowsPerPage); // Tổng số trang

            let tableBody = document.querySelector('.table-body');
            tableBody.innerHTML = ''; // Xóa dữ liệu cũ trước khi render mới

            cinemas.forEach(function (cinema) {
                let row = `
                            <tr>
                                <td><a style="text-decoration: none;" href="item-cinemas.html?cinema_id=${cinema.cinema_id}">${cinema.cinema_name}</a></td>
                                <td>${cinema.cinema_address}</td>
                                <td>${cinema.cinema_date}</td>
                            </tr>
                        `;
                tableBody.innerHTML += row;
            });

            renderPagination();
        })
        .catch(function (error) {
            console.error("Lỗi khi gọi API:", error);
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
        li.className = `page-item ${currentPage === i ? 'active' : ''}`;
        // Hiển thị số trang cho người dùng (i + 1), nhưng gửi i cho API
        li.innerHTML = `<span class="page-link page-number" onclick="goToPage(${i})">${i + 1}</span>`;
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
    getAllCinemas(); // Gọi lại API với trang mới
}

function previousPage() {
    if (currentPage > 0) { // Chỉ giảm nếu > 0
        currentPage--;
        getAllCinemas(); // Gọi lại API với trang mới
    }
}

function nextPage() {
    if (currentPage < totalPages - 1) { // Chỉ tăng nếu chưa phải trang cuối (tính từ 0)
        currentPage++;
        getAllCinemas(); // Gọi lại API với trang mới
    }
}

// Gọi hàm khi trang tải xong
document.addEventListener("DOMContentLoaded", getAllCinemas);