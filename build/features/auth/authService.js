"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = exports.AuthService = void 0;
const crypto_1 = require("crypto");
const jwtService_1 = require("../../common/utils/services/jwtService");
const passwdService_1 = require("../../common/utils/services/passwdService");
const userRepository_1 = require("../../database/repositories/userRepository");
const user_1 = require("../../database/models/user");
const badReq_1 = require("../../common/exceptions/http/badReq");
const simpleResponse_1 = require("../../common/utils/dtos/simpleResponse");
const loginResponse_1 = require("./dtos/loginResponse");
const resourceConflict_1 = require("../../common/exceptions/http/resourceConflict");
const serverEvents_1 = require("../../events/serverEvents");
const resourceNotFound_1 = require("../../common/exceptions/http/resourceNotFound");
class AuthService {
    constructor() {
        this.passwdService = passwdService_1.passwdService;
        this.jwtService = jwtService_1.jwtService;
        this.createAccount = async (dto, req) => {
            const existing = await userRepository_1.userRepository.findByEmail(dto.email);
            if (existing)
                throw new resourceConflict_1.ResourceConflict("Email already in use");
            const passwordHash = await this.passwdService.encryptData(dto.password);
            const created = await userRepository_1.userRepository.create({
                fullName: dto.fullName,
                email: dto.email,
                passwordHash,
                userType: user_1.UserType.Normal,
            });
            // await emailService.sendWelcomeEmail(dto.email, dto.fullName);
            serverEvents_1.serverEvents.emit("send-congrats-email", { fullName: dto.fullName, recipientEmail: dto.email });
            return new simpleResponse_1.SimpleResponse("Account created successfully");
        };
        this.login = async (dto, req) => {
            const user = await userRepository_1.userRepository.findByEmail(dto.email);
            if (!user)
                throw new badReq_1.BadReqException("Invalid email or password");
            await this.passwdService.verifyEncryptedData(dto.password, user.passwordHash);
            const token = this.jwtService.generateToken(user.id);
            const publicUser = {
                fullName: user.fullName,
                email: user.email,
            };
            return new loginResponse_1.LoginResponse(token, publicUser);
        };
        this.updateAccountInfo = async (dto, req) => {
            const userId = req.user.id;
            await userRepository_1.userRepository.updateById(userId, {
                fullName: dto.fullName,
                email: dto.email,
            });
            return new simpleResponse_1.SimpleResponse("Account updated");
        };
        this.deleteAccount = async (_dto, req) => {
            const userId = req.user.id;
            await userRepository_1.userRepository.deleteById(userId);
            return new simpleResponse_1.SimpleResponse("Account deleted");
        };
        this.changePasswd = async (dto, req) => {
            await this.passwdService.verifyEncryptedData(dto.oldPassword, req.user.passwordHash);
            const newHash = await this.passwdService.encryptData(dto.newPassword);
            await userRepository_1.userRepository.updateById(req.user.id, { passwordHash: newHash });
            return new simpleResponse_1.SimpleResponse("Password Changed Sucessful");
        };
        this.resetAccount = async (dto, req) => {
            const user = await userRepository_1.userRepository.findByEmail(dto.email);
            if (!user)
                throw new resourceNotFound_1.ResourceNotFoundException("No Account With this email exist");
            const randomPassword = this.generateRandomPassword(12);
            const newHash = await this.passwdService.encryptData(randomPassword);
            await userRepository_1.userRepository.updateById(user.id, { passwordHash: newHash });
            // await emailService.sendPasswordResetEmail(user.email, user.fullName, randomPassword);
            serverEvents_1.serverEvents.emit("send-reset-account-email", { fullName: user.fullName, recipientEmail: user.email, plainPassword: randomPassword });
            return new simpleResponse_1.SimpleResponse("Account Reset Successful");
        };
    }
    generateRandomPassword(length = 12) {
        const allowedCharacters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_-+=";
        const randomBuffer = (0, crypto_1.randomBytes)(length);
        let password = "";
        for (let index = 0; index < length; index += 1) {
            const charIndex = randomBuffer[index] % allowedCharacters.length;
            password += allowedCharacters.charAt(charIndex);
        }
        return password;
    }
}
exports.AuthService = AuthService;
exports.authService = new AuthService();
