import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';  // Import the User model

// Middleware to check if the user is authenticated
export const protectedRoute = async (req, res, next) => {
  // Check if token is in Authorization header or cookies
  const token = req.header('Authorization')?.split(' ')[1] || req.cookies.jwt;

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    // Verify the token using the secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    if(!decoded){
        return res.status(400).json({message:"Invalid token - unauthorized"});
    }

    // Attach the user ID to the request object
    req.userId = decoded.userId;  // Attach decoded userId from the token to the request

    // Check if the user exists in the database using the userId from the token
    const user = await User.findById(req.userId).select('-password');  // Exclude the password field

    if (!user) {
      return res.status(401).json({ message: 'User not found, authorization denied' });
    }

    // Attach the entire user object (without the password) to the request object
    req.user = user;

    // User exists, proceed with the next middleware or route handler
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: 'Token is not valid' });
  }
};
