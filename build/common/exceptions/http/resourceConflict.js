"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResourceConflict = void 0;
const httpException_1 = require("./httpException");
class ResourceConflict extends httpException_1.HttpException {
    constructor(message) {
        super(message, 409);
    }
}
exports.ResourceConflict = ResourceConflict;
