import { CreateGuildDTO } from './dto/create-guild.dto';
import { Controller, Get, Post, UseInterceptors, Param, Delete, Inject, Patch, Body } from '@nestjs/common';
import { GuildService } from './guild.service';
import { Guild } from './guild.entity';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import { ApiOperation, ApiTags, ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

@Controller('guild')
@ApiTags('guild')
export class GuildController {
  constructor(private readonly guildService: GuildService) {}

  @Post()
  @ApiPropertyOptional({
    description: 'The age of a cat',
    minimum: 1,
    default: 1,
  })
  createGuild(@Body() createGuildDTO: CreateGuildDTO): Promise<Guild> {
    return this.guildService.create(createGuildDTO);
  }

  @UseInterceptors(CacheInterceptor)
  @CacheTTL(30)
  @Get('/:id')
  findGuildById(@Param('id') id: string): Promise<Guild> {
    return this.guildService.findOne(id);
  }

  @Get()
  findAllGuilds(ownerId: string): Promise<Guild[]> {
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
