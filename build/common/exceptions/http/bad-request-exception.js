"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BadRequestException = void 0;
const http_exception_1 = require("./http-exception");
class BadRequestException extends http_exception_1.HttpException {
    constructor(message) {
        super(message, 400);
    }
}
exports.BadRequestException = BadRequestException;
