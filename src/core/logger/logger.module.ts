import { Module } from '@nestjs/common';
import { LoggerService } from './logger.service';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';

@Module({
  imports: [
    WinstonModule.forRootAsync({
      useFactory: () => ({
        transports: [
          new winston.transports.Console({
            format: winston.format.combine(
              winston.format.timestamp(),
              winston.format.colorize(),
              winston.format.simple(),
              winston.format.printf(msg => {
                const { level, timestamp, message, context } = msg;
                const { class: className, filename, type } = context;
                return `[${level}] ${timestamp} | ${message} | class: ${className} | filename: ${filename} | type: ${type}`;
              }),
            ),
          }),
        ],
      }),
    }),
  ],
  exports: [LoggerService],
  providers: [LoggerService],
})
export class LoggerModule {}
