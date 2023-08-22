import { UserService } from './../user/user.service';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { MESSAGE_REPOSITORY } from '../constants';
import { Message } from './message.entity';
import { LoggerService } from 'src/core/logger/logger.service';
import { UploadService } from '../upload/upload.service';
import { LoggerBase } from 'src/core/logger/logger.base';
import { basename } from 'path';

@Injectable()
export class MessageService extends LoggerBase {
  constructor(
    private readonly userService: UserService,
    @Inject(MESSAGE_REPOSITORY) private readonly repo: typeof Message,
    //@Inject(CACHE_MANAGER) private cacheService: Cache,
    protected readonly logger: LoggerService,
    protected readonly s3: UploadService,
  ) {
    super(logger);
  }

  protected getServiceName(): string {
    return this.constructor.name;
  }

  protected getFileName(): string {
    return basename(__filename);
  }

  //TODO: add file and cache
  async create(text: string, file?: string, userId?: string, guildID?: string): Promise<Message> {
    try {
      const user = await this.userService.findOne(userId);
      if (!user) {
        throw new NotFoundException('User not found');
      }

      const message = await this.repo.create({
        userId,
        text,
        guildID,
      });

      this.logInfo('Message created by user:', user.id);
      return message;
    } catch (error) {
      this.logError('Error creating message:', 'POST', error);
      throw error;
    }
  }

  async findOne(id: string, guildId?: string) {
    const message = await this.repo.findOne<Message>({
      where: { id, guildID: guildId },
    });
    if (!message) {
      this.logWarn('Message not found:', 'GET', id);
      throw new NotFoundException('message not found');
    }
    return message;
  }

  async findAll(userID: string, guildID: string) {
    const messages = await this.repo.findAll<Message>({
      where: { userId: userID, guildID: guildID },
    });
    if (!messages || messages.length === 0) {
      this.logWarn('Messages not found:', userID);
      throw new NotFoundException('messages not found');
    }
    return messages;
  }

  async remove(id: string) {
    const message = await this.repo.findByPk<Message>(id);
    if (!message) {
      this.logWarn('Message not found:', id);
      throw new NotFoundException('message not found');
    }

    try {
      await message.destroy();
      //this.logInfo('Message deleted:', message.id); //check here
    } catch (error) {
      this.logError('Error deleting message:', 'DELETE', error);
      throw error;
    }
  }

  async update(id: string, attrs: Partial<Message>) {
    const message = await this.repo.findByPk<Message>(id);
    if (!message) {
      this.logWarn('Message not found:', id);
      throw new NotFoundException('message not found');
    }
    Object.assign(message, attrs);
    try {
      const updatedMessage = await message.save();
      //this.logInfo('Message updated:', updatedMessage.id);
      return updatedMessage;
    } catch (err) {
      this.logError('Error updating message:', 'UPDATE', err);
      throw err;
    }
  }
}
