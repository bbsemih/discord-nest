import { Module } from '@nestjs/common';
import { CronService } from './cron.service';
import { LoggerModule } from 'src/core/logger/logger.module';
import { MessageModule } from '../message/message.module';
import { GuildModule } from '../guild/guild.module';
import { UserModule } from '../user/users.module';
import { S3Module } from '../s3/s3.module';

@Module({
  imports: [LoggerModule, MessageModule, GuildModule, UserModule, S3Module],
  providers: [CronService],
})
export class CronModule {}
