export interface TOKEN_PAYLOAD {
  email: string;
  _id: string;
  fullName: string;
  image: string;
  phoneNumber: number;
}
export interface ILogin {
  status: 'Success';
  message: string;
  user: {
    _id: string;
    fullName: string;
    email: string;
    phoneNumber: number;
    image: string;
  };
  token: string;
  requestTime: string;
}
export interface IError {
  status: 'Failure';
  message: string;
  error: string;
  requestTime: string;
}
export interface IUnAuth {
  status: 'Failure';
  message: string;
  user: null;
  token: null;
  requestTime: string;
}
