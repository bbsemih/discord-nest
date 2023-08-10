import { Controller, Get, Param } from '@nestjs/common';
import { MessageService } from './message.service';

@Controller('message')
export class MessageController {
  constructor(private messageService: MessageService) {}

  @Get('/:id')
  async getMessageById(@Param('id') id: string) {
    //return await this.messageService.getMessageById(id);
  }
}
