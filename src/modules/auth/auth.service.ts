import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { signupUserDTO } from './dto/signup-user.dto';
import { loginUserDTO } from './dto/login-user.dto';
import { UserDto } from '../user/dto/user.dto';
import { LoggerService } from 'src/core/logger/logger.service';
import { LogLevelEnum, LogTypeEnum } from 'src/core/logger/logger.interface';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService, private readonly jwtService: JwtService, private readonly logger: LoggerService) {}

  private logInfo(message: string, id?: string) {
    this.logger.info(`${message} ${id}`, 'AuthService', LogLevelEnum.INFO, 'auth.service.ts', LogTypeEnum.SERVICE);
  }

  private logWarn(message: string, id?: string) {
    this.logger.warn(`${message} ${id}`, 'AuthService', LogLevelEnum.WARN, 'auth.service.ts', LogTypeEnum.SERVICE);
  }

  private logError(message: string, error: any) {
    this.logger.error(`${message} ${error.message}`, 'AuthService', LogLevelEnum.ERROR, 'auth.service.ts', LogTypeEnum.SERVICE);
  }

  async validateUser(username: string, pass: string) {
    const user = await this.userService.findOneByEmail(username);
    if (!user) return null;

    const match = await this.comparePassword(pass, user.password);
    if (!match) return null;

    const { password, ...result } = user['dataValues'];
    return result;
  }

  public async login(user: loginUserDTO) {
    const token = await this.generateToken(user);
    return { user, token };
  }

  public async signUp(user: signupUserDTO): Promise<{ user: UserDto; token: string }> {
    try {
      const userExists = await this.userService.findOneByEmail(user.email);
      if (userExists) {
        this.logWarn('User already exists', user.email);
        throw new Error('User already exists');
      }

      const hashedPassword = await this.hashPassword(user.password);
      const newUserWithoutId = { ...user, password: hashedPassword };
      const newUser = await this.userService.create(newUserWithoutId);

      this.logInfo('User signed up', newUser.id);

      const token = await this.generateToken(newUser);
      return { user: newUser, token };
    } catch (error) {
      this.logError('Error creating user:', error);
      throw error;
    }
  }

  private async generateToken(user) {
    const token = await this.jwtService.signAsync(user);
    return token;
  }

  private async hashPassword(password) {
    const hash = await bcrypt.hash(password, 10);
    return hash;
  }

  private async comparePassword(enteredPassword, dbPassword) {
    const match = await bcrypt.compare(enteredPassword, dbPassword);
    return match;
  }
}
