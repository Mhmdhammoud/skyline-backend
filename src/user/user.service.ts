import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
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
  async create(user: CreateUserDto) {
    try {
      const NEW_USER = new this.userModel(user);
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
        requestTime: new Date().toISOString(),
      };
      return errorResponse;
    }
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
