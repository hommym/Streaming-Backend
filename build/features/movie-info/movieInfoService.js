"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.movieinfoService = void 0;
const redis_1 = require("../../common/utils/services/redis");
const tmdbService_1 = require("../../common/utils/services/tmdbService");
const serverEvents_1 = require("../../events/serverEvents");
const badReq_1 = require("../../common/exceptions/http/badReq");
class MovieInfoService {
    constructor() {
        this.getMovieList = async (_dto, req) => {
            const category = req.params.cat;
            let page = this.getPageFromQueryParam(req.query.page);
            if (!["top_rated", "now_playing", "popular", "upcoming"].includes(category))
                throw new badReq_1.BadReqException("Url parameter cat must be one of these values [top_rated,now_playing,popular,upcoming]");
            const cachedData = await redis_1.redis.getCachedData(`category:${category}:page:${page}`);
            let res;
            if (cachedData) {
                res = JSON.parse(cachedData);
            }
            else {
                const tmdbRes = (await tmdbService_1.tmdbService.getData(`/${category}?page=${page}`));
                res = this.tmdbApiResponseParser(tmdbRes);
                serverEvents_1.serverEvents.emit("cache-data", { key: `category:${category}:page:${page}`, value: JSON.stringify(res), exp: 86400 });
            }
            return res;
        };
        this.search = async (_dto, req) => {
            let res;
            const keyword = req.query.keyword;
            const page = this.getPageFromQueryParam(req.query.page);
            if (!keyword)
                new badReq_1.BadReqException("No value passed for query parameter keyword");
            const cachedData = await redis_1.redis.getCachedData(`search:${keyword}:page:${page}`);
            if (cachedData) {
                res = JSON.parse(cachedData);
            }
            else {
                const tmdbRes = (await tmdbService_1.tmdbService.getData(`https://api.themoviedb.org/3/search/movie?page=${page}&query=${keyword}`));
                res = this.tmdbApiResponseParser(tmdbRes);
                serverEvents_1.serverEvents.emit("cache-data", { key: `search:${keyword}:page:${page}`, value: JSON.stringify(res), exp: 86400 });
            }
            return res;
        };
        this.getMovieDetails = async (_dto, req) => {
            let movieId = req.query.movieId;
            if (!movieId)
                throw new badReq_1.BadReqException("No value passed for query param movieId");
            try {
                movieId = +movieId;
                if (!movieId)
                    throw new Error();
            }
            catch (error) {
                throw new badReq_1.BadReqException("Query Parameter movieId must be a valid number");
            }
            let res;
            const cachedData = await redis_1.redis.getCachedData(`movieId:${movieId}`);
            if (cachedData) {
                res = JSON.parse(cachedData);
            }
            else {
                const tmdbRes = (await tmdbService_1.tmdbService.getData(`/${movieId}`));
                res = this.tmdbApiResponseParser(tmdbRes);
                serverEvents_1.serverEvents.emit("cache-data", { key: `movieId:${movieId}`, value: JSON.stringify(res), exp: 86400 });
            }
            return res;
        };
    }
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
    getPageFromQueryParam(queryParam) {
        let page = queryParam ? queryParam : "1";
        try {
            +page;
        }
        catch (error) {
            throw new badReq_1.BadReqException("Query parameter page must be a number");
        }
        return page;
    }
}
exports.movieinfoService = new MovieInfoService();
