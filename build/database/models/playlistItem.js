"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InfoSource = void 0;
exports.mapPlaylistItemRecordToPlaylistItem = mapPlaylistItemRecordToPlaylistItem;
exports.mapNewPlaylistItemToRecord = mapNewPlaylistItemToRecord;
exports.mapPlaylistItemToRecord = mapPlaylistItemToRecord;
var InfoSource;
(function (InfoSource) {
    InfoSource["System"] = "system";
    InfoSource["Tmdb"] = "tmdb";
})(InfoSource || (exports.InfoSource = InfoSource = {}));
function mapPlaylistItemRecordToPlaylistItem(r) {
    return {
        id: Number(r.id),
        playlistId: Number(r.play_list_id),
        movieId: Number(r.movie_id),
        orderNo: Number(r.order_no),
        infoSrc: r.info_src,
        movieTitle: r.movie_title,
        posterUrl: r.poster_url,
        createdAt: r.created_at,
    };
}
function mapNewPlaylistItemToRecord(p) {
    return {
        play_list_id: p.playlistId,
        movie_id: p.movieId,
        order_no: p.orderNo,
        info_src: p.infoSrc,
        movie_title: p.movieTitle,
        poster_url: p.posterUrl,
        created_at: p.createdAt,
    };
}
function mapPlaylistItemToRecord(p) {
    return {
        id: p.id,
        play_list_id: p.playlistId,
        movie_id: p.movieId,
        order_no: p.orderNo,
        info_src: p.infoSrc,
        movie_title: p.movieTitle,
        poster_url: p.posterUrl,
        created_at: p.createdAt,
    };
}
