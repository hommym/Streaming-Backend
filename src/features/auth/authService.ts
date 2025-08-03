import { JwtService } from "../../common/utils/services/jwtService";
import { PasswdService } from "../../common/utils/services/passwdService";


export class AuthService {

  
  private passwdService=new PasswdService();
  private jwtService=new JwtService();  
  
  public async createAccount() {}

  public async login() {}

  public async updateAccountInfo() {}

  public async deleteAccount() {}

  public async changePasswd(){

  }

  public async resetAccount(){

  }
}

export const authService=new AuthService();