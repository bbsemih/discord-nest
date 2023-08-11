import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { User } from './user.entity';
import { USER_REPOSITORY } from '../constants';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { LoggerService } from 'src/core/logger/logger.service';
import { LogLevelEnum, LogTypeEnum } from 'src/core/logger/logger.interface';

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REPOSITORY) private readonly repo: typeof User,
    @Inject(CACHE_MANAGER) private cacheService: Cache,
    private readonly logger: LoggerService,
  ) {}

  async create(email: string, password: string) {
    const user = this.repo.create({ email, password });
    try {
      const newUser = await this.repo.create<User>(user);
      this.logger.info(`new user created: ${newUser.email}`, 'UsersService', LogLevelEnum.INFO, 'users.service.ts', LogTypeEnum.SERVICE);
      return newUser;
    } catch (err) {
      this.logger.error(`Error creating user: ${err.message}`, 'UsersService', LogLevelEnum.ERROR, 'users.service.ts', LogTypeEnum.SERVICE);
      throw err;
    }
  }

  async findAll(email: string) {
    try {
      const users = await this.repo.findAll<User>({ where: { email } });
      this.logger.info(`Found ${users.length} user(s) with email: ${email}`, 'UsersService', LogLevelEnum.INFO, 'users.service.ts', LogTypeEnum.SERVICE);
      return users;
    } catch (err) {
      this.logger.error(`Error finding user: ${err.message}`, 'UsersService', LogLevelEnum.ERROR, 'users.service.ts', LogTypeEnum.SERVICE);
      throw err;
    }
  }

  async findOneByEmail(email: string) {
    try {
      const user = await this.repo.findOne<User>({ where: { email } });
      if (!user) {
        this.logger.warn(`user with email:${email} is not found!`, 'UsersService', LogLevelEnum.WARN, 'users.service.ts', LogTypeEnum.SERVICE);
        return null;
      }
      return user;
    } catch (err) {
      this.logger.error(`Error finding user: ${err.message}`, 'UsersService', LogLevelEnum.ERROR, 'users.service.ts', LogTypeEnum.SERVICE);
      throw err;
    }
  }

  async findOne(id: number) {
    try {
      const user = await this.repo.findByPk<User>(id);
      if (user) {
        this.logger.info(`user found: ${user.email}`, 'UsersService', LogLevelEnum.INFO, 'users.service.ts', LogTypeEnum.SERVICE);
      } else {
        this.logger.warn(`user with id:${id} is not found!`, 'UsersService', LogLevelEnum.WARN, 'users.service.ts', LogTypeEnum.SERVICE);
      }
      return user;
    } catch (err) {
      this.logger.error(`Error finding user: ${err.message}`, 'UsersService', LogLevelEnum.ERROR, 'users.service.ts', LogTypeEnum.SERVICE);
      throw err;
    }
  }

  async update(id: number, attrs: Partial<User>) {
    const user = await this.repo.findByPk<User>(id);
    if (!user) {
      this.logger.warn(`user with id:${id} is not found!`, 'UsersService', LogLevelEnum.WARN, 'users.service.ts', LogTypeEnum.SERVICE);
      throw new NotFoundException('user not found');
    }
    Object.assign(user, attrs);
    try {
      const updatedUser = await user.save();
      this.logger.info(`user updated: ${updatedUser.email}`, 'UsersService', LogLevelEnum.INFO, 'users.service.ts', LogTypeEnum.SERVICE);
      return updatedUser;
    } catch (err) {
      this.logger.error(`Error updating user: ${err.message}`, 'UsersService', LogLevelEnum.ERROR, 'users.service.ts', LogTypeEnum.SERVICE);
      throw err;
    }
  }

  async remove(id: number) {
    const user = await this.repo.findByPk<User>(id);
    if (!user) {
      this.logger.warn(`user with id:${id} is not found!`, 'UsersService', LogLevelEnum.WARN, 'users.service.ts', LogTypeEnum.SERVICE);
      throw new NotFoundException('user not found');
    }

    try {
      await this.repo.destroy({ where: { id } });
      this.logger.info(`User deleted: ${user.email}`, 'UsersService', LogLevelEnum.INFO, 'users.service.ts', LogTypeEnum.SERVICE);
    } catch (error) {
      this.logger.error(`Error deleting user: ${error.message}`, 'UsersService', LogLevelEnum.ERROR, 'users.service.ts', LogTypeEnum.SERVICE);
      throw error;
    }
  }
}
