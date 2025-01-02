import User from '../models/user.model.js';
import Message from '../models/message.model.js';

export const getUsersForSidebar = async (req, res) => {
    try {
        const currentUserId = req.user._id;

        // Fetch all users excluding the current authenticated user
        const users = await User.find({ _id: { $ne: currentUserId } }).select('-password'); // Exclude the password field and the current user

        res.status(200).json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error, please try again later' });
    }
};


export const getMessages = async (req, res) => {
    try {
        const currentUserId = req.user._id;
        const { id } = req.params; // Get the receiver's user ID from the request parameters

        // Fetch the messages between the current authenticated user and the specified user (id)
        const messages = await Message.find({
            $or: [
                { senderId: currentUserId, receiverId: id },
                { senderId: id, receiverId: currentUserId }
            ]
        })

        res.status(200).json(messages);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error, please try again later' });
    }
};


export const sendMessage = async (req, res) => {
    try {
      const receiverId = req.params.id; // Get the receiver's user ID from the URL parameter
      const { text, image } = req.body; 
      const senderId = req.user._id; 
  
      if (!receiverId || (!text && !image)) {
        return res.status(400).json({ message: 'Either text or image is required' });
      }
  
      let imageUrl = null;
      if (image) {
        // Upload the image to Cloudinary
        const uploadedImage = await cloudinary.v2.uploader.upload(image, {
          folder: 'messages', 
        });
        imageUrl = uploadedImage.secure_url; 
      }
  
      // Create a new message
      const newMessage = new Message({
        senderId,
        receiverId,
        text: text || null, 
        image: imageUrl || null, 
      });
  
      // Save the message to the database
      await newMessage.save();
  
      res.status(201).json(newMessage);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error, please try again later' });
    }
  };