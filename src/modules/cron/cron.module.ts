import { Module } from '@nestjs/common';
import { CronService } from './cron.service';
import { LoggerModule } from 'src/core/logger/logger.module';
import { MessageModule } from '../message/message.module';

@Module({
  imports: [LoggerModule, MessageModule],
  providers: [CronService],
})
export class CronModule {}
