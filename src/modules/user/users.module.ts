import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { usersProviders } from './users.providers';
import { LoggerModule } from '../../core/logger/logger.module';
import { UserController } from './user.controller';
import { RedisModule } from 'src/core/redis/redis.module';

@Module({
  imports: [LoggerModule, RedisModule],
  providers: [UserService, ...usersProviders],
  exports: [UserService],
  controllers: [UserController],
})
export class UserModule {}
