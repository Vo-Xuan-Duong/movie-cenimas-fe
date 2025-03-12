document.addEventListener("DOMContentLoaded", function () {

});

// Hiển thị danh sách ghế theo phòng chiếu
function showSeatForRoom(roomId) {

    document.getElementById("roomIdGlobal").value = roomId;
    axios.get(`http://localhost:8080/api/v1/seat/getAllSeat_RoomId/${roomId}`)
        .then(function (response) {
            
            let seatData = response.data.data; // Lấy danh sách ghế

            // Xóa ghế cũ trước khi hiển thị ghế mới
            $('#seat-map').empty();

            const rows = [...new Set(seatData.map(seat => seat.seatNumber.charAt(0)))];

            rows.forEach(row => {
                const rowSeats = seatData.filter(seat => seat.seatNumber.startsWith(row));
                const rowDiv = $('<div class="d-flex justify-content-center"></div>');

                rowSeats.forEach(seat => {
                    let seatClass = 'seat-available';
                    if (seat.seatStatus === 'OCCUPIED') {
                        seatClass = 'seat-booked';
                    } else {
                        if (seat.seatType === 'VIP') {
                            seatClass = 'seat-vip';
                        } else if (seat.seatType === 'COUPLE') {
                            seatClass = 'seat_couple seat-couple';
                        }
                    }
                    const seatDiv = $('<div></div>')
                        .addClass(`seat ${seatClass}`)
                        .text(seat.seatNumber)
                        .attr('id', seat.seatNumber);
                    seatDiv.click(function () {
                        const myModal = new bootstrap.Modal(document.getElementById('seatInfoModal'));
                        myModal.show();
                        document.getElementById('seatId').value = seat.id;
                        document.getElementById('seatNumber').value = seat.seatNumber;
                        document.getElementById('seatType').value = seat.seatType;
                    });
                    rowDiv.append(seatDiv);
                });
                let createSeat = `<button class="seat seat-created" onclick="showCreateSeatModal()" ><i class="fa-solid fa-pen-to-square fa-lg"></i></button>`;
                rowDiv.append(createSeat);
                $('#seat-map').append(rowDiv);
            });
        })
        .catch(function (error) {
            console.error("Lỗi khi lấy danh sách ghế:", error);
        });
};

//showCreateSeatModal
function showCreateSeatModal() {
    const myModal = new bootstrap.Modal(document.getElementById('createSeatModal'));
        myModal.show();
}


//ân nút đóng modal
document.getElementById("closeModalSeat").addEventListener("click", function () {
    let seatInfoModalElement = document.getElementById('seatInfoModal');
    let seatInfoModalInstance = bootstrap.Modal.getInstance(seatInfoModalElement);
    if (seatInfoModalInstance) {
        seatInfoModalInstance.hide();
    }
});

// Thêm ghế
function createSeat() {
    let seatNumber = document.getElementById("seatNumberCreate").value;
    let seatType = document.getElementById("seatTypeCreate").value;
    let roomId = document.getElementById("roomIdGlobal").value;
    let seat = {
        seatNumber: seatNumber,
        seatType: seatType
    };
    axios.post(`http://localhost:8080/api/v1/seat/createSeatByRoomId/${roomId}`, seat)
        .then(function (response) {
            console.log(response.data);
            let seat = response.data.data;
            console.log(seat);
            seatNumber.value = ``;
            seatType.value = ``;
            const modal = $('#createSeatModal').modal('hide');
            showSeatForRoom(seat.roomId);
        })
        
        .catch(function (error) {
            console.error("Lỗi khi gọi API:", error);
        });
}


// Xóa ghế
function deleteSeatModal() {
    let seatId = document.getElementById("seatId").value;
    axios.delete(`http://localhost:8080/api/v1/seat/deleteSeat/${seatId}`)
        .then(function (response) {
            console.log(response.data);
            let seat = response.data.data;
            console.log(seat);
            
            const modal = $('#seatInfoModal').modal('hide');
            showSeatForRoom(seat.roomId);
        })
        .catch(function (error) {
            console.error("Lỗi khi gọi API:", error);
        });
}

// Cập nhật ghế
function updateSeatModal() {
    let seatId = document.getElementById("seatId").value;
    let seatType = document.getElementById("seatType").value;

    axios.put(`http://localhost:8080/api/v1/seat/updateSeat/${seatId}`, null, {
        params: { seatType: seatType }  // Truyền seatType vào request
    })
        .then(function (response) {
            console.log(response.data);
            let seat = response.data.data;
            let modalElement = document.getElementById('seatInfoModal');
            let modalInstance = bootstrap.Modal.getInstance(modalElement);
            if (modalInstance) modalInstance.hide();
            showSeatForRoom(seat.roomId);
        })
        .catch(function (error) {
            console.error("Lỗi khi gọi API:", error);
        });
}

// Lấy ID rạp phim từ URL
function getCinemasIdformUrl() {
    let searchParams = new URLSearchParams(window.location.search);
    return searchParams.get("cinema_id");
}

const cinemaId = getCinemasIdformUrl();
console.log(cinemaId);

function goBack() {
    window.history.back();
}

