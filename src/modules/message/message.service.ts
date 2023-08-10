import { UserService } from './../user/user.service';
import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { MESSAGE_REPOSITORY } from '../contants';
import { Message } from './message.entity';

@Injectable()
export class MessageService {
  constructor(private readonly userService: UserService, 
    @Inject(MESSAGE_REPOSITORY) private readonly messageRepository: typeof Message,
    @Inject(CACHE_MANAGER) private cacheService: Cache) 
    {}

    async create(content: string, userId: number) {
      try {
        const newMessage = await this.messageRepository.create({ content, userId });
        return newMessage;
      } catch (err) {
        throw err;
      }
    }

    async findAll() {
    }

    //add redis cache
    async findMessageById(id: number) {};


    async update(id: number, content: string) {};


    async delete(id: number) {};


}