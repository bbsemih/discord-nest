import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { User } from './user.entity';
import { USER_REPOSITORY } from '../constants';
import { LoggerService } from '../../core/logger/logger.service';
import { UserDto } from './dto/user.dto';
import { LoggerBase } from '../../core/logger/logger.base';
import { basename } from 'path';
import { RedisService } from '../../core/redis/redis.service';

@Injectable()
export class UserService extends LoggerBase {
  constructor(@Inject(USER_REPOSITORY) private readonly repo: typeof User, private readonly redis: RedisService, protected readonly logger: LoggerService) {
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
      await this.redis.set(newUser.username, newUser, { ttl: 100000 });
      await this.redis.publish('userCreated', JSON.stringify(newUser));
      return newUser;
    } catch (err) {
      this.logError('Error creating user:', err);
      throw err;
    }
  }

  async findOne(username: string) {
    const cachedUser = await this.redis.get<User>(username);
    if (cachedUser) {
      this.logInfo(`user found in cache: ${cachedUser.email}`, cachedUser.id);
      return cachedUser;
    }
    try {
      const user = await this.repo.findOne<User>({ where: { username } });
      if (user) {
        await this.redis.set(username, user, { ttl: 100000 });
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
    const cachedUser = await this.redis.get<User>(id);
    if (cachedUser) {
      this.logInfo(`user found in cache: ${cachedUser.email}`, cachedUser.id);
      return cachedUser;
    }
    try {
      const user = await this.repo.findOne<User>({ where: { id } });
      if (user) {
        await this.redis.set(id, user, { ttl: 100000 });
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

  async findAll() {
    try {
      const cacheKey = 'findAllUsers';
      const cachedUsers = await this.redis.get<User[]>(cacheKey);

      if (cachedUsers) {
        this.logInfo(`Number of users found in cache: ${cachedUsers.length}`);
        return cachedUsers;
      }

      const users = await this.repo.findAll<User>();
      this.logInfo(`Number of users found: ${users.length}`);

      await this.redis.set(cacheKey, users, { ttl: 3600 });

      return users;
    } catch (err) {
      this.logError(`Error finding users: ${err.message}`, err);
      throw err;
    }
  }

  async update(id: string, attrs: Partial<User>) {
    let user;
    const cachedUser = await this.redis.get<User>(id);
    if (cachedUser) {
      user = cachedUser;
    } else {
      user = await this.repo.findOne<User>({ where: { id } });
    }
    if (!user) {
      this.logWarn(`User with id:${id} is not found!`, id);
      throw new NotFoundException('User not found');
    }
    Object.assign(user, attrs);
    await this.redis.set(id, user, { ttl: 100000 });
    try {
      const cacheKey = `findUserById:${id}`;
      await this.redis.del(cacheKey);

      const updatedUser = await user.save();
      this.logInfo(`User updated: ${updatedUser.email}`, updatedUser.id);
      return updatedUser;
    } catch (err) {
      this.logError(`Error updating user: ${err.message}`, err);
      throw err;
    }
  }

  async remove(username: string) {
    const cachedUser = await this.redis.get<User>(username);
    if (cachedUser) {
      await this.redis.del(username);
    } else {
      const user = await this.repo.findOne<User>({ where: { username } });
      if (!user) {
        this.logWarn(`user with username:${username} is not found!`, user.id);
        throw new NotFoundException('user not found');
      }

      try {
        await user.destroy();
        await this.redis.publish('userDeleted', JSON.stringify(user));
      } catch (err) {
        this.logError(`Error deleting user: ${err.message}`, err);
        throw err;
      }
    }
  }

  async getTotalUserCount() {
    try {
      const totalUsers = await this.repo.count();
      this.logInfo('Total users:', totalUsers);
      return totalUsers;
    } catch (error) {
      this.logError('Error gathering user stats:', error);
      throw error;
    }
  }
}
