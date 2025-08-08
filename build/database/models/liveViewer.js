"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapLiveViewerRecordToLiveViewer = mapLiveViewerRecordToLiveViewer;
exports.mapLiveViewerToRecord = mapLiveViewerToRecord;
function mapLiveViewerRecordToLiveViewer(r) {
    return {
        connectionId: Number(r.connection_id),
        userId: Number(r.user_id),
        liveId: Number(r.live_id),
    };
}
function mapLiveViewerToRecord(p) {
    return {
        connection_id: p.connectionId,
        user_id: p.userId,
        live_id: p.liveId,
    };
}
