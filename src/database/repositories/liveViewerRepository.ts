import type { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { database } from "../../database/database";
import { LiveViewer, LiveViewerRecord, NewLiveViewer, NewLiveViewerRecord, mapLiveViewerRecordToLiveViewer, mapLiveViewerToRecord } from "../models/liveViewer";

export class LiveViewerRepository {
  private readonly tableName = "live_viewer";

  public async create(p: NewLiveViewer): Promise<LiveViewer> {
    const rec: NewLiveViewerRecord = mapLiveViewerToRecord(p);
    const sql = `INSERT INTO ${this.tableName} (connection_id, user_id, live_id) VALUES (?,?,?)`;
    const params = [rec.connection_id, rec.user_id, rec.live_id];
    await database.dbPool.execute<ResultSetHeader>(sql, params);
    return p;
  }

  public async findByUserId(userId: number): Promise<LiveViewer | null> {
    const sql = `SELECT connection_id, user_id, live_id FROM ${this.tableName} WHERE user_id = ? LIMIT 1`;
    const [rows] = await database.dbPool.execute<RowDataPacket[]>(sql, [userId]);
    const list = rows as unknown as LiveViewerRecord[];
    if (!list.length) return null;
    return mapLiveViewerRecordToLiveViewer(list[0]);
  }

  public async listByLiveId(liveId: number, limit = 100, offset = 0): Promise<LiveViewer[]> {
    const sql = `SELECT connection_id, user_id, live_id FROM ${this.tableName} WHERE live_id = ? ORDER BY user_id ASC LIMIT ? OFFSET ?`;
    const [rows] = await database.dbPool.execute<RowDataPacket[]>(sql, [liveId, limit, offset]);
    return (rows as unknown as LiveViewerRecord[]).map(mapLiveViewerRecordToLiveViewer);
  }

  public async updateByUserId(userId: number, updates: Partial<NewLiveViewer>): Promise<LiveViewer | null> {
    const { setSql, params } = this.buildUpdateSet(updates);
    if (!params.length) return this.findByUserId(userId);
    const sql = `UPDATE ${this.tableName} SET ${setSql} WHERE user_id = ?`;
    await database.dbPool.execute<ResultSetHeader>(sql, [...params, userId]);
    return this.findByUserId(userId);
  }

  public async deleteByUserId(userId: number): Promise<boolean> {
    const sql = `DELETE FROM ${this.tableName} WHERE user_id = ?`;
    const [res] = await database.dbPool.execute<ResultSetHeader>(sql, [userId]);
    return res.affectedRows > 0;
  }

  private buildUpdateSet(updates: Partial<NewLiveViewer>): { setSql: string; params: any[] } {
    const set: string[] = [];
    const params: any[] = [];
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

export const liveViewerRepository = new LiveViewerRepository();
