import { All, Controller } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { STATUS_CODES, MESSAGES } from './core/constants';

@Controller()
export class AppController {
  constructor() {}

  @ApiResponse({ status: 200 })
  @All('/')
  @ApiTags('root')
  async root(): Promise<any> {
    return {
      statusCode: STATUS_CODES.SUCCESS,
      code: STATUS_CODES.SUCCESS,
      message: MESSAGES.SUCCESS,
    };
  }

  @ApiResponse({ status: 200 })
  @All('/health')
  @ApiTags('health')
  async health() {
    return {
      statusCode: STATUS_CODES.SUCCESS,
      code: STATUS_CODES.SUCCESS,
      message: MESSAGES.SUCCESS,
    };
  }
}
