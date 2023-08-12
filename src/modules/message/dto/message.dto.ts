import { IsNotEmpty } from 'class-validator';
import { UserDto } from '../../user/dto/user.dto';

export class MessageDTO {
  @IsNotEmpty()
  readonly id: string;

  @IsNotEmpty()
  readonly userId: string;

  @IsNotEmpty()
  readonly user: UserDto;

  @IsNotEmpty()
  readonly content: string;

  @IsNotEmpty()
  readonly createdAt: Date;

  @IsNotEmpty()
  readonly updatedAt: Date;

  @IsNotEmpty()
  readonly guildID: string;
}
