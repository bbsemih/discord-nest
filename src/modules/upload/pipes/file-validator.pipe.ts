import { BadRequestException, PipeTransform } from '@nestjs/common';

export class FileValidationPipe implements PipeTransform {
  async transform(value: Express.Multer.File) {
    const maxSize = 1000;
    const allowedFileTypes = ['image/jpeg', 'image/png', 'application/pdf'];

    if (value.size > maxSize) {
      throw new BadRequestException('File size exceeds the maximum allowed!');
    }

    if (!allowedFileTypes.includes(value.filename)) {
      throw new BadRequestException('Invalid file type!');
    }
    return value;
  }
}
