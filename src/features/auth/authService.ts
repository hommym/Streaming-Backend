import { Request } from "express";
import { JwtService } from "../../common/utils/services/jwtService";
import { PasswdService } from "../../common/utils/services/passwdService";
import { SignupDto } from "./dtos/signupDto";
import { LoginDto } from "./dtos/loginDto";
import { UpdateAccountInfoDto } from "./dtos/updateAccountInfoDto";
import { ChangePasswordDto } from "./dtos/changePasswordDto";
import { ResetAccountDto } from "./dtos/resetAccountDto";
import { userRepository } from "../../database/repositories/userRepository";
import { UserType } from "../../database/models/user";
import { BadReqException } from "../../common/exceptions/http/badReq";
import { SimpleResponse } from "../../common/utils/dtos/simpleResponse";
import { LoginResponse, PublicUser } from "./dtos/loginResponse";
import { ResourceConflict } from "../../common/exceptions/http/resourceConflict";
import { UnauthReqException } from "../../common/exceptions/http/unauthReq";

export class AuthService {
  private passwdService = new PasswdService();
  private jwtService = new JwtService();

  private getUserIdFromRequest(req: Request): number {
    const auth = req.headers["authorization"] || req.headers["Authorization"];
    if (!auth || Array.isArray(auth)) throw new UnauthReqException("Missing Authorization header");
    const parts = auth.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") throw new UnauthReqException("Invalid Authorization header");
    const payload = this.jwtService.verifyToken(parts[1]) as { userId: number };
    if (!payload?.userId) throw new UnauthReqException("Invalid authentication token");
    return payload.userId;
  }

  public createAccount = async (dto: SignupDto, req: Request) => {
    const existing = await userRepository.findByEmail(dto.email);
    if (existing) throw new ResourceConflict("Email already in use");
    const passwordHash = await this.passwdService.encryptData(dto.password);
    const created = await userRepository.create({
      fullName: dto.fullName,
      email: dto.email,
      passwordHash,
      userType: UserType.Normal,
    });
    return new SimpleResponse("Account created successfully");
  };

  public login = async (dto: LoginDto, req: Request) => {
    const user = await userRepository.findByEmail(dto.email);
    if (!user) throw new BadReqException("Invalid email or password");
    await this.passwdService.verifyEncryptedData(dto.password, user.passwordHash);
    const token = this.jwtService.generateToken(user.id);
    const publicUser: PublicUser = {
      fullName: user.fullName,
      email: user.email,
    };
    return new LoginResponse(token, publicUser);
  };

  public updateAccountInfo = async (dto: UpdateAccountInfoDto, req: Request) => {
    const userId = this.getUserIdFromRequest(req);
    const updated = await userRepository.updateById(userId, {
      fullName: dto.fullName,
      email: dto.email,
    });
    if (!updated) throw new BadReqException("User not found");
    return new SimpleResponse("Account updated");
  };

  public deleteAccount = async (_dto: undefined, req: Request) => {
    const userId = this.getUserIdFromRequest(req);
    const ok = await userRepository.deleteById(userId);
    if (!ok) throw new BadReqException("User not found");
    return new SimpleResponse("Account deleted");
  };

  public changePasswd = async (dto: ChangePasswordDto, req: Request) => {
    const userId = this.getUserIdFromRequest(req);
    const user = await userRepository.findById(userId);
    if (!user) throw new BadReqException("User not found");
    await this.passwdService.verifyEncryptedData(dto.oldPassword, user.passwordHash);
    const newHash = await this.passwdService.encryptData(dto.newPassword);
    await userRepository.updateById(userId, { passwordHash: newHash });
    return new SimpleResponse("Password Changed Sucessful");
  };

  public resetAccount = async (dto: ResetAccountDto, req: Request) => {
    const user = await userRepository.findByEmail(dto.email);
    if (!user) throw new BadReqException("User not found");
    const newHash = await this.passwdService.encryptData(dto.newPassword);
    await userRepository.updateById(user.id, { passwordHash: newHash });
    return new SimpleResponse("Account Reset Successful");
  };
}

export const authService = new AuthService();
