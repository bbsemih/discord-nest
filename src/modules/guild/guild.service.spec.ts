import { Test, TestingModule } from '@nestjs/testing';
import { GuildService } from './guild.service';
import { LoggerService } from '../../core/logger/logger.service';
import { GUILD_REPOSITORY } from '../constants';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { GuildDTO } from './dto/guild.dto';
import { Guild } from './guild.entity';
import { mock, instance } from 'ts-mockito';
import { User } from '../user/user.entity';

describe('GuildService', () => {
  let service: GuildService;
  let mockLoggerService: LoggerService;
  let cacheService: Cache;

  const mockGuildRepo = {
    create: jest.fn(),
    findOne: jest.fn(),
    findAll: jest.fn(),
    findByPk: jest.fn(),
  };

  const mockCacheManager = {
    get: jest.fn(),
    set: jest.fn(),
  };

  const mockGuildData = {
    id: '1',
    name: 'test',
    description: 'test',
    ownerId: '1',
    icon: 'test',
    roles: ['admin', 'moderator'],
    region: 'test',
    nsfwLevel: 1,
  };

  beforeEach(async () => {
    mockLoggerService = mock(LoggerService);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GuildService,
        {
          provide: LoggerService,
          useValue: instance(mockLoggerService),
        },
        {
          provide: GUILD_REPOSITORY,
          useValue: mockGuildRepo,
        }, 
        {
          provide: CACHE_MANAGER,
          useValue: mockCacheManager,
        }
      ],
    }).compile();

    service = module.get<GuildService>(GuildService);
    cacheService = module.get<Cache>(CACHE_MANAGER);
  });

  it('create an instance of GuildService', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('creates a guild with required fields', async () => {
      const mockGuildDto = {} as GuildDTO;
      const mockCreatedGuild = {} as Guild;
      mockGuildRepo.create.mockResolvedValue(mockCreatedGuild);

      const result = await service.create(mockGuildDto);

      expect(result).toBe(mockCreatedGuild);
      expect(mockGuildRepo.create).toHaveBeenCalledWith(mockGuildDto);
    });
  });

  describe('find', () => {
    it('finds a guild by id from database', async () => {
      const mockGuildId = '1';
      const mockGuild = jest.mocked<Guild>;

      mockCacheManager.get.mockResolvedValue(null);
      mockGuildRepo.findOne.mockResolvedValue(mockGuild);

      const result = await service.findOne(mockGuildId);

      expect(result).toBe(mockGuild)
      //uncomment this when cache is implemented
      //expect(cacheService.get).toHaveBeenCalledWith(mockGuildId);
      expect(mockGuildRepo.findOne).toHaveBeenCalledWith({ where: { id: mockGuildId } });
    });

    it('finds a guild by id from cache', async () => {
      const mockGuildId = '1';
      const mockGuild = jest.mocked<Guild>;

      mockCacheManager.get.mockResolvedValue(mockGuild);
      mockGuildRepo.findOne.mockResolvedValue(null);

      const result = await service.findOne(mockGuildId);

      expect(result).toBe(mockGuild);
      //uncomment this when cache is implemented
      //expect(cacheService.get).toHaveBeenCalledWith(mockGuildId);
      expect(mockGuildRepo.findOne).toHaveBeenCalledWith({ where: { id: mockGuildId } });
    });

    it('find all guilds of specific user', async () => {
      const mockUserId = '1';
      const mockGuilds = [jest.mocked<Guild>];

      mockGuildRepo.findAll.mockResolvedValue(mockGuilds);

      const result = await service.findGuildsOfUser(mockUserId);

      expect(result).toBe(mockGuilds);
      expect(mockGuildRepo.findAll).toHaveBeenCalledWith({ where: { ownerId: mockUserId } });
    });

    it('find all users in a specific guild', async() => {
      const mockGuildId = '1';
      const mockGuild = jest.mocked<Guild>;
      const mockUsers = jest.mocked<User[]>;

      mockGuildRepo.findByPk.mockResolvedValue(mockGuild);
      //mockGuild.members = mockUsers;
      const result = await service.findUsersInGuild(mockGuildId);

      expect(result).toBe(mockUsers);
      expect(mockGuildRepo.findByPk).toHaveBeenCalledWith(mockGuildId, { include: [{ model: User, as: 'members' }] });
    })
  });

  describe('remove', () => {
    it('remove a guild from database by id', async () => {});
  });

  describe('update', () => {
    it('update a guild with given id and attributes', async () => {});
  });
});
