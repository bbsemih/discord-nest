import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { ManagedUpload } from 'aws-sdk/clients/s3';
import { LoggerService } from '../../core/logger/logger.service';
import { basename } from 'path';
import { LoggerBase } from 'src/core/logger/logger.base';
import { AWSError, S3 } from 'aws-sdk';

@Injectable()
export class S3Service extends LoggerBase {
  private bucketS3 = this.configService.getOrThrow('AWS_S3_BUCKET_NAME');
  private region = this.configService.getOrThrow('AWS_S3_REGION');
  private readonly s3;

  constructor(private readonly configService: ConfigService, protected readonly logger: LoggerService) {
    super(logger);
    this.s3 = this.getS3();
  }

  protected getServiceName(): string {
    return this.constructor.name;
  }

  protected getFileName(): string {
    return basename(__filename);
  }

  getS3(): S3 {
    this.logInfo('Getting the S3 instance:', this.region);

    return new S3({
      accessKeyId: this.configService.getOrThrow('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.getOrThrow('AWS_SECRET_ACCESS_KEY'),
      region: this.region,
    });
  }

  async uploadFile(filename: string, file: Buffer): Promise<ManagedUpload.SendData> {
    try {
      this.logInfo('Uploading file:', filename);
      return new Promise((resolve, reject) => {
        this.s3.upload(
          {
            Bucket: this.bucketS3,
            Key: filename,
            Body: file,
            ContentDisposition: 'inline',
          },
          (err: Error, data: S3.ManagedUpload.SendData) => {
            if (err) {
              this.logError('Error uploading file:', err);
              return reject(err.message);
            }
            this.logDebug('File uploaded successfully:', filename);
            resolve(data);
          },
        );
      });
    } catch (err) {
      this.logError('Error uploading file:', err);
      throw err;
    }
  }

  async deleteFile(deleteParams: S3.DeleteObjectRequest): Promise<S3.DeleteObjectOutput> {
    this.logInfo('Deleting file:', deleteParams.Key);
    return await new Promise((resolve, reject) => {
      this.s3.deleteObject(deleteParams, (err: AWSError, data: S3.DeleteObjectOutput) => {
        if (err) {
          this.logError('Error deleting file:', err);
          return reject(err.message);
        }

        this.logDebug('File deleted successfully:', deleteParams.Key);
        resolve(data);
      });
    });
  }

  //getFile from aws s3???
}
