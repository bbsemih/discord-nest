import { IsNotEmpty } from 'class-validator';

export class CreateMessageDto {
  @IsNotEmpty()
  readonly content: string;

  @IsNotEmpty()
  readonly guildID: string;
}
