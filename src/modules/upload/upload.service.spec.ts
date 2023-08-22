import { UploadService } from './upload.service';

describe('UploadService', () => {
  let uploadService: UploadService;

  const mockConfigService = {
    getOrThrow: jest.fn(key => {
      if (key === 'AWS_S3_REGION') return 'mock-region';
      if (key === 'AWS_S3_BUCKET_NAME') return 'mock-bucket';
    }),
  };

  beforeEach(() => {
    uploadService = new UploadService(mockConfigService as any);
  });

  it('uploads a file', async () => {
    const mockS3Client = {
      send: jest.fn(),
    };

    uploadService['s3ClientDc'] = mockS3Client as any;

    await uploadService.uploadOne('test-file.txt', Buffer.from('test-content'));

    expect(mockS3Client.send).toHaveBeenCalledWith(
      expect.objectContaining({
        input: expect.objectContaining({
          Bucket: 'mock-bucket',
          Key: 'test-file.txt',
          Body: Buffer.from('test-content'),
        }),
      }),
    );
  });

  it('should get a file stream', async () => {
    const mockS3Client = {
      send: jest.fn(() => ({
        Body: Buffer.from('test-content'),
      })),
    };
    uploadService['s3ClientDc'] = mockS3Client as any;
    const fileStream = await uploadService.getFileStream('test-file.txt');

    expect(fileStream).toEqual(Buffer.from('test-content'));
  });
});
