import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { IError } from 'src/project/models';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { ILogin, IUnAuth } from './models';

interface Payload {
  email: string;
  password: string;
}
@Controller('auth')
export class AuthController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
  ) {}

  @Get('/test')
  @UseGuards(AuthGuard('jwt'))
  tempAuth() {
    return { auth: 'works' };
  }

  @Post('login')
  async login(@Body() payload: Payload): Promise<ILogin | IUnAuth | IError> {
    return this.authService.login(payload);
  }
  @Post('register')
  async register(@Body() userDto: CreateUserDto) {
    const user = await this.userService.create(userDto);
    const {
      user: { email },
    } = user;

    return this.authService.login({ email, password: userDto.password });
  }
}
