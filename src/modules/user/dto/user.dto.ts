import { IsNotEmpty, IsEmail, MinLength, IsString, IsDate, IsBoolean } from 'class-validator';
import { Expose } from 'class-transformer';

export class UserDto {
  @IsNotEmpty()
  @Expose()
  readonly id: number;

  @IsNotEmpty()
  @Expose()
  readonly username: string;

  @IsNotEmpty()
  @Expose()
  readonly fullName: string;

  @IsNotEmpty()
  @IsEmail()
  @Expose()
  readonly email: string;

  @IsNotEmpty()
  @MinLength(6)
  @Expose()
  readonly password: string;

  @IsDate()
  @Expose()
  readonly dateOfBirth: Date;

  @IsString()
  @Expose()
  readonly role: string;

  @IsNotEmpty()
  @Expose()
  readonly status: string;

  @IsBoolean()
  @Expose()
  readonly isBot: boolean;
}
