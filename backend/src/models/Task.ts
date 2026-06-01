import { Schema, model, Document, Types } from 'mongoose';

export interface ITask extends Document {
  title: string;
  completed: boolean;
  userId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const taskSchema = new Schema<ITask>(
  {
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Owner userId is required'],
    },
  },
  {
    timestamps: true,
  }
);

export const Task = model<ITask>('Task', taskSchema);
