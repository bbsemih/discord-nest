import { IsNotEmpty, IsEmail, MinLength, IsString } from 'class-validator';
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
  readonly displayName: string;

  @IsNotEmpty()
  @IsEmail()
  @Expose()
  readonly email: string;

  @IsNotEmpty()
  @MinLength(6)
  @Expose()
  readonly password: string;

  @IsString()
  readonly role: string;
  readonly isBot: boolean;
  readonly dateOfBirth: Date;
  readonly status: string;
}
