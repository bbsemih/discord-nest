import { MiddlewareConsumer, Module } from '@nestjs/common';
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

// eslint-disable-next-line
const cookieSession = require('cookie-session');

@Module({
  imports: [ConfigModule.forRoot({isGlobal:true}),UserModule, AuthModule, DatabaseModule, GuardModule, ServerModule, MessageModule],
  controllers: [AppController],
  providers: [AppService, UserService, LoggerService],
})
export class AppModule {
  constructor(private configService: ConfigService) {}

  configure(consumer: MiddlewareConsumer) {
     consumer
       .apply(
        cookieSession({
          keys: [this.configService.get('COOKIE_KEY')],
        }),
       )
       .forRoutes('*');
  }
};
