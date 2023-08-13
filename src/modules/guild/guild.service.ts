import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { GUILD_REPOSITORY } from '../constants';
import { Guild } from './guild.entity';
import { Cache } from 'cache-manager';
import { LoggerService } from 'src/core/logger/logger.service';
import { CreateGuildDTO } from './dto/create-guild.dto';
import { UserService } from '../user/user.service';
import { LoggerBase } from 'src/core/logger/logger.base';

@Injectable()
export class GuildService extends LoggerBase {
  constructor(
    private readonly userService: UserService,
    @Inject(GUILD_REPOSITORY) private readonly repo: typeof Guild,
    @Inject(CACHE_MANAGER) private cacheService: Cache,
    protected readonly logger: LoggerService,
  ) {
    super(logger);
  }

  protected getServiceName(): string {
    return 'GuildService';
  }

  protected getFileName(): string {
    return __filename;
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
    const guild = await this.repo.findByPk<Guild>(id);
    if (!guild) {
      this.logWarn('Guild not found:', id);
      throw new NotFoundException('Guild not found');
    }
    return guild;
  }

  async findAll(ownerId: string): Promise<Guild[]> {
    try {
      const guilds = await this.repo.findAll<Guild>({ where: { ownerId } });
      //this.logInfo(`Found ${guilds.length} guild(s) with ownerId: ${ownerId}`, ownerId);
      return guilds;
    } catch (error) {
      this.logError('Error finding guilds:', error);
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    const guild = await this.repo.findByPk<Guild>(id);
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
