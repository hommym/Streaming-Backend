"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.liveViewerRepository = exports.LiveViewerRepository = void 0;
const database_1 = require("../../database/database");
const liveViewer_1 = require("../models/liveViewer");
class LiveViewerRepository {
    constructor() {
        this.tableName = "live_viewer";
    }
    async create(p) {
        const rec = (0, liveViewer_1.mapLiveViewerToRecord)(p);
        const sql = `INSERT INTO ${this.tableName} (connection_id, user_id, live_id) VALUES (?,?,?)`;
        const params = [rec.connection_id, rec.user_id, rec.live_id];
        await database_1.database.dbPool.execute(sql, params);
        return p;
    }
    async findByUserId(userId) {
        const sql = `SELECT connection_id, user_id, live_id FROM ${this.tableName} WHERE user_id = ? LIMIT 1`;
        const [rows] = await database_1.database.dbPool.execute(sql, [userId]);
        const list = rows;
        if (!list.length)
            return null;
        return (0, liveViewer_1.mapLiveViewerRecordToLiveViewer)(list[0]);
    }
    async listByLiveId(liveId, limit = 100, offset = 0) {
        const sql = `SELECT connection_id, user_id, live_id FROM ${this.tableName} WHERE live_id = ? ORDER BY user_id ASC LIMIT ? OFFSET ?`;
        const [rows] = await database_1.database.dbPool.execute(sql, [liveId, limit, offset]);
        return rows.map(liveViewer_1.mapLiveViewerRecordToLiveViewer);
    }
    async updateByUserId(userId, updates) {
        const { setSql, params } = this.buildUpdateSet(updates);
        if (!params.length)
            return this.findByUserId(userId);
        const sql = `UPDATE ${this.tableName} SET ${setSql} WHERE user_id = ?`;
        await database_1.database.dbPool.execute(sql, [...params, userId]);
        return this.findByUserId(userId);
    }
    async deleteByUserId(userId) {
        const sql = `DELETE FROM ${this.tableName} WHERE user_id = ?`;
        const [res] = await database_1.database.dbPool.execute(sql, [userId]);
        return res.affectedRows > 0;
    }
    buildUpdateSet(updates) {
        const set = [];
        const params = [];
        if (updates.connectionId !== undefined) {
            set.push("connection_id = ?");
            params.push(updates.connectionId);
        }
        if (updates.liveId !== undefined) {
            set.push("live_id = ?");
            params.push(updates.liveId);
        }
        if (updates.userId !== undefined) {
            set.push("user_id = ?");
            params.push(updates.userId);
        }
        return { setSql: set.join(", "), params };
    }
}
exports.LiveViewerRepository = LiveViewerRepository;
exports.liveViewerRepository = new LiveViewerRepository();
