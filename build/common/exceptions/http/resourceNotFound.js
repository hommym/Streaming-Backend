"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResourceNotFoundException = void 0;
const httpException_1 = require("./httpException");
class ResourceNotFoundException extends httpException_1.HttpException {
    constructor(message) {
        super(message, 404);
    }
}
exports.ResourceNotFoundException = ResourceNotFoundException;
