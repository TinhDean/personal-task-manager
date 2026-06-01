import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
  username: string;
  passwordHash: string;
  email?: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      trim: true,
      lowercase: true,
      minlength: [3, 'Username must be at least 3 characters'],
    },
    passwordHash: {
      type: String,
      required: [true, 'Password hash is required'],
    },
    email: {
      type: String,
      unique: true,
      sparse: true, // Allows multiple null/undefined values by only indexing documents that contain the email field
      trim: true,
      lowercase: true,
    },
  },
  {
    timestamps: true,
  }
);

export const User = model<IUser>('User', userSchema);
