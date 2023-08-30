import {  Controller, Post, UploadedFile, UseInterceptors, Param } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { S3Service } from './s3.service';
import { FileValidationPipe } from './pipes/file-validator.pipe';

@Controller('s3')
export class S3Controller {
  constructor(private readonly s3Service: S3Service) {}

  @Post('/upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile(FileValidationPipe) file: Express.Multer.File) {
    await this.s3Service.uploadFile(file.originalname, file.buffer);
  }

  @Post('/delete/:key')
  @UseInterceptors(FileInterceptor('file'))
  //is it really the best way to delete a file by its key??? it should be unique anyways
  async deleteFile(@Param('key') key: string) {
    await this.s3Service.deleteFile({ Bucket: process.env.AWS_S3_BUCKET_NAME, Key: key});
  }

  /*
  @Get(':key')
  async getFile(@Param('key') key: string, @Res() res: Response) {
    try {
      const fileStream = await this.uploadService.getFileStream(key);

      const contentType = fileStream.ContentType;
      res.setHeader('Content-Type', contentType);
      fileStream.pipe(res);// Pipe the S3 file stream to the response
    } 
    catch (error) {
      res.status(404).send(error.message);
    }
  }
  */
}
