import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { ManagedUpload } from 'aws-sdk/clients/s3';
import { LoggerService } from '../../core/logger/logger.service';
import { basename } from 'path';
import { LoggerBase } from '../../core/logger/logger.base';
import { AWSError, S3 } from 'aws-sdk';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

export interface IChangeFolderResponse {
  url: string;
  key: string;
}

@Injectable()
export class S3Service extends LoggerBase {
  private bucketS3 = this.configService.getOrThrow('AWS_S3_BUCKET_NAME');
  private region = this.configService.getOrThrow('AWS_S3_REGION');
  private readonly s3;

  constructor(private readonly configService: ConfigService, protected readonly logger: LoggerService, @Inject(CACHE_MANAGER) private cacheService: Cache) {
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

    console.log(this.getUrlString('test'));
    return new S3({
      accessKeyId: this.configService.getOrThrow('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.getOrThrow('AWS_SECRET_ACCESS_KEY'),
      region: this.region,
    });
  }

  async uploadFile(filename: string, file: Buffer, key: string): Promise<ManagedUpload.SendData> {
    try {
      const path = `${key}/${filename}`;
      this.logInfo('Uploading file:', filename);
      return new Promise((resolve, reject) => {
        this.s3.upload(
          {
            Bucket: this.bucketS3,
            Key: path,
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
    try {
      //getting the file metadata without downloading the file
      await this.s3.headObject({ Bucket: this.bucketS3, Key: deleteParams.Key }).promise();
    } catch (err) {
      if (err.code == 'NotFound') {
        this.logDebug("File not found! Can't delete:", deleteParams.Key);
        return Promise.resolve({});
      } else {
        this.logError('Error checking if file exists: ', err);
        return Promise.reject(err);
      }
    }

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

  async deleteAllTemp(): Promise<S3.DeleteObjectsOutput> {
    const prefix = 'temp/';

    try {
      const listObjectsResponse = await this.s3.listObjectsV2({ Bucket: this.bucketS3, Prefix: prefix }).promise();

      if (!listObjectsResponse.Contents || listObjectsResponse.Contents.length === 0) {
        this.logDebug("No files found in 'temp' folder. Nothing to delete.", prefix);
        return Promise.resolve({});
      }

      const keysToDelete = listObjectsResponse.Contents.map(object => ({ Key: object.Key }));

      const deleteParams: S3.DeleteObjectsRequest = {
        Bucket: this.bucketS3,
        Delete: {
          Objects: keysToDelete,
          Quiet: false,
        },
      };

      this.logInfo('Deleting all files in the temp folder.');
      return await this.s3.deleteObjects(deleteParams).promise();
    } catch (err) {
      this.logError('Error deleting files in the temp folder:', err);
      return Promise.reject(err);
    }
  }

  async deleteAllPermanent(): Promise<S3.DeleteObjectsOutput> {
    const prefix = 'permanent/';

    try {
      const listObjectsResponse = await this.s3.listObjectsV2({ Bucket: this.bucketS3, Prefix: prefix }).promise();

      if (!listObjectsResponse.Contents || listObjectsResponse.Contents.length === 0) {
        this.logDebug("No files found in 'permanent' folder. Nothing to delete.", prefix);
        return Promise.resolve({});
      }

      const keysToDelete = listObjectsResponse.Contents.map(object => ({ Key: object.Key }));

      const deleteParams: S3.DeleteObjectsRequest = {
        Bucket: this.bucketS3,
        Delete: {
          Objects: keysToDelete,
          Quiet: false,
        },
      };

      this.logInfo('Deleting all files in the permanent folder.');
      return await this.s3.deleteObjects(deleteParams).promise();
    } catch (err) {
      this.logError('Error deleting files in the permanent folder:', err);
      return Promise.reject(err);
    }
  }

  async deleteFiles(keys: string[]): Promise<S3.DeleteObjectsOutput> {
    const keysWithPrefix = keys.map(key => `temp/${key}`);

    for (const key of keysWithPrefix) {
      try {
        await this.s3.headObject({ Bucket: this.bucketS3, Key: key }).promise();
      } catch (err) {
        if (err.code == 'NotFound') {
          this.logDebug("File not found! Can't delete:", key);
          return Promise.resolve({});
        } else {
          this.logError('Error checking if file exists: ', err);
          return Promise.reject(err);
        }
      }
    }
    const objectsToDelete = keysWithPrefix.map(key => ({ Key: key }));

    const deleteParams: S3.DeleteObjectsRequest = {
      Bucket: this.bucketS3,
      Delete: {
        Objects: objectsToDelete,
        Quiet: false,
      },
    };
    this.logInfo('Deleting files:', keys.join(', '));

    return new Promise((resolve, reject) => {
      this.s3.deleteObjects(deleteParams, (err: AWSError, data: S3.DeleteObjectsOutput) => {
        if (err) {
          this.logError('Error deleting files:', err);
          return reject(err.message);
        }
        const deletedKeys = data.Deleted.map(deleted => deleted.Key);
        this.logDebug('Files deleted successfully:', deletedKeys.join(', '));
        resolve(data);
      });
    });
  }

  async copyFile(copyParams: S3.CopyObjectRequest): Promise<S3.CopyObjectOutput> {
    try {
      await this.s3.headObject({ Bucket: this.bucketS3, Key: copyParams.CopySource }).promise();
    } catch (err) {
      if (err.code == 'NotFound') {
        this.logDebug('File not found! Can not copy:', copyParams.CopySource);
        return Promise.resolve({});
      } else {
        this.logError('Error checking if file exists: ', err);
        return Promise.reject(err);
      }
    }

    this.logInfo('Copying file:', copyParams.Key);
    return await new Promise((resolve, reject) => {
      this.s3.copyObject(copyParams, (err: AWSError, data: S3.CopyObjectOutput) => {
        if (err) {
          this.logError('Error copying file:', err);
          return reject(err.message);
        }

        this.logDebug('File copied successfully:', copyParams.Key);
        resolve(data);
      });
    });
  }

  async moveFile(sourceKey: string, destinationKey: string): Promise<IChangeFolderResponse> {
    this.logInfo('Moving file:', sourceKey);
    try {
      await this.s3.headObject({ Bucket: this.bucketS3, Key: sourceKey }).promise();
    } catch (err) {
      if (err.code == 'NotFound') {
        this.logDebug("File not found! Can't move it:", sourceKey);
        return Promise.resolve({ url: '', key: '' });
      } else {
        this.logError('Error checking if file exists: ', err);
        return Promise.reject(err);
      }
    }

    const copyParams: S3.CopyObjectRequest = {
      Bucket: this.bucketS3,
      CopySource: `${this.bucketS3}/${sourceKey}`,
      Key: destinationKey,
    };

    const deleteParams: S3.DeleteObjectRequest = {
      Bucket: this.bucketS3,
      Key: sourceKey,
    };

    return new Promise((resolve, reject) => {
      this.s3.copyObject(copyParams, (err: AWSError, data: S3.CopyObjectOutput) => {
        if (err) {
          this.logError('Error copying file:', err);
          return reject(err.message);
        }

        this.logDebug('File copied successfully:', sourceKey);
        this.s3.deleteObject(deleteParams, (err: AWSError, data: S3.DeleteObjectOutput) => {
          if (err) {
            this.logError('Error deleting file:', err);
            return reject(err.message);
          }

          this.logDebug('File deleted successfully:', sourceKey);
          resolve({ url: this.getUrlString(destinationKey), key: destinationKey });
        });
      });
    });
  }

  public getUrlString(key: string): string {
    return `https://${this.bucketS3}.s3.amazonaws.com/${key}`;
  }
}
