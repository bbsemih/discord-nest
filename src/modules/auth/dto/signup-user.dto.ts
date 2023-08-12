import { IsDate, IsEmail, IsString } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class signupUserDTO {
  @IsString()
  readonly username: string;

  @IsString()
  readonly fullName: string;

  @IsEmail()
  readonly email: string;

  @IsString()
  readonly password: string;

  @IsDate()
  @Type(() => Date) // Use Type decorator along with Transform
  @Transform(({ value }) => new Date(value))
  readonly dateOfBirth: Date;
}
