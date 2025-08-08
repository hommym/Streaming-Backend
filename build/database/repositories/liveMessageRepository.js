"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.liveMessageRepository = exports.LiveMessageRepository = void 0;
const database_1 = require("../../database/database");
const liveMessage_1 = require("../models/liveMessage");
class LiveMessageRepository {
    constructor() {
        this.tableName = "live_message";
    }
    async create(p) {
        const rec = (0, liveMessage_1.mapLiveMessageToRecord)(p);
        const sql = `INSERT INTO ${this.tableName} (live_id, user_id, content) VALUES (?,?,?)`;
        const params = [rec.live_id, rec.user_id, rec.content];
        await database_1.database.dbPool.execute(sql, params);
        return p;
    }
    async listByLiveId(liveId, limit = 100, offset = 0) {
        const sql = `SELECT live_id, user_id, content FROM ${this.tableName} WHERE live_id = ? ORDER BY live_id ASC LIMIT ? OFFSET ?`;
        const [rows] = await database_1.database.dbPool.execute(sql, [liveId, limit, offset]);
        return rows.map(liveMessage_1.mapLiveMessageRecordToLiveMessage);
    }
    async deleteByUserAndLive(userId, liveId) {
        const sql = `DELETE FROM ${this.tableName} WHERE user_id = ? AND live_id = ?`;
        const [res] = await database_1.database.dbPool.execute(sql, [userId, liveId]);
        return res.affectedRows > 0;
    }
}
exports.LiveMessageRepository = LiveMessageRepository;
exports.liveMessageRepository = new LiveMessageRepository();
