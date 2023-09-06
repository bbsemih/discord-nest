import { UserService } from './../user/user.service';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { MESSAGE_REPOSITORY } from '../constants';
import { Message } from './message.entity';
import { LoggerService } from '../../core/logger/logger.service';
import { S3Service } from '../s3/s3.service';
import { LoggerBase } from '../../core/logger/logger.base';
import { basename } from 'path';
import { CreateMessageDto } from './dto/create-message.dto';
import { RedisService } from 'src/core/redis/redis.service';

@Injectable()
export class MessageService extends LoggerBase {
  constructor(
    private readonly userService: UserService,
    @Inject(MESSAGE_REPOSITORY) private readonly repo: typeof Message,
    protected readonly logger: LoggerService,
    protected readonly s3: S3Service,
    private readonly redis: RedisService,
  ) {
    super(logger);
  }

  protected getServiceName(): string {
    return this.constructor.name;
  }

  protected getFileName(): string {
    return basename(__filename);
  }

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
      console.log(message);

      this.logInfo('Message created by user:', user.id);
      return message;
    } catch (error) {
      this.logError('Error creating message:', error);
      throw error;
    }
  }

  async findOne(id: string, guildId?: string) {
    const cachedMessage = await this.redis.get<Message>(id);
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
      this.redis.set(id, message, { ttl: 100000 });
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
  }

  async remove(id: string) {
    try {
      const cachedMessage = await this.redis.get<Message>(id);
      if (cachedMessage) {
        await this.redis.del(id);
      }
      const message = await this.repo.findOne<Message>({ where: { id } });
      if (message) {
        await message.destroy();
        this.logInfo('Message deleted:', id);
        return;
      } else {
        this.logWarn('Message not found:', id);
        throw new NotFoundException('message not found');
      }
    } catch (err) {
      this.logError('Error deleting message:', err);
      throw err;
    }
  }

  async update(id: string, attrs: Partial<Message>) {
    let message;
    const cachedMessage = await this.redis.get<Message>(id);
    if (cachedMessage) {
      message = cachedMessage;
      await this.redis.del(id);
    } else {
      message = await this.repo.findOne<Message>({ where: { id } });
    }

    if (!message) {
      this.logWarn('Message not found:', id);
      throw new NotFoundException('message not found');
    }
    Object.assign(message, attrs);
    await this.redis.set(id, message, { ttl: 100000 });
    try {
      const updatedMessage = await message.save();
      this.logInfo('Message updated:', updatedMessage.id);
      return updatedMessage;
    } catch (err) {
      this.logError('Error updating message:', err);
      throw err;
    }
  }

  async getTotalMessageCount(): Promise<number> {
    try {
      const totalMessages = await this.repo.count();
      return totalMessages;
    } catch (error) {
      this.logError('Error getting total message count:', error);
      throw error;
    }
  }

  async getUniqueUserCount(): Promise<number> {
    try {
      const uniqueUsers = await this.repo.count({
        col: 'userId',
        distinct: true,
      });
      return uniqueUsers;
    } catch (error) {
      this.logError('Error getting unique user count:', error);
      throw error;
    }
  }

  //should select the busiest hour by taking the created at and slicing it to the hour
  async getBusiestHours(): Promise<number> {
    try {
      const busiestHours = await this.repo.count({
        col: 'createdAt',
        distinct: true,
      });
      return busiestHours;
    } catch (error) {
      this.logError('Error getting busiest hours:', error);
      throw error;
    }
  }
}
