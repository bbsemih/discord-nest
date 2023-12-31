import { Module } from '@nestjs/common';
import { S3Service } from './s3.service';
import { S3Controller } from './s3.controller';
import { LoggerModule } from '../../core/logger/logger.module';

@Module({
  imports: [LoggerModule],
  providers: [S3Service],
  exports: [S3Service],
  controllers: [S3Controller],
})
export class S3Module {}
