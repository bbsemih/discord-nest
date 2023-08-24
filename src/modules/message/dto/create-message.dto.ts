import { IsNotEmpty, IsString } from 'class-validator';

export class CreateMessageDto {
  @IsNotEmpty()
  readonly text: string;

  @IsString()
  readonly s3Url: string;

  @IsNotEmpty()
  readonly guildID: string;
}
