import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { UpdateProjectDto } from './dto/update-project.dto';
import { CreateProjectDto } from './dto/create-project.dto';
import {
  IAdd,
  ICreate,
  IDelete,
  IError,
  IFindAll,
  IFindOne,
  IRemove,
  IUpdate,
} from './models';
import { AuthGuard } from '@nestjs/passport';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post('/create-new-project')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FilesInterceptor('images'))
  async create(
    @Body() project: CreateProjectDto,
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<ICreate | IError> {
    return await this.projectService.create(project, files);
  }

  @Get('/getAll')
  async findAll(): Promise<IFindAll | IError> {
    return await this.projectService.findAll();
  }

  @Get('/getByID')
  @UseGuards(AuthGuard('jwt'))
  async findOneByID(@Query('id') id: string): Promise<IFindOne | IError> {
    return this.projectService.findByID(id);
  }
  @Get('/getByTitle')
  async findOneByTitle(
    @Query('title') title: string,
  ): Promise<IFindOne | IError> {
    return this.projectService.findByTitle(title);
  }
  @Patch('/updateByID')
  @UseGuards(AuthGuard('jwt'))
  async update(
    @Query('id') id: string,
    @Body() updateProjectDto: UpdateProjectDto,
  ): Promise<IUpdate | IError> {
    return this.projectService.update(id, updateProjectDto);
  }

  @Patch('/addImages')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FilesInterceptor('images'))
  async addImage(
    @Query('id') id: string,
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<IAdd | IError> {
    return this.projectService.addImages(id, files);
  }

  @Patch('/removeImage')
  @UseGuards(AuthGuard('jwt'))
  async removeImage(
    @Query('id') id: string,
    @Query('imageID')
    imageID: string,
  ): Promise<IRemove | IError> {
    return this.projectService.removeImage(id, imageID);
  }

  @Delete('/deleteByID')
  @UseGuards(AuthGuard('jwt'))
  async remove(@Query('id') id: string): Promise<IDelete | IError> {
    return this.projectService.remove(id);
  }
}
