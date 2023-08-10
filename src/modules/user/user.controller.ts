import { Controller, Get, Post, UseInterceptors, Param, Query, Delete, Inject } from '@nestjs/common';
import { UserService } from './user.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from './user.entity';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/whoami')
  whoami(@CurrentUser() user: User): User {
    return user;
  }

  @Get()
  async findAllUsers() {}

  @UseInterceptors(CacheInterceptor)
  @CacheTTL(30)
  @Get('/:id')
  async findUserById(@Param('id') id: string) {
    return this.userService.findOne(parseInt(id));
  }

  @Delete('/:id')
  removeUser(@Param('id') id: string) {
    return this.userService.remove(parseInt(id));
  }
}
