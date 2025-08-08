import { Expose } from "class-transformer";
import { IsEmail, IsInt, IsOptional, IsString, Min, MinLength } from "class-validator";

export class UpdateAccountInfoDto {

  @Expose()
  @IsOptional()
  @IsString()
  @MinLength(2)
  fullName?: string;

  @Expose()
  @IsOptional()
  @IsEmail()
  email?: string;
}
