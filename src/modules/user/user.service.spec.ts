import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { User } from './user.entity';
import { LoggerService } from '../../core/logger/logger.service';
import { USER_REPOSITORY } from '../constants';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { usersProviders } from './users.providers';
import { UserDto } from './dto/user.dto';
import { instance, mock } from 'ts-mockito';

describe('UserService', () => {
  let service: UserService;
  let cacheService: Cache;
  let mockLoggerService: LoggerService;

  const mockUserRepo = {
    create: jest.fn(),
    findOne: jest.fn(),
    findAll: jest.fn(),
    findByPk: jest.fn(),
  };

  const mockCacheManager = {
    get: jest.fn(),
    set: jest.fn(),
  };

  beforeEach(async () => {
    mockLoggerService = mock(LoggerService);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        ...usersProviders,
        {
          provide: LoggerService,
          useValue: instance(mockLoggerService),
        },
        {
          provide: USER_REPOSITORY,
          useValue: mockUserRepo,
        },
        {
          provide: CACHE_MANAGER,
          useValue: mockCacheManager,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    cacheService = module.get<Cache>(CACHE_MANAGER);
  });

  it('create an instance of UserService', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create  a new user', async () => {
      const mockUserDto = {} as UserDto;
      const mockCreatedUser = {} as User;
      mockUserRepo.create.mockResolvedValue(mockCreatedUser);

      const result = await service.create(mockUserDto);

      expect(result).toBe(mockCreatedUser);
      expect(mockUserRepo.create).toHaveBeenCalledWith(mockUserDto);
    });

    it('should throw an error when creating a user fails', async () => {
      const mockUserDto = {} as UserDto;
      const mockError = new Error('Mock error');
      mockUserRepo.create.mockRejectedValue(mockError);

      await expect(service.create(mockUserDto)).rejects.toThrowError(mockError);
    });
  });

  describe('findOne', () => {
    it('should find a user by username from cache', async () => {
      const mockUsername = 'testuser';
      const mockCachedUser = jest.mocked<User>;

      mockCacheManager.get.mockResolvedValue(mockCachedUser);
      const result = await service.findOne(mockUsername);

      expect(result).toBe(mockCachedUser);
      expect(cacheService.get).toHaveBeenCalledWith(mockUsername);
    });

    it('should find a user by username from database', async () => {
      const mockUsername = 'semihb';
      const mockUser = jest.mocked<User>;

      mockCacheManager.get.mockResolvedValue(null); //no cache hit
      mockUserRepo.findOne.mockResolvedValue(mockUser);

      const res = await service.findOne(mockUsername);

      expect(res).toBe(mockUser);
      expect(cacheService.get).toHaveBeenCalledWith(mockUsername);
      expect(mockUserRepo.findOne).toHaveBeenCalledWith({
        where: { username: mockUsername },
      });
    });
  });

  describe('findAll', () => {
    it('should find all users', async () => {
      const user1 = jest.fn() as unknown as User;
      const user2 = jest.fn() as unknown as User;

      const mockUsers: User[] = [user1, user2];

      mockUserRepo.findAll.mockResolvedValue(mockUsers);

      const res = await service.findAll();

      expect(res).toEqual(mockUsers);
    });
  });

  //doesnt work properly
  describe.skip('update', () => {
    it('should update the user with given id and attributes', async () => {
      const mockUserId = '1';
      const mockAttrs = { email: 'test@gmail.com', password: 'testpass' };

      const mockUserInstance = {
        ...mockAttrs,
        save: jest.fn(),
      };
      const res = await service.update(mockUserId, mockAttrs);

      expect(res).toBe(mockUserInstance);
      expect(mockUserRepo.findByPk).toHaveBeenCalledWith(mockUserId);
    });
  });

  describe.skip('remove', () => {
    it('should remove the user from database', async () => {
      /*
      const mockUsername = 'testuser';
      const mockUser = jest.mocked<User>();

      mockUserRepo.findOne.mockResolvedValue(mockUser);
      mockUser.destroy.mockResolvedValue(true);

      const res = await service.remove(mockUsername);

      expect(res).toBe(true);
      expect(mockUserRepo.findOne).toHaveBeenCalledWith({
        where: { username: mockUsername },
      });
      expect(mockUser.destroy).toHaveBeenCalled();
      */
    });
  });
});
