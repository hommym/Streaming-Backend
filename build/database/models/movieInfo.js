"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MovieInfoSource = void 0;
exports.mapMovieInfoRecordToMovieInfo = mapMovieInfoRecordToMovieInfo;
exports.mapNewMovieInfoToRecord = mapNewMovieInfoToRecord;
exports.mapMovieInfoToRecord = mapMovieInfoToRecord;
var MovieInfoSource;
(function (MovieInfoSource) {
    MovieInfoSource["System"] = "system";
})(MovieInfoSource || (exports.MovieInfoSource = MovieInfoSource = {}));
function mapMovieInfoRecordToMovieInfo(record) {
    var _a;
    return {
        id: Number(record.id),
        title: record.title,
        duration: record.duration,
        genre: record.genre,
        ratings: Number((_a = record.ratings) !== null && _a !== void 0 ? _a : 0),
        description: record.descrip,
        posterUrl: record.poster_url,
        movieUrl: record.movie_url,
        src: record.src,
    };
}
function mapNewMovieInfoToRecord(movie) {
    var _a, _b, _c;
    return {
        title: movie.title,
        duration: movie.duration,
        genre: movie.genre,
        ratings: (_a = movie.ratings) !== null && _a !== void 0 ? _a : 0,
        descrip: (_b = movie.description) !== null && _b !== void 0 ? _b : null,
        poster_url: (_c = movie.posterUrl) !== null && _c !== void 0 ? _c : null,
        movie_url: movie.movieUrl,
        src: movie.src,
    };
}
function mapMovieInfoToRecord(movie) {
    return {
        id: movie.id,
        title: movie.title,
        duration: movie.duration,
        genre: movie.genre,
        ratings: movie.ratings,
        descrip: movie.description,
        poster_url: movie.posterUrl,
        movie_url: movie.movieUrl,
        src: movie.src,
    };
}
