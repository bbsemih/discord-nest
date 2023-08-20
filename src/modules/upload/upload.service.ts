import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Readable } from 'stream';

@Injectable()
export class UploadService {
  private readonly s3ClientDc = new S3Client({
    region: this.configService.getOrThrow('AWS_S3_REGION'),
  });

  constructor(private readonly configService: ConfigService) {}

  async uploadOne(filename: string, file: Buffer) {
    await this.s3ClientDc.send(
      new PutObjectCommand({
        Bucket: this.configService.getOrThrow('AWS_S3_BUCKET_NAME'),
        Key: filename,
        Body: file,
      }),
    );
  }

  async getFileStream(key: string): Promise<Readable> {
    try {
      const response = await this.s3ClientDc.send(
        new GetObjectCommand({
          Bucket: this.configService.getOrThrow('AWS_S3_BUCKET_NAME'),
          Key: key,
        }),
      );
      return response.Body as Readable;
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }
}
