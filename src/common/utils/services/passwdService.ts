import dotenv from "dotenv";
dotenv.config();
import bcrypt from "bcrypt";
import { ServerErrException } from "../../exceptions/http/serverError";
import { UnauthReqException } from "../../exceptions/http/unauthReq";

export class PasswdService {
  private encryptRounds: number;

  constructor() {
    if (process.env.PasswordEncrptRounds) this.encryptRounds = +process.env.PasswordEncrptRounds;
    else throw new ServerErrException("No value found for env var:PasswordEncrptRounds");
  }

  public encryptData = async (rawPassword: string): Promise<string> => {
    return await bcrypt.hash(rawPassword, this.encryptRounds);
  };

  public verifyEncryptedData = async (rawData: string, encryptedData: string) => {
    const isPasswordCorrect = await bcrypt.compare(rawData, encryptedData);
    if (!isPasswordCorrect) throw new UnauthReqException("Invalid Password and Email");
  };
}
