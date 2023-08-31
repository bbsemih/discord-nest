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
import { guildProviders } from './guild.providers';

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

  beforeEach(async () => {
    mockLoggerService = mock(LoggerService);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GuildService,
        ...guildProviders,
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
        },
      ],
    }).compile();

    service = module.get<GuildService>(GuildService);
    cacheService = module.get<Cache>(CACHE_MANAGER);
  });

  it('create an instance of GuildService', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('creates a new guild', async () => {
      const mockGuildDto = {} as GuildDTO;
      const mockCreatedGuild = {} as Guild;
      mockGuildRepo.create.mockResolvedValue(mockCreatedGuild);

      const result = await service.create(mockGuildDto);

      expect(result).toBe(mockCreatedGuild);
      expect(mockGuildRepo.create).toHaveBeenCalledWith(mockGuildDto);
    });

    it('throws an error when creating a new guild fails in service', async () => {
      const mockGuildDto = {} as GuildDTO;
      const mockError = new Error('Mock error!');
      mockGuildRepo.create.mockRejectedValue(mockError);

      await expect(service.create(mockGuildDto)).rejects.toThrow();
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

      expect(result).toBe(mockGuild);
      expect(cacheService.get).toHaveBeenCalledWith(mockGuildId);
      expect(mockGuildRepo.findOne).toHaveBeenCalledWith({ where: { id: mockGuildId } });
    });

    it('finds a guild by id from cache', async () => {
      const mockGuildId = '1';
      const mockGuild = jest.mocked<Guild>;

      mockCacheManager.get.mockResolvedValue(mockGuild);
      const result = await service.findOne(mockGuildId);

      expect(result).toBe(mockGuild);
      expect(cacheService.get).toHaveBeenCalledWith(mockGuildId);
    });
  });

  describe('findAll', () => {
    it('find all guilds of a user', async () => {
      const mockUserId = '1';
      const mockGuilds = [jest.mocked<Guild>];

      mockGuildRepo.findAll.mockResolvedValue(mockGuilds);

      const result = await service.findGuildsOfUser(mockUserId);

      expect(result).toBe(mockGuilds);
      expect(mockGuildRepo.findAll).toHaveBeenCalledWith({ where: { ownerId: mockUserId } });
    });

    it('find all users in a specific guild', async () => {
      const mockGuildId = '1';
      const mockGuild = {
        id: mockGuildId,
        name: 'test',
        ownerId: '1',
        region: 'test',
        members: [],
      }
      const mockUsers = [jest.mocked<User>];

      mockGuildRepo.findOne.mockResolvedValue(mockGuild);
      mockGuild.members = mockUsers;

      const result = await service.findUsersInGuild(mockGuildId);

      expect(result).toBe(mockUsers);
      expect(mockGuildRepo.findOne).toHaveBeenCalledWith({ where: { id: mockGuildId } });
    });
  });

  describe('remove', () => {
    it('remove a guild from database', async () => {
      const mockGuildId = '1';
      const mockGuild =  {
        id: mockGuildId,
        name: 'test',
        description: 'test',
        ownerId: '1',
        region: 'test',
        destroy: jest.fn(),
      }
      mockGuildRepo.findOne.mockResolvedValue(mockGuild);
      mockGuild.destroy = jest.fn().mockResolvedValue(true);

      const result = await service.remove(mockGuildId);

      expect(result).toBeUndefined();
      expect(mockGuildRepo.findOne).toHaveBeenCalledWith({ where: { id: mockGuildId } });
      expect(mockGuild.destroy).toHaveBeenCalled();
    });

    it('throw an error when deleting a non-existent guild', async () => {
      const mockGuildId = '1';
      mockGuildRepo.findOne.mockResolvedValue(null);

      await expect(service.remove(mockGuildId)).rejects.toThrow();
      expect(mockGuildRepo.findOne).toHaveBeenCalledWith({ where: { id: mockGuildId } });
    });
  });

  describe('update', () => {
    it('update a guild with given id and attributes', async () => {
      const mockGuildId = '1';
      const mockGuild = {
        id: mockGuildId,
        name: 'test',
        description: 'test',
        ownerId: '1',
        region: 'us-east-2',
        save: jest.fn(),
      };
      const mockUpdatedAttributes = { name: 'UpdatedName', region: 'us-east-1' };
      mockGuildRepo.findByPk.mockResolvedValue(mockGuild);
      mockGuild.save = jest.fn().mockResolvedValue(mockGuild);

      const result = await service.update(mockGuildId, mockUpdatedAttributes);

      expect(result).toBe(mockGuild);
      expect(mockGuildRepo.findByPk).toHaveBeenCalledWith(mockGuildId);
      expect(mockGuild.save).toHaveBeenCalled();
      expect(mockGuild.name).toBe(mockUpdatedAttributes.name);
      expect(mockGuild.region).toBe(mockUpdatedAttributes.region);
    });
  });
});
