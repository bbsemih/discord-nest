import { IsString, IsNotEmpty, IsArray } from 'class-validator';
import { Expose } from 'class-transformer';

export class GuildDTO {
  @IsNotEmpty()
  @Expose()
  readonly id: string;

  @IsNotEmpty()
  @Expose()
  readonly name: string;

  readonly description: string;
  readonly ownerId: string;
  readonly owner: string;
  readonly members: string[];
  readonly memberCount: number;
  readonly icon: string;
}
