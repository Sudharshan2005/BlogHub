import mongoose, { Document, Model, Schema } from 'mongoose';
import bcrypt from "bcrypt"

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    validate: {
      validator: function(this: any): boolean {
        return !!this.googleId || !!this.githubId || !!this.password;
      },
      message: 'Password is required unless using Google or GitHub authentication.'
    },
    minlength: 6
  },
  avatar: {
    type: String,
    default: ''
  },
  bio: {
    type: String,
    maxlength: 500,
    default: ''
  },
  googleId: String,
  githubId: String,
  isVerified: {
    type: Boolean,
    default: false
  },
  followers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  following: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  bookmarks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Blog'
  }]
}, {
  timestamps: true
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  if (!this.password) {
    throw new Error('Password is undefined or null');
  }
  const hashedPassword = await bcrypt.hash(this.password, 12);
  this.password = hashedPassword;
  next();
});

// Compare password method
interface IUser extends Document {
    name: string;
    email: string;
    password?: string;
    avatar: string;
    bio: string;
    googleId?: string;
    githubId?: string;
    isVerified: boolean;
    followers: mongoose.Types.ObjectId[];
    following: mongoose.Types.ObjectId[];
    bookmarks: mongoose.Types.ObjectId[];
    comparePassword(candidatePassword: string): Promise<boolean>;
}

userSchema.methods.comparePassword = async function (this: IUser, candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password || '');
};

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', userSchema);

export default User;