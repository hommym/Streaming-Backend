"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mainServerRouter = void 0;
const express_1 = require("express");
const authController_1 = require("../../features/auth/authController");
exports.mainServerRouter = (0, express_1.Router)();
exports.mainServerRouter.use("/auth", authController_1.authController.getRouter());
