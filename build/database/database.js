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
        this.migPath = path_1.default.join(__dirname, "/migrations"); // path to db migration files
        if (!dbUrl) {
            throw new database_exception_1.DatabaseException("dbUrl undefined", "ddl");
        }
        this.dbPool = promise_1.default.createPool({ uri: dbUrl, multipleStatements: true });
    }
    async dbInit(resetDB = false) {
        // go into migration folder
        const files = await (0, promises_1.readdir)(this.migPath); // list of the names of files
        console.log("Applying Migrations...");
        if (resetDB)
            await this.resetDB();
        for (let file of files) {
            const filePath = path_1.default.join(this.migPath, file);
            const queries = await (0, promises_1.readFile)(filePath, { encoding: "utf-8" });
            await this.dbPool.query(queries);
        }
        console.log("Migrations Applied");
    }
    async resetDB() {
        if (!process.env.DATABASE_NAME)
            throw new database_exception_1.DatabaseException("No value for env variable:DATABASE_NAME", "ddl");
        const dbName = process.env.DATABASE_NAME;
        await this.dbPool.query("SET FOREIGN_KEY_CHECKS = 0;");
        // get all table names within the db
        const [results] = await this.dbPool.execute("SELECT table_name FROM information_schema.tables" + ` WHERE TABLE_SCHEMA='${dbName}';`);
        // drop all these tables using names
        for (let row of results) {
            const tableName = row["TABLE_NAME"];
            await this.dbPool.execute(`DROP TABLE ${tableName};`);
        }
        await this.dbPool.query("SET FOREIGN_KEY_CHECKS = 1;");
    }
}
exports.Database = Database;
exports.database = new Database(process.env.DATABASE_URL);
