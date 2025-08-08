import type { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { database } from "../../database/database";
import { LiveMessage, LiveMessageRecord, NewLiveMessage, NewLiveMessageRecord, mapLiveMessageRecordToLiveMessage, mapLiveMessageToRecord } from "../models/liveMessage";

export class LiveMessageRepository {
  private readonly tableName = "live_message";

  public async create(p: NewLiveMessage): Promise<LiveMessage> {
    const rec: NewLiveMessageRecord = mapLiveMessageToRecord(p);
    const sql = `INSERT INTO ${this.tableName} (live_id, user_id, content) VALUES (?,?,?)`;
    const params = [rec.live_id, rec.user_id, rec.content];
    await database.dbPool.execute<ResultSetHeader>(sql, params);
    return p;
  }

  public async listByLiveId(liveId: number, limit = 100, offset = 0): Promise<LiveMessage[]> {
    const sql = `SELECT live_id, user_id, content FROM ${this.tableName} WHERE live_id = ? ORDER BY live_id ASC LIMIT ? OFFSET ?`;
    const [rows] = await database.dbPool.execute<RowDataPacket[]>(sql, [liveId, limit, offset]);
    return (rows as unknown as LiveMessageRecord[]).map(mapLiveMessageRecordToLiveMessage);
  }

  public async deleteByUserAndLive(userId: number, liveId: number): Promise<boolean> {
    const sql = `DELETE FROM ${this.tableName} WHERE user_id = ? AND live_id = ?`;
    const [res] = await database.dbPool.execute<ResultSetHeader>(sql, [userId, liveId]);
    return res.affectedRows > 0;
  }
}

export const liveMessageRepository = new LiveMessageRepository();
