interface Image {
  src: string;
}
export class CreateProjectDto {
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
  readonly images: Image[];
}
