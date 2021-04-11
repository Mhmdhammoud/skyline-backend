import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
      required: false,
      default:
        'https://muallemy-storage.s3.eu-central-1.amazonaws.com/john-doe-avatar.png',
    },
  },
  { timestamps: true },
);
export const UserModel = mongoose.model('User', UserSchema);
