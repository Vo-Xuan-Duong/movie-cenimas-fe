function getMovieIdFromUrl() {
    const searchParams = new URLSearchParams(window.location.search);
    return searchParams.get("movieId");
}

let movieId = getMovieIdFromUrl();
if (movieId) {
    getMovieById(movieId);
}

document.addEventListener('DOMContentLoaded', function () {
    const moviePosterInput = document.getElementById('movie-poster');
    const posterPreview = document.getElementById('posterPreview');
    const movieBackdropInput = document.getElementById('movie-backdrop');
    const backdropPreview = document.getElementById('backdropPreview');

    moviePosterInput.addEventListener('input', function () {
        const url = moviePosterInput.value;
        const urlBackrop = movieBackdropInput.value;
        if (url) {
            posterPreview.src = url;
            posterPreview.style.display = 'block';
        } else {
            posterPreview.style.display = 'none';
        }
        if (urlBackrop) {
            backdropPreview.src = urlBackrop;
            backdropPreview.style.display = 'block';
        } else {
            backdropPreview.style.display = 'none';
        }

    });
});

function getMovieById(movieId) {
    axios.get(`http://localhost:8080/api/v1/movie/getMovie/${movieId}`)
        .then(function (response) {
            const movie = response.data.data;
            console.log('Chi tiết phim:', movie);

            // Hiển thị thông tin phim
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
            let moiveLayout = document.getElementById('movie-layout');
            let movieTranslators = document.getElementById('movie-translators');
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
            let tags = movie.genres ? movie.genres.map(tag => `<span class="tag me-2">${tag.name}</span>`).join(" ") : "";
            console.log("Tags:", movie.genres);
            movieGenre.innerHTML = tags + `<button class=" tag">+</button>`;
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
            // movieLayout.value = movie.layout || "null";
            // movieTranslators.value = movie.translators || "null";
            // moiveLayout.value = movie.layout || "null";
            movieAgeRating.value = movie.certification|| "null";
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

function updateMovie() {
    const movieTitle = document.getElementById('movie-title').value;
    const movieDescription = document.getElementById('movie-description').value;
    const movieGenre = document.getElementById('movie-genre').value;
    const movieDirector = document.getElementById('movie-director').value;
    const movieCast = document.getElementById('movie-cast').value;
    const moviePoster = document.getElementById('movie-poster').value;
    const movieBackdrop = document.getElementById('movie-backdrop').value;
    const movieTrailer = document.getElementById('movie-trailer').value;
    const movieLayout = document.getElementById('movie-layout').value;
    const movieTranslators = document.getElementById('movie-translators').value;
    const movieAgeRating = document.getElementById('movie-age').value;
    const movieReleaseDate = document.getElementById('movie-release-date').value;
    const movieEndDate = document.getElementById('movie-end-date').value;
    const movieYear = document.getElementById('movie-year').value;
    const movieDuration = document.getElementById('movie-duration').value;
    const movieStatus = document.getElementById('movie-status').value;
    const movieCountry = document.getElementById('movie-country').value;

    const movie = {
        title: movieTitle,
        description: movieDescription,
        genres: movieGenre,
        director: movieDirector,
        cast: movieCast,
        poster: moviePoster,
        backdrop: movieBackdrop,
        trailer: movieTrailer,
        layout: movieLayout,
        translators: movieTranslators,
        ageRating: movieAgeRating,
        releaseDate: movieReleaseDate,
        endDate: movieEndDate,
        year: movieYear,
        duration: movieDuration,
        status: movieStatus,
        country: [movieCountry],
    };

    axios.put(`http://localhost:8080/api/v1/movie/updateMovie/${movieId}`, movie)
        .then(function (response) {
            console.log('Cập nhật phim thành công:', response);
            alert('Cập nhật phim thành công');
        })
        .catch(function (error) {
            console.log('Lỗi khi cập nhật phim:', error);
            alert('Có lỗi xảy ra khi cập nhật phim. Vui lòng thử lại.');
        }
    );
}
