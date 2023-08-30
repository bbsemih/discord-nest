import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { User } from './user.entity';
import { USER_REPOSITORY } from '../constants';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { LoggerService } from '../../core/logger/logger.service';
import { Cache } from 'cache-manager';
import { UserDto } from './dto/user.dto';
import { LoggerBase } from '../../core/logger/logger.base';
import { basename } from 'path';

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
      this.logError('Error creating user:', err);
      throw err;
    }
  }

  //@Httpmethod?? to get method in log??
  async findOne(username: string) {
    const cachedUser = await this.cacheService.get<User>(username);
    if (cachedUser) {
      this.logInfo(`user found in cache: ${cachedUser.email}`, cachedUser.id);
      return cachedUser;
    }
    try {
      const user = await this.repo.findOne<User>({ where: { username } });
      if (user) {
        await this.cacheService.set(username, user, 100000);
        this.logInfo(`user found: ${user.email}`, `id: ${user.id}`);
      } else {
        this.logWarn(`user with email:${username} is not found!`, user.id);
      }
      return user;
    } catch (err) {
      this.logError(`Error finding user: ${err.message}`, err);
      throw err;
    }
  }

  async findById(id: string) {
    const cachedUser = await this.cacheService.get<User>(id);
    if (cachedUser) {
      this.logInfo(`user found in cache: ${cachedUser.email}`, cachedUser.id);
      return cachedUser;
    }
    try {
      const user = await this.repo.findOne<User>({ where: { id } });
      if (user) {
        await this.cacheService.set(id, user, 100000);
        this.logInfo(`user found: ${user.email}`, `id: ${user.id}`);
      } else {
        this.logWarn(`user with id:${id} is not found!`, id);
      }
      return user;
    } catch (err) {
      this.logError(`Error finding user: ${err.message}`, err);
      throw err;
    }
  }

  //findAll from where???
  async findAll() {
    try {
      const users = await this.repo.findAll<User>();
      this.logInfo(`number of users found: ${users.length}`);
      return users;
    } catch (err) {
      this.logError(`Error finding users: ${err.message}`, err);
      throw err;
    }
  }

  async update(id: string, attrs: Partial<User>) {
    const user = await this.repo.findOne<User>({ where: { id } });
    if (!user) {
      this.logWarn(`user with id:${id} is not found!`, id);
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

  async remove(username: string) {
    const user = await this.repo.findOne<User>({ where: { username } });
    if (!user) {
      this.logWarn(`user with username:${username} is not found!`, user.id);
      throw new NotFoundException('user not found');
    }

    try {
      await user.destroy();
      this.logInfo(`user deleted: ${user.username}`, user.id);
    } catch (error) {
      this.logError(`Error deleting user: ${error.message}`, error);
      throw error;
    }
  }
}
