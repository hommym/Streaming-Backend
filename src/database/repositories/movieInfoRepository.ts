import type { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { database } from "../../database/database";
import { MovieInfo, MovieInfoRecord, NewMovieInfo, NewMovieInfoRecord, mapMovieInfoRecordToMovieInfo, mapNewMovieInfoToRecord } from "../models/movieInfo";

export class MovieInfoRepository {
  private readonly tableName = "movie_info";

  public async create(movie: NewMovieInfo): Promise<MovieInfo> {
    const rec: NewMovieInfoRecord = mapNewMovieInfoToRecord(movie);
    const sql = `INSERT INTO ${this.tableName} (title, duration, genre, ratings, descrip, poster_url, movie_url, src) VALUES (?,?,?,?,?,?,?,?)`;
    const params = [rec.title, rec.duration, rec.genre, rec.ratings, rec.descrip, rec.poster_url, rec.movie_url, rec.src];
    const [result] = await database.dbPool.execute<ResultSetHeader>(sql, params);
    return { id: +result.insertId, ...movie };
  }

  public async findById(id: number): Promise<MovieInfo | null> {
    const sql = `SELECT id, title, duration, genre, ratings, descrip, poster_url, movie_url, src FROM ${this.tableName} WHERE id = ? LIMIT 1`;
    const [rows] = await database.dbPool.execute<RowDataPacket[]>(sql, [id]);
    const list = rows as unknown as MovieInfoRecord[];
    if (list.length === 0) return null;
    return mapMovieInfoRecordToMovieInfo(list[0]);
  }

  public async list(limit = 50, offset = 0): Promise<MovieInfo[]> {
    const sql = `SELECT id, title, duration, genre, ratings, descrip, poster_url, movie_url, src FROM ${this.tableName} ORDER BY id DESC LIMIT ? OFFSET ?`;
    const [rows] = await database.dbPool.execute<RowDataPacket[]>(sql, [limit, offset]);
    return (rows as unknown as MovieInfoRecord[]).map(mapMovieInfoRecordToMovieInfo);
  }

  public async updateById(id: number, updates: Partial<NewMovieInfo>): Promise<MovieInfo | null> {
    const { setSql, params } = this.buildUpdateSet(updates);
    if (!params.length) return this.findById(id);
    const sql = `UPDATE ${this.tableName} SET ${setSql} WHERE id = ?`;
    await database.dbPool.execute<ResultSetHeader>(sql, [...params, id]);
    return this.findById(id);
  }

  public async deleteById(id: number): Promise<boolean> {
    const sql = `DELETE FROM ${this.tableName} WHERE id = ?`;
    const [res] = await database.dbPool.execute<ResultSetHeader>(sql, [id]);
    return res.affectedRows > 0;
  }

  private buildUpdateSet(updates: Partial<NewMovieInfo>): { setSql: string; params: any[] } {
    const set: string[] = [];
    const params: any[] = [];
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

export const movieInfoRepository = new MovieInfoRepository();
