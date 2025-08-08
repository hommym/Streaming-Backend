import { Router } from "express";
import { authController } from "../../features/auth/authController";

export const mainServerRouter = Router();

mainServerRouter.use("/auth", authController.getRouter());
