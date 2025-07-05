export class DatabaseException extends Error {
  sqlType: "ddl" | "dml";

  constructor(message: string, sqlType: "ddl" | "dml") {
    super(message);
    this.sqlType = sqlType;
  }
}
