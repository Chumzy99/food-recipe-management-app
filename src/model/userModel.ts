import mongoose, { Schema, Document } from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  email: string;
  password: string;
  fullname: string;
  created_At: any;
  updated_At: any;
  passwordChangedAt: any;
  active: boolean;

  correctPassword(candidatePassword: string, userPassword: string): boolean;
  changedPasswordAfter(JWTTimestamp: Date): boolean;
}

const userSchema: Schema<IUser> = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'A recipe must have a title'],
    trim: true,
    lowercase: true,
    unique: true,
    validate: [validator.isEmail, 'Please provide a valid email!'],
  },
  password: {
    type: String,
    required: [true, 'Password must be provided!'],
    trim: true,
    minlength: [10, 'Password must have 10 or more characters!'],
    maxlength: [40, 'Password must not exceed 40 characters!'],
    select: false,
  },
  fullname: {
    type: String,
    required: [true, 'Please provide fullname!'],
  },
  created_At: {
    type: Date,
    default: Date.now(),
  },
  updated_At: {
    type: Date,
    default: Date.now(),
  },
  passwordChangedAt: {
    type: Date,
  },
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

userSchema.pre('save', async function (this: IUser, next) {
  // run if password is actually modified;
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.pre(/^find/, function (this: any, next) {
  this.find({ active: { $ne: false } });
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword: string,
  userPassword: string
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp: any) {
  if (this.passwordChangedAt) {
    let changedTimestamp = this.passwordChangedAt.getTime() / 1000;

    changedTimestamp = parseInt(changedTimestamp.toString(), 10);

    // console.log(changedTimestamp, JWTTimestamp);
    return JWTTimestamp < changedTimestamp;
  }

  // falsle means not changed
  return false;
};

const User = mongoose.model('User', userSchema);
export default User;
