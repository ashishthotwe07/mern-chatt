import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';  // Import cookie-parser
import cors from 'cors';
import path from "path";
import authRoutes from './routes/auth.routes.js';
import messageRotues from './routes/message.routes.js';
import connectDB from './libs/db.js';
import connectCloudinary from './libs/cloudinary.js';
import { app, server } from './libs/socket.js';

dotenv.config();
const __dirname = path.resolve();
// Connect to MongoDB
connectDB();
await connectCloudinary();


app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));


// Middleware to parse cookies
app.use(cookieParser());  // This makes cookies accessible via req.cookies


app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Use the auth routes for the '/api/auth' endpoint

app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRotues);


if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

// Define the port
const PORT = process.env.PORT || 3000;

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
