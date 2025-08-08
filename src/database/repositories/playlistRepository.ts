import type { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { database } from "../../database/database";
import { Playlist, PlaylistRecord, NewPlaylist, NewPlaylistRecord, mapPlaylistRecordToPlaylist, mapNewPlaylistToRecord } from "../models/playlist";

export class PlaylistRepository {
  private readonly tableName = "playlist";

  public async create(p: NewPlaylist): Promise<Playlist> {
    const rec: NewPlaylistRecord = mapNewPlaylistToRecord(p);
    const sql = `INSERT INTO ${this.tableName} (title, owner_id, src, created_at) VALUES (?,?,?,?)`;
    const params = [rec.title, rec.owner_id, rec.src, rec.created_at];
    const [res] = await database.dbPool.execute<ResultSetHeader>(sql, params);
    return { id: +res.insertId, ...p };
  }

  public async findById(id: number): Promise<Playlist | null> {
    const sql = `SELECT id, title, owner_id, src, created_at FROM ${this.tableName} WHERE id = ? LIMIT 1`;
    const [rows] = await database.dbPool.execute<RowDataPacket[]>(sql, [id]);
    const list = rows as unknown as PlaylistRecord[];
    if (!list.length) return null;
    return mapPlaylistRecordToPlaylist(list[0]);
  }

  public async listByOwner(ownerId: number, limit = 50, offset = 0): Promise<Playlist[]> {
    const sql = `SELECT id, title, owner_id, src, created_at FROM ${this.tableName} WHERE owner_id = ? ORDER BY id DESC LIMIT ? OFFSET ?`;
    const [rows] = await database.dbPool.execute<RowDataPacket[]>(sql, [ownerId, limit, offset]);
    return (rows as unknown as PlaylistRecord[]).map(mapPlaylistRecordToPlaylist);
  }

  public async updateById(id: number, updates: Partial<NewPlaylist>): Promise<Playlist | null> {
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

  private buildUpdateSet(updates: Partial<NewPlaylist>): { setSql: string; params: any[] } {
    const set: string[] = [];
    const params: any[] = [];
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

export const playlistRepository = new PlaylistRepository();
