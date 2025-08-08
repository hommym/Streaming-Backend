"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapLiveMessageRecordToLiveMessage = mapLiveMessageRecordToLiveMessage;
exports.mapLiveMessageToRecord = mapLiveMessageToRecord;
function mapLiveMessageRecordToLiveMessage(r) {
    return {
        liveId: Number(r.live_id),
        userId: Number(r.user_id),
        content: r.content,
    };
}
function mapLiveMessageToRecord(p) {
    return {
        live_id: p.liveId,
        user_id: p.userId,
        content: p.content,
    };
}
