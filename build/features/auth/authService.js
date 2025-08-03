"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = exports.AuthService = void 0;
const jwtService_1 = require("../../common/utils/services/jwtService");
const passwdService_1 = require("../../common/utils/services/passwdService");
class AuthService {
    constructor() {
        this.passwdService = new passwdService_1.PasswdService();
        this.jwtService = new jwtService_1.JwtService();
    }
    async createAccount() { }
    async login() { }
    async updateAccountInfo() { }
    async deleteAccount() { }
    async changePasswd() {
    }
    async resetAccount() {
    }
}
exports.AuthService = AuthService;
exports.authService = new AuthService();
