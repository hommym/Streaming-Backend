import { Expose } from "class-transformer";
import { IsInt, IsString, Min, MinLength } from "class-validator";

export class ChangePasswordDto {
  @Expose()
  @IsString()
  @MinLength(6)
  oldPassword: string;

  @Expose()
  @IsString()
  @MinLength(6)
  newPassword: string;
}
