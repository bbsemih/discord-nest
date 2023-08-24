import { IsString, IsNotEmpty } from 'class-validator';

export class UpdateMessageDto {
  @IsNotEmpty()
  @IsString()
  readonly text: string;

  @IsString()
  readonly s3Url: string;
}
