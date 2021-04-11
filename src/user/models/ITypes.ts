import { User } from './User';

export interface ICreate {
  status: 'Success' | 'Failure';
  message: string;
  user: User;
  requestTime: string;
}
export interface IError {
  status: 'Failure';
  message: string;
  error?: string;
  user: null;
  requestTime: string;
}
export interface IFindAll {
  status: 'Success';
  message: string;
  user: User[];
  length: number;
  requestTime: string;
}
export interface IFindOne {
  status: 'Success';
  message: string;
  user: User;
  requestTime: string;
}

export interface IUpdate {
  status: 'Success';
  message: 'User was updated successfully';
  user: User;
  requestTime: string;
}
export interface IDelete {
  status: 'Success';
  message: 'User was deleted successfully';
  user: User;
  requestTime: string;
}
