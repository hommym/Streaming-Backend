"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.passwdService = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const bcrypt_1 = __importDefault(require("bcrypt"));
const serverError_1 = require("../../exceptions/http/serverError");
const unauthReq_1 = require("../../exceptions/http/unauthReq");
class PasswdService {
    constructor() {
        this.encryptData = async (rawPassword) => {
            return await bcrypt_1.default.hash(rawPassword, this.encryptRounds);
        };
        this.verifyEncryptedData = async (rawData, encryptedData) => {
            const isPasswordCorrect = await bcrypt_1.default.compare(rawData, encryptedData);
            if (!isPasswordCorrect)
                throw new unauthReq_1.UnauthReqException("Invalid Password and Email");
        };
        if (process.env.PasswordEncrptRounds)
            this.encryptRounds = +process.env.PasswordEncrptRounds;
        else
            throw new serverError_1.ServerErrException("No value found for env var:PasswordEncrptRounds");
    }
}
exports.passwdService = new PasswdService();
