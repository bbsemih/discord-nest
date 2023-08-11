import { IsString, IsNotEmpty } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateMessageDto {
  @IsNotEmpty()
  @IsString()
  readonly content: string;
}
