"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.liveStreamRepository = exports.LiveStreamRepository = void 0;
const database_1 = require("../../database/database");
const liveStream_1 = require("../models/liveStream");
class LiveStreamRepository {
    constructor() {
        this.tableName = "live_stream";
    }
    async create(p) {
        const rec = (0, liveStream_1.mapNewLiveStreamToRecord)(p);
        const sql = `INSERT INTO ${this.tableName} (playlist_id, stream_link, live_type) VALUES (?,?,?)`;
        const params = [rec.playlist_id, rec.stream_link, rec.live_type];
        const [res] = await database_1.database.dbPool.execute(sql, params);
        return Object.assign({ id: +res.insertId }, p);
    }
    async findById(id) {
        const sql = `SELECT id, playlist_id, stream_link, live_type FROM ${this.tableName} WHERE id = ? LIMIT 1`;
        const [rows] = await database_1.database.dbPool.execute(sql, [id]);
        const list = rows;
        if (!list.length)
            return null;
        return (0, liveStream_1.mapLiveStreamRecordToLiveStream)(list[0]);
    }
    async listByPlaylist(playlistId, limit = 50, offset = 0) {
        const sql = `SELECT id, playlist_id, stream_link, live_type FROM ${this.tableName} WHERE playlist_id = ? ORDER BY id DESC LIMIT ? OFFSET ?`;
        const [rows] = await database_1.database.dbPool.execute(sql, [playlistId, limit, offset]);
        return rows.map(liveStream_1.mapLiveStreamRecordToLiveStream);
    }
    async deleteById(id) {
        const sql = `DELETE FROM ${this.tableName} WHERE id = ?`;
        const [res] = await database_1.database.dbPool.execute(sql, [id]);
        return res.affectedRows > 0;
    }
    async updateById(id, updates) {
        const { setSql, params } = this.buildUpdateSet(updates);
        if (!params.length)
            return this.findById(id);
        const sql = `UPDATE ${this.tableName} SET ${setSql} WHERE id = ?`;
        await database_1.database.dbPool.execute(sql, [...params, id]);
        return this.findById(id);
    }
    buildUpdateSet(updates) {
        const set = [];
        const params = [];
        if (updates.playlistId !== undefined) {
            set.push("playlist_id = ?");
            params.push(updates.playlistId);
        }
        if (updates.streamLink !== undefined) {
            set.push("stream_link = ?");
            params.push(updates.streamLink);
        }
        if (updates.liveType !== undefined) {
            set.push("live_type = ?");
            params.push(updates.liveType);
        }
        return { setSql: set.join(", "), params };
    }
}
exports.LiveStreamRepository = LiveStreamRepository;
exports.liveStreamRepository = new LiveStreamRepository();
