"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Controller = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const express_1 = require("express");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const badReq_1 = require("../../exceptions/http/badReq");
class Controller {
    constructor() {
        this.router = (0, express_1.Router)();
    }
    // Implementation
    addRoute(method, path, serviceMethod, dtoType) {
        this.router[method](path, (0, express_async_handler_1.default)(async (req, res) => {
            var _a;
            let dtoInstance = undefined;
            if (dtoType) {
                dtoInstance = (0, class_transformer_1.plainToInstance)(dtoType, (_a = req.body) !== null && _a !== void 0 ? _a : {}, {
                    excludeExtraneousValues: true,
                    enableImplicitConversion: true,
                });
                const errors = await (0, class_validator_1.validate)(dtoInstance);
                if (errors.length > 0) {
                    throw new badReq_1.BadReqException(this.formatValidationErrors(errors));
                }
            }
            const result = await serviceMethod(dtoInstance, req);
            if (typeof result === "undefined") {
                res.status(204).end();
                return;
            }
            res.json(result);
        }));
    }
    formatValidationErrors(errors) {
        const details = [];
        const collect = (err, path) => {
            const fieldPath = path ? `${path}.${err.property}` : err.property;
            const messages = err.constraints ? Object.values(err.constraints) : [];
            if (messages.length)
                details.push({ field: fieldPath, messages });
            if (err.children && err.children.length) {
                for (const child of err.children)
                    collect(child, fieldPath);
            }
        };
        for (const e of errors)
            collect(e, "");
        return `Invalid Request Body: ${JSON.stringify(details)}`;
    }
    getRouter() {
        return this.router;
    }
}
exports.Controller = Controller;
