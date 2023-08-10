import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { User } from './user.entity';
import { USER_REPOSITORY } from '../contants';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class UserService {
  constructor(@Inject(USER_REPOSITORY) private readonly repo: typeof User, @Inject(CACHE_MANAGER) private cacheService: Cache) {}

  async create(email: string, password: string) {
    const user = this.repo.create({ email, password });
    try {
      const newUser = await this.repo.create<User>(user);
      //this.logger.info(`new user created: ${newUser.email}`, 'UsersService', LogLevelEnum.INFO, 'users.service.ts', LogTypeEnum.SERVICE);
      return newUser;
    } catch (err) {
      //this.logger.error(`Error creating user: ${err.message}`, 'UsersService', LogLevelEnum.ERROR, 'users.service.ts', LogTypeEnum.SERVICE);
      throw err;
    }
  }

  async findOneByEmail(email: string) {
    try {
      const user = await this.repo.findOne({ where: { email } });
      if (!user) {
        //this.logger.warn(`user with email:${email} is not found!`, 'UsersService', LogLevelEnum.WARN, 'users.service.ts', LogTypeEnum.SERVICE);
        return null;
      }
      return user;
    } catch (err) {
      //this.logger.error(`Error finding user: ${err.message}`, 'UsersService', LogLevelEnum.ERROR, 'users.service.ts', LogTypeEnum.SERVICE);
      throw err;
    }
  }

  async findOne(id: number) {
    try {
      const user = await this.repo.findByPk<User>(id);
      if (user) {
        //this.logger.info(`user found: ${user.email}`, 'UsersService', LogLevelEnum.INFO, 'users.service.ts', LogTypeEnum.SERVICE);
      } else {
        //this.logger.warn(`user with id:${id} is not found!`, 'UsersService', LogLevelEnum.WARN, 'users.service.ts', LogTypeEnum.SERVICE);
      }
      return user;
    } catch (err) {
      //this.logger.error(`Error finding user: ${err.message}`, 'UsersService', LogLevelEnum.ERROR, 'users.service.ts', LogTypeEnum.SERVICE);
      throw err;
    }
  }

  async findByEmail(email: string) {
    if (!email) return null;

    try {
      const user = await this.repo.findOne<User>({ where: { email } });
      if (!user) {
        //logger here!
        return null;
      }
    } catch (error) {
      //logger here
      throw error;
    }
  }

  async update(id: number, attrs: Partial<User>) {
    try {
      const user = await this.repo.findByPk<User>(id);
      if (!user) {
        //this.logger.warn(`user with id:${id} is not found!`, 'UsersService', LogLevelEnum.WARN, 'users.service.ts', LogTypeEnum.SERVICE);
        throw new NotFoundException('user not found');
      }

      const updatedUser = await user.update(attrs);
      //this.logger.info(`User updated: ${updatedUser.email}`, 'UsersService', LogLevelEnum.INFO, 'users.service.ts', LogTypeEnum.SERVICE);
      return updatedUser;
    } catch (error) {
      //this.logger.error(`Error updating user: ${error.message}`, 'UsersService', LogLevelEnum.ERROR, 'users.service.ts', LogTypeEnum.SERVICE);
      throw error;
    }
  }

  async remove(id: number) {
    const user = await this.repo.findByPk<User>(id);
    if (!user) {
      //this.logger.warn(`user with id:${id} is not found!`, 'UsersService', LogLevelEnum.WARN, 'users.service.ts', LogTypeEnum.SERVICE);
      throw new NotFoundException('user not found');
    }

    try {
      await this.repo.destroy({ where: { id } });
      //this.logger.info(`User deleted: ${user.email}`, 'UsersService', LogLevelEnum.INFO, 'users.service.ts', LogTypeEnum.SERVICE);
    } catch (error) {
      //this.logger.error(`Error deleting user: ${error.message}`, 'UsersService', LogLevelEnum.ERROR, 'users.service.ts', LogTypeEnum.SERVICE);
      throw error;
    }
  }
}
