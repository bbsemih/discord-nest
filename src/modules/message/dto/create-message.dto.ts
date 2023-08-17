import { IsNotEmpty, IsString } from 'class-validator';

export class CreateMessageDto {
  @IsNotEmpty()
  readonly text: string;

  @IsString()
  readonly file: string;

  @IsNotEmpty()
  readonly guildID: string;
}
