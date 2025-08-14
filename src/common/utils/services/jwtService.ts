import dotenv from "dotenv";
dotenv.config();
import jwt, { JwtPayload } from "jsonwebtoken";
import { ServerErrException } from "../../exceptions/http/serverError";
import { UnauthReqException } from "../../exceptions/http/unauthReq";

 class JwtService {
  secret: string ;

  constructor() {
    if (process.env.JwtSecretKey) this.secret = process.env.JwtSecretKey;
    else throw new ServerErrException("No value found for env var:JwtSecretKey");
    }
  public generateToken(userId: number): string {
    return jwt.sign({ userId }, this.secret, { expiresIn: "365d" });   
  }

  public verifyToken(token: string) {
     try {
        return jwt.verify(token, this.secret) as JwtPayload;
     } catch (error) {
        throw new UnauthReqException("Invalid authentication token")
     }
   
  }
}



export const jwtService=new JwtService();