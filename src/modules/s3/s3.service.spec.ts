import { Test, TestingModule } from '@nestjs/testing';
import { S3Service } from './s3.service';
import { LoggerService } from '../../core/logger/logger.service';
import { mock, instance } from 'ts-mockito';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

describe('YourService', () => {
  let service: S3Service;
  let cacheService: Cache;
  let mockLoggerService: LoggerService;

  const mockCacheManager = {
    get: jest.fn(),
    set: jest.fn(),
  };

  beforeEach(async () => {
    mockLoggerService = mock(LoggerService);
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        S3Service,
        {
          provide: LoggerService,
          useValue: instance(mockLoggerService),
        },
        {
          provide: CACHE_MANAGER,
          useValue: mockCacheManager,
        },
      ],
    }).compile();

    service = module.get<S3Service>(S3Service);
    cacheService = module.get<Cache>(CACHE_MANAGER);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('uploadFile', () => {});

  describe('deleteFile', () => {});

  describe('deleteFiles', () => {});

  describe('copyFile', () => {});

  describe('moveFile', () => {});
});
