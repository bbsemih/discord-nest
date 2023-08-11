import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { usersProviders } from './users.providers';
import { LoggerModule } from 'src/core/logger/logger.module';
import { UserController } from './user.controller';

@Module({
  imports: [LoggerModule ],
  providers: [UserService, ...usersProviders],
  exports: [UserService],
  controllers: [UserController],
})
export class UserModule {}  
