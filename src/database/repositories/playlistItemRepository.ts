import type { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { database } from "../../database/database";
import { PlaylistItem, PlaylistItemRecord, NewPlaylistItem, NewPlaylistItemRecord, mapPlaylistItemRecordToPlaylistItem, mapNewPlaylistItemToRecord } from "../models/playlistItem";

export class PlaylistItemRepository {
  private readonly tableName = "playlist_item";

  public async create(p: NewPlaylistItem): Promise<PlaylistItem> {
    const rec: NewPlaylistItemRecord = mapNewPlaylistItemToRecord(p);
    const sql = `INSERT INTO ${this.tableName} (play_list_id, movie_id, order_no, info_src, movie_title, poster_url, created_at) VALUES (?,?,?,?,?,?,?)`;
    const params = [rec.play_list_id, rec.movie_id, rec.order_no, rec.info_src, rec.movie_title, rec.poster_url, rec.created_at];
    const [res] = await database.dbPool.execute<ResultSetHeader>(sql, params);
    return { id: +res.insertId, ...p };
  }

  public async findById(id: number): Promise<PlaylistItem | null> {
    const sql = `SELECT id, play_list_id, movie_id, order_no, info_src, movie_title, poster_url, created_at FROM ${this.tableName} WHERE id = ? LIMIT 1`;
    const [rows] = await database.dbPool.execute<RowDataPacket[]>(sql, [id]);
    const list = rows as unknown as PlaylistItemRecord[];
    if (!list.length) return null;
    return mapPlaylistItemRecordToPlaylistItem(list[0]);
  }

  public async listByPlaylist(playlistId: number, limit = 100, offset = 0): Promise<PlaylistItem[]> {
    const sql = `SELECT id, play_list_id, movie_id, order_no, info_src, movie_title, poster_url, created_at FROM ${this.tableName} WHERE play_list_id = ? ORDER BY order_no ASC, id ASC LIMIT ? OFFSET ?`;
    const [rows] = await database.dbPool.execute<RowDataPacket[]>(sql, [playlistId, limit, offset]);
    return (rows as unknown as PlaylistItemRecord[]).map(mapPlaylistItemRecordToPlaylistItem);
  }

  public async updateById(id: number, updates: Partial<NewPlaylistItem>): Promise<PlaylistItem | null> {
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

  private buildUpdateSet(updates: Partial<NewPlaylistItem>): { setSql: string; params: any[] } {
    const set: string[] = [];
    const params: any[] = [];
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

export const playlistItemRepository = new PlaylistItemRepository();
