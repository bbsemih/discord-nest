import { Controller, Post, UploadedFile, UseInterceptors, Param, Body } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { S3Service } from './s3.service';
import { FileValidationPipe } from './pipes/file-validator.pipe';

@Controller('s3')
export class S3Controller {
  private bucketName = process.env.AWS_S3_BUCKET_NAME;
  constructor(private readonly s3Service: S3Service) {}

  @Post('/upload/temp')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile(FileValidationPipe) file: Express.Multer.File) {
    await this.s3Service.uploadFile(file.originalname, file.buffer, 'temp');
  }

  @Post('/upload/permanent')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFilePermanent(@UploadedFile(FileValidationPipe) file: Express.Multer.File) {
    await this.s3Service.uploadFile(file.originalname, file.buffer, 'permanent');
  }

  @Post('/deleteone/temp')
  @UseInterceptors(FileInterceptor('file'))
  async deleteFile(@Body() { key }: { key: string }) {
    await this.s3Service.deleteFile({ Bucket: this.bucketName, Key: `temp/${key}` });
  }

  @Post('/deleteone/permanent')
  @UseInterceptors(FileInterceptor('file'))
  async deleteFilePermanent(@Body() { key }: { key: string }) {
    await this.s3Service.deleteFile({ Bucket: this.bucketName, Key: `permanent/${key}` });
  }

  @Post('/delete/temp')
  @UseInterceptors(FileInterceptor('file'))
  async deleteFiles(@Body() keys: { key: string[] }) {
    await this.s3Service.deleteFiles(keys.key);
  }

  @Post('/delete/permanent')
  @UseInterceptors(FileInterceptor('file'))
  async deleteFilesPermanent(@Body() keys: { key: string[] }) {
    await this.s3Service.deleteFiles(keys.key);
  }

  @Post('/deleteall/temp')
  @UseInterceptors(FileInterceptor('file'))
  async deleteAllFilesTemp() {
    await this.s3Service.deleteAllTemp();
  }

  @Post('/deleteall/permanent')
  @UseInterceptors(FileInterceptor('file'))
  async deleteAllFilesPermanent() {
    await this.s3Service.deleteAllPermanent();
  }

  @Post('/copy')
  @UseInterceptors(FileInterceptor('file'))
  async copyFile(@Body() { sourceKey, destinationKey }: { sourceKey: string; destinationKey: string }) {
    const copyParams = {
      Bucket: this.bucketName,
      CopySource: sourceKey,
      Key: destinationKey,
    };
    await this.s3Service.copyFile(copyParams);
  }

  @Post('/move')
  @UseInterceptors(FileInterceptor('file'))
  async moveFile(@Body() { sourceKey, destinationKey }: { sourceKey: string; destinationKey: string }) {}
}