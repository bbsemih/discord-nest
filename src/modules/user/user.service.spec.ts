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
    it('create  a new user', async () => {
      const mockUserDto = {} as UserDto;
      const mockCreatedUser = {} as User;
      mockUserRepo.create.mockResolvedValue(mockCreatedUser);

      const result = await service.create(mockUserDto);

      expect(result).toBe(mockCreatedUser);
      expect(mockUserRepo.create).toHaveBeenCalledWith(mockUserDto);
    });

    it('throw an error when creating a user fails in service', async () => {
      const mockUserDto = {} as UserDto;
      const mockError = new Error('Mock error');
      mockUserRepo.create.mockRejectedValue(mockError);

      await expect(service.create(mockUserDto)).rejects.toThrowError(mockError);
    });
  });

  describe('findOne', () => {
    it('find a user by username from cache', async () => {
      const mockUsername = 'testuser';
      const mockCachedUser = jest.mocked<User>;

      mockCacheManager.get.mockResolvedValue(mockCachedUser);
      const result = await service.findOne(mockUsername);

      expect(result).toBe(mockCachedUser);
      expect(cacheService.get).toHaveBeenCalledWith(mockUsername);
    });

    it('find a user by username from database', async () => {
      const mockUsername = 'semihb';
      const mockUser = jest.mocked<User>;

      mockCacheManager.get.mockResolvedValue(null); //should be no cache hit
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
    it('find all users', async () => {
      const user1 = jest.fn() as unknown as User;
      const user2 = jest.fn() as unknown as User;

      const mockUsers: User[] = [user1, user2];

      mockUserRepo.findAll.mockResolvedValue(mockUsers);

      const res = await service.findAll();

      expect(res).toEqual(mockUsers);
    });
  });

  describe.skip('update', () => {
    it('update the user with given id and attributes', async () => {
      const [id, attr] = ['1', { username: 'deneme', email: 'test@hotmail.com' }];
      const mockUser: Partial<User> = {
        id: '1',
        username: 'testuser',
        email: 'test@gmail.com',
      };
      const mockUserInstance: Partial<User> = {
        id: '1',
        username: 'testuser',
        email: 'test@gmail.com',
        save: jest.fn().mockResolvedValue(mockUser as User),
      };

      mockUserRepo.findOne.mockResolvedValue(mockUser as User);
      const updatedUser = await service.update(id, attr);

      expect(updatedUser).toEqual(mockUser);
      expect(mockUserRepo.findOne).toHaveBeenCalledWith({ where: { id } });
      expect(updatedUser.id).toBe(id);
      expect(updatedUser.username).toBe(attr.username);
      expect(updatedUser.email).toBe(attr.email);
    });
  });

  describe.skip('remove', () => {
    it('remove the user from database by username', async () => {
      const mockUsername = 'testuser';
      const mockUser = jest.mocked<User>;



      await service.remove(mockUsername);
    });
  });
});
