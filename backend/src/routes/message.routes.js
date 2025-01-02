import express from 'express';
import { getMessages, getUsersForSidebar, sendMessage } from '../controllers/message.controller.js';
import { protectedRoute } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Route to get all users (accessible only to authenticated users)
router.get('/users', protectedRoute, getUsersForSidebar);


// Route to get messages between two users
router.get('/:id', protectedRoute, getMessages);


// Route to send a new message to a specific user
router.post('/send/:id', protectedRoute, sendMessage);


export default router;
