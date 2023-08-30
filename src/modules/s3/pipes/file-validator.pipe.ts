import { BadRequestException, PipeTransform } from '@nestjs/common';

export class FileValidationPipe implements PipeTransform {
  async transform(value: Express.Multer.File) {
    const maxSize = 8 * 1024 * 1024;
    const allowedFileTypes = ['image/jpeg', 'image/png', 'application/pdf'];

    if (value.size > maxSize) {
      throw new BadRequestException('File size exceeds the maximum allowed!');
    }

    if (!allowedFileTypes.includes(value.mimetype)) {
      console.log(value.mimetype);
      throw new BadRequestException('Invalid file type!');
    }
    return value;
  }
}
