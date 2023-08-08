export class GuildDTO {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly ownerId: string;
  readonly owner: string;
  readonly members: string[];
  readonly memberCount: number;
  readonly icon: string;
}
