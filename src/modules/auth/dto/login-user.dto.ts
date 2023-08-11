import { IsEmail, IsString } from 'class-validator';

export class loginUserDTO {
  @IsEmail()
  readonly email: string;

  @IsString()
  readonly password: string;
}
