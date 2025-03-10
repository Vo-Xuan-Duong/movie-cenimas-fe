
let currentPage = 1;
let rowsPerPage = 10;
let totalRows = 0;
let totalPages = 1;

// Dữ liệu mẫu (thay bằng dữ liệu thực tế của bạn)
const movieData = [
    {
        name: "Phim 1",
        format: "2D",
        translation: "Việt Sub",
        time: "2021-10-10 10:00",
        status: "Đang chiếu"
    },
    {
        name: "Phim 2",
        format: "2D",
        translation: "Việt Sub",
        time: "2021-10-10 10:00",
        status: "Đang chiếu"
    },
    {
        name: "Phim 3",
        format: "2D",
        translation: "Việt Sub",
        time: "2021-10-10 10:00",
        status: "Đang chiếu"
    },
    {
        name: "Phim 4",
        format: "2D",
        translation: "Việt Sub",
        time: "2021-10-10 10:00",
        status: "Đang chiếu"
    },
    {
        name: "Phim 1",
        format: "2D",
        translation: "Việt Sub",
        time: "2021-10-10 10:00",
        status: "Đang chiếu"
    },
    {
        name: "Phim 1",
        format: "2D",
        translation: "Việt Sub",
        time: "2021-10-10 10:00",
        status: "Đang chiếu"
    },
    {
        name: "Phim 1",
        format: "2D",
        translation: "Việt Sub",
        time: "2021-10-10 10:00",
        status: "Đang chiếu"
    },
    {
        name: "Phim 1",
        format: "2D",
        translation: "Việt Sub",
        time: "2021-10-10 10:00",
        status: "Đang chiếu"
    }
    // Thêm các phim khác vào đây
];



function renderTable() {
    const tbody = document.querySelector('.table-body');
    tbody.innerHTML = '';

    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const paginatedData = movieData.slice(start, end);

    paginatedData.forEach(movie => {
        const row = document.createElement('tr');
        row.innerHTML = `
                    <td>${movie.name}</td>
                    <td>${movie.format}</td>
                    <td>${movie.translation}</td>
                    <td>${movie.time}</td>
                    <td><span class="status">${movie.status}</span></td>
                `;
        tbody.appendChild(row);
    });

    renderPagination();
}

function renderPagination() {
    totalRows = movieData.length;
    totalPages = Math.ceil(totalRows / rowsPerPage);
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';

    // Nút "Trước"
    const prevLi = document.createElement('li');
    prevLi.className = `page-item ${currentPage === 1 ? 'disabled' : ''}`;
    prevLi.innerHTML = `<button class="page-link" onclick="previousPage()"><</button>`;
    pagination.appendChild(prevLi);

    // Hiển thị các số trang
    const maxVisiblePages = 5; // Số trang tối đa hiển thị (bao gồm dấu ...)
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage < maxVisiblePages - 1) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // Trang đầu tiên
    if (startPage > 1) {
        const firstLi = document.createElement('li');
        firstLi.className = 'page-item';
        firstLi.innerHTML = `<span class="page-link page-number" onclick="goToPage(1)">1</span>`;
        pagination.appendChild(firstLi);

        if (startPage > 2) {
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
        li.innerHTML = `<span class="page-link ${currentPage === i ? 'active' : ''} page-number" onclick="goToPage(${i})">${i}</span>`;
        pagination.appendChild(li);
    }

    // Trang cuối cùng nếu cần
    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            const ellipsis = document.createElement('li');
            ellipsis.className = 'page-item';
            ellipsis.innerHTML = '<span class="page-link ellipsis">...</span>';
            pagination.appendChild(ellipsis);
        }

        const lastLi = document.createElement('li');
        lastLi.className = 'page-item';
        lastLi.innerHTML = `<span class="page-link page-number" onclick="goToPage(${totalPages})">${totalPages}</span>`;
        pagination.appendChild(lastLi);
    }

    // Nút "Sau"
    const nextLi = document.createElement('li');
    nextLi.className = `page-item ${currentPage === totalPages ? 'disabled' : ''}`;
    nextLi.innerHTML = `<button class="page-link" onclick="nextPage()">></button>`;
    pagination.appendChild(nextLi);
}

function goToPage(page) {
    currentPage = page;
    renderTable();
}

function previousPage() {
    if (currentPage > 1) {
        currentPage--;
        renderTable();
    }
}

function nextPage() {
    if (currentPage < totalPages) {
        currentPage++;
        renderTable();
    }
}

function getAllMovies() {
    currentPage = 1;
    renderTable();
}

document.addEventListener('DOMContentLoaded', () => {
    renderTable();
});
