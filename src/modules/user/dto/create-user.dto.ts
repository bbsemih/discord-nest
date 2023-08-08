export class CreateUserDTO {
  readonly username: string;
  readonly displayName: string;
  readonly email: string;
  readonly password: string;
  readonly dateOfBirth: Date;
}
