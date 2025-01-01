// src/models/user.model.js

import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  profilePic: {
    type: String, 
    default: '',
  }
}, {timestamps:true});

const User = mongoose.model('User', userSchema);

export default User;
