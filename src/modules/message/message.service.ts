import { UserService } from './../user/user.service';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { MESSAGE_REPOSITORY } from '../constants';
import { Message } from './message.entity';
import { Cache } from 'cache-manager';
import { LoggerService } from 'src/core/logger/logger.service';
import { LogLevelEnum, LogTypeEnum } from 'src/core/logger/logger.interface';

@Injectable()
export class MessageService {
  constructor(
    private readonly userService: UserService,
    @Inject(MESSAGE_REPOSITORY) private readonly repo: typeof Message,
    @Inject(CACHE_MANAGER) private cacheService: Cache,
    private readonly logger: LoggerService,
  ) {}

  private logInfo(message: string, id: number) {
    this.logger.info(`${message} ${id}`, 'MessageService', LogLevelEnum.INFO, 'message.service.ts', LogTypeEnum.SERVICE);
  }
  
  private logWarn(message: string, id: number) {
    this.logger.warn(`${message} ${id}`, 'MessageService', LogLevelEnum.WARN, 'message.service.ts', LogTypeEnum.SERVICE);
  }

  private logError(message: string, error: any) {
    this.logger.error(`${message} ${error.message}`, 'MessageService', LogLevelEnum.ERROR,'message.service.ts', LogTypeEnum.SERVICE);
  }

  async create(userId: number, content: string, guildID: string): Promise<Message> {
    try {
      const user = await this.userService.findOne(userId);
      if (!user) {
        throw new NotFoundException('User not found');
      }

      const message = await this.repo.create({
        userId,
        content,
        guildID,
      });

      this.logInfo('Message created by user:', user.id);
      return message;
    } catch (error) {
      this.logError('Error creating message:', error.message);//or only error???
      throw error;
    }
  }

  async findOne(id: number, guildId: string) {
    const message = await this.repo.findOne<Message>({
      where: { id, guildID: guildId },
    });
    if (!message) {
      this.logWarn('Message not found:', id);
      throw new NotFoundException('message not found');
    }
    return message;
  }

  async findAll(userID: number, guildID: string) {
    const messages = await this.repo.findAll<Message>({
      where: { userId: userID, guildID: guildID },
    });
    if (!messages) {
      this.logWarn('Messages not found:', userID);
      throw new NotFoundException('messages not found');
    }
    return messages;
  }

  async remove(id: number) {
    const message = await this.repo.findByPk<Message>(id);
    if (!message) {
      this.logWarn('Message not found:', id);
      throw new NotFoundException('user not found');
    }

    try {
      await this.repo.destroy({ where: { id } });
      this.logError('Message deleted:', message.id);
    } catch (error) {
      this.logError('Error deleting message:', error.message);
      throw error;
    }
  }

  async update(id: number, attrs: Partial<Message>) {
    const message = await this.repo.findByPk<Message>(id);
    if (!message) {
      this.logWarn('Message not found:', id);
      throw new NotFoundException('message not found');
    }
    Object.assign(message, attrs);
    try {
      const updatedMessage = await message.save();
      this.logInfo('Message updated:', updatedMessage.id);
      return updatedMessage;
    } catch (err) {
      this.logError('Error updating message:', err.message);
      throw err;
    }
  }
}
