import { Module } from '@nestjs/common';
import { CronService } from './cron.service';
import { LoggerModule } from 'src/core/logger/logger.module';
import { MessageModule } from '../message/message.module';
import { GuildModule } from '../guild/guild.module';
import { UserModule } from '../user/users.module';

@Module({
  imports: [LoggerModule, MessageModule, GuildModule, UserModule],
  providers: [CronService],
})
export class CronModule {}
