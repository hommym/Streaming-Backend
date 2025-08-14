import { Expose } from "class-transformer";
import { IsEmail } from "class-validator";

export class ResetAccountDto {
  @Expose()
  @IsEmail()
  email!: string;
}
