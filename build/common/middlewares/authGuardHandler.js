"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authGuard = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const jwtService_1 = require("../utils/services/jwtService");
const unauthReq_1 = require("../exceptions/http/unauthReq");
const userRepository_1 = require("../../database/repositories/userRepository");
class AuthGuard {
    constructor() {
        this.jwtService = jwtService_1.jwtService;
        // reg for /api/v1/auth/$(login|signup|reset-account), and /api/v1/movie-info/*
        this.publicPathPatterns = [/^\/api\/v1\/auth\/(login|signup|reset-account)$/, /^\/api\/v1\/movie-info\/.+$/];
        this.handler = (0, express_async_handler_1.default)(async (req, res, next) => {
            if (this.isPathPublic(`${req.baseUrl}${req.url}`)) {
                next();
            }
            else {
                const user = await userRepository_1.userRepository.findById(this.getUserIdFromRequest(req));
                if (!user)
                    throw new unauthReq_1.UnauthReqException("Invalid Auth Token");
                req.user = user;
                next();
            }
        });
    }
    getUserIdFromRequest(req) {
        const auth = req.headers["authorization"] || req.headers["Authorization"];
        if (!auth || Array.isArray(auth))
            throw new unauthReq_1.UnauthReqException("Missing Authorization header");
        const parts = auth.split(" ");
        if (parts.length !== 2 || parts[0] !== "Bearer")
            throw new unauthReq_1.UnauthReqException("Invalid Authorization header");
        const payload = this.jwtService.verifyToken(parts[1]);
        if (!(payload === null || payload === void 0 ? void 0 : payload.userId))
            throw new unauthReq_1.UnauthReqException("Invalid authentication token");
        return payload.userId;
    }
    isPathPublic(urlPath) {
        let isV = false;
        for (let regEx of this.publicPathPatterns) {
            isV = regEx.test(urlPath);
            if (isV)
                break;
        }
        return isV;
    }
}
exports.authGuard = new AuthGuard();
