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
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerService } from './core/logger/logger.service';
import { LoggerController } from './core/logger/logger.controller';

@Module({
  imports: [ConfigModule.forRoot({isGlobal:true}),UserModule, AuthModule, DatabaseModule, GuardModule, ServerModule, MessageModule],
  controllers: [AppController, LoggerController],
  providers: [AppService, UserService, LoggerService],
})
export class AppModule {
  constructor(private configService: ConfigService) {}
  //TODO: add cookie key for sessions
}
