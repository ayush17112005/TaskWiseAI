import mongoose, { Schema, Model } from 'mongoose';
import { ITeam, TeamMemberRole } from '@/types';

type TeamModel = Model<ITeam>;

const teamMemberSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    role: {
      type:  String,
      enum: Object.values(TeamMemberRole),
      required: true,
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: true } // Each member gets their own _id
);

const teamSchema = new Schema<ITeam, TeamModel>(
  {
    name: {
      type: String,
      required: [true, 'Team name is required'],
      trim: true,
      minlength: [2, 'Team name must be at least 2 characters'],
      maxlength: [100, 'Team name cannot exceed 100 characters'],
    },
    description: {
      type:  String,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    members: [teamMemberSchema], // 📚 Array of subdocuments
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    isActive: {
      type:  Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// INDEXES
teamSchema.index({ name: 1 });
teamSchema.index({ createdBy: 1 });
teamSchema.index({ 'members.userId': 1 }); // Index nested field! 


// VIRTUAL FIELDS - Computed properties
// Virtual fields are NOT stored in DB, computed on-the-fly
teamSchema.virtual('memberCount').get(function () {
  return this.members.length;
});

// Enable virtuals in JSON
teamSchema.set('toJSON', { virtuals: true });
teamSchema.set('toObject', { virtuals: true });

const Team = mongoose.model<ITeam, TeamModel>('Team', teamSchema);

export default Team;