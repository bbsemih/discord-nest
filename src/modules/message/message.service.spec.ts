import { Test, TestingModule } from '@nestjs/testing';
import { MessageService } from './message.service';
import { MESSAGE_REPOSITORY, USER_REPOSITORY } from '../constants';
import { messageProviders } from './message.providers';
import { UserService } from '../user/user.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { LoggerService } from '../../core/logger/logger.service';
import { UploadService } from '../upload/upload.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { instance, mock } from 'ts-mockito';
import { Message } from './message.entity';
import { Cache } from 'cache-manager';

describe('MessageService', () => {
  let service: MessageService;
  let mockUserService: Partial<UserService>;
  let cacheService: Cache;
  let mockUploadService: UploadService;
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
          useValue: instance(mockLoggerService) ,
        },
        {
          provide: UploadService,
          useValue: mockUploadService,
        },
        {
          provide: CACHE_MANAGER,
          useValue: mockCacheManager,
        }
      ],
    }).compile();

    service = module.get<MessageService>(MessageService);
    cacheService = module.get<Cache>(CACHE_MANAGER);
  });

  it('create an instance of MessageService', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a message with given attributes', async () => {
      const mockMessage = {
        id: '1',
        text: 'mock message',
        file: '1192371',
        userId: '1',
        guildID: '1',
        createdAt: new Date(),
      };

      const mockUser = {
        id: '1',
        username: 'mock user',
        email: 'mock email',
        password: 'mock password',
        createdAt: new Date(),
      };

      mockUserRepo.findOne.mockResolvedValue(mockUser);
      mockMessageRepo.create.mockResolvedValue(mockMessage);

      const result = await service.create('mock message', '1192371', '1', '1');
      expect(result).toEqual(mockMessage);
      expect(mockMessageRepo.create).toHaveBeenCalledWith(CreateMessageDto);
    });
  });

  describe('findOne', () => {
    it('should find a message with given id from database', async () => {
      const mockId = '1';
      const mockMessage = jest.mocked<Message>;

      mockCacheManager.get.mockResolvedValue(null);// should be no cache hit
      mockMessageRepo.findOne.mockResolvedValue(mockMessage);

      const res = await service.findOne(mockId);
      expect(res).toBe(mockMessage);
      expect(cacheService.get).toHaveBeenCalledWith(mockId);
      expect(mockMessageRepo.findOne).toHaveBeenCalledWith({
        where: { id: mockId },
      })
    });

    it('should find a message with given id from cache', async() => {
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

  });

  describe('remove', () => {});

  describe('update', () => {});
});
