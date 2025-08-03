import { Router } from "express";
import { authRouter } from "../../features/auth/authController";




export const mainServerRouter=Router()

mainServerRouter.use("/auth",authRouter)