import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  Query,
  UseGuards,
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
import { AuthGuard } from '@nestjs/passport';

@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post('/create-new-project')
  @UseGuards(AuthGuard('jwt'))
  async create(@Body() project: CreateProjectDto): Promise<ICreate | IError> {
    return await this.projectService.create(project);
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
  @Delete('/deleteByID')
  @UseGuards(AuthGuard('jwt'))
  async remove(@Query('id') id: string): Promise<IDelete | IError> {
    return this.projectService.remove(id);
  }
}
