import { Injectable } from '@nestjs/common';
import { LoggerService } from '../../core/logger/logger.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import { LoggerBase } from 'src/core/logger/logger.base';
import { basename } from 'path';
import { MessageService } from '../message/message.service';
import { GuildService } from '../guild/guild.service';

@Injectable()
export class CronService extends LoggerBase {
  constructor(protected readonly logger: LoggerService, private readonly messageService: MessageService, private readonly guildService: GuildService) {
    super(logger);
  }

  protected getServiceName(): string {
    return this.constructor.name;
  }

  protected getFileName(): string {
    return basename(__filename);
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT, {
    name: 'messageStats',
    timeZone: 'Europe/Istanbul',
  })
  async gatherMessageStats(): Promise<void> {
    try {
      const totalMessages = await this.messageService.getTotalMessageCount();
      const getBusiestHours = await this.messageService.getBusiestHours();
      const uniqueUsers = await this.messageService.getUniqueUserCount();

      this.logInfo('Total messages:', totalMessages);
      this.logInfo('Unique users:', uniqueUsers);
      this.logInfo('Busiest hours:', getBusiestHours);
    } catch (error) {
      this.logError('Error gathering message stats:', error);
      throw error;
    }
  }

  async gatherGuildStats(): Promise<void> {
    try {
      const totalGuilds = await this.guildService.getTotalGuildCount();
      const mostActiveGuilds = await this.guildService.getMostActiveGuilds();

      this.logInfo('Total guilds:', totalGuilds);
      this.logInfo('Most active guilds:', mostActiveGuilds as any);
    } catch (error) {
      this.logError('Error gathering guild stats:', error);
      throw error;
    }
  }

  //todo: add cron job for taking snapshots
  async takeSnapshot(): Promise<void> {}
}
