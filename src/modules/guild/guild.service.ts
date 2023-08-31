import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { GUILD_REPOSITORY } from '../constants';
import { Guild } from './guild.entity';
import { Cache } from 'cache-manager';
import { LoggerService } from '../../core/logger/logger.service';
import { CreateGuildDTO } from './dto/create-guild.dto';
import { LoggerBase } from '../../core/logger/logger.base';
import { User } from '../user/user.entity';
import { basename } from 'path';

@Injectable()
export class GuildService extends LoggerBase {
  constructor(
    @Inject(GUILD_REPOSITORY) private readonly repo: typeof Guild,
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

  async create(guild: CreateGuildDTO): Promise<Guild> {
    try {
      const newGuild = await this.repo.create<Guild>(guild);
      this.logInfo('Guild created:', newGuild.id);
      return newGuild;
    } catch (error) {
      this.logError('Error creating guild:', error);
      throw error;
    }
  }

  async findOne(id: string): Promise<Guild> {
    const cachedGuild = await this.cacheService.get<Guild>(id);
    if (cachedGuild) {
      this.logInfo('Guild found in cache:', id);
      return cachedGuild;
    }
    const guild = await this.repo.findOne<Guild>({ where: { id } });
    if (!guild) {
      this.logWarn('Guild not found. ID:', id);
      throw new NotFoundException('Guild not found');
    }
    return guild;
  }

  async findGuildsOfUser(ownerId: string): Promise<Guild[]> {
    try {
      const guilds = await this.repo.findAll<Guild>({ where: { ownerId: ownerId } });
      this.logInfo(`Found ${guilds.length} guild(s) with ownerId: ${ownerId}`, ownerId);
      return guilds;
    } catch (error) {
      this.logError('Error finding guilds:', error);
      throw error;
    }
  }

  async findUsersInGuild(guildId: string): Promise<User[]> {
    try {
      const guild = await this.repo.findOne<Guild>({ where: { id: guildId } });

      if (!guild) {
        throw new NotFoundException('Guild not found');
      }

      return guild.members;
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
      const updatedGuild = await guild.save();
      this.logInfo('Guild updated:', updatedGuild.id);
      return updatedGuild;
    } catch (err) {
      this.logError('Error updating guild:', err);
      throw err;
    }
  }
}
