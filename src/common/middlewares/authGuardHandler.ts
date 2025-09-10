import { NextFunction, Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { jwtService } from "../utils/services/jwtService";
import { UnauthReqException } from "../exceptions/http/unauthReq";
import { userRepository } from "../../database/repositories/userRepository";

class AuthGuard {
  private jwtService = jwtService;
  private publicPath = ["/api/v1/auth/signup", "/api/v1/auth/login", "/api/v1/auth/reset-account"];

  private getUserIdFromRequest(req: Request): number {
    const auth = req.headers["authorization"] || req.headers["Authorization"];
    if (!auth || Array.isArray(auth)) throw new UnauthReqException("Missing Authorization header");
    const parts = auth.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") throw new UnauthReqException("Invalid Authorization header");
    const payload = this.jwtService.verifyToken(parts[1]) as { userId: number };
    if (!payload?.userId) throw new UnauthReqException("Invalid authentication token");
    return payload.userId;
  }
  private isPathPublic(urlPath: string) {
    return this.publicPath.includes(urlPath);
  }

  handler = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    if (this.isPathPublic(`${req.baseUrl}${req.url}`)) {
      next();
    } else {
      const user = await userRepository.findById(this.getUserIdFromRequest(req));
      if (!user) throw new UnauthReqException("Invalid Auth Token");
      req.user = user;
      next();
    }
  });
}

export const authGuard = new AuthGuard();
