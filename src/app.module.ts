import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { DatabaseModule } from './core/database/database.module';
import { GuardModule } from './modules/guard/guard.module';
import { MessageModule } from './modules/message/message.module';
import { ServerModule } from './modules/server/server.module';
import { UserService } from './modules/user/user.service';

@Module({
  imports: [UserModule, AuthModule, DatabaseModule, GuardModule, ServerModule, MessageModule],
  controllers: [AppController],
  providers: [AppService, UserService],
})
export class AppModule {}
