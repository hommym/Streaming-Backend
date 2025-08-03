"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BadReqException = void 0;
const httpException_1 = require("./httpException");
class BadReqException extends httpException_1.HttpException {
    constructor(message) {
        super(message, 400);
    }
}
exports.BadReqException = BadReqException;
