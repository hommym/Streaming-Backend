"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerErrException = void 0;
class ServerErrException extends Error {
    constructor(message) {
        super(message);
        this.statusCode = 500;
    }
}
exports.ServerErrException = ServerErrException;
