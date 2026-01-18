import mongoose, { Schema, Model } from 'mongoose';
import bcrypt from 'bcryptjs';
import { IUser, UserRole } from '@/types';

interface IUserMethods {
  comparePassword(candidatePassword: string): Promise<boolean>;
  toJSON(): Partial<IUser>; // Remove password when converting to JSON
}

// Combine IUser interface with methods
type UserModel = Model<IUser, {}, IUserMethods>;

//Schema defines the structure in MongoDB
const userSchema = new Schema<IUser, UserModel, IUserMethods>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    email: {
      type: String,
      required:  [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email',
      ],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // 📚 Don't return password by default in queries
    },
    role: {
      type: String,
      enum: Object.values(UserRole), // 📚 Only allow values from UserRole enum
      default: UserRole.MEMBER,
    },
    avatar: {
      type: String,
      default: '',
    },
    teams: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Team', // 📚 Reference to Team model (we'll create this next)
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
    },
  },
  {
    timestamps: true, // 📚 Automatically adds createdAt and updatedAt! 
    versionKey: false, // Remove __v field
  }
);

// INDEXES - For faster queries
userSchema.index({ email: 1 }); // 1 = ascending order
userSchema.index({ teams: 1 });
userSchema.index({ isActive: 1 });


// MIDDLEWARE - Runs automatically on certain actions
// Hash password BEFORE saving to database
userSchema.pre('save', async function () {
  // Only hash if password is modified
  if (!this.isModified('password')) {
    return;
  }

  // Hash password with bcrypt (10 rounds of salting)
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// ============================================
// METHODS - Functions available on user documents
// ============================================

//Compare plain password with hashed password
userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    return false;
  }
};

// Override toJSON to remove password from responses
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

// ============================================
// CREATE AND EXPORT MODEL
// ============================================

const User = mongoose.model<IUser, UserModel>('User', userSchema);

export default User;