// Lấy thông tin rạp phim theo ID
function getCinemaById(cinemaId) {
    axios.get(`http://localhost:8080/api/v1/cinemas/get_cinema/${cinemaId}`)
        .then(function (response) {
            console.log(response.data);
            let cinema = response.data.data;

            document.getElementById("cinemaName2").value = cinema.cinema_name;
            document.getElementById("cinemaName1").innerHTML = cinema.cinema_name;
            document.getElementById("cinemaAddress").value = cinema.cinema_address;
            document.getElementById("cinemaAddressMap").value = cinema.cinema_address_map;

            const address = cinema.cinema_address_map.trim();
            if (address) {
                // Chuyển đổi địa chỉ thành định dạng URL cho Google Maps Embed
                const encodedAddress = encodeURIComponent(address);
                const embedUrl = `https://www.google.com/maps/embed/v1/place?q=${encodedAddress}&key=AIzaSyDmzyl1lPoVf3W_Wp7rAqBOysR9xJX-AdM`;
                iframeMap.src = embedUrl;
            } else {
                // Nếu không có địa chỉ, để iframe trống
                iframeMap.src = '';
            }
            renderRoom(cinema.rooms);
        })
        .catch(function (error) {
            console.error("Lỗi khi gọi API:", error);
        });
}


// Lấy các phần tử
const cinemaAddressMap = document.getElementById('cinemaAddressMap');
const iframeMap = document.getElementById('myIframe');

// Hàm cập nhật iframe
function updateMap() {
    const address = cinemaAddressMap.value.trim();
    if (address) {
        // Chuyển đổi địa chỉ thành định dạng URL cho Google Maps Embed
        const encodedAddress = encodeURIComponent(address);
        const embedUrl = `https://www.google.com/maps/embed/v1/place?q=${encodedAddress}&key=AIzaSyDmzyl1lPoVf3W_Wp7rAqBOysR9xJX-AdM`;
        iframeMap.src = embedUrl;
    } else {
        // Nếu không có địa chỉ, để iframe trống
        iframeMap.src = '';
    }
}

// Thêm sự kiện input cho cinemaAddressMap
// cinemaAddressMap.addEventListener('input', updateMap);
document.getElementById('updateMapBtn').addEventListener('click', updateMap);


function renderRoom(rooms) {
    let bodyTable = document.getElementById("bodyTable");
    if (rooms.length === 0) {
        bodyTable.innerHTML = `
            <tr>
                <td colspan="5" class="text-center">Không có dữ liệu</td>
            </tr>
        `;
        return;
    }
    bodyTable.innerHTML = "";
    rooms.forEach(room => {
        let row = `
        <tr>
            <td>${room.name}</td>
            <td>${room.type.replace("TYPE_", "")}</td>
            <td>${room.capacity}</td>
            <td>${room.date}</td>
            <td>
                <button class="btn btn-secondary" data-bs-toggle="modal"
                    data-bs-target="#seatModal" onclick="showSeatForRoom(${room.id})"><i
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
}

// Thêm phòng chiếu
function createRoom() {
    let room_name = document.getElementById("roomName").value;
    let room_type = document.getElementById("roomType").value;
    let seat_quantity = document.getElementById("numberSeat").value;
    let room = {
        room_name: room_name,
        room_type: "TYPE_"+room_type,
        seat_quantity: seat_quantity
    };
    axios.post(`http://localhost:8080/api/v1/room/createRoomByCienmaId/${cinemaId}`, room)
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
};

document.addEventListener('DOMContentLoaded', function () {
    getCinemaById(cinemaId);
});

//Add thông tin cập nhật phòng
function updateRoom(room_id, room_name, room_type, seat_quantity) {
    document.querySelector("#roomId1").value = room_id;
    document.querySelector("#roomName1").value = room_name;
    document.querySelector("#roomType1").value = room_type;
    document.querySelector("#numberSeat1").value = seat_quantity;
}

// ADD thông tin Xóa phòng
function deleteRoom(room_id, room_name) {
    document.querySelector("#roomId").value = room_id;
    document.querySelector("#room_name").innerHTML = room_name;
}

// Xác nhận xóa phòng
document.getElementById('confirmDelete').addEventListener('click', function () {
    const roomId = document.querySelector("#roomId").value;
    if (roomId) {
        axios.delete(`http://localhost:8080/api/v1/ticket/deleteTicketByRoomId/${roomId}`)
            .then(function (response) {
                axios.delete(`http://localhost:8080/api/v1/room/delete/${roomId}`)
                    .then(function (response) {
                        console.log("Nội dung xóa:", response.data.message);
                        getCinemaById(cinemaId);
                        alert("Xóa thành công phòng");
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

// Xóa phòng chiếu
// document.getElementById("deleteForm").addEventListener("submit", function () {
//     let roomId = document.getElementById("roomId").value;

//     axios.delete(`http://localhost:8080/api/v1/room/delete/${roomId}`)
//         .then(function (response) {
//             console.log(response.data.message);
//             getCinemaById(cinemaId);
//             alert("xóa phòng thành công");
//         })
//         .catch(function (error) {
//             console.error("Lỗi khi gọi API:", error);
//         });
//     $('#deleteRoomModal').modal('hide');
// });

// Cập nhật rạp phim
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
            getCinemaById(cinemaId);
            alert("Cập nhật rạp phim thành công");
        })
        .catch(function (error) {
            console.error("Lỗi khi gọi API:", error);
        });
}

// Xóa rạp phim
function deleteCinemas() {
    axios.delete(`http://localhost:8080/api/v1/cinemas/delete/${cinemaId}`)
        .then(function (response) {
            console.log(response.data.message);
            window.location.href = "list-cinemas.html";
            alert("Xóa rạp phim thành công");
        })
        .catch(function (error) {
            console.error("Lỗi khi gọi API:", error);
        });
}

// Thêm rạp phim
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
            window.location.href = "list-cinemas.html";
            alert("Thêm rạp phim thành công");
        })
        .catch(function (error) {
            console.error("Lỗi khi gọi API:", error);
        });
}