import { IsString, IsNotEmpty, IsArray, IsNumber, IsOptional } from 'class-validator';

export class CreateGuildDTO {
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsOptional()
  @IsString()
  readonly description?: string;

  @IsNotEmpty()
  @IsString()
  readonly ownerId: number;

  @IsNotEmpty()
  @IsString()
  readonly icon?: string;

  @IsArray()
  @IsString({ each: true })
  readonly roles: string[];

  @IsNotEmpty()
  @IsString()
  readonly region: string;
}
