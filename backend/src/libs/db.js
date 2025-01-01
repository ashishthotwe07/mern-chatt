// src/db.js

import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from the .env file

// Get the MongoDB URI from the environment variable
const mongoURI = process.env.MONGODB_URI;

const connectDB = async () => {
  try {
    // Connect to MongoDB using the URI from MONGODB_URI
    await mongoose.connect(mongoURI);

    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1); // Exit the process with failure
  }
};

export default connectDB;
