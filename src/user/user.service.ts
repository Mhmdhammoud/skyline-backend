import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import {
  User,
  ICreate,
  IDelete,
  IError,
  IFindAll,
  IFindOne,
  IUpdate,
} from './models';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}
  async create(user: CreateUserDto): Promise<ICreate | IError> {
    try {
      const FORMATTED_FULL_NAME = user.fullName
        .split(' ')
        .map((val) => val.charAt(0).toUpperCase() + val.slice(1))
        .join(' ');
      const HASHED_PASSWORD = await bcrypt.hash(user.password, 10);
      const FORMATTED_USER = {
        ...user,
        title: FORMATTED_FULL_NAME,
        password: HASHED_PASSWORD,
      };
      const NEW_USER = new this.userModel(FORMATTED_USER);
      const response: ICreate = {
        status: 'Success',
        message: 'User was created successfully',
        user: NEW_USER,
        requestTime: new Date().toISOString(),
      };
      await NEW_USER.save();
      return response;
    } catch (error) {
      const errorResponse: IError = {
        status: 'Failure',
        message: 'Internal Server Error',
        error: error.message,
        user: null,
        requestTime: new Date().toISOString(),
      };
      return errorResponse;
    }
  }

  async findAll() {
    return `This action returns all user`;
  }

  async findOneByEmail(email: string): Promise<IFindOne | IError> {
    try {
      const USER = await this.userModel.findOne({ email });
      if (!USER) {
        const errorResponse: IError = {
          status: 'Failure',
          message: 'User was not found',
          user: null,
          requestTime: new Date().toISOString(),
        };
        throw new HttpException(errorResponse, HttpStatus.NOT_FOUND);
      }
      const response: IFindOne = {
        status: 'Success',
        message: 'User was fetched by email successfully',
        user: USER,
        requestTime: new Date().toISOString(),
      };
      return response;
    } catch (error) {
      const errorResponse: IError = {
        status: 'Failure',
        message: 'Internal Server Error',
        error: error.message,
        user: null,
        requestTime: new Date().toISOString(),
      };
      return errorResponse;
    }
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
