import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { TOKEN_PAYLOAD, ILogin, IError, IUnAuth } from './models';
interface Payload {
  email: string;
  password: string;
}

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}
  async signPayload(payload: TOKEN_PAYLOAD): Promise<string> {
    return await this.jwtService.signAsync(payload);
  }
  async validateUser(payload: Payload): Promise<TOKEN_PAYLOAD | null> {
    const response = await this.usersService.findOneByEmail(payload.email);
    const {
      user: {
        fullName: USER_NAME,
        id: USER_ID,
        email: USER_EMAIL,
        password: HASHED_PASSWORD,
        image: USER_IMAGE,
        phoneNumber: USER_PHONE,
      },
    } = response;
    const VERIFY = await bcrypt.compare(HASHED_PASSWORD, payload.password);
    if (VERIFY) {
      const user: TOKEN_PAYLOAD = {
        email: USER_EMAIL,
        _id: USER_ID,
        fullName: USER_NAME,
        image: USER_IMAGE,
        phoneNumber: USER_PHONE,
      };
      return user;
    }
    return null;
  }
  async login(payload: Payload): Promise<ILogin | IUnAuth | IError> {
    try {
      const response = await this.usersService.findOneByEmail(payload.email);
      const {
        user: {
          phoneNumber,
          image,
          _id,
          fullName,
          email,
          password: HASHED_PASSWORD,
        },
      } = response;
      const VERIFY = await bcrypt.compare(payload.password, HASHED_PASSWORD);
      if (VERIFY) {
        const tokenPayload: TOKEN_PAYLOAD = {
          email,
          _id,
          fullName,
          image,
          phoneNumber,
        };
        const token = await this.signPayload(tokenPayload);
        const response: ILogin = {
          status: 'Success',
          message: 'Login was processed Successfully',
          user: {
            _id,
            fullName,
            email,
            phoneNumber,
            image,
          },
          token,
          requestTime: new Date().toISOString(),
        };
        return response;
      } else {
        const unAuthResponse: IUnAuth = {
          status: 'Failure',
          message: 'UnAuthorized',
          user: null,
          token: null,
          requestTime: new Date().toISOString(),
        };
        return unAuthResponse;
      }
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
