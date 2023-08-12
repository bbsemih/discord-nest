import { IsString, IsNotEmpty, IsArray, IsOptional } from 'class-validator';

export class CreateGuildDTO {
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsOptional()
  @IsString()
  readonly description?: string;

  @IsNotEmpty()
  @IsString()
  readonly ownerId: string;

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
