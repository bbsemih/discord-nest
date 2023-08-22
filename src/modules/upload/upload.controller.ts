import { Controller, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { FileValidationPipe } from './pipes/file-validator.pipe';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile(FileValidationPipe) file: Express.Multer.File) {
    await this.uploadService.uploadOne(file.originalname, file.buffer);
  }

  //TODO: implement streaming
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
