import dotenv from "dotenv";
dotenv.config();
import mysql, { Pool } from "mysql2/promise";
import { DatabaseException } from "../common/exceptions/database/database-exception";
import path from "path";
import { readdir, readFile } from "fs/promises";

export class Database {
  dbPool: Pool;
  private migPath = path.join(__dirname, "migrations");

  constructor(dbUrl: string | undefined) {
    if (!dbUrl) throw new DatabaseException("dbUrl undefined", "ddl");
    // Option A (works on mysql2 with uri support):
    this.dbPool = mysql.createPool({ uri: dbUrl, multipleStatements: true });
    // Option B (portable): ensure DATABASE_URL includes '?multipleStatements=true'
    // this.dbPool = mysql.createPool(dbUrl);
  }

  async dbInit(resetDB: boolean = false) {
    const files = (await readdir(this.migPath)).filter((f) => f.endsWith(".sql")).sort();
    console.log("Applying Migrations...");
    if (resetDB) await this.resetDB();
    for (const file of files) {
      const filePath = path.join(this.migPath, file);
      const queries = await readFile(filePath, { encoding: "utf-8" });
      await this.dbPool.query(queries);
    }
    console.log("Migrations Applied");
  }

  private async resetDB() {
    const dbName = process.env.DATABASE_NAME;
    if (!dbName) throw new DatabaseException("No value for env variable:DATABASE_NAME", "ddl");

    await this.dbPool.query("SET FOREIGN_KEY_CHECKS = 0;");
    try {
      const [results] = await this.dbPool.query<any[]>("SELECT TABLE_NAME AS table_name FROM information_schema.tables WHERE TABLE_SCHEMA = ?;", [dbName]);

      for (const row of results) {
        const tableName = String(row["table_name"]);
        const escaped = tableName.replace(/`/g, "``");
        await this.dbPool.query(`DROP TABLE IF EXISTS \`${escaped}\`;`);
      }
    } finally {
      await this.dbPool.query("SET FOREIGN_KEY_CHECKS = 1;");
    }
  }

  async close() {
    await this.dbPool.end();
  }
}

export const database = new Database(process.env.DATABASE_URL);
