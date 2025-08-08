"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRepository = exports.UserRepository = void 0;
const database_1 = require("../../database/database");
const user_1 = require("../models/user");
class UserRepository {
    constructor() {
        this.tableName = "`user`"; // backticks due to reserved word
    }
    async create(user) {
        const record = (0, user_1.mapNewUserToRecord)(user);
        const sql = `INSERT INTO ${this.tableName} (full_name, email, passwd, user_type) VALUES (?, ?, ?, ?)`;
        const params = [record.full_name, record.email, record.passwd, record.user_type];
        const [result] = await database_1.database.dbPool.execute(sql, params);
        const created = {
            id: +result.insertId,
            fullName: user.fullName,
            email: user.email,
            passwordHash: user.passwordHash,
            userType: user.userType,
        };
        return created;
    }
    async findById(id) {
        const sql = `SELECT id, full_name, email, passwd, user_type FROM ${this.tableName} WHERE id = ? LIMIT 1`;
        const [rows] = await database_1.database.dbPool.execute(sql, [id]);
        const list = rows;
        if (list.length === 0)
            return null;
        return (0, user_1.mapUserRecordToUser)(list[0]);
    }
    async findByEmail(email) {
        const sql = `SELECT id, full_name, email, passwd, user_type FROM ${this.tableName} WHERE email = ? LIMIT 1`;
        const [rows] = await database_1.database.dbPool.execute(sql, [email]);
        const list = rows;
        if (list.length === 0)
            return null;
        return (0, user_1.mapUserRecordToUser)(list[0]);
    }
    async list(limit = 50, offset = 0) {
        const sql = `SELECT id, full_name, email, passwd, user_type FROM ${this.tableName} ORDER BY id DESC LIMIT ? OFFSET ?`;
        const [rows] = await database_1.database.dbPool.execute(sql, [limit, offset]);
        const list = rows;
        return list.map(user_1.mapUserRecordToUser);
    }
    async deleteById(id) {
        const sql = `DELETE FROM ${this.tableName} WHERE id = ?`;
        const [result] = await database_1.database.dbPool.execute(sql, [id]);
        return result.affectedRows > 0;
    }
    async updateById(id, updates) {
        const { setSql, params } = this.buildUpdateSet(updates);
        if (params.length === 0) {
            // Nothing to update; just return current value
            return this.findById(id);
        }
        const sql = `UPDATE ${this.tableName} SET ${setSql} WHERE id = ?`;
        await database_1.database.dbPool.execute(sql, [...params, id]);
        return this.findById(id);
    }
    buildUpdateSet(updates) {
        const setParts = [];
        const params = [];
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
exports.UserRepository = UserRepository;
exports.userRepository = new UserRepository();
