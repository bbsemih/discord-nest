import { MiddlewareConsumer, Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { UserModule } from './modules/user/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { DatabaseModule } from './core/database/database.module';
import { MessageModule } from './modules/message/message.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GuildModule } from './modules/guild/guild.module';
import { APP_PIPE } from '@nestjs/core';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';
import { LoggerModule } from './core/logger/logger.module';
import { JwtModule } from '@nestjs/jwt';
import { UploadModule } from './modules/upload/upload.module';
import * as dotenv from 'dotenv';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';

dotenv.config();
// eslint-disable-next-line
const cookieSession = require('cookie-session');

@Module({
  imports: [
    //TODO: implement prometheus
    PrometheusModule.register(),
    ThrottlerModule.forRoot({
      ttl: parseInt(process.env.RATE_TTL, 10),
      limit: parseInt(process.env.RATE_LIMIT, 10),
    }),
    JwtModule.register({
      secret: process.env.TOKEN_SECRET,
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    CacheModule.register({
      isGlobal: true,
      store: typeof redisStore,
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
      username: process.env.REDIS_USERNAME,
      password: process.env.REDIS_PASSWORD,
    }),
    GuildModule,
    UserModule,
    AuthModule,
    DatabaseModule,
    MessageModule,
    LoggerModule,
    UploadModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
      }),
    },
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
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
}
