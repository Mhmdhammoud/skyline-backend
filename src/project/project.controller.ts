import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  Query,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { UpdateProjectDto } from './dto/update-project.dto';
import { CreateProjectDto } from './dto/create-project.dto';
import {
  ICreate,
  IDelete,
  IError,
  IFindAll,
  IFindOne,
  IUpdate,
} from './models';

@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post('/create-new-project')
  async create(@Body() project: CreateProjectDto): Promise<ICreate | IError> {
    return await this.projectService.create(project);
  }

  @Get('/getAll')
  async findAll(): Promise<IFindAll | IError> {
    return await this.projectService.findAll();
  }

  @Get('/getByID')
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
  async update(
    @Query('id') id: string,
    @Body() updateProjectDto: UpdateProjectDto,
  ): Promise<IUpdate | IError> {
    return this.projectService.update(id, updateProjectDto);
  }
  @Delete('/deleteByID')
  async remove(@Query('id') id: string): Promise<IDelete | IError> {
    return this.projectService.remove(id);
  }
}
