import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
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

  @Post('login')
  async login(@Body() payload: Payload): Promise<ILogin | IUnAuth | IError> {
    return this.authService.login(payload);
  }
  @Post('register')
  @UseInterceptors(FileInterceptor('image'))
  async register(
    @Body() userDto: CreateUserDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const user = await this.userService.create(userDto, file);
    const {
      user: { email },
    } = user;

    return this.authService.login({ email, password: userDto.password });
  }
}
