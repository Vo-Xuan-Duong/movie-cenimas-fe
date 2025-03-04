function getAllMovie() {
    axios.get('http://localhost:8080/api/v1/movie/allMovies')
        .then(function (response) {
            console.log(response.data);
            let data = response.data.data; // Lấy danh sách phim

            let allMovie = document.getElementById('list-movies');
            let upcomingMovie = document.getElementById('upcoming-movies');
            let nowShowingMovie = document.getElementById('now-showing-movies');
            

            let html = '';

            if (data && data.length > 0) {
                data.forEach(movie => {
                    html += `
                        <div class="movie-card">
                            <span class="movie-rating">${movie.rating}</span>
                            <div class="movie-poster-img">
                                <a href="movie-detail.html?movie_id=${movie.id}">
                                    <img src="${movie.posterUrl || 'default.jpg'}" alt="Poster của ${movie.title}" />
                                </a>
                            </div>
                            
                            <h6 class="movie-title">${movie.title}</h6>
                            <p class="movie-genre">${movie.genre ? movie.genre.join(', ') : 'Không xác định'}</p>
                            <a class="trailer-button" href="${movie.trailerUrl}" target="_blank">
                                    <i class="fas fa-play-circle"></i> Xem trailer
                                </a>
                        </div>
                    `;

                });
            } else {
                html = '<p class="text-center text-white">Không có phim nào.</p>';
            }

            allMovie.innerHTML = html;
            upcomingMovie.innerHTML = html;
            nowShowingMovie.innerHTML = html;
        })
        .catch(function (error) {
            console.error("Lỗi khi lấy danh sách phim:", error);
        });
}

getAllMovie();


