import { Controller, Post, UploadedFile, UseInterceptors, Param, Body } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { S3Service } from './s3.service';
import { FileValidationPipe } from './pipes/file-validator.pipe';

@Controller('s3')
export class S3Controller {
  private bucketName = process.env.AWS_S3_BUCKET_NAME;
  constructor(private readonly s3Service: S3Service) {}

  @Post('/upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile(FileValidationPipe) file: Express.Multer.File) {
    await this.s3Service.uploadFile(file.originalname, file.buffer);
  }

  @Post('/delete/:key')
  @UseInterceptors(FileInterceptor('file'))
  async deleteFile(@Param('key') key: string) {
    await this.s3Service.deleteFile({ Bucket: this.bucketName, Key: key });
  }

  @Post('/delete/')
  @UseInterceptors(FileInterceptor('file'))
  async deleteFiles(@Body() keys: string[]) {
    await this.s3Service.deleteFiles({ Bucket: this.bucketName, Delete: { Objects: keys.map(key => ({ Key: key })) } });
  }

  @Post('/copy')
  @UseInterceptors(FileInterceptor('file'))
  async copyFile(@Body() { sourceKey, destinationKey }: { sourceKey: string; destinationKey: string }) {
    await this.s3Service.copyFile({ Bucket: this.bucketName, CopySource: `${this.bucketName}/${sourceKey}`, Key: destinationKey });
  }

  @Post('/move')
  @UseInterceptors(FileInterceptor('file'))
  async moveFile(@Body() { sourceKey, destinationKey }: { sourceKey: string; destinationKey: string }) {}
}