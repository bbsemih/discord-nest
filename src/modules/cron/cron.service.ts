import { Injectable } from '@nestjs/common';
import { LoggerService } from '../../core/logger/logger.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import { LoggerBase } from 'src/core/logger/logger.base';
import { basename } from 'path';
import { MessageService } from '../message/message.service';
import { GuildService } from '../guild/guild.service';
import { UserService } from '../user/user.service';
import { S3Service } from '../s3/s3.service';
import { RedisService } from 'src/core/redis/redis.service';

@Injectable()
export class CronService extends LoggerBase {
  constructor(
    protected readonly logger: LoggerService,
    private readonly messageService: MessageService,
    private readonly userService: UserService,
    private readonly guildService: GuildService,
    private readonly s3Service: S3Service,
    private readonly redisService: RedisService,
  ) {
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

      const key = 'messageStats';
      const currentDate = new Date();
      const logEntry = {
        date: currentDate.toISOString(),
        totalMessages,
        uniqueUsers,
        busiestHours: getBusiestHours,
      };

      await this.redisService.hset(key, currentDate.toISOString(), JSON.stringify(logEntry));

      this.logInfo('Total messages:', totalMessages);
      this.logInfo('Unique users:', uniqueUsers);
      this.logInfo('Busiest hours:', getBusiestHours);
    } catch (error) {
      this.logError('Error gathering message stats:', error);
      throw error;
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT, {
    name: 'guildStats',
    timeZone: 'Europe/Istanbul',
  })
  async gatherGuildStats(): Promise<void> {
    try {
      const totalGuilds = await this.guildService.getTotalGuildCount();
      const mostActiveGuilds = await this.guildService.getMostActiveGuilds();

      const key = 'guildStats';
      const currentDate = new Date();
      const logEntry = {
        date: currentDate.toISOString(),
        totalGuilds,
        mostActiveGuilds,
      };
      await this.redisService.hset(key, currentDate.toISOString(), JSON.stringify(logEntry));

      this.logInfo('Total guilds:', totalGuilds);
      this.logInfo('Most active guilds:', mostActiveGuilds as any);
    } catch (error) {
      this.logError('Error gathering guild stats:', error);
      throw error;
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT, {
    name: 'userStats',
    timeZone: 'Europe/Istanbul',
  })
  //TODO: last login detatils etc,
  async gatherUserStats(): Promise<void> {
    try {
      const totalUsers = await this.userService.getTotalUserCount();

      await this.redisService.hset('totalUsers', new Date().toISOString(), JSON.stringify(totalUsers));

      this.logInfo('Total users:', totalUsers);
    } catch (error) {
      this.logError('Error gathering user stats:', error);
      throw error;
    }
  }

  //delete logs. TODO: first store them in elastic search
  @Cron(CronExpression.EVERY_WEEKEND, {
    name: 'deleteLogs',
    timeZone: 'Europe/Istanbul',
  })
  async deleteLogs(): Promise<void> {}

  @Cron(CronExpression.EVERY_WEEKEND, {
    name: 'deleteTempS3Files',
    timeZone: 'Europe/Istanbul',
  })
  async deleteTempS3(): Promise<void> {
    try {
      await this.s3Service.deleteAllTemp();
    } catch (error) {
      this.logError('Error deleting temp s3 files:', error);
      throw error;
    }
  }
}
