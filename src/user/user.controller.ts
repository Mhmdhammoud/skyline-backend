import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ICreate, IError, IFindAll, IUpdate, IDelete } from './models';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/create')
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @Body() createUserDto: CreateUserDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<ICreate | IError> {
    return await this.userService.create(createUserDto, file);
  }
  @Get('/getAll')
  @UseGuards(AuthGuard('jwt'))
  async findAll(): Promise<IFindAll | IError> {
    return await this.userService.findAll();
  }

  @Get('/findByEmail')
  findOne(@Query('email') email: string) {
    return this.userService.findOneByEmail(email);
  }

  @Patch('/updateByID')
  @UseGuards(AuthGuard('jwt'))
  async update(
    @Query('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<IUpdate | IError> {
    return await this.userService.update(id, updateUserDto);
  }

  @Delete('/deleteByID')
  @UseGuards(AuthGuard('jwt'))
  async remove(@Query('id') id: string): Promise<IDelete | IError> {
    return await this.userService.remove(id);
  }
}
