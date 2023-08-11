import { GUILD_REPOSITORY } from '../constants';
import { Guild } from './guild.entity';

export const guildProviders = [
  {
    provide: GUILD_REPOSITORY,
    useValue: Guild,
  },
];
