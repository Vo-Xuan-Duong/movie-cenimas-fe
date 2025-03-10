


function addData() {
    axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=584fe34ce59d833e0df3c6131ceb5b4a&language=vi-VN®ion=VN&page=2`)
        .then(function (response) {
            let data = response.data.results;
            console.log("Dữ liệu lấy từ trang web:", data);

            data.forEach(phim => {
                let movieId = phim.id;

                // Lấy chi tiết phim
                axios.get(`https://api.themoviedb.org/3/movie/${movieId}?api_key=584fe34ce59d833e0df3c6131ceb5b4a&language=vi-VN`)
                    .then(function (movieResponse) {
                        let movie = movieResponse.data;
                        console.log("Phim chi tiết:", movie);

                        // Kiểm tra trạng thái phim
                        let releaseDate = new Date(movie.release_date);
                        let today = new Date();
                        let movieStatus = (releaseDate > today) ? "SAPCHIEU" : "DANGCHIEU";

                        // Hiển thị phim trên giao diện
                        let html = `
                            <div class="col-3">
                                <div class="card">
                                    <img src="https://image.tmdb.org/t/p/w500/${movie.poster_path}" class="card-img-top" alt="${movie.title}">
                                    <div class="card-body">
                                        <h5 class="card-title">${movie.title}</h5>
                                        <p class="card-text">${movie.overview}</p>
                                        <p class="card-text"><small>Trạng thái: ${movieStatus === "SAPCHIEU" ? "Sắp chiếu" : "Đang chiếu"}</small></p>
                                        <a href="#" class="btn btn-primary">Xem chi tiết</a>
                                    </div>
                                </div>
                            </div>
                        `;
                        document.getElementById("list-movie").innerHTML += html;

                        // Xử lý genres
                        const genres = movie.genres.map(genre => genre.id);

                        // Xử lý countries
                        const country = movie.production_countries.map(c => ({
                            iso: c.iso_3166_1,
                            name: c.name
                        }));

                        // Xử lý companies
                        const companies = movie.production_companies.map(c => ({
                            id: c.id,
                            name: c.name,
                            origin_country: c.origin_country,
                            logo_path: c.logo_path
                        }));

                        // Promise.all để lấy certification và trailer cùng lúc
                        Promise.all([
                            axios.get(`https://api.themoviedb.org/3/movie/${movieId}/release_dates?api_key=584fe34ce59d833e0df3c6131ceb5b4a`),
                            axios.get(`https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=584fe34ce59d833e0df3c6131ceb5b4a`)
                        ])
                        .then(function ([releaseResponse, videoResponse]) {
                            // Xử lý certification
                            let releaseData = releaseResponse.data.results;
                            console.log("Release data:", releaseData);
                            let usCertification = null;
                            for (let countryData of releaseData) {
                                if (countryData.iso_3166_1 === "US") {
                                    for (let release of countryData.release_dates) {
                                        if (release.certification && release.certification !== "") {
                                            usCertification = release.certification;
                                            break;
                                        }
                                    }
                                    break;
                                }
                            }
                            let vnCertification = convertCertificationToVietnam(usCertification);

                            // Xử lý trailer
                            let videos = videoResponse.data.results;
                            let trailer = videos.find(v => v.site === "YouTube" && v.type === "Trailer");
                            let trailerUrl = trailer 
                                ? `https://www.youtube.com/embed/${trailer.key}?autoplay=1&origin=https%3A%2F%2Fwww.themoviedb.org&hl=vi&modestbranding=1&fs=1&autohide=1`
                                : null;
                            console.log("Trailer URL:", trailerUrl);
                            // Gửi yêu cầu POST tới backend
                            axios.post(`http://localhost:8080/api/v1/movie/create`, {
                                title: movie.title + "(" + movie.original_title + ")",
                                description: movie.overview,
                                duration: movie.runtime,
                                genres: genres,
                                cast: null,
                                vote_average: movie.vote_average,
                                vote_count: movie.vote_count,
                                popularity: movie.popularity,
                                language: movie.original_language,
                                country: country,
                                companies: companies,
                                writer: null,
                                certification: vnCertification,
                                backdrop: `https://image.tmdb.org/t/p/original${movie.backdrop_path}`,
                                poster: `https://image.tmdb.org/t/p/original${movie.poster_path}`,
                                trailer: trailerUrl, // Thêm URL nhúng trailer
                                releaseDate: movie.release_date,
                                status: movieStatus
                            })
                            .then(function (postResponse) {
                                console.log("Thêm phim thành công:", postResponse.data);
                            })
                            .catch(function (error) {
                                console.log("Lỗi khi thêm phim:", error);
                            });
                        })
                        .catch(function (error) {
                            console.log("Lỗi khi lấy release_dates hoặc videos:", error);
                        });
                    })
                    .catch(function (error) {
                        console.log("Lỗi khi lấy chi tiết phim:", error);
                    });
            });
        })
        .catch(function (error) {
            console.log("Lỗi khi lấy danh sách phim:", error);
        });
}

// Hàm chuyển đổi phân loại từ Mỹ sang Việt Nam
function convertCertificationToVietnam(usCertification) {
    if (!usCertification) return "P";
    switch (usCertification) {
        case "G": return "P";
        case "PG": return "C13";
        case "PG-13": return "C16";
        case "R": return "C18";
        case "NC-17": return "C18";
        default: return "P";
    }
}