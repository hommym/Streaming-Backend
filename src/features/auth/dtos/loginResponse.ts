import { Expose } from "class-transformer";

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
}
