import { Test, TestingModule } from '@nestjs/testing';
import { S3Service } from './s3.service';
import { LoggerService } from '../../core/logger/logger.service';
import { mock, instance } from 'ts-mockito';

describe('YourService', () => {
  let service: S3Service;
  let mockLoggerService: LoggerService;

  beforeEach(async () => {
    mockLoggerService = mock(LoggerService);
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        S3Service,
        {
          provide: LoggerService,
          useValue: instance(mockLoggerService),
        },
      ],
    }).compile();

    service = module.get<S3Service>(S3Service);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('uploadFile', () => {
    it('should upload a file successfully', async () => {
      const mockUploadData = { /* mock the upload data here */ };
      const mockFile = Buffer.from('mock file data');
      const filename = 'test.txt';
      const key = 'temp/test.txt';

      // Mock the S3 upload method to return the expected data
      const mockS3Upload = jest.fn().mockReturnValue({
        promise: jest.fn().mockResolvedValue(mockUploadData),
      });
      service['s3'].upload = mockS3Upload;

      const result = await service.uploadFile(filename, mockFile, 'temp');

      expect(result).toEqual(mockUploadData);
      expect(mockS3Upload).toHaveBeenCalledWith({
        Bucket: service['bucketS3'],
        Key: key,
        Body: mockFile,
        ContentDisposition: 'inline',
      });
    });
  });

  describe('deleteFile', () => {
    it('should delete a file successfully', async () => {
      const deleteParams = {
        Bucket: service['bucketS3'],
        Key: 'temp/test.txt',
      };
      
      const mockHeadObject = jest.fn().mockReturnValue({
        promise: jest.fn().mockResolvedValue({}),
      });
      const mockDeleteObject = jest.fn().mockReturnValue({
        promise: jest.fn().mockResolvedValue({}),
      });
      service['s3'].headObject = mockHeadObject;
      service['s3'].deleteObject = mockDeleteObject;

      const result = await service.deleteFile(deleteParams);

      expect(result).toEqual({});
      expect(mockHeadObject).toHaveBeenCalledWith(deleteParams);
      expect(mockDeleteObject).toHaveBeenCalledWith(deleteParams);
    });
  });

  describe('deleteFiles', () => {});

  describe('copyFile', () => {});

  describe('moveFile', () => {});

  describe('deleteAllTemp', () => {});

  describe('deleteAllPermanent', () => {});
});
