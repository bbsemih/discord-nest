import { IsString, IsNotEmpty, IsArray, IsNumber, IsOptional, Min, Max } from 'class-validator';
import { Expose } from 'class-transformer';
import { UserDto } from '../../user/dto/user.dto';

export class GuildDTO {
  @IsNotEmpty()
  @Expose()
  readonly id: string;

  @IsNotEmpty()
  @Expose()
  readonly name: string;

  @Expose()
  readonly description: string;

  @IsNotEmpty()
  @Expose()
  readonly ownerId: string;

  @Expose()
  readonly owner: UserDto;

  @IsArray()
  @Expose()
  readonly members: UserDto[];

  @IsNumber()
  @Expose()
  readonly memberCount: number;

  @Expose()
  readonly icon: string;

  @IsArray()
  @Expose()
  readonly roles: string[];

  @Expose()
  readonly region: string;

  @Expose()
  readonly nsfwLevel: number;
}
