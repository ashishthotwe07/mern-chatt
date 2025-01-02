import bcrypt from "bcryptjs";
import User from "../models/user.model.js"; // Import the User model
import generateToken from "../libs/utils.js";
import { v2 as cloudinary } from 'cloudinary'

// Handle user signup
export const signup = async (req, res) => {
  try {
    const { fullname, email, password } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create a new user instance
    const newUser = new User({
      fullname,
      email,
      password: hashedPassword,
    });

    // Save the new user to the database
    await newUser.save();

    // Generate the JWT token and send it in the response
    const token = generateToken(newUser._id, res); // Pass only userId to generate the token

    // Send a success response with the user details (excluding the password)
    const userWithoutPassword = await User.findById(newUser._id).select(
      "-password"
    );

    res.status(201).json(userWithoutPassword);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error, please try again later" });
  }
};

// Handle user signin
export const signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Compare the entered password with the stored password
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate the JWT token and send it in the response
    const token = generateToken(user._id, res); // Pass only userId to generate the token

    // Send a success response with the user details (excluding the password)
    const userWithoutPassword = await User.findById(user._id).select(
      "-password"
    );

    res.status(200).json(userWithoutPassword);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error, please try again later" });
  }
};

// Handle user signout
export const signout = (req, res) => {
  try {
    // Clear the user's session or token from the client (optional if you're using cookies)
    res.clearCookie("jwt");

    // Send a success response indicating the user has been signed out
    res.status(200).json({ message: "Signout successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error, please try again later" });
  }
};




// Update user profile (Profile Image Only)
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id; 
    const profilePic = req.file; // File uploaded using multer

    if (!profilePic) {
      return res.status(400).json({ message: "No profile image uploaded" });
    }

    // Upload the image to Cloudinary
    const uploadResponse = await cloudinary.uploader.upload(profilePic.path, {
      folder: "user_profiles",
      public_id: `profile_${userId}`,
      overwrite: true,
    });

    // Update the user's profile image in the database
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadResponse.secure_url },
      { new: true } // Return the updated document
    ).select("-password");

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error, please try again later" });
  }
};


export const checkAuth = async (req, res) => {
  try {
    // req.user is populated by the `protectedRoute` middleware
    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Fetch user details without password
    const userDetails = await User.findById(user._id).select('-password');

    res.status(200).json(userDetails);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error, please try again later' });
  }
};

