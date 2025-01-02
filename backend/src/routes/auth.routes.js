// src/routes/auth.routes.js

import express from 'express';
import { signup, signin, signout, updateProfile, checkAuth } from '../controllers/auth.controller.js'; // Import controller actions
import { protectedRoute } from '../middlewares/auth.middleware.js';
import upload from '../libs/multer.js';

const router = express.Router();

// Define the signup route and use the signup controller action
router.post('/signup', signup);

// Define the signin route and use the signin controller action
router.post('/signin', signin);

// Define the signout route and use the signout controller action
router.post('/signout', signout);

// Define the update-profile route with a protected route middleware
router.put("/update-profile", protectedRoute, upload.single("profilePic"), updateProfile);

// Define a route to check if the user is authenticated
router.get('/check', protectedRoute, checkAuth);

export default router;
