import { Inject } from '@nestjs/common';
import { LogLevelEnum, LogTypeEnum, LoggerF } from './logger.interface';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Logger } from '@nestjs/common';

export class LoggerService implements LoggerF {
  constructor(@Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger) {}

  info(msg: string, className: string, level: LogLevelEnum, filename: string, type: LogTypeEnum): void {
    this.logger.log(msg, {
      type: type,
      filename: filename,
      level: level,
      class: className,
    });
  }

  verbose(msg: string, className: string, level: LogLevelEnum.VERBOSE, type: LogTypeEnum): void {
    this.logger.log(msg, {
      type: type,
      level: level,
      class: className,
    });
  }

  warn(msg: string, className: string, level: LogLevelEnum.WARN, filename: string, type: LogTypeEnum.SERVICE): void {
    this.logger.log(msg, {
      type: type,
      level: level,
      class: className,
      filename: filename,
    });
  }

  debug(msg: string, className: string, level: LogLevelEnum.DEBUG, type: LogTypeEnum.SERVICE): void {
    this.logger.log(msg, {
      type: type,
      level: level,
      class: className,
    });
  }

  error(msg: string, className: string, level: LogLevelEnum.ERROR, filename: string, type: LogTypeEnum.SERVICE): void {
    this.logger.log(msg, {
      type: type,
      level: level,
      class: className,
      filename: filename,
    });
  }
  http(method: string, url: string, code: number, contentLength: string, userAgent: string, ip: string, level: LogLevelEnum, type: LogTypeEnum.HTTP): void {
    this.logger.log('', {
      type: type,
      level: level,
      method: method,
      url: url,
      code: code,
      contentLength: contentLength,
      userAgent: userAgent,
      ip: ip,
    });
  }

  httpError(msg: string, method: string, url: string, code: number, level: LogLevelEnum, type: LogTypeEnum): void {
    this.logger.log(msg, {
      type: type,
      level: level,
      method: method,
      url: url,
      code: code,
    });
  }
}
