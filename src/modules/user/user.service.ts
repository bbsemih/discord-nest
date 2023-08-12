import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { User } from './user.entity';
import { USER_REPOSITORY } from '../constants';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { LoggerService } from 'src/core/logger/logger.service';
import { LogLevelEnum, LogTypeEnum } from 'src/core/logger/logger.interface';
import { signupUserDTO } from '../auth/dto/signup-user.dto';
import { Cache } from 'cache-manager';

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REPOSITORY) private readonly repo: typeof User,
    @Inject(CACHE_MANAGER) private cacheService: Cache,
    private readonly logger: LoggerService,
  ) {}

  private logInfo(message: string, id?: string) {
    this.logger.info(`${message} ${id}`, 'UsersService', LogLevelEnum.INFO, 'user.service.ts', LogTypeEnum.SERVICE);
  }

  private logWarn(message: string, id?: string) {
    this.logger.warn(`${message} ${id}`, 'UsersService', LogLevelEnum.WARN, 'user.service.ts', LogTypeEnum.SERVICE);
  }

  private logError(message: string, error: any) {
    this.logger.error(`${message} ${error.message}`, 'UsersService', LogLevelEnum.ERROR, 'user.service.ts', LogTypeEnum.SERVICE);
  }

  async create(user: signupUserDTO): Promise<User> {
    try {
      const newUser = await this.repo.create(user);
      this.logInfo('User created:', newUser.id);
      return newUser;
    } catch (err) {
      this.logError('Error creating user:', err);
      throw err;
    }
  }

  async findAll(email: string) {
    try {
      const users = await this.repo.findAll<User>({ where: { email } });
      this.logInfo(`Found ${users.length} user(s) with email: ${email}`);
      return users;
    } catch (err) {
      this.logError(`Error finding users: ${err.message}`, err);
      throw err;
    }
  }

  async findOneByEmail(email: string) {
    try {
      const user = await this.repo.findOne<User>({ where: { email } });
      if (!user) {
        this.logWarn(`user with email:${email} is not found!`);
        return null;
      }
      return user;
    } catch (err) {
      this.logError(`Error finding user: ${err.message}`, err);
      throw err;
    }
  }

  async findOne(id: string) {
    try {
      const user = await this.repo.findByPk<User>(id);
      if (user) {
        this.logInfo(`user found: ${user.email}`, user.id);
      } else {
        this.logWarn(`user with id:${id} is not found!`);
      }
      return user;
    } catch (err) {
      this.logError(`Error finding user: ${err.message}`, err);
      throw err;
    }
  }

  async update(id: string, attrs: Partial<User>) {
    const user = await this.repo.findByPk<User>(id);
    if (!user) {
      this.logWarn(`user with id:${id} is not found!`);
      throw new NotFoundException('user not found');
    }
    Object.assign(user, attrs);
    try {
      const updatedUser = await user.save();
      this.logInfo(`user updated: ${updatedUser.email}`, updatedUser.id);
      return updatedUser;
    } catch (err) {
      this.logError(`Error updating user: ${err.message}`, err);
      throw err;
    }
  }

  async remove(id: string) {
    const user = await this.repo.findByPk<User>(id);
    if (!user) {
      this.logWarn(`user with id:${id} is not found!`);
      throw new NotFoundException('user not found');
    }

    try {
      await user.destroy();
      this.logInfo(`user deleted: ${user.email}`, user.id);
    } catch (error) {
      this.logError(`Error deleting user: ${error.message}`, error);
      throw error;
    }
  }
}
