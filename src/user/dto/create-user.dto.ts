export class CreateUserDto {
  readonly fullName?: string;
  readonly password: string;
  readonly email: string;
  readonly phoneNumber?: number;
  readonly image?: string;
}
