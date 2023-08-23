import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { UserDto } from './dto/user.dto';

describe('UserService', () => {
  let service: UserService;
  let mockUserService: Partial<UserService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('create user with required paramaters', () => {});
});
