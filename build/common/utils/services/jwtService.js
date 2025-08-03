"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtService = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const serverError_1 = require("../../exceptions/http/serverError");
const unauthReq_1 = require("../../exceptions/http/unauthReq");
class JwtService {
    constructor() {
        if (process.env.JwtSecretKey)
            this.secret = process.env.JwtSecretKey;
        else
            throw new serverError_1.ServerErrException("No value found for env var:JwtSecretKey");
    }
    generateToken(userId) {
        return jsonwebtoken_1.default.sign({ userId }, this.secret, { expiresIn: "365d" });
    }
    verifyToken(token) {
        try {
            return jsonwebtoken_1.default.verify(token, this.secret);
        }
        catch (error) {
            throw new unauthReq_1.UnauthReqException("Invalid authentication token");
        }
    }
}
exports.JwtService = JwtService;
