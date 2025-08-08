import { Expose } from "class-transformer";
import { IsEmail, IsString, MinLength } from "class-validator";

export class ResetAccountDto {
  @Expose()
  @IsEmail()
  email!: string;

  @Expose()
  @IsString()
  @MinLength(6)
  newPassword!: string;
}
