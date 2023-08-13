import { CreateGuildDTO } from './dto/create-guild.dto';
import { Controller, Get, Post, UseInterceptors, Param, Delete, Patch, Body } from '@nestjs/common';
import { GuildService } from './guild.service';
import { Guild } from './guild.entity';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import { ApiTags } from '@nestjs/swagger';
import { User } from '../user/user.entity';

@Controller('guild')
@ApiTags('guild')
export class GuildController {
  constructor(private readonly guildService: GuildService) {}

  @Post()
  createGuild(@Body() createGuildDTO: CreateGuildDTO): Promise<Guild> {
    return this.guildService.create(createGuildDTO);
  }

  @UseInterceptors(CacheInterceptor)
  @CacheTTL(30)
  @Get('/:id')
  findGuildById(@Param('id') id: string): Promise<Guild> {
    return this.guildService.findOne(id);
  }

  @Get('/:id/users')
  async findUsersInGuild(@Param('id') guildId: string): Promise<User[]> {
    return this.guildService.findUsersInGuild(guildId);
  }

  @Get()
  findAllGuilds(): Promise<Guild[]> {
    // might need to get ownerId from the authenticated user
    const ownerId = 'user_id_here'; // Replace with the actual ownerId
    return this.guildService.findAll(ownerId);
  }

  @Delete('/:id')
  removeGuild(@Param('id') id: string) {
    return this.guildService.remove(id);
  }

  @Patch('/:id')
  updateGuild(@Param('id') id: string, @Body() body: Partial<Guild>): Promise<Guild> {
    return this.guildService.update(id, body);
  }
}
