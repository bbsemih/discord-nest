import { All, Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiResponse } from '@nestjs/swagger';
import { STATUS_CODES, MESSAGES } from './core/constants';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiResponse({ status: 200 })
  @All('/')
  async root(): Promise<any> {
    return {
      statusCode: STATUS_CODES.SUCCESS,
      code: STATUS_CODES.SUCCESS,
      message: MESSAGES.SUCCESS,
    };
  }

  @ApiResponse({ status: 200 })
  @All('/health')
  async health() {
    return {
      statusCode: STATUS_CODES.SUCCESS,
      code: STATUS_CODES.SUCCESS,
      message: MESSAGES.SUCCESS,
    };
  }
}
