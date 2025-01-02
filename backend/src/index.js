import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';  // Import cookie-parser
import authRoutes from './routes/auth.routes.js';
import connectDB from './libs/db.js';  // Import the database connection
import connectCloudinary from './libs/cloudinary.js';

dotenv.config();

// Create an Express app
const app = express();

// Connect to MongoDB
connectDB();
await connectCloudinary();

// Middleware to parse JSON requests
app.use(express.json());

// Middleware to parse cookies
app.use(cookieParser());  // This makes cookies accessible via req.cookies

// Use the auth routes for the '/api/auth' endpoint
app.use('/api/auth', authRoutes);

// Define the port
const PORT = process.env.PORT || 3000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
