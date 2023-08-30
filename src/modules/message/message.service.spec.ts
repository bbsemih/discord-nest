import { Test, TestingModule } from '@nestjs/testing';
import { MessageService } from './message.service';
import { MESSAGE_REPOSITORY, USER_REPOSITORY } from '../constants';
import { messageProviders } from './message.providers';
import { UserService } from '../user/user.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { LoggerService } from '../../core/logger/logger.service';
import { S3Service } from '../s3/s3.service';
import { instance, mock } from 'ts-mockito';
import { Message } from './message.entity';
import { Cache } from 'cache-manager';
import { MessageDTO } from './dto/message.dto';
import { NotFoundException } from '@nestjs/common';
import { User } from '../user/user.entity';

describe('MessageService', () => {
  let service: MessageService;
  let mockUserService: Partial<UserService>;
  let cacheService: Cache;
  let mockS3Service: S3Service;
  let mockLoggerService: LoggerService;

  const mockMessageRepo = {
    create: jest.fn(),
    findOne: jest.fn(),
    findAll: jest.fn(),
    remove: jest.fn(),
    update: jest.fn(),
  };

  const mockUserRepo = {
    create: jest.fn(),
    findOne: jest.fn(),
    findAll: jest.fn(),
    remove: jest.fn(),
    update: jest.fn(),
  };

  const mockCacheManager = {
    get: jest.fn(),
    set: jest.fn(),
  };

  beforeEach(async () => {
    mockLoggerService = mock(LoggerService);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MessageService,
        ...messageProviders,
        {
          provide: MESSAGE_REPOSITORY,
          useValue: mockMessageRepo,
        },
        {
          provide: USER_REPOSITORY,
          useValue: mockUserRepo,
        },
        {
          provide: UserService,
          useValue: mockUserService,
        },
        {
          provide: LoggerService,
          useValue: instance(mockLoggerService),
        },
        {
          provide: S3Service,
          useValue: mockS3Service,
        },
        {
          provide: CACHE_MANAGER,
          useValue: mockCacheManager,
        },
      ],
    }).compile();

    service = module.get<MessageService>(MessageService);
    cacheService = module.get<Cache>(CACHE_MANAGER);
  });

  it('create an instance of MessageService', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('create a new message', async () => {
    });

    it('throw an error when creating a message fails in service', async () => {
    });
  });

  describe('findOne', () => {
    it('find a message with given id from database', async () => {
      const mockId = '1';
      const mockMessage = jest.mocked<Message>;

      mockCacheManager.get.mockResolvedValue(null); // should be no cache hit
      mockMessageRepo.findOne.mockResolvedValue(mockMessage);

      const res = await service.findOne(mockId);
      expect(res).toBe(mockMessage);
      expect(cacheService.get).toHaveBeenCalledWith(mockId);
      expect(mockMessageRepo.findOne).toHaveBeenCalledWith({
        where: { id: mockId },
      });
    });

    it('find a message with given id from cache', async () => {
      const mockId = '1';
      const mockMessage = jest.mocked<Message>;

      mockCacheManager.get.mockResolvedValue(mockMessage);
      const result = await service.findOne(mockId);

      expect(result).toBe(mockMessage);
      expect(cacheService.get).toHaveBeenCalledWith(mockId);
      expect(mockCacheManager.get).toHaveBeenCalledWith(mockId);
      expect(mockMessageRepo.findOne).not.toHaveBeenCalledWith(mockId);
    });
  });

  describe('findAll', () => {
    it('find all messages from a user in guild', async () => {
      const mockUserId = '1';
      const mockGuildId = '1';
      const mockMessage = jest.mocked<Message>;
      const mockMessages = [mockMessage];

      mockMessageRepo.findAll.mockResolvedValue(mockMessages);

      const result = await service.findAllFromUser(mockUserId, mockGuildId);

      expect(result).toBe(mockMessages);
      expect(mockMessageRepo.findAll).toHaveBeenCalledWith({
        where: { userId: mockUserId, guildID: mockGuildId },
      });
    });

    it('find all messages in a guild', async () => {
      const mockGuildId = '1';
      const mockMessage = jest.mocked<Message>;
      const mockMessages = [mockMessage];

      mockMessageRepo.findAll.mockResolvedValue(mockMessages);

      const result = await service.findAllFromGuild(mockGuildId);

      expect(result).toBe(mockMessages);
      expect(mockMessageRepo.findAll).toHaveBeenCalledWith({
        where: { guildID: mockGuildId },
      });
    });
  });

  describe('remove', () => {
    it('delete the message with given id', async () => {
      const mockId = '1';
      const mockMessage = {
        id: mockId,
        userId: '2',
        email: 'semi@gmail.com',
        destroy: jest.fn(),
        createdAt: new Date(),
      };
      mockMessageRepo.findOne.mockResolvedValue(mockMessage);
      mockMessage.destroy = jest.fn().mockResolvedValue(true);

      const result = await service.remove(mockId);

      expect(mockMessage.destroy).toHaveBeenCalled();
      expect(result).toBeUndefined();
      expect(mockMessageRepo.findOne).toHaveBeenCalledWith({ where: { id: mockId } });
    });

    it('throw an error when deleting a non-existent message', async () => {
      const mockId = '1283';
      mockMessageRepo.findOne.mockResolvedValue(null);

      await expect(service.remove(mockId)).rejects.toThrowError(NotFoundException);
      expect(mockMessageRepo.findOne).toHaveBeenCalledWith({ where: { id: mockId } });
    });
  });

  describe('update', () => {
    it('update the message with given id and attributes', async () => {
      const messageId = '123';
      const updateAttr = { text:'semih2023', s3Url: 'semihb.com/image' };
      const mockMessage = {
        id: messageId,
        text: 'semih2023',
        guildID: '1',
        s3Url: 'https://aws.com',
        save: jest.fn(),
      };

      mockMessageRepo.findOne.mockResolvedValue(mockMessage);
      mockMessage.save = jest.fn().mockResolvedValue(mockMessage);

      const res = await service.update(messageId, updateAttr);

      expect(res).toBe(mockMessage);
      expect(mockMessageRepo.findOne).toHaveBeenCalledWith({ where: { id: messageId } });
      expect(mockMessage.save).toHaveBeenCalled();
      expect(mockMessage.s3Url).toBe(updateAttr.s3Url);
      expect(mockMessage.text).toBe(updateAttr.text);
    });

    it('throw an error when updating a non-existent user', async () => {
      const messageId = '404';
      const updatedAttributes = { text: 'UpdatedTextHere' };
      mockMessageRepo.findOne.mockResolvedValue(null);

      await expect(service.update(messageId, updatedAttributes)).rejects.toThrowError(NotFoundException);
      expect(mockMessageRepo.findOne).toHaveBeenCalledWith({ where: { id: messageId } });
    });
  });
});
