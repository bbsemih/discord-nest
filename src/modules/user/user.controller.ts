import { Controller, Get, Post, UseInterceptors, Param, Query, Delete, Inject, Patch, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './user.entity';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/whoami')
  whoami(@CurrentUser() user: User): User {
    return user;
  }

  //@UseInterceptors(CacheInterceptor)
  //@CacheTTL(30)
  @Get('/:id')
  async findUserById(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Get('/:username')
  async findUserByUsername(@Param('username') username: string) {
    return this.userService.findOneByUsername(username);
  }

  @Delete('/:id')
  removeUser(@Param('id') id: string) {
    return this.userService.remove(id);
  }

  @Patch('/:id')
  updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.userService.update(id, body);
  }
}
