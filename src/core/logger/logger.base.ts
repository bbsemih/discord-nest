import { LoggerService } from './logger.service';
import { LogLevelEnum, LogTypeEnum } from './logger.interface';

export abstract class LoggerBase {
  constructor(protected readonly logger: LoggerService) {}

  protected logInfo(message: string, methodName: string, id?: string | number) {
    this.logger.info(`${message} ${id}`, this.getServiceName(), methodName, LogLevelEnum.INFO, this.getFileName(), LogTypeEnum.SERVICE);
  }

  protected logWarn(message: string, methodName: string, id?: string | number) {
    this.logger.warn(`${message} ${id}`, this.getServiceName(), methodName, LogLevelEnum.WARN, this.getFileName(), LogTypeEnum.SERVICE);
  }

  protected logError(message: string, methodName: string, error: any) {
    this.logger.error(`${message} ${error.message}`, this.getServiceName(), methodName, LogLevelEnum.ERROR, this.getFileName(), LogTypeEnum.SERVICE);
  }

  protected abstract getServiceName(): string;
  protected abstract getFileName(): string;
}
