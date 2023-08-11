import { IsOptional, IsEmail, MinLength, IsString, IsDate, IsBoolean } from 'class-validator';
import { Expose } from 'class-transformer';

export class UpdateUserDto {
  @IsOptional()
  @Expose()
  readonly username?: string;

  @IsOptional()
  @Expose()
  readonly displayName?: string;

  @IsOptional()
  @IsEmail()
  @Expose()
  readonly email?: string;

  @IsOptional()
  @MinLength(6)
  @Expose()
  readonly password?: string;

  @IsOptional()
  @IsDate()
  @Expose()
  readonly dateOfBirth?: Date;

  @IsOptional()
  @Expose()
  readonly status?: string;
}
