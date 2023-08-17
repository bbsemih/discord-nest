import { IsNotEmpty, IsString } from 'class-validator';
import { UserDto } from '../../user/dto/user.dto';

export class MessageDTO {
  @IsNotEmpty()
  @IsString()
  readonly id: string;

  @IsNotEmpty()
  @IsString()
  readonly userId: string;

  @IsNotEmpty()
  readonly user: UserDto;

  @IsNotEmpty()
  @IsString()
  readonly text: string;

  @IsString()
  readonly file: string;

  @IsNotEmpty()
  readonly createdAt: Date;

  @IsNotEmpty()
  readonly updatedAt: Date;

  @IsNotEmpty()
  readonly guildID: string;
}
