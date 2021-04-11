import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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
  IAdd,
  IRemove,
} from './models';
import { S3 } from 'aws-sdk';
// import keys from 'src/config/keys';
import { emptyS3Directory } from './project.helper';
@Injectable()
export class ProjectService {
  constructor(
    @InjectModel('Project') private readonly projectModel: Model<Project>,
  ) {}

  async create(
    project: CreateProjectDto,
    files: Express.Multer.File[],
  ): Promise<ICreate | IError> {
    try {
      const checked = await this.projectModel.findOne({
        title: `${project.title}`,
      });
      if (checked) {
        const errorResponse: IError = {
          status: 'Failure',
          message: 'Project title is already in use',
          requestTime: new Date().toISOString(),
        };
        return errorResponse;
      }
      const s3 = new S3({
        accessKeyId: process.env.AWS_ACESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      });
      const FORMATTED_TITLE = project.title
        .split(' ')
        .map((val) => val.charAt(0).toUpperCase() + val.slice(1))
        .join(' ');
      let FORMATTED_PROJECT = {
        ...project,
        title: FORMATTED_TITLE,
        images: [],
      };

      const dir = `Skyline/project/${FORMATTED_TITLE}`;

      files.map((el, index) => {
        const params = {
          Bucket: process.env.BUCKET_NAME,
          Key: `${dir}/${el.originalname}`,
          Body: el.buffer,
          ContentType: el.mimetype,
          ContentEncoding: el.encoding,
        };

        s3.upload(params, async (err, data) => {
          if (err) {
          } else {
            FORMATTED_PROJECT = {
              ...project,
              title: FORMATTED_TITLE,
              images: [
                ...FORMATTED_PROJECT.images,
                { src: `${dir}/${el.originalname}` },
              ],
            };
            if (index === files.length - 1) {
              const NEW_PROJECT = new this.projectModel(FORMATTED_PROJECT);
              await NEW_PROJECT.save();
              const response: ICreate = {
                status: 'Success',
                message: 'Project was created successfully',
                project: NEW_PROJECT,
                requestTime: new Date().toISOString(),
              };
              return response;
            }
          }
        });
      });
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

  async addImages(
    id: string,
    files: Express.Multer.File[],
  ): Promise<IAdd | IError> {
    try {
      if (!id) {
        const errorResponse: IError = {
          status: 'Failure',
          message: 'Project id was not found',
          requestTime: new Date().toISOString(),
        };
        throw new HttpException(errorResponse, HttpStatus.BAD_REQUEST);
      }
      const PROJECT = await this.projectModel.findById(id);
      if (!PROJECT) {
        const errorResponse: IError = {
          status: 'Failure',
          message: 'Project was not found',
          requestTime: new Date().toISOString(),
        };
        throw new HttpException(errorResponse, HttpStatus.NOT_FOUND);
      }
      const s3 = new S3({
        accessKeyId: process.env.AWS_ACESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      });
      const dir = `Skyline/project/${PROJECT.title}`;

      files.map((el, index) => {
        const params = {
          Bucket: process.env.BUCKET_NAME,
          Key: `${dir}/${el.originalname}`,
          Body: el.buffer,
          ContentType: el.mimetype,
          ContentEncoding: el.encoding,
        };

        s3.upload(params, async (err, data) => {
          if (err) {
          } else {
            await this.projectModel.findByIdAndUpdate(id, {
              $push: {
                images: {
                  src: `${dir}/${el.originalname}`,
                },
              },
            });
            if (index === files.length - 1) {
              const UPDATED_PROJECT = await this.projectModel.findById(id);
              const response: IAdd = {
                status: 'Success',
                message: 'Image were added to project successfully',
                project: UPDATED_PROJECT,
                requestTime: new Date().toISOString(),
              };
              return response;
            }
          }
        });
      });
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
  async removeImage(id: string, imageID: string): Promise<IRemove | IError> {
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
      const { images: ALL_IMAGES } = PROJECT;
      const FILTERED_IMAGES = ALL_IMAGES.filter((el) => el._id != imageID);
      const IMAGE_TO_DELETE = ALL_IMAGES.find((el) => el._id == imageID);
      await this.projectModel.findByIdAndUpdate(id, {
        $set: {
          images: FILTERED_IMAGES,
        },
      });
      const s3 = new S3({
        accessKeyId: process.env.AWS_ACESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      });
      emptyS3Directory(s3, IMAGE_TO_DELETE.src);
      const UPDATED_PROJECT = await this.projectModel.findById(id);
      const response: IRemove = {
        status: 'Success',
        message: 'Image was removed from project successfully',
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
