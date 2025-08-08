"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LiveType = void 0;
exports.mapLiveStreamRecordToLiveStream = mapLiveStreamRecordToLiveStream;
exports.mapNewLiveStreamToRecord = mapNewLiveStreamToRecord;
exports.mapLiveStreamToRecord = mapLiveStreamToRecord;
var LiveType;
(function (LiveType) {
    LiveType["Main"] = "main";
    LiveType["Theatre"] = "theatre";
})(LiveType || (exports.LiveType = LiveType = {}));
function mapLiveStreamRecordToLiveStream(r) {
    return {
        id: Number(r.id),
        playlistId: Number(r.playlist_id),
        streamLink: r.stream_link,
        liveType: r.live_type,
    };
}
function mapNewLiveStreamToRecord(p) {
    return {
        playlist_id: p.playlistId,
        stream_link: p.streamLink,
        live_type: p.liveType,
    };
}
function mapLiveStreamToRecord(p) {
    return {
        id: p.id,
        playlist_id: p.playlistId,
        stream_link: p.streamLink,
        live_type: p.liveType,
    };
}
