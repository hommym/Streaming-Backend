import dotenv from "dotenv";
dotenv.config();
import mysql, { Pool } from "mysql2/promise";
import { DatabaseException } from "../common/exceptions/database/database-exception";
import path from "path";
import { readdir, readFile } from "fs/promises";

export class Database {
  dbPool: Pool;
  private migPath = path.join(__dirname, "/migrations"); // path to db migration files

  constructor(dbUrl: string | undefined) {
    if (!dbUrl) {
      throw new DatabaseException("dbUrl undefined", "ddl");
    }
    this.dbPool = mysql.createPool({ uri: dbUrl, multipleStatements: true });
  }

  async dbInit(resetDB: boolean = false) {
    // go into migration folder
    const files = await readdir(this.migPath); // list of the names of files
    console.log("Applying Migrations...");
    if (resetDB) await this.resetDB();
    for (let file of files) {
      const filePath = path.join(this.migPath, file);
      const queries = await readFile(filePath, { encoding: "utf-8" });
      await this.dbPool.query(queries);
    }
    console.log("Migrations Applied");
  }

  private async resetDB() {
    if (!process.env.DATABASE_NAME) throw new DatabaseException("No value for env variable:DATABASE_NAME", "ddl");
    const dbName = process.env.DATABASE_NAME;
    await this.dbPool.query("SET FOREIGN_KEY_CHECKS = 0;");

    // get all table names within the db
    const [results] = await this.dbPool.execute<any[]>("SELECT table_name FROM information_schema.tables" + ` WHERE TABLE_SCHEMA='${dbName}';`);

    // drop all these tables using names
    for (let row of results) {
      const tableName = row["TABLE_NAME"];
      await this.dbPool.execute(`DROP TABLE ${tableName};`);
    }

    await this.dbPool.query("SET FOREIGN_KEY_CHECKS = 1;");
  }
}

export const database = new Database(process.env.DATABASE_URL);
