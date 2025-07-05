"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseException = void 0;
class DatabaseException extends Error {
    constructor(message, sqlType) {
        super(message);
        this.sqlType = sqlType;
    }
}
exports.DatabaseException = DatabaseException;
