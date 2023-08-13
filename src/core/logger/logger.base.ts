import { LoggerService } from './logger.service';
import { LogLevelEnum, LogTypeEnum } from './logger.interface';

export abstract class LoggerBase {
  constructor(protected readonly logger: LoggerService) {}

  protected logInfo(message: string, id?: string | number) {
    this.logger.info(`${message} ${id}`, this.getServiceName(), LogLevelEnum.INFO, this.getFileName(), LogTypeEnum.SERVICE);
  }

  protected logWarn(message: string, id?: string | number) {
    this.logger.warn(`${message} ${id}`, this.getServiceName(), LogLevelEnum.WARN, this.getFileName(), LogTypeEnum.SERVICE);
  }

  protected logError(message: string, error: any) {
    this.logger.error(`${message} ${error.message}`, this.getServiceName(), LogLevelEnum.ERROR, this.getFileName(), LogTypeEnum.SERVICE);
  }

  protected abstract getServiceName(): string;
  protected abstract getFileName(): string;
}
