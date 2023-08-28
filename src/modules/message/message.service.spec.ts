import { Test, TestingModule } from '@nestjs/testing';
import { MessageService } from './message.service';
import { MESSAGE_REPOSITORY, USER_REPOSITORY } from '../constants';
import { messageProviders } from './message.providers';
import { UserService } from '../user/user.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { LoggerService } from '../../core/logger/logger.service';
import { UploadService } from '../upload/upload.service';
import { CreateMessageDto } from './dto/create-message.dto';

describe('MessageService', () => {
  let service: MessageService;
  let mockUserService: Partial<UserService>;
  let cacheService: Cache;
  let uploadService: UploadService;

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
          provide: CACHE_MANAGER,
          useValue: mockCacheManager,
        },
        {
          provide: UserService,
          useValue: mockUserService,
        },
        {
          provide: LoggerService,
          //TODO: mock logger service
          useValue: {},
        },
        {
          provide: UploadService,
          //TODO: mock upload service
          useValue: {},
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
    it('should create a message', async () => {
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

  describe('findOne', () => {});

  describe('findAll', () => {});

  describe('remove', () => {});

  describe('update', () => {});
});
