import { Document } from 'mongoose';
interface Image {
  _id?: string;
  src: string;
}
export interface Project extends Document {
  title: string;
  parkingFloor?: boolean;
  groundFloor?: boolean;
  basement?: boolean;
  address: string;
  officeArea: number;
  apartmentArea: number;
  electricalRoom?: boolean;
  generatorRoom?: boolean;
  warhouse?: boolean;
  acCompressors?: boolean;
  description: string;
  images: Image[];
}
