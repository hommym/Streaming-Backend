"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = void 0;
const controller_1 = require("../../common/utils/class/controller");
const authService_1 = require("./authService");
const signupDto_1 = require("./dtos/signupDto");
const loginDto_1 = require("./dtos/loginDto");
const updateAccountInfoDto_1 = require("./dtos/updateAccountInfoDto");
const resetAccountDto_1 = require("./dtos/resetAccountDto");
const changePasswordDto_1 = require("./dtos/changePasswordDto");
class AuthController {
    addEndPoints() {
        this.contoller.addRoute("post", "/signup", this.authService.createAccount, signupDto_1.SignupDto);
        this.contoller.addRoute("post", "/login", this.authService.login, loginDto_1.LoginDto);
        this.contoller.addRoute("patch", "/update-account", this.authService.updateAccountInfo, updateAccountInfoDto_1.UpdateAccountInfoDto);
        this.contoller.addRoute("delete", "/", this.authService.deleteAccount);
        this.contoller.addRoute("post", "/reset-account", this.authService.resetAccount, resetAccountDto_1.ResetAccountDto);
        this.contoller.addRoute("post", "/change-password", this.authService.changePasswd, changePasswordDto_1.ChangePasswordDto);
    }
    constructor() {
        this.contoller = new controller_1.Controller();
        this.authService = new authService_1.AuthService();
        this.addEndPoints();
    }
    get Router() {
        return this.contoller.Router;
    }
}
exports.authController = new AuthController();
