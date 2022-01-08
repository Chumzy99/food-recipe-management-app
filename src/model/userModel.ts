import mongoose, { Schema, Document } from 'mongoose';
import validator from 'validator';

interface User extends Document {
  email: string;
  password: string;
  fullname: string;
  created_At: any;
  updated_At: any;
}

const userSchema: Schema<User> = new mongoose.Schema({
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
});

const User = mongoose.model('User', userSchema);
export default User;
