import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { messageProviders } from './message.providers';
import { UserModule } from '../user/users.module';
import { LoggerModule } from 'src/core/logger/logger.module';

@Module({
  imports: [UserModule, LoggerModule],
  providers: [MessageService, ...messageProviders],
  controllers: [MessageController],
  exports: [MessageService],
})
export class MessageModule {}
