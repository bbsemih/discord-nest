import { Module } from '@nestjs/common';
import { GuildService } from './guild.service';
import { GuildController } from './guild.controller';
import { LoggerModule } from 'src/core/logger/logger.module';
import { UserModule } from '../user/users.module';
import { guildProviders } from './guild.providers';
import { RedisModule } from 'src/core/redis/redis.module';

@Module({
  imports: [LoggerModule, UserModule, RedisModule],
  providers: [GuildService, ...guildProviders],
  exports: [GuildService],
  controllers: [GuildController],
})
export class GuildModule {}
