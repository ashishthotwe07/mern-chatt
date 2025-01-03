import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';  // Import cookie-parser
import cors from 'cors';  
import authRoutes from './routes/auth.routes.js';
import messageRotues from './routes/message.routes.js';
import connectDB from './libs/db.js';  
import connectCloudinary from './libs/cloudinary.js';
import { app ,server} from './libs/socket.js';

dotenv.config();



// Connect to MongoDB
connectDB();
await connectCloudinary();

// Middleware to parse JSON requests
app.use(express.json());

// Middleware to parse cookies
app.use(cookieParser());  // This makes cookies accessible via req.cookies


app.use(cors());
// Use the auth routes for the '/api/auth' endpoint

app.get('/' , (req ,res)=>{
  res.send("API IS WORKING");
})
app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRotues);

// Define the port
const PORT = process.env.PORT || 3000;

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
