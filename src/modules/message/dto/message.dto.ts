import { IsNotEmpty } from "class-validator";
import { UserDto } from "../../user/dto/user.dto";

export class MessageDTO {
  @IsNotEmpty()
  readonly id: number;

  @IsNotEmpty()
  readonly userId: number;

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
