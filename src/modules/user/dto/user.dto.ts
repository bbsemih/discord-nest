import { IsNotEmpty, IsEmail, MinLength } from "class-validator";

export class UserDto {
  readonly id: number;

  @IsNotEmpty()
  readonly username: string;

  @IsNotEmpty()
  readonly displayName: string;

  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  @MinLength(6)
  readonly password: string;

  
  readonly role: string;
  readonly isBot: boolean;
  readonly dateOfBirth: Date;
  readonly status: string;
}
