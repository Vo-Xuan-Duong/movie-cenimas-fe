let currentPage = 0; // Bắt đầu từ 0 vì API Spring Boot thường sử dụng index 0
let rowsPerPage = 10;
let totalRows = 0;
let totalPages = 1;

function getAllDiscount() {
    axios.get(`http://localhost:8080/api/v1/discount/alldiscount?page=${currentPage}&size=${rowsPerPage}`)
        .then(function (response) {
            if (!response.data || !response.data.data || !response.data.data.content) {
                console.error("Dữ liệu API không hợp lệ:", response);
                alert("Lỗi khi lấy dữ liệu, vui lòng thử lại!");
                return;
            }
            const data = response.data.data;
            console.log('Dữ liệu discount:', data);
            const discounts = data.content;
            totalRows = data.totalElements;
            console.log('Tổng số dòng:', totalRows);
            if (totalRows < 10) {
                document.querySelector('.pagination_display').style.display = 'none';
            }
            totalPages = data.totalPages;

            let table = document.querySelector('.table-body');
            table.innerHTML = "";

            discounts.forEach(discount => {
                let row = `
                    <tr>
                        <td>${discount.code}</td>
                        <td>${discount.discountRate}</td>
                        <td>${discount.discountAmount}</td>
                        <td>${discount.quantity}</td>
                        <td><span class="status">${discount.status}</span></td>
                        <td>${discount.createDate}</td>
                        <td>
                            <button class="btn btn-primary" data-bs-toggle="modal"
                                data-bs-target="#updateDiscountModal" onclick="addDiscountUpdate(${discount.id}, '${discount.code}', ${discount.discountRate}, ${discount.discountAmount}, ${discount.quantity}, '${discount.status}')">
                                <i class="fa-solid fa-pen-to-square"></i>
                            </button>
                            <button class="btn btn-danger" onclick="addDiscountDelete(${discount.id}, '${discount.code}')" data-bs-toggle="modal" data-bs-target="#deleteDiscountModal">
                                <i class="fa-solid fa-trash-can"></i>
                            </button>
                        </td>
                    </tr>
                `;
                table.innerHTML += row;
            });

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
    getAllDiscount(); // Gọi lại API với trang mới
}

function previousPage() {
    if (currentPage > 0) { // Chỉ giảm nếu > 0
        currentPage--;
        getAllDiscount(); // Gọi lại API với trang mới
    }
}

function nextPage() {
    if (currentPage < totalPages - 1) { // Chỉ tăng nếu chưa phải trang cuối (tính từ 0)
        currentPage++;
        getAllDiscount(); // Gọi lại API với trang mới
    }
}

function createDiscount() {
    let discount = {
        code: document.getElementById("createCodeDiscount").value,
        discountRate: document.getElementById("createDiscountRate").value,
        discountAmount: document.getElementById("createDiscountAmount").value,
        quantity: document.getElementById("createquantity").value,
        status: document.getElementById("createStatus").value
    };

    if (Object.values(discount).some(val => val === "")) {
        alert("Vui lòng nhập đầy đủ thông tin");
        return;
    }
    
    axios.post(`http://localhost:8080/api/v1/discount/create`, discount)
        .then(() => {
            alert('Tạo mã giảm giá thành công');
            getAllDiscount();
        })
        .catch(error => {
            console.error("Lỗi khi gọi API:", error);
            alert('Có lỗi xảy ra khi tạo mã giảm giá. Vui lòng thử lại.');
        });
}

function deleteDiscount() {
    let id = document.getElementById("deleteIdDiscount").value;
    if (!id) {
        alert("Vui lòng chọn mã giảm giá để xóa!");
        return;
    }

    if (confirm("Bạn có chắc chắn muốn xóa mã giảm giá này không?")) {
        axios.delete(`http://localhost:8080/api/v1/discount/delete/${id}`)
            .then(() => {
                alert('Xóa mã giảm giá thành công');
                getAllDiscount();
            })
            .catch(error => {
                console.error("Lỗi khi gọi API:", error);
                alert('Có lỗi xảy ra khi xóa mã giảm giá. Vui lòng thử lại.');
            });
    }
}

function addDiscountUpdate(idDiscount, codeDiscount, updatediscountRate, updatediscountAmount, updatequantity, updatestatus) {
    document.getElementById("updateId").value = idDiscount;
    document.getElementById("updateCodeDiscount").value = codeDiscount;
    document.getElementById("updateDiscountRate").value = updatediscountRate;
    document.getElementById("updateDiscountAmount").value = updatediscountAmount;
    document.getElementById("updatequantity").value = updatequantity;
    document.getElementById("updateStatus").value = updatestatus;
}

function addDiscountDelete(idDiscount, codeDiscount) {
    document.getElementById("deleteCodeDiscount").innerHTML = codeDiscount;
    document.getElementById("deleteIdDiscount").value = idDiscount;
}

function updateDiscount() {
    let id = document.getElementById("updateId").value;
    let discount = {
        code: document.getElementById("updateCodeDiscount").value,
        discountRate: document.getElementById("updateDiscountRate").value,
        discountAmount: document.getElementById("updateDiscountAmount").value,
        quantity: document.getElementById("updatequantity").value,
        status: document.getElementById("updateStatus").value
    };

    if (Object.values(discount).some(val => val === "")) {
        alert("Vui lòng nhập đầy đủ thông tin");
        return;
    }

    axios.put(`http://localhost:8080/api/v1/discount/update/${id}`, discount)
        .then(() => {
            alert('Cập nhật mã giảm giá thành công');
            getAllDiscount();
        })
        .catch(error => {
            console.error("Lỗi khi gọi API:", error);
            alert('Có lỗi xảy ra khi cập nhật mã giảm giá. Vui lòng thử lại.');
        });
}

document.addEventListener("DOMContentLoaded", getAllDiscount);
