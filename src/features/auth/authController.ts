import { Controller } from "../../common/utils/class/controller";
import { AuthService } from "./authService";
import { SignupDto } from "./dtos/signupDto";
import { SimpleResponse } from "../../common/utils/dtos/simpleResponse";
import { LoginDto } from "./dtos/loginDto";
import { LoginResponse } from "./dtos/loginResponse";
import { UpdateAccountInfoDto } from "./dtos/updateAccountInfoDto";
import { ResetAccountDto } from "./dtos/resetAccountDto";
import { ChangePasswordDto } from "./dtos/changePasswordDto";

class AuthController {
  private contoller = new Controller();
  private authService = new AuthService();

  private addEndPoints() {
    this.contoller.addRoute<SignupDto, SimpleResponse>("post", "/signup", this.authService.createAccount, SignupDto);
    this.contoller.addRoute<LoginDto, LoginResponse>("post", "/login", this.authService.login, LoginDto);
    this.contoller.addRoute<UpdateAccountInfoDto, SimpleResponse>("patch", "/update-account", this.authService.updateAccountInfo, UpdateAccountInfoDto);
    this.contoller.addRoute<SimpleResponse>("delete", "/", this.authService.deleteAccount);
    this.contoller.addRoute<ResetAccountDto, SimpleResponse>("post", "/reset-account", this.authService.resetAccount, ResetAccountDto);
    this.contoller.addRoute<ChangePasswordDto, SimpleResponse>("post", "/change-password", this.authService.changePasswd, ChangePasswordDto);

  }

  constructor() {
    this.addEndPoints();
  }

  public get Router() {
    return this.contoller.Router;
  }
}

export const authController = new AuthController();
