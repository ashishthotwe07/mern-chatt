import jwt from 'jsonwebtoken';

// Function to generate JWT token and send it in the response
const generateToken = (userId, res) => {
  try {
    // Generate a token with just the userId as payload
    const token = jwt.sign(
      { userId },  // Only include userId in the payload
      process.env.JWT_SECRET_KEY,
      { expiresIn: '7d' } 
    );

    res.cookie('jwt', token, { httpOnly: true, secure: true, maxAge: 3600000 }); 
    return token;
   
  } catch (error) {
    throw new Error('Error generating token');
  }
};

export default generateToken;
