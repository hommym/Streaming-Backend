"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlaylistSource = void 0;
exports.mapPlaylistRecordToPlaylist = mapPlaylistRecordToPlaylist;
exports.mapNewPlaylistToRecord = mapNewPlaylistToRecord;
exports.mapPlaylistToRecord = mapPlaylistToRecord;
var PlaylistSource;
(function (PlaylistSource) {
    PlaylistSource["System"] = "system";
    PlaylistSource["User"] = "user";
})(PlaylistSource || (exports.PlaylistSource = PlaylistSource = {}));
function mapPlaylistRecordToPlaylist(record) {
    return {
        id: Number(record.id),
        title: record.title,
        ownerId: Number(record.owner_id),
        src: record.src,
        createdAt: record.created_at,
    };
}
function mapNewPlaylistToRecord(p) {
    return {
        title: p.title,
        owner_id: p.ownerId,
        src: p.src,
        created_at: p.createdAt,
    };
}
function mapPlaylistToRecord(p) {
    return {
        id: p.id,
        title: p.title,
        owner_id: p.ownerId,
        src: p.src,
        created_at: p.createdAt,
    };
}
