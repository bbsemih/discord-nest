import { Module } from '@nestjs/common';
import { GuildService } from './guild.service';
import { GuildController } from './guild.controller';
import { LoggerModule } from 'src/core/logger/logger.module';
import { UserModule } from '../user/users.module';
import { guildProviders } from './guild.providers';

@Module({
  imports: [LoggerModule, UserModule],
  controllers: [GuildController],
  providers: [GuildService, ...guildProviders],
  exports: [GuildService],
})
export class GuildModule {}