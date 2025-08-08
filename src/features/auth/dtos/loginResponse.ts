import { Expose } from "class-transformer";
import { UserType } from "../../../database/models/user";

export class LoginResponse {
  @Expose()
  token!: string;

  @Expose()
  user!: PublicUser;

  constructor(token: string, user: PublicUser) {
    this.token = token;
    this.user = user;
  }
}

export interface PublicUser {
  fullName: string;
  email: string;
  userType: UserType;
}
