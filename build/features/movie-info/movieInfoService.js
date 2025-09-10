"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.movieinfoService = void 0;
class MovieInfoService {
    tmdbApiResponseParser(response) {
        let parsedData;
        if ("results" in response) {
            const movies = [];
            parsedData = { page: response.page, totalPages: response.total_pages, totalNo: response.total_results, movies };
            response.results.forEach((item) => {
                movies.push({
                    id: item.id,
                    posterUrl: `https://image.tmdb.org/t/p/original${item.poster_path}`,
                    rating: item.vote_average,
                    releaseYear: item.release_date.split("-")[0],
                    title: item.original_title,
                });
            });
        }
        else {
            const genres = [];
            parsedData = {
                genres,
                id: response.id,
                title: response.title,
                description: response.overview,
                streamUrl: undefined,
                releaseYear: response.release_date.split("-")[0],
                rating: response.vote_average,
                duration: response.runtime,
                posterUrl: `https://image.tmdb.org/t/p/original${response.poster_path}`,
                backdropUrl: `https://image.tmdb.org/t/p/original${response.backdrop_path}`,
            };
            response.genres.forEach((genre) => genres.push(genre.name));
        }
        return parsedData;
    }
}
exports.movieinfoService = new MovieInfoService();
