export enum LogTypeEnum {
  HTTP = 'http',
  HTTPERROR = 'httperror',
  SERVICE = 'service',
}

export enum LogLevelEnum {
  INFO = 'info',
  VERBOSE = 'verbose',
  DEBUG = 'debug',
  WARN = 'warn',
  ERROR = 'error',
}

export interface LoggerF {
  info(msg: string, className: string, level: LogLevelEnum, filename: string, type: LogTypeEnum.SERVICE): void;
  error(msg: string, className: string, level: LogLevelEnum.ERROR, filename: string, type: LogTypeEnum.SERVICE): void;
  verbose(msg: string, className: string, level: LogLevelEnum.VERBOSE, type: LogTypeEnum.SERVICE): void;
  debug(msg: string, className: string, level: LogLevelEnum.DEBUG, type: LogTypeEnum.SERVICE): void;
  warn(msg: string, className: string, level: LogLevelEnum, filename: string, type: LogTypeEnum.SERVICE): void;
  http(method: string, url: string, code: number, contentLength: string, userAgent: string, ip: string, level: LogLevelEnum, type: LogTypeEnum.HTTP): void;
  httpError(msg: string, method: string, url: string, code: number, level: LogLevelEnum, type: LogTypeEnum.HTTPERROR): void;
}
