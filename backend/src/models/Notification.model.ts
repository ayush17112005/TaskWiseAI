import mongoose, { Schema, Model } from 'mongoose';
import { INotification, NotificationType } from '@/types';

type NotificationModel = Model<INotification>;

const notificationSchema = new Schema<INotification, NotificationModel>(
  {
    userId: {
      type:  Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: Object.values(NotificationType),
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Notification title is required'],
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    message: {
      type: String,
      required: [true, 'Notification message is required'],
      maxlength: [500, 'Message cannot exceed 500 characters'],
    },
    relatedTask: {
      type: Schema. Types.ObjectId,
      ref: 'Task',
    },
    relatedProject: {
      type: Schema. Types.ObjectId,
      ref: 'Project',
    },
    relatedTeam: {
      type: Schema.Types.ObjectId,
      ref: 'Team',
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    readAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);


// INDEXES
notificationSchema.index({ userId: 1, isRead: 1 });
notificationSchema.index({ userId: 1, createdAt: -1 }); // -1 = descending (newest first)


// MIDDLEWARE
// Automatically set readAt when isRead changes to true
notificationSchema.pre('save', function () {
  if (this.isModified('isRead') && this.isRead && !this.readAt) {
    this.readAt = new Date();
  }
});

const Notification = mongoose.model<INotification, NotificationModel>(
  'Notification',
  notificationSchema
);

export default Notification;