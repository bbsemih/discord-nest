import { IsDate, IsEmail, IsString } from 'class-validator';

export class signupUserDTO {
  @IsString()
  readonly username: string;

  @IsString()
  readonly displayName: string;

  @IsEmail()
  readonly email: string;

  @IsString()
  readonly password: string;

  @IsDate()
  readonly dateOfBirth: Date;
}
