import * as mongoose from 'mongoose';

export const ProjectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  parkingFloor: {
    type: Boolean,
    required: false,
  },
  groundFloor: {
    type: Boolean,
    required: false,
  },
  basement: {
    type: Boolean,
    required: false,
  },
  address: {
    type: String,
    required: true,
  },
  officeArea: {
    type: Number,
    required: false,
  },
  apartmentArea: {
    type: Number,
    required: false,
  },
  electricalRoom: {
    type: Boolean,
    required: false,
  },
  generatorRoom: {
    type: Boolean,
    required: false,
  },
  warhouse: {
    type: Boolean,
    required: false,
  },
  acCompressors: {
    type: Boolean,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  images: [
    {
      src: String,
    },
  ],
});
export const ProjectModel = mongoose.model('Project', ProjectSchema);
