import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { AuthService } from '../auth/auth.service';
import { UserService } from './user.service';
import { User } from './user.entity';
import { NotFoundException } from '@nestjs/common';

describe('UserController', () => {
  let controller: UserController;
  let mockAuthService: Partial<AuthService>;
  let mockUserService: Partial<UserService>;

  beforeEach(async () => {
    mockAuthService = {
      //login: jest.fn({email: string, password: string} => Promise.resolve({} as User)),
      signUp: jest.fn(),
    };

    mockUserService = {
      findOne: jest.fn(username => Promise.resolve({ id: '1', username, email: 'semi@gmail.com', password: 'semihim' } as User)),
      create: jest.fn(),
      remove: jest.fn(),
      update: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        { provide: AuthService, 
          useValue: mockAuthService 
        },
        { provide: UserService, 
          useValue: mockUserService 
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('findOne throws an error if user not found', async () => {
    mockUserService.findOne = jest.fn(username => Promise.resolve(null));
    await expect(controller.findOne('semi')).rejects.toThrow(NotFoundException);
  });

  it('findOne returns a user with the given username', async () => {
    const user = await controller.findOne('semi');
    expect(user).toBeDefined();
  });

  it('login updates session object and returns user', async () => {
    const session = { userId: null };
    //TODO
  });
});
