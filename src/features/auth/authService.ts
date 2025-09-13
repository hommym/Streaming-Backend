import { Request } from "express";
import { randomBytes } from "crypto";
import { jwtService } from "../../common/utils/services/jwtService";
import { passwdService } from "../../common/utils/services/passwdService";
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
import { serverEvents } from "../../events/serverEvents";
import { ResourceNotFoundException } from "../../common/exceptions/http/resourceNotFound";

export class AuthService {
  private passwdService = passwdService;
  private jwtService = jwtService;



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
    // await emailService.sendWelcomeEmail(dto.email, dto.fullName);
    serverEvents.emit("send-congrats-email", { fullName: dto.fullName, recipientEmail: dto.email });
    return new SimpleResponse("Account created successfully");
  };

  public login = async (dto: LoginDto, req: Request) => {
    const user = await userRepository.findByEmail(dto.email);
    if (!user) throw new ResourceNotFoundException("Invalid email or password");
    await this.passwdService.verifyEncryptedData(dto.password, user.passwordHash);
    const token = this.jwtService.generateToken(user.id);
    const publicUser: PublicUser = {
      fullName: user.fullName,
      email: user.email,
    };
    return new LoginResponse(token, publicUser);
  };

  public updateAccountInfo = async (dto: UpdateAccountInfoDto, req: Request) => {
    const userId = req.user!.id
     await userRepository.updateById(userId, {
      fullName: dto.fullName,
      email: dto.email,
    });
    return new SimpleResponse("Account updated");
  };

  public deleteAccount = async (_dto: undefined, req: Request) => {
    const userId = req.user!.id;
    await userRepository.deleteById(userId);
    return new SimpleResponse("Account deleted");
  };

  public changePasswd = async (dto: ChangePasswordDto, req: Request) => {
   
    await this.passwdService.verifyEncryptedData(dto.oldPassword, req.user!.passwordHash);
    const newHash = await this.passwdService.encryptData(dto.newPassword);
    await userRepository.updateById(req.user!.id, { passwordHash: newHash });
    return new SimpleResponse("Password Changed Sucessful");
  };

  public resetAccount = async (dto: ResetAccountDto, req: Request) => {
    const user = await userRepository.findByEmail(dto.email);
    if (!user) throw new ResourceNotFoundException("No Account With this email exist");
    const randomPassword = this.generateRandomPassword(12);
    const newHash = await this.passwdService.encryptData(randomPassword);
    await userRepository.updateById(user.id, { passwordHash: newHash });
    // await emailService.sendPasswordResetEmail(user.email, user.fullName, randomPassword);
    serverEvents.emit("send-reset-account-email",{fullName:user.fullName,recipientEmail:user.email,plainPassword:randomPassword})
    return new SimpleResponse("Account Reset Successful");
  };

  private generateRandomPassword(length: number = 12): string {
    const allowedCharacters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_-+=";
    const randomBuffer = randomBytes(length);
    let password = "";
    for (let index = 0; index < length; index += 1) {
      const charIndex = randomBuffer[index] % allowedCharacters.length;
      password += allowedCharacters.charAt(charIndex);
    }
    return password;
  }
}

export const authService = new AuthService();
