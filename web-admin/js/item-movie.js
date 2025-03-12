function getMovieIdFromUrl() {
    const searchParams = new URLSearchParams(window.location.search);
    return searchParams.get("movieId");
}

let movieId = getMovieIdFromUrl();
if (movieId) {
    getMovieById(movieId);
}

document.addEventListener('DOMContentLoaded', function () {
    showGenres();
    document.body.addEventListener("click", function (event) {
        if (event.target.classList.contains("close-button")) {
            let tag = event.target.parentElement; // Thẻ <span> chứa nút X
            tag.style.opacity = "0"; // Làm mờ dần
            setTimeout(() => tag.remove(), 300); // Đợi 300ms rồi xóa khỏi DOM
        }
    });

});

const moviePosterInput = document.getElementById('movie-poster');
const movieBackdropInput = document.getElementById('movie-backdrop');
const posterPreview = document.getElementById('posterPreview');
const backdropPreview = document.getElementById('backdropPreview');

// Hàm cập nhật hình ảnh
function updateImagePreview(input, preview) {
    const url = input.value.trim();
    if (url) {
        preview.src = url;
        preview.style.display = 'block';
    } else {
        preview.src = '';
        preview.style.display = 'none';
    }
}

// Thêm sự kiện input cho movie-poster
moviePosterInput.addEventListener('input', function () {
    updateImagePreview(moviePosterInput, posterPreview);
});

// Thêm sự kiện input cho movie-backdrop
movieBackdropInput.addEventListener('input', function () {
    updateImagePreview(movieBackdropInput, backdropPreview);
});

function showGenres() {
    axios.get(`http://localhost:8080/api/v1/updatedata/genre/getAllGenres`)
        .then(function (response) {
            const genres = response.data.data;
            console.log('Danh sách thể loại:', genres);

            let genreList = document.getElementById('genre-list');
            genreList.innerHTML = genres.map(genre => `<option value="${genre.id}">${genre.name}</option>`).join("\n");
        })
        .catch(function (error) {
            console.log("Lỗi khi gọi API:", error);
            alert('Có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại.');
        });
}

function updateGenre() {
    let movieGenre = document.getElementById('movie-genre');
    let genreList = document.getElementById('genre-list');
    let genreId = genreList.value;
    let genreName = genreList.options[genreList.selectedIndex].text;

    // Tạo thẻ span mới
    let newGenre = document.createElement('span');
    newGenre.className = 'tag_genre me-2';
    newGenre.setAttribute('data-genre-id', genreId);
    newGenre.innerHTML = genreName + `<button class="close-button">X</button>`;

    // Xóa button "+" hiện tại
    let plusButton = movieGenre.querySelector('button[data-bs-toggle]');
    if (plusButton) {
        plusButton.remove();
    }

    // Thêm genre mới và button "+" mới
    movieGenre.appendChild(newGenre);
    let newPlusButton = document.createElement('button');
    newPlusButton.className = 'tag_genre';
    newPlusButton.setAttribute('data-bs-toggle', 'modal');
    newPlusButton.setAttribute('data-bs-target', '#createGenreModal');
    newPlusButton.textContent = '+';
    movieGenre.appendChild(newPlusButton);
}



function getMovieById(movieId) {
    axios.get(`http://localhost:8080/api/v1/movie/getMovie/${movieId}`)
        .then(function (response) {
            const movie = response.data.data;
            console.log('Chi tiết phim:', movie);

            // Hiển thị thông tin phim
            document.getElementById('movie-id').value = movie.id;
            let movieTitle = document.getElementById('movie-title');
            let movieName = document.getElementById('movie-name');
            let movieDescription = document.getElementById('movie-description');
            let movieGenre = document.getElementById('movie-genre');
            let movieDirector = document.getElementById('movie-director');
            let movieCast = document.getElementById('movie-cast');
            let moviePoster = document.getElementById('movie-poster');
            let movieBackdrop = document.getElementById('movie-backdrop');
            let posterPreview = document.getElementById('posterPreview');
            let backdropPreview = document.getElementById('backdropPreview');
            let movieTrailer = document.getElementById('movie-trailer');
            let moiveType = document.getElementById('movie-type');
            let movieSupport = document.getElementById('movie-support');
            let movieAgeRating = document.getElementById('movie-age');
            let movieReleaseDate = document.getElementById('movie-release-date');
            let movieEndDate = document.getElementById('movie-end-date');
            let movieYear = document.getElementById('movie-year');
            let movieDuration = document.getElementById('movie-duration');
            let movieStatus = document.getElementById('movie-status');
            let movieCountry = document.getElementById('movie-country');



            movieTitle.value = movie.title;
            movieName.innerHTML = movie.title;
            movieDescription.value = movie.description;
            let tags = movie.genres ? movie.genres.map(tag =>
                `<span class="tag_genre me-2" data-genre-id="${tag.id}">${tag.name}<button class="close-button">X</button></span>`
            ).join(" ") : "";
            movieGenre.innerHTML = tags + `<button class="tag_genre" data-bs-toggle="modal"
                                            data-bs-target="#createGenreModal">+</button>`;
            movieTrailer.value = movie.trailer || "null";
            // movieDirector.value = movie.derictor || "null";
            // movieCast.value = movie.cast || "null";
            moviePoster.value = movie.poster || "null";
            if (movie.poster) {
                posterPreview.src = movie.poster;
                posterPreview.style.display = 'block';
            }
            movieBackdrop.value = movie.backdrop || "null";
            if (movie.backdrop) {
                backdropPreview.src = movie.backdrop;
                backdropPreview.style.display = 'block';
            }
            moiveType.value = movie.type ? movie.type.replace("TYPE_", "") : "null";
            movieSupport.value = movie.support || "null";
            movieAgeRating.value = movie.certification || "null";
            movieReleaseDate.value = movie.releaseDate || "null";
            movieEndDate.value = movie.endDate || "null";
            movieYear.value = movie.year || "null";
            movieDuration.value = movie.duration || "null";
            movieStatus.value = movie.status || "null";
            movieCountry.value = movie.country[0].iso || "null";
            console.log(movie.country[0].iso);



        })
        .catch(function (error) {
            console.log("Lỗi khi gọi API:", error);
            alert('Có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại.');
        });
}

