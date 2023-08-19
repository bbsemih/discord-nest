import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { User } from './user.entity';
import { USER_REPOSITORY } from '../constants';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { LoggerService } from 'src/core/logger/logger.service';
import { Cache } from 'cache-manager';
import { UserDto } from './dto/user.dto';
import { LoggerBase } from 'src/core/logger/logger.base';
import { basename } from 'path';
import { HttpMethod } from 'src/decorators/http-method.decorator';

@Injectable()
export class UserService extends LoggerBase {
  constructor(
    @Inject(USER_REPOSITORY) private readonly repo: typeof User,
    @Inject(CACHE_MANAGER) private cacheService: Cache,
    protected readonly logger: LoggerService,
  ) {
    super(logger);
  }

  protected getServiceName(): string {
    return this.constructor.name;
  }

  protected getFileName(): string {
    return basename(__filename);
  }

  async create(user: UserDto): Promise<User> {
    try {
      const newUser = await this.repo.create<User>(user);
      this.logInfo('User created:', newUser.id);
      return newUser;
    } catch (err) {
      this.logError('Error creating user:', 'POST', err);
      throw err;
    }
  }

  async findAll(email: string) {
    try {
      const users = await this.repo.findAll<User>({ where: { email } });
      this.logInfo(`Found ${users.length} user(s) with email: ${email}`, 'GET');
      return users;
    } catch (err) {
      this.logError(`Error finding users: ${err.message}`, 'GET', err);
      throw err;
    }
  }

  async findOne(username: string, @HttpMethod() httpMethod?: string) {
    const cachedUser = await this.cacheService.get<User>(username);
    if (cachedUser) {
      this.logInfo(`user found in cache: ${cachedUser.email}`, httpMethod, cachedUser.id);
      return cachedUser;
    }
    try {
      const user = await this.repo.findOne<User>({ where: { username } });
      if (user) {
        await this.cacheService.set(username, user, 100000);
        this.logInfo(`user found: ${user.email}`, `id: ${user.id}`);
      } else {
        this.logWarn(`user with email:${username} is not found!`, httpMethod, 3);
      }
      return user;
    } catch (err) {
      this.logError(`Error finding user: ${err.message}`, 'GET', err);
      throw err;
    }
  }

  async update(id: string, attrs: Partial<User>) {
    const user = await this.repo.findByPk<User>(id);
    if (!user) {
      this.logWarn(`user with id:${id} is not found!`, 'PATCH');
      throw new NotFoundException('user not found');
    }
    Object.assign(user, attrs);
    try {
      const updatedUser = await user.save();
      this.logInfo(`user updated: ${updatedUser.email}`, updatedUser.id);
      return updatedUser;
    } catch (err) {
      this.logError(`Error updating user: ${err.message}`, 'PATCH', err);
      throw err;
    }
  }

  async remove(username: string) {
    const user = await this.repo.findOne<User>({ where: { username } });
    if (!user) {
      this.logWarn(`user with username:${username} is not found!`, 'GET');
      throw new NotFoundException('user not found');
    }

    try {
      await user.destroy();
      this.logInfo(`user deleted: ${user.username}`, user.id);
    } catch (error) {
      this.logError(`Error deleting user: ${error.message}`, 'DELETE', error);
      throw error;
    }
  }
}
