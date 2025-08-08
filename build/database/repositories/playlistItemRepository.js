"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.playlistItemRepository = exports.PlaylistItemRepository = void 0;
const database_1 = require("../../database/database");
const playlistItem_1 = require("../models/playlistItem");
class PlaylistItemRepository {
    constructor() {
        this.tableName = "playlist_item";
    }
    async create(p) {
        const rec = (0, playlistItem_1.mapNewPlaylistItemToRecord)(p);
        const sql = `INSERT INTO ${this.tableName} (play_list_id, movie_id, order_no, info_src, movie_title, poster_url, created_at) VALUES (?,?,?,?,?,?,?)`;
        const params = [rec.play_list_id, rec.movie_id, rec.order_no, rec.info_src, rec.movie_title, rec.poster_url, rec.created_at];
        const [res] = await database_1.database.dbPool.execute(sql, params);
        return Object.assign({ id: +res.insertId }, p);
    }
    async findById(id) {
        const sql = `SELECT id, play_list_id, movie_id, order_no, info_src, movie_title, poster_url, created_at FROM ${this.tableName} WHERE id = ? LIMIT 1`;
        const [rows] = await database_1.database.dbPool.execute(sql, [id]);
        const list = rows;
        if (!list.length)
            return null;
        return (0, playlistItem_1.mapPlaylistItemRecordToPlaylistItem)(list[0]);
    }
    async listByPlaylist(playlistId, limit = 100, offset = 0) {
        const sql = `SELECT id, play_list_id, movie_id, order_no, info_src, movie_title, poster_url, created_at FROM ${this.tableName} WHERE play_list_id = ? ORDER BY order_no ASC, id ASC LIMIT ? OFFSET ?`;
        const [rows] = await database_1.database.dbPool.execute(sql, [playlistId, limit, offset]);
        return rows.map(playlistItem_1.mapPlaylistItemRecordToPlaylistItem);
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
        if (updates.playlistId !== undefined) {
            set.push("play_list_id = ?");
            params.push(updates.playlistId);
        }
        if (updates.movieId !== undefined) {
            set.push("movie_id = ?");
            params.push(updates.movieId);
        }
        if (updates.orderNo !== undefined) {
            set.push("order_no = ?");
            params.push(updates.orderNo);
        }
        if (updates.infoSrc !== undefined) {
            set.push("info_src = ?");
            params.push(updates.infoSrc);
        }
        if (updates.movieTitle !== undefined) {
            set.push("movie_title = ?");
            params.push(updates.movieTitle);
        }
        if (updates.posterUrl !== undefined) {
            set.push("poster_url = ?");
            params.push(updates.posterUrl);
        }
        if (updates.createdAt !== undefined) {
            set.push("created_at = ?");
            params.push(updates.createdAt);
        }
        return { setSql: set.join(", "), params };
    }
}
exports.PlaylistItemRepository = PlaylistItemRepository;
exports.playlistItemRepository = new PlaylistItemRepository();
