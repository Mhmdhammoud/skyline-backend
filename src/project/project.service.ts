import {
  HttpCode,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import {
  Project,
  ICreate,
  IDelete,
  IError,
  IFindAll,
  IFindOne,
  IUpdate,
} from './models';

@Injectable()
export class ProjectService {
  constructor(
    @InjectModel('Project') private readonly projectModel: Model<Project>,
  ) {}

  async create(project: CreateProjectDto): Promise<ICreate | IError> {
    try {
      const FORMATTED_TITLE = project.title
        .split(' ')
        .map((val) => val.charAt(0).toUpperCase() + val.slice(1))
        .join(' ');
      const FORMATTED_PROJECT = {
        ...project,
        title: FORMATTED_TITLE,
      };
      const NEW_PROJECT = new this.projectModel(FORMATTED_PROJECT);
      const response: ICreate = {
        status: 'Success',
        message: 'Project was created successfully',
        project: NEW_PROJECT,
        requestTime: new Date().toISOString(),
      };
      await NEW_PROJECT.save();
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

  async findAll(): Promise<IFindAll | IError> {
    try {
      const PROJECTS = await this.projectModel.find({});

      if (PROJECTS.length === 0) {
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
        message: 'All Projects were fetched successfully',
        project: PROJECTS,
        length: PROJECTS.length,
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
  async findByID(id: string): Promise<IFindOne | IError> {
    try {
      const PROJECT = await this.projectModel.findById(id);
      if (!PROJECT) {
        const errorResponse: IError = {
          status: 'Failure',
          message: 'Project was not found',
          requestTime: new Date().toISOString(),
        };
        throw new HttpException(errorResponse, HttpStatus.NOT_FOUND);
      }
      const response: IFindOne = {
        status: 'Success',
        message: 'Project was fetched by ID successfully',
        project: PROJECT,
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
  async findByTitle(title: string): Promise<IFindOne | IError> {
    try {
      const PROJECT = await this.projectModel.findOne({ title: title });
      if (!PROJECT) {
        const errorResponse: IError = {
          status: 'Failure',
          message: 'Project was not found',
          requestTime: new Date().toISOString(),
        };
        throw new HttpException(errorResponse, HttpStatus.NOT_FOUND);
      }
      const response: IFindOne = {
        status: 'Success',
        message: 'Project was fetched by title successfully',
        project: PROJECT,
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
  async update(
    id: string,
    updateProjectDto: UpdateProjectDto,
  ): Promise<IUpdate | IError> {
    try {
      const PROJECT = await this.projectModel.findById(id);
      if (!PROJECT) {
        const errorResponse: IError = {
          status: 'Failure',
          message: 'Project was not found',
          requestTime: new Date().toISOString(),
        };
        throw new HttpException(errorResponse, HttpStatus.NOT_FOUND);
      }
      const UPDATED_PROJECT = await this.projectModel.findByIdAndUpdate(
        id,
        updateProjectDto,
      );
      const response: IUpdate = {
        status: 'Success',
        message: 'Project was updated successfully',
        project: UPDATED_PROJECT,
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
      const PROJECT = await this.projectModel.findById(id);
      if (!PROJECT) {
        const errorResponse: IError = {
          status: 'Failure',
          message: 'Project was not found',
          requestTime: new Date().toISOString(),
        };
        throw new HttpException(errorResponse, HttpStatus.NOT_FOUND);
      }
      const DELETED = await this.projectModel.findByIdAndDelete(id);
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
        message: 'Project was deleted successfully',
        project: DELETED,
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
