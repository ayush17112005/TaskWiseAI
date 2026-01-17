import mongoose, { Schema, Model } from 'mongoose';
import { ITask, TaskStatus, TaskPriority } from '@/types';

type TaskModel = Model<ITask>;

//Subdocument schema for comments
const commentSchema = new Schema(
  {
    userId: {
      type: Schema.Types. ObjectId,
      ref: 'User',
      required: true,
    },
    content:  {
      type: String,
      required: [true, 'Comment content is required'],
      maxlength: [500, 'Comment cannot exceed 500 characters'],
    },
    createdAt: {
      type:  Date,
      default: Date. now,
    },
  },
  { _id: true }
);

//Subdocument schema for AI suggestions
const aiSuggestionSchema = new Schema(
  {
    type: {
      type: String,
      enum: ['assignee', 'deadline', 'priority', 'breakdown'],
      required: true,
    },
    suggestion: {
      type: Schema.Types.Mixed, // Can be string or array
      required: true,
    },
    reasoning: {
      type: String,
      required: true,
    },
    confidence: {
      type: Number,
      min: 0,
      max:  1,
      required: true,
    },
    createdAt: {
      type:  Date,
      default: Date. now,
    },
  },
  { _id: true }
);

const taskSchema = new Schema<ITask, TaskModel>(
  {
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim:  true,
      minlength:  [3, 'Task title must be at least 3 characters'],
      maxlength: [200, 'Task title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    project: {
      type: Schema. Types.ObjectId,
      ref: 'Project',
      required: [true, 'Task must belong to a project'],
    },
    createdBy: {
      type:  Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    status: {
      type: String,
      enum:  Object.values(TaskStatus),
      default: TaskStatus.TODO,
    },
    priority:  {
      type: String,
      enum: Object.values(TaskPriority),
      default: TaskPriority.MEDIUM,
    },
    deadline: {
      type: Date,
    },
    estimatedHours: {
      type: Number,
      min: [0, 'Estimated hours cannot be negative'],
    },
    actualHours: {
      type:  Number,
      min: [0, 'Actual hours cannot be negative'],
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    comments: [commentSchema], //Embedded comments
    aiSuggestions:  [aiSuggestionSchema], //Embedded AI suggestions
    parentTask: {
      type: Schema.Types.ObjectId,
      ref: 'Task',
    },
    dependencies: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Task',
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// INDEXES
taskSchema.index({ project: 1, status:  1 });
taskSchema.index({ assignedTo: 1, status: 1 });
taskSchema.index({ createdBy: 1 });
taskSchema.index({ deadline: 1 });
taskSchema.index({ tags: 1 });
taskSchema.index({ priority: 1, status: 1 });


// VIRTUAL FIELDS
// Check if task is overdue
taskSchema.virtual('isOverdue').get(function () {
  if (!this.deadline) return false;
  return (
    this.deadline < new Date() &&
    this.status !== TaskStatus.COMPLETED
  );
});

// Enable virtuals
taskSchema.set('toJSON', { virtuals: true });
taskSchema.set('toObject', { virtuals: true });

const Task = mongoose.model<ITask, TaskModel>('Task', taskSchema);

export default Task;