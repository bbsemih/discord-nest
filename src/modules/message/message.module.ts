import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { messageProviders } from './message.providers';
import { UserModule } from '../user/users.module';
import { LoggerModule } from 'src/core/logger/logger.module';
import { S3Module } from '../s3/s3.module';
import { RedisModule } from 'src/core/redis/redis.module';

@Module({
  imports: [UserModule, LoggerModule, S3Module, RedisModule],
  providers: [MessageService, ...messageProviders],
  controllers: [MessageController],
  exports: [MessageService],
})
export class MessageModule {}
