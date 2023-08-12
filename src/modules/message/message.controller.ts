import { Controller, Get, Post, Param, Body, Delete, Patch } from '@nestjs/common';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { Message } from './message.entity';
import { ApiTags } from '@nestjs/swagger';

@Controller('messages')
@ApiTags('messages')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post()
  async createMessage(@Body() createMessageDto: CreateMessageDto): Promise<Message> {
    return this.messageService.create(createMessageDto.content);
  }

  @Get(':id')
  async getMessage(@Param('id') id: string): Promise<Message> {
    return this.messageService.findOne(id);
  }

  @Patch(':id')
  async updateMessage(@Param('id') id: string, @Body() updateMessageDto: UpdateMessageDto): Promise<Message> {
    return this.messageService.update(id, updateMessageDto);
  }

  @Delete(':id')
  async deleteMessage(@Param('id') id: string): Promise<void> {
    await this.messageService.remove(id);
  }
}
