import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { UserDto } from '../user/dto/user.dto';
import { User } from '../user/user.entity';
import { JwtService } from '@nestjs/jwt';
import { LoggerService } from '../../core/logger/logger.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let mockUserService: Partial<UserService>;

  beforeEach(async () => {
    const users: User[] = [];

    mockUserService = {
      findOne: (username: string) => {
        const filteredUsers = users.filter(user => user.username === username);
        return Promise.resolve(filteredUsers[0] as User);
      },
      create: (user: UserDto) => {
        const newUser = { ...user, id: Math.floor(Math.random() * 9999).toString() } as User;
        users.push(newUser);
        return Promise.resolve(newUser);
      },
    };

    const mockJwtService: Partial<any> = {
      signAsync: jest.fn(),
    };

    const mockLoggerService = {
      logInfo: 'logInfo',
      logError: 'logError',
      logWarn: 'logWarn',
      error: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: mockUserService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: LoggerService,
          useValue: mockLoggerService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('create an instance of AuthService', () => {
    expect(service).toBeDefined();
  });

  it.skip('creates a new user with a salted and hashed password', async () => {
    const result = await service.signUp({
      username: 'test1',
      fullName: 'test2',
      email: 'test@gmail.com',
      password: 'test3',
      dateOfBirth: new Date(),
    });

    const { user, token } = result;

    expect(user.password).not.toEqual('test3');
    const [hash, salt] = user.password.split('.');
    expect(hash).toBeDefined();
    expect(salt).toBeDefined();
  });

  it.skip('throws an error if user signs up with an existing email', async () => {
    mockUserService.findOne = () => Promise.resolve({ id: '1', email: 'semih@gmail.com', username: 'semihb', password: 'deneme' } as User);
    await expect(
      service.signUp({
        username: 'deneme1',
        fullName: 'deneme2',
        email: 'deneme4',
        password: 'deneme5',
        dateOfBirth: new Date(),
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('throws an error if signin called with an unused email', async () => {
    await expect(service.login({ email: 'semi@gmail', password: 'deneme' })).rejects.toThrow(BadRequestException);
  });

  it('throws an error if an invalid password is provided', async () => {
    await service.signUp({
      username: 'test1',
      fullName: 'test2',
      email: 'test4',
      password: 'test3',
      dateOfBirth: new Date(),
    });

    await expect(service.login({ email: 'test4', password: 'test' })).rejects.toThrow(BadRequestException);
  });

  it('returns a user if correct password is provided', async () => {
    await service.signUp({
      username: 'test1',
      fullName: 'test2',
      email: 'test4',
      password: 'test3',
      dateOfBirth: new Date(),
    });

    const user = await service.login({ email: 'test4', password: 'test3' });
    expect(user).toBeDefined();
  });
});
