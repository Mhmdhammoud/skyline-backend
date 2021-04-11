import { Project } from './Project';
export interface ICreate {
  status: 'Success' | 'Failure';
  message: string;
  project: Project;
  requestTime: string;
}
export interface IError {
  status: 'Failure';
  message: string;
  error?: string;
  requestTime: string;
}
export interface IFindAll {
  status: 'Success';
  message: string;
  project: Project[];
  length: number;
  requestTime: string;
}
export interface IFindOne {
  status: 'Success';
  message: string;
  project: Project;
  requestTime: string;
}

export interface IUpdate {
  status: 'Success';
  message: 'Project was updated successfully';
  project: Project;
  requestTime: string;
}
export interface IDelete {
  status: 'Success';
  message: 'Project was deleted successfully';
  project: Project;
  requestTime: string;
}
export interface IAdd {
  status: 'Success';
  message: 'Image were added to project successfully';
  project: Project;
  requestTime: string;
}
export interface IRemove {
  status: 'Success';
  message: 'Image was removed from project successfully';
  project: Project;
  requestTime: string;
}
