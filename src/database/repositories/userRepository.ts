import type { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { database } from "../../database/database";
import { User, UserRecord, UserType, NewUser, NewUserRecord, mapUserRecordToUser, mapNewUserToRecord } from "../models/user";

export class UserRepository {
  private readonly tableName = "`user`"; // backticks due to reserved word

  public async create(user: NewUser): Promise<User> {
    const record: NewUserRecord = mapNewUserToRecord(user);
    const sql = `INSERT INTO ${this.tableName} (full_name, email, passwd, user_type) VALUES (?, ?, ?, ?)`;
    const params = [record.full_name, record.email, record.passwd, record.user_type];
    const [result] = await database.dbPool.execute<ResultSetHeader>(sql, params);
    const created: User = {
      id: +result.insertId,
      fullName: user.fullName,
      email: user.email,
      passwordHash: user.passwordHash,
      userType: user.userType,
    };
    return created;
  }

  public async findById(id: number): Promise<User | null> {
    const sql = `SELECT id, full_name, email, passwd, user_type FROM ${this.tableName} WHERE id = ? LIMIT 1`;
    const [rows] = await database.dbPool.execute<RowDataPacket[]>(sql, [id]);
    const list = rows as unknown as UserRecord[];
    if (list.length === 0) return null;
    return mapUserRecordToUser(list[0]);
  }

  public async findByEmail(email: string): Promise<User | null> {
    const sql = `SELECT id, full_name, email, passwd, user_type FROM ${this.tableName} WHERE email = ? LIMIT 1`;
    const [rows] = await database.dbPool.execute<RowDataPacket[]>(sql, [email]);
    const list = rows as unknown as UserRecord[];
    if (list.length === 0) return null;
    return mapUserRecordToUser(list[0]);
  }

  public async list(limit = 50, offset = 0): Promise<User[]> {
    const sql = `SELECT id, full_name, email, passwd, user_type FROM ${this.tableName} ORDER BY id DESC LIMIT ? OFFSET ?`;
    const [rows] = await database.dbPool.execute<RowDataPacket[]>(sql, [limit, offset]);
    const list = rows as unknown as UserRecord[];
    return list.map(mapUserRecordToUser);
  }

  public async deleteById(id: number): Promise<boolean> {
    const sql = `DELETE FROM ${this.tableName} WHERE id = ?`;
    const [result] = await database.dbPool.execute<ResultSetHeader>(sql, [id]);
    return result.affectedRows > 0;
  }

  public async updateById(id: number, updates: Partial<Pick<NewUser, "fullName" | "email" | "passwordHash" | "userType">>): Promise<User | null> {
    const { setSql, params } = this.buildUpdateSet(updates);
    if (params.length === 0) {
      // Nothing to update; just return current value
      return this.findById(id);
    }
    const sql = `UPDATE ${this.tableName} SET ${setSql} WHERE id = ?`;
    await database.dbPool.execute<ResultSetHeader>(sql, [...params, id]);
    return this.findById(id);
  }

  private buildUpdateSet(updates: Partial<NewUser>): { setSql: string; params: Array<string | UserType> } {
    const setParts: string[] = [];
    const params: Array<string | UserType> = [];

    if (updates.fullName !== undefined) {
      setParts.push("full_name = ?");
      params.push(updates.fullName);
    }
    if (updates.email !== undefined) {
      setParts.push("email = ?");
      params.push(updates.email);
    }
    if (updates.passwordHash !== undefined) {
      setParts.push("passwd = ?");
      params.push(updates.passwordHash);
    }
    if (updates.userType !== undefined) {
      setParts.push("user_type = ?");
      params.push(updates.userType);
    }

    return { setSql: setParts.join(", "), params };
  }
}

export const userRepository = new UserRepository();