function updateMovie() {  // Thêm movieId làm tham số
    const movieId = document.getElementById('movie-id').value;
    const movieTitle = document.getElementById('movie-title').value;
    const movieDescription = document.getElementById('movie-description').value;
    const movieGenreElement = document.getElementById('movie-genre');
    const movieDirector = document.getElementById('movie-director').value;
    const movieCast = document.getElementById('movie-cast').value;
    const moviePoster = document.getElementById('movie-poster').value;
    const movieBackdrop = document.getElementById('movie-backdrop').value;
    const movieTrailer = document.getElementById('movie-trailer').value;
    const movieLayout = document.getElementById('movie-type').value;
    const movieTranslators = document.getElementById('movie-support').value;
    const movieAgeRating = document.getElementById('movie-age').value;
    const movieReleaseDate = document.getElementById('movie-release-date').value;
    const movieEndDate = document.getElementById('movie-end-date').value;
    const movieYear = document.getElementById('movie-year').value;
    const movieDuration = document.getElementById('movie-duration').value;
    const movieStatus = document.getElementById('movie-status').value;
    const movieCountry = document.getElementById('movie-country').value;

    // Lấy danh sách genres với cả ID và name
    const genreElements = movieGenreElement.getElementsByClassName('tag_genre');
    const genres = Array.from(genreElements)
    .filter(el => !el.hasAttribute('data-bs-toggle') && el.hasAttribute('data-genre-id')) // Loại bỏ nút "+"
    .map(el => Number(el.getAttribute('data-genre-id'))); // Chuyển ID thành số Long

    const movie = {
        title: movieTitle,
        description: movieDescription,
        genres: genres,
        // director: movieDirector,
        // cast: movieCast,
        poster: moviePoster,
        backdrop: movieBackdrop,
        trailer: movieTrailer,
        type: "TYPE_"+ movieLayout,
        support: movieTranslators,
        certification: movieAgeRating,
        releaseDate: movieReleaseDate,
        endDate: movieEndDate,
        year: movieYear,
        duration: movieDuration,
        status: movieStatus,
        country: [movieCountry],
    };

    axios.put(`http://localhost:8080/api/v1/movie/update/${movieId}`, movie)
        .then(function (response) {
            console.log('Cập nhật phim thành công:', response);
            alert('Cập nhật phim thành công');
        })
        .catch(function (error) {
            console.log('Lỗi khi cập nhật phim:', error);
            alert('Có lỗi xảy ra khi cập nhật phim. Vui lòng thử lại.');
        });
}


function createMovie() {
    const movieTitle = document.getElementById('movie-title').value;
    const movieDescription = document.getElementById('movie-description').value;
    const movieGenreElement = document.getElementById('movie-genre');
    // const movieDirector = document.getElementById('movie-director').value;
    // const movieCast = document.getElementById('movie-cast').value;
    const moviePoster = document.getElementById('movie-poster').value;
    const movieBackdrop = document.getElementById('movie-backdrop').value;
    const movieTrailer = document.getElementById('movie-trailer').value;
    const movieType = document.getElementById('movie-type').value;
    const movieSupport = document.getElementById('movie-support').value;
    const movieAgeRating = document.getElementById('movie-age').value;
    const movieReleaseDate = document.getElementById('movie-release-date').value;
    const movieEndDate = document.getElementById('movie-end-date').value;
    const movieYear = document.getElementById('movie-year').value;
    const movieDuration = document.getElementById('movie-duration').value;
    const movieStatus = document.getElementById('movie-status').value;
    const movieCountry = document.getElementById('movie-country').value;

    // Lấy danh sách genres với cả ID và name
    const genreElements = movieGenreElement.getElementsByClassName('tag');
    const genres = Array.from(genreElements)
    .filter(el => !el.hasAttribute('data-bs-toggle') && el.hasAttribute('data-genre-id')) // Loại bỏ nút "+"
    .map(el => Number(el.getAttribute('data-genre-id'))); // Chuyển ID thành số Long

    const movie = {
        title: movieTitle,
        description: movieDescription,
        genres: genres,
        // director: movieDirector,
        // cast: movieCast,
        poster: moviePoster,
        backdrop: movieBackdrop,    
        trailer: movieTrailer,
        type: "TYPE_"+ movieType,
        support: movieSupport,
        certification: movieAgeRating,
        releaseDate: movieReleaseDate,
        endDate: movieEndDate,
        year: movieYear,
        duration: movieDuration,
        status: movieStatus,
        country: [movieCountry],
    };

    axios.post(`http://localhost:8080/api/v1/movie/create`, movie)
        .then(function (response) {
            console.log('Tạo phim thành công:', response);
            alert('Tạo phim mới phim thành công');
            window.location.href = '/web-admin/list-movie.html';
        })
        .catch(function (error) {
            console.log('Lỗi khi tạo phim:', error);
            alert('Có lỗi xảy ra khi tạo phim. Vui lòng thử lại.');
        }
        );
}
