import type { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { database } from "../../database/database";
import { LiveStream, LiveStreamRecord, NewLiveStream, NewLiveStreamRecord, mapLiveStreamRecordToLiveStream, mapLiveStreamToRecord, mapNewLiveStreamToRecord } from "../models/liveStream";

export class LiveStreamRepository {
  private readonly tableName = "live_stream";

  public async create(p: NewLiveStream): Promise<LiveStream> {
    const rec: NewLiveStreamRecord = mapNewLiveStreamToRecord(p);
    const sql = `INSERT INTO ${this.tableName} (playlist_id, stream_link, live_type) VALUES (?,?,?)`;
    const params = [rec.playlist_id, rec.stream_link, rec.live_type];
    const [res] = await database.dbPool.execute<ResultSetHeader>(sql, params);
    return { id: +res.insertId, ...p };
  }

  public async findById(id: number): Promise<LiveStream | null> {
    const sql = `SELECT id, playlist_id, stream_link, live_type FROM ${this.tableName} WHERE id = ? LIMIT 1`;
    const [rows] = await database.dbPool.execute<RowDataPacket[]>(sql, [id]);
    const list = rows as unknown as LiveStreamRecord[];
    if (!list.length) return null;
    return mapLiveStreamRecordToLiveStream(list[0]);
  }

  public async listByPlaylist(playlistId: number, limit = 50, offset = 0): Promise<LiveStream[]> {
    const sql = `SELECT id, playlist_id, stream_link, live_type FROM ${this.tableName} WHERE playlist_id = ? ORDER BY id DESC LIMIT ? OFFSET ?`;
    const [rows] = await database.dbPool.execute<RowDataPacket[]>(sql, [playlistId, limit, offset]);
    return (rows as unknown as LiveStreamRecord[]).map(mapLiveStreamRecordToLiveStream);
  }

  public async deleteById(id: number): Promise<boolean> {
    const sql = `DELETE FROM ${this.tableName} WHERE id = ?`;
    const [res] = await database.dbPool.execute<ResultSetHeader>(sql, [id]);
    return res.affectedRows > 0;
  }

  public async updateById(id: number, updates: Partial<NewLiveStream>): Promise<LiveStream | null> {
    const { setSql, params } = this.buildUpdateSet(updates);
    if (!params.length) return this.findById(id);
    const sql = `UPDATE ${this.tableName} SET ${setSql} WHERE id = ?`;
    await database.dbPool.execute<ResultSetHeader>(sql, [...params, id]);
    return this.findById(id);
  }

  private buildUpdateSet(updates: Partial<NewLiveStream>): { setSql: string; params: any[] } {
    const set: string[] = [];
    const params: any[] = [];
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

export const liveStreamRepository = new LiveStreamRepository();
