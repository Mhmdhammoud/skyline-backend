import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  readonly fullName?: string;
  readonly phoneNumber?: number;
  readonly image?: string;
}
