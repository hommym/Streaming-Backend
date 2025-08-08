import { Expose } from "class-transformer";
import { User } from "../../../database/models/user";

export class LoginResponse {
  @Expose()
  token!: string;

  @Expose()
  user!: User;

  constructor(token: string, user: User) {
    this.token = token;
    this.user = user;
  }
}
