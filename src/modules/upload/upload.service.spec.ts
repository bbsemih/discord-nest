import { Test, TestingModule } from '@nestjs/testing';
import { UploadService } from './upload.service';
import { ConfigService } from '@nestjs/config';
import { ConfigModule } from '@nestjs/config';
import { S3Client } from '@aws-sdk/client-s3';

describe('UploadService', () => {
  let uploadService: UploadService;
  let s3Client: S3Client;

  beforeEach(async () => {
    const sendMock = jest.fn();
    const s3ClientMock = {
      send: sendMock,
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [UploadService, ConfigService],
      imports: [ConfigModule.forRoot()],
    })
      .overrideProvider(S3Client)
      .useValue(s3ClientMock)
      .compile();

    uploadService = module.get<UploadService>(UploadService);
    s3Client = module.get<S3Client>(S3Client);
  });

  it('should upload a file using the S3 client', async () => {
    const filename = 'testdeneme.jpg';
    const filebuff = Buffer.from('test image data');

    await uploadService.upload(filename, filebuff);

    expect(s3Client.send).toHaveBeenCalledWith(
      expect.objectContaining({
        Bucket: expect.any(String),
        Key: filename,
        Body: filebuff,
      }),
    );
  });
});
