"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.playlistRepository = exports.PlaylistRepository = void 0;
const database_1 = require("../../database/database");
const playlist_1 = require("../models/playlist");
class PlaylistRepository {
    constructor() {
        this.tableName = "playlist";
    }
    async create(p) {
        const rec = (0, playlist_1.mapNewPlaylistToRecord)(p);
        const sql = `INSERT INTO ${this.tableName} (title, owner_id, src, created_at) VALUES (?,?,?,?)`;
        const params = [rec.title, rec.owner_id, rec.src, rec.created_at];
        const [res] = await database_1.database.dbPool.execute(sql, params);
        return Object.assign({ id: +res.insertId }, p);
    }
    async findById(id) {
        const sql = `SELECT id, title, owner_id, src, created_at FROM ${this.tableName} WHERE id = ? LIMIT 1`;
        const [rows] = await database_1.database.dbPool.execute(sql, [id]);
        const list = rows;
        if (!list.length)
            return null;
        return (0, playlist_1.mapPlaylistRecordToPlaylist)(list[0]);
    }
    async listByOwner(ownerId, limit = 50, offset = 0) {
        const sql = `SELECT id, title, owner_id, src, created_at FROM ${this.tableName} WHERE owner_id = ? ORDER BY id DESC LIMIT ? OFFSET ?`;
        const [rows] = await database_1.database.dbPool.execute(sql, [ownerId, limit, offset]);
        return rows.map(playlist_1.mapPlaylistRecordToPlaylist);
    }
    async updateById(id, updates) {
        const { setSql, params } = this.buildUpdateSet(updates);
        if (!params.length)
            return this.findById(id);
        const sql = `UPDATE ${this.tableName} SET ${setSql} WHERE id = ?`;
        await database_1.database.dbPool.execute(sql, [...params, id]);
        return this.findById(id);
    }
    async deleteById(id) {
        const sql = `DELETE FROM ${this.tableName} WHERE id = ?`;
        const [res] = await database_1.database.dbPool.execute(sql, [id]);
        return res.affectedRows > 0;
    }
    buildUpdateSet(updates) {
        const set = [];
        const params = [];
        if (updates.title !== undefined) {
            set.push("title = ?");
            params.push(updates.title);
        }
        if (updates.ownerId !== undefined) {
            set.push("owner_id = ?");
            params.push(updates.ownerId);
        }
        if (updates.src !== undefined) {
            set.push("src = ?");
            params.push(updates.src);
        }
        if (updates.createdAt !== undefined) {
            set.push("created_at = ?");
            params.push(updates.createdAt);
        }
        return { setSql: set.join(", "), params };
    }
}
exports.PlaylistRepository = PlaylistRepository;
exports.playlistRepository = new PlaylistRepository();
