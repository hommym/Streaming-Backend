"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnauthReqException = void 0;
const httpException_1 = require("./httpException");
class UnauthReqException extends httpException_1.HttpException {
    constructor(message) {
        super(message, 401);
    }
}
exports.UnauthReqException = UnauthReqException;
