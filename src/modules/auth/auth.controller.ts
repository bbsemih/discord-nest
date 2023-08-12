import { Controller, UseGuards, Post, Request, Body, HttpCode, Session } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { signupUserDTO } from './dto/signup-user.dto';
import { DoesUserExist } from 'src/core/guards/doesUserExist.guard';
import { UserDto } from '../user/dto/user.dto';

//session here???
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signout')
  @HttpCode(200)
  async signout(@Session() session: { userId: number; admin: boolean; userEmail: string }) {
    session.userId = null;
    session.admin = null;
    session.userEmail = null;
  }

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() req) {
    return await this.authService.login(req.user);
  }

  @UseGuards(DoesUserExist)
  @Post('signup')
  async signUp(@Body() user: signupUserDTO): Promise<{ user: UserDto; token: string }> {
    return await this.authService.signUp(user);
  }
}
