"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = exports.AuthService = void 0;
const jwtService_1 = require("../../common/utils/services/jwtService");
const passwdService_1 = require("../../common/utils/services/passwdService");
const userRepository_1 = require("../../database/repositories/userRepository");
const badReq_1 = require("../../common/exceptions/http/badReq");
const simpleResponse_1 = require("../../common/utils/dtos/simpleResponse");
const loginResponse_1 = require("./dtos/loginResponse");
const resourceConflict_1 = require("../../common/exceptions/http/resourceConflict");
const unauthReq_1 = require("../../common/exceptions/http/unauthReq");
class AuthService {
    constructor() {
        this.passwdService = new passwdService_1.PasswdService();
        this.jwtService = new jwtService_1.JwtService();
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
    async createAccount(dto, req) {
        const existing = await userRepository_1.userRepository.findByEmail(dto.email);
        if (existing)
            throw new resourceConflict_1.ResourceConflict("Email already in use");
        const passwordHash = await this.passwdService.encryptData(dto.password);
        const created = await userRepository_1.userRepository.create({
            fullName: dto.fullName,
            email: dto.email,
            passwordHash,
            userType: dto.userType,
        });
        return new simpleResponse_1.SimpleResponse("Account created successfully");
    }
    async login(dto, req) {
        const user = await userRepository_1.userRepository.findByEmail(dto.email);
        if (!user)
            throw new badReq_1.BadReqException("Invalid email or password");
        await this.passwdService.verifyEncryptedData(dto.password, user.passwordHash);
        const token = this.jwtService.generateToken(user.id);
        return new loginResponse_1.LoginResponse(token, user);
    }
    async updateAccountInfo(dto, req) {
        const userId = this.getUserIdFromRequest(req);
        const updated = await userRepository_1.userRepository.updateById(userId, {
            fullName: dto.fullName,
            email: dto.email,
        });
        if (!updated)
            throw new badReq_1.BadReqException("User not found");
        return new simpleResponse_1.SimpleResponse("Account updated");
    }
    async deleteAccount(_dto, req) {
        const userId = this.getUserIdFromRequest(req);
        const ok = await userRepository_1.userRepository.deleteById(userId);
        if (!ok)
            throw new badReq_1.BadReqException("User not found");
        return new simpleResponse_1.SimpleResponse("Account deleted");
    }
    async changePasswd(dto, req) {
        const userId = this.getUserIdFromRequest(req);
        const user = await userRepository_1.userRepository.findById(userId);
        if (!user)
            throw new badReq_1.BadReqException("User not found");
        await this.passwdService.verifyEncryptedData(dto.oldPassword, user.passwordHash);
        const newHash = await this.passwdService.encryptData(dto.newPassword);
        await userRepository_1.userRepository.updateById(userId, { passwordHash: newHash });
        return new simpleResponse_1.SimpleResponse("Password changed");
    }
    async resetAccount(dto, req) {
        const user = await userRepository_1.userRepository.findByEmail(dto.email);
        if (!user)
            throw new badReq_1.BadReqException("User not found");
        const newHash = await this.passwdService.encryptData(dto.newPassword);
        await userRepository_1.userRepository.updateById(user.id, { passwordHash: newHash });
        return new simpleResponse_1.SimpleResponse("Account reset");
    }
}
exports.AuthService = AuthService;
exports.authService = new AuthService();
