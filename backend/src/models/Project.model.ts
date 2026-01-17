import mongoose, { Schema, Model } from 'mongoose';
import { IProject, ProjectStatus, ProjectPriority } from '@/types';

type ProjectModel = Model<IProject>;

const projectSchema = new Schema<IProject, ProjectModel>(
  {
    name: {
      type: String,
      required: [true, 'Project name is required'],
      trim: true,
      minlength: [3, 'Project name must be at least 3 characters'],
      maxlength: [100, 'Project name cannot exceed 100 characters'],
    },
    description: {
      type:  String,
      maxlength:  [1000, 'Description cannot exceed 1000 characters'],
    },
    team: {
      type: Schema. Types.ObjectId,
      ref: 'Team',
      required: [true, 'Project must belong to a team'],
    },
    createdBy: {
      type: Schema. Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(ProjectStatus),
      default: ProjectStatus.PLANNING,
    },
    priority: {
      type: String,
      enum:  Object.values(ProjectPriority),
      default: ProjectPriority.MEDIUM,
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
  },
  {
    timestamps:  true,
    versionKey:  false,
  }
);


// INDEXES
projectSchema.index({ team: 1, status: 1 }); // Compound index
projectSchema.index({ createdBy: 1 });
projectSchema.index({ tags: 1 });
projectSchema.index({ priority: 1, status: 1 });

// VALIDATION
projectSchema.pre('save', function () {
  if (this.startDate && this.endDate && this.endDate < this.startDate) {
    throw new Error('End date cannot be before start date');
  }
});

const Project = mongoose.model<IProject, ProjectModel>('Project', projectSchema);

export default Project;