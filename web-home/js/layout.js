fetch('header.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('header-placeholder').innerHTML = data;
    })
    .catch(error => console.error('Error loading header:', error));
fetch('nav_menu.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('layoutSidenav_nav').innerHTML = data;
    })
    .catch(error => console.error('Error loading header:', error));