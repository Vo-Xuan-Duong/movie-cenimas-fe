document.addEventListener("DOMContentLoaded", function () {
    const seatContainer = document.getElementById("seatContainer");
    const rows = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N"];
    const cols = 12;
    const seatTypes = ["standard", "standard", "standard", "vip", "vip", "vip", "vip", "vip", "standard", "standard", "standard", "standard", "standard",
        "couple", "couple", "couple", "couple", "couple", "couple", "couple", "couple", "couple", "couple"];

    rows.forEach((row, rowIndex) => {
        let rowDiv = document.createElement("div");
        rowDiv.classList.add("d-flex", "justify-content-center", "align-items-center");

        for (let col = 1; col <= cols; col++) {
            let seat = document.createElement("div");
            let seatNumber = `${row}${col}`;
            seat.innerText = seatNumber;

            // Gán kiểu ghế ngẫu nhiên
            let seatType = seatTypes[rowIndex] || "standard";
            seat.classList.add("seat", `seat-${seatType}`);

            // Một số ghế không khả dụng
            if (Math.random() < 0.05) {
                seat.classList.add("seat-disabled");
            }

            // Sự kiện chọn ghế
            seat.addEventListener("click", function () {
                if (!seat.classList.contains("seat-disabled")) {
                    seat.classList.toggle("seat-selected");
                }
            });

            rowDiv.appendChild(seat);
        }

        // Nút chỉnh sửa hàng ghế
        let editButton = document.createElement("button");
        editButton.innerText = "✏";
        editButton.classList.add("edit-button");
        rowDiv.appendChild(editButton);

        seatContainer.appendChild(rowDiv);
    });
});

function getCinemasIdformUrl() {
    let searchParams = new URLSearchParams(window.location.search);
    return searchParams.get("cinema_id");
}

const cinemaId = getCinemasIdformUrl();
console.log(cinemaId);

function goBack() {
    window.history.back();
}

function getCinemaById(cinemaId) {
    axios.get(`http://localhost:8080/api/v1/cinemas/get_cinema/${cinemaId}`)
        .then(function (response) {
            console.log(response.data);
            let cinema = response.data.data;
            let cinemaName = document.getElementById("cinemaName2");
            document.getElementById("cinemaName1").innerHTML = cinema.cinema_name;
            let cinemaAddress = document.getElementById("cinemaAddress");
            let cinemaDate = document.getElementById("cinemaAddressMap");
            let iframe = document.getElementById("myIframe");
            let bodyTable = document.getElementById("bodyTable");
            bodyTable.innerHTML = '';

            cinemaName.value = cinema.cinema_name;
            cinemaAddress.value = cinema.cinema_address;
            cinemaDate.value = cinema.cinema_address_map;
            iframe.src = cinema.cinema_address_map;
            let rooms = cinema.rooms;

            if (rooms.length === 0) {
                bodyTable.innerHTML = `
                    <tr>
                        <td colspan="5" class="text-center">Không có dữ liệu</td>
                    </tr>
                `;
                return;
            }

            rooms.forEach(function (room) {
                let row = `
                    <tr>
                        <td>${room.name}</td>
                        <td>${room.room_type}</td>
                        <td>${room.capacity}</td>
                        <td>${room.date}</td>
                        <td>
                            
                            <button class="btn btn-secondary" data-bs-toggle="modal"
                                data-bs-target="#seatModal"><i
                                    class="fa-solid fa-border-none fa-xl"></i></button>
                            
                            <button class="btn btn-primary" data-bs-toggle="modal"
                                data-bs-target="#updateRoomModal"><i
                                    class="fa-solid fa-pen-to-square fa-lg"></i></button>
                            
                            <button class="btn btn-danger" data-bs-toggle="modal"
                                data-bs-target="#deleteRoomModal"  onclick="deleteRoom(${room.id},'${room.name}')"><i
                                    class="fa-solid fa-trash-can fa-xl"></i></button>
                        </td>
                    </tr>
                `;
                bodyTable.innerHTML += row;
            });

        })
        .catch(function (error) {
            console.error("Lỗi khi gọi API:", error);
        });
}



