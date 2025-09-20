import { Router } from "express";
import { authController } from "../../features/auth/authController";
import { movieInfoController } from "../../features/movie-info/movieInfoController";

export const mainServerRouter = Router();

mainServerRouter.use("/auth", authController.Router);
mainServerRouter.use("/movie-info", movieInfoController.Router);
