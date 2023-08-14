import { MiddlewareConsumer, Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
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
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { JwtModule } from '@nestjs/jwt';
import * as dotenv from 'dotenv';
dotenv.config();

// eslint-disable-next-line
const cookieSession = require('cookie-session');

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.TOKEN_SECRET,
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    WinstonModule.forRoot({
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.colorize(),
            winston.format.simple(),
            winston.format.printf(msg => {
              return `[${msg.level}] ${msg.timestamp} | ${msg.message} | class: ${msg.context.class} | filename: ${msg.context.filename} | type: ${msg.context.type}`;
            }),
          ),
        }),
      ],
    }),
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
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
      }),
    },
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
