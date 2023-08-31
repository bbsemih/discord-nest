import { UserService } from './../user/user.service';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { MESSAGE_REPOSITORY } from '../constants';
import { Message } from './message.entity';
import { LoggerService } from '../../core/logger/logger.service';
import { S3Service } from '../s3/s3.service';
import { LoggerBase } from '../../core/logger/logger.base';
import { basename } from 'path';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { CreateMessageDto } from './dto/create-message.dto';

@Injectable()
export class MessageService extends LoggerBase {
  constructor(
    private readonly userService: UserService,
    @Inject(MESSAGE_REPOSITORY) private readonly repo: typeof Message,
    @Inject(CACHE_MANAGER) private cacheService: Cache,
    protected readonly logger: LoggerService,
    protected readonly s3: S3Service,
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
  //find the userid from session, token or something
  async create(messageInput: CreateMessageDto): Promise<Message> {
    try {
      const user = await this.userService.findById(messageInput.userId);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      const message = await this.repo.create({
        userId: messageInput.userId,
        text: messageInput.text,
        guildID: messageInput.guildID,
      });

      this.logInfo('Message created by user:', user.id);
      return message;
    } catch (error) {
      this.logError('Error creating message:', error);
      throw error;
    }
  }

  async findOne(id: string, guildId?: string) {
    const cachedMessage = await this.cacheService.get<Message>(id);
    if (cachedMessage) {
      this.logInfo('Message found in cache:', cachedMessage.id);
      return cachedMessage;
    }
    try {
      const message = await this.repo.findOne<Message>({
        where: { id, guildID: guildId },
      });
      if (!message) {
        this.logWarn('Message not found:', id);
        throw new NotFoundException('message not found');
      }
      return message;
    } catch (err) {
      this.logError(`Error finding user: ${err.message}`, err);
      throw err;
    }
  }

  async findAllFromUser(userID: string, guildID: string) {
    const messages = await this.repo.findAll<Message>({
      where: { userId: userID, guildID: guildID },
    });
    if (!messages || messages.length === 0) {
      this.logWarn('Messages not found:', userID);
      throw new NotFoundException('messages not found');
    }
    return messages;
  }

  async findAllFromGuild(guildID: string) {
    const messages = await this.repo.findAll<Message>({
      where: { guildID: guildID },
    });
    if (!messages || messages.length === 0) {
      this.logWarn('Messages not found:', guildID);
      throw new NotFoundException('messages not found');
    }
    return messages;
  };

  async remove(id: string) {
    const message = await this.repo.findOne<Message>({ where: { id } });
    if (!message) {
      this.logWarn('Message not found:', id);
      throw new NotFoundException('message not found');
    }

    try {
      await message.destroy();
      this.logInfo('Message deleted:', message.id);
    } catch (error) {
      this.logError('Error deleting message:', error);
      throw error;
    }
  }

  async update(id: string, attrs: Partial<Message>) {
    const message = await this.repo.findOne<Message>({ where: { id } });
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
      this.logError('Error updating message:', err);
      throw err;
    }
  }
}
