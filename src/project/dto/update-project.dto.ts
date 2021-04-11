import { PartialType } from '@nestjs/mapped-types';
import { CreateProjectDto } from './create-project.dto';

export class UpdateProjectDto extends PartialType(CreateProjectDto) {
  readonly title: string;
  readonly parkingFloor?: boolean;
  readonly groundFloor?: boolean;
  readonly basement?: boolean;
  readonly address: string;
  readonly officeArea: number;
  readonly apartmentArea: number;
  readonly electricalRoom?: boolean;
  readonly generatorRoom?: boolean;
  readonly warhouse?: boolean;
  readonly acCompressors?: boolean;
  readonly description: string;
}
