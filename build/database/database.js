"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.database = exports.Database = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const promise_1 = __importDefault(require("mysql2/promise"));
const database_exception_1 = require("../common/exceptions/database/database-exception");
const path_1 = __importDefault(require("path"));
const promises_1 = require("fs/promises");
class Database {
    constructor(dbUrl) {
        this.migPath = path_1.default.join(__dirname, "migrations");
        if (!dbUrl)
            throw new database_exception_1.DatabaseException("dbUrl undefined", "ddl");
        // Option A (works on mysql2 with uri support):
        this.dbPool = promise_1.default.createPool({ uri: dbUrl, multipleStatements: true });
        // Option B (portable): ensure DATABASE_URL includes '?multipleStatements=true'
        // this.dbPool = mysql.createPool(dbUrl);
    }
    async dbInit(resetDB = false) {
        const files = (await (0, promises_1.readdir)(this.migPath)).filter((f) => f.endsWith(".sql")).sort();
        if (resetDB) {
            await this.resetDB();
            console.log("Applying Migrations...");
            for (const file of files) {
                const filePath = path_1.default.join(this.migPath, file);
                const queries = await (0, promises_1.readFile)(filePath, { encoding: "utf-8" });
                await this.dbPool.query(queries);
            }
            console.log("Migrations Applied");
        }
    }
    async resetDB() {
        const dbName = process.env.DATABASE_NAME;
        if (!dbName)
            throw new database_exception_1.DatabaseException("No value for env variable:DATABASE_NAME", "ddl");
        await this.dbPool.query("SET FOREIGN_KEY_CHECKS = 0;");
        try {
            const [results] = await this.dbPool.query("SELECT TABLE_NAME AS table_name FROM information_schema.tables WHERE TABLE_SCHEMA = ?;", [dbName]);
            for (const row of results) {
                const tableName = String(row["table_name"]);
                const escaped = tableName.replace(/`/g, "``");
                await this.dbPool.query(`DROP TABLE IF EXISTS \`${escaped}\`;`);
            }
        }
        finally {
            await this.dbPool.query("SET FOREIGN_KEY_CHECKS = 1;");
        }
    }
    async close() {
        await this.dbPool.end();
    }
}
exports.Database = Database;
exports.database = new Database(process.env.DATABASE_URL);
