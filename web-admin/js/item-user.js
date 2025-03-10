function getUserIdformUrl() {
    let searchParams = new URLSearchParams(window.location.search);
    return searchParams.get("userId");
}

const userId = getUserIdformUrl();
console.log(userId);

function getRoles() {
    axios.get(`http://localhost:8080/api/v1/role/getAll`)
        .then(function (response) {
            const roles = response.data.data;
            console.log(roles);
            let select = document.getElementById('select-role');
            roles.forEach(function (role) {
                let option = document.createElement('option');
                option.value = role.id;
                option.text = role.name;
                select.appendChild(option);
            });
        })
        .catch(function (error) {
            console.error("Lỗi khi gọi API:", error);
            alert('Có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại.');
        });
}

function getUserById() {
    axios.get(`http://localhost:8080/api/v1/user/getUser/${userId}`)
        .then(function (response) {
            const user = response.data.data;
            console.log(user);
            document.getElementById("userName").value = user.username;
            document.getElementById("userEmail").value = user.email;
            document.getElementById("userPhone").value = user.phone;
            document.getElementById("select-role").value = user.roles[0].id;
        })
        .catch(function (error) {
            console.error("Lỗi khi gọi API:", error);
            alert('Có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại.');
        });
}

function updateUser() {
    const userName = document.getElementById("userName").value;
    const userEmail = document.getElementById("userEmail").value;
    const userPhone = document.getElementById("userPhone").value;
    const userRole = document.getElementById("select-role").value;
    const user = {
        username: userName,
        email: userEmail,
        phone: userPhone,
        roleId: [userRole]
    };
    console.log(user);
    axios.put(`http://localhost:8080/api/v1/user/update/${userId}`, user)
        .then(function (response) {
            console.log(response);
            alert('Cập nhật tài khoản thành công');
            window.location.href = 'list-user.html';
        })
        .catch(function (error) {
            console.error("Lỗi khi gọi API:", error);
            alert('Có lỗi xảy ra khi cập nhật tài khoản. Vui lòng thử lại.');
        });
}

document.addEventListener('DOMContentLoaded', function () {
    
    getRoles();
    if (userId) {
        getUserById();
    }

});
