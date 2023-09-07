import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { GUILD_REPOSITORY } from '../constants';
import { Guild } from './guild.entity';
import { LoggerService } from '../../core/logger/logger.service';
import { CreateGuildDTO } from './dto/create-guild.dto';
import { LoggerBase } from '../../core/logger/logger.base';
import { User } from '../user/user.entity';
import { basename } from 'path';
import { RedisService } from 'src/core/redis/redis.service';

@Injectable()
export class GuildService extends LoggerBase {
  constructor(@Inject(GUILD_REPOSITORY) private readonly repo: typeof Guild, protected readonly logger: LoggerService, private readonly redis: RedisService) {
    super(logger);
  }

  protected getServiceName(): string {
    return this.constructor.name;
  }

  protected getFileName(): string {
    return basename(__filename);
  }

  async create(guild: CreateGuildDTO): Promise<Guild> {
    try {
      const newGuild = await this.repo.create<Guild>(guild);
      this.logInfo('Guild created:', newGuild.id);
      await this.redis.set(newGuild.id.toString(), newGuild, { ttl: 100000 });
      return newGuild;
    } catch (error) {
      this.logError('Error creating guild:', error);
      throw error;
    }
  }

  async findOne(id: string): Promise<Guild> {
    const cachedGuild = await this.redis.get<Guild>(id);
    if (cachedGuild) {
      return cachedGuild;
    }
    const guild = await this.repo.findOne<Guild>({ where: { id } });
    if (!guild) {
      this.logWarn('Guild not found. ID:', id);
      throw new NotFoundException('Guild not found');
    }
    await this.redis.set(guild.id.toString(), guild, { ttl: 100000 });
    return guild;
  }

  async findGuildsOfUser(ownerId: string): Promise<Guild[]> {
    const cacheKey = `findGuildsOfUser:${ownerId}`;
    const cachedGuilds = await this.redis.get<Guild[]>(cacheKey);
    if (cachedGuilds) {
      return cachedGuilds;
    }
    try {
      const guilds = await this.repo.findAll<Guild>({ where: { ownerId: ownerId } });
      this.logInfo(`Found ${guilds.length} guild(s) with ownerId: ${ownerId}`, ownerId);
      await this.redis.set(cacheKey, guilds, { ttl: 3600 });
      return guilds;
    } catch (error) {
      this.logError('Error finding guilds:', error);
      throw error;
    }
  }

  async findUsersInGuild(guildId: string): Promise<User[]> {
    const cacheKey = `findUsersInGuild:${guildId}`;
    const cachedUsers = await this.redis.get<User[]>(cacheKey);

    if (cachedUsers) {
      return cachedUsers;
    }

    try {
      const guild = await this.repo.findOne<Guild>({ where: { id: guildId } });

      if (!guild) {
        throw new NotFoundException('Guild not found');
      }
      const users = guild.members;
      await this.redis.set(cacheKey, users, { ttl: 3600 });

      return users;
    } catch (error) {
      this.logError('Error finding users in guild:', error);
      throw error;
    }
  }

  async remove(id: string) {
    const guild = await this.repo.findOne<Guild>({ where: { id } });
    if (!guild) {
      this.logWarn('Guild not found:', id);
      throw new NotFoundException('Guild not found');
    }

    try {
      const cacheKey = `findGuildById:${id}`;
      await this.redis.del(cacheKey);

      await guild.destroy();
      this.logInfo('Guild deleted:', guild.id);
    } catch (error) {
      this.logError('Error deleting guild:', error);
      throw error;
    }
  }

  async update(id: string, attrs: Partial<Guild>): Promise<Guild> {
    const guild = await this.repo.findByPk<Guild>(id);
    if (!guild) {
      this.logWarn('Guild not found:', id);
      throw new NotFoundException('Guild not found');
    }
    Object.assign(guild, attrs);
    try {
      const cacheKey = `findGuildById:${id}`;
      await this.redis.del(cacheKey);

      const updatedGuild = await guild.save();
      this.logInfo('Guild updated:', updatedGuild.id);
      return updatedGuild;
    } catch (err) {
      this.logError('Error updating guild:', err);
      throw err;
    }
  }

  async getTotalGuildCount(): Promise<number> {
    try {
      const totalGuilds = await this.repo.count();
      return totalGuilds;
    } catch (error) {
      this.logError('Error getting total guild count:', error);
      throw error;
    }
  }

  async getMostActiveGuilds(): Promise<Guild[]> {
    try {
      const mostActiveGuilds = await this.repo.findAll({
        order: [['messageCount', 'DESC']],
        limit: 10,
      });
      return mostActiveGuilds;
    } catch (error) {
      this.logError('Error getting most active guilds:', error);
      throw error;
    }
  }
}
