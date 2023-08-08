export class UserDto {
  readonly id: number;
  readonly username: string;
  readonly displayName: string;
  readonly email: string;
  readonly password: string;
  readonly role: string;
  readonly isBot: boolean;
  readonly dateOfBirth: Date;
  readonly status: string;
}
