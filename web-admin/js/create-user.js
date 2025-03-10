

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



function createUser() {
    const userName = document.getElementById("userName").value;
    const userEmail = document.getElementById("userEmail").value;
    const userPhone = document.getElementById("userPhone").value;
    const userPassword = document.getElementById("userPassword").value;
    const userRole = document.getElementById("select-role").value;
    const user = {
        username: userName,
        email: userEmail,
        phone: userPhone,
        password: userPassword,
        roleId: [userRole]
    };
    console.log(user);
    axios.post(`http://localhost:8080/api/v1/user/create`, user)
        .then(function (response) {
            console.log(response);
            alert('Tạo tài khoản thành công');
            window.location.href = 'list-user.html';
        })
        .catch(function (error) {
            console.error("Lỗi khi gọi API:", error);
            alert('Có lỗi xảy ra khi tạo tài khoản. Vui lòng thử lại.');
        });
}




document.addEventListener('DOMContentLoaded', function () {
    
        getRoles();
    
});

