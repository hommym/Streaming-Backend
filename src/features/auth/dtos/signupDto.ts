import { Expose } from "class-transformer";
import { IsEmail, IsEnum, IsString, MinLength } from "class-validator";
import { UserType } from "../../../database/models/user";

export class SignupDto {
  @Expose()
  @IsString()
  @MinLength(2)
  fullName!: string;

  @Expose()
  @IsEmail()
  email!: string;

  @Expose()
  @IsString()
  @MinLength(6)
  password!: string;

 
}