document.getElementById("createForm").addEventListener("submit", function (event) {
    event.preventDefault();
    let room_name = document.getElementById("roomName").value;
    let room_type = document.getElementById("roomType").value;
    let seat_quantity = document.getElementById("numberSeat").value;
    let cinema = {
        room_name: room_name,
        room_type: room_type,
        seat_quantity: seat_quantity
    };
    axios.post(`http://localhost:8080/api/v1/room/create/${cinemaId}`, cinema)
        .then(function (response) {
            console.log(response.data);
            alert("Thêm phòng thành công");
            getCinemaById(cinemaId);

            let room = response.data.data;

            let bodyTable = document.getElementById("bodyTable");
            let row = `
                    <tr>
                        <td>${room.name}</td>
                        <td>${room.type}</td>
                        <td>${room.capacity}</td>
                        <td>${room.date}</td>
                        <td>
                            
                            <button class="btn btn-secondary" data-bs-toggle="modal"
                                data-bs-target="#seatModal"><i
                                    class="fa-solid fa-border-none fa-xl"></i></button>
                            
                            <button class="btn btn-primary" data-bs-toggle="modal"
                                data-bs-target="#updateRoomModal"><i
                                    class="fa-solid fa-pen-to-square fa-lg"></i></button>
                            
                            <button class="btn btn-danger" data-bs-toggle="modal"
                                data-bs-target="#deleteRoomModal"  onclick="deleteRoom(${room.id},'${room.name}')"><i
                                    class="fa-solid fa-trash-can fa-xl"></i></button>
                        </td>
                    </tr>
                `;
            bodyTable.innerHTML += row;

        })
        .catch(function (error) {
            console.error("Lỗi khi gọi API:", error);
        });
    $('#roomModal').modal('hide');
});

document.addEventListener('DOMContentLoaded', function () {

    getCinemaById(cinemaId);

    
});

function deleteRoom(room_id, room_name) {

    document.querySelector("#roomId").value = room_id;

    document.querySelector("#room_name").innerHTML = room_name;

}

document.getElementById('confirmDelete').addEventListener('click', function () {
    const roomId = document.querySelector("#roomId").value;
    if (roomId) {

        axios.delete(`http://localhost:8080/api/v1/ticket/deleteTicketByRoomId/${roomId}`)
            .then(function (response) {
                axios.delete(`http://localhost:8080/api/v1/room/delete/${roomId}`)
                    .then(function (response) {
                        console.log("Nội dung xóa:", response.data.message);
                        alert("Xóa thành công phòng");
                        getCinemaById(cinemaId);

                    })
                    .catch(function (error) {
                        console.error("Lỗi khi gọi API room:", error);
                    });
            }).catch(function (error) {
                console.error("Lỗi khi gọi API ticket:", error);
            });

    } else {
        console.error("Room ID không hợp lệ.");
        alert("Room ID không hợp lệ.");
    }
});


document.getElementById("deleteForm").addEventListener("submit", function (event) {
    event.preventDefault();
    let roomId = document.getElementById("roomId").value;

    axios.delete(`http://localhost:8080/api/v1/room/delete/${roomId}`)
        .then(function (response) {
            console.log(response.data.message);
            alert("xóa phòng thành công");
            getCinemaById(cinemaId);
        })
        .catch(function (error) {
            console.error("Lỗi khi gọi API:", error);
        });
    $('#deleteRoomModal').modal('hide');
});


function updateCinemas() {
    let cinemaName = document.getElementById("cinemaName").value;
    let cinemaAddress = document.getElementById("cinemaAddress").value;
    let cinemaDate = document.getElementById("cinemaAddressMap").value;
    let cinema = {
        cinema_name: cinemaName,
        cinema_address: cinemaAddress,
        cinema_address_map: cinemaDate
    };
    axios.put(`http://localhost:8080/api/v1/cinemas/update/${cinemaId}`, cinema)
        .then(function (response) {
            console.log(response.data);
            alert("Cập nhật rạp phim thành công");
            getCinemaById(cinemaId);
        })
        .catch(function (error) {
            console.error("Lỗi khi gọi API:", error);
        });
}

function deleteCinemas() {
    axios.delete(`http://localhost:8080/api/v1/cinemas/delete/${cinemaId}`)
        .then(function (response) {
            console.log(response.data.message);
            alert("Xóa rạp phim thành công");
            window.location.href = "list-cinemas.html";
        })
        .catch(function (error) {
            console.error("Lỗi khi gọi API:", error);
        });
}

function createCinemas() {
    let cinemaName = document.getElementById("createCinemaName").value;
    let cinemaAddress = document.getElementById("createCinemaAddress").value;
    let cinemaAddressMap = document.getElementById("createCinemaAddressMap").value;

    if (!cinemaName || !cinemaAddress || !cinemaAddressMap) {
        alert("Vui lòng nhập đầy đủ thông tin");
        return;
    }

    let cinema = {
        cinema_name: cinemaName,
        cinema_address: cinemaAddress,
        cinema_address_map: cinemaAddressMap
    };

    axios.post(`http://localhost:8080/api/v1/cinemas/create`, cinema)
        .then(function (response) {
            console.log(response.data);
            alert("Thêm rạp phim thành công");
            window.location.href = "list-cinemas.html";
        })
        .catch(function (error) {
            console.error("Lỗi khi gọi API:", error);
        });
}