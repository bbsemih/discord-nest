import { Test, TestingModule } from '@nestjs/testing';
import { GuildService } from './guild.service';
import { LoggerService } from '../../core/logger/logger.service';

describe('GuildService', () => {
  let service: GuildService;

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
    const mockLoggerService = {
      logInfo: 'logInfo',
      logError: 'logError',
      logWarn: 'logWarn',
      error: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GuildService,
        {
          provide: LoggerService,
          useValue: mockLoggerService,
        },
      ],
    }).compile();

    service = module.get<GuildService>(GuildService);
  });

  it('create an instance of GuildService', () => {
    expect(service).toBeDefined();
  });

  it('creates a guild with required fields', async () => {
    const createdGuild = await service.create(mockGuildData);
    expect(createdGuild).toBeDefined();
  });
});
