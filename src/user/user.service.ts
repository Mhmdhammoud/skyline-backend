import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { S3 } from 'aws-sdk';

import {
  User,
  ICreate,
  IDelete,
  IError,
  IFindAll,
  IFindOne,
  IUpdate,
} from './models';
import keys from 'src/config/keys';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}
  async create(
    user: CreateUserDto,
    file: Express.Multer.File,
  ): Promise<ICreate | IError> {
    try {
      const checked = await this.userModel.findOne({
        $or: [
          {
            email: `${user.email}`,
          },
          {
            phone: `${user.phoneNumber}`,
          },
        ],
      });
      if (checked) {
        const errorResponse: IError = {
          status: 'Failure',
          message: 'Bad request',
          error: 'Email and phonenumber should be unique entities',
          user: null,
          requestTime: new Date().toISOString(),
        };
        return errorResponse;
      }
      const FORMATTED_FULL_NAME = user.fullName
        .split(' ')
        .map((val) => val.charAt(0).toUpperCase() + val.slice(1))
        .join(' ');
      const HASHED_PASSWORD = await bcrypt.hash(user.password, 10);

      const dir = `Skyline/users/${user.email}`;
      console.log(file);

      const params = {
        Bucket: keys.BUCKET_NAME,
        Key: `${dir}/${file.originalname}`,
        Body: file.buffer,
        ContentType: file.mimetype,
        ContentEncoding: file.encoding,
      };
      const s3 = new S3({
        accessKeyId: keys.AWS_ACESS_KEY_ID,
        secretAccessKey: keys.AWS_SECRET_ACCESS_KEY,
      });

      s3.upload(params, async (err, data) => {
        if (err) {
          console.log('error in upload user image file' + err);
        } else {
          const FORMATTED_USER = {
            ...user,
            title: FORMATTED_FULL_NAME,
            password: HASHED_PASSWORD,
            image: `users/${user.email}/${file.originalname}`,
          };
          const NEW_USER = new this.userModel(FORMATTED_USER);
          await NEW_USER.save();
          const response: ICreate = {
            status: 'Success',
            message: 'User was created successfully',
            user: NEW_USER,
            requestTime: new Date().toISOString(),
          };
          return response;
        }
      });
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

  async findAll(): Promise<IFindAll | IError> {
    try {
      const USERS = await this.userModel.find({});

      if (USERS.length === 0) {
        const errorResponse: IError = {
          status: 'Failure',
          message: 'Internal Server Error',
          error: 'There are no projects at the moment',
          requestTime: new Date().toISOString(),
        };
        throw new HttpException(errorResponse, HttpStatus.NOT_FOUND);
      }
      const response: IFindAll = {
        status: 'Success',
        message: 'All users were fetched successfully',
        users: USERS,
        length: USERS.length,
        requestTime: new Date().toISOString(),
      };
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

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<IUpdate | IError> {
    try {
      const USER = await this.userModel.findById(id);
      if (!USER) {
        const errorResponse: IError = {
          status: 'Failure',
          message: 'User was not found',
          requestTime: new Date().toISOString(),
        };
        throw new HttpException(errorResponse, HttpStatus.NOT_FOUND);
      }
      await this.userModel.findByIdAndUpdate(id, updateUserDto);
      const UPDATED_USER = await this.userModel.findById(id);
      const response: IUpdate = {
        status: 'Success',
        message: 'User was updated successfully',
        user: UPDATED_USER,
        requestTime: new Date().toISOString(),
      };
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

  async remove(id: string): Promise<IDelete | IError> {
    try {
      const USER = await this.userModel.findById(id);
      if (!USER) {
        const errorResponse: IError = {
          status: 'Failure',
          message: 'User was not found',
          requestTime: new Date().toISOString(),
        };
        throw new HttpException(errorResponse, HttpStatus.NOT_FOUND);
      }
      const DELETED = await this.userModel.findByIdAndDelete(id);
      if (!DELETED) {
        const errorResponse: IError = {
          status: 'Failure',
          message: 'Something went wrong while deleting',
          requestTime: new Date().toISOString(),
        };
        throw new HttpException(
          errorResponse,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      const response: IDelete = {
        status: 'Success',
        message: 'User was deleted successfully',
        user: null,
        requestTime: new Date().toISOString(),
      };
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
}
