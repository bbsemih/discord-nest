import { Test, TestingModule } from '@nestjs/testing';
import { MessageService } from './message.service';

describe('MessageService', () => {
  let service: MessageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MessageService],
    }).compile();

    service = module.get<MessageService>(MessageService);
  });

  it('find a message with its id', () => {
    expect(service.findOne('1')).toEqual({
      id: '1',
      text: 'Hello World',
      userId: '1',
      guildID: '1',
    });
  });
});
