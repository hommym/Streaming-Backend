"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.movieInfoRepository = exports.MovieInfoRepository = void 0;
const database_1 = require("../../database/database");
const movieInfo_1 = require("../models/movieInfo");
class MovieInfoRepository {
    constructor() {
        this.tableName = "movie_info";
    }
    async create(movie) {
        const rec = (0, movieInfo_1.mapNewMovieInfoToRecord)(movie);
        const sql = `INSERT INTO ${this.tableName} (title, duration, genre, ratings, descrip, poster_url, movie_url, src) VALUES (?,?,?,?,?,?,?,?)`;
        const params = [rec.title, rec.duration, rec.genre, rec.ratings, rec.descrip, rec.poster_url, rec.movie_url, rec.src];
        const [result] = await database_1.database.dbPool.execute(sql, params);
        return Object.assign({ id: +result.insertId }, movie);
    }
    async findById(id) {
        const sql = `SELECT id, title, duration, genre, ratings, descrip, poster_url, movie_url, src FROM ${this.tableName} WHERE id = ? LIMIT 1`;
        const [rows] = await database_1.database.dbPool.execute(sql, [id]);
        const list = rows;
        if (list.length === 0)
            return null;
        return (0, movieInfo_1.mapMovieInfoRecordToMovieInfo)(list[0]);
    }
    async list(limit = 50, offset = 0) {
        const sql = `SELECT id, title, duration, genre, ratings, descrip, poster_url, movie_url, src FROM ${this.tableName} ORDER BY id DESC LIMIT ? OFFSET ?`;
        const [rows] = await database_1.database.dbPool.execute(sql, [limit, offset]);
        return rows.map(movieInfo_1.mapMovieInfoRecordToMovieInfo);
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
        if (updates.duration !== undefined) {
            set.push("duration = ?");
            params.push(updates.duration);
        }
        if (updates.genre !== undefined) {
            set.push("genre = ?");
            params.push(updates.genre);
        }
        if (updates.ratings !== undefined) {
            set.push("ratings = ?");
            params.push(updates.ratings);
        }
        if (updates.description !== undefined) {
            set.push("descrip = ?");
            params.push(updates.description);
        }
        if (updates.posterUrl !== undefined) {
            set.push("poster_url = ?");
            params.push(updates.posterUrl);
        }
        if (updates.movieUrl !== undefined) {
            set.push("movie_url = ?");
            params.push(updates.movieUrl);
        }
        if (updates.src !== undefined) {
            set.push("src = ?");
            params.push(updates.src);
        }
        return { setSql: set.join(", "), params };
    }
}
exports.MovieInfoRepository = MovieInfoRepository;
exports.movieInfoRepository = new MovieInfoRepository();
