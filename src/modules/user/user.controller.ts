import { Controller, Get, UseInterceptors, Param, Delete, Patch, Body, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './user.entity';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import { ApiTags } from '@nestjs/swagger';
import { SkipThrottle, Throttle } from '@nestjs/throttler';
import { signupUserDTO } from '../auth/dto/signup-user.dto';

@SkipThrottle()
@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/whoami')
  whoami(@CurrentUser() user: User): User {
    return user;
  }

  @UseInterceptors(CacheInterceptor)
  @CacheTTL(30)
  @Throttle(8, 60) //overriding global throttle. 10 requets per second
  @Get('/:username')
  async findOne(@Param('username') username: string) {
    return this.userService.findOne(username);
  }

  @Throttle(10, 60)
  @Delete('/:username')
  removeUser(@Param('username') username: string) {
    return this.userService.remove(username);
  }

  @Post()
  createUser(@Body() body: signupUserDTO) {
    return this.userService.create(body);
  }

  @Throttle(3, 60)
  @Patch('/:username')
  updateUser(@Param('username') username: string, @Body() body: UpdateUserDto) {
    return this.userService.update(username, body);
  }
}
